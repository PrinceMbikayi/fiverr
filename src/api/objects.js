import store from '../store';
import {Normalise} from '../helpers/normalise';
//import * as Normalise from '../helpers/normalise';
import * as ActionsTypes from '../actions/objectTypes';
import {AppConfig} from '../config';
import * as Durin from './durin';
import {addObjectAction} from '../actions/asyncActions';
import {objectPairingInfos} from '../config/products/core';
import {dataGetAtHomeGateway} from '_helpers/dataTools';
import { getServer as getStoredServer } from '_services/storage';
import {getObjectUriById} from '_brand/utils/tools';
import {getObjectById} from '_helpers/objects';
import { useSelector, useDispatch } from 'react-redux';
import { refreshObjectAction } from '_actions/asyncActions';

// import {appendUnconnectedMotor} from '_components/objects/boardgate/notConnected';
//import devObjects from './devObjects.json'
import devObjects from '_brand/bouchon.json'

//Harold important for retrieving user favorite objects list from local storage 
import AsyncStorage from '@react-native-community/async-storage';
import {
  USER_ADD_FAVORITE,

} from '../actions/user'

import {getPreferences, setUserDefinedPreferences} from '_api/user'
import {userSetPref} from '_actions/user';
import {getObjectsByTypeName} from '_helpers/selectors';
//----Harold end import
import * as axios from 'axios';





// const weathers = useSelector(state =>getObjectsByTypeName(state,"WeatherSupport")); 
const getServerUrl = async () => {

  const serverUrl = await getStoredServer() || AppConfig.SERVER_URL
  return serverUrl;

}
/**************************************
 * 
 *  A réécrire en prenant la methode deleteObject comme exemple
 *  Ou ./groups.js
 * 
 * 
 **************************************/


const paramsToString = params => Object.entries(params).reduce((acc, [key, value], index, array) => `${acc}${key}=${encodeURIComponent(value)}${index !== (array.length - 1) ? '&' : ''}`, "");
const durinUrl = AppConfig.SERVER_URL+'/services/durin/';

/**
 * 
 * @param {*} objectId 
 * @param {*} params object like {property_1:newValue_1,property_2:nexValue_2}
 */
async function updateObject(objectId,params) {

  res = await Durin.update("object",objectId,params);
  return res;  
}
/**
 * 
 * @param {*} objectId 
 * @param {*} params object like {"room":{ "uri": "https://donkey.athemium.com/services/durin/my/rooms/"+id }}
 */
async function updateObjectRoom(objectId, roomId, defaultUri="https://profalux.avidsen.one") {

  //const serverUrl = await getServerUrl();


  const objectContent = getObjectById(objectId)
  console.log('M1 :', objectContent);

  const objectUri = objectContent?.uri || defaultUri
  console.log('M2 :', objectUri); // WHY OBJECT URI NO LONGER HERE
  const objectUriSplit = objectUri.split("/services/")
  console.log('M3 : ', objectUriSplit);
  const serverUrl = objectUriSplit.shift()
  
  console.log('M4 : ',serverUrl);
  const roomUri =  serverUrl+"/services/durin/my/rooms/"+roomId;
  
  console.log('M5 :', roomUri);
  //console.log('ROOM_ID_URI :',roomId, roomUri);
  const params = {"room":{ "uri": roomUri}};
  res = await Durin.update("object",objectId,params);
  console.log('Response_Room_Update :', res);
  return res;  
}

/**
 * update the array of actionScripts
 * 
 * @param {*} id 
 * @param {*} params an object
 * 
 * @example
 * 
 * [{"type": "call", "objectId": "393793", "action": "ON"},{"type": "notify", "severity": "WARNING", "title": "notification titre", "text": "corps notification"}]
 * 
 */
async function updateScenario (id,params) {
  return await updateObject(id,params)
}

/**
 * 
 * @param {Number} objectId 
 * @param {String} newName 
 */
async function renameObject(id,newName) {
 
  res = await Durin.update("object",id,{name:newName})
  return res;
}


async function updateObjectFlags(id,updatedFlags) {
  //console.log("updateObjectFlags",id,updatedFlags)
  res = await Durin.update("object",id,{'flags':updatedFlags}).catch((err) => (err));
  return res;

}

async function updateApplication(id) {
  //console.log("updateApplication",id)
  res = await Durin.update("object",id,'').catch((err) => (err));
  return res;

}

