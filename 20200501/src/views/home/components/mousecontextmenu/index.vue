<style lang="less" scoped src="./styles/mousecontextmenu.less"></style>
<template>
    <div class="mouse-action-section">
        <ContextMenu
          ref="contextmenu"
          v-if="data && data.length"
          class="context-menu"
          :data="data"
          :style="style"
          @handleCallback="handleCallback"
        ></ContextMenu>
    </div>
</template>
<script type="text/javascript">
    import ContextMenu from '../../../../components/contextmenu'

    export default {
        name: 'mousecontextmenu',
        data() {
            return {
                style: {},
                data: null, 
            }
        },
        components: {
            ContextMenu
        },
        methods: {

            /*
             * 获取计算之后的样式
             */
            getStyle: function($el) {
                if (window.getComputedStyle)
                    return window.getComputedStyle($el, null)    // 非IE
                else 
                    return $el.currentStyle  // IE
            },

            /*
             * 隐藏弹出框
             */
            hide () {
                  this.data = null
            },

            /*
             * 设置弹出框内容和样式
             */
            setMenu(position, data) {
                this.data = data
                var style = {
                  left: position.x + 'px',
                  top: position.y + 'px',
                }

                this.style = style
                //保证渲染的窗口在可见窗口内，在计算样式后的再次修改，保证布局合理
                this.$nextTick(function(){
                    var browerWindowWidth = window.innerWidth;
                    var browerWindowHeight = window.innerHeight;
                    var el_style = this.getStyle(this.$refs['contextmenu'].$el) 
                    var width = parseFloat(el_style.width.replace('px', ''))
                    var height = parseFloat(el_style.height.replace('px', ''))
                    var newStyle = {}
                    if (position.x + width > browerWindowWidth) 
                        newStyle.left = (browerWindowWidth - width) + 'px'
                    else
                        newStyle.left = position.x

                    if (position.y + height > browerWindowHeight) 
                        newStyle.top = (browerWindowHeight - height) + 'px'
                    else
                        newStyle.top = position.y

                    this.style = newStyle
                })
            },

            handleCallback(funcName, data) {
                funcName && this.$emit('select-callback', funcName, data)
                this.data && this.hide()    
            },

        },
    }
</script>