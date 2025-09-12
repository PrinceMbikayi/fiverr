import store from "../store"; /* see link below */
/* https://www.reddit.com/r/reactjs/comments/avekwi/access_the_redux_store_outside_a_react_component/ */

import * as ApiObjects from '../api/objects';
import * as ObjectHelpers from './objects';
import * as Tools from './tools';
import {updateFlags} from '_actions/objects';
import { Api } from '_api';
import { objectUpdateProperty, updateStatus as updateStatusAction } from '_actions/objects';


// ANCHOR schedulerTasks

const getScheduleTaskDays = (taskTime) => {
    return Tools.formatObjectScheduleTaskTime(taskTime).days
}

const getObjectScheduleAction =  (objectId) => {
    const taskSchedule =  checkTaskExists( "Task-Schedule-"+objectId,objectId,"object");
    return taskSchedule;
}

const formatObjectScheduleTaskTime =  (taskTime) => {      
    return Tools.formatObjectScheduleTaskTime(taskTime).time;    
}


const checkTaskExists =  (nameToCheck,objectId,type) => {

    const eventName = 'event/scheduler/task/'+nameToCheck+'/';     
    const taskExistsId = ObjectHelpers.getObjectByEventName(eventName);   
    if(taskExistsId == undefined)return -1

    const taskExists = ObjectHelpers.getObjectById(taskExistsId);    
    const retVal = (type == undefined) ? taskExists.id : taskExists;

    return retVal;
    
}

/**
 * 
 * @param {*} arr an array of array [taskType,taskName,objectId,title]
 * 
 */
const getObjectSchedulerTasks = (arr) => {
   
    let retVal = {};
    const isHidden = {true:{'hidden':"__"},false:{'hidden':""}}
    arr.map(function(value,index){
       
        let taskTime = '00:00:00';
        let taskDays = [0,0,0,0,0,0,0];
        let activated = true;
        //const expanded = [...value,"__"]
        const expanded = [value[0],value[1],value[2],"__"];
        const title = value[3];
        
        //const expanded = [...value,""]
        const taskName = Tools.buildSchedulerTaskName(...expanded);
        const taskEventName = Tools.buildSchedulerTaskEventName(taskName); 
        let taskId = ObjectHelpers.getObjectByEventName(taskEventName);        

        let task;
        let taskObjectId;
        let description;
        
        if(taskId != undefined && 1 == 1) {            
            task = ObjectHelpers.getObjectById(taskId);            
            let taskDescription = task?.description || task?.statusDictionary?.__json_description || undefined;
            if(typeof taskDescription == "string")taskDescription = JSON.parse(taskDescription)



            if(taskDescription!= undefined) {
                taskTime = formatObjectScheduleTaskTime(taskDescription.date)   
                taskDays =  getScheduleTaskDays(taskDescription.date); 
                if(taskDescription.days)taskDays=taskDescription.days.split(",")
                //activated = (task.flags && task.flags.deactivated !== true);
               
                const isDeactivated = (task?.flags?.deactivated);
                activated = (isDeactivated == undefined) ? true : !isDeactivated;
                taskObjectId = taskId;
                description = taskDescription;
            }         
           
        }  
        //console.log("description")    
        retVal[value[1]] = {    
                                'title':title,
                                'name':taskName,
                                'eventName':taskEventName,
                                'taskTime':taskTime,
                                'taskDays':taskDays,
                                'object':task,
                                'activated': activated,
                                'taskObjectId':taskObjectId,
                                'description': description
                            };
       
    })
    //console.log("retVal",retVal)
    return retVal

}
//------------------------------------------------

const setObjectSchedulerTasks = async(arr) => {


    let allPromises = await Promise.all(arr.map(async(value,index)=>{       
        const {objectId,taskName,scenarioName,scenarioId,scriptActions,date,weatherId,event,offset} = value;
        console.log("VALUE  ::::::", value)

        /*
        const objectId = value.objectId;
        const taskName = value.taskName;
        const scenarioName = value.scenarioName;
        const scriptActions = value[3];
        const date = value[4];
        // below args only needed for weather SCHEDULE
        const weatherId = value[5];
        const event = value[6];
        const offset = value [7];   
        */
        
        const createdScenarioId = await _createScenarioIfNeeded(objectId,scenarioName,scriptActions).catch((err) => {console.log("erreur _createScenarioIfNeeded",err)});
        console.log("apres createdScenarioId",createdScenarioId)
        //const createdScenarioId = {id:scenarioId};
        const creationScheduleTask = await ApiObjects.createSchedulerTask({objectId,taskName,scenarioName,scenario:createdScenarioId?.id,date,weatherId,event,offset});
        console.log("creation après creation Scenario",creationScheduleTask);
        if(creationScheduleTask.errCode == 200)return 200;
        console.log("creationScheduleTask",creationScheduleTask);
        return creationScheduleTask;
        // aucun intérêt  me retourne le scheduler console.log("task creation",creation)
    }));

    return allPromises;


}


