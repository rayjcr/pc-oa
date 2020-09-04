<!--排课系统首页-->
<template>
  <section>
    <div class="app-container" style="padding: 20px">
      <div class="u_TableMain columns ofhide">
        <div class="filter-container innerTab">
          <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="searchFrom.keyWord" maxlength="10" placeholder="输入关键词" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">添加</el-button>
              <el-button type="primary" icon="el-icon-refresh" class="handle-del mr10" @click="handleUpdateBase">
                更新设备数据
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-form :inline="true" class="demo-form-inline">

        </el-form>
        <!--列表-->
        <div class="m_GenTableBox">
          <el-table
            v-loading="loading"
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              align="center"
              type="index"
              width="50">
              <template slot-scope="scope">
                <span>{{(searchFrom.pageNum - 1) * searchFrom.limit + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="operateEquipmentCode"
              label="点餐设备编码"
            >
              <template slot-scope="scope">
                {{scope.row.operateEquipmentCode}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="operateEquipmentName"
              label="点餐设备名称"
            >
              <template slot-scope="scope">
                {{scope.row.operateEquipmentName}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="showEquipmentCode"
              label="配餐设备编码"
            >
              <template slot-scope="scope">
                {{scope.row.showEquipmentCode }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="showEquipmentName"
              label="配餐设备名称"
            >
              <template slot-scope="scope">
                {{scope.row.showEquipmentName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="showEquipmentName"
              label="状态"
              width="300"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.operateStatus === 1 ? 'success' : 'danger'">{{optionsA[scope.row.operateStatus]}}
                </el-tag>
                <el-tag
                  :type="scope.row.showStatus === 1 ? 'success' : 'danger'">{{optionsB[scope.row.showStatus]}}
                </el-tag>
                <el-tag
                  :type="scope.row.status === 1 ? 'success' : 'danger'">{{optionsC[scope.row.status]}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row.id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--工具条-->
          <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="searchFrom.pageNum" :page-sizes="[5,10,15,20,25]"
                         :page-size="searchFrom.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

        </div>

      </div>


      <!--新增界面-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogForm" width="450px" @close="colseDialog">
        <el-form :model="temp" :rules="rules" ref="dataForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="点餐设备编号" prop="operateEquipmentCode">
            <el-input v-model="temp.operateEquipmentCode"></el-input>
          </el-form-item>
          <el-form-item label="点餐设备名称" prop="operateEquipmentName">
            <el-input v-model.trim="temp.operateEquipmentName"></el-input>
          </el-form-item>
          <el-form-item label="配餐设备编号" prop="showEquipmentCode">
            <el-input v-model="temp.showEquipmentCode"></el-input>
          </el-form-item>
          <el-form-item label="配餐设备名称" prop="showEquipmentName">
            <el-input v-model.trim="temp.showEquipmentName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseDialog">取消</el-button>
          <!--保存-->
          <el-button type="primary" @click="saveData">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
  import * as api from '@/api/order/foodEquipment/index'

  export default {
    data() {
      /** 验证名称不能重复**/
      const validaName = (rule, value, callback) => {
        if (value !== '') {
          if (!api.checkSpecificKey(value)) {
            callback(new Error('不能包含特殊字符,且只能输入字母和数字'));
          } else {
            if (this.dialogStatus === 'update' && value === this.tempName) {
              callback();
            } else {
              api.checkEquipmentCode({equipmentCode: value}).then(res => {
                if (res.value) {
                  callback(new Error('设备编码不能重复'));
                } else {
                  callback();
                }
              })
            }
          }
        }
      };
      return {
        optionsA: ['点餐离线', '点餐在线'],
        optionsB: ['配餐离线', '配餐在线'],
        optionsC: ['关联失败', '关联成功'],
        loading: true,
        dialogForm: false, // 定义新增弹框默认关闭
        searchFrom: {
          /** 保存的form表单数据**/
          keyWord: '',
          pageNum: 1,
          limit: 10
        },
        dialogStatus: '',
        temp: {
          /** 保存的form表单数据**/
          id: undefined,
          operateEquipmentCode: '',
          operateEquipmentName: '',
          showEquipmentCode: '',
          showEquipmentName: ''
        },
        textMap: {
          update: '编辑设备',
          create: '新建设备'
        },
        tableData: [],
        total: 0,
        rules: {
          /** 表单验证规则**/
          operateEquipmentCode: [
            {required: true, message: '请输入设备编码', trigger: 'change'},
            {min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'change'},
            {validator: validaName, trigger: 'blur'}],
          operateEquipmentName: [
            {required: true, message: '请输入设备名称', trigger: 'change'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change'}],
          showEquipmentCode: [
            {required: true, message: '请输入设备编码', trigger: 'change'},
            {min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'change'},
            {validator: validaName, trigger: 'blur'}],
          showEquipmentName: [
            {required: true, message: '请输入设备名称', trigger: 'change'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change'}]
        },
        tempName: ''
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.getList();
    },
    methods: {
      search() {
        this.searchFrom.pageNum = 1;
        this.getList();
      },
      getList() {
        api.getEquipmentList(this.searchFrom).then(res => {
          if (res.value) {
            this.loading = false;
            this.total = res.value.totalCount;
            this.tableData = res.value.dataList;
          }
        });
      },
      resetTemp() {
        this.temp = {
          /** 保存的form表单数据**/
          id: undefined,
          operateEquipmentCode: '',
          operateEquipmentName: '',
          showEquipmentCode: '',
          showEquipmentName: ''
        }
      },
      handleAdd() {
        /** 打开新增弹框**/
        this.dialogStatus = 'create'
        this.resetTemp();
        this.dialogForm = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      handleUpdateBase() {
        this.$confirm('确认要同步数据吗？', '提示', {type: 'warning'}).then(() => {
          api.updateBase().then(result => {
            if (result.resultCode === 1) {
              this.$notify({title: '成功', message: '操作成功', type: 'success', duration: 2000});
            } else {
              this.$notify({title: '失败', message: result.resultMessage, type: 'warning', duration: 2000});
            }
          });
        });
      },
      handleDelete(id) {
        /** 删除**/
        this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', {type: 'warning'}).then(() => {
          api.getDelete(id).then(result => {
            if (result.resultCode === 1) {
              this.$notify({title: '成功', message: '删除成功', type: 'success', duration: 2000});
            } else {
              this.$notify({title: '失败', message: result.resultMessage, type: 'warning', duration: 2000});
            }

            this.getList();
          });
        });
      },
      saveData() {
        /** 提交数据**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            if (this.temp.operateEquipmentCode === this.temp.showEquipmentCode || this.temp.operateEquipmentName === this.temp.showEquipmentName) {
              this.$message({title: '提示', message: '设备编号和名称不能重复', type: 'warning', duration: 2000});
              return
            }
            const tempData = Object.assign({}, this.temp);
            api.saveEquipment(tempData).then(() => {
              this.dialogForm = false;
              this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000})
              this.getList();
            })
          }
        })
      },
      colseDialog() {
        this.dialogForm = false;
      },
      handleSizeChange(val) {
        /** 跳转到某页**/
        this.searchFrom.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        /** 跳转到某页**/
        this.searchFrom.pageNum = val;
        this.getList();
      }

    }
  }

</script>
<!--此处代码请不要加scoped否则没有样式-->
<style scoped>

</style>


