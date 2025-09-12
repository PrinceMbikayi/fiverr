import React from 'react'
import {View,Text} from 'react-native';
import { useTheme } from '_theming/themeProvider';
import Svg, {
 
    Rect,  
    Defs,
    LinearGradient, 
    Stop,  
  } from 'react-native-svg';


export const ShadowBorder = React.memo(props => {
   
  const { itemId,callback,ratio,themeDependency} = props;
  
  const factor = (ratio != undefined) ? Number(ratio) : 1
  //const myWidth = 200+(200*factor)
  const myWidth = 2048
 //const myWidth = 200+Math.floor(Math.random() * 100)
  
  const {themeID} = useTheme();
  
  const shadowColorStart = (themeDependency == undefined) ? "#000000" : (themeID == "DARK") ? "#000000" : "#999999";
  const shadowColorEnd = (themeDependency == undefined) ? "#333333" : (themeID == "DARK") ? "#333333" : "#FFFFFF";
  const gradHeight = (themeDependency == undefined) ? "15" :(themeID == "DARK") ? "15" : "10";

    return (
       
        <Svg height="15" width={myWidth} >
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={shadowColorStart} stopOpacity="1" />
                <Stop offset="1" stopColor={shadowColorEnd} stopOpacity="0" />
              </LinearGradient>
            </Defs>            
            <Rect x="0" y="0" width="100%" height={gradHeight} fill="url(#grad)"/>
          </Svg>
          
    )
});

/*

 return (
       
        <Svg height="15" width={myWidth} >
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000000" stopOpacity="1" />
                <Stop offset="1" stopColor="#333333" stopOpacity="0" />
              </LinearGradient>
            </Defs>            
            <Rect x="0" y="0" width="100%" height="15" fill="url(#grad)"/>
          </Svg>
          
    )

*/


