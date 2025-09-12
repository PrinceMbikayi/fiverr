import '_brand/templates/screens/maison/locales'
import React, { useState, useEffect} from 'react';

import {SafeAreaView, View, Dimensions} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation} from '@react-navigation/native';

import { useTheme} from '_theming/themeProvider'
import { Header } from '_brand/templates/screens/maison/components/Header';

import {AutomatedTestIdDisplay} from '_components/objects/@common/testAutomation/AutomatedTestId';

import { PopupMenu } from '_brand/templates/components/headers/components/PopupMenu';
import {iconsJs} from '_brand/utils/iconsJs';
import { ScrollView } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;

export const MaisonTemplateScreen = (props) => {
    
    const {children, withKebab} = props

    const [kebab, setKebab] = useState({ active: false, options: [{}] })

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "maison";

    const {theme } = useTheme();
    
    const widgetbgColor = theme?.prflxwidgetbgColor||'white';

    const showInfos = () => {
       console.log("voilà voilà");
        navigation.toggleDrawer();
    }
    const handleOnPress = (id) =>{
        navigation.toggleDrawer();
    }
      const accessibilityLabel = "Screen_DASHBOARD";


      const bgColor = theme?.prflxbgColor || 'white';
      const headerBgColor = theme?.prflxHeaderBackground || 'white';
      const borderColor = theme?.prflxBorderColor || 'red';
      const textColor = theme?.prflxTextColor||'black'
     

      useEffect(() => {
        if(setKebab){
            setKebab({ active: true, options: options })
        }
    },[]);

    const options = [
        {
            id:"add",
            title:`${t(tns + ":" + "ADD_ROOM")}`,
            iconJSName: iconsJs.addIcon.name,
            action:()=>kebabAddRoom()
        },
        {
            id:"modify",
            title:`${t(tns + ":" + "MODIFY_ROOM")}`,
            iconJSName: iconsJs.modifyIcon.name,
            action:(optionId)=>kebabSelectRoom(optionId)
        },
        {
            id:'delete',
            title:`${t(tns + ":" + "DELETE_ROOM")}`,
            iconJSName: iconsJs.deleteIcon.name,
            action:(optionId)=>kebabSelectRoom(optionId)
        },
    ]

    const kebabSelectRoom = (id)=>{
        navigation.navigate('SelectRoomScreen', {gotask:id});
    //navigation.navigate('GroupModifyScreen',{'typeName':shutterObjectAllInfos?.objectDatas?.typeName,itemId:itemId});
}
const kebabAddRoom = ()=>{
        navigation.navigate('AddRoomScreen');
}

    console.log("ProductTemplateScreen ready !!!!!!")

      return (
            <SafeAreaView style={{height:'100%', backgroundColor:'white'}} accessibilityLabel={accessibilityLabel}>
                {/* <StatusBar no_hidden={true} barStyle="dark-content"/> */}
            
                <View style={{flex:1,backgroundColor:bgColor}}>

                    {/* marginTop:-60, paddingTop:65.5, height:Platform.OS == "ios"? '16%':'18.5%'*/}
                    <View   style={{backgroundColor:'transparent' || headerBgColor, alignItems:'center',justifyContent:'flex-end'}}>
                        <Header 
                            title={t(tns + ":" + "HOUSE")}
                            //title={weatherTown}
                            noShadow 
                                bgColor="transparent" 
                            hideBurger = {false} 
                            kebab={kebab.active ? <PopupMenu options={kebab.options} /> : null} 
                        />
                    </View> 
                    <AutomatedTestIdDisplay autoTestId={accessibilityLabel}/>
                    <ScrollView 
                            style={{backgroundColor:'transparent',paddingHorizontal:0.1*screenWidth/4, paddingBottom:0}}
                            showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                        >
                        {
                            children
                        }
                    
                        <View style={{height:51, width:300, backgroundColor:'transparent'}}></View>
                    </ScrollView> 

                </View>

                </SafeAreaView> 
   
    )
    };
