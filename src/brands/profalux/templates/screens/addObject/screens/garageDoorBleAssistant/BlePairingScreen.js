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

import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import { MyButton } from '_brand/templates/components/ui/MyButton';
import BluetoothIcon from '_brand/images/icons/app/profaluxIconJs/BluetoothIcon'
import WifiIcon from '_brand/images/icons/app/profaluxIconJs/WifiIcon'
import { RenderLoading } from  '_brand/templates/screens/addObject/components/RenderLoading';


export const BlePairingScreen = () => {
    
    const navigation = useNavigation();
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

    useEffect(()=> {
    
    },[loading]);

    const onLoadingCancel = () => {
        navigation.navigate("garageDoorBleAssistantHomeScreen")
        //navigation.navigate("BluetoothActivationWarningScreen")
    }
    const handleBack = () => {
        navigation.navigate("garageDoorBleAssistantHomeScreen")
    }
    return(
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={t(tns + ":" + "BLE_PAIRING")} goBack={handleBack} />
                <Body style={{ marginTop: 20, }}>
                    {loading &&
                        <View>
                            <RenderLoading topText={t(tns + ":" + "BLE_ON_PAIRING_PROCESS")} cancelLoading={onLoadingCancel}/>
                        </View>
                    }
                </Body>
            </View>
        </SafeAreaView>
    )
}