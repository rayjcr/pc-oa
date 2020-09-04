<template>
  <div class="app-container switchList">
    <!-- <div class="title">开关配置</div> -->
    <div class="u_TableMain">
      <div class="m_GenTableBox">
      <div class="switchbox">
        <span class="top">开锁考勤：</span>
        <span class="detail">将寝室开锁情况作为考勤记录</span>
        <div class="mycheckbox">
          <input id="kskq" type="checkbox" class="switch" v-model="enableAttendance" @change="saveConfig()"/>
          <label for="kskq"></label>          
        </div>      
      </div>
      <div class="switchbox">
        <span class="top">请假数据同步：</span>
        <span class="detail">用户请假数据会同步到考勤监控中</span>
        <div class="mycheckbox">
          <input id="qjsjtb" type="checkbox" class="switch" v-model="syncLeave" @change="saveConfig()"/>
          <label for="qjsjtb"></label>          
        </div>      
      </div>
      <div class="switchbox">
        <span class="top">远程开锁发送短信：</span>
        <span class="detail">远程开锁时，会发送短信</span>
        <div class="mycheckbox">
          <input id="fsdx" type="checkbox" class="switch" v-model="sendSms" @change="saveConfig()"/>
          <label for="fsdx"></label>          
        </div>      
      </div>
      <div class="switchbox">
        <span class="top">锁离线发送短信：</span>
        <span class="detail">锁离线时，会发送短信</span>
        <div class="mycheckbox">
          <input id="lxfsdx" type="checkbox" class="switch" v-model="msgOffline" @change="saveConfig()"/>
          <label for="lxfsdx"></label>          
        </div>      
      </div>   
      <div class="switchbox" style="margin-bottom:0">
        <span class="top">锁低电量发送短信：</span>
        <span class="detail">锁低电量时，会发送短信</span>
        <div class="mycheckbox">
          <input id="ddlfsdx" type="checkbox" class="switch" v-model="msgLowPower" @change="saveConfig()"/>
          <label for="ddlfsdx"></label>          
        </div>      
      </div>
      </div>           
    </div>
  </div>
</template>
<script>
import { getConfig,saveConfig } from '@/api/projectapp/dormitoryManagement/logRecord';
export default {
  name: 'switchConfiguration',
  data() {
    return {
      enableAttendance: false,//开锁考勤开关
      syncLeave: false,//请假数据同步开关
      sendSms: false,//发送短信开关
      msgOffline: false,//离线是否发送短信
      msgLowPower: false,//低电量是否发送短信
      id: 0,//提交要带的id不知道是啥
      schoolCode: '',//学校代码?
      switchLoading: false,//系统设置开关加载状态
    }
  },
  methods: {
    init(){
      this.getConfig();
    },
    getConfig(){//获取当前学校的系统配置
      this.switchLoading = true;
      getConfig().then((res)=>{
        if (res.resultCode === 1) {
          this.syncLeave = res.value.syncLeave;
          this.sendSms = res.value.sendSms;
          this.enableAttendance = res.value.enableAttendance;
          this.msgOffline = res.value.msgOffline;
          this.msgLowPower = res.value.msgLowPower;
          this.schoolCode = res.value.schoolCode;
          this.id = res.value.id;
          this.switchLoading = false;
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
          this.switchLoading = false;
        }
      })
    },
    saveConfig(){//保存当前修改的系统配置
      saveConfig({
        enableAttendance: this.enableAttendance,
        id: this.id,
        schoolCode: this.schoolCode,
        sendSms: this.sendSms,
        syncLeave: this.syncLeave,
        msgOffline: this.msgOffline,
        msgLowPower: this.msgLowPower
      }).then((res)=>{
        if (res.resultCode === 1) {
          this.$message({
            type: 'success',
            message: res.resultMessage
          });
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      })
    }
  },
  mounted() {
        //
    this.init();
  }
}
</script>
<style scoped>
.switchList{

}
.title{
  font-family: 'PingFangSC-Regular', 'PingFang SC';
  font-size: 24px;
  line-height: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}
.switchbox{
  height: 40px;
  position: relative;;
  margin-bottom: 19px;
}
.switchbox .top{
	font-family: MicrosoftYaHei;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #262727;
}
.switchbox .detail{
	font-family: MicrosoftYaHei;
	font-size: 12px;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #7d7f80;
  position: absolute;
  left: 0;
  top: 22px;
}
/*开关的大小*/
.mycheckbox {
  position: absolute;
  left: 229px;
  top: 3px;
}

/*设置checkbox不显示*/
.switch {
    display: none;
}

/*设置label标签为椭圆状*/
label {
    display: block;
    background-color: #ccc;
    height: 30px;
    width: 67px;
    cursor: pointer;
    border-radius: 15px;
    -webkit-transition: all 0.5s;
}

/*在label标签内容之前添加如下样式，形成一个未选中状态*/
label:before {
    content: '';
    display: block;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    background-color: white;
    opacity: 1;
    position: relative;
    left: 2px;
    top: 2px;
    /* box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.08); */
    -webkit-transition: all 0.5s;
}

/*选中后，未选中样式消失*/
#kskq:checked~label:before,#qjsjtb:checked~label:before,#fsdx:checked~label:before,#lxfsdx:checked~label:before,#ddlfsdx:checked~label:before {
    /* opacity: 0; */
    left: 39px;
}
/*选中后label的背景色改变*/
#kskq:checked~label,#qjsjtb:checked~label,#fsdx:checked~label,#lxfsdx:checked~label,#ddlfsdx:checked~label  {
    background-color: #409eff;
}
</style>
