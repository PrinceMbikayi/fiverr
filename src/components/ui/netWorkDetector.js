import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import '_brand/templates/screens/addObject/locales';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
 
 
//import AppIcon from '_images/icons/index.js';
import Icon from 'react-native-vector-icons/Ionicons';
//import {NETWORK_DETECTOR} from '_brand/config/appIconSharedNames'
import { Api } from '_api';
 
import ModalContainer from '_brand/templates/components/ui/modal/modalContainer';
import { useGlobalModal } from '_components/ui/globalModal';
//import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import { useTheme } from '_theming/themeProvider';
import { useTranslation } from 'react-i18next';

 
 
 
 
export const NetworkDetector = (props) => {
 
    const isInternetReachable = useSelector(state => state.network.isInternetReachable);
    const serverIsDown = useSelector(state => state.network.serverIsDown);
    const iconName = "md-wifi";
    const iconColor = "black";
    const iconBackgroundColor = "orange";
    const iconSize  = 20;
    const {getNavigation} = props;
    const dispatch = useDispatch();
    const tryReconnectTime = 10000
 
 
 
    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

     const globalModal = useGlobalModal();
  
 
 
  const netInfo = useNetInfo();
 
 
 
  const checkGrantedAndMove = async() => {
    const navigation = getNavigation();
    let isGranted = await Api.checkUserIsGranted();       
      console.log("isGranted XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ",isGranted)
 
    if(isGranted == true && navigation) {
      console.log("alors bouge");
      const response = await Api.getObjects()
      console.log("response_in_checkGrantedAndMove : ",response);

      if(response?.errCode == 200) {
        console.log('response OK');
        navigation.navigate("App",{screen:"Home"});
      }else{
        navigation.navigate("Access",{screen:"AccessScreen"});
      }
      console.log("bougé normalement")
 
    }
  }
 
 
 
  useEffect(()=> {
    console.log("netInfo hooked changed",netInfo)
  },[netInfo]);
 
 
    useEffect(()=> {
 
      unsubscribeNetInfo = NetInfo.addEventListener(state => {   
 
        const  cState = JSON.parse(JSON.stringify(state))
        console.log("[NetworkDetector] NetInfo change",cState,cState.isInternetReachable)
        
        if(cState?.isInternetReachable){
          const navigation = getNavigation();
          
          if(navigation) {
           // console.log("navigation => ",navigation.getCurrentRoute())
            const currentRoute = navigation.getCurrentRoute()
              if(currentRoute?.name == "Access") {
                checkGrantedAndMove();
              }
          }
         
            
        }
        
        }
      )
 
      return unsubscribeNetInfo;
 
    },[]);
 
 
 
    useEffect(() => {
     // console.log("isInternetReachable >",isInternetReachable)
     // console.log("serverIsDown >",serverIsDown)
      // here to refresh
    },[isInternetReachable,serverIsDown])
 
    useEffect(() => {
     // console.log("serverIsDown >",serverIsDown)
      //checkUserIsGranted()
      
    },[serverIsDown])
 

          const onOpenSelect = () => {  

            NetInfo.fetch().then(state => {
              console.log("Connection type", state.type);
              console.log("Is connected?", state.isConnected);
              console.log(JSON.stringify(state))
              console.log("globalModal",globalModal)
              const mapped = []
              mapped.push({label:"isConnected",value:state.isConnected})
              mapped.push({label:"isInternetReachable",value:state.isInternetReachable})
              mapped.push({label:"isWifiEnabled",value:state.isWifiEnabled})
              if(state.details) {
                mapped.push({label:"----------",value:"----------"})
                mapped.push({label:"details",value:JSON.stringify(state.details)})
              }
              console.log('mappedMe',mapped);
              const configLabel = {
                "isConnected":{label:"Connexion au réseau", nonOkValue:"Non connecté",okValue:"Connecté" },
                "isInternetReachable":{label:"Connexion Internet",  nonOkValue:"Non accessible",okValue:"Accessible"},
                "isWifiEnabled":{label:"Etat Wifi", nonOkValue:"Eteint",okValue:"Allumé"},
              }

            
              const content = 
              <View style={{width:300,height:100, backgroundColor:'white',
                            alignSelf:'center',justifyContent:'center',
                            alignItems:'center',padding:0, borderRadius:14,
                            borderWidth:1,borderColor:'orange',
                          }}>
                  {mapped.map((v,i) => {
                    const label = v?.label;
                    const value = v?.value;
                    return (
                      <View>
                        {label == "isConnected" &&
                          <Text key={i} style={{fontSize:16, fontWeight:"600"}}>{configLabel[label].label} : {` ${value ? configLabel[label].okValue : configLabel[label].nonOkValue}`}</Text>
                        }
                        {label == "isInternetReachable"&&
                          <Text key={i} style={{fontSize:16, fontWeight:"600"}}>{configLabel[label].label} : {` ${value ? configLabel[label].okValue : configLabel[label].nonOkValue}`}</Text>
                        }
                        {label == "isWifiEnabled"&&
                          <Text key={i} style={{fontSize:16, fontWeight:"600"}}>{configLabel[label].label} : {` ${value ? configLabel[label].okValue : configLabel[label].nonOkValue}`}</Text>
                        }
                      </View>
                    )
                  })}
              </View>
              globalModal.setContent(content,{type:'centered'});    
              globalModal.toggle();
            });
          }

    

        const buttons = [
          {
              id:"return",
              text:"RETURN",
              //text:`${t(tns + ":" + "RETURN")}`,
              action:()=>onCancelPressed(),
              textColor:"#007AFF"
          },
      ]
 
      const onCancelPressed = () => {
        console.log('CANCEL_DELETE :');
        globalModal.close();
      }

    
    const checkNetworkManually = () => {
      onOpenSelect()
//       console.log("checkNetworkManually !!");
      
      NetInfo.fetch().then(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        console.log(JSON.stringify(state))
        console.log("globalModal",globalModal)
        const mapped = []
        mapped.push({label:"isConnected",value:state.isConnected})
        mapped.push({label:"isInternetReachable",value:state.isInternetReachable})
        mapped.push({label:"isWifiEnabled",value:state.isWifiEnabled})
        if(state.details) {
          mapped.push({label:"----------",value:"----------"})
          mapped.push({label:"details",value:JSON.stringify(state.details)})
        }
        console.log('mappedMe',mapped);
      
        const content = 
        <ModalContainer>
        {mapped.map((v,i) => {
          return (
            <Text key={i} style={{fontSize:16}}>{v?.label} : {""+v?.value}</Text>
          )
        })}
        </ModalContainer>
        globalModal.setContent(content,{type:'centered'});    
        globalModal.show();
        console.log("normalement")
      });
    }
 
    
 
    return (
       <>
        {(!isInternetReachable || serverIsDown ) &&
            <View style={{position:'absolute',flex:1,bottom:10,left:15}}>
              <Pressable onPress={()=>onOpenSelect()}>
                  <View style={{width:iconSize,height:iconSize,backgroundColor:iconBackgroundColor,alignItems:'center',justifyContent:'center',borderRadius:iconSize/2,flex:1}}>
                  {/* <AppIcon name={NETWORK_DETECTOR} color="black" size={iconSize*0.9} /> */}
                  <Icon name={iconName} size={iconSize} color={iconColor}/>                  
                 </View>
                </Pressable>
             </View>
        }
      </>
    );
}