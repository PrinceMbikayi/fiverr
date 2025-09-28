import { composeWithDevTools } from '@redux-devtools/extension';
import { applyMiddleware, createStore } from 'redux';

import apiMiddleware from '../middleware/api';
import notificationsMiddleware from '../middleware/notifications';
import objectsMiddleware from '../middleware/objects';
import roomsMiddleware from '../middleware/rooms';
import rootReducer from '../reducers';

import { persistReducer } from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';

/*
const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});*/
const middlewares = [
                      apiMiddleware,
                      objectsMiddleware,
                      notificationsMiddleware,
                      roomsMiddleware
]

const composeEnhancers = composeWithDevTools({
  realtime: true,
  name: 'Your Instance Name',
  hostname: 'localhost',
  port: 8081, // the port your remotedev server is running at
});

//========= REDUX DEVTOOLS (Flipper removed) =================
// Flipper dependencies have been removed for better compatibility

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


/* Version sans middleware 
const store = createStore(
  rootReducer,devToolsEnhancer()
    // Specify custom devTools options
  
)
*/



/*
const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(apiMiddleware),
  // other store enhancers if any
));


export default store
*/

const persistConfig = {
  key: 'root',
  storage:AsyncStorage,
  whitelist: ['user']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


/* https://stackoverflow.com/questions/46608411/order-of-multiple-middleware-in-react-redux/46609220 */
/* en mode debug */
/* au debut avec l'outil chrome
const store = createStore(persistedReducer, composeWithDevTools(
  applyMiddleware(...middlewares)));
*/

//avec Flipper
  const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middlewares)));

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



/*



//export default persistor;
export default () => {
  
  return { store, persistor }
}
*/





// DISABLED EXAMPLE
// Trigger Redux actions on Firebase events
// addFirebaseListeners(store.dispatch, store.getState)