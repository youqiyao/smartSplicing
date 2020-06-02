<template>
    <div class="planform">
        <el-dialog
            :title="title"
            :visible.sync="modal"
            customClass="plan_modal"
            :close-on-click-modal="false"
        >
            <el-row>
                <el-col :span="8">
                    <el-form ref="plan_form" :model="formItem" :rules="formRules" label-width="100px" label-position="left">
                        <el-form-item :label="$t('预案名称')" prop='Name'>
                            <el-input v-model="formItem.Name" :placeholder="$t('请输入')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('使用屏组')" prop='WallID' >
                            <el-select v-model="formItem.WallID" :placeholder="$t('请选择')" :disabled="this.op == 'edit'" @change="screenChange">
                                <el-option v-for="(item, index) in screenList"  :label="item.Name" :value="item.ID" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('场景时长')" prop='DefaultTime' >
                            <el-input-number v-model="formItem.DefaultTime" :min="0" :step="10"></el-input-number>
                        </el-form-item>
                        <el-form-item :label="$t('定时启动')" props='StartOnTime'>
                            <el-switch
                                v-model="formItem.StartOnTime"
                                active-color="#20a0ff"
                                inactive-color="#ff4949"
                                :active-text="$t('ON')"
                                :inactive-text="$t('OFF')"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item :label="$t('开始时间')" prop='StartTime'>
                            <el-time-select
                              :disabled="formItem.StartOnTime == 0"
                              v-model="formItem.StartTime"
                              :picker-options="{
                                start: '00:00',
                                step: '00:15',
                                end: '23:45',
                                maxTime: formItem.EndTime
                              }">
                            </el-time-select>
                        </el-form-item>
                        <div class="endtime">
                            <el-form-item :label="$t('结束时间')" prop='EndTime'>
                                 <el-time-select
                                 :disabled="formItem.StartOnTime == 0"
                                 v-model="formItem.EndTime"
                                 :picker-options="{
                                    start: '00:00',
                                    step: '00:15',
                                    end: '23:45',
                                    minTime: formItem.StartTime
                                  }">
                                </el-time-select>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-col>
                <el-col :span="8">
                    <div class="planformtable">
                        <div class="scenelist-header">
                            <div class="item">{{$t('场景名称')}}</div>
                            <div class="item">{{$t('间隔/秒')}}</div>
                            <div class="item">{{$t('操作')}}</div>
                        </div>
                        <div class="scenelist-body" ref='scenelistBody'>
                            <div class="scenelist-tr" v-for="(item,index) in formItem.SceneList">
                                <div class="item">
                                <div class="item-name" :title="item.Name">{{item.Name}}</div>
                                </div>
                                <div class="item">
                                    <span :class="{'hidden': !(!item.hidden)}" @dblclick="handleTimeDblclick(item,index)">{{item.Time}}</span>
                                    <el-input :ref="'time_input_' + index" :class="{'hidden': !item.hidden}" @blur="handleTimeBlur(item,index)" v-model="item.Time"></el-input>
                                </div>
                                <div class="item">
                                    <el-button type="text" size="small" @click.native.prevent="removeFromPlanSceneList(index)">{{$t('删除')}}</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="planformtable">
                        <el-table  :data="sceneList" height='316' width="300">
                            <el-table-column align="center" :label="$t('场景列表')">
                                <template scope="scope">
                                    <div class="item-name" :title="scope.row.Name">{{scope.row.Name}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" :label="$t('操作')">
                                <template scope="scope">
                                    <el-button type="text" size="small" @click.native.prevent="addToPlanSceneLst(scope.$index, scope.row)">{{$t('添加')}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modal = false">{{$t('取消')}}</el-button>
                <el-button type="primary" @click="handleSubmit('plan_form')">{{$t('保存')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'planform',
        data () {
            return {
                modal: false,
                formItem: { ID: '',Name: '', WallID: '', DefaultTime: 10,  StartOnTime: 0, StartTime: '',  EndTime: '' , SceneList: []},
                formRules: {
                    Name: [
                        {required: true, message: this.$t('请填写名称'), trigger: 'blur'},
                        { type: 'string',  max: 12, message: this.$t('名称长度不能超过12位'), trigger: 'blur' }
                    ], 
                },
                screenList: [],
                sceneList: [],               //右侧待选择的场景列表
                op: 'add',                  //当前页面的操作类型  添加/编辑
                title: '',
            }
        },
        filter: {
       
        },
        watch: {
            
        },
        created(){
            this.getScreenList()
        },
        methods: {
          /* 
           * 双击时间间隔列表可编辑事件
           */
            handleTimeDblclick(item,index) {
                this.$set(this.formItem.SceneList[index], 'hidden', true)
                this.$nextTick(function(){
                    var inputElement = this.$refs['time_input_' + index][0].$el.getElementsByTagName('input')[0]
                    inputElement.focus()
                })  
            },

            handleTimeBlur(item,index) {
                this.$set(this.formItem.SceneList[index], 'hidden', false)
            },

            _setmodal: function (status) {
                this.modal = status
            },

            setFormData: function (data, title, op) {
                this.formItem = data 
                this.title = title           
                this.op = op

                if(this.op == 'edit' && data.WallID) {
                    var wallID = data.WallID
                    this.getSceneList(wallID)
                }
                            
            },

            resetSceneList: function () {
                this.sceneList = []
            },

            /**
             * 取分页列表数据
             * @param start
             * @param limit
             * @param cbOk 成功回调函数
             * @param cbErr 失败处理函数
             */
            getScreenList: function (start, limit) {
                var url = '/api.v2.do.screen.get',
                    params = {
                        "userid": this.$auth.getuid(),
                        "page": { 
                            "start": 0, 
                            "limit": 0 
                        }
                    }
                this.$http(url, params)
                .then((res) => {
                    if(0 !== res.data.status) {
                        this.$message({
                            'type': 'warning',
                            'message':this.$t(this.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        })
                        return
                    }
                    if(res.data.msg && res.data.msg.body) {
                        this.screenList = res.data.msg.body
                        
                    }  else {
                        this.screenList = []
                    }
                }).catch((err) => {
                    this.$message({
                        'type': 'error',
                        'message': '获取屏组列表错误',
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                })
            },

            /**
             * 取场景列表
             */
            getSceneList: function (WallID) {
                var url = '/api.v2.do.scene.get',
                    params = {
                        "userid": this.$auth.getuid(),
                        "page": {"start":0, "limit": 0},
                        "body": {"ID":0, "WallID": WallID}
                    }  
                this.$http(url, params).then((res) => {
                    if(0 !== res.data.status) {
                        this.$message({
                            'type': 'warning',
                            'message':this.$t(this.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        })
                        return
                    }
                    if(res.data.msg && res.data.msg.body) {
                        this.sceneList = res.data.msg.body
                    }  else {
                        this.sceneList = []
                    }
                }).catch((err) => {
                    this.$message({
                        'type': 'error',
                        'message': this.$t('获取场景列表错误'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                })    
            },

            /**
             * 切换屏组
             */
            screenChange: function(value) {
                var wallID = this.formItem.WallID
                wallID && this.getSceneList(wallID)
            },

            /**
             * 删除列表中的一行
             */
            removeFromPlanSceneList (index) {
                this.formItem.SceneList.splice(index, 1);
            },

            /**
             * 向预案列表中添加一个场景
             */
            addToPlanSceneLst (index, row ) {
                var senceId = row.ID, senceName = row.Name, time = this.formItem.DefaultTime
                this.formItem.SceneList.push({ID: senceId, Name: senceName, Time: time }) 
            },

            /**
             * 提交表单操作
             */
            handleSubmit (name) {           
                if(this.formItem.SceneList.constructor == Array && this.formItem.SceneList.length < 2) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('请从右侧列表中选择至少两个场景！'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$emit('formsubmit', this.op, this.formItem)
                    }
                })
            },
        }
    }
</script>

