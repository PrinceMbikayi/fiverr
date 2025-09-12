import '_brand/templates/screens/_locales'

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback, SafeAreaView, KeyboardAvoidingView, Pressable,TouchableOpacity} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import PagerView from 'react-native-pager-view';

import { useNetInfo } from "@react-native-community/netinfo";
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import { H1, P } from '../../styled';

import Button from '../../components/ui/Button'
import {Api} from "_api";



import LostPasswordComponent from '_brand/templates/components/forms/lostPasswordComponent';
import MailSend from '_brand/images/illustrations/MailSend';
import ReinitPasswordComponent from '_brand/templates/components/forms/reinitPasswordComponent';
import { myToast } from '_brand/templates/components/ui/myToast';

//--- icons ------
import CloseCircle from '_brand/images/icons/app/CloseCircle';

//--- brand ----
//import brandAppTexts from '_brand/texts/app.json';

//--- Appium -----
import { buildTestId } from '_helpers/appium';

// Function component start Here

const LostPasswordScreen = (props) => {

  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { serverError, isConnected, oAuth } = props;
  console.log("LoginScreen props", props)
  const { move, step, showServerSelectorTap, submit, submitReinit, goToRecovery, confirmSubmit, goBack, pageIndex, login = '', userId = '', userPassword = '' } = props;

  const stepToPage = { "begin": 0, "waiting": 1, "reinit": 2 }
  // create our ref
  const myViewPager = useRef();
  const myEnteredMailRef = useRef();
  //const [login,setLogin] = useState("")
  /* ------- custom server ------------ */
  const [countTap, setCountTap] = useState(0);


  const borderColor = theme?.prflxBorderColor || 'orange';
  const Containerbgcolor = theme?.prflxContaintBgColor || 'white';
  const bgcolor = theme?.prflxbgColor || 'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
  const textColor = theme?.prflxTextColor || 'black'
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'


  const onSelectServerTap = () => {
    if (showServerSelectorTap) showServerSelectorTap()
  }


  const logoTest = buildTestId("activateServerSelection");

  const goCreate = () => {
    console.log("go create")
    move("Subscribe")
  }

  const lostPasswordRef = useRef(null);

  const submitMe = async () => {
    console.log("SUBMIT ME !!!! from Umii template")
    const isValid = await lostPasswordRef.current.submitForm();


  }

  const submitLostPassword = (values) => {
    myEnteredMailRef.current = values.login
    console.log("MAIL_FOR_LOST_PASSWORD :", myEnteredMailRef.current);
    // it only happens when the form is validated
    // on devrait ici envoyer l'email pour la reinitialisation du mot de passe
    myViewPager.current.setPage(1)
    submit(values)
  }

  const resendCode = async()=>{
    console.log('Hello');
    const login = myEnteredMailRef.current
    if(login != ''){
      const res = await  Api.recoverPassword(login);
      console.log("IN_RESEND_MAIL : ",res)
      if(res?.errCode == 200){
        myToast( `${t('account:MAIL_SENT')}`, "black")
      }

    }
}

  const onMailRecieved = () => {
    myViewPager.current.setPage(2)
  }


  const lostPassword = () => {
    console.log("lostPassword !!!")
  }

  const reinitPasswordRef = useRef(null);

  const onReinitPassword = () => {
    console.log("onReinitPassword")
    reinitPasswordRef.current.submitForm();
  }
  const submitReinitPassword = (values) => {
    console.log("submitReinitPassword", values);
    submitReinit(values)
  }


  return (

    <SafeAreaView style={{ height: '100%' }}>
      <View style={{ height: '100%', backgroundColor: bgcolor, padding: 20, paddingTop: 40 }}>
        <View style={{ alignItems: 'flex-end' }}>
          <Pressable style={{ width: 24, height: 24 }} onPress={() => navigation.goBack()} ><CloseCircle color={textColor} onPress={() => navigation.goBack()} /></Pressable>
        </View>

        <View contentContainerStyle={{ backgroundColor: "transparent", height: "100%" }}>
          <PagerView style={styles.viewPager} initialPage={pageIndex} scrollEnabled={false} ref={myViewPager}>

            <View key="1">
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "position"}
              >
                <View style={{ marginTop: 0 }}>
                  <TouchableWithoutFeedback onPress={onSelectServerTap} {...logoTest} style={{ flex: 1 }} >
                    <H1 style={{ color: textColor }}>{t('account:LOST_PASSWORD_TITLE')}</H1>
                  </TouchableWithoutFeedback>
                  <P style={{ color: textColor, marginTop: 16, marginBottom: 16 }}>
                    {t('account:LOST_PASWWORD_DESCRIPTION')}
                  </P>
                  {/* <P style={{color:textColor,marginTop:16,marginBottom:16}}>{t("account:LOST_PASWWORD_DESCRIPTION")}</P> */}
                </View>
                <View style={{ backgroundColor: "transparent" }}>
                  <LostPasswordComponent goBack={goBack} submit={submitLostPassword} ref={lostPasswordRef} bgColor={bgcolor} />
                </View>
                <View style={{ marginBottom: 24 }} />
                <Button title={t("account:LOST_PASSWORD_SUBMIT")} onPress={submitMe} titleColor='white' bgColor={textColor} />

                <View style={{ marginBottom: 100 }}></View>
              </KeyboardAvoidingView>
            </View>

            <View key="2">
              <View style={{ marginBottom: 16 }}>
                <View style={{ marginTop: 16, marginBottom: 32, padding: 48, height: 200, width: 200, borderRadius: 100, backgroundColor: 'white', alignSelf: 'center' }}>
                  <MailSend />
                </View>
                <H1 style={{ color: textColor, }}>{t('account:MAIL_SEND')}</H1>
                <P style={{ color: textColor, marginTop: 16 }}>{t('account:LOST_PASSWORD_MAIL_RECIEVED')}</P>
              </View>
              <Button title={t('account:LOST_PASSWORD_CONTINUE')} onPress={onMailRecieved} titleColor='white' bgColor={textColor} />
              <TouchableOpacity
                onPress={resendCode}
                >
                <Text style={[styles.text, styles.underline]}>{t("account:RESEND_MAIL")}</Text>
            </TouchableOpacity>

            </View>
            <View key="3">
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "position"}
              >
                <View style={{ marginTop: 69 }}>
                  <TouchableWithoutFeedback onPress={onSelectServerTap} {...logoTest} style={{ flex: 1 }} >
                    <H1 style={{ color: textColor, }}>{t('account:REINIT_PASSWORD_TITLE')}</H1>
                    {/* <H1 style={{color:textColor,}}>{t('account:REINIT_PASSWORD_TITLE')}</H1> */}
                  </TouchableWithoutFeedback>
                  <P style={{ color: textColor, marginTop: 16, marginBottom: 16 }}>{t("account:REINIT_PASSWORD_DESCRIPTION")}</P>
                </View>
                <ReinitPasswordComponent goBack={goBack} submit={submitReinitPassword} ref={reinitPasswordRef} bgColor={textColor} />
                <View style={{ marginBottom: 32 }} />
                <Button title={t("account:REINIT_PASSWORD_SUBMIT")} onPress={onReinitPassword} titleColor='white' bgColor={textColor} />

                <View style={{ marginBottom: 20 }}></View>

              </KeyboardAvoidingView>
            </View>

          </PagerView>
        </View>


      </View>
    </SafeAreaView>



  );
}
export default LostPasswordScreen;

const styles = StyleSheet.create({
  insideBlock: {
    margin: 10

  },
  viewPager: {
    height: "100%"

  },
  text: {
    marginTop:23,
    fontWeight:'400',
    fontSize: 18,
    textAlign:'center',
    color: '#3E495E'
},
underline: {
    textDecorationLine: 'underline',
},
});

const GroupButtonText = styled.Text`
font-size: ${props => (props.fontSize || 12)}px;
font-weight:normal;
text-transform:capitalize;

`; 