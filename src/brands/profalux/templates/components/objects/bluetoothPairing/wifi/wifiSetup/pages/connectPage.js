/**
 * 
 * 
 *  base : https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
 *  validation : https://www.youtube.com/watch?v=ftLy78R8xrg&list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ&index=32
 * 
 * 
 */

import React, { Component,useRef,useState,forwardRef,useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity,KeyboardAvoidingView } from 'react-native';
import Toast from 'react-native-root-toast';

import { Formik, withFormik, yupToFormErrors } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';


import { useTheme } from '_theming/themeProvider';
import {H1, H1PopUp, H3, P, VSeparator, IllustrationVSeparator} from '_brand/templates/styled';

import PageContainer from './pageContainer';

//import FormInput from '_components/forms/formInput';
import FormInput from '_brand/templates/components/forms/FormInput';
import Button from '_brand/templates/components/ui/Button';

import { useNavigation,useRoute, StackActions } from '@react-navigation/native';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import {useGlobalModal} from '_components/ui/globalModal'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import * as Actions from '_actions/objects';
import { useDispatch } from 'react-redux';
import { deleteObject } from '_api/objects';
import { myToast } from '_brand/templates/components/ui/myToast';

//---------------------------------------------------------------


yup.setLocale({
  
  // use functions to generate an error object that includes the value from the schema
  string: {
    min: ({ min }) => ({ key: 'PIN_TOO_SHORT', values: { min } }),
    max: ({ max }) => ({ key: 'field_too_big', values: { max } }),
  },
});

const loginFormSchema = yup.object({
    wifiPassword: yup.string().required("INPUT_MANDATORY_FIELD")
});

//----------------------------------------------------------------


