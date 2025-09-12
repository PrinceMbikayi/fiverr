import React, { useState, useEffect} from 'react';
import { View,Text,StyleSheet} from 'react-native';
import { useObject } from '_hooks/object';

import { useTheme } from '_theming/themeProvider';
import {iconsJs} from '_brand/utils/iconsJs';
import { LightPlugWidget } from '_brand/templates/components/objects/light/components/LightPlugWidget';
import { GarageCommonWidget } from '_brand/templates/components/objects/garagedoor/components/GarageCommonWidget';
import { GatesCommonWidget } from '_brand/templates/components/objects/gates/components/GatesCommonWidget';
import {CommonShutterWidgetView} from '_brand/templates/components/objects/shutters/components/CommonShutterWidgetView';


export const TestZigbeeObject = (props)=>{

    const {itemId, typeNature} = props;
    
    const [currentActive, setCurrentActive] = useState();

    const uObject = useObject(itemId);
    const shutterName = uObject?.name;
    const status = uObject?.statuses?.status
    const typeName = uObject?.objectDatas?.typeName;
    console.log("Type Name :", itemId, typeName)

    let  iconList = [iconsJs.upIcon,iconsJs.stopIcon,iconsJs.downIcon]

    const {theme} = useTheme();  
    const textColor = theme?.prflxTextColor||'black'

    useEffect(()=> {

    },[currentActive, status]);

    const handlePress = (iconId)=>{
        console.log("LE ID : ", itemId, iconId)
        if(iconId == 'OPEN/OPEN/' + `${itemId}`){
            setCurrentActive(iconId);
            uObject?.execute("OPEN");
        }
        if(iconId =='STOP/STOP/' + `${itemId}`){
            setCurrentActive(iconId);
            uObject?.execute("STOP");
        }
        if(iconId =='CLOSE/CLOSE/' + `${itemId}`){
            setCurrentActive(iconId);
            uObject?.execute("CLOSE");
        }
    }

    // const icons = [
    //     (status =='moving' && currentActive == 'up')? iconsJs.stopIcon : iconsJs.upIcon,
    //     (status =='moving' && currentActive == 'down' ) ? iconsJs.stopIcon : iconsJs.downIcon,
    // ]

    const icons = [
        iconsJs.upIcon,
        iconsJs.stopIcon,
        iconsJs.downIcon,
    ]

    const TYPES = ["Rolling_Shutter_Ezsp", "Shade_Ezsp"]
    const GATES = ["Gate_Ezsp", "Gate_Toggle_Ezsp"]
    const DOOR = ["Garage_Door_Toggle_Ezsp", "Garage_Door_Ezsp"]
    const SHUTTERS = ["Rolling_Shutter_Ezsp", "Shade_Ezsp", "Venetian_Shutter_Ezsp"]
    let picto;

    switch(typeNature){
        
        case 'Rolling_Shutter_Ezsp':
            picto = [iconsJs.vrLevel50Icon]
            break;

        case "Shade_Ezsp" :
            picto = [iconsJs.vrLevel50Icon]
            break;

        case "Venetian_Shutter_Ezsp" :
            picto = [iconsJs.bsoLevel50Icon]
            break;

        case "LightEzsp" :
            picto = [iconsJs.lightOffIcon]
            break;

        case "SwitchEzsp" :
            picto = [iconsJs.plugOffIcon]
            break;

        case "Gate_Ezsp":
            picto = [iconsJs.gateSomewhereIcon]
            break;

        case "Gate_Toggle_Ezsp":
            picto = [iconsJs.gateSomewhereIcon]
            break;

        case "Garage_Door_Ezsp":
            picto = [iconsJs.garageOpenIcon]
            break;
        case "Garage_Door_Toggle_Ezsp":
            picto = [iconsJs.garageOpenIcon]
            break;

        default : 
            picto = [iconsJs.vrLevel50Icon]
            break;



    }

    return(
        <View  style={{paddingHorizontal:11, paddingVertical:30, width:'100%', backgroundColor:'transparent'}}>
                    {["LightEzsp", "SwitchEzsp"].includes(typeNature)?
                        typeNature =='LightEzsp'?
                            <View style={{flex:11, minWidth:200, backgroundColor:'white', borderRadius:14, padding:5, borderWidth:1, borderColor:'orange'}}>
                            <LightPlugWidget itemId = {itemId} iconSize = {40} isLight />
                            </View>
                            :
                            <View style={{flex:1, minWidth:200, backgroundColor:'white', borderRadius:14, padding:5, borderWidth:1, borderColor:'orange'}}>
                            <LightPlugWidget itemId = {itemId} iconSize = {40} isPlug />
                            </View>
                    :

                        <View style={{flex:1, minWidth:300, backgroundColor:'white', borderRadius:14, paddingVertical:5, paddingHorizontal:0, borderWidth:1, borderColor:'orange', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            {GATES.includes(typeNature) &&
                                <GatesCommonWidget itemId = {itemId}/>
                            }
                            {DOOR.includes(typeNature) &&
                                <GarageCommonWidget itemId = {itemId}/>
                            }
                            {SHUTTERS.includes(typeNature) &&
                                <CommonShutterWidgetView itemId = {itemId} iconList={iconList}/>
                            }
                        </View>
                    }



        </View> 
    )
}

const styles = StyleSheet.create({
    iconDisplay:{
        flexDirection:'row',
        marginRight:10,
        marginLeft:20,
        marginTop:8,
        marginBottom:8,
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