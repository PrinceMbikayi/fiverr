import '_brand/templates/components/objects/common/locales'
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { View, Text, Pressable, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '_theming/themeProvider';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { getObjectById } from '_helpers/objects';
import { RoutineWidgetIcon } from '_brand/templates/components/objects/common/RoutineWidgetIcon';
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'

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
export const EcoShuttersActionsIcons = (props) => {

    const {itemId,typeName, icons, iconSize, iconWrapperStyle, iconGroupWrapperStyle, onPress, onLongPress, isPressable = true, isShadow = false } = props;

      const uEcoConfort = useEcoConfort();
      const { 
                updateEcoConfortActions,ecoConfGroupActions
          } = uEcoConfort;


    const objectKeyPrefix = "myActions"
    const myKey = objectKeyPrefix + "_" + itemId;
    //const myActions = {"myActions_1":["OPEN/OPEN/1"]}?.[myKey] || []
    const myActions = ecoConfGroupActions?.[myKey] || []
    //const myActions = actionsByItemId?.[myKey] || []

    useEffect(() => {
        console.log("ROUTINE_WIDGET:", ecoConfGroupActions, myActions)
    }, [myActions]);

    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const tns = "common";


    /**
     * 
     * @comment typeName is set to "Rolling_Shutter_Ezsp" to force all type of shutters 
     *          to be grouped in one single widget when configuring ecoconfort parameters.
     */
    const handlePress = (id) => {
        onPress(id);
        const actionArr = id.split("/");
        let action;
        actionArr.length == 1 ? action = id + "/" + id : action = id
        console.log("ECO_CONF_ICON_ACTION_PRESSED :", id, actionArr, action)
        updateEcoConfortActions(action,"Rolling_Shutter_Ezsp") 
        //updateEcoConfortActions(action,typeName)
    }

    const handleLongPress = (id) => {
        onLongPress(id)
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


    let content;
     
        content = (

            <View style={[iconGroupWrapperStyle || { flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'space-evenly', alignItems: 'center' }]}>
                {
                    icons.map((icon) => {
                        const idForTest = icon.id + "/" + itemId;
                        console.log("ID for Test:", icons, idForTest);
                        const isActive = myActions.indexOf(idForTest) != -1
                        console.log('IS_ACTIVE :', isActive, myActions, idForTest);

                        return (
                                <Pressable
                                    id={itemId}
                                    disabled={isPressable ? false : true}
                                    key={icon.id}
                                    onPress={() => handlePress(icon.id + "/" + itemId)}
                                    onLongPress={() => handleLongPress(icon.id)}
                                    style={[
                                        isShadow ? shadow : {},
                                        iconWrapperStyle,
                                        {
                                            width: iconSize || 30, height: iconSize || 40,
                                            backgroundColor: iconthemebgColor,
                                            borderColor: isActive ? 'orange' : iconthemeColor,
                                            borderWidth: isActive ? 1 : 1,
                                        
                                        }
                                    ]}
                                >
                                    <icon.name color={isActive ? 'orange' :iconthemeColor} />
                                </Pressable>
                        );
                    })
                }
            </View>

        )

    return (
        content
    )
}
