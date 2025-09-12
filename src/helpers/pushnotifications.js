import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import {GOOGLE_SENDER_ID} from "../config/AppConfig"
import {Api} from "../api";


const gcmSenderID = GOOGLE_SENDER_ID;

function getUDID(){
    let uniqueId = DeviceInfo.getUniqueId();
    return uniqueId;
}



function getPushToken(){
    let uniqueId = DeviceInfo.getUniqueId();
    console.log("uniqueId",uniqueId);
    configure(_onRegister,_onNotification,gcmSenderID);



  }

function _onNotification(infos){
    console.log("_onNotification",infos)
}

function _onRegister(res){
    console.log("_onRegister TOKEN",res.token);
    Api.setPushToken(res.token,DeviceInfo.getUniqueId())
}


function configure(onRegister, onNotification, gcm = "") {
    console.log("Push confugure")
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister:onRegister
      , 

      // (required) Called when a remote or local notification is opened or received
      onNotification: onNotification, //this._onNotification,

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: gcm,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
  }

  export {
    getPushToken,
    getUDID
}