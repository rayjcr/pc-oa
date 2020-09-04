<template>
  <div class="app-container calendar-list-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
          <el-select v-model="searchsel" slot="prepend" placeholder="请选择" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
            <!--<el-option label="全部" value="all"></el-option>-->
            <el-option label="课程名称" value="kcmc"></el-option>
            <!--<el-option label="课程简称" value="kcbm"></el-option>-->
          </el-select>
        </el-input>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
      </div>
      <div class="m_GenTableBox">
        <el-table class="tableBorder" :key='tableKey' :data="list" v-loading.body="listLoading"
                   fit highlight-current-row style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column prop="kcmc"  align="center" label="课程名称">
            <template slot-scope="scope">
              <span>{{scope.row.kcmc}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="课程简称">
            <template slot-scope="scope">
              <span>{{scope.row.kcbm}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="课程类型">
            <template slot-scope="scope">
              {{scope.row.kclxmc}}
              <!--<span>{{(scope.row.kclxmc=="0")?"选修课":"必修课"}}</span>-->
            </template>
          </el-table-column>
          <el-table-column align="center" label="开课年级">
            <template slot-scope="scope">
              <span>{{scope.row.sknj}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                <!--<el-tooltip class="item" effect="dark" content="上移" placement="top-start">
                <el-button type="success" icon="el-icon-arrow-up" @click="handleUporDow(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="下移" placement="top-start">
                <el-button type="success" icon="el-icon-arrow-down" @click="handleUporDow(scope.row)"></el-button>
                </el-tooltip>-->
              </el-button-group>
            <!--  <el-button size="small" type="success" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
              <el-button size="small" type="primary" icon="el-icon-arrow-up" @click="handleUpdate(scope.row)"></el-button>
              <el-button size="small" type="primary" icon="el-icon-arrow-down" @click="handleDelete(scope.row)"></el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
      </div>
    </div>








    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal='false' :visible.sync="dialogFormVisible" width="400px" >
      <el-form :model="form" ref="form" :rules="rules" label-width="110px">
        <el-form-item label="课程名称"  prop="kcmc">
          <el-input :maxlength="20" v-model="form.kcmc" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="课程简称"  prop="kcbm">
          <el-input :maxlength="20" v-model="form.kcbm" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-select v-model="formsel_kclx"  placeholder="请选择课程类型">
            <el-option v-for="(item,index) in  kclbList" :key="(index+1)" :label="item.lbmc"  :value="item.lbid"></el-option>
          </el-select>
          <!--<el-select v-model="formsel_kclx" placeholder="请选择活动区域">
            <el-option label="必修课" value="1"></el-option>
            <el-option label="选修课" value="0"></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="开课年级" class="minFormItem">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkedGrades" @change="handleCheckedGradeChange">
            <el-checkbox v-for="grade in njArr" :label="grade.njdm" :key="grade.njdm">{{grade.njmc}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input type="textarea" :maxlength="25" v-model="form.bz" placeholder="长度不超过25个"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input style="width: 30%" :maxlength="11" v-model="form.xssx" @input="handleInput"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
  import {
    page,
    getObj,
    addObj,
    putObj,
    delObj,
    getAllKcnjgx,
    getKclbByXxdm
  } from 'api/admin/course/index'
  import { gradepage } from 'api/admin/grade/index'
  import { dqxnxqObj } from 'api/admin/acadyear/index'
  import jcsj from '@/api/jcsj.js';
  export default {
    name: 'course',
    data() {
      const yzkcmc = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('课程名称不能为空'));
        }
        if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
          callback(new Error('请输入课程名称'));
        } else {
          callback();
        }
      };
      return {
        xxdm: '',
        dqxn: '',            // 当前学年
        dqxq: '',            // 当前学期

        listLoading: true,                      // 加载
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        searchsel: 'kcmc',                           // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

        tableKey: 0,                            // 表格
        list: null,
        total: null,
        formsel_kclx: '1',                        // 是否选修课


        dialogFormVisible: false,               // 弹层是否显示
        dialogStatus: '',
        textMap: {                              // 判断弹层是添加还是编辑
          update: '编辑',
          create: '创建'
        },
        tabPosition: 'left',
        form: { },                                // 表单
        changeSure: false,                       // 防止重复提交
        checkAll: false,
        checkedGrades: [],
        njArr: [],
        isIndeterminate: false,
        kclbList: [],
        rules: {
          kcmc: [
            { required: true, validator: yzkcmc, trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      gradepage({ xxdm: this.xxdm }).then(response => {
        this.njArr = response.data.rows;
      })
      dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        this.dqxn = response.data.xn;
        this.dqxq = response.data.xq;
        this.getList();
      })
      getKclbByXxdm({ xxdm: this.xxdm }).then(kclbList => {
        this.kclbList = kclbList;
        this.formsel_kclx = kclbList[0].lbid;
      });
    },
    watch: {

    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.ssxn = this.dqxn;
        this.listQuery.ssxq = this.dqxq;
        page(this.listQuery).then(response => {
          const that = this;
          getAllKcnjgx({ xxdm: this.xxdm }).then(res => {
            // debugger
            response.data.rows.forEach(kcxx => {
              const kclxmc = jcsj.hqkclbBykclx(that.kclbList, kcxx.kclx);
              kcxx.kclxmc = kclxmc;
              let sknj = '';
              for (const kcnjgx of res) {
                if (kcnjgx.kcdm == kcxx.uuid) {
                  const njmc = jcsj.hqnjmcByid(that.njArr, kcnjgx.njdm);
                  sknj += njmc + ' ; ';
                }
              }
              kcxx.sknj = sknj;
            });
            this.list = response.data.rows;
            this.total = response.data.total;
          });
          this.listLoading = false;
        })
      },
      // 搜索
      handleFilter() {
        if (this.searchsel == 'all') {
          this.listQuery = { page: 1, limit: 20, name: undefined }
        }
        this.getList();
      },
      searchChange(val) {
        this.listQuery = {
          page: 1,
          limit: 20,
          xxdm: this.xxdm,
          name: undefined
        }
      },
      // 分页
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCheckAllChange(val) {
        this.checkedGrades = [];
        if (val) {
          for (const o of this.njArr) {
            this.checkedGrades.push(o.njdm);
          }
        } else {
          this.checkedGrades = [];
        }
        this.isIndeterminate = false;
      },
      handleCheckedGradeChange(value) {
        console.log(this.njArr);
        const checkedCount = value.length;
        this.checkAll = checkedCount === this.njArr.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.njArr.length;
      },
      // 添加
      handleCreate() {
        if (this.kclbList.length === 0) {
          this.$notify({ title: '提示', message: '请先设置课程类别', type: 'warning', duration: 2000 });
        } else {
          this.resetTemp();
          this.checkedGrades = [];
          this.checkAll = false;
          this.isIndeterminate = false;
          this.dialogStatus = 'create';
          this.dialogFormVisible = true;
        }
      },
      resetTemp() {
        this.form = {};
        this.formsel_kclx = this.kclbList[0].lbid;
        this.changeSure = false;
      },
      // 编辑
      handleUpdate(row) {
        this.changeSure = false;
        getObj(row.uuid).then(response => {
          // debugger
          this.form = response.data;
          this.formsel_kclx = this.form.kclx;
          this.checkedGrades = response.data.njArr;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },

      // 删除
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.uuid).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          });
        }).catch(e => {
          // console.log(e)
        });
      },
      handleUporDow(e) {
        // debugger
      },
      // 取消按钮
      cancel(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
      // 添加页面
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.form.xxdm = window.localStorage.getItem('xxdm');
            this.form.kch = '';                 // 课程号
            this.form.kclx = this.formsel_kclx;
            this.form.njArr = this.checkedGrades;
            addObj(this.form).then(res => {
              if (res.status == '200') {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 });
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
            })
            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
          } else {
            this.$notify({ title: '失败', message: '还有未填项', type: 'error', duration: 2000 });
            return false;
          }
        });
      },
      // 编辑页面
      update(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.dialogFormVisible = false;
            this.form.kclx = this.formsel_kclx;
            this.form.njArr = this.checkedGrades;
            // debugger
            putObj(this.form.uuid, this.form).then(res => {
              if (res.status == '200') {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 });
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
            });

            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
          } else {
            this.$notify({ title: '失败', message: '还有未填项', type: 'error', duration: 2000 });
            return false;
          }
        });
      },
      handleInput(e) {
        const v = e.replace(/[^\d]/g, '');
        this.$nextTick(() => {
          this.$set(this.form, 'xssx', v);
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .filter-container .filter-item{ vertical-align: inherit;}
  .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
  .el-checkbox+.el-checkbox{margin-left: 0;}
  .el-checkbox{ margin-right: 15px;}
  .line{ text-align: center;}
  .minFormItem{
    /deep/ .el-form-item__label{
      line-height: 30px;
    }
    /deep/ .el-form-item__content{
      line-height: 30px;
    }
    
  }


</style>
