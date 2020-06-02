import Tree from './src/tree.vue';
//在原有el-tree组件的基础上增加disable设置禁用的样式和单独隐藏checkbox的功能
/* istanbul ignore next */
Tree.install = function(Vue) {
  Vue.component(Tree.name, Tree);
};

export default Tree;
