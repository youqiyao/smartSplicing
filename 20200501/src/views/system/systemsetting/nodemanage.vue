<style lang="less" src='./styles/nodemanage.less'></style>
<template>
    <div class="nodemanage">

			<el-row>
          <el-col :span="24">
          <div class="title"><span>{{$t('直通设置')}}</span></div>
          <div class="title"><span>{{$t('用于设置HDMI输入是否直通输出')}}</span></div>
          </el-col>
          
      </el-row>
        <el-row :gutter="16" style="height:100%;margin-right: 0;">
        	<div style="width: 10%;" >	
				  <el-switch
				  v-model="status"
				  @change='changestatus'
				  class='posi'
				  active-color="#ccc"
				  inactive-color="#ff4949">
				</el-switch>
        	</div>
				        
            <!--<el-col :span="12" style="height:100%;">
                <div class="managetools">
                    <el-button type="primary" class="recovernode" @click="nodeReset">{{$t('复位')}}</el-button>
                    <el-button @click="subSet" type="primary">{{$t('设置/取消编码直通')}}</el-button>
                </div>
                <div class="nodetree">
                    <el-tree
                            ref="chkbox"
                            :default-expanded-keys="[0, -1, -2]"
                            node-key="ID"
                            :data="baseData"
                            :props="defaultProps"
                            highlight-current
                            show-checkbox
                            @check-change="onChkChange"
                            accordion>
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="12" style="height:100%;">
                <div></div>-->
                
                <el-table
    ref="multipleTable"
    :data="tabledata"
    tooltip-effect="dark"
    style="width: 100%"
    height="100%"
    @selection-change="handleSelectionChange">
    
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      label="设备列表"
      min-width="85%">
      <template slot-scope="scope">{{ scope.row.IP }}</template>
    </el-table-column>
    
    
    
    <el-table-column
      prop="name"
      label="总开"
       min-width="5%">
       <template slot-scope="scope">
        <el-button
          type="text"
          size="small">
       		 开
        </el-button>
      </template>
    </el-table-column>
    
    <el-table-column
       min-width="5%">
      <template slot-scope="scope">
      	<el-switch
  v-model="scope.row.DirectConn"
  active-color="#ccc"
  inactive-color="#ff4949">
</el-switch></template>
    </el-table-column>
    
    <el-table-column
      prop="name"
      label="总关"
       min-width="5%">
       <template slot-scope="scope">
        <el-button
          type="text"
          size="small">
        		关
        </el-button>
      </template>
    </el-table-column>
    
  </el-table>
            </el-col>
        </el-row>
    </div>
