import React, { useState,useCallback,useRef } from 'react';
import { Text, TextInput, View, useEffect, StyleSheet,ScrollView ,SafeAreaView} from 'react-native';
import { useSelector,useDispatch} from "react-redux";
import { useTranslation } from 'react-i18next';
import { useTheme} from '_theming/themeProvider';
import styled from 'styled-components/native';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';


import FormInput from '_components/forms/formInput';
import {ButtonInList} from '_components/ui/buttons/buttonInList';
import {HeaderWithBack} from '_components/headers/header-with-back'
import Toast from 'react-native-root-toast';


import { getObjectsByNames,getObjectById } from '_helpers/selectors';

export const GroupHomeScreen = (props) => {
    const {  navigation} = props;
    
    const { t, i18n } = useTranslation();
    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    const specialColor = theme['add_product_list_name_color'] || theme["onBody"];

    const _groupNameInputRef = useRef("abcd");
   
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {id : groupId = -1,name : groupName = ""} = navigationParams;    
    console.log("Harold What in Navigation PARAMS :", route);
    const objectsNames = useSelector(getObjectsByNames);
    console.log("Harold oBject BY NAMES :", objectsNames);
    const [_newGroupName,setNewGroupName] = useState("");

    let myGroup = {};

    if(groupId != -1) {
        myGroup = useSelector(state => getObjectById(state,groupId)) ;//    state => state.objects.entities.objects[groupId]); 
    }
   
    const title = (groupId == -1) ? t('NEW_GROUP') : myGroup.name;
  
   
     const nameMinLength = 4;

     // Verify Group name rules and display corresponding err message 
    const checkGroupName = () => {        
      console.log(" CURRENT :",_groupNameInputRef.current )
        const name = (_groupNameInputRef.current.value != undefined) ? _groupNameInputRef.current.value : "";

        if(name == "") {
          return  t("addProduct:GROUP_NAME_EMPTY");
        }
        if(name.length < nameMinLength) {
            return t("addProduct:GROUP_NAME_TOO_SHORT",{'min':nameMinLength})
        }
        if(objectsNames[name] != undefined) {
            return t("addProduct:OBJECT_HAS_SAME_NAME",{'name':name})
        }        
        return false
    }


// Callback triggered when the group name input form is submitted
    const memoizedCallback = useCallback(
        () => {
            goTypeSelection();
        },
        [_newGroupName],
      );

    // After submit, we go to select the type of 
    const goTypeSelection = () => {   
        const err =  checkGroupName();
        console.log("GO TYPE SELECTION ERR :", err);
        if(err) {
            Toast.show(err,{position:Toast.positions.CENTER});
        }
        if(!err) {
            const groupName = _groupNameInputRef.current?.value;
            navigation.navigate('GroupSelectType',{'groupName':groupName});  
        }       
     }



    // use var instead of state in order to avoid reRender
     //const [newGroupName, setNewGroupName] = useState("");
    

    const onInputChangeHandler = (inputVal) => {         
         setNewGroupName(inputVal);       
     }
    const inputColor = textColor;
   
    const regarde = (val)=>{
        console.log("VAL : ",val, _groupNameInputRef, "xxx")
        _groupNameInputRef.current.value = val;

    }

//txt => _groupNameInput.current.value = txt
    return (
        <SafeAreaView style={{flex:1,backgroundColor:theme['color--bg']}}>
            <HeaderWithBack title={title} nobackDoClose themeDependency/>           
            <ScrollView style={{padding:15,paddingTop:0}}>             
                {/*<StyledFormInput placeholder={t('NEW_GROUP_NAME')} onChangeText={onInputChangeHandler} color={inputColor}/>   */}  
                {/* <StyledFormInput placeholder={t('NEW_GROUP_NAME')} ref={_groupNameInputRef}  onChangeText={regarde} noonChangeText={onInputChangeHandler} color={inputColor}/>           */}

                <TextInput ref={_groupNameInputRef} onChangeText={regarde} />
                <ButtonInListWrapper>
                    <ButtonInList title={t('GROUP_ADD_PRODUCT',{count:0})} callback={memoizedCallback} color={inputColor}/>
                </ButtonInListWrapper>             
            </ScrollView>           
        </SafeAreaView>  
       
    );
}

/**************  STYLED  ************************/
const StyledFormInput = styled(FormInput)`
    color:${props => props.color || "white" };             
`;

const ButtonInListWrapper = styled.View`
  
    border-top-width:1px;
    border-top-color:transparent;

    border-bottom-width:1px;
    border-bottom-color:transparent;
   
    padding:10px 0 2px;
    margin:10px 0;    
`;