import '_brand/templates/screens/addObject/locales'
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Image, Alert} from 'react-native';
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


export const RemoteTypeChoiceScreen = () => {
    const navigation = useNavigation(); 
    const route = useRoute();
    const params = route?.params || {};
    const {gatewayObjectId, myBoxDongleId, gatewayGwId } = params;
    console.log('CHECK_PARAMS :', params);

    const gateways = useSelector(state => getObjectsByTypeName(state, "Gateway"));
    const zigbees = useSelector(state => getObjectsByTypeName(state, "Zigbee_EZSP"));//dongles

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'



    // const goAssociateBoxWithHandRemote = (label) => {
    //     const params = { gatewayObjectId, myBoxDongleId, gatewayGwId, "remoteType": label }
    //     navigation.navigate("OpenNetworkScreen", params)
    //     console.log('DATA :', label, params);
    // }
    const goAssociateBox = (label) => {
        const params = { gatewayObjectId, myBoxDongleId, gatewayGwId, "remoteType": label }
        navigation.navigate("OpenNetworkScreen", params)
        console.log('DATA :', label, params);
    }
    const goAssociateBoxWallRemote = (label) => {
        console.log('DATA :', label, {...params});
    }


    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={t(tns + ":" + "OPEN_ZIGBEE_NETWORK")} goBack={() => navigation.navigate("ZigbeeAssistantChooseBoxScreen")} />
                <Body style={{ marginTop: 20, }}>
                    <View>
                        <Text style={{ color: textColor, fontSize: 16, fontWeight: '400', textAlign: 'center', marginBottom: 20 }}>
                            {t(tns + ":" + "SELECT_EQUIP_TYPE_TO_OPEN_NETWORK")}
                        </Text>
                    </View>
                    <View style={{ backgroundColor: 'transparent', padding: 0 }}>
                        <CardImageArrow
                            onPressNextArrow={goAssociateBox}
                            withNextArrow={true}
                            imageSource={require('_brand/templates/screens/addObject/images/simpleRemote.png')}
                            //imageSource={require('_brand/templates/screens/addObject/images/handRemote.png')}
                            textDisplay={t(tns + ":" + "EQUIP_PORTABLE_REMOTE")}
                            textStyle={{ marginRight: 40 }}
                            //imgStyle={{ width: 60, height: 80 }}
                            imgStyle = {{flex:1,marginLeft:10, resizeMode:'contain'}}
                            label={"portable"}
                        />
                    </View>
                    <View style={{ backgroundColor: 'transparent', padding: 0 }}>
                        <CardImageArrow
                            onPressNextArrow={goAssociateBox}
                            withNextArrow={true}
                            imageSource={require('_brand/templates/screens/addObject/images/wallRemote.png')}
                            //imageSource={require('_brand/templates/screens/addObject/images/wallRemoteFlat.png')}
                            textDisplay={t(tns + ":" + "EQUIP_WALL_REMOTE")}
                            textStyle={{ marginRight: 40 }}
                            imgStyle={{ width: 60, height: 80 }}
                            //imgStyle = {{flex:1,marginLeft:10, resizeMode:'contain'}}
                            label={"wall"}
                        />
                    </View>
                    <View style={{ backgroundColor: 'transparent', padding: 0 }}>
                        <CardImageArrow
                            onPressNextArrow={goAssociateBox}
                            withNextArrow={true}
                            imageSource={require('_brand/templates/screens/addObject/images/receptor.png')}
                            //imageSource={require('_brand/templates/screens/addObject/images/wallRemoteFlat.png')}
                            textDisplay={t(tns + ":" + "EQUIP_ZIGBEE_RECEPTOR")}
                            textStyle={{ marginRight: 40 }}
                            //imgStyle={{ width: 75, height: 80 }}
                            imgStyle = {{flex:1, resizeMode:'contain'}}
                            label={"receptor"}
                        />
                    </View>
                </Body>
            </View>
        </SafeAreaView>

    )
}
