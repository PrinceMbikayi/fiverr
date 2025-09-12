import store from '../store';


import {StrReplaceMultiple,findKeyByValue, sort_by_key} from './tools'
import {deleteObjects as deleteObjectsFromServer,getByName} from '_api/objects';
import {createMultipleScheduleTask,updateParametersOnServer} from '_api/objects';
import {getHeaterSchedule,setHeaterSchedule} from '_services/storage';
import {objectDelete} from '_actions/objects';
/*
    DO NOT USE MOMENT WITH LOCALE HERE
*/
import moment from 'moment';

const heaterSchedulePrefix = "Heat-Sched-";

export const completeHeaterSchedulerPrefix = '__Heat-Sched-';
export const completeHeaterSchedulerSuffix = 'dn-'
// append __ at creation 

export const copyDay = (ranges) => {
    return  ranges.map(i => ({ ...i}))
}

export const copyWeek = (week) => {
    const reduced = week.reduce((r,v,i) => {
        r.push(copyDay(v));
        return r
    }    
    ,[]);
    return reduced
}

const normalizeDay = (day,withDuration) => {
    const separator = '__';
    const normalized = day.reduce((r,v,i) => {
           // r[v.start+'_'+ v.mode] = i;
            r.push(v.start+separator+ v.mode+(withDuration ? separator+moment(v.end, 'hh:mm').diff(moment(v.start, 'hh:mm'),'minutes'): ""));
            return r
    },[])
    return normalized
}



const normalizeWeek = (week,withDuration) => {
    
    const normalized = week.reduce((r,v,i) => {
        r.push(normalizeDay(v,withDuration))
        return r;
    },[])

    return normalized
}

const doSpecialCron = (start,days,noSeconds) => {
    const starTimeSplitted = start.split(":");
    //manage sunday 
    const sundayIndex = days.indexOf(50);
    if(sundayIndex != -1)days.splice(sundayIndex,1,7);
    
    //const retVal = "0"+" "+Number(starTimeSplitted[1])+" "+Number(starTimeSplitted[0])+" ? "+"*"+" "+days.join(",")+" "+"*";
    const specialVal = (noSeconds == undefined) ? " ? ":" * ";
    const retVal = ((noSeconds == undefined)?"0 ":"")+removeZero(starTimeSplitted[1])+" "+removeZero(starTimeSplitted[0])+specialVal+"*"+" "+days.join(",");
    return retVal;
}

const removeZero = (str) => {
    if(str.length == 2 && str.charAt(0) == "0")str = str.substring(1);
    return str;
}
const addZero = (str) => {
    if(str.length == 1)str = "0"+str;
    return str;
}

/*
    thermostat : eco,comfort,comfort-1,comfort-2,frost-free,off
    heater : on,off
    boiler : on:off

*/
export const mappedActions = {
    "eco" : "ECO",
    "comfort" : "COMFORT",
    "comfort-1" : "COMFORT -1",
    "comfort-2" : "COMFORT -2",
    "frost-free" : "HORS-GEL",
    "frost_free" : "HORS-GEL",
    "off":"OFF",
    "on":"ON"
}


const correctDay = (dayIndex) => {
    if(dayIndex < 6) return dayIndex+2;
    if(dayIndex == 6) return 1;
}


