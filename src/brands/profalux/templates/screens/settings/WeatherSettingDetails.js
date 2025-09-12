import "_brand/templates/screens/settings/locales"
import React, {useEffect} from 'react';
import { useStore, useSelector, useDispatch} from 'react-redux';
import { View, Text, Platform} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import {IconRender} from "_brand/templates/components/objects/weatherSupport/IconRender";
import { getUser} from '_helpers/selectors';
import { refreshObjectAction } from '_actions/asyncActions';



export const WeatherSettingDetails = (props)=>{

    const {itemId} = props
    const { t, i18n } = useTranslation(); 
    const tns = "settings";
    const store = useStore()


    const userDetails = useSelector(state =>getUser(state));
    console.log("USER_DETAILS :", userDetails)
    const {theme} = useTheme();
    const textColor = theme?.prflxTextColor||'black'
   

    const uObjectWeather = useObject(itemId)
    console.log('DETAILS_WEATHER :',itemId, uObjectWeather);

    const statuses= uObjectWeather?.statuses
    const weatherTown = uObjectWeather?.name;
    const temperature = Math.round(statuses?.temperature);
    const humidity = statuses?.humidity;
    const pressure = statuses?.pressure;
    const wind = statuses?.wind_speed;

    useEffect(()=> {
        const refreshObject = async(id)=>{
            await refreshObjectAction(id,store).catch((err) => console.log(err)); 
        }
        if(itemId && itemId !=-1){
            refreshObject(itemId)
        }
    },[]);

    return(
        <View 
        style={{
                flexDirection:'row', borderColor:'orange', borderWidth:1, borderRadius:12, 
                justifyContent:'space-evenly', backgroundColor:'white',
                width:'100%', padding:10,
            }}
        >
                <View style={{justifyContent:'center', padding:5,flex:1, backgroundColor:'transparent'}}>
                    <Text numberOfLines={3} ellipsizeMode='tail' style={{fontSize:Platform.OS === "ios"? 18:16, fontWeight:'700', flexWrap:'wrap', color:textColor}}> {weatherTown}</Text>
                </View>
                <View>
                    <IconRender
                    size={60}
                    isImgSource = {true}
                    img = {"sky_" + statuses?.sky_icon + ".svg"}
                    fill={textColor} //'#FDAA0B'
                    imageIsStatus={true}
                    />
                </View>
                <View style={{justifyContent:'center', padding:5}}>
                    <Text style={{fontSize:20, fontWeight:'600', color:textColor}}>{temperature? temperature: '-'} °C </Text>
                </View>
                <View style={{justifyContent:'center'}}>
                    <Text style={{fontSize:13, fontWeight:'600', paddingVertical:5, color:textColor}}> {t(tns + ":" + "WEATHER_HUMIDITY")} : {humidity ? humidity :'-'} %</Text>
                    <Text style={{fontSize:13, fontWeight:'600', color:textColor}}> {t(tns + ":" + "WEATHER_WIND_SPEED")} : {wind?wind:' - '} km/h</Text>
                    <Text style={{fontSize:13, fontWeight:'600', paddingVertical:5, color:textColor}}> {t(tns + ":" + "WEATHER_PRESSURE")} : {pressure ? pressure :' -'}</Text>
                </View>
    </View>
    )

}