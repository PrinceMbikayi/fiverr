import '_brand/templates/screens/addObject/locales'
import React , {useEffect, useState, useRef} from 'react';
import { PermissionsAndroid,Text, View, Platform, Alert, Linking, ActivityIndicator } from 'react-native';
import {CommonObjectSettings} from '_brand/templates/components/objects/shutters/components/CommonObjectSettings'
import { Button } from 'react-native-elements';
import { useNavigation,useRoute, StackActions } from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {H1, P, HR, VSeparator} from '_brand/templates/styled';

import { useTheme } from '_theming/themeProvider';
import { useObject } from '_hooks/object';

import ModalContainer from '_brand/templates/components/ui/modal/modalContainer';
import {useGlobalModal} from '_components/ui/globalModal';
import handlePersmissions  from '_hooks/ble/permissions';
import {GlobalToastWithImage} from '_brand/templates/components/objects/common/GlobalToastWithImage'
import { RenderLoading } from  '_brand/templates/screens/addObject/components/RenderLoading';

export const SesameSettingsScreen = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};
  const {itemId} = navigationParams || {};
  console.log('SESAME_SETTINGS_NAVS_PARAMS :', navigationParams);

  const {t, i18n} = useTranslation();
  const tns = "addObject"

  //////////////////////////////////////////////////////
  const [loading, setLoading] = useState(false)
  const messageRef = useRef("")
  const modalTitleColorRef = useRef("#3E495E")
  const modalToastBgColorRef = useRef("white")
  const modalBodyTextColorref = useRef("#3E495E")
  const modalToastTitleRef = useRef(t("account:WARNING"))
  const buttonsRef = useRef([...permissionsButtons])


  useEffect(()=> {
  
  },[loading]);

  const buttons = [
    {
        id:"return",
        text:`${t(tns + ":" + "CANCEL")}`,
        action:()=>onCancelPressed(),
        textColor:"#007AFF"
    },
    {
        id:"validate",
        text:`${t(tns + ":" + "ACTIVATE")}`,
        action:()=>onValidate(),
        textColor:"#007AFF"
    }
  ]

  const permissionsButtons = [
    {
        id:"return",
        text:`${t(tns + ":" + "CANCEL")}`,
        action:()=>onCancelPressed(),
        textColor:"#007AFF"
    },
    {
        id:"validate",
        text:`${t(tns + ":" + "SETTINGS")}`,
        action:()=>goPermissions(),
        textColor:"#007AFF"
    }
  ]
    const onCancelPressed = () => {
    console.log('CANCEL_DELETE :');
    globalModal.close();
  }
    const onValidate = () => {
    onActivateDeviceBlooth()
    navigation.goBack()
    globalModal.close();
  }

  const goPermissions=()=>{
    Linking.openSettings()
    navigation.goBack()
    //navigation.navigate("AddObject")
    globalModal.close();
  }

  const onOpenSelect = () => {  
      const content = (
        <View style={{width:"95%", backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
            <GlobalToastWithImage 
                toastTitle={t(tns + ":" + "WARNING")}
                //toastBody={t(tns + ":" + "BLUETOTH_MANDATORY_FOR_OPROLL")}
                toastBody={messageRef.current}
                buttons={buttonsRef.current}
            />
        </View>
            )
      globalModal.setContent(content,{type:'centered'});    
      globalModal.toggle();
  }

  //////////////////////////////////////////////////////


  const { theme } = useTheme();
  const bgColor = theme?.prflxbgColor || 'white';
  const textColor = theme?.prflxTextColor || "#3E495E"

  const uObject = useObject(itemId);
  const {statuses} = uObject || {};
  console.log("SesameSettingsScreen navigationParams",navigationParams);
  console.log("SesameSettingsScreen statuses",statuses, uObject);

  const modalVisibleRef = useRef();
  const globalModal = useGlobalModal();

  const onCancel = () => {
    modalVisibleRef.current = false;
    globalModal.close();
  };


  const doNavigation = (destination) => {
    console.log('doNavigation_Har', destination,"so statuses",statuses);
    switch(destination) {
      case 'toWifi': 
          console.log("Connecting to Sesame...");
          const deviceName = statuses?.board_model?.toUpperCase() || "SAT-OPROLL";
          const bluetoothMac = statuses?.bluetooth_mac?.toUpperCase() ;

          let board_mac = statuses?.board_mac || statuses?.wifi_mac || null;
          if(board_mac) {
            board_mac = board_mac?.toUpperCase();
          }
          const paramsToPass = {...navigationParams,deviceName, bluetoothMac, board_mac,itemId}
          console.log("paramsToPass",paramsToPass);
          navigation.navigate("SesameSettingsWifi",paramsToPass);
      break;
    }
  }


  const onConfirmNear = () => {
    globalModal.close();

    doNavigation('toWifi');
    // Restore Stack
      // const popAction = StackActions.popToTop();
      // navigation.dispatch(popAction);
  };

  const onActivateDeviceBlooth = async () => {
    if (Platform.OS == 'android') {
      await BluetoothStateManager.requestToEnable();
      globalModal.close()
    }
    if (Platform.OS == 'ios') {
      console.log('so open settings !!!!');
      globalModal.close()
      Linking.openURL('App-prefs:root=Bluetooth');
    }
  };

  const popupButtonsNoBlueTooth = [
    {label: t(tns + ':' + 'CANCEL'), callback: onCancel, altStyle: true, noBorder: true},
    {
      label: t(tns + ':' + 'BLE_ACTIVATE_LABEL'),
      callback: onActivateDeviceBlooth,
      altStyle: false,
      noBorder: true,
    },
  ];

  const popupButtonIosNoBlueTooth = [
    {label: t(tns + ':' + 'CANCEL'), callback: onCancel, altStyle: false, noBorder: false},
        {
      label: t(tns + ':' + 'BLE_ACTIVATE_LABEL'),
      callback: onActivateDeviceBlooth,
      altStyle: false,
      noBorder: true,
    },
  ];


  const handleOnPress =()=>{
  Linking.openSettings()
  navigation.goBack()
  //NavigationService.navigate("AddObject")
}

const soGoBack =()=>{
  navigation.goBack()
}

  const showConfirmNear = async () => {
      const blueToothState = await BluetoothStateManager.getState();
      modalVisibleRef.current = false;
      console.log('showConfirmNear_blueToothState', blueToothState);

      let notConnected = t(tns + ':' + 'BLE_NOT_ENABLED_ON_DEVICE');
      let modalButtons = [];
      if (Platform.OS == 'ios') {
        notConnected += '\n' + t(tns + ':' + 'BLE_ACTIVATE_PLEASE');
      }
      if (blueToothState == 'PoweredOn') {
        modalButtons = [
          {label: t(tns + ':' + 'CANCEL'), callback: onCancel, altStyle: true, noBorder: true},
          {
            label: t(tns + ':' + 'CONTINUE'),
            callback: onConfirmNear,
            altStyle: false,
            noBorder: true,
          }
        ];
      } else {
        if (Platform.OS == 'ios') {
          modalButtons = popupButtonIosNoBlueTooth;
        } else {
          modalButtons = popupButtonsNoBlueTooth;
        }
      }

      let description = (
        <View style={{justifyContent:'center', alignItems:'center', padding:0, backgroundColor:'transparent'}}>
          <View style={{justifyContent:'center', alignItems:'center', marginBottom:20}}>
            <Text style={{fontWeight:'600',textAlign:'center', fontSize:16, color:textColor}}>
              {t(tns + ':' + 'ARE_YOU_CLOSE_TO_OPROLL')}
            </Text>
          </View>
          <View style={{justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontWeight:'400',textAlign:'center', fontSize:14, color:textColor}}>
              {t(tns + ':' + 'CHANGE_OPROLL_WIFI_INSTRUCTIONS')}
            </Text>
          </View>

        </View>
      );


      const content = (
        <ModalContainer
          title={""}
          //title={t(tns + ':' + 'BLE_MANDATORY_TITLE')}
          // illustration={
          //   <View style={{width: 300,}}>
          //     {/*<ComeCloser />*/}
          //   </View>
          // }
          //illustrationPos="top"
          description={description}
          buttons={modalButtons}
          hideCloseButton
        />
      );
      globalModal.setContent(content, {type: 'centered'});
      globalModal.open();

  };

  const addBluetoothListener = () => {
  BluetoothStateManager.onStateChange(bluetoothState => {

    console.log('BluetoothStateManager onStateChange', bluetoothState);


    console.log(
      'BlueTooth listener',
      bluetoothState,
      Number(globalModal.isVisible).toString(),
    );

    if (bluetoothState == 'PoweredOn') {
      console.log('so............');

      if (modalVisibleRef.current) {
        //globalModal.close();
        showConfirmNear();
      }
    } else {
    }

    console.log('UFX bluetoothState', bluetoothState);
  }, true);
};

  useEffect(() => {
    addBluetoothListener();
  }, []);

  const handleConnect = async() => {
    //Check first if BLE permission is granted
    setLoading(true)
    const result = await handlePersmissions();
    console.log('RESULT_BLE_CHECK_PERMISSION :', result);
    // const blePermission = (Platform.OS === 'ios')? result: result["blePermissionOk"]
    // console.log('OKH :', blePermission);

    if(Platform.OS === 'ios'){
        if(result == 'on'){ // BLE is ON
              //navigation.navigate("BleEquipmentSearchScreen",{"deviceType":"SesameGate",references:["SAT-OPROLL"]})
              //setLoading(false)
              showConfirmNear();
        }else if(result == 'off'){
                modalToastTitleRef.current =""
                messageRef.current = t(tns + ":" + "BLUETOTH_MANDATORY_FOR_OPROLL")
                modalBodyTextColorref.current = textColor
                buttonsRef.current =buttons
                //setLoading(false)
                onOpenSelect()
        }else{
            modalToastTitleRef.current =t(tns + ":" + "BLE_ACCESS") //à utiliser le Bluetooth ?
            messageRef.current = t(tns + ":" + "GIVE_CALYPSHOME_BLUETOOTH_PERMISSION")
            modalBodyTextColorref.current = textColor
            buttonsRef.current = permissionsButtons
            //setLoading(false)
            onOpenSelect()
        }
    }else{
      const blePermission = (Platform.OS === 'ios')? result: result["blePermissionOk"]
      if(blePermission){
        //setLoading(false)
        showConfirmNear();
      }else{
  
            modalToastTitleRef.current =t(tns + ":" + "BLE_ACCESS") //à utiliser le Bluetooth ?
            messageRef.current = t(tns + ":" + "GIVE_CALYPSHOME_BLUETOOTH_PERMISSION")
            modalBodyTextColorref.current = textColor
            buttonsRef.current = permissionsButtons
  
            onOpenSelect()
      }
    }


  }

  const onLoadingCancel = ()=>{
    setLoading(false)
  }


    return (
        <View style={{backgroundColor:"transparent",flex:1}}>
            <View style={{height:'100%', backgroundColor:"transparent",justifyContent:"center",alignItems:"center"}}>
                 <CommonObjectSettings changeWifiSettings={handleConnect}/>
            </View>
           
        </View>
    )
}



    // {loading &&
    //   <View style={{marginTop:90}}>
    //     <Text>
    //         {t(tns + ":" + "CHECK_BLE_PERMISSION")}
    //     </Text>
    //       <ActivityIndicator  size="large" color='#3E495E' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}/>
    //   </View>
    // }