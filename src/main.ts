import Vue from 'vue';
import App from './App.vue';
import { Router as router } from './lib';
import CoreuiVue from '@coreui/vue';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';
import VCalendar from 'v-calendar';
import { iconsSet as icons } from './assets/icons/icons';
import store from './store';
import VueI18n, { LocaleMessages } from "vue-i18n";
import { defaultLocale, locales } from './locales';
const messages: LocaleMessages = locales as LocaleMessages;

Vue.config.performance = true;
Vue.use(CoreuiVue);
Vue.use(VueApollo);
Vue.use(VCalendar, { componentPrefix: '' });
Vue.use(VueI18n);

const apolloClient = new ApolloClient({ uri: window.location.protocol + '//' + window.location.host + '/' + 'api/graphql' });
const apolloProvider = new VueApollo({ defaultClient: apolloClient });
const i18n = new VueI18n({ locale: defaultLocale, fallbackLocale: defaultLocale, messages });

new Vue({
    el: '#app',
    apolloProvider,
    i18n,
    router,
    // @ts-ignore
    icons,
    components: {
        App
    },
    template: '<App/>',
    store
});


// Development related
if (module.hot) {
    module.hot.accept(['./locales/en.json'], function () {
        i18n.setLocaleMessage('en', require('./locales/en.json'));
        //i18n.setLocaleMessage('fi', require('./translations/fi.json'));
    });
}