//----BEGIN--#####-------- Harold adaptation
const setObjectSchedulerTask = async(arr) => {

    let allPromises = await Promise.all(arr.map(async(value,index)=>{       
        const {objectId,taskName,scenarioName,scenarioId,scriptActions,date,weatherId,event,offset} = value;
        console.log("VALUE  ::::::", value)

        
        const createdScenarioId = await _createScenarioIfNeeded(objectId,scenarioName,scriptActions).catch((err) => {console.log("erreur _createScenarioIfNeeded",err)});
        console.log("apres createdScenarioId",createdScenarioId)
        //const createdScenarioId = {id:scenarioId};
        const creationScheduleTask = await ApiObjects.createSchedulerTask({objectId,taskName,scenarioName,scenario:createdScenarioId?.id,date,weatherId,event,offset});
        console.log("creation après creation Scenario",creationScheduleTask);
        if(creationScheduleTask.errCode == 200){
            const taskCreated = creationScheduleTask?.res?.data?.resource?.statuses[0]
            const taskAndAssociateScenario = {errCode:200, taskId:taskCreated.value, scenarioName:scenarioName, scenarioId:createdScenarioId?.id }
            console.log("creationScheduleTask::::::::",taskAndAssociateScenario);
            return taskAndAssociateScenario;
        }
        return creationScheduleTask;
        // aucun intérêt  me retourne le scheduler console.log("task creation",creation)
    }));

    return allPromises;

}


// weatherId,event,offset
const createObjectSchedulerTask = async(objectId,taskName,scenarioName,scenarioId,scriptActions,date) => {
 
        const createdScenarioId = {id:scenarioId};
        const creationScheduleTask = await ApiObjects.createSchedulerTask({objectId,taskName,scenarioName,scenario:createdScenarioId?.id,date});
        console.log("creation après creation Scenario",creationScheduleTask);
        if(creationScheduleTask.errCode == 200){
            const taskCreated = creationScheduleTask?.res?.data?.resource?.statuses[0]
            const taskAndAssociateScenario = {errCode:200, taskId:taskCreated.value, scenarioName:scenarioName, scenarioId:createdScenarioId?.id }
            console.log("creationScheduleTask::::::::",taskAndAssociateScenario);
            return taskAndAssociateScenario;
        }
        return creationScheduleTask;
        // aucun intérêt  me retourne le scheduler console.log("task creation",creation)


}
//----END--#####-------- Harold adaptation

const setTaskActivated = async(taskId,state) => {
    const updatedFlags = {'deactivated':!state}
    const res = await ApiObjects.updateObjectFlags(taskId,updatedFlags);
    console.log("setTaskActivated done",res)
    console.log("taskId",taskId)
    store.dispatch(updateFlags(taskId,updatedFlags));
    return res;
}

//---------------------------------------------------------------------------------------

// ANCHOR Scenario

const expectedScenarios = { 
    "AtHomeLight" : {
        "ON" : {},
        "OFF" : {}
    }
}

const getObjectAllSchedulerTasks = async(objectId) => {
    const objectsArray = await ObjectHelpers.getUses(objectId);

    const schedulerTasks = objectsArray.reduce(function(r,value,index){
            if(value.resource.className == "SchedulerTask")r.push(value.resource);
            return r
    },[]);

   
    schedulerTasks.map(function(value,index){
        console.log("realName",value.realName,value.description)
    })
}


