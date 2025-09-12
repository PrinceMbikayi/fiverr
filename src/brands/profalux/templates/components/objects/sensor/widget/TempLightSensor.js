import '_brand/templates/components/objects/common/locales'
import React from 'react';
import { View,Text,Pressable, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';


import styled from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';
import {iconsJs} from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";

export const TempLightSensor = (props) => {    

    const {itemId} = props;
    const uObject = useObject(itemId);
    const name = uObject?.name
    //console.log("UOBJECT CAPTEUR :", uObject)
    const statuses = uObject?.statuses
    const temperature = statuses?.temperature;
    const illumi = statuses?.illuminance

    const approxTemp = temperature!=undefined ? Math.round(temperature): "--"
    const illuminance = illumi!=undefined ? illumi: "--"





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
            <Pressable disabled={true} onPress={() => console.log("Tuile Pressed")} style={{flex:1,flexDirection:'column' ,justifyContent:'center', alignItems:'flex-start', marginHorizontal:-10,borderRadius:12,paddingBottom:0}}>
                <Text 
                        numberOfLines={1} ellipsizeMode='tail'
                        style={{alignItems:'flex-start', justifyContent:'flex-start' ,backgroundColor:'transparent',
                        fontSize:14, fontWeight:"400", color:textColor, marginBottom:5, marginLeft:18}}
                    >
                                {name}
                </Text>
                <View style={{
                        flex:1,width:'100%',backgroundColor:'transparent' ,flexDirection:'row', alignItems:'center', 
                        justifyContent:'space-between', borderRadius:12,
                        }}>
                    <View style={{flexDirection:'column', justifyContent:'space-between', alignItems:'center', marginLeft:15, backgroundColor:'transparent'}}>
                        <MultiPurposeWidgetLine 
                                isPressable = {false}
                                icons={[iconsJs.sensorTLIcon]} 
                                iconSize={35}
                                //onPress = {handleIconPress} 
                                //onLongPress = {handleIconPress}
                                //active = {sendCurrentActive}
                                iconWrapperStyle = {[{borderColor:textColor}]}
                                iconGroupWrapperStyle = {[{ alignItems:'center', justifyContent:'center', borderColor:'transparent', borderWidth:1, backgroundColor:'transparent'}]}
                                isShadow = {false}
                                />
                    </View>
                    <View style={{flex:1,paddingHorizontal:0, marginLeft:5, justifyContent:'center', alignItems: 'center', backgroundColor:'transparent'}}>
                        {temperature &&
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:14, fontWeight:'700'}}>{approxTemp} </Text>
                                <Text style={{fontSize:14, fontWeight:'300'}}>°C</Text>
                            </View>

                        }
                        {illumi &&
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:14, fontWeight:'700'}}>{illuminance}</Text>
                                <Text style={{fontSize:14, fontWeight:'300'}}> lux</Text>
                            </View>
                        }
                    </View>
                </View>
                    
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    container : {
        flex:1,
        justifyContent:'center',
        alignItems:'flex-start',
        flexDirection:'column',
        //marginHorizontal:15,
        marginVertical:5,
        height:70,
        //paddingVertical:20
    },
    iconDisplay:{
        flexDirection:'row',
        marginRight:35,
        marginLeft:20,
        marginTop:5,
        marginBottom:10,
        borderWidth:1,
        borderRadius:7,
        justifyContent:'space-evenly'
        //backgroundColor:'white'
    },
    groupIconWrapper:{
        flexDirection:'row',
        backgroundColor:'transparent'
    },
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