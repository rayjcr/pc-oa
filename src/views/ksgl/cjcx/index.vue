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
            <el-select v-model="selectedKsmc" placeholder="请选择考试名称" style="margin:0 2% 2% 0" @change="selectedKsmcGetNj">
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
            <el-select v-model="selectedBj" placeholder="请选择班级" style="margin:0 2% 2% 0" >
              <el-option
                v-for="item in optionsBj"
                :key="item.classId"
                :label="item.className"
                :value="item.classId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学生姓名：">
            <el-input v-model="xsxm" placeholder="输入姓名关键词" class="handle-input" style="margin:0 2% 2% 0;width:140px" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlerSearch" icon="el-icon-search">搜 索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-download" @click="downLoadFile">导 出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="m_GenTableBox">
      <el-table
        :data="tablePageData"
        size="medium"
        style="width: 100%;margin:10px 0" 
        @sort-change="handlerSort">
        <el-table-column
          prop="studentCode"
          label="学号"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="studentName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="gradeName"
          label="年级">
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级">
        </el-table-column>
        <el-table-column
          :prop="item.code"
          :label="item.value"
          v-for="(item,index) in tableDataHeader" :key="index"
          sortable="custom">
        </el-table-column>
        <el-table-column
          label="操作" v-if="userType == 2">
          <template slot-scope="handler">
            <!-- <el-button type="primary" plain size="medium" style="margin:0 5px 10px; 0" v-if="handler.row.studentCode">统计分析</el-button> -->
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary"
              icon="el-icon-edit"
              size="small"
              style="margin:0 5px 10px; 0"

              @click="handlerEditScore(handler.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

        <!--工具条-->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100,200,500,1000]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 修改成绩 -->
    <el-dialog title="修改成绩" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :inline="true">
        <el-form-item label="学号" :label-width="formLabelWidth" >
          <el-input v-model="form.studentCode" autocomplete="off" :style="{width: formInputWidth}"  disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.studentName" autocomplete="off" :style="{width: formInputWidth}"  disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="年级" :label-width="formLabelWidth" >
          <el-input v-model="form.gradeName" autocomplete="off" :style="{width: formInputWidth}"  disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-input v-model="form.className" autocomplete="off" :style="{width: formInputWidth}"  disabled="disabled"></el-input>
        </el-form-item>
        <template v-for="(item,index) in form.courseItemScore">
          <el-form-item
            :label="item.courseItemName"
            :label-width="formLabelWidth"
            :key="index"
            :prop="item.score"
            v-if="item.scoreLevel && item.scoreLevel.length > 0" :title="item.courseItemName">
            <el-select v-model="item.score" filterable placeholder="请选择" :style="{width: formInputWidth}" >
              <el-option
                v-for="item in item.scoreLevel"
                :key="item.id"
                :label="item.levelName"
                :value="item.levelName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="item.courseItemName"
            :label-width="formLabelWidth"
            :key="index"
            :prop="'courseItemScore.'+index+'.score'"
            :rules="{
              validator: validateScoreInput, trigger: 'change'
            }"
            :title="item.courseItemName"
            v-else>
            <el-input
              v-model="item.score"
              autocomplete="off"
              :style="{width: formInputWidth}"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerSaveEditScore('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import * as api from '@/api/ksgl/kswh/index'
  import * as apiMain from '@/api/ksgl/cjcx/index'
  export default {
    name: 'cjcx',
    data() {

      return {
        userType: localStorage.getItem('lguserType'),
        xxdm: localStorage.getItem('xxdm'),

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
        tableDataHeader: [], // 表头
        tableDataValue: [],  // 表单数据
        tableDataValueCopy: [],  // 表单数据
        scoreLevel: [],       // 等级信息
        downloadData: [],    // 下载数据
        currentPage: 1,
        total: 0,
        limit: 10,
        fullScore: [],

        dialogFormVisible: false,
        form: {
          studentCode: '',       // 学生编号
          studentName: '',       // 学生姓名
          // scoreStatus: '',        // 考试状态
          courseItemScore: [{    // 课程分项
            courseItemId: '', // 分项名称
            score: '',// 分项成绩
            beforeScore: '',// 原成绩
            examSubjectId: '',
            scoreLevel: [],      // 等级方式
          }],
          // comments: '',          // 备注
        },
        validateScoreInput: (rule, value, callback) => {
          let valuePosition = new String(rule.field)
          if(!value){
            callback()
          }
          log(this.fullScore,valuePosition,value,'check')
          if(!isNaN(value)){   // 是数字类型
            if(!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,1})?$/.test(value)){
              return callback(new Error('错误的数据'))
            }else {
              let valueInde = valuePosition.toString().split('.')
              if(value > parseFloat(this.fullScore[valueInde[1]])) {
                return callback(new Error('分数不能超出满分值，满分值：'+ this.fullScore[valueInde[1]]))
              }else {
                callback()
              }
            }
          }else {
            return callback(new Error('成绩类型为数值允许一位小数'))
          }
          callback()
        },
        validateScoreSelect: (rule, value, callback) => {
          if(!value){
            callback()
          }
          if(this.form.courseItemScore.scoreLevel && this.form.courseItemScore.scoreLevel.length > 0){

          }
          callback()
        },
        formLabelWidth: '200px',
        formInputWidth: '200px',

        xxdm: window.localStorage.getItem('xxdm'),

      }
    },
    computed: {
      tablePageData() {
        return this.tableDataValue.slice((this.currentPage-1)*this.limit,this.currentPage*this.limit)
        // return this.tableDataValue
      }
    },
    mounted() {
      this.getInit()
    },
    methods: {
      async getInit() {

        /** 初始化学年 **/
        await api.xnList({ xxdm: this.xxdm }).then(response => {
          this.optionsXn = response;

        })
        /** 初始化学期 **/
        await api.xqList({ xxdm: this.xxdm }).then(response => {
          this.optionsXq = response;
        })
        // 获取当前学年学期
        await api.dqxnxqObj({xxdm: this.xxdm}).then(res => {
          this.selectedXn = res.data.xn
          this.selectedXq = res.data.xq
          let that = this
          // 获取考试id
          this.getKsmc('xq').then(() => {
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
              //         // this.handlerSearch()
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
       * @param {string} type 执行对象 xq  xn
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
        this.selectedNj = ''
        this.selectedBj = ''
        // 获取年级列表
        apiMain.getGradeByExamId({examId:this.selectedKsmc}).then(res => {
          if(res.resultCode === 1) {
            this.optionsNj = res.value

          }
        })
      },
      // /**
      //  * 选择年级获取课程
      //  */
      // selectedNjGetBj() {
      //   // 获取班级
      //   apiMain.getGradeExamClassList({examId:this.optionsKsmc[0].examId,gradeId:this.optionsNj[0].gradeId}).then(res => {
      //     if(res.resultCode === 1){
      //       this.optionsBj = res.value
      //       // this.selectedBj = this.optionsBj[0].classId
      //       // 获取表格数据
      //       // this.handlerSearch()
      //     }
      //   })
      // },
      /**
       * 选择年级获取班级信息
       */
      selectNjGetBj(){
        this.selectedBj = ''
        apiMain.getGradeExamClassList({examId:this.selectedKsmc,gradeId:this.selectedNj,schoolYear: this.selectedXn}).then(res => {
          if(res.resultCode === 1){
            this.optionsBj = res.value
            const tempObj = {}
            tempObj.className = '全部班级'
            tempObj.classId = 'all'
            this.optionsBj.unshift(tempObj)
            this.selectedBj = 'all'
            // this.selectedBj = this.optionsBj[0].classId
            // 获取表格数据
            // this.handlerSearch()
          }
        })
      },
      /**
       * 修改成绩
       */
      handlerEditScore(info){
        if(this.selectedKsmc) {
          apiMain.checkIsFinish({examId:this.selectedKsmc}).then(res => {
            if(res.resultCode === 1) {
              if(!res.value) {
                this.$notify({
                  title: '警告',
                  message: '考试中存在科目没有录入完成，不可修改！',
                  type: 'warning'
                });
              }else {
                this.$forceUpdate()
                this.form = {
                  studentCode: '',       // 学生编号
                  studentName: '',       // 学生姓名
                  gradeName: '',          // 年级
                  className: '',          // 班级
                  // scoreStatus: '',        // 考试状态
                  courseItemScore: [{    // 课程分项
                    courseItemId: '', // 分项名称
                    score: '',// 分项成绩
                    beforeScore: '',// 原成绩
                    examSubjectId: '',
                    scoreLevel: [],      // 等级方式
                  }],
                  // comments: '',          // 备注
                },
                this.dialogFormVisible = true
                let stInfo = [] //学生信息
                let params = {
                  page: this.currentPage,
                  limit: this.limit,
                  examId: this.selectedKsmc,
                  classId: info.classId,
                  gradeId: info.gradeId,
                  // studentName: this.xsxm,
                  studentCode: info.studentCode,
                  // xn:this.s
                }
                apiMain.searchClassScore(params).then(res => {
                  this.fullScore = []
                  if(res.resultCode == 1) {
                    log(res, 'cx')
                    const stInfoHeardlist = res.value.dataList[0]
                    if(stInfoHeardlist.courseItemScore.length > 0) {
                      stInfoHeardlist.courseItemScore.forEach(item => {
                        this.fullScore.push(item.fullScore)   // 获取满分值
                      })
                    }
                    stInfo = res.value.dataList[1]
                    log(stInfo,'111')
                    log(stInfo.studentCode,'111')
                    this.$set(this.form,'studentCode',stInfo.studentCode)     // 学号
                    this.$set(this.form,'studentName',stInfo.studentName)      // 姓名
                    this.$set(this.form,'gradeName',stInfo.gradeName)     // 学号
                    this.$set(this.form,'className',stInfo.className)      // 姓名
                    if(stInfo.courseItemScore.length > 0) {    // 获取分项信息
                      const tempList = []
                      log(this.fullScore,'fulls')
                      stInfo.courseItemScore.forEach( (item, index) => {
                        const tempObj = {}
                        tempObj.courseId = item.courseId
                        tempObj.courseItemId = item.courseItemId
                        tempObj.score = item.score
                        tempObj.beforeScore = item.score
                        tempObj.examSubjectId = item.examSubjectId
                        tempObj.fullScore = this.fullScore[index]
                        // tempObj.score = '10'
                        
                        // 补充标题信息
                        const stTitleInfo = res.value.dataList[0]
                        stTitleInfo.courseItemScore.forEach((itm,inx) => {
                          if(index === inx) {
                            tempObj.courseItemName = itm.score
                            if(itm.scoreLevel && itm.scoreLevel.length > 0){
                              tempObj.scoreLevel = itm.scoreLevel
                            }
                          }
                        })
                        // tempObj.scoreLevel = [{levelName:'A',id:'111'}]
                        tempList.push(tempObj)
                      })
                      
                      this.$set(this.form,'courseItemScore',tempList)
                      log(this.form,'form')
                    }
                  }
                })

              }
            }
          })
        }


      },
      /**
       * 保存成绩修改
       */
      handlerSaveEditScore(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.courseItemScore.forEach(item => {
              if(item.score.split('.')[1] == '') {
                item.score = item.score+'0'   // 给 100. 类型数据加上 0 变为 100.0
              }
            })
            apiMain.saveStudentScore(this.form).then(res => {
              if(res.resultCode === 1) {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 2000
                });
                this.handlerSearch()
                this.dialogFormVisible = false
              }else {
                this.$notify({
                  title: '错误',
                  message: '保存失败，请检查网络连接！',
                  type: 'error'
                });
              }
            })
          } else {
            this.$notify({
              title: '错误',
              message: '保存失败，验证未通过！',
              type: 'error'
            });
            return false;
          }
        });


      },
      /**
       * 搜索
       */
      async handlerSearch(handler) {
        this.tableDataValue = []
        this.tableDataHeader = []
        
        if(!this.selectedKsmc) {
          this.$notify({
            title: '警告',
            message: '请选择考试名称！',
            type: 'warning'
          });
          return
        }
        if(!this.selectedNj) {
          this.$notify({
            title: '警告',
            message: '请选择年级！',
            type: 'warning'
          });
          return
        }
        let params = {
          page: this.currentPage,
          limit: this.limit,
          examId: this.selectedKsmc,
          classId: this.selectedBj,
          gradeId: this.selectedNj,
          studentName: this.xsxm,
        }
        await apiMain.searchClassScore(params).then(res => {
          if(res.resultCode == 1) {
            const data = res.value
            const tableDataValue = [];
            const tableHeader = [];
            this.total = data.totalCount
            this.tableData = data.dataList
            if(this.tableData && this.tableData.length > 0) {
              this.tableData.forEach( (item, index) => {
                if(index === 0) {   // 表头
                  for(let key in item) {
                    if(key == 'courseItemScore') {
                      const itemScore = item[key]
                      if(itemScore.length > 0) {
                        itemScore.forEach( itm => {
                          if(itm.scoreLevel && itm.scoreLevel.length > 0){
                            this.scoreLevel.push(itm.scoreLevel)
                          }else {
                            this.scoreLevel.push([])
                          }
                          tableHeader.push({code: itm.courseItemId, value: itm.score})
                          
                        })
                      }
                    }else {
                      // tableHeader.push({code: key, value: item[key]})
                    }
                  }
                }else {         // 表格数据
                  const itemScore = item.courseItemScore;
                  if(itemScore.length>0){
                    itemScore.forEach(itm=>{
                      item[itm.courseItemId] = itm.score;
                    })
                  }
                  tableDataValue.push(item);
                }
              })
              // log(tableDataValue,'data')
              this.tableDataValue = tableDataValue
              this.tableDataHeader = tableHeader
              log(this.tableDataHeader,'header')

            }
          }
        })
      },
      /**
       * 下载导出
       */
      downLoadFile() {
        import('@/vendor/Export2Excel').then(excel => {

          const titleArr = []
          const titleArrCode = []
          titleArr.push('学号')
          titleArr.push('姓名')
          titleArr.push('年级')
          titleArr.push('班级')
          titleArrCode.push('studentCode')
          titleArrCode.push('studentName')
          titleArrCode.push('gradeName')
          titleArrCode.push('className')
          this.tableDataHeader.forEach(item => {
            titleArr.push(item.value)
            titleArrCode.push(item.code)
          })
          log(this.tableDataHeader,'header')
          log(this.tableDataValue,'header')
          this.limit = 10000
          this.handlerSearch().then(() => {
            const tHeader = titleArr
            const filterVal = titleArrCode;
            const data = this.tableDataValue.map(v => filterVal.map(j => v[j]));
            excel.export_json_to_excel(tHeader, data, '班级成绩查询')
            this.limit = 10
            this.handlerSearch()
          })
        })

      },
      /**
       * 排序
       */
      handlerSort({column, prop, order}) {
        log(column, prop, order,'param')
        log(prop,'sort event')
        log(this.tableDataValue)
        log(Object.assign([{}],this.tableDataValue))
        let objArr = this.tableDataValue;
        // let firstObj = this.tableDataValue[0]
        if(order == 'ascending') {
          objArr.sort(function (o1,o2) {
            let v1 = parseInt(o1[prop])
            let v2 = parseInt(o2[prop])
            if(v1 > v2) {
              return 1
            }else if(v1 < v2) {
              return -1
            }else {
              return 0
            }
          })
        }else if(order == 'descending') {
          objArr.sort(function (o1,o2) {
            let v1 = parseInt(o1[prop])
            let v2 = parseInt(o2[prop])
            if(v2 > v1) {
              return 1
            }else if(v2 < v1) {
              return -1
            }else {
              return 0
            }
          })
        }
        
        this.tableDataValue = Object.assign([{}],objArr)
        this.$forceUpdate()
        console.log(this.tableDataValue,'sort')
      },
      handleSizeChange(val) {
        /** 调整显示个数**/
        this.limit = val
        this.handlerSearch()
      },
      handleCurrentChange(val) {
        /** 跳转到某页**/
        this.currentPage = val
        this.handlerSearch()
      },


    }
  }
</script>
<style lang="">
  .el-form-item__label{
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
  }
</style>

<style lang="scss" scoped>
  .select-group{
    margin-bottom: 10px;
    text-align: center;
  }
</style>
