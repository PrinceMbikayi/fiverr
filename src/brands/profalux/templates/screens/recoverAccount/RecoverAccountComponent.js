import '_brand/templates/screens/_locales'
 import React, {useState,useEffect,useRef,forwardRef,useImperativeHandle } from 'react';

 import { View, Text, TextInput, Switch} from 'react-native';
 import { useTranslation } from 'react-i18next';
 import { useTheme } from '_theming/themeProvider';
 import Toast from 'react-native-root-toast';
 import { Formik } from 'formik'
 import * as yup from 'yup'
 import AsyncStorage from '@react-native-community/async-storage';

 
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
 

const RecoverAccountComponent = forwardRef((props,ref) => {


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
  
  const [login, setLogin] = useState('');
  const [box, setBox] = useState('');
  const [password, setPassword] = useState('');
  const [errServer, setErrServer] = useState(null);

  const {bgColor} = props;

  //hmoundoyi@avidsen.com
  const subscribeFormSchema = yup.object({
    box: yup.string()
         .required(`${t("account:BOX_INPUT_MANDATORY_FIELD")}`)
         .matches(/^[^\s]+(\s+[^\s]+)*$/, `${t("account:NO_SPACE_AT_BEGINING_AND_END")}`),
         //.length(24, `${t("account:FIELD_MUST_HAVE_24_CHARACTERS")}`),
    login: yup.string().matches(/^\S*$/, 'EMAIL_NO_WHITESPACE').email("LOGIN_INPUT_IS_EMAIL").required("EMAIL_INPUT_MANDATORY_FIELD"),
    password: yup.string().min(6).max(50).required("PASSWORD_INPUT_MANDATORY_FIELD"),
    confirm:yup.string().oneOf([yup.ref('password'), null], "SUBSCRIBRE_PASSWORDS_MUST_MATCH")
  });
  
  

  useEffect(() => {
    const noErr = (props.errCode == 200 || props.errCode == null || props.errCode == undefined)
    setErrServer(noErr?null : props.errCode)
  }, [props.errCode]);

  

  const handleSubmit = async(values) => {

    let validData = [];
     let isValid =  await subscribeFormSchema.isValid(values);
     console.log("VALUES TO SUBMIT :", values)
 
     if(isValid) {
      const boxKey =  (values.box).replace(/[^a-zA-Z0-9 ]/g, '') // remove all special characters
      const newValues = {...values, box: boxKey.trim()}
      await AsyncStorage.setItem("@userFav", JSON.stringify([]))
      props.submit(newValues);


     } else {
      // const newValues = {...values, box:(values.box).trim()}
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
    const boxID = buildTestId("email");
    const emailID = buildTestId("email");
    const passwordID = buildTestId("password");
    const confirmID = buildTestId("confirm");
    const buttonPreviousID = buildTestId("buttonPrevious");
    const buttonNextID = buildTestId("buttonNext");

    const onGlop = () => {
      console.log(testo.current);
      formikRef.current.submitForm();
    }

    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {      
    }, [isEnabled]);

    const handleGeneralConditions = (value) => {
      setIsEnabled(value => !value);
      console.log("Switch value :", value);
      if(value == true){
        console.log("Switch on ")
      }else{
        console.log("Switch off ")
      }
  };
    const onToggleSwitch = (value) => {
      setIsEnabled(value => !value);
      console.log("Switch value :", value);
      if(value == true){
        console.log("Switch on ")
      }else{
        console.log("Switch off ")
      }
  };

    return (
      
      
      <View style={{width:'100%'}}>
        
        {props.connectingError != 200 && props.connectingError != undefined ?        
          <Text>Ben erreur</Text>
          :
          null
        }
        <Formik
               //initialValues={{ box:'Harold', login:"hmoundoyi@avidsen.com" , password: '123456', confirm:'123456' }}
               initialValues={{ box:box, login: login, password: '', confirm:'' }}
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
                     <FormInput name='box' value={values.box} placeholder={`${t("account:LABEL_BOX_ID")}`+"     "+`0000-0000-0000 ...`} autoCapitalize='characters' returnKeyType={'next'}   onChangeText = {(val)=> {setFieldValue('box', val); setFieldTouched('box', true, false)}}   iconColor='#2C384A'  addTestId = {boxID} bgColor={bgColor} />               
                     <FormInput name='login' value={values.login} placeholder={t('Email')}  autoCapitalize='none' returnKeyType={'next'}   onChangeText = {onChangeWithRulesExternal('login',noSpace)(values,setFieldValue)}   iconColor='#2C384A'  addTestId = {emailID} bgColor={bgColor} />               
                     <FormInput name='password' value={values.password} placeholder={t('Enter password')} autoCapitalize='none' returnKeyType={'next'} secureTextEntry passwordToggle  no_onKeyPress = {onKeyTest}  onChangeText={onChangeWithRulesExternal('password',noSpace)(values,setFieldValue)}  iconColor='#2C384A'   bgColor={bgColor} addTestId = {passwordID}/>               
                     <TextInput style={{height: 1,padding:0 }} rem = "here only because of ios 12 qwerty bug when 2 consecutive secureTextEntry " />
                     <FormInput name='confirm' value={values.confirm} placeholder={t('Confirm password')} autoCapitalize='none' returnKeyType={'next'} secureTextEntry passwordToggle   onChangeText={onChangeWithRulesExternal('confirm',noSpace)(values,setFieldValue)} iconColor='#2C384A'   bgColor={bgColor} addTestId = {confirmID}/>
                   </View>

                    <Text style={{ color: 'red' }}>{errServer}</Text>               
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


 export default RecoverAccountComponent;