import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {BackHandler, AppState,Platform,Alert,View,Text} from 'react-native';
import {AppRegistry} from 'react-native';

import {Provider} from 'react-redux';
import NetInfo from "@react-native-community/netinfo";
import {getLocales} from 'react-native-localize';


import { NavigationContainer } from '@react-navigation/native';


import BleManager from 'react-native-ble-manager';



/* Loading FONTS */
import IconIonicons from 'react-native-vector-icons/Ionicons';
IconIonicons.loadFont();
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons'
IconMaterialIcons.loadFont();
import IconEntypo from 'react-native-vector-icons/Entypo';
IconEntypo.loadFont();

import i18next from './utils/i18next'; // the instance

import i18n from 'i18next';
import { enableScreens } from 'react-native-screens';
import { MenuProvider } from 'react-native-popup-menu';
import RNBootSplash from "react-native-bootsplash";
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';

//-------------------------------------------
import store from './store';


import { ThemeContextProvider } from './theming/themeProvider';
import {AppContextProvider} from '_helpers/appGlobalProvider';
import {appRefresh,closeWS} from '_actions/app';

import {ReloadDetector} from '_components/ui/reloadDetector';
import {NetworkDetector} from '_components/ui/netWorkDetector';
import  NavigationService from '_services/navigationService';

import {GlobalModalContextProvider} from '_components/ui/globalModal'; 

//-----  push notifications
//-----  push notifications
//import {ForegroundNotifications} from '@components/ui/notificationPush/foregroudNotifications';
import {ForegroundNotifications} from '_components/ui/notificationPush/foregroudNotifications';
import {checkNotificationFromBackground,checkPushNotificationOnStateChange} from '_services/pushNotifications/myPushNotifications';

import {setPushNotificationCategories,notifeeManageInitialNotification} from '_services/pushNotifications/notifee';
import {initPushNotifications} from '_services/pushNotifications/pushNotificationManager';
import { getInitialNotificationSync } from '_services/pushNotifications/myPushNotifications';
// react-native-render-html doesn't require initialization




/*
import {ForegroundNotifications} from '@components/ui/notificationPush/foregroudNotifications';
import {checkNotificationFromBackground,checkPushNotificationOnStateChange} from '_services/pushNotifications/myPushNotifications';

import {setPushNotificationCategories,notifeeManageInitialNotification} from '_services/pushNotifications/notifee';
*/
// ------ end push notifications 

import {support as errSupport} from './api/durin';

// default font
import { typography } from './config/typography';
typography()
// disallow font system scale
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false

// debug
import crashlytics from '@react-native-firebase/crashlytics';

//import notifee from '@notifee/react-native';

//import { FullscreenNotification } from '_components/objects/doorKeeper/pushNotifications/fullscreenNotification';

import { FullscreenNotification } from '_components/objects/@common/pushNotifications/fullscreenNotification';

import  RootStack from '_brand/navigation/rootStack';

import { RootSiblingParent } from 'react-native-root-siblings';

import { SafeAreaProvider } from 'react-native-safe-area-context';


//====== BOTTOM SHEET ================

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';



const errorHandler = (e, isFatal) => {
  //return true;
  console.log("errorHandler >>>>>>>>",e,isFatal,"<<<<<<<<<<<<<<<<<<<<<");
  if(e == undefined)return true;
  let ee = new Error(e)
  if(e.componentStack != undefined) {
    //crashlytics().setAttribute("componentStack",e.componentStack)
    //crashlytics().log(e.componentStack)
  }
  crashlytics().recordError(e);
  
  if (isFatal) {
    const errData = {'type':'fatal','name':e.name,'message':e.message,'stack':e.stack,'componentStack':e.componentStack}
    console.log("e",e);   
    console.log("errData",errData)

    errSupport({"stack":e.stack,"componentStack":e.componentStack}); //sytème maison
   
    const alertTitle = i18n.t("UNEXPECTED_ERROR_OCCURED");
   const errorBody = i18n.t("UNEXPECTED_ERROR_REPORT");
    Alert.alert(
      alertTitle,
        `Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}${"\n"}${errorBody}
        `,
      [{
        text: 'Close'
      }]
    );
  } else {
    console.log("Unexpected error occurred Non Fatal",e); // So that we can see it in the ADB logs in case of Android if needed
    /*
    if(e == undefined)return true;
    Alert.alert(
      'Unexpected error occurred Non Fatal',
      `
      Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
      We have reported this to our team ! Please close the app and start again!
      `,
    [{
      text: 'Close'
    }]
  );*/
  }
  
  
  
};
//à remettre
//setJSExceptionHandler(errorHandler, true);

