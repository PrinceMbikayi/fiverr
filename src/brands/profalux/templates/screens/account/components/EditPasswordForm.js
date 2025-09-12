import '_brand/templates/screens/_locales'
import React, { Component,useRef,useState,forwardRef,useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Toast from 'react-native-root-toast';
import { Formik, withFormik, yupToFormErrors } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import FormInput from '_brand/templates/components/forms/FormInput';
import WithTranslateFormErrors from "_utils/withTranslateFormErrors";
import {onChangeWithRulesExternal} from '_components/forms//utils';
//--- Appium -----
import {buildTestId} from '_helpers/appium';

//---------------------------------------------------------------
yup.setLocale({
  
  // use functions to generate an error object that includes the value from the schema
  string: {
    min: ({ min }) => ({ key: 'PASSWORD_TOO_SHORT', values: { min } }),
    max: ({ max }) => ({ key: 'field_too_big', values: { max } }),
  },
});
const editPasswordFormSchema = yup.object({
  oldPassword: yup.string().min(6).required("PASSWORD_INPUT_MANDATORY_FIELD"),
  password: yup.string().min(6).required("PASSWORD_INPUT_MANDATORY_FIELD"),
  confirm:yup.string().oneOf([yup.ref('password'), null], "PASSWORDS_MUST_MATCH")
});


export const EditPasswordForm = forwardRef((props,ref) => {

    const {goForgottenPassword} = props;

 const formikRef = useRef(null)

 // REF methods can be called (useImperativeHandle)

 useImperativeHandle(ref, () => ({
          
    
      submitForm() {   
        formikRef.current.submitForm();        
          //setModalVisible(!modalVisible);
      }
  }));


 const { t, i18n } = useTranslation();    
 const {theme} = useTheme();


 const {bgColor} = props;

const oldPasswordRef = useRef(null);
const passwordRef = useRef(null);
const confirmPasswordRef = useRef(null);

const  handleSubmit = async(values) =>{
 
 let validData = [];
 let isValid =  await editPasswordFormSchema.isValid(values);

 if(isValid) {
   console.log("isValid")
   props.submit(values);
   
   //return true
 } else {
   try {
     validData = await editPasswordFormSchema.validate(values,{abortEarly:false});   
   
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


//======== APPIUM =============
const oldPasswordID = buildTestId("password")
const passwordID = buildTestId("password")
const newPasswordID = buildTestId("password")
const forgottenPasswordID = buildTestId("forgottenPassword")
const buttonPreviousID = buildTestId("buttonPrevious");
const buttonNextID = buildTestId("buttonNext");

 return (
   <React.StrictMode>
    <View style={{backgroundColor:'transparent'}}>       
     {props.connectingError != 200 && props.connectingError != undefined ?        
      <Text>Error ...</Text>
      :
      null    
    }
      <Formik
            //initialValues={{ login: 'test@profalux.com', password: 'testAP23;' }}
            initialValues={{oldPassword: '', password:'', confirm:'' }}
            no_validationSchema={editPasswordFormSchema}
            onSubmit={handleSubmit}
            innerRef={formikRef}    
            >

            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit ,setFieldValue}) => {

              const noSpace = "noSpace"
              


            return ( <>
             <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
              <View style={{backgroundColor:'transparent', justifyContent:'center',alignItems:'center',marginLeft:15, width:'90%'}}>     
                    <View>
                        <Text style={styles.text}>{t("account:YOUR_CURRENT_PASSWORD")}</Text>
                    </View>                 
                    <FormInput name='oldPassword' value={values.oldPassword}  placeholder={t('account:CURRENT_PASSWORD')+'  ****'} secureTextEntry passwordToggle   onChangeText = {onChangeWithRulesExternal('oldPassword',noSpace)(values,setFieldValue)}  ref={oldPasswordRef} returnKeyType='done' iconName='ios-lock' iconColor='#2C384A' bgColor={bgColor} addTestId = {oldPasswordID}/>       

                    <Pressable
                            onPress={goForgottenPassword}
                        >
                            <Text style={[styles.text,{marginTop:5}, styles.underline]}>{t("account:PASSWORD_FORGOTTEN")}</Text>
                    </Pressable>       

                    <View style={{ marginTop: 25, width: '100%', marginLeft: 0, marginBottom:35, borderTopWidth: 1, opacity: 1, borderTopColor: '#3E495E' }} />
                    
                    <View>
                        <Text style={styles.text}>{t("account:YOUR_NEW_PASSWORD")}</Text>
                    </View>         
                    <FormInput name='password' value={values.password}  placeholder={t('account:NEW_PASSWORD')+'  ****'} secureTextEntry passwordToggle   onChangeText = {onChangeWithRulesExternal('password',noSpace)(values,setFieldValue)}  ref={passwordRef} returnKeyType='done' iconName='ios-lock' iconColor='#2C384A' bgColor={bgColor} addTestId = {passwordID}/>    

                    <View style={{marginTop:15}}>
                        <Text style={styles.text}>{t("account:CONFIRM_NEW_PASSWORD")}</Text>
                    </View>           
                    <FormInput name='confirm' value={values.confirm}  placeholder={t('account:NEW_PASSWORD')+'  ****'} secureTextEntry passwordToggle   onChangeText = {onChangeWithRulesExternal('confirm',noSpace)(values,setFieldValue)}  ref={confirmPasswordRef} returnKeyType='done' iconName='ios-lock' iconColor='#2C384A' bgColor={bgColor} addTestId = {newPasswordID}/>              
              </View>
              </WithTranslateFormErrors>
            </>
            );
          }}
        </Formik>  
      </View>
      </React.StrictMode>
  )


})

const styles = StyleSheet.create({
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

