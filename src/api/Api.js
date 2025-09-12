import * as axios from 'axios';
import store from '../store';
import { AppConfig } from '../config';

import { USER_LOGGED_IN, USER_LOGGED_OUT, USER_UPDATE, loginError, userSetIsTester, userUpdate } from '../actions/user';
import { ROOMS_FILL } from '../actions/rooms';
import { Normalise } from '../helpers/normalise';
import * as ActionsTypes from '../actions/objectTypes';

import { getUserCredentials, setUserCredentials, deleteUserCredentials, getIsTester } from '../services/storage';
import { getServer, getSessionId, setIsTester as storeIsTester } from '_services/storage';
import { getObjects } from './objects';
import { Ws } from '../ws';

import * as Durin from './durin';
import * as Dain from './dain';

import DeviceInfo from 'react-native-device-info';
import { initPushNotifications } from '_services/pushNotifications/myPushNotifications';
import notificationPushManager from '_services/pushNotifications/pushNotificationManager';
import websocketManager from '_services/webSocketManager';

import { logWithGoogle, signOutGoogle } from './social'
import { logWithApple } from './social'

const paramsToString = params => Object.entries(params).reduce((acc, [key, value], index, array) => `${acc}${key}=${encodeURIComponent(value)}${index !== (array.length - 1) ? '&' : ''}`, "");

const getDurinUrl = async () => {
  return await getServer() + '/services/durin/'
}

/**
 * 
 * @param {*} tokenValue 
 * @param {google | apple | facebook} tokenIssuer 
 */
async function socialLogin(tokenValue, tokenIssuer) {
  const resp = await login(null, null, null, { 'tokenValue': tokenValue, 'tokenIssuer': tokenIssuer })
  return resp;
}

const getDeviceInfos = () => {
  const uniqueId = DeviceInfo.getUniqueId();
  //console.log("------->>> uniqueId",uniqueId)
  const deviceType = DeviceInfo.getDeviceId();
  const systemName = DeviceInfo.getSystemName();
  const deviceOS = (systemName == 'iOS') ? 'IOS' : systemName;

  return { 'deviceID': uniqueId, 'deviceOS': deviceOS, 'deviceType': deviceType };

}


async function login(userId, password, userCode, socialLoginInfos) {

  let extraSocial = socialLoginInfos;

  //console.log("**",userId,password,userCode,extraSocial)

  if (userId == 'google') {
    // console.log("so log with google !!!")    
    const tSocial = await logWithGoogle()
    //console.log("tSocial",tSocial);
    extraSocial = tSocial;

  }
  if (userId == 'apple') {
    // console.log("so log with apple !!!")    
    const tSocial = await logWithApple()
    //console.log("tSocial from apple",tSocial);
    extraSocial = tSocial;

  }


  // console.log("in login extraSocial > ",extraSocial);
  //return false;


  //const extraInfos = await initPushNotifications();
  let extraInfos = getDeviceInfos();
  const FcmToken = await notificationPushManager.getFCMToken();
  console.log("get FcmToken !!!! ", FcmToken)
  if (FcmToken) {
    extraInfos['deviceToken'] = FcmToken;
  }

  let loginInfos = {};
  if (userCode == undefined) {
    //console.log("API.login :->",userId,password)
    if (extraSocial || userId == 'google' || userId == 'apple') {
      loginInfos = { 'stayConnected': "on", ...extraInfos, ...extraSocial }
    } else {
      loginInfos = { 'login': userId, 'password': password, 'stayConnected': "on", ...extraInfos }
    }
  } else {
    loginInfos = { 'login': userId, 'userCode': userCode, 'stayConnected': "on" }
  }

  /*
  console.log("==================================");
  console.log("loginInfos",loginInfos)
  console.log("==================================");
  */

  if (userId == undefined && extraSocial == {}) return Promise.reject({ 'errCode': -2 });

  store.dispatch({ type: ActionsTypes.OBJECTS_RELOAD, payload: { 'status': true } });

  const loginProcess = await Dain.post('login', loginInfos);
  //console.log("loginProcess",loginProcess);  
  store.dispatch({ type: ActionsTypes.OBJECTS_RELOAD, payload: { 'status': false } })

  if (loginProcess.errCode == 200) {

    const sessionid = loginProcess.res.headers['x-dain-sessionid'];
    const server2Token = loginProcess?.res?.data?.token;
    // console.log("server2Token server2Token server2Token =====",server2Token);
    // console.log("sessionid sessionid sessionid =====",sessionid);
    // console.log("--------------------------")
    let sc = await setUserCredentials(userId, password, server2Token || sessionid);
    let isTester = await getIsTester();
    //console.log("isTester---->>> ",isTester)
    store.dispatch(userSetIsTester(isTester))
    store.dispatch({ type: USER_LOGGED_IN, payload: { loggedIn: true, email: userId, access_token: sessionid, s2_token: server2Token } });

    const giveToSocket = server2Token || sessionid

    //remettre
    startWs(giveToSocket);

    return Promise.resolve({ 'errCode': loginProcess.res.status, 'sessionid': sessionid });
  } else {
    //console.log("error",loginProcess.errCode,loginProcess)
    return Promise.reject({ 'errCode': loginProcess.errCode, 'errMsg': loginProcess.errMsg });
  }
}


