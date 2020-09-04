<template>
  <div class="cardMaintenance-sendcardxq">
    <div class="wrapper">
      <div>
        <p class="fkjlhz">发卡记录汇总</p>
        <p class="lititle"><span class="a">教师姓名</span><span class="b">{{jsxm || ''}}</span></p>
        <p class="lititle"><span class="a">学年</span><span class="b">{{xn || ''}}</span></p>
        <p class="lititle"><span class="a">学期</span><span class="b">{{xq || ''}}</span></p>
      </div>
    </div>
    <div class="kpsjdiv">
      <el-tabs 
        @tab-click="tabClick"
        v-model="activeName"
        type="border-card">
        <p 
          style="padding:20px 30px;" 
          v-if="ishasinfo">暂无卡片信息</p>
        <p class="kpsjdivcard">{{
          cardTitle}}</p>
        <!-- <el-tab-pane class="fakajilulx" label="全部类型">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              label="编号"
              width="180">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="xh"
              label="学号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="xsxm"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="bjmc"
              min-width="bjmc"
              label="班级">
            </el-table-column>
            <el-table-column
              prop="bfsj"
              min-width="200"
              label="考核时间">
            </el-table-column>
            <el-table-column
              prop="fkpy"
              min-width="400"
              label="评语">
            </el-table-column>
          </el-table>
        </el-tab-pane> -->
        <el-tab-pane 
          class="fakajilulx"
          v-for="item in kpmcList"
          :name="item.jlid"
          :key="item.jlid"
          :label="item.kpmc">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              label="编号"
              width="180">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="xh"
              label="学号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="xsxm"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="bjmc"
              min-width="bjmc"
              label="班级">
            </el-table-column>
            <el-table-column
              prop="bfsj"
              min-width="200"
              label="考核时间">
            </el-table-column>
            <el-table-column
              prop="fkpy"
              min-width="400"
              label="评语">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </div>

    <div class="block" style="margin-top: 32px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  fkjl,
  fkxnxqcardinformations
}
from '../../../../api/projectapp/incentiveCard/index.js';
import MyTransition from '@/views/components/mtransition'

