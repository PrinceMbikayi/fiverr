import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';


import * as ScenarioHelpers from '_helpers/scenarios';
import { Assets} from '_helpers/assets';

import {Type2ChLight} from './2ChLight';

import {WidgetWrapperInDetails} from '../../ui/widgetWrapperInDetails';
import {useMyTools} from '_helpers/myTools';

import {SchedulesBlock} from '_components/objects/@common/scheduleBlock';
import { useObject } from '_hooks/object';


export const Type2ChLightDetails = (props) => {

    const { t, i18n } = useTranslation();
    const {itemId} = props;
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    

    const scheduleTitles = {
        'Default':t("MENU_SCENARIOS"),
        'Other' :t("MENU_SCENARIOS")+" 2",
        'Delay' : t("scenarios:DELAY")  
    }

    const uObject = useObject(itemId);
    const {widgetReferenceDatas  ,statuses : objStatuses,name,status,getStatus : getMyStatus,execute,toggle} = uObject;

    const {connected} = objStatuses;
    const objectDatas = widgetReferenceDatas;
    const sel = widgetReferenceDatas;
    const firstItem = (sel.id != itemId) ? sel : null;
    const [activeStatusesImages,setActiveStatusesImages] = useState([]);
   
   

   
    useEffect(() => {
       
        const oDatas = sel;
        setActiveStatusesImages((oDatas.id)? Assets.getStatusesIcons(oDatas.id) : []);
        //setSpecialsSchedularTasks(grabSpecialsSchedularTasks())
       
       
       }, [sel]);

     // componentDidMount && unmount
       useEffect(() => {

        
        return () => {
           /* component will unload */
            console.log("cleaned up");
          };
     }, []);
    
     //========================================================
     const myTasks = [
                        {type:'Schedule',id:'Default',title:t("MENU_SCENARIOS")},
                        {type:'Schedule',id:'Other',title:t("MENU_SCENARIOS")+" 2"},
                        {type:'Delay',id:'Delay',title:t("scenarios:DELAY")},    
                    ];
    /*
    const {grabSpecialsSchedularTasks} = uObject;
    const[specialsSchedularTasks,setSpecialsSchedularTasks]  = useState(grabSpecialsSchedularTasks(myTasks));
    console.log("gloglogloglogloglogloglogloglogloglo",specialsSchedularTasks)
    */
    //const[specialsSchedularTasks,setSpecialsSchedularTasks]  = useState({});
    const[specialsSchedularTasks,setSpecialsSchedularTasks]  = useState(uObject.grabSpecialsSchedularTasks(myTasks));
    //================== EFFECTS (update tasks)==================
    
    const doSetSpecialTasks = () => {              
        setSpecialsSchedularTasks(uObject.grabSpecialsSchedularTasks(myTasks));
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
        return () => { console.log("unsubscibe me");unsubscribe();console.log("unsubscibe done")}
     },[navigation]);
      //----------------
      
      useEffect(() => {   
        console.log('refresh / redraw => specialsSchedularTasks changed',specialsSchedularTasks)
      },[specialsSchedularTasks]);
      
      //===========================================


    //================ move to Pages ==============
    
    const myTools = useMyTools();
    const {navigateToSchedule,navigateToDelay} = myTools;

    const regrab = (id) => {       
        const tasks = uObject.grabSpecialsSchedularTasks(myTasks);       
        setSpecialsSchedularTasks(tasks);
        return tasks[id];
    }

    const move = (id) => {        
        navigateToSchedule(itemId,regrab(id),scheduleTitles[id],navigation);        
    }
    const moveDelay = (id) => {
        console.log("id ici",id,itemId,specialsSchedularTasks[id],scheduleTitles[id],navigation)
        navigateToDelay(itemId,specialsSchedularTasks[id],scheduleTitles[id],navigation)
      
    }
    //===============================================

    // Set Flag
    const setActivatedFlag = async(taskId,state)  => {       
        const taskObjectId = specialsSchedularTasks[taskId]?.taskObjectId
        const res = await ScenarioHelpers.setTaskActivated(taskObjectId,state).catch((err)=> {console.log("setActivatedFlag",err)});
        
    }    

    // define SchedulesBlock props
    const schedules = [
                        {taskId:"Default",datas:specialsSchedularTasks["Default"],title:specialsSchedularTasks["Default"]?.title},
                        {taskId:"Other",datas:specialsSchedularTasks["Other"],title:specialsSchedularTasks["Other"]?.title}
                    ];
    const delays =  [
                         {taskId:"Delay",datas:specialsSchedularTasks["Delay"],title:specialsSchedularTasks["Delay"]?.title}
                    ];

    const callbacks = {'callback':move,'toggleCallback':setActivatedFlag,'delayCallback':moveDelay};


    return (
            <>                
                <WidgetWrapperInDetails connected={connected}>
                    <Type2ChLight itemId={itemId} activeStatusesImages={activeStatusesImages} firstItem={firstItem} uObject={uObject} />
                </WidgetWrapperInDetails>
                {<SchedulesBlock schedules={schedules} delays={delays} callbacks={callbacks}/>}
            </>
    )
}