// Example: Subscript and Superscript in React Native
import '_brand/templates/components/objects/common/locales'
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';

export const IndiceText = (props) => {

    const { normalText="CalypsHOME", formattedText="Box",fontWeight,fontSize } = props;

    const theme = useTheme();

    const { t, i18n } = useTranslation();
    const tns = "common";

    const bgColor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || "#3E495E";
    

    return(
        <View style={{flexDirection:'row',marginTop:-2, backgroundColor:'transparent',width:120}}>
            <Text style={{color: textColor, fontWeight:fontWeight||'400', fontSize:fontSize||16,}}>
                {normalText}
                <View>
                    <Text style={{color:textColor,position:'absolute',top:-10, fontWeight:fontWeight||'400', fontSize:13,}}>
                        {formattedText}
                    </Text>
                </View>
            </Text>
        </View>
    )

};