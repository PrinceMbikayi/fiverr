
export const getObjectsByIds = state => state.objects.entities.objects;
export const getAllObjects = state => state.objects.entities.objects;

export const getObjectsByEventsName =  state => state.objects.objectsByEventsName;
export const getObjectsByNames = state => state.objects.objectsByNames;
export const getObjectsByRealName = state => state.objects.objectsByRealName;
export const getObjectsByTypes = state => state.objects.objectsByTypes;
export const getObjectsVisible = state => state.objects.objectsVisible;
export const getTypeNameObjects = state =>state.objects.objectsByTypeNames;

export const getPairingDevices = state => state.objects.pairing;

export const getObjectsByTypeName = (state,typeName) => {
    //console.log("Getobject",typeName)
    if(typeName?.indexOf(",") != -1) {
        const tNames = typeName.split(",")
        const mIds = tNames.reduce((r,v,i) => {
                const tn = tNames[i];               
                const tIds = state?.objects.objectsByTypeNames[tn];
                if(tIds == undefined) return r;                
                return [...r,...tIds]
        },[])
        return mIds;
    } else {
        const ids = state?.objects.objectsByTypeNames[typeName] || [];
        //console.log("ids",ids)
        return ids;
    }
    


    
}

export const getObjectsByType = (state,typeName) => {
     console.log("inside state",state,typeName)
    if(typeName?.indexOf(",") != -1) {
        const tNames = typeName.split(",")
        const mIds = tNames.reduce((r,v,i) => {
                const tn = tNames[i];               
                const tIds = state?.objects.objectsByTypes[tn];
                if(tIds == undefined) return r;                
                return [...r,...tIds]
        },[])
        return mIds;
    } else {
        const ids = state?.objects.objectsByTypes[typeName] || [];
        console.log("ids",ids)
        return ids;
    }
    
  
}
//----------------------------------
export const getObjectById = (state,id) => state?.objects?.entities?.objects?.[id];
export const getObjectByIdSimple = (state,id) => state?.objects?.entities?.objects?.[id];

export const getObjectByName = (state,name) => {
    const id = state.objects.objectsByNames[name]?.id;
    return getObjectById(state,id);
}
export const getObjectByRealName = (state,realName) => {
    console.log("realName",realName)
    console.log("--->",state.objects.objectsByRealName)
    const id = state.objects.objectsByRealName[realName];
    return getObjectById(state,id);
}

export const getWidgetReference = (state,id) => {
    //console.log("-->getWidgetReference",id)
    const currentObject = getObjectById(state,id);
    if(currentObject.typeName != 'composite') return  currentObject;
    if(currentObject.components!=undefined && currentObject.components.length > 0) {
        return  getObjectById(state,currentObject.components[0]) 
    }
    return {}
}




export const getObjectRuntimeDatas = (state,id) => state.objects.runtimeDatas?.[id];
export const getDefaultImage = (state,id) =>  state.objects.runtimeDatas?.[id]?.snap || {"uri":"undefined"};
//-----------------------------
export const getUser = state => state.user;
export const getUserDefaultWeather = state => state.user?.defaultWeather;
//---------------------------------
export const getPreviousRoute = state => state.app.previousRoute;

//------------------------------
export const getPushNotificationList = state => state.notificationPush.list;
export const getPushNotificationVdp = state => state.notificationPush.vdp;

//------------------------------
export const getMaintenance = state => state.objects.maintenance;

//export const getRooms = state => state.rooms.entities;

export const getRoomById = (state,roomId)=>{
    //let roomId = 105241 
    const data =[];
    Object.entries(state.rooms.entities).map( ([key,value]) => data.push(value));
    const recovered = data.find(item => item.id === Number(roomId));
    console.log("ROOM WITH ID :", recovered,roomId, data);
    const toReturn = {key:recovered['id'], value:recovered['name']};
    return toReturn;
    
}

//Harold Modif
console.log("Hello YOU")
export const getRooms = (state) => {
    const data =[];
    Object.entries(state.rooms.entities).map( ([key,value]) => data.push(value));
    return data;
};

export const getLoadedObjects = state => state.objects.loaded;


