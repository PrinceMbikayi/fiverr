import '_brand/templates/components/objects/common/locales'
import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import {useState,useEffect,useRef} from 'react';
import { useStore,useSelector,useDispatch } from 'react-redux';


import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';

import { useObject } from '_hooks/object';

import {iconsJs} from '_brand/utils/iconsJs';
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';
import { LightPlugWidget } from '_brand/templates/components/objects/light/components/LightPlugWidget';

import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import ResetButton from '_brand/images/icons/app/profaluxIconJs/ResetButton'
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { GraphDataForChartKit } from '_brand/utils/GraphDataForChartKit';
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'



export const PlugLevel2Details = (props) =>{

    const {itemId, setKebab, traits} = props;
    
    const uObject = useObject(itemId);

    console.log('UOBJECT :', uObject);

    const globalModal = useGlobalModal();  
    const dispatch = useDispatch();
    const {theme} = useTheme();  
    const { t, i18n } = useTranslation(); 
    const tns = "common";
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};

    const gloIsConnected = useSelector(state=> state?.network?.isConnected);
    const gloServerIsDown = useSelector(state=> state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);
    const connected = uObject?.objectDatas?.connected;
    const statuses = uObject?.statuses
    const instantWatt = statuses?.watts
    const wattCount = statuses?.watts_count;
    const wattUnit = "W"

    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const iconthemeColor = theme?.prflxIconColor||'white';
    const iconthemebgColor = 'white';


    const uScenario = useScenario();
    const { isRoutine, actionsByItemId } = uScenario;

    useEffect(()=> {
        console.log("USE SCENARIO:",actionsByItemId)
    },[actionsByItemId]);

    useEffect(() => {

        if(setKebab){
            setKebab(options)
        }
    },[]);

    const options = [
        {
            id:"modify",
            title:`${t(tns+":"+"KEBAB_MODIFY")}`,
            iconJSName: iconsJs.modifyIcon.name,
            action:()=>kebabUpdateAction()
        },
        {
            id:'delete',
            title:`${t(tns+":"+"KEBAB_DELETE")}`,
            iconJSName: iconsJs.deleteIcon.name,
            action:()=>kebabDeleteAction()
        },
    ]

    //////////////////////////
    const actionSheetRef = useRef(null);
    const kebabDeleteAction = ()=>{
        //actionSheetRef.current?.present()
        onOpenSelect()
    }

////////////////////////

const kebabUpdateAction = ()=>{
    // variable "itemPicked" below, is what the GroupModifyScreen needs to be transfered via route params
    const typeName = uObject?.objectDatas?.typeName;
    (typeName === 'composite')  ? 
                                    navigation.navigate('GroupModifyScreen', {itemPicked:itemId})
                                :
                                    navigation.navigate('ProductSettings',{'typeName':typeName,itemId:itemId});
}


const onCancelPressed = () => {
        console.log('CANCEL_DELETE :');
        globalModal.close();
    }

    const onOpenSelect = () => {  
        const content = (
        <View style={{width:'100%', height: 200}}>
            <CommonBottomSheetDeleteContent 
                nameToDelete={`${t(tns+":"+"THIS_PLUG")}`} 
                warningText={`${t(tns+":"+"WARNING_DELETE")}`}
                textColor={textColor} 
                onDelete={handleDelete} 
                onCancel={onCancelPressed} 
            />
        </View>
            )
        globalModal.setContent(content,{type:'bottom'});    
        globalModal.toggle();
    }

const handleCancel = ()=>{
    console.log('Delete canceled');
    actionSheetRef.current?.dismiss();
}


