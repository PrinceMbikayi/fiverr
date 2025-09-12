import React, { Component } from 'react';
import { View, Text,SafeAreaView,TouchableOpacity,StyleSheet} from 'react-native';
import {useContext,useState,useRef,useEffect} from 'react';
import { useStore,useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import Toast from 'react-native-root-toast';
import styled from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';
import {useMyTools} from '_helpers/myTools';
import SimplePopUp from '_components/ui/simplePopUp';

import {HeaderWithBack} from '_components/headers/header-with-back';

import FormInput from '_components/forms/formInput';
import AccessButton from '_components/forms/accessButton';

import {objectPairingInfos} from '_config/products/core';
import * as ApiObjects from '_api/objects';



const DoorKeeperRegisterScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme} = useTheme();
   
    const dispatch = useDispatch();
   
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    const {itemId,update : isUpdate,productId : deviceId  = 'xxxxxx'} = navigationParams;
   
    const objectsByEventsName = useSelector(state => state.objects.objectsByEventsName)
    const objectsByIds = useSelector(state =>state.objects.entities.objects);
    const objectsByNames = useSelector(state => state.objects.objectsByNames)
    
    //const navigationParams = navigation.state.params;
    //const atHomeObjectType = navigationParams.productId || 'doorkeeper';
   // const deviceId = (navigationParams != undefined) ? navigationParams.productId : 'xxxxxxxxx';
   
    const [deviceName,setDeviceName] = useState('');
    const [currentStep,setCurrentStep] = useState('start');
    const [creationStatus,setCreationStatus] = useState('');
    const [existsName,setExistsName] = useState('--');
    const title = t('doorkeeper:'+((isUpdate != undefined) ? 'ADD_DOORKEEPER' : 'ADD_DOORKEEPER'));   
    const devicePairingInfos = {atHomeType:"VDP",...objectPairingInfos["VDP"]};

    // DID MOUNT
    useEffect(() => {
        isMounted.current = true;
        console.log("DoorKeeperWizardStartScreen",props)
        if(isUpdate) {
                   
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);

      const handleNameChange = (field,newVal) => {
        setDeviceName(newVal);
      }

    

      const completePairing = async() => {
       


        if(objectsByNames[deviceName] != undefined) {
          console.log("déjà utilisé !!!!!")
            let msg ="\n"+t("addProduct:DEVICE_NAME_ALREADY_IN_USE");      
            Toast.show(msg,{position: Toast.positions.TOP,duration:Toast.durations.LONG});
            return false;
        }



        if(deviceName.length < 4) {
          let msg ="\n"+t("addProduct:DEVICE_NAME_TOO_SHORT");      
            Toast.show(msg,{position: Toast.positions.TOP});
        } else {
          // fake id fro test purpose
          const dd = new Date()
          //const deviceId = "VDP_TEST_"+dd.getTime();
          const deviceId = "VDP_TEST_UNIQUE_ID";
          console.log()
          const resp = await ApiObjects.pairingObject(deviceId,devicePairingInfos,deviceName);

          console.log("resppairing object resp",resp);
          if(resp.errCode != 200) {
            if(resp.errMsg == "object_exists") {
              
              const eventName = "event/io/athome/"+devicePairingInfos.type+"/"+devicePairingInfos.subtype+"/"+deviceId+"/" ;
              console.log('eventName',eventName);
              console.log("objectsByEventsName",objectsByEventsName);
             
              const existingObjectId = objectsByEventsName[eventName];
              console.log("existingObjectId", existingObjectId)
              const existingObjectName  = (existingObjectId != undefined) ? objectsByIds[existingObjectId].name : 'unknown';
              console.log("existingObjectName", existingObjectName)
              setExistsName(existingObjectName); 
              setCurrentStep('object_exists');
            } else {
              setCurrentStep('generic_error');
            }
          } else {
            setCurrentStep('completed');            
          }    
        }  
      }

        const goToSelectProduct = () => {
          navigation.navigate('AddProduct')
        }

      //-----------------------------------

      const goBack = () => {
        console.log("goBack !!!!!")
        navigation.navigate('AddProduct')
      }

    // navigation to AddDoorKeeperGenerateQRCode is done in <AtHomeAddProductStepWifi/> using destination attribute

     // Attention à la version wizard sans props goBack
     const getHeader = () => {
       
        return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                         <HeaderWithBack title={title} goBack={{action:goBack}}/>
                     </View>
        
     }

    // ----------------------------------
    return (
        <SafeAreaView style={{flex:1,backgroundColor:theme.body}}>            
            <>
            {
                getHeader()
            }
              </>
                <View style={{padding:20}}>
                   
                    {currentStep == 'start' && 
                        <>
                            <TitleText color={theme.onBody} centered>{t("addProduct:YOUR_DEVICE_IS_PAIRED")}</TitleText>
                            <VSpacer height={30}/>
                            <FormInput name='deviceName' value={deviceName} placeholder={t("addProduct:DEVICE_NAME")} autoCapitalize='none'   onChangeText={(txt) => handleNameChange("deviceName", txt)} color={theme.onBody} iconColor='white'/>
                            <VSpacer height={30}/>
                            <BodyText color={theme.onBody}>{t('addProduct:DEVICE_NAME_DESCRIPTION')}</BodyText>
                            <VSpacer height={30}/>
                            <AccessButton  onPress={completePairing} specialColor={theme.onBody} isCentered title={t("addProduct:FINISH_PAIRING").toUpperCase()}/>  
                        </>   
                    }
                    {currentStep == 'completed' && 
                        <>
                            <TitleText color={theme.onBody} centered>{t("addProduct:JOB_DONE_TITLE")}</TitleText>
                            <VSpacer height={30}/>                   
                            <BodyText color={theme.onBody}>{t('addProduct:YOUR_DEVICE_IS_REGISTRED_ON_SERVER')}</BodyText>
                            <VSpacer height={30}/>
                            <AccessButton  onPress={goToSelectProduct} specialColor={theme.onBody} centered title={t("addProduct:PAIRING_COMPLETED").toUpperCase()}/>
                      
                        </>
                    } 
                    {currentStep == 'generic_error' && 
                        <>                            
                          <TitleText color={theme.onBody} centered>{t("addProduct:CAN_NOT_ADD_TITLE")}</TitleText>
                          <VSpacer height={30}/>                   
                          <BodyText color={theme.onBody}>{t('addProduct:GENERIC_ERROR',{name:devicePairingInfos.typeName})}</BodyText>
                          <VSpacer height={30}/>
                        </>
                    } 
                     {currentStep == "object_exists" &&
                      <>
                        <TitleText color={theme.onBody} centered>{t("addProduct:CAN_NOT_ADD_TITLE")}</TitleText>
                        <VSpacer height={30}/>                   
                        <BodyText color={theme.onBody}>{t('addProduct:OBJECT_EXIST',{name:existsName})}</BodyText>
                        <VSpacer height={30}/>
                        <AccessButton   onPress={goToSelectProduct} specialColor={theme.onBody} title={t("addProduct:PAIRING_COMPLETED").toUpperCase()}/>                    
                      </>
                }
                       
            </View>
          
      </SafeAreaView>
    )              
}




export default DoorKeeperRegisterScreen



const NoticeImage = styled.Image`
    max-width:120px;
    max-height:120px;
    align-self:center;
    margin-bottom:30px;     
`;

const Body= styled.View`
    width:100%;
    justify-content:center;
    flex:1;
    padding:15px;
    padding-top:0px;
    
`;
const Bottom= styled.View`
    width:100%;
    justify-content:center;
    align-items:center;
    height:50px;
    flex:1;    
`;
const MyText = styled.Text`
    color:${props => props.color || "red" };
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

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    marginTop: 0,   
    alignItems: 'center',
    justifyContent: 'center',
  },
 
});