<template>
  <div class="app-container content-container">
    <div class="u_TableMain noTransform">
      <div v-if="!isPldr">
        <div class="filter-container">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="考试名称：">
              <el-select v-model="selectedKsmc" placeholder="请选择考试名称" @change="handlerSelected" filterable>
                <el-option v-for="item in optionsKsmc" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" class="pldr" icon="el-icon-edit" @click="pldr" v-if="drqx">
              批量导入
            </el-button>
          </el-form>
        </div>
        <div class="m_GenTableBox">
          <el-table :data="tableData" size="medium" style="width: 100%">
            <el-table-column prop="ksName" label="考试名称">
            </el-table-column>
            <el-table-column prop="class" label="班级">
            </el-table-column>
            <el-table-column prop="subject" label="科目">
            </el-table-column>
            <el-table-column prop="isEnter" label="录入状态">
              <template slot-scope="entering">
                {{entering.row.isEnter == 2 ? '录入完成' : (entering.row.isEnter == 0?'未录入' :'录入中')}}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="handler">
                <el-button type="primary" icon="el-icon-edit" size="mini" v-if="handler.row.isEnter !=2" @click="openCjlr(handler.row.examSubjectId,handler.row.ksName,handler.row.class,handler.row.subject,handler.row.isEnter)">
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
      <pldr v-else :selectData="optionsKsmc" ></pldr>
    </div>
    <!-- 批量导入 -->

  </div>
</template>

<script>
  import * as api from '@/api/ksgl/kswh/index'
  import {
    formatDate
  } from '@/utils'
  import {
    getPermissionExamSubject
  } from '@/api/ksgl/cjgl/index'
  import pldr from './pldr/pldr.vue'
  export default {
    components: {
      pldr
    },
    data() {
      return {
        optionsKsmc: [], // 下拉框数据
        selectedKsmc: '', // 下拉选中值
        tableList: [{
            strName: '考试名称',
            name: 'ksName'
          },
          {
            strName: '创建人',
            name: 'creator'
          },
          {
            strName: '班级',
            name: 'class'
          },
          {
            strName: '科目',
            name: 'subject'
          },
          {
            strName: '是否录入',
            name: 'isEnter'
          },
          {
            strName: '操作',
            name: 'handler'
          },
        ],
        tableData: [], // 表格数据
        currentPage: 1, // 页码
        isPldr: false, //是否批量导入
        originData: [] ,//请求元数据
        selectData:[],//默认选中的考试数据
        drqx:false,//是否有批量导入权限
      }
    },
    mounted() {
      this.getInit()
      this.doesUserHasRight()
    },
    methods: {
		// 判断是否有批量导入权限
		doesUserHasRight(){
			api.doesUserHasRight().then(res => {
        this.drqx = res.value
      })
		},
      /**
       * 获取录入权限信息
       */
      getInit() {
        getPermissionExamSubject().then(res => {
          log(res, 'qxxx')
          if (res.resultCode == 1) {
            this.originData = res.value
            if (res.value && res.value.length > 0) {
              res.value.forEach(item => {
                let option = {}
                option.value = item.examId
                option.label = item.examName
                option.updateTime = item.updateTime
                this.optionsKsmc.push(option) // 封装下拉数组
                if (item.examName == this.selectedKsmc) { // 下拉选中时的表格数据
                  if (item.scoreEntryVoList && item.scoreEntryVoList.length > 0) {
                    item.scoreEntryVoList.forEach(itm => {
                      let tempObj = {}
                      tempObj.ksName = item.examName
                      tempObj.examSubjectId = itm.examSubjectId
                      tempObj.creator = itm.createUser
                      tempObj.class = itm.className
                      tempObj.subject = itm.examSubjectName
                      tempObj.isEnter = itm.status
                      this.tableData.push(tempObj)
                    })
                  }
                } else { //   所有表格数据
                  if (item.scoreEntryVoList && item.scoreEntryVoList.length > 0) {
                    item.scoreEntryVoList.forEach(itm => {
                      let tempObj = {}
                      tempObj.ksName = item.examName
                      tempObj.examSubjectId = itm.examSubjectId
                      tempObj.creator = itm.createUser
                      tempObj.class = itm.className
                      tempObj.subject = itm.examSubjectName
                      tempObj.isEnter = itm.status
                      this.tableData.push(tempObj)
                    })
                  }
                }
              })
              // 最新时间排序
              this.optionsKsmc.sort(function(o1, o2) {
                log(o1, o2, 'sort')
                return new Date(o2.updateTime) - new Date(o1.updateTime);
              })
              // 默认选中第一个
              this.handlerSelected(this.optionsKsmc[0].value)
              this.selectedKsmc = this.optionsKsmc[0].label
              log(this.optionsKsmc)
              log(this.tableData, 'tabledata')
            }
          } else {
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
      handlerSelected(value) {
        log(value)
        this.tableData = []
        this.originData.forEach(item => {
          if (item.examId == value) { // 下拉选中时的表格数据
            if (item.scoreEntryVoList && item.scoreEntryVoList.length > 0) {
              item.scoreEntryVoList.forEach(itm => {
                let tempObj = {}
                tempObj.ksName = item.examName
                tempObj.creator = itm.createUser
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
      openCjlr(val, examname, classname, examSubjectname, isEnter) {
        log(examname, classname, examSubjectname)
        this.$router.push({
          path: '/cjgl/cjlr',
          query: {
            examSubjectId: val,
            examname,
            classname,
            examSubjectname,
            isEnter
          }
        })
      },
      pldr() {
        this.selectData = this.optionsKsmc.filter(item => item.label == this.selectedKsmc)
        // 批量导入
        this.isPldr = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .select-group {
    margin-bottom: 10px;
    // text-align: center;
  }

  .pldr {
    float: right;
  }
</style>