export const convertWeekToSchedulerActions = async(week,objectId) => {

    console.log("convertWeekToSchedulerActions",week,objectId)
    //delete existing first 
    await deleteHeaterScheduleTasks(objectId);
    //return true;

    // append __ to taskName in order to hide them in web view
    const __heaterSchedulePrefix = "__"+heaterSchedulePrefix

    //copy week
    let weekCopy = copyWeek(week);
    let dayIndex = 0;
    let normalizedWeek = normalizeWeek(weekCopy);

    
    
    let result = {}
    const nLength = normalizedWeek.length
    while(dayIndex < nLength) {
        while(normalizedWeek[dayIndex].length > 0) {
            let range = normalizedWeek[dayIndex].splice(0,1)[0];
            if(result[range] == undefined)result[range] = [correctDay(dayIndex)]
            for(var i = dayIndex;i < nLength;i++) {
                const rangeIndex = normalizedWeek[i].indexOf(range);
                if(rangeIndex != -1) {
                    
                    result[range].push(correctDay(i));
                    normalizedWeek[i].splice(rangeIndex,1)
                }
            }            
        }

        dayIndex++
    }

   

    //console.log("convertWeekToSchedulerActions Normalized Week result",result)
    
    const actionStr = '{"name":"SCHEDULE","mArgs":[{"name":"date","value":"{{date}}"},{"name":"objectId","value":"{{objectId}}"},{"name":"action","value":"{{actionName}}"}],"oArgs":[{"name":"taskname","value":"'+__heaterSchedulePrefix+'{{objectId}}-{{actionIndex}}"}]}'; 
   // const dateKey = Date.now()+"-" , name may be too long
    //const dateKey = completeHeaterSchedulerSuffix;
    const dateKey = (Number(Date.now().toString().slice(-6))).toString(36);
    const separator = '__';
    
    const reActions =  Object.keys(result).reduce((r,keyName,i) => {
        
            const splitted = keyName.split(separator);
            const date = doSpecialCron(splitted[0],result[keyName]);
            const mode = mappedActions[splitted[1]];
            let str = StrReplaceMultiple(actionStr,{'date':date,'actionName':mode,'objectId':objectId,'actionIndex':dateKey+i},"{{","}}")
            r.push(JSON.parse(str));
            str = "";
            return r;
        },[]);
       // console.log("reActions",reActions)
    return reActions;
     

}
 export const convertWeekToProgParameter = (week,objectId,withNullCron) => {
    let weekCopy = copyWeek(week);
    let dayIndex = 0;
    let normalizedWeek = normalizeWeek(weekCopy,true);

    
    const momentDay = moment().day();
   

    let result = {}
    const nLength = normalizedWeek.length
    while(dayIndex < nLength) {
        while(normalizedWeek[dayIndex].length > 0) {
            let range = normalizedWeek[dayIndex].splice(0,1)[0];
            if(result[range] == undefined)result[range] = [correctDay(dayIndex)]
            for(var i = dayIndex;i < nLength;i++) {
                const rangeIndex = normalizedWeek[i].indexOf(range);
                if(rangeIndex != -1) {
                    
                    result[range].push(correctDay(i));
                    normalizedWeek[i].splice(rangeIndex,1)
                }
            }            
        }

        dayIndex++
    }

    //console.log("convertWeekToProgParameter => result",result);
    let currentAutoMode = "off";
    const currTime = moment().format("HH:mm");
    let currentDay = moment().day()+1;
    
    const separator = "__";
    let reProg =  Object.keys(result).reduce((r,keyName,i) => {
        //console.log("keyName",keyName)
            const splitted = keyName.split(separator);
            const date = doSpecialCron(splitted[0],result[keyName],true); // last arg is needed when no seconds in date and a '*' instead of '?'
            const mode = splitted[1];
            const duration = splitted[2];
            r.push({'cron':date,'value':mode,'duration':Number(duration)});
            
            if(splitted[0] < currTime && result[keyName].indexOf(currentDay) != -1) {
                currentAutoMode = mode;
            } 

            return r;
        },[]);

        //
        if(withNullCron && 1 == 1) {
            reProg.push({cron:null,value:currentAutoMode})
            console.log("reProg",reProg)
        }

    
        
    return reProg;


 }





export const convertToSchedule = (objectId,datas) => {

    console.log("convertToSchedule ");

    const translatedDatas = datas.reduce((r,v,i) => {
        const dateAsArray = v.date.split(" ");
        const days = dateAsArray.pop().split(",");
        const start = addZero(dateAsArray[2])+":"+addZero(dateAsArray[1]);      
        const mode = findKeyByValue(mappedActions,v.action);
        r.push({'start':start,'mode':mode,'days':days})
        return r;
    },[]);

    //console.log("translatedDatas ===>",translatedDatas);
    const reordered = sort_by_key(translatedDatas,'start')

    const result = reordered.reduce((r,v,i) => {
        v.days.map((dv,di) => {
            if(r[dv] == undefined)r[dv] = [];
            r[dv].push ({'start':v.start,'mode':v.mode})
        })
        return r;
    },[[],[],[],[],[],[],[]])

    
    
    const last = result.reduce((r,v,i) => {
        let vl = v.length;

        const dr = v.reduce((rr,rv,ri)=> {
            rv.end = (ri < vl-1) ? v[ri+1].start : "24:00";

            if(rv.end == rv.start)return rr;
            rr.push(rv);
            return rr;
        },[])
        r.push(dr)
        return r;
    },[])

   
    last.splice(0,1); // because day index in kind of cron can't be zero
    const invertedSunday = last.splice(0,1);
    const final = [...last,...invertedSunday]
   // console.log("convertToSchedule final",final)

    return final;

}

