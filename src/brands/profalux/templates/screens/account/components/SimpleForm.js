import '_brand/templates/screens/_locales'
import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Text, View, SafeAreaView, StyleSheet, TextInput} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useObject } from '_hooks/object';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider';
import Button from '_brand/templates/components/ui/Button';
import { SelectList } from 'react-native-dropdown-select-list'

import FormInput from '_brand/templates/components/forms/FormInput';
import { Formik } from 'formik';
import { Api } from '_api/index';
//--- Appium -----
import { buildTestId } from '_helpers/appium';

export const SimpleForm = forwardRef((props, ref) => {

    const { fieldText, fieldTexStyle, handleSimpleFormSubmit, defaultName, placeholder, fieldWidth} = props;


    const { t, i18n } = useTranslation();
    const tns = "products"

    const theme = useTheme();
    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const containerBgcolor = theme?.prflxContaintBgColor||'white';
    const bgColor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";


    //======== APPIUM =============
    const installationNameInputID = buildTestId("installName");
    const boxCodeInputID = buildTestId("boxCode");
    const  installationNameTextID = buildTestId("textDisplayed")

const installNameRef = useRef(null)
const boxCodeRef = useRef(null)
const formikRef = useRef(null);
    
// REF methods can be called (useImperativeHandle)
useImperativeHandle(ref, () => ({
    submitForm() {   
        console.log("USE IMPER",formikRef.current.values);
        return formikRef.current.values.installName       
    }
}));


    return (

        <View>
            <Formik
                initialValues={{ installName: defaultName }}
                onSubmit={handleSimpleFormSubmit}
                innerRef={formikRef}
            >

                            {({ values, setFieldTouched, setFieldValue}) => {
                            
                            return ( 
                                        <View style={styles.installNameContainer}>
                                            <Text style={fieldTexStyle || styles.text}>{fieldText}</Text>
                                            <View style={[styles.inPutField, {width:fieldWidth || '60%'}]}>
                                                <TextInput  
                                                    name='installName' 
                                                    //editable={false}
                                                    ref={installNameRef}
                                                    value={values.installName}  
                                                    placeholder={placeholder ||`${t("account:BOX_FORM_NAME_PLACE_HOLDER")} `}
                                                    //placeholderTextColor={'lighterGrey'}
                                                    defaultValue = {defaultName}
                                                    autoCapitalize='none'  
                                                    style={{flex:1,justifyContent:'center', alignItems:'center', padding:10, color:textColor}}
                                                    onChangeText = {(val)=>{
                                                        setFieldValue('installName', val);
                                                        //setFieldTouched('friendEmail', true, false);
                                                        }
                                                    } 
                                                    //onSubmitEditing={() => changeFocus(passwordRef)}   
                                                    bgColor={bgColor} 
                                                    addTestId={installationNameInputID}
                                                    />
                                            </View>
                                        </View>
                            );
                        }}
                    </Formik>
            </View>
    )
})

const styles = StyleSheet.create({
    installNameContainer: {
        backgroundColor: 'transparent',
        alignItems:'center',
        borderColor:'#3C3C43',
        borderRadius: 10,
        //height:'100%'
    },
    inPutField: {
        backgroundColor: 'white',
        borderColor:'#3C3C43',
        justifyContent:'center',
        //alignItems:'center',
        borderWidth:0.5,
        borderRadius: 22,
    },
    text: {
        fontSize: 16,
        fontWeight:'400',
        textAlign:'center',
        color: '#3E495E',
        marginBottom: 20
    },
    validateButton: {
        borderRadius: 20,
        height: 40,
        width: '90%',
        marginBottom: 10
    },
})