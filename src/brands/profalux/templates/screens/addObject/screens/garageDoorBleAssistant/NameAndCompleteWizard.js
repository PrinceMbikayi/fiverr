import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef } from 'react';
import { View, SafeAreaView, Text,ScrollView, Button, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { PasswordForm } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/components/PasswordForm';
//import { PasswordForm } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/PasswordForm';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { getAllObjects, getObjectsByTypeName, getObjectsVisible } from '_helpers/selectors';
import { Api } from "_api";
import { getObjectById } from '_helpers/objects';

import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import { MyButton } from '_brand/templates/components/ui/MyButton';
import BluetoothIcon from '_brand/images/icons/app/profaluxIconJs/BluetoothIcon'
import WifiIcon from '_brand/images/icons/app/profaluxIconJs/WifiIcon'
import {useGlobalModal} from '_components/ui/globalModal'
import { ModifyNewAddedObject } from '_brand/templates/screens/addObject/components/ModifyNewAddedObject';


const width = Dimensions.get('window').width;
export const SesameEndWizard = () => {
    
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {};
    console.log("[SesameEndWizard] navParams", navParams);
    const { objectId } = navParams || {};

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const globalModal = useGlobalModal(); 

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const onEndWizard = (values) => {
        console.log('onEnd :', values);
        navigation.navigate('AddObject');
    }

    //???????????????????????????????????????????????????????????

    return(
        <SafeAreaView style={{flex:1, backgroundColor:"transparent"}}>
            <View style={{flex:1,alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={t(tns + ":" + "ADD_OPROLL")} />
                <ScrollView showsVerticalScrollIndicator={false} style={{height:"100%"}}>
                <Body style={{justifyContent:'space-between', alignItems:'center' }}>
                    <View style={{ width: width - 5, marginBottom:50}}>
                        <ModifyNewAddedObject itemId={objectId} callBackSetPage={onEndWizard} />
                    </View>
                   
                </Body>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}