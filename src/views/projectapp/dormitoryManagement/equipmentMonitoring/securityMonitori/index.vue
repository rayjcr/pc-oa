<template>
  <div class="app-container records">
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item class="breadcrumbitem">智能设备</el-breadcrumb-item>
      <el-breadcrumb-item class="breadcrumbitem">异常记录</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- <el-card class="box-card"> -->
      <div class="u_TableMain">
        <!-- <div class="cardtitle">异常记录</div> -->
        <div class="m_GenTableBox">
        <ul class="notes">
          <li><div class="note normal"></div><span>正常</span></li>
          <li><div class="note warn"></div><span>低电量</span></li>
          <li><div class="note offline"></div><span>离线</span></li>
          <li><div class="note notinstall"></div><span>未安装</span></li>        
        </ul>
        <p style="text-align:center;margin-top: 50px;" v-if="!houseboxesLoading && buildings.length == 0">
          <span>暂无数据</span>
        </p>  
        <ul class="houseboxes" v-loading="houseboxesLoading">
          <li class="housebox" v-for="item in buildings" :key="item.buildingId">
            <div class="header">
              <span class="htitle">{{item.name}}</span>
              <span class="details" @click="showDetails(item.id)">详情 <i class="el-icon-arrow-right"></i></span>
            </div>
            <div class="charts">
              <pie-chart height="200px" width="518px" :buildingId="item.id"></pie-chart>
            </div>
          </li>
        </ul>
        </div>
      </div>
    <!-- </el-card> -->

    <!-- 建筑楼层详细用电情况 -->
    <el-dialog
      title=""
      :visible.sync="centerDialogVisible"
      width="1656px"
      :top="caculateMargin(buildingdataList)"
      class="eldialog">
      <span slot="title" class="dialogtitle">异常记录-{{buildingdataList.name}}</span>
      <el-collapse class="elcollapse"  v-model="openfloors">
        <el-collapse-item class="elcollapseitem" v-for="(item,index) in buildingdataList.floorList" :key="index">
          <template slot="title">
            <div class="collapseheader">
              <span class="headertitle">{{item.alias}}</span>
              <div class="headertag zc"><div class="tag">正常</div>：{{item.normal}}</div>
              <!-- <div class="headertag bj"><div class="tag">报警</div>：{{item.normal}}</div>  -->
              <div class="headertag ddl"><div class="tag">低电量</div>：{{item.lowPower}}</div> 
              <div class="headertag lx"><div class="tag">离线</div>：{{item.offline}}</div> 
              <div class="headertag waz"><div class="tag">未安装</div>：{{item.notInstalled}}</div>     
            </div>
          </template>
          <div class="roombox">
            <ul class="rooms">
              <li 
                class="room" 
                v-for="(room,id) in item.roomDetailList" 
                :key="id"
                :class="room.state==4?'waz':room.state==3?'ddl':room.state==2?'lx':'zc'">
                {{room.name}}
              </li>
            </ul>
            <div v-if="item.roomDetailList == null">暂无房间</div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>
<script>
import { deviceGetBuildings,deviceGetDetail } from '@/api/projectapp/dormitoryManagement/abnormalMonitoring';
import pieChart from "./piechart";

