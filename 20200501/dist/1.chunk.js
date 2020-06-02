webpackJsonp([1],{

/***/ 396:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(855)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(575),
  /* template */
  __webpack_require__(895),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\screen\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3a0d0757", Component.options)
  } else {
    hotAPI.reload("data-v-3a0d0757", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 575:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_header__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_header___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_header__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__screen__ = __webpack_require__(877);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__screen___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__screen__);
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        LayoutHeader: __WEBPACK_IMPORTED_MODULE_0__components_header___default.a, Screen: __WEBPACK_IMPORTED_MODULE_1__screen___default.a
    }
});

/***/ }),

/***/ 576:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__libs_auth__ = __webpack_require__(21);
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
    data: function data() {
        return {
            modal: false,
            screenData: null,
            nodeList: [], //所有节点列表
            allBindNodeList: [], //所有已绑定节点列表
            dragItemIndex: null
        };
    },

    computed: {
        /**
         * [screenGridStyle 网格样式大小]
         * @return {[type]} [description]
         */
        screenGridStyle: function screenGridStyle() {
            var rows = void 0,
                columns = void 0;
            if (this.screenData.IsLed) {
                rows = Math.ceil(this.screenData.LedH / this.screenData.UintH);
                columns = Math.ceil(this.screenData.LedW / this.screenData.UintW);
            } else {
                rows = this.screenData.Rows;
                columns = this.screenData.Columns;
            }

            var obj = {};
            if (this.screenData == null) return obj;
            if (rows) obj.height = Math.floor(1 / rows * 10000) / 100 + '%';
            if (columns) obj.width = Math.floor(1 / columns * 10000) / 100 + '%';
            return obj;
        },

        screenBindInfo: function screenBindInfo() {
            if (this.screenData === null) return [];
            var items = [];
            var rows = void 0,
                columns = void 0;
            if (this.screenData.IsLed) {
                rows = Math.ceil(this.screenData.LedH / this.screenData.UintH);
                columns = Math.ceil(this.screenData.LedW / this.screenData.UintW);
            } else {
                rows = this.screenData.Rows;
                columns = this.screenData.Columns;
            }

            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    var item = this.getSreenNodeData(i, j);
                    items.push(item);
                }
            }
            return items;
        },

        avaibleNodeList: function avaibleNodeList() {
            return this.nodeList.filter(function (v) {
                return v.IsBind === 0;
            });
        }
    },
    methods: {
        /**
         * [_setmodal 设置显示隐藏]
         * @param  {[type]} status [description]
         * @return {[type]}        [description]
         */
        _setmodal: function _setmodal(status) {
            this.modal = status;
        },

        /**
         * [_setData 设置屏组数据]
         * @param {[type]} data [description]
         */
        _setData: function _setData(data) {
            this.screenData = data;
            this.resetOtherData();
        },

        /**
         * [resetOtherInfo 重新设置其他的数据]
         * @return {[type]} [description]
         */
        resetOtherData: function resetOtherData() {
            this.nodeList = [];
            this.allBindNodeList = [];

            this.list();
            this.getAllScreenNodeInfo();
        },

        /**
         * [getSreenNodeIP 获取屏组某一个屏的绑定IP]
         * @param  {[type]} row    [description]
         * @param  {[type]} column [description]
         * @return {[type]}        [description]
         */
        getSreenNodeData: function getSreenNodeData(row, column) {
            var data = {
                'WallID': this.screenData.ID,
                'Row': row,
                'Column': column,
                'IP': ''
            };
            for (var i = 0; i < this.allBindNodeList.length; i++) {
                if (this.allBindNodeList[i].WallID == this.screenData.ID && this.allBindNodeList[i].Row == row && this.allBindNodeList[i].Column == column) {
                    data.IP = this.allBindNodeList[i].IP;
                }
            }
            return data;
        },

        /**
         * [list 获取所有的节点]
         * @param  {[type]} start [description]
         * @param  {[type]} limit [description]
         * @return {[type]}       [description]
         */
        list: function list() {
            var _this = this;

            var url = '/api.v2.do.node.get',
                params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": 0,
                    "limit": 0
                }
            };
            this.$http(url, JSON.stringify(params)).then(function (res) {
                if (res.data.status !== 0) {
                    _this.$message({
                        'type': 'warning',
                        'message': _this.$t(_this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    });
                    return;
                }
                if (!res.data.msg) {
                    _this.nodeList = [];
                    return;
                }
                _this.nodeList = res.data.msg.body;
            }).catch(function (err) {
                console.log(err);
            });
        },

        /**
         * 获取所有屏组已绑定的节点
         */
        getAllScreenNodeInfo: function getAllScreenNodeInfo() {
            var _this2 = this;

            var url = '/api.v2.do.nodeBind.get',
                params = {
                "userid": this.$auth.getuid(),
                "page": {
                    "start": 0,
                    "limit": 0
                }
            };
            this.$http(url, params).then(function (res) {
                if (res.data.status !== 0) {
                    _this2.$message({
                        'type': 'warning',
                        'message': _this2.$t(_this2.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    });
                    return;
                }
                if (!res.data.msg) {
                    _this2.allBindNodeList = [];
                    return;
                }
                _this2.allBindNodeList = res.data.msg.body;
            }).catch(function (err) {
                console.error(err);
            });
        },


        handleUnbindNode: function handleUnbindNode(item) {
            var _this3 = this;

            if (!item.IP) return;
            var url = '/api.v2.do.nodeBind.del',
                params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "IP": item.IP
                }
            };
            this.$http(url, params).then(function (res) {
                if (res.data.status !== 0) {
                    _this3.$message({
                        'type': 'warning',
                        'message': _this3.$t(_this3.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    });
                } else {
                    _this3.$message({
                        'message': _this3.$t('解绑成功'),
                        'type': 'success',
                        'showClose': true,
                        'duration': 1500
                    });
                    _this3.getAllScreenNodeInfo();
                    _this3.list();
                }
            }).catch(function (err) {
                console.error(err);
            });
        },

        bindNode: function bindNode(obj) {
            var _this4 = this;

            var url = '/api.v2.do.nodeBind.add',
                params = {
                userid: this.$auth.getuid(),
                body: obj
            };
            this.$http(url, params).then(function (res) {
                if (res.data.status !== 0) {
                    _this4.$message({
                        'type': 'warning',
                        'message': _this4.$t(_this4.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    });
                    return;
                }
                _this4.dragItemIndex = null;
                _this4.list();
                _this4.getAllScreenNodeInfo();
            }).catch(function (err) {
                console.error(err);
            });
        },


        dragstart: function dragstart(event, item, index) {
            var _this5 = this;

            this.dragItemIndex = index;
            var url = '/api.v2.do.node.select',
                params = {
                userid: this.$auth.getuid(),
                body: {
                    IP: item.IP,
                    Select: 1
                }
            };
            this.$http(url, JSON.stringify(params)).then(function (res) {
                if (res.data.status !== 0) {
                    _this5.$message({
                        'type': 'warning',
                        'message': _this5.$t(_this5.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    });
                }
            }).catch(function (err) {});
        },

        dragend: function dragend(event, item, index) {
            var _this6 = this;

            this.dragItemIndex = index;
            var url = '/api.v2.do.node.select',
                params = {
                userid: this.$auth.getuid(),
                body: {
                    IP: item.IP,
                    Select: 0
                }
            };
            this.$http(url, JSON.stringify(params)).then(function (res) {
                if (res.data.status !== 0) {
                    _this6.$message({
                        'type': 'warning',
                        'message': _this6.$t(_this6.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    });
                }
            }).catch(function (err) {});
        },

        drop: function drop(event, item) {
            event.preventDefault();
            if (item.IP) {
                this.$message({
                    'message': this.$t('节点已绑定，请先解绑'),
                    'type': 'warning',
                    'showClose': true,
                    'duration': 1500
                });
                return;
            }
            var data = {
                WallID: item.WallID,
                Row: item.Row,
                Column: item.Column,
                IP: this.avaibleNodeList[this.dragItemIndex].IP
            };
            this.bindNode(data);
        },

        allowDrop: function allowDrop(event) {
            event.preventDefault();
        }
    }
});

