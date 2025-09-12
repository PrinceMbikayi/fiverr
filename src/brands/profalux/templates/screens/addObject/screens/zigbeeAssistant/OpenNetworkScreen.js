import '_brand/templates/screens/addObject/locales'
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PagerView from 'react-native-pager-view';
import { useTheme } from '_theming/themeProvider';
import { UserObjectTypeChoice } from '_brand/templates/screens/addObject/components/UserObjectTypeChoice';
import Button from '_brand/templates/components/ui/Button';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { iconsJs } from '_brand/utils/iconsJs';
import { getObjectsByTypeName, getObjectsVisible, getObjectsByTypes } from '_helpers/selectors';
import { getObjectById } from '_helpers/objects';
import { Api } from "_api";
import * as Durin from '_api/durin';
import { SelectList } from 'react-native-dropdown-select-list'
import { getDiscoveryEzsp } from '_actions/app';
import Toast from 'react-native-root-toast';
import { deleteObject } from '_api/objects';
import {appRefresh,closeWS} from '_actions/app';
import * as ApiObjects from "_api/objects"
import AsyncStorage from '@react-native-community/async-storage';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import {BoxChoice} from "_brand/templates/screens/addObject/components/BoxChoice"
import {RemoteNetworkOpeningInstructions} from "_brand/templates/screens/addObject/screens/zigbeeAssistant/components/RemoteNetworkOpeningInstructions"


export const OpenNetworkScreen = () => {
    const navigation = useNavigation(); 
    const route = useRoute();
    const params = route?.params || {};
    const {myBoxDongleId, gatewayObjectId, gatewayGwId, remoteType} = params;
    console.log("PARAMETERS_OPEN_NETWORK :", remoteType, params);

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'


    const openNetwork = async ()=>{
        //setIsLoading(true)

        // send request JOIN to zigbee dongle
        const param = {"oArgs":[{"name":"ext_pan_id","value":""},{"name":"tx_power","value":""}]}
        if(myBoxDongleId) await Api.executeAction(myBoxDongleId, "JOIN", param);

        // Navigate 

        navigation.navigate("BoxJoiningNetworkLoadingScreen",params)
        console.log('OPEN_NETWORK');
    }
    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={t(tns + ":" + "CALYPSHOME_NETWORK_OPENING")} goBack={() => navigation.navigate("RemoteTypeChoiceScreen")} />
                <ScrollView showsVerticalScrollIndicator={false} style={{height:"100%"}}>
                <Body style={{ marginTop: 20 }}>
                    <RemoteNetworkOpeningInstructions remoteType={remoteType}/>
                    <View style={{ minWidth: 200, marginTop: 10 }}>
                            <MyButton onPress={openNetwork} title={t(tns + ":" + "VALIDATE")} />
                    </View>

                </Body>
                <View style={{ width: 200, height: 100 }}></View>
                </ScrollView>
            </View>
        </SafeAreaView>

    )
}
