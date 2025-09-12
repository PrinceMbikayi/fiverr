
import dotProp from 'dot-prop-immutable';
import {USER_SET_PREF}  from '../actions/user'

import {

  USER_SET, 
  USER_DEL, 
  USER_UPDATE,
  USER_SET_NICKNAME,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  USER_LOG_ERROR,
  USER_SET_DEFAULT_WEATHER,
  USER_SET_IS_TESTER,
  USER_ADD_FAVORITE,
  USER_REMOVE_FAVORITE,
  USER_REMOVE_ONE_FAVORITE,
  USER_SET_LOGIN

} from '../actions/user'

import { REHYDRATE } from 'redux-persist';

const userInitialState = {
  loggedIn: false,
  nickname:'',
  email:'',
  login:'',
  defaultWeather:0,
  isTester:false,
  s2_token:"",
  favorite:[]
}


export default function userReducer(state = userInitialState, action) {
  const {payload, type} = action;

  //console.log("userReducer > ",action);
  
  switch (type) {

    case REHYDRATE:
    // troubles in rehydratation
    console.log('rehydrating troubles ? ',action)
    if(action.payload == undefined) return state;

      return {
        ...state,
        nickname: action.payload.user.nickname 
      };

      

    case USER_LOGGED_IN: 
      
      console.log("Reducer User",payload)
      /*
        return {
          ...state,
          loggedIn: payload.loggedIn,
          login:payload.email,
          access_token:payload.access_token,
          test:'here',
          s2_token:payload.s2_token
      }        
      */
        return {
            ...state,           
           ...payload,
           ...(payload?.email && {login:payload.email})
        }
    
        break;
    case USER_LOGGED_OUT: 
        
        return {
            ...state,
            loggedIn: false,
            s2_token:null
          
        }
    
    /* not used rather direct test in API */
    case USER_LOG_ERROR : 
      console.log("reducer Log ERROR",payload)
      return {
        ...state,
        loggedIn: false,
        logError:payload.error      
        }

      break;
    
    case USER_SET:  
      return {
        ...state,
        loggedIn: true,
        email: gg,
      }
      break;

    case USER_DEL: 
      return userInitialState
    
    case USER_UPDATE: 

    //console.log("Reducer User Update",payload)
        return {
            ...state,           
            email: payload.email
          }
    
    case USER_SET_NICKNAME:    

      return {
        ...state,
        nickname:payload.nickname
      }

    case USER_SET_LOGIN:    

      return {
        ...state,
        login:payload.login,
        email:payload.login
      }
    

    case USER_SET_DEFAULT_WEATHER : 
      let path = 'defaultWeather';    
      return dotProp.set(state, path, payload.id);
      break;

    case USER_SET_IS_TESTER :
      return {
        ...state,
        isTester:payload.isTester
      }
      break;

      // Harold
 
case USER_SET_PREF :
    return {
            ...state,
            [payload.name]:payload.value
    }
    break;

      // Harold
      case USER_ADD_FAVORITE:
        const itemId = payload.id;
        console.log("action play Harold :", itemId)
    
          return {
            ...state,
            favorite : itemId,
          };

      case USER_REMOVE_FAVORITE:
    
          return {
            ...state,
            favorite : [],
          };

      // case USER_REMOVE_ONE_FAVORITE:
      //   const id = payload.id;
      //   console.log("REMOVE_THIS_FROM_FAVS:", id)
      //   const favorite = state?.favorite
      //   console.log('WANT_TO_SEE :', favorite);
    
      //     return {
      //       ...state,
      //       favorite : [],
      //     };
    
    
    default:
      return state
  }
}