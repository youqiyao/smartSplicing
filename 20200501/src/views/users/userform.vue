<template>
    <div class="userform">
        <el-dialog
            :title="$t(title)"
            :visible.sync="modal"
            :close-on-click-modal="false"
            >
            <el-form ref="user_form" :model="formItem" :rules="formRules" label-width="80px" label-position="left">
                <el-form-item :label="$t('用户')" prop="Name">
                    <el-input v-model="formItem.Name"  :readonly="op == 'edit'"></el-input>
                </el-form-item>
                <el-form-item  :label="$t('密码')" prop="Password" v-if="op != 'edit'">
                    <el-input type="password" v-model="formItem.Password"></el-input>
                </el-form-item>
                <el-form-item  :label="$t('确认密码')" prop="CheckPwd" v-if="op != 'edit'">
                    <el-input type="password" v-model="formItem.CheckPwd"></el-input>
                </el-form-item>
                <el-form-item :label="$t('角色')" prop="RoleID">
                    <el-select v-model="formItem.RoleID" :placeholder="$t('请选择')">
                        <el-option
                          v-for="(item, $index) in roleList"
                          :value="item.ID"
                          :label="item.Name"
                          >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('邮箱')" prop="Email">
                    <el-input type="text" v-model="formItem.Email" number></el-input>
                </el-form-item>
                <el-form-item :label="$t('电话')" prop="Phone">
                    <el-input type="text" v-model="formItem.Phone" number></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="modal = false">{{$t('取消')}}</el-button>
                    <el-button type="primary" @click="handleSubmit('user_form')">{{$t('保存')}}</el-button>
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
                    callback(new Error(this.$t('请输入密码')))
                } else {
                    if(value.length < 6 ) {
                       callback(new Error(this.$t('密码长度不能小于6位')))
                    } else {
                         if (this.formItem.CheckPwd !== '') {
                             this.$refs.user_form.validateField('CheckPwd')
                         }
                         callback()
                    }
                }
            }
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('请再次输入密码')))
                } else if (value !== this.formItem.Password) {
                    callback(new Error(this.$t('两次输入密码不一致')))
                } else {
                    callback()
                }
            }
            var checkMail = (rule, value, callback) => { 
                if(value === '') {
                   callback()
                } else {
                    var mailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
                    if(mailReg.test(value)) {
                        callback()
                    } else {
                        callback(new Error(this.$t('请填写正确的邮箱')))
                    }
                }
            }
            var checkTel = (rule, value, callback) => { 
                if(value === '') {
                    callback()
                } else {
                    var telReg = /^1(3|4|5|7|8)\d{9}$/
                    if(telReg.test(value)) {
                        callback()
                    } else {
                        callback(new Error(this.$t('请输入正确的号码')))
                    }
                }
            }        
            var checkRoleID = (rule, value, callback) => {
                if(value === '') {
                    callback(new Error(this.$t('请选择角色')))
                } else {
                    callback()
                }
            }
            return {
                modal: false,
                formItem: { ID: '', Name: '', Password: '',CheckPwd: '',Email: '',Phone: '',RoleID: ''},
                formRules: {
                    Name: [
                        {required: true, message: this.$t('请填写名称'), trigger: 'blur'},
                        { type: 'string',  max: 12, message: this.$t('名称长度不能超过12位'), trigger: 'blur' }
                    ],
                    Password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    CheckPwd: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    Email: [
                        { validator: checkMail, trigger: 'blur' }
                    ],
                    Phone: [
                        { validator: checkTel, trigger: 'blur' }
                    ],
                    RoleID: [
                        { validator: checkRoleID, trigger: 'change'}
                    ],
                },
                roleList: [],
                op: 'add',
                title: '',
            }
        },
        created() {
            
        },
        methods: {
            _setmodal: function(status) {
                this.modal = status
            },

            setFormData: function (data, title, op) {
                this.op = op
                this.title = title
                this.formItem = data
                this.getRoleList()
            },

            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$emit('formsubmit', this.op, this.formItem)
                    }
                })
            },

            getRoleList() {
                var url = '/api.v2.do.role.get',
                params = {
                    "userid": this.$auth.getuid(),
                    "page": {"start": 0, "limit": 0}
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
                        this.roleList = []
                        return
                    }
                    if (!res.data.msg) {
                        this.roleList = []
                        return
                    }   
                    this.roleList = res.data.msg.body 
                }).catch((err) => { console.log(err) })
            }
        }    
    }
</script>