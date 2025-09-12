import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect, useRef} from 'react';
import { Text,TextInput, View, Pressable, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'
import { getObjectsByTypeName } from '_helpers/selectors';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { CardImageWithArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageWithArrow';
import {iconsJs} from '_brand/utils/iconsJs';
import CustomRoutine from '_brand/images/icons/app/profaluxIconJs/CustomRoutine'
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import EcoConfortWinter from '_brand/images/icons/app/profaluxIconJs/EcoConfortWinter'
import { SelectList } from 'react-native-dropdown-select-list'
import { getObjectById } from '_helpers/objects';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { myToast } from '_brand/templates/components/ui/myToast';
import { EcoConfortDatePicker } from '_brand/templates/screens/routines/screens/applicationScreen/components/EcoConfortDatePicker'; 
import { DaysSelection } from '_brand/templates/screens/routines/screens/planningScreen/components/DaysSelection';
import { EcoConfortTimePicker } from '_brand/templates/screens/routines/screens/applicationScreen/components/EcoConfortTimePicker';
import { DateMonthTextInput } from '_brand/templates/screens/routines/screens/applicationScreen/components/DateMonthTextInput';
import ScheduleTaskPicker from '_brand/templates/components/pickers/scheduletask-picker';
import { extractPickerDatas, addZeroOnTheLeft } from '_brand/templates/screens/routines/utils/transformPickerDatas'
import Button from '_brand/templates/components/ui/Button';
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'
import { DateMonthSelector } from '_brand/templates/screens/routines/screens/applicationScreen/components/DateMonthSelector'
import { getDaysOfWeekInShort, getMonthByNumber } from '_brand/templates/screens/routines/utils/index'
import { set } from 'dot-prop-immutable';


export const EcoConfortDatePickerScreen = (props)=>{

    const {} = props

    const uEcoConfort = useEcoConfort();
    const { 
        ecoConfortIdentity, setEcoConfortIdentity,updateEcoConfortIdentityActiveDays, 
        buildProgramCron, ecoTargetForDelete
            } = uEcoConfort;


    console.log('ECO_CONFORT_IDENTITY :', ecoConfortIdentity);
    console.log('DELETE_ECO_TARGET :', ecoTargetForDelete);


    const { t, i18n } = useTranslation();
    const tns = "routine";
    const navigation = useNavigation();
    const route = useRoute();
  
    const navParams = route?.params || {};
    //const {mode}=navParams

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'

    let currentLang = i18n.language;
    const buttons = getDaysOfWeekInShort(currentLang);



    /////////////////////////////////////////////
    const mode = ecoConfortIdentity.mode;
    let defaultInitialDate = mode == "winter" ? {day:21, month:10} : {day:21, month:4};
    let defaultEndDate = mode == "winter" ? {day:20, month:4} : {day:20, month:10};

    const initDate = ecoConfortIdentity?.activatedCronDate?.day||defaultInitialDate.day
    const initMonth = ecoConfortIdentity?.activatedCronDate?.month|| defaultInitialDate.month
    const endDate = ecoConfortIdentity?.deactivatedCronDate?.day||defaultEndDate.day
    const endMonth = ecoConfortIdentity?.deactivatedCronDate?.month||defaultEndDate.month

    console.log('INITIAL_FINAL_DATE :', initDate, initMonth, endDate, endMonth);

    const [initialDate, setInitialDate] = useState({date:initDate, month:initMonth});
    const [finalDate, setFinalDate] = useState({date:endDate, month:endMonth});

    
    const [modalVisible, setModalVisible] = useState(false);
    const [deativateModalVisible, setDeactivateModalVisible] = useState(false);
    const [tempsDebut, setTempsDebut] = useState(ecoConfortIdentity?.startTime);
    const [tempsFin, setTempsFin] = useState(ecoConfortIdentity?.stopTime);


    /////////////////////////////////////////////

    useEffect(()=> {
        console.log('INITIAL_FINAL_DATE:', initialDate, finalDate, initialDate?.date, initialDate?.month);
    },[initialDate, finalDate]);

    useEffect(()=> {
        console.log('TEMPS_DEBUT_FIN:', tempsDebut, tempsFin);
    },[tempsDebut, tempsFin]);

    useEffect(()=> {
    
    },[modalVisible, deativateModalVisible]);


    const goBack = ()=>{
        navigation.goBack()
    }

    const handleOnPressDay = (dayObject) => {
        console.log('DAY_OBJECT_SELECTED :', dayObject);
        updateEcoConfortIdentityActiveDays(dayObject)
    }


    let headerTitle;
    if(ecoConfortIdentity.ecoConfortId){
        headerTitle = ecoConfortIdentity?.ecoConfortName
    }else{
        switch(ecoConfortIdentity.mode){
            case "summer":
                headerTitle = `${t(tns + ":" + "ECOFONFORT_SUMMER")}`
                break
            case "winter":
                headerTitle = `${t(tns + ":" + "ECOFONFORT_WINTER")}`
                break
            default:
                headerTitle = `${t(tns + ":" + "ECOFONFORT_SUMMER")}`
        }
    }

    const handleOnTouch = ()=>{
        console.log('HANDLE_TOUCH :');
        //ecoConfortIdentity.activeDays.length == 0 ? myToast(t(tns + ":" + "SELECT_AT_LEAST_ONE_DAY")) : null
    }

    
    const handleDateTimeSelection = ()=>{
        const activeDate ={
            day: initialDate?.date, month:initialDate?.month, hour:0,minute:0,
            week: '*'
        }

        const deactiveDate ={
            day: finalDate?.date, month:finalDate?.month , hour:23,minute:59, 
            week: '*'
        }

        setEcoConfortIdentity({...ecoConfortIdentity, activatedCronDate: activeDate, deactivatedCronDate: deactiveDate, startTime: tempsDebut, stopTime: tempsFin});

        if(ecoConfortIdentity?.activeDays.length != 0 ){
            navigation.navigate("EcoConfortConfirmConfigurationScreen")
        }else{
            myToast(t(tns + ":" + "SELECT_AT_LEAST_ONE_DAY"))
        }
    }


    const switchStartDateModalState = ()=>{
        setModalVisible(!modalVisible);
    }

    const switchEndDateModalState = ()=>{
        setDeactivateModalVisible(!deativateModalVisible);
    }

    const saveActivatedDate = (dateMonth)=>{
        const {date, month} = dateMonth;
        console.log('IS_YOU :', dateMonth);
        const activeDate ={
            ...ecoConfortIdentity.activatedCronDate,
            day: date, month: month, hour:0,minute:0, 
            week: '*' // All days of the week
        }
        setInitialDate({date:date, month:month});
        setEcoConfortIdentity({...ecoConfortIdentity, activatedCronDate: activeDate});
        setModalVisible(!modalVisible);
    }
    const cancelsaveActivatedDate = ()=>{
        setModalVisible(!modalVisible);
    }

    const saveDeactivatedDate = (dateMonth)=>{
        console.log('OH:', dateMonth);
        const {date, month} = dateMonth;
        const deactiveDate ={
            ...ecoConfortIdentity.deactivatedCronDate,
            day: date, month: month, hour:23,minute:59, 
            week: '*' // All days of the week
        }
        setFinalDate({date:date, month:month});
        setEcoConfortIdentity({...ecoConfortIdentity, deactivatedCronDate: deactiveDate});
       setDeactivateModalVisible(!deativateModalVisible);
    }

    const cancelDeactivatedDate = ()=>{
       setDeactivateModalVisible(!deativateModalVisible);
    }

    const updateStartTime = (time)=>{
        const timeArray = time.split(':');
        const stringHour = timeArray[0];
        const stringMinute = timeArray[1];
        const myTime = `${stringHour}:${stringMinute}`
        console.log('UPDATE_START_TIME :', stringHour, stringMinute);
        setTempsDebut(myTime);
       //setEcoConfortIdentity({...ecoConfortIdentity, startTime: myTime});
    }

    const updateEndTime = (time)=>{
        const timeArray = time.split(':');
        const stringHour = timeArray[0];
        const stringMinute = timeArray[1];
        const myTime = `${stringHour}:${stringMinute}`
        setTempsFin(myTime);
       //setEcoConfortIdentity({...ecoConfortIdentity, stopTime: myTime});
    }



    return(
        <SafeAreaView style={{ height: '100%', backgroundColor: "white" || bgcolor }} >
    
            <View style={{ flex: 1, backgroundColor: bgcolor }}>
    
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                    title={headerTitle}
                    backSVG centered
                    goBack={{ action: goBack }}
                    noShadow />
                </View>
                <ScrollView>
                    <View style={{flex:1, padding:5, backgroundColor:'white', margin:10,
                            borderWidth:1, borderColor:'orange', borderRadius:12, 
                            }}
                        >

                        <DateMonthTextInput
                            text = {t(tns + ":" + "ACTIVATION_PERIOD_FROM")}
                            dateNumber={initialDate?.date}
                            monthNumber={initialDate?.month}
                            onClick={switchStartDateModalState}
                            editable={false}
                        />

                        <View style={{padding:2}}>
                            <DateMonthSelector 
                                initialDate={initialDate?.date}
                                initialMonth={initialDate?.month}
                                modalVisible={modalVisible}
                                pickerWidth ={150}
                                pickerHeight={200}
                                switchModalState={switchStartDateModalState}
                                modalTitle={t(tns + ":" + "SELECT_DATE")}
                                validateDateMonthSelection={saveActivatedDate}
                                cancelDateMonthSelection={cancelsaveActivatedDate}
                            />
                        </View>

                        <DateMonthTextInput
                            text = {t(tns + ":" + "AT_FOR_AU")}
                            dateNumber={finalDate?.date}
                            monthNumber={finalDate?.month}
                            onClick={switchEndDateModalState}
                            editable={false}
                        />

                        <View style={{padding:5}}>
                            <DateMonthSelector 
                                initialDate={finalDate?.date}
                                initialMonth={finalDate?.month}
                                modalVisible={deativateModalVisible}
                                pickerWidth ={150}
                                pickerHeight={200}
                                switchModalState={switchEndDateModalState}
                                modalTitle={t(tns + ":" + "SELECT_DATE")}
                                validateDateMonthSelection={saveDeactivatedDate}
                                cancelDateMonthSelection={cancelDeactivatedDate}
                            />

                        </View>

                        <View style={{paddingHorizontal:10, marginTop:0}}>
                            <Text style={{fontSize:14, fontWeight:'600', color:textColor}}>
                                {t(tns + ":" + "CHOOSE_ACTIVATION_DAYS")} 
                            </Text>
                        </View>
                        <View style={{width:'100%', justifyContent:'space-around',marginVertical:10}}>
                            <DaysSelection
                                buttons={buttons}
                                onDaySelection={handleOnPressDay}
                                blockedDays={[]}
                                selectedDays={ecoConfortIdentity.activeDays}    
                            />
                        </View>
                        <View style={{paddingHorizontal:10, marginTop:0}}>
                            <Text style={{fontSize:14, fontWeight:'600', color:textColor}}>
                                {t(tns + ":" + "SELECT_DAYS_NUMBER")} {ecoConfortIdentity.activeDays.length} 
                            </Text>
                        </View>
                        <View style={{backgroundColor:'transparent', width:300,height:150, borderRadius:10, marginHorizontal:10,marginTop:15}}>
                            <EcoConfortTimePicker text={t(tns + ":" + "FROM_HOUR")} initTime={ecoConfortIdentity?.startTime} updateCallback={updateStartTime}/>
                        </View>
                        <View style={{backgroundColor:'transparent', width:300,height:150, borderRadius:10, marginHorizontal:10, marginTop:20}}>
                            <EcoConfortTimePicker text={t(tns + ":" + "TO_HOUR")} initTime={ecoConfortIdentity?.stopTime} updateCallback={updateEndTime}/>
                        </View>
                        <View style={{marginTop:35, marginBottom:10}}>  
                            <Button 
                                onPress={handleDateTimeSelection} 
                                altStyle title={t(tns + ":" + "NEXT")} 
                                titleColor={ecoConfortIdentity?.activeDays.length ==0 ? "gray": 'white'}
                                bgColor={textColor} 
                                //disabled={ecoConfortIdentity.activeDays.length == 0? true: false}
                                //onTouch = {handleOnTouch}
                                noBorder 
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )

}