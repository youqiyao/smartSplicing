webpackJsonp([11],{

/***/ 401:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(866)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(586),
  /* template */
  __webpack_require__(899),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\system\\systemsetting\\nodemanage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] nodemanage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4a67829d", Component.options)
  } else {
    hotAPI.reload("data-v-4a67829d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 586:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            baseData: [{
                ID: 0,
                title: this.$t('节点分支'),
                children: [{
                    ID: -1,
                    title: this.$t('输入节点')
                    //                    expand: true,
                    //                    disabled: true,
                }, {
                    ID: -2,
                    title: this.$t('输出节点'),
                    children: []
                    //                    expand: true,
                    //                    checked: true,
                }]
            }],
            outputNode1: [], //输出节点
            chkedNodes: [], //被选中的节点
            status: false,
            tabledata: [{
                IP: '2016-05-03',
                DirectConn: false
            }]
        };
    },
    created: function created() {
        this.list();
    },

    methods: {
        //总开、总关
        changestatus: function changestatus() {
            var set1 = new Set();
            console.log("111");
            //      		this.status=!this.status
            for (var i = 0; i < this.tabledata.length; i++) {
                this.tabledata[i].DirectConn = this.status;
                set1.add(this.tabledata[i].IP);
            }
            this.setDirect(this.status ? 0 : 1, Array.from(set1));
        },

        toggleSelection: function toggleSelection(rows) {
            var _this = this;

            if (rows) {
                rows.forEach(function (row) {
                    _this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange: function handleSelectionChange(val) {
            //    	console.log(val,this.multipleSelection)
            this.multipleSelection = val;
            console.log(val);
        },

        /**
         * 节点列表
         */
        list: function list() {
            var _this2 = this;

            var url = '/api.v2.do.node.get';
            var params = {
                "userid": this.$auth.getuid(),
                "page": { "start": 0, "limit": 0 }
            };
            this.$http(url, params).then(function (res) {
                if (res.data.status != 0) {
                    _this2.$message({
                        'type': 'error',
                        'message': _this2.$t('获取节点失败'),
                        'showClose': true,
                        'duration': 1500
                    });
                    return;
                }
                if (res.data.msg && res.data.msg.body) {
                    _this2.tabledata = _this2._fmtData(res.data.msg.body);
                    for (var i = 0; i < _this2.tabledata.length; i++) {
                        if (_this2.tabledata[i].DirectConn == 0) {
                            _this2.tabledata[i].DirectConn = true;
                        } else {
                            _this2.tabledata[i].DirectConn = false;
                        }
                    }
                } else {
                    _this2.tabledata = _this2._fmtData([]);
                }
                _this2._appendTree();
            }).catch(function (err) {});
        },

        nodeReset: function nodeReset() {
            var _this3 = this;

            var resetNodes = this.chkedNodes.filter(function (val) {
                return !!val.Type;
            });
            var set = new Set();
            if (resetNodes.length > 0) {
                resetNodes.map(function (v) {
                    return set.add(v.IP);
                });
            }

            var url = 'api.v2.do.node.reboot';
            var params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "IP": Array.from(set)
                }
            };
            this.$http(url, params).then(function (res) {
                if (res.data.status != 0) {
                    _this3.$message({
                        'type': 'error',
                        'message': _this3.$t("设备重启失败"),
                        'showClose': true,
                        'duration': 1500
                    });
                    return;
                }
                _this3.$message({
                    'type': 'success',
                    'message': _this3.$t('设备正在重启中'),
                    'showClose': true,
                    'duration': 1500
                });
            }).catch(function (err) {});
        },

        /**
         * 设置取消编码直通
         * @param isDirect : 0/1
         * @param nodeIpArr: [ip1, ip2, ... ]
         */
        setDirect: function setDirect(isDirect, nodeIpArr) {
            var _this4 = this;

            var url = '/api.v2.do.node.directornot';
            var params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "DirectConn": isDirect,
                    "IP": nodeIpArr
                }
            };
            this.$http(url, params).then(function (res) {
                if (res.data.status == 0) {
                    //刷新树节点
                    _this4.list();
                    _this4.$message({
                        'message': _this4.$t("设置成功"),
                        'type': 'success',
                        'showClose': true,
                        'duration': 1500
                    });
                } else {
                    _this4.$message({
                        'message': _this4.$t("设置失败"),
                        'type': 'error',
                        'showClose': true,
                        'duration': 1500
                    });
                }
            }).catch(function (err) {
                console.log(err);
            });
        },

        /**
         * 点击触发设置、取消编码直通
         */
        subSet: function subSet() {
            var directNodes = this.chkedNodes.filter(function (val) {
                return val.DirectConn == 1;
            }),
                notDirectNodes = this.chkedNodes.filter(function (val) {
                return val.DirectConn == 0;
            });
            if (directNodes.length > 0) {
                var set1 = new Set();
                directNodes.map(function (v) {
                    return set1.add(v.IP);
                });
                this.setDirect(0, Array.from(set1));
            }

            if (notDirectNodes.length > 0) {
                var set2 = new Set();
                notDirectNodes.map(function (v) {
                    return set2.add(v.IP);
                });
                this.setDirect(1, Array.from(set2));
            }
        },


        /**
         * 选中节点变化时触发 记录当前被选中的节点
         */
        onChkChange: function onChkChange() {
            this.chkedNodes = this.$refs.chkbox.getCheckedNodes();
        },

        /**
         * 格式化数据
         */
        _fmtData: function _fmtData(dt) {
            var rtnDt = [];
            for (var i in dt) {
                dt[i].title = dt[i].IP;rtnDt.push(dt[i]);
            }
            return rtnDt;
        },

        /**
         * 增加树节点
         * @private
         */
        _appendTree: function _appendTree() {
            var _this5 = this;

            var tmp = this.outputNode;
            tmp.map(function (val) {
                if (val.DirectConn) {
                    val.title += '(' + _this5.$t('直通') + ')';
                }return val;
            });
            this.baseData[0].children[1].children = tmp;
            this.baseData[0].children[1].expand = true;
        }
    }
});

