
import React from 'react';
import {useContext,useState,useRef,useEffect,useImperativeHandle} from 'react';
import { View,SafeAreaView,ScrollView,Button,Image,Modal,ImageBackground,Platform} from 'react-native';
import {launchCamera, launchImageLibrary,} from 'react-native-image-picker';
import {request, PERMISSIONS} from 'react-native-permissions';

import PropTypes from 'prop-types';


import SelectPhotoModal from './selectPhotoModal';

const requestPermission = async() => {
    
  const locationPermission = (Platform.OS == "android") ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;
  const testo =  await request(locationPermission)
  //console.log('requestPermission 2',locationPermission,testo)
  return testo;
        
}

/**
 * @type React.FC
 */
const SelectPhoto = React.forwardRef((props, ref) => {

    const {children,callback} = props;
    const selectSourcePopUpRef = useRef();

    useImperativeHandle(ref, () => ({

        getAlert() {
          console.log("getAlert from Child called by parent");
        },
        open() {
            selectSourcePopUpRef.current.toggle();
        }
      }));


    const cameraCallback = (props) => {       
        mediaCallback(props); 
    }

    const galleryCallback = (props) => {       
        mediaCallback(props); 
    }

    const mediaCallback = (props) => {
       // selectSourcePopUpRef.current.toggle(); 
       console.log("mediaCallback",props)
        const fileIsHere =  props?.assets?.[0]?.uri;
        console.log("fileIsHere",fileIsHere);
        if(callback != undefined) {
          callback ({action:'update',source:fileIsHere,base64data:props?.assets?.[0]?.base64});
        }
        
    }


    const mediaOptions = {
        mediaType:"photo",
        maxWidth:640,
        maxHeight:640,
        quality:0.82,
        includeBase64:true
    }

    const onOpenSelect = () => {   
      /*
      if(Platform.OS == "android" || 1 == 1) {
        selectSourcePopUpRef.current.toggle();
      }
      */
      selectSourcePopUpRef.current.toggle(); 
    }
    const onCloseSelect = () => {  

        selectSourcePopUpRef.current.toggle();
    }

    const onPopUpCalback = async(id) => {
      requestPermission();
      console.log("ici");
      onCloseSelect();
      console.log("ici2",id);
        switch(id) {
            case 'camera' :
                const openIt = await launchCamera(mediaOptions,cameraCallback);
                console.log("openIt",openIt)
                break;
            case 'gallery' :
                launchImageLibrary(mediaOptions, galleryCallback);
                break;        
        }

        //onCloseSelect();
    }

    const onCameraSelected = () => {
      launchCamera(mediaOptions,cameraCallback);
    }


    // Android and IOS are different
    return (    <>
                     <SelectPhotoModal ref={selectSourcePopUpRef} callback={onPopUpCalback} zIndex={5}/>
                    {children}
                </>
            )



})

const ButtonPropTypes = {
  text: 'string',
  icon: 'string',

}

SelectPhoto.propTypes = ButtonPropTypes

export default SelectPhoto

