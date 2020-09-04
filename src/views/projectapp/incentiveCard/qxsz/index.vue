<template>
  <div class="cardMaintenance__qxsz">
    <div class="wrapper">
      <div>
        <span style="margin-right: 16px">查询条件</span>
        <el-input
          style="width: 472px;margin-right: 22px;"
          v-model="searchName"
          placeholder="请输入职工号、姓名或者所在部门搜索"
        >
          <el-button 
            @click="search"
           slot="append" 
           icon="el-icon-search"></el-button>
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
          <div style="margin-top: 32px; overflow:hidden;">
            <span style="float:left; margin-right: 50px">性别</span>
            <el-checkbox-group style="float: left; width: auto;" v-model="checkListxb">
              <el-checkbox label="1">男</el-checkbox>
              <el-checkbox label="2">女</el-checkbox>
            </el-checkbox-group>
          </div>
          
          <div style="margin-top: 32px; overflow:hidden;">
            <span style="float:left; margin-right: 20px">权限等级</span>
            <el-checkbox-group style="float: left; width: auto;" v-model="qxdjarr">
              <el-checkbox label="1">全校学生</el-checkbox>
              <el-checkbox label="0">指定班级</el-checkbox>
            </el-checkbox-group>
          </div>

          <!-- <div style="margin-top: 32px;">
            <div v-if="searchqxdj === '2'" style="margin-bottom: 6px;">
              <span class="fsdxtitle">选择年级</span>
              <el-radio-group v-model="searchradionjdm" @change="searchGetradio">
                <el-radio-button
                  v-for="itemraido in allnjArr"
                  :key="itemraido.njdm"
                  :label="itemraido.njdm"
                >{{itemraido.njmc}}</el-radio-button>
              </el-radio-group>
            </div>
            <div v-if="searchqxdj === '2'" class="kplxtitlaedaaiv">
              <span class="fsdxtitlea">选择班级</span>
              <el-checkbox-group 
              class="kplxcheckaa" 
              @change="checkboxchange" v-model="searchkplxlist">
                <el-checkbox 
                v-for="item in bjArr" 
                :key="item.uuid" 
                :label="item.uuid">{{item.bj}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div> -->

        </div>
      </my-transition>

      <!-- <div style="margin-top: 60px;">
        <span style="margin-right: 16px">已选条件</span>
        <el-tag
          style="margin-right: 8px;"
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
      </div> -->
    </div>

    <!-- <p class="pcoloryellow">请先导出Excel表格，填写后导入！</p> -->
    <div style="margin-bottom: 24px;">
      <el-button type="primary" @click="yddsq">移动端模块授权</el-button>
      <!-- <el-button @click="szcksl=!szcksl" type="primary">导出</el-button>
      <el-button @click="szcksl=!szcksl" type="primary">导入</el-button>-->
    </div>

    <div class="kpsjdiv">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="zgh" label="职工号" width="180"></el-table-column>
        <el-table-column prop="xm" label="姓名" width="180"></el-table-column>
        <el-table-column label="性别" width="180">
          <template slot-scope="scope">{{scope.row.xbm == 1? '男': '女'}}</template>
        </el-table-column>
        <el-table-column prop="bmmc" min-width="200" label="所在部门"></el-table-column>
        <el-table-column min-width="200" label="权限等级">
          <template slot-scope="scope">{{scope.row.qxdj == 1? '全校': '指定班级'}}</template>
        </el-table-column>
        <el-table-column min-width="200" max-width="200" label="权限范围">
          <template slot-scope="scope">
            <div style="overflow:hidden;">
              {{scope.row.qxdj == 1? '全校': ''}}
            <el-popover 
            class="qxszshengluepopover"
            style=""
            v-if="scope.row.qxdj==0"
            trigger="hover" 
            placement="left">
              <p>{{scope.row.bjmcs}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag 
                class="qxszshengluetag"
                style=""
                size="">{{ scope.row.bjmcs }}</el-tag>
              </div>
            </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button size="medium" type="primary" @click="szqxfw(scope.row, scope.$index)">设置权限范围</el-button>
            <!-- Todo Btn -> 设置权限范围 -->
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
    <!--移动端模块授权-->
    <el-dialog width="25%" top="10vh" title="移动端模块授权" :visible.sync="plszcksl">
      <div>
        <el-radio-group v-model="plszckslradio" @change="getradio">
          <el-radio-button label="1">教师端</el-radio-button>
          <el-radio-button label="2">学生端</el-radio-button>
        </el-radio-group>
        <div style="position: relative">
          <!--<span class="kplxtitle">卡片类型</span>-->
          <div class="kplxtitlediv">
            <p v-if="nokplx" style="color: #606266;margin-top: 20px;">暂无模块</p>
            <div v-else style="margin-top:15px;">
              <el-checkbox-group v-if="plszckslradio==1" class="kplxcheck" v-model="lskplxlist">
                <el-checkbox
                  v-for="lsitem in kplx.ls"
                  :key="lsitem.id"
                  :label="lsitem.id"
                >{{lsitem.name}}</el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-if="plszckslradio==2" class="kplxcheck" v-model="xskplxlist">
                <el-checkbox
                  v-for="xsitem in kplx.xs"
                  :key="xsitem.id"
                  :label="xsitem.id"
                >{{xsitem.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="plszcksl = false">取 消</el-button>
        <el-button type="primary" @click="plszckslyes">确 定</el-button>
      </span>
    </el-dialog>

    <!-- Todo:TP -> 设置权限范围 -->
    <!--设置权限范围-->
    <el-dialog class="szcksldialog" width="25%" title="设置权限范围" :visible.sync="szcksl">
      <div>
        <div style="margin-bottom: 6px;">
          <span class="fsdxtitle">权限等级</span>
          <el-radio-group v-model="qxdj">
            <el-radio label="1">全校学生</el-radio>
            <el-radio label="0">指定班级</el-radio>
          </el-radio-group>
        </div>
        <div v-if="qxdj === '0'" style="margin-bottom: 6px;">
          <span class="fsdxtitle">选择年级</span>
          <el-radio-group v-model="plszckslradionjdm" @change="getradio">
            <el-radio-button
              v-for="itemraido in allnjArr"
              :key="itemraido.njdm"
              :label="itemraido.njdm"
            >{{itemraido.njmc}}</el-radio-button>
          </el-radio-group>
        </div>
        <div v-show="qxdj === '0'" class="kplxtitlaedaaiv">
          <!--<p v-if="nokplx" style="color: #606266;margin-top: 20px;">暂无模块</p>-->
          <span class="fsdxtitlea">选择班级</span>
          <el-checkbox-group 
          class="kplxcheckaa" 
          @change="checkboxchange" v-model="kplxlist">
            <el-checkbox 
            v-for="item in bjArr" 
            :key="item.uuid" 
            :label="item.uuid">{{item.bj}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="szcksl = false">取 消</el-button>
        <el-button type="primary" @click="szckslyes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import MyTransition from '@/views/components/mtransition'
import {
  allxn,
  allxq,
  dqxnxq,
  findcardlist,
  xnxqcardinformations,
  copycard,
  yszqxsjlb,
  fkqxlb,
  yddqxsz,
  allnj,
  fkkpxx,
  xnnjlist,
  xnbjlist,
  szqxjk
} from '@/api/projectapp/incentiveCard/';

  export default {
    name: 'detail',
    components: {
      MyTransition
    },
    data() {
      return {
        dqxn: '', // 当年学年
        dqxq: '', // 当年学期
        dqxqmc: '', // 当年学期名称
        searchName: '', // 搜索关键字
        xb: '', // 性别
        checkListxb: [], // 性别集合
        searchqxdj: '', // 权限等级
        qxdjarr: [], // 权限等级集合
        allnjArr: [], // 年级
        bjArr: [], // 班级
        zgh: '', // 职工号
        page: 1, // 页数
        limit: 10, // 条数
        total: 0,
        xxdm: '', // 学校代码
        kplx: { // 卡片类型
          ls: [
            {
              type: 1,
              name: '发卡',
              id: 'jlk001'
            },
            {
              type: 1,
              name: '琅琊榜',
              id: 'jlk002'
            },
            {
              type: 1,
              name: '动态',
              id: 'jlk003'
            },
            {
              type: 1,
              name: '设置',
              id: 'jlk004'
            }],
          xs: [
            {
              type: 2,
              name: '发卡',
              id: 'jlk005'
            },
            {
              type: 2,
              name: '获卡',
              id: 'jlk006'
            },
            {
              type: 2,
              name: '琅琊榜',
              id: 'jlk007'
            },
            {
              type: 2,
              name: '动态',
              id: 'jlk008'
            }
          ]
        }, // 卡片类型数组
        mksq: [], // 移动端模块授权
        kpmcnum: 1, // 卡片数量初始值
        nokplx: false, // 没有卡片类型
        month: '', // 月份
        qxdj: '1', // 权限等级
        kplxlist: [], // 卡片类型
        lskplxlist: [], // 老师卡片类型
        xskplxlist: [], // 学生卡片类型
        searchinput: '', // 搜索字段
        fzkp: false, // 复制卡片弹层
        radiotime: '1', // 查询时间
        plszcksl: false, // 批量设置持卡数量弹层
        szcksdialog: false, // 设置持卡数弹层
        szcksszlx: '1', // 设置持卡数设置类型
        searchradionjdm: '', // 搜索的年级代码
        searchkplxlist: [], // 搜索卡片类型
        inputindex: '', // 增减值
        szcksl: false, // 设置持卡数量弹层
        szcksSzlx: false, // 设置持卡数设置类型显示
        plszckslradio: '1', // 批量设置持卡数量 单选
        selectxq: '', // 请选择学年
        selectxn: '', // 请选择学期
        value6: '', // 发卡时间
        fzz: '2018-2019 下学期', // 当前学年学期
        plszckslradionjdm: '', // 年级代码
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
        tableData: [] // 表格列表
        // tableData: [{
        //   date: '一级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '二级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1517 弄'
        // }, {
        //   date: '三级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1519 弄'
        // }, {
        //   date: '四级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1516 弄'
        // }, {
        //   date: '一级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '二级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1517 弄'
        // }, {
        //   date: '三级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1519 弄'
        // }, {
        //   date: '四级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1516 弄'
        // }, {
        //   date: '一级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '二级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1517 弄'
        // }]
      }
    },
    computed: {},
    mounted() {
      this.qxdj = 1
      this.kplxlist = []
      this.searchkplxlist = []
      this.allnjArr = []
      this.searchradionjdm = ''
      this.xxdm = localStorage.getItem('xxdm')
      this.getdqxnxq()
      this.getallnjbj()
      // this.getyddqxsz()
    },
    methods: {
      checkboxchange(val) {
  
      },

      /**
       * @description: 搜索
       * @param {type}
       * @return:
       */
      async search() {
        let xb;
        let searchqxdj;
        if (this.checkListxb.length === 2 || this.checkListxb.length === 0) {
          xb = ''
        } else {
          xb = this.checkListxb[0]
        }

  
        if (this.qxdjarr.length === 2 || this.qxdjarr.length === 0) {
          searchqxdj = ''
        } else {
          searchqxdj = this.qxdjarr[0]
        }

        const that = this
        await fkqxlb({
          searchName: this.searchName,
          query: {
            page: 1,
            limit: that.limit
          },
          qxdj: searchqxdj, // 1:全校；0：指定班级
          xbm: xb, // 1:男；2：女
          xndm: this.dqxn,
          xxdm: this.xxdm
        }).then(res => {
          if (res.status === 200) {
            that.tableData = res.data.rows
            that.total = res.data.total
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        });
      },

      /**
       * @description: 设置权限范围
       * @param {type}
       * @return:
       */
      szqxfw(r, i) {
        this.zgh = ''
        this.bjArr = []
        this.zgh = r.zgh
        this.kplxlist = []

        this.qxdj = r.qxdj
        this.plszckslradio = ''
        this.plszckslradionjdm = []
  
        if (r.bjdmList && r.bjdmList.length) {
          this.plszckslradionjdm = this.allnjArr[0].njdm
          this.getradio(this.allnjArr[0].njdm)
          this.kplxlist = r.bjdmList
        }
  
        this.szcksl = true
      },

      /**
       * @description: 设置权限接口
       * @param {type}
       * @return:
       */
      async getszqxjk(a, b) {
        await szqxjk({
          qxdj: a,
          bjdmArr: b,
          xndm: this.dqxn,
          xxdm: this.xxdm,
          zgh: this.zgh
        })
          .then(r => {
            if (r.status === 200) {
              this.$message({
                type: 'success',
                message: '设置成功!'
              });
            } else {
              this.$message({
                type: 'error',
                message: r.message
              });
            }
            this.szcksl = false
          })
      },

      /**
       * @description:获取已设置权限数据列表
       * @param {type}
       * @return:
       */
      async getyszqxsjlb() {
        const that = this
        await yszqxsjlb({
          xxdm: this.xxdm
        }).then(res => {
          that.lskplxlist = []
          that.xskplxlist = []
          if (res.status === 200) {
            const mksq = res.data
            if (mksq.length > 0) {
              mksq.forEach(item => {
                if (item.ydgnlx === '1') {
                  that.lskplxlist.push(item.ydgndm)
                } else {
                  that.xskplxlist.push(item.ydgndm)
                }
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        });
      },

      /**
       * @description:获取所有年级
       * @param {type}
       * @return:
       */
      async getallnj() {
        const that = this
        await allnj({
          xxdm: this.xxdm
        }).then(res => {
          that.allnjArr = res
        });
      },

      /**
       * @description:获取所有年级班级
       * @param {type}
       * @return:
       */
      async getallnjbj() {
        await fkkpxx({
          xxdm: this.xxdm,
          xndm: '2018-2019'
        })
        .then(r => {
          if (r.status === 200) {
            this.allnjArr = r.data
          } else {
            this.$message({
              type: 'error',
              message: r.message
            });
          }
        })
      },

    /**
     * @description:移动端模块授权
     * @param {type}
     * @return:
     */
      yddsq() {
        this.plszcksl = !this.plszcksl;
        this.plszckslradio = '1'

        this.lskplxlist = []
        this.xskplxlist = []
  
        this.getyszqxsjlb()
      },

    /**
     * @description: 获取当前学期学年
     * @param {type}
     * @return:
     */
      async getdqxnxq() {
        await dqxnxq({ xxdm: this.xxdm }).then(res => {
          this.dqxn = res.data.xn;
          this.dqxq = res.data.xq
          this.dqxqmc = res.data.xqmc
          this.getfkqxlb()
        });
      },

      /**
       * @description:发卡权限列表接口
       * @param {type}
       * @return:
       */
      async getfkqxlb() {
        let xb;
        let searchqxdj;
        if (this.checkListxb.length === 2 || this.checkListxb.length === 0) {
          xb = ''
        } else {
          xb = this.checkListxb[0]
        }

  
        if (this.qxdjarr.length === 2 || this.qxdjarr.length === 0) {
          searchqxdj = ''
        } else {
          searchqxdj = this.qxdjarr[0]
        }

        const that = this
        await fkqxlb({
          searchName: this.searchName,
          query: {
            page: that.page,
            limit: that.limit
          },
          qxdj: searchqxdj, // 1:全校；0：指定班级
          xbm: xb, // 1:男；2：女
          xndm: this.dqxn,
          xxdm: this.xxdm
        }).then(res => {
          if (res.status === 200) {
            that.tableData = res.data.rows
            that.total = res.data.total
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        });
      },
  
      /**
       * @description:移动端权限设置
       * @param {type}
       * @return:
       */
      async getyddqxsz() {
        await yddqxsz({
          xxdm: this.xxdm,
          ydgndmArr: [...this.xskplxlist, ...this.lskplxlist]
        }).then(res => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
            this.plszcksl = false
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        });
      },

      /**
       * @description: 批量设置持卡数量确定了
       * @param {type}
       * @return:
       */
      async plszckslyes() {
        await this.getyddqxsz()
      },

      /**
       * @description: 设置权限范围确定了
       * @param {type}
       * @return:
       */
      async szckslyes() {
        if (this.qxdj === '1') {
          await this.getszqxjk(this.qxdj)
          this.szcksl = false
        }
        if (this.qxdj === '0') {
          const plszckslradionjdm = this.plszckslradionjdm
          const kplxlist = this.kplxlist
          if (!plszckslradionjdm.length || !kplxlist.length) {
            this.$message({
              type: 'warning',
              message: ' 提示：请至少选择一个年级及其班级 !'
            });
            return
          }
          await this.getszqxjk(this.qxdj, this.kplxlist)
        }
        this.getfkqxlb()
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
      // 获取年级
      getradio(val) {
        this.allnjArr.forEach(item => {
          if (item.njdm === val) {
            this.bjArr = item.bjList
          }
        })
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
        this.$router.push({
          path: '/incentiveCard/sendCardxq'
        })
      },
  
      // 搜索获取年级
      searchGetradio(val) {
        this.allnjArr.forEach(item => {
          if (item.njdm === val) {
            this.bjArr = item.bjList
          }
        })
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
        this.getfkqxlb()
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getfkqxlb()
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../commonsty/common";

.cardMaintenance__qxsz {
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
.cardMaintenance__qxsz .el-collapse-item__header {
  padding: 18px 41px !important;
  line-height: 14px;
  font-size: 14px;
  color: #909399;
  margin: 0 !important;
}
.cardMaintenance__qxsz .fakajilulx {
  border-top: 1px solid #ebeef5;
}

.cardMaintenance__qxsz .el-collapse-item__content div {
  padding: 5px 41px !important;
  line-height: 14px;
  font-size: 14px;
  color: #909399;
  margin: 0 !important;
}

.cardMaintenance__qxsz .el-collapse-item__arrow {
  line-height: 14px !important;
}

.cardMaintenance__qxsz .el-table td,
.cardMaintenance__qxsz .el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
  padding: 18px 36px;
  font-size: 14px;
}

.cardMaintenance__qxsz .bigimg img {
  width: 160px;
  height: 72px;
  border-radius: 2px;
}

.cardMaintenance__qxsz .lookBigPic {
  display: none;
  line-height: 14px !important;
}

.cardMaintenance__qxsz .el-dialog {
  width: 740px;
  margin-top: 10% !important;
}

.cardMaintenance__qxsz .bigimg:hover .lookBigPic {
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

.cardMaintenance__qxsz .el-tag + .el-tag {
  margin-left: 10px;
}

.cardMaintenance__qxsz .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.cardMaintenance__qxsz .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.cardMaintenance__qxsz .el-dialog {
  width: 461px !important;
}

.cardMaintenance__qxsz .xnselect {
  width: 130px !important;
  margin: 0 10px 32px 0;
}

.cardMaintenance__qxsz .xqselect {
  width: 120px !important;
}

.cardMaintenance__qxsz .kplxcheck .el-checkbox {
  margin-right: 30px !important;
}

.cardMaintenance__qxsz .szcksldialog .el-dialog {
  width: 600px !important;
}

.cardMaintenance__qxsz .szcksldialog .el-radio-group {
  padding-top: 6px !important;
}

.cardMaintenance__qxsz .kplxcheck .el-checkbox + .el-checkbox {
  margin-left: 0 !important;
}

.cardMaintenance__qxsz .el-date-editor .el-range-separator {
  width: 20px !important;
}

.cardMaintenance__qxsz .el-tabs--border-card > .el-tabs__content {
  padding: 15px 0 !important;
  border-top: 1px solid #ebeef5;
}

.cardMaintenance__qxsz .szcksdialog .el-dialog {
  width: 800px !important;
}

.cardMaintenance__qxsz .szcksdialog .el-radio-group {
  padding-top: 6px !important;
}
.qxszshengluepopover{
  max-width:200px;
}
.qxszshengluetag{
  width: 160px;
  overflow:hidden;
  text-overflow:ellipsis;
}
.cardMaintenance__qxsz .dxnrp {
  padding: 2px 10px;
  line-height: 35px;
  color: #606266;
  background-color: #f5f7fa;
  text-indent: 2em;
}

.cardMaintenance__qxsz .dxnr {
  display: inline-block;
  margin-bottom: 3px;
  color: #303133;
}

.cardMaintenance__qxsz .fsdxtitle {
  display: inline-block;
  width: 60px;
  margin-right: 16px;
  color: #303133;
}
.cardMaintenance__qxsz .el-table td,
.cardMaintenance__qxsz .el-table th.is-leaf {
  padding: 10px 5px !important;
}

.cardMaintenance__qxsz .el-input-number {
  width: 145px !important;
}

.cardMaintenance__qxsz .changea {
  margin: -6px 0 0 15px !important;
}
.cardMaintenance__qxsz .bottomstyl {
  height: 40px;
  line-height: 40px;
  padding-left: 16px;
  background-color: #fdf6ec;
  border-radius: 4px;
  font-size: 14px;
  color: #e6a23c;
}
.cardMaintenance__qxsz .el-tabs--border-card {
  height: 733px;
  overflow: hidden;
}

.cardMaintenance__qxsz .kpsjdivcard {
  margin: 20px 0 !important;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0px;
  margin-left: 24px !important;
  color: #909399;
}
.pcoloryellow {
  padding-left: 16px;
  height: 40px;
  line-height: 40px;
  background-color: #fdf6ec;
  font-size: 14px;
  color: #e6a23c;
  margin-bottom: 20px;
}
.cardMaintenance__qxsz .xqselect {
  width: 120px !important;
}

.cardMaintenance__qxsz .kplxcheckaa .el-checkbox {
  margin-right: 30px !important;
}
.cardMaintenance__qxsz .kplxcheckaa {
  margin-top: 20px;
}
.cardMaintenance__qxsz .kplxcheckaa .el-checkbox + .el-checkbox {
  margin-left: 0 !important;
}

.cardMaintenance__qxsz .fsdxtitlea {
  margin-right: 16px;
  position: absolute;
  top: 0;
}

.cardMaintenance__qxsz .kplxcheckaa {
  margin-left: 77px;
}
.cardMaintenance__qxsz .kplxtitlaedaaiv {
  position: relative;
}
</style>
