import '_brand/templates/screens/routines/locales'
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore, useSelector } from "react-redux";
import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';
import { useTheme } from '_theming/themeProvider'
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import Button from '_brand/templates/components/ui/Button';
import { EcoConfortAddForm } from '_brand/templates/screens/routines/screens/applicationScreen/components/EcoConfortAddForm';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { getObjectsByNames,getObjectsByTypes, getObjectsByTypeName } from '_helpers/selectors';
import { myToast } from '_brand/templates/components/ui/myToast';
import { getObjectById } from '_helpers/objects';
import {ObjectExistsWarning} from "_brand/templates/screens/routines/screens/ObjectExistsWarning"
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'
import * as ApiObjects from "_api/objects"
import * as Actions from '_actions/objects';
import { deleteEcoConfortAndRoutine } from '_brand/templates/screens/routines/services/deleteEcoConfortAndRoutine'



export const ChooseEcoConfortNameAndObjects = (props)=>{
    const navigation = useNavigation();
    const route = useRoute();
    const renameRef = useRef(null);
  
    const navParams = route?.params || {};
    const {mode, sensorId}=navParams
    console.log('NAVIGATION_PARAMETER :', mode, sensorId);
    const store = useStore();
  
    const { theme } = useTheme();
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const textColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";

    const shutters = useSelector(getObjectsByTypes)["Shutter"];
    const profalux868 = useSelector(state => getObjectsByTypeName(state, "Rolling_Shutter_Profalux")) || [];
    const groups = useSelector(state => getObjectsByTypeName(state, "composite")) || [];
    const toExclude = groups
    //const toExclude = groups.concat(profalux868); 
    const selectable = shutters.filter(x => !toExclude?.includes(x));
  
  
    const [nameExists, setNameExists] = useState(false);
    const [idForExistName, setIdForExistName] = useState(null);
    const [warning, setWarning] = useState(false);
    const [solarShutterIsSelected, setSolarShutterIsSelected] = useState(false);
  
    const { t, i18n } = useTranslation();
    const tns = "routine";
  
    const allObjectNames = useSelector(getObjectsByNames);
  
    const hasValue = (obj, value) => Object.values(obj).includes(value);
    const hasKey = (obj, key) => Object.keys(obj).includes(key);
  

    const uEcoConfort = useEcoConfort();
    const { 
      ecoConfortIdentity, setEcoConfortIdentity,onclickObjectForEcoConfort,
      ecoSelection,  ecoTargetForDelete, setEcoTargetForDelete, weeklyPlannerId, getEcoIdRef, setEcoIdRef, resetEcoConfortIdentity
          } = uEcoConfort;
  
    console.log("USE_SCENARIO_ACTION :", ecoConfortIdentity)

    useEffect(()=> {
    
    },[solarShutterIsSelected]);

  
    useEffect(() => {
    }, [selectable]);
  
    useEffect(() => {
      console.log("SELECTION:", ecoSelection)
    }, [ecoSelection]);
  
    useEffect(()=> {
    
    },[nameExists]);

      useEffect(()=> {
        console.log("ID_FOR_NAME_EXISTS_OBJECT :", idForExistName)
      },[idForExistName]);
  

    console.log("DELETE_TARGET :",ecoTargetForDelete);

  
    const goRoutinesHomeScreen = async() => {
      console.log('ECO_CONF_ON_CREATION :', ecoTargetForDelete, weeklyPlannerId);
      // if(ecoTargetForDelete){
      //     console.log('ENTRE_DELETE_PROCESS ::::::::', weeklyPlannerId);
      //     const result = await deleteEcoConfortAndRoutine(ecoTargetForDelete, weeklyPlannerId).catch((err) => console.log(err))
      //     console.log('DELETE_ECO_CONFORT_RESULT :', result);
      // }
      //console.log('RESET_ECO_CONFORT_IDENTITY :');
      resetEcoConfortIdentity(ecoConfortIdentity?.mode)
      navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
    }
  
    const submitMe = async () => {
      renameRef.current.submitForm();
    }
  
    const handleSubmit = (values) => {
        console.log('HELLO_ECO_CONFORT :', ecoConfortIdentity);
        const ecoConfortName = values?.rename
        const isNameExists = hasKey(allObjectNames,ecoConfortName)
        console.log('IS_NAME_EXISTS :', isNameExists);
        setIdForExistName(allObjectNames[ecoConfortName])
        const ecoConfortId = ecoConfortIdentity?.ecoConfortId
        if(ecoConfortId){
          console.log('ENTRE_MODIF_PROCESS ::::::::');
          if(isNameExists == false){
            setEcoConfortIdentity({...ecoConfortIdentity, ecoConfortName: ecoConfortName})
            navigation.navigate('EcoConfortDatePickerScreen')
          }else{
            if(ecoConfortIdentity?.ecoConfortName == ecoConfortName){
              setEcoConfortIdentity({...ecoConfortIdentity, ecoConfortName: ecoConfortName})
              navigation.navigate('EcoConfortDatePickerScreen');
            }else{
              setWarning(true)
            }
          }
        }else{
          console.log('ENTRE_CREATION_PROCESS ::::::::');
          if(isNameExists == false){
            console.log('ENTRE_CREATION_PROCESS_IF ::::::::');
            //const res = await createEcoConfort (ecoConfortName, mode, sensorId).catch((err) => console.log(err))
            setEcoConfortIdentity({...ecoConfortIdentity, ecoConfortName: ecoConfortName, mode: mode, sensorId: sensorId})
            navigation.navigate('EcoConfortDatePickerScreen')
            console.log('RES_CREATE_ECO_CONFORT_INTER :', res);
          }else{
            console.log('ENTRE_CREATION_PROCESS_ELSE ::::::::');
            setWarning(true)
          }
        }
    }


    const onItemClick= (id) => {
      const objectDatas = getObjectById(id);
      //const position = ecoSelection?.indexOf(id)
      const position = ecoConfortIdentity.ecoObjects?.indexOf(id)
      const isObjectConnected = objectDatas?.connected 
      const typeName = objectDatas?.typeName

      console.log('SELECTED_TYPE_NAME :', typeName);
      //"Rolling_Shutter_Profalux"

       if(isObjectConnected){
        onclickObjectForEcoConfort(id);
       }else{
        console.log("posiion !!!!!",position)
        if(position != -1) {
          onclickObjectForEcoConfort(id);
        } else {
          myToast(`${t(tns + ":" + "CANNOT_SELECT_DISCONNECTED_OBJECT")}`,null,null,1000)
        }
         
       }
    }
  
  
    const handleOnHide = ()=>{
      setIdForExistName(null)
    }

    let headerTitle;
    if(ecoConfortIdentity.ecoConfortId){
        headerTitle = ecoConfortIdentity?.ecoConfortName
    }else{
        switch(ecoConfortIdentity.mode){
            case "summer":
                headerTitle = `${t(tns + ":" + "ECOFONFORT_SUMMER")}`
                break
            case "winter":
                headerTitle = `${t(tns + ":" + "ECOFONFORT_WINTER")}`
                break
            default:
                headerTitle = `${t(tns + ":" + "ECOFONFORT_SUMMER")}`
        }
    }

    return(
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
        <StatusBar no_hidden={true} barStyle="dark-content" />
  
        <View style={{ flex: 1, backgroundColor: 'white', }}>
  
          <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
            <HeaderWithBack
              title= {headerTitle}
              backSVG centered
              goBack={{ action: goRoutinesHomeScreen }}
              noShadow />
          </View>
  
          <ScrollView style={[styles.bodyWrapper, { backgroundColor: bgcolor }]}>
            <View style={[styles.bodyContent, { marginBottom: 20,marginTop:10, backgroundColor: containerbgcolor }]}>
              <EcoConfortAddForm
                  selection={ecoConfortIdentity?.ecoObjects}
                  ref={renameRef}
                  renameText={ecoConfortIdentity.ecoConfortId ? `${t(tns + ":" + "RENAME_SCENARIO")}` : `${t(tns + ":" + "NAME_SCENARIO")}`}
                  handleSubmit={handleSubmit}
                  oldName={ecoConfortIdentity.ecoConfortId ? ecoConfortIdentity?.ecoConfortName: ""}
              />
  
              {(idForExistName && warning) && 
                 <ObjectExistsWarning 
                      itemId = {idForExistName}
                      onHide={handleOnHide}
                      article={`${t(tns + ":" + "A_ARTICLE_FEMININE")}`}
                  />
              }
  
              <Text style={[styles.text,{color:textColor}]}> {ecoConfortIdentity.ecoConfortId ? `${t(tns + ":" + "SELECT_EQUIP_TO_ADD_REMOVE")}` : `${t(tns + ":" + "SELECT_EQUIP_TO_ADD")}`}</Text>
              {profalux868?.length > 0 &&
                <Text style={[styles.text,{color:textColor, fontSize:13, fontStyle:'italic', textAlign:'center'}]}> {`${t(tns + ":" + "WARNING_ADDING_SOLAR_EQUIPMENT_ON_ECOCONFORT_MAY_AFFECT_BATERRY_CHARGE")}`}</Text>
              }
                <RenderToogleFlatList
                  numColumns={4}
                  isRedirectOnSelect={false}
                  selectable={selectable}
                  selection={ecoConfortIdentity?.ecoObjects}
                  callBack={onItemClick}
                  bgColor={iconColor}
                  iconColor={iconBgColor}
                />
              <View style={{}}>
                <Button onPress={submitMe} altStyle title={t(tns + ":" + "NEXT")} titleColor='white' bgColor={iconColor} noBorder />
              </View>
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
      padding: 5,
    },
    bodyContent: {
      flex: 1,
      justifyContent: 'center',
      padding: 5,
      borderColor: 'orange',
      borderWidth: 1,
      borderRadius: 10,
  
    },
    text: { marginVertical: 10 }
  })