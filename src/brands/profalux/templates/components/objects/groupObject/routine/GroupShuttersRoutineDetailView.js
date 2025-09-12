import '_brand/templates/components/objects/common/locales'
import React, {useState, useEffect, useRef}  from 'react';
import { SafeAreaView,View,Text , StyleSheet} from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { useObject } from '_hooks/object';
import {iconsJs} from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";


export const GroupShuttersRoutineDetailView = (props) =>{
     const {itemId} = props;

     const [currentActive, setCurrentActive] = useState();
     const [stateIcon, setStateIcon] = useState([])

    const uObject = useObject(itemId);
    console.log(uObject)
    const typeName = uObject?.objectDatas?.typeName;

    const shutterLevel = uObject?.statuses?.level
    const status = uObject?.statuses?.status;
    const typeNature = uObject?.statuses?.__user_typeNature;
    const traits = uObject?.objectDatas?.traits;

    const types = uObject?.objectDatas?.componentTypes;
    const components = uObject?.objectDatas?.components;


    const { t, i18n } = useTranslation();
    const tns = "common";

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {theme} = useTheme();  
    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'

    // Deal with 368 homogeneous group icon
    let picto868;
    if(typeNature == "store"){
        picto868 = [iconsJs.store868Icon]
    } else if (typeNature == "bso"){
        picto868 = [iconsJs.bso868Icon]
    }else{picto868 = [iconsJs.vr868Icon]}

    let iconsCol1;
    let iconsCol2;


    if(!traits?.includes("Position")){
        // case: 868
       iconsCol1 =[
            iconsJs.favIcon,
       ];
   }else {
    //case: others
       iconsCol1 =[
        iconsJs.favIcon,
       iconsJs.ajarIcon,
       ];
   }
    if(!traits?.includes("Position")){
        // case :868
       iconsCol2 = [
           iconsJs.upIcon,
           iconsJs.stopIcon,
           iconsJs.downIcon,
       ];
   }else {
    //case: others
       iconsCol2 = [
           (status =='moving' && currentActive == 'up')? iconsJs.stopIcon : iconsJs.upIcon,
           iconsJs.open25perIcon,
           iconsJs.open50perIcon,
           iconsJs.open75perIcon,
           (status =='moving' && currentActive == 'down' ) ? iconsJs.stopIcon : iconsJs.downIcon,
       ];
   }
   
   // case : BSO
   const iconsCol3 = [
    iconsJs.bsoLame90degIcon,
    iconsJs.bsoLame67degIcon,
    iconsJs.bsoLame45degIcon,
    iconsJs.bsoLame22degIcon,
    iconsJs.bsoLame0degIcon,
]

   let iconDisplay;
   if (types?.length > 1){
       iconDisplay = [iconsJs.groupShuttersIcon]
   }else{
       iconDisplay= (typeNature != undefined)? picto868 : stateIcon
   }
    useEffect(()=>{
        console.log("CHECK TYPES :", types)
    },[types])

    useEffect(()=>{

    },[stateIcon])

    useEffect(()=>{
        console.log("TRAITS CHECKS Details STORE:",traits)
    },[traits])
 



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
            traits?.includes("Rotation")? setStateIcon([iconsJs.bsoCloseIcon]) : setStateIcon([iconsJs.vrCloseIcon]);
        }
        if(openRange?.includes(statusLevel)){
            traits?.includes("Rotation")? setStateIcon([iconsJs.bsoOpenIcon]) : setStateIcon([iconsJs.vrOpenIcon]);
        } 
        if(levelRange25?.includes(statusLevel)){
            traits?.includes("Rotation")? setStateIcon([iconsJs.bsoLevel25Icon]) : setStateIcon([iconsJs.vrLevel75Icon]);
        }
        if(levelRange50?.includes(statusLevel)){
            traits?.includes("Rotation")? setStateIcon([iconsJs.bsoLevel50Icon]) : setStateIcon([iconsJs.vrLevel50Icon]);
        }
        if(levelRange75?.includes(statusLevel)){
            traits?.includes("Rotation")? setStateIcon([iconsJs.bsoLevel75Icon]) : setStateIcon([iconsJs.vrLevel25Icon]);
        }
    },[traits, shutterLevel]);


    const handleOnPress = (iconId) =>{
        console.log('Pressed Action :', iconId);
    }

     return(
        <SafeAreaView style={styles.mainBody}>
            <View style={[styles.bodyWrapper,{flex:1, backgroundColor:bgcolor, borderColor:borderColor}]}>
                <View style={styles.topBody}>       
                    <MultiPurposeWidgetLine
                            icons={!traits?.includes("Position") ? picto868 : stateIcon}
                            iconSize={73}
                            isPressable={false}
                        />
                </View>

                <View style={styles.middleBody}>
                    <View>
                        <RoutineWidgetLine
                            itemId={itemId}
                            icons={iconsCol1}
                            iconSize={52}
                            onPress={handleOnPress}
                            onLongPress={handleOnPress}
                            //active={sendCurrentActive}
                            iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                            iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                            isShadow={true}
                        />
                    </View>
                    <View>

                        <RoutineWidgetLine
                            itemId={itemId}
                            icons={iconsCol2}
                            iconSize={52}
                            onPress={handleOnPress}
                            onLongPress={handleOnPress}
                            //active={sendCurrentActive}
                            iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                            iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                            isShadow={true}
                        />
                    </View>
                    {
                        traits?.includes('Rotation') &&
                        <View>               
                            <RoutineWidgetLine
                                itemId={itemId}
                                icons={iconsCol3}
                                iconSize={52}
                                onPress={handleOnPress}
                                onLongPress={handleOnPress}
                                //active={sendCurrentActive}
                                iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                isShadow={true}
                            />
                        </View>
                    }
                </View>
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    mainBody:{
        flex:1,
        borderRadius:10,
        margin:10
    },
    bodyWrapper:{
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-start',
        padding:23,
        borderWidth:2, 
        borderRadius:12,
    },
    topBody:{
        backgroundColor:'transparent',
        alignItems:'flex-start',
    },
    middleBody:{
        backgroundColor:'transparent',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        marginTop:31,
        padding:5
    },
    iconDisplay:{
        flexDirection:'column',
        margin:10,
        borderWidth:2,
        borderRadius:7,
        //backgroundColor:'white'
    },
    groupIconWrapper:{
        marginHorizontal:12.5,
        borderRadius:12,
        borderWidth:1,
       // marginBottom:100

    },
    footView:{
        marginTop:57,
        marginBottom:54,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    textStyle:{
        marginTop:2,
        fontSize:18,
    }
    

});