import '_brand/templates/screens/routines/locales'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider'
import ScheduleTaskPicker from '_brand/templates/components/pickers/scheduletask-picker';

export const PlanningTriggerPicker = (props) => {

    const { taskObject = null, taskTime, onPlanningPickerChange, textColor } = props;

    const { t, i18n } = useTranslation();
    const tns = "routine";

    const { theme } = useTheme();
    const borderColor = theme?.prflxBorderColor || 'orange';
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";


    return (

        <View style={[styles.bodyContent, { marginTop: 10, backgroundColor: containerbgcolor, paddingHorizontal: 10 }]}>
            <View style={{ minHeight: 40, marginBottom: 0, marginLeft: 20, marginRight: 20, marginTop: 20, backgroundColor: 'transparent' }}>
                {/* <WeekDays editable={true} days={currentDays} callback={onDaysCallbackChange} /> */}
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>{t(tns + ":" + "WHAT_TIME")}</Text>
                </View>
            </View>

            <ScheduleTaskPicker taskObject={taskObject} initTime={taskTime} callback={onPlanningPickerChange}>
            </ScheduleTaskPicker>

        </View>


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