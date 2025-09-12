
import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, View,Button, Modal, ScrollView, SafeAreaView, StyleSheet,Pressable, TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';
import { useTheme } from '_theming/themeProvider'
import ScheduleTaskPicker from '_brand/templates/components/pickers/scheduletask-picker';
import { DaysSelection } from '_brand/templates/screens/routines/screens/planningScreen/components/DaysSelection';
import { myToast } from '_brand/templates/components/ui/myToast';
import * as Actions from '_actions/objects';
import { extractPickerDatas, addZeroOnTheLeft } from '_brand/templates/screens/routines/utils/transformPickerDatas'
import { useScenario } from '_brand/templates/screens/routines/hook/useScenario'
import { DelayPicker } from '_brand/templates/components/ui/pickers/delayPicker';

export const EcoConfortTimePicker = (props)=>{
    const {text, initTime, updateCallback} = props

    const uScenario = useScenario();
    const {
        selectedRoutineTrigger,
        updateSelectedRoutineTrigger,
    } = uScenario;

    const taskObject = null;

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'

    let initValues = {}
    if (selectedRoutineTrigger.type == 'time') {
        const hour = selectedRoutineTrigger?.hour;
        const minute = selectedRoutineTrigger?.minute
        const myHour = addZeroOnTheLeft(hour)
        const myMinute = addZeroOnTheLeft(minute)
        //initValues.initTime = `${myHour}:${myMinute}` || "12:13";
        initValues.trigger = selectedRoutineTrigger
    } else {
        initValues.trigger = selectedRoutineTrigger
    }

    const onScheduleTaskPickerChange = (data) => {
        const trigger = extractPickerDatas(data)
        updateSelectedRoutineTrigger(trigger)
        console.log("Harold Time picker :", data, trigger)
    }


    const RenderScheduleWindow = (props) => {
        const { textColor, noTitle = false } = props
        return (
            <View style={{}}>
                <View style={{ minHeight: 10,paddingHorizontal:10, marginTop: 15, }}>
                    <View style={{ marginTop: 0, justifyContent: 'space-between'}}>
                        <View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>
                                {text}
                            </Text>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
//
    return(
        <View style={{backgroundColor:'transparent', marginTop:0, justifyContent:'center'}}>
            <View style={{marginBottom:0}}>
                <RenderScheduleWindow textColor={textColor} />
            </View>
            <View style={{width:300,height:200,backgroundColor:'transparent',marginLeft:30,justifyContent:'flex-start', borderRadius:12, transform: [{ scale:0.9}]}}>
                <DelayPicker initTime={initTime} pickerId="regularTime" hideSeconds updateCallback={updateCallback}/>
            </View>
        </View>
    )
}


                {/* <ScheduleTaskPicker withTimeText={false} taskObject={taskObject} {...initValues} callback={onScheduleTaskPickerChange}>
                </ScheduleTaskPicker> */}