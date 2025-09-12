import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect, useRef} from 'react';
import { Text,TextInput, View, Pressable, ScrollView, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider'
import Slider, { SliderProps } from '@react-native-community/slider';


export const EmojiSlider = (props)=>{

    const {sliderTitle, LeftPicto, RightPicto, MiddlePicto, iconSize, callBackSliderValue, initialBrightness} = props
    const initLux = initialBrightness == "*" ? 5000 : initialBrightness
    const [luxValue, setLuxValue] = useState(initLux);

    const tns = "routine";
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'

    useEffect(()=> {
        console.log('LUX_VALUE_CHANGED :', luxValue);
    },[luxValue]);

    const handleChange = (value) =>{
        console.log('SLIDER_VALUE :', value);
        //setLuxValue(value)
        callBackSliderValue(value)
    }

    const handleSetLuxThreshold = (value) =>{
        console.log('LUX_VALUE :', value);
        setLuxValue(value)
        callBackSliderValue(value)
    }

    return(
        <View style={{justifyContent:'center', alignItems:'center'}}>
            <View>
                <Text style={{fontSize:16, fontWeight:"400", color:textColor}}>{sliderTitle}</Text>
            </View>
            <View style={{marginTop:10, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <TextInput
                    value={luxValue}
                    defaultValue={`${luxValue}`}
                    //onChangeText={handleSetLuxThreshold}
                    //blurOnSubmit={true}
                    //number-pad //only integer (other types : numeric, decimal-pad, phone-pad...)
                    editable={false}
                    //keyboardType="numeric"
                    textAlign="center"
                    style={{padding:5, backgroundColor:'#EDEDED', 
                            fontSize:16, borderRadius:7,minWidth:120, color:textColor
                        }}
                    />
                    <Text style={{fontSize:16, fontWeight:'400',color:textColor}}>Lux</Text>
            </View>

            <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'transparent', marginTop:20}}>
                <View style={{width:iconSize, height:iconSize}}>
                        <MiddlePicto color={textColor}/>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-evenly',alignItems:'center', backgroundColor:'transparent'}}>
                    <View style={{width:iconSize, height:iconSize,marginRight:15}}>
                        <LeftPicto color={textColor}/>
                    </View>
                    
                            <Slider
                                style={{flex:1, width: "100%", height:40}}
                                minimumValue={1000}
                                maximumValue={15000}
                                value={Number(luxValue)}
                                step ={100}
                                thumbTintColor="orange"
                                minimumTrackTintColor="orange"
                                onValueChange={(value)=>setLuxValue(value)}
                                onSlidingComplete={handleChange}
                            />
                    <View style={{width:iconSize, height:iconSize, marginLeft:15}}>
                        <RightPicto color={textColor}/>
                    </View>
                </View>
            </View>

        </View>
    )
}