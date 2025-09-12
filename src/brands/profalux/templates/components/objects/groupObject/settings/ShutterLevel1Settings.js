import '_brand/templates/components/objects/common/locales'
import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useObject } from '_hooks/object';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';

import ScreenContainer from './ScreenContainer';
import Button from '_brand/templates/components/ui/Button';
import { RenameObject } from '_brand/templates/components/objects/common/RenameObject';
import { RoomSelection } from '_brand/templates/components/objects/common/RoomSelection';
import { getRooms, getRoomById} from '_helpers/selectors';
import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';
import {getObjectsByTypes} from '_helpers/selectors';
import {updateObjectRoom} from '_api/objects'



export const ShutterLevel1Settings = () => {

    // Recover props: typeName and itemId from navigation params
    const renameRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const {theme} = useTheme();  
    const navigationParams = route?.params || {}; 
    const { typeName, itemId } = navigationParams;
    console.log("NAVIGATION PARAMS :", typeName, itemId);

    const { t, i18n } = useTranslation();
    const tns = "gate";

    const textColor = theme?.prflxTextColor||'black'

    // Get Shutter Object
    const shutterObjectAllInfos = useObject(itemId);


        //-----------Get existing Shutter goups dependencies------------------
        const getObjectDependenciesGroup = (uObject) => {
            const dependencies = uObject?.widgetReferenceDatas?.rdependencies['groups'|| []];
            if (!dependencies?.length) return [];
            const groupIds = dependencies.reduce((r, v, i) => {
              const id = (v.uri + "").split("/").pop();
              r.push(id);
              return r
            }, [])
            return groupIds
          }
        
          const [shutterDependencies, setShutterDependencies] = useState(getObjectDependenciesGroup(shutterObjectAllInfos));
          useEffect(() => {
       
          },[shutterDependencies]);


    //-----------------Get existing goups-----------------------------
    const groupsVisible = useSelector(getObjectsByTypes)["Composite"];

    // Get ROOMS FROM STORE
    const [room, setRoom] = useState("");
    const [currentObjectRoomId, setCurrentObjectRoomId] = useState(shutterObjectAllInfos.objectDatas.room);
    const [currentRoom, setCurrentRoom] = useState( useSelector(state => getRoomById(state, Number(currentObjectRoomId))) );
    const data = [];
    const roomData = useSelector(getRooms);
    roomData.map((item) => {
        data.push({ key: item.id, value: item.name });
    })

    useEffect(() => {
    },[currentObjectRoomId, currentRoom, room]);
    //-------------------------------------------------------------






    const submitMe = (values) => {
        console.log("ROMS :", room)
        renameRef.current.submitForm();
        updateRoom(itemId, room);
        navigation.navigate('ProductDetails', { 'typeName': shutterObjectAllInfos?.objectDatas?.typeName, itemId: itemId });
    }

    const giveName = async (value) => {
        if (shutterObjectAllInfos.rename) {
            await shutterObjectAllInfos.rename(value);
        }
        // 
    }
    const updateRoom = async (objectId, newRoomId) => {
        console.log("Sent")
        await updateObjectRoom(objectId, newRoomId).catch((err) => console.log(err));
    }

    const handleSubmit = (values) => {
        console.log("Hello Rename me", values.rename)
        giveName(values.rename);
    }


    const handleReceiveDependencies = (rdeps)=>{
        console.log("These are dependencies to be submitted :", rdeps);
    }


    return (
        <ScreenContainer headerTitle={shutterObjectAllInfos.name}>
             <View style={styles.bodyContent}>
                <RenameObject
                    ref={renameRef}
                    renameText={t(tns+":"+"RENAME_OBJECT_PLACE_HOLDER")}
                    handleSubmit={handleSubmit}
                />

                <RoomSelection
                    title={t(tns+":"+"SELECT_ROOM_PLACE_HOLDER")}
                    options={data}
                    setSelected={setRoom}
                    placeholder={t(tns+":"+"SELECT_ROOM_PLACE_HOLDER")}
                    defaultOption={currentRoom}
                />
                <Text style={[styles.text,{color:textColor}]}>{t(tns+":"+"SELECT_GROUP")}</Text>
                <View style={[styles.containerWrapper, { flexDirection: 'row', justifyContent: 'space-around' }]}>
                    <RenderToogleFlatList 
                        isRedirectOnSelect = {false}
                        objectId={itemId}
                        allPossibleDependencies = {groupsVisible}
                        callBack ={handleReceiveDependencies}
                        objectDependencies = {shutterDependencies}
                        bgColor = "blue"
                        iconColor = "white"
                        />
                </View>

                <View style={styles.validateButton}>
                    <Button onPress={submitMe} altStyle title={t(tns+":"+"VALIDATE_MODIF")} bgColor='#34ee0f' noBorder />
                </View>

            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    containerWrapper: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#c0b8b8',
        marginVertical: 20
    },
    inPutField: {
        backgroundColor: 'white',
        borderRadius: 22,
        height: 45,
        width: '90%'
    },
    validateButton: {
        borderRadius: 20,
        height: 40,
        marginBottom: 10
    },
    text: {
        fontSize: 20,
        color: 'white'
    },
    bodyWrapper:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#d5e0e4',
        padding:10,
      },
      bodyContent:{
        flex:1,
        justifyContent:'space-evenly',
        padding:10,
        borderColor:'orange',
        borderWidth:2,
        borderRadius:10,
        backgroundColor:'#87bc87'
      }
})

