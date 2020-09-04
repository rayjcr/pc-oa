<template>
  <div class="app-container content-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item>
            <el-page-header style="font-size: 32px;margin-top: 6px;" @back="goback" :content="content">
            </el-page-header>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" icon="el-icon-circle-check"  @click="saveScore('')">保 存</el-button>
            <el-button type="primary" icon="el-icon-upload"  @click="handlerSubmit">提 交</el-button>
            <el-button type="primary"  icon="el-icon-download" @click="downLoadFile">导 出</el-button>
            <upload-excel-component psMsg="导入" @on-selected-file='uploadFile' style="float: right;"></upload-excel-component>
          </el-form-item>
        </el-form>
      </div>
      <div class="m_GenTableBox" v-if="isShow">
        <hot-table  :settings="hotSettings" licenseKey="non-commercial-and-evaluation"
                    style="width:100%;height:600px;overflow:hidden;" ref="HotTable"></hot-table>
      </div>

    </div>

    <el-dialog
      title="复审提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      :show-close="false"
      :close-on-click-modal="false">
      <span style="text-align:center;">
        <el-form inline>
          <el-form-item label="原成绩">
            <el-radio v-model="radio" :label="afterData[0]">{{afterData[0]}}</el-radio>
          </el-form-item >
          <el-form-item label="复审成绩" style="margin-left:20px">
            <el-radio v-model="radio" :label="afterData[1]">{{afterData[1]}}</el-radio>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="centerDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="handlerEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from '@/api/ksgl/cjlr/index';
  import { HotTable } from '@handsontable/vue';
  import UploadExcelComponent from '@/components/UploadExcel/index'  // 导入
  import { validatNumberDecimals1 } from '@/utils/validate' // 验证数字保留一位小数
  import 'handsontable/dist/handsontable.full.css';
  import "handsontable/languages/zh-CN";
  export default {
    data() {
      return {
        content: '考试名称：' + this.$route.query.examname + '，班级：' + this.$route.query.classname + '，科目：' + this.$route.query.examSubjectname,
        examSubjectId: this.$route.query.examSubjectId,
        examname: this.$route.query.examname,
        classname: this.$route.query.classname,
        examSubjectname: this.$route.query.examSubjectname,
        hotSettings:{},
        isShow:false,
        scoreLevel:[],
        scoreLevelInfoList:[],
        fullScore:[],
        changeDataList: [],
        isSubject: false,
        subItemCode: [],
        tableTitleCode: [],
        tableTitleValue: [],
        studentCodeList: [],                                // 学生学号数组
        studentNameList: [],                                // 学生姓名数组

        validatorResult: false,                             // 验证结果
        centerDialogVisible: false,                         // 弹窗

        afterData: [],                                      // 修改的数据 前后
        radio:'',
        positionInfo: {},                                    // 单元格位置信息
        tableData: [],
        timerId: null,
        colIndexList: [],                                    // 被改变的列数值索引列表
        beforeScoreList: [],                                 // 原成绩列表
        isAutoEnter: false,                                   // 自动录入
        isUploadFile: false,                                  // 导入了成绩
      }
    },
    components: {
      HotTable,
      UploadExcelComponent
    },
    created() {
      //获取科目成绩
      this.getClassScore();
    },
    mounted() {
      // this.timerId = setInterval(() => {
      //   this.saveScore()
      // },300000)
    },
    methods: {
      getClassScore(){
        api.getClassConfirmScore({examSubjectId:this.examSubjectId}).then(res => {
          if(res.resultCode === 1) {
            const scoreList = res.value;
            const tableData = [];
            const tableTitleValue = [];
            const tableTitleCode = [];
            const subItemCode = [];
            const studentCode = []
            const studentName = []
            const statusList = ['','正常','缺考','作弊']
            scoreList.forEach((score,index)=>{
              if(index==0){
                for(let key in score){
                  if(key=='courseItemScore'){
                    const itemScore = score[key];
                    if(itemScore.length>0){
                      this.isSubject = true;
                      itemScore.forEach((item,index)=>{
                        tableTitleCode.push(item.courseItemId);
                        subItemCode.push(item.courseItemId);
                        tableTitleValue.push(item.score);
                        if(index === 0) {
                          item.scoreLevel.forEach(djitem => {
                            this.scoreLevel.push(djitem.levelName)
                          })
                        }
                        this.scoreLevelInfoList = item.scoreLevel;
                        this.fullScore.push(item.fullScore);
                      })
                    }
                  }else if(key=='scoreLevel'){
                    this.scoreLevel = score[key];
                    // scoreLevel 为数组，大于0时录入方式为等级
                  }else if(key=='fullScore'){
                    this.fullScore = score[key];
                    // fullScore 大于0时，标识不同科目的满分值
                  }else{
                    tableTitleCode.push(key);
                    tableTitleValue.push(score[key]);
                  }
                }
              }else{
                const itemScore = score.courseItemScore;
                if(itemScore.length>0){
                  itemScore.forEach(item=>{
                    score[item.courseItemId] = item.score;
                  })
                }
                score.scoreStatus = score.scoreStatus? statusList[score.scoreStatus]:'正常'
                log(score,'score')
                tableData.push(score);
                // 保存学号和姓名
                studentCode.push(score.studentCode)
                studentName.push(score.studentName)
              }
            })
            this.subItemCode = subItemCode;
            this.tableTitleCode = tableTitleCode;
            this.tableTitleValue = tableTitleValue;
            this.tableData = tableData // 录入的数据
            this.studentCodeList = studentCode
            this.studentNameList = studentName
            log(this.tableTitleValue,'tableTitle')
            log(this.tableTitleCode,'tableTitleCode')
            log(tableData,'tableData')
            let newTableData = [] // 空数据
            tableData.forEach( item => {
              let obj = {}
              obj['studentCode'] = item['studentCode']
              obj['studentName'] = item['studentName']
              item['courseItemScore'].forEach( itm => {
                obj['courseItemId'] = itm.courseItemId
                obj[itm.courseItemId] = itm.score
                obj['score'] = itm.score
              })
              obj['scoreStatus'] = item.scoreStatus
              obj['comments'] = item.comments
              newTableData.push(obj)
            })
            log(newTableData,'newtable')
            this.tableDataInfo = newTableData
            if(this.tableDataInfo.length === 0) {
              this.$notify({title: '提示', message: '无学生信息，请至基础数据维护班级学生信息', type: 'warning'})
              return
            }
            this.initHotTable(newTableData);
          }else{
            this.$notify({title: '错误', message: res.resultMessage, type: 'error'})
          }

        })
      },
      /**
       * 表格数据
       */
      getTableColumn(){
        const tableColumn = [];
        let that = this
        /**
         * 验证
         */
        function checkOldValidator(value,callback) {
          log(that.tableData,'vvv')
          log(this,'vvv')
          log(that.$refs.HotTable.hotInstance.getData(),'vvv')
          // debugger
          if(value) {
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
          }else {
            callback(true)
          }

        }
        function selectValueValidator(value,callback) {
          if(value) {
            log(that.tableTitleCode[this.col],'vlaue')
            // 下拉类型验证
            if(_.find(that.getTableColumn(),{'data': that.tableTitleCode[this.col]}).type == 'dropdown') {
              let dropdown = _.find(that.getTableColumn(),{'data':that.tableTitleCode[this.col]})
              if(!dropdown.source.includes(value)) {
                that.$notify({title: '错误', message: '输入的值不是该等级类型的子项', type: 'error'})
                callback(false)
              } else {
                // 是否与原数据相同
                let result = false
                let beforeScore = ''
                log(that.beforeScoreList,'forin')
                that.beforeScoreList.forEach(item => {
                  if(item.row === this.row && item.col === this.col) {
                    if(item.beforeScore != value) {
                      log(item.beforeScore,'原成绩  ', value,'复审成绩')
                      beforeScore = item.beforeScore
                      result = true
                    }
                  }
                })
                callback(!result)
              }
            }else {
              callback(false)
            }
          }else {
            callback(true)
          }
        }
        // 拼接列数据
        this.tableTitleCode.forEach((code,index,arr) =>{
          if(index == 1 || index == 0) {
            tableColumn.push({data: code,readOnly: true});
          }else if(index == (arr.length-2)) {
            tableColumn.push({data: code,type: 'dropdown',source: ['正常', '缺考', '作弊']});
          }else if(index == (arr.length-1)) {
            tableColumn.push({data: code,validator(value, callback) {
              if (value.length > 50) {  // 限制50个字符
                log(this)
                that.$refs.HotTable.hotInstance.setDataAtCell(this.row, this.col, value.substring(0, 50), null);
                that.$notify({title: '提示', message: '备注不能超过50个字符', type: 'info'})
              }
              callback(true);
            } });
          }else {
            if(this.scoreLevel.length > 0) { // 等级方式
              tableColumn.push({data: code,type: 'dropdown',source: this.scoreLevel,validator:selectValueValidator});
            }else {                          // 分数方式
              tableColumn.push({data: code,validator:checkOldValidator, allowInvalid: true});
            }
          }
        });
        log(tableColumn,'tableColumn')
        return tableColumn;
      },
      initHotTable(tableData){
        const that = this;
        setTimeout(() => {
          // 计算并设置列宽度
          this.colWidth = document.getElementsByClassName('wtHolder')[0].style.width.split('px')[0] / this.tableTitleCode.length - 1
          this.$refs.HotTable.$el.style.height = 24 * (tableData.length + 10) + 'px'
          this.$refs.HotTable.hotInstance.updateSettings({colWidths: this.colWidth})
          // log(this.$refs.HotTable.$el.style.height,tableData.length)

        },4)
        this.hotSettings = {

          //定义数据
          data: tableData,
          //定义表结构
          colHeaders:that.tableTitleValue,
          //定义属性
          columns:that.getTableColumn(),
          className: "htCenter",
          autoColumnSize: true,
          colWidths: '120%',
          maxRows:tableData.length,     //表格最大行，禁止自动增加行数
          manualColumnFreeze: true, //手动固定列
          manualColumnResize: true,//手工更改列距
          manualRowResize: true,//手动更改行距
          columnSorting: true,//排序
          // fillHandle: false,                          // 禁用自动填充
          beforeChange: function (change,source) {
            log(that.$refs.HotTable.hotInstance.getData(),'cchangeber')
            
            // 拼接历史成绩列表 ｛row,col,score｝
            that.beforeScoreList = []
            let beforeScore = ''
            // log(beforeData,'befdata')
            change.forEach(changeItem => {
              // log(changeItem,'change')
              let beforeData = that.tableData[changeItem[0]]
              beforeData.courseItemScore.forEach(item => {
                if(item.courseItemId == changeItem[1]){ // 课程分项id相等获取之前录入的数据
                  const tempObj = {}
                  tempObj.row = changeItem[0]
                  tempObj.col = that.tableTitleCode.indexOf(changeItem[1])
                  tempObj.beforeScore = item.beforeScore
                  that.beforeScoreList.push(tempObj)
                }
              })
            })


          },
          afterChange: function (change, source) {
            // log(change,252)
            if (source === 'loadData') {
              return;
            }else{
              that.colIndexList = []
              change.forEach(item => {
                that.colIndexList.push(that.tableTitleCode.indexOf(item[1]))
              })
              // that.colIndexList.push(that.tableTitleCode.indexOf(change[0][1]))
              log(that.colIndexList,'378')

              log(that.tableTitleCode,'code')
              log(that.beforeScoreList,'beflist')
              if(change.length > 1) {
              }else {
                log(validatNumberDecimals1(change[0][3]), ' validate')
                log(that.scoreLevel,'data')
                if((validatNumberDecimals1(change[0][3]) && change[0][3] < that.fullScore[that.tableTitleCode.indexOf(change[0][1])-2]) || that.scoreLevel.length > 0) {
                  // 是否与原数据相同
                  let beforeScore = ''
                  log(that.beforeScoreList,'forin')
                  that.beforeScoreList.forEach(item => {
                    if(item.row === change[0][0] && item.col === that.tableTitleCode.indexOf(change[0][1])) {
                      if(item.beforeScore != change[0][3]) {
                        log(item.beforeScore,'原成绩  ', change[0][3],'复审成绩')
                        beforeScore = item.beforeScore
                        // 初始化复审弹窗数据
                        that.afterData = []  // 弹窗数据
                        that.positionInfo = {row: change[0][0], col: that.tableTitleCode.indexOf(change[0][1])}
                        that.afterData.push(beforeScore)
                        that.afterData.push(change[0][3])
                        log(that.afterData,'afterData')
                        that.centerDialogVisible = true   // 打开弹层
                        that.radio = that.afterData[0]    // 默认值
                      }
                    }
                  })
                }
              }



              const autosaveNotification = setTimeout(function() {
                // 验证表格是否有红色
                let tdNodes = document.getElementsByTagName('td')
                let cannotSave = false
                const scoreList = that.$refs.HotTable.hotInstance.getData();
                tdNodes.forEach(item => {
                  // log(item)
                  if(Array.from(item.classList).includes('htInvalid')){ // 有红色样式
                    if(item.innerHTML == ''){
                    }else {
                      // 有红色未通过验证的单元格，将其值改为0，然后保存
                      const positionInfo = that.$refs.HotTable.hotInstance.getCoords(item) // 通过元素获取坐标
                      log(positionInfo,'posiINfo')
                      that.$refs.HotTable.hotInstance.setDataAtCell(positionInfo.row,positionInfo.col,''); // 表格数据改变
                      scoreList[positionInfo.row][positionInfo.col] = ''   // 上传数据改变
                    }
                  }
                })
                that.saveScore(scoreList)

              }, 300000);
            }
          },
          afterInit() {
            // 初始化后获取所有单元格成绩的原成绩
            let newHeaderList = that.tableTitleCode.slice(2,that.tableTitleCode.length -2) // 获取过滤的表头
            log(newHeaderList,'newar')
            log(that.tableData,'newar')
            that.beforeScoreList = []
            that.tableData.forEach((item,index) => {
              if(newHeaderList.length > 0) {
                
                  if(item.courseItemScore && item.courseItemScore.length > 0) {
                    item.courseItemScore.forEach(courseItem => {
                      newHeaderList.forEach(itm => {
                      let colIndex = that.tableTitleCode.indexOf(itm)  // 获取对应表头的列索引
                      if(courseItem.courseItemId == itm) {
                        const tempObj = {}
                        tempObj.row = index
                        tempObj.col = colIndex
                        tempObj.beforeScore = courseItem.beforeScore
                        that.beforeScoreList.push(tempObj)
                      }
                      })
                    })
                  }
                
                
              }
            })
            log(that.beforeScoreList,'yer befolist')
          },
          // beforeValidate (value, row, prop,source) {
          //   // debugger
          //   log(value, row, prop,source,429)
          //   // 拼接历史成绩列表 ｛row,col,score｝
          //   if(that.isUploadFile) {
          //     that.beforeScoreList = []
          //     let beforeScore = ''
          //     // log(beforeData,'befdata')
          //     // change.forEach(changeItem => {
          //       // log(changeItem,'change')
          //       let beforeData = that.tableData[row]
          //       beforeData.courseItemScore.forEach(item => {
          //         if(item.courseItemId == prop){ // 课程分项id相等获取之前录入的数据
          //           const tempObj = {}
          //           tempObj.row = row
          //           tempObj.col = that.tableTitleCode.indexOf(prop)
          //           tempObj.beforeScore = item.beforeScore
          //           that.beforeScoreList.push(tempObj)
          //         }
          //       })
          //       // that.isUploadFile = false
          //   }
            
            // })
          // }
          // afterOnCellMouseDown: function (event, coords, TD) { // 当前点击的单元格
          //   log(event, coords, TD)
          //   TD.classList.forEach(item => {
          //     if(item == 'htInvalid'){
          //       log(that.afterData,'afterData')
          //       that.positionInfo = coords
          //       that.centerDialogVisible = true
          //       that.radio = that.afterData[0]
          //     }
          //   })
          // }
        }
        this.isShow = true;
      },
      /**
       * 返回
       */
      goback() {
        this.$router.go(-1)
      },
      /**
       * 复审单元格修改
       */
      handlerEdit() {
        this.centerDialogVisible = false
        log(this.positionInfo,'positon')
        log(this.radio,'radio')

        log(this.tableData,'infodata')
        this.tableData.forEach((item,index) => {
          if(index === this.positionInfo.row) {
            item.courseItemScore.forEach((courseItem,courseIndex) => {
              if(courseIndex === (this.positionInfo.col-2)) {
                courseItem.beforeScore = this.radio
              }
            })
          }
        })
        this.$refs.HotTable.hotInstance.setDataAtCell(this.positionInfo.row, this.positionInfo.col, this.radio);
        //  this.saveScore()
      },
      /**
       * 提交
       */
      handlerSubmit(){
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
        if(nullCount === 0) {
          let tdNodes = document.getElementsByTagName('td')
          let cannotSave = false
          let count = 0
            tdNodes.forEach(item => {
              // log(item)
              if(Array.from(item.classList).includes('htInvalid')){ // 有红色样式
                if(item.innerHTML == ''){
                }else {
                  count++
                }
              }
            })
            log(count,'coutn')
            if(count>0) {
              this.$notify({title: '提交失败！', message: '存在验证未通过单元格', type: 'error'})
              return
            }else {
              this.$confirm('提交后将不能再次录入是否提交？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                const scoreList = this.$refs.HotTable.hotInstance.getData();
                const waitSaveScore = this.formatScore(scoreList);
                api.submitClassConfirmScore(waitSaveScore).then(res => {
                  if(res.resultCode==1){
                    this.$notify({title: '提交成功', message: '提交成功', type: 'success', duration: 2000})
                    this.changeDataList = [];
                    this.$router.go(-1)
                  }else{
                    this.$notify({
                      title: '失败',
                      message: '提交失败' + res.resultMessage,
                      type: 'error',
                    });
                  }
                })
              }).catch(() => {
                this.$notify({title: '提示', message: '已取消提交', type: 'info'})
              });
          }
          
        }else {
            this.$notify({title: '提交失败！', message: '成绩信息不允许为空！', type: 'error'})
        }
      },
      /**
       * 保存
       */
      saveScore(scoreList){
        
        // 分项录入 需要遍历分项成绩
        try{
          let tdNodes = document.getElementsByTagName('td')
          let cannotSave = false
          let count = 0
          if(!scoreList){
            scoreList = this.$refs.HotTable.hotInstance.getData();
            tdNodes.forEach(item => {
              // log(item)
              if(Array.from(item.classList).includes('htInvalid')){ // 有红色样式
                if(item.innerHTML == ''){
                }else {
                  count++
                }
              }
            })
            if(count>0) {
              this.$notify({title: '保存失败！', message: '存在验证未通过单元格', type: 'error'})
              return
            }
          }
          log(scoreList,'scorelist')


        // this.$refs.HotTable.hotInstance.updateSettings({data:this.tableDataInfo},true)
          const waitSaveScore = this.formatScore(scoreList);
          log(this.$refs.HotTable.hotInstance.getSourceData(),'datainfo')
          api.saveClassConfirmScore(waitSaveScore).then(res => {
            if(res.resultCode==1){
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              });
              this.changeDataList = [];
            }else{
              this.$notify({
                title: '失败',
                message: '保存失败' + res.resultMessage,
                type: 'error',
              });
            }
          })
        }catch(e){
          log(e)
        }
      },
      formatScore(scoreList){
        log(this.tableTitleCode,'tableTitleCode');
        log(this.subItemCode,'subItemCode');
        const waitToSaveScore = [];
        const status = ['','正常','缺考','作弊']    // 考试状态 对应 1，2，3
        scoreList.forEach(score=>{
          const studentScore = {courseItemScore:[],examSubjectId:this.examSubjectId};
          this.tableTitleCode.forEach((code,index)=>{
            if(code == 'scoreStatus'){
              studentScore[code] =status.indexOf(score[index]);
            }else {
              studentScore[code] =score[index];
            }
          });
          waitToSaveScore.push(studentScore);
        })
        log(waitToSaveScore,this.tableData,'waitToSaveScore')
        waitToSaveScore.forEach(score=>{
          let beforeData = _.find(this.tableData,{'studentCode':score.studentCode}) // 录入得到的数据 tableData
          log(beforeData,'beforeData')
          log(this.subItemCode,'this.subItemCode')
          this.subItemCode.forEach(code=>{
            let beforeDataSub = _.find(beforeData.courseItemScore,{'courseItemId':code}) // 与 Code 相同的 tableData 的 courseItemScore
            log(beforeDataSub,'beforeDataSub')
            const itemScore = {courseItemId:code,score:score[code],examSubjectId:this.examSubjectId,beforeScore: beforeDataSub.score};
            score.courseItemScore.push(itemScore)
          });

        })
		    return waitToSaveScore;
      },
      /**
       * 下载导出
       */
      downLoadFile(){
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = this.tableTitleValue;
          const filterVal = this.tableTitleCode;
          const scoreList = this.$refs.HotTable.hotInstance.getData();
          const waitToSaveScore = [];
          scoreList.forEach(score=>{
            const studentScore = {};
            this.tableTitleCode.forEach((code,index)=>{
              studentScore[code] =score[index];
            });
            waitToSaveScore.push(studentScore);
          })
          const data = waitToSaveScore.map(v => filterVal.map(j => v[j]));
          excel.export_json_to_excel(tHeader, data, '班级成绩模板')
        })
      },
      /**
       * 导入
       */
      uploadFile(json) {
        
        log(json,'json')
        if(json.header.length !== this.tableTitleCode.length){
          this.$alert('excel表头不匹配，请下载正确的模板。', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: () => false
          });
          return false
        }else {
          this.isUploadFile = true
          const data = json.results
          let isFlag = false
          data.forEach(item => {
            for(let key in item) {
              if(!this.tableTitleValue.includes(key)){   // 表头是否正确
                isFlag = true
              }
            }
            if(!this.studentCodeList.includes(item['学号']) || !this.studentNameList.includes(item['姓名'])) {    // 学号姓名是否正确
              // log(item['学号'],item['姓名'])
              isFlag = true
            }
          })
          if(isFlag) {
            this.$alert('表格数据格式错误，请下载正确的模板。', '提示', {
              type: 'warning',
              confirmButtonText: '确定',
              callback: () => false
            });
            return
          }
          if(data.length > 0) {
            let newArr = json.header.slice(2,json.header.length-2)
            const list = []
            data.forEach(item => {
              let obj = []
              obj.push(item['学号'])
              obj.push(item['姓名'])
              if(newArr.length > 0) {
                newArr.forEach(itm => {
                  obj.push(item[itm])
                })
              }
              obj.push(item['考试状态'])
              obj.push(item['备注'])
              list.push(obj)
            })
            this.formatScore(list)
            log(list,'list')
            const result = []
            list.forEach((item,index) => {
              const newObj = {}
              item.forEach((itm,inx) => {
                newObj[this.tableTitleCode[inx]] = itm
              })
              result.push(newObj)
            })
            log(result,'updata')
            log(this.tableData,'updata')
            // this.
            this.$refs.HotTable.hotInstance.updateSettings({data:result}) // 更新数据
            
            // result.forEach((item,index) => {
            //   let newArr = this.tableTitleCode.slice(2,this.tableTitleCode.length-2)
            //   if(newArr.length > 0) {
            //     newArr.forEach(itm => {
            //       log(item[itm],'reslut newarr')
            //       let colIndex = this.tableTitleCode.indexOf(itm)
            //       this.$refs.HotTable.hotInstance.setDataAtCell(index,colIndex,item[itm])
            //     })
            //   }
              
            // })
            this.$refs.HotTable.hotInstance.validateCells(valid => {// 验证所有单元格
              if(valid) {
                log(this.beforeScoreList,'updatabeflist')
                // this.saveScore()
              }
            })
          }
        }
      },
      deactivated() {
        clearInterval(this.timerId)
      }
    }
  }
</script>
<style lang="">
  .handsontable td.data-different{
    background: #66b1ff !important;
  }
</style>
<style lang="scss" scoped>
.title{
  margin: 20px 0 0 20px;
  font-size: 18px;
}
.header{
  margin: 0 0 10px 0;
  .wtHider{
    width: 100% !important;
  }
}


</style>
