import '_brand/templates/screens/maison/locales'
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector, useStore } from "react-redux";
import { getObjectsVisible, getObjectsByTypes,getAllObjects } from '_helpers/selectors';
import {getObjectById} from '_helpers/objects';
import axios from 'axios';
import { useTheme } from '_theming/themeProvider'
import { getRooms } from '_helpers/selectors';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import Button from '_brand/templates/components/ui/Button';
import { Api } from '_api';
import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';
import { RoomAddForm } from './components/RoomAddForm';
import { roomUpdate, roomRemoveObject } from '_actions/rooms';
import Toast from 'react-native-root-toast';
import {appRefresh,closeWS} from '_actions/app';
import { getServer as getStoredServer } from '_services/storage';
import {getObjectUriById} from '_brand/utils/tools';

export const AddRoomScreen = () => {

  const objectsTypes = useSelector(getObjectsByTypes);
  const roomData = useSelector(getRooms);
  const objectsVisible = useSelector(getObjectsVisible);
  const allObjects = useSelector(getAllObjects)
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


  // ------ 
  const [selection, setSelection] = useState([])
  const [selectable, setSelectable] = useState([])
  const [itemsSelectedUri, setItemsSelectedUri] = useState([]);


  const [roomList, setRoomList] = useState([]);



  useEffect(() => {
    const roomsName = [];
    roomData.map((item) => {
      roomsName.push(item.name)
    })
    setRoomList(roomsName);
    console.log("Rooms :", roomsName)
  }, [roomData])

  useEffect(() => {
    console.log("Room List :", roomList)

  }, [roomList]);


  //========

  const getPossibleObjects = (listClassName) => {
    const types = objectsTypes;
    const result = listClassName.reduce((r, v, i) => {
      if (types[v]) r.push(...types[v]);
      return r;
    }, [])
    return result
  }



  const goMaisonScreen = () => {

    navigation.navigate('MaisonScreen');
    // navigation.navigate('ProfaluxGroupHomeScreen', { screen: 'ProfaluxGroupHomeScreen'});
  }


  const renameRef = useRef(null);

  // Send the request of group creation
  const submitMe = async () => {
    renameRef.current.submitForm();
    //navigation.navigate('MaisonScreen')
  }


  const roomRemoveYourObject = (selection, newRoomId)=>{

    console.log('REQUETTE FIRST 3:', "Hello function remove");
    selection.map(objectId =>{
      const objectData = getObjectById(objectId);
      console.log('REQUETTE FIRST 4:', "Hello function remove");
      const objectRoomId = objectData?.room
      console.log('REQUETTE FIRST 5:', "Hello function remove");
      // Remove each object from their previous room only
      // if(objectRoomId != newRoomId){
        const removeAction = roomRemoveObject(Number(objectRoomId), objectId.toString())
        console.log('REQUETTE FIRST 6:', removeAction);
        dispatch(removeAction);
        console.log('REQUETTE FIRST 7:', "Hello function remove");
        // }
        })
      const dispatchFinished = true;
      return dispatchFinished
  }



  const handleSubmit = async (values) => {

    const selectionByUri = selection.reduce((r,v,i) => {
      console.log(allObjects,v)
     // const a = getObjectUriById(allObjects,v);
      r.push({uri:getObjectUriById(allObjects,v)});
      return r
    },[])

    console.log("selectionByUri ====>",selectionByUri)




      //res = await Api.createRoomObject(values.rename, selection, false);
      res = await Api.createRoomObject(values.rename, selectionByUri, false);
      console.log("REQUETTE FIRST : Creaction Piece",selectionByUri, res)
      if (res.errCode == 200) {

        // // remove selected object from their previous room
        // const dispatchFinished = roomRemoveYourObject(selection)
        // console.log("REQUETTE FIRST : dispatch Finished", dispatchFinished)

        // Update new created room in store
        //if(dispatchFinished){
          // const data = { id: res.id, name: values.rename, objects: selection, default: false }
          // const action = roomUpdate(data);
          // console.log("ACTION :", action)
          // dispatch(action)
          dispatch(appRefresh());
          navigation.navigate('MaisonScreen')
        //}

      } else {
        console.log("ENTERRRR", res.errMsg)

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
          let message =`${t(tns + ":" + "SERVER_ERROR")} : ${res.errCode} ${res.errMsg}`
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



  const onItemClick = async(id) => {
    console.log("ITEM CLICKED CALL BACK :", id)

    const position = selection?.indexOf(id)
    console.log("IN THERE :", position)

    if (position == -1) {
      setSelection([...selection, id])
    } else {
      let newSelection = [...selection]
      newSelection.splice(position, 1);
      setSelection(newSelection)
    }

  }



  useEffect(() => {
    console.log("SELECTION :", selection)
    const test = getObjectById(selection[0])
    console.log("TESTTTT :", test)
    const compositeList = objectsTypes["Composite"] || [];
    const differentObjects = getPossibleObjects(["Shutter", "Light", 'Sonde', "Gate", "GarageDoor", "ToggleGate", "ToggleGarageDoor","TriggerGate"]);
    const objectsExcludeComposite = differentObjects.filter(x => !compositeList?.includes(x));

    setSelectable(objectsExcludeComposite)
  }, [selection])


  useEffect(() => {
    console.log("SELECTABLE :", selectable)
  }, [selectable]);







  return (
      <SafeAreaView style={{ height:'100%', backgroundColor: 'white' || bgcolor }} >
        <StatusBar no_hidden={true} barStyle="dark-content" />
      <View style={{flex:1, backgroundColor: 'white', }}>
        <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
          <HeaderWithBack
            //title={uObject.name}
            title={t(tns + ":" + "NEW_ROOM")}
            //titleMarginLeft = {40}
            backSVG centered
            goBack={{ action: goMaisonScreen }}
            noShadow />
          {/* <Text style={{backgroundColor:'transparent', marginLeft:-130, fontSize:20, fontWeight:'600'}}>Nouvelle pièce</Text> */}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={[styles.bodyWrapper, { backgroundColor: bgcolor, }]}>
          <View style={[styles.bodyContent, { marginBottom: 20, marginTop:10, backgroundColor: containerbgcolor/* backgroundColor:containerbgcolor */ }]}>
            <RoomAddForm
              selection={selection}
              ref={renameRef}
              placeholder={t(tns + ":" + "NAME_ROOM")}
              renameText={t(tns + ":" + "RENAME_ROOM")}
              handleSubmit={handleSubmit}
            />
            <Text style={styles.text}>{t(tns + ":" + "SELECT_EQUIP")}</Text>
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
              <Button onPress={submitMe} altStyle title={t(tns + ":" + "CREATE_ROOM")} titleColor='white' bgColor={iconColor} noBorder />
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