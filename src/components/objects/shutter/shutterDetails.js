import React from 'react';
import {useContext,useState,useEffect} from 'react'
import { View,Text } from 'react-native';


import { useTranslation } from 'react-i18next';


import { useNavigation,useFocusEffect } from '@react-navigation/native';
import * as ScenarioHelpers from '_helpers/scenarios';

import {TypeShutter} from './shutter';
import {useMyTools} from '_helpers/myTools';
import { useTheme } from '_theming/themeProvider';
import {SchedulesBlock} from '_components/objects/@common/scheduleBlock';

import { useObject } from '_hooks/object';

/**
 * Shutter Details content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {object} props.statuses
 * @param {string} [props.backgroundColor] in case typeName is not present in domusIcons
 * 
 */
export const TypeShutterDetails = (props) => {
    const { t, i18n } = useTranslation();
    const {itemId} = props;
    const {theme} = useTheme();
    const navigation = useNavigation();
    const uObject = useObject(itemId);
    const {objectDatas,activeStatusesImages,widgetReferenceDatas,statuses,name,connected,status,getStatus : getMyStatus,execute,toggle} = uObject;
   
    const objStatuses = widgetReferenceDatas?.statusDictionary;
                                                                

    const grabSpecialsSchedularTasks = () => {
        return ScenarioHelpers.getObjectSchedulerTasks([  
            ['Schedule','Open',itemId],
            ['Schedule','Close',itemId],
        ]);
    } 


    const[specialsSchedularTasks,setSpecialsSchedularTasks]  = useState(grabSpecialsSchedularTasks())                                                                     

    const doSetSpecialTasks = () => {              
        setSpecialsSchedularTasks(grabSpecialsSchedularTasks());
    }

   // exemple useEffect focus ok
    useEffect(() => {   
        const unsubscribe =  navigation.addListener('focus', () => {
               console.log("screen focused !!! ",navigation)               
                doSetSpecialTasks();
            }); 
        return  unsubscribe
      },[navigation]);
    //----------------
    useEffect(() => {   
        console.log('refresh / redraw => specialsSchedularTasks changed')
    },[specialsSchedularTasks]);
    //===========================================

     //---------------- move to Pages ---------------
        
     const myTools = useMyTools();
     const {navigateToSchedule,navigateToDelay} = myTools;
 
     const move = (id,associatedAction) => {          
         navigateToSchedule(itemId,specialsSchedularTasks[id],scheduleTitles[id],navigation,associatedAction);        
     }
     
     // Set Flag
     const setActivatedFlag = async(taskId,state)  => {
        const taskObjectId = specialsSchedularTasks[taskId].taskObjectId
         const res = await ScenarioHelpers.setTaskActivated(taskObjectId,state).catch((err)=> {console.log("setActivatedFlag",err)});
         console.log("res",res)
     }    

    const scheduleTitles = {
        'Open':t("scenarios:OPEN"),
        'Close' :t("scenarios:CLOSE")
    }

    // define SchedulesBlock props
    const schedules = [
        {taskId:"Open",datas:specialsSchedularTasks["Open"],title:scheduleTitles["Open"],associatedAction:"UP"},
        {taskId:"Close",datas:specialsSchedularTasks["Close"],title:scheduleTitles["Close"],associatedAction:"DOWN"}
    ];   

    const callbacks = {'callback':move,'toggleCallback':setActivatedFlag};

    return (
            <>                
                <View style={{flex:1,maxHeight:200,minHeight:200}}>                    
                    <TypeShutter newIcon={props.newIcon}  {...props} uObject={uObject} activeStatusesImages={activeStatusesImages}/>
                </View>  
                <SchedulesBlock schedules={schedules}  callbacks={callbacks}/>
            </>
    )
}