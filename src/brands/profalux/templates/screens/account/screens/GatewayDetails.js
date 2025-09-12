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
import { myToast } from '_brand/templates/components/ui/myToast';
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import { DonglesPrecence } from '_brand/templates/screens/account/components/DonglesPrecence';
import { quickToast } from '_brand/templates/components/ui/quickToast';
import Toast from 'react-native-toast-message';
import { toastConfig } from '_brand/templates/components/ui/toastConfig';
import * as Actions from '_actions/objects';


export const GatewayDetails = (props) => {
    
    const { t, i18n } = useTranslation();
    const {theme } = useTheme();
    const nonConnectedGray = theme?.prflxNonConnectedGray || '#CCC'
    const textColor = theme?.prflxTextColor || 'black'

    const dispatch = useDispatch();
    
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {}; 
    console.log('NAV_PARAMS :', navParams);

    const globalModal = useGlobalModal(); 
    const messageRef = useRef("")
    const modalTitleColorRef = useRef("#3E495E")
    const modalToastBgColorRef = useRef("white")
    const modalBodyTextColorref = useRef("#3E495E")
    const modalToastTitleRef = useRef(t("account:WARNING"))
    const buttonsRef = useRef([...buttons])
    
    
    const {gatewayId,gatewayGwId, zigbeeDongleId, solarDongleId,isCalypshomeNetworkConfig,zigbeeChannel,radioRoxPresent} = navParams


    const uGateway = useObject(gatewayId)

    console.log('GATEWAY :', uGateway, gatewayGwId);

    useEffect(()=> {
    
    },[uGateway]);


    const restartBox = async(boxConfigFlag) => {

        if(boxConfigFlag){

            modalToastTitleRef.current =""
            messageRef.current = t("account:BOX_RESTARTED")
            modalTitleColorRef.current = textColor
            modalToastBgColorRef.current = "white"
            modalBodyTextColorref.current = textColor
            buttonsRef.current = restartBoxButtons
            onOpenSelect()
            // // Call the API to restart the box
            // console.log('REBOOT_RESTART_BOX :', gatewayId);
            // //const commandName ="REBOOT"//"RESTART"//"REBOOT"
            // const response = await Api.fireRestartCommandOnGateway(gatewayId).catch((err) => console.log(err));
            // console.log('RESTART_BOX :', response);
            // if(response.errCode == 200){
            //     modalToastTitleRef.current =""
            //     messageRef.current = t("account:BOX_RESTARTED")
            //     modalTitleColorRef.current = textColor
            //     modalToastBgColorRef.current = "white"
            //     modalBodyTextColorref.current = textColor
            //     onOpenSelect()
            // }

        }else{
            modalToastTitleRef.current = t("account:WARNING")
            messageRef.current = t("account:RESTART_BOX_REQUIREMENT")
            modalTitleColorRef.current = textColor
            modalToastBgColorRef.current = "white"
            modalBodyTextColorref.current = textColor
            buttonsRef.current = buttons
            onOpenSelect()
        }
    }

    const deleteBox = (isGatewayConnected) => {
        if(isGatewayConnected){
            modalToastTitleRef.current = t("account:WARNING")
            messageRef.current = t("account:DELETE_BOX_REQUIREMENT")
            modalTitleColorRef.current = textColor
            modalToastBgColorRef.current = "white"//"#fc3030"
            modalBodyTextColorref.current = textColor
            buttonsRef.current = buttons
            onOpenSelect()
        }else{
            // Call the API to delete the box
            openDeletePopup()
        }
    }



    const handleDelete = async () => {
        globalModal.close()
        navigation.navigate('MyGateways')
        const res = await Api.deleteGateway(gatewayGwId).catch((err) => { console.log(err) });
        console.log('BOX_TO_DELETE :', res);
        if (res.errCode == 200) {
        const action = Actions.objectDelete(gatewayGwId);
        dispatch(action)

        const msg = `${t("account:BOX_DELETED")}`
        const bgColor = 'black'
        const textColor = 'white'
        const duration = 3000
        myToast(msg,bgColor, textColor, duration)

        }else{
        const msg = `${t("account:SERVER_ERROR")} : ${res.errCode} ${res.errMsg}`;
        const bgColor = 'red'
        const textColor = 'white'
        const duration = 3000
        myToast(msg,bgColor, textColor, duration)
        }
    }

    //???????????????????????????????????????????????????????????
    //const buttonsRef = useRef([])
        const buttons = [
            {
                id:"return",
                text:`${t("account:RETURN")}`,
                action:()=>onCancelPressed(),
                textColor:"#007AFF"
            },
        ]
        const restartBoxButtons = [
                        {
                id:"return",
                text:`${t("account:CANCEL")}`,
                action:()=>onCancelPressed(),
                textColor:"#007AFF"
            },
            {
                id:"validate",
                text:`${t("account:VALIDATE")}`,
                action:()=>onRestartPressed(),
                textColor:"#007AFF"
            },
        ]
    
      const onCancelPressed = () => {
        console.log('CANCEL :');
        globalModal.close();
      }

      const onRestartPressed = async() => {
        globalModal.close();
        const response = await Api.fireRestartCommandOnGateway(gatewayId).catch((err) => console.log(err));
        console.log('RESTART_BOX :', response);
      }


    
      const onOpenSelect = () => {  
          const content = (
            <View style={{width:275, backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                <GlobalToast 
                    toastTitle={modalToastTitleRef.current}
                    toastBody={messageRef.current}
                    buttons={buttonsRef.current}
                    titleColor={ modalTitleColorRef.current}
                    toastBgColor={modalToastBgColorRef.current}
                    bodyTextColor={modalBodyTextColorref.current}
                />
            </View>
                )
          globalModal.setContent(content,{type:'centered'});    
          globalModal.toggle();
      }
    //???????????????????????????????????????????????????????????


    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            const cancelDelete = () => {
              console.log('CANCEL_DELETE :');
              globalModal.close();
            }
          
            const openDeletePopup = () => {  
                const content = (
                  <View style={{width:'100%', height: 200}}>
                    <CommonBottomSheetDeleteContent 
                        nameToDelete={t("account:CALYPHOME_BOX")} 
                        //warningText={`${t(tns+":"+"WARNING_DELETE")}`}
                        warningText={t("account:WARNING_DELETE")}
                        textColor={textColor} 
                        onDelete={handleDelete} 
                        onCancel={cancelDelete} 
                    />
                  </View>
                      )
                globalModal.setContent(content,{type:'bottom'});    
                globalModal.toggle();
            }

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      return (
        <View style={{flex:1}}>
            <DonglesPrecence
                zigbeeDongleId = {zigbeeDongleId}
                solarDongleId = {solarDongleId}
                gatewayId = {gatewayId}
                restartBox = {restartBox}
                deleteBox= {deleteBox}
            />
              <Toast config={toastConfig}/>
        </View>
   
        )
};

const styles = StyleSheet.create({
    text:{
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
    },
});



