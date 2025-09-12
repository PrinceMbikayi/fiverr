import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
import componentsFR from './fr.json';
import componentsEN from './en.json';
import componentsDE from './de.json';
//import componentsIT from './it.json';
// import doorkeeperES from './es.json';
// import doorkeeperNL from './nl.json';
// import doorkeeperPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'components', componentsEN,true,true);
i18next.addResourceBundle('fr', 'components', componentsFR,true,true);
i18next.addResourceBundle('de', 'components', componentsDE, true, true);
// i18next.addResourceBundle('it', 'components', commonIT,true,true);
// i18next.addResourceBundle('es', 'doorkeeper', doorkeeperES);
// i18next.addResourceBundle('nl', 'doorkeeper', doorkeeperNL);
// i18next.addResourceBundle('pt', 'doorkeeper', doorkeeperPT);

export const tns = "components";