async function loginRecoverAccount(userId, password, userCode, gwkey) {
  console.log('WWW :',userId, password, userCode, gwkey);

  let extraInfos = getDeviceInfos();
  const FcmToken = await notificationPushManager.getFCMToken();
  console.log("get FcmToken !!!! ", FcmToken)
  if (FcmToken) {
    extraInfos['deviceToken'] = FcmToken;
  }

  const loginInfos = { 'gwKey': gwkey, 'userCode': userCode}


  if (userId == undefined) return Promise.reject({ 'errCode': -2 });

  store.dispatch({ type: ActionsTypes.OBJECTS_RELOAD, payload: { 'status': true } });

  const  loginProcess = await Dain.post('v2/login', loginInfos);

  //console.log("loginProcess",loginProcess);  
  store.dispatch({ type: ActionsTypes.OBJECTS_RELOAD, payload: { 'status': false } })

  if (loginProcess.errCode == 200) {

    const sessionid = loginProcess.res.headers['x-dain-sessionid'];
    const server2Token = loginProcess?.res?.data?.token;
    let sc = await setUserCredentials(userId, password, server2Token || sessionid);
    let isTester = await getIsTester();
    //console.log("isTester---->>> ",isTester)
    store.dispatch(userSetIsTester(isTester))
    store.dispatch({ type: USER_LOGGED_IN, payload: { loggedIn: true, email: userId, access_token: sessionid, s2_token: server2Token } });

    const giveToSocket = server2Token || sessionid

    //remettre
    startWs(giveToSocket);

    return Promise.resolve({ 'errCode': loginProcess.res.status, 'sessionid': sessionid });
  } else {
    //console.log("error",loginProcess.errCode,loginProcess)
    return Promise.reject({ 'errCode': loginProcess.errCode, 'errMsg': loginProcess.errMsg });
  }
}


async function logout(doNotDelete) {

  const dainResponse = await Dain.post('logout', {});

  store.dispatch({ type: USER_LOGGED_OUT, payload: { loggedIn: false, email: 'aa@aa.aa' } });
  store.dispatch(userSetIsTester(false))
  storeIsTester(false)
  if (doNotDelete != true) deleteUserCredentials();

  signOutGoogle();

  if (dainResponse.errCode == 200) {
    /*
    store.dispatch({type:USER_LOGGED_OUT,payload:{loggedIn:false,email:'aa@aa.aa'}});
    store.dispatch(userSetIsTester(false))
    storeIsTester(false)
    if(doNotDelete != true)deleteUserCredentials();   
    */
    return Promise.resolve({ errCode: dainResponse.res.status });
  } else {
    // error
    return Promise.resolve({ errCode: dainResponse.res.status });
  }
}


async function setPushToken(token, UDID) {
  const url = AppConfig.SERVER_URL + '/m?a=setPushToken';
  const infos = {
    token: token,
    UDID: UDID,
    a: 'setPushToken'
  }

  let infosToBody = paramsToString(infos);
  let obj = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: infosToBody

  };
  let res = await fetch(url, obj);
  //console.log("SET PUSH TOKEN",res)

}

async function startWs(sessionId) {
  if (sessionId) {
    //Ws.startMe(access_token);
    websocketManager.startSocket(sessionId)

  } else {
    getSessionId().then(function (res) {
      //Ws.startMe(res);
      websocketManager.startSocket(res)

    });
  }
}
async function closeWs() {
  //Ws.closeMe();
}



