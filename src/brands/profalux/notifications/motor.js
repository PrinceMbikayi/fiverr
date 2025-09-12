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

  import {
    setMotorNotificationsHistory
  } from '_actions/notifications'

  import  navigationService from '_services/navigationService';
  import store from '_store';

  import {getObjectById} from '_helpers/objects';

import i18n from 'i18next';
import i18next from '_utils/i18next'; 
  
import {createAChannel,buildNotification} from '_services/pushNotifications/allNotifications/utils';
//================== EventId unique subString ======================
export const eventIdSearchFor = ["gate/swing"];

//================== CATEGORIES / CHANNELS =====================

export const initCategories = async() => {
  
    const forIos = await generateIosCategory();  
    const mc = await createChannel(); 
    return true;
}

//=============== CONST ========================

const notification_button_accept = i18n.t("motor:NOTIFICATION_ACCEPT_BUTTON");
const notification_button_decline = i18n.t("motor:CALL_DECLINE")
const channel_id = "motor";

/**
   * Needed for IOS notifications with buttons
   */
const generateIosCategory = async() => {
    await notifee.setNotificationCategories([
        {
          id: channel_id,
          actions: [
            {
              id: 'accept',
              title:notification_button_accept,
              foreground: true,
            },
            {
              id: 'decline',
              title: notification_button_decline,              
            },
          ],
        },
      ]);
}


const createChannel = async() => {  
    const channelId = await createAChannel(channel_id,"Motor Channel");  
      return channelId;
}
//===================== exposed methods ==========================  


  export const execute = (notificationPA,dispatch) => {
 
    const moveInfos = buildRedirectParams(notificationPA);
    navigationService.navigate(moveInfos.route,moveInfos.params);   
    store.dispatch(deleteVdpNotification())  
   // deleteVdpConversationNotification();
  }
  



//=================== EVENTS ===================================



export const delivered = (notification) => {
   
    console.log("ZmotorDelivered")
      return false;
}

export const onPressed = (pressed,notification) => {    
    
    console.log("Motor onPressed",pressed)
  
    switch(pressed) {

      case "pressed" :
       
      /*const remoteMessage = {data:{'object':object,'objectId':pressAction?.objectId,'channel_id':channel_id,title:"Motor Erreur !!! ",}};     
        const callerEventName = getPushNotificationCallerEventName(remoteMessage);
        if(callerEventName != null) {
          const notification = {'caller':"motor",'eventName':callerEventName,'notification':remoteMessage,'origin':'background-accept'};  
          store.dispatch(setNotificationFromBackground(notification))
        };
        */
        break;

      case "more" :
        store.dispatch(setNotificationFromBackground(notification)) 
        break;
    }
}


// =============== NOTIFICATION =======================
const getErrorBody = (errorId) => {
  const errorLocale = "ERROR_" + ((errorId) ? errorId : "UNKNOWN");
  return  i18n.t("motor:"+errorLocale);
}


export const buildNotifee = async(notificationPA) => {

    console.log("buildNotifee  Motor message yep yep yep",JSON.stringify(notificationPA)) ;  
    console.log("---------------- 0 ----------------------")
    const title =  notificationPA?.title || "no title";
    const body = getErrorBody(notificationPA?.errorId)
    console.log("---------------- 1 ----------------------")
   // if(notificationPA?.errorId == 11) return false;
    console.log("---------------- 2 ----------------------")
    const bigPictureUrl = notificationPA.picture;
    const notification_button_accept = i18n.t("motor:PN_ERROR_OK_BUTTON");
    const notification_button_more = i18n.t("motor:PN_ERROR_MORE_BUTTON")
    const timeOutAfter = 30; // en secondes  
    const objectId = notificationPA?.objectId;  
    const notificationData = {"objectId":notificationPA?.objectId,"errorId":notificationPA?.errorId}
    const channel_id = await createChannel();
    console.log("---------------- 3 ----------------------")
    const pressAction = { id: 'default'} ;
    const actions =  [        
                        {
                          title: notification_button_accept,
                          pressAction: {
                              id: 'cancel',
                             
                            }
                        },
                        {
                          title: notification_button_more+"",
                          pressAction: {
                            id: "more",
                            testo:"testo yep",
                          
                            object: notificationPA?.object,
                            objectId: notificationPA?.objectId,
                            errorId: notificationPA?.errorId,
                            launchActivity: "com.extel.umii.MainActivity",
                          /* launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],   */       
                          },                  
                        },
                      ];  

    const params = {channel_id,title,body,notificationData,bigPictureUrl,pressAction,actions,notificationPA}
    console.log("[motor buildNotifee ",params)

    const notif = await buildNotification(params)
    console.log("notif bis 2=>",JSON.stringify(notif))
    return notif  

  }


