<template>
    <div class="app-container">
        <div class="u_TableMain">
            
            <el-tabs type="card" class="Tcdreport" v-model="step" @tab-click="handleTab">
                <el-tab-pane label="基础设置" name='step0'>
                    <div class="m_GenTableBox">
                        <el-checkbox-group v-model="njdmSel" class='mpt'>
                        <el-checkbox v-for="(item,index) in njList" :key="index" :label="item.njdm" border
                            @change="handleSelNj($event,item)">{{item.njmc}}</el-checkbox>
                        </el-checkbox-group>
                        <div class="report-footer">
                        <el-button type="primary" :disabled="btnLimt" @click="saveReport('step0')">保 存</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <!-- 内容设置 -->
                <el-tab-pane label="内容设置" name='step1' :disabled='step=="step0"'>
                    <div class="m_GenTableBox">
                    <el-tabs type="border-card" class='step1box' v-model="nrsetclassInd" @tab-click="handleTabclass">
                    <el-tab-pane :label="item.njmc" v-for='(item,index) in njListSel' :key='index'>
                        <div class='dragcon'>
                            <el-table class="dragTable" ref="multipleTable" stripe height="500" :show-header='false' :data="item.bgdszList"
                                tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
                                @select='handleSelect' @row-click="selectRowKc" :row-class-name="tableRowClassName">
                                <el-table-column width="40">
                                <template slot-scope="scope">
                                    <div class="drag" draggable="true" @dragend="handleDragend"
                                    @dragstart="handleDragStart($event,scope.row)"
                                    @drop="handleDrop($event,item.bgdszList,scope.row)" @dragover='handleDropOver($event)'>
                                    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive='false'></hamburger>
                                    </div>
                                </template>
                                </el-table-column>
                                <el-table-column type="selection" width="30"></el-table-column>
                                <el-table-column>
                                <template slot-scope="scope"><span class='txthid'>{{ scope.row.bm}}</span></template>
                                </el-table-column>
                                <el-table-column width="50">
                                <template slot-scope="scope">
                                    <em class="el-icon-circle-close" @click.stop="delect_active(scope.row, index, scope.$index)"></em>
                                </template>
                                </el-table-column>
                            </el-table>
                            <el-button class="addThematic" type="primary" @click.stop="Add_Thematic_Activities(index,item)">+ 添加</el-button>
                        </div>

                        <el-card shadow="never" v-if="showtype !== 0">
                            <!-- 附言寄语beg -->
                            <div v-if="showtype === 12">
                                <el-input maxlength="20" id="isinput" v-model="form.bm" placeholder="请输入内容" @blur="jyfysj"></el-input>
                                <rich-text :isedit="true" :showtype="showtype" class="rich_com" @onEditorChange="onEditorChange" @onEditorReady="onEditorReady"
                                @onEditorFocus="onEditorFocus" @onEditorBlur="onEditorBlur" :dataSource="form.fy"></rich-text>
                            </div>
                            <!-- 附言寄语end -->

                            <!-- 活动分析表beg -->
                            <div v-if="showtype === 13">
                                    <div style="margin-bottom: 20px;"><el-input maxlength="20" id="isinput" v-model="tableData.bm" style="width: 100%;" @blur="changebm" placeholder="请输入内容"></el-input></div>
                                    <table-com :isyl="isyl" :starable="true" :isdisabled="false" :tableData="tableData" :num="num" @delect="delect" @blur="blur"></table-com>
                                    <div style="border: 1px solid #eee;border-top:none;height: 80px;width:100%;">
                                        <el-button @click.stop="addproject" style="width: 50%;margin-left: 25%;margin-top: 20px;font-size: 16px;" type="primary" icon="el-icon-plus"
                                        >添加项目</el-button>
                                    </div>
                                    <div  style="border: 1px solid #eee;border-top:none;width: 100%;padding: 0px 20px;min-height: 300px;float: left;">
                                        <div class="gxpj_box_left">
                                            <h3>个性评价</h3>
                                            <el-checkbox v-model="tableData.bjzt" @change="selectbjzt">班级整体情况</el-checkbox>
                                        </div>
                                        <div class="gxpj_box_right">
                                            <ul class="pjz_box" v-if="tableData.hdfxgxpjList.length">
                                            <div class="hdfxsrk" v-for="(pjx, pjxindex) in tableData.hdfxgxpjList" :key="pjxindex" >
                                                <el-input maxlength="4" @blur="pjxblur"  size="small" style="width: 112px;margin: 10px;margin-right:30px;" v-model="pjx.mc" placeholder="请输入内容"></el-input><span  @click.stop="clearpjx(pjx,pjxindex)" class="delbtns el-icon-close"></span>
                                            </div>
                                            </ul>
                                            <el-button class="pjz_btn" type="primary" icon="el-icon-circle-plus" circle @click.stop="addpjx"></el-button>
                                        </div>
                                    </div>
                                    <!-- 评分标准二维码beg -->
                                    <div style="width: 100%;float: left;padding: 10px 20px;margin-top: 50px;">
                                    <p><el-checkbox v-model="tableData.pfbzewm" @change="selectpfbz">评分标准二维码</el-checkbox></p>
                                    <rich-text :isedit="true" :showtype="showtype" class="rich_com" @onEditorChange="onEditorChange" @onEditorReady="onEditorReady"
                                @onEditorFocus="onEditorFocus" @onEditorBlur="onEditorBlur" :dataSource="tableData.pfbznr"></rich-text>
                                    </div>
                                    <!-- 评分标准二维码end -->
                            </div>
                            <!-- 活动分析表end -->
                            
                            <!-- 图片上传区域 -->
                            <!--  v-if="showtype === 12" -->
                            <div style="float:left;width:100%;text-align: center;">
                                <div class="step_foot">
                                    <div class="uploadlogo">
                                        <div class="uploadpt">
                                            <el-upload list-type="picture-card" action="/api/netcore/smartcredit/v1/Upload/UploadFile"
                                            :headers="headers" :limit="1" :on-preview="handlePictureCardPreview" :show-file-list="true" 
                                            :on-remove="handlePictureRemove34"
                                            :on-success="uploadSuccessPic" :before-upload="BatchbeforeUploadPictures"
                                            :file-list="logofile">
                                            <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <!-- <el-dialog :visible.sync="dialogPictureVisible">
                                            <img width="100%" :src="dialogImageUrl" alt="">
                                            </el-dialog> -->
                                        </div>
                                        <span style="margin-right: 40px;">上传图片jpg/png</span>
                                    </div>
                                    <el-button type="primary" @click.stop="ddtjxm" :disabled="btnLimt">保 存</el-button>
                                </div>
                                <!-- 建议图片宽高为1000*500 -->
                            </div>
                        </el-card>
                    </el-tab-pane>
                    <div class='step1foot'>
                        <el-button type="primary" style="margin:auto;" @click="saveReport('step1')">生成报告单模板</el-button>         
                    </div>
                    </el-tabs>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="预览报告单" name='step2' :disabled='step!="step2"'>
                    <div class="m_GenTableBox">
                        <el-tabs type="border-card" class='step1box' v-model="preVInd" @tab-click="handleTabPrev">
                            <el-tab-pane :label="item.njmc" v-for='(item,index) in njListSel' :key='index'>
                                <el-row :gutter="20">
                                <div class="Title_of_report">
                                    <h3>{{titles}}</h3>
                                    <div class="Grade_class">
                                        <div>班级 <span></span> 姓名<span></span></div>
                                    </div>
                                </div>
                                <div class='tableBox' v-for="(row,rowind) in BgdXmInfoList" :key="rowind"
                                v-if='preVInd == index'>
                                    <table-content :isyl="isyl" :isedit="false" :dataSource="row" :num="num"></table-content>
                                </div>
                                    
                                </el-row>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 添加主题活动类型确认弹窗 -->
        <el-dialog title="添加主题活动项目" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-radio-group v-model="radio">
                <el-radio :label="12">寄语、附言</el-radio>
                <el-radio :label="13">活动分析表</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancell">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除报告单内容项 -->
        <el-dialog title="确定删除？" :visible.sync="deldialogVisible" width="30%" :before-close="cancelldel">
            <span>确认删除？删除后将无法恢复！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelldel">取 消</el-button>
                <el-button type="primary" @click="confirmdel">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除表格数据 -->
        <el-dialog title="确定删除？" :visible.sync="pjdialogVisible" width="30%" :before-close="cancelldelpjx">
            <span>确认删除？删除后将无法恢复！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelldelpjx">取 消</el-button>
                <el-button type="primary" @click="confirmdelpjx">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="dialogPictureVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

    </div>
