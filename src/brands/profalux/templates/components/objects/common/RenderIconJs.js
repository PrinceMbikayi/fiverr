import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Dimensions } from 'react-native';
import { useTheme } from '_theming/themeProvider';


export const RenderIconJs = (props) => {

    const { iconObject, iconColor, iconSize} = props;

    console.log('ICON_OBJECT :', iconObject);

    const iconName = iconObject?.name
    return (
        <View style={{width:iconSize, height:iconSize, marginLeft:10, backgroundColor:'transparent'}}>
            <iconObject.name color={iconColor}/>
        </View>
    )
}
