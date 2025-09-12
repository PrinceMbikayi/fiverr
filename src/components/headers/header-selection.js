import React,{ useContext, useEffect,useRef} from 'react';
import { View,Text,TouchableOpacity,Image,Animated,Easing} from 'react-native';

import { HeaderWithBack } from "./header-with-back";
import { useTheme } from '_theming/themeProvider';
import { HeaderButton } from './header-button';

export const HeaderSelection = (props) => {

    const {closeAction,selected =[],buttons : options = [],title, color = "white"} = props;
    
    const {theme} = useTheme();


    const animatedValue = useRef(new Animated.Value(0)).current;

    const startAnimation = toValue => {
        Animated.timing(animatedValue, {
            toValue,
            duration: 250,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => {
            //setIsTop(!isTop);
        })
    }

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 0],
        extrapolate: 'clamp'
    })


    useEffect(()=> {      
        startAnimation((selected?.length > 0) ? 1 : 0)
    },[selected])


     // Header Buttons it's a JSX node
     const ScreenHeaderButtons = () => {
        const iconSize = 32; 
       // console.log("options ScreenHeaderButtons",options)      
        return (
            <View style={{backgroundColor:'transparent', width:30,height:32,marginRight:15,alignItems:'center', alignContent:'center'}}> 
                <View style={{flex:1,justifyContent:'center'}}>
                { options.map((v,i) => {
                    return (
                        <HeaderButton callback={v.action} img={v.icon} fillColor={color} iconSize={24} key={"shb_"+i}/>
                    )
                })         
                }
                </View>
            </View>
        )       
    }

    const headerBackgroundColor = theme["card--color--headerbg"]; 
    return (
        <>
        {1 == 1 &&
            <Animated.View style={[{position:'absolute',top:0,zIndex:4,minHeight:100,width:'100%'},{ transform: [{ translateY }]}]}  zOrder={4}>
              <HeaderWithBack backIcon="close" backIconSize={24} goBack={{action:closeAction}} title={title || "sélection"}  style={{minHeight:64}} screenHeaderButtons={<ScreenHeaderButtons/>} {...props}/> 
            </Animated.View>
        }
        </>      
    )
}