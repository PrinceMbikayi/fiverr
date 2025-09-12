import React from 'react';
import {useContext,useState,useEffect,useRef} from 'react'
import { ScrollView,View,Text,Alert,Switch,SafeAreaView} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';

import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';
import styled from 'styled-components/native';
//import { ScrollView } from 'r-eact-native-gesture-handler';

import {heaterFamilyPrograms} from '_config/products/core';
import {setScheduleDatas} from '_actions/objects';

import { useTheme } from '_theming/themeProvider';
import ProgramHeaterDay from '../programs/programHeaterDay';

import {HeaderWithBack} from '_components/headers/header-with-back';
import {createMultipleScheduleTask,updateParametersOnServer} from '_api/objects';
import {convertWeekToSchedulerActions,getCurrentTimeProgramAction,saveSchedulesOnServer  } from '_helpers/heaterTools';
import {getHeaterSchedule,setHeaterSchedule} from '_services/storage';

import {Api} from '_api';
import useHeater from './heaterHook';

//================= FC ==========================================

/**
 * Heater Program
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {string} props.typeName
 *
 * @return the screen content with the 7 days schedules List
 */
export const TypeHeaterProgram = (props) => {
   
   
    const { t, i18n } = useTranslation();
    const { itemId,typeName} = props;
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    const dispatch = useDispatch(); 

    const activatedRef = useRef(navigationParams?.programActivated || false);

    // Moment with Locale   
    let currentLang = i18n.language;
    if(currentLang == "en")currentLang+="-gb"; 
    moment.locale(currentLang);
    const wd = moment.weekdays(true);   
   
    const {     objectDatas, getMyHeatingTaskIds, scheduleDatas,
                deactivateTasks, activateTasks,
                isActivated, heaterSetIsActivated

    } = useHeater(itemId);

    const sel = scheduleDatas; 
    const [datas,setDatas] = useState(sel || []);      

    const [scheduleActivated,setScheduleActivated] = useState(isActivated);
    const scheduleTasksIdsRef = useRef(null);
    const isThermostat = (objectDatas?.typeName == "application")

    
     useEffect(() => {
        //console.log('heaterProgram effect sel');
        //console.log("sel",sel);
        // keep here !!!!
        setDatas(sel);    
      }, [sel]);

    const move = (id) => {       
        navigation.navigate('ProductProgramDay',{ 'dayId':id,'title' : wd[id],'type':typeName, 'itemId':itemId,'ranges':datas[id]})
    }
    const modifyDay = (day) => {          
        move(day);
    }
   
    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   
   
    

    const changeScheduleActivation = async(activatedState) => {
      
        let myHeatingTaskIds = getMyHeatingTaskIds(); 
        const isDeactivated = !activatedState;      
        setScheduleActivated(!isDeactivated);
        activatedRef.current = !isDeactivated;
       
        if(activatedState) {            
                    const progModeAction = getCurrentTimeProgramAction(datas) ;
                    // et reactivation du mode programmé courant
                    const request = Api.executeAction(itemId,progModeAction,{})
        }
        
        if(isDeactivated)  {
           deactivateTasks();
        } else {
           activateTasks();
        }
       
        // saves default schedule on first activation
        if(myHeatingTaskIds.length == 0) {
            console.log("saves default schedule on first activation")
            saveSchedulesOnServer(itemId,typeName,datas);           
        }
    }
   

    const addDefaultSchedule = async() => {
        const heaterTypeName = (objectDatas?.uniType != undefined) ? objectDatas?.uniType : objectDatas?.typeName; 
        const savedSchedule = await getHeaterSchedule(itemId);
        //console.log("savedSchedule",savedSchedule)
        const defaultDatas = savedSchedule || JSON.parse(JSON.stringify(heaterFamilyPrograms[heaterTypeName].defaultSchedule)) ;
        setDatas(defaultDatas);
        setScheduleActivated(true);
        dispatch(setScheduleDatas(itemId,defaultDatas));
        const actions = await convertWeekToSchedulerActions(defaultDatas,itemId);        
        createMultipleScheduleTask(actions);
    }

    const activateSchedule = () => {
        if(scheduleActivated) {
            removeScheduleConfirmed();
        } else {
            addDefaultSchedule();
        }
    }

    // ======= Header Buttons ==============
    const toggleSwitch = () => {      
      
        const newVal = !scheduleActivated;
        console.log("toggle switched",scheduleActivated,newVal)
        changeScheduleActivation(newVal);
        setScheduleActivated(!scheduleActivated);      
    }
    
    const HeaderToggle = (props) => {
      
        return (
            <View style={{marginLeft:10,maxWidth:40,width:40,backgroundColor:"transparent"}}>
                <Switch  onValueChange={toggleSwitch} value={activatedRef.current} thumbColor="white" trackColor={{false:"#CCC",true:"#CCC"}} ios_backgroundColor='#999'/>
            </View>    
        )
    }

    // Header Buttons it's a JSX node
    const ScreenHeaderButtons = () => {
        const iconSize = 32;
        // application is for Thermostat
       if(isThermostat) return null;

        return (
            <>
                <HeaderToggle callback={activateSchedule}/>
            </>

        )
    }

    return (
            <SafeAreaView style={{flex:1}}>            
                <View style={{minHeight:84,alignItems:'center',justifyContent:'flex-start'}}>
                        <HeaderWithBack title={t("scenarios:SCHEDULE_HEATER_TITLE")} themeDependency screenHeaderButtons={<ScreenHeaderButtons/>}/>
                </View>
                <ScrollView style={{marginTop:(activatedRef.current == false && isThermostat == false) ?-20 : 0}}>                
                    <>
                        { wd.map((value,index) => {
                            return (
                                <DayWrapper key={`dayWrapper-${index}`}>
                                    <DayLabel>{value}</DayLabel>
                                    <ProgramHeaterDay withChevron callback={() => {modifyDay(index)}} dayId={index} ranges={datas[index]} typeName={typeName}/>                           
                                </DayWrapper>
                            )
                        })}
                        {(activatedRef.current == false && isThermostat == false) && 
                            <View style={{position:'absolute',backgroundColor:'#000000CC',width:'100%',height:'100%'}}>
                        
                            </View>
                        }
                    </>               
                 </ScrollView>                
            </SafeAreaView>
    )
}

const DayLabel =styled.Text`
        font-size:20px;
        color: ${props => props.color || "#999"};
        text-transform:capitalize;
        margin-bottom:10px;
`; 

const DayWrapper = styled.View`
    margin:15px;
`; 
