/**
 * 
 * 
 *  base : https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
 *  validation : https://www.youtube.com/watch?v=ftLy78R8xrg&list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ&index=32
 * 
 * 
 */

 import React, { Component,useRef } from 'react';
 import PropTypes from 'prop-types';
 import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
 import Toast from 'react-native-root-toast';
 import {withTranslation } from 'react-i18next';
 import { Formik, withFormik, yupToFormErrors } from 'formik';
 import * as yup from 'yup';
 
 import FormInput from './formInput';
 import AccessButton from '_components/forms/accessButton';
 import WithTranslateFormErrors from "../../utils/withTranslateFormErrors";
 import { withTheme } from '_theming/themeProvider';
 
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
   password: yup.string().min(1).required("INPUT_MANDATORY_FIELD")
 });
 
 const forgottenPasswordFormSchema = yup.object({
   login: yup.string().email("LOGIN_INPUT_IS_EMAIL").required("EMAIL_INPUT_MANDATORY_FIELD")  
 });
 
 //----------------------------------------------------------------
 
 //const { t } = this.props;
 
 class LoginComponent extends Component {
   constructor(props) {
     super(props);
     this.state = {
         login:'',
         password:'',
         errServer:null
     }
    this.passwordRef = React.createRef();
    
   }
   
   async componentDidMount(){    
      //
   }
 
   componentDidUpdate(prevProps) {    
     if (prevProps.errCode !== this.props.errCode) {
       if(this.props.errCode == 200) {
         this.setState({errServer:null})
       } else {
         this.setState({errServer:this.props.errCode})
       }
     }    
   }
 
   handleChange(prop,value){
     console.log(prop,value);
     return value;
     //this.setState({errServer:null});
   }
 
  async handleSubmit(values){
     console.log('handle submit');
     let validData = [];
     let isValid =  await loginFormSchema.isValid(values);
 
     if(isValid) {
     
       this.props.submit(values);
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
           msg+= this.props.t(err.key,err.values)+"\n";
         } else {
           msg+= this.props.t(err)+"\n";
         }
        
       });
       
       Toast.show(msg);
     }
      
 
   }
   // in order to remove errServer State
   handleFocus(e){
     console.log("handle FOCUS",this);
     this.setState({errServer:null})
   }
 
   goBack(){    
     this.props.goBack();
   }
 
   async getForgottenPassword(values) {
     //console.log("getForgottenPassword =>",values);
 
     let validData = [];
     let isValid =  await forgottenPasswordFormSchema.isValid(values);
 
     if(isValid) {
       //console.log("yeah forgot");
       this.props.lostPasswordRequest(values);
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
         console.log(this.props.t(err));
         msg+= this.props.t(err)+"\n";
       });
       
       Toast.show(msg,{position: Toast.positions.TOP});
     }
 
   }
 
   changeFocus(myRef) {
     console.log("changeFocus",myRef);
     if( myRef.current?.input) {
       myRef.current.input.focus()
     }    
   }

    //======== APPIUM =============
    loginID = buildTestId("login");
    passwordID = buildTestId("password")
    forgottenPasswordID = buildTestId("forgottenPassword")
    buttonPreviousID = buildTestId("buttonPrevious");
    buttonNextID = buildTestId("buttonNext");




   //========================================
   render() {
     
     const { login, password } = this.state;
     const { t,theme } = this.props;
     const inputColor = theme["on--white--color"];
 
     return (
      <React.StrictMode>
       <View style={{backgroundColor:'transparent'}}>       
        {this.props.connectingError != 200 && this.props.connectingError != undefined ?        
         <Text>Error ...</Text>
         :
         null    
       }
         <Formik
               initialValues={{ login: login, password: '' }}
               no_validationSchema={loginFormSchema}
               onSubmit={this.handleSubmit.bind(this)}
               >
 
               {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit ,setFieldValue}) => {
 
                 const noSpace = "noSpace"
                 
 
 
               return ( <>
                <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
                 <View style={{backgroundColor:'transparent',padding:15}}>
                   <FormInput  name='login' value={values.login} color={inputColor} placeholder={t('Enter email')}  autoCapitalize='none' keyboardType='email-address' onChangeText = {onChangeWithRulesExternal('login',noSpace)(values,setFieldValue)} returnKeyType={'next'} onSubmitEditing={() => this.changeFocus(this.passwordRef)}   bgColor={bgColor} addTestId={this.loginID}/>               
                   <FormInput name='password' value={values.password} color={inputColor} placeholder={t('Enter password')} secureTextEntry passwordToggle   onChangeText = {onChangeWithRulesExternal('password',noSpace)(values,setFieldValue)}  ref={this.passwordRef} returnKeyType='done' iconName='ios-lock' iconColor='#2C384A' bgColor={bgColor} addTestId = {this.passwordID}/>              
                   <TouchableOpacity onPress={this.getForgottenPassword.bind(this,values)} {...this.forgottenPasswordID}>
                     <Text style={{textAlign:'right',color:'#999',paddingTop:10,marginRight:10}}>{t("FORGOTTEN_PASSWORD")}</Text>
                   </TouchableOpacity>
                 </View>
                 {1 == 2 &&
                 <View style={{flex:2,alignItems:'flex-end',flexDirection:'row',backgroundColor:'transparent'}}>
                   <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25}}>
                     <View  style={{width:'48%'}}>
                       <AccessButton  onPress={this.goBack.bind(this)} specialColor='#333' title={t("BUTTON_BACK")} testAppium={this.buttonPreviousID}/>
                     </View>
                     <View  style={{width:'48%'}}>
                       <AccessButton  onPress={handleSubmit} specialColor='#333' title={t("BUTTON_NEXT")} testAppium={this.buttonNextID}/>
                     </View>
                   </View> 
                 </View> 
               }          
                 </WithTranslateFormErrors>
               </>
               );
             }}
           </Formik>  
         </View>
         </React.StrictMode>
     )
   }
 }
 
 //LoginComponent.displayName = 'LoginComponent';
 
 LoginComponent.propTypes = {
     // You can declare that a prop is a specific JS primitive. By default, these
     // are all optional.
     //label: PropTypes.string.isRequired,
     submit: PropTypes.func.isRequired,
    
   
 }
 export default withTranslation()(withTheme(LoginComponent));