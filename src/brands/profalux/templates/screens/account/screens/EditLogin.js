import '_brand/templates/screens/_locales'
import React from 'react';
import { useRef} from 'react';
import {View, StyleSheet, Dimensions, Text, TouchableOpacity} from 'react-native';
import {useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import { useNavigation} from '@react-navigation/native';
import { useTheme} from '_theming/themeProvider'
import{getUser} from '_helpers/selectors';
import ScreenContainer from '../components/ScreenContainer'
import {logout as ApiLogout} from '_api/Api';
import { Api } from '_api';
import {EditLoginForm} from '_brand/templates/screens/account/components/EditLoginForm'
import { myToast } from '_brand/templates/components/ui/myToast';


export const EditLogin = (props) => {
    
    const { t, i18n } = useTranslation();
    const tns = "products"
    const {theme } = useTheme();    
    const navigation = useNavigation();
    const userDetails = useSelector(state =>getUser(state));
    const textColor = theme?.prflxTextColor||'black';

    const DEVICE_WIDTH = Dimensions.get('window').width;

    const installNameRef = useRef(null);

    const doLogout = async() => {
        console.log("before Call =>")
        const callLogout = await ApiLogout().catch((err) => console.log("alorss",err));
        console.log("callLogout =>",callLogout)    
        navigation.navigate('Auth',{ screen: 'Access' });    
        console.log("je devrais être allé sur Auth / Access");
    }

    const handleSimpleFormSubmit = async(values)=>{
        const newLogin = values.login
        const oldLogin = userDetails?.login
        const action = 'update_email_get_code';
        console.log("Hello Name installation submited +++++++:",oldLogin, newLogin)
        const res = await Api.updateLogin(oldLogin, newLogin, action).catch((err) => console.log(err)); 
        console.log('REQUEST_UPDATE_LOGIN :', res);

        if(res.errCode == 200){
            navigation.navigate("ConfirmEditLogin", {oldLogin, newLogin})
        }else{
            let message;
            switch(res.errCode) {
                case 400:
                    message = `${t("account:ERROR")} ${res.errCode} : ${t("account:LOGIN_ALREADY_EXISTS")}`
                    break;
                default:
                    message =`${t("account:LOST_PASSWORD_ERROR")} ${reinitProcess.errCode} : ${reinitProcess.errMsg}`
            }
            myToast(message)
        }
    }

    const validateMe = async()=>{
        installNameRef.current.submitForm();
    }

    const goBack = ()=>{
        navigation.goBack();
        }

      return (
        <ScreenContainer headerTitle={t("account:CHANGE_EMAIL")} goBack={{action:goBack}}>
        <View style={{justifyContent:'center',}}>
            <View>
                <Text style={ styles.text}>{t("account:YOUR_MAIL_IS_YOUR_ID")}</Text>
            </View>
            <View>
                <Text style={ styles.text}>{t("account:YOU_CAN_MODIFY_MAIL")}</Text>
            </View>
            <View>
                <Text style={ styles.text}>{t("account:YOU_WILL_RECEIVE_CODE_MODIFY_MAIL")}</Text>
            </View>
            <View style={{}}>
                <EditLoginForm  submit={handleSimpleFormSubmit}  ref={installNameRef} bgColor={textColor} />
            </View>

        </View>

        <TouchableOpacity 
            onPress = {validateMe}
            style={{justifyContent:'center',alignItems:'center', marginHorizontal:DEVICE_WIDTH/4, marginTop:80,backgroundColor:'#3E495E', borderRadius:12, minHeight:40}}>
            <Text style={{color:'white', fontSize:16, fontWeight:'400'}}>{t("account:MODIFY")}</Text>
        </TouchableOpacity>
    </ScreenContainer>
   
        )
};


const styles = StyleSheet.create({
    text: {
        marginTop:23,
        fontWeight:'400',
        fontSize: 16,
        textAlign:'center',
        color: '#3E495E'
    },
})