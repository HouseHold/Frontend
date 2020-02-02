import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
import VCalendar from 'v-calendar';

import {iconsSet as icons} from './assets/icons/icons.js'

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
    icons,
    template: '<App/>',
    components: {
        App
    },
});
