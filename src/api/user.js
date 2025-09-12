import dotProp from 'dot-prop-immutable';
import {omit as lodashOmit,isEmpty as lodashIsEmpty} from 'lodash';
import {sleep} from '_brand/utils/tools';
import * as Durin from './durin';
import * as Dain from './dain';
import {userNickname} from '_actions/user';
import store from '_store';

import websocketManager from '_services/webSocketManager';
import {getUserCredentials,setUserCredentials,deleteSessionId,deleteUserCredentials} from '../services/storage';

import { parseJwt } from './social';


/**
 * 
 * @param {string} [pref] section.name or nothing if nothing return all preferences
 * @returns 
 */
export const getPreferences = async(prefPath) => {
    const response = await Durin.get("preferences");
      const reduceThis = response?.res?.data?.content || []

    const sorted = reduceThis.reduce((r,v,i) => {       
        const datas = v?.resource;
        if(datas == undefined) return r;
        const section = datas?.section ;         
        if(r[section] == undefined) r[section] = {};       
        r[section][datas.name] = datas.value;
        return r
    },{});
   
    if(prefPath) {
        return dotProp.get(sorted,prefPath)
    }
    return sorted
}


const createUserDefinedPreference = async(props) => {
    const {section,name,value} = props; 
    res = await Durin.add("preferences",[{"section":section,"name":name,"value":value}]).catch((err)=> {console.log("add prefs error",err)})
    return res;
}

export const deleteUserDefinedPreferences = async(props) => {   
    const {section,name} = props;
    res = await Durin.removeMultiple([{"section":section,"name":name}],"preferences")
    return res
}


/**
 * 
 * @param {string} name 
 * @param {string} value 
 */
export const setUserDefinedPreferences = async (name,value) => {
    console.log("setUserDefinedPreferences",name,value)
    const namePath = "User."+name
    const exists =  await getPreferences(namePath).catch((err) => console.log("Error in API setUserDefinedPreferences",err));
    console.log("setUserDefinedPreferences exists",exists);
    const params = {"section":"User","name":name,"value":value};
    if(exists == undefined) {
        console.log("so addit")
        const addIt = createUserDefinedPreference(params).catch((err) => console.log("createUserDefinedPreference Error",err));
        return addIt;
   } else {
        const updateIt = await Durin.update("preferences",null,[params])
        console.log("setUserDefinedPreferences")//,updateIt)
        return updateIt
   }
    
   // console.log("===============>  Durin.get(\"preferences\")",JSON.stringify(response?.res?.data));
}




//--------------------------------------------------------------

/**
 * 
 * @param {array} params an array of objects {"section": ,"name": ,"value":}
 * @returns 
 */
export const updatePreference = async (params) => {  
   
    console.log("durin updatePreference ABB",params)
    
    // params is Third argument so 2nd argument must exists so => 2nd arg =  null
    res = await Durin.update("preferences",null,params).catch((err)=> {console.log("error updatePref",params,err)});   
    //console.log("durin updatePreference res",res);
    
    return res;
    
}
//--------------------------------------------------------------
export const updateLanguage = (lang) => {
    //const changeLang = updatePreference('Locale','language',lang);  
    const changeLang = updatePreference([{"section":"Locale","name":"language","value":lang}])  
    return changeLang
}
//--------------------------------------------------------------
export const updateCountry = (country) => {
    const changeCountry = updatePreference([{"section":"Locale","name":"country","value":country}]);   
    return changeCountry
}
//--------------------------------------------------------------
export const updateName = async (params) => {

    const {newName,login} = params
    console.log("updateName =>",params)
    const result = await updateUserName(login,newName);
    console.log("updateName", result);

    return result;
    /* v1 
    console.log("---- updateName ----("+newName+")")
    const changeName = updatePreference([{"section":"User","name":"name","value":newName}]);  
    return changeName;
    */
}

export const updatePassword = async (oldPassword,newPassword) => {
    //done in API main file
}


//---------------------------------------------------------------
const pinPath = "User.google_pin";

export const getGoogleHomePin = async () => {   
    const pin = await getPreferences(pinPath).catch((err) => console.log("Error in API getGoogleHomePin",err));
    return pin 
}

export const updateGoogleHomePin = async(value) => {
   
   const currentValue = await getGoogleHomePin();
   const splitted = pinPath.split(".");
   const params = {"section":splitted[0],"name":splitted[1],"value":value};
    console.log("updateGoogleHomePin method",params,currentValue)
   if(currentValue == undefined) {    
        const addIt = createUserDefinedPreference(params).catch((err) => console.log("createUserDefinedPreference Error",err));
    return addIt;
   } else {
        const updateIt = await Durin.update("preferences",null,[params])
        console.log("updateGoogleHomePin update",updateIt)
   }   
}

//--------------------------------------

const scheduleRatinPath= "User.schedule_rating";
const setOnceParams = ["installDate"]

export const getRatingSchedule = async () => {

    const res = await getPreferences(scheduleRatinPath).catch((err) => console.log("Error in API getRatingSchedule",err));
    console.log("XXX getRatingSchedule",)
    const toReturn = JSON.parse(res || "{}")
    return toReturn;
    
}
/**
 * 
 * @param {object} value 
 * @returns 
 */
