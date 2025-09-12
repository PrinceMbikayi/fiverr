import React,{ useState,useRef, useEffect } from 'react';
import { View,Text,StyleSheet,KeyboardAvoidingView,ImageBackground,Image,Alert,TouchableWithoutFeedback,TouchableOpacity, SafeAreaView} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import {useNetInfo} from "@react-native-community/netinfo";
import styled from 'styled-components/native';
import {Input} from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { BackHandler } from 'react-native';


import { withTheme } from '_theming/themeProvider';
import SubscribeComponent from '_components/forms/subscribeComponent';
import SubscribeConfirmComponent from '_components/forms/subscribeConfirmComponent';
import {TextStyles} from '_styles/text';
import {Api} from "_api";
import {multiServers} from '_config/AppConfig';
import ServerSelector from '_components/ui/serverSelector';
import {setServer as storeServer,setIsTester as storeIsTester} from '_services/storage'
import {userSetIsTester, userNickname} from '_actions/user';
import {getUserDetails} from '_api/user'

//--- Template ----------------------------------------------
import RecoverAccountTemplate from '_brand/templates/screens/recoverAccount';

//--- brand ----
//import brandAppTexts from '_brand/texts/app.json';

//--- Appium -----
import {buildTestId} from '_helpers/appium';



// Function component start Here

const RecoverAccountScreen = (props) => {
    
    const { t, i18n } = useTranslation();
    const { theme, navigation} = props;
    const netInfo = useNetInfo();

    const dispatch = useDispatch(); 

    const [pageIndex,setPageIndex] = useState(0);
    const [userId, setUserId] = useState('');
    const [userPassword,setUserPassword] = useState('');
    const [subscribreStep, setSubscribreStep] = useState("begin");
    //const [boxKey, setBoxKey] = useState('');
    const boxKeyRef = useRef()

    const tapNumbers = 7;
   
   
  
    // create our ref const myViewPager = useRef();


    const [login,setLogin] = useState("")
    /* ------- custom server ------------ */
    const [countTap,setCountTap] = useState(0);




    // useEffect(()=> {
    //   console.log('UPDATE_BOX_KEY :', boxKey);
    // },[boxKey]);

     /**
     * Handle Android Back Button in this screen
     * 
     */

    useEffect(() =>{
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            console.log("Subscribe Screen BackHandler je suis retiré")
        };
      }, [pageIndex]);


    const handleBackPress =  () => {  
        console.log("handleBackPress")
        goBack()
        
        return true; // intercept event    
    }

    const goBack = () => {
      
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
     
      console.log('SUBMIT_CREDENTIALS_RECOVERY :', values);
        //const dcms = await checkMultiServer();

        const login = values.login.toLowerCase().trim();
        console.log("[SubscribeScreen] 🚀 ~ file: index.js:115 ~ submit ~ values:", values)
        const password = values.password;
        const boxKey = values.box;
        //setBoxKey(boxKey)
        boxKeyRef.current = boxKey
        const firstname = values?.firstname || "";
        const name = values?.name || "";

        //return false;
        setLogin(login)   

        
      let userNameArg = "";
      if(firstname != "")userNameArg += firstname;
      if(name !="") userNameArg += " "+name;
    


      // Use in the new rocover account end point 
        let recoverProcess = await  Api.recoverCredentials(login,password,boxKey);

        console.log("recoverProcess",recoverProcess);
       
        if(recoverProcess.errCode != 200){
            // gestion de l'erreur
            console.log("register error");
            let msg ="\n";
            switch(recoverProcess.errMsg) {
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

        console.log("subscribe [confirmSubmit]PArent submit",values,userId,userPassword, boxKeyRef.current)       
        let confirmRegisterProcess = await  Api.confirmRecoverCredentials(userId,values.userCode,userPassword,boxKeyRef.current).catch((err)=> console.log("error subscribe ",err));

        console.log("confirmRegisterProcess",confirmRegisterProcess);
        //console.log("myViewPager",myViewPager);         
        
        
        if(confirmRegisterProcess.errCode != 200){
            // ERROR
        } else {   

            //setPagerId(1); 
           // myViewPager.current.setPage(1);
        }

        if (confirmRegisterProcess.errCode != 200) { 
            console.log("bon erreur ",confirmRegisterProcess.errCode)
            showAlert(t("USER_CODE_ERROR_TITLE"),t("USER_CODE_ERROR_BODY","ok"))
            return null; 
        } else {
            const resUser = await getUserDetails().catch((err)=> console.log(err));
            const resObject = await  Api.getObjects();
            const resRooms = await Api.getRooms(); 
            move('App') 
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
           <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            {(countTap > tapNumbers) &&
              <ServerSelector {...{onSelectServer,selectedServerIndex}} />
            }
            <RecoverAccountTemplate {...{subscribreStep,showServerSelectorTap:logoTap,submit,confirmSubmit,goBack,pageIndex,userId,userPassword,move}}/>
            </SafeAreaView>
         );
}

export default withTheme(RecoverAccountScreen);

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