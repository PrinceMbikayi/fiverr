import React,{useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Pressable, SafeAreaView } from 'react-native';
import {useTranslation} from 'react-i18next';
import styled, {ThemeProvider} from 'styled-components/native';
import {useTheme} from '_theming/themeProvider';
import ModalContainer from '_brand/templates/components/ui/modal/modalContainer';
import PageContainer from './pageContainer';
import {VSeparator} from '_brand/templates/styled';
import { devicesConfig } from '../../../ble/devicesConfig'

//------ navigation ------------
import {
  useNavigation,
  useRoute,
  StackActions,
  CommonActions,
} from '@react-navigation/native';

import WifiIcon from '_brand/images/icons/app/profaluxIconJs/WifiIcon'
import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import { MyButton } from '_brand/templates/components/ui/MyButton';
import useSwipeBackDisabler from '_hooks/swipe';
//------- popups -----------------

import {ScanNetworks,FoundNetworks} from '../popups/networks';
import useWifiCtrl from '_hooks/ble/bleWifiCtrlHook';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import {useGlobalModal} from '_components/ui/globalModal'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import * as Actions from '_actions/objects';
import { useDispatch } from 'react-redux';
import { deleteObject } from '_api/objects';
import { myToast } from '_brand/templates/components/ui/myToast';