export default {
  name: 'detail',
  components: {
    MyTransition
  },
  data() {
    return {
      ishasinfo: false, // 是否显示
      total: 0,
      page: 1, // 页数
      limit: 10, // 条数
      xn: '', // 学年
      xq: '', // 学期
      jsxm: '', // 教师姓名
      cardTitle: '', // 卡片名称
      activeName: '', // tab的初始值
      kplxdm: '', // 卡片类型代码
      kpmcList: [], // 卡片名称数组
      ckr: '', // 持卡人
      kplx: '', // 卡片类型
      xxdm: '', // 学校代码
      kpmcnum: 1, // 卡片数量初始值
      nokplx: false, // 没有卡片类型
      month: '', // 月份
      kplxlist: [], // 卡片类型
      searchinput: '', // 搜索字段
      fzkp: false, // 复制卡片弹层
      radiotime: '1', // 查询时间
      plszcksl: false, // 批量设置持卡数量弹层
      szcksdialog: false, // 设置持卡数弹层
      szcksszlx: '1', // 设置持卡数设置类型
      inputindex: '', // 增减值
      szcksl: false, // 设置持卡数量弹层
      szcksSzlx: false, // 设置持卡数设置类型显示
      plszckslradio: '1', // 批量设置持卡数量 单选
      selectxq: '', // 请选择学年
      selectxn: '', // 请选择学期
      value6: '', // 发卡时间
      fzz: '2018-2019 下学期', // 当前学年学期
      fkdxtz: '', // 发卡短信通知
      inputnumber: [
        {
          label: '卡片1',
          num: 0
        },
        {
          label: '卡片2',
          num: 0
        },
        {
          label: '卡片3',
          num: 0
        },
        {
          label: '卡片4',
          num: 1
        }
      ], // 计数器Mock
      dialogImageUrl: '',
      xnoptions: [{
        value: '选项1',
        label: '2018-2019'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      xqoptions: [{
        value: '选项1',
        label: '上学期'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      srcurl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548222999433&di=2ac9e035387de64090fe7aa8e3c904a8&imgtype=0&src=http%3A%2F%2Fimg15.3lian.com%2F2015%2Ff1%2F140%2Fd%2F40.jpg',
        // srcurl: '',
      dynamicTags: ['2018-2019', '上学期'],
      dialogVisible: false,
      moreset: false,
      radioxn: '1',
      radioxq: '1',
      currentPage4: 1,
      cardForm: {
        name: '',
        region: '',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        radio: '1'
      },
      tableData: [
      //   {
      //   date: '一级',
      //   date1: '白银',
      //   role: '5个普通',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '二级',
      //   date1: '白银',
      //   role: '5个普通',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1517 弄'
      // }, {
      //   date: '三级',
      //   date1: '白银',
      //   role: '5个普通',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1519 弄'
      // }, {
      //   date: '四级',
      //   date1: '白银',
      //   role: '5个普通',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1516 弄'
      // }, {
      //   date: '一级',
      //   date1: '白银',
      //   role: '5个普通',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '二级',
      //   date1: '白银',
      //   role: '5个普通',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1517 弄'
      // }, {
      //   date: '三级',
      //   date1: '白银',
      //   role: '5个普通',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1519 弄'
      // }, {
      //   date: '四级',
      //   date1: '白银',
      //   role: '5个普通',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1516 弄'
      // }, {
      //   date: '一级',
      //   date1: '白银',
      //   role: '5个普通',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '二级',
      //   date1: '白银',
      //   role: '5个普通',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1517 弄'
      // }
      ]
    }
  },
  computed: {},
  mounted() {
    this.ckr = this.$route.query.ckr
    this.kplx = this.$route.query.kplx
    this.xn = this.$route.query.xn

    if (this.$route.query.xq === '02') {
      this.xq = '下学期'
    } else {
      this.xq = '上学期'
    }
    this.jsxm = this.$route.query.jsxm
    this.xxdm = localStorage.getItem('xxdm')
    this.getxnxqcardinformations()
  },
  methods: {
     /**
       * @description: 获取查询卡片信息
       * @param {type}
       * @return:
       */
    async getxnxqcardinformations() {
      await fkxnxqcardinformations({
        dqxn: this.xn,
        dqxq: this.$route.query.xq,
        xxdm: this.xxdm
      })
        .then(r => {
          if (r.status === 200) {
            this.kpmcList = r.data
            if (this.kpmcList.length) {
              this.ishasinfo = false
            } else {
              this.ishasinfo = true
            }
            this.kplxdm = this.kpmcList[0].jlid
            this.cardTitle = `${this.kpmcList[0].kpmc}发卡记录表`
            this.activeName = this.kpmcList[0].jlid
            this.getcxkpsz()
            // this.getcxkpsz(this.kpmcList[0].jlid)
          } else {
            this.$message({
              type: 'error',
              message: r.message
            });
          }
        })
    },


    /**
     * @description: Tab标签事件
     * @param {type}
     * @return:
     */
    async tabClick(tab) {
      if (tab.label === '全部类型') {
        this.kplx = '发卡总量'
      } else {
        this.kplx = `${tab.label}类型数量`
      }
      this.page = 1
      this.kplxdm = tab.name
      this.cardTitle = `${tab.label}发卡记录表` || '激励卡发卡记录表'
      await this.getcxkpsz(tab.name)
    },

    /**
     * @description: 发卡记录（按钮）
     * @param {type}
     * @return:
     */
    async getcxkpsz() {
      await fkjl({
        query: {
          page: this.page,
          limit: this.limit
        },
        xxdm: this.xxdm,
        xndm: this.xn,
        xqdm: this.$route.query.xq,
        ckr: this.ckr,
        kplx: this.kplxdm
      })
      .then(r => {
        if (r.status === 200) {
          this.tableData = r.data.rows
          this.total = r.data.total
        }
      })
    },
      // 批量设置持卡数量确定了
    plszckslyes() {

    },
      // 批量设置持卡数量确定了
    szckslyes() {

    },
      // 设置持卡数量确定了
    szcksdialogyes() {

    },
      // 增减改变
    clickchange(index) {
      this.inputindex = index
    },
      // 卡片数量初始值处理函数
    async kpmcnumhand(val) {
      await setTimeout(() => this.inputnumber[this.inputindex].num = val, 50)
      this.inputnumber.forEach((num, index) => {
          //  ...
      })
    },
      // 批量设置持卡数
    plszks() {
      this.$router.push({
        path: '/incentiveCard/cardMaintenanceAdd',
        query: { bsf: 'xz' }
      })
    },
      // 获取教师家长
    getradio(val) {

    },
      // 获取设置持卡数时间选择
    getszcksSzlxradio(val) {
      const that = this
      const a = val
      function setValue(val) {
        that.szcksszlx = val
      }
      switch (a) {
        case '1': { setValue('1'); break }
        case '2': { setValue('3'); break }
        default: break;
      }
    },
      // 短信通知设置
    dxtzsz() {
      this.$router.push({
        path: '/incentiveCard/cardMaintenanceAdd',
        query: { bsf: 'xz' }
      })
    },
      // 发卡记录详情
    fkjl(index, row) {
        // 发卡记录详情
    },
      // 设置持卡数
    szcks(index, row) {
      this.szcksdialog = true
      this.szcksszlx = this.plszckslradio = '1'
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getcxkpsz()
      // this.getxnxqcardinformations()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getcxkpsz()
      // this.getxnxqcardinformations()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../commonsty/common";

  .cardMaintenance-sendcardxq {
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
      // height: 650px;
      border-radius: 3px;
    }
  }

</style>
<style>
  .cardMaintenance-sendcardxq .el-collapse-item__header {
    padding: 18px 41px !important;
    line-height: 14px;
    font-size: 14px;
    color: #909399;
    margin: 0 !important;
  }
  .cardMaintenance-sendcardxq .fakajilulx {
    border-top: 1px solid #ebeef5;
  }

  .cardMaintenance-sendcardxq .el-collapse-item__content div {
    padding: 5px 41px !important;
    line-height: 14px;
    font-size: 14px;
    color: #909399;
    margin: 0 !important;
  }

  .cardMaintenance-sendcardxq .el-collapse-item__arrow {
    line-height: 14px !important;
  }

  .cardMaintenance-sendcardxq .el-table td, .cardMaintenance-sendcardxq .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
    padding: 18px 36px;
    font-size: 14px;
  }

  .cardMaintenance-sendcardxq .bigimg img {
    width: 160px;
    height: 72px;
    border-radius: 2px;
  }

  .cardMaintenance-sendcardxq .lookBigPic {
    display: none;
    line-height: 14px !important;
  }

  .cardMaintenance-sendcardxq .el-dialog {
    width: 740px;
    margin-top: 10% !important;
  }

  .cardMaintenance-sendcardxq .bigimg:hover .lookBigPic {
    position: absolute;
    display: block;
    background-color: rgba(148, 148, 148, 0.69);
    color: #fff;
    width: 160px;
    padding: 10px 0;
    text-align: center;
    bottom: 0;
    line-height: 14px !important;
  }

  .cardMaintenance-sendcardxq .el-tag + .el-tag {
    margin-left: 10px;
  }

  .cardMaintenance-sendcardxq .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .cardMaintenance-sendcardxq .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .cardMaintenance-sendcardxq .el-dialog {
    width: 461px !important;
  }

  .cardMaintenance-sendcardxq .xnselect {
    width: 130px !important;
    margin: 0 10px 32px 0;
  }

  .cardMaintenance-sendcardxq .xqselect {
    width: 120px !important;
  }

  .cardMaintenance-sendcardxq .kplxcheck .el-checkbox {
    margin-right: 30px !important;
  }

  .cardMaintenance-sendcardxq .szcksldialog .el-dialog {
    width: 600px !important;
  }

  .cardMaintenance-sendcardxq .szcksldialog .el-radio-group {
    padding-top: 6px !important;
  }

  .cardMaintenance-sendcardxq .kplxcheck .el-checkbox + .el-checkbox {
    margin-left: 0 !important;
  }

  .cardMaintenance-sendcardxq .el-date-editor .el-range-separator {
    width: 20px !important;
  }

  .cardMaintenance-sendcardxq .el-tabs--border-card > .el-tabs__content {
    padding: 15px 0 !important;
    border-top: 1px solid #ebeef5;
  }

  .cardMaintenance-sendcardxq .szcksdialog .el-dialog {
    width: 800px !important;
  }

  .cardMaintenance-sendcardxq .szcksdialog .el-radio-group {
    padding-top: 6px !important;
  }
  .cardMaintenance-sendcardxq .dxnrp {
    padding: 2px 10px;
    line-height: 35px;
    color: #606266;
    background-color: #f5f7fa;
    text-indent: 2em;
  }

  .cardMaintenance-sendcardxq .dxnr {
    display: inline-block;
    margin-bottom: 3px;
    color: #303133;
  }

  .cardMaintenance-sendcardxq .fsdxtitle {
    display: inline-block;
    width: 100px;
    margin-right: 16px;
    color: #303133;
  }
  .cardMaintenance-sendcardxq .el-table td,
  .cardMaintenance-sendcardxq .el-table th.is-leaf{
    padding: 10px 5px !important;
  }

  .cardMaintenance-sendcardxq .el-input-number {
    width: 145px !important;
  }

  .cardMaintenance-sendcardxq .changea {
    margin: -6px 0 0 15px !important;
  }
  .cardMaintenance-sendcardxq .bottomstyl {
    height: 40px;
    line-height: 40px;
    padding-left: 16px;
    background-color: #fdf6ec;
    border-radius: 4px;
    font-size: 14px;
    color: #e6a23c;
  }
  .cardMaintenance-sendcardxq .lititle {
    font-size: 14px;
  }
  .cardMaintenance-sendcardxq .lititle span{
    display: inline-block;
  }
  .cardMaintenance-sendcardxq .lititle .a{
    color: #909399;
    width: 56px;
    margin-right: 25px;
  }
  .cardMaintenance-sendcardxq .lititle .b{
    color: #606266;
  }
  .cardMaintenance-sendcardxq .fkjlhz {
    font-size: 18px;
    color: #303133;
    margin-bottom: 31px;
  }
  .cardMaintenance-sendcardxq .el-tabs--border-card {
    overflow: hidden;
  }
  .cardMaintenance-sendcardxq .kpsjdivcard {
    margin: 20px 0!important;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0px;
    margin-left: 24px !important;
    color: #909399;
  }
</style>
