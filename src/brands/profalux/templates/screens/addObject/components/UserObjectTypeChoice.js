import React,{ useState} from 'react';
import { View,Text,StyleSheet, FlatList} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getLoadedObjects} from '_helpers/selectors';

import { useTheme } from '_theming/themeProvider';
import {iconsJs} from '_brand/utils/iconsJs';
import { RenderObjectTypeChoice } from './RenderObjectTypeChoice';

export const UserObjectTypeChoice = (props)=>{
    const {onPressHandler, bgColor, iconColor, iconJs, options} = props;

    const { t, i18n } = useTranslation();
    const { theme } = useTheme();


    const [userChoice, setUserChoice] = useState("")
    const [active, setActive] = useState("")
  
    const widgetbgColor = theme?.prflxwidgetbgColor||'white';

    const loadObjects =  useSelector(getLoadedObjects);

    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    
    const iconthemeColor = theme?.prflxIconColor||'white';
    const iconthemebgColor = 'white';

    const choiceList = [
        {
          id: 'vr',
          title: 'Volet Roulant',
        },
        {
          id: 'store',
          title: 'Store',
        },
        {
          id: 'bso',
          title: 'BSO',
        },
      ];

    const handlePress = (item, index)=>{
        console.log("WHAT :", item)
        if(item == "vr"){
            setActive(item)
        }
        if(item == "store"){
            setActive(item)
        }
        if(item == "bso"){
            setActive(item)
        }
        
        onPressHandler(item);
    }
    return(

        <View  style={{paddingHorizontal:12, marginBottom:15}}>
                <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row', backgroundColor:'transparent'}}>
                            <FlatList
                                data={options || choiceList}
                                renderItem={
                                        ({item, index}) => 
                                        <RenderObjectTypeChoice 
                                            id = {item.id} 
                                            index = {index} 
                                            handlePress = {handlePress} 
                                            title = {item.title} 
                                            IconJS = {item.iconJs || [iconsJs.vrOpenIcon]}
                                            borderWidth={active === item.id ? 1.2 :0}
                                            //IconJS = {iconJs || [iconsJs.vrOpenIcon]}
                                            bgColor = {bgColor || active === item.id? iconthemeColor : iconthemebgColor}
                                            iconColor = {iconColor || active === item.id? iconthemebgColor :  "#DBDADA"}// #ced0d2
                                        />
                                    }
                                keyExtractor={(item, index) => "key_"+index} 
                                numColumns={3}
                            />
                </View>
    </View> 
    )
}


const styles = StyleSheet.create({
        validateButton:{
            width:200,
            height:50,
            marginTop:200
        },
        toggleWrapper:{
            backgroundColor:"transparent",
            borderRadius:12,
            alignItems:'baseline',
            justifyContent:'space-evenly',
            padding:1,
            marginRight:9,
          }
  });