// =============== REDIRECT ===========================
/**
 * 
 * @param {*} navigation 
 * @param {*} notificationPlus 
 * @param {*} callerEventId 
 * @param {*} objectId 
 * @returns 
 */
export const buildRedirectParams = (notificationPA) => {
  

 const {objectId,errorId} = notificationPA

  const params =  { 'typeName':'BoardGateError',
                    'params' : {
                        'itemId':objectId,
                        'errorId' : Number(errorId),
                        
                      }
                  }  
  return ({'route': 'ProductDetails', params:params})
}

//------------------------
const hiddenErrors = [14,15]
const notAloneErrors = {"err_61" : [11,28],"err_63" : [11]}
//-------------------------
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}



export const filter = (preFilteredMessage) => {

  console.log("[push motor filter datas",preFilteredMessage)

  const baseDatas = preFilteredMessage?.data || preFilteredMessage || {};

  const itemId = baseDatas?.objectId ;
  const errorId = baseDatas?.errorId;
  //console.log("itemId",itemId,"errorId",errorId)
  const motorDatas = (itemId) ? getObjectById(Number(itemId)) : null;
 // console.log("motorDatas",motorDatas)
  const previousErrors =  motorDatas?.statusDictionary?.__json_errors_history;
  //console.log("Motor Filter !!","<"+errorId+">");

  if(hiddenErrors.indexOf(errorId) != -1) return false;

  const toStore = setMotorNotificationsHistory({errorId:errorId,itemId:itemId,date:Date.now()})
  if(errorId == 63) {
    sleep(1000)
  }

  //console.log("STORE ??",store)
  console.log("[err O toStore]",toStore)
  store.dispatch(toStore)  
  //console.log("After dispatch !!!") ;
  //console.log("[err A]")
  const lastError = store.getState()?.notificationPush?.motorErrorsHistory?.[0] || [{noError:true}] 
  //console.log("[err B]")
  const gateMode = motorDatas?.statusDictionary?.gate_mode ;
  //console.log("[err C]")
  //console.log("errorId, lastError, gateMode =>",errorId,lastError,gateMode)
  if(gateMode == 1) {

    switch(Number(errorId)) {

      case 11:
      case 28:
        console.log("need delay")
        delayErrorAutoClose(store,preFilteredMessage);
        return false;
        break;
      
      case 63:
      case 61:
       
        if(notAloneErrors["err_"+errorId]) {
          //console.log("myHistory",myHistory)
          console.log("yoyoyo errorId,lastErrorId",errorId,lastError?.errorId)
          const isHere = (notAloneErrors["err_"+errorId].indexOf(Number(lastError?.errorId)) != -1)
          if(isHere) return false;
        }
        break;
    }
  }


  return preFilteredMessage;
 
}

const delayErrorAutoClose = (store,initialMessage) => {
  console.log("demande delayErrorAutoClose");
  const initialError = initialMessage?.data?.errorId
  setTimeout(() => {
    console.log("Retardée de 2 secondes au début")
    const lastErrorId = store.getState()?.notificationPush?.motorErrorsHistory?.[0]?.errorId || [{noError:true}];
    console.log("lastErrorId",lastErrorId)

    let errMessage = {...initialMessage};
    const searchKey = "err_"+lastErrorId
    //const notAloneErrors = {"err_61" : [11,28],"err_63" : [11]}
    console.log("searchKey",searchKey)
    const isIn = notAloneErrors[searchKey];
    console.log("inIn",isIn);
    console.log("initialError",initialError)
    if(isIn != undefined) {
      if( isIn.indexOf(Number(initialError)) != -1) {
          errMessage.data.errorId = lastErrorId+"+"+initialError
      } else {
      console.log("ben pas dedans");
      }
    }
    
    console.log("vloup")
    const toDispatch = addNotificationPush(errMessage);
    store.dispatch(toDispatch);

    console.log("Retardée de 2 secondes après.",JSON.stringify(lastErrorId));
  
  },2000)
  
  
}

/**
 * called in src/services/pushNotifications/myPushNotifications.js
 * @param {object} props
 * @param {object} props.notification 
 * @param {navigation} props.navigation
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