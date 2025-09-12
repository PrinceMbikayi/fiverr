import '_brand/templates/screens/_locales'
import React from 'react';
import {useContext,useState,useEffect, useRef} from 'react';
import {View, StyleSheet, Button, Dimensions, Pressable, Text, TouchableOpacity} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import { useTranslation } from 'react-i18next';
import {difference as lodashDifference, pull as lodashPull} from 'lodash';

import { useNavigation,useRoute } from '@react-navigation/native';


import { useTheme} from '_theming/themeProvider'

import AsyncStorage from '@react-native-community/async-storage';
import ScreenContainer from '../components/ScreenContainer'
import {logout as ApiLogout} from '_api/Api';
import { SimpleForm } from '../components/SimpleForm';
import { BoxCodeField } from '../components/BoxCodeField';
import {getObjects} from '_api/objects'
import { Api } from '_api';
import Toast from 'react-native-root-toast';
import {addObjectAction,refreshObjectAction} from '_actions/asyncActions'
import * as Durin from '_api/durin';
import { iconsJs } from '_brand/utils/iconsJs';
import RightChevron from '_brand/images/icons/app/profaluxIconJs/RightChevron';
import { MultiPurposeWidgetLine } from '_brand/templates/components/objects/common/MultiPurposeWidgetLine';
import { DisplayForm } from '../components/DisplayForm';
import {ConfirmLoginForm} from '_brand/templates/screens/account/components/ConfirmLoginForm'
import {userUpdateLogin} from '_actions/user';

export const ConfirmEditLogin = (props) => {
    
    const { t, i18n } = useTranslation();
    const tns = "products"
    const {theme } = useTheme();
    const dispatch = useDispatch();
    
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {}; 
    const {oldLogin, newLogin} = navParams

    console.log("NAV_PARAMS :", oldLogin, newLogin)

    const bgColor = theme?.prflxbgColor||'white';
    const textColor = theme?.prflxTextColor||'black';



      const codeValueRef = useRef('')

      const DEVICE_WIDTH = Dimensions.get('window').width;

      const codeRef = useRef(null);


      const handleSimpleFormSubmit = async(values)=>{
          const userCode = values.code
          console.log("Hello Code to submit +++++++:", userCode, oldLogin, newLogin)
        // //codeValueRef.current = values.installName
        const res = await Api.confirmUpdateLogin(oldLogin, newLogin, userCode ).catch((err) => console.log(err)); 
        console.log('REQUEST_UPDATE_LOGIN :', res);

        if(res.errCode == 200){
            console.log('LOGIN_TO_UPDATE :', newLogin);
            const action = userUpdateLogin(newLogin)
            dispatch(action)
            navigation.navigate("PersonalInfos")
        }else{
            if(res.errMsg == 'invalid_otp'){
                Toast.show(
                    `${t("account:INVALID_CODE")}`,
                    { 
                        backgroundColor: 'red', 
                        textColor: 'white', 
                        textStyle:{fontSize:16, fontWeight:'600'},
                        position: Toast.positions.CENTER,
                        duration:3000,  
                        onHide:()=>{}
                    }
                ); 
            }
        }
      }

      const validateMe = async()=>{
            // console.log("I have been Validated")
            codeValueRef.current = codeRef.current.submitForm();
        }

        const resendCode = async()=>{
            //console.log('RESEND_CODE :', oldLogin);
            const action = 'send_back_code';
            const res = await Api.updateLogin(oldLogin, newLogin, action).catch((err) => console.log(err)); 
        }
        const goBack = ()=>{
            navigation.goBack();
          }

      return (
        <ScreenContainer headerTitle={t("account:CHECK_EMAIL")} goBack={{action:goBack}}>
        <View style={{justifyContent:'center',}}>
            <View>
                <Text style={ styles.text}>{t("account:COPY_CODE_HINT")}</Text>
            </View>
            <View style={{marginTop:40}}>
                {/* <SimpleForm
                    ref={codeRef}
                    //defaultName = 'Maison'
                    placeholder= {t("account:CODE")}
                    handleSimpleFormSubmit={handleSimpleFormSubmit}
                    fieldWidth={'80%'}
                /> */}
                 <ConfirmLoginForm  submit={handleSimpleFormSubmit}  ref={codeRef} bgColor={textColor} />
            </View>

        </View>

        <TouchableOpacity 
            onPress = {validateMe}
            style={{justifyContent:'center',alignItems:'center', marginHorizontal:DEVICE_WIDTH/4, marginTop:100,backgroundColor:'#3E495E', borderRadius:12, minHeight:40}}>
            <Text style={{color:'white', fontSize:16, fontWeight:'400'}}>{t("account:CONFIRM")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={resendCode}
            >
            <Text style={[styles.text, styles.underline]}>{t("account:RESEND_CODE")}</Text>
        </TouchableOpacity>
    </ScreenContainer>
   
        )
};


const styles = StyleSheet.create({
    validateButton: {
        //color:"#FFFFFF",
        borderRadius: 0,
        height: 40,
        marginBottom: 10,
        backgroundColor:'#3E495E',
        width:'50%',
        borderRadius:12,
    },
    text: {
        marginTop:23,
        fontWeight:'400',
        fontSize: 16,
        textAlign:'center',
        color: '#3E495E'
    },
    underline: {
        textDecorationLine: 'underline',
    },
})