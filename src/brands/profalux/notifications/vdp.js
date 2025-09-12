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
import '../templates/components/objects/qrBasic/locales';







import { cloneDeep } from 'lodash';
import { isEmpty } from 'lodash';

import store from '_store';
import  navigationService from '_services/navigationService';

import {decline,hangUp} from '_components/objects/@common/accessVDP/utils/interactions';

import {createAChannel,buildNotification} from '_services/pushNotifications/allNotifications/utils';
import {closeNotification,getPushNotificationCallerEventName} from '_services/pushNotifications/index';
//============== debug Level ===================================
const debugLevel = 1;

const printDebug = (...args) => {
  console.log(args)
  if(args[0] >= debugLevel) {
    console.log("debug Level",args[0], args)
  }
}

//================== EventId unique subString ======================
export const eventIdSearchFor = ["vdp"];


//================== CATEGORIES / CHANNELS =====================


export const initCategories = async() => {
 // console.log("initCategories start VDP")
  const forIos = await generateIosCategory();
  const vdpc = await createVDPChannel();
  const fvdpc = await createFullScreenVDPChannel();
  console.log("[notification Push] initCategories vdp done",vdpc,fvdpc)
  return true;

}

const translateThat = (key,value,defaultValue = "not defined") => {
  const tns = "qrbasic";
  console.log("in translateThat")
  const tKey = tns+":"+"NOTIFICATION_"+value.toUpperCase()+"_"+key.toUpperCase();
  console.log("translateThat ",key,value,defaultValue,tKey)
  const retVal = i18n.t(tKey,defaultValue);
  console.log("retVal",retVal)
  return retVal;
 
}

//=============== FILTER ring / timeout / message ============
export const filter = (messagePA) => {
  console.log("filter from vdp")
  let newRemote = cloneDeep(messagePA);
  console.log("[allnotifications/vdp.js] filter test",JSON.stringify(newRemote))

  const notificationPA = newRemote;
  
  let title = messagePA?.title || "no title";
  let body = messagePA?.body || "no body";

  const message_reason = messagePA?.reason
  let   newChannelId = messagePA.channelId;

  console.log("message_reason is ....",message_reason)

  switch (message_reason) {

    case 'timeout' :
      title = translateThat("title","timeout", notificationPA?.title);
      body = translateThat("body","timeout", notificationPA?.body);
      newChannelId = "vdp_timeout";
      break;
    case 'message':
      title = translateThat("title",message_reason, notificationPA?.title);
      body = translateThat("body",message_reason, notificationPA?.body)+((notificationPA?.message) ? " : "+notificationPA?.message : "");
      newChannelId = "vdp_message";
      break;
    default :
        // nada
  }
 
  newRemote.title = title;
  newRemote.body = body;
 
  newRemote.category = newChannelId;
  newRemote.categoryId = newChannelId;
  newRemote.channelId = newChannelId;
  console.log("[allnotifications/vdp.js] testIt",message_reason,"newRemote",JSON.stringify(newRemote))

  return newRemote;


}
//==================================



export const execute = (notificationPA,dispatch) => {
 
  const moveInfos = buildRedirectParams(notificationPA);
  navigationService.navigate(moveInfos.route,moveInfos.params);   
  store.dispatch(deleteVdpNotification())  
 // deleteVdpConversationNotification();
}




export const refusePressed = (notification) => {
 
  printDebug(1,"[vdp notification] refusePressed")
  printDebug(5,notification)
  if(Platform.OS == "android") {
    const itemId = notification?.data?.objectId;
    const tag =  notification?.data?.tag;
    const addTag = (tag) ? {"tag":tag} : {} ;      
    decline(itemId,addTag);   
  }
}




