import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef } from 'react';
import { View, SafeAreaView, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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


export const OPRollBleActivationInfosScreen = () => {
    
    const navigation = useNavigation();

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'


    let content = (
        <View style={{ backgroundColor: 'transparent', }}>
            <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, marginVertical: 10, textAlign:'center' }} >{t(tns + ":" + "ACT_ON_OPROLL_TO_ACTIVATE_BLE")}</Text>
            <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, marginVertical: 10, textAlign:'center' }} >{t(tns + ":" + "OPROLL_BLE_ACTIVATED_SIGNAL")}</Text>
        </View>
    )

    const handleActivateBle = ()=>{
       //navigation.navigate("BleEquipmentSearchScreen")
       //navigation.navigate("garageDoorBleAssistantHomeScreen")
       navigation.navigate("AddObject")
    }

    return(
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 0 }}>
                {/* <HeaderScreen title={t(tns + ":" + "BLE_ON_OPROLL")} goBack={() => navigation.navigate("AddObject")} /> */}
                <Body style={{ marginTop: 20, }}>
                    <View style={{marginBottom: 20}}>
                        {content}
                    </View>
                    <View style={{ width: '60%', marginTop: 200}}>
                            <MyButton onPress={handleActivateBle} title={t(tns + ":" + "RETURN")} />
                    </View>
                </Body>
            </View>
        </SafeAreaView>
    )
}