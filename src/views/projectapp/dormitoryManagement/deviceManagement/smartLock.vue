<template>
  <div class="app-container deviceMain">

    <div class="u_TableMain">
      <!-- <div class="title">智能锁</div> -->
      <div class="filter-container">
      <div class="deviceSelect">
        <el-select  v-model="building" class="roomSel" placeholder="请选择寝楼" clearable>
          <el-option
            v-for="item in buildings"
            :key="item.id"
            :label="formatName(item.name)"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select  v-model="floor" class="floorSel" placeholder="请选择楼层" clearable>
          <el-option
            v-for="item in floors"
            :key="item.id"
            :label="formatName(item.alias)"
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
        <el-input class="searchInput" v-model="searchVal" placeholder="请输入内容" clearable></el-input>
        <el-button type="primary" @click="getLockList(page,limit)">查询</el-button>
        <!-- <el-button class="allUnlock" type="primary" @click="unlockAll()">全部解锁</el-button> -->
      </div>
      </div>

      <div class="m_GenTableBox">
        <div class="lockList" v-for="(item,index) in lockVO" :key="index" v-loading="lockListLoading" @click="showSmartLockDetail(item)">
          <div class="lockWarp">
            <el-badge :class="item.onlineStatus==1?'success':'info'" :value="item.onlineStatusDesc" class="item">
              <p class="lockName">{{item.name}}</p>
            </el-badge>
          </div>
          <p class="infoDetail"><span class="detail">安装地址</span><span class="detail">{{item.address}}</span></p>
          <p class="infoDetail"><span class="detail">安装时间</span><span class="detailLang">{{item.createTime}}</span><span class="detail">绑定网关</span><span class="detail">{{item.gatewayName}}</span></p>
          <p class="infoDetail"><span class="detail">电量状态</span><span class="green" :class="item.powerStatus == 0?'lowpower':''"></span><span>{{item.powerStatusDesc}}</span></p>

          <el-button class="handel handleButton" type="primary" @click.stop="unlockFar(item.lockId)" :disabled="item.onlineStatus!=1">远程解锁</el-button>
          <el-button type="primary" class="handleButton" @click.stop="unlockAdminPWD(item.lockId)" :disabled="item.onlineStatus!=1">管理员密码</el-button>
          <el-button type="primary" class="handleButton" @click.stop="unlockTemp(item.lockId)" :disabled="item.onlineStatus!=1">临时授权码</el-button>
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



    <!-- 智能锁详细 -->
      <el-dialog
        width="40%"
        top="25vh"
        title="智能锁信息"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :center="true"
        :visible.sync="smartLockVisible">
        <div class="infoblock">
          <p class="infoDetail"><span class="detail">网关：</span><span class="detail">{{smartLockDetail.name}}</span></p>
        </div>

        <div class="infoblock">
          <p class="infoDetail"><span class="detail">供应商：</span><span class="detail">{{smartLockDetail.manufacturer }}</span></p>
          <p class="infoDetail"><span class="detail">在线状态：</span><span class="detail">{{smartLockDetail.onlineStatusDesc}}</span></p>
          <p class="infoDetail"><span class="detail">电量状态：</span><span class="green" :class="smartLockDetail.powerStatus == 0?'lowpower':''"></span><span>{{smartLockDetail.powerStatusDesc}}</span></p>
          <p class="infoDetail"><span class="detail">型号：</span><span class="detail">{{smartLockDetail.product }}</span></p>
        </div>

        <div class="infoblock">
          <p class="infoDetail"><span class="detail">zigbee版本：</span><span class="detail">{{smartLockDetail.zigbeever}}</span></p>
          <p class="infoDetail"><span class="detail">安装位置：</span><span class="detail">{{smartLockDetail.address }}</span></p>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="smartLockVisible = false">取 消</el-button>
          <el-button type="primary" @click="smartLockVisible = false">确 定</el-button>
        </span>
      </el-dialog>      
    <!-- /智能锁详细 -->
    <el-dialog
      width="40%"
      top="16vh"
      title="临时授权码"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      :visible.sync="tempUnockDialog">
      <el-alert
        :closable="false"
        style="margin-bottom:20px;"
        title="密码有效期一小时"
        type="info"
        show-icon
      ></el-alert>
      <el-form
        label-position="left"
        style="padding-right:100px;"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="申请人" prop="applicant">
          <el-input
            minlength="4"
            maxlength="16"
            placeholder="请输入申请人"
            :title="form.applicant"
            v-model="form.applicant"
          ></el-input>
        </el-form-item>
        <el-form-item label="下发手机" prop="phone">
          <el-input
            maxlength="11"
            placeholder="请输入下发手机"
            :title="form.phone"
            v-model="form.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="发放人" prop="issuer">
          <el-input
            minlength="4"
            maxlength="16"
            disabled
            :title="form.issuer"
            v-model="form.issuer"
            closable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tempUnockDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUnlockTemp()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { lockGetList
        ,lockGetDetail
        ,remoteUnlock
        ,batchUnlock
        ,adminPWDUnlock
        ,tempUnlock
        ,getBuildings
        ,getFloors } from '@/api/projectapp/dormitoryManagement/deviceManagement';

  export default{
    name:'smartLock',
    data(){
      // 校验规则
      const checkAapplicant = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入申请人'));
        }
        setTimeout(() => {
          if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
            callback(new Error('请输入正确格式申请人'));
          } else {
            callback();
          }
        }, 0);
      };
      const checkIphone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号'));
        }
        setTimeout(() => {
          if (!/^1[34578]\d{9}$/.test(value)) {
            callback(new Error('请输入正确格式手机号'));
          } else {
            callback();
          }
        }, 0);
      };
      return{
        building:'',                //所选寝楼的值
        floor:'',               //所选楼层的值
        roomStatus:'',            //所在楼层的状态值
        searchVal:'',             //搜索值
        buildings: [],              //寝楼数组
        floors: [],              //楼层数组
        statusList: [{              //楼层状态数组
            value: '1',
            label: '在线'
          }, {
            value: '0',
            label: '离线'
          }],
        page: 1,                   // 页数
        limit: 10,                 // 条数
        total: 0,                  // 总条
        lockVO: [],
        tempUnockDialog: false, //临时授权码对话框
        form:{//临时授权码解锁表格
          applicant: "",
          issuer: '',
          lockId: '',
          phone: ''
        },
        rules: {//表格验证规则
          applicant: [
            { required: true, validator: checkAapplicant, trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: checkIphone, trigger: 'blur' }
          ],
        },
        _lockListLoading: false,//锁列表等待状态
        get lockListLoading() {
          return this._lockListLoading;
        },
        set lockListLoading(value) {
          this._lockListLoading=value;
        },
        smartLockVisible: false,//智能锁详细信息对话框
        smartLockDetail: {},//当前智能锁信息
      }
    },
    mounted() {
     this.init()
    },
    methods: {
      init(){
        this.getLockList();
        this.getBuildings();
      },
      handleSizeChange(val) {//页面大小改变
        console.log(`每页 ${val} 条`);
        this.limit = val;
        this.getLockList(this.page,val);
      },
      handleCurrentChange(val) {//改变当前页面
        console.log(`当前页: ${val}`);
        this.page = val;
        this.getLockList(val,this.limit);
      },
      getLockList(page = 1,limit = 10){//分页获取锁的列表
        this.lockListLoading = true;
        lockGetList({
          page,
          limit,
          floorId:this.floor,
          buildingId:this.building,
          name:this.searchVal,
          status:this.roomStatus
        }).then((res)=>{
          if (res.resultCode === 1) {
            this.lockVO = res.value.dataList;
            this.total = res.value.totalCount;
            this.lockListLoading = false;
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
            this.lockListLoading = false;
          }
        })
      },
      unlockAll(){//批量开锁
        var lockIds = [];
        for(var item of this.lockVO){
          lockIds.push(item.lockId)
        }
        batchUnlock({
          lockIds
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
      },
      unlockFar(lockId){//远程开锁
        remoteUnlock({
          lockId
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
      },
      unlockTemp(lockId){//点击临时开锁
        this.form.lockId = lockId;
        this.form.issuer = localStorage.getItem('name');
        this.tempUnockDialog = true;
        if(this.$refs['form']){
          this.$refs['form'].resetFields();    
        }      
      },
      confirmUnlockTemp(){//确认提交临时开锁表格
        this.$refs['form'].validate((valid) => {
          if (valid) {
            tempUnlock(this.form).then((res)=>{
              if (res.resultCode === 1) {
                this.$message({
                  type: 'success',
                  message: res.resultMessage
                });   
                this.tempUnockDialog = false;         
              } else {
                this.$message({
                  type: 'error',
                  message: res.resultMessage
                });
              } 
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      unlockAdminPWD(lockId){//管理员密码开锁
        adminPWDUnlock({
          lockId
        }).then((res)=>{
          if (res.resultCode === 1) {
            this.$alert(res.value, '管理员密码')
            // this.$message({
            //   type: 'success',
            //   message: res.resultMessage
            // });            
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }  
        })
      },
      getBuildings(){//获取建筑
        getBuildings().then((res)=>{
          if (res.resultCode === 1) {
            this.buildings = res.value;
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
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }         
        })
      },
      formatName(uname){//限制名称为7字以内
        var name = uname + "";
        if(name.length<7){
          return name;
        } else {
          return name.substring(0,6) + '...'
        }
      },
      showSmartLockDetail(row){
        this.smartLockDetail = row;
        this.smartLockVisible = true;
      }
    },
    watch:{
      building(val){//当前选择建筑修改了就修改对应的备选楼层
        this.floor = '';
        if(val!='' && val != null){
          this.getFloors(val)
        } else {
          this.floors = [];
        }        
      }
    }
  }
</script>
<style scoped >
  p {
      margin: 0 0 10px;
  }
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
    width:80%;
    margin-bottom:10px;
    margin-left:0px;
    min-height:260px;
    padding-bottom: 20px;
    box-shadow:2px 2px 2px #ccc;
    border:1px solid #eee;
  }
  .lockName{
    font-size:0.4rem;
    font-weight:500;
  }
  .lockWarp{
    position: relative;
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
  .onLine{
    position: absolute;
    left: 60px;
    top:-6px;
    background: #339900;
    width: 40px;
    height: 20px;
    color:#fff;
    line-height: 20px;
    text-align: center;
    border-radius: 20px;
  }
  .detail{
    min-width: 120px;
    max-width: 900px;
    display: inline-block;
    font-size: 17px;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .detailLang{
    min-width: 120px;
    max-width: 900px;
    display: inline-block;
    font-size: 17px;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 50px;
  }
  .green{
    width: 20px;
    display: inline-block;
    height: 12px;
    background-color: #2fc25b;
    margin-right:5px;
  }
  .lowpower{
    background-color: #f9cc14;    
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
</style>
<style>
  .success .el-badge__content{
    background-color: #67C23A;
  }
  .info .el-badge__content{
    background-color: #909399;
  }
</style>
