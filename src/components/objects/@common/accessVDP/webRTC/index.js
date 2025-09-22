
import KeepAwake from '@sayem314/react-native-keep-awake';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';


import { ImageBackground, View } from 'react-native'; // use in styled components

import store from '_store';
import { isArray as lodashIsArray, isString as lodashIsString } from 'lodash';
import {
    RTCPeerConnection,
    RTCSessionDescription,
    RTCView,
    mediaDevices
} from 'react-native-webrtc';
import { useDispatch } from 'react-redux';

import styled from 'styled-components/native';

import { updateStatus } from '_actions/objects';
import { Api } from '_api';

import { IconButtonRound } from '@components/ui/buttons/iconButtonRound';
// note icons are comonent related
import { AnimatedEstablishWebRtc } from '_assets/lotties/EstablishWebRtc';
import icons from '../assets/icons';








const RTCComponent = React.forwardRef((props,ref) => {


    const {itemId,answer,iceStatus,ringing,callback,ioUrl,roomId,hasLocalVideo = false,isQrCode = false,intervalImage} = props;
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
    const _regularPeerConnectionConfiguration = {"iceServers": [ /*{urls: 'stun:stun.l.google.com:19302'},*/
                                                                /*{'url': "turn:openrelay.metered.ca:80",'username':'openrelayproject','credential':'openrelayproject'}    ,*/
                        {'url': "turn:turn.avidsen.one",'username':'mobile','credential':'iceicebaby_parceque'}                                              
                                                    ]
                                                    ,
                                                    iceTransportPolicy: 'all',
                                                   
                                                    rtcpMuxPolicy: 'negotiate' };
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
       
        // Media initialization state
        const [mediaInitialized, setMediaInitialized] = useState(false);
        const [mediaError, setMediaError] = useState(null);
        const mediaInitializedRef = useRef(false);
        
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
    
          
            console.log("before WebRtc offer send-------------------------------")   
            console.log(JSON.stringify(offer));
            const res = await Api.executeAction(itemId,"ICE",{mArgs:[{name:'value',value:JSON.stringify(offer)}]});
            console.log("WebRtc offer send -------------------------------",offer)  
            
            return true;
            
        }
       
        //--------------------------------------------
        const sendCandidate = async(candidate) => {
           
            // console.log("WebRtc candidate send CSXXXX ------------------",candidate);
            //remettre const candidateSend = Api.executeAction(itemId,"ICE",{mArgs:[{name:'value',value:JSON.stringify(candidate)}]});
            const candidateSend = Api.executeAction(itemId,"ICE",{mArgs:[{name:'value',value:candidate}]});
            return candidateSend;
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

            const ret = (hasLocalVideo)? {audio:_audioConstraint,video:_getVideoConstraint(videoSourceId)} : {audio:_audioConstraint,video:false};
            
            console.log("VVV getDevicesConstraints",ret);
            return ret;
           
        } 

        const initializeMediaEarly = async() => {
            console.log("initializeMediaEarly - Starting media initialization before room join");
            
            try {
                // Check if media is already initialized
                if (mediaInitializedRef.current) {
                    console.log("Media already initialized, skipping");
                    return true;
                }
                
                // Clear any previous errors
                setMediaError(null);
                
                const sourceInfos = await mediaDevices.enumerateDevices();
                let videoSourceId = -1;
                sourceInfos.map((sourceInfo,i)=> {
                    if ( sourceInfo.kind == 'videoinput' &&  sourceInfo.facing == 'front' && videoSourceId == -1){
                        videoSourceId = sourceInfo.deviceId;
                    }
                });
                
                console.log("Requesting media permissions with constraints:", getDevicesConstraints(videoSourceId));
                let stream = await mediaDevices.getUserMedia(getDevicesConstraints(videoSourceId))
                
                if (!stream) {
                    throw new Error('Failed to get media stream');
                }
                
                localStreamRef.current = stream;
                
                const videoStreams = stream.getVideoTracks();
                console.log("Media initialized successfully - videoStreams:", videoStreams);

                if(videoStreams.length > 0) {
                    setLocalVideo(videoStreams[0]);
                    videoStreams[0].enabled = false;
                }
                
                mediaInitializedRef.current = true;
                setMediaInitialized(true);
                setForceRefresh(Date.now());
                
                console.log("Media initialization completed successfully");
                return true;
                
            } catch (error) {
                console.error("Media initialization failed:", error);
                setMediaError(error.message || 'Media initialization failed');
                setMediaInitialized(false);
                mediaInitializedRef.current = false;
                
                if (callback) {
                    callback('mediaInitializationFailed', { error: error.message });
                }
                
                return false;
            }
        }

        const getDeviceMedia = async() => {
            console.log("getDeviceMedia - Using pre-initialized media");
            
            // If media was already initialized, just return success
            if (mediaInitializedRef.current && localStreamRef.current && localStreamRef.current.getTracks) {
                console.log("Using pre-initialized media stream");
                return await mypc.current.addStream(localStreamRef.current);
            }
            
            // Fallback to original implementation if early initialization failed
            console.warn("Media not pre-initialized, falling back to original implementation");
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
            return added;        
        }

        const  updateBandwidthRestriction = (offer, bandwidth) => {
            let modifier = 'AS';
            /*
            if (adapter.browserDetails.browser === 'firefox') {
              bandwidth = (bandwidth >>> 0) * 1000;
              modifier = 'TIAS';
            }
            */

            console.log("updateBandwidthRestriction",offer?.sdp)
            

            if (offer?.sdp.indexOf('b=' + modifier + ':') === -1) {
              // insert b= after c= line.
              offer.sdp = offer.sdp.replace(/c=IN (.*)\r\n/, 'c=IN $1\r\nb=' + modifier + ':' + bandwidth + '\r\n');
            } else {
                offer.sdp = offer.sdp.replace(new RegExp('b=' + modifier + ':.*\r\n'), 'b=' + modifier + ':' + bandwidth + '\r\n');
            }
            return offer;
          }




        const createOffer = async() => {
            const offerOptions = {offerToReceiveAudio: true, offerToReceiveVideo: true }; 
            const doRestart = {iceRestart: true }  
           const offerDescription = await mypc.current.createOffer(offerOptions);
           //ok wifi const sendOfferCall = await sendOffer(offerDescription);
            //console.log("sendOfferCall",sendOfferCall)

            console.log("OOOOFFER",offerDescription)

            //updateBandwidthRestriction
            //const bandWidthRestrictedOffer = updateBandwidthRestriction(offerDescription,5000)
            const bandWidthRestrictedOffer = offerDescription;
            console.log("OOOOFFER2",bandWidthRestrictedOffer)

            mypc.current.setLocalDescription(bandWidthRestrictedOffer).then(async() => {
                // onicecandidate event will be thrown now                        
                // Send pc.localDescription to peer
                const sendOfferCall = await sendOffer(bandWidthRestrictedOffer);
                console.log('&&&&')
                /* 
                setTimeout(async () => {
                    // this one actually gets us the valid ice candidate we can use for a connection
                   const deuze =  await mypc.current.createOffer(offerOptions).then(async(sdp) => {
                        mypc.current.setLocalDescription(sdp);
                        await sendOffer(deuze);
                   });
                  
                  // console.log("AAA---AAA")
                }, 2000);
                */
            });
            
        }

        const initWebRTC = async() => {
            console.log("initWebRTC - Starting with media validation");
            
            try {
                // Validate media is initialized before proceeding
                if (!mediaInitializedRef.current || !localStreamRef.current || !localStreamRef.current.getTracks) {
                    console.warn("Media not properly initialized, attempting to initialize now");
                    const mediaSuccess = await initializeMediaEarly();
                    if (!mediaSuccess) {
                        throw new Error('Media initialization failed, cannot proceed with WebRTC setup');
                    }
                }
                
                console.log("Media validation passed, proceeding with WebRTC setup");
                mypc.current = new RTCPeerConnection(_peerConnectionConfiguration);
                // mypc.current.createDataChannel("Mydata");
                console.log("RTCPeerConnection created successfully");
                
                //PC Listeners (peer connection) -----------------------------    
                mypc.current.onaddstream = (event) => {
                    console.log("WebRtc onaddstream received from Remote", event);                
                    setRemoteStream(event.stream)
                    if(callback) {
                        callback('remoteStreamPresent');
                    }
                }            
        
                // Enhanced listeners with better error handling
                mypc.current.oniceconnectionstatechange = (event) => {
                    console.log("WebRtc oniceconnectionstatechange", event.target.iceConnectionState);
                    if (event.target.iceConnectionState === 'failed') {
                        console.error("ICE connection failed");
                        if (callback) {
                            callback('iceConnectionFailed');
                        }
                    }
                }            
                mypc.current.onicegatheringstatechange = (event) => {
                    console.log("WebRtc onicegatheringstatechange", event.target.iceGatheringState);
                }
                mypc.current.onnegotiationneeded = () => {
                    console.log("WebRtc onnegotiationneeded");
                }
                mypc.current.ontrack = (event) => {
                    console.log("WebRtc ontrack", event);
                }
               
                //-------------------------------------------------------------------
                // Getting Medias (device Camera and mikes)
                // LocalStream managed during getDeviceMedia Process with validation
               
                console.log("Adding pre-initialized media stream to peer connection");
                const agd = await getDeviceMedia().catch((e) => { 
                    console.error("Error in getDeviceMedia:", e);
                    throw new Error(`Failed to setup media: ${e.message}`);
                });
                console.log("Media stream added successfully:", agd);
                
                //-------------------------------------------------------------------
                // manage device candidates
                mypc.current.onicecandidate = async(event) => {
                   // Think it's faster to wait for the null event.candidate
                    // then send a request with all candidates in an array
                    // by now each event.candidate send a request
                    if(event.candidate != null) {
                        //console.log(" candidate generated and sent  --------------------------> onicecandidate =>",event.candidate);          
                    
                        myCandidates.current.push(JSON.stringify(event.candidate))
                        //console.log("------ candidate++",JSON.stringify(event.candidate))
                        const a = await sendCandidate(event.candidate)
                        console.log("------ candidate sent",a)
                    } else {
                        // this is for indicate no all candidates sent
                        console.log("----- last candidate null")
                        const lc = await sendCandidate({"candidate":"","sdpMid":"0","sdpMLineIndex":0,"usernameFragment":"612fd59c"})
                        console.log("------ empty candidate sent",lc)
                        setCandidatesRefresh(Date.now());
                    } 
                };
                
               
                //============ OFFER CREATION ============================================       
                createOffer();
        
                console.log("WebRTC initialization completed successfully");
                
            } catch (error) {
                console.error("WebRTC initialization failed:", error);
                setMediaError(error.message || 'WebRTC initialization failed');
                
                if (callback) {
                    callback('webrtcInitializationFailed', { error: error.message });
                }
                
                throw error;
            }
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
            
            // Early media initialization - happens before any room joining events
            useEffect(() => {       
                const init = async() => {
                    console.log("Component mounted - initializing media and UI");
                    
                    // Initialize media early to avoid delays during room join
                    if (hasLocalVideo || true) { // Always try to initialize media
                        console.log("Starting early media initialization");
                        await initializeMediaEarly();
                    }
                    
                    // Initialize image
                    const img = await getImage(itemId);
                    setImageSource((snap == 'default')? default_image : {uri:snap});
                    
                    console.log("Component initialization completed");
                 }
                 init();
            }, []); 

           
        // -------------------------------
        
        
        useEffect(() => {           
            console.log("iceStatus changed MMM0",iceStatus);
            if(ignoreIceStatusRef){
                if(ignoreIceStatusRef.current == true) {
                    ignoreIceStatusRef.current = false;
                    console.log("iceStatus is ignored, because it's still in object");
    
                    // it means you just have accepted the incoming call
                    // Validate media is ready before initializing WebRTC
                    console.log("Room joined event - validating media before WebRTC setup");
                    
                    if (!mediaInitializedRef.current) {
                        console.warn("Media not initialized for room join, initializing now");
                        initializeMediaEarly().then((success) => {
                            if (success) {
                                console.log("Media initialized successfully, proceeding with WebRTC");
                                initWebRTC().catch((error) => {
                                    console.error("WebRTC initialization failed after media setup:", error);
                                    if (callback) {
                                        callback('webrtcInitializationFailed', { error: error.message });
                                    }
                                });
                            } else {
                                console.error("Media initialization failed, cannot proceed with WebRTC");
                                if (callback) {
                                    callback('mediaInitializationFailedOnJoin');
                                }
                            }
                        });
                    } else {
                        console.log("Media already initialized, proceeding with WebRTC setup");
                        initWebRTC().catch((error) => {
                            console.error("WebRTC initialization failed:", error);
                            if (callback) {
                                callback('webrtcInitializationFailed', { error: error.message });
                            }
                        });
                    }
    
                } else {
                    const type = iceStatus?.type;
                    console.log("iceStatus changed MMM1",iceStatus);
                    console.log("MMM2 type",type);

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
           console.log("------------- answer changed ---------------")     
        const daStatus = answer;    
        if(daStatus && mypc.current) {           
            console.log("pass just one")
            const parsed = lodashIsString(daStatus) ? JSON.parse(daStatus) : daStatus;           
            const answerRtcSessionDescription = new RTCSessionDescription(parsed);            
            mypc.current.setRemoteDescription(answerRtcSessionDescription);
            /* not needed here keep it for confirmation
            myCandidates.current.map((v,i) => {
               // sendCandidate(JSON.parse(v))
            })
            //getDeviceMedia();
            */
            answerReadyRef.current = 1;
            if(remoteCandidatesRef.current.length > 0) {
                remoteCandidatesRef.current.map((v,i) => {  
                    console.log("add after answer")                 
                   mypc.current.addIceCandidate(v);
                   
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
                <BackgroundImageStyled source={intervalImage} resizeMode="cover" style={{width:'100%',height:'100%'}}>
                    <AnimationWrapper size={160} bgColor="transparent">
                                <AnimatedEstablishWebRtc loop={true}/>                           
                    </AnimationWrapper> 
                </BackgroundImageStyled> 
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

const BackgroundImageStyled = styled(ImageBackground)`
   
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
