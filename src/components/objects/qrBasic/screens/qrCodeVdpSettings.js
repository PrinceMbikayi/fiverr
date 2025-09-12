import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,SafeAreaView,ScrollView,Button,Image,KeyboardAvoidingView} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import styled,{ThemeProvider} from 'styled-components/native';


import {getObjectById} from '_helpers/selectors';
import { useTheme } from '_theming/themeProvider';
import {HeaderWithBack} from '_components/headers/header-with-back';
import AccessButton from '_components/forms/accessButton';
import {QrCodeVDPImage} from '../components/ui/image';
import SelectPhoto from '../components/settings/selectPhoto';
import {QrCodeSettingsForm} from '../components/settings/form';
import {updateStatuses} from '_actions/objects';
import {setOptions} from '../utils/settings';
//import { getImage,setImage } from '../utils/image';
import {Body,ViewerTitle,ViewerText,TextInput,Label} from '../components/styled';

import {useQrObject} from '_hooks/object/qrObject'


const QrCodeVDPSettingsScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   
    
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {}; 
   const {itemId,update : isUpdate, productId : atHomeObjectType,deviceSn,deviceUid} = navigationParams || {}

   const uObject = useQrObject(itemId);
   //const uObject = useObject(itemId);
   const {objectDatas,widgetReferenceDatas,statuses,name,connected,status,getStatus : getMyStatus,execute,toggle,image,getImage} = uObject;
   console.log("----------- uObject QR settings------------")
   console.log(uObject)
 
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

    const ScreenHeader = () => {      
      const hTitle = "";    
       return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                        <HeaderWithBack title={hTitle} goBack={{action:goBack}} themeDependency/>
                </View>       
    } 
    //------------------------------------------------
   
    // ----------------------------------
  
    const [submitEnabled,setSubmitEnabled] = useState(false)

    useEffect(()=> {
      // updatePlease
    },[submitEnabled])

    
    // ----- photo --------
    const selectPhotoRef = useRef(); 
    const selectPhotoPickedRef = useRef({});   
    const onOpenSelect = () => {      
      selectPhotoRef.current.open(); 
    }
    const onSelectPhotoCallback = (cbProps ) => {
      const {action,source,base64data} = cbProps;
      //console.log("source",source)
      //console.log("base64img",base64data)
      if(source != undefined) {

      
        selectPhotoPickedRef.current = {"base64data":base64data,type:((source.indexOf('.jpeg')!= -1 || source.indexOf('.jpg')!= -1 ))? "jpeg" :"png"}
        switch(action) {
          case 'update' :
            if(source)setImageSource({uri:source});
            break;
        }
      }
    }

    const onFormSubmit = async(values) => {
      const toRefresh = Date.now()
      const toDispatch = updateStatuses(itemId,{family_name:(values.family_name || initialFormValues.family_name),comment:(values.comment || initialFormValues.comment),refreshSnap:toRefresh});
      //console.log("toDispatch",toDispatch) 
      const options = {'family_name':values.family_name,'comment':values.comment,...selectPhotoPickedRef.current}
      //console.log("options",options)
      const respOptions =  await setOptions(itemId,options).catch((err)=> console.log("erreur respOptions",err)); ;
      //setImage(itemId,imageSource,dispatch);
      console.log("c'est super")
      const gi = await getImage();
      console.log("gi",gi)
     // console.log("respOptions ++",respOptions);
      //console.log("toDispatch",toDispatch);
      dispatch(toDispatch);
    }
   
   
    const backgroundColor = bgColor;
    const styledTheme = {'textColor':textColor};
    const imgWidth = 160;

    return (
         <ThemeProvider theme={styledTheme}>
            <SafeAreaView style={{flex:1,backgroundColor:'green' || backgroundColor}} zIndex={10}>            
              <ScreenHeader/>             
             <SelectPhoto ref={selectPhotoRef} callback={onSelectPhotoCallback}/>             
              <ScrollView style={{paddingBottom:0,marginBottom:0}}>
                {/* exemple KeyboardAvoidingView offset */}
                <KeyboardAvoidingView  style={{flex:1}} behavior="position" keyboardVerticalOffset={200}>   
                  <Body> 
                    <QrCodeVDPImage image={image} itemId={itemId} width={imgWidth} radius={imgWidth/2} align="center" selected={imageSource}/>
                    <AccessButton   onPress={onOpenSelect} isCentered specialColor={textColor} title={t("qrbasic:SETTINGS_MODIFY_PICTURE")}/>                
                    <QrCodeSettingsForm callback={onFormSubmit} initialValues={initialFormValues} buttonLabel={t("qrbasic:SETTINGS_SAVE")}/>                 
                  </Body> 
                </KeyboardAvoidingView> 
                </ScrollView>               
            </SafeAreaView>
          </ThemeProvider>
    )        
}

export default QrCodeVDPSettingsScreen
