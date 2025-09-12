import React from 'react';
import {useContext,useState,useEffect} from 'react'
import { View,Switch,Text } from 'react-native';
import { useStore,useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';


import * as ScenarioHelpers from '_helpers/scenarios';
import { Assets} from '_helpers/assets';

import {TypeLight} from './light';
import {FlatGrid} from '_components/list/flatGrid'
import { DividerText} from '_components/ui/divider-with-text';

import {useMyTools} from '_helpers/myTools';
import { useTheme } from '_theming/themeProvider';

import {getObjectById,getWidgetReference} from '_helpers/selectors';
import {SchedulesBlock} from '_components/objects/@common/scheduleBlock';

import {lightPleasures} from './config';

import { useObject } from '_hooks/object';

/**
 * return Type Light Details page content
 * 
 * @param {Object} props itemId
 * @param {number} props.itemId 
 * 
 */
export const TypeLightDetails = (props) => {

   
    const { t, i18n } = useTranslation();
    const { itemId} = props;
    const {theme} = useTheme();
    const navigation = useNavigation();
    

    
    const scheduleTitles = {
        'Default':t("MENU_SCENARIOS"),
        'Other' :t("MENU_SCENARIOS")+" 2",
        'Delay' : t("scenarios:DELAY")  
    }

    const uObject = useObject(itemId);
    const {objectDatas,widgetReferenceDatas,statuses : objStatuses,name,connected,status,getStatus : getMyStatus,execute,toggle} = uObject;
   
   // const objectDatas = useSelector(state => getWidgetReference(state,itemId)); 
    //const objStatuses = objectDatas.statusDictionary;
    const objActions = objectDatas.actions;
    const activeStatusesImages = Assets.getStatusesIcons(objectDatas.id) || []


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
      },[specialsSchedularTasks,activeStatusesImages]);
      //===========================================

    const regrab = (id) => {       
        const tasks = grabSpecialsSchedularTasks();
        console.log('regrab',tasks)
        setSpecialsSchedularTasks(tasks);
        return tasks[id];
    }

    //================ move to Pages ==============
    
    const myTools = useMyTools();
    const {navigateToSchedule,navigateToDelay} = myTools;

    const move = (id) => {        
        navigateToSchedule(itemId,regrab(id),scheduleTitles[id],navigation);        
    }
    const moveDelay = (id) => {
        navigateToDelay(itemId,specialsSchedularTasks[id],scheduleTitles[id],navigation);      
    }
    //===============================================
   
    const setActivatedFlag = async(taskId,activatedState)  => {       
       
        const taskObjectId = specialsSchedularTasks[taskId].taskObjectId;
        //specialsSchedularTasks[taskId].activated = activatedState       
        //console.log("on desactive",taskId,activatedState,specialsSchedularTasks," --> ",taskObjectId)
       
        if(taskObjectId != undefined) {
            const res = await ScenarioHelpers.setTaskActivated(taskObjectId,activatedState).catch((err)=> {console.log("setActivatedFlag",err)});
            //console.log("res",res)
            return "ok"
        }       
        return 'pas ok';
    }    


    const [luminoPleasure,setLuminoPleasure] = useState(null);

    /**
     * @ignore 
     * @param {number} index 
     * @return set state of luminoPeasure and execute Action on API
     */
    const onLigthPleasureSelect = (index) => {
        //console.log("onLigthPleasureSelect",lightPleasures[index]);
        setLuminoPleasure(lightPleasures[index].color);       
        execute("COLOR",{mArgs:[{name:'color',value:lightPleasures[index].color}]});

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
                <View style={{flex:1,maxHeight:220,height:220,minHeight:220}}>
                    <TypeLight  itemId={itemId}  
                                activeStatusesImages={activeStatusesImages}                                
                                luminoPleasure={luminoPleasure}
                                
                                />
                </View>
                <View style={{padding:10}}>
                    <DividerText label={t("productTypes:LIGHT_SCRIPT_LIGHT_PLEASURE")} color="#999999" lineColor="#CCCCCC" />       
                </View> 
                <FlatGrid lightPleasures ={lightPleasures} callback={onLigthPleasureSelect}/>               
                 <SchedulesBlock schedules={schedules} delays={delays} callbacks={callbacks}/>          
            </View>
    )
}
/*
<TypeLight  {...props} 
                                statuses={objStatuses} 
                                actions={objActions}                               
                                widgetReferenceId={objectDatas?.id} 
                                activeStatusesImages={activeStatusesImages}                                
                                luminoPleasure={luminoPleasure}/>*/