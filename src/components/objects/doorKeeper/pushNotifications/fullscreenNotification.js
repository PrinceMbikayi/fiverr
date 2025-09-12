import React, {Component} from 'react';
import {useEffect,useState,useRef} from 'react';
import {View,Text,Image,BackHandler,AppState, NativeModules, Platform,Dimensions,Alert} from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

import store from '_store';
import notifee  from '@notifee/react-native';

//import RNExitApp from 'react-native-exit-app';
//import RNExitApp from 'react-native-exit-app-no-history';



// -----------
import { useTheme } from '_theming/themeProvider';

import {  deleteVdpNotification } from '_actions/notificationPush';
import RTCComponent from '_components/objects/@common/accessVDP/webRTC';
import {LiveBar} from '_components/objects/@common/accessVDP/liveBar';
import {CustomUnlock} from '_components/objects/@common/accessVDP/customUnlock';

//--------------

import {HangUpButton,CallButton} from '_components/objects/@common/accessVDP/ui/callButtons';
import {RECORD_ACTION_SNAPSHOT,RECORD_ACTION_START_RECORDING,RECORD_ACTION_END_RECORDING} from '_components/objects/@common/accessVDP/utils/interactions';
import {doRecordAction,openGate,openDoor,decline,hangUp} from  '_components/objects/@common/accessVDP/utils/interactions';

import { ThemeContextProvider } from '_theming/themeProvider';
import {fullscreen_push_android_started} from '_actions/notificationPush';
import {getObjectById} from '_helpers/selectors';

