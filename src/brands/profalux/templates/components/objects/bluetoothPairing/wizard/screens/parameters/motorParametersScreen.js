import '../../../locales'; // generic wizard
import './locales'; // special parameters 
import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute ,StackActions} from '@react-navigation/native';
import PagerView from 'react-native-pager-view';


import {ThemeProvider} from 'styled-components/native';



//-----------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import ScreenHeader from '../../../components/ui/header';

import {H1,P,ViewPagerStep} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';

import {steps} from './config';
import QuestionScreen from './questionPage';
import questionDatas from './config.json';

const PageIndicators = (props) => {
    const radius = 14;
    const pad = 4;
    const {currentPageIndex,maxPages,color} = props;
  


    const PageIndicator = ({isCurrent}) => {
        const bgColor = (isCurrent) ?  color: 'transparent';
        return (<View style={{margin:pad,width:radius+pad,height:radius+pad,borderRadius:((radius+pad)/2),backgroundColor:bgColor,borderWidth:2,borderColor:color}}/>)
    }
    console.log("maxPages",maxPages)
    return (
        <View style = {{flexDirection:'row',alignItems:'center',justifyContent:'center',flex:1}}>
        {[...Array(maxPages)].map((v,i)=> {
            console.log("i2",i,currentPageIndex)
                return <PageIndicator isCurrent={(i == currentPageIndex )} key={"pik_"+i} />
        })
        }
         </View>
    )

}






const MotorParametersScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const tns = "motor"


    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
  
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
  
    //const currentPage = navigationParams.pageIndex || 0;
    const maxPages = 2;
    const [currentPage, setCurrentPage] = useState(0);
   
   

    const endCallback = props.endCallback;
    const indexCallback = props.indexCallback;
    const changedPosition = props.currentPosition;
    
   
   
    const pagerRef = useRef(null);
  
   
  

    const goBack = () => {
        const nextIndex = currentPage - 1; 
        if(nextIndex < 0 ) {
            navigation.goBack();
        } else {
           
            setCurrentPage(nextIndex);         
            pagerRef.current.setPage(nextIndex); 
        }
    }

    const  goToNextScreen = () => {
        navigation.navigate("AddMotorTest")
    }

    const goNextPage = () => {

        console.log("currentPage",currentPage);
        console.log("pagerREf",pagerRef)
        const nextIndex = currentPage + 1; 
        if(nextIndex >= maxPages) {
            goToNextScreen();
        } else {
            setCurrentPage(nextIndex);      
            pagerRef.current.setPage(nextIndex); 
        }
         
       
    }


    const onPageSelected = (e) => {
       
        const position = e.nativeEvent.position;
      //  pageRefCurrentPage.current = position;        
        const index = setCurrentPage(position);       
        if(indexCallback) indexCallback(index,pagerTitles[index])
    }

    const showInfos = () => {
        console.log("show infos")
    }
    
    const bodyTextColor = textColor;
    const backgroundColor = bgColor;
    const styledTheme = {'textColor':textColor};

    const onQuestionAnswered = (q) => {
        const {questionIndex,response} = q;
        console.log("q",q)
        const nextQuestion = questionIndex+1;
        if(nextQuestion < questionDatas?.datas.length) {
            pagerRef.current.setPage(nextQuestion)
        } else {
            console.log("oki nextQuestion =",nextQuestion)            
            const pushAction = StackActions.push('MotorAutoLearn', { user: 'Wojtek' });
            navigation.dispatch(pushAction);
        }
        

    }
    const aaar = ["red","green","yellow"]
    const arr = questionDatas.datas || [];

    return (
        <ThemeProvider theme={styledTheme}> 
            <ScreenHeader title={t(tns+":"+"PARAMETERS")} goBack={goBack} showInfos={showInfos}/>  
               <PagerView  initialPage={0} style={{flex:1}} ref={pagerRef} onPageSelected={onPageSelected} scrollEnabled={false}> 
                  {arr.map((v,i) => {
                    // View Wrapper is needed (' Attention: Note that you can only use View components as children of PagerView ) 
                    return (
                        <View style={{padding:16}} key={i}>
                             <QuestionScreen questionIndex={i} key={'qtz_'+i} onSelection={onQuestionAnswered}/>
                        </View>
                    )
                  })}    
            </PagerView>
            {/*
            <View style={{height:20,marginBottom:20}}>
                        <PageIndicators currentPageIndex={0} maxPages={maxPages} color={theme.neutral_dark}/>
    </View> */}
        </ThemeProvider>
    )        
}

export default MotorParametersScreen


