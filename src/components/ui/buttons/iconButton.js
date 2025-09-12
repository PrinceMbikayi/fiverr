import React from 'react';
import { View,TouchableHighlight,Text} from 'react-native';
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';
import {domusIcons} from '_assets/icons/domusIcons';
import PureIconRender from '_components/pureIconRender';
import {StyledIconWrapperBlockView} from '_components/ui/styled/icons';

/**
 * 
 * @param {Object} props 
 * @param {string} props.icon
 * @param {function} props.callback
 * @param {string} props.action
 * @param {number} [props.iconSize]
 * @param {boolean} [props.isActive]
 * @param {string} [props.caption]
 * 
 */
export const IconButton = (props) => {
   
    const {theme} = useTheme();

    const onAction = () => {
        if(props.callback) {
            props.callback(props.action)
        }
    }

    const {iconSize = 32} = props;

   
    const iconColor = theme['card--color--icon'];
    const textColor = theme['card--color--text'];
    const iconBackgroundColor = theme['widget--round--wrapper--color--background'] || props.backgroundColor;
    const iconWrapperColor = iconBackgroundColor;
    const iconFillColor = (props.isActive) ? theme.active_button_color || "green" : iconColor;
    const icon = (domusIcons[props.icon] != undefined) ?  props.icon+'.svg' : props.newIcon;
    
    const {buttonTestID ={}} = props;
    
    
    return  (
        <>
            <StyledIconWrapperBlockView size={iconSize*(2)} backgroundColor={iconWrapperColor}> 
                <TouchableHighlight activeOpacity={0.3} underlayColor="#DDDDDD" style={{borderRadius:iconSize}} onPress={()=>{onAction()}} {...buttonTestID}>                       
                    <PureIconRender size={iconSize} img={icon} fill={iconFillColor} /> 
                </TouchableHighlight>               
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
