<template>
    <div class="marqueesettingform">
        <el-dialog
            :title="title"
            :visible.sync="modal"
            customClass="marquee_modal"
            :close-on-click-modal="false"
            >
              <el-form ref="marqueesetting_form" :rules="formRules" :model="formItem" label-width="100px" label-position='left'>
                <div class="marquee_WallID">
                  <el-form-item :label="$t('选择屏组')" prop="WallID">
                    <el-select  v-model="formItem.WallID" :disabled="op == 'edit'" placeholder=" " class="el-select-block">
                        <el-option
                          v-for="(item,index) in availableScreen"
                          :key="'screen_' + index"
                          :value="item.ID"
                          :disabled="item.disabled"
                          :label="item.Name">
                        </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <el-form-item :label="$t('字幕内容')" prop="Text">
                  <el-input type="textarea"
                            v-model="formItem.Text"
                            :autosize="{minRows: 3, maxRows: 3}"
                            :placeholder="$t('这里是不超过64个字的滚动字幕')"
                            ></el-input>
                </el-form-item>
                  <el-row :gutter="16" class="split_line">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        <el-form-item :label="$t('字体颜色')" prop="Color">
                          <el-color-picker v-model="formItem.Color" show-alpha @change="ColorChange"></el-color-picker>
                        </el-form-item>
                        <el-form-item :label="$t('背景颜色')" prop="BGColor">
                          <el-color-picker v-model="formItem.BGColor" show-alpha @change="BGColorChange"></el-color-picker>
                        </el-form-item>
                        <el-form-item :label="$t('字体类型')" prop="FontType">
                          <el-select  v-model="formItem.FontType"placeholder=" " class="el-select-block">
                              <el-option
                                v-for="(item,index) in fontType"
                                :key="'font_' + index"
                                :value="item.ID"
                                :label="item.Name">
                              </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('滚动方向')" prop="State">
                          <el-select  v-model="formItem.State" placeholder=" " class="el-select-block">
                              <el-option
                                v-for="(item,index) in state"
                                :key="'direction_' + index"
                                :value="item.ID"
                                :label="item.Name">
                              </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('滚动速度')" prop="Speed">
                          <div class="slider">
                            <el-slider v-model="formItem.Speed" :max="5"></el-slider>
                            <input  v-model="formItem.Speed" :readonly="true" />
                          </div>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="marquee_form_right">
                        <el-form-item :label="$t('顶点X坐标')" prop="RectX">
                          <el-input-number v-model="formItem.RectX" :min="0" ></el-input-number>
                        </el-form-item>
                        <el-form-item :label="$t('顶点Y坐标')" prop="RectY">
                          <el-input-number v-model="formItem.RectY" :min="0" ></el-input-number>
                        </el-form-item>
                         <el-form-item :label="$t('字幕的宽')" prop="RectW">
                          <el-input-number v-model="formItem.RectW" :min="1" ></el-input-number>
                        </el-form-item>
                        <el-form-item :label="$t('字幕的高')" prop="RectH">
                          <el-input-number v-model="formItem.RectH" :min="1" ></el-input-number>
                        </el-form-item>
                        <el-form-item :label="$t('字体的宽')" prop="FontW">
                          <el-input-number v-model="formItem.FontW" :min="1" :max="500"></el-input-number>
                        </el-form-item>
                         <el-form-item :label="$t('字体的高')" prop="FontH">
                          <el-input-number v-model="formItem.FontH" :min="1" :max="500"></el-input-number>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                 
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="modal = false">{{$t('取消')}}</el-button>
                <el-button type="primary" @click="handleSubmit('marqueesetting_form')">{{$t('保存')}}</el-button>
              </span>
        </el-dialog>
    </div>
</template>
<script>
import util from '../../libs/util.js'
  export default {
    data() {
      var validateText = (rule, value, callback) => {
              if (value === '') {
                  callback(new Error(this.$t('请填写字幕内容')))
              } else {
                  if(value.length > 64 ) {
                      callback(new Error(this.$t('内容长度不能超过64位')))
                  } else {
                        callback()
                  }
              }
          }
      var validateWallID = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(this.$t('请选择所属屏组')));
                }
                callback()
          }
      return {
        formItem: {
          ID: '', WallID: '', Text: '', Color: '', BGColor: '', FontType: 1, FontW: 200, FontH: 200, RectX: 0,
          RectY: 0, RectW: 300, RectH: 300, Speed: 3, State: 0,
        },
        formRules: {
          Text: [
              {validator: validateText, trigger: 'blur'}
          ],
          WallID: [
              {validator: validateWallID, trigger: 'change' }
          ],

        },
        screen: [],
        fontType: [
          {ID: 0, Name: 'Arial'},{ID: 1, Name: this.$t('华文宋体')},{ID: 2, Name: this.$t('楷体')},{ID: 3, Name: this.$t('微软雅黑')},
        ],
        state: [
          {ID: 0, Name: this.$t('静止')},/*{ID: 1, Name: '从左向右滚动'},*/{ID: 2, Name: this.$t('从右向左滚动')}
        ],
        modal: false,
        title: '',
        op: 'add'
      }
    },
    watch: {
       
    },
    computed: {
      marqueeData: function() {
        return this.$store.state.marquee.selected_marquee
      },
      availableScreen: function() {
        var items = [];
        this.screen.forEach((val, index, array)=>{
          let item =  JSON.parse(JSON.stringify(val));
          item.disabled = false
          if(this.marqueeData.length != 0) {
            this.marqueeData.forEach((v,k, arr)=>{
              if(item.ID == v.WallID) {
                item.disabled = true
                return
              }
           })
          }
           items.push(item)
        })

        return items
      }
    },
    created() {
        this.list()
    },
    methods: {
       _setmodal: function (status) {
                this.modal = status
      },
      
       setFormData: function (data, title, op) {
                this.op = op
                this.title = title
                this.formItem = data
      },
      /* 
       * 获取屏组
       */
      list: function() {
        var vm = this
        var params = {
          'userid': this.$auth.getuid()
        }
        this.$http('/api.v2.do.screen.get', params).then((res)=>{
            if (res.data.status !== 0) {
                this.$message({
                    'showClose':'true',
                    'duration':'1500',
                    'type': 'warning',
                    'message': this.$t(this.$msg[res.data.status])
                })
                return
            }
            if (!res.data.msg) {
                this.screen = []
            } else {
                this.screen = res.data.msg.body
            } 
            this.formItem.WallID = ( this.screen.length != 0) ? this.screen[0].ID : ''
        }).catch((err)=>{ })
      },
      ColorChange(val) {
        // var v = util.colorRgbaToInt(val)
        // console.error(v, 'color')
      },
      BGColorChange(val) {
        // var v = util.colorRgbaToInt(val)
        // console.error(v, 'BGColor')
      },


      handleSubmit (name) {
          if(!this.formItem.Color) {
            this.$message({
              'showClose':'true',
              'duration':'1500',
              'type': 'warning',
              'message': this.$t('请设置字体颜色')
            })
            return
          }
          if(!this.formItem.BGColor) {
            this.$message({
              'showClose':'true',
              'duration':'1500',
              'type': 'warning',
              'message': this.$t('请设置背景颜色')
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
