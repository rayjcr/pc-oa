<template>
  <div class="cardMaintenance-sendcardxq">
    <div class="wrapper">
      <div>
        <p class="fkjlhz">发卡记录汇总</p>
        <p class="lititle"><span class="a">教师姓名</span><span class="b">何旷</span></p>
        <p class="lititle"><span class="a">学年</span><span class="b">2018-2019</span></p>
        <p class="lititle"><span class="a">学期</span><span class="b">上学期</span></p>
      </div>
    </div>
    <div class="kpsjdiv">
      <el-tabs type="border-card">
        <p class="kpsjdivcard">激励卡发卡总记录表</p>
        <el-tab-pane class="fakajilulx" label="全部类型">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date"
              label="学号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date1"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="role"
              min-width="200"
              label="年级">
            </el-table-column>
            <el-table-column
              prop="role"
              min-width="200"
              label="班级">
            </el-table-column>
            <el-table-column
              prop="role"
              min-width="200"
              label="考核时间">
            </el-table-column>
            <el-table-column
              prop="address"
              min-width="400"
              label="评语">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane class="fakajilulx" label="卡片名称">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date"
              label="学号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date1"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="role"
              min-width="200"
              label="年级">
            </el-table-column>
            <el-table-column
              prop="role"
              min-width="200"
              label="班级">
            </el-table-column>
            <el-table-column
              prop="role"
              min-width="200"
              label="考核时间">
            </el-table-column>
            <el-table-column
              prop="address"
              min-width="400"
              label="评语">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="卡片名称1">123</el-tab-pane>
        <el-tab-pane label="卡片名称2">123</el-tab-pane>
        <el-tab-pane label="卡片名称3">123</el-tab-pane>
        <el-tab-pane label="卡片名称4">123</el-tab-pane>
        <el-tab-pane label="卡片名称5">123</el-tab-pane>
        <el-tab-pane label="卡片名称6">123</el-tab-pane>
      </el-tabs>

    </div>

    <div class="block" style="margin-top: 32px;margin-bottom:100px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
    <!--批量设置持卡数量-->
    <el-dialog width="25%" top="10vh" title="批量设置持卡数量" :visible.sync="plszcksl">
      <div>
        <el-radio-group v-model="plszckslradio" @change="getradio">
          <el-radio-button label="1">教师</el-radio-button>
          <el-radio-button label="2">家长</el-radio-button>
        </el-radio-group>
        <div style="border-radius: 3px;border: solid 1px #eaedf4;margin-top: 16px;">
          <el-row>
            <el-col style="text-align: center;padding: 17px 0;" :span="12">
              <span>卡片类型</span>
            </el-col>
            <el-col style="text-align: center;padding: 17px 0;" :span="12">
              <span v-if="plszckslradio==1">教师持卡数量</span>
              <span v-if="plszckslradio==2">家长持卡数量</span>
            </el-col>
          </el-row>
          <div style="height: 240px;overflow-y: auto;">
            <el-row v-for="(item, index) in inputnumber" :key="item.label + index">
              <el-col style="text-align: center;padding: 17px 0;" :span="12">
                <span>{{item.label}}</span>
              </el-col>
              <el-col style="text-align: center;padding: 7px 0;" :span="12">
                <el-input-number v-model="item.num" @change="kpmcnumhand" :min="0"
                                 @click.native="clickchange(index)"></el-input-number>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="plszcksl = false">取 消</el-button>
        <el-button type="primary" @click="plszckslyes">确 定</el-button>
      </span>
    </el-dialog>

    <!--短信通知设置-->
    <el-dialog class="szcksldialog" width="25%" title="短信通知设置" :visible.sync="szcksl">
      <div style="margin-bottom: 6px;">
        <span class="fsdxtitle">发卡短信通知</span>
        <el-radio-group v-model="fkdxtz">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-bottom: 30px;">
        <span class="dxnr">短信内容</span>
        <div>
          <p class="dxnrp">ⅩⅩⅩ家长：您好! 您的孩子因ⅩⅩⅩⅩⅩⅩ(即备注内容)获得ⅩⅩⅩⅩ卡一张，请您加以表扬。！</p>
        </div>
      </div>
      <div style="margin-bottom: 6px;">
        <span class="fsdxtitle">发动态短信通知</span>
        <el-radio-group v-model="fkdxtz">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </div>
      <div>
        <span class="dxnr">短信内容</span>
        <div>
          <p class="dxnrp">ⅩⅩⅩ家长：您好!ⅩⅩⅩ老师为您的孩子发布了一条动态，请及时查阅。

            ⅩⅩⅩ老师：您好!您的学生ⅩⅩⅩ发布了一条动态，请及时查阅。</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="szcksl = false">取 消</el-button>
        <el-button type="primary" @click="szckslyes">确 定</el-button>
      </span>
    </el-dialog>

    <!--设置持卡数-->
    <el-dialog class="szcksdialog" width="25%" top="10vh" title="设置持卡数" :visible.sync="szcksdialog">
      <div>
        <div style="margin-bottom: 32px;">
          <span style="margin-right: 16px">时间选择</span>
          <el-radio-group v-model="plszckslradio" @change="getszcksSzlxradio">
            <el-radio-button label="1">按周设置</el-radio-button>
            <el-radio-button label="2">按月设置</el-radio-button>
            <el-radio-button label="3">按学期设置</el-radio-button>
          </el-radio-group>
        </div>
        <div v-show="plszckslradio!='3'" style="margin-bottom: 32px;">
          <span style="margin-right: 16px">设置类型</span>
          <el-radio-group v-model="szcksszlx">
            <div v-show="plszckslradio =='1'">
              <el-radio label="1">按周重置数量</el-radio>
              <el-radio label="2">按周增加数量</el-radio>
            </div>
            <div v-show="plszckslradio =='2'">
              <el-radio label="3">按月重置数量</el-radio>
              <el-radio label="4">按月增加数量</el-radio>
            </div>

          </el-radio-group>
        </div>
        <div style="border-radius: 3px;border: solid 1px #eaedf4;margin-top: 16px;margin-bottom: 46px;">
          <el-row>
            <el-col style="text-align: center;padding: 17px 0;" :span="6">
              <span>卡片类型</span>
            </el-col>
            <el-col style="text-align: center;padding: 17px 0;" :span="6">
              <span>已发总数</span>
            </el-col>
            <el-col style="text-align: center;padding: 17px 0;"  v-if="plszckslradio!='3'" :span="plszckslradio!='3'? 6:12">
              <span>持卡数量</span>

            </el-col>
            <el-col style="text-align: center;padding: 17px 0;" :span="plszckslradio =='3'?12:6">
              <span v-if="szcksszlx=='1' && plszckslradio != '3'">按周重置数量</span>
              <span v-if="szcksszlx=='2' && plszckslradio != '3'">按周增加数量</span>
              <span v-if="szcksszlx=='3' && plszckslradio != '3'">按月重置数量</span>
              <span v-if="szcksszlx=='4' && plszckslradio != '3'">按月增加数量</span>
              <span v-if="plszckslradio == '3'">持卡数量</span>
            </el-col>
          </el-row>
          <div style="height: 240px;overflow-y: auto;">
            <el-row v-for="(item, index) in inputnumber" :key="item.label + index">
              <el-col style="text-align: center;padding: 17px 0;" :span="6">
                <span>{{item.label}}</span>
              </el-col>
              <el-col style="text-align: center;padding: 17px 0;" :span="6">
                <span>{{item.label}}</span>
              </el-col>
              <el-col :style="{textAlign: 'center', padding: (plszckslradio =='3'? '8px':(17 + 'px' + ' ' + 0))}" :span="plszckslradio =='3'?12:6">
                <span v-if="plszckslradio !='3'">{{item.label}}</span>
                <el-input-number v-if="plszckslradio ==='3'" v-model="item.num" @change="kpmcnumhand" :min="0"
                                 @click.native="clickchange(index)"></el-input-number>
              </el-col>
              <el-col v-if="plszckslradio!='3'" style="text-align: center;padding: 7px 0;" :span="6">
                <el-input-number v-model="item.num" @change="kpmcnumhand" :min="0"
                                 @click.native="clickchange(index)"></el-input-number>
              </el-col>
            </el-row>
          </div>
        </div>
        <p class="bottomstyl" v-if="plszckslradio=='1'">说明：设置后，每周数量累积</p>
        <p class="bottomstyl" v-if="plszckslradio=='2'">说明：设置后，每月将重置数量</p>
        <p class="bottomstyl" v-if="plszckslradio=='3'">说明：批量设置持卡数量</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="szcksdialog = false">取 消</el-button>
        <el-button type="primary" @click="szcksdialogyes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import MyTransition from '@/views/components/mtransition'

  export default {
    name: 'detail',
    components: {
      MyTransition
    },
    data() {
      return {
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
        tableData: [{
          date: '一级',
          date1: '白银',
          role: '5个普通',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '二级',
          date1: '白银',
          role: '5个普通',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '三级',
          date1: '白银',
          role: '5个普通',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '四级',
          date1: '白银',
          role: '5个普通',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },{
          date: '一级',
          date1: '白银',
          role: '5个普通',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '二级',
          date1: '白银',
          role: '5个普通',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '三级',
          date1: '白银',
          role: '5个普通',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '四级',
          date1: '白银',
          role: '5个普通',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },{
          date: '一级',
          date1: '白银',
          role: '5个普通',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '二级',
          date1: '白银',
          role: '5个普通',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }]
      }
    },
    computed: {},
    methods: {
      // 批量设置持卡数量确定了
      plszckslyes() {
        console.log();
      },
      // 批量设置持卡数量确定了
      szckslyes() {
        console.log();
      },
      // 设置持卡数量确定了
      szcksdialogyes() {
        console.log();
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
        console.log(val);
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
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
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
      height: 650px;
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
    height: 605px;
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
