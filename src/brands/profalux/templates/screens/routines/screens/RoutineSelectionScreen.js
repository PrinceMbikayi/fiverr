import '_brand/templates/screens/routines/locales'
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Text, FlatList, View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'

import RoutineTemplate from '_brand/templates/screens/routines/components/RoutineTemplate';
import { getObjectsByTypeName } from '_helpers/selectors';

import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as ApiObjects from "_api/objects"
import Toast from 'react-native-root-toast';
import { SelectRoutineItem } from '_brand/templates/screens/routines/components/SelectRoutineItem'
import * as Actions from '_actions/objects';
import { appRefresh, closeWS } from '_actions/app';
import { useScenario } from '_brand/templates/screens/routines/hook/useScenario'
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'
import { useObject } from '_hooks/object';
import { getObjectById } from '_helpers/objects';
import { myToast } from '_brand/templates/components/ui/myToast';
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'
import { useWindProtection } from '_brand/templates/screens/routines/hook/useWindProtection'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'

export const RoutineSelectionScreen = (props) => {
  
  const { t, i18n } = useTranslation();
  const tns = "routine";
  const { theme } = useTheme();
  const borderColor = theme?.prflxBorderColor || 'orange';
  const textColor = theme?.prflxTextColor || 'black'
  

  const dispatch = useDispatch();
  const globalModal = useGlobalModal();  

  const navigation = useNavigation();
  const route = useRoute();
  const navParams = route?.params || {};
  const { gotask } = navParams;


  const uScenario = useScenario();
  const { routineId, setRoutineId,initEditRoutine,
        } = uScenario;

  const uEcoConfort = useEcoConfort();
  const { 
          initEditEcoConfort,ecoConfortIdentity
        } = uEcoConfort;

  const useWindProtect = useWindProtection();
  const { 
          initWindProtectionIdentity
      } = useWindProtect;

  const scenarios = useSelector(state => getObjectsByTypeName(state, "Associations")) || [];
  const application = useSelector(state => getObjectsByTypeName(state, "application")) || [];
  const scenarioAndEcoconfort = scenarios.concat(application);

  const [itemClicked, setItemClicked] = useState({nature:null, id:null});



  let routines = (scenarioAndEcoconfort.length % 2 != 1) ? scenarioAndEcoconfort : [...scenarioAndEcoconfort, 'extra'];


  const actionSheetRef = useRef(null);
  const itemClickedRef = useRef(null);

  const modalTitleColorRef = useRef("#3E495E")
  const modalToastBgColorRef = useRef("white")
  const modalBodyTextColorref = useRef("#3E495E")
  const modalToastTitleRef = useRef(t("account:WARNING"))
  const messageRef = useRef("")
  const buttonsRef = useRef([...returnButton])

  const kebabDeleteAction = () => {
    onOpenSelect()
  }

  useEffect(()=> {
    console.log('ITEM_CLICKED :', itemClicked);
  },[itemClicked]);

  const handleCallBack = async (item) => {
    const itemData = getObjectById(item)
    const typeName = itemData?.typeName
    console.log("Hello go:", itemData)
    switch(typeName){
      case "Associations":
        itemClickedRef.current = {nature:"routine", id:item}  
        initEditRoutine(item)
        setRoutineId(item)
        if (gotask == 'delete') {
          kebabDeleteAction()
        } else {
          const param = { id: item };
          navigation.navigate("ChooseRoutineNameAndObjectsScreen", param)
        }
        break;

      case "application":
        itemClickedRef.current = {nature:"ecoConfort", id:item}
        const appData = getObjectById(item)
        const activationState = appData?.statusDictionary?.__mode
        //const activationState = appData?.statusDictionary?.__status
        console.log('WARNING_APP_DELETION :', activationState);
        const appName = appData?.appName 

        if(appName == "Protection vent"){
          initWindProtectionIdentity(item)
          if(gotask == 'delete') {
            if(activationState == "on"){
                  messageRef.current = t(tns + ":" + "DEACTIVATE_APP_BEFORE_DELETING_IT")
                  buttonsRef.current = returnButton
                  openPopup()
            }else{
              kebabDeleteAction()
            }
          } else {
            navigation.navigate("ChooseWindProtectionNameAndObjects")
          }
        }
        if(appName != "Protection vent"){
          const infos = {ecoConfortId: item}
          initEditEcoConfort(infos)
          if (gotask == 'delete') {
            kebabDeleteAction()
          } else {
            const param = { id: item };
            navigation.navigate("ChooseEcoConfortNameAndObjects", param)
          }
        }


    }


  }

  const handleDelete = async () => {
    globalModal.close()
    const res = await deleteObject(itemClickedRef.current?.id).catch((err) => console.log(err));
    console.log('DELETE_ROUTINE_SERVER_RESPONSE :', res);
    if (res.errCode == 200) {
      const action = Actions.objectDelete(itemClickedRef.current?.id);
      dispatch(action);
      navigation.navigate('RoutinesHomeScreen')
    } else if (res.errCode == 403) {
      const action = { "mArgs": [{ "value": itemClickedRef.current?.id.toString(), "name": "objectId" }], "name": "REMOVE_OBJECT" }
      const requestRemoveRoutineFromPlanner = await ApiObjects.createWeeklyPlanner(action);
      console.log('DELETE_ROUTINE_REMOVE_PLANNER :', requestRemoveRoutineFromPlanner);

      if (requestRemoveRoutineFromPlanner.errCode == 200) {
        const plannerId = requestRemoveRoutineFromPlanner.id;
        const daysOfWeek = requestRemoveRoutineFromPlanner?.res?.data?.resource?.daysOfWeek
        const action = Actions.objectUpdateProperty(plannerId, 'daysOfWeek', daysOfWeek);
        dispatch(action);
        const res = await deleteObject(itemClickedRef.current?.id).catch((err) => console.log(err));
        console.log('DELETE_ROUTINE_DELETE_PASS_RESPONSE :', res);
        if (res.errCode == 200) {
          const action = Actions.objectDelete(itemClickedRef.current?.id);
          const message = `${t(tns + ":" + "SCENARIO_DELETED")}`
          //myToast(message,)
          Toast.show(
            message,
            {
              backgroundColor: 'black',
              textColor: 'white',
              textStyle: { fontSize: 16, fontWeight: '600' },
              containerStyle: { width: '80%', height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: borderColor, borderWidth: 2 },
              position: -350,
              duration: 3000,
            }
          );
          dispatch(action);
          //dispatch(appRefresh());
          navigation.navigate('RoutinesHomeScreen')
        }
      } else {
        console.log('REMOVED_ROUTINE_FROM_WEEKLYPLANNER_FAILED :', requestRemoveRoutineFromPlanner);
      }

    }

    //actionSheetRef.current?.dismiss();
  }

  const onOpenSelect = () => {  
      const content = (
        <View style={{width:'100%', height: 200}}>
          <CommonBottomSheetDeleteContent 
              nameToDelete={"la routine"} 
              warningText={`${t(tns+":"+"WARNING_DELETE")}`}
              textColor={textColor} 
              onDelete={handleDelete} 
              onCancel={onCancelPressed} 
          />
        </View>
            )
      globalModal.setContent(content,{type:'bottom'});    
      globalModal.toggle();
  }


  //???????????????????????????????????????????????????????????
      const returnButton = [
                      {
              id:"return",
              text:`${t(tns + ":" + "RETURN")}`,
              action:()=>onCancelPressed(),
              textColor:"#007AFF"
          },
      ]
      const buttons = [
          {
              id:"return",
              text:`${t(tns + ":" + "CANCEL")}`,
              action:()=>onCancelPressed(),
              textColor:"#007AFF"
          },
          {
              id:"validate",
              text:`${t(tns + ":" + "ACTIVATE")}`,
              action:()=>onValidate(),
              textColor:"#007AFF"
          }
      ]
  
    const onCancelPressed = () => {
      console.log('CANCEL_DELETE :');
      globalModal.close();
    }
    const onValidate = () => {
      onActivateDeviceBlooth()
      navigation.navigate("AddObject")
      globalModal.close();
    }

    const goPermissions=()=>{
      Linking.openSettings()
      navigation.navigate("AddObject")
      globalModal.close();
    }
  
    const openPopup = () => {  
        const content = (
          <View style={{width:"70%", backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
              <GlobalToast 
                  toastTitle={t(tns + ":" + "WARNING")}
                  toastBody={messageRef.current}
                  buttons={buttonsRef.current}
              />
          </View>
              )
        globalModal.setContent(content,{type:'centered'});    
        globalModal.toggle();
    }
  //???????????????????????????????????????????????????????????


  return (
    <RoutineTemplate onlyBack={true} title={`${t(tns + ":" + "MY_ROUTINES")}`}>
      <Text style={{ fontSize: 14, color: textColor, fontWeight: '600', marginVertical: 20, marginLeft: 5 }}>
        {gotask == "delete" ? t(tns + ":" + "SELECT_SCENARIO_DELETE") : t(tns + ":" + "SELECT_SCENARIO_MODIFY")}
      </Text>
      <FlatList
        data={routines}
        renderItem={
          ({ item, index }) => <SelectRoutineItem
            item={item}
            //iconSize={40}
            iconColor={textColor}
            callBack={() => handleCallBack(item)}
          />
        }
        keyExtractor={(item, index) => "key_" + item}
        numColumns={2}
      />
    </RoutineTemplate>

  )
};



