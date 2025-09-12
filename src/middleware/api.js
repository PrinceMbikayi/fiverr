import {GET_ROOM} from '_actions/rooms';
import {USER_LOGGED_IN,USER_LOGGED_OUT} from '_actions/user';
import dotProp from 'dot-prop-immutable';

import {EXECUTE_ACTION} from '_actions/objects'
import { APP_REFRESH,CLOSE_WS } from '_actions/app';
import {getObjects } from '_api/objects';
import {startWs,closeWs} from '_api/Api';
import {appRefresh} from '_actions/app';
import { checkUserIsGranted} from '_api/Api';
import { appServerIsDown } from '_actions/network';


const apiMiddleware = (store) => (next) => (action) => {
  

    const {type,payload} = action;

    switch(action.type) {

      case EXECUTE_ACTION : 
        next(action);
        break;

      case USER_LOGGED_IN :
        //console.log("Middleware USER_LOGGED_IN ",action);
        store.dispatch(appServerIsDown(false))
        next(action);
        break;


        case USER_LOGGED_OUT :
          //console.log("Middleware USER_LOGGED_IN ",action);
          store.dispatch({type:"APP_CLEAN_VISIBLE"})
          next(action);
          break;

      case GET_ROOM :
          
          let path = 'objects.loaded'
          let loaded = dotProp.get(store.getState(), path);  
          //next(action);
          
          break;
        // if we don't need to handle this action, we still need to pass it along

      case APP_REFRESH :
          console.log("APP refresh ")
          // refresh from server
          getObjects().then((res)=> {
            console.log("in middleware APP_REFRESH",res);
            switch(res.errCode) {
              case -1 :
                //note reload when internet reachable 
               
                next({type:"APP_REFRESH_NEEDED",payload:true});
               
                break;
              case 401 : 
              case 400 : 
               
               console.log("demande suite 401/400")
               checkUserIsGranted().then((res) => { 
                // be careful return is always (became ?) resolve
                console.log(["APP refresh"],res)  
                if(res?.errCode == 401) {
                  console.log("USer is NOT Granted !!! ( resolved )")
                  store.dispatch({type:"APP_REFRESH_NEEDED",payload:false})
                }  else {
                  console.log("Err ! 401 or 400 so",res?.errCode)
                  console.log("so ask for refresh")
                  store.dispatch(appRefresh())
                }           
               
              })
              break;
                //console.log("call done !!!!!!")

                case 200 : 
                //ATTENTION remettre
                  startWs();
                  break;
            }
          })
          //console.log("get Objects called")
          break;

      case 'UPDATE_CONNECTIVITY' :
          if(payload.isInternetReachable) {
            if(store.getState().app.refreshNeeded == true) {
              store.dispatch(appRefresh())
            }
            console.log('UPDATE_CONNECTIVITY => startWs')
            //remetre
            startWs();
          }
          next(action);
          break;


      case CLOSE_WS :
        console.log("in middleware close ws")
        closeWs();
        break;

      default:
        //console.log('apiMiddleware default, just next',action);    
        next(action)
    }
  }


  
   
  export default apiMiddleware