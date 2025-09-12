import React,{useEffect} from 'react';
import { View, Text, StyleSheet, ActivityIndicator,Pressable } from 'react-native';
import {useTranslation} from 'react-i18next';
import styled, {ThemeProvider} from 'styled-components/native';
import {useTheme} from '_theming/themeProvider';
import { useNavigation,useRoute, StackActions } from '@react-navigation/native';
import { useNavigationState } from '@react-navigation/native';
import PageContainer from './pageContainer';

import {H1,VSeparator} from '_brand/templates/styled';
import Button from '_brand/templates/components/ui/Button';
import WifiIcon from '_brand/images/icons/app/profaluxIconJs/WifiIcon'
import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import { MyButton } from '_brand/templates/components/ui/MyButton';
//------- popups -----------------

import {useGlobalModal} from '_components/ui/globalModal';
import useWifiCtrl from '_hooks/ble/bleWifiCtrlHook';
import useSwipeBackDisabler from '_hooks/swipe';


const ConnectionProcessPage = (props) => {
    console.log("Props de connectProcessPage",JSON.stringify(props));

    useSwipeBackDisabler();
    const navigationRef = props.navigationRef;
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {};
   console.log("navigationParams de connectProcessPage",navigationParams);


   
   const {SSID,password,isWizard,next} = navigationParams;

    const uWifiCtrl = useWifiCtrl();
    const {dataModel} = uWifiCtrl || {};
    console.log("dataModel",JSON.stringify(dataModel));
    const {updateDataModel} = uWifiCtrl;

   const connectingStatus = dataModel.connectingStatus;
    useEffect(()=> {
        console.log("connectingStatus changed in ConnectionProcessPage", connectingStatus);
    },[connectingStatus]);

    const onNetworkSelected = (network) => {
        console.log("onNetworkSelected",network);
       
    }


    const globalModal = useGlobalModal();

    
    const doConnection = () => {
        console.log("doConnection in index");
        uWifiCtrl.connectToWifi(SSID,password);
    }
  

    useEffect(()=> {
        doConnection(SSID,password);
    },[]);
    /*
    useEffect(()=> {
    
        console.log("connectingStatus changed", connectingStatus);
        if(connectingStatus == "connecting") {
           doConnection();  
        }
    },[connectingStatus]);
   

    */

    const {t} = useTranslation();
    const tns = 'addObject';
    
    const {theme} = useTheme();
    const bgColor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || "#3E495E"






    
  const goNext = () => {
    console.log("goNext");
    console.log("goNext : ", next);
    if(!isWizard) {
     const popAction = StackActions.pop(3);
        navigation.dispatch(popAction);
        navigation.goBack();
    } else {
      navigation.navigate(next,{objectId:uWifiCtrl?.objectId});
    }
  }



const goBack = () => {
    console.log("goBack_ViewRoot",routeNames);
    navigation.dispatch(StackActions.pop(1));
   // props.navigation.goBack();
}


const onRetry = () => {
    console.log("onRetry");
     navigation.dispatch(StackActions.pop(1));
   
   //navigation.navigate('ProductsScreen');
   
}







 const title = t(tns + ':' + 'WIFI_HEADER_TITLE') + ''

    return (
        <PageContainer title={title} withBack={false} goBack={goBack}>
        <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'transparent', marginTop:20}}>
            <View style={{ paddingBottom: 16}}>

                {(connectingStatus == "connecting" || connectingStatus == "wait") &&
                    <>

                        <View style={{marginTop: 20, marginBottom: 50}}>
                            <Text style={[styles.text,{color:textColor, textAlign:'center'}]}>
                                    {t(tns + ':' + "WIFI_CONNECTING")}
                            </Text>
                        </View>
                        <View style={{marginTop: 0, marginBottom:0}}>
                            <ActivityIndicator size="large" color={textColor} style={{transform: [{scaleX: 2}, {scaleY: 2}]}} />
                        </View> 
                        <View style={{marginTop: 50}}>
                            <Text style={[styles.text,{color:textColor, textAlign:'center'}]}>
                                    {t(tns + ':' + "WIFI_CONNECTING_MESSAGE")}
                            </Text>
                        </View>
                        <VSeparator height={24}/>
                        {/* <Button onPress={onRetry} titleColor={"white"} bgColor={textColor} title={t(tns+":"+"RETRY")} icon={ null} style={{width: '100%'}}></Button> */}
                    </>
                }
                {connectingStatus == "success" && 
                    <>
                        <View style={{marginBottom: 20, alignSelf:'center'}}>
                            <EcoCard titlePart1={t(tns + ":" + "WIFI")} titlePart2={''} fontSize ={14} iconSize={33} Picto={WifiIcon}/>
                        </View>
                        <View style={{marginTop: 20, marginBottom: 50}}>
                            <Text style={[styles.text,{color:textColor}]}>
                                    {t(tns + ':' + "WIFI_CONNECTION_SUCCESS")}
                            </Text>
                        </View>
                        <VSeparator height={100}/>
                        <Button onPress={goNext} titleColor={"white"} bgColor={textColor} title={t(tns+":"+"CONTINUE")} icon={ null} style={{width: '100%'}}></Button>
                   
                    </>
                }
                {connectingStatus == "error" && 
                    <>
                        <View style={{marginTop: 20, marginBottom: 50, justifyContent:'center', alignItems:'center'}}>
                            <Text style={[styles.text,{color:textColor, textAlign:'center'}]}>
                                    {t(tns + ':' + "WIFI_CONNECTING_ERROR_BODY")}
                            </Text>
                        </View>
                        <VSeparator height={100}/>
                        <Button onPress={onRetry} titleColor={"white"} bgColor={textColor} title={t(tns+":"+"RESTART")} icon={ null} style={{width: '100%'}}></Button>
                   
                    </>
                }
                {connectingStatus == "idle" && 
                    <>
                        <H1 >{t(tns+":"+"WIFI_CHOOSE_NETWORK_TITLE")}</H1>
                        <VSeparator height={24}/>
                        <Button onPress={doCallback} title={t(tns+":"+"WIFI_CHOOSE_NETWORK")} icon={null} style={{width: '100%'}}>                
                        </Button>
                    </>
                }
                
              
              
            </View>
        </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    text:{
        fontSize:16,
        fontWeight: '400',
    }
});

export default ConnectionProcessPage;


const WifiWrapper = styled.View`
  border-radius: 12px;
  border-width: 1.5px;
  border-color: black;
  flex: 1;
  min-height: 64px;
  flex-direction: row;
  padding: 16px;
  align-items: center;
  background-color:red;
`;

const SuccessView = styled.View`
  background-color: ${attrs => attrs.bgColor || 'red'};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${attrs => attrs.borderColor || 'yellow'};
  flex-direction: row;
  padding: 8px;
  align-items: center;
  margin-left: 8px;
  margin-right: 8px;
`;
