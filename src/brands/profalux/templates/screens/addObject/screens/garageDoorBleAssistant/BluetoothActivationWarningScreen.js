import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Text, Button, Linking } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { getAllObjects, getObjectsByTypeName, getObjectsVisible } from '_helpers/selectors';
import { Api } from "_api";
import { getObjectById } from '_helpers/objects';

import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import { MyButton } from '_brand/templates/components/ui/MyButton';
import BluetoothIcon from '_brand/images/icons/app/profaluxIconJs/BluetoothIcon'
import WifiIcon from '_brand/images/icons/app/profaluxIconJs/WifiIcon'
import BluetoothStateManager from 'react-native-bluetooth-state-manager';


export const BluetoothActivationWarningScreen = () => {
    
    const navigation = useNavigation();

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const [bluetoothActivatedButton, setBluetoothActivatedButton] = useState(false);

    useEffect(()=> {
     console.log('BLE_STATE :', bluetoothActivatedButton);
    },[bluetoothActivatedButton]);

    /////////////////////---BLUETOOTH LISTENER---/////////////////////
       const onActivateDeviceBlooth = async () => {
         if (Platform.OS == 'android') {
           await BluetoothStateManager.requestToEnable();
         }
         if (Platform.OS == 'ios') {
           console.log('so open settings !!!!');
           Linking.openURL('App-prefs:root=Bluetooth');
           navigation.goBack()
         }
       };

    const addBluetoothListener = () => {
    BluetoothStateManager.onStateChange(bluetoothState => {

      console.log('BluetoothStateManager onStateChange', bluetoothState);


      console.log(
        'BlueTooth listener',
        bluetoothState,
        //Number(globalModal.isVisible).toString(),
      );
      if (bluetoothState == 'PoweredOn') {
        console.log('so............');
        setBluetoothActivatedButton(true)
        navigation.navigate("BleEquipmentSearchScreen",{"deviceType":"SesameGate",references:["SAT-OPROLL"]})
        // if (modalVisibleRef.current) {
        //   //globalModal.close();
        //   showConfirmNear();
        // }
      } else {
        setBluetoothActivatedButton(false)
      }

      console.log('UFX bluetoothState', bluetoothState);
    }, true);
  };

//   useEffect(() => {
//     addBluetoothListener();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

  useFocusEffect(
    React.useCallback(() => {
        addBluetoothListener();
        // if(flag) {
        //     navigation.navigate("BleEquipmentSearchScreen",{"deviceType":"SesameGate",references:["SAT-OPROLL"]})
        // }
      // Do something when the screen is focused
    }, []) 
  )

    /////////////////////////////////////////


    let content = (
        <View style={{ backgroundColor: 'transparent' }}>
            <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, margin: 10, textAlign:'center' }} >{t(tns + ":" + "BLUETOTH_MANDATORY_FOR_OPROLL")}</Text>
        </View>
    )

    const handleActivateBle = ()=>{
        onActivateDeviceBlooth()
    }

    return(
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={t(tns + ":" + "BLUETOOTH_ACTIVATION")} goBack={() => navigation.navigate("AddObject")} />
                <Body style={{ marginTop: 20, }}>
                    <View>
                        <EcoCard titlePart1={t(tns + ":" + "BLUETOOTH")} titlePart2={''} fontSize ={14} iconSize={33} Picto={BluetoothIcon}/>
                    </View>
                    <View style={{marginTop: 40, marginBottom: 20}}>
                        {content}
                    </View>
                    { !bluetoothActivatedButton &&
                        <View style={{ width: '60%', marginTop: 200}}>
                                <MyButton onPress={handleActivateBle} title={t(tns + ":" + "ACTIVATE_BLUETOOTH")} />
                        </View>
                    }
                </Body>
            </View>
        </SafeAreaView>
    )
}