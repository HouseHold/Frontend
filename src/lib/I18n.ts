import VueI18n, { LocaleMessages } from "vue-i18n";
import { locales, localeFiles as lf } from '../locales';
import Vue from "vue";
import store from '../store';

// @ts-ignore
const dl: string = store.state.Session.locale.toString();
const messages: LocaleMessages = locales as LocaleMessages;

Vue.use(VueI18n);
const i18n = new VueI18n({ locale: dl, fallbackLocale: dl, messages });
export default i18n;
export const localeFiles = lf;
export const defaultLocale = dl;