/***/ }),

/***/ 577:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__screenform_vue__ = __webpack_require__(878);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__screenform_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__screenform_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__nodesetting_vue__ = __webpack_require__(876);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__nodesetting_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__nodesetting_vue__);
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
    name: 'screen',
    components: { ScreenForm: __WEBPACK_IMPORTED_MODULE_0__screenform_vue___default.a, NodeSetting: __WEBPACK_IMPORTED_MODULE_1__nodesetting_vue___default.a },
    data: function data() {
        return {
            data: [], //列表数据
            total: 0, //列表总条数
            current: 1, //当前页
            pagesize: 10, //每页显示多少条
            curId: null
        };
    },
    created: function created() {
        // 页面初始化
        this.list(0, this.pagesize);
    },


    methods: {
        /**
         * 取分页列表数据
         * @param  {[type]} start [description]
         * @param  {[type]} limit [description]
         * @return {[type]}       [description]
         */
        list: function list(start, limit) {
            var _this = this;

            var url = '/api.v2.do.screen.get',
                params = {
                "userid": this.$auth.getuid(),
                "page": { "start": start, "limit": limit }
            };
            this.$http(url, JSON.stringify(params)).then(function (res) {
                if (res.data.status !== 0) {
                    _this.$message({
                        'type': 'warning',
                        'message': _this.$t(_this.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    });
                }
                if (!res.data.msg) {
                    _this.total = 0;
                    _this.data = [];
                    return;
                }
                _this.total = res.data.msg.count;
                _this.data = res.data.msg.body;
            }).catch(function (err) {
                console.log(err);
            });
        },

        formatterResolution: function formatterResolution(row, column, cellValue) {
            return row.UintW + ' x ' + row.UintH;
        },

        formatterLed: function formatterLed(row, column, cellValue) {
            return row.IsLed ? this.$t('是') : this.$t('否');
        },

        formatterRowColumn: function formatterRowColumn(row, column, cellValue) {
            return row.Rows + ' x ' + row.Columns;
        },

        formatterGrids: function formatterGrids(row, column, cellValue) {
            return row.GridRows + ' x ' + row.GridColumns;
        },

        formatterDegree: function formatterDegree(row, column, cellValue) {
            switch (row.Degree) {
                case 0:
                    return '0°';
                case 1:
                    return '90°';
                case 2:
                    return '180°';
                case 3:
                    return '270°';
                default:
                    return '0°';
            }
        },

        // 切换页面查看数据
        onPageChange: function onPageChange(index) {
            this.current = index;
            this.refresh();
        },

        /**
         * 当前行发生变化时触发
         */
        curChange: function curChange(curRow, oldRow) {
            if (null != curRow) {
                this.curId = curRow.ID;
            }
        },

        /**
         *  * 刷新列表
         */
        refresh: function refresh() {
            var start = (this.current - 1) * this.pagesize,
                limit = this.pagesize;
            this.curId = null;
            this.list(start, limit);
        },

        /**
         * 打开 添加/编辑面板
         * @param op : operation 操作类型 ,添加 or编辑
         */
        openScreenForm: function openScreenForm(type) {
            if (type == 'edit' && this.curId == null) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('请先选择要编辑的屏组'),
                    'showClose': true,
                    'duration': 1500
                });
                return;
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
                };
                var title = this.$t('新建');
            } else {
                var data = this.getCurrentSelectScreen();
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
                };
                var title = this.$t('编辑');
            }

            this.$refs['screen_form']._setmodal(true);
            this.$refs['screen_form'].setFormData(formData, title, type);
        },

        handleForm: function handleForm(type, data, isNext) {
            var _this2 = this;

            if (type == 'add') {
                var url = '/api.v2.do.screen.add';
                var params = {
                    userid: this.$auth.getuid(),
                    body: {
                        Name: data.Name,
                        Rows: data.IsLed == '1' ? 0 : parseInt(data.Rows),
                        Columns: data.IsLed == '1' ? 0 : parseInt(data.Columns),
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
                };
            } else {
                var url = '/api.v2.do.screen.edit';
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
                };
            }
            this.$http(url, params).then(function (res) {
                if (0 !== res.data.status) {
                    _this2.$message({
                        'type': 'warning',
                        'message': _this2.$t(_this2.$msg[res.data.status]),
                        'showClose': true,
                        'duration': 1500
                    });
                    return;
                }
                _this2.$message({
                    'type': 'success',
                    'message': _this2.$t('操作成功'),
                    'showClose': true,
                    'duration': 1500
                });
                _this2.refresh();
                _this2.$refs['screen_form']._setmodal(false);
                if (isNext) {}
            }).catch(function (err) {
                _this2.$message({
                    'type': 'error',
                    'message': _this2.$t('操作异常'),
                    'showClose': true,
                    'duration': 1500
                });
                return;
            });
        },

        /**
         * 节点绑定
         * @return {[type]} [description]
         */
        bindNode: function bindNode() {
            if (this.curId == null) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('请先选择屏组'),
                    'showClose': true,
                    'duration': 1500
                });
                return;
            }
            var data = this.getCurrentSelectScreen();
            this.openNodeSetting(data);
        },

        /**
         * 打开节点绑定
         */
        openNodeSetting: function openNodeSetting(data) {
            this.$refs['node_setting']._setmodal(true);
            this.$refs['node_setting']._setData(data);
        },

        /**
         * 设置屏组的代理IP
         */
        bindIp: function bindIp() {
            var _this3 = this;

            if (this.curId == null) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('请先选择屏组'),
                    'showClose': true,
                    'duration': 1500
                });
                return;
            }
            this.$prompt(' ', this.$t('设置代理IP'), {
                confirmButtonText: this.$t('保存'),
                cancelButtonText: this.$t('取消'),
                inputPlaceholder: this.$t('请输入代理IP地址'),
                inputPattern: /(((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))/,
                inputErrorMessage: this.$t('ip地址不正确')
            }).then(function (_ref) {
                var value = _ref.value;

                var url = '/api.v2.do.screen.setProxyIp';
                var params = {
                    'userid': _this3.$auth.getuid(),
                    'body': {
                        'ID': _this3.curId,
                        'IP': value
                    }
                };
                _this3.$http(url, JSON.stringify(params)).then(function (res) {
                    if (res.data.status != 0) {
                        _this3.$message({
                            'type': 'warning',
                            'message': _this3.$t(_this3.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        });
                        return;
                    }
                    _this3.$message({
                        'type': 'success',
                        'message': _this3.$t('设置成功'),
                        'showClose': true,
                        'duration': 1500
                    });
                }).catch(function (err) {
                    console.log(err);
                });
            }).catch(function (err) {});
        },

        /**
         * 删除屏组
         * @return {[type]} [description]
         */
        handleDel: function handleDel() {
            var _this4 = this;

            var vm = this;
            //此处处理删除操作
            if (!this.curId) {
                this.$message({
                    'type': 'warning',
                    'message': this.$t('请先选择需要删除的屏组'),
                    'showClose': true,
                    'duration': 1500
                });
                return;
            }
            this.$confirm(this.$t('此操作将永久删除该屏组, 是否继续?'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning',
                closeOnClickModal: false
            }).then(function () {
                var id = _this4.curId;
                var params = { "userid": vm.$auth.getuid(), "body": { "ID": id } };
                _this4.$http('/api.v2.do.screen.del', params).then(function (res) {
                    if (res.data.status != 0) {
                        _this4.$message({
                            'type': 'warning',
                            'message': _this4.$t(_this4.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        });
                        return;
                    }
                    _this4.$message({
                        'type': 'success',
                        'message': _this4.$t('删除成功!'),
                        'showClose': true,
                        'duration': 1500
                    });
                    _this4.refresh();
                }).catch(function (err) {
                    _this4.$message({
                        'type': 'warning',
                        'message': _this4.$t('删除失败!'),
                        'showClose': true,
                        'duration': 1500
                    });
                });
            }).catch(function () {
                _this4.$message({
                    'type': 'info',
                    'message': _this4.$t('已取消'),
                    'showClose': true,
                    'duration': 1500
                });
            });
        },

        //  获取选中当前行的数据
        getCurrentSelectScreen: function getCurrentSelectScreen() {
            var vm = this;
            var data = this.data.filter(function (value) {
                return value.ID === vm.curId;
            });
            return JSON.parse(JSON.stringify(data[0]));
        }
    },
    beforeDestory: function beforeDestory() {
        console.error(412);
    }
});

