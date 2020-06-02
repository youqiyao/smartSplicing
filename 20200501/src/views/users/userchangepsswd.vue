<template>
    <div class="passWordReset" >
        <el-dialog
            :title="$t('修改密码')"
            :visible.sync="modal"
            :close-on-click-modal="false"
            >
            <el-form ref="setpwd" :model="formItem" :rules="ruleItem" label-width="100px" label-position="left">
                <el-form-item :label="$t('新密码')" prop="Password">
                    <el-input type="password" v-model="formItem.Password"></el-input>
                </el-form-item>
                <el-form-item :label="$t('管理员密码')" prop="AdminPassword">
                    <el-input type="password" v-model="formItem.AdminPassword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handle('setpwd')">{{$t('取消')}}</el-button>
                    <el-button type="primary" @click="handleSubmit('setpwd')">{{$t('保存')}}</el-button>
                </el-form-item>
            </el-form>
         
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('请输入新密码')))
                } else {
                    if(value.length < 6) {
                        callback(new Error(this.$t('新密码长度不能小于6位')))
                    } else {
                        callback()
                    }
                }
            };
            var validateAdminPass = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(this.$t('请输入你现在使用的密码')))
                }
                callback()
            };
            return {
                modal: false,
                formItem: {
                    Password: '',
                    AdminPassword: '',
                    ID: ''
                },
                ruleItem: {
                    Password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    AdminPassword: [
                        { validator: validateAdminPass, trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            handle(name) {
                this.modal = false
                this.$refs[name].resetFields()
            },
            _setmodal: function(status) {
                this.modal = status
            },

            setFormData: function (data) {
                this.formItem = data
            },

           handleSubmit(name) {
                var vm = this
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$message({
                          type: 'error',
                          message:this.$t('操作失败'),
                          showClose: true,
                          duration: 1500
                        })
                         return false
                    }
                    var params = {
                        "userid": this.$auth.getuid(),
                        "body": [{
                            "ID":this.$auth.getuid(),
                            "Password":this.formItem.AdminPassword
                        },{
                            "ID": this.formItem.ID,
                            "Password":this.formItem.Password
                        }]
                    }
                    this.ipost('/api.v2.do.user.setpwd', params,
                        (res ) => {
                            if(res.data.status !== 0 ){
                                this.$message({
                                    'type': 'warning',
                                    'message': this.$msg[res.data.status],
                                     showClose: true,
                                     duration: 1500
                                })
                                return    
                            }
                            this.$message({
                              type: 'success',
                              message:this.$t('操作成功'),
                              showClose: true,
                              duration: 1500
                            })
                            this.handle()
                        },
                        (err ) => {}
                    )
                })
            },
        }
  }
</script>
