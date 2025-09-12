import './locales'
import React from "react";
import {  useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet, Dimensions, StatusBar} from "react-native";
import axios from "axios";

import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useTheme } from "_theming/themeProvider";
import { useObject } from "_hooks/object";
import { ForcastDays } from "./ForcastDays";
import { getServer as getStoredServer } from '_services/storage';

export const WeatherDetails = (props) => {


  const { itemId, typeName: realTypeName, newIcon } = props;

  const [typeGraph, setTypeGraph] = useState();
  const [town, setTown] = useState('');
  const typeGraphList = [
    {key:1, value:'Temperature'},
    {key:2, value:'Humidity'},
    //{key:3, value:'Precipitation'},
    {key:3, value:'Wind speed, direction'},
  ]

  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};
  const {ItemIdComingFromFavHeader} = navigationParams;
  console.log(" ItemIdComingFromFavHeader :", ItemIdComingFromFavHeader)

  console.log("PROPS :", props);
  const transfertItemId = ItemIdComingFromFavHeader;
  const uObject = useObject(transfertItemId);
  const typeName = uObject?.objectDatas?.typeName;
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get('window').width;
  //console.log("DIMENSION SCREEN :", screenWidth, screenHeight)
  const { t, i18n } = useTranslation();
  const tns="weather";


  
  const {theme } = useTheme();

  const {
    objectDatas,
    widgetReferenceDatas,
    statuses,
    name,
    connected,
    status,
    getStatus: getMyStatus,
    execute,
    toggle,
  } = uObject;

  useEffect(()=>{
    console.log("OBJECTID , typeName :", uObject, typeName)
  })

  //const activeStatusesImages = Assets.getStatusesIcons(objectDatas.id) || [];


  const getServerUrl = async () => {

    const serverUrl = await getStoredServer() || AppConfig.SERVER_URL
    return serverUrl;
  
  }

  const borderColor = theme?.prflxBorderColor||'orange';
  const Containerbgcolor = theme?.prflxContaintBgColor||'white';
  const bgcolor = theme?.prflxbgColor||'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
  const textColor = theme?.prflxTextColor||'black'
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'



  useEffect(()=>{
    
    // const baseUrl =  `https://profalux.avidsen.one/services/durin/my/data/6051`
    // const fetchData = async () => {
    // const response = await axios.get(baseUrl);
    // console.log("RESULTAT BASE :", response)
    // }

    // fetchData()

  },[])



  const goBack = () => {

    navigation.goBack();
}

useEffect(()=>{
  //console.log("TYPE GRAPH :", typeGraph)
},[typeGraph])

let skyStatus;
let fixSkyStatus;
let textSkyStatus;
  if(typeGraph == 1){
    (skyStatus = "sky_" + statuses?.sky_icon + ".svg");
    textSkyStatus = Math.round(statuses?.temperature) +'°C'
  }
  if(typeGraph == 2){
    (fixSkyStatus = require('_brand/images/icons/app/humidity.png') );
    textSkyStatus = statuses?.humidity + '%'
  }
  // if(typeGraph == 3){
  //   (fixSkyStatus = require('_brand/images/icons/app/rain.png') );
  //   textSkyStatus= statuses?.
  // }
  if(typeGraph == 3) {
    (fixSkyStatus = require('_brand/images/icons/app/wind.png') );
    textSkyStatus = statuses?.wind_speed + 'km/h'
  }


  const getWeatherTown = (town)=>{
    console.log("TOWN :", town)
    setTown(town)
  }
  useEffect(()=>{

  },[town])


  
  return(
    <SafeAreaView style={{height:'100%', backgroundColor:'white'}}>
        <StatusBar no_hidden={true} barStyle="dark-content"/>
    

    <View style={{flex:5, backgroundColor:'white',}}>
            <View style={{backgroundColor:'transparent' || headerBgColor, alignItems:'center',justifyContent:'flex-end'}}>
                    <HeaderWithBack
                        //title={uObject.name}
                        title={`${t(tns+":"+"WEATHER_LOCAL")} - `+ town}
                        backSVG centered
                        goBack={{ action: goBack }}
                        noShadow    
                    />
            </View>
        <ScrollView style={{flex:1, backgroundColor:bgcolor, width:screenWidth, paddingHorizontal:0.1*screenWidth/4}}>
          <View style={[styles.bodyWrapper,{backgroundColor:Containerbgcolor, borderColor:borderColor, marginBottom:20}]}>
            <View style={{marginBottom:15}}>
              <ForcastDays weatherId = {transfertItemId} getWeatherTown ={getWeatherTown}/>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView> 

)

}

const styles = StyleSheet.create({
    bodyWrapper:{
      justifyContent:'center',
      paddingHorizontal:0,
      borderWidth:2, 
      borderRadius:12,
      paddingVertical:5,
      marginTop:10,
  },
  containerWrapper: {
      flexDirection: 'column',
      backgroundColor: 'transparent',
  },
  validateButton: {
      color:"#FFFFFF",
      height: 50,
      marginBottom:40,
  },
})
