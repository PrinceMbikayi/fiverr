import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
import accountFR from './fr.json';
import accountEN from './en.json';
/*
import accountIT from './it.json';
import accountDE from './de.json';
*/
// -------- then addResourceBundle ---------

i18next.addResourceBundle('fr', 'account', accountFR);
i18next.addResourceBundle('en', 'account', accountEN);
/*
i18next.addResourceBundle('it', 'account', accountIT);
i18next.addResourceBundle('de', 'account', accountDE);
*/


