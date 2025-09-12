/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import {myRootNotifeeInit} from '_services/pushNotifications/notifee'

    
myRootNotifeeInit();
    
  

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));

