import '_brand/templates/components/objects/common/locales'
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { View, Text, Pressable, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '_theming/themeProvider';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { getObjectById } from '_helpers/objects';
import { RoutineWidgetIcon } from '_brand/templates/components/objects/common/RoutineWidgetIcon';

/**
 * This component render an svg icon that has been converted to JS component
 * 
 * @param {Object} props
 * @param {Array} props.icons list of icons object [{id, name}]
 * @param {string} props.iconColor icon color, default is icon theme color 
 * @param {number} props.iconSize icon square size, default 40
 * @param {object} props.iconWrapperStyle icon wrapper style object
 * @param {object} props.iconGroupWrapperStyle icons group wrapper style  
 * @param {Function} props.onPress callback function when icon is pressed : send icon id
 * @param {boolean} props.isPressable is it a button or just an icon?
 * @param {boolean} props.isShadow  add shadow to iconWrapperStyle
 */
export const RoutineWidgetLine = (props) => {

    const { activeAction, itemId, icons, iconColor, iconBgColor, iconSize, iconWrapperStyle, iconGroupWrapperStyle, onPress, onLongPress, isPressable = true, isShadow = false, callBackForPlugLight } = props;

    const uScenario = useScenario();
    const { updateActions, actionsByItemId, icon, selectedAction } = uScenario;
    const myIcon = icon

    const objectData = getObjectById(itemId);
   
    const className = objectData?.className
    const typeName = objectData?.typeName
    const uniType = objectData?.uniType

    console.log('TOGGLE_TYPENAME :', uniType);


    const [isEnabled, setIsEnabled] = useState(false);
    const [isSwitch, setIsSwitch] = useState(false);



    console.log("objectData :", objectData)


    const objectKeyPrefix = "myActions"
    const myKey = objectKeyPrefix + "_" + itemId;
    const myActions = actionsByItemId?.[myKey] || []

    useEffect(() => {
        console.log("ROUTINE WIDGET:", itemId, myActions)

    }, [myActions]);

    useEffect(() => {
    }, [isEnabled]);


    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const tns = "common";


    const handlePress = (id) => {
        onPress(id);
        console.log("ROUTINE_ICON_ACTION_PRESSED :", id)
        const actionArr = id.split("/");
        let action;
        actionArr.length == 1 ? action = id + "/" + id : action = id
        console.log("Actionkkkk: ", actionArr)
        updateActions(action)
    }

    const handleLongPress = (id) => {
        onLongPress(id)
    }


    const handleActionPress = () => {
        const action = "ACTION/ACTION/" + itemId
        console.log("TOGGLE GATE ACTION :", action)
        updateActions(action)
    }

    const borderColor = theme?.prflxBorderColor || 'orange';
    const iconthemeColor = theme?.prflxIconColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'
    const iconthemebgColor = 'white';
    const shadow = {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        elevation: 4,
        shadowColor: '#000000',
    }

    const LIGHT_SWITCH = ["LightEzsp", "SwitchEzsp"]
    const TOGGLE_OPTION = ["Garage_Door_Toggle_Ezsp", "Gate_Toggle_Ezsp"]


    let content;

    if (LIGHT_SWITCH.includes(uniType) || LIGHT_SWITCH.includes(typeName)) {
        content = (
            <View style={[iconGroupWrapperStyle || { flexDirection: 'row', backgroundColor: 'transparent'}]}>
                {
                    icons.map((icon) => {
                        const idForTest = icon.id + "/" + itemId;
                        console.log("ID for Test:", idForTest);
                        const isActive = myActions.indexOf(idForTest) != -1

                        return (
                                <Pressable
                                    //id={itemId}
                                    //disabled={isPressable ? false : true}
                                    key={icon.id}
                                    onPress={() => handlePress(icon.id + "/" + itemId)}
                                    onLongPress={() => handleLongPress(icon.id)}
                                    style={[
                                        isShadow ? shadow : {},
                                        //iconWrapperStyle,
                                        {
                                            
                                            backgroundColor: iconthemebgColor,
                                            borderColor: isActive ? 'orange' : 'transparent',
                                            // borderWidth: isActive ? 2 : 0,
                                            marginLeft:5,
                                            borderRadius:8,
                                            backgroundColor:'transparent'
                                        }
                                    ]}
                                >
                                    <View style={{width: iconSize || 40, height: iconSize || 40, justifyContent:'center'}}>
                                        <icon.name color={isActive ? 'orange':textColor}/>
                                    </View>

                                </Pressable>
                        );
                    })
                }
            </View>
        )
    } else if (TOGGLE_OPTION.includes(uniType) || TOGGLE_OPTION.includes(typeName)) {
        
        const idForTest = "ACTION/ACTION/" + itemId;
        const isActive = myActions.indexOf(idForTest) != -1
        content = (
            <Pressable
                onPress={handleActionPress}
                style={{
                    width: 107, height: 40, borderColor: '#3E495E', borderWidth: 0.3, borderRadius: 7,
                    justifyContent: 'center', alignItems: 'center', marginBottom: 8, marginTop: 5,
                    backgroundColor: 'white',
                    //backgroundColor:actionActive?textColor:'white',
                    borderColor: isActive ? 'orange' : 'transparent',
                    borderWidth: isActive ? 2 : 0,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    elevation: 10,
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: '600', color: isActive ? 'orange' : textColor }}>{t(tns + ":" + "GARAGE_DOOR_ACTION")}</Text>
            </Pressable>
        )
    } else {
        content = (

            <View style={[iconGroupWrapperStyle || { flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'space-evenly', alignItems: 'center' }]}>
                {
                    icons.map((icon, index) => {
                        const idForTest = icon.id + "/" + itemId;
                        console.log("ID for Test:", icons, idForTest);
                        const isActive = myActions.indexOf(idForTest) != -1

                        return (
                            <View style={{flexDirection:'row'}}>
                                <Pressable
                                    //id={itemId}
                                    disabled={isPressable ? false : true}
                                    key={index}
                                    onPress={() => handlePress(icon.id + "/" + itemId)}
                                    onLongPress={() => handleLongPress(icon.id)}
                                    style={[
                                        isShadow ? shadow : {},
                                        iconWrapperStyle,
                                        {
                                            width: iconSize || 40, height: iconSize || 40,
                                            backgroundColor: iconthemebgColor,
                                            borderColor: isActive ? 'orange' : 'transparent',
                                            borderWidth: isActive ? 1 : 0,
                                        }
                                    ]}
                                >
                                    <icon.name color={isActive ? 'orange' :iconthemeColor} />
                                </Pressable>
                            </View>
                        );
                    })
                }
            </View>

        )
    }



    return (
        content
    )
}
