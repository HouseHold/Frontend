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

let getUrl = window.location;
let baseUrl = getUrl.protocol + '//' + getUrl.host + '/';

const apolloClient = new ApolloClient({
    // You should use an absolute URL here
    uri: baseUrl + 'api/graphql'
});

const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
});

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
