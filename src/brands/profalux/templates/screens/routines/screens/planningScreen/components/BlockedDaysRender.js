import React, {useState, useEffect} from 'react';
import { Text, View, Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import { useTheme } from '_theming/themeProvider';
import styled from 'styled-components/native'


export const BlockedDaysRender = (props)=>{
    const {dayObject, index} = props
    const id = dayObject?.id
    const label = dayObject?.label

        const { theme } = useTheme();
    const textColor = theme?.prflxTextColor || 'black'
    
    return(
        <Pressable 
            key={index}
            index={id}
            disabled={true}
            style={[[styles.button, styles.buttonBlocked]]}
            >
            <DayText color={textColor} fontWeight = {400}>
                {label}
            </DayText>

    </Pressable>
    )
}


const styles = StyleSheet.create({
    buttonBlocked:{
        width:30, 
        height:30, 
        borderRadius:15, 
        backgroundColor:'#DBDADA',
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