<template>
  <div class="app-container calendar-list-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-form :inline="true"  class="demo-form-inline">
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
        <el-select v-model="selectedNj" placeholder="请选择年级" style="margin:0 2% 2% 0" @change="selectedNjGetKc">
          <el-option
            v-for="item in optionsNj"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId">
          </el-option>
        </el-select>
          </el-form-item>
          <el-form-item label="课程：">
        <el-select v-model="selectedKc" placeholder="请选择课程" style="margin:0 2% 2% 0" >
          <el-option
            v-for="item in optionsKc"
            :key="item.courseId"
            :label="item.courseName"
            :value="item.courseId">
          </el-option>
        </el-select>
          </el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" @click="handlerSearch">搜 索</el-button> -->
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
        :data="tableData"
        size="medium"
        style="width: 100%;margin:10px 0" >
        <el-table-column
          :prop="headerItem.code"
          :label="headerItem.name"
          v-for="headerItem in tableHeader" :key="headerItem.code">
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
            <el-form-item label="" prop="type" style="border-bottom:1px solid #ddd;">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="量化贡献值" name="type"></el-checkbox>
                <el-checkbox label="年级平均值" name="type"></el-checkbox>
                <el-checkbox label="班级平均分" name="type"></el-checkbox>
                <el-checkbox label="年级平均分" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="设置百分比(例如：年级排名的前/后50%，各个班级所占人数)" prop="type">
              <el-checkbox-group v-model="form.beforeChecked" style="border-bottom:1px solid #ddd;padding-bottom:10px">
                <el-checkbox  name="type" :label="itm" v-for="(itm,inx) in form.before" :key="itm" @change="handlerCheckboxChange(itm,'before')">前<el-input v-model.number="form.beforeVal[itm]" placeholder="" style="width:60px" maxlength="3"></el-input>%人数<el-button type="text" style="margin-left:10px;color:#F56C6C;" @click="delRange(inx,itm,'before')">删除</el-button></el-checkbox>
                <el-button type="text" style="margin-left:20px;" @click="addRange('before')">增加</el-button>
              </el-checkbox-group>
              <el-checkbox-group v-model="form.afterChecked" style="border-bottom:1px solid #ddd;margin-top:10px;padding-bottom:10px;">
                <el-checkbox  name="type" :label="itm" v-for="(itm,inx) in form.after" :key="itm" @change="handlerCheckboxChange(itm,'after')">后<el-input v-model.number="form.afterVal[itm]" placeholder="" style="width:60px" maxlength="3"></el-input>%人数<el-button type="text" style="margin-left:10px;color:#F56C6C;" @click="delRange(inx,itm,'after')">删除</el-button></el-checkbox>
                <el-button type="text" style="margin-left:20px;" @click="addRange('after')">增加</el-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="设置名次段(例如：年级1-50名班级所占人数)" :label-width="formLabelWidth" :rules="{type:'number',message:'请填入数值类型'}">
              <template v-for="(itm,inx) in form.mcdList" >
                <el-input v-model.number="form.mcdListVal[itm]"
                        autocomplete="off"
                        class="fl"
                        style="width:80px;" 
                        maxlength="5"></el-input>
                        <el-button type="text"
                                    class="fl"
                                    style="margin-left:10px;margin-right:20px;color:#F56C6C;"
                                    @click="removeMCDContentItem(inx,itm)">
              删除</el-button>
              </template>

              <el-button type="text" style="margin-left:20px;float:left" @click="addMCDContentItem">增加</el-button>
            </el-form-item>
            <el-form-item label="操作说明：" :rules="{type:'number',message:'请填入数值类型'}">
              <!-- <div>1.量化贡献值=前<input type="text" ref="contributionNode" class="lhgxz" v-model.number="form.contributionInputValue1" @change="contributionInputValueChange(form.contributionInputValue1,0)" maxlength="3">%人数*3 +（前<input type="text" ref="contributionNode" class="lhgxz" v-model.number="form.contributionInputValue2" @change="contributionInputValueChange(form.contributionInputValue2,1)" maxlength="3">%人数-前<input type="text" ref="contributionNode" class="lhgxz" v-model.number="form.contributionInputValue3" @change="contributionInputValueChange(form.contributionInputValue3,2)" maxlength="3">%人数）*2 +（前<input type="text" ref="contributionNode" class="lhgxz" v-model.number="form.contributionInputValue4" @change="contributionInputValueChange(form.contributionInputValue4,3)" maxlength="3">%人数-前<input type="text" ref="contributionNode" class="lhgxz" v-model.number="form.contributionInputValue5" @change="contributionInputValueChange(form.contributionInputValue5,4)" maxlength="3">%人数）*1</div> -->
              <div>1.量化贡献值=前<el-input v-model.number="form.contributionInputValue1" :ref="contributionNode" class="lhgxz" maxlength="3" @change="contributionInputValueChange(form.contributionInputValue1,0)"></el-input>%人数*3 +（前<el-input v-model.number="form.contributionInputValue2" :ref="contributionNode" class="lhgxz" maxlength="3" @change="contributionInputValueChange(form.contributionInputValue2,1)"></el-input>%人数-前<el-input v-model.number="form.contributionInputValue3" :ref="contributionNode" class="lhgxz" maxlength="3" @change="contributionInputValueChange(form.contributionInputValue3,2)"></el-input>%人数）*2 +（前<el-input v-model.number="form.contributionInputValue4" :ref="contributionNode" class="lhgxz" maxlength="3" @change="contributionInputValueChange(form.contributionInputValue4,3)"></el-input>%人数-前<el-input v-model.number="form.contributionInputValue5" :ref="contributionNode" class="lhgxz" maxlength="3" @change="contributionInputValueChange(form.contributionInputValue5,4)"></el-input>%人数）*1</div>
              <div>2.年级平均值=各班量化贡献值取平均数（需勾选量化贡献值）</div>
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
  import { getRankingCountList } from '@/api/ksgl/mcdtj/index'
  import { validatNumberDecimals1 } from '@/utils/validate'
  export default {
    name: 'cjtj',
    data() {
      const beforeRanges = [0]
      const afterRanges = [0]
      const validatemcdListVal = function (value) {
        log(value)
      }
      return {
        optionsXn: [],
        optionsXq: [],
        optionsKsmc: [],
        optionsNj: [],
        optionsKc: [],

        selectedXn: '',
        selectedXq: '',
        selectedKsmc: '',
        selectedNj: '',
        selectedKc: '',

        tableData: [],
        tableHeader: [],       // 表头
        currentPage: 1,
        limit: 10,

        dialogFormVisible: false,
        checkAll: false,
        isIndeterminate: false,
        form: {
          mcdList: [0],   // 名次段列表
          mcdListVal: {0:''}, // 名次段列表数据
          type: [],        // 统计类型
          before: beforeRanges,  // 前xx%人数 循环用
          beforeChecked: [],     //           选择的值
          beforeVal: {0:''},      //          input 的值
          after: afterRanges,     // 后xx%人数
          afterChecked: [],
          afterVal: {0:''},
          contributionInputValue1: "", //量化贡献值规则输入框
          contributionInputValue2: "",
          contributionInputValue3: "",
          contributionInputValue4: "",
          contributionInputValue5: "",
        },
        formLabelWidth: '120px',
        beforeList: [],         // 前xx%人数 提交用
        afterList: [],          // 后xx%人数 提交用
        averageList: [],        // 统计类型列表
        segmentList: [30],      // 前xx名
        isSaveTjsz: false,
        contributionInputValueBoolean: false,
        contributionNode: 'refNodes',


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
            log(this.optionsKsmc,'kcmc')
            }
          )
        })
        // // 获取课程
        // this.optionsKc = JSON.parse(window.sessionStorage.getItem('kc_list'))
        // let all = {kcmc: '全部',uuid: 'all'}
        // this.optionsKc.unshift(all)
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
        if(!this.selectedNj) {
           this.$notify({
            title: '提示',
            message: '请选择年级！',
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
       * 获取表格数据 搜索
       */
      handlerSearch() {
        this.tableData = []
        if(!this.isSaveTjsz){
          this.$notify({ title: '警告', message: '请先设置统计名次段！', type: 'warning'});
          return
        }
        const tempArr = []
        tempArr.push(this.form.contributionInputValue1)
        tempArr.push(this.form.contributionInputValue2)
        tempArr.push(this.form.contributionInputValue3)
        tempArr.push(this.form.contributionInputValue4)
        tempArr.push(this.form.contributionInputValue5)
        let param = {
          pageNum: this.currentPage,
          limit: this.limit,
          examId: this.selectedKsmc,
          gradeId: this.selectedNj,
          courseId: this.selectedKc || 'all',
          beforeList: this.beforeList,
          afterList: this.afterList,
          averageList: this.averageList,
          segmentList: this.segmentList,
          quantitativeValue: this.averageList[0] === 1 ? tempArr:undefined
        }
        this.loading = true
        getRankingCountList(param).then(res => {
          log(res,'tabledata')
          if(res.resultCode === 1) {
            const tableHeader = []
            const data = res.value
            this.tableData = res.value
          }
        })
      },
      /**
       * 获取考试名称
       * @param {sting} type 执行对象 xq  xn
       */
      async getKsmc(type) {
        this.selectedKsmc = ''
        this.selectedNj = ''
        this.selectedKc = ''
        let params = {
          schoolYear: this.selectedXn,
          schoolTerm: this.selectedXq
        }
        await apiMain.getExamList(params).then(res => {
          if(res.resultCode == 1){
            log(res,'ksmc1')
            this.optionsKsmc = res.value
            this.optionsKsmc = this.optionsKsmc.filter(item => {
              return item.status == 1
            })
            this.selectedNjGetKc()
          }
        })
      },
      /**
       * 选择考试名称，获取年级信息
       */
      selectedKsmcGetNj() {
        log(this.selectedKsmc,'ksmc')
        this.selectedNj = ''
        this.selectedKc = ''
        // 获取年级列表
        apiMain.getGradeByExamId({examId:this.selectedKsmc}).then(res => {
          if(res.resultCode === 1) {
            log(res,'nj')
            this.optionsNj = res.value
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
            if(!this.selectedKc) {
              this.selectedKc = this.optionsKc[0].courseId
            }
            // 获取表格数据
            // this.handlerSearch()
          }
        })
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
            message: '设置失败，前、后百分比人数不能为空！',
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
              message: '设置失败，前、后百分比人数不能小于0，或大于100！',
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
        let isMcdListValNull = true  // 名次段是否为空
        let vaildMct = false  // 名次段验证
        let mcdList = []
        for(let key in this.form.mcdListVal) {
          if(this.form.mcdListVal[key]) {
            isMcdListValNull = false
            if(!isNaN(this.form.mcdListVal[key])){
              vaildMct = true
              mcdList.push(this.form.mcdListVal[key])
            }else {
              vaildMct = false
            }
          }else {
            vaildMct = true
          }
        }
        if(!vaildMct) {
          this.$notify({ title: '保存失败', message: '名次段验证未通过，请输入数值类型', type: 'error'});
          return
        }
        if(this.form.type.length === 0 && this.form.beforeChecked.length === 0 &&this.form.afterChecked.length === 0 && isMcdListValNull){ // 没有填写
          this.$notify({ title: '保存失败', message: '请至少填写一项！', type: 'error'});
          return
        }
        if(this.form.beforeChecked.length > 0 || this.form.afterChecked.length >0){
          let beforeAfterValResult = this.beforeAfterValValid()
          if(!beforeAfterValResult){
            return
          }
        } 

        log(this.$refs[this.contributionNode].length,'ref')
        this.contributionInputValueBoolean = true
        if(this.form.type.indexOf('量化贡献值') != -1) {
          let inputDomList = document.getElementsByClassName('lhgxz')
          if(inputDomList && inputDomList.length > 0) {
            for(let i=0;i<inputDomList.length;i++) {
              if(inputDomList[i].style.border == '1px solid rgb(245, 108, 108)'){
                this.contributionInputValueBoolean = false
              }
            }
          }
        }
        if(!this.contributionInputValueBoolean) {  // 量化值规则是否通过验证
          this.$notify({ title: '保存失败', message: '请填写正确的量化值！', type: 'error'});
          return
        }

        // 获取type选择的结果
        let arr = [0,0,0,0]
        let averageList = ["量化贡献值", "年级平均值", "班级平均分", "年级平均分"]
        this.form.type.forEach(item => {
          arr[averageList.indexOf(item)] = 1
        })
        this.averageList = arr
        // 获取前xx%人数
        let beforeList = []
        for(let bKey in this.form.beforeVal){
          this.form.beforeChecked.forEach(item => {
            if(item == bKey) {
              beforeList.push(this.form.beforeVal[bKey])
            }
          })
        }
        this.beforeList = beforeList
        // 获取后xx%人数
        let afterList = []
        for(let aKey in this.form.afterVal){
          this.form.afterChecked.forEach(item => {
            if(item == aKey) {
              afterList.push(this.form.afterVal[aKey])
            }
          })
        }
        this.afterList = afterList
        // 获取名次段
        mcdList.sort(sortRule) // 排序
        function sortRule(a,b){
          if(a-b > 0){
            return 1
          } else if(a-b < 0){
            return -1
          }else{
            return 0
          }
        }
        this.segmentList = mcdList

        if(this.form.type.includes('量化贡献值')){
          if(!this.form.contributionInputValue1 || !this.form.contributionInputValue2 || !this.form.contributionInputValue3 || !this.form.contributionInputValue4 || !this.form.contributionInputValue5) {
            this.$notify({ title: '警告', message: '请填写量化贡献值规则！', type: 'warning'});
            return
          }
          if(!validatNumberDecimals1(this.form.contributionInputValue1) || !validatNumberDecimals1(this.form.contributionInputValue2) || !validatNumberDecimals1(this.form.contributionInputValue3) || !validatNumberDecimals1(this.form.contributionInputValue4) || !validatNumberDecimals1(this.form.contributionInputValue5)){
            this.$notify({ title: '警告', message: '请填写正确格式的数据！', type: 'warning'});
            return
          }

        }

        log(this.averageList,this.beforeList,this.afterList,this.segmentList,'params')
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
        const tableHeader = []
        this.form.type.forEach(item => {
          const tempObj = {}
          if(item == '量化贡献值'){
            tempObj.code = 'contributionValue'
            tempObj.name = item
            tableHeader.push(tempObj)
          }else if(item == '年级平均值'){
            tempObj.code = 'gradeAverageValue'
            tempObj.name = item
            tableHeader.push(tempObj)
          }else if(item == '班级平均分'){
            tempObj.code = 'classAverageScore'
            tempObj.name = item
            tableHeader.push(tempObj)
          }else if(item == '年级平均分'){
            tempObj.code = 'gradeAverageScore'
            tempObj.name = item
            tableHeader.push(tempObj)
          }
        })
        // 前xx%人数
        this.beforeList.forEach(item => {
          const tempObj = {}
          tempObj.code = 'before'+item+'%'
          tempObj.name = '前'+item+'%人数'
          tableHeader.push(tempObj)
        })
        // 后xx%人数
        this.afterList.forEach(item => {
          const tempObj = {}
          tempObj.code = 'after'+item+'%'
          tempObj.name = '后'+item+'%人数'
          tableHeader.push(tempObj)
        })
        // 名次段
        this.segmentList.forEach( (item,index,arr) => {
          let tempObj = {}
          if(index === 0) {
            tempObj.code = 'before'+item
            tempObj.name = '1-'+item+'名'
            tableHeader.push(tempObj)
            // debugger
          }else{
            tempObj.code = 'before'+item
            tempObj.name = arr[index-1]+ '-' +item+'名'
            tableHeader.push(tempObj)
          }
          if(arr.length-1 === index){
            tempObj = {}
            tempObj.code = 'after'+item
            tempObj.name = item+'名以后'
            tableHeader.push(tempObj)
          }
        })
        log(tableHeader,'heder')
        tableHeader.unshift({code:'className',name:'班级'})
        this.tableHeader = tableHeader
      },
      /**
       * 量化贡献值输入框验证
       */
      contributionInputValueChange(value,index){
        log(document.getElementsByClassName('lhgxz'))
        if(isNaN(value)){
          document.getElementsByClassName('lhgxz')[index].style.border = '1px solid rgb(245, 108, 108)'
          log(this.$refs['contributionNode'])
          this.$notify({ title: '警告', message: '非法的字符！', type: 'warning'});
          this.contributionInputValueBoolean = false
          return
        }else {
          if(value.toString().split('.').length > 1) {
            this.$notify({ title: '警告', message: '输入的值不能有小数点', type: 'warning'});
            document.getElementsByClassName('lhgxz')[index].style.border = '1px solid rgb(245, 108, 108)'
            this.contributionInputValueBoolean = false
            return 
          }
          if(parseInt(value) > 100) {
            document.getElementsByClassName('lhgxz')[index].style.border = '1px solid rgb(245, 108, 108)'
            this.$notify({ title: '警告', message: '输入的值不能大于100！', type: 'warning'});
            this.contributionInputValueBoolean = false
            return
          }
          document.getElementsByClassName('lhgxz')[index].style.border = 'none'
        }
        log(value,'量化值')
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
       * 全选
       */
      handlerCheckAll(val){
        if(val) {
          this.form.type = ["量化贡献值", "年级平均值", "班级平均分", "年级平均分"]
          this.form.beforeChecked = this.form.before
          this.form.afterChecked = this.form.after
        }else {
          this.form.type = []
          this.form.beforeChecked = []
          this.form.afterChecked = []
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
          } else {
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
          } else {
            this.$notify({
              title: '新增失败',
              message: '新增最多4项',
              type: 'warning'
            });
          }
        }
      },
      /**
       * 添加名次段
       */
      addMCDContentItem(){
        if(this.form.mcdList.length < 6) {
          this.$set(this.form.mcdListVal,this.form.mcdList[this.form.mcdList.length-1]+1,'')
          this.form.mcdList.push(this.form.mcdList[this.form.mcdList.length-1]+1)
          log(this.form.mcdList,this.form.mcdListVal,'mcdlist')
        } else {
          this.$notify({
              title: '新增失败',
              message: '名次段最多6项',
              type: 'warning'
            });
        }
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
          log(this.tableHeader,'excel')

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
            let excelName = ''
            const currentKsmc = _.find(this.optionsKsmc,{examId: this.selectedKsmc})
            excelName += currentKsmc.examName
            excelName += '名次段统计'
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
.mcd{
  display: inline-block;
}
.lhgxz{
  width: 60px;
  // // -webkit-appearance: none;
  // // background-color: #FFF;
  // // background-image: none;
  border-radius: 4px;
  // // border: 1px solid #DCDFE6;
  // // -webkit-box-sizing: border-box;
  // // box-sizing: border-box;
  // // color: #606266;
  // display: inline-block;
  // font-size: inherit;
  // height: 40px;
  // line-height: 40px;
  // outline: 0;
  // padding: 0 15px;
  // -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  // transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
</style>
