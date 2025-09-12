import React from 'react';
import {useContext,useEffect} from 'react';
import { useSelector} from "react-redux";

import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import TypeDynamicDelay from '_components/objects/@dynamics/indexDelayTask';
import {getObjectById,getWidgetReference} from '_helpers/selectors';

export const ProductDelayScreen = () => {   
  
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    const {itemId} = navigationParams;
    const objectDatas = useSelector(state => getObjectById(state,itemId));
    
    const type = objectDatas.typeName;
    // needed for Composite Object
    const uniType = objectDatas.uniType;   
    let newIcon = objectDatas.img;
   
    useEffect(() => {
       
    }, []);
  
    const goBack = () => {
        console.log(navigation);
        navigation.goBack();
    }
    
    return (       
        <TypeDynamicDelay typeName={type} uniType={uniType} className={objectDatas.className} itemId = {itemId} newIcon={newIcon}  navigationParams={navigationParams} navigation={navigation}/>   
    );
}

ProductDelayScreen.navigationOptions = {
   
    headerShown: true,
    headerMode:'screen',
    ...TransitionPresets.SlideFromRightIOS
  }
