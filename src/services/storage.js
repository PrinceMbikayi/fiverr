import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
//import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppConfig } from '_config/';
import { Platform } from 'react-native';

/**
 * 
 */
async function getUserCredentials(){


  console.log("GET_CREDENTIALS :")
  //await deleteUserCredentials ()
  const allkeys = await AsyncStorage.getAllKeys();
  
 // console.log("yoyoyoyo allkeys",allkeys);
  // console.log("[storage getUserCredentials token",token)

  if(Platform.OS == "ios") {
    const isFirstTime = await onlyOnceDone(); // means a fresh install
    console.log("[getUserCredentials] isFirstTime",isFirstTime);

    if(isFirstTime) {      
      return {error:'newly installed'}
    }
  }

    const server = await getServer();
    const token = await AsyncStorage.getItem('token');
    // const  sessionidForTest = await AsyncStorage.getItem('sessionid');

    // if(!sessionidForTest)return {error:'fresh installation'}

    try {
        // Retrieve the credentials
          const credentials = await Keychain.getInternetCredentials(server);
          
          if (credentials) {
           //console.log("credentials =>",credentials)
          // console.log("credentials exists")
           
            return {login:credentials.username,password:credentials.password,token:token}
          } else {
           
            const hasSocial = await getSocialCredentials();
          //  console.log("hasSocial",hasSocial)
            
            if(hasSocial) {
              if(hasSocial?.google) return {login:'google','token':token};
              if(hasSocial?.apple) return {login:'apple','token':token}
             
             // return {error:'Social Login Dev in Progress...'}
            }
            return {error:'No credentials stored'}




          }
        } catch (error) {
         
          return {err:'Keychain couldn\'t be accessed!'}

        }
}

async function onlyOnceDone () {
  const onlyOnceValueTest = await AsyncStorage.getItem('onlyOnce');
  
  const firstTime = (onlyOnceValueTest == null);
  console.log("firstTime",firstTime)
  if(firstTime) {
    await deleteUserCredentials();
    await doOnlyOnce(null);
  }
  return (onlyOnceValueTest == null)
}

async function doOnlyOnce (onlyOnceValue) {

 
  if(onlyOnceValue == null){
    return await AsyncStorage.setItem('onlyOnce',"yeah : "+Date.now())
  } else {
    return "ok";
  }

  
}








async function getSocialCredentials() {
  const hasGoogle =  await getSecureStorage('google');
  const hasApple = await getSecureStorage('apple');
  const retVals = {'google':hasGoogle,'apple':hasApple}
  //console.log("retVals",retVals)
   return retVals
}


/**
 * 
 * @param {string} login 
 * @param {string} password 
 */
async function setUserCredentials (userId,password,sessionid){
   
    const server = await getServer();
    // because when using social login ther is no userId
   // console.log("setUserCredentials now!",userId,password,sessionid)
    if(password) {
      await Keychain.setInternetCredentials(server, userId, password)
    }
   


    if(sessionid != undefined)await AsyncStorage.setItem('sessionid',sessionid)
    // if(nickname != undefined)await AsyncStorage.setItem('nickname',nickname)
}

async function deleteUserCredentials () {

    const server = await getServer();
    await Keychain.resetInternetCredentials(server);
    deleteSessionId();
}

const simpleOptions = {
    
  service: 'service',
};
/**
 * 
 * @param {*} key 
 * @param {*} value 
 * @param {*} serviceName 
 * @returns 
 */
async function setSecureSorage (key,value,serviceName) {
 // console.log("setSecureSorage",key,value,serviceName)
  const options = {'service': serviceName};
  const c = await Keychain.setGenericPassword(key, value, options);
 // console.log("setSecureSorage",c)
  return c;
}

async function getSecureStorage (serviceName) {

  //console.log("getSecureStorage for ",serviceName)
  /*
  const result = await Keychain.getAllGenericPasswordServices().catch((err) => console.log("keychain error",err));
  */
 // console.log("result",result)

 // await deleteSecureStorage(serviceName)


  const options = {'service': serviceName};
  const credentials = await Keychain.getGenericPassword(options);

 // console.log("getSecureStorage AAA",options,credentials)

  return credentials
  /*
  console.log("serviceName",serviceName,credentials)
  const credentials2 = await Keychain.getGenericPassword("ma_clef");
  console.log("serviceName",serviceName,credentials2)
  */
}

