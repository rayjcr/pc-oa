<template>
  <div class="app-container content-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-form :inline="true"
                 class="demo-form-inline">
          <el-form-item>
            <el-page-header style="font-size: 32px;margin-top: 6px;"
                            @back="goback"
                            :content="content">
            </el-page-header>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary"
                       icon="el-icon-circle-check"
                       @click="saveScore('')">保 存</el-button>
            <el-button type="primary"
                       icon="el-icon-upload"
                       @click="handlerSubmit">提 交</el-button>
            <!-- <upload-excel-component psMsg="按姓名导入"
                                    @on-selected-file='uploadFilexm'
                                    style="float: right;"></upload-excel-component>
            <upload-excel-component psMsg="按学号导入"
                                    @on-selected-file='uploadFile'
                                    style="float: right;"></upload-excel-component> -->

            <el-dropdown @command="handerCommand">
              <el-button type="primary" icon="el-icon-download">
                导出<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="number">按学号导出</el-dropdown-item>
                <el-dropdown-item command="name">按姓名导出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown >
              <el-button type="primary" icon="el-icon-upload2">
                导入<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="number">
                  <upload-excel-component psMsg="按学号导入"
                                    @on-selected-file='uploadFile'
                                    style="float: right;"></upload-excel-component>
                </el-dropdown-item>
                <el-dropdown-item command="name">
                  <upload-excel-component psMsg="按姓名导入"
                                    @on-selected-file='uploadFilexm'
                                    style="float: right;"></upload-excel-component>
                </el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>
      </div>
      <div class="m_GenTableBox"
           v-if="isShow">
        <hot-table :settings="hotSettings"
                   licenseKey="non-commercial-and-evaluation"
                   style="width:100%;height:600px;overflow:hidden;"
                   ref="HotTable"></hot-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/ksgl/cjlr/index';
