//import '../../locales'
//import '_brand/templates/screens/addObject/locales';
import '_src/brands/profalux/templates/screens/addObject/locales/index.js';
import React from 'react';
import {useState, useRef, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ThemeProvider} from 'styled-components/native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  StackActions
} from '@react-navigation/native';
//-----------------------------------------------------
import {H1, H2, H3, P, VSeparator} from '_brand/templates/styled';
import Button from '_brand/templates/components/ui/Button';
import { useTheme } from '_theming/themeProvider';
import { RenderLoading } from  '_brand/templates/screens/addObject/components/RenderLoading';

import useBleCheck from '_hooks/ble/bleCheckHook';
import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import { MyButton } from '_brand/templates/components/ui/MyButton';
import BluetoothIcon from '_brand/images/icons/app/profaluxIconJs/BluetoothIcon'


// it seems uBle is in fact uBleContext , keep uBle or code reading purpose


const BleCheckScreen = props => {
 
  const {onAbortWizard,onErrorBack,debug} = props;
  const tns = 'addObject';

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

  const {t} = useTranslation();
  const navigation = useNavigation();

  const uBleCheck = useBleCheck();
  console.log("SESAME BleCheckScreen uBleCheck",JSON.stringify(uBleCheck));

  const {isPaired, isConnected,bleNotGranted,checkStatuses} = uBleCheck ;
  const {notFound,lostConnection,isWizard} = checkStatuses || {};


useEffect(()=> {
  console.log("bleCheckScreen  [visuel] checkStatuses =>",JSON.stringify(checkStatuses));
},[checkStatuses]);


 useEffect(()=> {
  console.log("bleCheckScreen ufx !!!!!!!",isPaired,isConnected,bleNotGranted);
 },[bleNotGranted,isConnected,isPaired,notFound,lostConnection]);

  


useEffect(()=> {
  console.log("bleCheckScreen isConnected",isConnected);
},[isConnected]);




const redoCheck = async () => {
  console.log('redoCheck inside bleCheck');
  uBleCheck.reset();
  if(onErrorBack) {
    onErrorBack();
  }
  if(onAbortWizard) {
    onAbortWizard();
  }
 
  
};

const onCancel = () => {
  navigation.goBack();
}

    let content = (
        <View style={{ backgroundColor: 'transparent', width: '100%',height:'100%', justifyContent: 'flex-start', alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: textColor, textAlign:'center', marginBottom:20 }} >
              {t(tns + ":" + "BLE_ON_OPROLL")}
              {/* {t(tns + ":" + "BLUETOTH_MANDATORY_FOR_OPROLL")} */}
            </Text>

            <View style={{ justifyContent:'space-between',marginBottom:70 }}>
                <EcoCard titlePart1={t(tns + ":" + "BLUETOOTH")} titlePart2={''} fontSize ={14} iconSize={33} Picto={BluetoothIcon}/>
            </View>
            <Text style={{ fontSize: 15, fontWeight: '400', color: textColor, textAlign:'center' }} >
              {t(tns + ":" + "ACT_ON_OPROLL_TO_ACTIVATE_BLE")}{"\n \n"} {t(tns + ":" + "OPROLL_BLE_ACTIVATED_SIGNAL")}
              {/* {t(tns + ":" + "BLUETOTH_MANDATORY_FOR_OPROLL")} */}
            </Text>
            <View style={{ width: '80%', marginTop: 50, alignSelf:'center'}}>
                    <MyButton onPress={onCancel} title={t(tns + ":" + "RETURN")} />
            </View>
        </View>
    )

  const handleCancelLoading = () => {
    console.log('IS_WIZARD',isWizard);
    navigation.dispatch(StackActions.pop(1));
   // navigation.navigate("garageDoorBleAssistantHomeScreen")
}

  return (

        <>

          {(isConnected !== true)&& 
              <View style={styles.body}>
              {!lostConnection && !bleNotGranted && !notFound &&
              <>
              {!isWizard && 
              <>
                  <View style={{justifyContent: 'center',alignItems: 'center',backgroundColor:"transparent",position:"relative"}}>
                        <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center', backgroundColor:'transparent', }}>
                            <Text style={[styles.text, { marginTop: 20, marginBottom: 60 }]}>
                                {t(tns + ":" + "BLE_TESTING_WHILE_CONNECTING")} 
                            </Text>
                            <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} />
                            <View style={{ width: "60%", marginTop: 200, marginBottom:20}}>
                                <MyButton onPress={handleCancelLoading} title={t(tns + ":" + "CANCEL")} />
                                <View style={{width:300, height:40}}></View>
                            </View>
                        </View>
                  </View>
                </>
              }
              {isWizard && 
              <>
                <View style={{justifyContent: 'center',alignItems: 'center',backgroundColor:"transparent",position:"relative"}}>
                  <View style={{width: 250, height: 250, alignSelf: 'center'}}>
                    {/*<ParingIllustration />*/}
                    {/* src/brands/umii/templates/components/objects/bluetoothPairing/lotties/55186-bluetooth.json */}
                    
                  </View>
                  <H2 color={textColor} centered>{t(tns + ':' + 'BLE_TESTING_WHILE_CONNECTING')}</H2>
                    <H3>{t(tns+":"+"BLE_ACCEPT_PAIRING")}</H3>
                </View>
              
                </>
              }
                </>
                }
                {bleNotGranted && (
                  <View>
                    <H1 color="blue">BLE NOT GRANTED</H1>
                  </View>
                )}
                
                {(notFound )&& (
                  <View style={{backgroundColor:'transparent', width:'100%', flex:1}}>
                  {content}
                </View>
                )}

                {(notFound && isWizard && 1 == 2)
                  && (
                  <>
                  <View style={{width: 250, height: 250, alignSelf: 'center'}}>
                    {/*<CheckBluetoothIllustration />*/}
                  </View>
                  <H3 color={textColor} centered>{t(tns + ':' + 'BLE_TESTING_FAILED')}</H3>
                  <VSeparator />
                <H1 color="green">Ben wizard</H1>
                  <VSeparator />
                  <Button
                    title={t(tns + ':' + 'BLE_REDO_TEST')}
                    onPress={redoCheck}
                    titleColor="black"
                  />
                </>
                  )
                
                }



                {(lostConnection && !notFound) && (
                  <View>
                    
                    {/* <H1 color={textColor}>{t('bluetooth' + ':' + 'BLE_CONNECTION_LOST_TITLE')}</H1>
                    <P color={textColor}>{t('bluetooth' + ':' + 'BLE_CONNECTION_LOST_BODY')}</P> */}

                    <View style={{justifyContent: 'center',alignItems: 'center',backgroundColor:"transparent",position:"relative"}}>
                        <Text style={{fontSize: 20, fontWeight: '600', color: textColor, margin: 10, marginBottom:30, textAlign:'center' }} >
                          {t(tns + ':' + 'BLE_CONNECTION_LOST_TITLE')}
                        </Text>
                        <Text style={{fontSize: 16, fontWeight: '400', color: textColor, marginVertical:40, textAlign:'center' }} >
                          {t(tns + ':' + 'BLE_CONNECTION_LOST_BODY')}
                        </Text>
                  </View>
                    
                    {(onAbortWizard || onErrorBack) && <Button titleColor={"white"} bgColor={textColor} title={t(tns + ':' + 'BLE_REDO_TEST')} onPress={redoCheck} />}
                  </View>
                )}
                {/*<P>Debug : {debug}</P>*/}
              </View>
          }
    </>
  )

};

export default BleCheckScreen;

const styles = StyleSheet.create({
  body: {
    zIndex: 100,
    padding:20,
    position: 'absolute',
    flex: 1,
    backgroundColor: 'white',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignContent: 'center',   
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flexWrap: 'wrap',
    lineHeight: 20,
    marginVertical: 10,
    color: '#3E495E'
  }
})
