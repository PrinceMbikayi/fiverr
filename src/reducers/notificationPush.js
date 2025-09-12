import * as ActionsTypes from '_actions/notificationPushTypes'
import dotProp from 'dot-prop-immutable';
import { findIndex as lodashFindIndex } from 'lodash';

const objectInitialState = {  
  list:[],
  vdp:null,
  sav:null,
  token:"",
  fromStart:{},
  fromBackground:{},
  forFullScreen:{},
  fullscreenActive:null
}

export default function notificationPushReducer(state = objectInitialState, action) {

  const {payload, type} = action;
  //console.log("notificationsReducer",action);

  switch (type) {

    case ActionsTypes.NOTIFICATION_PUSH_SET_TOKEN : {

        state = dotProp.set(state, "token", payload.token);

        return state
    }
    
    case ActionsTypes.NOTIFICATION_PUSH_ADD : {

        const { notification } = payload
        const timestamp = Date.now()
        const newNotification = {...payload,'timestamp':timestamp};
        console.log("NOTIFICATION_PUSH_ADD",payload);
        console.log(JSON.stringify(payload));

        const mData = payload?.message?.data || {};
        const channelId = mData?.channel_id || mData?.notifee_options?.ios?.channel_id;
        const isIos = payload?.message?.data?.notifee_options?.ios;

        if(isIos)newNotification.message.data.object = isIos;

        console.log("channelId",channelId)

      switch(channelId) {


        case "vdp" :
          state = dotProp.set(state,'vdp',newNotification);
          break;

        case "sav" :
          console.log("newNotification",newNotification)
          //newNotification.message = {notification : {title :"demande de SAV"}};
          state = dotProp.set(state,'sav',newNotification)
          break;
        default :
        state = dotProp.merge(state,'list',newNotification)
      }

       

        return state;



        break;
    }  
    
    case ActionsTypes.NOTIFICATION_PUSH_DELETE : {

        const {timestamp} = payload
        console.log("NOTIFICATIONS_PUSH_DELETE",payload)
        if(payload?.vdp) {
          state = dotProp.set(state,'vdp',false)
          state = dotProp.set(state,'fromBackground',false);
          state = dotProp.set(state,'forFullScreen',false)
        } else {

          if(payload?.sav) {
              state = dotProp.set(state,'sav',false)
              state = dotProp.set(state,'fromBackground',false);
              state = dotProp.set(state,'forFullScreen',false)
            } else {



            const notificationList = dotProp.get(state,'list');
            const toDelIndex = lodashFindIndex(notificationList,{'timestamp':timestamp});
            console.log("toDelIndex",toDelIndex)
            if(toDelIndex != -1) {
              notificationList.splice(toDelIndex,1)
              state = dotProp.set(state,'list',notificationList)
            }
          }
        }

        return state

        break;
    }
       
    case ActionsTypes.NOTIFICATION_PUSH_COLD_START  : {
      console.log("reducer fromStart",payload)
      state = dotProp.set(state, "fromStart", payload);
      state = dotProp.set(state, "forFullScreen",payload);
      return state
      break;
    }

    case ActionsTypes.NOTIFICATION_PUSH_IN_BACKGROUND  : {
      console.log("reducer ActionsTypes.NOTIFICATION_PUSH_IN_BACKGROUND",payload)
      state = dotProp.set(state, "fromBackground", payload);
      state = dotProp.set(state, "forFullScreen",payload);
      return state
      break;
    }
    
    case ActionsTypes.NOTIFICATION_PUSH_FULLSCREEN_ANDROID : {
      console.log("@@@@@@@@@@ ",ActionsTypes.NOTIFICATION_PUSH_FULLSCREEN_ANDROID)
      state = dotProp.set(state, "fullscreenActive",payload);
      return state
      break;
    }

    default:
      return state
  }

}

/*

payload = {caller:'VDP',realname:''}


*/