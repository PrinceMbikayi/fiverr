import '_brand/templates/components/objects/common/locales'
import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,SafeAreaView,Text,Alert,Pressable } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider';
import {WeekDays} from '_brand/templates/components/dates/weekDays';
import ScheduleTaskPicker from '_brand/templates/components/pickers/scheduletask-picker';
import * as level2Funcs from '_helpers/level2options';
import * as actionsSchedules from '_brand/templates/components/objects/@dynamics_brand/actions/objectsActions';



const TypeDefaultSchedule = (props) => {  
    
    const { t, i18n } = useTranslation(); 
    const tns = "common";
    const {theme} = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};     
    const {itemId,taskName,taskObject,initTime,days : paramDays,template,title : headerTitle,associatedAction} = navigationParams;   
    const [timeSelection, setTimeSelection] = useState({});
  

    const initDays = [0,0,0,0,0,0,0]
    const [days, setDays] = useState(initDays);
    console.log("PARAM DAYS : ", paramDays)
    const [isOnOff, setIsOnOff] = useState(false);
    //taskName
    //taskObject
    const [notification, setNotification] = useState({active:false});
    const [actionsSwitches, setActionsSwitches] = useState({});
    //headerTitle
    //associatedAction
    const [actions, setActions] = useState({});
    const [launchButtonActive, setLaunchButtonActive] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);






    useEffect(()=> {
        console.log("CONVERT DAY D :", days)
    },[days]);
    // //-------------------------------------

    const isMounted = useRef(false);
    
    useEffect(() => {
       
        isMounted.current = true;       
       
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);

    //-----------------------------------
    const  cancel = () => {
        navigation.goBack();
    }
   
    const toggleSwitch = (e) => {       
        setIsEnabled(e);
    }

    //=====================================================
    const taskCreationErrorAlert = (extra) => {
        Alert.alert(
            t('scenarios:SCHEDULE_TASK_CREATION_FAILED'),
            t('scenarios:SCHEDULE_TASK_CREATION_FAILED_DESCRIPTION')+"\n",
            [                  
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],                
          );
    }

    const alertScheduleSetSuccess = (extra) => {
        Alert.alert(
            t('scenarios:SCHEDULE_SET_SUCCESS_TITLE'),
            t('scenarios:SCHEDULE_SET_SUCCESS_DESCRIPTION'),
            [                  
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],                
          );
        //this.props.forceRefresh(objectId);
    }

    const onScheduleSetSuccess = (myTime) => {
        alertScheduleSetSuccess(myTime);
    }


    const checkWeather = (weatherId) => {
        if(weatherId == undefined) {
            Alert.alert(
                t('scenarios:WEATHER_MANDATORY'),
                t('scenarios:WEATHER_MANDATORY_DESCRIPTION'),
                [                  
                  { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],                
              );
              return false;
        }
        return true;
    }

    const alertDaysError = () => {
        Alert.alert(
            t('scenarios:DAYS_MANDATORY_TITLE'),
            t('scenarios:DAYS_MANDATORY_DESCRIPTION'),
            [                  
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],                
          );
        
    }

    useEffect(()=> {
        console.log("useEffect timeSelection",timeSelection)
    },[timeSelection])

    //------------------------------------
    const onScheduleTaskPickerChange = (data) => {        
        console.log("Harold Time picker :", data)
       setTimeSelection(data);        
    }

    const onDaysCallbackChange = (newDays, index) => {      
        console.log("Harold Day Selection :", newDays, index) // days are initialize with [0, 0, 0, 0, 0, 0, 0] if select Monday => [1, 0, 0, 0, 0, 0, 0]

        // apply convert function on the days selection array
        const testConvert = level2Funcs.onDaysCallbackChange(newDays);
        console.log("CONVERT DAY :", testConvert)
       setDays(level2Funcs.onDaysCallbackChange(newDays));       
    }
    
    const doCallback = (switches) => {        
        setActionsSwitches(switches);
    }

    //------------------------------------
    const injectActions = (props) => {

        const {navigationParams,uniType,typeName} = props;
        const {taskObject} = navigationParams;        
        const actionsType = 'Type'+(uniType || typeName)+'Actions';
        const scenarioId = taskObject?.description?.scenarioId || -1;       
     
        if(actionsSchedules[actionsType]) {
            const SpecificActions = actionsSchedules[actionsType];
            return <SpecificActions  callback={doCallback} itemId={props.itemId} scenarioId={scenarioId} actionsSwitches={actionsSwitches} associatedAction={props.associatedAction}/>;
        }
        return <Text style={{color:'white'}}>{t(tns+":"+"NO_ACTIONS_FOR_THIS_TYPE")}</Text>        
    }

    //====================================
    const validate = async() => {       
       
        const recordTimeSelection = (timeSelection?.time == undefined && timeSelection?.event == undefined)? initTime : timeSelection;
        const recurrence = !(days.length == 0 || days.join() == "0,0,0,0,0,0,0");
       
        if(!recurrence) {
            alertDaysError();           
            return false;
        }


        // build actions array

    //     const switches = actionsSwitches;
       
    //     let scriptActions = [];
    //     if(switches) {
    //         scriptActions = Object.keys(switches).reduce(function(r,v,i) {
    //             const obj = switches[v];
    //             r.push({'type':'call','objectId':itemId.toString(),'action':obj.actionNames[Number(obj.value)],'mArgs':[],'oArgs':[]});
    //             return r;
    //         },[])
    //     }      

    //     let hasColor = false;
    //     let nonSwitchActions=[];
    //     if(actions) {
          
    //         nonSwitchActions = Object.keys(actions).reduce(function(r,v,i) {
              
    //             if(v == "COLOR")hasColor = true;
    //             const pushIt = {'type':'call','objectId':objectId.toString(),'action':v,'mArgs':actions[v].mArgs,'oArgs':[]};
    //             r.push(pushIt);
    //             return r;
    //         },[])
    //     }

    //    // console.log("nonSwitchActions",nonSwitchActions)
    //     if(hasColor) {            
    //         scriptActions = scriptActions.reduce((r,v,i) => {
    //                 if(v.action != "ON")r.push(v)
    //                 return r;
    //         },[])            
    //     }        
    //     scriptActions = [...scriptActions,...nonSwitchActions];
    //     //console.log("scriptActions",scriptActions)       
    //     if(notification.active) {
    //         scriptActions.push({'type':'notify','severity':'WARNING','title':notification.title,'text':'il y a un serpent dans ma botte'})
    //     }              
        if(recordTimeSelection.event != undefined && checkWeather(recordTimeSelection.weatherId) == false){
            setLaunchButtonActive(true);           
            return false
        }        
         // then save       
         const res = await level2Funcs.saveOptions(itemId,taskName,recordTimeSelection,days,scriptActions);              
         setLaunchButtonActive(true); 
 
         if(res.status == 'error') {
             taskCreationErrorAlert(recordTimeSelection);
         } else {              
             onScheduleSetSuccess(recordTimeSelection.time);
         }
    }

    const goBack = () => {       
        navigation.goBack();
    }
    const bgColor = theme["color--bg2"] || "red"
    const _backgroundColor = theme["details_body_color"] || theme["card--color--bodybg"];
    const textColor = theme?.prflxTextColor||'black';

    return (
        <SafeAreaView style={{flex:1,backgroundColor:_backgroundColor}}>
            <StyledHeaderView>
                <H1>{headerTitle}</H1>
                <View style={{position:'absolute',right:0,height:'100%',width:50}}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Pressable
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={goBack}>
                        <Icon name="close" size={30} color="#000000" style={{alignSelf:'center'}}/>
                       </Pressable>
                    </View>                    
                </View>               
            </StyledHeaderView> 

            <KeyboardAwareScrollView alwaysBounceVertical={false}>  

                <View style={{minHeight:40,marginBottom:10,marginLeft:20,marginRight:20,marginTop:40, backgroundColor:'transparent'}}>
                    <WeekDays editable={true} days={days} callback={onDaysCallbackChange}/>
                    <View style={{marginTop:20}}>
                        <Text style={{fontSize:14, fontWeight:'600', color:textColor}}>{t(tns+":"+"WHAT_TIME")}</Text>
                    </View>
                </View>

                <ScheduleTaskPicker itemId={itemId} taskObject={taskObject}  callback={onScheduleTaskPickerChange}>  
                </ScheduleTaskPicker> 
                
                
                <View style={{padding:15}}>                  
                    {
                      injectActions(props)                    
                    }
                    <View style={{flex:1,flexDirection:'row', marginTop:30, justifyContent:'space-between', alignItems:'center'}}>
                             <Pressable style={{flex:1, backgroundColor:textColor, padding:10, borderRadius:10, alignItems:'center', marginRight:5}} onPress={cancel} >
                                <Text style={{fontSize:16, fontWeight:'400', color:'white'}} >{t(tns+":"+"CANCEL")}</Text>
                             </Pressable>
                             <Pressable style={{flex:1, backgroundColor:textColor, padding:10, borderRadius:10, alignItems:'center', marginLeft:5}} onPress={validate} >
                                <Text style={{fontSize:16, fontWeight:'400', color:'white'}}>{t(tns+":"+"SAVE")}</Text>
                             </Pressable>
                        </View>
                        <View style={{width:15}}></View>                  
                </View>            
            </KeyboardAwareScrollView>   

        </SafeAreaView>
        )
}

export default TypeDefaultSchedule;

const StyledHeaderView = styled.View`
        background-color:white;
        max-height:50px;
        min-height:50px;
        align-items: center;
        justify-content: center;
        flex:1;
        `;

const H1 = styled.Text`
    background-color:white;
    font-size:16px;
    font-weight:bold;
    `;