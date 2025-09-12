import React, { Component } from 'react';
import { View, Text,SafeAreaView,TouchableOpacity,StyleSheet} from 'react-native';
import {useContext,useState,useRef,useEffect} from 'react';
import { useStore,useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Toast from 'react-native-root-toast';
import QRCode from 'react-native-qrcode-svg';
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';
import {useMyTools} from '_helpers/myTools';
import SimplePopUp from '_components/ui/simplePopUp';
import AccessButton from '_components/forms/accessButton';
import {HeaderWithBack} from '_components/headers/header-with-back';

import { TwoButtons } from '../components/twoButtons';


const DoorKeeperWizardGenerateQRCodeScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme} = useTheme();
    const myNavigationTool = useMyTools();
    const dispatch = useDispatch();

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 

    const {itemId,isUpdate,atHomeObjectType,currentSSID : ssid,ssidPassword} = navigationParams;   
    
    const title = t('doorkeeper:'+((isUpdate != undefined) ? 'ADD_DOORKEEPER' : 'ADD_DOORKEEPER'));   
    const startInstallationLabel = t('addProduct:ADD_PRODUCT_START_CONFIGURATION').toUpperCase();
    const qrCodeSize = 150;
    const [qrCode,setQrCode] = useState(<View style={{height:qrCodeSize}}/>)

    // DID MOUNT
    useEffect(() => {
        isMounted.current = true;
        console.log("DoorKeeperWizardStartScreen",props)

        const dQRCode = generateQrCode('my own string 4 test',qrCodeSize);
        setQrCode(dQRCode);

        if(isUpdate) {
                   
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);

     

      const _startInstallation = () => {
        const params = {productId:atHomeObjectType}
        navigation.navigate('AddDoorKeeperWifi',params)
      }

      const goBack = () => {
        //console.log("goBack !!!!!")
        navigation.goBack();
      }


      const onPrevious = () => {
        goBack();
      }

      const onNext = () => {
        navigation.navigate("AddDoorKeeperRegister")
      }

    // Attention à la version wizard sans props goBack
    const ScreenHeader = () => {
       
       return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                        <HeaderWithBack title={title} goBack={{action:goBack}}/>
                    </View>
       
    }

    const generateQrCode = (value,size = 120) => {

      const borderWidth = 5;
      return (
        <View style={{alignItems:'center',justifyContent:'center'}}>
          <View backgroundColor='yellow' borderColor={theme['primary']} borderWidth={borderWidth} width={size+(2*borderWidth)}>
          <QRCode
            value={value}
            color={'black'}
            backgroundColor={'white'}
            size={size}
          
            logoMargin={2}
            logoSize={20}
            logoBorderRadius={10}
            logoBackgroundColor={'transparent'}
            />
          </View>
        </View>
        )
    }


    // ----------------------------------
    return (
        <SafeAreaView style={{flex:1,backgroundColor:theme.body}}>            
            <ScreenHeader/>      
            <View style={{padding:15,justifyContent:'center',alignItems:'center'}}>
              {qrCode}
            </View>
            <View style={{padding:15}}>
              <BodyText>{t("doorkeeper:SHOW_QRCODE_TO_DOORKEEPER")}</BodyText>
              <BodyText>{t("doorkeeper:NO_BEEP")}</BodyText>
            </View>
            <TwoButtons buttons={[{title:t('BUTTON_BACK'),callback:onPrevious},{title:t('UTTON_NEXT'),callback:onNext}]} />
            {/*
            <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25}}>
                    <View  style={{width:'48%'}}>
                      <AccessButton  onPress={onPrevious} title={t("BUTTON_BACK")}/>
                    </View>
                    <View  style={{width:'48%'}}>
                      <AccessButton  onPress={onNext}  title={t("BUTTON_NEXT")}/>
                    </View>
                  </View> 
            */}
      </SafeAreaView>
    )        
}

export default DoorKeeperWizardGenerateQRCodeScreen

const BodyText = styled.Text`
    color:${props => props.color || 'white'}; 
   
    font-size:14px;        
`;

const NoticeImage = styled.Image`
    max-width:120px;
    max-height:120px;
    align-self:center;
    margin-bottom:30px;     
`;

const Body= styled.View`
    width:100%;
    justify-content:center;
    flex:1;
    padding:15px;
    padding-top:0px;
    
`;
const Bottom= styled.View`
    width:100%;
    justify-content:center;
    align-items:center;
    height:50px;
    flex:1;
   
    
`;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    marginTop: 0,   
    alignItems: 'center',
    justifyContent: 'center',
  },
 
});