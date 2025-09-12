import * as ActionsTypes from './objectTypes';
import {Normalise} from '../helpers/normalise';

export const objectsFill = objects => ({
    type: ActionsTypes.OBJECTS_FILL,
    objects
  })

export function objectUpdateProperty(objectId,property,value){
  
  return {
    type :  ActionsTypes.OBJECT_UPDATE_PROPERTY,
    payload:{'objectId':objectId,'property':property,'value':value}
  };
}

export function objectDelete(objectId) {
  return {
    type: ActionsTypes.OBJECT_DELETE,
    payload:{'objectId':objectId}
  }
}

export function objectUpdate(data){
  
  return {
    type: ActionsTypes.OBJECT_UPDATE_PROPERTY,
    payload:data
  };
}
/**
 * 
 * @param {*} objectId 
 * @param {*} statusName 
 * @param {*} value 
 */
export function objectUpdateFromWebsocket(objectEventId,statusName,value) {
  return {
    type :  ActionsTypes.OBJECT_UPDATE_FROM_WEBSOCKET,
    payload:{'objectEventId':objectEventId,'statusName':statusName,'value':value}
  }
}
export function objectUpdatePropertyFromWebsocket(objectEventId,propertyName,value) {
  return {
    type :  ActionsTypes.OBJECT_UPDATE_PROPERTY_FROM_WEBSOCKET,
    payload:{'objectEventId':objectEventId,'propertyName':propertyName,'value':value}
  }
}
/**
 * 
 * @param {*} objectId 
 * @param {*} actionName 
 * @param {*} params optional
 */
export function executeAction(objectId,actionName,params) {
  
  return {
    type : ActionsTypes.OBJECT_EXECUTE_ACTION,
    payload:{'objectId':objectId,'actionName':actionName,'params':params}
  }
}
/**
 * 
 * @param {*} id 
 * @param {*} resource 
 */
export function groupUpdate(id,resource) {
 
  console.log('HERE_GROUP_UPDATE',id,resource);
  const objects = [{'resource':resource}]
  let normalized = Normalise.normaliseObjectsDurin(objects);
  
  return {
    type:ActionsTypes.GROUP_UPDATE,
    payload:{'objectId':id,'datas':normalized}
  }
  
  const params = { actions:[{name:'MODIFY',mArgs:[{"name":"objects","value":objectIds}]}]}
}
/**
 * 
 * @param {*} objectId 
 * @param {*} statusName 
 * @param {*} value 
 */
export function updateStatus(objectId,statusName,value) {

  let updateValue = {}
  updateValue[statusName] = value;
  return {
    type : ActionsTypes.OBJECT_UPDATE_STATUSES,
    payload:{'objectId':objectId,value:updateValue}
  }
}

/**
 * updateStatuses update value is an object with multiple key/value
 * @param {*} objectId 
 * @param {Object} updateValue 
 * @param {string} updateValue.name 
 * @param {*} updateValue.value 
 */
 export function updateStatuses(objectId,updateValue) {

  return {
    type : ActionsTypes.OBJECT_UPDATE_STATUSES,
    payload:{'objectId':objectId,value:updateValue}
  }
}

/**
 * updateStatuses update value is an object with multiple key/value
 * @param {*} objectId 
 * @param {Object} updateValue 
 * @param {string} updateValue.name 
 * @param {*} updateValue.value 
 */
 export function updateMeStatus(objectId,statusName,value) {
  let updateValue = {}
  updateValue[statusName] = value;
  return {
    type : "UPDATEME",
    payload:{'objectId':objectId,value:updateValue}
  }
}









/**
 * 
 * @param {*} objectId 
 * @param {*} parameterName 
 * @param {*} value 
 */
export function updateParameter(objectId,parameterName,value) {

  
  return {
    type : ActionsTypes.OBJECT_UPDATE_PARAMETER,
    payload:{'objectId':objectId,'parameterName':parameterName,'value':value}
  }
}

/**
 * 
 * @param {*} objectId 
 * @param {*} parameterName 
 * @param {*} value 
 */
// export function updateEcoConfortParameter(objectId,parameterName,value, parameters) {

  
//   return {
//     type : ActionsTypes.ECO_CONFORT_UPDATE_PARAMETER,
//     payload:{'objectId':objectId,'parameterName':parameterName,'value':value, "parameters":parameters}
//   }
// }

// /**
//  * 
//  * @param {*} objectId 
//  * @param {*} parameterName 
//  * @param {*} value 
//  */
export function updateEcoConfortParameter(objectId, parameters) {

  
  return {
    type : ActionsTypes.ECO_CONFORT_UPDATE_PARAMETER,
    payload:{'objectId':objectId,"parameters":parameters}
  }
}




