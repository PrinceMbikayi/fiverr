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

import AutoCreateOnServer from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/autoCreateOnServer';
import {useBleContext} from '_hooks/ble/bleContext';
import useSwipeBackDisabler from '_hooks/swipe';



export const BleEquipmentCreateOnServer = () => {
    
    const uBleContext = useBleContext();


    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {};
    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

  const [doCreateOnServer, setDoCreateOnServer] = useState(null);
   

  
    const quitAssistant = () => {
        console.log("handleBack called in BleEquipmentCreateOnServer");
        //navigation.navigate("garageDoorBleAssistantHomeScreen")
        navigation.navigate("AddObject")
    }



    const goNext = (id) => {
        console.log("so goNext called in BleEquipmentCreateOnServer");
        const destination = navParams?.next || 'gloup' || "BleEquipmentCreateOnServer";
        console.log("goNex CreateOnServer destination", destination);
        //navigation.navigate(destination,{objectId: uBleContext?.objectId});
        navigation.navigate(destination,{objectId: id});
        console.log("so i should have moved from here : ",id)
    }


    return(
        <SafeAreaView>
            <View style={{  backgroundColor:bgcolor, paddingTop: 20,height: '100%' }}>
                <HeaderScreen title={t(tns + ":" + "OPROLL_AUTHENTICATION")} fontSize={19} withBack={false} />                 
                {!doCreateOnServer && (
                    <Body style={{ marginTop: 40, }}>
                        <Text style={{ color: textColor, fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
                            {t(tns + ":BLE_CREATE_ON_SERVER")}
                        </Text>
                        
                        <View style={{ width: '60%', marginTop: 200}}>
                                <MyButton onPress={() => setDoCreateOnServer(true)} title={t(tns + ":" + "CONTINUE")} />
                        </View>
                        <View style={{ width: '60%', marginTop: 20}}>
                                <MyButton onPress={quitAssistant} title={t(tns + ":" + "CLOSE_ASSISTANT")} />
                        </View>
                    </Body>
                )}
                {doCreateOnServer && (
                    <AutoCreateOnServer  uBleContext={uBleContext} callback={goNext}/>
                )}

            </View>
        </SafeAreaView>
    )
}