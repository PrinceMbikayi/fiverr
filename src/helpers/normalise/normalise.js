import { normalize, schema } from 'normalizr';
import {athomeFamilyTypes} from '_config/products/core';
import { AppConfig } from '_config';
//import {deleteObjects as deleteObjectsFromServer,getByName} from '_api/objects';
import {getByName} from '_api/objects';
import * as ApiObjects from '_api/objects';
import { getRooms } from '_api/Api';
import store from '../../store';
import { set as lodashSet } from 'lodash';
import { alphabeticSort } from '_brand/utils/alphabeticSort';

function normaliseRooms(datas){
    const object = new schema.Entity('objects', {}, { idAttribute: value => value.uri.split('/').pop() });
   // const extraSchema = new schema.Entity('ById', {}, { idAttribute: value => value.uri.split('/').pop() });
    const roomSchema = new schema.Entity('rooms',{objects:[object]}); 
    
    const roomListSchema = [roomSchema];
    const normalizedData = normalize(datas, roomListSchema);

    return {'rooms':normalizedData, 'objects':normalizedData.entities.objects}

} 

function normaliseNotifications(datas) {
  /*
  const notificationSchema = new schema.Entity('notifications', { }); 
  const notificationListSchema = [notificationSchema];
  const normalizedData = normalize(datas, notificationListSchema); 
  
  return normalizedData.entities;
  */

  let sections = [];
  //let currentDayIndex= -1;
  let currentDay = "";
  datas.map((v,i) => {
    let splittedDay = v.time.split(" ");
    splittedDay.pop();
    const dayKey = splittedDay.join(" ");
    if(dayKey != currentDay) {
      currentDay = dayKey;
      sections.push({'title':dayKey,'content':[]})
    }
    sections[sections.length-1]['content'].push(v)
  })



  return {'list':datas,'sections':sections};
}

/**
 * 
 * @param {*} datas 
 * @param {*} previousUniType optional needed for composite refresh
 * @param {*} checkForOrphans optional use only for getObjects
 */
