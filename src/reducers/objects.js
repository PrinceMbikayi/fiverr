  

import * as ActionsTypes from '../actions/objectTypes'; 
import dotProp from 'dot-prop-immutable';
import { getObjectById } from '_helpers/objects';


const objectInitialState = {
  loaded:[],
  reload:false,
  entities:{},
  objectsByEventsName:{},
  objectsByTypes:{},
  objectsByNames:{},
  objectsByRealName:{},
  objectsByTypeNames:{},
  objectsByClassNames:{},
  objectsVisible:[],
  atHomeObjectsByDeviceId:{},
  runtimeDatas:{},
  programmation:{},
  pairing:[],
  maintenance:[],
  groupComponents :[],
  gatewaysById:{}
}


/**
 * 
 * @param {*} state 
 * @param {string} arrayPath
 * @param {*} id 
 * @return {string} path
 * 
 */
const getPathInArray = (state,arrayPath,id) => {
 
  const myIds = dotProp.get(state,arrayPath);
  const objectId = Number(id)

  const myPos = myIds?.indexOf(objectId);
  const path = (myPos != -1 && myPos != undefined)? arrayPath+'.'+myPos : null; 
 
  return path;
}


export default function objectsReducer(state = objectInitialState, action) {

  const {payload, type} = action;
  
  

  switch (type) {

    case ActionsTypes.OBJECTS_FILL : {
      //console.log("payload.objectsByRealName XXXX",payload?.objectsByRealName)
      let newObjects = payload.entities;      
       
       let mergedObjects = Object.assign({},state.entities,newObjects );
       let mergedObjectsByEventsName = Object.assign({},state.objectsByEventsName,payload.objectsByEventsName );
       let mergedObjectsByRealName = Object.assign({},state.objectsByRealName,payload.objectsByRealName );
       let mergedObjectsByTypes = Object.assign({},state.objectsByTypes,payload.objectsByTypes );
       let mergedAtHomeObjectsByDeviceId = (payload.atHomeObjectsByDeviceId != undefined) ? Object.assign({},state.atHomeObjectsByDeviceId,payload.atHomeObjectsByDeviceId ): {};
      
       let mergedObjectsVisible;
       if(payload.objectsVisible == undefined) {
        mergedObjectsVisible =  state.objectsVisible;
       } else {
        mergedObjectsVisible = [...new Set([...state.objectsVisible,...payload.objectsVisible])];       
       }

       let mergedGatewaysById = (payload.gatewaysById != undefined) ? Object.assign({},state.gatewaysById,payload.gatewaysById ): {...state.gatewaysById};
      

       //return state;
        return {
            ...state, 
            entities:mergedObjects,          
            loaded:payload.loaded,
            objectsByEventsName:mergedObjectsByEventsName,
            objectsByTypes:mergedObjectsByTypes,
            objectsByNames:payload.objectsByNames,
            objectsByRealName:mergedObjectsByRealName,
            objectsByClassNames:payload.objectsByClassNames,
            objectsByTypeNames:payload.objectsByTypeNames,
            objectsVisible:mergedObjectsVisible,
            atHomeObjectsByDeviceId:mergedAtHomeObjectsByDeviceId,
            gatewaysById:mergedGatewaysById
        }
       
    }

    case ActionsTypes.OBJECTS_RELOAD : {
      state = dotProp.set(state,'reload',payload.status)
        return state
    }

    break;


    case ActionsTypes.OBJECT_ADD : {

      
      const { 
              loaded,entities,
              objectsByEventsName,objectsByNames,objectsByRealName,
              objectsByTypes,objectsByTypeNames,
              objectsVisible,atHomeObjectsByDeviceId
            
            } = payload
      
      // Test if single add Object already in state
      if(loaded.length == 1) {
        const objectId = loaded[0];
        const isLoaded = dotProp.get(state,'loaded');
        if(isLoaded.indexOf(objectId) !=-1) {
          //console.log(objectId + ' is already here !!!!!')
          return state;  
        }
      }

      //return state

      //console.log("Add Object in Reducer",payload)

      // first append object      
      state = dotProp.merge(state,'entities.objects',entities.objects);
      
      // then add in objectsByEventsName
      state = dotProp.merge(state,'objectsByEventsName',objectsByEventsName);

       // then add in objectsByRealName
       state = dotProp.merge(state,'objectsByRealName',objectsByRealName);


      // then add id in loaded
      state = dotProp.merge(state,'loaded',loaded)

       // then add in byType
       for (let [key, value] of Object.entries(objectsByTypes)) {
        state = dotProp.merge(state,'objectsByTypes.'+key,value)
       }
       // By TypesName
       
       for (let [key, value] of Object.entries(objectsByTypeNames)) {
        state = dotProp.merge(state,'objectsByTypeNames.'+key,value)
       }

       //then byNames
       state = dotProp.merge(state,'objectsByNames',objectsByNames)

       //then byDeviceId
       state = dotProp.merge(state,'atHomeObjectsByDeviceId',atHomeObjectsByDeviceId)

       //in Visibles
       if(payload.objectsVisible != undefined) {
        state = dotProp.merge(state,'objectsVisible',objectsVisible)
       }
       
      return state;

    }

    case ActionsTypes.OBJECT_UPDATE_PROPERTY : {
      const {objectId,property,value,append} = payload;      
      const path = getObjectPath(objectId)+'.'+property
      if(append) {
        state=dotProp.merge(state, path, value)
      } else {
        state = dotProp.set(state, path, value);   
      }
      console.log("ENNNNN FINNNNNN  PASSED INSINDE 111")
      
      return state;
      break;
    }
    case ActionsTypes.OBJECT_UPDATE: {
      //console.log("REDUCER SAY ",payload)  
      const objectId = Number(payload.id);       
      let path = 'entities.objects.'+payload.id;   

      // GROUP uniType
      let newValues = payload.value;
     
      if(newValues.typeName == "composite") {
        if(newValues.components && newValues.components.length > 0) {
          //console.log("newValues.components[0]",newValues.components[0])
          const firstComponentId = newValues.components[0];/*.uri.split("/").pop();*/
          const firstComponent = dotProp.get(state,"entities.objects."+firstComponentId);
          const uniType = firstComponent.typeName;
          newValues.uniType = uniType;  
          newValues.img = firstComponent.img;
          const opath = 'objectsByTypeNames.'+uniType;
          const byTypeNamesPath = 'objectsByTypeNames.'+uniType;
          const alreadyHere = dotProp.get(state,byTypeNamesPath);
          if(alreadyHere.indexOf(objectId) == -1 ) state = dotProp.merge(state,byTypeNamesPath,[objectId]);           
        } 
      }


      // if(newValues.typeName == "Associations"){
      //   console.log("INSIDE_REDUX_SCENARIO :", objectId, " : ", newValues)
      // }
     
       //in Visibles
       if(payload.objectsVisible != undefined) {
        state = dotProp.merge(state,'objectsVisible',payload.objectsVisible)
       }

       state = dotProp.set(state, path, newValues);
      return state;
      
      break;

    }

    // case SCENARIO_UPDATE: {

    //   const scenarioName = payload.name;
    //   const scenarioId = payload.id;
    //   scenarioScripts = payload.scriptActions;

    //   let path = 'entities.objects.'+scenarioId;
    //   console.log('SCENE_UPDATE_NAME :',payload.name);
    //   console.log('SCENE_UPDATE_ID :', payload.name,payload.id);
    //   console.log("SCENE_UPDATE SCRIPTS :",state.rooms)

    //   const entities =  state.entities;
    //   const entity = state.entities[payload.id]

    //   return {
    //     ...state,
    //     entities: {
    //       ...entities,
    //       [payload.id]:{
    //         ...entity,
    //         ...payload
    //       } 
    //     }
    //   }
    // }

    //--------- use OBJECT_UPDATE_PROPERTY payload.prpperty = name 
    case ActionsTypes.OBJECT_RENAME: {

      let path = 'entities.'+payload.id+'.name';    
      return dotProp.set(state, path, payload.name);
      break;
     }
  //---------------------
    case ActionsTypes.OBJECT_DELETE : {

      //return state;
      const {objectId} = payload;     
      const loadedPath = 'loaded';     
      const objectPath = getObjectPath(objectId);

      // in loaded
      const loaded = dotProp.get(state,'loaded');      
      const loadedPos = loaded.indexOf(objectId);     
      if(loadedPos != -1) {
        toDeleteWithPos = 'loaded.'+loadedPos;
        state = dotProp.delete(state,toDeleteWithPos)
      }

      // in entities
      const entityExist = dotProp.get(state,objectPath)
     
      //console.log("entity exists ("+objectPath+")",{...entityExist})

      if(entityExist != undefined) {
       
        const currentEntity = {...entityExist}
        const eventIdPath = 'objectsByEventsName.'+currentEntity.eventId;
       
        // delete if in atHomeObjectsByDeviceId
      
        
        if(eventIdPath.indexOf("event/io/athome/") != -1) {
           const delLastChar = (eventIdPath.slice(-1) == "/");
            state = dotProp.delete(state,eventIdPath);
           const cleanEventId = entityExist.eventId.slice(0,( entityExist.eventId.length-delLastChar))
           const deviceId = cleanEventId.split("/").pop();
           // remove from atHomeObjectsByDeviceId !! 
           //!Attention
            //console.log("entityExist.eventId",entityExist.eventId);  
            const deviceIdPath = "atHomeObjectsByDeviceId."+deviceId;
            state = dotProp.delete(state,deviceIdPath);
        }
        

        // checked
        const namePath = 'objectsByNames.'+currentEntity.name;
        state = dotProp.delete(state,namePath);

        // delete objectsByRealName
        const realNamePath = 'objectsByRealName.'+currentEntity.realName;
        state = dotProp.delete(state,realNamePath);

        //--- delete if in types
        const itsType = currentEntity.className;
      
        const del_in_types = getPathInArray(state,'objectsByTypes.'+itsType,objectId);
        if(del_in_types)state = dotProp.delete(state,del_in_types)
       

        //--- delete if in className
        const itsClassName = currentEntity.className;
        const del_in_classnames = getPathInArray(state,'objectsByClassNames.'+itsClassName,objectId);
        if(del_in_classnames)state = dotProp.delete(state,del_in_classnames)
       

        //--delete if in typesNames
        const itsTypeName = currentEntity.uniType || currentEntity.typeName;
        const del_in_typeName = getPathInArray(state,'objectsByTypeNames.'+itsTypeName,objectId);
        if(del_in_typeName)state = dotProp.delete(state,del_in_typeName)
        
        //delete if in objectsVisible; 
        const del_in_visibles = getPathInArray(state,'objectsVisible',objectId);
        if(del_in_visibles)state = dotProp.delete(state,del_in_visibles)
       
        //-- finally delete it in entities
        state = dotProp.delete(state, objectPath);

        //console.log("finished !!!!",currentEntity)
      }
      return state;
    }

    case ActionsTypes.GROUP_UPDATE: {
      const objectId = payload.objectId;
      const objectDatas = payload.datas;
    
      
      // get first component
      if(objectDatas.components && objectDatas.components.length > 0) {
        const firstComponentId = objectDatas.components[0].uri.split("/").pop();
        const uniType = state.entities.objects[firstComponentId].typeName;
        //apply uniType to Group       
        state = dotProp.set(state, "entities.objects."+objectId, uniType);
        // in typesNames
        state = dotProp.merge(state,'objectsByTypeNames.'+uniType,objectId);

      }
      
      return state;
      break;
    }
     
    case 'DEBOUNCED_UPDATE':
    case ActionsTypes.OBJECT_UPDATE_STATUSES: {

      /*     
        MIDDLEWARE AVOID SINGLE STATUS UPDATE, it intercepts ActionsTypes.OBJECT_UPDATE_FROM_WEBSOCKET
        buffer updates then dispatch an action of type 'DEBOUNCED_UPDATE' and a payload with multiple status in payload
       
        except for ice status (VDP) it has no debounce
       
        */

      //console.log("update statuses start")
      const objectId = payload.objectId;
      const objectStatus = payload.statusName;
      //console.log(" REDDDDDDD: ", payload)
      if(objectId == undefined)return state;
      let objectPath = getObjectPath(objectId);     

      //les images
      let statusImages = dotProp.get(state,objectPath+'.statusImages',{}) 
      state = dotProp.merge(state,objectPath+'.statusDictionary', payload.value);
      let statusDictionary = dotProp.get(state,objectPath+'.statusDictionary',{});
      // WARNING CHECK HERE console.log("***************************** ********** >>> statusDictionary for ("+objectId+")",statusDictionary)
      
       // then create new statuses images array
       let newStatusesActiveImages = []
       for (let [key, value] of Object.entries(statusDictionary)) {
         if(statusImages[key]!= undefined) {
           let img = statusImages[key][value]
           if( img != undefined) {
             newStatusesActiveImages.push(img);
           }
         }
       }
       //console.log("newStatusesActiveImages",newStatusesActiveImages);      
      state = dotProp.set(state, objectPath+'.statusesActiveImages', newStatusesActiveImages);
      //console.log("update statuses end")
      return state; 
      break;

    }


    case ActionsTypes.OBJECT_UPDATE_PARAMETER: {
        const {objectId,parameterName,value} = payload;
        state = dotProp.set(state, getParameterPath(objectId,parameterName), value);
        return state
        break;
      }


    case ActionsTypes.ECO_CONFORT_UPDATE_PARAMETER: {
        console.log('Hello_Parameter_1');
        const {objectId,parameters} = payload;
        const paramsCurrentState = dotProp.get(state, getParameterArrayPath(objectId));
        console.log('Hello_Parameter_2:', 'currentParams :', paramsCurrentState, "newParams :", parameters);
        state = dotProp.set(state, getParameterArrayPath(objectId),parameters);
        return state;
        break;
      }
    // case ActionsTypes.ECO_CONFORT_UPDATE_PARAMETER: {
    //     console.log('Hello_Parameter_1');
    //     const {objectId,parameterName,value, parameters} = payload;
    //     console.log('Hello_Parameter_2:',objectId, parameterName, value);
    //     let path;
    //     console.log('Hello_Parameter_3:',getParameterArrayPath(objectId,parameterName, parameters));
    //     console.log('SEE_STATE :',state);
    //     const replace = {name:parameterName,value:`${value}`};
    //     state = dotProp.set(state, getParameterArrayPath(objectId,parameterName,parameters),replace);
    //     return state;
    //     break;
    //   }

    case ActionsTypes.OBJECT_UPDATE_FROM_WEBSOCKET:
    {
        // debounced inMiddle ware instead

    }
    break;
   
    case ActionsTypes.OBJECT_UPDATE_PROPERTY_FROM_WEBSOCKET : 
    {
        const {objectEventId,propertyName,value} = payload;
        const path = getObjectPathByEventName(objectEventId,state)+'.'+propertyName;       
        //console.log("OBJECT_UPDATE_PROPERTY_FROM_WEBSOCKET",objectEventId,path,propertyName,value);        
        state = dotProp.set(state,path,value)
        return state;
     
    }
    break;

    case ActionsTypes.OBJECT_UPDATE_FLAGS : {
      //console.log(ActionsTypes.OBJECT_UPDATE_FLAGS+" !!!")
        const path  = getObjectPath(payload.objectId)+'.flags';
        state = dotProp.merge(state,path,payload.value)
        return state;
      }
      break;

      case "FLAGS_DIRECTS"  : {

        //console.log("FLAGS_DIRECTS",payload);
        const ids = payload.ids || [];

        ids.map((v,i) => {
          const path  = getObjectPath(v)+'.flags'+'.'+payload.flag;
          state = dotProp.merge(state,path,payload.value);
          //console.log(path,"-----+++++")
        })
        
       
        return state;
      }
      break;


    case ActionsTypes.OBJECT_SET_SCHEDULE_DATAS : {
       
        const path = getObjectPath(payload.objectId)+'.schedule_datas';
       
        state = dotProp.set(state,path,payload.value);
        return state;
      }
      break;


    case ActionsTypes.OBJECT_UPDATE_RDEPENDENCY : {

      const {added,removed,dependencyType,dependencyId} = payload;
     
      
      if(added.length > 0) {
        added.forEach(id => {
          const dependenciesPath = getObjectPath(id)+'.rDependencies';
          const toUpdatePath = dependenciesPath+'.'+dependencyType;
          /* just add "/" because it's mandatory for uri process in other components */
          const uriAdd = {uri:"/"+dependencyId};
          let toUpdateValue;
          if(dotProp.get(state,dependenciesPath) == "undefined") {           
            toUpdateValue = [uriAdd];
          } else {
            if(dotProp.get(state,dependenciesPath+'.'+dependencyType) == undefined) {              
              toUpdateValue = [uriAdd];
            } else {
              toUpdateValue = [...dotProp.get(state,dependenciesPath+'.'+dependencyType),uriAdd];
            }
          }
          
          state = dotProp.set(state,toUpdatePath,toUpdateValue)
        });
      }

      if(removed.length > 0) {
        removed.forEach(id => {
          const dependenciesPathByType = getObjectPath(id)+'.rDependencies.'+dependencyType;
          const currentDep = dotProp.get(state,dependenciesPathByType);
          const newDep = currentDep.reduce((r,v,i) => {
            if(v.uri.indexOf("/"+dependencyId) == -1) r.push(v)
            return r
          },[])
          state = dotProp.set(state,dependenciesPathByType,newDep) // remove application from heater datas
          //console.log("dependencies done !")
          // then remove heater from application datas be careful components are just an array of ids not a {uri:http ...../id} like datas provided by the rest API
          const currComponents = dotProp.get(state,getObjectPath(dependencyId)+'.components');
          //console.log(getObjectPath(dependencyId)+'.components',"currComponents",currComponents,)
          if(currComponents != undefined) {
            const newComponents = currComponents.reduce((r,v,i)=> {
              if(v.indexOf(""+id) != -1)r.push(v);
              return r;
            },[])
            state = dotProp.set(state,getObjectPath(dependencyId)+'.components',newComponents)
          } 
        });
      }      
      return state;
      break;
    }

    case ActionsTypes.GROUP_UPDATE_COMPONENTS :{

      const { groupId, components} = payload;

      //const path = getGroupComponentsPath(groupId,state);
      state = dotProp.set(state,getObjectPath(groupId)+'.components', components)
      return state;
      break;
    }

    ///////////-- Harold Addition---------------
    case ActionsTypes.GROUP_UPDATE_COMPONENT_TYPES :{

      const { groupId, componentTypes} = payload;
      state = dotProp.set(state,getObjectPath(groupId)+'.componentTypes', componentTypes)
      return state;
      break;
    }

    case ActionsTypes.GROUP_UPDATE_TRAIS :{

      const { groupId, traits} = payload;
      state = dotProp.set(state,getObjectPath(groupId)+'.traits', traits)
      return state;
      break;
    }

    case ActionsTypes.OBJECT_UPDATE_RDEPENDENCIES :{

      const { objectId, groupDependencies} = payload;
      console.log("PAYLOAD :::: ", payload)
      state = dotProp.set(state,getObjectPath(objectId)+'.rdependencies.groups', groupDependencies)
      return state;
      break;
    }
    
    case ActionsTypes.GATEWAY_ADD :{

      const id = payload.id;
      state = dotProp.merge(state,'objectsByTypeNames.Gateway',id)
      //state = dotProp.merge(state,'entities.objects',20)
      //state = dotProp.set(state,getObjectPath(groupId)+'.traits', traits)
      // // then add in byType
      // for (let [key, value] of Object.entries(objectsByTypes)) {
      //   state = dotProp.merge(state,'objectsByTypes.'+key,value)
      // }

      // By TypesName  
      // for (let [key, value] of Object.entries(objectsByTypeNames)) {
      //   state = dotProp.merge(state,'objectsByTypeNames.Gateway',20)
      // }
      return state;
      break;
    }

    case ActionsTypes.WEEKLYPLANNER_UPDATE_DAYSOFWEEK : {
       
      const path = getObjectPath(payload.objectId)+'.daysOfWeek';
    const daysOfWeek = dotProp.get(state, path);
     console.log('WEEKLYPLANNER_UPDATE_DAYSOFWEEK',daysOfWeek);
      //state = dotProp.set(state,path,payload.value);
      return state;
    }
    break;

    ///////////-----------------------------

    case ActionsTypes.ADD_SCHEDULER_TASK :{

      const id = payload.id;
      state = dotProp.merge(state,'objectsByTypeNames.SchedulerTask',Number(id))
      return state;
      break;
    }


    case ActionsTypes.GROUP_UPDATE_STATUS : {
       
      
      payload.map((v,i) => {
        let objectPath = getObjectPath(v.id);
        let newPropVal = {};
        newPropVal[v.status] = v.value;
        state = dotProp.merge(state,objectPath+'.statusDictionary',newPropVal);     

      });   
     
      return state;
    }
    break;

    case ActionsTypes.RUNTIME_DATAS : {
       
      const id = payload.itemId;
      const key = payload.key;
      const value = payload.value;
      let runTimePath = "runtimeDatas."+id;
      let objectPath = getObjectPath(id);
      
      state = dotProp.set(state,runTimePath+"."+key,value);
      
     
      return state;
    }

    break;


    case ActionsTypes.PAIRING : {
       // console.log("Reducer > ActionsTypes.PAIRING",payload)
        const watchDatas = {name:payload?.name,id:payload?.id}
        state = dotProp.merge(state,'pairing',watchDatas)

        return state
    }
    break;
    case ActionsTypes.PAIRING_REMOVE : {
        const {itemId} = payload;
        state = dotProp.set(state,'pairing',[]);
        return state;
    }
    break;

    case "DEV_DELETE_ACTION" : {
       
      const id=payload.id;
      const actionName = payload.actionName;
      let objectPath = getObjectPath(id);
      const actions = dotProp.get(state,objectPath+'.actions');

      const index = actions.reduce((r,v,i) => {
        if(v.name == actionName) {
          r = i;
         // console.log("found",v.name,i)
        } 
        return r;
      },-1);
      //console.log("objectPath",objectPath,index)
      state = dotProp.delete(state,objectPath+".actions."+index);
     
      /*
        {
          type:'DEV_DELETE_ACTION',
          payload: { id: 699502, actionName:"TEMP"}
        }


      */
     
      return state;
    }
    case "DEV_DISGUISE_ACTION" : {
       
      const id=payload.id;
      const disguiseType = payload.disguiseType;
      let runTimePath = "runtimeDatas."+id;
      let objectPath = getObjectPath(id);
      
      state = dotProp.set(state,runTimePath+".disguiseType",disguiseType);
      state = dotProp.set(state,objectPath+".forceRefresh",disguiseType);
     
      /*
        {
          type:'DEV_DISGUISE_ACTION',
          payload: { id: 709144, disguiseType:"AtHomeHeater"}
        }


      */
     
      return state;
    }

    break;

    case ActionsTypes.MAINTENANCE_ADD : {
        const {objectId} = payload; 
        const inMaintenance = dotProp.get(state,'maintenance');
        if(inMaintenance.indexOf(objectId) !=-1) {
        //  console.log(objectId + ' is already here !!!!!')
          return state;  
        }
      
      // then add id in maintenance
     
      state = dotProp.merge(state,'maintenance',[objectId])
      return state
    }
    break;

  case ActionsTypes.MAINTENANCE_REMOVE : {
    const {objectId} = payload; 
    const inMaintenance = dotProp.get(state,'maintenance');     
    const pos = inMaintenance.indexOf(objectId); 
    //console.log(" ActionsTypes.MAINTENANCE_REMOVE",pos)    
    if(pos != -1) {
      toDeleteWithPos = 'maintenance.'+pos;
      state = dotProp.delete(state,toDeleteWithPos)
    }

      return state
  }
  break;






    case "APP_CLEAN_VISIBLE" : {
      // state = dotProp.set(state,runTimePath+".disguiseType",disguiseType);
      //state = dotProp.delete(state,objectPath+".actions."+index);
      state = dotProp.set(state,'objectsVisible',[])
      return state;



    }
    break;
    default:
      return state
  }

}

 // tools
