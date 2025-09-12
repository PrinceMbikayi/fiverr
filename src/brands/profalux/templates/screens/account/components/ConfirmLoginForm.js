import React, { Component,useRef,useState,forwardRef,useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-root-toast';

import { Formik, withFormik, yupToFormErrors } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';


import { useTheme } from '_theming/themeProvider';

import FormInput from '_brand/templates/components/forms/FormInput';
import AccessButton from '_components/forms/accessButton';
import WithTranslateFormErrors from "_utils/withTranslateFormErrors";


import {onChangeWithRulesExternal} from '_components/forms//utils';

//--- Appium -----
import {buildTestId} from '_helpers/appium';

//---------------------------------------------------------------



const codeFormSchema = yup.object({
  code: yup.string().required("CODE_INPUT_MANDATORY_FIELD")
});

//----------------------------------------------------------------


export const ConfirmLoginForm = forwardRef((props,ref) => {

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
 
 const [code, setCode] = useState('');

 const {bgColor} = props;



const  handleSubmit = async(values) =>{
 
 let validData = [];
 let isValid =  await codeFormSchema.isValid(values);

 if(isValid) {
   console.log("isValid")
   props.submit(values);
   
   //return true
 } else {
   try {
     validData = await codeFormSchema.validate(values,{abortEarly:false});   
   
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


const changeFocus = (myRef) => {
 console.log("changeFocus",myRef);
}

//======== APPIUM =============
const loginID = buildTestId("code");









 return (
   <React.StrictMode>
    <View style={{backgroundColor:'transparent'}}>       
     {props.connectingError != 200 && props.connectingError != undefined ?        
      <Text>Error ...</Text>
      :
      null    
    }
      <Formik
            //initialValues={{ code: 'test@profalux.com', password: 'testAP23;' }}
            initialValues={{ code: code}}
            no_validationSchema={codeFormSchema}
            onSubmit={handleSubmit}
            innerRef={formikRef}    
            >

            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit ,setFieldValue}) => {

              const noSpace = "noSpace"
              


            return ( <>
             <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
              <View style={{backgroundColor:'transparent'}}>
                 <FormInput  name='code' value={values.code}  placeholder={t('Code')}  autoCapitalize={"characters"}  onChangeText = {onChangeWithRulesExternal('code',noSpace)(values,setFieldValue)} returnKeyType={'next'}   bgColor={bgColor} addTestId={loginID}/>                        
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

