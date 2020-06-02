<style lang="less" src="./styles/screen.less"></style>
<template>
    <div class="screen">

        <el-row>

            <el-col :span="24">
            <div class="title"><span>{{$t('屏组设置')}}</span></div>
            <div class="title"><span>{{$t('可创建多组屏，并且分别进行管理')}}</span></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
            <div class="tabletools">
                <el-button class="table-btn" size=small @click="refresh"><i class="fa fa-refresh mar-rig"></i></el-button>
                <el-button class="table-btn" size=small @click="openScreenForm('add')"><i class="el-icon-plus mar-rig"></i>{{$t('新建')}}</el-button>
                <el-button class="table-btn" size=small @click="openScreenForm('edit')"><i class="el-icon-edit mar-rig"></i>{{$t('编辑')}}</el-button>
                <el-button class="table-btn" size=small @click="handleDel"><i class="el-icon-delete mar-rig"></i>{{$t('删除')}}</el-button>
                <el-button class="table-btn" size=small @click="bindNode"><i class="el-icon-setting mar-rig"></i>{{$t('设置')}}</el-button>
                <el-button class="table-btn" size=small @click="bindIp"><i class="fa fa-pencil mar-rig"></i>{{$t('设置IP')}}</el-button>
            </div>
            </el-col>
        </el-row>
        <el-row style="height:calc(100% - 175px)">
            <el-col :span="24">
            <div class="tableshow">
                <el-table highlight-current-row :data="data" @current-change="curChange" stripe>
                    <el-table-column property="Name" :label="$t('屏组名称')" align="center"></el-table-column>
                    <el-table-column :label="$t('单元屏幕分辨率')" align="center" :formatter="formatterResolution"></el-table-column>
                    <el-table-column :label="$t('Led屏')" align="center" :formatter="formatterLed"></el-table-column>
                    <el-table-column property="RowColumes" :label="$t('行×列')" align="center" :formatter="formatterRowColumn"></el-table-column>
                    <el-table-column property="GridRowColumes" :label="$t('逻辑网格')" align="center" :formatter="formatterGrids"></el-table-column>
                    <el-table-column property="Degree" :label="$t('旋转角度')" align="center" :formatter="formatterDegree"></el-table-column>
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
        <ScreenForm ref="screen_form" @formsubmit="handleForm"></ScreenForm>
        <NodeSetting ref="node_setting"></NodeSetting>
    </div>
