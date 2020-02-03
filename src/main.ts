import Vue from 'vue'
// @ts-ignore
import App from './App'
import { Router as router } from './lib';
import CoreuiVue from '@coreui/vue';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';
import VCalendar from 'v-calendar';
import {iconsSet as icons} from './assets/icons/icons';
import store from './store'

Vue.config.performance = true;
Vue.use(CoreuiVue);
Vue.use(VueApollo);
Vue.use(VCalendar, {componentPrefix: ''});

const apolloClient = new ApolloClient({uri: window.location.protocol + '//' + window.location.host + '/' + 'api/graphql'});
const apolloProvider = new VueApollo({defaultClient: apolloClient});

new Vue({
    el: '#app',
    apolloProvider,
    router,

    // @ts-ignore
    icons,

    components: {
        App
    },

    template: '<App/>',
    store
});
