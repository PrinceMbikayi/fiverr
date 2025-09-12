
import React, {useContext,useEffect,useState,useRef,useCallback} from 'react';
import { View,Image,TouchableOpacity,ActivityIndicator,Button} from 'react-native'; // use in styled components



import { MyVideo } from '_components/myVideo';

const VideoPlayerToMemoize = (props) => {

const {stopVideo,sourceUrl} = props;  


const [shouldMove,setShouldMove] = useState(true)

const stopPlayer = () => {
   if(stopVideo)stopVideo();
}

const source = sourceUrl ||  "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov" 
    return (

        <View style={{width:'100%',height:'100%'}}>
            <View style={{position:'absolute',width:'100%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'transparent'}}>
                <ActivityIndicator size="large" color="#ffffff"/>
            
            </View>
            {/* destination={ shouldMove ? 'targetOfTeleportation' : null } */}
            	
                <MyVideo  source={source} pressCallback={stopPlayer} style={{width:400,height:400}} onEnded={props.onEndend}/>
            

            {/*test overlay
            <View style={{width:200,height:100,backgroundColor:'#FFFF0088',position:'absolute',top:20,left:40}}>
            </View>
            */}
            
    </View>
    )
}

const VideoPlayer = React.memo(VideoPlayerToMemoize)
export default VideoPlayer