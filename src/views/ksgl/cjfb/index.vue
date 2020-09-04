<template>
  <div class="app-container calendar-list-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="学年：">
            <el-select v-model="selectedXn" placeholder="请选择学年" style="margin:0 2% 2% 0">
              <el-option
                v-for="(item,index) in optionsXn"
                :key="index"
                :label="item.xn"
                :value="item.xn">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学期：">
            <el-select v-model="selectedXq" placeholder="请选择学期" style="margin:0 2% 2% 0;width:120px;">
              <el-option
                v-for="item in optionsXq"
                :key="item.xq"
                :label="item.xqmc"
                :value="item.xq">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试类型：">
            <el-select v-model="selectedKslx" placeholder="请选择考试类型" clearable style="margin:0 2% 2% 0">
              <el-option
                v-for="item in optionsKslx"
                :key="item.jlid"
                :label="item.lxmc"
                :value="item.jlid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公布状态：">
            <el-select v-model="selectedStatus" placeholder="请选择公布状态" clearable style="margin:0 2% 2% 0; width:160px">
              <el-option label="未公布" value="0"></el-option>
              <el-option label="已公布" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试名称：">
            <el-input v-model="ksmc" placeholder="输入考试名称关键词" class="handle-input" style="margin:0 2% 2% 0;width:280px"
                      maxlength="20"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlerSearch">搜索</el-button>
          </el-form-item>
          <!-- <el-button type="primary" plain @click="handlerReset">重置</el-button> -->
        </el-form>
      </div>
      <div class="m_GenTableBox">
      <el-table
        :data="tableData"
        size="medium"
        style="width: 100%;margin:10px 0" >
        <el-table-column
          prop="examName"
          label="考试名称">
        </el-table-column>
        <el-table-column
          label="考试类型">
          <template slot-scope="props">
            {{getExamName(props.row.examType)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createUser"
          label="创建人">
        </el-table-column>
        <el-table-column
          prop="referClassNum"
          label="参考班级数">
        </el-table-column>
        <el-table-column
          prop="isRecorded"
          label="是否录完">
           <template slot-scope="props">
             <el-tag v-if="props.row.isRecorded == 2" size="small" type="success" effect="plain">
               已录完
             </el-tag>
             <el-tag v-else type="danger" size="small" effect="plain">
               {{props.row.isRecorded == 0 ?'未录完':'录入中'}}
             </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="isAnnounce"
          label="是否公布">
          <template slot-scope="props">
            <el-tag v-if="props.row.isAnnounce == 1" size="small" type="success" >
              已公布
            </el-tag>
            <el-tag v-else type="danger" size="small" >
              未公布
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="handler">
            <el-button size="small" type="primary" icon="el-icon-document" v-if="handler.row.isRecorded == 2"
             @click="openDialog(handler.row.examId)">公布</el-button>
              <el-button size="small" type="warning" icon="el-icon-search" v-if="handler.row.isAnnounce == 0"
                         @click="handlerSchedule(handler.row.examId, handler.row.isReview)">进度</el-button>
           <!-- <el-tooltip effect="dark" content="短信通知录入老师" placement="top">
            <el-button size="small" type="info" icon="el-icon-chat-dot-square" v-if="handler.row.isRecorded == 0" @click="handlerNoticeNotRecordedTeacher(handler.row.examId, handler.row.isReview)"
           >通知</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
      </div>
    </div>

    <el-dialog title="公 布" :visible.sync="dialogFormVisible">
        <el-alert
          title="本次操作后，学生端将可看到成绩，确定继续该操作吗？"
          type="warning">
        </el-alert>
          <el-form :model="form" label-position="left">
            <el-form-item style="border-bottom:1px solid #ddd;">
              <el-checkbox label="全选" :indeterminate="isIndeterminate" v-model="checkAll" name="type" @change="handlerCheckAll" ></el-checkbox>
            </el-form-item>
            <el-form-item label="成绩分析" prop="type" style="border-bottom:1px solid #ddd;margin-top:-10px;" :label-width="formLabelWidth">
              <el-checkbox-group v-model="form.type" @change="handleChecked">
                <el-checkbox name="type" v-for="item in form.checkType" :key="item.name" :label="item.code">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="是否通知家长" prop="type" style="border-bottom:1px solid #ddd;margin-top:-10px;" :label-width="formLabelWidth">
              <el-radio v-model="form.isNoticeParents" label="1">是</el-radio>
              <el-radio v-model="form.isNoticeParents" label="0">否</el-radio>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handlerRelease">确 定</el-button>
          </div>
        </el-dialog>

    <el-dialog title="进度情况" width="60%" :visible.sync="dialogScheduleVisible">
      <div style="float: right">
        <el-button size="small" type="primary" icon="el-icon-chat-dot-square" style="margin-bottom: 5px"
                   @click="handlerNoticeNotRecordedTeacher(examId, isReview)" plain>
          一键通知未录完老师
        </el-button>
      </div>
      <el-table
        :data="tableScheduleData"
        v-loading="loading"
        size="medium"
        style="width: 100%" >
        <el-table-column
          prop="className"
          label="班级名称">
        </el-table-column>
        <el-table-column
          prop="examSubjectName"
          label="考试科目">
        </el-table-column>
        <el-table-column
          prop="headTeacher"
          label="班主任">
        </el-table-column>
        <el-table-column
          prop="instructor"
          label="任课老师">
        </el-table-column>
        <el-table-column
          label="录入状态">
          <template slot-scope="props">
            <el-tag v-if="props.row.status == 2" size="small" type="success" effect="plain">已录完</el-tag>
            <el-tag v-else type="danger" size="small" effect="plain">未录完</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="录入老师"
          width="320">
          <template slot-scope="props">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                :key="tag.id"
                v-for="tag in props.row.permissionTeacher"
                :disable-transitions="false">{{tag.teacherName}}</el-breadcrumb-item>
            </el-breadcrumb>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="props">
          <el-button v-if="props.row.status == 2" size="small" type="warning" icon="el-icon-search"
                     @click="rejectExamSubject(props.row.examSubjectId)">打回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
  import * as api from '@/api/ksgl/kswh/index'
  import { getExamReleasePageList, smsNoticeNotRecordedTeacher, publishExamScore, getPublishItem, getScorePermissionList,rejectSubject } from '@/api/ksgl/cjfb/index'
  export default {
    name: 'cjfb',
    data() {
      return {
        isReview: '',
        examId: '',
        loading: false,
        tableScheduleData: [],
        optionsXn: [],
        optionsXq: [],
        optionsKslx: [],

        selectedXn: '',
        selectedXq: '',
        ksmc: '',
        selectedKslx: '',
        selectedStatus: '',
        tableData: [],
        currentPage: 1,
        limit: 10,
        totalCount: 0,
        dialogScheduleVisible: false,
        dialogFormVisible: false,
        isIndeterminate: false,
        checkAll: false,
        form: {
          type: [],                               // 复选参数
          checkType: [
            { code: 'rankIndex', name: '排名' },
            { code: 'maxScore', name: '最高分' },
            { code: 'minScore', name: '最低分' },
            { code: 'middleScore', name: '中位分' },
            { code: 'avgScore', name: '平均分' },
            { code: 'comment', name: '批注' }
          ],
          isNoticeParents: '0'                    // 单选参数
        },
        formLabelWidth: '120px',

        isNoticeParents: 0,                       // 单选结果
        currentExamId: '',                        // 当前发布的考试id


        xxdm: window.localStorage.getItem('xxdm')
      }
    },
    mounted() {
      this.getInit()
    },
    methods: {
      async getInit() {
        /** 初始考试信息 **/
        api.getKslxList({ xxdm: this.xxdm }).then(response => {
          log(response, 'kslx')
          this.optionsKslx = response.data;
        })

        /** 初始化学年 **/
        await api.xnList({ xxdm: this.xxdm }).then(response => {
          log(response, 'xn')
          this.optionsXn = response;
        })
        /** 初始化学期 **/
        await api.xqList({ xxdm: this.xxdm }).then(response => {
          log(response, 'xq')
          this.optionsXq = response;
        })
        // 获取当前学年学期
        await api.dqxnxqObj({ xxdm: this.xxdm }).then(res => {
          this.selectedXn = res.data.xn
          this.selectedXq = res.data.xq
          this.getTableData()
        })
      },
      /**
       * 获取表格数据
       */
      getTableData() {
        const param = {
          pageNum: this.currentPage,
          limit: this.limit,
          schoolYear: this.selectedXn,
          schoolTerm: this.selectedXq,
          examType: this.selectedKslx,
          status: this.selectedStatus,
          examName: this.ksmc
        }
        getExamReleasePageList(param).then(res => {
          log(res, 'tabledata')
          if (res.resultCode === 1) {
            this.totalCount = res.value.totalCount
            this.tableData = res.value.dataList
          }
        })
      },
      /**
       * 打开弹窗
       */
      openDialog(examid) {
        this.currentExamId = examid
        this.checkAll = false
        this.isIndeterminate = false
        this.form.type = []
        getPublishItem({ examId: examid }).then(res => {
          log(res, 'fabu')
          if (res.resultCode === 1) {
            const checkList = res.value
            const resultList = []
            checkList.forEach(item => {
              resultList.push(item.itemCode) // 获取复选选择的code
            })
            this.form.type = resultList
            log(this.form.type.length, 'type.length')
            log(resultList)
            if (resultList.length >= 6) {  // 全选状态
              this.checkAll = true
            } else if (resultList.length != 0) {
              this.isIndeterminate = true
            }
          }
        })
        this.dialogFormVisible = true
      },
      /**
       * 发布
       */
      handlerRelease(examId) {
        log(this.form, 'formdata')
        // this.isNoticeParents = this.form.isNoticeParents
        const permission = []
        this.form.checkType.forEach(item => {
          if (this.form.type.includes(item.code)) {
            const tempObj = {} // 拼接参数
            tempObj.examId = this.currentExamId
            tempObj.itemCode = item.code
            tempObj.itemName = item.name
            tempObj.status = 1
            tempObj.xxdm = this.xxdm
            permission.push(tempObj)
          }
        })
        if(this.form.isNoticeParents == 1) {
          const tempObj = {} // 拼接参数
          tempObj.examId = this.currentExamId
          tempObj.itemCode = 'notifyStudent'
          tempObj.itemName = '是否通知家长'
          tempObj.status = 1
          tempObj.xxdm = this.xxdm
          permission.push(tempObj)
        }
        
        publishExamScore(permission).then(res => {
          if (res.resultCode === 1) {
            log(res)
            this.getTableData()
          } else {
            this.$notify({
              title: '错误',
              message: '发布失败，' + res.resultMessage,
              type: 'error'
            });
          }
        })
        this.dialogFormVisible = false
      },
      /**
       * 复选框按钮
       */
      handleChecked(value) {
        log(value.length)
        const checkedCount = value.length
        this.checkAll = checkedCount === this.form.checkType.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.form.checkType.length
      },
      /**
       * 全选
       */
      handlerCheckAll(val) {
        this.isIndeterminate = false
        if (val) {
          this.form.type = ['rankIndex', 'maxScore', 'minScore', 'middleScore', 'avgScore', 'comment']
        } else {
          this.form.type = []
        }
      },
      /**
       * 短信通知
       */
      handlerNoticeNotRecordedTeacher(examId, isReview) {
        const param = {
          schoolYear: this.selectedXn,
          examId,
          isReview
        }
        smsNoticeNotRecordedTeacher(param).then(res => {
          if (res.resultCode === 1) {
            this.$notify({
              title: '成功',
              message: '通知成功',
              type: 'success'
            });
          } else {
            this.$notify({
              title: '错误',
              message: '通知失败,' + res.resultMessage,
              type: 'error'
            });
          }
        })
      },
      /**
       * 搜索
       */
      handlerSearch() {
        this.getTableData()
      },
      /**
       * 重置
       */
      handlerReset() {
        this.selectedXn = ''
        this.selectedXq = ''
        this.selectedKslx = ''
        this.ksmc = ''
      },
      /**
       * 一页显示的个数
       */
      handleSizeChange(val) {
        this.limit = val
      },
      /** 切换页码 **/
      handleCurrentChange(val) {
        log(val, 'yema ')
        this.currentPage = val
        this.getTableData()
      },
      handlerSchedule(examId, isReview) {
        this.examId = examId
        this.isReview = isReview
        this.dialogScheduleVisible = true
        this.loading = true
        getScorePermissionList({ examId }).then(res => {
          this.loading = false
          if (res.resultCode === 1) {
            this.tableScheduleData = res.value
          }
        })
      },
      getExamName(v) {
        const e = _.find(this.optionsKslx, ['jlid', v]);
        return e ? e.lxmc : ''
      },
      rejectExamSubject(examSubjectId){
        rejectSubject({examSubjectId}).then(res => {
          if (res.resultCode === 1) {
            this.handlerSchedule(this.examId,this.isReview);
            this.$notify({
              title: '成功',
              message: '打回成功',
              type: 'success'
            });
          } else {
            this.$notify({
              title: '错误',
              message: '打回失败,' + res.resultMessage,
              type: 'error'
            });
          }
        })
      }

    }
  }
</script>

<style lang="scss" scoped>
.select-group{
  margin-bottom: 10px;
  text-align: center;
}

</style>
