import React,  { useState , useEffect }  from 'react';
import { View,Text , StyleSheet, Pressable} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import {useDispatch} from "react-redux";

import {iconsJs} from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { useNavigation,useRoute } from '@react-navigation/native';
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
/**
 * Shutter Details content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {object} props.statuses
 * @param {UseObject} props.uObject
 * 
 */
export const ShuttersRoutineGroupWidget = (props) => {
    const {itemId} = props;
    const { t, i18n } = useTranslation();
    const tns = "rollingShutter";
    const dispatch = useDispatch();

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    console.log("PARAMS : ", navigationParams)

    const [currentActive, setCurrentActive] = useState();
    const [stateIcon, setStateIcon] = useState([]);

    const uObject = useObject(itemId);
    console.log(uObject)
    const typeName = uObject?.widgetReferenceDatas?.typeName;

    const shutterLevel = uObject?.statuses?.level
    const shutterName = uObject?.name;
    const status = uObject?.statuses?.status;
    const typeNature = uObject?.statuses?.__user_typeNature;
    const traits = uObject?.objectDatas?.traits;
    const isObjectConnected = uObject?.connected;


    const types = uObject?.objectDatas?.componentTypes;
    const components = uObject?.objectDatas?.components;


    // THeming-----
    const {theme} = useTheme();  
    const textColor = theme?.prflxTextColor||'black'
    //---------------

    let picto868;
    if(typeNature == "store"){
        picto868 = [iconsJs.store868Icon]
    } else if (typeNature == "bso"){
        picto868 = [iconsJs.bso868Icon]
    }else{picto868 = [iconsJs.vr868Icon]}


    let iconDisplay;
    if (types?.length > 1){
        iconDisplay = [iconsJs.groupShuttersIcon]
    }else{
        iconDisplay= (typeNature != undefined)? picto868 : stateIcon
    }
 

    const icons = [
        iconsJs.upIcon,
        iconsJs.downIcon,
        iconsJs.favIcon
    ]

    const favIcon = [iconsJs.favIcon]

    useEffect(()=>{
        console.log("HHHHYYYYYYYYYY :", navigationParams)
    },[currentActive])
    useEffect(()=>{
        console.log("STATE ICON:",stateIcon)
    },[stateIcon])

    useEffect(()=>{
    },[typeNature])

  function range(start, end) {
    if(start === end) return [start];
    return [start, ...range(start + 1, end)];
}
const openRange = range(90,100);
const levelRange75 = range(75,89);
const levelRange50 = range(50,74);
const levelRange25 = range(25,49);
const closeRange = range(0,24);


useEffect(()=> {
    const statusLevel = Number(shutterLevel);
    if(closeRange?.includes(statusLevel)) {
        typeName == "Venetian_Shutter_Ezsp"? setStateIcon([iconsJs.bsoCloseIcon]) : setStateIcon([iconsJs.vrCloseIcon]);
    }
    if(openRange?.includes(statusLevel)){
        typeName == "Venetian_Shutter_Ezsp"? setStateIcon([iconsJs.bsoOpenIcon]) : setStateIcon([iconsJs.vrOpenIcon]);
    } 
    if(levelRange25?.includes(statusLevel)){
        typeName == "Venetian_Shutter_Ezsp"? setStateIcon([iconsJs.bsoLevel25Icon]) : setStateIcon([iconsJs.vrLevel75Icon]);
    }
    if(levelRange50?.includes(statusLevel)){
        typeName == "Venetian_Shutter_Ezsp"? setStateIcon([iconsJs.bsoLevel50Icon]) : setStateIcon([iconsJs.vrLevel50Icon]);
    }
    if(levelRange75?.includes(statusLevel)){
        typeName == "Venetian_Shutter_Ezsp"? setStateIcon([iconsJs.bsoLevel75Icon]) : setStateIcon([iconsJs.vrLevel25Icon]);
    }
    console.log("TYPE NAME :", typeName, types, uObject)
},[components,shutterLevel]);



useEffect(()=>{

}, [isObjectConnected])


const handleIconPress = (iconId) =>{
    console.log("Pressed : ", iconId);
    console.log("STATUS ", status)
    if(iconId == "OPEN/OPEN/"+`${itemId}`){
        setCurrentActive(iconId);
        uObject?.execute("OPEN");
    }
    if(iconId =="STOP/STOP/"+`${itemId}`){
        setCurrentActive(iconId);
        uObject?.execute("STOP");
    }
    if(iconId =="CLOSE/CLOSE/"+`${itemId}`){
        setCurrentActive(iconId);
        uObject?.execute("CLOSE");
    }
    if(iconId == "FAV_CALL_1/FAV_CALL_1/"+`${itemId}`){
        console.log(" TESSSSTTT FAV POS :", status)
        setCurrentActive(iconId);
        uObject?.execute("FAV_CALL_1");
    }
}

const sendCurrentActive = (id) =>{
    setActive(id);
}


    return (
        <Pressable disabled={true} onPress={() => console.log("Tuile Pressed")} style={{flex:1,justifyContent:'center', alignItems:'center',borderRadius:12,}}>
            
            <View style={{
                    flex:1,width:'100%',backgroundColor:'transparent',flexDirection:'row', alignItems:'center', 
                    justifyContent:'space-between', borderRadius:12,
                    }}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginLeft:10, paddingRight:4, backgroundColor:'transparent'}}>

                    <MultiPurposeWidgetLine 
                            isPressable = {false}
                            icons={iconDisplay} 
                            iconSize={48}
                            onPress = {handleIconPress} 
                            onLongPress = {handleIconPress}
                            //active = {sendCurrentActive}
                            iconWrapperStyle = {[{borderColor:textColor}]}
                            iconGroupWrapperStyle = {[{ alignItems:'center', justifyContent:'center', borderColor:'transparent', borderWidth:1, backgroundColor:'transparent'}]}
                            isShadow = {false}
                            />
                </View>

                <View style={{backgroundColor: 'transparent', width:'18%', height:'100%'}}></View>

                <View style={{ backgroundColor: 'transparent', alignItems: 'center', width: '60%', }}>
                    <Text
                        style={{
                            alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginBottom: 5, marginTop: 0,
                            fontSize: 14, fontWeight: "400", flexWrap: 'wrap', color: textColor
                        }}
                    >
                        {shutterName}
                    </Text>
                    <RoutineWidgetLine
                        itemId={itemId}
                        icons={icons}
                        isPressable={true}
                        onPress={handleIconPress}
                        onLongPress={handleIconPress}
                        active={sendCurrentActive}
                        iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                        isShadow={true}
                    />
                </View>
            </View>
                
        </Pressable>
    )
}

const styles = StyleSheet.create({
    iconDisplay: {
        flexDirection: 'row',
        marginLeft: 15,
        marginTop: 4,
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 7,
        justifyContent: 'space-evenly'
    },
    groupIconWrapper:{
        flexDirection:'row',
        backgroundColor:'transparent'
    }

})