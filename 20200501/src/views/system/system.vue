<style lang="less" src="./styles/system.less"></style>
<template>
  <div class="system">
      <el-row>
          <!--<el-col :span="24">
          <div class="title"><span>{{$t('系统设置')}}</span></div>
          </el-col>-->
      </el-row>
      <div class="systemcontainer">
          <div class="systemaside">
              <!--<el-menu :default-active="$route.path" theme="light" mode="vertical" router>
                  <el-menu-item index="/system" ><i class="fa fa-podcast mar-rig"></i>{{$t('信号源')}}</el-menu-item>
                  <el-menu-item index="/bgimgsetting" ><i class="fa fa-photo mar-rig"></i>{{$t('底图管理')}}</el-menu-item>
                  <el-menu-item index="/marqueesetting" ><i class="fa fa-language mar-rig"></i>{{$t('字幕设置')}}</el-menu-item>
                  <el-menu-item index="/nodemanage" ><i class="fa fa-gear mar-rig"></i>{{$t('直通设置')}}</el-menu-item>
                  <el-menu-item index="/screenpower"><i class="fa fa-battery-full mar-rig"></i>{{$t('屏组电源')}}</el-menu-item>
                  <el-menu-item v-show="false" index="/devicemonitor"><i class="fa fa-area-chart mar-rig"></i>{{$t('设备监控')}}</el-menu-item>
              </el-menu>-->
          </div>
        <router-view></router-view>
      </div>
  </div>
</template>
<script>
    export default {
        name: 'system',
        components: {
            
        },
    }
</script>