// components/ScreenWrapper.js
import React,{useState,useEffect} from 'react';
import { View, StyleSheet,Text} from 'react-native';

import { useNavigation,useRoute } from '@react-navigation/native';



// note BleCheckScreen name is confusing as the file is in boardgate/component 
import BleCheckScreen from './components/check/bleCheck';

import { useBleContext } from '_hooks/ble/bleContext';
import { devicesConfig } from '../bluetoothPairing/ble/devicesConfig';

const ScreenWrapper = (props) => {

    const {children}  = props;


    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    console.log("navigationParams in ScreenWrapper",JSON.stringify(navigationParams));
   
   
     //----- uBle ----------------
      const uBleContext = useBleContext();
      const uBle = uBleContext;
      const {connectionLost,bleCheckActivated} = uBleContext;
      const {isConnected: realyBleConnected,} = uBle;
      const [bleConnected, setBleConnected] = useState(false);
    
       //----- uObject ----------------
      const uObject =null;// useObject(itemId,uBle);
      //const {characteristicsRetrieved} = uObject;
    
      useEffect(()=> {
        console.log("------------------------------>>>> bleCheckActivated",bleCheckActivated);
      },[bleCheckActivated]);


    const cancelDestination = navigationParams?.params?.cancelDestination || props?.cancelDestination;



const onAbortWizard = () => {
    console.log("onAbortWizard !!!!! ",cancelDestination);

    const currentRoute = navigation.getState().routes
    console.log("so currentRoute(s)",JSON.stringify(currentRoute));
    const parentNav = navigation.getParent();
    if(parentNav) {
        console.log("so parentNav",parentNav);
       
    }
    if(cancelDestination === 'ToTop') {
        navigation.popToTop();
    } else {
        console.log("so go to cancelDestination",cancelDestination);
        navigation.navigate(cancelDestination)
    }
    
}

  return (
    <View style={styles.container}>
      {/* <Text style={{color:'white',fontSize:20,margin:10}}>Sesame Wizard Screens Wrapper</Text> */}
        {bleCheckActivated && <BleCheckScreen
            {...{uBle:uBleContext, uObject, bleConnected, setBleConnected, connectionLost, 'allCharacteristics':devicesConfig}}
          
            onAbortWizard={onAbortWizard}
            debug={props.debug}
          
          />
          }
        
      {/* Add global components like headers, themes, or context here */}
      {children}
      {/* {(__DEV__  && 1 == 1) && 
        <View style={styles.debugBottom}>
        <Text>boardgate/wizard/wizardScreensWrapper.js</Text>
        <Text>cancelDestination : {cancelDestination}</Text>
        </View>
      
      } */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    //backgroundColor: '#c31818',
  },
  debugBottom : {
    padding:8
  }
});

export default ScreenWrapper;
