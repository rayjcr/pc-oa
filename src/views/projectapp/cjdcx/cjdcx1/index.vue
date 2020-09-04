<template>
  <div class="body divStyle">
    <p style="margin-top: 150px">系统升级中，请刷新页面或者点击👇，系统将自动前往【成绩单管理】页面</p>
    <el-button class="body divStyle" type="primary" @click="ckspxq" plain><p style="font-size:10em">点我跳转</p></el-button>
  </div>
</template>
<script>

import openWindow from "../../../../utils/openWindow";

export default {
  name: '',
  data() {
    return {

    };
  },
  mounted() {
    const yhm = window.localStorage.getItem('username');
    //window.open('http://ys.91sst.com:8088/szxy/sys_login/login_tyLogin.do?yhm=' + yhm + '&type=zhxy&gnmk=cjcx');
    window.open('http://bg.91sst.com:8080/szxy/sys_login/login_tyLogin.do?yhm=' + yhm + '&type=zhxy&gnmk=cjcx');
    window.location.href = '/#/dashboard';
  },
  methods: {
    ckspxq(){
      const yhm = window.localStorage.getItem('username');
      window.open('http://bg.91sst.com:8080/szxy/sys_login/login_tyLogin.do?yhm=' + yhm + '&type=zhxy&gnmk=cjcx');
    }
  }
};
</script>
<style lang='scss' scoped>
  body{ text-align:center}
  .divStyle{ margin:0 auto; width:600px; height:200px; }
</style>
