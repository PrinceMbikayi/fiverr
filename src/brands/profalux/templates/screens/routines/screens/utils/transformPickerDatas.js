import '_brand/templates/screens/routines/locales'
import {withTranslation} from 'react-i18next';
import i18n from "i18next";
import React from 'react';
import { getObjectById, getObjectByName } from '_helpers/objects';


const hasValue = (obj, value) => Object.values(obj).includes(value);
const hasKey = (obj, key) => Object.keys(obj).includes(key);


export function extractPickerDatas(data){
    let trigger = {};
    console.log("COUCOU_PICKER_DATA_IN :", data)
    const isWeatherEvent = hasKey(data, "offset")

    if(isWeatherEvent){
        const triggerObj = { 
            type: 'event', 
            sourceId: data?.weatherId,
            event: data?.event,
            offset: data?.offset
        }
        trigger = triggerObj

    }else{
        const timeArray = (data?.time).split(":")
        const hour = Number(timeArray[0])
        const minute = Number(timeArray[1])
        const triggerObj = { type: 'time', hour: hour, minute: minute }
        trigger = triggerObj
    }

    console.log("COUCOU_PICKER_DATA_OUT :", trigger)
    return trigger;

}

export function constructOArgs (trigger){
    let oArgs;
    const isWeatherEvent = hasKey(trigger, "offset")

    console.log("CONSTRUCT_OARGS_ACTION :", trigger)
    if(isWeatherEvent){
        const weatherId = trigger?.sourceId
        const event = trigger?.event
        const offset = trigger?.offset
        oArgs = [
            {"name":"event","value":event},
            {"name":"sourceId","value":weatherId},
            {"name":"offset","value":offset}
        ]

    }else{
        console.log('YO_TE :', trigger);
        const h = trigger?.hour
        const m = trigger?.minute
        let hour, minute;
        hour = h != undefined ? h : "12";
        minute = m != undefined ? m :"00"
        console.log("CHECK_3 :", hour, minute)
        oArgs = [
            {"name":"hour","value":hour},
            {"name":"minute","value":minute}
        ]
    }
    return oArgs
}

export function ExtractTime (trigger){
    const tns = "routine";
    let time;
    let sign;
    let myEvent;
    const isWeatherEvent = hasKey(trigger, "offset")
    console.log("CONSTRUCT_OARGS_ACTION :", trigger)
    if(isWeatherEvent){
        const event = trigger?.event
        const offset = trigger?.offset

        event == "sunrise" ? myEvent = `${i18n.t(tns + ":" + "SUNRISE")}` : myEvent = `${i18n.t(tns + ":" + "SUNSET")}`
        if(offset > 0){
            sign = "+"
            time = `${myEvent} ${sign} ${Math.abs(offset)}mn` 
        }else if(offset < 0){
            sign= "-"
            time = `${myEvent} ${sign} ${Math.abs(offset)}mn`
        }else{
            sign = ""
            time = `${myEvent}`
        }

        //time = `${myEvent} ${sign} ${offset!=0 && Math.abs(offset)}mn` 

    }else{
        console.log('temps :', trigger?.hour, trigger?.minute);
        const h = trigger?.hour || 12
        const m = trigger?.minute || 0
        let hour = h < 10 ? "0"+h : h;
        let minute = m < 10 ? "0"+m : m
        console.log("CHECK_3 :", hour, minute)
        time = `${hour}h${minute}` || "12:00"
    }
    return time
}

export function buildPlannerAction(){
    let plannerAction;


    return plannerAction
}


function padToTwoDigits(num) {
    return num.toString().padStart(2, '0');
  }

function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;  return `${padToTwoDigits(hours)}:${padToTwoDigits(minutes)}`;
  }

const findTimeWithOffset = (event, weatherId, offset)=>{
    const weatherDatas = getObjectById(weatherId)
    console.log('WEATHER_ID :', weatherId);
    const weatherEvent = weatherDatas?.statusDictionary?.[event]
    const timeArray = weatherEvent ? weatherEvent.split(":") : ['00', '00']
    const TimeInMinute = Number(timeArray[0])*60 + Number(timeArray[1]);
    const timeWithOffset = TimeInMinute + offset
    const timeInFormatHourMinutes = toHoursAndMinutes(timeWithOffset);
    console.log("WEATHER_DATA_SUNSERT, SUN_RISE:", weatherEvent)

    return timeInFormatHourMinutes;
}


export const addZeroOnTheLeft =(value)=>{

    let convertValue;
    console.log('CHECK_13H_o:', value);
    if(Number(value)==0){
        convertValue = "0"+value;
    } else if(Number(value)<10){
        convertValue = "0"+value
    }else{
        convertValue =  value
    }
    return convertValue
} 
export const addStringZeroOnTheLeft =(value)=>{

    let convertValue;
    console.log('CHECK_13H_o:', value);
    if(value=="00" || Number(value)==0){
        convertValue = value;
    } else if(Number(value)<10){
        convertValue = "0"+value
    }else{
        convertValue =  value
    }
    return convertValue
} 


export function extractPlannerTime(trigger){
    console.log("COUCOU_PICKER_trigger :", trigger);
    let plannerTime;
    const isWeatherEvent = hasKey(trigger, "offset")

    if(isWeatherEvent){
        const weatherEvent = trigger?.event;
        const weatherId = trigger?.sourceId;
        const offset = trigger?.offset
        let sign;

        // if(offset < 0) plannerTime = `${weatherEvent} - ${Math.abs(offset)} mn`
        // if(offset > 0) plannerTime = `${weatherEvent} + ${offset} mn`
        // if(offset == 0) plannerTime = `${weatherEvent}`

        //console.log("CHECK_1 :", plannerTime)
        plannerTime = trigger
        //plannerTime = findTimeWithOffset(weatherEvent, weatherId, offset)
        //console.log("CHECK_PLANNER_TIME :",plannerTime)
    }else{
        const hour =  trigger?.hour;
        console.log('CHECK_13H:',!isNaN(13));
        const minute = trigger?.minute
        const myHour = addZeroOnTheLeft(hour)
        const myMinute = addZeroOnTheLeft(minute)

        plannerTime = trigger
        //plannerTime = `${myHour}:${myMinute}`
    }
    console.log("CHECK_PLANNER_TIME :",plannerTime)

    return plannerTime
}