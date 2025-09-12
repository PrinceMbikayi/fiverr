import React from 'react';
import {useContext} from 'react';

import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';

import ThermostatWizard from './thermostatWizard'


export const ThermostatUpdateScreen = (props) => {

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    

    const goBack = () => {     
        console.log("je suis là ThermostatUpdateScreen pour le back");
        console.log("navigation",navigation)
        navigation.goBack();       
    }
    return (
        <>      
         <ThermostatWizard goBack={goBack} {...props} />
        </>
    )

}

ThermostatUpdateScreen.navigationOptions = {
   
    headerShown: false,
    headerMode:'screen',
    gestureEnabled: false,   
    ...TransitionPresets.SlideFromRightIOS
  }