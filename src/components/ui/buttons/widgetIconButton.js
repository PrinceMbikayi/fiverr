import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { useTheme } from '_theming/themeProvider';
import { View,Text,Pressable } from 'react-native';

import {domusIcons} from '_assets/icons/domusIcons';
import PureIconRender from '_components/pureIconRender';
import {StyledIconWrapperView} from '_components/ui/styled/icons';
import { WidgetIconRoundWrapper } from './widgetIconRoundWrapper';
import { checkPropTypes } from 'prop-types';


/**
 * iconSize,borderSize,checkOn,backgroundColor,borderColorOn,borderWidth
 * @param {Object} props 
 * 
 * @param {any} props.children the JSX Object inside this wrapper
 * @param {'on' | 'off'} props.checkOn
 * @param {number} [props.iconSize] default 48
 * @param {number} [props.borderWidth] default 4
 * @param {string} [props.borderColorOn] theme["widget--round--wrapper--color--border"] || "white"
 * @param {string} [props.backgroundColor] theme['widget--round--wrapper--color--background']
 * 
 * 
 */
export const WidgetIconButton = (props) => {

    const {theme} = useTheme();
    const { iconSize = 48,
            borderWidth : borderSize = 4,
            activeStatusesImages,
            checkOnState, 
            onPress,
            addAutoId,
            itemId,
            typeName,
            } = props;  
            
          
    const newIcon = "empty";
   // console.log("WidgetIconButton",props);
    const icon = (domusIcons[typeName] != undefined) ?  typeName+'.svg' : newIcon; 
    const _backgroundColor = props.backgroundColor || theme['widget--round--wrapper--color--background'] ;
    const _borderColorOn = props.borderColorOn || theme["widget--round--wrapper--color--border"] || "white";

    const _greenOnColor = theme["widget--round--wrapper--color--border"] || props.borderColorOn;

    const downColor ="#CCCCCC";
    const upColor ="transparent";
   
    const [borderState, setborderState] = useState(checkOnState);

    //interactions

    const [isDown,setIsDown] = useState(false);
   
    useEffect(() => {  
        //console.log("refresh is Down / Up")
    }, [isDown]);


    const onPressIn = () => {
        setIsDown(true);
        doOnPress();
       
        console.log("pressed In")
       
        //
        //

    }
    const onPressOut = () => {
        //setIsDown(false);
    }

    const doOnPress = () => {
        
        //console.log("doPress")
        setTimeout(() => setIsDown(false), 0); 
        /*  
        const nextState = (forcedState == "on")? "off" : "on" ; 
        setForcedState (nextState);  
        // this timeout is needed for immediate process of useEffect on fordecStatus
        // display is immediate
        setTimeout(() => onPress(nextState),0);   
           */
        onPress();
    }

    const noDoPress = () => {

    }

    // colors
    const colorOn = theme["widget--round--wrapper--color--border"];
    const colorOff =  theme["card--color--icon"];
    const [iconFillColor,setIconFillColor] = useState((checkOnState == "off")? colorOff: colorOn); 

    useEffect(()=> {
       // redraw on activeStatusesImages change
    },[activeStatusesImages])

    useEffect(() => {  
        //console.log("checkOnState ===>",checkOnState)        
        const nextColor = (checkOnState == "off") ? colorOff: colorOn; 
        setIconFillColor(nextColor);  
        //setForcedState(checkOnState);   
    }, [theme]);

    useEffect(() => {     
       // console.log("checkOn changed",checkOnState)      
        const nextColor = (checkOnState == "off") ? colorOff: colorOn;        
        setIconFillColor(nextColor); 
        setborderState(checkOnState); 
       
    }, [checkOnState]);

   



    return (
        <WidgetIconRoundWrapper iconSize={iconSize} checkOn={borderState}>                       
            <Pressable style={{width:"120%",height:'120%',justifyContent:'center',alignItems:'center', borderRadius:iconSize,  backgroundColor: (isDown)?downColor:upColor}} onPress={noDoPress}  onPressIn={onPressIn} onPressOut={onPressOut} delayPressIn={0} {...addAutoId}>                       
                <PureIconRender size={iconSize} img={icon} fill={iconFillColor} activeStatusesImages={activeStatusesImages}  greenOn={_greenOnColor} testID="fr.enman.easyhome:id/icon"/> 
            </Pressable>                        
        </WidgetIconRoundWrapper>
    );
}