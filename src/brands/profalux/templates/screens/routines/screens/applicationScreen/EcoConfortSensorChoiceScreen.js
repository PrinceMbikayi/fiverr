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
import { SelectList } from 'react-native-dropdown-select-list'
import { getObjectById } from '_helpers/objects';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { myToast } from '_brand/templates/components/ui/myToast';
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'
import {filterAndKeepOnlyProbes} from '_brand/templates/screens/routines/utils/ecoConfortUtils'


export const EcoConfortSensorChoiceScreen = (props)=>{

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const navigation = useNavigation();
    const route = useRoute();
  
    const navParams = route?.params || {};
    const {mode}=navParams
    console.log('MODE :', navParams);

    const pictoMode = {
        "summer": EcoConfortSummer,
        "winter": EcoConfortWinter
    }

    const uScenario = useScenario();
    const {} = uScenario;

      const uEcoConfort = useEcoConfort();
      const { 
            ecoConfortIdentity, resetEcoConfortIdentity, setEcoConfortIdentity, ecoTargetForDelete, setEcoTargetForDelete,
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

    const handleOnPress =()=>{
        //setEcoTargetForDelete()
        console.log('Probe_selected :', probe);
        if(probe && probe != 'noSelection'){
            setEcoConfortIdentity({...ecoConfortIdentity, mode:mode, sensorId:probe})
            navigation.navigate('ChooseEcoConfortNameAndObjects',{mode:mode, sensorId:probe})
        }else{
            const message = `${t(tns + ":" + "SELECT_SENSOR")}`
            myToast(message)
        }
    }

    const TITLE = {
        "summer":"ECOFONFORT_SUMMER",
        "winter":"ECOFONFORT_WINTER"
    }

    const modeTextConfig = {
        "summer":{
            "role": "ECO_SUMMER_ROLE",
            "precaution": "ECO_SUMMER_PRECAUTION",
            "advantage": "ECO_SUMMER_OTHER_CONDITION_ACTION",
            "info": "ECO_SUMMER_CONFIG_MODE_INFOS"
        },
        "winter":{
            "role": "ECO_WINTER_ROLE",
            "precaution": "ECO_WINTER_PRECAUTION",
            "advantage": "ECO_WINTER_TAKE_ADVANTAGE_OF_SUN",
            "info": "ECO_WINTER_CONFIG_MODE_INFOS"
        }
    }


    return(
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
            <View style={{ flex: 1, backgroundColor: bgcolor, }}>
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title={`${t(tns + ":" + TITLE[mode])}`}//
                        backSVG centeredP
                        goBack={{ action: handleGoBack }}
                        noShadow 
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{justifyContent:'center', alignItems:'center', padding:20}} >
                        <EcoCard titlePart1={"Eco"} titlePart2={'Confort'} iconSize={33} Picto={pictoMode[mode]}/>
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + modeTextConfig[mode].role)}
                            </Text>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + modeTextConfig[mode].precaution)}
                            </Text>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + modeTextConfig[mode].advantage)}
                            </Text>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + modeTextConfig[mode].info)}
                            </Text>
                        </View>

                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:15,fontWeight:'600', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + "SELECT_DOWN_SENSOR")}
                            </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <SelectList
                                search={false}
                                setSelected={setProbe}
                                data={sensorsRef.current}
                                boxStyles={{ backgroundColor: '#EDEDED', borderRadius: 12, height: 44, width: 254 }}
                                dropdownStyles={{ backgroundColor: '#EDEDED', borderRadius: 12, width: 254 }}
                                dropdownTextStyles={{color:textColor}}
                                inputStyles={{color:textColor}}
                                placeholder={t(tns + ":" + "SENSOR")}
                            />
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:16,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + "SENSOR_OPTIMAL_PLACEMENT")}
                            </Text>
                        </View>
                        <View style={{ minWidth: 200, marginTop: 20 }}>
                            <MyButton 
                                onPress={handleOnPress} 
                                title={t(tns + ":" + "NEXT")} 
                                titleColor={probe =="noSelection"? "gray":"white"}
                            />
                        </View>

                    </View>
                    <View style={{width:'100%', height:50, backgroundColor:'transparent'}}/>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}