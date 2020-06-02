import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Locales from './locale';
import zhLocale from 'element-ui/src/locale/lang/zh-CN';
import enLocale from 'element-ui/src/locale/lang/en';

Vue.use(VueI18n);

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === '简体中文' || navLang === 'English') ? navLang : false;
const lang = window.localStorage.getItem('lang') || localLang || '简体中文';

Vue.config.lang = lang;
// 多语言配置
const locales = Locales;
const mergeZH = Object.assign(zhLocale, locales['简体中文']);
const mergeEN = Object.assign(enLocale, locales['English']);

Vue.locale('简体中文', mergeZH);
Vue.locale('English', mergeEN); 
