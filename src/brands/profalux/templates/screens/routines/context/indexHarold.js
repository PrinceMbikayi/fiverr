import '_brand/templates/screens/routines/locales'
import React, { useContext, useEffect, useState } from "react";
import { getObjectById } from '_helpers/objects';
import * as ApiObjects from "_api/objects"
import { getObjectsVisible, getObjectsByTypes, getObjectsByTypeName } from '_helpers/selectors';
import { useSelector, useDispatch, useStore } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { getRoutinePossibleObject } from '_brand/templates/screens/routines/components/utils'
import { routinesWithTheirPlannedDays } from '_brand/templates/screens/routines/services/routinesWithTheirPlannedDays'
import { extractDailyRoutines } from '_brand/templates/screens/routines/utils/index'
import { extractPlannerTime, constructOArgs, extractPickerDatas, ExtractTime } from '_brand/templates/screens/routines/utils/transformPickerDatas'
import moment from 'moment/min/moment-with-locales';
import routineIconActionConfig from "_brand/templates/screens/routines/config/routineIconActionConfig"
import '_brand/templates/screens/routines/locales'

export const ScenarioContext = React.createContext();

export const ScenarioContextProvider = ({ children, ...props }) => {

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const weeklyPlannerId = useSelector(state => getObjectsByTypeName(state, 'WeeklyPlanner') || []);
    const weeklyPlanner = useObject(weeklyPlannerId)
    const daysOfWeek = weeklyPlanner?.objectDatas?.daysOfWeek || []
    console.log("WEEKLYPLANNER_PLANNING_SCREEN :", daysOfWeek)

    const objectsTypes = useSelector(getObjectsByTypes)
    const objectsVisible = useSelector(getObjectsVisible);

    const scenarios = useSelector(state => getObjectsByTypeName(state, "Associations")) || [];
    const compositeList = useSelector(getObjectsByTypes)["Composite"] || [];
    //Harold: "Changed"  on : 04/10/2024 in order to allow Scenario to show Groups for selectable items
    //const objectsToExclude = getRoutinePossibleObject(["Weather", "Sonde", "Netatmo", "Remote", "WeeklyPlanner"], objectsTypes)
    const objectsToExclude = getRoutinePossibleObject(["Composite", "Weather", "Sonde", "Netatmo", "Remote", "WeeklyPlanner"], objectsTypes)

    const [planningDaysDatas, setPlanningDaysDatas] = useState(daysOfWeek);
    const [routineId, setRoutineId] = useState();
    const [isRoutine, setIsRoutine] = useState(true)
    const [actionsByItemId, setActionsByItemId] = useState({});
    const [routineName, setRoutineName] = useState("");
    const [selection, setSelection] = useState([]);
    const [ecoSelection, setEcoSelection] = useState([]);
    const [selectable, setSelectable] = useState([]);
    const [selectedRoutineTrigger, setSelectedRoutineTrigger] = useState({});
    const [plannerDays, setPlannerDays] = useState([]);
    const [routineListAssociatedDays, setroutineListAssociatedDays] = useState([]);
    const [selectedAction, setSelectedAction] = useState();
    
    const [daysAlreadyInUse, setDaysAlreadyInUse] = useState([]);
    const [myDays, setMyDays] = useState([]);
    const [numberOfDays, setNumberOfDays] = useState(0);
    
    const [routineMenu, setRoutineMenu] = useState({routineOrPlanning: 'routine', title: `${t(tns + ":" + "MY_ROUTINES")}`});
    const [iconState, setIconState] = useState({icon: "bsoOpenIcon", label: ""});
    
    
    // ECO-CONFORT
    const [version, setVersion] = useState(null);
    const [ecoConfGroupActions, setEcoConfGroupActions] = useState({});
    const [ecoConfSelectedAction, setEcoConfSelectedAction] = useState(null);
    const [ecoConfortIdentity, setEcoConfortIdentity] = useState(
                {   ecoConfortId:null, ecoConfortName:null,mode:"summer",sensorId:null,
                    ecoObjects:[], summerTempTreshold:"20", winterTemptreshold:"5",
                    summerBrightnessTreshold:"*", winterBrightnessTreshold:"*",
                    activatedCronDate:{}, deactivatedCronDate:{},
                    activeDays:[], startTime:"7:0", stopTime:"18:0"
                }
        );
    const [ecoConfIconState, setEcoConfIconState] = useState({icon: "bsoOpenIcon", label: ""});
    const [ecoConfEquipmentsByTypeName, setEcoConfEquipmentsByTypeName] = useState({
        "Rolling_Shutter_Ezsp": [],
        "Venetian_Shutter_Ezsp": [],
        "Shade_Ezsp": []
    });


    const getCurrentDay = () => {
        const getDate = new Date();
        const todayDay = getDate.getDay()
        return Number(todayDay) + 1;
    }

    //====== Planning context import 
    const [selectedDay, setSelectedDay] = useState(getCurrentDay());
    const [dayActive, setDayActive] = useState(getCurrentDay());
    const [dailyRoutines, setDailyRoutines] = useState([]);
    const [planningCurrentTrigger, setPlanningCurrentTrigger] = useState({});
    const [saveProgrammation, setSaveProgrammation] = useState([]);
    const [program, setProgram] = useState([]);
    const [loading, setLoading] = useState(false);


    const updateRoutineOrPlanningRoot = (route) => {
        //setRoutineOrPlanning(route)
        const title = route == "routine" ? `${t(tns + ":" + "MY_ROUTINES")}` : `${t(tns + ":" + "MY_PLANNING")}`
        //setTitle(title)
        setRoutineMenu({routineOrPlanning: route, title: title})
    }

    const onClickDayObject = (dayObject) => {
        console.log('TROO :', numberOfDays);
        const id = dayObject?.id
        const position = myDays?.indexOf(id)
        if (position == -1) {
            const newDays = [...myDays, id]
            const nb = numberOfDays + 1
            console.log('NB :', numberOfDays);
            const number = newDays.length
            setNumberOfDays(nb)
            setMyDays(newDays)
            updatePlannerDays(newDays)
            //updateDaysAlreadyInUse(newDays)
        } else {
            const newDays = [...myDays]
            newDays.splice(position, 1);
            const nb = numberOfDays - 1
            const number = newDays.length
            setNumberOfDays(nb)
            setMyDays(newDays)
            updatePlannerDays(newDays)
            //updateDaysAlreadyInUse(newDays)
        }
    }

    const resetCurrentDay = () => {
        const day = getCurrentDay()
        setDayActive(day)
    }

    const updateSelectedRoutineTrigger = (trigger) => {
        console.log('SHOW_TRIGGER :', trigger);
        setSelectedRoutineTrigger(trigger)
    }

    const updatePlannerDays = (days) => {
        const daysString = days.toString();
        console.log('ARRAY_DAYS_TO_STRING :', daysString);
        setPlannerDays(days)
    }


    const onclickObject = (id) => {
        const objectData = getObjectById(id)
        const typeName = objectData?.typeName
        const isLightClass = ["LightEzsp", "SwitchEzsp"].includes(typeName)
        const position = selection?.indexOf(id)
        console.log("A_AJOUTER :", id)

        const newAction = `myActions_${id}`;
        if (position == -1) {
            setSelection([...selection, id])
            setActionsByItemId({ ...actionsByItemId, [newAction]: [] })
        } else {
            let newSelection = [...selection]
            newSelection.splice(position, 1);
            setSelection(newSelection)
            let upDateActionByItemId = { ...actionsByItemId };
            delete upDateActionByItemId?.[newAction]
            console.log("OBBBB :", JSON.stringify(upDateActionByItemId))
            console.log("A_AJOUTER_ACTION :", upDateActionByItemId)
            setActionsByItemId(upDateActionByItemId);
        }
    }

    
    const putSelectionInEcoConfig = (ids) => {
        ids.map((id) => {
            const objectDatas = getObjectById(id);
            const typeName = objectDatas?.typeName
            switch(typeName){
                case "Rolling_Shutter_Ezsp":
                    
                    ecoClassified['Rolling_Shutter_Ezsp'].objects.push(id)
                    break
                case "Venetian_Shutter_Ezsp":
                    ecoClassified["Venetian_Shutter_Ezsp"].objects.push(id)
                    break
                case "Shade_Ezsp":
                    ecoClassified["Shade_Ezsp"].objects.push(id)
            }
        })
    }


    const initEditRoutine = (routineId) => {
        console.log("JE_PASSE_ICI :", routineId)
        if (routineId == undefined) return true;

        const routineDatas = getObjectById(routineId)
        const routineScripts = routineDatas?.scriptActions || []
        const retrieveActions = routineDatas?.statusDictionary?.__user_actionsByItemId
        const myActions = retrieveActions ? JSON.parse(retrieveActions) : []
        const userPreviousActions = myActions != undefined && myActions
        console.log("ROUTINE_DATA_SCRIPTS :", userPreviousActions)
        setRoutineName(routineDatas?.name)
        setRoutineId(routineId)
        setActionsByItemId(userPreviousActions)

        let sceneObjects = []
        routineScripts.map((item) => {
            sceneObjects.push(Number(item.objectId))
        })
        const listWithNoDuplicate = [...new Set(sceneObjects)]
        console.log("LIST_NO_DUPLICATE :", listWithNoDuplicate)
        setSelection(listWithNoDuplicate)
    }

    // Now begin planning context method 
    const updateRoutineId = (id) => {
        setRoutineId(id)
    }


    const updatePlanningCurrentTrigger = (trigger) => {
        setPlanningCurrentTrigger(trigger)
    }

    const updateDaySelection = (dayIndex) => {
        setDayActive(dayIndex)
        setSelectedDay(dayIndex)
    }

//####======================================================================####

    useEffect(() => {

    }, [loading]);

    useEffect(() => {
        const fetchDaysOfWeek = async () => {
            const response = await ApiObjects.getObject(weeklyPlannerId)
            if (response.errCode == 200) {
                const daysOfWeek = response?.res?.data?.resource?.daysOfWeek || []
                setPlanningDaysDatas(daysOfWeek)
                console.log('FIRST_LOAD_DAYS_OF_WEEK1 :', response);
                const routineListAssociatedDays = routinesWithTheirPlannedDays(daysOfWeek)
                console.log('FIRST_LOAD_DAYS_OF_WEEK :', routineListAssociatedDays);
                setroutineListAssociatedDays(routineListAssociatedDays)
            }
        }
        fetchDaysOfWeek()
    }, []);

    useEffect(() => {
        console.log('PROGRAM_UPDATED : ', program);
    }, [program]);

    useEffect(() => {
        console.log('SAVE_PROGRAMMATION_ACTION_UPDATE :', saveProgrammation);
    }, [saveProgrammation]);

    useEffect(() => {
        console.log('Number_Of_Days :', numberOfDays);
    }, [numberOfDays]);

    useEffect(() => {
        console.log('HEELO :', myDays);
    }, [myDays]);

    useEffect(() => {
        console.log('daysAlreadyInUse :', daysAlreadyInUse);
    }, [daysAlreadyInUse]);

    useEffect(()=> {
        console.log('ICON_STATE :', iconState);
    },[iconState]);

    useEffect(()=> {

    },[routineMenu]);

    useEffect(() => {
        console.log('HERE_SELECTED_ACTION :', selectedAction);
    }, [selectedAction]);

    useEffect(() => {
        console.log("SURVEILLANCE_DAYSOFWEEK_ROUTINE_CONTEXT :", daysOfWeek)
    }, [daysOfWeek]);

    useEffect(() => {
        const routineListAssociatedDays = routinesWithTheirPlannedDays(planningDaysDatas)
        setroutineListAssociatedDays(routineListAssociatedDays)
    }, [planningDaysDatas]);

    useEffect(() => {
        console.log('UPDATE_ROUTINE_FOR_MODIFICATION :', routineId);
    }, [routineId]);

    useEffect(() => {
        console.log("MY_ROUTINE_NAME :", routineName)
    }, [routineName]);

    useEffect(() => {

    }, [isRoutine]);

    useEffect(() => {
        console.log("USER_SELECTED_ACTIONS_FOR_ROUTINE_2233", actionsByItemId)
    }, [actionsByItemId]);

    useEffect(() => {
        console.log('TRIGGER_UPDATE 1 :', selectedRoutineTrigger);
    }, [selectedRoutineTrigger]);

    useEffect(() => {
        const availlableList = objectsVisible.filter(x => !objectsToExclude?.includes(x));
        setSelectable(availlableList);
    }, [objectsVisible])

    useEffect(() => {
    }, [selectable]);

    useEffect(() => {
        console.log("SELECTION_CONNN :", selection)
    }, [selection]);

    useEffect(() => {
        console.log("ECO_SELECTED_OBJECTS :", ecoSelection)
    }, [ecoSelection]);


    useEffect(() => {
        console.log('PLANNER_DAYS :', plannerDays);
    }, [plannerDays]);


    useEffect(() => {

        const routineListAssociatedDays = routinesWithTheirPlannedDays(planningDaysDatas)
        setroutineListAssociatedDays(routineListAssociatedDays)
        console.log("ROUTINES_DAYS :", routineListAssociatedDays)

    }, []);

    useEffect(() => {
        console.log("SELECTED_DAY (planningDaysDatas) :", JSON.stringify(planningDaysDatas), selectedDay)
        console.log("SELECTED_DAY (selectedDay) :", selectedDay)
        const dailyRoutinesInfos = extractDailyRoutines(planningDaysDatas, selectedDay)
        setDailyRoutines(dailyRoutinesInfos)
    }, [selectedDay]);

    useEffect(() => {
        console.log('MY_MODIFY_DATAS :', planningDaysDatas);
    }, [planningDaysDatas]);

    useEffect(() => {
        console.log("DAY_ACTIVE :", dayActive)
        const dailyRoutinesInfos = extractDailyRoutines(planningDaysDatas, dayActive)
        setDailyRoutines(dailyRoutinesInfos)
    }, [dayActive]);

    useEffect(() => {
        console.log('MY_DAILY_ROUTINES_CONTEXT_PLANNING :', dailyRoutines);
    }, [dailyRoutines]);

    useEffect(() => {
        console.log('TRIGGER_UPDATE_HOO :', selectedRoutineTrigger);
    }, [selectedRoutineTrigger]);

    useEffect(() => {
        console.log('TRIGGER_ID_UPDATE_HOO :', planningCurrentTrigger);
    }, [planningCurrentTrigger]);

    useEffect(()=> {
        console.log('ECO_CONF_EQUIPMENTS_BY_TYPE_NAME :', ecoConfEquipmentsByTypeName);
    },[ecoConfEquipmentsByTypeName]);

    useEffect(()=> {
        console.log('ECO_CONFOR_IDENTITY_CONTEXT :', ecoConfortIdentity);
    },[ecoConfortIdentity]);

    useEffect(()=> {
        console.log('ECO_CONFORT_GROUP_ACTIONS :', ecoConfGroupActions);
    },[ecoConfGroupActions]);

    useEffect(()=> {
        console.log('ECO_CONFORT_SELECTED_ACTION :', ecoConfSelectedAction);
    },[ecoConfSelectedAction]);

    useEffect(()=> {
        console.log('ECO_CONFORT_ICON_STATE :', ecoConfIconState);
    },[ecoConfIconState]);

    useEffect(()=> {
        console.log('ECO_VERSION :', version);
    },[version]);
    //####======================================================================####


    const updateDaysAlreadyInUse = (dayIds) => {
        //console.log('CESTCA :', dayIds, daysAlreadyInUse);
        const usedDays = [...new Set([...daysAlreadyInUse, ...dayIds])]
        console.log('CESTCA :', usedDays);
        setDaysAlreadyInUse(usedDays)
    }

    const resetProgram = () => {
        setProgram([])
    }

    const updateSaveProgrammation = () => {
        setNumberOfDays(0)
        updateDaysAlreadyInUse(myDays)
        const days = plannerDays.toString()
        // myDays : all selected days (already in use + new selection)
        const actionDays = myDays.filter(d => !daysAlreadyInUse.includes(d))
        console.log('SAVE_PROGRAMMATION_:', days, myDays, daysAlreadyInUse, actionDays);
        //const jours = [...new Set([...daysAlreadyInUse, ...myDays])]
        const oArgs = constructOArgs(selectedRoutineTrigger)
        console.log('O_A_R_G_S :', oArgs);
        const U = {
            days: actionDays,
            time: ExtractTime(selectedRoutineTrigger)
        }
        setProgram([...program, U])
        const action = {
            "name": "ADD_OBJECT",
            "mArgs": [
                {
                    "name": "daysIds",
                    "value": actionDays.join(",")
                },
                {
                    "name": "action",
                    "value": "EXECUTE"
                }
            ],
            "oArgs": oArgs
        }

        setSaveProgrammation([...saveProgrammation, action])
        return action
    }

    const shared = {
        isRoutine,
        initEditRoutine,
        resetSelection: (value) => setSelection(value),
        actionsByItemId, setActionsByItemId,
        resetCurrentDay,
        selectedAction, setSelectedAction,
        routineName,setRoutineName,
        getRoutines: scenarios,
        routineId,setRoutineId, updateRoutineId,
        onclickObject,
        selection,selectable,
        selectedRoutineTrigger,updateSelectedRoutineTrigger,
        plannerDays, updatePlannerDays,
        setPlanningDaysDatas,
        routineListAssociatedDays, setroutineListAssociatedDays,
        iconState, setIconState,
        // Now planning context shared
        selectedDay,
        updateDaySelection,
        dayActive,
        dailyRoutines,setDailyRoutines,
        planningCurrentTrigger,
        updatePlanningCurrentTrigger,
        getCurrentDay,
        daysAlreadyInUse, setDaysAlreadyInUse, updateDaysAlreadyInUse,
        myDays,setMyDays,
        onClickDayObject,
        numberOfDays,setNumberOfDays,
        saveProgrammation,updateSaveProgrammation,
        program, setProgram, resetProgram, setSaveProgrammation,
        updateRoutineOrPlanningRoot,routineMenu,
        loading, setLoading,
        //ECO-CONFORT
        ecoSelection, setEcoSelection,
        ecoConfortIdentity, setEcoConfortIdentity,
        ecoConfGroupActions, setEcoConfGroupActions,
        ecoConfEquipmentsByTypeName, setEcoConfEquipmentsByTypeName,
        ecoConfSelectedAction, setEcoConfSelectedAction,
        ecoConfIconState, setEcoConfIconState,version, setVersion
    };


    return (
        <ScenarioContext.Provider value={shared}>
            {children}
        </ScenarioContext.Provider>
    )
}