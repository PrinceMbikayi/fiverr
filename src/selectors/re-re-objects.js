

import createCachedSelector from 're-reselect';
import { AppConfig } from '../config'
import { athomeFamilyTypes,athomeGroupTypes } from '_config/products/core';
import { genericGroupTypes } from '_config/products/generic';
//--------------------------------------------------------------
const getObjects = (state) => {
    //console.log("getObjects",state.objects.entities.objects)
    return state.objects.entities.objects;
}
const getAllObjectsIds = (state) => {
  return state.objects.loaded
}
//---------------------------------------------------------------
const getObjectsIds = (state,roomId) => {
    //console.log("getObjectsIds",state.rooms.entities[roomId])
    return state.rooms.entities[roomId].objects;
}

const getObjectsInRoom = createCachedSelector(
  [getObjects, getObjectsIds, (state, roomId) => roomId],
  (objects, objectsIds, roomId) => {


    console.log("computing getObjectsInRoom")
    var filtered = objectsIds.filter(function(id) {
        //console.log("filtering "+id,objects[id]);
        if(objects[id] == undefined) return false
        return ( AppConfig.HIDDEN_OBJECTS.indexOf(objects[id][AppConfig.OBJECT_TYPE_VARNAME]) == -1 && AppConfig.HIDDEN_OBJECTS.indexOf(objects[id]['typeName']) == -1);
    });
    filtered.sort((a,b) => (objects[a].name.toLowerCase() > objects[b].name.toLowerCase()) ? 1 : ((objects[b].name.toLowerCase() > objects[a].name.toLowerCase()) ? -1 : 0));
   

    return filtered;
  }
)((state, roomId) => roomId)
//-----------------------------------------------------------------


const getObjectsIdsByType = (state,type) => {

    //return [];

    console.log("==========================>   in getObjectsIdsByType",type)
    //const families = {...athomeFamilyTypes,...genericGroupTypes};
    const families = {...athomeFamilyTypes};
    console.log("families",families)
    const showTypes = families[type];  
    const typesAllowed = (showTypes == undefined || showTypes.length == 0) ? [] : showTypes;
   
    
    /* marche avec les type
    let retVal = []
    typesAllowed.forEach(typeItem => {
      retVal = [...retVal,  ...state.objects.objectsByTypes[typeItem]]
    });
    */

    const retVal = typesAllowed.reduce(function(r,v,i){
                      //r.push(state.objects.objectsByTypeNames[v])
                      //console.log("v",v,state.objects.objectsByTypeNames[v])
                      const addThat = state.objects.objectsByTypeNames[v];
                      console.log("typesAllowed >>",addThat)
                      if(addThat == undefined) return r;
                     
                      r.push(...addThat);
                      return r;
                      // may be too much
                      return [...r,...addThat]
                    },[])

    
                    console.log("getObjectsIdsByType",type,retVal)

    //const ids = state.objects.objectsByTypes[type];
    const ids = retVal;
    console.log("typesAllowed",typesAllowed,ids)
    
    /*
    const ids = state.objects.loaded.filter((id) => { 

        if(state.objects.entities.objects[id] == undefined) return false
        let exclude = typesAllowed.indexOf(state.objects.entities.objects[id][AppConfig.OBJECT_TYPE_VARNAME]) != -1;
        return (exclude)
        }).map((id => id));
    */
    return ids;
}
const getObjectsByType = createCachedSelector(
    [getObjects, getObjectsIdsByType, (state, type) => type.replace('-','_')],
    (objects, objectsIds) => {
  
      
     // console.warn("AAA computing getObjectsByType",objectsIds)
      //return []
      var filtered = objectsIds.filter(function(id) {
          //console.log("filtering "+id);
          return ( objects[id] != undefined && AppConfig.HIDDEN_OBJECTS.indexOf(objects[id][AppConfig.OBJECT_TYPE_VARNAME]) == -1 && AppConfig.HIDDEN_OBJECTS.indexOf(objects[id]['typeName']) == -1);
      });
      filtered.sort((a,b) => (objects[a].name.toLowerCase() > objects[b].name.toLowerCase()) ? 1 : ((objects[b].name.toLowerCase() > objects[a].name.toLowerCase()) ? -1 : 0));
     
      console.log('XXXXXXXXXXXXXXXXXX computed Type = ',filtered);
  
      return filtered;
    }
  )((state, type) => type.replace('-','_'))


const expensiveComputation = (allIds,entities,type) => {


  
  const showTypes = athomeFamilyTypes[type];  
  const typesAllowed = (showTypes == undefined || showTypes.length == 0) ? ['Remote_Button','Light','HUE','Application'] : showTypes;
  
  const nids = allIds.filter((id) => { 

      if(entities.objects[id] == undefined) return false
      let exclude = typesAllowed.indexOf(entities.objects[id][AppConfig.OBJECT_TYPE_VARNAME]) != -1;
      return (exclude)
      }).map((id => id));

      console.log('ReReselect : in heavy compuation')

      return nids;

}

const groupSelectByTypeExpensiveComputation = (allIds,entities,type) => {


/*
 const families = {...athomeFamilyTypes,...genericGroupTypes};
    console.log("families",families)
    const showTypes = families[type];  
    const typesAllowed = (showTypes == undefined || showTypes.length == 0) ? [] : showTypes;


*/


  console.log("Select products same family and regular single type (athomeGroupTypes) ",type);
  const families = {...athomeGroupTypes,...athomeFamilyTypes,...genericGroupTypes};
  console.log("families",families)
  const showTypes = families[type];  
  const typesAllowed = (showTypes == undefined || showTypes.length == 0) ? [] : showTypes;
  
  console.log("------> typesAllowed",typesAllowed)

  const nids = allIds.filter((id) => { 

      if(entities.objects[id] == undefined) return false
      let exclude = typesAllowed.indexOf(entities.objects[id]['typeName']) != -1;
      return (exclude)
      }).map((id => id));

      console.log('ReReselect : in heavy compuation ( groupSelectByTypeExpensiveComputation )')

      return nids;

}



const getObjectsByTypesInGroup = createCachedSelector(
  (loaded) => loaded, 
  (loaded,entities) => entities,
  (loaded,entities,type) => type, 
  (loaded,entities,type) => groupSelectByTypeExpensiveComputation(loaded,entities,type)
)(
    // re-reselect keySelector (receives selectors' arguments)
    // Use "libraryName" as cacheKey
    (loaded,entities, type) => type
)

  const getObjectsVisible = createCachedSelector(
    [getObjects,getAllObjectsIds, (state, group) => group],
    (objects, objectsIds) => {
  
      //return []
      var filtered = objectsIds.filter(function(id) {
        //console.log(id," : ",objects[id].flags)
        if(objects[id] == undefined) return false
        if(objects[id].flags != undefined && objects[id].flags.hidden == true) return false;
          return ( AppConfig.HIDDEN_OBJECTS.indexOf(objects[id][AppConfig.OBJECT_TYPE_VARNAME]) == -1 && AppConfig.HIDDEN_OBJECTS.indexOf(objects[id]['typeName']) == -1);
      });
      filtered.sort((a,b) => (objects[a].name.toLowerCase() > objects[b].name.toLowerCase()) ? 1 : ((objects[b].name.toLowerCase() > objects[a].name.toLowerCase()) ? -1 : 0));
     
  
      //console.log("filtered",filtered)

      return filtered;
    }
  )((state, group) => group)







export {getObjectsInRoom, getObjectsByType, getObjectsVisible, getObjectsByTypesInGroup}