import React, {useContext, useState, useEffect, useRef} from 'react';
import { useSelector,useDispatch,useStore } from 'react-redux';



//------------------------------------------------------------
import {Api} from '_api';
import { getUserCredentials,deleteUserCredentials,
   getIsTester as getStoredTesterStatus,
   getStoredTesterOptions,updateStoredTesterOptions  } from '../services/storage';

import {userSetName,userSetAssInProgress,userSetGoogleHomePin,userFillInfos,logout,userSetIsTester,userSetTesterOptions, userSetPref} from '_actions/user';

import {    updateName,deleteAccount,getGoogleHomePin,updateGoogleHomePin as ApiPinUpdate,
            updateAssAccess,getPreferences, setUserDefinedPreferences as ApiSetPref,
            updateUserName,askCode as apiAskCode,
            askDeleteAccountCode,
            updateLogin
         
         } from '_api/user';


import {getObjectById,getObjectsByTypeName, getUserDefaultWeather} from '_helpers/selectors';
import {addDevObjects} from '_actions/asyncActions';
import { refreshObjectAction } from '_actions/asyncActions';


const UserContext = React.createContext();


//---------- PROVIDER ----------------------

export const UserContextProvider = ({children}) => {

   const store = useStore();
   const dispatch = useDispatch();  
   
   const userDefaultWeather = useSelector(state =>getUserDefaultWeather(state)) || -1;

   const [testMe, setTestMe] = useState("oki");
   const userDatas  = useSelector(state => state.user);
   const {loggedIn,id,login,email} = userDatas;
   const [userPrefWeather, setUserPrefWeather] = useState(userDefaultWeather)
   //const [userFavWeather, setUserFavWeather] = useState(userDefaultWeather)
  
   const isTester = useSelector(state => state.user.isTester);
   const testerOptions = useSelector(state => state.user.testerOptions);


   //------ WEATHER --------
   const weatherIds = useSelector(state => getObjectsByTypeName(state,'WeatherSupport'));
   const weatherObject   = useSelector(state => getObjectById(state,weatherIds?.[0])); 


   useEffect(()=> {
      const getUserPreferences = async () => {
          console.log("dans getUserPreference")
          const ret = await getPreferences().catch((err)=> console.log(err));
          console.log("RET USER :", ret.User.defaultWeather)
          const id = ret.User.defaultWeather || -1;
          setUserPrefWeather(id)
          const prefAction  = userSetPref("defaultWeather", id)
          console.log("PREF ACTION :", prefAction)
          dispatch(prefAction);
      }
      getUserPreferences();
  },[]);
  
   const updateUserPrefWeather = async(id) =>{
      const prefAction  = userSetPref("defaultWeather", id)
      console.log("PREF ACTION :", prefAction)
      dispatch(prefAction);
      setUserPrefWeather(id)
      const setPrefRequest = await ApiSetPref("defaultWeather", id)
      console.log('SET_PREF :', setPrefRequest);
      await refreshObjectAction(id,store).catch((err) => console.log(err)); 
   }



   useEffect(()=> {
     console.log('NEW_USER_PREF_WEATHER :', userPrefWeather);
  },[userPrefWeather]);

   useEffect(()=> {
    
  },[userDefaultWeather]);


   //----- ASS -------------
   const assInProgress = useSelector(state => state.user.assInProgress);
   const setAssInProgress = () => {
      //
   }

   const [assCurrentProblem, setAssCurrentProblem] = useState(null);
   useEffect(()=> {
      console.log("so assCurrentProblem is ")
   },[assCurrentProblem]);



   //----- GOOGLE HOME PIN
   const googleHomePinStored = useSelector(state => state.user.googleHomePin); 
   const [googleHomePin, setGoogleHomePin] = useState(googleHomePinStored);

  

   useEffect(()=> {
      console.log("Uuser High loggedIn",loggedIn)
      if(loggedIn == true ) {
         (async()=> {         
            const res = await getGoogleHomePin().catch((err)=> console.log("getGoogleHomePin err",err));  
         // console.log("getGoogleHomePin =>",res)      
            dispatch(userSetGoogleHomePin(res))
            setGoogleHomePin(res)
            //console.log("[useUserHigher] so add  getGoogleHomePin",res)
         })()
      }
   },[loggedIn]);


   useEffect(()=> {
      // redraw
   },[loggedIn,googleHomePin,assInProgress]);


   const updateGoogleHomePin = async(value) => {
      //console.log("updateGoogleHomePin",value)
      await  ApiPinUpdate(value)
    }

   /**
   * 
   * @param {boolean} consent 
   */
   const assAccess = async(consent) => { 
      dispatch(userSetAssInProgress(consent));  
      setAssCurrentProblem(null);
      const toServer = await updateAssAccess(consent).catch((err) =>console.log("updateAssAccess err",err));    
   }

   //=====================================


   const tellStoreLogout = () => {


      const action = logout()
      store.dispatch(action)
      /*
      store.dispatch({type:USER_LOGGED_OUT,payload:{loggedIn:false,email:'aa@aa.aa'}});
      store.dispatch(userSetIsTester(false))
      */
   }

   //-------------------------------------
   const getCredentials = async() => {

      const result = await getUserCredentials(store);     
      return result
     }




   const askDeleteCode = async() => {
      const result =  await askDeleteAccountCode();
     
      return result
   }

   
   /**
    * 
    * @param {object} params
    * @param {string} params.userCode
    * @returns Promise
    */
   const deleteUserAccount = async(params) => {        

     
    
      const result = await deleteAccount (params);
      //const dlc = await deleteUserCredentials(); 
      //tellStoreLogout();

      return result;

      /* v1
      if(login && password) {
         console.log("so delete it ")
          const result = await  deleteAccount({"login":login,"password":password+""}).catch((err)=> {     
            console.log("deleteAccount Error" , err)       
              return Promise.reject(err)  
          });  
          console.log("deleteAccount result",result)
        
          const dlc = await deleteUserCredentials(); 
          console.log("deleteUserCredentials ",dlc)
          tellStoreLogout();
         return result
      }
         */
   }

  const changePassword = async(props) => {

   const {oldPassword,newPassword,code} = props
  
   let params = {...props};
   if(props.oldPassword) {
      params.password = ""+props.oldPassword
   }
   if(props.code) {
      params.userCode = ""+props.code;
   }

   delete params.code;
   delete params.oldPassword;
   delete params.newPasswordConfirm

    //console.log("changePassword ","oldPassword",oldPassword,"newPassword",newPassword,"userDatas",userDatas);   
    // be careful email / login / userId

   const serverParams = {...params,"login":userDatas?.email}

   console.log("serverParams",serverParams)
   
   
    const result = await  Api.updatePassword(serverParams).catch((err)=> {
                console.log("inchangePassword err",err)
                let interceptedError = {...err};

                if(err.errMsg == "invalid_password" && params.userCode) {
                  interceptedError.errMsg = "invalid_code"
                }
                return Promise.reject(interceptedError)               
    });
    return result;
}


const changeLogin = async(params) => {

  

   const result = updateLogin({...params,login:email})
   console.log(params)
   //{"login": "<user_login>","action":"update_email_get_code", "newLogin": "<new_user_login>"}
   console.log('gogogogogog')
   return result;
}





//--------------------------------------------

const setIsTester = () => {
   dispatch(userSetIsTester(true));
}


const fillDevObjects = () => {
   console.log("fill dev Object")
  
   addDevObjects(dispatch)
   return true;
}


const initTesterMode = async () => {
   {
    
      const isTester = await getStoredTesterStatus();     
      if(isTester)setIsTester(true);
      const testerOptions = await getStoredTesterOptions();

      if(testerOptions) {       
         dispatch(userSetTesterOptions(testerOptions))
         if(testerOptions.addDevObjects) {
           // fillDevObjects(); // no there is a conflict 
         }
      } else {
         console.log("no options set")
      }
   }
}

useEffect(()=> {
   initTesterMode();
},[]);




   const addTesterOption = async(optionId) => {
   

   

      const addIt = await updateStoredTesterOptions(optionId);    
      const testerOptions = await getStoredTesterOptions();
     
   

      dispatch(userSetTesterOptions(testerOptions));
    
      switch(optionId) {
         case "addDevObjects" :
            // not here but in getObjects because of reload when app refresh / reload
            //fillDevObjects();
            break;
      }  
      return "ok" 
   }

   const removeTesterOption = async(optionId) => {
  
      const removed = await updateStoredTesterOptions(optionId);
      const testerOptions = await getStoredTesterOptions();
      
      dispatch(userSetTesterOptions(testerOptions));
      switch(optionId) {
         case "addDevObjects" :
            /*
            const devObjectIds = devObjects.reduce((r,v,i)=> {
         r.push(v?.resource?.id)
               return r  
            },[]);               
         
            devObjectIds.map((v,i) => {
               dispatch(objectDelete(v))
            })
               */
            break;
      }
   }

   const updateUserName = async(value) => {   
      console.log(" updateUserName user Hook",value)
      if(value != "") {         
          const result = await updateName({"login":email,"newName":value});
          dispatch(userSetName(value));         
      }     
   }  


   const askCode = async() => {
      // email is equivalent login
     return  apiAskCode(email)
   }





   //+++++++++++++++++++++++++++++++++++++++++++++++++++
   useEffect(()=> {
   
   },[isTester,testMe,testerOptions,assCurrentProblem]);



   const shared = {
      isLoggedIn:userDatas?.loggedIn,
      id:id,  
      userFavorite:userDatas?.favorite,  
      userDefaultWeather:userDatas?.defaultWeather,
      email:userDatas?.email ,
      login:userDatas?.login,
      userName:userDatas?.userName || "",
      socialLoginEmail:userDatas?.socialLoginEmail,
      weatherName:weatherObject?.name || "",
      changePassword,
      changeLogin,
      getCredentials,
      askDeleteCode,
      deleteUserAccount,
      testMe,setTestMe,
      isTester,testerOptions,
      addTesterOption,removeTesterOption,
      assInProgress,setAssInProgress,assAccess,
      assCurrentProblem,setAssCurrentProblem,
      googleHomePin,setGoogleHomePin,updateGoogleHomePin,
      updateUserName, askCode,
      userPrefWeather, updateUserPrefWeather

   }

   return (
      <UserContext.Provider value={shared}>
        {children}
      </UserContext.Provider>
    );
  };

  export const useUser = () => {

   const shared =  useContext(UserContext);
   

   return {...shared}
 };