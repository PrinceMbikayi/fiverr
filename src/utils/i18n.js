import I18n from "i18n-js";
import * as RNLocalize from "react-native-localize";

import en from "./locales/en";
import fr from "./locales/fr";
import it from '.locales/it';
import de from '.locales/de';

const locales = RNLocalize.getLocales();
console.log("locales",locales);
if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag;
}

I18n.fallbacks = true;
I18n.translations = {
  en,
  fr,
  it,
  de
};

export default I18n;