async function sendServerParameters(objectId, parameters) {
  return setParameters(objectId, parameters)
}

//------------------------------------------------------------------------

async function getGateways () {
 
  let response = await Durin.get('gateway',null);  
 
  const reduceMe = response?.res?.data?.content || []
  const result = reduceMe.reduce((r,v,i) => {
    r[v?.resource?.id] = v?.resource?.realName;
    return r
  },{})
  return result
}




async function getObjects () {
        

    //Harold Begin additional code
    const value = JSON.parse(await AsyncStorage.getItem("@userFav"))
    console.log("Value Data OOOOOOO :", value);
    if(value !== null) {
      store.dispatch({type:USER_ADD_FAVORITE,payload: {'id':value} })
    }else{
      store.dispatch({type:USER_ADD_FAVORITE,payload:{'id':[]} })
    }

    const ret = await getPreferences().catch((err)=> console.log(err));
    const defaultWeather = ret?.User?.defaultWeather
    console.log("RET_USER :", defaultWeather)
    if(defaultWeather && defaultWeather != null){
      const prefAction  = userSetPref("defaultWeather", defaultWeather)
      store.dispatch(prefAction)
    }
    //Harold End additional code

  /* be careful Durin.get return {errCode:XXX,res:{}} */
  store.dispatch({type:ActionsTypes.OBJECTS_RELOAD,payload:{ 'status':true}})
  //let response = await Durin.get('object',null,'all') 


  /********** multiGateways ****************************/
  const gatewaysMap = await getGateways();
  console.log("gatewaysMap",JSON.stringify(gatewaysMap))


  let response = await Durin.get('object',null,'all') 
  //console.log("getObjects",response)
  if(response.errCode != 200) {
    return {'errCode':response.errCode};
  }

  let objects = [];
    // should be const when no object is manually add for dev purpose
    let myData = response.res.data.content;  
    const devMode = process?.env?.NODE_ENV == "development";


  console.log("testoune devMode",devMode)

   // if(devMode) myData.push(...devObjects)
   
   //myData.push(...devObjects)

  //console.log("AAAAAAAAA",JSON.stringify(myData))

  // ============== UnconnectedMotor ======================

  //const unconnectedMotors = await appendUnconnectedMotor().catch((err) => {console.log("appendUnconnectedMotor",err)});
  //myData.push(...unconnectedMotors);



    // myData = {...devObjects}
     //myData = {}
      for(let object in myData){         
        objects.push({...myData[object].resource,'uri':myData[object].uri});
      }
      //console.log("objects",objects)
      let normalized = Normalise.normaliseObjectsDurin(objects,null,true,gatewaysMap);

      console.log("DURIN Dispatch this normalized",normalized);
      store.dispatch({type:ActionsTypes.OBJECTS_FILL,payload:{ 'entities':normalized.entities,
                                                'loaded':normalized.loaded,
                                                'objectsByEventsName':normalized.objectsByEventsName,
                                                'objectsByTypes':normalized.objectsByTypes,
                                                'objectsByNames':normalized.objectsByNames,
                                                'objectsByRealName':normalized.objectsByRealName,
                                                'objectsByTypeNames':normalized.objectsByTypeNames,
                                                'objectsByClassNames':normalized.objectsByClassNames,
                                                'objectsVisible':normalized.objectsVisible,
                                                'atHomeObjectsByDeviceId':normalized.atHomeObjectsByDeviceId,
                                                'gatewaysById':gatewaysMap

                                            }
                                      });
        store.dispatch({type:ActionsTypes.OBJECTS_RELOAD,payload:{ 'status':false}})
        store.dispatch({type:"APP_REFRESH_NEEDED",payload:false})
        //the promise result
        return {'errCode':response.errCode};
}



async function getObject (id) {
  return await Durin.get('object',id)
  
}

/**
 * 
 * @param {*} id 
 * 
 */
async function getUses (itemId){
  return await Durin.search('byUses',itemId);
}
/**
 * 
 * @param {any} id  can be a string like TaskHeater-XXXX
 */
async function getByName (id){
  return await Durin.search('byName',id);
}



/**
 * 
 * @param {*} objectId 
 */
async function deleteObject(objectId,type) {
  //const type = "object";
  const id = objectId;
    
  return Durin.remove(type||'object',id)
}

