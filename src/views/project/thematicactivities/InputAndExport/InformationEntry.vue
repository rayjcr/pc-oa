<!--
 * @Description: 主题报告单导入
 * @Author: your name
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-15 10:35:51
 * @LastEditTime: 2019-05-16 09:25:59
 -->
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="form" :model="form">
        <el-row>
            <el-form-item label="">
              <el-input v-model="form.studentN" placeholder="请输入学生姓名" @blur="search" style="width: 150px;"></el-input>
              <el-button type="primary" @click.stop="entry">导入</el-button>
              <el-button type="success" @click.stop="submit('tj')" :loading="sftj">提交</el-button>
            </el-form-item>
        </el-row>
      </el-form>
      <p class="tip"><span>注：</span>此页面用于班主任录入或批量导入【活动分析】【发展建议】等数据。</p>
    </div>
    <div class="table-container">
      <div class="content_left" :class="{'fix':isFix}">
        <tree-comn v-for="(item, index) in datatree" :key="index" :dataSource="item" @checkdetail="checkdetails" @open="opentrs" :treeOpen="treeOpen" :treeid="treeid"></tree-comn>
      </div>
      <!-- 表格信息beg -->
      <div class="content_right">
        <el-card style="padding: 10px 0;margin-left: 20px;min-width: 1000px;">
          <div ref="reportcontent" style="float:left">
            <div class="title"><h3>{{bgdmc}}</h3></div>
            <div class="bjxm">班级<span>{{bj}}</span> 姓名<span>{{xm}}</span></div>
            <div v-for="(row,rowind) in BgdXmInfoList" :key="rowind" style="float:left;min-width:930px;max-width: 950px;">
              <table-content @handleSelxm="handleSelxm" :listindex="rowind" :isyl="isyl" @addrate="addrate" :starable="false" :conwidth="conwidth" :isedit="true" :dataSource="row" :num="num" @select="select" @onEditorChange="onEditorChange"></table-content>
            </div>
          </div>
        </el-card>
      </div>
      <!-- 表格信息end -->
    </div>
    <!-- 导入学生名单beg -->
    <el-dialog title="项目导入" :visible.sync="importXSFormVisible" width="540px" :before-close="importCancel" class="import_box">
      <el-row style="padding: 10px 0;">
        <el-col :span="6" style="line-height:32px">
          执行班级：
        </el-col>
        <el-col :span="6">
          <el-select v-model="bjxx" value-key="bjdm" clearable placeholder="选择班级" @change="choose">
            <el-option v-for="(item,index) in datatree" :key="index" :label="item.bjmc" :value="item"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="padding: 10px 0;">
        <el-col :span="6" style="line-height:32px">
          导入内容：
        </el-col>
        <el-col :span="18">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedPro" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(pro, index) in projectlist" :label="pro.uuid" :key="index">{{pro.bm}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row>
          <el-col :span="6" style="line-height:32px">
            文件选择：
          </el-col>
          <el-col :span="18">
              <el-upload
              :data="dataw"
              :limit="1"
              name="excelfile"   
              ref="cjForm"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              action="/api/netcore/smartcredit/v2/Bgd/ImportExcelBgdxx"
              :headers= headers
              :file-list="fileList"
              :onError="uploadError"
              :onSuccess="uploadSuccess"
              :before-upload="beforeUpload"
              :on-change="onchange"
              :on-remove="onremove"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
          </el-col>  
      </el-row>
      <div slot="footer" class="dialog-footer">
          <el-button size="medium" type="primary" @click="importSubmit('cjForm')" :loading="importLoading">{{'确定'}}</el-button>
          <el-button size="medium" @click="importCancel">取 消</el-button> 
          <el-button size="medium" @click="importMb" :loading="downloads">模版生成<i class="el-icon-download"></i></el-button> 

          <el-row class="import_desc">
              <el-col :span="6" style="line-height:80px">
                  操作说明：
              </el-col>
              <el-col :span="18" style="margin-top: 30px;">
                  <div class="tip">1.请使用本页面提供的模版进行导入</div>
                  <div class="tip">2.请勿修改模版Excel的表头内容</div>
                  <div class="tip">3.模版提供的默认信息，请勿随意修改</div>
                  <div class="tip">4.具有星号（*）的条目为必填项</div>
              </el-col>               
          </el-row>
      </div>
    </el-dialog>
    <!-- 导入学生end -->
  </div>
</template>
<script>
import TableContent from '../Assembly/TableMain'
import TreeComn from '../../zhszReport/inoutReport/TreeComn'
import * as mainapi from "api/project/creditInquiry/index"
import * as avtive from "api/project/reportActive/index" // 主题活动报告单主用api
import { getToken } from '../../../../utils/auth'
const cityOptions = ['上海', '北京', '广州', '深圳'];
export default {
  components: {
    TreeComn,TableContent
  },
  data () {
    return {
      // 生成模板所需数据支持
      checkedPro: [],
      checkAll: false,
      isIndeterminate: true,
      projectlist: [],
      
      bj: '', //  班级名称
      xm: '', // 学生姓名
      isyl:false, // 是否为预览页
      conwidth: true,
      num: 3,
      listQuery:{                
        xxdm: window.localStorage.getItem('xxdm'),
        pageIndex: 1,
        pageSize: 10,
        bgdId: ''
      },
      form: {
        studentN: '',
      }, // 顶部表单数据绑定
      sftj: false, // 是否提交
      treeOpen: false, // 是否打开当前班级列表控制
      treeid: '', // 是否展开班级列表控制依据
      datatree: JSON.parse(window.sessionStorage.getItem('bjsj')), // 班级列表
      zgh: '', // 当前人员职工号
      BgdXmInfoList: [], // 学生报告单数据集合
      bgdmc: '', // 报告单名称
      savelist:{ // 保存学生报告单参数
        xxdm: window.localStorage.getItem('xxdm'),
        bgdid: '',
        bjid: '',
        bjmc: '',
        xh: '',
        inputItemList: []
      },
      xndm: window.sessionStorage.getItem('reportxn'), // 学年代码
      username: window.localStorage.getItem('username'), // 用户账号 （zgh = username去掉学校代码部分的字符串）
      lssj: '', // 富文本框输入修改暂存
      lssjarr:[],
      ready:false, // 上传准备
      importXSFormVisible: false, // 弹层显隐控制
      downloads: false, // 模板生成按钮加载中动画
      importLoading: false, // 确认导入按钮加载中动画
      fileList: [], // 文件列表
      dataw: {},
      // 报告单录入导出模板参数
      bgddcstatus:{
        Xxdm: window.localStorage.getItem('xxdm'),
        BgdId: '', // 报告单编号
        Njdm: '',
        Bjdm: '',
        BgdSzIdList: [], // 录入的报告单设置编号参数
      },
      bjxx:{}, // 录入时选择班级绑定
      // bjlist:[], // 弹窗内班级列表
      echartsdata:{ // echarts数据
        name:[],
        value:[]
      },
      sfwgly: '', // 是否为管理员
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
    // console.log(this.datatree)
    this.init()
    // console.log(this.$refs)
    // console.log(window)
    // this.$refs.reportcontent.scrollTop = 0
    
  },
  methods: {
    // 页面初始化
    init(){
      this.sfwgly = this.$route.query.qx
      this.listQuery.bgdId = this.$route.query.bgdId
      this.savelist.bgdid = this.$route.query.bgdId
      // this.treeid = this.datatree[0].bjdm
      // this.treeOpen = !this.treeOpen
      this.opentrs(this.datatree[0], 'init')
      if(this.sfwgly === 'js'){
        this.checkdetails(this.datatree[0].students[0], this.datatree[0], 'init')
      }
      // avtive.Getxnxq({xxdm: this.listQuery.xxdm}).then(data => {
      //   console.log(data)
      // })
    },

    // 根据班级代码获取班级学生 bjid:bjid, xn: xn, xxdm: xxdm
    getbjstu(datas,str){
      mainapi.Getallbjxslist(datas).then(data => {
        // console.log(data)
        if(data.length){
          this.datatree.forEach(el => {
            if (el.bjdm === datas.bjid) {
              this.$set(el, 'students', data)
              if(str && str === 'init'){
                this.checkdetails(el.students[0], el, 'init')
              } else {
                this.checkdetails(el.students[0], el)
              }
            }
          })
        }
        
      })
    },

    onEditorChange({ editor, html, text,index }){
      // console.log({ editor, html, text })
      // console.log(this.BgdXmInfoList)
      // console.log(index,223399)
      this.lssjarr[index] = html;
      // console.log(this.lssjarr);
      this.lssj = html
    },
    // 保存扩展信息
    savestureport(value, str,item, datas){
      // console.log("aabbcc");
      // console.log(value.inputItemList[0].fy,item.xh,224433);
      avtive.SaveActiveRep(value).then(data => {
        // console.log(data)
        if (data === '保存成功' && str === 'tj') {
          this.$notify({
            title: '提示',
            message: '上传成功',
            type: 'info',
            duration: 1000
          });
        }
        if (data === '保存成功' && str === 'qh') {
          this.savelist.xh = item.xh // 学生报告单学号
          // this.xm = item.xm // 学生姓名
          this.BgdXmInfoList = [] // 清空报告单信息
          this.savelist.inputItemList = []
          this.getstureport(item, datas)
        }
      })
    },
    // 手动提交当前学生活动报告单录入信息
    submit(str,item, datas){
      var that = this
      
      this.BgdXmInfoList.forEach(el => {
        this.savelist.inputItemList.forEach((item,index) => {
          if (el.info.uuid === item.uuid) {
            if (el.lx === 12) {
              that.$set(item, 'fy', that.lssjarr[index])
              that.$set(item, 'hdfxxmList', el.info.hdfxxmList)
              that.$set(item, 'hdfxgxpjList', el.info.hdfxgxpjList)
            } else {
              that.$set(item, 'fy', el.info.fy)
              that.setstatus(el.info.tablestatues, item.hdfxxmList)
              that.setstatus2(el.info.hdfxgxpjList, item.hdfxgxpjList)
            }
          }
        })
      })     
      if (str === 'tj') {
        console.log(this.savelist)
        this.$notify({
          title: '提示',
          message: ' 已保存',
          type: 'info',
          duration: 2000
        });
        // this.savestureport(this.savelist, str,'','')
      } else {
        // if(flg){
        //   this.savelist.inputItemList[0].fy='';
        // }
        // console.log(this.savelist.inputItemList[0].fy,this.savelist.xh,296)
        
        this.lssj = ''// 富文本框清空
        this.lssjarr = []
        this.savestureport(this.savelist, str,item, datas)
      }
    },
    // 表格数据处理
    setstatus(info, datas){
      info.forEach(el => {
        datas.forEach(item => {
          if (el.uuid === item.uuid) {
            this.$set(item, 'xsdf', item.xsdf)
            this.$set(item, 'kzxxid', item.kzxxid)
          }
        })
      })
    },
    // 活动分析项数据处理
    setstatus2(info, datas){
      info.forEach(el => {
        datas.forEach(item => {
          if (el.uuid === item.uuid) {
            this.$set(item, 'wdbq', item.wdbq)
            this.$set(item, 'kzxxid', item.kzxxid)
          }
        })
      })
    },
    // 勾选个性评价项
    select(datas){
      // console.log(datas)
      // console.log(this.BgdXmInfoList)
      
      this.savelist.inputItemList.forEach(el => {
        // console.log(el)
        if (el.hdfxgxpjList) {
          el.hdfxgxpjList.forEach(item => {
            if (item.uuid === datas.uuid) {
              item.wdbq = datas.wdbq
              item.kzxxid = datas.kzxxid
            }
          })
        }
      })
      // console.log('数据暂存')
      // console.log(this.savelist)
    },

    // 评分点击
    addrate(datas){
      // console.log(datas)
      this.savelist.inputItemList.forEach(el => {
        if (el.hdfxxmList) {
          el.hdfxxmList.forEach(item => {
            if (item.uuid === datas.uuid) {
              item.xsdf = datas.xsdf
              item.kzxxid = datas.kzxxid
            }
          })
        }
      })
    },
    handleSelxm(val){
      this.select(val)
    },
    
    // 获取学生报告单数据
    getstureport(item, datas){
      // this.savelist.inputItemList = []
      let params = {
        xxdm: this.listQuery.xxdm,
        bgdId: this.listQuery.bgdId,
        njdm: datas.njdm,
        bjdm: datas.bjdm,
        xh: item.xh
      }
      mainapi.Getreportstatistics(params).then(data => {
        // console.log('报告单数据')
        // console.log(data)
        this.savestatus(data.bgdItemlist)
        this.bgdmc = data.bgd.mc // 报告单名称
        this.Formatarrangement(data.bgdItemlist) // 数据处理
      })
    },

    // 准备提交数据预赋值
    savestatus(datas){
      // console.log('星星')
      if (datas.length) {
        var that = this
        datas.forEach(el => {
          // console.log(el)
          that.savelist.inputItemList.push({
            uuid: el.uuid,
            fy: el.fy,
            hdfxxmList: el.hdfxxmList?that.hdxmstatus(el.hdfxxmList):null,
            hdfxgxpjList: el.hdfxgxpjList?that.hdfxgx(el.hdfxgxpjList):null
          })
        })
        // console.log('数据暂存')
        // console.log(this.savelist)
      }
    },
    hdxmstatus(datas){ // 活动项目数据处理返回目标格式
      var arr = []
      datas.forEach(el => {
        arr.push({
          uuid: el.uuid,
          kzxxid: el.kzxxid,
          xsdf: el.xsdf
        })
      })
      return arr
    },
    hdfxgx(datas){ // 活动分析个性评价数据处理返回目标数据格式
      var arr = []
      datas.forEach(el => {
        arr.push({
          uuid: el.uuid,
          kzxxid: el.kzxxid,
          wdbq: el.wdbq
        })
      })
      return arr
    },

    // 数据格式整理
    Formatarrangement(datas){
      // console.log(datas)
      if (datas.length) {
          datas.forEach((el, index) => {
              if (el.lx === 12) { // 输入框类型
                  this.BgdXmInfoList.push({
                      lx: el.lx,
                      info: {
                          bm: el.bm,
                          fy: el.fy,
                          hdfxgxpjList: el.hdfxgxpjList,
                          hdfxxmList: el.hdfxxmList,
                          lx: el.lx,
                          pfbznr: el.pfbznr,
                          px: el.px,
                          sfzs: el.sfzs,
                          uuid: el.uuid,
                          wjList: el.wjList,
                          xmid: el.xmid,
                      }
                  })
              } else if (el.lx === 13) { // 活动分析表类型
                  this.BgdXmInfoList.push({
                      lx: el.lx,
                      info: {
                          uuid: el.uuid,
                          sfzs: el.sfzs,
                          px: el.px,
                          lx: el.lx,
                          bjzt: el.bjzt,
                          bm: el.bm,
                          fy: el.fy,
                          ewmUrl: el.ewmUrl,
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
      // console.log(this.BgdXmInfoList,446622)
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
    // 表格项目返回数据格式处理为所需格式
    tabledata(datas){
      var arr = []
      if (datas.length) {
        datas.forEach(el => {
          arr.push(
            {kzxxid: el.kzxxid, mc: el.mc, uuid: el.uuid, zgdf: el.zgdf, xsdf: el.xsdf, xzqk: this.fzqk(el.xzqk), qbqk: this.fzqk(el.bjqk)}
            // {pjz:'A',num:10,djW:'25%'},{pjz:'B',num:10,djW:'25%'},{pjz:'C',num:10,djW:'25%'}
            // {pjz:'A',num:10,djW:'25%'},{pjz:'B',num:10,djW:'25%'},{pjz:'C',num:10,djW:'50%'}
          )
        })
      }
      return arr
    },
    fzqk(datas){ // 小组情况/全班情况数据格式化，整合为目标格式
      var arr = []
      var arr1 = []
      var propertyArr = Object.getOwnPropertyNames(datas).sort()
      for(var i = 0;i<propertyArr.length;i++){ 
        datas[propertyArr[i]].star =  JSON.parse(propertyArr[i])
        arr.push(datas[propertyArr[i]])
      }
      // console.log(arr)
      for(var k=0; k<arr.length; k++){
        // console.log(arr[k])
        arr1.push({
          pjz:arr[k].star, num:arr[k].count, djW: arr[k].proportion + '%'
        })
      }
      // console.log(arr1)
      return arr1
    },

    // 搜索学生 
    search(){
      this.datatree = []
      this.getStudent()
    },
    // 获取查询学生
    getStudent () {
      if (this.form.studentN === '') {
        this.datatree = []
        setTimeout(() => {
          this.datatree = JSON.parse(window.sessionStorage.getItem('bjsj'))
        }, 100)
        setTimeout(() => {
          this.init()
        }, 500)  
      } else {
        // console.log(this.xndm)
        var t = this.listQuery.xxdm.length
        this.zgh = this.username.substring(t)
        let params = {
          xxdm: this.listQuery.xxdm,
          zgh: this.zgh,
          xndm: JSON.parse(this.xndm),
          xm: this.form.studentN,
        }
        var str = {}
        this.datatree = []
        avtive.Getjurisdiction(params).then(data => {
          // console.log('搜索数据')
          // console.log(data)
          if (data.data.length) {
            this.datatree = JSON.parse(JSON.stringify(data.data))
          } else {
            this.$notify({
              title: '提示',
              message: ' 未查到该信息',
              type: 'info',
              duration: 2000
            });
            this.datatree = JSON.parse(window.sessionStorage.getItem('bjsj'))
          }
          this.init()
        })
      }
      
    },
    
    // 模板生成
    importMb () {
      this.downloads = true
      
      this.bgddcstatus.BgdSzIdList = this.checkedPro
      // console.log(this.bgddcstatus)
      if (this.bgddcstatus.BgdSzIdList.length) {
        avtive.ImportTemplateDownload(this.bgddcstatus).then(data => {
          // console.log(data)
          var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
          var downloadElement = document.createElement('a');
      　　var href = window.URL.createObjectURL(blob); //创建下载的链接
      　　downloadElement.href = href;
      　　downloadElement.download = '模板' + '.xlsx'; //下载后文件名
      　　document.body.appendChild(downloadElement);
      　　downloadElement.click(); //点击下载
      　　document.body.removeChild(downloadElement); //下载完成移除元素
      　　window.URL.revokeObjectURL(href); //释放掉blob对象
          this.downloads = false
          // this.njbj = {
          //   njdm: '',
          //   bjdm: ''
          // }

        }).catch(error => {
          setTimeout(() => {
            this.downloads = false
          }, 1000)
          // console.log(error)
        })
      } else {
        this.downloads = false
        this.$notify({
          title: '提示',
          message: '请先选择要导入的项目！',
          type: 'error',
          duration: 2000
        });
      }
      
    },
    // 根据年级代码学校代码报告单id获取预览报告单信息，用于处理显示生成模板活动分析项
    getylbgd(){
      this.checkedPro = []
      this.projectlist = []
      let params = {
        Xxdm: this.listQuery.xxdm,
        BgdId: this.listQuery.bgdId,
        Njdm: this.bgddcstatus.Njdm
      }
      avtive.Getylbgd(params).then(data => {
        // console.log('-----这里--------')
        // console.log(data)
        if (data.status === 1 && data.data.length) {
          data.data.forEach(el => {
            this.projectlist.push({
              bm: el.bm,
              uuid: el.uuid
            })
            this.checkedPro.push(el.uuid)
          })
        }
      })
    },
    // 全选/反选弹层内项目用于下载模板
    handleCheckAllChange(val) {
      // console.log(val)
      // this.checkedPro = val ? this.projectlist : [];
      if (val) {
        this.projectlist.forEach(el => {
          this.checkedPro.push(el.uuid)
        })
      } else {
        this.checkedPro = []
      }
      this.isIndeterminate = false;
      
    },
    // 选择项目用于下载模板
    handleCheckedCitiesChange(value) {
      // console.log(value)
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.projectlist.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.projectlist.length;
    },
    // 导入学生活动报告单
    entry(){
      this.importXSFormVisible = true;
      this.bjxx = this.datatree[0]
      // console.log(this.bjxx)
      
      this.bgddcstatus.Bjdm = this.bjxx.bjdm
      this.bgddcstatus.Njdm = this.bjxx.njdm
      this.bgddcstatus.BgdId = this.listQuery.bgdId
      this.getylbgd()
    },
    // 选择班级
    choose(value){
      // console.log(value)
      
      // console.log(this.bgddcstatus.Bjdm)
      // this.bgddcstatus.Bjdm = this.bjxx.bjdm
      // this.bgddcstatus.Njdm = this.bjxx.njdm
      this.bgddcstatus.Bjdm = value.bjdm
      this.bgddcstatus.Njdm = value.njdm
      this.getylbgd()
    },
    // 确认导入
    importSubmit(fileName){
      if (this.ready) {
        // 
        // 
        this.importLoading = true
        this.$refs[fileName].submit();
        this.ready = false
        // this.isSuccess = '上传中'
      } else {
        this.$notify({title: '提示', message: '没有要导入的文件', type: 'error', duration: 2000})
      }
    },
    // 文件列表移除文件钩子
    onremove (file, fileList) {
      if (!fileList.length) {
        this.ready = false
      }
    },
    // 文件状态改变函数
    onchange (file, fileList) {
      if (fileList.length) {
        this.ready = true
      } else {
        this.ready = false
      }
    },
    //取消上传
    importCancel() {
        this.importLoading = false;
        this.importXSFormVisible = false;
        this.fileList = [];
        this.projectlist = []
        this.checkedPro = []
        this.checkAll = false
        this.isIndeterminate = true
    },
    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
      if (response.status === 1) {
        this.savelist.inputItemList = []
        this.isSuccess = ''
        this.importLoading = false;
        this.$notify({
            title: '成功',
            message: response.message,
            type: 'success',
            duration: 2000
        });
        this.BgdXmInfoList = []
        this.checkdetails(this.datatree[0].students[0], this.datatree[0], 'init')
        this.importXSFormVisible = false;
        this.fileList = [];
        this.projectlist = []
        this.checkedPro = []
        this.checkAll = false
        this.isIndeterminate = true
        
      } else {
        this.savelist.inputItemList = []
        this.$notify({
            title: '失败',
            message: response.message,
            type: 'warning',
            duration: 2000
        });
        this.fileList = [];
        // this.projectlist = []
        // this.checkedPro = []
        this.checkAll = false
        this.isIndeterminate = true
        this.importLoading = false;
      }
      
    },
    // 上传错误
    uploadError (response, file, fileList) {
      this.importLoading = false;
      this.$notify({
        title: '失败',
        message: '上传失败，请重试！',
        type: 'warning',
        duration: 2000
      });
    },
    // 上传前对文件的大小的判断
    beforeUpload (file) {
      this.importLoading = true;
      let extension = file.name.split('.')[1] === 'xlsx'
      let isLt2M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.$notify({
          title: '提示',
          message: '上传模板不对',
          type: 'info',
          duration: 2000
        });
        this.importLoading = false;     
      }else if (!isLt2M) {
        this.$notify({
          title: '提示',
          message: '上传模板大小不能超过 10MB',
          type: 'info',
          duration: 2000
        });
          this.importLoading = false;
      }
      return extension && isLt2M
    },
    
    // 查看当前学生报告单数据（即获取当前学生报告单）
    checkdetails(item, datas, strs){
      // console.log('我是学生数据')
      // console.log(item)
      
      this.xm = item.xm // 学生姓名
      // this.BgdXmInfoList = [] // 清空报告单信息
      if (strs === 'init') {
        this.savelist.xh = item.xh // 学生报告单学号
        this.getstureport(item, datas) // 获取报告单信息
      } else {
        this.submit('qh',item, datas)
      }
      
      // this.getstureport(item, datas) // 获取报告单信息
    },
    // 获取当前学生/展开所点击班级列表
    opentrs(datas, str){
      // console.log('这里')
      // console.log(datas)
      if (this.sfwgly === 'js') {
        this.savelist.bjid = datas.bjdm // 学生报告单班级id
        this.savelist.bjmc = datas.bjmc // 学生报告单班级名称
        this.bj = datas.bjmc // 学生班级
        this.treeid = datas.bjdm // 班级代码赋值用于判断打开班级条件
        this.treeOpen = !this.treeOpen // 班级打开控制
      } else {
        // bjid:bjid, xn: xn, xxdm: xxdm
        let params = {
          bjid: datas.bjdm,
          xn: datas.xn,
          xxdm: this.listQuery.xxdm
        }
        this.getbjstu(params, str)
        this.savelist.bjid = datas.bjdm // 学生报告单班级id
        this.savelist.bjmc = datas.bjmc // 学生报告单班级名称
        this.bj = datas.bjmc // 学生班级
        this.treeid = datas.bjdm // 班级代码赋值用于判断打开班级条件
        this.treeOpen = !this.treeOpen // 班级打开控制
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.app-container{
  width: 100%;
  float: left;
  min-width: 1000px;
}
.filter-container{
  float: left;
  width: 100%;
}
.table-container{
  width: 100%;
  float: left;
  .content_left{
    float: left;
    width: 200px;
    height: 600px;
    border: 1px solid #e0e0e0;
    overflow: auto;
    &.fix{
      position: fixed;
      top: 70px;
    }
    &::-webkit-scrollbar {
        width: 10px;
        height: 1px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.6);
        background-color: rgb(97, 172, 247);
        background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
    }
    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.2);
        border-radius: 10px;
        background: #F4f4f4;
    }
  }
  .content_right{
    width: 70%;
    padding-left:20px;
    overflow: hidden;
    margin-left: 200px;
    min-height: 500px;
    position: relative;
    .title{
      text-align: center;
      font-size: 18px;
      margin-bottom: 20px;
    }
    .bjxm{
      text-align: center;
      font-size: 16px;
      span{
        display: inline-block;
        height: 30px;
        margin-left: 8px;
        margin-right: 15px;
        border-bottom: 1px solid #333;
        width: 175px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>