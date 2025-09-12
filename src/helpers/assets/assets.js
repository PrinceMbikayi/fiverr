// may need update if recycle is not aoowed

import store from "../../store";
import {iconSets} from '_config/AppConfig'



const getStatusesIcons = (id,expectedVal,renderAsTypeName) => {

    const obj = store?.getState()?.objects?.entities?.objects[id] 
    const disguiseType = store.getState().objects?.runtimeDatas?.[id]?.disguiseType;
   
   
   
    let resultArr = [];
    if(obj != undefined && obj.statusImages != undefined) {
        const typeName = renderAsTypeName || disguiseType || obj.typeName;
        //console.log("getStatusesIcons typeName",typeName)
        const sets = iconSets;  
        obj.statusImages.map((i) => {
       
            const {status,iconSet} = i;
            if(obj.statusDictionary == undefined) {               
                return true;
            }
    
            if(obj.statusDictionary[status] == undefined) {              
                return true;
            }
           // forcedStatus
            const statusValue = expectedVal || obj.statusDictionary[status];    
            let iconSetName = typeName+'_'+status;           
            if(sets[iconSetName] == undefined)iconSetName = iconSet;
           
            if(sets[iconSetName] != undefined) {
                const iconImg = sets[iconSetName][statusValue];               
                if(iconImg != undefined && iconImg.indexOf('getfile' !=-1)) {
                    resultArr.push(iconImg)
                }
            }
               
        });
    }
   
    return resultArr
}

const get2ChLightStatusIcon = (statusValue) => {
    return [iconSets['light'][statusValue]]
}

export {
   
    getStatusesIcons,
    get2ChLightStatusIcon
}