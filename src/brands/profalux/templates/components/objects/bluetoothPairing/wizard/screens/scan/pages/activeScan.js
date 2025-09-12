import '_brand/templates/screens/addObject/locales'
import React from 'react';
import {useContext, useState, useEffect, useRef} from 'react';
import {Text,View,ScrollView,SafeAreaView,TouchableOpacity,StyleSheet} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {useBleContext} from '_hooks/ble/bleContext';
import {useTheme} from '_theming/themeProvider';
import {H1, H2, H3, P, VSeparator} from '_brand/templates/styled';
import Button from '_brand/templates/components/ui/Button';
import { RenderLoading } from  '_brand/templates/screens/addObject/components/RenderLoading';
import { BleDevicesFoundScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/BleDevicesFoundScreen';
import { OPRollBleActivationInfosScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/OPRollBleActivationInfosScreen';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import {useGlobalModal} from '_components/ui/globalModal'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import useSwipeBackDisabler from '_hooks/swipe';


const ActiveScanPage = props => {
  const {
    canStart,
    addProduct,
    strictType,
    deviceType,
    productReferences,
    advice,allCharacteristics
  } = props;

  const Advice = () => {
    const DynComp = props.advice;
    if(DynComp) {
      return (<DynComp/>)
    } else {
      return null
    }
    
  }
  
  //useSwipeBackDisabler()
  const globalModal = useGlobalModal(); 


  const {t, i18n} = useTranslation();
  const tns = 'addObject';
  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};

  const uBleContext = useBleContext();

  console.log("ActiveScanPage uBleContext");

  const [progress, setProgress] = useState("scanning");

  const {
    scanStatus,
    foundDevice,
    foundDevices = [],
    startScan,
  
    devicesAlreadyHere = [],
  } = uBleContext;

  useEffect(() => {
      console.log('****** ActiveScanPage found device *******', foundDevice);
  }, [foundDevice]);

    useEffect(() => {
      console.log('****** ActiveScanPage found devices important le S *******', foundDevices);
  }, [foundDevices]);


  const [waitForPairing, setWaitForPairing] = useState(false);
  const [pairingError, setPairingError] = useState(false);

  useEffect(() => {
    if (canStart) {
      console.log('active scan page start ++', canStart, Date.now());
      const options = {
        strictType: strictType,
        deviceType: deviceType,
        productReferences: productReferences,
      };
      startScan(options);
    }
  }, [canStart]);


  useEffect(()=> {
    console.log("scanStatus changed",scanStatus)
  },[scanStatus]);

  useEffect(()=> {
  switch(scanStatus) {
    case 'found':
      setProgress("found");
      break;

    case 'stopped':
      console.log("scanStatus stopped")
      console.log("foundDevice",foundDevice)
      break;
      default:
        setProgress(scanStatus);
  }
  },[scanStatus]);




  useEffect(() => {
    //just redraw
    // console.log("showEnabled !!!!!!",showEnabled)
  }, [waitForPairing, pairingError]);



  useEffect(()=> {
  
  },[waitForPairing]);

  const onPairProduct = async (directDevice) => {
    console.log('onPairProduct YYYYYYYYYYYYYYYEEEEEEEEEEESSSSSSSSSSSSSS');
    setProgress("waitForPairing");

    const foundDevice = directDevice || uBleContext.foundDevice;

    console.log('onPairProduct Method', foundDevice);
    const deviceReference = foundDevice?.reference;
    const deviceCharacteristics = allCharacteristics[deviceReference].settings || {};
   
   const toSelect = {
      ...foundDevice,
      characteristicsByName: deviceCharacteristics || {},
    };
    console.log('*****************> toSelect', JSON.stringify(toSelect));

    console.log("SHOULD USE initBle INSTEAD just try it")
    const params = {deviceInfos:{...foundDevice},deviceCharacteristics: deviceCharacteristics,isWizard:true};
    console.log("onPAriProduct",params)
    const isInit = await uBleContext.initBle(params);

    console.log("********** isInit ***************",isInit);
   
    if(isInit) {
     //  onAddProduct();
     console.log("fini");
     addProduct(directDevice)
    } else {
     // setProgress("pairingError");
    }
  
  };

  const onAddProduct = (directDevice) => {

    const addThisDevice = directDevice || foundDevice;
    if (addProduct) {
      console.log('onAddProduct', addThisDevice);
      onPairProduct(addThisDevice);
      //addProduct(addThisDevice);
      
    }
  };

  const {help: notFoundHelp, tnsKey, helpImage = null} = navigationParams;

  const onRestartScan = () => {
    const goBackDestination = navigationParams?.goBackDestination
    if(goBackDestination) {
      navigation.navigate(goBackDestination)
    } else {
      navigation.goBack();
    }
   
  };

  const openSettings = () => {
    BluetoothStateManager.openSettings();
  };

  const onCancelAddProduct = () => {
    console.log('Annule add product');
    navigation.goBack();
  };


    const onLoadingCancel = () => {
      navigation.navigate("AddObject")
      //navigation.navigate("BluetoothActivationWarningScreen")
      //navigation.navigate("garageDoorBleAssistantHomeScreen")
  }
    const onPairingLoadingCancel = () => {
navigation.navigate("garageDoorBleAssistantHomeScreen")
      //navigation.navigate("BluetoothActivationWarningScreen")
      //navigation.navigate("garageDoorBleAssistantHomeScreen")
  }
  
  const handleNext = (device) => {
    onAddProduct(device)
    console.log("NEXT_PAGE");
  };

  const handleNoVisibleDevice = () => {
    onOpenSelect()
  }


  //???????????????????????????????????????????????????????????
      const buttons = [
          {
              id:"return",
              text:`${t(tns + ":" + "RETURN")}`,
              action:()=>onCancelPressed(),
              textColor:"#007AFF"
          },
          // {
          //     id:"validate",
          //     text:`${t(tns + ":" + "ACTIVATE")}`,
          //     action:()=>onValidate(),
          //     textColor:"#007AFF"
          // }
      ]
  
    const onCancelPressed = () => {
      navigation.navigate("AddObject")
      globalModal.close();
    }
    const onValidate = () => {
      navigation.navigate("garageDoorBleAssistantHomeScreen")
      globalModal.close();
    }
  
    const onOpenSelect = () => {  
        const content = (
          <View style={{width:"95%", backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
              <GlobalToast 
                  toastTitle={t(tns + ":" + "BLE_ON_OPROLL")}
                  toastBody={`${t(tns + ":" + "ACT_ON_OPROLL_TO_ACTIVATE_BLE")} \n \n ${t(tns + ":" + "OPROLL_BLE_ACTIVATED_SIGNAL")}`}
                  buttons={buttons}
              />
          </View>
              )
        globalModal.setContent(content,{type:'centered'});    
        globalModal.toggle();
    }
  //???????????????????????????????????????????????????????????
  const handleBack = () => {
      navigation.navigate("garageDoorBleAssistantHomeScreen")
  }

  const titleConfig = {
    "notFound": t(tns + ":" + "BLE_ON_OPROLL"),
    "scanning": t(tns + ":" + "BLE_SEARCHING"),
    "found": t(tns + ":" + "BLE_EQUIPMENTS"),
    "waitForPairing": t(tns + ":" + "BLE_WAIT_FOR_PAIRING"),
    "pairingError": t(tns + ":" + "BLE_PAIRING_ERROR"),
    "notFoundHelp": notFoundHelp || t(tns + ":" + "BLE_NOT_FOUND_HELP"),
  }



  return (
    <SafeAreaView style={{flex: 1,}}>
      <View style={{flex: 1, backgroundColor: 'transparent', marginTop:20}}>
        <HeaderScreen title={titleConfig[scanStatus]} withBack={true} goBack={handleBack} />
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, backgroundColor: 'transparent', margin: 10}}>
      
          {scanStatus == "notFound" && (
            <View style={{alignItems: 'center', justifyContent: 'center',width: '100%'}}>
              <OPRollBleActivationInfosScreen/>
            </View>
          )}

          <View style={{marginTop: 16, marginBottom: 16, backgroundColor:'transparent'}}>
            {progress == 'scanning' && (
              <View>
                  <RenderLoading topText={t(tns + ":" + "SEARCHING_PHONE_NEEDS_TO_BE_NEAR")} cancelLoading={onLoadingCancel}/>
              </View>
            )}

            {progress == "found" && 
              <View>
                  <BleDevicesFoundScreen 
                    devices={foundDevices} 
                    onNext={handleNext} 
                    handleEquipmentNotVisible={handleNoVisibleDevice}
                  />
              </View>
            }

            {progress == "notFound" && (
              <View style={{ width: '90%', marginTop: 20}}>
                      <MyButton onPress={()=>console.log("Hello No device Found")} title={t(tns + ":" + "YOUR_EQUIPMENT_NOT_VISIBLE")} />
              </View>
            )}

            {progress=="waitForPairing" && (
              <>
                <RenderLoading topText={t(tns + ":" + "BLE_ON_PAIRING")} cancelLoading={onPairingLoadingCancel}/>
              </>
            )}
            {progress == "pairingError" && (
              <>
                <View style={{height: 180, backgroundColor: 'transparent'}}>
                
                </View>
                <View style={{marginTop: 8, marginBottom: 8}}>
                  <H2 style={{textAlign: 'center'}}>
                    {t(tns + ':' + 'PAIRING_FAILED_TITLE')}
                  </H2>
                  <VSeparator />
                  <H3 style={{textAlign: 'center'}}>
                    {t(tns + ':' + 'PAIRING_FAILED_BODY')}
                  </H3>
                </View>
                <Button title={t('OK')} onPress={onCancelAddProduct} />
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const ActiveScanPageMemoized = React.memo(ActiveScanPage);

export default ActiveScanPageMemoized;


const styles = StyleSheet.create({
  item: {
    padding: 8,
    borderRadius: 8,
    margin:4,
    backgroundColor: '#1af37870',
  },
  gaugewrapper: {
    width: '100%',
    height: 240,
    backgroundColor: '#DDD',
  },
});
