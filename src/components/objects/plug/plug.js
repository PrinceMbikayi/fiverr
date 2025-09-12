import React from 'react';
import ToggleOnOff from '../@common/toggleOnOff';
import {useEffect,useState,useRef} from 'react';
import { View, Text} from 'react-native';
export const TypePlug= React.memo((props) => {
   
    useEffect(() => {      
       //console.log("je mount plug !!!!!!!")

     }, []);

    return (
            <View>
              <ToggleOnOff {...props}/>
              <Text> Prise interieure</Text>
            </View>
    )
})

