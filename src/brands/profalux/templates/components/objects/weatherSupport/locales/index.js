import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
// import doorkeeperEN from './en.json';
import weatherFR from './fr.json';
import weatherEN from './en.json';
// import doorkeeperIT from './it.json';
import weatherDE from './de.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'weather', weatherEN,true,true);
i18next.addResourceBundle('fr', 'weather', weatherFR,true,true);
// i18next.addResourceBundle('it', 'doorkeeper', doorkeeperIT);
i18next.addResourceBundle('de', 'weather', weatherDE, true, true);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "weather";