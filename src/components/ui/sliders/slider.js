import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { View,Text} from 'react-native';

import { useTheme } from '_theming/themeProvider';

import styled from 'styled-components/native'

import {StyledIconWrapperView} from '_components/ui/styled/icons';
import { Slider as RNESlider} from 'react-native-elements';

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






export const UiSlider = (props) => {
    
    const {theme} = useTheme();
    const {iconTop,iconBottom,sliderHeight,gradientTrack} = props;
    const [sliderValue, setSliderValue] = useState(0);
    const trackHeight = (sliderHeight || 120 ) - 2*((iconTop) ? 30 : 0);    
    const trackWidth = props.trackWidth || 1


    const IconTopRender = () => {        
        if(iconTop) return iconTop
        return (<></> )
    }
    const IconBottomRender = () => {  
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

    const updateValue = (value) => {
        setSliderValue( value );

       // console.log(sliderValue)
    }

    const customMaxTrackTint = (gradientTrack != undefined )? "transparent" : (props.maxTrackTint || "black")
    const customMinTrackTint = (gradientTrack != undefined )? "transparent" : (props.mixTrackTint || "#cccccc")

    

    return (    
            <>
            <IconTopRender/>
            <View style={{ flex: 1,maxWidth:'100%'}}>
                <View style={{flex:1,justifyContent:"center"}}>           
                    <ShowGradientTrack/>
                    <RNESlider {...props}
                        value={sliderValue}
                        onValueChange={(value) => updateValue(value)}
                        maximumTrackTintColor={customMaxTrackTint} 
                        minimumTrackTintColor={customMinTrackTint}                       
                        height={trackHeight}
                        style={{alignSelf:'center'}}
                        trackStyle={{width:trackWidth}}
                    />
                </View>   
            </View>
            <IconBottomRender/>  
            </>       
    )
}