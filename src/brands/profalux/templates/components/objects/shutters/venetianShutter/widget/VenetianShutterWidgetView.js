import React from 'react';
import { SafeAreaView,View,Text} from 'react-native';

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
 const VenetianShutterWidgetView = (props) =>{

    const { t, i18n } = useTranslation();
    const {itemId} = props;
    // get shutter object infos
    const uObject = useObject(itemId);
    console.log("uOject", uObject);
    // retrieve some attribute from shutter object
    const {objectDatas} = uObject;

    
    return (
        <SafeAreaView>
           <CommonShutterWidgetView itemId={objectDatas?.id} whichShutte = 'vr' />
        </SafeAreaView>
    )
}
export default VenetianShutterWidgetView;