export const deleteHeaterScheduleTasks = async(heaterId,dispatch) => {

    const toDeleteArray = getHeatingTasks(heaterId)?.ids || [];  
    if(toDeleteArray.length > 0) { 
       const dispatch = store.dispatch;
            // todo add a delete ids in Object reducer
            toDeleteArray.map((v,i)=> {               
                store.dispatch(objectDelete(v))
            });
        const td = await deleteObjectsFromServer(toDeleteArray);       
    }
    return "ok";
}

export const getHeaterScheduleTasksIds = async(heaterId) => {
  
    const searchId = heaterSchedulePrefix+heaterId;   
    const request = await getByName(searchId).catch((err)=> {console.log('get heaterTasks ids error')});
   
    let ids = []
    if(request.res.status == 200){
        ids = request.res.data.resource.objects.reduce((r,v,i) => {
            r.push(Number(v.uri.split('/').pop()))
            return r
        },[])
    }    //console.log("getHeaterScheduleTasksIds",request,'ids',ids)

    return ids;
}




export const  rangeToPercent = (startTime,endTime) => {
    const timeFormat = 'HHmm';
    let fullDay = "23:59";
    const mStart = moment(startTime,timeFormat)
    const mData = moment(endTime,timeFormat)
    const startDay = moment('00:00',timeFormat);
    const endDay = moment("23:59",timeFormat)
    const retVal = Math.floor(100.0 * (mData.diff(mStart))/(endDay.diff(startDay)));
   //console.log(startTime,endTime,retVal,mode)
    return retVal;

}

export const convertThermostatToSchedule = (itemId,datas) => {
    //console.log("convertThermostatToSchedule ===>",datas);

    const translatedDatas = datas.reduce((r,v,i) => {
        const dateAsArray = ("0 "+v.cron).split(" ");
        //console.log("dateAsArray",dateAsArray)
        if(dateAsArray.indexOf("null") != -1)return r
        if(dateAsArray.length < 3) return r
        const days = dateAsArray.pop().split(",");
        const start = addZero(dateAsArray[2])+":"+addZero(dateAsArray[1]);      
       
        const end = moment(start, 'HH:mm').add(v.duration,'minutes').format("HH:mm")
        const mode = v.value
        r.push({'start':start,'end':end,'mode':mode,'days':days})
        return r;
    },[]);

    //console.log("convertThermostatToSchedule translatedDatas ===>",translatedDatas);

    const reordered = sort_by_key(translatedDatas,'start')

    const result = reordered.reduce((r,v,i) => {
        v.days.map((dv,di) => {
            if(r[dv] == undefined)r[dv] = [];
            r[dv].push ({'start':v.start,'end':v.end,'mode':v.mode})
        })
        return r;
    },[[],[],[],[],[],[],[],[]])

    result.splice(0,1); // because day index in kind of cron can't be zero
    const invertedSunday = result.splice(0,1);
    const final = [...result,...invertedSunday];

    const defaultMode = "off";

    final.map((v,i) => {
                if(v.length > 0) {
                    if(v[0].start > "00:00") {
                        const firstEnd = ""+v[0].end;
                        v.unshift({start:'00:00',mode:defaultMode,end:firstEnd})
                    }
                    if(v[v.length-1].end < "23:59") {
                        const lastStart = v[v.length-1].end;
                        if(v[v.length-1].mode == defaultMode) {
                            v[v.length-1].end = "23:59";
                        } else {
                            v.push({'start':lastStart,'end':'23:59',mode:defaultMode})
                        }
                        
                    }
                }
    },[])


    //console.log("convertThermostatToSchedule final 2",JSON.parse(JSON.stringify(final)))

    return final;
}

export const getHeaterDependencies = (oDatas,allObjects) => {
    //console.log("oDatas.rDependencies",oDatas.rDependencies);
    if(oDatas.rDependencies == undefined) return {};   
    const retVal = Object.keys(oDatas.rDependencies).reduce(function(r,key) {
        r[key] = getDependency(oDatas.rDependencies[key],allObjects);
        return r
    },{}) ;   
    
    return retVal
}
/**
 * return an array of object name
 * @param {*} dependency 
 * @param {*} allObjects 
 */
