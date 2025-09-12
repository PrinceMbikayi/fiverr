import * as types from './notificationTypes';
//import {Normalise} from '../helpers/normalise';



export function getNotifications(){
  //console.log("getNotifications")
  return {
    type :  types.NOTIFICATIONS_GET,
    payload:{}
  };
}
