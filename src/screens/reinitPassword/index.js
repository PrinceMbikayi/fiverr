import { useNetInfo } from "@react-native-community/netinfo";
import ReinitPasswordComponent from '_components/forms/reinitPasswordComponent';
import { useTheme } from '_theming/themeProvider';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Api } from "_api";
import { useUser } from '_hooks/useUserHigher';
import { TextStyles } from '_styles/text';
//import { ScrollView } from 'r-eact-native-gesture-handler';


const ReinitPasswordScreen = (props) => {
    
    const { t, i18n } = useTranslation();
    const { navigation,route} = props;
    const {theme} = useTheme();
    const uUser = useUser();
    const {isLoggedIn} = uUser;
   
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
        const backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            backHandlerSubscription.remove();
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

//hmoundoyi@avidsen.com

    const submit = async (values) => {

        const destination = navigationParams.destination || "App"
        console.log("HERRRRR :", navigationParams)

        if(isLoggedIn == true){
            const reinitProcess = await Api.reinitPasswordViaAccount(values.login,values.reinitCode,values.password);
            console.log("reinitProcess",reinitProcess)
            if (reinitProcess.errCode != 200 && reinitProcess.errCode != undefined) { 
                console.log("bon erreur ",reinitProcess.errCode)
                showAlert(t("USER_CODE_ERROR_TITLE"),t("USER_CODE_ERROR_BODY","ok"))
                return null; 
            } else {
                move(destination) 
            }
        }else{
                        //move(destination) 
            console.log("ReinitPassword submit",values)  ;
            // fonctionne en dessous mais pas très lisible
            //let reinitProcess = await Api.reinitPassword(values.login,values.reinitCode,values.password).catch(error => console.log(error));

            const reinitProcess = await Api.reinitPassword(values.login,values.reinitCode,values.password);
            console.log("reinitProcess",reinitProcess)
            if (reinitProcess.errCode != 200 && reinitProcess.errCode != undefined) { 
                console.log("bon erreur ",reinitProcess.errCode)
                showAlert(t("USER_CODE_ERROR_TITLE"),t("USER_CODE_ERROR_BODY","ok"))
                return null; 
            } else {
                move(destination) 
            }
        
            //continue
            console.log("reinitProcess completé",reinitProcess)
        }


        
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