import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';

export const RenderLevelPosition = (props) => {
    const {shutterLevel} = props;

    const { t, i18n } = useTranslation();
    const tns = "common";
    const { theme } = useTheme();
    const textColor = theme?.prflxTextColor || 'black'

    const displayLevelPosition = ()=>{
        if(shutterLevel != undefined){
            if(shutterLevel >= 100){
                return t(tns + ":" + "OPENED_AT")
            }
            else if(shutterLevel <= 0){
                return t(tns + ":" + "CLOSED")
            }
             else if(shutterLevel > 0 && shutterLevel < 100){
                return t(tns + ":" + "OPENED_AT") + "\n"+shutterLevel + '%'
            }
        }
        else{
            return t(tns + ":" + "POSITION") + "\n"+t(tns + ":" + "UNDEFINED")
        }
    }

    let levelText = displayLevelPosition();
    console.log('shutterLevel :', shutterLevel, levelText);

    return (
        <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'transparent'}}>
            <Text  ellipsizeMode='tail' 
                style={{ fontSize: 14, fontWeight: "400", color: textColor, flexWrap: 'nowrap', 
                backgroundColor: 'transparent', textAlign: 'center' }}
                >
                {levelText}
            </Text>
        </View>
    )
}