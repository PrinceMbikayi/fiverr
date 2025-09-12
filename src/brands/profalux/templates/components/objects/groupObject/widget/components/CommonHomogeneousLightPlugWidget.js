import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { View, Text, StyleSheet, Switch} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import {iconsJs} from '_brand/utils/iconsJs';
import { objectUpdateProperty,updateStatus as updateStatusAction} from '_actions/objects';
import * as Durin from '_api/durin';
import { useSelector,useDispatch } from 'react-redux';
import {updateStatus,updateGroupStatus} from '_actions/objects';
import { Api } from '_api';
import { RenderGroupIconByState } from "_brand/templates/components/objects/common/RenderGroupIconByState";

export const CommonHomogeneousLightPlugWidget = (props) => {

    const {itemId, bodyStyle, titlePaddingBottom, titleFontSize, titleFontWeight, iconSize, isPlug, isLight} = props;

    const { t, i18n } = useTranslation();
    const {theme} = useTheme();  
    const dispatch = useDispatch();

    const uObject = useObject(itemId);

    const [plugStatus, setPlugStatus] = useState(uObject?.status);
    const [active, setActive] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const typeName = uObject?.objectDatas?.typeName;
    const plugOrLight = uObject?.statuses?.__user_pluglight;
    const groupComponents = typeName == 'composite' ? uObject?.objectDatas?.components || [] : [];
    const componentTypes = typeName == 'composite' ? uObject?.objectDatas?.componentTypes || [] : [];

    const groupStatus = uObject?.objectDatas?.statusDictionary?.groupStatus
    const uniType = uObject?.objectDatas?.uniType
    const groupTypeName = uObject?.objectDatas?.groupTypeName
    const groupComponentTypes = uObject?.objectDatas?.componentTypes || []

    const borderColor = theme?.prflxBorderColor||'orange';
    const textColor = theme?.prflxTextColor||'black'
    const iconthemeColor = theme?.prflxIconColor||'white';

    const updateServerStatus = async(id, name, value) =>{
      console.log("UPDATE_STATUS_RESPONSE 1:", id, name, value)
      const res = await Api.updateAddedServerStatus(id,name,value);
      console.log("UPDATE_STATUS_RESPONSE 2 :", res)
    }


    
    useEffect(() => {      
        console.log("ITEM STATUS GROUP HETERO:", groupStatus);
        if(groupStatus == "on"){
          setIsEnabled(true);
        }
        if(groupStatus == 'off'){
          setIsEnabled(false);
        }
      }, [groupStatus]);

      useEffect(()=>{

      },[isEnabled])

      const onToggleSwitch = async (value) => {
        setIsEnabled(value => !value);
        console.log("Switch value :", value, typeName);
        console.log("Type : ", typeName)
        if(value == true){
          uObject?.execute("ON")

            groupComponents.map( (item) =>{
              const action = updateStatus(item,'status','on')
              dispatch(action)
            })

        }else{
          uObject?.execute("OFF")
            groupComponents.map( (item) =>{
              const action = updateStatus(item,'status','off')
              dispatch(action)
            })

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

    let iconRenderChoise = [];

    if(componentTypes.length > 1){
      groupStatus=="on"? iconRenderChoise.push(iconsJs.groupLightOnIcon) : iconRenderChoise.push(iconsJs.groupLightOffIcon)
    }else{
      
      checkType == "light"  ? groupStatus=="on"? iconRenderChoise.push(iconsJs.lightOnIcon) : iconRenderChoise.push(iconsJs.lightOffIcon)
                              : groupStatus=="on"? iconRenderChoise.push(iconsJs.plugOnIcon) : iconRenderChoise.push(iconsJs.plugOffIcon)  
    }

     return (

            <View style={[styles.container, {backgroundColor:'transparent'}]}>
                <View style={[bodyStyle || styles.body]}>
                  <View>
                      <Text 
                           numberOfLines={1} ellipsizeMode='tail'
                          style={{alignItems:'flex-start', justifyContent:'center' ,backgroundColor:'transparent',
                          fontSize: titleFontSize || 14, fontWeight:titleFontWeight || "400", color:textColor,marginLeft:8, marginBottom: titlePaddingBottom || 5}}
                          >
                              {uObject?.name}
                      </Text>
                  </View>
                      <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', backgroundColor:'transparent'}}>
                            <View>
                                  <RenderGroupIconByState 
                                      iconColor={iconthemeColor}
                                      iconSize={iconSize}
                                      groupId={itemId}
                                      groupTypeName={groupTypeName}
                                      uniType={uniType}
                                      componentTypes={groupComponentTypes}
                                      groupStatus={groupStatus}
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