import React, {useContext,useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,ScrollView,SafeAreaView,Linking} from 'react-native'; // use in styled components
import { useSelector,useDispatch } from 'react-redux';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import {StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';

import {AccountHeader} from '../components/header';






export const HotlineScreen = (props) => {
   
    const { t, i18n } = useTranslation();
    const { theme, baseColors} = useTheme();
    const title = t('account:HOTLINE');
  
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
   
    useEffect(() => {     
        const initMe = async() => {
                    
        }
        initMe();
    }, []);

    const bodyTextColor = theme["onBody"];
    const backgroundColor = theme.body || theme['card--color--bodybg'] || theme['color--bg'];
    const invertOnBody = theme.optionIconTint || theme.onBodyInverse;

    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
    
    return (
        <SafeAreaView style={{flex:1,backgroundColor:bgColor}}>
            <AccountHeader title={title} />    
            <ScrollView style={{padding:15,paddingTop:0,flex:1}}> 
            <VSpace height={40}/>          
                <BodyText color={bodyTextColor} fontSize={18} centered>{t('account:HOTLINE_MOTTO')}</BodyText>
                <VSpace/>
                <View style={{alignItems:'center'}}>
                    <PhoneNumber  bgColor={bodyTextColor} color={bgColor} >{t('account:HOTLINE_CALL_NUMBER')}</PhoneNumber>
                </View>
                <BodyText color={bodyTextColor} centered>{t('account:HOTLINE_NUMBER_PRICE')}</BodyText>
                <VSpace/>
                <BodyText color={bodyTextColor} centered>{t('account:HOTLINE_OPENING_HOURS')}</BodyText>
            </ScrollView>
        </SafeAreaView>
        )
}

const Body= styled.ScrollView`    
    padding:15px;    
`;

const VSpace= styled.View`    
   height:${props => props.height || 14}px;   
`;

const MyText = styled.Text`
    color:${props => props.color || "red" };
    font-size:${props => props.fontSize || 14}px;
    ${({centered}) => centered  && `
        text-align: center;
    `}
`;  
const BodyText = styled(MyText)`   
   
`;

const PhoneNumber = styled.Text`
    color:${props => props.color || "red" };
    background-color:${props => props.bgColor || "yellow" };
    font-size:${props => props.fontSize || 30}px;
    padding-top:6px;
    padding-bottom:6px;
    padding-left:10px;
    padding-right:10px;
    margin:10px;
    ${({centered}) => centered  && `
        text-align: center;
    `}
`;  