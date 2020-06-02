<style lang="less" src='./styles/bgimgsetting.less'></style>
<template>
    <div class="bgimgsetting">
    	<el-row>
          <el-col :span="24">
          <div class="title"><span>{{$t('底图设置')}}</span></div>
          <div class="title"><span>{{$t('可设置屏幕的背景高分底图')}}</span></div>
          </el-col>
      </el-row>
        <el-row :gutter="16" style="height:100%;">
            <el-col :span="12" style="height:100%;">
                <div class="bgform">
                    <el-form :model="formItem" label-width="100px" label-position='left'>
                        <el-form-item :label="this.$t('屏组')">
                            <el-select v-model="formItem.WallID" @change="screenGroupChange" placeholder=" " class="el-select-block">
                                <el-option v-for="item in screen" :value="item.ID" :label="item.Name"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="this.$t('上传图片')">
                            <el-upload
                                    class="uploadimg"
                                    accept="image/png,image/jpeg"
                                    :on-success="uploadSucc"
                                    :on-error="uploadErr"
                                    name="image_path"
                                    :action="uploadUri"
                                    :multiple="false"
                                    ref="uploadimg"
                                    >
                                <el-button  type="primary">{{$t('点击上传')}}<i class="fa fa-upload"></i></el-button>
                                <div class="el-upload__tip" slot="tip">{{$t('只能上传jpg/png文件')}}</div>
                            </el-upload>
                        </el-form-item>

                        <el-form-item :label="$t('更新图片选项')">
                            <el-radio-group v-model="formItem.Type" @change="imgApply">
                                <el-radio :label="1">{{$t('将所选图片覆盖整个幕墙')}}</el-radio><br/>
                                <el-radio :label="2">{{$t('将所选图片应用到每个单元')}}</el-radio><br/>
                                <el-radio :label="3">{{$t('将所选图片应用到指定单元')}}</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item :label="$t('图片指定单元')">
                            <el-select
                                    v-model="formItem.grid"
                                    :placeholder="$t('请选择')"
                                    class="el-select-block"
                                    :disabled="this.formItem.Type != 3" @change="setImgToGrid">
                                <el-option v-for="item in gridList" :value="item" :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <div class="bgimgbtn">
                        <el-button type="primary"  @click="bgImageClear">{{$t('清除背景')}}</el-button>
                        <el-button type="primary" @click="bgImageSubmit" >{{$t('应用背景')}}</el-button>
                        </div>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="12" style="height:100%;">
                <div class="img">
                  <div class="bgimg" ref="bgimg" id="bgimg" >
                    <div v-for="item in gridList" :ref="item" class="bg-grid" :style="{'width': bgScreenWidth, 'height': bgScreenHeight}"><span>{{item}}</span></div>
                  </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import cnf from "../../../../config/config";
    export default {
        data () {
            return {
                formItem: {
                    WallID: '',
                    Type: 1,
                    grid: '',
                    Path: '',
                    Row: 0,
                    Column: 0
                },

                screen: [],
                gridList: [],
                wallBgInfo: [],

                uploadUri: cnf.apiDomain + '/api.v2.uploadImg.0.0',
                uploadFiles: [],

                bgScreenWidth: 0,
                bgScreenHeight: 0,

                isbgImg: false,

            }
        },
        computed: {

        },
        created() {
            /* 
             * 页面初始化
             */
            this.list()
        },

        methods: {
            /* 
             * 获取屏组信息
             */
            list: function () {
                var vm = this
                var params = {
                    "userid": this.$auth.getuid(),
                }
                this.$http('/api.v2.do.screen.get', params).then((res)=>{
                    if (res.data.status !== 0) {
                        this.$message({
                            'showClose':'true',
                            'duration':'1500',
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status])
                        })
                        return
                    }
                    if (!res.data.msg) {
                        this.screen = []
                    } else {
                        this.screen = res.data.msg.body
                    }
                    this.formItem.WallID = ( this.screen.length != 0) ? this.screen[0].ID : ''
                    this.setGridItems()
                }).catch((err)=>{ })
            },

            /* 
             * 获取背景图片信息
             */
            getWallBgImg() {
                if(!this.formItem.WallID) {
                    this.wallBgInfo = []
                    return
                }
                var url = '/api.v2.do.bgImage.get',
                    params = {
                        "userid": this.$auth.getuid(), 
                        "body": {
                            "ID": 0,
                            "WallID": this.formItem.WallID
                        }
                    }
                this.$http(url, params).then((res) => {
                    if (res.data.status != 0) {
		                    this.wallBgInfo = []
                        this.$message({
                            'showClose':'true',
                            'duration':'1500',
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status])
                        })
                        return
                    }
                    if (!res.data.msg) {
                        this.wallBgInfo = []
                        return
                    }         
                    this.wallBgInfo = res.data.msg.body
                }).catch((err) => {})    
            },
            /* 
             * 根据选定屏组设置背景网格
             */
            screenGroupChange(val) {  

                this.getWallBgImg()
                this.setGridItems()

                this.formItem.Path = ''
                this.formItem.Type = 1
             
            },
            /* 
             * 设置背景图片网格
             */
            setGridItems: function(){
                var vm = this
                var currentScreeData = this.screen.filter(function(value){
                    return value.ID == vm.formItem.WallID
                })[0]
                var rows = currentScreeData.Rows
                var columns = currentScreeData.Columns
                var items = []
                for(var i = 1; i <= rows; i++ ){
                    for(var j = 1; j <= columns; j++ ){
                        items.push(i+'-'+j )
                    }
                }
                this.gridList = items
                this.resetBgImgGridsStyle(columns, rows)
                this.clearBgImgBackground()
            },
            /* 
             * 计算每个网格宽，高所占百分比
             */
            resetBgImgGridsStyle: function(rows, columns) {
                this.bgScreenWidth = Math.floor((1/rows * 10000))/100 + '%'
                this.bgScreenHeight = Math.floor((1/columns * 10000))/100 + '%'
            },
            /* 
             * 清除预览的背景图片
             */
            clearBgImgBackground: function() {
                this.$refs.bgimg.style.backgroundImage = 'none'
                this.$refs.bgimg.childNodes.forEach(function(node, index){
                    node.style.backgroundImage = 'none'
                })
                this.isbgImg = false
            },

            /*
             * 上传文件成功后的钩子函数
             * @param res
             * @param file
             * @param fileLst
             */
            uploadSucc(res, file, fileList ){
                if(!res.cmd_bgimage.status) {
                  this.$refs.uploadimg.uploadFiles = this.$lodash.clone(this.uploadFiles)
                  this.$message({
                    'showClose':'true',
                    'duration':'1500',
                    'type': 'warning',
                    'message': this.$t('请上传PNG或JPEG格式图片')
                  })
                  return
                }
                this.uploadFiles = [file]
                this.$refs.uploadimg.uploadFiles = this.$lodash.clone(this.uploadFiles)
                if(!this.formItem.WallID) return
                this.formItem.Path = res.cmd_bgimage.image_path
                this.setBgImg()
            },


            /**
             * 上传文件出错的钩子函数
             * @param err
             * @param file
             * @param fileLst
             */
            uploadErr(err, file, fileLst ) {

            },
            /* 
             * 设置背景图片
             */
            imgApply (value){

                this.formItem.WallID && this.formItem.Path && this.setBgImg() 
            },
            /* 
             * 覆盖，或者每个单元设置背景图片
             */
            setBgImg() {
                var imgUrl = this.formItem.Path
                if( this.formItem.Type == 1) {
                    this.$refs.bgimg.childNodes.forEach(function(node, index){
                        node.style.backgroundImage = 'none'
                    })
                    this.$refs.bgimg.style.backgroundImage = 'url(' + imgUrl + ')'
                } else if(this.formItem.Type == 2) {
                    this.$refs.bgimg.style.backgroundImage = 'none'
                    this.$refs.bgimg.childNodes.forEach(function(node, index){
                        node.style.backgroundImage = 'url(' + imgUrl + ')'
                    })
                } else {
                  if(this.formItem.grid == "") return
                  this.setImgToGrid(this.formItem.grid)
                }
                this.isbgImg = true
            },
            /* 
             * 设置图片到指定网格
             */
            setImgToGrid(value) {
                var imgUrl = this.formItem.Path
                this.$refs.bgimg.style.backgroundImage = 'none'
                this.$refs.bgimg.childNodes.forEach(function(node, index){
                    node.style.backgroundImage = 'none'
                })
                this.$refs[value][0].style.backgroundImage = 'url(' + imgUrl + ')'
                this.isbgImg = true

                var Grid = value.split("-")
                this.formItem.Row = parseInt(Grid[0]) - 1
                this.formItem.Column = parseInt(Grid[1]) - 1
            },
            /* 
             * 清除背景图片
             */
            delBgImg(id) {  
                var params = {
                    "userid": this.$auth.getuid(), 
                    "body":{"ID": id } 
                } 
                this.$http('/api.v2.do.bgImage.del', params).then((res)=>{
                        if (res.data.status !== 0) {
                        this.$message({
                            'showClose':'true',
                            'duration':'1500',
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status]),
                        })
                        return
                    }
                    this.$message({
                        'showClose':'true',
                        'duration':'1500',
                        'message': this.$t('清除成功'),
                        'showClose': true
                    })
                    this.getWallBgImg()
                }).catch((err)=>{ console.error(err) })
            },
            /* 
             * 清除图     片前对图片信息做出判断
             */
            bgImageClear() {
                if(this.wallBgInfo.length == 0) {
                    this.$message({
                        'showClose':'true',
                        'duration':'1500',
                        'message': this.$t('该屏组未设置背景图片'),
                        'showClose': true
                    })
                    return
                }
                this.wallBgInfo.forEach((item) => {
                    this.delBgImg(item.ID)
                })
            },
            /* 
             * 添加图片并应用图片
             */
            bgImageSubmit() {
              if(!this.isbgImg) {
                    this.$message({
                        'showClose':'true',
                        'duration':'1500',
                        'message': this.$t('请上传背景图片'),
                        'showClose': true
                    })
                    return
                }
                var url = '/api.v2.do.bgImage.add'
                var params = {
                    userid: this.$auth.getuid(),
                    body: {
                        WallID: this.formItem.WallID,
                        Row: this.formItem.Row,
                        Column: this.formItem.Column,
                        Path: this.formItem.Path,
                        Type: this.formItem.Type,
                    }
                }
                this.$http(url, params).then((res) => {
                    if (res.data.status !== 0) {
                        this.$message({
                           'showClose':'true',
                            'duration':'1500',
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status])
                        })
                        return
                    }
                    this.getWallBgImg()
                    this.$message({
                        'showClose':'true',
                        'duration':'1500',
                        'type': 'success',
                        'message': this.$t('操作成功')
                    })
                }).catch((err) => {})
            }
        }
    }
</script>

