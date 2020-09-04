<template>
  <div class="app-container deviceMain">
    <div class="u_TableMain">
      <!-- <div class="title">智能网关</div> -->
      <div class="filter-container deviceSelect">
        <el-select  v-model="roomId" class="roomSel" placeholder="请选择寝楼" clearable>
          <el-option
            v-for="item in roomList"
            :key="item.id"
            :label="formatName(item.name)"
            :value="item.id">
          </el-option>
        </el-select>
        
        <el-select  v-model="roomStatus" class="statusSel" placeholder="请选择状态" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input class="searchInput" v-model="searchVal" placeholder="请输入网关名称" clearable></el-input>
        <el-button type="primary" @click="getList(page,limit)">查询</el-button>
        <el-button class="allUnlock" type="primary" @click="addGateway">添加网关</el-button>
      </div>

      <div class="m_GenTableBox">
        <div class="lockList" v-for="(item,index) in dataList" :key="index" v-loading="dataListLoading">
          <div class="lockWarp">
            <p class="lockName">{{item.name}}</p>
          </div>
          <p class="infoDetail"><span class="detail">供应商：{{item.manufacturer}}</span></p>
          <!-- <p class="infoDetail"><span class="detail">网关状态：{{item.connectStatus==0?'离线':'在线'}}(更新时间{{item.bindTime}})</span><span>固件版本：{{item.gatewayver}}</span></p> -->
          <p class="infoDetail"><span class="detail">网关状态：{{item.connectStatus==0?'离线':'在线'}}</span><span>固件版本：{{item.gatewayver}}</span></p>
          <!-- <p class="infoDetail"><span class="detail">绑定时间：{{item.bindTime}}</span></p> -->
          <p class="infoDetail"><span class="detail">网关类型：{{item.product}}</span><span>ZigBee：{{item.zigbeever}}</span></p>
          <p class="infoDetail"><span class="detail">网关序列号：{{item.serialnum}}</span></p>
          <el-button class="handel handleButton" type="primary" @click="connectGateway(item.gatewayId)">设备入网</el-button>
        </div>
        <div class="pageWarp">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="添加网关"
      :visible.sync="addGatewayVisible"
      width="508px">
      <el-form ref="form" :rules="rules" :model="form" v-loading="addGatewayLoading" label-width="110px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="网关序列号" prop="serialnum">
          <el-input v-model="form.serialnum" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="manufacturer">
          <!-- <el-input v-model="form.manufacturer " placeholder="必填"></el-input> -->
          <el-select v-model="form.manufacturer" placeholder="必填">
            <el-option
              v-for="item in selectgys"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固件版本" prop="gatewayver">
          <el-input v-model="form.gatewayver " placeholder="选填"></el-input>
        </el-form-item>
        <el-form-item label="网关类型" prop="product">
          <el-input v-model="form.product " placeholder="选填"></el-input>
        </el-form-item>
        <el-form-item label="ZigBee版本号" prop="zigbeever">
          <el-input v-model="form.zigbeever " placeholder="选填"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGatewayVisible = false">取消</el-button>
        <el-button type="primary" :loading="addGatewayLoading" @click="addOrUpdateGateway()">添加</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="绑定网关"
      :visible.sync="bindGatewayVisible"
      width="80%">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in roomList" :key="index" :label="formatName(item.name)" :name="index+''">
          <el-alert
            title="一个智能网关最多选择8间房间，绑定房间需根据实际网络部署。"
            type="info"
            show-icon>
          </el-alert>
          <el-collapse class="elcollapse" @change="handleChange" accordion>
            <el-collapse-item class="elcollapseitem" v-for="(floor,index1) in floors" :key="index1" :name="floor.id+''">
              <template slot="title">
                <div class="collapseheader">
                  <span class="headertitle">{{floor.alias}}</span>
                  <div class="bindrooms" v-if="nowfloorId == floor.id">选择绑定房间：<span v-for="(item,index) in checkList" :key="index">{{item.name}},</span></div>   
                </div>
              </template>
              <div class="roombox">
                <el-checkbox-group @change="checkboxChange" v-model="checkList" :max='8' >
                  <el-checkbox v-for="(room,index) in rooms" :key="index" :label="room">{{room.name}}</el-checkbox>
                </el-checkbox-group>
                <div v-if="rooms==null||rooms.length==0">暂无房间</div>
              </div>
            </el-collapse-item>
          </el-collapse>          
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="bindGatewayVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmConnectGateway()">确定</el-button>
      </span>
    </el-dialog>    
  </div>
