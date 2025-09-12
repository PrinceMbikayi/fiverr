import React, { Component } from 'react';
import { ScrollView,View, Text,SafeAreaView,TouchableOpacity,Dimensions} from 'react-native';
import {useContext,useState,useRef,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';


import styled from 'styled-components/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
//import { ScrollView } from 'r-eact-native-gesture-handler';

//--------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import AccessButton from '_components/forms/accessButton';
// relative path below : doorkeeper got its own components folder
import Header from '../../components/ui/header';

//--------------------------------------------------
import {vdpProducts} from '../vdpProducts';

//import vdpProducts from '../vdpProducts.json';

const DoorKeeperReadQRCodeScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {}; 
   const {itemId,update : isUpdate, productId : atHomeObjectType} = navigationParams;
    
    const title = t('doorkeeper:'+((isUpdate != undefined) ? 'ADD_DOORKEEPER' : 'ADD_DOORKEEPER'));   
   
    let cameraRef = useRef(null);

    const [scanStatus,setScanStatus] = useState('scanning');
    const [scanResult,setScanResult] = useState('');
    const [deviceUid,setDeviceUid] = useState(null)
    const [deviceSn,setDeviceSn] = useState(null)

    // DID MOUNT
    useEffect(() => {
        isMounted.current = true;       
        if(isUpdate) {
                   
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);


      const goBack = () => {       
        navigation.navigate('AddProduct')
      }

    const checkQrCode = (readData) => {

        //last format
        //const data = readData.split("/").pop();
        const data = readData;
        const splitted = data.split("-");
        const uid = splitted[0];
        const sn = splitted[1].toString().trim();
        const checkKey = "vdp-"+sn;
        console.log("uid",uid,"sn",sn,vdpProducts,checkKey,vdpProducts[checkKey])
        if(vdpProducts[sn] == undefined) return "doneWrong";
        setDeviceSn(sn);
        setDeviceUid(uid);
        return 'done';
       
    } 

    const onQRCodeCaught = async(e) => {
      
        setScanResult(e.data);
        setScanStatus(checkQrCode(e.data));
        
    }

    const onRescan = () => {
        setScanStatus('scanning');
    }

    const onNext = () => {
        navigation.navigate('AddDoorKeeperRegister',{"productId":'doorkeeper',"deviceUid":deviceUid,"deviceSn":deviceSn})
        //navigation.navigate("AddDoorKeeperWifi",{productId:'doorkeeper'});
    }


    // Attention à la version wizard sans props goBack
    

    const previewStyle =  {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
      }

      const qrCodeBackgroundColor = "black";
    
    //----------------------------------
    const bodyTextColor = textColor;
    const backgroundColor = bgColor;
    //-----------------------------------
    return (
        <SafeAreaView style={{flex:1,backgroundColor:backgroundColor}}>            
        <Header title={title} goBack={goBack} themeDependency/>
        <Body>  
            <View style={{minHeight:360,height:200,backgroundColor:qrCodeBackgroundColor,overflow:'hidden',zIndex:3,flex:1,alignItems:'center',justifyContent:'center'}}>      
                {scanStatus == 'scanning' && <QRCodeScanner
                    ref={cameraRef}
                    onRead={onQRCodeCaught}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    showMarker={true}
                    cameraProps={{ style:previewStyle}}
                />
                }
                {scanStatus == 'done' &&
                    <>
                        <BodyText>{t("doorkeeper:SCAN_DOORKEEPER_OK")}</BodyText>
                        <AccessButton  onPress={onNext} specialColor={'white'} title={t("BUTTON_NEXT")}/>
                    </>
                }
                {scanStatus == 'doneWrong' &&
                    <>
                        <BodyText color={'white'}>{t("doorkeeper:SCAN_DOORKEEPER_CODE_UNKNOWN")}</BodyText>
                        <AccessButton  onPress={onRescan} specialColor={'white'} title={t("doorkeeper:SCAN_RESTART")}/>
                    </>
                }
            </View>
            <ScrollView style={{paddingBottom:60,marginBottom:100}}>                
                <Text style={{color:bodyTextColor}}>{t('doorkeeper:READ_SCAN_INSTRUCTIONS')}</Text>
            </ScrollView> 
        </Body>
       
      </SafeAreaView>
    )        
}

export default DoorKeeperReadQRCodeScreen

const BodyText = styled.Text`
    color:${props => props.color || 'white'}; 
    text-align:center;  
    font-size:14px;        
`;
const Body= styled.View`
    width:100%;    
    padding:15px;    
`;