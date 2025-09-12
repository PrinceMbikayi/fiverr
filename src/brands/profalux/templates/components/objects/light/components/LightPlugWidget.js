import '_brand/templates/components/objects/common/locales'
import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { View, Text, StyleSheet, Switch} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import {iconsJs} from '_brand/utils/iconsJs';
import {updateStatus as updateStatusAction} from '_actions/objects';
import * as Durin from '_api/durin';
import { useSelector,useDispatch } from 'react-redux';
export const LightPlugWidget = (props) => {

    const {itemId, bodyStyle, iconSize, isPlug, isLight, isRoutine, switchScale, textSize, textWeight, pictoSwitchDistance} = props;

    const { t, i18n } = useTranslation();
    const tns = "common";
    const {theme} = useTheme();  
    const dispatch = useDispatch();


    const uObject = useObject(itemId);

    const [plugStatus, setPlugStatus] = useState(uObject?.status);
    const [active, setActive] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [statusForRoutine, setStatusForRoutine] = useState("");
    
    
    
    //const [statusIcon, setStatusIcon] = useState([]);
    const typeName = uObject?.objectDatas?.typeName;
    const objectStatus = uObject?.statuses?.status;
    const plugOrLight = uObject?.statuses?.__user_pluglight;
 
  
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const iconthemeColor = theme?.prflxIconColor||'white';
    const iconthemebgColor = 'white';

    const switchValueRef = useRef(false); 



  //   useEffect(()=> {
  //     console.log("USE SCENARIO:",actionsByItemId)
  // },[actionsByItemId]);


  useEffect(()=> {
  
  },[statusForRoutine]);

    useEffect(() => {  

        console.log("ITEM STATUS :", objectStatus);
        if(objectStatus == "on"){
          //uObject?.execute("ON")
          uObject?.updateStatus('status',"on");
          setIsEnabled(true);
          console.log("SWITCH ON :", isEnabled)
        }
        if(objectStatus == 'off'){
          //uObject?.execute("OFF");
          uObject?.updateStatus('status',"off");
          setIsEnabled(false);
          console.log("SWITCH OFF :", isEnabled)
        }
      }, [objectStatus]);
 
      const onAction = async (id,value) => {
        const statusBlock = {name:value}
        const actions = {actions:[statusBlock]};
        console.log("executeActions actions",actions)
        res = await Durin.update("object",id,actions)
        //console.log("new Execute",res);
        return res;
    }


    //split("/").pop()

    // const callBackForPlugLight = (state)=>{
    //   console.log("VIEW_STATE_ON_OFF_ROUTINE ACTION")
    // }
      const onToggleSwitch = (value) => {

        //console.log("OBJECT ALONE :",  groups)
        setIsEnabled(value => !value);
        console.log("Switch value :", value, typeName);
        console.log("Type : ", typeName)
        if(value){
          uObject?.execute("ON");
          //uObject?.updateStatus('status',"on");
          const actionON = updateStatusAction(itemId,"status","on")
          dispatch(actionON)
          //updateStatusAction
        }else{
          uObject?.execute("OFF");
          //uObject?.updateStatus('status',"off");
          const actionON = updateStatusAction(itemId,"status","off")
          dispatch(actionON)
        }
        //executeMe(value)

    };


    const executeMe = (value)=>{
      if(isRoutine){
        // No execution
        console.log("ISROUTINE_EXEC :", isRoutine)
      }else{
        const config = [
          {action:"OFF", status:"off"},
          {action:"ON", status:"on"}
        ];

        uObject?.execute(config[Number(value)]?.action)
        uObject?.updateStatus(config[Number(value)]?.status);

      }
    }

    const handleIconPress = ()=>{

    }



    const iconst = [
      iconsJs.upIcon,
      iconsJs.favIcon,

  ]


    const checkTypes = {
      "LightEzsp":'light',
    }


    let checkType = plugOrLight || checkTypes[typeName] || typeName;
    console.log('CHECK TYPE :',uObject?.name,  checkType, typeName, isPlug, isLight, 'plug or light :', plugOrLight)

    if(isLight){
      checkType = 'light'
    }

    let iconRenderChoise = [];
    let iconForRoutine = [];

    let iconsList = typeName == "LightEzsp"?[iconsJs.lightOffIcon] : [iconsJs.plugOffIcon]

    checkType == "light"  ? objectStatus=="on"? iconRenderChoise.push(iconsJs.lightOnIcon) : iconRenderChoise.push(iconsJs.lightOffIcon)
                            : objectStatus=="on"? iconRenderChoise.push(iconsJs.plugOnIcon) : iconRenderChoise.push(iconsJs.plugOffIcon)



     return (

            <View style={[styles.container, {backgroundColor:'transparent'}]}>
                <View style={[bodyStyle || styles.body]}>
                      <View>
                        <Text 
                            numberOfLines={1} ellipsizeMode='tail'
                            style={{alignItems:'flex-start', justifyContent:'center' ,backgroundColor:'transparent',
                            fontSize:textSize||14, fontWeight: textWeight||"400", color:textColor,flexWrap:'wrap', marginBottom:15, marginLeft:8, flexShrink:1}}
                            >
                                {uObject?.name}
                        </Text>
                      </View>
                      <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', backgroundColor:'transparent'}}>
                            <View>
                                {isRoutine?
                                    <MultiPurposeWidgetLine 
                                      icons={iconsList} 
                                      isPressable = {false} 
                                      iconSize = {iconSize}
                                      iconColor = {iconthemeColor}
                                      //iconBgColor = {isEnabled? iconthemeColor : iconthemebgColor}
                                      iconWrapperStyle = {{marginLeft:-8}}
                                      //callBackForPlugLight={callBackForPlugLight}
                                    />
                                    :
                                    <MultiPurposeWidgetLine 
                                      icons={iconRenderChoise} 
                                      isPressable = {false} 
                                      iconSize = {iconSize}
                                      iconColor = {iconthemeColor}
                                      //iconBgColor = {isEnabled? iconthemeColor : iconthemebgColor}
                                      iconWrapperStyle = {{marginLeft:-8}}
                                    />
                                }
                            </View>
                            <View style={{flex:1, backgroundColor:'transparent', justifyContent:'center', alignItems:'center', marginLeft:pictoSwitchDistance||0}}>

                                <View>
                                  <Switch
                                      trackColor={{false: 'white', true:borderColor}}
                                      thumbColor={isEnabled ? 'white' : 'white'}
                                      ios_backgroundColor="#FFFFFF"
                                      onValueChange={onToggleSwitch}
                                      value={isEnabled}
                                      style={{ transform: [{ scaleX: switchScale||1 }, { scaleY: switchScale||1 }] }}
                                  />
                                </View>
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
