import '_brand/templates/components/objects/common/locales'
import { useState, useEffect } from 'react';
import { View} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import {useAppGlobal} from '_helpers/appGlobalProvider';
import {getObjectById,getObjectByIdSimple} from '_helpers/selectors';
import {Api} from '_api';
import { objectUpdateProperty,updateStatus as updateStatusAction} from '_actions/objects';
import { maintenanceAdd,maintenanceRemove} from '_actions/objects';
import {getObjectRuntimeDatas} from '_helpers/selectors';
import { useStatuses} from './statuses';

import {grabSpecialsSchedularTasks as grabTasks} from './utils'
import athomeProductsDatas from '_config/products/athomeProducts.json';
import {getProductExtras}  from '_config/products/core';
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import {useGlobalModal} from '_components/ui/globalModal'
import { useTranslation } from 'react-i18next';



const togglePatterns = [['on','off'],['open','close']]




export const useObject = (itemId) => {

    // console.log('SEE Src/hooks/object/index ', itemId);
    if(itemId == undefined) return {}
    const {getObjectMapped} = useAppGlobal();
    const globalModal = useGlobalModal();  

    const { t, i18n } = useTranslation();
    const tns = "common";
    
   const objectDatas = useSelector(state => getObjectById(state,itemId));
   const itemRuntimeDatas = useSelector(state =>getObjectRuntimeDatas(state,itemId));
   
  
   if (objectDatas == undefined) {
       //("no datas",itemId)
   }
   const dispatch = useDispatch();

   const widgetReferenceDatas = useSelector(state => {
        if(objectDatas?.typeName != 'composite') return  objectDatas;
        if(objectDatas.components!=undefined && objectDatas.components.length > 0) {
            return  getObjectById(state,objectDatas.components[0]) 
        }
        return {}
   });
   
   const extraConfig = getProductExtras(widgetReferenceDatas?.typeName);


         //???????????????????????????????????????????????????????????
             const buttons = [
                 {
                     id:"return",
                     text:`${t(tns + ":" + "RETURN")}`,
                     action:()=>onCancelPressed(),
                     textColor:"#007AFF"
                 }
             ]
         
           const onCancelPressed = () => {
             globalModal.close();
           }
     
         
           const openPopup = () => {  
               const content = (
                 <View style={{width:"90%", backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                     <GlobalToast 
                         toastTitle={`${t(tns + ":" + "WARNING")}`}
                         toastBody={`${t(tns + ":" + "EQUIPMENT_BLOCKED_BY_WIND_PROTECTION_ROUTINE")}`}
                         buttons={buttons}
                     />
                 </View>
                     )
               globalModal.setContent(content,{type:'centered'});    
               globalModal.toggle();
           }
         //???????????????????????????????????????????????????????????

    const executeAction = async (actionName,params,updateStatus) => {
        const executeMe =  await Api.executeAction(itemId,actionName,params);
        console.log('executeAction :', executeMe);
        if(executeMe.errMsg == "object is locked"){
            openPopup()
        }
        console.log("executeMe ==> ",JSON.stringify(executeMe));
       return executeMe
    }

    //Add by Harold-----
    const addStatus = (statusName,value) => {
        Api.addStatus(itemId,statusName,value);
    }
    //---------
  
    const doGetStatus = (statusName) => {
        return objectDatas?.statusDictionary?.[statusName]
    }

    const updateStatus = (statusName,value,forId) => {

        const id = forId || itemId;
        const actionCreated = updateStatusAction(id,statusName,value) 
        console.log("ACtion ooooo :", actionCreated)
        //dispatch(actionCreated);
    }

    const uStatus = useStatuses(itemId,widgetReferenceDatas?.statusDictionary,widgetReferenceDatas?.typeName);



    //-------------------------------------------------
    const canToggle = () => {
        const currentStatus = doGetStatus('status');
        let nextStatus = null;
        for (var i = 0; i < togglePatterns.length; i++) {
            const pos = togglePatterns[i].indexOf(currentStatus)
           if (pos != -1) {
                nextStatus = togglePatterns[i][Math.abs(pos-1)]
                break;
            }
        }
        // console.log('canToggle =>',nextStatus)
        
    }

    const toggle = () => {
       canToggle();
    }
    //-------------------------------------------------
    /**
     * 
     * @param {string} text 
     * @returns 
     */
    const rename = async(text) => {
        res = await Api.renameObject(itemId, text);
        // console.log("res",res)
        if(res.errCode == 200) {
            const action = objectUpdateProperty(itemId, 'name', text);
            // console.log("action",action);          
            dispatch(action);
        }
        return res;
    }
    //------------------------------------------
    

    const getActiveStatusesImages = () => {
       return [];
      
    }

    const getIcon = () => {
        const renderAsTypeName = getObjectMapped(widgetReferenceDatas?.typeName);       
        return renderAsTypeName || widgetReferenceDatas?.img
    }
    const [icon, setIcon] = useState(getIcon);
    //Assets.getStatusesIcons(firstItem.id)
    

    //------------------------------------------

    const hasAction = (actionName) => {
        const actions = widgetReferenceDatas?.actions || []
        const has = actions?.reduce((r,v,i)=> {
            if(v.name == actionName)r = true;
            return r
        },false)
    
        //console.log(actionName,"has",has);
        return has;
    }

    //==========================================================
    const grabSpecialsSchedularTasks = (tasks) => {      
        return grabTasks(itemId,tasks);
    }

    const updateMaintenance = (maintenanceState) => {
       
        let actionCreated;
        if(maintenanceState == true) actionCreated =  maintenanceAdd(itemId);
        if(maintenanceState === false) actionCreated = maintenanceRemove(itemId)
        if(actionCreated != undefined)   dispatch(actionCreated);
      
    }



    return {
        connected:objectDatas?.connected,
        objectDatas:objectDatas,
        isHidden:objectDatas?.flags?.hidden,
        widgetReferenceDatas:widgetReferenceDatas,
        name:objectDatas?.name,
        statuses:widgetReferenceDatas?.statusDictionary,
        parameters:widgetReferenceDatas?.parameters,
        status:widgetReferenceDatas?.statusDictionary?.status,
        updateStatus:updateStatus,
        getStatus:doGetStatus,
        execute:executeAction,
        addStatus,
        toggle:toggle,
        rename:rename,
        icon:icon,
        getActiveStatusesImages:getActiveStatusesImages,
        isComposite:(objectDatas?.typeName == "composite"),
        firstItem:(objectDatas?.id != widgetReferenceDatas?.id) ? widgetReferenceDatas : null,
        hasAction:hasAction,
        ...uStatus,
        grabSpecialsSchedularTasks,
        extraConfig:extraConfig,
        runtimeDatas:itemRuntimeDatas,
        updateMaintenance
    }
}
