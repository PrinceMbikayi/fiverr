import '_brand/templates/screens/routines/locales'
import React, { useContext,useRef, useEffect, useState } from "react";
import { getObjectById } from '_helpers/objects';
import * as ApiObjects from "_api/objects"
import { Api } from '_api';
import { getObjectsVisible, getObjectsByTypes, getObjectsByTypeName } from '_helpers/selectors';
import { useDispatch, useStore } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScenarioContext } from '_brand/templates/screens/routines/context'
import {updateEcoConfortParameter, objectUpdateProperty,updateStatus as updateStatusAction} from '_actions/objects';
import {isDateInRange,extractParamFromEcoConfort, extractMultipleParamFromEcoConfort, convertMinutesToHoursMinutes} from '_brand/templates/screens/routines/utils/ecoConfortUtils'
import EcoConfortIconActionConfig from "_brand/templates/screens/routines/config/EcoConfortIconActionConfig"
import { processMyAction } from '_brand/templates/screens/routines/context/ecoConfortTools';
import {getApps} from '_api/objects'
import { myToast } from '_brand/templates/components/ui/myToast';
import { refreshObjectAction } from '_actions/asyncActions';
import { extractDailyRoutines } from '_brand/templates/screens/routines/utils/index'




/**
 * 
 * @returns {void} 
 */
