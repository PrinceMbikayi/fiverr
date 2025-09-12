import React from 'react';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';

import {CommonShutterWidgetView} from '_brand/templates/components/objects/shutters/components/CommonShutterWidgetView';


/**
 * Shutter Widget 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * 
 * 
 */
export const StoreWidgetView = (props)=>{

    const { t, i18n } = useTranslation();
    const {itemId} = props;
    // get shutter object infos
    const uObject = useObject(itemId);
    console.log("uOject", uObject);
    // retrieve some attribute from shutter object
    const {objectDatas} = uObject;

    return(
        <>
            <CommonShutterWidgetView itemId={objectDatas?.id}/>
        </>
    )
}