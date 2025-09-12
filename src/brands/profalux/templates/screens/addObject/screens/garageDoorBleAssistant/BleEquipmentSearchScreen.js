import '_brand/templates/screens/addObject/locales'
import React, { useEffect,useState, useRef } from 'react';
import { View, SafeAreaView, Text, Button } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { getAllObjects, getObjectsByTypeName, getObjectsVisible } from '_helpers/selectors';
import { Api } from "_api";
import { getObjectById } from '_helpers/objects';

import {EcoCard} from '_brand/templates/components/objects/common/EcoCard';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import BluetoothIcon from '_brand/images/icons/app/profaluxIconJs/BluetoothIcon';
import WifiIcon from '_brand/images/icons/app/profaluxIconJs/WifiIcon';
import { RenderLoading } from  '_brand/templates/screens/addObject/components/RenderLoading';
import { devicesConfig } from '_src/brands/profalux/templates/components/objects/bluetoothPairing/ble/devicesConfig.js';

import {BoardgateScan} from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/subScreens/scan';

export const BleEquipmentSearchScreen = () => {
    
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {};
    console.log("[BleEquipmentSearchScreen] navParams", navParams);
    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const timerRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const fireTimer = () => {
        setLoading(true);
        timerRef.current = setTimeout(() => {
            setLoading(false);
            clearTimeout(timerRef.current);
            navigation.navigate("BleDevicesFoundScreen")
            //navigation.navigate("OPRollBleActivationInfosScreen")
        }
        , 10000); // 10 seconds delay
    }

    /*
    useFocusEffect(
        React.useCallback(() => {
          // Do something when the screen is focused
          fireTimer()
    
          return () => {
            // Do something when the screen is unfocused
            clearTimeout(timerRef.current);
          };
        }, [])
      );
    */

    useEffect(()=> {
    
    },[loading]);

    const onLoadingCancel = () => {
        navigation.navigate("BluetoothActivationWarningScreen")
    }
    const handleBack = () => {
        navigation.navigate("garageDoorBleAssistantHomeScreen")
    }

    const goNext = (device) => {
        clearTimeout(timerRef.current);
        setLoading(false);
        console.log("[BleEquipmentSearchScreen] goNext navParams", navParams, "device",device); 
        const destination = navParams?.next || 'gloup' || "BleEquipmentCreateOnServer";
        navigation.navigate(destination, { device });
    }



    return(
        <BoardgateScan allCharacteristics={devicesConfig} addProduct={goNext}/>
    )
}