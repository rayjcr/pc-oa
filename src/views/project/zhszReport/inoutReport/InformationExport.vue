<!-- 信息导出 -->
<template>
  <div class="app-container calendar-list-container" style="float:left;">
    <div class="u_TableMain block ofhide noTransform" type="border-card">

      <div class="filter-container">
        <el-form ref="form" :model="form">
          <el-row>
              <el-form-item label="" style="min-width:600px;">
                <el-input v-model="studentN" placeholder="请输入内容" @blur="search" style="width: 150px;"></el-input>
                <el-button type="primary" @click.stop="Popup(bgdId)" :disabled="isable1">批量导出</el-button>
                <!-- <el-button type="primary" @click.stop="Output" :loading="isout" :disabled="isable2">导出</el-button> -->
                <!-- <el-button type="primary" @click.stop="popupReportInfo" :loading="reportInfoIsOut" >导出报告单信息</el-button> -->
                <!-- getPdfall -->
                <!-- <el-button type="primary" @click.stop="getPdf()">导出</el-button> -->

                <el-button type="primary" @click.stop="Output" :loading="isout" style="margin-left:0px;">生成报告单</el-button>
                <el-popover
                placement="right"
                width="600"
                trigger="click">
                    
                    <el-table class="bgdTable" :data="bgdTableData"  v-loading="bgdloading" stripe style="width: 100%">
                        <el-table-column prop="mc" label="名称" width="200">
                        </el-table-column>
                        <el-table-column prop="fqsj" label="生成时间" width="200">
                        </el-table-column>
                        <el-table-column prop="zt" label="状态">
                            <template slot-scope="scope">
                                <span v-html="ztStr(scope.row.zt)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <span><el-button @click="downLoadReport(scope.row)" type="primary" size="mini" v-if="scope.row.zt>=3" :disabled="scope.row.zt!=4">下载</el-button></span>
                                <span><el-button @click="cancelReport(scope.row)" size="mini" v-if="scope.row.zt<3">取消</el-button></span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="bgdPage"  background  layout="prev, pager, next"   :page-size='10' @current-change="handleCurrentChange" :current-page.sync="bgdPage" :total="bgdListTotal"></el-pagination>
                    <div style="line-height: 50px;">
                      <span>提示：报告单生成需要一点时间，请等待，如状态无更新，可点击【刷新】按钮哦~</span><el-button type="primary" @click="GetBgdList()" size="small">刷新</el-button>
                    </div>
                    <el-button type="primary" @click="GetBgdList" slot="reference">报告单列表</el-button>
                </el-popover>
                

              </el-form-item>
          </el-row>
        </el-form>
        
      </div>

      <div class="m_GenTableBox">
        <p class="tip"><span>注：</span>此页面用于班主任录入或导入【出勤记载】【奖惩记载】【班主任寄语】【附言】，其他数据在【学分项目】中录入或导入。</p>
        <div class="table-container" style="min-width:1200px;">
          <div class="content_left" :class="{'fix':isFix}">
            <!-- 班级，学生 -->
            <tree-comn v-for="(item, index) in datatree" :key="index" :dataSource="item" @checkdetail="checkdetail" @open="opentr" :treeOpen="treeOpen" :treeid="treeid"></tree-comn>
          </div>
          <!-- 表格信息beg -->
          <div v-loading='mbloading' class="content_right" id="pdfDom" ref="tablevew" style="border: 1px solid #eee;padding: 10px;position: relative;">
            
            <!-- 胜蓝报告单 -->
            <A02mb v-if="mbinfo.mbdm=='A02'" :bgdmc='bgdmc' :tableData='tableData' :listQuery='listQuery' :bdtxx='bdtxx' :reporttable='reporttable' :tydata='tydata' :qmurl='qmurl'></A02mb>
            
            <!-- 长青求知 -->
            <A03mb v-if="mbinfo.mbdm=='A03'" :bgdmc='bgdmc' :tableData='tableData' :listQuery='listQuery' :bdtxx='bdtxx' :reporttable='reporttable' :fy='A03bgdfy' :qmurl='qmurl'></A03mb>
            
            <!-- 胜利报告单 -->
            <div style="width: 100%;min-height: 300px;" v-if="mbinfo.mbdm=='A01'&&tableshow">
              <div style="padding: 5px 20px;float:left;"><p style="font-size: 18px; font-weight: 600;">{{bgdmc}}</p></div>
              <div style="padding: 5px 20px;float:right;font-size: 18px; font-weight: 500;"><span>班级</span><span style="width: 150px;margin-right: 20px; display: inline-block;border-bottom: 1px solid;padding: 2px 20px">{{bdtxx.bj}}</span><span>姓名</span><span style="width: 100px;display: inline-block;border-bottom: 1px solid;padding: 2px 20px">{{bdtxx.xm}}</span></div>
              <div style="display:block;float: left;">

              <div v-for="(item, findex) in tableData" v-if="findex%2==0">  
                <div class="tbcol">
                    <table-line class="table_box" :table-data="item" width='450px' v-for="(item, index) in tableData" :key="index" v-if="index>=findex&&index<findex+2"></table-line>
                </div>
              </div>
                <!-- <table-line class="table_box" :table-data="item" width='450px' v-for="(item, index) in tableData" :key="index"></table-line> -->
              </div>
              <div style="display:block;width: 100%;float:left;border: 1px solid #eee;padding: 20px 4px;margin-bottom: 10px;" v-if="rader || rader2 || chartData.length">
                <div style="display:block;width: 450px;float:left;margin-left:10px;position: relative;" v-if="rader || rader2">
                  <div style="position:absolute;z-index: 5;width: 200px;height: 50px; opacity: .4;transform:rotate(-45deg);top:32%;">
                    <img style="height:50px;margin: 50px" :src="syt" alt="" v-for="i in 5" :key="i">
                  </div>
                  <radar-chart :dataN="radarchartN" v-if="radarchartvalue.length" :dataV="radarchartvalue" :danwei="danwei1"></radar-chart>
                  <p  style="padding: 5px 10px;" v-if="radarchartvalue.length">注解：积分雷达图展示各个科目的积分。例如，语文共有5个评价项目，其中3个项目得5分，那么语文的积分率为60%</p>
                  <radar-chart :dataN="jfldN" v-if="jfldV.length" :dataV="jfldV" :danwei="danwei"></radar-chart>
                  <p  style="padding: 5px 10px;" v-if="jfldV.length">注解：得A率雷达图展示各个科目的得A率。例如，语文共有5个等级评价项目，其中3个项目得A，那么语文的得A率为60%</p>
                </div>
                <div style="display:block;width:450px;float: left;margin-left: 50px;" v-if="chartData.length">
                  <p style="padding: 4px 10px;font-size: 18px; font-weight: 600">身体素质曲线图</p>
                  <tiao-xing width='100%' height='400px' :chartData='chartData' :tixingdate="tixingdate" v-if="chartData.length"></tiao-xing>
                </div>
              </div>
              <div style="display:block;width: 100%;float:left;border: 1px solid #eee;padding: 20px 4px;margin-bottom: 10px;position: relative;">
                <div style="position:absolute;z-index: 5;width: 200px;height: 50px; opacity: .4;transform:rotate(-45deg);top:0%;">
                  <img style="height:50px;margin: 50px" :src="syt" alt="" v-for="i in 5" :key="i">
                </div>
                <input-table :isable="true" :formtable="formtable" :sjkz="sjkz"></input-table>
              </div>
              <div style="display:block;width: 100%;float:left;border: 1px solid #eee;padding: 20px 4px;margin-bottom: 10px;position: relative;">
                <div style="position:absolute;z-index: 5;width: 200px;height: 50px; opacity: .4;transform:rotate(-45deg);top:-5%;">
                  <img style="height:50px;margin: 50px" :src="syt" alt="" v-for="i in 5" :key="i">
                </div>
                <div style="width:45%;display: block;float:left;padding:0 10px 10px 10px;">
                  <main-table :pageData="pageData" v-if="sjkz.zp"></main-table>
                </div>
                <div style="width:54%;display: block;float:left;">
                  <show-table :totilData="reporttable"></show-table>
                  <p>注：此报告单盖学校教导处公章有效。</p>
                </div>
              </div>
            </div>
          </div>
          <!-- 表格信息end -->
        </div>
      </div>

    </div>

    <!--批量导出数据-->
    <el-dialog title="报告单批量导出" :visible.sync="dialogVisible" width="540px" class="import_box">

        <el-row style="margin-bottom:10px;">
            <el-col :span="6" class="colLineTit">执行班级：</el-col>
            <el-col :span="18">
                <el-select v-model="BatchoutSelClass" size="small"  placeholder="请选择">
                    <el-option v-for="(item,index) in datatree" :key="item.bjdm" :label="item.bjmc" :value="item.bjdm"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" type="primary" @click="getPdfall">确 定</el-button>
            <el-button size="medium" @click="handlecancell">取 消</el-button>
        </div>
    </el-dialog>

    <!-- <el-dialog
      title="批量导出数据"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose" class="batOutData">

      <div class="batOutTit">请选择导出的班级</div>
      <el-checkbox :indeterminate="isIndeterminateClass" v-model="checkAllClass" @change="handleCheckClassAllChange">全选</el-checkbox>
      <div>
        <el-checkbox-group v-model="checkedClass" @change="handleCheckedClassChange">
          <el-checkbox style="margin:10px;" v-for="(item, index) in datatree" :label="item.bjdm" :key="index" :value="item">{{item.bjmc}}</el-checkbox>
        </el-checkbox-group>
      </div> -->


      <!-- <span>哈哈哈哈哈哈哈啊哈哈</span> -->
      <!-- <div class="batOutTit">请选择导出模块</div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox style="margin:10px;" v-for="(city, index) in cities" :label="city.px" :key="index">{{city.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlecancell">取 消</el-button>
        <el-button type="primary" @click="getPdfall" :loading="isdownload" :disabled="isable1">确 定</el-button> -->
        <!-- dialogVisible = false -->
      <!-- </span>
    </el-dialog> -->

    
    <!--批量导出数据-->
    <el-dialog title="报告单信息批量导出" :visible.sync="reportInfoDialogVisible" width="540px" class="import_box">

        <el-row style="margin-bottom:10px;">
            <el-col :span="6" class="colLineTit">执行班级：</el-col>
            <el-col :span="18">
                <el-select v-model="reportInfoSelClass" size="small"  placeholder="请选择">
                    <el-option v-for="(item,index) in datatree" :key="item.bjdm" :label="item.bjmc" :value="item.bjdm"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" type="primary" @click="confirmOutputReportInfo">确 定</el-button>
            <el-button size="medium" @click="cancelOutputReportInfo">取 消</el-button>
        </div>
    </el-dialog>

    <!-- <div id="tableinfo" ref="hhh"></div> -->
  </div>
</template>
<script>
import TableLine from '../Statistics/TableLine' // 项目表格
import RadarChart from './RadarChart' // 雷达图
import { getToken } from '../../../../utils/auth'
import TreeComn from './TreeComn' // 侧边学生组件
import TiaoXing from './TiaoXing' // 柱状图
import InputTable from '../Statistics/InputTable' // 教师寄语附言录入表格
import MainTable from './MainTable' // 总评表格
import ShowTable from './ShowTable' // 教师寄语表格
import A02mb from './A02mb' //A02模板
import A03mb from './A03mb' //A02模板
import {
    school_page,
    getXn,
    getXq,
    getNj,
    getXk,
    dqxnxqObj,
    getBj,
    GetCredit,
    Getreportstatistics,
    ImportTemplateDownload,
    Getstastick,
    Savereport,
    Getjurisdiction,
    Getallbjxslist,
    ExportBgdxx,
    ExportBgdxxs,
    GetreportsetInfo,
    GetDictionary,
    DownloadExcelStudentBgdxx
} from 'api/project/creditInquiry/index'
import stastic from '@/api/jcsj'
import {GetReportTemplate} from 'api/project/report/index'
import _ from 'lodash'
import * as detailPapi from 'api/project/report/index'
// const cityOptions = ;
export default {
  components: {
    TableLine,TreeComn,
    RadarChart,TiaoXing,
    InputTable, MainTable,
    ShowTable, A02mb,
    A03mb
  },
  data () {
    return {
      // checkAll: false,
      // checkedCities: ['上海', '北京'],
      // cities: ['上海', '北京', '广州', '深圳'],
      // isIndeterminate: true,
      bgdszstr: '', // 报告单设置下载模块字符串暂存
      // outputClass
      cityOptions: [],

      checkAll: false,
      checkAllClass:false,
      checkedCities: [],
      checkedClass: [],
      cities: [],
      isIndeterminate: true,
      isIndeterminateClass:true,

      dialogVisible: false, // 弹窗控制
      isout: false, // 导出按钮加载效果控制
      chartData:[

      ],
      importXSFormVisible: false, // 弹层控制
      importLoading: false, // 加载
      fileList: [], // 文件列表
      datas: {
        Xxdm: '',
        BgdId: '',
        Njdm: '',
        Bjdm: ''
      },
      bdtxx: { // 表单头信息
        bj: '',
        xm: ''
      },
      dataw: {},
      isSuccess: '', // 提示文字
      tableData: [
      ], // 表格数据
      tableheader: { //表头数据
        tableheader:[
          {label: '评价项目', sz: 1},{label:'评价分项', sz: 1},{label: '评价等级', sz: 1},{label: '班级整体', sz: 1}
        ]
      },
      curriculumIndex: 0, // 课程列表下标
      schoolyearlist: [],// 学年列表
      semesterlist: [], // 学期列表
      gradelist: [], // 年级列表
      classlist: [], // 班级列表
      curriculumlist: [], // 课程列表
      searchInfo: '', // 搜索信息
      classidArr: [], // 班级id列表

      form: {},
      bgdId: JSON.parse(window.localStorage.getItem('bgdsj')).uuid, // 报告单编号
      bgdxx: JSON.parse(window.localStorage.getItem('bgdsj')),
      njbj:{
        njdm: '',
        bjdm: ''
      }, // 年级班级代码
      bjmc: {},
      listQuery:{ // 基础信息
        xxdm: window.localStorage.getItem('xxdm'),
        xn: '',
        xq: '',
        njdm: '',
        xm: '',
        pageSize: 100,
        pageIndex: 1,
        total: 20,
      },
      // state4: '',
      timeout:  null,
      datatree: JSON.parse(window.localStorage.getItem('newclasslist')),
      defaultProps: {
        children: 'students',
        label: 'xm'
      },
      spanArr: [],
      position: 0,
      downloads: false, // 下载按钮加载动画判定
      radarchartN: [], // 雷达图课程名称及最大值
      radarchartvalue: [], // 雷达图主要数据
      jfldN: [], // 积分雷达名称及最大值
      jfldV: [], // 积分雷达数据
      pageData: [], // 总评表格数据
      reporttable: [
        {name: '出勤记录', ycq: '', sj: '', bj: '', kk: '', cdzt: '', lx: 3},//   sj事假 bj病假 kk旷课 cdzt迟到早退
        {name:'奖惩记录', jcjl: '', lx: 4},
        {name:'班主任寄语', bzrjy: '', lx: 5},
        {name:'附言', fy: '', lx: 6},
        {name:'签名', zsbzrqm: '',zsxzqm: '',zsjwzrqm: '', lx: 16},//班主任 校长 教务主任签名
      ],
      formtable: {
        // uuid: '', // （修改必填）
        bgdid: '', // 报告单id（必填）
        xh: '', // 学号（必填）
        xm: '', // 姓名（必填）
        bjid: '', // 班级代码（必填）
        bjmc: '', // 班级名称（必填）
        ycqts: 0, // 应出勤天数
        sjts: 0, // 事假数
        bjts: 0, // 病假数
        kks: 0, // 旷课数
        cdzts: 0, // 迟到早退数
        sg: 0, // 身高
        tz: 0, // 体重
        zysl: 0, // 左眼视力
        yysl: 0, // 右眼视力
        jcjz: '', // 奖惩记录
        bzrjy: '', // 班主任寄语
        fy: '' // 附言
      }, // 奖惩记录健康数据出勤记录等信息表
      istrue: true, // 判定条件
      studentcode: '', // 学号暂存
      rader: false, // 
      rader2: false, // 
      tableshow: false,
      tixingdate: [], // 柱状图日期
      danwei: '', // 雷达图单位
      danwei1: '',
      treeOpen: false, // 是否打开班级
      treeid: '', // 班级是否打开依据
      sftj: false, // 提交状态
      xndm: JSON.parse(window.localStorage.getItem('bgdsj')).xn, // 学年代码
      xxdm: JSON.parse(window.localStorage.getItem('bgdsj')).xxdm, // 学校代码
      zgh: '', // 职工号
      studentN: '', // 学生姓名
      username: window.localStorage.getItem('username'), // 用户账号 （zgh = username去掉学校代码部分的字符串）
      studentlist: [], // 学生列表
      sousuo: '', // 是否为搜索数据
      studentL: 0, // 班级学生长度
      syt: '', // 水印图
      bgdmc: '', // 报告单名称
      divwidth: 0, // 水印图层宽
      divheight: 0, // 水印图层高
      gly: false, // 是否为管理员
      Bjdm: '', // 导出用班级代码
      Njdm: '', // 导出用年级代码
      Bjmc: '', //导出用班级名称
      Xh: '', // 导出用学号
      isbj: false, // 是否点击班级
      xsxm: '', //学生姓名
      isdownload:false,
      isable1: false,
      isable2: false,
      studentisok: false, // 是否可以点击学生了
      // restaurants: [],
      // timeout:  null
      sjkz: { // 显隐控制
        cq: false,
        jc: false,
        bzrjy: false,
        fy: false,
        js: false,
        zp: false,
      },
      reportModular:null, // 报告单模块数据列表 
      kclist:[], // 全部课程
      tt:null,
      bzrjyheight: 0,//班主任寄语高度
      shryheight: 0,//所获荣誉高度
      allrowspan:0,//右边那一块占的行数
      mbinfo:{},//获取到的模板信息
      tydata:{},//体育与保健信息（右侧）
      qmurl: [],//签名列表
      mbloading: false,//切换学生时加载模板
      A03bgdfy:'',
      reportInfoIsOut:false, //导出报告单信息按钮
      reportInfoDialogVisible:false, //显示导出报告单信息窗口
      reportInfoSelClass:null, //导出报告单信息选择的班级
      bgdloading:false,
      bgdTableData:[],
      bgdPage:1,                      //报告单列表显示页码
      bgdListTotalPages:0,
      bgdListTotal:0,      
      BatchoutSelClass:[],            // 导出执行的班级
      isFix:false,                            //学生列表置顶的标识
    }
  },
  computed: {
    headers () {
      return {
        Authorization: getToken()
      }
    }
  },
  mounted () {
    // console.log(this.$route.query)
    // console.log(this.zgh)
    // console.log('我是班级信息')
    // console.log(this.datatree)
    // this.isok = true
    // this.gly = this.$route.query.gly
    // this.njbj.njdm = this.datatree[this.datatree.length-1].njdm
    // this.njbj.bjdm = this.datatree[this.datatree.length-1].bjdm
    // this.treeid = this.datatree[0].bjdm
    // this.treeOpen = !this.treeOpen
    // console.log(this.datatree)
    // if (this.gly) {
    //   this.getstudent(this.datatree[0].bjdm, this.datatree[0].xn, this.xxdm)
    //   setTimeout(() => {
    //     this.getbgd()
    //   }, 1500)
    // } else {
    //   this.getbgd()
    // }
    var that = this;
    window.onscroll= function(e){
        //变量t是滚动条滚动时，距离顶部的距离
        var t = document.documentElement.scrollTop||document.body.scrollTop;
        if(t>=150){
            that.isFix = true;
        }else{
            that.isFix = false;
        }
    }
    this.init()
  },
  methods: {
    /**
     * @description: 页面初始化加载第一个班级第一个学生数据
     * @param {type} 
     * @return: 返回报告单数据集合并渲染页面
     */
    async init(){
      this.studentisok = true
      stastic.remove(stastic.BJ_KEY);
      stastic.remove(stastic.NJ_KEY);
      stastic.remove(stastic.KC_KEY);
      stastic.remove(stastic.JS_KEY);
      stastic.remove(stastic.DQXN_KEY);
      this.gly = await this.$route.query.gly
      this.njbj.njdm = await this.datatree[this.datatree.length-1].njdm
      this.njbj.bjdm = await this.datatree[this.datatree.length-1].bjdm
      this.treeid = await this.datatree[0].bjdm
      this.treeOpen = !this.treeOpen
      if (this.gly) {
        await this.getstudent(this.datatree[0].bjdm, this.datatree[0].xn, this.xxdm)
        setTimeout(() => {
          this.getbgd()
          this.getkcxx()
        }, 500)
        // console.log(this.$refs.a02mb,381);
      } else {
        setTimeout(() => {
          this.getbgd()
          this.getkcxx()
        }, 500)
      }
    },

    /**
     * @description: 根据学校代码获取全部课程列表用于处理课程返回课程名称
     * @param {xxdm} 
     * @return: 
     */
     async getkcxx(){
      //  console.log(this.xxdm)
        await stastic.hqkclb({xxdm: this.xxdm}).then(data => {
          // console.log('我是课程列表')
          // console.log(data)
          this.kclist = data // 所有课程
        })
      },

    /**
     * @description: 根据kcdm获取课程名称
     * @param {kcdm} 
     * @return: 课程名称
     */  
    getkcmc(kclist,kcdm){
      // console.log('数')
      // console.log(kcdm)
      // console.log(kclist)
      var kcmc = stastic.hqkcmcByid(kclist, kcdm)
      // console.log('课程名称')
      // console.log(kcmc)
      return kcmc
    },

    /**
     * @description: 复选框选择报告单数据模块生成所需报告单
     * @param {type} 
     * @return: 
     */
    // 全选控制
    handleCheckAllChange(val) {
      // console.log(this.cityOptions,403)
      this.checkedCities = val ? this.cityOptions : [];
      this.bgdszstr = ''
      this.isIndeterminate = false;
    },
    // 选择所需导出模块
    handleCheckedCitiesChange(value) {
      // console.log(value)
      // console.log(this.cities,411)
      this.bgdszstr = value.join(',');
      // console.log(this.bgdszstr,413);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },

    // 选择所需导出班级
    handleCheckedClassChange(value) {

      // console.log(this.checkedClass,425);
      // this.bgdszstr = value.join(',')
      //let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      this.checkAllClass = this.checkedClass.length === this.datatree.length;
      this.isIndeterminateClass = this.checkedClass.length > 0 && this.checkedClass.length < this.datatree.length;
      // console.log(this.isIndeterminateClass,433333330)
    },

    // 全选班级控制
    handleCheckClassAllChange(val) {
      if(val){
        var that = this;
        this.datatree.forEach(function(item,index){
          that.checkedClass.push(item.bjdm);
        })
      }else{
        this.checkedClass = [];
      }
      this.isIndeterminateClass = false;

      // console.log(this.checkedClass,446)

      //console.log(this.checkedClass,428);
      // this.checkedClass = val ? this.cityOptions : [];
      // this.bgdszstr = ''
      // this.isIndeterminate = false;
    },




    /**
     * @description: 调起弹窗准备导出处理，弹窗内包含所需导出数据模块选项，在确认所需导出信息表单后可开始进行导出操作
     * 同时进行相关验证判断是否可进行数据导出，或是否符合条件
     * @param {type} 
     * @return: 
     */
     async Popup(bgdId){
      //  
      // console.log(this.reportModular)
      var that = this
       if (!this.reportModular) {
        this.reportModular = null
        this.$notify({title: '提示', message: '报告单内容未设置无法导出！', type: 'error', duration: 1500})
       } else {
        this.cities = []
        this.cityOptions = []
        this.reportModular.bgdszList.forEach((el, index) =>  {
          that.cities.push({
            px: el.px,
            lx: el.lx, 
            label: that.modular(el)
          })
          that.cityOptions.push(el.px)
        })
        // console.log(that.cities)
        this.dialogVisible = true

        //全选班级
        this.datatree.forEach(function(item){
          that.checkedClass.push(item.bjdm);
        })
        this.checkAllClass = true;
        this.isIndeterminateClass = false;

        //全选科目
        this.cities.forEach(function(item){
          that.checkedCities.push(item.px);
        })
        this.checkAll = true;
        this.isIndeterminate = false;

        // this.checkedClass = [];
        // console.log(this.datatree,44444444)
       }
      // this.dialogVisible = true
     },

    /**
     * @description: 获取报告单设置信息,通过报告单设置内px字段选取所需打印报告单数据模块
     * @param {id} 
     * @return: 
     */ 
    getreportset(id, njdm){
      // console.log(this.Njdm)
      // var tt = null
      // console.log('第一步')
      GetreportsetInfo({id: id}).then(data => {
        // console.log(data)
        var that = this
        if (data) {
          if (data.njSzList && data.njSzList.length) {
            // data.njSzList.forEach(el => {
            //   if (el.njdm === njdm) {
            //     that.reportModular = el
            //   }
            // })
            that.reportModular = _.find(data.njSzList,function(el){if (el.njdm === njdm) {
              return el
            }else{
              return null
            }
          })
          }
        } else {
          this.$notify({title: '提示', message: '未获取到相关数据！', type: 'error', duration: 2000})
        }
      })
      // console.log(tt)
      // return tt
    },
    
    /**
     * @description: 导出弹窗关闭提示，并可进行相应操作，处理预期目标事件
     * @param {type} 
     * @return: 
     */
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.cityOptions = []
          this.checkAll = false
          this.checkedCities = []
          // this.cities = []
          this.isIndeterminate = true
        })
        .catch(_ => {
        });
    },
    handlecancell(){
      this.cityOptions = []
      this.checkAll = false
      this.checkedCities = []
      // this.cities = []
      this.isIndeterminate = true
      this.dialogVisible = false
    },
    // 获取学生报告单 （教师班主任用）
    async getbgd(){
      // console.log(this.datatree[0])
      this.studentcode = this.datatree[0].students[0].xh
      this.formtable.bgdid = JSON.parse(window.localStorage.getItem('bgdsj')).uuid
      this.formtable.bjid = this.datatree[this.datatree.length-1].bjdm
      this.formtable.bjmc = this.datatree[this.datatree.length-1].bjmc
      this.formtable.xh = this.datatree[0].students[0].xh
      this.formtable.xm = this.datatree[0].students[0].xm
      this.checkdetail(this.datatree[0].students[0], this.datatree[0])
    },
    // 根据bjdm获取班级学生 (管理员用)
    getstudent(bjid, xn, xxdm) {
      // console.log('管理员行动了')
      Getallbjxslist({bjid:bjid, xn: xn, xxdm: xxdm}).then(data => {
        var curClass = _.find(this.datatree,{"bjdm":bjid});
        if(curClass.students.length>0){
            curClass.students = [];
        }else{

            if (data && data.length) {
              data.forEach(item => {
                this.datatree.forEach(el => {
                  if(el.bjmc === item.bjmc){
                    el.students.push({
                      username: '',
                      xbm: '',
                      xh: item.xh,
                      xm: item.xm
                    })
                  }
                })
              })
              // var dat = JSON.parse(JSON.stringify(this.datatree))
              // this.datatree = dat
              
              this.datatree = JSON.parse(JSON.stringify(this.datatree))
              // console.log(this.datatree,7000)
              this.treeid = bjid
              this.treeOpen = !this.treeOpen
            } else {
              this.$notify({title: '提示', message: '未获取到学生数据！', type: 'error', duration: 2000})
            }
        }
        
      })
    },
    // 导出班级
    async getPdfall(){
      // console.log(this.backAllStudents,668800)
      var njdm = _.find(this.datatree,{"bjdm":this.BatchoutSelClass}).njdm
      // console.log(this.BatchoutSelClass,668822)
      if(this.BatchoutSelClass){
          var paraOutput = {
              fqry:1,             //1为老师发起  2为学生发起
              yx:'',
              xxdm:localStorage.getItem("xxdm"),
              bgdId:this.bgdId,
              njdm:njdm,
              bjdm:this.BatchoutSelClass,
          }
          var res = await detailPapi.outputReportV2(paraOutput)

          if(res.status==1){
              this.tipsXX("报告单正在生成中,稍后点击报告单列表查看","success");
              this.dialogVisible = false;
          }


      }else{
          this.tipsXX("请选择要导出的班级",'warning','提示');
      }
    },

    //提示信息
    tipsXX(data,xxtype,tit){
        this.$notify({
            title: tit,
            message: data,
            type: xxtype,
            duration: 2000
        });
    },

    // 导出学生/班级
    Output () {
      this.isout = true;
      var that = this;
      if (this.curStu !== '') {

          var paraOutput = {
              fqry:1,             //1为老师发起  2为学生发起
              yx:'',
              xxdm:localStorage.getItem("xxdm"),
              bgdId:this.bgdId,
              njdm:this.Njdm,
              bjdm:this.Bjdm,
              xh:this.Xh,
          }
          var notifyInstance = that.$notify({
          title: '提示',
          message: '报告单正在生成中,稍后点击报告单列表查看',
          type: 'success',
          duration:2000
          });
          // window.open("http://192.168.0.27:8215/index.html?xxdm="+this.reportinfo.xxdm+"&bgdId="+this.reportinfo.uuid+"&njdm="+this.outputBj.njdm+"&bjdm="+this.outputBj.bjdm+"&xh=&token="+getToken());
          detailPapi.outputReportV2(paraOutput).then(data => {
          //     var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
          //     var downloadElement = document.createElement('a');
          // 　　var href = window.URL.createObjectURL(blob); //创建下载的链接
          // 　　downloadElement.href = href;
          // 　　downloadElement.download = that.curName + '报告单.pdf'; //下载后文件名
          // 　　document.body.appendChild(downloadElement);
          // 　　downloadElement.click(); //点击下载
          // 　　document.body.removeChild(downloadElement); //下载完成移除元素
          // 　　window.URL.revokeObjectURL(href); //释放掉blob对象
          //     that.downloads = false;
          //     that.outputXSFormVisible =false;
          //     notifyInstance.close()
          //     that.tipsXX("下载完毕","success");
              that.isout = false;
              if(data.status!=1){
                  that.tipsXX("生成失败,请重新再试","error");
              }
          }).catch(error => {
              notifyInstance.close()
              that.isout = false;
              setTimeout(() => {
              that.downloads = false
              }, 1000)
              that.tipsXX("生成失败,请重新再试","error");
              console.log(error)
          })
      } else {
          this.isout = false
          // this.isable1 = false
          that.tipsXX("请先选择对应学生！","warning");
          
          // this.$notify({title: '提示', message: '', type: 'error', duration: 2000})
      }
    },
    /**
     * 选择班级
     * **/
    choose () {
      this.njbj.njdm = this.bjmc.njdm
      this.njbj.bjdm = this.bjmc.bjdm
    },
    /***
     * 获取已经生成的报告单列表
     * by:RayJ
     * time：2019-07-09
     *  */
    async GetBgdList(){
        this.bgdloading = true;
        var paraOutput = {
            PageIndex:this.bgdPage,
            PageSize:10,
            xxdm:localStorage.getItem("xxdm"),
            bgdId:this.bgdId,
            fqry:1,             //1为老师发起  2为学生发起  
            // yx:'',
            // njdm:this.curClass.njdm,
            // bjdm:this.curClass.bjdm,
            // xh:this.curStu,
        }
        var res = await detailPapi.getOutBgdList(paraOutput);
        this.bgdPage = res.data.pageIndex;
        this.bgdTableData = res.data.list;
        this.bgdListTotalPages = res.data.pageCount;
        this.bgdListTotal = res.data.totalCount;
        this.bgdloading = false;
    },
    /**
     * 返回报告单生成状态
     * by:RayJ
     * time:2019-07-09
     */
    ztStr(status){
        switch(status){
            case 1:
                return "<span class='status1'>等待生成</span>"
            case 2:
                return "<span class='status2'>正在生成</span>"
            case 3:
                return "<span class='status3'>生成失败</span>"
            case 4:
                return "<span class='status4'>已完成</span>"   
            case 5:
                return "<span class='status1'>已取消</span>"   
        }
    },
    /**
     * 下载报告单
     * by:RayJ
     * time:2019-07-09
     */
    async downLoadReport(item){
        console.log(item,664455)
        var paraOutput = {
            xxdm:localStorage.getItem("xxdm"),
            SCRWID:item.uuid,
        }
        try{
            if(this.isDownLoad){
                this.tipsXX("正在下载报告单请稍后","warning"); 
                return
            }
            this.isDownLoad = true;
            var notifyInstance = this.$notify({
            title: '提示',
                message: '报告单正在下载中...',
                type: 'success',
                duration:0
            });
            var res = await detailPapi.downloadReport(paraOutput)
            
            

            var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
            var downloadElement = document.createElement('a');
        　　var href = window.URL.createObjectURL(blob); //创建下载的链接
        　　downloadElement.href = href;
            if(item.lx==1){
            　　downloadElement.download = item.mc + '.pdf'; //下载后文件名
            }else if(item.lx==2){
                downloadElement.download = item.mc + '.zip'; //下载后文件名
            }
        　　document.body.appendChild(downloadElement);
        　　downloadElement.click(); //点击下载
        　　document.body.removeChild(downloadElement); //下载完成移除元素
        　　window.URL.revokeObjectURL(href); //释放掉blob对象
            // that.downloads = false;
            // that.outputXSFormVisible =false;
            notifyInstance.close()
            this.isDownLoad = false;
            this.tipsXX("下载完毕","success");
        }catch(err){
            this.isDownLoad = false;
            this.tipsXX("下载错误,请联系管理员","error");
        }
    },
    //取消生成报告单
    async cancelReport(item){
      var params = {
        xxdm: localStorage.getItem("xxdm"),
        scrwid:item.uuid,
      }
      try{
        var res = await detailPapi.CancelGenerateTask(params) 
        this.tipsXX(res.message,"success");
        this.GetBgdList();
      } catch(err) {
        this.tipsXX("请求发送失败，请稍后再试","error");
      }
    },
    /**
     * 切换页面
     * by:RayJ
     * time:2019-07-09
     */
    handleCurrentChange(val) {
        this.bgdPage = val;
        this.GetBgdList();
    },

    /**
     * @description: 报告单模块数据处理返回标准格式数据模块
     *  0（课程）， 1（身体素质曲线）
     *  2（个人发展--即雷达图数据）， 3（出勤记录），4（奖惩记录）
     *  5（班主任寄语）， 6（附言），7（总评）
     * @param {el} 
     * @return: 
     */
    modular(el){
      // console.log(el)
      var obj = null
      if (el.lx === 0) {
        obj = this.getkcmc(this.kclist,el.kcid)
        // console.log(obj)
      } else if (el.lx === 1) {
        obj = '身体素质曲线'
      } else if (el.lx === 2) {
        obj = '个人发展'
      } else if (el.lx === 3) {
        obj = '出勤记录'
      } else if (el.lx === 4) {
        obj = '奖惩记录'
      } else if (el.lx === 5) {
        obj = '班主任寄语'
      } else if (el.lx === 6) {
        obj = '附言'
      } else if (el.lx === 7) {
        obj = '总评'
      } else if (el.lx === 16) {
        obj = '签名'
      }
      console.log(obj)
      return obj
    },

    /**
     * @description: 展开侧边栏班级学生，判断是否存在学生，当不存在数据时重新发起请求尝试获取数据
     * 同时发起请求获取报告单设置相关信息 
     * @param {type} 
     * @return: 
     */
    opentr(datas){
      // console.log(datas)
      this.cities = []
      this.cityOptions = []

      this.getreportset(this.bgdId, datas.njdm)

      this.Xh = ''
      this.Bjmc = datas.bjmc
      this.Bjdm = datas.bjdm
      this.Njdm = datas.njdm
      this.isbj = true
      if (datas.students.length) {
        // console.log('你不该看见我')
        this.treeid = datas.bjdm
        this.treeOpen = !this.treeOpen
      } else {
        // console.log('走在路上了')
        this.getstudent(datas.bjdm, datas.xn, this.xxdm)
      }
      
    },
    /** 根据学生年级代码，报告单id等相关信息获取学生报告单  
     *  xxdm 学校代码
     *  bgdid 报告单id
     *  njdm 年级代码
     *  bjdm 班级代码
     *  arr3 数据处理暂存数组
     * **/
    checkdetail(item, datas){
      // console.log(item)
      this.xsxm = item.xm
      // console.log(datas)
      this.isbj = false
      this.Xh = item.xh
      this.Bjdm = datas.bjdm
      this.Njdm = datas.njdm
      this.bdtxx.bj = datas.bjmc
      this.bdtxx.xm = item.xm
      this.mbloading = true;
      let params = {
        xxdm: this.listQuery.xxdm,
        bgdId: this.bgdId,
        njdm: datas.njdm,
        bjdm: datas.bjdm,
        xh: item.xh
      }
      // console.log(params)
      // if (this.studentcode !== item.xh) {
      //   // this.submit('st')
      // }
      this.tydata = {}
      this.tixingdate = []
      this.pageData = []
      this.tableshow = false
      this.rader = false
      this.chartData = [] // 
      var scorelist = [] // 
      var chartData = [] //
      this.jfldV = []
      this.jfldN = []
      var that = this
      var arr4 = []
      let zpList = [] // 总评
      var tablehead = [] // 表头数据暂存
      // if (this.studentisok) {
      //   this.studentisok = false
        Getreportstatistics(params).then(data => {
          this.listQuery.xq = data.bgd.xq;
          this.listQuery.xn = data.bgd.xn;
          data.bgdItemlist.forEach(itemm => {
            // console.log((itemm.kcmc.indexOf('体育')!=-1)&&itemm.xmReportList,847)
            // console.log(itemm)
            if (itemm.lx === 16){
              this.qmurl = itemm.bgdqmModels
            }
            if(itemm.lx === 6){
              console.log(itemm,516)
              this.A03bgdfy = itemm.fy
            }
            if(this.xxdm=='114'&&itemm.kcmc!=null&&itemm.xmReportList){
              console.log(itemm.xmReportList,852)
              let xmind = itemm.xmReportList.findIndex((xm)=>{
                  return xm.mc.indexOf('体质健康')>=0;
              })//找到学科底下与学科名字不同的项目
              console.log(xmind)
              if(xmind>=0){
                this.tydata = itemm.xmReportList[xmind];//保存作为单独一个表格（右侧）显示
                console.log(this.tydata,856)
                itemm.xmReportList.splice(xmind,1);//移除这个项目                
              }
              console.log(itemm.xmReportList,546)
            }
          })
          this.syt = data.bgd.zssy?data.bgd.xxsy:''
          this.bgdmc = data.bgd.mc
          // console.log(data,882255);
          // 雷达图数据
          Getstastick({xn: data.bgd.xn,xq:data.bgd.xq ,xxdm:data.bgd.xxdm ,xh:item.xh, njdm: datas.njdm,bgdId:data.bgdxx.bgdid}).then(datast => {
            // console.log(datast)
            this.radarchartN = []
            this.radarchartvalue = []
            // var that = this
            var radvalue = {
              value: [],
              name: ''
            }
            var radvalue2 = {
              value: [],
              name: ''
            }
            datast.kcXmScores.forEach(els => {
              els.zddj = els.aRatingCount + els.bRatingCount + els.cRatingCount + els.dRatingCount
            })
            var arr = JSON.parse(JSON.stringify(datast.kcXmScores))
            var arr3 = JSON.parse(JSON.stringify(datast.kcXmScores))
            var arr1 = []
            var arr2 = []
            // console.log(arr)
            data.bgdItemlist.forEach(itemm => {
              if (itemm.lx === 2) {
                if (itemm.zsjf) {
                  arr1 = _.sortBy(arr, [function(o) { return o.score; }])
                } else {
                  arr1 = []
                }
                if (itemm.zsdj) {
                  arr2 = _.sortBy(arr3, [function(o) { return o.zddj; }])
                  // console.log(arr2)
                } else {
                  arr2 = []
                }
              }
            })
            // var arr1 = _.sortBy(arr, [function(o) { return o.score; }])
            // console.log(arr1)
            if (arr1.length) {
              arr1.forEach((item, index) => {
                that.radarchartN.push({name:item.mc, max: arr1[arr1.length-1].score?arr1[arr1.length-1].score:100})
                radvalue.value.push(item.score)
              })
              this.radarchartvalue.push(radvalue)
              this.danwei1 = ''
              this.rader = true
              this.studentisok = true
            } else {
              radvalue.value = []
              that.radarchartN = [] 
              this.radarchartvalue = []
              this.danwei1 = ''
              this.rader = false
              this.studentisok = true
            }
            if (arr2.length) {
              arr2.forEach((item, index) => {
                that.jfldN.push({name:item.mc, max: 100})
                radvalue2.value.push(item.zddj?(item.aRatingCount/item.zddj).toFixed(2)*100:0)
              })
              this.jfldV.push(radvalue2)
              this.danwei = '单位：百分比'
              this.rader2 = true
              this.studentisok = true
            } else {
              radvalue2.value = []
              that.jfldN = []
              this.jfldV = []
              this.danwei = '单位：百分比'
              this.rader2 = false
              this.studentisok = true
            }
            this.mbloading = false;
            // console.log(this.jfldV)
          }).catch(error => {
            this.studentisok = true
            this.rader2 = false
            this.mbloading = false;
          })

          /**
          * @lx
          *  0（课程）， 1（身体素质曲线）
          *  2（个人发展--即雷达图数据）， 3（出勤记录），4（奖惩记录）
          *  5（班主任寄语）， 6（附言），7（总评）
          *  @jflx 0（成绩换算）， 1（累积量换算）， 2（学分）， 3（等级），4（图文）， 5（健康）， 6（阅读）， 7（加减分）
          *  @zhdj 0(不转换)  1(转换)
          **/
          // console.log(data)
          if (data.bgdItemlist.length) {
            data.bgdItemlist.forEach(el => {
              if (el.lx === 0) { // 课程
                // 表格数据暂存
                var arr3 = []
                // 表格总数据
                var tabledata = {
                  shuiyin: data.bgd.zssy?data.bgd.xxsy:'', // 水印图
                  zymc: el.zymc, // 专业名称
                  kcmc: el.kcmc, // 课程名称
                  ewmUrl: el.ewmUrl, // 二维码
                  tabledata: [], // 表数据
                  tablehead: [{labels: '评价项目', id: 'xm',isshows: true}, {labels: '评价分项', id: 'fx', isshows: true}, {labels: '评价值', id: 'dj', isshows: true}, {labels: '班级整体', id: 'bjzt',isshows: false, isshow: el.bjzt}] // 表头
                }
                if (el.xmReportList) {
                  
                  if (el.xmReportList.length) {
                    // 总评数据表格处理
                    
                    if (el.kcmc) {
                      zpList.push(el);
                    } else {
                      zpList = []
                    }

                    // 普通表格数据处理
                    for (var i=0; i<el.xmReportList.length; i++) {
                      // 根据有无子项目采集数据 ywzx（有无子项布尔值）
                      if (!el.xmReportList[i].ywzx) { // 无子项
                        // if (el.xmReportList[i].jflx === 0) {
                          
                        // }
                        el.xmReportList[i].rwList.forEach(rw => {
                          if (el.xmReportList[i].uuid === rw.xmid) {

                            
                            tabledata.tabledata.push(
                              {
                                isbjzt: el.bjzt, // 班级总体
                                zssz: el.zssz, // 展示数值
                                zsjf: el.zsjf, // 展示积分
                                zsdj: el.zsdj, // 展示等级
                                sfzs: el.sfzs, // 是否展示
                                uuid: el.xmReportList[i].uuid, // 项目uuid
                                // ids: el.xmReportList[i].uuid,
                                xmxx:{
                                  xm:  el.xmReportList[i].mc,
                                  fx: '',
                                  dj: ''
                                },
                                fxxx:{
                                  xm:  '',
                                  fx: el.xmReportList[i].rwList.length?rw.mc:el.xmReportList[i].mc,
                                  dj: ''
                                },
                                djxx:{
                                  xm: '',
                                  fx: '',
                                  dj: (el.xmReportList[i].zhdj === 1 && rw.djz)?rw.djz:(((el.xmReportList[i].jflx === 7 || el.xmReportList[i].jflx === 1) && el.xmReportList[i].zhdj === 0)?el.xmReportList[i].xf:(el.xmReportList[i].jflx === 3)?rw.djz:(el.xmReportList[i].jflx === 4)?rw.twnr:(el.xmReportList[i].jflx === 1 && el.xmReportList[i].zhdj === 1)?el.xmReportList[i].djz:(el.xmReportList[i].jflx === 5)?rw.sz:rw.cjXF)// + '(学分:'+ rw.cjXF + ')'
                                },
                                xm: el.xmReportList[i].mc, // 项目名称
                                jflx: el.xmReportList[i].jflx, // 积分类型
                                fx: el.xmReportList[i].rwList.length?rw.mc:el.xmReportList[i].mc,
                                zhdj: el.xmReportList[i].zhdj, //转换等级
                                hjz: ((el.xmReportList[i].zhdj === 1 && rw.djz)?rw.djz:el.xmReportList[i].xf),
                                dj: (el.xmReportList[i].zhdj === 1 && rw.djz)?rw.djz:(((el.xmReportList[i].jflx === 7 || el.xmReportList[i].jflx === 1) && el.xmReportList[i].zhdj === 0)?el.xmReportList[i].xf:(el.xmReportList[i].jflx === 3)?rw.djz:(el.xmReportList[i].jflx === 4)?rw.twnr:(el.xmReportList[i].jflx === 1 && el.xmReportList[i].zhdj === 1)?el.xmReportList[i].djz:(el.xmReportList[i].jflx === 5)?rw.sz:rw.cjXF),// + '(学分:'+ rw.cjXF + ')'
                                // (el.xmReportList[i].jflx === 3 && !el.xmReportList[i].rwList.length)?el.xmReportList[i].djz:
                                bjzt: [
                                  {
                                    dj:'A',
                                    num:rw.bjadjsl,
                                    djW:(rw.bjadjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%'
                                  },
                                  {
                                    dj:'B',
                                    num:rw.bjbdjsl,
                                    djW:(rw.bjbdjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%' 
                                  },
                                  {
                                    dj:'C',
                                    num:rw.bjcdjsl,
                                    djW:(rw.bjcdjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%'
                                  },
                                  {
                                    dj:'D',
                                    num:rw.bjddjsl,
                                    djW:(rw.bjddjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%' 
                                  }
                                ]
                              }
                            )
                          } else {

                          }
                        })
                      } else if (el.xmReportList[i].ywzx) { // 有子项
                        // if (el.xmReportList[i].jflx === 0) {
                          
                        // }
                        el.xmReportList[i].zxmList.forEach(rw => {
                          // console.log(el.xmReportList[i])
                            if (el.xmReportList[i].uuid === rw.fjxmid) {
                              
                              var dj  = ((el.xmReportList[i].zhdj === 1 || rw.zhdj === 1) && rw.djz)?rw.djz:((el.xmReportList[i].jflx === 7 || el.xmReportList[i].jflx === 1)?el.xmReportList[i].xf:(el.xmReportList[i].jflx === 3)?rw.djz:rw.xf)
                              if (rw.jflx === 5) {
                                var tzjk = [] // 体质健康数处理暂存 
                                rw.rwList.forEach(tt => {
                                  dj = tt.mc + ':' + tt.sz + '(' + tt.cjXF + '分)' + ';'
                                  tzjk.push(dj)
                                })
                                dj = tzjk.join('')
                              }
                              if (rw.jflx === 3) {
                                dj = '/'
                              }
                              if (rw.jflx !== 5 && rw.jflx !== 3) {
                                tabledata.tabledata.push(
                                  {
                                    isbjzt: el.bjzt, // 班级总体
                                    zssz: el.zssz, // 展示数值
                                    zsjf: el.zsjf, // 展示积分
                                    zsdj: el.zsdj, // 展示等级
                                    sfzs: el.sfzs, // 是否展示
                                    xmxx:{
                                      xm:  el.xmReportList[i].mc,
                                      fx: '',
                                      dj: ''
                                    },
                                    fxxx:{
                                      xm:  '',
                                      fx: rw.mc,
                                      dj: ''
                                    },
                                    djxx:{
                                      xm: '',
                                      fx: '',
                                      dj: dj
                                    },
                                    xm: el.xmReportList[i].mc, // 项目名称
                                    jflx: el.xmReportList[i].jflx, // 积分类型
                                    fx: rw.mc,
                                    zhdj: el.xmReportList[i].zhdj, //转换等级
                                    hjz: ((el.xmReportList[i].zhdj === 1 && rw.djz)?rw.djz:el.xmReportList[i].xf),
                                    dj: dj,
                                    bjzt: [
                                      {
                                        dj:'A',
                                        num:rw.bjadjsl,
                                        djW:(rw.bjadjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%'
                                      },
                                      {
                                        dj:'B',
                                        num:rw.bjbdjsl,
                                        djW:(rw.bjbdjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%' 
                                      },
                                      {
                                        dj:'C',
                                        num:rw.bjcdjsl,
                                        djW:(rw.bjcdjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%'
                                      },
                                      {
                                        dj:'D',
                                        num:rw.bjddjsl,
                                        djW:(rw.bjddjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%' 
                                      }
                                    ]
                                  }
                                )
                              }
                              if (rw.jflx === 5) {
                                tabledata.tabledata.push(
                                  {
                                    isbjzt: el.bjzt, // 班级总体
                                    zssz: el.zssz, // 展示数值
                                    zsjf: el.zsjf, // 展示积分
                                    zsdj: el.zsdj, // 展示等级
                                    sfzs: el.sfzs, // 是否展示
                                    xmxx:{
                                      xm:  el.xmReportList[i].mc,
                                      fx: '',
                                      dj: ''
                                    },
                                    fxxx:{
                                      xm:  '',
                                      fx: rw.mc,
                                      dj: ''
                                    },
                                    djxx:{
                                      xm: '',
                                      fx: '',
                                      dj: dj
                                    },
                                    xm: el.xmReportList[i].mc, // 项目名称
                                    jflx: el.xmReportList[i].jflx, // 积分类型
                                    fx: rw.mc,
                                    zhdj: el.xmReportList[i].zhdj, //转换等级
                                    hjz: ((el.xmReportList[i].zhdj === 1 && rw.djz)?rw.djz:el.xmReportList[i].xf),
                                    dj: dj,
                                    bjzt: [
                                      {
                                        dj:'A',
                                        num:rw.bjadjsl,
                                        djW:(rw.bjadjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%'
                                      },
                                      {
                                        dj:'B',
                                        num:rw.bjbdjsl,
                                        djW:(rw.bjbdjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%' 
                                      },
                                      {
                                        dj:'C',
                                        num:rw.bjcdjsl,
                                        djW:(rw.bjcdjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%'
                                      },
                                      {
                                        dj:'D',
                                        num:rw.bjddjsl,
                                        djW:(rw.bjddjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%' 
                                      }
                                    ]
                                  }
                                )
                              }
                              
                            }
                        })
                      }
                    }
                  } else {
                    that.pageData = []
                  }
                  if (tabledata.tabledata.length>25) {
                    var arrs = []
                    var arrd = []
                    arrs = JSON.parse(JSON.stringify(tabledata))
                    arrd = JSON.parse(JSON.stringify(tabledata))
                    arrd.tabledata.splice(20,tabledata.tabledata.length+1)
                    arr4.push(arrd)
                    arrs.tabledata.splice(0,20)
                    arr4.push(arrs)
                  } else {
                    arr4.push(tabledata)
                  }
                }
                // arr4.push(tabledata)
                // console.log(arr4)
              } else if (el.lx === 1) { // 身体素质曲线
                // console.log(el.physicalFitnessInfo.xqPhysicalFitnessList)
                el.physicalFitnessInfo.physicalFitnessList.forEach(itemm =>{
                  var serie = {xm: itemm.rwMc, score:[], color: '#ff9900', id: itemm.rwId, xm: itemm.rwMc};
                  el.physicalFitnessInfo.xqPhysicalFitnessList.forEach(items => {
                    var physicalFitnessInfo = _.find(items.physicalFitnessItemList,function (physicalFitnessItem) { return physicalFitnessItem.dyRwId == itemm.rwId;});
                    if(physicalFitnessInfo == undefined){
                      serie.score.push(0);
                    }else{
                      if(el.zssz){
                        // this.tixingdate.push(items.xn)
                        serie.score.push(physicalFitnessInfo.sz);
                      }else if(el.zsjf){
                        serie.score.push(physicalFitnessInfo.xf);
                      }
                    }
                  })

                  chartData.push(serie);
                });
                el.physicalFitnessInfo.xqPhysicalFitnessList.forEach(item3 => {
                  this.tixingdate.push(item3.xn + (item3.xq === '01'?'上学期':'下学期'))
                })
                // console.log(chartData)
              } else {
                if(el.lx === 10){ // 任课教师任寄语
                  this.zp.js = true
                } else if(el.lx === 7){ // 总评
                  this.sjkz.zp = true
                } else if(el.lx === 4){ // 奖惩记录
                  this.sjkz.jc = true
                } else if(el.lx === 6){ // 附言
                  this.sjkz.fy = true
                } else if(el.lx === 3){ // 出勤记录
                  this.sjkz.cq = true
                } else if(el.lx === 11){ // 家长寄语
                  
                } else if(el.lx === 2){ // 学业学习表现
                  
                } else if(el.lx === 5){ // 班主任寄语
                  this.sjkz.bzrjy = true
                } else {
                  this.sjkz = {
                    cq: false,
                    jc: false,
                    bzrjy: false,
                    fy: false,
                    js: false,
                    zp: false,
                  }
                }
              }
            });
            // 总评数据处理
            if (zpList.length) {
              zpList.forEach(itemzp => {
                let obj = {};
                obj.xk = itemzp.kcmc;
                obj.pjxm = [];
                let itemzpXmReportList = itemzp.xmReportList;
                for (let i = 0; i < itemzpXmReportList.length; i++) {
                  if (itemzpXmReportList[i].jflx === 0 ||
                    itemzpXmReportList[i].jflx === 1 ||
                    itemzpXmReportList[i].jflx === 3 ||
                    itemzpXmReportList[i].jflx === 7
                  ) {
                        if(itemzpXmReportList[i].jflx === 3){
                          if(!itemzpXmReportList[i].djz){
                            continue;
                          }
                          obj.pjxm.push({
                            mc: itemzpXmReportList[i].mc,
                            dj: itemzpXmReportList[i].djz
                          });
                          continue;
                        }
                        if(!itemzpXmReportList[i].djz){
                            continue;
                          }
                        obj.pjxm.push({
                          mc: itemzpXmReportList[i].mc,
                          dj: itemzpXmReportList[i].zhdj ? itemzpXmReportList[i].djz || '/' : itemzpXmReportList[i].xf
                        });
                        // console.log('obj.pjxm')
                        // console.log(obj.pjxm);

                  }
                }

                var arr = []
                arr.push(obj);
                arr.forEach(item => {
                  if (item.pjxm.length) {
                    this.pageData.push(item)
                  }
                })
              });
            } else {
              this.pageData = []
            }
          }
          // {name: '出勤记录', ycq: '', sj: '', bj: '', kk: '', cdzt: '', lx: 3},
          // {name:'奖惩记录', jcjl: '', lx: 4},
          // {name:'班主任寄语', bzrjy: '', lx: 5},
          // {name:'附言', fy: '', lx: 6},
          if (data.bgdxx) {
            this.reporttable.forEach(item => {
              if (item.lx === 3) {
                item.ycq = data.bgdxx.ycqts
                item.sj = data.bgdxx.sjts
                item.bj = data.bgdxx.bjts
                item.kk = data.bgdxx.kks
                item.cdzt = data.bgdxx.cdzts
              }
              if (item.lx === 4) {
                item.jcjl = data.bgdxx.jcjz
              }
              if (item.lx === 5) {
                item.bzrjy = data.bgdxx.bzrjy
              }
              if (item.lx === 6) {
                item.fy = data.bgdxx.fy
              }
            })
            // console.log(this.reporttable,1320)
            this.formtable = data.bgdxx
          } else {
            this.reporttable = [
              {name: '出勤记录', ycq: '', sj: '', bj: '', kk: '', cdzt: '', lx: 3},
              {name:'奖惩记录', jcjl: '', lx: 4},
              {name:'班主任寄语', bzrjy: '', lx: 5},
              {name:'附言', fy: '', lx: 6},
            ]
            this.formtable = {
              // uuid: '',
              bgdid: this.bgdId,
              xh: item.xh,
              xm: item.xm,
              bjid: datas.bjdm,
              bjmc: datas.bjmc,
              ycqts: 0,
              sjts: 0,
              bjts: 0,
              kks: 0,
              cdzts: 0,
              sg: 0,
              tz: 0,
              zysl: 0,
              yysl: 0,
              jcjz: '',
              bzrjy: '',
              fy: ''
            }
          }
          console.log(arr4,1008)
          if (arr4.length) {
            that.tableData = JSON.parse(JSON.stringify(arr4))
            console.log('应该更新tableData',1356)
            console.log(that.tableData)
          } else {
            that.tableData = []
            // that.$notify({title: '提示', message: '项目内容等信息未设置', type: 'error', duration: 1000})
          }
          
          that.chartData = chartData
          setTimeout(() => {
            this.tableshow = true
          }, 100)
          // console.log(that.chartData)
          // that.tableData = arr3
          GetReportTemplate({id:data.bgd.mbid}).then(response => {
              this.mbinfo = response;
          }) 
        }).catch(error => {
          this.studentisok = true
          // console.log(error)
        })
      // } else {
      //   this.studentisok = true
      //   this.$notify({
      //     title: '提示',
      //     message: '请待数据加载完之后再点击其他学生',
      //     type: 'info',
      //     duration: 1000
      //   });
      // }
    },
    splicearr2 (arr) {
        var result = []
        for(var i=0;i<arr.length;i++) {
            for (var j=i+1;j<arr.length;j++) {
                if (arr[i].jflx === arr[j].jflx && arr[i].hjz === arr[j].hjz && arr[i].xm === arr[j].xm) {
                  j = ++i
                // } else if (arr[i].uuid === arr[j].uuid && arr[i].rwList.length <= arr[j].rwList.length) {
                //     arr[j] = arr[j]
                //     j = ++i
                }
            }
            result.push(arr[i])
        }
        return result
    },

    
    // 学生报告单统计
    getreportstastick () {
      let params = {
        // xxdm:
        // bgdId:
        // njdm:
        // bjdm:
        // xh:
      }
    },
    search(){
      this.getStudent()
    },
    // 获取查询学生
    getStudent () {
      var t = this.xxdm.length
      this.zgh = this.username.substring(t)
      let params = {
        xxdm: this.xxdm,
        zgh: this.zgh,
        xndm: this.xndm,
        xm: this.studentN,
      }
      var str = {}
      if (this.studentN === '') {
        this.datatree = JSON.parse(window.localStorage.getItem('newclasslist'))
      } else {
        Getjurisdiction(params).then(data => {
          if (data.data.length) {
            this.datatree = data.data
          } else {
            this.$notify({
              title: '提示',
              message: ' 未查到该信息',
              type: 'info',
              duration: 2000
            });
            this.datatree = JSON.parse(window.localStorage.getItem('newclasslist'))
          }
        })
      }
      
    },
    popupReportInfo(){
      this.reportInfoDialogVisible = true
    },
    confirmOutputReportInfo(){
      if(this.reportInfoSelClass){
          let bjInfo = _.find(this.datatree,{"bjdm":this.reportInfoSelClass});

          var bjmc = bjInfo.bjmc
          var njdm = bjInfo.njdm
          let params = {
            Xxdm: this.listQuery.xxdm,
            BgdId: this.bgdId,
            Njdm: njdm,
            Bjdm:this.reportInfoSelClass.toString()
          }

          this.reportInfoDialogVisible = false;
          this.reportInfoIsOut = true;

          console.log(this.bgdxx);

          DownloadExcelStudentBgdxx(params).then(data => {
            var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = bjmc + '_' + this.bgdxx.mc + '.xlsx'; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象

            this.reportInfoIsOut = false;
          }).catch(error =>{
            this.$notify({title: '提示', message: '导出失败！', type: 'error', duration: 2000})

            this.reportInfoIsOut = false;
          })
      }else {
         this.tipsXX("请选择要导出的班级",'warning','提示');
      }
    },
    cancelOutputReportInfo(){
      this.reportInfoDialogVisible = false
    }
  },
  
}
</script>
<style lang="scss" scoped>

  .bgdTable{
      /deep/ .status1{
          color: #909399;
      }
      /deep/ .status2{
          color: #E6a23c;
      }
      /deep/ .status3{
          color: #F56c6c;
      }
      /deep/ .status4{
          color: #67c23a;
      }
  }
  .batOutData /deep/ .el-dialog__body{
    padding: 10px 20px;
  }
  .batOutTit{
    font-size: 16px;
    padding: 10px 0;
  }
  .table-container{
    float: left;
    .content_left{
      float: left;
      width: 190px;
      height: 600px;
      border: 1px solid #e0e0e0;
      overflow: auto;
    }
    .content_right{
      padding-left:20px;
      overflow: hidden;
      margin-left: 190px;
      min-height: 500px;
      position: relative;
      .table_box{
      float: left;
      margin: 10px 20px 10px 0;
      }
    }
    .content_left.fix{
        position: fixed;
        top: 70px;
    }
    .content_left::-webkit-scrollbar {
        width: 10px;
        height: 1px;
    }
    .content_left::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.6);
        background-color: rgb(97, 172, 247);
        background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
    }

    .content_left::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.2);
        border-radius: 10px;
        background: #F4f4f4;
    }
  }
  .tbcol{
    clear:both;
    width: 100%;
    padding:5px 0;
  }
</style>
<style scoped>
    .bgdfm{
        background:#fdeadb;
        /* background: url('../../../../../static/img/bgdfmbg.jpg'); */
        background-size: 100% auto;
        height: 1146px;
        padding: 100px 80px;
        position: relative;
    }
    .bgdfm .schoollogo{
        position: absolute;
        height: 250px;
        width: 250px;
        top: 450px;
        left: 380px;
        /* background-color: #000; */
    }
    .bgdfm .schoolimg{
        position: absolute;
        height: 125px;
        width: 580px;
        top: 220px;
        right: 145px;
        /* background-color: #fff;     */
    }
    .bgdfm .bgdinfo{
        float: right;
        position: relative;
        width: 525px;
    }
    .bgdinfo .title{
        position: absolute;
        left: 0;
        top: 351px;
        font-size: 30px;
        text-indent: 3px;
        font-family: monospace;
        font-weight: bolder;
    }
    .bgdinfo .title .bgdxnxq{
        margin-top: 21px;
        margin-left: 52px;
    }
    .bgdinfo .njbj{
        position: absolute;
        left: 80px;
        top: 550px;
        font-size: 26px;
        font-family: monospace;
        font-weight: bold;
    }
    .bgdinfo .xm{
        position: absolute;
        left: 79px;
        top: 640px;
        font-family: monospace;
        font-size: 26px;
        font-weight: 500;
    }
    .bgdinfo .shijian{
        position: absolute;
        top: 715px;
        left: 105px;
        font-size: 26px;
        font-family: monospace;
        font-weight: 500;
        letter-spacing: 3px;
    }
</style>

<style lang="scss">
  .box-card {
    width: 100%;
  }
</style>
  