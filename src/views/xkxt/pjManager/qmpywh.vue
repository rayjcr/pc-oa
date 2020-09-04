<template>
  <div class="content-container app-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <search-app
          ref="searchApp"
          search-placeholder=""
          :search-input-select="true"
          :search-types="searchTypes"
          :condition-items="[]"
          @searchClick="goSerch"
        ></search-app>
      </div>

      <div class="m_GenTableBox">
        <el-button icon="el-icon-plus" type="primary" plain size="small" @click="handleCreate">增加</el-button>
        <el-button icon="el-icon-edit" type="primary" plain size="small" @click="handleEdit">修改</el-button>
        <el-button icon="el-icon-delete" type="primary" plain size="small" @click="handleDlete">删除</el-button>
      </div>

      <div class="m_GenTableBox">
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="(item,index) in pyDj"
            :key="index"
            :label="item.label"
            :name="item.value"
          >
            <el-table
              :data="list"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="35"
              >
              </el-table-column>
              <el-table-column label="评语" sortable :sort-by="'qmpynr'">
                <template slot-scope="scope">{{ scope.row.qmpynr }}</template>
              </el-table-column>
              <el-table-column label="显示顺序">
                <template slot-scope="scope">
                  <el-button
                    size="medium"
                    type="primary"
                    :disabled="scope.$index == 0 ? true : false"
                    @click="upGo(scope.$index)">上移
                  </el-button>
                  <el-button
                    size="medium"
                    type="primary"
                    :disabled="scope.$index == list.length-1 ? true : false"
                    @click="downGo(scope.$index)">下移
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
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
      </div>

    </div>

    <el-dialog :title="type == 1 ? '增加评价评语':'修改评价评语'" :visible.sync="dialogFormVisible" width="500px" @close="cancel">
      <el-form :model="form" ref="form" label-width="110px" name="myform">
        <el-form-item label="评语" prop="py" :rules="[{ required: true,trigger:'blur', message: '评语不能为空'}]">
          <el-col :span="20">
            <el-input v-model.trim="form.py" placeholder="请输入评语内容"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import searchApp from '@/views/components/searchbar'

  import { qmpyList, saveQmpywh, deleteQmpywh, saveXssx } from 'api/xkxt/pjManager/index'

  export default {
    name: "qmpywh",
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
            label: "评语",
            value: "qmpynr"
          }
        ],
        activeName: 'A', // A，优秀 B，良好 C，合格 D，待评
        pyDj: [
          {label: '优秀', value: 'A'},
          {label: '良好', value: 'B'},
          {label: '合格', value: 'C'},
          {label: '待评', value: 'D'}
        ],
        list: [],
        dialogFormVisible: false,
        type: 1, // 1添加评语,2修改评语
        form: {
          py: ''
        },
        seleted: [],
        xxdm: '',
        total: 0,
        listQuery: {
          query: {
            page: 1,
            limit: 10
          },
          cxlx: 'all', // 查询类型 all，全部 qmpynr，评语
          xxdm: '',
          cxmc: '', // 查询名称
          pydjdm: 'A', // 等级  A，优秀 B，良好 C，合格 D，待评
        }
      }
    },
    watch: {
      /*
      * 等级切换
      * */
      activeName() {
        this.getList()
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem("xxdm");
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.listQuery['xxdm'] = this.xxdm;
        this.listQuery['pydjdm'] = this.activeName;

        qmpyList(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },
      /*
      * 增加，修改
      * */
      saveQmpywh() {
        let query = {
          xxdm: this.xxdm,
          qmpynr: this.form.py,
          pydjdm: this.activeName,
          jlid: this.type == 1 ? null : this.seleted[0].jlid
        };
        saveQmpywh(query).then(response => {
          if(response.resultCode == 1) {
            this.getList();
            this.cancel();
          } else {
            this.$message({
              message: response.resultMessage,
              type: 'warning'
            });
          }
        })
      },
      /*
      * 删除
      * */
      deleteQmpywh() {
        let jlid_arr = [];
        this.seleted.forEach((c) => {
          jlid_arr.push(c.jlid)
        });

        let query = {
          xxdm: this.xxdm,
          ids: jlid_arr
        };
        deleteQmpywh(query).then(response => {
          if(response.resultCode == 1) {
            this.getList();
          } else {
            this.$message({
              message: response.resultMessage,
              type: 'warning'
            });
          }
        })
      },
      /*
      * 批量操作，存储选中的评语记录
      * */
      handleSelectionChange(val) {
        this.seleted = val
      },
      /*
      * 排序
      * */
      saveXssx(aid,bid) {
        let query = {
          ids: [aid,bid]
        };
        saveXssx(query).then(response => {
          if(response.resultCode != 1) {
            this.$message({
              message: response.resultMessage,
              type: 'warning'
            });
          }
        })
      },
      /*
      * 上移
      * */
      upGo(index) {
        this.saveXssx(this.list[index].jlid,this.list[index-1].jlid);

        this.list[index] = this.list.splice(index-1, 1, this.list[index])[0];
      },
      /*
      * 下移
      * */
      downGo(index) {
        this.saveXssx(this.list[index].jlid,this.list[index+1].jlid);

        this.list[index] = this.list.splice(index+1, 1, this.list[index])[0];
      },
      goSerch(data) {
        this.listQuery.cxmc = data.curValue;
        this.listQuery.cxlx = data.type || 'all';
        this.getList();
      },
      cancel() {
        this.dialogFormVisible = false;
      },
      handleCreate() {
        this.form.py = '';
        this.type = 1;
        this.dialogFormVisible = true;
      },
      handleEdit() {
        if(this.seleted.length == 0 || this.seleted.length > 1){
          this.$message({
            message: `${this.seleted.length == 0 ? '请选择一条记录' : '本次操作只能选择一条记录'}`,
            type: 'warning'
          });
          return;
        }
        this.type = 2;
        this.form.py = this.seleted[0].qmpynr;
        this.dialogFormVisible = true;
      },
      handleDlete() {
        if(this.seleted.length == 0){
          this.$message({
            message: '请选择一条记录',
            type: 'warning'
          });
          return;
        }
        this.$confirm('确定删除选中的记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteQmpywh();
        }).catch(e => {
          // console.log(e)
        });
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
        this.getList()
      },
      create() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.saveQmpywh()
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
