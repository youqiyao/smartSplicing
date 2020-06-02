webpackJsonp([9],{

/***/ 403:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(865)
__webpack_require__(864)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(588),
  /* template */
  __webpack_require__(897),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\system\\systemsetting\\signalsource.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] signalsource.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-458abbf9", Component.options)
  } else {
    hotAPI.reload("data-v-458abbf9", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 588:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'signalsource',
    components: {},
    data: function data() {
        return {
            defaultProps: {
                children: 'Children', //指定子树节点的值
                label: 'Name' //指定节点标签为分组信源名称
            },

            filterText: '', //左边信号源分组搜索的关键字
            sourcegroup: [], //信号源分组
            selectTreeGroup: null, //左边被选中的信号源

            filterSignalData: '', //右边信号源搜索的关键字
            source: [], //信号源数据
            selectedSource: null //右边被选中的信号源
        };
    },

    computed: {
        /**
         * 计算过滤筛选出的信源数据
         */
        sourceData: function sourceData() {
            var _this = this;

            if (!this.filterSignalData) {
                return this.source;
            }
            return this.source.filter(function (val) {
                return val.Name.indexOf(_this.filterSignalData) !== -1;
            });
        }
    },
    created: function created() {
        this.getsource(0, 0);
        this.getsourcegroup(0, 0);
    },

    watch: {
        filterText: function filterText(val, oldVal) {
            this.$refs['system-signaltree'].filter(val);
        }
    },
    methods: {
        /**
         * 搜索树节点
         * @param  {[type]} value [description]
         * @param  {[type]} data  [description]
         * @return {[type]}       [description]
         */
        rowStyle: function rowStyle(_ref) {
            var row = _ref.row,
                rowIndex = _ref.rowIndex;

            console.log('row=====', row);
            console.log('rowIndex=====', rowIndex);
            if (rowIndex === 0) {
                return '';
            } else {
                return '';
            }
        },

        filterSignalNode: function filterSignalNode(value, data) {
            if (!value) return true;
            return data.Name.indexOf(value) !== -1;
        },
        /**
         * [获取信源分组信息]
         * @param  {[type]} start [description]
         * @param  {[type]} limit [description]
         * @return {[type]}       [description]
         */
        getsourcegroup: function getsourcegroup(start, limit) {
            var _this2 = this;

            var url = '/api.v2.do.sourcegroup.get';
            var params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": start,
                    "limit": limit
                }
            };
            this.$http(url, params).then(function (res) {
                if (res.data.status !== 0) {
                    _this2.$message({
                        'showClose': 'true',
                        'duration': '1500',
                        'type': 'warning',
                        'message': _this2.$t(_this2.$msg[res.data.status])
                    });
                    return;
                }
                if (!res.data.msg) {
                    _this2.sourcegroup = [];
                    return;
                }
                _this2.sourcegroup = _this2.listToTree(res.data.msg.body);
            }).catch(function (err) {});
        },

        /**
         * 信源列表 、pid参数预留 先不云掉 ，
         * @param parentId
         */
        getsource: function getsource(start, limit) {
            var _this3 = this;

            //如果是子节点、并且处于打开状态 则收缩
            var url = '/api.v2.do.source.get';
            var params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": start,
                    "limit": limit
                }
            };
            this.$http(url, params).then(function (res) {
                if (res.data.status !== 0) {
                    _this3.$message({
                        'showClose': 'true',
                        'duration': '1500',
                        'type': 'warning',
                        'message': _this3.$t(_this3.$msg[res.data.status])
                    });
                    return;
                }
                if (!res.data.msg) {
                    _this3.source = [];
                    return;
                }
                _this3.source = res.data.msg.body;
            }).catch(function (err) {
                console.error(err);
            });
        },

        /**
         * [refreshSource 刷新信源列表]
         * @return {[type]} [description]
         */
        refreshSource: function refreshSource() {
            this.getsource(0, 0);
            this.selectedSource = null;
        },
        /*
         * 当前被选中的右边信号源
         */
        sourceSelectChange: function sourceSelectChange(selection) {
            if (selection.length === 0) {
                this.selectedSource = null;
            } else {
                this.selectedSource = selection;
            }
        },
        /*
         * 右边被选中的信号源添加到左边信源分组中
         */
        addToSourceGroup: function addToSourceGroup() {
            var _this4 = this;

            if (null === this.selectTreeGroup) {
                this.$message({
                    message: this.$t('请先选择分组'),
                    type: 'warning',
                    duration: 3000,
                    showClose: true
                });
            } else if (this.selectedSource === null) {
                this.$message({
                    message: this.$t('请先选择信号源'),
                    type: 'warning',
                    duration: 3000,
                    showClose: true
                });
            } else {
                var ids = [];
                for (var i = 0; i < this.selectedSource.length; i++) {
                    ids.push(this.selectedSource[i].ID);
                }
                var url = '/api.v2.do.source.addtotype';
                var params = {
                    "userid": this.$auth.getuid(),
                    "body": {
                        "GroupID": this.selectTreeGroup.ID,
                        "ID": ids
                    }
                };
                this.$confirm(this.$t('确定将所选信源添加到') + '<' + this.selectTreeGroup.Name + '>?', this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning'
                }).then(function () {
                    _this4.$http(url, params).then(function (res) {
                        if (res.data.status !== 0) {
                            _this4.$message({
                                'showClose': 'true',
                                'type': 'warning',
                                'message': _this4.$t(_this4.$msg[res.data.status])
                            });
                        } else {
                            _this4.$message({
                                message: _this4.$t('添加成功'),
                                type: 'success',
                                duration: 1000,
                                showClose: true
                            });
                            _this4.refreshSourceGroup();
                        }
                    }).catch(function (err) {
                        console.error(err);
                    });
                }).catch(function (err) {});
            }
        },
        /*
         * 右边被选中的信号源删除
         */
        DelSource: function DelSource() {
            var _this5 = this;

            if (this.selectedSource === null) {
                this.$message({
                    message: this.$t('请先选择信号源'),
                    type: 'warning',
                    duration: 3000,
                    showClose: true
                });
            } else {
                var ids = [];
                var groupID = null;
                for (var i = 0; i < this.selectedSource.length; i++) {
                    ids.push(this.selectedSource[i].ID);
                }
                this.$confirm(this.$t('此操作将永久删除该信源, 是否继续?'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning',
                    closeOnClickModal: false
                }).then(function () {
                    var url = '/api.v2.do.source.rmFromType';
                    var params = {
                        "userid": _this5.$auth.getuid(),
                        "body": {
                            "GroupID": groupID,
                            "ID": ids
                        }
                    };
                    _this5.$http(url, JSON.stringify(params)).then(function (res) {
                        if (res.data.status !== 0) {
                            _this5.$message({
                                duration: 1500,
                                showClose: true,
                                'type': 'warning',
                                'message': _this5.$t(_this5.$msg[res.data.status])
                            });
                        } else {
                            _this5.$message({
                                message: _this5.$t('删除成功'),
                                type: 'success',
                                duration: 1000,
                                showClose: true
                            });
                            _this5.refreshSource();
                        }
                    }).catch(function (err) {
                        console.error(err);
                    });
                }).catch(function () {});
            }
        },

        /**
         * [refreshSourceGroup 刷新信号源分组列表]
         * @return {[type]} [description]
         */
        refreshSourceGroup: function refreshSourceGroup() {
            this.getsourcegroup(0, 0);
        },

        /**
         * [addSourceGroup 新建分组]
         */
        addSourceGroup: function addSourceGroup() {
            var _this6 = this;

            if (null === this.selectTreeGroup || this.selectTreeGroup.Type !== 1) {
                this.$message({
                    message: this.$t('请先选择分组'),
                    type: 'warning',
                    duration: 3000,
                    showClose: true
                });
            } else if (this.selectTreeGroup.ID === 4294967295) {
                this.$message({
                    message: this.$('未分组下不可新建分组'),
                    type: 'warning',
                    duration: 3000,
                    showClose: true
                });
            } else {
                this.$prompt(' ', this.$t('新建分组'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    closeOnClickModal: false,
                    inputPlaceholder: this.$t('请输入分组名称'),
                    inputValidator: this.$t(function (value) {
                        if (value.length > 12 || value.length == 0) return this.$t('请输入1~12位长度的名称');
                    })
                }).then(function (_ref2) {
                    var value = _ref2.value;

                    var url = '/api.v2.do.sourcegroup.add';
                    var params = {
                        "userid": _this6.$auth.getuid(),
                        "body": {
                            "ParentID": _this6.selectTreeGroup.ID,
                            "Name": value
                        }
                    };
                    _this6.$http(url, params).then(function (res) {
                        if (res.data.status != 0) {
                            _this6.$message({
                                'type': 'warning',
                                'message': _this6.$msg[res.data.status],
                                'showClose': true,
                                'duration': 1500
                            });
                        } else {
                            _this6.$message({
                                duration: 1500,
                                showClose: true,
                                type: 'success',
                                message: _this6.$t('添加成功')
                            });
                            _this6.refreshSourceGroup();
                        }
                    }).catch(function (err) {
                        console.error(err);
                    });
                }).catch(function (err) {});
            }
        },

        /**
         * 编辑信源分组或者信源
         */
        editSourceGroup: function editSourceGroup() {
            var _this7 = this;

            if (null === this.selectTreeGroup) {
                this.$message({
                    message: this.$t('请先选择分组或信源'),
                    type: 'warning',
                    duration: 3000,
                    showClose: true
                });
                return;
            }
            if (this.selectTreeGroup.Type == 1) {
                var message_title = this.$t('编辑分组');
                var url = '/api.v2.do.sourcegroup.edit';
            } else {
                var message_title = this.$t('编辑信源');
                var url = '/api.v2.do.source.edit';
            }
            this.$prompt(' ', message_title, {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                closeOnClickModal: false,
                inputValue: this.selectTreeGroup.Name,
                inputValidator: this.$t(function (value) {
                    if (message_title == _this7.$t('编辑分组') && value.length > 12 || message_title == _this7.$t('编辑分组') && value.length == 0) {
                        return _this7.$t('请输入长度为1~12位的名称');
                    }
                })
            }).then(function (_ref3) {
                var value = _ref3.value;

                var params = {
                    'userid': _this7.$auth.getuid(),
                    'body': {
                        'ID': _this7.selectTreeGroup.ID,
                        'Name': value
                    }
                };
                _this7.$http(url, params).then(function (res) {
                    if (res.data.status != 0) {
                        _this7.$message({
                            'type': 'warning',
                            'message': _this7.$t(_this7.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        });
                    } else {
                        _this7.$message({
                            'type': 'success',
                            'message': _this7.$t('操作成功'),
                            'showClose': true,
                            'duration': 1500
                        });
                        _this7.refreshSourceGroup();
                    }
                }).catch(function (err) {
                    console.error(err);
                });
            }).catch(function () {});
        },

        /**
         * 删除信源分组
         */
        handleDelSourceGroup: function handleDelSourceGroup() {
            var _this8 = this;

            if (null === this.selectTreeGroup || this.selectTreeGroup.Type !== 1) {
                this.$message({
                    message: this.$t('请先选择要删除的分组'),
                    type: 'warning',
                    duration: 3000,
                    showClose: true
                });
            } else if (0 == this.selectTreeGroup.ParentID) {
                this.$message({
                    message: this.$t('该分组不能被删除'),
                    type: 'warning',
                    duration: 3000,
                    showClose: true
                });
            } else {
                this.$confirm(this.$t('此操作将永久删除该分组, 是否继续?'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning',
                    closeOnClickModal: false
                }).then(function () {
                    var url = '/api.v2.do.sourcegroup.del';
                    var params = {
                        "userid": _this8.$auth.getuid(),
                        "body": {
                            "ID": _this8.selectTreeGroup.ID
                        }
                    };
                    _this8.$http(url, params).then(function (res) {
                        if (res.data.status !== 0) {
                            _this8.$message({
                                duration: 1500,
                                showClose: true,
                                type: 'warning',
                                message: _this8.$t(_this8.$msg[res.data.status])
                            });
                        } else {
                            _this8.$message({
                                message: _this8.$t('删除成功'),
                                type: 'success',
                                duration: 1000,
                                showClose: true
                            });
                            _this8.refreshSourceGroup();
                            _this8.selectTreeGroup = null;
                        }
                    }).catch(function (err) {
                        console.error(err);
                    });
                }).catch(function () {});
            }
        },

        /**
         * 获取树形结构当前被选中的子节点
         */
        sourcegroupSelectChange: function sourcegroupSelectChange(data, node) {
            this.selectTreeGroup = data;
        },

        /**
         * 删除信号源
         */
        handleDelSource: function handleDelSource() {
            var _this9 = this;

            var selectNodeSource = this.$refs['system-signaltree'].getCheckedNodes();
            if (0 === selectNodeSource.length) {
                this.$message({
                    message: this.$t('请先选择信号源'),
                    type: 'warning',
                    duration: 3000,
                    showClose: true
                });
            } else {
                var ids = [];
                var groupID = null;
                for (var i = 0; i < selectNodeSource.length; i++) {
                    if (i == 0) {
                        groupID = selectNodeSource[i].ParentID;
                    } else {
                        if (groupID !== selectNodeSource[i].ParentID) {
                            this.$message({
                                message: this.$t('请先只选择同一个分组里面的信源'),
                                type: 'warning',
                                duration: 3000,
                                showClose: true
                            });
                            return;
                        }
                    }
                    ids.push(selectNodeSource[i].ID);
                }
                this.$confirm(this.$t('此操作将永久删除该信源, 是否继续?'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning',
                    closeOnClickModal: false
                }).then(function () {
                    var url = '/api.v2.do.source.rmFromType';
                    var params = {
                        "userid": _this9.$auth.getuid(),
                        "body": {
                            "GroupID": groupID,
                            "ID": ids
                        }
                    };
                    _this9.$http(url, JSON.stringify(params)).then(function (res) {
                        if (res.data.status !== 0) {
                            _this9.$message({
                                duration: 1500,
                                showClose: true,
                                'type': 'warning',
                                'message': _this9.$t(_this9.$msg[res.data.status])
                            });
                        } else {
                            _this9.$message({
                                message: _this9.$t('删除成功'),
                                type: 'success',
                                duration: 1000,
                                showClose: true
                            });
                            _this9.refreshSourceGroup();
                        }
                    }).catch(function (err) {
                        console.error(err);
                    });
                }).catch(function () {});
            }
        },

        /**
         * [listToTree 把列表转成树]
         * @param  {[Array]} rows [列表源]
         * @return {[Array]}      [tree]
         */
        listToTree: function listToTree(rows) {
            function exists(rows, parentId) {
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].ID && rows[i].ID === parentId) return true;
                }
                return false;
            }

            var nodes = [];
            // get the top level nodes
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (!exists(rows, row.ParentID)) {
                    nodes.push({
                        ID: row.ID,
                        ParentID: row.ParentID,
                        Type: row.Type,
                        Name: row.Name,
                        Url: row.Url,
                        isLeaf: row.Type == 1 ? true : false,
                        hideNodeCheckbox: row.Type == 1 ? true : false,
                        Children: row.Children
                    });
                }
            }

            var toDo = [];
            for (var i = 0; i < nodes.length; i++) {
                toDo.push(nodes[i]);
            }

            while (toDo.length) {
                var node = toDo.shift(); // the parent node
                // get the children nodes
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (row.ParentID == node.ID) {
                        if (row.Type === 1) {
                            var child = {
                                ID: row.ID,
                                ParentID: row.ParentID,
                                Type: row.Type,
                                Name: row.Name,
                                hideNodeCheckbox: true,
                                isLeaf: false,
                                Children: row.Children
                            };
                        } else {
                            var child = {
                                ID: row.ID,
                                ParentID: row.ParentID,
                                Url: row.Url,
                                Type: row.Type,
                                Name: row.Name,
                                hideNodeCheckbox: false,
                                isLeaf: true,
                                Children: row.Children
                            };
                        }

                        if (node.Children) {
                            node.Children.push(child);
                        } else {
                            node.Children = [child];
                        }
                        node.Children && node.Children.sort(function (next, prev) {
                            return next['Type'] > prev['Type'];
                        });
                        toDo.push(child);
                    }
                }
            }
            return nodes;
        }
    }
});