/**
* Needed for IOS notifications with buttons
*/
const generateIosCategory = async() => {
    return await notifee.setNotificationCategories([
        {
          id: 'vdp',
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




const createVDPChannel = async() => {     
      const channelId = await createAChannel('vdp','Vdp Channel')
      return channelId;
  }

export const createFullScreenVDPChannel = async() => { 
  const channelId = await createAChannel('fullscreen','full screen')
  return channelId;
} 

 


//=================== EVENTS ===================================


const getNotificationDestinationIds = (notification,id) => {

  console.log("getNotificationDestinationIds ("+id+")");//,JSON.parse(JSON.stringify(notification)))
    const checkActions = notification?.android?.actions || []; 
   
    const details = checkActions.reduce((r,v,i) => {    
      console.log("check !!!",v)       
        if(v?.pressAction?.id == id) {    
          
          console.log("check inside ok !!!",v?.pressAction?.id) 
          r.object = notification?.data?.object
          r.objectId = notification?.data?.objectId
        }
        return r;
      },{});
      
      console.log("details",JSON.parse(JSON.stringify(details)))

      /*
      let details = {}
      if(Platform.OS == "android") {
        details = {"objectId":notification?.data?.objectId,"object":notification?.data?.object}
      }
      */
      if(isEmpty(details)) return false;

      return details
}

export const delivered = (notification) => {
   

    console.log("vdp delivered  bt ignored ==> ")//,JSON.parse(JSON.stringify(notification)))

    const channelId = notification?.android?.channelId
    const vdpObject = getNotificationDestinationIds(notification,"VDP");
    const recievedDatas = notification.data || {};

    return false;

}

export const onPressed = (pressed,notification) => {
    
  //const pressed = pressAction?.id;
  console.log("onPressed vdp",pressed,notification);  

  if(pressed == 'VDP') { 
            store.dispatch(setNotificationFromBackground(notification)) 
            
  }
  return false;

  if(pressed == "decline") {
    if(Platform.OS == "ios") {
      const itemId = notification?.ios?.objectId;
      const tag =  notification?.ios?.tag;
      const addTag = (tag) ? {"tag":tag} : {}
      // return {"tag":iceInfos?.tag}
        
      decline(itemId,addTag);
     
    }
    deleteVdpConversationNotification();
  }
  return false;
}


// =============== NOTIFICATION =======================



export const buildNotifee = async(notificationPA) => {

  const tns = "qrbasic";
  console.log("buildNotifee  VDP invdp.js",JSON.stringify(notificationPA)) ;  
  // because VDP notification has no reason so force reason to ringing
  const message_reason = notificationPA?.reason || "ringing";

  const title = translateThat("title",message_reason,notificationPA?.title || "no title");
  const body = translateThat("body",message_reason,notificationPA?.body || "no title");
 
  console.log("so TITLE IS ",title)
 
  const bigPictureUrl = notificationPA?.picture;
  const acceptTitle = i18next.t('doorkeeper:CALL_ACCEPT');
  const declineTitle =  i18next.t('doorkeeper:CALL_DECLINE');

  const objectId = notificationPA?.objectId;  
  
  let notificationData = {
                              "objectId":notificationPA?.objectId,
                              "reason":message_reason,
                              "ice" : notificationPA?.ice,
                            
                            }
  if(notificationPA?.tag)notificationData.tag = notificationPA?.tag 
  
  let  cloned = cloneDeep(notificationPA);
  ['channel_id', 'categoryId','channelId','category'].forEach(e => delete cloned[e]);
 
  const channelsByReason = {  
                              "ringing" : "fullscreen",
                              "timeout" : "default",
                              "message" : "default"
                            };
  const channelToCreate = channelsByReason?.[message_reason];
  const channel_id = channelToCreate;
  const pressAction =  {
                        id: 'default',
                      };
  const actions = [        
                    {
                        title: declineTitle+"",
                      pressAction: {
                          id: 'deny',
                        }
                    },
                    {
                      title: acceptTitle,
                      pressAction: {
                        id: "VDP",
                        object: notificationPA?.object,
                        objectId:notificationPA?.objectId,
                        launchActivity: "com.extel.umii.MainActivity",
                      /* launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],   */       
                      },                  
                    },
                  ];
    const fullscreenAction =  {
      id: 'fullscreen',
      // mainComponent: 'full-screen-main-component'
      launchActivity: 'com.extel.umii.CustomActivity',
    };
 
  let addFullscreen = null
  if(message_reason == "ringing") {
    await createFullScreenVDPChannel();
    addFullscreen = fullscreenAction;
  }
  let params = {channel_id,title,body,notificationData,pressAction,notificationPA};
 
  if(channel_id == "fullscreen") {
    const fullscreenExtra = {bigPictureUrl,actions,fullscreenAction};
    params = {...params,...fullscreenExtra,"timeoutAfter":30}
  } else {
    console.log("je ne suis donc pas une fullscreen")
    params = {...notificationPA,"title":title,"body":body};
    params.pressAction = pressAction;
  } 

  console.log("[vdp buildNotifee params]",JSON.stringify(params))
 
  const notif = await buildNotification(params)
  console.log("[vdp buildNotifee result ",JSON.stringify(notif))
  return notif  

}




// =============== REDIRECT ===========================
export const buildRedirectParams = (notificationPA) => {

    console.log("XXX VDP redirectBoy from allnotifications",notificationPA)
    const params = {  'caller':'VDP',
                      'itemId':notificationPA?.objectId,
                      'id':Number(notificationPA?.objectId),
                      'ring':true,
                      'callAccepted':true,
                      'sentTime':notificationPA?.sentTime,
                      'origin':notificationPA?.origin,
                      'message':{"data":notificationPA,"category":notificationPA?.channelId}
                    
                    }
    //const imageUrl = (Platform.OS == "ios") ? notification?.notification?.ios?.attachments?.[0] : notification?.data?.image;
    console.log("vdp redirectBoy params",JSON.stringify(params))
    return ({'route': 'ProductDetails', params:params})


}

const deleteVdpConversationNotification = () => {
  const toDispatch = deleteVdpNotification();       
  store.dispatch(toDispatch)
}

/**
 * called in src/services/pushNotifications/myPushNotifications.js
 * @param {object} props
 * @param {object} props.notification 
 * @param {navigation} [props.navigation]
 */
export const onComeFromBg = (notification,pressedId) => {


  if(pressedId) {
    onPressed(pressedId,notification);
    return true;
  }
  
  console.log("[notification vdp onComeFromBg", " yeah ",notification,pressedId)
  console.log("so store ")

  if(notification?.pressedId == "deny") return false;
  const moveDatas = buildRedirectParams(notification)
  console.log("moveDatas",moveDatas)

  //return {}
  //navigation.navigate(moveDatas?.route,moveDatas?.params);  
 
  return moveDatas

}