import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
// import doorkeeperEN from './en.json';
import navigationFR from './fr.json';
import navigationEN from './en.json';
// import doorkeeperIT from './it.json';
import navigationDE from './de.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'navigation', navigationEN,true,true);
i18next.addResourceBundle('fr', 'navigation', navigationFR,true,true);
// i18next.addResourceBundle('it', 'doorkeeper', doorkeeperIT);
i18next.addResourceBundle('de', 'navigation', navigationDE, true, true);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "navigation";