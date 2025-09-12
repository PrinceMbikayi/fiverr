import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
import maisonEN from './en.json';
import maisonFR from './fr.json';
import maisonDE from './de.json';
// import doorkeeperIT from './it.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'maison', maisonEN);
i18next.addResourceBundle('fr', 'maison', maisonFR,true,true);
i18next.addResourceBundle('de', 'maison', maisonDE, true, true);
// i18next.addResourceBundle('it', 'doorkeeper', doorkeeperIT);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "maison";