</template>
<script>
import { gatewayGetList,connectGateway,addOrUpdateGateway,getBuildings,getFloors,getRooms } from '@/api/projectapp/dormitoryManagement/deviceManagement';

  export default{
    name:'smartLock',
    data(){
      return{
        roomId:'',                //所选寝楼的值
        roomStatus:'',            //所在楼层的状态值
        searchVal:'',             //搜索值
        roomList: [],              //寝楼数组
        statusList: [{              //楼层状态数组
          value: '1',
          label: '在线'
        }, {
          value: '0',
          label: '离线'
        }],
        selectgys :[{
          value: '熙盟'
        }],
        page: 1,                   // 页数
        limit: 10,                 // 条数
        total: 0,                  // 总条
        addGatewayVisible: false,  //添加网关弹窗
        bindGatewayVisible: false, //绑定网关弹窗
        form:{
          manufacturer: '熙盟'
        },                    //添加网关表格
        buildings: [],//建筑名称
        floors: [],//建筑详细信息(楼层，每层状态总计，每个房间状态)
        rooms: [],
        dataList: [], //显示的网关列表
        activeName: '1',
        checkList: [],//已选择房间的id
        nowgatewayId: 0,//当前选则要入网的网关id
        nowfloorId: 0,
        nowbuildingId: 0,
        rules: {//网关添加规则
          name: [
            { required: true, message: '请输入网关名称', trigger: 'blur' },
          ],
          serialnum: [
            { required: true, message: '请输入网关序列号', trigger: 'blur' }
          ],
          manufacturer: [
            { required: true, message: '请输入供应商', trigger: 'blur' }
          ]
        },
        addOrUpdateOk: false,//防连点
        addGatewayLoading: false,//添加网关loading状态
        dataListLoading: false,//数据加载loading状态
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init(){
        this.getList();
        this.getBuildings();
        // this.getFloors();
      },
      handleSizeChange(val) {//修改页面大小
        console.log(`每页 ${val} 条`);
        this.limit = val;
        this.getList(this.page,val);
      },
      handleCurrentChange(val) {//修改当前页面
        console.log(`当前页: ${val}`);
        this.page = val;
        this.getList(val,this.limit);
      },
      getList(page = 1,limit = 10){//按页获取网关列表
        this.dataListLoading = true;
        gatewayGetList({
          page,
          limit,
          status: this.roomStatus,
          buildingId: this.roomId,
          // floorId:0,
          name:this.searchVal,
          // serialnum: '',
        }).then((res)=>{
          if (res.resultCode === 1) {
            this.dataList = res.value.dataList;
            this.total = res.value.totalCount;
            this.dataListLoading = false;
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
            this.dataListLoading = false;
          }                     
        })
      },
      getBuildings(){//获取建筑
        getBuildings().then((res)=>{
          if (res.resultCode === 1) {
            this.roomList = res.value;
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }  
        })
      },
      getFloors(buildingId){//获取楼层
        getFloors({
          buildingId,
          withFloor: true,
          withRoom: true,
        }).then((res)=>{
          if (res.resultCode === 1) {
            this.floors = res.value.floors;
            this.nowbuildingId = buildingId;
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }         
        })
      },
      getRooms(floorId){//获取房间
        getRooms({
          buildingId: this.building,
          floorId
        }).then((res)=>{
          if (res.resultCode === 1) {
            this.rooms = res.value;
            this.nowfloorId =  parseInt(floorId);
            this.checkList = [];//切换楼层清除已选择
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }           
        })
      },
      handleClick(tab, event) {//对话框切换寝室楼
        this.getFloors(this.roomList[tab.index].id);
      },
      handleChange(val) {//切换楼层
        if(val!=''){
          this.getRooms(val);
        }
      },
      addOrUpdateGateway(){// 添加网关
        // this.addOrUpdateOk = true;
        this.addGatewayLoading = true;
        this.$refs['form'].validate((valid) => {
          if (valid) {
            addOrUpdateGateway({  
              connectStatus: 0,
              gatewayver: this.form.gatewayver,
              manufacturer: this.form.manufacturer,
              name: this.form.name,
              product: this.form.product,
              schoolCode: this.form.schoolCode,
              serialnum: this.form.serialnum,
              zigbeever: this.form.zigbeever
            }).then((res)=>{
              if (res.resultCode === 1) {
                this.$message({
                  type: 'success',
                  message: res.resultMessage
                });
                this.addGatewayVisible = false;
                this.getList(this.page,this.limit)
              } else {
                this.$message({
                  type: 'error',
                  message: res.resultMessage
                });
              }
              // this.addOrUpdateOk = false;  
              this.addGatewayLoading = false;
            })
          } else {
            // this.addOrUpdateOk = false;
            this.addGatewayLoading =false;
            console.log('error submit!!');
            return false;
          }
        });

      },
      connectGateway(getewayId){//绑定网关
        this.bindGatewayVisible = true;
        this.nowgatewayId = getewayId;
        this.checkList = [];//清空已选择
        this.activeName = '0';
        this.getFloors(this.roomList[0].id);
      },
      confirmConnectGateway(){//确认绑定网关
        var roomIds = [];
        for(var item of this.checkList){
          roomIds.push(item.id);
        }
        connectGateway({
          buildingId:this.nowbuildingId,
          floorId: this.nowfloorId,
          gatewayId:this.nowgatewayId,
          roomIds
        }).then((res)=>{
          if (res.resultCode === 1) {
            this.$message({
              type: 'success',
              message: res.resultMessage
            });
            this.bindGatewayVisible = false;
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }            
        })
      },
      addGateway(){//点击添加网关按钮
        this.addGatewayVisible = true;
        this.form = {manufacturer: '熙盟'};
        if(this.$refs['form']){
          this.$refs['form'].resetFields();    
        }      
      },
      checkboxChange(){//选择网关改变

      },
      formatName(uname){//限制显示名字为6字以内
        var name = uname + "";
        if(name.length<=6){
          return name;
        } else {
          return name.substring(0,6) + '...'
        }
      }
      
    },
  }
</script>
<style scoped >
  .title{
    font-family: 'PingFangSC-Regular', 'PingFang SC';
    font-size: 24px;
    line-height: 24px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .deviceMain{
    width:100%;
    height:100%;
  }
  .deviceSelect{
    width:100%;
  }
  .roomSel,.floorSel,.statusSel,.searchInput{
    width:150px;
    margin-right:10px;
  }
  .allUnlock{
    float:right;
  }
  .lockList{
    width:100%;
    margin-bottom: 10px;
    margin-left:0px;
    height:300px;
    box-shadow:2px 2px 2px #ccc;
    border:1px solid #eee;
  }
  .lockName{
    font-size:0.4rem;
    font-weight:500;
  }
  .lockWarp{
    margin-top:30px;
  }
  .lockName{
    font-size: 20px;
    font-weight: 600;
  }  
  .infoDetail{
    margin: 0 0 10px;
  }
  .infoDetail,.lockWarp{
    margin-left:30px;
    margin-bottom:10px;
  }
  .detail{
    width:480px;
    display: inline-block;
    font-size: 17px;
  }
  .detailLang{
    width: 250px;
    display: inline-block;
  }
  .green{
    width: 20px;
    display: inline-block;
    height: 12px;
    background-color: #2fc25b;
    margin-right:5px;
  }
  .handel{
    margin-left: 30px;
  }
  .handleButton{
    margin-right:10px;
    margin-top:20px;
  }
  .pageWarp{
    margin-left: 30px;
    margin-top:30px;
  }
  .roombox{
    padding-left: 20px;
    padding-top: 20px;
  }
  .elcollapse .elcollapseitem{
    padding-bottom: 0;
    border: solid 1px #eaedf4;
    margin-bottom: 20px;
  }
  .collapseheader{
    height: 50px;
    background-color: #f5f7fa;
    border: solid 1px #eaedf4;
    position: relative;
  }
  .collapseheader .headertitle{
    font-family: PingFang-SC-Bold;
    font-size: 18px;
    line-height: 32px;
    color: #606266;
    margin-right: 30px;
    position: relative;
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
  .bindrooms{
    display: inline;
    font-family: PingFang-SC-Regular;
    font-size: 14px;
    color: #409eff;
  }
</style>
<style>
  .deviceMain .el-tabs__item {
      padding: 0 20px;
      width: 140px;
      text-align: center;
  }
  .roombox .el-checkbox__label{
    line-height: 60px;
    text-align: center;
    font-family: PingFang-SC-Bold;
    font-size: 18px;
    display: inline-block;
    margin-left: 10px;
    padding-left: 0;
    width: 130px;
    height: 60px;
    border-radius: 6px;
    border: solid 1px #eaedf4;
    font-size: 18px;
    color: #606266;
    background: url('../../../../../static/img/Icon WiFi.png') no-repeat;
    background-position: 102px 32px;
  }
  .roombox  .is-checked .el-checkbox__label{
    box-shadow: 0px 3px 9px 0px 
      #d7e9ff;
    border-radius: 6px;
    border: solid 1px #b2d6fd;
    background: url('../../../../../static/img/Icon WiFi blue.png') no-repeat;
    background-position: 102px 32px;
  }
  .roombox .el-checkbox{
    margin-right: 20px;
    margin-bottom: 20px;
    margin-left: 0;
  }

</style>
