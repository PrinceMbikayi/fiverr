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
 import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
 import Toast from 'react-native-root-toast';

 import { Formik, withFormik, yupToFormErrors } from 'formik';
 import * as yup from 'yup';
 import { useTranslation } from 'react-i18next';


 import { useTheme } from '_theming/themeProvider';
 
 import FormInput from './formInput';
 import AccessButton from '_components/forms/accessButton';
 import WithTranslateFormErrors from "../../utils/withTranslateFormErrors";

 
 import {onChangeWithRulesExternal} from './utils';

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
 const loginFormSchema = yup.object({
   login: yup.string().matches(/^\S*$/, 'EMAIL_NO_WHITESPACE').email("LOGIN_INPUT_IS_EMAIL").required("EMAIL_INPUT_MANDATORY_FIELD"),
  
 });
 
 
 
 //----------------------------------------------------------------
 

 const LostPasswordComponent = forwardRef((props,ref) => {

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
  
  const {login} = props;
  const [password, setPassword] = useState('');
  const [errServer, setErrServer] = useState(null);

  const {bgColor} = props;

 const passwordRef = useRef(null);
 
 
 const handleChange = (prop,value) => {
  console.log(prop,value);
  return value;
  //this.setState({errServer:null});
  }

const  handleSubmit = async(values) =>{
  
  let validData = [];
  let isValid =  await loginFormSchema.isValid(values);

  if(isValid) {
    console.log("isValid")
    props.submit(values);
    
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

const goBack = () => {    
  props.goBack();
}

const getForgottenPassword = async(values)=> {
  //console.log("getForgottenPassword =>",values);

  let validData = [];
  let isValid =  true //await forgottenPasswordFormSchema.isValid(values);

  if(isValid) {
    //console.log("yeah forgot");
    props.lostPasswordRequest(values);
    //return true
  } else {
    try {
      validData = await forgottenPasswordFormSchema.validate(values,{abortEarly:false});   
    
    } catch (error) {
      validData = error.errors      
    }   
    console.log(validData);
    let msg ="\n";
    validData.forEach(err => { 
      console.log(t(err));
      msg+= t(err)+"\n";
    });
    
    Toast.show(msg,{position: Toast.positions.TOP});
  }

}

const changeFocus = (myRef) => {
  console.log("changeFocus",myRef);
  if( myRef.current?.input) {
    myRef.current.input.focus()
  }    
}

 //======== APPIUM =============
 const loginID = buildTestId("login");
 const passwordID = buildTestId("password")
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
             initialValues={{ login: login, password: '' }}
             no_validationSchema={loginFormSchema}
             onSubmit={handleSubmit}
             innerRef={formikRef}    
             >

             {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit ,setFieldValue}) => {

               const noSpace = "noSpace"
               


             return (
               <>
                  <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
                  <View style={{backgroundColor:'transparent'}}>
                    <FormInput  name='login' value={values.login}  placeholder={t('Enter email')}  autoCapitalize='none' keyboardType='email-address' onChangeText = {onChangeWithRulesExternal('login',noSpace)(values,setFieldValue)} returnKeyType={'next'} onSubmitEditing={() => changeFocus(passwordRef)}   bgColor={bgColor} addTestId={loginID}/>             
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

 export default LostPasswordComponent;

