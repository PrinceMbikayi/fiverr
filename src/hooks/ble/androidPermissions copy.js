
import {
    Platform,
    PermissionsAndroid
  } from 'react-native';

export const handleAndroidPermissions = async () => {

  console.log("[handleAndroidPermissions]")
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      console.log("[handleAndroidPermissions android >31 ] ");//,PermissionsAndroid.PERMISSIONS)


      let doPermission = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if(doPermission['android.permission.ACCESS_FINE_LOCATION'] == "granted" && doPermission['android.permission.BLUETOOTH_CONNECT'] == "granted" && doPermission['android.permission.BLUETOOTH_SCAN'] == "granted") {
        doPermission['blePermissionOk'] = true
      } else {
        doPermission['blePermissionOk'] = false
      }
      console.log("doPermission => result",doPermission)
      return doPermission

    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      console.log("[handleAndroidPermissions android > 23 ]");//,PermissionsAndroid.PERMISSIONS);
      let doPermission = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      if(doPermission == "granted") {
       doPermission['blePermission'] = true
      }
      return doPermission;
    }
  };