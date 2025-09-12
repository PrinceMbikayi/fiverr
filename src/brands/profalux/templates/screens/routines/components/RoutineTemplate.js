import '_brand/templates/screens/routines/locales'
import React, { useState, useRef, useEffect } from 'react';

import { SafeAreaView, View, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'

import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { PopupMenu } from '_brand/templates/components/headers/components/PopupMenu';

import { iconsJs } from '_brand/utils/iconsJs';
import { Header } from '_brand/templates/screens/maison/components/Header';



const screenWidth = Dimensions.get('window').width;

const RoutineTemplate = (props) => {

    const { children, withKebab, title, noSettingOptions, onlyBack=false } = props

    const [kebab, setKebab] = useState({ active: false, options: [{}] })
    const [active, setActive] = useState(false);

    const actionSheetRef = useRef(null);
    useEffect(() => {
        if (setKebab) {
            setKebab({ active: true, options: options })
        }
    }, []);

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const { theme } = useTheme();

    const borderColor = theme?.prflxBorderColor || 'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'


    const accessibilityLabel = "Screen_DASHBOARD";

    const goBack = () => {

        navigation.goBack();
    }


    const kebabSelectRoutine = (id) => {
        console.log('WHAT_DO_YO_WANT_TO_DO :', id);
            navigation.navigate("RoutineSelectionScreen", { gotask: id })
    }
    const kebabSelectRoutineType = () => {
        navigation.navigate('SelectRoutineTypeScreen');
    }


    const options = [
        {
            id: "add",
            title: `${t(tns + ":" + "ADD_ROUTINE")}`,
            iconJSName: iconsJs.addIcon.name,
            action: kebabSelectRoutineType
        },
        {
            id: "modify",
            title: `${t(tns + ":" + "MODIFY_ROUTINE")}`,
            iconJSName: iconsJs.modifyIcon.name,
            action: kebabSelectRoutine
        },
        {
            id: 'delete',
            title: `${t(tns + ":" + "DELETE_ROUTINE")}`,
            iconJSName: iconsJs.deleteIcon.name,
            action: kebabSelectRoutine
        },
    ]
    //--------------- RETURN------
    return (

        <SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: 'white' }} accessibilityLabel={accessibilityLabel}>

            <View style={{ height: '100%', backgroundColor: bgcolor }}>

                {!onlyBack ?
                    <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                        {withKebab &&
                            <Header
                                title={title}
                                noShadow
                                bgColor="transparent"
                                hideBurger={false}
                                kebab={kebab.active ? <PopupMenu options={kebab.options} /> : null}
                            />

                        }
                        {
                            (withKebab == false) &&
                            < Header //HeaderWithBack
                                title={title}
                                backSVG centered
                                goBack={{ action: goBack }}
                                noShadow
                            />
                        }
                    </View>
                    :
                    <View>
                        <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                                <HeaderWithBack
                                    title={title}
                                    backSVG centered
                                    goBack={{ action: goBack }}
                                    noShadow
                                />
                        </View>
                    </View>

                }
                <View
                    style={{ flex: 1, backgroundColor: 'transparent', paddingHorizontal: 0.1 * screenWidth / 4, paddingBottom: 0 }}
                    >
                    {
                        children
                    }
                    <View style={{ height: 10, width: 300, backgroundColor: 'transparent' }}></View>
                </View>

            </View>
        </SafeAreaView>


    )
};

export default RoutineTemplate;