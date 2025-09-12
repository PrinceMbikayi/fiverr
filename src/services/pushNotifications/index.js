/*
    In order notifee methods must be called as soon as possible
    so look at theses mesthods in

    /index.js (the start of this app)

    and 

    /src/index.js

    ForeGround Notification see "_components/ui/notificationPush"

    Push notifications files for DoorKeeper (VDP) see  "_components/objects/doorKeeper"


*/


import notifee  from '@notifee/react-native';

import store from '_store';

import {getObjectById,getWidgetReference} from '_helpers/selectors';





export const closeNotification = (id) => {    
    console.log("please close That",id)   
    if(id != undefined) {
      notifee.cancelNotification(id);
    }
}

/**
 * 
 * @param {Object} remoteMessage
 * @param {string} remoteMessage.object
 * @param {string|Number} remoteMessage.objectId
 * @example {object:"access/vdp/demo_vdp_1", objectId: "739063"}
 * 
 * @returns 
 */
export const  getPushNotificationCallerEventName = (remoteMessage) => {
   
  // be careful now remoteMessage is like that object: "access/vdp/demo_vdp_1", objectId: "739063"

  console.log("getPushNotificationCallerEventName in notifee index !!!!");//,remoteMessage); 
  const callerId = remoteMessage?.data?.objectId || remoteMessage?.data?.notifee_options?.ios?.objectId;
  console.log("🚀 ~ file: index.js:51 ~ getPushNotificationCallerEventName ~ callerId", callerId)
  if(callerId == undefined) return null;
  const rawDatas = getObjectById(store.getState(),Number(callerId));

  if(rawDatas == undefined) return null;
  const stringifiedObjectDatas = JSON.stringify(rawDatas);   
  const callerObjectDatas = JSON.parse(stringifiedObjectDatas);   
  const eventName = callerObjectDatas?.eventId;
  
  if(eventName == undefined)return null;
  return eventName;

          
}