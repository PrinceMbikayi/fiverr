import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
// import doorkeeperEN from './en.json';
import groupFR from './fr.json';
import groupEN from './en.json';
import groupDE from './de.json';
// import doorkeeperIT from './it.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'group', groupEN, true, true);
i18next.addResourceBundle('fr', 'group', groupFR, true, true);
i18next.addResourceBundle('de', 'group', groupDE, true, true);
// i18next.addResourceBundle('it', 'doorkeeper', doorkeeperIT);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "group";