import React from 'react';
import {useContext,useState,useRef,useEffect,useImperativeHandle} from 'react';
import { View,Text,Button,Image,Modal,Pressable,Animated,Easing} from 'react-native';

import { useTranslation } from 'react-i18next';
import styled,{ThemeProvider} from 'styled-components/native';

import { MultiPurposeLine } from "_components/list/multiPurposeLine";



 const SelectPhotoModal = React.forwardRef((props, ref) => {

  
    const { t, i18n } = useTranslation();
    const {callback} = props;
    const [isVisible,setIsVisible] = useState(false)
     // REF methods can be called (useImperativeHandle)

     const animatedValue = useRef(new Animated.Value(0)).current;

     const startAnimation = toValue => {
        console.log("sssssttttttaaaaarrrrrttttt iiiioooooosssss",toValue)
         Animated.timing(animatedValue, {
             toValue,
             duration: 150,
             easing: Easing.linear,
             useNativeDriver: true
         }).start(({ finished }) => {
            /* completion callback */          
            if(toValue == 0) {
                setIsVisible(false)
            }
          })
     }
 
     const translateY = animatedValue.interpolate({
         inputRange: [0, 1],
         outputRange: [200,0],
         extrapolate: 'clamp'
     })


     useImperativeHandle(ref, () => ({

        getAlert() {
          console.log("getAlert from Child called by parent");
        },
        toggle() {
            
            console.log("toggleMe for ios");
            if(!isVisible)startAnimation();            
            setIsVisible(!isVisible)
            
        }
      }));


    const onCallback = (id) => {
        console.log("eh oh ",id);
       
        if(callback != undefined )callback(id)
    }
  
    const onCancel = () => {
        //setIsVisible(false);
        startAnimation(0);
    }

    useEffect(()=> {
        startAnimation(1);
    },[])


    return (
            <>
            {isVisible || 1 == 1 &&           
                            
                        
                        <AnimatedSelector  style={{ transform: [{ translateY }]}}>
                            <MultiPurposeLine icon="photo-camera" title={t("qrbasic:ADD_PHOTO_MODAL_CAMERA")}  color="black" callback={onCallback} full   id="camera"   fullTouchable />
                            <MultiPurposeLine icon="gallery" title={t("qrbasic:ADD_PHOTO_MODAL_GALLERY")}  color="black" callback={onCallback} id="gallery" fullTouchable />           
                        </AnimatedSelector>
                
            }
            </> 
    )    
})
export default SelectPhotoModal



export const Selector2 = styled.View`
    position:absolute; 
    bottom:0px;
    width:100%;
    background-color:red;
    padding:10px;
    border-top-left-radius : 20px;
    border-top-right-radius : 20px;
    z-index:12;
    flex:1;
`;

export const Selector= styled.View`
   
    background-color:white;
    padding:10px;
    border-top-left-radius : 20px;
    border-top-right-radius : 20px;
    width:100%;
   
    
`;
//exemple Animated custom Component or Styled Component
const AnimatedSelector = Animated.createAnimatedComponent(Selector);