/**
 * 
 * @param {array} objectIds i.e. [123,456,789]
 */
async function deleteObjects(objectsIds) {

  const arrayOfIds = objectsIds.reduce((r,v,i) => {
        r.push({'id':v});
        return r;
  },[]) 
    
  return Durin.removeMultiple(arrayOfIds)
}

/*
  the AtHomeGateway (gateway) is the unique by user Gateway created by the Broker
*/

// addObject - ajout objet
// createObject - create object - creation objet
// pairing object

async function createObject(params) {
  const resp = await Durin.add("object",params).catch((err)=> {console.log(err)});
  return resp;
}


async function pairingObject(id,infos,name) {

  /*
  console.log("pairingObject");
  console.log("id",id);
  console.log("infos",infos);
  console.log("name",name);
  console.log("objectPairingInfos",objectPairingInfos);
  */
  let objTypeInfos = objectPairingInfos[infos.atHomeType];

  //console.log("objTypeInfos",objTypeInfos)

  if(objTypeInfos == undefined) {

    objTypeInfos = Object.keys(objectPairingInfos).reduce((r,keyName,i) => {

      if(objectPairingInfos[keyName].productName == undefined)return r;

      if(objectPairingInfos[keyName].productName == infos.atHomeType && objectPairingInfos[keyName].subtypeNumber == infos.numericSubtype) {
        r = objectPairingInfos[keyName]
      }
      
      return r;

    },{})

  }
  
  //console.log("objTypeInfos complete",objTypeInfos);
  //console.log("objTypeInfos",objTypeInfos)
  const gatewayName = dataGetAtHomeGateway(store.getState());
  //console.log("----> gatewayName",gatewayName)

  const params = {
                  'gw':{'name' : gatewayName},
                  'name' : name,
                  'realName' : {
                      'id':id,
                      'type' : objTypeInfos.type,
                      'subtype' : objTypeInfos.subtype
                  },
                  'typeName':'io/athome'

                }

  //console.log("pairingObject params ---------->",params)

  const addRequest = await Durin.add('object',params);
  //console.log("addRequest",addRequest)

  return addRequest;

}

/**
 * 
 * @param {*} id The id of the group
 * 
 */


async function getWeatherCodes(countryID) {
  res = await Api.getStaticFile("weather/weather_codes_"+countryID);
  //console.log(res)
}




async function createWeatherObject(name,id) {

  const params = {     
    gw: {
      name: "System"
    },
    typeName: "WeatherSupport",
    realName: 'id-'+id,
    name: name
  }
  //console.log("createWeatherObject",params)
  return Durin.add('object',params)
}



/**
 * 
 * @param {string} name 
 * @param {string} id 
 * @returns 
 */
async function createQrCodeVDP(name,id) {
  // realName = type+"/"+subtype
  const params = {     
   
    typeName: "VDoorBell",
    realName: 'access/vdp/'+id,
    name: name
  }

  /*
   gw: {
      name: "System"
    },

  */
  return Durin.add('object',params)
}




async function getApps() {
  const apps = await Durin.apps();
 
  return apps;

}


