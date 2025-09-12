import dotProp from 'dot-prop-immutable';
import {isArray as lodashIsArray, pull as lodashPull} from 'lodash';
//--------------------------------------------------
import * as ActionsTypes from '../actions/objectTypes';
//import {OBJECTS_FILL} from '../actions/objects';
import {EXECUTE_ACTION} from '../actions/objects';
import {updateObjectFlags,sendServerParameters} from '_api/objects'
import { property } from 'lodash';
import  NavigationService from '_services/navigationService';
//import { State } from 'react-native-gesture-handler';



let statusesUpdatesBuffer = {};
let saveTimers = {};
let debounceTime = 250; // 
let serverCallBuffer = {}

const  getStatusesToUpdate = (objectId) => {
    return statusesUpdatesBuffer[objectId];
}

const saveDebounce = (objectId,status,value,next) => {
    //console.log("------- saveDebounce ------",objectId, ' ----- ',status,' --- ',value)
    if(statusesUpdatesBuffer[objectId] == undefined){
        statusesUpdatesBuffer[objectId] = {}
    }
    statusesUpdatesBuffer[objectId][status] = value;

    //console.log("alors complet=",JSON.parse(JSON.stringify(statusesUpdatesBuffer)))
    //console.log("statuses update length =======>>> ",Object.keys(statusesUpdatesBuffer[objectId]).length)
    if (saveTimers[objectId]) {
        clearTimeout(saveTimers[objectId]);
    }

    saveTimers[objectId] = setTimeout(() => {
       // console.log("voilà buffer for "+objectId,statusesUpdatesBuffer)
        const action = {type:'DEBOUNCED_UPDATE',payload:{objectId:objectId,value:{...statusesUpdatesBuffer[objectId]}}}
        //console.log("statusesUpdatesBuffer[objectId]",JSON.parse(JSON.stringify(statusesUpdatesBuffer[objectId])),JSON.parse(JSON.stringify(getStatusesToUpdate(objectId))))
        //console.log("ALORS envoyé :",action)
        statusesUpdatesBuffer[objectId] = {};
        next(action); 
    }, debounceTime);
};


const debounceParameterServerUpdate = (action,store,next) => {
    const {objectId,parameterName,value} = action.payload;
    const callKey = objectId+"_"+parameterName;
    
    if(serverCallBuffer[callKey] == undefined)serverCallBuffer[callKey] = {}
    let params = {};
    params[parameterName] = value;
    serverCallBuffer[callKey] =  params;

    //console.log("updateParameter action recieved",serverCallBuffer[callKey])

    if(saveTimers[callKey]) {
        //console.log("timer nettoyé ",callKey)
        clearTimeout(saveTimers[callKey]);
    }
    saveTimers[callKey] = setTimeout(async()=> {
        const toSend = {...serverCallBuffer[callKey]}
       //console.log("=====================>> send parameters to server ",toSend);
       serverCallBuffer[callKey] = {};
        const updateParameter = await sendServerParameters(objectId,toSend).catch(err => console.log(err));
        //console.log(updateParameter)
       
    }, debounceTime*4)
   
}



//-------------------------------------------------
let thermostat = {};