export default {
  name: 'securityMonitori',
  components:{
    pieChart
  },
  data() {
    return {
      centerDialogVisible: false,//建筑异常记录详细弹层是否显示
      buildings: [],//建筑名称
      buildingdataList: [],//建筑详细信息(楼层，每层状态总计，每个房间状态)
      openfloors: [],//已展开楼层index列表
      houseboxesLoading: false,//图像数据等待状态
    }
  },
  methods: {
    init(){
      this.getList()
    },
    getList(){//获取建筑列表
      this.houseboxesLoading = true;
      deviceGetBuildings().then((res)=>{//获取建筑列表
        console.log(res);
        if (res.resultCode === 1) {
          this.buildings = res.value;
          this.houseboxesLoading = false;
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
          this.houseboxesLoading = false;
        }
      })

    },
    getDetails(buildingId){//获取建筑里每个楼层的详细列表
      deviceGetDetail({buildingId}).then((res)=>{
          if (res.resultCode === 1) {
            this.buildingdataList = res.value;
            // if(this.buildingdataList.floorList.length>1&&this.buildingdataList.floorList[0].alias.indexOf('-')!=-1){//数组长度大于1且第一个包含‘-’号
            //   this.buildingdataList.floorList.reverse();//调整顺序
            // }
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }                     
        })
    },
    showDetails(id){//点击详细信息
      this.getDetails(id);
      this.openfloors = [];
      this.centerDialogVisible = true;      
    },
    caculateMargin(buildingdataList){//计算弹层高度使其出现在屏幕中间
      if(typeof(buildingdataList.floorList)!='undefined'){
        var length = buildingdataList.floorList.length;//获取内容数量
        var clientHeight = document.documentElement.clientHeight;//获取屏幕高度
        var divHeight = length*54+172;//计算弹层高度= 内容数量）54 + 参数（可调）
        if(clientHeight>divHeight){
          return (clientHeight-divHeight)/2 + 'px'
        }
      }
      return 0 + 'px'
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
.records{
  /* background-color: #fff;
  padding-left: 20px;
  padding-top: 30px; */
}
.records .breadcrumbitem{
	font-size: 14px;
	line-height: 24px;
	color: #303133;
  margin-bottom: 19px;
}
.pagination{
  position: absolute;
  right: 30px;
  bottom: 0px;
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
.notes{
  margin-top: 16px;
}
.notes li{
  display: inline-block;
	font-size: 14px;
	line-height: 24px;
	color: #303133;
  margin-right: 20px;
}
.note{
	width: 24px;
	height: 14px;
	border-radius: 2px;
  display: inline-block;
  margin-right: 10px;
  position: relative;
  left: 0;
  top: 2px;
}
.normal{
	background-color: #2fc25b;  
}
.warn{
	background-color: #facc14;  
}
.offline{
	background-color: #d1d4da;  
}
.notinstall{
	background-color: #eceff4;  
}
.housebox{
  width: 518px;
	height: 250px;
	background-color: #ffffff;
	box-shadow: 0px 3px 9px 0px 
		rgba(0, 0, 0, 0.05);
	border: solid 1px #eaedf4;
  display: inline-block;
  margin-right: 17px;
  margin-bottom: 20px;
}
.housebox .header{
	width: 518px;
	height: 50px;
	background-color: #f5f7fa;
	border: solid 1px #eaedf4;
}
.housebox .header .htitle{
  font-family: PingFang-SC-Bold;
  font-size: 18px;
  line-height: 48px;
  color: #303133;
  max-width: 280px;
  height: 50px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.housebox .header .htitle::before,.headertitle::before{
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
.housebox .header .details{
  float: right;
	font-family: PingFang-SC-Regular;
	font-size: 14px;
	line-height: 48px;
	color: #606266;
  margin-right: 20px;
  cursor:pointer;
}
.dialogtitle{
	font-family: PingFang-SC-Bold;
	font-size: 18px;
	line-height: 24px;
	letter-spacing: 0px;
	color: #303133;
  float: left;
  margin-bottom: 10px;
}
.elcollapse{
  width: 1616px;
}
.elcollapse .elcollapseitem{
  padding-bottom: 0;
	border: solid 1px #eaedf4;
  margin-bottom: 20px;
}
.collapseheader{
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
.headertag{
  display: inline-block;
	font-family: PingFang-SC-Bold;
	font-size: 14px;
	line-height: 32px;
  width: 140px;
}
.headertag .tag{
	width: 80px;
	height: 32px;
	border-radius: 4px;
  text-align: center;
  display: inline-block;
}
.roombox{
  /* height: 280px; */
  overflow-y: scroll; 
  padding: 20px;
}
.rooms .room{
	width: 130px;
	height: 60px;
  line-height: 60px;
  text-align: center;
	background-color: #effff4;
	border-radius: 6px;
	border: solid 1px #a7e8bb;
	font-family: PingFang-SC-Bold;
	font-size: 18px;
	color: #39c362;
  display: inline-block;
  margin-right: 35px;
  margin-bottom: 30px;
  position: relative;
}
.rooms .room::after{
  content: " ";
  display: inline-block;
	width: 10px;
	height: 30px;
	border-radius: 0px 5px 5px 0px;
  position: absolute;
  left: 129px;
  top: 14px;
}
.rooms .zc::after{
	background-color: #a7e8bb;  
}
.rooms .bj::after{
	background-color: #ffc1cb;
}
.rooms .ddl::after{
	background-color: #f0cb8d;
}
.rooms .lx::after{
	background-color: #ebeef1;
}
.rooms .waz::after{
	background-color: #ffffff;
}
.zc,.rooms .zc{
	color: #39c362;  
}
.bj,.rooms .bj{
  color: #f04864;
}
.ddl,.rooms .ddl{
	color: #ee9d17;
}
.lx,.rooms .lx{
	color: #8f9297;
}
.waz,.rooms .waz{
	color: #c7cacc;
}
.zc .tag,.rooms .zc{
	border: solid 1px #a7e8bb; 	
  background-color: #effff4;   
}
.bj .tag,.rooms .bj{
	background-color: #fff6f7;
	border: solid 1px #ffc1cb;
}
.ddl .tag,.rooms .ddl{
	background-color: #fcf6ec;
	border: solid 1px #f0cb8d;
}
.lx .tag,.rooms .lx{
	background-color: #ebeef1;
	border: solid 1px #d0d4d9;
}
.waz .tag,.rooms .waz{
	background-color: #ffffff;
	border: solid 1px #e6e9ec;
}

</style>
