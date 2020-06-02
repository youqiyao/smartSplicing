<template>
    <div class="passWordReset" >
        <el-button class="info-btn" @click="modal = true"><i class="fa fa-unlock-alt"></i></el-button>
        <el-dialog
            :title="$t('重置密码')"
            :visible.sync="modal"
            :close-on-click-modal="false"
            >
            <el-form ref="resetpwd_form" :model="formCustom" :rules="ruleCustom" label-width="111px" label-position="left">
                <el-form-item :label="$t('旧密码')" prop="oldPasswd">
                    <el-input type="password" v-model="formCustom.oldPasswd"></el-input>
                </el-form-item>
                <el-form-item :label="$t('新密码')" prop="newPasswd">
                    <el-input type="password" v-model="formCustom.newPasswd"></el-input>
                </el-form-item>
                <el-form-item :label="$t('确认密码')" prop="passwdCheck">
                    <el-input type="password" v-model="formCustom.passwdCheck"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handle('resetpwd_form')">{{$t('取消')}}</el-button>
                    <el-button type="primary" @click="handleSubmit('resetpwd_form')">{{$t('保存')}}</el-button>
                </el-form-item>
            </el-form>
         
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            // 旧密码验证
            var checkOldpwd = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(this.$t('请输入你现在使用的密码')))
                }
                callback()
            }
            // 新密码验证
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('请输入新密码')))
                } else {
                    if(value.length < 6) {
                       callback(new Error(this.$t('新密码长度不能小于6位')))
                    } else {
                         if (this.formCustom.passwdCheck !== '') {
                             this.$refs.resetpwd_form.validateField('passwdCheck')
                         }
                         callback()
                    }
                }
            }
            // 新密码再次输入验证
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('请再次输入密码')))
                } else if (value !== this.formCustom.newPasswd) {
                    callback(new Error(this.$t('两次输入密码不一致!')))
                } else {
                    callback()
                }
            }
            return {
                modal: false,
                formCustom: {
                    oldPasswd: '',
                    newPasswd: '',
                    passwdCheck: ''
                },
                ruleCustom: {
                    oldPasswd: [
                        { validator: checkOldpwd, trigger: 'blur' }
                    ],
                    newPasswd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
          /* 
           * 取消按钮事件处理
           */
           handle(name) {
            this.modal = false
            this.$refs[name].resetFields()
           },
           /* 
            * 保存提交
            */
           handleSubmit(name) {
                var vm = this
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$message({
                            'type': 'error',
                            'message': this.$t('操作失败！'),
                            'showClose': true,
                            'duration': 1500
                        }); 
                        return false
                    }
                    var params = {
                        "userid": this.$auth.getuid(),
                        "body": {
                            "ID":this.$auth.getuid(),
                            "Password":this.formCustom.oldPasswd,
                            "NewPassword":this.formCustom.newPasswd
                        }
                    }
                    this.ipost('/api.v2.do.user.resetpwd', params,
                        (res ) => {
                            if(res.data.status !== 0 ){
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
                                'message': this.$t('修改成功'),
                                'showClose': true,
                                'duration': 1500
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
