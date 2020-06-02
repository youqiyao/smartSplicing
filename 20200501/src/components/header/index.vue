<style lang="less" src="./styles/index.less"></style>
<template>
	
	<div class="headercont">
				<ul class="list">
					
					<!--<li :class="{active4:!isactive,'active5':isactive}">
						<i class="fa fa-user-circle il" :class="{active:isactive}"></i>
						<div class="dialoglist userName" @click='clickhome' >{{userName}}</div>
					</li>-->
					 <!--导航栏切换-->
					<li :class="{active4:!isactive,'active5':isactive}" @click='clickhome'>
						<i class="fa fa-home mar-rig il" :class="{active:isactive}" ></i>
						<div class="dialoglist" >{{$t('主控制台')}}</div>
					</li>
					
					<li :class="{active4:!isactive,'active5':isactive}" @click='clicksystem'>
						<i class="fa fa-tv mar-rig il" :class="{active:isactive}" ></i>
						<div class="dialoglist" >{{$t('信号分组')}}</div>
					</li>
						
					<li :class="{active4:!isactive,'active5':isactive}" @click='clickscreen'>
						<i class="fa fa-th mar-rig il" :class="{active:isactive}" ></i>
						<div class="dialoglist" >{{$t('屏组管理')}}</div>
					</li>
					
					<li :class="{active4:!isactive,'active5':isactive}" @click='clickplan'>
						<i class="fa fa-window-restore mar-rig il" :class="{active:isactive}" ></i>
						<div class="dialoglist" @click='clickplan'>{{$t('轮巡设置')}}</div>
					</li>
					
					
					<li :class="{active4:!isactive,'active5':isactive}" @click='clickbgset'>
						<i class="fa fa-photo mar-rig il" :class="{active:isactive}" ></i>
						<div class="dialoglist">{{$t('底图设置')}}</div>
					</li>
					
					<li :class="{active4:!isactive,'active5':isactive}" @click='clickmarquee'>
						<i class="fa fa-language mar-rig il" :class="{active:isactive}" ></i>
						
						<div class="dialoglist" >{{$t('字幕设置')}}</div>
					</li>
					
					<li :class="{active4:!isactive,'active5':isactive}" @click='clickmanage'>
						<i class="fa fa-gear mar-rig il" :class="{active:isactive}" ></i>
						<div class="dialoglist" >{{$t('直通设置')}}</div>
					</li>
						
					<li :class="{active4:!isactive,'active5':isactive}" @click='clickscreenpower'>
						<i class="fa fa-battery-full mar-rig il" :class="{active:isactive}" ></i>
						<div class="dialoglist" >{{$t('开机计划')}}</div>
					</li>
					
					
					
					
					
					
					
					
					
					<!--<li :class="{active4:!isactive,'active5':isactive}">
						<i class="fa fa-users mar-rig il" :class="{active:isactive}"></i>
						<div class="dialoglist" @click='clickusers'>{{$t('用户')}}</div>
					</li>-->
					
					
					 <!--主题切换下拉框-->
					<li :class="{active4:!isactive,'active5':isactive}">
				               <i class="fa fa-magic il" :class="{active:isactive}"></i>
						
						<div class="skin" style="opacity: 0;width: 100%;height: 100%;" >
						<transition name="fadeIn">
				            <el-dropdown trigger="click" style="opacity: 0;width: 100%;height: 100%;" @command="skinChange" menu-align='start'>
				            <span  class='skin-change'>
  							<i class="fa fa-magic" style="opacity: 0;width: 100%;height: 100%;"></i>
				            </span>
				            <el-dropdown-menu slot="dropdown" class="skin-dropdown">
				              <el-dropdown-item command="default"><div class="color default"></div></el-dropdown-item>
				              <el-dropdown-item command="theme-a"><div class="color theme_a"></div></el-dropdown-item>
				              <el-dropdown-item command="theme-b"><div class="color theme_b"></div></el-dropdown-item>
				              <el-dropdown-item command="theme-c"><div class="color theme_c"></div></el-dropdown-item>
				              <el-dropdown-item command="theme-d"><div class="color theme_d "></div></el-dropdown-item>
				            </el-dropdown-menu>
				            </el-dropdown>
				          </transition>
				          </div>
					</li>
					
					<!--密码重置组件-->
					<!--<li :class="{active4:!isactive,'active5':isactive}">
						<PassWordReset />
					</li>
					-->
            		<!--关于软件组件-->
					<!--<li :class="{active4:!isactive,'active5':isactive}">
						<About />
					</li>-->
					
           			<!--用户退出系统-->
					<!--<li :class="{active4:!isactive,'active5':isactive}">
						<Back />
					</li>-->
					
					
				</ul>
			</div>
   
      
</template>
<script>
import Back from '../back/index.vue'
import About from '../about/index.vue'
import PassWordReset from '../passWordReset/index.vue'
import localstorage from '../../libs/helpers/storagelite'

   export default {
    prop: ['activeitem','isactive'],
    data() {
        return {
          modal: false,
          isSmall: false,
          userName:localstorage.get('manager'),
          isactive:false
        }
    },
    computed: {
       logoUrl: function() {
         var domin = 'http://' +
         location.hostname + ':8888'
         var logoUrl =  this.$store.state.previewLogoStatus ? this.$store.state.previewLogoUrl : this.$store.state.logoPath
         return logoUrl
       }
    },
    created(){
      
    },
    components : {
          Back,
          About,
          PassWordReset  
    },
    beforeCreate() {

    },
    methods: {
        /* 
        * 切换导航
        */
       clickbgset(){
       	this.$router.push("/bgimgsetting")
       },
       clickmarquee(){
       	this.$router.push("/marqueesetting")
       }
       ,
       clickmanage(){
       	this.$router.push("/nodemanage")
       },
       clickscreenpower(){
       	this.$router.push("/screenpower")
       },
        clickhome() {
            this.$router.push("/")
        },
        clickscreen() {
            this.$router.push("/screen")
        },
        clickplan() {
            this.$router.push("/plan")
        },
        clicksystem() {
            this.$router.push("/system")
        },
        clickusers() {
            this.$router.push("/users")
        },
         /* 
          * 切换不同的主题颜色
          */
        skinChange(argment) {
            if(argment == 'default') argment = ''
            localstorage.set('theme', argment)
            document.getElementsByTagName('body')[0].setAttribute('class', argment)
        },
    },
  } 
</script>         