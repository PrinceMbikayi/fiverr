
import { Platform,PermissionsAndroid,Linking } from 'react-native';
import { cloneDeep } from 'lodash';

export const  createNotificationPA = (rawNotification) => {
    //debugAlert("notifeeManageInitialNotification start",""+"-->"+"\n"+"voià voilà")
 
    console.log("[createNotificationPA] rawNotification  =>",JSON.stringify(rawNotification));
   
    const deepCloned = cloneDeep(rawNotification)

 
    if(Platform.OS == "android") {

      let nDatas = {};
      const ao = Object.keys(rawNotification);
       console.log('CHECT_NOTIF_ENTERED_1 :',ao, rawNotification);
      ao.map((v)=> {
          console.log('VV_NOT :', v);
        switch(v) {
          case "notification" :  
            nDatas = {...deepCloned[v]};        
            break;
        
          default : 
            nDatas[v] = deepCloned[v];
        }
        
        })
        nDatas.category = nDatas.categoryId = nDatas.channelId = nDatas?.channel_id;
        delete nDatas.data;
      
      return nDatas;
    }

    if(Platform.OS == "ios") {
      console.log("here we go",JSON.stringify(rawNotification))
      let iDatas = {};
      const eo = Object.keys(rawNotification);
      
        eo.map((v)=> {
          
          switch(v) {
            case "data" :  
            const cloned = deepCloned[v].notifee_options?.ios
              iDatas = {...iDatas,...cloned};
              iDatas.categoryId = cloned?.categoryId;
              iDatas.channelId = cloned?.categoryId;
              break;
            case "notification" :
              iDatas.title =deepCloned[v].title;
              iDatas.body = deepCloned[v].body;
              break;
            case "contentAvailable" :
            case "mutableContent" :
              //ignore
              break;

            default : 
              iDatas[v] = deepCloned[v];
          }
          
          })
          if(  iDatas.hasOwnProperty('category' )) {
            iDatas.category = iDatas.categoryId;
          }
          if(  iDatas.categoryId) {
            iDatas.category = iDatas.categoryId;
            iDatas.channelId = iDatas.categoryId;
          }
        
        console.log("[createNotificationPA] from ios notifee 22",JSON.stringify(iDatas));
        return iDatas;
    }


   
  }
