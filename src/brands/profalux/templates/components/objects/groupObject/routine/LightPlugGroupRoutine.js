import '_brand/templates/components/objects/common/locales'
import React from 'react';
import {useEffect,useState} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import {iconsJs} from '_brand/utils/iconsJs';
import { useDispatch } from 'react-redux';
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";

export const LightPlugGroupRoutine = (props) => {

    const {itemId, bodyStyle, iconSize, isPlug, isLight, isRoutine} = props;

    const { t, i18n } = useTranslation();
    const tns = "common";
    const {theme} = useTheme();  
    const dispatch = useDispatch();


    const uObject = useObject(itemId);

    console.log("UUUUU :", props)
    const [isEnabled, setIsEnabled] = useState(false);
    const [statusForRoutine, setStatusForRoutine] = useState("");
    
    
  
    const typeName = uObject?.objectDatas?.typeName;
    const objectStatus = uObject?.statuses?.status;

    const plugOrLight = uObject?.statuses?.__user_pluglight;
   
    const textColor = theme?.prflxTextColor||'black'
    const iconthemeColor = theme?.prflxIconColor||'white';

  useEffect(()=> {
  
  },[statusForRoutine]);

    useEffect(() => {  

        console.log("ITEM STATUS :", objectStatus);
        if(objectStatus == "on"){
          setIsEnabled(true);
          console.log("SWITCH ON :", isEnabled)
        }
        if(objectStatus == 'off'){
          uObject?.updateStatus('status',"off");
          setIsEnabled(false);
          console.log("SWITCH OFF :", isEnabled)
        }
      }, [objectStatus]);

    const handleIconPress = ()=>{}



    const checkTypes = {
      "LightEzsp":'light',
    }


    let checkType = plugOrLight || checkTypes[typeName] || typeName;
    console.log('CHECK TYPE :',uObject?.name,  checkType, typeName, isPlug, isLight, 'plug or light :', plugOrLight)

    if(isLight){
      checkType = 'light'
    }

    let iconRenderChoise = [];

    const icons = [iconsJs.onIcon, iconsJs.offIcon]
    let iconsList = typeName == "LightEzsp"?[iconsJs.lightOffIcon] : [iconsJs.plugOffIcon]

    checkType == "light"  ? objectStatus=="on"? iconRenderChoise.push(iconsJs.lightOnIcon) : iconRenderChoise.push(iconsJs.lightOffIcon)
                            : objectStatus=="on"? iconRenderChoise.push(iconsJs.plugOnIcon) : iconRenderChoise.push(iconsJs.plugOffIcon)


     return (

            <View style={[styles.container, {backgroundColor:'transparent'}]}>
                <View style={[bodyStyle || styles.body]}>
                      <Text 
                           numberOfLines={1} ellipsizeMode='tail'
                          style={{alignItems:'flex-start', justifyContent:'center' ,backgroundColor:'transparent',
                          fontSize:14, fontWeight:"400", color:textColor, marginBottom:5}}
                          >
                              {uObject?.name}
                      </Text>
                      <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', backgroundColor:'transparent'}}>
                            <View>
                                    <MultiPurposeWidgetLine 
                                      icons={iconsList} 
                                      isPressable = {false} 
                                      iconSize = {40}
                                      iconColor = {iconthemeColor}
                                      iconWrapperStyle = {{marginLeft:-8}}
                                    />
                            </View>
                            <View>

                                <View>
                                    <View>
                                    <RoutineWidgetLine
                                        icons={icons}
                                        iconColor = {iconthemeColor}
                                        itemId={itemId}
                                        isPressable={true}
                                        onPress={handleIconPress}
                                        onLongPress={handleIconPress}
                                      />
                                  </View>
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
  },

  body:{
    backgroundColor:'transparent',
    flexDirection:'column',
    alignItems:'flex-start', 
    justifyContent:'flex-start',
  }
})
