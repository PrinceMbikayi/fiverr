import '_brand/templates/components/objects/common/locales'
import React from 'react';
import { View, StyleSheet} from 'react-native';
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

import { CommonHomogeneousLightPlugWidget } from '_brand/templates/components/objects/groupObject/widget/components/CommonHomogeneousLightPlugWidget';
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'




export const HomgeneousPlugGroupDetail = (props) =>{

    const {itemId, setKebab, traits} = props;
    
    const uObject = useObject(itemId);

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

    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'

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
              nameToDelete={`${t(tns+":"+"THIS_GROUP")}`} 
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

    return(
        <View style={[styles.bodyWrapper,{backgroundColor:bgcolor, borderColor:borderColor, margin:20}]}>
            <View style={[
                styles.bodyWrapper,
                {backgroundColor:(connected == false || !netInfoIsConnected)? theme['card--color--deactivated-overlay'] : 'transparent', 
                borderColor:'transparent',
                zIndex:(connected == false || !netInfoIsConnected)? 1: 0,
                position:'absolute',
                opacity:0.6,
                width:'100%',height:'100%',
            }]}/>
            <View style={{justifyContent:'center', alignItems:'flex-start',paddingVertical:20, paddingHorizontal:10}}>
                <CommonHomogeneousLightPlugWidget 
                                itemId = {itemId} 
                                iconSize = {40} 
                                titlePaddingBottom ={20} 
                                titleFontWeight = {'600'}
                                titleFontSize = {18}
                                isPlug
                            />
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
        justifyContent:'flex-start',
        borderWidth:1, 
        borderRadius:12,
    },
    bodyStyle:{
        backgroundColor:'transparent',
        flex:1,flexDirection:'column',
        alignItems:'flex-start', 
        justifyContent:'flex-start',
    }
})