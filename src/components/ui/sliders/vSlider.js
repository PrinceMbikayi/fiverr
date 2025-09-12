import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { View,Platform,Text} from 'react-native';
import { useTheme } from '_theming/themeProvider';
import styled from 'styled-components/native';
import Slider from "react-native-smooth-slider";
import Icon from 'react-native-vector-icons/Entypo';
import Svg, {
  Circle,
  Ellipse,
  G,   
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';

export const VSlider = (props) => {
   
    const {theme} = useTheme();
    // - reverse --
    const reversed = props.reversed;
    
   
    const {iconTop,iconBottom,sliderHeight,gradientTrack,itemId} = props;

    let slideHeight = props.height || 150;
    const slideWidth = props.width || 20;
    const minTintColor = (props.gradientTrack) ? "transparent" : props.tintColor || '#000000';
    const maxTintColor = (props.gradientTrack) ? "transparent" : props.maxTintColor || '#BBBBBB'
    const cursorTintColor =  props.cursorTintColor || '#BBBBBB';
    const minValue = props.min ||  0;
    const maxValue = props.max ||  100;
    //const value = correctValue((props.value !== undefined) ? parseInt(props.value) : 50);
    const trackHeight = slideHeight
    const trackWidth = 10;
    const iconSize  = props.iconSize || 24;


    const sliderValueAdapt = (val) => {
    
      //console.log("sliderValueAdapt maxValue",maxValue,val)
      if(maxValue == undefined || val == undefined)return 10;
      //return 10
      return (Math.round((reversed)? (Number(maxValue) - val) : val));
    }

   
    const initVal = (props.value !== undefined && !isNaN(props.value) && props.value != "NaN") ? parseInt(props.value) : 50;   
    //console.log("initVal",props.value,initVal)
    const [slideValue,setSlideValue] = useState(Number(sliderValueAdapt(initVal)));
    const [testTime,setTestTime] = useState(0);

    useEffect(() => {
        const newVal = sliderValueAdapt(Number(props.value))
       if (props.value !== undefined && !isNaN(props.value) && props.value != "NaN" && (newVal != slideValue)) {
          setSlideValue(newVal);
       }
       
        
     }, [props.value]);

     useEffect(()=> {
        //console.log(props.shutterName+" "+"testTime changed",testTime)
     }, [testTime]);

  if(props.iconSize != undefined) {
    slideHeight-=1.5*props.iconSize;
  }


    //console.log("(Platform.OS",Platform.OS)

    let rotatedStyle  = (Platform.OS === 'ios') ?   { width:slideHeight,height:slideWidth ,
                                                      transform: [  { rotate: '-90deg'},
                                                                    {translateX:-(slideHeight/2 - slideWidth /2)},
                                                                    {translateY:-(slideHeight/2 - slideWidth/2)}
                                                                  ]
                                                    } 
                                                                  
                                                    : 
                                                                  
                                                    { width:slideHeight,height:slideWidth,
                                                      marginLeft:-((slideHeight-slideWidth) /2),
                                                      marginTop:(slideHeight-slideWidth) /2,
                                                      
                                                    } ; 
    if(iconTop) {
      if(Platform.OS === 'ios') {
        rotatedStyle.marginTop = 10;
        rotatedStyle.marginBottom = -10;
      } else {
        rotatedStyle.marginTop = (iconSize-4)*3;
        rotatedStyle.marginBottom = (iconSize-8) / 2
      }
      
    }
    
    const isVertical = (Platform.OS === 'ios') ? false : true;

   



    const IconTopRender = () => {        
        if(iconTop) {
          return (<Icon name={iconTop} size={iconSize} style={{alignSelf:'center',minWidth:iconSize+4,marginLeft:4}}/>)
        }
        return (<></> )
    }
    const IconBottomRender = () => {  

     

      if(iconBottom) {
        const addMarginBottom = (Platform.OS === 'ios') ? {bottom:-100-iconSize/2} : {bottom:-2*props.iconSize}
        return (<Icon name={iconBottom} size={iconSize} style={[addMarginBottom,{alignSelf:'center',minWidth:iconSize+4,marginLeft:4}]}/>)
      }
      return (<></>)

        return ( iconBottom || <></> )
    }

    
    const ShowGradientTrack = () => {
      if(gradientTrack == undefined) return <></>

      return (
          <View style={{position:'absolute',width:trackWidth,alignSelf: 'center',}}>
                      <Svg height={trackHeight} width={trackWidth}>
                          <Defs>
                              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                  <Stop offset="0" stopColor="#FFFFB7" stopOpacity="1" />
                                  <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="1" />
                                  <Stop offset="1" stopColor="#90CDE0" stopOpacity="1" />
                              </LinearGradient>
                              </Defs>  
                          <Line x1={trackWidth/2} y1="10" x2={trackWidth/2} y2={trackHeight-(trackWidth/2)} stroke="url(#grad)" strokeWidth={trackWidth} strokeLinecap="round" />
                      </Svg>     
                  </View>
      )
  }


    let sliderTimeoutId = null
                                                                  
    const sendBack = (val) => {
      //const value = correctValue(val)
      //console.log("Value",value);
      //props.callback(Math.round(value))
      //when reversed slideRange = [-100,0] so we need to add if reversed
      const value = sliderValueAdapt(val);
     // console.log("value",value);
      props.callback(value)
     // props.callback(value)
     /*
      clearTimeout(sliderTimeoutId)
        sliderTimeoutId = setTimeout(() => {
          props.callback(Math.round(value))
        }, 50)
      */
    }


    const onComplete = (val) => {

      const value = sliderValueAdapt(val)    
      //console.log("onSlidingComplete ",val,"adapt",value) 
      props.onSlidingComplete(value)
    }

    const onStart = (val) => {
      const value = sliderValueAdapt(val)    
      //console.log("onStart ",val,"adapt",value) 
      props.onSlidingComplete(value)
    }

    return (
          <View style={{width:slideWidth,height:slideHeight}}>           
                <IconTopRender style={styles.icon}/>
                <ShowGradientTrack/>
                <View >
                  <Slider
                      minimumValue= {minValue}
                      maximumValue={maxValue}
                      value={slideValue}
                      minimumTrackTintColor={minTintColor}
                      maximumTrackTintColor={maxTintColor}
                      thumbTintColor={cursorTintColor}
                      vertical={isVertical}
                      style={[rotatedStyle,]}
                      thumbTouchSize={{width: 40, height: 40}}
                      trackStyle={{height:2}}
                     
                      animateTransitions={false}
                      onValueChange={value => {
                        clearTimeout(sliderTimeoutId)
                        sliderTimeoutId = setTimeout(() => {
                          //console.log("onValueChange",value);
                          sendBack(value)
                        },10)
                      }}
                      onSlidingStart={onStart}
                      onSlidingComplete={onComplete}
                      itemId={itemId}
                      />
                  </View>
                 
              <IconBottomRender/>  
          </View>
       
    )
}
/**
 * @component
 * @attr {number} size
 * 
 */
const StyledMainView = styled.View`
                    flex: 1;
                    min-height:150px;
                   
                `;
const TemperatureText = styled.Text`
                font-size:22px;
                font-weight:bold;


`;
const styles = {
    icon : {
        width:30,
        height:30,
        marginLeft:-16,
        borderColor:"red",
        borderWidth:1,
    },
    infoLine : {
        flex:1,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    }
}