export const useEcoConfort = () => {

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "routine";
    const dispatch = useDispatch();
    const store = useStore()


    if (useContext(ScenarioContext) == undefined) return {}

    const { 
            ecoConfGroupActions, setEcoConfGroupActions,
            //onclickObjectForEcoConfort,
            ecoSelection, setEcoSelection,
            ecoConfortIdentity, setEcoConfortIdentity,
            ecoConfEquipmentsByTypeName, setEcoConfEquipmentsByTypeName,
            ecoConfSelectedAction, setEcoConfSelectedAction,
            ecoConfIconState, setEcoConfIconState,weeklyPlannerId,
            ecoTargetForDelete, setEcoTargetForDelete,
            setPlanningDaysDatas, getCurrentDay, setDailyRoutines
    } = useContext(ScenarioContext);


    const processEcoActions = (objectAction,typeName) => {
        const dopo = processMyAction({ objectAction, ecoConfGroupActions, typeName })
        const { myKey, myActions } = dopo;
        const updatedAction = { [myKey]: myActions };
        const newActionsByItemIdItem = { ...ecoConfGroupActions, ...updatedAction }
        console.log("processEcoActions :",processMyAction({ objectAction, ecoConfGroupActions }))
        setEcoConfGroupActions({ ...newActionsByItemIdItem })
    }

    const updateEcoConfortActions = (objectAction, typeName)=>{
        console.log('I_WANT_TO_SET_ECO_ACTIONS :', objectAction, typeName);
        processEcoActions(objectAction, typeName)
        const action = objectAction.split("/").splice(0, 1)
        const actionSpec = objectAction.split("/").splice(0, 2).join("/")
        const configObject = EcoConfortIconActionConfig[typeName][actionSpec];
        const icon = configObject?.iconName;
        const iconLabel = configObject?.label;
        if (action != "TILT") {
            setEcoConfIconState({ "icon": icon, "label": iconLabel })
        }

        console.log('SEE_ICON_STATE :', icon, iconLabel);

        setEcoConfSelectedAction(objectAction)
    }


    /**
     * 
     * @comment ecoObjTypeName is set to "Rolling_Shutter_Ezsp" to force all type of shutters 
     *          to be grouped in one single widget when configuring ecoconfort parameters.
     */
    const onclickObjectForEcoConfort = (id) => {
        const ecoDatas = getObjectById(id);
        const typeName = ecoDatas?.typeName
        const ecoObjTypeName = "Rolling_Shutter_Ezsp"|| typeName//it was typeName but changed to allow only one widget to appear when confuguring ecoconfort parameters
        // get common ecoconfort group id using object typeName
        const idTypeGroup = EcoConfortIconActionConfig[ecoObjTypeName].itemId
        const newAction = `myActions_${idTypeGroup}`;
        //const position = ecoSelection?.indexOf(id)
        const position = ecoConfortIdentity.ecoObjects?.indexOf(id)
        console.log("A_AJOUTER :", newAction)
        if (position == -1) {
            if(typeName == "Rolling_Shutter_Profalux"){
                //const message = `${t(tns + ":" + "_WARNING_ADDING_SOLAR_EQUIPMENT_ON_ECOCONFORT_MAY_AFFECT_BATERRY_CHARGE")}`
                const message = `${t(tns + ":" + "WARNING_NEOSOL_SELECTED")}`
                myToast(message, "red", "white", 2000)
            }
            setEcoSelection([...ecoSelection, id])
            setEcoConfortIdentity({...ecoConfortIdentity, ecoObjects:[...ecoConfortIdentity.ecoObjects, id]})
            pushToTypeList(id, ecoObjTypeName)
            setEcoConfGroupActions({ ...ecoConfGroupActions, [newAction]: [] })
        } else {
            //let newSelection = [...ecoSelection]
            let newSelection = [...ecoConfortIdentity.ecoObjects]
            newSelection.splice(position, 1);
            setEcoSelection(newSelection)
            setEcoConfortIdentity({...ecoConfortIdentity, ecoObjects:newSelection})
            removeToTypeList(id, ecoObjTypeName)
            let updateEcoActionByItemId = { ...ecoConfGroupActions };
            delete updateEcoActionByItemId?.[newAction]
            console.log("OBBBB :", JSON.stringify(updateEcoActionByItemId))
            console.log("A_AJOUTER_ACTION :", updateEcoActionByItemId)
            setEcoConfGroupActions(updateEcoActionByItemId);
        }
    }

    /**
     * 
     * @comment typeName is set to "Rolling_Shutter_Ezsp" to force all type of shutters 
     *          to be grouped in one single widget when configuring ecoconfort parameters.
     */
    function pushToEcoConfEquipmentsByTypeName(list){
        console.log('PUSH_TO_ECO_CONF :', list);
        let updatedObject={
            "Rolling_Shutter_Ezsp": [],
            "Venetian_Shutter_Ezsp": [],
            "Shade_Ezsp": []
        }
        list.map((item)=>{
            const id = Number(item)||item
            const objectDatas = getObjectById(id);
            console.log('PUSH_TO_ECO_CONF :', objectDatas);
            const typeName = "Rolling_Shutter_Ezsp"
            //const typeName = objectDatas?.typeName
            updatedObject[typeName].push(id);
        })
        setEcoConfEquipmentsByTypeName({...updatedObject})
    }


    function pushToTypeList(id, typeName){
        setEcoConfEquipmentsByTypeName({...ecoConfEquipmentsByTypeName, [typeName]:[...ecoConfEquipmentsByTypeName[typeName], id]})
    }
        
    function removeToTypeList(id, typeName){
        let newTypeList = [...ecoConfEquipmentsByTypeName[typeName]]
        newTypeList.splice(newTypeList.indexOf(id), 1)
        setEcoConfEquipmentsByTypeName({...ecoConfEquipmentsByTypeName, [typeName]:newTypeList})

    }

    const resetEcoConfortIdentity = (mode) => {
        let defaultInitialDate = mode == "winter" ? {day:21, month:10, hour:0,minute:0,} : {day:21, month:4, hour:0,minute:0,};
        let defaultEndDate = mode == "winter" ? {day:20, month:4, hour:23,minute:59,} : {day:20, month:10, hour:23,minute:59};

        let startTime = mode == "winter" ? "8:0" : "8:0";
        let stopTime = mode == "winter" ? "18:0" : "20:0";
        console.log('RESET_ECO_IDENTITY_1 :', mode);
        console.log('RESET_ECO_IDENTITY_2 :', defaultInitialDate, defaultEndDate);
        console.log('RESET_ECO_IDENTITY_3 :', startTime, stopTime);
        
        const resetIdentity ={
            ecoConfortId:null, ecoConfortName:null,mode:mode,sensorId:null,
            ecoObjects:[], summerTempTreshold:"25", winterTemptreshold:"10",
            summerBrightnessTreshold:"5000", winterBrightnessTreshold:"5000",
            activatedCronDate:defaultInitialDate, deactivatedCronDate:defaultEndDate,
            activeDays:[], startTime:startTime, stopTime:stopTime
        }
        console.log('RESET_ECO_IDENTITY_4 :', resetIdentity);
        setEcoConfortIdentity(resetIdentity)
        console.log('RESET_ECO_IDENTITY_5 :');
    }


    const updateEcoConfortAttribute = (key,value) => {
        setEcoConfortIdentity({...ecoConfortIdentity, [key]:value})
    }

    function extractActionsFromProgram(prog){
      let result = prog.reduce((acc, item) => {
        const myCron = item?.cron
        const duration = item?.duration
            acc[item?.value]= {cron:cronToDate(myCron), duration:duration}
            return acc;
        }, {})
        return result
    }

    function cronToDate(cron){
        const cronArray = cron.split(" ")
        const [minute, hour, day, month, week] = cronArray
        return {minute, hour, day, month, week}
    }

    const PARAMS = [
        "vr_season","shutters", "sondeLuminosite","sondeTemperature", "ste","sth","sle","slh","prog"
    ]


    function getActionOuterThresholdRange(actionName,ecoMode){
        console.log('GET_ACTION_OUTER :', actionName, ecoMode);
        const defaultAction = ecoMode == "summer"? "open":"closed"
        const myAction = (actionName == null || actionName == undefined )? defaultAction : actionName 
        shuttersActionConfig ={
            //"manual": ecoMode == "summer"? "open":"closed",
            "open": "OPEN",
            "closed": "CLOSE",
            "pos1":"FAV_CALL_1",
            "pos2":"FAV_CALL_2",
            "pos3":"FAV_CALL_3",
        }
        console.log('GET_ACTION_OUTER_2 :', shuttersActionConfig[myAction]);
        return shuttersActionConfig[myAction]
    }

    // Function to extract the key you want, excluding certain known keys
    function extractRemainingKey(obj, keysToExclude) {
        for (let key in obj) {
        if (!keysToExclude.includes(key)) {
            return key;
        }
        }
        return null; // If no matching key is found
    }

    function getIdForGroupedShuttersInEcoconfort(){
        const defaultTypeName = "Rolling_Shutter_Ezsp"
        return EcoConfortIconActionConfig[defaultTypeName].itemId
    }

    function initializeEcoConfortGroupAvtions(mode){
        const idTypeGroup = getIdForGroupedShuttersInEcoconfort()
        const myKey = `myActions_${idTypeGroup}`;
        let actionName = mode == "summer"? "OPEN":"CLOSE"
        setEcoConfGroupActions({ ...ecoConfGroupActions, [myKey]: [`${actionName}/${actionName}/${idTypeGroup}`] })
    }


    function initEcoConfortContext(name, ecoConfortId, parameters){
        console.log('HELLO_INIT :', name, ecoConfortId, parameters);

        const test = extractMultipleParamFromEcoConfort(parameters,PARAMS)
        const { vr_season:mode, shutters:ecoObjects, sondeLuminosite:sensorId, 
                sondeTemperature:sensorAlterId, ste:summerTempTreshold, sth:winterTemptreshold, 
                sle:summerBrightnessTreshold, slh:winterBrightnessTreshold,
                prog:prog
            } = test

        // UPDATE Prog  
        const extractedProg = prog? extractActionsFromProgram(JSON.parse(prog)): {}
        console.log('CHECK_PASSAGE_1 :', extractedProg);
        const currentActivatedDate = extractedProg?.activated?.cron
        const currentDeactivatedDate = extractedProg?.deactivated?.cron
        const climaticprog = extractedProg?.climatic?.cron
        const climaticDuration = extractedProg?.climatic?.duration
        const activeDays = climaticprog?.week.split(",").map(Number)||[]
        const startTime = `${climaticprog?.hour}:${climaticprog?.minute}`
        const endTimeMinutes = Number(climaticprog?.hour)*60 + Number(climaticprog?.minute) + Number(climaticDuration)
        const stopTime = convertMinutesToHoursMinutes(endTimeMinutes)
        let mySensor = sensorId || sensorAlterId

        console.log('CHECK_PASSAGE_1_2 :', activeDays, startTime, stopTime);
        const keysToExclude = ["activated", "deactivated", "climatic"];
        const actionKey = extractRemainingKey(extractedProg, keysToExclude);
        const actionName = getActionOuterThresholdRange(actionKey, mode)
        console.log('CHECK_PASSAGE_2 :',actionName);

        const idTypeGroup = getIdForGroupedShuttersInEcoconfort()
        const myKey = `myActions_${idTypeGroup}`;
        setEcoConfGroupActions({ ...ecoConfGroupActions, [myKey]: [`${actionName}/${actionName}/${idTypeGroup}`] })

        const listOfObjects = ecoObjects.split(",").map(Number)
        const tempObj = {
            ...ecoConfortIdentity,ecoConfortId:ecoConfortId,sensorId:mySensor,
            ecoConfortName:name, mode:mode, ecoObjects:listOfObjects,activeDays:activeDays,
            summerTempTreshold:summerTempTreshold, winterTemptreshold:winterTemptreshold,
            summerBrightnessTreshold:summerBrightnessTreshold, winterBrightnessTreshold:winterBrightnessTreshold,
            activatedCronDate:currentActivatedDate, deactivatedCronDate:currentDeactivatedDate,
            startTime:startTime, stopTime:stopTime
        }
        console.log("JE_PASSE_ICI :",tempObj)
        pushToEcoConfEquipmentsByTypeName(listOfObjects)
        setEcoConfortIdentity(tempObj)
        //const conf = getEcoConfortParametersToStore(ecoConfortId)
        //dispatch(updateEcoConfortParameter(ecoConfortId,parameters))
        //dispatch(updateEcoConfortParameter(ecoConfortId,"ste","25", parameters))
        console.log("JE_FINI_ICI :", ecoConfortId)
    }
    
    const ecoConfEdit = (ecoConfortId) => {
        console.log('BEGING_INIT :', ecoConfortId);
        const ecoDatas = getObjectById(ecoConfortId)
        const name = ecoDatas?.name
        let parameters = ecoDatas?.parameters ||[]
        console.log('CHECK_PASSAGE_1 :', parameters);
        initEcoConfortContext(name, ecoConfortId, parameters)       
    }

    function initializeEcoConfIdentity(ecoId, ecoName, ecoMode, sensorId){
        console.log('CHECK_200_4 :', ecoId, ecoName, ecoMode, sensorId);
        const getToday = new Date();
        const day = getToday.getDate();
        const month = getToday.getMonth()+1;
        const newIdentity = {
            ...ecoConfortIdentity,ecoConfortId:ecoId ,ecoConfortName: ecoName, mode: ecoMode, sensorId: sensorId,
            activatedCronDate: {minute:0, hour:0, day:day, month:month, week:"*"},
            deactivatedCronDate: {minute:0, hour:0, day:day, month:month, week:"*"}
        }
        setEcoConfortIdentity(newIdentity)

    }

    const initEditEcoConfort = (infos) => {
        const {ecoConfortId, ecoConfortName, mode, sensorId} = infos
        if (ecoConfortId){
            ecoConfEdit(ecoConfortId)
        }else{
            //initializeEcoConfIdentity(ecoConfortName, mode, sensorId)
        }

    }

    const updateEcoConfortIdentityActiveDays = (dayObject) => {
        console.log('DAY_CCHOSEN :', dayObject);
        const id = dayObject?.id
        const myDays = ecoConfortIdentity?.activeDays || []
        const position = myDays?.indexOf(id)
        if (position == -1) {
            const newDays = [...myDays, id]
            setEcoConfortIdentity({...ecoConfortIdentity, activeDays:newDays})
        } else {
            const newDays = [...myDays]
            newDays.splice(position, 1);
            setEcoConfortIdentity({...ecoConfortIdentity, activeDays:newDays})
        }
    }


    function buildCronExpression(cronObj){
        const {minute, hour, day, month, week} = cronObj
        return `${minute} ${hour} ${day} ${month} ${week}`
    }

    function buildDailyActionFromTimeSlot(actionValue,startTime, endTime){
        if(!startTime || !endTime) return 0
        const startH = startTime.split(":")[0]
        const startM = startTime.split(":")[1]
        const endH = endTime.split(":")[0]
        const endM = endTime.split(":")[1]
        const totalStartMinute = Number(startH)*60 + Number(startM)
        const totalEndMinute = Number(endH)*60 + Number(endM)
        const duration = totalEndMinute - totalStartMinute
        let toReturn;
        if(actionValue == "climatic"){
            const cronObj = {
                minute:Number(startM), 
                hour:Number(startH),
                day:"*",
                month:"*",
                week:ecoConfortIdentity?.activeDays.join(",")
            }
            const cron = buildCronExpression(cronObj)
            toReturn =  {"cron":cron, "value":actionValue, "duration":duration}
        }else{
            const cronObj = {
                minute:Number(endM), 
                hour:Number(endH),
                day:"*",
                month:"*",
                week:ecoConfortIdentity?.activeDays.join(",")
            }
            const cron = buildCronExpression(cronObj)
            toReturn = {"cron":cron, "value":actionValue}
        }

        return toReturn
    }


    function buildProgramCron(paramsValues){
        console.log('HEY_BUILD_PROGRAM_CRON :', paramsValues);
        const params = paramsValues.reduce((acc,value)=>{
            switch(value){
                case "activated":
                    acc.push( {"cron": buildCronExpression(ecoConfortIdentity?.activatedCronDate), value:"activated"} )
                    break;
                case "deactivated":
                    acc.push({"cron": buildCronExpression(ecoConfortIdentity?.deactivatedCronDate), value:"deactivated"} )
                    break;
                default:
                    acc.push(buildDailyActionFromTimeSlot(value, ecoConfortIdentity?.startTime, ecoConfortIdentity?.stopTime))
            }
            return acc
        },[])
        const result = JSON.stringify(params)
        console.log('BUILD_PROGRAM_CRON :', result);
        return result
    }

    //////////////-- Create EcoConfort --////////////////////////

    const ecoConforttemporaryIdRef = useRef(null);

    const setEcoIdRef = (id) => {
        ecoConforttemporaryIdRef.current = id
    }

    const getEcoIdRef = () => {
        return ecoConforttemporaryIdRef.current
    }

    ////////- Simple Creation of EcoConfort -////////////////////
    async function createEcoConfort (name, mode, sensorId, paramsValues){
        const prog = buildProgramCron(paramsValues)
        const body = {
            name: name,
            realName: name,
            parameters:[
                {name:"vr_season", value:mode},
                {name:"shutters", value:ecoConfortIdentity?.ecoObjects},
                {name:"sondeLuminosite", value:sensorId},   
                {name:"sondeTemperature", value:sensorId},
                {name:"prog", value:prog}
            ]
        }
        const result = await ApiObjects.createEcoConfortApplication(body).catch((err) => console.log(err));
        console.log('CREATE_ECO_SERVER_RESPONSE :', result, body);
        if(result?.errCode == 200){
            // const ecoConfId = result?.id
            // initializeEcoConfIdentity(ecoConfId, name, mode, sensorId)
            // setEcoIdRef(ecoConfId)
            // console.log('CHECK_200_3 :');
            // navigation.navigate('EcoConfortDatePickerScreen')
        }else{
            console.log('CHECK_400_1 :');
            const errCode = result?.errCode;
            const errMsg = result?.errMsg;
            const message = `${t(tns + ":" + "SERVER_ERROR")} : ${errCode} ${errMsg}`
            myToast(message)
            navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
        }
        return result
    }

    /////////////-end of simple creation of EcoConfort-////////////


///////////////////////////////////////////////////////////////////
    const updateEcoConfort = async (ecoId, paramsValues) => {
        console.log('CREATE_ECO_CONFORT :', ecoConfortIdentity, paramsValues);
        //const ecoId = ecoConfortIdentity?.ecoConfortId
        const prog = buildProgramCron(paramsValues)
        console.log('CREATE_ECO_CONFORT_PROG :', prog);
        const body = {
            id: ecoId,
            name: ecoConfortIdentity?.ecoConfortName,
            realName: ecoConfortIdentity?.ecoConfortName,
            parameters:[
                {name:"vr_season", value:ecoConfortIdentity?.mode},
                {name:"shutters", value:ecoConfortIdentity?.ecoObjects},
                {name:"sondeLuminosite", value:ecoConfortIdentity?.sensorId},   
                {name:"sondeTemperature", value:ecoConfortIdentity?.sensorId},
                {name:"ste", value:ecoConfortIdentity?.summerTempTreshold},
                {name:"sth", value:ecoConfortIdentity?.winterTemptreshold},
                {name:"sle", value:ecoConfortIdentity?.summerBrightnessTreshold},
                {name:"slh", value:ecoConfortIdentity?.winterBrightnessTreshold},
                {name:"prog", value:prog}
            ]
        }

        console.log('CREATE_ECO_CONFORT_BODY :', body);

        const result = await ApiObjects.updateEcoConfortApplication(body).catch((err) => console.log(err));
        console.log('Check_REACH :', result);
        if(result?.errCode == 200){
            console.log('UPDATE_ECO_SERVER_RESPONSE_YEP :', result);
            setEcoTargetForDelete()
            // TODO UPDATE STORE WITH NEW VALUES
            console.log('UPDATE_ECO_SERVER_RESPONSE :', result);
            const ecoConfData = result?.res?.data?.resource
            const ecoName = ecoConfData?.name
            const parameters = ecoConfData?.parameters

            const resource = result?.res?.data?.resource
            //const serverCreatedDate = resource?.created // 1740042892 671
            const createdDate = new Date()
            const targetMonth = createdDate.getMonth()+1
            const targetDay = createdDate.getDate()

            const startMonth = ecoConfortIdentity?.activatedCronDate?.month;
            const startDay = ecoConfortIdentity?.activatedCronDate?.day;
            const endMonth = ecoConfortIdentity?.deactivatedCronDate?.month;
            const endDay = ecoConfortIdentity?.deactivatedCronDate?.day;
            const flag = isDateInRange(targetMonth, targetDay, startMonth, startDay, endMonth, endDay)

            console.log('CHECK_200_2 :', String(createdDate),targetMonth, targetDay, flag);

            const actionName = objectUpdateProperty(ecoId, 'name', ecoName);
            dispatch(actionName);
            console.log('REFRESH_OBJECT_0');
            const refreshWeeklyPlanner = await refreshObjectAction(weeklyPlannerId, store).catch((err) => console.log("ERROR_REFRESH_WEEKLY_PLANNER :",err)); 
            console.log('refreshWeeklyPlanner :', refreshWeeklyPlanner);
            if(refreshWeeklyPlanner?.errCode == 200){
                const daysOfWeek = refreshWeeklyPlanner?.res?.data?.resource?.daysOfWeek
                const dailyRoutinesInfos = extractDailyRoutines(daysOfWeek, getCurrentDay())
                setPlanningDaysDatas(daysOfWeek)
                setDailyRoutines(dailyRoutinesInfos)
            }
            const refreshMyEcoApp = await refreshObjectAction(ecoId, store).catch((err) => console.log("ERROR_REFRESH_ECOCONF_APP :",err)); 
            console.log('refreshMyEcoApp :', refreshMyEcoApp);

            // console.log('REFRESH_OBJECT :', refreshMyEcoApp);
            // dispatch(actionParams);
            // RESET ECO CONFORT IDENTITY
            resetEcoConfortIdentity("summer")
            navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
        }else{
            console.log('UPDATE_ECO_SERVER_RESPONSE_ERROR :', result);
            const errCode = result?.errCode;
            const errMsg = result?.errMsg;
            const message = `${t(tns + ":" + "SERVER_ERROR")} : ${errCode} ${errMsg}`
            myToast(message)
            // RESET ECO CONFORT IDENTITY
            resetEcoConfortIdentity("sumer")
            navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
        }
        return result
    }
///////////////////////////////////////////////////////////////////

    return {
        ecoConfGroupActions, setEcoConfGroupActions,
        initEditEcoConfort,
        updateEcoConfortActions,
        onclickObjectForEcoConfort,
        ecoSelection, setEcoSelection,
        ecoConfortIdentity, setEcoConfortIdentity,resetEcoConfortIdentity, updateEcoConfortAttribute,
        ecoConfEquipmentsByTypeName, setEcoConfEquipmentsByTypeName,
        ecoConfSelectedAction, setEcoConfSelectedAction, 
        ecoConfIconState, setEcoConfIconState,
        pushToEcoConfEquipmentsByTypeName,
        updateEcoConfortIdentityActiveDays,
        buildProgramCron,
        createEcoConfort,
        updateEcoConfort,
        weeklyPlannerId,
        getEcoIdRef, setEcoIdRef,
        initializeEcoConfortGroupAvtions, 
        getCurrentDay,
        //InitializeServerEcoConfort,
        ecoTargetForDelete, setEcoTargetForDelete
        
    }
}
