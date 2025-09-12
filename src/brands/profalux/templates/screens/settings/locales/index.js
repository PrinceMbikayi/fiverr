import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
// import doorkeeperEN from './en.json';
import settingsFR from './fr.json';
import settingsEN from './en.json';
// import settingsIT from './it.json';
import settingsDE from './de.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'settings', settingsEN,true,true);
i18next.addResourceBundle('fr', 'settings', settingsFR,true,true);
//i18next.addResourceBundle('it', 'settings', settingsIT);
i18next.addResourceBundle('de', 'settings', settingsDE);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "settings";