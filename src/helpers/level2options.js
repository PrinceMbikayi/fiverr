import * as ObjectHelpers from './objects';
import * as ScenarioHelpers from './scenarios';
import {getObjectByName} from './objects';

export const getSwitchInitialStatus = (scenarioId) => {

    const scenarioDatas = ObjectHelpers.getObjectById(scenarioId);   
    const actions = scenarioDatas.scriptActions.reduce(function(r,v,i){
        if(v.type == 'call')r.push(v.action)
        return r
    },[])
    return actions;
}

export const initSwitches = (scenarioId,actionsSwitchesModel) => {

    let actionsSwitches = {...actionsSwitchesModel}
    //console.log("initSwitches",actionsSwitches);
    const actions = getSwitchInitialStatus(scenarioId);  
      actions.map(function(v,i) {
          const actionName = v;
            Object.keys(actionsSwitches).map(function(k,j) {
             
                if(actionsSwitches[k].actionNames.indexOf(actionName)!= -1){
                  actionsSwitches[k].value = (actionName.indexOf('ON') != -1) ? true : false;
                }
          });
        });
    return actionsSwitches;
}

export const  saveOptions = async (objectId,taskName,timeSelection,days,scriptActions) => {
 
    console.log("saveOptions => ","objectId",objectId,"taskName",taskName,"timeSelection",timeSelection,"days",days,"scriptActions",scriptActions)

    const onEventScheduleTask = (timeSelection.event != undefined)
    const recurrence = !(days.length == 0 || days.join() == "0,0,0,0,0,0,0");   
    let scenarioRealName = "association/id-"+objectId+"/";
   
   const suffixArr = taskName.split('-');
   suffixArr.pop();

    scenarioRealName+= suffixArr.join('-');
    let scenarioName = "tas "+objectId+' '+suffixArr.join('-');
    scenarioName = scenarioName.replace(/\//g," ");
    //scenarioName = scenarioName.split(" ").join("/");
    console.log("scenarioRealName",scenarioRealName,"scenarioName",scenarioName);
    
    let date;
    let retVal;

    if(!onEventScheduleTask) {
        // Based on Time 

        const timeValue = timeSelection?.time || timeSelection || '00:00';
        if(!recurrence) {

            // attention si delay
            if(timeValue.charAt(0) == "+") {
                // it's a delay
                //console.log("it's a delay");
                date = timeValue
            } else {
                // it's a regular time value
                //console.log("it's a regular dateTime");
                const d = new Date();
                date = d.getFullYear() + (((d.getMonth()+1) < 10) ? "0" : "") + "" + (d.getMonth()+1) + ((d.getDate() < 10) ? "0" : "") +d.getDate();
                date += timeValue.split(':').reduce(function(r,value,index){return r+((Number(value) < 10) ? "0" : "") +Number(value)},"")
            }
            
                        
        }  else {
            date = timeValue.split(':').reverse().join(" ")+" ? "+" * "+days.join(",")  ; 
        }


        // ok below
        //const createdTask = await ScenarioHelpers.setObjectSchedulerTasks([[objectId,taskName,scenarioName,scriptActions,date]])

        let scenario = getObjectByName(scenarioName);
        if(scenario == undefined){
            scenario = getObjectByName( scenarioName.split(" ").join("/"));
        }
       

        // before donkey only scenarioName was mandatory and sufficent
        let scenarioId = getObjectByName(scenarioName);
        if(scenarioId == undefined){
            scenarioId = getObjectByName( scenarioName.split(" ").join("/"));
        }       
          
        const params = { objectId,taskName,scenarioName,scriptActions,'date':date, 'scenario':scenarioId};
        const  createdTask = await ScenarioHelpers.setObjectSchedulerTasks([params]);
        retVal = {status:'ok'}

        if(isNaN(Number(createdTask))) {
            //this.taskCreationErrorAlert();
            retVal = {status:'error'}
        }

        return retVal
    } else {
        // Based on Event (sunrise or sunset)
        // done before !!!
        //if(this.checkWeather(timeSelection.weatherId) == false)return false // end process
        date = days.join(",");           
        const {weatherId,event,offset} = timeSelection;
       // [objectId,taskName,scenarioName,scriptActions,date,weatherId,event,offset]
        const wParams = {objectId,taskName,scenarioName,scriptActions,date,weatherId,event,offset}
        const createdTaskWeather = await ScenarioHelpers.setObjectSchedulerTasks([wParams])
        retVal = {status:'ok'}
        if(isNaN(Number(createdTaskWeather))) {
            //this.taskCreationErrorAlert();
            retVal = {status:'error'}
        }
        return retVal;    
    }
}

//---------- callbacks ---------------------
export const onSwitchToggle = async (switchId,context) => {       
    let switchState = {}
    switchState[switchId] = {...context.state.actionsSwitches[switchId]};       
    switchState[switchId].value = !switchState[switchId].value;
    const allSwitchesStatesUpdated = {...context.state.actionsSwitches, ...switchState}       
    await context.setState({actionsSwitches:allSwitchesStatesUpdated})
    return "ok"
}

export const onDaysCallbackChange = (newDays) => {
    
    // This  croned return an array of indexes 
        // - incremented by 2 if it position is filled with 1.
        // - removes index for whitch the value position is 0.
        // exp1 :  croned([1,1,1,1,1,1,1]) => [2,3,4,5,6,8] 
        // exp2 :  croned([0,0,0,0,0,0,1]) => [8] 
        // exp3 :  croned([0,0,0,0,0,0,0]) => [] 
    let croned = newDays.reduce(function(r, value,index) {           
        if (value == true) r.push(index+2)
        return r;
      }, []);

      const isSundayInsidePos = croned.indexOf(8); // check if the value 8 exists in crones : if yes returns its index position, else return -1
      if(isSundayInsidePos != -1) { // ie 
          croned.splice(isSundayInsidePos,1)
          croned.push(1)
      }

      console.log("WHY THIS CRONED ? ", croned)
     return croned
}


export const getTaskDescription = (datas) => {

    const resp = datas?.statusDictionary?.__json_description || datas?.description || {}
    console.log("resp",datas,resp)
    return resp;

}