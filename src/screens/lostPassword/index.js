import React from 'react';
import {useState,useEffect} from 'react';

import { View,KeyboardAvoidingView,Text,StyleSheet,ImageBackground,Image,
        ScrollView,Alert,TextInput,
        TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import { useDispatch,useSelector } from 'react-redux';

import {Input} from 'react-native-elements';

import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import {useNetInfo} from "@react-native-community/netinfo";
import Toast from 'react-native-root-toast';

import {TextStyles} from '_styles/text';
import styled from 'styled-components/native';

import LoginComponent from "_components/forms/loginComponent"

import {Api} from "_api";
import {multiServers} from '_config/AppConfig';
import {setServer as storeServer,setIsTester as storeIsTester} from '_services/storage'
import { APP_PREVIOUS_ROUTE } from '_actions/app';
import {userSetIsTester} from '_actions/user';
import { useUser } from '_hooks/useUserHigher';



import ServerSelector from '_components/ui/serverSelector';

//--- brand ----
import brandAppTexts from '_brand/texts/app.json';
//--- Templates ---
import LostPasswordTemplate from '_brand/templates/screens/lostPassword';


//--- Appium -----
import {buildTestId} from '_helpers/appium';


/*,{backgroundColor:theme.accessBackgroundColor}*/


// ================ SCREEN COMPONENT START HERE ========================
const LostPasswordScreen = (props) => {
    const { t, i18n } = useTranslation();
    const { navigation, route} = props;
    const navigationParams = route?.params || {}; 

    const uUser = useUser();
    const {isLoggedIn} = uUser;

    const {theme} = useTheme();
    const netInfo = useNetInfo();
    const [countTap,setCountTap] = useState(0)

    const userInfos = useSelector(state => state.user);
    const dispatch = useDispatch(); 

    const [step, setStep] = useState("begin");
    const [login, setLogin] = useState('');

    //--------------------------
    const move = (destination,params={}) => {   
        if(netInfo.isConnected) {            
            props.navigation.navigate(destination,params)
            console.log("INSIDE_MOVE :", navigation)
        } else {           
            Toast.show(t("INTERNET_NOT_AVAILABLE"));
        }       
    }

    const goBack = () => {      
      props.navigation.goBack();
    }
    //----------------------------
    const cleanLogin = (value) => {
      return value.trim();
      //return value.toLowerCase().trim();
    }

    
    const submit = async (values) => {

     
      const login = values.login.toLowerCase().trim();
      setLogin(login);
      const dcms = await checkMultiServer();
      console.log(dcms)
      console.log("lostPasswordSubmit",values);

      const res = await  Api.recoverPassword(login);
      console.log("in lost password screen ",res)
      //move('ReinitPassword',{login:cleanLogin(values.login)})

      //console.log("registerProcess",registerProcess);
     
      
      
      if(res.errCode != 200){
          // gestion de l'erreur
          console.log("register error");
          let msg ="\n";
          switch(registerProcess.errMsg) {
              case "login_exists" :
                  msg+=t("SUBSCRIBRE_ERROR_LOGIN_EXIST")+"\n";
     
                  break;
              default : 
                  msg+=t("SUBSCRIBRE_ERROR_DEFAULT")+"\n";
          }
          Toast.show(msg);
      } else {   
          //setPageIndex(1); 
          console.log('ok man')
          setStep("waiting")
          //setUserId(login);
          //setUserPassword(password);
         // myViewPager.current.setPage(1);
      }
        
  }
    
    
    
    
    
    const submit2 = async (values) => {
      
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",values)

        const dcms = await checkMultiServer();
        try {
          const login = cleanLogin(values.login);
          const password = values.password.trim();
            const loginProcess = await  Api.login(login,password)
            if(loginProcess.errCode == 200) {
                await  Api.getObjects(); 
                move('App')
            }
        } catch (error) {
            console.log("error",error);
            alertUser(error.errCode)
        }        
  }

  const alertUser  = (errCode) => {
    const alertTitle = t("LOGIN_ERROR_TITLE").toUpperCase();
    const defaultError = "LOGIN_ERROR_LOGIN_PASSWORD";
    const otherErrors = {
                          500 : "LOGIN_ERROR_SERVER",
                          504 : "SERVER_TIME_OUT"
                        }
    
    const alertBodyMsg = otherErrors[errCode] || defaultError;
    const alertBody = t(alertBodyMsg);
   
    const validLabel = 'OK'


    Alert.alert(
      alertTitle,
      alertBody,
      [        
        { 
          text: validLabel     
        }
      ]
    );
  }



/*
  const lostPasswordSubmit = async(values) => {

      const dcms = await checkMultiServer();
      console.log(dcms)
      console.log("lostPasswordSubmit",values);
      const res = await  Api.recoverPassword(cleanLogin(values.login));
      console.log("in login screen ",res)
      move('ReinitPassword',{login:cleanLogin(values.login)})

  }
*/
//==================== CUSTOM SERVERS =========================

    const inputRef = React.useRef(null);
   

  const logoTap = () => {
      console.log("tapatapatapa")
      if((countTap+1)> 7 ){
        dispatch(userSetIsTester(true));
        //storage
        storeIsTester(true)
      }
      setCountTap(countTap+1)
    
  }
 
  const [selectedServerIndex,setSelectedServerIndex] = useState(0);
  const [customServerUrl,setCustomServerUrl] = useState(null);

  //------------------------ RADIO GROUPS ---------------------
  const groupButtonStyle = {margin:5,height:30,borderRadius:15,borderColor:'transparent',borderWidth:0}
  const groupButtonContainerStyle = {backgroundColor:'transparent',borderColor:'transparent',border:'none'}
  const groupButtonSelectedButtonStyle = {backgroundColor:theme.primary}

  const onSelectServer = (index) => {
    console.log("inputRef",inputRef.current);
  
    setSelectedServerIndex(index);
  }

  const serversButtons = () => {
    return multiServers.reduce((r,v,i) => {

        r.push ( <GroupButtonText>{v.label}</GroupButtonText>)
        return r
      },
      [])
  }
  
  const customServerHanlder = (text) => {
      console.log("text",text)
    setCustomServerUrl(text)
    console.log("CustomServerUrl",customServerUrl);
  }

  const checkMultiServer = async() => {
      if(countTap < 8) return true
      if(selectedServerIndex < (multiServers.length-1)) {
        await storeServer(multiServers[selectedServerIndex].url)
      } else {
        await storeServer(customServerUrl)
      }
      return true;

       
  }
  
  const goToRecovery = () => {
    setStep("reinit")
    //setStep("waiting")
  }
 

  //submitReinit coming from brand LostPassword
  const submitReinit = async (values) => {

    console.log("ReinitPassword submit in lostPasswordScreen 2",values)  ;
    const myLogin = login;
      const reinitProcess = await Api.reinitPassword(myLogin,values.reinitCode,values.password);
      console.log("REINIT_PROCESS_WHILE_LOGGED_OUT :",reinitProcess)
      if (reinitProcess.errCode != 200 && reinitProcess.errCode != undefined) { 
          console.log("bon erreur ",reinitProcess.errCode)
          showAlert(t("USER_CODE_ERROR_TITLE"),t("USER_CODE_ERROR_BODY","ok"))
          return null; 
      } else {
        await  Api.getObjects(); 
        move('App')
      }
  
      //continue
      console.log("reinitProcess completé",reinitProcess)
}






  const logoButton = buildTestId("logoButton");



    return (
        
          <>
             {(countTap > 7) &&
              <ServerSelector {...{onSelectServer,selectedServerIndex}} />  
            }
            <LostPasswordTemplate {...{showServerSelectorTap:logoTap,step,submit,submitReinit,goBack,move,login,goToRecovery}}/>
            </>
            
    );
    }

export default LostPasswordScreen;


const styles = StyleSheet.create({
    insideBlock: {
      margin:10
     
    },
    buttonContainer: {
        width:'100%',
        marginTop:10,
        
    }
  });


const GroupButtonText = styled.Text`
font-size: ${props => (props.fontSize|| 12)}px;
font-weight:normal;
text-transform:capitalize;
`; 


