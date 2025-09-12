import '_brand/templates/screens/_locales'
import React, { useState, useRef, useEffect } from 'react';

import { SafeAreaView, View, ScrollView, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'

import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { PopupMenu } from '_brand/templates/components/headers/components/PopupMenu';

import { iconsJs } from '_brand/utils/iconsJs';
import { Header } from '_brand/templates/screens/maison/components/Header';


const screenWidth = Dimensions.get('window').width;

export const BoxScreenTemplate = (props) => {

    const { children, withKebab, title } = props

    const [kebab, setKebab] = useState({ active: false, options: [{}] })
    const [active, setActive] = useState(false);

    const actionSheetRef = useRef(null);
    // Show the setting icon on header of level 2 widget 
    useEffect(() => {
        if (setKebab) {
            setKebab({ active: true, options: options })
        }
    }, []);

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    //console.log("NAVIGATION PARAMS :", navigationParams);

    const { t, i18n } = useTranslation();
    //const tns = "routine";
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

    //    const kebabSelectBox = (id)=>{
    //         navigation.navigate("HandleRoutine",{
    //             screen:'RoutineSelectionScreen', 
    //             params: {gotask:id}
    //    });

    const kebabSelectBox = (id) => {
        navigation.navigate("SelectBox", { gotask: id }
        );
    }

    const goRegisterNewBox = () => {
        navigation.navigate("RegisterBoxScreen");
    }



    const options = [

        {
            id: "modify",
            title: `${t("account:ADD_BOX")}`,
            iconJSName: iconsJs.addIcon.name,
            action: goRegisterNewBox
        },
        {
            id: "modify",
            title: `${t("account:MODIFY_BOX")}`,
            iconJSName: iconsJs.modifyIcon.name,
            action: kebabSelectBox
        },
        // {
        //     id: 'delete',
        //     title: `${t("account:DELETE_BOX")}`,
        //     iconJSName: iconsJs.deleteIcon.name,
        //     action: kebabSelectBox
        // },
    ]
    //--------------- RETURN------
    return (

        <SafeAreaView style={{flex:1, backgroundColor: 'white' }} accessibilityLabel={accessibilityLabel}>


                <View style={{ height: '100%', backgroundColor: bgcolor }}>

                <View style={{backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end'}}>
                    {withKebab &&
                        <HeaderWithBack
                            title={title}
                            //title={weatherTown}
                            noShadow
                            bgColor="transparent"
                            hideBurger={false}
                            goBack={{ action: goBack }}
                            kebab={kebab.active ? <PopupMenu lastOptionColor={textColor}  popupWidth={320} options={kebab.options} /> : null}
                        />

                    }
                    {
                        (withKebab == false) &&
                        <HeaderWithBack
                            //title={uObject.name}
                            title={title}
                            backSVG centered
                            goBack={{ action: goBack }}
                            noShadow
                        />
                    }
                </View>
                <View
                    style={{flex:1, backgroundColor: 'transparent', paddingHorizontal: 0.1 * screenWidth / 4, paddingBottom: 0 }}
                    showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                >

                    {
                        children
                    }

                    <View style={{ height: 51, width: 300, backgroundColor: 'transparent' }}></View>
                </View>

            </View>
        </SafeAreaView>


    )
};

const styles = StyleSheet.create({
    headerStyle: {
        justifyContent: 'center',
        alignItems: 'stretch',
        borderBottomWidth: 2,
        height: 55,// '8%',
        marginBottom: -5,
    },
    bodyWrapper: {
        flexDirection: 'column',
        padding: 10,
    },
})