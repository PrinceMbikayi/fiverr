import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { Text, View ,ScrollView,SafeAreaView} from 'react-native';
import styled,{ThemeProvider} from 'styled-components/native';
import { useTheme} from '_theming/themeProvider';



export const NotificationItem = (props) => {
    
    const {title,dtime,message} = props?.data;   
    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;  
     

    const styledTheme = {color:textColor}

    return (
        <ThemeProvider theme={styledTheme}>
            <Container>
                <Title>{title}</Title>
                <BodyText style={{marginBottom:4}}>{dtime}</BodyText>
                <BodyText>{message}</BodyText>
            </Container>
        </ThemeProvider>
        )
    };

const Title = styled.Text`
    color:${attrs => attrs.theme.color || attrs.color || 'white'}; 
    text-align:${attrs => attrs.align || 'left'};
    font-size:14px;  
    margin-bottom:8px;      
`;

const BodyText = styled.Text`
    color:${attrs => attrs.theme.color || attrs.color || 'white'}; 
    text-align:${attrs => attrs.align || 'left'};
    font-size:12px;        
`;

const Container = styled.View`
    border-bottom-width:1px;
    border-bottom-color:${attrs => attrs.theme.color || attrs.color || 'white'};
    padding-top:15px;
    padding-bottom:10px;
`;