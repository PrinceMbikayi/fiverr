
import {HeaderWithBack} from '_components/headers/header-with-back';
import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,SafeAreaView,ScrollView} from 'react-native';
import {H1,P} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';
import InfoCircle from '_images/icons/app/InfoCircleR';

import { InferProps } from "prop-types";

import { CatPropTypes } from "./propTypes"; // <-----



/**
 * Ma ScreenHeader Doc Princess2
 * @category voila
 * @component
 * @param {object} props 
 * @param {string} props.title
 * @param {boolean} [props.goBack]
 * @example
 * const age = 21
 * const name = 'Jitendra Nirnejak'
 * return (
 *   <User age={age} name={name} />
 * )
 * @returns {FC}
 */
const ScreenHeaderComp = (props) => {
      
    const {title,goBack,showInfos} = props;   
     return  <View style={{height:64,backgroundColor:'transparent',alignItems:'center',justifyContent:'center'}}>
                      <HeaderWithBack title={title} goBack={{action:goBack}}  backSVG centered noShadow
                        extraButtons={[{action:showInfos,svgr:<InfoCircle/>}]} bgColor="transparent"/>
                  </View>       
  }




  export default ScreenHeaderComp

