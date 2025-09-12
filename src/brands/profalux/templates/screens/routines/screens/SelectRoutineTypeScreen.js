import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect} from 'react';
import { Text, View, Pressable, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'
import { getObjectsByTypeName } from '_helpers/selectors';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { CardImageWithArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageWithArrow';
import { iconsJs } from '_brand/utils/iconsJs';
import CustomRoutine from '_brand/images/icons/app/profaluxIconJs/CustomRoutine'
import { useScenario } from '_brand/templates/screens/routines/hook/useScenario'
import EcoConfort from '_brand/images/icons/app/profaluxIconJs/EcoConfort'
import EcoConfortSummer from '_brand/images/icons/app/profaluxIconJs/EcoConfortSummer'
import EcoConfortWinter from '_brand/images/icons/app/profaluxIconJs/EcoConfortWinter'
import WindProtection from '_brand/images/icons/app/profaluxIconJs/WindProtection'
import WindSock from '_brand/images/icons/app/profaluxIconJs/WindSock'
import PresenceSimulation from '_brand/images/icons/app/profaluxIconJs/PresenceSimulation'
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'
import {filterAndKeepOnlyProbes} from '_brand/templates/screens/routines/utils/ecoConfortUtils'
import {RoutineEcoConfortCard} from '_brand/templates/screens/routines/screens/applicationScreen/components/RoutineEcoConfortCard'


export const SelectRoutineTypeScreen = (props) => {

  const { t, i18n } = useTranslation();
  const tns = "routine";
  const navigation = useNavigation();
  const route = useRoute();

  const navParams = route?.params || {};

  const uScenario = useScenario();
  const {resetSelection, setRoutineName, setRoutineId } = uScenario;

  const uEcoConfort = useEcoConfort();
  const { 
        ecoConfortIdentity, resetEcoConfortIdentity, setEcoConfortIdentity, updateEcoConfortAttribute
      } = uEcoConfort;
    

  const windGauges = useSelector(state => getObjectsByTypeName(state, "NetatmoWindGauge")) || [];
  const probes = useSelector(state => getObjectsByTypeName(state, "EzspProbe")) || [];
  const ezspProbes = filterAndKeepOnlyProbes(probes);
  let isSensor = ezspProbes.length != 0;

  const { theme } = useTheme();
  const nonConnectedGray = theme?.prflxNonConnectedGray || '#CCC'
  const bgcolor = theme?.prflxbgColor || 'white';
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
  const textColor = theme?.prflxTextColor || 'black'
  

  const goRoutinesHomeScreen = () => {
    navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
  }

  const handleGoMode = (id) => {
    switch (id) {
      case "hourly":
        console.log('ID_ROOT :', id);
        resetSelection([])
        setRoutineName("")
        setRoutineId()
        navigation.navigate('ChooseRoutineNameAndObjectsScreen')
        //navigation.navigate('HourlyRoutineStack', { screen: 'ChooseRoutineNameAndObjectsScreen' })
        break
      case "winter" || "summer":
          if(ezspProbes.length != 0){
            resetEcoConfortIdentity(id)
            navigation.navigate('EcoConfortSensorChoiceScreen', {mode:id})
          }else{
            navigation.navigate('EcoConfortNoSensorScreen')
          }
        break
      case "summer":
          if(ezspProbes.length!=0){
            resetEcoConfortIdentity(id)
            navigation.navigate('EcoConfortSensorChoiceScreen', {mode:id})
          }else{
            navigation.navigate('EcoConfortNoSensorScreen')
          }
        break

      case "wind":
          if(windGauges.length!=0){
            //resetEcoConfortIdentity(id)
            navigation.navigate('WindProtectionSensorChoiceScreen', {mode:id})
          }else{
            navigation.navigate('WindProtectionNoSensorScreen')
          }
        break

      default:
        console.log('Suppose to move to Application :', id);
    }
  }


  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >

      <View style={{ flex: 1, backgroundColor: 'white', }}>

        <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
          <HeaderWithBack
            title={`${t(tns + ":" + "ADD_ROUTINE")}`}//
            //title={routineId ? routineName : `${t(tns + ":" + "NEW_SCENARIO")}`}//
            backSVG centered
            goBack={{ action: goRoutinesHomeScreen }}
            noShadow />
        </View>

        <ScrollView style={[styles.bodyWrapper, { backgroundColor: bgcolor }]}>
          {/* <View >
                <Text style={styles.text}> {t(tns+":"+"CHOOSE_ROUTINE_TYPE")} </Text>
            </View> */}
          <View>
            <RoutineEcoConfortCard
              id={"hourly"}
              title={t(tns + ":" + "HOURLY_ROUTINE_TYPE_TITLE")}
              text={t(tns + ":" + "HOURLY_ROUTINE_TYPE_DESCRIPTION")}
              iconSize={40} icon={CustomRoutine} handleNavigation={handleGoMode}
              iconColor={textColor}
            />
            <RoutineEcoConfortCard
              id={"winter"}
              title={t(tns + ":" + "ECOFONFORT_WINTER")}
              text={t(tns + ":" + "ECOFONFORT_WINTER_CARD_DESCRIPT")}
              iconSize={60} 
              iconColor={textColor}
              icon={EcoConfortWinter} 
              handleNavigation={handleGoMode}
              cardBgColor={ezspProbes.length!=0 ? "white" : nonConnectedGray}
              //disabled={ezspProbes.length!=0 ? false : true}
            />
            <RoutineEcoConfortCard
              id={"summer"}
              title={t(tns + ":" + "ECOFONFORT_SUMMER")}
              text={t(tns + ":" + "ECOFONFORT_SUMMER_CARD_DESCRIPT")}
              iconSize={60} 
              iconColor={textColor}
              icon={EcoConfortSummer} 
              handleNavigation={handleGoMode}
              cardBgColor={ezspProbes.length!=0 ? "white" : nonConnectedGray}
              //disabled={ezspProbes.length!=0 ? false : true}
            />
            <RoutineEcoConfortCard 
                  iconColor={textColor}
                  id={"wind"} 
                  text={t(tns+":"+"WIND_PROTECTION")}
                  iconSize={42} icon={WindSock} handleNavigation={handleGoMode}
                  cardBgColor={windGauges.length!=0 ? "white" : nonConnectedGray}
                />
              {/* <RoutineEcoConfortCard 
                  iconColor={textColor
                  id={"simulation"} 
                  text={t(tns+":"+"PRESENCE_SIMULATION")}
                  iconSize={40} icon={PresenceSimulation} handleNavigation={handleGoMode}
                /> */}

          </View>
          <View style={{ width: '100%', height: 50 }}>

          </View>

        </ScrollView>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bodyWrapper: {
    flex: 1,
    flexDirection: 'column',
    //backgroundColor:'#EBF1F5',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },

  text: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "400",
    textAlign: 'center'
  }
})