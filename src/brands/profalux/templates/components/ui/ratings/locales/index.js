import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
// import doorkeeperEN from './en.json';
import ratingFR from './fr.json';
// import doorkeeperIT from './it.json';
// import doorkeeperDE from './de.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

// i18next.addResourceBundle('en', 'doorkeeper', doorkeeperEN);
i18next.addResourceBundle('fr', 'rating', ratingFR,true,true);
// i18next.addResourceBundle('it', 'doorkeeper', doorkeeperIT);
// i18next.addResourceBundle('de', 'doorkeeper', doorkeeperDE);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