/**
 * 
 * @param {String} name 
 * @param {string|number} probeId 
 * @param {string|number} controlId (if equal false, the probe has no setPoint status and this param must ne ignored)
 * @param {array} heaterIds an array of strings
 * @param {string|number} delay 
 */
 async function createThermostatApplication(name,probeId,controlId,heaterIds,delay) {
  const appTypeName = "Régulation_de_température"
  const appsAvailable = await getApps();
  //console.log("appsAvailable",appsAvailable);
  if(appsAvailable.errCode == 200) {
      const thermostatAppDefinition = appsAvailable.data.reduce((r,v,i) => {
        if(v.resource.name == appTypeName) {
          r = v.resource;
        }
        return r;
      },{});


      const appVersion = thermostatAppDefinition.version;

      let appParameters = [
        {'name':'probe_id',value:""+probeId},       
        {'name': 'delay',value:""+delay},
        {'name': 'heater_ids',value:heaterIds}
      ]
      if(controlId != false) {
        appParameters.push({'name':'control_id',value:""+probeId});
      }

      const params = {     
        gw: {
          name: "System"
        },       
        'typeName': "application",
        'name' : name,
        'realName' : name,
        'appName': appTypeName,
        'appVersion' : appVersion,
        'parameters' : appParameters
        }

        //console.log("params",params)
        return Durin.add('object',params)
   } else {
    return appsAvailable;
  }
}
//=========================================================
/**
 * 
 * @param {Object} params 
 * @param {string} [params.name]
 * @param {string|number} [params.probeId]
 * @param {array} [params.heaterIds]  an array of strings
 * @param {string|number} delay 
 */
 async function createDonkeyThermostatApplication(params) {
  const {name} = params
  const appTypeName = "Thermostat"
  const appsAvailable = await getApps();
  //console.log("appsAvailable",appsAvailable);
  if(appsAvailable.errCode == 200) {
      const thermostatAppDefinition = appsAvailable.data.reduce((r,v,i) => {
        if(v.resource.name == appTypeName) {
          r = v.resource;
        }
        return r;
      },{});


      //console.log("thermostatAppDefinition",thermostatAppDefinition)
      const appVersion = thermostatAppDefinition.version;
      

      const params = {     
            
        'typeName': "application",       
        'realName' : name,
        'name' : name,
        'appName': appTypeName,
        'appVersion' : appVersion,
       
        }
        // console.log("params",params);
        // console.log("before Add thermostat from API");
        const resp = await Durin.add('object',params)
        //console.log("resp",resp)
        return resp;
   } else {
    return appsAvailable;
  }
}






  //=======================================================

const model = {   
            //gw:{name:'System'},
            typeName:"Associations",
            realName:"association/id-{objectId}/{actionName}",
            name:"association/id-{objectId}/{actionName}",
            scriptActions:[]
}



/**
 * 
 * @param {*} str 
 * @param {*} Obj 
 * @param {*} prefix 
 * @param {*} suffix 
 */
function StrReplaceMultiple(str,Obj,prefix,suffix) {
  
  //console.log("StrReplaceMultiple",Obj);


  const keyPrefix = prefix || "{";
  const keySuffix = suffix || "}";
  
  const reString =  Object.keys(Obj).reduce(function(r, e) {
    r.push(keyPrefix+e+keySuffix)    
    return r;
  }, []).join("|");
  const re = new RegExp(reString, "gi"); 

  

  return str.replace(re, function(matched) { 

      var cleanedKey = matched.substring(keyPrefix.length,matched.length-(keySuffix.length))      
      return Obj[cleanedKey]; 
  }); 
  
}

function buildScriptAction (objectId,action,params) {
  
  const actionsModels = {
                'call' :'{"type":"call","objectId":"{objectId}","action":"{actionName}"}',
                'notify' : '{type: "notify", severity: "{severity}", title: "{title}", text: "{text}"}'
  }


  return StrReplaceMultiple(actionsModels[type] || "",
                            {
                              'objectId':objectId,'actionName':action.name,
                              'severity':action.severity,'title':action.title,'text':action.text
                            
                            });
  
}


/**
 * 
 * @param {*} objectId 
 * @param {*} scenarioName 
 * @param {*} scriptActions 
 * @returns 
 */
async function createScenario(objectId,scenarioName,scriptActions) {
  /*
    During Creation on Server thanks to Durin API, realName will be converted in order to create the "name" property (slashes are replaced by spaces)
    So we replace spaces by slashes before sending params
  */
 
  const creationTime = Math.floor(Date.now() / 1000)
  const requestDatas = {...model};   

  console.log('CHECK_1 :');
  const realName = scenarioName.split("’").join("'");
  console.log('CHECK_2 :', realName);
  requestDatas.realName = realName+ "/" + creationTime;
  requestDatas.name = realName;
  requestDatas.scriptActions = scriptActions;
  console.log("CREATION_TIME :", requestDatas)

  //return Durin.add("object",{name:realName, realName:realName + "/" + creationTime, scriptActions:scriptActions, typeName:"Associations"});
  return Durin.add("object",requestDatas);
}

async function modifyScenario(scenarioId, scenarioName,scriptActions) {
  /*
    During Creation on Server thanks to Durin API, realName will be converted in order to create the "name" property (slashes are replaced by spaces)
    So we replace spaces by slashes before sending params
  */
 
  const requestDatas = {...model};   
  console.log("VIEW_MODEL :", requestDatas)
//  const realName = scenarioName.split(" ").join("/");
  //requestDatas.realName = realName;
  requestDatas.name = scenarioName;
  requestDatas.scriptActions = scriptActions;

  return Durin.update("object", scenarioId, requestDatas);
}

