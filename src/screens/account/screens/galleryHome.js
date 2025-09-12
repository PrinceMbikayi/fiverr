import React, {useContext,useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,ScrollView,SafeAreaView} from 'react-native'; // use in styled components
import { useSelector,useDispatch } from 'react-redux';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import {StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';
import { useAppGlobal} from '_helpers/appGlobalProvider';
import {getObjectsByIds} from '_helpers/selectors';
import {getAllFiles} from '_api/objects';
import{getUser} from '_helpers/selectors';
import {AccountHeader} from '../components/header';
import { AccountScreenLine } from '../components/accountLine'; 
import { ResourceStore } from 'i18next';





export const GalleryHome= (props) => {
   
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const title = t('account:GALLERY');
    const userDetails = useSelector(state =>getUser(state));
    const [mediaSources,setMediaSources] = useState([]);
    const allObjects = useSelector(getObjectsByIds);
    
   const navigation = useNavigation();
   
    const doNavigation = (id) => { 

      
        
        const params = { 'itemId':id}   
        navigation.navigate("DeviceGallery",params);
        
    }
   
   
    useEffect(() => {


        console.log("HERE")
        const initMe = async() => {
           const allFiles = await getAllFiles();
           console.log('allFiles',allFiles) ;
            let result = []
            if(allFiles?.errCode == 200) {
                result = allFiles?.res.reduce ((r,v,i) => {
                    
                    const id = v?.resource?.id
                    const originObject = allObjects?.[id];
                    const files = v?.resource?.files || [];
                    const filesCount = files.length;
                    r.push({'id':id,'name':originObject?.name,'files':files,'filesCount':filesCount,'type':originObject?.typeName});
                    return r;
                },[]);
            }
            console.log("result",result)
            setMediaSources(result)
        }
        initMe();
       }, []);

       useEffect(() => {
        console.log("alors",mediaSources)
       }, [mediaSources]);



       const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    return (
        <SafeAreaView style={{flex:1,backgroundColor:bgColor}}>
            <AccountHeader title={title} />     
            <ScrollView style={{padding:15,paddingTop:0,flex:1}}> 
            { mediaSources?.map((v,i) => {
                return (
                    <AccountScreenLine icon="gallery" title={v.name+" ("+v.filesCount+")"} fullTouchable actionType="navigate" callback={doNavigation} id={v.id} key={v.id}/>
           
                )
            })}   
                </ScrollView>
        </SafeAreaView>     
                    
        )
}
