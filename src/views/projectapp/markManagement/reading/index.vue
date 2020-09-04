<template>
  <div class="body divStyle">
    <p style="margin-top: 150px">系统升级中，请刷新页面或者点击👇，系统将自动前往【阅卷管理】页面</p>
    <el-button class="body divStyle" type="primary" @click="ckspxq" plain><p style="font-size:10em">点我跳转</p></el-button>
  </div>
</template>
<script>
import { getToken } from 'utils/auth';
export default {
  name: '',
  data() {
    return {

    };
  },
  mounted() {
    const token = getToken();
    window.open('http://passport.yuandingbang.cn/third/tianyin?token=' + token);
    window.location.href = '/#/dashboard';
  },
  methods: {
    ckspxq() {
      const token = getToken();
      window.open('http://passport.yuandingbang.cn/third/tianyin?token=' + token);
    }
  }
};
</script>
<style lang='scss' scoped>
  body{ text-align:center}
  .divStyle{ margin:0 auto; width:600px; height:200px; }
</style>
