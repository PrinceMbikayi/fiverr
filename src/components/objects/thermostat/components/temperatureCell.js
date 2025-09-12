import React from 'react';
import { View,Platform } from 'react-native';
import {SetPointText,SetPointTextLabel} from '../thermostatStyled';
import { useTheme } from '_theming/themeProvider';

/**
 * Temperature Selection in Thermostat 
 * 
 * @param {Object} props
 * @param {number} props.value
 * @param {string} props.label 
 * @param {number} [props.fontSize] default value 42
 * 
 */
export const TemperatureCell = (props) => {

    const {value,size,label} = props; 
    const extras = props.noAlignAdjust ? 0 : 20;   
    const fontSize = props.fontSize || 42;
    const extraPadding = (Platform.OS == 'ios') ? 14:4;
    const coeff = fontSize / 42.0;   
    const degreeTransX = -1*((Platform.OS == 'ios') ? 1 : 1)*coeff;
    const unitTransX = -1*((Platform.OS == 'ios') ?  16: 16)*coeff;
    const unitTransY = 14*coeff;
    const addTop =  -1*((Platform.OS == 'ios') ? 9 : 9);
   
    const {theme} = useTheme();

    const iconColor = theme['card--color--icon'];
    const textColor = theme['card--color--text'];
   
    const iconBackgroundColor = theme['widget--round--wrapper--color--background'] || props.backgroundColor;


    return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center',height:size*1.09,top:addTop,paddingTop:extraPadding}}>
            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:9,paddingLeft:0}}>               
                <View style={{backgroundColor:'transparent'}}>
                    <SetPointText fontSize={fontSize} platform={Platform.OS} color={textColor}>{value}</SetPointText>
                </View>
                <View style={{alignSelf:'center',marginLeft:0,padding:0}}>
                    <SetPointText fontSize={fontSize} platform={Platform.OS} color={textColor} style={{backgroundColor:'transparent',transform: [{ translateX: degreeTransX }]}}>˚</SetPointText>
                </View>
                <View style={{alignSelf:'center',marginRight:-20,padding:0}}>
                    <SetPointText platform={Platform.OS} fontSize={fontSize} color={textColor} style={{backgroundColor:'transparent',transform: [{ translateX: unitTransX},{scale:0.5},{translateY:unitTransY}]}}>c</SetPointText>
                </View>               
            </View>
            <View style={{flex:1,justifyContent:'flex-end',marginBottom:-extras}}>
                <SetPointTextLabel style={{alignSelf:'flex-end',color:textColor}}>{label}</SetPointTextLabel>
            </View>
    </View>
    )
}