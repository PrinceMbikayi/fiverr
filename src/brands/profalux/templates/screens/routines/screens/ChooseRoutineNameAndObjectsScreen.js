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
import { RoutineAddForm } from '_brand/templates/screens/routines/components/RoutineAddForm';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { getObjectsByNames } from '_helpers/selectors';
import { myToast } from '_brand/templates/components/ui/myToast';
import { getObjectById } from '_helpers/objects';
import {ObjectExistsWarning} from "_brand/templates/screens/routines/screens/ObjectExistsWarning"


export const ChooseRoutineNameAndObjectsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const renameRef = useRef(null);

  const navParams = route?.params || {};
  console.log('NAVIGATION_PARAMETER :', navParams);
  const store = useStore();

  const { theme } = useTheme();
  const containerbgcolor = theme?.prflxContaintBgColor || 'white';
  const bgcolor = theme?.prflxbgColor || 'white';
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
  const iconColor = theme?.prflxIconColor || "#3E495E";
  const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";


  const [nameExists, setNameExists] = useState(false);
  const [idForExistName, setIdForExistName] = useState(null);
  const [warning, setWarning] = useState(false);

  const { t, i18n } = useTranslation();
  const tns = "routine";

  const allObjectNames = useSelector(getObjectsByNames);

  const hasValue = (obj, value) => Object.values(obj).includes(value);
  const hasKey = (obj, key) => Object.keys(obj).includes(key);


  const uScenario = useScenario();
  const { 
          onclickObject, selection, 
          selectable, setRoutineName, routineName,
          routineId, actionsByItemId, setActionsByItemId, 
          resetSelection
        } = uScenario;

  console.log("USE_SCENARIO_ACTION :", routineId)

  useEffect(() => {
  }, [actionsByItemId]);

  useEffect(() => {
  }, [selectable]);

  useEffect(() => {
    console.log("SELECTION 222:", selection)
  }, [selection]);

  useEffect(()=> {
    console.log("NAME_EXISTS :", nameExists)
  },[nameExists]);

  useEffect(()=> {
    console.log("ID_FOR_NAME_EXISTS_OBJECT :", idForExistName)
  },[idForExistName]);

  useEffect(()=> {
  
  },[warning]);



  const goRoutinesHomeScreen = () => {
    resetSelection([])
    setActionsByItemId({})
    navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
  }

  const submitMe = async () => {
    renameRef.current.submitForm();
  }

  const handleSubmit = async (values) => {
    const myRoutineName = values?.rename
    const isNameExists = hasKey(allObjectNames,myRoutineName)
    console.log('IS_NAME_EXISTS :', allObjectNames[myRoutineName]);
    setIdForExistName(allObjectNames[myRoutineName])
    if(routineId){
      if(!isNameExists){
        setRoutineName(myRoutineName)
        navigation.navigate('HourlyRoutineStack', { screen: 'EditRoutineActionsScreen' });
      }else{
        if(routineName == myRoutineName){
          setRoutineName(myRoutineName)
          navigation.navigate('HourlyRoutineStack', { screen: 'EditRoutineActionsScreen' });
        }else{
          setWarning(true)

        }
      }

    }else{
      if(!isNameExists){
        setRoutineName(myRoutineName)
        setWarning(false)
        navigation.navigate('HourlyRoutineStack', { screen: 'EditRoutineActionsScreen' });
      }else{
        setWarning(true)
        const message =`${t(tns + ":" + "OBJECT_EXISTS")}`                                 
        //myToast(message)
      }
    }

  }

  const onItemClick= (id) => {
    console.log("HANDLE ROUTINE SCREEN ITEM CLICKED CALL BACK :", id)
    const objectDatas = getObjectById(id);
    const position = selection?.indexOf(id)
    const isObjectConnected = objectDatas?.connected 
     if(isObjectConnected){
      onclickObject(id);
     }else{
      console.log("posiion !!!!!",position)
      if(position != -1) {
        onclickObject(id);
      } else {
        myToast(`${t(tns + ":" + "CANNOT_SELECT_DISCONNECTED_OBJECT")}`,null,null,1000)
      }
       
     }
  }


  const handleOnHide = ()=>{
    setIdForExistName(null)
  }
  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
      <StatusBar no_hidden={true} barStyle="dark-content" />

      <View style={{ flex: 1, backgroundColor: 'white', }}>

        <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
          <HeaderWithBack
            //title={"MY_ROUTINE"}
            title={routineId ? routineName : `${t(tns + ":" + "NEW_SCENARIO")}`}//
            backSVG centered
            goBack={{ action: goRoutinesHomeScreen }}
            noShadow />
        </View>

        <ScrollView style={[styles.bodyWrapper, { backgroundColor: bgcolor }]}>
          <View style={[styles.bodyContent, { marginBottom: 20,marginTop:10, backgroundColor: containerbgcolor }]}>
            <RoutineAddForm
                selection={selection}
                ref={renameRef}
                renameText={routineId ? `${t(tns + ":" + "RENAME_SCENARIO")}` : `${t(tns + ":" + "NAME_SCENARIO")}`}
                handleSubmit={handleSubmit}
                oldName={routineName}
            />

            {(idForExistName && warning) &&  
               <ObjectExistsWarning 
                    itemId = {idForExistName}
                    onHide={handleOnHide}
                    article={`${t(tns + ":" + "A_ARTICLE_FEMININE")}`}
                />
            }

            <Text style={styles.text}> {routineId ? `${t(tns + ":" + "SELECT_EQUIP_TO_ADD_REMOVE")}` : `${t(tns + ":" + "SELECT_EQUIP_TO_ADD")}`}</Text>
              <RenderToogleFlatList
                numColumns={4}
                isRedirectOnSelect={false}
                selectable={selectable}
                selection={selection}
                callBack={onItemClick}
                bgColor={iconColor}
                iconColor={iconBgColor}
              />
            <View style={styles.validateButton}>
              <Button onPress={submitMe} altStyle title={t(tns + ":" + "NEXT")} titleColor='white' bgColor={iconColor} noBorder />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  headerStyle: {
    justifyContent: 'center',
    alignItems: 'stretch',
    borderBottomColor: 'orange',
    borderBottomWidth: 2,
    backgroundColor: "transparent",
  },
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
  text: { marginVertical: 15 }
})