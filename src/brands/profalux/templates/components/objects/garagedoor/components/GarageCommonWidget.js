import '_brand/templates/components/objects/common/locales'
import React,  { useState , useEffect }  from 'react';
import { View,Text , StyleSheet, Pressable} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import {iconsJs} from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'


/**
 * Shutter Details content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {object} props.statuses
 * @param {UseObject} props.uObject
 * 
 */
export const GarageCommonWidget = (props) => {
    const {itemId, whichShutter} = props;
    const { t, i18n } = useTranslation();
    const tns = "common";
    const {theme} = useTheme();  

    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'

    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    console.log("TELL ME YOUR TYPE NAME :", typeName);
    console.log("SHUTTER ALL INFOS : ", uObject);
    const gateName = uObject?.name;
    const status = uObject?.statuses?.status
    const traits = uObject?.objectDatas?.traits;
    const isObjectConnected = uObject?.connected;
    console.log("DISCONNECTED :", isObjectConnected)
    
    const typeNature = uObject?.statuses?.__user_typeNature;
    const [currentActive, setCurrentActive] = useState();
    const [stateIcon, setStateIcon] = useState([]);
    const [isToggleMode, setIsToggleMode] = useState(!traits?.includes("Open")) // true => non toggle
    const [statusMsg, setStatusMsg] = useState("");

    console.log("STATUS ::::::: ", status)

    const icons = [
        iconsJs.upIcon,
        iconsJs.downIcon,
    ]

useEffect(()=> {
    if(status == 'down' || status =='closed') {
        setStateIcon([iconsJs.garageCloseIcon]);
        const msg = `${t(tns+":"+"GARAGE_CLOSED")}`
        setStatusMsg(msg)
    }else if(status == 'up' || status =='open'){
        setStateIcon([iconsJs.garageOpenIcon]);
        const msg = `${t(tns+":"+"GARAGE_OPENED")}`
        setStatusMsg(msg)
    }else{
        setStateIcon([iconsJs.garageSomewhereIcon]);
        const msg = `${t(tns+":"+"GARAGE_AJAR")}`
        setStatusMsg(msg)
    }


},[currentActive, statusMsg, status,]);


useEffect(()=>{

},[stateIcon])
  

const handleIconPress = (iconId) =>{
    console.log("Pressed : ", iconId);

    if(iconId == 'OPEN/OPEN/'+`${itemId}`){
        setCurrentActive(iconId);
        uObject?.execute("OPEN");
    }

    if(iconId == "CLOSE/CLOSE/"+`${itemId}`){
        setCurrentActive(iconId);
        uObject?.execute("CLOSE");
    }
}


const sendCurrentActive = (id) =>{
    setActive(id);
}

const [actionActive, setActionActive] = useState(false)
useEffect(()=>{

}, [actionActive])


const handleActionPress =()=>{
    uObject?.execute("ACTION");
    setActionActive(true)
    setTimeout(()=>{
        setActionActive(false)
    },1000)
    console.log("Action Press");

}


    return (
        <Pressable disabled={true} onPress={() => console.log("Tuile Pressed")} style={{flex:1, width:'100%',height:'100%',justifyContent:'center', alignItems:'center', marginHorizontal:0,borderRadius:12,}}>
            
            <View style={{
                    flex:1,width:'100%',backgroundColor:'transparent' ,flexDirection:'row', alignItems:'center', 
                    justifyContent:'space-between', borderRadius:12,
                    }}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginLeft:5, backgroundColor:'transparent'}}>

                    <MultiPurposeWidgetLine 
                            itemId={itemId}
                            isPressable = {false}
                            icons={stateIcon} 
                            iconSize={48}
                            onPress = {handleIconPress} 
                            onLongPress = {handleIconPress}
                            iconWrapperStyle = {[{borderColor:textColor}]}
                            iconGroupWrapperStyle = {[{ alignItems:'center', justifyContent:'center', borderColor:'transparent', borderWidth:1, backgroundColor:'transparent'}]}
                            isShadow = {false}
                            />
                </View>
                <View style={{flexDirection:'column', marginLeft:5}}>
                    <Text style={{fontSize:14,fontWeight:"300", color:textColor, flexWrap:'nowrap', backgroundColor:'transparent',textAlign:'center'}}>
                        {statusMsg}
                    </Text>
                </View>

                <View style={{backgroundColor:'transparent', alignItems:'center', width:'60%',}}>
                    <Text 
                        style={{alignItems:'center', justifyContent:'center' ,backgroundColor:'transparent',marginBottom:5, marginTop:0,
                        fontSize:14, fontWeight:"400", flexWrap:'wrap', color:textColor}}
                        >
                            {gateName}
                    </Text>
                    {isToggleMode ?
                            <Pressable
                                onPress={handleActionPress}
                                style={{width:107, height:40, borderColor:'#3E495E', borderWidth:0.3, borderRadius:7,
                                    justifyContent:'center', alignItems:'center', marginBottom:8, marginTop:5,
                                    backgroundColor:actionActive?textColor:'white',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 5,
                                    },
                                    shadowOpacity: 0.34,
                                    shadowRadius: 6.27,
                                    elevation: 10,
                                }}
                                >
                                <Text style={{fontSize:16, fontWeight:'600', color:actionActive?'white':textColor}}>{t(tns+":"+"GARAGE_DOOR_ACTION")}</Text>
                            </Pressable>
                        :
                            <View>
                                <MultiPurposeWidgetLine   
                                    itemId={itemId}
                                    icons={icons} 
                                    isPressable={true}
                                    onPress = {handleIconPress} 
                                    onLongPress = {handleIconPress}
                                    active = {sendCurrentActive}
                                    iconWrapperStyle = {[styles.iconDisplay, {borderColor:textColor}]}
                                    isShadow = {true}
                                />
                            </View>
                    }
                </View>
            </View>
                
        </Pressable>
    )
}

const styles = StyleSheet.create({
    iconDisplay:{
        flexDirection:'row',
        marginRight:20,
        marginLeft:15,
        marginTop:5,
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