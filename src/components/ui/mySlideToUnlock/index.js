/**
 * Animation might be (very) Slow in DEV/Debug Mode because of 
 *  Animated.spring(pan, {
          toValue: dest, // return to start
          useNativeDriver: false
 *
 *  Just deactivate debug to see it work as expected
 * 
 */

import defaultDelay from "@components/objects/default/defaultDelay";
import React, { useRef,useState,useEffect } from "react";
import { Animated, View, StyleSheet, PanResponder, Text, ScrollView,Image } from "react-native";

import { SvgXml } from 'react-native-svg';

import Chevron from '_brand/images/icons/app/ArrowRight1';
import BackIcon from '_brand/images/icons/app/ArrowLeft1';
import HomeIcon from '_brand/images/icons/app/Home';
import Car from '_brand/images/icons/app/Car';
import Lock from '_brand/images/icons/app/Lock';
import User from '_brand/images/icons/app/User';

const imageOptions = {
  gate:require('_images/interfaces/menu/gate.png'),
  door:require('_images/interfaces/door.png'),
  padlock:require('_images/interfaces/padlock.png'),
}





export default function SlideToUnlock(props) {

  const thumbSize = 72 || props.thumbSize || 30;
  const borderSize = 0 || props.borderSize || 5;
  const {startColor,endColor,backgroundColor,
        startAlpha,endAlpha,
        iconLeft,iconRight,iconMiddle,
        iconThumb,cursorBgColorStart = "#FF0000",cursorBgColorEnd = "#00FF00",
        slideText = "",
        callback,actionName,itemId,enabled,
        fixedIcons = true,
        backgroundHeight = 48
      
      
      }= props;
 // console.log("SlideToUnlock >>>>>>",props)
  const swipeBorder = 2;
  //const [maxX,setMaxX] = useState(100);
  const dragSizeExtended = 400;
  const pan = useRef(new Animated.Value(0)).current;

  // needed because props.itemId not refreshed ()
  const itemIdRef = useRef(null)
  
  const [isDragged,setIsDragged] = useState(false);
  const [svgBackground,setSvgBackground] = useState('<svg></svg>')

 

  const maxX = useRef(100);
  const counter = useRef(0);
  const offset = useRef({x:0,y:0});

  const iconActiveColor = "#000000";
  const iconInactiveColor = "#BFBFC3";

  

  const createColorInterpolation = (width,startColor,endColor) => {
    return pan.interpolate({
      inputRange: [0, width],
      outputRange:[startColor , endColor]
    });
  }

  const leftIconColorInterpolation =  useRef(createColorInterpolation(10,iconActiveColor,iconInactiveColor));   
  const rightIconColorInterpolation =   useRef(createColorInterpolation(10,iconInactiveColor,iconActiveColor));

  const cursorBgColor = useRef(createColorInterpolation(10,"white","green"));
  const iconColorInterpolation = useRef(createColorInterpolation(10,"#000000","#FFFFFF"));



  const unlockedTimer = useRef(null)
  const handleMultiSelection = (x,y) => {
   
  }


  const drawBg = (mWidth) => {
    //console.log("startColor=>",startColor)
    const strokewidth = 3;
    const color = "orange" || (startColor!=undefined)? "url(#grad1)": backgroundColor || "#FF0000";

    //const mHeight = thumbSize;
    const mHeight = backgroundHeight;
    let bg = '<svg width="'+mWidth+'" height="'+mHeight+'">';
    if(startColor!=undefined && endColor!=undefined) {
      const endOpacity = (endColor.length >7)? 1 : 1;
     bg+=  `<defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:${startColor};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${endColor};stop-opacity:${endOpacity}" />
            </linearGradient>
          </defs>`
    }
   
      //stroke-width:'+strokewidth+';stroke:rgb(0,0,0)

    //const radius = thumbSize/2;
    const radius = mHeight/2

   // bg+='<rect width="'+mWidth+'" height="'+mHeight+'" rx="'+radius+'" rY="'+radius+'" style="fill:'+color+';"/></svg>';
    bg+='<rect width="'+mWidth+'" height="'+mHeight+'" rx="'+radius+'" rY="'+radius+'" style="fill:#FFFFFF;"/></svg>';
    //console.log("bg XXXXX",bg)
    return bg
  }

  //-------------------------------------------------

  



  const thumbElement = () => {

    if(props.thumbElement) return props.thumbElement

    if(actions.length == 3) {
      const ActionToggleIcon = actions[togglePos].icon;
      return (
        <View style={{width:thumbSize,height:thumbSize,borderRadius:thumbSize/2,backgroundColor:'transparent',alignItems:'center',justifyContent:'center'}}>
          <View style={{width:thumbSize-borderSize*2,height:thumbSize-borderSize*2,borderRadius:(thumbSize-borderSize*2)/2,backgroundColor:"#4495FF",alignItems:'center',justifyContent:'center'}}>
            <View style={{width:24,height:24}}><ActionToggleIcon color="white"/></View>
          </View>
      </View>

      )
    }

    return (
      <View style={{width:thumbSize,height:thumbSize,borderRadius:thumbSize/2,backgroundColor:'transparent',alignItems:'center',justifyContent:'center'}}>
        <Animated.View style={{width:thumbSize-borderSize*2,height:thumbSize-borderSize*2,borderRadius:(thumbSize-borderSize*2)/2,backgroundColor:cursorBgColor.current,alignItems:'center',justifyContent:'center'}}>
          <Animated.Image style={{width:thumbSize*0.5,height:thumbSize*0.5,tintColor:iconColorInterpolation.current}} source={imageOptions[iconThumb]}/>
      </Animated.View>
      </View>
    )
  }
  //-----------------------------------------------

  const BarSlice = (props) => {

    const {size = 16,color="transparent"} = props
    return (
      <View style={{backgroundColor:"transparent",flex:1,alignItems:'center',justifyContent:'center'}}>
        <View style={{width:size,height:size}}>
         {props.children}
        </View>
      </View>            
    )
  }

  const displayContent = () => {

    if(actions.length == 3) {
      return (
        <View style={{width:'100%',height:'100%',backgroundColor:'transparent',position:'absolute'}}>
          <View style={{flex:1,flexDirection:'row'}}>
          <BarSlice color='#FFFF00BB' ><User/></BarSlice> 
            <BarSlice color='#00FF00BB' ><BackIcon/></BarSlice> 
            <BarSlice color='#0000FFBB' ><Lock/></BarSlice>
            <BarSlice color='#c30fd6ba' ><Chevron/></BarSlice>           
            <BarSlice color='#FF0000BB' ><Car/></BarSlice>            
            
          </View>
        
         </View>
      )
    }

    // Two states 
    return (
      <View style={{width:'100%',height:'100%',backgroundColor:'transparent',position:'absolute',alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
        <View style={{flexDirection:'row',alignItems:'center'}}><Text>A : {slideText}</Text><View style={{height:16,width:16}}><Chevron/></View></View>
    </View>
    )
  }
  //-------------------------

  const drawBackground = () => {

  }
 //--------------------------
  const onLayout = (e) => {
   
    const {width,height,x,y} = e.nativeEvent.layout;   
    maxX.current = width-thumbSize;    
    //console.log("je relayoute !!!!")
    setSvgBackground(drawBg(width));

    leftIconColorInterpolation.current = createColorInterpolation(width,iconActiveColor,iconInactiveColor);
    rightIconColorInterpolation.current = createColorInterpolation(width,iconInactiveColor,iconActiveColor);
    cursorBgColor.current = createColorInterpolation(width-thumbSize-borderSize,cursorBgColorStart,cursorBgColorEnd);
    iconColorInterpolation.current = createColorInterpolation((width-thumbSize-borderSize),"#000000","#FFFFFF");
  }
  //------------------------------------------------------------



const fillPanresponder = () => {
  return PanResponder.create({

    onStartShouldSetPanResponder: (evt, gestureState) => true,
    
    onStartShouldSetPanResponderCapture: (evt, gestureState) =>false,
    
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
   
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      return false;
    },     
    onPanResponderTerminationRequest: (evt, gestureState) => {
      console.log("onPanResponderTerminationRequest")
      return false;
    },

    onPanResponderGrant: () => {
      setIsDragged(true)
      //console.log("granted !! ",offset)
      /*
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value
      });
      */
     return true;
    },
    onPanResponderMove: (event, gesture) => {
      //console.log("offset",offset.current.x,maxX.current)
      const posX = offset.current.x+gesture.dx;
      const nx = (posX < maxX.current) ? (posX> 0)? posX : 0 : maxX.current
      //const glop = (gesture.dx < 100 ) ? gesture.dx : 100;``
      //console.log(nx);
      //console.log("posX",posX)
      if(enabled != false)pan.setValue(nx);
      //console.log(leftIconColorInterpolation.current._value)
    },
    
   
    onPanResponderRelease: () => {
     
      //console.log("released!!")        
      onRelease();
      
    },
    onPanResponderTerminate: (evt, gesture) => {
     // console.log("terminate bis",gesture)
      onRelease();
    },
  })
}


  const panResponder = useRef(null);


  const actions = [{icon:User},{icon:Lock},{icon:Car}]
  const [togglePos,setTogglePos] = useState(0)


  const onRelease = () => {
    //console.log("onRelease !!!",maxX.current)
        setIsDragged(false);       
        counter.current = counter.current+1;
        const posX = pan._value + 0;
        const nx = (posX < maxX.current) ? (posX> 0)? posX : 0 : maxX.current;  
       // console.log("posX",posX,"nx",nx)   
        
        const percent = nx/maxX.current

        //console.log("percent",percent);
        let dest = 0
        if(actions.length == 2) {
          dest = (nx > maxX.current/2) ? maxX.current : 0;
        }
       
        if(actions.length == 3) {
            dest = (percent < 0.25)? 0 : (percent < 0.75) ? maxX.current/2 : maxX.current;

            setTogglePos((percent < 0.25)? 0 : (percent < 0.75) ? 1 : 2);
        }



        //console.log("dest",dest,maxX.current)
        if(dest == 0) clearTimeout(unlockedTimer.current);


        onAnimate(dest)



        
         
        


        /*
        if(nx == maxX.current) {
          onUnlocked()
        } else {
         if(dest == maxX.current)onUnlocked()
          Animated.spring(pan, {
            toValue: dest, // return to start
            useNativeDriver: false, // Add this line
            }).start()
            offset.current = {x:dest+0,y:0};
        }
        */
       
  }

const onAnimate = (dest) => {
  Animated.spring(pan, {
    toValue: dest, // return to start
    useNativeDriver: false, // Add this line
    }).start()
    offset.current = {x:dest+0,y:0};
}












  const onReleaseOrigin = () => {
    console.log("onRelease !!!",maxX.current)
        setIsDragged(false);       
        counter.current = counter.current+1;
        const posX = pan._value + 0;
        const nx = (posX < maxX.current) ? (posX> 0)? posX : 0 : maxX.current;  
        console.log("posX",posX,"nx",nx)     
        const dest = (nx > maxX.current/2) ? maxX.current : 0;
        console.log("dest",dest)
        if(dest == 0) clearTimeout(unlockedTimer.current);

        if(nx == maxX.current) {
          onUnlocked()
        } else {
         if(dest == maxX.current)onUnlocked()
          Animated.spring(pan, {
            toValue: dest, // return to start
            useNativeDriver: false, // Add this line
            }).start()
            offset.current = {x:dest+0,y:0};
        }
       
  }

  const onUnlocked = () => {
    console.log("onUnlocked Timeout",itemId,itemIdRef.current)
    if(callback!=undefined)callback(itemIdRef.current);
    clearTimeout(unlockedTimer.current);
   
    unlockedTimer.current = setTimeout(() => {
                                          offset.current = {x:0,y:0};
                                          Animated.spring(pan, {
                                            toValue: 0, // return to start
                                            useNativeDriver: false,
                                          }).start();

                            },
                        3000);
  }


  useEffect(() => {
    //console.log("useEffect à la 'componentDidMount'")
    panResponder.current = fillPanresponder();
    // not need to add this panresponder to simultaneus in into DraggableFlatList
    // just add activationDistance={20} 

    //below 
    //dispatch({'type':"ADD_PANRESPONDER",'payload': panResponder.current})
   }, [enabled]);

   useEffect(() => {
    
    itemIdRef.current = itemId;
   }, [itemId]);

 



  return (
    <ScrollView style={{ flex: 1 ,borderWidth:0,borderColor:'black'}} scrollEnabled={false} onLayout={onLayout}>
     {/*<Text style={styles.titleText}>Drag this box! ({Math.round(pan.x._value).toString()}) et ({counter.current.toString()})</Text>*/}
     <View style={{position:'absolute',height:'100%',width:'100%',left:0,backgroundColor:"transparent"}}>
      <View style={{flex:1,justifyContent:'center'}}>
      <SvgXml width="100%" height={backgroundHeight} xml={svgBackground} />
      </View>
       
    </View>
   
    {(iconLeft != undefined || iconRight != undefined) &&
      <View pointerEvents="none" style={{position:'absolute',height:backgroundHeight,width:'100%',left:0,backgroundColor:"transparent",flex:1,elevation:0,zIndex:0, flexDirection:'row'}}>
        <>
      
        
        <View style={{flexGrow:1,backgroundColor:'#0000FF00',width:thumbSize,height:thumbSize}}></View>
        {(iconRight && 1 == 2 )&&
        <View style={[styles.iconWrapper,{width:thumbSize,height:thumbSize,backgroundColor:'transparent'}]} >
            <Animated.Image style={{width:thumbSize*0.6,height:thumbSize*0.6,tintColor:iconInactiveColor}} source={imageOptions[iconRight]}/>
              
          </View>
        }
        </>
      </View>
    }
    <View style={[styles.container,{height:'100%',backgroundColor:'#0000FF00'}]}>  
      { displayContent()}
           
      <Animated.View
        style={{
          transform: [{ translateX: pan}, { translateY: 0 }], backgroundColor:'#FFAA0B00'
        }}
        {...panResponder.current?.panHandlers}
      >
       
        <View style={[styles.box,{height:thumbSize,width:thumbSize,top:-1.5}]}>
          {
            thumbElement()
          }
           <View style={{width:(isDragged)? dragSizeExtended :  0, height:(isDragged)? dragSizeExtended :  0,marginLeft:-dragSizeExtended/2,marginTop:-dragSizeExtended/2,backgroundColor:'#FF000000'}}></View>
        </View>
         
      </Animated.View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
   
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold"
  },
  box: {
   
    backgroundColor: "transparent",
    borderRadius: 5
  },
  iconWrapper: {
    alignItems:'center',
    justifyContent:'center'
  }
});
