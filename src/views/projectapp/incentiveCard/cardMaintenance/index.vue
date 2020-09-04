<template>
  <div class="cardMaintenance-index">
    <div class="wrapper">
      <div>
        <span style="margin-right: 16px">查询条件</span>
        <el-input
          style="width: 472px;margin-right: 22px;"
          v-model="searchinput"
          placeholder="请输入卡片名称搜索"
        >
          <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
        </el-input>
        <!-- <a @click="moreset=!moreset" style="color: #909399;">
          <i class="el-icon-caret-top edit_icon" v-if="moreset"></i> -->
          <!-- <i class="el-icon-caret-bottom edit_icon" v-else slot="icon"></i> -->
          <!-- <span v-if="moreset">收起更多</span>
          <span v-else>展开更多</span> -->
        <!-- </a> -->
      </div>
      <my-transition>
        <div>
          <div style="margin-top: 32px;">
            <span style="margin-right: 16px">所在学年</span>
            <el-checkbox-group v-model="radioxn" @change="radioxnChange">
              <el-checkbox v-for="(item, index) in xn" :key="item+index" :label="item.xn"/>
            </el-checkbox-group>
          </div>
          <div style="margin-top: 32px;">
            <span style="margin-right: 16px">所在学期</span>
            <el-checkbox-group v-model="radioxq" @change="radioxqChange">
              <el-checkbox
                v-for="(qitem, qindex) in xq"
                :key="qitem.xq"
                :label="qitem.xq"
              >{{qitem.xqmc}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div style="margin-top: 32px;" class="kpks">
            <span style="margin-right: 16px">卡片可见范围</span>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange">
              全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange">
              <el-checkbox
                v-for="city in cities"
                :label="city.njdm"
                :key="city.njdm">
                {{city.njmc}}
                </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </my-transition>

      <!-- <div style="margin-top: 32px;">
        <span style="margin-right: 16px">已选条件</span>
        <el-tag
          style="margin-right: 8px;"
          :key="tag[tagdex]"
          v-for="(tag, tagdex) in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
      </div> -->
    </div>

    <div style="margin-bottom: 24px;">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button @click="fz" type="primary">复制</el-button>
    </div>

    <div class="kpsjdiv">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="xndm" label="学年" width="180"></el-table-column>
        <el-table-column prop="xqmc" label="学期" width="180"></el-table-column>
        <el-table-column prop="kpmc" label="卡片名称" width="180"></el-table-column>
        <el-table-column prop="gradeNameList" label="卡片可见范围" width="180"></el-table-column>
        <el-table-column width="200" label="卡片图标">
          <template slot-scope="scope">
            <div class="bigimg" style="position: relative;overflow: hidden;">
              <div v-if="scope.row.tplj">
                <img :src="scope.row.tplj" alt>
                <span class="lookBigPic" @click="lookbigppic(scope.row)">查看大图</span>
              </div>
              <div v-else style="width: 160px;height: 72px;background-color: #d2d2d2;"></div>
            </div>
            <div>
              <!--// 700 315-->
              <el-dialog
                width="30%"
                style=""
                :append-to-body="true"
                :visible.sync="dialogVisible">
                <img
                    style="width: 80%;
                    margin-left:10%;
                    text-align: center;
                    border-radius: 2px;"
                  :src="dialogImageUrl"
                  alt>
              </el-dialog>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pys" min-width="200" label="评语数"></el-table-column>
        <el-table-column label="操作" min-width="380">
          <template slot-scope="scope">
            <el-button size="medium" type="success" @click="edit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="medium" type="primary" @click="look(scope.$index, scope.row)">查看</el-button>
            <el-button size="medium" type="danger" @click="delet(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="block" style="margin-top: 32px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!--复制-->
    <el-dialog width="25%" title="复制卡片" :visible.sync="fzkp">
      <div style>
        <span style="margin-right: 16px">筛选卡片</span>
        <el-select
          class="xnselect"
          v-model="selectxn"
          @change="xnxqcardinformationshttp"
          placeholder="请选择学年"
        >
          <el-option v-for="(item, indexbbb) in xn" :key="item.xn+ indexbbb++" :label="item.xn" :value="item.xn"></el-option>
        </el-select>
        <el-select
          @change="xnxqcardinformationshttp"
          class="xqselect"
          v-model="selectxq"
          placeholder="请选择学期"
        >
          <el-option v-for="(item, indexaaa) in xq" :key="item.xq + indexaaa++" :label="item.xqmc" :value="item.xq"></el-option>
        </el-select>
      </div>
      <div style="position: relative">
        <span class="kplxtitle">卡片类型</span>
        <div class="kplxtitlediv">
          <p v-if="nokplx" style="color: #606266;">该时间段无卡片！</p>
          <p v-if="noxnxq" style="color: #606266;">请选择学年学期！</p>
          <el-checkbox-group v-else class="kplxcheck" v-model="kplxlist">
            <el-checkbox v-for="item in kplx" :key="item.jlid" :label="item.jlid">
              {{item.kpmc}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div style="margin-top: 20px;">
        <span style="margin-right: 16px">复制至</span>
        <span>{{fzz}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fzkp = false">取 消</el-button>
        <el-button type="primary" @click="fzyes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  allxn,
  allxq,
  allnj,
  dqxnxq,
  findcardlist,
  xnxqcardinformations,
  copycard,
  delcard
} from '@/api/projectapp/incentiveCard/';
import MyTransition from '@/views/components/mtransition';

export default {
  name: 'detail',
  components: {
    MyTransition
  },
  data() {
    return {
      allNjArr: [], // 所有年级
      checkedCities: [], // 已选年级
      cities: [], // 选项
      isIndeterminate: false,
      checkAll: false,
      xqmc: '', // 学期名称
      xnmc: '', // 学年名称
      kplx: [], // 卡片类型
      xq: [], // 学期
      xn: [], // 学年
      page: 1, // 页数
      limit: 10, // 条数
      total: 0,
      radioxn: [], // 当前学年代码
      radioxq: [], // 当前学期代码
      dqxq: '', // 当前学期
      dqxn: '', // 当前学年
      xxdm: '', // 学校代码
      noxnxq: false, // 没有学年学期
      nokplx: false, // 没有卡片类型
      kplxlist: [], // 卡片类型
      searchinput: '', // 搜索字段
      fzkp: false, // 复制卡片弹层
      selectxq: '', // 请选择学年
      xqdmm: '', // 学期代码
      selectxn: '', // 请选择学期
      fzz: '', // 当前学年学期
      dialogImageUrl: '',
      xnoptions: [], // 学年选项
      xqoptions: [], // 学期选项
      srcurl:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548222999433&di=2ac9e035387de64090fe7aa8e3c904a8&imgtype=0&src=http%3A%2F%2Fimg15.3lian.com%2F2015%2Ff1%2F140%2Fd%2F40.jpg',
      // srcurl: '',
      dynamicTags: [], // tag标签
      dialogVisible: false,
      moreset: false,
      activeName: '1',
      currentPage4: 1,
      cardForm: {
        name: '',
        region: '',
        options: [
          {
            value: '选项1',
            label: '黄金糕'
          },
          {
            value: '选项2',
            label: '双皮奶'
          },
          {
            value: '选项3',
            label: '蚵仔煎'
          },
          {
            value: '选项4',
            label: '龙须面'
          },
          {
            value: '选项5',
            label: '北京烤鸭'
          }
        ],
        value: '',
        radio: '1'
      },
      tableData: [] // 卡片表格
    };
  },
  computed: {},
  mounted() {
    this.getnj();
    this.getxn();
    this.getxq();
    this.getdqxnxq();
  },
  methods: {

    /**
     * @description: 全选
     * @param {type}
     * @return:
     */
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.allNjArr : [];
      this.isIndeterminate = false;
    },

    /**
     * @description: 勾选单个CheckBox
     * @param {type}
     * @return:
     */
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },

    /**
     * @description: 查询
     * @param {type}
     * @return:
     */
    async search() {
      this.page = 1
      if (this.radioxn.length === 0 || this.radioxq.length === 0) {
        const message = '学年、学期必须选择！';
        const type = 'warning';
        this.$message({ message, type });
        return;
      }
      this.findcardlistNet();
    },
    /**
     * @description:
     * @param {type}
     * @return:
     */
    szcksdialogyes() {
      // 确定
    },
    /**
     * @description:卡片信息
     * @param {type}
     * @return:
     */
    async findcardlistNet() {
      const self = this;
      await findcardlist({
        gradeList: this.checkedCities,
        kpmc: this.searchinput,
        xxdm: this.xxdm,
        xnGroup: this.radioxn,
        xqGroup: this.radioxq,
        query: {
          page: self.page,
          limit: self.limit
        }
      }).then(res => {
        self.total = res.data.total
        self.tableData = res.data.rows.map(item => {
          if (item.xqdm === '01') {
            item.xqmc = '上学期';
          } else {
            item.xqmc = '下学期';
          }

          if (item.gradeNameList && item.gradeNameList.length > 0) {
            item.gradeNameList = item.gradeNameList.join('、');
          } else {
            item.gradeNameList = ''
          }

          return item;
        });
      });
    },
    /**
     * @description: 获取所有学年
     * @param {type}
     * @return:
     */
    async getxn() {
      const xxdm = this.xxdm = window.localStorage.getItem('xxdm');
      await allxn({ xxdm }).then(res => {
        this.xn = res;
      });
    },

    /**
     * @description: 复制
     * @param {type}
     * @return:
     */
    fz() {
      this.kplx = [];
      this.selectxn = '';
      this.selectxq = '';
      this.kplxlist = [];
      this.nokplx = false;
      this.fzkp = !this.fzkp;
    },
    /**
     * @description: 获取所有学期
     * @param {type}
     * @return:
     */
    async getxq() {
      await allxq({ xxdm: this.xxdm }).then(res => {
        this.xq = res;
      });
    },


    /**
     * @description: 获取所有年级
     * @param {type}
     * @return:
     */
    async getnj() {
      const xxdm = this.xxdm = window.localStorage.getItem('xxdm');
      await allnj({ xxdm }).then(res => {
        this.cities = res
        const arr = []
        res.forEach(item => {
          arr.push(item.njdm)
        })
        this.allNjArr = this.objDeepCopy(arr)
        this.checkedCities = []
      });
    },


    /**
     * @description: 深拷贝
     * @param {type}
     * @return:
     */
    objDeepCopy(source) {
      const sourceCopy = source instanceof Array ? [] : {};
      for (const item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
      }
      return sourceCopy;
    },

    /**
     * @description: 复制卡片请求
     * @param {type}
     * @return:
     */
    async copycardNet() {
      if (this.selectxq === this.xqdmm &&
        this.selectxn === this.xnmc
        ) {
        this.$message({
          message: '不能复制同一学年学期',
          type: 'warning'
        });
        return
      }
      await copycard({
        xxdm: this.xxdm,
        xndm: this.dqxn,
        xqdm: this.dqxq,
        cplist: this.kplxlist
      }).then(res => {
        if (res.status === 200) {
          this.fzkp = !this.fzkp;
          this.$message({
            message: '复制成功',
            type: 'success'
          });
          this.findcardlistNet()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      });
    },

    /**
     * @description: 学年绑定值变化时触发的事件
     * @param {type}
     * @return:
     */
    radioxnChange(a) {

    },

    /**
     * @description: 学期绑定值变化时触发的事件
     * @param {type}
     * @return:
     */
    radioxqChange(a) {

    },

    /**
     * @description: 获取当前学期学年
     * @param {type}
     * @return:
     */
    async getdqxnxq() {
      await dqxnxq({ xxdm: this.xxdm }).then(res => {
        if (res.status === 200) {
          this.radioxn = []
          this.radioxq = []
          this.radioxn[0] = res.data.xn;
          this.radioxq[0] = res.data.xq
          this.dqxn = res.data.xn;
          this.dqxq = res.data.xq;
          this.xnmc = res.data.xn;
          this.xqmc = res.data.xqmc
          this.xqdmm = res.data.xq
          this.fzz = this.xnmc + ' ' + this.xqmc
          this.findcardlistNet();
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
      });
    },

    /**
     * @description: 根据学年学期和学校代码获取查询卡片信息
     * @param {type}
     * @return:
     */
    async xnxqcardinformationshttp() {
      this.kplxlist = []
      if (!this.selectxq) {
        this.noxnxq = true;
        return
      } else {
        this.noxnxq = false;
      }

      if (!this.selectxn) {
        this.noxnxq = true;
        return
      } else {
        this.noxnxq = false;
      }

      await xnxqcardinformations({
        xxdm: this.xxdm,
        xndm: this.selectxn,
        xqdm: this.selectxq
      }).then(res => {
        this.kplx = res;
        if (this.selectxq && this.selectxn && this.kplx.length === 0) {
          this.nokplx = true
        } else {
          this.nokplx = false
        }
      });
    },

    /**
     * @description: 确定复制
     * @param {type}
     * @return:
     */
    async fzyes() {
      if (!this.selectxn || !this.selectxq) {
        this.$message({
          message: '请选择学年学期！',
          type: 'warning'
        });
        return;
      }
      if (!this.nokplx) {
        if (!this.kplxlist.length) {
          this.$message({
            message: '请选择要复制的卡片类型！',
            type: 'warning'
          });
          return;
        }
      }
      await this.copycardNet();
    },

    /**
     * @description: 查看大图
     * @param {type}
     * @return:
     */
    lookbigppic(img) {
      this.dialogImageUrl = img.tplj;
      this.dialogVisible = true;
    },

    /**
     * @description: 查看
     * @param {type}
     * @return:
     */
    look(index, row) {
      this.$router.push({
        path: '/incentiveCard/cardMaintenanceDetail',
        query: { bsf: false, jlid: row.jlid }
      });
    },

    /**
     * @description: 新增
     * @param {type}
     * @return:
     */
    add() {
      this.$router.push({
        path: '/incentiveCard/cardMaintenanceAdd',
        query: { bsf: true }
      });
    },

    /**
     * @description: 编辑
     * @param {type}
     * @return:
     */
    edit(index, row) {
      this.$router.push({
        path: '/incentiveCard/cardMaintenanceAdd',
        query: { bsf: false, jlid: row.jlid }
      });
    },

    /**
     * @description: 删除
     * @param {type}
     * @return:
     */
    delet(index, row) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delcard({
            jlid: row.jlid,
            xxdm: this.xxdm
          }).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.findcardlistNet();
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              });
            }
          });
        })
        .catch(e => {

        });
    },

    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.radioxn.splice(this.radioxn.indexOf(tag), 1);
      this.radioxq.forEach((item, index) => {
        this.radioxq.splice(item.indexOf(tag), 1);
      });
      this.radioxq.splice(this.radioxq.indexOf(tag), 1);
    },

    /**
     * @description: 分页数量改变
     * @param {type}
     * @return:
     */
    handleSizeChange(val) {
      this.limit = val;

      this.findcardlistNet();
    },

    /**
     * @description:  当前页分页改变
     * @param {type}
     * @return:
     */
    handleCurrentChange(val) {
      this.page = val;
      this.findcardlistNet();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../commonsty/common";

.cardMaintenance-index {
  min-width: 1025px;
  padding: 32px 24px;
  .wrapper {
    border: $block-wrapper;
    padding: $block-wrapper-padding;
    border-radius: 4px;
    box-shadow: $block-wrapper-boxshadow;
    margin-bottom: 24px;
  }
  .kpsjdiv {
    border-radius: 3px;
    overflow: hidden;
  }
}
</style>
<style>
.cardMaintenance-index .el-collapse-item__header {
  padding: 18px 41px !important;
  line-height: 14px;
  font-size: 14px;
  color: #909399;
  margin: 0 !important;
}

.cardMaintenance-index .el-collapse-item__content div {
  padding: 5px 41px !important;
  line-height: 14px;
  font-size: 14px;
  color: #909399;
  margin: 0 !important;
}

.cardMaintenance-index .el-collapse-item__arrow {
  line-height: 14px !important;
}

.cardMaintenance-index .el-table td,
.cardMaintenance-index .el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
  padding: 18px 36px;
  font-size: 14px;
}

