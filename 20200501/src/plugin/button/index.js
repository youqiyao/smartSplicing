import Btn from './src/button';

/* istanbul ignore next */
Btn.install = function(Vue) {
  Vue.component(Btn.name, Btn);
};

export default Btn;
