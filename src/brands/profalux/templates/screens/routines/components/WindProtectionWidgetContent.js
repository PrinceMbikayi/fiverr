import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Switch} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import * as ApiObjects from "_api/objects"
import { useSelector, useDispatch } from 'react-redux';

import {iconsJs} from '_brand/utils/iconsJs';
import { myToast } from '_brand/templates/components/ui/myToast';
import {appRefresh} from '_actions/app';

export const WindProtectionWidgetContent = (props) => {

    const {itemId, bodyStyle} = props;

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const {theme} = useTheme();  
    const dispatch = useDispatch();

    const uObject = useObject(itemId);

    const activationStatus = uObject?.statuses?.__status
    const modeStatus = uObject?.statuses?.__mode

    // console.log("SHOW_ROUTINE_OBJECT_ECO_CONFORT :", uObject?.name, ":", uObject, activationStatus);
    
    const [isEnabled, setIsEnabled] = useState(activationStatus == "on" ? true : false);
    
    const borderColor = theme?.prflxBorderColor||'orange';
    const textColor = theme?.prflxTextColor||'black'

    const refreshShuttersWindProtectionFlag = ()=>{
      dispatch(appRefresh());
    }

    useEffect(()=> {
      // dispatch(appRefresh());
    },[isEnabled]);

    useEffect(()=> {
      console.log('MODE_STATUS_CHANGED :', modeStatus);
      if(modeStatus == "activated"){
        setIsEnabled(true);
      }
      if(modeStatus == "deactivated"){
        setIsEnabled(false);
      }
    },[modeStatus]);

    useEffect(()=> {
      console.log('ACTIVATION_STATUS_CHANGED :', activationStatus);
      //refreshShuttersWindProtectionFlag()
      // if(activationStatus == "on"){
      //   setIsEnabled(true);
      // }else{
      //   setIsEnabled(false);
      // }
      dispatch(appRefresh());
    },[activationStatus]);

    const modeIcon ={
      "wind":<iconsJs.windSockIcon.name color={textColor}/>,
    }


          const onToggleSwitch = async(value) => {
            console.log('ICI_Y');
              console.log('SWITCH_VALUE :', value, itemId);
              if(value == true){
                 setIsEnabled(value => true);
                const result = await ApiObjects.activateApp(itemId).catch((err) => console.log(err));
                if(result?.errCode == 200)  dispatch(appRefresh())
                console.log('RESULT_ACTIVATE_WIND_PROTECTION :', result);
              }else{
                 setIsEnabled(value => false);
                const result = await ApiObjects.deactivateApp(itemId).catch((err) => console.log(err));
                if(result?.errCode == 200)  dispatch(appRefresh())
                console.log('RESULT_DEACTIVATE_WIND_PROTECTION :', result);
              }
    
        };


     return (

            <View style={[styles.container, {backgroundColor:'transparent'}]}>
                <View style={[bodyStyle || styles.body]}>
                      <Text 
                           numberOfLines={1} ellipsizeMode='tail'
                          style={{alignItems:'flex-start', justifyContent:'center' ,backgroundColor:'transparent',
                          fontSize:14,minWidth:130, fontWeight:"400", color:textColor, marginTop:0,marginBottom:5}}
                          >
                              {uObject?.name||"MY_WIND_SAFETY"}
                      </Text>
                      <View style={{flexDirection:'row',marginLeft:10, justifyContent:'flex-start', alignItems:'center', backgroundColor:'transparent'}}>
                        <View style={{flexDirection:'row',marginLeft:5, justifyContent:'flex-start', alignItems:'center', backgroundColor:'transparent'}}>
                              <View 
                                  style={{width:42, height:42, backgroundColor:"transparent"}}
                                >
                                  {modeIcon["wind"]}
                              </View>
                        </View>

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