</template>

<script>
  import _ from 'lodash';
  import Cookies from 'js-cookie'
  import Hamburger from 'components/Hamburger'; // 拖拽组件
  import * as mainPapi from 'api/project/mainProject/index'
  import * as detailPapi from 'api/project/projectDetail/index'
  import * as reportapi from "api/project/report/index"
  import * as avtive from "api/project/reportActive/index" // 主题活动报告单主用api
  import {
    getXxdmInfo
  } from 'api/admin/school/index'
  import TableCom from '../Assembly/TableCom' // 项目表格组件
  import RichText from '../Assembly/RichText' // 富文本框
  import TableContent from '../Assembly/TableContent' // 预览报告单保单组件


  export default {
    name: "setReport",
    components: {
      Hamburger,
      TableCom,
      RichText,
      TableContent
    },
    data() {
      return {
        xhzf: '',
        isfocks: false,
        pjdialogVisible: false,
        deldialogVisible:false,
        isyl:true, // 是否为预览页
        titles: window.localStorage.getItem('reportname'),
        pjxlist:[], // 评价项数据暂存
        tableData:{
            sfzs: false,
            px: 0,
            lx: 13,
            bjzt: false,
            bm: '',
            fy: '',
            pfbzewm: false, // 评分标准二维码
            pfbznr: '', // 评分标准内容
            hdfxgxpjList: [], //活动分析个性评价集合
            tablehead: [
                {label: '', id: 'mc'},
                {label: '我的表现', id: 'zgdf'},
                {label: '小组情况', id: 'xzqk'},
                {label: '全班情况', id: 'qbqk'},
            ],
            tablestatues: [
                // {mc: '', zgdf: 3, xzqk: [{pjz:'A',num:10,djW:'25%'},{pjz:'B',num:10,djW:'25%'},{pjz:'C',num:10,djW:'25%'}], qbqk: [{pjz:'A',num:10,djW:'25%'},{pjz:'B',num:10,djW:'25%'},{pjz:'C',num:10,djW:'50%'}]},
                // {mc: '', zgdf: 3, xzqk: [{pjz:'A',num:10,djW:'25%'},{pjz:'B',num:10,djW:'25%'},{pjz:'C',num:10,djW:'25%'}], qbqk: [{pjz:'A',num:10,djW:'25%'},{pjz:'B',num:10,djW:'25%'},{pjz:'C',num:10,djW:'50%'}]},
            ],
        }, // 表格数据
        num: 3,
        dataSource: {
        tableheader: [{
            label: '我的表现'
            },
            {
            label: '小组情况'
            },
            {
            label: '全班情况'
            }
        ],
        tabledata: [],
        },
        checklist: [], // 选中项目数据暂存
        listindex: 0, // 项目列表index暂存
        form: { // 附言寄语表单
          wjList: [],
          lx: 12,
          bm: '附言、寄语',
          fy: '请输入内容...',
          px: 0,
          pfbzewm: false,
          pfbznr: '',
          sfzs: false,
          hdfxxmList: [],
          hdfxgxpjList: []
        },
        showtype: 0, // 左侧点选右侧显示类型
        title: '',
        thematicindex: 0, // 主题活动index暂存
        radio: 12, // 默认选择文本输入框
        dialogVisible: false, // 弹层控制 

        xxlm: '', //学校类型码   -- 007 职高
        xxdm: window.localStorage.getItem('xxdm'),
        reportInfo: { //报告基础信息
          xn: window.localStorage.getItem('reportxn'),
          xq: window.localStorage.getItem('reportxq'),
          mbx: window.localStorage.getItem('reportmbx'), //报告单内容类型
          bgdid: window.localStorage.getItem('reportid'), //报告单内容类型
          mc: window.localStorage.getItem('reportname'), //报告单内容类型
        },
        bgdmbxList: [], //报告单模板项
        SpecialList: [], //根据模板项设定的除课程以外的其他基础设置
        isHasKC: false, //根据模板项设定的是否有课程
        isCreate: false, //判断报告单是否新建 还没有设置

        step: 'step0', //设置完成的步骤
        //基础设置
        kcList: [], //课程
        uniftList: [], //课程
        kcidAll: [],
        njList: [], //用户年级
        njdmSel: [], //所选年级代码
        njListSel: [], //所选年级的详细内容
        btnLimt: false, //防止重复提交BUG
        //内容设置
        // checkedlogo: false, //是否添加学校水印
        nrsetclassInd: 0, //默认选择第一个class
        // curTabkcList: [], //所tab的班级的课程
        dataIndex: 0, //内容设置当前所选科目的index
        isDrag: false, //是否拖拽
        StepdraggingCard: {}, //当前拖拽的item
        curLeftkcData: {}, //内容设置--当前所选科目info
        logofile: [], //上传的logo
        dialogPictureVisible: false,
        dialogImageUrl: '',

        defaultProps: {
          children: 'TxmList',
          label: 'mc'
        },
        curxmList: [], //当前的项目列表
        curtjData: {}, //当前所选基础设置
        listQuery: {
          xxdm: window.localStorage.getItem('xxdm'),
          xn: window.localStorage.getItem('reportxn'),
          xq: window.localStorage.getItem('reportxq'),
          kcIds: null,
          zyIds: null,
          njdms: null,
          fjxmId: null,
        },
        repbgdszList: [], //所获取的报告单设置
        //预览报告单
        preVInd: 0,
        BgdXmNjdm: '',
        BgdXmInfoList: [],
        winW: '', //屏幕宽度    

        spanArr: [],
        pos: '',
        bgdxid: '',
        deldatas: {},
        delindex: 0,
        delinfoindex: 0,
        // rechtext: false, // 是否显示富文本框
      }
    },
    computed: {
      headers: function () {
        return {
          Authorization: Cookies.get("Admin-Token"),
          ReturnResultCode: true
        }
      },
    },
    created() {
        this.winW = document.body.clientWidth
    },
    mounted() {
      this.init()
    },
    methods: {
        async init(){
          this.getDicy()
          setTimeout(() => {
          }, 10)
        },

        ddtjxm(){
          let obj = this.njListSel[this.thematicindex].bgdszList[this.dataIndex]
          console.log(obj)
          // if (obj.lx === 13) {
            // if (obj.hdfxxmList.length) {
            //   let sftj = true
            //   sftj = _.find(obj.hdfxxmList, function(el) {
            //     if (el.mc === '') {
            //       return false
            //     }
            //   })
              // if (!sftj) {
              //   this.tipsXX('你有信息未填写请检查填写完整后再提交！', 'warning', '提示');
              // } else {
                let params = {
                  xxdm: this.listQuery.xxdm,
                  bgdid: this.reportInfo.bgdid,
                  njdm: this.njListSel[this.thematicindex].njdm,
                  setting: obj
                }
                avtive.SavereportsetOne(params).then(data => {
                  // console.log(data)
                  if (data.status === 1) {
                    this.tipsXX(data.message, 'success', '提示');
                    // this.getReport();
                  } else {
                    this.tipsXX(data, 'warning', '提示');
                  }
                })
              // }
            // }
          // }
          
        },
        // 寄语附言失焦
        jyfysj(){
          if (this.form.bm === '') {
            this.form.bm = '寄语、附言'
          }
        },

        // 数据格式整理
        Formatarrangement(datas){
          
          datas = _.sortBy(datas,['px']);

          if (datas.length) {
            datas.forEach((el, index) => {
              if (el.lx === 12) {
                this.BgdXmInfoList.push({
                  lx: el.lx,
                  info: {
                    bm: el.bm,
                    fy: el.fy,
                    hdfxgxpjList: el.hdfxgxpjList,
                    hdfxxmList: el.hdfxxmList,
                    lx: el.lx,
                    pfbzewm: el.pfbzewm,
                    pfbznr: el.pfbznr,
                    px: el.px,
                    sfzs: el.sfzs,
                    uuid: el.uuid,
                    wjList: el.wjList,
                    xmid: el.xmid,
                  }
                })
              } else if (el.lx === 13) {
                this.BgdXmInfoList.push({
                  lx: el.lx,
                  info: {
                      sfzs: el.sfzs,
                      px: el.px,
                      lx: el.lx,
                      bjzt: el.bjzt,
                      bm: el.bm,
                      fy: el.fy,
                      pfbzewm: el.pfbzewm, // 评分标准二维码
                      pfbznr: el.pfbznr, // 评分标准内容
                      hdfxgxpjList: el.hdfxgxpjList,
                      hdfxgxpjList1: el.bjzt?this.echartsstatus(el.hdfxgxpjList):el.hdfxgxpjList,
                      tablehead: [
                        {label: '', id: 'mc'},
                        {label: '我的表现', id: 'zgdf'},
                        {label: '小组情况', id: 'xzqk'},
                        {label: '全班情况', id: 'qbqk'},
                      ],
                      tablestatues: this.tabledata(el.hdfxxmList)
                    }
                })
              }
            })
          }
        },
        // echarts 数据处理
        echartsstatus(datas){
          var obj = {
            name: [],
            value: []
          }
          if(datas.length){
            datas.forEach(el => {
              obj.name.push(el.mc)
              obj.value.push(el.bjbl)
            })
          }
          return obj
        },
        // 表格项目返回数据(数据预览使用)
        tabledata(datas){
          var arr = []
          if (datas.length) {
            datas.forEach(el => {
              arr.push(
                {mc: el.mc, uuid: el.uuid, zgdf: el.zgdf, xsdf: el.xsdf, xzqk: [{pjz:1,num:10,djW:'25%'},{pjz:2,num:10,djW:'25%'},{pjz:3,num:10,djW:'25%'}], qbqk: [{pjz:1,num:10,djW:'25%'},{pjz:2,num:10,djW:'25%'},{pjz:3,num:10,djW:'50%'}]}
              )
            })
          }
          return arr
        },


        // 评价项失去焦点触发
        pjxblur(){
            this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxgxpjList = this.tableData.hdfxgxpjList
        },
        // 评分标准二维码失去焦点触发
        blurpfbz(){
            this.njListSel[this.thematicindex].bgdszList[this.dataIndex].pfbznr = this.tableData.pfbznr
        },
        // 是否选择评分标准二维码
        selectpfbz(val){
            this.tableData.pfbzewm = val
            this.njListSel[this.thematicindex].bgdszList[this.dataIndex].pfbzewm = val
        },
        // 班级整体是否勾选
        selectbjzt(val){
            // console.log(val)
            this.tableData.bjzt = val
            this.njListSel[this.thematicindex].bgdszList[this.dataIndex].bjzt = val
        },
        // 删除评价项
        clearpjx(datas, index){
          // console.log(datas)
          if (datas.uuid) {
            avtive.delhdpj({SchoolCode: this.listQuery.xxdm, Id: datas.uuid, Force: true}).then(data => {
              if (data.status === 1) {
                this.tableData.hdfxgxpjList.splice(index, 1)
              } else {
                this.tipsXX(data.message, 'warning', '提示');
              }
            })
          } else {
            this.tableData.hdfxgxpjList.splice(index, 1)
          }  
        },
        // 添加评价项
        addpjx(){
            if (this.tableData.hdfxgxpjList.length<12) {
                this.tableData.hdfxgxpjList.push({
                  mc: ''
                })
            } else {
              this.tipsXX('最多添加12项!', 'warning', '提示');
            }
            
        },
        // 添加项目
        addproject(){
          if (this.tableData.tablestatues.length<12) {
            this.tableData.tablestatues.push(
              { 
                uuid: '',
                // xh: this.tableData.tablestatues.length,
                xh: this.xhzf = this.guid(),
                mc: '', zgdf: 3,
                xzqk: [{pjz: 2,num:10,djW:'25%'},{pjz:1,num:10,djW:'25%'},{pjz:3,num:10,djW:'25%'}],
                qbqk: [{pjz: 1,num:10,djW:'25%'},{pjz:2,num:10,djW:'25%'},{pjz:3,num:10,djW:'50%'}]
              }
            )
            // this.tableData.tablestatues.forEach((el, index) => {
              // if (this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList.length === 0) {
                this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList.push(
                  {
                    uuid: '',
                    xh: this.xhzf,
                    mc: '',
                    zgdf: 3,
                  }
                )
              // }
              
            // })
          } else {
            this.tipsXX('最多添加12项!', 'warning', '提示');
          }
        },
        S4(){
          return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },
        guid() {
          return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
        },
        // 更改别名
        changebm(){
          if (this.tableData.bm === '') {
            this.tableData.bm = '活动分析表'
            this.njListSel[this.thematicindex].bgdszList[this.dataIndex].bm = '活动分析表'
          } else {
            
            this.njListSel[this.thematicindex].bgdszList[this.dataIndex].bm = this.tableData.bm
          }
          
        },
        // 项目输入框失去焦点
        blur(datas){
          console.log(datas)
          if (datas.mc !== '') {
            if (datas.uuid) {
              this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList.forEach((el,index) => {
                // console.log(el)
                if (el.uuid === datas.uuid) {
                  this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList[index].mc = datas.mc
                }
              })
            } else {
              if (this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList.length===datas.xh) {
                console.log(33333333)
                this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList.push({mc:datas.mc, zgdf: datas.zgdf,xh:datas.xh})
                
              } else {
                // console.log(this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList)
                this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList.forEach((el, index) => {
                  console.log(el)
                  if (el.xh === datas.xh) {
                    this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList[index].mc = datas.mc
                  }
                })
              }
            }
          }
        },
        // 删除主题活动表格数据
        delect(datas, index){
          this.tableData.tablestatues.forEach((dd, ddindex) => {
            if (datas.uuid !== '') {
              if (datas.uuid === dd.uuid) {
                avtive.delhdfxx({SchoolCode: this.listQuery.xxdm, Id: dd.uuid, Force: true}).then(data => {
                  if (data.status === 1) {
                    this.tableData.tablestatues.splice(ddindex, 1)
                    this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList.splice(ddindex, 1)
                  } else {
                    this.tipsXX(data.message, 'warning', '提示');
                  }
                })
              }
            } else {
              if (datas.xh === dd.xh) {
                this.tableData.tablestatues.splice(ddindex, 1)
                this.njListSel[this.thematicindex].bgdszList[this.dataIndex].hdfxxmList.splice(ddindex, 1)
              }
            }   
          })
        },

        confirmdelpjx(){

        },
        cancelldelpjx(){
          this.pjdialogVisible = false
        },
        // 删除报告单项
        delect_active(datas, index, item){
          this.deldatas = datas,
          this.delindex = index,
          this.delinfoindex = item
          this.bgdxid = datas.uuid?datas.uuid:''
          this.deldialogVisible = true
          // console.log(this.njListSel[this.thematicindex].selkcListlx)
        },
        // 确认删除报告单项
        confirmdel(){
          if (this.bgdxid === '') {
            this.deldialogVisible = false
            this.njListSel[this.thematicindex].bgdszList.splice(this.delinfoindex, 1)
            this.njListSel[this.thematicindex].selkcListlx.splice(this.delinfoindex, 1)
          } else {
            avtive.delBgdSz({xxdm: this.xxdm, id: this.bgdxid}).then(data => {
              this.tipsXX("删除成功",'success','成功');
              this.deldialogVisible = false
              this.njListSel[this.thematicindex].bgdszList.splice(this.delinfoindex, 1)
            }).catch(err => {
              this.deldialogVisible = false
            })
          }
        },
        // 取消删除报告单项
        cancelldel(){
          this.bgdxid = ''
          this.deldialogVisible = false
        },

        // 切换年级数据
        handleTabclass(val) {
          this.thematicindex = val.index
          if (this.njListSel[this.thematicindex].bgdszList.length !== 0) {
            this.selectRowKc(this.njListSel[this.thematicindex].bgdszList[0],0)
          } else {
            this.showtype = 0
          }
          // console.log(val)
          // console.log(this.njListSel)
          var that = this
          this.njListSel.forEach((el, index) => {
            // console.log(el)
            if (el.bgdszList.length) {
              // el.bgdszList.forEach((item, iteindex) => {
                // if (item.sfzs) {
                  // console.log('呵呵呵')
                  // that.$refs.multipleTable[index].toggleRowSelection(item)
                  // setTimeout(() => {
                  //   that.$refs.multipleTable[index].toggleRowSelection(item)
                  // },300)
                // }
              // })
            }
          })
          
        },

        // 富文本失去焦点触发事件
        onEditorBlur(editor) {
            // console.log(editor)
            // console.log('失去焦点')
            // console.log(editor.container.innerHTML)
        },

        // 富文本获取焦点触发事件
        onEditorFocus(editor) {
            // console.log(editor)
        },

        // 编辑器准备完毕触发事件
        onEditorReady(editor) {
            // console.log(editor)
        },

        // 富文本编辑器内容数据发生改变触发事件
        onEditorChange({
            editor,
            html,
            text
        }, type) {
          if (type === 12) {
            // console.log(this.njListSel[this.thematicindex].bgdszList,"aaabbb")
            this.njListSel[this.thematicindex].bgdszList[this.dataIndex].fy = html
            this.form.fy = html
          } else {
            this.njListSel[this.thematicindex].bgdszList[this.dataIndex].pfbznr = html
            this.tableData.pfbznr = html
          }
        },

        // 确认添加活动项目，并隐藏数据
        confirm() {
            if (this.radio === 12) { // 添加类型为寄语附言型
            this.njListSel[this.thematicindex].bgdszList.push({
              xh:this.njListSel[this.thematicindex].bgdszList.length,
              wjList: [],
              lx: this.radio,
              bm: '附言、寄语',
              fy: '请输入内容',
              px: this.listindex,
              pfbzewm: false,
              pfbznr: '',
              sfzs: false,
              hdfxxmList: [],
              hdfxgxpjList: []
            })
            } else { // 添加类型为活动分析表类型
              this.njListSel[this.thematicindex].bgdszList.push({
                xh:this.njListSel[this.thematicindex].bgdszList.length,
                wjList: [],
                lx: this.radio,
                bm: '活动分析表',
                fy: '',
                px: this.listindex,
                bjzt: false,
                pfbzewm: false,
                pfbznr: '',
                sfzs: false,
                hdfxxmList: [],
                hdfxgxpjList: []
              })
            }

            this.dialogVisible = false
        },
        
        // 取消添加项目
        cancell() {
            this.dialogVisible = false
        },
        
        // 关闭模态框
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        // 新增主题活动项目
        Add_Thematic_Activities(index, val) {
          if (this.njListSel[this.thematicindex].bgdszList.length) {
            if (this.njListSel[this.thematicindex].bgdszList.length < 12) {
              this.thematicindex = index
              this.dialogVisible = true
              this.listindex = this.njListSel[this.thematicindex].bgdszList.length
            } else {
              this.tipsXX('最多添加12项!', 'warning', '提示');
            }
          } else {
            this.dialogVisible = true
            this.listindex = 0
          }
        },
        //获取报告单设置
        getReport(){
            var that = this
            reportapi.GetReportSetting({id:this.reportInfo.bgdid}).then(response => {

              for(var i=0;i<response.njSzList.length;i++){
                response.njSzList[i].bgdszList = _.sortBy(response.njSzList[i].bgdszList,['px']);
              }
              // console.log('3333333333333')
              // console.log(response)
              if (response.njSzList.length) {
                response.njSzList.forEach((el, index) => {
                  that.njList.forEach((item, indexs) => {
                      if (item.njdm === el.njdm) {
                        that.njdmSel.push(el.njdm)
                        that.njListSel.push({
                          bgdszList: el.bgdszList?el.bgdszList:[],
                          bjid: '',
                          kcid: '',
                          njdm: el.njdm,
                          njlxdm: item.njlxdm,
                          njlxmc: item.njlxmc,
                          njmc: item.njmc,
                          uuid: item.uuid,
                          xssx: item.xssx,
                          xxdm: item.xxdm,
                        })
                      }
                  })
                })
              }
            })
        },
        // xh:this.njListSel[this.thematicindex].bgdszList.length,
        // wjList: [],
        // lx: this.radio,
        // bm: '活动分析表',
        // fy: '',
        // px: this.listindex,
        // bjzt: false,
        // pfbzewm: false,
        // pfbznr: '',
        // sfzs: false,
        // hdfxxmList: [],
        // hdfxgxpjList: []
        bgsz(as){
          var a = []
          // if (as.length) {
          //   as.forEach((ite, ited) => {
          //     a.push({
          //       xh: item+1,
          //       hdfxgxpjList: ite.hdfxgxpjList,
          //       hdfxxmList:
          //       sfzs:
          //       pfbznr:
          //       pfbzewm:
          //       bjzt:
          //       px:
          //       fy:
          //       bm:
          //       lx:
          //       wjList:
          //       xh:
          //     })
          //   })
          // }
        },
        // bgdszstatus(datas){
        //   var arr = []
        //   datas.forEach(el => {
        //     this.$set(el, 'sfzs', true)
        //     this.$set(el, 'isSelect', true)
        //   })
        //   arr = datas
        //   return arr
        // },

        //基础信息获取(年级\报告单模板项)
        getDicy() {
            var that = this
            mainPapi.getNj({
            xxdm: this.xxdm,
            page: 1,
            limit: 50,
            }).then(response => {
            // console.log(response)
            this.njList = response.data.rows
            this.getReport()
            })
        },
        handleTab(val) {
          if (val.name === 'step0' || val.name === 'step1') {
            var that = this
            this.njListSel.forEach((el, index) => {
              // console.log(el)
              if (el.bgdszList.length) {
                el.bgdszList.forEach((item, iteindex) => {
                  if (item.sfzs) {
                    that.$refs.multipleTable[index].toggleRowSelection(item)
                  }
                })
              }
            })
          }
            // this.step = val.name
        },
        //选择年级
        handleSelNj(val, item) {
          // console.log(val)
          // console.log(item)
          // console.log(this.njdmSel)
          if (val) { // 设置报告单设置list
            this.$set(item, 'bgdszList', [])
            this.njListSel.push(item)
          } else {
            const index = this.njListSel.indexOf(item);
            this.njListSel.splice(index, 1);
          }
        },
        handleSelectionChange(val) {

        },
        handleSelect(selection, row) {
          // console.log('我也不知道')
          // console.log(selection)
          // console.log(row)
          // this.pjxlist = selection
          var isSelect = false
          selection.forEach(i => {
            if (row.uuid && i.uuid === row.uuid) {
              isSelect = true
            }
            if (i.px === row.px) {
              isSelect = true
            }
          })
          this.$set(row, 'sfzs', isSelect)
          this.$set(row, 'isSelect', isSelect)
          // console.log(row)
          // console.log(this.njListSel[this.thematicindex].bgdszList)
        },
        //拖拽
        handleDragStart(ev, xm) {
          this.StepdraggingCard = xm
          this.isDrag = true
        },
        handleDragend() {
          this.StepdraggingCard = null
          this.isDrag = false
        },
        handleDropOver(ev) {
          ev.preventDefault();
          ev.dataTransfer.dropEffect = 'move'  // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
        },
        handleDrop(ev, item, datas) {
          ev.preventDefault();
          if (this.isDrag) {
              ev.dataTransfer.effectAllowed = 'move'// 为需要移动的元素设置dragstart事件
              var curdrag = item.indexOf(this.StepdraggingCard)     //当前拖拽的
              var target = item.indexOf(datas)                        //目标
              this.$set(item,curdrag,datas)
              this.$set(item,target,this.StepdraggingCard)
              this.dataIndex = target
          }
        },
        toggleSideBar() {},
        //科目列表选中样式切换
        tableRowClassName({row, rowIndex}) {
          row.index = rowIndex;
          if (rowIndex == this.dataIndex) {
            return 'selectedRow';
          }
          return '';
        },
        //项目列表选择
        selectRowKc(row, index) {
          this.showtype = 0
          setTimeout(() => {
            this.logofile = []
            this.tableData.tablestatues = []
            this.tableData.hdfxgxpjList = []
            this.showtype = row.lx
            this.form = {}
            if(this.showtype === 12){
              this.form = row
              setTimeout(() => {
                row.wjList.forEach(el => {
                  this.logofile.push({
                    name: '',
                    url: el.dz,
                    uuid: el.uuid,
                    lx: el.lx
                  })
                })
                document.getElementById('isinput').focus()
              }, 100)
                
            } else {
                row.wjList.forEach(el => {
                  this.logofile.push({
                    name: '',
                    url: el.dz,
                    uuid: el.uuid,
                    lx: el.lx
                  })
                })
                this.tableData.pfbzewm = row.pfbzewm // 评分标准二维码勾选值
                this.tableData.bjzt = row.bjzt // 班级整体情况勾选值
                this.tableData.pfbznr = row.pfbznr // 评分标准内容
                this.tableData.bm = row.bm
                if (row.hdfxxmList.length) {
                  row.hdfxxmList.forEach((el, index) => {
                    this.tableData.tablestatues.push(
                      {xh: index, uuid: el.uuid, mc: el.mc, zgdf: el.zgdf, xzqk: [{pjz:1,num:10,djW:'25%'},{pjz:2,num:10,djW:'25%'},{pjz:3,num:10,djW:'25%'},{pjz:0,num:10,djW:'25%'}], qbqk: [{pjz:1,num:10,djW:'25%'},{pjz:2,num:10,djW:'25%'},{pjz:3,num:10,djW:'50%'}]}
                    )
                  })
                } else {
                    this.tableData.tablestatues = []
                }
                if (row.hdfxgxpjList.length) {
                    this.tableData.hdfxgxpjList = row.hdfxgxpjList
                } else {
                    this.tableData.hdfxgxpjList = []
                }
                setTimeout(()=>{
                  document.getElementById('isinput').focus()
                }, 0)
            }
            this.dataIndex = row.index;
          }, 300)
          
        },
        //内容设置-- 预览       (科目) 
        ShowPopover(row) {
            this.$set(row, 'isPopover', true)
        },
        HidePopover(row) {
            this.$set(row, 'isPopover', false)
        },
        //右侧项目多选
        handleCheckTreeChange(val, data) {
            var that = this
            var rwcheck = [],
            xmcheck = []
            data.checkedNodes.forEach(a => {
            if (a.jflx != undefined) {
                xmcheck.push(a.uuid)
            } else {
                rwcheck.push(a.uuid)
            }
            })
            this.$set(this.curLeftkcData, 'currwcheck', rwcheck)
            this.$set(this.curLeftkcData, 'curxmcheck', xmcheck.concat(data.halfCheckedKeys))
            this.$set(this.curLeftkcData, 'curcheck', (rwcheck.length > 0) ? rwcheck : xmcheck)
        },
        //保存-
        saveReport(type) {
          //   基础设置
          if (type == 'step0') { // && (this.njdmSel&&this.njdmSel.length>0)
            if (this.njListSel.length) {
              this.step = 'step1'
              console.log(this.njListSel)
              this.njListSel = _.sortBy(this.njListSel,['xssx'])
              console.log('我是arr')
              console.log(this.njListSel)
              var that = this
              if (this.njListSel[0].bgdszList && this.njListSel[0].bgdszList.length) {
                this.selectRowKc(this.njListSel[0].bgdszList[0],0)
                // 将以经选中的要显示的数据项默认勾选
                
                this.njListSel.forEach((el, index) => {
                  // console.log(el)
                  if (el.bgdszList.length) {
                    el.bgdszList.forEach((item, iteindex) => {
                      if (item.sfzs) {
                        that.$refs.multipleTable[index].toggleRowSelection(item)
                      }
                    })
                  }
                })
              }
            } else {
              this.tipsXX('请先选择活动班级!', 'info', '提示');
            }
          }

          //  内容设置
          if (type == 'step1') {
            // console.log(44444)
            // console.log(this.pjxlist)
            console.log(this.njListSel,"5566")

            for(var i=0;i<this.njListSel.length;i++){
              for(var j=0;j<this.njListSel[i].bgdszList.length;j++){
                this.njListSel[i].bgdszList[j].px = j
              }
            }

            var params = {
              bgdid: this.reportInfo.bgdid,
              xxsy: '',
              zssy: false,
              njSzList: this.njListSel
            }
            var that = this

            


            console.log(params)

            reportapi.SaveReportSetting(params).then(response => {
              if (response === '附言最多1000字') {
                this.tipsXX(response, 'waring', '提示');
              } else {
                this.njListSel.forEach((el, index) => {
                  if (el.bgdszList.length) {
                    el.bgdszList.forEach((item, iteindex) => {
                      if (item.sfzs) {
                        that.$refs.multipleTable[index].toggleRowSelection(item)
                      }
                    })
                  }
                })
                console.log(response)
                this.step = 'step2'
                this.handlePreview()
              }
            })
            
          }
        },

        // 提示信息
        tipsXX(data, xxtype, tit) {
            this.$notify({
            title: tit,
            message: data,
            type: xxtype,
            duration: 2000
            });
        },
        //附言保存
        clickfysure() {
            // console.log(this.curxmList)
        },
        //上传图片的放大
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogPictureVisible = true;
        },
        //上传删除的回调
        handlePictureRemove34(file, fileList) {
          console.log(file)
          console.log(fileList)
          if(file.status === 'success'){
            avtive.delwj({id: file.uuid}).then(data => {
              // console.log(data)
              if (data.status === 1) {
                this.logofile = []
                this.logofile.forEach((el, index) => {
                  if (el.uuid === file.uuid) {
                    this.logofile.splice(index, 1)
                  }
                })
                this.njListSel[this.thematicindex].bgdszList[this.dataIndex].wjList.forEach((el, index) => {
                  if (el.uuid === file.uuid) {
                    this.njListSel[this.thematicindex].bgdszList[this.dataIndex].wjList.splice(index, 1)
                  }
                })
              }
            })
          } else {
            this.logofile = []
            this.njListSel[this.thematicindex].bgdszList[this.dataIndex].wjList.forEach((el, index) => {
              if (el.uuid === file.uuid) {
                this.njListSel[this.thematicindex].bgdszList[this.dataIndex].wjList.splice(index, 1)
              }
            })
          }
          
          
        },
        // 图文录入--上传成功后的回调
        uploadSuccessPic(res, file, fileList) {
            // console.log(res)
            // console.log(file)
            // console.log(fileList)
            if (res.status == 200) {
                
                var allImgL = [];
                this.logofile = [];
                // if (fileList && fileList.length > 0) {
                    // fileList.forEach(function (item, ind) {
                    // if (item.response) {
                this.logofile.push({
                    uuid: res.value.data.uuid,
                    url: res.value.data.webUrl,
                })
                this.njListSel[this.thematicindex].bgdszList[this.dataIndex].wjList.push({
                    uuid: res.value.data.uuid,
                    dz:res.value.data.webUrl,
                })
                    // }
                    // })
                // }
                // this.logofile
                // this.njListSel[this.thematicindex].bgdszList[this.dataIndex].wjList = allImgL
                // console.log(this.logofile)
            } else {
                this.tipsXX(res.resultMessage, 'error', '失败');
            }
        },
        // 图文录入--上传前对文件的大小的判断
        BatchbeforeUploadPictures(file) {
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          let isLt2M = file.size / 1024 / 1024 < 1
          if (!isJPG && !isPNG) {
          this.tipsXX('上传图片只支持jpg/png格式', 'info', '提示');
          } else if (!isLt2M) {
          this.tipsXX('上传模板大小不能超过 1MB', 'info', '提示');
          }
          return (isJPG || isPNG) && isLt2M
        },
        //预览报告单
        handleTabPrev(val) {
            // console.log(val)
            this.handlePreview()
        },
        handlePreview() {
            var bgdXmData = {
            Xxdm: this.xxdm,
            BgdId: this.reportInfo.bgdid,
            Njdm: this.njListSel[this.preVInd].njdm
            // this.njListSel[this.preVInd].njdm
            }
            var that = this
            this.BgdXmInfoList = []
            avtive.Getylbgd(bgdXmData).then(res => {
                console.log(res)
                if (res.status === 1) {
                    that.Formatarrangement(res.data)
                } else {
                    that.tipsXX(res.message, 'info', '提示')
                }
            })
        }
    }
  }
