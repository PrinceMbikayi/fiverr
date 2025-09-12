import React, { Component } from 'react';
import { connect } from "react-redux";
import { View, Text, ScrollView,SafeAreaView,Platform,KeyboardAvoidingView } from 'react-native';
import { i18next,withTranslation } from 'react-i18next';


import dgram from 'react-native-udp';
import styled from 'styled-components/native';
import Toast from 'react-native-root-toast';

import {request, PERMISSIONS} from 'react-native-permissions';
//import //RNEsptouch from 'react-native-esptouch';

import {WifiHelpers} from '_helpers';
import { withTheme } from '_theming/themeProvider';
import * as ApiObjects from '_api/objects';
//import  { pairingObject   as  ApiObjects} from '_api/objects';
// --- special design   
import {HeaderWithBack} from '_components/headers/header-with-back';
import FormInput from '_components/forms/formInput';
import AccessButton from '_components/forms/accessButton';
import {objectPairingInfos} from '_config/products/core';





class ChangeWifiAccessPointScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentSSID:'',
        currentBSSID:"dummy for ios",
        networks:[],
        pendingObjects:{},
        changeProcess:'start',/*  */
        lastPairing:{},
        deviceName:'',
        lastPairingId:'',
        lastPairingEventName:'',
        lastPairingName:'--',
        wifiPassword:'',
        knownDevices:{},
        foundDevices:{},
        foundDeviceIds:[]
       
    };
   
  }








requestPermission = () => {
  
  request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(response => {
          //returns once the user has chosen to 'allow' or to 'not allow' access
          //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          console.log("requestPermission",response)
          this.getSSID();
      },err => {
          console.log("erreur à ce niveau ",err)
      });
};


buildProductByDeviceId = () => {

  const {objectsByEventsName,objectsByIds} = this.props

  const devices = Object.keys(objectsByEventsName).reduce(function(r,key,i) {

              let eventName = key+"";             
              if(eventName.length > 0 && eventName.slice(-1) == "/") {
               
                eventName = eventName.slice(0,-1);                
                if(eventName.indexOf("/")!=-1) {
                
                  const deviceId = eventName.split("/").pop();                 
                  const objectId = objectsByEventsName[key];                 
                  const objectName = objectsByIds[objectId].name;
                  r[deviceId] = {name:objectName}
                }                
              }
              return r;
            },{});
  
  this.setState({'knownDevices':devices})
   
}



componentDidMount(){
 
  this.requestPermission();
  this.buildProductByDeviceId()   
  //this.doStartSequence();

}
 




doStartSequence = () => {
  console.log("doInitEspTouch");
 
  this.startUdpSocket(this);
  this.doInitEspTouch();
  
  
  setTimeout(() => {
    console.log("thenStart SmartConfig before socket"); 
    this.doStartSmartConfig();
}, 1000);

}

startUpd = (that) => {
  this.startUdpSocket(that);  
}

componentWillUnmount() {
    this.doFinishEspTouch();
    if(this.mySocket != null) {
        this.mySocket.close();
    }
}

doInitEspTouch = () => {
  console.log("//RNEsptouch init");
  ////RNEsptouch.finish().then(()=>{//RNEsptouch.initESPTouch();},(err)=>{console.log("//RNEsptouch",err);//RNEsptouch.initESPTouch();})
  //RNEsptouch.finish();
  //RNEsptouch.initESPTouch();
  
}
doFinishEspTouch = () => {
  //RNEsptouch.finish();
}
 
doRestartSmartConfig = () => {
  console.log("doStartSmartConfig")
  this.doStartSmartConfig();
}

doStartSmartConfig() {
 
     /*
      // last param  //RNEsptouch.startEncryptedSmartConfig 
      // 1 : broadcast et 0 : multicast (tenter)
      // relancer 1 fois après le 1er echec timer de 5 à 6 secondes 
	    //RNEsptouch.startEncryptedSmartConfig(this.state.currentSSID,this.state.bssid,this.state.wifiPassword,1).then((res) => {
      console.log("EspTouchMessage",res)
        if (res.code == 200)
        {
          console.log("success",res);         
          this.doRestartSmartConfig();
        } else {
          console.log("//RNEsptouch.startEncryptedSmartConfig res( Pas d\'objet)",res);
          if(res.code == 0) this.setState({'smartConfigStatus':'failNoDevice'})
          if(res.code == -3) this.setState({'smartConfigStatus':'failNoWifi'})
          if(res.code == 0) this.doRestartSmartConfig();
        }
      },
      (err) => {
        console.log('//RNEsptouch.startEncryptedSmartConfig err  Grosse Erreur',err)
        this.setState({'smartConfigStatus':'fail'})
      }
    );
    console.log("//RNEsptouch startEncryptedSmartConfig started")

 */

}
/*
checkRNEsptouch = async() => {
  const infos = await //RNEsptouch.getNetInfo().catch((err) => {console.log("check//RNEsptouch"),err});

}
*/


mySocket = null;

