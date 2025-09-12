import '_brand/templates/screens/routines/locales'
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import { Formik } from 'formik';
import FormInput from '_brand/templates/components/forms/FormInput';
import WithTranslateFormErrors from "_utils/withTranslateFormErrors";
import Toast from 'react-native-root-toast';
import * as yup from 'yup';
//--- Appium -----
import { buildTestId } from '_helpers/appium';

export const SingleFormWithValidation = forwardRef((props, ref) => {

    const { formLabel, handleSubmit, defaultName, selection } = props;

    const { t, i18n } = useTranslation();
    const tns = "routine";

    const navigation = useNavigation();
    const theme = useTheme();

    const bgColor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black';


    //======== APPIUM =============
    const renameInputID = buildTestId("name");
    const renameTextID = buildTestId("textDisplayed")
    const loginID = buildTestId("login");

    const renameRef = useRef(null)
    const formikRef = useRef(null);

    const nameSchema = yup.object({
        name: yup.string().required("NAME_INPUT_MANDATORY_FIELD").min(3, "NAME_MUST_HAVE_AT_LEAST_THREE_CHARACTERS"),
        //name: yup.string().required(`${t(tns + ":" + "NAME_INPUT_MANDATORY_FIELD")}`).min(3, `${t(tns + ":" + "NAME_MUST_HAVE_AT_LEAST_THREE_CHARACTERS")}`),
    });


    // REF methods can be called (useImperativeHandle)
    useImperativeHandle(ref, () => ({
        submitForm() {
            formikRef.current.submitForm();
        }
    }));


    const processValidation = async(formValue) => {
        console.log('FORM_VALUE :', formValue);
        const trimmedName = (formValue?.name).trim()
        const formValueToValidate = { ...formValue, name: trimmedName }
        let result;
        const checkSchema = await nameSchema.validate(formValueToValidate)
                                .then((valid) => result = {isValid:true, name:valid?.name})
                                .catch((error) => result = {isValid:false, errMsg:error?.message} );

        return checkSchema
    }



    const submit = async (val) => {
        const values = await processValidation(val).catch((error) => {
            console.log('VALIDATION ERROR :', error);
        }
        );
        console.log('CHECK_MY_SCHEMA_VALIDATION_BACK :', values);
        handleSubmit(values)
    }




    return (

        <View>
            {(defaultName != undefined) &&

                <Formik
                    initialValues={{ name: defaultName }}
                    no_validationSchema={nameSchema}
                    onSubmit={submit}
                    innerRef={formikRef}
                >

                    {({ values, touched, errors, setFieldTouched, isValid, setFieldValue }) => {
                        const noSpace = "noSpace"

                        return (
                            <View style={styles.renameContainer}>
                                <Text style={styles.text}>{formLabel}</Text>
                                <View>
                                    <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>

                                        <FormInput
                                            name='name'
                                            value={values.name}
                                            placeholder = {defaultName ? defaultName :`${t(tns + ":" + "WIND_PROTECTION")}`} // 
                                            autoCapitalize='none'
                                            onChangeText={(val) => {
                                                setFieldValue('name', val);
                                                setFieldTouched('name', true, false);
                                            }
                                            }
                                            returnKeyType={'next'}
                                            bgColor={bgColor}
                                        />
                                    </WithTranslateFormErrors>
                                </View>
                            </View>
                        );
                    }}
                </Formik>
            }
        </View>
    )
})

const styles = StyleSheet.create({
    renameContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        borderColor: 'red',
        justifyContent: 'space-evenly',
        borderRadius: 10
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3E495E',
        marginBottom: 10,
        marginTop: 10
    }
})