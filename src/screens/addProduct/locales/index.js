import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
import addProductEN from './en.json';
import addProductFR from './fr.json';
import addProductIT from './it.json';
import addProductDE from './de.json';
import addProductES from './es.json';
import addProductNL from './nl.json';
import addProductPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'addProduct', addProductEN);
i18next.addResourceBundle('fr', 'addProduct', addProductFR);
i18next.addResourceBundle('it', 'addProduct', addProductIT);
i18next.addResourceBundle('de', 'addProduct', addProductDE);
i18next.addResourceBundle('es', 'addProduct', addProductES);
i18next.addResourceBundle('nl', 'addProduct', addProductNL);
i18next.addResourceBundle('pt', 'addProduct', addProductPT);