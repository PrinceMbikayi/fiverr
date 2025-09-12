import React from 'react';
import {useContext,useState,useRef,useEffect,useImperativeHandle} from 'react';
import { View} from 'react-native';

import { useTranslation } from 'react-i18next';
import styled,{ThemeProvider} from 'styled-components/native';

import { MultiPurposeLine } from "_components/list/multiPurposeLine";



 const SelectPhotoModal = React.forwardRef((props, ref) => {

  
 
    const { t, i18n } = useTranslation();
    const AnimatedSelectorWrapperRef = useRef();
    const {callback} = props;
    const secondTextInput = useRef(null);

     useImperativeHandle(ref, () => ({

        getAlert() {
          console.log("getAlert from Child called by parent");
        },
        toggle() {
            
            console.log("toggleMe for android");/*
            if(!isVisible)startAnimation();            
            setIsVisible(!isVisible)
            */
            //AnimatedSelectorWrapperRef.current.toggle();
            //console.log("secondTextInput",secondTextInput)
            //secondTextInput.focus();
            
        }
      }));

      const onCallback = (id) => {
        console.log("eh oh ",id,callback);
       
        if(callback != undefined )callback(id)
    }

 




  

    return (
             <View >                        
                            <MultiPurposeLine icon="photo-camera" title={t("qrbasic:ADD_PHOTO_MODAL_CAMERA")}  color="black" callback={onCallback} full   id="camera"   fullTouchable />
                            <MultiPurposeLine icon="gallery" title={t("qrbasic:ADD_PHOTO_MODAL_GALLERY")}  color="black" callback={onCallback} id="gallery" fullTouchable />
           </View>
    )    
})
export default SelectPhotoModal