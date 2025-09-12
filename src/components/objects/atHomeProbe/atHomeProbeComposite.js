import React from 'react';
import {useEffect,useState} from 'react';
import { View,Text,StyleSheet,ImageBackground,Image,Platform } from 'react-native';
import styled from 'styled-components/native'
import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import PureIconRender from '_components/pureIconRender';
import {getObjectDatas} from '_helpers/objects';

export const TypeAtHomeProbeComposite = (props) => {

    const {statuses,components} = props;
    const { t} = useTranslation();  
    const {theme} = useTheme();  
    const iconColor = theme['card--color--icon'];
    const textColor = theme['card--color--text'];
    const [temperature,setTemperature] = useState('--');
    const [humidity,setHumidity] = useState('--');   
    const androidBaselineStyle = (Platform.OS == 'android' ) ? {paddingBottom:0,backgroundColor:'transparent',top:-16} : {};  
    const [mounted,setMounted] = useState(false);
    //const [components,setCommponants] = useState([]);
    const [selected,setSelected] = useState([]);
    

    useEffect(() => {      
        setMounted(true);
        
        const testo = props.components.reduce((r,v,i) => {
           
            r.push(getObjectDatas(v,['statusDictionary','name']));
            return r
        },[])
      
        setSelected(testo);
    }, []);
    
    useEffect(() => {      
        if(statuses.temperature) {
          setTemperature(""+(Math.round(statuses.temperature) || "--"));
        }
        if(statuses.humidity) {
            setHumidity(""+(Math.round(statuses.humidity) || "--"));
        }
       
    }, [statuses]);

    const aSingleProbe = (name,singleTemperature,singleHumidity) => {
        console.log("aaaaaaaaaaaaaaaaaa")
        return (
            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',border:5,borderColor:'orange',backgroundColor:"green"}}>
            <View>
                <Text>{name}</Text>
            </View>
            <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                <View style={{flexDirection:'row'}}>
                    <View style={[{alignSelf:'baseline',marginRight:5},androidBaselineStyle]}>
                        <PureIconRender  size={28} img={'sondeObject'+'.svg'} fill={theme['card--color--icon']}/>   
                    </View> 
                    <TemperatureText style={{alignSelf:'baseline',backgroundColor:'transparent',color:textColor}}>{isNaN(singleTemperature) ? "--":Math.round(singleTemperature)}</TemperatureText>
                    <UnitText style={{color:textColor}} >°C</UnitText>
                </View>       
            </View>
            <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                <View style={{flexDirection:'row'}}>
                <View style={[{alignSelf:'baseline',marginRight:5},androidBaselineStyle]}>
                        <PureIconRender  size={16} img={'raingauge'+'.svg'} fill={theme['card--color--icon']} />   
                    </View> 
                    <TemperatureText style={{alignSelf:'baseline',color:textColor}}>{isNaN(singleHumidity)? "--": Math.round(singleHumidity)}</TemperatureText>
                    <UnitText style={{color:textColor}}>%</UnitText>
                </View>       
            </View>                    
        </View>

        )
    }


    return (
            <StyledMainView >                 
                {
                    selected.map((v) => {
                        return (
                            <View>
                                {
                                    aSingleProbe(v.name,v.statusDictionary.temperature,v.statusDictionary.humidity)
                                }
                            </View>
                        )
                        
                    })
                }
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
                font-size:30px;
                font-weight:normal;
                
`;

const UnitText = styled.Text`
    align-self:flex-start;
    margin-top:10px;
    font-size:20px;
    opacity:0.6;

`;
