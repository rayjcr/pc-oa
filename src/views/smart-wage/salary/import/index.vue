<template>
  <section>
    <div style="padding: 20px">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="title"
          label="模板名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="date"
          label="上传时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="创建人">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加模板"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        tableData: [{
          title: '天音中学',
          date: '2016-05-02',
          name: '王小虎'
        }, {
          title: '天音中学',
          date: '2016-05-02',
          name: '王小虎'
        }, {
          title: '天音中学',
          date: '2016-05-02',
          name: '王小虎'
        }, {
          title: '天音中学',
          date: '2016-05-02',
          name: '王小虎'
        }]
      }
    }
  }
</script>
