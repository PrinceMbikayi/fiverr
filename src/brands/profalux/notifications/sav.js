import { Platform } from 'react-native';

import notifee ,  {
  AndroidImportance,
  AndroidVisibility,
  AndroidLaunchActivityFlag,
  AndroidStyle,
  AndroidCategory,EventType
} from '@notifee/react-native';

//--------------------------------------------

import {  addNotificationPush,
    setNotificationPushToken,
    setStartFromNotification,
    setNotificationFromBackground,
    deleteVdpNotification,
    deleteStartFromNotification
  
  } from '_actions/notificationPush';


import i18n from 'i18next';
import i18next from '_utils/i18next';  
import { cloneDeep } from 'lodash';
import { isEmpty } from 'lodash';

import store from '_store';

import {decline,hangUp} from '_components/objects/@common/accessVDP/utils/interactions';


import {createAChannel} from '_services/pushNotifications/allNotifications/utils';
import {closeNotification,getPushNotificationCallerEventName} from '_services/pushNotifications/index';


//================== EventId unique subString ======================
export const eventIdSearchFor = ["sav"];


//================== CATEGORIES / CHANNELS =====================


export const initCategories = async() => {

  //console.log("[notification Push] initCategories start SAV")
  const forIos = await generateIosCategory();
  const savc = await createSAVChannel(); 
  console.log("[notification Push]initCategories sav done",savc,forIos)
  return true;

}


//=============== FILTER ring / timeout / message ============
export const filter = (remoteMessage) => {

  console.log("filter from sav ",JSON.parse(JSON.stringify(remoteMessage)));
  let newRemote = cloneDeep(remoteMessage);
  let newChannelId = remoteMessage?.data?.channelId || remoteMessage?.data?.channel_id;
  //console.log("[allnotifications/sav.js] filter test",newChannelId,JSON.stringify(newRemote))

  if(newRemote?.data) {
    newRemote.data["channel_id"] = newChannelId;
    newRemote.data["channelId"] = newChannelId;
    newRemote.data["category"] = newChannelId; // iOS
  }
  //console.log("bon et ici",newRemote)
  newRemote["category"] = newChannelId;
 // console.log("[allnotifications/sav.js] testIt",testIt,"newRemote",JSON.stringify(newRemote));
  return newRemote;
}





export const executeStartFromNotification = (props) => {
  console.log("[sav] executeStartFromNotification ")//,props)
  const filteredRemoteMessage = props?.startFromPushNotification?.notification;
  
  const toDispatch = addNotificationPush(filteredRemoteMessage);
        if(filteredRemoteMessage != false) {
         // console.log("store.getState().notificationPush.list",store.getState().notificationPush?.list)
          store.dispatch(toDispatch);

          // then delete from start
          const toDeleteDispatch = deleteStartFromNotification(); 
          store.dispatch(toDeleteDispatch);
        }
}



/**
* Needed for IOS notifications with buttons
*/
const generateIosCategory = async() => {
    return await notifee.setNotificationCategories([
        {
          id: 'sav',
          actions: [
            {
              id: 'accept',
              title: i18n.t("doorkeeper:CALL_ACCEPT"),
              foreground: true,
            },
            {
              id: 'decline',
              title: i18n.t("doorkeeper:CALL_DECLINE"),
              
            },
          ],
        },
      ]);
}

const createSAVChannel = async() => {

  const channelId = await createAChannel("sav","sav Channel");  
  return channelId;
  
  }
  


//=================== EVENTS ===================================


export const delivered = (notification) => {  

    console.log("delivered SAV ==> ")//,JSON.parse(JSON.stringify(notification))) 
  /*
        const action = setNotificationFromBackground({'caller':"sav",'eventName':callerEventName,'objectId':vdpObject?.objectId,'notification':remoteMessage,'origin':'background'})
        //console.log("action",action);
       
        return action
    */  
    return false;
}