</template>
<script>
    import ScreenForm from './screenform.vue';
    import NodeSetting from './nodesetting.vue';

    export default {
        name: 'screen',
        components: { ScreenForm, NodeSetting},
        data () {
            return {
                data: [],               //列表数据
                total: 0,               //列表总条数
                current: 1,             //当前页
                pagesize: 10,            //每页显示多少条
                curId: null,
            }
        },
        created() {
            // 页面初始化
            this.list(0, this.pagesize)
        },

        methods: {
            /**
             * 取分页列表数据
             * @param  {[type]} start [description]
             * @param  {[type]} limit [description]
             * @return {[type]}       [description]
             */
            list: function (start, limit) {
                var url = '/api.v2.do.screen.get',
                    params = {
                        "userid": this.$auth.getuid(),
                        "page": { "start": start, "limit": limit }
                    }
                this.$http(url, JSON.stringify(params))
                .then((res) => {
                    if (res.data.status !== 0) {
                        this.$message({
                            'type': 'warning',
                            'message': this.$t(this.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        })
                    }
                    if (!res.data.msg) {
                        this.total = 0
                        this.data = []
                        return
                    }
                    this.total = res.data.msg.count
                    this.data = res.data.msg.body
                })
                .catch((err) => {
                    console.log(err)
                })

            },

            formatterResolution: function(row, column, cellValue) {
                return row.UintW + ' x ' + row.UintH
            },

            formatterLed: function(row, column, cellValue) {
                return row.IsLed ? this.$t('是') : this.$t('否')
            },

            formatterRowColumn: function(row, column, cellValue) {
                return row.Rows + ' x ' + row.Columns
            },

            formatterGrids: function(row, column, cellValue) {
                return row.GridRows + ' x ' + row.GridColumns
            },

            formatterDegree: function(row, column, cellValue) {
                switch(row.Degree) {
                    case 0:
                        return '0°'
                    case 1:
                        return '90°'
                    case 2:
                        return '180°'
                    case 3:
                        return  '270°'
                    default:
                        return   '0°'
                }
            },

            // 切换页面查看数据
            onPageChange: function (index) {
                this.current = index
                this.refresh()
            },

            /**
             * 当前行发生变化时触发
             */
            curChange: function (curRow, oldRow) {
                if(null != curRow) {
                    this.curId = curRow.ID
                }
            },

            /**
             *  * 刷新列表
             */
            refresh: function () {
                var start = (this.current -1 ) * this.pagesize ,
                    limit = this.pagesize
                this.curId = null
                this.list(start, limit )
            },

            /**
             * 打开 添加/编辑面板
             * @param op : operation 操作类型 ,添加 or编辑
             */
            openScreenForm: function (type) {
                if(type == 'edit' && this.curId == null) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('请先选择要编辑的屏组'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                if (type == 'add') {
                    var formData = {
                        Name: '',
                        Rows: 4,
                        Columns: 4,
                        Resolution: '',
                        Grid: '4x4',
                        Degree: 0,
                        AudioX: 1,
                        AudioY: 1,
                        LedW: 0,
                        LedH: 0,
                        IsLed: 0
                    }
                    var title = this.$t('新建')
                } else {
                    var data = this.getCurrentSelectScreen()
                    var formData = {
                        ID: data.ID,
                        Name: data.Name,
                        Rows: data.Rows,
                        Columns: data.Columns,
                        Resolution: data.UintW + '*' + data.UintH,
                        Grid: data.GridRows + 'x' + data.GridColumns,
                        Degree: data.Degree,
                        AudioX: data.AudioX + 1,
                        AudioY: data.AudioY + 1,
                        IsLed: data.IsLed,
                        LedW: data.LedW,
                        LedH: data.LedH
                    }
                    var title = this.$t('编辑')
                }

                this.$refs['screen_form']._setmodal(true)
                this.$refs['screen_form'].setFormData(formData, title, type)

            },

            handleForm: function(type, data, isNext) {
                if(type == 'add') {
                    var url = '/api.v2.do.screen.add'
                    var params = {
                        userid: this.$auth.getuid(),
                        body: {
                            Name: data.Name,
                            Rows: (data.IsLed == '1') ? 0 : parseInt(data.Rows),
                            Columns: (data.IsLed == '1') ? 0 : parseInt(data.Columns),
                            UintW: parseInt(data.Resolution.split('*')[0]),
                            UintH: parseInt(data.Resolution.split('*')[1]),
                            GridRows: parseInt(data.Grid.split('x')[0]),
                            GridColumns: parseInt(data.Grid.split('x')[1]),
                            Degree: data.IsLed ? 0 : parseInt(data.Degree),
                            AudioX: parseInt(data.AudioX) - 1,
                            AudioY: parseInt(data.AudioY) - 1,
                            LedW: data.IsLed ? parseInt(data.LedW) : 0,
                            LedH: data.IsLed ? parseInt(data.LedH) : 0
                        }
                    }
                } else {
                    var url = '/api.v2.do.screen.edit'
                    var params = {
                        userid: this.$auth.getuid(),
                        body: {
                            ID: data.ID,
                            Name: data.Name,
                            GridRows: parseInt(data.Grid.split('x')[0]),
                            GridColumns: parseInt(data.Grid.split('x')[1]),
                            AudioX: parseInt(data.AudioX) - 1,
                            AudioY: parseInt(data.AudioY) - 1
                        }
                    }
                }
                this.$http(url, params).then((res) => {
                    if(0 !== res.data.status) {
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
                        'message': this.$t('操作成功'),
                        'showClose': true,
                        'duration': 1500
                    })
                    this.refresh()
                    this.$refs['screen_form']._setmodal(false)
                    if(isNext) {

                    }
                }).catch((err) => {
                    this.$message({
                        'type': 'error',
                        'message': this.$t('操作异常'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                })
            },

            /**
             * 节点绑定
             * @return {[type]} [description]
             */
            bindNode: function() {
                if(this.curId == null) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('请先选择屏组'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                var data = this.getCurrentSelectScreen()
                this.openNodeSetting(data)
            },

            /**
             * 打开节点绑定
             */
            openNodeSetting: function(data) {
                this.$refs['node_setting']._setmodal(true)
                this.$refs['node_setting']._setData(data)
            },

            /**
             * 设置屏组的代理IP
             */
            bindIp: function() {
                if(this.curId == null) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('请先选择屏组'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.$prompt(' ', this.$t('设置代理IP'), {
                  confirmButtonText: this.$t('保存'),
                  cancelButtonText: this.$t('取消'),
                  inputPlaceholder: this.$t('请输入代理IP地址'),
                  inputPattern: /(((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))/,
                  inputErrorMessage: this.$t('ip地址不正确')
                }).then(( {value} ) => {
                  var url = '/api.v2.do.screen.setProxyIp'
                  var params = {
                    'userid': this.$auth.getuid(),
                    'body': {
                      'ID': this.curId,
                      'IP': value
                    }
                  }
                  this.$http(url, JSON.stringify(params)).then((res) => {
                    if(res.data.status != 0) {
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
                        'message': this.$t('设置成功'),
                        'showClose': true,
                        'duration': 1500
                    })
                  }).catch((err) => { console.log(err) })
                }).catch( (err) => {} )
            },

            /**
             * 删除屏组
             * @return {[type]} [description]
             */
            handleDel: function () {
                var vm = this
                //此处处理删除操作
                if(!this.curId) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('请先选择需要删除的屏组'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                this.$confirm(this.$t('此操作将永久删除该屏组, 是否继续?'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    let id = this.curId
                    let params = {"userid": vm.$auth.getuid(), "body":{"ID": id } }
                    this.$http('/api.v2.do.screen.del', params).then((res) => {
                        if(res.data.status != 0) {
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
                            'message': this.$t('删除成功!'),
                            'showClose': true,
                            'duration': 1500
                        })
                        this.refresh()
                    }).catch((err) => {
                        this.$message({
                            'type': 'warning',
                            'message': this.$t('删除失败!'),
                            'showClose': true,
                            'duration': 1500
                        })
                    })
                }).catch(() => {
                    this.$message({
                        'type': 'info',
                        'message': this.$t('已取消'),
                        'showClose': true,
                        'duration': 1500
                    })
                })
            },

            //  获取选中当前行的数据
            getCurrentSelectScreen() {
                var vm  = this
                var data = this.data.filter(function(value){
                    return value.ID === vm.curId
                })
                return JSON.parse(JSON.stringify(data[0]))
            }
        },
        beforeDestory () {
            console.error(412)
        }
    }
</script>
