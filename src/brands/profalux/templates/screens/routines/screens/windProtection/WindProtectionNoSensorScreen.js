import '_brand/templates/screens/routines/locales'
import React from 'react';
import { Text, View, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider'
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import WindSock from '_brand/images/icons/app/profaluxIconJs/WindSock'


export const WindProtectionNoSensorScreen = (props)=>{

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const navigation = useNavigation();
  
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'


    const handleGoBack = () => {
        navigation.goBack()
        //navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
      }

    const handleBack =()=>{
        navigation.navigate('SelectRoutineTypeScreen')
    }


    return(
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
            <View style={{ flex: 1, backgroundColor: bgcolor, }}>
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title={`${t(tns + ":" + "WIND_PROTECTION")}`}//
                        backSVG centeredP
                        goBack={{ action: handleGoBack }}
                        noShadow 
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{justifyContent:'center', alignItems:'center', padding:20}} >
                         <EcoCard titlePart1={"Protection"} titlePart2={'vent'} fontSize ={14} iconSize={33} Picto={WindSock}/>
                        <View style={{marginTop:40}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + "WIND_PROTECTION_ROLE")}
                            </Text>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" +"WIND_PROTECTION_PRECAUTION")}
                            </Text>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + "WIND_PROTECTION_CONFIGURATION_REQUIREMENT")}
                            </Text>
                        </View>

                        <View style={{marginTop:20,}}>
                            <CardImageArrow 
                                    disabled={true}
                                    borderWidth = {250}
                                    withNextArrow = {false}
                                    justiMyContent = {'center'}
                                    imgStyle = {{width: 150, height:150,marginBottom:10}}
                                    imageSource = {require('_brand/templates/screens/addObject/images/windGauge.png')}
                                    innerWidthPercent={'100%'}
                            />
                        </View>

                        <View style={{ minWidth: 200, marginTop: 20 }}>
                            <MyButton 
                                onPress={handleBack} 
                                title={t(tns + ":" + "BACK")} 
                                titleColor={"white"}
                            />
                        </View>

                    </View>
                    <View style={{width:'100%', height:50, backgroundColor:'transparent'}}/>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}