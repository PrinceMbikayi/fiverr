import {Api} from '_api'

export const setOptions = async(itemId,params) => {
   
    const {family_name,comment} = params;
    const setup = {"family_name":family_name,"comment":comment};
    const resp = await Api.executeAction(itemId,"CONF",{mArgs:[{name:'setup',value:setup}]}).catch((err)=> console.log("erreur creation",err)); 
   
    return resp;
}