/*********************
 *  
 *  SchedulerTasks
 * 
 */

   
export function buildScheduleTaskAction(props) {
  const {objectId,scenarioName,triggerDate,taskName} = props;
  //console.log("buildScheduleTaskAction props",props)
  const createScheduleTaskModel = '{"name":"SCHEDULE","mArgs":[{"name":"date","value":"{{triggerDate}}"},{"name":"scenarioname","value":"{{scenarioName}}"},{"name":"scenario","value":"{{scenario}}"}],"oArgs":[{"name":"taskname","value":"{{taskName}}"}]}';
  const action = StrReplaceMultiple(createScheduleTaskModel,props,'{{',"}}");
  //console.log('action en STR',action)
  
  return JSON.parse(action);
}

            //actions:='[{"name":"SCHEDULE","mArgs":[{"name":"event","value":"sunset"},{"name":"offset","value":"60"},{"name":"days","value":"4,6"},{"name":"scenarioName","value":"association id-393793 ON"}],"oArgs":[]}]'

 /**
  * 
  * @param {*} weatherId 
  * @param {*} event 
  * @param {*} offset 
  * @param {*} days 
  * @param {*} scenarioName 
  * @param {*} taskName 
  */          
export function buildScheduleTaskActionByWeather(props) {

 // console.log("buildScheduleTaskActionByWeather",props)
  const {weatherId,event,offset,triggerDate : days,scenarioName,taskName} = props
  const createScheduleTaskByWeatherModel = '{"name":"SCHEDULE","mArgs":[{"name":"event","value":"{{event}}"},{"name":"offset","value":"{{offset}}"},{"name":"days","value":"{{days}}"},{"name":"scenarioName","value":"{{scenarioName}}"}],"oArgs":[{"name":"taskName","value":"{{taskName}}"}]}'
  const action = JSON.parse(StrReplaceMultiple(createScheduleTaskByWeatherModel,{'weatherId':weatherId,'event':event,'offset':offset,'days':days,'scenarioName':scenarioName,'taskName':taskName},'{{',"}}") );
  //console.log('AAAA action buildScheduleTaskActionByWeather',action)
  
  return action;
}

async function createDelayAction(objectId,scenarioName,triggerDate) {
    const taskName = "Task-Delay-"+objectId;
    const res = createScheduleTask(buildScheduleTaskAction({objectId,scenarioName,triggerDate,taskName}))
    return res    
}


/**
 * 
 * @param {*} objectId 
 * @param {*} taskName 
 * @param {*} scenarioName 
 * @param {*} triggerDate 
 * if not undefined below than the Task will bre created by a Weather objest at sunriune or sunset + offset
 * @param {*} weatherId 
 * @param {*} event 
 * @param {*} offset 
 */
async function createSchedulerTask(props) {

 
  const {objectId,taskName,scenarioName,scenario,date,weatherId,event,offset} = props;
  const triggerDate = date;
 console.log("createSchedulerTask",props);

  let actionStr;
  if(weatherId == undefined) {
    actionStr = buildScheduleTaskAction({objectId,scenarioName,scenario,triggerDate,taskName})
  } else {
    actionStr = buildScheduleTaskActionByWeather({weatherId,event,offset,triggerDate,scenarioName,taskName}) 
  }
  
 

  
  // check Task Exists  
  const response = await Durin.search('byName',taskName);
  
  console.log("searchByName",response);

  const getReponseObjects = (response) => {
    return response.res.data.resource.objects || []
  }

  const existsArr = getReponseObjects(response);  
  //console.log("existsArr",existsArr)
  if(existsArr.length == 0) {  
    //console.log("pas encore")
    const cst = createScheduleTask(actionStr,weatherId);
   // console.log("cst",cst)  
    return cst
  } else {
    const toDeleteId = existsArr[0].uri.split('/').pop();    
   // console.log("déjà là supprime")
    // so delete
    await Durin.remove("object",toDeleteId);
    // then create
    const newCreation = await createScheduleTask(actionStr,weatherId);
    
    // then get new Id

  if(newCreation.errCode != 200) {
    //console.log("It's probably time sent < currentTime ")
    return newCreation;
  }
    const newDatas = await Durin.search('byName',taskName);    
    const newId = getReponseObjects(newDatas)[0].uri.split('/').pop();
    
    //then update store without await
    addObjectAction(newId,store.dispatch)
    // finally return 
    
    return newId;  
  }
  
}

