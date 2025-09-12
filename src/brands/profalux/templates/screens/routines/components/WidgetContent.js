import '_brand/templates/screens/routines/locales'
import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { View, Text, StyleSheet, Switch, Pressable, TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';

import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import {iconsJs} from '_brand/utils/iconsJs';
import * as Durin from '_api/durin';
import { useDispatch, useStore} from 'react-redux';
import PlayRoutineOn from '_brand/images/icons/app/profaluxIconJs/PlayRoutineOn'
import PlayRoutineOff from '_brand/images/icons/app/profaluxIconJs/PlayRoutineOff'
import * as ApiObjects from "_api/objects"
import { refreshObjectAction } from '_actions/asyncActions';
import { myToast } from '_brand/templates/components/ui/myToast';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'

export const WidgetContent = (props) => {

    const {itemId, bodyStyle, iconSize, isPlug, isLight} = props;

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const navigation = useNavigation();
    const route = useRoute();
    const {theme} = useTheme();  
    const dispatch = useDispatch();
    const store = useStore()


    const uScenario = useScenario();
    const { 
     } = uScenario;


    const uObject = useObject(itemId);
    const rdependencies = uObject?.objectDatas?.rdependencies?.weeklyPlanner
    const tasks = uObject?.objectDatas?.rdependencies?.tasks 
    const plannerActivationStatus = uObject?.statuses?.planner_activation_status

    console.log("SHOW_ROUTINE_OBJECT_2 :", uObject)

    const [isEnabled, setIsEnabled] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    
    
    const typeName = uObject?.objectDatas?.typeName;
    
    const plugOrLight = uObject?.statuses?.__user_pluglight;
    
    
    
    
    
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const iconthemeColor = theme?.prflxIconColor||'white';
    const iconthemebgColor = 'white';
    

    useEffect(()=> {
      console.log('SHOW_RDEPENDENCIES_FOR_ROUTINE :', rdependencies);
    },[rdependencies]);

    useEffect(()=> {
      console.log('isClicked :', isClicked);
    },[isClicked]);


      useEffect(()=> {
        if(plannerActivationStatus == "activated"){
          setIsEnabled(true);
        }else{
          setIsEnabled(false);
        }
      },[plannerActivationStatus]);
 

    const deActivateAction = {
      "name":"DEACTIVATE_OBJECT",
      "mArgs":[
              {"name":"objectId","value":itemId},
          ]
  }

    const activateAction = {
      "name":"ACTIVATE_OBJECT",

      "mArgs":[
              {"name":"objectId","value":itemId},
          ]
  }

      const onToggleSwitch = async(value) => {

        if(tasks && tasks.length !=0){
          setIsEnabled(value => !value);
          console.log('My_SWITCH_VALUE :', value);
          if(value == true){
  
              const requestActivate = await ApiObjects.createWeeklyPlanner(activateAction);
  
              console.log('RESPONSE_ACTIVATE_ROUTINE :', requestActivate);
              if(requestActivate.errCode == 200){
                // const action = Actions.objectUpdateProperty(itemId, 'planner_activation_status', "activated");
                // dispatch(action);
                uObject?.updateStatus('planner_activation_status',"activated");
                refreshObjectAction(itemId, store).catch((err) => console.log(err));
              
              }else{
                const errCode = requestActivate?.errCode;
                const errMsg = requestActivate?.errMsg;
                const message = `${t(tns + ":" + "SERVER_ERROR")} : ${errCode} ${errMsg}`//'Un groupe avec ce nom existe déjà'
                myToast(message)
              }
  
          }else{
  
  
            const requestDeactivate = await ApiObjects.createWeeklyPlanner(deActivateAction);
            console.log('RESPONSE_DEACTIVATE_ROUTINE :', requestDeactivate);
            if(requestDeactivate.errCode == 200){
                // const action = Actions.objectUpdateProperty(itemId, 'planner_activation_status', "deactivated");
                // dispatch(action);
                uObject?.updateStatus('planner_activation_status',"deactivated");
                refreshObjectAction(itemId, store).catch((err) => console.log(err));
            }else{
              const errCode = requestDeactivate?.errCode;
              const errMsg = requestDeactivate?.errMsg;
              const message = `${t(tns + ":" + "SERVER_ERROR")} : ${errCode} ${errMsg}`//'Un groupe avec ce nom existe déjà'
              myToast(message)
            }
  
          }

        }else{
          const message = t(tns + ":" + "ADD_TASK_ON_PLANNING")
          // navigation.navigate("HourlyRoutineStack", { screen :"RoutinePlanningScreen"})
          myToast(message)

        }

    };


    const checkTypes = {
      "LightEzsp":'light',
    }


    let checkType = plugOrLight || checkTypes[typeName] || typeName;
    console.log('CHECK TYPE :',uObject?.name,  checkType, typeName, isPlug, isLight, 'plug or light :', plugOrLight)

    if(isLight){
      checkType = 'light'
    }

    let iconRenderChoise = [iconsJs.customRoutineIcon];

    
    const handleExecuteRoutine = ()=>{
      console.log('Hello Execute Routine');
      setIsClicked(true)
      setTimeout(()=>{
        setIsClicked(false)
      },3000)
      uObject?.execute("EXECUTE"); 
    }
     return (

            <View style={[styles.container, {backgroundColor:'transparent'}]}>
                <View style={[bodyStyle || styles.body]}>
                      <Text 
                           numberOfLines={1} ellipsizeMode='tail'
                          style={{alignItems:'flex-start', justifyContent:'center' ,backgroundColor:'transparent', minWidth:130,
                          fontSize:14, fontWeight:"400", color:textColor, marginBottom:5}}
                          >
                              {uObject?.name.split("/").join(" ")}
                      </Text>
                      <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', backgroundColor:'transparent'}}>
                            <TouchableOpacity 
                                onPress={handleExecuteRoutine} 
                                activeOpacity={isClicked ?0.5 : 1}  
                                style={{width:42, height:42, backgroundColor:isClicked ? "transparent" :"transparent"}}
                              >
                                <iconsJs.customRoutineIcon.name color={isClicked ? "white" : textColor} bgColor={isClicked ? textColor : "white"} /> 
                            </TouchableOpacity>

                            <View style={{flex:1, backgroundColor:'transparent', justifyContent:'center', alignItems:'flex-end'}}>
                                  <Switch
                                    trackColor={{false: 'white', true:borderColor}}
                                    thumbColor={isEnabled ? 'white' : 'white'}
                                    ios_backgroundColor="#FFFFFF"
                                    onValueChange={onToggleSwitch}
                                    value={isEnabled}
                                  />
                            </View>
                      </View>
                </View>

            </View>
     )
 }

 const styles = StyleSheet.create({
  container : {
      flex:1,
      justifyContent:'center',
      alignItems:'flex-start',
      flexDirection:'column',
      marginHorizontal:5,
      marginVertical:5,
      height:70,
  },
  iconDisplay:{
      flexDirection:'row',
      margin:0,
      borderWidth:1,
      borderRadius:7,
      justifyContent:'space-evenly',
      //backgroundColor:'white'
  },

  body:{
    backgroundColor:'transparent',
    flexDirection:'column',
    alignItems:'flex-start', 
    justifyContent:'flex-start',
  }
})