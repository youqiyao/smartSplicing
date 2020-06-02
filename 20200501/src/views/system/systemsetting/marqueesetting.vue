<style lang="less" src='./styles/marqueesetting.less'></style>
<template>
    <div class="usersmanage">
    	<el-row>
          <el-col :span="24">
          <div class="title"><span>{{$t('字幕设置')}}</span></div>
          <div class="title"><span>{{$t('添加字幕叠加功能')}}</span></div>
          </el-col>
          
      </el-row>
        <el-row>
            <el-col :span="24">
            <div class="tabletools">
                <el-button class="table-btn" size=small @click="refresh"><i class="fa fa-refresh"></i></el-button>
                <el-button class="table-btn" size=small @click="openUserForm('add')"><i class="el-icon-plus mar-rig"></i>{{$t('新建')}}</el-button>
                <el-button class="table-btn" size=small @click="openUserForm('edit')"><i class="el-icon-edit mar-rig"></i>{{$t('编辑')}}</el-button>
                <el-button class="table-btn" size=small @click="handleDel"><i class="el-icon-delete mar-rig"></i>{{$t('删除')}}</el-button>
            </div>
            </el-col>
        </el-row>
        <el-row style="height: calc(100% - 50px)">
            <el-col :span="24">
            <div class="tableshow">
                <el-table highlight-current-row :data="data" @current-change="curChange">
                    <el-table-column :label="$t('字幕内容')" align="center">
                      <template scope="scope">
                          <div class="item-name" :title="scope.row.Text">{{scope.row.Text}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column property="WallName" :label="$t('所属屏组')" align="center" width="80"></el-table-column>
                    <el-table-column :formatter="formatterRectXY" :label="$t('字幕顶点坐标(px)')" align="center" width="150"></el-table-column>
                    <el-table-column :formatter="formatterRectWH" :label="$t('字幕的宽/高(px)')" align="center" width="140"></el-table-column>
                    <el-table-column :formatter="formatterFontSize" :label="$t('字体的宽/高(px)')" align="center" width="140"></el-table-column>
                    <el-table-column :label="$t('字体颜色')" align="center" width="80">
                      <template scope="scope">
                        <div class="color_block" :style="{'backgroundColor': formatterColorBlock(scope.row.Color)}"></div>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('背景颜色')" align="center"  width="80">
                      <template scope="scope">
                        <div class="color_block" :style="{'backgroundColor': formatterColorBlock(scope.row.BGColor)}"></div>
                      </template>
                    </el-table-column>
                    <el-table-column :formatter="$t(formatterState)" :label="$t('字幕滚动方向')" align="center" width="120"></el-table-column>
                    <el-table-column property="Speed" :label="$t('滚动速度')" align="center" width="80"></el-table-column>
                    <el-table-column property="Name" align="center" :label="$t('操作')" width="180">
                        <template scope="scope">
                            <el-button 
                              type="info"
                              size="small"
                              @click.native.prevent="handleMargueeShow(scope.row, 1)"
                              >{{$t('显示')}}
                            </el-button>
                            <el-button 
                              type="danger"
                              size="small"
                              @click="handleMargueeShow(scope.row, 0)"
                              >{{$t('隐藏')}}
                            </el-button>
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
        <MarqueeSettingForm  ref="marqueesetting_form" @formsubmit="handleForm"  />
    </div>
</template>
<script>
    import MarqueeSettingForm from '../marqueesettingform.vue';
    import util from '../../../libs/util.js'
    export default {
        name: 'marqueesetting',
        components: {MarqueeSettingForm },
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
        computed: {
          marqueeData: function() {
            return this.$store.state.marquee.selected_marquee
          },
        },
        methods: {
            /* 
              * 获取字幕方案列表
              */
            list: function (start, limit) {
                var url = '/api.v2.do.marquee.get',
                params = {
                    "userid": this.$auth.getuid(),
                    "page": {"start": start, "limit": limit}
                }

                this.$http(url, JSON.stringify(params)).then((res) => {
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
                        this.$store.commit('marquee/setSelectedMarquee',this.data)
                        return
                    }
                    this.total = res.data.msg.count
                    this.data = res.data.msg.body
                    this.$store.commit('marquee/setSelectedMarquee',this.data)
                }).catch((err) => { 
                    console.log(err)
                })

            },
            /* 
             * 字幕的顶点格式化
             */
            formatterRectXY(row, column, cellValue) {
              return '(' + row.RectX + ',' + row.RectY + ')'
            },
              /* 
             * 字幕的宽高格式化
             */
            formatterRectWH(row, column, cellValue) {
              return row.RectW + '/' + row.RectH 
            },
            /* 
           * 字体类型格式化
           */
            formatterFontType(row, column, cellValue) {
                switch (row.FontType) {
                  case 0: 
                         return this.$t('Arial')
                  case 1: 
                         return this.$t('华文宋体')
                  case 2: 
                         return this.$t('楷体')
                  case 3: 
                         return this.$t('微软雅黑')
                }
                return ''
            },
           /* 
           * 字体的宽高格式化
           */
            formatterFontSize(row, column, cellValue) {
                return row.FontW + '/' + row.FontH
            },
            /* 
             * 颜色格式化
             */
            formatterColorBlock(data) {
                return util.colorIntToRgba(data)
            },
            /* 
            * 字幕的状态格式化
            */
            formatterState(row, column, cellValue) {
                switch (row.State) {
                  case 0: 
                         return this.$t('静止')
                  case 1: 
                         return this.$t('从左向右滚动')
                  case 2: 
                         return this.$t('从右向左滚动')
                }
                return ''
            },

            /**
             * 控制字幕的显示隐藏
             */
            handleMargueeShow(row, state) {
                var url = '/api.v2.do.marquee.show',
                params = {
                    "userid": this.$auth.getuid(),
                    "body": {"ID": row.ID, "Show": state}
                }

                this.$http(url, JSON.stringify(params)).then((res) => {
                    if (res.data.status !== 0) {
                        this.$message({
                            'showClose': true,
                            'duration': 1500,
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status])
                        })
                        return
                    }
                    this.$message({
                        'showClose': true,
                        'duration': 1500,
                        'type': 'success',
                        'message': this.$t('操作成功')
                    })
                }).catch((err) => { 
                    console.log(err)
                })
                
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
             * [curChange 字幕选中事件]
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
                            'message': this.$t('请先选择要编辑的滚动字幕')
                        })
                    return
                }
                if (type == 'add') {
                    var formData = { WallID: '',Text: '',Color: 'rgba(231,19,19,1)',BGColor: 'rgba(14,14,14,1)',FontType: 1,FontW: 200, FontH: 200, RectX: 0, RectY: 0, RectW: 300, RectH: 500, Speed: 3, State: 0}
                    var title = this.$t('新建')
                } else {
                    var data = this.getCurrentSelectMarquee()
                    var formData = {
                        ID: data.ID,
                        WallID: data.WallID,
                        Text: data.Text,
                        Color: util.colorIntToRgba(data.Color),
                        BGColor: util.colorIntToRgba(data.BGColor),
                        FontType: parseInt(data.FontType),
                        FontW: parseInt(data.FontW),
                        FontH: parseInt(data.FontH),
                        RectX: parseInt(data.RectX),
                        RectY: parseInt(data.RectY),
                        RectW: parseInt(data.RectW),
                        RectH: parseInt(data.RectH),
                        Speed: parseInt(data.Speed),
                        State: parseInt(data.State)
                    }
                    var title = this.$t('编辑')
                }
                this.$refs['marqueesetting_form']._setmodal(true)
                this.$refs['marqueesetting_form'].setFormData(formData, title, type)
            },
         
            handleForm: function(type, data) {
                if (type == 'add') {
                    var url = '/api.v2.do.marquee.add'
                    var params = {
                    'userid': this.$auth.getuid(),
                    'body': {
                        WallID: data.WallID,
                        Text: data.Text,
                        Color: util.colorRgbaToInt(data.Color),
                        BGColor: util.colorRgbaToInt(data.BGColor),
                        FontType: parseInt(data.FontType),
                        FontW: parseInt(data.FontW),
                        FontH: parseInt(data.FontH),
                        RectX: parseInt(data.RectX),
                        RectY: parseInt(data.RectY),
                        RectW: parseInt(data.RectW),
                        RectH: parseInt(data.RectH),
                        Speed: parseInt(data.Speed),
                        State: parseInt(data.State)
                    }
                  }
                } else {
                    var url = '/api.v2.do.marquee.edit'
                    var params = {
                    'userid': this.$auth.getuid(),
                    'body': {
                        ID: data.ID,
                        WallID: data.WallID,
                        Text: data.Text,
                        Color: util.colorRgbaToInt(data.Color),
                        BGColor: util.colorRgbaToInt(data.BGColor),
                        FontType: parseInt(data.FontType),
                        FontW: parseInt(data.FontW),
                        FontH: parseInt(data.FontH),
                        RectX: parseInt(data.RectX),
                        RectY: parseInt(data.RectY),
                        RectW: parseInt(data.RectW),
                        RectH: parseInt(data.RectH),
                        Speed: parseInt(data.Speed),
                        State: parseInt(data.State)
                    }
                  }
                }
                this.$http(url, params)
                .then((res) => {
                    if(0 !== res.data.status) {
                        this.$message({
                            'showClose': true,
                            'duration': 1500,
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
                    this.$refs['marqueesetting_form']._setmodal(false)
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
             * 删除字幕
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
                        message: this.$t('请先选择需要删除的滚动字幕')
                    })
                    return
                }
                this.$confirm(this.$t('此操作将永久删除该字幕方案, 是否继续?'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    var id = this.curId,
                        url = '/api.v2.do.marquee.del',
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
           
            /**
             * [getCurrentSelectMarquee 获取当前选中的字幕信息]
             * @return {[type]} [description]
             */
            getCurrentSelectMarquee() {
                var vm = this
                var data = this.data.filter(function(value){
                    return value.ID == vm.curId
                })
                
                return JSON.parse(JSON.stringify(data[0]))
            }
        },
    }
</script>
