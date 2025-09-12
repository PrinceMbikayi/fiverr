import '_brand/templates/screens/_locales'
import React from 'react';
import { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider'
import { getUser } from '_helpers/selectors';
import ScreenContainer from '../components/ScreenContainer'
import { SimpleForm } from '../components/SimpleForm';
import { Api } from '_api';
import Toast from 'react-native-root-toast';
import { DisplayForm } from '../components/DisplayForm';
import {getUserDetails} from '_api/user'
import {userNickname, userUpdate, userUpdateLogin} from '_actions/user';






export const PersonalInfos = (props) => {

    const { t, i18n } = useTranslation();
    const tns = "products"
    const { theme } = useTheme();
    const dispatch = useDispatch();

    const navigation = useNavigation();
    const userDetails = useSelector(state => getUser(state));
    console.log("USER_DETAILS :", userDetails)


    const boxNameValueRef = useRef('')

    const DEVICE_WIDTH = Dimensions.get('window').width;

    const installNameRef = useRef(null);


    useEffect(() => {
        console.log("USER_NAME :")
        const getUserName = async () => {
            await getUserDetails().catch((err)=> console.log(err));
        }

        getUserName()
    }, []);

    const handleSimpleFormSubmit = async (values) => {
        console.log("Hello Name installation submited +++++++:", values.installName)
        boxNameValueRef.current = values.installName
        //setBoxName(values.installName)
    }


    const goBack = () => {
        navigation.goBack();
    }
    const validateMe = async () => {

        boxNameValueRef.current = installNameRef.current.submitForm();

        const name = (boxNameValueRef.current).trim();
        let isValide;
        let message;


        if (name == '') {
            message = `${t("account:NAME_FIELD_MANDATORY")}`
            isValide = false;
        } else if (name == undefined) {
            message = `${t("account:NAME_FIELD_MANDATORY")}`
            isValide = false;
        } else { isValide = true }

        console.log("I have been Validated 2 :", isValide, userDetails?.login, name)

        console.log("RES_API_UPDATE_NAME :", userDetails?.login, name)
        if (isValide) {
            const res = await Api.updateUserName(userDetails?.login, name).catch((err) => console.log(err));
            console.log("RES_UPDATE_NAME :", res)
            if (res.errCode == 200) {
                const action =  userNickname(name)
                console.log('NAME :', name);
                dispatch(action) 
                navigation.navigate('AccountHome')
            } else {

                const errCode =  res?.errCode;
                const errMsg = res?.errMsg;
                if (res.errMsg == 'unavailable_key') {
                    Toast.show(
                        `${t(tns + ":" + "SERVER_ERROR")} : ${errCode} ${errMsg}`,
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

        } else {
            Toast.show(
                message,//`${res.errCode} : ${res.errMsg}`,
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
    
    const editLogin = () => {
        console.log('GO EDIT LOGIN :');
        navigation.navigate("EditLogin")
    }
    const editPassword = () => {
        console.log('GO EDIT PASSWORD :');
        navigation.navigate("EditPassword")
    }

    return (
        <ScreenContainer headerTitle={t("account:PERSONAL_INFOS")} goBack={{ action: goBack }}>
            <View style={{ justifyContent: 'center', backgroundColor:'transparent'}}>
                <View>
                    <Text style={styles.text}>{t("account:MODIFY_YOUR_INFOS")}</Text>
                </View>
                <View style={{}}>
                    <SimpleForm
                        ref={installNameRef}
                        placeholder={ t("account:NAME_FIRSTNAME") + "       " +userDetails?.nickname || t("account:NAME_FIRSTNAME")}
                        handleSimpleFormSubmit={handleSimpleFormSubmit}
                        fieldWidth={'80%'}
                    />
                </View>
                <View style={{ marginTop: 25, width: '80%', marginLeft: 30, borderTopWidth: 1, opacity: 1, borderTopColor: '#3E495E' }} />
                <View style={{ marginTop: 20, marginLeft: 0 }}>
                    <DisplayForm
                        placeholder={`${t("account:EMAIL")}     ` + userDetails?.login}//{`${t("account:NAME_FIRSTNAME")} `}
                        editable={false}
                        goEditForm={editLogin}
                    />
                </View>
                <View style={{ marginTop: 25, width: '80%', marginLeft: 30, borderTopWidth: 1, opacity: 1, borderTopColor: '#3E495E' }} />
                <View style={{ marginTop: 20, marginLeft: 0 }}>
                    <DisplayForm
                        placeholder={`${t("account:PASSWORD")}        **********`}
                        editable={false}
                        goEditForm={editPassword}
                    />
                </View>


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
})