import i18next from '_utils/i18next' // import the instance

import productRelatedFR from './productRelatedFR.json';
import extendedProductFR from './extendedProductFR.json'

i18next.addResourceBundle('fr', 'productRelated', productRelatedFR,false,false);
i18next.addResourceBundle('fr', 'productRelated', extendedProductFR,true,true);
i18next.addResourceBundle('fr', 'productAtHome', extendedProductFR,true,true);

