<template>
  <div class="cardMaintenance-sendcard">
    <div class="wrapper">
      <div>
        <span style="margin-right: 16px">查询条件</span>
        <el-input
        style="width: 472px;margin-right: 22px;"
        v-model="searchinput"
        placeholder="请输入职工号或者姓名搜索">
          <el-button
          slot="append"
          @click="clickSearch"
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
          <div style="margin-top: 32px;">
            <span style="margin-right: 16px">发卡时间 </span>
            <el-radio v-model="radiotime" @change="changeVal" label="1">按月份查询</el-radio>
            <el-radio v-model="radiotime" @change="changeVal" label="2">按日期查询</el-radio>
          </div>
          <div v-if="radiotime==='1'" style="margin-top: 32px;">
            <span style="margin-right: 45px">发卡月份 </span>
            <el-radio-group v-model="month">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button :label="1">1月</el-radio-button>
              <el-radio-button :label="2">2月</el-radio-button>
              <el-radio-button :label="3">3月</el-radio-button>
              <el-radio-button :label="4">4月</el-radio-button>
              <el-radio-button :label="5">5月</el-radio-button>
              <el-radio-button :label="6">6月</el-radio-button>
              <el-radio-button :label="7">7月</el-radio-button>
              <el-radio-button :label="8">8月</el-radio-button>
              <el-radio-button :label="9">9月</el-radio-button>
              <el-radio-button :label="10">10月</el-radio-button>
              <el-radio-button :label="11">11月</el-radio-button>
              <el-radio-button :label="12">12月</el-radio-button>
            </el-radio-group>
          </div>
          <div v-if="radiotime==='2'" style="margin-top: 32px;">
            <span style="margin-right: 16px">发卡日期</span>
            <el-date-picker
              class="fksj"
              value-format="yyyy-MM-dd"
              v-model="fksj"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      </my-transition>

      <div style="margin-top: 32px;" v-if="dynamicTags.length>0">
        <span style="margin-right: 16px">已选条件</span>
        <el-tag
          style="margin-right: 8px;"
          :key="tag.id + 'a' + index"
          v-for="(tag, index) in dynamicTags"
          :closable="!tag.dis"
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag.name}}</el-tag>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <el-button type="primary" @click="plszcksfunction">批量设置持卡数</el-button>
      <el-button @click="dxtzsz" type="primary">短信通知设置</el-button>
    </div>

    <div class="kpsjdiv">
      <el-tabs
        v-model="activeName"
        @tab-click="tabClick"
        type="border-card">
        <p class="kpsjdivcard">{{
          cardTitle}}</p>
        <el-tab-pane
          name=''
          class="fakajilulx"
          label="全部类型">
          <el-table
            :data="tableData"
            :default-sort="{order: 'ascending'}"
            key="dataa"
            style="width: 100%">
            <el-table-column
              prop="gh"
              label="职工号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="xm"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="xb"
              label="性别"
              width="180">
            </el-table-column>
            <el-table-column
              prop="szbm"
              min-width="200"
              label="所在部门">
            </el-table-column>
            <el-table-column
              sortable
              :sort-method="sortChange1"
              prop="fkzs"
              min-width="200"
              :label="kplx">
            </el-table-column>
            <el-table-column label="操作"
                             min-width="380">
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  type="primary"
                  @click="fkjl(scope.$index, scope.row)">发卡记录详情
                </el-button>
                <el-button
                  size="medium"
                  type="primary"
                  @click="szcks(scope.$index, scope.row)">设置持卡数
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          class="fakajilulx"
          v-for="item in kpmcList"
          :name="item.jlid"
          :key="item.jlid"
          :label="item.kpmc">
          <el-table
            :default-sort="{order: 'ascending'}"
            key="datab"
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="gh"
              label="职工号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="xm"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="xb"
              label="性别"
              width="180">
            </el-table-column>
            <el-table-column
              prop="szbm"
              min-width="200"
              label="所在部门">
            </el-table-column>
            <el-table-column
              sortable
              :sort-method="sortChange2"
              prop="fkzs"
              min-width="200"
              :label="kplx">
            </el-table-column>
            <el-table-column label="操作"
                             min-width="380">
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  type="primary"
                  @click="fkjl(scope.$index, scope.row)">发卡记录详情
                </el-button>
                <el-button
                  size="medium"
                  type="primary"
                  @click="szcks(scope.$index, scope.row)">设置持卡数
                </el-button>
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
        :total="total">
      </el-pagination>
    </div>
    <!--批量设置持卡数量-->
    <el-dialog width="25%" top="10vh" title="批量设置持卡数量" :visible.sync="plszcksl">
      <div>
        <el-radio-group v-model="jzjsplszcksl" @change="getradio">
          <el-radio-button label="1">教师</el-radio-button>
          <el-radio-button label="2">家长</el-radio-button>
        </el-radio-group>
        <div style="border-radius: 3px;border: solid 1px #eaedf4;margin-top: 16px;">
          <el-row>
            <el-col style="text-align: center;padding: 17px 0;" :span="12">
              <span>卡片类型</span>
            </el-col>
            <el-col style="text-align: center;padding: 17px 0;" :span="12">
              <span v-if="jzjsplszcksl==1">教师持卡数量</span>
              <span v-if="jzjsplszcksl==2">家长持卡数量</span>
            </el-col>
          </el-row>
          <div style="height: 240px;overflow-y: auto;">
            <el-row v-for="(item, index) in inputnumber" :key="item.kpmc + index">
              <el-col style="text-align: center;padding: 17px 0;" :span="12">
                <span>{{item.kpmc}}</span>
              </el-col>
              <el-col style="text-align: center;padding: 7px 0;" :span="12">
                <el-input-number v-model="item.sl"
                  @change="kpmcnumhand"
                  :min="0"
                  :max="9999"
                  @click.native="clickchange(index)">
                </el-input-number>
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
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-bottom: 30px;">
        <span class="dxnr">短信内容</span>
        <div>
          <p class="dxnrp">ⅩⅩⅩ家长：您好！ 您的孩子因ⅩⅩⅩⅩⅩⅩ获得ⅩⅩⅩⅩ卡一张，请您加以表扬！</p>
        </div>
      </div>
      <div style="margin-bottom: 6px;">
        <span class="fsdxtitle">发动态短信通知</span>
        <el-radio-group v-model="fkdttz">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
      <div>
        <span class="dxnr">短信内容</span>
        <div>
          <p class="dxnrp">ⅩⅩⅩ家长：您好！ⅩⅩⅩ老师为您的孩子发布了一条动态，请及时查阅。

            ⅩⅩⅩ老师：您好！您的学生ⅩⅩⅩ发布了一条动态，请及时查阅。</p>
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
          <el-radio-group v-model="plszckslradio" @change="szcksszlxFunction">
            <el-radio-button label="3">按学期设置</el-radio-button>
            <el-radio-button label="1">按周设置</el-radio-button>
            <el-radio-button label="2">按月设置</el-radio-button>
          </el-radio-group>
        </div>
        <div v-show="plszckslradio!='3'" style="margin-bottom: 32px;">
          <span style="margin-right: 16px">设置类型</span>
          <el-radio-group
            @change="szlxfunction"
            v-model="szcksszlx">
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
            <el-col v-if="plszckslradio === '3'" style="text-align: center;padding: 17px 0;" :span="6">
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
            <el-row v-for="(item, index) in allnumber" :key="item.kpid">
              <el-col style="text-align: center;padding: 17px 0;" :span="6">
                <span>{{item.kpmc}}</span>
              </el-col>
              <el-col style="text-align: center;padding: 17px 0;" :span="6">
                <span>{{plszckslradio =='3'?item.fkzs:item.sl}}</span>
              </el-col>
              <el-col :style="{textAlign: 'center'}" :span="plszckslradio =='3'?12:12">
                <span v-if="plszckslradio !='3'">{{item.label}}</span>
                <el-input-number
                :key="'aitem' +  index"
                 v-if="plszckslradio =='3'"
                 v-model="item.sl"
                 @change="kpmcnumhand"
                 :min="0"
                 :max="9999"
                  @click.native="clickchange(index)"></el-input-number>

              </el-col>
              <el-col
                v-if="plszckslradio!='3'" style="text-align: center;padding: 7px 0;"      :span="6">
                <el-input-number
                  :key="'bitem' +  index"
                  v-if="plszckslradio =='3'"
                  v-model="item.num"
                  @change="kpmcnumhand"
                  :min="0"
                 :max="9999"
                  @click.native="clickchange(index)">
                </el-input-number>
                <el-input-number
                  :key="'citem' +  index"
                  v-if="plszckslradio != '3'&& (szcksszlx== '1' || szcksszlx== '3')"
                  v-model="item.czsl"
                  @change="kpmcnumhand"
                  :min="0"
                  :max="9999"
                  @click.native="clickchange(index)">
                </el-input-number>
                <el-input-number
                  :key="'ditem' +  index"
                  v-if="plszckslradio != '3'&& (szcksszlx== '2' || szcksszlx== '4')"
                  v-model="item.zjsl"
                  @change="kpmcnumhand"
                  :min="0"
                  :max="9999"
                  @click.native="clickchange(index)">
                </el-input-number>
              </el-col>
            </el-row>
          </div>
        </div>
        <p class="bottomstyl" v-if="plszckslradio=='1' && szcksszlx == '2'">说明：设置后，每周数量累积</p>
        <p class="bottomstyl" v-if="plszckslradio=='1' && szcksszlx == '1'">说明：设置后，每周数量重置</p>
        <p class="bottomstyl" v-if="plszckslradio=='2' && szcksszlx == '3'">说明：设置后，每月将重置数量</p>
        <p class="bottomstyl" v-if="plszckslradio=='2' && szcksszlx == '4'">说明：设置后，每月将增加数量</p>
        <p class="bottomstyl" v-if="plszckslradio=='3'">说  明：批量设置持卡数量</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="szcksdialog = false">取 消</el-button>
        <el-button type="primary" @click="szcksdialogyes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  allxn,
  allxq,
  dqxnxq,
  fkkpxx,
  cxkpsz,
  fkxnxqcardinformations,
  kpcks,
  plszcksave,
  bcduanxin,
  cxdx,
  glkpcksl,
  dlszck
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
      ckrlx: '', // 持卡人类型
      szlx: '', // 设置类型
      fksj: '', // 发卡时间
      page: 1, // 页数
      limit: 10, // 条数
      total: 0,
      dhkplx: '', // 单行卡片类型
      dhxh: '', // 单行学号
      xq: [], // 学期
      xn: [], // 学年
      ckr: '', // 持卡人
      kplxdm: '', // 卡片类型代码
      kplx: '发卡总量', // 卡片类型
      cardTitle: '激励卡发卡总记录表', // 卡名
      kpmcList: [], // 卡片名称数组
      xxdm: '', // 学校代码
      kpmcnum: 1, // 卡片数量初始值
      nokplx: false, // 没有卡片类型
      month: '', // 月份
      kplxlist: [], // 卡片类型数组
      searchinput: '', // 搜索字段
      fzkp: false, // 复制卡片弹层
      radiotime: '1', // 查询时间
      plszcksl: false, // 批量设置持卡数量弹层
      szcksdialog: false, // 设置持卡数弹层
      szcksszlx: '1', // 设置持卡数设置类型
      inputindex: '', // 增减值
      allnumber: [], // 弹窗各类型值
      szcksl: false, // 设置持卡数量弹层
      szcksSzlx: false, // 设置持卡数设置类型显示
      plszckslradio: '1', // 批量设置持卡数量 单选
      selectxq: '', // 请选择学年
      selectxn: '', // 请选择学期
      value6: '', // 发卡时间
      fzz: '2018-2019 下学期', // 当前学年学期
      jzjsplszcksl: '1', // 家长教师设置持卡
      fkdxtz: '', // 发卡短信通知
      fkdttz: '', // 发卡动态通知
      inputnumber: [
        // {
        //   label: '卡片1',
        //   num: 0
        // },
        // {
        //   label: '卡片2',
        //   num: 0
        // },
        // {
        //   label: '卡片3',
        //   num: 0
        // },
        // {
        //   label: '卡片4',
        //   num: 1
        // }
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
      dynamicTags: [], // 已选条件
      dialogVisible: false,
      moreset: false,
      activeName: '',
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
      // }
      ]
    }
  },
  computed: {},
  mounted() {
    this.kplxdm = ''
    const val = this.radiotime
    let timeobj;
    timeobj = {}
    timeobj.dis = true
    timeobj.id = 't' + val
    if (val === '1') {
      this.fksj = []
      timeobj.name = '发卡月份'
    } else {
      this.month = ''
      timeobj.name = '发卡日期'
    }
    this.dynamicTags.push(timeobj);
    this.xxdm = localStorage.getItem('xxdm')
    this.getxq()
    this.getxn()
    this.getdqxnxq();
  },
  methods: {
    /**
     * @description: 发卡时间选择
     * @param {type}
     * @return:
     */
    changeVal(val) {
      this.dynamicTags = [];
      let timeobj;
      timeobj = {}
      timeobj.dis = true
      timeobj.id = 't' + val
      if (val === '1') {
        this.fksj = []
        timeobj.name = '发卡月份'
      } else {
        this.month = ''
        timeobj.name = '发卡日期'
      }
      this.dynamicTags.push(timeobj);
    },

    /**
     * @description: 设置类型
     * @param {type}
     * @return:
     */
    szlxfunction(val) {


    },

    /**
     * @description:独立设置持卡参数
     * @param {type}
     * @return:
     */
    async getdlszck(zqfw) {
      let szlx;
      if (this.szcksszlx === '1' || this.szcksszlx === '3') {
        szlx = 'czsl';
      }
      if (this.szcksszlx === '2' || this.szcksszlx === '4') {
        szlx = 'zjsl';
      }
      if (this.plszckslradio === '3') {
        szlx = '';
      }
      await dlszck({
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm,
        ckr: this.ckr,
        czr: localStorage.getItem('username'),
        kplxCkList: this.allnumber,
        zqfw,
        szlx
      })
        .then(r => {
          if (r.status === 200) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: r.message
            });
          }
          this.szcksdialog = false
        })
    },

    /**
     * @description:各类卡片持卡数量
     * @param {type}
     * @return:
     */
    async getglkpcksl(zqfw, ckr) {
      await glkpcksl({
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm,
        ckr,
        zqfw
      })
        .then(r => {
          // if (r.status === 200) {
          this.allnumber = r.dataList
          if (r.szlx === 'czsl' && this.plszckslradio[0] === '2') {
            this.szcksszlx = '3'
          }
          if (r.szlx === 'zjsl' && this.plszckslradio[0] === '2') {
            this.szcksszlx = '4'
          }

          if (r.szlx === 'czsl' && this.plszckslradio[0] === '1') {
            this.szcksszlx = '1'
          }
          if (r.szlx === 'zjsl' && this.plszckslradio[0] === '1') {
            this.szcksszlx = '2'
          }
          // } else {
          //   this.$message({
          //     type: 'error',
          //     message: r.message
          //   });
          // }
          this.plszcksl = false
        })
    },

    /**
     * @description:短信通知设置
     * @param {type}
     * @return:
     */
    dxtzsz() {
      this.szcksl = !this.szcksl

      this.getcxdx()
      // this.getbcduanxin()
    },

    /**
     * @description:批量设置持卡 保存
     * @param {type}
     * @return:
     */
    async getplszcksave(ckrlx) {
      await plszcksave({
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm,
        ckrlx,
        czr: localStorage.getItem('username'),
        kplxCkList: this.inputnumber
      })
        .then(r => {
          if (r.status === 200) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: r.message
            });
          }
          this.plszcksl = false
        })
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
     * @description: 获取当前学期学年
     * @param {type}
     * @return:
     */
    async getdqxnxq() {
      await dqxnxq({ xxdm: this.xxdm }).then(r => {
        if (r.status === 200) {
          this.radioxn = r.data.xn;
          this.radioxq = r.data.xq;
          this.getxnxqcardinformations()
          this.getcxdx()
          this.getfkkpxx()
          this.getcxkpsz()
          this.getkpcks('ls')
        } else {
          this.$message({
            type: 'error',
            message: r.message
          });
        }
      });
    },
    szcksszlxFunction(val) {
      let number;
      if (val == 1) {
        number = 0
      }

      if (val == 2) {
        number = 1
      }
      if (val == 3) {
        number = 2
      }
      this.getglkpcksl(number, this.ckr)
    },

    /**
     * @description: 短信  保存
     * @param {type}
     * @return:
     */
    async getcxdx() {
      await cxdx({
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm
      })
        .then(r => {
          this.fkdxtz = Number(r.tzjc)
          this.fkdttz = Number(r.dttz)
          // if (r.status === 200) {
          //
          // } else {
          //   this.$message({
          //     type: 'error',
          //     message: r.message
          //   });
          // }
        })
    },

    /**
     * @description: 短信  保存
     * @param {type}
     * @return:
     */
    async getbcduanxin() {
      await bcduanxin({
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm,
        tzjc: this.fkdxtz,
        dttz: this.fkdttz,
        dtdxjz: 'ⅩⅩⅩ家长：您好!ⅩⅩⅩ老师为您的孩子发布了一条动态，请及时查阅。',
        dtdxls: 'ⅩⅩⅩ老师：您好!您的学生ⅩⅩⅩ发布了一条动态，请及时查阅。',
        txnr: '1家长：您好! 您的孩子因2获得3卡一张，请您加以表扬！'
      })
        .then(r => {
          if (r.status === 200) {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
            this.getcxdx()
            this.szcksl = false
          } else {
            this.$message({
              type: 'error',
              message: r.message
            });
          }
        })
    },
    /**
     * @description:按xxdm,xndm,xqdm,ckrlx查询各类卡片持卡数量
     * @param {type}
     * @return:
     */
    plszcksfunction() {
      this.inputnumber = []
      this.getkpcks('ls')
      this.plszcksl = !this.plszcksl;
      this.jzjsplszcksl = '1'
    },

    /**
     * @description:查询各类卡片持卡数量
     * @param {type}
     * @return:
     */
    async  getkpcks(ckrlx) {
      await kpcks({
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm,
        ckrlx
      }).then(r => {
        // if (r.status === 200) {
        this.inputnumber = []
        this.inputnumber = r
        // } else {
        //   this.$message({
        //     type: 'error',
        //     message: r.message
        //   });
        // }
      })
    },

    /**
     * @description: 获取数据进行排序
     * @param {type}
     * @return:
     */
    sortChange1(a, b) {
      return a.fkzs - b.fkzs; // 获取数据进行排序
    },

    /**
     * @description: 获取数据进行排序
     * @param {type}
     * @return:
     */
    sortChange2(a, b) {
      return a.fkzs - b.fkzs; // 获取数据进行排序
    },

      /**
       * @description: 获取查询卡片信息
       * @param {type}
       * @return:
       */
    async getxnxqcardinformations() {
      await fkxnxqcardinformations({
        dqxn: this.radioxn,
        dqxq: this.radioxq,
        xxdm: this.xxdm
      })
        .then(r => {
          if (r.status === 200) {
            this.kpmcList = r.data
          } else {
            this.$message({
              type: 'error',
              message: r.message
            });
          }
        })
    },

    /**
     * @description: 搜索
     * @param {type}
     * @return:
     */
    async clickSearch() {
      this.page = 1
      this.getxnxqcardinformations()
      this.getcxdx()
      this.getfkkpxx()

      await cxkpsz({
        searchinput: this.searchinput,
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm,
        query: {
          page: this.page,
          limit: this.limit
        },
        kplx: this.kplxdm,
        yf: this.month,
        kssj: this.fksj && this.fksj.length > 0 ? this.fksj[0] : '',
        jssj: this.fksj && this.fksj.length > 0 ? this.fksj[1] : ''
      })
      .then(r => {
        this.tableData = r.data.rows
        this.total = r.data.total
      })

      this.getkpcks(this.ckrlx)
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
      this.cardTitle = `${tab.label}发卡记录表` || '激励卡发卡总记录表'
      await this.getcxkpsz(tab.name)
    },

    /**
     * @description: 根据学年学期，查询卡片信息
     * @param {type}
     * @return:
     */
    async getcxkpsz(kplx) {
      await cxkpsz({
        searchinput: this.searchinput,
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm,
        query: {
          page: this.page,
          limit: this.limit
        },
        kplx,
        yf: this.month,
        kssj: this.fksj && this.fksj.length > 0 ? this.fksj[0] : '',
        jssj: this.fksj && this.fksj.length > 0 ? this.fksj[1] : ''
      })
      .then(r => {
        this.tableData = r.data.rows
        this.total = r.data.total
      })
    },
    /**
     * @description: 根据学年学期，查询卡片信息
     * @param {type}
     * @return:
     */
    async getfkkpxx() {
      await fkkpxx({
        xndm: this.radioxn,
        xqdm: this.radioxq,
        xxdm: this.xxdm
      })
      .then(r => {


      })
    },
      // 批量设置持卡数量确定了
    plszckslyes() {
      if (this.jzjsplszcksl === '1') {
        this.getplszcksave('ls')
      }
      if (this.jzjsplszcksl === '2') {
        this.getplszcksave('jz')
      }
    },
      // 批量设置持卡数量确定了
    szckslyes() {
      this.getbcduanxin()
    },

    /**
     * @description: 设置持卡数量确定了
     * @param {type}
     * @return:
     */
    async szcksdialogyes() {
      if (this.plszckslradio === '3') {
        await this.getdlszck('2')
      }
      if (this.plszckslradio === '1') {
        await this.getdlszck('0')
      }
      if (this.plszckslradio === '2') {
        await this.getdlszck('1')
      }
    },
      // 增减改变
    clickchange(index) {
      this.inputindex = index
    },
      // 卡片数量初始值处理函数
    async kpmcnumhand(val) {
      await setTimeout(() => {
        if (this.inputnumber[this.inputindex].hasOwnProperty('num')) {
          this.inputnumber[this.inputindex].num = parseInt(val)
          this.$set(this.inputnumber[this.inputindex], 'num', parseInt(val))
          if (!val) {
            this.$set(this.inputnumber[this.inputindex], 'num', 0)
          }
        }
        if (this.inputnumber[this.inputindex].hasOwnProperty('sl')) {
          this.inputnumber[this.inputindex].sl = parseInt(val)
          this.$set(this.inputnumber[this.inputindex], 'sl', parseInt(val))
          if (!val) {
            this.$set(this.inputnumber[this.inputindex], 'sl', 0)
          }
        }

        // if (this.szcksdialog) {
        //   if (this.allnumber[this.inputindex].hasOwnProperty('num')) {
        //     this.allnumber[this.inputindex].num = parseInt(val)
        //     this.$set(this.allnumber[this.inputindex], 'num', parseInt(val))
        //     if (!val) {
        //       this.$set(this.allnumber[this.inputindex], 'num', 0)
        //     }
        //   }
        //   if (this.allnumber[this.inputindex].hasOwnProperty('sl')) {
        //     this.allnumber[this.inputindex].sl = parseInt(val)
        //     this.$set(this.allnumber[this.inputindex], 'sl', parseInt(val))
        //     if (!val) {
        //       this.$set(this.allnumber[this.inputindex], 'sl', 0)
        //     }
        //   }


        //   if (this.allnumber[this.inputindex].hasOwnProperty('czsl')) {
        //     this.allnumber[this.inputindex].num = parseInt(val)
        //     this.$set(this.allnumber[this.inputindex], 'czsl', parseInt(val))
        //     console.log(this.allnumber[this.inputindex]);
        //     if (!val) {
        //       this.$set(this.allnumber[this.inputindex], 'czsl', 0)
        //     }
        //   }
        //   if (this.allnumber[this.inputindex].hasOwnProperty('zjsl')) {
        //     this.allnumber[this.inputindex].sl = parseInt(val)
        //     this.$set(this.allnumber[this.inputindex], 'zjsl', parseInt(val))
        //     if (!val) {
        //       this.$set(this.allnumber[this.inputindex], 'zjsl', 0)
        //     }
        //   }
        // }
      }, 5)
      // this.inputnumber.forEach((num, index) => {
      //     //  ...
      // })
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
      if (val === '1') {
        this.ckrlx = 'ls'
        this.getkpcks('ls')
      }
      if (val === '2') {
        this.ckrlx = 'jz'
        this.getkpcks('jz')
      }
    },
      // 获取设置持卡数时间选择
    getszcksSzlxradio(val) {
      const that = this
      const a = val
      function setValue(val) {
        that.szcksszlx = val
      }
      switch (a) {
        case '1': {
          setValue('1');
          this.getglkpcksl('1', this.ckr)
          break }
        case '2': {
          setValue('2');
          this.getglkpcksl('2', this.ckr)
          break }
        default: break;
      }
    },

    /**
     * @description: 发卡记录详情
     * @param {type}
     * @return:
     */
    fkjl(index, row) {
        // 发卡记录详情
      this.$router.push({
        path: '/incentiveCard/sendCardxq',
        query: {
          ckr: row.gh,
          kplx: this.kplxdm,
          xn: this.radioxn,
          xq: this.radioxq,
          jsxm: row.xm
        }
      })
    },
      // 设置持卡数
    szcks(index, row) {
      this.ckr = row.gh
      this.szcksdialog = true
      this.szcksszlx = this.plszckslradio = '3'
      this.getglkpcksl('2', row.gh)
    },
    handleClose(tag) {
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getxnxqcardinformations()
      this.getcxdx()
      this.getfkkpxx()

      this.getcxkpsz(this.kplxdm)
      this.getkpcks(this.ckrlx)
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getxnxqcardinformations()
      this.getcxdx()
      this.getfkkpxx()

      this.getcxkpsz(this.kplxdm)
      this.getkpcks(this.ckrlx)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../commonsty/common";

  .cardMaintenance-sendcard {
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
  .cardMaintenance-sendcard .el-collapse-item__header {
    padding: 18px 41px !important;
    line-height: 14px;
    font-size: 14px;
    color: #909399;
    margin: 0 !important;
  }
  .cardMaintenance-sendcard .fakajilulx {
    border-top: 1px solid #ebeef5;
  }

  .cardMaintenance-sendcard .el-collapse-item__content div {
    padding: 5px 41px !important;
    line-height: 14px;
    font-size: 14px;
    color: #909399;
    margin: 0 !important;
  }

  .cardMaintenance-sendcard .el-collapse-item__arrow {
    line-height: 14px !important;
  }

  .cardMaintenance-sendcard .el-table td, .cardMaintenance-sendcard .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
    padding: 18px 36px;
    font-size: 14px;
  }

  .cardMaintenance-sendcard .bigimg img {
    width: 160px;
    height: 72px;
    border-radius: 2px;
  }

  .cardMaintenance-sendcard .lookBigPic {
    display: none;
    line-height: 14px !important;
  }

  .cardMaintenance-sendcard .el-dialog {
    width: 740px;
    margin-top: 10% !important;
  }

  .cardMaintenance-sendcard .bigimg:hover .lookBigPic {
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

  .cardMaintenance-sendcard .el-tag + .el-tag {
    margin-left: 10px;
  }

  .cardMaintenance-sendcard .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .cardMaintenance-sendcard .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .cardMaintenance-sendcard .el-dialog {
    width: 461px !important;
  }

  .cardMaintenance-sendcard .xnselect {
    width: 130px !important;
    margin: 0 10px 32px 0;
  }

  .cardMaintenance-sendcard .xqselect {
    width: 120px !important;
  }

  .cardMaintenance-sendcard .kplxcheck .el-checkbox {
    margin-right: 30px !important;
  }

  .cardMaintenance-sendcard .szcksldialog .el-dialog {
    width: 600px !important;
  }

  .cardMaintenance-sendcard .szcksldialog .el-radio-group {
    padding-top: 6px !important;
  }

  .cardMaintenance-sendcard .kplxcheck .el-checkbox + .el-checkbox {
    margin-left: 0 !important;
  }

  .cardMaintenance-sendcard .el-date-editor .el-range-separator {
    width: 20px !important;
  }

  .cardMaintenance-sendcard .el-tabs--border-card > .el-tabs__content {
    padding: 15px 0 !important;
    border-top: 1px solid #ebeef5;
  }

  .cardMaintenance-sendcard .szcksdialog .el-dialog {
    width: 800px !important;
  }

  .cardMaintenance-sendcard .szcksdialog .el-radio-group {
    padding-top: 6px !important;
  }
  .cardMaintenance-sendcard .dxnrp {
    padding: 2px 10px;
    line-height: 35px;
    color: #606266;
    background-color: #f5f7fa;
    text-indent: 2em;
  }

  .cardMaintenance-sendcard .dxnr {
    display: inline-block;
    margin-bottom: 3px;
    color: #303133;
  }

  .cardMaintenance-sendcard .fsdxtitle {
    display: inline-block;
    width: 100px;
    margin-right: 16px;
    color: #303133;
  }
  .cardMaintenance-sendcard .el-table td,
  .cardMaintenance-sendcard .el-table th.is-leaf{
    padding: 10px 5px !important;
  }

  .cardMaintenance-sendcard .el-input-number {
    width: 145px !important;
  }

  .cardMaintenance-sendcard .changea {
    margin: -6px 0 0 15px !important;
  }
  .cardMaintenance-sendcard .bottomstyl {
    height: 40px;
    line-height: 40px;
    padding-left: 16px;
    background-color: #fdf6ec;
    border-radius: 4px;
    font-size: 14px;
    color: #e6a23c;
  }
  .cardMaintenance-sendcard .el-tabs--border-card {
    overflow: hidden;
  }

  .cardMaintenance-sendcard .kpsjdivcard {
    margin: 20px 0!important;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0px;
    margin-left: 24px !important;
    color: #909399;
  }
</style>
