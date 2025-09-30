/*
Les vues des notifications quand l'application est en foreground
sont dans _components/ui/notificationPush

*/
import DeviceInfo from 'react-native-device-info';
import {  Alert,Platform,PermissionsAndroid} from 'react-native';
import store from '../../store';
import {appRefresh,closeWS} from '_actions/app';
import messaging from '@react-native-firebase/messaging';

//import notifee from '@notifee/react-native';

import { AndroidColor, EventType } from '@notifee/react-native';
import { myNotifee } from './notifee';

import { isEmpty } from 'lodash';

import notifee  from '@notifee/react-native';

import {  addNotificationPush,
          setNotificationPushToken,
          setStartFromNotification,
          setNotificationFromBackground,
          deleteVdpNotification,
          deleteStartFromNotification,
          deleteBackgroundNotification
        
        } from '_actions/notificationPush';

import  navigationService from '_services/navigationService';

import {getPushNotificationCallerEventName,closeNotification} from './index';
import { checkUserIsGranted} from '_api/Api';

import allNotifications from './allNotifications';



import {createNotificationPA} from './tools';
import { css } from 'styled-components';


const refuseIds = ["deny"]


/*============ 
  in fact this is executed when in case you pressed a button on a notifee displayed notification
  the application was opened to generate the notification then displayed
  it means that when you press a notification button 
  this application is considered opened
  This behaviour is identified on Android Platform
  


==============*/
console.log("initialise notifee.onForegroundEvent")
notifee.onForegroundEvent(({ type, detail }) => {


  const infos = JSON.parse(JSON.stringify(detail))
  console.log("############### --- notifee.onForegroundEvent  --- ################ type",type)
  console.log("notifee.onForegroundEvent type=>",type,JSON.stringify(infos))
  console.log("mainly for deny / refuse button press but look at default on ios")
  const channelId = infos?.notification?.android?.channelId || infos?.notification?.data?.channel_id || infos?.notification?.ios?.categoryId;
  console.log("[onForegroundEvent] channelId",channelId);//,JSON.stringify(allNotifications)
  const refusePressed = allNotifications?.[channelId]?.refusePressed;
  const pressedId = infos?.pressAction?.id
  console.log("pressedId : ",pressedId)

  if(pressedId && refusePressed && (refuseIds.indexOf(pressedId) != -1)) {
    console.log("Refuse in notifee.onForegroundEvent");
    refusePressed(infos.notification,pressedId);
    console.log("######################### !!!")
  }
  //mean ap is in background, can't be in foreground because notification is intercepted in foreground
  const remoteMessage = infos;
 
  const acceptPressed = allNotifications?.[channelId]?.onComeFromBg; // or from cold-start
  if(Platform.OS == "ios") {  
  
    let prepareMessage = {...remoteMessage?.notification,...remoteMessage?.notification?.ios}
    delete prepareMessage?.ios;
    console.log("prepareMessage",prepareMessage)

    if(pressedId == "accept") {
    
      if(acceptPressed) { 
        prepareMessage.origin = "background";
        const moveInfos = acceptPressed(prepareMessage);
        console.log("yop",moveInfos);
        navigationService.navigate(moveInfos.route,moveInfos.params)
      }      
    }
    if(pressedId == "default") {  
      const notificationPA = createNotificationPA(prepareMessage);
      addMessageNotification(notificationPA)
    }
  }

  if(Platform.OS == "android") {

    const baseInfos = remoteMessage?.notification;
    console.log("[onForegroundEvent ANDROID] =>",JSON.stringify(remoteMessage))
   
    let prepareMessage = {
                          "title":baseInfos?.title,
                          "body":baseInfos?.body,
                          ...baseInfos?.data,
                          "categoryId" : channelId
    }
    if(acceptPressed) { 
        prepareMessage.origin = "background";
        prepareMessage.pressedId = pressedId;
        console.log("[ANDROID prepareMessage ++]",prepareMessage)
        const moveInfos = acceptPressed(prepareMessage,pressedId);
        /*
        console.log("yop android",moveInfos);
        console.log("navigationService",navigationService);
        if(moveInfos.route && navigationService) {
          navigationService.navigate(moveInfos.route,moveInfos.params)
        }
        */
    }  
  }
 
})



//==============================================================
const getNotificationMethod = (channel_id,methodName) => {  
  return allNotifications[channel_id]?.[methodName];
}
//------------------------------------------------------------------------------


const buildFilteredMessage = (notificationPA) => {
    
  //let notificationPA = createNotificationPA(remoteMessage);
  console.log("createNotificationPA result ",notificationPA)
 // let filteredRemoteMessage = JSON.parse(JSON.stringify(buildNeutralRemoteMessage(remoteMessage)));
 //const channel_id = filteredRemoteMessage?.data?.channel_id;

 const {channelId} = notificationPA;
  console.log("=> buildFilteredMessage",channelId)
  const method =  getNotificationMethod(channelId,"filter");
  console.log("filter method ?",method)
  if(method) {
    notificationPA =  method(notificationPA);
  }
  console.log("notificationPA ==>",notificationPA)
  return notificationPA
}

