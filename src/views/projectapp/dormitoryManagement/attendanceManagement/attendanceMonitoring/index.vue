<template>
  <div class="app-container records">
    <!-- <div class="cardtitle">考勤概览</div> -->
    <div class="u_TableMain">
      
      <div class="filter-container">
        <el-button type="primary" style="float: right;margin-right: 15px;/* left: 47px; */" @click="lookTimeSheets">查看入住详情</el-button>
      </div>
      <div class="m_GenTableBox">
      <p style="text-align:center;margin-top: 50px;" v-if="!attendanceLoading && buildings.length == 0">
        <span>暂无数据</span>
      </p>      
      <el-tabs v-else v-model="activeName" @tab-click="handleClick" class="eltabs" v-loading="attendanceLoading"  type="card">
        <el-tab-pane
          v-for="(item,index) in buildings"
          :key="index" 
          :label="formatName(item.name)" 
          :name="index+''"
          >
          <el-date-picker
            v-model="attendanceDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width:323px"
              @change="searchList(item.id)"
            clearable>
          </el-date-picker>
          <el-select v-model="attendanceTime" placeholder="时间段" @change="searchList(item.id)">
            <el-option
              v-for="option in options"
              :key="option.id"
              :label="option.name"
              :value="option.id">
            </el-option>
          </el-select>
          <el-input placeholder="请输入内容" v-model="searchtext" style="width:267px;" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchList(item.id)"></el-button>
          </el-input>          
          <div class="ftitle">
            <el-tooltip v-if="item.name.length > 6" class="item" effect="dark" :content="item.name" placement="bottom-start">
              <span>房源名称：{{formatName(item.name)}}</span>
            </el-tooltip>
            <span v-else>房源名称：{{formatName(item.name)}}</span>
            <span>已打卡：{{buildingydk}}</span>
            <span>未打卡：{{buildingwdk}}</span>
            <span>请假：{{buildingqj}}</span>
          </div>
          <div class="floor" v-loading="buildingsLoading">
            <el-collapse class="elcollapse" v-model="floorId"  @change="handleChange">
              <el-collapse-item class="elcollapseitem" v-for="(floor,index1) in floors" :key="index1" :name="index1">
                <template slot="title">
                  <div class="collapseheader">
                    <span class="headertitle">{{floor.alias}}</span>
                    <div class="headertag ydk"><div class="tag">已打卡</div>：{{floor.ydk?floor.ydk:0}}</div>
                    <div class="headertag wdk"><div class="tag">未打卡</div>：{{floor.wdk?floor.wdk:0}}</div> 
                    <div class="headertag qj"><div class="tag">请假</div>：{{floor.qj?floor.qj:0}}</div> 
                  </div>
                </template>
                <div class="roombox" v-loading="roomboxLoading && floorId[floorId.length-1] == index1">
                  <!-- 只显示寝室类型的房间 -->
                  <div class="room" v-for="(room,index2) in floor.roomList" v-if="room.type==0" :key="index2"> 
                    <div class="roomheader">
                      <span class="roomname" style="display: block;overflow: hidden;text-overflow: ellipsis;width: 169px;white-space: nowrap;" :title="room.name.length>11?room.name:''">{{room.name}}</span>
                      <span class="roominfo">已打卡:{{room.ydk?room.ydk:0}} 未打卡:{{room.ydk?room.allotCount - room.ydk - room.qj:room.allotCount}} 请假:{{room.qj?room.qj:0}}</span>
                    </div>
                    <ul class="roommate">
                      <li class="persontag" v-for="(allot,index3) in room.listAllotInfo" :key="index3" :class="(allot.attendInfoList.length>0&&allot.attendInfoList[0].status==1)?'ydk':(allot.attendInfoList.length>0&&allot.attendInfoList[0].status==2)?'qj':'wdk'">
                        <span class="class">{{allot.fromName}}</span>
                        <span class="name">{{allot.name}}</span>
                      </li>
                      <li style="margin-left:10px" v-if="room.listAllotInfo==null || room.listAllotInfo.length==0">暂无人员</li>
                    </ul>
                  </div>
                  <div v-if="floor.roomList ==null || floor.roomList.length == 0">{{attendanceTime==''?'请选择考勤时间段':'暂无房间'}}</div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
      </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import {getBuildinginfo,getRoominfo,getRoomDetail,attendGetListVo,attendGetCount,attendGetListRules,attendGetListPage,attendGetMessage } from '@/api/projectapp/dormitoryManagement/attendInfo';


