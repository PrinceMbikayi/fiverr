/*
    if you are looking for header with settings icons it's in app > _screens/

*/


import React, {useContext,useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,TouchableOpacity,ActivityIndicator,Button,Dimensions,Modal,Platform} from 'react-native'; // use in styled components
import { useSelector,useDispatch } from 'react-redux';
import { useNavigation,useRoute } from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-root-toast';
import {debounce as lodashDebounce} from 'lodash';
import styled from 'styled-components/native';
import { useDeviceOrientation } from '@react-native-community/hooks';
import moment from 'moment/min/moment-with-locales';



//-----------------------------------------------
import { useTheme } from '_theming/themeProvider';
import { useAppGlobal} from '_helpers/appGlobalProvider';
import {getObjectById,getWidgetReference} from '_helpers/selectors';

import {getLastEvents} from './utils';
import {Api} from '_api';
import {getObjectFiles} from '_api/objects';

import {HangUpButton,CallButton} from './components/ui/callButtons';
import {IconButtonRound} from '@components/ui/buttons/iconButtonRound';
import {WidgetIconRoundWrapper} from '@components/ui/buttons/widgetIconRoundWrapper';
import PureIconRender from '_components/pureIconRender';
import AccessButton from '_components/forms/accessButton';
import icons from './assets/icons';

//import RTCComponent from './components/webRTC';
import RTCComponent from '_components/objects/@common/accessVDP/webRTC';
import {LiveBar} from '_components/objects/@common/accessVDP/liveBar';
import {CustomUnlock} from '_components/objects/@common/accessVDP/customUnlock';
import {ArchivesGrid} from './components/archivesGrid';

import {  deleteVdpNotification } from '_actions/notificationPush';
import {createFakeCaptures,formatFilesCollection} from './utils/formatVdpFiles';
import {RECORD_ACTION_SNAPSHOT,RECORD_ACTION_START_RECORDING,RECORD_ACTION_END_RECORDING} from '_components/objects/@common/accessVDP/utils/interactions';
import {doRecordAction,openGate,openDoor,decline} from '_components/objects/@common/accessVDP/utils/interactions';;




