import '_brand/templates/screens/addObject/locales'
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Image, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PagerView from 'react-native-pager-view';
import { useTheme } from '_theming/themeProvider';
import { UserObjectTypeChoice } from '_brand/templates/screens/addObject/components/UserObjectTypeChoice';
import Button from '_brand/templates/components/ui/Button';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { iconsJs } from '_brand/utils/iconsJs';
import { getObjectsByTypeName, getObjectsVisible, getObjectsByTypes } from '_helpers/selectors';
import { getObjectById } from '_helpers/objects';
import { Api } from "_api";
import * as Durin from '_api/durin';
import { SelectList } from 'react-native-dropdown-select-list'
import { getDiscoveryEzsp } from '_actions/app';
import Toast from 'react-native-root-toast';
import { deleteObject } from '_api/objects';
import {appRefresh,closeWS} from '_actions/app';
import * as ApiObjects from "_api/objects"
import AsyncStorage from '@react-native-community/async-storage';


export const InstallZigbeeNetworkScreen = () => {


    const pagerRef = useRef(null);
    const currentPageRef = useRef(0)
    const flagLoadingRef = useRef(true)
    const initObjectVisibleRef = useRef();//
    const gatewayListRef = useRef(null);
    const zigbeeListRef = useRef(null);
    const myGateWayIdRef = useRef(null);
    const dongleToCheckIfBoxLeavedRef = useRef(null);
    const boxLeaveStatusRef = useRef("noStatus");

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const { t, i18n } = useTranslation();
    const tns = "addObject";


    const [allStates, setAllStates] = useState({ currentPage: 0 });
    const [box, setBox] = useState("noSelection");
    const [networkRemote, setNetworkRemote] = useState();
    const [nbEquipments, setNbEquipments] = useState([]);
    const [discoveryState, setDiscoveryState] = useState('');
    const [userGatewEquipments, setUserGatewEquipments] = useState([]);
    const [equipOrganized, setEquipOrganized] = useState([]);
    const [loading, setLoading] = useState(false);
    const [objectFound, setObjectFound] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false);
    const [leaveMsg, setLeaveMsg] = useState("");


    const { theme } = useTheme();
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    //-------- Scan for dongle and object type name-------
    const whichDongle = "Zigbee_EZSP" // "Profalux"


    const dongleList = useSelector(state => getObjectsByTypeName(state, whichDongle));//Zigbee_EZSP, Profalux
    //const loadShutter868 =  useSelector(state =>getObjectsByTypeName(state,whichObjTypeName)); 

    const gateways = useSelector(state => getObjectsByTypeName(state, "Gateway"));
    const zigbees = useSelector(state => getObjectsByTypeName(state, "Zigbee_EZSP"));//dongles
    const routines = useSelector(state => getObjectsByTypeName(state, "Associations")) || [];

    // Get All ZigBee user objects
    const remoteEzsp = useSelector(state => getObjectsByTypeName(state, "RemoteEzsp")) || [];
    const shuttEzsp = useSelector(state => getObjectsByTypeName(state, "Rolling_Shutter_Ezsp")) || [];
    const shadeEzsp = useSelector(state => getObjectsByTypeName(state, "Shade_Ezsp")) || [];
    const venEzsp = useSelector(state => getObjectsByTypeName(state, "Venetian_Shutter_Ezsp")) || [];
    const ezspProbe = useSelector(state => getObjectsByTypeName(state, "EzspProbe")) || [];
    const garage_Door_Ezsp = useSelector(state => getObjectsByTypeName(state, "Garage_Door_Ezsp")) || [];
    const gate_Toggle_Ezsp = useSelector(state => getObjectsByTypeName(state, "Gate_Toggle_Ezsp")) || [];
    const garage_Door_Toggle_Ezsp = useSelector(state => getObjectsByTypeName(state, "Garage_Door_Toggle_Ezsp")) || [];
    const gate_Ezsp = useSelector(state => getObjectsByTypeName(state, "Gate_Ezsp")) || [];
    const switchEzsp = useSelector(state => getObjectsByTypeName(state, "SwitchEzsp")) || [];
    const lightEzsp = useSelector(state => getObjectsByTypeName(state, "LightEzsp")) || [];

    const userAllZigbeeObjects = shuttEzsp.concat(remoteEzsp, shadeEzsp, venEzsp, ezspProbe, garage_Door_Ezsp, gate_Ezsp, gate_Toggle_Ezsp, garage_Door_Toggle_Ezsp, switchEzsp, lightEzsp) || []
    console.log("MADNESS OF ARRAY CONCAT :", userAllZigbeeObjects)

    //const objectsVisible = useSelector(state => getObjectsVisible(state));
    const objectsVisible = useSelector(getObjectsVisible)
    const scanNetworkStatus = useSelector(state => state.app.discoveryEzsp);

    const groupsVisible = useSelector(getObjectsByTypes)["Composite"] || [];

    const groupsRef = useRef(groupsVisible);

    const initialLoadObjectsRef = useRef(JSON.stringify(objectsVisible));
    const updateObjectVisible = useRef(JSON.stringify(objectsVisible));
    const initTestRef = useRef();
    console.log("INITIAL VISIBLES :", initObjectVisibleRef.current)

    ////####----------Begin managing Pager View navigation

    console.log("currentPage changed", allStates.currentPage)

    const updateState = (newStates) => {
        setAllStates({ allStates, ...newStates });
    }

    const goBack = (index) => {
        //console.log("currentPage=",allStates.currentPage,currentPageRef.current)

        const nextIndex = currentPageRef.current - 1;
        currentPageRef.current = nextIndex;
        //console.log("in Go Back",nextIndex)
        if (nextIndex < 0) {
            // navigation.goBack(2);
            navigation.goBack();
        } else {
            updateState({ 'currentPage': nextIndex });
            pagerRef.current.setPage(nextIndex);
        }

    };

    const goNextPage = () => {

        const currentPage = allStates.currentPage;

        const nextIndex = currentPage + 1;
        updateState({ "currentPage": nextIndex })
        pagerRef.current.setPage(nextIndex);
    }

    const goPage = (index) => {

        //console.log("goPage",index)
        //setCurrentPage(index); 
        const currentPage = allStates.currentPage;

        currentPageRef.current = index;
        updateState({ "currentPage": index })
        if(pagerRef.current)pagerRef.current.setPage(index);    ;
    }

    const onPageSelected = (e) => {

        const position = e.nativeEvent.position;
        const index = updateState({ "currentPage": position })
        currentPageRef.current = position;
    }



    ////####-------------End managing Pager View navigation


    useEffect(() => {

    }, [loading]);

    useEffect(() => {
    }, [discoveryState])

    useEffect(() => {
        //console.log("NB EQUIPMENTS :", nbEquipments)
    }, [nbEquipments]);


    useEffect(()=> {
        console.log('IS_LEAVING :', isLeaving);
    },[isLeaving]);

    useEffect(()=> {
     console.log('LEAVE_MESSAGE :', leaveMsg);
    },[leaveMsg]);




    useEffect(() => {

        if (allStates.currentPage == 0) {

            let listGtw = [];
            let listZigB = [];

            gateways.map((item) => {
                const gatewayData = getObjectById(item);
                console.log("LISTER :", item, gatewayData, box)
                //if(gatewayData?.)
                listGtw.push({ key: Number(gatewayData?.gw), value: `${gatewayData?.name}` })
            })

            zigbees.map((item) => {
                const zigData = getObjectById(item)
                listZigB.push(item)
            })

            const filter = listGtw.filter(index => index.value != 'undefined' && index.value != 'System' && index.value != "ABox");
            gatewayListRef.current = filter;
            zigbeeListRef.current = listZigB;
            console.log("CHECK DATA GATEWAY :", gatewayListRef.current, zigbeeListRef.current)
            // setGatewayList(filter);
            // setZigbeeList(listZigB);
        }
    }, [allStates.currentPage]);//loadShutter868


    useEffect(() => {

        if (allStates.currentPage == 1) {
                let intervalCounter = 1;
                const myDongle = dongleToCheckIfBoxLeavedRef.current;

                const interval = setInterval(()=>{

                    if( myDongle != null){
                        const dongleData = getObjectById(myDongle)
                        console.log('MY_SELECTED_DONGLE_DATA',dongleData, dongleData?.statusDictionary?.config_ext_pan_id);
                        boxLeaveStatusRef.current = dongleData?.statusDictionary?.config_ext_pan_id
                    }
                    console.log('MY_SELECTED_DONGLE ID, PAN_STATUS :', myDongle, boxLeaveStatusRef.current);

                    
                    if( boxLeaveStatusRef.current == "-" && intervalCounter <= 3){
                        clearInterval(interval); 
                        setIsLeaving(false)
                        setLeaveMsg("left")
                        //goNextPage();
                    }else{
                        if (intervalCounter > 2) {
                            clearInterval(interval); // too much time for a leave
                            setIsLeaving(false)
                            setLeaveMsg("tooLong")// "La gateway n'a pas réussi à quitter le réseau à temps"
                            console.log("Bye Too much time waited :", intervalCounter);
                            //goNextPage();
                        } else {
                            console.log("Gateway leaving in progress....wait Sir :", intervalCounter);
                            intervalCounter = intervalCounter + 1;
                        }
                    }

                 },10000)
        }
    }, [allStates.currentPage]);

    useEffect(() => {
        console.log("BOX CHANGED :", box)
        const zigbeeEzspList = zigbeeListRef.current;
        zigbeeEzspList.map(async (gtwId) => {
            const dongleData = getObjectById(gtwId);
            //console.log("Get zigbee by id :", dongleData, Number(dongleData?.gw), box)
            console.log('MY_SELECTED_DONGLE :', gtwId);
            if (box == Number(dongleData?.gw)) {
                dongleToCheckIfBoxLeavedRef.current = gtwId
            } 
        })
        console.log('MY_SELECTED_DONGLE 1 :', dongleToCheckIfBoxLeavedRef.current, box);
    }, [box]);

    useEffect(() => {

        if (allStates.currentPage == 2) {
            const action = getDiscoveryEzsp('noScan');
            dispatch(action);
            // copy store object visible in a ref
            initObjectVisibleRef.current = JSON.stringify(objectsVisible)
            console.log("MADE A COPY OF VISIBLE IN REF:", initObjectVisibleRef.current)

        }

        if (allStates.currentPage == 3) {
            initTestRef.current = JSON.stringify(objectsVisible)
            console.log("INIIIIIIIIT:", initTestRef.current)

        }
    }, [objectsVisible, allStates.currentPage])

    useEffect(() => {
        console.log("OBJECTS VISIBLE  CHANGES :", objectsVisible)
        const initialLoadObjects = JSON.parse(initialLoadObjectsRef.current)

        const whichNewObject = objectsVisible.filter(x => !initialLoadObjects?.includes(x));
        console.log("OBJECTS VISIBLE  CHANGES 1:", objectsVisible, whichNewObject)

        if (whichNewObject.length != 0) {
            console.log("Here I am new object :", whichNewObject);
            //const idObj = whichNewObject[whichNewObject.length - 1] 
            setObjectFound(true)
            // setLoading(false)
            // goNextPage();
            // clearTimeout(timerRef.current); // If id is caught in time, stop interval time out
        }
        updateObjectVisible.current = JSON.stringify(objectsVisible);
        console.log("EVOLUTION OBJECT VISIBLE :", updateObjectVisible.current)
    }, [objectsVisible]);


    const leaveActions = {
        "actions": [
            {
                "name": "COMMAND",
                "mArgs": [
                    {
                        "name": "command",
                        "value": "command/io/ezsp/network"
                    },
                    {
                        "name": "arg1",
                        "value": "dev-0/self"
                    },
                    {
                        "name": "arg2",
                        "value": "leave"
                    }
                ]
            }
        ]
    }

    const validateDeleteRoutine = (box)=>{
        Alert.alert('',`${t(tns + ":" + "ALL_GROUPS_ROUTINES_WILL_BE_DELETED")}`, [
            {
              text: `${t(tns + ":" + "CANCEL")}`,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: `${t(tns + ":" + "VALIDATE")}`, onPress: () => handleBoxLeave(box)},
          ]);
    }


    const DeleteRoutines = async(routines)=>{

        await routines.reduce(async (accumulator, item) => {
            await accumulator;
            // delete next item
            const deleteItem = await deleteObject(item).catch((err) => { console.log(err) });
            if(deleteItem?.errCode == 403){
                const action = { "mArgs": [{ "value": item.toString(), "name": "objectId" }], "name": "REMOVE_OBJECT" }
                const requestRemoveRoutineFromPlanner = await ApiObjects.createWeeklyPlanner(action);

                if (requestRemoveRoutineFromPlanner.errCode == 200) {
                    const res = await deleteObject(item).catch((err) => console.log(err));
                  }
            }
            console.log("DELETE REQUEST :", deleteItem)
            dispatch(appRefresh());

        }, Promise.resolve());
    
    }

    const handleBoxLeave = async (box) => {


        if (box != 'noSelection') {
            // REMOVE ALL GROUPS WITH ZIGBEE EQUIPS
            //let groupZigbee = [];
            if (groupsRef.current != 0) {

                const groupZigbee = groupsRef.current
                await groupZigbee.reduce(async (accumulator, item) => {
                    await accumulator;
                    // delete next item
                    const deleteItem = await deleteObject(item).catch((err) => { console.log(err) });
                    console.log("GROUPS", item, "SUPPRIMER:", deleteItem)
                    dispatch(appRefresh());
                }, Promise.resolve());
            }
            console.log('HAA_YOU');
            // SEND LEAVE COMMAND TO GATEWAY
            gateways.map(async(gatewayId) => {
                
                const getBoxObject = getObjectById(gatewayId);
                if (Number(getBoxObject?.gw) == box) {
                    console.log('GATTTTT : ', gatewayId);
                    myGateWayIdRef.current = gatewayId;
                    console.log(" Validate warning pressed  : ", gatewayId, getBoxObject, myGateWayIdRef.current)
                    const leaveRequest = await Durin.update("object", myGateWayIdRef.current, leaveActions)
                    console.log("CHECK LEAVING REQUEST :", leaveRequest)

                    if(leaveRequest.errCode == 200){
                        setIsLeaving(true)
                        goNextPage()
                        
                    }else {
                            Toast.show(
                                `${t(tns + ":" + "LEAVE_NETWORK_REQUEST_FAILED")}`,
                                {
                                    backgroundColor: 'red',
                                    textColor: 'white',
                                    textStyle: { fontSize: 16, fontWeight: '600' },
                                    position: Toast.positions.CENTER,
                                    duration: 3000,
                                    onHide: () => { }
                                }
                            );
                    }
                }
            })



        } else {
            Toast.show(
                `${t(tns + ":" + "SELECT_GATEWAY")}`,
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

    const handleDeleteEquipments = async (box) => {

        let groupZigbee = [];

            await AsyncStorage.removeItem("@userFav")
            
            const actualBoxData = getObjectById(myGateWayIdRef.current)
            const actualBoxGwNumber = actualBoxData?.gw

            // Filter All user zigbee object belonging to actual box
            let userAllCurrentBoxObjects = [];
            let objectsFromOtherBox = [];

            userAllZigbeeObjects.map(item =>{
                const data = getObjectById(item)
                data?.gw == actualBoxGwNumber ?  userAllCurrentBoxObjects.push(item) : objectsFromOtherBox.push(item)

            })

        console.log("CHECK TTTRUUUUUE :",  userAllCurrentBoxObjects, objectsFromOtherBox)
        console.log("CHECK TTTRUUUUUE 2:",  groupsRef.current)

            const objectToDelete = routines.concat(userAllCurrentBoxObjects) ;//groupZigbee
            console.log("OBJECT TO DELETE ORDERED GROUPS + OBJECTS :", objectToDelete)
            goNextPage()

            await objectToDelete.reduce(async (accumulator, item) => {
                await accumulator;
                // delete next item
                const deleteItem = await deleteObject(item).catch((err) => { console.log(err) });
                console.log("DELETE REQUEST :", deleteItem)
                if(deleteItem?.errCode == 403){
                    const action = { "mArgs": [{ "value": item.toString(), "name": "objectId" }], "name": "REMOVE_OBJECT" }
                    const requestRemoveRoutineFromPlanner = await ApiObjects.createWeeklyPlanner(action);
    
                    if (requestRemoveRoutineFromPlanner.errCode == 200) {
                        const res = await deleteObject(item).catch((err) => console.log(err));
                      }
                }
                dispatch(appRefresh());
    
            }, Promise.resolve());
    
    }





    const handleEquipType = (value) => {
        setNetworkRemote(value);
        value != "receptor" ? goPage(3) : goPage(3);
    }


    const handleValidateInstructionsRemoteChoice = () => {
        setLoading(true)

        const timer = setTimeout(() => {
            console.log("--------------------ENNNNDD Timeout----------------------")
            console.log("get discovery final state :", scanNetworkStatus);
            setDiscoveryState(scanNetworkStatus)

            const initialVisiblecontent = JSON.parse(initialLoadObjectsRef.current)
            const initPage2 = JSON.parse(initTestRef.current)
            const updateList = JSON.parse(updateObjectVisible.current)
            const newObject = updateList.filter(x => !initPage2?.includes(x));
            // console.log("J' AI TROUVE DEBUT :", initialVisiblecontent)
            // console.log("J' AI TROUVE PAGE 2:", initPage2, objectsVisible)
            // console.log("J' AI TROUVE  FIN:", newObject, updateObjectVisible.current)

            setNbEquipments(newObject);
            // goPage(4);
            setLoading(false)
            clearTimeout(timer);
        }, 120000)

        console.log("Get zigbee by id :", zigbeeListRef.current, box)
        const zigbeeEzspList = zigbeeListRef.current;

        zigbeeEzspList.map(async (dongleId) => {
            const dongleData = getObjectById(dongleId);
            console.log("Get zigbee by id :", dongleData, Number(dongleData?.gw), box)
            console.log("VRAIMENT GATEWAY ID :", dongleId)
            if (box == Number(dongleData?.gw)) {
                //{"actions":[{"name":"JOIN","oArgs":[{"name":"ext_pan_id","value":""},{"name":"tx_power","value":""}]}]}
                const param = {"oArgs":[{"name":"ext_pan_id","value":""},{"name":"tx_power","value":""}]}
                const resAction = await Api.executeAction(dongleId, "JOIN", param);

                console.log("RESULT ACTION :", resAction)
            } else {
            }
        })
        goPage(4);
    }


    const nextAfterSearchEnded = async () => {

        if ((nbEquipments?.length != 0)) {

            await nbEquipments.reduce(async (accumulator, id) => {
                await accumulator;
                const response = await Api.getObject(id)
                console.log("RESOURCE :", response)
                const resource = response?.res?.data?.resource;
                apiRes.push(resource);
                if (resource?.typeName == "Shade_Ezsp" || resource?.typeName == "Rolling_Shutter_Ezsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.vrOpenIcon] })
                } else if (resource?.typeName == "Venetian_Shutter_Ezsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.bsoOpenIcon] })
                } else if (resource?.typeName == "LightEzsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.lightOffIcon] })
                } else if (resource?.typeName == "SwitchEzsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.plugOffIcon] })
                } else if (resource?.typeName == "Gate_Ezsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.gateSomewhereIcon] })
                } else if (resource?.typeName == "Gate_Toggle_Ezsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.gateSomewhereIcon] })
                } else if (resource?.typeName == "Garage_Door_Ezsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.garageOpenIcon] })
                } else if (resource?.typeName == "Garage_Door_Toggle_Ezsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.garageOpenIcon] })
                } else {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.vrOpenIcon] })
                }
            }, Promise.resolve());
            setEquipOrganized(organizedData);
            setUserGatewEquipments(apiRes);
            goNextPage()

        } else {
            navigation.navigate("CalypshomeBoxHomeScreen")
        }

    }


    useEffect(() => {
    }, [userGatewEquipments])

    let iconsFoundEquip;
    useEffect(() => {
        console.log("VIEW ORGANIZED DATA :", equipOrganized)
    }, [equipOrganized])


    let apiRes = [];
    let organizedData = []



    const handleFoundEquipments = async () => {
        console.log("Equipements found on this network :", nbEquipments)
        // const scan = await Api.getObject(id).catch((err) => { console.log(err) });
        if ((nbEquipments?.length != 0)) {

            await nbEquipments.reduce(async (accumulator, id) => {
                await accumulator;
                const response = await Api.getObject(id)
                console.log("RESOURCE :", response)
                const resource = response?.res?.data?.resource;
                apiRes.push(resource);
                if (resource?.typeName == "Shade_Ezsp" || resource?.typeName == "Rolling_Shutter_Ezsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.vrOpenIcon] })
                } else if (resource?.typeName == "Venetian_Shutter_Ezsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.bsoOpenIcon] })
                } else if (resource?.typeName == "LightEzsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.lightOffIcon] })
                } else if (resource?.typeName == "SwitchEzsp") {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.plugOffIcon] })
                } else {
                    organizedData.push({ id: resource?.id, title: resource?.name, typeName: resource?.typeName, iconJs: [iconsJs.vrOpenIcon] })
                }
            }, Promise.resolve());
            setEquipOrganized(organizedData);
            setUserGatewEquipments(apiRes);
            goNextPage()

        } else {
            navigation.navigate("CalypshomeBoxHomeScreen")
            //setIsRuning(false)
        }
    }


    // FIRE COMPLETE SCAN COMMAND AT THE END OF THE SEARCH
    const validateMyEquipments = async () => {

        const zigbeeEzspList = zigbeeListRef.current;
        zigbeeEzspList.map(async (gtwId) => {
            const dongleData = getObjectById(gtwId);
            console.log("Get zigbee by id :", dongleData, Number(dongleData?.gw), box)
            if (box == Number(dongleData?.gw)) {

                const actions = {
                    "actions": [
                        {
                            "name": "COMMAND",
                            "mArgs": [
                                {
                                    "name": "command",
                                    "value": "command/io/ezsp/discover"
                                },
                                {
                                    "name": "arg1",
                                    "value": "dev-0/self"
                                },
                                {
                                    "name": "arg2",
                                    "value": "complete"
                                }
                            ]
                        }
                    ]
                }
                const resAction = await Durin.update("object", myGateWayIdRef.current, actions)
                console.log("RESULT ACTION :", resAction)
            } else {
                // Send action to the first gateway
                //uObj[0].execute("JOIN", { oArgs: [{ name: 'tx_power', min: 1, max: 20, value: 3 }] });
            }
        })

        navigation.navigate("AddObject")
        navigation.navigate("MaisonScreen")
        // const pushAction = StackActions.push({
        //     routeName: 'MaisonScreen',
        // });

        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: 'AddObject' })],
        //   });
        
        //navigation.dispatch(StackActions.popToTop());
        //navigation.dispatch(resetAction);
    }

    /////////////////////


    const handleCancelEquipmentInSearch = ()=>{
        flagLoadingRef.current = true;
        console.log(" FLAG LOADING PASSED TO TRUE FROM BACK PAGE 12:", flagLoadingRef.current);
        setLoading(false)
        goPage(0)
       //goPage(3); // debug short path
    }

    const RenderLoadingFalse = ()=>{

        return(
            <View style={{}}>
            {(nbEquipments?.length == 0)
                ?

                <View style={{alignItems: 'center', height:'100%', backgroundColor:'transparent', paddingVertical:20}}>
                   
                        <Text
                            style={{
                                color:textColor,
                                textAlign: 'center', backgroundColor: 'transparent',
                                padding: 8, marginBottom: 80, fontSize: 16, fontWeight: '400'
                            }}>
                            {t(tns + ":" + "SEARCH_FINISHED")}
                        </Text>
                        <Text
                            style={{
                                color:textColor,
                                textAlign: 'center', backgroundColor: 'transparent',
                                padding: 8, marginBottom: 30, fontSize: 16, fontWeight: '600'
                            }}>
                            {t(tns + ":" + "SEARCH_FAILED")}
                        </Text>
                        <Text
                            style={{
                                color:textColor,
                                textAlign: 'center', backgroundColor: 'transparent',
                                padding: 8, marginBottom: 80, fontSize: 16, fontWeight: '400'
                            }}>
                            {t(tns + ":" + "NO_OPEN_NETWORK_JOINED")}
                        </Text>


                    <View style={[styles.validateButton, { color: textColor, marginTop: 40 }]}>
                        <Button
                            onPress={handleFoundEquipments}
                            altStyle titleColor='white'
                            title={`${t(tns + ":" + "CLOSED_ASSISTANT")}`}
                            bgColor={textColor} noBorder
                        />
                    </View>

                </View>
                :
                <>

                    <View style={{ marginVertical: 50 }}>
                        {/* <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} /> */}
                    </View>

                    <View style={{ marginTop: 30, marginBottom: 15 }}>
                        {objectFound == true &&
                            <View>
                                <Text  style={[styles.text,{color:textColor}]}>
                                    {t(tns + ":" + "SEARCH_FINISHED")}
                                </Text>

                                <View style={[styles.validateButton, { color: textColor, marginTop: 40 }]}>
                                    <Button
                                        onPress={nextAfterSearchEnded}
                                        altStyle titleColor='white'
                                        title={`${t(tns + ":" + "NEXT")}`} bgColor={textColor} noBorder
                                    />
                                </View>
                            </View>
                        }
                    </View>
                </>
            }

        </View>
        )
    }

    const RenderLoadingTrue = ()=>{
        return(
            <View style={{height:'100%', width:'100%', backgroundColor:'transparent'}}>
                {objectFound == false &&
                    <View style={{ marginTop: 130, marginBottom: 15, backgroundColor:'transparent' }}>
                        <Text style={styles.text}>
                            {t(tns + ":" + "EQUP_IN_SEARCH")}
                        </Text>
                    </View>
                }
                {objectFound == true &&
                    <View>
                        <Text  style={[styles.text,{color:textColor}]}>
                            {t(tns + ":" + "NETWORK_WITH_EQUIP_FOUND_WAIT")}
                        </Text>
                    </View>
                }

                <View style={{ marginVertical: 50 }}>
                    <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} />
                </View>

                
                {objectFound == true &&
                    <View style={{ marginTop: 30, marginBottom: 15 }}>
                        <Text  style={[styles.text,{color:textColor}]}>
                            {t(tns + ":" + "LONG_SEARCH")}
                        </Text>
                    </View>
                }
                

                <View style={[styles.validateButton, { color: textColor }]}>
                    <Button onPress={handleCancelEquipmentInSearch} altStyle titleColor='white' title= {`${t(tns + ":" + "CANCEL")}`} bgColor={textColor} noBorder />
                </View>

            </View>
        )
    }


    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'transparent' }}>

            <PagerView
                style={[{ flex: 1, backgroundColor: bgcolor }]}
                ref={pagerRef}
                initialPage={0}
                scrollEnabled={false}
                onPageSelected={onPageSelected}

            >

                <View key='0' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title= {t(tns + ":" + "ADD_CALYPSHOME_BOX")} goBack={() => navigation.navigate("CalypshomeBoxHomeScreen")} />
                    <Body style={{ marginTop: 5, padding: 15 }}>
                            <View>
                                <CardImageArrow
                                    withNextArrow={false}
                                    //onPressNextArrow={()=>console.log("pressed")}
                                    disabled={true}
                                    textDisplay={t(tns  + ":" + "INSTALL_ZIGBEE_NETWORK_WARNING")}
                                    textDisplay2={t( tns + ":" + "INSTALL_ZIGBEE_NETWORK_DESCRIPTION")}
                                />
                                <CardImageArrow
                                    withNextArrow={false}
                                    //onPressNextArrow={()=>console.log("pressed")}
                                    disabled={true}
                                    textStyle={{ marginLeft: 40 }}
                                    textDisplay={t(tns + ":" + "BOX_CHOICE")}
                                >

                                    <View style={[styles.renameContainer, { marginTop: 20 }]}>
                                        <SelectList
                                            search={false}
                                            setSelected={setBox}
                                            data={gatewayListRef.current}
                                            boxStyles={{ backgroundColor: '#EDEDED', borderRadius: 12, height: 44, width: 254 }}
                                            dropdownStyles={{ backgroundColor: '#EDEDED', borderRadius: 12, width: 254 }}
                                            dropdownTextStyles={{color:textColor}}
                                            inputStyles={{color:textColor}}
                                            placeholder={t(tns + ":" + "SELECT_GATEWAY")}
                                        //defaultOption={"Hello"}
                                        />
                                    </View>
                                </CardImageArrow>

                                <View style={[styles.validateButton, { color: textColor }]}>
                                    <Button onPress={() => validateDeleteRoutine(box)} altStyle titleColor='white' title={t(tns + ":" + "VALIDATE")} bgColor={textColor} noBorder />
                                </View>
                            </View>
                    </Body>
                </View>

                <View key='1' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "ADD_CALYPSHOME_BOX")} withBack={false}  />
                    <Body style={{ marginTop: 5, padding: 15 }}>
                        {isLeaving ?

                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, textAlign: 'center', marginBottom: 10 }}>{t(tns + ":" + "BOX_LEAVING_NETWORK")} </Text>
                                    <View style={{ marginVertical: 50 }}>
                                        <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} />
                                    </View>
                                    <View style={[styles.validateButton, { color: textColor }]}>
                                         <Button onPress={() => navigation.navigate("CalypshomeBoxHomeScreen")} altStyle titleColor='white' title={`${t(tns + ":" + "CANCEL")}`} bgColor={textColor} noBorder />
                                    </View>
                                </View>
                            :
                                <View>

                                    {/* {(leaveMsg == "left" || leaveMsg == "toolong") && */}
                                        <View>
                                            <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, textAlign: 'center', marginBottom: 100, marginTop:50 }}>{t(tns + ":" + "BOX_LEFT_NETWORK")} </Text>
                                            <View style={[styles.validateButton, { color: textColor }]}>
                                                <Button onPress={() => handleDeleteEquipments(box)} altStyle titleColor='white' title={`${t(tns + ":" + "NEXT")}`} bgColor={textColor} noBorder />
                                            </View>
                                        </View>


                                </View>
                        }
                    </Body>
                </View>

                <View key='2' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "OPEN_ZIGBEE_NETWORK")}  goBack={() => { goPage(0) }} />
                    <Body style={{ marginTop: 5, padding: 15 }}>
                        <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, textAlign: 'center', marginBottom: 20 }}>{t(tns + ":" + "SELECT_EQUIP_TYPE_TO_OPEN_NETWORK")} :</Text>
                        <CardImageArrow
                            onPressNextArrow={() => handleEquipType('portable')}
                            withNextArrow={true}
                            imageSource={require('_brand/templates/screens/addObject/images/simpleRemote.png')}
                            textDisplay={t(tns + ":" + "EQUIP_PORTABLE_REMOTE")}
                            textStyle={{ marginRight: 30 }}
                            imgStyle={{ width: 70, height: 80 }}
                        />
                        <CardImageArrow
                            onPressNextArrow={() => handleEquipType('wall')}
                            withNextArrow={true}
                            imageSource={require('_brand/templates/screens/addObject/images/wallRemote.png')}
                            textDisplay={t(tns + ":" + "EQUIP_WALL_REMOTE")}
                            textStyle={{ marginRight: 30 }}
                            imgStyle={{ width: 70, height: 80 }}
                        />
                        <CardImageArrow
                            onPressNextArrow={() => handleEquipType('receptor')}
                            withNextArrow={true}
                            imageSource={require('_brand/templates/screens/addObject/images/receptor.png')}
                            textDisplay={t(tns + ":" + "EQUIP_ZIGBEE_RECEPTOR")}
                            textStyle={{ marginRight: 55 }}
                            imgStyle={{ width: 70, height: 80 }}
                        />
                    </Body>
                </View>

                <View key='3' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "OPEN_ZIGBEE_NETWORK")}  withBack={true} goBack={() => { goPage(2) }} />
                    <Body style={{ marginTop: 0, padding: 15 }}>
                        {
                            networkRemote == "portable" &&
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ marginBottom: 10 }}>
                                    <Text  style={[styles.text,{color:textColor}]}> {t(tns + ":" + "FIND_R_F")} </Text>
                                </View>

                                <View style={{ marginTop: 25 }}>
                                    <Image source={require('_brand/templates/screens/addObject/images/RF.png')} style={{ width: 205, height: 124}} />
                                </View>
                                <View style={{ marginTop: 0, marginBottom: 15 }}>
                                    <Text  style={[styles.text,{color:textColor}]}>
                                        {t(tns + ":" + "CLIP_PRESS_R_STOP")}
                                    </Text>
                                </View>
                                <CardImageArrow
                                    //onPressNextArrow = {()=>goPage(10)}
                                    withNextArrow={false}
                                    disabled={true}
                                    imgStyle={{ width: 210, height: 100, marginLeft:'10%'}}
                                    imageSource={require('_brand/templates/screens/addObject/images/zigbeeRemoteRUp.png')}
                                    innerWidthPercent={'85%'}
                                />

                                <Text  style={[styles.text,{color:textColor}]}>
                                    {t(tns + ":" + "SHUTTERS_MAKE_MOVE")}
                                </Text>
                            </View>
                        }
                        {
                            networkRemote == "wall" &&
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ marginBottom: 10 }}>
                                    <Text  style={[styles.text,{color:textColor}]}> {t(tns + ":" + "FIND_R_F")} </Text>
                                </View>

                                <View style={{ marginTop: 25 }}>
                                    <Image source={require('_brand/templates/screens/addObject/images/wallRemote-RF.png')} style={{ width: 200, height: 120 }} />
                                </View>
                                <View style={{ marginTop: 0, marginBottom: 15 }}>
                                    <Text  style={[styles.text,{color:textColor}]}>
                                        {t(tns + ":" + "CLIP_PRESS_R_STOP")}
                                    </Text>
                                </View>
                                <CardImageArrow
                                    //onPressNextArrow = {()=>goPage(10)}
                                    withNextArrow={false}
                                    disabled={true}
                                    imgStyle={{ width: 210, height: 100, marginLeft:'10%' }}
                                    imageSource={require('_brand/templates/screens/addObject/images/wallRemote-1xR-stop.png')}
                                    innerWidthPercent={'85%'}
                                />

                                <Text  style={[styles.text,{color:textColor}]}>
                                    {t(tns + ":" + "SHUTTERS_MAKE_MOVE")}
                                </Text>
                            </View>
                        }
                        {
                            networkRemote == "receptor" &&
                            <View>
                                <View style={{ marginTop: 0, marginBottom: 10 }}>
                                    <Text  style={[styles.text,{color:textColor}]}> {t(tns + ":" + "LOCALIZE_RECEPTOR_BUTTON")}</Text>
                                </View>
                                <CardImageArrow
                                    //onPressNextArrow = {()=>goPage(10)}
                                    withNextArrow={false}
                                    disabled={true}
                                    imgStyle={{ width: 150, height: 70, marginLeft:'20%'}}
                                    imageSource={require('_brand/templates/screens/addObject/images/receptor-button.png')}
                                    innerWidthPercent={'85%'}
                                />
                                <View style={{ marginTop: 20, marginBottom: 15 }}>
                                    <Text  style={[styles.text,{color:textColor}]}>
                                        {t(tns + ":" + "SCREWDRIVE_5S_BUTTON_PRES_IMPULSION_5SPRESS")}
                                    </Text>
                                </View>
                                <CardImageArrow
                                    //onPressNextArrow = {()=>goPage(10)}
                                    withNextArrow={false}
                                    disabled={true}
                                    imgStyle={{ width: 100, height: 70 , marginLeft:'35%'}}
                                    imageSource={require('_brand/templates/screens/addObject/images/receptor-showbutton.png')}
                                    innerWidthPercent={'85%'}
                                />
                                <View style={{ marginTop: 5, marginBottom: 35 }}>
                                    <Text style={[styles.text, {color:textColor, marginVertical:2}]}>
                                        1 - {t(tns + ":" + "FIVE_SECONDS_PRESS")}
                                    </Text>
                                    <Text style={[styles.text, {color:textColor, marginVertical:2}]}>
                                        2 - {t(tns + ":" + "ONE_IMPULSION")}
                                    </Text>
                                    <Text style={[styles.text, {color:textColor, marginVertical:2}]}>
                                        3 - {t(tns + ":" + "FIVE_SECONDS_PRESS")}
                                    </Text>
                                </View>
                            </View>
                        }

                        <View style={[styles.validateButton, { color: textColor, marginTop: 10 }]}>
                            <Button onPress={handleValidateInstructionsRemoteChoice} altStyle titleColor='white' title={t(tns + ":" + "VALIDATE")} bgColor={textColor} noBorder />
                        </View>
                    </Body>
                </View>

                <View key='4' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen
                        title={objectFound == false ? t(tns + ":" + "NETWORK_SEARCH") : t(tns + ":" + "EQUIP_SEARCH")}
                        withBack={false} 
                        />
                        
                    <View style={{backgroundColor:'transparent', width:'100%', height:'100%', paddingHorizontal:10}}>

                        {loading ?
                            <RenderLoadingTrue/>
                            :
                            <RenderLoadingFalse />

                        }
                    </View>
                </View>

                <View key='5' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "NETWORK_SEARCH")}  withBack={false} goBack={() => { goPage(3) }} />
                    <Body style={{ marginTop: 0, padding: 0 }}>
                        <View style={{ marginTop: 30, marginBottom: 10 }}>
                            <Text style={[styles.text,{color:textColor}]}>
                                {t(tns + ":" + "BOX_HAS_DETECTED")} {nbEquipments?.length} {t(tns + ":" + "EQUIPS")} 
                            </Text>
                        </View>

                        <View>
                            <UserObjectTypeChoice
                                onPressHandler={() => console.log("Hello")}
                                bgColor={bgWhitecolor}
                                iconColor={textColor}
                                //iconJs = {eq}
                                options={equipOrganized}
                            />
                        </View>

                        <View style={[styles.validateButton, { color: textColor, marginTop: 10, width: '85%' }]}>
                            <Button onPress={validateMyEquipments} altStyle titleColor='white' title={t(tns + ":" + "MY_EQUIPS")} bgColor={textColor} noBorder />
                        </View>

                        <View style={[styles.validateButton, { color: textColor, marginTop: 10, marginBottom:20, width: '85%' }]}>
                            <Button onPress={() => goPage(0)} altStyle titleColor='white' title={t(tns + ":" + "NOT_MY_EQUIPS")} bgColor={textColor} noBorder />
                        </View>
                    </Body>
                </View>


            </PagerView>
        </SafeAreaView>

    )
};


const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: '400',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        lineHeight: 20,
        marginVertical: 10
    },
    validateButton: {
        minWidth: 200,
        height: 50,
        marginTop: 10,
    }
});
