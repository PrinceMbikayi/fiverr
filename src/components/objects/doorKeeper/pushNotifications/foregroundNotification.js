
import React, {useState,useEffect,useRef,useContext} from 'react';
import {    Text, View,StyleSheet,
            Animated, Dimensions, Easing,
            TouchableOpacity,
            AppState
        } from 'react-native';

import { useDispatch,useSelector } from 'react-redux';


import {dataGetObjectIdByEventName,dataGetObject} from '_helpers/dataTools';
import { useTheme } from '_theming/themeProvider';
import {  deleteVdpNotification } from '_actions/notificationPush';
import {StyledIconWrapperView,StyledIconWrapperBlockView} from '_components/ui/styled/icons';
import PureIconRender from '_components/pureIconRender';
import {IconButtonRound} from '@components/ui/buttons/iconButtonRound';
import icons from '_components/objects/doorKeeper/assets/icons';

import {HangUpButton,CallButton} from '../components/ui/callButtons';


import notificationPushManager from '_services/pushNotifications/pushNotificationManager';
import {getObjectByEventName} from '_helpers/objects';
import {decline,hangUp} from '_components/objects/@common/accessVDP/utils/interactions';
import {Api} from '_api';

import { debugAlert } from '_helpers/tools';


export const VdpNotification = (props) => {

    const {message,getNavigation} = props;
    console.log("VdpNotification check 1",props);

    const vdp_notification = useSelector(state => state.notificationPush.vdp);

    const iconBackgroundColor = "#228B22";   
    const animatedValue = useRef(new Animated.Value(0)).current;
    const storeState  = useSelector(state => state);
   // const callerObjectDatas = useSelector(state => dataGetObject(callerId,state)); 
    
    const [callerName,setCallerName] = useState(null);
    const dispatch = useDispatch();
    const {theme} = useTheme();

    // Auto close
    const timeOutRef = useRef(null);
    const timeLimit = 30;

    const onTimeOut = () => {
        closeMe();
    }

    const clearTimeOut = () => {
        if(timeOutRef.current) {
            clearTimeout(timeOutRef.current);
        }
        
    }
    const startTimeOut = () => {
        timeOutRef.current = setTimeout(onTimeOut, timeLimit*1000)
    }
    //-----------------------------


    const startAnimation = toValue => {
        Animated.timing(animatedValue, {
            toValue,
            duration: 250,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => {
            //setIsTop(!isTop);
        })
    }

    

   const  _handleAppStateChange = (nextAppState) => {
        console.log(' foregroundNotification ------------------->>>>> ',nextAppState)
    }


    //--------------------------------------
    const isMounted = useRef(false);
    
    useEffect(() => {
        isMounted.current = true;       
         AppState.addEventListener('change', _handleAppStateChange);
        // WILL UNMOUNT
        return () =>  {
            (isMounted.current = false)
            AppState.removeListener('change', _handleAppStateChange)
        }
      }, []);

      useEffect (() => {
        console.log("vdp foreground vdp_notification",vdp_notification)
      },[vdp_notification])




    useEffect(() => {
        console.log("message +++",message);  
        if(message?.data?.object) {
            const name = getCallerName(message.data.objectId || message.data.object)
            console.log("name +++ ===>",name)
            setCallerName(name);
            if(name != 'nope') {
                switch(message?.origin) {
                    case 'background-accept' :
                    case 'cold-start' :
                        setTimeout(() => {
                            console.log('This will run after 1 second!');
                            openMe(null,message?.origin); // regular openMe is called by a button so first arg is expected to be an event, so pass null and the var
                        
                          }, 5000);
                       break;
                    default :
                    startAnimation(1);
                    startTimeOut();
                }
            } else {
                closeMe()
            }
        } else {

             //-------------
             /*
            if(message?.origin) {
                switch(message?.origin) {
                    case 'background' :
                    case 'cold-start' :
                        setTimeout(() => {
                            console.log('This will run after 1 second!');
                            openMe(null,message?.origin); // regular openMe is called by a button so first arg is expected to be an event, so pass null and the var
                        
                        }, 1000);
                    break;              
                }        
            }
            */
        }

        //const itemId = 
        //  const eventName = 'event/io/athome/'+callerObject+'/'
        
    },[message]); 




    


    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 0],
        extrapolate: 'clamp'
    })


    const hideMe = () => {
        const toDispatch = deleteVdpNotification();
        console.log("toDispatch",toDispatch)
        dispatch(toDispatch)
    }

    const closeMe = () => {
        clearTimeOut();
        let itemId = message?.data?.object;
        if(isNaN(Number(itemId))) {
            const callerEventName = 'event/io/athome/'+message?.data?.object+'/'; 
            itemId = getObjectByEventName(callerEventName);
            console.log('close Vdp notification',itemId);
        }
        
        //const doDecline = Api.executeAction(itemId,"DECLINE");
        decline(itemId);
        hangUp(itemId)
        hideMe();
    }


    const openMe = (e,comeFrom) => {
        console.log("real open from foregroundNotification VDP !!!!!!",comeFrom)
        console.log("message VDP !!!!!!",message)
       
        //debugAlert("openMe de vdpNotification",""+"-->"+"\n"+JSON.stringify(message))
        const caller = message?.data?.object;
        const callerEventName = 'event/io/athome/'+caller+'/'; 
        const virtualCallerEventName = callerEventName.split("/athome").join("/virtual");
        const  itemId = message?.data?.objectId || getObjectByEventName(callerEventName) || getObjectByEventName(virtualCallerEventName);
        const navigation = getNavigation();

        let params;
        if(message?.data?.object) {
            params = {'caller':'VDP','eventName':callerEventName,'id':Number(itemId),'sentTime':message.sentTime}
        }   else{
            params = {'caller':'generic'}
        }
      
        if(comeFrom != undefined)params["origin"] = comeFrom;
        console.log("NNNNN params VDP",params)
        if(isMounted.current) {
            notificationPushManager.redirect(navigation,params);
        } else {
            console.log("mais je l'ouvre pas")
        }
        //closeMe();
        clearTimeOut(); 
        hideMe();
    }

    const getCallerName = (callerName) => {

        // now callerName is the id of the VDP so ...
        console.log("getCallerName",callerName)
        let callerId = Number(callerName);

        if(isNaN(callerId)){
            const eventName = 'event/io/athome/'+callerName+'/'  
            console.log(JSON.parse(JSON.stringify(storeState)))  
            console.log("eventName",eventName);    
            callerId = dataGetObjectIdByEventName(storeState,eventName);
            // just for VDP / QR Code
            if(callerId == undefined || callerId == 'nope') {
               
                const virtualEventName = eventName.split("/athome").join("/virtual");
               
                callerId = dataGetObjectIdByEventName(storeState,virtualEventName);
                console.log("yoyoyoyoyo ",virtualEventName,callerId)
            }
        } 
        
        //if(callerId == undefined && )

        console.log("YoYo callerName,callerId",callerName,callerId)
        //be careful in params id,state
        const callerDatas = dataGetObject(callerId,storeState);
        return callerDatas?.name || "nope"
    }

    
    const iconSize = 48;
    return (
            <View style={{'position':'absolute','top':0,width:'100%',height:'100%',flex:1,backgroundColor:'#00000066'}}>
                <Animated.View style={[{backgroundColor:'#000000',width:'100%',height:100,padding:15},{ transform: [{ translateY }] }]}>
                    <View style={{flex:1,flexDirection:'row',flex:1,alignItems:'center'}}>
                   
                        <View style={{flex:1,flexGrow:2,flexDirection:'row',alignItems:'center'}}>
                            <PureIconRender size={iconSize} img="bell.svg" appIcon fill="white"/> 
                            <View style={{flexDirection:'row',alignItems:'center',marginRight:30}}>                                                           
                                <Text style={{color:'white',flexWrap: 'wrap',marginRight:20}} ellipsizeMode='tail' numberOfLines={1} >{callerName}</Text>
                            </View>
                        </View>
                        
                        <View style={{flexDirection:'row'}}>
                            <HangUpButton onPress={closeMe} size={iconSize}/>
                            <CallButton onPress={openMe} size={iconSize}/>
                        </View>
                    </View>                   
                </Animated.View>
            </View> 
    );
}