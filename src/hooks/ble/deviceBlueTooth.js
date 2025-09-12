/* eslint-disable react-hooks/exhaustive-deps */

/*
* No dependencies
* Inherited this way
* Could be used 
* Over ignored Values
* Loading a known damned-well method
* Ever and Ever
*/

import React from 'react';
import {Platform} from 'react-native';
import BleManager from 'react-native-ble-manager';


//-----------------------------------------------------


const useDeviceBlueTooth = () => {

  const enabledDeviceBluetooth = async () => {
   
     
    
    return new Promise(async (resolve, reject) => {
     
      const currentBleState = await BleManager.checkState();
     




      if (currentBleState == 'on') resolve(true);
      if (Platform.OS == 'ios' && currentBleState == 'off') {
        resolve(false);
      }
      
      if (Platform.OS == 'android') {
        console.log('Android Bluetooth state:', currentBleState);
        BleManager.enableBluetooth()
          .then(() => {
            // Success code
           console.log(
              'The bluetooth is already enabled or the user confirm',
            );
            resolve(true);
          })
          .catch(error => {
            // Failure code
           console.log(
              'The user refuse to enable bluetooth or an error occurred',
            );
            resolve(false);
          });
      }
    });
  };
  



    //-------------- Return ---------------------------
    return {
      enabledDeviceBluetooth
    }
}

export default useDeviceBlueTooth;