export const getInitialNotification = async () => {
 /*  const initialMessage = await messaging().getInitialNotification();
  console.log("initialMessage", initialMessage)
  return initialMessage */
}

export const getInitialNotificationSync = async () => {
 /*  const initialNotification = await notifee.getInitialNotification();
  console.log("initialNotification notifee ",initialNotification)
  const regarde =  await getInitialNotification();
  console.log("regarde =>",JSON.stringify(regarde)) */
}



export const appOpenFromNotification = (remoteMessage) => {

  /******************************
   * 
   *  now it is process in each "component" notification process
   * 
   */
  
}   

export const processBackgroundNotification = (notificationPA) => {
  console.log("@@@@@@@ processBackgroundNotification",notificationPA)
  const {categoryId} = notificationPA;
  if(categoryId) {
    const executeMethod = getNotificationMethod(categoryId,"execute");
    console.log("exec",executeMethod)
    if( executeMethod) {
      executeMethod(notificationPA)
    }
  }
 
}


const addMessageNotification = (notificationPA) => {

  console.log("And is processed in addMessageNotification",notificationPA)
  const initOnMessage = Date.now();  
  const categoryFiltered = buildFilteredMessage(notificationPA);
  console.log('myPushNotification ('+initOnMessage+') but filteredRemoteMessage', JSON.stringify(categoryFiltered));

  
  const toDispatch = addNotificationPush(categoryFiltered);
  if(notificationPA != false) {
    console.log("store.getState().notificationPush.list",store.getState().notificationPush?.list)
    console.log("------------------- toDispatch ---------------");
    console.log(toDispatch);
    console.log("------------------- /toDispatch ---------------");
    store.dispatch(toDispatch);
  }
}




