import React from 'react';
import {useContext,useState,useEffect,useRef} from 'react';
import { View,Text,Dimensions} from 'react-native';


import { useTranslation } from 'react-i18next';
import { useNavigation,useFocusEffect } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider';
import * as ScenarioHelpers from '_helpers/scenarios';
import { Assets} from '_helpers/assets';
import {TypePlug} from './plug';
import {WidgetWrapperInDetails} from '../../ui/widgetWrapperInDetails';
import {SchedulesBlock} from '_components/objects/@common/scheduleBlock';
import {useMyTools} from '_helpers/myTools';

import { useObject } from '_hooks/object';

/**
 * Plug details page content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {string} [props.newIcon] in case typeName is not present in domusIcons
 * 
 */
export const TypePlugDetails = (props) => {
    console.log("TypePlugDetails",props)
    const { t, i18n } = useTranslation();
    const { itemId,newIcon} = props;
    const uObject = useObject(itemId);
    console.log("------------- uObject --------------")
    console.log(uObject)
    const {objectDatas,statuses : objStatuses} = uObject;
    const {connected} = objectDatas;
    const {theme} = useTheme();
   const navigation = useNavigation(); //v5     

    const scheduleTitles = {
        'Default':t("MENU_SCENARIOS"),
        'Other' :t("MENU_SCENARIOS")+" 2",
        'Delay' : t("scenarios:DELAY")  
    }

   
    const activeStatusesImages = Assets.getStatusesIcons(objectDatas.id) || []
    


    //========================================================
    const grabSpecialsSchedularTasks = () => {
        return ScenarioHelpers.getObjectSchedulerTasks([  
            ['Schedule','Default',itemId],
            ['Schedule','Other',itemId],
            ['Delay','Delay',itemId]
        ]);
    } 
   
    const mountedRef = useRef(0);
    const[specialsSchedularTasks,setSpecialsSchedularTasks]  = useState(grabSpecialsSchedularTasks())
     
    const doSetSpecialTasks = () => {              
        setSpecialsSchedularTasks(grabSpecialsSchedularTasks());
      }
    
    if(mountedRef.current == 0) {
        doSetSpecialTasks();
        mountedRef.current = 1
    }
    
    //--------------------
    
   
    
    useEffect(() => 
    {   
       //setMounted(1);

       const unsubscribe =  navigation.addListener('focus', () => {
               console.log("screen focused !!! ",navigation)               
                doSetSpecialTasks();
            }); 
        return () => { console.log("unsubscibe me");unsubscribe;console.log("unsubscibe done")}
      },[navigation]);
     
      /*
      useFocusEffect(() => {
             console.log("Focused")
            doSetSpecialTasks()
        } 
      );
    */
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
        // console.log("in plug details, move",id);
        navigateToSchedule(itemId,regrab(id),scheduleTitles[id],navigation);        
    }
    const moveDelay = (id) => {
        navigateToDelay(itemId,specialsSchedularTasks[id],scheduleTitles[id],navigation)
      
    }
    //===============================================

    const setActivatedFlag = async(taskId,state)  => {
        const taskObjectId = specialsSchedularTasks[taskId].taskObjectId
        const res = await ScenarioHelpers.setTaskActivated(taskObjectId,state).catch((err)=> {console.log("setActivatedFlag",err)});
        console.log("res",res)
    }

   

    // define SchedulesBlock props
    const schedules = [
        {taskId:"Default",datas:specialsSchedularTasks["Default"],title:scheduleTitles["Default"]},
        {taskId:"Other",datas:specialsSchedularTasks["Other"],title:scheduleTitles["Other"]}
    ];
    const delays =  [
            {taskId:"Delay",datas:specialsSchedularTasks["Delay"],title:scheduleTitles["Delay"]}
        ];

    const callbacks = {'callback':move,'toggleCallback':setActivatedFlag,'delayCallback':moveDelay};



    return (
            <View style={{backgroundColor:'transparent'}}>               
                <WidgetWrapperInDetails connected={connected}>
                    <TypePlug   activeStatusesImages={activeStatusesImages} 
                                widgetReferenceId={objectDatas.id} 
                                inLevel2={true}
                                uObject={uObject}
                     />
                </WidgetWrapperInDetails>               
                {specialsSchedularTasks &&                
                    <SchedulesBlock schedules={schedules} delays={delays} callbacks={callbacks}/>
                }
            </View>
    )
}