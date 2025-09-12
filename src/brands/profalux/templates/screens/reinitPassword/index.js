import React,{ useState,useRef, useEffect } from 'react';
import {ScrollView, View,Text,StyleSheet,KeyboardAvoidingView, BackHandler,Alert } from 'react-native';
import {useNetInfo} from "@react-native-community/netinfo";
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import ReinitPasswordComponent from '_components/forms/reinitPasswordComponent';

import {TextStyles} from '_styles/text';
import {Api} from "_api";


const ReinitPasswordScreen = (props) => {
    
    const { t, i18n } = useTranslation();
    const { navigation,route} = props;
    const {theme} = useTheme();
   
    const netInfo = useNetInfo();
    const [pageIndex,setPageIndex] = useState(0);
  
    // create our ref
    const myViewPager = useRef();    

    
    const navigationParams = route?.params || {}; 
    

    const {login :loginForRequest} = navigationParams;
    console.log("loginForRequest",loginForRequest)
    

     /**
     * Handle Android Back Button in this screen
     * 
     */

    useEffect(() =>{
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            console.log("je suis retiré")
        };
      }, []);


      const move = (destination,params={}) => {   

        if(netInfo.isConnected || 1 == 1) {            
            props.navigation.navigate(destination,params)
        } else {           
            Toast.show(t("INTERNET_NOT_AVAILABLE"));
        }
       
    }



    const handleBackPress =  () => {  
        console.log("handleBackPress")
        goBack()
        
        return true; // intercept event    
    }

    const goBack = () => {
       
        const prev = pageIndex-1;
        console.log(pageIndex,prev)
        if(prev < 0) {
            props.navigation.goBack();
        } else {
            console.log("ben retourne à zero")
            setPageIndex(prev);
            console.log("pageIndex",pageIndex)
            myViewPager.current.setPage(prev);
        }
        
    }



    const submit = async (values) => {

        console.log("ReinitPassword submit",values)  ;
        const reinitProcess = await Api.reinitPassword(values.login,values.reinitCode,values.password).catch(error => console.log(error));
        console.log("reinitProcess",reinitProcess)
        if (reinitProcess.errCode != 200 && reinitProcess.errCode != undefined) { 
            console.log("bon erreur ",reinitProcess.errCode)
            showAlert(t("USER_CODE_ERROR_TITLE"),t("USER_CODE_ERROR_BODY","ok"))
            return null; 
        } else {
            move('App') 
        }
      
        //continue
        console.log("reinitProcess completé",reinitProcess)
        
    }

    const showAlert= (title,body,label,callback) => {
  
        const alertTitle = title.toUpperCase();//this.props.t("DELETE_OBJECT_ALERT_TITLE").toUpperCase();
        const alertBody = body //this.props.t("DELETE_OBJECT_ALERT_BODY");
        const buttonLabel = label
       
    
    
        Alert.alert(
          alertTitle,
          alertBody,
          [        
            {
              text: buttonLabel,
              onPress: () => {console.log("ok")},
              style: 'cancel'
            }
          ]
        );
      }


      

    return (       
                <ScrollView>
                     <KeyboardAvoidingView  style={{flex:1}} behavior="position" >         
                    <View style={[styles.insideBlock,]}>
                        <Text style={[TextStyles.authTitles,{marginTop:10,paddingLeft:10,color:theme.primaryColor}]}>{t('APP_NAME')}</Text>
                        <Text style={[TextStyles.authSubtitles,{paddingLeft:10,color:theme.textColor}]}>{t('REINIT_PASSWORD_SCREEN_TITLE')}</Text>              
                    </View>                
                    <View style={{backgroundColor:'transparent'}}>  
                        <Text style={{padding:20,fontSize:16}}>{t("REINIT_PASSWORD_INSTRUCTION")}</Text>          
                        <ReinitPasswordComponent goBack={goBack} submit={submit} login={loginForRequest}/>                
                    </View>
                    </KeyboardAvoidingView>
                </ScrollView>
         );
}


export default ReinitPasswordScreen;

const styles = StyleSheet.create({
    insideBlock: {
      margin:10
     
    },
    viewPager : {
        flex:1
    }
  });