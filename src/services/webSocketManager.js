import store from '../store';

import {getServer as getStoredServer, getSessionId} from '_services/storage';
import {ws_send_data,recieve_message} from '../ws/Ws';
import {appServerIsDown} from '_actions/network'

import {parseJwt} from '_brand/utils/tools'

// Define our state and initialize it
let mySessionId = "";
let myWs;
let connectionErrors = 0;
const reconnectDelay = 1000;
const maxAttempts = 10;


const getWsUrl = async() => {
    /* 'https://generate-error.debase.glop' || */
    const serverUrl =  await getStoredServer() || AppConfig.SERVER_URL
    console.log("============> getWsUrl ===>",serverUrl)


    return serverUrl.replace('http','ws');    
}


const restartWebsocket = () => {
    console.log("restartWebsocket")
    setTimeout( async function(){ 
        const sessionId = await getSessionId() 
       console.log("after thetimeout in  restartWebsocket")
        initWebSocket(sessionId)
    }, reconnectDelay);
}


const initWebSocket = async(sessionId) => {
    

        console.log("myWs exists !!!!!",myWs)

        if(myWs) return false;
        //console.log("lancement de la socket !!!!!!!!! ",sessionId)        
        const serverUrl = await getWsUrl();
      
        myWs = new WebSocket(serverUrl+"/ws","lws-mirror-protocol", {
            headers: {
              "User-Agent": "react-native",
            },
          });


        
        myWs.binaryType = 'blob'; // nouveau
        const toServerSessionId = sessionId || "nada"

       

        const pp = parseJwt(toServerSessionId);
        console.log("serverUrl initWebSocket",serverUrl, pp);


        myWs.onopen = () => {
            //console.log("onopen -------> access_token ---------->>>>>>>>",sessionId)
            console.log("===============> initWebSocket open !!!",toServerSessionId)
            const msg = ws_send_data('login',"",toServerSessionId); 
            console.log("msg login = "+"("+msg+")")

           



            try {     
                myWs.send(msg);
                console.log("onopen :ça marche");
                store.dispatch(appServerIsDown(false))
            } catch (error) {
                console.log("onopen : Error Send WS ",error,msg);
                myWs = null;
                tryReconnect();
            }
        };
        myWs.onerror = (evt) => {
            // an error occurred
            console.log("ERROR de ----------------> myWs",evt.data);
            connectionErrors++;
            if(connectionErrors == maxAttempts) {
                store.dispatch(appServerIsDown(true))
            }
        };
        myWs.onmessage = (evt) => {
           // console.log("WWW onmessage ----------------> myWs",evt.data);
            if(evt?.data) {
                if(evt.data.indexOf("code=") == -1) {
                    //console.log("y a pas de code")
                    connectionErrors = 0;
                }
            }
            recieve_message(evt);
           
        };

        myWs.onclose = (evt) => {
            console.log("une fermeture de ----------------> myWs",evt);
            myWs = null
            tryReconnect();
        }
   
}

const tryReconnect = () => {
    const isLogged = (store.getState().user?.loggedIn);
    const isInternetReachable = (store.getState().network?.isInternetReachable)
    //const isTester = useSelector(state => state.user.isTester);
    console.log("try reconnect connectionErrors >",connectionErrors)
    if(isLogged && isInternetReachable && connectionErrors < maxAttempts)restartWebsocket();
}


const killSocket = () => {
    console.log("socket Killed",myWs)
    myWs.close();
}




// Define the functions that will expose that state
const websocketManager = {

    startSocket : (sessionId) => {
        console.log("websocketManager startSocket");
        connectionErrors = 0;
        mySessionId = sessionId;
        initWebSocket(mySessionId)
        console.log("/ websocketManager startSocket")
    },

    reStartSocket : () => {
        restartWebsocket()
    },
    killSocket : () => {
        killSocket();
    }
}



export default websocketManager;