async function checkUserIsGranted(){

 
  // avoid call to server (loop) if app backToFront
  // if noCredentials
  let credentials = await getUserCredentials(store);
  console.log("[checkUserIsGranted] First Test for credentials")//;,credentials)
  if(credentials.error != undefined) {
    
    return new Promise.reject({errCode:-12,errMessage:credentials.error})
    return false;
  }
  
  
    try {
      
     
  
       // let res = await  getRooms();
        let res = await getObjects();
  
        console.log("*************  in Granted getObjects Return check more  ******************",res);
  
  
        console.log("****************************************************************")
  
        console.log("in Granted getObjects Return check more")//,res);
        if(res.status == 200 || res.errCode == 200) {
        
          
          const credentials = await getUserCredentials(store);
          const newSessionId = res.sessionid;
          const server2Token = res?.data?.token;
  
  
          const giveToSocket = server2Token || newSessionId
          startWs(giveToSocket); 
          
          const {tEmail,tLoggedIn} = store.getState().user;
          
  
  
          console.log("[checkUserIsGranted] is granted OK => userEmail",tEmail,"user loggedIn",tLoggedIn)
          if(tEmail == "" || tEmail==undefined) {
            await addUserInfos(credentials  );
          }
          // ======= if social login ========
          store.dispatch({type:USER_LOGGED_IN,payload:{loggedIn:true,email:credentials.login}});
         
        } else {
          console.log("si affiché erreur - passe dans le catch normalement")
         throw({"errCode":res.errCode})
        }
        return (res.status == 200 || res.errCode == 200);
  
      } catch(error) {
  
          console.log(" in Granted error=>",error,error.code,error.response);
        // Auth Cookie is expired
        // Or Login / Password is no longer correct
        //console.log(" in Granted error.response=>",error.response);
  
        const testRelogNeeded = (errCode) => {
          const errCodes = ['401','400']
          return (errCodes.indexOf(errCode.toString()) != -1)
        }
  
        if(error.errCode) {
  
          if(testRelogNeeded(error.errCode)){
            console.log("testRelog(error.errCode)",testRelogNeeded(error.errCode))
            const credentials = await getUserCredentials(store);
            console.log(" testRelogNeeded ----> credentials 401 more more",credentials);
            let relog;
            try {
              // regular login email / password
              if(credentials["tokenIssuer"] == undefined) {
                console.log("before relog !!!!!")
                relog = await login(credentials.login,credentials.password);
                console.log("after relog !!!!!")
              }
              /*
              // a social login
              if(credentials["tokenIssuer"]) {
                const addSocial = {tokenIssuer:credentials?.tokenIssuer,tokenValue:credentials.tokenValue};
  
                relog = await login(credentials.login,credentials.password,null,addSocial).catch((err)=>console.log("tokenIssuer %%",err));
               
                console.log("################## relog needed and its social",relog)
              
                if(credentials.tokenIssuer == "google") {
                  let authWithGoogle;
                  console.log("tokenIssuer is Google");                
                  authWithGoogle = await googleAuth();
                  console.log("soooooooo try to relog wth Google !!! and token is no more available !!!!",authWithGoogle) 
                  
                  if(authWithGoogle) {
                    await addUserInfos(credentials)
                    relog = {errCode:200}
                  }               
                }            
              }
              */    
             console.log("XXXXXXX relog XXXXXXXXX",relog)               
           
              const granted = (relog?.errCode == 200)
              if(granted) {
                console.log("c'est ok la variable de session était expirée, mais les credentials sont corrects");
  
                store.dispatch({type:USER_LOGGED_IN,payload:{loggedIn:true,email:credentials.login}});
                startWs()
                return true;
  
              } else {
                //force error legacy
                //return {errCode:401}
  
                // because err could be invalid Token and it's process later
                // so don't force errCode to 401
  
                return {errCode: error.errCode}
               
              }
             
  
  
            } catch (error) {
              console.log("error credentials +++",error)
              if(testRelogNeeded(error.errCode)) {
                console.log("ben erreur c'est sûr")
                return {errCode : error.errCode}
               
               // previously return {errCode:401}
              }
            }
           
          }
        }
  
         else {
          if(error == "Error: Network Error") {
            return 'checkNetwork';
          }
          console.log("what a mess");
          return {errCode:401}
          return false;
        }
      }
  }

//======================= register ===========================

