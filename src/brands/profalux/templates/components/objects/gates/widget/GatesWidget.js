import React from 'react';
import {View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';

import { GatesCommonWidget } from '_brand/templates/components/objects/gates/components/GatesCommonWidget';

/**
 * Shutter Widget 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * 
 * 
 */
export const GatesWidget = (props)=>{

    const { t, i18n } = useTranslation();
    const {itemId} = props;
    // get shutter object infos
    const uObject = useObject(itemId);
    console.log("uOject", uObject);
    // retrieve some attribute from shutter object
    const {objectDatas} = uObject;

    return(
        <View style={{justifyContent:'center', alignItems:'center'}}>
            <GatesCommonWidget itemId={objectDatas?.id}/>
        </View>
    )
}