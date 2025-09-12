import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
import accountEN from './en.json';
import accountFR from './fr.json';
// import doorkeeperIT from './it.json';
import accountDE from './de.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'account', accountEN);
i18next.addResourceBundle('fr', 'account', accountFR);
// i18next.addResourceBundle('it', 'doorkeeper', doorkeeperIT);
i18next.addResourceBundle('de', 'account', accountDE);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