import { HotTable } from '@handsontable/vue';
import UploadExcelComponent from './UploadExcel/index'  // 导入
import 'handsontable/dist/handsontable.full.css';
import 'handsontable/languages/zh-CN';
export default {
  data () {
    return {
      content: '考试名称：' + this.$route.query.examname + '，班级：' + this.$route.query.classname + '，科目：' + this.$route.query.examSubjectname,
      examSubjectId: this.$route.query.examSubjectId,
      examname: this.$route.query.examname,
      classname: this.$route.query.classname,
      examSubjectname: this.$route.query.examSubjectname,
      isEnter: this.$route.query.isEnter,
      hotSettings: {},
      isShow: false,
      scoreLevel: [],                                      // 等级显示列表
      scoreLevelInfoList: [],                             // 等级详细列表
      fullScore: [],
      changeDataList: [],
      isSubject: false,
      subItemCode: [],
      tableTitleCode: [],
      tableTitleValue: [],
      tableDataInfo: [],
      studentCodeList: [],                                // 学号数组
      studentNameList: [],                                // 姓名数组

      validatorResult: false,                             // 验证结果
      timerId: null,                                      // 计时器id
      colWidth: 0,
    }
  },
  components: {
    HotTable,
    UploadExcelComponent
  },
  created () {
    // 获取科目成绩
    this.getClassScore();
  },
  mounted () {
    // this.timerId = setInterval(() => {
    //   this.saveScore()
    // },300000)
  },
  methods: {

    getClassScore () {
      api.getExamSubjectScore({ examSubjectId: this.examSubjectId }).then(res => {
        if (res.resultCode === 1) {
          const scoreList = res.value;
          const tableData = [];
          const tableTitleValue = [];
          const tableTitleCode = [];
          const subItemCode = [];
          const studentCode = []
          const studentName = []
          const statusList = ['', '正常', '缺考', '作弊']
          scoreList.forEach((score, index) => {
            if (index == 0) {
              log(score, 'score')
              for (const key in score) {
                if (key == 'courseItemScore') {
                  const itemScore = score[key];
                  if (itemScore.length > 0) {
                    this.isSubject = true;
                    itemScore.forEach((item, index) => {
                      tableTitleCode.push(item.courseItemId);
                      subItemCode.push(item.courseItemId);
                      tableTitleValue.push(item.score);
                      if (index === 0) {
                        item.scoreLevel.forEach(djitem => {
                          this.scoreLevel.push(djitem.levelName)
                        })
                      }
                      this.scoreLevelInfoList = item.scoreLevel;
                      this.fullScore.push(item.fullScore);
                    })
                  }
                } else if (key == 'scoreLevel') {
                  // this.scoreLevel = score[key];
                } else if (key == 'fullScore') {

                  // this.fullScore.push(score[key]);
                } else {
                  tableTitleCode.push(key);
                  tableTitleValue.push(score[key]);
                }
              }
            } else {
              log(score, 'scoreItem')
              const itemScore = score.courseItemScore;
              if (itemScore.length > 0) {
                itemScore.forEach(item => {
                  score[item.courseItemId] = item.score;
                })
              }
              score.scoreStatus = score.scoreStatus ? statusList[score.scoreStatus] : '正常'
              tableData.push(score);
              // 保存学号和姓名
              studentCode.push(score.studentCode)
              studentName.push(score.studentName)
            }
            log(this.fullScore, 'full')
          })
          this.subItemCode = subItemCode;
          this.tableTitleCode = tableTitleCode;
          this.tableTitleValue = tableTitleValue;
          this.tableDataInfo = tableData
          this.studentCodeList = studentCode
          this.studentNameList = studentName
          log(this.tableTitleValue, 'tableTitle')
          log(this.tableTitleCode, 'tableTitleCode')
          log(tableData, 133)
          log(this.scoreLevel, 'scoreLevel')
          if (this.tableDataInfo.length === 0) {
            this.$notify({ title: '提示', message: '无学生信息，请至基础数据维护班级学生信息', type: 'warning' })
            return
          }
          this.initHotTable(tableData);
        } else {
          this.$notify({
            title: '错误',
            message: res.resultMessage,
            type: 'error'
          });
        }
      })
    },
    /**
     * 表格数据
     */
    getTableColumn () {
      const tableColumn = [];
      const that = this
      /**
       * 验证
       */
      function checkOldValidator (value, callback) {
        if(value) {
          if(value.length > 10){
            that.$refs.HotTable.hotInstance.setDataAtCell(this.row, this.col, value.substring(0, 10), null);
            // that.$notify({title: '提示', message: '成绩最多可以输入10个字符', type: 'error'})
            callback(false)
          }else {
            if(!isNaN(value)){   // 是数字类型
              log(this.row,this.col,'position')
              if(/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,1})?$/.test(value)){
                // 验证分项分数是否超过满分值
                if(that.fullScore.length > 0){
                  if(parseFloat(value) > parseFloat(that.fullScore[this.col - 2])) {   // -2 减去固定的学号和姓名两列
                    that.$notify({title: '错误', message: '分项分值超出了满分值！该满分值为' + that.fullScore[this.col - 2], type: 'error'})
                    callback(false)
                  }else {
                    // 是否与原数据相同
                    let result = false
                    let beforeScore = ''
                    // log(that.beforeScoreList,'forin')
                    const currentObj = _.find(that.beforeScoreList,{row: this.row,col:this.col})
                    log(currentObj,'currentObj')
                    if(currentObj) {
                      if(currentObj.beforeScore != value) {
                          // log(item.beforeScore,'原成绩  ', value,'复审成绩')
                          beforeScore = currentObj.beforeScore
                          result = true
                        }
                    }
                    callback(!result)
                  }
                }else {
                  that.$notify({title: '错误', message: '未获取到满分值', type: 'error'})
                  callback(true)
                }
              }else {
                that.$notify({title: '错误', message: '总分仅支持一位小数', type: 'error'})
                callback(false)
              }
            }else {
              that.$notify({title: '错误', message: '错误的类型', type: 'error'})
              callback(false)
            }
          }

        }else {
          callback(true)
        }
      }
      /**
       * 下拉类型验证
       */
      function selectValueValidator(value,callback) {
          if(value) {
            log(that.tableTitleCode[this.col],'vlaue')
            if(value.length > 10) {
              that.$refs.HotTable.hotInstance.setDataAtCell(this.row, this.col, value.substring(0, 10), null);
              // that.$notify({title: '提示', message: '该单元格最多可以输入10个字符', type: 'error'})
              callback(false)
            }else {
              if(_.find(that.getTableColumn(),{'data': that.tableTitleCode[this.col]}).type == 'dropdown') {
                let dropdown = _.find(that.getTableColumn(),{'data':that.tableTitleCode[this.col]})
                log(dropdown,value,9991)
                if(!dropdown.source.includes(value)) {
                  that.$notify({title: '错误', message: '输入的值不是该等级类型的子项', type: 'error'})
                  callback(false)
                } else {
                  callback(true)
                }
              }else {
                callback(false)
              }
            }

          }else {
            callback(true)
          }
        }

      this.tableTitleCode.forEach((code, index, arr) => {
        if (index == 1 || index == 0) {      // 学号、姓名数据
          tableColumn.push({ data: code, readOnly: true });
        } else if (index == (arr.length - 2)) { // 考试状态数据
          tableColumn.push({ data: code, type: 'dropdown', source: ['正常', '缺考', '作弊'], validator (value, callback) {
              if (value.length > 10) {  // 限制10个字符
                log(this)
                that.$refs.HotTable.hotInstance.setDataAtCell(this.row, this.col, value.substring(0, 10), null);
                // that.$notify({ title: '提示', message: '该单元格最多可以输入10个字符', type: 'info' })
                callback(false);
              }else {
                if(['正常', '缺考', '作弊'].indexOf(value) != -1) {
                  callback(true);
                }else {
                  callback(false);
                }
              }
            }});
        } else if (index == (arr.length - 1)) { // 备注数据
          tableColumn.push({data: code, validator (value, callback) {
              if (value.length > 50) {  // 限制50个字符
                log(this)
                that.$refs.HotTable.hotInstance.setDataAtCell(this.row, this.col, value.substring(0, 50), null);
                that.$notify({ title: '提示', message: '备注不能超过50个字符', type: 'info' })
              }
              callback(true);
            }
          });
        } else {                            // 分项数据
          if (this.scoreLevel.length > 0) { // 等级方式
            tableColumn.push({ data: code, type: 'dropdown', source: this.scoreLevel,validator:selectValueValidator });
          } else {                          // 分数方式
            tableColumn.push({ data: code, validator: checkOldValidator, allowInvalid: true });
          }
        }
      });
      log(tableColumn, 'tableColumn')
      return tableColumn;
    },

    initHotTable (tableData) {
      log(tableData, 208)
      const that = this;
      setTimeout(() => {
        // 计算并设置列宽度
        this.colWidth = document.getElementsByClassName('wtHolder')[0].style.width.split('px')[0] / this.tableTitleCode.length - 4
        this.$refs.HotTable.$el.style.height = 24 * (tableData.length + 10) + 'px'
        this.$refs.HotTable.hotInstance.updateSettings({ colWidths: this.colWidth })
        log(this.$refs.HotTable.$el.style.height, tableData.length)
      }, 4)
      this.hotSettings = {

        // 定义数据
        data: tableData,
        width: '100%',
        // 定义表结构
        colHeaders: that.tableTitleValue,
        // 定义属性
        columns: that.getTableColumn(),
        className: 'htCenter',
        maxRows:tableData.length,     //表格最大行，禁止自动增加行数
        autoColumnSize: true,

        colWidths: '120%',
        manualColumnFreeze: true, // 手动固定列
        manualColumnResize: true, // 手工更改列距
        manualRowResize: true, // 手动更改行距
        columnSorting: true, // 排序
        afterChange (change, source) {
          if (source === 'loadData') {
            return;
          } else if (change[0][2] == change[0][3]) { // 相同不保存
            return
          } else {


            const scoreList = that.$refs.HotTable.hotInstance.getData();
            change.forEach(ch => {
              that.changeDataList.push(scoreList[ch[0]]);
            })
            const autosaveNotification = setTimeout(() => {
              // 验证表格是否有红色
              let tdNodes = document.getElementsByTagName('td')
              let cannotSave = false
              const scoreList = that.$refs.HotTable.hotInstance.getData();
              tdNodes.forEach(item => {
                // log(item)
                if (Array.from(item.classList).includes('htInvalid')) { // 有红色样式
                  if (item.innerHTML == '') {
                  } else {
                    // 有红色未通过验证的单元格，将其值改为0，然后保存
                    const positionInfo = that.$refs.HotTable.hotInstance.getCoords(item) // 通过元素获取坐标
                    log(positionInfo, 'posiINfo')
                    that.$refs.HotTable.hotInstance.setDataAtCell(positionInfo.row, positionInfo.col, ''); // 表格数据改变
                    scoreList[positionInfo.row][positionInfo.col] = ''   // 上传数据改变
                  }
                }
              })
              that.saveScore(scoreList)
            }, 300000);
          }
        }
      }
      this.isShow = true;
    },
    checkOldValidator (value, callback) {
      log(value);
      callback(true);
    },
    goback () {
      this.$router.go(-1)
    },
    /**
     * 提交
     */
    handlerSubmit () {
      let nullCount = 0   // 空单元格数量
      const scoreList = this.$refs.HotTable.hotInstance.getData();
      scoreList.forEach(item => {
        const itemArr = item.slice(2,item.length-2)
        if(item[item.length-2] == '正常') {
          itemArr.forEach(itm => {
            if(!itm) {
              nullCount++
            }
          })
        }
      })
      log(nullCount, 'nullcount')
      if (nullCount === 0) {
        let tdNodes = document.getElementsByTagName('td')
        let cannotSave = false
        let count = 0
        tdNodes.forEach(item => {
          // log(item)
          if (Array.from(item.classList).includes('htInvalid')) { // 有红色样式
            if (item.innerHTML == '') {
            } else {
              count++
            }
          }
        })
        log(count, 'coutn')
        if (count > 0) {
          this.$notify({ title: '提交失败！', message: '存在验证未通过单元格', type: 'error' })
          return
        } else {
          this.$confirm('提交后将不能再次录入是否提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const scoreList = this.$refs.HotTable.hotInstance.getData();
            const waitSaveScore = this.formatScore(scoreList);
            api.submitClassScore(waitSaveScore).then(res => {
              if (res.resultCode == 1) {
                this.$notify({
                  title: '成功',
                  message: '提交成功!',
                  type: 'success',
                  duration: 2000
                });
                this.changeDataList = [];
                this.$router.go(-1)
              } else {
                this.$notify({
                  title: '失败',
                  message: '提交失败' + res.resultMessage,
                  type: 'error',
                })
              }
            })
          }).catch(() => {
            this.$notify({
              title: '提示',
              message: '已取消提交!',
              type: 'info'
            });
          });
        }
      } else {
        this.$notify({ title: '提交失败！', message: '成绩信息不允许为空！', type: 'error' })
      }
    },
    /**
     * 保存
     */
    saveScore (scoreList) {
      log(this.$refs.HotTable.hotInstance.getData(),'tabdata')
      // 验证表格是否有红色
      let tdNodes = document.getElementsByTagName('td')
      let cannotSave = false
      let count = 0
      if (!scoreList) {
        scoreList = this.$refs.HotTable.hotInstance.getData();
        tdNodes.forEach(item => {
          // log(item)
          if (Array.from(item.classList).includes('htInvalid')) { // 有红色样式
            if (item.innerHTML == '') {
            } else {
              count++
            }
          }
        })
        if (count > 0) {
          this.$notify({ title: '保存失败！', message: '存在验证未通过单元格', type: 'error' })
          return
        }
      }

      // this.$refs.HotTable.hotInstance.updateSettings({ data: this.tableDataInfo }, true)
      // 分项录入 需要遍历分项成绩
      try {
        const waitSaveScore = this.formatScore(scoreList);
        log(this.$refs.HotTable.hotInstance.getSourceData(), 'datainfo')
        api.saveExamSubjectScore(waitSaveScore).then(res => {
          if (res.resultCode == 1) {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
            this.changeDataList = [];
          } else {
            error(res.resultMessage);
            this.$notify({
              title: '失败',
              message: '保存失败' + res.resultMessage,
              type: 'error',
            })
          }
        })
      } catch (e) {
        log(e)
      }
    },
    formatScore (scoreList) {
      log(scoreList, 'param')
      log(this.tableTitleCode, 449);
      log(this.subItemCode);
      const waitToSaveScore = [];
      const status = ['', '正常', '缺考', '作弊']
      scoreList.forEach(score => {
        const studentScore = { courseItemScore: [], examSubjectId: this.examSubjectId };
        this.tableTitleCode.forEach((code, index) => {
          if (code == 'scoreStatus') {
            studentScore[code] = status.indexOf(score[index]);
          } else {
            studentScore[code] = score[index];
          }
        });
        waitToSaveScore.push(studentScore);
      })
      log(waitToSaveScore, 'waitToSaveScore')
      waitToSaveScore.forEach(score => {
        // this.tableDataInfo.forEach(item => {
        //   if(item[code])
        // })
        this.subItemCode.forEach(code => {
          log(code, 'code')
          const itemScore = { courseItemId: code, score: score[code], examSubjectId: this.examSubjectId };
          log(itemScore, 471)
          score.courseItemScore.push(itemScore)
        });
      })
      return waitToSaveScore;
    },
    /**
     * 导出分别处理
     */
    handerCommand(command) {
      if(command == 'name') {
        this.downLoadFilexm()
      }else {
        this.downLoadFile()
      }
    },
    /**
     * 下载导出按学号
     */
    downLoadFile () {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.tableTitleValue;
        const filterVal = this.tableTitleCode;
        const scoreList = this.$refs.HotTable.hotInstance.getData();
        const waitToSaveScore = [];
        scoreList.forEach(score => {
          const studentScore = {};
          this.tableTitleCode.forEach((code, index) => {
            studentScore[code] = score[index];
          });
          waitToSaveScore.push(studentScore);
        })
        const data = waitToSaveScore.map(v => filterVal.map(j => v[j]));
        log(tHeader, data, 'excel')
        excel.export_json_to_excel(tHeader, data, `（按学号）${this.$route.query.examSubjectname}-${this.$route.query.examname}`)
      })
    },
       /**
     * 下载导出按姓名
     */
    downLoadFilexm () {
      let flag = false;//是否存在相同姓名
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.tableTitleValue.slice(1);
        const filterVal = this.tableTitleCode.slice(1);
        const scoreList = this.$refs.HotTable.hotInstance.getData();
        const waitToSaveScore = [];
        const newArr = [];
        let isRepeat = ''
        scoreList.forEach(score => {
          if(newArr.indexOf(score[1]) == -1){
            newArr.push(score[1]);
            const studentScore = {};
            this.tableTitleCode.forEach((code, index) => {
              studentScore[code] = score[index];
            });
            waitToSaveScore.push(studentScore);
          }else{
            flag = true
            isRepeat += score[1] + ','
          }
        })
        log(newArr)
        if(flag){
          this.$alert(`存在相同姓名：${isRepeat}请联系客服处理`, '导出失败', {
              confirmButtonText: '确定',
            });
          return;
        }else {
          const data = waitToSaveScore.map((v) =>{
            return filterVal.map((j) => {
              if(j == 'studentName' && this.isEnter == 0) {
                return ''
              }else {
                return v[j]
              }

            })
          });//
          log(tHeader, data, 'excel')
          excel.export_json_to_excel(tHeader, data, `（按姓名）${this.$route.query.examSubjectname}-${this.$route.query.examname}`)
        }
      })
    },
    /**
     * 按学号导入
     */
    uploadFile (json) {
      log(json,7777)
      log(json.header,this.tableTitleCode,55)
      if (json.header.length !== this.tableTitleCode.length) {
        this.$alert('excel表头不匹配，请下载正确的模板。', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: () => false
        });
        return false
      } else {
        const data = json.results
        log(data, 'data')
        let isFlag = false
        data.forEach(item => {
          if(item['学号']){
            for (const key in item) {
              if (!this.tableTitleValue.includes(key)) {
                isFlag = true
              }
            }
            if (!this.studentCodeList.includes(item['学号']) || !this.studentNameList.includes(item['姓名'])) {
              log(item['学号'], item['姓名'])
              isFlag = true
            }
          }

        })
        if (isFlag) {
          this.$alert('表格数据格式错误，请下载正确的模板。', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: () => false
          });
          return
        }
        if (data.length > 0) {
          const newArr = json.header.slice(1, json.header.length - 1)
          log(newArr,77)
          const list = []
          data.forEach(item => {
            if(item['学号']){
              const obj = []
              obj.push(item['学号'])
              // obj.push(item['姓名'])
              if (newArr.length > 0) {
                newArr.forEach(itm => {
                  obj.push(item[itm])
                })
              }
              // obj.push(item['考试状态'])
              obj.push(item['备注'])
              list.push(obj)
            }

          })
          // log(list,77)
          this.formatScore(list)
          // log(list, 'list')
          let arrResult = this.$refs.HotTable.hotInstance.getData()
          log(arrResult,888)
          const result = []
          arrResult.forEach((item,index,array) => {
            list.forEach((itm,inx,ar) => {
              // log(item[0],itm[0],item[0] == itm[0],778)
              if(itm[0] && item[0] == itm[0]) {
                array[index] = ar[inx]
              }
            })
          })
          log(arrResult,889)
          arrResult.forEach((item, index) => {
            // log(item,99991)
            const newObj = {}
            if(item) {
              item.forEach((itm, inx) => {
                newObj[this.tableTitleCode[inx]] = itm
              })
              result.push(newObj)
            }
          })
          this.$refs.HotTable.hotInstance.updateSettings({ data: result }) // 更新数据
          this.$refs.HotTable.hotInstance.validateCells(valid => { // 验证所有单元格
            if (valid) {
              // this.saveScore()
            }
          })
        }
      }

    },
    //按姓名导入
    uploadFilexm(json){
      // this.tableTitleValue.forEach((e,index) => {
      //   if(e=='学号'){
      //     this.tableTitleValue = this.tableTitleValue.slice(index+1)
      //   }
      // });
      // this.tableTitleCode.forEach((key,index) =>{
      //   if(key == 'studentCode'){
      //     this.tableTitleCode = this.tableTitleCode.slice(index+1);
      //   }
      // })
      log(json,7777,this.tableTitleCode)
      log(this.tableDataInfo,this.tableTitleValue,7778)
      if (json.header.length+1 !== this.tableTitleCode.length) {
        log(json.header.length,this.tableTitleCode.length,4444)
        this.$alert('excel表头不匹配，请下载正确的模板。', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: () => false
        });
        return false
      } else {
        const data = json.results;
        let isFlag = false
        let isRepeat = false
        let repeatName = ''
        data.forEach((item,index,arr) => {
          log(index)
          // log(arr[index]['姓名']==(arr[index+1]?arr[index+1]['姓名']:''),6666)
          // log(arr,arr[index]['姓名'],667)
          if(arr[index]['姓名']){
            if(arr[index]['姓名'] == (arr[index+1]?arr[index+1]['姓名']:'')) {
              repeatName += arr[index]['姓名']+'，'

              isRepeat = true
            }
            for (const key in item) {
              if (!this.tableTitleValue.includes(key)) {
                // log(key,668)
                isFlag = true
              }
            }
            // log(this.studentNameList,44)
            if (!this.studentNameList.includes(item['姓名'])) {
              // log(item['姓名'],669)
              isFlag = true
            }
          }

        })
        if(isRepeat) {
          this.$alert('存在相同姓名：'+repeatName+'请联系客服处理！', '导入失败', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: () => false
          });
          return
        }
        if (isFlag) {
          this.$alert('表格数据格式错误，请下载正确的模板。', '导入失败', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: () => false
          });
          return
        }
        if (data.length > 0) {
          const newArr = json.header.slice(1, json.header.length - 2)
          log(this.$refs.HotTable.hotInstance.getData(),77)
          const list = []
          this.tableDataInfo.forEach(tableItem => {
            try{
              data.forEach(item => {
              if(tableItem.studentName == item['姓名']) {
                log( item['姓名'])
                const obj = []
                obj.push(tableItem.studentCode)
                obj.push(item['姓名'])
                if (newArr.length > 0) {
                  newArr.forEach(itm => {
                    obj.push(item[itm])
                  })
                }
                obj.push(item['考试状态'])
                obj.push(item['备注'])
                list.push(obj)
                throw new Error("EndIterative");
              }
            })
            }catch(e) {
              if(e.message != 'EndIterative') throw e
            }
          })
          log(this.studentNameList,443322)
          log(list,443322)
          this.formatScore(list)
          let arrResult = this.$refs.HotTable.hotInstance.getData()
          let objResult = []
          arrResult.forEach((item, index, array) => {  // 合并学生数据
            list.forEach((itm, inx, arr) => {
              if(item[1] == itm[1]) {
                array[index] = arr[inx]
              }
            })
          })
          arrResult.forEach((item, index, array) => { // 生成更新数据
            const newObj = {}
            item.forEach((itm,inx) => {
              newObj[this.tableTitleCode[inx]] = itm
            })
            objResult.push(newObj)
          })
          log(objResult,888)
          this.$refs.HotTable.hotInstance.updateSettings({ data: objResult }) // 更新数据
          this.$refs.HotTable.hotInstance.validateCells(valid => { // 验证所有单元格
            if (valid) {
              // this.saveScore()
            }
          })
        }
      }
    },
    // //选择导出
    // dcChange(type){
    //   if(type == 1){
    //     this.downLoadFile()
    //   }else{
    //     this.downLoadFilexm ()
    //   }
    // },
    // //选择导入
    // drChange(type){
    //   if(type == 1){
    //     this.uploadFile()
    //   }else{
    //     this.downLoadFilexm ()
    //   }
    // },
    deactivated () {
      clearInterval(this.timerId)
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 20px 0 0 20px;
  font-size: 18px;
}
.header {
  margin: 0 0 10px 0;
  .wtHider {
    width: 100% !important;
  }
}
.selHandel{
  width:120px;
}
</style>
