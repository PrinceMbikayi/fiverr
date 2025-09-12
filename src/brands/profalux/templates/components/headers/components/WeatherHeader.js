import '_brand/templates/components/locales'
import React, { useEffect } from 'react';
import { View, Text, Pressable, Dimensions} from 'react-native';
import { useStore } from 'react-redux';

import { useTheme } from '_theming/themeProvider';
import { useTranslation } from 'react-i18next';

import { useObject } from '_hooks/object';
import { useNavigation } from '@react-navigation/native';
import { IconRender } from "_brand/templates/components/objects/weatherSupport/IconRender";

//--- Appium -----
import { refreshObjectAction } from '_actions/asyncActions';





export const WeatherHeader = (props) => {
    

    const {id} = props;
    const { theme } = useTheme();

    const { t, i18n } = useTranslation();
    const tns = "components"

    const store = useStore()


    const navigation = useNavigation();  //v5 
    const textColor = theme?.prflxTextColor || 'black'



    console.log('VOIR_ID_WEATHER_1 :', id);
    const uObjectWeather = useObject(id)
    console.log('VOIR_ID_WEATHER_2 :');//, uObjectWeather);
    const statuses = uObjectWeather?.statuses
    const temperature = statuses?.temperature
    const sky = statuses?.sky_icon;
    const userTown = uObjectWeather?.name


    useEffect(() => {
    }, [statuses]);

    useEffect(() => {
        console.log('VOIR_ID_WEATHER_IN_EFFECT :', id);
        if (id != -1){
            setTimeout(() => {
                refreshObjectAction(id, store).catch((err) => console.log(err));
            }, 1000)
        }
    }, [id]);



    const openWeatherDetails = () => {

        if (id) {
            navigation.navigate('WeatherDetails', { ItemIdComingFromFavHeader: id });
        } else {
            navigation.navigate('Settings', { screen: 'MeteoSettings' })
        }
    }


    return (
        <View style={{width:'100%', height:'100%', backgroundColor:'transparent', flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{width:'68%',height:'100%', backgroundColor:'transparent', justifyContent:'center'}}>
                <Text 
                    numberOfLines={1} 
                    ellipsizeMode='tail' 
                    style={{ color: textColor,width:'100%', fontSize: 21, fontWeight: '600', backgroundColor: 'transparent', }}
                    >
                        {temperature ? userTown : `${t(tns+":"+"FAVORITE")}` }
                </Text>
            </View>

            <View  style={{width:'30%',height:'100%', backgroundColor:'transparent', justifyContent:'center' }}>
                <Pressable
                        onPress={openWeatherDetails}
                        disabled={temperature ? false : true}
                        style={{flexDirection:'row'}}
                    >
                        <View style={{width:'50%', height:'100%', backgroundColor:'transparent', marginRight:3}}>
                            {sky &&
                                    <IconRender
                                        size={40}
                                        isImgSource={true}
                                        img={sky ? "sky_" + sky + ".svg" : null}
                                        fill={textColor} //'#FDAA0B'
                                        imageIsStatus={true}
                                    />
                                }
                        </View>

                        <View style={{width:'47%', height:'100%', backgroundColor:'transparent',justifyContent:'center', flexDirection:'row', alignItems:'center'}}>
                            <Text style={{ fontSize: 20, fontWeight: '600', color:textColor }}>{temperature ? Math.round(temperature) : ''}</Text>
                            <Text style={{ fontSize: 16, fontWeight: '400', color:textColor }}> {temperature ? '°C' : ''} </Text>
                        </View>

                </Pressable>
            </View>
        </View>

    )
}
