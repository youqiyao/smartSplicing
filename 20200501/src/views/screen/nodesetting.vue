<style lang="less" src='./styles/nodesetting.less'></style>
<template>
    <div class="nodesetting">
        <el-dialog
            :title="$t('节点设置')"
            :visible.sync="modal"
            customClass="node_modal"
            :close-on-click-modal="false"
            size="large"
        >
            <div class="node-body">
                <div class="nodeshow">
                    <div v-for="(item, index) in screenBindInfo" :key="'grid_' + index" :class="{inner: true, bind: !(!item.IP)}" :style="screenGridStyle" @drop="drop($event, item)" @dragover="allowDrop($event)">
                        <span>{{(item.Row+1) + '-' + (item.Column+1)}}</span>
                        <i :class="{'fa': true, 'fa-minus-circle': !(!item.IP), 'fa-plus-circle': !(item.ip) }" @click="handleUnbindNode(item)"></i>
                        <p>{{item.IP?item.IP:'unbound'}}</p>
                    </div>
                </div>               
                <div class="nodelist">
                    <div v-for="(item, index) in avaibleNodeList" :key="'node_' + index" class="node-item" draggable="true" @dragstart="dragstart($event, item, index)" @dragend="dragend($event, item, index)">{{item.IP}}</div>
                </div>
            </div>    
        </el-dialog>
    </div>
</template>

