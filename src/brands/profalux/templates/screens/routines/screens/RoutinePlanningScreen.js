import '_brand/templates/screens/routines/locales'
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, ScrollView, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { useDispatch, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider'
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import Button from '_brand/templates/components/ui/Button';
import * as ApiObjects from "_api/objects"
import { Api } from '_api';
import { updateStatus as updateStatusAction } from '_actions/objects';
import { refreshObjectAction } from '_actions/asyncActions';
import * as level2Funcs from '_helpers/level2options';
import { WeekDays } from '_brand/templates/components/dates/weekDays';
import ScheduleTaskPicker from '_brand/templates/components/pickers/scheduletask-picker';
import { buildScheduleTaskAction } from '_api/objects';
import * as ScenarioHelpers from "_helpers/scenarios";
import { getObjectById } from '_helpers/objects';
import { useScenario } from '_brand/templates/screens/routines/hook/useScenario'
import { ShowPlanningInfos } from '_brand/templates/screens/routines/components/ShowPlanningInfos'
import { ConfiguredProgram } from '_brand/templates/screens/routines/components/ConfiguredProgram'
import * as ObjectHelpers from '_helpers/objects';
import Toast from 'react-native-root-toast';
import { myToast } from '_brand/templates/components/ui/myToast';
import * as Actions from '_actions/objects';
import { extractPickerDatas } from '_brand/templates/screens/routines/utils/transformPickerDatas'
import { iconsJs } from '_brand/utils/iconsJs';
import { appRefresh, closeWS } from '_actions/app';
import { DaysSelection } from '_brand/templates/screens/routines/screens/planningScreen/components/DaysSelection';
import moment from 'moment/min/moment-with-locales';

/**
 * CONFIGURE THE TRIGGER TYPE OF SCENARIO : 
 *              - EXECUTE : Create a scenario wrapper to the one existing and give type "exec" 
 *              - SCHEDULE: Create a task Scheduler with date and time recurring events
 * @param {*} props 
 * @returns 
 */
export const RoutinePlanningScreen = (props) => {

    console.log('IT_ME_RENDERED :::::::NEW_RoutinePlanningScreen');
    const store = useStore()
    const navigation = useNavigation();
    const route = useRoute();
    const { t, i18n } = useTranslation();
    const tns = "routine";

    const dispatch = useDispatch();
    const scenarioRef = useRef(null);

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


    const uScenario = useScenario();
    const {
        routineName, saveRoutine, routineId, scheduleRoutine,
        updateSelectedRoutineTrigger, updatePlannerDays, selectedRoutineTrigger,
        routineListAssociatedDays,
        daysAlreadyInUse, updateDaysAlreadyInUse, myDays, onClickDayObject,
        numberOfDays, setNumberOfDays, updateSaveProgrammation, saveProgrammation, program, setProgram,
        loading, setLoading, setDaysAlreadyInUse, setMyDays, resetProgram, setSaveProgrammation
    } = uScenario;


    let hasRdependencies;
    if (routineId) {
        const routineDatas = getObjectById(routineId)
        hasRdependencies = routineDatas?.rdependencies?.weeklyPlanner
        console.log('hasRdependencies :: ', hasRdependencies);
    }

    //  const uRoutine = useObject(newCreatedRoutine)

    console.log("ROUTINE_LIST_ASSOCIATED_DAYS :", routineId, routineListAssociatedDays)
    console.log('SaveProgram :', saveProgrammation, selectedRoutineTrigger);




    const navigationParams = route?.params || {};
    const { scriptActions, flag, paramDays } = navigationParams;
    console.log("NAVIGATION PARAMS ROUTINE:", navigationParams);


    const weathers = ObjectHelpers.getWeatherObjects();
    let userWeather;
    if (weathers.length != 0) {
        userWeather = weathers[weathers.length - 1]
        console.log("USER_WEATHER:", userWeather)
    }

    const { theme } = useTheme();

    const nonConnectedGray = theme?.prflxNonConnectedGray || '#CCC'
    const borderColor = theme?.prflxBorderColor || 'orange';
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";


    const [isClicked, setIsClicked] = useState(false);
    const [oneClickIsEnabled, setOneClickIsEnabled] = useState(true);
    const [planifIsEnable, setPlanifIsEnable] = useState(false);
    const [timeSelection, setTimeSelection] = useState({});

    const [previousScheduleTime, setPreviousScheduleTime] = useState();
    const [prevDays, setPrevDays] = useState(paramDays)

    const [showConfiguredProgram, setShowConfiguredProgram] = useState(false);

    const initDays = paramDays || [0, 0, 0, 0, 0, 0, 0]

    const goBackHandleRoutine = () => {
        setDaysAlreadyInUse([])
        setMyDays([])
        resetProgram()
        setNumberOfDays(0),
        setSaveProgrammation([])
        navigation.navigate("EditRoutineActionsScreen")
    }


    useEffect(()=> {
    
    },[isClicked]);
    useEffect(() => {

    }, [showConfiguredProgram]);

    useEffect(() => {
        console.log("GET SWITCH STATUS :", oneClickIsEnabled)
    }, [oneClickIsEnabled]);

    useEffect(() => {
        console.log('planifIsEnable :', planifIsEnable);
    }, [planifIsEnable]);

    useEffect(() => {
        console.log("PREVIOUS TIME :", previousScheduleTime)
    }, [previousScheduleTime]);

    useEffect(() => {
        console.log("PREVIOUS Days :", prevDays)
    }, [prevDays]);

    useEffect(() => {
        console.log("PICKER_SELECTED_DATA :", timeSelection)
    }, [timeSelection]);


    const handlePlanifSwitch = (value) => {

        console.log("Schedulle value :", value);
        setPlanifIsEnable(value => !value);
        if (value == true) {
            setOneClickIsEnabled(false)
        } else {
            setOneClickIsEnabled(true)
        }
    };


    const createRoutineOrWeekPlanner = async () => {
        if (!planifIsEnable) {
            setIsClicked(true)
            console.log('COUCOU_ENTERED_1 :', planifIsEnable);
            const createRoutine = await saveRoutine();
            setPlanifIsEnable(false)
            if (createRoutine?.errCode == 200) {
                setIsClicked(false)
                refreshObjectAction(routineId, store).catch((err) => console.log(err));
                navigation.reset({ index: 0, routes: [{ name: 'RoutinesHomeScreen' }] })
                navigation.navigate("RoutinesHomeScreen")
            } else {
                let message;
                const errMsg = createRoutine?.errMsg
                const errCode = createRoutine?.errCode
                if (errMsg == "object_exists") {
                    message = `${t(tns + ":" + "OBJECT_EXISTS")}`
                } else {
                    message = `${t(tns + ":" + "SERVER_ERROR")} : ${createRoutine?.errCode} ${createRoutine?.errMsg}`
                }
                myToast(message)
            }

        } else {
            if (hasRdependencies) {
                console.log('ICI_AVEC_DEPENDENCIES');
                // Modify routine now
                setLoading(true)
                setIsClicked(true)
                const createRoutine = await saveRoutine();
                console.log('CREATE_ROUTINE_CLIC:', createRoutine);
                if (createRoutine?.errCode == 200) {
                    setIsClicked(false)
                    navigation.navigate("RoutinesHomeScreen")
                } else {
                    const message = `${t(tns + ":" + "SERVER_ERROR")} : ${createRoutine?.errCode} ${createRoutine?.errMsg}`
                    myToast(message)
                }
            } else {
                console.log('ICI_SANS_DEPENDENCIES');
                if (numberOfDays != 0 || daysAlreadyInUse != 0) {
                    console.log("NO_RDEPS :", hasRdependencies)
                    setLoading(true)
                    const createRoutine = await saveRoutine();
                    console.log('CREATE_ROUTINE_PLAN:', createRoutine);
                    if (createRoutine?.errCode == 200) {
                        const routineId = createRoutine?.id
                        const scheduleRequest = await scheduleRoutine(routineId).catch((err) => { console.log(err) })
                        console.log('SCHEDULE_REQUEST :', scheduleRequest);
                        //navigation.navigate("RoutinesHomeScreen")
                    } else {
                        let message;
                        const errMsg = createRoutine?.errMsg
                        const errCode = createRoutine?.errCode
                        if (errMsg == "object_exists") {
                            message = `${t(tns + ":" + "OBJECT_EXISTS")}`
                        } else {
                            message = `${t(tns + ":" + "SERVER_ERROR")} : ${createRoutine?.errCode} ${createRoutine?.errMsg}`
                        }
                        myToast(message)
                    }
                } else {
                    const message = `${t(tns + ":" + "SELECT_AT_LEAST_ONE_DAY")}`
                    myToast(message)
                }
            }
        }


    }


    console.log('CONTROL :', numberOfDays, myDays);
    const saveSelectedPlanning = (days) => {
        // if(numberOfDays == 7){
        //     if(myDays.length == 7){
        //         const message = `${t(tns + ":" + "ALL_DAYS_SELECTED_CLIC_SAVE_AND_END")}`
        //         myToast(message)
        //     }else{
        //         const message = `${t(tns + ":" + "SELECT_AT_LEAST_ONE_DAY")}`
        //         myToast(message)
        //     }

        // }else{
        //     updateSaveProgrammation()
        //     console.log('VUE :', selectedRoutineTrigger, daysAlreadyInUse, program);
        // }

        if (numberOfDays != 0) {
            if(myDays.length == 7 || numberOfDays == 7){
                const message = `${t(tns + ":" + "ALL_DAYS_SELECTED_CLIC_SAVE_AND_END")}`
                myToast(message)
            }else{
                setShowConfiguredProgram(true)
                updateSaveProgrammation()
                console.log('VUE :', selectedRoutineTrigger, daysAlreadyInUse, program);
            }

        } else {
            const message = `${t(tns + ":" + "SELECT_AT_LEAST_ONE_DAY")}`
            myToast(message)
        }
    }


    //------------------------------------
    const onScheduleTaskPickerChange = (data) => {
        const trigger = extractPickerDatas(data)
        updateSelectedRoutineTrigger(trigger)
        console.log("Harold Time picker :", data, trigger)
    }

    // const onDaysCallbackChange = (newDays, index) => {
    //     const myDays = level2Funcs.onDaysCallbackChange(newDays)
    //     console.log("Harold_Day_Selection :", newDays)
    //     updatePlannerDays(myDays)
    //     updateDaysAlreadyInUse(myDays)

    //     setDays(myDays);
    // }

    const handleOnPressDay = (dayObject) => {
        console.log('DAY_OBJECT_SELECTED :', dayObject);
        onClickDayObject(dayObject)
        // updatePlannerDays(myDays)
        // updateDaysAlreadyInUse(myDays)
        // setDays(myDays);
    }

    const setButtonTitleColor = (length) => {
        let titleColor;
        if (length == 0) {
            titleColor = "gray"
            // add message : SELECT_AT_LEAST_ONE_DAY
        } else if (length == 7) {
            titleColor = "gray"
            // add message : ALL_WEEKLY_DAYS_SELECTED
            // make button unclickable
        } else {
            titleColor = "white"
        }
        return titleColor
    }

    const taskObject = null;
    let btnBgColor = isClicked ? "gray" : "white";
    let btnAddProgramBgColor = "white";
    let btnSaveBgColor = iconColor;
    if (planifIsEnable) {

        // if (myDays.length == 0 || myDays.length == 7) {
        //     btnBgColor = iconColor
        //     btnAddProgramBgColor = nonConnectedGray
        // }
        if (numberOfDays == 0) {
            btnAddProgramBgColor = "gray"
            if (myDays.length == 0) {
                btnBgColor = "gray"
                // make button unclickable
            } else {
                btnBgColor = "white"
            }
        } else {
            btnAddProgramBgColor = setButtonTitleColor(myDays.length)
        }

    }


    const RenderScheduleWindow = (props) => {
        const { textColor, noTitle = false } = props
        return (
            <View>
                <View style={{ minHeight: 40, marginBottom: 0, marginLeft: 20, marginRight: 20, marginTop: 5, backgroundColor: 'transparent' }}>
                    <DaysSelection
                        buttons={buttons}
                        onDaySelection={handleOnPressDay}
                        blockedDays={daysAlreadyInUse}
                        selectedDays={myDays}
                    />
                    <View style={{ marginTop: 15, justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>
                                {t(tns + ":" + "SELECT_DAYS_NUMBER")}  {numberOfDays}
                            </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>{t(tns + ":" + "WHAT_TIME")}</Text>
                        </View>
                    </View>
                </View>

            </View>
        )
    }

    const RenderDescript = (props) => {
        const { myText, fontWeight } = props
        return (
            <View>
                <Text style={{ fontSize: 14, color: textColor, fontWeight: fontWeight, color: textColor, marginVertical: 10 }}>
                    {myText}
                </Text>
            </View>
        )
    }

    const RenderSwitch = () => {
        return (
            <View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: textColor, marginVertical: 5 }}>{t(tns + ":" + "ACTIVATE_ON_SCHEDULE")} </Text>
                    <Switch
                        trackColor={{ true: borderColor, false: '#FFFFFF' }}
                        thumbColor={'white'}
                        ios_backgroundColor={"#FFFFFF"}
                        onValueChange={handlePlanifSwitch}
                        value={planifIsEnable}
                    />
                </View>
            </View>
        )
    }


    let content;

    if (routineId) {
        content = (
            <View>
                {hasRdependencies ?
                    <View>
                        <ShowPlanningInfos routineId={routineId} data={routineListAssociatedDays} />
                        <RenderDescript myText={t(tns + ":" + "PROGRAMMATION_CAN_BE_MODIFIED_AT_PLANNING")} fontWeight={'600'} />
                    </View>
                    :
                    <View>
                        {planifIsEnable ?
                            <View>
                                {!showConfiguredProgram ?
                                    <>
                                        <RenderSwitch />
                                        <RenderDescript myText={t(tns + ":" + "ROUTINE_DEFINITION_DESCRIPTION")} fontWeight={'400'} />
                                        <RenderScheduleWindow textColor={textColor} />
                                        <ScheduleTaskPicker taskObject={taskObject} callback={onScheduleTaskPickerChange}>
                                        </ScheduleTaskPicker>
                                    </>
                                    :
                                    <>
                                        <RenderSwitch />
                                        <ConfiguredProgram program={program} />
                                        <RenderDescript myText={t(tns + ":" + "ADD_NEW_PROGRAM_FOR_REMAINDER_DAYS")} fontWeight={'600'} />
                                        <RenderScheduleWindow textColor={textColor} noTitle={true} />
                                        <ScheduleTaskPicker taskObject={taskObject} callback={onScheduleTaskPickerChange}>
                                        </ScheduleTaskPicker>
                                    </>
                                }
                            </View>
                            :
                            <View>
                                <View>
                                    <Text style={{ fontSize: 14, fontWeight: '600', marginVertical: 10, color: textColor }}>
                                        {t(tns + ":" + "HOW_TO_ACTIVATE_SCENARIO")}
                                    </Text>
                                </View>
                                <RenderSwitch />
                                <RenderDescript myText={t(tns + ":" + "HOW_TO_ACTIVATE_SCENARIO_DESCRIPTION")} fontWeight={'600'} />
                            </View>
                        }
                    </View>
                }
            </View>
        )
    } else {
        content = (
            <View>
                {!planifIsEnable &&
                    <View>
                        <View>
                            <Text style={{ fontSize: 14, fontWeight: '600', marginVertical: 10, color: textColor }}>
                                {t(tns + ":" + "HOW_TO_ACTIVATE_SCENARIO")}
                            </Text>
                        </View>
                        <RenderSwitch />
                        <RenderDescript myText={t(tns + ":" + "HOW_TO_ACTIVATE_SCENARIO_DESCRIPTION")} fontWeight={'600'} />
                    </View>
                }

                {planifIsEnable &&
                    <View>
                        {!showConfiguredProgram ?
                            <>
                                <RenderSwitch />
                                <RenderDescript myText={t(tns + ":" + "ROUTINE_DEFINITION_DESCRIPTION")} fontWeight={'400'} />
                                <RenderScheduleWindow textColor={textColor} />
                                <ScheduleTaskPicker taskObject={taskObject} callback={onScheduleTaskPickerChange}>
                                </ScheduleTaskPicker>
                            </>
                            :
                            <>
                                <RenderSwitch />
                                <ConfiguredProgram program={program} />
                                <RenderDescript myText={t(tns + ":" + "ADD_NEW_PROGRAM_FOR_REMAINDER_DAYS")} fontWeight={'600'} />
                                <RenderScheduleWindow textColor={textColor} noTitle={true} />
                                <ScheduleTaskPicker taskObject={taskObject} callback={onScheduleTaskPickerChange}>
                                </ScheduleTaskPicker>
                            </>
                        }
                    </View>
                }
            </View>
        )
    }



    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
            <View style={{ flex: 1, backgroundColor: 'white', }}>

                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title={routineName}
                        backSVG centered
                        goBack={{ action: goBackHandleRoutine }}
                        noShadow />
                </View>

                <ScrollView
                    style={{ backgroundColor: bgcolor, paddingHorizontal: 10 }}
                    showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                >


                    <View style={[styles.bodyContent, { marginTop: 10, backgroundColor: containerbgcolor, paddingHorizontal: 10, opacity: loading ? 0.3 : 1 }]}>
                        {content}
                        {planifIsEnable &&
                            <View style={{ marginTop: -40 }}>
                                <Button
                                    onPress={saveSelectedPlanning}
                                    altStyle title={`${t(tns + ":" + "SAVE_AND_ADD_PLANNING")}`}
                                    titleColor={btnAddProgramBgColor}
                                    bgColor={textColor} noBorder />
                            </View>
                        }
                        <View style={{ marginTop: 10 }}>
                            <Button
                                onPress={createRoutineOrWeekPlanner}
                                altStyle
                                title={!planifIsEnable ? `${t(tns + ":" + "END")}` : `${t(tns + ":" + "SAVE_AND_FINISH")}`}
                                titleColor={btnBgColor}
                                bgColor={textColor} noBorder
                                disabled={isClicked ? true : false}
                            />
                        </View>
                    </View>
                    {loading &&
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ marginVertical: 50 }}>
                                <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 4 }, { scaleY: 4 }] }} />
                                <Text style={{ marginTop: 60, color: textColor, fontSize: 14, fontWeight: "500" }}>{t(tns + ":" + "ROUTINE_CONFIGURATION_LOADING")}</Text>
                            </View>
                        </View>
                    }

                    <View style={{ width: "100%", height: 50 }}></View>

                </ScrollView>

            </View>

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