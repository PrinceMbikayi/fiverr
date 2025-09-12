import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

import { iconsJs } from '_brand/utils/iconsJs';



export const RenderRoutineActionIcon = (props) => {
    const { iconName, iconSize, label, isLabelUp, withBorder, borderColor, textColor, isActive, isTilt,marginRight } = props

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const icon = iconsJs[iconName];
    console.log('LABEL :', iconName, label);
    let flag = false;
    if (iconName == "plugOffIcon" || iconName == "lightOffIcon") flag = true;

    return (
        <View style={{}}>
            {isLabelUp == false &&
                <View style={{ marginVertical: 10, backgroundColor: 'transparent', width: 200, }}>
                    <Text style={{ fontSize: label == "?" ? 25 : 22, marginLeft: label == "?" ? 34 : 0, fontWeight: '600', color: textColor, backgroundColor: 'transparent' }} >
                       {t(tns + ":" + label) + (isTilt == "TILT" ? '\u00B0' : "")} 
                    </Text>
                </View>
            }
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View
                    style={{
                        width: iconSize, height: iconSize,
                        borderColor: withBorder ? (isActive ? borderColor : textColor) : "transparent",
                        borderWidth: isActive ? 1 : 0,
                        marginRight: marginRight ? marginRight : 0,
                    }}
                    >
                    <icon.name color={isActive ? (flag ? textColor : 'orange') : textColor} />
                </View>

                {isLabelUp &&
                    <View style={{ justifyContent: "center", alignItems: 'center', marginLeft: 10, backgroundColor: 'transparent' }}>
                        <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: label == "?" ? 25 : 14, marginLeft: label == "?" ? 25 : 0, color: textColor }}>
                           {t(tns + ":" + label) + (isTilt == "TILT" ? '\u00B0' : "")}
                        </Text>
                    </View>
                }

            </View>
        </View>
    )
}