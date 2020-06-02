<style lang="less" src="./styles/plan.less"></style>
<template>
    <div class="plan">
        <el-row>
            <el-col :span="24">
            <div class="title">
                <span>{{$t('轮巡设置')}}</span>
                
            </div>
             <div class="title">
                <span>{{$t('可以设置多组场景切换组合')}}</span>
            </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
            <div class="tabletools">
                <el-button class="table-btn" size=small @click="refresh"><i class="fa fa-refresh"></i></el-button>
                <el-button class="table-btn" size=small @click="openPlanForm('add')"><i class="el-icon-plus mar-rig"></i>{{$t('新建')}}</el-button>
                <el-button class="table-btn" size=small @click="openPlanForm('edit')"><i class="el-icon-edit mar-rig"></i>{{$t('编辑')}}</el-button>
                <el-button class="table-btn" size=small @click="handleDel"><i class="el-icon-delete mar-rig"></i>{{$t('删除')}}</el-button>
            </div>
            </el-col>
        </el-row>
        <el-row style="height: calc(100% - 170px)">
            <el-col :span="24">
            <div class="tableshow">
                <el-table highlight-current-row @current-change="curChange" :data="data">
                    <el-table-column property="Name" :label="$t('预案名称')" align="center"></el-table-column>
                    <el-table-column property="WallName" :label="$t('所属屏组')" align="center"></el-table-column>
                    <el-table-column :label="$t('定时启动')" align="center" :formatter="formatterTime"></el-table-column>
                    <el-table-column :label="$t('是否启用')" align="center" :formatter="formatterUse"></el-table-column>
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
        <PlanForm ref="plan_form" @formsubmit="handleForm"/>
    </div>
</template>
<script>
import PlanForm from './planform.vue';

export default {
    name:'screen',
    components : { PlanForm },
    data () {
        return {
            data: [],
            total: 0,
            current: 1,
            pagesize: 10,
            curId: null,
        }
    },
    computed: {

    },
    filter: {

    },
    created() {
        this.list(0, this.pagesize);
    },
    methods: {
        /* 
         * 取分页列表数据
         */
        list: function (start, limit) {
            var vm = this,
                url = '/api.v2.do.plan.get',
                params = {
                    "userid": this.$auth.getuid(),
                    "page": { "start": start, "limit": limit }
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
                if(!res.data.msg) {
                    this.total = 0
                    this.data = []
                    return
                }
                this.total = res.data.msg.count
                this.data = res.data.msg.body
            }).catch((err) => {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('获取预案信息失败'),
                    'showClose': true,
                    'duration': 1500
                })
            })
        },
        /* 
         * 定时启动数据格式化
         */
        formatterTime: function(row, column, cellValue) {
            return row.StartOnTime == 1 ? row.StartTime + '-' + row.EndTime : this.$t('否')
        },
        /* 
         * 是否启用数据格式化
         */
        formatterUse: function(row, column, cellValue) {
            return row.IsRun ? this.$t('启用') : this.$t('停止')
        },
        /* 
         * 切换页面查看数据
         */
        onPageChange: function (index) {
            this.current = index
            var start = (this.current -1 ) * this.pagesize,
                limit = this.pagesize
            this.curId = null        
            this.list(start, limit )
        },
        /* 
         * 获取当前选中预案的id
         */
        curChange: function (newVal, oldVal) {
            if(null != newVal) {
                this.curId = newVal.ID
            }
        },

        // 刷新页面
        refresh: function () {
            var start = (this.current -1 ) * this.pagesize ,
                limit = this.pagesize
            this.curId = null
            this.list(start, limit)
        },

        /**
         * 新建、编辑 ，不建议将表单数据定义在此处, 太绕
         * @param e
         * @param type
         */
        openPlanForm: function (type) {
            if(type == 'edit' && this.curId == null) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('请先选择要编辑的预案'),
                    'showClose': true,
                    'duration': 1500
                })
                return
            }
            if (type == 'add') {
                var formData ={ Name: '', WallID: '', DefaultTime: 10,  StartOnTime: 0, StartTime: '',  EndTime: '', SceneList: [] }
                var title = '新建'
            } else {
                var formData = this.getCurrentSelectPlan()
                formData.SceneList = !!formData.SceneList ? formData.SceneList : []
                if(formData.IsRun) {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('该预案正在启动过程中,不可以编辑'),
                        'showClose': true,
                        'duration': 1500
                    })
                    return
                }
                formData.DefaultTime = 10
                var title = '编辑'
            }
            this.$refs['plan_form']._setmodal(true)
            this.$refs['plan_form'].setFormData(formData, title, type)
            this.$refs['plan_form'].resetSceneList()
        },
        /* 
         * 操作新建、编辑的表单数据
         */
        handleForm: function(type, data) {
            var vm = this
            var scenelist = []
            data.SceneList.forEach(function(value){
                var item = {}
                item.ID = value.ID
                item.Time = parseInt(value.Time)
                scenelist.push(item)
            })
            var params = {
                userid: this.$auth.getuid(),
                body: {
                    WallID: data.WallID,
                    Name: data.Name,
                    StartTime: data.StartTime ? data.StartTime : '',
                    EndTime: data.EndTime ? data.EndTime : '',
                    StartOnTime: data.StartOnTime,
                    SceneList: scenelist,
                }
            }
            if(type == 'add') {
                var url = '/api.v2.do.plan.add'
            } else {
                var url = '/api.v2.do.plan.edit'
                params.body.ID = data.ID
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
                this.$refs['plan_form']._setmodal(false)
            }).catch((err) => {
                this.$message({
                    'type': 'error',
                    'message': this.$t('操作错误'),
                    'showClose': true,
                    'duration': 1500
                })
                return
            })
        },

        // 删除预案
        handleDel: function () {
            var vm = this
            //此处处理删除操作
            if(!this.curId) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('请先选择需要删除的预案'),
                    'showClose': true,
                    'duration': 1500
                })
                return
            }
            var formData = this.getCurrentSelectPlan()
            if(formData.IsRun) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('该预案正在启动过程中,不可以编辑'),
                    'showClose': true,
                    'duration': 1500
                })
                return
            }
            this.$confirm(this.$t('此操作将永久删除该预案, 是否继续?'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                let id = this.curId
                let params = {"userid": this.$auth.getuid(), "body":{"ID": id } }
                let url = '/api.v2.do.plan.del'

                this.$http(url, params).then(res => {
                    this.$message({
                        'type': 'success',
                        'message': this.$t('删除成功!'),
                        'showClose': true,
                        'duration': 1500
                    });
                    this.refresh()
                }).catch(err => {
                    this.$message({
                        'type': 'warning',
                        'message': this.$t('删除失败!'),
                        'showClose': true,
                        'duration': 1500
                    });
                })
            }).catch(() => {
                this.$message({
                    'type': 'info',
                    'message': this.$t('已取消'),
                    'showClose': true,
                    'duration': 1500
                });          
            });
        },
        /* 
         * 获取当前选中的预案
         */
        getCurrentSelectPlan() { 
            var vm  = this
            var data = this.data.filter(function(value){
                return value.ID === vm.curId
            })[0]
            return JSON.parse(JSON.stringify(data))
        }
    }    
}
</script>
