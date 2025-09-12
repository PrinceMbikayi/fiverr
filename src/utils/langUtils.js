import {getLocales} from 'react-native-localize';
import i18next from 'i18next';

export const getDeviceLang = () => {
  
    const deviceLang = getLocales()[0].languageCode;
   
    return deviceLang
}
export const getDeviceCountry = () => {
   const deviceCountry =  getLocales()[0].countryCode;
   return deviceCountry;
}