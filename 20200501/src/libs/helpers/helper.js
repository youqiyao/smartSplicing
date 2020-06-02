import Vue from 'vue';

export default {
  install: function(Vue, options ){
    Vue.prototype.$isLang = function (lang) {
      return lang == Vue.config.lang
    }
  }
}