/***/ }),

/***/ 578:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data__ = __webpack_require__(597);
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
    name: 'screenform',
    data: function data() {
        var _this = this;

        var validateResolution = function validateResolution(rule, value, callback) {
            if (value === '') {
                callback(new Error(_this.$t('分辨率不能为空')));
            } else {
                var mailReg = /^[1-9][0-9]*\*[1-9][0-9]*$/;
                if (mailReg.test(value)) {
                    callback();
                } else {
                    callback(new Error(_this.$t('请输入正确的分辨率,如1902*1080')));
                }
            }
        };
        return {
            //弹窗属性
            modal: false,
            //分辨率
            resolutions: __WEBPACK_IMPORTED_MODULE_0__data__["a" /* default */].resolutions,
            //逻辑网格
            grids: __WEBPACK_IMPORTED_MODULE_0__data__["a" /* default */].grids,
            //旋转角度
            degrees: __WEBPACK_IMPORTED_MODULE_0__data__["a" /* default */].degrees,
            //表单数据
            formItem: {
                ID: '', Name: '', Rows: 4, Columns: 4, Resolution: '1920*1080', Grid: '4x4', Degree: 0, AudioX: 1, AudioY: 1, LedW: 0, LedH: 0, IsLed: 0
            },
            //表单验证
            formRules: {
                Name: [{ required: true, message: this.$t('请填写名称'), trigger: 'blur' }, { type: 'string', max: 12, message: this.$t('名称长度不能超过12位'), trigger: 'blur' }],
                Resolution: [{ validator: validateResolution, trigger: 'change' }]
            },
            op: 'add',
            title: ''
        };
    },


    methods: {
        abc: function abc() {
            console.error(this.op, this.formItem.IsLed, this.op == 'edit', !!this.formItem.IsLed);
            return op == 'edit' || !!formItem.IsLed;
        },

        /**
         * 显示弹窗， 由父级调用
         */
        _setmodal: function _setmodal(status) {
            this.modal = status;
        },

        setFormData: function setFormData(data, title, op) {
            this.op = op;
            this.title = title;
            this.formItem = data;
        },

        degreeChange: function degreeChange(newVal, oldVal) {
            if (parseInt(newVal) % 2 == 0) {
                if (this.formItem.Resolution == '1920*1080' || this.formItem.Resolution == '3840*2160') return;
            } else {
                if (this.formItem.Resolution == '1080*1920' || this.formItem.Resolution == '2160*3840') return;
            }
            if (this.formItem.Resolution) var reso = this.formItem.Resolution.split('*');
            if (!reso || reso.constructor != Array || reso.length != 2) return;
            this.formItem.Resolution = reso[1] + '*' + reso[0];
        },

        handleSubmit: function handleSubmit(name, isNext) {
            var _this2 = this;

            this.$refs[name].validate(function (valid) {
                if (valid) {
                    _this2.$emit('formsubmit', _this2.op, _this2.formItem, isNext);
                }
            });
        }
    }
});

