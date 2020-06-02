<style lang="less" src="./styles/index.less" scoped></style>
<template>
    <div class="container-area" @mousewheel="onContainerMouseWheel" :style="containerStyle">
        <!--画布容器 -->
        <div :ref="sid | createRefs('areacanvas_')" class="container-canvas">
            <canvas :ref="sid | createRefs('canvas_')" class="canvas" ></canvas>
            <canvas :ref="sid | createRefs('preview_canvas_')" class="preview_canvas"></canvas>
            <!--生成的窗口-->
            <div 
              v-show="!templateOp"  
              v-for="item in virtualWindowList" 
              :ref="item.ID | createRefs('window_')" 
              :windowid="item.ID" 
              :key="'window'+item.ID"
              :class="{channel: true, selected: item.ID == winId, opacity: windowOpacity}" 
              :style="item | setWindowStyle" 
              :title="item.SourceName">
                <span v-show="audio.WindowID == item.ID"  class="audio-icon">
                <i :class="{'fa': true, 'fa-volume-up': !audio.Mute, 'fa-volume-off': !!audio.Mute}"></i>
                </span>
            </div>
            <!--生成的模板窗口-->
            <div 
              v-show="!!templateOp"  
              v-for="(item, index) in virtualTemplateWindowList"
              :ref="index | createRefs('template_')"
              :key="'template_' + index"
              :templatewinindex="index"    
              @drop="drop($event, item, index)" 
              @dragover="allowDrop($event)"
              :class="{templatewindow: true, opacity: template_enable_id != 0, selected: index == templateIndex}"
              :style="item | setTemplateWindowStyle">
            </div>
            <!--鼠标点击信源绘制窗口时的背景遮罩层-->
            <div ref="temp-shade" id="temp_shade" class="temp-shade" v-show="isTempShadeShow"></div>
            <!--鼠标拖拽信源绘制窗口时的背景遮罩层-->
            <div ref="drag-temp-shade"
             id="drag-temp-shade"
             @drop="dropOnScreen($event, sid)"
             @dragover="allowDrop($event)"
             class="temp-shade"
             v-show="signalDragStatus"
             style="background: rgba(255, 0, 0, 0)"
            >
            </div>
            <!--要开的窗口 -->
            <div ref="temp" id="temp" class="temp" ></div>
            <!--锁屏遮罩层 -->
            <div :class="{'canvasmask': true, 'isshow': ismask}" @mousedown="onMaskMouseDown" @mousemove="onMaskMouseMove" @mouseup="onMaskMouseUp" @mouseout="onMaskMouseOut">
            </div>
            <!--预案启动的遮罩层 -->
            <div :class="{'screenshade': true, 'isshow': (!template_edit_id) && (!!plan_run_id)}"></div>
        </div>
        <!--  画布遮罩层按钮-->
        <el-tooltip class="item" effect="dark" :content="$t('锁住屏幕')" placement="bottom">
            <el-button @click="setmask" type="primary" class="fix-btn cover save6"></el-button>
        </el-tooltip>
        <!--  右击菜单栏组件-->
        <MouseContextMenu ref="mousecontextmenu" @select-callback="contextMenuCallback"></MouseContextMenu>
        <!-- 音频控制组件 -->
        <AudioControll ref="audio_controll" @audio-event="callbackAudioEvent"></AudioControll>
    </div>
</template>
<script>
// interact API-DOC: http://interactjs.io/docs/#interactevents
// jsmpeg DOC: https://github.com/phoboslab/jsmpeg 

import Interact from 'interactjs'
import Jsmpeg from 'jsmpeg'
import MouseContextMenu from '../mousecontextmenu'
import AudioControll from '../audiocontroll'

