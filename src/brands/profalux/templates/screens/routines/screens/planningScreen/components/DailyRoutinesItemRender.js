import '_brand/templates/screens/routines/locales'
import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider'
import { useObject } from '_hooks/object';
import { convertMinutesToHoursMinutes, extractParamFromEcoConfort} from '_brand/templates/screens/routines/utils/ecoConfortUtils'
import EcoConfortWinter from '_brand/images/icons/app/profaluxIconJs/EcoConfortWinter'
import EcoConfortSummer from '_brand/images/icons/app/profaluxIconJs/EcoConfortSummer'


export const DailyRoutinesItemRender = (props) => {
    const { routineId, trigger, hour, minute, triggerType } = props
    const { t, i18n } = useTranslation();
    const tns = "routine";
    const uObject = useObject(routineId)
    const routineName = uObject?.name
    const typeName = uObject?.objectDatas?.typeName
    const beginTime = `${hour}:${minute}`;//extractPlannerTime(trigger)
    let endTime;
    let ecoMode;

    console.log('BEGIN_TIME :', beginTime, triggerType);
    
    if(triggerType=="range"){
        const ecoParameters = uObject?.parameters
        ecoMode = extractParamFromEcoConfort(ecoParameters, "vr_season")
        const duration = trigger?.duration
        const endTimeMinutes = Number(hour)*60 + Number(minute) + Number(duration)
        endTime = convertMinutesToHoursMinutes(endTimeMinutes)
    }
    console.log("ME_TRIGGER_11_hello :", beginTime, endTime)


    let sign;
    let myEvent;
    if(trigger.hasOwnProperty('event')){
        const offset = trigger?.offset
        const evt = trigger?.event
        console.log('EVT :', evt);
        evt == "sunrise" ? myEvent = `${t(tns + ":" + "SUNRISE")}` : myEvent = `${t(tns + ":" + "SUNSET")}`
        if(offset > 0){
            sign = "+"
        }else if(offset < 0){
            sign= "-"
        }else{sign = ""}
    }

    const pictoMode = {
        "summer": EcoConfortSummer,
        "winter": EcoConfortWinter
    }

    const { theme } = useTheme();
    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    let timeBox = '20%';
    let nameBox = '60%';
    let iconBox = '20%';
    let alignName = 'flex-start';
    switch (triggerType) {
        case "time":
            timeBox = '45%';
            nameBox = '55%';
            break;
        case "range":
            timeBox = '18%';
            nameBox = '65%';
            iconBox = '15%';
            alignName = 'center';
            break;
        default:
            timeBox = '50%';
            nameBox = '50%';
            alignName = 'flex-start';
    }

    


    return (
        <View style={{ flex: 1, paddingVertical: 10,flexDirection:'row', justifyContent:'flex-start', alignItems:'center', backgroundColor:"transparent" }}>

                <View style={{backgroundColor:'transparent', width:timeBox, justifyContent:'flex-start', alignItems: 'flex-start', borderLeftWidth: endTime ? 3 : 0, borderColor: textColor, }}>
                    <View style={{ marginLeft: 0 }}>
                        {trigger.event == 'sunrise' && 
                            <Text style={{ fontSize: 16, fontWeight: '600',textAlign:'center', color: textColor }}>{myEvent} {sign} {trigger?.offset!=0 && `${Math.abs(trigger?.offset)} mn` } </Text>
                        }
                        {trigger.event == 'sunset' && 
                            <Text style={{ fontSize: 16, fontWeight: '600', color: textColor,textAlign:'center', backgroundColor:'transparent'}}>
                                {myEvent} {sign} {trigger?.offset!=0 && `${Math.abs(trigger?.offset)} mn` }
                            </Text>
                        }
                        {triggerType=="time" && 
                            <Text style={{ fontSize: 16, fontWeight: '600', color: textColor }}>{beginTime}</Text>
                        }
                        {triggerType=="range" && 
                            <View style={{flexDirection:'row'}}>
                                <View style={{height:50, width:0, backgroundColor:textColor, marginRight:5}}></View>
                                <View style={{justifyContent:'space-between'}}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: textColor, backgroundColor:'transparent' }}>{beginTime}</Text>
                                    <Text style={{ fontSize: 16,marginLeft:1, fontWeight: '600', color: textColor, backgroundColor:'transparent' }}>{endTime}</Text>
                                </View>
                            </View>
                        }
                    </View>
                </View>

                <View style={{backgroundColor:'transparent',width:nameBox, marginLeft:5, }}>
                    <Text 
                            numberOfLines={2} 
                            ellipsizeMode='tail' 
                            style={{fontSize: 16,fontWeight:'600',color:textColor,backgroundColor:'transparent',alignSelf:alignName}}
                        >
                            {routineName}
                    </Text>
                </View>

                {triggerType == "range" &&
                    <View style={{flex:1, backgroundColor:'tranparent', width:nameBox, justifyContent:'center', alignItems:'flex-end', marginRight:5}}>
                            <View style={{width:50, height:50}}>
                                {ecoMode == "winter" && <EcoConfortWinter color={textColor}/>}
                                {ecoMode == "summer" && <EcoConfortSummer color={textColor}/>}
                            </View>
                    </View>
                }

        </View>
    )
}
