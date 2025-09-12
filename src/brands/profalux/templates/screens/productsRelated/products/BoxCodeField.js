import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Text, View, StyleSheet, TextInput} from 'react-native';

import { useTheme } from '_theming/themeProvider';
import { Formik } from 'formik';
//--- Appium -----
import { buildTestId } from '_helpers/appium';

export const BoxCodeField = forwardRef((props, ref) => {

    const { fieldText, fieldTexStyle, handleBoxCodeSubmit, defaultCode, fieldWidth} = props;


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
    const boxCodeInputID = buildTestId("boxCode");
    const  boxCodeTextID = buildTestId("textDisplayed")

const boxCodeRef = useRef(null)
const formikRef = useRef(null);
    
// REF methods can be called (useImperativeHandle)
useImperativeHandle(ref, () => ({
    submitForm() {   
        console.log("USE IMPER",formikRef.current.values );
        return formikRef.current.values.boxCode;  
        //formikRef.current.submitForm(values);         
    }
}));


    return (

        <View>
            <Formik
                initialValues={{ boxCode: defaultCode }}
                onSubmit={handleBoxCodeSubmit}
                innerRef={formikRef}
            >

                            {({ values, setFieldTouched, setFieldValue}) => {
                            
                            return ( 
                                        <View style={styles.installNameContainer}>
                                            <Text style={fieldTexStyle || styles.text}>{fieldText}</Text>
                                            <View style={[styles.inPutField, {width:fieldWidth || '60%'}]}>
                                                <TextInput  
                                                    name='boxCode' 
                                                    ref={boxCodeRef}
                                                    value={values.boxCode}  
                                                    placeholder={'0000-0000-0000-0000-0000-0000'}
                                                    //placeholderTextColor="red"
                                                    //defaultValue = {defaultCode}
                                                    autoCapitalize={"characters"}
                                                    style={{flex:1,justifyContent:'center', alignItems:'center', padding:10, color:textColor}}
                                                    onChangeText = {(val)=>{
                                                        setFieldValue('boxCode', val);
                                                        //setFieldTouched('friendEmail', true, false);
                                                        }
                                                    } 
                                                    //onSubmitEditing={() => changeFocus(passwordRef)}   
                                                    bgColor={bgColor} 
                                                    addTestId={boxCodeInputID}
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
        flex: 1,
        backgroundColor: 'transparent',
        borderColor:'red',
        justifyContent: 'space-evenly',
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
    },
    validateButton: {
        borderRadius: 20,
        height: 40,
        width: '90%',
        marginBottom: 10
    },
})