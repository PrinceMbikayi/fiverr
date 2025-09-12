import React from 'react';
import {useState, useRef, useEffect,forwardRef,useImperativeHandle} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  Linking,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';

import {useTranslation} from 'react-i18next';
import {
  useNavigation,
  useRoute,
  StackActions,
  CommonActions,
} from '@react-navigation/native';


import NetInfo from '@react-native-community/netinfo';
//-----------------------------------------------------


import { useBleContext } from './bleContext';
import { getWifiNetworks } from '_src/helpers/wifi';
import { get, set } from 'dot-prop-immutable';

//--------- in settings context (wifi) ------------------



const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));




const BleWifiCtrlHook = (props) => {

   console.log("BleWifiCtrlHook props",JSON.stringify(props));
    

    const uBleContext = useBleContext();
    const uBle = uBleContext;
   // console.log("BleWifiCtrlHook=>");//,JSON.stringify(uBleContext));

    const {
      read,
      write: bleWrite,
      getConnectedDevices,
      givenName,
      recordServerConnectingInfos,
      isConnected: realyBleConnected,
      objectId
    
    } = uBleContext;

    const [wifiStatus, setWifiStatus] = useState(null);

    const statusPoolingRef = useRef(false);
    useEffect(()=> {
      return () => {
         clearInterval(statusPoolingRef.current);
      }
    },[]);


   
    useEffect(()=> {
    
    },[wifiStatus]);


      useEffect(()=> {
        console.log("BleWifiCtrl useEffect strange ");//,JSON.stringify(uBleContext));
        /*
        if(!uBleContext?.selectedDevice?.id) {
          console.log("===========> so initBle Strange Here Attention  <============")
        uBleContext.initBle()
        console.log("===========> so initBle After <============")
        }
        console.log("BleWifiCtrlHook useEffect - selectedDevice",JSON.stringify(uBleContext.selectedDevice));
        */

      },[uBleContext]);

      const [dataModel, setDataModel] = useState({connectingStatus:"wait"});
      useEffect(()=> {
        console.log("********** dataModelChanges in Hook CTRL ",JSON.stringify(dataModel));
      },[dataModel]);

    const updateDataModel = (data) => {
      console.log("updateDataModel",JSON.stringify(data));
      setDataModel({...dataModel,...data})
    }



  const doGetWifiList = async () => {
    console.log("XXXXXXXX doGetWifi in bleWifiCtrl");
    const wifiList = await uBle.getWifiNetworks();
    console.log("wifiList",wifiList);
    updateDataModel({wifiList:wifiList});
  
    }

  //---------------------------------------------
  const {connectingStatus} = dataModel;

  const doRealConnection = async (SSID,password) => {
    console.log("XXXXX =========> doRealConnection ++",dataModel);
  

      const writeSSID = await bleWrite('WIFI_ssid', SSID);
      console.log('WRITE_SSID :', writeSSID);
      const writeBlePassW = await bleWrite('WIFI_password', password);
      console.log('WRITE_PSW :', writeBlePassW);
    // globalModal.close();
    const wc =  await bleWrite('WIFI_CONNECT', 1);
    console.log("WRITE_WIFI_CONNECT :",wc);
    startWifiStatusPooling();
    console.log("CHECK_WRITE_END");
    setDataModel({...dataModel,connectingStatus:"connecting"});
    // ---------- navigation (params) -----------------

  }


  useEffect(()=> {
    if(connectingStatus === "connecting") {
      console.log("---------------------> JSON.stringify(connectingStatus ZZZZZZZZZZZZZ)",JSON.stringify(connectingStatus));
      console.log("and .............> doRealConnection");
      doRealConnection();

      
    }
  },[connectingStatus]);
 
  const doInitBle = async (params) => {
    console.log("doInitBle in ctrl",JSON.stringify(params)); 
    const deviceModelRef = await uBle.initBle(params);
    console.log("doInitBle in ctrl deviceModelRef",deviceModelRef);
  }



  const connectToWifi = async (SSID,password) => {
    console.log("connectToWifi request");
    doRealConnection(SSID,password);
  // updateDataModel({connectingStatus:"connecting"});
  }



  const startWifiStatusPooling = () => {

    console.log('startWifiStatusPooling');
      // clear it and set it to false
      // so the test later isn't needed
      console.log('startWifiStatusPooling => clearInterval(statusPoolingRef.current)', statusPoolingRef.current);
      clearInterval(statusPoolingRef.current);
      statusPoolingRef.current = false;

      console.log('startPooling');
      //checkWifi()

      console.log(
        'so save recordServerConnectingInfos in case Bluetooth is closed when wifi is connected');
    // const soServerInfos = recordServerConnectingInfos();
      console.log("++ statusPoolingRef",statusPoolingRef.current);
      if (!statusPoolingRef.current) {
        checkWifiCountRef.current = 0;
        statusPoolingRef.current = setInterval(() => checkWifi(), 500);
      }
  };

  const wifiErrors = ['auth_failed', 'ssid_not_found', 'failed'];

  const maxWificheck = 80;
  const minWificheck = 10;
  const checkWifiCountRef = useRef(0);

  const checkWifi = async () => {
    console.log('before check wifi');
    const statusValue = await read('WIFI_STATUS');
    const status = statusValue.toLowerCase()
    console.log('checkWifi statusValue', statusValue);
    console.log('================ [wifiSetup -----> checkWifi', status);
   

  
    if (status.indexOf('ble read error') != -1) {
        console.log("[error] statusPoolingRef.current",statusPoolingRef.current);
      clearInterval(statusPoolingRef.current);
    }
    console.log("-------------S AAAAAAAAAA status",status);
    if (status == 1 || status == 'connected') {
      /*
        the status on_boarding will be turned into wifi_ok
        by the server
        don't need to look here
      */
     console.log("before sertDataModel");
      setDataModel({...dataModel,connectingStatus:"success"});
      console.log('----------------------->>>>> wifi connected statusPoolingRef.current', statusPoolingRef.current);

      clearInterval(statusPoolingRef.current);

      statusPoolingRef.current = null;
      if (removeBluetoothOnConnect || closeBlueTooth) {
        console.log(
          '[wifiSetup] removeBluetoothOnConnect ',
          removeBluetoothOnConnect,
        );
        console.log('uBleWizard.write("BLUETOOTH_ENABLE",0)');
        bleWrite('BLUETOOTH_ENABLE', 0);
      }
      setWifiStatus(status);
      setWifiConnected(1);
    } else {
      checkWifiCountRef.current = checkWifiCountRef.current + 1;

      if (
        (wifiErrors.indexOf(status) != -1 &&  checkWifiCountRef.current >= minWificheck) ||  checkWifiCountRef.current >= maxWificheck ) {
        clearInterval(statusPoolingRef.current);
        statusPoolingRef.current = null;

        setDataModel({...dataModel,connectingStatus:"error"});

        globalModal.setContent(content, {type: 'centered'}, onGoToStart);
        globalModal.toggle();
      }
    }
  }

  return ({
    dataModel,
    updateDataModel,
    doGetWifiList,  
    initBle:doInitBle,
    connectToWifi,
    wifiStatus,
    objectId
    }
  );
}



export default BleWifiCtrlHook;