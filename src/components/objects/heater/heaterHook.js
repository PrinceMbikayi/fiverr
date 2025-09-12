import { useState, useEffect } from 'react';
import { useStore,useSelector,useDispatch } from 'react-redux';

import {Api} from '_api';
import {getAllObjects,getObjectsByTypeName,getObjectById,getWidgetReference,getObjectRuntimeDatas} from '_helpers/selectors';
import {setTaskDeactivatedFlag,updateFlags,heaterSetIsActivated} from '_actions/objects';
import {updateStatus,objectUpdateProperty,updateRuntimeDatas} from '_actions/objects';


import { Assets} from '_helpers/assets';
import {convertToSchedule,getHeaterDependencies,getCurrentTimeProgramAction} from '_helpers/heaterTools';
import {heaterFamilyPrograms} from '_config/products/core';
import {setScheduleDatas} from '_actions/objects';

import {useAppGlobal} from '_helpers/appGlobalProvider';
import { useObject } from '_hooks/object';

const defaultSchedule = [   
    [{start:'00:00',end:'23:59',mode:'off'}],
    [{start:'00:00',end:'23:59',mode:'off'}],
    [{start:'00:00',end:'23:59',mode:'off'}],
    [{start:'00:00',end:'23:59',mode:'off'}],
    [{start:'00:00',end:'23:59',mode:'off'}],
    [{start:'00:00',end:'23:59',mode:'off'}],
    [{start:'00:00',end:'23:59',mode:'off'}]
]

const useHeater = (
  itemId
) => {
  

    //console.log("useHeater",itemId);
    const dispatch = useDispatch();
    const {getObjectMapped} = useAppGlobal();
    const uObject =  useObject(itemId);

    const {objectDatas,statuses :objStatuses} = uObject;
    const {typeName} = objectDatas;

   // const objectDatas = useSelector(state => getWidgetReference(state,itemId));
    const itemRuntimeDatas = useSelector(state =>getObjectRuntimeDatas(state,itemId));
    //const objStatuses = objectDatas.statusDictionary;
    
    const mappedType = getObjectMapped(objectDatas?.typeName);  
    const heaterType = itemRuntimeDatas?.disguiseType || mappedType || objectDatas.typeName;

    const scheduleDatas = itemRuntimeDatas?.scheduleDatas;
    const isActivated = itemRuntimeDatas?.programActivated || false;
    const activeStatusesImages = Assets.getStatusesIcons(objectDatas.id) || [];

    const allScheduleTasks = useSelector(state => getObjectsByTypeName(state,'SchedulerTask'));   
    const allObjects = useSelector(getAllObjects)

     //-------------------------------------------------------------
    const getCurrentDay = () => {
        //console.log("getCurrentDay")
        const d = new Date();
        const n = d.getDay();
        const currentDay = (n == 0 ? 7 : n-1);
        return currentDay;
    }
     //-------------------------------------------------------------
    /**
    * 
    * 
    * @param {Object} params
    * @param {'id'| 'description'} [props.type] default is description *
    * return description node of object
    */
    const getMyHeatingTasks = (params) => {
        //console.log("là",params)
        const type = (params?.type) || "description" 
        const schedules = (allScheduleTasks == undefined) ? [] : allScheduleTasks.reduce((r,v,i) => {
            if(allObjects[v]) {
                const description = allObjects[v].description
                if(description && description.objectId == itemId) {
                    if(type == "description") {
                        r.push(description);
                    } else {
                        r.push(allObjects[v][type])
                    }
                }            
            }  
            //console.log(r)      
            return r
        },[]);
        //console.log("getMyHeatingTasks schedules",schedules);
        getFirstTaskActivatedFlag();
        return schedules;
    }

    const getMyHeatingTaskIds = () => {
        return getMyHeatingTasks({type:"id"})
    }
    //-------------------------------------------------------------
    const getScheduleTasks = () => {

        //console.log("XX scheduleDatas XX",scheduleDatas)
        
        if(scheduleDatas == undefined) { 
            const myHeatingTasks = getMyHeatingTasks();
            let datas;
            //console.log("heaterHook >> myHeatingTasks !!!!!!!!!!",myHeatingTasks)
            if(myHeatingTasks.length > 0) {
                datas = convertToSchedule(itemId,myHeatingTasks);                
            } else {
                //if composite                
                const heaterTypeName = (objectDatas?.uniType != undefined) ? objectDatas?.uniType : objectDatas?.typeName;               
                datas = JSON.parse(JSON.stringify(heaterFamilyPrograms[heaterTypeName]?.defaultSchedule || defaultSchedule));
                //datas = [];
            }           
            //dispatch(setScheduleDatas(itemId,datas));  
            dispatch(updateRuntimeDatas (itemId,"scheduleDatas",datas))                
            return datas;
        } else {
            return scheduleDatas || [];
        }        
    }
     //-------------------------------------------------------------
    const getFirstTaskActivatedFlag = () => {   
        console.log("getMyHeatingTasks schedules")     
        const flags = allScheduleTasks?.reduce((r,v,i) => {
           
            if(allObjects[v]) {
                const description = allObjects[v].description
                if(description && description.objectId == itemId) {
                    const deactivated = allObjects[v]?.flags?.deactivated || false;
                    //console.log("v - "+itemId+' -',v,allObjects[v]?.flags,deactivated)
                    if(r.length == 0)r.push(!deactivated);
                }
            }        
            return r
        },[]);
       // console.log("flags--->>>",flags);
        if(flags == undefined) {
            
            dispatch(heaterSetIsActivated(itemId,false));
            return false;
        }
        if(flags.length == 0){
            dispatch(heaterSetIsActivated(itemId,false));
            return false;
        }
        dispatch(heaterSetIsActivated(itemId,flags[0]));
        return flags[0];
    }
     //-------------------------------------------------------------
    const _updateDeactivation = (val) => {

        const ids = getMyHeatingTasks({type:"id"});
        console.log("_updateActivationState",ids,val)
        dispatch(setTaskDeactivatedFlag(itemId,ids,val));
        dispatch({type:"FLAGS_DIRECTS",payload :{'ids':ids,'flag':"deactivated",'value':val}})
        dispatch(heaterSetIsActivated(itemId,!val));
    }
    //-----------
    const deactivateTasks = () => {        
        _updateDeactivation(true);       
    }
    //----------
    const activateTasks = () => {       
        _updateDeactivation(false);   
           console.log("j'active")
        
        //const scheduleByDays = convertToSchedule(itemId,getMyHeatingTasks());         
        const progModeAction = getCurrentTimeProgramAction(scheduleDatas);  
        console.log("progModeAction",progModeAction)     
        const request = Api.executeAction(itemId,progModeAction,{})   
          
    }
     //-------------------------------------------------------------


  return {
    objectDatas,
    itemRuntimeDatas,
    scheduleDatas,
    objStatuses,
    heaterType,
    currentDay:getCurrentDay(),
    activeStatusesImages,
    isActivated,
    getMyHeatingTasks,
    getMyHeatingTaskIds,
    getScheduleTasks,
    getFirstTaskActivatedFlag,
    deactivateTasks,
    activateTasks,
    uObject
  };
};

export default useHeater;