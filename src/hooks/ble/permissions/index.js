import { Platform } from 'react-native';
import {handleAndroidPermissions} from './androidPermissions';
import handleIosPermissions from './iosPermissions';

/*
import {handleAndroidPermissions} from './androidPermissions';
import handleIosPermissions from './iosPermissions';
*/

const handlePersmissions = async () => {
  console.log("[handlePersmissions]");

  if (Platform.OS === 'android') {
    const aperm = await handleAndroidPermissions();
    return aperm;
  } else if (Platform.OS === 'ios') {
    return await handleIosPermissions();
  }
}

export default handlePersmissions;