/***/ }),

/***/ 866:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 899:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "nodemanage"
  }, [_c('el-row', [_c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('div', {
    staticClass: "title"
  }, [_c('span', [_vm._v(_vm._s(_vm.$t('直通设置')))])]), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('span', [_vm._v(_vm._s(_vm.$t('用于设置HDMI输入是否直通输出')))])])])], 1), _vm._v(" "), _c('el-row', {
    staticStyle: {
      "height": "100%",
      "margin-right": "0"
    },
    attrs: {
      "gutter": 16
    }
  }, [_c('div', {
    staticStyle: {
      "width": "10%"
    }
  }, [_c('el-switch', {
    staticClass: "posi",
    attrs: {
      "active-color": "#ccc",
      "inactive-color": "#ff4949"
    },
    on: {
      "change": _vm.changestatus
    },
    model: {
      value: (_vm.status),
      callback: function($$v) {
        _vm.status = $$v
      },
      expression: "status"
    }
  })], 1), _vm._v(" "), _c('el-table', {
    ref: "multipleTable",
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "data": _vm.tabledata,
      "tooltip-effect": "dark",
      "height": "100%"
    },
    on: {
      "selection-change": _vm.handleSelectionChange
    }
  }, [_c('el-table-column', {
    attrs: {
      "type": "selection",
      "width": "55"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "label": "设备列表",
      "min-width": "85%"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(scope) {
        return [_vm._v(_vm._s(scope.row.IP))]
      }
    }])
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "name",
      "label": "总开",
      "min-width": "5%"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(scope) {
        return [_c('el-button', {
          attrs: {
            "type": "text",
            "size": "small"
          }
        }, [_vm._v("\n       \t\t 开\n        ")])]
      }
    }])
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "min-width": "5%"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(scope) {
        return [_c('el-switch', {
          attrs: {
            "active-color": "#ccc",
            "inactive-color": "#ff4949"
          },
          model: {
            value: (scope.row.DirectConn),
            callback: function($$v) {
              _vm.$set(scope.row, "DirectConn", $$v)
            },
            expression: "scope.row.DirectConn"
          }
        })]
      }
    }])
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "name",
      "label": "总关",
      "min-width": "5%"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(scope) {
        return [_c('el-button', {
          attrs: {
            "type": "text",
            "size": "small"
          }
        }, [_vm._v("\n        \t\t关\n        ")])]
      }
    }])
  })], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-4a67829d", module.exports)
  }
}

/***/ })

});
//# sourceMappingURL=11.chunk.js.map