/***/ }),

/***/ 597:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    resolutions: [{ label: '1920*1080', value: '1920*1080', rotato: false }, { label: '1080*1920', value: '1080*1920', rotato: true }, { label: '3840*2160', value: '3840*2160', rotato: false }, { label: '2160*3840', value: '2160*3840', rotato: true }],
    //逻辑网格
    grids: [{ label: '0 x 0', value: '0x0' }, { label: '1 x 1', value: '1x1' }, { label: '2 x 2', value: '2x2' }, { label: '3 x 3', value: '3x3' }, { label: '4 x 4', value: '4x4' }, { label: '5 x 5', value: '5x5' }, { label: '6 x 6', value: '6x6' }, { label: '7 x 7', value: '7x7' }, { label: '8 x 8', value: '8x8' }],
    //旋转角度
    degrees: [{ label: '0°', value: 0 }, { label: '90°', value: 1 }, { label: '180°', value: 2 }, { label: '270°', value: 3 }]
});

/***/ }),

/***/ 855:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 863:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 868:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 876:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(863)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(576),
  /* template */
  __webpack_require__(896),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\screen\\nodesetting.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] nodesetting.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3d46b4d3", Component.options)
  } else {
    hotAPI.reload("data-v-3d46b4d3", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 877:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(868)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(577),
  /* template */
  __webpack_require__(902),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\screen\\screen.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] screen.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7669d492", Component.options)
  } else {
    hotAPI.reload("data-v-7669d492", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 878:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(578),
  /* template */
  __webpack_require__(898),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\screen\\screenform.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] screenform.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-48ab0e0a", Component.options)
  } else {
    hotAPI.reload("data-v-48ab0e0a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 895:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticStyle: {
      "height": "100vh"
    }
  }, [_c('LayoutHeader', {
    attrs: {
      "activeitem": "screen"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "cont"
  }, [_c('Screen')], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-3a0d0757", module.exports)
  }
}

/***/ }),

