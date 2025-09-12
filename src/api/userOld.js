import dotProp from 'dot-prop-immutable';
import * as Durin from './durin';
import * as axios from 'axios';
import {userNickname} from '_actions/user';
import store from '_store';

/*
export const updatePreference = async (section,name,value) => {
    console.log("durin updatePreference XXXXX")
    const params = {'section':section,'name':name,'value':value}
    console.log("durin updatePreference",params)
    // params is Third argument so 2nd argument must exists so => 2nd arg =  null
    res = await Durin.update("preferences",null,params);    
    return res;
}
*/

//--------------------------------------------------------------

/**
 * 
 * @param {array} params an array of objects {"section": ,"name": ,"value"}
 * @returns 
 */
export const updatePreference = async (params) => {
    //const params = {'section':section,'name':name,'value':value}
    console.log("durin updatePreference",params)
    // params is Third argument so 2nd argument must exists so => 2nd arg =  null
    res = await Durin.update("preferences",null,params);    
    return res;
}
//--------------------------------------------------------------
export const updateLanguage = (lang) => {
    const changeLang = updatePreference('Locale','language',lang);    
    return changeLang
}
//--------------------------------------------------------------
export const updateCountry = (country) => {
    const changeCountry = updatePreference('Locale','country',country);   
    return changeCountry
}
//--------------------------------------------------------------

/**
*
* @param {string} [pref] section.name or nothing if nothing return all preferences
* @returns
*/
export const getPreferences = async(prefPath) => {
    const response = await Durin.get("preferences");
   //console.log("getPreferences response =>",JSON.stringify(response?.res))
 
 
    const reduceThis = response?.res?.data?.content || []
 
    const sorted = reduceThis.reduce((r,v,i) => {
        //console.log("reduceThis",v)
        const datas = v?.resource;
        if(datas == undefined) return r;
        const section = datas?.section ;
       // console.log("section =>",section)        
        if(r[section] == undefined) r[section] = {};
       
        r[section][datas.name] = datas.value;
 
        return r
 
    },{})
 
    console.log("sorted",sorted)
    if(prefPath) {
        return dotProp.get(sorted,prefPath)
    }
 
    return sorted
}
 
 
const createUserDefinedPreference = async(props) => {
    const {section,name,value} = props;
    console.log("createUserDefinedPreference props",props)
    res = await Durin.add("preferences",[{"section":section,"name":name,"value":value}]).catch((err)=> {console.log("add prefs error",err)})
   console.log("createUserDefinedPreference done",res)
    return res;
}
 
export const deleteUserDefinedPreferences = async(props) => {
    console.log("deleteUserDefinedPreferences",props)
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
   const exists =  await getPreferences(namePath).catch((err) => console.log("Error in API getGoogleHomePin",err));
    console.log("setUserDefinedPreferences exists",exists);
    const params = {"section":"User","name":name,"value":value};
    if(exists == undefined) {
        console.log("so addit")
        const addIt = createUserDefinedPreference(params).catch((err) => console.log("createUserDefinedPreference Error",err));
        return addIt;
   } else {
        const updateIt = await Durin.update("preferences",null,[params])
        console.log("updateIt",updateIt)
   }
    
   // console.log("===============>  Durin.get(\"preferences\")",JSON.stringify(response?.res?.data));
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