const handleDelete = async()=>{
    // alert("Really wanna delete?")
    globalModal.close();
    console.log("Deleted itemId :", itemId)
     const res = await deleteObject(itemId).catch((err) => { console.log(err) });
     if (res.errCode == 200) {     
        Toast.show(
            `${t(tns+":"+"TOAST_DELETE")}`,
            { 
                backgroundColor: 'black', 
                textColor: 'white', 
                textStyle:{fontSize:16, fontWeight:'600'},
                containerStyle:{width:'80%', height:100, justifyContent:'center', alignItems:'center', borderRadius:10, borderColor:borderColor, borderWidth:2}, 
                //position: Toast.positions.CENTER,
                position:-350,
                duration:3000,  
                //onHide:()=>navigation.goBack()
            }
        );
        navigation.goBack();   
        const action = Actions?.objectDelete(itemId);    
        dispatch(action)
     }
     //console.log('item deleted ', itemId);
     //actionSheetRef.current?.dismiss();
 }


 const handleResetCount = ()=>{
    console.log('RESET_COUNT_PRESSED :');
 }

 
    return(
        <View style={[{padding:10, borderRadius:12,borderWidth:1,flex:1, justifyContent:'center', alignItems:'flex-start', backgroundColor:bgcolor, borderColor:borderColor, marginHorizontal:5, marginTop:20}]}>
           
              
            {!connected && 
             <Text style={{textAlign:"center",backgroundColor:"transparent",width:"100%"}}>{t("OBJECT_DISCONNECTED")}</Text>
            }
                <View style={{flex:1, marginTop:20, backgroundColor:'transparent'}}>
                    {!connected && 
                            <View style={[
                            
                            {backgroundColor:(connected == false || !netInfoIsConnected)? "red" || theme['card--color--deactivated-overlay'] : 'transparent', 
                            borderColor:'white',
                            backgroundColor:'grey',
                            borderWidth:2,
                            zIndex:12,
                            position:"absolute",
                            opacity:0.4,
                            width:"100%",height:"100%",
                            marginTop:-20,
                            marginBottom:-20,
                            borderRadius:8,
                            paddingVertical:60
                        }]}/>
                    }
                    <LightPlugWidget 
                        itemId = {itemId} 
                        iconSize = {52} 
                        isPlug 
                        isRoutine={isRoutine}
                        switchScale = {1.4}
                        textSize = {18}
                        textWeight = {'600'}
                        pictoSwitchDistance={90}
                    />
                </View>
               
                <View style={{marginTop:40, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:14,color:textColor, fontWeight:'400', marginRight:30}}>{t(tns+":"+"INSTANT_WATT")} : </Text>
                    <Text style={{fontSize:20,color:textColor, fontWeight:'600',  marginRight:30}} >{instantWatt}</Text>
                    <Text style={{fontSize:14,color:textColor, fontWeight:'600'}}>{wattUnit}</Text>
                </View>

                <View style={{marginTop:20, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <View style={{justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                        <Text style={{fontSize:14,color:textColor, fontWeight:'400', marginRight:30}}>{t(tns+":"+"SUM_WATT")} : </Text>
                        <Text style={{fontSize:20,color:textColor, fontWeight:'600',  marginRight:30}} >{wattCount}</Text>
                        <Text style={{fontSize:14,color:textColor, fontWeight:'600'}}>{wattUnit}</Text>
                    </View>
                    {/* <View style={{marginLeft:50}}>
                        <TouchableOpacity style={{width:80, height:33}}>
                            <ResetButton color={textColor}/>
                        </TouchableOpacity>
                    </View> */}
                </View>

                <View style={{flex: 1, marginTop:40, backgroundColor:'transparent'}}>
                        <GraphDataForChartKit itemId={itemId} rangeType="day" onSelect={(feature) => console.log(" Feature Selected :", feature)} />
                </View>
                
                {/* <BottomDeleteSheet 
                    myRef= {actionSheetRef}
                    handleCancel={handleCancel}
                    handleDelete = {handleDelete}
                />  */}
        </View>
    )
}

const styles = StyleSheet.create({
    bodyWrapper:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-start',
        padding:20,
        borderWidth:1, 
        borderRadius:12,
        //height:150
    },
    bodyStyle:{
        backgroundColor:'transparent',
        flex:1,flexDirection:'column',
        alignItems:'flex-start', 
        justifyContent:'flex-start',
    }
})


//flex:1,maxWidth:'90%', justifyContent:'space-around', alignItems:'center', backgroundColor:'lightgreen'