import React,{useState,useEffet,FC} from 'react';
import { View,TouchableOpacity,Text} from 'react-native';
import Svg, {
                SvgCss,
                Circle
        } from 'react-native-svg';
 
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';

import {StyledIconWrapperBlockView} from '_components/ui/styled/icons';

/**
 * return an IconButtonRound
 * @param {Object} props
 * @param {function} props.callback the callback
 * @param {string} props.iconXml
 * @param {object} props.svgr
 * @param {string} props.strokeColor
 * @param {string} [props.backgroundColor=transparent] default transparent
 * @param {number} [props.strokeWidth] default 2
 * @param {number} [props.iconScale] default 1
 * @param {boolean} [props.disabled] 
 * @param {boolean} [props.disabled]
 * 
 * @return a functional button
 */
export const IconButtonRound = (props) => {
   
    const {theme} = useTheme();    
    const {strokeWidth = 2,iconXml,iconScale = 1,disabled,svgr} = props;
    const regularStrokeColor = props.strokeColor|| "green";
    const regularBackgroundColor = props.forceBackgroundColor || props.backgroundColor || 'transparent';

    const [strokeColor,setStrokeColor] = useState(regularStrokeColor);

    const [fillColor,setFillColor] = useState(regularStrokeColor)
    const [backgroundColor,setBackgroundColor] = useState(regularBackgroundColor)

    const onDoPress = () => {
       // console.log("glop glop",props.action,props.onDown,props.callback)
       
        if(props.callback && props.onDown) {
            setStrokeColor("red");
            props.callback(props.action,true)
        }

    }
    const onDoRelease = () => {
        //console.log("pas glop pas glop")
        setStrokeColor(regularStrokeColor);
        if(props.callback) {
            props.callback(props.action,false)
        }
    }


    const iconSize = props.iconSize || 32;
    const iconColor = theme['card--color--icon'];
    const textColor = theme['card--color--text'];
    const iconBackgroundColor = theme['widget--round--wrapper--color--background'] || props.backgroundColor;
    const iconWrapperColor = iconBackgroundColor;
    const iconFillColor = (props.isActive) ? theme.active_button_color || "green" : iconColor;
    
    const svgrSize = props.iconSize || 12;
    const svgrWrapperStyle = {height:svgrSize,width:svgrSize};
    
    return  (
        <View style={{width:iconSize+strokeWidth,height:iconSize+strokeWidth,alignItems:'center',justifyContent:'center'}}> 
                <View style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} >
                    <Svg height={iconSize+2*strokeWidth} width={iconSize+2*strokeWidth}>
                        <Circle cx={(iconSize+strokeWidth)/2} cy={(iconSize+strokeWidth)/2} r={iconSize/2} fill={backgroundColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
                    </Svg>
                </View>
                <TouchableOpacity disabled={disabled} activeOpacity={0.5}  underlayColor="#00FF00" onPressIn={onDoPress} onPressOut={onDoRelease} >                       
                        <>
                        { 
                            (svgr)? <View style={svgrWrapperStyle}>{svgr}</View> :  <SvgCss xml={iconXml} width={iconSize*iconScale} height={iconSize*iconScale}  fill={disabled ? 'transparent' : fillColor}  viewBox="0 0 48 48" preserveAspectRatio="xMinYMin slice"/>
                        }
                        </>
                </TouchableOpacity>  
        </View>
    );
}