async function deleteSecureStorage (serviceName) {
  const options = {'service': serviceName};
  resetGenericPassword([{ service }])
}







async function foolUserCredentials() {
    await Keychain.setGenericPassword('john.doe@john.doe','letmein');
}

/**
 * retrieve JsessionId for the old server or Token for the new server
 * @returns string
 */
async function getSessionId() {
  let sessionid = await AsyncStorage.getItem('sessionid');
  return sessionid;
}
async function deleteSessionId() {
  AsyncStorage.removeItem('sessionid');
 
}

//=========== store Graph datas =======================
const graphsKey = "graphs"

async function getGraphs() {
  return AsyncStorage(graphsKey)
}
async function setGraphs(obj) {

}

const deleteGraphs = () => {
  AsyncStorage.removeItem(graphsKey);
}

const getGraph = async(objectId,range) => {
    const graphs = await getGraphs();
    const graph = graphs[objectId] || null;

    if(graphs != undefined) {
      if(graphs[objectId]) {
        /*
        .date < (Date.now()- (5*60*1000))) {
        return Promise()
      }
      */
      }
    }
}
const setGraph = (objectId,rangeDatas) => {

}

//========= SERVER URL =================
async function setServer(serverUrl) {
  //await setSecureSorage("google","now","google");
  //await getSecureStorage()
  console.log('URRRRRLLL :', serverUrl);
  let server = await AsyncStorage.setItem('server',serverUrl);
  // const getSS = await getServer()
  // console.log('SERVER_getSS :', getSS);
  return server;
}

async function getServer() {
  let server = await  AsyncStorage.getItem('server');
  if(server == null)server = AppConfig.SERVER_URL
  //console.log('STORAGE_URRRRRLLL :', server);
  return server;
}

//======== DRAG LISTS =================
async function setOrderedList ( listId,ids) {
  const dataStr = JSON.stringify(ids);
  await AsyncStorage.setItem("OL_"+listId,dataStr)
  return ids;
}
async function getOrderedList (listId) {
  //return []
  const storedStr = await AsyncStorage.getItem("OL_"+listId);
  console.log("stored ID ====> ",storedStr)
  return (storedStr != null) ? JSON.parse(storedStr) : [];
}

//=========  TESTER ====================
async function setIsTester(newState) {
  //const newState = !(await getIsTester());
  let isTester = await AsyncStorage.setItem('isTester',JSON.stringify(newState)); 
  //console.log("je viens de tester isTester",isTester)
  return isTester;
}
async function getIsTester() {
  let isTester = await  AsyncStorage.getItem('isTester');
 // console.log("yo",isTester);
  if(isTester == null)isTester = "false";
  return JSON.parse(isTester);
}

//========= GENERIC KEY ===================
async function setKey(key,value) {
  let storedData = await AsyncStorage.setItem(key,JSON.stringify(value));
  return storedData; 
}
async function getKey(key) {
  console.log("GET KEY STORAGE 0:")
  let storedData = await  AsyncStorage.getItem(key);
  console.log("GET KEY STORAGE 1:", storedData)
  return storedData != null ? JSON.parse(storedData) : null
}

//========= SCHEDULE HEATER ==============

const hsKey = (id) => {
  return 'HeatSched_'+id
}

async function getHeaterSchedule (id) {
 
  return getKey(hsKey(id))
}

async function setHeaterSchedule (id,value) {
  return setKey(hsKey(id),value);
}


/**
 * retrieve user favorite objects from local staorage
 * @returns string
 */
async function getUserFavoriteObjects() {
  let userFav = await AsyncStorage.getItem('@userFav');
  return userFav;
}
async function deleteUserFavoriteObjects() {
  AsyncStorage.removeItem('@userFav');
 
}



export {
    deleteSessionId, deleteUserCredentials, deleteUserFavoriteObjects, foolUserCredentials, getHeaterSchedule, getIsTester, getKey, getOrderedList, getSecureStorage, getServer, getSessionId, getUserCredentials, getUserFavoriteObjects, setHeaterSchedule, setIsTester, setKey, setOrderedList, setSecureSorage, setServer, setUserCredentials
};