startUdpSocket = (parent) => {
  // parent is the screen context here to enable the  call to checkPendingObject
  const options = {type:'udp4',reusePort:true};    
  this.mySocket = dgram.createSocket(options);    
  this.mySocket.bind(10300);
    
    
  this.mySocket.on( "error", (error) => {
    console.log("UDP socket ERROR", error.message);
    if (error.message.indexOf("EADDRINUSE") != -1) {      
      this.setState({'smartConfigStatus':'errorAddrInUse'});     
    }
  });


  this.mySocket.on('message', function(data, rinfo){
      console.log("Device ID:"+rinfo.id,"Type:"+rinfo.type,"IP:"+rinfo.address);    
      console.log(rinfo);
      parent.checkSpeakingObject(rinfo.address,rinfo.id,rinfo.type)
      }
  ); 
}
//-------------------------------------------
/** ANCHOR - listen devices */
checkSpeakingObject = (address,deviceId,type) => {
 
  let device = this.state.knownDevices[deviceId];
  console.log(this.state.knownDevices);
  if(device != undefined) { 
    if(this.state.foundDevices[deviceId] == undefined) {
      let newVal = {...this.state.foundDevices};
      newVal[deviceId] = device;
      console.log("newVal",newVal)
      this.setState({"foundDevices":newVal})
      let _ids = this.state.foundDeviceIds;
      _ids.push(deviceId)
      console.log("_ids",_ids);
      this.setState({'foundDeviceIds':_ids})
      console.log("J'ai ajouté -----> ("+device.name+")")
    }
    
  }

}


startSmartConfig = () => {
    this.doStartSmartConfig();
    this.setState({'smartConfigStatus':'running'})
}



handleNameChange = (field,newVal) => {
  this.setState({deviceName:newVal})
}

handleChange = (fieldId,val) => {
  this.setState({"wifiPassword":val})
}

goToStepWifiCredentials = () => {
  this.setState({'changeProcess':"wifi"})
}

goToListenDevices = () => {
  this.setState({'changeProcess':"listen"});
  this.doStartSequence();
}

getSSID = async() => {
  
  try {
    
    const currentSSID = await WifiHelpers.getSSID()
    this.setState({'currentSSID':currentSSID})
    if(Platform.OS == 'android') {
      const bssidSearch = await WifiHelpers.getBSSID().then((res) => {bssid = res},(err)=> { console.log("err",err)})
      this.setState({currentBSSID:bssid})
    }
  } catch(err) {   
    //console.log("err register",err);
   this.ssidError(err)
  }

}

finishProcess = () => {
  this.doFinishEspTouch();
    if(this.mySocket != null) {
        this.mySocket.close();
    }
    this.props.navigation.goBack();
}

  render() {
    const { t,theme } = this.props;
    const title = t("addProduct:REASSOCIATION_OF_DEVICES");
    return (
        <SafeAreaView style={{flex:1,backgroundColor:theme['color--bg']}}> 
            <View style={{minHeight:84,alignItems:'center',justifyContent:'center'}}>
            <HeaderWithBack title={title}  close/>
            </View>
            <Body>           
                {this.state.changeProcess == 'start' &&
                    <>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',margin:30}}>
                        {/*<LinesLoader color={theme.onBody}/>*/}
                    </View>                  
                    
                    <Text style={{fontSize:18,color:theme.onBody}}>{t('addProduct:CHANGE_ACCESS_POINT_WIFI')}</Text>
                    <AccessButton title={t("OK")}  onPress={this.goToStepWifiCredentials} isCentered/> 
                    </>                
                }
                {this.state.changeProcess == "wifi" &&
                  <KeyboardAvoidingView  style={{flex:1}} behavior="position" >       
                  <View style={{padding:15}}>
                    
                    <BodyText color={theme.onBody}>{t("addProduct:WIFI_NAME_LABEL")}</BodyText>
                    <View>
                      {this.state.currentSSID !=="" &&
                        <>
                     
                     <BodyText color={theme.onBody} style={{marginTop:15}}>{t('addProduct:WIFI_GENERIC_CURRENT_SSID',{smartphone:'smartphone',network:this.state.currentSSID})}</BodyText>
                      <FormInput name='wifiPassword' value={this.state.wifiPassword} placeholder={t("addProduct:WIFI_PASSWORD")} autoCapitalize='none' secureTextEntry passwordToggle   onChangeText={(txt) => this.handleChange("wifiPassword", txt)} color={theme.onBody} iconColor='white'/>
                      <AccessButton  onPress={this.goToListenDevices} specialColor={theme.onBody} title={t("BUTTON_NEXT")}/>
                      </>  
                      }
                      </View>
                  </View>
                </KeyboardAvoidingView>
                }
                {this.state.changeProcess == "listen" &&
                
                  <View style={{padding:15}}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                     
                      <MyText color={theme.onBody} style={{marginTop:10}}>{t("addProduct:UDP_LISTEN_FOR_DEVICES")}</MyText>
                    </View>                    
                    <View style={{height:15}}/>
                    {this.state.foundDeviceIds.length > 0 &&
                      <MyText color={theme.onBody} centered>{t("addProduct:UDP_FOUND_DEVICE",{count:this.state.foundDeviceIds.length})}</MyText>
                    }
                    <View style={{height:15}}/>
                    <View style={{alignItems:'center',justifyContent:'center',marginBottom:15}}>
                      {this.state.foundDeviceIds.map((v,i) =>{
                          const name = this.state.foundDevices[v].name
                          return (
                            <MyText color={theme.onBody} style={{marginTop:5,marginBottom:5}}>{name}</MyText>
                          )

                      })}
                    </View>
                    <AccessButton  onPress={this.finishProcess} specialColor={theme.onBody} title={t("FINISH").toUpperCase()}/>
                  </View>
               
                }
                
               
            </Body>
            
      </SafeAreaView>
    );
  }

}

export default withTranslation()(withTheme(connect(mapStateToProps)(ChangeWifiAccessPointScreen)))

function mapStateToProps(state){
  console.log(state.objects.objectsByEventsName)
  return {   
    previousRoute:state.app.previousRoute,
    objectsByEventsName :state.objects.objectsByEventsName,
    objectsByIds : state.objects.entities.objects
  }
};

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