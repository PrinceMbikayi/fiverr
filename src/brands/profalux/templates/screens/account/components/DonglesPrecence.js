import '_brand/templates/screens/_locales'
import React from 'react';
import {useContext,useState,useEffect, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
import { useTheme} from '_theming/themeProvider'
import {BoxScreenTemplate} from "_brand/templates/screens/account/components/BoxScreenTemplate"
import { Api } from '_api';
import { useObject } from '_hooks/object';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import {useGlobalModal} from '_components/ui/globalModal'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import { userRemoveFavorite} from '_actions/user';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';


export const DonglesPrecence = (props) => {
    
    const {zigbeeDongleId, solarDongleId, gatewayId, restartBox, deleteBox} = props
    const { t, i18n } = useTranslation();

    const {theme } = useTheme();
    const nonConnectedGray = theme?.prflxNonConnectedGray || '#CCC'
    const textColor = theme?.prflxTextColor || 'black'




    const uGateway = useObject(gatewayId)
    const uZigbeeDongle = useObject(zigbeeDongleId)
    const uSolarDongle = useObject(solarDongleId)

    const gatewayName = uGateway?.name
    const boxKey = uGateway?.objectDatas?.realName
    const macAddress = uGateway?.objectDatas?.statusDictionary?.MAC
    const localIp = uGateway?.objectDatas?.statusDictionary?.local_ip || " - - - - - - "
    const isGatewayConnected = uGateway?.connected

    const networkConfig = uZigbeeDongle?.objectDatas?.statusDictionary?.config_ext_pan_id
    const zigbeeChannel = uZigbeeDongle?.objectDatas?.statusDictionary?.config_channel 
    let isCalypshomeNetworkConfig = (networkConfig && networkConfig != "-") ? true : false

    let radioRoxPresent = uSolarDongle?.objectDatas?.statusDictionary?.present
    
    
    
    let isSolarDonglePresent = (radioRoxPresent && radioRoxPresent != "0") ? true : false
    let boxConfigFlag = isGatewayConnected  ? true : false
    //let boxConfigFlag = (isGatewayConnected && isCalypshomeNetworkConfig) ? true : false
    
    console.log('RADIO_ROX_PRESENT :', radioRoxPresent, networkConfig, boxConfigFlag);

    useEffect(()=> {
        console.log('GATEWAY_IS_OFF:',isGatewayConnected );
    },[isGatewayConnected]);
    useEffect(()=> {
    
    },[uZigbeeDongle, uSolarDongle, uGateway]);

    const handleRestartBox = () => {
        console.log('HERRR', boxConfigFlag);
        restartBox(boxConfigFlag)
    }
    const handleDeleteBox = () => {
        deleteBox(isGatewayConnected)
    }


      return (
        <BoxScreenTemplate withKebab={false} title={gatewayName}  >
            <View style ={{justifyContent:"center", alignItems:"flex-start", marginHorizontal:10, marginTop:20}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.text, {color:textColor, fontWeight:'400'}]}>{t("account:NAME")} :</Text>
                    <Text style={[styles.text, {color:textColor, marginLeft:5}]}>{gatewayName}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.text, {color:textColor, fontWeight:'400'}]}>{t("account:BOX_ID")} :</Text>
                    <Text style={[styles.text, {color:textColor, marginLeft:5}]}>{boxKey}</Text>
                </View>
                
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.text, {color:textColor, fontWeight:'400'}]}>{t("account:SERVER_CONNECTION")} :</Text>
                    <Text style={[styles.text, {color:textColor, marginLeft:5}]}>{isGatewayConnected ? t("account:CONNECTED") : t("account:BOX_DISCONNECTED")}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.text, {color:textColor, fontWeight:'400'}]}>{t("account:BOX_MAC_ADDRESS")} :</Text>
                    <Text style={[styles.text, {color:textColor, marginLeft:5}]}>{macAddress}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.text, {color:textColor, fontWeight:'400'}]}>{t("account:BOX_LOCAL_IP")} :</Text>
                    <Text style={[styles.text, {color:textColor, marginLeft:5}]}>{localIp}</Text>
                </View>


                <View>
                    <Text style={[styles.text, {color:textColor,fontWeight:'400'}]}>
                        {t("account:CALYPSHOME_NETWORK_STATUS")} : 
                    </Text>
                    <View style={{marginLeft:0}}>

                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.text, {color:textColor, fontWeight:'400', textAlign:'left'}]}>{'\u2022'} {t("account:CALYPSHOME_NETWORK")} :</Text>
                            <Text style={[styles.text, {color:textColor, marginLeft:5}]}>{isCalypshomeNetworkConfig? t("account:YES") : t("account:NO") }</Text>
                        </View>

                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.text, {color:textColor, fontWeight:'400', textAlign:'left'}]}>{'\u2022'} {t("account:CALYPSHOME_NETWORK_CHANNEL")} :</Text>
                            <Text style={[styles.text, {color:textColor, marginLeft:5}]}>{isCalypshomeNetworkConfig? zigbeeChannel : " - - " }</Text>
                        </View>

                    </View>
                </View>

                <View style={{flexDirection:'row', marginTop:20}}>
                    <Text style={[styles.text, {color:textColor, fontWeight:'400'}]}>{t("account:SOLAR_DONGLE_PRESENT")} :</Text>
                    <Text style={[styles.text, {color:textColor, marginLeft:5}]}>{isSolarDonglePresent ? t("account:YES") : t("account:NO") }</Text>
                </View>
    

            </View>
            <View style={{marginTop:40, justifyContent:"center", alignItems:"center"}}>
                <View style={{ width: '70%', marginTop: 20, opacity: boxConfigFlag ? 1 : 0.5 }}>
                        <MyButton onPress={handleRestartBox} title={t("account:RESTART_BOX")} />
                </View>
                <View style={{ width: '70%', marginTop: 20, opacity:isGatewayConnected ? 0.5 : 1}}>
                        <MyButton onPress={handleDeleteBox} title={t("account:DELETE_BOX")} />
                </View>
            </View>
        </BoxScreenTemplate>
   
        )
};

const styles = StyleSheet.create({
    text:{
        fontSize: 16,
        marginVertical: 4,
        textAlign: 'center',
    },
});