const BasicFormComponent = forwardRef((props,ref) => {



const navigation = useNavigation();
const route = useRoute();
const navigationParams = route?.params || {};
console.log("navigationParams_connectPage",navigationParams);

const {SSID,isWizard, objectId} = navigationParams;


 const formikRef = useRef(null)

 // REF methods can be called (useImperativeHandle)

 useImperativeHandle(ref, () => ({
          
    
      submitForm() {   
        formikRef.current.submitForm();        
          //setModalVisible(!modalVisible);
      },
      resetForm() {
       formikRef.current.resetForm()
      }
  }));


 const { t, i18n } = useTranslation();    
 const {theme} = useTheme();
 const globalModal = useGlobalModal(); 


 const {bgColor,startWrapperFocused} = props;

const passwordRef = useRef(null);


const handleChange = (prop,value) => {
 console.log(prop,value);
 return value;
 //this.setState({errServer:null});
 }



const goToProcess = (password) => {
  console.log("goToProcess",password);
  navigation.navigate("WifiBleConnectionProcess",{"SSID":SSID,"password":password});

}

const  handleSubmit = async(values) =>{
 

 console.log("handleSubmit",values)


 
 let validData = [];
 let isValid =  await loginFormSchema.isValid(values);

 if(isValid) {
   console.log("isValid ====> ",values)
   goToProcess(values.wifiPassword)
   return true;

   //return true
 } else {
   try {
     validData = await loginFormSchema.validate(values,{abortEarly:false});   
   
   } catch (error) {
     validData = error.errors      
   }   
 
   let msg ="\n";
   validData.forEach(err => { 
     console.log(err);
     if(typeof err == "object") {
       msg+= t(err.key,err.values)+"\n";
     } else {
       msg+= t(err)+"\n";
     }
    
   });
   
   Toast.show(msg);
 
 }
  

}
// in order to remove errServer State
const handleFocus = (e) => {
 console.log("handle FOCUS",this);
 //this.setState({errServer:null})
}





const changeFocus = (myRef) => {
 console.log("changeFocus",myRef);
 if( myRef.current?.input) {
   myRef.current.input.focus()
 }    
}

//======== APPIUM =============

const onButtonPress = () => {
    console.log("onButtonPress");
    formikRef.current.submitForm();
    //props.submit(values);
    //changeFocus(passwordRef);
    //passwordRef.current.focus();
    //console.log("onButtonPress",passwordRef.current.input);
    //passwordRef.current.input.focus();
    }


const tns = "addObject"



 const title = t(tns + ':' + 'WIFI_HEADER_TITLE') + ''

const goBack = () => {
    console.log("LEAVE_FORM_BACK");
    navigation.dispatch(StackActions.pop(1));
}

const onCancel =()=>{
  if(isWizard == 0){
    // go Back
    globalModal.close();
      navigation.dispatch(StackActions.pop(2));
      //navigation.navigate("ProductSettings")
      //navigation.dispatch(StackActions.popToTop());
  }else{
    onOpenSelect()
}
}

    //???????????????????????????????????????????????????????????
      const buttons = [
          {
              id:"return",
              text:`${t(tns + ":" + "RETURN")}`,
              action:()=>onCancelPressed(),
              textColor:"#007AFF"
          },
          {
              id:"validate",
              text:`${t(tns + ":" + "TO_STOP")}`,
              action:()=>onValidate(),
              textColor:"red"
          }
      ]

    
      const onCancelPressed = () => {
        console.log('CANCEL_DELETE :');
        globalModal.close();
      }
      const onValidate = async() => {
        console.log('ID :', objectId);
        // Delete created Sesame
        const newSesameId = objectId;
        console.log('NEW_SESAME:',newSesameId);
        globalModal.close();
        const res = await deleteObject(newSesameId).catch((err) => { console.log(err) });
        console.log('DELETE_SESAME_ON_CREATION :', res);

        if (res.errCode == 200) {
                    //navigate Home Screen
            navigation.navigate("AddObject")
            navigation.navigate("MaisonScreen")
            console.log('CHECK_POINT_DELETE 1', newSesameId);
            const action = Actions.objectDelete(newSesameId);
            dispatch(action)
        }else{
                const message = `Erreur ${res.errCode} : ${res.errMsg}`;
                const bgColor = 'red';
                const textColor = "white";
                const duration = 4000;
                myToast(message, bgColor, textColor, duration)
        }
      }
      
      const onOpenSelect = () => {  
          const content = (
            <View style={{width:"95%", backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                <GlobalToast 
                    toastTitle={t(tns + ":" + "WARNING")}
                    toastBody={t(tns + ":" + "STOP_EQUIPMENT_CONFIGURATION")}
                    buttons={buttons}
                />
            </View>
                )
          globalModal.setContent(content,{type:'centered'});    
          globalModal.toggle();
      }
    //???????????????????????????????????????????????????????????


    return (
      <PageContainer title={title} goBack={goBack}>
          <View style={{width:'100%',borderColor:'orange', borderWidth:1,borderRadius:10, backgroundColor:'white',padding:10, marginBottom: 20}}>       
              {props.connectingError != 200 && props.connectingError != undefined ?        
                <Text>Error ...</Text>
                :
                null    
              }
              
              <Text style={{color:theme?.prflxTextColor, fontSize: 14, fontWeight: '600',textAlign:'center', marginTop: 10}}>
                {t(tns+":"+"WIFI_PASSWORD_TITLE",{networkName:`\n${SSID}`})} 
              </Text>
              <VSeparator height={24}/>

                <Formik
                    initialValues={{ wifiPassword: "" }}
                  
                    onSubmit={handleSubmit}
                    innerRef={formikRef}    
                    >

                    {({ values, errors, setFieldTouched, touched, isValid, handleSubmit ,setFieldValue}) => {

                      const noSpace = "noSpace"
                      
                      const [userInput, setUserInput] = useState('');
                      const handleChange = (text) => {
                        // Allow only letters and numbers, ignore spaces and others
                        const filtered = text.replace(/\s/g, '');
                        values.wifiPassword = filtered;
                        setUserInput(filtered);
                      };

                      const handleKeyPress = ({ nativeEvent }) => {
                        if (nativeEvent.key === ' ') {
                          // Block space character
                          nativeEvent.preventDefault?.(); // optional: for future compatibility
                        }
                      };

                    return (
                            
                      
                        <View style={{backgroundColor:'transparent'}}>
                          <FormInput  name='wifiPassword' value={userInput} 
                                      placeholder={t(tns+":"+"INPUT_WIFI_PASSWORD")+ ""}   
                                      autoCapitalize='none'                               
                                      onKeyPress={handleKeyPress}
                                      onChangeText={handleChange}
                                      secureTextEntry
                                      passwordToggle
                                      bgColor={"white"} color={"black"}                              
                                      startWrapperFocused={startWrapperFocused}  
                                                            
                                      />   
                          
                          </View>
                      
                    
                    );
                  }}
                </Formik>  
                <Button onPress={onButtonPress} titleColor={"white"} title={t(tns+":"+"WIFI_CONNECT_BUTTON")} bgColor={theme?.prflxTextColor} />
          </View>
          <View style={{ width: '60%', marginTop: 150, alignSelf:'center'}}>
                  <MyButton onPress={onCancel} title={t(tns + ":" + "CANCEL")} />
          </View>
      </PageContainer>
  )


})

export default BasicFormComponent;

