import notifee ,  {
    AndroidImportance,
    AndroidVisibility,
    AndroidLaunchActivityFlag,
    AndroidStyle,
    AndroidCategory,EventType
  } from '@notifee/react-native';

  import { Platform,AppState} from 'react-native';
 
  import { isEmpty,cloneDeep } from 'lodash';


  import messaging from '@react-native-firebase/messaging';
  import {  addNotificationPush,
    setNotificationPushToken,
    setStartFromNotification,
    setNotificationFromBackground,
    deleteVdpNotification,
    deleteStartFromNotification
  
  } from '_actions/notificationPush';

import store from '_store';

import {closeNotification,getPushNotificationCallerEventName} from '../index';
//import {createAChannel,buildNotification} from '_services/pushNotifications/allNotifications/utils';
import {createAChannel,buildNotification} from '../allNotifications/utils';
import {createNotificationPA} from './tools'

import { debugAlert } from '_helpers/tools';

import { checkUserIsGranted} from '_api/Api';


//------------------------------------------


import allNotifications from '../allNotifications';


  //import * as Total from '../tests/total';
  


//=========================================================
/**
 * 
 * @param {string} channel_id 
 * @param {string} methodName 
 * @returns 
 */
const getNotificationMethod = (channel_id,methodName) => {
  //console.log("getNotificationMethod => allNotifications",allNotifications[channel_id],methodName)
  return allNotifications[channel_id]?.[methodName];
}

const initCategories = async()=> {
  const tk = Object.keys(allNotifications);
  console.log("initCategories",tk)
  for(let i=0;i<tk.length;i++) {
    const method =  getNotificationMethod(tk[i],"initCategories");
    if(method) {
      await method();
    }
  }
  return true;
}


  export const setPushNotificationCategories = async () => {   
    await initCategories();
  }

  /**
   * manage initial notifee notification
   */
  export const notifeeManageInitialNotification = async() => {
    //debugAlert("notifeeManageInitialNotification start",""+"-->"+"\n"+"voià voilà")
    const initialNotification = await notifee.getInitialNotification();
    console.log("[notifeeManageInitialNotification from app didmount ] initialNotification =>",JSON.stringify(initialNotification.pressAction))
    console.log("[notifeeManageInitialNotification] pressAction => suite",JSON.stringify(initialNotification?.pressAction))
   
    if (initialNotification) {
        const notificationPA = createNotificationPA(initialNotification?.notification);
        console.log("notificationPA",notificationPA)

    }
   
  }




  const buildDefaultNotifee = async(notificationPA) => {


    console.log("buildNotifee  Generic buildGenericNotifee message yep yep yep",JSON.stringify(notificationPA)) ;  
    console.log("---------------- 0 ----------------------")
    const title =  notificationPA?.title || "no title";
    const body = notificationPA?.body || "no body";
    const message_reason = notificationPA?.reason || "nope";
    console.log("---------------- 1 ----------------------")
   // if(notificationPA?.errorId == 11) return false;
    console.log("---------------- 2.b ----------------------")
    
    const pressAction =  {
      id: 'default',
    };
    
    const timeOutAfter = 30; // en secondes  
    const objectId = notificationPA?.objectId;  
    const notificationData = {};
   
    console.log("---------------- 3 ----------------------")
    let  cloned = cloneDeep(notificationPA);
   
   await createAChannel("default","Default")
    const channel_id = "default";//channelToCreate;
    console.log("---------------- 4 ----------------------")
    const bigPictureUrl = notificationPA?.picture;
    console.log("---------------- 5 ----------------------")
    const params = {channel_id,title,body,notificationData,bigPictureUrl,pressAction,notificationPA}
    console.log("---------------- 6 ----------------------")
  
    console.log("[default buildNotifee ",params)
  
    const notif = await buildNotification(params)
    console.log("---------------- 7 ----------------------")
    console.log("default notif bis 2=>",JSON.stringify(notif))
    return notif  
  
  }
  

