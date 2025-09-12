import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,SafeAreaView} from 'react-native';

import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute} from '@react-navigation/native';
//------------------------------------------------------------------

import { useTheme } from '_theming/themeProvider';
import QrBasicWizardStartPreinstall from './qrBasicPreInstall';
import {HeaderWithBack} from '_components/headers/header-with-back';


//==================================================================
const QrPublicWizardStartScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    const {itemId,update : isUpdate, productId : atHomeObjectType} = navigationParams || {}
   
    const [startInstallIndex, setStartInstallIndex] = useState(0);
    const [startInstallCurrentPageTitle,setStartInstallCurrentPageTitle] = useState(t("doorkeeper:SETUP_TITLE"));
    const title = "";

    // DID MOUNT
    // exemple mount / unmount fonctional component
    useEffect(() => {
        isMounted.current = true;       
        if(isUpdate) {
                //   
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);



      const _startInstallation = () => {
        const params = {productId:atHomeObjectType};       
        navigation.navigate('AddQrBasicReadQRCode',params);       
      }

      const goBack = () => {       
        navigation.navigate('AddProduct')
      }

      const goBackStartPager = () => {
        setStartInstallIndex(startInstallIndex-1)
      }

    // Attention à la version wizard sans props goBack    

    const ScreenHeader = () => {
      
      const hTitle = (startInstallIndex == 0)? title : 'AHHHHH' || startInstallCurrentPageTitle; 
      const hGoback = (startInstallIndex == 0)? goBack : goBackStartPager;
       return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                        <HeaderWithBack   title={hTitle} goBack={{action:hGoback}} themeDependency/>
                    </View>       
    }    
    const wizardStartPosition = (index,title) => {    
      setStartInstallIndex(index);
      setStartInstallCurrentPageTitle(title)
    }

    //------------------------------------------------
    const backgroundColor = bgColor
    // ----------------------------------
    return (
        <SafeAreaView style={{flex:1,backgroundColor:backgroundColor}}>            
          <ScreenHeader/>          
          <QrBasicWizardStartPreinstall indexCallback={wizardStartPosition} currentPosition={startInstallIndex} endCallback={_startInstallation.bind(this)} />      
        </SafeAreaView>
    )        
}

export default QrPublicWizardStartScreen
