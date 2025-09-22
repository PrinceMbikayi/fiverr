import UpdatePasswordComponent from '_components/forms/updatePasswordComponent';
import { useTheme } from '_theming/themeProvider';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';


import { Api } from "_api";
import { TextStyles } from '_styles/text';
//import { ScrollView } from 'r-eact-native-gesture-handler';
import { HeaderWithBack } from '_components/headers/header-with-back';


const UpdatePasswordScreen = (props) => {
    

    console.log("UpdatePasswordScreen props",props)


    const { t, i18n } = useTranslation();
    const { navigation,route} = props;
    const {theme} = useTheme(); 

    const [pageIndex,setPageIndex] = useState(0);
    const userId = useSelector(state => state.user.login);
   
   
    const [processStep,setProcessStep] = useState("start");
  
  
    // create our ref
    const myViewPager = useRef();
    const {loginForRequest} = route?.params || {}; //v5

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
      }, [pageIndex]);


     



    const handleBackPress =  () => {  
        console.log("handleBackPress")
        goBack()
        
        return true; // intercept event    
    }

    const goBack = () => {
        console.log("Bon et bien retour");
        const prev = pageIndex-1;
        console.log(pageIndex,prev)
        props.navigation.goBack();
        /*
        if(prev < 0) {
            props.navigation.goBack();
        } else {
            //console.log("ben retourne à zero")
            setPageIndex(prev);
            //console.log("pageIndex",pageIndex)
            //myViewPager.current.setPage(prev);
        }
        */
    }



    const submit = async (values) => {

        console.log("Update Password submit",values);       
        console.log("userId",userId);
       
        
        const updateProcess = await Api.updatePassword(userId,values.password);
        console.log("updateProcess",updateProcess)
        if (updateProcess.errCode != 200 && updateProcess.errCode != undefined) { 
            console.log("bon erreur ",updateProcess.errCode)
            showAlert(t("USER_CODE_ERROR_TITLE"),t("USER_CODE_ERROR_BODY","ok"))
            return null; 
        } else {
            setProcessStep("done");
        }
        
        //continue
        console.log("Update Password completé")
        
    }

    const showAlert= (title,body,label,callback) => {
  
        const alertTitle = title.toUpperCase();
        const alertBody = body;
        const buttonLabel = label;
        Alert.alert(alertTitle, alertBody, [ { text: buttonLabel, onPress: () => {console.log("ok")}, style: 'cancel' }]);
      }


    const title = t("MENU_SETTINGS");
    const bodyTextColor = theme["card--color--text"] || theme["onBody"];
    const bgColor =  theme['card--color--bodybg']
    const textColor = theme.onBody;

    const headerBackgroundColor = theme["card--color--headerbg"]; 
    const headerTextColor = theme["card--color--text"];  


    return (       
             <SafeAreaView style={{flex:1,backgroundColor:theme['color--bg']}}> 
                <View style={{minHeight:84,alignItems:'center',justifyContent:'center'}}>
                    <HeaderWithBack title={title} themeDependency bgColor={bgColor} color={headerTextColor}/>
                </View>
                <ScrollView alwaysBounceVertical={false}>
                     <KeyboardAvoidingView  style={{flex:1}} behavior="position" >         
                    <View style={[styles.insideBlock,]}>
                        <Text style={[TextStyles.authTitles,{marginTop:10,paddingLeft:10,color:bodyTextColor}]}>{t('APP_NAME')}</Text>
                        <Text style={[TextStyles.authSubtitles,{paddingLeft:10,color:bodyTextColor}]}>{t('UPDATE_PASSWORD_SCREEN_TITLE')}</Text>              
                    </View> 
                    <View style={[styles.insideBlock,{marginBottom:10,marginTop:10}]}>
                        <Text style={[{paddingLeft:10,color:bodyTextColor}]}>{userId}</Text>
                    </View>  
                   
                    <View style={{backgroundColor:'transparent',...(processStep == "done") ? { opacity: 0,height:1 } : {}}}> 
                        <UpdatePasswordComponent goBack={goBack} submit={submit} login={loginForRequest}/>                
                    </View>
                    {processStep == "done" &&
                         <View style={[styles.insideBlock,]}>
                            <Text style={[{paddingLeft:10,color:theme.textSuccess}]}>{t("UPDATE_PASSWORD_DONE")}</Text>
                        </View>
                    }
                    </KeyboardAvoidingView>
                </ScrollView>
               </SafeAreaView>
         );
}


export default UpdatePasswordScreen;

const styles = StyleSheet.create({
    insideBlock: {
      margin:10
     
    },
    viewPager : {
        flex:1
    }
  });