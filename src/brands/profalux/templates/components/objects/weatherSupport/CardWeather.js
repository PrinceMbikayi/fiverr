import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable} from "react-native";
import styled from "styled-components/native";
import PureIconRender from "_components/pureIconRender";


export const CardWeather = (props)=>{
    const {dayPrev, skyPrev, maxTempPrev, minTempPrev, cardStyle, dayStyle, iconStyle, tempStyle, onPress, currentActive,fontWeight} = props;

    return(
      <Pressable
          key = {currentActive}
          onPress={()=>onPress(currentActive)}
          style={{
            flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center',  
            borderRadius:7, padding:5, marginHorizontal:0,
            backgroundColor:cardStyle,
            
          }}
        >
            <View>
              <Text style={[{fontSize:16, fontWeight:fontWeight||400}, dayStyle]}>
                {dayPrev}
              </Text>
            </View>

            <View>
              <PureIconRender
                size={50}
                img={skyPrev}
                fill={iconStyle}
                imageIsStatus={true}
              />
            </View>

            <View>
              <TemperatureText color={tempStyle} fontWeight={fontWeight}  >
                {maxTempPrev} °C
              </TemperatureText>
            </View>
            { minTempPrev != null ?
                <View>
                  <TemperatureText color={tempStyle} fontWeight={fontWeight} >
                    {minTempPrev} °C
                  </TemperatureText>
                </View>
              :
                <View>
                <TemperatureText color={tempStyle}  fontWeight={fontWeight}>
                </TemperatureText>
                </View>
            }

      </Pressable>
    )
  }


  const TemperatureText = styled.Text`
  color: ${(props) => props.color || "#000000"};
  font-size: 14px;
  font-weight: ${(props)=> props.fontWeight || "400"};
`;