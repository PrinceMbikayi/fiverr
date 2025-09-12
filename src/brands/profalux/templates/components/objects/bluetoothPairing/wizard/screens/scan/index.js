import '_brand/templates/screens/addObject/locales'
import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,Text, SafeAreaView} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute ,StackActions} from '@react-navigation/native';

import { useBleContext } from '_hooks/ble/bleContext';
import { useTheme } from '_theming/themeProvider';
import {useGlobalModal} from '_components/ui/globalModal';
import {steps} from './config';
import ActiveScanPage from './pages/activeScan';




import {useUser} from '_hooks/useUserHigher';



const ScanScreen = (props) => {


    console.log("Im am scanScreen in BlueToothPairing");//,JSON.stringify(props))
  
    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'
    const checkBluetoothRef = useRef();
    const globalModal = useGlobalModal();
    console.log("isBluetoothAvailable => remettre false et rajouter le useEffect pour le remettre à true")
    const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(true);
   
    const uBleContext = useBleContext(); 
    const uBleContextIsInitialized = useRef(false);
    if(!uBleContextIsInitialized.current) {
        uBleContextIsInitialized.current = true;
       // uBleContext.init({deviceRefs:})
    } 
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {next:nextScreen,nextDefault,nextConditionModel = [],strictType,type:deviceType,references} = navigationParams;

      console.log("Im am scanScreen in navigationParams",JSON.stringify(navigationParams))
   
    //console.log("[scanScreen] navigationParams",navigationParams,nextScreen)
    const productReferences = references || [deviceType];

    const maxPages = 2;
    const [currentPage, setCurrentPage] = useState(0);

    const {advice,allCharacteristics} = props;
   
   
    const pagerRef = useRef(null);  


  
    const goBack = () => {
        const nextIndex = currentPage - 1; 
        if(nextIndex < 0 ) {
            console.log("uBleContext disconnectDevice",uBleContext);
            uBleContext.disconnectDevice();
            uBleContext.setIsAborted(true)
           
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

       
        const nextIndex = currentPage + 1; 
        if(nextIndex >= maxPages) {
            goToNextScreen();
        } else {
            setCurrentPage(nextIndex);      
            pagerRef.current.setPage(nextIndex); 
        }
         
       
    }


    //-------- bluetooth ----------
    const checkBluetooth = async () => {   
        console.log('[bluetooth pairing] wizard screens > scan > ]')
        console.log('remettre ??')
    }
    const continueAction = () => {
        setIsBluetoothAvailable(true)
        globalModal.close();
    }

    useEffect(()=> {
        console.log("isBluetoothAvailable so redraw",isBluetoothAvailable)
    },[isBluetoothAvailable]);


    useEffect(()=> {
        console.log("restart or what ? ",Date.now())
        checkBluetooth();
    },[]);


    const addProduct = (datas) => {

        console.log("screenScan addProduct data",datas);
        console.log("pops",props);
        props.onSelectDevice(datas)

    }

    const doAddProduct = (device)=> {
        console.log("doAddProduct",device);
       if(addProduct) {
            addProduct(device);
        }
    }
    

    return (    
        <ActiveScanPage canStart={isBluetoothAvailable} 
            addProduct={doAddProduct} 
            strictType={strictType} 
            deviceType={deviceType} 
            productReferences={productReferences} 
            advice={advice}
            bip="bap a loula"
            allCharacteristics={allCharacteristics}
            
        />  
    )        
}

export default ScanScreen


