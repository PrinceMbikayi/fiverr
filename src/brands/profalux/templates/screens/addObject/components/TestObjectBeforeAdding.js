import React, { useState, useEffect} from 'react';
import { View,Text,StyleSheet} from 'react-native';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { useObject } from '_hooks/object';

import { useTheme } from '_theming/themeProvider';
import {iconsJs} from '_brand/utils/iconsJs';
import { CardResponsive } from '_brand/templates/screens/addObject/components/CardResponsive';


export const TestObjectBeforeAdding = (props)=>{

    const {itemId, handleIconPress, typeNature} = props;
    
    const [currentActive, setCurrentActive] = useState();

    const uObject = useObject(itemId);
    const shutterName = uObject?.name;
    const status = uObject?.statuses?.status
    const typeName = uObject?.objectDatas?.typeName;
    console.log("NEW_868_ITEM :", itemId, uObject)

    const {theme} = useTheme();  

    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'

    useEffect(()=> {

    },[currentActive, status]);

    const handlePress = (iconId)=>{
        console.log("TEST_PRESS :", iconId)
        handleIconPress(iconId)
        if(iconId == "OPEN/OPEN/"+`${itemId}`){
            setCurrentActive(iconId);
            uObject?.execute("OPEN");
        }
        if(iconId == "STOP/STOP/"+`${itemId}`){
            setCurrentActive(iconId);
            uObject?.execute("STOP");
        }
        if(iconId == "CLOSE/CLOSE/"+`${itemId}`){
            setCurrentActive(iconId);
            uObject?.execute("CLOSE");
        }
    }

    const icons = [
        iconsJs.upIcon,
        iconsJs.stopIcon,
        iconsJs.downIcon,
        // (status =='moving' && currentActive == 'up')? iconsJs.stopIcon : iconsJs.upIcon,
        // (status =='moving' && currentActive == 'down' ) ? iconsJs.stopIcon : iconsJs.downIcon,
    ]
    let picto;
    if(typeNature == "store"){
        picto = [iconsJs.store868Icon]
    } else if (typeNature == "bso"){
        picto = [iconsJs.bso868Icon]
    }else{picto = [iconsJs.vr868Icon]}

    return(
        <View  style={{paddingHorizontal:11, paddingVertical:30,}}>
            <CardResponsive 
                withNextArrow = {false}
                >

                    <View style={{backgroundColor:'transparent', flexDirection:'row'}}>
                        <View style={{marginRight:80, alignSelf:'center', justifyContent:'center'}}>
                            <MultiPurposeWidgetLine 
                                icons={picto} 
                                iconSize={48}
                                isPressable = {false}
                                //onPress = {handleIconPress} 
                                //active = {sendCurrentActive}
                                iconWrapperStyle = {[{borderColor:textColor}]}
                                //iconGroupWrapperStyle = {[{ alignItems:'center', justifyContent:'center', borderColor:'transparent', borderWidth:1, backgroundColor:'transparent'}]}
                                isShadow = {false}
                            />
                        </View>

                        <View style={{backgroundColor:'transparent', alignItems:'center', justifyContent:'center', width:'50%',}}>
                            <Text 
                                style={{alignItems:'center', justifyContent:'center' ,backgroundColor:'transparent',
                                fontSize:16, fontWeight:"400", flexWrap:'wrap', color:textColor}}
                                >
                                    {shutterName}
                            </Text>
                            <MultiPurposeWidgetLine 
                                    itemId = {itemId}
                                    icons={icons} 
                                    isPressable = {true}
                                    onPress = {handlePress} 
                                    //onPress = {handleIconPress} 
                                    //active = {sendCurrentActive}
                                    iconWrapperStyle = {[styles.iconDisplay, {borderColor:textColor}]}
                                    //iconGroupWrapperStyle = {[styles.groupIconWrapper]}
                                    isShadow = {true}
                                    />
                        </View>
                    </View>

            </CardResponsive>
        </View> 
    )
}

const styles = StyleSheet.create({
    iconDisplay:{
        flexDirection:'row',
        marginRight:30,
        marginTop:8,
        marginBottom:5,
        borderWidth:1,
        borderRadius:7,
        justifyContent:'space-evenly'
        //backgroundColor:'white'
    },
    groupIconWrapper:{
        flexDirection:'row',
        backgroundColor:'transparent'
    },


})