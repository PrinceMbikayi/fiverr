import React from 'react';
import {useEffect,useState} from 'react';
import { View,Text,StyleSheet,Pressable,Image } from 'react-native';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';
import PureIconRender from '_components/pureIconRender';
import {WidgetIconRoundWrapper} from '@components/ui/buttons/widgetIconRoundWrapper';
import {Api} from '_api'
import { useObject } from '_hooks/object';

export const TypeDefault= (props) => {
   

    const { t, i18n } = useTranslation();
    //const { statuses,itemId,activeStatusesImages,typeName} = props;

    const { itemId,typeName : realTypeName,newIcon} = props;
    const uObject = useObject(itemId);
    const {objectDatas,widgetReferenceDatas,statuses,name,connected,status,getStatus : getMyStatus,execute,toggle} = uObject;
    const activeStatusesImages = [];


    const {theme} = useTheme();
    const iconSize = 64;   
    const [iconFillColor,setIconFillColor] = useState(theme["card--color--icon"]);     
   
    const[isOnOff,setIsOnOff] = useState(false);

    useEffect(() => {
        //console.log("useEffect in default",props)
        const possibleStatuses = ['on','off','open','close'];
        if(statuses == undefined) {
            setIsOnOff(false);
        } else {
            const ret = possibleStatuses.indexOf(statuses?.status) != -1
            setIsOnOff(ret)
        }
        setIconFillColor((statuses?.status == "off") ? theme["card--color--icon"]: theme["widget--round--wrapper--color--border"])        
    }, []);

    useEffect(() => {      
        if(statuses && statuses?.status) {
          setIconFillColor((statuses?.status == "off") ? theme["card--color--icon"]: theme["widget--round--wrapper--color--border"])
        }        
    }, [statuses]);

    const _borderColorOn = theme["widget--round--wrapper--color--border"] || "#00FF00";
    const greenOn = (["AtHomeBoiler"].indexOf(props.typeName) != -1) ? {greenOn:_borderColorOn} : {}
    const wrapperColorOn = (["AtHomeBoiler"].indexOf(props.typeName) != -1) ? _borderColorOn : "transparent";

    const go = () => {
     
        if(isOnOff) {           
            const actionName = (statuses?.status == 'on')? 'OFF' : 'ON';            
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
                   <WidgetIconRoundWrapper iconSize={iconSize} checkOn={statuses?.status} borderColorOn={wrapperColorOn}>
                            <Pressable  style={{borderRadius:iconSize*1.6/2,backgroundColor:(isDown)?downColor:upColor}} onPress={()=>{go()}}  onPressIn={onPressIn} onPressOut={onPressOut}>                       
                                <PureIconRender size={iconSize} img={widgetReferenceDatas.img} fill={iconFillColor} activeStatusesImages={activeStatusesImages} {...greenOn} /> 
                            </Pressable>               
                    </WidgetIconRoundWrapper>                
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