<style lang="less" scoped src="./styles/index.less"></style>
<template>
  <div class="context-menu">
    <ul>
      <li
        v-for="item in data" v-if="!item.hidden"
        :class="{disabled:item.disabled,divide:item.type=='divide','list-item':item.type!=='divide'}"
        @click="click(item)"
      >
        {{item.text}}
      </li>
    </ul>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: 'contextmenu',
    props:{
      data: Array
    },
    methods: {
      click: function (item) {
        if(item.disabled) return;
        if(item.callback){
          this.$emit('handleCallback', item.callback, item.data)
        }
      },
    },
    filter: {

    }
  }
</script>