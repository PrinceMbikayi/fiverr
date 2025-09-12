import '_brand/templates/screens/addObject/locales'
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
import CalypshomeBox from "_brand/templates/screens/addObject/images/jsComponents/CalypshomeBox"
import RoxNeosol from '_brand/images/icons/app/profaluxIconJs/RoxNeosol'



export const CalypshomeBoxHomeScreen = () => {


    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {gatewayConnected} = navigationParams

    console.log('NAV_PARAMS :', gatewayConnected);

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const bottomText = " Equipement avec telecommande portable"

      return (
        <SafeAreaView style={{height:'100%', backgroundColor:'transparent'}}>
            <View style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:bgcolor, paddingTop:20}}>
                <HeaderScreen title = {t(tns+":"+"ADD_CALYPS_BOX")} goBack={()=>navigation.goBack()}/>
                <Body style={{marginTop:20}}>
                    {gatewayConnected &&
                        <View style={{marginHorizontal:15}}>

                            <CardImageWithArrow 
                                onPressNextArrow = {()=>navigation.navigate('InstallZigbeeNetworkScreen')}
                                ImageJs = {CalypshomeLogo} 
                                imgWidth={110}
                                imgHeight={80}
                                sideTextBoxWidth={200}
                                sideText={t(tns+":"+"INSTALL_ZIGBEE_NETWORK")}
                                //bottomText={t(tns+":"+"ADD_NEW_CALYPS_BOX")}
                                withArrow = {true}
                                //imgOnly={true}
                                />
                        </View>
                    }
                </Body>
                
            </View>                              
        </SafeAreaView>
   
        )
};

