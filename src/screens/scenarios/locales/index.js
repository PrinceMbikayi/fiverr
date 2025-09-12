import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
import scenarioFR from './fr.json';
import scenarioEN from './en.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('fr', 'scenario', scenarioFR);
i18next.addResourceBundle('en', 'scenario', scenarioEN);


