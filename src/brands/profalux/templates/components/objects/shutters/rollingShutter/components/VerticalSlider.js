import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Platform} from 'react-native';
import { PanGestureHandler, TapGestureHandler} from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, useAnimatedProps ,runOnJS, withSpring, withTiming} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';



/**
 * Shutter Details content 
 * 
 * @param {Object} props
 * @param {number} props.sliderHidth
 * @param {number} props.minValue
 * @param {number} props.maxValue
 * 
 * 
 */
export const VerticalSlider = (props) =>{
    const {sliderHeight, minValue, maxValue, onValueChange, step, ajarPosition, ajarPercentage, sliderValue} = props;
    const position = useSharedValue(0);
    const position2 = useSharedValue(sliderHeight);
    const opacity = useSharedValue(0);
    const tapAjarOpening = useSharedValue(false);
    const pressed = useSharedValue(false);
    const [active, setActive] = useState(false);

    const { t, i18n } = useTranslation();
    const tns = "rollingShutter";

 
    useEffect(()=>{
        const initialThumbPosition = sliderHeight*sliderValue/100;
        if(Platform.OS === 'ios'){
            position.value = withSpring(initialThumbPosition, {mass:0.2});
        }else{
            position.value = initialThumbPosition;
        }
    },[sliderValue])
    // gesture handler
    const gestureHandler = useAnimatedGestureHandler({
        onStart: (e, ctx) =>{
            opacity.value = 1;
            ctx.startY = position.value ;
            console.log("Here My position", position.value);
            // tapFavShare? position.value = sliderHeight*0.80 : ctx.startY = position.value;
        },
        onActive: (e,ctx) =>{
            if(ctx.startY + e.translationY < 0){
                position.value = 0
            }else if(ctx.startY + e.translationY > position2.value){
                if(Platform.OS === 'ios'){
                    position.value = withTiming (position2.value, {duration:100});
                }else{position.value = position2.value;}
            }else{
                if(Platform.OS === 'ios'){
                    position.value =  withTiming(ctx.startY + e.translationY, {duration:100});
                }else{position.value =  ctx.startY + e.translationY;}
                
            }
        },
        onFinish: (e,ctx) =>{
            opacity.value = 0,
            runOnJS(onValueChange)(
                //tapAjar : tapAjarOpening.value,
                minValue + Math.floor( position.value/ (sliderHeight / (  (maxValue - minValue)/step ) ) )*step
            );
        }
    });

    // Event Handler Tap
    const tapEventHandler = useAnimatedGestureHandler({
        onStart: (event, ctx) => {
          pressed.value = true;
          if(Platform.OS === 'ios'){
            position.value = withSpring(sliderHeight*ajarPercentage, {mass:0.2});
          }else{position.value = sliderHeight*ajarPercentage;}
        },
        onFinish: (event, ctx) => {
          pressed.value = false;
          runOnJS(onValueChange)(
            minValue + Math.floor( position.value/ (sliderHeight / (  (maxValue - minValue)/step ) ) )*step 
            
        );
        },
      });
      
      //
      const tapAjar = useAnimatedStyle(() => {
        return {
          backgroundColor: pressed.value ? '#FEEF86' : '#001972',
          transform: [{ scale: pressed.value ? 1.2 : 1 }],
        };
      });

    // Animated style
    const animatedThumbStyle = useAnimatedStyle(() => ({
        transform: [{translateY: position.value }],
    }));

    // opacity animated style
    const animatedOpacityStyle = useAnimatedStyle(() =>({
        opacity: opacity.value,
    }))

    // Animate the slider 
    const sliderStyleAnimation = useAnimatedStyle(() =>({
        transform: [{translateY: position.value}],
        height: position2.value - position.value,
    }));

    // Animate Text input
    const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
    const valueLabelText = useAnimatedProps(() =>{
        return{
            text:`${minValue + Math.floor( position.value/ (sliderHeight / ((maxValue - minValue)/step ) ) )*step }`
        }
    })
    return(
        <View style={[styles.sliderContainer, {height:sliderHeight}]}>
            <View style={[styles.sliderBack, {height:sliderHeight}]} />
            <View style={ {marginTop:sliderHeight*ajarPercentage - 8, marginLeft:30, backgroundColor:'transparent', width:50, position:'absolute'}}><Text>{t(tns+":"+"AJAR")}</Text></View>
            <View style={ {marginTop:sliderHeight*0 - 8, marginLeft:30, backgroundColor:'transparent', width:50, position:'absolute'}}><Text>{t(tns+":"+"OPENED")}</Text></View>
            <View style={ {marginTop:sliderHeight - 16, marginLeft:30, backgroundColor:'transparent', width:50, position:'absolute'}}><Text>{t(tns+":"+"CLOSED")}</Text></View>
                <TapGestureHandler onGestureEvent={tapEventHandler}>
                    <Animated.View style={[styles.tickMarkAjar, {marginTop:-sliderHeight*ajarPosition, marginLeft:-8}, tapAjar]} />
                </TapGestureHandler>
            {/* <Pressable 
                onPress={moveThumbToFavorite}
                hitSlop = {10}
                style={[styles.tickMark, {marginTop:-sliderHeight*0.2, marginLeft:-8, backgroundColor:'red'}]}
            /> */}
                <Animated.View style={[styles.sliderFront, sliderStyleAnimation, {height:sliderHeight}]} />
            
                    <PanGestureHandler onGestureEvent={gestureHandler}>
                        <Animated.View style={[styles.thumb, animatedThumbStyle]}>
                            <Animated.View style = {[styles.label, animatedOpacityStyle]}>
                                <AnimatedTextInput 
                                    style={styles.labelText}
                                    defaultValue = {position.value}
                                    animatedProps={valueLabelText}
                                    editable = {false}
                                />
                            </Animated.View>
                        </Animated.View>
                    </PanGestureHandler>
        </View>
    )
}

const SLIDER_WIDTH = 4;
const SLIDER_HEIGHT = 300;
const styles = StyleSheet.create({
    sliderContainer:{
        // flexDirection:'column',
        // justifyContent:'center',
        // alignSelf:'center'
    },
    sliderBack:{
        // height: SLIDER_HEIGHT,
        //position:'absolute',
        width:SLIDER_WIDTH,
        backgroundColor:'#e73434',
        borderRadius:20,
    },
    sliderFront:{
        position:'absolute',
        // height: SLIDER_HEIGHT,
        width:SLIDER_WIDTH,
        backgroundColor:'#C3C3C3',
        borderRadius:20,
    },
    thumb:{
        position:'absolute',
        left:-10,
        top:-12,
        width:24,
        height:24,
        backgroundColor:'#FFFFFF',
        borderColor:'#6C6F9A',
        borderWidth:1.5,
        borderRadius:12,
    },
    label:{
        //position:'absolute',
        //right:-70,
        //left:30,
        //top:-5,
        flex:1,
        marginLeft:70,
        backgroundColor: 'transparent',
        borderRadius:5,
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center'
    },
    labelText: {
        color:'black',
        //padding:2,
        fontWeight:'bold',
        width:'100%',
        fontSize:16,
    },
    tickMarkAjar:{
        //borderBottomColor: '#C3C3C3',
        borderWidth:2,
        width:20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#C3C3C3',
        //marginLeft:142.5,
    },

})