import '_brand/templates/screens/addObject/locales'
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Text, View, StyleSheet, TextInput} from 'react-native';

import { useTheme } from '_theming/themeProvider';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

export const PasswordForm = forwardRef((props, ref) => {

    const { fieldText, fieldTexStyle, handleSubmit, defaultInput, fieldWidth} = props;

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const theme = useTheme();
    const borderColor = theme?.prflxBorderColor||'orange';
    const containerBgcolor = theme?.prflxContaintBgColor||'white';
    const bgColor = theme?.prflxbgColor||'white';
    const textColor = theme?.prflxTextColor||'black';

    const passwordRef = useRef(null)
    const formikRef = useRef(null);
        
    // REF methods can be called (useImperativeHandle)
    useImperativeHandle(ref, () => ({
        submitForm() {   
            console.log("USE_IMPER",formikRef.current.values );
            //return  formikRef.current.submitForm(values);         
            return formikRef.current.values.userInput;        
        }
    }));


    return (

        <View>
            <Formik
                initialValues={{ userInput: defaultInput }}
                onSubmit={handleSubmit}
                innerRef={formikRef}
                >

                {({ values, setFieldValue}) => {
                    
                    return ( 
                        <View style={styles.installNameContainer}>
                            <Text style={fieldTexStyle || styles.text}>{fieldText}</Text>
                            <View style={[styles.inPutField, {width:fieldWidth || '60%', minHeight:40}]}>
                                <TextInput  
                                    name='userInput' 
                                    ref= {passwordRef}
                                    value={values.userInput}  
                                    placeholder={'Mot de passe wifi'}
                                    //autoCapitalize={"characters"}
                                    style={{flex:1,justifyContent:'center', alignItems:'center', padding:10, color:textColor}}
                                    onChangeText = {(val)=>{
                                        setFieldValue('userInput', val);
                                        }
                                    } 
                                    bgColor={bgColor} 
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
        borderColor:'red',
        alignItems:'center',
        borderRadius: 10
    },
    inPutField: {
        backgroundColor: 'white',
        borderColor:'#3C3C43',
        borderWidth:0.5,
        borderRadius: 22,
    },
    text: {
        fontSize: 16,
        fontWeight:'400',
        textAlign:'center',
        color: '#3E495E',
        marginBottom: 20
    }
})