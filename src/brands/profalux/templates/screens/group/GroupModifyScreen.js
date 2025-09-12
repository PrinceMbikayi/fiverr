import '_brand/templates/screens/group/locales'
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useObject } from '_hooks/object';
import { getObjectsByTypes, getLoadedObjects } from '_helpers/selectors';
import { getObjectById } from '_helpers/objects';
import { RenameObject } from '_brand/templates/components/objects/common/RenameObject';
import Button from '_brand/templates/components/ui/Button';
import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';
import { Api } from '_api';
import * as Durin from '_api/durin';
import { useTheme } from '_theming/themeProvider'
import * as Actions from '_actions/objects';
import { refreshObjectAction } from '_actions/asyncActions';
import ScreenContainer from '_brand/templates/components/objects/shutters/components/ScreenContainer';
import Toast from 'react-native-root-toast';
import { myToast } from '_brand/templates/components/ui/myToast';



const { width } = Dimensions.get('window')
import { getGroupPossibleObject } from './utils';

const GroupModifycreen = () => {

  const store = useStore()
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const navigationParams = route?.params || {};

  const { t, i18n } = useTranslation();
  const tns = "group";

  //console.log("NAVIGATION PARAMS :", navigationParams);
  const { itemPicked: groupId } = navigationParams;
  const uGroup = useObject(groupId);
  const { name: groupName, ComponentsTypes: componentsTypes } = uGroup?.objectDatas || {}
  const renameRef = useRef(null);
  const objectClassName = uGroup?.objectDatas?.className
  console.log("Group data : ", uGroup);
  //const oldName = uGroup?.name;

  const nameFlagRef = useRef(false)

  console.log("XXXXXXXXXXXX")
  const getGroupDependencies = () => {
    console.log('YYYYYYYY', uGroup?.objectDatas)
    const retrieveComponents = uGroup?.objectDatas?.components || []
    const result = retrieveComponents.reduce((r, v, i) => {
      r.push(Number(v))
      return r;
    }, [])
    return result;
  }


  const objectsTypes = useSelector(getObjectsByTypes);// get all objects groupped by typeName
  const loadObjects = useSelector(getLoadedObjects);
  console.log("OBJECTS VISIBLE :", objectsTypes)

  //========
  const [selection, setSelection] = useState(getGroupDependencies())
  const [selectable, setSelectable] = useState([])
  const [existingName, setExistingName] = useState("")
  const [existingObjects, setExistingObjects] = useState([]);
  const composites = objectsTypes["Composite"] || [];


  useEffect(() => {
    console.log("SELECTION :", selection)
    const id = selection?.[0];
    const compositeList = objectsTypes["Composite"] || [];
    console.log('JE SUIS GROUP MODIFY :')
    const availlableList = getGroupPossibleObject(["Shutter", "Light", "Gate", "GarageDoor", "ToggleGate", "ToggleGarageDoor"], objectsTypes).filter(x => !compositeList?.includes(x));

    if (id) {
      const objectData = getObjectById(id)
      console.log("ID :", id)
      console.log("OBJECT DATA :", objectData)
      const { className } = objectData

      const filteredList = availlableList.filter(x => objectsTypes[className]?.includes(x));
      setSelectable(filteredList);
    }
  }, [selection])


  useEffect(() => {
    let grpInServer = [];
    composites.map(item => {
      const objData = getObjectById(item)
      if (item != groupId) {
        grpInServer.push({ id: item, name: (objData?.name).toLowerCase() })
      }
    })
    console.log("OBJ_DATA :", grpInServer)
    setExistingObjects(grpInServer)

  }, [composites])

  useEffect(() => {
    console.log("LOADED :", loadObjects)
  }, [loadObjects])


  const handleSubmit = async (values) => {

    const res1 = await uGroup.rename(values.rename).catch((err) => console.log(err));
    console.log("MODIFY_RENAME_RESPONSE", res1, uGroup)

    if(res1.errCode == 200){

        const action1 = Actions.objectUpdateProperty(groupId, 'name', values.rename);
        dispatch(action1);
        // Not allow to remove all elements in a group
        const res2 = await Api.modifyAGroup(groupId, selection).catch((err) => console.log(err));
        console.log('MODIFY_GROUP :', res2);
        if(res2.errCode == 200){
          console.log("MODIFY_OBJECTS_RESPONSE", res2);
          const action2 = Actions.updateRDependenciesHarold(groupId, selection);
          dispatch(action2);
          refreshObjectAction(groupId, store).catch((err) => console.log(err));
          //dispatch(updateRDependencies (toAdd,toRemove,groupId,'groups'));
          navigation.navigate('ProfaluxGroupHomeScreen');
        }else{
          console.log('GET_IN');
          let message =`${t(tns + ":" + "SERVER_ERROR")} : ${res2.errCode} ${res2.errMsg}`//'Un groupe avec ce nom existe déjà'
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

    }else if(res1.errCode == 400){
      
      if(res1.errMsg == 'object_exists'){
        let message = `${t(tns + ":" + "GROUP_EXISTS")}` //'Un groupe avec ce nom existe déjà'
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
        let message = `${t(tns + ":" + "SERVER_ERROR")} : ${res1.errCode} ${res1.errMsg}`;
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

  const submitMe = () => {
    renameRef.current.submitForm();
    //navigation.navigate('ProfaluxGroupHomeScreen',{flag:true});
    //navigation.navigate('productsScreen');
    //navigation.goBack()
  }


  const { theme } = useTheme();

  const borderColor = theme?.prflxBorderColor || 'orange';
  const containerbgcolor = theme?.prflxContaintBgColor || 'white';
  const bgcolor = theme?.prflxbgColor || 'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
  const textColor = theme?.prflxTextColor || 'black'
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
  const iconColor = theme?.prflxIconColor || "#3E495E";
  const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";

  const goBack = () => {

    navigation.goBack();
  }

  const onItemClick = (id) => {
    console.log("MODIFY PLUS GROUP ITEM CLICKED CALL BACK :", id)
    const objectDatas = getObjectById(id);
    const position = selection?.indexOf(id)
    const isObjectConnected = objectDatas?.connected 
     if(isObjectConnected){
     

      if (position == -1) {
        setSelection([...selection, id])
      } else {
        let newSelection = [...selection]
        newSelection.splice(position, 1);
        setSelection(newSelection)
      }
     }else{
      console.log("posiion !!!!!",position)
      if(position != -1) {
        let newSelection = [...selection]
        newSelection.splice(position, 1);
        setSelection(newSelection)
      } else {
        myToast(`${t(tns + ":" + "CANNOT_SELECT_DISCONNECTED_OBJECT")}`)
      }
       
     }

  }


  return (
    <ScreenContainer headerTitle={groupName}>

      <ScrollView style={[styles.bodyWrapper, { backgroundColor: bgcolor }]}>
        <View style={[styles.bodyContent, { backgroundColor: containerbgcolor }]}>
          <RenameObject
            //existingNames={existingName}
            //existingObjects={existingObjects}
            itemId={groupId}
            ref={renameRef}
            renameText={t(tns + ":" + "RENAME_GROUP")}
            oldName={groupName}
            placeholder={t(tns + ":" + "NAME_GROUP")}
            handleSubmit={handleSubmit}
            selection={selection}
            goNavigation={() => navigation.navigate('ProfaluxGroupHomeScreen', { flag: true })}
          />
          <Text style={[styles.text, {color:textColor, marginVertical: 15 }]}> {t(tns + ":" + "SELECT_EQUIPS")}</Text>
          <RenderToogleFlatList
            isAdd={false}
            isRedirectOnSelect={false}
            objectId={groupId}
            selectable={selectable}
            callBack={onItemClick}
            selection={selection}
            bgColor={iconColor}
            iconColor={iconBgColor}
            numColumns={4}
          />
          <View style={styles.validateButton}>
            <Button onPress={submitMe} altStyle titleColor='white' title={t(tns + ":" + "MODIFY_GROUP")} bgColor={textColor} noBorder />
          </View>
          {/* <View style={styles.validateButton}>
            <Button onPress={handleDouble} altStyle titleColor='white' title='tester les doublures' bgColor={textColor} noBorder />
          </View> */}
        </View>
      </ScrollView>
    </ScreenContainer>

  )
}

export default GroupModifycreen;

const styles = StyleSheet.create({
  headerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'orange',
    borderBottomWidth: 2,
    height: '6%',
    backgroundColor: "red"
  },
  bodyWrapper: {
    flex: 1,
    flexDirection: 'column',
    //backgroundColor:'#d5e0e4',
    //padding:10,
  },
  bodyContent: {
    flex: 1,
    justifyContent: 'space-evenly',
    padding: 5,
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
    //width:width*0.94,
    marginVertical: 10
    //backgroundColor:'#87bc87'
  }
})