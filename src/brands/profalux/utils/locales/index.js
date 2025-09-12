import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
// import doorkeeperEN from './en.json';
import utilFR from './fr.json';
import utilEN from './en.json';
import utilDE from './de.json';
// import doorkeeperIT from './it.json';
// import doorkeeperDE from './de.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'util', utilEN, true, true);
i18next.addResourceBundle('fr', 'util', utilFR, true, true);
i18next.addResourceBundle('de', 'util', utilDE, true, true);
// i18next.addResourceBundle('it', 'doorkeeper', doorkeeperIT);
// i18next.addResourceBundle('de', 'doorkeeper', doorkeeperDE);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "util";