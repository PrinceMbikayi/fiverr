import '_brand/templates/components/objects/common/locales'
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
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
import { RoutineWidgetIcon } from '_brand/templates/components/objects/common/RoutineWidgetIcon';

export const LightPlugRoutine = (props) => {

    const {itemId, bodyStyle, iconSize, isPlug, isLight, isRoutine} = props;

    const { t, i18n } = useTranslation();
    const tns = "common";
    const {theme} = useTheme();  
    const dispatch = useDispatch();


    const uObject = useObject(itemId);

    console.log("UUUUU :", props)

    const [plugStatus, setPlugStatus] = useState(uObject?.status);
    const [active, setActive] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [statusForRoutine, setStatusForRoutine] = useState("");
    
    
    
    //const [statusIcon, setStatusIcon] = useState([]);
    const typeName = uObject?.objectDatas?.typeName;
    const objectStatus = uObject?.statuses?.status;
    //const singleObjtatus = uObject?.statuses?.status;
    //const objectStatus = typeName == 'composite' ? uObject?.objectDatas?.statusDictionary?.status : singleObjtatus;

    const plugOrLight = uObject?.statuses?.__user_pluglight;
    //const groupComponents = typeName == 'composite' ? uObject?.objectDatas?.components || [] : [];
    // const componentTypes = typeName == 'composite' ? uObject?.objectDatas?.componentTypes || [] : [];
    
    //const {groups} = (uObject?.objectDatas?.rdependencies != undefined) ? uObject?.objectDatas?.rdependencies : {'groups':[]}
    

   


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
          //uObject?.updateStatus('status',"on");
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


      const onToggleSwitch = (value) => {

        //console.log("OBJECT ALONE :",  groups)
        setIsEnabled(value => !value);
        console.log("Switch value :", value, typeName);
        console.log("Type : ", typeName)
        executeMe(value)

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
        //uObject?.updateStatus(config[Number(value)]?.status);

      }
    }

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
    let iconForRoutine = [];

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
                            {/* <View>
                                    <MultiPurposeWidgetLine 
                                      icons={iconsList} 
                                      isPressable = {false} 
                                      iconSize = {iconSize}
                                      iconColor = {iconthemeColor}
                                      //iconBgColor = {isEnabled? iconthemeColor : iconthemebgColor}
                                      iconWrapperStyle = {{marginLeft:-8}}
                                      //callBackForPlugLight={callBackForPlugLight}
                                    />
                            </View> */}
                            <View  
                              style={{ flexDirection: 'row', width:'38%',height:'100%', justifyContent: 'space-between', alignItems: 'center', 
                                      marginLeft: 0, backgroundColor: 'transparent',
                                  }}
                              >
                              <RoutineWidgetIcon itemId={itemId} iconSize={42} isRound ={true} withBorder={false}/>
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
                                        //iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                      />
                                  </View>
                                </View>
                            </View>
                      </View>
                </View>

            </View>
     )
 }
 //export default LightPlugRoutine;

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
