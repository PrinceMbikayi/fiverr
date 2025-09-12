//import '../../locales'
import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,ScrollView,Pressable} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute ,StackActions} from '@react-navigation/native';
import styled from 'styled-components/native';

import {ThemeProvider} from 'styled-components/native';

//-----------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import {H1,P} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';
import { getIllustration } from '../../illustrations/index';

import Answers from '_brand/templates/components/forms/radio';
import questionDatas from './config.json';
import {translateQuestionDatas} from '_brand/utils/translate';


const QuestionScreen = (props) => {

    const {questionIndex,onSelection} = props;
   
    const { t, i18n } = useTranslation();
    const tns = "motor"
    const translatedDatas = translateQuestionDatas(t,tns,questionDatas?.datas);
    const qDatas =translatedDatas[questionIndex]
 
    const illustration = getIllustration(qDatas.illustration);
    const title = qDatas.question;   
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors; 
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};     
          
    const styledTheme = {'textColor':textColor};
    //-------------------------
    const goBack = () => {
        navigation.goBack();
    }

    const showInfos = () => {
        //
    }

    const onAnswerSelect = (response) => {
        console.log("response",response); 
        onSelection({'questionIndex':questionIndex,'response':response})         
    }

    return (
        <ThemeProvider theme={styledTheme}>            
                     <View style={{backgroundColor:'transparent'}}>
                        <View style={{width:'100%',height:240,backgroundColor:"transparent"}}>
                       {illustration}
                        </View>
                    </View>                       
                    <View style={{marginTop:24}}>
                        <H1>{title}</H1>                        
                        <View style={{height:16}}   />                     
                       <Answers datas={qDatas} onAnswerSelect={onAnswerSelect}/>            
                    </View>           
        </ThemeProvider>
    )        
}

export default QuestionScreen



