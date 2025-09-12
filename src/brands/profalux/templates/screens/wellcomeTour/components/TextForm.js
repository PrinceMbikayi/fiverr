import '_brand/templates/screens/wellcomeTour/locales'
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

export const TextForm = forwardRef((props, ref) => {

    const { renameText, handleSubmit, oldName, existingNames, goNavigation, selection } = props;

    const { t, i18n } = useTranslation();
    const tns = "wellcomeTour";

    const navigation = useNavigation();
    const theme = useTheme();

    const bgColor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black';


    //======== APPIUM =============
    const renameInputID = buildTestId("rename");
    const renameTextID = buildTestId("textDisplayed")
    const loginID = buildTestId("login");

    const renameRef = useRef(null)
    const formikRef = useRef(null);

    const nameSchema = yup.object({
        rename: yup.string().required("NAME_INPUT_MANDATORY_FIELD"),
    });


    // REF methods can be called (useImperativeHandle)
    useImperativeHandle(ref, () => ({
        submitForm() {
            formikRef.current.submitForm();
        }
    }));



    const submit = async (val) => {
        console.log("ENTRER SUBMIT VALUES :", val)
        let message;
        let isValid;
        let values;
        //const values = {...val,  rename:(val.rename).trim() }
        let checkSchema = await nameSchema.isValid(val);

        if (checkSchema) {
            console.log(" SCHEMA IS TRUE :", checkSchema)// user enter something
            values = { ...val, rename: (val.rename).trim() }
            console.log("TRIM YUP :", values)
            if (values.rename == '') {
                message = `${t(tns + ":" + "NAME_INPUT_MANDATORY_FIELD")}`;
                isValid = false;
            } else { // user enters some valid name

                isValid = false;

                // if (selection && selection == 0) {
                //     console.log("MY SELECTION :", selection)
                //     isValid = false;
                //     message = `${t(tns + ":" + "SELECT_AN_ELEMENT")}`;
                // } else { // i.e : selection does not exist or is not empty
                //     isValid = true;
                // }
            }

        } else {
            console.log(" SCHEMA IS FALSE :", checkSchema, val)
            isValid = false;
            if (val.rename == undefined) {
                message = `${t(tns + ":" + "NAME_INPUT_MANDATORY_FIELD")}`;
            } else {
                values = { ...val, rename: (val.rename).trim() }
                if (values.rename == '') {
                    message = `${t(tns + ":" + "NAME_INPUT_MANDATORY_FIELD")}`;
                } else {
                    message = "SELECT_AN_ELEMENT"
                }
            }
        }


        if (isValid == true) {
            handleSubmit(values);
        } else {
            Toast.show(
                message,
                {
                    backgroundColor: 'red',
                    textColor: 'white',
                    textStyle: { fontSize: 16, fontWeight: '600' },
                    position: Toast.positions.CENTER,
                    duration: 3000,
                    onHide: () => { }
                }
            );
        }

    }




    return (

        <View>
            {(oldName != undefined) &&

                <Formik
                    initialValues={{ rename: oldName }}
                    no_validationSchema={nameSchema}
                    onSubmit={submit}
                    innerRef={formikRef}
                >

                    {({ values, touched, errors, setFieldTouched, isValid, setFieldValue }) => {
                        const noSpace = "noSpace"

                        return (
                            <View style={styles.renameContainer}>
                                {/* <Text style={styles.text}>{renameText}</Text> */}
                                <View>
                                    <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>

                                        <FormInput
                                            name='rename'
                                            value={values.rename}
                                            placeholder={oldName ? oldName : `${t(tns + ":" + "SCENARIO_PLACEHOLDER")}`} // 
                                            autoCapitalize='none'
                                            onChangeText={(val) => {
                                                setFieldValue('rename', val);
                                                setFieldTouched('rename', true, false);
                                            }
                                            }
                                            //onChangeText = {onChangeWithRulesExternal('rename',noSpace)(values,setFieldValue)} 
                                            returnKeyType={'next'}
                                            //onSubmitEditing={() => changeFocus(passwordRef)}   
                                            bgColor={bgColor}
                                            addTestId={loginID}
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
    inPutField: {
        backgroundColor: 'white',
        borderColor: '#3C3C43',
        borderWidth: 0.5,
        borderRadius: 22,
        height: 35,
        width: '90%'
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3E495E',
        marginBottom: 10,
        marginTop: 10
    },
    validateButton: {
        borderRadius: 20,
        height: 40,
        width: '90%',
        marginBottom: 10
    },
})