export default {
  name: 'attendanceMonitoring',
  data() {
    return {
      activeName: '0',//当前选中房间序号
      buildings: [], //建筑信息列表
      floors: [],//楼层信息列表
      rooms: [{
        status: 0,
      }],//房间信息列表
      attendanceDate: '',//考勤日期
      attendanceTime: '',//考勤时间段
      options: [],//可选的时间段
      buildingwdk: 0,//当前建筑未打卡的数量
      buildingydk: 0,//当前建筑已打卡的数量
      buildingqj: 0,//当前建筑请假的数量
      searchtext: '',//搜索的内容
      building: '',//当前建筑的id
      floorId: [],//实际展开的楼层
      floorId_sync: [],//临时存储的楼层
      intervalId: {},//中断变量
      buildingsLoading: false,//加载建筑信息状态
      roomboxLoading: false,//楼层房间加载信息状态
      attendanceLoading: false,//考勤数据加载状态
    }
  },
  methods: {
        //
    init(){
      this.getBuilding()
      this.intervalId = setInterval(this.getAttendMessage,20000);//每隔20秒查询一次
    } ,   
    getBuilding(){//获取基本建筑列表
      this.attendanceLoading = true;
      getBuildinginfo().then((res)=>{
        return new Promise((resolve,reject)=>{
          if (res.resultCode === 1) {
            this.buildings = res.value;//获取建筑信息
            this.attendanceLoading = false;
            this.building = this.buildings[0].id;//更新当前建筑的id
            this.getRoominfo(this.buildings[0].id);//获取建筑的楼层列表
            resolve();
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
            this.attendanceLoading = false;
            reject();
          }          
        })
      }).then((res)=>{
        this.getAttendListRules();//获取考勤规则列表
      })
    },
    getRoominfo(buildingId){//根据建筑ID获取楼层列表
      this.buildingsLoading = true;
      getRoominfo({
        buildingId,
        schoolCode: '1438'
      }).then((res)=>{
        if (res.resultCode === 1) {
          this.floors = res.value.floors;
          this.getAttendCount(buildingId);
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        } 
      })         
    },
    getRoomDetail(floor){//根据楼层id获取房间列表 
      this.roomboxLoading = true;
      getRoomDetail({
        floorId:floor.id,          
        withAttend: true,
        periodId: this.attendanceTime==''?undefined:this.attendanceTime,
        attendDate: this.attendanceDate=='' && this.attendanceDate == null?undefined:this.attendanceDate,
        keyWords: this.searchtext=='' && this.searchtext == null?undefined:this.searchtext
      }).then((res)=>{
        return new Promise((resolve,reject)=>{
          if (res.resultCode === 1) {
            resolve(res.value);
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
            this.roomboxLoading = false;
            reject();
          }           
        }).then((res)=>{
          this.getAttendListVo(res,floor)
        })
      })
    },
    getAttendListVo(val,tempfloor){//获取已打卡人数并显示
      var temprooms = val;//先存所有房间的信息
      if(val.length>0){//如果有房间
        // attendGetListVo({//获取已打卡人数
        //   schoolCode: localStorage.getItem("xxdm"),
        //   buildingId: this.building,
        // }).then((res)=>{
          // for(var item of val.value){//遍历每个房间
          //   for(var allot of item.listAllotInfo){//遍历每个人
          //     if(allot.)

          //   }
            // for(var floor of val){
            //   if(item.floorId == floor.floorId&&item.buildingId == floor.buildingId){//同一层楼
            //     console.log('find floor'+item.floorId+item.buildingId,177)
            //     var temp = val.find((currentValue)=>{
            //       return currentValue.id == item.roomId//锁定房间
            //     })                        
            //     temp = temp&&temp.listAllotInfo.find((currentValue)=>{
            //       console.log(currentValue.name,item.name,182)
            //       return currentValue.name == item.name //锁定人
            //     })
            //     console.log(temp,181)   
            //     if(temp){//如果存在这个人
            //       console.log('find person',184)
            //       temp.status = item.status;//修改它的状态值为已打卡
            //     }
            //     temprooms = val;//修改要存入的数据
            //   }              
            // }
          // }
          for(var item of temprooms){//循环该层楼的所有寝室
            item.ydk = 0;//设置寝室已打卡数量为0
            item.qj = 0;//设置寝室请假数量为0
            for(var person of item.listAllotInfo){//遍历寝室里的所有人
              if(person.attendInfoList.length >0){
                if(person.attendInfoList[0].status==1){
                  item.ydk++;
                }if(person.attendInfoList[0].status==2){
                  item.qj++;
                }                
              }
            }
          }
          this.rooms = temprooms;//显示房间内容
          tempfloor.roomList = temprooms;
        // })        
      } else {
        this.rooms = temprooms;//没有房间直接显示空
        tempfloor.roomList = temprooms;
      }
      this.roomboxLoading = false;
    },
    getAttendMessage(){//定时获取已打卡信息
      // console.log('send',222)
      attendGetMessage({
        buildingId: this.building,
        attendPeriodId: this.attendanceTime==''?undefined:this.attendanceTime,
      }).then((res)=>{
          if (res.resultCode === 1) {
            if(res.value.length>0){//5分钟内有人更新打卡
              var date = this.attendanceDate;
              this.attendanceDate = '';
              this.getAttendCount(this.building);//更新统计数据
            }
            for(var item of res.value){//遍历每个已打卡的信息       
              for(var floor of this.floors){//遍历所有楼层
                if(item.buildingId == floor.buildingId&&item.floorId == floor.id){//同一层楼
                  // 更新统计数据
                  // this.buildingwdk -- ;this.buildingydk ++;
                  // floor.wdk -- ;floor.ydk ++;
                  if(floor.roomList == null){//未展开楼层不计算只改变统计打卡数量
                    this.$notify({//显示提示
                      title: item.name + item.statusInfo,
                      message: this.buildings[this.activeName].name + item.roomName,
                      type: 'success'
                    });     
                    return ;//退出
                  }
                  var temp = floor.roomList.find((currentValue)=>{
                    return currentValue.id == item.roomId//锁定房间
                  })
                  temp.ydk ++; //修改这个房间的状态          
                  temp = temp&&temp.listAllotInfo.find((val)=>{
                    return val.name == item.name //锁定人
                  })
                  if(temp&&temp.attendInfoList.length == 0){//如果存在这个人且没签到过
                    this.$notify({
                      title: item.name + item.statusInfo,
                      message: this.buildings[this.activeName].name + item.roomName,
                      type: 'success'
                    });     
                    temp.attendInfoList.push(item);//修改它的状态值                    
                  }
                }                
              }
            }
          } else {
            // this.$message({
            //   type: 'error',
            //   message: res.resultMessage
            // });
          }         
      })

    },
    getAttendCount(buildingId = 4){//获取考勤记录统计
      attendGetCount({
        // schoolCode: '1438',
        buildingId,
        attendPeriodId: this.attendanceTime == null?'':this.attendanceTime,
        date: this.attendanceDate!='' && this.attendanceDate == null?'':this.attendanceDate,
      }).then((res)=>{
        if (res.resultCode === 1) {
          this.buildingwdk = 0;
          this.buildingqj = 0 ;
          this.buildingydk = 0;
          for(var item in res.value){//循环获取楼层id
            for(var floor of this.floors){//循环当前楼层id
              if(item == floor.id && res.value[item].length > 0){//两者相同 且 被存入数据不为空就把数据存入
                floor.ydk = res.value[item][1];
                floor.qj = res.value[item][2];
                floor.wdk = res.value[item][0] - floor.ydk - floor.qj;
              }
            }
            if(res.value[item].length > 0){
              this.buildingwdk += (res.value[item][0] - res.value[item][1] - res.value[item][2]);
              this.buildingqj += res.value[item][2];
              this.buildingydk += res.value[item][1];              
            }
          }
          this.buildingsLoading = false;
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
          this.buildingsLoading = false;
        }
      })
    },
    getAttendListRules(){//获取考勤规则列表作为下拉框选项
      attendGetListRules().then((res)=>{
        if (res.resultCode === 1) {
          this.options = res.value;
          this.attendanceTime = this.options[0].id;
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }         
      })
    },
    handleClick(tab, event) {//切换建筑
      // this.attendanceDate = '';//清空日期
      // this.attendanceTime = this.options[0].id;//复位时间
      this.searchtext = '';//清空搜索内容
      this.floorId = [];//清空已展开楼层
      this.floorId_sync = [];
      this.building = this.buildings[tab.index].id;
      this.getRoominfo(this.buildings[tab.index].id);
      this.searchList(this.buildings[tab.index].id);
    },
    handleChange(val) {//切换楼层
      console.log(val,307)
      if(this.floorId_sync.length < val.length){
        this.getRoomDetail(this.floors[val[val.length - 1]]);        
      }
      // if(this.floorId_sync.length < val.length){//新展开
        // console.log(this.floors[val[val.length - 1]],310)

        // this.floorId = val;
      // }
      this.floorId_sync = val;
    },
    lookTimeSheets(){//跳转到人员管理
      this.$router.push({ path: '/buildingManage/accommodationdetails', query: {} });
    },
    searchList(buildingId){//搜索按钮处理
      if(this.searchtext!=''){//如果搜索内容不为空 请求详细数据要展开
        getRoomDetail({
          buildingId,
          withAttend: true,
          periodId: this.attendanceTime==''?undefined:this.attendanceTime,
          attendDate: this.attendanceDate==''?undefined:this.attendanceDate,
          keyWords: this.searchtext==''?undefined:this.searchtext
        }).then((res)=>{
          return new Promise((resolve,reject)=>{
            if (res.resultCode === 1) {
              this.floorId = [];//关闭所有展开的楼层
              this.floorId_sync = [];
              var records = res.value;
              for(var index =0;index<this.floors.length;index++){//循环遍历现有楼层
                this.floors[index].roomList = []
                for(var item of records){//循环遍历获取的楼层                
                  if(item.floorId == this.floors[index].id){//楼层相等
                    // this.rooms.listAllotInfo = item.listAllotInfo;//把房间放入楼层
                    this.floors[index].roomList.push(item);
                    console.log(this.floors[index],335)
                    console.log(item,336)
                    if(this.floorId.indexOf(index)==-1){
                      this.floorId.push(index);                    
                    }
                  }
                }                
              }
              resolve(this.floorId);
            } else {
              this.$message({
                type: 'error',
                message: res.resultMessage
              });
              reject();
            }           
          }).then((res)=>{
            // console.log(res,328);
            // this.getAttendList(res)
          })
        })        
      } else {//如果搜索内容为空 请求数据统计
        this.floorId = [];//关闭所有展开的楼层
        this.floorId_sync = [];
        this.getAttendCount(buildingId);
      }

    },
    formatName(uname){//限制名字长度在6个字以内
      var name = uname + "";
      if(name.length<=6){
        return name;
      } else {
        return name.substring(0,6) + '...'
      }
    }
  },
  mounted() {
        //
    this.init();
  },
  destroyed(){
    //关闭定时查询
    clearInterval(this.intervalId);
  }
}
</script>

