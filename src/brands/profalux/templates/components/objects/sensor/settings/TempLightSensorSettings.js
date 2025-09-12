import '_brand/templates/components/objects/common/locales'
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useObject } from '_hooks/object';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider';
import ScreenContainer from './ScreenContainer';

import Button from '_brand/templates/components/ui/Button';
import { RenameObject } from '_brand/templates/components/objects/common/RenameObject';
import { RoomSelection } from '_brand/templates/components/objects/common/RoomSelection';
import { getRooms, getRoomById } from '_helpers/selectors';
import { getObjectsByTypes, getObjectById } from '_helpers/selectors';
import { updateObjectRoom } from '_api/objects'
import * as Actions from '_actions/objects';
import { Api } from '_api';
import {appRefresh,closeWS} from '_actions/app';
import { myToast } from '_brand/templates/components/ui/myToast';



export const TempLightSensorSettings = (props) => {
    const { newAddedItemId } = props;
    // Recover props: typeName and itemId from navigation params
    const renameRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();

    const { t, i18n } = useTranslation();
    const tns = "common";

    const [lstGroup, setLstGroup] = useState([]);

    const dispatch = useDispatch();
    const navigationParams = route?.params || {};
    const { typeName, itemId } = navigationParams;
    console.log("NAVIGATION PARAMS :", typeName, itemId);

    // Get Shutter Object
    const uObject = useObject(newAddedItemId || itemId);
    console.log("NEW OBJECT  ITEM ID : ", uObject);
    const oldName = uObject?.name;

    const theme = useTheme();

    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const containerBgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";




    useEffect(() => {
        console.log("SEE LST GROUPO :", lstGroup)

    }, [lstGroup])



    //    -----------Get existing Shutter goups dependencies------------------
    const getObjectDependenciesGroup = (uObject) => {
        console.log("HERE")
        const dependencies = uObject?.widgetReferenceDatas?.rdependencies?.['groups'];
        if (!dependencies?.length) return [];
        const groupIds = dependencies?.reduce((r, v, i) => {
            const id = (v.uri + "").split("/").pop();
            r.push(id);
            return r
        }, [])
        return groupIds
    }

    const [shutterDependencies, setShutterDependencies] = useState(getObjectDependenciesGroup(uObject));

    useEffect(() => {
        const rdeps = getObjectDependenciesGroup(uObject);
        setShutterDependencies(rdeps)
    }, [uObject?.widgetReferenceDatas?.rdependencies])

    useEffect(() => {

    }, [shutterDependencies]);


    //-----------------Get existing goups-----------------------------
    const groupsVisible = useSelector(getObjectsByTypes)["Composite"] || [];

    // Get ROOMS FROM STORE
    const [room, setRoom] = useState("");
    const [currentObjectRoomId, setCurrentObjectRoomId] = useState(uObject?.objectDatas?.room);
    const data = [];
    const roomData = useSelector(getRooms);
    roomData.map((item) => {
        data.push({ key: item.id, value: item.name });
    })

    const currentRoom = useSelector(state => getRoomById(state, Number(currentObjectRoomId)));
    useEffect(() => {
        console.log("DATA :", data)
    }, [currentObjectRoomId, room]);
    //-------------------------------------------------------------








    const submitMe = (values) => {
        console.log("ROMS :", room)
        renameRef.current.submitForm();
        navigation.navigate('ProductDetails', { 'typeName': uObject?.objectDatas?.typeName, itemId: itemId });
    }



    const handleSubmit = async (values) => {

        const renameResponse = await uObject.rename(values.rename).catch((err) => console.log(err));
        console.log("Rename_CAPTEUR", renameResponse)

        if(renameResponse?.errCode == 200){
            const action1 = Actions.objectUpdateProperty(itemId, 'name', values.rename);
            dispatch(action1);
            const res2 = await updateObjectRoom(itemId, room).catch((err) => console.log(err));
            console.log("Update Room Async worked", res2);
            if(res2.errCode == 200){
                const action2 = Actions.objectUpdateProperty(itemId, 'room', room);
                console.log("UPDATE ROOM ID :", room)
                dispatch(action2);
                dispatch(appRefresh())
            }

        }else{
            let message;
            const errMsg =  renameResponse?.errMsg
            const errCode =  renameResponse?.errCode
            if(errMsg == "object_exists"){
                message =`${t(tns + ":" + "OBJECT_EXISTS")}`                                 
            }else{
                message =`${t(tns + ":" + "SERVER_ERROR")} : ${renameResponse?.errCode} ${renameResponse?.errMsg}`
            }
            myToast(message)
            console.log('ERROR_CODE_MODIFY_OBJECT :', renameResponse?.errCode);
        }

    }




    return (
        <ScreenContainer headerTitle={uObject.name}>
            <View style={styles.bodyContent}>
                <RenameObject
                    ref={renameRef}
                    oldName={oldName}
                    renameText={`${t(tns + ":" + "RENAME_EQUIP")}`}
                    handleSubmit={handleSubmit}
                />

                <RoomSelection
                    title={`${t(tns + ":" + "EQUIP_ROOM")}`}
                    options={data}
                    setSelected={setRoom}
                    placeholder={`${t(tns + ":" + "SELECT_EQUIP")}`}
                    defaultOption={currentRoom}
                />

                <View style={styles.validateButton}>
                    <Button onPress={submitMe} altStyle title={`${t(tns + ":" + "VALIDATE_MODIF")}`} titleColor="#FFFFFF" bgColor="#3E495E" noBorder />
                </View>
                {/* <View style={styles.validateButton}>
                    <Button onPress={testSelector} altStyle title='Go' titleColor="#FFFFFF" bgColor="#3E495E" noBorder />
                </View> */}

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
        //padding: 10,
        backgroundColor: 'transparent',
        marginVertical: 27
    },
    inPutField: {
        backgroundColor: 'white',
        borderRadius: 22,
        height: 45,
        width: '90%'
    },
    validateButton: {
        color: "#FFFFFF",
        borderRadius: 0,
        height: 40,
        marginBottom: 10,
        marginTop: 50
    },
    text: {
        marginTop: 23,
        fontWeight: '600',
        fontSize: 14,
        color: '#3E495E'
    },
    bodyWrapper: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#d5e0e4',
        padding: 10,
    },
    bodyContent: {
        flex: 1,
        justifyContent: 'space-evenly',
        padding: 10,
        marginTop:20,
        borderColor: 'orange',
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: '#FFFFFF'
    }
})

