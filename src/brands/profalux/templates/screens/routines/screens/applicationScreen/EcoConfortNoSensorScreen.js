import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect, useRef} from 'react';
import { Text, View, Pressable, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'
import { getObjectsByTypeName } from '_helpers/selectors';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { CardImageWithArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageWithArrow';
import {iconsJs} from '_brand/utils/iconsJs';
import CustomRoutine from '_brand/images/icons/app/profaluxIconJs/CustomRoutine'
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import EcoConfortWinter from '_brand/images/icons/app/profaluxIconJs/EcoConfortWinter'
import EcoConfortSummer from '_brand/images/icons/app/profaluxIconJs/EcoConfortSummer'
import EcoConfort from '_brand/images/icons/app/profaluxIconJs/EcoConfort'
import { SelectList } from 'react-native-dropdown-select-list'
import { getObjectById } from '_helpers/objects';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { myToast } from '_brand/templates/components/ui/myToast';
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'
import {filterAndKeepOnlyProbes} from '_brand/templates/screens/routines/utils/ecoConfortUtils'
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';


export const EcoConfortNoSensorScreen = (props)=>{

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const navigation = useNavigation();
    const route = useRoute();
  
    const navParams = route?.params || {};
    const {mode}=navParams
    console.log('MODE :', navParams);

    const pictoMode = {
        "summer": EcoConfortSummer,
        "winter": EcoConfortWinter,
        "blank": EcoConfort
    }

    const uScenario = useScenario();
    const {} = uScenario;

      const uEcoConfort = useEcoConfort();
      const { 
            ecoConfortIdentity, resetEcoConfortIdentity, setEcoConfortIdentity, updateEcoConfortAttribute
          } = uEcoConfort;

    const probes = useSelector(state => getObjectsByTypeName(state, "EzspProbe")) || [];
    const ezspProbes = filterAndKeepOnlyProbes(probes);
    const sensorsRef = useRef(getSensors(ezspProbes));
    console.log('PROBES :', ezspProbes);

    const [probe, setProbe] = useState("noSelection");

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'

    function getSensors(list){
        let mySensors = []
        list.map((item) => {
            const probeData = getObjectById(item);
            console.log('PROBE_DATA :', probeData);
            const temp = probeData?.statusDictionary?.temperature
            const ilum = probeData?.statusDictionary?.illuminance
            mySensors.push({ key: probeData?.id, value: `${probeData?.name} : ${temp}°C - ${ilum} lux`})
        })
        return mySensors
    }

    useEffect(()=> {
        sensorsRef.current = getSensors(ezspProbes)
    },[probes]);

    const handleGoBack = () => {
        navigation.goBack()
        //navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
      }

    const handleBack =()=>{
        navigation.navigate('SelectRoutineTypeScreen')
    }

    const TITLE = {
        "summer":"ECOFONFORT_SUMMER",
        "winter":"ECOFONFORT_WINTER"
    }


    return(
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
            <View style={{ flex: 1, backgroundColor: bgcolor, }}>
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title={`${t(tns + ":" + "ECOFONFORT")}`}//
                        backSVG centeredP
                        goBack={{ action: handleGoBack }}
                        noShadow 
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{justifyContent:'center', alignItems:'center', padding:20}} >
                        <EcoCard titlePart1={"Eco"} titlePart2={'Confort'} iconSize={33} Picto={pictoMode["blank"]}/>
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + "ECOCONF_ROLE")}
                            </Text>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" +"ECOCONFORT_DESCRIPT")}
                            </Text>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + "ECOCONFORT_ACTIVATION_REQUIREMENT")}
                            </Text>
                        </View>

                        <View style={{marginTop:20}}>
                            <CardImageArrow 
                                    disabled={true}
                                    borderWidth = {250}
                                    withNextArrow = {false}
                                    imgStyle = {{width: 130, height:205,marginLeft:0}}
                                    imageSource = {require('_brand/templates/screens/addObject/images/profaluxSensor.png')}
                                    //imageSource = {require('_brand/templates/screens/addObject/images/capteurRougeFixe.png')}
                                    innerWidthPercent={'70%'}
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