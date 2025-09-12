
//import '../../../locales';
//import '_brand/templates/screens/productsRelated/_locales';

import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,Text, SafeAreaView} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute ,StackActions} from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import LottieView from 'lottie-react-native';
import {isFunction} from 'lodash';

import {ThemeProvider} from 'styled-components/native';

//-----------------------------------------------------


//import { useBleWizard } from '_brand/templates/components/objects/bluetoothPairing/ble/hook';
import { useBleContext } from '_hooks/ble/bleContext';

import { useTheme } from '_theming/themeProvider';
//import ScreenHeader from '../../../components/ui/header';
import {useGlobalModal} from '_components/ui/globalModal';

import {H1,H2,H3,P,ViewPagerStep} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';
import {steps} from './config';
//import CheckBlueToothScreen from '../../../components/checkBlueTooth';
import ActiveScanPage from './pages/activeScan';




import {useUser} from '_hooks/useUserHigher';


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
           
                return <PageIndicator isCurrent={(i == currentPageIndex )} key={"pik_"+i} />
        })
        }
         </View>
    )

}


const ScanScreen = (props) => {


    console.log("Im am scanScreen in BlueToothPairing");//,JSON.stringify(props))
  
    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const tns = "bluetooth"

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
    //console.log("scanScreen",Date.now())
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;  
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {next:nextScreen,nextDefault,nextConditionModel = [],strictType,type:deviceType,references} = navigationParams;

      console.log("Im am scanScreen in navigationParams",JSON.stringify(navigationParams))
   
    //console.log("[scanScreen] navigationParams",navigationParams,nextScreen)
    const productReferences = references || [deviceType];

    const maxPages = 2;
    const [currentPage, setCurrentPage] = useState(0);
    const title = steps[currentPage]?.title;
    const description =  steps[currentPage]?.title;

    const endCallback = props.endCallback;
    const indexCallback = props.indexCallback;
    const changedPosition = props.currentPosition;    

    const {advice,allCharacteristics} = props;
   
   
    const pagerRef = useRef(null);  
  
    const uUser = useUser();

  
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
        
        console.log('[bluetooth pairing] wizard screens > scan > ]')
        console.log('remettre ??')
        /*
        const val = await checkBluetoothRef.current.check();
        console.log("checkBluetooth >",val)
        if(val == "on") {
            continueAction()
        }
        */
    }
    const continueAction = () => {
        
        setIsBluetoothAvailable(true)
        globalModal.close();
        /*
        const pushAction = StackActions.push('MotorAutoLearn', { user: 'Wojtek' });
        navigation.dispatch(pushAction);
        globalModal.close();
        */
    }

    useEffect(()=> {
        console.log("isBluetoothAvailable so redraw",isBluetoothAvailable)
    },[isBluetoothAvailable]);

    const onCancelBluetooth = () => {
        navigation.goBack();
    }

    const onBlueToothAvailable = () => {
       console.log("so continue action")
        continueAction();
    }

    useEffect(()=> {
        console.log("restart or what ? ",Date.now())
        checkBluetooth();
    },[]);


    const [createDetails, setCreateDetails] = useState(null);

    const devName = "testAddHeater";
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
    



    //-------------------------------

    const bodyTextColor = textColor;
    const backgroundColor = bgColor;
    const styledTheme = {'textColor':textColor};
    return (
       
            
                <View style={{height:"100%",backgroundColor:backgroundColor}}>
                <PagerView  initialPage={0} style={{flex:1}} ref={pagerRef} onPageSelected={onPageSelected}scrollEnabled={false} >
                    <View style={{backgroundColor:'transparent',padding:16}} key="1">               
                    <ActiveScanPage canStart={isBluetoothAvailable} 
                                    addProduct={doAddProduct} 
                                    strictType={strictType} 
                                    deviceType={deviceType} 
                                    productReferences={productReferences} 
                                    advice={advice}
                                    bip="bap a loula"
                                    allCharacteristics={allCharacteristics}
                                    
                                    />
                    </View>                       
                </PagerView>   
                </View>         
          
    )        
}

export default ScanScreen


