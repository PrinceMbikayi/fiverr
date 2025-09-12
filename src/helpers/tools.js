import {AppConfig} from '../config';
import { Alert } from 'react-native';

const converterTaskCronTimeToPicker = (value) => {
    const rawTimeArray = value.split(" ").splice(0,3).reverse()
    const recomposedArray = rawTimeArray.reduce(function(r,v,i) {
                                                    if(v.length < 2)v="0"+v;
                                                    r.push(v);
                                                    return r
                                        },[]);   

    return recomposedArray.join(":");
}

const converterTaskSimpleTimeToPicker = (value) => {
    return value.substring(8,10)+":"+value.substring(10,12)+":"+value.substring(12,14)
}
/**
 * formatObjectScheduleTaskTime
 * @param {string | array} taskTime 
 * @returns {object} time aad days
 */
const formatObjectScheduleTaskTime =  (taskTime) => {
    
    let formatedTime;
    let daysList = [];
   
    if(isNaN(taskTime)) {
        // CRON or DELAY
       
        if(taskTime[0] == ('-' || '+')) {
            //DELAY
            formatedTime = taskTime;
        } else {
            //CRON
            formatedTime = converterTaskCronTimeToPicker(taskTime);       
            const daysRawArr = taskTime.split(' ').pop().split(',');
            daysList = daysRawArr.reduce(function(r,v,i){
                r.push(parseInt(v));
                return r
            },[])
        }

        
        
    } else {
        // SIMPLE date           
        formatedTime = converterTaskSimpleTimeToPicker(taskTime)       
    }

    return {time:formatedTime,days:daysList};
}



const buildSchedulerTaskName = (taskType,taskName,objectId,hidden) => {
    const args = { taskType, taskName, objectId,hidden };
    const schedulerTaskName = StrReplaceMultiple(AppConfig.COMMON_STRINGS.schedulerTaskName,args,"{{","}}"); 
    return schedulerTaskName

}
const buildSchedulerTaskEventName = (schedulerTaskName) => {
    const args = {schedulerTaskName};
    const taskEventName = StrReplaceMultiple(AppConfig.COMMON_STRINGS.schedulerTaskEventName,args,"{{","}}"); 
    return taskEventName
}

const StrReplaceMultiple = (str,Obj,prefix,suffix) => {
  
   
    const keyPrefix = prefix || "{";
    const keySuffix = suffix || "}";    
    const reString =  Object.keys(Obj).reduce(function(r, e) {
      r.push(keyPrefix+e+keySuffix)    
      return r;
    }, []).join("|");
    const re = new RegExp(reString, "gi");   
    const retVal = str.replace(re, function(matched) {   
        var cleanedKey = matched.substring(keyPrefix.length,matched.length-(keySuffix.length))      
        return Obj[cleanedKey];  
    
    }); 
   
    return retVal
  }

const findKeyByValue = (obj,val) => {
    for(var i in obj) {
        if(obj[i] == val) return i
    }
    return undefined
}

/**
 * 
 * @param {array} array 
 * @param {string} key 
 */
export function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}
  


export const debugAlert = (title,body) => {
    
    const alertTitle = title || "no title"
    try {
        Alert.alert(
            alertTitle,
             body,
            [{
              text: 'Close'
            }]
          );
    } catch(err) {
        console.log("err",err)
    }
    
}






export {
    converterTaskCronTimeToPicker,
    converterTaskSimpleTimeToPicker,
    formatObjectScheduleTaskTime,
    buildSchedulerTaskName,
    buildSchedulerTaskEventName,
    StrReplaceMultiple,
    findKeyByValue

}

//-----------------------------
