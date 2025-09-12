import React from 'react';
import {useEffect,useState} from 'react';
import { View,Text,StyleSheet,Pressable,Image } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import PureIconRender from '_components/pureIconRender';
import styled from 'styled-components/native'
import {StyledIconWrapperView} from '_components/ui/styled/icons';

import {Api} from '_api'







export const TypeDefault= (props) => {
    const { t, i18n } = useTranslation();
    const { statuses,itemId,activeStatusesImages} = props;
    const {theme} = useTheme();
    const iconSize = 64;
    const iconFillColor = theme["card--color--icon"];
    
    
    const iconWrapperColor = theme["card--color--icon--wrapper--background"] || "transparent";  

    const[isOnOff,setIsOnOff] = useState(false);

    useEffect(() => {
        
        const possibleStatuses = ['on','off','open','close'];
        if(statuses == undefined) {
            setIsOnOff(false);
        } else {
            const ret = possibleStatuses.indexOf(statuses.status) != -1
            setIsOnOff(ret)
        }
        
    }, []);

    const go = () => {
        //console.log('isOnOff',isOnOff)
        if(isOnOff) {
            //console.log('statuses.status',statuses.status)
            const actionName = (statuses.status == 'on')? 'OFF' : 'ON';
            //console.log("default",itemId,actionName)
            Api.executeAction(itemId,actionName);
        }
        
    }

    const downColor ="#CCCCCC";
    const upColor ="transparent";
    const [isDown,setIsDown] = useState(false);
    const onPressIn = () => {setIsDown(true);};
    const onPressOut = () => {setIsDown(false);};


    return (
            <StyledMainView>                     
                    <StyledIconWrapperView size={iconSize*(1.6)} backgroundColor={iconWrapperColor}> 
                        <Pressable style={{backgroundColor:(isDown)?downColor:upColor}} onPress={()=>{go()}}  onPressIn={onPressIn} onPressOut={onPressOut}>                       
                            <PureIconRender size={iconSize} img={props.newIcon} fill={iconFillColor} activeStatusesImages={activeStatusesImages}/> 
                        </Pressable>               
                    </StyledIconWrapperView> 
            </StyledMainView>
    )
}
/**
 * @component
 * @attr {number} size
 * 
 */
const StyledMainView = styled.View`
                    flex: 1;
                    min-height:150px;                   
                `;

