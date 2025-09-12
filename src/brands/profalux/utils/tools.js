import base64 from 'react-native-base64';


/**
 * simple delay /pause / sleep / exemple timeout
 * @param {number} ms in milliseconds
 * @returns Promise
 */
export const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  /**
*
* @param {*} objects
* @param {*} id
* @returns
*/
export const getObjectUriById = (objects,id) => {

  console.log("HAA :", objects, id)
   
  const idString = ""+id;    
  if(objects[idString]) {
      const val = objects[idString]?.uri;
     // console.log("------------>",val)
      return val       
  }
}

export const parseJwt =(token) =>{
  var b64Url = token.split('.')[1];
  var b64 = b64Url.replace(/-/g, '+').replace(/_/g, '/');

  const showMe = base64.decode(b64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('');
  
   // console.log("in parseJwt",showMe)
   // const entities = new Entities();
   let rez = showMe;
   if(decodeURIComponent) {
    rez = decodeURIComponent(showMe);
    console.log("just rez",rez)
   }
   
    return rez;
  
}