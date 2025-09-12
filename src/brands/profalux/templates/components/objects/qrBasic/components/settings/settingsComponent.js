import React from 'react';
import {useState,useRef,useEffect,useMemo,useCallback} from 'react';
import { View,Text,SafeAreaView,ScrollView,Button,Image,Pressable,Keyboard} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import styled,{ThemeProvider} from 'styled-components/native';


import {getObjectById} from '_helpers/selectors';
import { useTheme } from '_theming/themeProvider';
import {HeaderWithBack} from '_components/headers/header-with-back';
import AccessButton from '_components/forms/accessButton';
import { SettingsButton } from '../settingsButton';
import CameraIcon from '_brand/images/icons/app/Camera';
import {QrCodeVDPImage} from '../ui/image';
import SelectPhoto from './selectPhoto';
import {QrCodeSettingsForm} from './form';
import {updateStatuses} from '_actions/objects';
import {setOptions} from '../../utils/settings';
//import { getImage,setImage } from '../utils/image';
import {Body,ViewerTitle,ViewerText,TextInput,Label} from '../styled';

import {useQrObject} from '_hooks/object/qrObject';

import {useGlobalModal} from '_components/ui/globalModal';


//-----------------------------------
import {
  BottomSheetModal,BottomSheetBackdropProps
} from '@gorhom/bottom-sheet';
//import BottomSheetBackdrop from '@gorhom/bottom-sheet';
import CustomBackdrop from './customBackdrop';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

//import MyBottomSheetModal from './myBottomSheet';
import MyBottomSheetModal from '_brand/templates/components/ui/bottomSheet';