/***/ 896:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "nodesetting"
  }, [_c('el-dialog', {
    attrs: {
      "title": _vm.$t('节点设置'),
      "visible": _vm.modal,
      "customClass": "node_modal",
      "close-on-click-modal": false,
      "size": "large"
    },
    on: {
      "update:visible": function($event) {
        _vm.modal = $event
      }
    }
  }, [_c('div', {
    staticClass: "node-body"
  }, [_c('div', {
    staticClass: "nodeshow"
  }, _vm._l((_vm.screenBindInfo), function(item, index) {
    return _c('div', {
      key: 'grid_' + index,
      class: {
        inner: true, bind: !(!item.IP)
      },
      style: (_vm.screenGridStyle),
      on: {
        "drop": function($event) {
          _vm.drop($event, item)
        },
        "dragover": function($event) {
          _vm.allowDrop($event)
        }
      }
    }, [_c('span', [_vm._v(_vm._s((item.Row + 1) + '-' + (item.Column + 1)))]), _vm._v(" "), _c('i', {
      class: {
        'fa': true, 'fa-minus-circle': !(!item.IP), 'fa-plus-circle': !(item.ip)
      },
      on: {
        "click": function($event) {
          _vm.handleUnbindNode(item)
        }
      }
    }), _vm._v(" "), _c('p', [_vm._v(_vm._s(item.IP ? item.IP : 'unbound'))])])
  })), _vm._v(" "), _c('div', {
    staticClass: "nodelist"
  }, _vm._l((_vm.avaibleNodeList), function(item, index) {
    return _c('div', {
      key: 'node_' + index,
      staticClass: "node-item",
      attrs: {
        "draggable": "true"
      },
      on: {
        "dragstart": function($event) {
          _vm.dragstart($event, item, index)
        },
        "dragend": function($event) {
          _vm.dragend($event, item, index)
        }
      }
    }, [_vm._v(_vm._s(item.IP))])
  }))])])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-3d46b4d3", module.exports)
  }
}

