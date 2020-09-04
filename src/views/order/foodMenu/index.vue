<!--排课系统首页-->
<template>
  <section>
    <div class="app-container" style="padding: 20px">
      <div class="u_TableMain columns ofhide">
        <div class="filter-container innerTab">
          <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
            <el-form-item label="菜品分类">
              <el-select v-model="searchFrom.typeId" placeholder="请选择" clearable>
                <el-option
                  v-for="(item,index) in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchFrom.name" placeholder="输入名称关键词" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" maxlength="10" icon="el-icon-search" @click="search">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="m_GenTableBox">
          <!--列表-->
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
                <span>{{(searchFrom.page - 1) * searchFrom.limit + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="imgeUrl"
              label="图片"
              width="150">
              <template slot-scope="scope">
                <el-image v-if="scope.row.imgeUrl" style="width: 150px; height: 80px"
                          :src="scope.row.imgeUrl"></el-image>
                <el-image style="width: 150px; height: 80px" v-else>
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="name"
              label="菜品名称"
              width="300">
            </el-table-column>
            <el-table-column
              align="center"
              prop="typeName"
              label="菜品分类">
            </el-table-column>
            <el-table-column
              align="center"
              prop="createTime"
              label="创建日期"
              width="200">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                {{scope.row.createTime}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="menuIngredientsList"
              label="配料">
              <template slot-scope="scope">
                <el-link type="primary" @click="handDetailsInfo(scope.row.menuIngredientsList)">查看详情</el-link>
                <!-- <el-tag v-if="scope.row.menuIngredientsList"
                        :key="tag.id"
                        v-for="tag in scope.row.menuIngredientsList"
                        type="info">{{tag.name}}:{{tag.weight}}kg</el-tag>-->
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row.id)">删除
                </el-button>
                <!--<el-button size="mini" type="primary" @click="handleState(scope.row)">{{scope.row.status === 0 ? '禁用' :
                '启用'}}
                </el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="searchFrom.page" :page-sizes="[5,10,15,20,25]"
                         :page-size="searchFrom.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>

      <!--新增界面-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogForm" width="590px" @close="colseDialog">
        <el-form :model="temp" :rules="rules" ref="dataForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="名 称" prop="name">
            <el-input style="width: 75%;" v-model.trim="temp.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="分 类" prop="typeId">
            <el-select v-model="temp.typeId" style="width: 75%;" placeholder="请选择菜品类型" clearable>
              <el-option v-for="(item,index) in  typeList" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in temp.menuIngredientsList"
            :label="'配料' + (index+1)"
            :key="domain.key">
            <el-col :span="10">
              <el-form-item :prop="'menuIngredientsList.' + index + '.ingredientsId'"
                            :rules="{required: true, message: '配料名称不能为空', trigger: 'blur'}">
                <el-select @change="handleIngredients(index,$event)" v-model="domain.ingredientsId" filterable
                           placeholder="请选择配料" clearable>
                  <el-option
                    v-for="item in foodIngredientsList"
                    :key="item.id"
                    :label="item.name"
                    :disabled="item.disabled"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="7">
              <el-form-item :prop="'menuIngredientsList.' + index + '.weight'"
                            :rules="[{required: true, message: '配料数量不能为空', trigger: 'blur'},{validator: validaNumber, trigger: 'change'}]">
                <!-- <el-input v-model="domain.num"><i slot="suffix" class="el-input__icon">kg&nbsp;</i></el-input>-->
                <el-input placeholder="请输入" v-model="domain.weight">
                  <template slot="append">kg</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="3">
              <el-tooltip content="添加配料" placement="top" effect="light" v-if="index==0">
                <el-button type="info" icon="el-icon-plus" @click="addDomain" circle></el-button>
              </el-tooltip>
              <el-tooltip content="删除配料" placement="top" effect="light" v-else>
                <el-button type="info" @click.prevent="removeDomain(domain)" icon="el-icon-delete"
                           circle></el-button>
              </el-tooltip>
            </el-col>
          </el-form-item>
          <el-form-item label="图 片">
            <el-upload
              class="avatar-uploader"
              action="/api/order/foodDaily/uploadFile"
              accept=".jpg,.png"
              :headers="headers"
              :show-file-list="false"
              :onSuccess="handleImageSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="schimageUrl" :src="schimageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseDialog">取消</el-button>
          <!--修改-->
          <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSaveData">确认</el-button>
          <!--保存-->
          <el-button v-else type="primary" @click="saveData">确认</el-button>
        </div>
      </el-dialog>
      <!--配料详情-->
      <el-dialog
        title="配料详情"
        :visible.sync="centerDialogVisible"
        width="30%"
      >
        <el-tag v-if="menuIngredientsData&&menuIngredientsData.length>0"
                :key="tag.id"
                v-for="tag in menuIngredientsData"
                type="success" effect="plain">{{tag.name}}:{{tag.weight}}kg
        </el-tag>
        &nbsp;
      </el-dialog>
    </div>
  </section>
</template>

<script>
  import * as api from '@/api/order/foodMenu/index'
  import Cookies from 'js-cookie'

  export default {
    data() {
      /** 验证名称不能重复**/
      const validaName = (rule, value, callback) => {
        if (!api.checkSpecificKey(value)) {
          callback(new Error('不能包含特殊字符'));
        } else {
          if (this.dialogStatus === 'update' && value === this.tempName) {
            callback();
          } else {
            api.getValidaName({ name: value }).then(res => {
              if (!res.value) {
                callback(new Error('菜品名称不能重复'));
              } else {
                callback();
              }
            })
          }
        }
      };
      return {
        centerDialogVisible: false,
        loading: true,
        dialogForm: false, // 定义新增弹框默认关闭
        typeList: [],
        options: ['启用', '禁用'],
        searchFrom: {
          /** 保存的form表单数据**/
          name: '',
          typeId: '',
          page: 1,
          limit: 5
        },
        dialogStatus: '',
        foodIngredientsList: [], // 配料
        ingredientsList: [],
        temp: {
          /** 保存的form表单数据**/
          id: undefined,
          name: '',
          typeId: '',
          imgeUrl: '',
          menuIngredientsList: [{
            ingredientsId: '',
            weight: ''
          }]
        },
        textMap: {
          update: '修改菜品',
          create: '新增菜品'
        },
        tableData: [],
        total: 0,
        rules: {
          /** 表单验证规则**/
          name: [
            { required: true, message: '请输入名称', trigger: 'change' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' },
            { validator: validaName, trigger: 'change' }],
          typeId: [
            { required: true, message: '请选择分类', trigger: 'change' }]
        },
        schimageUrl: '',                 // 上传图片的地址
        schimagepath: '',
        tempName: '',
        menuIngredientsData: []
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.getList();
      this.getTypeList();
      this.getIngredientsList();
    },
    computed: {
      headers() {
        return { Authorization: Cookies.get('Admin-Token'), ReturnResultCode: true }
      }
    },
    methods: {
      search() {
        this.searchFrom.page = 1;
        this.getList();
      },
      getTypeList() {
        // 查询分类列表
        api.getTypeList().then(rs => {
          this.typeList = rs.data.map(e => e)
          this.options = rs.data;
        })
      },
      getIngredientsList() {
        // 查询配料列表
        api.getIngredientsList().then(rs => {
          this.foodIngredientsList = rs.data
        })
      },
      getList() {
        api.getPageList(this.searchFrom).then(res => {
          this.total = res.data.total;
          this.tableData = res.data.rows;
          this.loading = false;
        });
      },
      resetTemp() {
        this.temp = {
          /** 保存的form表单数据**/
          id: undefined,
          name: '',
          status: '',
          imgeUrl: '',
          menuIngredientsList: [{
            ingredientsId: '',
            weight: ''
          }]
        }
      },
      handleAdd() {
        this.schimageUrl = '';
        /** 打开新增弹框**/
        this.dialogStatus = 'create'
        this.resetTemp();
        this.dialogForm = true;
        this.synchMenuIngredienList();
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      synchMenuIngredienList() {
        this.foodIngredientsList = this.foodIngredientsList.map(v => {
          v.disabled = false
          const arry = _.filter(this.temp.menuIngredientsList, e => v.id === e.ingredientsId)
          if (arry.length > 0) {
            v.disabled = true
          }
          return v
        })
      },
      removeDomain(item) {
        const index = this.temp.menuIngredientsList.indexOf(item)
        if (index !== -1) {
          this.temp.menuIngredientsList.splice(index, 1)
        }
        // 刷新配料信息
        this.synchMenuIngredienList()
      },
      addDomain() {
        this.temp.menuIngredientsList.push({
          ingredientsId: '',
          weight: ''
        });
        // 刷新配料信息
        this.synchMenuIngredienList()
      },
      handleIngredients(index, o) {
        this.synchMenuIngredienList()
      },
      saveData() {
        /** 提交数据**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            api.getAdd(tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
              this.searchFrom.page = 1;
              this.getList();
            })
          }
        })
      },
      handDetailsInfo(v) {
        this.menuIngredientsData = v
        this.centerDialogVisible = true
      },
      handleEdit(row) {
        this.dialogStatus = 'update';
        const tempData = Object.assign({}, row);
        this.schimageUrl = tempData.imgeUrl;
        this.temp.id = tempData.id;
        this.temp.name = tempData.name;
        this.tempName = tempData.name;
        this.temp.typeId = tempData.typeId;
        this.temp.imgeUrl = tempData.imgeUrl;
        if (tempData.menuIngredientsList != null && tempData.menuIngredientsList.length > 0) {
          this.temp.menuIngredientsList = tempData.menuIngredientsList;
        } else {
          this.temp.menuIngredientsList = [{
            ingredientsId: '',
            weight: ''
          }];
        }
        // 刷新菜品配置重新渲染
        this.synchMenuIngredienList();
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
        this.$nextTick(() => {
          this.dialogForm = true;
        })
      },
      updateSaveData() {
        /** 修改**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            api.getUpdate(tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
              this.getList();
            })
          }
        })
      },
      handleDelete(id) {
        /** 删除**/
        this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
          api.getDelete(id).then(result => {
            if (result.status !== 200) {
              this.$notify({ title: '失败', message: result.message, type: 'warning', duration: 2000 });
            } else {
              this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
            }
            this.getList();
          });
        });
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
        this.searchFrom.page = val;
        this.getList();
      },
      handleState(e) {
        const data = { id: e.id };
        let messge = '';
        /** 启用**/
        if (e.status === 0) {
          data.status = 1;
          messge = '确认要禁用吗？';
        } else {
          data.status = 0;
          messge = '确认要启用吗？';
        }
        this.$confirm(messge, '提示', { type: 'warning' }).then(() => {
          const tempData = Object.assign({}, data);
          api.getUpdate(tempData).then(() => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 });
            this.getList();
          });
        });
      },
      // 图片上传成功
      handleImageSuccess(res, file) {
        if (res.resultCode === 1) {
          // this.form.submitImgArr = [];
          this.schimageUrl = URL.createObjectURL(file.raw);
          this.temp.imgeUrl = res.value.basePath + res.value.path;
        } else {
          this.$message.error(res.resultMessage);
        }
      },
      // 上传前对文件的大小的判断
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG 格式或 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return (isJPG || isPNG) && isLt2M;
      },
      /** 验证可点数量为正整数**/
      validaNumber(rule, value, callback) {
        if (!api.checkNumber(value)) {
          callback(new Error('只能输整数或含两位小数！'));
        } else {
          callback();
        }
      }

    }
  }

</script>
<!--此处代码请不要加scoped否则没有样式-->
<style scoped>
</style>


