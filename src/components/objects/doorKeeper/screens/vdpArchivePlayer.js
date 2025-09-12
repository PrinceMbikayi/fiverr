import React from 'react';
import { View,ScrollView,Text,SafeAreaView,TouchableHighlight,Alert,Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import {useContext,useState,useRef,useEffect} from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { findIndex as lodashFindIndex } from 'lodash';




import ReactNativeBlobUtil from 'react-native-blob-util';
//import CameraRoll from '@react-native-community/cameraroll';


import { useDeviceOrientation } from '@react-native-community/hooks';
import Orientation  from "react-native-orientation-locker";

import styled from 'styled-components/native';
//----------------------------------------------------

import {HeaderWithBack} from '_components/headers/header-with-back';
import { useTheme } from '_theming/themeProvider';


import {getRatioHeight,getVideoSize} from '../utils'
import {IconButtonRound} from '@components/ui/buttons/iconButtonRound';
import icons from '../assets/icons';
import PureIconRender from '_components/pureIconRender';
import {getTitleDate} from '../utils';


import VideoPlayer from '../components/videoPlayer'; // regular
//import VideoPlayer from '../components/vp'; // VLC
import SnapshotViewer from '../components/snapshotViewer';
import {PLAYER_STATES} from '../components/videoPlayercontrols';
import { ArchiveBar } from '../components/archiveBar';


//=====================================================================
export const VdpArchivePlayerScreen= (props) => {

  
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
   
   
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {archiveDatas = [],previousRouteName,captures} = navigationParams;



    const orientation = useDeviceOrientation();


    //const archiveDatas = navigation.state.params.archiveDatas

    //const title= t('doorkeeper:EVENTS')
    const title = ""; 
    
    //const captures = navigation.state.params.captures; v4
        
    const [currentArchive,setCurrentArchive] = useState(archiveDatas);
    const [currentArchiveIndex,setCurrentArchiveIndex] = useState(null);
    const [playerState,setPlayerState] = useState(null);
    const [isFullscreen,setIsFullscreen] = useState(false);
    const [videoFullscreen,setVideoFullscreen] = useState(false);
    const [myOrientation,setMyOrientation] = useState(orientation.portrait ? 'portrait':'landscape');
    const [videoPlayerSize,setVideoPlayerSize] = useState(getVideoSize());

    const videoPlayerRef = useRef(null);
 

    React.useEffect(() => {
    const requestPermissionAsync = async () => {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
  
          // ...
        } catch (err) {
          console.error(err);
        }
  
        // ...
      };
  
      requestPermissionAsync();
    }, []);


    useEffect(() => {
        //console.log("orientation portrait changed",orientation.portrait)
        const aDatas = archiveDatas;        
        setCurrentArchiveIndex(findCurrentArchiveIndex({date:aDatas?.date}));
        //setCurrentArchive(aDatas);
        // unmount
        return () => {
            
            Orientation.unlockAllOrientations();
          };        
       }, []);

    useEffect(() => {    

        const isRealyLandscape = (orientation.portrait === false)
         
         setMyOrientation(orientation.portrait ? 'portrait':'landscape')
         setVideoFullscreen(!orientation.portrait);
         setIsFullscreen(isRealyLandscape);
         const newPlayerSize = getVideoSize(16/9,isRealyLandscape);       
         setVideoPlayerSize(newPlayerSize)
         
         
     },[orientation.portrait])



    const goBack = () => {
       
        console.log("goBack !!!!!",previousRouteName)       
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
        //navigation.navigate(navigation?.state?.params?.previousRouteName)
        
      }
    
      const goFullscreen = () => {
          console.log('goFullscreen !!');
          setIsFullscreen(!isFullscreen);
          if(!isFullscreen == false) {
              Orientation.unlockAllOrientations();
          } else {
              console.log("passe en landscape stp")
            //Orientation.unlockAllOrientations();
            Orientation.lockToLandscape();
            //Orientation.lockToLandscapeLeft()
          }
      }

      const download = () => {
   
        console.log("download action currentArchive",currentArchive);
        showAlert("download",currentArchive.type+"\n"+currentArchive.thumb)
        /* courier 
        if(currentArchive.type == "image") {
            const fileName = (""+currentArchive.thumb).split("/").pop()+".jpg";
            console.log("fileName",fileName)
            const request0 = {
                filename: fileName,
                method: 'GET',
                mimeType: 'image/jpeg',
                url: currentArchive.thumb,
              };

            console.log("request0",request0)

        }
        */
        console.log("tada",ReactNativeBlobUtil.fs.dirs)

        let dirs = ReactNativeBlobUtil.fs.dirs;


        console.log("dirs",dirs);


        const fileName = (currentArchive.filename);
        
        const videoTestFileUrl = "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4";
        const imageTestFileUrl = "https://books.google.com/books/content?id=4TcttAEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api";
        
        const testType = (currentArchive.type == 'video') ? 'video' : 'photo';
        
        const fileTest = (testType == 'video') ? videoTestFileUrl :imageTestFileUrl
        const extension = (testType == 'video') ? ".mp4" : ".jpg";

        const albumName = "AtHome VDP"

        const toDownload = currentArchive.thumb;

        ReactNativeBlobUtil
                        .config({
                        // response data will be saved to this path if it has access right.
                        path : dirs.DownloadDir + '/'+fileName+extension
                        })
                        .fetch('GET', toDownload, {
                        //some headers ..
                        })
                        .then((res) => {
                        // the path should be dirs.DocumentDir + 'path-to-file.anything';
                        console.log("res",res);
                        console.log('The file saved to ', res.path())
                        //const tag = "file:///"+res.path();
                        const tag = ((Platform.OS == "android" ) ? "file:///" : '')+res.path();
                        console.log("tag",tag)
                        const type = 'auto';
                        const album = albumName;
                        if(Platform.OS == "android") {
                           // CameraRoll.save(tag, { type, album }).then((cRes) => { console.log(cRes)}).catch((errC) => console.log("errC",errC))

                        }
                        if(Platform.OS == "ios") {
                            //console.log('CameraRoll ??',currentArchive.thumb,fileTest,type,album)
                            //CameraRoll.save(toDownload,{ type, album })
                        }
                        

                        }).catch((err) => {
                            console.log("ReactNativeBlobUtil err",err)
                        })
                        

        /*
        ReactNativeBlobUtil
            .config({
                addAndroidDownloads : {
                    useDownloadManager : true, // <-- this is the only thing required
                    // Optional, override notification setting (default to true)
                    notification : true,
                    // Optional, but recommended since android DownloadManager will fail when
                    // the url does not contains a file extension, by default the mime type will be text/plain
                    mime : 'image/jpeg',
                    description : 'File downloaded by download manager.'
                }
            })
            .fetch('GET', "https://books.google.com/books/content?id=4TcttAEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api")
            .then((resp) => {
            // the path of downloaded file
            console.log('à la fin',resp.path());
            },
            (err) => console.log("err",err)
            )
            */
            /*
            RNFetchBlob
                .config({
                // response data will be saved to this path if it has access right.
                path : dirs2.DownloadDir + '/easy.jpg'
                })
                .fetch('GET', "https://books.google.com/books/content?id=4TcttAEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api", {
                //some headers ..
                })
                .then((res) => {
                // the path should be dirs.DocumentDir + 'path-to-file.anything'
                console.log('The file saved to ', res.path())
                })
            */







            console.log("tada 2")    

      }
      const deleteArchive = () => {
        console.log("delete archive",currentArchive);
        showAlert("detete",currentArchive.type+"\n"+currentArchive.thumb)
        
      }

      const showAlert = (title,body) => {
        Alert.alert(
          title,
          body,
          [                  
            { text: 'OK', onPress: () => console.log('OK download Pressed') }
          ],
          { cancelable: true }
        );
     
      }


    // ======= Header Buttons ==============
      
    // Header Buttons it's a JSX node
    const ScreenHeaderButtons = () => {
        const iconSize = 32;
       
        return (
            <>
             <HeaderButton callback={goFullscreen} img={(!isFullscreen) ? "video-fullscreen" : "video-fullscreen-off"} />
            <HeaderButton callback={download} img="archive-download" />
            <HeaderButton callback={deleteArchive} img="trash"/>
            </>

        )

        
    }

    

   const HeaderButton = (props) => {
        const iconSize = props.iconSize || 32;
        const fillColor = textColor || "white";
        const {img,callback} = props;
        return (
            <View style={{marginLeft:10}}>
                <IconButtonRound  iconSize={iconSize} strokeWidth={0} strokeColor={fillColor} iconXml={icons[img]}  callback={callback} action="talk" /> 
            </View>    
        )
    }

    // Attention à la version wizard sans props goBack
    const getHeader = () => {
        if(isFullscreen) return  (
            <FullscreenHeader>
                <ScreenHeaderButtons/>
            </FullscreenHeader>
            
        )
        return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                         <HeaderWithBack title={title} goBack={{action:goBack}} themeDependency screenHeaderButtons={<ScreenHeaderButtons/>}/>
                     </View>
        
     }
     // =======================================


    const doAction = (action) => {
        console.log('action',action);
    }

    const play = () => {
        console.log("play play play")
    }

    

    const titleDate = (dateKey) => {

        let currentLang = i18n.language;
        if(currentLang == "en")currentLang+="-gb";  
        const titleDate = getTitleDate(dateKey,currentLang,'hh:mm:ss');
        if(titleDate == 'TODAY' || titleDate == 'YESTERDAY') {
            return t('doorkeeper:'+titleDate)
        }
        return titleDate
    }

    const bodyTextColor = theme['onBody'] || 'red';
    const backgroundColor = theme["details_body_color"] || theme["card--color--bodybg"] || theme['color--bg'];
    const titleStyle = {'color':bodyTextColor || 'red'};


    const findCurrentArchiveIndex = (searchObj ) => {
        const findIn = captures || [];
        const findThat = searchObj ||  {date:currentArchive.date}      
        const currentIndex = lodashFindIndex(findIn,findThat);       
        return currentIndex;
    }

    const onArchiveNavigate = (way) => {
       
        const newIndex = currentArchiveIndex+way;
        if(newIndex < 0 ||newIndex > captures.length-1) return false;
        setCurrentArchive(captures[newIndex])
        setCurrentArchiveIndex(newIndex);
    }


    // Manage player state change 
    useEffect(() => {
        console.log("so refresh playerState",playerState)
       }, [playerState]);

    const onVideoEnd = () => {
        console.log("!!!!!!!!!!!!!!  videoEnd");        
    }
    const onReplay = () => {
        videoPlayerRef.current.replay()
    }
    const onPlay = () => {
        videoPlayerRef.current.play()
    }
    const onPause = () => {
        videoPlayerRef.current.pause()
    }
    const onPlayerStateChange = (val) => {
        console.log("onPlayerStateChange",val)
        setPlayerState(val)
    }

    const onArchiveBar = (action) => {
        console.log("player action =>",action)
        switch(action) {
            case 'replay':
                onReplay();
                break;
            case 'play' :
                onPlay();
                break;
            case 'pause' :
                onPause();
                break;
        }
    }

    //const testMe = "https://demo.athemium.com:4443/files/d3b82dfc-c060-4a50-9781-d1041576a78f";
    //const testMe = "https://ak.picdn.net/shutterstock/videos/1010801189/preview/stock-footage-countdown-leader-graphic-with-film-burn-and-rolling-effect.mp4"
    //const testMe = "https://www.athemium.com/stock-footage-countdown-leader-graphic-with-film-burn-and-rolling-effect"

    return (
        <SafeAreaView style={{flex:1,backgroundColor:backgroundColor}}> 
            <>
            {
                getHeader()
            }
            </>
           
            <ScrollView style={{marginBottom:0,backgroundColor:'#FF000000'}} scrollEnabled={!isFullscreen}>
                <>
                    {(currentArchive.thumb && !currentArchive.vurl) &&
                        <>
                        <View style={{flex:1,width:videoPlayerSize.width,height:videoPlayerSize.height, backgroundColor:'orange'}}>
                         <SnapshotViewer    archiveNavigate={onArchiveNavigate}  currentArchive={currentArchive} currentIndex={currentArchiveIndex} collectionLength={captures.length}
                                            specialColor="white" fullscreen={isFullscreen}/>
                        </View>
                        {!isFullscreen &&
                            <Text style={{textAlign:'center',paddingTop:4,color:bodyTextColor}}>{titleDate(currentArchive?.date)}</Text>
                        }  
                        </>                        
                    }
                    {(currentArchive.thumb && currentArchive.vurl) &&
                        <>                      
                        <View style={{flex:1,width:videoPlayerSize.width,height:videoPlayerSize.height, backgroundColor:'orange'}}>
                            {/* Regular video player comment while VLC tests*/
                            <VideoPlayer ref={videoPlayerRef}  onPlayerStateChange={onPlayerStateChange} sourceUrl={currentArchive.vurl} onEnded={onVideoEnd}/>
                            }
                            {/*<VideoPlayer ref={videoPlayerRef}   sourceUrl={currentArchive.vurl}/>
                            */}                            
                            {isFullscreen &&                               
                                   <PauseButtonOnPlay activeOpacity={0.3} underlayColor="#DDDDDD00" onPress={onPause} disabled={(playerState == PLAYER_STATES.PAUSED)}>                       
                                         <>
                                         {/*<Text style={{color:'white'}}>({playerState})({PLAYER_STATES.PAUSED})</Text>*/}
                                         {(playerState == PLAYER_STATES.PAUSED || playerState == PLAYER_STATES.ENDED ) &&
                                            <FullscreenArchiveBarWrapper>
                                                 <ArchiveBar playerAction={onArchiveBar} isVideoArchive={currentArchive.vurl} 
                                                    archiveNavigate={onArchiveNavigate} enabled={true} playerState={playerState} 
                                                    currentIndex={currentArchiveIndex} collectionLength={captures.length}
                                                    specialColor="white"
                                            /> 
                                            </FullscreenArchiveBarWrapper>    
                                        }                                       
                                        </>
                                     </PauseButtonOnPlay>
                            }                            
                        </View>
                        {!isFullscreen &&
                            <Text style={{textAlign:'center',paddingTop:4,color:bodyTextColor}}>{titleDate(currentArchive?.date)}</Text>
                        }                                                
                        </>
                    }
                    {!isFullscreen && 
                    <>
                        <View style={{marginTop:20}}>
                            <ArchiveBar playerAction={onArchiveBar} isVideoArchive={currentArchive.vurl} archiveNavigate={onArchiveNavigate} enabled={true} playerState={playerState} currentIndex={currentArchiveIndex} collectionLength={captures.length}/>         
                        </View>
                    </>
                    }
                </>
            </ScrollView>    
        </SafeAreaView>
    )
   }
// Style && Theming 
const FullscreenHeader = styled.View`
                
                position:absolute;
                top:0;
                min-height:84px;
                height:100px;
                background-color:transparent;
                height:84px;
                width:100%;
                flex-direction:row;
                align-items:center;
                justify-content:flex-end;
                z-index:3;
                padding-right:20px;
                
`; 
const  FullscreenArchiveBarWrapper= styled.View`
                
                position:absolute;
                top:0px;
                left:0px;
                bottom:0px;
                right:0px;
                background-color:#000000AA;
                align-items:center;
                justify-content:center;
                z-index:3; 
`; 
const PauseButtonOnPlay = styled(TouchableHighlight)`
               position:absolute;
               top:0;
               left:0;
               bottom:0;
               right:0;
               background-color:#FF000000;
`;