import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
import routineEN from './en.json';
import routineFR from './fr.json';
// import routineIT from './it.json';
import routineDE from './de.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'routine', routineEN, true, true);
i18next.addResourceBundle('fr', 'routine', routineFR,true,true);
i18next.addResourceBundle('de', 'routine', routineDE, true, true);
// i18next.addResourceBundle('it', 'routine', routineIT);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "routine";