const requestUserPermission = async () => {

    
    const authStatus = await messaging().requestPermission();   
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
   

    
    console.log("++++++++ requestUserPermission");
    
    console.log("authStatus",authStatus)
    console.log("================")
    
  console.log("before POST Notification",Platform.OS,Platform.Version)
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      console.log("++++++++ requestUserPermission for android.permission.POST_NOTIFICATIONS");
      PermissionsAndroid.requestMultiple(["android.permission.POST_NOTIFICATIONS"]).then(result => {
        console.log("probleme dans le PermissionsAndroid.requestMultiple")
        if (result) {
          console.debug(
            '[myPushNotification : handleAndroidPermissions] User accepts runtime permission \"android.permission.POST_NOTIFICATIONS\" android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
      console.log("et donc après !!! requestUserPermission")
    }





  const reconnectToServerIfNeeded = () => {
    checkUserIsGranted();
  }



    if (enabled) {
      await messaging().setAutoInitEnabled(true);
     
      const deviceToken = await getFcmToken();
    
     
      let retObject = getDeviceInfos()
      if(deviceToken) {
        retObject['deviceToken'] = deviceToken;   
        console.log("here and now ----- 1")    
        store.dispatch(setNotificationPushToken(deviceToken));
        console.log("here and now ----- 1+")    
      }

      const hasPermission = await(messaging().hasPermission()); 
     

      //tool

      







     
      // ============ HANDLERS ==========================     
      
      console.log("PushNotification Handlers start")

      messaging().onMessage(async remoteMessage => { 
        console.log("[NP ############### ---  messaging().onMessage  --- ################");
        console.log('remoteMessage ++++ ('+JSON.stringify(remoteMessage)+')')   
        const notificationPA = createNotificationPA(remoteMessage);
        console.log("flattenMessage->",notificationPA, remoteMessage)
        // IOS Foreground regular
       
        addMessageNotification(notificationPA);
    

      });

    

     
      /********************
       * REMOTE NOTIFICATION ANDROID
       *  - screen off, app open
       * ***************************/

      
      // Android it overrides the set backgroundHandlers when app is in Quit State

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log("############### ---  messaging().setBackgroundMessageHandler  --- ################")
        console.log("remoteMessage =>",JSON.stringify(remoteMessage))
       
      
        reconnectToServerIfNeeded();
       /*
        if(remoteMessage?.data && !isEmpty(remoteMessage?.data) && Platform.OS != 'ios') {
          console.log("(Android) -> App open  / Screen On / Home  and data")
          myNotifee(remoteMessage)
        }
        */
        if(Platform.OS == "android") {

          console.log("it'a on android !!!!");
          const notificationPA = createNotificationPA(remoteMessage);
          console.log("flattenMessage->",notificationPA)
          myNotifee(notificationPA)
        }




        if(Platform.OS == 'ios') {
          console.log("Message handled in the background in myPushNotifications but .........ios and remoteMessage is ",JSON.stringify(remoteMessage));
          console.log("Nothing Done here, but in ...ion fact it may create a new Notification")
          const notificationPA = createNotificationPA(remoteMessage);
          console.log("flattenMessage ios ->",notificationPA)
          console.log("============= flattenMessage ios ====================")
          const channelId = notificationPA?.channelId
          const buildNotifeeMethod =  getNotificationMethod(channelId,"buildNotifee");
          if(buildNotifeeMethod) {
            const done = await buildNotifeeMethod(notificationPA)
            console.log("done in ios !!!!",done)
          }
         // store.dispatch(setNotificationFromBackground(notificationPA)) 
          console.log("setNotificationFromBackground  ios seems completed done dpon't do that")
          /*
          console.log("Message handled in the background in myPushNotifications but .........ios")
          console.log("remoteMessage",remoteMessage);  
          let convertedMessage = {data:{...remoteMessage?.data?.notifee_options?.ios}} 
          convertedMessage.data[channel_id] = convertedMessage.categoryId   
          myNotifee(convertedMessage)
          */
         // myNotifee(remoteMessage)
        }
      });
      
    
      //------------------------------------
 
      // =================> finally return deviceInfos
      return retObject
    }
    return {}
  }




//====================================================
const getDeviceInfos = () => {
  const uniqueId = DeviceInfo.getUniqueId();
  //console.log("------->>> uniqueId",uniqueId)
  const deviceType= DeviceInfo.getDeviceId();
  const systemName = DeviceInfo.getSystemName();
  const deviceOS = (systemName == 'iOS') ? 'IOS' : systemName;

  return {'deviceID':uniqueId,'deviceOS' : deviceOS,'deviceType':deviceType};
 
}
//----------------------------------------------------
const getFcmToken = async () => {
    
    const fcmToken = await messaging().getToken().catch((err) => console.log(err));
    
    if(Platform.OS === 'ios') {
      const iosDeviceToken = await messaging().getAPNSToken().catch((err) => console.log("apns error",err));     
    } 


    if (fcmToken) {
      const apn = await messaging().getAPNSToken();
      console.log("Your Firebase Token is:", fcmToken);  
     return fcmToken

    } else {
     console.log("Failed", "No token received");
     return undefined
    }
}
//----------------------------------------------------
export const hasNotificationFromBackground = () => {
  const hnfb = store.getState().notificationPush?.fromBackground;
  console.log("[myPushNotifications] hasNotificationFromBackground",JSON.stringify(hnfb))

  const channel_id = hnfb?.notification?.data?.channel_id ||  hnfb?.notification?.data?.channelId || "can't";
  console.log("[hasNotificationFromBackground ]channel_id",channel_id)
  const fromBgMethod = getNotificationMethod(channel_id,"onComeFromBg");

  let result;
  if(fromBgMethod) {
    const nav = navigationService;
    result = fromBgMethod({"notification":{...hnfb?.notification?.data,"origin" : hnfb?.origin},"navigation":nav});
    console.log("hasNotificationFromBackground result",result)
  }

  // so delete it
  const toDispatch = deleteBackgroundNotification();
      store.dispatch(toDispatch);

  return result
}
//-----------------------------------------------------
export const checkNotificationFromBackground = () => {
   
    const hasBgPush = hasNotificationFromBackground();
    return hasBgPush;
  
}

const displayVDPNotification = (pn) => {
 console.log("displayVDPNotification");
  if(JSON.stringify(pn) !== '{}') {
   
    const nav = NavigationService;
    if(pn.caller == "VDP" && nav && pn?.notification) {
    
      const toDispatch = addNotificationPush({...pn?.notification,'origin':pn?.origin});
      store.dispatch(toDispatch);
    }

    if(pn?.notification) {
      console.log("----- r2d2 -----------")
      const toDispatch = addNotificationPush({...pn?.notification,'origin':pn?.origin});
      store.dispatch(toDispatch);
    }
    
  }
}





//-------------------------------------------------
export const checkPushNotificationOnStateChange = async() => {
 
  // oui mais pas pour connaitre le pressAction initial
  // parce le pressAction initial va disparaitre après l'appel de getInitialNotification

  /* const initialNotification = await notifee.getInitialNotification()

  console.log("checkPushNotificationOnStateChange initialNotification",JSON.stringify(initialNotification))

   */
}

//-------------------------------------------------------

export const setTokenInStore =(deviceToken) => {
  console.log("before setTokenInStore !!! :",deviceToken)
  store.dispatch(setNotificationPushToken(deviceToken));
}

// Call This to initNotificationPushes

export const initPushNotifications = async() => {   
    const ipn = await requestUserPermission();   
    return ipn;
}



