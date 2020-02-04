import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('../containers/TheContainer');

// Views
const Dashboard = () => import('../views/Dashboard');

// Views - Stock
const StockOverview = () => import('../views/stock/Overview');
const StockPurchase = () => import('../views/stock/Purchase');
const StockProduct = () => import('../views/stock/Product');

// Views - Pages
const Page404 = () => import('../views/pages/Page404');
const Page500 = () => import('../views/pages/Page500');
const Login = () => import('../views/pages/Login');
const Register = () => import('../views/pages/Register');

// Users
const Users = () => import('../views/users/Users');
const User = () => import('../views/users/User');

Vue.use(Router);

export default new Router({
    mode: 'hash', // https://router.vuejs.org/api/#mode
    linkActiveClass: 'active',
    scrollBehavior: () => ({y: 0}),
    routes: configRoutes()
})

function configRoutes() {
    return [
        {
            path: '/',
            redirect: '/dashboard',
            name: 'Home',
            component: TheContainer,
            children: [
                {
                    path: 'stock',
                    redirect: '/stock/overview',
                    name: 'Stock',
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [
                        {
                            path: 'overview',
                            name: 'Overview',
                            component: StockOverview
                        },
                        {
                            path: 'purchase',
                            name: 'Purchase',
                            component: StockPurchase
                        },
                        {
                            path: 'product/:id',
                            name: 'Product',
                            component: StockProduct
                        },
                    ]
                },
                {
                    path: 'dashboard',
                    name: 'Dashboard',
                    component: Dashboard
                },
                {
                    path: 'users',
                    meta: {label: 'Users'},
                    component: {
                        render(c) {
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
                },
            ]
        },
        {
            path: '/pages',
            redirect: '/pages/404',
            name: 'Pages',
            component: {
                render(c) {
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
        }
    ]
}