/***/ }),

/***/ 898:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "screenform"
  }, [_c('el-dialog', {
    attrs: {
      "title": _vm.title,
      "visible": _vm.modal,
      "customClass": "screen_modal",
      "close-on-click-modal": false
    },
    on: {
      "update:visible": function($event) {
        _vm.modal = $event
      }
    }
  }, [_c('el-form', {
    ref: "screen_form",
    attrs: {
      "model": _vm.formItem,
      "rules": _vm.formRules,
      "label-width": "125px",
      "label-position": "left"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": _vm.$t('屏组名称'),
      "prop": "Name"
    }
  }, [_c('el-input', {
    attrs: {
      "placeholder": _vm.$t('请输入')
    },
    model: {
      value: (_vm.formItem.Name),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Name", $$v)
      },
      expression: "formItem.Name"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('Led屏'),
      "prop": "IsLed"
    }
  }, [_c('el-switch', {
    attrs: {
      "active-value": "1",
      "inactive-value": "0"
    },
    model: {
      value: (_vm.formItem.IsLed),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "IsLed", $$v)
      },
      expression: "formItem.IsLed"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('行×列')
    }
  }, [_c('el-row', [_c('el-col', {
    attrs: {
      "span": 11
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "Rows"
    }
  }, [_c('div', {
    class: {
      'el-input': true, 'is-disabled': _vm.op == 'edit' || _vm.formItem.IsLed == '1'
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.formItem.Rows),
      expression: "formItem.Rows"
    }],
    staticClass: "el-input__inner",
    attrs: {
      "type": "number",
      "max": "100",
      "min": "1",
      "step": "1",
      "placeholder": _vm.$t('请选择'),
      "disabled": _vm.op == 'edit' || _vm.formItem.IsLed == '1'
    },
    domProps: {
      "value": (_vm.formItem.Rows)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.formItem, "Rows", $event.target.value)
      }
    }
  })])])], 1), _vm._v(" "), _c('el-col', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "span": 2
    }
  }, [_vm._v("\n                    x")]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 11
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "Columns"
    }
  }, [_c('div', {
    class: {
      'el-input': true, 'is-disabled': _vm.op == 'edit' || _vm.formItem.IsLed == '1'
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.formItem.Columns),
      expression: "formItem.Columns"
    }],
    staticClass: "el-input__inner",
    attrs: {
      "type": "number",
      "max": "100",
      "min": "1",
      "step": "1",
      "placeholder": _vm.$t('请选择'),
      "disabled": _vm.op == 'edit' || _vm.formItem.IsLed == '1'
    },
    domProps: {
      "value": (_vm.formItem.Columns)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.formItem, "Columns", $event.target.value)
      }
    }
  })])])], 1)], 1)], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('LED宽x高')
    }
  }, [_c('el-row', [_c('el-col', {
    attrs: {
      "span": 11
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "LedW"
    }
  }, [_c('div', {
    class: {
      'el-input': true, 'is-disabled': _vm.op == 'edit' || _vm.formItem.IsLed == '0'
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.formItem.LedW),
      expression: "formItem.LedW"
    }],
    staticClass: "el-input__inner",
    attrs: {
      "type": "number",
      "min": "1",
      "step": "20",
      "placeholder": _vm.$t('请选择'),
      "disabled": _vm.op == 'edit' || _vm.formItem.IsLed == '0'
    },
    domProps: {
      "value": (_vm.formItem.LedW)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.formItem, "LedW", $event.target.value)
      }
    }
  })])])], 1), _vm._v(" "), _c('el-col', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "span": 2
    }
  }, [_vm._v("\n                    x")]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 11
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "LedH"
    }
  }, [_c('div', {
    class: {
      'el-input': true, 'is-disabled': _vm.op == 'edit' || _vm.formItem.IsLed == '0'
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.formItem.LedH),
      expression: "formItem.LedH"
    }],
    staticClass: "el-input__inner",
    attrs: {
      "type": "number",
      "min": "20",
      "step": "1",
      "placeholder": _vm.$t('请选择'),
      "disabled": _vm.op == 'edit' || _vm.formItem.IsLed == '0'
    },
    domProps: {
      "value": (_vm.formItem.LedH)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.formItem, "LedH", $event.target.value)
      }
    }
  })])])], 1)], 1)], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('单元屏幕分辨率'),
      "prop": "Resolution"
    }
  }, [_c('el-select', {
    attrs: {
      "allow-create": "",
      "filterable": "",
      "filterable": "",
      "disabled": _vm.op == 'edit',
      "placeholder": _vm.$t('请选择')
    },
    model: {
      value: (_vm.formItem.Resolution),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Resolution", $$v)
      },
      expression: "formItem.Resolution"
    }
  }, _vm._l((_vm.resolutions), function(item, index) {
    return (item.rotato == (_vm.formItem.Degree % 2 != 0)) ? _c('el-option', {
      key: 'resolution_' + index,
      attrs: {
        "value": item.value,
        "label": item.label
      }
    }) : _vm._e()
  }))], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('逻辑网格'),
      "prop": "Grid"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": _vm.$t('请选择')
    },
    model: {
      value: (_vm.formItem.Grid),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Grid", $$v)
      },
      expression: "formItem.Grid"
    }
  }, _vm._l((_vm.grids), function(item, index) {
    return _c('el-option', {
      key: 'grid_' + index,
      attrs: {
        "value": item.value,
        "label": item.label
      }
    })
  }))], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('旋转角度'),
      "prop": "Degree"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": _vm.$t('请选择'),
      "disabled": _vm.op == 'edit' || _vm.formItem.IsLed == '1'
    },
    on: {
      "change": _vm.degreeChange
    },
    model: {
      value: (_vm.formItem.Degree),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Degree", $$v)
      },
      expression: "formItem.Degree"
    }
  }, _vm._l((_vm.degrees), function(item, index) {
    return _c('el-option', {
      key: 'degree_' + index,
      attrs: {
        "value": item.value,
        "label": item.label
      }
    })
  }))], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('音频绑定输出节点')
    }
  }, [_c('el-row', [_c('el-col', {
    attrs: {
      "span": 11
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "AudioX"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.formItem.AudioX),
      expression: "formItem.AudioX"
    }],
    staticClass: "el-input__inner",
    attrs: {
      "type": "number",
      "max": "100",
      "min": "1",
      "step": "1",
      "placeholder": _vm.$t('请选择')
    },
    domProps: {
      "value": (_vm.formItem.AudioX)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.formItem, "AudioX", $event.target.value)
      }
    }
  })])], 1), _vm._v(" "), _c('el-col', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "span": 2
    }
  }, [_vm._v("\n                    x")]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 11
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "AudioY"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.formItem.AudioY),
      expression: "formItem.AudioY"
    }],
    staticClass: "el-input__inner",
    attrs: {
      "type": "number",
      "max": "100",
      "min": "1",
      "step": "1",
      "placeholder": _vm.$t('请选择')
    },
    domProps: {
      "value": (_vm.formItem.AudioY)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.formItem, "AudioY", $event.target.value)
      }
    }
  })])], 1)], 1)], 1)], 1), _vm._v(" "), _c('span', {
    staticClass: "dialog-footer",
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    staticStyle: {
      "padding": "10px 18px"
    },
    on: {
      "click": function($event) {
        _vm.modal = false
      }
    }
  }, [_vm._v(_vm._s(_vm.$t('取消')))]), _vm._v(" "), _c('el-button', {
    staticStyle: {
      "padding": "10px 18px"
    },
    attrs: {
      "type": "info"
    },
    on: {
      "click": function($event) {
        _vm.handleSubmit('screen_form', false)
      }
    }
  }, [_vm._v(_vm._s(_vm.$t('跳过下一步,保存')))]), _vm._v(" "), _c('el-button', {
    staticStyle: {
      "padding": "10px 18px"
    },
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.handleSubmit('screen_form', true)
      }
    }
  }, [_vm._v(_vm._s(_vm.$t('下一步')))])], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-48ab0e0a", module.exports)
  }
}

