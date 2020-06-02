<template>
    <div class="home">
        <!-- 首页左边工具栏-->
        <div class="ctrbtn">
            <el-tooltip :content="$t('开机')">
                            <el-button
                              type="success"
                              class="starting"
                              @click="powerOn">
                            </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('关机')">
                            <el-button
                              type="info"  class="close"
                              @click="powerOff">
                            </el-button>
            </el-tooltip>
        			  <el-tooltip class="item save1" effect="dark" :content="$t('保存场景')" placement="bottom">
		                <el-button :disabled="!(!template_op || (template_op == 'call')) || (!(!plan_run_id))" @click="setscene"></el-button>
		                </el-tooltip>

                     <el-button-group>

                    <!--模板新建-->
                    <el-tooltip class="item save3" effect="dark" :content="$t('保存模板')" placement="bottom">
                        <el-button  :disabled="!(!!template_op && template_op != 'call') || (!(!plan_run_id))"
                         @click="saveTemplate" class="save3"></el-button>
                    </el-tooltip>

                    <!--模板开关-->
                    <el-tooltip class="item save2" effect="dark" :content="(template_op != null) ? $t('退出模板') : $t('新建模板')" placement="bottom">
                        <el-button  @click="toTemplateType" :disabled="(!(!plan_run_id))" class="save2"></el-button>
                    </el-tooltip>
                </el-button-group>

        					<!--<el-button>保存模板</el-button>-->
        					<!--全屏-->
            <el-tooltip :content="$t('全屏')">
        					<el-button style="margin-left: 39px;" type="warning" class="save7" @click="fullscreen"></el-button>
            </el-tooltip>
            	</div>

        <div class="hometools">


            <div class="hometool-menu">

                <el-tabs v-model="activeToolName" :class="{'el-tabs__item_en': $isLang('English')}">
                    <el-tab-pane  name="signal" :disabled="(!(!plan_run_id))">
                        <span slot="label">
                        	<!--<i class="fa fa-podcast mar-rig"></i>-->
                        	{{$t('信号')}}</span>
                        <div class="signaltree">
                            <!--信号源列表搜索框-->
                            <el-input
                              :placeholder="$t('输入关键字进行过滤')"
                              v-model="filterText"
                            >
                            </el-input>
                            <!--信号源列表转树形结构-->
                            <Tree
                              ref="home-signaltree"
                              node-key="ID"
                              :default-expanded-keys="expandedKeys"
                              :data="currentSignalGroup"
                              :props="defaultProps"
                              accordion
                              highlight-current
                              @node-expand="nodeExpand"
                              @node-collapse="nodeCollapse"
                              @node-click="handleSignalClick"
                              @node-contextmenu="handleSignalRClick"
                              @node-drag-start="handleDragStart"
                              @node-drag-end="handleDragEnd"
                              draggable
                              :allow-drag="allowDrag"
                              :allow-drop="allowDrop"
                            >                            
                            </Tree>
                            
                        </div>
                    </el-tab-pane>
                    <el-tab-pane  name="scene" :disabled="(!(!plan_run_id))">
                        <span slot="label">
                        	<!--<i class="fa fa-image mar-rig"></i>-->
                        	{{$t('场景')}}</span>
                        <div class="listshow">
                            <div class="itemlist">
                                <el-table :data="currentSceneList"  :show-header="false" highlight-current-row @row-contextmenu="onSceneContextMenu" @row-dblclick="dbClickToCallScene">
                                    <el-table-column prop="Name" :label="$t('名称')"></el-table-column>
                                </el-table>
                            </div>
                            <div class="listpages">
                                <el-row>
                                    <el-col :span="21">
                                        <el-pagination  :total="scene_total"
                                        :current-page.sync="scene_current" :page-size="scene_pagesize" @current-change="onScenePageChange"
                                        small
                                        layout="prev, pager, next"></el-pagination>
                                    </el-col>
                                    <el-col :span="3">
                                        <el-button type="primary" @click="refreshScene"><i class="fa fa-refresh"></i></el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane  name="template" :disabled="!(!plan_run_id)">
                        <span slot="label">
                        	<!--<i class="fa fa-qrcode mar-rig"></i>-->
                        	{{$t('模板')}}</span>
                        <div class="listshow">
                            <div class="itemlist">
                                <el-table :data="currentTemplateList"  :show-header="false" highlight-current-row @row-contextmenu="onTemplateContextMenu" @row-dblclick="dbClickToCallTemplate">
                                    <el-table-column :label="$t('名称')">
                                        <template scope="scope">
                                            <div class="plan-cell">
                                                <span >{{ scope.row.Name }}</span>
                                                <span v-show="scope.row.ID == template_enable_id">
                                                <i class="fa fa-check-circle"></i>
                                                </span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <!--分页组件-->
                            <div class="listpages">
                                <el-row>
                                    <el-col :span="21">
                                        <el-pagination  :total="template_total" :current-page.sync="template_current" :page-size="template_pagesize" @current-change="onTemplatePageChange"
                                        small
                                        layout="prev, pager, next"></el-pagination>
                                    </el-col>
                                    <el-col :span="3">
                                        <el-button type="primary" @click="refreshTemplate"><i class="fa fa-refresh"></i></el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane  name="plan" >
                        <span slot="label">
                        	<!--<i class="fa fa-window-restore mar-rig"></i>-->
                        	{{$t('轮巡')}}</span>
                        <div class="listshow">
                            <div class="itemlist">
                                <el-table :data="currentPlanList"  :show-header="false" highlight-current-row @row-contextmenu="onPlanContextMenu" @row-dblclick="dbClickToCallPlan">
                                    <el-table-column :label="$t('名称')">
                                        <template scope="scope">
                                            <div class="plan-cell">
                                                <span >{{ scope.row.Name }}</span>
                                                <span v-show="scope.row.ID == plan_run_id">
                                                <i class="fa fa-check-circle"></i>
                                                </span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <!--分页组件-->
                            <div class="listpages">
                                <el-row>
                                    <el-col :span="21">
                                        <el-pagination
                                          :total="plan_total"
                                          :current-page.sync="plan_current"
                                          :page-size="plan_pagesize"
                                          @current-change="onPlanPageChange"
                                          small
                                          layout="prev, pager, next"
                                        >
                                        </el-pagination>
                                    </el-col>
                                    <el-col :span="3">
                                        <el-button type="primary" @click="refreshPlan"><i class="fa fa-refresh"></i></el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!-- 
            <div class="signal-view" ref="signal_view">
                <p>{{$t('预览信息')}}</p>
                <div class="container">
                    <div class="content">
                    <canvas ref="source_preview" class="source-canvas"></canvas>
                    </div>
                </div>
            </div>
            -->
            <!--右击菜单栏组件-->
            <MouseContextMenu ref="mousecontextmenu" @select-callback="contextMenuCallback"></MouseContextMenu>
        </div>
        <!-- 虚拟屏中间区域-->
        <div class="homemain" ref="home_main" :style="homeMainStyle">
            <div class="homemain-tool" style="display: none;">
                <!--场景新建-->
                <el-tooltip class="item" effect="dark" :content="$t('保存场景')" placement="bottom">
                <el-button :disabled="!(!template_op || (template_op == 'call')) || (!(!plan_run_id))" @click="setscene"><i class="fa fa-image"></i></el-button>
                </el-tooltip>
                <!--模板功能按钮组-->
                <el-button-group>
		    <!--模板开关-->
                    <el-tooltip class="item" effect="dark" :content="(template_op != null) ? $t('退出模板') : $t('新建模板')" placement="bottom">
                        <el-button  @click="toTemplateType" :disabled="(!(!plan_run_id))"><i class="fa fa-qrcode "></i></el-button>
                    </el-tooltip>

                    <!--模板新建-->
                    <el-tooltip class="item" effect="dark" :content="$t('保存模板')" placement="bottom">
                        <el-button  :disabled="!(!!template_op && template_op != 'call') || (!(!plan_run_id))" @click="saveTemplate"><i class="el-icon-plus"></i></el-button>
                    </el-tooltip>

                </el-button-group>
            </div>
            <div class="homemain-container">
                <el-tabs type="border-card" v-model="active_screen_id" ref="tabs">
                    <el-tab-pane v-for="item in screen" :key="'screen_' + item.ID" :label="item.Name" :name="item.ID.toString()">
                        <div class="tab-panel">
                            <CanvasArea
                              :ref="'canvas_panel_' + item.ID"
                              :screenData.sync="item"
                              :signalDragStatus="signalDragStatus"
                              @refresh-info-list="refreshInfoList"
                            />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!--显示或隐藏菜单栏组件的按钮-->
        <div class="chevron">
          <span @click.stop="spread()"  style="right: 10px;" v-show="right == 10">
              <i class="fa fa-angle-double-left "></i>
          </span>
          <span @click.stop="spread()"  style="right: 190px;" v-show="right == 210">
              <i class="fa fa-angle-double-right"></i>
          </span>
        </div>
        <!--控制台组件-->
        <Rmenu ref="rmenu" style="width: 210px;padding-left:10px" v-show="right == 210"  />
    </div>
