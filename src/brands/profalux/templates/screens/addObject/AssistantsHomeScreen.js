import '_brand/templates/screens/addObject/locales'
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getObjectsByTypeName } from '_helpers/selectors';
import { useTranslation } from 'react-i18next';

import { Body } from '_brand/templates/screens/addObject/components/Body';
import { ChoixTypeObjet } from '_brand/templates/screens/addObject/components/ChoixTypeObjet';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { useTheme } from '_theming/themeProvider';
import {useGlobalModal} from '_components/ui/globalModal'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import { refreshObjectAction } from '_actions/asyncActions';
import {retrieveUserGateways} from "_brand/templates/screens/addObject/utils/retrieveUserGateways"


export const AssistantsHomeScreen = () => {

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const route = useRoute();
    const navigationParams = route?.params || {};
    const store = useStore()

    const globalModal = useGlobalModal(); 

    const gateways = useSelector(state => getObjectsByTypeName(state, "Gateway"));
    const solarDongles = useSelector(state => getObjectsByTypeName(state, "Profalux"));
    const userPhisicalGateways = retrieveUserGateways(gateways) || []


    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'


    let timerRef = useRef(null)

    console.log("Hello")

    const gloIsConnected = useSelector(state => state?.network?.isConnected);
    const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
    // const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false && gatewayConnected == true);

    const handleNavigateZigbee = () => {
        if(userPhisicalGateways.length != 0){
            navigation.navigate('ZigbeeAssistantChooseBoxScreen', {dongle:'Zigbee_EZSP'})
        }else{ onOpenSelect()}
    }

    const handleNavigateSolar = ()=>{
        if(userPhisicalGateways.length != 0){
            navigation.navigate('SolarAssistantHomeScreen', {screen:'SolarAssistantHomeScreen', params:{dongle:'Profalux'} })
        }else{ onOpenSelect()}
    }

    const goToGarageDoorAssistant = ()=>{
            navigation.navigate('garageDoorBleAssistantStack', {screen:'garageDoorBleAssistantHomeScreen'})
    }
    
//???????????????????????????????????????????????????????????
    const buttons = [
        {
            id:"return",
            text:`${t(tns + ":" + "RETURN")}`,
            action:()=>onCancelPressed(),
            textColor:"#007AFF"
        },
        // {
        //     id:"return",
        //     text:`${t(tns + ":" + "RETURN")}`,
        //     action:()=>onCancelPressed(),
        //     textColor:"#007AFF"
        // }
    ]

  const onCancelPressed = () => {
    console.log('CANCEL_DELETE :');
    globalModal.close();
  }

  const onOpenSelect = () => {  
      const content = (
        <View style={{width:275, backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
            <GlobalToast 
                toastTitle={t(tns + ":" + "WARNING")}
                toastBody={t(tns + ":" + "ASSOCIATE_CALYPSHOME_BOX_BEFORE_ADDING_EQUIPMENTS")}
                buttons={buttons}
            />
        </View>
            )
      globalModal.setContent(content,{type:'centered'});    
      globalModal.toggle();
  }
//???????????????????????????????????????????????????????????


    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'transparent' }}>

            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title={t(tns + ":" + "ADD_EQUIP")}
                        backSVG centered
                        goBack={{ action: () => navigation.goBack() }}
                        noShadow />
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, marginBottom: 20 }}>
                    <Body>
                        <View style={{ marginTop: 15}}>
                            <Text style={styles.text}> {t(tns + ":" + "EQUIP_TYPE_CHOICE")} :</Text>
                        </View>
                        {/* {userPhisicalGateways.length != 0 && } */}
                            <View style={{ backgroundColor:"transparent",  }}>
                                <ChoixTypeObjet
                                    onPressNextArrow={handleNavigateZigbee}
                                    textDisplay={t(tns + ":" + "EQUIP_ZIGBEE")}
                                    imgSource={require('_brand/templates/screens/addObject/images/zigbeeEquips.png')}
                                    imgStyle={{ width: '100%', height: 100, marginTop: 10 }}
                                    //imgStyle = {{flex:1,marginLeft:10, resizeMode:'contain'}}
                                    doesUserHaveGateway = {userPhisicalGateways.length != 0 ? true : false}
                                />
                                <ChoixTypeObjet
                                    onPressNextArrow={handleNavigateSolar}
                                    textDisplay={t(tns + ":" + "EQUIP_SOLAR")}
                                    imgSource={require('_brand/templates/screens/addObject/images/solarEquips.png')}
                                    imgStyle={{ width: '100%', height: 120, marginTop: 10 }}
                                    doesUserHaveGateway = {userPhisicalGateways.length != 0 ? true : false}
                                />
                            </View>
                        
                        <View>
                            {/* <ChoixTypeObjet
                                onPressNextArrow={goAddBox}
                                textDisplay={t(tns + ":" + "EQUIP_CALYPS_BOX")}
                                imgSource={require('_brand/templates/screens/addObject/images/boxCalyps.png')}
                                imgStyle={{ width: 150, height: 90, marginTop: 10 }}
                            /> */}
                            
                            <ChoixTypeObjet
                                onPressNextArrow={goToGarageDoorAssistant}
                                textDisplay={t(tns + ":" + "EQUIP_GARAGE_DOOR")}
                                imgSource={require('_brand/templates/screens/addObject/images/armoireOpRollWithShadow.png')}
                                imgStyle={{flex:1,marginLeft:0, resizeMode:'contain', alignSelf:'center'}}
                            />
                            <ChoixTypeObjet
                                onPressNextArrow={() => navigation.navigate('NetatmoAssistantStack')}
                                textDisplay={t(tns + ":" + "EQUIP_NETATMO_SENSOR")}
                                imgSource={require('_brand/templates/screens/addObject/images/sensorEquips.png')}
                                imgStyle={{ width: '100%', height: 100, marginTop: 10 }}
                            />
                            {/* <ChoixTypeObjet
                                onPressNextArrow={() => navigation.navigate('VoiceAssistantStack')}
                                textDisplay={t(tns + ":" + "EQUIP_VOICE_ASSIST")}
                                imgSource={require('_brand/templates/screens/addObject/images/voiceEquips.png')}
                                imgStyle={{ width: 200, height: 90, marginTop: 10 }}
                            /> */}
                        </View>
                        <View style={{ width: '100%', height: 50 }} />
                    </Body>
                </View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

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
});