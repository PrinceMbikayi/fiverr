import React, { Component } from 'react';
import {useContext,useEffect,useState,useRef} from 'react';
import { View, Text, ScrollView,SafeAreaView,Alert,Platform,KeyboardAvoidingView } from 'react-native';

import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import { useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';

import {request,check, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import styled from 'styled-components/native';
import Toast from 'react-native-root-toast';

import dgram from 'react-native-udp';
//import //RNEsptouch from 'react-native-esptouch';

import {WifiHelpers} from '_helpers';
import { useTheme } from '_theming/themeProvider';

import * as ApiObjects from '_api/objects';
//import  { pairingObject   as  ApiObjects} from '_api/objects';
// --- special design   
import {HeaderWithBack} from '_components/headers/header-with-back';
import FormInput from '_components/forms/formInput';
import AccessButton from '_components/forms/accessButton';
import {objectPairingInfos} from '_config/products/core';


const requestPermission = async() => {
    
  const locationPermission = (Platform.OS == "android") ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  const testo =  await request(locationPermission)
  //console.log('requestPermission 2',locationPermission,testo)
  return testo;
        
}

const checkLocationIsEnabled = async() => {

    return new Promise(function(resolve, reject) {    
        return Geolocation.getCurrentPosition(
          pos => {
            resolve(pos.coords.latitude + ", " + pos.coords.longitude);
          },
          err => {            
            resolve({'error':err}) // if user refuses access, return with default
          }
        );   
    });
}

const buildProductByDeviceId = (objectsByEventsName,objectsByIds) => {    
  
    const devices = Object.keys(objectsByEventsName).reduce(function(r,key,i) {
  
                let eventName = key+"";             
                if(eventName.length > 0 && eventName.slice(-1) == "/") {
                 
                  eventName = eventName.slice(0,-1);                
                  if(eventName.indexOf("/")!=-1) {
                  
                    const deviceId = eventName.split("/").pop();                 
                    const objectId = objectsByEventsName[key];                 
                    const objectName = (objectsByIds[objectId] != undefined)? objectsByIds[objectId].name : '-';
                    r[deviceId] = {name:objectName}
                  }                
                }
                return r;
              },{});
    
    return devices;
     
}


const ChangeWifiAccessPointScreen = (props) => {

   
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    
    const { t, i18n } = useTranslation();
    const {theme,baseColors} = useTheme();  

    const [currentSSID,setCurrentSSID] = useState('')
    const [currentBSSID,setCurrentBSSID] = useState('');
   
    const [wifiPassword,setWifiPassword] = useState('');
    
    const [changeProcess,setChangeProcess] = useState('start');
    
    const [knownDevices,setKnownDevices] = useState({});  

    const [smartConfigStatus,setSmartConfigStatus] = useState('');
    const [forceUpdate,setForceUpdate] = useState(-1);
    const networkState = useSelector(state => state.network);
    const objectsByEventsName = useSelector(state => state.objects.objectsByEventsName)
    const objectsByIds = useSelector(state =>state.objects.entities.objects);

    const title = t("addProduct:REASSOCIATION_OF_DEVICES");
    
    const debugRef = useRef({logs:[]});
    const mySocketRef = useRef(null);
    const foundDevicesRef = useRef({});
    const myIdsRef = useRef([]);
   
    //============================================
    const getSSID = async() => { 

        try {
          let currentSSID = "";
          const searchCurrentSSID = await WifiHelpers.getSSID().then((res) => {currentSSID = res},(err)=> { console.log("err",err)})
         
          debugLog({'currentSSID':currentSSID})
          if(currentSSID == "<unknown ssid>") {
            ssidError("noWIFI")

          } else {
            
            setCurrentSSID((currentSSID == "")? "--" : currentSSID);
            debugLog({"found ?":currentSSID})
            let bssid="";
            if(Platform.OS == "android") {
              const bssidSearch = await WifiHelpers.getBSSID().then((res) => {bssid = res},(err)=> { console.log("err",err)})
              setCurrentBSSID(bssid);    
            }            
            return "ok pour le SSID"        
          }          
        } catch(err) {            
            ssidError(err)
        }
        
    }
    //-------
    const ssidError = () => {
        const alertTitle = t("addProduct:WIFI_NO_SSID_ALERT_TITLE").toUpperCase();
        const alertBody = t("addProduct:WIFI_NO_SSID_ALERT_BODY");        
        showAlert(alertTitle,alertBody);
      }

      //-------
      const showAlert = (alertTitle,alertBody,callback) => {
        Alert.alert(
          alertTitle,
          alertBody,
          [        
            {
              text: "ok",
              onPress: () => {
                console.log('Cancel Pressed')
                if(callback)callback();
              },
              style: 'cancel'
            }
          ]
        );
      }

    //-----------
      const goBackGeoLocalisationOff = () => {
        navigation.goBack();
      }
    //--------------------------------------------
    async function initWifiSearch() {
        const fineAccessLocationPermission = await requestPermission();
        console.log("fineAccessLocationPermission ----->",fineAccessLocationPermission)
        //debugLog({"permission":fineAccessLocationPermission})

        let permission = false;
        console.log('yo',fineAccessLocationPermission)
        const test = ""+fineAccessLocationPermission+""
        
        switch(fineAccessLocationPermission) {
            case "unavailable" :
              //console.log("youyouyouyouyou nnnnnooooooooooo");
              //showAlert("Localization service unavailbale","Please Turn Localisation On");
              
              break;
            case "granted":
             permission = true;
          }

          // finally check location everyTime
          permission = true;


        if(permission) {
          //setAccessAllowed(true);
          const clie = await checkLocationIsEnabled();
          console.log({"clie===>>>":clie})



        if(clie && clie.error == undefined) {
          console.log("je passe ici")
              getSSID().then((res2)=> {
                 
                  debugLog({'res2':res2});
                }
                ,(err) => {
                    console.log(err);this.ssidError(err)
                  });
          } else {
            console.log("error localisation inactive")
            switch(clie.error.code) {
              case 2 :
                showAlert("",t("addProduct:LOCATION_ACTIVATE"),goBackGeoLocalisationOff);
                break;
              case 3 :
                showAlert("",t("addProduct:LOCATION_NOT_READY"),goBackGeoLocalisationOff);
                break;
              default:
                console.log("unexpected error("+clie.error.code+")")
            }
          }
        } else {
          //
        }
      }

    //============================================
    useEffect(() => {

        setKnownDevices(buildProductByDeviceId(objectsByEventsName,objectsByIds));
        //initWifiSearch(); // will be done in networkState effect

        return () => {
            // unmount
            doFinishEspTouch();
            if(mySocketRef.current != null) {
                mySocketRef.current.close();
            }
        };



      } , []);

    //----------
    useEffect(() => {
        console.log("ça bouge au niveau du réseau !!",networkState);
        if(debugRef) {
          console.log("on inscrit ça")
          debugLog(networkState)
        }
 
 
        let canInitSearch;
        if(Platform.OS == 'android')canInitSearch = (networkState.isConnected && networkState.isWifiEnabled && networkState.type == 'wifi');
        if(Platform.OS == 'ios')canInitSearch = (networkState.isConnected && networkState.type == 'wifi');
        if (canInitSearch){
         debugLog({'action':'must initWifiSearch()'})
         initWifiSearch();
        }
        
        if(networkState.isConnected == false || networkState.type != "wifi") {
          setCurrentSSID("--")
         
        }
 
 
      }, [networkState]);

      useEffect(() => {
        console.log("force update !!!! to redraw with new ref values",foundDevicesRef)
 
      }, [forceUpdate]);



    //============================================
    const onDebug = () => {
        const debugBody = JSON.stringify(debugRef.current.logs);
        showAlert("deboug",debugBody);
    }

    const debugLog = (data) => {
       debugRef.current.logs.push(data);
    }
    //============================================
    const checkSpeakingObject = (address,deviceId,type) => {
 
        console.log("checkSpeakingObject",myIdsRef.current);
        let device = knownDevices[deviceId];   
        console.log("deviceId",deviceId,"device",device,"foundDevicesRef",foundDevicesRef.current)    
        if(device != undefined) { 
          if(foundDevicesRef.current[deviceId] == undefined) {
            foundDevicesRef.current[deviceId] = device;
           
            if(myIdsRef.current.indexOf(deviceId) == -1) {
                myIdsRef.current.push(deviceId)   
            }
            setForceUpdate(Date.now())  
          }          
        }      
    }

    const startUdpSocket = () => {
        
        // parent is the screen context here to enable the  call to checkPendingObject
        const options = {type:'udp4',reusePort:true};    
        mySocketRef.current = dgram.createSocket(options);    
        mySocketRef.current.bind(10300);
          
          
        mySocketRef.current.on( "error", (error) => {
          console.log("UDP socket ERROR", error.message);
          if (error.message.indexOf("EADDRINUSE") != -1) {      
            //this.setState({'smartConfigStatus':'errorAddrInUse'});     
          }
        });
        mySocketRef.current.on('message', function(data, rinfo){
            console.log("Device ID:"+rinfo.id,"Type:"+rinfo.type,"IP:"+rinfo.address);    
            console.log(rinfo);
            checkSpeakingObject(rinfo.address,rinfo.id,rinfo.type)
            }
        ); 
      }
    const startUpd = () => {
        startUdpSocket();  
    }
    //---------
    const doFinishEspTouch = () => {
        //RNEsptouch.finish();
    }

    const doInitEspTouch = () => {
        console.log("//RNEsptouch init");        
        //RNEsptouch.finish();
        //RNEsptouch.initESPTouch();        
    }



    const doStartSmartConfig = () => {
 
       /* RNEsptouch.startEncryptedSmartConfig(currentSSID,currentBSSID,wifiPassword,1).then((res) => {
        console.log("EspTouchMessage",res)
          if (res.code == 200)
          {
            console.log("success",res);         
            doRestartSmartConfig();
          } else {
            console.log("//RNEsptouch.startEncryptedSmartConfig res( Pas d\'objet)",res);
            if(res.code == 0) setSmartConfigStatus('failNoDevice')
            if(res.code == -3) setSmartConfigStatus('failNoWifi')
            if(res.code == 0) doRestartSmartConfig();
          }
        },
        (err) => {
          console.log('//RNEsptouch.startEncryptedSmartConfig err  Grosse Erreur',err)
          setSmartConfigStatus('fail');
        }
      );*/
      console.log("//RNEsptouch startEncryptedSmartConfig started")
    }

    const doRestartSmartConfig = () => {       
        doStartSmartConfig();
      }


    const doStartSequence = () => {
        console.log("doInitEspTouch");       
        startUdpSocket();
        doInitEspTouch(); 
        setTimeout(() => {
          console.log("thenStart SmartConfig before socket"); 
          doStartSmartConfig();
        }, 1000);
      
      }



    //=============================================
    const handleChange = (fieldId,val) => {
        setWifiPassword(val);
    }

    //--------------------------------------------
    const goToStepWifiCredentials = () => {
        setChangeProcess("wifi")
    }

    const goToListenDevices = () => {
        setChangeProcess("listen");
        doStartSequence();
      }

    const  finishProcess = () => {
        doFinishEspTouch();
          if(mySocketRef.current != null) {
            mySocketRef.current.close();
          }
          navigation.goBack();
      }



     //++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // const bodyTextColor = theme['add_product_list_name_color'] || theme["onBody"];
     const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
     const bodyTextColor = textColor


     return (
        <SafeAreaView style={{flex:1,backgroundColor:theme['color--bg']}}> 
            <View style={{minHeight:84,alignItems:'center',justifyContent:'center'}}>
            <HeaderWithBack title={title} bgColor={headerBackgroundColor} color={headerTextColor} noclose themeDependency/>
            </View>
            <Body>           
                {changeProcess == 'start' &&
                    <>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',margin:30}}>
                        {/*<LinesLoader color={bodyTextColor}/>*/}
                        </View> 
                        <Text style={{fontSize:18,color:bodyTextColor}}>{t('addProduct:CHANGE_ACCESS_POINT_WIFI')}</Text>
                        <AccessButton title={t("OK")}  specialColor={bodyTextColor} onPress={goToStepWifiCredentials} isCentered/> 
                    </>                
                }
                {changeProcess == "wifi" &&
                  <KeyboardAvoidingView  style={{flex:1}} behavior="position" >       
                  <View style={{padding:15}}>
                    
                    <BodyText color={bodyTextColor}>{t("addProduct:WIFI_NAME_LABEL")}</BodyText>
                    <View>
                      {(currentSSID !=="--" && currentSSID !=="") ?
                        <>                     
                            <BodyText color={bodyTextColor} style={{marginTop:15}}>{t('addProduct:WIFI_GENERIC_CURRENT_SSID',{smartphone:'smartphone',network:currentSSID})}</BodyText>
                            <FormInput name='wifiPassword' value={wifiPassword} placeholder={t("addProduct:WIFI_PASSWORD")} autoCapitalize='none' secureTextEntry passwordToggle   onChangeText={(txt) => handleChange("wifiPassword", txt)} color={bodyTextColor} iconColor={bodyTextColor}/>
                            <AccessButton  onPress={goToListenDevices} specialColor={bodyTextColor} title={t("BUTTON_NEXT")}/>
                        </> 
                        :
                        <>                     
                        <BodyText color={bodyTextColor} style={{marginTop:15}}>{t('addProduct:CURRENT_SSID_UNKNOWN')}</BodyText>                            
                        </>  
                      }
                      </View>
                  </View>
                </KeyboardAvoidingView>
                }
                {changeProcess == "listen" &&
                
                  <View style={{padding:15}}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                     
                      <MyText color={bodyTextColor} style={{marginTop:10}}>{t("addProduct:UDP_LISTEN_FOR_DEVICES")}</MyText>
                    </View>                    
                    <View style={{height:15}}/>
                    {myIdsRef.current.length > 0 &&
                      <MyText color={bodyTextColor} centered>{t("addProduct:UDP_FOUND_DEVICE",{count:myIdsRef.current.length})}</MyText>
                    }
                    <View style={{height:15}}/>
                    <View style={{alignItems:'center',justifyContent:'center',marginBottom:15}}>
                      {myIdsRef.current.map((v,i) =>{
                          let name = "-";
                          if(foundDevicesRef.current[v] && foundDevicesRef.current[v].name)name = foundDevicesRef.current[v].name
                         
                          return (
                            <MyText color={bodyTextColor} style={{marginTop:5,marginBottom:5}}>{name}</MyText>
                           
                          )

                      })}
                    </View>
                    {myIdsRef.current.length > 0 &&
                       <MyText color={bodyTextColor} centered style={{marginTop:10}}>{t("addProduct:STILL_LISTENING")}</MyText>
                    }
                    <AccessButton  onPress={finishProcess} specialColor={bodyTextColor} title={t("FINISH").toUpperCase()}/>
                  </View>               
                }                
               
            </Body>
            
      </SafeAreaView>
     )

}

export default ChangeWifiAccessPointScreen



const Body= styled.ScrollView`    
    padding:15px;    
`;

const MyText = styled.Text`
    color:${props => props.color || "red" };
    font-size:${props => props.fontSize || 14}px;
    ${({centered}) => centered  && `
        text-align: center;
    `}
`;  
const BodyText = styled(MyText)`   
    font-size:14px;
`;

const TitleText = styled(MyText)`   
    font-size:22px;    
`;

const VSpacer = styled.View`
    height:${attrs => attrs.height|| 20}px;
`;