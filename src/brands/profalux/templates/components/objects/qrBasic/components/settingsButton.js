import React from 'react';

import {IconRoundButton} from '@components/ui/buttons/iconRoundButton';
import { IconWrapper } from './styled';


/**
 * 
 * @param {Object} props 
 * @param {string}[props.bgColor] default white
 * @param {string} [props.iconColor] default black
 * @returns 
 */
export const SettingsButton = (props) => {
    
    const { 
        bgColor = "white", iconName = "edit",
        appIcon,iconSize =  30,touchSize = 50, iconColor = "black",
        callback,
        iconComponent
        } = props;

    const doCallBack = () => {      
       if(callback != undefined) {
      
        callback();
       }
    }

    return (
        <IconWrapper bgColor={bgColor} size={touchSize}>
            <IconRoundButton iconName= {iconName} iconComponent={iconComponent} appIcon iconSize={iconSize} touchSize={touchSize} fillColor={iconColor} iconColor={iconColor} callback={doCallBack} zIndex={4} />
        </IconWrapper>
    )
}