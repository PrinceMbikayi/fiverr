import {Buffer} from 'buffer';

import {Platform, PermissionsAndroid} from 'react-native';
import BleManager from 'react-native-ble-manager';
import bleConfig from '_src/config/products/bleConfigs/config.json';


export const recomposeName = name => {
  const ignoredExtraDatas = name.split('_')[0];
  const splitted = ignoredExtraDatas.split('-');
  if (splitted.length < 2) {
    return ignoredExtraDatas;
  }
  return (splitted[0] + '-' + splitted[1]).toUpperCase();
};

export const byteToStringComplex = arr => {
  console.log('XXX byteToString', arr);

  //console.log('XXX dec 1', byteToStringTwo(arr));

  if (typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
};

export const stringToByte = str => {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
};

export const bytesToString = arr => {
  if(arr.length == 0) return ""
  const buffer = Buffer.from(arr);
  const data = buffer.toString();
  console.log('bytesToString data', data);

  return data;
};

//---------- permissions ---------------

export const checkPermissions = async () => {
  if (Platform.OS == 'android') {
  } else {
    return true;
  }
};

//ACCESS_FINE_LOCATION,

export const checkAPermission = async permissionId => {
  console.log("checkAPermission ==>", permissionId);
  const value = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS[permissionId],
  );
  return {permissionId: permissionId, value: value};
};

export const handleAndroidPermissions = async permissionsTexts => {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    /*
    console.log(
      'be sure of request fine location first !!! ',
      permissionsTexts,
    );
    */
    const fineLocationFirst = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      permissionsTexts?.fineLocation,
    );
   // console.log('fineLocationFirst result XXX', fineLocationFirst);
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    if (result) {
     // console.log('result permissions', result);

      let isGranted = 'granted';
      Object.keys(result).forEach(function(key, index) {
        if (result[key] != 'granted') {
          isGranted = false;
        }
      });
      /*
      console.debug(
        '[handleAndroidPermissions] User accepts runtime permissions android 12+',
        result,
        isGranted,
      );*/
      return isGranted;
    } else {
      /*
      console.error(
        '[handleAndroidPermissions] User refuses runtime permissions android 12+',
      );*/
      return false;
    }
  } else if (Platform.OS === 'android' && Platform.Version >= 23) {
    console.log('Test PermissionsAndroid')
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(checkResult => {
      if (checkResult) {
        console.debug(
          '[handleAndroidPermissions] runtime permission Android <12 already OK',
        );
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).then(requestResult => {
          if (requestResult) {
            console.debug(
              '[handleAndroidPermissions] User accepts runtime permission android <12',
            );
            return requestResult;
          } else {
            console.error(
              '[handleAndroidPermissions] User refuses runtime permission android <12',
            );
          }
        });
      }
    });
  }
};
/*
import { LOG } from '_utils/logger';
const BleLog = LOG.extend("BLE")
*/
export const debugBle = (prefix, ...args) => {
  if (prefix) {
    //console.log(prefix, ...args);
    //BleLog.silly(...args)
  }
};


// definatlly not usable but keep it for later because connect has a internal timeout of aournd 10 to 30 seconds
// use like this
/*return new Promise(async (resolve, reject) => {
    connectWithRetry(peripheralId, 3, 3000)
    .then(() => {
        console.log("it's connected result"); 
        resolve(true);
    })
    .catch(() => {   
        console.log("is Rejected !! not found") 
        reject('not found');          
    });
  })
*/
export const connectWithRetry = (deviceId, retries = 3, delay = 3000) => {
  return new Promise((resolve, reject) => {
    const attemptConnection = (remainingRetries) => {
      console.log(`Attempting connection to ${deviceId}`);
      BleManager.connect(deviceId)
        .then(() => {
          resolve('Connected');
        })
        .catch((error) => {
          if (remainingRetries > 0) {
            console.log(`Retrying connection, attempts left: ${remainingRetries}`);
            setTimeout(() => attemptConnection(remainingRetries - 1), delay);
          } else {
            reject(new Error('Failed to connect after retries'));
          }
        });
    };

    attemptConnection(retries);
  });
};

export const getDeviceBleCharacteristicsMap = (foundModel) => {
  return bleConfig[foundModel] || {};
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
} 

 export const storeCaracteristics = (data) => {
 
        const characteristics = data.characteristics.reduce((r,v,i) => {
            r[v.characteristic] = {service: v.service};
            return r
        }
        ,{});
        return characteristics;
    }