export default {
    name: 'Canvasarea',
    components: {
        MouseContextMenu, AudioControll
    },
    props: {
        screenData: {
            type: Object,
            required: true
        },
        signalDragStatus: {
            type: Boolean,
            required: true   
        }
    },
    data() {
        return {
            // 窗口
            windowList: [],                    //窗口列表
            winId: null,                       //当前选中的窗口id 
            windowOpacity: false,              //画布上窗口的透明度(是否是透明的)
            windowEventStatus: false,          //窗口事件状态，用于记录窗口的是否按下(长按着)的状态，默认是false
            
            //当前音频的状态
            audio: {                           
                "WallID": this.sid,
                "WindowID": 0,
                "Volume": 50,
                "Mute": 0
            },

            plan_interval: null,                //监听预案是否启动的定时器
            plan_run_id: null,                  //预案启动ID

            previewWebsocket: null,             //回显的websocket对象
            templateWindowList: [],             //当模板状态(启用或者编辑)下的模板窗口列表 
            templateIndex: -1,                  //当前选中模板索引 

            // 其他
            zoom: '1/1',                       //虚拟屏和实际屏缩放比例        
            canvasContainer: {                 //画布容器的样式状态 
                minstatus: false,
                minWidth: 0,
                minHeight: 0,
            }, 

            canvasStatus: false,                //画布事件状态，用于记录画布是否被按下(长按着)的状态,默认是false
            canvasEvent: null,                  //画布事件，用于记录画布事件    
            maskEventStatus: false,             //画布遮罩层事件状态，用于记录画布是否被按下的状态,默认是false

            isTempShadeShow: false,
            ismask: false,                      //画布区域遮罩层是否显示(是否禁用画布操作区)                                                     
        }
    },
    computed: {
        //所有的节点信息
        allNodeInfo: function() {
            return this.$store.state.allNodeInfo
        },

        //所有的节点状态
        nodeStatus: function() {
            return this.$store.state.allNodeStatus
        },

        //当前左侧工具栏选中的信号源url
        activeSignalUrl: function() {
            return this.$store.state.home.active_signal_url                    
        },

        //当前屏组ID
        sid: function() {
            return this.screenData.ID
        },

        //当前激活的屏组
        active_screen_id: function(){
            return this.$store.state.home.active_screen_id
        }, 

        /**
         * 此屏组下的启用的模板ID
         */
        template_enable_id: function() {
            return this.screenData.TemplateID
        },

        template_edit_id: function() {
            if(this.active_screen_id == this.sid) {
                return this.$store.state.home.template_edit_id
            } else {
                return 0
            }     
        },

        template_add_status: function() {
            if(this.active_screen_id == this.sid) {
                return this.$store.state.home.template_add_status
            } else {
                return false
            }    
        },

        //模板操作类型，空为不在模板状态
        templateOp: function() {
            if(this.template_enable_id != 0) {
                return 'call'
            } else if(this.plan_run_id != null) {
                return ''    
            } else if(this.template_edit_id != 0) {
                return 'edit'
            } else if(this.template_add_status) {
                return 'add'
            } else {
                return ''
            }
        },

        //虚拟屏上的窗口列表实际大小
        virtualWindowList: function() {
            var items = []
            this.windowList.forEach((val, index, array)=>{
                var item = {} 
                item.ID = val.ID
                item.Left = this.grade(val.Left)
                item.Top = this.grade(val.Top)
                item.Width = this.grade(val.Width)
                item.Height = this.grade(val.Height)
                item.Hierarchy = val.Hierarchy
                item.SourceUrl = val.SourceUrl
                item.HasAudio = val.HasAudio
                item.SourceName = val.SourceName
                item.SourceType = val.SourceType
                items.push(item)
            })
            return items
        },

        //虚拟模板区域大小
        virtualTemplateWindowList: function() {
            var items = []
            this.templateWindowList.forEach((val, index, array)=>{
                var item = {} 
                item.Left = this.grade(val.Left)
                item.Top = this.grade(val.Top)
                item.Width = this.grade(val.Width)
                item.Height = this.grade(val.Height)
                items.push(item)
            })
            return items
        },

        //右侧云台控制区的宽度
        chevron_right: function() {
            return this.$store.state.home.chevron_right
        },

        //窗口大小
        windowSize: function() {
            return this.$store.state.windowSize
        },

        containerAreaWidth: function() {
            let width = 0
            if(!!this.windowSize) {
                let windowSizeArr = this.windowSize.split("/")
                width = parseInt(windowSizeArr[0]) - 314 - 65 - 2 - this.chevron_right
            }
            return width
        },

        containerAreaHeight: function() {
            let height = 0
            if(!!this.windowSize) {
                let windowSizeArr = this.windowSize.split("/")
                height = parseInt(windowSizeArr[1]) - 62 - 15 - 42 - 3 - 42
            }
            return height
        },

        //画布容器大小
        containerStyle: function() {
            var style = {}
           // style.width = this.containerAreaWidth + 'px'
            style.width  = 100+'%' 
            style.height = 100+'%' 
            return style
        }
    },
    watch: {
        active_screen_id: function(newVal, oldVal) {
            
        },

        /**
         * 当前屏组启用的模板ID
         */
        template_enable_id: function(newVal, oldVal) {    
            if(newVal == 0) {
                this.onClosePreview()
                //停用模板时获取当前窗口
                this.getSceneWindowList()
            } else {
                //this.onOpenPreview()
                //模板启用获取模板数据
                this.getTemplateRect(this.template_enable_id)
            }
        },

        plan_run_id: function(newVal, oldVal) {
            if(newVal == null) {
                //预案停下的瞬间获取最新的窗口数据
                this.getSceneWindowList()
            } else {
                //设置模板编辑状态为0
                this.$store.commit("home/setTemplateEditId", 0)
                //设置模板编辑状态为false
                this.$store.commit("home/setTemplateAddStatus", false)
            }
        },

        templateOp: function(newVal, oldVal) {
            if(newVal == '') {
                //退出模板(新建,编辑，启用)状态时设置模板区域数据为空
                this.templateWindowList = []
            }
        },

        /**
         * 监听所有节点信息的变化(是否有节点被改了服务IP)
         */
        allNodeInfo: function(newVal, oldVal) {
            this.setScreenAllNodeStatus()
        },

        /**
         * 监听所有节点的状态变化(所有节点的状态是否发生了变化)
         */
        nodeStatus: function(newVal, oldVal){
            this.setScreenAllNodeStatus()
        }, 

        /**
         * 屏组数据
         */
        screenData: function(newVal, oldVal) {
            this.$nextTick(function(){
                this.initZoom()
            })    
        },

        /**
         * 右侧云台控制的显示
         */
        chevron_right: function(newVal, oldVal) {
            this.$nextTick(function(){
                this.initZoom()
            })    
        },
        /**
         * 浏览器大小变化
         */
        windowSize: function(newVal, oldVal) {
            this.canvasContainer.minstatus = false
            this.initZoom()
        },

        /**
         * 虚拟窗口列表
         */
        virtualWindowList: function(newVal, oldVal) {
            this.$nextTick(function(){
                this.registerAllWindowEvent() 
            })
        },

        /**
         * 监听模板数据变化
         */
        virtualTemplateWindowList: function(newVal, oldVal) {
            this.$nextTick(function(){
                this.registerAllTemplateEvent() 
            })
        },
    },
    filters: {     
        /**
         * 转成字符串
         */
        toString(value) {
            if(!value) return ''
            value = value.toString()
            return value
        },

        /**
         * 生成ref值
         */
        createRefs(id, name) {
            return name + id
        },

        /**
         * 根据数据生成窗口样式
         */
        setWindowStyle(windowData) {
            var style = {}
            style.width = windowData.Width + 'px'
            style.height = windowData.Height + 'px'
            style.left = windowData.Left + 'px'
            style.top = windowData.Top + 'px'
            style.zIndex = windowData.Hierarchy
            return style
        },

        /**
         * 根据数据生成模板窗口样式
         */
        setTemplateWindowStyle(windowData) {
            var style = {}
            style.width = windowData.Width + 'px'
            style.height = windowData.Height + 'px'
            style.left = windowData.Left + 'px'
            style.top = windowData.Top + 'px'
            return style
        },
    },
    created() {
        //初始化数据状态
        this.initData()

        //渲染之后的处理
        this.$nextTick(function(){
            this.initZoom()
            this.registerPreviewCanvasEvent()
            this.documentEvent()
        })        
    },     
    methods: {
        // ##########
        // 还原某些功能到初始化状态或设置某个监听状态
        // ##########

        /**
         * 重设音量
         */
        resetAudio: function() {
            this.audio = {
                "WallID": this.sid,
                "WindowID": 0,
                "Volume": 50,
                "Mute": 0
            }
        },

        // ##########
        // 初始化功能
        // ##########

        /**
         * 初始化数据状态
         */
        initData: function() {
            this.listenPlanInterval()
            this.getSceneWindowList()
            if(this.template_enable_id != 0) {
                //this.onOpenPreview()
                this.getTemplateRect(this.template_enable_id)
            }
            this.getAudio()
        },

        /**
         * 监听预案在跑的定时器
         */
        listenPlanInterval: function(){
            this.clearPlanInterval()
            this.listenPlanRunStatus()
            this.plan_interval = setInterval(() => {
                this.listenPlanRunStatus()
            }, 2000)   
        }, 

        /**
         * 清除预案监听的定时器
         */
        clearPlanInterval: function() {
            if (this.plan_interval) {
                clearInterval(this.plan_interval)
                this.plan_interval = null
            } 
        },

        /**
         * 监听预案启用状态
         */
        listenPlanRunStatus: function() {
            var url = '/api.v2.do.plan.isInterval'
            var params = {
                "userid": this.$auth.getuid(), 
                "body": {
                    "WallID": parseInt(this.sid)
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
                if(res.data.msg && res.data.msg.body) {
                    var plan_run_id = res.data.msg.body[0].ID
                } else {
                    var plan_run_id = null 
                }
                this.plan_run_id = plan_run_id
                if (this.plan_run_id != null) {
                    this.getSceneWindowList()
                }
                if(this.active_screen_id == this.sid) {
                    this.$store.commit("home/setPlanRunId", plan_run_id)
                }
            }).catch((err) => { console.log('监听预案启动状态失败!') })
        },

        /**
         * 获取当前场景下的窗口列表
         */
        getSceneWindowList: function() {
            var url = '/api.v2.do.screen.window'
            var params = {
                "userid": this.$auth.getuid(),
                "body": {'ID': this.sid}
            }
            this.$http(url, params).then((res) => {
                if (res.data.status !== 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('获取当前场景失败'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                if(!res.data.msg)
                    this.windowList = []
                else
                    this.windowList = res.data.msg.body
            }).catch((err) => {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('获取当前场景异常'),
                    'showClose': true,
                    'duration': 1500
                })
                return
            })
        },

        /**
         * 获取模板(启用或者编辑)的当前窗口数据
         */        
        getTemplateRect: function(id) {
            if(id == 0) {
                this.templateWindowList = []
                return
            }    
            let url = '/api.v2.do.model.getRec'
            let params = {
                "userid": this.$auth.getuid(), 
                "body": {
                    "ID": id,
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
                    this.templateWindowList = []
                    return
                }
                if(!res.data.msg) {
                    var templateWindowList = []
                } else {
                    var templateWindowList = res.data.msg.body.Window
                }
                this.templateWindowList = templateWindowList
            }).catch((err) => {})
        },

        /**
         * 获取音频信息
         */
        getAudio: function() {
            var url = '/api.v2.do.audio.get'
            var params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": 0,
                    "limit": 0
                },
                "body": {
                    "WallID": this.sid
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
                if((!res.data.msg) || (!res.data.msg.body)) {
                    this.audio = {
                        "WallID": this.sid,
                        "WindowID": 0,
                        "Volume": 50,
                        "Mute": 0
                    }
                    return
                }
                this.audio = res.data.msg.body[0]

                this.$refs.audio_controll.setvolume(this.audio.Volume)
                this.$refs.audio_controll.setmute(this.audio.Mute)

            }).catch((err) => { console.error(err) })
        },

        // ##########
        // 初始化元素和事件
        // ##########

        /*
         * 初始化容器(画布)与实际屏的比例
         */
        initZoom: function() {
            
            let width = this.containerAreaWidth 
            let height = this.containerAreaHeight *2
            //设置缩放比例    
            this.setZoom(width, height)
            
            //画布初始化
            this.setContainerCanvasStyle()   
            this.createScreenCanvas()               
            this.setScreenAllNodeStatus()
        },

        /**
         * 设置虚拟屏和实际屏的缩放比例
         */
        setZoom: function(width, height) {
            if (this.screenData.IsLed) {
                //LED屏            
                var rWidth = this.screenData.LedW                             //真实屏宽度
                var rHeight = this.screenData.LedH                            //真实屏高度
            } else {
                //液晶屏
                var rWidth = this.screenData.Columns * this.screenData.UintW  //真实屏宽度
                var rHeight = this.screenData.Rows * this.screenData.UintH    //真实屏高度
            }

            if (width / rWidth < height / rHeight) {
                this.zoom = [width, rWidth].join('/')
            } else {
                this.zoom = [height, rHeight].join('/')
            }          
        },

        /**
         * 按照缩放比例缩放数据
         */
        grade: function(num) {
            var zoom = this.zoom.split('/');
            return parseFloat((num * zoom[0] / zoom[1]).toFixed(10));
        },

        /**
         * 按照缩放比例放大数据
         */
        ungrade: function(num, type) {
            var zoom = this.zoom.split('/'),
                le = Math.round(zoom[1] * num / zoom[0]);
            if (type == 'top' || type == 'height') {
                var h = this.screenData.unitH;
                var scale = (type == 'top') ? (le / h).toFixed(10).split('.') : (h / le).toFixed(10).split('.')
                if (parseFloat(0 + '.' + scale[1]) >= 0.99 ) {
                    return h * (parseInt(scale[0]) + 1);
                }
            }
            return le;
        },

        /**
         * 设置画布和容器的相关样式
         */
        setContainerCanvasStyle: function() {
            let rWidth, rHeight
            if (this.screenData.IsLed) {
                rWidth = this.screenData.LedW                             //真实屏宽度
                rHeight = this.screenData.LedH                            //真实屏高度
            } else {
                rWidth = this.screenData.Columns * this.screenData.UintW  //真实屏宽度
                rHeight = this.screenData.Rows * this.screenData.UintH    //真实屏高度
            }
            
            let canvasWidth = this.grade(rWidth)    //虚拟画布宽度
            let canvasHeight = this.grade(rHeight)  //虚拟画布高度

            if (this.containerAreaHeight > canvasHeight) {
                this.$refs['areacanvas_' + this.sid].style.top = (this.containerAreaHeight - canvasHeight) / 2 + 'px'
            } else {
                this.$refs['areacanvas_' + this.sid].style.top = 0 + 'px'
            }
            
            if (this.containerAreaWidth > canvasWidth) {
                this.$refs['areacanvas_' + this.sid].style.left = (this.containerAreaWidth - canvasWidth) / 2 + 'px'
            } else {
                this.$refs['areacanvas_' + this.sid].style.left = 0 + 'px'
            }
            //yang
            this.$refs['areacanvas_' + this.sid].style.top = 1 + 'px'
            this.$refs['areacanvas_' + this.sid].style.left = 0 + 'px'

            //设置画布父亲容器宽度
            this.$refs['areacanvas_' + this.sid].style.width = canvasWidth + 'px' 
            //设置画布父亲高度 
            this.$refs['areacanvas_' + this.sid].style.height = canvasHeight + 'px'

            this.$refs['canvas_' + this.sid].width = canvasWidth  //设置画布宽度
            this.$refs['canvas_' + this.sid].height = canvasHeight  //设置画布高度

            //如果画布容器最小宽度、高度没设置,则设置一下
            if(!this.canvasContainer.minStatus) {
                this.canvasContainer.minWidth = canvasWidth;
                this.canvasContainer.minHeight = canvasHeight;
                this.canvasContainer.minStatus = true
            }
        },

        /**
         * 创建虚拟屏画布,画网格
         */
        createScreenCanvas: function() {
            this.screenData.IsLed ?  this.createLedScreenCanvas() : this.createLiquidScreenCanvas()
        },

        /**
         * 绘制液晶屏的逻辑网格 
         */
        createLiquidScreenCanvas () {
            const rows = this.screenData.Rows                 //  行
            const columns = this.screenData.Columns           // 列
            const gridColumns = this.screenData.GridColumns   // 逻辑网格列数
            const gridRows = this.screenData.GridRows         // 逻辑网格行数

            let c = this.$refs['canvas_' + this.sid]
            let cWidth = c.width
            let cHeight = c.height
                
            let px = cWidth / columns       //网格水平间隔
            let py = cHeight / rows         //网格垂直间隔
            let cx = c.getContext("2d")
        
            //画虚拟屏  
            cx.clearRect(0, 0, cWidth, cHeight)
            cx.lineWidth = 1;
            cx.translate(0.5, 0.5)
            cx.strokeStyle = "#fff"
            
            //横线
            for (let yi = 0; yi <= rows; yi++) {
                cx.beginPath()
                if (parseInt(yi * py) == cHeight) {
                    cx.moveTo(0, yi * py - 1)
                    cx.lineTo(cWidth, yi * py - 1)
                } else {
                    cx.moveTo(0, yi * py)
                    cx.lineTo(cWidth, yi * py)
                }
                cx.closePath()
                cx.stroke()
            }

            //竖线
            for (let xi = 0; xi <= columns; xi++) {
                cx.beginPath();
                if (parseInt(xi * px) == cWidth) {
                    cx.moveTo(xi * px - 1, 0);
                    cx.lineTo(xi * px - 1, cHeight)
                } else {
                    cx.moveTo(xi * px, 0)
                    cx.lineTo(xi * px, cHeight)
                }
                cx.closePath()
                cx.stroke()
            }

            //逻辑网格
            if (this.screenData.GridRows || this.screenData.GridColumns) {
                let tx = px / gridColumns
                let ty = py / gridRows

                //横线  
                for (let yi = 1; yi < rows * gridRows; yi++) {
                    if (yi % gridRows == 0) continue
                    cx.beginPath()
                    cx.strokeStyle = "#fff"
                    cx.setLineDash([3, 5])
                    cx.moveTo(0, yi * ty)
                    cx.lineTo(cWidth, yi * ty)
                    cx.closePath()
                    cx.stroke()
                }

                //竖线
                for (let xi = 1; xi < columns * gridColumns; xi++) {
                    if (xi % gridColumns == 0) continue
                    cx.beginPath();
                    cx.strokeStyle = "#fff"
                    cx.setLineDash([3, 5])
                    cx.moveTo(xi * tx, 0)
                    cx.lineTo(xi * tx, cHeight)
                    cx.closePath()
                    cx.stroke()
                }
            };

            //显示屏组行号
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < columns; x++) {
                    let xy = (y + 1) + '-' + (x + 1)
                    cx.beginPath()
                    cx.font = "14px Courier New"
                    cx.fillStyle = "#fff"
                    cx.fillText(xy, px * x + 10, py * y + 20)
                }
            }
        },

        /**
         * 绘制Led显示屏的逻辑网格
         */
        createLedScreenCanvas () { 
            const ledW = this.screenData.LedW //LED屏长
            const ledH = this.screenData.LedH //LED屏宽
            const uintW = this.screenData.UintW //分辨长
            const uintH = this.screenData.UintH //分辨率宽
            const gridColumns = this.screenData.GridColumns // 逻辑网格列数
            const gridRows = this.screenData.GridRows //  逻辑网格行数

            let columns = Math.ceil(ledW / uintW)
            let rows = Math.ceil(ledH / uintH)

            let c = this.$refs['canvas_' + this.sid]
            let cWidth = c.width
            let cHeight = c.height
                
            let px = (cWidth / ledW) * uintW //网格水平间隔
            let py = (cHeight / ledH) * uintH  //网格垂直间隔
            let cx = c.getContext("2d")
        
            //画虚拟屏  
            cx.clearRect(0, 0, cWidth, cHeight)
            cx.lineWidth = 1;
            cx.translate(0.5, 0.5)
            cx.strokeStyle = "#fff"
            
            //横线
            for (let yi = 0; yi <= rows; yi++) {
                cx.beginPath()
                if (parseInt(yi * py) == c.height) {
                    cx.moveTo(0, yi * py - 1)
                    cx.lineTo(c.width, yi * py - 1)
                } else {
                    cx.moveTo(0, yi * py)
                    cx.lineTo(c.width, yi * py)
                }
                cx.closePath()
                cx.stroke()
            }

            //竖线
            for (let xi = 0; xi <= columns; xi++) {
                cx.beginPath();
                if (parseInt(xi * px) == c.width) {
                    cx.moveTo(xi * px - 1, 0);
                    cx.lineTo(xi * px - 1, c.height)
                } else {
                    cx.moveTo(xi * px, 0)
                    cx.lineTo(xi * px, c.height)
                }
                cx.closePath()
                cx.stroke()
            }

            //逻辑网格
            if (gridRows || gridColumns) {
                let tx = px / gridColumns
                let ty = py / gridRows

                let yCount = Math.ceil(cHeight / ty) //横线数量
                let xCount = Math.ceil(cWidth / tx) //纵线数量

                //横线  
                for (let yi = 1; yi < yCount; yi++) {
                    if (yi % gridRows == 0) continue
                    cx.beginPath()
                    cx.strokeStyle = "#fff"
                    cx.setLineDash([3, 5])
                    cx.moveTo(0, yi * ty)
                    cx.lineTo(c.width, yi * ty)
                    cx.closePath()
                    cx.stroke()
                }

                //竖线
                for (let xi = 1; xi < xCount; xi++) {
                    if (xi % gridColumns == 0) continue
                    cx.beginPath()
                    cx.strokeStyle = "#fff"
                    cx.setLineDash([3, 5])
                    cx.moveTo(xi * tx, 0)
                    cx.lineTo(xi * tx, c.height)
                    cx.closePath()
                    cx.stroke()
                }
            };

            //显示屏组行号
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < columns; x++) {
                    let xy = (y+1) + '-' + (x+1)
                    cx.beginPath()
                    cx.font = "14px Courier New"
                    cx.fillStyle = "#fff"
                    cx.fillText(xy, px * x+10, py * y+20)
                }
            }
        },

        /**
         * 设置屏组的绑定节点的状态
         */
        setScreenAllNodeStatus: function() {
            let rows, columns
            if(this.screenData.IsLed) {
                rows = Math.ceil(this.screenData.LedH / this.screenData.UintH)
                columns = Math.ceil(this.screenData.LedW / this.screenData.UintW)
            } else {
                rows = this.screenData.Rows
                columns = this.screenData.Columns
            }

            for(let row = 0; row < rows; row++) {
                for(let column = 0; column < columns; column++){
                    this.checkScreenNodeStatus(row, column)
                }
            }
        },

        /**
         * 检查屏组每一个屏的绑定节点的状态
         */
        checkScreenNodeStatus: function(row, column) {
            let ip = null
            let state = 0
            for(let i = 0; i < this.allNodeInfo.length; i++) {
                if(this.sid == this.allNodeInfo[i].WallID && this.allNodeInfo[i].Row == row && this.allNodeInfo[i].Column == column) {
                    ip = this.allNodeInfo[i].IP
                    break
                }
            }
            if(ip) {
                state = this.checkIPStatus(ip)
            }             
            this.drawNodeState(row, column, state)
        },

        /**
         * 检查某一个IP的状态 
         */
        checkIPStatus: function(ip) {
            let state = 2
            let select_nodeinfo = this.nodeStatus.filter(value => {
                return value.IP == ip
            })
            if (select_nodeinfo.length == 1 && select_nodeinfo[0].State == 1){
                state = select_nodeinfo[0].State
            }
            return state
        },

        /**
         * 根据节点状态在画布上绘制图标
         */
        drawNodeState: function(row, column, state) {
            let c = this.$refs['canvas_' + this.sid]
            let cWidth = c.width
            let cHeight = c.height
            let px, py
            if (this.screenData.IsLed) {
                px = cWidth / this.screenData.LedW * this.screenData.UintW     //网格水平间隔
                py = cHeight / this.screenData.LedH * this.screenData.UintH    //网格垂直间隔
            } else {
                px = cWidth / this.screenData.Columns                          //网格水平间隔
                py = cHeight / this.screenData.Rows                            //网格垂直间隔
            }
            let cx = c.getContext("2d")
            let position_x, position_y
            if(this.screenData.Degree % 2 == 0) {
                position_x = px * column + 40
                position_y = py * row + 6 
            } else {
                position_x = px * column + 6
                position_y = py * row + 30 
            }           
            this.drawNodeImage(state, position_x, position_y, cx)    
        },

        /**
         * 清除画布原位置的图像，绘制新的图像到原位置 
         */
        drawNodeImage(state, position_x, position_y, cx) {
            let img = new Image();
            let domin = 'http://' + location.hostname + ':8888'
            img.src = domin + '/static/img/node_icon/node_' + state + '.png'
            if(img.complete){                           //图片已经缓存了
                cx.clearRect(position_x, position_y, 22, 22)
                cx.drawImage(img,  position_x, position_y)
            } else {                                    //图片未缓存
                img.onload = function() {
                    cx.clearRect(position_x, position_y, 22, 22)
                    cx.drawImage(img,  position_x, position_y)
                }   
            }           
        },

        // ##########
        // 注册事件区
        // ##########

        /**
         * 注册document事件
         */
        documentEvent: function() {
            document.addEventListener('click', this.onDocumentClick)
        },

        /**
         * 注册画布上事件
         */
        registerPreviewCanvasEvent: function() {
            var $element = this.$refs['preview_canvas_' + this.sid] 
            //画布右击显示右键菜单
            $element.addEventListener("contextmenu", this.onCanvasShowContextMenu)
            //鼠标按下
            $element.addEventListener('mousedown', this.onCanvasMousedown)
        },

        /**
         * 注册所有的窗口的事件
         */
        registerAllWindowEvent: function() {
            this.windowList.forEach((val, index, array) => {
                this.registerWindowEvent(val.ID)
            })
        },

        /**
         * 注册单个窗口操作事件
         */
        registerWindowEvent: function(id) {
            var $windowElem = this.$refs['window_' + id][0]

            //鼠标点击选中窗口
            $windowElem.removeEventListener("click", this.onWinHandleClick) //解除原来的绑定的事件
            $windowElem.addEventListener("click", this.onWinHandleClick)    //绑定新的事件

            //鼠标右击显示右键菜单
            $windowElem.removeEventListener("contextmenu", this.onWinShowContextMenu);  //解除原来的绑定的事件
            $windowElem.addEventListener("contextmenu", this.onWinShowContextMenu);     //绑定新的事件

            //窗口拖动事件
            Interact($windowElem).draggable({
                inertia: true,
                onstart: this.onWinDragStart,
                onmove: this.onWinDragMove,
                onend: this.onWinDragEnd
            }).resizable({            //窗口放大缩小事件
                inertia: false,
                squareResize: true,                            
                edges: { left: true, right: true, bottom: true, top: true }
            })
            .off('resizestart', this.onWinResizeStart)
            .on('resizestart', this.onWinResizeStart)
            .off('resizemove', this.onWinResizeMove)
            .on('resizemove', this.onWinResizeMove)
            .off('resizeend', this.onWinResizeEnd)
            .on('resizeend', this.onWinResizeEnd)
        },

        /**
         * 注册所有的模板窗口的事件
         */
        registerAllTemplateEvent: function() {
            this.templateWindowList.forEach((val, index, array) => {
                this.registerTemplateEvent(val, index)
            })
        },

        /**
         * 注册单个模板窗口操作事件
         */
        registerTemplateEvent: function(val, index) {
            var $templateElem = this.$refs['template_' + index][0]

            //鼠标点击选中模板窗口
            $templateElem.removeEventListener("click", this.onTemplateHandleClick)
            $templateElem.addEventListener("click", this.onTemplateHandleClick)

            //鼠标右击显示右键菜单
            $templateElem.removeEventListener("contextmenu", this.onTemplateContextMenu);
            $templateElem.addEventListener("contextmenu", this.onTemplateContextMenu);

            //模板窗口拖动事件
            Interact($templateElem).draggable({
                inertia: true,
                onstart: this.onTemplateDragStart,
                onmove: this.onTemplateDragMove,
                onend: this.onTemplateDragEnd
            }).resizable({            //窗口放大缩小事件
                inertia: false,
                squareResize: true,                            
                edges: { left: true, right: true, bottom: true, top: true }
            })
            .off('resizestart', this.onTemplateResizeStart)
            .on('resizestart', this.onTemplateResizeStart)
            .off('resizemove', this.onTemplateResizeMove)
            .on('resizemove', this.onTemplateResizeMove)
            .off('resizeend', this.onTemplateResizeEnd)
            .on('resizeend', this.onTemplateResizeEnd)
        },            

        // ##########
        // 事件响应处理
        // ##########

        /** 
         * 设置画布遮罩层是否显示(画布是否被遮住)
         */
        setmask: function() {
            this.ismask = !this.ismask
        },

        /**
         * document事件处理
         */
        onDocumentClick: function(e) {
            this.$refs['mousecontextmenu'] && this.$refs['mousecontextmenu'].hide()
        },

        /**
         * 鼠标滚轮改变画布大小,重设虚拟屏和实际屏的比例
         */
        onContainerMouseWheel: function(e) {
            return
            let maxWidth, maxHeight
            if (this.screenData.IsLed) {
                maxWidth = this.screenData.LedW
                maxHeight = this.screenData.LedH
            } else {
                maxWidth = this.screenData.columns * this.screenData.unitW
                maxHeight = this.screenData.rows * this.screenData.unitH
            }
           
            let delta = e.wheelDelta/2
            let cW = parseFloat(this.$refs['areacanvas_' + this.sid].style.width.replace('px', ''))
            let cH = parseFloat(this.$refs['areacanvas_' + this.sid].style.height.replace('px', ''))

            var width = cW + delta,
                height =  cH + delta   
            if (cW + delta < this.canvasContainer.minWidth || cH + delta < this.canvasContainer.minHeight) {
                width = this.canvasContainer.minWidth
                height = this.canvasContainer.minHeight
            }

            if (cW + delta >= maxWidth || cH + delta >= maxHeight) return   
            this.setZoom(width, height)

            //重绘制画布
            this.setContainerCanvasStyle()   
            this.createScreenCanvas()               
            this.setScreenAllNodeStatus()
            e.preventDefault();
        },

        // ##########
        // 开窗事件操作区
        // ##########

        /**
         * 鼠标在屏组按下并移动的时候画出临时Window
         */
        onCanvasMousedown: function(e) {
            //调用模板绑定信源操作
            if(this.templateOp == 'call') return;

            if (1 != e.buttons) return;
            var vm = this
            //显示遮罩层画板
            this.isTempShadeShow = true

            this.$refs['temp'].style.left = e.offsetX + 'px'
            this.$refs['temp'].style.top = e.offsetY + 'px'
            this.$refs['temp'].style.width = 0
            this.$refs['temp'].style.height = 0
            this.$refs['temp'].style.display = 'block'          

            this.canvasEvent = e;
            this.canvasStatus = true;

            //画布遮罩层显示并且绑定事件
            
            this.$refs['temp-shade'].addEventListener('mousemove', function(es) {
                vm.onCanvasMousemove(es);
            });

            this.$refs['temp-shade'].addEventListener('mouseout', function(es) {
                vm.onCanvasMouseout(es);
            });

            this.$refs['temp-shade'].addEventListener('mouseup', function(es) {
                vm.onCanvasMouseup(es);
            });

            this.$refs['temp'].addEventListener('mousemove', function(es) {
                vm.onCanvasMousemove(es);
            });

            this.$refs['temp'].addEventListener('mouseup', function(es) {
                vm.onCanvasMouseup(es);
            });     
        },

        /**
         * 鼠标移动360°开窗
         */
        onCanvasMousemove: function(e) {
            //调用模板绑定信源操作
            if(this.templateOp == 'call') return;

            if (!this.canvasStatus) return 
            if (!this.templateOp && !this.activeSignalUrl) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('开窗请先选择信号源'),
                    'showClose': true,
                    'duration': 1500
                })

                //隐藏遮罩层画板
                this.isTempShadeShow = false
                //this.$refs['temp-shade'].style.display = 'none';
                this.$refs['temp'].style.display = 'none';
                this.canvasStatus = false
                return 
            }
            var currentX = e.clientX;
            var currentY = e.clientY;
            var startX = this.canvasEvent.clientX;
            var startY = this.canvasEvent.clientY;

            var width = Math.abs(startX - currentX),
                height = Math.abs(startY - currentY),
                left,top
            
            if (startX - currentX > 0) 
                left = this.canvasEvent.offsetX - width
            if (startY - currentY > 0)
                top = this.canvasEvent.offsetY - height
            this.$refs['temp'].style.left = left + 'px'
            this.$refs['temp'].style.top = top + 'px'
            this.$refs['temp'].style.width = width + 'px'
            this.$refs['temp'].style.height = height + 'px'
            if(width >= 4 && height >= 4) {
                this.$refs['temp'].style.border = '2px dashed #ff0000'
            }
                                    
        },

        /**
         * 鼠标移出屏组外自动开窗
         */
        onCanvasMouseout: function(e) {
            //调用模板绑定信源操作
            if(this.templateOp == 'call') return;

            if(!this.canvasStatus) return
            var element = this.$refs['areacanvas_' + this.sid];
            var width = parseFloat(element.style.width.replace('px', '')), 
                height = parseFloat(element.style.height.replace('px', ''))
            if (this.canvasStatus) {
                if (e.offsetX <= 0 || e.offsetY <= 0 || e.offsetX >= width || e.offsetY >= height) {
                    this.onCanvasMouseup(e);
                }
            }
        },

        /**
         * 鼠标拿起画出窗口
         */
        onCanvasMouseup: function(e) {
            //调用模板绑定信源操作
            if(this.templateOp == 'call') return;

            if(!this.canvasStatus) return
            var tempStyle = this.getStyle(this.$refs['temp']);
            var left = parseFloat(tempStyle.left.replace('px', '')),
                top = parseFloat(tempStyle.top.replace('px', '')), 
                width = parseFloat(tempStyle.width.replace('px', '')), 
                height = parseFloat(tempStyle.height.replace('px', ''))

            //如果画的大小太小,则不处理    
            if(!this.canvasStatus || width < this.grade(this.screenData.UintW / 30) || height < this.grade(this.screenData.UintH / 30)) {
                this.$refs['temp'].style.display = 'none';
                //隐藏遮罩层画板
                this.isTempShadeShow = false
                //this.$refs['temp-shade'].style.display = 'none';
                this.canvasStatus = false; 
                return
            }

            this.canvasStatus = false;
            //隐藏遮罩层画板
            this.isTempShadeShow = false
            //this.$refs['temp-shade'].style.display = 'none';
            this.$refs['temp'].style.display = 'none'; 

            var window_left = this.ungrade(left, 'left'), 
                window_top = this.ungrade(top, 'top'),
                window_width = this.ungrade(width, 'width'),
                window_height = this.ungrade(height, 'height');
                
            if(!!this.templateOp) {
                //模板绘制模式
                var windowData = {
                    "Left": (window_left > 0) ? window_left : 0,
                    "Top": (window_top > 0) ? window_top : 0,
                    "Width": window_width,
                    "Height": window_height,
                }
            } else {
                //正常开窗模式
                var windowData = {
                    "WallID": this.sid,
                    "Left": (window_left > 0) ? window_left : 0,
                    "Top": (window_top > 0) ? window_top : 0,
                    "Width": window_width,
                    "Height": window_height,
                    "SourceUrl": this.activeSignalUrl,
                }  
            }

            windowData = this.setTableWindowData(windowData, null, 'create')
            windowData = this.parseIntwindowData(windowData)
            if(!!this.templateOp) {
                this.templateWindowList.push(windowData)
                return
            }

            var url = '/api.v2.do.window.add',
                params = {
                    userid: this.$auth.getuid(),
                    body: windowData
                }
            this.$http(url, JSON.stringify(params)).then((res) => {
                if(res.data.status != 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.getSceneWindowList()
            }).catch((err) => {
                this.$message({
                    'type': 'error',
                    'message': this.$t('响应错误'),
                    'showClose': true,
                    'duration': 1500
                })
                return
            })
        },     

        /**
         * 画布绘制时的遮罩层(鼠标按下时)
         */
        onMaskMouseDown: function(e) {
            //调用模板绑定信源操作
            if(this.templateOp == 'call') return;

            if(this.$el.scrollHeight < this.$el.clientHeight && this.$el.scrollWidth < this.$el.clientWidth) return
            this.maskEventStatus = true
            var target = e.target
            target.originX = e.clientX
            target.originY = e.clientY
        },
        
        /**
         * 画布绘制时的遮罩层(鼠标移动时)
         */
        onMaskMouseMove: function(e) {
            //调用模板绑定信源操作
            if(this.templateOp == 'call') return;

            if(!this.maskEventStatus) return
            var target = e.target
            var x = target.originX - e.clientX
            var y = target.originY - e.clientY
            target.originX = e.clientX
            target.originY = e.clientY
            if(this.$el.scrollLeft + x < this.$el.scrollWidth - this.$el.clientWidth) 
                this.$el.scrollLeft += x
            else
                this.$el.scrollLeft = this.$el.scrollWidth - this.$el.clientWidth
            
            if(this.$el.scrollTop + y < this.$el.scrollHeight - this.$el.clientHeight) 
                this.$el.scrollTop += y
            else 
                this.$el.scrollTop = this.$el.scrollHeight - this.$el.clientHeight               
        },

        /**
         * 画布绘制时的遮罩层(鼠标移出区域)
         */
        onMaskMouseOut: function(e) {
            //调用模板绑定信源操作
            if(this.templateOp == 'call') return;

            this.onMaskMouseUp(e)
        },

        /**
         * 画布绘制时的遮罩层(鼠标松开时)
         */
        onMaskMouseUp: function(e) {
            //调用模板绑定信源操作
            if(this.templateOp == 'call') return;

            this.maskEventStatus = false
        },

        /**
         * 窗口拖动开始
         */
        onWinDragStart: function(event) {
            if(event.button == 0) this.windowEventStatus = true
            
            this.winId = parseInt(event.target.getAttribute('windowid')) 
        },

        /**
         * 窗口拖动中
         */
        onWinDragMove: function (event) {
            if(!this.windowEventStatus) return false

            var previeCanvasWidth = parseFloat(this.$refs['areacanvas_' + this.sid].style.width.replace('px', ''))
            var previeCanvasHeight = parseFloat(this.$refs['areacanvas_' + this.sid].style.height.replace('px', ''))
            var target = event.target
            var left = parseFloat(target.style.left.replace('px', ''))
            var top = parseFloat(target.style.top.replace('px', ''))
            var width = parseFloat(target.style.width.replace('px', ''))
            var height = parseFloat(target.style.height.replace('px', ''))

            // set top and left of the element
            if (left + event.dx <= 0) {
                target.style.left = 0 + 'px'
            } else if(left + event.dx + width >= previeCanvasWidth) {
                target.style.left = (previeCanvasWidth - width) + 'px' 
            } else {
                target.style.left = (parseFloat(target.style.left.replace('px', '')) + event.dx) + 'px'
            }

            if (top + event.dy <= 0) {
                target.style.top = 0 + 'px'               
            } else if (top + event.dy + height >= previeCanvasHeight) {                    
                target.style.top = (previeCanvasHeight - height) + 'px'                  
            } else {
                target.style.top = (parseFloat(target.style.top.replace('px', '')) + event.dy) + 'px'
            }
        },

        /**
         * 窗口拖动结束
         */
        onWinDragEnd: function (event) {
            if(!this.windowEventStatus) return false

            this.windowEventStatus = false    
            var target = event.target,
                left = parseFloat(target.style.left.replace('px', '')),
                top = parseFloat(target.style.top.replace('px', '')),
                width = parseFloat(target.style.width.replace('px', '')),
                height = parseFloat(target.style.height.replace('px', ''))
            var $element = target

            var windowData = {
                ID: this.winId,
                Left: this.ungrade(left, 'left'),
                Top: this.ungrade(top, 'top'),
                Width: this.ungrade(width, 'width'),
                Height: this.ungrade(height, 'height'),
            }
            
            var windowData = this.setTableWindowData(windowData, $element, 'drag')
                windowData = this.parseIntwindowData(windowData)

            var url = '/api.v2.do.window.edit'
            var params = {
                userid: this.$auth.getuid(),
                body: windowData
            }
            
            this.$http(url, JSON.stringify(params)).then((res)=>{
                if(res.data.status !== 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })            
                }
                this.getSceneWindowList()
            }).catch((err)=>{
                this.$message({
                    'type': 'error',
                    'message': this.$t('操作失败'),
                    'showClose': true,
                    'duration': 1500
                })
                this.getSceneWindowList()
            })
            return false
        },

        /**
         * 窗口resize开始
         */
        onWinResizeStart: function(event) {
            if(event.button == 0) {
                this.windowEventStatus = true
            }
            this.winId = parseInt(event.target.getAttribute('windowid')) 
        },

        /**
         * 窗口resize中
         */
        onWinResizeMove: function (event) {
            if(!this.windowEventStatus) return false

            var areaCanvasWidth = parseFloat(this.$refs['areacanvas_' + this.sid].style.width.replace('px', '')),
            areaCanvasHeight = parseFloat(this.$refs['areacanvas_' + this.sid].style.height.replace('px', '')),
            target = event.target,
            left = parseFloat(target.style.left.replace('px', '')),
            top = parseFloat(target.style.top.replace('px', '')),
            width = parseFloat(target.style.width.replace('px', '')),
            height = parseFloat(target.style.height.replace('px', '')),

            minWidth = parseFloat(this.getStyle(target).minWidth.replace('px', '')),
            minHeight = parseFloat(this.getStyle(target).minHeight.replace('px', ''))

            //朝左
            if (event.deltaRect.left < 0) {
                if(left + event.deltaRect.left <= 0) {
                    width = width + left
                    left = 0
                } else {
                    left += event.deltaRect.left
                    width = width - event.deltaRect.left
                }
            } else if(event.deltaRect.left > 0) {
                if(minWidth >= width - event.deltaRect.left) {
                    left = left + width - minWidth
                    width = minWidth
                } else {
                    left += event.deltaRect.left
                    width = width - event.deltaRect.left
                }
            }
        
            //朝右
            if (event.deltaRect.right < 0) {
                if(minWidth >= width + event.deltaRect.right) {
                    width = minWidth
                } else {
                    width += event.deltaRect.right
                }
            } else if(event.deltaRect.right > 0) {
                if(left + width + event.deltaRect.right >= areaCanvasWidth) {
                    width = areaCanvasWidth - left
                } else {
                    width += event.deltaRect.right
                }
            } 

            //朝上
            if (event.deltaRect.top < 0) {
                if(top + event.deltaRect.top <= 0) {
                    height = top + height 
                    top = 0
                } else {
                    top += event.deltaRect.top
                    height = height - event.deltaRect.top
                }
            } else if(event.deltaRect.top > 0) {
                if(minHeight >= height - event.deltaRect.top) {
                    top = top + height - minHeight
                    height = minHeight
                } else {
                    top += event.deltaRect.top
                    height = height - event.deltaRect.top
                }
            } 

            //朝下
            if (event.deltaRect.bottom < 0) {
                if(minHeight >= height + event.deltaRect.bottom) {
                    height = minHeight
                } else {
                    height += event.deltaRect.bottom
                }
            } else if(event.deltaRect.bottom > 0) {
                if(top + height + event.deltaRect.bottom >= areaCanvasHeight) {
                    height = areaCanvasHeight - top
                } else {
                    height += event.deltaRect.bottom
                }
            }
            target.style.width  = width + 'px'
            target.style.height = height + 'px'
            target.style.left = left + 'px'
            target.style.top = top + 'px'
            return false
        },

        /**
         * 窗口resize结束
         */
        onWinResizeEnd: function(event) {
            if(!this.windowEventStatus) return false

            this.windowEventStatus = false
            var target = event.target,
                left = parseFloat(target.style.left.replace('px', '')),
                top = parseFloat(target.style.top.replace('px', '')),
                width = parseFloat(target.style.width.replace('px', '')),
                height = parseFloat(target.style.height.replace('px', ''))
            var $element = target

            let windowData = {
                ID: this.winId,
                Left: this.ungrade(left, 'left'),
                Top: this.ungrade(top, 'top'),
                Width: this.ungrade(width, 'width'),
                Height: this.ungrade(height, 'height'),
            }
                            
            windowData = this.setTableWindowData(windowData, $element, 'resize')
            windowData = this.parseIntwindowData(windowData)
            let url = '/api.v2.do.window.edit'
            let params = {
                userid: this.$auth.getuid(),
                body: windowData
            }
            
            this.$http(url, JSON.stringify(params)).then((res)=>{
                if(res.data.status !== 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    }) 
                }
                this.getSceneWindowList()
            }).catch((err)=>{
                this.$message({
                    'type': 'error',
                    'message': this.$t('操作失败'),
                    'showClose': true,
                    'duration': 1500
                })
                this.getSceneWindowList()
            })
            return false
        },

        // ##########
        // 模板窗口操作区
        // ##########

        /**
         * 模板窗口左键单击处理
         */
        onTemplateHandleClick(e){
            this.templateIndex = parseInt(e.target.getAttribute('templatewinindex'))
            e.preventDefault()
        },

        /**
         * 模板窗口右击处理
         */
        onTemplateContextMenu(e) {
            if (2 != e.button) return //不是右键，退出
            this.templateIndex = parseInt(e.target.getAttribute('templatewinindex'))
            var position = {}
            position.x = e.clientX
            position.y = e.clientY
            var data = [{
                text: this.$t("清除区域"),
                type: "clear_templaterec",
                hidden: (!this.templateOp || (this.templateOp == 'call')),
                disabled: false,
                callback: 'onClearTemplateRec',
                data: { 
                    'template_index': this.templateIndex
                }
            }, {
                text: this.$t("清除模板"),
                type: "clear_template",
                hidden: (!this.templateOp  || (this.templateOp == 'call')),
                disabled: false,
                callback: 'onClearTemplate'
            }, {
                text: this.$t("开启回显"),
                type: "open_preview",
                hidden: (this.templateOp != "call") || !(!this.previewWebsocket),
                disabled: false,
                callback: 'onOpenPreview'
            }, {
                text: this.$t("关闭回显"),
                type: "close_preview",
                hidden: !this.previewWebsocket,
                disabled: false,
                callback: 'onClosePreview'
            }];

            this.$refs['mousecontextmenu'].setMenu(position, data)
            e.preventDefault();       
        },

        /**
         * 模板拖动开始
         */
        onTemplateDragStart: function(event) {
            if(this.templateOp == 'call') return false
            if(event.button == 0) {
                this.templateEventStatus = true
            }
            this.templateIndex = parseInt(event.target.getAttribute('templatewinindex')) 
        },

        /**
         * 模板拖动中
         */
        onTemplateDragMove: function (event) {
            if(this.templateOp == 'call') return false
            if(!this.templateEventStatus) return false

            var previeCanvasWidth = parseFloat(this.$refs['areacanvas_' + this.sid].style.width.replace('px', ''))
            var previeCanvasHeight = parseFloat(this.$refs['areacanvas_' + this.sid].style.height.replace('px', ''))
            var target = event.target
            var left = parseFloat(target.style.left.replace('px', ''))
            var top = parseFloat(target.style.top.replace('px', ''))
            var width = parseFloat(target.style.width.replace('px', ''))
            var height = parseFloat(target.style.height.replace('px', ''))

            // set top and left of the element
            if (left + event.dx <= 0) {
                target.style.left = 0 + 'px'
            } else if(left + event.dx + width >= previeCanvasWidth) {
                target.style.left = (previeCanvasWidth - width) + 'px' 
            } else {
                target.style.left = (parseFloat(target.style.left.replace('px', '')) + event.dx) + 'px'
            }

            if (top + event.dy <= 0) {
                target.style.top = 0 + 'px'               
            } else if (top + event.dy + height >= previeCanvasHeight) {                    
                target.style.top = (previeCanvasHeight - height) + 'px'                  
            } else {
                target.style.top = (parseFloat(target.style.top.replace('px', '')) + event.dy) + 'px'
            }
        },

        /**
         * 模板拖动结束
         */
        onTemplateDragEnd: function (event) {
            if(this.templateOp == 'call') return false
            if(!this.templateEventStatus) return

            this.templateEventStatus = false                    
            var target = event.target,
                left = parseFloat(target.style.left.replace('px', '')),
                top = parseFloat(target.style.top.replace('px', '')),
                width = parseFloat(target.style.width.replace('px', '')),
                height = parseFloat(target.style.height.replace('px', ''))
            var $element = target

            var templateData = {
                Left: this.ungrade(left, 'left'),
                Top: this.ungrade(top, 'top'),
                Width: this.ungrade(width, 'width'),
                Height: this.ungrade(height, 'height'),
            }
            
            var templateData = this.setTableWindowData(templateData, $element, 'drag')
                templateData = this.parseIntwindowData(templateData)

            var index = parseInt(target.getAttribute('templatewinindex'))
            this.$set(this.templateWindowList, index, templateData)
                
            return false
        },

        /**
         * 模板resize开始
         */
        onTemplateResizeStart: function(event) {
            if(this.templateOp == 'call') return false
            if(event.button == 0) {
                this.templateEventStatus = true
            }
            this.templateIndex = parseInt(event.target.getAttribute('templatewinindex')) 
        },

        /**
         * 模板resize中
         */
        onTemplateResizeMove: function (event) {
            if(this.templateOp == 'call') return false
            if(!this.templateEventStatus) return 

            var areaCanvasWidth = parseFloat(this.$refs['areacanvas_' + this.sid].style.width.replace('px', '')),
            areaCanvasHeight = parseFloat(this.$refs['areacanvas_' + this.sid].style.height.replace('px', '')),
            target = event.target,
            left = parseFloat(target.style.left.replace('px', '')),
            top = parseFloat(target.style.top.replace('px', '')),
            width = parseFloat(target.style.width.replace('px', '')),
            height = parseFloat(target.style.height.replace('px', '')),

            minWidth = parseFloat(this.getStyle(target).minWidth.replace('px', '')),
            minHeight = parseFloat(this.getStyle(target).minHeight.replace('px', ''))

            //朝左
            if (event.deltaRect.left < 0) {
                if(left + event.deltaRect.left <= 0) {
                    width = width + left
                    left = 0
                } else {
                    left += event.deltaRect.left
                    width = width - event.deltaRect.left
                }
            } else if(event.deltaRect.left > 0) {
                if(minWidth >= width - event.deltaRect.left) {
                    left = left + width - minWidth
                    width = minWidth
                } else {
                    left += event.deltaRect.left
                    width = width - event.deltaRect.left
                }
            } 
        
            //朝右
            if (event.deltaRect.right < 0) {
                if(minWidth >= width + event.deltaRect.right) {
                    width = minWidth
                } else {
                    width += event.deltaRect.right
                }
                } else if(event.deltaRect.right > 0) {
                if(left + width + event.deltaRect.right >= areaCanvasWidth) {
                    width = areaCanvasWidth - left
                } else {
                    width += event.deltaRect.right
                }
            } 

            //朝上
            if (event.deltaRect.top < 0) {
                if(top + event.deltaRect.top <= 0) {
                    height = top + height
                    top = 0
                } else {
                    top += event.deltaRect.top
                    height = height - event.deltaRect.top
                }
            } else if(event.deltaRect.top > 0) {
                if(minHeight >= height - event.deltaRect.top) {
                    top = top + height - minHeight
                    height = minHeight
                } else {
                    top += event.deltaRect.top
                    height = height - event.deltaRect.top
                }
            } 

            //朝下
            if (event.deltaRect.bottom < 0) {
                if(minHeight >= height + event.deltaRect.bottom) {
                    height = minHeight
                } else {
                    height += event.deltaRect.bottom
                }
            } else if(event.deltaRect.bottom > 0) {
                if(top + height + event.deltaRect.bottom >= areaCanvasHeight) {
                    height = areaCanvasHeight - top
                } else {
                    height += event.deltaRect.bottom
                }
            }
            target.style.width  = width + 'px'
            target.style.height = height + 'px'
            target.style.left = left + 'px'
            target.style.top = top + 'px'

            return false
        },

        /**
         * 模板resize结束
         */
        onTemplateResizeEnd: function(event) {
            if(this.templateOp == 'call') return false
            if(!this.templateEventStatus) return false

            this.templateEventStatus = false
            var target = event.target,
                left = parseFloat(target.style.left.replace('px', '')),
                top = parseFloat(target.style.top.replace('px', '')),
                width = parseFloat(target.style.width.replace('px', '')),
                height = parseFloat(target.style.height.replace('px', ''))
            var $element = target

            var templateData = {
                Left: this.ungrade(left, 'left'),
                Top: this.ungrade(top, 'top'),
                Width: this.ungrade(width, 'width'),
                Height: this.ungrade(height, 'height'),
            }
                    
            templateData = this.setTableWindowData(templateData, $element, 'resize')
            templateData = this.parseIntwindowData(templateData)
            var index = parseInt(target.getAttribute('templatewinindex'))
            this.$set(this.templateWindowList, index, templateData)

            return false
        },

        /**
         * 拖拽信源放下生成窗口
         */
        dropOnScreen: function(e, id) {
            let maxUintLeftNum, maxUintTopNum, width, height
            let uintWidth = this.grade(this.screenData.UintW)
            let uintHeight = this.grade(this.screenData.UintH)
            let uintLeftNum = Math.floor(e.offsetX / uintWidth)
            let uintTopNum = Math.floor(e.offsetY / uintHeight)

            if (this.screenData.IsLed) {
                maxUintLeftNum = Math.floor(this.screenData.LedW / this.screenData.UintW)
                maxUintTopNum = Math.floor(this.screenData.LedH / this.screenData.UintH)
                width = (uintLeftNum >= maxUintLeftNum) ? (this.screenData.LedW - this.screenData.UintW * uintLeftNum) : this.screenData.UintW
                height = (uintTopNum >= maxUintTopNum) ? (this.screenData.LedH - this.screenData.UintH * uintTopNum) : this.screenData.UintH
            } else {
                maxUintLeftNum = this.screenData.Columns - 1
                maxUintTopNum = this.screenData.Rows - 1
                width = this.screenData.UintW
                height = this.screenData.UintH
            }

            let drag_signal_url = this.$store.state.home.drag_signal_url
            var windowData = {
                "WallID": id,
                "Left": uintLeftNum * this.screenData.UintW,
                "Top": uintTopNum * this.screenData.UintH,
                "Width": width,
                "Height": height,
                "SourceUrl": drag_signal_url,
            }
            windowData = this.setTableWindowData(windowData, null, 'create');
            windowData = this.parseIntwindowData(windowData);
            let url = '/api.v2.do.window.add'
            let params = {
                userid: this.$auth.getuid(),
                body: windowData
            }
            this.$http(url, JSON.stringify(params)).then((res) => {
                if(res.data.status != 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.getSceneWindowList()
            }).catch((err) => {
                this.$message({
                    'type': 'error',
                    'message': this.$t('响应错误'),
                    'showClose': true,
                    'duration': 1500
                })
                return
            })
        },
        
        /**
         * 信源拖动到模板窗口上,开窗
         */
        drop: function(e, data, index) {
            if(this.templateOp != 'call') return
            let drag_signal_url = this.$store.state.home.drag_signal_url
            var windowData = {
                "WallID": this.sid,
                "Left": this.templateWindowList[index].Left,
                "Top": this.templateWindowList[index].Top,
                "Width": this.templateWindowList[index].Width,
                "Height": this.templateWindowList[index].Height,
                "SourceUrl": drag_signal_url,
            }

            let url = '/api.v2.do.window.add'
            let params = {
                userid: this.$auth.getuid(),
                body: windowData
            }
            this.$http(url, JSON.stringify(params)).then((res) => {
                if(res.data.status != 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.getSceneWindowList()
            }).catch((err) => {
                this.$message({
                    'type': 'error',
                    'message': this.$t('响应错误'),
                    'showClose': true,
                    'duration': 1500
                })
                return
            })
        },    

        allowDrop: function(e) {
            e.preventDefault();
        }, 
        
        // ##########
        // 模板窗口操作区
        // ##########

        /**
         * 画布右击弹出提示框
         */
        onCanvasShowContextMenu(e) {
            if (2 != e.button) return
            var position = {}
            position.x = e.clientX
            position.y = e.clientY
            var data = [{
                text: this.$t("开启回显"),
                type: "open_preview",
                hidden: !(!this.previewWebsocket),
                disabled: false,
                callback: 'onOpenPreview'
            }, {
                text: this.$t("关闭回显"),
                type: "close_preview",
                hidden: !this.previewWebsocket,
                disabled: false,
                callback: 'onClosePreview'
            }, {
                text: this.$t('关闭音频'),
                type: "close_audio",
                hidden: (!!this.templateOp) || !this.audio.WindowID,
                disabled: false,
                callback: 'onCloseAudio'
            }, {
                text: this.$t("设置音量"),
                type: "set_audio",
                hidden: (!!this.templateOp) || !this.audio.WindowID,
                disabled: false,
                callback: 'onSetAudio'
            }, {
                text: this.$t("清屏"),
                type: "clear_window",
                hidden: (!!this.templateOp) || false,
                disabled: false,
                callback: 'onClearWindow'
            }, {
                text: this.$t("清除模板"),
                type: "clear_template",
                hidden: (!this.templateOp  || (this.templateOp == 'call')),
                disabled: false,
                callback: 'onClearTemplate'
            }]

            this.$refs['mousecontextmenu'].setMenu(position, data)    
            e.preventDefault()      
        },

        /**
         * 窗口左键单击处理
         */
        onWinHandleClick(e){      
            this.winId = parseInt(e.target.getAttribute('windowid'))                
            let windowData = this.getCurrentWindowData()
            this.$store.commit('home/setActiveWindowSourceUrl', windowData.SourceUrl)

            e.preventDefault()   
        },

        /**
         * 窗口右击显示菜单栏
         */
        onWinShowContextMenu(e) {
            if (2 != e.button) return //不是右键，退出
            
            this.winId = parseInt(e.target.getAttribute('windowid'))
            var windowData = this.getCurrentWindowData()
            this.$store.commit('home/setActiveWindowSourceUrl', windowData.SourceUrl)
            
            var left = parseFloat(e.target.style.left.replace('px', ''))
            var top = parseFloat(e.target.style.top.replace('px', ''))
            var winData = this.getCurrentWindowData()
            var position = {}
            position.x = e.clientX
            position.y = e.clientY
            var data = [{
                text: this.$t("开启回显"),
                type: "open_preview",
                hidden: !(!this.previewWebsocket),
                disabled: false,
                callback: 'onOpenPreview'
            }, {
                text: this.$t("关闭回显"),
                type: "close_preview",
                hidden: !this.previewWebsocket,
                disabled: false,
                callback: 'onClosePreview'
            }, {
                text: this.$t("开启音频"),
                type: "open_audio",
                hidden: (this.audio.WindowID == this.winId),
                disabled: !winData.HasAudio,
                callback: 'onOpenAudio'
            }, {
                text: this.$t("关闭音频"),
                type: "close_audio",
                hidden: !this.audio.WindowID,
                disabled: false,
                callback: 'onCloseAudio'
            }, {
                text: this.$t("设置音量"),
                type: "set_audio",
                hidden: !this.audio.WindowID,
                disabled: false,
                callback: 'onSetAudio'
            }, {
                text: this.$t("窗口置顶"),
                type: "top_window",
                hidden: false,
                disabled: false,
                callback: 'onTopWindow'
            }, {
                text: this.$t("窗口置底"),
                type: "bottom_window",
                hidden: false,
                disabled: false,
                callback: 'onBottomWindow'
            }, {
                text: this.$t("窗口关闭"),
                type: "close_window",
                hidden: false,
                disabled: false,
                callback: 'onCloseWindow'
            }, {
                text: this.$t("清屏"),
                type: "clear_window",
                hidden: false,
                disabled: false,
                callback: 'onClearWindow'
            }];

            this.$refs['mousecontextmenu'].setMenu(position, data)
            e.preventDefault();       
        },

        /**
         * 右击弹出框处理后回调
         */
        contextMenuCallback: function(funcName, data) {
            this[funcName](data)
        },

        // ##########
        // 回调事件处理区
        // ##########

        /**
         * 显示节点IP
         */
        onShowNodeIP: function (data) {
            var currentWallData = this.screenData,
            url = '/api.v2.do.screen.show',
            params = {
                "userid":  this.$auth.getuid(),
                "body": {
                "ID": this.sid,
                "ShowIp": 1
                }
            }

            this.$http(url, params).then((res)=>{
                if (!res.data.msg) return  
                this.screenData.ShowIp = 1  
                this.$message.success(this.$t('操作成功'))
            }).catch((err)=>{
                this.$message.success(this.$t('操作失败'))
            })
        },

        /**
         * 隐藏节点IP
         */
        onHideNodeIP: function (data) {
            var currentWallData = this.screenData,
                url = '/api.v2.do.screen.show',
                params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "ID": this.sid,
                        "ShowIp": 0
                    }
                }
            this.$http(url, params).then((res)=>{
                if (!res.data.msg) return 
                this.screenData.ShowIp = 0  
                this.$message.success(this.$t('操作成功'))
            }).catch((err)=>{
                this.$message.success(this.$t('操作失败'))
            })
        },

        /**
         * 开启回显
         */
        onOpenPreview: function(data) {
            var url = '/api.v2.do.screen.showBack' 
            var params = {
                "userid": this.$auth.getuid(),
                "body":{
                    "ID": this.sid
                }
            }
            this.$http(url, params).then((res)=>{
                if (0 !== res.data.status) {
                    this.$message({
                        message: this.$t(this.$msg[res.data.status]),
                        type: 'warning',
                        'showClose': true,
                        'duration': 1500
                    })
                    return 
                }
                if(!res.data.msg) {
                    this.$message({
                        message: this.$t('回显地址为空'),
                        type: 'warning',
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }

                var canvas = this.$refs['preview_canvas_' + this.sid]
                var address = res.data.msg.body.Echo 
                this.windowOpacity = true
                this.previewWebsocket = new WebSocket(address)
                let player = new Jsmpeg(this.previewWebsocket, {canvas:canvas}) 
                var vm = this
                this.previewWebsocket.onclose = function (event){
                    vm.clearCanvasColor();
                    vm.previewWebsocket = null
                };
                
                canvas.addEventListener("webglcontextlost", function(event) {
                    event.preventDefault();
                })
            }).catch((err)=>{
                this.$message({
                    message: this.$t('操作失败'),
                    type: 'warning'
                })
            })
        },

        /**
         * 关闭回显
         */
        onClosePreview: function(data) {
            if(this.previewWebsocket){  
                this.previewWebsocket.close()
                this.previewWebsocket = null
            }
        },

        /**
         * 清除画布颜色
         */
        clearCanvasColor() {
            setTimeout(() => {
                let c = this.$refs['preview_canvas_' + this.sid]
                this.windowOpacity = false
                let gl = c.getContext("experimental-webgl")
                gl.clearColor(0, 0, 0, 0)
                gl.clear(gl.COLOR_BUFFER_BIT)
            }, 100); 
        },

        /**
         * 开启音频
         */
        onOpenAudio: function(data) {
            var url = '/api.v2.do.audio.add'
            var params = {
                userid: this.$auth.getuid(),
                body: {
                    WindowID: this.winId,
                    WallID: this.sid,
                    Volume: this.audio.Volume
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
                this.audio.WindowID = this.winId
                this.getAudio()
            }).catch((err) => { })
        },

        /**
         * 关闭音频
         */
        onCloseAudio: function(data) {
            if (!this.audio.WindowID) return
            var url = '/api.v2.do.audio.del'
            var params = {
                userid: this.$auth.getuid(),
                body: {
                    WallID: this.sid,
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
                this.audio.WindowID = null
            }).catch((err) => { })
        },
        
        /**
         * 显示音频弹出框并设置显示数据
         */
        onSetAudio: function(data) {
            if (!this.audio.WindowID) return

            this.$refs.audio_controll._setmodal(true)
            this.$refs.audio_controll.setvolume(this.audio.Volume)
            this.$refs.audio_controll.setmute(this.audio.Mute)
        },
        
        /**
         * 音频设置音量之后的回调
         */
        callbackAudioEvent: function(funcName, data) {
            this[funcName](data)
        },

        /**
         * 设置静音与否
         */
        onSetMute: function(data) {
            if(!this.audio.WindowID) return 

            let url = '/api.v2.do.audio.setMute'
            let params = {
                userid: this.$auth.getuid(),
                body: {
                    WallID: this.sid,
                    Mute: data,
                } 
            }

            this.$http(url, params).then((res) => {
                if(0 !== res.data.status) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.getAudio()
            }).catch((err) => {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('操作失败'),
                    'showClose': true,
                    'duration': 1500
                })
            })
        },

        /**
         * 调整音量大小
         */
        onVolumeChange: function(value) {
            if(!this.audio.WindowID) return 

            let url = '/api.v2.do.audio.edit'
            let params = {
                userid: this.$auth.getuid(),
                body: {
                    WallID: this.sid,
                    Volume: value
                }
            }
            this.$http(url, params).then((res) => {
                if(0 !== res.data.status) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.getAudio()
            }).catch((err) => {
                this.$message({
                    'type': 'error',
                    'message': this.$t('操作失败'),
                    'showClose': true,
                    'duration': 1500
                })

                this.$refs.audio_controll.setvolume(this.audio.Volume)
            })
        },

        /**
         * 清屏
         */
        onClearWindow: function(data) {
            var url = '/api.v2.do.screen.rmWin',
                params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "ID": this.sid
                    }
                }
            this.$http(url, params).then((res) => {
                if (0 !== res.data.status) return
                this.getSceneWindowList()
                this.getAudio()  
            }).catch((err) => {
                this.$message({
                    'type': 'error',
                    'message': this.$('操作失败'),
                    'showClose': true,
                    'duration': 1500
                })
            })  
        },

        /**
         * 窗口置顶
         */
        onTopWindow: function(data) {
            var url = '/api.v2.do.window.top',
                params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                    "ID": this.winId,
                    "ToTop": 1
                    }
                }       
            this.$http(url, JSON.stringify(params)).then((res)=>{
                if (res.data.status !== 0) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return   
                }
                this.getSceneWindowList()  
            }).catch((err)=>{
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
         * 窗口置底
         */
        onBottomWindow: function(data) {
            var url = '/api.v2.do.window.top',
                params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                    "ID": this.winId,
                    "ToTop": 0
                    }
                }       
            this.$http(url, JSON.stringify(params)).then((res)=>{
                if (0 !== res.data.status) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.getSceneWindowList()  
            }).catch((err)=>{
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
         * 关闭窗口
         */
        onCloseWindow: function(data) {
            var url = '/api.v2.do.window.del',
                params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "ID": this.winId,
                    }
                }       
            this.$http(url, JSON.stringify(params)).then((res)=>{
                if (0 !== res.data.status) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t(this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.getAudio()
                this.getSceneWindowList()  
            }).catch((err)=>{
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
         * 关闭某一个模板窗口
         */
        onClearTemplateRec: function(data) {
            this.templateWindowList.splice(this.templateIndex, 1);
            this.templateIndex = null
        },

        /**
         * 清除所有的模板数据
         */
        onClearTemplate: function(data) {
            this.templateWindowList = [];
        },

        // ##########
        // 工具函数
        // ##########

        /**
         * 获取元素计算之后的样式
         */
        getStyle: function($el) {
            if (window.getComputedStyle) {
                return window.getComputedStyle($el, null)    // 非IE
            }else{ 
                return $el.currentStyle  // IE
            }
        },

        /**
         * 格式化窗口,使得窗口数据为数值
         */
        parseIntwindowData: function(windowData) {
            windowData.Left = parseInt(windowData.Left);
            windowData.Top = parseInt(windowData.Top);
            windowData.Width = parseInt(windowData.Width);
            windowData.Height = parseInt(windowData.Height);
            return windowData;
        },

        /**
         * 获取当前窗口数据 
         */
        getCurrentWindowData: function () {      
            let data = null
            let currentWindowData = this.windowList.filter(value => {
                return value.ID === this.winId 
            })[0]
            data = JSON.parse(JSON.stringify((currentWindowData)))
            return data
        },

        /**
         * 启用逻辑网格时窗口自动对齐
         */
        setTableWindowData: function(windowData, $elem, method) {
            if(this.screenData.GridColumns == 0 || this.screenData.GridRows == 0) return windowData //没有逻辑网格不吸附功能
                
            const baseX = this.screenData.UintW / this.screenData.GridColumns
            const baseY = this.screenData.UintH / this.screenData.GridRows
            let rWidth, rHeight
            if (this.screenData.IsLed) {
                rWidth = this.screenData.LedW
                rHeight = this.screenData.LedH
            } else {
                rWidth = this.screenData.UintW * this.screenData.Columns
                rHeight = this.screenData.UintH * this.screenData.Rows
            }

            let referenceX = Math.floor(windowData.Left / baseX) * baseX
            let referenceY = Math.floor(windowData.Top / baseY) * baseY
            let windowOffsetX_1 = windowData.Left - referenceX
            let windowOffsetY_1 = windowData.Top - referenceY
            let windowOffsetX_2 = windowData.Left - referenceX + windowData.Width
            let windowOffsetY_2 = windowData.Top - referenceY + windowData.Height

            //逻辑网格存在误差，定义基础误差数据
            var minErrorMath = 0.1;
            var width, height;

            //左边靠近右侧虚拟网格(误差为0.1).则让它向右侧缩进，反之向左
            var offsetX_1_num = Math.ceil(windowOffsetX_1 / baseX + minErrorMath - 1)    
            windowOffsetX_1 = offsetX_1_num * baseX

            //上边靠近下侧虚拟网格(误差为0.1).则让它向下侧缩进，反之向上
            var offsetY_1_num = Math.ceil(windowOffsetY_1 / baseY + minErrorMath - 1)
            windowOffsetY_1 = offsetY_1_num * baseY   
            if(method != 'drag') {
                    //右边靠近左侧网格(误差为0.1),则让它向左侧缩进,反之右侧
                var offsetX_2_num = Math.ceil(windowOffsetX_2 / baseX - minErrorMath)
                windowOffsetX_2 = offsetX_2_num * baseX
                if (windowOffsetX_2 + referenceX > rWidth) {
                    windowOffsetX_2 = rWidth - referenceX
                }

                //下边靠近上侧网格(误差为0.1),则让它向上侧缩进,反之下侧
                var offsetY_2_num = Math.ceil(windowOffsetY_2 / baseY - minErrorMath)
                windowOffsetY_2 = offsetY_2_num * baseY
                if (windowOffsetY_2 + referenceY > rHeight) {
                    windowOffsetY_2 = rHeight - referenceY
                }    

                if(method == 'resize' && offsetX_2_num === offsetX_1_num) { //缩放时左右两边接近(0.1)
                    if (offsetX_1_num === 1) {  //向左扩展
                        windowOffsetX_1 = (offsetX_1_num - 1) * baseX
                    } else {  //向右扩展
                        windowOffsetX_2 = (offsetX_2_num + 1) * baseX
                    }
                }

                if(method == 'resize' && offsetY_2_num === offsetY_1_num) { //缩放时上下两边接近(0.1)
                    if (offsetY_1_num === 1) {  //向上扩展
                        windowOffsetY_1 = (offsetY_1_num - 1) * baseY
                    } else {  //向下扩展
                        windowOffsetY_2 = (offsetY_2_num + 1) * baseY
                    }
                }
                width = windowOffsetX_2 - windowOffsetX_1
                height = windowOffsetY_2 - windowOffsetY_1
                windowData.Width = width
                windowData.Height = height
            }

            windowData.Left = referenceX + windowOffsetX_1
            if (windowData.Left + windowData.Width > rWidth) {
                windowData.Left =  windowData.Left - baseX
            }

            windowData.Top = referenceY + windowOffsetY_1
            if (windowData.Top + windowData.Height > rHeight) {
                windowData.Top = windowData.Top * baseY
            }

            if (null != $elem) {
                if ('drag' != method) {
                    $elem.style.width = this.grade(windowData.Width) + 'px'
                    $elem.style.height = this.grade(windowData.Height) + 'px'
                } 
                $elem.style.left = this.grade(windowData.Left) + 'px'
                $elem.style.top = this.grade(windowData.Top) + 'px'
            }
            return windowData;
        }
    },
    beforeDestroy () {
        this.clearPlanInterval()
        this.onClosePreview()
    }
}
</script>
