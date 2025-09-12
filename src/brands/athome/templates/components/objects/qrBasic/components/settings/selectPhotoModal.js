import React from 'react';
import {useContext,useState,useRef,useEffect,useImperativeHandle} from 'react';
import { View,Text,Button,Image,Modal} from 'react-native';

import { useTranslation } from 'react-i18next';
import styled,{ThemeProvider} from 'styled-components/native';

import SimplePopUp from '_components/ui/simplePopUp';
import { MultiPurposeLine } from "_components/list/multiPurposeLine";



 const SelectPhotoModal = React.forwardRef((props, ref) => {

    const selectSourcePopUpRef = useRef();
    const { t, i18n } = useTranslation();
    const {callback} = props;
    const [modalVisible,setModalVisible] = useState(false)
     // REF methods can be called (useImperativeHandle)

     useImperativeHandle(ref, () => ({

        getAlert() {
          console.log("getAlert from Child called by parent");
        },
        toggle() {
            selectSourcePopUpRef.current.toggle();
        }
      }));


    const onCallback = (id) => {
        console.log("eh oh ",id);
        selectSourcePopUpRef.current.toggle();
        (callback || Function)(id)
    }
  

    return (
        <SimplePopUp ref={selectSourcePopUpRef} title={t("qrbasic:ADD_PHOTO_MODAL_TITLE")} style={{backgroundColor:'red',height:600,overflow:'visible'}} flexed={false}> 
            <View>
                <MultiPurposeLine icon="photo-camera" title={t("qrbasic:ADD_PHOTO_MODAL_CAMERA")}  callback={onCallback} id="camera"   fullTouchable />
                <MultiPurposeLine icon="gallery" title={t("qrbasic:ADD_PHOTO_MODAL_GALLERY")}  callback={onCallback} id="gallery" fullTouchable />
            </View>
        </SimplePopUp>

    )    
})
export default SelectPhotoModal