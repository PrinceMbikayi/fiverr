import '_brand/templates/screens/routines/locales';
import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View} from 'react-native';
import { useTranslation } from 'react-i18next';
import {findDayWithTranslation, capitalizeFirstLetter} from '_brand/templates/screens/routines/components/utils'
import { ExtractTime} from '_brand/templates/screens/routines/utils/transformPickerDatas'
import { useTheme } from '_theming/themeProvider'
import {ConfiguredProgram} from '_brand/templates/screens/routines/components/ConfiguredProgram'

const myday = findDayWithTranslation(7)
console.log('MY_DAY :', myday);


export const ShowPlanningInfos = (props)=>{
    const {routineId, data} = props;

    const [myData, setMyData] = useState([]);
    const [confProgram, setConfProgram] = useState([]);

    const { t, i18n } = useTranslation();
    const tns = "routine";

    const { theme } = useTheme();

    const borderColor = theme?.prflxBorderColor || 'orange';
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";

    // takes an array of objects and the name of a property of these objects
const groupBy = (array, property, propertyToreturn) => array.reduce((grouped, element) => (
    {
    ...grouped,
    [element[property]]: [...(grouped[element[property]] || []), element[propertyToreturn]]
    //[element[property]]: [...(grouped[element[property]] || []), element]
  }
), {})
  
function compareNumbers(a, b){
    return a - b;
}

    useEffect(()=> {
        const tempData = []
        const configArray =[]
        data.map((item,idx)=>{
            if(item.id == routineId){
               const myData = item?.elements;
               //const mySortData = myData.sort((item_i, item_j) => item_i.dayIndex - item_j.dayIndex);
               //const group = Map.groupBy(myData, time => ExtractTime(time))
               myData.map(obj =>{
                   const day = obj?.dayIndex
                   const time = ExtractTime(obj?.time)
                   configArray.push({day:day,time:time})
                   //configArray.push(`${day}/${time}`)
                })
                console.log("ROUTINE_DAYS_SHOW_Hello :", configArray)
               setMyData(myData)
            }
        })
        
        let myProgram = []
        if(configArray.length !=0){
            const groupedByTime = groupBy(configArray, 'time', 'day')
            for(let key in groupedByTime){
                const obj = {
                    days: groupedByTime[key].sort(compareNumbers),
                    time:key
                }
                myProgram.push(obj)
            }
            //const grp = Object.groupBy(configArray, ({time})=>time)
            console.log('CONFIG_ARRAY :', myProgram);
        }
        setConfProgram(myProgram)
    },[]);


    useEffect(()=> {
    
    },[confProgram]);

    useEffect(()=> {
        console.log("ROUTINE_DAYS_SHOW_Data", myData)
    },[myData]);
    

    return(
        <View>
            <ConfiguredProgram program ={confProgram} />
        </View>
    )

    // return(        
    
    //     <View style={{}} >
    //         <Text style={{ fontSize: 14, fontWeight: '700',color:textColor, marginVertical: 10 }}>{t(tns + ":" + "CONFIGURED_PLANNING")} </Text>
    //         {
    //             myData.map((item, idx)=>{
    //                 const  myDay = "- "+capitalizeFirstLetter(findDayWithTranslation(item?.dayIndex))
    //                 const trigger = item?.time
    //                 const myTemps = ExtractTime(trigger)
    //                 console.log('JE_VOIS_LE_TEMPS :', myTemps);
    //                 let  myTime ;


    //                 let sign;
    //                 let myEvent;
    //                 if(trigger.hasOwnProperty('event')){
    //                     const offset = trigger?.offset
    //                     const evt = trigger?.event
    //                     console.log('EVT :', evt);
    //                     evt == "sunrise" ? myEvent = `${t(tns + ":" + "SUNRISE")}` : myEvent = `${t(tns + ":" + "SUNSET")}`
    //                     if(offset > 0){
    //                         sign = "+"
    //                     }else if(offset < 0){
    //                         sign= "-"
    //                     }else{sign = ""}
    //                 }else{
    //                     const hour =  trigger?.hour;
    //                     const minute = trigger?.minute
    //                     const myHour = addZeroOnTheLeft(hour)
    //                     const myMinute = addZeroOnTheLeft(minute)
    //                     myTime = `${myHour}:${myMinute}` || "11:11"
    //                     console.log('MY_TIME_ :', myTime);
    //                 }

    //                 return(
    //                     <>
    //                         {(trigger.event == 'sunrise' || trigger.event == 'sunset') &&
    //                             <View key={idx}>
    //                                 <Text style={{ fontSize: 14, fontWeight: '400', marginVertical: 4 }}> 
    //                                  {idx+1}{myDay}  {t(tns + ":" + "AT")}  {myEvent} {sign} {trigger?.offset!=0 && `${Math.abs(trigger?.offset)} mn` }
    //                                 </Text>
    //                             </View>

    //                         }

    //                         {!trigger.event &&
    //                             <View key={idx}>
    //                                 <Text style={{ fontSize: 14, fontWeight: '400', marginVertical: 4 }}>
    //                                    {idx+1} {myDay}  {t(tns + ":" + "AT")}  {myTime}
    //                                 </Text>
    //                             </View>

    //                         }

    //                     </>
    //                 )
    //             })
    //         }

    //         <Text style={{ fontSize: 14, fontWeight: '600',color:textColor, marginVertical: 10 }}>
    //             {t(tns + ":" + "PROGRAMMATION_CAN_BE_MODIFIED_AT_PLANNING")} 
    //         </Text>
    //     </View>
    // )
}