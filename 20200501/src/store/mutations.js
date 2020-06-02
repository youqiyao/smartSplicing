import Vue from 'vue';


export default {
    setAllNodeStatus(state, value) {
        state.allNodeStatus = value
    },

    setAllNodeInfo(state, value) {
        state.allNodeInfo = value
    },

    setPreviewLogoStatus(state, value) {
        state.previewLogoStatus = value
    },

    setPreviewLogoUrl(state, value) {
        state.previewLogoUrl = value
    },

    setLogoPath(state, value) {
        state.logoPath= value
    },

    /**
     * 设置当前窗口比例
     * @param {*} state 
     * @param {*} value 
     */
    setWindowSize(state, value) {
        state.windowSize = value
    },
    
    /**
     * 设置当前语言
     * @param {*} state 
     * @param {*} value 
     */
    setLanguage(state, value) {
        //state.lang = value
        localStorage.lang = value
        Vue.config.lang = value
    },
   
}
