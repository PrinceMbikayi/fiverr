import { Platform } from 'react-native';

import notifee ,  {
    AndroidImportance,
    AndroidVisibility,
    AndroidLaunchActivityFlag,
    AndroidStyle,
    AndroidCategory,EventType
  } from '@notifee/react-native';
  

/**
 * 
 * @param {string} id 
 * @param {string} name 
 * @param {number} [importance] AndroidImportance.HIGH
 * @param {string} [visibility] AndroidVisibility.PUBLIC
 * @returns 
 */
export const createAChannel = async (id,name,importance =  AndroidImportance.HIGH, visibility = AndroidVisibility.PUBLIC ) => {

    const createdChannel = await notifee.createChannel({
      id:id,
      name:name,
      importance: importance,
      visibility:visibility,
    });
    console.log("createdChannel is ops",createdChannel)
    return createdChannel;
  }


/**
 * 
 * @param {object} props 
 * @param {string} props.channel_id
 * @param {string} props.title
 * @param {string} props.body 
 * @param {string} props.bigPictureUrl 
 * @param {number} props.objectId 
 * @param {object} props.message 
 * @param {object} props.pressAction  {id: 'default'}
 * @param {object} props.actions
 * @param {object} props.notificationDatas
 * @param {boolean} [props.showChronometer = true] true
 * @param {string} [props.debug = "1.0"]
 * @param {number} [timeoutAfter] default false, pass timeout in seconds if you want
 *  
 * @returns 
 */
 export  const buildNotification = async(props) => {


    const {   channel_id,title,body,
              channel,bigPictureUrl,           
              objectId,notificationPA,
              notificationData,
              pressAction, actions,
              fullscreenAction,
              timeoutAfter = false,
              showChronometer = false,
              debug = '1.0',
              smallIcon = 'ic_notification'
            } = props;
              

    console.log("[Core !!! notification Push  buildNotification in Utils",JSON.stringify(props))
 


    let notification = {
      'title': title,
      'body': body,
      'data':notificationData,
      'ios': {
        'sound' : "default"
      },
      'android': {
        'channelId': channel_id,  
        // Recommended to set a category
        'category': AndroidCategory.CALL,
        // Recommended to set importance to high
        'importance': AndroidImportance.HIGH,
        'visibility': AndroidVisibility.PUBLIC,     
        'showChronometer' : showChronometer,
        'sound': "default",  
        smallIcon: smallIcon, // 'ic_notification' or 'ic_launcher' or 'ic_launcher_round'           
        debug:debug,        
      },
      ios: {
        sound: 'default',
      },
    }





    // can't do this by test and spread so ....

    if(bigPictureUrl) {
      notification.android.style = { type: AndroidStyle.BIGPICTURE, picture: bigPictureUrl }
    }

    if(timeoutAfter) {
      notification.android.timeoutAfter = timeoutAfter*1000
    }


    if(pressAction) {
      notification.android.pressAction = pressAction;
    }
    if(actions) {
      notification.android.actions = actions;
    }

  if(fullscreenAction) {
    notification.android.fullScreenAction = fullscreenAction;
  }
  
  // if(notificationPA.picture) {
  //   notification.data["image"] = notificationPA?.image 
  //  }

  //-------- preload object data -----------------
  console.log("Notification done in Utils",JSON.stringify(notification));
  return notification

}