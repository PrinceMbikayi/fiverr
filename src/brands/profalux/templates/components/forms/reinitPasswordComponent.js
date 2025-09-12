import React from 'react';
import {forwardRef,useRef,useState,useImperativeHandle} from 'react'

import { View, Text} from 'react-native';
import { Formik} from 'formik'
import * as yup from 'yup';

import Toast from 'react-native-root-toast';
import { useTranslation } from 'react-i18next';


import { useTheme } from '_theming/themeProvider';

import FormInput from '_brand/templates/components/forms/FormInput';
import WithTranslateFormErrors from "_utils/withTranslateFormErrors";
import {onChangeWithRulesExternal} from '_components/forms//utils';
//--- Appium -----
import {buildTestId} from '_helpers/appium';

yup.setLocale({
  
  // use functions to generate an error object that includes the value from the schema
  string: {
    min: ({ min }) => ({ key: 'PASSWORD_TOO_SHORT', values: { min } }),
    max: ({ max }) => ({ key: 'field_too_big', values: { max } }),
  },
});


const reinitPasswordFormSchema = yup.object({
  
  password: yup.string().min(6).required("PASSWORD_INPUT_MANDATORY_FIELD"),
  confirm:yup.string().oneOf([yup.ref('password'), null], "SUBSCRIBRE_PASSWORDS_MUST_MATCH")
});




const ReinitPasswordComponent = forwardRef((props,ref) => {

  const formikRef = useRef(null)
  const { t, i18n } = useTranslation();    
  const {theme} = useTheme();

  const {login,bgColor} = props;

  //const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errServer, setErrServer] = useState(null);

  useImperativeHandle(ref, () => ({
           
     
    submitForm() {   
      formikRef.current.submitForm();        
        //setModalVisible(!modalVisible);
    }
}));


  const handleSubmit = async(values) => {   
   
    let validData = [];
    let isValid =  await reinitPasswordFormSchema.isValid(values);

    if(isValid) {
     
      props.submit(values);
      //return true
    } else {
      try {
        validData = await reinitPasswordFormSchema.validate(values,{abortEarly:false});   
      
      } catch (error) {
        validData = error.errors      
      }   
    
      let msg ="\n";
      validData.forEach(err => { 
        if(typeof err == "object") {
          msg+= t(err.key,err.values)+"\n";
        } else {
          msg+= t(err)+"\n";
        }
       
      });
      
      Toast.show(msg);
    }
    //props.submit(values); 
  }


  // in order to remove errServer State
  const handleFocus =(e) => {
    setErrServer(null)
  }

  const goBack= () => {
    
    props.goBack();
  }

  //======== APPIUM =============
  const loginID = buildTestId("login");
  const  passwordID = buildTestId("password");
  const confirmID = buildTestId("confirm")
  const reinitCodeID = buildTestId("reinitCode")
  const buttonPreviousID = buildTestId("buttonPrevious");
  const buttonNextID = buildTestId("buttonNext");


  return ( 
    <>
       <Formik
              initialValues={{ login: props.login, reinitCode:'', password: '', confirm:'' }}
              no_validationSchema={reinitPasswordFormSchema}
              onSubmit={handleSubmit}  
              innerRef={formikRef}               
              >

              {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit,setFieldValue }) => {  

                  const noSpace = "noSpace";   
                  return ( <>
                  <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
                    <View style={{backgroundColor:'transparent'}}>
                      {/*<FormInput   name='login' value={values.login} disabled disabledInputStyle={{opacity:1}} placeholder={t('Enter email')}  autoCapitalize='none' onChangeText = {onChangeWithRulesExternal('login',noSpace)(values,setFieldValue)}   iconColor='#2C384A' onFocus={handleFocus} bgColor={bgColor} addTestId = {loginID}/> */}
                      <FormInput name='reinitCode' value={values.reinitCode} placeholder={t('ENTER_REINIT_CODE')} autoCapitalize = {"characters"}    onChangeText={handleChange('reinitCode')} iconColor='#2C384A' onFocus={handleFocus} bgColor={bgColor} {...reinitCodeID}/>
                      <FormInput name='password' value={values.password} placeholder={t('Enter password')} autoCapitalize='none' secureTextEntry passwordToggle   onChangeText = {onChangeWithRulesExternal('password',noSpace)(values,setFieldValue)}  iconColor='#2C384A' onFocus={handleFocus} bgColor={bgColor} addTestId = {passwordID}/>
                      <FormInput name='confirm' value={values.confirm} placeholder={t('Confirm password')} autoCapitalize='none' secureTextEntry passwordToggle   onChangeText = {onChangeWithRulesExternal('confirm',noSpace)(values,setFieldValue)}  iconColor='#2C384A' onFocus={handleFocus} bgColor={bgColor} addTestId = {confirmID}/>
                      <Text style={{ color: 'red' }}>{errServer}</Text>               
                    
                    </View> 
                  
                    </WithTranslateFormErrors>
                  </>
                  );
            }}
          </Formik>      
    </>
   );
})

export default ReinitPasswordComponent;