function normaliseObjectsDurin(datas,previousUniType,checkForOrphans,gateways){
  
  //console.log("---------- normaliseObjectsDurin --------------")
  console.log("DATA_TO_NORMALIZE :",datas)



  const statusProcessStrategy = (value,parent,key) => {
    let statusName = value.name;
        let statusValue = value.value;
        let ret = {};
      
        return {value:statusValue,time:value?.time} ;
  }

      const statusSeparator = "@";
      const statusesSchema = new schema.Entity('status',{},{
                                                                idAttribute: (value,parent) => parent.id+statusSeparator+value.name,
                                                                
                                                                processStrategy:statusProcessStrategy/*,
                                                                mergeStrategy: (entityA, entityB) => {
                                                                  //let ret = (Array.isArray(entityA))? entityA : [entityA]
                                                                 
                                                                   //return [entityA,entityB] arb but
                                                                   return [].concat(entityA).concat(entityB)
                                                                }
                                                                */
                                                              }
                                                            )

      const roomSchema = new schema.Entity('room',{},{
                                      idAttribute: (value) => value.uri.split("/").pop(),         
                                      processStrategy: (value, parent, key) => {
                                            return Object.assign({}, value, { dataId: value.uri.split("/").pop()}); 
                                      }
                                    }
                                  )

      


      const gatewaySchema = new schema.Entity('gw',{},{       
                                      idAttribute: (value,parent) => value.uri.split("/").pop(),         
                                      processStrategy: (value, parent, key) => {
                                        return Object.assign({}, value); 
                                      },
                                      mergeStrategy: (entityA, entityB) => {
                                        return entityB
                                      }
                                    }
                                  )



      const categoriesSchema = new schema.Entity('categories',{},{
                                      idAttribute: (value) => value.uri.split("/").pop(),         
                                      mergeStrategy: (entityA, entityB) => {
                                        return entityB
                                      }
                                    }
                                  )

      const componentsSchema = new schema.Entity('components',{},{
                                    idAttribute: (value) => value.uri.split("/").pop(),         
                                    mergeStrategy: (entityA, entityB) => {
                                      return entityB
                                    }
                                  }
                                )

        const typeNameSchema1 = new schema.Entity('typeName',{},{
                                      idAttribute: (value,parent) => value,         
                                      mergeStrategy: (entityE, entityF) => {
                                        return entityE
                                      }
                                    }
                                  )


        const typeNameSchema = new schema.Entity('typeName',{},{
         
          idAttribute: (value,parent) => value+"_"+parent.id,         
          processStrategy: (value, parent, key) => {
              console.log("processStrategy typeNameSchema =>",value)
                return Object.assign({}, value, { dataId: value}); 
          }
        }
      )


        const statusDictionary = new schema.Entity('status',{},{
                idAttribute: (value,parent) => parent.id+statusSeparator+value.name,
                processStrategy:statusProcessStrategy,
                mergeStrategy: (entityA, entityB) => {
                  let ret = (Array.isArray(entityA))? entityA : [entityA]
                
                  //return [entityA,entityB] arb but
                  return [].concat(entityA).concat(entityB)
                }
              }
            )

      
      // note that gw and room is a unique value (object), not an array of objects
      // so in objectSchema entity don't wrap schema in an array

      const objectSchema = new schema.Entity('objects',
      {
        room:roomSchema,
        statuses:[statusesSchema],
        categories:[categoriesSchema],       
        gw:gatewaySchema,
        typeName:typeNameSchema,
        components:[componentsSchema]
      }); 
      //const objectSchema = new schema.Entity('objects');
      const objectListSchema = [objectSchema];


    
    const normalizedData = normalize(datas, objectListSchema); 

    console.log("normalizedData",JSON.parse(JSON.stringify(normalizedData)));
    
    //let eventsByName = objectsByEventIds(normalizedData.entities.objects);    

    let preProcessResult = preProcess(normalizedData.entities.objects || {},checkForOrphans,gateways);    
    console.log("preProcessResult",preProcessResult)
  let currentProcess = "-1"
  if(normalizedData.entities.status != undefined) {

    /*
    console.log("---------- voilou ------------------");
    console.log(JSON.parse(JSON.stringify(normalizedData.entities.status)));
    */

    for (let [key, value,time] of Object.entries(normalizedData.entities.status)) {
   
    let splitted = key.split(statusSeparator);
    let objectId = splitted[0];
    let statusName = splitted[1];
    let statusImages,currentStatusImage;
      if(currentProcess !== objectId){
      
      currentProcess = objectId;
      normalizedData.entities.objects[objectId].statusDictionary = {};
      normalizedData.entities.objects[objectId].statusesActiveImages = [];

      }
      // 2022-02-10 : be careful now it's an object not only a value (Attention)
      // value => {value,time}
      normalizedData.entities.objects[objectId].statusDictionary[statusName] = value.value;

      // Add Mapping for donkey testing and missing Statuses in general
      const doInsert = processStatusesIfNeeded(statusName,value.value,value.time);
      if(doInsert) {
        
        lodashSet(normalizedData.entities.objects[objectId],doInsert.path,doInsert.value);
      }
    }
  } 
  


  // GESTION DES GROUPES
  console.log("gestion des groupes ==>> ",preProcessResult.objectsByTypes)
  if(preProcessResult.objectsByTypes.Composite != undefined) {
    preProcessResult.objectsByTypes['Composite'].forEach(objectId => {
      const obj = normalizedData.entities.objects[objectId];
      obj.uniType = "Composite";
      //console.log("gestion des groupes",JSON.parse(JSON.stringify(obj)))
      const myLength = (obj?.components)? obj.components.length : 0


      if(myLength > 0) {
        
        const firstComponentId = obj.components[0];
      
        let firstComponent = normalizedData.entities.objects[firstComponentId];

        // ATTENTION QUAND C'est un ajout via un demande envoyé par la websocket
        // les composants d'un groupe ne font probablment pas partie des entites nouvellemebnt créées
        if(firstComponent == undefined) {        
          firstComponent = store.getState().objects.entities.objects[firstComponentId];
          //console.log("firstComponent",JSON.parse(JSON.stringify(firstComponent)))
          //const uniType = firstComponent.typeName;
        }
      
        const className = (firstComponent)? firstComponent.className : undefined;
        const typeName = (previousUniType!= undefined) ? previousUniType :(firstComponent)? firstComponent.typeName : undefined;
        
        // Scheduler Is Unique so ... and objectsByTypes['Scheduler'] will be used to get THE Scheduler
        
        // forget className now it's typeName
        
        if(className != undefined && className != "Scheduler") {
          obj.uniType = className;      
          if(preProcessResult.objectsByTypes[className] == undefined)preProcessResult.objectsByTypes[className]=[];
          preProcessResult.objectsByTypes[className].push(objectId)
        }
        
        console.log("Hello 2 ")
      // but keep className for Scheduler
        
        if(typeName != undefined && className != "Scheduler") {
          obj.uniType = typeName;   
          if(preProcessResult.objectsByTypeNames[typeName] == undefined)preProcessResult.objectsByTypeNames[typeName] = []    
          preProcessResult.objectsByTypeNames[typeName].push(objectId)
        }
      } else {
        //console.log(" HAAAA J'AI PAS D'ELEMENT ")
      }
    });
  }

 // remove unwanted infos
 // normalizedData.entities.status 

 console.log("Hello 3 ")
 normalizedData.entities.status = null;
  const retVal = {  
                    'entities':normalizedData.entities,
                    'loaded':normalizedData.result,
                    'objectsByEventsName':preProcessResult.objectsByEventsName,
                    'objectsByTypes':preProcessResult.objectsByTypes,
                    'objectsByNames':preProcessResult.objectsByNames,
                    'objectsByRealName':preProcessResult.objectsByRealName,
                    'objectsByTypeNames':preProcessResult.objectsByTypeNames,
                    'objectsByClassNames':preProcessResult.objectsByClassNames,
                    'objectsVisible':preProcessResult.objectsVisible,
                    'atHomeObjectsByDeviceId':preProcessResult.atHomeObjectsByDeviceId
                  
                  
                }

  return retVal;
    
}

