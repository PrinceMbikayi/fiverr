import React from 'react';
import {Pressable} from 'react-native';

// ---------
import {StyledIconWrapperBlockView} from '_components/ui/styled/icons';
import PureIconRender from '_components/pureIconRender';


//----------
const BaseButton = (props) => {

    const {backgroundColor,size,img,onPress} = props

    return (

            <StyledIconWrapperBlockView backgroundColor={backgroundColor} size={size} style={{margin:5}}>
                <Pressable activeOpacity={0.3} underlayColor="#DDDDDD" style={{borderRadius:size*1.6/2}} onPress={onPress}>                       
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

