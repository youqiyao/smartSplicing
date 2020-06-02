<style lang="less" src='./styles/logosetting.less'></style>
<template>
    <div class="logosetting">
        <el-row :gutter="16" style="height:100%;">
            <el-col :span="12" style="height:100%;">
                <el-col :span="24" style="height: calc(100% - 130px)">
                  <div class="logoform">
                  <el-upload
                                class="upload-logo"
                                ref="uploadLogo"
                                drag
                                accept="image/png"
                                :on-success="uploadSucc"
                                :on-error="uploadErr"
                                name="image_path"
                                :action="uploadUri"
                                :multiple="false"
                                :show-file-list="false"
                                >
                                <i class="fa fa-cloud-upload"></i>
                                <div class="el-upload__tip">{{$t('将文件拖到此处，或点击上传')}}</div>
                                <div class="el-upload__text">{{$t('请上传')}}<span style="color:#20a0ff;">&nbsp;310*60&nbsp;</span>{{$t('像素的')}}<span style="color:#20a0ff;">&nbsp;PNG&nbsp;</span>{{$t('格式的图片')}}</div>
                              </el-upload>
                  </div>
                </el-col>
                <el-col :span="24"><el-button type="primary" class="logo-btn" @click="saveLogo()">{{$t('保存')}}</el-button></el-col>
            </el-col>
            <el-col :span="12" style="height:100%;"><div></div></el-col>
        </el-row>
    </div>
</template>
<script>
    import cnf from "../../../../config/config";

    export default {
        data () {
            return {
              uploadUri: cnf.apiDomain + '/api.v2.uploadLogo',
              image_Name: '',
            }
        },
        computed: {

        },
        created() {
         

        },
        beforeRouteLeave(to, from, next) {
          this.$store.commit('setPreviewLogoUrl', '')
          this.$store.commit('setPreviewLogoStatus', 0)
          next()
        },
        methods: {
            /*
             * 上传文件成功后的钩子函数
             * @param res
             * @param file
             * @param fileLst
             */
            uploadSucc(res, file){
              if(!res.status) {
                  this.$message({
                    'showClose': true,
                    'duration': 1500,
                    'type': 'warning',
                    'message': this.$t('请上传PNG格式图片')
                  })
                  return
              }
              this.imageLogoName = res.image_Name
              this.$store.commit('setPreviewLogoUrl', res.image_path)
              this.$store.commit('setPreviewLogoStatus', 1)
            },

            
            /**
             * 上传文件出错的钩子函数
             * @param err
             * @param file
             * @param fileLst
             */
            uploadErr(err, file) {
                // console.error(76)
            },
//            保存Logo操作
            saveLogo() {
              var url = '/api.v2.saveLogo'
              var params = {
                  userid: this.$auth.getuid()
              }
              this.$http(url, params).then((res) => {
                  var logoUrlArray = this.$store.state.logoPath.split('=')
                  var logoUrl = logoUrlArray[0] + '=' + Date.now()
                  this.$store.commit('setLogoPath', logoUrl)
                  this.$message({
                      'type': 'success',
                      'message': this.$t('保存成功'),
                      'duration': 1000,
                      'showClose': true
                  })
              }).catch((err) => {})
          }
      
        }
    }
</script>

