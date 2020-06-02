<style lang="less" src='./styles/signalsource.less'></style>
<template>
    <div class="signalsource">
        <el-row :gutter="16" style="height: 100%;">
            <!--左半部分 信号源分组列表-->
            <el-col :span="24" style="height: 100%;">
            <div class="maintitle">
                <p>{{$t('信号源分组列表')}}</p>
                 <p>{{$t('对信号进行统一的分类管理')}}</p>
            </div>
            <!--左半部分 信号源分组操作工具栏-->
            <div style="width: 31%;float: left;height: 100%;">
            	 <div class="signaltreetools">
            	 <el-button @click="refreshSource" size=small class="table-btn bg-w"><i class="fa fa-refresh"></i></el-button>
                <el-button class="table-btn" size=small @click="addSourceGroup"><i class="el-icon-plus mar-rig"></i>{{$t('新建')}}</el-button>
                <el-button class="table-btn" size=small @click="editSourceGroup"><i class="el-icon-edit mar-rig"></i>{{$t('编辑')}}</el-button>
                <el-button class="table-btn" size=small @click="handleDelSourceGroup"><i class="el-icon-delete mar-rig"></i>{{$t('删除分组')}}</el-button>
                <el-button class="table-btn" size=small @click="handleDelSource"><i class="el-icon-delete mar-rig"></i>{{$t('移除信源')}}</el-button>
            </div>
            <!--左半部分 信号源分组转树形结构-->
            <div class="signaltree">
                <el-input
                    :placeholder="$t('输入关键字进行过滤')"
                    v-model="filterText">
                </el-input>
                <Tree
                  ref="system-signaltree"
                  :data="sourcegroup"
                  :props="defaultProps"
                  node-key="ID"
                  show-checkbox
                  check-strictly
                  default-expand-all
                  highlight-current
                  :filter-node-method="filterSignalNode"
                  @current-change="sourcegroupSelectChange"
                  >
                </Tree>
            </div>
            </div>

        <!--</el-col>-->
        <!--右半部分 信号源列表-->
        <!--<el-col :span="17" style="height: 100%;">-->
            <!--<div class="maintitle" >-->
                <!--<p>{{$t('信号源列表')}}</p>-->
            <!--</div>-->
            <div style="width: 68%;height: 100%;float: right;">
            	  <!--右半部分 信号源操作工具栏-->
            <div class="signaltreetools">

                <el-button class="table-btn" size=small @click="addToSourceGroup"><i class="el-icon-plus mar-rig"></i>{{$t('添加')}}</el-button>
                <el-button class="table-btn" size=small @click="DelSource"><i class="el-icon-delete mar-rig"></i>{{$t('删除信源')}}</el-button>
            </div>
            <!--右半部分 信号源列表-->
            <div class="signaltable">
                <el-input
                    :placeholder="$t('输入关键字进行过滤')"
                    v-model="filterSignalData">
                </el-input>
                <el-table :row-style="rowStyle" class="signaltable_table" borber highlight-row :data="sourceData" @selection-change="sourceSelectChange">
                    <el-table-column width="60" align="center" type="selection"></el-table-column>
                    <el-table-column property="Name" :label="$t('信源名称')" align="left"></el-table-column>
                </el-table>
            </div>
            </div>

            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        name: 'signalsource',
        components: { },
        data() {
            return {
                defaultProps: {
                    children: 'Children',                  //指定子树节点的值
                    label: 'Name',                         //指定节点标签为分组信源名称
                },

                filterText: '',                            //左边信号源分组搜索的关键字
                sourcegroup: [],                           //信号源分组
                selectTreeGroup: null,                     //左边被选中的信号源

                filterSignalData: '',                      //右边信号源搜索的关键字
                source: [],                                //信号源数据
                selectedSource: null,                      //右边被选中的信号源
            }
        },
        computed: {
            /**
             * 计算过滤筛选出的信源数据
             */
            sourceData: function(){
                if(!this.filterSignalData) {
                    return this.source
                }
                return this.source.filter((val) => {
                    return val.Name.indexOf(this.filterSignalData) !== -1
                })
            }
        },
        created() {
            this.getsource(0, 0)
            this.getsourcegroup(0, 0)
        },
        watch: {
            filterText(val, oldVal) {
                this.$refs['system-signaltree'].filter(val);
            },
        },
        methods: {
            /**
             * 搜索树节点
             * @param  {[type]} value [description]
             * @param  {[type]} data  [description]
             * @return {[type]}       [description]
             */
            rowStyle({ row, rowIndex}) {
                console.log('row=====', row)
                console.log('rowIndex=====', rowIndex)
                if (rowIndex === 0) {
                    return ''
                } else {
                    return ''
                }
            },
            filterSignalNode: function(value, data) {
                if (!value) return true;
                return data.Name.indexOf(value) !== -1;
            },
            /**
             * [获取信源分组信息]
             * @param  {[type]} start [description]
             * @param  {[type]} limit [description]
             * @return {[type]}       [description]
             */
            getsourcegroup: function(start, limit) {
                let url = '/api.v2.do.sourcegroup.get'
                let params = {
                    "userid": this.$auth.getuid(),
                    "page": {
                        "start": start,
                        "limit": limit
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
                    if (!res.data.msg) {
                        this.sourcegroup = []
                        return
                    }
                    this.sourcegroup = this.listToTree(res.data.msg.body)
                }).catch((err) => { })
            },

            /**
             * 信源列表 、pid参数预留 先不云掉 ，
             * @param parentId
             */
            getsource: function (start, limit) {
                //如果是子节点、并且处于打开状态 则收缩
                let url = '/api.v2.do.source.get'
                let params = {
                    "userid": this.$auth.getuid(),
                    "page":{
                        "start": start,
                        "limit": limit
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
                    if (!res.data.msg) {
                        this.source = []
                        return
                    }
                    this.source = res.data.msg.body
                }).catch((err) => { console.error(err) })
            },

            /**
             * [refreshSource 刷新信源列表]
             * @return {[type]} [description]
             */
            refreshSource: function() {
                this.getsource(0, 0)
                this.selectedSource = null
            },
            /*
             * 当前被选中的右边信号源
             */
            sourceSelectChange: function(selection) {
                if (selection.length === 0) {
                    this.selectedSource = null
                } else {
                    this.selectedSource = selection
                }
            },
            /*
             * 右边被选中的信号源添加到左边信源分组中
             */
            addToSourceGroup: function() {
                if(null === this.selectTreeGroup) {
                    this.$message({
                        message: this.$t('请先选择分组'),
                        type: 'warning',
                        duration: 3000,
                        showClose: true,
                    })
                } else if(this.selectedSource === null) {
                    this.$message({
                        message: this.$t('请先选择信号源'),
                        type: 'warning',
                        duration: 3000,
                        showClose: true,
                    })
                } else {
                    let ids = []
                    for(var i = 0; i < this.selectedSource.length; i++) {
                        ids.push(this.selectedSource[i].ID)
                    }
                    let url = '/api.v2.do.source.addtotype'
                    let params = {
                        "userid": this.$auth.getuid(),
                        "body": {
                            "GroupID": this.selectTreeGroup.ID,
                            "ID": ids
                        }
                    }
                    this.$confirm(this.$t('确定将所选信源添加到') + '<' + this.selectTreeGroup.Name + '>?', this.$t('提示'), {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'warning'
                    }).then(() => {
                        this.$http(url, params).then(res => {
                            if(res.data.status !== 0) {
                                this.$message({
                                    'showClose':'true',
                                    'type': 'warning',
                                    'message': this.$t(this.$msg[res.data.status])
                                })
                            } else {
                                this.$message({
                                    message: this.$t('添加成功'),
                                    type: 'success',
                                    duration: 1000,
                                    showClose: true,
                                })
                                this.refreshSourceGroup()
                            }
                        }).catch(err => { console.error(err) })
                    }).catch((err) => { })
                }
            },
            /*
             * 右边被选中的信号源删除
             */
            DelSource: function() {
                
                if(this.selectedSource === null) {
                    this.$message({
                        message: this.$t('请先选择信号源'),
                        type: 'warning',
                        duration: 3000,
                        showClose: true,
                    })
                } else  {  
                    let ids = []
                    let groupID = null
                    for (var i = 0; i < this.selectedSource.length; i++) {                        
                        ids.push(this.selectedSource[i].ID)
                    }
                    this.$confirm(this.$t('此操作将永久删除该信源, 是否继续?'), this.$t('提示'), {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'warning',
                        closeOnClickModal: false
                    }).then(() => {
                        let url = '/api.v2.do.source.rmFromType'
                        let params = {
                            "userid": this.$auth.getuid(),
                            "body": {
                                "GroupID": groupID,
                                "ID": ids
                            }
                        }
                        this.$http(url, JSON.stringify(params)).then(res => {
                            if(res.data.status !== 0) {
                                this.$message({
                                     duration: 1500,
                                     showClose: true,
                                    'type': 'warning',
                                    'message': this.$t(this.$msg[res.data.status])
                                })
                            } else {
                                this.$message({
                                    message: this.$t('删除成功'),
                                    type: 'success',
                                    duration: 1000,
                                    showClose: true,
                                })
                                this.refreshSource()
                            }
                        }).catch((err) => { console.error(err) })
                    }).catch(() => { })
                }
            },

            /**
             * [refreshSourceGroup 刷新信号源分组列表]
             * @return {[type]} [description]
             */
            refreshSourceGroup: function() {
                this.getsourcegroup(0, 0)
            },

            /**
             * [addSourceGroup 新建分组]
             */
            addSourceGroup: function() {
                if ((null === this.selectTreeGroup) || (this.selectTreeGroup.Type !== 1)) {
                    this.$message({
                        message: this.$t('请先选择分组'),
                        type: 'warning',
                        duration: 3000,
                        showClose: true,
                    })
                } else if(this.selectTreeGroup.ID === 4294967295) {
                    this.$message({
                        message: this.$('未分组下不可新建分组'),
                        type: 'warning',
                        duration: 3000,
                        showClose: true,
                    })
                } else {
                    this.$prompt(' ', this.$t('新建分组'), {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        closeOnClickModal: false,
                        inputPlaceholder: this.$t('请输入分组名称'),
                        inputValidator: this.$t(function(value) {
                        if(value.length > 12 || value.length == 0)
                            return this.$t('请输入1~12位长度的名称')
                        })
                    }).then(({ value }) => {
                        let url = '/api.v2.do.sourcegroup.add'
                        let params = {
                            "userid": this.$auth.getuid(),
                            "body": {
                                "ParentID": this.selectTreeGroup.ID,
                                "Name":value
                            }
                        }
                        this.$http(url, params).then((res) => {
                            if(res.data.status != 0) {
                                this.$message({
                                    'type': 'warning',
                                    'message': this.$msg[res.data.status],
                                    'showClose': true,
                                    'duration': 1500
                                })
                            } else {
                                this.$message({
                                    duration: 1500,
                                    showClose: true,
                                    type: 'success',
                                    message: this.$t('添加成功')
                                });
                                this.refreshSourceGroup()
                            }
                        }).catch((err) => { console.error(err) })
                    }).catch((err) => { })
                }
            },

            /**
             * 编辑信源分组或者信源
             */
            editSourceGroup: function() {
                if(null === this.selectTreeGroup) {
                    this.$message({
                        message: this.$t('请先选择分组或信源'),
                        type: 'warning',
                        duration: 3000,
                        showClose: true,
                    })
                    return
                }
                if(this.selectTreeGroup.Type == 1) {
                    var message_title = this.$t('编辑分组')
                    var url = '/api.v2.do.sourcegroup.edit'
                } else {
                    var message_title = this.$t('编辑信源')
                    var url = '/api.v2.do.source.edit'
                }
                this.$prompt(' ', message_title, {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    closeOnClickModal: false,
                    inputValue: this.selectTreeGroup.Name,
                    inputValidator: this.$t((value) => {
                        if((message_title == this.$t('编辑分组') && value.length > 12) || (message_title == this.$t('编辑分组') && value.length == 0)) {
                            return this.$t('请输入长度为1~12位的名称')
                        }
                    })
                }).then(({ value }) => {
                    var params = {
                        'userid': this.$auth.getuid(),
                        'body': {
                            'ID': this.selectTreeGroup.ID,
                            'Name': value
                        }
                    }
                    this.$http(url, params).then(res => {
                        if(res.data.status != 0) {
                            this.$message({
                                'type': 'warning',
                                'message': this.$t(this.$msg[res.data.status]),
                                'showClose': true,
                                'duration': 1500
                            })
                        } else {
                            this.$message({
                                'type': 'success',
                                'message': this.$t('操作成功'),
                                'showClose': true,
                                'duration': 1500
                            })
                            this.refreshSourceGroup()
                        }
                    }).catch(err => { console.error(err) })
               }).catch(() => { })
            },

            /**
             * 删除信源分组
             */
            handleDelSourceGroup: function() {
                if((null === this.selectTreeGroup) || (this.selectTreeGroup.Type !== 1)) {
                    this.$message({
                        message: this.$t('请先选择要删除的分组'),
                        type: 'warning',
                        duration: 3000,
                        showClose: true,
                    })
                } else if(0 == this.selectTreeGroup.ParentID) {
                    this.$message({
                        message: this.$t('该分组不能被删除'),
                        type: 'warning',
                        duration: 3000,
                        showClose: true,
                    })
                } else {
                    this.$confirm(this.$t('此操作将永久删除该分组, 是否继续?'), this.$t('提示'), {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'warning',
                        closeOnClickModal: false
                    }).then(() => {
                        let url = '/api.v2.do.sourcegroup.del'
                        let params = {
                            "userid": this.$auth.getuid(),
                            "body": {
                                "ID": this.selectTreeGroup.ID
                            }
                        }
                        this.$http(url, params).then(res => {
                            if(res.data.status !== 0) {
                                this.$message({
                                    duration: 1500,
                                    showClose: true,
                                    type: 'warning',
                                    message: this.$t(this.$msg[res.data.status])
                                })
                            } else {
                                this.$message({
                                    message: this.$t('删除成功'),
                                    type: 'success',
                                    duration: 1000,
                                    showClose: true,
                                })
                                this.refreshSourceGroup()
                                this.selectTreeGroup = null
                            }
                        }).catch((err) => { console.error(err) })
                    }).catch(() => { })
                }
            },

            /**
             * 获取树形结构当前被选中的子节点
             */
            sourcegroupSelectChange: function(data, node) {
                this.selectTreeGroup = data
            },

            /**
             * 删除信号源
             */
            handleDelSource: function() {
                let selectNodeSource = this.$refs['system-signaltree'].getCheckedNodes()
                if(0 === selectNodeSource.length) {
                    this.$message({
                        message: this.$t('请先选择信号源'),
                        type: 'warning',
                        duration: 3000,
                        showClose: true,
                    })
                } else {
                    let ids = []
                    let groupID = null
                    for (var i = 0; i < selectNodeSource.length; i++) {
                        if(i == 0) {
                            groupID = selectNodeSource[i].ParentID
                        } else {
                            if(groupID !== selectNodeSource[i].ParentID) {
                                this.$message({
                                    message: this.$t('请先只选择同一个分组里面的信源'),
                                    type: 'warning',
                                    duration: 3000,
                                    showClose: true,
                                })
                                return
                            }
                        }
                        ids.push(selectNodeSource[i].ID)
                    }
                    this.$confirm(this.$t('此操作将永久删除该信源, 是否继续?'), this.$t('提示'), {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'warning',
                        closeOnClickModal: false
                    }).then(() => {
                        let url = '/api.v2.do.source.rmFromType'
                        let params = {
                            "userid": this.$auth.getuid(),
                            "body": {
                                "GroupID": groupID,
                                "ID": ids
                            }
                        }
                        this.$http(url, JSON.stringify(params)).then(res => {
                            if(res.data.status !== 0) {
                                this.$message({
                                     duration: 1500,
                                     showClose: true,
                                    'type': 'warning',
                                    'message': this.$t(this.$msg[res.data.status])
                                })
                            } else {
                                this.$message({
                                    message: this.$t('删除成功'),
                                    type: 'success',
                                    duration: 1000,
                                    showClose: true,
                                })
                                this.refreshSourceGroup()
                            }
                        }).catch((err) => { console.error(err) })
                    }).catch(() => { })
                }
            },

            /**
             * [listToTree 把列表转成树]
             * @param  {[Array]} rows [列表源]
             * @return {[Array]}      [tree]
             */
            listToTree: function(rows){
                function exists(rows, parentId){
                    for(var i = 0; i < rows.length; i++){
                        if (rows[i].ID && rows[i].ID === parentId) return true;
                    }
                    return false;
                }

                var nodes = [];
                // get the top level nodes
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    if (!exists(rows, row.ParentID)){
                        nodes.push({
                            ID: row.ID,
                            ParentID: row.ParentID,
                            Type: row.Type,
                            Name: row.Name,
                            Url: row.Url,
                            isLeaf: (row.Type == 1) ? true : false,
                            hideNodeCheckbox: (row.Type == 1) ? true : false,
                            Children: row.Children,
                        });
                    }
                }

                var toDo = [];
                for (var i = 0; i < nodes.length; i++){
                    toDo.push(nodes[i]);
                }

                while (toDo.length){
                    var node = toDo.shift();    // the parent node
                    // get the children nodes
                    for(var i = 0; i < rows.length; i++){
                        var row = rows[i];
                        if (row.ParentID == node.ID){
                            if (row.Type === 1) {
                                var child = {
                                    ID: row.ID,
                                    ParentID: row.ParentID,
                                    Type: row.Type,
                                    Name: row.Name,
                                    hideNodeCheckbox: true,
                                    isLeaf: false,
                                    Children: row.Children,
                                }
                            } else {
                                var child = {
                                    ID: row.ID,
                                    ParentID: row.ParentID,
                                    Url: row.Url,
                                    Type: row.Type,
                                    Name: row.Name,
                                    hideNodeCheckbox: false,
                                    isLeaf: true,
                                    Children: row.Children,
                                }
                            }

                            if (node.Children){
                                node.Children.push(child);
                            } else {
                                node.Children = [child];
                            }
                            node.Children && node.Children.sort(function(next, prev) {
                                return next['Type'] > prev['Type']
                            })
                            toDo.push(child);
                        }
                    }
                }
                return nodes;
            },
        }
    }
