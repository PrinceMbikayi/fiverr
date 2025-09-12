
import { PermissionsAndroid,Linking, Platform, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import BleManager from 'react-native-ble-manager';
import i18next from 'i18next';

async function checkAndRequestBLEPermissions() {

  const alertTitle = i18next.t('bluetooth'+':'+'PERMISSIONS_REFUSED_TITLE');
  const alertBody = i18next.t('bluetooth'+':'+'PERMISSIONS_REFUSED_BODY');
  const goSettingsLabel =  i18next.t('bluetooth'+':'+'PERMISSIONS_REFUSED_OPEN_SETTINGS');
  const cancelLabel = i18next.t('bluetooth'+':'+'PERMISSION_DENY_BUTTON');

  let blePermission;
  const requestBleAccess = await BleManager.checkState();
  // console.log('IOS_BLE_STATUS :', requestBleAccess);
  // if(requestBleAccess == 'on') {
  //   blePermission = true
  // }else if (blePermission = false)

  // return blePermission
  return requestBleAccess

  // if (Platform.OS === 'ios') {
  //     const blop = await BleManager.checkState();

  //     console.log("blop", blop);

  //     if(blop === 'on') {
  //       return true;
  //     } else {
        
  //       Alert.alert(
  //         alertTitle,
  //         alertBody,
        
  //         [
           
  //           {
  //             text: goSettingsLabel,
  //             style:"default",
  //             onPress: () => Linking.openSettings(),
  //           },
  //            {
  //             text: cancelLabel,
             
  //           }
  //         ]
  //       );
  //       return false;
  //     }
     
  //   } 

}

// Call the function to check and request permissions
export default checkAndRequestBLEPermissions;
