import notifee ,  {
    AndroidImportance,
    AndroidVisibility,
    AndroidLaunchActivityFlag,
    AndroidStyle,
    AndroidCategory,EventType
  } from '@notifee/react-native';



// create a channel
/**
 * 
 * @param {string} id 
 * @param {string} name 
 * @param {"HIGH"|"LOW"|"MIN"|"DEFAULT",|"NONE"} importance
 * @param {"PUBLIC"|"PRIVATE"|"SECRET" }
 */
export const createChannel = async(id,name,importance="HIGH",visibility="PUBLIC") => {

    const channelId =  await notifee.createChannel({
            id:id,
            name: name,
            importance: AndroidImportance[importance],
            visibility: AndroidVisibility[visibility]
      })

      return channelId;
  }
