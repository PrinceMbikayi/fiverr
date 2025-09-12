import React from 'react';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';

//import { CommonShutterWidgetView } from '_brand/templates/components/objects/common/CommonShutterWidgetView';
import {CommonShutterWidgetView} from '_brand/templates/components/objects/shutters/components/CommonShutterWidgetView';


/**
 * Shutter Widget 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * 
 * 
 */
export const ShutterWidgetView = (props) => {

    const { t, i18n } = useTranslation();
    const { itemId } = props;
    // get shutter object infos
    const uObject = useObject(itemId);
    console.log("uOject", uObject);
    // retrieve some attribute from shutter object
    const { objectDatas } = uObject;
    //const objStatuses = widgetReferenceDatas?.statusDictionary; 

    return (
        <>
            <CommonShutterWidgetView itemId={objectDatas.id} />
        </>
    )
}