import React from 'react';
import {useContext,useState,useEffect} from 'react'
import { View,Switch,Text,Image, TouchableOpacity} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';


import {TypeApplicationThermostat} from './thermostat';
import {thermostatDefaultProg} from './thermostatConfig';

import {RightChevron} from '_components/ui/rightChevron';
import {setScheduleDatas} from '_actions/objects';
import {convertThermostatToSchedule} from '_helpers/heaterTools';
import { useTheme } from '_theming/themeProvider';
import {getObjectById} from '_helpers/selectors';
import { useObject } from '_hooks/object';

export const TypeThermostatDetails = (props) => {
    const { t, i18n } = useTranslation();
    const { itemId,typeName} = props;
    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    

    const dispatch = useDispatch();   
   
    const uObject = useObject(itemId);
   // console.log("uObject",uObject)
    const {objectDatas, statuses : objStatuses} = uObject;
    //const objectDatas = useSelector(state => getObjectById(state,itemId));    
    const __app_id =  objStatuses.__app_id;  
   // const objStatuses = objectDatas.statusDictionary;
    const objParameters = objectDatas.parameters;  

   

    const [dayRanges,setDayRanges] = useState([])

    //const {theme} = useTheme();
    const iconColor = theme['card--color--icon'];
 
    const iconBackgroundColor = theme['widget--round--wrapper--color--background'] || props.backgroundColor;


    useEffect(() => {
       
        getProgCrons();
        const d = new Date();
        const n = d.getDay();
        const currentDay = (n == 0 ? 7 : n-1)
        //setDayRanges(getProgCrons()[currentDay]);
        //sched();        
    }, []);

    useEffect(()=> {
        // lors d'un reload la propriété schedule_datas de l'objet disparait 
        // car elle ne fait pas partie des propriétés provenant du serveur
        // il faut donc les rajouter
        // trouver un autre mécanisme 
        // 
        if(objectDatas.schedule_datas == undefined) {
            getProgCrons();  
        }
    },[objectDatas.schedule_datas])
    useEffect(()=> {
       console.log("updateMe thermostat")
    },[objectDatas])

    const getProgCrons = () => {

         if(objectDatas.schedule_datas == undefined) { 
            let datas;           
            const prog = (objectDatas.parameters.prog != "") ? objectDatas.parameters.prog : thermostatDefaultProg;
            datas = convertThermostatToSchedule(itemId,prog);            
            dispatch(setScheduleDatas(itemId,datas));                  
            return datas;

         } else {
             return objectDatas.schedule_datas
         }
         
     }
    
    const _goProgram = () => { 
         navigation.navigate('ProductProgram',{
                 itemId:itemId,
                 title : "Programmation",
                 "type":__app_id
         })
     }

     const _goSettings = () => {
        console.log("_goSettings",itemId);
        navigation.navigate('ProductSettings',{
                itemId:itemId,
                title : "Settings",
                "type":__app_id
        })
     }

    return (
            <>
               
                <View>
                <View style={{flex:1,flexDirection:'row',padding:20}}>
                            <View style={{flex:2}}>
                                <Text style={{fontSize:20,color:textColor}}>{t("scenarios:THERMOSTAT_SETTINGS")}</Text>
                            </View>
                            <TouchableOpacity  onPress={_goSettings}>
                                <Image style={{width:22,height:22,tintColor:iconColor}} source={require('_images/interfaces/menu/settings.png')}></Image>                            
                            </TouchableOpacity>
                    </View>
                    <View style={{flex:1,flexDirection:'row',padding:20}}>
                            <View style={{flex:2}}>
                                <Text style={{fontSize:20,color:textColor}}>{t("scenarios:SCHEDULE_HEATER_TITLE")}</Text>
                            </View>
                            <RightChevron callback= {_goProgram} color={iconColor}/>                            
                    </View>
                        {/*
                             <ProgramHeaterDay ranges={dayRanges} dayId={0}/>
                        */}
                   
                </View>
            </>
    )  
}
