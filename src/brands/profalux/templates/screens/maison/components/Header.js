import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';
import {iconsJs} from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from '_brand/templates/components/objects/common/MultiPurposeWidgetLine';
//--- Appium -----
import {buildTestId} from '_helpers/appium';




const getId = (id) => {
    return buildTestId(id)
}

export const Header = (props) => {
   

    const {
        title,
        noShadow,
        bgColor : pBgColor,
        hideBurger,
        extraButtons : options, 
        kebab = null,
        meteoIcon,
        //openWeatherDetails,
        //temperature,



    } = props;
    const {theme} = useTheme();

   
    const navigation = useNavigation();  //v5 
   
    const color = "white";
    const burgerImage = theme['header--menu--burger'];

    const bgColor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || 'white';
    const borderColor = theme?.prflxBorderColor || 'red';
    const textColor = theme?.prflxTextColor||'black'

    const testId = getId("burger")




    const openDrawer = () => {
        navigation.toggleDrawer();
    }
    const openFavorisSettings = () => {
        navigation.navigate('FavorisSettings');
    }




    



    return (
        <View style={{height:55}}>
        <View style={{flex:1, backgroundColor:'white', borderBottomColor: borderColor, borderBottomWidth:2, flexDirection:'row',alignItems:'center',  width:'100%'}}>
            {!hideBurger && 
                <Pressable onPress = {openDrawer} accessibilityLabel="drawer_toggle" {...testId}>
                    <MultiPurposeWidgetLine 
                        isPressable = {false}
                        icons={[iconsJs.burgerIcon]} 
                        iconSize={25}
                        //onPress = {openDrawer} 
                        //active = {sendCurrentActive}
                        //iconWrapperStyle = {{marginLeft:-90}}
                    />
                </Pressable>
             }
            <View style={{backgroundColor:'transparent', flex:1, justifyContent:'flex-start', alignItems:'baseline'}}>
                 <Text style={{color:textColor, fontSize:22, fontWeight:'600'}}>{title}</Text>   
            </View>
             
             {kebab}
        </View>
        </View>
    )

}


