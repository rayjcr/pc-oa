<template>
  <section class="content-container app-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <search-app
          ref="searchApp"
          search-placeholder=""
          :search-input-select="true"
          :search-types="searchTypes"
          :condition-items="conditionItems"
          @searchClick="goSerch"
        ></search-app>
      </div>

      <div class="m_GenTableBox">
        <!--@sort-change="changeSort"-->
        <el-table
          :key='tableKey'
          :data="list"
          v-loading.body="listLoading"
          border fit highlight-current-row
          style="width: 100%"
          row-key="key"
        >
          <el-table-column align="center" label="课程名称" sortable :sort-by="'kcmc'">
            <template slot-scope="scope">
              <span>{{scope.row.kcmc}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="开课人" sortable :sort-by="'skr'">
            <template slot-scope="scope">
              <span>{{scope.row.skr}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="课程内容" sortable :sort-by="'pynrnum'">
            <template slot-scope="scope">
              <span>{{scope.row.pynrnum}}</span>
            </template>
          </el-table-column>
          <!--:sortable="'custom'"-->
          <el-table-column align="center" label="课程目标" sortable :sort-by="'pymbnum'">
            <template slot-scope="scope">
              <span>{{scope.row.pymbnum}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button style="margin:0 10px;" size="small" type="success" @click="handleInput(scope.row,'look')">查看</el-button>
              <el-button style="margin:0 10px;" size="small" type="danger" @click="handleInput(scope.row,'input')">录入</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-show="!listLoading">
          <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.page"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          > </el-pagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import searchApp from '@/views/components/searchbar'

  import {getxqList, getxnList} from "api/components/searchbar"

  import { pynrList } from 'api/xkxt/pjManager/index'

  import { dqxnxqObj } from 'api/xkxt/specialRaw/index'

  export default {
    name: "gcpywh",
    components: {
      searchApp
    },
    data() {
      return {
        searchTypes: [
          {
            label: "全部",
            value: "all"
          },
          {
            label: "课程名称",
            value: "kcmc"
          },
          {
            label: "开课人",
            value: "skr"
          }
        ],
        conditionItems: [
          {
            key: 'xnList',
            type: 'Checkbox',
            label: "所在学年",
            selected: {},
            values: []
          },
          {
            key: 'xqList',
            type: 'Checkbox',
            label: "所在学期",
            selected: {},
            values: []
          }
        ],
        xxdm: '',
        tableKey: 0,
        total: 0,
        list: [],
        listLoading: true,
        listQuery: {
          query: {
            page: 1,
            limit: 10
          },
          cxlx: 'all', // 查询类型 all，全部 kcmc，课程名称 skr，开课人
          xnGroup: [],
          xqGroup: [],
          xxdm: '',
          cxmc: '' // 查询名称
        }
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem("xxdm");
    },
    mounted() {
      this.getxnList();
      this.getxqList();
      this.getdqxnxqObj();
    },
    methods: {
      getdqxnxqObj() {
        dqxnxqObj({xxdm: this.xxdm}).then(response => {
          this.conditionItems[0].selected.value= response.data.xn;
          this.conditionItems[0].selected.text= response.data.xn;
          this.conditionItems[1].selected.value=response.data.xq;
          this.conditionItems[1].selected.text=response.data.xqmc;
          this.$refs.searchApp.setChecked();
          this.listQuery.xnGroup=[response.data.xn];
          this.listQuery.xqGroup=[response.data.xq];
          this.getList();
        })
      },
      getList() {
        this.listLoading = true;
        this.listQuery['xxdm'] = this.xxdm

        pynrList(this.listQuery).then(response => {
          this.list = response.data.rows;

          // 添加唯一标识，优化table渲染
          this.list.forEach((c,i) => {
            c['key'] = i+1
          });
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      /*
      * 列排序
      * */
      changeSort(val) {
        console.log(val)
      },
      /*
      * 检索条件
      * */
      goSerch(data) {
        this.listQuery.cxmc = data.curValue;
        this.listQuery.cxlx = data.type || 'all';
        this.listQuery.xnGroup=data.temp[0];
        this.listQuery.xqGroup=data.temp[1];
        this.getList();
      },
      /*
      * 查询学年列表
      * */
      getxnList() {
        getxnList({xxdm: this.xxdm}).then(response => {
          let model, a, data = response;
          for (a of data) {
            model = {};
            model.value = a.xn;
            model.text = a.xn;
            this.conditionItems[0].values.push(model);
          }
        });
      },
      /*
      * 查询学期列表
      * */
      getxqList() {
        getxqList({xxdm: this.xxdm}).then(response => {
          let model, a, data = response;
          for (a of data) {
            model = {};
            model.value = a.xq;
            model.text = a.xqmc;
            this.conditionItems[1].values.push(model);
          }
        });
      },
      /*
      * 查看和录入
      * @params info 点击的当前列
      * @params type 'look'，查看 'input'，录入
      * */
      handleInput(info,type) {
        let path = type == 'look' ? 'gcpywh_detail' : 'gcpywh_input';
        this.$router.push({
          path,
          query: {
            kcdm: info.kcdm,
            xndm: info.xndm,
            xqdm: info.xqdm
          }
        })
      },
      /*
      * 每页条数
      * */
      handleSizeChange(limit) {
        this.listQuery.query.limit = limit;
      },
      /*
      * 页码
      * */
      handleCurrentChange(page) {
        this.listQuery.query.page = page;
        this.getList();
      }
    }
  }
</script>

<style scoped>

</style>
