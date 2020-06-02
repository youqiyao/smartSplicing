import Vue from 'vue'
import Router from 'vue-router'

import Util from '../libs/util'
import localstorage from '../libs/helpers/storagelite'
import auth from '../libs/auth'
import login from './routes/login'
import Home from '../views/home'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            meta: { title: '智能拼接控制系统', requiresAuth: true },
            component: Home,
        }, {
            path: '/screen',
            meta: { title: '智能拼接控制系统', requiresAuth: true },
            component: resolve => { require(['@/views/screen/index.vue'], resolve); },
        }, {
            path: '/plan', 
            meta: {  title: '智能拼接控制系统', requiresAuth: true },
            component: resolve => { require(['@/views/plan/index.vue'], resolve); },
        }, {
            path: '/system',
            meta: { title: '智能拼接控制系统', requiresAuth: true},
            component: resolve => { require(['@/views/system/index.vue'], resolve); },
            children: [
                { path: '/', meta: { title: '智能拼接控制系统', requiresAuth: true }, component: resolve => { require(['@/views/system/systemsetting/signalsource.vue'], resolve); } },
                { path: '/nodemanage', meta: { title: '智能拼接控制系统', requiresAuth: true }, component: resolve => { require(['@/views/system/systemsetting/nodemanage.vue'], resolve); } },
                { path: '/bgimgsetting', meta: { title: '智能拼接控制系统', requiresAuth: true }, component: resolve => { require(['@/views/system/systemsetting/bgimgsetting.vue'], resolve); } },
                { path: '/screenpower', meta: { title: '智能拼接控制系统', requiresAuth: true }, component: resolve => { require(['@/views/system/systemsetting/screenpower.vue'], resolve); } },
                { path: '/devicemonitor', meta: { title: '智能拼接控制系统', requiresAuth: true }, component: resolve => { require(['@/views/system/systemsetting/devicemonitor.vue'], resolve); } },
                { path: '/marqueesetting', meta: { title: '智能拼接控制系统', requiresAuth: true }, component: resolve => { require(['@/views/system/systemsetting/marqueesetting.vue'], resolve); } },
            ]
        }, {
            path: '/users',
            meta: { title: '智能拼接控制系统', requiresAuth: true },
            component: resolve => { require(['@/views/users/index.vue'], resolve); },
            children: [
                { path: '/', meta: { title: '智能拼接控制系统', requiresAuth: true }, component: resolve => { require(['@/views/users/userssetting/usersmanage.vue'], resolve); } },
                { path: '/rolemanage', meta: { title: '智能拼接控制系统', requiresAuth: true }, component: resolve => { require(['@/views/users/userssetting/rolemanage.vue'], resolve); } },
                { path: '/logosetting', meta: { title: '智能拼接控制系统', requiresAuth: true }, component: resolve => { require(['@/views/users/userssetting/logosetting.vue'], resolve); } },
            ]
        },
        login
    ]
})


router.beforeEach((to, from, next) => {
    Util.title(this.a.app.$t(to.meta.title));
    Util.theme(localstorage.get('theme'))
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!auth.loggedIn()) {
            next({
                path: 'login',
                query: {redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

router.afterEach((to, from, next) => {

})

export default router