/**
 * 
 * @param {*} action 
 * @param {*} weeklyPlanner an Object Id if the ScheduleTask is not created by THE SCHEDULER, if this params is undefined then THE SCHEDULER is used
 */
async function createWeeklyPlanner(action,weeklyPlanner) {
  
  //console.log("createScheduleTask 1",action,scheduler);
  const weeklyPlannerObject = weeklyPlanner || store.getState().objects.objectsByTypes['WeeklyPlanner'][0];

  const plannerCreated = await Durin.update("object",weeklyPlannerObject,{'actions':[action]});
  //console.log("MY_WEEKLYPLANNER_INSTANCE :", plannerCreated)
  return plannerCreated;
}

/**
 * 
 * @param {*} action 
 * @param {*} weeklyPlanner an Object Id if the ScheduleTask is not created by THE SCHEDULER, if this params is undefined then THE SCHEDULER is used
 */
async function removeRoutinePlannings(routineId,weeklyPlanner) {
  
  const weeklyPlannerObject = weeklyPlanner || store.getState().objects.objectsByTypes['WeeklyPlanner'][0];

  const pannerCreated = await Durin.update(
      "object",
      weeklyPlannerObject,
      {
        'actions':[ 
                    {
                      "name":"REMOVE_OBJECT", 
                      "mArgs":[{"name":"objectId", "value":routineId}] 
                    }
                  ] 
      }
  );
  console.log("MY_WEEKLYPLANNER_INSTANCE :", pannerCreated)
  return pannerCreated;
}


/**
 * 
 * @param {*} action 
 * @param {*} scheduler an Object Id if the ScheduleTask is not created by THE SCHEDULER, if this params is undefined then THE SCHEDULER is used
 */
async function createScheduleTask(action,scheduler) {
  
  //console.log("createScheduleTask 1",action,scheduler);
  const schedulerObject = scheduler || store.getState().objects.objectsByTypes['Scheduler'][0];
  // remember actions is an array of actions and arg is an action so pass an array
  // and it's an update because of Scheduler usage


  //console.log("createScheduleTask",action)


  const taskCreated = await Durin.update("object",schedulerObject,{'actions':[action]});
  return taskCreated;
}

async function createMultipleScheduleTask(actions) {
  //console.log("createMultipleScheduleTask",actions)
  const schedulerObject = store.getState().objects.objectsByTypes['Scheduler'][0];
  const taskCreated = await Durin.update("object",schedulerObject,{'actions':actions});
  return taskCreated;
}


async function updateParametersOnServer(objectId,parameters) {
  return await Durin.update("object",objectId,{'parameters':parameters});
}



//----------------------
async function getGraphs(id,rangeType) {

  
    // no milliseconds

    const starts = {
          "hour": {duration:60*60,points:7},
          "day" : {duration:24*60*60,points:7},
          "week": {duration:6*24*60*60,points:7},
          "month":{duration:30*24*60*60,points:7},
        /* "year" : {duration:365*24*60*60,points:80}*/
          "year" : {duration:365*24*60*60,points:7}
  }

  const hour = 60 * 60;  
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
      //Tomorrow
  //const endTime = Math.floor(moment().add(1, "day").unix()/1000);

  const endTime = Math.floor(Date.now()/1000);
  //const endTime = 1695380419;
  console.log("MOI END :", endTime, Date.now())
  const startTime = endTime - starts[rangeType].duration;
  const points = 8;
  console.log('StartTime :', startTime, 'EndTime :', endTime)

  const params = {'hist:start':startTime,'hist:end':endTime,'hist:samples': starts[rangeType].points}
  //const params = {'hist:start':1696924800,'hist:end':1696937400,'hist:samples': starts[rangeType].points}
  // Old: no longer working
  //const params = {'graph_start':startTime,'graph_end':endTime,'graph_points': starts[rangeType].points}
  //console.log("params",params)
    return Durin.graphs(id,params);
}

//--------------------------------------------------


