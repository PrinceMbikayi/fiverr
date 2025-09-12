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


const MyBottomSheet = (props) => {

    const {children,myRef} = props
    
    //----- photo using modal bottomsheet -----

    const [backdropPressBehavior, setBackdropPressBehavior] = useState('collapse');
       // renders
    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop {...props} snapPoints={snapPoints} pressBehavior={backdropPressBehavior} />
      ),
      [backdropPressBehavior]
    );
    
    
    const bottomSheetModalRef =  myRef ||  useRef(null);
    const [contentHeight, setContentHeight] = useState(10);
    const snapPoints = useMemo(() => [contentHeight], [contentHeight]);
    const renderBackdropRef =useRef(null);
   
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




    const onLayout = (event) => {
      var {x, y, width, height} = event.nativeEvent.layout;
      console.log("Bottom onLayout: ",x,y,width,height);
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
         <BottomSheetModal
                          ref={bottomSheetModalRef}
                          index={0}
                          handleComponent={null}                       
                          snapPoints={snapPoints}
                          onChange={handleSheetChanges}
                          backdropComponent={renderBackdropRef.current}
                        >
                          <View onLayout={onLayout}>
                            {children}
                        </View>
        </BottomSheetModal>
    )        
}

export default MyBottomSheet

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