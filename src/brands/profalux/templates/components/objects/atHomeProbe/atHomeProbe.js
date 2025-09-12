import React from 'react';
import {useEffect,useState} from 'react';
import { View,Text, Platform } from 'react-native';
import styled from 'styled-components/native'
import { useTranslation } from 'react-i18next';

import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import PureIconRender from '_components/pureIconRender';

export const TypeAtHomeProbe= (props) => {

    //const {statuses} = props;
    const { itemId,typeName : realTypeName,newIcon} = props;

    const uObject = useObject(itemId);
    const {objectDatas,widgetReferenceDatas,statuses,name,connected,status,getStatus : getMyStatus,execute,toggle} = uObject;




    const { t} = useTranslation();  
    const {theme} = useTheme();  
    const iconColor = theme['card--color--icon'];
    const textColor = theme['card--color--text'];
    const [temperature,setTemperature] = useState('--');
    const [humidity,setHumidity] = useState('--');   
    const androidBaselineStyle = (Platform.OS == 'android' ) ? {paddingBottom:0,backgroundColor:'transparent',top:-16} : {};  
    
    useEffect(() => {      
        if(statuses.temperature) {
          setTemperature(""+(Math.round(statuses.temperature) || "--"));
        }
        if(statuses.humidity) {
            setHumidity(""+(Math.round(statuses.humidity) || "--"));
        }
       
    }, [statuses]);


    return (
            <StyledMainView > 
                  <Text style={{textAlign:'center'}}>Umii Dev Component !!</Text>
                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                  
                    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <View style={{flexDirection:'row'}}>
                        <View style={[{alignSelf:'baseline',marginRight:5},androidBaselineStyle]}>
                                <PureIconRender   size={28} img={'sondeObject'+'.svg'} fill={theme['card--color--icon']}/>   
                            </View> 
                            <TemperatureText style={{alignSelf:'baseline',backgroundColor:'transparent',color:textColor}}>{temperature}</TemperatureText>
                            <UnitText style={{color:textColor}} >°C</UnitText>
                        </View>       
                    </View>
                    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <View style={{flexDirection:'row'}}>
                        <View style={[{alignSelf:'baseline',marginRight:5},androidBaselineStyle]}>
                                <PureIconRender  size={28} img={'raingauge'+'.svg'} fill={theme['card--color--icon']}/>   
                            </View> 
                            <TemperatureText style={{alignSelf:'baseline',color:textColor}}>{humidity}</TemperatureText>
                            <UnitText style={{color:textColor}}>%</UnitText>
                        </View>       
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
                font-size:60px;
                font-weight:normal;
                
`;

const UnitText = styled.Text`
    align-self:flex-start;
    margin-top:10px;
    font-size:20px;
    opacity:0.6;

`;
