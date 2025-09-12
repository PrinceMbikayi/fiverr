import * as axios from 'axios';

import {AppConfig} from '../config';
import {getServer as getStoredServer} from '_services/storage';


const timeoutDuration = 30*1000;

const paramsToString = params => Object.entries(params).reduce((acc, [key, value], index, array) => `${acc}${key}=${encodeURIComponent(value)}${index !== (array.length - 1) ? '&' : ''}`, "");

const durinUrl = AppConfig.SERVER_URL+'/services/durin/';

const getDurinUrl = async() => {

  let url = await getStoredServer() || AppConfig.SERVER_URL;
  url+='/services/durin/';
  return url;
  
}

const getSupportUrl = async() => {
  let url = await getStoredServer() || AppConfig.SERVER_URL;
  url+='/support';
  return url;
}



const resourcesPaths = {
                'object':'my/objects',
                'room':'my/rooms',
                'gateway':'my/gateways',
                'notifications':'my/notifications',
                'preferences':'my/preferences',
                'userInfo':'my/userInfo'
}
/**
 * 
 * @param {string} type object|any
 * @param {*} params 
 */
async function add(type,params) {

    const url = await getDurinUrl() + resourcesPaths[type];
    let errCode = 200;
    let errMsg = "";
    console.log("DAIN_DURIN_POST",params)
    //const result= await axios.post(url,params,{timeout:timeoutDuration});
    //console.log('RES_RR :', url);
    try {
      console.log("CREATE_RESOURCE_1 ")       
      let res= await axios.post(url,params,{timeout:timeoutDuration});
      console.log("CREATE_RESOURCE_2 ",res)            
        if(res.status == 200) {    
          //console.log("Resource created",res)        
          return Promise.resolve({errCode:res.status,id:res.data.resource.id,res:res});       
        } else {
          //
        }
        return (res.status == 200);

      } catch(error) {
        
        //console.log("error",error);
        console.log("----------------------\n error.response",error.response);
        if (error.response == undefined) {
          // network error
          errCode = -1;
        } else {
          // http status code
          errCode = error.response.status;
          errMsg = error.response.data?.error?.msgKey || "pb with data.error.msgKey";
        }
       


        let result =  {errCode:errCode,errMsg:errMsg}
        //console.log("result",result)
        return Promise.resolve(result);      
    } 
}

export async function updateArray (type,params) {

      let errCode = 200;
      let errMsg;
      let url = await getDurinUrl() + resourcesPaths[type];
      //console.log("updateArray :: update url",url);
      const data = JSON.stringify(params)
      
      try {
        let res = await axios.put(url,data,{headers: {'Content-Type': 'application/json'},timeout:timeoutDuration});
        if(res.status == 200) { 
          if(params.action != undefined) {
            params.actions.forEach(element => {
             // console.log("Action : "+element.name +' Done !');
            });   
          }
           
          
          return Promise.resolve({errCode:res.status,res:res});       
        } else {
          //
        }
        return (res.status == 200);
      } catch(error) {
        
        //console.log("error",error)
        if (error.response == undefined) {
          // network error
          errCode = -1;
          errResponse = undefined
        } else {
          // http status code
          errCode = error.response.status;  
          errMsg = error.response.data.error.msgKey;           
        }
        
        let result =  {'errCode':errCode,'errMsg':errMsg}
        //console.log("result",result)
        return Promise.resolve(result);      
    }
}


async function update(type,id,params) {

  // console.log(type,id,params)
  console.log('PARAMS_STRINGIFIED :', params);

    let errCode = 200;
    let errMsg;
    let url = await getDurinUrl() + resourcesPaths[type];
    console.log("update url",url, params)
    switch (type) {
     
      case 'object' : 
        url +="/"+id;
        break;
      case 'room' : 
        url +="/"+id;
        break;
      case 'gateway':
        url +="/"+id;
        break;
    }

    //console.log('dans DurinUpdate',url,params)
    if(params) {
      // console.log("dans Durin mArgs",params)
    }
   
    try {
      let res = await axios.put(url,params,{timeout:timeoutDuration});

        //console.log("vers durin : ",url,JSON.stringify(params));
        //console.log("Update ",res)       
        if(res.status == 200) { 
          if(params.action != undefined) {
            params.actions.forEach(element => {
             // console.log("Action : "+element.name +' Done !');
            });   
          }
           
          
          return Promise.resolve({errCode:res.status,id:res?.data?.resource?.id,res:res});       
        } else {
          //
        }
        return (res.status == 200);
      } catch(error) {
        
       // console.log("error",error.response)
        if (error.response == undefined) {
          // network error
          errCode = -1;
          errResponse = undefined
        } else {
          // http status code
          errCode = error.response.status;  
          errMsg = error.response.data.error.msgKey;           
        }
        
        let result =  {'errCode':errCode,'errMsg':errMsg}
        console.log("result_in_Durin_update",result)
        return Promise.resolve(result);      
    }
}

async function remove(type,id) {

    let errCode = 200;
    const url = await getDurinUrl() + resourcesPaths[type]+'/'+id;
    console.log('MY_LINK_URL :', url);

    try {
        let res = await axios.delete(url,{timeout:timeoutDuration});
       // console.log("Remove "+type+" resource("+id+")",res)
       console.log('MY_BOX_DELETE_RESPONSE :', res);
        if(res.status == 200) {    
           // console.log("L'objet a été supprimé",res);        
            return Promise.resolve({errCode:res.status,res:res});       
        } else {
            //
        }
        return (res.status == 200);

        } catch(error) {
          console.log('MY_BOX_DELETE_RESPONSE :', error);
            //console.log("error",error,error.response)
            if (error.response == undefined) {
                // network error
                errCode = -1;
               
            } else {
                // http status code
                errCode = error.response.status;
                   
            }
        
            let result =  {'errCode':errCode}
           // console.log("result",result)
            return Promise.resolve(result);      
    }
}
/**
 * 
 * @param {array} params [{'id': 1628}, {'id': 371}] 
 */
