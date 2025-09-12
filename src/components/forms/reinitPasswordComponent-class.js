import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { View, Text} from 'react-native';
import { Formik, withFormik, yupToFormErrors } from 'formik'
import * as yup from 'yup';
import {withTranslation} from 'react-i18next';
import Toast from 'react-native-root-toast';

import WithTranslateFormErrors from "../../utils/withTranslateFormErrors";
import FormInput from './formInput';
import AccessButton from '_components/forms/accessButton';

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


const reinitPasswordFormSchema = yup.object({
  
  password: yup.string().min(6).required("PASSWORD_INPUT_MANDATORY_FIELD"),
  confirm:yup.string().oneOf([yup.ref('password'), null], "SUBSCRIBRE_PASSWORDS_MUST_MATCH")
});

class ReinitPasswordComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        login:'',
        password:'',
        errServer:null
    }
   
  }

  
  async componentDidMount(){
    //uncomment below to force resetPassword
    //await Keychain.resetGenericPassword();
    //this.setState({login:this.props.login});
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
    console.log(prop,value);
    //this.setState({errServer:null});
  }

 async handleSubmit(values){   
   
    let validData = [];
    let isValid =  await reinitPasswordFormSchema.isValid(values);

    if(isValid) {
     
      this.props.submit(values);
      //return true
    } else {
      try {
        validData = await reinitPasswordFormSchema.validate(values,{abortEarly:false});   
      
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
  loginID = buildTestId("login");
  passwordID = buildTestId("password");
  confirmID = buildTestId("confirm")
  reinitCodeID = buildTestId("reinitCode")
  buttonPreviousID = buildTestId("buttonPrevious");
  buttonNextID = buildTestId("buttonNext");

  render() {
    
    const { login, password } = this.state;
    const { t } = this.props;

    return (
      <View style={{width:'100%'}}>       
       {this.props.connectingError != 200 && this.props.connectingError != undefined ?        
        <Text>Ben erreur</Text>
        :
        null    
      }
        <Formik
              initialValues={{ login: this.props.login, reinitCode:'', password: '', confirm:'' }}
              no_validationSchema={reinitPasswordFormSchema}
              onSubmit={this.handleSubmit.bind(this)}             
              >

              {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit,setFieldValue }) => {
              
              const noSpace = "noSpace"
              
              
              
              
              return ( <>
               <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
                <View style={{paddingLeft:15,paddingRight:15,backgroundColor:'transparent'}}>
                  <FormInput   name='login' value={values.login} disabled disabledInputStyle={{opacity:1}} placeholder={t('Enter email')}  autoCapitalize='none' onChangeText = {onChangeWithRulesExternal('login',noSpace)(values,setFieldValue)}   iconColor='#2C384A' onFocus={this.handleFocus.bind(this)} addTestId = {this.loginID}/>
                  <FormInput name='reinitCode' value={values.reinitCode} placeholder={t('ENTER_REINIT_CODE')} autoCapitalize='characters'    onChangeText={handleChange('reinitCode')} iconColor='#2C384A' onFocus={this.handleFocus.bind(this)} {...this.reinitCodeID}/>
                  <FormInput name='password' value={values.password} placeholder={t('Enter password')} autoCapitalize='none' secureTextEntry passwordToggle   onChangeText = {onChangeWithRulesExternal('password',noSpace)(values,setFieldValue)}  iconColor='#2C384A' onFocus={this.handleFocus.bind(this)} addTestId = {this.passwordID}/>
                  <FormInput name='confirm' value={values.confirm} placeholder={t('Confirm password')} autoCapitalize='none' secureTextEntry passwordToggle   onChangeText = {onChangeWithRulesExternal('confirm',noSpace)(values,setFieldValue)}  iconColor='#2C384A' onFocus={this.handleFocus.bind(this)} addTestId = {this.confirmID}/>
                  <Text style={{ color: 'red' }}>{this.state.errServer}</Text>               
                
                </View> 
                <View style={{alignItems:'flex-end',flexDirection:'row'}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25}}>
                    <View  style={{width:'48%'}}>
                      <AccessButton  onPress={this.goBack.bind(this)} specialColor='#333'title={t("BUTTON_BACK")} testAppium={this.buttonPreviousID}/>
                    </View>
                    <View  style={{width:'48%'}}>
                      <AccessButton  onPress={handleSubmit} specialColor='#333' title={t("BUTTON_NEXT")} testAppium={this.buttonNextID}/>
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


ReinitPasswordComponent.propTypes = {
    // You can declare that a prop is a specific JS primitive. By default, these
    // are all optional.
   /* label: PropTypes.string.isRequired,*/
    submit: PropTypes.func.isRequired,
   
  
}
export default withTranslation()(ReinitPasswordComponent);