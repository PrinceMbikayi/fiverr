import * as Durin from './durin';
import { getServer as getStoredServer } from '_services/storage';




const getServerUrl = async () => {

  const serverUrl = await getStoredServer() || AppConfig.SERVER_URL
  return serverUrl;

}

// Harold Addition
/**
 * 
 * @param {string} name : room name is mandatory
 * @param {string} objects : list og uri
 * @param {boolean} isDefault : is the room defaut?
 * @returns 
 */
async function createRoomObject(name,objects, isDefault) {

  const serverUrl = await getServerUrl();

  /*
  const uri = serverUrl+"/services/durin/my/objects/" 
  let objectsList=[];
  objects.map((item)=>{
    objectsList.push({uri:uri+item})
  })
  console.log('URI_OBJECTS_CREATE_ROOM :', uri, objects);
  */
  let objectsList = objects;
 
    const params = {     
      name: name,
      objects:objectsList,
      default:isDefault
    }
    //console.log("createWeatherObject",params)
    return Durin.add('room',params)
  }

  /**
*
* @param {*} roomId
* @param {string} objects list of uri
*/

async function modifyRoom (roomId, name , objects, isDefault) {

  const serverUrl = await getServerUrl();

  const uri = serverUrl+"/services/durin/my/objects/" 
  
  //console.log('URI_SENT :', objects);

  //const uri = "https://profalux.avidsen.one/services/durin/my/objects/" 
  //const uri = "https://profalux.avidsen.one/services/durin/my/objects/" 
  /*
  let objectsList=[];
  objects.map((item)=>{
    objectsList.push({uri:uri+item})
  })
  */
 let objectsList = objects;
 // console.log('URI_MODIFY_ROOM :',  objectsList);
    const type = "room";
    console.log("CONTROLE MODIFY ROOM REQUEST API",roomId, objectsList)
    const params = {name:name, objects:objectsList, default:isDefault}
    return Durin.update(type,roomId,params)
  }

  export {
  
    createRoomObject,
    modifyRoom
  };