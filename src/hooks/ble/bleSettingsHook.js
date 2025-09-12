/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useState, useEffect, useRef} from 'react';

import useBle from './bleHook';




/**
 * 
 * @param {*} uObject 
 * @param {*} characteristicsMap  map of characteristic names and their uuid 
 * @param {array} exposedCharacteristics array of characteristic names
 * @returns 
 */
const useBleSettings = (characteristicsMap,exposedCharacteristics) => {

  //console.log("useBleSettings",characteristicsMap,exposedCharacteristics)

  const uBle = useBle();

  const {isConnected,currentDevice} = uBle;
  useEffect(()=> {
   // console.log("useBleSettings useEffect isConnected",isConnected)
    if(isConnected) {
      uBle.getCharacteristics()
    }
  },[isConnected]);

const doTest = async () => {

  const uuid = characteristicsMap['WIFI_ssid']
  console.log("doTest")
  const value = await uBle.read(uuid)

  console.log("doTest value",value)

}

  useEffect(()=> {
    if(currentDevice) {
      console.log("useBleSettings useEffect currentDevice",currentDevice)
      if(currentDevice?.characteristics) {
        console.log("c'est ok on a les characteristics")
        console.log("characteristicsMap",characteristicsMap)
        console.log("exposedCharacteristics",exposedCharacteristics)
        console.log("characteristicsMap['WIFI_ssid']",characteristicsMap['WIFI_ssid'])
       
        doTest();
      }
    }
  },[currentDevice]);




 



   
  const read = async (name) => {
    console.log("read",name)
    const value = await uBle.read(name)
    console.log("value",value)
    return value
  }

  const write = async (name,value) => {
    console.log("write",name,value)
    await uBle.write(name,value)
  }

  const connect = async (peripheralId) => {
    console.log("--- connect bleSettingsHook ---")
    const result = await uBle.connect(peripheralId).catch((error) => {
      console.log("---> error",error)
      return false;
    }
    )
    console.log("result de connect de settings hook",result) 
    return  result
  }



    return {
        connect,
       read,write
    }
}

export default useBleSettings;
