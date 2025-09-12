import React from 'react';
import {useContext,useState,useRef,useEffect} from 'react';
import { View, Text,SafeAreaView,TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';
import styled,{ThemeProvider} from 'styled-components/native';

import { Formik } from 'formik';



import { useTheme } from '_theming/themeProvider';
import AccessButton from '_components/forms/accessButton';
import {Body,ViewerTitle,ViewerText,TextInput,Label} from '../styled';


export const QrCodeSettingsForm = (props) => {

    const {initialValues = {family_name:'',comment:''},callback,buttonLabel = "???"} = props;
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   

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

    return (
            <ThemeProvider theme={styledTheme}>
               
                <Formik  onSubmit={onSubmit} validate={checkFormInputs}  initialValues={initialValues}>
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View>
                        <Label>{t("qrbasic:INPUT_NAME_LABEL")}</Label>
                        <TextInput onChangeText={handleChange('family_name')} onBlur={handleBlur('family_name')} value={values.family_name}
                                    placeholder={t("qrbasic:INPUT_NAME_PLACEHOLDER")} placeholderTextColor="#999999" color="black"
                        />
                        <Label>{t("qrbasic:INPUT_EXTRA_LABEL")}</Label>
                        <TextInput onChangeText={handleChange('comment')} onBlur={handleBlur('comment')} value={values.comment}
                                    placeholder={t("qrbasic:INPUT_EXTRA_PLACEHOLDER")} placeholderTextColor="#bbbbbb" color="black"
                        />
                        <AccessButton  disabled={!submitEnabled} onPress={handleSubmit} specialColor={textColor} title={buttonLabel}/>
                        
                    </View>
                    )}
                </Formik>
            </ThemeProvider>
    )

}