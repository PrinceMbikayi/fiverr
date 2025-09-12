import React from 'react';
import { View, } from 'react-native';

import {IconButtonRound} from '@components/ui/buttons/iconButtonRound';
import icons from '../../assets/icons';

export const ReplayWithOverlay = (props) => {

    const {callback,color} = props;
    const bodyTextColor = props.color || "white"
    const doAction = (action) => {       
        if(callback)callback();        
    }
  
    return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center',  position:'absolute',left:0,top:0,right:0,bottom:0,backgroundColor:"#00000055"}} >            
                <IconButtonRound  iconSize={65} strokeWidth={2} strokeColor={bodyTextColor} backgroundColor={"blue"} iconXml={icons.microphone}  callback={doAction} action="replay"  />
        </View>   
    )
}