
import {Normalise} from '../helpers/normalise';
import * as types from '_actions/notificationTypes';
import {AppConfig} from '../config';
import * as Durin from './durin';


/**************************************
 * 
 *  A réécrire en prenant la methode deleteObject comme exemple
 *  Ou ./groups.js
 * 
 * 
 **************************************/


const paramsToString = params => Object.entries(params).reduce((acc, [key, value], index, array) => `${acc}${key}=${encodeURIComponent(value)}${index !== (array.length - 1) ? '&' : ''}`, "");
const durinUrl = AppConfig.SERVER_URL+'/services/durin/';



async function getNotifications () {
  
  /* be careful Durin.get return {errCode:XXX,res:{}} */
  //store.dispatch({type:ActionsTypes.OBJECTS_RELOAD,payload:{ 'status':true}})
  const response = await Durin.get('notifications',null);

  // console.log("getNotifications",response)
  // console.log("response.errCode",response.errCode)
  if(response.errCode != 200) {
    return {'errCode':response.errCode};
  }


  if(response.res.data.content.length > 0) {
    const rawDatas = response.res.data.content.reduce((r,v,i)=> {
        r.push(v.resource);
        return r
    },[]);
   //console.log("rawDatas",rawDatas)
    const normalized = Normalise.normaliseNotifications(rawDatas);
   // console.log("normalized",normalized);
    return {'errCode':response.errCode,data:normalized}
   
  } else {
    return {'errCode':response.errCode,data:{'list':[],'sections':[]}};
  }
  

}


async function getNotification (id) {
  return await Durin.get('object',id)
  
  
}

async function deleteNotification (itemId){
  return await Durin.search('byUses',itemId);
}


export {
  getNotifications,
  getNotification,
  deleteNotification
};


// Keep them here before total refactor completed
