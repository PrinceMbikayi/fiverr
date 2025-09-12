import '_brand/templates/components/objects/common/locales'
import React, { useState, useRef, useEffect } from 'react';
import { Text, View,StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector,useDispatch, useStore } from 'react-redux';
import { useObject } from '_hooks/object';
import { useNavigation, useRoute } from '@react-navigation/native';
import {difference as lodashDifference, pull as lodashPull} from 'lodash';

import ScreenContainer from './ScreenContainer';

import Button from '_brand/templates/components/ui/Button';
import { RenameObject } from '_brand/templates/components/objects/common/RenameObject';
import { RoomSelection } from '_brand/templates/components/objects/common/RoomSelection';
import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';
import {updateObjectRoom} from '_api/objects'
import * as Actions from '_actions/objects';
import { Api } from '_api';
import {getObjectsByTypes} from '_helpers/selectors';
import { getRooms, getRoomById} from '_helpers/selectors';
import {getObjectById} from '_helpers/objects';
import { TypagePlug } from '_brand/templates/components/objects/plug/components/TypagePlug'
import {filterGroupsToRetain} from '_brand/templates/components/objects/common/utils/filterGroupsToRetain'
import {appRefresh,closeWS} from '_actions/app';
import { myToast } from '_brand/templates/components/ui/myToast';


