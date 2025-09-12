//import '../../locales'
import React, { Children } from 'react';
import {useState, useRef, useEffect,forwardRef, useImperativeHandle} from 'react';

import {

  InteractionManager,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ThemeProvider} from 'styled-components/native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';

import {scanForDevicesWithNamePrefix,connectToDevices} from './bleIos';
//-----------------------------------------------------



// it seems uBle is in fact uBleContext , keep uBle for code reading purpose

const BleCheckScreenCtrl = forwardRef((props, ref) => {
  const {
    uBle,
    uObject,
    model,
    bleConnected,
    setBleConnected,
    connectionLost,
    allCharacteristics,
    children,
    /* use it to update container dataModel */
    updateDataModel,
    failedContent, testingContent,
    
  } = props;
  

  console.log("BleCheckScreenCtrl props.uBle");//,JSON.stringify(props.uBle));

  const firsTryRef = useRef(true);



  useImperativeHandle(ref, () => ({
    reset() {
      console.log("reset bleCheckScreenCtrl")
      //redoCheck();
    }
  }));


  const {isPaired,isConnected} = uBle;
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();
 

  useEffect(()=> {
    console.log("BleCheckScreenCtrl isConnected ===>",isConnected);
    updateDataModel({connected:isConnected});
  },[isConnected]);


  


  const styledTheme = {textColor: 'black'};

  return (
    <>
    {children}
    </>
  )
});

export default BleCheckScreenCtrl;
