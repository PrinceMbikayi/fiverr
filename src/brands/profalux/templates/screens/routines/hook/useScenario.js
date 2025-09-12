import '_brand/templates/screens/routines/locales'
import React, { useContext, useEffect, useState } from "react";
import { getObjectById } from '_helpers/objects';
import * as ApiObjects from "_api/objects"
import { Api } from '_api';
import { processMyAction, saveMyActions } from '_brand/templates/screens/routines/context/tools';
import { getObjectsVisible, getObjectsByTypes, getObjectsByTypeName } from '_helpers/selectors';
import { useSelector, useDispatch, useStore } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { refreshObjectAction } from '_actions/asyncActions';
import { objectUpdateProperty, updateStatus as updateStatusAction } from '_actions/objects';
import { useObject } from '_hooks/object';
import { getRoutinePossibleObject } from '_brand/templates/screens/routines/components/utils'
import { extractPickerDatas, extractPlannerTime, constructOArgs } from '_brand/templates/screens/routines/utils/transformPickerDatas'
import * as Actions from '_actions/objects';
import { appRefresh } from '_actions/app';
import { routinesWithTheirPlannedDays } from '_brand/templates/screens/routines/services/routinesWithTheirPlannedDays'
import { ScenarioContext } from '_brand/templates/screens/routines/context'
import { myToast } from '_brand/templates/components/ui/myToast';
import { extractDailyRoutines } from '_brand/templates/screens/routines/utils/index'
import routineIconActionConfig from "_brand/templates/screens/routines/config/routineIconActionConfig"
import EcoConfortIconActionConfig from "_brand/templates/screens/routines/config/EcoConfortIconActionConfig"

/**
 * 
 * @returns {void} Glop
 */
