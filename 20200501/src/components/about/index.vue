<template>
  <div class="about" >
      <el-button class="info-btn" @click="modal = true"><i class="fa fa-copyright"></i></el-button>
      <el-dialog
              :title="$t('关于软件')"
              :visible.sync="modal"
      >
          <h3>{{$t('智能云控制平台')}}</h3>
          <p>{{$t('版本号')}}：v1.5.1.3</p>
          <p>{{$t('版本所有权')}}：{{$t('（深圳）责任有限公司')}}</p>
          <p>Copyright © 2014-2018 All Right Reserved</p>
          <img src="../../assets/img/aboutSoftware.png" :alt="$t('找不到图片')"/>
      </el-dialog>
  </div>
</template>
<script>
  export default {
     data() {
       return {
         modal: false
       }
     }
  }
</script>