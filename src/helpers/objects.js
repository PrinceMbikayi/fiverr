import store from "../store"; /* see link below */
/* https://www.reddit.com/r/reactjs/comments/avekwi/access_the_redux_store_outside_a_react_component/ */

import * as ApiObjects from '../api/objects';


/**
 * 
 * @param {*} objectId 
 * @param {*} propsNames Array of Strings i.e. ['scenarios','name', etc..]
 */
const getObjectDatas = (objectId,propsNames) => {
    
    const objectState = store.getState().objects.entities.objects[objectId];
    //console.log("getObjectDatas",JSON.stringify(objectState))
    if(propsNames == undefined) return objectState;
    let retVal = {}
    propsNames.forEach(prop => {
        retVal[prop] = objectState[prop];
    });
    
    return retVal;
    
}


/***********$
 * 
 *  Be CAREFULL 
 * 
 * 
 */

const _getUses = async(itemId) => {
   
    const response = await ApiObjects.getUses(itemId);    
    return response.res.data.resource.objects
}

/**
 * 
 * return complete datas of the object in store
 * @param {integer} id 
 * @returns Object
 */
const getRoomById = (id) => {
    return _getRoomById(id);
}


/**
 * 
 * return complete datas of the object in store
 * @param {integer} id 
 * @returns Object
 */
const getObjectById = (id) => {
    return _getObjectById(id);
}

// depends on server eventName ends with a slash or not
// so testit here in order to return the right value

/**
 * return the id or undefined if it's not in store
 * @param {string} eventName 
 * 
 */
const getObjectByEventName = (eventName) => {

    // the damned slash
    const retVal = _getObjectByEventName(eventName);
    if(retVal != undefined) return retVal;
    if(eventName.slice(-1) != "/") return undefined;
    return _getObjectByEventName(eventName.slice(0,-1))
    
}
const getUses = async(itemId) => {
    const response = await _getUses(itemId);
    return response;
}
const getObjectByName = (name) => {
    console.log("name",name)
    return _getObjectByName(name)
}
//-------------------------------------------------


function getWeatherObjects() {
  
    const weatherObjectsIds = getObjectsByType ('Weather') || [];
   
    const retVal = weatherObjectsIds.reduce(function(r,v,i){
        const obj = getObjectById(v);
        if(obj == undefined)return r;
        r.push({'id':v,'name':obj.name})
        return r
    },[]);
    return retVal;
  }
  
function getObjectsByType (type) {
    let state = store.getState();  
    return state.objects.objectsByTypes[type]
}

function getObjectsByTypeName (type) {
    let state = store.getState();
    //console.log("getObjectsByTypeName",state.objects)
    return state.objects.objectsByTypeNames[type]
}

const getObjectStatus = (objectDatas,statusName) => {
    return (objectDatas.statusDictionary[statusName])
}
/**
 * 
 * @param {*} itemId 
 * @param {*} allScheduleTasks 
 */
export const getObjectScheduleTaskIds = (itemId,allScheduleTasks) => {

}

const getSameFamilyProducts = (unitype) => {

}

function getUserDefaultWeather () {
    let state = store.getState();
    return state.user?.defaultWeather;
}




export {
    getRoomById,
    getObjectById,
    getObjectByEventName, 
    getObjectByName,  
    getWeatherObjects,
    getObjectsByType,
    getObjectsByTypeName,
    getUses,
    getObjectDatas,
    getObjectStatus,
    getSameFamilyProducts,
    getUserDefaultWeather
}





/*************************************************
 * 
 *  private tools
 * 
 * 
 */

const _getObjectByEventName = (eventName) => {
    return store.getState()?.objects?.objectsByEventsName[eventName];
}
const _getObjectById = (objectId) => {
    return store.getState()?.objects?.entities?.objects[objectId];
}
const _getRoomById = (roomId) => {
    return store.getState().rooms.entities[roomId];
}

const _getObjectByName = (name) => {
    return store.getState()?.objects?.objectsByNames[name];
}