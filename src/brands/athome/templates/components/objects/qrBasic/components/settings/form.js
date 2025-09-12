import React from 'react';

import {forwardRef,useRef,useState,useEffect,useImperativeHandle} from 'react'
import { View, Text,SafeAreaView,KeyboardAvoidingView,TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';
import styled,{ThemeProvider} from 'styled-components/native';

import InputWrapper from '_brand/templates/components/forms/inputWrapper'
import { Formik } from 'formik';



import { useTheme } from '_theming/themeProvider';
import AccessButton from '_components/forms/accessButton';
import {Body,ViewerTitle,ViewerText,TextInput as RealTextInput,Label} from '../styled';



const TextInput = (props) => {
        console.log("porpossss",props)
       
        const {placeholder,inputColor='pink',bgColor="green",value} = props;
       
        const inputRef = useRef();
        const [isFocused, setIsFocused] = useState();
       
        const focus = () => {
            inputRef.current.focus();
            setIsFocused(true)
        }

        const onBlur = () => {
            setIsFocused(false)
        }
        return (
            <InputWrapper  placeholder={placeholder} borderColor={inputColor} onFocus={focus} bgColor={bgColor} {...{isFocused,value}}>
                <RealTextInput {...props} style={{flex:1,paddingLeft:16,backgroundColor:'transparent',padding:4 }} ref={inputRef} onBlur={onBlur} onFocus={focus}/>
            </InputWrapper>
        )
}


export const QrCodeSettingsForm = forwardRef((props,ref) => {

    const {initialValues = {family_name:'',comment:''},callback,buttonLabel = "???"} = props;
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {textColor,headerBackgroundColor,headerTextColor} = baseColors;   


   



    useEffect(()=> {
        // updatePlease
      },[submitEnabled])
  
      const checkFormInputs = (values) => {
        console.log("values validate",values)
        const isOk = (values.family_name.length > 0);
        setSubmitEnabled(isOk)
      }


    const onSubmit = (values) => {
        callback(values);
    }

    

    const [submitEnabled,setSubmitEnabled] = useState((initialValues?.family_name != ''))

    const styledTheme = {'textColor':textColor};

    const focus = () => {
        console.log("onFocus");
    }
    const borderColor = theme.neutral_medium;
    const inputColor = 'black';
    const bgColor = "white";
    const placeholderTextColor = theme.neutral_medium;
    const color = inputColor;

    const formikRef = useRef();
    useImperativeHandle(ref, () => ({         
     
        submitForm() {   
            formikRef.current.submitForm();        
            //setModalVisible(!modalVisible);
        }
    }));

    


    return (
            <ThemeProvider theme={styledTheme}>
               
                <Formik  onSubmit={onSubmit} validate={checkFormInputs}  initialValues={initialValues} innerRef={formikRef} >
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={{backgroundColor:'transparent'}}>                       
                            <TextInput onChangeText={handleChange('family_name')} onBlur={handleBlur('family_name')} value={values.family_name}
                                        placeholder={t("qrbasic:INPUT_NAME_LABEL")}
                                        {...{focus,borderColor,inputColor,color,bgColor,placeholderTextColor}}
                            /> 
                        <View style={{height:8}}/>                   
                        <TextInput onChangeText={handleChange('comment')} onBlur={handleBlur('comment')} value={values.comment}
                                    placeholder={t("qrbasic:INPUT_EXTRA_LABEL")}
                                    {...{focus,borderColor,inputColor,color,bgColor,placeholderTextColor}}
                        />
                        {/*<AccessButton  disabled={!submitEnabled} onPress={handleSubmit} specialColor={textColor} title={buttonLabel}/>*/}
                        
                    </View>
                    )} 
                </Formik>
               
            </ThemeProvider>
    )

})