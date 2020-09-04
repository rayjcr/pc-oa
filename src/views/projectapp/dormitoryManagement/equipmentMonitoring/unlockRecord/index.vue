<template>
  <div class="app-container recordList">
    <div class="u_TableMain">
      <!-- <div class="title">开锁记录</div> -->
      <div class="filter-container">
        <div class="search">
          <el-select class="elselect" v-model="building" placeholder="请选择寝室楼" clearable>
            <el-option
              v-for="item in buildings"
              :key="item.id"
              :label="formatName(item.name)"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="elselect" v-model="floor" placeholder="请选择楼层" clearable>
            <el-option
              v-for="item in floors"
              :key="item.id"
              :label="formatName(item.alias)"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="elselect" v-model="room" placeholder="请选择房间" clearable>
            <el-option
              v-for="item in rooms"
              :key="item.id"
              :label="formatName(item.name)"
              :value="item.id">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="datetimerange"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
          <el-button type="primary" @click="getList(currentPage,pageSize)">查询</el-button>
          <el-button type="primary" @click="exportData()">数据导出</el-button>      
        </div>
      </div>
      <div class="m_GenTableBox">
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="tableDataLoading">
            <el-table-column
              prop="roomName"
              label="房间"
              width="120">
            </el-table-column>
            <el-table-column
              prop="buildingName"
              label="房源"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="unlockTime"
              label="时间"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="unlockType"
              label="开锁方式"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="tokenType"
              label="凭证类型"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <div style="margin-top:30px">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>        
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { unLockGetListPage,unLockExportListPage,getBuildings,getFloors,getRooms } from '@/api/projectapp/dormitoryManagement/unlockRecord';
export default {
  name: 'unlockRecord',
  data() {
    return {
        tableData: [],//开锁记录表
        totalCount: 0,//总共条数
        pageSize: 10,//每页条数
        currentPage: 1,//当前页        
        datetimerange: '',//查询时间范围
        floor:'',//当前楼层id
        room: '',//当前房间id
        building: '',//当前建筑id
        floors:[],//备选楼层
        rooms:[],//备选房间
        buildings:[],//备选建筑
        tableDataLoading: false,//开锁记录加载状态
    }
  },
  methods: {
        //
    init(){
      this.getList();
      this.getBuildings();
    },
    getList(page = 1,limit = 10){//获取开锁记录列表
      this.tableDataLoading = true;
      unLockGetListPage({
        limit: limit,
        page: page,
        buildingId: this.building,
        floorId: this.floor,
        roomId: this.room,
        beginTime: this.datetimerange? this.datetimerange[0]: '',
        endTime: this.datetimerange ? this.datetimerange[1]: ''
      }).then((res)=>{
        console.log(res)
          if (res.resultCode === 1) {
            this.tableData = res.value.dataList;
            this.totalCount = res.value.totalCount;
            this.tableDataLoading = false;
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
            this.tableDataLoading = false;
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
    getRooms(floorId){//获取房间
      getRooms({
        buildingId: this.building,
        floorId
      }).then((res)=>{
        if (res.resultCode === 1) {
          this.rooms = res.value;
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }           
      })
    },
    handleSizeChange(val) {//修改每页大小
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getList(this.currentPage,val);
    },
    handleCurrentChange(val) {//修改当前页面
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getList(val,this.pageSize);
    },
    exportData() {//数据导出
      unLockExportListPage({
        limit: this.limit,
        page: this.page,
        buildingId: this.building,
        floorId: this.floor,
        roomId: this.room,
        beginTime: this.datetimerange[0],
        endTime:this.datetimerange[1]
      }).then(response => {
        const blob = new Blob([response], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '开锁记录.xlsx'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    },
    formatName(uname){//限制名字长度为6个字
      var name = uname + "";
      if(name.length<7){
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
  watch:{
    building(val){//当前选择的建筑修改了就要修改对应的楼层备选项
      this.floor = '';
      if(val!='' && val != null){
        this.getFloors(val)        
      } else {
        this.floors = [];
      }
    },
    floor(val){//当前选择的楼层修改了就要修改对应的房间备选项
      this.room = '';
      if(val!='' && val != null){
        this.getRooms(val)        
      } else {
        this.rooms = [];
      }
    }
  }
}
</script>
<style scoped>
.title{
  font-family: 'PingFangSC-Regular', 'PingFang SC';
  font-size: 24px;
  line-height: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}
.recordList{
}
.searchtext{
  width: 131px;
  height: 40px;
}
.elselect{
  width: 143px;
  height: 40px;
  margin-right: 20px;
}
</style>
