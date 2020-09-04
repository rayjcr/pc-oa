<template>
  <div>
    <el-button type="primary"
              size="small"
              style="margin:0 5px 10px;float:right;"

              @click="handlerEditTeacher">批量设置</el-button>
    <el-button type="primary"
              size="small"
              style="margin:0 5px 10px;float:right;"

              @click="handlerClearTeacher">批量清空</el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      size="medium"
      style="width: 100%" 
      @selection-change="handlerSelect"
      ref="table">
      <el-table-column
      type="selection"
      width="55">
    </el-table-column>
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
        label="录入老师"
        width="320">
        <template slot-scope="scope">
                    <div class="selBox">
                        <div class="selBox-input">
                            <input autocomplete="off" v-model="scope.row.enteringTeacher" placeholder="" size="" readonly="readonly" type="text" rows="2" class="el-input__inner" @click="openDialog(scope.row)">
                        </div>
                    </div>
                </template>
      </el-table-column>
    </el-table>
    <teacher-group types="drawer" 
                  ref="teacherGroup"
                  :dialogVisiable="drawer" 
                  :limit="maxCount === 0 ? limit:maxCount"
                  :selectedTeacher="currentItem.permissionTeacher" 
                  @handlerClose="handlerClose" 
                  @sumbit-select-teacher="submitSelect"
                  v-if="drawer"></teacher-group>
  </div>
</template>

