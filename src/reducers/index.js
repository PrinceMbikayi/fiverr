import {combineReducers} from 'redux'
// NOTE: No need to name them somethingReducers, we are on the reducers folder
//import firebase from './firebase'
import user from './user';
import network from './network';
import rooms from './rooms';
import objects from './objects';
import app from './app';
import notifications from './notifications';
import notificationPush from './notificationPush'


export default combineReducers({
  user,
  network,
  rooms,
  objects,
  app,
  notifications,
  notificationPush
  /*firebase,*/
})