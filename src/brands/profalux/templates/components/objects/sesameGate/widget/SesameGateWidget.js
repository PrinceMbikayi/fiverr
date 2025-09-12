import React from 'react';
import {View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';

import { SesameGateCommonWidget } from '_brand/templates/components/objects/sesameGate/components/SesameGateCommonWidget';

/**
 * Shutter Widget 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * 
 * 
 */
export const SesameGateWidget = (props)=>{

    const { t, i18n } = useTranslation();
    const {itemId} = props;
    // get shutter object infos
    const uObject = useObject(itemId);
    console.log("uOject_HOME_GATE", uObject);
    // retrieve some attribute from shutter object
    const {objectDatas} = uObject;

    return(
        <View style={{justifyContent:'center', alignItems:'center'}}>
            < SesameGateCommonWidget itemId={objectDatas?.id}/>
        </View>
    )
}