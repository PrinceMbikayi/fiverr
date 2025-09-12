import '_brand/templates/components/locales'
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { SvgCss } from 'react-native-svg';
import { useTheme } from '_theming/themeProvider';
import { ShadowBorder } from '_components/ui/shadow-border';
import { airHomeIcons } from '_assets/icons/airhomeIcons';
import { useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { iconsJs } from '_brand/utils/iconsJs';
//--- Appium -----
import { buildTestId } from '_helpers/appium';
import { getObjectsByTypeName, getUserDefaultWeather} from '_helpers/selectors';

import { WeatherHeader } from './components/WeatherHeader';




const getId = (id) => {
    return buildTestId(id)
}

//const SCREEN_WIDTH = Dimensions.get('window').width;

export const HeaderWithMenu = (props) => {


    const {
        title,
        noShadow,
        bgColor: pBgColor,
        hideBurger,
        extraButtons: options,
        kebab = null,
        meteoIcon,
    } = props;


    const { theme } = useTheme();

    const { t, i18n } = useTranslation();
    const tns = "components"

    const navigation = useNavigation();  //v5 

    const borderColor = theme?.prflxBorderColor || 'red';
    const textColor = theme?.prflxTextColor || 'black'

    const testId = getId("burger")

    const userDefaultWeather = useSelector(state =>getUserDefaultWeather(state)) || -1;

    console.log("userDefaultWeather",userDefaultWeather)



    const openDrawer = () => {
        navigation.toggleDrawer();
    }
    const openFavorisSettings = () => {
        navigation.navigate('FavorisSettings');
    }





    return (
        <View style={{height: 55, width:'100%', backgroundColor:'transparent',flexDirection:'row',
            justifyContent:'space-between', padding:2,  borderBottomColor: borderColor, borderBottomWidth: 2,}}
            >
                <View style={{width:"10%",height:'100%', backgroundColor:'transparent',justifyContent:'center'}}>
                    {!hideBurger &&
                            <Pressable onPress={openDrawer} accessibilityLabel="drawer_toggle" {...testId} >
                                <MultiPurposeWidgetLine
                                    isPressable={false}
                                    icons={[iconsJs.burgerIcon]}
                                    iconSize={25}
                                />
                            </Pressable>
                        }
                </View>

                <View style={{width:"78%",height:'100%', backgroundColor:'white',}}>
                    {userDefaultWeather == -1  ?
                                <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 18 }}>
                                    <Text style={{ color: textColor, fontSize: 21, fontWeight: '600' }}> {t(tns+":"+"FAVORITE")}</Text>
                                </View> 
                                :
                                //<View/>
                                <WeatherHeader id={userDefaultWeather}/>
                        }
                </View>

                <View style={{width:"10%",height:'100%', backgroundColor:'transparent',justifyContent:'center'}}>
                    <Pressable onPress={openFavorisSettings} style={{ backgroundColor: 'transparent', minWidth: 40, height: 32, justifyContent: 'center' }}>
                        <MultiPurposeWidgetLine
                            isPressable={true}
                            icons={[iconsJs.kebabIcon]}
                            iconSize={26}
                            onPress={openFavorisSettings}
                        />
                    </Pressable>
                </View>
        </View>
    )

}

