webpackJsonp([3],{

/***/ 407:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(862)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(596),
  /* template */
  __webpack_require__(892),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\users\\userssetting\\usersmanage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] usersmanage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-27207235", Component.options)
  } else {
    hotAPI.reload("data-v-27207235", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 591:
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

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        var _this = this;

        var validatePass = function validatePass(rule, value, callback) {
            if (value === '') {
                callback(new Error(_this.$t('请输入新密码')));
            } else {
                if (value.length < 6) {
                    callback(new Error(_this.$t('新密码长度不能小于6位')));
                } else {
                    callback();
                }
            }
        };
        var validateAdminPass = function validateAdminPass(rule, value, callback) {
            if (!value) {
                return callback(new Error(_this.$t('请输入你现在使用的密码')));
            }
            callback();
        };
        return {
            modal: false,
            formItem: {
                Password: '',
                AdminPassword: '',
                ID: ''
            },
            ruleItem: {
                Password: [{ validator: validatePass, trigger: 'blur' }],
                AdminPassword: [{ validator: validateAdminPass, trigger: 'blur' }]
            }
        };
    },

    methods: {
        handle: function handle(name) {
            this.modal = false;
            this.$refs[name].resetFields();
        },

        _setmodal: function _setmodal(status) {
            this.modal = status;
        },

        setFormData: function setFormData(data) {
            this.formItem = data;
        },

        handleSubmit: function handleSubmit(name) {
            var _this2 = this;

            var vm = this;
            this.$refs[name].validate(function (valid) {
                if (!valid) {
                    _this2.$message({
                        type: 'error',
                        message: _this2.$t('操作失败'),
                        showClose: true,
                        duration: 1500
                    });
                    return false;
                }
                var params = {
                    "userid": _this2.$auth.getuid(),
                    "body": [{
                        "ID": _this2.$auth.getuid(),
                        "Password": _this2.formItem.AdminPassword
                    }, {
                        "ID": _this2.formItem.ID,
                        "Password": _this2.formItem.Password
                    }]
                };
                _this2.ipost('/api.v2.do.user.setpwd', params, function (res) {
                    if (res.data.status !== 0) {
                        _this2.$message({
                            'type': 'warning',
                            'message': _this2.$msg[res.data.status],
                            showClose: true,
                            duration: 1500
                        });
                        return;
                    }
                    _this2.$message({
                        type: 'success',
                        message: _this2.$t('操作成功'),
                        showClose: true,
                        duration: 1500
                    });
                    _this2.handle();
                }, function (err) {});
            });
        }
    }
});

/***/ }),

/***/ 592:
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

        var validatePass = function validatePass(rule, value, callback) {
            if (value === '') {
                callback(new Error(_this.$t('请输入密码')));
            } else {
                if (value.length < 6) {
                    callback(new Error(_this.$t('密码长度不能小于6位')));
                } else {
                    if (_this.formItem.CheckPwd !== '') {
                        _this.$refs.user_form.validateField('CheckPwd');
                    }
                    callback();
                }
            }
        };
        var validatePass2 = function validatePass2(rule, value, callback) {
            if (value === '') {
                callback(new Error(_this.$t('请再次输入密码')));
            } else if (value !== _this.formItem.Password) {
                callback(new Error(_this.$t('两次输入密码不一致')));
            } else {
                callback();
            }
        };
        var checkMail = function checkMail(rule, value, callback) {
            if (value === '') {
                callback();
            } else {
                var mailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/;
                if (mailReg.test(value)) {
                    callback();
                } else {
                    callback(new Error(_this.$t('请填写正确的邮箱')));
                }
            }
        };
        var checkTel = function checkTel(rule, value, callback) {
            if (value === '') {
                callback();
            } else {
                var telReg = /^1(3|4|5|7|8)\d{9}$/;
                if (telReg.test(value)) {
                    callback();
                } else {
                    callback(new Error(_this.$t('请输入正确的号码')));
                }
            }
        };
        var checkRoleID = function checkRoleID(rule, value, callback) {
            if (value === '') {
                callback(new Error(_this.$t('请选择角色')));
            } else {
                callback();
            }
        };
        return {
            modal: false,
            formItem: { ID: '', Name: '', Password: '', CheckPwd: '', Email: '', Phone: '', RoleID: '' },
            formRules: {
                Name: [{ required: true, message: this.$t('请填写名称'), trigger: 'blur' }, { type: 'string', max: 12, message: this.$t('名称长度不能超过12位'), trigger: 'blur' }],
                Password: [{ validator: validatePass, trigger: 'blur' }],
                CheckPwd: [{ validator: validatePass2, trigger: 'blur' }],
                Email: [{ validator: checkMail, trigger: 'blur' }],
                Phone: [{ validator: checkTel, trigger: 'blur' }],
                RoleID: [{ validator: checkRoleID, trigger: 'change' }]
            },
            roleList: [],
            op: 'add',
            title: ''
        };
    },
    created: function created() {},

    methods: {
        _setmodal: function _setmodal(status) {
            this.modal = status;
        },

        setFormData: function setFormData(data, title, op) {
            this.op = op;
            this.title = title;
            this.formItem = data;
            this.getRoleList();
        },

        handleSubmit: function handleSubmit(name) {
            var _this2 = this;

            this.$refs[name].validate(function (valid) {
                if (valid) {
                    _this2.$emit('formsubmit', _this2.op, _this2.formItem);
                }
            });
        },
        getRoleList: function getRoleList() {
            var _this3 = this;

            var url = '/api.v2.do.role.get',
                params = {
                "userid": this.$auth.getuid(),
                "page": { "start": 0, "limit": 0 }
            };

            this.$http(url, JSON.stringify(params)).then(function (res) {
                if (res.data.status !== 0) {
                    _this3.$message({
                        showClose: true,
                        duration: 1500,
                        'type': 'warning',
                        'message': _this3.$t(_this3.$msg[res.data.status])
                    });
                    _this3.roleList = [];
                    return;
                }
                if (!res.data.msg) {
                    _this3.roleList = [];
                    return;
                }
                _this3.roleList = res.data.msg.body;
            }).catch(function (err) {
                console.log(err);
            });
        }
    }
});