export function updateScenarioNotification(id,active,title,text) {
  return {
    type : ActionsTypes.SCENARIO_NOTIFICATION_UPDATE,
    payload : {'scenarioId':id,'activated':active,'title':title,'text':text}
  }
}

/**
 * 
 * @param {*} objectId 
 * @param {*} flags 
 * 
 */
export function updateFlags(objectId,flags) {

  
  return {
    type : ActionsTypes.OBJECT_UPDATE_FLAGS,
    payload:{'objectId':objectId,value:flags}
  }
}

export function setScheduleDatas(objectId,week) {
  
  return {
    type : ActionsTypes.OBJECT_SET_SCHEDULE_DATAS,
    payload:{'objectId':objectId,value:week}
  }  
}

export function setScheduleHeaterActive(objectId,status) {
  return {
    type : ActionsTypes.OBJECT_SET_SCHEDULE_ACTIVE,
    payload:{'objectId':objectId,value:status}
  }  
}



export function setTaskDeactivatedFlag(itemId,taskIds,flagValue) {
 
  return {
    type:ActionsTypes.HEATER_PROGRAM_DEACTIVATE,
    payload:{'itemId':itemId,'taskIds':taskIds,'flagValue':flagValue}
  }
}


export function heaterSetIsActivated(objectId,value){
  
  return {
    type:ActionsTypes.RUNTIME_DATAS,
    payload:{'itemId':objectId,'key':'programActivated','value':value}
  }


}


/**
 * 
 * @param {*} added An array of object id
 * @param {*} removed An array of object id
 * @param {*} dependencyId 
 * @param {*} dependencyType 
 */
export function updateRDependencies (added,removed,dependencyId,dependencyType) {
  return {
    type:ActionsTypes.OBJECT_UPDATE_RDEPENDENCY,
    payload:{'added':added,'removed':removed,'dependencyId':dependencyId,'dependencyType':dependencyType}
  }
}
// Harold
export function updateRDependenciesHarold (groupId,components) {
  return {
    type:ActionsTypes.GROUP_UPDATE_COMPONENTS,
    payload:{'groupId':groupId,'components':components}
  }
}

export function updateRDependenciesObjectHarold (objectId,dependencies) {
  const groupDependencies = dependencies.reduce((r,v,i)=>{
    r.push({uri:'url/'+v.toString()});
    return r;
  },[])
  return {
    type:ActionsTypes.OBJECT_UPDATE_RDEPENDENCIES,
    payload:{'objectId':objectId,'groupDependencies':groupDependencies}
  }
}

export function updateGroupComponentTypes (groupId,componentTypes) {
  return {
    type:ActionsTypes.GROUP_UPDATE_COMPONENT_TYPES,
    payload:{'groupId':groupId,'componentTypes':componentTypes}
  }
}

export function updateGroupTraits (groupId,traits) {
  return {
    type:ActionsTypes.GROUP_UPDATE_COMPONENT_TYPES,
    payload:{'groupId':groupId,'traits':traits}
  }
}

// export function updateScenarioTaskDependencies (scenarioId,traits) {
//   return {
//     type:ActionsTypes.GROUP_UPDATE_COMPONENT_TYPES,
//     payload:{'groupId':groupId,'traits':traits}
//   }
// }


export function updateGroupStatus (arr) {
  return {
    type:ActionsTypes.GROUP_UPDATE_STATUS,
    payload:arr
  }
}

export function updateRuntimeDatas (itemId,key,value) {
  return {
    type:ActionsTypes.RUNTIME_DATAS,
    payload:{'itemId':itemId,'key':key,'value':value}
  }
}

export function updateDefaultImage (itemId,value) {
  return {
    type:ActionsTypes.RUNTIME_DATAS,
    payload:{'itemId':itemId,'key':'snap','value':value}
  }
} 

export function pairingRemove (itemId) {
  return {
    type:ActionsTypes.PAIRING_REMOVE,
    payload:{'itemId':itemId}
  }
}


export function maintenanceAdd(objectId) {
  return {
    type: ActionsTypes.MAINTENANCE_ADD,
    payload:{'objectId':objectId}
  }
}

export function maintenanceRemove(objectId) {
  return {
    type: ActionsTypes.MAINTENANCE_REMOVE,
    payload:{'objectId':objectId}
  }
}


export const addGateway = (id) => {
  return ({
      type:ActionsTypes.GATEWAY_ADD,
      payload:{'id':id}
  })
}

export const addSchedulerTask = (id) => {
  return ({
      type:ActionsTypes.ADD_SCHEDULER_TASK,
      payload:{'id':id}
  })
}

export function updateWeeklyPlannerDaysOfWeek(objectId,daysOfWeek) {
  
  return {
    type : ActionsTypes.WEEKLYPLANNER_UPDATE_DAYSOFWEEK,
    payload:{'objectId':objectId,value:daysOfWeek}
  }  
}