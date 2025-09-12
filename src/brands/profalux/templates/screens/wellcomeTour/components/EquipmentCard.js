import '_brand/templates/screens/wellcomeTour/locales'
import React, { useState, useEffect, useRef} from 'react';
import { View, StyleSheet, Dimensions} from 'react-native';
import { ToggleCard } from '_brand/templates/components/objects/common/ToggleCard';
import { useObject } from '_hooks/object';
import { useTranslation } from 'react-i18next';

import {iconsJs} from '_brand/utils/iconsJs';

//const { width } = Dimensions.get('window')

export const EquipmentCard = (props)=>{
    const {itemId, iconSize, iconColor, bgColor, callBack} =props;
    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    //console.log("TYPENAME : ", typeName)
    const name = uObject?.objectDatas?.name;

    const { t, i18n } = useTranslation();
    const tns = "wellcomeTour";
  


    const getIcon = (typeNameArg)=>{

      let typeName = typeNameArg;
      if(typeName == 'composite'){
        const componentTypes = uObject?.objectDatas?.componentTypes;
        console.log("COMPPPPPPP : ", uObject)
        if(componentTypes && componentTypes.length > 0){
          typeName = componentTypes[0]
        }

        console.log("COMPOSITE COMPONENT TYPES :", typeName)
      }
      const defaultIcon = 'vrOpenIcon'
      let icons = {
        Rolling_Shutter_Ezsp:'vrOpenIcon',
        Shade_Ezsp:'vrOpenIcon',
        Rolling_Shutter_Profalux:'vr868Icon',
        Venetian_Shutter_Ezsp:'bsoOpenIcon',
        LightEzsp:'lightOnIcon',
        SwitchEzsp:'plugOnIcon',
        Gate_Ezsp:'gateSomewhereIcon',
        Gate_Toggle_Ezsp:'gateSomewhereIcon',
        Garage_Door_Ezsp:'garageOpenIcon',
        Garage_Door_Toggle_Ezsp:'garageOpenIcon',
        NetatmoStation:"indoorSensorIcon",
        NetatmoIndoorProbe:"indoorSensorIcon",
        NetatmoOutdoorProbe:"outdoorSensorIcon",
        NetatmoRainGauge:"rainGaugeSensorIcon",
        NetatmoWindGauge:"windGaugeSensorIcon",
        EzspProbe:'sensorTLIcon',
      }
      const icon = icons[typeName] || defaultIcon;
      const iconComponent = iconsJs[icon].name
      return iconComponent
    }

    let iconView = getIcon(typeName)


    return(
      
      <View style={styles.toggleWrapper}>
        {(typeName != undefined)&&
                    <ToggleCard 
                    id ={itemId}
                    IconJS ={iconView} 
                    iconSize={iconSize || 25} 
                    iconColor={iconColor }
                    bgColor={ bgColor} 
                    title={t(tns + ":" + "TESTER") || name}
                    titleColor = {iconColor }
                    onPressHandler = {callBack}
                    />
        }
      </View>
    )

  }


  const styles = StyleSheet.create({
  
    toggleWrapper:{
      flex:1,
      width:'100%',
      backgroundColor:"transparent",
      borderRadius:12,
      paddingVertical:5,
      justifyContent:'space-evenly',
      alignItems:'center'
    }
  })
  