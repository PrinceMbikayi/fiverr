/**
 * 
 * 
 *  base : https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
 *  validation : https://www.youtube.com/watch?v=ftLy78R8xrg&list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ&index=32
 * 
 * 
 */

 import React, { Component } from 'react';

 import PropTypes from 'prop-types';
 import { View, Text, StyleSheet, TextInput} from 'react-native';
 import {withTranslation } from 'react-i18next';
 import Toast from 'react-native-root-toast';
 import { Formik } from 'formik'
 import * as yup from 'yup'
 
 import WithTranslateFormErrors from "../../utils/withTranslateFormErrors";
 import FormInput from './formInput';
 import AccessButton from './accessButton';
 import SubscribeAknowledge from './subscribeAknowledge';
 
 import {onChangeWithRulesExternal} from './utils';
 
 //--- Appium -----
 import {buildTestId} from '_helpers/appium';
 
 yup.setLocale({
   
   // use functions to generate an error object that includes the value from the schema
   string: {
     min: ({ min }) => ({ key: 'PASSWORD_TOO_SHORT', values: { min } }),
     max: ({ max }) => ({ key: 'field_too_big', values: { max } }),
   },
 });
 
 const subscribeFormSchema = yup.object({
   login: yup.string().matches(/^\S*$/, 'EMAIL_NO_WHITESPACE').email("LOGIN_INPUT_IS_EMAIL").required("EMAIL_INPUT_MANDATORY_FIELD"),
   password: yup.string().min(6).max(50).required("PASSWORD_INPUT_MANDATORY_FIELD"),
   confirm:yup.string().oneOf([yup.ref('password'), null], "SUBSCRIBRE_PASSWORDS_MUST_MATCH")
 });
 
 
 
 //const { t } = this.props;
 
 class SubscribeComponent extends Component {
   constructor(props) {
     super(props);
     this.state = {
         login:'',
         password:'',
         errServer:null
     }
    
   }
 
   
   async componentDidMount(){
     
     //console.log('currentLanguage',this.props.i18n.language)
 
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
     console.log("-->",prop,value);
     //setFieldValue("password", "aaaa");
     
   }
 
  async handleSubmit(values){   
    
     let validData = [];
     let isValid =  await subscribeFormSchema.isValid(values);
 
     if(isValid) {
     
       this.props.submit(values);
       //return true
     } else {
       try {
         validData = await subscribeFormSchema.validate(values,{abortEarly:false});   
       
       } catch (error) {
         validData = error.errors      
       }   
       console.log(validData)
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
 
   checkFormInputs = (values) => {
    // trim them all
 
   }
 
   //======== APPIUM =============
    emailID = buildTestId("email");
    passwordID = buildTestId("password");
    confirmID = buildTestId("confirm");
    buttonPreviousID = buildTestId("buttonPrevious");
    buttonNextID = buildTestId("buttonNext");


   render() {
     
     const { login, password } = this.state;
     const { t } = this.props;
 
      

     return (
       <View style={{flex:1,backgroundColor:'transparent',width:'100%'}}>
        
        {this.props.connectingError != 200 && this.props.connectingError != undefined ?
         
         <Text>Ben erreur</Text>
 
         :
 
         null
     
       }
         <Formik
               initialValues={{ login: login, password: '', confirm:'' }}
               novalidationSchema={subscribeFormSchema}
               validate={this.checkFormInputs}
               onSubmit={this.handleSubmit.bind(this)}
              
               >
 
               {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit,setFieldValue }) => {
                 
                 
                
 
                 const noSpace = "noSpace"; 
                
                 // Wait for  0.64 but not working as expected so forget
                 const onKeyTest = ({ nativeEvent: { key: keyValue } }) => {
                   const fieldName = "password"
                   console.log("nativeEvent",keyValue,fieldName);
                   if(keyValue != ' ')setFieldValue(fieldName,values[fieldName]+keyValue)
 
                 }
                 
                 //------------------------
                 const validate = (e) => {
                  // console.log("validate!!!!");
                     Object.keys(values).map((keyName,i) => {
                       console.log("keyName -->",keyName)
                       values[keyName] = (values[keyName]).trim();
                     })
                   handleSubmit(e);
                 }
 
                 const testo = (e) => {
                   console.log(e);
                   return false
                   //e.preventDefaut();
                 }
 
               return ( <>
                <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
                
                 <View style={{flex:2,paddingLeft:15,paddingRight:15}}>
                     <FormInput name='login' value={values.login} placeholder={t('Enter email')}  autoCapitalize='none' returnKeyType={'next'}   onChangeText = {onChangeWithRulesExternal('login',noSpace)(values,setFieldValue)}   iconColor='#2C384A' onFocus={this.handleFocus.bind(this)} addTestId = {this.emailID} />               
                     <FormInput name='password' value={values.password} placeholder={t('Enter password')} autoCapitalize='none' returnKeyType={'next'} secureTextEntry passwordToggle  no_onKeyPress = {onKeyTest}  onChangeText={onChangeWithRulesExternal('password',noSpace)(values,setFieldValue)}  iconColor='#2C384A' onFocus={this.handleFocus.bind(this)} addTestId = {this.passwordID}/>               
                     <TextInput style={{  height: 1 }} rem="here only because of ios 12 qwerty bug when 2 consecutive secureTextEntry " />
                     <FormInput name='confirm' value={values.confirm} placeholder={t('Confirm password')} autoCapitalize='none' returnKeyType={'next'} secureTextEntry passwordToggle   onChangeText={onChangeWithRulesExternal('confirm',noSpace)(values,setFieldValue)} iconColor='#2C384A' onFocus={this.handleFocus.bind(this)} addTestId = {this.confirmID}/>
                    
                 <Text style={{ color: 'red' }}>{this.state.errServer}</Text>               
                 <SubscribeAknowledge/> 
                 </View> 
                 <View style={{flex:1,alignItems:'flex-end',flexDirection:'row'}}>
                   <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25}}>
                     <View  style={{width:'48%'}}>
                       <AccessButton  onPress={this.goBack.bind(this)} specialColor='#333' title={t("BUTTON_BACK")} testAppium={this.buttonPreviousID}/>
                     </View>
                     <View  style={{width:'48%'}}>
                       <AccessButton  onPress={validate} specialColor='#333' title={t("BUTTON_NEXT")} testAppium={this.buttonNextID}/>
                     </View>
                   </View> 
                 </View>  
                
                 </WithTranslateFormErrors>
               </>
               );
             }}
           </Formik>      
           
         </View>
     )
   }
 }
 
 
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff'
   },
   buttonContainer: {
     margin: 25
   }
 })
 
 SubscribeComponent.propTypes = {
     // You can declare that a prop is a specific JS primitive. By default, these
     // are all optional.
    /* label: PropTypes.string.isRequired,*/
     submit: PropTypes.func.isRequired,
    
   
 }
 export default withTranslation()(SubscribeComponent);