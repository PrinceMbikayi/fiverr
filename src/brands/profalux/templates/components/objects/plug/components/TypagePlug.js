import '_brand/templates/components/objects/common/locales'
import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { View, Text, StyleSheet, Switch} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';


import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import {iconsJs} from '_brand/utils/iconsJs';
import { SelectList } from 'react-native-dropdown-select-list'

export const TypagePlug = (props) => {

    const {itemId, bodyStyle, iconSize, handleToggleSwitch} = props;

    const { t, i18n } = useTranslation();
    const tns = "common";
    const {theme} = useTheme();  

    const uObject = useObject(itemId);

    const [plugStatus, setPlugStatus] = useState(uObject?.status);
    const [active, setActive] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    const [switchChecBox, setSwitchChecBox] = useState(false)
    const [lampCheckBox, setLampCheckBox] = useState(false);
    //const [statusIcon, setStatusIcon] = useState([]);
    const plugOrLight = uObject?.statuses?.__user_pluglight || "plug";
    //const plugOrLight = uObject?.
   // const iconRenderChoise = isPlug ? [iconsJs.plugOnIcon] : [iconsJs.lightOnIcon]  


    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const iconthemeColor = theme?.prflxIconColor||'white';
    const iconthemebgColor = 'white';


    console.log("HERE I AM ID NUMBER :", itemId)
   // console.log("HERE I AM TYPE NAME :", uObject?.objectDatas?.typeName)
    // //const plugStatus =  uObject?.status


    useEffect(()=> {
    
    },[isEnabled]);

    useEffect(()=>{
      console.log("CHECK BOX VALUE :", switchChecBox, lampCheckBox)
  },[switchChecBox, lampCheckBox])

    useEffect(() => {      
        //const  
        console.log("__USER_pluglight :", plugOrLight, uObject)
        if(plugOrLight == "plug"){
          setIsEnabled(false);
        }else{
          setIsEnabled(true);
        }
      }, [plugOrLight]);
 

      const onToggleSwitch = (value) => {
        setIsEnabled(value => !value);
        console.log("Switch value :", value);
        if(value == true){
          handleToggleSwitch('light')
          // Type is plug : send info to server
          // uObject?.addStatus("__user_pluglight",'plug')
          // uObject?.updateStatus('__user_pluglight',"plug");
        }else{
          handleToggleSwitch('plug')
          // uObject?.addStatus("__user_pluglight",'light')
          // uObject?.updateStatus('__user_pluglight',"light");
        }
    };

    const GrayView = ()=>{
      return (
        <View style={{width:40, height:40, borderRadius:7, backgroundColor:'green'}}>
        </View>
      )
    }

    const habitPrise = (switchBool, lightBool)=>{
      console.log(" Nature of Booleans :", switchBool, lightBool)
      if(switchBool == true){
        //handleToggleSwitch('plug')
        setLampCheckBox(false)
      }else{
        //handleToggleSwitch('light')
        setSwitchChecBox(false)
      }
    }

     return (
            <View style={[styles.container, {backgroundColor:'transparent'}]}>
                <View style={[bodyStyle || styles.body]}>
                      <View style={{flexDirection:'column', justifyContent:'center',alignItems:'center', backgroundColor:'transparent'}}>
                          <Text 
                              style={{justifyContent:'center' ,backgroundColor:'transparent',
                              fontSize:14, fontWeight:"bold", flexWrap:'wrap', color:isEnabled? "#dddddd" : textColor}}
                              >
                                  {t(tns+":"+"PLUG_COVER_PLUG")}
                          </Text>

                          {/* <View style={{marginVertical:0, flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                              <CheckBox
                                  disabled={false}
                                  value={switchChecBox}
                                  onValueChange={(newValue) => habitPrise(newValue, lampCheckBox)}
                              />
                          </View> */}
                            <View>
                                <MultiPurposeWidgetLine 
                                        icons={[iconsJs.plugOnIcon]} 
                                        isPressable = {false} 
                                        iconSize = {iconSize}
                                        iconColor = {isEnabled? "#dddddd" : textColor}
                                        iconBgColor = {isEnabled? 'transparent' : 'transparent'}
                                        iconWrapperStyle = {[styles.iconDisplay, {borderColor:'transparent'}]}
                                        />
                            </View>
                      </View>

                      <View style={{}}>
                          <Switch
                            trackColor={{false: '#dddddd', true: textColor}}
                            thumbColor={isEnabled ? 'white' : 'white'}
                            ios_backgroundColor={textColor}
                            onValueChange={onToggleSwitch}
                            value={isEnabled}
                          />
                      </View>

                      <View style={{flexDirection:'column',  justifyContent:'center',alignItems:'center', backgroundColor:'transparent'}}>
                          <Text 
                              style={{justifyContent:'center' ,backgroundColor:'transparent',
                              fontSize:14, fontWeight:"bold", flexWrap:'wrap', color:isEnabled? textColor:'#dddddd' }}
                              >
                                  {t(tns+":"+"PLUG_COVER_LIGHT")}
                          </Text>

                          {/* <View style={{marginVertical:0, flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                              <CheckBox
                                  disabled={false}
                                  value={lampCheckBox}
                                  onValueChange={(newValue) => habitPrise(switchChecBox, newValue)}
                              />
                          </View> */}
                            <View>
                                <MultiPurposeWidgetLine 
                                        icons={[iconsJs.lightOnIcon]} 
                                        isPressable = {false} 
                                        iconSize = {iconSize}
                                        iconColor = {isEnabled? textColor : '#dddddd'}
                                        iconBgColor = {isEnabled? 'transparent' : 'transparent'}
                                        // iconColor = {isEnabled? 'orange'||iconthemebgColor: iconthemeColor}
                                        // iconBgColor = {isEnabled? iconthemeColor : iconthemebgColor}
                                        iconWrapperStyle = {[styles.iconDisplay, {borderColor:'transparent'}]}
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
      //marginVertical:10,
  },
  iconDisplay:{
      flexDirection:'row',
      margin:0,
      backgroundColor:'gray',
      borderWidth:1,
      borderRadius:7,
      justifyContent:'space-evenly',
      //backgroundColor:'white'
  },

  body:{
    flex:1,
    width:'60%',
    backgroundColor:'transparent',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  }
})