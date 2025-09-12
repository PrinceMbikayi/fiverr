import React from 'react';
import {useContext,useState,useEffect,useRef} from 'react'
import { View,Text,Image,TouchableHighlight,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import {
   
    State,
    TapGestureHandler
  } from 'react-native-gesture-handler';

import { useTheme } from '_theming/themeProvider';
import {VSlider} from '@components/ui/sliders/vSlider';
import {Api} from "_api";

export const TypeShutter = (props) => {
   // console.log("shutter props",props)
    const { t, i18n } = useTranslation();
    const { navigation,itemId,statuses} = props;
    const {theme} = useTheme();
    
    const iconColor = theme['card--color--icon'];
    const textColor = theme['card--color--text'];
    const iconBackgroundColor = theme['widget--round--wrapper--color--background'] || props.backgroundColor;

    const doubleTapRef = useRef(null)

    const iconSize = 24; 
    
    const [levelPercent,setLevelPercent] = useState(Number(statuses.level))
    const [expectedLevel,setExpectedLevel] = useState(-1)

    useEffect(() => {
        //console.log("useEffect statuses => expectedLevel",expectedLevel)
        const testVal = Number(props.statuses.level)
        const arrived = (expectedLevel == testVal || expectedLevel == -1) ? true :false ;
        if(arrived) setExpectedLevel(-1)
        //console.log("Shutter Effect ("+itemId+")",testVal,levelPercent,expectedLevel,arrived)
        if( arrived) {               
            setLevelPercent(testVal);
            setExpectedLevel(-1);           
        } else {
           // for up /down action update statuses from WS
            setLevelPercent(testVal);
        }
     }, [props.statuses.level]);
   
    const sliderCallback = (value) => {
        let val = Math.round(value)
        if(val < 0)val = 0;
        if(val > 100)val = 100;
        setLevelPercent(val)
        setExpectedLevel(-2); // don't remember why may be intermediate level value from websocket
       // console.log('sliderCallback',val);
        //Api.executeAction(itemId,"LEVEL",{mArgs:[{name:'level',value:value}]});
    }
    
    const dimComplete = async (value) => {
      
        let val = Math.round(value)
        if(val < 0)val = 0;
        if(val > 100)val = 100;
        console.log("dim completed",val);
        setExpectedLevel(val)
        Api.executeAction(itemId,"LEVEL",{mArgs:[{name:'level',value:val}]});
        
    }
    
    const actionShutter = (actionName) => {
        // AVAILABLE ACTIONS UP,DOWN
        Api.executeAction(itemId,actionName);
   
    }
    
    const onSingleTap = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
          //Alert.alert("I'm touched");
        }
      };
      const  onDoubleTap = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
          //Alert.alert('Double tap, good job!');
          // If an Emergency STOP is defined then it could be activated from HERE !!!
        }
      };

    return (
         
            <StyledMainView>                 
                <View style={{flex:1,flexDirection:'row',padding:15}}>
                    <View style={{flex:3 }}>
                        <View style={{flex:1,width:120,backgroundColor:iconBackgroundColor,padding:15,borderRadius:12,alignItems:'center',justifyContent:'center'}}>
                            <TapGestureHandler
                                    onHandlerStateChange={onSingleTap}
                                    waitFor={doubleTapRef}>
                            <TapGestureHandler
                                    ref={doubleTapRef}
                                    onHandlerStateChange={onDoubleTap}
                                    numberOfTaps={2}>
                            <View> 
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <TouchableHighlight style={{flex:1,alignItems:'center',justifyContent:'center'}} activeOpacity={0.1} underlayColor="#EEEEEE" onPress={()=>{actionShutter('UP')}}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <Icon name="expand-less" size={30} color={textColor} />  
                                            <Text style={{color:textColor}}>{t("SHUTTER_OPEN_ACTION")}</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={{height:1,backgroundColor:'#999999',marginTop:(iconSize / 2),marginBottom:(iconSize / 2)}}></View> 
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <TouchableHighlight style={{flex:1,alignItems:'center',justifyContent:'center'}} activeOpacity={0.1} underlayColor="#EEEEEE" onPress={()=>{actionShutter('DOWN')}}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={{color:textColor}}>{t("SHUTTER_CLOSE_ACTION")}</Text>
                                        <Icon name="expand-more" size={30} color={textColor} />
                                        </View>
                                    </TouchableHighlight>  
                                </View>
                            </View>
                                </TapGestureHandler>  
                            </TapGestureHandler>
                        </View>
                    </View>  
                    <View style={{width:40,backgroundColor:iconBackgroundColor,padding:15,borderRadius:12,alignItems:'center'}}>
                        <VSlider
                            value={levelPercent}                          
                            tintColor="#BBBBBB"
                            maxTintColor="#000000"
                            cursorTintColor="#BBBBBB"
                            minimumTrackTintColor='#d3d3d3'                           
                            maximumTrackTintColor='#1fb28a'
                            thumbTintColor='#FF0000'
                            shutterName={"("+itemId+")"}
                            callback={sliderCallback} 
                            onSlidingComplete={dimComplete}
                            reversed={true}
                            itemId={itemId}
                        />
                    </View>                
                    
                    <View style={{flex:2,alignItems:'center',justifyContent:'center'}}>
                        <LeftColView style={{justifyContent:'flex-end'}}>
                            <Image source={require("_images/shutter/volet-ouvert.png")} style={{height:iconSize,width:iconSize,'tintColor':iconColor}}/> 
                        </LeftColView>
                        <LeftColView>
                            <Text style={{color:textColor}}>{levelPercent}</Text>
                        </LeftColView>
                        <LeftColView style={{justifyContent:'flex-start'}}>
                            <Image source={require("_images/shutter/volet-ferme.png")} style={{height:iconSize,width:iconSize,'tintColor':iconColor}}/> 
                        </LeftColView>
                    </View>                    
                </View>                      
            </StyledMainView>       
    )
}

const StyledMainView = styled.View`
                    flex: 1; 
                    min-height:150px;
                   
                `;
const TemperatureText = styled.Text`
                font-size:22px;
                font-weight:bold;


`;
const LeftColView = styled.View`
                flex:1;
                justify-content:${props => props.justify || "center"};


`;

