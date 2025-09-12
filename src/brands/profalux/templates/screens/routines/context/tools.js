import { getObjectById } from '_helpers/objects';
import configs from '_brand/templates/screens/routines/context/config.json';
import {omit as lodashOmit,pick as lodashPick} from 'lodash'

export const objectKeyPrefix = "myActions";

const getActionName = (objectAction) => {
    return objectAction.split("/").shift()
}


export const extractActionDatas = (objectAction) => {
        const newActionName = objectAction.split("/").shift();
        const newItemId = objectAction.split("/").pop();
        const objActionToArray = objectAction.split("/");
        const newActionValue = objActionToArray[1];

        const objectData = getObjectById(Number(newItemId));
        const typeName = objectData?.typeName;
        const actionsAvalaible = objectData?.actions;// get Disponible action in the object given by server

        console.log("DIFF_ACTIONS :", actionsAvalaible)
        const config = configs[typeName] || [];
       
        const result = {newActionName,newItemId,objActionToArray,newActionValue,typeName,config,actionsAvalaible}


       console.log("----------> extractActionDatas result",JSON.stringify(result))
        return result
}

export const processMyAction = (datas) => {

    const {objectAction,actionsByItemId} = datas;

    const {newActionName,newItemId,objActionToArray,newActionValue,typeName,config} = extractActionDatas(objectAction);
    const objectKey = objectKeyPrefix + "_" + newItemId
    let myActions = actionsByItemId[objectKey] ? [...actionsByItemId[objectKey]] : []
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


export const saveMyActions = (actionsByItemId) => {    
    console.log(" CHECK_MY_ACTIONS My_Scripts etat-1:", actionsByItemId)
    const result  = convertToScriptContent(actionsByItemId);  
    console.log("----------------> saveMyActions_result <------------------\n",JSON.stringify(result))  
    return  result         
}


const convertToScriptContent = (actionsByItemId) => {
    console.log('CHECK_ME_actionsByItemId :', actionsByItemId);
    let result = []
    Object.entries(actionsByItemId).map(([k,v],i) => {      
        console.log('CHECK_ME_actionsByItemId_IN_V :',v);  
        v.map((vu)=> {
            const {newActionName,newItemId,newActionValue,config,actionsAvalaible} = extractActionDatas(vu); 
            const  actionsObject = actionsAvalaible.reduce((rr,vv,ii) => {
                
                console.log('CHECK_ME_actionsByItemId_IN :',newItemId, vv);        
                if(newActionName == vv.name) {
                    const filtered =  lodashPick(vv,['mArgs']); //objfilterKeep(vv,"mArgs");                   
                    let objReturned = {"action":newActionName,"objectId":newItemId, "type": "call"};
                    console.log('OBJECT_RETURN :',objReturned);        
                    if(filtered.mArgs) {
                        mArgsFiltered = filtered.mArgs.reduce((r4,v4,i4)=> {
                                r4.push({...lodashOmit(v4,['min','max']),'value':newActionValue});
                                return r4;
                        },[])
                        objReturned['mArgs'] = mArgsFiltered;
                    }                
                    rr.push(objReturned);                 
                }
                return rr
            },[]);
            result = [...result,...actionsObject]
            })
        }); 
        console.log('CHECK_ME_actionsByItemId_OUT :', result);
    return result
}


