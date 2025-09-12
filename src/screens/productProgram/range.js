import React from 'react';
import { Text, View} from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import {LineWithIcon} from "_components/ui/base/lineIcon";
import {LineContent} from './lineContent';
import {HSeparator} from "_components/ui/styled/separators";
import {getModeLabel} from '_config/products/core';


/**
 * index,data,choseModeCallback,deleteRangeCallback,pickerCallback
 * @param {*} props 
 */
export const ProgramRange = (props) => {

    const {theme} = useTheme(); 
    const { t, i18n } = useTranslation(); 
    const {index,rangeIndex,data,isEnd,chooseModeCallback,deleteRangeCallback,pickerCallback,objectType} = props
   
    const _deleteRange = (params) => {       
        if(deleteRangeCallback)deleteRangeCallback(params);
    }

    const _pickerCallback = (params) => {
        console.log("_pickerCallback",params)
        if(pickerCallback)pickerCallback(params.value,params.range,params.isEnd,params.index)
    }

    const _chooseModeCallback = (params) => {
        if(chooseModeCallback)chooseModeCallback(params);
    }
    const _separatorColor = props.separatorColor || theme['divider_on_body'] || 'blue';
    const _lineColor = props.lineColor || theme['card--color--text'] || 'green';
    const iconColor = _lineColor;


    return (
        <View key={`rangeLine-${index}`} >
            <HSeparator dividerColor={_separatorColor} fat/> 
            <LineWithIcon iconRight="trash" isAppIcon iconSize={22} callback={_deleteRange} params={{'index':index}} color={iconColor}>
                    <Text style={{color:_lineColor}}>{t("scenarios:TIME_RANGLE_TITLE",{'index':rangeIndex})}</Text>
            </LineWithIcon>
            <LineWithIcon iconLeft="clock" isAppIcon color={_lineColor}>
                <LineContent callback={_pickerCallback} label={t("scenarios:SCHEDULE_START")} range={data} value={data.start} isEnd={false} index={index}/>               
            </LineWithIcon>
            <LineWithIcon iconLeft="empty" color='blue'>          
                <LineContent callback={_pickerCallback} label={t("scenarios:SCHEDULE_END")} range={data} value={data.end} isEnd={true} index={index}/>           
            </LineWithIcon>          
            <LineWithIcon iconLeft="sondeObject" noBorder callback={_chooseModeCallback} params={{'index':index}} fullTouchable={true} color={_lineColor}>
                <Text style={{paddingLeft:15,color:_lineColor}} >{t(getModeLabel(objectType,data.mode))}</Text>
            </LineWithIcon>                                           
        </View>  
    );
}