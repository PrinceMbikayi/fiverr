import React from 'react';
import {useContext,useEffect,useState} from 'react';
import { View,ScrollView,SafeAreaView} from 'react-native';

import { useSelector} from "react-redux";
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';

import TypeDynamicDetails from '_components/objects/@dynamics/indexDetails';

import {ProductVersion} from '_components/ui/product-version';
import { useTheme } from '_theming/themeProvider';
import { useAppGlobal} from '_helpers/appGlobalProvider';
import {getObjectById,getObjectRuntimeDatas} from '_helpers/selectors';
import {HeaderWithBack} from '_components/headers/header-with-back';



export const ProductDetailsScreen = () => {
   
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    const {itemId} = navigationParams;   
   
    const detailedItem = useSelector(state => getObjectById(state,itemId));
    const itemRuntimeDatas = useSelector(state =>getObjectRuntimeDatas(state,itemId));
    const {name : title = "",  img : newIcon = "",className } = detailedItem;

    let type = itemRuntimeDatas?.disguiseType || detailedItem.typeName;
    console.log("Type",type,detailedItem.typeName,itemRuntimeDatas);

    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    const {isVideoFullscreen} = useAppGlobal();   

    if(detailedItem.typeName == 'composite' && detailedItem.uniType != undefined)type = itemRuntimeDatas?.disguise || detailedItem?.uniType;
    if(detailedItem.typeName == 'application')type = detailedItem?.statusDictionary.__app_id;

    const firmware  = detailedItem.statusDictionary.__firmware || "";

    const [settings,setSettings] = useState({active:false})
    const [showHeader,setShowHeader] = useState(true);

    //----------------------------------------------------
    const childSettingsCallback = (callback) => {
        setSettings({active:true,callback:callback})
    }

    const childShowHeader = (val) => {
        setShowHeader(val);
    }

    useEffect(() => {
       
    }, []);
  
    const goBack = () => {       
        navigation.goBack();
    }

    const goSettings = () => {
        (settings.callback || Function)();
    }

    const noHeader = ['AirConditionerAirwell'];
    const noScrollViewWrap = ['AirConditionerAirwell'];

    const getHeader = () => {
        
        if(noHeader.indexOf(detailedItem.typeName) != -1 || isVideoFullscreen) {
            return null
        } else {
            return <GenericHeader/>
        }
    }


    const GenericHeader = () => {
                return (
                    <View style={{height:84,alignItems:'center',justifyContent:'flex-start',backgroundColor:bgColor}}>
                         <HeaderWithBack title={title} goBack={{action:goBack}} themeDependency extraButtons={settings.active ? [{action:goSettings,icon:'settings'}] : []} />
                     </View>
                )
    }
   
    
    const _backgroundColor = bgColor;
    //console.log("_backgroundColor",_backgroundColor)

    const getBody = () => {
        if(noScrollViewWrap.indexOf(detailedItem.typeName) != -1) {
            return <TypeDynamicDetails className={className} itemId = {itemId} newIcon={newIcon} typeName={type} setSettings={childSettingsCallback}/>  
        } else {
            return <View style={{flex: 1}}>
                        <ScrollView style={{'backgroundColor':_backgroundColor}}> 
                            <TypeDynamicDetails className={className} itemId = {itemId} newIcon={newIcon} typeName={type} setSettings={childSettingsCallback} showHeader={childShowHeader} navParams={navParams}/> 
                            
                            {/*<ProductVersion label={firmware} color="#999999" lineColor="#CCCCCC"/>*/}
                        </ScrollView> 
                    </View>    
        }
    }

    return (
       
            <SafeAreaView style={{flex:1}}>
                {showHeader &&
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
