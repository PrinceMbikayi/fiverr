import '_brand/templates/screens/wellcomeTour/locales'
import React, {useRef, useState, useEffect} from 'react';
import { Text, View,StyleSheet } from 'react-native';
import { useSelector,useDispatch, useStore } from 'react-redux';
import { useTheme } from '_theming/themeProvider';
import { SelectList } from 'react-native-dropdown-select-list'
import { TextForm } from '_brand/templates/screens/wellcomeTour/components/TextForm';
import { useObject } from '_hooks/object';
import { useTranslation } from 'react-i18next';
import { EquipmentCard } from './EquipmentCard';
import {getObjectsByTypes} from '_helpers/selectors';
import { getRooms, getRoomById} from '_helpers/selectors';
import {getObjectById} from '_helpers/objects';

/**
* return a useful multiline component
* @param {Object} props
* @param {Object} props.options liste of key-value pair options objects for selection 
* @param {string} props.title
* @param {string} props.placeholder
* @param {Object} props.defaultOption
* @param {state} props.setSelected set a selected state value
* @param {function} props.callback
* 
*/
export const LocalizeEquipment = (props) => {

    const {itemId, placeholder, defaultOption, options, setSelected } = props;



    const uObject = useObject(itemId);
    const renameRef = useRef(null);
    const name = uObject?.name

    const { t, i18n } = useTranslation();
    const tns = "wellcomeTour";
    const { theme } = useTheme();

    const borderColor = theme?.prflxBorderColor || 'orange';
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";

    console.log('UOBJECT :', uObject);


    // Get ROOMS FROM STORE
    const [room, setRoom] = useState("");
    const [currentObjectRoomId, setCurrentObjectRoomId] = useState(uObject?.objectDatas?.room);
    const data = [];
    const roomData = useSelector(getRooms);
    roomData.map((item) => {
        data.push({ key: item.id, value: item.name });
    })

    const currentRoom =  useSelector(state => getRoomById(state, Number(currentObjectRoomId)));
    useEffect(() => {
        console.log("DATA ++:", roomData, currentRoom)
    },[currentObjectRoomId, room]);
    //-------------------------------------------------------------





    const handleSubmit = (value)=>{
        console.log('Hello form :', value);
    }

    const handlePressCard = ()=>{
        console.log('Card Pressed !');
    }


    return (

        <View style={{flexDirection:"row",width:'90%', flex:1,marginTop:10, backgroundColor:'red', justifyContent:'space-between'}}>
                <View >
                    <EquipmentCard 
                        itemId = {itemId}
                        iconSize={35}
                        iconColor={containerbgcolor}
                        bgColor={textColor}
                        callBack={handlePressCard}
                    /> 
                </View>

                <View style={{width:254}}>

                    <TextForm
                        ref={renameRef}
                        renameText={`${t(tns + ":" + "NAME_SCENARIO")}`}
                        handleSubmit={handleSubmit}
                        oldName={name}
                    />
                    <View>
                        <SelectList
                            search={false}
                            setSelected={setRoom}
                            data={data}
                            boxStyles ={{backgroundColor:'#EDEDED', borderRadius:12, height:44, width:254}}
                            dropdownStyles = {{backgroundColor:'#EDEDED', borderRadius:12, width:254}}
                            //dropdownItemStyles = {{backgroundColor:'red'}}
                            placeholder={''} //{t(tns+":"+"SELECT_ROOM_PLACE_HOLDER")}
                            defaultOption={currentRoom}
                        />
                    </View>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    renameContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-evenly',
        padding: 0,
        borderRadius: 12
    },
    text: {
        fontSize: 14,
        color: '#3E495E',
        marginBottom: 15,
        fontWeight:'600'
    },
    validateButton: {
        borderRadius: 20,
        height: 40,
        width: '90%',
        marginBottom: 10
    },
})