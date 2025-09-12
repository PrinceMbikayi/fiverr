import * as ActionsTypes from './objectTypes';
import {Normalise} from '../helpers/normalise';
import {Api} from "../api";
import {dataGetObject} from '_helpers/dataTools';
import { getGateways } from '_api/Api';

import {updateStatus} from './objects';
import {updateRDependencies, updateGroupTraits, updateGroupComponentTypes, updateRDependenciesHarold} from '_actions/objects';

let isLoadingAdd;
let toLoad = [];
let tryAgain = {};
const maxRetry = 3
const retryDelay = 10*1000 // milliseconds
let testo = "HOP";

function currentLoadingSituation() {
  return toLoad
}


export async function addObjectAction(id,dispatch) {
  
  // be careful ids are strings not numbers
  

    if(toLoad.indexOf(""+id) == -1 && id != undefined)toLoad.push(""+id);
   
    if(!isLoadingAdd) {
      isLoadingAdd = true;     
      console.log(" ADD OBJECT ACTION ASYNC :", id)
      response = await Api.getObject(id).catch((err) => { console.log(err)}); 
      console.log(" RESPONSE ACTION ASYNC :", response)
      //----------------------------------------
      if(response.errCode != 200) {
        const pos = toLoad.indexOf(""+id);     
        toLoad.splice(pos,1);
        isLoadingAdd = false;      
        if(toLoad.length > 0) {
          //console.log("there is an error ("+response.errCode+") so load next ("+toLoad[0]+")");
          addObjectAction(toLoad[0],dispatch)
        } else {
          //console.log("there is an error ("+response.errCode+") an no more objects in queue -------------> add objects complete");
          const checkTry = tryAgain?.[id];
          if(checkTry == undefined)tryAgain[id] = 0
          if(tryAgain[id] < maxRetry) {
           // console.log("but we try again")
            tryAgain[id] = tryAgain[id]+1;
            toLoad.push(id);
            setTimeout(()=> { addObjectAction(id,dispatch); },2000)
            return response.errCode;
           
          } else {
            delete tryAgain[id]
            return response.errCode
          }
        }
       
         
      }
      //----------------------------------------
      const objects = [{...response.res.data.resource, uri:response?.res?.data?.uri}];
     
      const ignoreAddObjectAction = shouldIgnoreAddObject(objects);
      //--------  ---------- ------------- -----
      if(ignoreAddObjectAction) {
        //console.log("ignoreAddObjectAction.reason",ignoreAddObjectAction.reason);
        //so continue
        const pos = toLoad.indexOf(""+id);     
        toLoad.splice(pos,1);
        isLoadingAdd = false;        
        if(toLoad.length > 0) {
          //console.log("object Loaded is ignored so load next ("+toLoad[0]+")");
          addObjectAction(toLoad[0],dispatch)
        } else {
         // console.log("ignoreAddObjectAction --------------> add objects complete");
        }

        // end it 
        //console.log("ignored so end process now")
        return ignoreAddObjectAction
      }

      // gateways 

      const gatewaysMap = await getGateways();
      
      console.log("Before Normalise ADD XXXXXX----check point 1")
       normalizeAndAdd(objects,dispatch,gatewaysMap)

      console.log("After Normalise ADD XXXXXX----check point 1")

    //    //--------  ---------- ------------- -----
    //   let normalized = Normalise.normaliseObjectsDurin(objects,undefined,false,gateways);     
    //  console.log("------->>>>>>      addObjectAction test DomusApplication temporary tasks normalized done")

    //   dispatch({
    //     type:ActionsTypes.OBJECT_ADD,
    //     payload:normalized
    //    })

       //---- check if schedule task update be careful of -------
       //console.log("bon c'est juste avant");
       if(objects[0]!= undefined && objects[0].name.indexOf("Task-Schedule-") !=-1) {
        
          const ScheduledObject = objects[0].name.split("-").pop();
          dispatch(updateStatus(ScheduledObject,'needRefresh',Date.now()))
       }

       //console.log("bon c'est passé");

      const pos = toLoad.indexOf(""+id);     
      toLoad.splice(pos,1);
      isLoadingAdd = false;
     
      if(toLoad.length > 0) {
      //  console.log("alors je charge le suivant "+toLoad[0])
        addObjectAction(toLoad[0],dispatch)
      } else {
        //console.log("add objects complete");
      }
    } else {
      //console.log("isLoading  ",id,JSON.stringify(toLoad)) 
    }
  
  }
  /**
   * 
   * @param {array} objects 
   */
  export function normalizeAndAdd (objects,dispatch,gateways) {
      console.log("NORMALISE AND ADD INTERIEUR", gateways)
        
    console.log('OBBBBBBBBJECT :', JSON.stringify(objects));
      let normalized = Normalise.normaliseObjectsDurin(objects,undefined,false,gateways);     

      dispatch({
        type:ActionsTypes.OBJECT_ADD,
        payload:normalized
      })
    }


  function shouldIgnoreAddObject (objects) {
    if(objects.length > 1) return false
    // test temporary task schedule i.e. when changing temperature set in thermostat manual mode;
    
    if(objects[0] == undefined)return ("object shouldIgnoreAddObject objects[0] undefined");
    const description = objects[0].description;
    if(description && description.scriptname && description.scriptname.indexOf('DomusApplication_') !=-1){
      return {'reason':'Ignored because Temporary Task from DomusApplication'}
    } 

    return false;
  }





  /**
   *  A Post normalize action occured here when object to refresh is a Composite
   *  In order to add uniType, can't be directly in Normalize as
   *  not all objects are normalized but only one, thus a composite can't grab
   *  information on its components and determine its uniType
   * 
   * @param {*} id 
   * @param {*} store 
   */
  export async function refreshObjectAction(id,store) {

    console.log(" HELLLLLOOOO REFRESHHH :", id)
    const dispatch = store.dispatch;
    const item = dataGetObject(id,store.getState()); 
   
   console.log("refreshObjectAction c'est ",item)
   if(item == undefined) return true; 
    response = await Api.getObject(id);
    console.log("response_async",response)
    console.log(" API GETTTT :", id)
    
    const objects = [response.res.data.resource];    
    let normalized = Normalise.normaliseObjectsDurin(objects,item.uniType);
    
    // in fact only one object is refreshed so
    const itemId = normalized.loaded[0];
    const newItemDatas = normalized.entities.objects[itemId];
    const typeName = newItemDatas.typeName;
    if(typeName == "composite") {
      
      const firstComponentId = newItemDatas.components[0];
      const firstComponent = store.getState()?.objects?.entities?.objects[firstComponentId];
      const uniType = firstComponent.typeName;
     
      let newByTypeNames = {};
      newByTypeNames[uniType] = [itemId];
      normalized.objectsByTypeNames = newByTypeNames;
      normalized.entities.objects[itemId].uniType = uniType;

      // update components rDependencies
      console.log("JE SURVEIL !! :", newItemDatas)
      newItemDatas?.components.map((v,i) => {
       store.dispatch(updateRDependencies ([v],[],itemId,'groups'));
       //store.dispatch(updateRDependencies ([],[v],itemId,'groups'));
       store.dispatch(updateGroupTraits (itemId,newItemDatas?.traits));
       //store.dispatch(updateRDependenciesHarold (itemId,newItemDatas?.components));
       store.dispatch(updateGroupComponentTypes (itemId,newItemDatas?.componentTypes));
      });

    }
    console.log('NORMALIZED_PUSH_REFRESH_TO_STORE :', normalized.entities.objects[id]);
    store.dispatch({type:ActionsTypes.OBJECT_UPDATE,payload:{'id':id,'value':normalized.entities.objects[id]}});
    // cette horreur ci-dessous provoquait le groupe bleu de la mort, je garde pour archive 
    //addObjectAction({type:ActionsTypes.OBJECT_UPDATE,payload:{'id':id,'value':normalized.entities.objects[id]}})
    
    return response
  }


  /**
   * @param {*} id 
   * @param {*} store 
   */
  export async function refreshGroup(id,resource,store) {
    // response = await Api.getObject(id);
    // console.log("response_async",response)
    // console.log(" API GETTTT :", id)

    const uniType = resource?.componentTypes[0]
    console.log('UNI_TYPE :', uniType);
    
    const objects = [resource]//[response.res.data.resource];  
    console.log('HARDY :', objects);  
    let normalized = Normalise.normaliseObjectsDurin(objects,uniType);
    console.log('HARDY_2 :', normalized);  
    
    // in fact only one object is refreshed so
    const itemId = normalized.loaded[0];
    const newItemDatas = normalized.entities.objects[itemId];
    const typeName = newItemDatas.typeName;
    console.log('NORMAL_YE :', normalized, newItemDatas, typeName);
    if(typeName == "composite") {
      
      const firstComponentId = newItemDatas.components[0];
      const firstComponent = store.getState()?.objects?.entities?.objects[firstComponentId];
      const uniType = firstComponent.typeName;
     
      let newByTypeNames = {};
      newByTypeNames[uniType] = [itemId];
      normalized.objectsByTypeNames = newByTypeNames;
      normalized.entities.objects[itemId].uniType = uniType;

      // update components rDependencies
      console.log("JE_SURVEIL:", newItemDatas)
      newItemDatas?.components.map((v,i) => {
       store.dispatch(updateRDependencies ([v],[],itemId,'groups'));
       store.dispatch(updateGroupTraits (itemId,newItemDatas?.traits));
       store.dispatch(updateGroupComponentTypes (itemId,newItemDatas?.componentTypes));
      });

    }
    console.log('NORMALIZED_PUSH_REFRESH_TO_STORE :', normalized.entities.objects[id]);
    store.dispatch({type:ActionsTypes.OBJECT_UPDATE,payload:{'id':id,'value':normalized.entities.objects[id]}});
    
    return resource
  }

  /**
   * @param {*} id 
   * @param {*} store 
   */
  export async function refreshObjectOnServerResponse(id,resource,store) {

    const uniType = resource?.typeName
    console.log('UNI_TYPE :', uniType);
    
    const objects = [resource]//[response.res.data.resource];  
    console.log('SESAME_OBJECT :', objects);  
    let normalized = Normalise.normaliseObjectsDurin(objects,uniType);
    console.log('SESAME_REFRESH :', normalized);  
    
    // in fact only one object is refreshed so
    const itemId = normalized.loaded[0];
    const newItemDatas = normalized.entities.objects[itemId];
    const typeName = newItemDatas.typeName;
    console.log('NORMAL_YE :', normalized, newItemDatas, typeName);
    console.log('NORMALIZED_PUSH_REFRESH_TO_STORE :', normalized.entities.objects[id]);
    store.dispatch({type:ActionsTypes.OBJECT_UPDATE,payload:{'id':id,'value':normalized.entities.objects[id]}});
    
    return resource
  }
