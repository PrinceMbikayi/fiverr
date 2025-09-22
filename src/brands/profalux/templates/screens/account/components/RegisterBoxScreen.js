import "_brand/templates/screens/productsRelated/products/locales"
import React from 'react';
import {useContext,useState,useEffect, useRef} from 'react';
import {View, StyleSheet, Button, Dimensions, Pressable, Text, TouchableOpacity} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import { useTranslation } from 'react-i18next';
import {difference as lodashDifference, pull as lodashPull} from 'lodash';

import { useNavigation,useRoute } from '@react-navigation/native';


import { useTheme} from '_theming/themeProvider'
import {AutomatedTestIdDisplay} from '_components/objects/@common/testAutomation/AutomatedTestId';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenContainer from './ScreenContainer'
import {logout as ApiLogout} from '_api/Api';
import { SimpleForm } from './SimpleForm';
import { BoxCodeField } from './BoxCodeField';
import {addGateway} from '_actions/objects';
import {getObjects} from '_api/objects'
import { Api } from '_api';
import Toast from 'react-native-root-toast';
import {addObjectAction,refreshObjectAction} from '_actions/asyncActions'
import * as Durin from '_api/durin';

const RegisterBoxScreen = (props) => {
    
    const { t, i18n } = useTranslation();
    const tns = "products"
    const {theme } = useTheme();
    const dispatch = useDispatch();
    
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {}; 



      const boxNameValueRef = useRef('')
      const boxCodeValueRef = useRef('')

      const DEVICE_WIDTH = Dimensions.get('window').width;

      const installNameRef = useRef(null);
      const boxCodeRef = useRef(null);

      const doLogout = async() => {
   
        console.log("before Call =>")
        const callLogout = await ApiLogout().catch((err) => console.log("alorss",err));
       console.log("callLogout =>",callLogout)    
        navigation.navigate('Auth',{ screen: 'Access' });    
        console.log("je devrais être allé sur Auth / Access");
        //closeMe();
      }

      const handleSimpleFormSubmit = async(values)=>{
        console.log("Hello Name installation submited +++++++:", values.installName)
        boxNameValueRef.current = values.installName
        //setBoxName(values.installName)
      }
      const handleBoxCodeSubmit = (values)=>{
        console.log("Hello Code Box submited :", values.boxCode)
        const filterCode = values.boxCode;
        //const filterCode = values.boxCode.replace(/[^a-zA-Z0-9 ]/g, '') 
        console.log("CODE BOX FILTERED :", filterCode)
        boxCodeValueRef.current = filterCode;
      }

      const validateMe = async()=>{
            console.log("I have been Validated")
            boxNameValueRef.current = installNameRef.current.submitForm();
            boxCodeValueRef.current =  (boxCodeRef.current.submitForm()).replace(/[^a-zA-Z0-9 ]/g, '') ;// remove all special characters

            const box = (boxCodeValueRef.current).trim(); // trim() for removing spaces at the beginin and end of the field
            const name = (boxNameValueRef.current).trim();
            let isValide;
            let message;


            if(name == '' || box == ''){
                message = " Tous les champs sont obligatoires !"
                isValide = false;
            }else if(name == undefined || box == undefined){
                message = " Tous les champs sont obligatoires !"
                isValide = false;
            }else if(box.length != 24){
                message = " Votre numero de box est incorrecte " 
                isValide = false;
            }else{isValide = true}


            if(isValide){
                const res = await Api.addGatewayObject(box, name).catch((err) => console.log(err)); 
                console.log("RES API CREATION GATEWAY :", res)
                if(res.errCode == 200){
                    const obj = await getObjects();
                    console.log(" GET OBJECTS :", JSON.parse(JSON.stringify(obj)))

                    Toast.show(
                        "Redémarrez votre box pour terminer l'association à votre compte ",
                        {
                            backgroundColor: '#3E495E',
                            textColor: 'white',
                            textStyle: { fontSize: 16, fontWeight: '600' },
                            position: Toast.positions.CENTER,
                            duration: 3000,
                            onHide: () => { }
                        }
                    );
                    
                    navigation.navigate('productsScreen')
                }else{

                    if(res.errMsg == 'unavailable_key'){
                        Toast.show(
                            `${t(tns + ":" + "KEY_UNAVAILABLE")}`,
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

            }else{
                Toast.show(
                    message,//`${res.errCode} : ${res.errMsg}`,
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

      return (
        <ScreenContainer headerTitle="Configuration" goBack={{action:doLogout}}>
        <View style={{justifyContent:'center', paddingVertical:60,}}>
            <View style={{}}>
                <SimpleForm
                    ref={installNameRef}
                    //defaultName = 'Maison'
                    fieldText= {`${t(tns+":"+"BOX_NAME")} `}
                    handleSimpleFormSubmit={handleSimpleFormSubmit}
                    fieldWidth={'60%'}
                />
            </View>
            
            <View style={{marginTop:50,backgroundColor:'transparent'}}>
            
                <BoxCodeField
                    ref={boxCodeRef}
                    //defaultCode = {`HQV27CGASENSPB3FQLZ81K30`}
                    fieldText= {`${t(tns+":"+"BOX_NUMBER")} `} 
                    handleBoxCodeSubmit={handleBoxCodeSubmit}
                    fieldWidth={'60%'}
                />
            </View>
        </View>

        <TouchableOpacity 
            onPress = {validateMe}
            style={{justifyContent:'center',alignItems:'center', marginHorizontal:DEVICE_WIDTH/4, marginTop:40,backgroundColor:'#3E495E', borderRadius:12, minHeight:40}}>
            <Text style={{color:'white', fontSize:16, fontWeight:'400'}}>{t(tns+":"+"VALIDATE")}</Text>
        </TouchableOpacity>
    </ScreenContainer>
   
        )
};

export default RegisterBoxScreen;


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
})