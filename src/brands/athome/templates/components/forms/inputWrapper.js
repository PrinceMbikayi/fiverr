import React,{useRef,useState,useEffect} from 'react';
import { View,Text,Animated } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import styled,{ThemeProvider} from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';



//--- brand ----
// style={{transform:[{scale: 0.5}]}}

function InputWrapper(props) {

    const {isFocused,value} = props;


    const borderColor = props.borderColor || "green";   
    const {theme,baseColors} = useTheme();
    const {bgColor} = props || "red";
    console.log("baseColors",baseColors)


    useEffect(()=> {
       if(value?.length > 0)onAnimate()
    },[value])


    const onPress = () => {
        if(props.onFocus) {
            props.onFocus()
        }
        onAnimate();
       }
    

    const animatedFontSize = 12;
    /*
    <Label fontSize={animatedFontSize} style= {{transform:[
     {translateX:0},{scale:1},
   ]}}>  {props.placeholder}  </Label>
   */

   const scaleAnim = useRef(new Animated.Value(1)).current;
   const yAnim = useRef(new Animated.Value(0)).current;
   const xAnim = useRef(new Animated.Value(0)).current;
   const oAnim = useRef(new Animated.Value(0.5)).current;

   const animatedValue = React.useRef(new Animated.Value(0)).current;
   
   const animDuration = 200;

   const onAnimate = () => {
    Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: animDuration,
        useNativeDriver:false
      }).start();
      Animated.timing(yAnim, {
        toValue: -20,
        duration: animDuration,
        useNativeDriver:false
      }).start();
      Animated.timing(xAnim, {
        toValue: -20,
        duration: animDuration,
        useNativeDriver:false
      }).start();
      Animated.timing(oAnim, {
        toValue: 1,
        duration: animDuration,
        useNativeDriver:false
      }).start();
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: animDuration,
        useNativeDriver:false
      }).start();
   }
   const [positionX, setPositionX] = React.useState(0);
   const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0,-positionX+10],
        useNativeDriver:false
    });

    const focusedColor = "red";

   const styledTheme = {
                        borderColor:isFocused? focusedColor :borderColor,
                        borderWidth:1,radius:8,topHeight:2,
                        labelColor:isFocused? focusedColor :borderColor,
                        labelBackgroundColor:bgColor,
                        placeholderColor: props.placeholderTextColor || "grey"
                    };


                    //console.log("positionX=>",positionX)


    return ( 
        <View style={{backgroundColor:'transparent',marginBottom:8}}>
            <ThemeProvider theme={styledTheme}>
                <WrapperTop>
                    <TopLeft/> 
                    <TopRight/>
                </WrapperTop>
                <WrapperCentral style={{backgroundColor:'transparent',padding:0}}>
                    {props.children}
                </WrapperCentral>
                <WrapperBottom/>               
            <FloatingLabel onLayout={({ nativeEvent: { layout: { width } } }) => { setPositionX(width / 4.0) }} style={{alignSelf:'flex-start',zIndex:4,transform:[{translateX:translateX},{translateY:yAnim},{scale:scaleAnim}],opacity:oAnim}} zIndex={4} onPress={onPress}>  {props.placeholder}  </FloatingLabel>
            </ThemeProvider>
           </View>
     );
}


export default InputWrapper;


const Wrapper = styled.View`
    border-radius:10px;
    border-width:2px;
    border-color:red;
`;



const WrapperTop = styled.View`
  
    height:12px;
    flex-direction:row;
    border-color:yellow;
    min-height:${attrs => attrs.theme.topHeight}px;
    overflow:visible;
`;
const TopLeft = styled.View`
  
    border-top-left-radius:${attrs => attrs.theme.radius}px;
    border-width:${attrs => attrs.theme.borderWidth}px;
    border-bottom-width:0;
    border-right-width:0;
    border-color:${attrs => attrs.theme.borderColor};
    width:20px;
`;
const TopRight = styled.View`
  
    border-top-right-radius:${attrs => attrs.theme.radius}px;
    border-width:${attrs => attrs.theme.borderWidth}px;
    border-bottom-width:0;
    border-left-width:0;
    border-color:${attrs => attrs.theme.borderColor};
    flex:1;
`;

const WrapperCentral = styled.View`
  
   
    border-width:${attrs => attrs.theme.borderWidth}px;
    border-bottom-width:0px;
    border-top-width:0px;
    background-color:transparent;
    border-radius:0px;
    border-color:${attrs => attrs.theme.borderColor};    
    align-items:center;
    justify-content:center;
`;
const WrapperBottom = styled.View`  
    border-bottom-left-radius:${attrs => attrs.theme.radius}px;
    border-bottom-right-radius:${attrs => attrs.theme.radius}px;
    border-width:${attrs => attrs.theme.borderWidth}px;
    border-top-width:0;  
    border-color:${attrs => attrs.theme.borderColor};
    height:12px;
    min-height:${attrs => attrs.theme.radius}px;
    margin-bottom:${attrs => attrs.theme.radius}px;
`;


const Label = styled.Text`
  font-size:${attrs => attrs.fontSize}px; 
  padding-left:0px;
  padding-right:0px;
 
  color:${attrs => attrs.theme.labelColor};
  background-color:yellow;
  overflow:visible;
  z-index:4;
`;

const FloatingLabel = styled(Animated.Text)`
    font-size:16px;
    margin-top:10px;
    margin-left:10px;
    position:absolute;
    background-color:${attrs => attrs.theme.labelBackgroundColor};
   color:${attrs => attrs.theme.labelColor};
`;