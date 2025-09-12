import React, {Component} from 'react';
import {useEffect,useState,useRef} from 'react';
import {View,Text,Image,ImageBackground,BackHandler,AppState, NativeModules, Platform,Dimensions,Alert} from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';


import notifee  from '@notifee/react-native';

//import RNExitApp from 'react-native-exit-app';
//import RNExitApp from 'react-native-exit-app-no-history';
//
import { useDeviceOrientation } from '@react-native-community/hooks';
// -----------
import store from '_store';
import { useTheme } from '_theming/themeProvider';
import {startWs} from '_api/Api';

import {  deleteVdpNotification } from '_actions/notificationPush';
import RTCComponent from '_components/objects/@common/accessVDP/webRTC';
import {HangUpButton,CallButton} from '_components/objects/@common/accessVDP/ui/callButtons';
//--------------
import {RECORD_ACTION_SNAPSHOT,RECORD_ACTION_START_RECORDING,RECORD_ACTION_END_RECORDING} from '../utils/interactions';
import {doRecordAction,openGate,openDoor,decline,hangUp} from  '../utils/interactions';

import { ThemeContextProvider } from '_theming/themeProvider';
import {fullscreen_push_android_started} from '_actions/notificationPush';
import {getObjectById,getWidgetReference} from '_helpers/selectors'
import { getImage } from '../utils/image';

