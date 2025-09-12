import i18next from '_utils/i18next' // import the instance
// ------- import files -------------------

import bluetoothFR from './fr.json';
import bluetoothEN from './en.json';
import bluetoothIT from './it.json';
import bluetoothDE from './de.json';
import bluetoothES from './es.json';

// -------- then addResourceBundle ---------

// i18next.addResourceBundle('en', 'bluetooth', bluetoothEN);
i18next.addResourceBundle('fr', 'bluetooth', bluetoothFR,true,true);
i18next.addResourceBundle('en', 'bluetooth', bluetoothEN,true,true);
i18next.addResourceBundle('it', 'bluetooth', bluetoothIT,true,true);
i18next.addResourceBundle('de', 'bluetooth', bluetoothDE,true,true);
i18next.addResourceBundle('es', 'bluetooth', bluetoothES,true,true);


export const tns = "bluetooth";