webpackJsonp([8],{

/***/ 400:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(871)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(585),
  /* template */
  __webpack_require__(905),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\system\\systemsetting\\marqueesetting.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] marqueesetting.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8577fbb8", Component.options)
  } else {
    hotAPI.reload("data-v-8577fbb8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 580:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__libs_util_js__ = __webpack_require__(122);
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
//


/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var _this = this;

    var validateText = function validateText(rule, value, callback) {
      if (value === '') {
        callback(new Error(_this.$t('请填写字幕内容')));
      } else {
        if (value.length > 64) {
          callback(new Error(_this.$t('内容长度不能超过64位')));
        } else {
          callback();
        }
      }
    };
    var validateWallID = function validateWallID(rule, value, callback) {
      if (!value) {
        return callback(new Error(_this.$t('请选择所属屏组')));
      }
      callback();
    };
    return {
      formItem: {
        ID: '', WallID: '', Text: '', Color: '', BGColor: '', FontType: 1, FontW: 200, FontH: 200, RectX: 0,
        RectY: 0, RectW: 300, RectH: 300, Speed: 3, State: 0
      },
      formRules: {
        Text: [{ validator: validateText, trigger: 'blur' }],
        WallID: [{ validator: validateWallID, trigger: 'change' }]

      },
      screen: [],
      fontType: [{ ID: 0, Name: 'Arial' }, { ID: 1, Name: this.$t('华文宋体') }, { ID: 2, Name: this.$t('楷体') }, { ID: 3, Name: this.$t('微软雅黑') }],
      state: [{ ID: 0, Name: this.$t('静止') }, /*{ID: 1, Name: '从左向右滚动'},*/{ ID: 2, Name: this.$t('从右向左滚动') }],
      modal: false,
      title: '',
      op: 'add'
    };
  },

  watch: {},
  computed: {
    marqueeData: function marqueeData() {
      return this.$store.state.marquee.selected_marquee;
    },
    availableScreen: function availableScreen() {
      var _this2 = this;

      var items = [];
      this.screen.forEach(function (val, index, array) {
        var item = JSON.parse(JSON.stringify(val));
        item.disabled = false;
        if (_this2.marqueeData.length != 0) {
          _this2.marqueeData.forEach(function (v, k, arr) {
            if (item.ID == v.WallID) {
              item.disabled = true;
              return;
            }
          });
        }
        items.push(item);
      });

      return items;
    }
  },
  created: function created() {
    this.list();
  },

  methods: {
    _setmodal: function _setmodal(status) {
      this.modal = status;
    },

    setFormData: function setFormData(data, title, op) {
      this.op = op;
      this.title = title;
      this.formItem = data;
    },
    /* 
     * 获取屏组
     */
    list: function list() {
      var _this3 = this;

      var vm = this;
      var params = {
        'userid': this.$auth.getuid()
      };
      this.$http('/api.v2.do.screen.get', params).then(function (res) {
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
          _this3.screen = [];
        } else {
          _this3.screen = res.data.msg.body;
        }
        _this3.formItem.WallID = _this3.screen.length != 0 ? _this3.screen[0].ID : '';
      }).catch(function (err) {});
    },
    ColorChange: function ColorChange(val) {
      // var v = util.colorRgbaToInt(val)
      // console.error(v, 'color')
    },
    BGColorChange: function BGColorChange(val) {
      // var v = util.colorRgbaToInt(val)
      // console.error(v, 'BGColor')
    },
    handleSubmit: function handleSubmit(name) {
      var _this4 = this;

      if (!this.formItem.Color) {
        this.$message({
          'showClose': 'true',
          'duration': '1500',
          'type': 'warning',
          'message': this.$t('请设置字体颜色')
        });
        return;
      }
      if (!this.formItem.BGColor) {
        this.$message({
          'showClose': 'true',
          'duration': '1500',
          'type': 'warning',
          'message': this.$t('请设置背景颜色')
        });
        return;
      }
      this.$refs[name].validate(function (valid) {
        if (valid) {
          _this4.$emit('formsubmit', _this4.op, _this4.formItem);
        }
      });
    }
  }
});

/***/ }),

