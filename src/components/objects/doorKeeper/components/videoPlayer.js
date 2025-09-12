import React from 'react';
import {useEffect,useState,useRef,useImperativeHandle} from 'react';
import { View,Text,Platform } from 'react-native';

import Video from 'react-native-video';
//--------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import {PLAYER_STATES} from './videoPlayercontrols';
import { ReplayWithOverlay } from '../components/videoPlayercontrols/ReplayWithOverlay';


const VideoPlayer = React.forwardRef((props,ref) => {

    const {currentIndex,collectionLength,fullscreen,disabled,sourceUrl,onEnded} = props;

    const {theme} = useTheme();
    const [showPrevious,setShowPrevious] = useState(true)
    const [showNext,setShowNext] = useState(true);    
    const [endReached,setEndReached] = useState(false)

    const playerRef = useRef(null);


    // REF methods can be called (useImperativeHandle)    
    useImperativeHandle(ref, () => ({

        replay() {           
          onReplay();          
        },
        popupTitle(val) {
            setTitle(val)
        },
        toggle() {           
            setModalVisible(!modalVisible);
        },
        play() {
            onPaused(PLAYER_STATES.PLAYING)
        },
        pause() {
            onPaused(PLAYER_STATES.PAUSED)
        }
    }));

    useEffect(() => {
       console.log("RRRRRRRRRRR",sourceUrl)
 }, [sourceUrl]);




    useEffect(() => {
           setShowPrevious((currentIndex > 0))
           setShowNext((currentIndex < collectionLength-1))
    }, [currentIndex,collectionLength]);


    useEffect(() => {
       console.log("do A refresh on paused");

    }, [paused]);

    useEffect(() => {
        console.log("new rate",rate);

    }, [rate]);


    const bodyTextColor = theme.onBody || 'red';
    const backgroundColor = theme['card--color--bodybg'] || theme['color--bg'];


    const onBuffer = () => {
        console.log("onBuffer")
    }

    const onVideoError = (e) => {
        console.log("error",e)
    }

    const onMyEnd = () => {
        console.log("myEnd");
        setPaused(true);
        playerRef.current.seek(1);
        if(onEnded) onEnded();
    }

    const [duration, setDuration] = useState(0);
    const [paused, setPaused] = useState(false);
    const [rate, setRate] = useState(1.0000001);

    const [currentTime, setCurrentTime] = useState(0);

    const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
    useEffect(() => {
        console.log("useEffect non mais des fois",playerState)
        if(props.onPlayerStateChange) {
            props.onPlayerStateChange(playerState)
        }
    
    }, [playerState]);
    const [isLoading, setIsLoading] = useState(true);

    const onSeek = (seek) => {
        playerRef?.current.seek(seek);
    };

    const onSeeking = (currentVideoTime) => setCurrentTime(currentVideoTime);

    const onPaused = (newState) => {
        console.log('tapped paused ?',newState)
        setPaused(!paused);
        setPlayerState(newState);
    };

    
    

    const onReplay = () => {
        console.log("replay tapped");
        setRate(1.0)
        playerRef?.current.seek(0);
        setCurrentTime(0);
        
        if (Platform.OS === 'android') {
            setPlayerState(PLAYER_STATES.PLAYING);
            setPaused(false);
           
        } else {
            setPlayerState(PLAYER_STATES.PLAYING);
            setPaused(false);
        }
        setEndReached(false)
    };

    const onProgress = (data) => {
        if (!isLoading) {
            setCurrentTime(data.currentTime);
        }
    };

    const onLoad = (data) => {
        setDuration(Math.round(data.duration));
        setIsLoading(false);
    };

    const onLoadStart = () => setIsLoading(true);

    const onEnd = () => {
       
        setPaused(true);
        setEndReached(true);
        setPlayerState(PLAYER_STATES.ENDED);
        console.log("fini")
        setCurrentTime(duration);
    };


    useEffect(() => {
       console.log("fullscreen changed",fullscreen)
 }, [fullscreen]);



    return (
        <View style={{flex:1,width:'100%',height:'100%',backgroundColor:'black',alignItems:'center'}} {...(disabled && { pointerEvents: 'none' })}> 
           <View style={{flex:1,width:'100%',height:'100%',backgorundColor:'blue'}}> 
                <Video
                    onEnd={onEnd}
                    onLoad={onLoad}
                    onLoadStart={onLoadStart}
                    posterResizeMode={'contain'}
                    onProgress={onProgress}
                    paused={paused}
                    ref={(ref) => (playerRef.current = ref)}
                    resizeMode={'contain'}
                    source={{uri: sourceUrl}}
                    style={{position:'absolute',top:0,left:0,bottom:0,right:0}}
                    controls={false}
                    rate={rate}
                    fullscreen={fullscreen}
                />
                 
                {(endReached && 1 == 2)&& 
                    <ReplayWithOverlay callback={onReplay}/>
                }
            </View>
        </View>   
    );
})

export default VideoPlayer
