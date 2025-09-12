
import '_brand/templates/screens/_locales'
/**
 * 
 * 
 *  base : https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
 *  validation : https://www.youtube.com/watch?v=ftLy78R8xrg&list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ&index=32
 * 
 * 
 */

 import React, {useState,useEffect,useRef,forwardRef,useImperativeHandle } from 'react';

 import { View, Text, TextInput, Switch, Linking} from 'react-native';
 import { useTranslation } from 'react-i18next';
 import { Trans } from 'react-i18next'
 import { useTheme } from '_theming/themeProvider';
 import Toast from 'react-native-root-toast';
 import { Formik } from 'formik'
 import * as yup from 'yup'
 import AsyncStorage from '@react-native-community/async-storage';
 import Button from '_brand/templates/components/ui/Button';

 
 import FormInput from '_brand/templates/components/forms/FormInput';
 import WithTranslateFormErrors from "_utils/withTranslateFormErrors";
 import {onChangeWithRulesExternal} from '_components/forms/utils';
 
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
   firstname: yup.string(),//.matches(/^[^\s]+(\s+[^\s]+)*$/, "NO_SPACE_AT_BEGINING_AND_END"),
   login: yup.string().matches(/^\S*$/, 'EMAIL_NO_WHITESPACE').email("LOGIN_INPUT_IS_EMAIL").required("EMAIL_INPUT_MANDATORY_FIELD"),
   //login: yup.string().matches(/^\S*$/, 'EMAIL_NO_WHITESPACE').email("LOGIN_INPUT_IS_EMAIL").required("EMAIL_INPUT_MANDATORY_FIELD"),
   password: yup.string().min(6).max(50).required("PASSWORD_INPUT_MANDATORY_FIELD"),
   confirm:yup.string().oneOf([yup.ref('password'), null], "SUBSCRIBRE_PASSWORDS_MUST_MATCH")
 });
 
 



