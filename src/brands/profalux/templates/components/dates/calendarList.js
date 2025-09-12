import React from 'react';
import {useContext,useState,useEffect,useRef} from 'react';
import { View,Text,TouchableWithoutFeedback } from 'react-native';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native'

import {CalendarList as WixCalendarList,LocaleConfig} from 'react-native-calendars';

import './calendarLocales';



import moment from 'moment/min/moment-with-locales';
import { useTheme } from '_theming/themeProvider';


const buidlMarkedDates = (startDate,endDate) => {

    let a = moment(startDate);
    let b = moment(endDate).add(1, 'days');

    let datesRange = [];
    //----------------
    [...Array(b.diff(a, "d")).keys()].forEach((d) => {
                                                        datesRange.push(moment(a).add(d, "d").format("YYYY-MM-DD"));
                                                    }
                                            );
    
    console.log("--->datesRange",datesRange)

    const mDates = datesRange.reduce((r,v,i) => {
            r[v] = {selected:true,color:'green',...(i == 0 && {startingDay:true}),...(i == (datesRange.length-1) && {endingDay:true})};
            return r;
    },{})

    console.log("mDates",mDates)

    return mDates
}






export const CalendarList = (props) => {


    const [startDate,setStartDate] = useState(props.startDate);
    const [endDate,setEndDate] = useState(props.endDate);
    const [markedDates,setMarkedDates] = useState({});

    const forceDateRef = useRef(null)



    const { t, i18n } = useTranslation();

    const {theme} = useTheme();
    const textColor = props.invertedColors ? theme["schedule_widget_text_color"] || "#777" : theme["body_color_text"];
    const textSelectedColor = theme["screen--color--text--selected"];
   

    let currentLang = i18n.language;
    if(currentLang == "en")currentLang+="-gb";
    moment.locale(currentLang); 
    LocaleConfig.defaultLocale = currentLang;
    console.log("LocaleConfig.defaultLocale",LocaleConfig.defaultLocale);
    console.log("currentLang",currentLang);
    //getLabels('de')
    // componentDidMount
    useEffect(() => {
      
      if(endDate != undefined && startDate!= undefined) {
          console.log(startDate,endDate)
        setMarkedDates(() => buidlMarkedDates(startDate,endDate));
      }


      }, [startDate,endDate]);

      useEffect(() => {
        console.log("markedDates changed !!!")
 
 
       }, [markedDates]);




      const onClickDay = (day) => {

        console.log("onClickDay 2",day,forceDateRef.current,"<")

        const newDay = day?.dateString;
        if(newDay) {
            if(forceDateRef.current) {
                if(forceDateRef.current == "start") {
                    setStartDate(newDay)
                } else {
                    setEndDate(newDay)
                }
                forceDateRef.current = null;
            } else {
                if(newDay > startDate)setEndDate(newDay);
                if(newDay < startDate)setStartDate(newDay);
                if(newDay > startDate && newDay <=endDate)setEndDate(newDay);
                if(newDay == startDate || newDay == endDate)onSelectDefinedDay(day);
            }
            //if(newDay == endDate)onSelectDefinedDay(day)
        }


      }
    
      const onSelectDefinedDay = (day) => {
        console.log("onSelectDefinedDay",day)
        const nowDay = day?.dateString;
        let newMarkedDates = JSON.parse(JSON.stringify(markedDates))
        if(newMarkedDates[nowDay] != undefined) {
            newMarkedDates[nowDay].color = "red";
            forceDateRef.current = ( newMarkedDates[nowDay].startingDay == true) ? "start" : "end";
        }
        setMarkedDates(newMarkedDates)
      }


    const calendarTheme = {
        'stylesheet.calendar.header': {
          dayTextAtIndex0: {
            color: 'red'
          },
          dayTextAtIndex6: {
            color: 'blue'
          }
        }
      }

     


    return (   
             <WixCalendarList
                 
                theme={{
                    'stylesheet.calendar.header': {
                      dayTextAtIndex0: {
                        color: 'red'
                      },
                      dayTextAtIndex6: {
                        color: 'blue'
                      }
                    }
                  }}

                onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
                 // Max amount of months allowed to scroll to the past. Default = 50
                 pastScrollRange={0}
                 // Max amount of months allowed to scroll to the future. Default = 50
                 futureScrollRange={12}
                 // Enable or disable scrolling of calendar list
                 scrollEnabled={true}
                 // Enable or disable vertical scroll indicator. Default = false
                 showScrollIndicator={true}

                 markingType={'period'} 

                 markedDates ={markedDates}

                 onDayPress={onClickDay}

                 onDayLongPress={onSelectDefinedDay}
                 
                 firstDay={1}
                 
                 {...props}
                 
                 />
                   
            
    )
}
