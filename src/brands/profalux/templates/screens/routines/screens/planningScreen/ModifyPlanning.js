import '_brand/templates/screens/routines/locales'
import React from 'react';
import { useState, useRef } from 'react';
import { SafeAreaView, Text, View, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider'
import { refreshObjectAction } from '_actions/asyncActions';
import { useObject } from '_hooks/object';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import Button from '_brand/templates/components/ui/Button';
import * as ApiObjects from "_api/objects"
import ScheduleTaskPicker from '_brand/templates/components/pickers/scheduletask-picker';
import * as Actions from '_actions/objects';
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import Toast from 'react-native-root-toast';
import { useScenario } from '_brand/templates/screens/routines/hook/useScenario'

import { extractPickerDatas, extractPlannerTime, addZeroOnTheLeft } from '_brand/templates/screens/routines/utils/transformPickerDatas'
import { findDayWithTranslation, capitalizeFirstLetter } from '_brand/templates/screens/routines/components/utils'
import { extractDailyRoutines } from '_brand/templates/screens/routines/utils/index'
import { appRefresh, closeWS } from '_actions/app';

/**
 * CONFIGURE THE TRIGGER TYPE OF SCENARIO : 
 * - EXECUTE : Create a scenario wrapper to the one existing and give type "exec" 
 * - SCHEDULE: Create a task Scheduler with date and time recurring events
 * @param {*} props 
 * @returns 
 */
export const ModifyPlanning = (props) => {

    const uScenario = useScenario();
    const {
        selectedDay,
        updateDaySelection,
        dayActive,
        dailyRoutines,
        setDailyRoutines,
        /* routineId,*/
        updateRoutineId,
        selectedRoutineTrigger,
        updateSelectedRoutineTrigger,
        planningCurrentTrigger,
        modifyPlanning,
        setPlanningDaysDatas
    } = uScenario;

    const store = useStore()
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    console.log("XXXXXX navigationParams", navigationParams)

    const { routineId } = navigationParams;

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const { theme } = useTheme();
    const borderColor = theme?.prflxBorderColor || 'orange';
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";

    const actionSheetRef = useRef(null);
    const scenarioRef = useRef(null);
    //const {taskTime } = navigationParams;
    const uRoutine = useObject(routineId);
    const routineName = uRoutine?.name
    const myDay = capitalizeFirstLetter(findDayWithTranslation(selectedDay))

    console.log("U_ROUTINE:", uRoutine)
    console.log("U_SELECTED_DAY:", selectedDay, ":", myDay)

    const taskObject = null;

    let initValues = {}
    if (selectedRoutineTrigger.type == 'time') {
        const hour = selectedRoutineTrigger?.hour;
        const minute = selectedRoutineTrigger?.minute
        const myHour = addZeroOnTheLeft(hour)
        const myMinute = addZeroOnTheLeft(minute)
        //initValues.initTime = `${myHour}:${myMinute}` || "12:13";
        initValues.trigger = selectedRoutineTrigger
    } else {
        //initValues.initTime = "12:14"
        initValues.trigger = selectedRoutineTrigger
    }
    // Need Function to convert weather event planning in time format HH:MM 
    const taskTime = extractPlannerTime(selectedRoutineTrigger) || "12:00";
    console.log('TASK_TIME :', taskTime);

    const [timeSelection, setTimeSelection] = useState({});

    const onScheduleTaskPickerChange = (data) => {
        const trigger = extractPickerDatas(data)
        console.log("MODIFY_PLANNING_SCREEN_PICKER_DATA_TO_SEND:", trigger)
        updateSelectedRoutineTrigger(trigger)
    }

    const modifyTaskPlanning = () => {
        console.log("AAAAAAAAAAA")
        modifyPlanning()
    }

    const deleteTask = () => {
        actionSheetRef.current?.present()
    }
    const handleCancel = () => {
        actionSheetRef.current?.dismiss();
    }

    const handleDelete = async () => {
        console.log("ROUTINE_TO_REMOVE_FROM_DAY :", "ROUTINE : ", routineId, "DAY :", selectedDay, "Trigger ID :", planningCurrentTrigger?.triggerId)
        const delecteAction = {
            //"name": "REMOVE_OBJECT_DAY",
            "name": "REMOVE_TRIGGER_OBJECT_DAY",
            "mArgs": [
                { "name": "objectId", "value": routineId.toString() },
                { "name": "dayId", "value": selectedDay },
                { "name": "triggerId", "value": planningCurrentTrigger?.triggerId },
            ]
        }

        const requestRemoveRoutineFromDay = await ApiObjects.createWeeklyPlanner(delecteAction);
        actionSheetRef.current?.dismiss();
        console.log('REMOVE_ROUTINE_FROM_DAY :', requestRemoveRoutineFromDay);
        if (requestRemoveRoutineFromDay.errCode == 200) {
            const plannerId = requestRemoveRoutineFromDay.id;
            const daysOfWeek = requestRemoveRoutineFromDay?.res?.data?.resource?.daysOfWeek
            console.log('MY_DAYS_OF_WEEK :', daysOfWeek);
            console.log("REMOVE_ROUTINE_FROM_DAY_200 :", requestRemoveRoutineFromDay)
            const action = Actions.objectUpdateProperty(plannerId, 'daysOfWeek', daysOfWeek);
            console.log("REMOVE_ROUTINE_FROM_DAY_200_DISPATCH :", daysOfWeek)
            dispatch(action);
            setPlanningDaysDatas(daysOfWeek)
            const dailyRoutinesInfos = extractDailyRoutines(daysOfWeek, selectedDay)
            setDailyRoutines(dailyRoutinesInfos)
            refreshObjectAction(routineId, store).catch((err) => console.log(err));
            //navigation.navigate("RoutinesHomeScreen")
            navigation.navigate("PlanningStack", { screen: "PlanningHomeScreen" })
            //dispatch(appRefresh());
        } else {
            const errCode = requestRemoveRoutineFromDay?.errCode;
            const errMsg = requestRemoveRoutineFromDay?.errMsg;
            const message = `${t(tns + ":" + "SERVER_ERROR")} : ${errCode} ${errMsg}`//'Un groupe avec ce nom existe déjà'
            Toast.show(
                message,
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
        actionSheetRef.current?.dismiss();
    }

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
            <View style={{ flex: 1, backgroundColor: 'white', }}>
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title={`${routineName} - ${myDay}`}
                        backSVG centered
                        goBack={{ action: () => navigation.goBack() }}
                        noShadow />
                </View>

                <ScrollView
                    style={{ backgroundColor: bgcolor, paddingHorizontal: 10 }}
                    showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                >

                    <View style={[styles.bodyContent, { marginTop: 10, backgroundColor: containerbgcolor, paddingHorizontal: 10 }]}>

                        <View style={{}}>

                            <View style={{ minHeight: 40, marginBottom: 0, marginLeft: 20, marginRight: 20, marginTop: 20, backgroundColor: 'transparent' }}>
                                {/* <WeekDays editable={true} days={currentDays} callback={onDaysCallbackChange} /> */}
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>{t(tns + ":" + "WHAT_TIME")}</Text>
                                </View>
                            </View>
                            <View style={{marginBottom:40}}>
                                <ScheduleTaskPicker taskObject={taskObject} {...initValues} callback={onScheduleTaskPickerChange}>
                                </ScheduleTaskPicker>
                            </View>

                        </View>

                        <View style={{ marginTop: -40 }}>
                            <Button onPress={modifyTaskPlanning} altStyle title={`${t(tns + ":" + "MODIFY")}`} titleColor='white' bgColor={iconColor} noBorder />
                            <Button onPress={deleteTask} altStyle title={`${t(tns + ":" + "DELETE")}`} titleColor='white' bgColor={iconColor} noBorder />
                        </View>
                    </View>
                    {/* <View style={{height:51, width:300, backgroundColor:'transparent'}}></View> */}
                </ScrollView>

            </View>

            <BottomDeleteSheet
                myRef={actionSheetRef}
                handleCancel={handleCancel}
                handleDelete={handleDelete}
            />

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
        justifyContent: 'center',
        padding: 5,
        borderColor: 'orange',
        borderWidth: 1,
        borderRadius: 10,

    },
    text: { marginVertical: 15 }
})