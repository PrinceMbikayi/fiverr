import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import {getLocales} from 'react-native-localize';

import translationEN from './locales/en.json';

import productAthomeEN from './locales/products/athome/en.json';
import productTypesEN from './locales/products/types/en.json';
import scenariosEN from './locales/scenarios/en.json';
import statusesEN from './locales/statuses/en.json';


//-------------------------------------------------

import translationFR from './locales/fr.json';

import productAthomeFR from './locales/products/athome/fr.json';
import productTypesFR from './locales/products/types/fr.json';
import scenariosFR from './locales/scenarios/fr.json';
import statusesFR from './locales/statuses/fr.json';

//-------------------------------------------------

import translationIT from './locales/it.json';

import productAthomeIT from './locales/products/athome/it.json';
import productTypesIT from './locales/products/types/it.json';
import scenariosIT from './locales/scenarios/it.json';
import statusesIT from './locales/statuses/it.json';

//-------------------------------------------------

import translationDE from './locales/de.json';

import productAthomeDE from './locales/products/athome/de.json';
import productTypesDE from './locales/products/types/de.json';
import scenariosDE from './locales/scenarios/de.json';
import statusesDE from './locales/statuses/de.json';

//------------------------------------------------

import translationES from './locales/es.json';

import productAthomeES from './locales/products/athome/es.json';
import productTypesES from './locales/products/types/es.json';
import scenariosES from './locales/scenarios/es.json';
import statusesES from './locales/statuses/es.json';

//------------------------------------------------

import translationNL from './locales/nl.json';

import productAthomeNL from './locales/products/athome/nl.json';
import productTypesNL from './locales/products/types/nl.json';
import scenariosNL from './locales/scenarios/nl.json';
import statusesNL from './locales/statuses/nl.json';

//-----------------------------------------------
import translationPT from './locales/pt.json';

import productAthomePT from './locales/products/athome/pt.json';
import productTypesPT from './locales/products/types/pt.json';
import scenariosPT from './locales/scenarios/pt.json';
import statusesPT from './locales/statuses/pt.json';





// the translations
const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  },
  it: {
    translation: translationIT
  },
  de: {
    translation: translationDE
  },
  es: {
    translation: translationES
  },
  nl: {
    translation: translationNL
  },
  pt: {
    translation: translationPT
  }

};

const userLang = getLocales()[0].languageCode;
console.log("userLang",userLang);

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
   lng:userLang,
    fallbackLng: 'en',
    debug: true,
    resources:resources,
   
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

 
  i18next.addResourceBundle('en', 'productAtHome', productAthomeEN);
  i18next.addResourceBundle('en', 'productTypes', productTypesEN);
  i18next.addResourceBundle('en', 'scenarios', scenariosEN);
  i18next.addResourceBundle('en', 'statuses', statusesEN);
 
  


  i18next.addResourceBundle('fr', 'productAtHome', productAthomeFR,true,true);
  i18next.addResourceBundle('fr', 'productTypes', productTypesFR);
  i18next.addResourceBundle('fr', 'scenarios', scenariosFR);
  i18next.addResourceBundle('fr', 'statuses', statusesFR);






  i18next.addResourceBundle('it', 'productAtHome', productAthomeIT);
  i18next.addResourceBundle('it', 'productTypes', productTypesIT);
  i18next.addResourceBundle('it', 'scenarios', scenariosIT);
  i18next.addResourceBundle('it', 'statuses', statusesIT);


 
  i18next.addResourceBundle('de', 'productAtHome', productAthomeDE);  
  i18next.addResourceBundle('de', 'productTypes', productTypesDE);  
  i18next.addResourceBundle('de', 'scenarios', scenariosDE);  
  i18next.addResourceBundle('de', 'statuses', statusesDE); 

   
  i18next.addResourceBundle('es', 'productAtHome', productAthomeES);  
  i18next.addResourceBundle('es', 'productTypes', productTypesES);  
  i18next.addResourceBundle('es', 'scenarios', scenariosES);  
  i18next.addResourceBundle('es', 'statuses', statusesES); 


  i18next.addResourceBundle('nl', 'productAtHome', productAthomeNL);  
  i18next.addResourceBundle('nl', 'productTypes', productTypesNL);  
  i18next.addResourceBundle('nl', 'scenarios', scenariosNL);  
  i18next.addResourceBundle('nl', 'statuses', statusesNL);

  i18next.addResourceBundle('pt', 'productAtHome', productAthomePT);  
  i18next.addResourceBundle('pt', 'productTypes', productTypesPT);  
  i18next.addResourceBundle('pt', 'scenarios', scenariosPT);  
  i18next.addResourceBundle('pt', 'statuses', statusesPT);




export default i18next;