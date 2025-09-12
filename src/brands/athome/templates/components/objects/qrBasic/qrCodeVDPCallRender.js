/*
    if you are looking for header with settings icons it's in app > _screens/

*/
import React, {useContext,useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,Dimensions,Platform,ScrollView} from 'react-native'; // use in styled components
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

import QrCodeVDPSettingsComponent from './components/settings/settingsComponent';




export const QrCodeVDPCallTemplate= (props) => {
   
    console.log("DoorKeeperCall props",props)
    const {uObject,isRinging,videoPresent,goSettings,startConversation,endConversation,itemId,sentTime,statuses} = props;

    
    const default_snapshot = require('./assets/default-image.png');
    const { t, i18n } = useTranslation();
    const { theme} = useTheme();
    const orientation = useDeviceOrientation();
    const [myOrientation,setMyOrientation] = useState(orientation.portrait ? 'portrait':'landscape'); 
   
    const {isVideoFullscreen,setVideoFullscreen} = useAppGlobal();
   
    const navigation = useNavigation(); 
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    const dispatch = useDispatch();
   
    const {objectDatas,widgetReferenceDatas,name,connected,status,getStatus : getMyStatus,execute,toggle,image,getImage} = uObject;
   // console.log("uObject",uObject)
  
    useEffect(() => {       
        console.log("statuses.refreshSnap à changé",statuses.refreshSnap);
        getImage();
    }, [statuses.refreshSnap]); 



    
   // attention
  //  const [isRinging,setIsRinging] = useState(false);
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

   


  
     useEffect(() => {
      //just for redraw;
     // console.log("just for redraw");
     },[screenWidth])

   

    // actions !!! door or gate ( SRIKE or GATE)
    

    // ====================== ProductDetailsHeaderBar ===============
    const releaseAndClose = () => {        
        decline(itemId);
        navigation.setParams({ring: false });
    }    
    // ------------------ interactions ----------------------------
    
    
    
    const deleteVdpConversationNotification = () => {
        const toDispatch = deleteVdpNotification();       
        dispatch(toDispatch)
    }

    //--------------------------------------------------------------   
    
    const [selectorState, setSelectorState] = useState(null);

    const updateSelectorState = (component) => {
        console.log("component",component)
        setSelectorState(component)
    }

    //=================== RENDER ====================================================
    useEffect(() => {
        //just for redraw;
        console.log("statuses !!!! just for redraw");
       },[statuses])
    


    const backgroundColor = 'green' || theme['card--color--bodybg'] || theme['color--bg'];    
    const videoLandscapeWrapperStyle = {position:'absolute', width: Dimensions.get('window').width,height: Dimensions.get('window').height,backgroundColor:'transparent'}
 
    const realBackgroundColor = "green" || theme['doorKeeperBgColor'] || theme['body'] || "transparent"; 
    const phoneIconSize = 64;
    const videoRatio = 16/9;
    
    
    // important QRCode et VDP Thomson (true for QRCode)
    const  hasLocalVideo = true 

    const upperZoneBgColor = "white";


    return (
        <>
                <View style={{backgroundColor:'transparent'}}>
                <ScrollView alwaysBounceVertical={false}>
                <View style={[{backgroundColor:'transparent'|| realBackgroundColor},(myOrientation == 'portrait' || myOrientation == undefined) ? {flex:1}:{width: Dimensions.get('window').width,height: Dimensions.get('window').height-84}]}>               
                        { (isRinging) && 
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{width:'100%',height:screenHeight || screenWidth/videoRatio,flex:1,position:'relative'}}>
                                {children}
                                <View style={{height:100,width:'100%',position:'absolute',zIndex:7,backgroundColor:'#DDDDDD',bottom:0}}>
                                <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent',height:100,flex:1}}>
                                        <HangUpButton size={phoneIconSize} onPress={endConversation}/> 
                                    </View>
                                </View>                     
                            </View>
                        </View>
                        }
                        {/* flex:1,maxWidth:1024,width:'100%',height:undefined,aspectRatio:16/9,backgroundColor:'black' */}
                        <View style={(myOrientation == 'portrait' || myOrientation == undefined) ? {} : videoLandscapeWrapperStyle}>                        
                            {(!videoPresent && !isRinging) &&
                            <View style={{backgroundColor:"transparent",flex:1}}>
                                <View style={{padding:16,paddingBottom:0,backgroundColor:upperZoneBgColor,width:'100%',position:'relative'}}>
                                    <QrCodeVDPSettingsComponent {...{itemId,updateSelectorState}}/>
                                </View>
                                 <View style={{marginTop:-16,height:64,backgroundColor:upperZoneBgColor,borderBottomLeftRadius:32,borderBottomRightRadius:32}}/>
                                </View>
                               
                            }               
                        </View> 
                        {/* command bar */}
                       
                       
                        </View>
                        </ScrollView>
                       
                        </View>
                        </>
                    
        )
}

//---------- STYLED -------------------------
const FamilyName = styled.Text`
    color:white;
    font-weight:900;
    font-size:24px; 
`;
const Comment = styled.Text`
    color:white;
    font-weight:normal;
    font-size:20px; 
`;

const SettingsButtonStyled = styled(SettingsButton)`
    position:absolute;
    top:50px;
    right:50px;
    background-color:red;
`;

