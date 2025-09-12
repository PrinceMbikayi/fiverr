/*
    if you are looking for header with settings icons it's in app > _screens/

*/
import React, {useContext,useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,Dimensions,Platform} from 'react-native'; // use in styled components
import { useSelector,useDispatch } from 'react-redux';
import { useNavigation,useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { useDeviceOrientation } from '@react-native-community/hooks';
import moment from 'moment/min/moment-with-locales';
import LinearGradient from 'react-native-linear-gradient';

//-----------------------------------------------
import { useTheme } from '_theming/themeProvider';
import { useAppGlobal} from '_helpers/appGlobalProvider';
import {getObjectById,getWidgetReference,getDefaultImage} from '_helpers/selectors';
import { deleteVdpNotification } from '_actions/notificationPush';
//----------------------------------------------
import {HangUpButton,CallButton} from '_components/objects/@common/accessVDP/ui/callButtons';
import RTCComponent from '_components/objects/@common/accessVDP/webRTC';
import {decline} from '_components/objects/@common/accessVDP/utils/interactions';

import {useQrObject} from '_hooks/object/qrObject'

import { SettingsButton } from './components/settingsButton';
import {QrCodeVDPImage} from './components/ui/image';

//import {QrCodeVDPCallTemplate} from './qrCodeVDPCallRender';
import {QrCodeVDPCallTemplate} from '_brand/templates/components/objects/qrBasic/qrCodeVDPCallRender.js';

export const QrCodeVDPCall= (props) => {
   
    console.log("DoorKeeperCall props",props) 
    
   
    const orientation = useDeviceOrientation();
    const [myOrientation,setMyOrientation] = useState(orientation.portrait ? 'portrait':'landscape'); 
   
    const {isVideoFullscreen,setVideoFullscreen} = useAppGlobal();
   
    const navigation = useNavigation(); 
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    const dispatch = useDispatch();
   
    const {itemId,sentTime} = navigationParams;
    const uObject = useQrObject(itemId);
    //const uObject = useObject(itemId);
    const {objectDatas,widgetReferenceDatas,statuses,name,connected,status,getStatus : getMyStatus,execute,toggle,image,getImage} = uObject;
   // console.log("uObject",uObject)
    const itemDatas =  widgetReferenceDatas;
   

    useEffect(() => {       
        console.log("statuses.refreshSnap à changé",statuses.refreshSnap);
        getImage();
    }, [statuses.refreshSnap]); 


    /*
    const statuses = itemDatas?.statusDictionary;
    const {connected} = itemDatas;    
    */
   
    const [openActions,setOpenActions] = useState([])
    const [videoPresent,setVideoPresent] = useState(navigationParams?.params?.autoplay || false);    
    const [modalVisible,setModalVisible] = useState(false);    

    const rtcRef = useRef(null);


   // attention
    const [isRinging,setIsRinging] = useState(false);
    const [incomingCall,setIncomingCall] = useState(false)
    const [screenWidth,setScreenWidth] = useState(10);
    const [screenHeight,setScreenHeight] = useState(10)
    const [rung,setRung] = useState(false);
    const [lastRing,setLastRing] = useState('');   


    React.useEffect(() => {
        const unsubscribe = navigation.addListener('transitionStart', (e) => {
           console.log("transition start !!!")
        });      
        return unsubscribe;
      }, [navigation]);

   


    useEffect(()=> {
       
        setIsRinging(navigationParams?.ring || false);
        /*
        if(navigationParams.ring) {
            setIsRinging(true)
        } else {
            setIsRinging(false)
            
        }
        */
    },[navigationParams])
    
    useEffect(() => {
    
       const isRealyLandscape = (orientation.portrait === false);
        setModalVisible(isRealyLandscape);       
        setMyOrientation(orientation.portrait ? 'portrait':'landscape');
        setVideoFullscreen(!orientation.portrait);        
        setScreenWidth(Dimensions.get('screen').width);
    },[orientation.portrait])

    useEffect(() => {
        const myWidth = Dimensions.get('screen').width;      
        setScreenWidth(myWidth);
        setScreenHeight(Dimensions.get('window').height-84-24);      
     },[])

  
     useEffect(() => {
      //just for redraw;
     // console.log("just for redraw");
     },[screenWidth])

   

       // actions !!! door or gate ( SRIKE or GATE)
    const actionsRef = useRef([]);
    useEffect(() => {      
        if(itemDatas.actions) {

       
        const toOpen = itemDatas.actions.reduce((r,v,i) => {
                    if(v.name == "STRIKE" || v.name == "GATE")r.push(v.name)
                    return r
        },[])           
        actionsRef.current = toOpen
        setOpenActions(toOpen)
    }  
    }, [itemDatas.actions]);

    // ====================== ProductDetailsHeaderBar ===============
    const releaseAndClose = () => {        
        decline(itemId);
        navigation.setParams({ring: false });
    }    
    // ------------------ interactions ----------------------------
    
    const endConversation = async () => {
        console.log("End of the Conversation");
        if(rtcRef)rtcRef.current.hangUp();
        setIsRinging(false);
        setVideoPresent(false);
        setIncomingCall(false);
        deleteVdpConversationNotification();
        if(props?.showHeader)props.showHeader(true)
         releaseAndClose();
    }
    const startConversation = async () => {       
        setIsRinging(true);
        setVideoPresent(true);
        setIncomingCall(false);
        deleteVdpConversationNotification();
        if(props?.showHeader)props.showHeader(true)
        //await releaseAndClose();
    }
    
    const deleteVdpConversationNotification = () => {
        const toDispatch = deleteVdpNotification();       
        dispatch(toDispatch)
    }

    //--------------------------------------------------------------   
    

    const maxNotifAge = 30 // in seconds
    useEffect(()=> {
       // console.log("QrCodeVDPCall =>navigationParams",navigationParams);

        if(navigationParams.ring && navigationParams.origin == undefined) {
            setIsRinging(true)
        } else {
            setIsRinging(false);
            if(navigationParams.ring) {

                const yet = new moment();
                const rangAt = new moment(sentTime)
                const notifAge = moment.duration(yet.diff(rangAt)).as('seconds');
                //console.log("notifAge",notifAge)
                setLastRing(rangAt.format("HH:mm:ss")+"\n"+rangAt.format("dddd DD MMMM "))
                if(notifAge < maxNotifAge) {
                    if(navigationParams.callAccepted) {
                        startConversation();
                    } else {
                        setIncomingCall(true)
                    }
                    if(props?.showHeader)props.showHeader(false)
                } else {
                    //setLastRing(moment(sentTime))
                    if(Platform.OS == "android")setRung(true)
                }              
            }            
        }
    },[navigationParams.ring])

    // =================== WEBRTC END ================================================

    // see RTCComponent Component

    const rtcCallback = (actionName,actionArgs) => {
        console.log("actionName",actionName,"actionArgs");
        switch(actionName) {
            case 'remoteStreamPresent' :
                setVideoPresent(1)
                break;
        }
    }
    // =================== WEBRTC END ================================================
   

    //=================== RENDER ====================================================
    useEffect(() => {
        //just for redraw;
        console.log("statuses !!!! just for redraw");
       },[statuses])
    

    
    
    // important QRCode et VDP Thomson (true for QRCode)
    const  hasLocalVideo = true

    const goSettings = () => {       
        const params = { itemId: itemId};
        console.log("goSettings ",params)
        navigation.navigate("QrCodeVDPSettings",params);
    }

    return (
            <View style={{backgroundColor:'transparent',height:'100%'}}>

            
                <QrCodeVDPCallTemplate {...{uObject,isRinging,videoPresent,goSettings,startConversation,endConversation,itemId,sentTime,statuses,screenWidth,screenHeight}}>
                    <RTCComponent iceStatus={itemDatas.statusDictionary.ice} answer={itemDatas.statusDictionary.answer} itemId={itemId} callback={rtcCallback}
                                                    isQrCode roomId="aaaaa" ref={rtcRef} hasLocalVideo={hasLocalVideo} intervalImage={image} />   
                </QrCodeVDPCallTemplate>
            </View>
        
    )


}

