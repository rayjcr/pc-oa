<template>
    <div class="app-container calendar-list-container">
         <el-tabs class="u_TableMain ofhide" type="border-card" >
            <el-tab-pane >
              <span slot="label"><i class="el-icon-setting"></i> 选课结果调整</span>
             <!--搜索控件-->
              <div class="filter-container">
              <search-app  ref="searchApp" :search-input-select="kcSearchInputSelect"
                          :search-placeholder="kcSearchPlaceholder"
                          :search-types="kcSearchTypes"
                          :condition-items="conditionItems" @searchClick="goSerch"></search-app>
             </div>
              <div style="padding-bottom: 10px">
                <el-alert
                  style="margin: 4px 0 !important;"
                  title="温馨提示，撤销-可对选课人数较少的课程进行撤销操作，其相关报名信息将作废并发送短信通知。"
                  type="warning" show-icon>
                </el-alert>
              </div>
             <div class="m_GenTableBox">
              <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
                <el-table-column align="center" label="课程名称" prop="kcmc"></el-table-column>
                  <el-table-column align="center" label="课程类别" width="140" prop="lbmc"></el-table-column>
                  <el-table-column align="center" label="授课教师" width="140" prop="skrxm"></el-table-column>
                  <el-table-column align="center" label="授课时间" width="280" prop="sksj"></el-table-column>
                  <el-table-column align="center" label="人数限制" width="140" prop="xzrs"></el-table-column>
                  <el-table-column align="center" label="申请人数"  width="140" prop="xsrs"></el-table-column>
                  <el-table-column align="center" label="满足最低人数" width="140" >
                      <template slot-scope="scope">
                          <span v-if="scope.row.xsrs - scope.row.zdrs < 0" style="color:#f56c6c">否</span>
                          <span v-else style="color:#85ce61">是</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="150">
                      <template slot-scope="scope">
                          <el-button size="small" type="success" @click="handleUpdate(scope.row)">调整</el-button>
                          <el-button size="small" type="warning" @click="showcxConfirm(scope.row)">撤销</el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <div v-show="!listLoading" class="pagination-container">
                  <el-pagination @size-change="kcHandleSizeChange" @current-change="kcHandleCurrentChange" :current-page.sync="listQuery.kcpage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.query.limit" layout="total, sizes, prev, pager, next, jumper" :total="kctotal"> </el-pagination>
              </div>
             </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="1100px" >
            <el-form :model="form" ref="form" label-width="110px" name="myform">
                <span :v-model="formTitle">
                    课程名称：{{formTitle.kcmc}}
                    课程类别：{{formTitle.lbmc}}
                    开课人：{{formTitle.skrxm}}
                </span>
                 <el-table :key='tableKey' :data="xkjglist" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
                   <el-table-column type="selection" width="35"></el-table-column>
                   <el-table-column align="center" label="学号"  width="180" prop="xh"></el-table-column>
                      <el-table-column align="center" label="姓名" width="140" prop="xm"></el-table-column>
                      <el-table-column align="center" label="年级" width="140" prop="njmc"></el-table-column>
                      <el-table-column align="center" label="班级" width="140" prop="bjmc"></el-table-column>
                      <el-table-column align="center" label="是否为预分配学生" width="140" >
                          <template slot-scope="scope">
                              <span>{{(scope.row.sjly == 0) ? "否":"是"}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column align="center" label="加入时间" prop="sqsj"></el-table-column>
                  </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer" >
              <!-- <el-popover icon="el-icon-info"
                placement="top"
                width="400"
                v-model="visible">
                <p align="center">确定要移除此学生吗？</p>
                <el-checkbox v-model="tz_messageFlag">
                是否发送短信
                </el-checkbox>
                <p>(xxx同学，你选的课程xxx已被相关教务人员退选，<br>
                  请重新选择其他课程，如有疑问可咨询相关教务老师。)</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="xkxstz">确定</el-button>
                </div>
                <el-button slot="reference">删除</el-button>
              </el-popover> -->
              <el-button slot="reference" @click="visible = true">删除</el-button>
            </div>
      </el-dialog>
      <el-dialog title="确定要移除此学生吗？" :visible.sync="visible" width="400px">
        <div>
          <el-checkbox v-model="tz_messageFlag">
          是否发送短信
          </el-checkbox>
          <p>(xxx同学，你选的课程[{{formTitle.kcmc}}]已被相关教务人员
            退选，请重新选择其他课程，如有疑问可咨询相关教务老师。)</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="xkxstz">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="确定撤销此课程吗？（撤销后将不可恢复哦）" :visible.sync="cancelVisible" width="500px">
        <div>
          <el-checkbox v-model="cx_messageFlag">
          是否发送短信
          </el-checkbox>
          <p>(xxx同学，你选的课程[{{formTitle.kcmc}}]由于选课人数过少已被管理员撤销，
            请重新选择其他课程。)</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="text" @click="cancelVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="handleCancel">确定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { page, ckxkjg, tzXsxkxx, cxXsxkjg } from 'api/xkxt/xkjgtzmanager/index';
import searchApp from '@/views/components/searchbar';
import { dqxnxqObj } from 'api/admin/acadyear/index';
export default {
  name: 'xkjgtzmanager',
  components: {
    searchApp
  },
  data() {
    return {
       /** *搜索配置开始**/
      kcSearchInputSelect: false,
      kcSearchPlaceholder: '请输入课程名称或开课人',
      kcSearchTypes: [],
      conditionItems: [{
        key: 'KKSJ',
        type: 'Checkbox', /** 类型 :单选Radio或者多选CheckBox；**/
        label: '开课时间',
        values: [
          { value: '1', text: '周一' },
          { value: '2', text: '周二' },
          { value: '3', text: '周三' },
          { value: '4', text: '周四' },
          { value: '5', text: '周五' },
          { value: '6', text: '周六' },
          { value: '7', text: '周日' }]
      }, {
        key: 'zdrs',
        type: 'Radio',
        label: '最低人数',
        values: [{ value: 'ym', text: '是' },
                  { value: 'bm', text: '否' }]
      }], /** 条件配置结束**/
      xxdm: '',
      dqxn: '', // 当前学年
      dqxq: '', // 当前学期
      tableKey: 0,
      listLoading: false,
      xstotal: 0,
      kctotal: 0,
      list: [],
      dictMap: {},
      form: {},
      listQuery: {
        // 分页
        query: {
          page: 1,
          limit: 10
        },
        xxdm: '',
        cxmc: '',
        zsGroup: [], // 周数
        zdrsGroup: ''// 最低人数
      },
      formTitle: {},
      kcsearchsel: 'all',
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '选课结果调整'
      },
      tzxslist: [], // 调整学号数组
      xkjglist: [],
      changeSure: false ,// 防止重复提交
      visible: false,
      cancelVisible: false,
      tz_messageFlag: true,
      cx_messageFlag: true,
      kcmc:''
    };
  },
  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.listQuery.xxdm = this.xxdm;

    dqxnxqObj({ xxdm: this.xxdm }).then(response => {
      this.dqxn = response.data.xn;
      this.dqxq = response.data.xq;
      this.getList();
    });
  },
  mounted() {
    this.$refs.searchApp.setChecked();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.xxdm = this.xxdm;
      this.listQuery.ssxn = this.dqxn;
      this.listQuery.ssxq = this.dqxq;
      this.listQuery.kcXnGroup = [this.dqxn];
      this.listQuery.kcXqGroup = [this.dqxq];
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.kctotal = response.data.total;
        this.listLoading = false;
      });
    },
    // 课程纬度页面搜索
    kcHandleFilter() {
      if (this.kcsearchsel == 'all') {
        this.listQuery = { page: 1, limit: 10, name: undefined };
      }
      this.getList();
    },
    searchChange() {
      this.listQuery = {
        page: 1,
        limit: 10,
        name: undefined
      };
      this.listQuery.xxdm = this.xxdm;
    },
    // 调整
    handleUpdate(row) {
      this.listQuery.xxdm = this.xxdm;
      this.listQuery.ssxn = this.dqxn;
      this.listQuery.ssxq = this.dqxq;
      this.listQuery.kcdm = row.kcdm;
      this.listQuery.xh = row.xh;
      this.formTitle = row;
      ckxkjg(this.listQuery).then(response => {
        this.xkjglist = response.data.rows;
        this.dialogFormVisible = true;
        this.dialogStatus = 'ckxkjg';
      });
    },
    // 撤销
    handleCancel() {
        this.listQuery.messageFlag=this.cx_messageFlag;
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.ssxn = this.dqxn;
        this.listQuery.ssxq = this.dqxq;
        this.listQuery.kcdm = this.formTitle.kcdm;
        this.listQuery.kcmc = this.formTitle.kcmc;
        cxXsxkjg(this.listQuery).then((res) => {
          if(res.status == 200) {
            this.$notify({
              title: '成功',
              message: '撤销成功',
              type: 'success',
              duration: 2000
            });
            this.getList();
            this.cancelVisible = false;
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
          }
        });
      // this.$confirm('确定撤销此课程吗？（撤销后将不可恢复哦）', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {

      //   });
      // }).catch(e => {});
    },
    ckxkjg(formName) {
      this.$refs[formName].validate(() => {
        this.changeSure = true;
        this.dialogFormVisible = false;
        put(this.form.lbid, this.form).then(res => {
          this.dialogFormVisible = false;
          this.getList();
          if (res.status == '200') {
            this.$notify({ title: '成功', message: '保存成功', type: 'success', duration: 2000 });
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
          }
        });
        const that = this;
        setTimeout(() => {
          that.changeSure = false;
        }, 1500);
      });
    },
    // 保存调整结果
    xkxstz() {
      if(this.tzxslist.length>0){
        this.changeSure = true;
        this.dialogFormVisible = false;
        tzXsxkxx({ kcdm: this.formTitle.kcdm, kcmc: this.formTitle.kcmc,
          tzmd: this.tzxslist, xndm: this.dqxn, xqdm: this.dqxq, xxdm: this.xxdm,messageFlag:this.tz_messageFlag
        }).then(res => {
          if (res.status == '200') {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({ title: '成功', message: '保存成功', type: 'success', duration: 2000 });
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
          }
        });
        const that = this;
        setTimeout(() => {
          that.changeSure = false;
        }, 1500);
        this.tzxslist = [];
      }else{
        this.$notify({ title: '失败', message: '请选择学生', type: 'error', duration: 2000 });
      }
      this.visible=false;
    },
    handleClick(tab, event) {
       // 判断页签
      this.tableindex = 0;
      this.listQuery = { page: 1, limit: 10, name: undefined };
      this.getList();
    },
    kcHandleSizeChange(val) {
      this.listQuery.query.limit = val;
      this.getList();
    },
    kcHandleCurrentChange(val) {
      this.listQuery.query.page = val;
      this.getList();
    },
    getValue(type, key) {
      const data = this.dictMap[type];
      return _.find(data, { id: key }).text;
    },
    goSerch(data) {
      this.listQuery.cxmc = data.curValue;
      this.listQuery.cxlx = data.type;
      this.listQuery.zsGroup = data.temp[0];
      if (data.temp.length < 2 || data.temp[1].length == 0) {
        this.listQuery.zdrsGroup = '';
      } else {
        this.listQuery.zdrsGroup = data.temp[1];
      }
      this.listQuery.query.page =1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.tzxslist=[];
      val.forEach((item, index) => {
        this.tzxslist.push(item);
      });
    },
    showcxConfirm(row){
      this.formTitle = row;
      this.cancelVisible =true;
    }
  }
};
</script>
<style scoped lang="scss">
.u_TableMain /deep/ .el-tabs__content{
  padding: 0;
}
</style>
