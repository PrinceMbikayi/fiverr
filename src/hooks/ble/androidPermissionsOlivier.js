import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
 
import  NavigationService from '_services/navigationService';
 
// Function to check Bluetooth permissions based on SDK version
const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android') {
    // Get the Android version
    const sdkVersion = parseInt(Platform.Version, 10);
 
    if (sdkVersion >= 31) {
      // For SDK >= 31 (Android 12+), request Bluetooth permissions
      await requestBluetoothPermissionsForSDK31AndAbove();
    } else {
      // For SDK < 31 (Android 11 and below), request legacy Bluetooth permissions
      await requestBluetoothPermissionsForLegacy();
    }
  }
};
 
// Handle permissions for Android 12+ (SDK >= 31)
const requestBluetoothPermissionsForSDK31AndAbove = async () => {
  try {
    // Request Bluetooth permissions (BLUETOOTH_CONNECT, BLUETOOTH_SCAN, and ACCESS_FINE_LOCATION)
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // Required for Bluetooth scanning on Android 12+
    ]);
 
    // Check if permissions are granted
    if (
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Bluetooth permissions granted for SDK >= 31');
      startBluetoothScan();
    } else {
      console.log('Bluetooth permissions denied for SDK >= 31');
      handleDeniedPermission();
    }
  } catch (err) {
    console.warn('Permission request failed for SDK >= 31', err);
  }
};
 
// Handle permissions for Android 11 and below (SDK < 31)
const requestBluetoothPermissionsForLegacy = async () => {
  try {
    // Request legacy Bluetooth permissions (ACCESS_FINE_LOCATION, BLUETOOTH, BLUETOOTH_ADMIN)
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
    ]);
 
    // Check if permissions are granted
    if (
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Bluetooth permissions granted for SDK < 31');
      startBluetoothScan();
    } else {
      console.log('Bluetooth permissions denied for SDK < 31');
      handleDeniedPermission();
    }
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
  console.log("soGoBack");
  NavigationService.navigate('Home'); // Navigate to the Home screen or any other screen
  // This function can be used to navigate back or perform any other action
};  
 
 
// Handle cases where permissions are denied
const handleDeniedPermission = async () => {
  const permissionStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
  if (permissionStatus === false) {
    Alert.alert(
      'Permission Denied',
      'You have denied Bluetooth permission. Please enable it from settings.',
      [
        {
          text: 'Go to Settings',
          onPress: () => Linking.openSettings(),
        },
        { text: 'Cancel',
          onPress: soGoBack},
      ]
    );
  }
};
 
// Check and request Bluetooth permissions (this is your entry point)
 
export const handleAndroidPermissions = async () => {
 
  console.log("[handleAndroidPermissions]")
    if (Platform.OS === 'android') {
      requestBluetoothPermissions();
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