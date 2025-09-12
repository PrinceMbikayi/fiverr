import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

import  NavigationService from '_services/navigationService';
import { goBackDestination } from './destinations';
import i18next from 'i18next';

// Function to check Bluetooth permissions based on SDK version
const requestBluetoothPermissions = async () => {
  console.log('PONT_1');
  if (Platform.OS === 'android') {
     console.log('PONT_2');
    // Get the Android version
    const sdkVersion = parseInt(Platform.Version, 10);
     console.log('PONT_3');
    if (sdkVersion >= 31) {
      // For SDK >= 31 (Android 12+), request Bluetooth permissions
       console.log('PONT_4');
      const requestPerm =  await requestBluetoothPermissionsForSDK31AndAbove();
      console.log('GET_PERM_31 :',requestPerm );
      return requestPerm
    } else {
       console.log('PONT_6');
      // For SDK < 31 (Android 11 and below), request legacy Bluetooth permissions
      const requestPerm = await requestBluetoothPermissionsForLegacy();
      console.log('GET_PERM_30 :',requestPerm );
      return requestPerm
    }
  }
};

// Handle permissions for Android 12+ (SDK >= 31)
const requestBluetoothPermissionsForSDK31AndAbove = async () => {
   console.log('PONT_7');
  try {
    // Request Bluetooth permissions (BLUETOOTH_CONNECT, BLUETOOTH_SCAN, and ACCESS_FINE_LOCATION)
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // Required for Bluetooth scanning on Android 12+
    ]);
    console.log('HAA :', granted);

    // Check if permissions are granted
    if (
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      granted['blePermissionOk'] = true
      // console.log('Bluetooth permissions granted for SDK >= 31');
      // startBluetoothScan();
      // return true;

    } else {
      granted['blePermissionOk'] = false
      console.log('Bluetooth permissions denied for SDK >= 31');
      handleDeniedPermission();
    }
    return granted
  } catch (err) {
    console.warn('Permission request failed for SDK >= 31', err);
  }
};

// Handle permissions for Android 11 and below (SDK < 31)
const requestBluetoothPermissionsForLegacy = async () => {
   console.log('PONT_8');
  try {
    // Request legacy Bluetooth permissions (ACCESS_FINE_LOCATION, BLUETOOTH, BLUETOOTH_ADMIN)
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    // const granted = await PermissionsAndroid.requestMultiple([
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    //   PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    // ]);
     console.log('PONT_9');
    // Check if permissions are granted
    if (
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED 
      // granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
      // granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED 
    ) {
      console.log('Bluetooth_permissions_granted_SDK<31 :', granted);
      //startBluetoothScan();
      granted['blePermissionOk'] = true
      //return true;
    } else {
      granted['blePermissionOk'] = false
      handleDeniedPermission();
    }

     return granted

  } catch (err) {
    console.warn('Permission request failed for SDK < 31', err);
  }
};

// Start scanning for Bluetooth devices
const startBluetoothScan = () => {
  console.log('Starting Bluetooth scan...');
  // Start scanning for Bluetooth devices using your Bluetooth library (e.g., react-native-ble-plx)
};

const soGoBack = () => {
  console.log("soGoBack goBackDestination",goBackDestination);
  if(goBackDestination.length == 1 ){
     NavigationService.navigate(goBackDestination[0]); // Navigate to the previous screen
  } else if(goBackDestination.length > 1) {
     NavigationService.navigate(goBackDestination[0],{screen:goBackDestination[1]}); // Navigate to
  }
} 


const handleOnPress =()=>{
  Linking.openSettings()
  NavigationService.navigate("AddObject")
}

// Handle cases where permissions are denied
const handleDeniedPermission = async () => {
  const alertTitle = i18next.t('bluetooth'+':'+'PERMISSIONS_REFUSED_TITLE');
  const alertBody = i18next.t('bluetooth'+':'+'PERMISSIONS_REFUSED_BODY');
  const goSettingsLabel =  i18next.t('bluetooth'+':'+'PERMISSIONS_REFUSED_OPEN_SETTINGS');
  const cancelLabel = i18next.t('bluetooth'+':'+'PERMISSION_DENY_BUTTON');
  const permissionStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
  return permissionStatus
  // if (permissionStatus === false) {
  //   Alert.alert(
  //     alertTitle,
  //     alertBody,
  //     [
  //       {
  //         text: goSettingsLabel,
  //         onPress: handleOnPress,
  //       },
  //       { text: cancelLabel,
  //         onPress: soGoBack},
  //     ]
  //   );
  // }
};

// Check and request Bluetooth permissions (this is your entry point)

export const handleAndroidPermissions = async () => {

  console.log("[handleAndroidPermissions]")
    if (Platform.OS === 'android') {
     const requestPermission = await requestBluetoothPermissions();
     console.log('REQUEST_PERM : ', requestPermission);
     return requestPermission
    }else{
      console.log('HELLO_NOT_ME');
    }
}


export const checkAndroidPermissions = async () => {
  console.log("[checkAndroidPermissions]")
  if (Platform.OS === 'android') {
    const permissionStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
    return permissionStatus;
  }
  return true; // For iOS or other platforms, permissions are not required
}