</script>

<style lang="less">
.signaltable{
    background: pink;
    .el-table__body-wrapper{
        background: #0c1917;
    }
}
    .signaltable_table{
        .el-table__row{
            background:#0c1719;
            color:#ccc;
            .is-checked{
                .el-checkbox__inner{
                    background-color:brown;
                    border-color:brown;
                }
            }
            &:hover{
                background:rgb(83, 11, 11);
            }
            &:active{
                background:rgb(161, 15, 15);
            }
            &:focus{
                background:orange;
            }
        }
        // .el-table__row:hover{
        //     background:rgb(83, 11, 11);
        // }
        // .el-table__row:focus{
        //     background:black;
        // }
    }
    .el-tree-node__children{
        .el-tree-node__content{
            // background: red;
        }
        //  .el-tree-node__content:hover{
        //         background: green;
        //     }
    }
    .el-tree-node__content:hover{
				color: #000!important;
				background:darkslategray!important;
            }
            .el-tree-node__content:active{
				color: #000!important;
				background: #7e7e7e!important;
            }
            .is-current:focus{
                // background: #7e7e7e!important;
                .el-tree-node__content{
                    // background: #7e7e7e!important;
                }
            }
            .is-current>.el-tree-node__content{
                background: #7e7e7e!important;
            }
            .el-tree-node:focus>.el-tree-node__content{
                background: #7e7e7e!important;  
            }
</style>

