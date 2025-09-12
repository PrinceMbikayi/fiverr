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
import Toast from 'react-native-root-toast';
import moment from 'moment/min/moment-with-locales';
import { extractPlannerTime, addZeroOnTheLeft } from '_brand/templates/screens/routines/utils/transformPickerDatas'

import { isArray as lodashIsArray } from 'lodash'
import { cloneDeep, sortBy } from 'lodash';
import {appRefresh,closeWS} from '_actions/app';
import { useDispatch, useStore } from 'react-redux';


export const MyPlanning = () => {

    const uScenario = useScenario();
    const {
        updateDaySelection,
        dayActive,
        dailyRoutines,
        updateRoutineId,
        updateSelectedRoutineTrigger,
        updatePlanningCurrentTrigger,
        getCurrentDay,
    } = uScenario;

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "routine";
    const { theme } = useTheme();
    const iconColor = theme?.prflxIconColor || "#3E495E";


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

    const [sortTriggers, setSortTriggers] = useState({ time: [], sunRise: [], sunSet: [] });

    const sortPlannerTime = (dailyList) => {
        const tempTime = []
        const sunRiseData = []
        const sunSetData = []
        const result = { time: [], sunRise: [], sunSet: [] }

        if (lodashIsArray(dailyList)) {
            dailyList.map((item) => {

                console.log('DAILILIST_DATA :', dailyList);
                const id = item?.id
                const trigger = item?.trigger
                const action = { name: 'EXECUTE' }
                if (trigger) {

                    if (trigger.hasOwnProperty('event')) {

                        //const obj = {id:id, action:action, trigger:trigger} 
                        if (trigger?.event == 'sunrise') {
                            sunRiseData.push(item)
                        } else {
                            sunSetData.push(item)
                        }

                    } else {

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
                        console.log('SHOW_HOUR_DATA :', tempTime);

                    }
                }

            })
            result.time = sortBy(tempTime, ['time']);
            result.sunRise = sunRiseData
            result.sunSet = sunSetData

        }

        return result
    }


    const [debugRelease, setDebugRelease] = useState("");
    useEffect(() => {

    }, [debugRelease]);

    useEffect(() => {
        console.log("MY_DAILY_ROUTINES :", dailyRoutines)
        const sortList = sortPlannerTime(dailyRoutines);
        setDebugRelease(JSON.stringify(sortList))
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


    const handleOnPressDay = (dayObject) => {
        const dayIndex = dayObject.id
        console.log('INDEX :', dayIndex);
        updateDaySelection(dayIndex)
    }

    const addRoutinePlanning = () => {
        navigation.navigate("PlanningStack", {screen:"SelectRoutine"})
        //navigation.navigate("SelectRoutine")
    }

    return (

        <View>
            <View style={{ height: 40, marginTop: 20, marginBottom:10 }}>
                <DaysButtons buttons={buttons} onPress={handleOnPressDay} isActive={dayActive} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: 'transparent' }}>
                <View style={{ marginTop: 40 }}>
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
        </View>
    )
}