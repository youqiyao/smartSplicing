<style lang="less" src="./styles/login.less"></style>
<template>
    <div class="login">
        <div class="login-panel">
          
          <div class="login-form">
              <div class='language'>
                    <el-dropdown trigger="click" @command="languageChange" menu-align='start'>
                      <div class="language-inner">
                        <span ref="language">{{lang}}</span>
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                      </div>
                      <el-dropdown-menu slot="dropdown" class="language-dropdown">
                        <el-dropdown-item command="简体中文">简体中文</el-dropdown-item>
                        <el-dropdown-item command="English">English</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
              </div>
              <el-form ref="formInline" :model="formInline" :rules="ruleInline" label-width="80px" label-position="left">
                  <el-form-item prop="user" :label="$t('用户名')">
                      <el-input type="text" ref="user__input" v-model="formInline.user" :placeholder="$t('用户名')">
                      </el-input>
                      <div class="user__error" ref="user__error" @click='handleUserInput()'><span>{{$t('请填写用户名')}}</span></div>
                  </el-form-item>
                  <el-form-item prop="password" :label="$t('密码')">
                    <el-input type="password" ref="pwd__input" v-model="formInline.password" :placeholder="$t('密码')">
                      </el-input>
                      <div class="pwd__error" ref="pwd__error" @click='handlePwdInput()'><span>{{$t('请填写密码')}}</span></div>
                  </el-form-item>
                  <div class="login-btn" ref="login-btn">
                      <el-form-item>
                          <el-button type="primary" @click.stop.prevent="handleSubmit('formInline')">
                            {{$t('登录')}}
                          </el-button>
                      </el-form-item>
                  </div>
              </el-form>
          </div>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            var vm = this
            /*
             * 用户名验证
             */
            var checkName = (rule, value, callback) => {
                if (value === '') {
                  vm.$refs['user__input'].$refs['input'].setAttribute('placeholder', '')
                  vm.$refs['user__error'].style.display = 'block'
                  callback()
                } else {
                  if(value.length > 12) {
                    vm.$refs['user__input'].$refs['input'].setAttribute('placeholder', '')
                    vm.$refs['user__error'].style.display = 'block'
                    vm.$refs['user__error'].children[0].innerHTML = this.$t('用户名长度不能超过12位')
                    callback()
                  }
                  callback()
                }
            }
            /*
             * 密码验证
             */
            var checkPwd = (rule, value, callback) => {
                if (value === '') {
                    vm.$refs['pwd__input'].$refs['input'].setAttribute('placeholder', '')
                    vm.$refs['pwd__error'].style.display = 'block'
                    callback()
                } else {
                    if(value.length < 6 ) {
                      vm.$refs['pwd__input'].$refs['input'].setAttribute('placeholder', '')
                      vm.$refs['pwd__error'].style.display = 'block'
                      vm.$refs['pwd__error'].children[0].innerHTML = this.$t('密码长度不能小于6位')
                      callback()
                    }
                    callback()
                }
            }
            return {
                lang: localStorage.lang || '简体中文',
                formInline: { user: 'admin', password: '123456' },
                ruleInline: {
                     user: [
                        {  validator: checkName, trigger: 'blur' }
                    ],
                    password: [
                        {  validator: checkPwd, trigger: 'blur' },
                    ]
                },
            }
        },
        created() {
           this.keyLogin();
           //this.lang = localStorage.lang || '简体中文'
           this.handleSubmit();
        },
        methods: {

            handleUserInput() {
                this.$refs['user__error'].style.display = 'none'
                this.$refs['user__input'].$refs['input'].focus()
                this.$refs['user__input'].$refs['input'].setAttribute('placeholder', this.$t('用户名'))
            },
            handlePwdInput() {
                this.$refs['pwd__error'].style.display = 'none'
                this.$refs['pwd__input'].$refs['input'].focus()
                this.$refs['pwd__input'].$refs['input'].setAttribute('placeholder', this.$t('密码'))
            },
            handleSubmit(name) {
                var vm = this
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    var url = '/api.v2.do.user.login'
                    var params = {
                        "userid": 0,
                        "body": {
                            "Name": this.formInline.user,
                            "Password":this.formInline.password
                        }
                    }
                    this.$http(url, params).then((res) =>{
                        if(res.data.status !== 0 ){
                            this.$message({
                                'type': 'warning',
                                'message': this.$t(this.$msg[res.data.status]),
                                'showClose': true,
                                'duration': 1500
                            })
                            return
                        }
                        let [tk, uName, uid ] = [res.data.msg.body.Token, this.formInline.user, res.data.msg.body.ID ]
                        this.$auth.login({ manager: uName,  token: tk, id: uid  })
                        this.$message({
                            'type': 'success',
                            'message': this.$t("登录成功"),
                            'showClose': true,
                            'duration': 1500
                        })
                        this.$router.push('/')
                    }).catch((err) =>{
                        this.$message({
                            'type': 'error',
                            'message': this.$t('登录失败!'),
                            'showClose': true,
                            'duration': 1500
                        })
                        return
                    })
                })
            },
            keyLogin() {
                var vm = this
                window.onkeydown = function() {
                  if (window.event.keyCode == 13)
                    vm.handleSubmit('formInline');
                  }
            },
            /*
             * 语言切换功能
             */
            languageChange(lang) {
              this.$refs['language'].innerText = lang
              this.lang = lang
              this.$store.commit('setLanguage', lang)
            }
        },
    }
</script>
