import React, { Component } from 'react';
import {useContext,useState,useRef,useEffect} from 'react';
import { useStore,useSelector,useDispatch } from 'react-redux';
import { View, Text,SafeAreaView,Image,TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import * as flags from '_assets/flags/48';




export const CountryPicker = (props) => {

    const {callback} = props
    const isMounted = useRef(false);
    const { t, i18n } = useTranslation(); 

    const countriesSrc = require('_assets/flags.json');   
    const countriesKeys = (Object.keys(countriesSrc)) || [];


    // DID MOUNT
    useEffect(() => {
        isMounted.current = true;        
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);

    const myCallback = (code) => {
        if(callback) {
            callback(code)
        }
    }
     

    return (
        <View style={{  flexDirection:'row', flexWrap:'wrap',       
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding:15
                         }}>
        { countriesKeys.map((v,i)=> {
            const flag = flags[v];
            const code = v;
            console.log(flag);
            return (  
                <>
                { flag != undefined &&  
                    <View style={{padding:5}}> 
                        <TouchableWithoutFeedback onPress={()=> myCallback(code)}>      
                           <View>
                           <Image source={flag} /> 
                           </View>
                        </TouchableWithoutFeedback>      
                    </View>    
                } 
                </>            
            )
                
            })        
        }
        </View>
    )
}
export const getFlag = (code,size) => {
    const flag = flags[code];
    return (       
            <Image source={flag} style={{...size ? { width: size } : {} }} resizeMode={'contain'}/> 
    )
}