export const useScenario = () => {

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "routine";
    const dispatch = useDispatch();
    const store = useStore()

    if (useContext(ScenarioContext) == undefined) return {}

    const { isRoutine, setIsRoutine, actionsByItemId, initEditRoutine, selectedAction, setSelectedAction,
        setActionsByItemId, routineId, setRoutineId, routineName, setRoutineName, resetCurrentDay, getRoutines,
        onclickObject, selection, resetSelection, selectable, selectedRoutineTrigger, updateSelectedRoutineTrigger,
        plannerDays, updatePlannerDays, setPlanningDaysDatas,
        routineListAssociatedDays, setroutineListAssociatedDays,iconState, setIconState,
        // Now planning context shared
        selectedDay,
        updateDaySelection,
        dayActive,
        dailyRoutines,
        setDailyRoutines,
        updateRoutineId,
        planningCurrentTrigger,
        updatePlanningCurrentTrigger,
        getCurrentDay,
        daysAlreadyInUse,
        setDaysAlreadyInUse, updateDaysAlreadyInUse, myDays, setMyDays,
        onClickDayObject,
        numberOfDays,
        setNumberOfDays,
        saveProgrammation,
        updateSaveProgrammation,
        program, setProgram, resetProgram, setSaveProgrammation,
        updateRoutineOrPlanningRoot,routineMenu,
        loading, setLoading,
        // ECO-CONFORT
        onclickObjectForEcoConfort,
        ecoSelection, setEcoSelection,
        weeklyPlanner
    } = useContext(ScenarioContext);


    const updateActions = (objectAction) => {
        console.log("HERE_updateActions :", objectAction)
        handleAction(objectAction)
        const id = objectAction.split("/").pop()
        let itemId = id != undefined ? Number(id) : -1
        const objData = getObjectById(itemId)
        const typeName = objData?.typeName
        const action = objectAction.split("/").splice(0, 1)
        const actionSpec = objectAction.split("/").splice(0, 2).join("/")
        const configObject = routineIconActionConfig[typeName][actionSpec];
        const icon = configObject?.iconName;
        const iconLabel = configObject?.label;

        if (action != "TILT") {
            setIconState({ "icon": icon, "label": iconLabel })
        }
        setSelectedAction(objectAction)
    }


    const processActions = (objectAction) => {
        const dopo = processMyAction({ objectAction, actionsByItemId })
        const { myKey, myActions } = dopo;
        const updatedAction = { [myKey]: myActions };
        const newActionsByItemIdItem = { ...actionsByItemId, ...updatedAction }
        console.log("processActions :",processMyAction({ objectAction, actionsByItemId }))
        setActionsByItemId({ ...newActionsByItemIdItem })
    }

    const handleAction = (objectAction) => {
        //console.log("here ------------- handleAction_1 : ", objectAction)
        processActions(objectAction)
    }

    const saveActions = (actionsByItemId) => {
        console.log("SCRIPT_ACTIONS_TO_POST :", actionsByItemId)
        const result = saveMyActions(actionsByItemId);
        console.log("SCRIPT_ACTIONS_TO_POST_RESULT :", actionsByItemId)
        return result
    }

    const saveRoutine = async () => {
        console.log(" CHECK_MY_ACTIONS My_Scripts :", actionsByItemId)
        const scriptActions = saveActions(actionsByItemId)
        console.log("CHECK_MY_ACTIONS_IN_SAVE_ROUTINE :", scriptActions)
        console.log('MONTRER_ID_ROUTINE_SAVE_ROUTINE :', routineId);

        if (routineId && routineId != undefined) {
            // Modify existing scenario
            const requestModifyScenario = await ApiObjects.modifyScenario(routineId, routineName, scriptActions)
            console.log("JETEST_ :", routineName, scriptActions)
            console.log("SCENARIO_MODIFY :", requestModifyScenario)
            if (requestModifyScenario.errCode == 200) {
                const sceneId = requestModifyScenario.id;
                console.log('MONTRER_ID_ROUTINE_SAVE_VS_NEW :', routineId, sceneId);
                setRoutineId(sceneId)
                const sceneName = (getObjectById(sceneId))?.name
                setRoutineName(sceneName)
                resetSelection([])
                setActionsByItemId({})
                // creation/update of new status must be sent in a JSON.stringify format
                const addStatusRequest = await Api.addStatus(sceneId, "__user_actionsByItemId", JSON.stringify(actionsByItemId));
                console.log("SEE_MODIFY :", actionsByItemId, addStatusRequest)

                if (addStatusRequest.errCode == 200) {
                    const actionName = objectUpdateProperty(sceneId, 'name', routineName);
                    const actionScript = objectUpdateProperty(sceneId, 'scriptActions', scriptActions);
                    const actionAddStatus = updateStatusAction(sceneId, "__user_actionsByItemId", JSON.stringify(actionsByItemId))
                    dispatch(actionAddStatus)
                    dispatch(actionName)
                    dispatch(actionScript)
                    console.log('BEGIN_REFRESH_ROUTINE_OBJECT');
                    refreshObjectAction(sceneId, store).catch((err) => console.log(err));
                    console.log('END_REFRESH_ROUTINE_OBJECT');
                }

                dispatch(appRefresh());
                return requestModifyScenario
            }

        } else {
            // Creation of new Scenario
            console.log("ROUTINE_NAME :", routineName)
            const requestCreateScenario = await ApiObjects.createScenario(2001, routineName, scriptActions);
            console.log("Scenario has been created :::::::", requestCreateScenario)
            if (requestCreateScenario.errCode == 200) {
                const sceneId = requestCreateScenario.id;
                setRoutineId(sceneId)
                // creation/update of new status must be sent in a JSON.stringify format
                const addStatusRequest = await Api.addStatus(sceneId, "__user_actionsByItemId", JSON.stringify(actionsByItemId));
                console.log("SEE :", actionsByItemId, addStatusRequest)
                if (addStatusRequest.errCode == 200) {
                    const actionAddStatus = updateStatusAction(sceneId, "__user_actionsByItemId", JSON.stringify(actionsByItemId))
                    dispatch(actionAddStatus)
                    refreshObjectAction(sceneId, store).catch((err) => console.log(err));
                }
                dispatch(appRefresh());

            } else {
                if (requestCreateScenario.errMsg == "object_exists") {
                    setLoading(false)
                    const message = `${t(tns + ":" + "ROUTINE_EXISTS")}`
                    myToast(message)
                }
            }

            return requestCreateScenario;
        }

    }

    const scheduleRoutine = async (routineId) => {

        let actions;
        console.log('MONTRER_ID_ROUTINE_SCHEDULE :', routineId);
        if (numberOfDays != 0) {
            const lastAction = updateSaveProgrammation(routineId)
            actions = [...saveProgrammation, lastAction]
        } else {
            actions = [...saveProgrammation]
        }
        console.log('saveProgrammation :', numberOfDays, saveProgrammation, actions);

        await actions.reduce(async (accumulator, action, index) => {
            await accumulator;
            const mArgsCopy = [...action.mArgs]
            const newMArgs = [...action.mArgs, { "name": "objectId", "value": routineId }]
            action.mArgs = newMArgs
            const requestCreatePlanner = await ApiObjects.createWeeklyPlanner(action).catch((err) => { console.log(err) });
            console.log('CREATE_SCHEDULE_' + index + ":", action, requestCreatePlanner);
            if (requestCreatePlanner.errCode == 200) {
                // at the last action
                if(index == actions.length - 1){
                    const daysOfWeek = requestCreatePlanner?.res?.data?.resource?.daysOfWeek
                    const plannerId = requestCreatePlanner.id;
                    const action = Actions.objectUpdateProperty(plannerId, 'daysOfWeek', daysOfWeek);
                    dispatch(action);
                    setPlanningDaysDatas(daysOfWeek)
                    console.log('BEGIN_REFRESH_ROUTINE_OBJECT');
                    refreshObjectAction(routineId, store).catch((err) => console.log(err));
                    console.log('END_REFRESH_ROUTINE_OBJECT');
                    setDaysAlreadyInUse([])
                    setMyDays([])
                    resetProgram()
                    setSaveProgrammation([])
                    resetSelection([])
                    setActionsByItemId({})
                    const dailyRoutinesInfos = extractDailyRoutines(daysOfWeek, dayActive)
                    setDailyRoutines(dailyRoutinesInfos)
                }
            } else {
                console.log('ERROR_Schedule_THIS :', requestCreatePlanner,);
                const errCode = requestCreatePlanner?.errCode;
                const errMsg = requestCreatePlanner?.errMsg;
                let message;
                if (plannerDays.length == 0) {
                    message = `${t(tns + ":" + "SELECT_AT_LEAST_ONE_DAY")}`
                } else {
                    message = `${t(tns + ":" + "SERVER_ERROR")} : ${errCode} ${errMsg}`
                    setLoading(false)
                }
                myToast(message)
                console.log('ERROR_Schedule :', requestCreatePlanner.errCode,);
                setDaysAlreadyInUse([])
                setMyDays([])
                resetProgram()
                setSaveProgrammation([])
                resetSelection([])
                setActionsByItemId({})
            }
            setDaysAlreadyInUse([])
            setMyDays([])
            dispatch(appRefresh());
            navigation.navigate("RoutinesHomeScreen")
        }, Promise.resolve())
        setLoading(false)
    }


    // Now Planning context
    const removeTriggerObjectDay = async (routineId, selectedDay, triggerId) => {
        // REMOVE_TRIGGER_OBJECT_DAY
        console.log('SELCTED_DAY_IN :', selectedDay);
        const delecteAction = {
            //"name": "REMOVE_OBJECT_DAY",
            "name": "REMOVE_TRIGGER_OBJECT_DAY",
            "mArgs": [
                { "name": "objectId", "value": routineId },
                { "name": "dayId", "value": selectedDay },
                { "name": "triggerId", "value": triggerId },
            ]
        }
        console.log('DELETE_ACTION_0 :', delecteAction);
        const requestRemoveTriggerFromDay = await ApiObjects.createWeeklyPlanner(delecteAction);
        console.log('REMOVE_TRIGGER_FROM_DAY :', requestRemoveTriggerFromDay);

        return requestRemoveTriggerFromDay
    }

    const modifyPlanning = async () => {
        const oArgs = constructOArgs(selectedRoutineTrigger)
        const currentTriggerId = planningCurrentTrigger?.triggerId
        const currentTriggerType = planningCurrentTrigger?.type
        const newTriggerType = selectedRoutineTrigger?.type
        console.log("TRIGGER_UPDATE_HOO_ID :", selectedRoutineTrigger)

        if (currentTriggerType == 'time') {
            if (newTriggerType == "event") {
                const resultRemove = await removeTriggerObjectDay(routineId, selectedDay, planningCurrentTrigger?.triggerId)
                console.log('REMOVE_TRIGGER_FROM_DAY :', resultRemove);
                if (resultRemove.errCode == 200) {
                    console.log('CHECK_SELECTED_DAY_0 :', selectedDay);
                    addRoutineToPlanningDay()
                }

            } else {
                console.log('SELCTED_DAY_IN :', selectedDay);
                const mArgs = [
                    {
                        "name": "dayId", "value": selectedDay
                    },
                    { "name": "objectId", "value": routineId },
                    { "name": "triggerId", "value": currentTriggerId },
                    { "name": "action", "value": "EXECUTE" }
                ]

                console.log("CHECK_ARGS :", mArgs)
                const action = {
                    "name": "UPDATE_OBJECT_DAY",

                    "mArgs": mArgs,
                    "oArgs": oArgs
                }
                console.log("CCCCC :", action)
                const requestModifyPlannerTime = await ApiObjects.createWeeklyPlanner(action);
                console.log("UPDATE_OBJECT_DAY_RESPONSE :", requestModifyPlannerTime)

                if (requestModifyPlannerTime.errCode == 200) {
                    const plannerId = requestModifyPlannerTime.id;
                    const daysOfWeek = requestModifyPlannerTime?.res?.data?.resource?.daysOfWeek
                    console.log("UPDATE_OBJECT_DAY_200 :", requestModifyPlannerTime)
                    const action = Actions.objectUpdateProperty(plannerId, 'daysOfWeek', daysOfWeek);
                    console.log("UPDATE_OBJECT_DAY_200_DISPATCH :", daysOfWeek)
                    dispatch(action);
                    setPlanningDaysDatas(daysOfWeek)
                    const dailyRoutinesInfos = extractDailyRoutines(daysOfWeek, selectedDay)
                    setDailyRoutines(dailyRoutinesInfos)
                    // navigation.navigate("PlanningStack", {screen:"PlanningHomeScreen"})
                    navigation.navigate("PlanningHomeScreen")
                }
            }

        } else {
            //currentTriggerType =  event
            const resultRemove = await removeTriggerObjectDay(routineId, selectedDay, planningCurrentTrigger?.triggerId)
            console.log('REMOVE_TRIGGER_FROM_DAY :', resultRemove);
            if (resultRemove.errCode == 200) {
                console.log('CHECK_SELECTED_DAY_0 :', selectedDay);
                addRoutineToPlanningDay()
            }


        }

    }


    const addRoutineToPlanningDay = async () => {

        console.log('POINT_SELECTED_DAY :', selectedDay);
        const oArgs = constructOArgs(selectedRoutineTrigger)
        console.log('VIEW_TRIGGER_FOR_CREATE_PLANNING :', selectedRoutineTrigger);

        const action = {
            //"name": "ADD_OBJECT_DAY",
            "name": "ADD_TRIGGER_OBJECT_DAY",

            "mArgs": [
                {
                    "name": "dayId", "value": selectedDay
                },
                { "name": "objectId", "value": routineId },
                { "name": "action", "value": "EXECUTE" }
            ],

            "oArgs": oArgs
        }
        console.log("CHECK_ACTION :", selectedRoutineTrigger, selectedDay, action)

        const requestAddRoutineToPlanningDay = await ApiObjects.createWeeklyPlanner(action);
        console.log("REQUEST_ADD_OBJECT_DAY :", JSON.stringify(requestAddRoutineToPlanningDay), selectedRoutineTrigger, selectedDay, action)

        if (requestAddRoutineToPlanningDay.errCode == 200) {
            const plannerId = requestAddRoutineToPlanningDay.id;
            const daysOfWeek = requestAddRoutineToPlanningDay?.res?.data?.resource?.daysOfWeek
            console.log("ADD_OBJECT_DAY_200 :", requestAddRoutineToPlanningDay)
            const action = Actions.objectUpdateProperty(plannerId, 'daysOfWeek', daysOfWeek);
            dispatch(action);
            setPlanningDaysDatas(daysOfWeek)
            const dailyRoutinesInfos = extractDailyRoutines(daysOfWeek, selectedDay)
            setDailyRoutines(dailyRoutinesInfos)
            refreshObjectAction(routineId, store).catch((err) => console.log(err));
            //navigation.navigate("RoutinesHomeScreen")
            navigation.navigate("PlanningHomeScreen")
        } else {
            const errCode = requestAddRoutineToPlanningDay?.errCode;
            const errMsg = requestAddRoutineToPlanningDay?.errMsg;
            const message = `${t(tns + ":" + "SERVER_ERROR")} : ${errCode} ${errMsg}`
            myToast(message)
        }

    }


    return {
        updateActions, isRoutine, initEditRoutine, selectedAction, setSelectedAction,
        actionsByItemId, setActionsByItemId, handleAction, saveActions, resetCurrentDay,
        routineId, setRoutineId, routineName, setRoutineName, saveRoutine, scheduleRoutine, saveProgrammation,
        getRoutines, 
        onclickObject, selection, selectable, resetSelection,
        selectedRoutineTrigger, updateSelectedRoutineTrigger,
        plannerDays, updatePlannerDays, setPlanningDaysDatas,
        routineListAssociatedDays, setroutineListAssociatedDays,
        iconState, setIconState,
        // Now planning context shared
        selectedDay,
        updateDaySelection,
        dayActive,
        dailyRoutines,
        setDailyRoutines,
        updateRoutineId,
        planningCurrentTrigger,
        updatePlanningCurrentTrigger,
        modifyPlanning,
        addRoutineToPlanningDay,
        getCurrentDay,
        daysAlreadyInUse,
        setDaysAlreadyInUse, updateDaysAlreadyInUse, myDays, setMyDays,
        onClickDayObject,
        numberOfDays,setNumberOfDays,
        updateSaveProgrammation,
        saveProgrammation, resetProgram, setSaveProgrammation,
        program, setProgram, updateRoutineOrPlanningRoot,routineMenu,
        loading, setLoading,
        // ECO-CONFORT
        onclickObjectForEcoConfort,
        ecoSelection, setEcoSelection,
        weeklyPlanner
    }

}
