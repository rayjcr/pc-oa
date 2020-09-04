<template>
  <div class="app-container">
    <el-tabs class="u_TableMain noTransform ofhide" type="border-card" v-model="activeName">
      <el-tab-pane label="按课程查询" name="kc">
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
          <el-button style="margin-bottom:15px;" @click="handleExportPjkc" type="info" plain v-loading="exportLoading">导出课程查询</el-button>
          <el-table
            :data="list_kc"
            border
            style="width: 100%"
          >
            <el-table-column label="课程名称" sortable :sort-by="'kcmc'">
              <template slot-scope="scope">{{ scope.row.kcmc }}</template>
            </el-table-column>
            <el-table-column label="开课人" sortable :sort-by="'skr'">
              <template slot-scope="scope">{{ scope.row.skr }}</template>
            </el-table-column>
            <el-table-column label="开课时间" sortable :sort-by="'sksj'">
              <template slot-scope="scope">{{ scope.row.sksj }}</template>
            </el-table-column>
            <el-table-column label="学生人数" sortable :sort-by="'xsrs'">
              <template slot-scope="scope">{{ scope.row.xsrs }}</template>
            </el-table-column>
            <el-table-column label="评价情况统计">
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  type="primary"
                  @click="showDetail(scope.$index)">查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按学生查询" name="stu">
        <div class="filter-container">
          <search-app
            ref="searchStuApp"
            search-placeholder=""
            :search-input-select="true"
            :search-types="searchStuTypes"
            :condition-items="conditionStuItems"
            @searchClick="goSerch"
          ></search-app>
        </div>
        <div class="m_GenTableBox">
          <el-table
              :data="list_stu"
              border
              style="width: 100%"
            >
              <el-table-column label="学号" sortable :sort-by="'xh'">
                <template slot-scope="scope">{{ scope.row.xh }}</template>
              </el-table-column>
              <el-table-column label="姓名" sortable :sort-by="'xm'">
                <template slot-scope="scope">{{ scope.row.xm }}</template>
              </el-table-column>
              <el-table-column label="年级" sortable :sort-by="'nj'">
                <template slot-scope="scope">{{ scope.row.nj }}</template>
              </el-table-column>
              <el-table-column label="班级" sortable :sort-by="'bj'">
                <template slot-scope="scope">{{ scope.row.bj }}</template>
              </el-table-column>
              <el-table-column label="评价情况统计">
                <template slot-scope="scope">
                  <el-button
                    size="medium"
                    type="primary"
                    @click="showDetail(scope.$index)">查看
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.query.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.query.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <el-dialog title="评价情况统计" :visible.sync="dialogVisible" width="500px" @close="cancel">
        <div v-if="activeName == 'kc'">
          <div>
            <span>课程名称: {{detailInfo.kcmc}}</span>
            <span style="margin: 0 20px;">开课人: {{detailInfo.skr}}</span>
            <span>学生人数: {{detailInfo.xsrs}}</span>
          </div>
          <div class="mt20">
            <el-table
              :data="detailInfo.pjList"
              border
              style="width: 100%"
            >
              <el-table-column label="评价内容">
                <template slot-scope="scope">{{ scope.row.pjnr }}</template>
              </el-table-column>
              <el-table-column label="学生获得等级统计">
                <template slot-scope="scope">{{ scope.row.djtj }}</template>
              </el-table-column>
              <el-table-column label="学生获得奖章人数">
                <template slot-scope="scope">{{ scope.row.jzrs }}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-else>
          <div>
            <span>学生姓名: {{detailInfo.xm}}</span>
            <span style="margin: 0 20px;">年级: {{detailInfo.nj}}</span>
            <span>班级: {{detailInfo.bj}}</span>
          </div>
          <div class="mt20">
            <el-table
              :data="detailInfo.pjList"
              border
              style="width: 100%"
            >
              <el-table-column label="课程名称">
                <template slot-scope="scope">{{ scope.row.kcmc }}</template>
              </el-table-column>
              <el-table-column label="开课人">
                <template slot-scope="scope">{{ scope.row.skr }}</template>
              </el-table-column>
              <el-table-column label="过程评价情况">
                <template slot-scope="scope">{{ scope.row.gcpjqk || '无' }}</template>
              </el-table-column>
              <el-table-column label="期末总评等级">
                <template slot-scope="scope">{{ scope.row.qmzpdj || '无' }}</template>
              </el-table-column>
              <el-table-column label="获得奖章总数">
                <template slot-scope="scope">{{ scope.row.hdjzs || '无' }}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import searchApp from '@/views/components/searchbar'

  import {getxqList, getxnList, getNj, getBj } from "api/components/searchbar"

  import {dqxnxqObj} from 'api/xkxt/specialRaw/index'

  import { kccxPjList, xscxPjList, kcpjqktj, xspjqktj, exportKccxPjList  } from 'api/xkxt/pjManager/index'

  export default {
    name: "pjkccx",
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
        searchStuTypes: [
          {
            label: "全部",
            value: "all"
          },
          {
            label: "学号",
            value: "xh"
          },
          {
            label: "姓名",
            value: "xm"
          }
        ],
        conditionItems: [
          {
            key: 'week',
            type: 'Checkbox',
            label: "开课时间",
            selected: '',
            values: [
              {value: '1', text: '周一'},
              {value: '2', text: '周二'},
              {value: '3', text: '周三'},
              {value: '4', text: '周四'},
              {value: '5', text: '周五'},
              {value: '6', text: '周六'},
              {value: '7', text: '周日'},
            ]
          },
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
        conditionStuItems: [
          {
            key: 'njLIst',
            type: 'Checkbox',
            label: '年级',
            values: []
          }, {
            key: 'bjList',
            type: 'Checkbox',
            label: '班级',
            values: []
          }, {
            key: 'xsXnList',
            type: 'Checkbox',
            selected: {},
            label: '所在学年',
            values: []
          }, {
            key: 'xsXqList',
            type: 'Checkbox',
            selected: {},
            label: '所在学期',
            values: []
          }
        ],
        xxdm: '',
        dqxn: '', // 当前学年
        total: 0,
        list_kc: [], // 按课程
        list_stu: [], // 按学生
        listQuery: {
          query: {
            page: 1,
            limit: 10
          },
          cxlx: 'all', // 查询类型 all，全部 kcmc，课程名称 skr，开课人
          xnGroup: [],
          xqGroup: [],
          njGroup: [],
          bjGroup: [],
          xxdm: '',
          week: '', // 开课时间
          cxmc: '' // 查询名称
        },
        activeName: 'kc', // kc 按课程 stu按学生
        dialogVisible: false,
        exportLoading: false,
        detailInfo: {}, // 查看详情信息
        detailTable: [],
        table_kc: [],
        table_stu: []
      }
    },
    watch: {
      activeName(nVal) {
        let curValue,type;

        if(nVal == 'kc') {
          curValue = this.$refs.searchApp.form.curValue || '';
          type = this.$refs.searchApp.form.type || 'all';
        } else {
          curValue = this.$refs.searchStuApp.form.curValue || '';
          type = this.$refs.searchStuApp.form.type || 'all';
        }
        this.listQuery.cxmc = curValue;
        this.listQuery.cxlx = type;
        this.getList()
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
          // 按课程查询
          this.conditionItems[1].selected.value = response.data.xn;
          this.conditionItems[1].selected.text = response.data.xn;
          this.conditionItems[2].selected.value = response.data.xq;
          this.conditionItems[2].selected.text = response.data.xqmc;
          this.$refs.searchApp.setChecked();
          // 按学生查询
          this.conditionStuItems[2].selected.value = response.data.xn;
          this.conditionStuItems[2].selected.text = response.data.xn;
          this.conditionStuItems[3].selected.value = response.data.xq;
          this.conditionStuItems[3].selected.text = response.data.xqmc;
          this.$refs.searchStuApp.setChecked();
          
          this.listQuery.xnGroup = [response.data.xn];
          this.listQuery.xqGroup = [response.data.xq];
          this.dqxn = response.data.xn;

          this.getList();
          this.getNj();
          this.getBj();
        })
      },
      getList() {
        this.listQuery['xxdm'] = this.xxdm;
        if(this.activeName == 'kc') { // 按课程
          kccxPjList(this.listQuery).then(response => {
            if (response.status == 200) {
              this.list_kc = response.data.rows;
              this.total = response.data.total;
            }
          })
        } else { // 按学生
          xscxPjList(this.listQuery).then(response => {
            if (response.status == 200) {
              this.list_stu = response.data.rows;
              this.total = response.data.total;
            }
          })
        }
      },
      /*
      * 导出课程查询数据
      * */
      async handleExportPjkc() {
        this.exportLoading = true;
        this.listQuery['xxdm'] = this.xxdm;
        var res = await exportKccxPjList(this.listQuery);
        const blob = new Blob([res], {
          type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });

        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '课程查询名单.xls'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
        this.exportLoading = false;
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
      },
      /*
      * 检索条件
      * */
      goSerch(data) {
        this.listQuery.cxmc = data.curValue;
        this.listQuery.cxlx = data.type || 'all';
        if(this.activeName == 'kc') {
          this.listQuery.week = data.temp[0].join(',');
          this.listQuery.xnGroup = data.temp[1];
          this.listQuery.xqGroup = data.temp[2];
        } else {
          this.listQuery.njGroup  = data.temp[0];
          this.listQuery.bjGroup = data.temp[1];
          this.listQuery.xnGroup = data.temp[2];
          this.listQuery.xqGroup = data.temp[3];
        }
        this.getList();
      },
      /*
      * 查询学年列表
      * */
      getxnList() {
        getxnList({xxdm: this.xxdm}).then(response => {
          let model, a, data = response;
          this.conditionItems[1].values = [];
          this.conditionStuItems[2].values = [];
          for (a of data) {
            model = {};
            model.value = a.xn;
            model.text = a.xn;
            this.conditionItems[1].values.push(model);
            this.conditionStuItems[2].values.push(model);
          }
        });
      },
      /*
      * 查询学期列表
      * */
      getxqList() {
        getxqList({xxdm: this.xxdm}).then(response => {
          let model, a, data = response;
          this.conditionItems[2].values = [];
          this.conditionStuItems[3].values = [];
          for (a of data) {
            model = {};
            model.value = a.xq;
            model.text = a.xqmc;
            this.conditionItems[2].values.push(model);
            this.conditionStuItems[3].values.push(model);
          }
        });
      },
      /*
      * 查询年级列表
      * */
      getNj() {
        getNj({ xxdm: this.xxdm }).then(response => {
          let model, a;
          this.conditionStuItems[0].values = [];
          for (a of response.data.rows) {
            model = {};
            model.value = a.njdm;
            model.text = a.njmc;
            this.conditionStuItems[0].values.push(model);
          }
        });
      },
      /*
      * 查询班级列表
      * */
      getBj() {
        getBj({ xxdm: this.xxdm, dqxn: this.dqxn }).then(response => {
          let model, a;
          this.conditionStuItems[1].values = [];
          for (a of response.data) {
            model = {};
            model.value = a.uuid;
            model.text = a.bj;
            this.conditionStuItems[1].values.push(model);
          }
        });
      },
      showDetail(i) {
        this.dialogVisible = true;

        if(this.activeName == 'kc') {
          let query = {
            xxdm: this.xxdm,
            kcdm: this.list_kc[i].kcdm,
            xndm: this.list_kc[i].xndm,
            xqdm: this.list_kc[i].xqdm
          };

          kcpjqktj(query).then(response => {
            if (response.status == 200) {
              this.detailInfo = response.data
            }
          })
        } else {
          let query = {
            xxdm: this.xxdm,
            xh: this.list_stu[i].xh,
            xndm: this.list_stu[i].xndm,
            xqdm: this.list_stu[i].xqdm
          };

          xspjqktj(query).then(response => {
            if (response.status == 200) {
              this.detailInfo = response.data
            }
          })
        }

      },
      cancel() {
        this.dialogVisible = false;
      }
    }
  }
</script>

<style scoped>

</style>