async function register(userId, password, userNameArg, gatewayName) {

  const userName = userNameArg || 'Michael Palin';
  //console.log("Api.register",userId,password,userNameArg)  
  const registerInfos = { 'login': userId, 'password': password, 'userName': userName }
  //console.log("registerInfos",registerInfos)

  /* même en cas d'error c'est un resolve qui est envoyé avec un key errCode */
  try {

    const registerProcess = await Dain.post('register', registerInfos);

    if(registerProcess.errCode ==200){
      const nickname = userName;
      let sc = await setUserCredentials(userId, nickname);
    }
    //console.log("accepté mais quand même",registerProcess)  
    return Promise.resolve(registerProcess)
  } catch (err) {
    //console.log("err register",err);
    return Promise.resolve({ ...err, errHelp: 'erreur générique' });
  }


}
async function confirmRegister(userId, userCode, password) {

  //console.log("Api.confirmRegister"); 
  try {

    let dainResponse = await login(userId, password, userCode);
    let sc = await setUserCredentials(userId, password);
    return Promise.resolve({ 'errCode': 200 })
  } catch (err) {
    // catches errors both in fetch and response.json
    //console.log(err);
    return Promise.resolve({ ...err, errHelp: 'erreur générique' });
  }
}

//====================== Harold : Recover Credentials vis box Id ===========
async function recoverCredentials(newLogin, newPassword, gwKey) {

  const recoverInfos = { 'newLogin': newLogin, 'newPassword': newPassword, 'gwKey': gwKey }
  console.log("RECOVER_INFOS :",recoverInfos)
  try {

    const recoverProcess = await Dain.post('v2/recover', recoverInfos);
    // if(recoverProcess.errCode ==200){
    //   const nickname = userName;
    //   let sc = await setUserCredentials(newLogin, nickname);
    // }
    console.log("RECOVER_INFOS_SERVER_RESPONSE : ",recoverProcess)  
    return Promise.resolve(recoverProcess)
  } catch (err) {
    //console.log("err recover",err);
    return Promise.resolve({ ...err, errHelp: 'erreur générique' });
  }

}

async function confirmRecoverCredentials(newLogin, userCode, newPassword, gwKey) {

  let socialLoginInfos;
  console.log("Api.confirmRegister :", newLogin, userCode, newPassword,socialLoginInfos, gwKey); 
  // let dainResponse = await login(newLogin, newPassword, userCode,socialLoginInfos, gwKey);

  // console.log("dainResponse :", dainResponse); 
  try {

    let dainResponse = await loginRecoverAccount(newLogin, newPassword, userCode, gwKey);

    console.log("dainResponse :", dainResponse); 
    let sc = await setUserCredentials(newLogin, newPassword);
    return Promise.resolve({ 'errCode': 200 })
  } catch (err) {
    // catches errors both in fetch and response.json
    //console.log(err);
    return Promise.resolve({ ...err, errHelp: 'erreur générique' });
  }
}

//======================= recoverPassword ===========================
async function recoverPassword(userId) {

  return Dain.post('recover', { 'login': userId, 'userCheck': true, 'userName': '' })
}

async function recoverPasswordViaAccount(userId) {

  return Dain.post('setup', { 'login': userId, 'action':'forgot_password_get_code' })
}

async function reinitPasswordViaAccount(userId, userCode, newPassword) {
  console.log("in API.reinitPassword",userId,userCode,newPassword)
  const dainResponse = await Dain.post('setup', { 'login': userId, 'newPassword': newPassword, 'action': "validate_password", 'userCode':userCode });
  console.log('reinitPasswordViaAccount :', dainResponse);
  if (dainResponse.errCode == 200) {

    let sc = await setUserCredentials(userId, newPassword);
    return Promise.resolve({ errCode: dainResponse.res.status, errMsg:dainResponse.res.statusText });
  } else {
    // error
    return dainResponse //Promise.reject({ errCode: dainResponse.res.status, errMsg:dainResponse.res.statusText });
  }
}

async function reinitPassword(userId, userCode, newPassword) {
  //console.log("in API.reinitPassword",userId,userCode,newPassword)
  try {

    let loginWithCode = await login(userId, newPassword, userCode).catch(err => { console.log("login reject", err); return Promise.reject(err) });
    console.log('LOGIN_WITH_CODE :', loginWithCode);
    let updatePasswordRequest = await updatePassword(userId, newPassword)
    return Promise.resolve({ 'errCode': 200 })
  } catch (err) {
    // catches errors both in fetch and response.json
    //console.log("reinitPassword err.errCode",err.errCode);
    return Promise.resolve({ ...err, errHelp: 'erreur générique' });
  }

}
//======================= End recoverPassword ===========================

