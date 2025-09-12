import React from 'react';
import {useContext,useState,useEffect,useRef} from 'react';
import { View,Text} from 'react-native';


import { useTranslation } from 'react-i18next';
import { useNavigation,useFocusEffect } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider';

import { Assets} from '_helpers/assets';
import {TypeWeather} from './weather';
import {WidgetWrapperInDetails} from '_components/ui/widgetWrapperInDetails';
import {useMyTools} from '_helpers/myTools';

import { useObject } from '_hooks/object';

import Slider from '@react-native-community/slider';
/**
 * Plug details page content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {string} [props.newIcon] in case typeName is not present in domusIcons
 * 
 */
export const TypeWeatherSupportDetails = (props) => {
    console.log("TypeWeatherSupportDetails",props)
    const { t, i18n } = useTranslation();
    const { itemId,newIcon} = props;
    const uObject = useObject(itemId);
    console.log("------------- uObject --------------")
    console.log(uObject)
    const {objectDatas,statuses : objStatuses} = uObject;
    const {connected} = objectDatas;
    const {theme} = useTheme();
    const navigation = useNavigation(); //v5     

   
    const activeStatusesImages = Assets.getStatusesIcons(objectDatas.id) || []
    

    const settingsAction = () => {
        console.log("voilà voilà")
    }

    const sliderRef = useRef(null);
    const onValueChange = () => {

    }

    const onSlidingComplete = () => {

    }

    return (
        <View style={{backgroundColor:'transparent'}}>               
        <WidgetWrapperInDetails connected={connected}>
        <TypeWeather   activeStatusesImages={activeStatusesImages} 
                                itemId={objectDatas.id} 
                                inLevel2={true}
                     />
        </WidgetWrapperInDetails>  
        <View style={{padding:16}}>
            <Text>Bravo Bravo mais no a pas besoin...</Text>
        </View>   
        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={0}
                            maximumValue={5}
                            step={1}
                            minimumTrackTintColor="#00000000"
                            maximumTrackTintColor="#0000000"
                            ref={sliderRef}
                            onValueChange={onValueChange}
                            onSlidingComplete={onSlidingComplete}
                           
                            />
                                
      
    </View>
    )
   
    /*

    return (
            <View style={{backgroundColor:'transparent'}}>               
                <WidgetWrapperInDetails connected={connected}>
                    <TypeWeather   activeStatusesImages={activeStatusesImages} 
                                widgetReferenceId={objectDatas.id} 
                                inLevel2={true}
                                uObject={uObject}
                     />
                </WidgetWrapperInDetails>               
               
            </View>
    )
    */
}