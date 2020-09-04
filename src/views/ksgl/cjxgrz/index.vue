<template>
  <div class="app-container calendar-list-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="学年：">
            <el-select v-model="selectedXn" placeholder="请选择学年" style="margin:0 2% 2% 0" @change="getKsmc('xn')">
              <el-option
                v-for="item in optionsXn"
                :key="item.xn"
                :label="item.xn"
                :value="item.xn">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学期：">
            <el-select v-model="selectedXq" placeholder="请选择学期" style="margin:0 2% 2% 0" @change="getKsmc('xq')">
              <el-option
                v-for="item in optionsXq"
                :key="item.xq"
                :label="item.xqmc"
                :value="item.xq">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试名称：">
            <el-select v-model="selectedKsmc" placeholder="请选择考试名称" style="margin:0 2% 2% 0"
                       @change="selectedKsmcGetNj">
              <el-option
                v-for="item in optionsKsmc"
                :key="item.examId"
                :label="item.examName"
                :value="item.examId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级：">
            <el-select v-model="selectedNj" placeholder="请选择年级" style="margin:0 2% 2% 0" @change="selectNjGetBj">
              <el-option
                v-for="item in optionsNj"
                :key="item.gradeId"
                :label="item.gradeName"
                :value="item.gradeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级：">
            <el-select v-model="selectedBj" placeholder="请选择班级" style="margin:0 2% 2% 0">
              <el-option
                v-for="item in optionsBj"
                :key="item.classId"
                :label="item.className"
                :value="item.classId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学生姓名：">
            <el-input v-model="xsxm" placeholder="输入姓名关键词" class="handle-input" style="margin:0 2% 2% 0;width:140px"
                      maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlerSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- <el-button type="primary" icon="el-icon-download" @click="downLoadFile">导出</el-button> -->
      <div class="m_GenTableBox">
      <el-table
        :data="tableData"
        size="medium"
        style="width: 100%;margin:10px 0" >
        <el-table-column
          prop="modifyTime"
          label="修改时间">
        </el-table-column>
        <el-table-column
          prop="modifyUser"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="studentName"
          label="学生姓名">
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级">
        </el-table-column>
        <el-table-column
          prop="examSubjectName"
          label="修改项">
        </el-table-column>
        <el-table-column
          prop="beforeScore"
          label="原成绩">
        </el-table-column>
        <el-table-column
          prop="afterScore"
          label="修改后成绩">
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
          :total="total">
        </el-pagination>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import { dqxnxqObj } from '@/api/pkxt/arrangingTask/index';
  import { getScoreLog } from '@/api/ksgl/cjxgrz/index';
  import * as apiMain from '@/api/ksgl/cjcx/index'
  // import jcsj from '@/api/jcsj';
  import * as api from '@/api/ksgl/kswh/index'
  export default {
    name: 'cjxgrz',
    data() {
      return {
        optionsXn: [],                            // 学年
        optionsXq: [],                            // 学期
        optionsKsmc: [],
        optionsNj: [],
        optionsBj: [],
        selectedXn: '',
        selectedXq: '',
        selectedKsmc: '',
        selectedNj: '',
        selectedBj: '',
        xsxm: '',

        tableData: [],
        currentPage: 1,
        total: 0,
        limit: 10,

        xxdm: window.localStorage.getItem('xxdm'),
        dqxn: '',
        dqxq: '',
      }
    },
    mounted() {
      this.getInit()
    },
    methods: {
      async getInit() {

        /** 初始化学年 **/
        await api.xnList({ xxdm: this.xxdm }).then(response => {
          log(response,'xn')
          this.optionsXn = response;

        })
        /** 初始化学期 **/
        await api.xqList({ xxdm: this.xxdm }).then(response => {
          log(response,'xq')
          this.optionsXq = response;
        })
        // 获取当前学年学期
        await api.dqxnxqObj({xxdm: this.xxdm}).then(res => {
          this.selectedXn = res.data.xn
          this.selectedXq = res.data.xq
          let that = this
          // 获取考试id
          this.getKsmc('xq').then(() => {
            log(this.optionsKsmc,'kcmc')
            // this.selectedKsmc = this.optionsKsmc[0].examId
            // 获取年级列表
            // apiMain.getGradeByExamId({examId:this.optionsKsmc[0].examId}).then(res => {
            //   if(res.resultCode === 1) {
            //     log(res,'nj')
            //     this.optionsNj = res.value
            //     // this.selectedNj = this.optionsNj[0].gradeId
            //     // 获取班级
            //     apiMain.getGradeExamClassList({examId:this.optionsKsmc[0].examId,gradeId:this.optionsNj[0].gradeId}).then(res => {
            //       if(res.resultCode === 1){
            //         this.optionsBj = res.value
            //         // this.selectedBj = this.optionsBj[0].classId
            //         // 获取表格数据
            //         this.handlerSearch()
            //       }
            //     })
            //   }
            // })
            }
          )
        })
      },
      /**
       * 获取考试名称
       * @param {sting} type 执行对象 xq  xn
       */
      async getKsmc(type) {
        this.selectedKsmc = ''
        this.selectedNj = ''
        this.selectedBj = ''
        this.optionsNj = []
        this.optionsBj = []
        let params = {
          schoolYear: this.selectedXn,
          schoolTerm: this.selectedXq
        }
        await apiMain.getExamList(params).then(res => {
          if(res.resultCode == 1){
            this.optionsKsmc = res.value
            
          }
        })
      },
      /**
       * 选择考试名称，获取年级信息
       */
      selectedKsmcGetNj() {
        log(this.selectedKsmc,'ksmc')
        this.selectedNj = ''
        this.selectedBj = ''
        // 获取年级列表
        apiMain.getGradeByExamId({examId:this.selectedKsmc}).then(res => {
          if(res.resultCode === 1) {
            log(res,'nj')
            this.optionsNj = res.value
          }
        })
      },
      /**
       * 选择年级获取班级信息
       */
      selectNjGetBj(){
        this.selectedBj = ''
        // 获取班级
        apiMain.getGradeExamClassList({examId:this.selectedKsmc,gradeId:this.selectedNj,schoolYear:this.selectedXn}).then(res => {
          if(res.resultCode === 1){
            this.optionsBj = res.value
            // this.selectedBj = this.optionsBj[0].classId
            // 获取表格数据
            // this.handlerSearch()
          }
        })
      },
      /**
       * 搜索
       */
      handlerSearch() {
        if(!this.selectedKsmc) {
          this.$notify({
            title: '提示',
            message: '请选择考试名称',
            type: 'error'
          })
          return
        }
        let params = {
          page: this.currentPage,
          limit: this.limit,
          examId: this.selectedKsmc,
          classId: this.selectedBj,
          gradeId: this.selectedNj,
          studentName: this.xsxm
        }
        getScoreLog(params).then(res => {
          if(res.resultCode == 1) {
            log(res, 'scorelog')
            this.tableData = res.value.dataList
            this.total = res.value.totalCount
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration:2000
            })
          }else {
            this.$notify({
              title: '提示',
              message: res.resultMessage,
              type: 'error'
            })
          }
        })
      },
      handleSizeChange(val) {
      /** 跳转到某页**/
        this.currentPage = val
        this.handlerSearch()
      },
      handleCurrentChange(val) {
      /** 跳转到某页**/
        this.currentPage = val
        this.handlerSearch()
      },
      /**
       * 下载导出
       */
      downLoadFile() {
        import('@/vendor/Export2Excel').then(excel => {
          log(excel,'excel')
          const titleArr = ['修改时间','操作人','学生姓名','班级','修改项','原成绩','修改后成绩']
          const titleArrCode = ['modifyTime','modifyUser','studentName','classId','courseItemId','beforeScore','afterScore']
          // const titelArrCode = []
          const tHeader = titleArr
          const filterVal = titleArrCode;
          const data = this.tableData.map(v => filterVal.map(j => v[j]));
          log(data)
          excel.export_json_to_excel(tHeader, data, '成绩修改日志')
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
.select-group{
  margin-bottom: 10px;
  text-align: center;
}
</style>