// ANCHOR Tools

  const getObjectPath  = (objectId) => {
    return 'entities.objects.'+objectId;
  }
  const getGroupComponentsPath  = (groupId, state) => {
    //return 'entities.objects.'+objectId;
    return getObjectPath(state.entities.objects[groupId].objectDatas.components);
  }

  const getParameterPath = (objectId,parameterName) => {
    return getObjectPath(objectId)+'.parameters.'+parameterName;     
    
  }



  /**
   * Return stored object
   * @param {*} objectId 
   */
  const getObject = (objectId,state) => {
    return state.entities.objects[objectId]
  }

  const getObjectPathByEventName = (eventName,state) => {
    return getObjectPath(state.objectsByEventsName[eventName]); 
   
  }

  // const getParameterArrayPath = (objectId,parameterName, parameters) => {
  //   // const parameters = getObjectById(objectId).parameters;
  //   console.log('Hello_Parameter_0:',parameters);
  //   let path;
  //   parameters.map((item,idx)=>{
  //     if(item.name == parameterName) {
  //       path =  getObjectPath(objectId)+'.parameters.'+idx //+'.value'//+parameterName;
  //       //getObjectPath(objectId)+'.parameters.'+parameterName; 
  //     }
  //   })
  //   return path
  // }

  const getParameterArrayPath = (objectId) => {

    return getObjectPath(objectId)+'.parameters'
  }

