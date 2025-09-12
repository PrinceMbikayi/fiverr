import '../../../locales'
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
import {useGlobalModal} from '_components/ui/globalModal';
import Illustration from '_images/illustrations/startQAir.js';
import {H1,P,ViewPagerStep} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';

import {steps} from './config';

import CheckBlueToothScreen from '../../../components/checkBlueTooth';


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


const guidePageScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const tns = "motor"

    const checkBluetoothRef = useRef();
    const globalModal = useGlobalModal();
   

    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
  
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
  
    //const currentPage = navigationParams.pageIndex || 0;
    const maxPages = 2;
    const [currentPage, setCurrentPage] = useState(0);
    const title = steps[currentPage]?.title;
    const description =  steps[currentPage]?.title;

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
    

    //-------- bluetooth ----------
    const checkBluetooth = async () => {
        console.log('checkBluetooth');  
        const val = await checkBluetoothRef.current.check();
        if(val == "PoweredOn") {
            continueAction()
        }
       
    }
    const continueAction = () => {
      
        globalModal.close();
        /*
        const pushAction = StackActions.push('MotorAutoLearn', { user: 'Wojtek' });
        navigation.dispatch(pushAction);
        globalModal.close();
        */
    }

    const onCancelBluetooth = () => {
        navigation.goBack();
    }

    const onBlueToothAvailable = () => {
        console.log('onBlueToothAvailable')
        continueAction();
    }

    useEffect(()=> {
        checkBluetooth();
    },[])


    //-------------------------------

    const bodyTextColor = textColor;
    const backgroundColor = bgColor;
    const styledTheme = {'textColor':textColor};
    return (
        <ThemeProvider theme={styledTheme}> 
                <CheckBlueToothScreen ref={checkBluetoothRef} manualCheck onBlueToothAvailable={onBlueToothAvailable} onCancelBluetooth={onCancelBluetooth}/>
                <ScreenHeader title={t(tns+":"+"GUIDE_TITLE")+ "GENERIC"} goBack={goBack} showInfos={showInfos}/>  
                <PagerView  initialPage={0} style={{flex:1}} ref={pagerRef} onPageSelected={onPageSelected}>
                    <View style={{backgroundColor:'transparent',padding:16}} key="1">
                        <View>
                            <View style={{width:'100%',height:240,backgroundColor:"#CCC"}}>
                            {/*<Illustration/>*/}
                            </View>
                            <ViewPagerStep color={theme.neutral_dark}>{t("motor:STEP")} {currentPage+1}/{maxPages}</ViewPagerStep>
                        </View>                       
                        <View >                 
                        <H1>{t(tns+":"+"GUIDE_STEP_1_TITLE")}</H1>                          
                        <P style={{marginTop:16}} >{t(tns+":"+"GUIDE_STEP_1_DESCRIPTION")}</P>
                        <View style={{height:16}}/>       
                            <Button title={t("motor:NEXT")} onPress={goNextPage}   bgColor={theme.primary_1_light}   /> 
                            </View>
                    </View> 
                    <View style={{backgroundColor:'transparent',padding:16}} key="2">
                        <View>
                            <View style={{width:'100%',height:240,backgroundColor:"#CCC"}}>
                            {/*<Illustration/>*/}
                            </View>
                            <ViewPagerStep color={theme.neutral_dark}>{t("motor:STEP")} {currentPage+1}/{maxPages}</ViewPagerStep>
                        </View>                       
                        <View >                 
                        <H1>{t(tns+":"+"GUIDE_STEP_2_TITLE")}</H1>                          
                        <P style={{marginTop:16}} >{t(tns+":"+"GUIDE_STEP_2_DESCRIPTION")}</P>
                        <View style={{height:16}}/>       
                            <Button title={t("motor:NEXT")} onPress={goNextPage}   bgColor={theme.primary_1_light}   /> 
                        </View>
                    </View>                  
                </PagerView>
            <View style={{height:20,marginBottom:20}}>
                        <PageIndicators currentPageIndex={currentPage} key={"pic_"+i} maxPages={maxPages} color={theme.neutral_dark}/>
                    </View>
        </ThemeProvider>
    )        
}

export default guidePageScreen


