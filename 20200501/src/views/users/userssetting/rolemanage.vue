<style lang="less" src='./styles/rolemanage.less'></style>
<template>
    <div class="rolemanage">
        <el-row >
            <el-col :span="24">
            <div class="tabletools">
                <el-button class="table-btn" @click="refresh"><i class="fa fa-refresh mar-rig"></i>{{$t('刷新')}}</el-button>
                <el-button class="table-btn" @click="openRoleForm($event, 'add')"><i class="el-icon-plus mar-rig"></i>{{$t('新建')}}</el-button>
                <el-button class="table-btn" @click="openRoleForm($event, 'edit')"><i class="el-icon-edit mar-rig"></i>{{$t('编辑')}}</el-button>
                <el-button class="table-btn" @click="handleDel"><i class="el-icon-delete mar-rig"></i>{{$t('删除')}}</el-button>
            </div>
            </el-col>
        </el-row>
        <el-row style="height: calc(100% - 50px)">
            <el-col :span="24">
            <div class="tableshow">
                <el-table highlight-current-row :data="data" @current-change="curChange">
                    <el-table-column property="Name" :label="$t('角色名')" align="center"></el-table-column>
                </el-table>
            </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
            <div class="footpages">
                <el-pagination :total="total" :current="current" :page-size="pagesize" show-elevator show-total
                      @on-change="onPageChange"></el-pagination>
            </div>
            </el-col>
        </el-row>
        <RoleForm ref="role_form" @formsubmit="handleForm" />
    </div>
