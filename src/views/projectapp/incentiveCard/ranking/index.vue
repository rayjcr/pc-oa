<template>
  <div class="cardMaintenance-sbtj">
    <div class="wrapper">
      <div>
        <span style="margin-right: 16px">查询条件</span>
        <el-input
          style="width: 472px;margin-right: 22px;"
          v-model="searchinput"
          placeholder="请输入学号或者姓名搜索"
        >
          <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
        </el-input>
        <a @click="moreset=!moreset" style="color: #909399;">
          <i class="el-icon-caret-top edit_icon" v-if="moreset"></i>
          <i class="el-icon-caret-bottom edit_icon" v-else slot="icon"></i>
          <span v-if="moreset">收起更多</span>
          <span v-else>展开更多</span>
        </a>
      </div>
      <my-transition>
        <div v-show="moreset">
          <div style="margin-top: 32px;">
            <div style="margin-bottom: 6px;overflow:hidden;">
              <span style="float:left; margin-right: 20px">选择年级</span>
              <el-checkbox-group
                style="float: left; width: auto;"
                v-model="searchradionjdm"
                @change="searchGetradio"
              >
                <el-checkbox
                  v-for="itemraido in allnjArr"
                  :key="itemraido.uuid"
                  :label="itemraido.njdm"
                >{{itemraido.njmc}}</el-checkbox>
              </el-checkbox-group>
            </div>

            <div style="margin-top: 32px;">
              <div style="margin-bottom: 6px;overflow:hidden;">
                <span style="float:left; margin-right: 20px">选择班级</span>
                <el-checkbox-group
                  style="float: left; width: 50%;"
                  v-model="searchkplxlist"
                  @change="checkboxchange"
                >
                  <el-checkbox
                    v-for="itemraido in bjArr"
                    :key="itemraido.uuid"
                    :label="itemraido.uuid"
                  >
                    {{itemraido.bj}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>

          <!-- <div style="margin-top: 32px;">
            <span style="margin-right: 45px">年级 </span>
            <el-radio-group v-model="month">
              <el-radio-button label="一年级"></el-radio-button>
              <el-radio-button label="二年级"></el-radio-button>
              <el-radio-button label="三年级"></el-radio-button>
              <el-radio-button label="四年级"></el-radio-button>
            </el-radio-group>
          </div>

          <div style="margin-top: 32px;">
            <span style="margin-right: 45px">班级 </span>
            <el-radio-group v-model="month">
              <el-radio-button label="一年级1班"></el-radio-button>
              <el-radio-button label="二年级1班"></el-radio-button>
              <el-radio-button label="三年级1班"></el-radio-button>
              <el-radio-button label="四年级1班"></el-radio-button>
            </el-radio-group>
          </div>-->
          <div style="margin-top: 32px;">
            <span style="margin-right: 16px">所在学年</span>
            <el-radio v-for="item in xn" :key="item.xn" v-model="radioxn" :label="item.xn"></el-radio>
          </div>
          <div style="margin-top: 32px;">
            <span style="margin-right: 16px">所在学期</span>
            <el-radio
              v-for="item in xq"
              :key="item.xq"
              v-model="radioxq"
              :label="item.xq"
            >{{item.xqmc}}</el-radio>
          </div>
        </div>
      </my-transition>
      <div style="margin-top: 32px;" v-if="dynamicTags.length > 0">
        <span style="margin-right: 16px">已选条件</span>
        <el-tag
          style="margin-right: 8px;"
          :key="tag.id + 'a' + index"
          v-for="(tag, index) in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag.name}}</el-tag>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <span style="margin-right: 16px;">移动端“琅琊榜”展示规则</span>
      <el-radio-group v-model="lybradio" @change="changelybradio">
        <el-radio :label="1">只看榜主</el-radio>
        <el-radio :label="null">
          <template slot-scope="scoped">展示前
            <el-input
              maxlength="2"
              @blur="changelybradio"
              @keyup.native="proving1"
              style="width: 55px;margin: 0 10px;"
              v-model="zsq"
              placeholder="0"
            ></el-input>名
          </template>
        </el-radio>
      </el-radio-group>
      <!-- <el-button style="margin-left: 40px;" @click="lybyes" type="primary">确定</el-button> -->
    </div>

    <el-button style="margin-bottom: 40px;" @click="gettjpm" type="primary">{{tjpm}}</el-button>
    <div class="kpsjdiv">
      <el-tabs v-model="activeName" @tab-click="tabClick" type="border-card">
        <p class="kpsjdivcard">
          {{cardTitle}}
          <el-button
            style="float: right;margin-right: 24px; margin-top: -10px;"
            @click="exportExcel"
            type="primary"
          >导出</el-button>
        </p>
        <el-tab-pane class="fakajilulx" :label="lxmc" name="all">
          <el-table
            :data="tableData"
            :default-sort="{order: 'ascending'}"
            key="data"
            style="width: 100%"
          >
            <el-table-column prop="xh" label="学号" width="180"></el-table-column>
            <el-table-column prop="xm" label="姓名" width="180"></el-table-column>
            <el-table-column prop="njmc" label="年级" width="180"></el-table-column>
            <el-table-column prop="bjmc" min-width="200" label="班级"></el-table-column>
            <el-table-column
              sortable
              :sort-method="sortChange1"
              min-width="200"
              :label="lybradio?'校级榜主（次数）':('校级前' + (zsqbg|| '') + '（次数）')"
            >

            <template slot-scope="scope">
              <el-popover
              class="qxszshengluepopover"
              style=""
              trigger="hover"
              placement="left">
                  <p
                  :key="item.xh + 'a' + index"
                  v-for="(item, index) in scope.row.qxpmmxList">
                  {{item.yf + '月 ' + ' 第'+item.qxpm + '名'}}
                  </p>
                <div slot="reference" class="name-wrapper">
                  <el-tag
                  class="qxszshengluetag"
                  style=""
                  size="">
                <p>{{scope.row.qxpmCount}}</p>
                  </el-tag>
                </div>
              </el-popover>
            </template>
            </el-table-column>
            <el-table-column
              sortable
              min-width="200"
              :sort-method="sortChange2"
              :label="lybradio?'年级榜主（次数）':('年级前' + (zsqbg|| '') + '（次数）')"
            >
              <template slot-scope="scope">
              <el-popover
              class="qxszshengluepopover"
              style=""
              trigger="hover"
              placement="left">
                  <p
                  :key="item.xh + 'a' + index"
                  v-for="(item, index) in scope.row.njpmmxList">
                  {{item.yf + '月 ' + ' 第'+item.njpm + '名'}}
                  </p>
                <div slot="reference" class="name-wrapper">
                  <el-tag
                  class="qxszshengluetag"
                  style=""
                  size="">
                <p>{{scope.row.njpmCount}}</p>
                  </el-tag>
                </div>
              </el-popover>
            </template>

            </el-table-column>
            <el-table-column
              sortable
              min-width="200"
              :sort-method="sortChange3"
              :label="lybradio?'班级榜主（次数）':('班级前' + (zsqbg|| '') + '（次数）')"
            >

              <template slot-scope="scope">
              <el-popover
              class="qxszshengluepopover"
              style=""
              trigger="hover"
              placement="left">
                  <p
                  :key="item.xh + 'a' + index"
                  v-for="(item, index) in scope.row.bjpmmxList">
                  {{item.yf + '月 ' + ' 第'+item.bjpm + '名'}}
                  </p>
                <div slot="reference" class="name-wrapper">
                  <el-tag
                  class="qxszshengluetag"
                  style=""
                  size="">
                <p>{{scope.row.bjpmCount}}</p>
                  </el-tag>
                </div>
              </el-popover>
            </template>

            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          class="fakajilulx"
          v-for="item in kpmcList"
          :name="item.jlid"
          :key="item.jlid"
          :label="item.kpmc"
        >
          <el-table
            :data="tableData"
            :default-sort="{order: 'ascending'}"
            key="data"
            style="width: 100%"
          >
            <el-table-column prop="xh" label="学号" width="180"></el-table-column>
            <el-table-column prop="xm" label="姓名" width="180"></el-table-column>
            <el-table-column prop="njmc" label="年级" width="180"></el-table-column>
            <el-table-column prop="bjmc" min-width="200" label="班级"></el-table-column>
            <el-table-column
              sortable
              :sort-method="sortChange1"
              min-width="200"
              :label="lybradio?'校级榜主（次数）':('校级前' + (zsqbg|| '') + '（次数）')"
            >

            <template slot-scope="scope">
              <el-popover
              class="qxszshengluepopover"
              style=""
              trigger="hover"
              placement="left">
                  <p
                  :key="item.xh + 'a' + index"
                  v-for="(item, index) in scope.row.qxpmmxList">
                  {{item.yf + '月 ' + ' 第'+item.qxpm + '名'}}
                  </p>
                <div slot="reference" class="name-wrapper">
                  <el-tag
                  class="qxszshengluetag"
                  style=""
                  size="">
                <p>{{scope.row.qxpmCount}}</p>
                  </el-tag>
                </div>
              </el-popover>
            </template>
            </el-table-column>
            <el-table-column
              sortable
              min-width="200"
              :sort-method="sortChange2"
              :label="lybradio?('年级榜主（次数）'):('年级前' + (zsqbg|| '') + '（次数）')"
            >
              <template slot-scope="scope">
              <el-popover
              class="qxszshengluepopover"
              style=""
              trigger="hover"
              placement="left">
                  <p
                  :key="item.xh + 'a' + index"
                  v-for="(item, index) in scope.row.njpmmxList">
                  {{item.yf + '月 ' + ' 第'+item.njpm + '名'}}
                  </p>
                <div slot="reference" class="name-wrapper">
                  <el-tag
                  class="qxszshengluetag"
                  style=""
                  size="">
                <p>{{scope.row.njpmCount}}</p>
                  </el-tag>
                </div>
              </el-popover>
            </template>

            </el-table-column>
            <el-table-column
              sortable
              min-width="200"
              :sort-method="sortChange3"
              :label="lybradio?('班级榜主（次数）'):('班级前' + (zsqbg|| '') + '（次数）')"
            >

              <template slot-scope="scope">
              <el-popover
              class="qxszshengluepopover"
              style=""
              trigger="hover"
              placement="left">
                  <p
                  :key="item.xh + 'a' + index"
                  v-for="(item, index) in scope.row.bjpmmxList">
                  {{item.yf + '月 ' + ' 第'+item.bjpm + '名'}}
                  </p>
                <div slot="reference" class="name-wrapper">
                  <el-tag
                  class="qxszshengluetag"
                  style=""
                  size="">
                <p>{{scope.row.bjpmCount}}</p>
                  </el-tag>
                </div>
              </el-popover>
            </template>

            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="block" style="margin-top: 32px;margin-bottom:100px;">
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
  </div>
</template>

<script>
import MyTransition from '@/views/components/mtransition';
import { getToken } from 'utils/auth';
import {
  allxn,
  allxq,
  dqxnxq,
  allnj,
  tjpm,
  fkkpxx,
  sbtjlist,
  exportsbtj,
  lybzsgz,
  xnxqcardinformations,
  lybsave
} from '@/api/projectapp/incentiveCard/';

export default {
  name: 'detail',
  components: {
    MyTransition
  },
  data() {
    return {
      xq: [], // 学期
      xn: [], // 学年
      allnjArr: [], // 年级
      bjArr: [], // 班级
      searchradionjdm: [], // 年级集合
      searchkplxlist: [], // 班级集合
      activeName: 'all', // 默认
      tjpm: '', // 统计排名
      lxmc: '', // 类型名称
      page: 1, // 页数
      limit: 10, // 条数
      total: 0,
      lybradio: '', // 琅琊榜展示设置
      cardTitle: '', // 卡片标题
      kpmcList: [], // 卡片名称数组
      zsq: '', // 展示前几人
      zsqbg: '', // 展示前几人表格中展示
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
      xnoptions: [
        {
          value: '选项1',
          label: '2018-2019'
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
      xqoptions: [
        {
          value: '选项1',
          label: '上学期'
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
      srcurl:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548222999433&di=2ac9e035387de64090fe7aa8e3c904a8&imgtype=0&src=http%3A%2F%2Fimg15.3lian.com%2F2015%2Ff1%2F140%2Fd%2F40.jpg',
      // srcurl: '',
      dynamicTags: [], // tags值
      dialogVisible: false,
      moreset: false,
      radioxn: '',
      radioxq: '',
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
      tableData: [
      //   {
      //     date: '一级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄'
      //   },
      //   {
      //     date: '二级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1517 弄'
      //   },
      //   {
      //     date: '三级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1519 弄'
      //   },
      //   {
      //     date: '四级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1516 弄'
      //   },
      //   {
      //     date: '一级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄'
      //   },
      //   {
      //     date: '二级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1517 弄'
      //   },
      //   {
      //     date: '三级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1519 弄'
      //   },
      //   {
      //     date: '四级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1516 弄'
      //   },
      //   {
      //     date: '一级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄'
      //   },
      //   {
      //     date: '二级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1517 弄'
      //   }
      ],
      xxdm: '' // 学校代码
    };
  },
  computed: {},
  mounted() {
    this.allnjArr = [];
    this.xxdm = localStorage.getItem('xxdm');
    this.getdqxnxq();
    this.getxn();
    this.getxq();
    this.tjpm = '统计排名';
    this.lxmc = '全部类型';
    this.cardTitle = '全部类型上榜统计表';
    this.lybradio = null;
    // this.getlybzsgz()
  },
  methods: {
    /**
     * @description: 获取当前学期学年
     * @param {type}
     * @return:
     */
    async getdqxnxq() {
      await dqxnxq({ xxdm: this.xxdm }).then(r => {
        if (r.status === 200) {
          this.radioxn = r.data.xn;
          this.radioxq = r.data.xq;
          this.getallnjbj()
          this.getxnxqcardinformations();
          this.getlybzsgz();
        } else {
          this.$message({
            type: 'error',
            message: r.message
          });
        }
      });
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
     * @description: 搜索
     * @param {type}
     * @return:
     */
    search() {
      this.page = 1
      this.getlybzsgz();
      this.getxnxqcardinformations();
    },

    /**
     * @description: 琅琊榜规则确认
     * @param {type}
     * @return:
     */
    async changelybradio(val) {
      // if (val) {
      // }

      await this.lybyes();
    },

    /**
     * @description:获取所有年级
     * @param {type}
     * @return:
     */
    async getallnj() {
      const that = this;
      await allnj({
        xxdm: this.xxdm
      }).then(res => {
        that.allnjArr = res;
      });
    },

    // 获取年级
    getradio(val) {
      this.allnjArr.forEach(item => {
        if (item.njdm === val) {
          this.bjArr = item.bjList;
        }
      });
    },

    proving1() {
      // eslint-disable-next-line no-useless-escape
      this.zsq = this.zsq.replace(/[^\.\d]/g, '');
      this.zsq = this.zsq.replace('.', '');
    },

    /**
     * @description:获取所有年级班级
     * @param {type}
     * @return:
     */
    async getallnjbj() {
      await fkkpxx({
        xxdm: this.xxdm,
        xndm: this.radioxn
      }).then(r => {
        if (r.status === 200) {
          this.bjArr = [];
          this.allnjArr = r.data;
          const arr = r.data;
          arr.forEach(item => {
            if (item.bjList && item.bjList.length > 0) {
              const bjList = item.bjList;
              for (let i = 0; i < bjList.length; i++) {
                this.bjArr.push(bjList[i]);
              }
            }
          });
        } else {
          this.$message({
            type: 'error',
            message: r.message
          });
        }
      });
    },

    /**
     * @description: 琅琊榜规则确认
     * @param {type}
     * @return:
     */
    async lybyes() {
      this.activeName = 'all';
      if (!this.lybradio && this.zsq > 30) {
        this.$message({
          type: 'warning',
          message: '提示:数量过大不能超过30人!'
        });
        return;
      }

      if (!this.lybradio && this.zsq < 2) {
        this.$message({
          type: 'warning',
          message: '提示:数量不能低于2人!'
        });
        return;
      }

      if (!this.lybradio) {
        this.zsqbg = this.zsq;
      }

      if (this.lybradio) {
        this.zsqbg = 1;
      }

      let value;
      if (!this.lybradio) {
        value = this.zsq;
        this.tjpm = '统计排名';
        this.lxmc = '全部类型';
        this.cardTitle = '全部类型上榜统计表';
      } else {
        value = this.lybradio;
        this.tjpm = '统计榜主';
        this.lxmc = '总榜主';
        this.cardTitle = '总榜主上榜统计表';
      }

      await lybsave({
        zspm: value,
        xxdm: this.xxdm
      }).then(r => {
        if (r.status === 200) {
          this.getxnxqcardinformations();

          let zspm;
          if (!this.lybradio) {
            zspm = this.zsq;
          }
          if (this.lybradio) {
            zspm = 1;
          }
          this.getsbtjlist('all', zspm);
        }
      });
    },

    /**
     * @description: 获取查询卡片信息
     * @param {type}
     * @return:
     */
    async getxnxqcardinformations() {
      await xnxqcardinformations({
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm
      }).then(r => {
        this.kpmcList = r;
      });
    },

    /**
     * @description: 获取数据进行排序
     * @param {type}
     * @return:
     */
    sortChange1(a, b) {
      return a.qxpmCount - b.qxpmCount; // 获取数据进行排序
    },

    /**
     * @description: 导出获卡记录
     * @param {type}
     * @return:
     */
    async exportExcel() {
      let zsq;
      if (this.lybradio == '1') {
        zsq = 1
      } else {
        zsq = this.zsq
      }
      await exportsbtj({
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm,
        kplx: this.activeName,
        zspm: zsq
      }).then(res => {
        // 创建数据流
        const excelBlob = new Blob([res], {
          type: 'application/vnd.ms-excel;charset=utf-8'
        });

        // 创建下载元素
        const oA = document.createElement('a');

        // 利用URL.createObjectURL()方法为a元素生成blob URL
        oA.href = URL.createObjectURL(excelBlob);

        // 给文件命名
        oA.download = '上榜统计.xlsx';
        document.body.appendChild(oA);

        // 创建事件
        const evt = document.createEvent('MouseEvents');
        // 创建兼容
        evt.initEvent('click', false, false);
        oA.dispatchEvent(evt);

        // 移除下载元素
        document.body.removeChild(oA);

        // 释放链接
        URL.revokeObjectURL(oA);
      });
    },

    /**
     * @description: 班级触发事件
     * @param {type}
     * @return:
     */
    checkboxchange(value) {
      this.dynamicTags = [];
      this.searchradionjdm.forEach((item, index) => {
        this.allnjArr.forEach(itema => {
          const obj = {};
          if (itema.njdm == item) {
            obj.id = itema.njdm;
            obj.name = itema.njmc;
            this.dynamicTags.push(obj);
          }
        });
      });
      value.forEach((item, index) => {
        this.bjArr.forEach(itema => {
          const obj = {};
          if (itema.uuid == item) {
            obj.id = itema.uuid;
            obj.name = itema.bj;
            this.dynamicTags.push(obj);
          }
        });
      });
    },

    /**
     * @description: 年级触发事件
     * @param {type}
     * @return:
     */
    searchGetradio(value) {
      this.dynamicTags = [];
      this.searchkplxlist.forEach((item, index) => {
        this.bjArr.forEach(itema => {
          const obj = {};
          if (itema.uuid == item) {
            obj.id = itema.uuid;
            obj.name = itema.bj;
            this.dynamicTags.push(obj);
          }
        });
      });
      value.forEach((item, index) => {
        this.allnjArr.forEach(itema => {
          const obj = {};
          if (itema.njdm == item) {
            obj.id = itema.njdm;
            obj.name = itema.njmc;
            this.dynamicTags.push(obj);
          }
        });
      });
    },

    /**
     * @description: 获取数据进行排序
     * @param {type}
     * @return:
     */
    sortChange2(a, b) {
      return a.njpmCount - b.njpmCount; // 获取数据进行排序
    },

    /**
     * @description: 获取数据进行排序
     * @param {type}
     * @return:
     */
    sortChange3(a, b) {
      return a.bjpmCount - b.bjpmCount; // 获取数据进行排序
    },



    /**
     * @description: Tab标签事件
     * @param {type}
     * @return:
     */
    async tabClick(tab) {
      let zspm;
      this.cardTitle = `${tab.label}上榜统计表` || '全部类型上榜统计表';

      if (!this.lybradio) {
        zspm = this.zsq;
        this.zsqbg = this.zsq;
      }
      if (this.lybradio) {
        zspm = 1;
        this.zsqbg = 1;
      }

      await this.getsbtjlist(tab.name, zspm);
    },

    /**
     * @description: 去重
     * @param {type}
     * @return:
     */
    removeRepeatArrElement(arr) {
      const newArray = arr.sort();
      const newArr = [];
      const len = newArray.length;
      for (let i = 0; i < len; i++) {
        if (newArray[i] != newArray[i + 1]) {
          newArr.push(newArray[i]);
        }
      }
      return newArr
    },

    /**
     * @description: 上榜统计列表
     * @param {type}
     * @return:
     */
    async getsbtjlist(value, zspm) {
      //  // 年级
      //  // 班级
      let tempArr;
      let arr;
      arr = []
      tempArr = this.searchradionjdm.concat();
      tempArr.forEach((itema, indexa) => {
        this.allnjArr.forEach(itemb => {
          if (itemb.njdm === itema) {
            if (itemb.bjList.length > 0) {
              itemb.bjList.forEach(itemc => {
                this.searchkplxlist.forEach((itemd, indexd) => {
                  if (itemd === itemc.uuid) {
                    arr.push(itema)
                    // tempArr.splice(indexa, 1)
                    // return
                  }
                })
              })
            }
          }
        })
      })


      const arr3 = this.removeRepeatArrElement(arr)
      arr3.forEach((itema, index) => {
        tempArr.forEach((itemb, idnexb) => {
          if (itemb === itema) {
            tempArr.splice(idnexb, 1)
          }
        })
      })
      //
      // console.log(tempArr);
      // console.log(this.searchkplxlist);
      // return
      //
      const that = this;
      await sbtjlist({
        kplx: value || 'all',
        query: { page: that.page, limit: that.limit },
        searchName: this.searchinput,
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm,
        zspm,
        njdmArr: tempArr,
        bjdmArr: this.searchkplxlist
      }).then(r => {
        this.getxnxqcardinformations();

        this.tableData = r.data.rows;

        if (!this.lybradio) {
          this.zsqbg = this.zsq
        }
        if (this.tableData.length === 0) {
          if (this.lybradio) {
            this.tjpm = '统计榜主'
          } else {
            this.tjpm = '统计排名'
          }
        } else {
          if (this.lybradio) {
            this.tjpm = '重新统计榜主'
          } else {
            this.tjpm = '重新统计排名'
          }
        }
        this.total = r.data.total;
      });
    },

    /**
     * @description: 查询激励卡琅琊榜展示规则
     * @param {type}
     * @return:
     */
    async getlybzsgz() {
      await lybzsgz({
        xxdm: this.xxdm
      }).then(r => {
        if (r.status === 200 && !r.data) {
          this.zsq = '10';
          this.lybradio = null;
        }
        if (r.status !== 200) {
          this.$message({
            type: 'warning',
            message: r.message
          });
        }
        if (r.data) {
          if (r.data.zspm == 1) {
            this.lybradio = 1;
            this.zsqbg = 1;
            this.lxmc = '总榜主';
            this.tjpm = '统计榜主';
            this.cardTitle = '总榜主上榜统计表';
            this.zsq = '10';
          }
          if (r.data.zspm > 1) {
            this.zsq = r.data.zspm;
            this.lybradio = null;
          }

          let zspm;
          if (!this.lybradio) {
            zspm = this.zsq;
          }
          if (this.lybradio) {
            zspm = 1;
          }
          this.getsbtjlist(this.activeName, zspm);
        }
      });
    },

    /**
     * @description: 统计排名
     * @param {type}
     * @return:
     */
    async gettjpm() {
      if (!this.lybradio && this.zsq > 30) {
        this.$message({
          type: 'warning',
          message: '提示:数量过大不能超过30人!'
        });
        return;
      }

      if (!this.lybradio && this.zsq < 2) {
        this.$message({
          type: 'warning',
          message: '提示:数量不能低于2人!'
        });
        return;
      }

      this.activeName = 'all';
      if (this.tjpm === '统计排名') {
        this.tjpm = '重新统计排名';
        this.cardTitle = '全部类型上榜统计表';
      }
      if (this.tjpm === '重新统计排名') {
        this.tjpm = '重新统计排名';
        this.cardTitle = '全部类型上榜统计表';
      }
      if (this.tjpm === '统计榜主') {
        this.tjpm = '重新统计榜主';
        this.cardTitle = '总榜主上榜统计表';
      }
      if (this.tjpm === '重新统计榜主') {
        this.tjpm = '重新统计榜主';
        this.cardTitle = '总榜主上榜统计表';
      }
      await tjpm({
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm
      }).then(r => {
        if (r.status === 200) {
          this.$message({
            type: 'success',
            message: '统计成功!'
          });

          let zspm;
          if (!this.lybradio) {
            zspm = this.zsq;
          }
          if (this.lybradio) {
            zspm = 1;
          }
          this.getsbtjlist('all', zspm);
        }
      });
    },

    // 批量设置持卡数量确定了
    plszckslyes() {},
    // 批量设置持卡数量确定了
    szckslyes() {},
    // 设置持卡数量确定了
    szcksdialogyes() {},
    // 增减改变
    clickchange(index) {
      this.inputindex = index;
    },
    // 卡片数量初始值处理函数
    async kpmcnumhand(val) {
      await setTimeout(() => this.inputnumber[this.inputindex].num = val, 50);
      this.inputnumber.forEach((num, index) => {
        //  ...
      });
    },
    // 批量设置持卡数
    plszks() {
      this.$router.push({
        path: '/incentiveCard/cardMaintenanceAdd',
        query: { bsf: 'xz' }
      });
    },
    // 获取教师家长
    getradio(val) {},
    // 获取设置持卡数时间选择
    getszcksSzlxradio(val) {
      const that = this;
      const a = val;
      function setValue(val) {
        that.szcksszlx = val;
      }
      switch (a) {
        case '1': {
          setValue('1');
          break;
        }
        case '2': {
          setValue('3');
          break;
        }
        default:
          break;
      }
    },
    // 短信通知设置
    dxtzsz() {
      this.$router.push({
        path: '/incentiveCard/cardMaintenanceAdd',
        query: { bsf: 'xz' }
      });
    },
    // 发卡记录详情
    fkjl(index, row) {
      // 发卡记录详情
      this.$router.push({
        path: '/incentiveCard/sendCardxq'
      });
    },
    // 设置持卡数
    szcks(index, row) {
      this.szcksdialog = true;
      this.szcksszlx = this.plszckslradio = '1';
    },
    handleClose(tag) {
      const dynamicTags = this.dynamicTags;
      const searchradionjdm = this.searchradionjdm;
      const searchkplxlist = this.searchkplxlist;
      dynamicTags.forEach((item, tagindex) => {
        if (item.id === tag.id) {
          this.dynamicTags.splice(tagindex, 1);
          searchradionjdm.forEach((itemb, indexb) => {
            if (itemb == tag.id) {
              this.searchradionjdm.splice(indexb, 1);
              return;
            }
          });

          searchkplxlist.forEach((itemb, indexb) => {
            if (itemb == tag.id) {
              this.searchkplxlist.splice(indexb, 1);
              return;
            }
          });
        }
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getxnxqcardinformations();

      let zspm;
      if (!this.lybradio) {
        zspm = this.zsq;
      }
      if (this.lybradio) {
        zspm = 1;
      }
      this.getsbtjlist(this.activeName, zspm);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getxnxqcardinformations();

      let zspm;
      if (!this.lybradio) {
        zspm = this.zsq;
      }
      if (this.lybradio) {
        zspm = 1;
      }
      this.getsbtjlist(this.activeName, zspm);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../commonsty/common";

.cardMaintenance-sbtj {
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
  }
}
</style>
<style>
.cardMaintenance-sbtj .el-collapse-item__header {
  padding: 18px 41px !important;
  line-height: 14px;
  font-size: 14px;
  color: #909399;
  margin: 0 !important;
}
.cardMaintenance-sbtj .fakajilulx {
  border-top: 1px solid #ebeef5;
}

.cardMaintenance-sbtj .el-collapse-item__content div {
  padding: 5px 41px !important;
  line-height: 14px;
  font-size: 14px;
  color: #909399;
  margin: 0 !important;
}

.cardMaintenance-sbtj .el-collapse-item__arrow {
  line-height: 14px !important;
}

.cardMaintenance-sbtj .el-table td,
.cardMaintenance-sbtj .el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
  padding: 18px 36px;
  font-size: 14px;
}

.cardMaintenance-sbtj .bigimg img {
  width: 160px;
  height: 72px;
  border-radius: 2px;
}

.cardMaintenance-sbtj .lookBigPic {
  display: none;
  line-height: 14px !important;
}

.cardMaintenance-sbtj .el-dialog {
  width: 740px;
  margin-top: 10% !important;
}

.cardMaintenance-sbtj .bigimg:hover .lookBigPic {
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

.cardMaintenance-sbtj .el-tag + .el-tag {
  margin-left: 10px;
}

.cardMaintenance-sbtj .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.cardMaintenance-sbtj .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.cardMaintenance-sbtj .el-dialog {
  width: 461px !important;
}

.cardMaintenance-sbtj .xnselect {
  width: 130px !important;
  margin: 0 10px 32px 0;
}

.cardMaintenance-sbtj .xqselect {
  width: 120px !important;
}

.cardMaintenance-sbtj .kplxcheck .el-checkbox {
  margin-right: 30px !important;
}

.cardMaintenance-sbtj .szcksldialog .el-dialog {
  width: 600px !important;
}

.cardMaintenance-sbtj .szcksldialog .el-radio-group {
  padding-top: 6px !important;
}

.cardMaintenance-sbtj .kplxcheck .el-checkbox + .el-checkbox {
  margin-left: 0 !important;
}

.cardMaintenance-sbtj .el-date-editor .el-range-separator {
  width: 20px !important;
}

.cardMaintenance-sbtj .el-tabs--border-card > .el-tabs__content {
  padding: 15px 0 !important;
  border-top: 1px solid #ebeef5;
}

.cardMaintenance-sbtj .szcksdialog .el-dialog {
  width: 800px !important;
}

.cardMaintenance-sbtj .szcksdialog .el-radio-group {
  padding-top: 6px !important;
}
.cardMaintenance-sbtj .dxnrp {
  padding: 2px 10px;
  line-height: 35px;
  color: #606266;
  background-color: #f5f7fa;
  text-indent: 2em;
}

.cardMaintenance-sbtj .dxnr {
  display: inline-block;
  margin-bottom: 3px;
  color: #303133;
}

.cardMaintenance-sbtj .fsdxtitle {
  display: inline-block;
  width: 100px;
  margin-right: 16px;
  color: #303133;
}
.cardMaintenance-sbtj .el-table td,
.cardMaintenance-sbtj .el-table th.is-leaf {
  padding: 10px 5px !important;
}

.cardMaintenance-sbtj .el-input-number {
  width: 145px !important;
}

.cardMaintenance-sbtj .changea {
  margin: -6px 0 0 15px !important;
}
.cardMaintenance-sbtj .bottomstyl {
  height: 40px;
  line-height: 40px;
  padding-left: 16px;
  background-color: #fdf6ec;
  border-radius: 4px;
  font-size: 14px;
  color: #e6a23c;
}
.cardMaintenance-sbtj .el-tabs--border-card {
  overflow: hidden;
}

.cardMaintenance-sbtj .kpsjdivcard {
  margin: 20px 0 !important;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0px;
  margin-left: 24px !important;
  color: #909399;
}
.cardMaintenance-sbtj .pcoloryellow {
  padding-left: 16px;
  height: 40px;
  line-height: 40px;
  background-color: #fdf6ec;
  font-size: 14px;
  color: #e6a23c;
}
</style>
<style>
.cardMaintenance-sbtj .el-checkbox + .el-checkbox,
.cardMaintenance-sbtj .el-checkbox {
  margin-right: 30px !important;
  margin-left: 0px !important;
}
.cardMaintenance-sbtj .kpsjdiv .el-tag{
  background-color: white !important;
  border: none !important;
}
.cardMaintenance-sbtj .qxszshengluepopover{
  max-width:200px;
}
</style>
