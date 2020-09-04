<template>
  <div class="app-container calendar-list-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="openDialog">新增等级</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="m_GenTableBox">
        <el-table
          :header-cell-style="tableHeaderColor"
          :data="editableTabs"
          border
          style="width: 100%">
          <el-table-column
            prop="levelGroupName"
            label="等级组名称"
            width="250">
          </el-table-column>
          <el-table-column
            label="等级项">
            <template slot-scope="props">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item
                  :key="tag.id"
                  v-for="tag in props.row.scoreLevelList"
                  :disable-transitions="false">{{tag.levelName}}</el-breadcrumb-item>
              </el-breadcrumb>
              <!--<el-tag
                :key="tag.id"
                v-for="tag in props.row.scoreLevelList"
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag.levelName}}
              </el-tag>-->
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit-outline"
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row.levelGroupId,scope.row.inUsed)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          width="28%"
          :title="levelDialogName"
          :visible.sync="createVisible"
          append-to-body>
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
            <el-form-item
              prop="levelGroupName"
              label="等级组名称"
              :rules="[
              { required: true, message: '请输入等级组名称', trigger: 'blur' },
              {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change'},
              {validator: validaLevelGroupName, trigger: 'change'}]">
              <el-input style="width: 72%" v-model="dynamicValidateForm.levelGroupName" maxlength="10"></el-input>
              &nbsp; &nbsp;
              <el-tooltip class="item" effect="dark" content="新增" placement="top">
                <el-button type="primary"
                          size="mini"
                          icon="el-icon-plus" circle
                          @click="addDomain(dynamicValidateForm)"></el-button>
              </el-tooltip>
            </el-form-item>
            <el-card shadow="never">
            <el-form-item
              v-for="(domain, index) in dynamicValidateForm.scoreLevelList"
              :label="'等级项' + (index+1)"
              :key="domain.id"
              :prop="'scoreLevelList.' + index + '.levelName'"
              :rules="[
              {required: true, message: '等级分项不能为空', trigger: 'blur'},
              {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change'},
              {validator: validaLevelName, trigger: 'change'}
              ]">
              <el-input style="width: 72%" v-model="domain.levelName" maxlength="10"></el-input>
              &nbsp; &nbsp;
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button v-if="dynamicValidateForm.scoreLevelList.length>2"
                         type="danger"
                         size="mini"
                         icon="el-icon-delete" circle
                         @click.prevent="removeDomain(domain)"></el-button>
              </el-tooltip>
            </el-form-item>
            </el-card>
          </el-form>
          <span slot="footer" class="dialog-footer">
             <!-- <el-button @click="addDomain(dynamicValidateForm)">新增等级项</el-button>-->
              <el-button @click="createVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm('dynamicValidateForm')">确定</el-button>
         </span>
        </el-dialog>
  </div>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/ksgl/djsz/index';

  export default {
    name: 'djsz',
    data() {
      return {
        schoolCode: window.localStorage.getItem('xxdm'),
        levelDialogName: '',
        dynamicValidateForm: '',
        // 弹框
        createVisible: false,
        editableTabs: [{
          levelGroupName: '',
          levelGroupId: '1',
          name: '1',
          scoreLevelList: [{
            levelName: ''
          }]
        }],
        flag: ''
      }
    },
    mounted() {
      this.getInit()
    },
    methods: {
      /**
       * 获取等级设置信息
       */
      getInit() {
        api.getScoreLevelList().then(res => {
          if (res.resultCode === 1) {
            this.editableTabs = res.value
          }
        })
      },
      resetTemp() {
        this.dynamicValidateForm = {
          id: undefined,
          levelGroupId: undefined,
          levelGroupName: '',
          examId: 'public',
          scoreLevelList: [{
            examId: 'public',
            id: undefined,
            levelGroupId: '',
            levelGroupName: '',
            levelName: '',
            xxdm: this.schoolCode
          }, {
            examId: 'public',
            id: undefined,
            levelGroupId: '',
            levelGroupName: '',
            levelName: '',
            xxdm: this.schoolCode
          }]
        }
      },
      openDialog() {
        this.flag = false
        this.levelDialogName = '等级设置添加'
        this.createVisible = true
        this.resetTemp()
        this.$nextTick(() => {
          this.$refs.dynamicValidateForm.clearValidate();
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.dynamicValidateForm.scoreLevelList.map(e => {
              e.id = this.dynamicValidateForm.id
              e.levelGroupId = this.dynamicValidateForm.levelGroupId
              e.levelGroupName = this.dynamicValidateForm.levelGroupName
              return e
            })
            api.saveOrUpdateScoreLevel(this.dynamicValidateForm.scoreLevelList).then(res => {
              this.createVisible = false
              if (res.resultCode === 1) {
                this.$notify({
                  title: '成功',
                  message: '保存成功！',
                  type: 'success',
                  duration: 2000
                });
                this.getInit()
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      removeDomain(item) {
        const index = this.dynamicValidateForm.scoreLevelList.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.scoreLevelList.splice(index, 1)
        }
      },
      addDomain(item) {
        const data = this.dynamicValidateForm.scoreLevelList;
        if (data && data.length < 5) {
          data.push({
            examId: 'public',
            id: undefined,
            levelGroupId: item.levelGroupId,
            levelGroupName: item.levelGroupName,
            levelName: '',
            xxdm: this.schoolCode
          });
        } else {
          this.$notify({ title: '温馨提示', message: '亲，最多只能填加5项', type: 'warning', duration: 2000 });
        }
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      handleEdit(i, item) {
        if(item.inUsed) {
          this.$alert('<strong>等级类型被使用，不能编辑！</strong>', '温馨提示', {
              type: 'warning',
              dangerouslyUseHTMLString: true
            });
          return
        }
        this.flag = true
        this.levelDialogName = '等级设置修改'
        // this.$forceUpdate();
        this.dynamicValidateForm = Object.assign({}, {
          levelGroupId: item.levelGroupId,
          levelGroupName: item.levelGroupName,
          scoreLevelList: item.scoreLevelList.map(e => ({
            examId: e.examId,
            id: e.id,
            levelGroupId: e.levelGroupId,
            levelGroupName: e.levelGroupName,
            levelName: e.levelName,
            xxdm: e.xxdm
          }))
        })
        this.$nextTick(() => {
          this.$refs.dynamicValidateForm.clearValidate();
        })
        this.createVisible = true
      },
      handleDelete(id,used) {
        if(used) {
          this.$alert('<strong>等级类型被使用，不能删除！</strong>', '温馨提示', {
            type: 'warning',
            dangerouslyUseHTMLString: true
          });
          return
        }
        this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteLevelGroup(id).then(res => {
            if (res.resultCode === 1) {
              this.$notify({
                title: '成功',
                message: '操作成功！',
                type: 'success',
                duration: 2000
              });
              this.getInit()
            }
          })
        }).catch(() => {
          console.log('error submit!!');
        });
      },
      validaLevelGroupName(rule, value, callback) {
        if (value.trim().length > 0) {
          const list = this.editableTabs.filter(e => e.levelGroupName === value)
          if (!this.flag && list && list.length > 0) {
            callback(new Error('名称不能重复！'));
          } else if (this.flag && list && list.length > 1) {
            callback(new Error('名称不能重复！'));
          } else {
            callback();
          }
        } else {
          callback(new Error('名称不能为空！'));
        }
      },
      validaLevelName(rule, value, callback) {
        if (value.trim().length > 0) {
          const list = this.dynamicValidateForm.scoreLevelList.filter(e => e.levelName === value)
          if (!this.flag && list && list.length > 1) {
            callback(new Error('名称不能重复！'));
          } else if (this.flag && list && list.length > 1) {
            callback(new Error('名称不能重复！'));
          } else {
            callback();
          }
        } else {
          callback(new Error('名称不能为空！'));
        }
      },
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        return 'background: #fafafa;color: rgba(0, 0, 0, 0.85);border-bottom: 1px solid #e8e8e8;font-weight: 500;'
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
