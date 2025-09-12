import React from 'react';
import {useState,useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native';
//import { VLCPlayer } from 'react-native-vlc-media-player';
import Slider from '@react-native-community/slider';
import AccessButton from '_components/forms/accessButton';


export const VlcVideoPlayer = (props) => {
    const {source} = props
    const [isPaused, setIsPaused] = useState(false);
    const [duration,setDuration] = useState(0)
    const [playPercent,setPlayPercent] = useState(0);
    const [seekPosition,setSeekPosition] = useState(0);

    const vlcplayerRef = useRef(null);


    //console.log(props)
    const playPause = () => {
        setIsPaused(!isPaused);
    }
    const onPlayingHandler = (props) => {
        console.log("playing",props)
        setDuration(props.duration)
    }

    const onProgressHandler = (props) => {
        console.log(props)
        setPlayPercent(props.position)
    }

    const onSliderValueChange = (percent) => {
        console.log("percent",percent)
        // video seek

        const seekPoint = percent;
        console.log("seekPoint",seekPoint)
        //setSeekPosition(seekPoint);
        //setIsPaused(true)
        console.log("vlcplayerRef",vlcplayerRef)
        vlcplayerRef.current.seek(percent)
    }

    const seekMe = (pos) => {
        console.log("seekMe",pos)
        console.log(vlcplayerRef.current);
        // time is in second for ios
        vlcplayerRef.current.seek(10);
    }

    return (
        <View style= {{width:'100%',height:'100%'}}>
            
            <TouchableWithoutFeedback onPress={playPause}>
                {/*<VLCPlayer  
                
                ref = {vlcplayerRef}
                videoAspectRatio="16:9"
                source={{ 'uri': source}}
                style={{width:'100%',height:'100%'}}
                paused={isPaused}
                onPlaying={onPlayingHandler}
                onProgress={onProgressHandler}
               
                />*/}
            </TouchableWithoutFeedback>
            {/*<View style={{marginTop:20}}>
                <Slider
                    style={{width: '100%', height: 10}}
                    minimumValue={0}
                    maximumValue={1}
                    value={playPercent}
                    minimumTrackTintColor="#FF0000"
                    maximumTrackTintColor="#FFFFFF"
                    onValueChange={onSliderValueChange}
                    thumbTintColor="#FF0000"
                />
            </View>
            */}
            <View style={{backgroundColor:'red',padding:20}}>
            <AccessButton  onPress={() => seekMe(0.5)} specialColor='#FFFFFF' title="Seek"/> 
            </View>
            
        </View>
        
    )
}