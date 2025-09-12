import '_brand/templates/components/objects/common/locales'
import React from 'react';
import {SafeAreaView,Text,View} from 'react-native';
import ScheduleTaskInfos from '_brand/templates/components/scenarios/scheduleTaskInfos';
import DelayTaskInfos from '_brand/templates/components/scenarios/delayTaskInfos';


const ScheduleTaskInfosRender = (props) => {

    const {taskId,title,datas,associatedAction} = props;
    const {taskTime, taskDays, description, activated =true} = datas;
    const {callback,toggleCallback} = props.callbacks;

    const { t, i18n } = useTranslation(); 
    const tns = "common";
   
   
    return (
        <ScheduleTaskInfos  title={title} 
                            taskId={taskId}                                   
                            taskTime={taskTime}
                            days={taskDays}
                            buttonTitle={t(tns+":"+"MODIFY")}// "Modify"
                            callback={callback}
                            activationToggleAction ={toggleCallback}     
                            description={description}
                            activated={activated}
                            associatedAction={associatedAction}
            />
    )
}

const   DelayTaskInfosRender = (props) => {

    const {taskId,title,datas} = props;
    const {taskObjectId,taskTime, activated = true } = datas;
    const {delayCallback,toggleCallback} = props.callbacks;

    return (
        <DelayTaskInfos
            title={title} 
            taskId={taskId}
            taskObjectId = {taskObjectId}
            taskTime={taskTime}
            callback={delayCallback}          
            activationToggleAction ={toggleCallback} 
            activated={activated}
            
            style={{marginTop:50}}
    />
    )
}         



export const SchedulesBlock = (props) => {

    const {schedules = [],delays=[],callbacks={}} = props;

    return (
        <View>
       {
            schedules.map((v,i) => {   
                return (
                     <ScheduleTaskInfosRender {...v} callbacks={callbacks} key={'schedBlock_'+i}/>
                )
            })
       } 
       {
            delays.map((v,i) => {  
                return (
                     <DelayTaskInfosRender {...v} callbacks={callbacks} key={'schedBlockDelay_'+i}/>
                )
            })
       } 
        </View>
    )
}