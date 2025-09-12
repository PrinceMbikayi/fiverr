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
 import { View, Text, StyleSheet} from 'react-native';
 import { Formik} from 'formik'
 import * as yup from 'yup';
 import {withTranslation} from 'react-i18next';
 import Toast from 'react-native-root-toast';

 
 import WithTranslateFormErrors from "../../utils/withTranslateFormErrors";
 import FormInput from './formInput';

 import AccessButton from '_components/forms/accessButton';
 import { withTheme } from '_theming/themeProvider';
 
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
 
 
 const updatePasswordFormSchema = yup.object({
   
   password: yup.string().min(6).max(50).required("PASSWORD_INPUT_MANDATORY_FIELD"),
   confirm:yup.string().oneOf([yup.ref('password'), null], "SUBSCRIBRE_PASSWORDS_MUST_MATCH")
 });
 
 
 
 //const { t } = this.props;
 
 class UpdatePasswordComponent extends Component {
   constructor(props) {
     super(props);
     this.state = {
         login:'',
         password:'',
         errServer:null
     }
    
   }
 
   
   async componentDidMount(){
     
       //await Keychain.resetGenericPassword();
 
     //this.setState({login:this.props.login});
     console.log('currentLanguage',this.props.i18n.language)
 
     }
   
   componentDidUpdate(prevProps) {
     //console.log(prevProps,this.props)
     
     
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
     //this.setState({errServer:null});
   }
 
  async handleSubmit(values){   
    
     let validData = [];
     let isValid =  await updatePasswordFormSchema.isValid(values);
 
     if(isValid) {
       console.log("update allowed");
       this.props.submit(values); // envoi ici
       //return true
     } else {
       try {
         validData = await updatePasswordFormSchema.validate(values,{abortEarly:false});   
       
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
 
 
     
 
 
 
     //this.props.submit(values);
     
 
   }
 
   // in order to remove errServer State
   handleFocus(e){
     console.log("handle FOCUS",this);
     this.setState({errServer:null})
   }
 
   goBack(){
     
     this.props.goBack();
   }
 
    //======== APPIUM =============
   
    passwordID = buildTestId("password");
    confirmID = buildTestId("confirm");
    buttonPreviousID = buildTestId("buttonPrevious");
    buttonValidateID = buildTestId("buttonValidate");
 
   render() {
     
     const { login, password } = this.state
 
     const { t,theme } = this.props;
 
     return (
       <View style={{width:'100%'}}>
        
        {this.props.connectingError != 200 && this.props.connectingError != undefined ?
         
         <Text>Erreur</Text>
 
         :
 
         null
     
       }
         <Formik
               initialValues={{  password: '', confirm:'' }}
               no_validationSchema={updatePasswordFormSchema}
               onSubmit={this.handleSubmit.bind(this)}             
               >
 
               {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit , setFieldValue}) => {
 
               const noSpace = "noSpace"; 
 
               const textColor = 'white' || theme['force-white'];
 
               return ( <>
                <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
                 <View style={{paddingLeft:15,paddingRight:15}}>
                   <FormInput name='password' value={values.password} placeholder={t('Enter password')} autoCapitalize='none' secureTextEntry passwordToggle    onChangeText = {onChangeWithRulesExternal('password',noSpace)(values,setFieldValue)} iconColor={textColor} color={textColor} onFocus={this.handleFocus.bind(this)} addTestId = {this.passwordID}/>
                   <FormInput name='confirm' value={values.confirm} placeholder={t('Confirm password')} autoCapitalize='none' secureTextEntry passwordToggle    onChangeText = {onChangeWithRulesExternal('confirm',noSpace)(values,setFieldValue)} iconColor={textColor} color={textColor} onFocus={this.handleFocus.bind(this)} addTestId = {this.conffirmID}/>
                   <Text style={{ color: 'red' }}>{this.state.errServer}</Text>              
                 
                 </View> 
                 <View style={{alignItems:'flex-end',flexDirection:'row'}}>
                   <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25}}>
                     <View  style={{width:'48%'}}>
                       <AccessButton  onPress={this.goBack.bind(this)} specialColor='white'title={t("CANCEL")} testAppium={this.buttonPreviousID}/>
                     </View>
                     <View  style={{width:'48%'}}>
                       <AccessButton  onPress={handleSubmit}  title={t("VALIDATE")} testAppium={this.buttonValidateID}/>
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
 
 UpdatePasswordComponent.propTypes = {
     // You can declare that a prop is a specific JS primitive. By default, these
     // are all optional.
    /* label: PropTypes.string.isRequired,*/
     submit: PropTypes.func.isRequired,
    
   
 }
 export default withTranslation()(withTheme(UpdatePasswordComponent));