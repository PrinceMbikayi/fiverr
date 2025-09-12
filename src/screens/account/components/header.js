import React from 'react';
import {View} from 'react-native'
import { useTheme } from '_theming/themeProvider';
import {HeaderWithBack} from '_components/headers/header-with-back';


export const AccountHeader = (props) => {    
    const {theme} = useTheme();
    const headerBackgroundColor = theme["card--color--headerbg"]; 
    const headerTextColor = theme["card--color--text"]; 
    return (
                <View style={{minHeight:84}}>
                <HeaderWithBack bgColor={headerBackgroundColor} color={headerTextColor} themeDependency {...props} style={{minHeight:64}}/> 
                {props.headerSelection}
                </View>
        
        )
}