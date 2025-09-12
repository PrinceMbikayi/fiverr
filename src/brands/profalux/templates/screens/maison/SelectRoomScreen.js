import '_brand/templates/screens/maison/locales'
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Text, FlatList, View, Pressable, Dimensions } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'

import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import Toast from 'react-native-root-toast';
import { getRooms } from '_helpers/selectors';
import { roomUpdate, roomDelete } from '_actions/rooms';
import { getObjectsByTypes, } from '_helpers/selectors';
import ScreenContainer from '_brand/templates/screens/maison/components/ScreenContainer'
import { getRoomById } from '_helpers/objects';
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'




const { width } = Dimensions.get('window')

export const SelectRoomScreen = (props) => {

    const globalModal = useGlobalModal(); 
    const { t, i18n } = useTranslation();
    const tns = "maison";
    const { theme } = useTheme();
    const dispatch = useDispatch();

    const [selectedRoom, setSelectedRoom] = useState()


    const roomDataRedux = useSelector(getRooms);

    const defaultRoomRef = useRef({})
    const actionSheetRef = useRef(null);
    const roomToDeleteRef = useRef(null);

    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {};

    const { gotask } = navParams;

    const borderColor = theme?.prflxBorderColor || 'orange';
    const textColor = theme?.prflxTextColor || 'black';


    let rooms = [];
    roomDataRedux.map(room => {
        const isDefaultroom = room?.default // boolean type
        if (!isDefaultroom) {
            rooms.push(room)
        }else{
            defaultRoomRef.current = room
            console.log('DEFAULT_ROOM :', defaultRoomRef.current);
        }
    })
    let roomData = (rooms.length % 3 != 2) ? rooms : [...rooms, 'extra'];

    useEffect(() => {
        const identifyRoom = getRoomById(selectedRoom);
    }, [selectedRoom]);

    const handleRoomSelection = (roomId, roomName, roomObjects) => {
        console.log("SELECTED_ROOM :", roomId, roomName, roomObjects)
        console.log("Id :", roomId + ",", "Name :", roomName + ',', "Objects :", roomObjects)
        setSelectedRoom(roomId);
        roomToDeleteRef.current = roomId;
        (gotask === 'delete') ? kebabDeleteAction() : navigation.navigate('ModifyRoomScreen', { roomId, roomName, roomObjects });
    }

    const kebabDeleteAction = () => {
        //actionSheetRef.current?.present()
        onOpenSelect()
    }


    const onCancelPressed = () => {
        console.log('CANCEL_DELETE :');
        globalModal.close();
      }
    
      const onOpenSelect = () => {  
          const content = (
            <View style={{width:'100%', height: 200}}>
              <CommonBottomSheetDeleteContent 
                  nameToDelete={`${t(tns+":"+"THIS_ROOM")}`} 
                  warningText={`${t(tns+":"+"WARNING_DELETE")}`}
                  textColor={textColor} 
                  onDelete={handleDelete} 
                  onCancel={onCancelPressed} 
              />
            </View>
                )
          globalModal.setContent(content,{type:'bottom'});    
          globalModal.toggle();
      }
    const handleCancel = () => {
        actionSheetRef.current?.dismiss();
        navigation.navigate('MaisonScreen')
    }


    const handleDelete = async () => {
        console.log("RES DELETE :", roomToDeleteRef.current)
        globalModal.close();
        const identifyRoom = getRoomById(roomToDeleteRef.current);
        const roomObjects = identifyRoom.objects;
        const defaultRoom = defaultRoomRef.current;
        console.log("RES DELETE 2:")
        
        // Action for sending deleted room objects to Default Room. 
        //Not that the request to server is not needed :  the back side deals with this objects transfered.
        const updateDefaultRoomAction = roomUpdate({ ...defaultRoom, objects: [...new Set([...defaultRoom.objects, ...roomObjects])] })
        
        console.log("RES DELETE 3:")
        if (identifyRoom.default == true) {
            Toast.show(
                `${t(tns + ":" + "CANNOT_DELETE_DEFAULT_ROOM")}`,
                {
                    backgroundColor: 'red',
                    textColor: 'white',
                    textStyle: { fontSize: 16, fontWeight: '600' },
                    position: Toast.positions.CENTER,
                    duration: 3000,
                }
            );
        } else {

            const res = await deleteObject(roomToDeleteRef.current, 'room').catch((err) => { console.log(err) });
            console.log("RES DELETE 4:", res)

            if (res.errCode == 200) {
                const action = roomDelete(roomToDeleteRef.current);
                Toast.show(
                    `${t(tns + ":" + "ROOM_DELETED")}`,
                    {
                        backgroundColor: 'black',
                        textColor: 'white',
                        textStyle: { fontSize: 16, fontWeight: '600' },
                        containerStyle: { width: '80%', height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: borderColor, borderWidth: 2 },
                        position: -350,
                        duration: 3000,
                    }
                );

                dispatch(action);
                dispatch(updateDefaultRoomAction);
                navigation.navigate('MaisonScreen')
            }

            //actionSheetRef.current?.dismiss();

        }
    }




    const RenderItem = ({ item, index, rooms }) => {

        if (item == 'extra') return <View style={{ width: width * 0.3, height: width * 0.3, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }} />;
        let content;

        const roomId = item?.id;
        const roomName = item?.name;
        const roomObjects = item?.objects

            content = (
                <Pressable
                    key={roomId}
                    onPress={() => handleRoomSelection(roomId, roomName, roomObjects)}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }}
                >
                    <View style={{ width: width * 0.3, height: width * 0.3, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', flexWrap: "nowrap" }}>{roomName}</Text>
                    </View>
                </Pressable>
            )

        return <View style={{ flex: 1, justifyContent: 'center' }}>{content}</View>
    }

    return (
        <ScreenContainer headerTitle={t(tns + ":" + "HOUSE")}>
            <View style={{ flex: 3, width: width, padding: 10, backgroundColor: 'transparent', justifyContent: 'center' }}>
                <View style={{ paddingVertical: 10 }}>
                    {gotask == 'modify' &&
                        <Text>{t(tns + ":" + "SELECT_ROOM_MODIFY")}</Text>
                    }
                    {gotask == 'delete' &&
                        <Text>{t(tns + ":" + "SELECT_ROOM_DELETE")}</Text>
                    }
                </View>
                <FlatList
                    data={roomData}
                    renderItem={
                        ({ item, index }) => <RenderItem
                            item={item}
                            index={index}
                            rooms={roomData}
                        />
                    }
                    keyExtractor={(item, index) => "key_" + item}
                    numColumns={3}
                />
            </View>
            {/* <BottomDeleteSheet
                myRef={actionSheetRef}
                handleCancel={handleCancel}
                handleDelete={handleDelete}
            /> */}
        </ScreenContainer>

    )
};