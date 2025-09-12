import React, { Component } from 'react';
import { View, Text,SafeAreaView,Image} from 'react-native';
import {useContext,useState,useRef,useEffect} from 'react';
import { useStore,useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions,CommonActions } from '@react-navigation/native';

import Toast from 'react-native-root-toast';
// exemple styledTheme
import styled,{ThemeProvider} from 'styled-components/native';
import CheckBox from '@react-native-community/checkbox';
import LottieView from 'lottie-react-native';
import { AnimatedLoaderMaison } from '_assets/lotties/LoaderMaison';
import { AnimatedCheck} from '_assets/lotties/check';

import { useTheme } from '_theming/themeProvider';

import {HeaderWithBack} from '_components/headers/header-with-back';

import FormInput from '_components/forms/formInput';
import AccessButton from '_components/forms/accessButton';
import {objectPairingInfos} from '_config/products/core';
//import * as ApiObjects from '_api/objects';
import {pairingObject as ApiPairingObject} from '_api/objects';
import {Api} from '_api';
import {refreshObjectAction} from '_actions/asyncActions';
import {appRoutesNames} from '_config/AppConfig';
import {getObjectsByIds,getObjectsByEventsName,getObjectsByNames} from '_helpers/selectors';

const sleep = m => new Promise(r => setTimeout(r, m))

const DoorKeeperSimpleRegisterScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    const store = useStore();
   
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {};
   const {itemId,update : isUpdate, deviceUid, deviceSn} = navigationParams; 
   


    const objectsByEventsName = useSelector(getObjectsByEventsName);   
    const objectsByIds = useSelector(getObjectsByIds);    
    const objectsByNames = useSelector(getObjectsByNames);
    
   
    const [deviceName,setDeviceName] = useState('');
    const [deviceOptions,setDeviceOptions] = useState({});
    //pairing
    const [currentStep,setCurrentStep] = useState('pairing'); /* pairing */    
    const [createdVdpId,setCreatedVdpId] = useState(null)
    const [existsName,setExistsName] = useState('--');
    const title = t('doorkeeper:'+((isUpdate != undefined) ? 'ADD_DOORKEEPER' : 'ADD_DOORKEEPER'));   
    const devicePairingInfos = {atHomeType:"VDP",...objectPairingInfos["VDP"]};


    const bodyTextColor = textColor;
    const backgroundColor = bgColor;
    const invertOnBody = theme.onBodyInverse;
    const styledTheme = {'color':bodyTextColor};

    // DID MOUNT
    useEffect(() => {
       
      }, []);

      const handleNameChange = (field,newVal) => {
        setDeviceName(newVal);
      }

      const completePairing = async() => {
       
        if(objectsByNames[deviceName] != undefined) {
         
            let msg ="\n"+t("addProduct:DEVICE_NAME_ALREADY_IN_USE");      
            Toast.show(msg,{position: Toast.positions.TOP,duration:Toast.durations.LONG});
            return false;
        }
        if(deviceName.length < 4) {
          let msg ="\n"+t("addProduct:DEVICE_NAME_TOO_SHORT");      
            Toast.show(msg,{position: Toast.positions.TOP});
        } else {
          
          const dd = new Date();
          const deviceId = (deviceUid  != "generic") ? deviceUid : "VDP_TEST_"+dd.getTime(); 
          setCurrentStep('registering');           
          const minDuration = 4000; 
          const startAnimation  = Date.now();
          const resp = await ApiPairingObject(deviceId,devicePairingInfos,deviceName);
         // console.log("resppairing object resp",resp);
          const elapsedTime =(Date.now()-startAnimation); 
          //console.log("elapsedTime",elapsedTime)
          if( elapsedTime < minDuration) {
            //console.log("so wait ",(minDuration-elapsedTime))          
            await sleep((minDuration-elapsedTime));
            //console.log(Date.now(),startAnimation+minDuration)
          }

          if(resp.errCode != 200) {
            if(resp.errMsg == "object_exists") {
              
              const eventName = "event/io/athome/"+devicePairingInfos.type+"/"+devicePairingInfos.subtype+"/"+deviceId+"/" ;             
              const existingObjectId = objectsByEventsName[eventName];             
              const existingObjectName  = objectsByIds?.[existingObjectId]?.name || 'unknown';             
              setExistsName(existingObjectName); 
              setCurrentStep('object_exists');
            } else {
              setCurrentStep('generic_error');
            }
          } else {            
            setCreatedVdpId(resp.id)
            setCurrentStep('selectOptions');            
          }    
        }  
      }


        const goToSelectProduct = (error) => {

          const params = {itemId:createdVdpId};
          navigation.dispatch(
            CommonActions.navigate({
              name: 'AddProduct'            
            })
          );
         if(!error) navigation.navigate("ProductDetails",params);       
        }

      //-----------------------------------

      const goBack = () => {       
        navigation.navigate('AddProduct')
      }

    // navigation to AddDoorKeeperGenerateQRCode is done in <AtHomeAddProductStepWifi/> using destination attribute
     // Attention à la version wizard sans props goBack

     const getHeader = () => {
       
        return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                         <HeaderWithBack title={title} goBack={{action:goBack}} themeDependency/>
                     </View>
        
     }
     const goNameForm = () => {
       setCurrentStep('pairing');
     }
     //=====================================================

     const setOptions = async() => {
        // CONF. un paramètre : setup = both | gate | door | none
        let setup = "none"
        if(deviceOptions.gate == true)setup = "gate";
        if(deviceOptions.door == true)setup = "door";
        if(deviceOptions.door == true && deviceOptions.gate == true)setup = "both";
   
      setCurrentStep('registering'); 
      console.log(",createdVdpId",createdVdpId)
      const resp = await Api.executeAction(createdVdpId,"CONF",{mArgs:[{name:'setup',value:setup}]});       
      refreshObjectAction(createdVdpId,store);
      setCurrentStep('completed'); 
     }

     const deviceOptionsRef = useRef({});

     const setToggleCheckBox = (type,value) => {
      const updateValue = {...deviceOptions,[type]:value};
      //updateValue[type] = value;
      setDeviceOptions(updateValue);
      deviceOptionsRef.current = updateValue;     
    }

    

     const options= { 
      'gate': {type: 'gate',icon : require('_assets/images/interfaces/menu/gate.png'), label:"OPTION_GATE"},
      'door' : {type: 'door',icon: require('_assets/images/interfaces/door.png'),label:"OPTION_DOOR"},
    }

      const OptionLine = ({type,isFirst}) => {
        const size=50
        return (
          <View style={{height:undefined,marginTop:5,marginBottom:10,borderBottomWidth:1,borderBottomColor: bodyTextColor}}>
            <View style={{height:undefined, flexDirection: 'row',flexWrap: "wrap",paddingBottom:10}}>
                <View style={{width: size, height: size, alignItems:'center',justifyContent:'center'}}>
                  <View style={{backgroundColor:bodyTextColor,borderRadius:size/2,height:size,width:size,alignItems:'center',justifyContent:'center'}}>
                      <Image source={options[type].icon} style={{height:size*0.7,width:size*0.7,tintColor:invertOnBody}}/>               
                  </View>   
                </View>
                <View style={{width: size, height: size, flexGrow:1,justifyContent:'center'}}>
                  <Text style={{paddingLeft:15,color:bodyTextColor,fontSize:16,flexWrap: 'wrap'}}>{t( "doorkeeper:"+ options[type].label)}</Text>
                </View>
                <View style={{width: size, height: size, alignItems:'center',justifyContent:'center'}}>
                  <CheckBox
                        disabled={false}
                        value={deviceOptions[type]}
                        onValueChange={(newValue) => setToggleCheckBox(type,newValue)}
                        onTintColor={bodyTextColor} onCheckColor={bodyTextColor} tintColors={{true:bodyTextColor,false:bodyTextColor}}
                  />  
                </View>
              </View>
          </View>        
        )
      }
      useEffect(() => {
        console.log("justUpdated",deviceOptions)
      }, [deviceOptions]);  
      
    // ----------------------------------

     



    return (
        <SafeAreaView style={{flex:1,backgroundColor:backgroundColor}}>            
            <>
            {
                getHeader()
            }
              </>
              <ThemeProvider theme= {styledTheme}>
                <View style={{padding:20}}>
                   
                    {currentStep == 'pairing' && 
                        <>
                            <TitleText  centered>{t("doorkeeper:HOW_TO_NAME_YOUR_DEVICE")}</TitleText>
                            <VSpacer/>
                            <FormInput name='deviceName' value={deviceName} placeholder={t("addProduct:DEVICE_NAME")} autoCapitalize='none'   onChangeText={(txt) => handleNameChange("deviceName", txt)}  color={bodyTextColor} iconColor={bodyTextColor}/>
                            <VSpacer/>
                            <View style={{flexDirection:'row',}}>
                              <Image style={{width:22,height:22,tintColor:bodyTextColor}} source={require('_images/interfaces/menu/about.png')}></Image>
                              <View style={{flexGrow:1,paddingLeft:10,paddingRight:10}}>
                                <BodyText >{t('doorkeeper:DEVICE_NAME_DESCRIPTION')}</BodyText>
                              </View>
                            </View>
                            <VSpacer/>
                            <AccessButton  onPress={completePairing} specialColor={bodyTextColor} isCentered title={t("BUTTON_NEXT").toUpperCase()}/>  
                       
                        </>   
                    }
                    {currentStep == 'registering2' && 
                        <View style={{alignItems:'center'}}>
                          <TitleText  centered> </TitleText>
                          <VSpacer/> 
                          <View style={{width:100,height:100,borderRadius:50,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                            <Image source={require('../../assets/contactServer.png')} style={{width:'80%',height:'80%'}}/> 
                          </View>
                          
                          <VSpacer/>                  
                          <BodyText > </BodyText>
                          <VSpacer/>
                        
                      </View>
                    }
                    {currentStep == 'registering' && 
                        <View style={{alignItems:'center'}}>
                          <TitleText  centered> </TitleText>
                          <VSpacer/> 
                          <View style={{width:100,height:100,borderRadius:50,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                            <AnimatedLoaderMaison/>                           
                          </View>
                          
                          <VSpacer/>                  
                          <BodyText > </BodyText>
                          <VSpacer/>
                         
                      </View>
                    }
                    {currentStep == 'confCompleted' && 
                        <View>
                            <TitleText  centered>{t("doorkeeper:OPTIONS_DESCRIPTION")}</TitleText>
                            <VSpacer/> 
                            <TitleText  centered>Conf Completed</TitleText>
                            <VSpacer/>
                            <AccessButton  disabled={!deviceOptions?.gate && !deviceOptions?.door} onPress={goNameForm} specialColor={bodyTextColor} isCentered title={t("BUTTON_NEXT").toUpperCase()}/>  
                      </View>   
                    }
                    {currentStep == 'selectOptions' && 
                        <>
                            <TitleText  centered>{t("doorkeeper:OPTIONS_DESCRIPTION")}</TitleText>
                            <VSpacer/> 
                            <OptionLine type="gate" isFirst/>
                            <OptionLine type="door" />
                            <VSpacer/>
                             <AccessButton   onPress={setOptions} specialColor={bodyTextColor} isCentered title={t("addProduct:FINISH_PAIRING").toUpperCase()}/>  
                            
                        </>   
                    }
                    {currentStep == 'completed' && 
                         <View style={{alignItems:'center'}}>
                            <TitleText  centered>{t("addProduct:JOB_DONE_TITLE")}</TitleText>
                            <VSpacer/>
                            <View style={{width:100,height:100,borderRadius:50,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                              <AnimatedCheck loop={false}/>                        
                            </View>                            
                            <VSpacer/>                  
                            <BodyText >{t('addProduct:YOUR_DEVICE_IS_REGISTRED_ON_SERVER')}</BodyText>
                            <VSpacer/>
                            <AccessButton  onPress={goToSelectProduct} specialColor={bodyTextColor} centered title={t("addProduct:PAIRING_COMPLETED").toUpperCase()}/>
                      
                        </View>
                    } 
                    {currentStep == 'generic_error' && 
                        <>                            
                          <TitleText  centered>{t("addProduct:CAN_NOT_ADD_TITLE")}</TitleText>
                          <VSpacer/>                   
                          <BodyText >{t('addProduct:GENERIC_ERROR',{name:devicePairingInfos.typeName})}</BodyText>
                          <VSpacer/>
                        </>
                    } 
                     {currentStep == "object_exists" &&
                      <>
                        <TitleText  centered>{t("addProduct:CAN_NOT_ADD_TITLE")}</TitleText>
                        <VSpacer/>                   
                        <BodyText >{t('addProduct:OBJECT_EXIST',{name:existsName})}</BodyText>
                        <VSpacer/>
                        <AccessButton   onPress={() => goToSelectProduct("exists")} specialColor={bodyTextColor} title={t("addProduct:PAIRING_COMPLETED").toUpperCase()}/>                    
                      </>
                }
                       
            </View>
            </ThemeProvider>
      </SafeAreaView>
    )              
}




export default DoorKeeperSimpleRegisterScreen


const MyText = styled.Text`
    color:${props => props.theme.color || "red" };
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
    height:${props => props.height|| 30}px;
`;