//----------------------
async function getGraphsTimeSeries(id,rangeType, coeff) {

  console.log("LE COEFF :", coeff, rangeType)
    // no milliseconds
    
    const starts = {
          "hour": {duration:60*60,points:7},
          "day" : {duration:24*60*60,points:7},
          "week": {duration:6*24*60*60,points:7},
          "month":{duration:30*24*60*60,points:7},
          "year": {duration:365*24*60*60,points:7}
  }

  const hour = 60 * 60;  
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  //const endTime = 1695380419;// 22 sep 2023 : date pour les fake data
  const iniEndTime = Math.floor(Date.now()/1000);
  let endTime;
  let startTime;

  if(coeff < 0 ){
    endTime = iniEndTime + (coeff +1) * starts[rangeType].duration;
    console.log("END TIME :", endTime)
    startTime = iniEndTime + coeff * starts[rangeType].duration
  }else if(coeff == undefined){
    endTime = iniEndTime // we cannot go behond dotay data
    startTime = endTime - starts[rangeType].duration
  }
  else{
    endTime = iniEndTime // we cannot go behond dotay data
    startTime = endTime - starts[rangeType].duration
  }
  // const endTime = Math.floor(Date.now()/1000);


  // let startTime;
  // startTime = endTime - starts[rangeType].duration;

  //console.log('StartTime :', startTime, 'EndTime :', endTime)

  //const params = {'hist:start':startTime,'hist:end':endTime,'hist:samples': nbPoints}
  const params = {'hist:start':startTime,'hist:end':endTime,'hist:samples': starts[rangeType].points}

    return Durin.graphs(id,params);
}

//--------------------------------------------------




/**
 * 
 * @param {*} objectIds 
 * @param {*} parameters an object of parameters i.e thermostat parameters
 */
const setParameters = async(objectId,parameters) => {

  // be careful parameters must be a key of params
  const params = {'parameters':parameters};  
  const res = await Durin.update("object",objectId,params)  
  return res;
}

const setPoint = async(objectId,mode,value) => {
  let parameters = {};
  parameters['setpoint_'+mode] = Number(value)
  setParameters(objectId,parameters)
}



//----------------------------------------------------------
export const getAllFiles = async () => {
  const res = await Durin.getAllFiles()
  //console.log("getAllFiles",res)
  return res;
}

const getObjectFiles = async(objectId) => {
  const res = await Durin.files(objectId)
 
  return res;
}

//----------------------------------------------------------
//=========================================================



const getEcoConfortAppVersion = async () => {
  console.log('HELLO_VERSION');
  const res = await Durin.apps().catch((err)=> { console.log(err)});
  //const res = await getApps().catch((err)=> { console.log(err)});
  console.log('GET_APP_VERSION :', res);
  let ecoConfAppVersion;
  let ecoConfAppName;
  if(res.errCode == 200) {
      const data = res.data;
      data.map(item =>{
          const {name, version} = item?.resource;
          console.log('GET_APP_VERSION_1 :', name, version);
          if(name && name == "Mode Éco Confort"){
            ecoConfAppVersion = version;
            ecoConfAppName = name;
          }
      })
  }
  return {ecoConfAppName, ecoConfAppVersion};
}


/**
 * @param {Object} params 
 * @param {string} [params.name]
 */
async function createEcoConfortApplication(body) {
  const appName = "Mode Éco Confort"
  const ecoConfAppVersion = "3.1.7" //await getEcoConfortAppVersion()//"3.1.0"
  //const {ecoConfAppName, ecoConfAppVersion} =  appInfos;
  const typeName = "application"

  const requestBody = {
    appName: appName,
    appVersion: ecoConfAppVersion,
    parameters: body.parameters,
    name: body.name,
    realName: body.name,
    typeName: typeName
  }

  console.log('CREATE_ECO_CONFORT_APP_REQUEST_BODY_CREATION :', requestBody);

  const resp = await Durin.add('object',requestBody);
  console.log("resp",resp)
  return resp;
}

/**
 * @param {Object} params
 * @param {string} [params.name]
 *  
 */
async function updateEcoConfortApplication(body) {
  const appName = "Mode Éco Confort"
  const typeName = "application"
  const ecoId = body.id;
  const requestBody = {
    appName: appName,
    //appVersion: appVersion,
    parameters: body.parameters,
    name: body.name,
    realName: body.name,
    typeName: typeName
  }

  console.log('CREATE_ECO_CONFORT_APP_REQUEST_BODY_UPDATE :',  JSON.stringify(requestBody));

  const resp = await Durin.update('object',ecoId,requestBody);
  console.log("resp",resp)
  return resp;
}

