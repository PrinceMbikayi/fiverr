import '../../locales'
import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
import {ThemeProvider} from 'styled-components/native';

import PagerView from 'react-native-pager-view';


//-----------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import Illustration from '_brand/images/illustrations/startQAir.js';
import {H1,P} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';

const QrBasicPreInstall = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
  
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
   // const {itemId,update : isUpdate, productId : atHomeObjectType} = navigation?.state?.params || {}; //v4
    const {itemId,update : isUpdate, productId : atHomeObjectType} = navigationParams;
    
    const endCallback = props.endCallback;
    const indexCallback = props.indexCallback;
    const changedPosition = props.currentPosition;
    
    const pagerTitles = [   "",
                                t("doorkeeper:PRE_INSTALL_STEP_2_TITLE"),
                                t("doorkeeper:WIFI_CONNECT_TITLE")
                            ]

    const pagerRef = useRef(null);
    const initialPage = 0
    const pageRefCurrentPage = useRef(initialPage);
    const [qrCodeVisible,setQrCodeVisible] = useState(false)


    const goNextPage = (newIndex) => {

       
        if(newIndex == undefined) {
            pageRefCurrentPage.current +=1;
        } else {
            pageRefCurrentPage.current = newIndex;
        }        
        pagerRef.current.setPage(pageRefCurrentPage.current);   
    }


    // DID MOUNT
    useEffect(() => {
        isMounted.current = true;
        console.log("DoorKeeperWizardStartScreen",props);
        if(indexCallback) indexCallback(0,pagerTitles[0])

        if(isUpdate) {
                   
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);

      useEffect(() => {
       if(changedPosition != pageRefCurrentPage.current) {
        goNextPage(changedPosition)
       }
      }, [changedPosition]);



    const onPageSelected = (e) => {
       
        const position = e.nativeEvent.position;
        pageRefCurrentPage.current = position;        
        const index = pageRefCurrentPage.current;       
        if(indexCallback) indexCallback(index,pagerTitles[index])
    }

    
    const bodyTextColor = textColor;
    const backgroundColor = bgColor;
    const styledTheme = {'textColor':textColor};
    return (
        <ThemeProvider theme={styledTheme}>
            <PagerView  initialPage={0} style={{flex:1}} ref={pagerRef} onPageSelected={onPageSelected}>
                <View style={{backgroundColor:'transparent',padding:16}} key="1">
                     <View>
                        <View style={{width:'100%',height:240,backgroundColor:"transparent"}}>
                        <Illustration/>
                        </View>
                    </View>                       
                    <View >                 
                    <H1>{t("qrbasic:PRE_INSTALL_STEP_1_TITLE")}</H1>                              
                    <P style={{marginTop:16}} >{t("qrbasic:PRE_INSTALL_STEP_1_BODY")}</P>
                    <View style={{height:16}}/>       
                        <Button title={t("qrbasic:PRE_INSTALL_STEP_1_BUTTON")} onPress={endCallback}   bgColor={theme.primary_1_light}   /> 
                    </View>
                </View>
               
            </PagerView>
        </ThemeProvider>
    )        
}

export default QrBasicPreInstall


