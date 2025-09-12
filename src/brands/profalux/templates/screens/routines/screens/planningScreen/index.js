import '_brand/templates/screens/routines/locales'
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '_brand/templates/components/ui/Button';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'
import { RenderDayPlanning } from '_brand/templates/screens/routines/screens/planningScreen/components/RenderDayPlanning';

import { DaysButtons } from '_brand/templates/screens/routines/screens/planningScreen/components/DaysButtons';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'

import * as ObjectHelpers from '_helpers/objects';
import { myToast } from '_brand/templates/components/ui/myToast';
import moment from 'moment/min/moment-with-locales';
import { extractPlannerTime, addZeroOnTheLeft } from '_brand/templates/screens/routines/utils/transformPickerDatas'

import { isArray as lodashIsArray } from 'lodash'
import { cloneDeep, sortBy } from 'lodash';
import {appRefresh,closeWS} from '_actions/app';
import { useDispatch, useStore } from 'react-redux';
import RoutineTemplate from '_brand/templates/screens/routines/components/RoutineTemplate';
import {RoutineAndPlanningRoutesButtons} from "_brand/templates/screens/routines/components/newComponents/RoutineAndPlanningRoutesButtons"


export const PlanningScreen = () => {

    const uScenario = useScenario();
    const {
        updateDaySelection,
        dayActive,
        dailyRoutines,
        updateRoutineId,
        updateSelectedRoutineTrigger,
        updatePlanningCurrentTrigger,
        getCurrentDay,
        resetCurrentDay, updateRoutineOrPlanningRoot, routineMenu,
        weeklyPlanner
    } = uScenario;

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "routine";
    const { theme } = useTheme();
    const iconColor = theme?.prflxIconColor || "#3E495E";


    // useEffect(()=> {
    // console.log('WEEKLY_PLANNER_PLANNING_SCREEN :', weeklyPlanner);
    
    // },[weeklyPlanner]);
    const dispatch = useDispatch();

    let currentLang = i18n.language;
    if (currentLang == "en") currentLang += "-gb";
    moment.locale(currentLang);
    const wd = moment.weekdays(true);
    console.log("WD :", wd)

    const buttons = [
        { id: 2, label: (wd[0].substr(0, 1)).toUpperCase() },
        { id: 3, label: (wd[1].substr(0, 1)).toUpperCase() },
        { id: 4, label: (wd[2].substr(0, 1)).toUpperCase() },
        { id: 5, label: (wd[3].substr(0, 1)).toUpperCase() },
        { id: 6, label: (wd[4].substr(0, 1)).toUpperCase() },
        { id: 7, label: (wd[5].substr(0, 1)).toUpperCase() },
        { id: 1, label: (wd[6].substr(0, 1)).toUpperCase() }
    ]

    const [sortTriggers, setSortTriggers] = useState({ time: [], sunRise: [], sunSet: [], ecoConf: [] });


// Function to sort the data array based on hour and minute of the trigger
    function sortDataByTime(data) {
        return [...data].sort((a, b) => {
            const timeA = a.trigger.hour * 60 + a.trigger.minute; // Convert time to minutes
            const timeB = b.trigger.hour * 60 + b.trigger.minute;
            return timeA - timeB; // Compare the times
        });
    }

    const sortPlannerTime = (data) => {

        const dailyList = sortDataByTime(data);
        console.log('DAILY_LIST :', dailyList);
        const tempTime = []
        const sunRiseData = []
        const sunSetData = []
        const ecoConf = []
        const result = { time: [], sunRise: [], sunSet: [], ecoConf: [] }
        console.log('LIST_TO_SORT :', JSON.stringify(dailyList));

        if (lodashIsArray(dailyList)) {
            dailyList.map((item) => {

                console.log('DAILILIST_DATA :', dailyList);
                const id = item?.id
                const trigger = item?.trigger
                const action = { name: 'EXECUTE' }
                console.log('HAS :', trigger);
                if (trigger) {

                    if (trigger.hasOwnProperty('event')) {

                        //const obj = {id:id, action:action, trigger:trigger} 
                        if (trigger?.event == 'sunrise') {
                            sunRiseData.push(item)
                        } else {
                            sunSetData.push(item)
                        }

                    }else{
                        if(trigger?.type == "time"){
                            const hour = trigger?.hour
                            const minute = trigger?.minute
                            const myHour = addZeroOnTheLeft(hour)
                            const myMinute = addZeroOnTheLeft(minute)
                            const time = `${myHour}:${myMinute}`;
                            let rewriteTrigger = cloneDeep(item.trigger)
                            rewriteTrigger.hour = addZeroOnTheLeft(hour)
                            rewriteTrigger.minute = addZeroOnTheLeft(minute)
                            const objToSort = { id: id, action: action, time: time, type: trigger?.type, trigger: rewriteTrigger }
                            tempTime.push(objToSort);
                            console.log('SHOW_ECO :', tempTime);
                        }
                        if(trigger?.type == "range"){
                            const hour = trigger?.hour
                            const minute = trigger?.minute
                            const myHour = addZeroOnTheLeft(hour)
                            const myMinute = addZeroOnTheLeft(minute)
                            const time = `${myHour}:${myMinute}`;
                            let rewriteTrigger = cloneDeep(item.trigger)
                            rewriteTrigger.hour = addZeroOnTheLeft(hour)
                            rewriteTrigger.minute = addZeroOnTheLeft(minute)
                            const objToSort = { id: id, action: action, time: time, type: trigger?.type, trigger: rewriteTrigger }
                            ecoConf.push(objToSort);
                            console.log('SHOW_ECO :', ecoConf);
                        }

                    }
                }

            })
            result.time = sortBy(tempTime, ['time']);
            //result.time = tempTime
            //result.ecoConf = ecoConf
            result.ecoConf = sortBy(ecoConf, ['range']);
            const sortSunRiseData = sunRiseData.sort( (a,b)=> (a?.trigger?.offset) - (b?.trigger?.offset) ) ;
            const sortSunSetData = sunSetData.sort( (a,b)=> (a?.trigger?.offset) - (b?.trigger?.offset) ) ;
            console.log('WEATHER_SORT :', sortSunRiseData, sunRiseData);
            result.sunRise = sortSunRiseData //sunRiseData
            result.sunSet = sortSunSetData //sunSetData
            console.log('RESULT_SORTED :', result);

        }

        return result
    }


    // const [debugRelease, setDebugRelease] = useState("");
    // useEffect(() => {

    // }, [debugRelease]);

    useEffect(() => {
        const sortList = sortPlannerTime(dailyRoutines);
        console.log("MY_DAILY_ROUTINES :", dailyRoutines, sortList)
        //setDebugRelease(JSON.stringify(sortList))
        setSortTriggers(sortList)

    }, [dailyRoutines])

    useEffect(() => {
        console.log('==============> SORT_TRIGGERS :', JSON.stringify(sortTriggers));
    }, [sortTriggers]);

    useEffect(()=> {
        const today = getCurrentDay()
        console.log('TODAY :', today);
        updateDaySelection(today)
    },[]);

    const goModifyPlanning = (routineId, trigger) => {
        console.log("GO_MODIFY_PLANNING_HOO :", trigger)

        updateRoutineId(routineId)
        updateSelectedRoutineTrigger(trigger);
        updatePlanningCurrentTrigger(trigger);
        navigation.navigate("PlanningStack", {screen:"ModifyPlanning", params:{ "routineId": routineId } })
        //navigation.navigate("ModifyPlanning", { "routineId": routineId })
    }

    const goModifyEcoConfort = ()=>{
        console.log('GO_MODIFY_ECO_CONFOR :  NOT AVAILABLE YET');
        myToast(t(tns + ":" + "YOU_CAN_NOT_MODIFY_THIS_ROUTINE_HERE"))
    }


    const handleOnPressDay = (dayObject) => {
        const dayIndex = dayObject.id
        console.log('INDEX :', dayIndex);
        updateDaySelection(dayIndex)
    }

    const addRoutinePlanning = () => {
        navigation.navigate("PlanningStack", {screen:"SelectRoutine"})
        //navigation.navigate("SelectRoutine")
    }

    const handleOnPress = (active) => {
        if(active == "routine"){
            updateRoutineOrPlanningRoot('routine')
            resetCurrentDay()
            navigation.navigate("RoutinesHomeScreen")
            //navigation.navigate("RoutineHomeStack",{screen:"RoutinesHomeScreen"})
        }else{
            updateRoutineOrPlanningRoot('planning')
            resetCurrentDay()
            //navigation.navigate("RoutinesHomeScreen")
            navigation.navigate("PlanningStack", {screen:"PlanningHomeScreen"})
        }
    }

    return (

        <RoutineTemplate withKebab={false} title={routineMenu?.title}  >
            <RoutineAndPlanningRoutesButtons onPress={handleOnPress} active={routineMenu?.routineOrPlanning} title ={routineMenu?.title}/>

            <View style={{ height: 40, marginTop: 20, marginBottom:10 }}>
                <DaysButtons buttons={buttons} onPress={handleOnPressDay} isActive={dayActive} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: 'transparent' }}>

                <View style={{ marginTop: 20 }}>
                    <RenderDayPlanning dailyRoutines={sortTriggers?.ecoConf} callBack={goModifyEcoConfort} />
                </View>
                
                <View style={{ marginTop: 0 }}>
                    <RenderDayPlanning dailyRoutines={sortTriggers?.sunRise} callBack={goModifyPlanning} />
                </View>


                <View>
                    <RenderDayPlanning dailyRoutines={sortTriggers?.time} callBack={goModifyPlanning} />
                </View>

                <View>
                    <RenderDayPlanning dailyRoutines={sortTriggers?.sunSet} callBack={goModifyPlanning} />
                </View>
            </ScrollView>
            <View style={{ marginBottom: 10 }}>
                <Button onPress={addRoutinePlanning} altStyle title={`${t(tns + ":" + "ADD_YOUR_ROUTINE")}`} titleColor='white' bgColor={iconColor} noBorder />
            </View>
        </RoutineTemplate>
    )
}