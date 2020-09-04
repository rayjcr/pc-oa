<template>
  <div class="app-container states">
    <div class="u_TableMain">
      <div class="m_GenTableBox">
        <!-- <div class="title">指令下发状态</div> -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="失败指令列表" name="failedlist"  style="width:100%;">
            <div style="margin-bottom:10px;">
              <el-select v-model="type" placeholder="请选择指令类型" clearable>
                <el-option
                  v-for="item in typeOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
              <el-date-picker
                v-model="datetimerange"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-button type="primary" @click="getList(limit,page)">查询</el-button>
            </div>
            <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="tableDataLoading">
              <el-table-column
                prop="id"
                label="序号">
              </el-table-column>
              <el-table-column
                prop="type"
                label="指令类型">
              </el-table-column>
              <el-table-column
                prop="time"
                label="下发时间">
              </el-table-column>
              <el-table-column
                prop="target"
                label="指令目标">
              </el-table-column>
              <el-table-column
                prop="code"
                label="错误码">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button type="success" @click="resend(scope.row.id)">重新发送</el-button>              
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="全部指令列表" name="allist" style="width:100%;">
            <div style="margin-bottom:10px;">
            <el-select v-model="type" placeholder="请选择指令类型" clearable>
              <el-option
                v-for="item in typeOptions"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
            <el-select v-model="status" placeholder="请选择指令状态" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="datetimerange"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable>
            </el-date-picker>
            <el-button type="primary" @click="getList(limit,page)">查询</el-button>
            </div>
            <el-table
              :data="tableData1"
              style="width: 100%"
              v-loading="tableDataLoading">
              <el-table-column
                prop="id"
                label="序号">
              </el-table-column>
              <el-table-column
                prop="type"
                label="指令类型">
              </el-table-column>
              <el-table-column
                prop="time"
                label="下发时间">
              </el-table-column>
              <el-table-column
                prop="target"
                label="指令目标">
              </el-table-column>
              <el-table-column
                prop="status"
                label="指令状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status==3?'success':scope.row.status==2?'warning':scope.row.status==1?'info':scope.row.status==4?'danger':''">
                    {{scope.row.status==3?'执行成功':scope.row.status==2?'执行中':scope.row.status==1?'待执行':scope.row.status==4?'执行失败':''}}
                  </el-tag>           
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div class="pageWarp">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          ></el-pagination>
      </div>
    </div>
    </div>
  </div>

</template>
<script>
import { directiveGetList,directiveResend } from '@/api/projectapp/dormitoryManagement/deviceManagement';

export default {
  name: 'stateInstruction',
  data() {
    return {
      activeName: 'failedlist',//默认标签页
      type: '',//指令类型
      status: '',//指令状态
      datetimerange: [],//指令下发时间
      tableData: [],//失败指令列表
      tableData1: [],//全部指令列表
      options: [{//指令类型选项
        label:'执行成功',
        value: 3
      },{
        label:'执行中',
        value: 2        
      },{
        label:'待执行',
        value: 1        
      },{
        label:'执行失败',
        value: 4        
      }],
      typeOptions: [{//类型选项
        label: '远程开锁',
        value: 1
      },{
        label: '设置密码',
        value: 2
      },{
        label: '临时密码',
        value: 3
      },{
        label: '设置卡号',
        value: 4
      }],
      page: 1,                   // 页数
      limit: 10,                 // 条数
      totalCount: 0,                  // 总条
      tableDataLoading: false,//数据加载状态
    }
  },
  methods: {
      handleClick(tab, event) {//修改指令下发状态
        console.log(tab, event);
        this.type = '';
        this.status = '';
        this.page = 1;
        this.limit = 10;
        this.datetimerange = [];
        this.getList(this.limit,this.page);
      },
      init(){
        this.getList()
      },
      getList(limit = 10,page = 1){//获取对应的指令列表
        this.tableDataLoading = true;
        directiveGetList({
          beginTime: this.datetimerange ? this.datetimerange[0]: '',
          endTime: this.datetimerange ? this.datetimerange[1]: '',
          limit,
          page,
          status: this.activeName=='failedlist'?4:this.status,
          type: this.type
        }).then((res)=>{
          if (res.resultCode === 1) {
            if(this.activeName=='failedlist'){
              this.tableData = res.value.dataList;
              this.totalCount = res.value.totalCount;              
            } else {
              this.tableData1 = res.value.dataList;
              this.totalCount = res.value.totalCount;                  
            }
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
      resend(id){//指令重发
        directiveResend({directiveId:id}).then((res)=>{
          if (res.resultCode === 1) {
            this.$message({
              type: 'success',
              message: res.resultMessage
            });
            this.getList(this.limit,this.page);
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }          
        })
      },
      handleSizeChange(val) {//修改页面大小
        console.log(`每页 ${val} 条`);
        this.limit = val;
        this.getList(val,this.page);
      },
      handleCurrentChange(val) {//修改当前页面
        console.log(`当前页: ${val}`);
        this.page = val
        this.getList(this.limit,val);
      },
  },
  mounted() {
        //
    this.init()
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
.states{

}
.pageWarp{
  margin-top: 30px;
  
}
</style>
