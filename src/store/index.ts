import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

// Modules
import Stock from './Stock';
import Session from './Session';

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        Stock,
        Session,
    },
    state: {},
    mutations: {},
    actions: {},
    plugins: [
        (new VuexPersistence({ storage: window.localStorage })).plugin
    ]
});