/***/ }),

/***/ 596:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__userform_vue__ = __webpack_require__(884);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__userform_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__userform_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__userchangepsswd_vue__ = __webpack_require__(883);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__userchangepsswd_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__userchangepsswd_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    name: 'usersmanage',
    components: { UserForm: __WEBPACK_IMPORTED_MODULE_0__userform_vue___default.a, PasswdChange: __WEBPACK_IMPORTED_MODULE_1__userchangepsswd_vue___default.a },
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

    methods: {
        list: function list(start, limit) {
            var _this = this;

            var url = '/api.v2.do.user.get',
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
                    return;
                }
                _this.total = res.data.msg.count;
                _this.data = res.data.msg.body;
            }).catch(function (err) {
                console.log(err);
            });
        },

        /**
         * [formatterState description]
         * @param  {[type]} row    [description]
         * @param  {[type]} column [description]
         * @return {[String]}        ['是|否']
         */
        formatterState: function formatterState(row, column) {
            return row.State ? this.$t('已登录') : this.$t('未登录');
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
         * [curChange 用户选中事件]
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
                    'message': this.$t('请先选择要编辑的用户')
                });
                return;
            }
            if (type == 'add') {
                var formData = { Name: '', Password: '', CheckPwd: '', Email: '', Phone: '', RoleID: '' };

                var title = '新建';
            } else {
                var formData = this.getCurrentSelectUser();
                var title = '编辑';
            }
            this.$refs['user_form']._setmodal(true);
            this.$refs['user_form'].setFormData(formData, title, type);
        },

        handleForm: function handleForm(type, data) {
            var _this2 = this;

            if (type == 'add') {
                var url = '/api.v2.do.user.add';
                var params = {
                    userid: this.$auth.getuid(),
                    body: {
                        Name: data.Name,
                        Password: data.Password,
                        Email: data.Email,
                        Phone: data.Phone,
                        RoleID: data.RoleID
                    }
                };
            } else {
                var url = '/api.v2.do.user.edit';
                var params = {
                    userid: this.$auth.getuid(),
                    body: {
                        ID: data.ID,
                        Email: data.Email,
                        Phone: data.Phone,
                        RoleID: data.RoleID
                    }
                };
            }
            this.$http(url, params).then(function (res) {
                if (0 !== res.data.status) {
                    _this2.$message({
                        showClose: true,
                        duration: 1500,
                        'type': 'warning',
                        'message': _this2.$t(_this2.$msg[res.data.status])
                    });
                    return;
                }
                _this2.$message({
                    showClose: true,
                    duration: 1500,
                    type: 'success',
                    message: _this2.$t('操作成功')
                });
                _this2.refresh();
                _this2.$refs['user_form']._setmodal(false);
            }).catch(function (err) {
                _this2.$message({
                    showClose: true,
                    duration: 1500,
                    type: 'error',
                    message: _this2.$t('操作异常')
                });
                return;
            });
        },

        /**
         * 删除用户
         * @return {[type]} [description]
         */
        handleDel: function handleDel() {
            var _this3 = this;

            var vm = this;
            //此处处理删除操作
            if (!this.curId) {
                this.$message({
                    showClose: true,
                    duration: 1500,
                    type: 'error',
                    message: this.$t('请先选择要删除的用户')
                });
                return;
            }
            this.$confirm(this.$t('此操作将永久删除该用户, 是否继续?'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning',
                closeOnClickModal: false
            }).then(function () {
                var id = _this3.curId,
                    url = '/api.v2.do.user.del',
                    params = {
                    "userid": _this3.$auth.getuid(),
                    "body": { "ID": id }
                };
                _this3.$http(url, params).then(function (res) {
                    if (res.data.status != 0) {
                        _this3.$message({
                            showClose: true,
                            duration: 1500,
                            'type': 'warning',
                            'message': _this3.$t(_this3.$msg[res.data.status])
                        });
                        return;
                    }

                    _this3.$message({
                        type: 'success',
                        message: _this3.$t('删除成功'),
                        showClose: true,
                        duration: 1500
                    });
                    vm.refresh();
                }).catch(function (err) {
                    vm.$message({
                        type: 'warning',
                        message: _this3.$t('删除失败'),
                        showClose: true,
                        duration: 1500
                    });
                });
            }).catch(function () {});
        },

        changePasswd: function changePasswd(index, row) {
            var uid = this.$auth.getuid();
            if (uid != 1) {
                this.$message({
                    type: 'warning',
                    message: this.$t('该用户不是管理员,不能修改用户密码'),
                    duration: 1000,
                    showclose: true
                });
                return;
            }
            var data = {
                Password: '',
                AdminPassword: '',
                ID: row.ID
            };
            this.$refs['passwd_form']._setmodal(true);
            this.$refs['passwd_form'].setFormData(data);
        },

        /**
         * [getCurrentSelectUser 获取当前选中的用户信息]
         * @return {[type]} [description]
         */
        getCurrentSelectUser: function getCurrentSelectUser() {
            var vm = this;
            var data = this.data.filter(function (value) {
                return value.ID == vm.curId;
            });
            return JSON.parse(JSON.stringify(data[0]));
        }
    }
});

