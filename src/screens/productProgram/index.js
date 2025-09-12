import React from 'react';
import {useContext,useEffect} from 'react';
import { Text, View,ScrollView,SafeAreaView,TouchableHighlight } from 'react-native';
import { useSelector} from "react-redux";
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';

import TypeDynamicProgram from '_components/objects/@dynamics/indexProgram';
import { useTheme } from '_theming/themeProvider';
import { getObjectById } from '_helpers/selectors';




export const ProductProgramScreen = () => {
        
  
    const route = useRoute();
    const navigationParams = route?.params || {};     
    const {itemId,type : typeArg} =  navigationParams 
    console.log(">>          >> ProductProgramScreen ",navigationParams) ;

    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   
    const backgroundColor = bgColor;
   
    const objectDatas = useSelector(state => getObjectById(state,itemId))
    let type = objectDatas.typeName;
   
    if(typeArg)type = typeArg;
    if(objectDatas.typeName == 'composite' && objectDatas.uniType != undefined)type = objectDatas.uniType;
   
    const {img : newIcon,className} = objectDatas;   

    useEffect(() => {
       
    }, []);
  
  
    //console.log("type",type)
    const noHeaderTypes = ['AirConditionerAirwell','AtHomeHeater','AtHomeBoiler','AtHomeWirePilot','athome_thermostat'];
    const noScrollViewWrap = ['AirConditionerAirwell'];

    const noHeader =  (noHeaderTypes.indexOf(type) != -1);

    const removeSchedule = () => {
       
    }

   
    const getBody = () => {       
        if(!noHeader) {
            return (            
                    <ScrollView style={{backgroundColor:backgroundColor}}> 
                        <TypeDynamicProgram className={className} itemId = {itemId} newIcon={newIcon} typeName={type}/> 
                    </ScrollView>  
            )
            } else {
                return (            
                    <View style={{flex:1,backgroundColor:backgroundColor}}> 
                        <TypeDynamicProgram className={className} itemId = {itemId} newIcon={newIcon} typeName={type}/> 
                    </View>  
            )
            }
    }

    return (
        <SafeAreaView style={{flex:1}}>
            {
                 getBody()
            }                           
        </SafeAreaView>  
    );
}

ProductProgramScreen.navigationOptions = {
   
    headerShown: false,
    headerMode:'screen',
    gestureEnabled: false,   
    ...TransitionPresets.SlideFromRightIOS
  }

