import '../locales'
import React,{ useState,useRef, useEffect } from 'react';
import { View,Text,StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

export const AddObjectCountDownTasks = (props)=>{
    const {isTimerPlaying, duration, onComplete, refresh} = props;

    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const { theme } = useTheme();
  
    const textColor = theme?.prflxTextColor||'black'

    const children = ({ remainingTime }) => {
        if (remainingTime == 0) {
          return(
                <View style={styles.timer}> 
                    <Text style = {{fontSize:18, color:'red'}}>{t(tns+":"+"TIMER_COMPLETE")}</Text>
                </View>
            ) 
        }
      
        return (
            <View style={styles.timer}>
                <View style={{paddingTop:15}}>
                    <Text style={{color:textColor, fontSize:16}}>{t(tns+":"+"REMAINING")}</Text>
                </View>
                <View>
                    <Text style={{color:textColor, fontSize:35}}>{remainingTime}</Text>
                </View>
                <View style={{paddingBottom:15}}>
                    <Text style={{color:textColor, fontSize:16}}>{t(tns+":"+"SECONDS")}</Text>
                </View>
            </View>
        );
      };

    return(

        <View  style={{paddingHorizontal:12, marginTop:30, marginBottom: 20, display:'flex', justifyContent:'center'}}>
            <CountdownCircleTimer
                key = {refresh}
                isPlaying = {isTimerPlaying}
                duration={duration}
                colors={textColor}
                colorsTime={[60, 30, 10, 0]}
                onComplete = {onComplete}
            >
                {children}
            </CountdownCircleTimer>
        </View> 
    )
}


const styles = StyleSheet.create({
        validateButton:{
            width:200,
            height:50,
            marginTop:100
        },
        timer:{
            flex:1,
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'space-evenly'
        },
        text:{
            fontSize:14,
        }
  });