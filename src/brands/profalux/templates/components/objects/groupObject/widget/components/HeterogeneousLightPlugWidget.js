import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { View, Text, StyleSheet, Switch} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import {iconsJs} from '_brand/utils/iconsJs';
import * as Durin from '_api/durin';

import { useSelector,useDispatch } from 'react-redux';
import { objectUpdateProperty,updateStatus as updateStatusAction} from '_actions/objects';
import { Api } from '_api';
import { RenderGroupIconByState } from "_brand/templates/components/objects/common/RenderGroupIconByState";



export const HeterogeneousLightPlugWidget = (props) => {

    const {itemId, bodyStyle, iconSize} = props;
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const {theme} = useTheme();  
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const iconthemeColor = theme?.prflxIconColor||'white';
    const iconthemebgColor = 'white';


    const [isEnabled, setIsEnabled] = useState(false);
    


    //-----Group infos------
    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    const singleObjtatus = uObject?.statuses?.status;
    const objectStatus = typeName == 'composite' ? uObject?.objectDatas?.statusDictionary?.status : singleObjtatus;

    const groupComponents = typeName == 'composite' ? uObject?.objectDatas?.components || [] : [];

    const groupStatus = uObject?.objectDatas?.statusDictionary?.groupStatus
    const uniType = uObject?.objectDatas?.uniType
    const groupTypeName = uObject?.objectDatas?.groupTypeName
    const groupComponentTypes = uObject?.objectDatas?.componentTypes || []

    console.log('TEST_EST :', groupStatus,uniType, groupTypeName, groupComponentTypes );

    const updateServerStatus = async(id, name, value) =>{
      console.log("UPDATE_STATUS_RESPONSE 1:", id, name, value)
      const res = await Api.updateAddedServerStatus(id,name,value);
      console.log("UPDATE_STATUS_RESPONSE 2 :", res)
    }

    const onAction = async (id,value) => {
        const statusBlock = {name:value}
        const actions = {actions:[statusBlock]};
        console.log("executeActions actions",actions)
        res = await Durin.update("object",id,actions)
        //console.log("new Execute",res);
        return res;
    }


    useEffect(()=>{
      if(groupStatus == 'on'){
        setIsEnabled(true)
      }else{
        setIsEnabled(false)
      }
    },[groupStatus])

    useEffect(()=>{

    },[isEnabled])


    const onToggleSwitch = async(value) => {

      setIsEnabled(value => !value);
      console.log("SWITCH TRUE:", value)

      if(value){
        uObject?.execute("ON");

      }else{
        uObject?.execute("OFF");
      }
      

    };



     return (

            <View style={[styles.container, {backgroundColor:'transparent'}]}>
                <View style={[bodyStyle || styles.body]}>
                      <Text 
                            numberOfLines={1} ellipsizeMode='tail'
                            style={{alignItems:'flex-start', justifyContent:'center' ,backgroundColor:'transparent',
                            fontSize:14, fontWeight: "400", color:textColor,flexWrap:'wrap', marginBottom:15, marginLeft:8, flexShrink:1}}
                          >
                              {uObject?.name}
                      </Text>
                      <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                            <View>
                                  <RenderGroupIconByState 
                                      iconColor={textColor}
                                      iconSize={35}
                                      groupId={itemId}
                                      groupTypeName={groupTypeName}
                                      uniType={uniType}
                                      componentTypes={groupComponentTypes}
                                      groupStatus={groupStatus}
                                  />
                              
                            </View>
                            <View style={{marginLeft:27}}>
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