import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
import accountFR from './fr.json';
import accountEN from './en.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('fr', 'account', accountFR);
i18next.addResourceBundle('en', 'account', accountEN);


