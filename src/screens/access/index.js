import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler } from 'react-native';
import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';


//---------- server selector -------------

import { userSetIsTester } from '_actions/user';
import ServerSelector from '_components/ui/serverSelector';
import { multiServers } from '_config/AppConfig';
import { setIsTester as storeIsTester, setServer as storeServer } from '_services/storage';

//------------ oAuth ---------------------
import { createAccountWithGoogle } from '_api/social';
import { onAppleButtonPress } from './appleAuth';

//--- Template ----------------------------------------------
import AccessTemplate from '_brand/templates/screens/access';



const AccessScreen = (props) => {

    const { t, i18n } = useTranslation();
    const { navigation,route} = props;
    const netInfo = useNetInfo();  
    const [countTap,setCountTap] = useState(0);

    
    useEffect(()=> {
      // needed for template refresh 
      console.log(netInfo?.isInternetReachable)
    },[netInfo]);


    useEffect(() => {        
        const backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            backHandlerSubscription.remove();           
        };
      }, []);

    const handleBackPress =  () => { 
      return true;
    }

   
    const move = (destination) => {       
      
        if(netInfo.isInternetReachable) {            
            props.navigation.navigate(destination)
        } else {   
            const toastOptions = {duration:Toast.durations.LONG}        
            Toast.show(t("INTERNET_NOT_AVAILABLE"),toastOptions);
        }       
    }

    const networkState = useSelector(state => state.network.isInternetReachable);
    const [serverError,setServerError] = useState(false)
    const [doReconnection,setDoReconnection] = useState(false);
    const prevNetworkState = useRef();

 
    useEffect(() => {
        console.log('networkStateChanged',networkState,"doReconnection",doReconnection)
        if(networkState == true) {           
            console.log("reconnecté or 1st pass let's add params to navigation origin",doReconnection);         
        } else {
            console.log("not connected 1st pass expect reconnection");
            prevNetworkState.current == false
            setDoReconnection(true)
        }
      }, [networkState]);
   
      
      /**
       * 
       *  BE CAREFUL WE ARE HERE TO CREATE AN ACCOUNT
       * 
       */
      
      
      
      const socialLogin = async(type) => {

        if(!netInfo.isInternetReachable) {     
            const toastOptions = {duration:Toast.durations.LONG}        
            Toast.show(t("INTERNET_NOT_AVAILABLE"),toastOptions);
            return false;
        }     




        console.log("socialLogin type",type);
        switch(type) {
            case 'google' :
                // create or reload
                const doGoogle = await createAccountWithGoogle();
                console.log("And finaly ...",doGoogle)
                navigation.navigate('App')
                break;
            case 'apple' :
                appleAuth();
                break;
        }
      }


      const grantedDestination = 'App';

      const appleAuth = async() => {
        console.log("appleAuth");
        const pressResult = await onAppleButtonPress();
        console.log("pressResult",pressResult);
        if(pressResult) {
          navigation.navigate(grantedDestination)
        }
      }


      //------- SERVER SELECT --------------
      const dispatch = useDispatch();

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
  
  
  
    const onSelectServer = (index) => {    
      setSelectedServerIndex(index);
    }
  
    useEffect(()=> {
      if(selectedServerIndex != undefined) {
        checkMultiServer();
      }
    },[selectedServerIndex]);
  
    const checkMultiServer = async() => {
        if(countTap < 8) return true
        if(selectedServerIndex < (multiServers.length-1)) {
          await storeServer(multiServers[selectedServerIndex].url)
        } else {
          await storeServer(customServerUrl)
        }
        return true;
  
         
    }


       return (
        <>
        {(countTap > 7) &&
          <ServerSelector {...{onSelectServer,selectedServerIndex}} />
        }
        <AccessTemplate move={move} serverError={serverError} isConnected={netInfo.isInternetReachable} oAuth={socialLogin} showServerSelectorTap={logoTap} />
        </>
    );
    }

export default AccessScreen;