const SubscribeComponent = forwardRef((props,ref) => {


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



  const borderColor = theme?.prflxBorderColor||'orange';
  const Containerbgcolor = theme?.prflxContaintBgColor||'white';
  const bgcolor = theme?.prflxbgColor||'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
  const textColor = theme?.prflxTextColor||'black'
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
  
  const [login, setLogin] = useState('');
  const [firstname, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [errServer, setErrServer] = useState(null);


  const cguAccepted = useRef(null)
  const pcdAccepted = useRef(null)
  const [cguEnabled, setCguEnabled] = useState(false);
  const [pcdEnabled, setPcdEnabled] = useState(false);


  const {bgColor, submitMe} = props;
  

  useEffect(() => {
    const noErr = (props.errCode == 200 || props.errCode == null || props.errCode == undefined)
    setErrServer(noErr?null : props.errCode)
  }, [props.errCode]);

  

  const handleSubmit = async(values) => {

    let validData = [];
     let isValid =  await subscribeFormSchema.isValid(values);
     console.log("VALUES TO SUBMIT :", values)
 
     if(isValid) {
      const newValues = {...values, firstname:(values.firstname).trim()}
      await AsyncStorage.setItem("@userFav", JSON.stringify([]))
      props.submit(newValues);


     } else {
      // const newValues = {...values, firstname:(values.firstname).trim()}
      // console.log("VALUES TO SUBMIT :", newValues)
       try {
         validData = await subscribeFormSchema.validate(values,{abortEarly:false});
       } catch (error) {
         validData = error.errors      
       }   
       //console.log(validData);
       const msg = validData.reduce((r,err,i) => {
          r += ((typeof err == "object") ? t(err.key,err.values) : t(err))+"\n";
          return r
       },"\n" );      
       
       Toast.show(msg);
     }
    }

    const checkFormInputs = () => {

    }
    const handleFocus = () => {
      console.log("handleFocus")
    }

    const goBack = () => {
      console.log("goBack !!!!")
    }
    //======== APPIUM =============
    const emailID = buildTestId("email");
    const passwordID = buildTestId("password");
    const confirmID = buildTestId("confirm");
    const buttonPreviousID = buildTestId("buttonPrevious");
    const buttonNextID = buildTestId("buttonNext");

    const onGlop = () => {
      console.log(testo.current);
      formikRef.current.submitForm();
    }



    useEffect(() => {      
    }, [cguEnabled]);
    useEffect(() => {      
    }, [pcdEnabled]);

    const handleGeneralConditions = (value) => {
      setCguEnabled(value => !value);
      console.log("Switch value :", value);
      if(value == true){
        console.log("Switch on ")
      }else{
        console.log("Switch off ")
      }
  };
    const handleConfidData = (value) => {
      setPcdEnabled(value => !value);
      console.log("Switch value :", value);
      if(value == true){
        console.log("Switch on ")
      }else{
        console.log("Switch off ")
      }
  };

  const handlePress = ()=>{
    console.log('CGU, PCD :', cguEnabled, pcdEnabled);
    if(cguEnabled && pcdEnabled){
      submitMe()
    }else{
      Toast.show( t("account:VALIDATE_CGU_PCD_CONDITIONS"));
    }
  }


  const termsUrl = t('account:URL_TERMS');
  const privacyUrl = t('account:URL_PRIVACY')
    return (
      
      
      <View style={{width:'100%', backgroundColor:'transparent'}}>
        
        {props.connectingError != 200 && props.connectingError != undefined ?        
          <Text>Ben erreur</Text>
          :
          null
        }
        <Formik
               //initialValues={{ firstname:'Harold', login:"hmoundoyi@avidsen.com" , password: '123456', confirm:'123456' }}
               initialValues={{ firstname:firstname, login: login, password: '', confirm:'' }}
               novalidationSchema={subscribeFormSchema}
               validate={checkFormInputs}
               onSubmit={handleSubmit}   
               innerRef={formikRef}          
               > 
               {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit,setFieldValue }) => {  
                 const noSpace = "noSpace";                 
                 // Wait for  0.64 but not working as expected so forget
                 const onKeyTest = ({ nativeEvent: { key: keyValue } }) => {
                   const fieldName = "password"
                   console.log("nativeEvent",keyValue,fieldName);
                   if(keyValue != ' ')setFieldValue(fieldName,values[fieldName]+keyValue); 
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
 
               return ( <>
                <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
                
                 <View style={{paddingTop:15}}>
                  <View>                   
                     <FormInput name='firstname' value={values.firstname} placeholder={t('Nom & prénom')}  autoCapitalize='none' returnKeyType={'next'}   onChangeText = {(val)=> {setFieldValue('firstname', val); setFieldTouched('firstname', true, false)}}   iconColor='#2C384A'  addTestId = {emailID} bgColor={bgColor} />               
                     <FormInput name='login' value={values.login} placeholder={t('Email')}  autoCapitalize='none' returnKeyType={'next'}   onChangeText = {onChangeWithRulesExternal('login',noSpace)(values,setFieldValue)}   iconColor='#2C384A'  addTestId = {emailID} bgColor={bgColor} />               
                     <FormInput name='password' value={values.password} placeholder={t('Enter password')} autoCapitalize='none' returnKeyType={'next'} secureTextEntry passwordToggle  no_onKeyPress = {onKeyTest}  onChangeText={onChangeWithRulesExternal('password',noSpace)(values,setFieldValue)}  iconColor='#2C384A'   bgColor={bgColor} addTestId = {passwordID}/>               
                     <TextInput style={{  height: 1,padding:0 }} rem="here only because of ios 12 qwerty bug when 2 consecutive secureTextEntry " />
                     <FormInput name='confirm' value={values.confirm} placeholder={t('Confirm password')} autoCapitalize='none' returnKeyType={'next'} secureTextEntry passwordToggle   onChangeText={onChangeWithRulesExternal('confirm',noSpace)(values,setFieldValue)} iconColor='#2C384A'   bgColor={bgColor} addTestId = {confirmID}/>

                     <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'transparent', marginTop:15}}>
                        <View>
                            <Switch
                              trackColor={{false: '#dddddd', true: 'green'}}
                              thumbColor={cguEnabled ? 'white' : 'white'}
                              ios_backgroundColor={'#dddddd'}
                              onValueChange={handleGeneralConditions}
                              value={cguEnabled}
                            />
                        </View>
                        <View style={{width:"80%", justifyContent:'center', alignItems:'flex-start', backgroundColor:'transparent'}}>
                            <Text style={{fontSize:16, fontWeight:'400',marginRight:0, textAlign:'auto'}}>
                                <Trans i18nKey="account:READ_ACCEPT_GENERAL_CONDITION">
                                    By subscribing I understand and agree to the <Text onPress={() => Linking.openURL(termsUrl)}>Terms</Text> and our <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={() => Linking.openURL(termsUrl)}>Privacy Policy</Text>
                                </Trans>
                            </Text>
                          </View>
                      </View>

                     <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'transparent', marginTop:15}}>
                        <View>
                            <Switch
                              trackColor={{false: '#dddddd', true: 'green'}}
                              thumbColor={pcdEnabled ? 'white' : 'white'}
                              ios_backgroundColor={'#dddddd'}
                              onValueChange={handleConfidData}
                              value={pcdEnabled}
                            />
                        </View>
                          <View style={{width:"80%", justifyContent:'center', alignItems:'flex-start', backgroundColor:'transparent'}}>
                            <Text style={{fontSize:16, fontWeight:'400',marginRight:0, textAlign:'auto'}}>
                                <Trans i18nKey="account:READ_ACCEPT_CONFIDENTIALITY_DATA">
                                    By subscribing I understand and agree to the <Text onPress={() => Linking.openURL(termsUrl)}>Terms</Text> and our <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={() => Linking.openURL(privacyUrl)}>Privacy Policy</Text>
                                </Trans>
                            </Text>
                          </View>


                      </View>
                   </View>

                    <Text style={{ color: 'red' }}>{errServer}</Text>    

                    <View style={{marginTop:40,marginBottom:20,}}>
                        <Button title={t("account:CREATE_ACCOUNT_SUBMIT")} onPress={handlePress} titleColor="white"   bgColor={(cguEnabled && pcdEnabled)? textColor : 'gray'} />
                    </View>              
                 {/*<SubscribeAknowledge/> */}
                 </View> 
                 </WithTranslateFormErrors>
               </>
               );
             }}
           </Formik>
      </View>
     )
  })


 export default SubscribeComponent;