export const CommonObjectSettings = (props) => {
    const {newAddedItemId, goHome, noHeader=false, nameText, noGroup, changeWifiSettings} = props;
    // Recover props: typeName and itemId from navigation params
    const renameRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();

    const { t, i18n } = useTranslation(); 
    const tns = "common";


    const dispatch = useDispatch();
    const store = useStore()
    const navigationParams = route?.params || {}; 
    const { typeName, itemId } = navigationParams;
    
    // Get Shutter Object
    const id = newAddedItemId || itemId;
    console.log("NAVIGATION PARAMS :", typeName, itemId);
    //const id = itemId;
    const uObject = useObject(id);
    const oldName = uObject?.name;
    const objectClassName = uObject?.objectDatas?.className
    //console.log("NEW_ADDED_OBJECT :", "itemId :", itemId, "newAddedId :", newAddedItemId, "definedId :", id, "uObject :", objectClassName, uObject);
    console.log("NEW OBJECT  ITEM ID : ", uObject);

    const initialSelectionRef = useRef(null)


    const getObjectDependenciesGroup = (uObject) => {
       console.log("HERE XXX")
        const dependencies = uObject?.widgetReferenceDatas?.rdependencies?.['groups'];
        console.log("DEPPPPPSSS :", dependencies)
        if (!dependencies?.length) return [];
        const groupIds = dependencies?.reduce((r, v, i) => {
          const id = (v.uri + "").split("/").pop();
          r.push(Number(id));
          return r
        }, [])
        console.log("GROUPS ID :", groupIds)
        initialSelectionRef.current = groupIds;
        return groupIds
      }



      const objectsTypes = useSelector(getObjectsByTypes);// get all objects groupped by typeName
    const groupsVisible = useSelector(getObjectsByTypes)["Composite"]||[];

    const [selection, setSelection] = useState(getObjectDependenciesGroup(uObject))
    const [selectable, setSelectable] = useState([])


    useEffect(()=> {

        let toRetain;

        switch (objectClassName) {
            case 'Light':
              toRetain = filterGroupsToRetain(groupsVisible, ['LightEzsp', 'SwitchEzsp']) 
              break;

            case 'Shutter':
                const TYPES_SHUTTER = ['Rolling_Shutter_Ezsp', 'Rolling_Shutter_Profalux', 'Venetian_Shutter_Ezsp', 'Shade_Ezsp']
                toRetain = filterGroupsToRetain(groupsVisible, TYPES_SHUTTER) 
              break;

            case 'TriggerGate':
                toRetain = filterGroupsToRetain(groupsVisible, ['SesameGate']) 
              break;

            case 'ToggleGarageDoor':
                toRetain = filterGroupsToRetain(groupsVisible, ['Garage_Door_Toggle_Ezsp']) 
              break;

            case '"GarageDoor"':
                toRetain = filterGroupsToRetain(groupsVisible, ['"Garage_Door_Ezsp"']) 
              break;

            case 'Gate':
                toRetain = filterGroupsToRetain(groupsVisible, ['Gate_Ezsp']) 
              break;

            case '"ToggleGate"':
                toRetain = filterGroupsToRetain(groupsVisible, ['"Gate_Toggle_Ezsp"']) 
              break;

            default:
              console.log(`Sorry, view your source code`);
          }

          // get intersection in order to set selectable group list
          const filteredGroup = groupsVisible.filter(id => toRetain?.includes(id));
          setSelectable(filteredGroup)



    },[]);
  
    


    //-----------------Get existing goups-----------------------------


    // Get ROOMS FROM STORE
    const [room, setRoom] = useState("");
    const [currentObjectRoomId, setCurrentObjectRoomId] = useState(uObject?.objectDatas?.room);
    const data = [];
    const roomData = useSelector(getRooms);
    roomData.map((item) => {
        data.push({ key: item.id, value: item.name });
    })

    const currentRoom =  useSelector(state => getRoomById(state, Number(currentObjectRoomId)));
    useEffect(() => {
        console.log("DATA ++:", roomData)
    },[currentObjectRoomId, room]);
    //-------------------------------------------------------------








    const submitMe = (values) => {
        console.log("ROMS :", room)
        renameRef.current.submitForm();
        //navigation.navigate(goHome ||'ProductDetails', { 'typeName': uObject?.objectDatas?.typeName, itemId: itemId });
    }


    const processAGroup = (groupId,itemId, delOrAdd)=>{
        const groupDatas = getObjectById(groupId);
        console.log("GROUP DATA :", groupDatas);
        const currentComponents = groupDatas?.components
        let newComponents = [...currentComponents];
        if(delOrAdd == 'delete'){
            const position = newComponents?.indexOf(itemId.toString());
            newComponents.splice(position, 1);
        }

        if(delOrAdd == 'add'){
            newComponents.push(itemId.toString())
        }
        return {groupId:groupId, components:newComponents}
    }

    const processARoom = (objectId, oldRoomId, newRoomId)=>{
        const oldRoomData = getRoomById(oldRoomId);
        //const newRoomData = getRoomById(newRoomId);
        console.log("ROOM +++ CHECK METHOD OUTPUT :", objectId, oldRoomData,room)
    }


    const updateObject = async (values) => {

        if(typeName == 'SwitchEzsp'){
            uObject?.addStatus("__user_pluglight",habillage);
            uObject?.updateStatus('__user_pluglight',habillage);
        }

        const renameResponse = await uObject.rename(values.rename).catch((err)=>console.log(err));
        console.log("Rename Async worked", renameResponse)

        if(renameResponse?.errCode == 200){
            const action1 = Actions.objectUpdateProperty(id,'name',values.rename);
            dispatch(action1);

            navigation.navigate(goHome ||'ProductDetails', { 'typeName': uObject?.objectDatas?.typeName, itemId: itemId });
            // request update Room
            const updateRoomResponse = await updateObjectRoom(id, room).catch((err) => console.log(err));
            console.log('CHECK_FOR_UPDATE_ROOM :', updateRoomResponse);

            if(updateRoomResponse?.errCode == 200){
                const action2 = Actions.objectUpdateProperty(id,'room',room);
                console.log("UPDATE ROOM ID :", room)
                dispatch(action2);
                dispatch(appRefresh())

                // Process to group modification
                let groupsToModify = [];
                const toDelete = lodashDifference(initialSelectionRef.current, selection)
                const toAdd = lodashDifference(selection, initialSelectionRef.current )
        
                toDelete.map((idgrp)=>{
                    groupsToModify.push(processAGroup(idgrp,id,  'delete'))
                })
        
                toAdd.map((idgrp)=>{
                    groupsToModify.push(processAGroup(idgrp,id,  'add'))
                })
        
                groupsToModify.map(async(item)=>{
                    const actionStore = Actions.updateRDependenciesHarold(item.groupId,item.components);
                    dispatch(actionStore);
                    console.log('UPDATE_GROUP_BEFORE_REQUEST :', item.groupId);
                    const result = await Api.modifyAGroup(item.groupId,item.components).catch((err) => console.log(err));
                    console.log('UPDATE_GROUP_RESPONSE :', result);
                    console.log(`Update Group ${item.groupId} Async worked`, result);
                    //refreshObjectAction(id,store).catch((err) => console.log(err)); 
                })


                //navigation.navigate(goHome ||'ProductDetails', { 'typeName': uObject?.objectDatas?.typeName, itemId: itemId });
                const objectAction = Actions.updateRDependenciesObjectHarold(id, selection);
                dispatch(objectAction);
                dispatch(appRefresh());
  
            }

        }else{
            let message;
            const errMsg =  renameResponse?.errMsg
            const errCode =  renameResponse?.errCode
            if(errMsg == "object_exists"){
                message =`${t(tns + ":" + "OBJECT_EXISTS")}`                                 
            }else{
                message =`${t(tns + ":" + "SERVER_ERROR")} : ${renameResponse?.errCode} ${renameResponse?.errMsg}`
            }
            myToast(message)
            console.log('ERROR_CODE_MODIFY_OBJECT :', renameResponse?.errCode);
        }




    }


    //========================================================================
useEffect(()=>{
    console.log("SELECTION :", selection)
    const id = selection?.[0];
    const compositeList = objectsTypes["Composite"]||[]; 
    //const availlableList = getGroupPossibleObject(["Shutter", "Light","Gate", "GarageDoor", "ToggleGate", "ToggleGarageDoor"],objectsTypes).filter(x => !compositeList?.includes(x));
  
    if(selection.length == 0){
      //setSelectable(availlableList)
    }
  },[selection])
  
  useEffect(()=> {
    console.log("SELECTABLE :", selectable)
  },[selectable]);
  
  
  const onItemClick = (id)=>{
    console.log("COMMON OBJECT SETTINGS ITEM CLICKED CALL BACK :", id)
    const position = selection?.indexOf(id)
    console.log("IN THERE :", position)
  
    if(position ==-1){
      setSelection([...selection,id])
    }else{
      let newSelection = [...selection]
      newSelection.splice(position,1);
      setSelection(newSelection)
    }
  
  
  }
  
  const plugOrLight = uObject?.statuses?.__user_pluglight;
  useEffect(()=> {
  
  },[plugOrLight]);

const [habillage, setHabillage] = useState(plugOrLight || 'plug');

useEffect(()=>{
    console.log(" HABILLAGE :", habillage)
},[habillage])

  const onToggleSwitch = (habit) => {
    console.log("Habillage :", habit)
    setHabillage(habit)
};


    return (
        <ScreenContainer headerTitle={uObject.name} noHeader={noHeader}>
             <View style={styles.bodyContent}>
                <View style={{marginTop:10}}>
                  <RenameObject
                      ref={renameRef}
                      oldName = {oldName}
                      renameText={nameText || t(tns+":"+"RENAME_EQUIP")} 
                      handleSubmit={updateObject}
                      //goNavigation = {()=>navigation.navigate('ProductDetails', { 'typeName': uObject?.objectDatas?.typeName, itemId: itemId }) }
                  />
                </View>

                {typeName == 'SwitchEzsp' &&
                    <View>
                        <Text style={[styles.text, {marginBottom:20}]}>{t(tns+":"+"SELECT_PLUG_COVER")} </Text>
                        <TypagePlug itemId = {itemId} iconSize = {45}  isPlug = {true} handleToggleSwitch = {onToggleSwitch}/>
                    </View>
                }

                <View style={{marginVertical:5}}>
                  <RoomSelection
                      title={t(tns+":"+"SELECT_ROOM")}
                      options={data}
                      setSelected={setRoom}
                      placeholder={t(tns+":"+"SELECT_ROOM_PLACE_HOLDER")}
                      defaultOption={currentRoom}
                  />
                </View>

                {!noGroup &&
                  <View>
                    {selectable.length !=0 && 
                      <Text style={styles.text}>{t(tns+":"+"SELECT_GROUP")} :</Text>
                    }
                    <View style={[styles.containerWrapper, { flexDirection: 'row', justifyContent: 'space-around' }]}>
                        <RenderToogleFlatList 
                            isRedirectOnSelect = {false}
                            objectId={itemId}
                            selectable = {selectable}//groupsVisible
                            callBack ={onItemClick}
                            selection = {selection}//shutterDependencies
                            bgColor = "#3E495E"
                            iconColor = "#FFFFFF"
                            numColumns = {4}
                            />
                    </View>
                  </View>
                }
                {objectClassName == "TriggerGate" &&
                    <View style={styles.validateButton}>
                        <Button onPress={changeWifiSettings} altStyle title={t(tns+":"+"CHANGE_WIFI_NETWORK")} titleColor="#FFFFFF" bgColor="#3E495E" noBorder />
                    </View>
                }
                <View style={styles.validateButton}>
                    <Button onPress={submitMe} altStyle title={t(tns+":"+"VALIDATE_MODIF")} titleColor="#FFFFFF" bgColor="#3E495E" noBorder />
                </View>

            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    containerWrapper: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 10,
        //padding: 10,
        backgroundColor: 'transparent',
        marginTop: 10
    },
    validateButton: {
        color:"#FFFFFF",
        borderRadius: 0,
        height: 40,
        marginBottom: 20
    },
    text: {
        marginTop:10,
        fontWeight:'600',
        fontSize: 14,
        color: '#3E495E'
    },
    bodyContent:{
        flex:1,
        justifyContent:'space-evenly',
        paddingHorizontal:5,
        marginVertical:15,
        borderColor:'orange',
        borderWidth:1,
        borderRadius:10,
        backgroundColor:'#FFFFFF'
      }
})