/***/ 585:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__marqueesettingform_vue__ = __webpack_require__(879);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__marqueesettingform_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__marqueesettingform_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__libs_util_js__ = __webpack_require__(122);
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
    name: 'marqueesetting',
    components: { MarqueeSettingForm: __WEBPACK_IMPORTED_MODULE_0__marqueesettingform_vue___default.a },
    data: function data() {
        return {
            data: [],
            total: 0,
            current: 1,
            pagesize: 10,
            curId: null
        };
    },
    created: function created() {
        this.list(0, this.pagesize);
    },

    computed: {
        marqueeData: function marqueeData() {
            return this.$store.state.marquee.selected_marquee;
        }
    },
    methods: {
        /* 
          * 获取字幕方案列表
          */
        list: function list(start, limit) {
            var _this = this;

            var url = '/api.v2.do.marquee.get',
                params = {
                "userid": this.$auth.getuid(),
                "page": { "start": start, "limit": limit }
            };

            this.$http(url, JSON.stringify(params)).then(function (res) {
                if (res.data.status !== 0) {
                    _this.$message({
                        showClose: true,
                        duration: 1500,
                        'type': 'warning',
                        'message': _this.$t(_this.$msg[res.data.status])
                    });
                    return;
                }
                if (!res.data.msg) {
                    _this.total = 0;
                    _this.data = [];
                    _this.$store.commit('marquee/setSelectedMarquee', _this.data);
                    return;
                }
                _this.total = res.data.msg.count;
                _this.data = res.data.msg.body;
                _this.$store.commit('marquee/setSelectedMarquee', _this.data);
            }).catch(function (err) {
                console.log(err);
            });
        },
        /* 
         * 字幕的顶点格式化
         */
        formatterRectXY: function formatterRectXY(row, column, cellValue) {
            return '(' + row.RectX + ',' + row.RectY + ')';
        },

        /* 
        * 字幕的宽高格式化
        */
        formatterRectWH: function formatterRectWH(row, column, cellValue) {
            return row.RectW + '/' + row.RectH;
        },

        /* 
        * 字体类型格式化
        */
        formatterFontType: function formatterFontType(row, column, cellValue) {
            switch (row.FontType) {
                case 0:
                    return this.$t('Arial');
                case 1:
                    return this.$t('华文宋体');
                case 2:
                    return this.$t('楷体');
                case 3:
                    return this.$t('微软雅黑');
            }
            return '';
        },

        /* 
        * 字体的宽高格式化
        */
        formatterFontSize: function formatterFontSize(row, column, cellValue) {
            return row.FontW + '/' + row.FontH;
        },

        /* 
         * 颜色格式化
         */
        formatterColorBlock: function formatterColorBlock(data) {
            return __WEBPACK_IMPORTED_MODULE_1__libs_util_js__["a" /* default */].colorIntToRgba(data);
        },

        /* 
        * 字幕的状态格式化
        */
        formatterState: function formatterState(row, column, cellValue) {
            switch (row.State) {
                case 0:
                    return this.$t('静止');
                case 1:
                    return this.$t('从左向右滚动');
                case 2:
                    return this.$t('从右向左滚动');
            }
            return '';
        },


        /**
         * 控制字幕的显示隐藏
         */
        handleMargueeShow: function handleMargueeShow(row, state) {
            var _this2 = this;

            var url = '/api.v2.do.marquee.show',
                params = {
                "userid": this.$auth.getuid(),
                "body": { "ID": row.ID, "Show": state }
            };

            this.$http(url, JSON.stringify(params)).then(function (res) {
                if (res.data.status !== 0) {
                    _this2.$message({
                        'showClose': true,
                        'duration': 1500,
                        'type': 'warning',
                        'message': _this2.$t(_this2.$msg[res.data.status])
                    });
                    return;
                }
                _this2.$message({
                    'showClose': true,
                    'duration': 1500,
                    'type': 'success',
                    'message': _this2.$t('操作成功')
                });
            }).catch(function (err) {
                console.log(err);
            });
        },


        /**
         * [onPageChange 切换页面查看数据]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        onPageChange: function onPageChange(index) {
            this.current = index;
            this.refresh();
        },

        /**
         * [curChange 字幕选中事件]
         * @param  {[type]} newVal [description]
         * @param  {[type]} oldVal [description]
         * @return {[type]}        [description]
         */
        curChange: function curChange(newVal, oldVal) {
            if (null != newVal) {
                this.curId = newVal.ID;
            }
        },

        /**
         * [refresh 刷新列表数据]
         * @return {[type]} [description]
         */
        refresh: function refresh() {
            var start = (this.current - 1) * this.pagesize,
                limit = this.pagesize;
            this.curId = null;
            this.list(start, limit);
        },

        /**
         * 新建、编辑
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        openUserForm: function openUserForm(type) {
            if (type == 'edit' && this.curId == null) {
                this.$message({
                    showClose: true,
                    duration: 1500,
                    'type': 'warning',
                    'message': this.$t('请先选择要编辑的滚动字幕')
                });
                return;
            }
            if (type == 'add') {
                var formData = { WallID: '', Text: '', Color: 'rgba(231,19,19,1)', BGColor: 'rgba(14,14,14,1)', FontType: 1, FontW: 200, FontH: 200, RectX: 0, RectY: 0, RectW: 300, RectH: 500, Speed: 3, State: 0 };
                var title = this.$t('新建');
            } else {
                var data = this.getCurrentSelectMarquee();
                var formData = {
                    ID: data.ID,
                    WallID: data.WallID,
                    Text: data.Text,
                    Color: __WEBPACK_IMPORTED_MODULE_1__libs_util_js__["a" /* default */].colorIntToRgba(data.Color),
                    BGColor: __WEBPACK_IMPORTED_MODULE_1__libs_util_js__["a" /* default */].colorIntToRgba(data.BGColor),
                    FontType: parseInt(data.FontType),
                    FontW: parseInt(data.FontW),
                    FontH: parseInt(data.FontH),
                    RectX: parseInt(data.RectX),
                    RectY: parseInt(data.RectY),
                    RectW: parseInt(data.RectW),
                    RectH: parseInt(data.RectH),
                    Speed: parseInt(data.Speed),
                    State: parseInt(data.State)
                };
                var title = this.$t('编辑');
            }
            this.$refs['marqueesetting_form']._setmodal(true);
            this.$refs['marqueesetting_form'].setFormData(formData, title, type);
        },

        handleForm: function handleForm(type, data) {
            var _this3 = this;

            if (type == 'add') {
                var url = '/api.v2.do.marquee.add';
                var params = {
                    'userid': this.$auth.getuid(),
                    'body': {
                        WallID: data.WallID,
                        Text: data.Text,
                        Color: __WEBPACK_IMPORTED_MODULE_1__libs_util_js__["a" /* default */].colorRgbaToInt(data.Color),
                        BGColor: __WEBPACK_IMPORTED_MODULE_1__libs_util_js__["a" /* default */].colorRgbaToInt(data.BGColor),
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
                };
            } else {
                var url = '/api.v2.do.marquee.edit';
                var params = {
                    'userid': this.$auth.getuid(),
                    'body': {
                        ID: data.ID,
                        WallID: data.WallID,
                        Text: data.Text,
                        Color: __WEBPACK_IMPORTED_MODULE_1__libs_util_js__["a" /* default */].colorRgbaToInt(data.Color),
                        BGColor: __WEBPACK_IMPORTED_MODULE_1__libs_util_js__["a" /* default */].colorRgbaToInt(data.BGColor),
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
                };
            }
            this.$http(url, params).then(function (res) {
                if (0 !== res.data.status) {
                    _this3.$message({
                        'showClose': true,
                        'duration': 1500,
                        'type': 'warning',
                        'message': _this3.$t(_this3.$msg[res.data.status])
                    });
                    return;
                }
                _this3.$message({
                    showClose: true,
                    duration: 1500,
                    type: 'success',
                    message: _this3.$t('操作成功')
                });
                _this3.refresh();
                _this3.$refs['marqueesetting_form']._setmodal(false);
            }).catch(function (err) {
                _this3.$message({
                    showClose: true,
                    duration: 1500,
                    type: 'error',
                    message: _this3.$t('操作异常')
                });
                return;
            });
        },

        /**
         * 删除字幕
         * @return {[type]} [description]
         */
        handleDel: function handleDel() {
            var _this4 = this;

            var vm = this;
            //此处处理删除操作
            if (!this.curId) {
                this.$message({
                    showClose: true,
                    duration: 1500,
                    type: 'error',
                    message: this.$t('请先选择需要删除的滚动字幕')
                });
                return;
            }
            this.$confirm(this.$t('此操作将永久删除该字幕方案, 是否继续?'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning',
                closeOnClickModal: false
            }).then(function () {
                var id = _this4.curId,
                    url = '/api.v2.do.marquee.del',
                    params = {
                    "userid": _this4.$auth.getuid(),
                    "body": { "ID": id }
                };
                _this4.$http(url, params).then(function (res) {
                    if (res.data.status != 0) {
                        _this4.$message({
                            showClose: true,
                            duration: 1500,
                            'type': 'warning',
                            'message': _this4.$t(_this4.$msg[res.data.status])
                        });
                        return;
                    }

                    _this4.$message({
                        type: 'success',
                        message: _this4.$t('删除成功'),
                        showClose: true,
                        duration: 1500
                    });
                    vm.refresh();
                }).catch(function (err) {
                    vm.$message({
                        type: 'warning',
                        message: _this4.$t('删除失败'),
                        showClose: true,
                        duration: 1500
                    });
                });
            }).catch(function () {});
        },

        /**
         * [getCurrentSelectMarquee 获取当前选中的字幕信息]
         * @return {[type]} [description]
         */
        getCurrentSelectMarquee: function getCurrentSelectMarquee() {
            var vm = this;
            var data = this.data.filter(function (value) {
                return value.ID == vm.curId;
            });

            return JSON.parse(JSON.stringify(data[0]));
        }
    }
});

