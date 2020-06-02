<template>
    <div class="powerplanform">
        <el-dialog
            :title="$t(title)"
            :visible.sync="modal"
            customClass="power_modal"
            :close-on-click-modal="false"
        >
             <el-form ref="powerplan_form" :model="formItem" :rules="formRules" label-width="100px" label-position="left">
                <el-form-item :label="$t('方案名称')" prop='Name'>
                    <el-input v-model="formItem.Name" :placeholder="$t('请输入')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('屏组')" prop="WallID">
                    <el-select v-model="formItem.WallID" :placeholder="$t('请选择所属屏组')">
                        <el-option v-for="item in screenlist" :value="item.ID" :label="$t(item.Name)"></el-option>
                    </el-select>
                </el-form-item>            
                <el-form-item :label="$t('执行时刻')">
                  <el-row>
                    <el-col :span="11">
                    <el-form-item prop="Hours">
                      <div :class="{'el-input': true}">
                        <input class="el-input__inner"  type="number" max="23" min="0" step="1" v-model="formItem.Hours" :placeholder="$t('请选择')"/>
                      </div>
                    </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center">
                    :</el-col>
                    <el-col :span="11">
                    <el-form-item prop="Min">
                      <div :class="{'el-input': true}">
                        <input class="el-input__inner" type="number" max="59" min="0" step="1" v-model="formItem.Min" :placeholder="$t('请选择')"/>
                      </div>
                    </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <hr />
                <el-form-item :label="$t('星期')" prop='Week'>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('全选')}}</el-checkbox>
                    <el-checkbox-group v-model="formItem.Week" @change="handleCheckedWeeksChange">
                      <el-checkbox v-for="(item, index) in weekOptions" :label="item.value" :key="index">{{$t(item.label)}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <hr />
                <el-form-item :label="$t('模式类型')" prop='Mode'>
                  <el-radio class="radio" v-model="formItem.Mode" :label="0">{{$t('循环执行')}}</el-radio>
                  <el-radio class="radio" v-model="formItem.Mode" :label="1">{{$t('执行一次')}}</el-radio>
                </el-form-item>               
                <el-form-item :label="$t('是否启用')" props='Enable'>
                    <el-switch
                      v-model="formItem.Enable"
                      active-color="#20a0ff"
                      inactive-color="#ff4949"
                      :active-text="$t('是')"
                      :inactive-text="$t('否')"
                      :active-value="1"
                      :inactive-value="0">
                    </el-switch>
                </el-form-item>            
                <el-form-item :label="$t('动作')" prop="Action">
                    <el-switch
                      v-model="formItem.Action"  
                      active-color="#20a0ff"
                      inactive-color="#ff4949"
                      :active-text="$t('开机')"
                      :inactive-text="$t('关机')"
                      :active-value="1"
                      :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modal = false">{{$t('取消')}}</el-button>
                <el-button type="primary" @click="handleSubmit('powerplan_form')">{{$t('保存')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'powerplanform',
        props: {
            screenlist: {
                type: Array
            }
        },
        data () {
            var validateWallID = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(this.$t('请选择所属屏组')));
                }
                callback()
            }
            var validateTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(this.$t('请选择执行时刻')));
                }
                callback()
            }
            return {
                modal: false,
                actions:[],
                formItem: { ID: '', Name: '', WallID: '',  Hours: 9, Min: 0, Week:[1,2],  Mode: 0 , Enable: 0, Action: 1},
                formRules: {
                    Name: [
                        {required: true, message: this.$t('请填写名称'), trigger: 'blur'},
                        { type: 'string',  max: 12, message: this.$t('名称长度不能超过12位'), trigger: 'blur' }
                    ],
                    WallID: [
                      {validator: validateWallID, trigger: 'change' }
                    ],
                    Time: [
                      {validator: validateTime, trigger: 'change' }
                    ], 
                   
                },
                
                op: 'add',                  //当前页面的操作类型  添加/编辑
                title: '',
                weekOptions: [{value: 1, label:'星期一'}, {value: 2, label:'星期二'}, {value: 3, label:'星期三'}, {value: 4, label:'星期四'}, {value: 5, label:'星期五'}, {value: 6, label:'星期六'}, {value: 7, label:'星期日'}],
                checkAll: true,
                isIndeterminate: true
            }
        },
        created(){

        },
        methods: {
           _setmodal: function (status) {
                this.modal = status
            },

            setFormData: function (data, title, op) {
                this.formItem = data 
                this.title = title           
                this.op = op
            },

            handleCheckAllChange(event) {
              var weeks = []
              this.weekOptions.forEach(function(item,index) {
                  weeks.push(item.value)
              })
              this.formItem.Week = event.target.checked ? weeks : []
              this.isIndeterminate = false
            },
            handleCheckedWeeksChange(value) {
              let checkedCount = this.weekOptions.length
              this.checkAll = (checkedCount === value.length)
              this.isIndeterminate = (value.length > 0 &&  value.length < checkedCount)
            },
            TimeChange(val) {
              // console.error(val, 146)
              //this.formItem.Time = val
            },
            /**
             * 提交表单操作
             */
            handleSubmit (name) {           
                if(this.formItem.Week.length == 0) {
                      this.$message({
                        'showClose':'true',
                        'duration':'1500',
                        'type': 'warning',
                        'message': this.$t('请设置星期')
                      })
                      return
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$emit('formsubmit', this.op, this.formItem)
                    }
                })
            },
        }
    }
</script>

