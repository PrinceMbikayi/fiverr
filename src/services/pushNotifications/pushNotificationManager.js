import messaging from '@react-native-firebase/messaging';
import {addNotificationPush, setStartFromNotification,deleteStartFromNotification} from '_actions/notificationPush';
import store from '../../store';
import {getObjectByEventName} from '_helpers/objects';
import { Alert } from 'react-native';

import { debugAlert } from '_helpers/tools';

import allNotifications from './allNotifications'
import {setTokenInStore, initPushNotifications as eInitPushNotifications} from './myPushNotifications';

import {notifeeManageInitialNotification} from './notifee' 

// Define our state and initialize it
let token = "";

const initPushes = ()=> {
  // initPushes already done via myPushNotification.js
  // by calling initPushNotifications via login method in Api.js
  // may be modified when new token needed when server remove device when error happened 
  // when it calls FCM
}

//====== privates methods ==========================


//==================================================


// Define the functions that will expose that state

const notificationPushManager = {
  getFCMToken : async() => {
    const fcmToken = await messaging().getToken().catch((err) => console.log("fcmToken Error",err));
    setTokenInStore(fcmToken)
    return fcmToken;

  },
  setToken: (newVal) => {
      console.log("tokennnnnnnnnnnn",token)
      if(newVal == token)console.log("Already Here little token")
      if(token != newVal) {
        token = newVal;
        //initPushes()
      }
      
  },
  redirect: (navigation,data) => {
    const toDispatch = deleteStartFromNotification(); 
    console.log("in redirect !!!!!!!!!")
    store.dispatch(toDispatch);
    console.log("redirect boy ==>",data);
    //debugAlert("redirect boy ==>",""+"-->"+"\n"+JSON.stringify(data))

    let itemId = data?.objectId || data?.id;

    if(itemId == undefined) {
      if(data?.eventName) {
        var arr = (""+data?.eventName).split("/")
        let check = arr.pop();
        if(check == "")check = arr.pop();
        itemId = Number(check);
      }     

      if(isNaN(itemId)) {
        //callerEventName = 'event/io/athome/'+objectEventId+'/';
        console.log("data.eventName",data?.eventName)
        itemId = getObjectByEventName(data?.eventName); 
      }
    }


    switch (data?.caller) {
      case 'VDP':
       
        // original notification from server may contain objet id or object realName
        // so check and assign the correct id to itemId

        const isAccepted = (data?.origin && data?.origin == "cold-start") ? false : true;        
        let params = {'itemId':Number(itemId),'ring':true,'origin':data?.origin,'sentTime':data?.sentTime,'callAccepted':isAccepted,'message':data}
        if(data?.image)params.image = data.image;      
        navigation.navigate('ProductDetails',params);        
        break;


      case 'Error' :
        break;

      default : 
     
       
    }
   
  },
  getDarkMode: () => darkMode,
 
}

// Disallow new properties on our object
//Object.freeze(notificationPushManager);

 
export const initPushNotifications = async() => {
  console.log("initPushNotifications !!!!")
  return await eInitPushNotifications()
}

export default notificationPushManager 
