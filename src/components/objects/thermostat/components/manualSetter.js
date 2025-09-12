import React from 'react';
import {useEffect,useState} from 'react';
import { View,Text} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SetPointButton } from './setPointButton';
import { ModeCell } from './modeCell';
import { useTheme } from '_theming/themeProvider';


export const ManualSetter = (props) => {

    const {theme} = useTheme();

    const {callback,iconSize = 56, value : setpointManual} = props;

    const setPoint = (point,way) => {
        console.log("ManualSetter setPoint",point,way);
        callback(point,way);
    }

    const iconBackgroundColor = theme['widget--round--wrapper--color--background'] || props.backgroundColor;
    const iconFillColor = theme["card--color--icon"];
    const textColor = theme['card--color--text'];

    useEffect(()=> {
        console.log("ManualSetter >setpointManual",setpointManual)
    },[setpointManual])




    return (
        <View style={{padding:0}}>
            <View style={{flex:1,flexDirection:'row',alignItems:'center',backgroundColor:"transparent",height:iconSize*1.08}}>                                        
                <View style={{flex:1,alignItems:'center'}}>
                    <View style={{position:'absolute',height:'100%',width:'50%',left:'50%',backgroundColor:iconBackgroundColor}}/>
                    <SetPointButton point="manual" way="decrease" callback={setPoint} align="Left" iconSize={iconSize} style={{backgroundColor:'transparent'}}>
                        <ModeCell icon="minus-circle.svg" appIcon fill={iconFillColor} iconSize={iconSize} selected={false} actionName="MANUAL"/>            
                    </SetPointButton>
                </View>
                <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:iconBackgroundColor,height:iconSize*1.09}}>
                    <Text style={{fontSize:40,color:textColor}}>{setpointManual}</Text>
                </View>                                        
                <View style={{flex:1,alignItems:'center',height:iconSize*1.09}}>
                    <View style={{position:'absolute',height:'100%',width:'50%',left:-1,backgroundColor:iconBackgroundColor}}/>
                    <SetPointButton point="manual" way="increase" callback={setPoint} align="Right" iconSize={iconSize} style={{backgroundColor:'transparent'}}>                                                
                        <ModeCell icon="plus-circle.svg" appIcon fill={iconFillColor} iconSize={iconSize} selected={false}  actionName="MANUAL"/>
                    </SetPointButton>
                </View>
            </View>
        </View>  
    )    

}