import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Locale from './Session/Locale';
import { defaultLocale } from '../locales';

@Module
export default class Stock extends VuexModule {
    locale: Locale = (defaultLocale as Locale);

    @Mutation
    SET_SESSION_LOCALE(locale: Locale) {
        this.locale = locale;
    }

    @Action
    changeLocale(locale: Locale): void {
        this.context.commit('SET_SESSION_LOCALE', locale);
        window.history.go(); // Refresh the page to apply new language fully.
    }
}