</template>
<script>

    export default {
        data () {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'title',
                },
                baseData: [{
                    ID: 0,
                    title: this.$t('节点分支'),
                    children: [{
                        ID: -1,
                        title: this.$t('输入节点'),
//                    expand: true,
//                    disabled: true,
                    }, {
                        ID: -2,
                        title: this.$t('输出节点'),
                        children: [],
//                    expand: true,
//                    checked: true,
                    }]
                }],
              outputNode1: [],     //输出节点
                chkedNodes: [],  //被选中的节点
                status:false,
                tabledata: [
               		{
			          	IP: '2016-05-03',
			        	DirectConn:false
			        }
                ]
			            }
			        },
        created(){
            this.list()
        },
        methods: {
        	//总开、总关
        	changestatus:function(){
			let set1 = new Set()
			console.log("111")
//      		this.status=!this.status
        		for(var i=0;i<this.tabledata.length;i++){
        			this.tabledata[i].DirectConn=this.status
					set1.add(this.tabledata[i].IP)				
        		}
        		this.setDirect(this.status ? 0 :1, Array.from(set1 ) )
        	},
        	
        	
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
//    	console.log(val,this.multipleSelection)
        this.multipleSelection = val;
        console.log(val)
      },
            /**
             * 节点列表
             */
            list: function () {
                var url = '/api.v2.do.node.get'
                var params = {
                    "userid": this.$auth.getuid(),
                    "page": {"start":0,"limit":0},
                }
                this.$http(url, params).then((res) => {
                    if(res.data.status != 0) {
                        this.$message({
                            'type': 'error',
                            'message': this.$t('获取节点失败'),
                            'showClose': true,
                            'duration': 1500
                        })
                        return
                    }
                    if(res.data.msg && res.data.msg.body) {
                        this.tabledata = this._fmtData(res.data.msg.body)
                        for(var i=0;i<this.tabledata.length;i++){
                        	if(this.tabledata[i].DirectConn == 0){
                        		this.tabledata[i].DirectConn=true
                        	}else{
                        		this.tabledata[i].DirectConn=false
                        	}
                        }
                    } else {
                        this.tabledata = this._fmtData([])
                    }
                    this._appendTree()
                }).catch((err) => {})
            },

            nodeReset: function() {
                var resetNodes = this.chkedNodes.filter((val ) => !!val.Type )
                let set = new Set()    
                if(resetNodes.length > 0 ){    
                    resetNodes.map(v => set.add(v.IP))
                }
                
                var url = 'api.v2.do.node.reboot'
                var params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "IP": Array.from(set)
                    }
                }
                this.$http(url, params).then((res) => {
                    if(res.data.status != 0) {
                        this.$message({
                            'type': 'error',
                            'message': this.$t("设备重启失败"),
                            'showClose': true,
                            'duration': 1500
                        })
                        return
                    }
                    this.$message({
                        'type': 'success',
                        'message': this.$t('设备正在重启中'),
                        'showClose': true,
                        'duration': 1500
                    })
                }).catch((err) => {})
            },

            /**
             * 设置取消编码直通
             * @param isDirect : 0/1
             * @param nodeIpArr: [ip1, ip2, ... ]
             */
            setDirect: function (isDirect, nodeIpArr) {
                var url = '/api.v2.do.node.directornot'
                var params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "DirectConn": isDirect, 
                        "IP": nodeIpArr 
                    }
                }
                this.$http(url, params).then((res) => {
                        if(res.data.status == 0 ){
                            //刷新树节点
                            this.list()
                            this.$message({
                                'message': this.$t("设置成功"), 
                                'type': 'success',
                                'showClose': true,
                                'duration': 1500 
                            })
                        }else{
                            this.$message({
                                'message': this.$t("设置失败"), 
                                'type': 'error',
                                'showClose': true,
                                'duration': 1500 
                            })
                        }
                }).catch((err) => { console.log(err) })
            },

            /**
             * 点击触发设置、取消编码直通
             */
            subSet() {
                var directNodes = this.chkedNodes.filter((val ) => val.DirectConn == 1 ),
                    notDirectNodes = this.chkedNodes.filter((val ) => val.DirectConn == 0 )
                if(directNodes.length > 0 ){
                    let set1 = new Set()
                    directNodes.map(v => set1.add(v.IP))
                    this.setDirect(0, Array.from(set1 ) )

                }

                if(notDirectNodes.length > 0 ){
                    let set2 = new Set()
                    notDirectNodes.map(v => set2.add(v.IP))
                    this.setDirect(1, Array.from(set2 ) )

                }

            },

            /**
             * 选中节点变化时触发 记录当前被选中的节点
             */
            onChkChange: function () {
                this.chkedNodes = this.$refs.chkbox.getCheckedNodes()
            },

            /**
             * 格式化数据
             */
            _fmtData: function (dt ) {
                var rtnDt = []
                for(var i in dt ){ dt[i].title = dt[i].IP;  rtnDt.push(dt[i]) }
                return rtnDt
            },

            /**
             * 增加树节点
             * @private
             */
            _appendTree: function () {
                var tmp = this.outputNode
                tmp.map((val ) => {if(val.DirectConn){val.title += '(' + this.$t('直通') + ')'} return val } )
                this.baseData[0].children[1].children = tmp
                this.baseData[0].children[1].expand = true
            },
        },
    }
</script>
