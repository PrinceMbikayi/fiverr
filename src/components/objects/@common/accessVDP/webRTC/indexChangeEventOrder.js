import KeepAwake from '@sayem314/react-native-keep-awake';

import React, {useContext,useEffect,useState,useRef,useCallback,useImperativeHandle} from 'react';
import { View} from 'react-native'; // use in styled components

import { useSelector,useDispatch } from 'react-redux';
import store from '_store';
import {isArray as lodashIsArray,isString as lodashIsString} from 'lodash'
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
  } from 'react-native-webrtc';

import styled from 'styled-components/native';

import {Api} from '_api';
import { updateStatus } from '_actions/objects';

import {IconButtonRound} from '@components/ui/buttons/iconButtonRound';
import icons from '../assets/icons';
import {AnimatedEstablishWebRtc} from '_assets/lotties/EstablishWebRtc';


const RTCComponent = React.forwardRef((props,ref) => {
    const {itemId,answer,iceStatus,ringing,callback,ioUrl,roomId,hasLocalVideo = false,isQrCode = false} = props;

    const [localVideo,setLocalVideo] = useState(null);
    const [showLocalVideo,setShowLocalVideo] = useState(false);
    const localVideoPosition = isQrCode ? {top:5,left:5}: {left:5,bottom:5}

    useImperativeHandle(ref, () => ({

        getAlert() {
          console.log("getAlert from Child called by parent");
        },
        toggleLocalStream(val) {
          
            console.log("toggleLocalStream",localVideo);
            const toEnabled = val ||  !localVideo._enabled
            localVideo.enabled = toEnabled;
            console.log("toggleLocalStream2",localVideo);
            setShowLocalVideo(localVideo.enabled)         
        },
        hangUp (){
            console.log("hangUp !!! from rtc component")
            ignoreIceStatusRef.current = true
        }
      }));




      const toggleLocalVideo = (val) => {
        console.log("toggleLocalStream",localVideo);
        const toEnabled = val ||  !localVideo._enabled
        localVideo.enabled = toEnabled;
        console.log("toggleLocalStream2",localVideo);
        setShowLocalVideo(localVideo.enabled)         
      }

    //--------- config vars-----------
   
    // {'url': "turn:turn.avidsen.one",'username':'mobile','credential':'iceicebaby_parceque'}     
    // {'url': "turn:openrelay.metered.ca:80",'username':'openrelayproject','credential':'openrelayproject'}    
    const _regularPeerConnectionConfiguration = {"iceServers": [
                                                    {'url': "turn:turn.avidsen.one",'username':'mobile','credential':'iceicebaby_parceque'}                                               
                                                    ]
                                                };
    /*
    const _regularPeerConnectionConfiguration = {"iceServers": [
        {'url': "turn:turn.avidsen.one",'username':'mobile','credential':'iceicebaby_parceque'}                                               
        ],
        iceTransportPolicy: 'all'
    };
    */
    
   
    const _peerConnectionConfiguration  =  _regularPeerConnectionConfiguration
    // -------
    const ignoreIceStatusRef = useRef(true)
    // ------- props  and hooks utils --------------
    //console.log("------------------>>>",ignoreIceStatusRef.current)

    const videoFeedBack = true;

    const dispatch = store?.dispatch || useDispatch();

     
    

        //-------- states and refs --------
       
        const mypc = useRef(null)
        const myCandidates = useRef([]);
        const localStreamRef = useRef({toURL: () => null});        
        const [candidatesRefresh,setCandidatesRefresh] = useState(null);
        const [remoteStreamURL,setRemoteStreamURL] = useState(null);
        const [remoteStream,setRemoteStream] = useState(null);
        const [forceRefresh,setForceRefresh] = useState(null);
       
        
        const answerReadyRef = useRef(false)
        const remoteCandidatesRef = useRef([]);



        //-------- methods -----------
        const releaseAndClose = async() => {
            console.log("releaseAndClose from RTCComponent",mypc)
            if(mypc?.current) {
                if(localStreamRef.current.getTracks != undefined) {
                    localStreamRef.current?.getTracks()?.forEach(t => {
                        
                        t.stop()
                    });
                   
                    localStreamRef.current?.release();
                        localStreamRef.current = {toURL: () => null}
                }
                mypc.current.removeStream(localStreamRef.current);
                mypc.current.removeStream(remoteStream);
                
                await mypc.current.close();
                mypc.current = null; 
                myCandidates.current = [];
                
                answerReadyRef.current = false;
                remoteCandidatesRef.current = [];


                const closeArgs = {mArgs:[{name:'value',value:JSON.stringify({"vdp_command":"hangup"})}]};
                const res = Api.executeAction(itemId,"ICE",closeArgs); 
                clearStatuses();      
                //return true;
            }
        }
        //----------------------------------------------
        const sendOffer = async(offer) => {
    
          
            //console.log("before WebRtc offer send")   
            const res = await Api.executeAction(itemId,"ICE",{mArgs:[{name:'value',value:JSON.stringify(offer)}]});
            //console.log("WebRtc offer send",offer)  
            
            return true;
            
        }
       
        //--------------------------------------------
        const sendCandidate = async(candidate) => {
           
            console.log("WebRtc candidate send CSXXXX ------------------",candidate);
            const candidateSend = Api.executeAction(itemId,"ICE",{mArgs:[{name:'value',value:JSON.stringify(candidate)}]});
           
            //console.log("candidateSend",candidateSend)
        }

        
        //----------------------------------------
       
        //clear ice and answer
        const clearStatuses = () => {
            dispatch(updateStatus(itemId,"ice",false));
            dispatch(updateStatus(itemId,"answer",false));
        
        }

        
        //====================================================
        const _isFront = true

        const _audioConstraint = true;
        const _getVideoConstraint = (videoSourceId) => {
            
            //return false;


            return {
                mandatory: {
                    minWidth: 500, // Provide your own width, height and frame rate here
                    minHeight: 300,
                    minFrameRate: 30,
                },
                facingMode: _isFront ? 'user' : 'environment',
                optional: (videoSourceId && videoSourceId!=-1) ? [{sourceId: videoSourceId}] : [],
                } 
        }
        const getDevicesConstraints = (videoSourceId) => {
            if(hasLocalVideo) {
                return {audio:_audioConstraint,video:_getVideoConstraint(videoSourceId)}
            } else {
                return {audio:_audioConstraint,video:false}
            }
            
           
        } 

        const getDeviceMedia = async() => {
            //console.log("getDeviceMedia");
            const sourceInfos = await mediaDevices.enumerateDevices();
            let videoSourceId = -1;
            sourceInfos.map((sourceInfo,i)=> {
                if ( sourceInfo.kind == 'videoinput' &&  sourceInfo.facing == 'front' && videoSourceId == -1){
                    videoSourceId = sourceInfo.deviceId;
                }
            });
            
            let stream = await mediaDevices.getUserMedia(getDevicesConstraints(videoSourceId))
            localStreamRef.current = stream;            
            const added = await mypc.current.addStream(stream);

            const videoStreams = stream.getVideoTracks();
            console.log("videoStreams",videoStreams);

            if(videoStreams.length > 0) {
                setLocalVideo(videoStreams[0]);
                videoStreams[0].enabled = false;
            }
            console.log("videoStream2",videoStreams)
            setForceRefresh(Date.now());
            //setIsRinging(true)
            return added;        
        }

        const createOffer = async() => {
            const offerOptions = {offerToReceiveAudio: true, offerToReceiveVideo: true };    
            const offerDescription = await mypc.current.createOffer(offerOptions);
           //ok wifi const sendOfferCall = await sendOffer(offerDescription);
            //console.log("sendOfferCall",sendOfferCall)
            mypc.current.setLocalDescription(offerDescription).then(async() => {
                // onicecandidate event will be thrown now                        
                // Send pc.localDescription to peer
                const sendOfferCall = await sendOffer(offerDescription);
                console.log('&&&&')
            });
        }

        const initWebRTC = async() => {

            console.log("initWebRTCt")
            mypc.current = new RTCPeerConnection(_peerConnectionConfiguration);
           // mypc.current.createDataChannel("Mydata");
           console.log("pass 2")
            //PC Listeners (peer connection) -----------------------------    
            mypc.current.onaddstream = (event) => {
                //console.log("WebRtc onaddstream recieved from Remote",event)                
                //setRemoteStreamURL(event.stream.toURL())
                setRemoteStream(event.stream)
                //setVideoPresent(true)
                if(callback) {
                    callback('remoteStreamPresent');
                }
            }            
    
            // Listeners here for debug purposes
            
            mypc.current.oniceconnectionstatechange = (event) => {
                console.log("WebRtc oniceconnectionstatechange",event)
            }            
            mypc.current.onicegatheringstatechange = (event) => {
                console.log("WebRtc onicegatheringstatechange",event)
            }
            mypc.current.onnegotiationneeded = (event) => {
                console.log("WebRtc onnegotiationneeded",event)
            }
            mypc.current.ontrack = (event) => {
                console.log("WebRtc ontrack",event)
            }
           
            //-------------------------------------------------------------------
            // Getting Medias (device Camera and mikes)
            // LocalStream managed during getDeviceMedia Process
           
            const agd = await getDeviceMedia().catch((e) => { console.log("err getDevice",e)});
           //console.log("agd",agd)
            //-------------------------------------------------------------------
            // manage device candidates
            mypc.current.onicecandidate = function (event) {
               // Think it's faster to wait for the null event.candidate
                // then send a request with all candidates in an array
                // by now each event.candidate send a request
                if(event.candidate != null) {
                    //console.log(" candidate generated and send  --------------------------> onicecandidate =>",event.candidate);          
                
                    myCandidates.current.push(JSON.stringify(event.candidate))
                    console.log("------ candidate++",JSON.stringify(event.candidate))
                    //sendCandidate(event.candidate)
                } else {
                    // this is for indicate no all candidates sent
                    sendCandidate({"candidate":"","sdpMid":"0","sdpMLineIndex":0,"usernameFragment":"612fd59c"})
                    setCandidatesRefresh(Date.now());
                } 
            };
            
           

            //============ OFFER CREATION ============================================       
            createOffer();
    
            //console.log("/initWebRTC")
        }
        // ========== effects ====================

            // !! important this will close the webRTC 
            // so no need to close elsewhere just remove the component

            useEffect(() => {
                
                // WILL UNMOUNT
                return () => {
                    releaseAndClose();      
                    
                }
            }, []);
        // -------------------------------
        
        
        useEffect(() => {           
            console.log("iceStatus changed MMM0",iceStatus);
            if(ignoreIceStatusRef){
                if(ignoreIceStatusRef.current == true) {
                    ignoreIceStatusRef.current = false;
                    console.log("iceStatus is ignored, because it's still in object");
    
                    // it means you just have accepted the incoming call
                    // so init RTC
                    initWebRTC();
    
                } else {
                    const type = iceStatus?.type;
                    console.log("iceStatus changed MMM1",iceStatus);
                    console.log("MMM2 type indexChangeEventOrder.js",type);

                    if(type != undefined) {
                        switch(type) {
                            case 'offer' : {
                                // ignore this type
                            }
                            break;
                            case 'answer' : {
                                // ignore this type too 
                                //console.log("An answer !!!!!")
                            }
                            break;
                            
                            default : {
                                
                            }            
                        }
                    }   else {
                        const parsed2 = lodashIsString(iceStatus) ? JSON.parse(iceStatus) : iceStatus; 
                        console.log("MMM3",parsed2)                                  
                        if(parsed2 && lodashIsArray(parsed2)) {
                            parsed2.map((v,i) => { 
                                if(v?.candidate) {
                                    console.log("Candidate XX2",v);
                                    if(answerReadyRef.current == 1) {
                                        mypc.current.addIceCandidate(v);
                                    } else {
                                        if(remoteCandidatesRef.current.indexOf(v) == -1) {
                                            remoteCandidatesRef.current.push(v);
                                        }
                                    } 
                                }                                            
                            })
                        }
                    }                  
                }
            } 
       },[iceStatus])
    
       
       useEffect(() => {        
        const daStatus = answer;    
        if(daStatus && mypc.current) {           
           
            const parsed = lodashIsString(daStatus) ? JSON.parse(daStatus) : daStatus;           
            const answerRtcSessionDescription = new RTCSessionDescription(parsed);            
            mypc.current.setRemoteDescription(answerRtcSessionDescription);
            myCandidates.current.map((v,i) => {
                sendCandidate(JSON.parse(v))
            })
            answerReadyRef.current = 1;
            if(remoteCandidatesRef.current.length > 0) {
                remoteCandidatesRef.current.map((v,i) => {                   
                   //mypc.current.addIceCandidate(v);
                   
                   })
               
            }
        }
    },[answer])
        // ------------- render -------------
       
        return (
            <>
             <KeepAwake />
             <RemoteView streamURL={remoteStream?.toURL()} zOrder={1} objectFit="cover"/> 
             {(remoteStream == null)&& <Interval>
                <AnimationWrapper size={160} bgColor="transparent">
                            <AnimatedEstablishWebRtc loop={true}/>                           
                </AnimationWrapper>  
                </Interval>  
            }
             {showLocalVideo && 
                 <LocalView streamURL={localStreamRef.current?.toURL()} zOrder={2} objectFit="cover" mirror={true} isQrCode={isQrCode}/>
             }
             {hasLocalVideo &&
             <View style={{position:'absolute',width:30,height:30,...localVideoPosition,backgroundColor:'transparent',zIndex:4}} zOrder={4}>
                 <IconButtonRound  iconSize={30} strokeWidth={0}  strokeColor={"white"} forceBackgroundColor="#6B116B" iconXml={(showLocalVideo)? icons.showLocalVideo : icons.hideLocalVideo} callback={toggleLocalVideo} action="showLocal" onDown={false}/>    
             </View>
            }
            </>
        )
    }
)

export default RTCComponent;

// exemple styled custom component
export const RemoteView = styled(RTCView)`
  position: absolute;
  flex: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
 
  z-index: 1;
  background: #96d1ec;
`;

export const Interval = styled(View)`
  position: absolute;
  flex: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; 
  z-index: 3;
  background: #00000099;
  align-items:center;
  justify-content:center;
`;

export const LocalView = styled(RTCView)`
  width: 90px;
  height: 160px;
  position: absolute;
  bottom: 15px;
  right: 15px;
  z-index: 2;
  background: #34d4f0;
  ${({isQrCode}) => isQrCode  && `
        bottom: 120px;
    `}
  /* align-self: flex-end; */
  /* margin-top: auto; */
`;

const AnimationWrapper = styled.View`
      background-color:${props => props.bgColor || "white"};
      border-radius:${props => props.size/2}px;
      height:${props => props.size}px;
      width:${props => props.size}px;
      align-items:center;
      justify-content:center;
`;
