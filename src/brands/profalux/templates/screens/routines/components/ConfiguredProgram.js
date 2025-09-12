import '_brand/templates/screens/routines/locales';
import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View} from 'react-native';
import { useTranslation } from 'react-i18next';
import {findDayWithTranslation, capitalizeFirstLetter} from '_brand/templates/screens/routines/components/utils'
import { useTheme } from '_theming/themeProvider'
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'

const myday = findDayWithTranslation(7)
console.log('MY_DAY :', myday);


export const ConfiguredProgram = (props)=>{
    const {program} = props
    const uScenario = useScenario();
    const { 
        routineId,
        daysAlreadyInUse,updateDaysAlreadyInUse, myDays, onClickDayObject,
        numberOfDays, updateSaveProgrammation, saveProgrammation,
     } = uScenario;

     console.log('PROGRAM :', program);

     useEffect(()=> {
     
     },[program]);

    const { t, i18n } = useTranslation();
    const tns = "routine";

    const { theme } = useTheme();
    const textColor = theme?.prflxTextColor || 'black'

    const getDays = (days)=>{
        let myDay
        let arr = [];
        days.map(i =>{
            myDay = " "+capitalizeFirstLetter(findDayWithTranslation(i))
            arr.push(myDay)
        })
       return   arr   
    }

    return(        
    
        <View style={{}} >
            <Text style={{ fontSize: 14, fontWeight: '700',color:textColor, marginVertical: 10 }}>{t(tns + ":" + "CONFIGURED_PLANNING")} </Text>
            {

                program.map((item, idx)=>{
                    const days = item?.days
                    const time = item?.time
                    const myDays = getDays(days).join(",") 
                    return(
                        <View key={idx}>
                            <Text style={{ fontSize: 14, fontWeight: '400', marginVertical: 4, color:textColor }}> 
                                {idx+1} -{`${myDays}  ${t(tns + ":" + "AT")} ${time}`}
                            </Text>
                        </View>
                    )
                })
            }
        </View>
    )
}