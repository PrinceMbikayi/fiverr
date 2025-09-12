import '_brand/templates/screens/routines/locales'
import React from 'react';
import { Text, View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider'


export const EcoCard = (props)=>{

    const {titlePart1,titlePart2, Picto, iconSize, fontSize} = props

    const { t, i18n } = useTranslation();
    const tns = "routine";

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'


    return(
            <View 
                style={{justifyContent:'center', alignItems:'center', 
                backgroundColor: 'white', width:85,height:85, borderRadius:7,padding:5,
                shadowOffset:{width: 0, height: 4},
                shadowOpacity: 0.5,
                elevation:8,
                shadowColor:'#4d4d4d',
                    }}
                >
                <View>
                    <Text numberOfLines={2} style={{fontSize:fontSize||16,fontWeight:'600', textAlign:'center',color:textColor}}>
                        {titlePart1} {'\n'} {titlePart2}
                    </Text>
                </View>
                <View style={{width:iconSize, height:iconSize}}>
                    <Picto color={textColor}/>
                </View>
            </View>
    )
}