setNativeExceptionHandler(exceptionString => {
  // This is your custom global error handler
  // You do stuff likehit google analytics to track crashes.
  // or hit a custom api to inform the dev team.
  //NOTE: alert or showing any UI change via JS
  //WILL NOT WORK in case of NATIVE ERRORS.
});
//====================================================
// ADVANCED use case:
const exceptionhandler = exceptionString => {
  // your exception handler code here
  console.log("exceptionhandler",exceptionString)
};
setNativeExceptionHandler(
  exceptionhandler,
  false,
  false
);


if (__DEV__) {
  const ignoreWarns = ["VirtualizedLists should never be nested inside plain ScrollViews"];

  const errorWarn = global.console.error;
  global.console.error = (...arg) => {
    for (const error of ignoreWarns) {
      if (arg[0].startsWith(error)) {
        return;
      }
    }
    errorWarn(...arg);
  };
}

// Attention Vitesse !!!! semble pas nécessaire sur ios et sur les smartphones Android > 8 vérifier sur des appareils plus anciens si nécessaire
// à décommenter si besoin mais source de Bugs lors des changements de langage
//enableScreens();

 class App extends Component {
 
  state = {
    appState: AppState.currentState,
  };

    
  _handleBlur = (e) => {
    console.log("App Blured",e)
  }

  _handleFocus = (e) => {
    console.log("App Focus",e)
  }


  _handleAppStateChange = (nextAppState) => {
    console.log('------------------->>>>> _handleAppStateChange',this.state.appState,nextAppState)
    
    if (  this.state.appState.match(/inactive|background/) && nextAppState === 'active') {

     // checkPushNotificationOnStateChange();
     // checkNotificationFromBackground();

     //console.log("notifeeManageInitialNotification in _handleAppStateChange =>",initialNotification)
      const deviceLang = getLocales()[0].languageCode;
      const currentLang = i18next.language;
      console.log('App has come to the foreground!',deviceLang,currentLang);
      if(deviceLang != currentLang) {
        i18next.changeLanguage(deviceLang);
      }  

      store.dispatch(appRefresh());
      //--------------------  
      // from coldStart  previously here
      //checkNotificationFromBackground();
    }    
    if(nextAppState == "background") {     
      // Need more tests for dispatch below, kept here for tests later
      //store.dispatch(closeWS());
    }
    this.setState({appState: nextAppState});

  };

  //----------------------------------------------
    componentDidMount() {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      AppState.addEventListener('change', this._handleAppStateChange);
      
      /* not supported in IOS Check this
      AppState.addEventListener('blur', this._handleBlur);
      AppState.addEventListener('focus', this._handleFocus);
      */

      this.unsubscribeNetInfo = NetInfo.addEventListener(state => {        
          store.dispatch({
            type: 'UPDATE_CONNECTIVITY',
            payload: {  'isConnected':state.isConnected,
                        'isInternetReachable':state.isInternetReachable,
                        'isWifiEnabled':state.isWifiEnabled,
                        'type':state.type,
                        'details':state.details
                      },
          });       
        }
      )
      //------- splash screen ---------------  
      try {
        RNBootSplash.hide({ duration: 250 });
      } catch (error) {
        //Alert.alert()
        console.log("RNBootSplash error")
      }

      
      // ------- push notifications ------------

         // ------- push notifications ------------
  
         console.log("setPushNotificationCategories")
        // setPushNotificationCategories();
         console.log("push notifications done register")
   
         initPushNotifications();


        //----- blue tooth ---------
         //=========== ble manager start =================
      try {
        BleManager.start({showAlert: true, forceLegacy: true})
          .then(() => console.debug('BleManager started.'))
          .catch(error =>
            console.error('BeManager could not be started.', error),
          );
      } catch (error) {
        console.error('unexpected error starting BleManager.', error);
        return;
      }
      /*
      console.log("notifeeManageInitialNotification")
      notifeeManageInitialNotification();
      console.log("setPushNotificationCategories")
      setPushNotificationCategories();
      console.log("push notifications done register")
      */


      /*
      VoipPushNotification.addEventListener('register', (token) => {
        // --- send token to your apn provider server
        console.log("register VoipPushNotification token",token)
      });
      VoipPushNotification.registerVoipToken(); // --- register token
      */

    }
    //--------------- end componentDidMount -----------------------------------
     onIosPushRegistered = (token) => {
      console.log("onIosPushRegistered ->token",token)
    }


    componentWillUnmount() {
      this.backHandler.remove();
      this.unsubscribeNetInfo()
      AppState.removeEventListener('change', this._handleAppStateChange);
    }

    handleBackPress = () => {
      return false;
      return true;
    }   
  
    getNavigation = () => {
      console.log('this.navigatorRef',this.navigatorRef)

      //return this.navigatorRef?._navigation

      return this.navigatorRef
    }

    ///-----------------------------------------------------------------

//onReady={() => RNBootSplash.hide()}
   
    
    render() {
      const { t, i18n } = this.props;
      return (            
          <Provider store={store}>                  
                <ThemeContextProvider> 
                  <AppContextProvider>
                 
                  <GlobalModalContextProvider>  
                    <BottomSheetModalProvider>
                      <RootSiblingParent> 
                                
                        <MenuProvider> 
                        <SafeAreaProvider>   
                        <NavigationContainer  ref={navigatorRef => {this.navigatorRef = navigatorRef;NavigationService.setTopLevelNavigator(navigatorRef);}}>
                          <RootStack/>
                        </NavigationContainer>
                        </SafeAreaProvider>
                            {/*}            
                              <Navigator screenProps={{
                                  t,
                                  i18n
                                }} ref={navigatorRef => {this.navigatorRef = navigatorRef;NavigationService.setTopLevelNavigator(navigatorRef);}}
                              />

                              */}

                        </MenuProvider>
                      
                        <ReloadDetector/> 
                        <NetworkDetector getNavigation={this.getNavigation}/> 
                        <ForegroundNotifications getNavigation={this.getNavigation} fullscreenProp={this.fullscreenRef}/>  
                        </RootSiblingParent>
                      </BottomSheetModalProvider>
                    </GlobalModalContextProvider>         
                  </AppContextProvider>
                </ThemeContextProvider>                         
          </Provider>        
      )
    }
    
    /*render() {
      const { t, i18n } = this.props;
      return (
        <ThemeContextProvider>          
          <Provider store={store}>
            <MenuProvider>
              <PersistGate loading={null} persistor={persistor}>
                  <Navigator screenProps={{
                      t,
                      i18n
                    }}
                  />
                  </PersistGate>
            </MenuProvider>
          </Provider>
        </ThemeContextProvider>
      )
    }*/
  }

  export default App

  // fullscreen   activity
function FullScreenComponent(){
  console.log("FullScreenComponent launched ?")
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <FullscreenNotification appStore={store} ref={fullscreenRef => {this.fullscreenRef = fullscreenRef;}}/>
  );
}

if(Platform.OS == "android")  {
  console.log("--> custom is registered")
  AppRegistry.registerComponent('custom', () => FullScreenComponent);
}