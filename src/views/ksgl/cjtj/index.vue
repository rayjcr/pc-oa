<template>
  <div class="app-container calendar-list-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="学年：">
        <el-select v-model="selectedXn" placeholder="请选择学年" style="margin:0 2% 2% 0" @change="getKsmc('xn')">
          <el-option
            v-for="(item,index) in optionsXn"
            :key="index"
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
        <el-select v-model="selectedNj" placeholder="请选择年级" style="margin:0 2% 2% 0" @change="selectedNjGetKc" >
          <el-option
            v-for="item in optionsNj"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId"
            >
          </el-option>
        </el-select>
          </el-form-item>
          <el-form-item label="课程：">
        <el-select v-model="selectedKc" placeholder="请选择课程" style="margin:0 2% 2% 0" >
          <el-option
            v-for="item in optionsKc"
            :key="item.courseId"
            :label="item.courseName"
            :value="item.courseId"
            >
          </el-option>
        </el-select>
          </el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" @click="handlerSearch">搜索</el-button> -->
          <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handlerOpenDialog">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-download" @click="downLoadFile">导 出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="m_GenTableBox">
      <el-table
        v-loading="loading"
        :data="tableData"
        size="medium"
        style="width: 100%;margin:10px 0" >
        <el-table-column
          :prop="item.code"
          :label="item.name" v-for="item in tableHeader" :key="item.code">
        </el-table-column>
      </el-table>

      <!--工具条-->
      <!-- <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div> -->
      </div>
    </div>
    <el-dialog title="统计维度设置" :visible.sync="dialogFormVisible">
          <el-form :model="form" label-position="top">
            <el-form-item style="border-bottom:1px solid #ddd;">
              <el-checkbox label="全选" :indeterminate="isIndeterminate" v-model="checkAll" name="type" @change="handlerCheckAll" ></el-checkbox>
            </el-form-item>
            <el-form-item label="" prop="type" style="border-bottom:1px solid #ddd;margin-top:-10px;">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="最高分" name="type"></el-checkbox>
                <el-checkbox label="最低分" name="type"></el-checkbox>
                <el-checkbox label="中位分" name="type"></el-checkbox>
                <!-- <el-checkbox label="等级比例" name="type"></el-checkbox> -->
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="" >
              <el-checkbox-group v-model="form.classType" style="border-bottom:1px solid #ddd;margin-top:-10px;">
                <el-checkbox  name="type" label="平均分"></el-checkbox>
                <el-checkbox  name="type" label="班级年级均分差"></el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-model="form.beforeChecked" style="border-bottom:1px solid #ddd;margin-top:10px;padding-bottom:10px">
                <el-checkbox  name="type" :label="itm" v-for="(itm,inx) in form.before" :key="itm" @change="handlerCheckboxChange(itm,'before')">前<el-input v-model.number="form.beforeVal[itm]" placeholder="" style="width:60px" maxlength="3" ></el-input>%平均分<el-button type="text" style="margin-left:10px;color:#F56C6C;" @click="delRange(inx,itm,'before')">删除</el-button></el-checkbox>
                <el-button type="text" style="margin-left:20px;" @click="addRange('before')">增加</el-button>
              </el-checkbox-group>
              <el-checkbox-group v-model="form.afterChecked" style="border-bottom:1px solid #ddd;margin-top:10px;padding-bottom:10px;">
                <el-checkbox  name="type" :label="itm" v-for="(itm,inx) in form.after" :key="itm" @change="handlerCheckboxChange(itm,'after')">后<el-input v-model.number="form.afterVal[itm]" placeholder="" style="width:60px" maxlength="3"></el-input>%平均分<el-button type="text" style="margin-left:10px;color:#F56C6C;" @click="delRange(inx,itm,'after')">删除</el-button></el-checkbox>
                <el-button type="text" style="margin-left:20px;" @click="addRange('after')">增加</el-button>
              </el-checkbox-group>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handlerSaveMcdTj">确 定</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
  import * as api from '@/api/ksgl/kswh/index'
  import * as apiMain from '@/api/ksgl/cjcx/index'
  import { getExamReleasePageList } from '@/api/ksgl/cjfb/index'
  import { getScoreCountList } from '@/api/ksgl/cjtj/index'
  export default {
    name: 'cjtj',
    data() {
      const beforeRanges = [0]
      const afterRanges = [0]
      const validatemcdListVal = function (value) {
        log(value)
      }
      return {
        loading: false,
        optionsXn: [],
        optionsXq: [],
        optionsKsmc: [],
        optionsNj: [
          {gradeId: 'all', gradeName: '全部年级'}
        ],
        optionsKc: [
          {courseId:'all',courseName: '全部课程'}
        ],

        selectedXn: '',
        selectedXq: '',
        selectedKsmc: '',
        selectedNj: 'all',
        selectedKc: 'all',

        tableData: [
        ],
        tableHeader: [], // 表头
        currentPage: 1,
        limit: 10,

        dialogFormVisible: false,
        isIndeterminate: false,
        checkAll: false,
        form: {
          type: [],
          classType: [],
          before: beforeRanges,
          beforeChecked: [],
          beforeVal: {0:''},
          after: afterRanges,
          afterChecked: [],
          afterVal: {0:''},
        },
        formLabelWidth: '120px',
        beforeList: [],
        afterList: [],
        attrList: [],
        segmentList: [30],
        isSaveTjsz: false,

        xxdm: window.localStorage.getItem('xxdm'),
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
            log(this.optionsKsmc,'kcmc11')

            // this.selectedKsmc = this.optionsKsmc[0].examId
            // 获取年级列表
            // apiMain.getGradeByExamId({examId:this.optionsKsmc[0].examId}).then(res => {
            //   if(res.resultCode === 1) {
            //     log(res,'nj')
            //     this.optionsNj = res.value
            //     apiMain.getGradeExamCourseList({examId:this.optionsKsmc[0].examId,gradeId:this.optionsNj[0].gradeId}).then(res =>{
            //       log(res,'res')
            //       if(res.resultCode === 1) {
            //         this.optionsKc = res.value
            //         // 获取表格数据
            //         this.handlerSearch()
            //       }
            //     })
            //   }
            // })
            }
          )
        })
        // // 获取课程
        // this.optionsKc = JSON.parse(window.sessionStorage.getItem('kc_list'))
        // let all = {kcmc: '全部',uuid: 'all'}
        // this.optionsKc.unshift(all)
      },
      /**
       * 获取考试名称
       * @param {sting} type 执行对象 xq  xn
       */
      async getKsmc(type) {
        if(type == 'xq') {
          if(this.selectedXn) {   // 学期判定学年存不存在
            let params = {
              schoolYear: this.selectedXn,
              schoolTerm: this.selectedXq
            }
            await apiMain.getExamList(params).then(res => {
              if(res.resultCode == 1){
                log(res,'ksmc22')
                // this.optionsKsmc = res.value
                this.optionsKsmc = res.value
                log(this.optionsKsmc,'ksmc')
                this.optionsKsmc = this.optionsKsmc.filter(item => {
                  return item.status == 1
                })
                log(this.optionsKsmc,'ksmc')
              }
            })
          }
        }else if(type == 'xn'){
          if(this.selectedXq) {   // 学年判定学期存不存在
            let params = {
              schoolYear: this.selectedXn,
              schoolTerm: this.selectedXq
            }
            await apiMain.getExamList(params).then(res => {
              if(res.resultCode == 1){

                this.optionsKsmc = res.value
                log(this.optionsKsmc,'ksmc33')
                this.optionsKsmc = this.optionsKsmc.filter(item => {
                  return item.status == 1
                })
                log(this.optionsKsmc,'ksmc')
              }
            })
          }
        }
      },
      /**
       * 选择考试名称，获取年级信息
       */
      selectedKsmcGetNj() {
        this.selectedNj = ''
        this.selectedKc = ''
        log(this.selectedKsmc,'ksmc')
        // 获取年级列表
        apiMain.getGradeByExamId({examId:this.selectedKsmc}).then(res => {
          if(res.resultCode === 1) {
            log(res,'nj')
            this.optionsNj = res.value
            const tempObj = {
              gradeId: "all",
              gradeName: "全部年级"
            }
            this.optionsNj.unshift(tempObj)
            // if(!this.selectedNj) {
              this.selectedNj = this.optionsNj[0].gradeId
            // }
            this.selectedNjGetKc()
          }
        })

      },
      /**
       * 选择年级获取课程
       */
      selectedNjGetKc() {
        this.selectedKc = ''
        apiMain.getGradeExamCourseList({examId:this.selectedKsmc,gradeId:this.selectedNj}).then(res =>{
          log(res,'res')
          if(res.resultCode === 1) {
            this.optionsKc = res.value
            let tempObj = {
              courseId: "all",
              courseName: "全部课程"
            }
            this.optionsKc.unshift(tempObj)
            // if(!this.selectedKc) {
              this.selectedKc = this.optionsKc[0].courseId
            // }
            // 获取表格数据
            // this.handlerSearch()
          }
        })
      },
      /**
       * 验证下拉框是否选中
       */
      vaildSelected() {
        if(!this.selectedKsmc) {
           this.$notify({
            title: '提示',
            message: '请选择考试名称！',
            type: 'warning'
          });
          return false
        }
        return true
      },
      /**
       * 打开设置前校验
       */
      handlerOpenDialog() {
        if(!this.vaildSelected()) {
          return
        }

        let param2 = {
          examId: this.selectedKsmc,
          gradeId: this.selectedNj,
          courseId: this.selectedKc
        }
        // 验证是否有等级录入
        apiMain.validationEntryMethod(param2).then(res => {
          if(res.resultCode === 1) {
            if(!res.value) {
              this.dialogFormVisible = true
            }else {
              this.$notify({
                title: '提示',
                message: '当前条件下的考试科目存在等级录入，无法统计',
                type: 'warning'
              })
              return
            }
          }
        })

      },
      /**
       * 获取表格数据
       */
      handlerSearch() {
        if(!this.isSaveTjsz){
          this.$notify({
            title: '提示',
            message: '请先设置统计维度！',
            type: 'warning'
          });
          return
        }
        this.tableData = []

        let param = {
          pageNum: this.currentPage,
          limit: this.limit,
          examId: this.selectedKsmc,
          gradeId: this.selectedNj,
          courseId: this.selectedKc || 'all',
          beforeList: this.beforeList,
          afterList: this.afterList,
          attrList: this.attrList,
        }
        this.loading = true
        getScoreCountList(param).then(res => {
          log(res,'tabledata')
          this.loading = false
          this.tableData = res.value
        })


        // if(!this.selectedKc) {
        //    this.$message.warning('请选择课程！');
        //   return
        // }

      },
      /**
       * 前后xx%平均分输入框验证
       */
      beforeAfterValValid() {
        let beforeValValid = false
        let afterValValid = false
        let result = false
        log(this.form.beforeChecked,'bfe')
        // 非空验证
        if(this.form.beforeChecked.length > 0) {
          for(let key in this.form.beforeVal) {
            if(!this.form.beforeVal[key]){
              beforeValValid = true
              break
            }
          }
        }
        if(this.form.afterChecked.length > 0) {
          for(let key in this.form.afterVal) {
            if(!this.form.afterVal[key]){
              afterValValid = true
              break
            }
          }
        }
        // 非空验证结束
        if(beforeValValid || afterValValid) {
          this.$notify({
            title: '提示',
            message: '保存失败，平均分不能为空！',
            type: 'warning'
          });
        }else {
          // debugger
          let befAftValResult = false
          for(let key in this.form.beforeVal) {
            if(this.form.beforeVal[key] && (0 > parseFloat(this.form.beforeVal[key]) || parseFloat(this.form.beforeVal[key]) > 100)) {
              befAftValResult = true
            }
          }
          for(let key in this.form.afterVal) {
            if(this.form.afterVal[key] && (0 > parseFloat(this.form.afterVal[key]) || parseFloat(this.form.afterVal[key]) > 100)) {
              befAftValResult = true
            }
          }
          if(befAftValResult){
            this.$notify({
              title: '提示',
              message: '设置失败，平均分不能小于0，或大于100！',
              type: 'warning'
            });
          }else {
            result = true
          }
        }
        return result
      },
      /**
       * 保存名次段统计
       */
      handlerSaveMcdTj(){
        log(this.form)
        if(this.form.type.length === 0 && this.form.beforeChecked.length === 0 &&this.form.afterChecked.length === 0 && this.form.classType.length === 0){ // 没有填写
          this.$notify({
            title: '提示',
            message: '保存失败，请至少填写一项！',
            type: 'warning'
          });
          return
        }
        console.log(this.form.beforeChecked.length,'check')

        if(this.form.beforeChecked.length > 0 || this.form.afterChecked.length >0){
          let beforeAfterValResult = this.beforeAfterValValid()
          if(!beforeAfterValResult){
            return
          }
        }
        // 获取type选择的结果
        let arr = [0,0,0]
        let attrList = ["最高分", "最低分", "中位分"]
        this.form.type.forEach(item => {
          arr[attrList.indexOf(item)] = 1
        })

        // 获取classtype选择的结果
        let classtypeArr = [0,0]
        let classtypeList = ["平均分", "班级年级均分差"]
        this.form.classType.forEach(item => {
          classtypeArr[classtypeList.indexOf(item)] = 1
        })
        this.attrList = arr.concat(classtypeArr)
        // 获取前xx%平均分
        let beforeList = []
        for(let bKey in this.form.beforeVal){
          this.form.beforeChecked.forEach(item => {
            if(item == bKey) {
              beforeList.push(this.form.beforeVal[bKey])
            }
          })
        }
        this.beforeList = beforeList
        // 获取后xx%平均分
        let afterList = []
        for(let aKey in this.form.afterVal){
          this.form.afterChecked.forEach(item => {
            if(item == aKey) {
              afterList.push(this.form.afterVal[aKey])
            }
          })
        }
        this.afterList = afterList

        log(this.averageList,this.beforeList,this.afterList,this.classTypeList,'params')
        this.dialogFormVisible = false
        this.isSaveTjsz = true

        this.getTableHeader()
        this.handlerSearch()
      },
      /**
       * 拼接表头
       */
      getTableHeader() {
        // 拼接表头
        const tableHeader = []  // ["班级平均分", "班级年级均分差"]
        this.form.type.forEach(item => {
          const tempObj = {}
          if(item == '最高分'){
            tempObj.code = 'highestScore'
            tempObj.name = item
            tableHeader.push(tempObj)
          }else if(item == '最低分'){
            tempObj.code = 'lowestScore'
            tempObj.name = item
            tableHeader.push(tempObj)
          }else if(item == '中位分'){
            tempObj.code = 'medianScore'
            tempObj.name = item
            tableHeader.push(tempObj)
          }
        })
        this.form.classType.forEach(item => {
          const tempObj = {}
          if(item == '平均分'){
            tempObj.code = 'classAverageScore'
            tempObj.name = item
            tableHeader.push(tempObj)
          }else if(item == '班级年级均分差'){
            tempObj.code = 'classGradeDifference'
            tempObj.name = item
            tableHeader.push(tempObj)
          }
        })
        // 前xx%平均分
        this.beforeList.forEach(item => {
          const tempObj = {}
          tempObj.code = 'before'+item+'%'
          tempObj.name = '前'+item+'%平均分'
          tableHeader.push(tempObj)
        })
        // 后xx%平均分
        this.afterList.forEach(item => {
          const tempObj = {}
          tempObj.code = 'after'+item+'%'
          tempObj.name = '后'+item+'%平均分'
          tableHeader.push(tempObj)
        })

        log(tableHeader,'heder')
        if(this.selectedNj == 'all') {
          tableHeader.unshift({code:'name',name:'年级'})
        }else {
          tableHeader.unshift({code:'name',name:'班级'})
        }
        this.tableHeader = tableHeader
      },
      /**
       * 前、后人数复选
       */
      handlerCheckboxChange(val,type) {
        if(type == 'before') {
          let newArr = []
          for(let key in this.form.beforeVal){
            this.form.beforeChecked.forEach(item => {
              if(item == key) {
                newArr.push(this.form.beforeVal[key])
              }
            })
          }
          log(newArr,'newValue')
        }else {
          let newArr = []
          for(let key in this.form.afterVal){
            this.form.afterChecked.forEach(item => {
              if(item == key) {
                newArr.push(this.form.afterVal[key])
              }
            })
          }
          log(newArr,'newValue')
        }

      },
      /**
       * 统计范围删除
       */
      delRange(index,item,type){
        if(type == 'before'){
          if(this.form.before.length < 2) return
          this.form.before.splice(index,1)  // 删除checkbox
          if(this.form.beforeChecked.indexOf(item) >= 0) { // 有选中状态才执行
            this.form.beforeChecked.splice(this.form.beforeChecked.indexOf(item),1) // 删除CheckBox的选中状态
          }
          delete this.form.beforeVal[item]  // 删除input值
        }else {
          if(this.form.after.length < 2) return
          this.form.after.splice(index,1)
          if(this.form.afterChecked.indexOf(item) >= 0) {
            this.form.afterChecked.splice(this.form.afterChecked.indexOf(item),1)
          }
          delete this.form.afterVal[item]
        }
      },
      /**
       * 统计范围添加
       */
      addRange(type) {
        log(this.form.before,'before')
        log(this.form.beforeVal,'beforeVal')
        if(type == 'before') {
          if(this.form.before.length < 4) {
            this.$set(this.form.beforeVal,this.form.before[this.form.before.length-1] + 1,'')
            this.form.before.push(this.form.before[this.form.before.length-1] + 1)
          }else {
            this.$notify({
              title: '新增失败',
              message: '新增最多4项',
              type: 'warning'
            });
          }

        }else {
          if(this.form.after.length < 4) {
            this.$set(this.form.afterVal,this.form.after[this.form.after.length-1]+1,'')
            this.form.after.push(this.form.after[this.form.after.length-1]+1)
          }else {
            this.$notify({
              title: '新增失败',
              message: '新增最多4项',
              type: 'warning'
            });
          }
        }
      },
      /**
       * 添加
       */
      addMCDContentItem(){
        this.$set(this.form.mcdListVal,this.form.mcdList[this.form.mcdList.length-1]+1,'')
        this.form.mcdList.push(this.form.mcdList[this.form.mcdList.length-1]+1)
        log(this.form.mcdList,this.form.mcdListVal,'mcdlist')
      },
      /**
       * 删除
       */
      removeMCDContentItem(index,item){
        if(this.form.mcdList.length > 1){
          this.form.mcdList.splice(index, 1);
          delete this.form.mcdListVal[item]
        }
      },
      /**
       * 全选
       */
      handlerCheckAll(val){
        if(val) {
          this.form.type = ["最高分", "最低分", "中位分", "等级比例"]
          this.form.classType = ["平均分", "班级年级均分差"]
          this.form.beforeChecked = this.form.before
          this.form.afterChecked = this.form.after
        }else {
          this.form.type = []
          this.form.classType = []
          this.form.beforeChecked = []
          this.form.afterChecked = []
        }
      },
      /**
       * 一页显示的个数
       */
      handleSizeChange(val) {
        this.limit = val
      },
      /** 切换页码 **/
      handleCurrentChange(val) {
        log(val,'yema ')
      },
      /**
       * 下载导出
       */
      downLoadFile() {
        if(!this.vaildSelected()) {
          return
        }
        import('@/vendor/Export2Excel').then(excel => {
          log(excel,'excel')

          const titleArr = []
          const titleArrCode = []
          this.tableHeader.forEach(item => {
            titleArr.push(item.name)
            titleArrCode.push(item.code)
          })
          this.limit = 10000
          // this.handlerSearch().then(() => {
            const tHeader = titleArr
            const filterVal = titleArrCode;
            const data = this.tableData.map(v => filterVal.map(j => v[j]));
            log(data)
            let excelName = ''
            // const currentNj = _.find(this.optionsNj,{gradeId: this.selectedNj})
            // log(this.currentNj,'nj')
            // excelName += currentNj.gradeName
            const currentKsmc = _.find(this.optionsKsmc,{examId: this.selectedKsmc})
            excelName += currentKsmc.examName
            // const currentKc = _.find(this.optionsKc,{courseId: this.selectedKc})
            // excelName += currentKc.courseName
            excelName += '成绩统计'
            excel.export_json_to_excel(tHeader, data, excelName)
            this.limit = 10
            this.handlerSearch()
          // })
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
