<style lang="less" src='./styles/usersmanage.less'></style>
<template>
    <div class="usersmanage">
        <el-row>
            <el-col :span="24">
            <div class="tabletools">
                <el-button class="table-btn" @click="refresh"><i class="fa fa-refresh mar-rig"></i>{{$t('刷新')}}</el-button>
                <el-button class="table-btn" @click="openUserForm('add')"><i class="el-icon-plus mar-rig"></i>{{$t('新建')}}</el-button>
                <el-button class="table-btn" @click="openUserForm('edit')"><i class="el-icon-edit mar-rig"></i>{{$t('编辑')}}</el-button>
                <el-button class="table-btn" @click="handleDel"><i class="el-icon-delete mar-rig"></i>{{$t('删除')}}</el-button>
            </div>
            </el-col>
        </el-row>
        <el-row style="height: calc(100% - 50px)">
            <el-col :span="24">
            <div class="tableshow">
                <el-table highlight-current-row :data="data" @current-change="curChange">
                    <el-table-column property="Name" :label="$t('用户名')" align="center"></el-table-column>
                    <el-table-column property="RoleName" :label="$t('角色')" align="center"></el-table-column>
                    <el-table-column property="Email" :label="$t('邮箱')" align="center"></el-table-column>
                    <el-table-column property="Phone" :label="$t('电话')" align="center"></el-table-column>
                    <el-table-column property="Token" :label="$t('用户令牌')" align="center"></el-table-column>
                    <el-table-column :label="$t('登录状态')" align="center" :formatter="formatterState"></el-table-column>
                    <el-table-column :label="$t('操作')" align="center">
                    <template scope="scope">
                        <el-button
                            :disabled="scope.row.ID == 1"
                            size="small"
                            @click="changePasswd(scope.$index, scope.row)">{{$t('修改密码')}}</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
            <div class="footpages">
                <el-pagination :total="total" :current-page.sync="current" :page-size="pagesize" @current-change="onPageChange"></el-pagination>
            </div>
            </el-col>
        </el-row>
        <UserForm ref="user_form" @formsubmit="handleForm"/>
        <PasswdChange ref="passwd_form"/>
    </div>
</template>
<script>
    import UserForm from '../userform.vue';
    import PasswdChange from '../userchangepsswd.vue';

    export default {
        name: 'usersmanage',
        components: { UserForm, PasswdChange},
        data() {
            return {
                data: [],
                total: 0,
                current: 1,
                pagesize: 10,
                curId: null,
            }
        },    
        created() {
            this.list(0, this.pagesize)
        },
        methods: {
            list: function (start, limit) {
                var url = '/api.v2.do.user.get',
                params = {
                    "userid": this.$auth.getuid(),
                    "page": {"start": start, "limit": limit}
                }

                this.$http(url, JSON.stringify(params))
                .then((res) => {
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
                }).catch((err) => { 
                    console.log(err)
                })

            },

            /**
             * [formatterState description]
             * @param  {[type]} row    [description]
             * @param  {[type]} column [description]
             * @return {[String]}        ['是|否']
             */
            formatterState(row, column) {
                return row.State ? this.$t('已登录') : this.$t('未登录')
            },

            /**
             * [onPageChange 切换页面查看数据]
             * @param  {[type]} index [description]
             * @return {[type]}       [description]
             */
            onPageChange: function (index) {
                this.current = index
                this.refresh()
            },

            /**
             * [curChange 用户选中事件]
             * @param  {[type]} newVal [description]
             * @param  {[type]} oldVal [description]
             * @return {[type]}        [description]
             */
            curChange: function (newVal, oldVal) {
                if (null != newVal) {
                    this.curId = newVal.ID
                }
            },

            /**
             * [refresh 刷新列表数据]
             * @return {[type]} [description]
             */
            refresh: function () {
                var start = (this.current - 1 ) * this.pagesize,
                    limit = this.pagesize
                this.curId = null
                this.list(start, limit)
            },

            /**
             * 新建、编辑
             * @param  {[type]} type [description]
             * @return {[type]}      [description]
             */
            openUserForm: function (type) {
                if (type == 'edit' && this.curId == null) {
                    this.$message({
                            showClose: true,
                            duration: 1500,
                            'type': 'warning',
                            'message': this.$t('请先选择要编辑的用户')
                        })
                    return
                }
                if (type == 'add') {
                    var formData = { Name: '',Password: '',CheckPwd: '',Email: '',Phone: '',RoleID: ''}

                    var title = '新建'
                } else {
                    var formData = this.getCurrentSelectUser()
                    var title = '编辑'
                }
                this.$refs['user_form']._setmodal(true)
                this.$refs['user_form'].setFormData(formData, title, type)
            },

            handleForm: function(type, data) {
                if (type == 'add') {
                    var url = '/api.v2.do.user.add'
                    var params = {
                    userid: this.$auth.getuid(),
                    body: {
                        Name: data.Name,
                        Password: data.Password,
                        Email: data.Email,
                        Phone: data.Phone,
                        RoleID: data.RoleID
                    }
                  }
                } else {
                    var url = '/api.v2.do.user.edit'
                    var params = {
                    userid: this.$auth.getuid(),
                    body: {
                        ID: data.ID,
                        Email: data.Email,
                        Phone: data.Phone,
                        RoleID: data.RoleID
                    }
                  }
                }
                this.$http(url, params)
                .then((res) => {
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
                        type: 'success',
                        message: this.$t('操作成功')
                    })
                    this.refresh()
                    this.$refs['user_form']._setmodal(false)
                }).catch((err) => {
                    this.$message({
                        showClose: true,
                        duration: 1500,
                        type: 'error',
                        message: this.$t('操作异常')
                    })
                    return
                })    
            },

            /**
             * 删除用户
             * @return {[type]} [description]
             */
            handleDel: function () {
                var vm = this
                //此处处理删除操作
                if(!this.curId) {
                     this.$message({
                        showClose: true,
                        duration: 1500,
                        type: 'error',
                        message: this.$t('请先选择要删除的用户')
                    })
                    return
                }
                this.$confirm(this.$t('此操作将永久删除该用户, 是否继续?'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    var id = this.curId,
                        url = '/api.v2.do.user.del',
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
                            type: 'success',
                            message: this.$t('删除成功'),
                            showClose: true,
                            duration: 1500
                        });
                        vm.refresh()
                    }).catch((err) => {
                        vm.$message({
                            type: 'warning',
                            message: this.$t('删除失败'),
                            showClose: true,
                            duration: 1500
                        });
                    })    
                }).catch(() => {
                    
                });
            },

            changePasswd(index, row) {
                var uid = this.$auth.getuid()
                if(uid != 1) {
                    this.$message({
                        type: 'warning',
                        message: this.$t('该用户不是管理员,不能修改用户密码'),
                        duration: 1000,
                        showclose: true
                    });
                    return
                }
                var data = {
                    Password: '',
                    AdminPassword: '',
                    ID: row.ID
                }
                this.$refs['passwd_form']._setmodal(true)
                this.$refs['passwd_form'].setFormData(data)
            },
            /**
             * [getCurrentSelectUser 获取当前选中的用户信息]
             * @return {[type]} [description]
             */
            getCurrentSelectUser() {
                var vm = this
                var data = this.data.filter(function(value){
                    return value.ID == vm.curId
                })
                return JSON.parse(JSON.stringify(data[0]))
            }

        },
    }
</script>