export const FullscreenNotification = (props) => {


    const {objectId} = props

    console.log("QR Basic FullscreenNotification begin pour de vrai")
    const theme = {}
    const phoneIconSize = 64;    
    const {connected} = true;   
    
    const [isActivated, setIsActivated] = useState(false);
    const [itemDatas,setItemDatas] = useState(null)
    const [notificationImage,setNotificationImage] = useState();
    const [videoPresent,setVideoPresent] = useState(false) ;
    const [openActions,setOpenActions] = useState(["GATE","STRIKE"]);
    //------------------------------------------------------
    const [screenWidth,setScreenWidth] = useState(10);
    const [screenHeight,setScreenHeight] = useState(10);

    const [intervalImage, setIntervalImage] = useState(null);


    const gyMyImage = async() => {
        console.log("-----> gyMyImage")
        const img = await getImage(objectId);
        console.log("img",img)
       // setImage(itemId,img,dispatch);
        setIntervalImage(img);
    }

   

    useEffect(() => {
        const myWidth = Dimensions.get('screen').width;      
        setScreenWidth(myWidth);
        setScreenHeight(Dimensions.get('window').height-24); 
        const datas = store.getState()?.objects?.entities?.objects?.[objectId];
        setItemDatas(datas);
        gyMyImage();
       
     },[])

     const onStoreChanged = () => {
        console.log("onStoreChanged",itemIdRef.current)
       // setCheckVDP(store.getState()?.objects?.entities?.objects);
        if(itemIdRef.current) {
            const myDatas = store.getState()?.objects?.entities?.objects?.[itemIdRef.current];
            //console.log("myDatas",myDatas)
            setItemDatas(myDatas);
            gyMyImage();
        }
        
    }
    useEffect(() => {
        console.log("dans la notif FS QR=>",intervalImage)
       
     },[intervalImage])





    const checkFullScreen = store.getState().notificationPush?.forFullScreen;
    //const checkVDP =store.getState()?.objects?.entities
    console.log("---> check continiously",checkFullScreen)

     //-----------------------------------------------------
    const isVideoFullscreen = false;
    //const { theme} = useTheme();

    const liveBarActions = {'shoot':takeSnapshot, 'talk':talking,'record':recordVideo};

    const appStateRef = useRef(AppState.currentState);
    const backHandlerRef = useRef();
    const itemIdRef = useRef(null);
  
    const timeLimit = 30;

    const onTimeOut = () => {
       
        endConversation();
    }
    const timeOutRef = useRef(null)

    const activityStarter = NativeModules.ActivityStarter;

    


    const takeSnapshot = () => {
       // Toast.show("Snapshot",{position: Toast.positions.TOP});
        //doRecordAction(itemId,RECORD_ACTION_SNAPSHOT)
    }

    const recordVideo = (isRecording) => {
        /*
        const msg = (isRecording == true) ? 'start recording' : 'end recording';       
        Toast.show(msg,{position: Toast.positions.TOP});
        const actionArg = (isRecording) ? RECORD_ACTION_START_RECORDING : RECORD_ACTION_END_RECORDING;
        doRecordAction(itemId,actionArg)
        */
    }
    const talking = (isTalking) => {
        /*
        const msg = (isTalking == true) ? 'talking' : 'no more talking';
        Toast.show(msg,{position: Toast.positions.TOP});
        */
    }

    const startConversation = () => {
        
        clearTimeout(timeOutRef.current);
        //const datas = store.getState()?.objects?.entities?.objects?.[objectId];
        //console.log(store.getState()?.objects?.entities?.objects);
     
        //console.log("itemDatas",datas)
        setIsActivated(true);
        //setVideoPresent(true);
    }


    const onDecline = () => {
        console.log("before decline");
        const itemId = objectId;
        if(itemId) {
            const doDecline = decline(itemId);
            const doHangUp = hangUp(itemId);
        }
        
    }


    const endConversation = async() => {
        setIsActivated(false);
        setVideoPresent(false);
        onDecline();
       
        if(Platform.OS == 'android') {
            const activityName = await activityStarter.getActivityNameAsPromise();
            console.log("finishActivity",activityName)
            if(activityName != "MainActivity") {

               
                if(isFullScreenAppQuitMode()) {
                    // exitApp if MainActivity not fully launched 
                    //RNExitApp.exitApp(); 
                } else {
                     // finish activity in MainApp is fully launched (Off / app in background)
                    activityStarter.finishActivity()
                }
                
            }
            
        } else {
            //RNExitApp.exitApp();
            console.log("after RNExitApp")
        }
       
       
       
        //BackHandler.exitApp()
    } 




    const doAlert = (body) => {
        Alert.alert(
            "debug production variant",
            body,
            [{
              text: 'Close'
            }]
          );
    }



    const getInitialNotification = async() => {
        const initialNotification = await notifee.getInitialNotification();
        console.log("initialNotification",initialNotification)
    }




    const _handleBackPress = () => {
        closeFullscreenNotification();
    }

    const _handleAppStateChange = (nextAppState) => {
        console.log(' fullNotification ------------------->>>>> _handleAppStateChange',appStateRef,nextAppState);
        if(nextAppState == "background") {
            //console.log("plz end conversation !!!!!!!")
            //closeFullscreenNotification();
        }
        appStateRef.current = nextAppState;
      };

      const isFullScreenAppQuitMode = () => {
          const ret = store.getState()?.notificationPush?.token;

          return (ret == "")
      }




    const closeFullscreenNotification = () => {
        AppState.removeEventListener('change', _handleAppStateChange);
        backHandlerRef.current.remove();
        endConversation();
    }

    const checkAppIsreadyActive = (objectId) => {
        if(objectId != undefined) {
            const isActive = getObjectById(store.getState(),objectId);
            console.log('isActive',isActive);
           // onStoreChanged();
        }      
        
    }



    // ========== effects ====================
            
      useEffect(() => {

        console.log("FullScreen Component Did mount !!!")
        


        backHandlerRef.current = BackHandler.addEventListener('hardwareBackPress', _handleBackPress);
        AppState.addEventListener('change', _handleAppStateChange);
        const checkFullScreen = store.getState().notificationPush?.forFullScreen;       
        itemIdRef.current = objectId;
        // if app in in background it'll launch immediate render
        checkAppIsreadyActive(objectId)

       

        if(checkFullScreen) {
            setNotificationImage(checkFullScreen?.data?.image || checkFullScreen?.notification?.data?.image);
            const toDispatch = deleteVdpNotification();
             // Remove the notification
            
            console.log("toDispatch",toDispatch)
            store.dispatch(toDispatch)
            if(checkFullScreen?.id && checkFullScreen?.id !="") {
                cancelNotification(checkFullScreen?.id);
            }
        }
        const unsubscribe = store.subscribe(onStoreChanged);      

        // plus besoin c'est géré directement dans la création de notification
        //timeOutRef.current = setTimeout(onTimeOut, timeLimit*1000)

        // WILL UNMOUNT
        return () => {           
            unsubscribe(); 
            closeFullscreenNotification();    
            
        }
    }, []);

    const orientation = useDeviceOrientation();
    const [myOrientation,setMyOrientation] = useState(orientation.portrait ? 'portrait':'landscape'); 

    useEffect(() => {
    
        const isRealyLandscape = (orientation.portrait === false);
        // setModalVisible(isRealyLandscape);       
         setMyOrientation(orientation.portrait ? 'portrait':'landscape');
        // setVideoFullscreen(!orientation.portrait);        
         setScreenWidth(Dimensions.get('screen').width);
     },[orientation.portrait])

     
    useEffect(()=> {
       // Refresh
    },[itemDatas])

    const cancelNotification = async(id) => {
        //console.log("cn todo",id);
        const cn =  await notifee.cancelNotification(id);
        //console.log("cn done",id)
    }


    const rtcCallback = (actionName,actionArgs) => {
        console.log("actionName",actionName,"actionArgs");

        /*
        switch(actionName) {
            case 'remoteStreamPresent' :
                setVideoPresent(1)
                break;
        }
        */
    }   
    const videoRatio = 16/9;
    const backgroundColor = theme['card--color--bodybg'] || theme['color--bg'] || "back";

    const videoLandscapeWrapperStyle = {position:'absolute', width: Dimensions.get('window').width,height: Dimensions.get('window').height,backgroundColor:'transparent'}
    const buttonsBarStyleFullScreen = { backgroundColor:'#00000055',flexDirection:'row', width:'100%',height:75,top:0};
    const buttonsBarStyle = (!isVideoFullscreen) ? {backgroundColor:backgroundColor} : buttonsBarStyleFullScreen;

    

    return (
        <ThemeContextProvider>               
            <View style={[{backgroundColor:'transparent' || realBackgroundColor},(myOrientation == 'portrait' || myOrientation == undefined) ? {flex:1,width: Dimensions.get('window').width,height: Dimensions.get('window').height-84}:{width: Dimensions.get('window').width,height: Dimensions.get('window').height-84}]}>               
                      
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{width:'100%',height:screenHeight || screenWidth/videoRatio,backgroundColor:'black',flex:1,position:'relative'}}>
                                { (isActivated && itemDatas) &&
                                <RTCComponent iceStatus={itemDatas?.statusDictionary?.ice} answer={itemDatas?.statusDictionary?.answer} itemId={objectId} callback={rtcCallback}
                                            isQrCode roomId="aaaaa" hasLocalVideo intervalImage={intervalImage}/>                                
                                }
                                {(!isActivated) &&
                                    <View style={{width:'100%',height:'100%',backgroundColor:'black'}}>
                                        <ImageBackground source={intervalImage} resizeMode="cover" fadeDuration={0} style={{width:'100%',height:'100%'}}>                                            
                                        </ImageBackground>
                                    </View>
                                }
                                <View style={{height:100,width:'100%',position:'absolute',zIndex:7,backgroundColor:'#DDDDDD',bottom:0,flexDirection:'row'}}>

                                       
                                            <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent',height:100,width:'48%',flex:1}}>
                                                <HangUpButton onPress={endConversation} size={phoneIconSize} />
                                            </View>
                                            {!isActivated && 
                                            <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent',height:100,width:'48%',flex:1}}>
                                                <CallButton onPress={startConversation} size={phoneIconSize} />
                                            </View>
                                            }
                                      
                                  
                                </View>                     
                            </View>
                        </View>
                        
            </View>
            {/*
            <View style={{width:'100%',height:120,backgroundColor:"transparent"}}>
                <View style={{flex:1,flexDirection:'row',height:(!isVideoFullscreen) ? 90: 75,justifyContent:'center',alignItems:'center',transform:[{scale:(!isVideoFullscreen) ? 1: 0.8}],paddingBottom:(!isVideoFullscreen) ? 10 : 0}} >
                        { openActions.indexOf("GATE") != -1 &&
                        <View style={{width:'50%',height:60,backgroundColor:'transparent',paddingLeft:10,paddingRight:10}}>
                            <CustomUnlock   iconThumb="gate" iconRight="padlock" callback = {openGate} itemId={itemDatas?.id} enabled={connected}/>
                        </View>
                        }
                        { openActions.indexOf("STRIKE") != -1 &&
                        <View style={{width:'50%',height:60,backgroundColor:'transparent',paddingLeft:10,paddingRight:10}}>
                            <CustomUnlock  iconThumb="door" iconRight="padlock" callback ={openDoor} itemId={itemDatas?.id} enabled={connected} />
                        </View>
                        }
                    </View>
                    {( connected == false) &&
                            <DisconnectedViewOverlay pointerEvents="none" bgColor={theme['card--color--deactivated-overlay'] || "#00000044"} />
                    }
                </View>
                */}
                {/*            
            <InComingCallButtonsView>
               <>
                <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent',height:100,flex:1}}>
                    <HangUpButton onPress={endConversation} size={phoneIconSize} />
                </View>
                {!isRinging && 
                <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent',height:100,flex:1}}>
                    <CallButton onPress={startConversation} size={phoneIconSize} />
                </View>
                }
                </>
            </InComingCallButtonsView>
            */}
       
        </ThemeContextProvider> 
    )
}

const ComponentView =  styled.View`
                    flex: 1;
                    justify-content:center;
                    align-items:center;
                    background-color:black;
                 `;

const IncomingView = styled.View`
                position:absolute;
                top:0;
                left:0;
                bottom:0;
                right:0;
                flex-direction:column;     
                background-color:${props => props.bgColor || "#000000E8" };
                z-index:2;
                flex:1;
            `;

const InComingCallButtonsView= styled.View`
                flex-grow:2;
                background-color:${props => props.bgColor || "#000000E8" }; 
                width:100%;
                flex-direction:row;   
            `;

const DisconnectedViewOverlay = styled.View`
                position:absolute;
                width:100%;
                height:100%;         
                background-color:${props => props.bgColor || "#FF0000CC" };
                `;