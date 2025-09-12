import React from 'react';
import { Text, View, Image,Dimensions, TouchableHighlight } from 'react-native';
import {useState} from 'react';

import { useTheme } from '_theming/themeProvider';
import Svg, {Circle} from 'react-native-svg';


  const areEqual = (prevProps, nextProps) => {  
    const noReRender = (prevProps.callback === nextProps.callback);
    return noReRender;
    // no render -> return true;
}


export const LightPleasureItem = React.memo(props => {

    const {theme} = useTheme();
    const { callback,index,color = "red",label = "",
            iconSizePercent = "40%",insideBoxPercent = "70%",borderWidth = 5
        
        } = props;
    
    const innerCircle = 24 - borderWidth;
    const bgColor = theme['card--color--icon--wrapper--background'] || "white";
    const iconSource = require("_images/light/ambiance.png");
    
    const [innerCircleColor,setInnerCircleColor] = useState( bgColor)
   //---------------------------------
    const doCallback = () => {
        (callback || Function)(index)
    }   
    const doFeedBack = () => {
        setInnerCircleColor("#DDD");
        setTimeout(() => {
            console.log("fade")
            setInnerCircleColor(bgColor);
          }, 0);
    }

    return (
        
        <>
            <View style={{height:insideBoxPercent,width:insideBoxPercent,justifyContent: 'center', alignItems:'center'}}>
                <TouchableHighlight  activeOpacity={0.2} underlayColor="#EEEEEE"  style={{width:'100%',height:'100%',borderRadius: Dimensions.get('window').width / 2}} onPress={() => {doFeedBack();doCallback();}}>  
                    <View style={{width:'100%',height:'100%',alignSelf:'center', flex:1,alignItems:'center',justifyContent:'center'}}>                      
                        <View style={{width:'100%',height:'100%',alignContent:'center', alignItems: 'center', aspectRatio: 1}}>
                            <Svg  style={{alignSelf:'center',position:'absolute'}} preserveAspectRatio="xMinYMin slice" height="100%" width="100%" viewBox = "0 0 48 48">
                                <Circle cx="24" cy="24" r="24" fill={color} />     
                            </Svg>
                            <Svg preserveAspectRatio="xMinYMin meet" height="100%" width="100%" viewBox = "0 0 48 48">
                                <Circle cx="24" cy="24" r={innerCircle} fill={innerCircleColor} />     
                            </Svg>                           
                        </View>
                        <Image source={iconSource} style={[{alignSelf:'center',tintColor:theme['divider_on_body'],width:iconSizePercent,height:iconSizePercent,position:'absolute'}]} fadeDuration={0} resizeMode="contain" />                       
                    </View>
                </TouchableHighlight>                
            </View> 
            { (label != '') ? <Text style={[styles.caption,{color:theme['divider_on_body']}]}>{label.toUpperCase()}</Text> : <></> }
        </>    
    )

},areEqual)



const styles = {
    caption : {
       
        fontSize:12,
        marginTop:3,
        marginBottom:5
    }
}

