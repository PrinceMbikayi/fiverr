import React from 'react';
import {useState,useEffect,useRef,useContext} from 'react'
import {Pressable} from 'react-native';

// ---------
import {StyledIconWrapperBlockView} from '_components/ui/styled/icons';
import PureIconRender from '_components/pureIconRender';


//----------
const BaseButton = (props) => {

    const {backgroundColor,size,img,onPress} = props
    const downColor ="#CCCCCC";
    const upColor ="transparent";
    const [isDown,setIsDown] = useState(false);
    const onPressIn = () => {setIsDown(true);};
    const onPressOut = () => {setIsDown(false);};
    return (

            <StyledIconWrapperBlockView backgroundColor={backgroundColor} size={size} style={{margin:5}}>
                <Pressable  style={{borderRadius:size*1.6/2,backgroundColor:(isDown)?downColor:upColor}} onPress={onPress}  onPressIn={onPressIn} onPressOut={onPressOut}>                       
                    <PureIconRender size={size} img={img} appIcon fill="white"/> 
                </Pressable> 
            </StyledIconWrapperBlockView>
    )
}

const defaultSize = 64;


//===========================================
/**
 * 
 * @param {Object} props
 * @param {function} props.onPress - a callback
 * 
 * @param {number} props.size
 * @param {string} [props.backgroundColor = "#00FF00"]
 * 
 * 
 */
export const  CallButton = (props) => {
    const {backgroundColor =  "#00FF00",size = defaultSize,onPress} = props;
    return (
        <BaseButton backgroundColor={backgroundColor} size={size} onPress={onPress} img="phone-call.svg"/>
    )
}
//===========================================
/**
 * display HangUp Button
 * @param {Object} props
 * @param {function} props.onPress - a callback  
 * @param {number} [props.size]
 * @param {string} [props.backgroundColor = "#FF0000"]
 * @param {string} [props.test]
 */
export const HangUpButton = (props) => {
    const {backgroundColor = "#FF0000",size = defaultSize,onPress} = props;
    return (
        <BaseButton backgroundColor={backgroundColor} size={size} onPress={onPress} img="phone-hangup.svg"/>
    )
}

