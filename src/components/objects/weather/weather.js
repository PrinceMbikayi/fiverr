import React from 'react';
import { View,Text,StyleSheet,ImageBackground,Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import PureIconRender from '_components/pureIconRender';
import styled from 'styled-components/native'

import { useTheme } from '_theming/themeProvider';
import { useObject } from '_hooks/object';

export const TypeWeather= (props) => {
    const { t, i18n } = useTranslation();
   // const { navigation,statuses} = props;

    const { itemId,typeName : realTypeName,newIcon} = props;
    const uObject = useObject(itemId);
    const {objectDatas,widgetReferenceDatas,statuses,name,connected,status,getStatus : getMyStatus,execute,toggle} = uObject;



    const {theme} = useTheme();
    const iconSize = 100;
    const iconColor = theme['card--color--icon'];
    const textColor = theme['card--color--text'];
    
    return (
            <StyledMainView style={{flexDirection:'row'}}> 
                <View style={{flex:1,flexDirection:'column'}}>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>                                
                            <PureIconRender size={iconSize} img={'sky_'+statuses.sky_icon+'.svg'} fill={iconColor} imageIsStatus={true}/>              
                            <TemperatureText color={textColor} >{Math.round(statuses.temperature)} °C</TemperatureText>
                    </View>
                    <View style={{flex:1,flexDirection:'row',alignItems:"center",justifyContent:"space-around"}}>
                        <View style={{flexDirection:'row',alignItems:"center",justifyContent:"center"}}>
                            <PureIconRender size={16} img={'raingauge'+'.svg'} fill={iconColor} />   
                            <Text style={{color:textColor,marginLeft:5}}>{statuses.humidity} %</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:"center",justifyContent:"center"}}>
                            <Image source={require("_images/weather/barometer.png")} style={{height:16,width:16,tintColor:iconColor}}/> 
                            <Text style={{color:textColor,marginLeft:5}}>{statuses.pressure}</Text>
                        </View>
                    </View>
                </View> 
                <View style={{flex:1,flexDirection:'column'}}>
                    <View style={[styles.infoLine]}>
                        <Image source={require("_images/weather/soleil.png")} style={[styles.icon,{tintColor:iconColor}]}/>
                        <Text style={{color:textColor}}>{statuses.sunrise}</Text>
                    </View>
                    <View style={[styles.infoLine]}>
                        <Image source={require("_images/weather/lune.png")} style={[styles.icon,{tintColor:iconColor}]}/>
                        <Text style={{color:textColor}}>{statuses.sunset}</Text>
                    </View>
                    <View style={[styles.infoLine]}>
                        <Image source={require("_images/weather/wind.png")}style={[styles.icon,{tintColor:iconColor}]} /> 
                        <Text style={{color:textColor}}>{statuses.wind_speed}</Text>
                    </View>
                </View> 
               
            </StyledMainView>
    )
}
/**
 * @component
 * @attr {number} size
 * 
 */
const StyledMainView = styled.View`
                    flex: 1;
                    min-height:150px;
                   
                `;
const TemperatureText = styled.Text`
                color:${props => props.color || "#000000" };
                font-size:22px;
                font-weight:bold;


`;
const styles = {
    icon : {
        width:32,
        height:32,
        marginRight:32
    },
    infoLine : {
        flex:1,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    }
}