async function removeMultiple(params) {
  let type = "object";
  let errCode = 200;
  const url = await getDurinUrl() + resourcesPaths[type];

  try {
      let res = await axios.delete(url,{data:params}); /*!! timeout */
     // console.log("Remove removeMultiple",params)
      
      if(res.status == 200) {    
          //console.log("Les objets ont été supprimés",res);        
          return Promise.resolve({errCode:res.status,res:res});       
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
          //console.log("result",result)
          return Promise.resolve(result);      
  }
}



/**
 * 
 * @param {*} type 
 * @param {*} id 
 * @param {*} options 
 * @param {*} filters 
 */
async function get(type,id,options,filters) {

    buildOptions = (options) => {
      if(options == undefined) return '';
      return '?'+options
    }


    const url = await getDurinUrl() + resourcesPaths[type]+((id == null || id == undefined)? '':'/'+id)+buildOptions(options);

    let errCode = 200;
   

    try {
        let res = await axios.get(url,{timeout:timeoutDuration});
       
        if(res.status == 200) {    
            console.log('RES_USER_OBJECTS_DURIN :', res);
            return Promise.resolve({'errCode':res.status,'res':res});       
        } else {
            //
        }
         console.log('RES_USER_OBJECTS_DURIN_2 :', res);
        return (res);
        //return (res.status == 200);

        } catch(error) {
        
            //console.log("error get",error,error.response)
            if (error.response == undefined) {
                // network error
                errCode = -1;
            } else {
                // http status code
                errCode = error.response.status               
            }
        
            let result =  {'errCode':errCode}
            //console.log("result",result)
            return Promise.resolve(result);      
    }


}

/**
 * 
 * @param {(byName|byUse)} type 
 * @param {string} id  car be just an Id or String
 */
async function search(type,id) {

  const url = await getDurinUrl() + 'my/search?'+type+"="+id+"&all"
  
  let errCode = 200;

  try {
      let res = await axios.get(url,{timeout:timeoutDuration});      
      
      if(res.status == 200) {    
          //console.log("Resultat obtenu",res);        
          return Promise.resolve({errCode:res.status,res:res});       
      } else {
          //
      }
      return (res.status == 200);

  } catch(error) {
      
          //console.log("error",error,error.response)
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
//--------------------------------------------------
async function graphs(id,params) {


  const url = await getDurinUrl() + 'my/data/'+id; 
  let errCode = 200; 

  try {
      let res = await axios.get(url,{params}); /* !! timeout */      
      
      if(res.status == 200) {    
          //console.log("Resultat obtenu",res);        
          return Promise.resolve({errCode:res.status,res:res.data.resource.data});       
      } else {
          //
      }
      return (res.status == 200);

  } catch(error) {
      
      //console.log("error",error,error.response)
      if (error.response == undefined) {
          // network error
          errCode = -1;
      } else {
          // http status code
          errCode = error.response.status               
      }
  
      let result =  {errCode:errCode}
      //console.log("result",result)
      return Promise.resolve(result);      
  }
}
async function apps() {

  const url = await getDurinUrl() + 'server/apps?all';
  let errCode = 200; 

  try {
      let res = await axios.get(url,{timeout:timeoutDuration});
      
      
      if(res.status == 200) {    
         // console.log("Resultat obtenu",res);           
          return Promise.resolve({errCode:res.status,data:res.data.content});       
      } else {
          //
      }
      return (res.status == 200);

  } catch(error) {
      
      //console.log("error",error,error.response)
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


async function getAllFiles() {
  const url = await getDurinUrl() + 'my/files?all';
  const params = {};
 // console.log("url",url)
  try {
      let res = await axios.get(url,params); /* !! timeout */
      
      
      if(res.status == 200) {    
          //console.log("Resultat obtenu",res);        
          return Promise.resolve({errCode:res.status,res:res.data.content});       
      } else {
          //
      }
      return (res.status == 200);

      } catch(error) {
      
         //console.log("error",error,error.response)
          if (error.response == undefined) {
              // network error
              errCode = -1;
          } else {
              // http status code
              errCode = error.response.status               
          }
      
          let result =  {errCode:errCode}
        //  console.log("result",result)
          return Promise.resolve(result);      
  }

}


//----------------------------------------------
async function files(id,args) {

  
  const params = args || {}

  const url = await getDurinUrl() + 'my/files/'+id+"?all"
 
  let errCode = 200;
 

  try {
      let res = await axios.get(url,params); /* !! timeout */
     
      
      if(res.status == 200) {    
          //console.log("Resultat obtenu",res);        
          return Promise.resolve({errCode:res?.status,res:res?.data?.resource?.files});       
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
        //  console.log("result",result)
          return Promise.resolve(result);      
  }
}
//---------------------------------------------------------
// gestion des erreurs
const support = async(params) => {
  const url = await getSupportUrl();
  let errCode = 200;
  let obj = {  
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: paramsToString({'data':JSON.stringify(params)})

    };
    //console.log("before fetch");
    
    //let res = await fetch(url, obj);
    //console.log("after fetch",res);
    
}




export {add, update, remove, removeMultiple, get, search, graphs, apps, files, getAllFiles, support}
