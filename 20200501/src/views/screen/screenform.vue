<template>
    <div class="screenform">
        <el-dialog
            :title="title"
            :visible.sync="modal"
            customClass="screen_modal"
            :close-on-click-modal="false"
        >
            <el-form ref="screen_form" :model="formItem" :rules="formRules" label-width="125px" label-position="left" >
                <el-form-item :label="$t('屏组名称')" prop="Name">
                    <el-input v-model="formItem.Name" :placeholder="$t('请输入')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Led屏')" prop="IsLed">
                    <el-switch active-value="1" inactive-value="0" v-model="formItem.IsLed"></el-switch>
                </el-form-item>
                <el-form-item :label="$t('行×列')">
                    <el-row>
                        <el-col :span="11">
                        <el-form-item prop="Rows">
                         <div :class="{'el-input': true, 'is-disabled': op == 'edit' || formItem.IsLed == '1'}">
                            <input class="el-input__inner"  type="number" max="100" min="1" step="1" v-model="formItem.Rows" :placeholder="$t('请选择')" :disabled="op == 'edit' || formItem.IsLed == '1'"/>
                          </div>
                        </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: center">
                        x</el-col>
                        <el-col :span="11">
                        <el-form-item prop="Columns">
                          <div :class="{'el-input': true, 'is-disabled': op == 'edit' || formItem.IsLed == '1'}">
                            <input class="el-input__inner" type="number" max="100" min="1" step="1" v-model="formItem.Columns" :placeholder="$t('请选择')" :disabled="op == 'edit' || formItem.IsLed == '1'"/>
                          </div>
                        </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item :label="$t('LED宽x高')">
                    <el-row>
                        <el-col :span="11">
                        <el-form-item prop="LedW">
                         <div :class="{'el-input': true, 'is-disabled': op == 'edit' || formItem.IsLed == '0'}">
                            <input class="el-input__inner"  type="number" min="1" step="20" v-model="formItem.LedW" :placeholder="$t('请选择')" :disabled="op == 'edit' || formItem.IsLed == '0'"/>
                          </div>
                        </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: center">
                        x</el-col>
                        <el-col :span="11">
                        <el-form-item prop="LedH">
                          <div :class="{'el-input': true, 'is-disabled': op == 'edit' || formItem.IsLed == '0'}">
                            <input class="el-input__inner" type="number"min="20" step="1" v-model="formItem.LedH" :placeholder="$t('请选择')" :disabled="op == 'edit' || formItem.IsLed == '0'"/>
                          </div>
                        </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item :label="$t('单元屏幕分辨率')" prop="Resolution">
                    <el-select allow-create filterable v-model="formItem.Resolution" filterable  :disabled="op == 'edit'" :placeholder="$t('请选择')">
                        <el-option v-for="(item, index) in resolutions"  :key="'resolution_' + index" :value="item.value" :label="item.label" v-if="item.rotato == (formItem.Degree % 2 != 0)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('逻辑网格')" prop="Grid">
                    <el-select v-model="formItem.Grid" :placeholder="$t('请选择')">
                        <el-option v-for="(item, index) in grids" :key="'grid_' + index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('旋转角度')" prop="Degree">
                    <el-select v-model="formItem.Degree" :placeholder="$t('请选择')" :disabled="op == 'edit' || formItem.IsLed == '1'" @change="degreeChange">
                        <el-option v-for="(item, index) in degrees" :key="'degree_' + index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('音频绑定输出节点')" >
                    <el-row>
                        <el-col :span="11">
                        <el-form-item prop="AudioX">
                            <input class="el-input__inner" type="number" max="100" min="1" step="1" v-model="formItem.AudioX" :placeholder="$t('请选择')"/>
                        </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: center">
                        x</el-col>
                        <el-col :span="11">
                        <el-form-item prop="AudioY">
                            <input class="el-input__inner" type="number" max="100" min="1" step="1" v-model="formItem.AudioY" :placeholder="$t('请选择')"/>
                        </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button style="padding: 10px 18px;" @click="modal = false">{{$t('取消')}}</el-button>
                <el-button type="info" style="padding: 10px 18px;" @click="handleSubmit('screen_form', false)">{{$t('跳过下一步,保存')}}</el-button>
                <el-button type="primary" style="padding: 10px 18px;" @click="handleSubmit('screen_form', true)">{{$t('下一步')}}</el-button>
                
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import data from './data'

    export default {
        name: 'screenform',
        data () {
            var validateResolution = (rule, value, callback) => { 
                if(value === '') {
                   callback(new Error(this.$t('分辨率不能为空')))
                } else {
                    var mailReg = /^[1-9][0-9]*\*[1-9][0-9]*$/
                    if(mailReg.test(value)) {
                        callback()
                    } else {
                        callback(new Error(this.$t('请输入正确的分辨率,如1902*1080')))
                    }
                }
            }
            return {
                //弹窗属性
                modal: false,
                //分辨率
                resolutions: data.resolutions,
                //逻辑网格
                grids: data.grids,
                //旋转角度
                degrees: data.degrees,
                //表单数据
                formItem: {
                    ID: '', Name: '', Rows: 4, Columns: 4, Resolution: '1920*1080', Grid: '4x4', Degree: 0, AudioX: 1, AudioY: 1, LedW: 0, LedH: 0, IsLed: 0
                },
                //表单验证
                formRules: {
                    Name: [
                        {required: true, message: this.$t('请填写名称'), trigger: 'blur'},
                        { type: 'string',  max: 12, message: this.$t('名称长度不能超过12位'), trigger: 'blur' }
                    ],
                    Resolution: [
                        { validator: validateResolution, trigger: 'change' }
                    ]
                },
                op: 'add', 
                title: '',
            }
        },
       
        methods: {
            abc: function() {
                console.error(this.op, this.formItem.IsLed, this.op == 'edit', !!this.formItem.IsLed)
                return (op == 'edit' || !!formItem.IsLed)
            },
          
            /**
             * 显示弹窗， 由父级调用
             */
            _setmodal: function (status) {
                this.modal = status
            },

            setFormData: function (data, title, op) {
                this.op = op
                this.title = title
                this.formItem = data
            },

            degreeChange: function(newVal, oldVal) {
                if(parseInt(newVal) % 2 == 0) {
                    if(this.formItem.Resolution == '1920*1080' || this.formItem.Resolution == '3840*2160')  return               
                } else {
                    if(this.formItem.Resolution == '1080*1920' || this.formItem.Resolution == '2160*3840')  return
                }
                if(this.formItem.Resolution)
                var reso = this.formItem.Resolution.split('*')
                if(!reso || reso.constructor != Array || reso.length != 2) return
                this.formItem.Resolution = reso[1] + '*' + reso[0]
            },

            handleSubmit (name, isNext) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$emit('formsubmit', this.op, this.formItem, isNext)
                    }
                })
            },

        }
    }
</script>