/***/ }),

/***/ 862:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 883:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(591),
  /* template */
  __webpack_require__(893),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\users\\userchangepsswd.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] userchangepsswd.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2ad8e983", Component.options)
  } else {
    hotAPI.reload("data-v-2ad8e983", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 884:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(592),
  /* template */
  __webpack_require__(907),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "G:\\云拼接\\客户端\\web1.1\\wallweb\\view_el\\src\\views\\users\\userform.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] userform.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9bb03cc4", Component.options)
  } else {
    hotAPI.reload("data-v-9bb03cc4", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 892:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "usersmanage"
  }, [_c('el-row', [_c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('div', {
    staticClass: "tabletools"
  }, [_c('el-button', {
    staticClass: "table-btn",
    on: {
      "click": _vm.refresh
    }
  }, [_c('i', {
    staticClass: "fa fa-refresh mar-rig"
  }), _vm._v(_vm._s(_vm.$t('刷新')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    on: {
      "click": function($event) {
        _vm.openUserForm('add')
      }
    }
  }, [_c('i', {
    staticClass: "el-icon-plus mar-rig"
  }), _vm._v(_vm._s(_vm.$t('新建')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
    on: {
      "click": function($event) {
        _vm.openUserForm('edit')
      }
    }
  }, [_c('i', {
    staticClass: "el-icon-edit mar-rig"
  }), _vm._v(_vm._s(_vm.$t('编辑')))]), _vm._v(" "), _c('el-button', {
    staticClass: "table-btn",
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
      "property": "Name",
      "label": _vm.$t('用户名'),
      "align": "center"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "RoleName",
      "label": _vm.$t('角色'),
      "align": "center"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "Email",
      "label": _vm.$t('邮箱'),
      "align": "center"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "Phone",
      "label": _vm.$t('电话'),
      "align": "center"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "property": "Token",
      "label": _vm.$t('用户令牌'),
      "align": "center"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "label": _vm.$t('登录状态'),
      "align": "center",
      "formatter": _vm.formatterState
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "label": _vm.$t('操作'),
      "align": "center"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(scope) {
        return [_c('el-button', {
          attrs: {
            "disabled": scope.row.ID == 1,
            "size": "small"
          },
          on: {
            "click": function($event) {
              _vm.changePasswd(scope.$index, scope.row)
            }
          }
        }, [_vm._v(_vm._s(_vm.$t('修改密码')))])]
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
  })], 1)])], 1), _vm._v(" "), _c('UserForm', {
    ref: "user_form",
    on: {
      "formsubmit": _vm.handleForm
    }
  }), _vm._v(" "), _c('PasswdChange', {
    ref: "passwd_form"
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-27207235", module.exports)
  }
}

/***/ }),

/***/ 893:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "passWordReset"
  }, [_c('el-dialog', {
    attrs: {
      "title": _vm.$t('修改密码'),
      "visible": _vm.modal,
      "close-on-click-modal": false
    },
    on: {
      "update:visible": function($event) {
        _vm.modal = $event
      }
    }
  }, [_c('el-form', {
    ref: "setpwd",
    attrs: {
      "model": _vm.formItem,
      "rules": _vm.ruleItem,
      "label-width": "100px",
      "label-position": "left"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": _vm.$t('新密码'),
      "prop": "Password"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "password"
    },
    model: {
      value: (_vm.formItem.Password),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Password", $$v)
      },
      expression: "formItem.Password"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('管理员密码'),
      "prop": "AdminPassword"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "password"
    },
    model: {
      value: (_vm.formItem.AdminPassword),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "AdminPassword", $$v)
      },
      expression: "formItem.AdminPassword"
    }
  })], 1), _vm._v(" "), _c('el-form-item', [_c('el-button', {
    on: {
      "click": function($event) {
        _vm.handle('setpwd')
      }
    }
  }, [_vm._v(_vm._s(_vm.$t('取消')))]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.handleSubmit('setpwd')
      }
    }
  }, [_vm._v(_vm._s(_vm.$t('保存')))])], 1)], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2ad8e983", module.exports)
  }
}

