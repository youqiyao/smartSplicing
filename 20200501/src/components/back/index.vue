<template>
    <div class="back" >
        <el-button class="info-btn" @click="modal = true"><i class="fa fa-power-off"></i></el-button>
        <el-dialog
            :title="$t('系统提示')"
            :visible.sync="modal"
            :close-on-click-modal="false"
            >
            <p><i class="fa fa-question-circle"></i>{{$t('是否退出登录')}}</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modal = false">{{$t('取消')}}</el-button>
                <el-button type="primary" @click="backToLogin">{{$t('确定')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                modal: false
            }
        },
        methods: {
          /* 
           * 退出系统到登录界面
           */
            backToLogin() {
                var url = '/api.v2.do.user.logout'
                var params = {
                    "userid": 0, 
                    "body": {
                        "ID": this.$auth.getuid()
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
                    this.modal = false
                    this.$auth.logout()
                    this.$router.push("/login")
                }).catch((err) => {
                    this.$message({
                        'type': 'error',
                        'message': this.$t('操作失败'),
                        'showClose': true,
                        'duration': 1500
                    })
                })
            }
        }
    }
</script>