const processStatusesIfNeeded = (key,value,time) => {

  const toProcess = {
                      "no__json_description":"description",
                      "no__firmware":"firmware",
                      "__pushAlert":"statusDictionary._lastSeen"
                };
  if(toProcess[key] == undefined) return false;

  let insertValue;
  switch (key) {
    case  "__firmware" : 
      insertValue = "XX"+value;    
     break;

    case "__pushAlert" :
      insertValue = time
      break;

    default:
      return false;
  }
  //console.log("bon lastSeen ---->>",toProcess[key],key,value,time,insertValue)
  return  {path:toProcess[key],value:insertValue}

}





/**
 * 
 * @param {*} datas 
 * @param {*} checkForOrphans 
 * @param {*} gateways needed for eventId
 * @returns 
 */
function preProcess(datas,checkForOrphans,gateways) {

    console.log("start preProcess",gateways)
    let ret={}
    let types={};
    let typeNames = {};
    let classNames = {};
    let names= {};
    let realNames = {};
    let atHomeDeviceIds = {};
    let type,typeName,className,families;
    let visibles = [];



    //console.log("preProcess >> datas",datas)

      /*
      const familySort = Object.keys(athomeFamilyTypes).reduce((r,v,i) => {
        let familyType = v;
        let a = athomeFamilyTypes[v].reduce((rr,vv,ii) => {
            rr[vv] = familyType;
            return rr
        },{})
            r = {...r,...a}
            return r
      },{})
    */
   
    //console.log('NO_MORE_SCHEDULES_TASKS_PURGE :::');

     for (let [key, value] of Object.entries(datas)) {
        const entryId = datas[key]?.id;
        const entryName = datas[key]?.name;
       //console.log("preprocess",entryId,entryName)
        // Ajout du statusDictionary
        datas[key].statusDictionary = {};

        //Ajout des Tasks
        // Test special pour supprimer des choses

       
       

          /********** multiGateways ****************************/

          const lookGatewaysHere = gateways || store?.getState()?.objects?.gatewaysById

          const gatewayid = value?.gw; 
           //console.log("gatewayid",gatewayid);
           //console.log("lookGatewaysHere BBBB",lookGatewaysHere)
          const gateWayRealName = lookGatewaysHere[gatewayid];

          const eventId = gateWayRealName+"_"+cleanEventId(value.eventId);

          // console.log("***** gateways",JSON.stringify(lookGatewaysHere))
          // console.log("gateWayRealName",gateWayRealName)
          // console.log("gatewayid AAA",gatewayid)
          // console.log("eventId",eventId)      

          if(gateWayRealName) {
            ret[eventId] = value.id; 
            if(eventId.indexOf('event/io/athome/') != -1) {
            // console.log("-- "+eventId)
              const splitted = (""+eventId).split("/")
              const deviceId = splitted[splitted.length-2];
              atHomeDeviceIds[deviceId] = value.id;
            }
          }
        
       



         // les typeNames
         typeName = value.typeName;
         
         if(typeName != undefined) {
           if(typeNames[typeName] == undefined)typeNames[typeName] = []
           typeNames[typeName].push(value.id)
         }

          // type du début
          type = value.type;
          if(type == undefined)type = value.className
          if(types[type] == undefined)types[type] = [];
          types[type].push(value.id);

         // les classNames
         className = value.className;
         if(className != undefined) {
           if(classNames[className] == undefined)classNames[className] = []
           classNames[className].push(value.id)
         }


         // les noms 
         names[value.name] = value.id;

         // les vrais noms

         realNames[value.realName] = value.id;



         // visibles
         let isVisible = true;
         if(datas[key].flags != undefined && datas[key].flags.hidden == true) isVisible = false;
         if(isVisible) {
          isVisible = ( AppConfig.HIDDEN_OBJECTS.indexOf(datas[key][AppConfig.OBJECT_TYPE_VARNAME]) == -1 && 
                    AppConfig.HIDDEN_OBJECTS.indexOf(datas[key]['typeName']) == -1)
         }
         
         if(isVisible)visibles.push(value.id);

         
      }


      console.log("NORMALISE ROOM ::::::::::")
      getRooms();




     // Sortie traitement des objets 
      //console.log("C'est toi qui bloque : ben c'est null")

      // Ajout Harold : par olivier
    // const listTypeHarold = ["Light","Rolling_Shutter"]; // liste qui contiendra que les types cites. 
    //                                                     // Attention les autres objets visible d'autre type sont laisses
    //                                                     // donc le rendu sur Product liste ne va pas les avoir.
    // const newVisibles = listTypeHarold.reduce((r,v,i)=>{
    //   r.push(...types[v]);
    //   return r;
    // }, [])
    // console.log( "Here NEWVISIBLE", newVisibles);

      return {  
                objectsByEventsName:ret,
                atHomeObjectsByDeviceId:atHomeDeviceIds,
                objectsByTypes:types,
                objectsByNames:names,
                objectsByRealName:realNames,
                objectsByTypeNames:typeNames,
                objectsByClassNames:classNames,
                objectsVisible:visibles,
                //_objectsVisible:newVisibles
              }
}


function preprocessTasks () {



}


function cleanEventId (val) {
 
  if(val == undefined) return val;
  return (val.charAt(0) == '/')? val.slice(1) : val;
}

function objectsByEventIds(datas){
   
    let ret={}
     for (let [key, value] of Object.entries(datas)) {
       
        const eventId = cleanEventId(value.eventId);       
         ret[eventId] = value.id
       
      }
     return ret; 
}


export {
    normaliseRooms,    
    normaliseObjectsDurin,
    normaliseNotifications
}