.cardMaintenance-index .bigimg img {
  width: 75px;
  height: 40px;
  border-radius: 2px;
}

.cardMaintenance-index .lookBigPic {
  display: none;
  line-height: 14px !important;
}

.cardMaintenance-index .el-dialog {
  width: 740px;
  margin-top: 15% !important;
}

.cardMaintenance-index .bigimg:hover .lookBigPic {
  position: absolute;
  display: block;
  background-color: rgba(148, 148, 148, 0.69);
  color: #fff;
  width: 75px;
  padding: 10px 0;
  text-align: center;
  bottom: 0;
  line-height: 14px !important;
}

.cardMaintenance-index .el-tag + .el-tag {
  margin-left: 10px;
}

.cardMaintenance-index .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.cardMaintenance-index .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.cardMaintenance-index .el-dialog {
  width: 380px !important;
}

.cardMaintenance-index .xnselect {
  width: 130px !important;
  margin: 0 10px 32px 0;
}

.cardMaintenance-index .xqselect {
  width: 120px !important;
}

.cardMaintenance-index .kplxcheck .el-checkbox {
  margin-right: 30px !important;
}

.cardMaintenance-index .kplxcheck .el-checkbox + .el-checkbox {
  margin-left: 0 !important;
}

.cardMaintenance-index .kplxtitle {
  margin-right: 16px;
  position: absolute;
  top: 0;
}
.cardMaintenance-index .el-checkbox-group {
  display: inline-block;
}
.cardMaintenance-index .kpks .el-checkbox-group {
  margin-left: 103px;
}
.cardMaintenance-index .kplxtitlediv {
  margin-left: 77px;
}
</style>