/***/ }),

/***/ 864:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 865:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 897:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "signalsource"
  }, [_c('el-row', {
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "gutter": 16
    }
  }, [_c('el-col', {
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "span": 24
    }
  }, [_c('div', {
    staticClass: "maintitle"
  }, [_c('p', [_vm._v(_vm._s(_vm.$t('信号源分组列表')))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.$t('对信号进行统一的分类管理')))])]), _vm._v(" "), _c('div', {
    staticStyle: {
      "width": "31%",
      "float": "left",
      "height": "100%"
    }
  }, [_c('div', {
    staticClass: "signaltreetools"
  }, [_c('el-button', {
    staticClass: "table-btn bg-w",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.refreshSource
    }
  }, [_c('i', {
    staticClass: "fa fa-refresh"
  })]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.addSourceGroup
    }
  }, [_c('i', {
    staticClass: "el-icon-plus mar-rig"
  }), _vm._v(_vm._s(_vm.$t('新建')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.editSourceGroup
    }
  }, [_c('i', {
    staticClass: "el-icon-edit mar-rig"
  }), _vm._v(_vm._s(_vm.$t('编辑')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.handleDelSourceGroup
    }
  }, [_c('i', {
    staticClass: "el-icon-delete mar-rig"
  }), _vm._v(_vm._s(_vm.$t('删除分组')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.handleDelSource
    }
  }, [_c('i', {
    staticClass: "el-icon-delete mar-rig"
  }), _vm._v(_vm._s(_vm.$t('移除信源')))])], 1), _vm._v(" "), _c('div', {
    staticClass: "signaltree"
  }, [_c('el-input', {
    attrs: {
      "placeholder": _vm.$t('输入关键字进行过滤')
    },
    model: {
      value: (_vm.filterText),
      callback: function($$v) {
        _vm.filterText = $$v
      },
      expression: "filterText"
    }
  }), _vm._v(" "), _c('Tree', {
    ref: "system-signaltree",
    attrs: {
      "data": _vm.sourcegroup,
      "props": _vm.defaultProps,
      "node-key": "ID",
      "show-checkbox": "",
      "check-strictly": "",
      "default-expand-all": "",
      "highlight-current": "",
      "filter-node-method": _vm.filterSignalNode
    },
    on: {
      "current-change": _vm.sourcegroupSelectChange
    }
  })], 1)]), _vm._v(" "), _c('div', {
    staticStyle: {
      "width": "68%",
      "height": "100%",
      "float": "right"
    }
  }, [_c('div', {
    staticClass: "signaltreetools"
  }, [_c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.addToSourceGroup
    }
  }, [_c('i', {
    staticClass: "el-icon-plus mar-rig"
  }), _vm._v(_vm._s(_vm.$t('添加')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.DelSource
    }
  }, [_c('i', {
    staticClass: "el-icon-delete mar-rig"
  }), _vm._v(_vm._s(_vm.$t('删除信源')))])], 1), _vm._v(" "), _c('div', {
    staticClass: "signaltable"
  }, [_c('el-input', {
    attrs: {
      "placeholder": _vm.$t('输入关键字进行过滤')
    },
    model: {
      value: (_vm.filterSignalData),
      callback: function($$v) {
        _vm.filterSignalData = $$v
      },
      expression: "filterSignalData"
    }
  }), _vm._v(" "), _c('el-table', {
    staticClass: "signaltable_table",
    attrs: {
      "row-style": _vm.rowStyle,
      "borber": "",
      "highlight-row": "",
      "data": _vm.sourceData
    },
    on: {
      "selection-change": _vm.sourceSelectChange
    }
  }, [_c('el-table-column', {
    attrs: {
      "width": "60",
      "align": "center",
      "type": "selection"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "Name",
      "label": _vm.$t('信源名称'),
      "align": "left"
    }
  })], 1)], 1)])])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-458abbf9", module.exports)
  }
}

/***/ })

});
//# sourceMappingURL=9.chunk.js.map