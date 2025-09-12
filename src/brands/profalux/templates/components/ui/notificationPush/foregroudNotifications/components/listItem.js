
import React, {useState,useEffect,useRef} from 'react';
import { Text, View,StyleSheet,FlatList, Platform } from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import LottieView from 'lottie-react-native';

import { useTranslation } from 'react-i18next';

const channelColors = {"motor" : {"bgColor":"blue","textColor":"yellow"}}


const formatTitle = (title,channel_id) => {
 

  switch(channel_id) {
    case 'motor' : 
        return "Erreur Motorisation";
        break;
    default :
        return title
  }
}

const formatBody = (body,channel_id) => {
  switch(channel_id) {
    case 'motor' : 
        return "Erreur Motorisation";
        break;
    default :
        return title
  }
}

const ListItem = (props) => {

  
    const {message : baseMessage,onLeftOpen} = props;
    const { t, i18n } = useTranslation();
   
    const message = baseMessage.data || baseMessage
  
   
    const channel_id = message?.channelId;
    console.log("ListItem in Umii brand>",message,channel_id)
    const nTitle = message?.title ||  message?.notification?.title ||  message?.notification_datas?.title || "err title not found";
    const title = formatTitle(nTitle,channel_id);

    let body = message?.body || message?.notification?.body || "err body not found";
  
    if(channel_id == "motor") {
      //body = "il y a une erreur de type ++ ("+message?.data?.errorId+")"
      body = t("motor"+":"+"ERROR_"+message?.errorId)
    }

   
    const [showHelp,setShowHelp] = useState(false)
    const delay = 8;
    useEffect(() => {
      // mount
      let timer1 = setTimeout(() => setShowHelp(true), delay * 1000);
      
      return () => {
          // unmount
          clearTimeout(timer1);
          console.log("cleaned up");
        };
   }, []);
  
  
      //onLeftOpen


    const textColor = channelColors?.[channel_id]?.textColor || "white";
    const bgColor =  channelColors?.[channel_id]?.bgColor || "orange";




      return (
        <Swipeable
              renderLeftActions={(progress, dragx) => <LeftItem />}
              onSwipeableLeftOpen={()=>onLeftOpen(props.timestamp)}
              
          >
          <View style={{flex:1,width:'100%',padding:20,minheight:30,marginTop:15,backgroundColor:bgColor,borderRadius:8}}>
                                  <Text style={{color:textColor,fontWeight:'bold'}}>{title}</Text>
                                  <Text style={{color:textColor}}>{body}</Text>
                                  { showHelp &&
                                      <View style={{position:'absolute',alignSelf:'flex-end',width:100,height:100,backgroundColor:'transparent'}}>
                                        <LottieView source={require('_assets/lotties/swipe-gesture-right.json')} autoPlay loop />
                                      </View>
                                  }
          </View>
        </Swipeable>
      );
    };
  
    const LeftItem = () => {
      return (
        <View style={{backgroundColor:'#00FF0000',width:'150%'}}>
          <Text style={{color:'white'}}></Text>
        </View>
      );
    };

export default ListItem;