export const onPressed = (pressAction,notification) => {
    
  const pressed = pressAction?.id;
  console.log("onPressed sav",pressAction,notification);

  const recievedDatas = notification.data || {};

  if(pressed == 'SAV') {
        
        const object = pressAction?.object;       
        const remoteMessage = {data:{...recievedDatas,'object':object,'objectId':pressAction?.objectId,'channel_id':"vdp"}};     
        const callerEventName = getPushNotificationCallerEventName(remoteMessage); 
        
        if(callerEventName != null) {
            const notification = {'caller':"sav",'eventName':callerEventName,'notification':remoteMessage,'origin':'background-accept'};  
            store.dispatch(setNotificationFromBackground(notification)) 
            
        }
        return false;
  }
  if(pressed == "decline") {
    if(Platform.OS == "ios") {
      const itemId = notification?.ios?.objectId;
      const tag =  notification?.ios?.tag;
      const addTag = (tag) ? {"tag":tag} : {}
      // return {"tag":iceInfos?.tag}
        
     // decline(itemId,addTag);
     
    }
    deleteVdpConversationNotification();
  }
  return false;
}


// =============== NOTIFICATION =======================

const buildNotification = (props) => {


    const {title,body,channel,bigPictureUrl,acceptTitle,declineTitle,timeOutAfter,objectId,message} = props;
    console.log("[notification Push sav buildFullNotification")//,props)
 

    const addDatas = (Platform.OS == "android")? (message?.data || {}) : {}


    let savNotification = {
      'title': title,
      'body': body,
      'data':addDatas,
      'ios': {
        'sound' : "default"
      },
      'android': {
        'channelId': channel,
        /*  'style': { type: AndroidStyle.BIGPICTURE, picture: bigPictureUrl },  */
        ...(bigPictureUrl && { 'style': { type: AndroidStyle.BIGPICTURE, picture: bigPictureUrl }}),  
        // Recommended to set a category
        'category': AndroidCategory.CALL,
        // Recommended to set importance to high
        'importance': AndroidImportance.HIGH,
        'visibility': AndroidVisibility.PUBLIC,
        'timeoutAfter':timeOutAfter*1000,
        'showChronometer' : true,
        'sound': "default",           
        debug:'1.0',
        pressAction: {
          id: 'default',
        },
        actions: [        
          {
              title: declineTitle+"",
             pressAction: {
                id: 'deny',
              }
          },
          {
            title: acceptTitle,
            pressAction: {
              id: "SAV",
              object: message?.data?.object,
              objectId:message?.data?.objectId,
              launchActivity: "com.extel.umii.MainActivity",
           
            },                  
          },
        ],
        
      },
      ios: {
        sound: 'default',
      },
    }


  if(message?.data?.image) {
    savNotification.data["image"] = message?.data?.image
  }

  //-------- preload object data -----------------


  console.log("savNotification done")//,JSON.stringify(savNotification));
  return savNotification

}

export const buildNotifee = async(message) => {

    console.log("[SAV] buildNotifee message",message);  
    const title =  message?.data?.title || "no title";
    const message_reason = message?.data?.reason || "nope";
    const body = message?.data?.body || "no body";
    const channel = message?.data?.channel_id;
   
    const acceptTitle = i18next.t('doorkeeper:CALL_ACCEPT');
    const declineTitle =  i18next.t('doorkeeper:CALL_DECLINE');
    const timeOutAfter = 30; // en secondes  
    const objectId = message?.data?.objectId;
 
  
    const props = {message,title,message_reason,body,channel,/*bigPictureUrl,*/acceptTitle,declineTitle,timeOutAfter,objectId};    
   
    response = buildNotification(props);
   

    return response;
  }


// =============== REDIRECT ===========================
export const buildRedirectParams = (navigation,notification,callerEventId,objectId) => {

    console.log("XXX redirectBoy from allnotifications",notification)
    const params = {  'caller':'VDP',
                      'itemId':objectId,
                      'id':Number(objectId),
                      'ring':true,
                      'callAccepted':true,
                      'sentTime':notification.sentTime,
                      'origin':notification?.origin,
                      'message':{data:notification?.notification?.data,"category":notification?.notification?.data?.category}
                    
                    }
    const imageUrl = (Platform.OS == "ios") ? notification?.notification?.ios?.attachments?.[0] : notification?.data?.image;
    console.log("XXX redirectBoy params",JSON.stringify(params))
    return ({'route': 'ProductDetails', params:params})


}

const deleteVdpConversationNotification = () => {
  const toDispatch = deleteVdpNotification();       
  store.dispatch(toDispatch)
}