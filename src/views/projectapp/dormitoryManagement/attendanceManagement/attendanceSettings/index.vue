<template>
  <div class="app-container settingList">
    <div class="u_TableMain">
      <!-- <div class="title">考勤设置</div> -->
      <div class="filter-container">
        <el-button class="settingbtn"  @click="showAddDialog()" type="primary">考勤设置</el-button>
      </div>
      <div class="m_GenTableBox">
        <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="tableDataLoading">
          <el-table-column
            prop="name"
            label="名称"
            width="180">
          </el-table-column>
          <el-table-column label="考勤时间段">
            <template  slot-scope="{row}">
              {{row.startTime}}-{{row.endTime}}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="添加时间">
          </el-table-column>
          <el-table-column label="操作">
            <template  slot-scope="scope">
              <el-button type="success"  @click="editList(scope.row)" >修改</el-button>
              <el-button type="danger" @click="deleteItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加弹窗 -->
    <el-dialog title="考勤设置" :visible.sync="dialogFormVisible" width="475px" class="eldialog" v-loading="dialogLoading">
      <el-form :model="form" :rules="rules" ref="ruleForm" >
        <el-form-item 
          label="名称" 
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="form.name" placeholder="请输入内容" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item 
          label="开始时间" 
          :label-width="formLabelWidth"
          prop="startTime">
          <el-time-picker
            v-model="form.startTime"
            placeholder="选择开始时间"
            value-format = 'HH:mm:ss'
            >
          </el-time-picker>
        </el-form-item>
        <el-form-item 
          label=" 结束时间" 
          :label-width="formLabelWidth"
          prop="endTime">
          <el-time-picker
            placeholder="选择结束时间"
            v-model="form.endTime"
            value-format = 'HH:mm:ss'
            >
          </el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttendance()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /添加弹窗 -->

    <!-- 修改弹窗 -->
    <el-dialog title="考勤设置" :visible.sync="dialogFormVisibleEdit" width="475px" class="eldialog" v-loading="dialogLoading">
      <el-form :model="formEdit" :rules="rules" ref="updateForm">
        <el-form-item 
          label="名称" 
          :label-width="formLabelWidth"
          prop="name">
          <el-input v-model="formEdit.name" placeholder="请输入内容" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item 
          label="开始时间" 
          :label-width="formLabelWidth"
          prop="startTime">
          <!-- <el-date-picker
            v-model="formEdit.startTime"
            type="datetime"
            placeholder="选择开始时间">
          </el-date-picker> -->
          <el-time-picker
            v-model="formEdit.startTime"
            placeholder="选择开始时间"
            value-format = 'HH:mm:ss'
            >
          </el-time-picker>
        </el-form-item>
        <el-form-item 
          label=" 结束时间" 
          :label-width="formLabelWidth"
          prop="endTime">
          <!-- <el-date-picker
            v-model="formEdit.endTime"
            type="datetime"
            placeholder="选择结束时间">
          </el-date-picker> -->
          <el-time-picker
            placeholder="选择结束时间"
            v-model="formEdit.endTime"
            value-format = 'HH:mm:ss'
            >
          </el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChange()">取 消</el-button>
        <el-button type="primary" @click="updateChange()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /修改弹窗 -->    
  </div>
</template>
<script>
import {attendGetListRules,attendupdateListRules,attendaddListRules,attenddeleteListRules} from '@/api/projectapp/dormitoryManagement/attendInfo';

export default {
  name: 'attendanceSettings',
  data() {
    return {
        tableData: [],//考勤时间表
        form: {//添加考勤时间的表格
          name: '',
          startTime: '',
          endTime: '',
          createTime: '',
        },
        formEdit: {//修改考勤时间的表格
          name: '',
          startTime: '',
          endTime: '',
          createTime: '',
        },
        formLabelWidth: '120px',//表格标签宽度
        dialogFormVisible: false,//添加考勤时间的弹层是否可见
        dialogFormVisibleEdit: false,//修改考勤时间的弹层是否可见
        rules: {//考勤管理表格的规则
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          startTime: [
            { type: 'string' ,required: true, message: '请选择开始时间', trigger: 'change' }
          ],
          endTime: [
            { type: 'string' , required: true, message: '请选择结束时间', trigger: 'change' }
          ],
        },
        tableDataLoading: false,//数据加载状态
        dialogLoading: false,//对话框提交等待状态
    }
  },
  methods: {
        //
    getList(){//获取考勤时间列表
      //console.log(api)
      this.tableDataLoading = true;
      attendGetListRules().then((res)=>{
        if (res.resultCode === 1) {
          console.log(res)
          this.tableData = res.value;
          for(var item of this.tableData){//循环遍历修改时间格式为HH:mm:ss
            item.startTime = item.startTime.split(' ')[1];
            item.endTime = item.endTime.split(' ')[1];
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
    init(){//初始化
      this.getList()//获取列表
    },
    editList(row){//修改考勤规则数据
      console.log(row,187)
      this.formEdit = row;
      this.dialogFormVisibleEdit = true;
      if(this.$refs['updateForm']){
        this.$refs['updateForm'].resetFields();  
      }    
    },
    showAddDialog(){//点击添加考勤规则
      // this.form = {
      //     name: '',
      //     startTime: '',
      //     endTime: '',
      //     createTime: '',
      // };
      if(this.$refs['ruleForm']){
        this.$refs['ruleForm'].resetFields();  
      }    
      this.dialogFormVisible = true;
    },
    updateChange(){//更新考勤规则数据
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
        this.dialogLoading = true;
        attendupdateListRules({
          endTime: this.formEdit.endTime,
          ruleId: this.formEdit.id,
          name: this.formEdit.name,
          startTime: this.formEdit.startTime,
        }).then((res)=>{
            console.log(res)
            if (res.resultCode === 1) {
              this.$message({
                type: 'success',
                message: res.resultMessage
              });
              this.dialogFormVisibleEdit = false;
              this.dialogLoading = false;
              this.getList();
            } else {
              this.$message({
                type: 'error',
                message: res.resultMessage
              });
              this.dialogLoading = false;
            }        
          })
          this.getList();
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    cancelChange(){//取消修改考勤规则
      this.$refs['updateForm'].resetFields();  
      this.dialogFormVisibleEdit = false;
    },
    addAttendance(){//增加考勤规则数据
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          attendaddListRules(this.form).then((res)=>{
            console.log(res)
            if (res.resultCode === 1) {
              this.$message({
                type: 'success',
                message: res.resultMessage
              });
              this.dialogFormVisible = false;
              this.dialogLoading = false;
              this.getList();
            } else {
              this.$message({
                type: 'error',
                message: res.resultMessage
              });
              this.dialogLoading = false;
            }        
          })
          this.getList();
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    deleteItem(row){//删除考勤规则数据
      this.$confirm('确认删除？', '提示').then(() => {
        // on confirm
        attenddeleteListRules({
          ruleId:row.id
        }).then((res)=>{
          if (res.resultCode === 1) {
            this.$message({
              type: 'success',
              message: res.resultMessage
            });
            this.getList();
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        // on cancel
        console.log('关闭')
      });
    }
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
.settingList{
  position: relative;
}
.settingbtn{

}
</style>
<style>
.settingList .eldialog .el-dialog{
  top: 17vh;
}
</style>
