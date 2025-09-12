/* Wifi.js */
/* Wifi file contains functions to help you when working with wifi */

import WifiManager from 'react-native-wifi-reborn';
import {PermissionsAndroid,Platform} from 'react-native';

async function requestPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    ],
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log("granted",granted);
      return true;
     
    } catch (err) {
      console.warn(err);
     
    }
    
  }


 async function getSSID() {   
   return WifiManager.getCurrentWifiSSID();
}

function BSSID_IS_BACK (bssid) {
  console.log("BSSID_IS_BACK",bssid)
}

async function getBSSID() {
  return new Promise( resolve => WifiManager.getBSSID((bssid) => {   
        resolve(bssid);
      }
    ));
}
  //const ssid = await WifiManager.getCurrentWifiSSID();


async function getFrequency() {
  console.log("----> getFrequency")
  //return  WifiManager.getFrequency()


  return new Promise( resolve => WifiManager.getFrequency((frequency) => { 
    console.log("getFrequency inside",frequency)  
    resolve(frequency);
  }
  ));
}

function isWifiFrequencyOk () {
  if(Platform.OS == "ios") return "unavailable";

  if(Platform.OS == "android") {
    const frequency = getFrequency();
    console.log("frequency",frequency)

    return true;
  }
}



 async function getWifiNetworks() {

    console.log("before permission")
    let res = await requestPermissions();
    console.log("after permission")
   
     
   return new Promise( resolve => WifiManager.reScanAndLoadWifiList((wifiStringList) => {
      var wifiArray = JSON.parse(wifiStringList);       
        resolve(wifiArray);
      },
      (error) => {       
        reject(error);
      }
   ));
   
 }
 
 
 // Export each function
 export {
    getSSID,
    getBSSID,
    getWifiNetworks,
    isWifiFrequencyOk,
    getFrequency
    
 };

 /* EN ATTENTE  */
 /*

  
  refreshNetworks(){
    wifi.reScanAndLoadWifiList((wifiStringList) => {
      var wifiArray = JSON.parse(wifiStringList);
      console.log('Detected wifi networks - ',wifiArray);
      this.setState({'networks':wifiArray});
    },(error)=>{
      console.log(error);
    });
  }

  */