<script>
    import auth from '../../libs/auth' ;
    export default {
        data () {
            return {
                modal: false,
                screenData: null,
                nodeList: [],       //所有节点列表
                allBindNodeList: [],    //所有已绑定节点列表
                dragItemIndex: null,
            }
        },
        computed: {
            /**
             * [screenGridStyle 网格样式大小]
             * @return {[type]} [description]
             */
            screenGridStyle: function() {
                let rows, columns
                if (this.screenData.IsLed) {
                    rows = Math.ceil(this.screenData.LedH / this.screenData.UintH)
                    columns = Math.ceil(this.screenData.LedW / this.screenData.UintW)
                } else {
                    rows = this.screenData.Rows
                    columns = this.screenData.Columns
                }

                var obj = {}
                if(this.screenData == null) return obj
                if(rows) obj.height =  Math.floor((1 / rows) * 10000) / 100 + '%'
                if(columns) obj.width = Math.floor((1 / columns) * 10000) / 100 + '%' 
                return obj    
            },

            screenBindInfo: function() {
                if(this.screenData === null) return []
                let items = []
                let rows, columns
                if (this.screenData.IsLed) {
                    rows = Math.ceil(this.screenData.LedH / this.screenData.UintH)
                    columns = Math.ceil(this.screenData.LedW / this.screenData.UintW)
                } else {
                    rows = this.screenData.Rows
                    columns = this.screenData.Columns
                }
                
                for(var i = 0; i < rows; i++) {
                    for(var j = 0; j < columns; j++) {
                        var item = this.getSreenNodeData(i, j)             
                        items.push(item)
                    }
                }
                return items
            },
           
            avaibleNodeList: function() {
                return this.nodeList.filter(v => {
                    return v.IsBind === 0
                })
            },
        },
        methods: {
            /**
             * [_setmodal 设置显示隐藏]
             * @param  {[type]} status [description]
             * @return {[type]}        [description]
             */
            _setmodal: function(status) {
                this.modal = status
            },

            /**
             * [_setData 设置屏组数据]
             * @param {[type]} data [description]
             */
            _setData: function(data) {
                this.screenData = data
                this.resetOtherData()
            },

            /**
             * [resetOtherInfo 重新设置其他的数据]
             * @return {[type]} [description]
             */
            resetOtherData: function() {
                this.nodeList = []
                this.allBindNodeList = []

                this.list()
                this.getAllScreenNodeInfo()
            },

            /**
             * [getSreenNodeIP 获取屏组某一个屏的绑定IP]
             * @param  {[type]} row    [description]
             * @param  {[type]} column [description]
             * @return {[type]}        [description]
             */
            getSreenNodeData: function(row, column) {
                var data = {
                    'WallID': this.screenData.ID,
                    'Row': row,
                    'Column': column,
                    'IP': '',
                }    
                for(var i = 0; i < this.allBindNodeList.length; i++) {
                    if(this.allBindNodeList[i].WallID == this.screenData.ID && this.allBindNodeList[i].Row == row  && this.allBindNodeList[i].Column == column) {
                        data.IP = this.allBindNodeList[i].IP
                    }
                }
                return data
            },

            /**
             * [list 获取所有的节点]
             * @param  {[type]} start [description]
             * @param  {[type]} limit [description]
             * @return {[type]}       [description]
             */
            list: function () {
                var url = '/api.v2.do.node.get',
                    params = {
                        "userid": this.$auth.getuid(), 
                        "page": {
                            "start": 0,
                            "limit": 0
                        }
                    }
                this.$http(url, JSON.stringify(params)).then((res) => {
                    if(res.data.status !== 0 ){
                        this.$message({
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        })
                        return 
                    }
                    if(!res.data.msg) {
                        this.nodeList = []
                        return
                    }
                    this.nodeList = res.data.msg.body
                }).catch((err) => {
                    console.log(err)
                })    
            },

            /**
             * 获取所有屏组已绑定的节点
             */
            getAllScreenNodeInfo() {
                var url = '/api.v2.do.nodeBind.get',
                    params = {
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
                        return
                    }
                    if(!res.data.msg) {
                        this.allBindNodeList = []
                        return
                    }    
                    this.allBindNodeList = res.data.msg.body                   
                }).catch(err => { console.error(err) })    
            },

            handleUnbindNode: function(item) {
                if(!item.IP) return
                var url = '/api.v2.do.nodeBind.del',
                    params = {
                        "userid": this.$auth.getuid(),
                        "body": {
                            "IP": item.IP
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
                    } else {
                        this.$message({
                            'message': this.$t('解绑成功'),
                            'type': 'success',
                            'showClose': true,
                            'duration': 1500
                        })
                        this.getAllScreenNodeInfo()
                        this.list()
                    } 
                }).catch((err) => { console.error(err) })
            },
            
            bindNode(obj) {
                var url = '/api.v2.do.nodeBind.add',
                    params = {
                        userid: this.$auth.getuid(),
                        body: obj  
                    }
                this.$http(url, params).then(res => {
                    if(res.data.status !== 0) {
                        this.$message({
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        })
                        return
                    }
                    this.dragItemIndex = null
                    this.list()
                    this.getAllScreenNodeInfo()
                }).catch((err) => { console.error(err) })    
            },

            dragstart: function(event, item, index){
                this.dragItemIndex = index
                var url = '/api.v2.do.node.select',
                    params = {
                        userid: this.$auth.getuid(),
                        body: {
                            IP: item.IP,
                            Select: 1,
                        }  
                    }
                this.$http(url, JSON.stringify(params)).then((res) => {
                    if(res.data.status !== 0) {
                        this.$message({
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        })
                    }
                }).catch((err) => {})   
            },

            dragend: function(event, item, index){
                this.dragItemIndex = index
                var url = '/api.v2.do.node.select',
                    params = {
                        userid: this.$auth.getuid(),
                        body: {
                            IP: item.IP,
                            Select: 0,
                        }  
                    }
                this.$http(url, JSON.stringify(params)).then((res) => {
                    if(res.data.status !== 0) {
                        this.$message({
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        })
                    }
                }).catch((err) => {})   
            },

            drop: function(event, item){
                event.preventDefault();
                if(item.IP) {
                    this.$message({
                        'message': this.$t('节点已绑定，请先解绑'),
                        'type': 'warning',
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                var data = {
                    WallID: item.WallID,
                    Row: item.Row,
                    Column: item.Column,
                    IP: this.avaibleNodeList[this.dragItemIndex].IP
                }
                this.bindNode(data)
            },

            allowDrop: function(event){
              event.preventDefault();
            },
        }
    }
</script>
