import '_brand/templates/screens/wellcomeTour/locales'
import React from 'react';
import { View,SafeAreaView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Body } from  '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from  '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { CardImageWithArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageWithArrow';
import { useTheme } from '_theming/themeProvider';
import CalypshomeLogo from "_brand/templates/screens/addObject/images/jsComponents/CalypshomeLogo"
import {LocalizeEquipment} from '_brand/templates/screens/wellcomeTour/components/LocalizeEquipment'




export const BeginRoundScreen = () => {


    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {gatewayConnected} = navigationParams

    console.log('NAV_PARAMS :', gatewayConnected);

    const { t, i18n } = useTranslation();
    const tns = "wellcometour";

    const { theme } = useTheme();
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const bottomText = " Equipement avec telecommande portable"

      return (
        <SafeAreaView style={{height:'100%', backgroundColor:'white'}}>
            <View style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:bgcolor, paddingTop:20}}>
                <HeaderScreen title = {t(tns+":"+"DETECT_EQUIPEMENTS")} goBack={()=>navigation.goBack()}/>
                <Body style={{marginTop:20}}>
                        <View style={{marginHorizontal:15}}>
                            <CardImageWithArrow 
                                onPressNextArrow = {()=>console.log('Hello welcome Tour !')}
                                ImageJs = {CalypshomeLogo} 
                                sideText={t(tns+":"+"INSTALL_ZIGBEE_NETWORK")}
                                //bottomText={t(tns+":"+"ADD_NEW_CALYPS_BOX")}
                                withArrow = {true}
                                //imgOnly={true}
                                />
                        </View>

                        <LocalizeEquipment itemId={57875}/>
                </Body>
                
            </View>                              
        </SafeAreaView>
   
        )
};