/**
 * @param {Object} params
 *  
 */
async function activateApp(id) {

  const params = {"actions":[{"name":"ACTIVATE"}]}
  const res = await Durin.update("object",id,params)
  console.log('ACTIVATE_APP :', res);
  if(res?.errCode == 200){
    const refreshMyEcoApp = await refreshObjectAction(id, store).catch((err) => console.log("ERROR_REFRESH_ECOCONF_APP :",err));
  }
  return res;
}

/**
 * @param {Object} params
 *  
 */
async function deactivateApp(id) {
  const params = {"actions":[{"name":"DEACTIVATE"}]}
  const res = await Durin.update("object",id,params)
  console.log('DEACTIVATE_ECO_CONFORT :', res);
  if(res?.errCode == 200){
    const refreshMyEcoApp = await refreshObjectAction(id, store).catch((err) => console.log("ERROR_REFRESH_ECOCONF_APP :",err));
}
  return res;
}


/**
 * @param {Object} params 
 * @param {string} [params.name]
 */
async function createWindProtectiontApplication(name, parameters) {
  const appName = "Protection vent"
  const ecoConfAppVersion = "2.1.5"
  const typeName = "application"

  const requestBody = {
    name:name,
    realName:name,
    appName: appName,
    appVersion: ecoConfAppVersion,
    typeName: typeName,
    parameters: parameters,
  }
  console.log('CREATE_WIND_PROTECTION_APP_REQUEST_BODY_CREATION :', requestBody);
  const resp = await Durin.add('object',requestBody);
  console.log("resp",resp)
  return resp;
}

/**
 * @param {Object} parameters
 * @param {string} name
 * @param {string} id
 *  
 */
async function updateWindProtectiontApplication(name,id,parameters) {

  const requestBody = {
    name:name,
    parameters: parameters,
  }

  console.log('CREATE_ECO_CONFORT_APP_REQUEST_BODY_UPDATE :',  JSON.stringify(requestBody));

  const resp = await Durin.update('object',id,requestBody);
  console.log("resp",resp)
  return resp;
}




/**
 * 
 * @param {*} objectIds 
 * @param {*} parameters an object of parameters i.e thermostat parameters
 */
const setEcoConfortParameters = async(objectId,parameters) => {

  // be careful parameters must be a key of params
  const params = {'parameters':parameters};  
  const res = await Durin.update("object",objectId,params)  
  return res;
}


//-------------------
// by Harold Add custom status
// modified by olivier
// on server side statusname must start with __user_
/**
 * 
 * @param {*} id 
 * @param {*} statusName 
 * @param {*} value 
 * @returns 
 */
const addStatus = async (id,statusName,value) => {

  const acceptedStatusName = (statusName.indexOf("__user_") == 0)? statusName : "__user_"+statusName;
  const statusBlock = {name:acceptedStatusName, value:value}
  const actions = {statuses:[statusBlock]};
 console.log("addStatus",actions  )
  res = await Durin.update("object",id,actions)
  console.log("addStatus",res.errCode,res.id);
  return res;
}


export {
  createObject,
  addStatus,
  getObjects,
  renameObject,
  updateObjectFlags,
  sendServerParameters,
  getObject,
  getUses,
  getByName,
  deleteObject,
  deleteObjects,
  pairingObject,
  createWeatherObject,
  createQrCodeVDP,
  createThermostatApplication,
  createDonkeyThermostatApplication,
  createScenario,
  modifyScenario,
  createDelayAction,
  createSchedulerTask,
  createMultipleScheduleTask,
  updateParametersOnServer,
  getGraphs,
  getGraphsTimeSeries,
  setParameters,
  setPoint,
  getObjectFiles,
  getApps,
  updateApplication,
  updateObjectRoom,
  updateScenario,
  getGateways,
  createWeeklyPlanner,
  removeRoutinePlannings,
  createEcoConfortApplication,
  setEcoConfortParameters,
  updateEcoConfortApplication,
  activateApp,
  deactivateApp,
  createWindProtectiontApplication,
  updateWindProtectiontApplication
};


// Keep them here before total refactor completed
