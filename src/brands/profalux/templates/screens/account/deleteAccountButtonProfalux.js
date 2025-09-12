import './locales';
//import './_locales'
//------- then FC -------------------------
import React, {useContext,useEffect,useState,useRef,useCallback,useMemo} from 'react';
import { Text,View,Image,ScrollView,SafeAreaView,Pressable,TextInput} from 'react-native'; // use in styled components


import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import styled, { css } from 'styled-components/native';
//-----------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import Button from '_brand/templates/components/ui/Button';
import ModalContainer from '_brand/templates/components/ui/modal/modalContainer'
import {useGlobalModal} from '_components/ui/globalModal';

//import Danger from '_brand/images/icons/app/Danger';

import {H1, P, VSeparator} from '_brand/templates/styled';
//---- hooks -----

//import InputWrapper from '_brand/templates/components/forms/inputWrapper'
//====================================================================
import { useUser } from '_hooks/useUserHigher';

import { useSelector, useDispatch } from "react-redux";
import { getUser } from '_helpers/selectors';
import {getUserCredentials,setUserCredentials,deleteSessionId,deleteUserCredentials} from '_services/storage';
import websocketManager from '_services/webSocketManager';
import {sleep} from '_brand/utils/tools';


// doing api call directly here
import * as Dain from '_api/dain';





