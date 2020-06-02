<style lang="less" src="./styles/cloud.less" scoped></style>
<template>
       <div class="homemenu">
            <!--云台控制面板-->
            <div class="cloud-panel" ref="cloudPanel">
              <!--九个方向控制方向的按钮-->
              <div class="direction">
                  <Btn @mousedown="moveControl(5)" @mouseup="stopAction"><i class="fa fa-caret-up rotate-anti"></i></Btn>
                  <Btn @mousedown="moveControl(1)" @mouseup="stopAction"><i class="fa fa-caret-up"></i></Btn>
                  <Btn @mousedown="moveControl(6)" @mouseup="stopAction"><i class="fa fa-caret-up rotate"></i></Btn>
                  <Btn @mousedown="moveControl(3)" @mouseup="stopAction"><i class="fa fa-caret-left"></i></Btn>
                  <!--复位按钮-->
                  <el-button @click="positionToOrigin"  class="mid-dire">
                      <i class="fa fa-rotate-left"></i>
                      <i class="fa fa-rotate-right"></i>
                  </el-button>
                   <!--向右按钮-->
                  <Btn @mousedown="moveControl(4)" @mouseup="stopAction"><i class="fa fa-caret-right"></i></Btn>
                  <!--左下按钮-->
                  <Btn  @mousedown="moveControl(7)" @mouseup="stopAction"><i class="fa fa-caret-down rotate"></i></Btn>
                  <Btn @mousedown="moveControl(2)" @mouseup="stopAction"><i class="fa fa-caret-down"></i></Btn>
                  <Btn @mousedown="moveControl(8)" @mouseup="stopAction"><i class="fa fa-caret-down rotate-anti"></i></Btn>
              </div>
              <!--方向按钮右边的按钮组-->
              <div class="rtool">
                <div class="outer">
                  <!--调焦-->
                  <el-button-group>
                    <el-tooltip class="item" effect="dark" :content="$t('缩小') + '-'" placement="top">
                      <Btn @mousedown="foucsing(0)" @mouseup="stopAction" class="bor-rig"><i class="fa fa-search-minus"></i></Btn>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('放大') + '+'" placement="top">
                      <Btn @mousedown="foucsing(1)" @mouseup="stopAction" class="bor-lef"><i class="fa fa-search-plus"></i></Btn>
                    </el-tooltip>
                  </el-button-group>
                </div>
                <div class="outer">
                  <!--聚焦-->
                  <el-button-group>
                    <el-tooltip class="item" effect="dark" :content="$t('聚焦') + '-'" placement="top">
                      <Btn @mousedown="faring(0)" @mouseup="stopAction" class="bor-rig"><i class="fa fa-minus-circle"></i></Btn>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('聚焦') + '+'" placement="top">
                      <Btn @mousedown="faring(1)" @mouseup="stopAction" class="bor-lef"><i class="fa fa-plus-circle"></i></Btn>
                    </el-tooltip>
                  </el-button-group>
                </div>
                <div class="outer">
                  <!--调光圈-->
                  <el-button-group>
                    <el-tooltip class="item" effect="dark" :content="$t('光圈') + '-'" placement="top">
                        <Btn @mousedown="irising(0)" @mouseup="stopAction" class="bor-rig"><i class="fa fa-life-ring"></i></Btn>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('光圈') + '+'" placement="top">
                        <Btn @mousedown="irising(1)" @mouseup="stopAction" class="bor-lef"><i class="fa fa-life-ring"></i></Btn>
                    </el-tooltip>
                  </el-button-group>
                </div>
              </div>
              <!--滑动控制速度的进度条-->
              <div class="slider">
                <el-slider v-model="speedVal" :max="100" @change="handleSpeedValChange"></el-slider>
                <input type="text" v-model="speedVal2"  @change="handleSpeedVal2Change"/>
              </div>
              <!---->
              <div class="midtool">
                <el-button-group>
                  <el-tooltip class="item" effect="dark" :content="$t('一键巡航')" placement="top">
                    <el-button :disabled="true"  class="bor-rig"><i class="fa fa-anchor"></i></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" :content="$t('雨刷')" placement="top">
                    <el-button :disabled="true" class="bor-lef bor-rig"><i class="fa fa-tachometer"></i></el-button>
                  </el-tooltip>
                  <el-button  class="bor-lef bor-rig"></el-button>
                  <el-button  class="bor-lef bor-rig"></el-button>
                  <el-button  class="bor-lef"></el-button>
                </el-button-group>
              </div>
              <div class="bottool">
                  <el-tabs type="border-card" >
                    <!--预置点面板-->
                    <el-tab-pane>
                        <span slot="label">
                            <el-tooltip class="item" effect="dark" :content="$t('预置点')" placement="top">
                                <i class="fa fa-flag"></i>
                            </el-tooltip>
                        </span>
                        <ul class="setting">
                            <li v-for="(item, index) in list" :key="'preset_' + index" class="set-item">
                                <span class="set-id">{{item.id}}</span>
                                <span class="set-name">{{item.name}}</span>
                                <span class="set-font">
                                    <el-tooltip class="item" effect="dark" :content="$t('设置')" placement="top">
                                      <i class="fa fa-gear" @click="presetSetting(item.id)"></i>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" :content="$t('调用')" placement="top">
                                      <i class="fa fa-check-square" @click="presetCalling(item.id)"></i>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" :content="$t('删除')" placement="top">
                                      <i class="fa fa-close" @click="presetDel(item.id)"></i>
                                    </el-tooltip>
                                </span>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane :disabled="true">
                        <span slot="label" class="">
                            <el-tooltip class="item" effect="dark" :content="$t('巡航')" placement="top">
                              <i class="fa fa-history"></i>
                            </el-tooltip>
                        </span>
                      <ul class="setting">
                            <li v-for="(item, index) in navs" :key="'cruising_' + index" class="set-item nav">
                                  {{item.name}}
                                <span class="nav-font">
                                    <el-tooltip class="item" effect="dark" :content="$t('播放')" placement="top">
                                      <i class="fa fa-play"></i>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" :content="$t('停止')" placement="top">
                                      <i class="fa fa-stop"></i>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" :content="$t('设置')" placement="top">
                                      <i class="fa fa-gear" ></i>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" :content="$t('删除')" placement="top">
                                      <i class="fa fa-close"></i>
                                    </el-tooltip>
                                </span>
                            </li>
                        </ul>
                    </el-tab-pane>
                </el-tabs>
              </div>
       </div>
      </div>
