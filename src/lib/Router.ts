import Vue from 'vue'
import Router, { RouterOptions } from 'vue-router'
import i18n from './I18n';

import TheContainer from "@/layouts/TheContainer.vue";

// Module: Front (Doesnt have backend. Only UI.)
import FrontDashboard from "@/pages/front/Dashboard.vue";

// Module: Stock
import StockOverview from "@/pages/stock/Overview.vue";
import StockPurchase from "@/pages/stock/Purchase.vue";
import StockProduct from "@/pages/stock/Product.vue";
import StockCreateProduct from "@/pages/stock/CreateProduct.vue";

// Views - Pages
//const Page404 = () => import('./pages/pages/Page404');
//const Page500 = () => import('./pages/pages/Page500');
//const Login = () => import('./pages/pages/Login');
//const Register = () => import('./pages/pages/Register');

// Users
//const Users = () => import('./pages/users/Users');
//const User = () => import('./pages/users/User');

Vue.use(Router);

const config: RouterOptions = {
    mode: 'hash',
    linkActiveClass: 'active',
    // @ts-ignore
    scrollBehavior: () => ({ y: 0 }),
    routes: configRoutes()
};
export default new Router(config);

function configRoutes() {
    return [
        {
            path: '/',
            redirect: '/dashboard',
            name: i18n.t('nav.dashboard').toString(),
            component: TheContainer,
            children: [
                {
                    path: 'stock',
                    redirect: '/stock/overview',
                    name: i18n.t('nav.stock').toString(),
                    component: {
                        render(c: any) {
                            return c('router-view')
                        }
                    },
                    children: [
                        {
                            path: 'overview',
                            name: i18n.t('nav.stock-overview').toString(),
                            component: StockOverview
                        },
                        {
                            path: 'purchase',
                            name: i18n.t('nav.stock-purchase').toString(),
                            component: StockPurchase
                        },
                        {
                            path: 'product/create',
                            name: i18n.t('nav.stock-create-product').toString(),
                            component: StockCreateProduct
                        },
                        {
                            path: 'product/:id',
                            name: i18n.t('nav.stock-product').toString(),
                            component: StockProduct
                        },
                    ]
                },
                {
                    path: 'dashboard',
                    name: i18n.t('nav.dashboard').toString()+' ',
                    component: FrontDashboard
                },/**
                {
                    path: 'users',
                    meta: {label: 'Users'},
                    component: {
                        render(c: any) {
                            return c('router-view')
                        }
                    },
                    children: [
                        {
                            path: '',
                            component: Users,
                        },
                        {
                            path: ':id',
                            meta: {label: 'User Details'},
                            name: 'User',
                            component: User,
                        },
                    ]
                }, */
            ]
        },/**
        {
            path: '/pages',
            redirect: '/pages/404',
            name: 'Pages',
            component: {
                render(c: any) {
                    return c('router-view')
                }
            },
            children: [
                {
                    path: '404',
                    name: 'Page404',
                    component: Page404
                },
                {
                    path: '500',
                    name: 'Page500',
                    component: Page500
                },
                {
                    path: 'login',
                    name: 'Login',
                    component: Login
                },
                {
                    path: 'register',
                    name: 'Register',
                    component: Register
                }
            ]
        } */
    ]
}
