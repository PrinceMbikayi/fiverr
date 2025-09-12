import React, {useState, useEffect} from 'react';
import { Text, View, Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import { useTheme } from '_theming/themeProvider';
import styled from 'styled-components/native'
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'


export const FreeDayRender = (props)=>{
    const {label, id, active, onPress} = props
    // const {dayObject, index, active, onPress} = props
    // const id = dayObject?.id
    // const label = dayObject?.label

    const uScenario = useScenario();
    const {
        onClickDayObject
    } = uScenario;

    const { theme } = useTheme();
    const textColor = theme?.prflxTextColor || 'black'


    // const handlePress = (dayObject)=>{
    //     onPress(dayObject)
    //     onClickDayObject(dayObject)
    // }

    return(
        <View 
            //onPress={()=> handlePress(dayObject)}
            key={id}
            //index={id}
            style={[
                active ? [styles.buttonActive] : [styles.button]]}
            >
                <DayText 
                        color={active? textColor : textColor}
                        fontWeight = {active? 700 : 400}
                    >
                    {label}
                </DayText>
        </View>
    )

}

const styles = StyleSheet.create({
    buttonActive:{
        width:30, 
        height:30, 
        borderRadius:15, 
        borderColor:"orange",
        backgroundColor:'white',
        borderWidth:1,
        justifyContent:'center', 
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },

    button:{
        width:30, 
        height:30, 
        justifyContent:'center', 
        alignItems:'center',
        backgroundColor:'transparent'
    },
    text:{
        textAlign: 'center', 
        fontSize: 12, 
        fontWeight: '700' 
    },
    textActive:{
        textAlign: 'center', 
        color: 'white', 
        fontSize: 13, 
        fontWeight: '700' 
    }
})
const DayText = styled.Text`
        align-content:center;        
        align-self:center; 
        font-size:14;
        font-weight:${props =>props.fontWeight}
        color: ${props => props.color}; 
                
                `;