
import '_brand/templates/screens/productsRelated/_locales';
import React from 'react';
import {useState,useRef,useEffect} from 'react';
import {useSelector,useDispatch} from "react-redux";
import { View,Text} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute ,StackActions} from '@react-navigation/native';
import PagerView from 'react-native-pager-view';


import {getPairingDevices,getObjectRuntimeDatas} from '_helpers/selectors'
import {createWeatherObject} from '_api/Api';

import {ThemeProvider} from 'styled-components/native';
import{getUser} from '_helpers/selectors';


//-----------------------------------------------------
import { useTheme } from '_theming/themeProvider';

import Illustration from '_images/illustrations/startQAir.js';
import {H1,P,ViewPagerStep} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';







const CreateObjectWatcher = (props) => {

    const {objectDetails,children,callback} = props
   
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
  
    const pairingObjects = useSelector(state => getPairingDevices(state));

   // const realyU = useSelector(state =>getUser(state));
    
    
   
   useEffect(()=> {
    console.log("pairingObjects changed",pairingObjects)
    if(pairingObjects && objectDetails) {
        console.log("objectDetails",objectDetails);
        console.log("pairingObjects",pairingObjects)

        const isHereId = pairingObjects.reduce((r,v,i) => {
                if(v.name == objectDetails?.name)r.push(v?.id);
                return r
        },[])

        console.log("isHereId",isHereId)
        //delete pairing in store
        
        //callback(success)
        if(callback)callback(isHereId[0])
    }
   },[pairingObjects])
    
    //-------------------------------

    const bodyTextColor = textColor;
    const backgroundColor = bgColor;
    const styledTheme = {'textColor':textColor};
    return (
        <ThemeProvider theme={styledTheme}> 
          <Text>CreateObjectWatcher...</Text>
          {children}
        </ThemeProvider>
    )        
}

export default CreateObjectWatcher


