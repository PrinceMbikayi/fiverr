import NetInfo from "@react-native-community/netinfo";
import {NETWORK_REMIND_WIFI_PASSWORD_TEMP,SERVER_IS_DOWN} from '_actions/network';

const initialState = {
  isConnected: true, // by default the app is assumed to have a connection but need more testing
  isWifiEnabled: true,
  type:'4g',
  isInternetReachable:true,
  wifiPasswordTemp:'',
  details:null,
  serverIsDown:false
}


export default function networkReducer(state = initialState, action) {
  //console.log(NETWORK_REMIND_WIFI_PASSWORD_TEMP,"ACTION",action)
  switch (action.type) {
    case 'UPDATE_CONNECTIVITY' : 
      //return Object.assign({}, state, { isConnected: action.payload });
      return {
        ...state,...action.payload 
       
      }
  
    case NETWORK_REMIND_WIFI_PASSWORD_TEMP :
      console.log("oooooo action",action)
      return {
        ...state,...action.payload 
       
      }

      case SERVER_IS_DOWN : {
        console.log("XXX serverIsDown",action)
        state = {...state,...{serverIsDown:action.payload}};
        return state;
      }

    default:
      return state;
  }
}
