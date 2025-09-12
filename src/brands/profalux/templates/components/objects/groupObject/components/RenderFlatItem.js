import React, { useState, useEffect, useRef, useCallback} from 'react';
import { View, StyleSheet, Dimensions, Text} from 'react-native';
import { ToggleCard } from '_brand/templates/components/objects/common/ToggleCard';
import { useObject } from '_hooks/object';

import {iconsJs} from '_brand/utils/iconsJs';
import { useTheme } from '_theming/themeProvider'
import { RenderIconByState } from "_brand/templates/components/objects/common/RenderIconByState";
import {extractParamFromEcoConfort} from '_brand/templates/screens/routines/utils/ecoConfortUtils'


export const RenderFlatItem = (props)=>{
    const {item, index, rdeps, iconJs, iconSize, bgColor, callBack, active, isPressable, scanBgColor} =props;
    const uObject = useObject(item);
    const typeName = uObject?.objectDatas?.typeName;
    const shutterLevel = uObject?.statuses?.level
    const name = uObject?.objectDatas?.name;
    let ecoConfortMode;
    let myIconsize = typeName == "application"? iconSize + 15 : iconSize;
    let appName;
    let compositeIcon;


    const getCompositeIcon = ()=>{
      const groupTypeName = uObject?.objectDatas?.groupTypeName
      const traits = uObject?.objectDatas?.traits
      console.log('GET-GROUP-INFOS :',typeName,uObject?.objectDatas);
      if(!traits?.includes("OnOff")) return "groupShuttersIcon"
      if(groupTypeName == "heterogeneous") return "groupLightOnIcon"

      return groupTypeName == "SwitchEzsp"? "plugOnIcon" : "lightOnIcon"

    }

    if(typeName == "application"){
      appName = uObject?.objectDatas?.appName
      console.log('APP : ', uObject?.objectDatas);
      const ecoParams = uObject?.objectDatas?.parameters
      ecoConfortMode = extractParamFromEcoConfort(ecoParams, "vr_season")
      //console.log('ECO_CONFOR_MODE :', ecoConfortMode);

    }

    // console.log('FAVORIS_SCREEN :', typeName, uObject)
    const renderCount = useRef(1);
    // Increment the render count on every render
    useEffect(() => {
      renderCount.current += 1;
      console.log('COMPONENT_RENDERED_TIMES_1', renderCount.current, 'times');
    });



    const { theme } = useTheme();

    const borderColor = theme?.prflxBorderColor || 'orange';
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";
  

    useEffect(()=> {
    console.log('ACTIVE ITEM :', item, active)
    },[active]);

    const handleCallBack = useCallback(()=>{
      callBack()
    },[])

    const configApplication = {
      "Mode Éco Confort":ecoConfortMode == "summer" ? "ecoSummerIcon" : "ecoWinterIcon",
      "Protection vent":"windSockIcon"
    }

    const getIcon = (typeNameArg)=>{
      const defaultIcon = 'vrOpenIcon'
      let icons = {
        Rolling_Shutter_Ezsp:'vrOpenIcon',
        Shade_Ezsp:'vrOpenIcon',
        Rolling_Shutter_Profalux:'vr868Icon',
        Venetian_Shutter_Ezsp:'bsoOpenIcon',
        Gate_Ezsp:'gateSomewhereIcon',
        Gate_Toggle_Ezsp:'gateSomewhereIcon',
        Garage_Door_Ezsp:'garageOpenIcon',
        Garage_Door_Toggle_Ezsp:'garageOpenIcon',
        SesameGate:'garageOpenIcon',
        LightEzsp:'lightOnIcon',
        SwitchEzsp:'plugOnIcon',
        NetatmoStation:"indoorSensorIcon",
        NetatmoIndoorProbe:"indoorSensorIcon",
        NetatmoOutdoorProbe:"outdoorSensorIcon",
        NetatmoRainGauge:"rainGaugeSensorIcon",
        NetatmoWindGauge:"windGaugeSensorIcon",
        EzspProbe:'sensorTLIcon',
        Associations:"customRoutineIcon",
        composite: getCompositeIcon(),
        application: configApplication[appName],
        undefined:"vrOpenIcon"



  
      }
      const icon = icons[typeName] || defaultIcon;
      const iconComponent = iconsJs[icon].name
      return iconComponent
    }

    // <RenderIconByState levelState={Number(shutterLevel)} typeName={typeName} iconColor={textColor} iconSize={73}/>
    let iconView = getIcon(typeName)
    return(
      
      <View style={styles.toggleWrapper} key={index}>
        {(typeName != undefined)&&
                    <ToggleCard 
                      isPressable={isPressable||true}
                      id ={item}
                      IconJS ={iconView} 
                      iconSize={myIconsize || 30} 
                      setActive = {active}
                      borderColor={active ? borderColor : "transparent"}
                      borderWidth={active ? 1.2 : 0}
                      iconColor={active? textColor : textColor}
                      //bgColor={active? (uObject?.connected ? "white" : "#CCC" ) : "#DBDADA"} 
                      bgColor={scanBgColor ? scanBgColor : active? (uObject?.connected ? "white" : "#CCC" ) : "#DBDADA"} 
                      titleColor = {active? textColor : textColor }
                      title={name}
                      fontSize={14}
                      fontWeight={active ? "700" : "400"}
                      onPressHandler = {callBack}
                      // levelState={shutterLevel} 
                      // typeName={typeName}
                    />
        }
      </View>
    )

  }

  //export const RenderFlatItem  = React.memo(ToMemoizedRenderFlatItem)


  const styles = StyleSheet.create({
  
    toggleWrapper:{
      flex:1,
      backgroundColor:"transparent",
      borderRadius:12,
      paddingVertical:5,
      marginHorizontal:5,
      justifyContent:'space-evenly',
      alignItems:'center'
    }
  })
  