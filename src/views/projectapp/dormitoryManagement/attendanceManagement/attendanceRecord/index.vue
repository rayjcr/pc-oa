<template>
  <div class="app-container recordList">
    <div class="u_TableMain">
      <!-- <div class="title">考勤记录</div> -->
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
              :label="item.name"
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
          <el-button type="primary" style="margin-left: 5px;" @click="getList(currentPage,pageSize)">查询</el-button>
          <el-button type="primary" style="margin-left: 5px;" @click="exportList()">导出报表</el-button>      
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
              prop="name"
              label="姓名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="attendTime"
              label="打卡时间">
            </el-table-column>
            <el-table-column
              prop="timePeriod"
              label="考勤时段"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="statusInfo"
              label="打卡状态"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="buildingName"
              label="房源"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="floorName"
              label="楼层"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="roomName"
              label="房间"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <div style="margin-top: 30px">
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
import { attendGetListVOByPage,attendExport,getBuildings,getFloors,getRooms  } from '@/api/projectapp/dormitoryManagement/attendInfo';
export default {
  name: 'attendanceRecord',
  data() {
    return {
        tableData: [],//要显示的记录
        datetimerange: '',//查询时间范围
        floor:'',//当前选择楼层的id
        room: '',//当前选择的房间id
        building: '',//当前选择的建筑id
        floors:[],//备选楼层列表
        rooms:[],//备选房间列表
        buildings:[],//备选建筑列表
        totalCount: 0,//总条数
        pageSize: 10,//页面大小
        currentPage: 1,//当前页面
        tableDataLoading: false,//考勤记录信息加载状态
        exportLoading: false,//导出报表的加载状态
    }
  },
  methods: {
    init(){
      this.getList()//获取要显示的记录
      this.getBuildings()//获取备选建筑列表
    },        //
    getList(page = 1,pageSize = 10){//查询要显示的记录
      this.tableData = [];
      this.totalCount = 0;
      this.tableDataLoading = true;
      attendGetListVOByPage({
        page,
        pageSize,
        buildingId:this.building,
        floorId: this.floor,
        roomId: this.room,
        beginTime: this.datetimerange ? this.datetimerange[0]: '',
        endTime: this.datetimerange ? this.datetimerange[1]: ''
      }).then((res)=>{
        if (res.resultCode === 1) {
          console.log(res.value)
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
    handleSizeChange(val) {//修改页面大小
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getList(this.currentPage,val);
    },
    handleCurrentChange(val) {//修改当前页面
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getList(val,this.pageSize);
    },
    exportList(){//导出报表
      this.exportLoading = true;
      attendExport({
        buildingId: this.building,
        floorId: this.floor,
        roomId: this.room,
        startTime: this.datetimerange[0],
        endTime:this.datetimerange[1]
      }).then((res)=>{
        const blob = new Blob([res], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '考勤记录报表.xlsx'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象 
        this.exportLoading = false;
      })
    },
    getBuildings(){//获取备选建筑
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
    getFloors(buildingId){//获取备选楼层
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
    getRooms(floorId){//获取备选房间
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
    formatName(uname){//限制名称为6个字以内
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
  this.init()
  },
  watch:{
    building(val){//建筑选项修改了就修改对应的楼层备选
      this.floor = '';//清空原有的楼层
      if(val!='' && val != null){
        this.getFloors(val)
      } else {
        this.floors = [];
      }
    },
    floor(val){//楼层选项修改了就修改对应的房间备选
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
  margin-left: 5px;
}
.table{

}
</style>
