import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';


import { useTheme } from '_theming/themeProvider'
import { HeaderWithMenu } from '_components/headers/header-with-menu';
import { MaisonSimpleList } from '_brand/templates/screens/maison/components/MaisonSimpleList';
import { getOrderedList, setOrderedList } from '_services/storage';
import { getObjectsVisible, getObjectsByTypes } from '_helpers/selectors';
import { getRooms } from '_helpers/selectors';
import { getRooms as getRoomsApi} from '_api/Api';
import { getObjectById } from '_helpers/objects';
import { alphabeticSort } from '_brand/utils/alphabeticSort';

export const MaisonContentRender = (props) => {

    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {};
    const textColor = theme?.prflxTextColor || 'black'

    const [roomList, setRoomList] = useState([]);
    const roomData = useSelector(getRooms) || [];

    const FILTER_CLASS_NAME = ["Shutter", "Light", "Sonde", "GarageDoor", "ToggleGarageDoor", "Gate", "ToggleGate", "TriggerGate"]//"Application", "Scenario"


    useEffect(()=> {
        console.log('GET_ROOMS_API :');
        getRoomsApi();
    },[]);


    const filterRoomObjects = (rooms)=>{
        console.log('RENDER_FILTER_ROOMS :');
        let defaultRoom;
       const myRooms =  rooms.reduce((accumulator, room, index)=>{
            const isDefault = room?.default;
            const roomObjects = room?.objects
            if(isDefault == false){
                const lstObjects = roomObjects.map(Number)
                const entity = { roomId:room?.id, roomName:room?.name, roomObjects:alphabeticSort(lstObjects), default:room?.default }
                accumulator.push(entity)
            }else{
                let lstObjects = [];
                roomObjects.map( item =>{
                    const id = Number(item)
                    objData = getObjectById(id)
                    const objClassName = objData?.className;
                    if(FILTER_CLASS_NAME.includes(objClassName)) lstObjects.push(id) ;
                })
                
                defaultRoom = { roomId: room?.id, roomName: room?.name, roomObjects: alphabeticSort(lstObjects), default:room?.default }
            }
            return accumulator
        }, [])

        return [...myRooms, defaultRoom] // Default room to be the last
    }

    useEffect(() => {
        const myRooms = filterRoomObjects(roomData)
        setRoomList(myRooms)
    }, [roomData])


    useEffect(() => {
        console.log("Room List :", roomList)

    }, [roomList]);



    const accessibilityLabel = "Screen_DASHBOARD";

    return (
        <View style={{ paddingVertical: 15 }}>
            {roomList.map((item, index) => {
                console.log('ROOM_LIST :', roomList);
                console.log('ROOM_OBJECTS :', item?.roomObjects);
                if(item != undefined){
                    return (
                        <View key={index} style={{ marginBottom: 0 }}>
    
                            {item?.roomObjects !=0 &&
                                <Text style={{fontSize:22,color:textColor, fontWeight:'600', marginTop:10}}>{item?.roomName}</Text>
                            } 
                            <MaisonSimpleList source={item?.roomObjects}/>
                        </View>
                    )

                }
            })

            }
        </View>

    )
};