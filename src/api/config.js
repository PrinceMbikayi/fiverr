import * as axios from 'axios';
import * as Durin from './durin';

import apiVersions from "_brand/config/apiVersions.json";

import {AppConfig} from '../config';
import {getServer as getStoredServer} from '_services/storage';


export const getConfigFromServer = async() => {

  
    const params =  {}
  
    //const url = await getDurinUrl() + 'my/files/'+id+"?all"
    //const url = "http://localhost:3000/test";
    //const url = "http://192.168.1.81:3000/test";

    let url = await getStoredServer() || AppConfig.SERVER_URL;
    url += "/download/distantConfig.json";


    //console.log("getConfigFromServer url",url)




    let errCode = 200;
   
  
    try {
        let res = await axios.get(url,params); /* !! timeout */
       // console.log("getConfigFromServer",res)
        
        if(res.status == 200) {    
            //console.log("Resultat obtenu",res);        
            return Promise.resolve({errCode:res?.status,res:res?.data});       
        } else {
            //
        }
        return (res.status == 200);
  
        } catch(error) {
        
           // console.log("error",error,error.response)
            if (error.response == undefined) {
                // network error
                errCode = -1;
            } else {
                // http status code
                errCode = error.response.status               
            }
        
            let result =  {errCode:errCode}
           // console.log("result",result)
            return Promise.resolve(result);      
    }
  }

  export const appendVersion = (apiName,endpoint) => {


    console.log("********************",apiVersions);
   
    const versionToAppend = apiVersions[apiName+"_"+endpoint]
    if(!versionToAppend) return "";
    console.log("********************",versionToAppend);
    return versionToAppend+"/"
  }