/***/ }),

/***/ 902:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "screen"
  }, [_c('el-row', [_c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('div', {
    staticClass: "title"
  }, [_c('span', [_vm._v(_vm._s(_vm.$t('屏组设置')))])]), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('span', [_vm._v(_vm._s(_vm.$t('可创建多组屏，并且分别进行管理')))])])])], 1), _vm._v(" "), _c('el-row', [_c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('div', {
    staticClass: "tabletools"
  }, [_c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.refresh
    }
  }, [_c('i', {
    staticClass: "fa fa-refresh mar-rig"
  })]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": function($event) {
        _vm.openScreenForm('add')
      }
    }
  }, [_c('i', {
    staticClass: "el-icon-plus mar-rig"
  }), _vm._v(_vm._s(_vm.$t('新建')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": function($event) {
        _vm.openScreenForm('edit')
      }
    }
  }, [_c('i', {
    staticClass: "el-icon-edit mar-rig"
  }), _vm._v(_vm._s(_vm.$t('编辑')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.handleDel
    }
  }, [_c('i', {
    staticClass: "el-icon-delete mar-rig"
  }), _vm._v(_vm._s(_vm.$t('删除')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.bindNode
    }
  }, [_c('i', {
    staticClass: "el-icon-setting mar-rig"
  }), _vm._v(_vm._s(_vm.$t('设置')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.bindIp
    }
  }, [_c('i', {
    staticClass: "fa fa-pencil mar-rig"
  }), _vm._v(_vm._s(_vm.$t('设置IP')))])], 1)])], 1), _vm._v(" "), _c('el-row', {
    staticStyle: {
      "height": "calc(100% - 175px)"
    }
  }, [_c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('div', {
    staticClass: "tableshow"
  }, [_c('el-table', {
    attrs: {
      "highlight-current-row": "",
      "data": _vm.data,
      "stripe": ""
    },
    on: {
      "current-change": _vm.curChange
    }
  }, [_c('el-table-column', {
    attrs: {
      "property": "Name",
      "label": _vm.$t('屏组名称'),
      "align": "center"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "label": _vm.$t('单元屏幕分辨率'),
      "align": "center",
      "formatter": _vm.formatterResolution
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "label": _vm.$t('Led屏'),
      "align": "center",
      "formatter": _vm.formatterLed
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "RowColumes",
      "label": _vm.$t('行×列'),
      "align": "center",
      "formatter": _vm.formatterRowColumn
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "GridRowColumes",
      "label": _vm.$t('逻辑网格'),
      "align": "center",
      "formatter": _vm.formatterGrids
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "Degree",
      "label": _vm.$t('旋转角度'),
      "align": "center",
      "formatter": _vm.formatterDegree
    }
  })], 1)], 1)])], 1), _vm._v(" "), _c('el-row', [_c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('div', {
    staticClass: "footpages"
  }, [_c('el-pagination', {
    attrs: {
      "total": _vm.total,
      "current-page": _vm.current,
      "page-size": _vm.pagesize
    },
    on: {
      "update:currentPage": function($event) {
        _vm.current = $event
      },
      "current-change": _vm.onPageChange
    }
  })], 1)])], 1), _vm._v(" "), _c('ScreenForm', {
    ref: "screen_form",
    on: {
      "formsubmit": _vm.handleForm
    }
  }), _vm._v(" "), _c('NodeSetting', {
    ref: "node_setting"
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7669d492", module.exports)
  }
}

/***/ })

});
//# sourceMappingURL=1.chunk.js.map