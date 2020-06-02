<style lang="less" scoped>
    .radio-block{
        display: block;
        margin-left: 0px!important;
        margin-top: 5px;
    }
    .option{
        max-width: 220px;
        padding-right: 40px;
    }
</style>
<template>
    <div class="roleform">
        <el-dialog
            :title="$t(title)"
            :visible.sync="modal"
            :close-on-click-modal="false"
            size="small"
            >
            <el-form ref="role_form" :model="formItem" :rules="formRules" label-width="100px" label-position="left">
                <el-form-item :label="$t('角色名')" prop="Name">
                    <el-input v-model="formItem.Name" :placeholder="$t('请输入')"></el-input>
                </el-form-item>
                <hr />
                <el-form-item :label="$t('所有权限')">
                    <el-radio-group v-model="formItem.ScreenStatus_1" @change="handleScreenStatus1Change">
                        <el-radio :label="1">{{$t('所有屏组')}}</el-radio>
                        <el-radio :label="0">{{$t('部分屏组')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('屏组列表')">
                    <el-select v-model="formItem.ScreenID_1" :disabled="!!formItem.ScreenStatus_1 || !!formItem.ScreenStatus_2" multiple  filterable :placeholder="$t('请选择')">
                        <el-option
                          class="option" 
                          v-for="(item, $index) in screen"
                          :key="$index"
                          :disabled="checkExistedInScreen2(item)"
                          :label="item.Name"
                          :value="item.ID"
                          >
                        </el-option>
                    </el-select>
                </el-form-item>
                <hr />
                <el-form-item :label="$t('使用权限')">
                    <el-radio-group v-model="formItem.ScreenStatus_2" @change="handleScreenStatus2Change">
                        <el-radio :label="1">{{$t('所有屏组')}}</el-radio>
                        <el-radio :label="0">{{$t('部分屏组')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('屏组列表')">
                    <el-select v-model="formItem.ScreenID_2" :disabled="!!formItem.ScreenStatus_1 || !!formItem.ScreenStatus_2" multiple  filterable :placeholder="$t('请选择')">
                        <el-option
                          class="option" 
                          v-for="(item, $index) in screen"
                          :disabled="checkExistedInScreen1(item)"
                          :key="$index"
                          :label="item.Name"
                          :value="item.ID"
                          >
                        </el-option>
                    </el-select>
                </el-form-item>
                <hr />
                <el-form-item :label="$t('选择信号')">
                    <el-radio-group v-model="formItem.signalStatus">
                        <el-radio :label="1">{{$t('所有信号')}}</el-radio>
                        <el-radio :label="0">{{$t('部分信号')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('信号源')">
                    <el-select v-model="formItem.SourceID" :disabled="!!formItem.signalStatus" multiple  filterable :placeholder="$t('请选择')">
                        <el-option
                          class="option"  
                          v-for="(item, $index) in signal"
                          :key="$index"
                          :label="item.Name"
                          :value="item.ID"
                          >
                        </el-option>
                    </el-select>
                </el-form-item>              
                <el-form-item>
                    <el-button @click="modal = false">{{$t('取消')}}</el-button>
                    <el-button type="primary" @click="handleSubmit('role_form')">{{$t('保存')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                modal:false,
                formItem: { ID: '', Name: '', ScreenStatus_1: 0, ScreenID_1: [], ScreenStatus_2: 0, ScreenID_2: [], signalStatus: 1, SourceID: []},
                formRules: {
                    Name: [
                        {required: true, message: this.$t('请填写名称'), trigger: 'blur'},
                        { type: 'string',  max: 12, message: this.$t('名称长度不能超过12位'), trigger: 'blur' }
                    ],
                },
                op: 'add',
                title: '新建',
            }
        },
        computed: {
            screen: function() {
                return this.$store.state.role.screen
            },
            signal: function() {
                return this.$store.state.role.signal
            }
        },
        methods: {
            _setmodal: function(status) {
                this.modal = status
            },

            setFormData: function (data, title, op) {
                this.op = op
                this.title = title
                this.formItem = data
            },

            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) { 
                        this.$emit('formsubmit', this.op, this.formItem)
                    }
                })
            },

            handleScreenStatus1Change(val){
                if(val === 0) return
                this.formItem.ScreenStatus_2 = 0
            },

            handleScreenStatus2Change(val){
                if(val === 0) return
                this.formItem.ScreenStatus_1 = 0
            },

            checkExistedInScreen2(item) {
                return !(this.formItem.ScreenID_2.indexOf(item.ID) === -1)
            },

            checkExistedInScreen1(item) {
                return !(this.formItem.ScreenID_1.indexOf(item.ID) === -1)
            },
        }
    }
</script>

