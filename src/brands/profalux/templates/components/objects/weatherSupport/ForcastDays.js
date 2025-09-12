import "./locales"
import React, { useEffect, useState } from "react";
import { View, Text, Image} from "react-native";
import { useTranslation } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';

import { useObject } from "_hooks/object";
import { useTheme } from "_theming/themeProvider";
import styled from "styled-components/native";
import {IconRender} from "_brand/templates/components/objects/weatherSupport/IconRender";

import { CardWeather } from "./CardWeather";

/**
 *
 * @param {itemId} props
 * @returns
 */
export const ForcastDays = (props) => {
  const {weatherId, getWeatherTown}  = props;


  const { t, i18n } = useTranslation(); 
  const tns = "weather";

  console.log("FORCAST PROPS :", props)
  const weatherObject = useObject(weatherId);
  const { name, statuses } = weatherObject;

  const sendweatherTown = ( weatherTown)=>{
    getWeatherTown(weatherTown)
  }
  useEffect(()=>{
    sendweatherTown(name)
  })

  console.log("WEATHER DATA  TO FILTER :", weatherObject)

  let forcastDays = [];
  forcastDays[0] = {  
      day:"Auj", 
      humidity: statuses?.humidity,
      pressure: statuses?.pressure,
      sky: statuses?.sky,
      sky_icon : statuses?.sky_icon,
      temperature: statuses?.temperature,
      //temperature_min: statuses?.temperature,
      wind_direction: statuses?.wind_direction,
      wind_gust: statuses?.wind_gust,
      wind_speed: statuses?.wind_speed,
    };
  Object.keys(statuses).forEach((key) => {
    const testKey = key;
    const regex = /\[([^\]\[\r\n]*)\]/gm;

    const keyIndex = regex.exec(testKey)?.[1] || null;
    //console.log("Key Index : ", keyIndex);
    if (keyIndex) {
      const l = keyIndex.length + 2;
      const onlyKey = testKey.substring(0, testKey.length - l);
      const value = statuses[key];
      if (forcastDays[keyIndex] == undefined) forcastDays[keyIndex] = {};
      forcastDays[keyIndex][onlyKey] = value;
      //console.log("Key Index : ", keyIndex, onlyKey, statuses[key]);
    }
  });
  //console.log("ForCastDays :", forcastDays);

  

  const { theme } = useTheme();
  const iconSize = 80;
  const iconColor = theme["card--color--icon"];

  const borderColor = theme?.prflxBorderColor||'orange';
  const Containerbgcolor = theme?.prflxContaintBgColor||'white';
  const bgcolor = theme?.prflxbgColor||'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
  const textColor = theme?.prflxTextColor||'black'
  const nonConnectedGray = theme?.prflxNonConnectedGray || '#CCC'
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'



  // Moment with Locale   
  let currentLang = i18n.language;
  if (currentLang == "en") currentLang += "-gb";
  moment.locale(currentLang);
  //console.log("Curent Lang: ", currentLang);
  const wd = moment.weekdays(true);
  //console.log("Moment Days :", wd);

  const today = moment().format("dddd");
  const tomorrow = moment().add(1, "day").format("dddd")
  //console.log("TODAY :", today, tomorrow);


// program to convert first letter of a string to uppercase
function capitalizeFirstLetter(str) {

  // converting first letter to uppercase
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

  return capitalized;
}

  const PrevDisplay = (props)=>{
    const {weatherFactor, factorValue, factorIcon, iconColor, isTemperatureStatus} = props;

    return(
      <View style={{flex:1, width:'45%', justifyContent:'center', backgroundColor:'transparent', paddingHorizontal:10, marginTop:20}}>

        <View>
          <Text style={{fontSize:18, fontWeight:'400', color:textColor}}> {weatherFactor} </Text>
        </View>

        <View style={{justifyContent:'flex-start', alignItems:'center', flexDirection:'row', backgroundColor:'transparent', marginTop:5}}>
          <View>
            <IconRender
              size={45}
              img={isTemperatureStatus ? factorIcon : null}
              //img = {factorIcon}
              isImgSource = {true}
              imgSource = {factorIcon}
              fill={textColor} //'#FDAA0B'
              imageIsStatus={true}
            />
          </View>
          <View>
            <Text style={{fontSize:20, fontWeight:'600', color:textColor}}> {factorValue} </Text>
          </View>
        </View>

      </View>
    )
  }

  const [clickIndex, setClickIndex] = useState(0);
  const [weatherData, setWeatherData] = useState(forcastDays[0]);

  const getTemperature = (Math.round((Number(weatherData?.temperature_max) + Number(weatherData?.temperature_min))/2) || Math.round(weatherData?.temperature))
  const humidity = weatherData?.humidity;
  const pressure = weatherData?.pressure;
  const wind = weatherData?.wind_speed;

  const handleCardPress = (currentActive, item)=>{
    setClickIndex(currentActive);
    console.log("Pressed card index : ", currentActive, item)
    setWeatherData(item);
  }

  useEffect(()=>{

  }, [clickIndex])
  
  useEffect(()=>{
    //console.log("MY WEATHER DATA :", weatherData.humidity)
  }, [weatherData])

    const shadow = {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      elevation: 5,
      shadowColor: '#000000',
    }

  return (

    <View style={{flex:1, justifyContent:'center', }}>
        <View style={{flexDirection:'row', flex:1, justifyContent:'space-evenly', marginTop:10,alignItems:'center'}}>
          {forcastDays.map((item, index, forcastDays) => {
            const eachDay = moment().add(index, "day").format("dddd")
            //console.log("EACH DAY :", item, index)
            const firstThree = (eachDay).substring(0,3) // myString.substring(0,3). return only first 3 characters
            //console.log("LAST ELEMENT :", index===forcastDays.length-1)
            
            // Remove last day from forcast
            if(index!==forcastDays.length-1){
              return (
                <View style={{ marginBottom: 10, borderColor:"orange",shadow:shadow,elevation:5, borderWidth:index===clickIndex?1:0, borderRadius:8}} key={index}>
                    <CardWeather
                      currentActive = {index}
                      onPress = {(currentActive)=>handleCardPress(currentActive,item)}
                      dayPrev = { capitalizeFirstLetter(firstThree)+'.' }
                      skyPrev = {"sky_" + (index==0?statuses?.sky_icon: item.sky_icon) + ".svg"}
                      maxTempPrev = {index==0? Math.round(statuses?.temperature) : item.temperature_max}
                      minTempPrev = {index==0? null : item?.temperature_min}
                      cardStyle={index === clickIndex ? 'white':nonConnectedGray}
                      dayStyle={{color:textColor}}
                      fontWeight={index===clickIndex?"600":"400"}
                      //dayStyle={{color:index === clickIndex? 'white' : textColor}}
                      iconStyle={textColor}
                      tempStyle = {textColor}
                    />
                    
                </View>

              );
            }


          })}
        </View>

        {clickIndex == 0 &&
          <View style={{flex:1, flexDirection:'row', backgroundColor:'transparent', justifyContent:'space-around', alignItems:'center', marginTop:20, width:'100%'}}>
                    <View style={{flexDirection:'row'}}>
                      <View style={{backgroundColor:'transparent', justifyContent:'flex-end', marginBottom:5, marginRight:15}}>
                        <Image source={require('_brand/images/icons/app/sun-rise.png')} style={{width: 24, height: 24}}/>
                      </View>
                      <View>
                        <Text style={{fontSize:14, fontWeight:'400', color:textColor}}>{t(tns+":"+"SUN_RISE")}</Text>
                        <Text style={{fontSize:16, fontWeight:'400', color:textColor}}>{statuses?.sunrise}</Text>
                      </View>
                    </View>

                    <View style={{flexDirection:'row'}}>
                      <View style={{backgroundColor:'transparent', justifyContent:'flex-end', marginBottom:5, marginRight:15}}>
                        <Image source={require('_brand/images/icons/app/sun-set.png')} style={{width: 24, height: 24}}/>
                      </View>
                      <View>
                        <Text style={{fontSize:14, fontWeight:'400', color:textColor}}>{t(tns+":"+"SUN_SET")}</Text>
                        <Text style={{fontSize:16, fontWeight:'400', color:textColor}}>{statuses?.sunset}</Text>
                      </View>
                    </View>

            </View>
          }

          <View style={{marginTop:50, paddingHorizontal:15}}>
            <Text style={{fontSize:18, fontWeight:'600', color:textColor}}> 
              {clickIndex == 0 ? `${t(tns+":"+"WEATHER_NOW")}` : `${t(tns+":"+"WEATHER_MEAN")}`} 
            </Text>
          </View>
          
          <View style={{justifyContent:'space-between', alignItems:'center', marginRight:-30}}>
            <View style={{justifyContent:'center', flexDirection:'row', alignItems:'center'}}>
              <PrevDisplay
                weatherFactor={t(tns+":"+"TEMPERATURE")}
                isTemperatureStatus = {true}
                factorIcon = {"sky_" + statuses?.sky_icon + ".svg"}
                factorValue={getTemperature ? getTemperature + '°C' : ' - °C'}
              />
              <PrevDisplay
                weatherFactor={t(tns+":"+"HUMIDITY")}
                factorIcon = {require('_brand/images/icons/app/humidity.png')}
                factorValue={humidity ? humidity + '%' : ' - %'}
              />
            </View>
            <View style={{justifyContent:'center', flexDirection:'row', alignItems:'center'}}>
              <PrevDisplay
                weatherFactor={t(tns+":"+"PRESSURE")}
                factorIcon = {require("_images/weather/barometer.png")}
                //factorIcon = {require('_brand/images/icons/app/barometer.png')}
                factorValue={pressure? pressure : '-'}
              />
              <PrevDisplay
                weatherFactor={t(tns+":"+"WIND")}
                factorIcon={require('_brand/images/icons/app/wind.png')}
                factorValue={wind ? wind + 'km/h' : ' - km/h'}
              />
            </View>
          </View>
    </View>
  );
};


const StyledMainView = styled.View`
  flex: 1;
`;
const TemperatureText = styled.Text`
  color: ${(props) => props.color || "#000000"};
  font-size: 15px;
  font-weight: 400;
`;
const styles = {
  icon: {
    width: 32,
    height: 32,
    marginRight: 32,
  },
  infoLine: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
};