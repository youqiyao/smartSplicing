webpackJsonp([12],{

/***/ 398:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(857)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(583),
  /* template */
  __webpack_require__(886),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\system\\systemsetting\\bgimgsetting.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] bgimgsetting.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0501b2e8", Component.options)
  } else {
    hotAPI.reload("data-v-0501b2e8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 583:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_config__ = __webpack_require__(121);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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

            uploadUri: __WEBPACK_IMPORTED_MODULE_0__config_config__["a" /* default */].apiDomain + '/api.v2.uploadImg.0.0',
            uploadFiles: [],

            bgScreenWidth: 0,
            bgScreenHeight: 0,

            isbgImg: false

        };
    },

    computed: {},
    created: function created() {
        /* 
         * 页面初始化
         */
        this.list();
    },


    methods: {
        /* 
         * 获取屏组信息
         */
        list: function list() {
            var _this = this;

            var vm = this;
            var params = {
                "userid": this.$auth.getuid()
            };
            this.$http('/api.v2.do.screen.get', params).then(function (res) {
                if (res.data.status !== 0) {
                    _this.$message({
                        'showClose': 'true',
                        'duration': '1500',
                        'type': 'warning',
                        'message': _this.$t(_this.$msg[res.data.status])
                    });
                    return;
                }
                if (!res.data.msg) {
                    _this.screen = [];
                } else {
                    _this.screen = res.data.msg.body;
                }
                _this.formItem.WallID = _this.screen.length != 0 ? _this.screen[0].ID : '';
                _this.setGridItems();
            }).catch(function (err) {});
        },

        /* 
         * 获取背景图片信息
         */
        getWallBgImg: function getWallBgImg() {
            var _this2 = this;

            if (!this.formItem.WallID) {
                this.wallBgInfo = [];
                return;
            }
            var url = '/api.v2.do.bgImage.get',
                params = {
                "userid": this.$auth.getuid(),
                "body": {
                    "ID": 0,
                    "WallID": this.formItem.WallID
                }
            };
            this.$http(url, params).then(function (res) {
                if (res.data.status != 0) {
                    _this2.wallBgInfo = [];
                    _this2.$message({
                        'showClose': 'true',
                        'duration': '1500',
                        'type': 'warning',
                        'message': _this2.$t(_this2.$msg[res.data.status])
                    });
                    return;
                }
                if (!res.data.msg) {
                    _this2.wallBgInfo = [];
                    return;
                }
                _this2.wallBgInfo = res.data.msg.body;
            }).catch(function (err) {});
        },

        /* 
         * 根据选定屏组设置背景网格
         */
        screenGroupChange: function screenGroupChange(val) {

            this.getWallBgImg();
            this.setGridItems();

            this.formItem.Path = '';
            this.formItem.Type = 1;
        },

        /* 
         * 设置背景图片网格
         */
        setGridItems: function setGridItems() {
            var vm = this;
            var currentScreeData = this.screen.filter(function (value) {
                return value.ID == vm.formItem.WallID;
            })[0];
            var rows = currentScreeData.Rows;
            var columns = currentScreeData.Columns;
            var items = [];
            for (var i = 1; i <= rows; i++) {
                for (var j = 1; j <= columns; j++) {
                    items.push(i + '-' + j);
                }
            }
            this.gridList = items;
            this.resetBgImgGridsStyle(columns, rows);
            this.clearBgImgBackground();
        },
        /* 
         * 计算每个网格宽，高所占百分比
         */
        resetBgImgGridsStyle: function resetBgImgGridsStyle(rows, columns) {
            this.bgScreenWidth = Math.floor(1 / rows * 10000) / 100 + '%';
            this.bgScreenHeight = Math.floor(1 / columns * 10000) / 100 + '%';
        },
        /* 
         * 清除预览的背景图片
         */
        clearBgImgBackground: function clearBgImgBackground() {
            this.$refs.bgimg.style.backgroundImage = 'none';
            this.$refs.bgimg.childNodes.forEach(function (node, index) {
                node.style.backgroundImage = 'none';
            });
            this.isbgImg = false;
        },

        /*
         * 上传文件成功后的钩子函数
         * @param res
         * @param file
         * @param fileLst
         */
        uploadSucc: function uploadSucc(res, file, fileList) {
            if (!res.cmd_bgimage.status) {
                this.$refs.uploadimg.uploadFiles = this.$lodash.clone(this.uploadFiles);
                this.$message({
                    'showClose': 'true',
                    'duration': '1500',
                    'type': 'warning',
                    'message': this.$t('请上传PNG或JPEG格式图片')
                });
                return;
            }
            this.uploadFiles = [file];
            this.$refs.uploadimg.uploadFiles = this.$lodash.clone(this.uploadFiles);
            if (!this.formItem.WallID) return;
            this.formItem.Path = res.cmd_bgimage.image_path;
            this.setBgImg();
        },


        /**
         * 上传文件出错的钩子函数
         * @param err
         * @param file
         * @param fileLst
         */
        uploadErr: function uploadErr(err, file, fileLst) {},

        /* 
         * 设置背景图片
         */
        imgApply: function imgApply(value) {

            this.formItem.WallID && this.formItem.Path && this.setBgImg();
        },

        /* 
         * 覆盖，或者每个单元设置背景图片
         */
        setBgImg: function setBgImg() {
            var imgUrl = this.formItem.Path;
            if (this.formItem.Type == 1) {
                this.$refs.bgimg.childNodes.forEach(function (node, index) {
                    node.style.backgroundImage = 'none';
                });
                this.$refs.bgimg.style.backgroundImage = 'url(' + imgUrl + ')';
            } else if (this.formItem.Type == 2) {
                this.$refs.bgimg.style.backgroundImage = 'none';
                this.$refs.bgimg.childNodes.forEach(function (node, index) {
                    node.style.backgroundImage = 'url(' + imgUrl + ')';
                });
            } else {
                if (this.formItem.grid == "") return;
                this.setImgToGrid(this.formItem.grid);
            }
            this.isbgImg = true;
        },

        /* 
         * 设置图片到指定网格
         */
        setImgToGrid: function setImgToGrid(value) {
            var imgUrl = this.formItem.Path;
            this.$refs.bgimg.style.backgroundImage = 'none';
            this.$refs.bgimg.childNodes.forEach(function (node, index) {
                node.style.backgroundImage = 'none';
            });
            this.$refs[value][0].style.backgroundImage = 'url(' + imgUrl + ')';
            this.isbgImg = true;

            var Grid = value.split("-");
            this.formItem.Row = parseInt(Grid[0]) - 1;
            this.formItem.Column = parseInt(Grid[1]) - 1;
        },

        /* 
         * 清除背景图片
         */
        delBgImg: function delBgImg(id) {
            var _this3 = this;

            var params = {
                "userid": this.$auth.getuid(),
                "body": { "ID": id }
            };
            this.$http('/api.v2.do.bgImage.del', params).then(function (res) {
                if (res.data.status !== 0) {
                    _this3.$message({
                        'showClose': 'true',
                        'duration': '1500',
                        'type': 'warning',
                        'message': _this3.$t(_this3.$msg[res.data.status])
                    });
                    return;
                }
                _this3.$message(_defineProperty({
                    'showClose': 'true',
                    'duration': '1500',
                    'message': _this3.$t('清除成功')
                }, 'showClose', true));
                _this3.getWallBgImg();
            }).catch(function (err) {
                console.error(err);
            });
        },

        /* 
         * 清除图     片前对图片信息做出判断
         */
        bgImageClear: function bgImageClear() {
            var _this4 = this;

            if (this.wallBgInfo.length == 0) {
                this.$message(_defineProperty({
                    'showClose': 'true',
                    'duration': '1500',
                    'message': this.$t('该屏组未设置背景图片')
                }, 'showClose', true));
                return;
            }
            this.wallBgInfo.forEach(function (item) {
                _this4.delBgImg(item.ID);
            });
        },

        /* 
         * 添加图片并应用图片
         */
        bgImageSubmit: function bgImageSubmit() {
            var _this5 = this;

            if (!this.isbgImg) {
                this.$message(_defineProperty({
                    'showClose': 'true',
                    'duration': '1500',
                    'message': this.$t('请上传背景图片')
                }, 'showClose', true));
                return;
            }
            var url = '/api.v2.do.bgImage.add';
            var params = {
                userid: this.$auth.getuid(),
                body: {
                    WallID: this.formItem.WallID,
                    Row: this.formItem.Row,
                    Column: this.formItem.Column,
                    Path: this.formItem.Path,
                    Type: this.formItem.Type
                }
            };
            this.$http(url, params).then(function (res) {
                if (res.data.status !== 0) {
                    _this5.$message({
                        'showClose': 'true',
                        'duration': '1500',
                        'type': 'warning',
                        'message': _this5.$t(_this5.$msg[res.data.status])
                    });
                    return;
                }
                _this5.getWallBgImg();
                _this5.$message({
                    'showClose': 'true',
                    'duration': '1500',
                    'type': 'success',
                    'message': _this5.$t('操作成功')
                });
            }).catch(function (err) {});
        }
    }
});

