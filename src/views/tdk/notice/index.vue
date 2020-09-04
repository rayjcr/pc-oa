<template>
  <section>
    <div style="padding: 20px">
      <div class="filter-container">
        <el-input placeholder="请输入类型或名称" v-model="noticeTemplate.queryField"   style="width: 400px;" >
        </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="序号" type="index"  width="60"></el-table-column>
          <el-table-column prop="name" label="通知单名称" width="400" align="center"></el-table-column>
          <el-table-column prop="type" label="通知单类型" width="250" align="center"></el-table-column>
          <el-table-column prop="status" label="启用状态" width="250" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0" style="color:#85ce61">{{(scope.row.status == 0) ? "启用":"未启用"}}</span>
              <span v-else style="color:#f56c6c">{{(scope.row.status == 0) ? "启用":"未启用"}}</span>
            </template>
          </el-table-column>
        <el-table-column prop="username" label="创建人" width="200" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
        <el-table-column align="center" label="操作" >
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="handleRowClick(scope.row)">预览</el-button>
            <el-button v-if="scope.row.status == 1 && scope.row.creater != 'admin' " size="small" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-else size="small" type="info" disabled >编辑</el-button>
            <el-button v-if="scope.row.status == 1" size="small" type="warning" @click="handleEnable(scope.row,0)">启用</el-button>
            <el-button v-else size="small" type="danger" @click="handleEnable(scope.row,1)" >禁用</el-button>
            <el-button v-if="scope.row.status == 1 && scope.row.creater != 'admin' " size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            <el-button v-else size="small" type="info" disabled >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" style="margin-top: 2px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="noticeTemplate.page" :page-sizes="[5,10,15,20]"
                       :page-size="noticeTemplate.rows"
                       layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-col>
      <!--新增界面-->
      <el-dialog  :title="textMap[dialogStatus]" :visible.sync="dialogForm" width="680px" height="500px" @close="colseDialog" center>
        <el-form label-width="110px" :model="template" ref="template" >
          <el-form-item label="通知单名称" v-if="dialogStatus !='view'">
            <el-input  :maxlength="20" v-model.trim="template.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <div v-if="dialogStatus !='view'" class="notcie ql-editor" >
            <quill-editor  v-model="template.content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)" ></quill-editor>
          </div>
          <div v-else style="width: 100%">
            <span v-html="templateHtml" ></span>
          </div>
          <el-button v-if="dialogStatus != 'view'" style="float:right; margin-top: 10px;margin-right: 16px" size="small" type="success" @click="handleSave">保存</el-button>
          <div style="margin-top: 50px">
            <span v-if="dialogStatus != 'view'">
              <button style="margin-top: 10px" @click="modifyTemplate('【调课原因】')">调课原因 </button>
              <button style="margin-top: 10px" @click="modifyTemplate('【上课班级】')">上课班级 </button>
              <button style="margin-top: 10px" @click="modifyTemplate('【打印时间（年月日）】')">打印时间（年月日） </button>
              <br/>
              <button style="margin-top: 10px" @click="modifyTemplate('【A教师】')">A教师 </button>
              <button style="margin-top: 10px" @click="modifyTemplate('【A教师上课日期】')">A教师上课日期 </button>
              <button style="margin-top: 10px" @click="modifyTemplate('【A教师上课星期】')">A教师上课星期 </button>
              <button style="margin-top: 10px" @click="modifyTemplate('【A教师上课节次】')">A教师上课节次 </button>
              <button style="margin-top: 10px" @click="modifyTemplate('【A教师的课程】')">A教师的课程 </button>
              <br/>
              <button style="margin-top: 10px" @click="modifyTemplate('【B教师】')">B教师 </button>
              <button style="margin-top: 10px" @click="modifyTemplate('【B教师上课日期】')">B教师上课日期 </button>
              <button style="margin-top: 10px" @click="modifyTemplate('【B教师上课星期】')">B教师上课星期 </button>
              <button style="margin-top: 10px" @click="modifyTemplate('【B教师上课节次】')">B教师上课节次 </button>
              <button style="margin-top: 10px" @click="modifyTemplate('【B教师的课程】')">B教师的课程 </button>
            </span>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </section>
