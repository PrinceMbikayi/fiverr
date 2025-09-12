import '_brand/templates/screens/routines/locales'
import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import {iconsJs} from '_brand/utils/iconsJs';
import {EcoConfortWidgetContent } from '_brand/templates/screens/routines/components/EcoConfortWidgetContent'
import {WindProtectionWidgetContent } from '_brand/templates/screens/routines/components/WindProtectionWidgetContent'

export const CommonAppWidget = (props) => {

    const {itemId} = props;

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const {theme} = useTheme();  

    const uObject = useObject(itemId);
    const appName = uObject?.objectDatas?.appName;
    console.log('uObject_APP',appName);

    const appNameConfig = {
        "Mode Éco Confort": <EcoConfortWidgetContent itemId={itemId}/>,
        "Protection vent": <WindProtectionWidgetContent itemId={itemId}/>
    }

    return (
        <View>
            {appNameConfig[appName] || <EcoConfortWidgetContent itemId={itemId}/>}
        </View>
    )

}