const getDependency = (dependencyObjects,allObjects) => {

    const reduced = dependencyObjects.reduce((r,v,i) => {          
        const appId = (v.uri.indexOf("/")!=-1) ? v.uri.split('/').pop(): v.uri;
        if(allObjects[appId] != undefined) {
            const appName = allObjects[appId].name;
            r.push(appName);
        }        
        return r
    },[]);
   
    return reduced;
}


export const getCurrentTimeProgramAction = (schedules) => {

    //console.log("schedules",schedules);
    const currentDay = moment().weekday();   
    const schedDay = (currentDay == 0) ? 6 : (currentDay-1)
    //console.log("currentDay",schedDay,moment.weekdays())

    const currTime = ""+moment().format("HH:mm");
    //console.log("currentTime",currTime,schedules[schedDay])
    const progMode = schedules[schedDay].reduce((r,v,i) => {
       //console.log(v.start < currTime)
       
        if(v.start < currTime) {
            r = v.mode;
            return r;
        }
    
        return r;
    },"")
    //console.log("progMode",progMode)
    const reactiveProgMode = mappedActions[progMode];
    //console.log("currentProgMode",reactiveProgMode)
    return reactiveProgMode
}

/**
 * 
 * @param {*} itemId 
 * @param {*} allScheduleTasks 
 * @param {*} allObjects 
 * @returns 
 */
export const getHeatingTasks = (itemId,allScheduleTasks,allObjects) => {

    //console.log("voili",allScheduleTasks,allObjects)
    // be careful if no scheduleTasks return an object same as reduce basis

    const inStoreAllScheduleTasks = allScheduleTasks || store.getState().objects.objectsByTypeNames?.SchedulerTask;
    const inStoreAllObjects = allObjects || store.getState().objects.entities.objects;

    //console.log("inStoreAllScheduleTasks",inStoreAllScheduleTasks);
    //console.log("inStoreAllObjects",inStoreAllObjects)

    const myHeatingTasks = (inStoreAllScheduleTasks == undefined) ? {descriptions:[],ids:[]} : inStoreAllScheduleTasks.reduce((r,v,i) => {
        if(inStoreAllObjects[v]) {
            const description = inStoreAllObjects[v].description;               
            if(description && description.objectId == (""+itemId)) {
                r.descriptions.push(description);
                r.ids.push(inStoreAllObjects[v].id)                    
            }
        }
    
        return r
    },{descriptions:[],ids:[]});
    //console.log("myHeatingTasks",myHeatingTasks);
    return myHeatingTasks
}



/**
 * 
 * @param {*} objectId 
 * @param {*} objectType 
 * @param {*} weekDatas 
 */
export const saveSchedulesOnServer = async(objectId,objectType,weekDatas) => {

    switch(objectType) {

        case "athome_thermostat" :
            const parameters = {'prog':convertWeekToProgParameter(weekDatas,objectId,1)};
            
            //console.log("saveSchedulesOnServer > athome_thermostat : ",parameters,JSON.stringify(parameters))
            const doUpdateParameters = await updateParametersOnServer(objectId,parameters).catch(err => console.log(err));
            break;
        default :
            /* AtHomeWirePilot or Heater or Boiler */
            // with await 
            //console.log("weekDatas",weekDatas);
            console.log("saveSchedulesOnServer 1");
            //const savedDatas = await setHeaterSchedule(objectId,weekDatas);
            //console.log("savedDatas",savedDatas);
            console.log("saveSchedulesOnServer 2");
            const actions = await convertWeekToSchedulerActions(JSON.parse(JSON.stringify(weekDatas)),objectId);
            console.log("saveSchedulesOnServer 3");
            //console.log("actions",actions);
            createMultipleScheduleTask(actions);
            console.log("saveSchedulesOnServer 4");

            
           /*
            setHeaterSchedule(objectId,weekDatas).then(() => {
                convertWeekToSchedulerActions(JSON.parse(JSON.stringify(weekDatas)),objectId).then(() => {
                    createMultipleScheduleTask(actions);
                })
            })
            */
            console.log("fini")

            break;
    }       
}
