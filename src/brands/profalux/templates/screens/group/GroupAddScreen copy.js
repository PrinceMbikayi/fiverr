import '_brand/templates/screens/group/locales'
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector, useStore } from "react-redux";
import { getObjectsVisible, getObjectsByTypes } from '_helpers/selectors';
import { getObjectById } from '_helpers/objects';
import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';
import { useTheme } from '_theming/themeProvider'

import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import Button from '_brand/templates/components/ui/Button';
import { Api } from '_api';
import * as Actions from '_actions/objects';
import { getGroupPossibleObject } from './utils';
import { groupUpdate, updateStatus as updateStatusAction } from '_actions/objects';

import Toast from 'react-native-root-toast';
import { GroupAddForm } from './components/GroupAddForm';

import {addObjectAction, refreshObjectAction,refreshGroup } from '_actions/asyncActions';
import { myToast } from '_brand/templates/components/ui/myToast';
import {appRefresh} from '_actions/app';


const GroupAddScreen = () => {


  const objectsTypes = useSelector(getObjectsByTypes)
  const objectsVisible = useSelector(getObjectsVisible);

  //const compositeList  useSelector(getObjectsByTypes)["Composite"]||[];
  const dispatch = useDispatch()

  const navigation = useNavigation();
  const route = useRoute();
  const store = useStore();
  
  const { t, i18n } = useTranslation();
  const tns = "group";
  
  const { theme } = useTheme();
  const textColor = theme?.prflxTextColor || 'black'
  const borderColor = theme?.prflxBorderColor || 'orange';
  const containerbgcolor = theme?.prflxContaintBgColor || 'white';
  const bgcolor = theme?.prflxbgColor || 'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
  const iconColor = theme?.prflxIconColor || "#3E495E";
  const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";


  const compositeList = useSelector(getObjectsByTypes)["Composite"] || [];
  const compositeAndWeatherList = getGroupPossibleObject(["Composite", "Weather", "Sonde", "Netatmo", "Remote", "WeeklyPlanner","GarageDoor", "Gate", "ToggleGarageDoor","ToggleGate","Application" ], objectsTypes)

  console.log("Composite and Weather list : ", compositeAndWeatherList)

  const [selection, setSelection] = useState([])
  const [selectable, setSelectable] = useState([])
  const [loading, setLoading] = useState(false);
  const renameRef = useRef(null);


  const goGroupHomeScreen = () => {

    navigation.navigate('ProfaluxGroupHomeScreen', { screen: 'ProfaluxGroupHomeScreen' });
  }


  const submitMe = async () => {
    renameRef.current.submitForm();
  }


  const handleSubmit = async (values) => {
    setLoading(true);

    let res = await Api.createAGroup(values.rename);
    console.log("REQUEST_SERVER : GROUP_CREATION", res)

    if (res.errCode == 200) {
          const newGrpId = res?.id
          // const refresh = await refreshObjectAction(newGrpId, store).catch((err) => console.log(err)); 
          // console.log('REFRESH_GROUP_0 :', refresh);
          const modifyRes = await Api.modifyAGroup(newGrpId, selection).catch((err) => console.log(err));
          console.log("REQUEST_SERVER : GROUP_MODIFY", modifyRes)
          if(modifyRes.errCode == 200){
            const resource = modifyRes?.res?.data?.resource
            const uniType = resource?.componentTypes[0]
            console.log('DATA_GROUP :', resource, uniType);


            // const updateAction = groupUpdate(newGrpId, resource);
            // dispatch(updateAction);

            // const requestAddStatus = await Api.addStatus(newGrpId, "__user_groupStatus", 'off');
            // console.log("REQUEST_SERVER : 'ADD_GROUP_STATUT", requestAddStatus)

            // if(requestAddStatus.errCode == 200){
            //   const actionCreated = updateStatusAction(newGrpId, "__user_groupStatus", "off")
            //   dispatch(actionCreated);
            //   const updateStatusRequest = await Api.updateAddedServerStatus(newGrpId,"__user_groupStatus","off");
            //   console.log("REQUEST_SERVER : 'UPDATE_GROUP_STATUT", updateStatusRequest)

            // }


            // const refresh = await refreshObjectAction(newGrpId, store).catch((err) => console.log(err)); 
            // console.log('REFRESH_GROUP_1 :', refresh);
            const refresh = await refreshGroup(newGrpId,resource, store).catch((err) => console.log(err)); 
            console.log('REFRESH_GROUP_1 :', refresh);
            setTimeout(() => {
            navigation.navigate('ProfaluxGroupHomeScreen')
            setLoading(false);
            }, 1000);
            //dispatch(appRefresh());

          }else{
            setLoading(false);
            console.log("ERROR_MODIFY_GROUP", modifyRes.errMsg)
            myToast(`${t(tns + ":" + "ERROR_MODIFY_GROUP")} : code ${modifyRes.errCode}`)
            const deleteGrp = await deleteObject(newGrpId).catch((err) => { console.log(err) });
            const action = Actions.objectDelete(idTodeleteRef.current);
            console.log('DELETE_GROUP :', deleteGrp);
            if(deleteGrp.errCode == 200){
                dispatch(action);
                navigation.navigate('ProfaluxGroupHomeScreen')
            }else{
              navigation.navigate('ProfaluxGroupHomeScreen')
            }

          }

    } else {
        setLoading(false);
        console.log("ENTERRRR", res.errMsg)

        if (res.errMsg == 'object_exists') {
          let message =`${t(tns + ":" + "GROUP_EXISTS")}`
          console.log("Group exists : ", message)
          myToast(message)
        }
    }


  }

  const [existingGroupName, setExistingGroupName] = useState([]);

  //========================================================================


  useEffect(() => {
    console.log("SELECTION :", selection)
    const id = selection?.[0];

    console.log(" GET ALL EXISTING GROUP :", compositeList)

    const availlableList = objectsVisible.filter(x => !compositeAndWeatherList?.includes(x));
    console.log("AVVVV VVVV :", availlableList, objectsVisible)

    if (id) {
      const objectData = getObjectById(id)
      console.log("ID :", id)
      console.log("OBJECT DATA :", objectData)
      const className = objectData?.className;


      let filteredList;
      if (className != undefined || objectData != undefined) {
        filteredList = availlableList.filter(x => objectsTypes[className]?.includes(x));
      }
      setSelectable(filteredList);
    }

    if (selection.length == 0) {
      setSelectable(availlableList)
    }
  }, [selection, objectsVisible])


  useEffect(()=> {
  
  },[loading]);


  useEffect(() => {
    //console.log("existingGroupName :", existingGroupName)
  }, [existingGroupName]);

  useEffect(() => {
    console.log("SELECTABLE :", selectable)
  }, [selectable]);


  const onItemClick = (id) => {

    const objectDatas = getObjectById(id)
    const isObjectConnected = objectDatas?.connected 
     if(isObjectConnected){
      const position = selection?.indexOf(id)

      if (position == -1) {
        setSelection([...selection, id])
      } else {
        let newSelection = [...selection]
        newSelection.splice(position, 1);
        setSelection(newSelection)
      }
     }else{
       myToast(`${t(tns + ":" + "CANNOT_SELECT_DISCONNECTED_OBJECT")}`)
     }

  }

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
      <StatusBar no_hidden={true} barStyle="dark-content" />

      <View style={{ flex: 1, backgroundColor: 'white', }}>

        <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
          <HeaderWithBack
            //title={uObject.name}
            title= {t(tns + ":" + "NEW_GROUP")}
            //titleMarginLeft = {40}
            backSVG centered
            goBack={{ action: goGroupHomeScreen }}
            noShadow />
          {/* <Text style={{backgroundColor:'transparent', marginLeft:-130, fontSize:20, fontWeight:'600'}}>Add new Group</Text> */}
        </View>

        <ScrollView style={[styles.bodyWrapper, { backgroundColor: bgcolor }]}>
          <View style={[styles.bodyContent, { marginBottom: 20, backgroundColor: containerbgcolor, opacity: loading ? 0.3 : 1}]}>
            <GroupAddForm
              existingNames={existingGroupName}
              selection={selection}
              ref={renameRef}
              renameText={t(tns + ":" + "GIVE_NAME_TO_GROUP")}
              handleSubmit={handleSubmit}
            //goNavigation = {()=>navigation.navigate('ProfaluxGroupHomeScreen')}
            />
            <Text style={[styles.text, {color:textColor}]}>{t(tns + ":" + "SELECT_EQUIP_FOR_GROUP")} :</Text>
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
              <Button onPress={submitMe} altStyle title={t(tns + ":" + "CREATE_GROUP")} titleColor='white' bgColor={iconColor} noBorder />
            </View>
          </View>

          {loading &&
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ marginVertical: 50 }}>
                    <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 4 }, { scaleY: 4 }] }} />
                    <Text style={{ marginTop: 60, color: textColor, fontSize: 14, fontWeight: "500" }}>{t(tns + ":" + "GROUP_CONFIGURATION_LOADING")}</Text>
                </View>
            </View>
          }
        </ScrollView>
      </View>

    </SafeAreaView>

  )
}

export default GroupAddScreen;

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
    borderWidth: 2,
    borderRadius: 10,

  },
  text: { marginVertical: 15 }
})