</script>

<style scoped lang="scss">
.u_TableMain{
    /deep/ .el-tabs__header{
        margin: 0;
    }
}

    .gxpj_box_left{
        width: 220px;
        min-height: 300px;
        float: left;
    }
    .gxpj_box_right{
        width: 70%;
        min-height: 300px;
        border-left: 1px solid #eee;
        float: left;
        position: relative;
        .pjz_btn{
            position: absolute;
            bottom: 10px;
            left: 45%;
        }
    }
  /* .list-item{
        height: 50px;
        border-bottom: 1px solid #eee;
        line-height: 50px;
        text-align: center;
    } */
  .app-container {
    min-width: 920px;
  }

  .mpt {
    margin-bottom: 20px;
  }

  .el-card {
    cursor: default;

    .partbox {
      border-top: 1px solid #ebeef5;
      padding: 0 10px;
    }

    .title {
      font-size: 16px;
      padding: 20px 0
    }

    .pbcon {
      margin-bottom: 5px;
    }
  }

  .report-footer {
    margin-top: 30px;
  }

  .step1box {
    min-height: 600px;
  }
  .step_foot{
    height: 100px;
    line-height: 100px;
    width: 450px;
    margin: 35px auto;

    .uploadlogo {
      float: left;
      position: relative;
      .tit {
        float: left;
      }

      .uploadpt {
        float: left;
        margin: 0 10px;
        width: 100px;
        height: 100px;
      }
    }
  }
  .step1foot {
    height: 100px;
    line-height: 100px;
    width: 140px;
    margin: 35px auto;

    .uploadlogo {
      float: left;
      position: relative;
      .tit {
        float: left;
      }

      .uploadpt {
        float: left;
        margin: 0 10px;
        width: 100px;
        height: 100px;
      }
    }
  }

  .dragcon {
    float: left;
    width: 250px;
    border: 1px solid #ebeef5;
    margin-right: 10px;
    .addThematic{
        width: 100%;
        border-radius: 0;
    }
    .dragTable{
        position: inherit;
    }
    .el-icon-circle-close{
        cursor: pointer;
    }
    .drag {
      float: left;
      cursor: move;
      font-size: 26px;
      fill: #ccc;
    }

    .con {
      float: left;
    }

    .txthid {
      width: 180px;
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .tPopBoxTable {
    .blockcol {
      width: 100%;
      height: 24px;

      span {
        float: left;
        height: 24px;
        color: #fff;
        font-size: 12px;
        text-align: center;
      }

      .colA {
        background: #409EFF;
      }

      .colB {
        background: #ff8c00;
      }

      .colC {
        background: #ccc;
      }

      .colD {
        background: #ffd700;
      }
    }
  }

  .fybtn {
    text-align: center;
    margin-top: 20px;
  }

  .ptips {
    margin-bottom: 10px;
  }

  .tableBox {
    /* border: 1px solid #ccc; */
    /* height: 750px; */
    overflow: hidden;
    /* padding: 10px 20px; */
    /* margin-bottom: 10px; */

    .tabtit {
      text-align: center;
      padding: 5px 0;
      height: 32px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
      font-size: 16px;
    }

    .tabinfo {
      height: 32px;
      padding: 5px 0;

      .rol {
        position: relative;
      }

      span {
        width: 40px;
        line-height: 22px;
        float: left;
        position: absolute;
        background: #fff;
      }

      i {
        height: 22px;
        line-height: 22px;
        border-bottom: 1px solid #333;
        float: left;
        width: 100%;
      }
    }

    .totilbox {
      .tabcon {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .tabcon {
      .tit {
        margin-bottom: 5px;
      }

      .kcname {
        float: left;
        line-height: 40px;
      }

      .code {
        float: right;
        width: 40px;
        height: 40px;
        background: red;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

    }
  }

  .zqPage {
    width: 800px;

    .zqpgtable {
      float: left;
      margin: 0 10px;
    }
  }

  .prevcol {
    position: relative;
    height: 100%;

    .watermark {
      position: absolute;
      top: 0;
      left: 10px;
      right: 10px;
      z-index: 100;
      height: 100%;
      opacity: .2;

      img {
        width: 100%;
        height: 100px;
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -50px;
        transform: rotate(-30deg);
      }
    }
  }
  .Title_of_report{
      width: 1000px;
      height: 100px;
      margin: auto;
      border: 1px solid #eee;
      h3{
        text-align: center;
      }
      .Grade_class{
          width: 100%;
          text-align: center;
          float: left;
          height: 30px;
          line-height: 30px;
          /* div{
              float: left;
          } */
          span{
              display: inline-block;
              width: 100px;
              height: 30px;
              border-bottom: 1px solid #333;
              margin-right: 5px;
              /* margin-top: 10px; */
          }
      }
  }
  .rich_com {
    margin-top: 20px;
  }
  .hdfxsrk{
    /* width: 114px; */
    /* height: 34px; */
    float: left;
    position: relative;
  }
  .delbtns{
    display: inline-block;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 15px;
    right: 10px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
    border-radius: 0 5px 5px 0;
  }
  .delbtns:hover{
    background-color: #409EFF;
    color: #fff;
  }
    
</style>
<style lang="scss">
  .Tcdreport .el-checkbox {
    margin-right: 10px;
  }

  .Tcdreport .el-checkbox+.el-checkbox {
    margin-left: 0;
  }

  .Tcdreport .el-checkbox.is-bordered+.el-checkbox.is-bordered {
    margin-left: 0;
  }

  .dragcon .el-table_1_column_1 {
    border-right: 1px solid #ebeef5;
  }

  .dragcon label {
    margin-bottom: 0;
  }

  .dragcon .selectedRow td,
  .selectedRow:hover td {
    background-color: #4787f1 !important;
    color: #fff;
  }

  .dragcon .selectedRow td:nth-child(1) {
    background: #ecf3fe !important;
  }

  .uploadpt>div {
    height: 100%;
  }

  .uploadpt .el-upload--picture-card {
    width: 100%;
    height: 100%;
    line-height: 100px;
  }

  .uploadpt .el-upload-list {
    width: 100px;
    height: 100px;
  }

  .uploadpt .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }

  .uploadpt .el-icon-plus {
    font-size: 18px;
  }

  .uploadpt .el-dialog__header {
    padding: 0;
  }

  .uploadpt .el-dialog__headerbtn {
    line-height: 1
  }

  .dragcon .el-icon-tickets {
    cursor: pointer;
    font-size: 16px;
    color: #606266;
  }

  .dragcon .selectedRow .el-icon-tickets {
    color: #fff;
  }

  .el-popover {
    border: none;
  }
</style>