</template>
<script>
import MouseContextMenu from './components/mousecontextmenu'
import CanvasArea from './components/canvas';
import Rmenu from './components/rmenu/cloud.vue';
import Jsmpeg from 'jsmpeg';

export default {
    name: 'home',
    components: {
        MouseContextMenu, CanvasArea, Rmenu
    },
//  prop:['isactive'],
    data() {
        return {
        	isfullscreen:false,
        	isactive:true,
            activeToolName: 'signal',              //当前左侧菜单激活的工具名称,默认是信源项

            filterText: '',                        //过滤信源时输入的关键字
            selectedID: null,                      //选中信源时的当前选中的ID
            expandedKeys: [],
            defaultProps: {
                children: 'Children',
                label: 'Name',
                isLeaf: 'IsLeaf',
            },
            signalDragStatus: false,               //信源拖动状态

            source_preview_id: null,               //信源预览的id
            sourceWebsocket: null,                 //信源预览的socket连接

            screen: [],

            // 场景分页
            scene_current: 1,
            scene_pagesize: 9,

            // 模板分页
            template_current:  1,
            template_pagesize: 9,

            template_op: null,                  //当前处于模板操作的类别
            template_name: '',                  //当前模板名称

            // 预案分页
            plan_current:  1,
            plan_pagesize: 9,

            all_node_interval: null,            //监听当前节点的计时器

            all_signal_status_interval: null,   //监听当前信源状态的计时器
            active_screen_id: '0',              //当前激活的屏组ID
        }
    },
    computed: {
    	active_screen: function(){
                return this.$store.state.home.active_screen_id.toString()
            },
        /**
         * 分组信源
         */
        signalgroup: function() {
            return this.$store.state.home.signal_group
        },

        /**
         * 信源状态
         */
        signalStatus: function() {
            return this.$store.state.home.all_signal_status
        },

        /**
         * 当前转化成树结构的分组信源
         */
        currentSignalGroup: function() {
            return this.listToTree(this.signalgroup, this.signalStatus, this.filterText)
        },

        /**
         * 信源栏选中的信号源url
         */
        activeSignalUrl: function() {
            return this.$store.state.home.active_signal_url
        },

        /**
         * 场景列表
         */
        scene: function() {
            return this.$store.state.home.scene
        },

        /**
         * 场景总数
         */
        scene_total: function() {
            return this.$store.state.home.scene_total
        },

        /**
         * 计算当前分页的场景列表
         */
        currentSceneList: function() {
            var items = []
            var start = this.scene_pagesize * (this.scene_current - 1)
            var end = this.scene_pagesize * this.scene_current
            while (start < end && start < this.scene_total) {
                items.push(this.scene[start++])
            }
            return items
        },

        /**
         * 模板列表
         */
        template: function() {
            return this.$store.state.home.template
        },

        /**
         * 模板总数
         */
        template_total: function() {
            return this.$store.state.home.template_total
        },

        /**
         * 计算当前分页的模板列表
         */
        currentTemplateList: function() {
            var items = []
            var start = this.template_pagesize * (this.template_current - 1)
            var end = this.template_pagesize * this.template_current
            while (start < end && start < this.template_total) {
                items.push(this.template[start++])
            }
            return items
        },

        /**
         * 当前屏组下的启用的模板ID
         */
        template_enable_id: function() {
            if(this.active_screen_id == '0')  return 0
            let screenData = this.screen.filter((val) => {
                return val.ID == this.active_screen_id
            })
            let id = screenData ? screenData[0].TemplateID : 0
            return id
        },
        /**
         * 新建模板状态
         */
        template_add_status: function() {
            return this.$store.state.home.template_add_status
        },

        /**
         * 当前编辑模板时的ID
         */
        template_edit_id: function() {
            return this.$store.state.home.template_edit_id
        },

        /**
         * 计算预案的变化
         */
        plan: function() {
            return this.$store.state.home.plan
        },

        /**
         * 预案总数
         */
        plan_total: function() {
            return this.$store.state.home.plan_total
        },

        /**
         * 计算当前分页的预案列表
         */
        currentPlanList: function() {
            var items = []
            var start = this.plan_pagesize * (this.plan_current - 1)
            var end = this.plan_pagesize * this.plan_current
            while (start < end && start < this.plan_total) {
                items.push(this.plan[start++])
            }
            return items
        },

        /**
         * 当前屏组正在启动的预案ID
         */
        plan_run_id: function() {
            return this.$store.state.home.plan_run_id
        },

        /**
         * 计算画布区域的大小
         */
        homeMainStyle: function() {
            var style = {}
            style.width = "calc(100% - 314px - " + this.$store.state.home.chevron_right +"px)"
            return style
        },

        /**
         * 计算右侧按钮相对首页右边的距离
         */
        right: function() {
            return this.$store.state.home.chevron_right
        },
    },
    watch: {
        /**
         * 当前激活的屏组ID
         */
        active_screen_id: function(newVal, oldVal) {
            if (newVal != '0') {
                this.$store.commit('home/setActiveScreenId', newVal)
                this.getSceneList()
                this.getTemplateList()
                this.getPlanList()

                //当前模板在启动状态
                if(!!this.template_enable_id && (this.activeToolName == 'scene' || this.activeToolName == 'plan')) {
                    this.activeToolName = 'template'
                } else if (!this.template_enable_id && !!this.plan_run_id && (this.activeToolName == 'scene' || this.activeToolName == 'template')) {
                    //当前预案在启动状态(模板没有启动)
                    this.activeToolName = 'plan'
                }
                if (!!this.template_enable_id) {
                    this.template_op = 'call'
                } else {
                    this.template_op = null
                }
                //设置模板编辑状态为0
                this.$store.commit("home/setTemplateEditId", 0)
                //设置模板新建状态为false
                this.$store.commit("home/setTemplateAddStatus", false)
            }
        },

        template_enable_id: function(newVal, oldVal) {
            if(newVal != 0 && oldVal == 0) {
                this.template_op = 'call'
                //设置模板编辑状态为0
                this.$store.commit("home/setTemplateEditId", 0)
                //设置模板新建状态为false
                this.$store.commit("home/setTemplateAddStatus", false)
            } else if(newVal == 0) {
                this.template_op = null
                //设置模板编辑状态为0
                this.$store.commit("home/setTemplateEditId", 0)
                //设置模板编辑状态为false
                this.$store.commit("home/setTemplateAddStatus", false)
            }
            this.getSceneList()
            this.getPlanList()
        },

        /**
         * 监听预案ID是否启动的变化
         */
        plan_run_id: function(newVal, oldVal) {
            if (!!newVal) {
                 if (this.activeToolName == 'scene' || this.activeToolName == 'template') {
                    this.activeToolName = 'plan'
                }
            }
        }
    },
    created() {
        this.initData()                                           //初始化监测状态的分组信源数据和屏组数据
        this.$nextTick(function(){
            //单击操作弹出框消失
            document.addEventListener('click', this.documentEvent)
        })

    },
    methods: {
//  	开关机
    	 powerOn: function() {
                let wallID = parseInt(this.active_screen)
                if(wallID == 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('屏组不存在'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                var url = '/api.v2.do.pwplan.act'
                var params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "WallID": wallID,
                        "Action": 1
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
                    this.$message({
                        'type': 'success',
                        'message': this.$t('操作成功'),
                        'showClose': true,
                        'duration': 1500
                    })
                }).catch((err) => {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('操作失败'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                })
            },

            /**
             * 关机
             */
            powerOff: function() {
                let wallID = parseInt(this.active_screen)
                if(wallID == 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('屏组不存在'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                var url = '/api.v2.do.pwplan.act'
                var params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "WallID": wallID,
                        "Action": 0
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
                    this.$message({
                        'type': 'success',
                        'message': this.$t('操作成功'),
                        'showClose': true,
                        'duration': 1500
                    })
                }).catch((err) => {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('操作失败'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                })
            },
    	//全屏
    	fullscreen:function(){
    		this.isfullscreen=!this.isfullscreen;
    		if(this.isfullscreen == true){
    			 var docElm = document.documentElement;
			    //W3C
			    if(docElm.requestFullscreen) {
			      docElm.requestFullscreen();
			    }

			    //FireFox
			    else if(docElm.mozRequestFullScreen) {
			      docElm.mozRequestFullScreen();
			    }

			    //Chrome等
			    else if(docElm.webkitRequestFullScreen) {
			      docElm.webkitRequestFullScreen();
			    }

			    //IE11
			    else if(elem.msRequestFullscreen) {
			      elem.msRequestFullscreen();}
    		}else {
    			 if (document.exitFullscreen) {
			      document.exitFullscreen();
			    }
			    //FireFox
			    else if (document.mozCancelFullScreen) {
			      document.mozCancelFullScreen();
			    }
			    //Chrome等
			    else if (document.webkitCancelFullScreen) {
			      document.webkitCancelFullScreen();
			    }
			    //IE11
			    else if (document.msExitFullscreen) {
			      document.msExitFullscreen();
			    }
    		}


    	},
        /**
         * 初始化监测状态的分组信源数据和屏组数据
         */
        initData: function() {
            //监听节点绑定状态
            this.listenAllNodeStatusInterval()

            //监听信源状态变化
            this.getSignalGroup()
            this.listenAllSignalStatusInterval()

            //获取屏组列表，并渲染右侧操作区
            this.getScreenList()
        },

        /**
         * 监听所有节点的状态
         */
        listenAllNodeStatusInterval: function() {
            this.clearAllNodeInterval()
            this.getAllNodeInfo()
            this.getAllNodeStatus()
            this.all_node_interval = setInterval(() => {
                this.getAllNodeInfo()
                this.getAllNodeStatus()
                this.getSignalGroup()
            }, 2000)
        },

        /**
         * 清除监听所有节点状态的定时器
         */
        clearAllNodeInterval: function() {
            if (this.all_node_interval) {
                clearInterval(this.all_node_interval)
                this.all_node_interval = null
            }
        },

        /**
         * 获取所有的节点信息
         */
        getAllNodeInfo: function() {
            let url = '/api.v2.do.nodeBind.get'
            let params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": 0,
                    "limit": 0
                }
            }
            this.$http(url, params).then((res) => {
                if(res.data.status !== 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    var data = []
                    this.$store.commit('setAllNodeInfo', data)
                    return
                }
                if(!res.data.msg) {
                    var data = []
                    this.$store.commit('setAllNodeInfo', data)
                    return
                }
                var data = res.data.msg.body
                this.$store.commit('setAllNodeInfo', data)
            }).catch((err) => { console.log('获取节点信息失败') })
        },

        /**
         * 获取所有节点的在线状态
         */
        getAllNodeStatus: function() {
            let url = '/api.v2.do.node.status'
            let params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": 0,
                    "limit": 0
                }
            }
            this.$http(url, params).then((res)=>{
                if (res.data.status != 0) {
                    var data = []
                    this.$store.commit('setAllNodeStatus', data)
                    return
                }
                if (!res.data.msg) {
                    var data = []
                    this.$store.commit('setAllNodeStatus', data)
                    return
                }
                var data = res.data.msg.body
                this.$store.commit('setAllNodeStatus', data)
            }).catch((err)=>{ console.log('获取节点状态失败') })
        },

        /**
         * 获取信源分组信息
         */
        getSignalGroup: function() {
            let url = '/api.v2.do.sourcegroup.get'
            let params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": 0,
                    "limit": 0
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
                if(!res.data.msg) {
                    var data = []
                } else {
                    var data = res.data.msg.body
                }
                this.$store.commit('home/setSignalGroup', data)
            }).catch((err) => { console.log('获取信源分组信息失败') })
        },

        /**
         * 监听信源状态的定时器
         */
        listenAllSignalStatusInterval() {
            this.clearAllSignalStatusInterval()
            this.getAllSignalStatus();
            this.all_signal_status_interval = setInterval(()=>{
                this.getAllSignalStatus()
            }, 2000)
        },

        /**
         * 清除监听信号源的状态的定时器
         */
        clearAllSignalStatusInterval: function() {
            if (this.all_signal_status_interval) {
                clearInterval(this.all_signal_status_interval)
                this.all_signal_status_interval = null
            }
        },

        /**
         * 获取所有信号源状态信息
         */
        getAllSignalStatus: function() {
            let url = '/api.v2.do.source.status'
            let params = {
                "userid": this.$auth.getuid()
            }
            this.$http(url, params).then((res) => {
              //debugger
                if (res.data.status !== 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                if (!res.data.msg) {
                    var data = []
                } else {
                    var data = res.data.msg.body
                }
                this.$store.commit('home/setAllSignalStatus', data)
                //debugger
            }).catch((err) => { console.log('获取信源状态失败') })
        },

        /**
         * 获取屏组列表
         */
        getScreenList: function () {
            let url = '/api.v2.do.screen.get'
            let params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": 0,
                    "limit": 0
                }
            }
            this.$http(url, params).then((res) => {
                if (res.data.status != 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                if (!res.data.msg) {
                    var screen = []
                } else {
                    var screen = res.data.msg.body
                }
                this.screen = screen
                this.active_screen_id = (screen.constructor == Array && screen.length !== 0) ? screen[0].ID.toString() : '0'
                if(!!this.active_screen_id) {
                    //this.listenPlanInterval()
                }

            }).catch((err) => {})
        },

        // /**
        //  * 监听预案在跑的定时器
        //  */
        // listenPlanInterval: function(){
        //     this.clearPlanInterval()
        //     this.listenPlanRunStatus()
        //     this.plan_interval = setInterval(() => {
        //         this.listenPlanRunStatus()
        //     }, 2000)
        // },

        // /**
        //  * 清除预案监听的定时器
        //  */
        // clearPlanInterval: function() {
        //     if (this.plan_interval) {
        //         clearInterval(this.plan_interval)
        //         this.plan_interval = null
        //     }
        // },

        // /**
        //  * 监听预案启用状态
        //  */
        // listenPlanRunStatus: function() {
        //     var url = '/api.v2.do.plan.isInterval'
        //     var params = {
        //         "userid": this.$auth.getuid(),
        //         "body": {
        //             "WallID": parseInt(this.active_screen_id)
        //         }
        //     }
        //     this.$http(url, params).then((res) => {
        //         if(res.data.status != 0) {
        //             this.$message({
        //                 'type': 'warning',
        //                 'message': this.$t(this.$msg[res.data.status]),
        //                 'showClose': true,
        //                 'duration': 1500
        //             })
        //             return
        //         }
        //         if(res.data.msg && res.data.msg.body) {
        //             this.plan_run_id = res.data.msg.body[0].ID
        //             this.$refs['canvas_panel_' + this.active_screen_id][0].setPlanRunStatus(true)
        //         } else {
        //             this.plan_run_id = null
        //             this.$refs['canvas_panel_' + this.active_screen_id][0].setPlanRunStatus(false)
        //         }
        //     }).catch((err) => { console.log('监听预案启动状态失败!') })
        // },

        /**
         * getSceneList 获取场景列表
         */
        getSceneList: function () {
            var url = '/api.v2.do.scene.get'
            var params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": 0,
                    "limit": 0
                },
                "body": {
                    "ID": 0,
                    "WallID": parseInt(this.active_screen_id)
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
                if(!res.data.msg) {
                    var data = []
                    var total = 0
                } else {
                    var data = res.data.msg.body
                    var total = res.data.msg.count
                }
                this.$store.commit('home/setScene', data)
                this.$store.commit('home/setSceneTotal', total)
            }).catch((err) => { console.log(err) })
        },

        /**
         * 获取模板列表
         */
        getTemplateList: function () {
            var url = '/api.v2.do.model.get'
            var params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": 0,
                    "limit": 0
                },
                "body": {
                    "WallID": parseInt(this.active_screen_id)
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
                if(!res.data.msg) {
                    var data = []
                    var total = 0
                } else {
                    var data = res.data.msg.body
                    var total = res.data.msg.count
                }
                this.$store.commit('home/setTemplate', data)
                this.$store.commit('home/setTemplateTotal', total)
            }).catch((err) => { console.log(err) })
        },

        /**
         * getPlanList 获取预案列表
         */
        getPlanList: function () {
            var url = '/api.v2.do.plan.get'
            var params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": 0,
                    "limit": 0
                },
                "body": {
                    "ID": 0,
                    "WallID": parseInt(this.active_screen_id)
                }
            }
            this.$http(url, params).then((res) => {
                if (res.data.status !== 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('获取预案信息失败'),
                        'showClose': true,
                        'duration': 1500
                    });
                    return
                }
                if(!res.data.msg) {
                    var data = []
                    var total = 0
                }  else {
                    var data = res.data.msg.body
                    var total = res.data.msg.count
                }
                this.$store.commit('home/setPlan', data)
                this.$store.commit('home/setPlanTotal', total)
            }).catch((err) => { console.log(err) })
        },

        // ##########
        // 事件处理
        // ##########

        /**
         * 点击页面隐藏右击菜单
         */
        documentEvent: function(e) {
            this.$refs['mousecontextmenu'] && this.$refs['mousecontextmenu'].hide()
        },

        /**
         * 切入到模板模式
         */
        toTemplateType: function() {
            if (this.template_op == 'call') {
                //当前处于启用模板状态，把启动的模板停了
                let url = '/api.v2.do.model.disable'
                let params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "ID": this.template_enable_id,
                    }
                }
                this.$http(url, params).then((res) => {
                    if (res.data.status != 0) {
                        this.$message({
                            'type': 'warning',
                            'message': this.$t('退出模板失败'),
                            'showClose': true,
                            'duration': 1500
                        })
                        return
                    }
                    //修改当前屏组的Template数据
                    let index = this.getCollectionIndexByID(this.screen, 'ID', this.active_screen_id)
                    let screenData = JSON.parse(JSON.stringify(this.screen[index]))
                    screenData.TemplateID = 0
                    this.$set(this.screen, index, screenData)
                    this.$message({
                        'type': 'info',
                        'message': this.$t('退出模板成功'),
                        'showClose': true,
                        'duration': 1500
                    });
                }).catch((err) => {})
            } else if(this.template_op == 'edit') {
                this.$message({
                    'type': 'success',
                    'message': this.$t('退出编辑模板'),
                    'showClose': true,
                    'duration': 1500
                })
                this.template_op = null
                //设置模板编辑状态为0
                this.$store.commit("home/setTemplateEditId", 0)
                //设置模板编辑状态为false
                this.$store.commit("home/setTemplateAddStatus", false)
            } else if(this.template_op == 'add') {
                this.$message({
                    'type': 'success',
                    'message': this.$t('退出绘制模板'),
                    'showClose': true,
                    'duration': 1500
                })
                this.template_op = null
                //设置模板编辑状态为0
                this.$store.commit("home/setTemplateEditId", 0)
                //设置模板编辑状态为false
                this.$store.commit("home/setTemplateAddStatus", false)
            } else {
                this.$message({
                    'type': 'success',
                    'message': this.$t('开始绘制模板'),
                    'showClose': true,
                    'duration': 1500
                })
                if(this.activeToolName == 'scene' || this.activeToolName == 'plan') {
                    this.activeToolName = 'signal'
                }
                this.template_op = 'add'
                //设置模板编辑状态为0
                this.$store.commit("home/setTemplateEditId", 0)
                //设置模板编辑状态为false
                this.$store.commit("home/setTemplateAddStatus", true)
            }
        },

        /**
         * 保存当前窗口状态为场景
         */
        setscene: function() {
            this.$prompt(' ', this.$t('保存场景'), {
                confirmButtonText: this.$t('保存'),
                cancelButtonText: this.$t('取消'),
                inputPlaceholder: this.$t('请输入场景名称'),
                inputPattern: /^[\u4e00-\u9fa5\w\-]{1,12}$/,
                inputErrorMessage: this.$t('名称不超过12个字符,可由数字、字母、汉字、下划线、减号组成'),
            }).then(( {value} ) => {
                var url = '/api.v2.do.scene.add'
                var params = {
                    'userid': this.$auth.getuid(),
                    'body': {
                        'WallID': parseInt(this.active_screen_id),
                        'Name': value
                    }
                }
                return this.$http(url, JSON.stringify(params))
            }).then((res) => {
                if(res.data.status != 0) {
                    this.$message({
                    'type': 'warning',
                    'message': this.$t(this.$msg[res.data.status]),
                    'showClose': true,
                    'duration': 1500
                    })
                    return
                }
                this.refreshScene()
                this.$message({
                    'type': 'success',
                    'message': this.$t('保存成功'),
                    'showClose': true,
                    'duration': 1500
                })
            }).catch((err) => {})
        },

        /**
         * 新建保存模板
         */
        saveTemplate: function(){
            let templateName = this.getTemplateNameByID(this.template_edit_id, this.template)
            this.$prompt(' ', this.$t('保存模板'), {
                confirmButtonText: this.$t('保存'),
                cancelButtonText: this.$t('取消'),
                inputPlaceholder: this.$t('请输入模板名称'),
                inputPattern: /^[\u4e00-\u9fa5\w\-]{1,12}$/,
                inputErrorMessage: this.$t('名称不超过12个字符,可由数字、字母、汉字、下划线、减号组成'),
                inputValue: templateName
            }).then(({value}) => {
                if(this.template_op == 'add') {
                    var url = '/api.v2.do.model.add'
                    var params = {
                        "userid": this.$auth.getuid(),
                        "body": {
                            "WallID": parseInt(this.active_screen_id),
                            "Name": value,
                            "Window": this.getCurrentTemplateWindowList(),
                        }
                    }
                } else {
                    var url = '/api.v2.do.model.edit'
                    var params = {
                        "userid": this.$auth.getuid(),
                        "body": {
                            "ID": this.template_edit_id,
                            "Name": value,
                            "Window": this.getCurrentTemplateWindowList(),
                        }
                    }
                }
                return this.$http(url, params)
            }).then((res) => {
                if(res.data.status != 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.refreshTemplate()
                this.$message({
                    'type': 'success',
                    'message': this.$t('保存成功'),
                    'showClose': true,
                    'duration': 1500
                })
                //this.activeToolName = 'signal'
            }).catch((err) => { })
        },

        /**
         * 获取当前屏组模板下的窗口列表
         */
        getCurrentTemplateWindowList() {
            if(this.active_screen_id) {
                return this.$refs['canvas_panel_' + this.active_screen_id][0].templateWindowList
            } else {
                return []
            }
        },

        /**
         * 右侧云台控制面板的展开与收起
         */
        spread: function() {
            var right = (this.right == 10 ? 210 : 10)
            this.$store.commit('home/setChevronRight', right)
        },

        /**
         * 刷新信息列表(场景，预案，信号源，模板等)
         */
        refreshInfoList: function(funcName) {
            funcName &&　this[funcName] && this[funcName]()
        },

        /**
         * 右击弹窗处理回调
         */
        contextMenuCallback: function(funcName, data) {
            this[funcName](data)
        },

        /**
         * 信号源节点展开
         */
        nodeExpand(data, node, obj) {
            this.expandedKeys.push(data.ID)
        },

        /**
         * 信号源节点收起
         */
        nodeCollapse(data, node, obj) {
            var index = this.expandedKeys.indexOf(data.ID)
            if (index !== -1) {
                this.expandedKeys.splice(index, 1)
            }
        },

        /**
         * 信源鼠标左键选中
         */
        handleSignalClick: function(row, node, obj) {
            this.selectedID = row.ID
            this.documentEvent()
            if(row.Type == 2) {
                this.$store.commit('home/setActiveSignalUrl', row.Url)
            }
            return
        },

        /**
         * 信源右击事件
         */
        handleSignalRClick: function(e, row, node, obj) {
            this.selectedID = row.ID
            if (row.Type == 1) {
                this.documentEvent()
                e.preventDefault()
            } else {
                this.$store.commit('home/setActiveSignalUrl', row.Url)
                var position = {}
                position.x = e.clientX
                position.y = e.clientY
                var data =  [{
                    text: this.$t("信源预览"),
                    type: "open_source_preview",
                    hidden: false,
                    disabled: (this.source_preview_id == row.ID),
                    callback: 'onOpenSourcePreview',
                    data: row
                }, {
                    text: this.$t("关闭预览"),
                    type: "close_source_preview",
                    hidden: false,
                    disabled: !this.source_preview_id,
                    callback: 'onCloseSourcePreview',
                    data: row
                }, {
                    text: this.$t("重命名"),
                    type: "rename_source",
                    hidden: false,
                    disabled: false,
                    callback: 'onRenameSource',
                    data: row
                }]

                this.$refs['mousecontextmenu'].setMenu(position , data)
                e.preventDefault()
            }
        },

        /**
         * 打开信源预览
         */
        onOpenSourcePreview: function(data) {
            this.onCloseSourcePreview();
            let url = '/api.v2.do.source.preview'
            let params = {
                "userid": 0,
                "body": {
                    "ID": data.ID
                }
            }
            this.$http(url, params).then((res) => {
                if(0 !== res.data.status) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('获取信源地址失败'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                if(!res.data.msg) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('没有相关数据'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                var address = res.data.msg.body.Preview
                var canvas = this.$refs['source_preview']
                this.sourceWebsocket = new WebSocket(address);
                let player = new Jsmpeg(this.sourceWebsocket, {canvas:canvas});
                this.sourceWebsocket && (this.source_preview_id = data.ID)
                var vm = this
                this.sourceWebsocket.onclose = function (event) {
                    vm.clearCanvasColor();
                    vm.sourceWebsocket = null;
                    vm.source_preview_id = null
                };
            }).catch((err) => {})
        },

        /**
         * 信号源重命名
         */
        onRenameSource: function(data) {
            this.$prompt(' ', this.$t('信号源重命名'), {
                confirmButtonText: this.$t('保存'),
                cancelButtonText: this.$t('取消'),
                inputPlaceholder: this.$t('请输入信源名'),
                closeOnClickModal: false,
            }).then(({ value }) => {
                var url = '/api.v2.do.source.edit'
                var params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "WallID": this.sid,
                        "ID": data.ID,
                        "Name": value
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
                    this.$message({
                        'type': 'success',
                        'message': this.$t('保存成功'),
                        'showClose': true,
                        'duration': 1500
                    })
                    this.getSignalGroup()
                }).catch((err) => {})
            }).catch(() => { });
        },

        /**
         * 关闭信源预览
         */
        onCloseSourcePreview: function(data) {
            if (null != this.sourceWebsocket) {
                this.sourceWebsocket.close()
            }
        },

        /**
         * 清除画布颜色
         */
        clearCanvasColor () {
            setTimeout(() => {
                var c = this.$refs['source_preview']
                var gl = c.getContext("experimental-webgl");
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }, 100);
        },

        /**
         * 允许拖动，非信源不允许拖动
         */
        allowDrag (node) {
            return node.data.Type === 2
        },

        /**
         * 设置不允许放下调换位置
         */
        allowDrop (draggingNode, dropNode, type) {
            return false
        },

        /**
         * 信源拖动开始
         */
        handleDragStart: function(node, e) {
            this.$store.commit('home/setDragSignalUrl', node.data.Url)
            if(!this.template_op) {
                this.signalDragStatus = true
            }
        },

        /**
         * 信源拖动结束
         */
        handleDragEnd: function(node, e) {
            this.$store.commit('home/setDragSignalUrl', null)
            this.signalDragStatus = false
            event.preventDefault();
        },

        /**
         * 场景右击事件
         */
        onSceneContextMenu: function(row, e) {
            if (2 != e.button ) return
            var position = {}
            position.x = e.clientX
            position.y = e.clientY
            var data = [{
                text: this.$t("启用"),
                type: "call_scene",
                hidden: false,
                disabled: false,
                callback: 'onCallScene',
                data: row
            }, {
                text: this.$t("重命名"),
                type: "rename_scene",
                hidden: false,
                disabled: false,
                callback: 'onRenameScene',
                data: row
            }, {
                text: this.$t("生成模板"),
                type: "create_template",
                hidden: false,
                disabled: false,
                callback: 'onCreateTemplateByScene',
                data: row
            }, {
                text: this.$t("删除"),
                type: "delete_scene",
                hidden: false,
                disabled: false,
                callback: 'onDeleteScene',
                data: row
            }]
            this.$refs['mousecontextmenu'].setMenu(position, data)
            e.preventDefault()
        },

        /**
         * 场景列表面切换
         */
        onScenePageChange: function (index) {
            this.scene_current = index
        },

        /**
         * 刷新当前场景列表
         */
        refreshScene: function() {
            this.getSceneList()
        },

        /**
         * 双击启动场景
         */
        dbClickToCallScene: function(row, e) {
            if (0 != e.button ) return
            this.onCallScene(row)
        },

        /**
         * 启用场景
         */
        onCallScene: function(data) {
            var url = '/api.v2.do.scene.call'
            var params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "ID": data.ID,
                }
            }
            this.$http(url, params).then((res) => {
                this.$refs['canvas_panel_' + this.active_screen_id][0].getSceneWindowList()
                this.$refs['canvas_panel_' + this.active_screen_id][0].resetAudio()
                let vm = this
                setTimeout(vm.$refs['canvas_panel_' + vm.active_screen_id][0].getAudio, 1000)
                this.$message({
                    'message': this.$t('操作成功'),
                    'type': 'success',
                    'showClose': true,
                    'duration': 1500
                })
            }).catch((err) => {
                this.$message({
                    'message': this.$t('操作失败'),
                    'type': 'warning',
                    'showClose': true,
                    'duration': 1500
                })
            })
        },

        /**
         * 重命名场景
         */
        onRenameScene: function(data) {
            this.$prompt(' ', this.$t('场景重命名'), {
                confirmButtonText: this.$t('保存'),
                cancelButtonText: this.$t('取消'),
                closeOnClickModal: false,
                inputPlaceholder: this.$t('请输入新场景名'),
                inputValidator: this.$t(function(value) {
                    if(value.length > 12 || value.length == 0)
                    return '请输入1~12位长度的名称!'
                })

            }).then(({ value }) => {
                var url = '/api.v2.do.scene.rename'
                var params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "ID": data.ID,
                        "Name": value
                    }
                }
                return this.$http(url, params)
            }).then((res) => {
                if(res.data.status !== 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    });
                    return
                }
                this.refreshScene()
                this.$message({
                    'type': 'success',
                    'message': this.$t('修改成功'),
                    'showClose': true,
                    'duration': 1500
                });
            }).catch((err)=>{
                if(err == 'cancel') {
                    this.$message({
                        'type': 'info',
                        'message': this.$t('已取消'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                } else {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('操作失败'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
            })
        },

        /**
         * 根据场景生成模板
         */
        onCreateTemplateByScene: function(data) {
            this.$prompt(' ', this.$t('生成模板'), {
                confirmButtonText: this.$t('保存'),
                cancelButtonText: this.$t('取消'),
                closeOnClickModal: false,
                inputPlaceholder: this.$t('请输入模板名称'),
                inputValidator: this.$t(function(value) {
                    if(value.length > 12 || value.length == 0) {
                        return '请输入1~12位长度的名称!'
                    }
                })
            }).then(({ value }) => {
                var url = '/api.v2.do.model.saved'
                var params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "ID": data.ID,
                        "WallID": parseInt(this.active_screen_id),
                        "Name": value
                    }
                }
                return this.$http(url, params)
            }).then((res) => {
                if(res.data.status !== 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    });
                    return
                }
                this.refreshTemplate()
                this.$message({
                    'type': 'success',
                    'message': this.$t('修改成功'),
                    'showClose': true,
                    'duration': 1500
                });
            }).catch((err)=>{
                if(err == 'cancel') {
                    this.$message({
                        'type': 'info',
                        'message': this.$t('已取消'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                } else {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('操作失败'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
            })
        },

        /**
         * 删除场景
         */
        onDeleteScene: function(data) {
            var url = '/api.v2.do.scene.del'
            var params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "ID": data.ID,
                }
            }
            this.$http(url, params).then((res) => {
                this.refreshScene()
                this.$message({
                    'message': this.$t('操作成功'),
                    'type': 'success',
                    'showClose': true,
                    'duration': 1500
                })
            }).catch((err) => {
                this.$message({
                    'message': this.$t('操作失败'),
                    'type': 'warning',
                    'showClose': true,
                    'duration': 1500
                })
            })
        },

        /**
         * 模板右击事件
         */
        onTemplateContextMenu: function(row, e) {
            if (2 != e.button ) return
            var position = {}
            position.x = e.clientX
            position.y = e.clientY
            var data = [{
                text: this.$t("编辑"),
                type: "edit_template",
                hidden: false,
                disabled: (!!this.template_enable_id),
                callback: 'onEditTemplate',
                data: row
            }, {
                text: this.$t("启用"),
                type: "enable_template",
                hidden: (!!this.template_enable_id),
                disabled: false,
                callback: 'onEnableTemplate',
                data: row
            },{
                text: this.$t("禁用"),
                type: "disable_template",
                hidden: (this.template_enable_id != row.ID),
                disabled: false,
                callback: 'onDisableTemplate',
                data: row
            }, {
                text: this.$t("删除"),
                type: "delete_template",
                hidden: false,
                disabled: (this.template_enable_id == row.ID),
                callback: 'onDeleteTemplate',
                data: row
            }]
            this.$refs['mousecontextmenu'].setMenu(position, data)
            e.preventDefault()
        },

        /**
         * 模板列表面切换
         */
        onTemplatePageChange: function (index) {
            this.template_current = index
        },

        /**
         * 刷新当前模板列表
         */
        refreshTemplate: function() {
            this.getTemplateList()
        },

        dbClickToCallTemplate: function(row, e) {
            if (0 != e.button ) return
            this.onEnableTemplate(row)
        },

        /**
         * 编辑模板
         */
        onEditTemplate: function(data) {
            let url = '/api.v2.do.model.getRec'
            let params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "ID": data.ID,
                }
            }
            this.$http(url, params).then((res) => {
                if (res.data.status != 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('获取模板窗口失败'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                if(!res.data.msg) {
                    var templateWindowList = []
                } else {
                    var templateWindowList = res.data.msg.body.Window
                }
                //设置模板编辑状态为0
                this.$store.commit("home/setTemplateEditId", data.ID)
                //设置模板新建状态为false
                this.$store.commit("home/setTemplateAddStatus", false)
                this.template_op = 'edit'
                //设置当前显示的屏组的模板窗口列表
                this.$refs['canvas_panel_' + this.active_screen_id][0].templateWindowList = templateWindowList
            }).catch((err) => {})
        },

        /**
         * 启用模板的窗口信息
         */
        onEnableTemplate: function(data) {
            let url = '/api.v2.do.model.enable'
            let params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "ID": data.ID,
                }
            }
            this.$http(url, params).then((res) => {
                if (res.data.status != 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('启用模板失败'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }

                //修改当前屏组的Template数据
                let index = this.getCollectionIndexByID(this.screen, 'ID', this.active_screen_id)
                let screenData = JSON.parse(JSON.stringify(this.screen[index]))
                screenData.TemplateID = data.ID
                this.$set(this.screen, index, screenData)
                this.$message({
                    'type': 'success',
                    'message': this.$t('启用模板成功'),
                    'showClose': true,
                    'duration': 1500
                })
            }).catch((err) => {})
        },

        onDisableTemplate: function (data) {
            let url = '/api.v2.do.model.disable'
            let params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "ID": data.ID,
                }
            }
            this.$http(url, params).then((res) => {
                if (res.data.status != 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('禁用模板失败'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                //修改当前屏组的Template数据
                let index = this.getCollectionIndexByID(this.screen, 'ID', this.active_screen_id)
                let screenData = JSON.parse(JSON.stringify(this.screen[index]))
                screenData.TemplateID = 0
                this.$set(this.screen, index, screenData)
            }).catch((err) => {})
        },

        /**
         * 删除模板
         */
        onDeleteTemplate: function(data) {
            var url = '/api.v2.do.model.del'
            var params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "ID": data.ID,
                }
            }
            this.$http(url, params).then((res) => {
                if (res.data.status != 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.refreshTemplate()
                this.$message({
                    'message': this.$t('操作成功'),
                    'type': 'success',
                    'showClose': true,
                    'duration': 1500
                })
            }).catch((err) => {
                this.$message({
                    'message': this.$t('操作失败'),
                    'type': 'warning',
                    'showClose': true,
                    'duration': 1500
                })
            })
        },

        /**
         * 预案右击事件
         */
        onPlanContextMenu: function(row, e) {
            if (2 != e.button ) return
            var position = {}
            position.x = e.clientX
            position.y = e.clientY
            var data = [{
                text: this.$t("启用"),
                type: "call_plan",
                hidden: false,
                disabled: !(!this.plan_run_id),
                callback: 'onCallPlan',
                data: row
            }, {
                text: this.$t("停用"),
                type: "stop_plan",
                hidden: false,
                disabled: (row.ID != this.plan_run_id),
                callback: 'onStopPlan',
                data: row
            }]
            this.$refs['mousecontextmenu'].setMenu(position , data)
            e.preventDefault()
        },

        /**
         * 预案列表面切换
         */
        onPlanPageChange: function (index) {
            this.plan_current = index
        },

        /**
         * 刷新当前预案列表
         */
        refreshPlan: function() {
            this.getPlanList()
        },

        /**
         * 双击启动预案
         */
        dbClickToCallPlan: function(row, e) {
            if (0 != e.button ) return
            this.onCallPlan(row)
        },

        /**
         * 启用预案
         */
        onCallPlan: function(data) {
            if(this.plan_run_id) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('当前屏组有预案在启动,请先关闭再启动预案'),
                    'showClose': true,
                    'duration': 1500
                });
                return
            }

            var url = '/api.v2.do.plan.call'
            var params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "ID": data.ID,
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
                let plan_run_id = data.ID
                this.$store.commit("home/setPlanRunId", plan_run_id)
                //设置当前激活屏组的预案启动ID
                this.$refs['canvas_panel_' + this.active_screen_id][0].plan_run_id = plan_run_id
                this.$refs['canvas_panel_' + this.active_screen_id][0].resetAudio()
            }).catch((err) => {})
        },

        /**
         * 停止预案
         */
        onStopPlan: function(data) {
            if(data.ID != this.plan_run_id) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('该预案不在启动中,无法停止'),
                    'showClose': true,
                    'duration': 1500
                })
                return
            }
            var url = '/api.v2.do.plan.stop'
            var params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "ID": data.ID,
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
                let plan_run_id = null
                this.$store.commit("home/setPlanRunId", plan_run_id)
                //设置当前激活屏组的预案启动ID为null
                this.$refs['canvas_panel_' + this.active_screen_id][0].plan_run_id = plan_run_id
                //this.$refs['canvas_panel_' + this.active_screen_id][0].setPlanRunStatus(false)
            }).catch((err) => {})
        },

        // ##########
        // 工具方法
        // ##########
        getTemplateNameByID: function(id, template) {
            if(id === null || id === 0) return ''
            let name = ''
            template.map(v => {
                if(v.ID === id) {
                    name = v.Name
                    return
                }
            })
            return name
        },

        /**
         * 把列表转成树
         */
        listToTree: function(rows, sourceStatus, filterText){
            function exists(rows, parentId){
                for(var i = 0; i < rows.length; i++){
                    if (rows[i].ID && rows[i].ID === parentId) return true;
                }
                return false;
            }
            var nodes = [];
            // get the top level nodes
            for(var i = 0; i < rows.length; i++){
                var row = rows[i];
                if (!exists(rows, row.ParentID)){
                    nodes.push({
                        ID: row.ID,
                        Type: row.Type,
                        Name: row.Name,
                        Url: row.Url,
                        isSelected: row.ID == this.selectedID,
                        isLeaf: (row.Type == 1) ? true : false,
                        disabled: (row.Type == 1) ? false : (!this.checkSourceStatus(row, sourceStatus)),
                        Children: row.Children,
                    });
                }
            }

            var toDo = [];
            for (var i = 0; i < nodes.length; i++) {
                toDo.push(nodes[i]);
            }

            while (toDo.length){
                var node = toDo.shift();    // the parent node
                // get the children nodes
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    if (row.ParentID == node.ID){
                        if (row.Type === 1) {
                            var child = {
                                ID: row.ID,
                                Type: row.Type,
                                Name: row.Name,
                                isLeaf: false,
                                disabled: false,
                                isSelected: row.ID == this.selectedID,
                                Children: row.Children,
                            }
                        } else {
                            var child = {
                                ID: row.ID,
                                Url: row.Url,
                                Type: row.Type,
                                Name: row.Name,
                                isLeaf: true,
                                disabled: (!this.checkSourceStatus(row, sourceStatus)),
                                isSelected: row.ID == this.selectedID,
                                Children: row.Children,
                            }
                        }

                        if (node.Children){
                            node.Children.push(child);
                        } else {
                            node.Children = [child];
                        }
                        node.Children && node.Children.sort(function(next, prev) {
                            return next['Type'] > prev['Type']
                        })
                        toDo.push(child);
                    }
                }
            }
            if(filterText) {
                this.filterSourceNodes(nodes, filterText);
            }
            return nodes;

        },

        /**
         * 检测当前信号源状态
         */
        checkSourceStatus(row, sourceStatus) {
            var currentstatus = sourceStatus.filter(function(value){
                    return value.ID == row.ID
            })[0]

            return  currentstatus ? (!(!currentstatus.State)) : false
        },

        /**
         * 输入关键字过滤信源
         */
        filterSourceNodes(nodes, value) {
            const filterNodeMethod = this.filterNodeMethod;
            const traverse = function(node) {
                const childNodes = node.Children ? node.Children : [];
                childNodes.forEach((child) => {
                    child.visible = filterNodeMethod.call(child, value, child);
                    traverse(child);
                });

                if (!node.visible && childNodes.length) {
                    let allHidden = true;

                    childNodes.forEach((child) => {
                        if (child.visible) allHidden = false;
                    });

                    node.visible = allHidden === false;
                }
            };

            const tratohidden = function(node) {
                const childNodes = node.Children ? node.Children : [];
                node.isHidden = !node.visible
                delete node.visible
                childNodes.forEach((child) => {
                    tratohidden(child);
                });
            };

            nodes.forEach((node) => {
                traverse(node);
            })

            nodes.forEach((node) => {
                tratohidden(node);
            })
        },

        /**
         * 查找与输入关键字匹配的信号源名称
         */
        filterNodeMethod: function(value, data) {
            if (!value) return true;
            return data.Name.indexOf(value) !== -1;
        },

        getCollectionIndexByID: function(data, key, screenID) {
            let index = -1
            for(let i = 0; i < data.length; i++) {
                let item = data[i]
                if (screenID == data[i][key]) {
                    return i
                }
            }
            return index
        }
    },

    /**
     * 组件销毁前,销毁相关定时器、socket、大对象等，清理内存
     */
    beforeDestroy () {
        //清除监听信源状态的定时器
        if (this.all_signal_status_interval) {
            clearInterval(this.all_signal_status_interval)
            this.all_signal_status_interval = null
        }

        //清除监听节点状态的定时器
        if (this.all_node_interval) {
            clearInterval(this.all_node_interval)
            this.all_node_interval = null
        }

        //关闭信源预览的socket连接
        this.onCloseSourcePreview()

        //重置state/home的状态
        this.$store.commit('home/resetState')
    }
}
</script>

<style lang="less" src="./styles/home.less"></style>
