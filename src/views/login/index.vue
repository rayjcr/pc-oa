<template>
  <div class="login-container">
    <el-form auto-complete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
      <h3 class="title">{{title}}</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <icon-svg icon-class="jiedianyoujian"></icon-svg>
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" auto-complete="off" placeholder="超管账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <icon-svg icon-class="mima"></icon-svg>
        </span>
        <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" auto-complete="off" placeholder="超管密码"></el-input>
      </el-form-item>
      <el-form-item prop="othername" v-if="loginForm.simulationFlag" >
        <span class="svg-container">
          <icon-svg icon-class="mima"></icon-svg>
        </span>
        <el-input name="othername" type="text" v-model="loginForm.othername" auto-complete="off" placeholder="对方账户"></el-input>
      </el-form-item>
      <el-form-item prop="yzm" v-if="error_count>=3">
         <span class="svg-container">
          <icon-svg icon-class="mima"></icon-svg>
         </span>
        <el-input style="width: 45%" name="kaptcha" type="text" v-model="loginForm.kaptcha" auto-complete="off" placeholder="验证码"></el-input>
        <span class="svg-container">
           <img ref = "kaptcha_img" alt="验证码" onclick="this.src='/api/auth/jwt/defaultKaptcha?d='+ new Date() * 1" src="/api/auth/jwt/defaultKaptcha" />
        </span>
      </el-form-item>
      <!-- 后面添加参数起到清除缓存作用 -->
      <div class="resetPwd" @click="resetPwd">重置密码</div>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button style="width:100%;" @click.native.prevent="changeView">
          {{ buttencontent }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-dialog class="changeRolle" title="重置密码" :close-on-click-modal='false' :visible.sync="resetPwdDialog" width="700px" center>
        <div class="pic-warp clearfix">
          <div class="fl pic-div" :class="{'pic-border':step==1}">
            <img src="../../assets/resetPwd/reset_1.png">
            <p class="actived">手机验证</p>
          </div>
          <div class="fl pic-div" :class="{'pic-border':step==2}">
            <img src="../../assets/resetPwd/reset_2_1.png" v-show="step<2">
            <img src="../../assets/resetPwd/reset_2_2.png" v-show="step>=2">
            <p>选择角色</p>
          </div>
          <div class="fl pic-div"  :class="{'pic-border':step==3}">
            <img src="../../assets/resetPwd/reset_3_1.png" v-show="step<3">
            <img src="../../assets/resetPwd/reset_3_2.png" v-show="step>=3">
            <p>重置密码</p>
          </div>
          <div class="fl pic-div" :class="{'pic-border':step==4}">
            <img src="../../assets/resetPwd/reset_4_1.png" v-show="step<4">
            <img src="../../assets/resetPwd/reset_4_2.png" v-show="step>=4">
            <p>完成</p>
          </div>
        </div>

        <div class="stepbox clear step_1" v-show="step==1">
          <div class="rowBox clear">
            <div class="rowTit">手机号:</div>
            <div class="rowCont">
              <input v-model="phoneNo">
            </div>
          </div>
          <div class="rowBox clear">
            <div class="rowTit">验证码:</div>
            <div class="rowCont">
               <input v-model="yzmNo" style="width:140px;margin-right:10px">
               <div class="yzm" @click="getYzm">{{yzmTips}}</div>
            </div>
          </div>
          <div class="nextStep" @click="yzmCheck">下一步</div>
        </div>

        <div class="stepbox clear step_2" v-show="step==2">
          <div class="userListBox">
            <div class="userBox" v-for="(item,index) in userList" @click="checkUser(item.id)">
              <div class="fl head-warp" :class="[item.sex=='1'?'boy':'girl']">
              </div> 
              <div class="head-right">
                <p class="sel-name">
                  <span class="span-name">{{item.name}}</span> 
                  <span class="span-job green">{{item.type==3?'老师':item.type==4?'学生':'管理员'}}</span>
                </p> 
                <p class="sel-school">{{item.description}}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="stepbox clear step_3" v-show="step==3">
          <div class="rowBox clear">
            <div class="rowTit">新密码:</div>
            <div class="rowCont">
              <input v-model="newPwd">
            </div>
          </div>
          <div class="rowBox clear">
            <div class="rowTit">确认密码:</div>
            <div class="rowCont">
               <input v-model="confirmPwd">
            </div>
          </div>
          <div class="nextStep" @click="modifyPwd">确认修改</div>
        </div>


        <div class="stepbox clear step_4" v-show="step==4">

          <div class='successInfo'>密码修改成功 3秒 后自动关闭弹层</div>
        </div>




    </el-dialog>  


    <el-dialog
      class="changeRolle"
      title="选择角色"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <div class="roleWrapper" v-for="item in roleArray" :key="item.id" @click="loginFinal(item)" >
        <p style="font-size:14px;">{{item.description}}</p>
        <p style="font-size:16px;color:black;">{{item.name}}
          <span v-if="item.type == 4" class="sftype sftypea">学生</span>
          <span v-if="item.type == 3" class="sftype sftypeaa">教师</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">退出登录</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { lga,getvalidateYzm,validatePhone,checkValidate,editPwd,getDingToken } from 'api/login';
import { setToken } from 'utils/auth';
export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    /** 验证码验证**/
    const validateYzm = (rule, value, callback) => {
      if (value.length < 0) {
        callback(new Error('验证码不能为空'));
      } else {
        getvalidateYzm({ yzm: value }).then(res => {
          if (res.data) {
            callback();
          } else {
            callback(new Error('验证码不正确'));
          }
        });
      }
    };
    return {
      roleArray: [], //角色数组
      title: '系统登录',
      buttencontent: '模拟登录',
      centerDialogVisible: false, // 切换账户
      loginForm: {
        username: '',
        password: '',
        kaptcha: '',
        othername: '',
        hasRolle: '',
        simulationFlag: false
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '账户不能为空',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass
          }
        ],
        kaptcha: [
          {
            required: false,
            trigger: 'blur',
            // validator: validateYzm
          }
        ],
        othername: [
          {
            required: true,
            trigger: 'blur',
            message: '账户不能为空'
          }
        ]
      },
      loading: false,
      step:1,
      showDialog: false,
      error_count: 0,
      resetPwdDialog: false,
      phoneNo:'',
      yzmNo:'',
      yzmTips:'发送验证码',
      yzmTime:60,
      userList:[],
      newPwd:'',
      confirmPwd:'',
      userId:'',
      userToken:'',
    };
  },
  methods: {
    async checkUser(userId){
      this.userId = userId;
      let res = await checkValidate({'password':this.yzmNo,'username':this.phoneNo,'userId':this.userId})
      console.log(res,'res')
      if(res.status!=200){
        this.$notify({type: 'warning',message:'数据访问出错',time: 1000})
        this.step = 1;
        return false;
      }else{
        this.userToken = res.data
      }
      this.step = 3;
    },
    async modifyPwd(){
      if(!this.newPwd||!this.confirmPwd){
        this.$notify({type: 'warning',message: '请填写新密码和确认密码',time: 1000})
        return false
      }
      if(this.newPwd!=this.confirmPwd){
        this.$notify({type: 'warning',message: '新密码和确认密码不同，请重新输入',time: 1000})
        return false
      }
      let params = {}
      params.newPass = this.newPwd;
      params.token = this.userToken;
      let pwdRes = await editPwd(params);
      console.log(pwdRes,'pwdRes')
      if(pwdRes.status!=200){
        this.$notify({type: 'warning',message:pwdRes.message,time: 1000})
        // this.step = 1;
      }else{
        this.$notify({type: 'success',message:'密码重置成功',time: 1000})
        this.step = 4;
        setTimeout(() => {
          this.resetPwdDialog = false;
          // this.step = 1;
        }, 3000);
      }
    },
    async yzmCheck(){
      if(!this.phoneNo||!this.yzmNo){
        this.$notify({type: 'warning',message: '请输手机号码和验证码',time: 1000}) 
      }
      let res = await checkValidate({'password':this.yzmNo,'username':this.phoneNo,'userId':''})
      if(res.status!=200){
        this.$notify({type: 'warning',message: res.message,time: 1000}) 
        return false;
      }else{
        if(typeof(res.data) == 'string'){
          this.userToken = res.data;
          this.step = 3;
        }else{
          this.step = 2;
          this.userList = res.data;
        }
        // this.yzmSetTimeout();
        // this.yzmTips = this.yzmTime + "S"
      }
      console.log(res,'res')
    },
    async getYzm(){
      if(this.yzmTime!=60){
        return
      }
      if(!this.phoneNo){
        this.$notify({type: 'warning',message: '请输出手机号码',time: 1000})    
        return false;
      }
      let res = await validatePhone({'username':this.phoneNo});
      if(res.status!=200){
        this.$notify({type: 'warning',message: res.message,time: 1000}) 
        return false;
      }else{
        this.yzmSetTimeout();

        this.yzmTips = this.yzmTime + "S"
      }
    },
    yzmSetTimeout(){
      setTimeout(() => {
        this.yzmTime = this.yzmTime - 1;
        this.yzmTips = this.yzmTime + "S"
        if(this.yzmTime==0){
          this.yzmTips = '再次发送';
          this.yzmTime = 60;
        }else{
          this.yzmSetTimeout();
        }
      }, 1000);
    },
    resetPwd(){
      this.resetPwdDialog = true;
    },
    changeView() {
      this.loginForm.simulationFlag = !this.loginForm.simulationFlag;
      if (this.loginForm.simulationFlag) {
        this.title = '模拟登录'
        this.buttencontent = '返回系统登录'
      } else {
        this.title = '系统登录'
        this.buttencontent = '返回模拟登录'
      }
    },
    loginFinal(item){
      this.loading = true;
      this.$store
          .dispatch('loginByEmailadmin', {
              username: item.username,
              password: item.password,
            userId: item.id,
            })
          .then(res => {
            this.loading = false;
            setToken(res.data);
            this.$router.push({
              path: '/'
            });
          })
          .catch(() => {
            this.loading = false;
          });
    },
    handleLogin() {
      if (!this.loginForm.simulationFlag) {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            console.log(this.loginForm,'6655')
            this.$store
                .dispatch('loginByEmailadmin', this.loginForm)
                .then(res => {
                  console.log(res,"ressssss")
                  if (res.status !== 200) {
                    this.error_count = res.status;
                    this.$refs.kaptcha_img.click();
                  }
                  if(localStorage.getItem('moreUserRoleInfo')){
                    let tempAr = []
                    let atempAr = []
                    let tempArr = JSON.parse(localStorage.getItem('moreUserRoleInfo'))
                    tempArr.forEach((itemaaa, indexaaa) => {if(itemaaa.type == 3) atempAr.push(itemaaa)})
                    this.roleArray = atempAr
                  }else{
                    this.roleArray = []
                  }

                  if(this.roleArray.length > 0){
                    this.centerDialogVisible = true;
                    this.loading = false;
                    return
                  }
                  this.loading = false;
                  this.$router.push({
                    path: '/'
                  });
                })
                .catch(() => {
                  this.loading = false;
                });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        return;
      }

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
              .dispatch('LoginByEmail', this.loginForm)
              .then(res => {
                this.loading = false;
                  if(localStorage.getItem('moreUserRoleInfo')){
                    this.roleArray = JSON.parse(localStorage.getItem('moreUserRoleInfo'))
                  }else{
                    this.roleArray = []
                  }

                if(this.roleArray.length > 0){
                  this.centerDialogVisible = true;
                  return
                }
                this.$router.push({
                  path: '/'
                });
              })
              .catch(() => {
                this.loading = false;
              });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1);
      // const hashObj = getQueryObject(hash);
      // const originUrl = window.location.origin;
      // history.replaceState({}, '', originUrl);
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // };
      // const codeName = hashObj[codeMap[this.auth_type]];
      // if (!codeName) {
      //   alert('第三方登录失败');
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' });
      //   });
      // }
    },
    _getQueryId(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      const r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return '';
    },
    async getTokenByDingId(duserid,appkey,menu){
      let res = await getDingToken({duserid:duserid,appkey:appkey});
      if(res.status==200){
        this.$store.dispatch('SetToken',res.data)
        setToken(res.data);
        if(menu=='qualityAppraisal'){
          this.$router.push({path: '/qualityAppraisal/situation'});
        }else{
          this.$router.push({path: '/'});
        }
      }
    },
  },
  created() {
    let menu = this._getQueryId("menu");
    let duserid = this._getQueryId("duserid");
    let loginType = this._getQueryId("type");
    let appkey = this._getQueryId("appkey");
    if(loginType){
      if(loginType == 'ding'){
        this.getTokenByDingId(duserid,appkey,menu);
      }
    }
    
    // window.addEventListener('hashchange', this.afterQRScan);
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan);
  }
};
</script>
<style lang='scss' scoped>
.resetPwd{
  color: #FFF;
  font-size: 14px;
  width: 100%;
  text-align: right;
  cursor: pointer;
  margin-bottom: 20px;
}
.resetPwd:hover{
  color: #FF9600;
}
.pic-warp{
  height: 140px;
  width: 480px;
  padding-top: 20px;
  margin: 0 auto;
  border-bottom: 1px solid #dcdfe6;
  .pic-div{
    width: 60px;
    height: 120px;
    margin-right: 80px;
    img{
      width: 100%;
      display: block;
    }
    p{
      margin-top: 10px;
      width: 100%;
      display: block;
      text-align: center;
    }
  }
  .pic-div:last-child{
    margin-right: 0px;
  }
  .pic-border{
    border-bottom: 2px solid #1eac3f;
  }
}
.stepbox{
  height: 250px;
  .successInfo{
    width: 100%;
    padding: 40px 0;
    text-align: center;
    font-size: 20px;
  }
  .rowBox{
    margin-left: 150px;
    margin-top: 30px;
    .rowTit{
      font-size: 16px;
      line-height: 40px;
      margin-right: 10px;
      width:80px;
    }
    .rowCont{
      input{
        float: left;
        border: 1px solid #aaa;
        height: 40px;
        border-radius: 5px;
        width: 250px;
        font-size: 14px;
        color: #333;
      }
      .yzm{
        float: left;
        width: 100px;
        height:40px;
        margin:0 auto;
        background: #22c196;
        border-radius: 5px;
        text-align: center;
        line-height: 40px;
        color: #FFF;
        font-size: 14px;
      }
    }
  }
  .nextStep{
    width: 250px;
    height:40px;
    margin:0 auto;
    background: #22c196;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
    color: #FFF;
    font-size: 16px;
    margin-top: 20px;
  }
}
.userListBox{
  height: 250px;
  width: 100%;
  overflow: auto;
}
.step_2{
  padding: 20px 70px;
  .userBox{
    width: 200px;
    height: 70px;
    margin: 10px;
    padding: 10px 5px;
    border-radius: 5px;
    float: left;
    cursor: pointer;
    .head-warp{
      width:50px;
      height: 50px;
      position: relative;
      overflow: hidden;
      margin-right: 10px;
    }
    .head-warp.boy{
      background: url(../../assets/resetPwd/boy.png) no-repeat;
      background-size: 100% 100%;
    }
    .head-warp.girl{
      background: url(../../assets/resetPwd/girl.png) no-repeat;
      background-size: 100% 100%;
    }
    .sel-school{
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .userBox:hover{
    background: #f2f3f6;
  }
}


</style>
<style rel="stylesheet/scss" lang="scss">
@import 'src/styles/mixin.scss';

.changeRolle .el-dialog{
  min-width: 325px;
}
.roleWrapper{
  cursor: pointer;
border-bottom: 1px solid #e5e5e5;padding-top:10px;padding-left:10px;
}
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
}

.login-container {
  @include relative;
  height: 100vh;
  background-color: #2d3a4b;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    border-radius: 0;
    padding: 12px 5px 12px 15px;
    color: #eeeeee;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: #eeeeee;
    margin: 0 auto 40px;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px;
    margin: 120px auto;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .forget-pwd {
    color: #fff;
  }
}
</style>
<style>
.sftype{
  vertical-align: middle;
  display:inline-block;
  margin-left: 20px;
  font-size: 12px !important;
  padding: 5px 12px;
  border-radius: 16px;
  color: white;
}
.sftypea{
  background-color: #ff9600;
}
.sftypeaa{
  background-color: #00c472;
}
</style>