<script>
  import { getScorePermissionList,saveScorePermission,initExamScorePermission,deleteBatchPermission } from '@/api/ksgl/kslrqx/index'
  import teacherGroup from '@/components/TeacherGroup/index'
  export default {
    name: 'kslrqx',
    data() {
      return {
        loading: true,
        tableData: [],
        restaurants: [],                         // 教师列表
        restaurantsCopy: [],
        enteringTeacherList: [],                 // 录入老师列表
        state1: '',
        ksid: this.$route.query.ksid,
        dqxn: this.$route.query.dqxn,
        ksxq: this.$route.query.ksxq,
        xxdm: window.localStorage.getItem('xxdm'),
        isFlag: false,

        // 抽屉
        drawer: false,
        direction: 'rtl',
        currentClassName: '',                   // 当前班级
        currentCourseName: '',                  // 当前科目
        currentSubItem: '',                     // 当前子项
        searchKey:"",                           //搜索的关键字
        currentItem: {},
        selectionList: [],                      // 批量增加
        selectionListCopy: [],
        maxCount: 0,                            // 录入老师还剩可选数
        limit: 5,                               // 用户可选最大数量
        beforeTeacherCodeList: [],              // 已选择的老师code

        isFlag: false,
        isClear: false,                         // 是否批量清空过
      }
    },
    components: {
      teacherGroup
    },
    props: {
      jsList: {
        type: Array,
        required: true
      },
      jszList: {
        type: Array,
        required: true
      }
    },
    mounted() {
      this.restaurants = this.loadAll()
      this.restaurantsCopy = _.cloneDeep(this.restaurants)
      this.getInit()
      log(this.jsList,'js-list')
      log(this.jszList,'jsz-list')
    },
    methods: {
      getInit() {
        // 初始化录入老师信息
        initExamScorePermission({examId: this.ksid}).then(res => {
          if(res.resultCode === 1) {
            this.getTableDate()
          }
        })
      },
      getTableDate() {
        // 获取教师数据
        getScorePermissionList({examId: this.ksid}).then(res => {
          this.loading = false
          // log(res)
          if(res.resultCode === 1) {
            this.tableData = res.value
            if(this.tableData && this.tableData.length > 0){
              this.tableData.forEach(itm => {
                let tempArr = []
                let tempName = []
                // 获取录入老师
                itm.permissionTeacher.forEach(item => {
                  tempArr.push(item.teacherCode)
                })
                // tags显示
                this.enteringTeacherList = this.restaurants.filter(item => {
                  return tempArr.includes(item.value)
                })
                log(this.enteringTeacherList,'list')
                this.enteringTeacherList.forEach(item => {
                  tempName.push(item.label)
                })
                log(tempName,'name')
                // input显示
                this.$set(itm,'enteringTeacher',tempName) // 初始化录入老师
              })
              log(this.tableData,'tabdalta')
            }
          }
        })

      },
      /**
       * 打开弹层
       */
      openDialog(row) {
        log(row,'row')
        if(row.enteringTeacher.length === 0 && this.isClear) {
          this.clearSelectTeacher()
        }
        this.$refs['table'].clearSelection()
        this.selectionListCopy = _.cloneDeep(this.selectionList)  // 避免因多选点击单个教师选择弹层时误清除
        this.selectionList = []   // 重置批量选中数据
        this.currentItem = row    // 设置当前选中的行
        this.currentSubItem = row.examSubjectId    // 当前选中行的id
        this.drawer = true
        
      },
      
      /**
       * 下拉框数据
       */
      loadAll() {
        let temp = [] // 创建下拉数据
        this.jsList.forEach(element => {
          const obj = {}
          obj.value = element.gh // 职工号
          obj.label = element.xm // 姓名
          temp.push(obj)
        })
        return temp
      },
      /**
       * 提交录入老师信息
       */
      submitSelect(selectList) {
          log(selectList,'list')
          let param = []
          if(selectList && selectList.length > 0) {
            if(this.selectionList && this.selectionList.length > 0) {   // 批量操作
              this.selectionList.forEach(selectItem => {
                selectList.forEach(item => {
                  let codeReplace = false   // 判断是否重复
                  // if(selectItem.permissionTeacher && selectItem.permissionTeacher.length > 0) {
                  //   selectItem.permissionTeacher.forEach(itm => {
                  //     if(itm.teacherCode == item.code){
                  //       codeReplace = true
                  //     }
                  //   })
                  // }
                  if(!codeReplace){
                    let ScorePermission = {
                      "examId": this.ksid,
                      "examSubjectId": selectItem.examSubjectId,
                      // "id": "string",
                      "schoolTerm": this.ksxq,
                      "schoolYear": this.dqxn,
                      "teacherCode": item.code,
                      "xxdm": this.xxdm
                    }
                    param.push(ScorePermission)
                  }
                })
              })
            }else {    // 单项操作
              selectList.forEach(item => {
                let ScorePermission = {
                  "examId": this.ksid,
                  "examSubjectId": this.currentItem.examSubjectId,
                  // "id": "string",
                  "schoolTerm": this.ksxq,
                  "schoolYear": this.dqxn,
                  "teacherCode": item.code,
                  "xxdm": this.xxdm
                }
                param.push(ScorePermission)
              })
            }
            
            // 保存录入老师
            saveScorePermission(param).then(res => {
              if(res.resultCode === 1) {
                log(res)
                log(this.tableData,'tabledata')
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 2000
                })
                
                this.drawer = false
                this.getTableDate()
                this.selectionList = []
                this.maxCount = 0
                this.isClear = false
                
              }else {
                this.$notify({
                  title: '失败',
                  message: '保存失败，' + res.resultMessage,
                  type: 'error'
                })
              }
            })
          }
      },
      handlerSelect(selection, row) {
        log(selection, row,'select')
        // 获得所有勾选的数据
        this.selectionList = selection
        // 拼接成新数据并传给弹层
        // 弹层勾选教后给每个勾选的行增加教师
      },
      /**
       * 批量增加 
       */
      handlerEditTeacher() {
        log(this.selectionList)
        const tempObj = {} 
        tempObj.permissionTeacher = []  // 默认不显示已选老师
        this.beforeTeacherCodeList = []
        if(this.selectionList && this.selectionList.length > 0) {
          this.selectionList.forEach(item => {
            if(item.permissionTeacher.length > this.maxCount) {
              this.maxCount = item.permissionTeacher.length
            }
            item.permissionTeacher.forEach(teacherItem => {
              if(!this.beforeTeacherCodeList.includes(teacherItem.teacherCode)) {
                this.beforeTeacherCodeList.push(teacherItem.teacherCode)
              }
            })
          })
          
          log(this.beforeTeacherCodeList,'beforeTeacherCodeList')
          log(this.maxCount,'maxCount')
          this.maxCount = this.limit - this.maxCount      // 还能选择数，不能超过 5 个算上已选的
          if(this.maxCount === 0) {
            this.$notify({
              title: '提示',
              message: '操作失败，录入老师最多可选' + this.limit + '项',
              type: 'warning'
            })
            return
          }
          // tempObj.permissionTeacher = [].concat.apply([],tempObj.permissionTeacher)
          this.selectionListCopy = _.cloneDeep(this.selectionList)  // 避免因多选点击单个教师选择弹层时误清除
          this.currentItem = tempObj
          this.drawer = true
          if(this.isClear) {
            this.clearSelectTeacher()
          }
        }else {
          this.$notify({
            title: '提示',
            message: '操作失败，请选择需要设置的项',
            type: 'warning'
          })
        }
        
      },
      clearSelectTeacher() {
        let tempArr = []
        let ids = ''
        if(this.selectionList && this.selectionList.length > 0) {
          this.selectionList.forEach(item => {
            ids += item.examSubjectId + ","
            // this.$set(item,'enteringTeacher', [])
            // this.$set(item,'permissionTeacher', [])
          })
          this.isClear = true
          
          let param = {
            examId: this.ksid,
            ids:ids
          }
          deleteBatchPermission(param).then(res => {
            if(res.resultCode === 1) {
              log(res,'clearlist')
              // this.getTableDate()
              // this.selectionList = []
              this.maxCount = 0
            }
          })
        }
      },
      /**
       * 批量清空
       */
      handlerClearTeacher() {
        log(this.selectionList,'clear')
        let tempArr = []
        let ids = ''
        if(this.selectionList && this.selectionList.length > 0) {
          this.selectionList.forEach(item => {
            // tempArr.push(item.examSubjectId)
            // ids += item.examSubjectId + ","
            this.$set(item,'enteringTeacher', [])
            this.$set(item,'permissionTeacher', [])
          })
          this.isClear = true
          this.$notify({
            title: '成功',
            message: '操作成功，记得点击完成',
            type: 'success',
            duration: 2000
          })
          // let param = {
          //   examId: this.ksid,
          //   ids:ids
          // }
          // log(tempArr)
          // deleteBatchPermission(param).then(res => {
          //   if(res.resultCode === 1) {
          //     log(res)
          //     this.getTableDate()
          //     this.selectionList = []
          //     this.maxCount = 0
          //   }
          // })
        }else {
          this.$notify({
            title: '提示',
            message: '操作失败，请选择需要清空的项',
            type: 'warning'
          })
        }
        
      },
      /**
       * 验证教师是否为空
       */
      validateEnterTeacher() {
        log(this.tableData,'datatable')
        let result = false
        this.tableData.forEach(item => {
          if(item.permissionTeacher.length === 0){
            result = true
          }
        })
        return !result
      },
      handlerClose() {
        this.selectionList = this.selectionListCopy
        log(this.selectionList, this.selectionListCopy,'selectionList2222')
        log(this.maxCount,'close,max')
        this.maxCount = 0
        this.drawer = false
        
      }
    },
  }
