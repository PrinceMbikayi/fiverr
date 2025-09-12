import '_brand/templates/screens/addObject/locales'
import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';
import Button from '_brand/templates/components/ui/Button';
import { RenameObject } from '_brand/templates/components/objects/common/RenameObject';
import { RoomSelection } from '_brand/templates/components/objects/common/RoomSelection';
import { getRooms, getRoomById} from '_helpers/selectors';
import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';
import {getObjectsByTypes} from '_helpers/selectors';
import {updateObjectRoom} from '_api/objects'
import * as Actions from '_actions/objects';
import {appRefresh,closeWS} from '_actions/app';
import { Api } from '_api';
import {getObjectById} from '_helpers/objects';
import {filterGroupsToRetain} from '_brand/templates/components/objects/common/utils/filterGroupsToRetain'
import {difference as lodashDifference, pull as lodashPull} from 'lodash';
import { myToast } from '_brand/templates/components/ui/myToast';

const screenWidth = Dimensions.get('window').width;

export const  ModifyNewAddedObject = (props) => {
    const {itemId, callBackSetPage, chooseTypeNature} = props;

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const dispatch = useDispatch();
    const navigation = useNavigation();
    // Recover props: typeName and itemId from navigation params
    const uObject = useObject(itemId);
    const renameRef = useRef(null); 
    const typeName = uObject?.objectDatas?.typeName;
    const objectClassName = uObject?.objectDatas?.className
    console.log("NEW_OBJECT_ITEM_ID : ", itemId, uObject);
    const oldName = uObject?.name;
console.log("SCREEN WIDTH :", screenWidth)

    const theme = useTheme();
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";
    const bgcolor = theme?.prflxLightblueBgColor || '#EBF1F5';
    


    //    -----------Get existing Shutter goups dependencies------------------
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


    //-----------------Get existing goups-----------------------------

    const groupsVisible = useSelector(getObjectsByTypes)["Composite"]||[];

    const [selection, setSelection] = useState(getObjectDependenciesGroup(uObject))
    const [selectable, setSelectable] = useState([])

    // Get ROOMS FROM STORE
    const [room, setRoom] = useState("");
    const [currentObjectRoomId, setCurrentObjectRoomId] = useState(uObject?.objectDatas?.room ||-1);
    const data = [];
    const roomData = useSelector(getRooms);
    roomData.map((item) => {
        data.push({ key: item.id, value: item.name });
    })

    const currentRoom =  useSelector(state => getRoomById(state, Number(currentObjectRoomId)));
    useEffect(() => {
        console.log('CURRENT_OBJECT_ROOM_ID :', currentObjectRoomId, room);
    },[currentObjectRoomId, room]);


    useEffect(()=> {
        console.log('SELECTABLE :', selectable);
    },[selectable]);

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


useEffect(()=> {
    uObject?.addStatus("__user_typeNature",chooseTypeNature);
    uObject?.updateStatus('__user_typeNature',chooseTypeNature);
},[]);



    const submitMe = (values) => {
        console.log("ROMS :", room)
        renameRef.current.submitForm();
        callBackSetPage();
        navigation.navigate('MaisonScreen')
        //navigation.goBack();
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



    // HANDLE VALIDATE
    const handleSubmit = async (values) => {

        const renameResponse = await uObject.rename(values.rename).catch((err)=>console.log(err));
        console.log("Rename_Async_worked", renameResponse)
        // Get uri
        const uri = renameResponse?.res?.data?.uri
        console.log("OBJECT_URI :", uri)

        if(renameResponse?.errCode == 200){
            console.log('p1');
            const action1 = Actions.objectUpdateProperty(itemId,'name',values.rename);
            dispatch(action1);
            console.log('p2:',room, getObjectById(itemId));
            
            const updateObjectRoomResponse = await updateObjectRoom(itemId, Number(room), uri).catch((err) => console.log(err));
            console.log('RESPONSE_MODIFY_ROOM :', updateObjectRoomResponse);
            console.log('p3');
            if(updateObjectRoomResponse?.errCode == 200){
                console.log('p4');
                console.log("Update Room Async worked", updateObjectRoomResponse);
                
                console.log('p5');
                const action2 = Actions.objectUpdateProperty(itemId,'room',room);
                console.log("UPDATE ROOM ID :", room)
                
                dispatch(action2);
                console.log('p6');
        
                dispatch(appRefresh());
    
    
                // Process to group modification
                let groupsToModify = [];
                const toDelete = lodashDifference(initialSelectionRef.current, selection)
                const toAdd = lodashDifference(selection, initialSelectionRef.current )
                console.log("TO_DELETE :", toDelete)
    
                toDelete.map((idgrp)=>{
                    groupsToModify.push(processAGroup(idgrp,itemId,  'delete'))
                })
    
                toAdd.map((idgrp)=>{
                    groupsToModify.push(processAGroup(idgrp,itemId,  'add'))
                })
    
                console.log("VIEW_GROUPS :", groupsToModify)
    
                groupsToModify.map(async(item)=>{
                    const actionStore = Actions.updateRDependenciesHarold(item.groupId,item.components);
                    dispatch(actionStore);
                    console.log('UPDATE_GROUP_BEFORE_REQUEST :', item.groupId);
                    const result = await Api.modifyAGroup(item.groupId,item.components).catch((err) => console.log(err));
                    console.log('UPDATE_GROUP_RESPONSE :', result);
                    console.log(`Update Group ${item.groupId} Async worked`, result);
                    //refreshObjectAction(itemId,store).catch((err) => console.log(err)); 
                })
    
                const objectAction = Actions.updateRDependenciesObjectHarold(itemId, selection);
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


    const onItemClick = (id)=>{
        console.log("ITEM CLICKED CALL BACK :", id)
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

    return (
        <View style={{padding:10, backgroundColor:bgcolor}}>
             <View style={[styles.bodyContent,{width:0.88*screenWidth}]}>
                <RenameObject
                    ref={renameRef}
                    oldName = {oldName}
                    renameText={t(tns+":"+"ADD_NAME_TO_EQUIP")}
                    handleSubmit={handleSubmit}
                />

                <RoomSelection
                    title={t(tns+":"+"EQUIP_ROOM")}
                    options={data}
                    setSelected={setRoom}
                    placeholder={t(tns+":"+"SELECT_A_ROOM")}
                    defaultOption={currentRoom}
                />
                {selectable.length !=0 &&
                    <Text style={[styles.text,{width:0.88*screenWidth}]}>{t(tns+":"+"ADD_EQUIP_TO_GROUP")} </Text>
                }
                <View style={[styles.containerWrapper, { flexDirection: 'row', justifyContent: 'space-around', backgroundColor:'transparent' }]}>
                    <RenderToogleFlatList 
                        isAdd={false}
                        isRedirectOnSelect = {false}
                        objectId={itemId}
                        selectable = {selectable}
                        callBack ={onItemClick}
                        selection = {selection}
                        bgColor = {iconColor}
                        iconColor = {iconBgColor}
                        numColumns = {4}
                  />
                </View>


            </View>
            <View style={[styles.validateButton,{marginTop:60}]}>
                <Button onPress={submitMe} altStyle title='Terminer' titleColor="#FFFFFF" bgColor="#3E495E" noBorder />
            </View>
            <View style={{height:40,width:'100%'}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    containerWrapper: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 10,
        //padding: 5,
        backgroundColor: 'transparent',
        marginVertical: 10,
    },

    validateButton: {
        color:"#FFFFFF",
        borderRadius: 0,
        height: 40,
    },
    text: {
        marginTop:23,
        fontWeight:'600',
        fontSize: 14,
        color: '#3E495E',
        backgroundColor:'transparent',
        //width:368
    },
      bodyContent:{
        flex:1,
        justifyContent:'space-evenly',
        padding:10,
        borderColor:'orange',
        borderWidth:1,
        borderRadius:10,
        backgroundColor:'#FFFFFF'
      }
})

