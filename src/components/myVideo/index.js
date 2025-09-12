import React from 'react';
import {useState,useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native';
import { VLCPlayer,VlCPlayerView } from 'react-native-vlc-media-player';





export const MyVideo = (props) => {
    console.log("myVide VLC props",props)
    const {source,pressCallback} = props
    const [isPaused, setIsPaused] = useState(false);
    const [fullscreen,setFullscreen] = useState(false)
    console.log(props)
    const playPause = () => {
        setIsPaused(!isPaused);
        if(pressCallback)pressCallback();
    }

    useEffect(() => {
       setMySource(source)
        },[source])


    const onEnded = () => {
        console.log("c'est fini")
        if(props.onEnded)props.onEnded();
    }

    const onPlaying = () => {
        console.log("playing...")
    }

    const onProgress = (progress) => {
        console.log("onProgress",progress)
    }

    const onError = (err) => {
        console.log("error VLC ",err)
    }


    const [mySource,setMySource] = useState();

    const source2 = "https://www.rmp-streaming.com/media/big-buck-bunny-360p.mp4";
    const source3 = "https://demo.athemium.com:4443/files/ef567f93-77be-4c40-a497-9000b508fc8d";
    return (
        <View style= {{width:'100%',height:'100%'}}>
            {/*<Text style={{color:'yellow'}}>{source}</Text>*/}
            <TouchableWithoutFeedback onPress={playPause}>
               
            <VLCPlayer           
                videoAspectRatio="16:9"
                source={{ 'uri': source3}}
                style={{width:'100%',height:'100%'}}
                paused={isPaused}
                onEnded={onEnded}
                onPlaying={onPlaying}
                onProgress={onProgress}
                onError={onError}
                />
             
                {/*
                <VlCPlayerView
                     autoplay={false}
                     url="https://www.radiantmediaplayer.com/media/big-buck-bunny-360p.mp4"
                     Orientation={Orientation}
                     ggUrl=""
                     showGG={true}
                     showTitle={true}
                     title="Big Buck Bunny"
                     showBack={true}
                     onLeftPress={()=>{}}
                />
                */}
            </TouchableWithoutFeedback>
            
        </View>
    )
}