</script>

<style lang="scss" scoped>
    .selBox{display: inline-block; position: relative;width: 300px;}
    .selBox-input{position: relative; font-size: 14px;display: block;width: 100%;}
    .selBox .el-input__inner{ cursor: pointer;}
    .selBox .el-input__icon{ display: none;}
    .selBox:hover .el-input__icon{ display: block;}
    .selCourseTeach{
        padding: 0 20px;
        width: 100%;
        font-size: 16px;
        line-height: 24px;
        min-height: 70px;
        border-bottom: 1px dotted #f8f8f8;
        position: relative;
        .tagTeacher{
            width: 100%;
            /deep/ .el-tag{
                margin-top: 10px;
                margin-right:10px;
            }
        }
        .tagNull{
            position: absolute;
            bottom: 0;
            padding-top: 15px;
            line-height: 30px;
            color: #999;
            font-size: 14px;
            width: 100%;
            text-align: center;
        }
    }
    .searchBox{
        padding: 0 20px;
        position: relative;
        i{
            position: absolute;
            display: inline-block;
            width:30px;
            height: 30px;
            text-align: center;
            line-height: 28px;
            font-size: 16px;
        }
        /deep/ input{
            text-indent: 10px;
        }
    }
    .allTeacherList{
        margin-top: 10px;
        width: 100%;
        max-height: 600px;
        overflow: auto;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        .unitTeacherBox{
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: #444;
            padding: 0 20px;
            width: 100%;
            cursor: pointer;
            transition: .2s ease-in-out;
        }
        .unitTeacherBox:hover{
            background: #ecf5ff;
        }
        .noTeacher{
            width: 100%;
            height: 100px;
            text-align: center;
            line-height: 100px;
            font-size: 14px;
            color: #999;
        }

    }
    .drawer-footer{
      margin-top: 22px;
      margin-left: 10px;
    }
</style>
