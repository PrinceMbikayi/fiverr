import React from 'react';
import {useContext,useState,useRef,useEffect,useImperativeHandle} from 'react';
import { Keyboard,View,Text,TextInput,Button,Image,Modal,Pressable,Animated,Easing} from 'react-native';

import { useTranslation } from 'react-i18next';
import styled,{ThemeProvider} from 'styled-components/native';

import { MultiPurposeLine } from "_components/list/multiPurposeLine";

import AnimatedSelectorWrapper from '_brand/templates/components/ui/actionSheet';
import { call } from 'react-native-reanimated';
import WrappedInput from '_brand/templates/components/forms/inputWrapped.js'


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

    const [keyboardStatus, setKeyboardStatus] = useState(undefined);

  /*
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        console.log("keyboardDidShow !!")
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  */


    useEffect(()=>{doFocus()},[])


    const doFocus = () => {
        setTimeout(() => {
         //secondTextInput.current.blur();
        // secondTextInput.current.focus();
     },200)
    }

    const buttons = [{style:'blank',title:"glop"},{style:'blank',title:"beep"}];
    
   const gHeightRef = useRef(0)
    const [extraOffset, setExtraOffset] = useState(0);
    const onLayout = (event) => {
        console.log('EEEEEEEEEE XXXXXXXXX')
        var {x, y, width, height} = event.nativeEvent.layout;
        console.log("ahahah",x,y,width,height);
       // gHeightRef.current = height;
        setExtraOffset(height-30)
       
    }


    return (<>
              <AnimatedSelectorWrapper ref={AnimatedSelectorWrapperRef} >
                    <View onLayout={onLayout}>
                          {/*
                            <MultiPurposeLine icon="photo-camera" title={t("qrbasic:ADD_PHOTO_MODAL_CAMERA")}  color="black" callback={onCallback} full   id="camera"   fullTouchable />
                            <MultiPurposeLine icon="gallery" title={t("qrbasic:ADD_PHOTO_MODAL_GALLERY")}  color="black" callback={onCallback} id="gallery" fullTouchable />
    */}
                            <WrappedInput value="gogo" placeholder="name"  buttons={buttons}/>
                            
                    </View>
                </AnimatedSelectorWrapper> 
                                          
               </>
      
      
                
        
           
    )    
})
export default SelectPhotoModal
/*
<View style={{width:'100%',position:'relative',flex:1,backgroundColor:'blue',justifyContent:'flex-end'}}>
<View>
  {body}
</View>

</View>  
*/
/*

 <KeyboardAvoidingView style={{backgroundColor:'transparent'}}  contentContainerStyle={{paddingBottom:keyboardStatus ? extraOffset : 0}} behavior={Platform.OS === "ios" ? "position" : "position"}  nobehavior="position" >
                <AnimatedSelectorWrapper ref={AnimatedSelectorWrapperRef} >
                        <View onLayout={onLayout}>
                           
                            <WrappedInput value="gogo" placeholder="name"  buttons={buttons}/>
                               
                            </View>
                              </AnimatedSelectorWrapper> 
                              <View  style={{height:(Platform.OS === "ios" && keyboardStatus)?  134+5: 0,backgroundColor:'blue'}}/>                   
                   
            </KeyboardAvoidingView>

*/
