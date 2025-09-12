import React, { Component } from 'react';
import {useContext,useState,useEffect} from 'react'
import { useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View, Text ,Switch} from 'react-native';
import { ButtonWithStyle as Button } from '_components/ui/buttons/buttonWithStyle';
import { useTheme } from '_theming/themeProvider';
import styled from 'styled-components/native';
import { DividerText} from '_components/ui/divider-with-text';

import {Countdown} from '_components/ui/countdown';

import {getAllObjects,getObjectsByTypeName,getObjectById,getWidgetReference} from '_helpers/selectors';



const DelayTaskInfos = (props) => {


  //const [isActive,setIsActive] = useState(false);

  const {taskId,title,activated,taskTime,activationToggleAction,taskObjectId,callback} = props;
  //console.log("HOT 2 XXXXXXXX ------> props",JSON.parse(JSON.stringify(props)))
  const { t, i18n } = useTranslation();
  const {theme} = useTheme();   
  const taskObjectDatas = useSelector(state => getObjectById(state,taskObjectId));
  

  const [isActivated,setIsActivated] = useState(false)
  const [showCountDown,setShowCountDown] = useState(false);

  const switchToggle = (value) => {  
    const newValue = !isActivated;   
    setIsActivated(newValue); 
    activationToggleAction(taskId,newValue)   
  }

  const previousRoute = useSelector(state => state.app.previousRoute) ;

  const [displayedTime,setDisplayedTime] = useState(taskTime)
  const [triggerTime,setTriggerTime] = useState(null);
  const [switchDisabled,setSwitchDisabled] = useState(false);

  /*
  useEffect(() => {
    //console.log("useEffect for activated",activated);
    setIsActivated(activated);
    setDisplayedTime(taskTime)
   }, [taskTime,activated]);
   */
  

   useEffect(() => {
    
    if(taskObjectId == undefined) {
     
      setIsActivated(false); setSwitchDisabled(true); setDisplayedTime('00:00:00'); setTriggerTime('');
      
    } else {
      if(taskObjectDatas) {
        const isActivated = taskObjectDatas?.flags?.deactivated
        setIsActivated((isActivated == undefined)? true : !isActivated);
        setDisplayedTime(taskTime);
        setTriggerTime(taskObjectDatas.statusDictionary?.Trigger_time)
        setSwitchDisabled(false)
      }
    
    }
   
   }, [taskObjectId,taskObjectDatas]);

   const textColor = theme["schedule_widget_text_color"] || "#777";
   const bgColor = theme['schedule_widget_background_color'] || "white" 
    
   const doCallBack = () => {
     console.log("doCallback",callback,taskId)
    callback(taskId)
   }

   const dividerColor = "#999999"

  return (
    <View style={{padding:10}}>
    <DividerText label={title} color={dividerColor} lineColor="#CCCCCC" />
    <View style={{flex:1,flexDirection:'row',marginTop:10}}>
        <View style={{minWidth:80,width:80}}>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              <View style={{height:70,width:70,backgroundColor:bgColor,justifyContent:'center',alignItems:'center',borderRadius:35}}>
                <Switch
                          trackColor={{ false: theme.dark_body_darker, true: theme.primary }}
                          thumbColor={activated ? theme.onPrimary : "#CCC"}
                          ios_backgroundColor={theme.dark_body_darker}                                  
                          onChange={switchToggle}
                          value={isActivated}
                          disabled={switchDisabled}
                  />
              </View>                 
            </View>
        </View>
        <View style={{flex:1,flexDirection:'column'}}>
            <View style={{backgroundColor:bgColor,minHeight:80}}>
              <View style={{height:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
                <Countdown displayedTime={displayedTime} triggerTime={triggerTime}/>
              </View>                  
            </View>
            
        </View>                        
    </View>   
    <View style={{flex:1,flexDirection:'row',marginTop:5}}>
        <View style={{minWidth:80,width:80}}></View>
        <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
           <Button   type="clear" title={t("scenarios:MODIFY")} onPress={doCallBack}
                          titleStyle={{textDecorationLine: 'underline',color:dividerColor,fontSize:12}}>
            </Button> 
        </View>                   
     </View>   
</View> 
)



}

export default DelayTaskInfos;

const TimeText = styled.Text`
       
        font-size:32px; 
        color:#777;  
        text-align:center;
        margin-top:14px;
        margin-bottom:-12px;      
    `;


  /* use it like this 
<ScheduleTaskInfos  title={t("scenarios:WAKE_UP")} 
                                    taskId='Default'
                                    taskTime={specialsSchedularTasks.Default.taskTime}
                                    days={specialsSchedularTasks.Default.taskDays}
                                    buttonTitle="Modify"
                                    callback={move}

  */

