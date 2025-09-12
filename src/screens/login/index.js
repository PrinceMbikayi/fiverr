import React from 'react';
import {useState,useEffect} from 'react';

import { View,KeyboardAvoidingView,Text,StyleSheet,ImageBackground,Image,
        ScrollView,Alert,TextInput,
        TouchableWithoutFeedback,TouchableOpacity,
        SafeAreaView} from 'react-native';
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
import {userSetIsTester, userNickname} from '_actions/user';
import {getUserDetails} from '_api/user'
import { useNavigation,useRoute} from '@react-navigation/native';


import ServerSelector from '_components/ui/serverSelector';

//--- brand ----
import brandAppTexts from '_brand/texts/app.json';
//--- Templates ---
import LoginTemplate from '_brand/templates/screens/login';


//--- Appium -----
import {buildTestId} from '_helpers/appium';


/*,{backgroundColor:theme.accessBackgroundColor}*/


// ================ SCREEN COMPONENT START HERE ========================
const LoginScreen = (props) => {
    const { t, i18n } = useTranslation();
    const { navigation} = props;
    const {theme} = useTheme();
    const netInfo = useNetInfo();
    const [countTap,setCountTap] = useState(0)

    const tapNumbers = 7;

    const userInfos = useSelector(state => state.user);
    const dispatch = useDispatch(); 
    //--------------------------
    const move = (destination,params={}) => {   
        if(netInfo.isConnected) {            
            props.navigation.navigate(destination,params)
        } else {           
            Toast.show(t("INTERNET_NOT_AVAILABLE"));
        }       
    }

    console.log('APP_PREVIOUS_ROUTE_2 :', navigation.getState()?.routes);

    const goBack = () => {      
      props.navigation.goBack();
    }
    //----------------------------
    const cleanLogin = (value) => {
      return value.trim();
      //return value.toLowerCase().trim();
    }

    const submit = async (values) => {
      
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",values)

        const dcms = await checkMultiServer();
        console.log('DCMS ::', dcms);
        try {
          const login = cleanLogin(values.login);
          const password = values.password.trim();
            const loginProcess = await  Api.login(login,password)
            console.log('RES_LOGIN :', loginProcess);
            if(loginProcess.errCode == 200) {
                console.log("USER_DETAILS :", loginProcess)
                const resUser = await getUserDetails().catch((err)=> console.log(err));
                const resObject = await  Api.getObjects();
                const resRooms = await Api.getRooms(); 
                console.log('RES_USER_OBJECTS:', resObject);
                move('App')
            }
        } catch (error) {
            console.log("ERROR_AT_THIS_LEVEL",error);
            alertUser(error.errCode,error.errMsg)
        }        
  }

  const alertUser  = (errCode,errMsg) => {
    const alertTitle = t("LOGIN_ERROR_TITLE").toUpperCase();
    const defaultError = "LOGIN_ERROR_LOGIN_PASSWORD";
    const otherErrors = {
                          500 : "LOGIN_ERROR_SERVER",
                          504 : "SERVER_TIME_OUT"
                          
                        }

    const byErrorMessage = {
                        "too_much_mobiles" : "TOO_MUCH_MOBILES",
                        "web_error_forbidden" : "LOGIN_ERROR_LOGIN_PASSWORD"
    }
    
    const alertBodyMsg = byErrorMessage[errMsg] || otherErrors[errCode] || defaultError;
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




  const lostPasswordSubmit = async(values) => {

      const dcms = await checkMultiServer();
      console.log(dcms)
      console.log("lostPasswordSubmit",values);
      const res = await  Api.recoverPassword(cleanLogin(values.login));
      console.log("in login screen ",res)
      move('ReinitPassword',{login:cleanLogin(values.login)})

  }

//==================== CUSTOM SERVERS =========================

    const inputRef = React.useRef(null);
   

  const logoTap = () => {
      console.log("tapatapatapa")
      if((countTap+1)> tapNumbers ){
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
    //console.log("inputRef",inputRef.current);
    console.log('INDEX_ONSELECT_SERVER :', index);
  
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
    console.log("CustomServerUrl",customServerUrl);
    console.log('MULTI_SERVER UU:', multiServers[selectedServerIndex].url);
    if(countTap < tapNumbers){
      return true
    }else{
        console.log('GGG 1:',multiServers.length-1);

      }

      if(selectedServerIndex <= (multiServers.length-1)) {
        await storeServer(multiServers[selectedServerIndex].url)
        console.log('GGG 2:');
      } else {
        await storeServer(customServerUrl)
        console.log('GGG 3:');
      }
      return true;

       
  }
  

 const test = "CHECK-POINT88888"

  const logoButton = buildTestId("logoButton");


  // <KeyboardAvoidingView style={{flex:1}} contentContainerStyle={{flex: 1}} behavior="position" keyboardVerticalOffset={-80}>

    return (
        <SafeAreaView>
        
             {(countTap > tapNumbers) &&
              <ServerSelector {...{onSelectServer,selectedServerIndex, customServerHanlder, test}} />
            }
            <LoginTemplate {...{showServerSelectorTap:logoTap,submit,goBack,move}}/>
        </SafeAreaView>
    );
    }

export default LoginScreen;




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


