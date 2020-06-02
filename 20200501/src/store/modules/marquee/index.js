import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import types from './types'

export default {
  'namespaced': true,
  'state': {
    'selected_marquee': [],
    'selected_screen': []
  },
  'getters':getters,
  'actions': actions,
  'mutations': mutations,
  'types': types,
}
