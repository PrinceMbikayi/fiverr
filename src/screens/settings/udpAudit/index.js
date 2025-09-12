import React from 'react';
import {useContext,useState,useEffect,useRef} from 'react';
import { Text, View ,ScrollView,SafeAreaView,FlatList,Linking} from 'react-native';
import { connect,useSelector,useDispatch,shallowEqual} from "react-redux";
import { useTranslation } from 'react-i18next';

import dgram from 'react-native-udp';

import AccessButton from '_components/forms/accessButton';
import { useTheme} from '_theming/themeProvider'
import {HeaderWithBack} from '_components/headers/header-with-back';

import {objectPairingInfos} from '_config/products/core';


const atHomePairingTable = Object.keys(objectPairingInfos).reduce((r,keyName,i) => {

    const rKey = objectPairingInfos[keyName].type+"_"+objectPairingInfos[keyName].subtypeNumber;
    
    r[rKey] = {'atHomeType':keyName,...objectPairingInfos[keyName]};
    return r;

},{})


const UdpAuditHomeScreen = (props) => {
    const test="Test";

    const { t, i18n } = useTranslation();
    const {theme ,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
   
    const navigation = props.navigation;
    
    const devicesIpRef = useRef([]);
    const devicesRef  = useRef([]);
    const udpSocket = useRef(false)
    

    // componentDidMount && unmount
    useEffect(() => {

        
        return () => {
           /* component will unload */
            console.log("unmount");
            if(udpSocket.current) {
                udpSocket.current.close();
            }
          };
     }, []);

     // states

    const [talkingDevicesIp,setTalkingDevivesIp] = useState([]);
    const [talkingDevices,setTalkingDevices] = useState([])

    const updateDevicesList = () => {
        console.log("updateDevicesList",devicesRef.current);
        setTalkingDevices([...devicesRef.current]);
    }

    const addTalkingDevice = (type,numericSubtype,rinfo) => {
        //parent.checkPendingObject(rinfo.address,rinfo.id,type,numericSubtype)
        const pairingKey = type+"_"+numericSubtype;
        //const typeInfos = atHomePairingTable[pairingKey];
        const newEntryIp = rinfo.address;
        const newEntry = {'type':type,'numericType':numericSubtype,'firmware':rinfo.firmware,'ip':rinfo.address};
        //let currentIps = [...talkingDevicesIp];
        //currentIps.push(newEntryIp)
        //setTalkingDevivesIp(currentIps);
        //let currentDevices = [...talkingDevices];
        //currentDevices.push(newEntry);
        //setTalkingDevices(currentDevices);
        console.log("---->",talkingDevices,newEntryIp,newEntry)
        if(devicesIpRef.current.indexOf(newEntryIp) == -1) {
            devicesIpRef.current.push(newEntryIp);
            devicesRef.current.push(newEntry)
            updateDevicesList()
        }
       

    }



    const updateDevices = () => {

    }

    const startAudit = () => {
       // mySocket = null;
        
        // parent is the screen context here to enable the  call to checkPendingObject
        const options = {type:'udp4',reusePort:true};    
        udpSocket.current = dgram.createSocket(options);    
        udpSocket.current.bind(10300);

        udpSocket.current.on( "error", (error) => {
            console.log("UDP socket ERROR", error.message);
            if (error.message.indexOf("EADDRINUSE") != -1) {      
                //this.setState({'smartConfigStatus':'errorAddrInUse'});     
            }
        });
        udpSocket.current.on('message', function(data, rinfo){
            
                console.log(rinfo);
                const type = rinfo.type.trim();
                const numericSubtype = rinfo.subtype ;
                const ip = rinfo.address;
                console.log(ip,talkingDevicesIp);
                if(talkingDevicesIp.indexOf(ip) == -1) {
                    console.log("so add")
                    addTalkingDevice(type,numericSubtype,rinfo);
                }

            }
        ); 

    }
   
    const goBack = () => {
        console.log("goBack !!!!!")
        navigation.navigate('Settings');
        console.log(",udpSocket.current",udpSocket.current)
        if(udpSocket.current ) {
            console.log("on ferme")
            udpSocket.current.close();
          }
      }

    const RenderItem = (item) => {
        console.log("RenderItem",item)
        return (
            <View>
                <Text style={{color:textColor}}>A {item.type} - {item.numericType} - {item.firmware} </Text>
            </View>
        )
    }

    const openMarket = () => {
        Linking.openURL("market://details?id=com.foscam.foscam");
    }


    return (
        <SafeAreaView style={{flex:1,backgroundColor:theme['color--bg']}}>
            <HeaderWithBack title={"Audit UDP"} goBack={{action:goBack}} themeDependency/>
            <View style={{margin:15}}>
                <Text style={{color:textColor}}>audit UDP juste pour vérification des objets sur le même réseau pour tests</Text>
                <AccessButton  onPress={startAudit} specialColor={textColor} title={t("START")}/>
                {/*
                <AccessButton  onPress={openMarket} specialColor='#FFFFFF' title={"test open google play"}/>
                */}
            </View>  
            {/* <FlatList data={talkingDevices}  keyExtractor={item => item.ip} renderItem={RenderItem}    />  */}
            <ScrollView style={{flex:1,backgroundColor:'transparent',margin:15}}>
            
            { talkingDevices.map((v,i) => {

                return (
                    <Text style={{color:textColor}}>- [{v.ip}] : {v.type} ({v.numericType})  - {v.firmware}</Text>
                )
            })
            }
            </ScrollView>
        </SafeAreaView>   
   
)
    };

export default UdpAuditHomeScreen;

const titleStyle = {}