/***/ }),

/***/ 857:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 886:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "bgimgsetting"
  }, [_c('el-row', [_c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('div', {
    staticClass: "title"
  }, [_c('span', [_vm._v(_vm._s(_vm.$t('底图设置')))])]), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('span', [_vm._v(_vm._s(_vm.$t('可设置屏幕的背景高分底图')))])])])], 1), _vm._v(" "), _c('el-row', {
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
      "span": 12
    }
  }, [_c('div', {
    staticClass: "bgform"
  }, [_c('el-form', {
    attrs: {
      "model": _vm.formItem,
      "label-width": "100px",
      "label-position": "left"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": this.$t('屏组')
    }
  }, [_c('el-select', {
    staticClass: "el-select-block",
    attrs: {
      "placeholder": " "
    },
    on: {
      "change": _vm.screenGroupChange
    },
    model: {
      value: (_vm.formItem.WallID),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "WallID", $$v)
      },
      expression: "formItem.WallID"
    }
  }, _vm._l((_vm.screen), function(item) {
    return _c('el-option', {
      attrs: {
        "value": item.ID,
        "label": item.Name
      }
    })
  }))], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": this.$t('上传图片')
    }
  }, [_c('el-upload', {
    ref: "uploadimg",
    staticClass: "uploadimg",
    attrs: {
      "accept": "image/png,image/jpeg",
      "on-success": _vm.uploadSucc,
      "on-error": _vm.uploadErr,
      "name": "image_path",
      "action": _vm.uploadUri,
      "multiple": false
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    }
  }, [_vm._v(_vm._s(_vm.$t('点击上传'))), _c('i', {
    staticClass: "fa fa-upload"
  })]), _vm._v(" "), _c('div', {
    staticClass: "el-upload__tip",
    attrs: {
      "slot": "tip"
    },
    slot: "tip"
  }, [_vm._v(_vm._s(_vm.$t('只能上传jpg/png文件')))])], 1)], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('更新图片选项')
    }
  }, [_c('el-radio-group', {
    on: {
      "change": _vm.imgApply
    },
    model: {
      value: (_vm.formItem.Type),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Type", $$v)
      },
      expression: "formItem.Type"
    }
  }, [_c('el-radio', {
    attrs: {
      "label": 1
    }
  }, [_vm._v(_vm._s(_vm.$t('将所选图片覆盖整个幕墙')))]), _c('br'), _vm._v(" "), _c('el-radio', {
    attrs: {
      "label": 2
    }
  }, [_vm._v(_vm._s(_vm.$t('将所选图片应用到每个单元')))]), _c('br'), _vm._v(" "), _c('el-radio', {
    attrs: {
      "label": 3
    }
  }, [_vm._v(_vm._s(_vm.$t('将所选图片应用到指定单元')))])], 1)], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('图片指定单元')
    }
  }, [_c('el-select', {
    staticClass: "el-select-block",
    attrs: {
      "placeholder": _vm.$t('请选择'),
      "disabled": this.formItem.Type != 3
    },
    on: {
      "change": _vm.setImgToGrid
    },
    model: {
      value: (_vm.formItem.grid),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "grid", $$v)
      },
      expression: "formItem.grid"
    }
  }, _vm._l((_vm.gridList), function(item) {
    return _c('el-option', {
      attrs: {
        "value": item,
        "label": item
      }
    })
  }))], 1), _vm._v(" "), _c('div', {
    staticClass: "bgimgbtn"
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.bgImageClear
    }
  }, [_vm._v(_vm._s(_vm.$t('清除背景')))]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.bgImageSubmit
    }
  }, [_vm._v(_vm._s(_vm.$t('应用背景')))])], 1)], 1)], 1)]), _vm._v(" "), _c('el-col', {
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "span": 12
    }
  }, [_c('div', {
    staticClass: "img"
  }, [_c('div', {
    ref: "bgimg",
    staticClass: "bgimg",
    attrs: {
      "id": "bgimg"
    }
  }, _vm._l((_vm.gridList), function(item) {
    return _c('div', {
      ref: item,
      refInFor: true,
      staticClass: "bg-grid",
      style: ({
        'width': _vm.bgScreenWidth,
        'height': _vm.bgScreenHeight
      })
    }, [_c('span', [_vm._v(_vm._s(item))])])
  }))])])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0501b2e8", module.exports)
  }
}

/***/ })

});
//# sourceMappingURL=12.chunk.js.map