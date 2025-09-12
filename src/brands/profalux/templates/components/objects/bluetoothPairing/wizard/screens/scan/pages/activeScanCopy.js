import '_brand/templates/screens/addObject/locales'
import React from 'react';
import {useContext, useState, useEffect, useRef} from 'react';
import {Text,View,ScrollView,Image,TouchableOpacity,StyleSheet} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {useBleContext} from '_hooks/ble/bleContext';
import {useTheme} from '_theming/themeProvider';
import {H1, H2, H3, P, VSeparator} from '_brand/templates/styled';
import Button from '_brand/templates/components/ui/Button';
//----- extra components -------------

const RoundCheck = () => {
  const {theme, baseColors} = useTheme();
  const radius = 20;
  const backgroundColor = theme.success_medium || 'orange';
  return (
    <View style={{width: 2 * radius,height: 2 * radius,borderRadius: radius,position: 'absolute',
        bottom: 0,right: 0,backgroundColor: backgroundColor,justifyContent: 'center',}}
      >
        <View style={{width: 24, height: 24, alignSelf: 'center'}}>
      </View>
    </View>
  );
};
const DeviceImage = props => {
  const {theme, baseColors} = useTheme();
  const {imageSource} = props;
  const source = "" //productImages[imageSource];
  const radius = 82;
  const imagePadding = 8;
  const bgColor = 'white';
  const borderColor = theme.success_medium || 'orange';
  return (
    <View
      style={{
        backgroundColor: bgColor,
        width: 2 * radius,
        height: 2 * radius,
        borderRadius: radius,
        borderColor: borderColor,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={source}
        style={{
          backgroundColor: bgColor,
          width: 2 * (radius - imagePadding),
          height: 2 * (radius - imagePadding),
          borderRadius: radius - imagePadding,
        }}
      />
      <RoundCheck />
    </View>
  );
};

//=============== MAIN COMPONENT START HERE =========================

const ActiveScanPage = props => {
  const {
    canStart,
    addProduct,
    strictType,
    deviceType,
    productReferences,
    advice,allCharacteristics
  } = props;
  console.log("AZZZZZZZ ActiveScanPage props",props)


const Advice = () => {
  const DynComp = props.advice;
  if(DynComp) {
    return (<DynComp/>)
  } else {
    return null
  }
  

}



  const {t, i18n} = useTranslation();
  const tns = 'bluetooth';
  const tnsp = 'productRelated';

  const {theme, baseColors} = useTheme();
  const {
    bgColor,
    textColor,
    headerBackgroundColor,
    headerTextColor,
  } = baseColors;

  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};
  // componentDidMount && unmount

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
  const [pairingAccepted, setPairingAccepted] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const listenToDisconnectPeripheral = e => {
    console.log('[listenToDisconnectPeripheral] =>', e);
    setWaitForPairing(false);
    setPairingError(true);
  };

 
  const goBack = () => {
    console.log('goBack !!!!!++');
    navigation.navigate('Settings');
  };

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
    console.log("***************************************************");

    console.log("SHOULD USE initBle INSTEAD just try it")
    const params = {deviceInfos:{...foundDevice},deviceCharacteristics: deviceCharacteristics,isWizard:true};
    console.log("onPAriProduct",params)
    const isInit = await uBleContext.initBle(params);

    console.log("********** isInit ***************",isInit);
    // was used previously
    //uBleContext.selectDevice(toSelect);
    
   // uBleContext.setCurrentDevice(foundDevice);
    console.log('onPairProduct !!!');
   

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



  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: 'red', margin: 15}}>
    
        {progress == "scanning" && (
          <>
            <H2>{t(tns + ':' + 'SEARCH_A_DEVICE')}</H2>
          </>
        )}
        {scanStatus == "notFound" && (
         
            <>
              <H1>{t(tns + ':' + 'DEVICE_NOT_FOUND_TITLE')}</H1>
              <VSeparator />
              {devicesAlreadyHere.length > 0 && (
                <>
                  <H3>
                    {t('bluetooth' + ':' + 'ALREADY_HERE_IN_NOT_FOUND', {
                      count: devicesAlreadyHere.length,
                    })}
                  </H3>
                  {devicesAlreadyHere.map((v, i) => {
                    return <Text key={"ato_"+i}>- {v.name}</Text>;
                  })}
                 
                </>
              )}
               {advice && 
                    <Advice/>
                  }
              <VSeparator />
              
            </>
       
        )}

        <View style={{marginTop: 16, marginBottom: 16}}>
          {progress == 'scanning' && (
            <View style={{height: 180, backgroundColor: 'transparent'}}>
              {/*}
              <LottieView
                source={require('../../../../lotties/55186-bluetooth.json')}
                autoPlay
                loop
              />
            */}
            </View>
          )}
          {progress == "found" && (
            <>
           
            
            {foundDevices.map((v, i) => {
              return (
                <TouchableOpacity style={styles.item} key={`found_device_${i}`} onPress={() => {onAddProduct(v)}}>
                <Text key={`found_device_${i}`}>{v.name} ({v.id})</Text>
                </TouchableOpacity>
              )
              })
            }
            </>
          


          )}
          {progress == "notFound" && (
            <>
              {helpImage}

              <Button
                title={t(tns + ':' + 'REPEAT_BUTTON')}
                onPress={onRestartScan}
              />
              {1 == 2 && (
                <>
                  <Text style={{marginTop: 20, marginBottom: 20}}>
                    You may need to remove device from paired objects in your
                    device bluettoth settings
                  </Text>
                  <Button
                    title={t(tns + ':' + 'OPEN SETTINGS')}
                    onPress={openSettings}
                  />
                </>
              )}
            </>
          )}
          {progress=="waitForPairing" && (
            <>
              {Platform.OS == 'android' && (
                <>
                  <View style={{height: 180, backgroundColor: 'transparent'}}>
                 
                  </View>
                  <View style={{marginTop: 8, marginBottom: 8}}>
                    <H1 style={{textAlign: 'center'}}>
                      {t(tns + ':' + 'ACCEPT_PAIRING_TITLE')}
                    </H1>
                    <VSeparator />
                    <H2>{t(tns + ':' + 'ACCEPT_PAIRING_BODY')}</H2>
                  </View>
                </>
              )}
              {/*<Button  title={t(tns+":"+"ADD_PRODUCT")} onPress={onAddProduct} disabled={!pairingAccepted}/>  */}
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

        {/* for debug only ==================== 
                Object.keys(devicesFoundRef?.current).map((v,i) => {
                const item = devicesFoundRef?.current?.[v];

                let toDisplay = (item?.name || item?.labelName || "");
                toDisplay+= ((toDisplay!="")? " ":"" )+ "\n\t"+'id ( '+(item?.id || "")+' )';

                if(item.name == undefined) return null;

                return (
                    <Pressable onPress={() => {console.log(item);testBLEdevice(item)}} key={"ble_device_found_"+item?.id} style={{padding:10,marginBottom:10,borderColor:textColor,borderWidth:1}}>
                        <Text style={{color:textColor}}>- {toDisplay}</Text>
                    </Pressable>
                )
            })
            =================================*/}
      </ScrollView>
    </>
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
