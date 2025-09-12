import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,SafeAreaView,ScrollView,Button,Image} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import styled,{ThemeProvider} from 'styled-components/native';


import {getObjectById} from '_helpers/selectors';
import { useTheme } from '_theming/themeProvider';
import {HeaderWithBack} from '_components/headers/header-with-back';
import AccessButton from '_components/forms/accessButton';
import {QrCodeVDPImage} from '../components/ui/image';
import SelectPhoto from '../components/settings/selectPhoto';
import {QrCodeSettingsForm} from '../components/settings/form';
import {updateStatuses} from '_actions/objects';
import {setOptions} from '../utils/settings';
//import { getImage,setImage } from '../utils/image';
import {Body,ViewerTitle,ViewerText,TextInput,Label} from '../components/styled';

import QrCodeVDPSettingsComponent from '../components/settings/settingsComponent';
import {useQrObject} from '_hooks/object/qrObject'


const QrCodeVDPModalScreen = (props) => {

  
  const goBack = () => {
    navigation.pop();
  }
    
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {}; 
   
const styledTheme = {};
    return (
         <ThemeProvider theme={styledTheme}>
           <View style={{backgroundColor:'#00000077',marginTop:300}}>
              <Button onPress={goBack} title="goBackLabel"/>
           </View>
          </ThemeProvider>
    )        
}

export default QrCodeVDPModalScreen