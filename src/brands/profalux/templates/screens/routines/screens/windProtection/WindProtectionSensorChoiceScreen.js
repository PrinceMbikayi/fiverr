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
import WindSock from '_brand/images/icons/app/profaluxIconJs/WindSock'
import { SelectList } from 'react-native-dropdown-select-list'
import { getObjectById } from '_helpers/objects';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { myToast } from '_brand/templates/components/ui/myToast';
import { useWindProtection } from '_brand/templates/screens/routines/hook/useWindProtection'



export const WindProtectionSensorChoiceScreen = (props)=>{

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const navigation = useNavigation();
    const route = useRoute();
  
    // const navParams = route?.params || {};
    // const {mode}=navParams
    // console.log('MODE :', navParams);


      const useWindProtect = useWindProtection();
      const { 
        windProtectionIdentity, setWindProtectionIdentity, resetWindProtectionIdentity
          } = useWindProtect;

    const windGauges = useSelector(state => getObjectsByTypeName(state, "NetatmoWindGauge")) || [];
    const sensorsRef = useRef(getSensors(windGauges));
    console.log('PROBES :', windGauges);

    const [windGauge, setWindGauge] = useState("noSelection");

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'

    function getSensors(list){
        let mySensors = []
        list.map((item) => {
            const sensorData = getObjectById(item);
            const windSpeed = sensorData?.statusDictionary?.wind_speed
            const speedDisplay = (windSpeed != undefined) ? `- ${windSpeed} km/h` : ""
            console.log('PROBE_DATA :', windSpeed);
            mySensors.push({ key: sensorData?.id, value: `${sensorData?.name} ${speedDisplay}`})
        })
        return mySensors
    }

    useEffect(()=> {
        sensorsRef.current = getSensors(windGauges)
    },[windGauges]);

    const handleGoBack = () => {
        navigation.goBack()
        //navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
      }

    const handleOnPress =()=>{
        //setEcoTargetForDelete()
        console.log('WindGauge_selected :', windGauge);
        if(windGauge && windGauge != 'noSelection'){
            //setEcoConfortIdentity({...ecoConfortIdentity, mode:mode, sensorId:windGauge})
            resetWindProtectionIdentity(windGauge)
            // setWindProtectionIdentity(
            //     {
            //         ...windProtectionIdentity,
            //         probe: windGauge,
            //     }
            // )
            navigation.navigate('ChooseWindProtectionNameAndObjects',{sensorId:windGauge})
        }else{
            const message = `${t(tns + ":" + "SELECT_SENSOR")}`
            myToast(message)
        }
    }

    const TITLE = {
        "wind":"WIND_PROTECTION"
    }

    const modeTextConfig = {
        "wind":{
            "role": "WIND_PROTECTION_ROLE",
            "precaution": "WIND_PROTECTION_PRECAUTION",
            "sensor": "SELECT_WIND_SENSOR",
        }
    }


    return(
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
            <View style={{ flex: 1, backgroundColor: bgcolor, }}>
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title={`${t(tns + ":" + TITLE["wind"])}`}//
                        backSVG centeredP
                        goBack={{ action: handleGoBack }}
                        noShadow 
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{justifyContent:'center', alignItems:'center', padding:20}} >
                        <EcoCard titlePart1={"Protection"} titlePart2={'vent'} fontSize ={14} iconSize={33} Picto={WindSock}/>
                        <View style={{marginTop:30}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + modeTextConfig["wind"].role)}
                            </Text>
                        </View>
                        <View style={{marginTop:20}}>
                            <Text style={{fontSize:15,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + modeTextConfig["wind"].precaution)}
                            </Text>
                        </View>

                        <View style={{marginTop:30}}>
                            <Text style={{fontSize:15,fontWeight:'600', textAlign:'center',color:textColor}} >
                            {t(tns + ":" + modeTextConfig["wind"].sensor)}
                            </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <SelectList
                                search={false}
                                setSelected={setWindGauge}
                                data={sensorsRef.current}
                                boxStyles={{ backgroundColor: '#EDEDED', borderRadius: 12, height: 44, width: 254 }}
                                dropdownStyles={{ backgroundColor: '#EDEDED', borderRadius: 12, width: 254 }}
                                dropdownTextStyles={{color:textColor}}
                                inputStyles={{color:textColor}}
                                placeholder={t(tns + ":" + "SENSOR")}
                            />
                        </View>

                        <View style={{ minWidth: 200, marginTop: 40 }}>
                            <MyButton 
                                onPress={handleOnPress} 
                                title={t(tns + ":" + "NEXT")} 
                                titleColor={windGauge =="noSelection"? "gray":"white"}
                            />
                        </View>

                    </View>
                    <View style={{width:'100%', height:50, backgroundColor:'transparent'}}/>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}