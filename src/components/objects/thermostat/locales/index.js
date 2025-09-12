import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------
import thermostatEN from './en.json';
import thermostatFR from './fr.json';
import thermostatIT from './it.json';
import thermostatDE from './de.json';
import thermostatES from './es.json';
import thermostatNL from './nl.json';
import thermostatPT from './pt.json';
// -------- then addResourceBundle ---------

i18next.addResourceBundle('en', 'thermostat', thermostatEN);
i18next.addResourceBundle('fr', 'thermostat', thermostatFR);
i18next.addResourceBundle('it', 'thermostat', thermostatIT);
i18next.addResourceBundle('de', 'thermostat', thermostatDE);
i18next.addResourceBundle('es', 'thermostat', thermostatES);
i18next.addResourceBundle('nl', 'thermostat', thermostatNL);
i18next.addResourceBundle('pt', 'thermostat', thermostatPT);