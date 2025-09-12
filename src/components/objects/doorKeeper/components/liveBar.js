import React from 'react';
import {useEffect,useState} from 'react';
import { View,Text,StyleSheet,Image,TouchableWithoutFeedback } from 'react-native';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import {IconButtonRound} from '@components/ui/buttons/iconButtonRound';
import { useTheme } from '_theming/themeProvider';

import icons from '../assets/icons';

/**
 * 
 * @param {Object} props 
 * @param {boolean} props.enabled
 * @param {function} props.actions 
 * 
 */
export const LiveBar = (props) => {

    const {circleRadius,actions, itemId,enabled} = props

    const { t, i18n } = useTranslation();
    
    const {theme} = useTheme();
    
    const [iconFillColor,setIconFillColor] = useState(theme["card--color--icon"]);     
   
    const[isOnOff,setIsOnOff] = useState(false);
    const [toggleOpen,setToggleOpen] = useState(false);
   

    useEffect(() => {
           
    }, []);


    const _borderColorOn = theme["widget--round--wrapper--color--border"] || "#00FF00";
    const greenOn = (["AtHomeBoiler"].indexOf(props.typeName) != -1) ? {greenOn:_borderColorOn} : {}
    const wrapperColorOn = (["AtHomeBoiler"].indexOf(props.typeName) != -1) ? _borderColorOn : "transparent";

    const bodyTextColor = theme.onBody || 'red';
    const backgroundColor = theme['card--color--bodybg'] || theme['color--bg'];



   const doAction = (actionType,param) => {
    if( actions && actions[actionType]) {
        actions[actionType](param)
    }
   }

   const smallIconSize = 50;
   const largeIconSize = 65;
  
    return (
        <View style={{flex:1,alignItems:'center'}} {...(!enabled && { pointerEvents: 'none' })}> 
                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',opacity:(!enabled)? 0.3 : 1}}>
                    <IconButtonRound  iconSize={smallIconSize} strokeWidth={0}  strokeColor={bodyTextColor} iconXml={icons.camera} callback={doAction} action="shoot"/> 
                    <View style={{marginLeft:15,marginRight:15}}>
                        <IconButtonRound  iconSize={largeIconSize} strokeWidth={2} strokeColor={bodyTextColor} iconXml={icons.microphone}  callback={doAction} action="talk" onDown={true}/> 
                    </View>
                    <IconButtonRound  iconSize={smallIconSize} strokeWidth={0}  strokeColor={bodyTextColor} iconXml={icons.videocam} callback={doAction} action="record" onDown={true}/>    
                </View>                          
       </View>   
    )
}
