import moment from 'moment/min/moment-with-locales';
import i18next from 'i18next';

import { getObjectById } from '_helpers/objects';


export function extractParamFromEcoConfort(parameterList,parmName){
  console.log('EXTRACT_PARAM_IN :', parameterList, parmName);
  let result;
  parameterList.forEach((param) => {
    if(param.name == parmName){
      result = param.value;
    }
  });
    console.log('CHECK_PARAM :', parameterList, parmName, result);
    return result;
}

export function extractMultipleParamFromEcoConfort(parameterList,parmNames){
  const result = parmNames.reduce((acc,key)=>{
    const obj = parameterList.find((param) => param.name == key)
    if(obj) acc[key] = obj?.value
    return acc
  },{})

  return {...parmNames}=result
}

export function getEcoConfortParametersToStore(ecoConfortId){
        const data = getObjectById(ecoConfortId)
        const parameters = data?.parameters ||[]
        const myData = parameters.reduce((acc,item,index)=>{
            acc[item.name] = {name:item.name,value:item.value}
            return acc
        },{})
        return myData
}

export function convertMinutesToHoursMinutes(min){
  const minutes = Number(min);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  let myMinutes = mins < 10 ? `0${mins}` : mins;
  let myHours = hours < 10 ? `0${hours}` : hours;
  console.log('CONVERT_MINUTES :', myHours, myMinutes);
  return `${myHours}:${myMinutes}`
}

export function filterAndKeepOnlyProbes(probes){
        const rightProduct_Name = "ZED-THL2D-HA";
        const myProbes = probes.reduce((acc, item) => {
            const probe = getObjectById(item);
            const realName = probe?.realName;
            const productName = probe?.statusDictionary?.product_name;
            const realNameArray = realName.split(':');
            console.log('PROBE_INFOS :', productName, realNameArray);
            const cluster = "cluster-measurement_illuminance"
            const isProbe = realNameArray.includes(cluster);
            if(isProbe ) acc.push(item);
            //if(isProbe && productName == rightProduct_Name ) acc.push(item);
            return acc;
        }, [])
        return myProbes;
    }

    
function dateToDayOfYear(month, day) {
      // Using moment.js to get the date
      //const date = moment().month(month - 1).date(day).format("DD"); // Moment month is 0-indexed, so subtract 1
      const date = moment(`${month}-${day}`, "M-D")
      // Get the day of the year from moment.js
      const dayOfYear = date.dayOfYear();
      console.log('CHECK_DATE :', dayOfYear);
      return dayOfYear; // dayOfYear() returns the day of the year (1 to 365 or 366)
}

// Function to convert a date (month, day) to a normalized polar angle between 0 and 1
function dateToPolarAngle(month, day) {
  const dayOfYear = dateToDayOfYear(month, day);
  const totalDaysInYear = moment().isLeapYear() ? 366 : 365; // Get total days in the current year using moment

  // Normalize the day to a value between 0 and 1 (angle in the unit circle)
  return dayOfYear / totalDaysInYear;
}

// Function to check if the target date falls within the range using polar coordinates
export function isDateInRange(targetMonth, targetDay, startMonth, startDay, endMonth, endDay) {
  const targetAngle = dateToPolarAngle(targetMonth, targetDay);
  const startAngle = dateToPolarAngle(startMonth, startDay);
  const endAngle = dateToPolarAngle(endMonth, endDay);
  console.log('CHECK_DATE_RANGE :', targetAngle, startAngle, endAngle);

  // Check if the target angle is within the range
  if (startAngle <= endAngle) {
    return targetAngle >= startAngle && targetAngle <= endAngle;
  } else {
    // If the range spans across the year boundary (e.g., from Dec to Jan)
    return targetAngle >= startAngle || targetAngle <= endAngle;
  }
}