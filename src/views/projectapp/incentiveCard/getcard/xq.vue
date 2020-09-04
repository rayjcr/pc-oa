<template>
  <div class="hkxq">
    <div class="wrapper">
      <div>
        <p class="fkjlhz">获卡详情</p>
        <p class="lititle"><span class="a">卡片名称</span><span class="b">{{kpmc||''}}</span></p>
        <p class="lititle"><span class="a">姓名</span><span class="b">{{xm||''}}</span></p>
        <p class="lititle"><span class="a">班级</span><span class="b">{{bjmc||''}}</span></p>
      </div>
    </div>
    <div class="kpsjdiv">
      <!-- <p class="kpsjdivcard" style="margin-top: 60px !important;">激励卡发卡总记录表</p> -->
      <el-table
        border
        :data="tableData"
        style="width: 100%;">
        <el-table-column
          prop="kpmc"
          label="卡片名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="zc"
          label="周次"
          width="100">
        </el-table-column>
        <el-table-column
          prop="cjsj"
          label="发卡时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="fkr"
          width="200"
          label="发卡人">
        </el-table-column>
        <el-table-column
          min-width="200"
          label="评语">
          <template slot-scope="scope">
              <el-popover 
              class="qxszshengluepopover"
              style=""
              trigger="hover" 
              placement="left">
                <p>{{scope.row.fkpy}}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag 
                  class="qxszshengluetag"
                  style=""
                  size="">
                <p class="fkpy">{{scope.row.fkpy}}</p>
                  </el-tag>
                </div>
              </el-popover>
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
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import MyTransition from '@/views/components/mtransition'
  import {
    hkxq
  } from '@/api/projectapp/incentiveCard/';

  export default {
    name: 'detail',
    components: {
      MyTransition
    },
    data() {
      return {
        kpmc: '', // 卡片名称
        xm: '', // 姓名
        bjmc: '', // 班级
        kpmcnum: 1, // 卡片数量初始值
        nokplx: false, // 没有卡片类型
        month: '', // 月份
        kplxlist: [], // 卡片类型
        searchinput: '', // 搜索字段
        fzkp: false, // 复制卡片弹层
        radiotime: '1', // 查询时间
        page: 1, // 页数
        limit: 10, // 条数
        total: 0,
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
        dynamicTags: [],
        dialogVisible: false,
        moreset: false,
        activeName: '1',
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
          // {
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
      const xn = this.$route.query.xn
      const xq = this.$route.query.xq
      const kplx = this.$route.query.kplx
      const xh = this.$route.query.xh
      const xxdm = this.$route.query.xxdm
      this.kpmc = this.$route.query.bc
      this.xm = this.$route.query.xm
      this.bjmc = this.$route.query.bjmc
      this.gethkxq(xn, xq, kplx, xh, xxdm)
    },
    methods: {

      /**
     * @description: 获卡详情
     * @param {type}
     * @return:
     */
      async gethkxq(xn, xq, kplx, xh, xxdm) {
        await hkxq({
          xn,
          xq,
          kplx,
          xh,
          page: this.page,
          limit: this.limit,
          xxdm
        }).then(res => {
          if (res.status === 200) {
            this.tableData = res.data.contentList
            if (res.data.hasOwnProperty('total')) {
              this.total = res.data.total
            }
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        });
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
        const xn = this.$route.query.xn
        const xq = this.$route.query.xq
        const kplx = this.$route.query.kplx
        const xh = this.$route.query.xh
        const xxdm = this.$route.query.xxdm
        this.kpmc = this.$route.query.bc
        this.xm = this.$route.query.xm
        this.bjmc = this.$route.query.bjmc
        this.gethkxq(xn, xq, kplx, xh, xxdm)
      },
      handleCurrentChange(val) {
        this.page = val;
  
        const xn = this.$route.query.xn
        const xq = this.$route.query.xq
        const kplx = this.$route.query.kplx
        const xh = this.$route.query.xh
        const xxdm = this.$route.query.xxdm
        this.kpmc = this.$route.query.bc
        this.xm = this.$route.query.xm
        this.bjmc = this.$route.query.bjmc
        this.gethkxq(xn, xq, kplx, xh, xxdm)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../commonsty/common";

  .hkxq {
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
      // height: 550px;
      border-radius: 3px;
    }
  }

</style>
<style>
  .hkxq .el-collapse-item__header {
    padding: 18px 41px !important;
    line-height: 14px;
    font-size: 14px;
    color: #909399;
    margin: 0 !important;
  }
  .hkxq .fakajilulx {
    border-top: 1px solid #ebeef5;
  }

  .hkxq .el-collapse-item__content div {
    padding: 5px 41px !important;
    line-height: 14px;
    font-size: 14px;
    color: #909399;
    margin: 0 !important;
  }

  .hkxq .el-collapse-item__arrow {
    line-height: 14px !important;
  }

  .hkxq .el-table td, .hkxq .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
    padding: 18px 36px;
    font-size: 14px;
  }

  .hkxq .bigimg img {
    width: 160px;
    height: 72px;
    border-radius: 2px;
  }

  .hkxq .lookBigPic {
    display: none;
    line-height: 14px !important;
  }

  .hkxq .el-dialog {
    width: 740px;
    margin-top: 10% !important;
  }

  .hkxq .bigimg:hover .lookBigPic {
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

  .hkxq .el-tag + .el-tag {
    margin-left: 10px;
  }

  .hkxq .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .hkxq .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .hkxq .el-dialog {
    width: 461px !important;
  }

  .hkxq .xnselect {
    width: 130px !important;
    margin: 0 10px 32px 0;
  }

  .hkxq .xqselect {
    width: 120px !important;
  }

  .hkxq .kplxcheck .el-checkbox {
    margin-right: 30px !important;
  }

  .hkxq .szcksldialog .el-dialog {
    width: 600px !important;
  }

  .hkxq .szcksldialog .el-radio-group {
    padding-top: 6px !important;
  }

  .hkxq .kplxcheck .el-checkbox + .el-checkbox {
    margin-left: 0 !important;
  }

  .hkxq .el-date-editor .el-range-separator {
    width: 20px !important;
  }

  .hkxq .el-tabs--border-card > .el-tabs__content {
    padding: 15px 0 !important;
    border-top: 1px solid #ebeef5;
  }

  .hkxq .szcksdialog .el-dialog {
    width: 800px !important;
  }

  .hkxq .szcksdialog .el-radio-group {
    padding-top: 6px !important;
  }
  .hkxq .dxnrp {
    padding: 2px 10px;
    line-height: 35px;
    color: #606266;
    background-color: #f5f7fa;
    text-indent: 2em;
  }

  .hkxq .dxnr {
    display: inline-block;
    margin-bottom: 3px;
    color: #303133;
  }

  .hkxq .fsdxtitle {
    display: inline-block;
    width: 100px;
    margin-right: 16px;
    color: #303133;
  }
  .hkxq .el-table td,
  .hkxq .el-table th.is-leaf{
    padding: 10px 5px !important;
  }

  .hkxq .el-input-number {
    width: 145px !important;
  }

  .hkxq .changea {
    margin: -6px 0 0 15px !important;
  }
  .hkxq .bottomstyl {
    height: 40px;
    line-height: 40px;
    padding-left: 16px;
    background-color: #fdf6ec;
    border-radius: 4px;
    font-size: 14px;
    color: #e6a23c;
  }
  .hkxq .lititle {
    font-size: 14px;
  }
  .hkxq .lititle span{
    display: inline-block;
  }
  .hkxq .lititle .a{
    color: #909399;
    width: 56px;
    margin-right: 25px;
  }
  .hkxq .lititle .b{
    color: #606266;
  }
  .hkxq .fkjlhz {
    font-size: 18px;
    color: #303133;
    margin-bottom: 31px;
  }
  .hkxq .el-tabs--border-card {
    overflow: hidden;
  }
  .hkxq .kpsjdivcard {
    margin: 20px 0!important;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0px;
    margin-left: 24px !important;
    color: #909399;
  }
  .hkxq .kpsjdiv .el-tag{
  background-color: white !important;
  border: none !important;
}
.hkxq .qxszshengluetag .fkpy{
  margin: 0 0 16px !important;
}
.hkxq .qxszshengluepopover{
  max-width:200px;
}
</style>