const objectsiMiddleware = (store) => (next) => (action) => {
  //console.log("objectsMiddleware: ", action, ActionsTypes.OBJECTS_FILL);
    const {type,payload} = action;
  
    switch(type) {

      

        /* first the most dispatched action : UPDATE FROM WEBSOCKET */

      case  ActionsTypes.OBJECT_UPDATE_FROM_WEBSOCKET :

        const ObjectsState = store.getState().objects;
        const objectEventId = payload.objectEventId;    
        const objectId = ObjectsState.objectsByEventsName[payload.objectEventId];
        console.log('MIDLW ::', payload);
        const objectPath = 'entities.objects.'+objectId; 
        const statusName = payload.statusName;
        const statusPath = objectPath+'.statusDictionary.'+statusName;     
        const currentValue = dotProp.get(ObjectsState,statusPath)

        //console.log("APP MIDDLEWARE, OBJECT_UPDATE_FROM_WEBSOCKET ",statusPath,statusName,currentValue,payload)

        // DON'T PANIC if status is not send to savebounce
        // it's because the new value is the same as the currentValue
        // it happens on heaters consumptions

        // if you want to process or verify all socket send updates then just add  || 1 == 1 in condition below
        //console.log("socket payload",payload.statusName,payload.value)
       if( statusName == "ice" ) {
        console.log("MMMC -------------------- socket status ice ----------------------------------",payload);
        const parsedValue = JSON.parse(payload.value)
        console.log("type --->",parsedValue.type)
        let newPayload = {...payload}
        const newStatusName = (parsedValue.type == 'answer')? 'answer' : 'ice';
        //const newAction = {type:'DEBOUNCED_UPDATE',payload:newPayload}
        console.log("MMMA before saveDebounce")
        saveDebounce(objectId,newStatusName,payload.value,next);
        //saveDebounce(objectId,newStatusName,payload.value.split("\\r\\n").join("\r\n"),next);
        console.log("MMMA after saveDebounce")
        
        //console.log("action",action)
        //next(newAction)
       } else {
           /*

            All this below because of VDP call and notification flow little bit messy


           console.log("hop",objectEventId.indexOf('event/io/athome/access/vdp/') )
           console.log("statusName",statusName)
           console.log('alors',(objectEventId.indexOf('event/io/athome/access/vdp/') != -1 && statusName == 'status'))
           if(objectEventId.indexOf('event/io/athome/access/vdp/') != -1 && statusName == 'status' && 1 == 1) {
               console.log("ça passe")
            if(Number(payload.value) == 1) {
                console.log("il y a un appel VDP !!!!")
                NavigationService.navigate("globalmodal")
            }
           } else {
            if(currentValue != payload.value  || 1 == 2 ) {
                saveDebounce(objectId,statusName,payload.value,next);
                //next(action);
            } else {
                
              //console.log(objectId,statusName,payload.value,"In objectsiMiddleware status value unchanged, action stopped here")
            }
           }
           */
           if(currentValue != payload.value  || 1 == 2 ) {
                saveDebounce(objectId,statusName,payload.value,next);
                //next(action);
            } else {
                
                //console.log(objectId,statusName,payload.value,"MMMB In objectsiMiddleware status value unchanged, action stopped here")
            }
        
       }
       
        
        
        break;

    case EXECUTE_ACTION :
        next(action);
        break;

    case ActionsTypes.OBJECTS_FILL :
        console.log("middleware OBJECT_FILL",action.payload);

        //console.log('OBJECT FILL in objects middleware');
        // Harold : j'ai commente la ligne en dessous afin d'ajouter mon tri: faire next(newAction)
        next(action)  

        // const types = action.payload?.objectsByTypes;
        // const listTypeHarold = ["Light","Rolling_Shutter"];
        // const newVisibles = listTypeHarold.reduce((r,v,i)=>{
        //   r.push(...types[v]);
        //   return r;
        // }, [])
        // console.log( "Here NEWVISIBLE 2", newVisibles);
      
        // const obj = {objectsVisible:newVisibles};
        // const newAction = {
        //   type: action.type,
        //   payload: {...action.payload, ...obj}
        // }
        // next(newAction);
        // console.log("NEW ACTION : ", newAction);
        break;

    case ActionsTypes.OBJECT_ADD :       
      
        //console.log("middleware OBJECT_FILL OBJECT_ADD",payload)
       
    // Sortie traitement des objets 

      //console.log("ben c'est null")


      // Vrai version  next(action)
       next(action);
        // then update that if needed
       // objectId,property,value,append
       
       if(payload.loaded.length == 1) {
           const addObjectDatas = payload.entities.objects[payload.loaded[0]]
           console.log("Middleware addObjectDatas",addObjectDatas)
           if(addObjectDatas) {
                if(addObjectDatas.typeName == "SchedulerTask") {
                    console.log("addObjectDatas.typeName",addObjectDatas.typeName)
                    const scenarioId = addObjectDatas?.description?.scenarioId;
                    console.log()
                    if(scenarioId) {
                        console.log("scenarioId",scenarioId)
                        const objects = store.getState().objects.entities.objects
                        const scriptActions = objects[scenarioId]?.scriptActions
                        console.log("scriptActions",scriptActions)
                        
                            const objectName = addObjectDatas.name;
                            const objectId = addObjectDatas.name.split("-").pop();
                            const scenarioId = addObjectDatas.description.scenarioId;
                            const propertyName = "tasks"
                            const value = {'taskName':objectName,'schedulerTaskId':addObjectDatas.id,'scenarioId':scenarioId}
                            const payload = {'objectId':objectId,'property':propertyName,'value':value,'append':true};
                            console.log("specialTask GoGoGo",payload)                          
                            store.dispatch({'type':ActionsTypes.OBJECT_UPDATE_PROPERTY,'payload':payload})

                    }
                } else {
                   console.log("Middleware addObjectDatas single ",addObjectDatas)
                   next({'type':ActionsTypes.PAIRING,'payload':addObjectDatas})
                }
           }
       }
       
        break;

    case ActionsTypes.OBJECT_DELETE : {
       
        const {objectId,groups} = payload
        const objects = store.getState().objects.entities.objects;
        //console.log("aaaa",objects)
        if(groups){
            updateGroupsOfDeletedObject(objectId,groups,objects,store);
            updateDeletedGroupComponents(objectId,objects,store)
        }
       
        next(action)
        break;
    }
    break;

    case ActionsTypes.OBJECT_SET_SCHEDULE_DATAS : {
  
        store.dispatch({'type':ActionsTypes.RUNTIME_DATAS,'payload':{'itemId':payload.objectId,'key':"scheduleDatas",'value':payload.value}})
        next(action)
        break;
    }
    break;



    case ActionsTypes.HEATER_PROGRAM_DEACTIVATE : {
            console.log("MIDDLEWARE",action,payload)
            const objectId = payload.itemId;
            thermostat[objectId] = {'flagValue':payload.flagValue,'taskIds':payload.taskIds};
            
            const handleDeactivationDone = (res) => {
                console.log("deactivation done",res)
                console.log("la",thermostat[objectId].taskIds.length)
                if(thermostat[objectId].taskIds.length > 0) {
                    doNextDeactivation();
                }
                //
            }

            const doNextDeactivation = () => {
                deactivateTask( store,objectId,thermostat[objectId].taskIds[0],thermostat[objectId].flagValue).then((res) => {
                    thermostat[objectId].taskIds.shift()
                    handleDeactivationDone(res)
                } ,(err)=>{console.log("deactivateTask",err)})
            }
            doNextDeactivation();

        }
        
        
        break;

    case ActionsTypes.OBJECT_UPDATE_PARAMETER : {
        //console.log("ActionsTypes.OBJECT_UPDATE_PARAMETER middleware",action)
        debounceParameterServerUpdate(action,store);
        next(action); 
        }
        break;


    case "UPDATEME" : {
        console.log("UPDATEME :: updateMeStatus",payload);
        store.dispatch({
            type : ActionsTypes.OBJECT_UPDATE_STATUSES,
            payload:{'objectId':payload.objectId,value:payload.value}
          })
        
        }
        //Attention return State;
        break;

    default:  
        //console.log(" DEFAULT NEX ACTION : ")     
        next(action)
    }
  }

  const deactivateTask = async(store,itemId,taskId,val) => {

    
   
    const ObjectsState = store.objects;    
    const objectPath = 'entities.objects.'+itemId;
    const inGroup = dotProp.get(ObjectsState,objectPath+'.rDependencies.groups',[]);
   
    console.log("inGroup",inGroup)
    if(inGroup == undefined) {
        return false;
    }
    console.log("inGroup",inGroup)
    if(inGroup && lodashIsArray(inGroup)) {       
       
        const retVal = inGroup.reduce((r,v,i) => {
                r.push(v.uri.split("/").pop());
                return r;
        },[])        
         return retVal; 
    }
  }
  
   
  export default objectsiMiddleware