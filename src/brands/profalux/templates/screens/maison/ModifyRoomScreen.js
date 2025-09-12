import '_brand/templates/screens/maison/locales'
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector, useStore } from "react-redux";
import { useObject } from '_hooks/object';
import { getObjectsVisible, getObjectsByTypes,getAllObjects } from '_helpers/selectors';
import { difference as lodashDifference, pull as lodashPull } from 'lodash';

import { useTheme } from '_theming/themeProvider'

import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { RoomAddForm } from './components/RoomAddForm';
import Button from '_brand/templates/components/ui/Button';
import { Api } from '_api';
import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';

import { roomUpdate, roomRemoveObject } from '_actions/rooms';
import { getObjectById } from '_helpers/objects';
import { getRooms } from '_helpers/selectors';
import Toast from 'react-native-root-toast';
import {appRefresh,closeWS} from '_actions/app';
import {getObjectUriById} from '_brand/utils/tools';
 


const screenWidth = Dimensions.get('window').width;

export const ModifyRoomScreen = () => {

  const objectsTypes = useSelector(getObjectsByTypes);
  const objectsVisible = useSelector(getObjectsVisible);
  const allObjects = useSelector(getAllObjects)
  const roomData = useSelector(getRooms);

  const dispatch = useDispatch()

  const navigation = useNavigation();
  const route = useRoute();
  const store = useStore();
  const { theme } = useTheme();

  const { t, i18n } = useTranslation();
  const tns = "maison";

  const borderColor = theme?.prflxBorderColor || 'orange';
  const containerbgcolor = theme?.prflxContaintBgColor || 'white';
  const bgcolor = theme?.prflxbgColor || 'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
  const textColor = theme?.prflxTextColor || 'black'
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
  const iconColor = theme?.prflxIconColor || "#3E495E";
  const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";

  const navigationParams = route?.params || {};
  console.log("NAVIGATION PARAMS :", navigationParams);
  const { roomId, roomName, roomObjects } = navigationParams;
  const uObject = useObject(roomId);
  const renameRef = useRef(null);

  const accessibilityLabel = "Screen_MODIFYROOM";

  // STATES
  const [equipments, setEquipments] = useState([])
  const [itemsSelected, setItemsSelected] = useState(roomObjects); //initialize with present objects 
  const [itemSelectForActionStore, setItemsSelectForActionStore] = useState([]); //initialize with present objects 
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  const initialRoomObjectsList = roomObjects.map(i => Number(i));
  console.log("INITIAL ROOM OBJECTS LIST :", initialRoomObjectsList)

  const [selection, setSelection] = useState(initialRoomObjectsList)
  const [selectable, setSelectable] = useState([])
  const [defaultRoom, setdefaultRoom] = useState({});
  const [existName, setExistName] = useState("");

  // Equipments

  useEffect(() => {
    let defaultRoomData = {};
    let nameList = [];
    roomData.map((item) => {
      const nameRoom = item.name;
      nameList.push(nameRoom.toLowerCase())
      if (item.default) {
        const data = { id: item.id, name: item.name, objects: item.objects, default: item.default }
        defaultRoomData.id = item.id;
        defaultRoomData.name = item.name;
        defaultRoomData.objects = item.objects;
        defaultRoomData.default = item.default;
      }
    })
    setExistName(nameList)
    console.log("Rooms :", defaultRoomData)
    setdefaultRoom(defaultRoomData);
  }, [roomData])

  useEffect(() => {
    console.log("DEFAULT ROOM :", defaultRoom)
  }, [defaultRoom]);

  useEffect(() => {
    console.log("PRESENT ROOM OBJECTS :", itemsSelected)
  }, [itemsSelected])
  useEffect(() => {
  }, [itemSelectForActionStore])

  useEffect(() => {
    console.log("CHECK BOX VALUE :", toggleCheckBox)
  }, [toggleCheckBox])


  const roomRemoveYourObject = (selection) => {

    selection.map(objectId => {
      const objectData = getObjectById(objectId);
      const objectRoomId = objectData?.room
      const removeAction = roomRemoveObject(Number(objectRoomId), objectId.toString())
      dispatch(removeAction);
      // console.log('DISPATCH_RESULT :', dptch);
    })
  }

  const defaultRoomUpdateNewObjects = async (data) => {
    res = await Api.modifyRoom(data.id, data.name, data.objects, data.default);
    console.log("REQUETTE UPDATE DEFAULT ROOM", res)
  }


  // FUNCTIONS/CALLBACKS---------
  const handleSubmit = async (values) => {

    // compare <initialRoomObjectsList> to <selection> in order to extrat removed elements from <initialRoomObjectsList>
    // Then send those extracted elements to DEFAULT ROOM.

    // console.log('SELECTION_IN_ROOM :', selection);
    // const toRemoveFromCurrentRoom = lodashDifference(initialRoomObjectsList, selection)
    // const toAddToCurrentRoom = lodashDifference(selection, initialRoomObjectsList)

    // console.log('TO_ADD', toAddToCurrentRoom);
    // console.log('TO_REMOVE :', toRemoveFromCurrentRoom);

    // // filter default room list 
    // const defaultRoomPlus = [...new Set([...defaultRoom.objects, ...toRemoveFromCurrentRoom])];
    // const newDefaultRoomObjects = defaultRoomPlus.filter(x => !toAddToCurrentRoom?.includes(x))

    // const defaultRoomObjectsMergedWithRemoveFromCurrentRoom = [...new Set([...defaultRoom.objects, ...toRemoveFromCurrentRoom])]
    // console.log("CONTROL REMOVE ELEMENTS FROM ROOM IN MODIF :", toRemoveFromCurrentRoom, toAddToCurrentRoom, selection)

    // const data = { id: roomId, name: values.rename, objects: selection.map(i => i.toString()), default: toggleCheckBox }
    // console.log(" DATA HHHH : ", selection, toggleCheckBox)
    // const action = roomUpdate(data);
    // const updateDefaultRoomAction = roomUpdate({ ...defaultRoom, objects: newDefaultRoomObjects.map(i => i.toString()) })

    // dispatch(action);
    // console.log('ACTION_UPDATE_ROOM :', action);

    //return false;
   
    
    const selectionByUri = selection.reduce((r,v,i) => {
      // const a = getObjectUriById(allObjects,v);
      r.push({uri:getObjectUriById(allObjects,v)});
      console.log("GET_ALL_OBJECT :", r)
      return r
    },[])

    console.log("selectionByUri ====>",selectionByUri)

    
    //res = await Api.modifyRoom(roomId, values.rename, selection, toggleCheckBox);
    res = await Api.modifyRoom(roomId, values.rename, selectionByUri, toggleCheckBox);
    console.log("REQUETTE MODIFY", res)
    // res2 = await Api.modifyRoom(defaultRoom.id, defaultRoom.name,defaultRoomObjectsMergedWithRemoveFromCurrentRoom, defaultRoom.default);
    // console.log("REQUETTE MODIFY DEFAULT ROOM ", res)
    if (res.errCode == 200) {
      dispatch(appRefresh());
      // dispatch(action);
      //   if (toAddToCurrentRoom != 0) {
      //     roomRemoveYourObject(toAddToCurrentRoom)
      //   }
      //   if (toRemoveFromCurrentRoom != 0) {
      //     dispatch(updateDefaultRoomAction);
      //   }
      // console.log("REQUETTE End")
      navigation.navigate('MaisonScreen')
    }else{

      if (res.errMsg == 'room_exists') {
        let message = `${t(tns + ":" + "ROOM_EXISTS")}`
        Toast.show(
          message,
          {
            backgroundColor: 'red',
            textColor: 'white',
            textStyle: { fontSize: 16, fontWeight: '600' },
            //containerStyle:{width:'80%', height:100, justifyContent:'center', alignItems:'center', borderRadius:10, borderColor:borderColor, borderWidth:2}, 
            position: Toast.positions.CENTER,
            duration: 3000,
            onHide: () => { }
          }
        );
      }else{
        let message =`${t(tns + ":" + "SERVER_ERROR")} : ${res.errCode} ${res.errMsg}`//'Un groupe avec ce nom existe déjà'
        Toast.show(
          message,
          {
            backgroundColor: 'red',
            textColor: 'white',
            textStyle: { fontSize: 16, fontWeight: '600' },
            //containerStyle:{width:'80%', height:100, justifyContent:'center', alignItems:'center', borderRadius:10, borderColor:borderColor, borderWidth:2}, 
            position: Toast.positions.CENTER,
            duration: 3000,
            onHide: () => { }
          }
        );
      }
    }

  }

  const submitMe = async () => {
    console.log("Selected items after submit :", selection);
    renameRef.current.submitForm();
    //navigation.navigate('MaisonScreen')
  }



  const onItemClick = (id) => {
    console.log("ITEM CLICKED CALL BACK :", id, selection)

    const position = selection?.indexOf(id)
    //console.log("IN THERE :", position)

    if (position == -1) {
      setSelection([...selection, id])
    } else {
      let newSelection = [...selection]
      newSelection.splice(position, 1);
      setSelection(newSelection)
    }

  }


  const getPossibleObjects = (listClassName) => {
    const types = objectsTypes;
    const result = listClassName.reduce((r, v, i) => {
      if (types[v]) r.push(...types[v]);
      return r;
    }, [])
    return result
  }


  useEffect(() => {
    console.log("SELECTION :", selection)


    const compositeList = objectsTypes["Composite"] || [];
    const differentObjects = getPossibleObjects(["Shutter", "Light", 'Sonde', "Gate", "GarageDoor", "ToggleGate", "ToggleGarageDoor","TriggerGate"]);
    const objectsExcludeComposite = differentObjects.filter(x => !compositeList?.includes(x));
    //const objectsExcludeComposite = objectsVisible.filter(x => !compositeList?.includes(x));

    setSelectable(objectsExcludeComposite)
  }, [selection, objectsVisible])


  useEffect(() => {
    console.log("SELECTABLE :", selectable)
  }, [selectable]);



  return (

    <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} accessibilityLabel={accessibilityLabel}>
      <StatusBar no_hidden={true} barStyle="dark-content" />
      <View style={{ flex: 1, backgroundColor: 'white' }}>

        <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
          <HeaderWithBack
            //title={uObject.name}
            title={roomName}
            //titleMarginLeft = {40}
            backSVG centered
            //goBack={{ action: goGroupHomeScreen }}
            noShadow
          />
        </View>
        <ScrollView
          style={{ flex: 1, backgroundColor: 'transparent', paddingHorizontal: 5, paddingBottom: 0 }}
          showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
        >
          <View style={[styles.bodyContent, { backgroundColor: containerbgcolor, marginVertical: 20 }]}>
            <RoomAddForm
              //existingNames={existName}
              ref={renameRef}
              renameText={t(tns + ":" + "RENAME_ROOM")}
              oldName={roomName}
              handleSubmit={handleSubmit}
              //goNavigation={() => navigation.navigate('MaisonScreen')}
            />

            {/* <View style={{marginVertical:20, flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                            <Text style={{marginRight:10}}>Définir comme pièce par défaut : </Text>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                            />
                        </View> */}

            <Text style={styles.text}>{t(tns + ":" + "SELECT_EQUIP")}</Text>
            {/* <ObjectsToggleFlatList 
                                isAdd={false}
                                numColumns = {3}
                                isRedirectOnSelect = {false}
                                possibleObjects = {objectsVisible}
                                callBack ={handleReceiveDependencies}
                                selectedObjects = {itemsSelected}
                                bgColor = {iconColor}
                                iconColor = {iconBgColor}
                          /> */}
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
              <Button onPress={submitMe} altStyle title={t(tns + ":" + "MODIFY_ROOM")} titleColor='white' bgColor={iconColor} noBorder />
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
    justifyContent: 'space-evenly',
    padding: 5,
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
  },
  text: { marginVertical: 15 }
})