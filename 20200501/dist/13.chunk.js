webpackJsonp([13],{

/***/ 394:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(873)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(571),
  /* template */
  __webpack_require__(909),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\login\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-aeaf5318", Component.options)
  } else {
    hotAPI.reload("data-v-aeaf5318", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 571:
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

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        var _this = this;

        var vm = this;
        /*
         * 用户名验证
         */
        var checkName = function checkName(rule, value, callback) {
            if (value === '') {
                vm.$refs['user__input'].$refs['input'].setAttribute('placeholder', '');
                vm.$refs['user__error'].style.display = 'block';
                callback();
            } else {
                if (value.length > 12) {
                    vm.$refs['user__input'].$refs['input'].setAttribute('placeholder', '');
                    vm.$refs['user__error'].style.display = 'block';
                    vm.$refs['user__error'].children[0].innerHTML = _this.$t('用户名长度不能超过12位');
                    callback();
                }
                callback();
            }
        };
        /*
         * 密码验证
         */
        var checkPwd = function checkPwd(rule, value, callback) {
            if (value === '') {
                vm.$refs['pwd__input'].$refs['input'].setAttribute('placeholder', '');
                vm.$refs['pwd__error'].style.display = 'block';
                callback();
            } else {
                if (value.length < 6) {
                    vm.$refs['pwd__input'].$refs['input'].setAttribute('placeholder', '');
                    vm.$refs['pwd__error'].style.display = 'block';
                    vm.$refs['pwd__error'].children[0].innerHTML = _this.$t('密码长度不能小于6位');
                    callback();
                }
                callback();
            }
        };
        return {
            lang: localStorage.lang || '简体中文',
            formInline: { user: 'admin', password: '123456' },
            ruleInline: {
                user: [{ validator: checkName, trigger: 'blur' }],
                password: [{ validator: checkPwd, trigger: 'blur' }]
            }
        };
    },
    created: function created() {
        this.keyLogin();
        //this.lang = localStorage.lang || '简体中文'
        this.handleSubmit();
    },

    methods: {
        handleUserInput: function handleUserInput() {
            this.$refs['user__error'].style.display = 'none';
            this.$refs['user__input'].$refs['input'].focus();
            this.$refs['user__input'].$refs['input'].setAttribute('placeholder', this.$t('用户名'));
        },
        handlePwdInput: function handlePwdInput() {
            this.$refs['pwd__error'].style.display = 'none';
            this.$refs['pwd__input'].$refs['input'].focus();
            this.$refs['pwd__input'].$refs['input'].setAttribute('placeholder', this.$t('密码'));
        },
        handleSubmit: function handleSubmit(name) {
            var _this2 = this;

            var vm = this;
            this.$refs[name].validate(function (valid) {
                if (!valid) {
                    return;
                }
                var url = '/api.v2.do.user.login';
                var params = {
                    "userid": 0,
                    "body": {
                        "Name": _this2.formInline.user,
                        "Password": _this2.formInline.password
                    }
                };
                _this2.$http(url, params).then(function (res) {
                    if (res.data.status !== 0) {
                        _this2.$message({
                            'type': 'warning',
                            'message': _this2.$t(_this2.$msg[res.data.status]),
                            'showClose': true,
                            'duration': 1500
                        });
                        return;
                    }
                    var _ref = [res.data.msg.body.Token, _this2.formInline.user, res.data.msg.body.ID],
                        tk = _ref[0],
                        uName = _ref[1],
                        uid = _ref[2];

                    _this2.$auth.login({ manager: uName, token: tk, id: uid });
                    _this2.$message({
                        'type': 'success',
                        'message': _this2.$t("登录成功"),
                        'showClose': true,
                        'duration': 1500
                    });
                    _this2.$router.push('/');
                }).catch(function (err) {
                    _this2.$message({
                        'type': 'error',
                        'message': _this2.$t('登录失败!'),
                        'showClose': true,
                        'duration': 1500
                    });
                    return;
                });
            });
        },
        keyLogin: function keyLogin() {
            var vm = this;
            window.onkeydown = function () {
                if (window.event.keyCode == 13) vm.handleSubmit('formInline');
            };
        },

        /*
         * 语言切换功能
         */
        languageChange: function languageChange(lang) {
            this.$refs['language'].innerText = lang;
            this.lang = lang;
            this.$store.commit('setLanguage', lang);
        }
    }
});

/***/ }),

/***/ 873:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 909:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "login"
  }, [_c('div', {
    staticClass: "login-panel"
  }, [_c('div', {
    staticClass: "login-form"
  }, [_c('div', {
    staticClass: "language"
  }, [_c('el-dropdown', {
    attrs: {
      "trigger": "click",
      "menu-align": "start"
    },
    on: {
      "command": _vm.languageChange
    }
  }, [_c('div', {
    staticClass: "language-inner"
  }, [_c('span', {
    ref: "language"
  }, [_vm._v(_vm._s(_vm.lang))]), _vm._v(" "), _c('i', {
    staticClass: "el-icon-caret-bottom el-icon--right"
  })]), _vm._v(" "), _c('el-dropdown-menu', {
    staticClass: "language-dropdown",
    attrs: {
      "slot": "dropdown"
    },
    slot: "dropdown"
  }, [_c('el-dropdown-item', {
    attrs: {
      "command": "简体中文"
    }
  }, [_vm._v("简体中文")]), _vm._v(" "), _c('el-dropdown-item', {
    attrs: {
      "command": "English"
    }
  }, [_vm._v("English")])], 1)], 1)], 1), _vm._v(" "), _c('el-form', {
    ref: "formInline",
    attrs: {
      "model": _vm.formInline,
      "rules": _vm.ruleInline,
      "label-width": "80px",
      "label-position": "left"
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "user",
      "label": _vm.$t('用户名')
    }
  }, [_c('el-input', {
    ref: "user__input",
    attrs: {
      "type": "text",
      "placeholder": _vm.$t('用户名')
    },
    model: {
      value: (_vm.formInline.user),
      callback: function($$v) {
        _vm.$set(_vm.formInline, "user", $$v)
      },
      expression: "formInline.user"
    }
  }), _vm._v(" "), _c('div', {
    ref: "user__error",
    staticClass: "user__error",
    on: {
      "click": function($event) {
        _vm.handleUserInput()
      }
    }
  }, [_c('span', [_vm._v(_vm._s(_vm.$t('请填写用户名')))])])], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "prop": "password",
      "label": _vm.$t('密码')
    }
  }, [_c('el-input', {
    ref: "pwd__input",
    attrs: {
      "type": "password",
      "placeholder": _vm.$t('密码')
    },
    model: {
      value: (_vm.formInline.password),
      callback: function($$v) {
        _vm.$set(_vm.formInline, "password", $$v)
      },
      expression: "formInline.password"
    }
  }), _vm._v(" "), _c('div', {
    ref: "pwd__error",
    staticClass: "pwd__error",
    on: {
      "click": function($event) {
        _vm.handlePwdInput()
      }
    }
  }, [_c('span', [_vm._v(_vm._s(_vm.$t('请填写密码')))])])], 1), _vm._v(" "), _c('div', {
    ref: "login-btn",
    staticClass: "login-btn"
  }, [_c('el-form-item', [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        _vm.handleSubmit('formInline')
      }
    }
  }, [_vm._v("\n                        " + _vm._s(_vm.$t('登录')) + "\n                      ")])], 1)], 1)], 1)], 1)])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-aeaf5318", module.exports)
  }
}

/***/ })

});
//# sourceMappingURL=13.chunk.js.map