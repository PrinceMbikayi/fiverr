import React from 'react';
import { View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';

import { GarageCommonWidget } from '_brand/templates/components/objects/garagedoor/components/GarageCommonWidget';


/**
 * Shutter Widget 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * 
 * 
 */
export const GarageWidget = (props)=>{

    const { t, i18n } = useTranslation();
    const {itemId} = props;
    // get shutter object infos
    const uObject = useObject(itemId);
    console.log("uOject", uObject?.objectDatas?.id);
    // retrieve some attribute from shutter object
    const {objectDatas} = uObject;
    const id = uObject?.objectDatas?.id;

    return(
        <View style={{justifyContent:'center', alignItems:'center'}}>
            <GarageCommonWidget itemId={id}/>
        </View>
    )
}