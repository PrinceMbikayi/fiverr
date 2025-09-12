
import '_brand/templates/components/objects/common/locales'
import React from 'react';
import {useEffect,useState} from 'react';
import { View,Text,Image,Pressable, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';


import styled from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';
import {iconsJs} from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";

export const SensorsWidget = (props) => {    

    const {itemId} = props;
    const uObject = useObject(itemId);
    const name = uObject?.name
    const typeName = uObject?.objectDatas?.typeName
    console.log("UOBJECT CAPTEUR NETATMO:", typeName)
    const statuses = uObject?.statuses
    const temperature = statuses?.temperature;

    const approxTemp = temperature!=undefined ? Math.round(temperature): "--"
    const humidity = statuses?.humidity
    const wind_speed =statuses?.wind_speed; 
    const wind_dir =statuses?.wind_direction; 
    const wind_gust = statuses?.wind_gust;
    const rainrate = statuses?.rainrate;

    console.log('STATUS_VALUE:', approxTemp);


    const sensorTypeInfos = [
        {typeName:"NetatmoStation",icon:[iconsJs.indoorSensorIcon], status1:approxTemp, status2:humidity ? humidity :"--", unit1:"°C", unit2:"%"},
        {typeName:"NetatmoIndoorProbe",icon:[iconsJs.indoorSensorIcon], status1:approxTemp, status2:humidity ? humidity :"--", unit1:"°C", unit2:"%"},
        {typeName:"NetatmoOutdoorProbe",icon:[iconsJs.outdoorSensorIcon], status1:approxTemp, status2:humidity ? humidity :"--", unit1:"°C", unit2:"%"},
        {typeName:"NetatmoRainGauge",icon:[iconsJs.rainGaugeSensorIcon], status1:rainrate? rainrate: "-- ", status2:null, unit1:"mm/h", unit2:null},
        {typeName:"NetatmoWindGauge",icon:[iconsJs.windGaugeSensorIcon], status1:wind_speed ? wind_speed : "--", status2:wind_dir ? wind_dir : "--", unit1:"km/h", unit2:null},
    ]



    const {theme} = useTheme();
    const {t} = useTranslation();

    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'

    const onDefaultImageError = () => {

    }

    return (
        <View style={[styles.container, {backgroundColor:'transparent'}]}>
            <View style={[ styles.body]}>
                <View>
                    <Text 
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{backgroundColor:'transparent',marginBottom:5,marginLeft:8,width:140,
                        fontSize:14, fontWeight:"400", flexWrap:'wrap', color:textColor}}
                        >
                                    {name}
                    </Text>
                </View>

                <View style={{
                        backgroundColor:'transparent', height:50 ,flexDirection:'row', alignItems:'center', borderRadius:12,
                        }}>

                        {sensorTypeInfos.map((item,index)=>{
                                if(typeName == item?.typeName){
                                    return(
                                        <View key={index} style={{flexDirection:'row',}}>
                                                <MultiPurposeWidgetLine 
                                                    isPressable = {false}
                                                    icons={item?.icon} 
                                                    iconSize={40}
                                                    //onPress = {handleIconPress} 
                                                    //onLongPress = {handleIconPress}
                                                    //active = {sendCurrentActive}
                                                    iconWrapperStyle = {[{borderColor:textColor, marginLeft:0}]}
                                                    //iconGroupWrapperStyle = {[{ flex:1, alignItems:'flex-start', justifyContent:'flex-start', borderColor:'transparent', borderWidth:1, backgroundColor:'green'}]}
                                                    isShadow = {false}
                                                />
                                            <View style={{flex:1,paddingHorizontal:15, justifyContent:'center', alignItems:'center'}}>
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={{fontSize:14, fontWeight:'700'}}>{item?.status1} </Text>
                                                    <Text style={{fontSize:14, fontWeight:'300'}}>{item?.unit1}</Text>
                                                </View>
                                                { item?.status2 &&
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={{fontSize:14, fontWeight:'700'}}>{item?.status2}</Text>
                                                    <Text style={{fontSize:14, fontWeight:'300'}}> {item?.unit2} </Text>
                                                </View>
                                                }
                                            </View>
                                        </View>
                                    )
                                }
                            })

                        }

                </View>
                    
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container : {
        flex:1,
        justifyContent:'center',
        alignItems:'flex-start',
        flexDirection:'column',
        marginHorizontal:5,
        marginVertical:5,
        height:70,
        //paddingVertical:20
    },
    iconDisplay:{
        flexDirection:'row',
        // marginRight:35,
        // marginLeft:20,
        // marginTop:5,
        // marginBottom:10,
        borderWidth:1,
        borderRadius:7,
        justifyContent:'space-evenly',
        alignItems:'flex-start'
        //backgroundColor:'white'
    },
    groupIconWrapper:{
        flexDirection:'row',
        backgroundColor:'transparent',
        alignItems:'flex-start', 
        justifyContent:'flex-start',
    },

    body:{
        backgroundColor:'transparent',
        flexDirection:'column',
        alignItems:'flex-start', 
        justifyContent:'flex-start',
      }
})
const RoundStatus = styled.View`
   height:${props => props.size}px; 
   width:${props => props.size}px; 
   border-radius:${props => props.size}px;
   background-color:${props => props.bgColor}; 
      
`;

const StyledMainView = styled.View`
                    flex: 1; 
                    min-height:100px; 
                    width:100%;  
                          
                `;
const ContentWrapperView = styled.View`
                flex: 1;
               
                flex-direction:row; 
                background-color:transparent;
                padding:15px;
                border-radius:15px; 
                align-items:center;                
            `;
const NameText = styled.Text`
     color:${props => props.theme.textColor || 'yellow'}; 
     font-weight:bold; 
     padding-bottom:10px; 
     font-size:18px;                    
`;
const CommentText = styled.Text`
     color:${props => props.theme.textColor || 'yellow'}; 
                 
`;
// background-color:#c0e2c0;