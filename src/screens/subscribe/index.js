import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import { useNetInfo } from "@react-native-community/netinfo";
import { useTranslation } from 'react-i18next';
import { BackHandler } from 'react-native';
import Toast from 'react-native-root-toast';
import styled from 'styled-components/native';


import { withTheme } from '_theming/themeProvider';
//import {Api} from "../../api";
import { userSetIsTester } from '_actions/user';
import { Api } from "_api";
import { getUserDetails } from '_api/user';
import ServerSelector from '_components/ui/serverSelector';
import { multiServers } from '_config/AppConfig';
import { setIsTester as storeIsTester, setServer as storeServer } from '_services/storage';

//--- Template ----------------------------------------------
import SubscribeTemplate from '_brand/templates/screens/subscribe';

//--- brand ----
//import brandAppTexts from '_brand/texts/app.json';

//--- Appium -----
import { buildTestId } from '_helpers/appium';



// Function component start Here

const SubscribeScreen = (props) => {
    
    const { t, i18n } = useTranslation();
    const { theme, navigation} = props;
    const netInfo = useNetInfo();

    const dispatch = useDispatch(); 

    const [pageIndex,setPageIndex] = useState(0);
    const [userId, setUserId] = useState('');
    const [userPassword,setUserPassword] = useState('');
    const [subscribreStep, setSubscribreStep] = useState("begin");

    const tapNumbers = 7;
   
   
  
    // create our ref const myViewPager = useRef();


    const [login,setLogin] = useState("")
    /* ------- custom server ------------ */
    const [countTap,setCountTap] = useState(0);



     /**
     * Handle Android Back Button in this screen
     * 
     */

    useEffect(() =>{
        const backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            backHandlerSubscription.remove();
            console.log("Subscribe Screen BackHandler je suis retiré")
        };
      }, [pageIndex]);


    const handleBackPress =  () => {  
        console.log("handleBackPress")
        goBack()
        
        return true; // intercept event    
    }

    const goBack = () => {
        //console.log('APP_PREVIOUS_ROUTE_2 :', navigation.getState()?.routes);
        const prev = pageIndex-1;
        console.log(pageIndex,prev)
        if(prev < 0) {
            navigation.goBack();
        } else {
            console.log("ben retourne à zero")
            setPageIndex(prev);
            console.log("pageIndex",pageIndex)
            //myViewPager.current.setPage(prev);
        }
        
    }


    const move = (destination,params={}) => {   

        if(netInfo.isConnected || 1 == 1) {            
            navigation.navigate(destination,params)
        } else {           
            Toast.show(t("INTERNET_NOT_AVAILABLE"));
        }
       
    }






    const submit = async (values) => {
     
        const dcms = await checkMultiServer();

        const login = values.login.toLowerCase().trim();
        console.log("[SubscribeScreen] 🚀 ~ file: index.js:115 ~ submit ~ values:", values)
        const password = values.password;
        const firstname = values?.firstname || "";
        const name = values?.name || "";

        setLogin(login)   

        
      let userNameArg = "";
      if(firstname != "")userNameArg += firstname;
      if(name !="") userNameArg += " "+name;

        let registerProcess = await  Api.register(login,password,userNameArg);

        console.log("registerProcess",registerProcess);
       
        if(registerProcess.errCode != 200){
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
            setPageIndex(1); 
            setSubscribreStep("waiting")
            setUserId(login);
            setUserPassword(password);
           // myViewPager.current.setPage(1);
        }
          
    }

    const confirmSubmit = async (values) => {

        console.log("subscribe [confirmSubmit]PArent submit",values,userId,userPassword)       
        let confirmRegisterProcess = await  Api.confirmRegister(userId,values.userCode,userPassword).catch((err)=> console.log("error subscribe ",err));

        console.log("confirmRegisterProcess",confirmRegisterProcess);

        if (confirmRegisterProcess.errCode != 200) { 
            console.log("bon erreur ",confirmRegisterProcess.errCode)
            showAlert(t("USER_CODE_ERROR_TITLE"),t("USER_CODE_ERROR_BODY","ok"))
            return null; 
        } else {
          // const previousDestination =  navigation.getState()?.routes ||[]
          // console.log('HARDY_PREVIOUS_DESTINATION :', previousDestination);
          // const length = previousDestination.length
          // previousDestination.map(item=>{
          //   const destination
          // })
            const resUser = await getUserDetails().catch((err)=> console.log(err));
            const resObject = await  Api.getObjects();
            const resRooms = await Api.getRooms(); 
           navigation.navigate('Auth', { screen: 'RegisterBoxScreen' });
           //navigation.navigate('ProductsScreen',{screen:'RegisterBoxScreen'})
           //move('App') 
        }


    }
    const showAlert= (title,body,label,callback) => {
  
        const alertTitle = title.toUpperCase();
        const alertBody = body;
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



  const onSelectServer = (index) => {
  
    setSelectedServerIndex(index);
  }

  
  const customServerHandler = (text) => {
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

  const logoTest = buildTestId("activateServerSelection");

  /*
  const {submit,confirmSubmit,goBack,pageIndex,userId = '',userPassword='' } 

  */
    return (
           <SafeAreaView style={{flex:1, backgroundColor:'transparent'}}>
            {(countTap > tapNumbers) &&
              <ServerSelector {...{onSelectServer,selectedServerIndex}} />
            }
            <SubscribeTemplate {...{subscribreStep,showServerSelectorTap:logoTap,submit,confirmSubmit,goBack,pageIndex,userId,userPassword,move}}/>
            </SafeAreaView>
         );
}

export default withTheme(SubscribeScreen);

const styles = StyleSheet.create({
    insideBlock: {
      margin:10
     
    },
    viewPager : {
       flex:1
    }
  });

  const GroupButtonText = styled.Text`
font-size: ${props => (props.fontSize|| 12)}px;
font-weight:normal;
text-transform:capitalize;

`; 