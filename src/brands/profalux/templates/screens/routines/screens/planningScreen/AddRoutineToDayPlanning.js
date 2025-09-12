import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect} from 'react';
import { SafeAreaView, Text,View, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider'
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import Button from '_brand/templates/components/ui/Button';
import ScheduleTaskPicker from '_brand/templates/components/pickers/scheduletask-picker';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import {extractPickerDatas} from  '_brand/templates/screens/routines/utils/transformPickerDatas'

export const AddRoutineToDayPlanning = (props) => {


    const uScenario = useScenario();
    const {
        updateSelectedRoutineTrigger,
        addRoutineToPlanningDay,
    } = uScenario;

    const taskTime = "12:00";

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "routine";

    const { theme } = useTheme();
    const borderColor = theme?.prflxBorderColor || 'orange';
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";


    const [trigger, setTrigger] = useState({type: 'time', hour: 12, minute: 0});


    useEffect(()=> {
        console.log("PICKER_DATA_TO_SEND:", trigger)
        updateSelectedRoutineTrigger(trigger)
    },[trigger]);

    const onPlanningPickerChange = (data) => {
        const newTrigger = extractPickerDatas(data)
        setTrigger(newTrigger)
        console.log("PICKER_DATA_TO_SEND:", newTrigger)
        updateSelectedRoutineTrigger(newTrigger)
    }

    const addPlanning = () => {
        console.log("PLANNING_ADD :")
        addRoutineToPlanningDay()
    }
    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
            <View style={{ flex: 1, backgroundColor: 'white', }}>

                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        //title={uObject.name}
                        title={`${t(tns + ":" + "ADD_ROUTINE")}`}
                        //titleMarginLeft = {40}
                        backSVG centered
                        goBack={{ action: () => navigation.goBack() }}
                        noShadow />
                </View>
                <ScrollView
                    style={{ backgroundColor: bgcolor, paddingHorizontal: 10 }}
                    showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                >


                    <View style={[styles.bodyContent, { marginTop: 10, backgroundColor: containerbgcolor, paddingHorizontal: 10 }]}>

                        <View style={{}}>

                            <View style={{ minHeight: 40, marginBottom: 0, marginLeft: 20, marginRight: 20, marginTop: 20, backgroundColor: 'transparent' }}>
                                {/* <WeekDays editable={true} days={currentDays} callback={onDaysCallbackChange} /> */}
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>{t(tns + ":" + "WHAT_TIME")}</Text>
                                </View>
                            </View>

                            <ScheduleTaskPicker initTime={taskTime} callback={onPlanningPickerChange}>
                            </ScheduleTaskPicker>

                        </View>

                        <View style={{ marginTop: -40 }}>
                            <Button onPress={addPlanning} altStyle title={`${t(tns + ":" + "END")}`} titleColor='white' bgColor={iconColor} noBorder />
                        </View>
                    </View>

                </ScrollView>


            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    headerStyle: {
        justifyContent: 'center',
        alignItems: 'stretch',
        borderBottomColor: 'orange',
        borderBottomWidth: 2,
        backgroundColor: "transparent",
    },
    bodyWrapper: {
        flex: 1,
        flexDirection: 'column',
        //backgroundColor:'#EBF1F5',
        padding: 5,
    },
    bodyContent: {
        flex: 1,
        justifyContent: 'center',
        padding: 5,
        borderColor: 'orange',
        borderWidth: 1,
        borderRadius: 10,

    },
    text: { marginVertical: 15 }
})

