import React from 'react';
import { View} from 'react-native';
import { useTranslation } from 'react-i18next';
import {ModeCell} from './modeCell';

/**
 * ActionBlockRender in Thermostat 
 * 
 * @param {Object} props
 * @param {number} props.iconSize
 * @param {function} props.actionCallback
 * @param {string} props.currentMode
 * @param {string} [props.iconFillColor] 
 * @param {number} [props.fontSize]
 * 
 */
export const ActionBlockRender = (props) => {

    const {iconSize,iconFillColor,currentMode,actionCallback} = props
    const { t } = useTranslation();
   
    const modeCellAction = (actionName) => {
        if(actionCallback) {
            actionCallback(actionName);
        }
    }

    return (
        <View style={{flexDirection:'row',nojustifyContent:'space-between'}}>
             <ModeCell icon="thermostat-manual.svg" appIcon iconScale={0.6} label={t("scenarios:THERMOSTAT_MODE_MANUAL")} fill={iconFillColor} iconSize={iconSize} selected={(currentMode == "manual")} doAction={modeCellAction} actionName="MANUAL"/>
            <ModeCell icon="clock-48.svg" appIcon iconScale={0.8} label={t("scenarios:THERMOSTAT_MODE_AUTO")} fill={iconFillColor} iconSize={iconSize} selected={(currentMode == "auto")} doAction={modeCellAction} actionName="AUTO"/>
            <ModeCell icon="thermostat-absence.svg" appIcon iconScale={0.6} label={t("scenarios:THERMOSTAT_MODE_AWAY")} fill={iconFillColor} iconSize={iconSize} selected={(currentMode == "absence")} doAction={modeCellAction} actionName="ABSENT"/>           
        </View>
    )
}