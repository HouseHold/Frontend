import VueI18n, { LocaleMessages } from "vue-i18n";
import { defaultLocale, locales, localeFiles as lf } from '../locales';
import Vue from "vue";

const messages: LocaleMessages = locales as LocaleMessages;
Vue.use(VueI18n);
const i18n = new VueI18n({ locale: defaultLocale, fallbackLocale: defaultLocale, messages });
export default i18n;
export const localeFiles = lf;
