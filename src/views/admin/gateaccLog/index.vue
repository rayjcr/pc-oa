<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-select v-model="listQuery.xxdm" slot="prepend" placeholder="请选择学校" clearable @change="handleFilter" class="filter-item">
        <el-option v-for="item in dict.schools" :key="item.xxdm" :label="item.xxmc" :value="item.xxdm"></el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="操作人姓名" v-model="listQuery.crtUsername"> </el-input>
        <el-date-picker
          v-model="crtTimeBegin"
          type="datetime"
          class="filter-item"
          placeholder="选择开始时间">
        </el-date-picker>
        <el-date-picker
          v-model="crtTimeEnd"
          type="datetime"
          class="filter-item"
          placeholder="选择结束时间">
        </el-date-picker>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
</template>
</el-table-column> -->
      <el-table-column width="200px" align="center" label="学校名称"><template slot-scope="scope">
  <span>
    {{scope.row.schoolName}}</span>
      </template>

      </el-table-column>
      <el-table-column width="100px" align="center" label="学校代码"><template slot-scope="scope">
  <span>
    {{scope.row.xxdm}}</span>
      </template>

      </el-table-column>
<el-table-column width="250px" align="center" label="功能模块"><template slot-scope="scope">
  <span>
    {{scope.row.menuName}}</span>
</template>

</el-table-column>
<el-table-column width="200px" align="center" label="操作"><template slot-scope="scope">
  <span>
    {{scope.row.resourceName}}</span>
</template>

</el-table-column>
<el-table-column width="300px" align="center" label="访问路径"><template slot-scope="scope">
  <span>
    {{scope.row.path}}</span>
</template>

</el-table-column>
<el-table-column width="180px" align="center" label="操作时间"><template slot-scope="scope">
  <span>
    {{scope.row.crtTime}}</span>
</template>

</el-table-column>
<el-table-column width="150px" align="center" label="操作人"><template slot-scope="scope">
  <span>
    {{scope.row.crtUsername}}</span>
</template>

</el-table-column>
<el-table-column width="150px" align="center" label="操作ip"><template slot-scope="scope">
  <span>
    {{scope.row.ip}}</span>
</template>
</el-table-column>
<el-table-column align="center" label="参数">
  <template slot-scope="scope">
    <el-button size="small" type="success" @click="handleUpdate(scope.row)">查看</el-button>
  </template>
</el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>

    <el-dialog title="参数" :visible.sync="dialogFormVisible" width="1000px">
      <el-form :model="setform" ref="setform">
      <el-form-item label="接收参数：" >
        <el-input class="inputchange" v-model="setform.args" readonly ></el-input>
      </el-form-item>
        <el-form-item label="返回结果：" >
          <el-input class="inputchange" v-model="setform.result" readonly ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    </div>

</template>

<script>
import {
  page
} from 'api/admin/gateaccLog/index';
import { formatDate } from '@/utils';
import { getUseSchool } from 'api/admin/school/index';
export default {
  name: 'gateaccLog',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      crtTimeBegin:null,
      crtTimeEnd:null,
      listQuery: {
        page: 1,
        limit: 20,
        crtUsername: undefined,
        xxdm:undefined,
        crtTimeBegin:'',
        crtTimeEnd:'',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      gateLogManager_btn_edit: '1',
      gateLogManager_btn_del: '1',
      gateLogManager_btn_add: '1',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      dict: {},
      dialogFormVisible: false,
      setform: {
        args: '',        // 接收参数
        result: ''         //返回结果
      },
    }
  },
  created() {
    var  d1 = new Date();
    d1.setMonth(d1.getMonth()-3);//前三个月
    this.listQuery.crtTimeBegin = formatDate(d1,'yyyy-MM-dd hh:mm:ss');
    var  d2 = new Date();
    d2.setDate(d2.getDate()+1);//后一天
    this.listQuery.crtTimeEnd = formatDate(d2,'yyyy-MM-dd hh:mm:ss');
    this.crtTimeBegin = d1;
    this.crtTimeEnd = d2;
    this.getList();
    this.getSchoolJson();
  },
  methods: {
    getList() {
      this.listLoading = true;
      if(this.crtTimeBegin !=null && this.crtTimeBegin != ""){
        this.listQuery.crtTimeBegin = formatDate(this.crtTimeBegin,'yyyy-MM-dd hh:mm:ss');
      }
      if(this.crtTimeEnd !=null && this.crtTimeEnd != ""){
        this.listQuery.crtTimeEnd = formatDate(this.crtTimeEnd,'yyyy-MM-dd hh:mm:ss');
      }
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleUpdate(row) {
      this.dialogFormVisible = true;
      this.setform.args = row.args;
      this.setform.result = row.result;
    },
    getSchoolJson() {
      getUseSchool().then(data => {
        this.dict.schools = data.data.rows;
      });
    }
  }
}
</script>