/**
 * 
 * @param {string} userId 
 * @param {string} password 
 * @returns 
 */
async function updatePassword(userId, newPassword) {

  console.log('PASSWORD_CREDENTIAL :', userId, newPassword);

  const dainResponse = await Dain.post('setup', { 'login': userId, 'newPassword': newPassword, 'action': "update_password" });
  console.log('DAIN_RESPONSE :',  JSON.stringify(dainResponse));

  if (dainResponse.errCode == 200) {

    let sc = await setUserCredentials(userId, newPassword);
    return Promise.resolve({ errCode: dainResponse.res.status });
  } else {
    // error
    return Promise.reject({ errCode: dainResponse.res.status });
  }
}

/**
 * 
 * @param {string} userId 
 * @param {string} password 
 * @param {string} newPassword 
 * @returns 
 */
async function updatePasswordProfalux(userId, password, newPassword) {

  const dainResponse = await Dain.post('setup', { 'login': userId, 'password': password, 'newPassword': newPassword, 'action': "update_password" });

  console.log("CHECK_USER_NAME :", dainResponse)
  if (dainResponse.errCode == 200) {

    let sc = await setUserCredentials(userId, newPassword);
    return Promise.resolve({ errCode: dainResponse.res.status });
  } else {
    // error
    return Promise.reject({ errCode: dainResponse.res.status });
  }
}

/**
 * 
 * @param {string} userId 
 * @param {string} newLogin
 * @returns 
 */
async function updateLogin(userId, newLogin, action) {

    const dainResponse = await Dain.post('setup', { 'login': userId, 'newLogin': newLogin, 'action': action });

  console.log("CHECK_UPDATE_LOGIN :", dainResponse)
  if (dainResponse.errCode == 200) {

    //let sc = await setUserCredentials(userId, newPassword);
    return Promise.resolve({ errCode: dainResponse.res.status });
  } else {
    // error
    return dainResponse//Promise.reject({ errCode: dainResponse.res.status });
  }
}


/**
 * 
 * @param {string} userId 
 * @param {string} newLogin
 * @param {string} userCode
 * @returns 
 */
async function confirmUpdateLogin(userId, newLogin, userCode) {
  const dainResponse = await Dain.post('setup', { 'login': userId, 'newLogin': newLogin, 'userCode':userCode, 'action': "validate_email" });

  console.log("CHECK_UPDATE_LOGIN :", dainResponse)
  if (dainResponse.errCode == 200) {

    const credentials = await getUserCredentials();
    console.log('CREDENTIALS_CONFIRM :', credentials);
    const {password} = credentials
    
    const sessionid = dainResponse.res.headers['x-dain-sessionid'];
    const server2Token = dainResponse?.res?.data?.token;

    console.log('CREDENTIALS_INFOS :', newLogin, password, server2Token, sessionid );
    let sc = await setUserCredentials(newLogin, password, server2Token || sessionid)
    const credentials2 = await getUserCredentials();
    console.log('CREDENTIALS_CONFIRM 2:', credentials2);
    //store.dispatch(userUpdate(newLogin))
    //console.log('SC', sc);    

    //store.dispatch({ type: USER_UPDATE, payload: {email: newLogin } });
    return dainResponse
  } else {
    // error
    return dainResponse
  }
  
}


/**
 * 
 * @param {string} userId 
 * @param {string} name 
 * @returns 
 */
async function updateUserName(userId, name) {

  const dainResponse = await Dain.post('setup', { 'login': userId, 'userName': name, 'action': "update_username" });

  console.log("CHECK_USER_NAME :", dainResponse)
  if (dainResponse.errCode == 200) {

    return Promise.resolve({ errCode: dainResponse.res.status });
  } else {
    // error
    return Promise.reject({ errCode: dainResponse.res.status });
  }
}




//==========================================================
/**
 * 
 * @param {string} type
 * @param {string} name 
 * @param {object} statuses 
 */
async function createEntry(type, name, statuses) {

  const url = AppConfig.SERVER_URL + '/services/dain/register'
  let entityType = ""
  switch (type) {
    case "group":
      entityType = "object"
      break;
  }

  if (entityType == "") return false;

  // objectsUrl,
  const datas = { name: "testo", statuses: {} }
  let res = await axios.post(objectsUrl,);

}