export const setRatingSchedule = async (value) => {
   // console.log("setRatingSchedule =>",value)
    const currentValue = await getRatingSchedule();
    const splitted = scheduleRatinPath.split(".");
    let params = {"section":splitted[0],"name":splitted[1]};
    console.log("setRatingSchedule method",params,currentValue);

    let newValue = {};
    if(lodashIsEmpty(currentValue)) {  
          newValue = {...value,"installDate":Date.now()}
        console.log("so create a preference")
         const addIt = createUserDefinedPreference({...params,value:JSON.stringify(newValue)}).catch((err) => console.log("createUserDefinedPreference Error",err));
     return addIt;
    } else {
        newValue = {...currentValue,...lodashOmit(value,setOnceParams)}

        console.log("so update a pref => ",currentValue,newValue)
         const updateIt = await Durin.update("preferences",null,[{...params,value:JSON.stringify(newValue)}])
        // console.log("updateIt",updateIt)
    }
}

/**
 * 
 * @param {boolean} consent 
 */
export const updateAssAccess = async(consent) => {
    console.log("in API updateAssAccess",consent)
    const params = {"consent":consent};
    const updateIt = await Durin.update("ass/authorization",null,params).catch((err) => {console.log("Err Ass :",err)});
    console.log("update assAccess");//,updateIt);
}


export const getUserInfos = async() => {
    const dainResponse = await Dain.get('login');  
    //console.log("getUserInfos",JSON.stringify(dainResponse))  
    const token = dainResponse?.res?.data?.token;
   // console.log("getUserInfos =====> token ======>",parseJwt(token))
    //console.log(token)
    return dainResponse
}

/**
 * 
 * @param {object} props 
 * @param {string} props.login 
 * @param {string} props.password 
 */
export const deleteAccount = async(props) => {
    
   
    const {login,password} = props;
    const params = {...props,'action':"destroy"};
    console.log("deleteAccount params",params);
    websocketManager.killSocket();
    await sleep(1000);
    const dainResponse = await Dain.post('setup',params);
    console.log("----> deleteAccount ",JSON.stringify(dainResponse))
    
    if(dainResponse.errCode == 200) {
        await deleteUserCredentials();
        await deleteSessionId();
       
    }
    
    return dainResponse

}

/**
 * 
 * @param {object} props 
 * @param {string} props.login 
 * @param {string} props.password 
 */
export const askDeleteAccountCode = async(props) => {
    
   
    const params = {'action':"destroy"};
    console.log("deleteAccount params",params)
    const dainResponse = await Dain.post('setup',params);
    //console.log("----> askDeleteAccountCode ",JSON.stringify(dainResponse))
    
    if(dainResponse.errCode == 200) {
        //deleteUserCredentials();
    }
    
    return dainResponse

}








/**
 * return subscriptions checkout and account endPoints urls
 * @returns {Promise}
 */
export const getPayments = async() => {
    console.log("user getPayments")
    const response = await Durin.get("payments");
    let datas = response?.res?.data?.resource
   console.log("getPayments =>",JSON.stringify(datas))
   // const data = response?.res?.data?.content;
    console.log(datas)
    // TODO process result
    const result = datas || {}
    //return an object with endPoints urls

    return result
}

/**
 * 
 * @param {string} login 
 * @param {string} newName 
 * @returns 
 */
 const updateUserName = async(login, newName) =>{

    console.log("*** updateUserName",login,newName)

   
    const dainResponse = await Dain.post('setup', { 'login': login, 'userName': newName, 'action': "update_username" });
  
    console.log("CHECK_USER_NAME :", dainResponse)
    if (dainResponse.errCode == 200) {
  
      return Promise.resolve({ errCode: dainResponse.res.status });
    } else {
      // error
      return Promise.reject({ errCode: dainResponse.res.status });
    }
   
  }


  export const askCode = async(login) => {
    console.log("*** askCode",login)

   
    const dainResponse = await Dain.post('setup', { 'login': login, 'action': "forgot_password_get_code" });
  
    console.log("askCode :", dainResponse)
    if (dainResponse.errCode == 200) {
  
      return Promise.resolve({ errCode: dainResponse.res.status });
    } else {
      // error
      return Promise.reject({ errCode: dainResponse.res.status });
    }
  }


  export const updateLogin = async (params) => {

    let dainResponse;
   // {"login": "<user_login>","action":"update_email_get_code", "newLogin": "<new_user_login>"}
  
    const sentParams = {...params,'action':"update_email_get_code"}
    console.log("sentParams",sentParams)
    // ask for code  
   if(!params.userCode) {
    dainResponse = await Dain.post('setup',sentParams);
   }

   return dainResponse
  }
  
  
  
  /**
  * works in both context recover and forgot on login
  * @param {string} userId 
  * @param {string} userCode  
  * @returns 
  */
 async function updatePassword2(params){
 
     // v1 request const dainResponse = await Dain.post('setup',{'login':userId,'newPassword':newPassword,'action':"update"});
 
   let dainResponse;
 
   // as for password, values are filtered and code is turned into userCode as mandatory argument for the api
   if(params.userCode) {
     dainResponse = await Dain.post('setup',{...params,'action':"validate_password"});
   }
   // be careful form values have been filtered and oldPassword if exists becal password in order to comply with the Api
   if(params.password) {
     dainResponse = await Dain.post('setup',{...params,'action':"update_password"});
   }
 
   const {login,newPassword} = params;
 
   // Update credentials
   if(dainResponse.errCode == 200) {
    
     let sc = await setUserCredentials(login, newPassword);   
     return Promise.resolve({errCode:dainResponse.res.status});       
   } else {
     // error
     console.log('dainResponse In API ERROR',dainResponse)
     return Promise.reject(dainResponse); 
   }
 }




 export const getUserDetails = async()=>{

  const response = await Durin.get("userInfo");
  console.log("USER_DATAS HH :", response)

  if(response?.errCode == 200){
      console.log("USER_DATAS HH :", response)
      const userName = response?.res?.data?.resource?.name
      const action =  userNickname(userName)
      store.dispatch(action)  
  }

}