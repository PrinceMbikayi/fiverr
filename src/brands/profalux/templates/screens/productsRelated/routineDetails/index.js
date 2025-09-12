import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { StatusBar, View, ScrollView, SafeAreaView, Dimensions } from 'react-native';

import { useObject } from '_hooks/object';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { TransitionPresets } from '@react-navigation/stack';
import TypeDynamicDetails from '_components/objects/@dynamics_brand/routines/indexDetails';
import { useTheme } from '_theming/themeProvider';
import { useAppGlobal } from '_helpers/appGlobalProvider';
import { getObjectById, getObjectRuntimeDatas } from '_helpers/selectors';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';


import { useNavigation, useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
export const ProductDetailsScreen = (props) => {

    //console.log("PRODUCT DETAILS SCREEN :", props)
    const navigation = useNavigation();
    const route = useRoute();

    const { itemId, otherParam } = route.params;
    const navParams = route.params; // needed in render   
    const { t, i18n } = useTranslation();
    const uObject = useObject(itemId);
    //console.log(" FILTRE ITEM DATA :", uObject);
    const detailedItem = useSelector(state => getObjectById(state, itemId));
    const itemRuntimeDatas = useSelector(state => getObjectRuntimeDatas(state, itemId));
    const title = detailedItem?.name;
    const { theme, baseColors } = useTheme();
    const {textColor, headerBackgroundColor, headerTextColor } = baseColors;
    const { isVideoFullscreen } = useAppGlobal();

    const { getObjectMapped } = useAppGlobal();

    //const [compositeComponents, setCompositeComponents]=useState()
    const [traits, setTraits] = useState([])

    const findType = () => {

        let foundType = itemRuntimeDatas?.disguiseType || getObjectMapped(detailedItem?.typeName) || detailedItem?.typeName;
        if (detailedItem?.typeName == 'composite' && detailedItem?.uniType != undefined) foundType = itemRuntimeDatas?.disguise || detailedItem?.uniType;
        if (detailedItem?.typeName == 'application') foundType = detailedItem?.appName || detailedItem?.statusDictionary.__app_id;

        //console.log("foundType",foundType)
        return foundType;
    }
    const [type, setType] = useState(findType());

    let newIcon = detailedItem?.img;


    const [settings, setSettings] = useState({ active: false })

    const [kebab, setKebab] = useState({ active: false, options: [{}] })
    const [showHeader, setShowHeader] = useState(true)

    const childSettingsCallback = (callback) => {
        console.log("childSettingsCallback ==>", callback)
        setSettings({ active: true, callback: callback })
    }
    const childKebabCallback = (options) => {
        console.log("childKebabCallback ==>", options)
        setKebab({ active: true, options: options })
    }

    const childShowHeader = (val) => {
        setShowHeader(val);
    }


    useEffect(() => {

        setType(findType())
    }, [detailedItem]);


    const goBack = () => {

        navigation.goBack();
    }

    const goSettings = () => {
        if (settings.callback) settings.callback();
    };



    const noHeader = ['AirConditionerAirwell'];//'Venetian_Shutter_Ezsp'
    const noScrollViewWrap = ['AirConditionerAirwell', 'noEzspWirePilot', 'noEzspBoiler'];

    const getHeader = () => {

        if (noHeader.indexOf(detailedItem?.typeName) != -1 || isVideoFullscreen) {
            return null
        } else {
            return <GenericHeader />
        }
    }

    //console.log("Type Name Harold checks :", type)

    ///////////////---------------///////////////////

    const bgColor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || 'white';
    const borderColor = theme?.prflxBorderColor || 'red';

    const GenericHeader = () => {
        return (
            <View>
                <HeaderWithBack
                    title={uObject.name}
                    backSVG centered
                    goBack={{ action: goBack }}
                    noShadow
                />
            </View>
        )
    }


    useEffect(() => {

        //console.log("UOBJECT HEEE :", uObject)
    }, [uObject]);

    const getBody = () => {
        if (noScrollViewWrap.indexOf(detailedItem?.typeName) != -1) {
            return <TypeDynamicDetails className={detailedItem?.className} itemId={itemId} newIcon={newIcon} typeName={type} setSettings={childSettingsCallback} setKebab={childKebabCallback} showHeader={childShowHeader} navParams={navParams} />
        } else {
            return <View style={{ flex: 1, backgroundColor: bgColor }}>
                <>
                    <TypeDynamicDetails className={detailedItem?.className} itemId={itemId} itemName={detailedItem?.name} newIcon={newIcon} typeName={type} setSettings={childSettingsCallback} setKebab={childKebabCallback} showHeader={childShowHeader} navParams={navParams} />
                </>
            </View>
        }
    }



    return (

        <SafeAreaView style={{height:'100%' , backgroundColor:headerBackgroundColor || bgColor}} >
            <StatusBar no_hidden={true} barStyle="dark-content"/>

            <View style={{flex:1, backgroundColor:bgColor}}>

                <View   style={{backgroundColor:'transparent' || headerBgColor, alignItems:'center',justifyContent:'flex-end'}}>
                {showHeader &&
                        getHeader()
                    }
                </View> 
                <ScrollView 
                        style={{flex:1, backgroundColor:'transparent',  paddingHorizontal:0.1*screenWidth/4, paddingBottom:0}}
                        showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                    >
                    {
                    getBody()
                    }
                
                <View style={{height:51, width:300, backgroundColor:'transparent'}}></View>
                </ScrollView> 

            </View>
        </SafeAreaView> 


    );
}

ProductDetailsScreen.navigationOptions = {

    headerShown: false,
    headerMode: 'screen',
    gestureEnabled: false,
    ...TransitionPresets.ModalSlideFromRightIOS
}

/* ...TransitionPresets.ModalSlideFromBottomIOS*/