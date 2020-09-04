<template>
  <div class="app-container content-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="考试名称：">
        <el-select v-model="selectedKsmc" placeholder="请选择考试名称" @change="handlerSelected" filterable>
          <el-option
            v-for="item in optionsKsmc"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="m_GenTableBox">
      <el-table
        :data="tableData"
        size="medium"
        style="width: 100%" >
        <el-table-column
          prop="ksName"
          label="考试名称">
        </el-table-column>
        <!-- <el-table-column
          prop="creator"
          label="创建人">
        </el-table-column> -->
        <el-table-column
          prop="class"
          label="班级">
        </el-table-column>
        <el-table-column
          prop="subject"
          label="科目">
        </el-table-column>
        <el-table-column
          prop="isEnter"
          label="是否录完">
          <template slot-scope="entering">
            {{entering.row.isEnter == 2 ? '录入完成' : (entering.row.isEnter == 0?'未录入' :'录入中')}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="handler">
            <el-button type="primary" icon="el-icon-edit" size="mini" v-if="handler.row.isEnter != 2" @click="openCjlr(handler.row.examSubjectId,handler.row.ksName,handler.row.class,handler.row.subject)">
              成绩录入
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <!-- <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div> -->
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/ksgl/kswh/index'
  import { formatDate } from '@/utils'
  import { getPermissionExamSubject,getPermissionConfirmExamSubject } from '@/api/ksgl/cjgl/index'
  export default {
    data() {
      return {

        optionsKsmc: [],        // 下拉框数据
        selectedKsmc: '',       // 下拉选中值
        tableList: [
          {strName:'考试名称', name:'ksName'},
          {strName:'创建人', name:'creator'},
          {strName:'班级', name:'class'},
          {strName:'科目', name:'subject'},
          {strName:'是否录入', name:'isEnter'},
          {strName:'操作', name:'handler'},
        ],
        tableData: [],          // 表格数据
        currentPage: 1,          // 页码

        originData: []          //请求元数据
      }
    },
    mounted() {
      this.getInit()
    },
    methods: {
      /**
       * 获取录入权限信息
       */
      getInit() {
        getPermissionConfirmExamSubject().then(res => {
          log(res,'qxxx')
          if(res.resultCode == 1) {
            this.originData = res.value
            if(res.value && res.value.length > 0) {
              res.value.forEach(item => {
                let option = {}
                option.value = item.examId
                option.label = item.examName
                option.updateTime = item.updateTime
                this.optionsKsmc.push(option)
                if(item.examName == this.selectedKsmc) {        // 下拉选中时的表格数据
                  if(item.scoreEntryVoList && item.scoreEntryVoList.length > 0) {
                    item.scoreEntryVoList.forEach(itm => {
                      let tempObj = {}
                      tempObj.ksName = item.examName
                      tempObj.examSubjectId = itm.examSubjectId
                      tempObj.class = itm.className
                      tempObj.subject = itm.examSubjectName
                      tempObj.isEnter = itm.status
                      this.tableData.push(tempObj)
                    })
                  }
                }else {                                       //   所有表格数据
                  if(item.scoreEntryVoList && item.scoreEntryVoList.length > 0) {
                    item.scoreEntryVoList.forEach(itm => {
                      let tempObj = {}
                      tempObj.ksName = item.examName
                      tempObj.examSubjectId = itm.examSubjectId
                      tempObj.class = itm.className
                      tempObj.subject = itm.examSubjectName
                      tempObj.isEnter = itm.status
                      this.tableData.push(tempObj)
                    })
                  }
                }
              })
              // 最新时间排序
              this.optionsKsmc.sort(function(o1,o2) {
                log(o1,o2,'sort')
                return new Date(o2.updateTime) - new Date(o1.updateTime);
              })
              // 默认选中第一个
              this.handlerSelected(this.optionsKsmc[0].value)
              this.selectedKsmc = this.optionsKsmc[0].label
            }
          }else {
            this.$notify({
              title: '提示',
              message: res.resultMessage,
              type: 'info'
            });
          }
        })
      },
      /**
       * 下拉框事件
       */
      handlerSelected(value){
        this.tableData = []
        this.originData.forEach(item => {
          if(item.examId == value) {        // 下拉选中时的表格数据
            if(item.scoreEntryVoList && item.scoreEntryVoList.length > 0) {
              item.scoreEntryVoList.forEach(itm => {
                let tempObj = {}
                tempObj.ksName = item.examName
                tempObj.examSubjectId = itm.examSubjectId
                tempObj.class = itm.className
                tempObj.subject = itm.examSubjectName
                tempObj.isEnter = itm.status
                this.tableData.push(tempObj)
              })
            }
          }
        })
      },
      handleSizeChange(val) {
      /** 跳转到某页**/
      },
      handleCurrentChange(val) {
      /** 跳转到某页**/
      },
      /**
       * 打开成绩录入
       */
      openCjlr(val,examname,classname,examSubjectname) {
        this.$router.push({path:'/cjfs/fslr',query:{examSubjectId:val,examname,classname,examSubjectname}})
      }
    }
  }
</script>

<style lang="scss" scoped>

.select-group{
  margin-bottom: 10px;
  // text-align: center;
}
</style>
