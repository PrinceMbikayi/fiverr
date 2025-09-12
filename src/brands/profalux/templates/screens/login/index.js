import '_brand/templates/screens/_locales'

import React, { useRef } from 'react';
import { SafeAreaView, KeyboardAvoidingView, StyleSheet, ScrollView, View, Text, Image, TouchableWithoutFeedback, Platform, Pressable, TouchableOpacity} from 'react-native';

import { useTranslation } from 'react-i18next';


import { useTheme } from '_theming/themeProvider';
import Button from '../../components/ui/Button';
import LoginComponent from '_brand/templates/components/forms/loginComponent';

import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from '_brand/templates/components/objects/common/MultiPurposeWidgetLine';

import { useNavigation } from '@react-navigation/native';

//--- Appium -----
import { buildTestId } from '_helpers/appium';

// Function component start Here

const LoginScreen = (props) => {

    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation()
    const { serverError, isConnected, oAuth } = props;
    const { move, subscribreStep, showServerSelectorTap, submit, goBack, confirmSubmit, pageIndex, userId = '', userPassword = '' } = props;


    const borderColor = theme?.prflxBorderColor || 'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'


    const handleBackPress = () => {
        console.log("handleBackPress")
        goBack();
        return true; // intercept event    
    }

    const onSelectServerTap = () => {
        if (showServerSelectorTap) showServerSelectorTap()
    }


    const logoTest = buildTestId("activateServerSelection");

    const goCreate = () => {
        console.log("go create :", navigation.getState()?.routes)
        // J'ai inversé le Login et Subscribe dans la navigation profalux afin d'atterir sur la page login d'abord
        move("Login") // Oui je fais un move vers Login : cependant ce login appelle Subscribe haaaa !!! really Bad staff
        //A corriger absolument!!!
        //move("Subscribe")
    }

    const loginRef = useRef(null);

    const submitMe = () => {
        loginRef.current.submitForm();
    }

    const lostPassword = () => {
        console.log("lostPassword !!!")
        move('LostPassword')
    }

    const goForgottenEmail = ()=>{
        console.log('Hello Recover Account');
        move("RecoverAccount")
    }
    // const gobehind = ()=>{
    //   console.log("I am here")
    // }


    return (
        <SafeAreaView style = {{height:'100%'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "position" : "position"}
            >
                <View style={{ backgroundColor: bgcolor, padding: 20, paddingTop: 40, justifyContent: 'flex-start', }}>

                    <Pressable onPress={goBack} style={{ backgroundColor: 'transparent', height: 30, width: 30, marginBottom: 0, marginLeft: -10 }}>
                        <MultiPurposeWidgetLine
                            icons={[iconsJs.leftChevronIcon]}
                            isPressable={true}
                            iconSize={25}
                            iconBgColor='transparent'
                            onPress={goBack}
                            //active = {sendCurrentActive}
                            iconWrapperStyle={{ backgroundColor: 'transparent' }}
                        />
                    </Pressable>

                    <View style={{ marginLeft: 15, marginTop:10 }}>
                        <TouchableWithoutFeedback onPress={onSelectServerTap} {...logoTest} style={{ flex: 1 }} >
                            <Image source={require('_brand/images/icons/app/profaluxIconJs/Logo.png')} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View>

                        <View style={{ marginTop: 69 }}>
                                <Text style={{ fontSize: 16, fontWeight: '400', textAlign: 'center', marginBottom: 40, color: textColor }}>
                                    {t("account:DESCRIPTION")}
                                </Text>
                                {/* <Text style={{fontSize:16, fontWeight:'400', textAlign:'center', marginBottom:40, color:textColor}}>{t('account:LOGIN_TITLE')}</Text> */}
                        </View>
                        <View style={{ marginTop: 16 }} />
                        <ScrollView style={{ height: 320, backgroundColor:'transparent' }} showsVerticalScrollIndicator={false} >
                            <LoginComponent goBack={goBack} submit={submit} lostPasswordRequest={lostPassword} ref={loginRef} bgColor={textColor} />
                            <View style={{ marginTop: 16 }} />
                            <Button title={t("account:LOGIN_SUBMIT")} onPress={submitMe} titleColor='white' bgColor={textColor} />
                            <Button title={t("account:CREATE_ACCOUNT_SUBMIT")} onPress={goCreate} titleColor='white' bgColor={textColor} />

                            <TouchableOpacity activeOpacity={1} onPress={goForgottenEmail} touchSoundDisabled={true} style={{marginTop:20}}>
                                <Text style={[styles.text,{marginTop:5}, styles.underline]}>{t("account:EMAIL_FORGOTTEN")}</Text>
                            </TouchableOpacity>  
                        </ScrollView>
                        <View style={{ marginBottom: 20 }}></View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
export default LoginScreen;


const styles = StyleSheet.create({
    validateButton: {
        //color:"#FFFFFF",
        borderRadius: 0,
        height: 40,
        marginBottom: 10,
        backgroundColor: '#3E495E',
        width: '50%',
        borderRadius: 12,
    },
    text: {
        marginTop:0,
        marginBottom:20,
        fontWeight: '400',
        fontSize: 16,
        textAlign: 'center',
        color: '#3E495E'
    },
    underline: {
        textDecorationLine: 'underline',
    },
})



