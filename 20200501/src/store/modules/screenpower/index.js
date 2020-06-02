import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import types from './types'

export default {
  'namespaced': true,
  'state': {
    'screen_action_state': []
  },
  'getters':getters,
  'actions': actions,
  'mutations': mutations,
  'types': types,
}