export const DoorKeeperCall= (props) => {
   
    //console.log("DoorKeeperCall props",props)
   
    console.log()
    const snapshot = require('./assets/defaultImage.jpg');
    const { t, i18n } = useTranslation();
    const { theme} = useTheme();
    const orientation = useDeviceOrientation();
    const [myOrientation,setMyOrientation] = useState(orientation.portrait ? 'portrait':'landscape'); 
   
    const {isVideoFullscreen,setVideoFullscreen} = useAppGlobal();
   
   const navigation = useNavigation(); //v5
   const route = useRoute();
   const navigationParams = route?.params || {}; 
   
    const {itemId,sentTime} = navigationParams;
    /*
    const itemId = navigationParams.itemId;
    const sentTime = navigationParams.sentTime;
    */
    const [isRinging,setIsRinging] = useState(false);
    const [incomingCall,setIncomingCall] = useState(false)
    const [screenWidth,setScreenWidth] = useState(10)
    const [rung,setRung] = useState(false);
    const [lastRing,setLastRing] = useState('')

    useEffect(()=> {
       
        setIsRinging(navigationParams.ring || false);
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
     },[])

  
     useEffect(() => {
      //just for redraw;
      //console.log("just for redraw");
     },[screenWidth])


     

    const itemDatas =  useSelector(state => getObjectById(state,itemId));
    const {connected} = itemDatas;    
    const [captures,setCaptures] = useState([])
   
    const [openActions,setOpenActions] = useState([])
    const [videoPresent,setVideoPresent] = useState(navigationParams?.params?.autoplay || false);    
    const [modalVisible,setModalVisible] = useState(false);    

    const canMove = useRef(true);
    const isDev = false;
    const dispatch = useDispatch();

    useEffect(() => {
       
        const getFiles = async(id) => {           
            const response = await getObjectFiles(id);           
            const formatted = formatFilesCollection(response.res);          
            setCaptures(formatted);
            return res
        }
        if(itemDatas.captures == undefined && isDev == true) {
            const dummies = createFakeCaptures();         
            const lastEvents = getLastEvents(dummies,6);          
            setCaptures(lastEvents)
        } else {
            // à voir quand on aura les vraies infos
            const resp = getFiles(itemId);           
        }        
        //console.log("orientation.portrait et autre ",orientation.portrait,orientation.landscape);
       }, []);


       // actions !!! door or gate ( SRIKE or GATE)
       const actionsRef = useRef([]);
       useEffect(() => {        
            const toOpen = itemDatas.actions.reduce((r,v,i) => {
                        if(v.name == "STRIKE" || v.name == "GATE")r.push(v.name)
                        return r
            },[])           
            actionsRef.current = toOpen
            setOpenActions(toOpen)
       }, [itemDatas.actions]);

       // ====================== ProductDetailsHeaderBar ===============
       const settingsOpen = () => { 
            setVideoPresent(false)
            const params = { itemId: itemId,'title':itemDatas.name,'actions':actionsRef.current};
            navigation.navigate('VdpSettings',params);            
       }

       useEffect(() => {
        if(props.setSettings) {
            props.setSettings(settingsOpen)
        }  
       }, []);       

    const waitMoveAgain  = useRef(lodashDebounce(function () {       
        canMove.current = true;
        }, 1000)).current;  


    const goArchives = () => {
        if(canMove.current) {
            canMove.current = false;
            waitMoveAgain();
            setVideoPresent(false);            
            const params = { 'myUserId': 10,'itemId':itemId}
            navigation.navigate('VdpArchiveHome',params)
        }        
    }    
   

    const releaseAndClose = () => {
       
        console.log("releaseAndClose 2.2",mypc?.current);
        decline(itemId);
        
        //setIsRinging(false);
        navigation.setParams({ring: false });
    }    
    // ------------------ interactions ----------------------------

    const takeSnapshot = () => {
        Toast.show("Snapshot",{position: Toast.positions.TOP});
        doRecordAction(itemId,RECORD_ACTION_SNAPSHOT)
    }

    const recordVideo = (isRecording) => {
        const msg = (isRecording == true) ? 'start recording' : 'end recording';       
        Toast.show(msg,{position: Toast.positions.TOP});
        const actionArg = (isRecording) ? RECORD_ACTION_START_RECORDING : RECORD_ACTION_END_RECORDING;
        doRecordAction(itemId,actionArg)
    }
    const talking = (isTalking) => {
        const msg = (isTalking == true) ? 'talking' : 'no more talking';
        Toast.show(msg,{position: Toast.positions.TOP});
    }

    
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
    const playVideo = () => {        
        setIsRinging(true);
    }

    //=================== RENDER ====================================================
    const liveBarActions = {'shoot':takeSnapshot, 'talk':talking,'record':recordVideo};
    const archivesGridTitleStyle = {'color':theme['onBody'] || 'red'};    
    const backgroundColor = theme['card--color--bodybg'] || theme['color--bg'];
    const displayNoneStyle = {height:0,width:0,opacity:0}
    const videoLandscapeWrapperStyle = {position:'absolute', width: Dimensions.get('window').width,height: Dimensions.get('window').height,backgroundColor:'transparent'}
    const buttonsBarStyleFullScreen = { backgroundColor:'#00000055',flexDirection:'row', width:'100%',height:75,top:0};
    const buttonsBarStyle = (!isVideoFullscreen) ? {backgroundColor:backgroundColor} : buttonsBarStyleFullScreen;


    const realBackgroundColor = theme['doorKeeperBgColor'] || theme['body'] || "transparent"; 
    const phoneIconSize = 64;
    const videoRatio = 16/9;
    const RTCwrapperHeight = 200; //screenWidth/videoRatio

    const closeRung = () => {
        setRung(false)
    }
    // in order to use room test server add ioUrl property to RTCComponent
    // no ioUrl property mean regular behaviour using an avidsen one server
    const rtcRef = useRef(null);
    // important QRCode et VDP Thomson (true for QRCode)
    const  hasLocalVideo = false;

    return (
                
                    <View style={[{backgroundColor:realBackgroundColor},(myOrientation == 'portrait' || myOrientation == undefined) ? {flex:1}:{width: Dimensions.get('window').width,height: Dimensions.get('window').height}]}>               
                        { (isRinging) && 
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{width:'100%',height:screenWidth/videoRatio,backgroundColor:'black',flex:1,position:'relative'}}>
                                <RTCComponent iceStatus={itemDatas.statusDictionary.ice} answer={itemDatas.statusDictionary.answer} itemId={itemId} callback={rtcCallback}
                                            noioUrl="https://6cb4-80-11-51-225.ngrok.io" roomId="aaaaa" ref={rtcRef} hasLocalVideo={hasLocalVideo} />
                                
                            </View>
                        </View>
                        }
                        {/* flex:1,maxWidth:1024,width:'100%',height:undefined,aspectRatio:16/9,backgroundColor:'black' */}
                        <View style={(myOrientation == 'portrait' || myOrientation == undefined) ? {} : videoLandscapeWrapperStyle}>                        
                            {(!videoPresent && !isRinging) &&
                                <View>
                                    <Image source={snapshot} style={{height: undefined, width: '100%',aspectRatio:16/9}}  blurRadius={1}/>
                                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                                        <IconButtonRound  iconSize={80}    strokeWidth={2} strokeColor="white" iconXml={icons['big-eye']} callback={playVideo}/>
                                    </View> 
                                </View>
                            }               
                        </View>                         
                        {/* command bar */}
                        {
                            (myOrientation != 'NoMore_portrait') &&
                    
                        <View style={buttonsBarStyle}>
                            <View style={{height:(!isVideoFullscreen) ? 90: 75,width:(!isVideoFullscreen) ? '100%': '50%',transform:[{scale:(!isVideoFullscreen) ? 1: 0.75}],backgroundColor:'transparent'}}>
                                <LiveBar enabled={videoPresent} actions={liveBarActions}/>
                            </View>
                            <View style={{flex:1,flexDirection:'row',height:(!isVideoFullscreen) ? 90: 75,justifyContent:'center',alignItems:'center',transform:[{scale:(!isVideoFullscreen) ? 1: 0.8}],paddingBottom:(!isVideoFullscreen) ? 10 : 0}} >
                                { openActions.indexOf("GATE") != -1 &&
                                <View style={{width:'50%',height:60,backgroundColor:'transparent',paddingLeft:10,paddingRight:10}}>
                                    <CustomUnlock  iconThumb="gate" iconRight="padlock" callback = {openGate} itemId={itemId} enabled={connected}/>
                                </View>
                                }
                                { openActions.indexOf("STRIKE") != -1 &&
                                <View style={{width:'50%',height:60,backgroundColor:'transparent',paddingLeft:10,paddingRight:10}}>
                                    <CustomUnlock  iconThumb="door" iconRight="padlock" callback ={openDoor} itemId={itemId} enabled={connected} />
                                </View>
                                }
                            </View>
                            {( connected == false) &&
                                    <DisconnectedViewOverlay pointerEvents="none" bgColor={theme['card--color--deactivated-overlay'] || "#00000044"} />
                            }
                        </View>                        
                        }  
                        
                        {!isRinging &&
                            <View style={(myOrientation == 'portrait') ? {padding:10} : displayNoneStyle}>
                                <ArchivesGrid title={t('doorkeeper:EVENTS')} titleStyle={archivesGridTitleStyle} items={captures} titleCallback={goArchives}/>
                            </View>
                        }
                        
                        { isRinging && 
                            <View style={{backgroundColor:'transparent',position:'relative'}}>
                                <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:30}}>
                                    <HangUpButton size={phoneIconSize} onPress={endConversation}/>                                   
                                </View>                               
                            </View>
                        }
                        { incomingCall && 
                            <IncomingView zIndex={2}>
                                <View style={{flex:2,position:'relative',flexDirection:'column'}}> 
                                    {navigationParams?.image &&
                                    <View style={{flex:1}}>
                                        <Image source={{'uri':navigationParams?.image}} style={{backgroundColor:'red',width:'100%',aspectRatio:16/9}}/>
                                    </View>
                                    }                                   
                                    <View style={{flex:1,backgroundColor:'transparent',height:phoneIconSize}}>
                                        <WidgetIconRoundWrapper iconSize={64} checkOn="on" borderColorOn="white" backgroundColor="black">
                                            <PureIconRender size={86} img="bell.svg" appIcon fill="white"/> 
                                        </WidgetIconRoundWrapper>
                                    </View>
                                </View>                                
                               <InComingCallButtonsView>
                                   <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent',height:100,flex:1}}>
                                        <HangUpButton size={phoneIconSize} onPress={endConversation}/> 
                                    </View>
                                    <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent',height:100,flex:1}}>
                                        <CallButton onPress={startConversation} backgroundColor={theme["widget--round--wrapper--color--border"] || "#00FF00"} size={phoneIconSize} />
                                    </View>
                                </InComingCallButtonsView>
                               
                            </IncomingView>                        
                        }
                        { rung && 
                            <IncomingView zIndex={2}>
                                <View style={{backgroundColor:'transparent',alignItems:'center',justifyContent:'center',height:'100%'}}>
                                    <Text style={{color:'white',textAlign:'center'}}>{t("doorkeeper:LAST_RING",{'time':lastRing})}</Text>
                                    <AccessButton  onPress={closeRung} specialColor={"white"}  title={t("OK").toUpperCase()}/>
                                </View>
                            </IncomingView>                        
                        }
                        <View style={{height:200,width:'100%',backgroundColor:'transparent',flex:1}}></View>
                        </View>
                    
        )
}

const DisconnectedViewOverlay = styled.View`
                position:absolute;
                width:100%;
                height:100%;         
                background-color:${props => props.bgColor || "#FF0000CC" };
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