/***/ }),

/***/ 871:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 879:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(580),
  /* template */
  __webpack_require__(910),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\system\\marqueesettingform.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] marqueesettingform.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c91f5b4c", Component.options)
  } else {
    hotAPI.reload("data-v-c91f5b4c", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 905:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "usersmanage"
  }, [_c('el-row', [_c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('div', {
    staticClass: "title"
  }, [_c('span', [_vm._v(_vm._s(_vm.$t('字幕设置')))])]), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('span', [_vm._v(_vm._s(_vm.$t('添加字幕叠加功能')))])])])], 1), _vm._v(" "), _c('el-row', [_c('el-col', {
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
    staticClass: "fa fa-refresh"
  })]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    attrs: {
      "size": "small"
    },
    on: {
      "click": function($event) {
        _vm.openUserForm('add')
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
        _vm.openUserForm('edit')
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
  }), _vm._v(_vm._s(_vm.$t('删除')))])], 1)])], 1), _vm._v(" "), _c('el-row', {
    staticStyle: {
      "height": "calc(100% - 50px)"
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
      "data": _vm.data
    },
    on: {
      "current-change": _vm.curChange
    }
  }, [_c('el-table-column', {
    attrs: {
      "label": _vm.$t('字幕内容'),
      "align": "center"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(scope) {
        return [_c('div', {
          staticClass: "item-name",
          attrs: {
            "title": scope.row.Text
          }
        }, [_vm._v(_vm._s(scope.row.Text))])]
      }
    }])
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "WallName",
      "label": _vm.$t('所属屏组'),
      "align": "center",
      "width": "80"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "formatter": _vm.formatterRectXY,
      "label": _vm.$t('字幕顶点坐标(px)'),
      "align": "center",
      "width": "150"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "formatter": _vm.formatterRectWH,
      "label": _vm.$t('字幕的宽/高(px)'),
      "align": "center",
      "width": "140"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "formatter": _vm.formatterFontSize,
      "label": _vm.$t('字体的宽/高(px)'),
      "align": "center",
      "width": "140"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "label": _vm.$t('字体颜色'),
      "align": "center",
      "width": "80"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(scope) {
        return [_c('div', {
          staticClass: "color_block",
          style: ({
            'backgroundColor': _vm.formatterColorBlock(scope.row.Color)
          })
        })]
      }
    }])
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "label": _vm.$t('背景颜色'),
      "align": "center",
      "width": "80"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(scope) {
        return [_c('div', {
          staticClass: "color_block",
          style: ({
            'backgroundColor': _vm.formatterColorBlock(scope.row.BGColor)
          })
        })]
      }
    }])
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "formatter": _vm.$t(_vm.formatterState),
      "label": _vm.$t('字幕滚动方向'),
      "align": "center",
      "width": "120"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "Speed",
      "label": _vm.$t('滚动速度'),
      "align": "center",
      "width": "80"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "Name",
      "align": "center",
      "label": _vm.$t('操作'),
      "width": "180"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(scope) {
        return [_c('el-button', {
          attrs: {
            "type": "info",
            "size": "small"
          },
          nativeOn: {
            "click": function($event) {
              $event.preventDefault();
              _vm.handleMargueeShow(scope.row, 1)
            }
          }
        }, [_vm._v(_vm._s(_vm.$t('显示')) + "\n                        ")]), _vm._v(" "), _c('el-button', {
          attrs: {
            "type": "danger",
            "size": "small"
          },
          on: {
            "click": function($event) {
              _vm.handleMargueeShow(scope.row, 0)
            }
          }
        }, [_vm._v(_vm._s(_vm.$t('隐藏')) + "\n                        ")])]
      }
    }])
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
  })], 1)])], 1), _vm._v(" "), _c('MarqueeSettingForm', {
    ref: "marqueesetting_form",
    on: {
      "formsubmit": _vm.handleForm
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-8577fbb8", module.exports)
  }
}

/***/ }),

