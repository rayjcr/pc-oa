<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
        <el-select v-model="searchsel" slot="prepend" placeholder="请选择" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
          <el-option label="用户名" value="name"></el-option>
        </el-select>
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="back">返回</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="操作人">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作功能">
        <template slot-scope="scope">
          <span>{{scope.row.result}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

  </div>
</template>
<script>
  import { selectNameByXxdm } from 'api/admin/user/index';
  import { getGateLog, getSearchGateLog } from '../../api/main';
  export default {
    name: 'specialType',
    data() {
      return {
        xxdm: '',
        listLoading: true,                      // 加载
        listQuery: {
          page: 1,
          limit: 10,
          xxdm: '',
          name: undefined
        },
        searchsel: 'name',                           // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

        tableKey: 0,                            // 表格
        list: null,
        total: null,

        dialogFormVisible: false,               // 弹层是否显示
        dialogStatus: '',
        textMap: {                              // 判断弹层是添加还是编辑
          update: '编辑',
          create: '创建'
        },
        tabPosition: 'left',
        form: {},                                // 表单

        changeSure: false,                       // 防止重复提交
        userList: {}
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.initialize();
    },
    watch: {

    },
    methods: {
      async initialize() {
        await selectNameByXxdm(this.listQuery).then(response => {
          this.userList = response;
        });
        await this.getList()
      },
      getList() {
        this.listLoading = true;
        getGateLog(this.listQuery).then(response => {
          this.list = response.data.rows
          if (this.list != null && this.list.length > 0) {
            for (const o of this.list) {
              o.name = this.nameByUsername(this.userList, o.crtName);
            }
          }
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      // username 转换 name
      nameByUsername(list, value) {
        const res = _.find(list, ['username', value]);
        if (res) {
          return res.name;
        } else {
          return value;
        }
      },
      // 返回
      back() {
        this.$router.go(-1);
      },
      // 搜索
      handleFilter() {
        this.listLoading = true;
        getSearchGateLog(this.listQuery).then(response => {
          this.list = response.data.rows
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      searchChange() {
        this.listQuery = {
          page: 1,
          limit: 10
        }
        this.listQuery.xxdm = this.xxdm;
      },
      // 分页
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      }
    }
  }
</script>
<style scoped>
  .filter-container .filter-item{ vertical-align: inherit;}
  .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
  .el-checkbox+.el-checkbox{margin-left: 0;}
  .el-checkbox{ margin-right: 30px;}

  .line{ text-align: center;}
</style>
