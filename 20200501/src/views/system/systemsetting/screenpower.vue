<style lang="less" src='./styles/screenpower.less'></style>
<template>
    <div class="screenpower" ref="screenpower">
    	<el-row>
          <el-col :span="24">
          <div class="title"><span>{{$t('开机计划')}}</span></div>
          <div class="title"><span>{{$t('可以创建开关机策略')}}</span></div>
          </el-col>
          
      </el-row>
        <el-row :gutter="16" style="height:100%;">
            <!--<el-col :span="12" style="height:100%;">
            <div class="maintitle">
                <p>{{$t('屏组列表')}}</p>
            </div>
            <div class="screenlist">
                <el-table borber highlight-row :data="screendata"  stripe>
                    <el-table-column property="Name" :label="$t('屏组名称')" align="center"></el-table-column>
                    <el-table-column property="RowColumes" :label="$t('行×列')" align="center" :formatter="formatterRowColumn"></el-table-column>
                    <el-table-column property="Name" align="center" :label="$t('操作')">
                        <template scope="scope">
                            <el-button 
                              type="info"
                              size="small"
                              @click.native.prevent="handleScreenAction(scope.$index, 1)"
                              >{{$t('开机')}}
                            </el-button>
                            <el-button 
                              type="danger"
                              size="small"
                              @click="handleScreenAction(scope.$index, 0)"
                              >{{$t('关机')}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            </el-col>-->
            <el-col :span="24" style="height:100%;">
            <!--<div class="maintitle">
                <p>{{$t('电源方案列表')}}</p>
            </div>-->
            <div class="screentools">
                <el-button class="table-btn table-btn1" size=small @click='refresh()'><i class="fa fa-refresh mar-rig"></i></el-button>
                <el-button class="table-btn" size=small @click="openPowerPlanForm('add')"><i class="el-icon-plus mar-rig"></i>{{$t('添加')}}</el-button>
                <el-button class="table-btn" size=small @click="openPowerPlanForm('edit')"><i class="el-icon-edit mar-rig"></i>{{$t('编辑')}}</el-button>
                <el-button class="table-btn" size=small @click="handleDel"><i class="el-icon-delete mar-rig"></i>{{$t('删除')}}</el-button>
            </div>
             <div class="powerplanlist">
                <el-table highlight-current-row  :data="powerplandata" @current-change="curChange" >
                    <el-table-column property="Name" :label="$t('方案名称')" align="center"></el-table-column>
                    <el-table-column property="WallID" :label="$t('所属屏组')" align="center"></el-table-column>
                    <el-table-column :formatter="formatterAction" :label="$t('执行操作')" align="center" ></el-table-column>
                    <el-table-column :formatter="formatterEnable" :label="$t('是否启用')" align="center" ></el-table-column>
                </el-table>
            </div>
            <PowerPlanForm ref="powerplan_form"  @formsubmit="formsubmit" :screenlist="screendata"/>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import PowerPlanForm from '../powerplanform.vue';
    export default {
        name: 'screenpower',
        components: {
           PowerPlanForm,
        },
        data() {
            return {
              action: 0,
              screendata: [],
              powerplandata: [],
              curId: null,
            }
        },
         created() {
            // 页面初始化
            this.getScreenList()
            this.getPowerPlanList()
            // this.getScreenActionState()
        },
        methods: {
            //获取屏组数据
            getScreenList: function() {
                var url = '/api.v2.do.screen.get'
                var params = {
                    "userid": this.$auth.getuid()
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
                    if (!res.data.msg)
                        this.screendata = []
                    else 
                        this.screendata = res.data.msg.body
                }).catch((err) => {})
            },

            formatterRowColumn: function(row, column, cellValue) {
                return row.Rows + ' x ' + row.Columns
            },

            formatterAction(row, column, cellValue) {
                return row.Action == 0 ? this.$t('关机') : this.$t('开机')
            },

             formatterEnable(row, column, cellValue) {
                return row.Enable == 0 ? this.$t('否') : this.$t('是')
            },
            /* 
             * 获取屏组开关机状态
             
            getScreenActionState() {
              var url = '/api.v2.do.pwplan.sta'
              var params = {
                  "userid": this.$auth.getuid()
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
                  var actiondata = res.data.msg.body
                  this.action = actiondata.filter((val) => {
                    return val.WallID == this.screendata[index].WallID
                  })[0].Action

              }).catch((err) => {})
            },*/
            handleScreenAction: function(index, action) {
                var url = '/api.v2.do.pwplan.act'
                var params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "WallID": this.screendata[index].ID,
                        "Action": action
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

            // 获取屏组电源方案
            getPowerPlanList: function () {
                var url = '/api.v2.do.pwplan.get'
                var params = {
                    "userid": this.$auth.getuid(),
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
                    if (!res.data.msg)
                        this.powerplandata = []
                    else 
                        this.powerplandata = res.data.msg.body
                }).catch((err) => {})
            },

            // 刷新页面
            refresh: function () {
                this.curId = null        
                this.getPowerPlanList()
            },
            // 获取当前行的id
            curChange: function (newVal, oldVal) {
                if (null != newVal) {
                    this.curId = newVal.ID
                }
            },

            // 新建，编辑表单弹出处理
            openPowerPlanForm: function(type) {
              if(type == 'edit' && this.curId == null) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('请先选择要编辑的电源方案'),
                    'showClose': true,
                    'duration': 1500
                })
                return
              }
              if(type == 'add') {
                var formData = { Name: '', WallID: '', Hours: 9, Min: 0, Week: [1,2],  Mode: 0 , Enable: 0, Action: 0}
                var title = this.$t("新建")
              } else {
                var data = this.getCurrentPowerPlan()
                var formData = {
                  ID: data.ID,
                  Name: data.Name,
                  WallID: data.WallID,
                  Hours: this.formatGetTime(data.Time)[0],
                  Min: this.formatGetTime(data.Time)[1],
                  Week: data.Week,
                  Mode: data.Mode,
                  Enable: data.Enable,
                  Action: data.Action
                }
                var title = this.$t("编辑")
              }
              this.$refs['powerplan_form']._setmodal(true)
              this.$refs['powerplan_form'].setFormData(formData, title, type)
            },

            formsubmit: function(type, data) {
                if(type == 'add') {
                    var url = '/api.v2.do.pwplan.add'
                    var params = {
                        userid: this.$auth.getuid(),
                        body: {
                            WallID: data.WallID,
                            Name: data.Name,
                            Time: this.formatFormTime(data.Hours, data.Min),
                            Week: data.Week,
                            Mode: parseInt(data.Mode),
                            Enable: parseInt(data.Enable),
                            Action: parseInt(data.Action)
                        }
                    }
                } else {
                    var url = '/api.v2.do.pwplan.edit'
                    var params = {
                        userid: this.$auth.getuid(),
                        body: {
                            ID: data.ID,
                            WallID: data.WallID,
                            Name: data.Name,
                            Time: this.formatFormTime(data.Hours, data.Min),
                            Week: data.Week,
                            Mode: parseInt(data.Mode),
                            Enable: parseInt(data.Enable),
                            Action: parseInt(data.Action)
                        }
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
                    this.$message({
                        'type': 'success',
                        'message': this.$t('操作成功'),
                        'showClose': true,
                        'duration': 1500
                    })
                    this.refresh()
                    this.$refs['powerplan_form']._setmodal(false)
                }).catch((err) => {
                    this.$message({
                        'type': 'error',
                        'message': this.$t('操作异常'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                })
            },
         
            formatFormTime(h, m){
              if(h < 10 ) h = '0' + h
              if(m < 10 ) m = '0' + m
              return h + ':' + m
            },
            formatGetTime(time) {
               time = time.split(":")
               if(time[0].substr(0, 1) == '0') {
                 time[0] = parseInt(time[0].substr(1, 1), 10)
               }
               if(time[1].substr(0, 1) == '0') {
                 time[1] = parseInt(time[1].substr(1, 1), 10)
               }
               return time
            },
            handleDel: function () {
                var vm = this
                //此处处理删除操作
                if(!this.curId) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('请先选择需要删除的电源方案'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.$confirm(this.$t('此操作将永久删除该电源方案, 是否继续?'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    var id = vm.curId
                    var url = '/api.v2.do.pwplan.del'
                    var params = {
                      "userid": vm.$auth.getuid(), 
                      "body": {
                        "ID": id 
                      } 
                    } 
                    this.$http(url, params).then((res) => {
                        if(res.data.status != 0 ){
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
                            'message': this.$t('删除成功'),
                            'showClose': true,
                            'duration': 1500
                        });
                        this.refresh()
                    }).catch((err) => {
                        this.$message({
                            'type': 'warning',
                            'message': this.$t('删除失败'),
                            'showClose': true,
                            'duration': 1500
                        });
                    })
                }).catch(() => { });
            },

            // 获取当前电源方案的数据
            getCurrentPowerPlan: function() {
              var vm = this
              var data = this.powerplandata.filter(function(value) {
                return value.ID == vm.curId
              })[0]
              return JSON.parse(JSON.stringify(data))
            }
        },
    }
</script>
<style type="text/css">
	.signaltreetools>.table-btn:nth-child(1){
	background-color: #18bc9c;
				color:#fff;
				margin-left: 13px;
}
.signaltreetools>.table-btn:nth-child(2){
	background-color: #18bc9c;
				color:#fff;
}
.signaltreetools>.table-btn:nth-child(3){
	background-color: #e74c3c;
				color:#fff;
}
.signaltreetools>.table-btn:nth-child(4){
	background-color: #e74c3c;
				color:#fff;
}
.signaltreetools>.table-btn1{
	background-color: #2c3e50;
				color:#fff;
}
.screentools>.table-btn:nth-child(1){
	background-color: #2c3e50;
				color:#fff;
				margin-left: 13px;
}
.screentools>.table-btn:nth-child(2){
	background-color: #18bc9c;
				color:#fff;
}
.screentools>.table-btn:nth-child(3){
	background-color: #18bc9c;
				color:#fff;
}
.screentools>.table-btn:nth-child(4){
	background-color: #e74c3c;
				color:#fff;
}
</style>