</template>
<script>
  import * as api from '@/api/tdk/notice/index';
  export default {
    data() {
      return {
        dialogStatus: '',
        templateHtml: '',
        template: {},
        textMap: {
          update: '编辑通知单模板',
          create: '新增通知单模板',
          view: '通知单模板预览'
        },
        content: '', // 模板内容
        editorOption: {
          modules: {
            toolbar: [
               ['bold', 'italic', 'underline', 'strike'],
               [{ header: 1 }, { header: 2 }]
            ]
          }
        }, // 富文本选项栏
        dialogForm: false, // 弹窗状态
        total: 0, // 数据总数
        noticeTemplate: {
          schoolCode: window.localStorage.getItem('xxdm'), // 学校代码
          username: window.localStorage.getItem('username'),
          type: '调代课', // 模块类型
          page: 1, // 当前页码
          rows: 10, // 每页行数
          queryField: '' // 查询字段
        }, // 分页参数
        tableData: [] // 返回数据结果集
      }
    },
    created() {
      // 获取消息模板数据
      this.getNoticeTemplateList();
      this.getInitContent();
    },
    methods: {
      // 创建通知单模板
      handleCreate() {
        this.dialogStatus = 'create';
        this.dialogForm = true;
        this.template = {};
        this.template.content = this.content;
        this.template.type = '调代课'
      },
      // 删除通知单模板
      handleDelete(row) {
        api.delNoticeTemplate(row.id).then(() => {
          this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
          this.getNoticeTemplateList();
        });
      },
      // 修改通知单模板
      handleUpdate(row) {
        this.dialogStatus = 'update';
        this.dialogForm = true;
        this.template = JSON.parse(JSON.stringify(row));
      },
      // 详情预览
      handleRowClick(row) {
        this.dialogStatus = 'view';
        this.dialogForm = true;
        this.templateHtml = JSON.parse(JSON.stringify(row.content)).replace(new RegExp(' ', 'gm'), '&nbsp;');
        this.templateHtml = JSON.parse(JSON.stringify(this.templateHtml)).replace(new RegExp('\t', 'gm'), '&nbsp;&nbsp;&nbsp;&nbsp;');
      },
      // 获取通知单模板list
      getNoticeTemplateList() {
        api.getList(this.noticeTemplate).then(res => {
          if (res.status === 200) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          }
        })
      },
      // 获取通知单初始化模板
      getInitContent() {
        api.getInitTemplate({ type: this.noticeTemplate.type }).then(res => {
          this.content = res.data.content;
        });
      },
      onEditorChange(){
        console.log('12312');
      }, // 内容改变事件
      // 状态变更
      handleEnable(row, status) {
        if (status === 0) {
          api.modifyNoticeStatus({ id: row.id }).then(() => {
            this.$notify({ title: '成功', message: '启用成功', type: 'success', duration: 2000 });
            this.getNoticeTemplateList();
          });
        } else {
          // 更改通知单状态
          row.status = status;
          api.disableTemplateStatus(row, row.id).then(() => {
            this.$notify({ title: '成功', message: '禁用成功', type: 'success', duration: 2000 });
            this.getNoticeTemplateList();
          });
        }
      },
      // 修改模板内容
      modifyTemplate(templateStr) {
        // 向光标处追加内容
        document.execCommand('insertText', true, templateStr);
      },
      // 关闭弹窗
      colseDialog() {
        this.dialogForm = false;
      },
      // 搜索
      handleFilter() {
        this.getNoticeTemplateList();
      },
      // 页码跳转
      handleCurrentChange(page) {
        // 更新当前页码
        this.noticeTemplate.page = page;
        // 查询模板数据
        this.getNoticeTemplateList();
      },
      // 数据行数调整
      handleSizeChange(rows) {
        // 更新每页行数
        this.noticeTemplate.rows = rows;
        // 查询模板数据
        this.getNoticeTemplateList();
      },
      // 保存模板
      handleSave() {
        if (!this.template.name) {
          this.$notify({ title: '警告', message: '名称不能为空', type: 'warning', duration: 2000 });
        } else {
          if (this.dialogStatus === 'update') {
            api.checkTmeplateName({ name: this.template.name, type: this.template.type, id: this.template.id }).then(checkStatus => {
              if (checkStatus.data) {
                api.disableTemplateStatus(this.template, this.template.id).then(res => {
                  if (res.status === 200) {
                    this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
                    this.getNoticeTemplateList();
                    this.colseDialog()
                  } else {
                    this.$notify({ title: '失败', message: '修改失败', type: 'error', duration: 2000 });
                  }
                });
              } else {
                this.$notify({ title: '温馨提示', message: '名称已存在', type: 'warning', duration: 2000 });
              }
            });
          } else if (this.dialogStatus === 'create') {
            api.checkTmeplateName({ name: this.template.name, type: this.template.type }).then(checkStatus => {
              if (checkStatus.data) {
                api.addNoticeTemplate(this.template).then(res => {
                  if (res.status === 200) {
                    this.$notify({ title: '成功', message: '添加成功', type: 'success', duration: 2000 });
                    this.getNoticeTemplateList();
                    this.colseDialog();
                  } else {
                    this.$notify({ title: '失败', message: '添加失败', type: 'error', duration: 2000 });
                  }
                });
              } else {
                this.$notify({ title: '温馨提示', message: '名称已存在', type: 'warning', duration: 2000 });
              }
            });
          }
        }
      }
    }
  }
</script>
<style  >
  .notcie .quill-editor {
    height: 300px;
  }

  .notcie .ql-container {
    height: 250px;
  }

  .notcie .ql-snow .ql-editor img {
    max-width: 480px;
  }

  .notcie .ql-editor .ql-video {
    max-width: 900px;
  }
  .notcie .ql-editor{
    padding: 12px 0px !IMPORTANT;
  }


</style>
