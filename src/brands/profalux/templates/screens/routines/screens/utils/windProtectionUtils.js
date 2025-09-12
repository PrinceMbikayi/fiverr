import moment from 'moment/min/moment-with-locales';
import i18next from 'i18next';

import { getObjectById } from '_helpers/objects';


export function extractMultipleParamFromWindProtection(parameterList,parmNames){
  const result = parmNames.reduce((acc,key)=>{
    const obj = parameterList.find((param) => param.name == key)
    if(obj) acc[key] = obj?.value
    return acc
  },{})

  return {...parmNames}=result
}