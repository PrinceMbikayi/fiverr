import '_brand/templates/screens/_locales'
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback,
  SafeAreaView, KeyboardAvoidingView, Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { H1, P } from '_brand/templates/styled';
import Button from '_brand/templates/components/ui/Button'
import LostPasswordComponent from '_brand/templates/components/forms/lostPasswordComponent';
import MailSend from '_brand/images/illustrations/MailSend';
import ReinitPasswordComponent from '_brand/templates/components/forms/reinitPasswordComponent';
import {Api} from "_api";
import CloseCircle from '_brand/images/icons/app/CloseCircle';
import { myToast } from '_brand/templates/components/ui/myToast';
//--- Appium -----
import { buildTestId } from '_helpers/appium';

// ================ SCREEN COMPONENT START HERE ========================
export const ReinitLostPassword = (props) => {

  const { move, showServerSelectorTap,goBack, pageIndex} = props;

  const myViewPager = useRef();
  const reinitPasswordRef = useRef(null);
  const [login,setLogin] = useState("")
  
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  
  const { theme } = useTheme();
  const bgcolor = theme?.prflxbgColor || 'white';
  const textColor = theme?.prflxTextColor || 'black'


  useEffect(()=> {
    console.log('MY_LOGIN',login);
  },[login]);

  const lostPasswordRef = useRef(null);

  const submitMe = async () => {
    const isValid = await lostPasswordRef.current.submitForm();
    console.log("SUBMIT ME !!!! from Umii template :", isValid)
  }

  const sendEmailToReceiveCode = async(values) => {
    const login = values.login.toLowerCase().trim();
    setLogin(login);
    console.log("intercept_Reinit", login);
    const res = await  Api.recoverPasswordViaAccount(login);
    console.log("in lost password screen ",res)

    if(res.errCode != 200){
      // gestion de l'erreur
      console.log("register error");
      let msg ="\n";
      switch(registerProcess.errMsg) {
          case "login_exists" :
              msg+=t("SUBSCRIBRE_ERROR_LOGIN_EXIST")+"\n";
 
              break;
          default : 
              msg+=t("SUBSCRIBRE_ERROR_DEFAULT")+"\n";
      }
      Toast.show(msg);
    } else {   
        console.log('ok man')
        myViewPager.current.setPage(1)
    }

  }

  const onMailRecieved = () => {
    myViewPager.current.setPage(2)
  }

  const onReinitPassword = () => {
    console.log("onReinitPassword")
    reinitPasswordRef.current.submitForm();
  }

  const submitReinitPassword = async(values) => {
    console.log("submitReinitPassword", values, login);
    //submitReinit(values)
    const reinitProcess = await Api.reinitPasswordViaAccount(login,values.reinitCode,values.password);
    console.log("REINIT_PROCESS_WHILE_LOGGED :",reinitProcess)
    if (reinitProcess.errCode == 200) { 
        navigation.navigate("Account", {screen:'PersonalInfos'})
       // move("Account", {screen:'PersonalInfos'})
    } else {
        let message;
        switch(reinitProcess.errCode) {
          case 400:
            message = `${t("account:LOST_PASSWORD_ERROR")} ${reinitProcess.errCode} : ${t("account:INVALID_CODE_OR_PASSWORD")}`
            break;
          default:
            message =`${t("account:LOST_PASSWORD_ERROR")} ${reinitProcess.errCode} : ${reinitProcess.errMsg}`
        }
        myToast(message)
    }
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
                    <H1 style={{ color: textColor }}>{t('account:LOST_PASSWORD_TITLE')}</H1>
                  <P style={{ color: textColor, marginTop: 16, marginBottom: 16 }}>
                    {t('account:LOST_PASWWORD_DESCRIPTION')}
                  </P>
                </View>
                <View style={{ backgroundColor: "transparent" }}>
                  <LostPasswordComponent goBack={goBack} submit={sendEmailToReceiveCode} ref={lostPasswordRef} bgColor={bgcolor} />
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
            </View>
            <View key="3">
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "position"}
              >
                <View style={{ marginTop: 69, justifyContent: 'center', alignItems: 'center' }}>
                    <H1 style={{ color: textColor, }}>{t('account:REINIT_PASSWORD_TITLE')}</H1>
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

const styles = StyleSheet.create({
  viewPager: {
    height: "100%"

  }
});