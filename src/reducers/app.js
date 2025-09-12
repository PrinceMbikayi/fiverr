import {APP_PREVIOUS_ROUTE} from '../actions/app'
import {APP_FOCUS_ADDED_PRODUCT} from '_actions/app';
import {GET_DISCOVERY_EZSP} from '_actions/app';


import dotProp from 'dot-prop-immutable';

const appInitialState = {
  previousRoute: false,
  refreshNeeded:false,
  focusAddedProduct:false,
  simultaneaousPanResponder:[],
  discoveryEzsp:"noScan"
}


export default function appReducer(state = appInitialState, action) {
  const {payload, type} = action;

  //WARNING CHECK HERE  console.log("appReducer = > ",action);
  //console.log("appReducer = > ",action);
  if(type == GET_DISCOVERY_EZSP){
    //console.log(" AFFICHER TYPE ")
  }

  switch (type) {

    case APP_PREVIOUS_ROUTE: {
        // WARNING CHECK HERE console.log('SET_PREVIOUS_ROUTE ENTRE',payload);
        return {
            ...state,
            previousRoute: payload.previousRoute,
            
           
        }
    }

    case "APP_REFRESH_NEEDED": {
        return {
          ...state,
          refreshNeeded: payload
        
      }
    }

    case APP_FOCUS_ADDED_PRODUCT : {
      console.log("payload",payload)
      return {
        ...state,
        focusAddedProduct: payload
      
      }
    }

    // Harold add 
    case GET_DISCOVERY_EZSP : {
      console.log("DISCOVERY EZSP :", payload);
      console.log("HAROLD MMMMM " );
      state.discoveryEzsp = payload;
      return state
    }

    case "ADD_PANRESPONDER" :
      console.log("ADD_PANRESPONDER",action)
      state = dotProp.merge(state, "simultaneaousPanResponder", payload);
      return state

    default:
      return state
  }
}