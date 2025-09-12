import '_brand/templates/screens/routines/locales'
import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { View, Text, StyleSheet, Switch, Pressable, TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';

import {iconsJs} from '_brand/utils/iconsJs';
import * as Durin from '_api/durin';
import { useDispatch, useStore} from 'react-redux';
import * as ApiObjects from "_api/objects"
import { refreshObjectAction } from '_actions/asyncActions';
import { myToast } from '_brand/templates/components/ui/myToast';
import EcoConfortSummer from '_brand/images/icons/app/profaluxIconJs/EcoConfortSummer'
import EcoConfortWinter from '_brand/images/icons/app/profaluxIconJs/EcoConfortWinter'
import {extractParamFromEcoConfort} from '_brand/templates/screens/routines/utils/ecoConfortUtils'
import { color } from 'react-native-reanimated';
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'

export const EcoConfortWidgetContent = (props) => {

    const {itemId, bodyStyle, iconSize, isPlug, isLight} = props;

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const navigation = useNavigation();
    const route = useRoute();
    const {theme} = useTheme();  
    const dispatch = useDispatch();
    const store = useStore()


    const uObject = useObject(itemId);
    const parameters = uObject?.objectDatas?.parameters
    const activationStatus = uObject?.statuses?.__mode
    const ecoMode = extractParamFromEcoConfort(parameters, 'vr_season')||"default";
    console.log("SHOW_ROUTINE_OBJECT_ECO_CONFORT :", itemId, activationStatus);

    const [isEnabled, setIsEnabled] = useState(activationStatus == "deactivated" ? false : true);
    const [isClicked, setIsClicked] = useState(false);
    
    
    const typeName = uObject?.objectDatas?.typeName;
    
    const plugOrLight = uObject?.statuses?.__user_pluglight;
    
    
    
    
    
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const iconthemeColor = theme?.prflxIconColor||'white';
    const iconthemebgColor = 'white';


    const modeIcon ={
      "winter":<iconsJs.ecoWinterIcon.name color={textColor}/>,
      "summer":<iconsJs.ecoSummerIcon.name color={textColor}/>,
      "default":<iconsJs.ecoSummerIcon.name color={textColor}/>
    }

    useEffect(()=> {
      console.log('isClicked :', isClicked);
    },[isClicked]);

    useEffect(()=> {
    
    },[isEnabled]);


      useEffect(()=> {
        if(activationStatus == "deactivated"){
          setIsEnabled(false);
        }else{
          setIsEnabled(true);
        }
      },[activationStatus]);
 

    const myAction={
      "activate":{name:"ACTIVATE_OBJECT", mArgs:[{name:"objectId", value:itemId}]},
      "deactivate":{name:"DEACTIVATE_OBJECT", mArgs:[{name:"objectId", value:itemId}]}
    }

      const onToggleSwitch = async(value) => {
          console.log('SWITCH_VALUE :', value, itemId);
          setIsEnabled(value => !value);
          if(value == true){
            const result = await ApiObjects.activateApp(itemId).catch((err) => console.log(err));
            console.log('RESULT_ACTIVATE_ECO_CONFORT :', result);
          }else{
            const result = await ApiObjects.deactivateApp(itemId).catch((err) => console.log(err));
            console.log('RESULT_DEACTIVATE_ECO_CONFORT :', result);
          }

    };


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
                          style={{alignItems:'flex-start', justifyContent:'center' ,backgroundColor:'transparent',
                          fontSize:14,minWidth:130, fontWeight:"400", color:textColor, marginTop:5,marginLeft:0}}
                          >
                              {uObject?.name}
                      </Text>
                      <View style={{flexDirection:'row',marginLeft:-10, justifyContent:'flex-start', alignItems:'center', backgroundColor:'transparent'}}>
                            <TouchableOpacity 
                                onPress={handleExecuteRoutine} 
                                activeOpacity={isClicked ?0.5 : 1}  
                                style={{width:55, height:55,marginLeft:5, backgroundColor:isClicked ? "transparent" :"transparent"}}
                              >
                                {modeIcon[ecoMode]}
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
  body:{
    backgroundColor:'transparent',
    flexDirection:'column',
    alignItems:'flex-start', 
    justifyContent:'flex-start',
  }
})