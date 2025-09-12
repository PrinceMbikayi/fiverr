import React,{useRef,useState,useEffect} from 'react';
import { View,Text,TextInput,Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from '../../ui/Button';
import InputWrapper from '_brand/templates/components/forms/inputWrapper'
import {useGlobalModal} from '_components/ui/globalModal';





const EditContent = (props) => {

    const { t, i18n } = useTranslation();
    const globalModal = useGlobalModal();
    const {value,placeholder = "placeholder not defined",onValidate,onCancel,onDoFocus} = props
   
        const [myPaddingTop, setMyPaddingTop] = useState(0);
        const [newText, setNewText] = useState(props.value);
        const inputRef = useRef();
        const inputValueRef = useRef("");
        useEffect(()=> {
            //doFocus();
            inputValueRef.current = value
        },[])
        
        useEffect(()=> {
            if(onDoFocus || 1 == 2)doFocus();
        },[onDoFocus])
        const onTextChange =(e) => {

        }

        const onSubmitEditing = () => {
            globalModal.close()
        } 
        const isFocused = true
      
        const doFocus = () => {
            setTimeout(() => {
             //secondTextInput.current.blur();
            inputRef.current.focus();
         },0)
        }

        const [refresh, setRefresh] = useState(Date.now());
       

        const onChangeMe = (newVal) => {
           inputValueRef.current = newVal
           setRefresh(Date.now());
           setMyPaddingTop(myPaddingTop+1)
           const DEVICE_HEIGHT = Dimensions.get('screen').height;        
            const WINDOW_HEIGHT = Dimensions.get('window').height;
        }

        const onLayout = (event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
        }

        const doCancel = () => {
            if(onCancel)onCancel();
        }

        const doValidate = () => {
            if(onValidate)onValidate(inputValueRef.current);
        }


        return (
           
                <>
                <InputWrapper  placeholder={placeholder} borderColor="red" {...{isFocused,value}}>                
                        <TextInput   ref={inputRef}  style={{backgroundColor:'transparent',textAlign:'left',width:'100%',paddingLeft:16,paddingRight:16}} value={inputValueRef.current}   onChangeText={onChangeMe} onSubmitEditing={onSubmitEditing}/>
                    </InputWrapper>                    
                    <View style={{width:'100%',flexDirection:'row',backgroundColor:'transparent',paddingLeft:50}}>
                        <View style={{flex:1,paddingRight:10}}><Button title={t("CANCEL")} altStyle noBorder onPress={doCancel}/></View>
                        <View style={{flex:1,paddingLeft:10}}><Button title={t("SAVE")} altStyle onPress={doValidate}/></View>                        
                    </View>
                    </>
              
          
           
        )
    
}


export default EditContent;

/*
<Pressable onPress={onEdit} >
<InputText {...props}/>
</Pressable>
*/