import {composeWithDevTools} from '@redux-devtools/extension';
import {applyMiddleware, createStore} from 'redux';
import {configureStore, Tuple} from '@reduxjs/toolkit';

import apiMiddleware from '../middleware/api';
import notificationsMiddleware from '../middleware/notifications';
import objectsMiddleware from '../middleware/objects';
import roomsMiddleware from '../middleware/rooms';
import rootReducer from '../reducers';

import {persistReducer} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';

/*
const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});*/
const middlewares = [
  apiMiddleware,
  objectsMiddleware,
  notificationsMiddleware,
  roomsMiddleware,
];

const composeEnhancers = composeWithDevTools({
  realtime: true,
  name: 'Your Instance Name',
  //hostname: 'localhost', // For android simulator, use : '10.0.2.2', // IP pour accéder à la machine hôte depuis l'émulateur Android
  hostname: '10.0.2.2',
  port: 8081, // the port your remotedev server is running at
});

//========= FLIPPER REDUX =================
if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* https://stackoverflow.com/questions/46608411/order-of-multiple-middleware-in-react-redux/46609220 */
/* en mode debug */
/* au debut avec l'outil chrome
const store = createStore(persistedReducer, composeWithDevTools(
  applyMiddleware(...middlewares)));
*/

//avec Flipper
//const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middlewares)));

// 4. configureStore
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // disable due to redux-persist
    }).concat(middlewares),
  devTools: __DEV__, // enable Redux DevTools in development
});

/* const oups_store = createStore(persistedReducer, composeEnhancers(
    applyMiddleware(apiMiddleware,objectsMiddleware,notificationsMiddleware)));
  */

/* with persist
  const store = createStore(persistedReducer, 
    applyMiddleware(apiMiddleware,objectsMiddleware));


*/

/* simple not tools*/
/*
const store = createStore(rootReducer, 
  applyMiddleware(apiMiddleware,objectsMiddleware,throttledMiddleware));
*/

//export const persistor = persistStore(store);

export default store;

//   import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import rootReducer from './reducers'; // Adjust the path as needed
// import thunk from 'redux-thunk';

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['user'],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Set up the store with middleware and Redux DevTools automatically
// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // Required for redux-persist with AsyncStorage
//     }).concat(thunk),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// const persistor = persistStore(store);

// export { store, persistor };
