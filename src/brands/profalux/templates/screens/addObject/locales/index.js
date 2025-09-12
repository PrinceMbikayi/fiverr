import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
// import doorkeeperEN from './en.json';
import addObjectFR from './fr.json';
import addObjectEN from './en.json';
import addObjectDE from './de.json';
// import doorkeeperIT from './it.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'addObject', addObjectEN,true,true);
i18next.addResourceBundle('fr', 'addObject', addObjectFR,true,true);
i18next.addResourceBundle('de', 'addObject', addObjectDE, true, true);
// i18next.addResourceBundle('it', 'doorkeeper', doorkeeperIT);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "addObject";