</template>
<script>
    export default {
      name: "rmenu",
      data() {
        return {
            speedVal:50,
            speedVal2: 50,
            preset_list: [],
            list:[
              {"id":1, "name":'预置1'},{"id":2, "name":'预置1'},{"id":3, "name":'预置1'},
              {"id":4, "name":'预置1'},{"id":5, "name":'预置1'},{"id":6, "name":'预置1'},
              {"id":7, "name":'预置1'},{"id":8, "name":'预置1'},{"id":9, "name":'预置1'},
              {"id":10, "name":'预置1'},{"id":11, "name":'预置1'},{"id":12, "name":'预置1'},
              {"id":13, "name":'预置1'},{"id":14, "name":'预置1'},{"id":15, "name":'预置1'},
              {"id":16, "name":'预置1'},{"id":17, "name":'预置1'},{"id":18, "name":'预置1'},
              {"id":19, "name":'预置1'},{"id":20, "name":'预置1'},{"id":21, "name":'预置1'},
              {"id":22, "name":'预置1'},{"id":23, "name":'预置1'},{"id":24, "name":'预置1'},
              {"id":25, "name":'预置1'},{"id":26, "name":'预置1'},{"id":27, "name":'预置1'},
              {"id":28, "name":'预置1'},{"id":29, "name":'预置1'},{"id":30, "name":'预置1'},
            ],
            navs:[    
              {"name":'巡航路径1'},{"name":'巡航路径2'},{"name":'巡航路径11'},
              {"name":'巡航路径222'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
              {"name":'巡航路径1'},{"name":'巡航路径1'},{"name":'巡航路径1'},
            ],
        }
      },
      computed: {
        //信号源url
        signalUrl: function() {
            return this.$store.state.home.actvie_window_source_url                    
        },
      },
      created() {
        // this.getPresetList()
      },
      methods: {
        /* 
         * 移动
         */
        moveControl(direVal) {
           if(!this.signalUrl) {
            this.$message({
              'type': 'warning',
              'message': this.$t('请先从屏组上选择窗口'),
              'showClose': true,
              'duration': 1500
            })
            return
          }
          var url = '/api.v2.do.cloud.move'
          var params = {
              userid: this.$auth.getuid(),
              body: {
                  ID: this.signalUrl,
                  MoveCmd: direVal,
                  Speed: this.speedVal
              }
          }
          this.$http(url, params).then((res) => {
              if (res.data.status !== 0) {
                  this.$message({
                      'type': 'warning',
                      'message': this.$t(this.$msg[res.data.status]),
                      'showClose': true,
                      'duration': 1500
                  })
                  return
              }
          }).catch((err) => {})
        },
        /* 
         * 停止
         */
        stopAction() {
          if(!this.signalUrl) return
          var url = '/api.v2.do.cloud.stop'
            var params = {
                userid: this.$auth.getuid(),
                body: {
                    ID: this.signalUrl,
                }
            }
            this.$http(url, params).then((res) => {
                if (res.data.status !== 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                } 
            }).catch((err) => {})
        },
        /* 
         * 复位
         */
        positionToOrigin() {
           if(!this.signalUrl) {
            this.$message({
              'type': 'warning',
              'message': this.$t('请先从屏组上选择窗口'),
              'showClose': true,
              'duration': 1500
            })
            return
          }
          var url = '/api.v2.do.cloud.reposition'
          var params = {
              userid: this.$auth.getuid(),
              body: {
                ID: this.signalUrl,
              }
          }
          this.$http(url, params).then((res) => {
            if(res.data.status != 0) {
              this.$message({
                'type': 'warning',
                'message': this.$t(this.$msg[res.data.status]),
                'showClose': true,
                'duration': 1500
              })
              return
            }
          }).catch((err) => {})
        },
        /* 
         * 放大缩小
         */
        foucsing(zoomVal) {
          if(!this.signalUrl) {
            this.$message({
              'type': 'warning',
              'message': this.$t('请先从屏组上选择窗口'),
              'showClose': true,
              'duration': 1500
            })
            return
          }
          var url = '/api.v2.do.cloud.zoom'
          var params = {
            userid: this.$auth.getuid(),
            body: {
              ID: this.signalUrl,
              Zoom: zoomVal
            }
          }
          this.$http(url, params).then((res) => {
            if(res.data.status != 0) {
              this.$message({
                'type':'warning',
                'message': this.$t(this.$msg[res.data.status]),
                'showClose': true,
                'duration': 1500
              })
              return
            }
          }).catch((err) => {})
        },
         /* 
         * 调焦距
         */
        faring(farVal) {
          if(!this.signalUrl) {
            this.$message({
              'type': 'warning',
              'message': this.$t('请先从屏组上选择窗口'),
              'showClose': true,
              'duration': 1500
            })
            return
          }
          var url = '/api.v2.do.cloud.far'
          var params = {
            userid: this.$auth.getuid(),
            body: {
              ID: this.signalUrl,
              Far: farVal
            }
          }
          this.$http(url, params).then((res) => {
            if(res.data.status != 0) {
              this.$message({
                'type':'warning',
                'message': this.$t(this.$msg[res.data.status]),
                'showClose': true,
                'duration': 1500
              })
              return
            }
          }).catch((err) => {})
        },
         /* 
         * 光圈
         */
        irising(irisVal) {
          if(!this.signalUrl) {
            this.$message({
              'type': 'warning',
              'message': this.$t('请先从屏组上选择窗口'),
              'showClose': true,
              'duration': 1500
            })
            return
          }
          var url = '/api.v2.do.cloud.iris'
          var params = {
            userid: this.$auth.getuid(),
            body: {
              ID: this.signalUrl,
              IRIS: irisVal
            }
          }
          this.$http(url, params).then((res) => {
            if(res.data.status != 0) {
              this.$message({
                'type':'warning',
                'message': this.$t(this.$msg[res.data.status]),
                'showClose': true,
                'duration': 1500
              })
              return
            }
          }).catch((err) => {})
        },
        handleSpeedValChange() {
          this.speedVal2 = this.speedVal.toString();
        },

        handleSpeedVal2Change() {
          var reg = new RegExp("^(0|[1-9][0-9]*)$")
          var value = this.speedVal2
          if(!reg.test(value)){
              this.$message({
                'type': 'warning',
                'message': this.$t('请输入0-100之间的数字'),
                'showClose': true,
                'duration': 1500
              })
              this.speedVal2 = this.speedVal.toString()
              return
          }
          this.speedVal = parseInt(this.speedVal2)
        },
         /* 
         * 获取预置位列表
         */
        getPresetList() {
          var url = '/api.v2.do.cloud.getPreset'
          var params = {
            userid: this.$auth.getuid(),
            body: {
              ID: this.signalUrl
            }
          }
          this.$http(url, params).then((res) => {
            if(res.data.status != 0) {
              this.$message({
                'type':'warning',
                'message': this.$t(this.$msg[res.data.status]),
                'showClose': true,
                'duration': 1500
              })
              return
            }
            this.preset_list = res.data.msg.body
          }).catch((err) => {})
        },
        /* 
         * 设置预置位
         */
        presetSetting(id) {
          if(!this.signalUrl) {
            this.$message({
              'type': 'warning',
              'message': this.$t('请先从屏组上选择窗口'),
              'showClose': true,
              'duration': 1500
            })
            return
          }
          var url = '/api.v2.do.cloud.setPreset'
          var params = {
            userid: this.$auth.getuid(),
            body: {
              ID: this.signalUrl,
              PresetID: id
            }
          }
          this.$http(url, params).then((res) => {
            if(res.data.status != 0) {
              this.$message({
                'type':'warning',
                'message': this.$t(this.$msg[res.data.status]),
                'showClose': true,
                'duration': 1500
              })
              return
            }
          }).catch((err) => {})
        },
        /* 
         * 调用预置位
         */
         presetCalling(id) {
          if(!this.signalUrl) {
            this.$message({
              'type': 'warning',
              'message': this.$('请先从屏组上选择窗口'),
              'showClose': true,
              'duration': 1500
            })
            return
          }
          var url = '/api.v2.do.cloud.callPreset'
          var params = {
            userid: this.$auth.getuid(),
            body: {
              ID: this.signalUrl,
              PresetID: id
            }
          }
          this.$http(url, params).then((res) => {
            if(res.data.status != 0) {
              this.$message({
                'type':'warning',
                'message': this.$t(this.$msg[res.data.status]),
                'showClose': true,
                'duration': 1500
              })
              return
            }
          }).catch((err) => {})
        },
        /* 
         * 删除预制置位
         */
        presetDel(id) {
          if(!this.signalUrl) {
            this.$message({
              'type': 'warning',
              'message': this.$t('请先从屏组上选择窗口'),
              'showClose': true,
              'duration': 1500
            })
            return
          }
          var url = '/api.v2.do.cloud.delPreset'
          var params = {
            userid: this.$auth.getuid(),
            body: {
              ID: this.signalUrl,
              PresetID: id
            }
          }
          this.$http(url, params).then((res) => {
            if(res.data.status != 0) {
              this.$message({
                'type':'warning',
                'message': this.$t(this.$msg[res.data.status]),
                'showClose': true,
                'duration': 1500
              })
              return
            }
          }).catch((err) => {})
        },
      }
  }
</script>