<style scoped>

.records .breadcrumbitem{
	font-size: 14px;
	line-height: 24px;
	color: #303133;
  margin-bottom: 19px;
}
.box-card{
	width: 1656px;
	min-height: 980px;
  position: relative;
}
.cardtitle{
  font-size: 24px;
  line-height: 24px;
  font-weight: 600;
	color: #303133;
}
.input-with-select{
	width: 472px;
	height: 40px;
  margin-top: 19px;
}
.eltabs{
  margin-top: 30px;                   
}
.ftitle{
  margin-top: 15px;
  margin-bottom: 19px;
}
.ftitle span{
	font-family: PingFang-SC-Heavy;
	font-size: 16px;
	line-height: 9px;
	color: #303133;  
  margin-right: 65px;
}
.elcollapse{
  width: 100%;
  border: none;
}
.elcollapse .elcollapseitem{
  padding-bottom: 0;
	border: solid 1px #eaedf4;
  margin-bottom: 20px;
}
.el-collapse-item__content{
  padding-bottom: 0;  
}
.collapseheader{
  height: 50px;
  width: 100%;
  box-sizing: border-box;
	background-color: #f5f7fa;
	border: solid 1px #eaedf4;  
}
.headertitle{
	font-family: PingFang-SC-Bold;
	font-size: 18px;
	line-height: 32px;
	color: #606266;
  margin-right: 30px;
} 
.headertitle::before{
  content: " ";
  display: inline-block;
	width: 4px;
	height: 14px;
	background-color: #409eff;
	border-radius: 2px;
  margin-left: 15px;
  margin-top: 18px;
  margin-right: 5px;
}
.headertag{
  display: inline-block;
	font-family: PingFang-SC-Bold;
	font-size: 14px;
	line-height: 32px;
  width: 140px;
}
.headertag .tag{
	width: 81px;
	height: 32px;
	border-radius: 16px;
  text-align: center;
  display: inline-block;
}
.roombox{
  padding-top: 10px;
  padding-left: 20px;
	max-height: 548px;
  overflow-y: scroll;
}
.room{
  width: 212px;
  height: 254px;
  margin-right: 40px;
  margin-bottom: 20px;
	border-radius: 4px;
	border: solid 1px #eaedf4;
  display: inline-block;
}
.roomheader{
	width: 210px;
	height: 60px;
	background-color: #f5f7fa;
	border-radius: 4px;
	border-bottom: solid 1px #eaedf4;
  padding-left: 10px;
  padding-top: 6px;
}
.roommate{
	width: 212px;
	height: 190px;
  overflow-x: hidden;
  overflow-y: scroll;

}
.roomheader .roomname{
	font-family: PingFang-SC-Bold;
	font-size: 14px;
	color: #303133;
  display: block;
}
.roomheader .roominfo{
	font-family: PingFang-SC-Regular;
	font-size: 12px;
	letter-spacing: 0px;
	color: #303133;
  margin-top: 9px;
}
.roommate .persontag{
  min-width: 90px;
  min-height: 50px;
  border-radius: 25px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 5px;
  margin-top: 11px;
  margin-left: 7px;
  float: left;
  text-align: center;
}
.persontag .class{
	font-family: PingFang-SC-Regular;
	font-size: 12px;
	line-height: 16px;
	letter-spacing: 0px;
  display: block;
}
.persontag .name{
	font-family: PingFang-SC-Bold;
	font-size: 14px;
	letter-spacing: 0px;
}
.ydk,.rooms .ydk{
	color: #39c362;  
}
.wdk,.rooms .wdk{
  color: #f04864;
}
.qj,.rooms .qj{
	color: #ee9d17;
}
.ydk .tag,.roommate .ydk{
	border: solid 1px #a7e8bb; 	
  background-color: #effff4;   
}
.wdk .tag,.roommate .wdk{
	background-color: #fff6f7;
	border: solid 1px #ffc1cb;
}
.qj .tag,.roommate .qj{
	background-color: #fcf6ec;
	border: solid 1px #f0cb8d;
}
</style>
<style>
.records .el-tabs__item {
    padding: 0 20px;
    width: 140px;
    text-align: center;
}
</style>
