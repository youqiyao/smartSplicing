webpackJsonp([10],{

/***/ 405:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(870)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(594),
  /* template */
  __webpack_require__(904),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\users\\userssetting\\logosetting.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] logosetting.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-839939e6", Component.options)
  } else {
    hotAPI.reload("data-v-839939e6", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 594:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_config__ = __webpack_require__(121);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            uploadUri: __WEBPACK_IMPORTED_MODULE_0__config_config__["a" /* default */].apiDomain + '/api.v2.uploadLogo',
            image_Name: ''
        };
    },

    computed: {},
    created: function created() {},
    beforeRouteLeave: function beforeRouteLeave(to, from, next) {
        this.$store.commit('setPreviewLogoUrl', '');
        this.$store.commit('setPreviewLogoStatus', 0);
        next();
    },

    methods: {
        /*
         * 上传文件成功后的钩子函数
         * @param res
         * @param file
         * @param fileLst
         */
        uploadSucc: function uploadSucc(res, file) {
            if (!res.status) {
                this.$message({
                    'showClose': true,
                    'duration': 1500,
                    'type': 'warning',
                    'message': this.$t('请上传PNG格式图片')
                });
                return;
            }
            this.imageLogoName = res.image_Name;
            this.$store.commit('setPreviewLogoUrl', res.image_path);
            this.$store.commit('setPreviewLogoStatus', 1);
        },


        /**
         * 上传文件出错的钩子函数
         * @param err
         * @param file
         * @param fileLst
         */
        uploadErr: function uploadErr(err, file) {
            // console.error(76)
        },

        //            保存Logo操作
        saveLogo: function saveLogo() {
            var _this = this;

            var url = '/api.v2.saveLogo';
            var params = {
                userid: this.$auth.getuid()
            };
            this.$http(url, params).then(function (res) {
                var logoUrlArray = _this.$store.state.logoPath.split('=');
                var logoUrl = logoUrlArray[0] + '=' + Date.now();
                _this.$store.commit('setLogoPath', logoUrl);
                _this.$message({
                    'type': 'success',
                    'message': _this.$t('保存成功'),
                    'duration': 1000,
                    'showClose': true
                });
            }).catch(function (err) {});
        }
    }
});

/***/ }),

/***/ 870:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 904:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "logosetting"
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
      "span": 12
    }
  }, [_c('el-col', {
    staticStyle: {
      "height": "calc(100% - 130px)"
    },
    attrs: {
      "span": 24
    }
  }, [_c('div', {
    staticClass: "logoform"
  }, [_c('el-upload', {
    ref: "uploadLogo",
    staticClass: "upload-logo",
    attrs: {
      "drag": "",
      "accept": "image/png",
      "on-success": _vm.uploadSucc,
      "on-error": _vm.uploadErr,
      "name": "image_path",
      "action": _vm.uploadUri,
      "multiple": false,
      "show-file-list": false
    }
  }, [_c('i', {
    staticClass: "fa fa-cloud-upload"
  }), _vm._v(" "), _c('div', {
    staticClass: "el-upload__tip"
  }, [_vm._v(_vm._s(_vm.$t('将文件拖到此处，或点击上传')))]), _vm._v(" "), _c('div', {
    staticClass: "el-upload__text"
  }, [_vm._v(_vm._s(_vm.$t('请上传'))), _c('span', {
    staticStyle: {
      "color": "#20a0ff"
    }
  }, [_vm._v(" 310*60 ")]), _vm._v(_vm._s(_vm.$t('像素的'))), _c('span', {
    staticStyle: {
      "color": "#20a0ff"
    }
  }, [_vm._v(" PNG ")]), _vm._v(_vm._s(_vm.$t('格式的图片')))])])], 1)]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('el-button', {
    staticClass: "logo-btn",
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.saveLogo()
      }
    }
  }, [_vm._v(_vm._s(_vm.$t('保存')))])], 1)], 1), _vm._v(" "), _c('el-col', {
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "span": 12
    }
  }, [_c('div')])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-839939e6", module.exports)
  }
}

/***/ })

});
//# sourceMappingURL=10.chunk.js.map