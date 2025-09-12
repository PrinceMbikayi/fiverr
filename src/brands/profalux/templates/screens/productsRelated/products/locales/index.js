import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
// import doorkeeperEN from './en.json';
import productsFR from './fr.json';
import productsEN from './en.json';
// import productsIT from './it.json';
import productsDE from './de.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'products', productsEN,true,true);
i18next.addResourceBundle('fr', 'products', productsFR,true,true);
// i18next.addResourceBundle('it', 'products', productsIT);
i18next.addResourceBundle('de', 'products', productsDE);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "products";