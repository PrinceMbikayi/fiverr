import React, { Component } from 'react';
import { View, Text,SafeAreaView,TouchableOpacity,Dimensions} from 'react-native';
import {useState,useRef,useEffect} from 'react';
import { useStore,useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute} from '@react-navigation/native';


import styled,{ThemeProvider} from 'styled-components/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

//--------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import AccessButton from '_components/forms/accessButton';
// relative path below : doorkeeper got its own components folder
//--------------------------------------------------
import {qrcProducts} from '../qrcProducts';
import {getObjectByRealName} from '_helpers/selectors';
import Template from '_brand/templates/components/objects/qrBasic/wizard/screens/qrBasicWizardReadQRCodeTemplate.js';




const QrBasicReadQRCodeScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    const {itemId,update : isUpdate, productId : atHomeObjectType} = navigationParams;

    const store = useStore();
    
    //const title = t('doorkeeper:'+((isUpdate != undefined) ? 'ADD_DOORKEEPER' : 'ADD_DOORKEEPER'));   
    const title = t("qrbasic:SCAN_PAGE_HEADER") || ""
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


    const objectAlreadyHere = (uid) => {
        const objectExists = getObjectByRealName(store.getState(),"access/vdp/"+uid);
        console.log("objectExists",objectExists)
       return objectExists || false;
    }

    const checkQrCode = (readData) => {

        //Le QR code va retourner une chaine de caractère de type id_produit-numero_famille
        //last format
        console.log("QR data",readData);
        const data = readData.split("/").pop();
        const splitted = data.split("-");
        if(splitted.length <2)return {errCode:1}
        const uid = splitted[0];
        const sn = splitted[1].toString();

        console.log(" YYY voilà voilà uid",uid,"sn",sn)
        console.log("qrcProducts",qrcProducts)
        if(qrcProducts[sn] == undefined) return {errCode:1} //"doneWrong";

        const objectExists = objectAlreadyHere(uid);

        if(objectExists) {
            console.log("objectExists",objectExists)
            return {errCode:2,info:objectExists?.name};
        }
        setDeviceSn(sn);
        setDeviceUid(uid);
        console.log("end")
        return {errCode:0};
       
    } 






    const onQRCodeCaught = async(e) => {
      
        console.log("qrCodeCaught : ",e)
        setScanResult(e.data);
        const resp = checkQrCode(e.data)
        setScanStatus(resp);
        
    }

    const onRescan = () => {
        setScanStatus('scanning');
    }

    const onNext = () => {
        navigation.navigate('AddQrBasicInputs',{"productId":'qrbasic',"deviceUid":deviceUid,"deviceSn":deviceSn})
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

    const styledTheme = {'textColor':textColor};

      const ScanComponent = (props) => {

        const {scanStatus,onQRCodeCaught,onNext,onRescan} = props;
        return (
            <View style={{backgroundColor:'transaprent'}}>
            {scanStatus == 'scanning' && <QRCodeScanner
                        ref={cameraRef}
                        onRead={onQRCodeCaught}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        showMarker={true}
                        cameraProps={{ style:previewStyle}}
                    />
                    }
                    {scanStatus?.errCode == 0 &&
                        <>
                            <BodyText>{t("qrbasic:SCAN_CODE_OK")}</BodyText>
                            <AccessButton  onPress={onNext} specialColor={'white'} title={t("BUTTON_NEXT")}/>
                        </>
                    }
                    {scanStatus?.errCode == 1 &&
                        <>
                            <BodyText color={'white'}>{t("qrbasic:SCAN_CODE_UNKNOWN")}</BodyText>
                            <AccessButton  onPress={onRescan} specialColor={'white'} title={t("qrbasic:SCAN_RESTART")}/>
                        </>
                    }
                     {scanStatus?.errCode == 2 &&
                        <>
                            <BodyText color={'white'}>{t("qrbasic:SCAN_CODE_OBJECT_EXISTS",{name:scanStatus?.info})}</BodyText>
                            <AccessButton  onPress={onRescan} specialColor={'white'} title={t("OK")}/>
                        </>
                    }
                    </View>
        )
      }

    //-----------------------------------
    return (
       <Template {...goBack}>
            <ScanComponent {...{scanStatus,onQRCodeCaught,onNext,onRescan}}/>
        </Template>              
    )        
}

export default QrBasicReadQRCodeScreen

const BodyText = styled.Text`
    color:${props => props.color || 'white'}; 
    text-align:center;  
    font-size:14px;        
`;