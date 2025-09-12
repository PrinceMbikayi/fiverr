import '_brand/templates/screens/_locales'
import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Text, View, SafeAreaView, StyleSheet, TextInput, Pressable } from 'react-native';
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
import RightChevron from '_brand/images/icons/app/profaluxIconJs/RightChevron';

export const DisplayForm = forwardRef((props, ref) => {

    const { placeholder, handleSubmit, defaultName, goEditForm, editable } = props;


    const { t, i18n } = useTranslation();
    const tns = "products"

    const theme = useTheme();
    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const containerBgcolor = theme?.prflxContaintBgColor || 'white';
    const bgColor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";


    //======== APPIUM =============
    const installationNameInputID = buildTestId("installName");
    const boxCodeInputID = buildTestId("boxCode");
    const installationNameTextID = buildTestId("textDisplayed")

    const installNameRef = useRef(null)
    const boxCodeRef = useRef(null)
    const formikRef = useRef(null);

    // REF methods can be called (useImperativeHandle)
    useImperativeHandle(ref, () => ({
        submitForm() {
            console.log("USE IMPER", formikRef.current.values);
            return formikRef.current.values.installName
        }
    }));


    return (

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <View style={{ marginLeft: 5, width: '82%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                <Formik
                    initialValues={{ installName: defaultName }}
                    onSubmit={handleSubmit}
                    innerRef={formikRef}
                >

                    {({ values, setFieldTouched, setFieldValue }) => {

                        return (
                            <View style={styles.installNameContainer}>
                                <View style={[styles.inPutField]}>
                                    <TextInput
                                        editable={false}
                                        name='installName'
                                        ref={installNameRef}
                                        value={values.installName}
                                        placeholder={placeholder}
                                        placeholderTextColor={textColor}
                                        defaultValue={defaultName}
                                        autoCapitalize='none'
                                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, color: textColor }}
                                        onChangeText={(val) => {
                                            setFieldValue('installName', val);
                                        }
                                        }
                                        bgColor={bgColor}
                                        addTestId={installationNameInputID}
                                    />
                                </View>
                            </View>
                        );
                    }}
                </Formik>
            </View>

            <Pressable
                onPress={goEditForm}
                style={{ width: 25, height: 25, backgroundColor: 'transparent', marginLeft: 5 }}>
                <RightChevron color="#3E495E" />
            </Pressable>
        </View>
    )
})

const styles = StyleSheet.create({
    installNameContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        borderColor: 'red',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 10
    },
    inPutField: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: '#3C3C43',
        borderWidth: 0.5,
        borderRadius: 22,
    },
    text: {
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
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