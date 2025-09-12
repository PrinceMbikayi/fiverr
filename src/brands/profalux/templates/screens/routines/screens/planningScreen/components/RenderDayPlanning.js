import '../../../locales';
import React, { useRef, useEffect} from 'react';

import { View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'
import {DailyRoutinesItemRender} from './DailyRoutinesItemRender'
import {getObjectById} from '_helpers/objects';




export const RenderDayPlanning = (props) => {
    const { dailyRoutines, callBack } = props
    //console.log("dailyRoutines_0",dailyRoutines)

    const idCheckDoublonRef = useRef(null)


    const { t, i18n } = useTranslation();
    const navigation = useNavigation();

    const { theme } = useTheme();
    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const disconectGray = theme['card--color--deactivated-overlay'];



    
    
    useEffect(()=> {
        //console.log("dailyRoutines_1",dailyRoutines)
    },[dailyRoutines]);



    const handlePlaningClicked = (routineId,trigger) => {
        console.log("COUCOU_PLANNING_PRESSED :",routineId,trigger)
        //if fact callback do necessary updates i.e. routineId then navigate
        callBack(routineId,trigger) // in order to update current Routine
       
       
    }

    return (
        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                {
                    
                    dailyRoutines.map((routine,index)=>{
                        console.log("CHECK_MAP",routine?.id,routine?.trigger)
                        const routineId = routine?.id;
                        const routineInfos = getObjectById(routineId)
                        const typeName = routineInfos?.typeName
                        //let routineStatus;
                        let routineStatus = typeName == "application" ?  routineInfos?.statusDictionary?.__mode : routineInfos?.statusDictionary?.planner_activation_status
                        console.log('ROTINE_INFOS :', routineInfos);

                        const trigger = routine?.trigger;
                        console.log('ME_TRIGGER_SENT_TO_RENDER :', trigger);
                        const hour = routine?.trigger?.hour
                        const minute = routine?.trigger?.minute
                        const sourceId = routine?.trigger?.sourceId
                        const event = routine?.trigger?.event;
                        const offset = routine?.trigger?.offset;
                        const triggerType = routine?.type

                        const props = {trigger, triggerType, hour, minute, event, offset, weatherId:sourceId}
                        return(
                            <View key={index}>
                                {routineInfos &&
                                    <Pressable
                                            disabled={routineStatus =='deactivated'? true : false}
                                            style={{ flex: 1, backgroundColor: (routineStatus =='deactivated')? disconectGray : bgWhitecolor, 
                                                borderWidth: 1, borderColor: borderColor, borderRadius: 7, paddingHorizontal: 10,paddingVertical:5, marginTop: 10 
                                            }}
                                            onPress={() => handlePlaningClicked(routineId,trigger)}
                                        >
                                            <View>
                                                <DailyRoutinesItemRender routineId={routineId} {...props} />
                                            </View>
                                    </Pressable>
                                }
                            </View>
                        )
                    })
                }
                    
        </View>
    )
}