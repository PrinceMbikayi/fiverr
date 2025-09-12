import React from 'react';
import {useContext,useState,useEffect} from 'react'
import { View,Text} from 'react-native';
import { useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { useObject } from '_hooks/object';

//------------------------------------------------------
import {TypeGuardian} from './guardian';

import * as ScenarioHelpers from '_helpers/scenarios'
import { Assets} from '_helpers/assets';
import {useMyTools} from '_helpers/myTools';
import { getObjectById } from '_helpers/selectors';
import {SchedulesBlock} from '_components/objects/@common/scheduleBlock';

//=======================================================
export const TypeGuardianDetails = (props) => {

    
    const { t, i18n } = useTranslation();
    const { theme,itemId} = props;
                                                  
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    
    const scheduleTitles = {
        'Default':t("MENU_SCENARIOS"),
        'Other' :t("MENU_SCENARIOS")+" 2",
        'Delay' : t("scenarios:DELAY")  
    }

    const uObject = useObject(itemId);
    const {objectDatas,widgetReferenceDatas,statuses : objStatuses,name,connected,status,getStatus : getMyStatus,execute,toggle} = uObject;
    //const objectDatas = useSelector(state => getObjectById(state,itemId));
    //const objStatuses = objectDatas.statusDictionary;
    const activeStatusesImages = (itemId)? Assets.getStatusesIcons(itemId) : [];
    //console.log("TypeGuardianDetails ",objStatuses)

    //========================================================
    const grabSpecialsSchedularTasks = () => {
        return ScenarioHelpers.getObjectSchedulerTasks([  
            ['Schedule','Default',itemId],
            ['Schedule','Other',itemId],
            ['Delay','Delay',itemId]
        ]);
    } 

    const[specialsSchedularTasks,setSpecialsSchedularTasks]  = useState(grabSpecialsSchedularTasks())  
    //================== EFFECTS (update tasks)==================
    
    const doSetSpecialTasks = () => {              
        setSpecialsSchedularTasks(grabSpecialsSchedularTasks());
      }
    //-------------------
    useEffect(() => {
       
        doSetSpecialTasks();
    },[objectDatas?.tasks]);
    //--------------------
   useEffect(() => 
   {
       const unsubscribe =  navigation.addListener('focus', () => {
       });
       return () => { console.log("unsubscibe me");unsubscribe;console.log("unsubscibe done")}
    },[navigation]);
      //----------------
      useEffect(() => {   
        console.log('refresh / redraw => specialsSchedularTasks changed')
      },[specialsSchedularTasks]);
      //===========================================


    //================ move to Pages ==============
    
    const myTools = useMyTools();
    const {navigateToSchedule,navigateToDelay} = myTools;

    const regrab = (id) => {
       
        const tasks = grabSpecialsSchedularTasks();
        console.log('regrab',tasks)
        setSpecialsSchedularTasks(tasks);
        return tasks[id];
    }

    const move = (id) => {        
        navigateToSchedule(itemId,regrab(id),scheduleTitles[id],navigation);        
    }

    //===============================================

    // Set Flag
    const setActivatedFlag = async(taskId,state)  => {
        const taskObjectId = specialsSchedularTasks[taskId].taskObjectId
        const res = await ScenarioHelpers.setTaskActivated(taskObjectId,state).catch((err)=> {console.log("setActivatedFlag",err)});
        console.log("res",res)
    }
    //------------------------------------------------
      // define SchedulesBlock props
    const schedules = [
        {taskId:"Default",datas:specialsSchedularTasks["Default"],title:scheduleTitles["Default"]},
        {taskId:"Other",datas:specialsSchedularTasks["Other"],title:scheduleTitles["Other"]}
    ];
   

    const callbacks = {'callback':move,'toggleCallback':setActivatedFlag};

   return (
            <>                
                <View style={{flex:1,maxHeight:200,minHeight:200}}>
                    <TypeGuardian newIcon={props.newIcon} hideMoreLink {...props} uObject={uObject} statuses={objStatuses} activeStatusesImages={activeStatusesImages}/>
                </View>                
                <SchedulesBlock schedules={schedules} callbacks={callbacks}/>
            </>
    )
}
