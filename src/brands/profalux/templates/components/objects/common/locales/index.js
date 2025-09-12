import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
// import doorkeeperEN from './en.json';
import commonFR from './fr.json';
import commonEN from './en.json';
import commonDE from './de.json';
//import commonIT from './it.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'common', commonEN,true,true);
i18next.addResourceBundle('fr', 'common', commonFR,true,true);
i18next.addResourceBundle('de', 'common', commonDE, true, true);
// i18next.addResourceBundle('it', 'common', commonIT,true,true);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "common";