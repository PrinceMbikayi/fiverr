import '_brand/templates/screens/_locales'
import React from 'react';
import {useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider'
import{getUser} from '_helpers/selectors';
import ScreenContainer from '../components/ScreenContainer'
import { logout as ApiLogout } from '_api/Api';
import { Api } from '_api';
import Toast from 'react-native-root-toast';
import {EditPasswordForm} from '_brand/templates/screens/account/components/EditPasswordForm'

export const EditPassword = (props) => {

    const { t, i18n } = useTranslation();
    const tns = "products"
    const { theme } = useTheme();
    const dispatch = useDispatch();

    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {};

    const userDetails = useSelector(state => getUser(state));


    const bgColor = theme?.prflxbgColor||'white';
    const textColor = theme?.prflxTextColor||'black';

    const editPasswordRef = useRef()
    const boxNameValueRef = useRef('')
    const boxCodeValueRef = useRef('')

    const DEVICE_WIDTH = Dimensions.get('window').width;

    const installNameRef = useRef(null);
    const boxCodeRef = useRef(null);

    const doLogout = async () => {

        console.log("before Call =>")
        const callLogout = await ApiLogout().catch((err) => console.log("alorss", err));
        console.log("callLogout =>", callLogout)
        navigation.navigate('Auth', { screen: 'Access' });
        console.log("je devrais être allé sur Auth / Access");
        //closeMe();
    }

    const handleSimpleFormSubmit = async (values) => {
        console.log("Hello Name installation submited +++++++:", values)
        const oldPassword = values?.oldPassword;
        const newPassword = values?.password;
        const login = userDetails?.login

        const res = await Api.updatePasswordProfalux(login, oldPassword, newPassword).catch((err) => console.log(err)); 
        console.log('REQUEST_UPDATE_LOGIN :', res);

        if(res.errCode == 200){
            navigation.navigate("PersonalInfos")
        }else{
            if(res.errMsg == "invalid_similar_password"){
                Toast.show(
                    `${t("account:INVALID_SIMILAR_PASSWORD")}`,
                    {
                        backgroundColor: 'red',
                        textColor: 'white',
                        textStyle: { fontSize: 16, fontWeight: '600' },
                        position: Toast.positions.CENTER,
                        duration: 3000,
                        onHide: () => { }
                    }
                );
            }
        }
    }

    const validateMe = async () => {
        console.log("I have been Validated")
        editPasswordRef.current.submitForm()

    }

    const goBack = () => {
        navigation.goBack();
    }

    const goForgottenPassword = ()=>{
        console.log('PASSWORD_FORGOTTEN :');
        //navigation.navigate("LostPassword")
        navigation.navigate("ReinitLostPassword")
    }

    return (
        <ScreenContainer headerTitle={t("account:CHANGE_PASSWORD")} goBack={{ action: goBack }}>
            <View style={{ justifyContent: 'center', marginTop: 20 }}>
                <EditPasswordForm  
                    submit={handleSimpleFormSubmit}  
                    ref={editPasswordRef} 
                    bgColor={textColor} 
                    goForgottenPassword={goForgottenPassword}
                    />
            </View>

            <TouchableOpacity
                onPress={validateMe}
                style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: DEVICE_WIDTH / 4, marginTop: 80, backgroundColor: '#3E495E', borderRadius: 12, minHeight: 40 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>{t("account:MODIFY")}</Text>
            </TouchableOpacity>
        </ScreenContainer>

    )
};


const styles = StyleSheet.create({
    text: {
        marginTop: 23,
        fontWeight: '400',
        fontSize: 16,
        textAlign: 'center',
        color: '#3E495E'
    },
    underline: {
        textDecorationLine: 'underline',
    },
})