const SelectNetworkPage = (props) => {
    
useKeepAwake();
useSwipeBackDisabler();
const globalModal = useGlobalModal(); 
const dispatch = useDispatch();
const navigation = useNavigation();
const route = useRoute();
const navigationParams = route?.params || {};
const {isWizard,objectId} = navigationParams || {};

  const { theme } = useTheme();
  const bgColor = theme?.prflxbgColor || 'white';
  const textColor = theme?.prflxTextColor || "#3E495E"


console.log("WIFI SelectNetworkPage params",JSON.stringify(navigationParams));
    const uWifiCtrl = useWifiCtrl();
    const {dataModel} = uWifiCtrl || {};
    const {currentSSID, wifiList:foundNetworks} = dataModel || {};

    console.log("routes",JSON.stringify(navigation.getState().routes));

/*
{"isWizard":false,"next":false,"mandatory":true,"name":"qsdfgh","id":301634,"macAddress":null,"bluetoothMac":"C4:4E:AE:00:00:0D","deviceRef":"EXT-7610XX","deviceName":"EXT-761003","unconnectedBleDevice":true,"updateWifi":true}

*/

const doConnectionIfNeeded = () => {
    console.log("doConnectionIfNeeded",JSON.stringify(navigationParams));
    const characteristics = devicesConfig?.[navigationParams?.deviceName]?.settings;
    console.log("doConnectionIfNeeded, characteristics",JSON.stringify(devicesConfig));
    
    if(!navigationParams?.isWizard) {
        const initBleParams = {
                                "deviceInfos":
                                {
                                    "id":navigationParams?.bluetoothMac,
                                    "name":navigationParams?.deviceName,
                                    'board_mac':navigationParams?.board_mac,
                                },
                                "deviceCharacteristics": characteristics
                            };

        console.log("initBleParams +++ ",JSON.stringify(initBleParams));
        uWifiCtrl.initBle(initBleParams);
    }
}

useEffect(()=> {
    doConnectionIfNeeded();
},[]);



   const getNetworks = async () => {
    console.log('get networks in bluetoothpairing wifiSetup' );  
   await uWifiCtrl.doGetWifiList();   
  };


    const onNetworkSelected = (network) => {
        console.log("onNetworkSelected",network);
       
    }


    useEffect(()=> {
        console.log("foundNetworks changed in select page",JSON.stringify(foundNetworks));
       
    },[foundNetworks]);

    const {goNext} = props;
    const doCallback = () => {
        console.log("doCallback => showNetworksPopUp");
        displayScanPopup()
        getNetworks(); // Call getNetworks when the button is pressed
    };


    const selectNetwork = (network) => {
        console.log("selectNetwork",network);
       
        navigation.navigate('WifiBleConnect', {SSID:network,isWizard:isWizard, objectId:objectId?.itemId});
    }

    const onValidateNetwork = (network) => {
        console.log("onValidateNetwork",network);
        selectNetwork(network); // Call the onSelectNetwork prop
        globalModal.hide();
    }
 
    useEffect(()=> {
        console.log("in SelectNetworks page foundNetworks",JSON.stringify(foundNetworks));
        if(foundNetworks && foundNetworks.length > 0) {
            console.log("foundNetworks",JSON.stringify(foundNetworks));

            globalModal.setContent(<FoundNetworks networksDatas={foundNetworks} onCancel={globalModal.hide} onSelect={onNetworkSelected} onValidate={onValidateNetwork}/>,{type:'centered'});   
            globalModal.show()     
        }
    },[foundNetworks]);

    const {t} = useTranslation();
    const tns = 'addObject';
    
  


    
    const displayScanPopup = () => {
        globalModal.setContent(<ScanNetworks/>,{type:'centered'});   
        globalModal.show()     
    }


   useEffect(()=> {
    console.log("currentSSID changed in select page",JSON.stringify(currentSSID));
   },[currentSSID]);

   const title = t(tns + ":" + "WIFI_NETWORK")


    const doPass = () => {
        console.log("doPass");
        navigation.navigate('WifiBleConnect', {SSID:currentSSID});
    }

    const popupButtons = () => {
    return [
      {label: t(tns + ':' + 'WIFI_POPUP_BUTTON_OK'), callback: onAccept},
      {
        label: t(tns + ':' + 'IGNORE_BUTTON'),
        callback: endHere,
        altStyle: true,
        noBorder: true,
      },
    ];
  };

  const doWarnUser = () => {
    const content = (
      <ModalContainer
        title={t(tns + ':' + 'WIFI_POPUP_TITLE')}
        description={t(tns + ':' + 'WIFI_POPUP_BODY')}
        illustration={null}
        illustrationPos="afterDescription"
        buttons={popupButtons()}
        hideCloseButton={true}
      />
    );

    globalModal.setContent(content, {type: 'centered'});
    globalModal.toggle();
  };

 const onAccept = () => {
    globalModal.close();
  };

  const endHere = resetHere => {
      console.log("so please pass here !!!")
     // uBleWizard.disconnectDevice();
      const destination = 'Accueil';
      globalModal.close();
  
      if (!isWizard) {
        navigation.goBack();
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: resetHere}],
          }),
        );
        navigation.navigate(destination);
      }
    };

    const cancelWizard = () => {
        console.log("cancelWizard :", navigationParams);
        if(isWizard == 0) {
            navigation.dispatch(StackActions.pop(1));
        }
        else {
          console.log('CHECK_POINT_CANCEL_WIZARD', navigationParams);
          onOpenSelect();
        }
    }


    //???????????????????????????????????????????????????????????
        const buttons = [
            {
                id:"return",
                text:`${t(tns + ":" + "RETURN")}`,
                action:()=>onCancelPressed(),
                textColor:"#007AFF"
            },
            {
                id:"validate",
                text:`${t(tns + ":" + "TO_STOP")}`,
                action:()=>onValidate(),
                textColor:"red"
            }
        ] 

    
      const onCancelPressed = () => {
        console.log('CANCEL_DELETE :');
        globalModal.close();
      }
      const onValidate = async() => {
        // Delete created Sesame
        const newSesameId = objectId?.itemId;
        console.log('NEW_SESAME:',newSesameId);
        globalModal.close();
        const res = await deleteObject(newSesameId).catch((err) => { console.log(err) });
        console.log('DELETE_SESAME_ON_CREATION :', res);

        if (res.errCode == 200) {
                    //navigate Home Screen
            navigation.navigate("AddObject")
            navigation.navigate("MaisonScreen")
            console.log('CHECK_POINT_DELETE 1', newSesameId);
            const action = Actions.objectDelete(newSesameId);
            dispatch(action)
        }else{
                const message = `Erreur ${res.errCode} : ${res.errMsg}`;
                const bgColor = 'red';
                const textColor = "white";
                const duration = 4000;
                myToast(message, bgColor, textColor, duration)
        }
      }
      
      const onOpenSelect = () => {  
          const content = (
            <View style={{width:"95%", backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                <GlobalToast 
                    toastTitle={t(tns + ":" + "WARNING")}
                    toastBody={t(tns + ":" + "STOP_EQUIPMENT_CONFIGURATION")}
                    buttons={buttons}
                />
            </View>
                )
          globalModal.setContent(content,{type:'centered'});    
          globalModal.toggle();
      }
    //???????????????????????????????????????????????????????????
    return (
        <PageContainer title={title}>
            <View style={{width:'100%', backgroundColor:'transparent', justifyContent:"center", alignItems:'center', marginVertical:20}}>
                <View style={{marginBottom: 20}}>
                  <EcoCard titlePart1={t(tns + ":" + "WIFI")} titlePart2={''} fontSize ={14} iconSize={33} Picto={WifiIcon}/>
                </View>
                <View style={{ paddingBottom: 16}}>  
                  <Text style={[styles.text,{color:textColor}]}>
                    {t(tns+":"+"WIFI_CHOOSE_NETWORK_TITLE")}
                  </Text>
                  <VSeparator height={24}/>
                  <View style={{ width: 200, marginTop: 20, alignSelf:'center'}}>
                          <MyButton onPress={doCallback} title={t(tns + ":" + "WIFI_CHOOSE_NETWORK")} />
                  </View>
                  <View style={{ width: 200, marginTop: 20, alignSelf:'center'}}>
                          <MyButton onPress={cancelWizard} title={t(tns + ":" + "CANCEL")} />
                  </View>
                  <VSeparator height={16}/>
          
                </View>
            </View>
        </PageContainer>
    );
};

export default SelectNetworkPage;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 10,
    textAlign: 'center',
  },
});