const getObjectScenarios = async (objectId) => {   

    const {scenarios,name,typeName} = ObjectHelpers.getObjectDatas(objectId,['scenarios','name','typeName'])

    if(scenarios != undefined ) {
        return scenarios
    } else {
        const objectsArray = await ObjectHelpers.getUses(objectId);
        let existingScenarios = [];
       
        const objectExpectedScenarios = expectedScenarios[typeName];
        /*
            scenario realName exemple = 'scenario/12345/ON'
        */
        const _scenarioPrefix = 'association';

       const getActionName = (s) => {
           return s.split('/').pop();
       }
       /**
        * 
        * @param {*} realName 
        */ 
       const checkRealName = (realName) => {
            
            if(realName.indexOf(_scenarioPrefix) != 0) return false;
            const actionName = getActionName(realName)
            if(objectExpectedScenarios[actionName] == undefined) return false;
            return true;
        }   

        let mandatoryScenarios = {};  
        
        const objectScenariosArray = objectsArray.filter(object => {
                return (object.resource.className == "Scenario"  && checkRealName(object.resource.realName))
            }).map( (item) => {           
                const actionName = getActionName(item.resource.realName);           
                mandatoryScenarios[actionName] = {id:item.resource.id,realName:item.resource.realName}
            });
       
       
            
        var toCreateScenarios = Object.keys(objectExpectedScenarios).reduce(function(r, e) {
           
            if (mandatoryScenarios[e] == undefined) r.push(e)
            return r;
          }, [])

        if(toCreateScenarios.length  > 0) {
           
            let done = {}
            await Promise.all(toCreateScenarios.map(async action => {
                let newS = await createObjectScenarios(objectId,action)
                //console.log("newS",newS);
                done[action] = newS
            }));

          console.log("await creation new Scenario fini",done);
        }
      
        return mandatoryScenarios
    }
    
}




const createObjectScenarios = async (itemId,actionName) => {

    return ApiObjects.createScenario(itemId,actionName);
}


const _createScenarioIfNeeded = async(objectId,scenarioName,scriptActions) => {

    const scenarioExists = ObjectHelpers.getObjectByName(scenarioName) // an id
    // delete by default
    let scenarioId = ObjectHelpers.getObjectByName(scenarioName) // an id
    // double check seems name structure changed in donkey
    if(scenarioId == undefined) {
        scenarioId = ObjectHelpers.getObjectByName(scenarioName.split(" ").join("/"))
    }
    //console.log("Check scenario Exists ("+scenarioName+") ? ",scenarioId)
    console.log("_createScenarioIfNeeded :",scenarioExists,scenarioName,scenarioId);

    if(scenarioId != undefined) {
        //console.log("------------------> delete scenario :"+scenarioName+"("+scenarioId+")")
        await ApiObjects.deleteObject(scenarioId)
    }
    // create or recreate
  
    const toCreate = await ApiObjects.createScenario(objectId.toString(),scenarioName,scriptActions);
    if(toCreate.errCode == 200){
        // Api.addStatus(toCreate.id, "__user_scenarioNature", 'custom');
        // Api.addStatus(toCreate.id, "__user_test", 'test');
        // const actionCreated = updateStatusAction(toCreate.id, "__user_scenarioNature", 'custom')
        console.log("Scenarion Created at this level  ::::::",toCreate)
    }
    /*
        return value example : 
        {
            errCode: 200,
            id: 469779,
            res: {data: {…}, status: 200, statusText: undefined, headers: {…}, config: {…}, …}
        }

    */
    return toCreate; 

}

const setScenarioNotification = async (scenarioId,active,title,text) => {
    // get object
    const scenario = ObjectHelpers.getObjectById(scenario);
    let scriptActions = [...scenario.scriptActions];
    // first we ermoive notify action
    let newScriptActions = scriptActions.reduce(function(r,v,i){
                if(v.type != 'notify')r.push(v);
                return r
        },[])
    // then we add it if necessary
    if(active) {
        newScriptActions.push({type: "notify", severity: "WARNING", title: title, text: text})
    }

    // if update is allowed
    return await ApiObjects.updateScenario(scenarioId,newScriptActions)

    // if not, a destroy, create process could be applied

}
// ANCHOR export
export {
    
    getObjectScenarios,
    getObjectAllSchedulerTasks,
    createObjectScenarios,   
    getObjectScheduleAction,
    getScheduleTaskDays,
    getObjectSchedulerTasks,
    setObjectSchedulerTask,
    setObjectSchedulerTasks,
    setTaskActivated,
    formatObjectScheduleTaskTime,
    setScenarioNotification,
    createObjectSchedulerTask
    
}