<style lang='less' src="./app.less"></style>
<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
import localstorage from './libs/helpers/storagelite'
 
  export default {
    data() {
      return {

      }
    },
    beforeCreate() {
      if(location.pathname!="/") {
          location.href = "/";
      }
    },
    created() {
        this.initWindowSize()
    },
    mounted() {
      window.onresize = this.onWindowResize
      // this.registerElementEvent()
    },

    methods: {
      /*
       * 初始化窗口的大小比例
       */ 
      initWindowSize() {
        var windowSize = window.innerWidth + '/' + window.innerHeight
        this.$store.commit('setWindowSize', windowSize)
      },
      /*
       * 窗口大小变化 
       */
      onWindowResize(e) {
        var windowSize = e.srcElement.innerWidth + '/' + e.srcElement.innerHeight
        this.$store.commit('setWindowSize', windowSize)
      },

      /*
       * 注册元素事件
       */
      registerElementEvent() {
        this.$el.addEventListener('contextmenu', function(e){
          e.preventDefault()
        })
      },
    }
  }
</script>