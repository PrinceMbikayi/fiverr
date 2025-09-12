import React from 'react';
import {useContext,useState,useEffect} from 'react'
import { View,TouchableHighlight,Text} from 'react-native';
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';



export const Countdown = (props) => {
   
    const {displayedTime,triggerTime} = props;
    const {theme} = useTheme();

    

    const [showCountDown,setShowCountDown] = useState(true)
    
    useEffect(() => {
        console.log("useEffect du TriggerTime",triggerTime)
       }, [triggerTime]);
 




    const toggle= () => {
        setShowCountDown(!showCountDown)
    }

    const textColor = theme["schedule_widget_text_color"] || "#777";

    return  (
        <View >
        {!showCountDown &&
            <TouchableHighlight onPress={toggle} underlayColor="#FF000000">
                <TimeText style color={textColor}>{displayedTime}</TimeText>
            </TouchableHighlight>
        }
        {showCountDown &&
            <TouchableWrapper onPress={toggle} underlayColor="#FF000000" >
                <TriggerText color={textColor}>{triggerTime}</TriggerText>
            </TouchableWrapper>
        }
           
        </View>
    );
}

//-------------- styles and styled ------------------------
const TouchableWrapper = styled.TouchableHighlight`
    flex:1; 
    height:100%;
    width:100%;
    justify-content:center;
    align-content:center;   
    `;


const TimeText = styled.Text`
       
        font-size:32px; 
        color:${props => props.color || "#777" };
        text-align:center;
            
    `;
const TriggerText = styled.Text`       
    font-size:16px; 
    color:${props => props.color || "#777" };
    text-align:center;    
`;
