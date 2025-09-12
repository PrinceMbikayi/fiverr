import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { View, Text, StyleSheet, Switch} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import {iconsJs} from '_brand/utils/iconsJs';
export const PlugDetails = (props) => {

    const {itemId, bodyStyle, iconSize} = props;

    const { t, i18n } = useTranslation();
    const tns = "rollingShutter";8
    const {theme} = useTheme();  

    const uObject = useObject(itemId);
    const [isEnabled, setIsEnabled] = useState(false);
    const objectStatus = uObject?.status;
    const plugOrLight = uObject?.statuses?.__user_pluglight;
    const typeName = uObject?.objectDatas?.typeName;
    const components = uObject?.objectDatas?.components;
    console.log(" COMPONENTS :", components)


    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const iconthemeColor = theme?.prflxIconColor||'white';
    const iconthemebgColor = 'white';

                      
    let iconRenderChoise = [];

      plugOrLight == "light"  ? objectStatus=="on"? iconRenderChoise.push(iconsJs.lightOnIcon) : iconRenderChoise.push(iconsJs.lightOffIcon)
                              : objectStatus=="on"? iconRenderChoise.push(iconsJs.plugOnIcon) : iconRenderChoise.push(iconsJs.plugOffIcon)


    useEffect(() => {      
        //const  
        console.log("ITEM STATUS :", objectStatus);
        if(objectStatus == "on"){
          setIsEnabled(true);
        }else{
          setIsEnabled(false);
        }
      }, [objectStatus]);
 

      const onToggleSwitch = (value) => {
        setIsEnabled(value => !value);
        if(value == true){
          uObject?.execute("ON");
          uObject?.updateStatus('status',"on");
        }else{
          uObject?.execute("OFF")
          uObject?.updateStatus('status',"off");
        }
    };


     return (

            <View style={[styles.container, {backgroundColor:'transparent'}]}>
                <View style={[bodyStyle || styles.body]}>
                      <Text 
                          numberOfLines={1} ellipsizeMode='tail'
                          style={{alignItems:'flex-start', justifyContent:'center' ,backgroundColor:'transparent',
                          fontSize:14, fontWeight:"400", color:textColor, marginBottom:10,}}
                          >
                              {uObject?.name}
                      </Text>
                      <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', backgroundColor:'transparent'}}>
                            <View>
                                            <MultiPurposeWidgetLine 
                                              icons={iconRenderChoise} 
                                              sPressable = {false} 
                                              iconSize = {iconSize}
                                              iconColor = {iconthemeColor}
                                            />
                            </View>
                            <View style={{flex:1, backgroundColor:'transparent', justifyContent:'center', alignItems:'center'}}>
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
      marginHorizontal:15,
      marginVertical:25,
      height:70,
      //paddingVertical:20
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
    flex:1,flexDirection:'column',
    alignItems:'flex-start', 
    justifyContent:'flex-start',
  }
})