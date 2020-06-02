import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

import home from './modules/home'
import access from './modules/access'
import header from './modules/header'
import screen from './modules/screen'
import marquee from './modules/marquee'
import node from './modules/node'
import scene from './modules/scene'
import plan from './modules/plan'
import source from './modules/source'
import sourcegroup from './modules/sourcegroup'
import user from './modules/user'
import role from './modules/role'
import screenpower from './modules/screenpower'

Vue.use(Vuex) 

export default new Vuex.Store({
  'state': {
    previewLogoStatus: 0,
    previewLogoUrl: '',
    logoPath: 'http://' + location.hostname + ':8888' + '/static/img/logo/logo.png' + '?timestamp=' + Date.now(),
    windowSize: null,
    allNodeInfo: [],
    allNodeStatus: [],
  },
  'getters': getters,
  'actions': actions,
  'mutations': mutations,
  'modules': {
    'home': home,
    'access': access,
    'header': header,
    'screen': screen,
    'marquee': marquee,
    'node': node,
    'scene': scene,
    'plan': plan,
    'source': source,
    'sourcegroup': sourcegroup,
    'user': user,
    'role': role,
    'screenpower': screenpower
  }
})
