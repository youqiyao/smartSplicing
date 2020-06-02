<style src="./styles/index.less" lang="less"></style>
<template>
    <div class="audio" >
        <el-dialog
            :title="this.$t('设置音量')"
            :visible.sync="modal"
            :close-on-click-modal="false"
            size="tiny"    
        >
            <div class="volume-block">
                <div class="volume-icon" @click="switchmute">
                    <i :class="{'fa': true, 'fa-volume-up': !mute, 'fa-volume-off': !!mute}"></i>
                </div>
                <div class="volume-slider">
                <el-slider
                  v-model="volume"
                  :step="5"
                  :min="0"
                  :max="100"
                  :disabled="!!mute"
                  show-stops
                  @change="volumeChange">
                </el-slider>
                </div>
                <div class="volume-value">
                    <span>{{volume}}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                modal: false,
                volume: 0,
                mute: 0
            }
        },
        methods: {
            _setmodal: function(status) {
                this.modal = status
            },

            setmute: function(data) {
                this.mute = data
            },

            setvolume: function(data) { 
                this.volume = data
            },

            switchmute: function() {
                var data = this.mute ? 0 : 1
                this.$emit('audio-event', 'onSetMute', data)
            },

            volumeChange: function(val) {
              this.$emit('audio-event', 'onVolumeChange', val)
            }
        }
    }
</script>