import React from 'react';
import { View} from 'react-native';
import {IconButtonRound} from '@components/ui/buttons/iconButtonRound';
import {appIcons} from '_assets/icons/appIcons'

/**
 * clickable round
 * @param {Object} props
 * @param {string} props.img the name of the icon
 * @param {string} props.svgr  svg icon converted to JS component
 * @param {function} props.callback
 * @param {string} [props.fillColor=white]
 * @param {number} [props.iconSize=32]
 * @returns 
 */
export const HeaderButton = (props) => {

    const {iconSize , fillColor = "white", img, callback,svgr} = props;
    const icons = appIcons;
    return (
        <View style={{marginLeft:10}}>
            <IconButtonRound  iconSize={iconSize} strokeWidth={0} strokeColor={fillColor} iconXml={icons[img]}  callback={callback} action={callback} {...{svgr}}/> 
        </View>    
    )
}