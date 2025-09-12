import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
import wellcometourEN from './en.json';
import wellcometourFR from './fr.json';
import wellcometourDE from './de.json';
// import doorkeeperIT from './it.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'wellcometour', wellcometourEN);
i18next.addResourceBundle('fr', 'wellcometour', wellcometourFR,true,true);
i18next.addResourceBundle('de', 'wellcometour', wellcometourDE, true, true);
// i18next.addResourceBundle('it', 'doorkeeper', doorkeeperIT);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "wellcometour"; 