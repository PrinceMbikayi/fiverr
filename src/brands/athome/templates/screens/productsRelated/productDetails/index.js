import React from 'react';
import {useContext,useEffect,useState} from 'react';
import { Text, Image,View,ScrollView,SafeAreaView,TouchableHighlight,TouchableOpacity} from 'react-native';

import { useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import { TransitionPresets } from '@react-navigation/stack';
import TypeDynamicDetails from '_components/objects/@dynamics/indexDetails';
import { useTheme } from '_theming/themeProvider';
import { useAppGlobal} from '_helpers/appGlobalProvider';
import {getObjectById,getObjectRuntimeDatas} from '_helpers/selectors';
import {HeaderWithBack} from '_components/headers/header-with-back';



export const ProductDetailsScreen = ({ route, navigation }) => {
   

    const { itemId, otherParam } = route.params;
    const navParams = route.params; // needed in render   
    const { t, i18n } = useTranslation(); 
    const detailedItem = useSelector(state => getObjectById(state,itemId));
    const itemRuntimeDatas = useSelector(state =>getObjectRuntimeDatas(state,itemId));
    const title = detailedItem?.name;   
    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
    const {isVideoFullscreen} = useAppGlobal();
   
    const {getObjectMapped} = useAppGlobal();

    const findType = () => {
        //console.log("here",detailedItem)
        let foundType = itemRuntimeDatas?.disguiseType || getObjectMapped(detailedItem?.typeName) || detailedItem?.typeName;
        if(detailedItem?.typeName == 'composite' && detailedItem?.uniType != undefined)foundType = itemRuntimeDatas?.disguise || detailedItem?.uniType;
        if(detailedItem?.typeName == 'application')foundType = detailedItem?.statusDictionary.__app_id;

        //console.log("foundType",foundType)
        return foundType;
    }
   const [type,setType] = useState(findType());
   
    let newIcon = detailedItem?.img;   
   

    const [settings,setSettings] = useState({active:false})
    const [showHeader,setShowHeader] = useState(true)
    const childSettingsCallback = (callback) => {
        setSettings({active:true,callback:callback})
    }

    const childShowHeader = (val) => {
        setShowHeader(val);
    }
   

    useEffect(() => {
       
       setType(findType())
    }, [detailedItem]);

  
    const goBack = () => {
      
        navigation.goBack();
    }

    const goSettings = () => {
        if(settings.callback)settings.callback();
    }

    const noHeader = ['AirConditionerAirwell'];
    const noScrollViewWrap = ['AirConditionerAirwell'];

    const getHeader = () => {
        
        if(noHeader.indexOf(detailedItem?.typeName) != -1 || isVideoFullscreen) {
            return null
        } else {
            return <GenericHeader/>
        }
    }

    const GenericHeader = () => {
        return (
            <View style={{height:64,alignItems:'center',justifyContent:'flex-start',backgroundColor:"white"}}>
                 <HeaderWithBack title={title} backSVG centered goBack={{action:goBack}} noShadow extraButtons={settings.active ? [{action:goSettings,icon:'settings'}] : []} />
             </View>
        )
    }
    const _backgroundColor = bgColor || theme["details_body_color"] || theme["card--color--bodybg"];
    

    const getBody = () => {
        if(noScrollViewWrap.indexOf(detailedItem?.typeName) != -1) {
            return <TypeDynamicDetails className={detailedItem?.className} itemId = {itemId} newIcon={newIcon} typeName={type} setSettings={childSettingsCallback}/>  
        } else {
            return <View style={{flex: 1}}>
                        <ScrollView style={{'backgroundColor':'transparent' || theme.alt_bgcolor || 'yellow',flex:1}}> 
                            <TypeDynamicDetails className={detailedItem?.className} itemId = {itemId} itemName={detailedItem?.name} newIcon={newIcon} typeName={type} setSettings={childSettingsCallback} showHeader={childShowHeader} navParams={navParams}/> 
                           
                            {/*<ProductVersion label={firmware} color="#999999" lineColor="#CCCCCC"/>*/}
                        </ScrollView> 
                    </View>    
        }
    }

    

    return (
       <SafeAreaView style={{flex:1}}>
                {showHeader  &&
                    getHeader()
                }
                {
                    getBody()
                }
                            
            </SafeAreaView>
        
    );
}

ProductDetailsScreen.navigationOptions = {
   
    headerShown: false,
    headerMode:'screen',
    gestureEnabled: false,   
    ...TransitionPresets.ModalSlideFromRightIOS
  }

 /* ...TransitionPresets.ModalSlideFromBottomIOS*/