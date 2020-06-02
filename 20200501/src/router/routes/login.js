import auth from '../../libs/auth'
export default {
  path: '/login',
  meta: {
      title: '智能拼接控制系统'
  },
  component: resolve => require(['../../views/login'], resolve)  
}