const DeleteAccountButton = () => {
   
    const inputRef = useRef()
    const tns = "account";    
    const { t, i18n } = useTranslation();
    const { theme,changeTheme,themeID,baseColors} = useTheme();
   
  
   const navigation = useNavigation();
   const route = useRoute();
   const navParams = route?.params || {};  

  // const email = "glop@gloppasglop.com"

   const uUser = useUser();
   const {askDeleteCode, deleteUserAccount} = uUser
   /*
   console.log(uUser)
    const {email} = uUser;
    console.log("uUser ==>",JSON.stringify(uUser))
    */
    const userDetails = useSelector(state => getUser(state));

    const {login : email} = userDetails;
  

    //---------------------------------------
    const globalModal = useGlobalModal();
    const {bgColor,headerBackgroundColor,headerTextColor} = baseColors;
    const textColor = 'black' || 'white' || baseColors.textColor;


    // ========== object delete ====================
   

    const deleteObject = () => {
        showConfirm();
        
    }
    
    const handleAskDeleteCode = async()=>{

        const dainResponse = await askDeleteCode();
        if (dainResponse.errCode == 200) {
            showDeleteForm();
       
         }
    }



    const deleteConfirmed = async() => {
       //globalModal.close();
       showDeleteForm()
       return true;
        const result = await uUser.deleteUserAccount();
       console.log("deleteConfirmed result",JSON.stringify(result));
       if(result) {
         navigation.navigate('Auth',{ screen: 'Access' });  
        }

        // in order to activate the "with code method" comment above and uncomment below
        //showDeleteForm();
        // 
     
      
    }





    const [isFocused, setIsFocused] = useState(false);
    useEffect(()=> {
        
    },[isFocused]);


    const onChangeText = (text) => {
      
            if(inputRef.current) {
              inputRef.current.value = text;
            }
    }
    
    const onDeleteCancel = () => {
        globalModal.close();
    }  



    const showDeleteForm = () => {
        const iconSize = {width:54,height:54};
        const iconStyle = {marginBottom:8};
        const iconDisplay = {...iconSize,...iconStyle};
        console.log('inputRef',inputRef.current)
       const rest = {   rest:{  inputColor:"red",
                                backgroundColor:"white",
                              
                    
                    }}
        
     
    

        const content = <ModalContainer    buttons={popupButtonsStep2}  
                                           
                        ><View>
                            <View style={{alignItems:"center"}}> 
                                {/*}
                                <Danger color={theme.critical_medium} {...iconDisplay} />    
                                <Text style={{color:theme?.critical_medium,fontWeight:"bold",fontSize:16}}>{t(tns+":"+"DELETE_ACCOUNT_WARNING")}</Text>
                                */}
                            </View>
                            <H1>{t(tns+":"+"DELETE_ACCOUNT_CODE_TITLE")}</H1>
                            <VSeparator height={6}/>
                            <P>{t(tns+":"+"DELETE_ACCOUNT_CODE_DESCRIPTION",{email:email})}</P>
                            <VSeparator height={18}/>
                                <StyledWrapper>
                                     <TextInput 
                                        ref={inputRef} 
                                        placeholder={t(tns+":"+"DELETE_ACCOUNT_CODE_PLACEHOLDER")} 
                                        onChangeText={onChangeText} 
                                        placeholderTextColor={"#CCC"} 
                                        autoCapitalize = {"characters"}/>
                                </StyledWrapper>
                              
                              
                            </View>  
                        </ModalContainer> 
        globalModal.setContent(content,{type:'centered'});    
    }

    const onDeleteLastConfirmRegular = async () => {
        /*
        console.log(inputRef.current.value)
        console.log("================= delete in DeleteàccountButton ========")
        const result = await uUser.deleteUserAccount({userCode:inputRef.current.value})
        console.log("================= delete done in DeleteàccountButton ========")
        console.log("result",result)
        globalModal.close();
        console.log("================= reuslt above ========")
        if(result.errCode == 200) {

            navigation.navigate('Auth',{ screen: 'Access' });  
        }
        */
    }

    const onDeleteLastConfirm = async() => {


        const params = {'action':'destroy','userCode' : inputRef.current.value};
        websocketManager.killSocket();
        await sleep(1000);
        const dainResponse = await Dain.post('setup', params);
        console.log("onDeleteLastConfirm dainResponse =>",JSON.stringify(dainResponse))
        
        if (dainResponse.errCode == 200) {
            await deleteUserCredentials();
            await deleteSessionId();
            globalModal.close();
            navigation.navigate('Auth',{ screen: 'Access' });  
       
         } else {
            if(dainResponse?.errCode == 400 && dainResponse?.errMsg== "invalid_otp") {
                showCodeError();
            }
         }      

    }
    



    

 


    //------------------------------
  
    const popupButtons = [
                   
                    {label:t(tns+":"+"DELETE"),callback:handleAskDeleteCode,altStyle:false,noBorder:true,bgColor:theme.critical_medium,titleColor:"white"},
                    {label:t("CANCEL"),callback:onDeleteCancel,altStyle:true,noBorder:true}
                ];    

    const popupButtonsStep2 = [
        
        {label:t(tns+":"+"DELETE"),callback:onDeleteLastConfirm,altStyle:false,noBorder:true,bgColor:theme.critical_medium,titleColor:"white"},
        {label:t("CANCEL"),callback:onDeleteCancel,altStyle:true,noBorder:true}
    ]; 
    const showConfirm = () => {
        const iconSize = {width:54,height:54};
        const iconStyle = {marginBottom:8};
        const iconDisplay = {...iconSize,...iconStyle};

        const content = <ModalContainer    
                            title = {t(tns+":"+"DELETE_ACCOUNT_CONFIRM_TITLE")}  
                            description = {t(tns+":"+"DELETE_ACCOUNT_CONFIRM_BODY")}                        
                            buttons={popupButtons}                       
                        ><View style={{alignItems:"center",paddingBottom:32}}>                                
                               {/*} <Danger color={theme.critical_medium} {...iconDisplay} />    */}                         
                                <Text style={{color:theme?.critical_medium,fontWeight:"bold",fontSize:16}}>{t(tns+":"+"DELETE_ACCOUNT_WARNING")}</Text>
                            </View>  
                            
                        </ModalContainer> 
        globalModal.setContent(content,{type:'centered'});    
        globalModal.open();
    }


    const popupButtonsStepErrorCode = [
        
        {label:t(tns+":"+"DELETE_ACCOUNT_SEND_NEW_CODE"),callback:showConfirm,altStyle:false,noBorder:true,bgColor:theme.critical_medium,titleColor:"white"},
        {label:t("CANCEL"),callback:onDeleteCancel,altStyle:true,noBorder:true}
    ]; 

    const showCodeError = () => {
        const iconSize = {width:54,height:54};
        const iconStyle = {marginBottom:8};
        const iconDisplay = {...iconSize,...iconStyle};
        console.log('inputRef',inputRef.current)
       const rest = {   rest:{  inputColor:"red",
                                backgroundColor:"white",
                              
                    
                    }}
        const content = <ModalContainer    buttons={popupButtonsStepErrorCode}  
                        ><View>
                            <View style={{alignItems:"center"}}> 
                                {/*}
                                <Danger color={theme.critical_medium} {...iconDisplay} />    
                                <Text style={{color:theme?.critical_medium,fontWeight:"bold",fontSize:16}}>{t(tns+":"+"DELETE_ACCOUNT_WARNING")}</Text>
                                */}
                            </View>
                            <H1>{t(tns+":"+"DELETE_ACCOUNT_CODE_ERROR")}</H1>
                            <VSeparator height={6}/>
                            <P></P>
                            <VSeparator height={18}/>
                            </View>  
                        </ModalContainer> 
        globalModal.setContent(content,{type:'centered'});    
    }






    useEffect(() => {
       
      
        // WILL UNMOUNT
        return () => {
            console.log("Parameters unmounted !!!");
            return (
               a = false
            )
        }
      }, []);

    return (
            
                <Button title={t(tns+":"+"DELETE_ACCOUNT_BUTTON")} onPress={deleteObject}  titleColor={"white"} bgColor="#3E495E"/>  
              
        )
}

export default DeleteAccountButton

const StyledWrapper = styled.View`
    border-color: #C3C3C3;
    border-radius:12px;
    border-width:1px;
    padding:6px;
`;