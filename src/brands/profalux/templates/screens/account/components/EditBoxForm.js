import '_brand/templates/screens/_locales'
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



const boxNameFormSchema = yup.object({
  boxName: yup.string().required("EMAIL_INPUT_MANDATORY_FIELD")
});

//----------------------------------------------------------------


export const EditBoxForm = forwardRef((props,ref) => {

  const {oldName}=props;
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
 
 const [boxName, setLogin] = useState('');//hmoundoyi@avidsen.com

 const {bgColor} = props;



const  handleSubmit = async(values) =>{
 
 let validData = [];
 let isValid =  await boxNameFormSchema.isValid(values);

 if(isValid) {
   console.log("isValid")
   props.submit(values);
   
   //return true
 } else {
   try {
     validData = await boxNameFormSchema.validate(values,{abortEarly:false});   
   
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
const boxNameID = buildTestId("boxName");









 return (
   <React.StrictMode>
    <View style={{backgroundColor:'transparent'}}>       
     {props.connectingError != 200 && props.connectingError != undefined ?        
      <Text>Error ...</Text>
      :
      null    
    }
      <Formik
            //initialValues={{ boxName: 'test@profalux.com', password: 'testAP23;' }}
            initialValues={{ boxName: oldName}}
            no_validationSchema={boxNameFormSchema}
            onSubmit={handleSubmit}
            innerRef={formikRef}    
            >

            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit ,setFieldValue}) => {
              


            return ( <>
             <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
              <View style={{backgroundColor:'transparent'}}>
                 <FormInput  name='boxName' value={values.boxName}  placeholder={oldName}  autoCapitalize='none'  onChangeText = {onChangeWithRulesExternal('boxName')(values,setFieldValue)} returnKeyType={'next'}   bgColor={bgColor} addTestId={boxNameID}/>                        
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