//===============================================================
const getRooms = async () => {

  const roomsSates = {};
  const rewriteRooms = [];
  const roomsUrl = await getDurinUrl() + "my/rooms"
  axios.get(roomsUrl + '?all')
    .then(function (response) {

      const myData = response.data.content;
      for (let room in myData) {
        rewriteRooms.push(myData[room].resource);
      }

      // be careful this call produce rooms AND objects datas
      let normalized = Normalise.normaliseRooms(rewriteRooms);

      if (normalized.rooms) store.dispatch({ type: ROOMS_FILL, payload: { rooms: normalized.rooms } });

    })
    .catch(function (error) {
      console.log("error", error);

    });
}



/**
 * Object ( device ) execute action 
 * @param {number} id 
 * @param {string} actionName 
 * @param {object} params 
 */

export const executeAction = async (id, actionName, params) => {
  const actionBlock = (params == undefined) ? { name: actionName } : { name: actionName, ...params }
  const actions = { actions: [actionBlock] };
  console.log("executeActions actions", actions)
  res = await Durin.update("object", id, actions)
  //console.log("new Execute",res);
  return res;
}

//Add by Harold---------
/**
 * Object ( device ) add statuses 
 * @param {number} id 
 * @param {string} statusName 
 * @param {object} params 
 */

// export const addStatus = async (id,actionName, params) => {
//     const paramsBlock = [params];
//     const actions = {statuses:actionName, paramsBlock};
//     console.log("executeActions actions",actions)
//     res = await Durin.update("object",id,actions)
//     //console.log("new Execute",res);
//     return res;
// }
export const addStatus = async (id, statusName, value) => {
  const statusBlock = { name: statusName, value: value }
  const actions = { statuses: [statusBlock] };
  console.log("executeActions actions", actions)
  res = await Durin.update("object", id, actions)
  //console.log("new Execute",res);
  return res;
}


export const updateAddedServerStatus = async (id, statusName, value) => {
  const statusBlock = { name: statusName, value: value }
  const actions = { statuses: [statusBlock] };
  res = await Durin.update("object", id, actions)
  //console.log("new Execute",res);
  return res;
}
//---------------------------


export async function executeActionOriginal(id, actionName, params) {

  const actionBlock = (params == undefined) ? { name: actionName } : { name: actionName, ...params }
  const actions = { actions: [actionBlock] };
  //console.log("actions",actions)
  res = await Durin.update("object", id, actions)
  //console.log("new Execute",res);
  return res;

}

async function getStaticFile(filename) {

  const url = AppConfig.SERVER_URL + "/download/" + filename;
  // console.log("getStatic File ",filename);
  // console.log("getStatic File url",url);

  let errCode = 200;

  try {
    let res = await axios.get(url);

    if (res.status == 200) {
      //console.log("Resultat obtenu",res);        
      return Promise.resolve({ errCode: res.status, res: res });
    } else {
      //
    }
    return (res.status == 200);

  } catch (error) {

    console.log("error", error, error.response)
    if (error.response == undefined) {
      // network error
      errCode = -1;
    } else {
      // http status code
      errCode = error.response.status
    }

    let result = { errCode: errCode }
    console.log("result", result)
    return Promise.resolve(result);
  }

}
async function getNetatmoUrl() {

  const currentServer  = await getServer();
 
  const url = currentServer + '/services/durin/server/conf/netatmo'

  let errCode = 200;

  try {
    let res = await axios.post(url);

    if (res.status == 200) {
      //console.log("Resultat obtenu",res);        
      return Promise.resolve({ errCode: res.status, res: res });
    } else {
      //
    }
    return (res.status == 200);

  } catch (error) {

    console.log("error", error, error.response)
    if (error.response == undefined) {
      // network error
      errCode = -1;
    } else {
      // http status code
      errCode = error.response.status
    }

    let result = { errCode: errCode }
    console.log("result", result)
    return Promise.resolve(result);
  }

}




export {
  checkUserIsGranted,
  login,
  logout,
  register,
  confirmRegister,
  socialLogin,
  recoverPassword,
  reinitPassword,
  updatePassword,
  setPushToken,
  getRooms,
  getStaticFile,
  startWs,
  closeWs,
  getNetatmoUrl,
  updateUserName,
  updatePasswordProfalux,
  updateLogin,
  confirmUpdateLogin,
  reinitPasswordViaAccount,
  recoverPasswordViaAccount,
  recoverCredentials,
  confirmRecoverCredentials,
  loginRecoverAccount

};

export * from './objects';
export * from './groups';
export * from './rooms';
export * from './gateways';