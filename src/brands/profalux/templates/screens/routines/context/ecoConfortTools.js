import { getObjectById } from '_helpers/objects';
import configs from '_brand/templates/screens/routines/context/config.json';
import {omit as lodashOmit,pick as lodashPick} from 'lodash'

export const objectKeyPrefix = "myActions";

const getActionName = (objectAction) => {
    return objectAction.split("/").shift()
}


export const extractActionDatas = (objectAction,typeName) => {
        const newActionName = objectAction.split("/").shift();
        const newItemId = objectAction.split("/").pop();
        const objActionToArray = objectAction.split("/");
        const newActionValue = objActionToArray[1];    
        const config = configs[typeName] || [];
        
        const result = {newActionName,newItemId,objActionToArray,newActionValue,typeName,config}
        console.log("----------> extractActionDatas result",JSON.stringify(result))
    return result
}

export const processMyAction = (datas) => {
    console.log('DATAS :', datas);

    const {objectAction, ecoConfGroupActions, typeName} = datas;

    const {newActionName,newItemId,objActionToArray,newActionValue,config} = extractActionDatas(objectAction,typeName);
    const objectKey = objectKeyPrefix + "_" + newItemId
    let myActions = ecoConfGroupActions[objectKey] ? [...ecoConfGroupActions[objectKey]] : []
   console.log("processMyAction (objectAction,myActions) =>", objectAction,myActions)

    // ---- in case no actions Exists
    if(myActions.length == 0) {
        myActions.push(objectAction);
        return {myKey:objectKey,myActions}
    }

    if(config.length == 0) console.error("PROBLEME DANS config.json:  ")

    // ---- in case exact same action exists so deleteIt
    const position = myActions.indexOf(objectAction);
    if(position != -1) {
        myActions.splice(position,1)
        console.log('ACT_1 :', {myKey:objectKey,myActions});
        return {myKey:objectKey,myActions}
    }

    console.log("CONFIG_LENGTH :", config.length)
    // ---- in case objectType has only one sibling group
    if(config.length == 1) {
        console.log('ACT_2 :',{myKey:objectKey,myActions :[objectAction]});
        return  {myKey:objectKey,myActions :[objectAction]}
    }

    // ---- in case objectType has many sibling groups

    const siblingActions = config.reduce((r,v,i) => {
        const actionsString = v.join();
        if(actionsString.indexOf(newActionName) !=-1) {
            r = v;
        }
        return r
    },[]);   
  
   const siblingPosition = myActions.reduce((r,v,i) => {
        const aName = getActionName(v);
        if(siblingActions.indexOf(aName) != -1) {
            r = i;
        }
        return r
   },-1);
   
   if(siblingPosition == -1) {
    console.log('ACT_3 :',{myKey:objectKey,myActions :[...myActions,objectAction]});
    return  {myKey:objectKey,myActions :[...myActions,objectAction]}

   } else {  

        myActions[siblingPosition] = objectAction;
        console.log('ACT_4 :',{myKey:objectKey,myActions});
        return  {myKey:objectKey,myActions}
   }
}


