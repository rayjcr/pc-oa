<template>
  <div class="app-container optionslist">
    <div class="u_TableMain">
      <!-- <div class="title">日志记录</div> -->

        <div class="filter-container">
          <el-input v-model="operatorUsername" placeholder="请输入姓名" style="width:217px;display:inline-block;" clearable></el-input>
          <el-date-picker
            v-model="datetimerange"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button type="primary" @click="GetListPage(pageSize,currentPage)">查询</el-button>
        </div>
        <div class="m_GenTableBox">
          <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="tableDataLoading">
            <el-table-column
              prop="operatorTime"
              label="操作时间"
              width="220">
            </el-table-column>
            <el-table-column
              prop="operatorUser"
              label="姓名"
              width="220">
            </el-table-column>
            <!-- <el-table-column
              prop="description"
              label="手机号码">
            </el-table-column> -->
            <el-table-column
              prop="operatorModule"
              label="操作类型">
            </el-table-column>
            <el-table-column
              prop="operatorType"
              label="事件">
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
</template>
<script>
import { logGetListPage } from '@/api/projectapp/dormitoryManagement/logRecord';

export default {
  name: 'operationLog',
  data() {
    return {
        operatorUsername: '',//操作的用户名称
        tableData: [],//操作日志内容表格 
        totalCount: 0,//日志内容条数
        datetimerange: '',//操作的时间范围
        currentPage: 1,//当前页
        pageSize: 10,//每页大小
        tableDataLoading: false,//操作日志加载状态
    }
  },
  methods: {
      handleSizeChange(val) {//修改页大小
        console.log(`每页 ${val} 条`);
        this.GetListPage(val,this.currentPage);
        this.pageSize = val;
      },
      handleCurrentChange(val) {//修改当前页
        console.log(`当前页: ${val}`);
        this.GetListPage(this.pageSize,val);
        this.currentPage = val;
      },
      init(){
        this.GetListPage();
      },
      GetListPage(limit = 10,page = 1){//分页获取操作记录列表
        this.tableDataLoading = true;
        logGetListPage({
          limit,
          page,
          operatorUsername:this.operatorUsername,
          beginDate:this.datetimerange?this.datetimerange[0]:'',
          endDate:this.datetimerange?this.datetimerange[1]:'',          
        }).then((res)=>{
          if (res.resultCode === 1) {
            this.tableData = res.value.dataList;
            this.totalCount = res.value.totalCount
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
  },
  mounted() {
        //
    this.init();
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
.optionslist{
  padding: 20px;
}
</style>
