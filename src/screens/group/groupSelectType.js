import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme} from '_theming/themeProvider';
import AthomeProducts from '_components/list/athomeProducts';
import {HeaderWithBack} from '_components/headers/header-with-back';


export const GroupSelectTypeScreen = (props) => {
    const {  navigation,route} = props;
    const { t, i18n } = useTranslation();  
    const {theme } = useTheme();    
    const navParams = route?.params || {};     
    const _groupName =navParams?.groupName;
    console.log("NAV PARAMS :", navParams);
 
    
    const selectMyProductType = (id) => {
      navigation.navigate('GroupSelectProducts',{groupName:_groupName,productType:id});       
    }    

    return (
        <SafeAreaView style={{flex:1,flexDirection:'column',backgroundColor:theme['color--bg']}}>
            <View style={{flex:1}}>
                <View style={{height:72,minHeight:72}}>
                    <HeaderWithBack title={t("PRODUCT_MODEL").toUpperCase()} close themeDependency/>  
                </View>           
                <View style={{flex:1}}>
                    <AthomeProducts  selectionCallback = {selectMyProductType} style={{padding:15,paddingTop:0}} isGroup/>
                </View>
           </View>
        </SafeAreaView>
    );
}