/***/ 910:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "marqueesettingform"
  }, [_c('el-dialog', {
    attrs: {
      "title": _vm.title,
      "visible": _vm.modal,
      "customClass": "marquee_modal",
      "close-on-click-modal": false
    },
    on: {
      "update:visible": function($event) {
        _vm.modal = $event
      }
    }
  }, [_c('el-form', {
    ref: "marqueesetting_form",
    attrs: {
      "rules": _vm.formRules,
      "model": _vm.formItem,
      "label-width": "100px",
      "label-position": "left"
    }
  }, [_c('div', {
    staticClass: "marquee_WallID"
  }, [_c('el-form-item', {
    attrs: {
      "label": _vm.$t('选择屏组'),
      "prop": "WallID"
    }
  }, [_c('el-select', {
    staticClass: "el-select-block",
    attrs: {
      "disabled": _vm.op == 'edit',
      "placeholder": " "
    },
    model: {
      value: (_vm.formItem.WallID),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "WallID", $$v)
      },
      expression: "formItem.WallID"
    }
  }, _vm._l((_vm.availableScreen), function(item, index) {
    return _c('el-option', {
      key: 'screen_' + index,
      attrs: {
        "value": item.ID,
        "disabled": item.disabled,
        "label": item.Name
      }
    })
  }))], 1)], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('字幕内容'),
      "prop": "Text"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "autosize": {
        minRows: 3,
        maxRows: 3
      },
      "placeholder": _vm.$t('这里是不超过64个字的滚动字幕')
    },
    model: {
      value: (_vm.formItem.Text),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Text", $$v)
      },
      expression: "formItem.Text"
    }
  })], 1), _vm._v(" "), _c('el-row', {
    staticClass: "split_line",
    attrs: {
      "gutter": 16
    }
  }, [_c('el-col', {
    attrs: {
      "span": 12
    }
  }, [_c('div', {
    staticClass: "grid-content bg-purple"
  }, [_c('el-form-item', {
    attrs: {
      "label": _vm.$t('字体颜色'),
      "prop": "Color"
    }
  }, [_c('el-color-picker', {
    attrs: {
      "show-alpha": ""
    },
    on: {
      "change": _vm.ColorChange
    },
    model: {
      value: (_vm.formItem.Color),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Color", $$v)
      },
      expression: "formItem.Color"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('背景颜色'),
      "prop": "BGColor"
    }
  }, [_c('el-color-picker', {
    attrs: {
      "show-alpha": ""
    },
    on: {
      "change": _vm.BGColorChange
    },
    model: {
      value: (_vm.formItem.BGColor),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "BGColor", $$v)
      },
      expression: "formItem.BGColor"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('字体类型'),
      "prop": "FontType"
    }
  }, [_c('el-select', {
    staticClass: "el-select-block",
    attrs: {
      "placeholder": " "
    },
    model: {
      value: (_vm.formItem.FontType),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "FontType", $$v)
      },
      expression: "formItem.FontType"
    }
  }, _vm._l((_vm.fontType), function(item, index) {
    return _c('el-option', {
      key: 'font_' + index,
      attrs: {
        "value": item.ID,
        "label": item.Name
      }
    })
  }))], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('滚动方向'),
      "prop": "State"
    }
  }, [_c('el-select', {
    staticClass: "el-select-block",
    attrs: {
      "placeholder": " "
    },
    model: {
      value: (_vm.formItem.State),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "State", $$v)
      },
      expression: "formItem.State"
    }
  }, _vm._l((_vm.state), function(item, index) {
    return _c('el-option', {
      key: 'direction_' + index,
      attrs: {
        "value": item.ID,
        "label": item.Name
      }
    })
  }))], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('滚动速度'),
      "prop": "Speed"
    }
  }, [_c('div', {
    staticClass: "slider"
  }, [_c('el-slider', {
    attrs: {
      "max": 5
    },
    model: {
      value: (_vm.formItem.Speed),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Speed", $$v)
      },
      expression: "formItem.Speed"
    }
  }), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.formItem.Speed),
      expression: "formItem.Speed"
    }],
    attrs: {
      "readonly": true
    },
    domProps: {
      "value": (_vm.formItem.Speed)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.formItem, "Speed", $event.target.value)
      }
    }
  })], 1)])], 1)]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 12
    }
  }, [_c('div', {
    staticClass: "marquee_form_right"
  }, [_c('el-form-item', {
    attrs: {
      "label": _vm.$t('顶点X坐标'),
      "prop": "RectX"
    }
  }, [_c('el-input-number', {
    attrs: {
      "min": 0
    },
    model: {
      value: (_vm.formItem.RectX),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "RectX", $$v)
      },
      expression: "formItem.RectX"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('顶点Y坐标'),
      "prop": "RectY"
    }
  }, [_c('el-input-number', {
    attrs: {
      "min": 0
    },
    model: {
      value: (_vm.formItem.RectY),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "RectY", $$v)
      },
      expression: "formItem.RectY"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('字幕的宽'),
      "prop": "RectW"
    }
  }, [_c('el-input-number', {
    attrs: {
      "min": 1
    },
    model: {
      value: (_vm.formItem.RectW),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "RectW", $$v)
      },
      expression: "formItem.RectW"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('字幕的高'),
      "prop": "RectH"
    }
  }, [_c('el-input-number', {
    attrs: {
      "min": 1
    },
    model: {
      value: (_vm.formItem.RectH),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "RectH", $$v)
      },
      expression: "formItem.RectH"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('字体的宽'),
      "prop": "FontW"
    }
  }, [_c('el-input-number', {
    attrs: {
      "min": 1,
      "max": 500
    },
    model: {
      value: (_vm.formItem.FontW),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "FontW", $$v)
      },
      expression: "formItem.FontW"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('字体的高'),
      "prop": "FontH"
    }
  }, [_c('el-input-number', {
    attrs: {
      "min": 1,
      "max": 500
    },
    model: {
      value: (_vm.formItem.FontH),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "FontH", $$v)
      },
      expression: "formItem.FontH"
    }
  })], 1)], 1)])], 1)], 1), _vm._v(" "), _c('span', {
    staticClass: "dialog-footer",
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function($event) {
        _vm.modal = false
      }
    }
  }, [_vm._v(_vm._s(_vm.$t('取消')))]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.handleSubmit('marqueesetting_form')
      }
    }
  }, [_vm._v(_vm._s(_vm.$t('保存')))])], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-c91f5b4c", module.exports)
  }
}

/***/ })

});
//# sourceMappingURL=8.chunk.js.map