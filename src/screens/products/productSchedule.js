import React from 'react';
import {useContext,useEffect} from 'react';
import { useSelector} from "react-redux";
import { TransitionPresets } from '@react-navigation/stack';


import {getObjectById,getWidgetReference} from '_helpers/selectors';
import TypeDynamicSchedule from '_components/objects/@dynamics/indexScheduleTask';



export const ProductScheduleScreen = ({navigation,route}) => {
     
   
    const { itemId, otherParam } = route.params; //v5   
    const objectDatas = useSelector(state => getObjectById(state,itemId));
    
    const type = objectDatas.typeName;
    // needed for Composite Object
    const uniType = objectDatas.uniType;
    //const navigationParams = navigation.state.params; //v4
    const navigationParams = route.params; //v5
    let newIcon = objectDatas.img;


    console.log("yep yep yep ProductScheduleScreen",navigationParams)  




    useEffect(() => {
       
    }, []);
  
    const goBack = () => {
        //console.log(navigation);
        navigation.goBack();
    }
    
    return (
       
        <TypeDynamicSchedule typeName={type} uniType={uniType} className={objectDatas.className} itemId = {itemId} newIcon={newIcon}  navigationParams={navigationParams} navigation={navigation}/>   
        
    );
}

ProductScheduleScreen.navigationOptions = {
   
    headerShown: true,
    headerMode:'screen',
    ...TransitionPresets.SlideFromRightIOS
  }

