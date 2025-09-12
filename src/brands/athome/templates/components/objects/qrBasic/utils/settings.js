import {Api} from '_api';
import {getObjectFiles} from '_api/objects';

export const setOptions = async(itemId,params) => {
   
    const {family_name,comment,base64data,type} = params;
    const setup = {"family_name":family_name,"comment":comment,...(base64data && {photo: type+','+base64data})};
    //console.group("setup",setup)
    const resp = await Api.executeAction(itemId,"CONF",{mArgs:[{name:'setup',value:setup}]}).catch((err)=> console.log("erreur options QRCode",err)); 
   //console.log("envoi photo",resp)
    return resp;
}


export const fillSnapshot = async(itemId) => {
    //console.log("init fillSnapshot",itemId)
    const objectFiles = await getObjectFiles(itemId).catch((err) => console.log(err));
   
    const files = objectFiles?.res || []

    for(var i in files) {
       // 
        const current = files[i];
        //console.log("current",current)
        if(current?.filename == "photo") {
            console.log(current.url);
            //setSnapshot(current?.url);
            return current?.url
            break;
        }
    }
    return 'default';
}