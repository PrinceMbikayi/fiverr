import React from 'react';
import { View,Pressable,Text} from 'react-native';
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';
import {domusIcons} from '_assets/icons/domusIcons';
import PureIconRender from '_components/pureIconRender';
import {StyledIconWrapperBlockView} from '_components/ui/styled/icons';

/**
 * 
 * @param {Object} props 
 * @param {function} props.callback
 * @param {string} props.action
 * @param {number} [props.iconSize]
 * @param {boolean} [props.isActive]
 * @param {string} [props.caption]
 * 
 * @returns 
 */
export const IconButton = (props) => {
   
    const {theme} = useTheme();
    /*console.log("account IconButton",props)*/
    const onAction = () => {
        if(props.callback) {
            props.callback(props.action)
        }
    }
    
    const iconSize = props.size || props.iconSize || 32;
    const iconColor = props.iconColor || theme['card--color--icon'];
    const textColor = theme['card--color--text'];
    const iconBackgroundColor = props.backgroundColor || 'transparent' || theme['widget--round--wrapper--color--background'];
    const iconWrapperColor = iconBackgroundColor;
    const iconFillColor = (props.isActive) ? theme.active_button_color || "green" : iconColor;
    const icon = props.icon;
    
    
    
    return  (
        <>
            <StyledIconWrapperBlockView size={iconSize*(1.5)} backgroundColor={iconWrapperColor}> 
                <Pressable activeOpacity={0.3} underlayColor="#DDDDDD" style={{borderRadius:iconSize}} onPress={()=>{onAction()}}>                       
                    <PureIconRender size={iconSize} img={icon} appIcon fill={iconFillColor} /> 
                </Pressable>               
            </StyledIconWrapperBlockView>
            {props.caption && 
                <Caption style={{color:textColor,textAlign:'center'}}>{props.caption || ""}</Caption>
            }
           
        </>
    );
}

//-------------- styles and styled ------------------------

const Caption = styled.Text`
                   font-size:12px;
                   margin-top:8px;
                `;
