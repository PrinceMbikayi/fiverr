import "_brand/templates/screens/group/locales"
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

const GroupTemplateScreen = (props) => {

    const { children, withKebab } = props

    const [kebab, setKebab] = useState({ active: false, options: [{}] })
    const [active, setActive] = useState(false);

    const { t, i18n } = useTranslation();
    const tns = "group";

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

    const { theme } = useTheme();

    const borderColor = theme?.prflxBorderColor || 'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'


    const showInfos = () => {
        // console.log("voilà voilà");
        navigation.toggleDrawer();
    }
    const accessibilityLabel = "Screen_DASHBOARD";

    const handlePress = () => {
        console.log('Toggle pressed OK !');
        setActive(!active);
    }




    const goBack = () => {

        navigation.goBack();
    }
    // const kebabDeleteAction = ()=>{
    //     actionSheetRef.current?.present()
    //    //  actionSheetRef.current?.show()
    //    }
    const kebabSelectGoup = (id) => {
        navigation.navigate('GroupSelectionScreen', { gotask: id });
        //navigation.navigate('GroupModifyScreen',{'typeName':shutterObjectAllInfos?.objectDatas?.typeName,itemId:itemId});
    }
    const kebabAddGroup = () => {
        navigation.navigate('GroupAddScreen');
    }



    const options = [
        {
            id: "add",
            title: `${t(tns + ":" + "KEBAB_ADD")}`,
            iconJSName: iconsJs.addIcon.name,
            action: () => kebabAddGroup()
        },
        {
            id: "modify",
            title: `${t(tns + ":" + "KEBAB_MODIFY")}`,
            iconJSName: iconsJs.modifyIcon.name,
            action: (optionId) => kebabSelectGoup(optionId)
        },
        {
            id: 'delete',
            title: `${t(tns + ":" + "KEBAB_DELETE")}`,
            iconJSName: iconsJs.deleteIcon.name,
            action: (optionId) => kebabSelectGoup(optionId)
        },
    ]
    //--------------- RETURN------
    return (

        <SafeAreaView style={{ heith: '100%', width:'100%', backgroundColor: 'white' }} accessibilityLabel={accessibilityLabel}>
            <StatusBar no_hidden={true} barStyle="dark-content" />

            <View style={{ height: '100%', backgroundColor: bgcolor }}>

                {/* marginTop:-60, paddingTop:65.5, height:Platform.OS == "ios"? '16%':'18.5%'*/}
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    {withKebab &&
                        <Header
                            title={t(tns + ":" + "GROUP_TITLE")}
                            //title={weatherTown}
                            noShadow
                            bgColor="transparent"
                            hideBurger={false}
                            kebab={kebab.active ? <PopupMenu options={kebab.options} /> : null}
                        />

                    }
                    {
                        (withKebab == false) &&
                        <HeaderWithBack
                            //title={uObject.name}
                            title={t(tns + ":" + "GROUP_TITLE")}
                            backSVG centered
                            goBack={{ action: goBack }}
                            noShadow
                        //extraButtons={settings.active ? [{ action: goSettings, icon: 'settings' }] : []}
                        //kebab={kebab.active ? <PopupMenu options={kebab.options} /> : <View style={{ width: 200, height: 100, backgroundColor: 'green' }}></View>} 
                        />
                    }
                </View>
                <ScrollView
                    style={{ height: '100%', backgroundColor: 'transparent', paddingHorizontal: 0.1 * screenWidth / 4, paddingBottom: 0 }}
                    showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                >

                    {
                        children
                    }

                    <View style={{ height: 51, width: 300, backgroundColor: 'transparent' }}></View>
                </ScrollView>

            </View>
        </SafeAreaView>


    )
};

export default GroupTemplateScreen;

const styles = StyleSheet.create({
    headerStyle: {
        justifyContent: 'center',
        alignItems: 'stretch',
        borderBottomWidth: 2,
        height: '8%',
        marginBottom: -5,
    },
    bodyWrapper: {
        flexDirection: 'column',
        padding: 10,
    },
})