import * as types from './notificationPushTypes';
//import {Normalise} from '../helpers/normalise';



export function addNotificationPush(remoteMessage){
 
  return {
    type :  types.NOTIFICATION_PUSH_ADD,
    payload:{message:remoteMessage}
  };
}

export function deleteNotificationPush(notificationTimestamp){
 
  return {
    type :  types.NOTIFICATION_PUSH_DELETE,
    payload:{timestamp:notificationTimestamp}
  };
}


export function setNotificationPushToken(token){
 
    return {
      type :  types.NOTIFICATION_PUSH_SET_TOKEN,
      payload:{'token':token}
    };
  }

export function setStartFromNotification (notificationPayload) {
  return {
    type :  types.NOTIFICATION_PUSH_COLD_START,
    payload:{...notificationPayload}
  };
}

export function setNotificationFromBackground (notificationPayload) {
  return {
    type :  types.NOTIFICATION_PUSH_IN_BACKGROUND,
    payload:{...notificationPayload}
  };
}



export function deleteStartFromNotification (notificationPayload) {
  return {
    type :  types.NOTIFICATION_PUSH_COLD_START,
    payload:{notificationPayload}
  };
}


export function deleteVdpNotification () {
  return {
    type :  types.NOTIFICATION_PUSH_DELETE,
    payload:{'vdp':true}
  };
}
export function deleteSavNotification () {
  return {
    type :  types.NOTIFICATION_PUSH_DELETE,
    payload:{'sav':true}
  };
}

export function fullscreen_push_android_started () {
  return {
    type :  types.NOTIFICATION_PUSH_FULLSCREEN_ANDROID,
    payload:{'open':true}
  };
}