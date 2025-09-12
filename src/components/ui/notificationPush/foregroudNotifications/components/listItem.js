
import React, {useState,useEffect,useRef} from 'react';
import { Text, View,StyleSheet,FlatList, Platform } from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import LottieView from 'lottie-react-native';



const ListItem = (props) => {

  
    const {message,onLeftOpen} = props;
  
   
  
    console.log("ListItem >",message)
    const title = message?.notification?.title || message?.title || "err title not found";
    const body = message?.notification?.body || message?.body || "err body not found";
  
   
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
      return (
        <Swipeable
              renderLeftActions={(progress, dragx) => <LeftItem />}
              onSwipeableLeftOpen={()=>onLeftOpen(props.timestamp)}
              
          >
          <View style={{flex:1,width:'100%',padding:20,minheight:30,marginTop:15,backgroundColor:"#FF00FF"}}>
                                  <Text style={{color:"white",fontWeight:'bold'}}>{title}</Text>
                                  <Text style={{color:"white"}}>{body}</Text>
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