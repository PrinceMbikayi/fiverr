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
import {startWs} from '_api/Api';
import {Api} from '_api';
import {addObjectAction} from '_actions/asyncActions';
import {  deleteVdpNotification } from '_actions/notificationPush';

//--------------


import { ThemeContextProvider } from '_theming/themeProvider';
import {fullscreen_push_android_started} from '_actions/notificationPush';
import {getObjectById} from '_helpers/selectors';


import {FullscreenNotification as VdpFullScreen} from '_components/objects/doorKeeper/pushNotifications/fullscreenNotification';
import {FullscreenNotification as QrCodeFullScreen} from '_components/objects/qrBasic/pushNotifications/fullscreenNotification';


export const FullscreenNotification = () => {

    console.log("@common FullscreenNotification begin")
    const theme = {}
    const phoneIconSize = 64;
    /*
    const idDev = 739063;
    const itemId = idDev;

    */
    
    const {connected} = true; 
    const [callerId, setCallerId] = useState(null);
    const [checkVDP,setCheckVDP] = useState();
    const [itemDatas,setItemDatas] = useState()
   
    const [fullscreenType, setFullscreenType] = useState(null);
      

    const appStateRef = useRef(AppState.currentState);
    const backHandlerRef = useRef();
    const itemIdRef = useRef(null);  

    const activityStarter = NativeModules.ActivityStarter;

    


    function tellStoreAddObject(objectId) {
        console.log("@common/pushNotification / fullscreen => tellStoreAddObject",objectId)
       if(objectId != undefined) addObjectAction(objectId,store.dispatch)
    }

    const checkFullScreen = store.getState().notificationPush?.forFullScreen;  
    console.log("@common ---> check continiously",checkFullScreen)

    

    const onStoreChanged = () => {
        console.log("onStoreChanged",itemIdRef.current)
        setCheckVDP(store.getState()?.objects?.entities?.objects);
        const myDatas = store.getState()?.objects?.entities?.objects?.[itemIdRef.current];
        console.log("myDatas",myDatas);
        if(itemIdRef.current && myDatas) {
           
           
            const typeName = (myDatas.typeName == "AtHomeVDP" && myDatas.name.indexOf("QR")!=-1) ? "VDoorBell" : myDatas.typeName;   
            console.log("@common typeName",typeName)      
            setItemDatas(myDatas);
            setFullscreenType(typeName);
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
        //endConversation();
    }

    const checkAppIsreadyActive = (vdpId) => {
        if(vdpId != undefined) {
            const isActive = getObjectById(store.getState(),vdpId);
            console.log('isActive',isActive);
            onStoreChanged();
        }      
        
    }



    // ========== effects ====================
    
        //Did Mount
      useEffect(() => {

        console.log("FullScreen Component Did mount !!!")
        const unsubscribe = store.subscribe(onStoreChanged);
        backHandlerRef.current = BackHandler.addEventListener('hardwareBackPress', _handleBackPress);
        AppState.addEventListener('change', _handleAppStateChange);
        const checkFullScreen = store.getState().notificationPush?.forFullScreen;
       
       //console.log("AZER",checkFullScreen)
        let vdpId;
        if(checkFullScreen?.android?.actions) {
            // App is closed
           // vdpId = ""+checkFullScreen?.android?.actions?.[1]?.pressAction?.object;
            vdpId = ""+checkFullScreen?.android?.actions?.[1]?.pressAction?.objectId;
        }
        if(checkFullScreen?.origin == "background") {
            //vdpId = checkFullScreen?.notification?.data?.object;
            vdpId = checkFullScreen?.notification?.data?.objectId;
        }
         
        //doAlert("vdpId("+vdpId+")");
        //doAlert("après checkFullScreen");
        console.log("vdpId",vdpId);  
        
        
        //vdpId = "700783" 


        itemIdRef.current = vdpId;

        // if app in in background it'll launch immediate render
        checkAppIsreadyActive(vdpId)

        //getInitialNotification();
        startWs();
        tellStoreAddObject(vdpId);

         /* remettre
        if(checkFullScreen) {
            
            const toDispatch = deleteVdpNotification();
             // Remove the notification
            
            console.log("toDispatch",toDispatch)
            store.dispatch(toDispatch)
            if(checkFullScreen?.id && checkFullScreen?.id !="") {
                cancelNotification(checkFullScreen?.id);
            }
        }
        */
        // WILL UNMOUNT
        return () => {
            //releaseAndClose(); 
            unsubscribe(); 
            //closeFullscreenNotification();    
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



   
    return (
        <ThemeContextProvider> 
        <ComponentView>           
            {fullscreenType == "VDoorBell" &&
                <QrCodeFullScreen objectId={ itemIdRef.current}/>
            }
             {fullscreenType == "AtHomeVDP" &&
                <VdpFullScreen  objectId={ itemIdRef.current}/>
            }

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