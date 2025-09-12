import '_brand/templates/components/objects/common/locales'
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Modal, Alert, Pressable} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';

import { iconsJs } from '_brand/utils/iconsJs';
import { EcoShuttersActionsIcons } from "_brand/templates/screens/routines/screens/applicationScreen/components/EcoShuttersActionsIcons";
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { EcoConfortWidgetIcon } from '_brand/templates/screens/routines/screens/applicationScreen/components/EcoConfortWidgetIcon';

export const EcoConfortCommonShutterDetails = (props) => {
    const { isBSO } = props;

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const route = useRoute();
    const navParams = route?.params || {};
    const {itemId,typeName} = navParams
    console.log('NAV_PARAMS :', itemId, typeName);

    const navigation = useNavigation();

    const handleOnPress=(iconId)=>{
        console.log('ON_PRESS :', iconId);
    }

    const sendCurrentActive = (id) => {
        setActive(id);
    }

    const goBack = () => {
        navigation.goBack()
      }
    
    const { theme } = useTheme();
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'

    const iconsCol1 = [
        iconsJs.favIcon,
        iconsJs.ajarIcon,
    ];
    const iconsCol2 = [
        iconsJs.upIcon,
        iconsJs.open75perIcon,
        iconsJs.open50perIcon,
        iconsJs.open25perIcon,
        iconsJs.downIcon
    ];
    const iconsCol3 = [
        iconsJs.bsoLame90degIcon,
        iconsJs.bsoLame67degIcon,
        iconsJs.bsoLame45degIcon,
        iconsJs.bsoLame22degIcon,
        iconsJs.bsoLame0degIcon,
    ]

    console.log('PICTOS :', iconsCol1, iconsCol2, iconsCol3);

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
             <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <View style={{  backgroundColor: headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title={`${t(tns + ":" + "ECOFONFORT_WINTER")}`}//
                        backSVG centeredP
                        goBack={{ action: goBack }}
                        noShadow 
                    />
                </View>

                <View style={{flex:1, margin:10, borderRadius:12, borderWidth:2, borderColor:'orange', backgroundColor:'transparent'}}>
                    <View style={[styles.topBody]}>
                            <View  style={{ marginLeft: 10, backgroundColor: 'transparent'}}>
                                <EcoConfortWidgetIcon itemId={itemId} typeName={typeName} iconSize={73} isLabelUp={false} withBorder={true}/>
                                {/* <RoutineWidgetIcon itemId={98043} iconSize={73} isLabelUp={false} withBorder={true}/> */}
                            </View>
                    </View>

                    <View style={[styles.middleBody]}>
                        <View style={{backgroundColor:lineWidgetBgColor, padding:5, borderRadius:8,marginRight:20, borderWidth:1,borderColor:textColor}}>
                            <EcoShuttersActionsIcons
                                itemId={itemId}
                                typeName={typeName}
                                iconSize={52}
                                icons={iconsCol1}
                                isPressable={true}
                                onPress={handleOnPress}
                                onLongPress={handleOnPress}
                                active={sendCurrentActive}
                                iconWrapperStyle={[styles.iconDisplay, {borderColor: textColor }]}
                                iconGroupWrapperStyle={{flexDirection:'column', borderRadius:8}}
                                isShadow={true}
                            />
                        </View>
                        <View style={{backgroundColor: lineWidgetBgColor,padding:5, borderRadius:8, borderWidth:1,borderColor:textColor}}>
                            <EcoShuttersActionsIcons
                                itemId={itemId}
                                typeName={typeName}
                                iconSize={52}
                                icons={iconsCol2}
                                isPressable={true}
                                onPress={handleOnPress}
                                onLongPress={handleOnPress}
                                active={sendCurrentActive}
                                iconWrapperStyle={[styles.iconDisplay, {borderColor: textColor }]}
                                iconGroupWrapperStyle={{flexDirection:'column', borderRadius:8}}
                                isShadow={true}
                            />
                        </View>

                        {typeName == "Venetian_Shutter_Ezsp"&&
                            <View style={{backgroundColor:lineWidgetBgColor,padding:5,borderRadius:8,marginLeft:20,borderWidth:1,borderColor:textColor}}>
                                <EcoShuttersActionsIcons
                                    iconSize={52}
                                    itemId={itemId}
                                    typeName={typeName}
                                    icons={iconsCol3}
                                    isPressable={true}
                                    onPress={handleOnPress}
                                    onLongPress={handleOnPress}
                                    active={sendCurrentActive}
                                    iconWrapperStyle={[styles.iconDisplay, {borderColor: textColor }]}
                                    iconGroupWrapperStyle={{flexDirection:'column', borderRadius:8}}
                                    isShadow={true}
                                />
                            </View>
                        }
                    </View>
                </View>
                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainBody: {
        height: '100%',
        borderRadius: 10,
        margin: 10,
    },
    bodyWrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 23,
        borderWidth: 1,
        borderRadius: 12,
    },
    topBody: {
        backgroundColor: 'transparent',
        justifyContent:'center',
        marginTop:20,
        alignItems: 'flex-start',
    },
    middleBody: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 31,
        padding: 5,
    },
    iconDisplay: {
        margin: 10,
        borderWidth: 1,
        borderRadius: 7,
    },
    groupIconWrapper: {

        marginHorizontal: 12.5,
        borderRadius: 12,
        borderWidth: 1,
        // marginBottom:100

    },
    textStyle: {
        marginTop: 2,
        fontSize: 18,
    },

});