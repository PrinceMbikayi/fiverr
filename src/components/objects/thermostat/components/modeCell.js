import React from 'react';
import {TouchableHighlight} from 'react-native';

import { useTheme } from '_theming/themeProvider';
import PureIconRender from '_components/pureIconRender';
import {StyledIconWrapperBlockView} from '_components/ui/styled/icons';
import {ModeText,AutoCenteredView} from '../thermostatStyled';

export const ModeCell = (props) => {
    
    const {theme} = useTheme();
    const defaultSelectedColor = theme.primary;
    const {iconSize,icon,iconFillColor,label,selectedColor,actionName,doAction,iconScale} = props
    const iconColor = theme['card--color--icon'];
    const textColor = theme['card--color--text'];
    const iconBackgroundColor = theme['widget--round--wrapper--color--background'] || props.backgroundColor;

    const isSelectedColor = (props.selected) ? selectedColor ||defaultSelectedColor : false;
    const iconWrapperColor = iconBackgroundColor
    return   (
            <AutoCenteredView>
                <TouchableHighlight style={{borderRadius:(iconSize*1.1)}}     underlayColor="red" disabled={doAction == undefined} onPress={() => doAction(actionName)}>
                    <StyledIconWrapperBlockView size={iconSize*(1.1)} backgroundColor={isSelectedColor || iconWrapperColor}> 
                        <StyledIconWrapperBlockView size={iconSize*(1.05)} backgroundColor={iconWrapperColor}>   
                            <PureIconRender size={iconSize*(iconScale || 1)} img={icon}  fill={isSelectedColor || iconFillColor || iconColor}/> 
                        </StyledIconWrapperBlockView>  
                    </StyledIconWrapperBlockView>
                </TouchableHighlight>
                {label && 
                     <ModeText color={isSelectedColor || textColor}>{label}</ModeText>
                }               
             </AutoCenteredView>
    )
}