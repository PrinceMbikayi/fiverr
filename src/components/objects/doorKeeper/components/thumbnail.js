import React from 'react';
import {useEffect,useState} from 'react';
import { View,StyleSheet,ImageBackground,Dimensions, Pressable} from 'react-native';

//--------------------------------------------------------------
import {IconButtonRound} from '@components/ui/buttons/iconButtonRound';
import { useTheme } from '_theming/themeProvider';
import icons from '../assets/icons';


//======================================================================
export const ThumbnailButton = (props) => {

    
    const size = props.size || 80;
    const margin = props.margin || 5;
    const bgSource = props.bgSource 
    const callback = props.callback;
    const callbackArgs = props.callbackArgs
    const iconName = props.icon || 'play';
    const iconXml = icons[iconName];
    const type = props.type || 'video';


    const deviceWidth = Dimensions.get('window').width;

   const {theme} = useTheme();

    useEffect(() => {
           
    }, []);


    const _borderColorOn = theme["widget--round--wrapper--color--border"] || "#00FF00";
   

   const doAction = (actionType,param) => {
       console.log("doAction",actionType,param)
        if(callback)callback({action:actionType,archiveDatas:callbackArgs});
   }

   const containerFixedStyle = { flex:1,
    minWidth:size,
    maxWidth:size,
    height:size,
    backgroundColor:'#00000077',
    borderWidth:1,
    borderColor:'transparent',
    margin:margin
}

const percent = '25%';
const containerStyle = { flex:1,
    minWidth:percent,
    maxWidth:percent,
    
    aspectRatio:1,
    backgroundColor:'transparent',
   
    padding:margin
}

const bgStyle = {  
                     flex: 1,
                    resizeMode: "cover",
                    justifyContent: "center",
                    alignItems:'center',
                    borderWidth:1,
                    borderColor:'white',
                }



const ImageButton = (props) => {
    const hasChildren = props.roundButton;
    const downColor ="#CCCCCC";
    const upColor ="transparent";
    const [isDown,setIsDown] = useState(false);
    const onPressIn = () => {setIsDown(true);};
    const onPressOut = () => {setIsDown(false);};
    return (
        <Pressable style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:(isDown)?downColor:upColor}} onPress={()=> {doAction(props.action)}}  onPressIn={onPressIn} onPressOut={onPressOut}>
            <>
            {
                props.roundButton
            }
            </>
        </Pressable>
    )
}
    const action = (type == 'video')? 'play' : 'show'
    return (
        <View style={(deviceWidth < 500) ? containerStyle : containerFixedStyle}>
                        <ImageBackground  onError={(e) => console.log("bgImageError",e.nativeEvent.error) } style={bgStyle} source={bgSource}>
                            <ImageButton callback={doAction} action={action} {...((type == 'video') && { roundButton: <IconButtonRound   iconSize={30} strokeWidth={1}  strokeColor={'white'} iconScale={1.2} iconXml={iconXml} callback={doAction} action="play"/>  })}/> 
                         
                        </ImageBackground>
                    </View>
    )
}
