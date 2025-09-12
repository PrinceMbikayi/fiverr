import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,KeyboardAvoidingView,SafeAreaView,ScrollView,Button,Image} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import styled,{ThemeProvider} from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';
import {HeaderWithBack} from '_components/headers/header-with-back';

//import { getImage,setImage } from '../utils/image';
import {Body,ViewerTitle,ViewerText,TextInput,Label} from '../components/styled';
import Trash from '_brand/images/icons/app/Trash';

import QrCodeVDPSettingsComponent from '../components/settings/settingsComponent';
import {useQrObject} from '_hooks/object/qrObject'


const QrCodeVDPSettingsScreen = (props) => {

  //console.log("----------- uObject QR settings start ------------")
    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   
    
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {}; 
   const {itemId,update : isUpdate, productId : atHomeObjectType,deviceSn,deviceUid} = navigationParams || {}
   //console.log("----------- uObject QR settings navigationParams ------------",navigationParams)
   const uObject = useQrObject(itemId);
   //const uObject = useObject(itemId);
   const {objectDatas,widgetReferenceDatas,statuses,name,connected,status,getStatus : getMyStatus,execute,toggle,image,getImage} = uObject;
   // console.log("----------- uObject QR settings------------")
   //console.log(uObject)
 
   const dispatch = useDispatch();   
   const itemDatas = widgetReferenceDatas;
    //const itemDatas = useSelector(state => getObjectById(state,itemId));
    //const statuses = itemDatas?.statusDictionary;   
    const initialFormValues = {family_name:statuses?.family_name || '', comment:statuses?.comment || ''};
   
   const [imageSource,setImageSource] = useState(image);

    const title = t("qrbasic:INPUTS_PAGE_HEADER");

    // DID MOUNT
    // exemple mount / unmount fonctional component
    useEffect(() => {
        isMounted.current = true;       
        if(isUpdate) {
                //   
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);
      const goBack = () => {       
        navigation.goBack();
      }


    // Attention à la version wizard sans props goBack    

    const showInfos = () => {

    }


    const ScreenHeader = () => {      
      const hTitle = uObject?.name;    
      
       return  <View style={{minHeight:64,alignItems:'center',justifyContent:'center'}}>
                        <HeaderWithBack title={hTitle} goBack={{action:goBack}} backSVG centered noShadow bgColor='white' extraButtons={[{action:showInfos,svgr:<Trash/>}]}/>
                </View>       
    } 
    //------------------------------------------------
   
    // ----------------------------------
  
    const [submitEnabled,setSubmitEnabled] = useState(false)

    useEffect(()=> {
      // updatePlease
    },[submitEnabled])

    const backgroundColor = theme?.primary_2_darker;
    const styledTheme = {'textColor':textColor};
    const imgWidth = 160;

    return (
         <ThemeProvider theme={styledTheme}>
            <View style={{flex:1,backgroundColor: 'red' || backgroundColor}} zIndex={10}>            
              <ScreenHeader />             
                <KeyboardAvoidingView   behavior={Platform.OS === "ios" ? "height" : "height"}
                style={{flex:1}}
                >
                <ScrollView style={{paddingBottom:0,marginBottom:0}} bounces={false}>
                  {/* exemple KeyboardAvoidingView offset */}
                
                    <Body style={{backgroundColor:'white',paddingBottom:32,borderBottomLeftRadius:32,borderBottomRightRadius:32}}> 
                      <QrCodeVDPSettingsComponent {...{itemId,isUpdate}}/>
                    </Body> 
                
                  </ScrollView>  
                  </KeyboardAvoidingView>             
            </View>
          </ThemeProvider>
    )        
}

export default QrCodeVDPSettingsScreen