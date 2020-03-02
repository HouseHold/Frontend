import Vue from 'vue';
import App from './App.vue';
import { Router as router } from './lib';
import CoreuiVue from '@coreui/vue';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';
import VCalendar from 'v-calendar';
import { iconsSet as icons } from './assets/icons/icons';
import store from './store';
import _ from "lodash";
import i18n, { localeFiles } from './lib/I18n';
import './lib/Sentry';

Vue.config.performance = true;
Vue.use(CoreuiVue);
Vue.use(VueApollo);
Vue.use(VCalendar, { componentPrefix: '' });

const apolloClient = new ApolloClient({ uri: window.location.protocol + '//' + window.location.host + '/' + 'api/graphql' });
const apolloProvider = new VueApollo({ defaultClient: apolloClient });

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
    module.hot.accept(_.values(localeFiles), function () {
        for (const locale in localeFiles) {
            i18n.setLocaleMessage(locale, require(`./locales/${locale}.json`));
        }
    });
}
