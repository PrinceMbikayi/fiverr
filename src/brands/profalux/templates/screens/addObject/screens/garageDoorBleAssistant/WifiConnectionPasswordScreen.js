import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef } from 'react';
import { View, SafeAreaView, Text, Button } from 'react-native';
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
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'


export const WifiConnectionPasswordScreen = () => {
    
    const navigation = useNavigation();

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const globalModal = useGlobalModal(); 

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const userInputRef = useRef(null);
    const messageRef = useRef("")
    const modalTitleColorRef = useRef("#3E495E")
    const modalToastBgColorRef = useRef("#F2F2F2")
    const modalBodyTextColorref = useRef("#3E495E")
    const modalToastTitleRef = useRef(t(tns + ":" + "WARNING"))

    let content = (
        <View style={{ backgroundColor: 'transparent' }}>
            <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, margin: 10, textAlign:'center' }} >{t(tns + ":" + "BLUETOTH_MANDATORY_FOR_OPROLL")}</Text>
        </View>
    )

    const handleSubmit = (values) => {
        //const test = userInputRef.current.submitForm()
        console.log('HandleSubmit :', values)
    }

    const onSubmitForm = async()=>{
        const userInput = userInputRef.current.submitForm()
       console.log('submitForm :',userInput );
       // Ready to request on server
    }
    const cancel = ()=>{
        console.log('cancel');
        messageRef.current = t(tns + ":" + "WOULD_YOU_LIKE_TO_CANCEL")
        onOpenSelect()
    }

    //???????????????????????????????????????????????????????????
    //const buttonsRef = useRef([])
        const buttons = [
            {
                id:"return",
                text:`${t(tns + ":" + "BACK")}`,
                action:()=>onModalCancel(),
                textColor:"#007AFF"
            },
            {
                id:"validate",
                text:`${t(tns + ":" + "TO_STOP")}`,
                action:()=>onModalValidate(),
                textColor:"red"
            },
        ]
    
        const onModalCancel = () => {
        console.log('CANCEL :');
        globalModal.close();
        }

        const onModalValidate = () => {
            // Restore navigation stack and navigate to the main screen
            navigation.navigate("AddObject")
            navigation.navigate("MaisonScreen")
            globalModal.close();
        }
    
        const onOpenSelect = () => {  
            const content = (
            <View style={{width:275, backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                <GlobalToast 
                    toastTitle={modalToastTitleRef.current}
                    toastBody={messageRef.current}
                    buttons={buttons}
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

    const deleteSesameOnGoBack = ()=>{
        navigation.navigate("AddObject")
    }

    return(
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={t(tns + ":" + "WIFI_NETWORK")} goBack={deleteSesameOnGoBack} />
                <Body style={{ marginTop: 20, justifyContent:'space-between', alignItems:'center' }}>
                    <View style={{width:'95%',borderColor:'orange', borderWidth:1,borderRadius:10, backgroundColor:'white',padding:10, marginBottom: 20}}>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, marginTop: 10, }} >{t(tns + ":" + "TYPE_PASSWORD")}</Text>
                        </View>
                        <View style={{}}>
                            <PasswordForm
                                ref={userInputRef}
                                title={t(tns + ":" + "WIFI_PASSWORD")}
                                placeholder={t(tns + ":" + "WIFI_PASSWORD")}
                                fieldWidth={"100%"}
                                //handleSubmit={handleSubmit}
                            />
                        </View>
                        <View style={{ marginTop: 40, marginBottom: 10}}>
                                <MyButton onPress={onSubmitForm} title={t(tns + ":" + "CONNECTION")} />
                        </View>
                    </View>
                    <View style={{width:'60%', marginTop: 200, marginBottom: 10}}>
                            <MyButton onPress={cancel} title={t(tns + ":" + "CANCEL")} />
                    </View>
                </Body>
            </View>
        </SafeAreaView>
    )
}