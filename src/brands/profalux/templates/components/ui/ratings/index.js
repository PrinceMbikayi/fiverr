import './locales'

import React,{useEffect, useState} from 'react';
import {View,TouchableHighlight,Text,Linking} from 'react-native';
import styled,{ThemeProvider} from 'styled-components/native';

import { useTranslation } from 'react-i18next';


import { useTheme } from '_theming/themeProvider';
import ModalContainer from '_brand/templates/components/ui/modal/modalContainer';
import {H1,H3,P} from  '_brand/templates/styled'; 
import RImage from './components/rImage';
import RateItems from './components/rateItems';
import Button from '_brand/templates/components/ui/Button';  


/**
 * 
 * @param {object} props 
 * @param {string} props.title 
 * @param {function} props.callback
 * @param {object} [props.containerStyle]
 * @param {string} [props.bgColor] 
 * @param {object} [props.titleStyle]
 * @param {string} [props.titleColor]  
 * @param {boolean} [props.altStyle]  
 * @param {boolean} [props.noBorder]  
 * @returns 
 */


const Ratings = (props) => {

  
  const tns= "rating";
  const { t, i18n } = useTranslation();
   const [currentRating, setCurrentRating] = useState(3);
   const [isGreat, setIsGreat] = useState(false);


  useEffect(()=> {
    console.log('isGreeeeeaaattttt')
  },[isGreat])

   const changeRating = (rating) => {
    setCurrentRating(rating)
   }

   const validateRating = () => {
    console.log("validateRating",currentRating)
   }

   const popupButtons = [
               
                {label:t("VALIDATE"),callback:validateRating,altStyle:true}
            ]

    
    const onLayout = (event) => {
      var {x, y, width, height} = event.nativeEvent.layout;
      console.log("AnimatedSelectorWrapper onLayout: ",x,y,width,height);
      /*
      setTranslateY(animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [height,0],
          extrapolate: 'clamp'
      })
      
      )
      */

      
  }

  const onCallback = () => {
    console.log("validate",currentRating)
    if(currentRating >= 4) {
      console.log("be c'est great alors")
      setIsGreat(true)
    }
  }

  const onGoStore = () => {
    if (Platform.OS === 'android') {
      Linking.openURL('market://details?id=fr.enman.easyhome'
       
        );
    }
  
  }


  const BaseContent = () => {
    return (
      <View onLayout={onLayout}>
            <View style={{'maxHeight':100,'height':100}}>
                <RImage rating={currentRating} isGreat = {isGreat}/>
            </View> 
            <H1 style={{textAlign:'center'}}>{t(tns+":"+"RATING_QUESTION")}</H1> 
            <View style={{'maxHeight':100,height:50,marginTop:16,marginBottom:16}}>
              <RateItems rating={currentRating} onChange={changeRating}/>  
            </View> 
             <Button  title={t("VALIDATE")} onPress={onCallback} altStyle  justWidth/>            
          </View>
    )
  }

  const GreatContent = () => {
    return (
      <View onLayout={onLayout}>
            <View style={{'maxHeight':100}}>
                <RImage rating={currentRating} isGreat = {isGreat}/>
            </View> 
            <H1 style={{textAlign:'center'}}>{t(tns+":"+"GREAT")}</H1> 
            <H3>{t(tns+":"+"HELP_US")}</H3>
             <Button  title={t(tns+":"+"GO_STORE")} onPress={onGoStore} altStyle  justWidth/>            
          </View>
    )
  }




    
    return ( 
      <ModalContainer>
       {isGreat == false && 
          <BaseContent/>       
       }
       {isGreat &&
          <GreatContent/>
       }
          
       
     </ModalContainer>
     );
}

export default Ratings