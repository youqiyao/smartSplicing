export default {
    resetState(state) {
        state.screen = []
        state.active_screen_id = 0

        state.signal_group = []
        state.all_signal_status = []
        state.active_signal_id = 0
        state.active_signal_url = 0

        state.scene = []
        state.scene_total = 0
        state.active_scene_id = 0

        state.template = []
        state.template_total = 0
        state.template_status = false
        state.template_run_id = 0
        

        state.window = []
        state.window_id = 0
        state.actvie_window_source_url = ''

        state.plan = []
        state.plan_total = 0
        state.plan_id = 0
               
        state.chevron_right = 10
        state.contextmenu_window_status = false
    },

    /**
     * 更新屏组列表
     * @param {*} state 
     * @param {*} value 
     */
    setScreen(state, value) {
        state.screen = value
    },

    /**
     * 更新当前激活的屏组ID
     * @param {*} state 
     * @param {*} value 
     */
    setActiveScreenId(state, value) {
        state.active_screen_id = value
    },

    /**
     * 更新信号源分组信息(含信源和分组)
     * @param {*} state 
     * @param {*} value 
     */
    setSignalGroup(state, value) {
        state.signal_group = value
    }, 

    /**
     * 更新所有的信源状态
     * @param {*} state 
     * @param {*} value 
     */
    setAllSignalStatus(state, value) {
        state.all_signal_status = value
    },

    /**
     * 更新当前选中激活的信源ID
     * @param {*} state 
     * @param {*} value 
     */
    setActiveSignalId (state, value) {
        state.active_signal_id = value
    },
    
    /**
     * 更新当前选中的激活的信源的URL地址
     * @param {*} state 
     * @param {*} value 
     */
    setActiveSignalUrl (state, value) {
        state.active_signal_url = value
    }, 

    /**
     * 更新场景信息
     * @param {*} state 
     * @param {*} value 
     */
    setScene(state, value) {
        state.scene = value 
    }, 

    /**
     * 更新场景的总数
     * @param {*} state 
     * @param {*} value 
     */
    setSceneTotal(state, value) {
        state.scene_total = value
    },

    /**
     * 更新当前激活的场景ID
     * @param {*} state 
     * @param {*} value 
     */
    setAcitiveSceneId (state, value) {
        state.active_scene_id = value
    },

    /**
     * 更新模板信息
     * @param {*} state 
     * @param {*} value 
     */
    setTemplate(state, value) {
        state.template = value 
    },

    /**
     * 更新模板的总数
     * @param {*} state 
     * @param {*} value 
     */
    setTemplateTotal(state, value) {
        state.template_total = value
    },

    /**
     * 更新是否开启模板状态
     * @param {*} state 
     * @param {*} value 
     */
    setTemplateStatus(state, value) {
        state.template_status = value
    },

    /**
     * 更新启用的模板ID
     * @param {*} state 
     * @param {*} value 
     */
    setActiveTemplateId (state, value) {
        state.active_template_id = value
    },

    /**
     * 更新预案列表
     * @param {*} state 
     * @param {*} value 
     */
    setPlan(state, value) {
        state.plan = value
    },

    /**
     * 更新预案的总数
     * @param {*} state 
     * @param {*} value 
     */
    setPlanTotal(state, value) {
        state.plan_total = value
    },

    /**
     * 更新当前在跑的预案
     * @param {*} state 
     * @param {*} value 
     */
    setActivePlanId (state, value) {
        state.active_plan_id = value
    }, 

    /**
     * 更新窗口列表
     * @param {*} state 
     * @param {*} value 
     */
    setWindow(state, value) {
        state.window = value
    },

    /**
     * 更新当前激活的窗口ID
     * @param {*} state 
     * @param {*} value 
     */
    setActiveWindowId (state, value) {
        state.active_window_id = value
    },
    
    /**
     * 更新当前激活窗口对应的信源地址(可用于PTZ)
     * @param {*} state 
     * @param {*} value 
     */
    setActiveWindowSourceUrl(state, value) {
        state.actvie_window_source_url = value
    }, 

    /**
     * 更新右侧云台控制的显示隐藏
     * @param {*} state 
     * @param {*} value 
     */
    setChevronRight(state, value) {
        state.chevron_right = value
    },

    /**
     * 更新右击弹出框的显示状态栏
     * @param {*} state 
     * @param {*} value 
     */
    setContextmenuWindowStatus(state, value) {
        stste.contextmenu_window_status = value
    }
}
