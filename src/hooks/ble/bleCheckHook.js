/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useState, useEffect, useRef} from 'react';

import {useBleContext} from './bleContext';



const useBleCheck = () => {

  //console.log("useBleSettings",characteristicsMap,exposedCharacteristics)

  const uBleContext = useBleContext();

  const {isConnected,checkStatuses,lostConnection} = uBleContext;

  const [isPaired, setIsPaired] = useState("idle");


  useEffect(()=> {
    console.log("[useBleCheck] => useEffect checkStatuses",checkStatuses)
  },[checkStatuses]);

  

const [checkState, setCheckState] = useState("idle");

useEffect(()=> {
  console.log("useBleCheck useEffect checkState",checkState)
 console.log("useBleCheck useEffect isPaired",isPaired)
},[checkState,isPaired,lostConnection]);


 console.log("useBleCheck started !!!!!!!!!!!!!")


const reset = () => {
  uBleContext.setBleCheckActivated(false);
  

}
  



    return {
        isConnected,
        isPaired,
        checkState,
        checkStatuses,
        reset
    }
}

export default useBleCheck;