export const FullscreenNotification = (props) => {

    const {objectId} = props

    console.log("VDP fullscreenNotification begin")
    const theme = {}
    const phoneIconSize = 64;
   
    
    const {connected} = true; 

    const [checkVDP,setCheckVDP] = useState();
    const [itemDatas,setItemDatas] = useState()
    const [isRinging,setIsRinging] = useState(false);
    const [notificationImage,setNotificationImage] = useState();
    const [videoPresent,setVideoPresent] = useState(false)  ;
    const [openActions,setOpenActions] = useState(["GATE","STRIKE"]) 

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
        //
        clearTimeout(timeOutRef.current);
        setIsRinging(true);
        setVideoPresent(true);
    }


    const onDecline = () => {
        console.log("before decline");
        const itemId = itemIdRef.current;
        if(itemId) {
            const doDecline = decline(itemId);
            const doHangUp = hangUp(itemId);
        }
        
    }


    const endConversation = async() => {
        setIsRinging(false);
        setVideoPresent(false);
        onDecline();
       
        if(Platform.OS == 'android') {
            const activityName = await activityStarter.getActivityNameAsPromise();
            console.log("finishActivity",activityName)
            if(activityName != "MainActivity") {

               
                if(isFullScreenAppQuitMode()) {
                    // exitApp if MainActivity not fully launched 
                   // RNExitApp.exitApp(); 
                } else {
                     // finish activity in MainApp is fully launched (Off / app in background)
                    activityStarter.finishActivity()
                }
                
            }
            
        } else {
           // RNExitApp.exitApp();
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




    const checkFullScreen = store.getState().notificationPush?.forFullScreen;
    //const checkVDP =store.getState()?.objects?.entities
    console.log("---> check continiously",checkFullScreen)

    

    const onStoreChanged = () => {
        console.log("onStoreChanged",itemIdRef.current)
        setCheckVDP(store.getState()?.objects?.entities?.objects);
        if(itemIdRef.current) {
            const myDatas = store.getState()?.objects?.entities?.objects?.[itemIdRef.current];
            //console.log("myDatas",myDatas)
            setItemDatas(myDatas)
        }
        
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

    const checkAppIsreadyActive = (vdpId) => {
        if(vdpId != undefined) {
            const isActive = getObjectById(store.getState(),vdpId);
            console.log('isActive',isActive);
            onStoreChanged();
        }      
        
    }



    // ========== effects ====================
            
      useEffect(() => {

        console.log("FullScreen Component Did mount !!!")
        const unsubscribe = store.subscribe(onStoreChanged);

        /*
        if(Platform.OS == 'android') {
            const activityName = activityStarter.getActivityName((name) => {  console.log("$$$$$$$$$$$  ",name,"    $$$$$$$$$$$$$$$$") });
           store.dispatch(fullscreen_push_android_started())
        }
        */


        backHandlerRef.current = BackHandler.addEventListener('hardwareBackPress', _handleBackPress);
        AppState.addEventListener('change', _handleAppStateChange);
        const checkFullScreen = store.getState().notificationPush?.forFullScreen;
       
        itemIdRef.current = objectId;     
       
        checkAppIsreadyActive(objectId)

        //getInitialNotification();
       

        if(checkFullScreen) {
            setNotificationImage(checkFullScreen?.data?.image || checkFullScreen?.notification?.data?.image);
            const toDispatch = deleteVdpNotification();
             // Remove the notification
            
            console.log("toDispatch",toDispatch)
            store.dispatch(toDispatch)
            if(checkFullScreen?.id && checkFullScreen?.id !="") {
                cancelNotification(checkFullScreen?.id);
            }

           // doAlert( "(+++"+(vdpId)+"+++)")




        }

       // const unsubscribe = store.subscribe(onStoreChanged);

        

        // plus besoin c'est géré directement dans la création de notification
        //timeOutRef.current = setTimeout(onTimeOut, timeLimit*1000)




        // WILL UNMOUNT
        return () => {
            //releaseAndClose(); 
            unsubscribe(); 
            closeFullscreenNotification();    
            //console.log()
        }
    }, []);







    useEffect(()=> {
        //console.log("force Redraw after item loaded",itemDatas)
        //doAlert( "(+++"+(itemDatas?.id)+"+++)")
    },[itemDatas])

    const cancelNotification = async(id) => {
        console.log("cn todo",id);
        const cn =  await notifee.cancelNotification(id);
        console.log("cn done",id)
    }
    useEffect(()=> {
        console.log("checkVDP oooo ====>")
    },[checkVDP])


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

    const screenWidth = 320;
    const videoRatio = 16/9;
    const backgroundColor = theme['card--color--bodybg'] || theme['color--bg'] || "back"

    const videoLandscapeWrapperStyle = {position:'absolute', width: Dimensions.get('window').width,height: Dimensions.get('window').height,backgroundColor:'transparent'}
    const buttonsBarStyleFullScreen = { backgroundColor:'#00000055',flexDirection:'row', width:'100%',height:75,top:0};
    const buttonsBarStyle = (!isVideoFullscreen) ? {backgroundColor:backgroundColor} : buttonsBarStyleFullScreen;

    return (
        <ThemeContextProvider> 
        <ComponentView>           
            <View style={{ flexDirection: 'row',backgroundColor:"red" }}>
                <View style={{width:'100%',height:screenWidth/videoRatio,backgroundColor:'black',flex:1,position:'relative'}}>
                    {!isRinging && 
                        <Image source={{'uri':notificationImage}} style={{backgroundColor:'red',width:'100%',aspectRatio:16/9}}/>
                    }
                    {isRinging &&
                        <RTCComponent iceStatus={itemDatas?.statusDictionary?.ice} answer={itemDatas?.statusDictionary?.answer} itemId={itemIdRef.current} callback={rtcCallback}
                                noioUrl="https://6cb4-80-11-51-225.ngrok.io" roomId="aaaaa" />
                    }
                </View>
               
            </View>
            <View style={{width:'100%',height:80,backgroundColor:'transparent'}}>
                <View style={buttonsBarStyle}>
                    <View style={{height:(!isVideoFullscreen) ? 90: 75,width:(!isVideoFullscreen) ? '100%': '50%',transform:[{scale:(!isVideoFullscreen) ? 1: 0.75}],backgroundColor:'transparent'}}>
                        <LiveBar enabled={videoPresent} actions={liveBarActions}/>
                    </View>                                
                </View>
            </View>
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
        </ComponentView>
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