/***/ }),

/***/ 907:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "userform"
  }, [_c('el-dialog', {
    attrs: {
      "title": _vm.$t(_vm.title),
      "visible": _vm.modal,
      "close-on-click-modal": false
    },
    on: {
      "update:visible": function($event) {
        _vm.modal = $event
      }
    }
  }, [_c('el-form', {
    ref: "user_form",
    attrs: {
      "model": _vm.formItem,
      "rules": _vm.formRules,
      "label-width": "80px",
      "label-position": "left"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": _vm.$t('用户'),
      "prop": "Name"
    }
  }, [_c('el-input', {
    attrs: {
      "readonly": _vm.op == 'edit'
    },
    model: {
      value: (_vm.formItem.Name),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Name", $$v)
      },
      expression: "formItem.Name"
    }
  })], 1), _vm._v(" "), (_vm.op != 'edit') ? _c('el-form-item', {
    attrs: {
      "label": _vm.$t('密码'),
      "prop": "Password"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "password"
    },
    model: {
      value: (_vm.formItem.Password),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Password", $$v)
      },
      expression: "formItem.Password"
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.op != 'edit') ? _c('el-form-item', {
    attrs: {
      "label": _vm.$t('确认密码'),
      "prop": "CheckPwd"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "password"
    },
    model: {
      value: (_vm.formItem.CheckPwd),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "CheckPwd", $$v)
      },
      expression: "formItem.CheckPwd"
    }
  })], 1) : _vm._e(), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('角色'),
      "prop": "RoleID"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": _vm.$t('请选择')
    },
    model: {
      value: (_vm.formItem.RoleID),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "RoleID", $$v)
      },
      expression: "formItem.RoleID"
    }
  }, _vm._l((_vm.roleList), function(item, $index) {
    return _c('el-option', {
      attrs: {
        "value": item.ID,
        "label": item.Name
      }
    })
  }))], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('邮箱'),
      "prop": "Email"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "text",
      "number": ""
    },
    model: {
      value: (_vm.formItem.Email),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Email", $$v)
      },
      expression: "formItem.Email"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('电话'),
      "prop": "Phone"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "text",
      "number": ""
    },
    model: {
      value: (_vm.formItem.Phone),
      callback: function($$v) {
        _vm.$set(_vm.formItem, "Phone", $$v)
      },
      expression: "formItem.Phone"
    }
  })], 1), _vm._v(" "), _c('el-form-item', [_c('el-button', {
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
        _vm.handleSubmit('user_form')
      }
    }
  }, [_vm._v(_vm._s(_vm.$t('保存')))])], 1)], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-9bb03cc4", module.exports)
  }
}

/***/ })

});
//# sourceMappingURL=3.chunk.js.map