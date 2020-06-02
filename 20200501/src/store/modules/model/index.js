import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import types from './types'

export default {
  'namespaced': true,
  'state': {
    'screen': [],
    'active_screen_id': 0,

    //'allNodeStatus': [],

    'signal_group': [],
    'active_signal_id': 0,
    'active_signal_url': '',
    'all_signal_status': [],

    'template': [],
    'template_total': 0,
    'template_status': false,
    'active_template_id': 0,
    
    'plan': [],
    'plan_total': 0,
    'active_plan_id': 0,

    'window': [],
    'active_window_id': 0,
    'actvie_window_source_url': '',
    
    'chevron_right': 10,

    'contextmenu_window_status': false
  },
  'getters':getters,
  'actions': actions,
  'mutations': mutations,
  'types': types,
}
