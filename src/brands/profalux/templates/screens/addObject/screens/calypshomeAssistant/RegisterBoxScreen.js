import '_brand/templates/screens/addObject/locales'
import React from 'react';
import {useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute, StackActions } from '@react-navigation/native';


import { useTheme } from '_theming/themeProvider'
import ScreenContainer from './components/ScreenContainer'
import { logout as ApiLogout } from '_api/Api';
import { SimpleForm } from './components/SimpleForm';
import { BoxCodeField } from './components/BoxCodeField';
import { getObjects } from '_api/objects'
import { Api } from '_api';
import Toast from 'react-native-root-toast';
import { myToast } from '_brand/templates/components/ui/myToast';

export const RegisterBoxScreen = (props) => {

    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const { theme } = useTheme();
    const navigation = useNavigation();
    const textColor = theme?.prflxTextColor || 'black'
    const boxNameValueRef = useRef('')
    const boxCodeValueRef = useRef('')
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
        console.log("Hello Name installation submited +++++++:", values.installName)
        boxNameValueRef.current = values.installName
        //setBoxName(values.installName)
    }
    const handleBoxCodeSubmit = (values) => {
        console.log("Hello Code Box submited :", values.boxCode)
        const filterCode = values.boxCode;
        //const filterCode = values.boxCode.replace(/[^a-zA-Z0-9 ]/g, '') 
        console.log("CODE BOX FILTERED :", filterCode)
        boxCodeValueRef.current = filterCode;
    }

    const validateMe = async () => {
        console.log("I have been Validated", installNameRef.current.submitForm(), boxCodeRef.current.submitForm())

        const installName = installNameRef.current.submitForm();
        const installBox = boxCodeRef.current.submitForm()
        // if(installName != undefined && installBox != undefined){

        // }
        boxNameValueRef.current = installNameRef.current.submitForm();
        boxCodeValueRef.current = installBox == undefined ? installBox : installBox.replace(/[^a-zA-Z0-9 ]/g, '');// remove all special characters

        const box = boxCodeValueRef.current == undefined ? boxCodeValueRef.current : (boxCodeValueRef.current).trim(); // trim() for removing spaces at the beginin and end of the field
        const name = boxNameValueRef.current == undefined ? (boxNameValueRef.current) : (boxNameValueRef.current).trim();
        let isValide;
        let message;
        console.log("NAME SHOW :", box)


        if (name == '' || box == '') {
            message = `${t(tns + ":" + "ALL_FIELD_MANDATORY")}`
            isValide = false;
        } else if (name == undefined || box == undefined) {
            message = `${t(tns + ":" + "ALL_FIELD_MANDATORY")}`
            isValide = false;
        } else if (box.length != 24) {
            message = `${t(tns + ":" + "WRONG_BOX_NUM")}`
            isValide = false;
        } else { isValide = true }


        if (isValide) {
            const res = await Api.addGatewayObject(box, name).catch((err) => console.log(err));
            console.log("RES API CREATION GATEWAY :", res)
            if (res.errCode == 200) {
                const obj = await getObjects();
                console.log(" GET OBJECTS :", JSON.parse(JSON.stringify(obj)))
                const boxId = 1;
                // navigation.navigate('InstallZigbeeNetworkScreen', { boxId })
                // navigation.navigate("AddObject")
                navigation.dispatch(StackActions.popToTop())
                navigation.navigate("AddObject")
                navigation.navigate("MaisonScreen")
                const infoMessage = `${t(tns + ":" + "RESTART_BOX_BEFORE_ADDING_IT_TO_NETWORK")}`;
                const bgColor = 'red';
                const textColor = "white";
                const duration = 5000;
               myToast(infoMessage, bgColor, textColor, duration)
            } else {
                message = `${t(tns + ":" + "BOX_NUM_NOT_KNOWN_BY_SERVER")}`
                console.log(" ERROR LOG FILTERED CODE :", (boxCodeValueRef.current).replace(/[^a-zA-Z0-9 ]/g, ''))
                Toast.show(
                    message,
                    {
                        backgroundColor: 'red',
                        textColor: 'white',
                        textStyle: { fontSize: 16, fontWeight: '600' },
                        //containerStyle:{width:'80%', height:100, justifyContent:'center', alignItems:'center', borderRadius:10, borderColor:borderColor, borderWidth:2}, 
                        position: Toast.positions.CENTER,
                        duration: 3000,
                        onHide: () => { }
                    }
                );
            }

        } else {
            Toast.show(
                message,
                {
                    backgroundColor: 'red',
                    textColor: 'white',
                    textStyle: { fontSize: 16, fontWeight: '600' },
                    //containerStyle:{width:'80%', height:100, justifyContent:'center', alignItems:'center', borderRadius:10, borderColor:borderColor, borderWidth:2}, 
                    position: Toast.positions.CENTER,
                    duration: 3000,
                    onHide: () => { }
                }
            );
        }

    }

    return (
        <ScreenContainer headerTitle={t(tns + ":" + "ADD_CALYPS_BOX")} goBack={() => navigation.goBack()}>
            <View style={{ justifyContent: 'center', paddingVertical: 20, borderWidth: 1, borderColor: 'orange', borderRadius: 14, backgroundColor: 'white' }}>
                <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'left', color: textColor, marginBottom: 15 }}>{t(tns + ":" + "BOX_CODE_FILED_DESCRIP")}</Text>
                    <BoxCodeField
                        ref={boxCodeRef}
                        //defaultCode = {`HQV27CGASENSPB3FQLZ81K30`}
                        //fieldText={`Entrez le numéro S/N indiqué sous la box\n CalypsHome`}
                        handleBoxCodeSubmit={handleBoxCodeSubmit}
                        fieldWidth={'100%'}
                    />

                    <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'left', color: textColor, marginBottom: 15 }}>{t(tns + ":" + "NAME_FILED_DESCRIP")}:</Text>
                    <SimpleForm
                        ref={installNameRef}
                        //defaultName = 'Maison'
                        //fieldText={`Comment shouhaitez-vous appeler votre ${'\n'}  installation ?`}
                        handleSimpleFormSubmit={handleSimpleFormSubmit}
                        fieldWidth={'100%'}
                    />
                </View>
            </View>

            {/* <View style={[styles.validateButton, {marginHorizontal:DEVICE_WIDTH/4, marginTop:40}]}>
                <Button onPress={validateMe}  title='Valider' color="white" />
            </View> */}
            <TouchableOpacity
                onPress={validateMe}
                style={{ justifyContent: 'center', alignItems: 'center', marginTop: 200, backgroundColor: '#3E495E', borderRadius: 12, minHeight: 50 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>{t(tns + ":" + "VALIDATE")}</Text>
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
        backgroundColor: '#3E495E',
        width: '50%',
        borderRadius: 12,
    },
    text: {
        marginTop: 23,
        fontWeight: '400',
        fontSize: 16,
        textAlign: 'center',
        color: '#3E495E'
    },
})