const notifeeShow = async(notificationPA) => {

  console.log("[notifeeShow] : Preparing Local Notification 2",JSON.stringify(notificationPA));
  
  // the second part is added for android notification App Off
  const channel_id = notificationPA?.categoryId || notificationPA?.channel_id;

  if(allNotifications[channel_id]) {
    console.log("#########",channel_id,allNotifications[channel_id])
    if(allNotifications[channel_id]?.buildNotifee) {
      console.log('---- notifeeShow A')
      const notification = await allNotifications[channel_id]?.buildNotifee(notificationPA);
      console.log('---- notifeeShow B before displayNotification',JSON.stringify(notification));

    let dnotifications = [];

    try {
      dnotifications = await notifee.getDisplayedNotifications();
    } catch (e) {
      console.log(" notifee.getDisplayedNotifications failed.", e);
      return;
    }
    console.log("displayed notification",dnotifications)
      store.dispatch(setNotificationFromBackground(notification))
      const testo = await notifee.displayNotification(notification).catch((err)=> console.log('notifee error',err));
      console.log("[notifeeShow] : notification displayed with id :",testo);
      console.log("notifeeShow completed !!!!!!!!!!!!!!!!!!!")
    }   
  } else {
    // so it's generic
    console.log("so it's generic !!!")
    const notification = await buildDefaultNotifee(notificationPA);
    console.log("[generic notification]",notification)
    const testo = await notifee.displayNotification(notification).catch((err)=> console.log('notifee error',err));
    console.log("[notifeeShow Default] : notification displayed with id :",testo);
    console.log("notifeeShow completed !!!!!!!!!!!!!!!!!!!")

  }
}


//=================== ANDROID =================================

const reconnectToServerIfNeeded = async() => {
   return checkUserIsGranted();
}

export const myNotifee = (notificationPA) => {  
  console.log("infos in myNotifee ==>",notificationPA) 
    notifeeShow(notificationPA);
}

// c'est directement à l'origine de l'application  - à cause du fullscreen 
// donc on ne la trouve pas quand on cherche dans ./src
export const myRootNotifeeInit = async () => {  

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("############### --- messaging().setBackgroundMessageHandler  in myRootNotifeeInit --- ################")
    console.log("remoteMessage ",JSON.stringify(remoteMessage))
    if(Platform.OS == "ios")console.log("it is ignored as Platform == ios")
    //console.log("store is like that",store.getState())
    if(remoteMessage?.data && !isEmpty(remoteMessage?.data) && Platform.OS != 'ios') {
      console.log("(Android) -> App Closed / Screen Off and data")
      await reconnectToServerIfNeeded();
      console.log("notification 2 for ",Platform.OS)
      //const notificationPA = createNotificationPA(remoteMessage?.data);
      myNotifee(remoteMessage?.data)
    }
   
  });
/*
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open  messaging().onNotificationOpenedApp',
      JSON.stringify(remoteMessage),
    );
   // navigation.navigate(remoteMessage.data.type);
  });
  */
  //---------------------------------------
  /*
  This Method is Called outside the App to Process the "fullscreen" from Screen off call


  the notifee event below is used by  Android Device when  :

  - Screen is OFF
  - the App is in background
  - And Also when it is silently opened in order to compute a notifee

  */

  notifee.onBackgroundEvent(async (props) => {
    console.log("############### --- notifee.onBackgroundEvent  --- ################")
    console.log("notifee.onBackgroundEvent",JSON.stringify(props));
    const {type,detail} = props;
    const { notification, pressAction } = detail;   
    console.log("----------->> notifee.onBackgroundEvent services/pushnotifications/notifee/index.js props<<-------------------");//,JSON.stringify(props),JSON.stringify(EventType));  

    const channel_id = notification?.android?.channelId || notification?.ios?.categoryId;

    // ---- DISMISSED ----------
    if(type == EventType.DISMISSED) {
      console.log("notification time out");
      // should delete notification from store
      const dispatch = store.dispatch;
      dispatch(deleteVdpNotification())
      return true; // end function
    }

    // ----- DELIVERED ---------
    if(type == EventType.DELIVERED) {  

      const channelDelivered =  getNotificationMethod(channel_id,"delivered");
      const action = channelDelivered ? channelDelivered(notification): null;  
      console.log("!!!!!!!!!!!!!!!!!!!!! myRootNotifee onBackgroundEvent delivered",JSON.stringify(action));   
      if(action) store.dispatch(action);
      return true;
    }

    //------- PRESS -----------
    if(type == EventType.ACTION_PRESS) {
      const title = "******************* myRootNotifee onBackgroundEvent ACTION_PRESS"+type+ ": "
    
      console.log("ApressAction = ",pressAction,channel_id);
      console.log("notification",notification)
        const pressed = pressAction?.id;
        closeNotification(notification?.id);
        const onPressed = getNotificationMethod(channel_id,"onPressed");
        console.log(title,onPressed)
        console.log("onPressed",onPressed)
        if(onPressed) {
          onPressed(pressAction,notification);
        }
       
    }
   
  });

  console.log("WELL myRootNotifeeInit Done")

}