const QrCodeVDPSettingsComponent = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   
    
    const dispatch = useDispatch();


   //const {itemId,update : isUpdate, productId : atHomeObjectType,deviceSn,deviceUid} = navigationParams || {}

   const navigation = useNavigation();

    const {itemId,isUpdate,productId,updateSelectorState} = props;
    const uObject = useQrObject(itemId);
   
    const {objectDatas,widgetReferenceDatas,statuses,name,connected,status,getStatus : getMyStatus,execute,toggle,image,getImage,setTempImage} = uObject;
     console.log("----------- uObject QR settings------------")
     //console.log(uObject)
   
    const itemDatas = widgetReferenceDatas;   
    const initialFormValues = {family_name:statuses?.family_name || '', comment:statuses?.comment || '', object:widgetReferenceDatas.name};   
    const [imageSource,setImageSource] = useState(image);
   
    // ----------------------------------
  
    const [submitEnabled,setSubmitEnabled] = useState(false)

    useEffect(()=> {
      // updatePlease
    },[submitEnabled])

    useEffect(()=> {
      console.log("uObject.tempImage changed",uObject)
    },[uObject.tempImage])

    
    //----- photo using modal bottomsheet -----

    const [backdropPressBehavior, setBackdropPressBehavior] = useState('collapse');
       // renders
    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop {...props} snapPoints={snapPoints} pressBehavior={backdropPressBehavior} />
      ),
      [backdropPressBehavior]
    );
    
    
    const bottomSheetModalRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(10);
    const snapPoints = useMemo(() => [contentHeight], [contentHeight]);
    const renderBackdropRef = useRef(null);
   
    //const snapPoints = useMemo(() => [120,'25%'], []);

    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);
    const handleCloseModalPress = useCallback(() => {
      bottomSheetModalRef.current?.dismiss();
    }, []);


    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);

    const onOpenSelect = () => {  
       // callbacks
       handlePresentModalPress();
    }


    // ----- photo --------
    const globalModal = useGlobalModal();
    const selectPhotoRef = useRef(); 
    const selectPhotoPickedRef = useRef({});   

    const onOpenSelect_olivier = () => {  
        console.log("+++++++++++++++    onOpenSelect iiiiiii")
        const content = <SelectPhoto ref={selectPhotoRef} callback={onSelectPhotoCallback}/> 
        globalModal.setContent(content);    
        globalModal.toggle();
      
         
         
          //selectPhotoRef.current.open(); 
        //navigation.navigate("QrCodeVDPModal")
    }
    //-------------------
    const onSelectPhotoCallback = (cbProps ) => {
      globalModal.close();
      handleCloseModalPress();
      const {action,source,base64data} = cbProps;
      console.log("cbProps",cbProps)
      //console.log("base64img",base64data)
      if(source != undefined) {

      
        selectPhotoPickedRef.current = {"base64data":base64data,type:((source.indexOf('.jpeg')!= -1 || source.indexOf('.jpg')!= -1 ))? "jpeg" :"png"}
       
        switch(action) {
          case 'update' :          
            console.log(uObject);           
            if(source) {
              setImageSource({uri:source}); 
              setSubmitEnabled(Date.now())
            }

            break;
        }
      }
    }

    const onFormSubmit = async(values) => {
      const toRefresh = Date.now()
      const toDispatch = updateStatuses(itemId,{
                                                  family_name:(values.family_name || initialFormValues.family_name),
                                                  comment:(values.comment || initialFormValues.comment),
                                                  object_name:(values.object || initialFormValues.object),
                                                  refreshSnap:toRefresh});
      //console.log("toDispatch",toDispatch) 
      const options = {'family_name':values.family_name,'comment':values.comment,...selectPhotoPickedRef.current}
      console.log("-------->> options",options)
      const respOptions =  await setOptions(itemId,options).catch((err)=> console.log("erreur respOptions",err));
      console.log("respOptions",respOptions)
      setTempImage({uri:selectPhotoPickedRef.current?.base64data})
      //setImage(itemId,imageSource,dispatch);
      console.log("c'est super")
      const gi = await getImage();
      console.log("gi",gi);
      if(values.object != initialFormValues.object)uObject.rename(values.object)
     // console.log("respOptions ++",respOptions);
      //console.log("toDispatch",toDispatch);
      dispatch(toDispatch);
    }
   
   
    const backgroundColor = bgColor;
    const styledTheme = {'textColor':textColor};
    const imgWidth = 136;

    const buttonBgColor = theme.primary_2_medium;
    const iconColor = "white";

    const onLayout = (event) => {
      var {x, y, width, height} = event.nativeEvent.layout;
      console.log("Settings Component onLayout: ",x,y,width,height);
      renderBackdropRef.current = renderBackdrop; 
      setContentHeight(height);
     /*
      setTranslateY(animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [height,0],
          extrapolate: 'clamp'
      })
     
      )
      */

      
  }

    return (
         <ThemeProvider theme={styledTheme}>           
              
              <View>                    
                      <ImageContainer style={{width:imgWidth}}>
                          <QrCodeVDPImage image={image} itemId={itemId} width={imgWidth} radius={imgWidth/2} align="center" selected={imageSource}/>
                          <FloatingButton>
                              <SettingsButton bgColor={buttonBgColor} iconComponent={CameraIcon} iconColor="white" appIcon={true}  zIndex={4} callback={onOpenSelect}/>
                          </FloatingButton>
                      
                          {/*<AccessButton   onPress={onOpenSelect} isCentered specialColor={textColor} title={t("qrbasic:SETTINGS_MODIFY_PICTURE")}/> */}               
                      </ImageContainer>
                      <QrCodeSettingsForm callback={onFormSubmit} initialValues={initialFormValues} buttonLabel={t("qrbasic:SETTINGS_SAVE")} cancelLabel={t('CANCEL')} imageChanged={submitEnabled}/>                 
                      <MyBottomSheetModal  myRef={bottomSheetModalRef}>
                      <SelectPhoto ref={selectPhotoRef} callback={onSelectPhotoCallback}>
                              <Text>Voilà 2</Text>
                              </SelectPhoto> 
                      </MyBottomSheetModal>
                      {/*
                      <BottomSheetModal
                          ref={bottomSheetModalRef}
                          index={0}
                          handleComponent={null}                       
                          snapPoints={snapPoints}
                          onChange={handleSheetChanges}
                          backdropComponent={renderBackdropRef.current}
                        >
                          <View onLayout={onLayout}>
                            <SelectPhoto ref={selectPhotoRef} callback={onSelectPhotoCallback}>
                              <Text>Voilà</Text>
                              </SelectPhoto> 
                        </View>
                        </BottomSheetModal>
    */}
              </View> 
            
          </ThemeProvider>
    )        
}

export default QrCodeVDPSettingsComponent

const ImageContainer = styled.View`
    align-self:center;
    margin-top:16px;
    margin-bottom:16px;
`;

const FloatingButton = styled.View`
    position:absolute;
    right:0;
    bottom:0;
`;