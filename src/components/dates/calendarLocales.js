import {LocaleConfig} from 'react-native-calendars';
import moment from 'moment/min/moment-with-locales';

LocaleConfig.locales.en = LocaleConfig.locales[''];


const getLabels = (lang) => {
    moment.locale(lang); 
    if(LocaleConfig.locales[lang] == undefined)LocaleConfig.locales[lang] = {};
    LocaleConfig.locales[lang].dayNames = moment.weekdays();
    LocaleConfig.locales[lang].dayNamesShort = moment.weekdaysShort();
    LocaleConfig.locales[lang].monthNames = moment.months();
    LocaleConfig.locales[lang].monthNamesShort = moment.monthsShort();
    LocaleConfig.locales[lang].today =  "Aujourd'hui"
    
    //console.log("LocaleConfig",LocaleConfig)
   
  }

  const langs = ['fr','it','de'];
  langs.map((v,i) => {
    getLabels(v)
  });
  console.log("LocaleConfig.locales",LocaleConfig.locales)