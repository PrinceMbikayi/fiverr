import '_brand/templates/components/locales'
import React, { Component, useEffect, useState} from 'react';
import { View, Text ,StyleSheet,TouchableOpacity, Pressable, Alert} from 'react-native';
import { getUser, getUserDefaultWeather, getObjectsByTypeName} from '_helpers/selectors';
import { useStore,useSelector,useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-root-toast';
import { myToast } from '_brand/templates/components/ui/myToast';



export const TabButtonComponent = (props) => {
   
    const {selected, index, textColor, label, callback, userHasWeather} = props;

    const [isWeatherTouched, setIsWeatherTouched] = useState(false);

    const weathers = useSelector(state => getObjectsByTypeName(state, 'WeatherSupport') || []);
    //const weathers = myWeathers.map(Number)
    const defaultUserWeather = useSelector(state =>getUserDefaultWeather(state));
    const userWeather = Number(defaultUserWeather);
    console.log('METEO_AUBE_BOUTON :', typeof(userWeather), weathers);

    const { t, i18n } = useTranslation();
    const tns = "components";

    useEffect(()=> {
       // console.log('IS_WEATHER_TOUCHED :', isWeatherTouched);
    },[isWeatherTouched]);

    const handleCallback = ()=>{
        console.log('TYPE_SELECTED :',index,  isWeatherTouched);
        //console.log('TYPE_SELECTED :',index, label, userWeather, isWeatherTouched);
        callback(index)
    }

    const handleTouch = ()=>{
        console.log('IS_WEATHER_TOUCHED_1 :',index, isWeatherTouched, userWeather, weathers);
        //console.log('TYPE_SELECTED_Button_touched :', userWeather, );
        if(index == 1 || index == 2){
            setIsWeatherTouched(true)

            if((userWeather && userWeather != "" && userWeather != 0 && userWeather!= -1)){
                // check if this user fav weather are in weather list 
                if(weathers.includes(userWeather)){
                    // Cool you have local weather so you can create a planning routine
                    // DO NOTHING. in this case
                }else{
                    console.log('Haaa');
                    myToast(`${t(tns + ":" + "CONFIG_WEATHER")}`)
                }
            }else{
    
                myToast(`${t(tns + ":" + "CONFIG_WEATHER")}`)
            }
        }
    }
    return (

        <Pressable 
            onPress={handleCallback}
            disabled={(userWeather && userWeather != "" && userWeather != 0 && userWeather !=-1 && weathers.includes(userWeather)) ? false : true}
            onTouchStart={handleTouch}
            style={{    
            backgroundColor: selected ? 'white' : 'transparent',
            flex:1, padding:8,borderRadius:10, width:'90%', justifyContent:'center', alignItems:'center', flexDirection:'row',
        }}>
        <Text style={{color:textColor}}>{label}</Text>
    </Pressable>

    )      
}