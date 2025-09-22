import axios from 'axios';
import store from '../store';


axios.interceptors.request.use(

  (config) => {
    const token = store.getState().user.s2_token;
    //let token;
    console.log('HAA_ME_TOKEN :', token);
        // -- add below
        const endEndPoint = config.url.split('/').pop();
        const method = config.method;
     
        if(method == "post" && endEndPoint == "login"){
          return config;
        }
     
        // ----- end
    //console.log("AAAAA ",JSON.stringify(store.getState().user)," AAAAA")
    if (token == undefined || token == ""){
      return config;
    } else{
      config.headers.Authorization = "Bearer " + token;
      return config;
    }
      
    //console.log("config",config)
    // if (config.data?.login == undefined) {
    //   config.headers.Authorization = "Bearer " + token;
    // }
    //   //config.headers.Authorization = "Bearer " + token;

    // return config;

  },
  (error) => {
    return Promise.reject(error)
  }
)

import { getServer as getStoredServer } from '_services/storage';
import { AppConfig } from '../config';
import { appendVersion } from './config';

const timeoutDuration = 30 * 1000;

const paths = {
  'recover': 'my/objects'
}

/**
 * 
 * @param {login|recover} typePath 
 * @param {Object} infos Object
 */

const getServerUrl = async () => {

  const serverUrl = await getStoredServer() || AppConfig.SERVER_URL
  return serverUrl;

}


async function post(typePath, userInfos) {

  console.log('DAINPOOOOO');
  const serverUrl = await getServerUrl();
  console.log('GET_SERVER_URL :', getServerUrl);

  let infos = userInfos
  const url = serverUrl + '/services/dain/'+appendVersion("dain", typePath)+typePath;
  console.log("DAIN url",url,infos)
  let obj = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    timeout: timeoutDuration,
    body: JSON.stringify(infos)
  }

  let errCode = 200;
  let errMsg;
  try {
    let res = await axios.post(url, infos, { timeout: timeoutDuration });

    if (res.status == 200) {

      return Promise.resolve({ errCode: res.status, 'res': res });
    } else {

    }
    return (res.status == 200);

  } catch (error) {

    console.log("Error in DAIN", error)

    let result;
    if (error.response == undefined) {

      errCode = -1;
      errMsg = "undefined error";

      if (error.toString().indexOf('timeout') != -1) {
        errCode = 504;
        errMessage = "request timeout";
      }

      result = { 'errCode': errCode, 'errMsg': errMsg }
    } else {
      console.log('error.response', error.response)
      errCode = error.response.status;
      result = { 'errCode': errCode, 'errMsg': error.response.data.error.msgKey }
    }

    console.log('DAIN POST result', result)

    return Promise.resolve(result);
  }
}



export { post };

