
import React from 'react';
import { useTheme } from '_theming/themeProvider';
import {StyledIconWrapperView} from '_components/ui/styled/icons';



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
export const WidgetIconRoundWrapper = (props) => {

    const {theme} = useTheme();
    const {iconSize, borderWidth : borderSize = 4, checkOn} = props;    
    const _backgroundColor = props.backgroundColor || theme['widget--round--wrapper--color--background'] ;
    const _borderColorOn = props.borderColorOn || theme["widget--round--wrapper--color--border"] || "white";

    return (
        <StyledIconWrapperView size={(iconSize+borderSize)*1.6} backgroundColor={(checkOn == "on")? _borderColorOn : "transparent"}>      
            <StyledIconWrapperView size={iconSize*(1.6)} backgroundColor={_backgroundColor}>
                {props.children}  
            </StyledIconWrapperView>
        </StyledIconWrapperView>
    );
}