</template>
<script>
    import RoleForm from '../roleform.vue';
    export default {
        name:'rolemanage',
        components : {
            RoleForm
        },
        data () {
            return {
                delTitle: this.$t('删除'),
                data: [],
                total: 0,
                current: 1,
                pagesize: 10,
                curId: null
            }
        },
        computed: {
            screen: function() {
                return this.$store.state.role.screen
            },
            signal: function() {
                return this.$store.state.role.signal
            }
        },
        created() {
            this.list(0, this.pagesize)
            this.getScreenList()
            this.getSource()
        },
        methods: {
            /**
             * 获取角色列表
             */
            list: function (start, limit) {
                var url = '/api.v2.do.role.get',
                params = {
                    "userid": this.$auth.getuid(),
                    "page": {"start": start, "limit": limit}
                }

                this.$http(url, params).then((res) => {
                    if (res.data.status !== 0) {
                        this.$message({
                            showClose: true,
                            duration: 1500,
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status])
                        })
                        return
                    }
                    if (!res.data.msg) {
                        this.total = 0
                        this.data = []
                        return
                    }
                    this.total = res.data.msg.count
                    this.data = res.data.msg.body 
                }).catch((err) => { console.log(err) })

            },

            /**
             * 获取屏组列表数据
             */
            getScreenList: function () {
                var vm = this
                var url = '/api.v2.do.screen.get'
                var params = {
                    "userid": this.$auth.getuid(),
                    "page": {
                        "start": 0,
                        "limit": 0
                    }
                }
                this.$http(url, params).then((res) => {
                    if (res.data.status != 0) {
                        this.$message({
                            showClose: true,
                            duration: 1500,
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status])
                        })
                        return
                    }
                    if (!res.data.msg)
                        var screen = []
                    else
                        var screen = res.data.msg.body
                    this.$store.commit('role/setScreen', screen)
                }).catch((err) => {})
            },

            /**
             * 获取信源分组信息
             */
            getSource: function() {
                var vm = this
                var url = '/api.v2.do.source.get'
                var params = {
                    "userid": this.$auth.getuid(),
                    "page": {
                        "start": 0,
                        "limit": 0
                    }
                }
                this.$http(url, params).then((res) => {
                    if (res.data.status !== 0) {
                        this.$message({
                            showClose: true,
                            duration: 1500,
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status])
                        })
                        
                        return    
                    }
                    if(!res.data.msg) 
                        var signal = []
                    else 
                        var signal = res.data.msg.body
                    this.$store.commit('role/setSignal', signal)
                }).catch((err) => { console.log(err) }) 
            },

           /**
             * 切换页面查看数据
             */
            onPageChange: function (index) {
                this.current = index
                this.refresh()
            },

            /**
             * 当前行发生变化时触发
             */
            curChange: function (newVal, oldVal) {               
                if (null != newVal) {
                    this.curId = newVal.ID
                }
            },
              
            /**
             * 刷新页面
             */
            refresh: function() {
                var start = (this.current -1 ) * this.pagesize ,
                    limit = this.pagesize
                this.curId = null
                this.list(start, limit )
            },

            /**
             * 打开新建(编辑)角色的窗口
             */
            openRoleForm: function(e, type) {
                if (type == 'edit' && this.curId == null) {
                    this.$message({
                       showClose: true,
                       duration: 1500,
                       type: 'warning',
                       message: this.$t('请先选择要编辑的角色')
                    })
                    return
                }
                if (type == 'add') {
                    var formData = { ID: '', Name: '', ScreenStatus_1: 0, ScreenID_1: [], ScreenStatus_2: 0, ScreenID_2: [], signalStatus: 1, SourceID: []}

                    var title = '新建'
                } else {                  
                    var formData = this.getCurrentSelectRole()
                    var ScreenID_1 = [], ScreenID_2 = []
                    formData.Screen.forEach((val)=>{
                        val.Attr === 0 ? ScreenID_1.push(val.ID) : ScreenID_2.push(val.ID)
                    })

                    formData.ScreenStatus_1 = (ScreenID_1.length == this.screen.length) ? 1 : 0
                    formData.ScreenID_1 = formData.ScreenStatus_1 ? [] : ScreenID_1
                    formData.ScreenStatus_2 = (ScreenID_2.length == this.screen.length) ? 1 : 0
                    formData.ScreenID_2 = formData.ScreenStatus_2 ? [] : ScreenID_2

                    formData.signalStatus = (formData.SourceID.length == this.signal.length) ? 1 : 0
                    var title = '编辑'
                }               
                this.$refs['role_form']._setmodal(true)
                this.$refs['role_form'].setFormData(formData, title, type)
            },

            /**
             * 新建或者编辑处理
             */
            handleForm(type, data) {
                var screen = null 
                if(data.ScreenStatus_1) {
                    screen = this.filterScreenDataFromAllByAtrr(this.screen, 0)
                } else if(data.ScreenStatus_2) {
                    screen = this.filterScreenDataFromAllByAtrr(this.screen, 1)
                } else {
                    let arr1 = this.filterScreenDataByAtrr(data.ScreenID_1, 0)
                    let arr2 = this.filterScreenDataByAtrr(data.ScreenID_2, 1)
                    screen = [...arr1, ...arr2]
                }
                if (type == 'add') {
                    var url = '/api.v2.do.role.add'
                    var params = {
                        userid: this.$auth.getuid(),
                        body: {
                            Name: data.Name,
                            ScreenAttr: data.ScreenAttr,
                            Screen: screen,
                            SourceID: data.signalStatus ?  this.$lodash.map(this.signal, 'ID') : data.SourceID,
                        }
                    }
                } else {
                    var url = '/api.v2.do.role.edit'
                    var params = {
                        userid: this.$auth.getuid(),
                        body: {
                            ID: data.ID,
                            Name: data.Name,
                            ScreenAttr: data.ScreenAttr,
                            Screen: screen,
                            SourceID: data.signalStatus ?  this.$lodash.map(this.signal, 'ID') : data.SourceID,
                        }
                    }
                }
                this.$http(url, params).then((res) => {
                    if(0 !== res.data.status) {
                        this.$message({
                            showClose: true,
                            duration: 1500,
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status])
                        })
                        return
                    }
                    this.$message({
                        showClose: true,
                        duration: 1500,
                        'type': 'success',
                        'message': this.$t('操作成功')
                    })
                    this.refresh()
                    this.$refs['role_form']._setmodal(false)
                }).catch((err) => {
                    this.$message({
                        showClose: true,
                        duration: 1500,
                        'type': 'error',
                        'message': this.$t('操作失败')
                    })
                    return
                })
            },

            /**
             * 删除角色
             */
            handleDel: function () {
                //此处处理删除操作
                if(!this.curId) {
                    this.$message({
                        showClose: true,
                        duration: 1500,
                        'type': 'error',
                        'message': this.$t('请先选择需要删除的角色')
                    })
                    return
                }
                this.$confirm(this.$t('此操作将永久删除该角色, 是否继续?'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    var id = this.curId,
                        url = '/api.v2.do.role.del',
                        params = {
                            "userid": this.$auth.getuid(), 
                            "body":{"ID": id } 
                        }
                    this.$http(url, params).then((res) => {
                        if(res.data.status != 0) {
                            this.$message({
                                showClose: true,
                                duration: 1500,
                                'type': 'warning',
                                'message': this.$t(this.$msg[res.data.status])
                            })
                            return
                        }

                        this.$message({
                            showClose: true,
                            duration: 1500,
                            type: 'success',
                            message: this.$t('删除成功')
                        });
                        this.refresh()
                    }).catch((err) => {
                        this.$message({
                            showClose: true,
                            duration: 1500,
                            type: 'warning',
                            message: this.$t('删除失败')
                        });
                    })    
                }).catch(() => {
                    
                });
            },

            filterScreenDataFromAllByAtrr: function(screenList, attr) {
                var items = []
                screenList.map((value, index) => {
                    var item = {}
                    item.ID = value.ID
                    item.Attr = attr
                    items.push(item)
                })
                return items
            },

            filterScreenDataByAtrr: function(screenIDList, attr) {
                var items = []
                screenIDList.map((value, index) => {
                    var item = {}
                    item.ID = value
                    item.Attr = attr
                    items.push(item)
                })
                return items
            },

            getCurrentSelectRole: function() {
                var vm = this
                var data = this.data.filter(function(value){
                    return value.ID == vm.curId
                })
                return JSON.parse(JSON.stringify(data[0]))
            }
        },

    }      
    
</script>
