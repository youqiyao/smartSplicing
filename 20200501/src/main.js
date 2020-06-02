import Vue from 'vue';
import App from './app.vue';
import router from './router'
import store from './store';
import './i18n/index.js';
import ElementUI from 'element-ui';
import Tree from './plugin/tree';
import Btn from './plugin/button';
import 'element-ui/lib/theme-chalk/index.css';
import ajax from './libs/ajax';
import lodash from 'lodash';
import auth from './libs/auth';
import msg from './msg'
import helper from './libs/helpers/helper'
import 'font-awesome/css/font-awesome.css'

Vue.use(ElementUI);
Vue.use(Tree);
Vue.use(Btn);
Vue.use(ajax);
Vue.use(helper);
Vue.prototype.$lodash = lodash;
Vue.prototype.$auth = auth;
Vue.prototype.$msg = msg;


// Vue.config.keyCodes = {
//   "login-on-keyCode": 13
// };

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});