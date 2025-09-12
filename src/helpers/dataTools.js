
import { get as lodashGet} from 'lodash';

//state must be passed with params in methods

const objectRootPath = 'objects';

//-----------------------------------------------
const dataGetAllObjects = (state) => {
    return   lodashGet(state,'objects.entities.objects');
}
const dataGetObjectsIds = (state) => {
  return lodashGet(state,'objects.loaded');
}
//-------------------------------------------------
const dataGetObject = (id,state) => {
   
    return   lodashGet(state,'objects.entities.objects.'+id);
}

//--------------------------------------
const dataGetObjectsByTypeName = (state,typeName) => {
    return lodashGet(state,'objects.objectsByTypeNames.'+typeName);

}
//--------------------------------------
const dataGetObjectIdByEventName = (state,eventName) => {
    return lodashGet(state,'objects.objectsByEventsName.'+eventName)
   
}
//----------------------------------------
const dataGetObjectsByType = (state,type) => {
    return lodashGet(state,'objects.objectsByNames.'+type)
}
//----------------------------------------
const dataGetObjectsVisible = (state) => {
  return lodashGet(state,'objects.objectsVisible');
}
//--------------------------------------
const dataGetAtHomeGateway = (state) => {

   
    const gatewaysIds = dataGetObjectsByTypeName(state,'Gateway') || [];  
    const gateways = gatewaysIds.reduce(function(r,v,i){
                    r.push(dataGetObject(v,state));
                    return r;
    },[])  
    console.log("gateways =>",gateways);  
    let atHomeGateway = "";
    for(i in gateways) {
      if(gateways[i].name ) {
        if(gateways[i].name.indexOf('AtHome') != -1){
          atHomeGateway = gateways[i].name;
          break;
        }
      }
      if(gateways[i].realName ) {
        if(gateways[i].realName.indexOf('AtHome') != -1){
          atHomeGateway = gateways[i].realName;
          break;
        }
      }
    }
    return atHomeGateway;
  }
//---------------------------------------------------

export {
    dataGetAllObjects,
    dataGetObject,
    dataGetObjectsByTypeName,
    dataGetObjectIdByEventName,
    dataGetAtHomeGateway,
    dataGetObjectsVisible,
    dataGetObjectsIds
}

//-----------------------------
