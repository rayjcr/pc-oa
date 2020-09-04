<!--
 * @Description: 主题报告单导出
 * @Author: your name
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-15 10:35:51
 * @LastEditTime: 2019-05-16 09:38:04
 -->
 <template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="form" :model="form">
        <el-row>
            <el-form-item label="">
              <el-input v-model="form.studentN" placeholder="请输入学生姓名" @blur="search" style="width: 150px;"></el-input>
              <!-- <el-button type="primary" @click.stop="exportall">导出全校</el-button> -->
              <el-button type="success" @click.stop="exportreport('tj')" :loading="sftj">导出</el-button>
            </el-form-item>
        </el-row>
      </el-form>
      <p class="tip"><span>注：</span>此页面用于班主任录入或批量导入【活动分析】【发展建议】等数据。</p>
    </div>
    <div class="table-container">
      <div class="content_left" :class="{'fix':isFix}">
        <tree-comn v-for="(item, index) in datatree" :key="index" :dataSource="item" @checkdetail="checkdetaild" @open="opentrt" :treeOpen="treeOpen" :treeid="treeid"></tree-comn>
      </div>
      <!-- 表格信息beg -->
      <div class="content_right">
        <el-card style="padding: 10px 0;margin-left: 20px;min-width: 950px;">
          <div class="title"><h3>{{bgdmc}}</h3></div>
          <div class="bjxm">班级<span>{{bj}}</span> 姓名<span>{{xm}}</span></div>
          <div v-for="(row,rowind) in BgdXmInfoList" :key="rowind">
            <table-content :isyl="isyl" @addrate="addrate" :starable="true" :conwidth="conwidth" :isedit="false" :dataSource="row" :num="num" @select="select" @onEditorChange="onEditorChange"></table-content>
          </div>
        </el-card>
      </div>
      <!-- 表格信息end -->
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>{{infos}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="isloadings" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TableContent from '../Assembly/TableMain'
import TreeComn from '../../zhszReport/inoutReport/TreeComn'
import * as mainapi from "api/project/creditInquiry/index"
import * as avtive from "api/project/reportActive/index" // 主题活动报告单主用api
export default {
  components: {
    TreeComn,TableContent
  },
  data () {
    return {
      isloadings: false, // 按钮加载中效果防止完成前再次点击
      names: '',
      infos: '', // 导出提示框信息
      dialogVisible: false,
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
      username: window.localStorage.getItem('username'), // 用户账号 （zgh = username去掉学校代码部分的字符串）
      BgdXmInfoList: [], // 学生报告单数据集合
      bgdmc: '', // 报告单名称
      savelist:{
        xxdm: window.localStorage.getItem('xxdm'),
        bgdid: '',
        bjid: '',
        bjmc: '',
        xh: '',
        inputItemList: []
      },
      xndm: window.sessionStorage.getItem('reportxn'), // 学年代码
      // 报告单导出参数
      exportstatus: {
        xxdm: window.localStorage.getItem('xxdm'),
        bgdId: '',
        njdm: '',
        bjdm: '',
        xh: '',
        njmc: '',
        orientation: 1,
        bgdSZPX: '',
      },
      isbj: false,
      // lssj: '', // 富文本框输入修改暂存
      sfwgly: '',
      isFix:false,                            //学生列表置顶的标识
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
    this.init() // 初始化
  },
  methods: {
    // 页面初始化
    init(){
      this.sfwgly = this.$route.query.qx
      this.listQuery.bgdId = this.$route.query.bgdId
      this.savelist.bgdid = this.$route.query.bgdId
      // this.treeid = this.datatree[0].bjdm
      // this.treeOpen = !this.treeOpen
      this.opentrt(this.datatree[0], 'init') // 初始打开学生侧边默认栏
      if(this.sfwgly === 'js'){
        this.checkdetaild(this.datatree[0].students[0], this.datatree[0], 'init') // 初始选择默认学生
      }
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
                this.checkdetaild(el.students[0], el, 'init')
              } else {
                this.checkdetaild(el.students[0], el, 'bj')
              }
            }
          })
          
        }
      })
    },

    onEditorChange({ editor, html, text }){
      // console.log({ editor, html, text })
      // console.log(this.BgdXmInfoList)
      // this.lssj = html
    },
    
    // 确认导出
    confirm(){
      this.isloadings = true
      this.exportreportinfo()
    },

    // 导出全校报告单
    exportall(){
      this.exportstatus.njdm = ''
      this.exportstatus.bjdm = ''
      this.exportstatus.xh = ''
      this.infos = '确定批量导出全校学生的报告单吗？这可能需要很久！'
      this.dialogVisible = true
    },

    // 导出班级/学生报告单
    exportreport(str){
      if (this.isbj) {
        this.infos = '确定导出' + this.names + '的报告单吗？'
        this.dialogVisible = true
      } else {
        this.infos = '确定导出' + this.names + '的报告单吗？'
        this.dialogVisible = true
      }
    },
    exportreportinfo(){ // 导出报告单
      mainapi.ExportBgdxx(this.exportstatus).then(data => {
        var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
        var downloadElement = document.createElement('a');
    　　var href = window.URL.createObjectURL(blob); //创建下载的链接
    　　downloadElement.href = href;
    　　downloadElement.download = this.names + (this.exportstatus.xh === ''?'.zip':'.pdf'); //下载后文件名
    　　document.body.appendChild(downloadElement);
    　　downloadElement.click(); //点击下载
    　　document.body.removeChild(downloadElement); //下载完成移除元素
    　　window.URL.revokeObjectURL(href); //释放掉blob对象
        // this.isout = false
        // this.isable1 = false
        this.dialogVisible = false
        this.isloadings = false
      })
    },

    // 关闭弹窗
    handleClose(){
      this.dialogVisible = false
    },
    
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

    },

    // 评分点击
    addrate(datas){

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
        // this.savestatus(data.bgdItemlist)
        this.bgdmc = data.bgd.mc // 报告单名称
        this.Formatarrangement(data.bgdItemlist) // 数据处理
      })
    },

    // 准备提交数据预赋值
    savestatus(datas){
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
    hdxmstatus(datas){ // 活动项目数据处理返回目标数据格式
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
    hdfxgx(datas){ // 活动个性评价数据处理返回目标格式
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
                          tablestatues: this.tabledata(el.hdfxxmList) // 整合为预期目标表格数据
                      }
                  })
              }
          })
      }
      // console.log(this.BgdXmInfoList)
    },
    // echarts 数据处理
    echartsstatus(datas){
      // console.log(datas)
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
          )
        })
      }
      return arr
    },
    fzqk(datas){ // 小组情况/全班情况数据处理，返回目标数据格式
      // console.log('我是datas')
      // console.log(datas)
      // var arr = []
      // var arr1 = []
      // for (const key in datas) {
      //   if (datas.hasOwnProperty(key)) {
      //     arr.push(datas[key])
      //   }
      // }
      // // console.log(arr)
      // arr.forEach(el => {
      //   arr1.push({
      //     pjz:'A', num:el.count, djW: el.proportion + '%'
      //   })
      // })
      // return arr1
      var arr = []
      var arr1 = []
      var propertyArr = Object.getOwnPropertyNames(datas).sort() // 顺序处理
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
      // this.treeOpen = !this.treeOpen
      this.datatree = []
      this.getStudent()
    },
    // 获取查询学生
    getStudent () {
      if (this.form.studentN === '') { // 输入框为空取原保存班级学生数据
        this.datatree = []
        setTimeout(() => {
          this.datatree = JSON.parse(window.sessionStorage.getItem('bjsj'))
          // this.treeOpen = false
          // this.treeid = this.datatree[0].bjdm
        }, 100)
        setTimeout(() => {  
          this.init() // 初始化重新获取默认第一个班级第一个学生
        }, 500)  
      } else {
        var t = this.listQuery.xxdm.length
        this.zgh = this.username.substring(t) // 获取职工号
        let params = {
          xxdm: this.listQuery.xxdm,
          zgh: this.zgh,
          xndm: JSON.parse(this.xndm),
          xm: this.form.studentN,
        }
        var str = {}
        this.datatree = []
        avtive.Getjurisdiction(params).then(data => { // 关键字搜索学生
          console.log(data)
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
    // 查看当前学生报告单数据（即获取当前学生报告单）
    checkdetaild(item, datas, str){
      console.log(str)
      // this.savelist.xh = item.xh // 学生报告单学号
      this.xm = item.xm // 学生姓名
      if(str && str === 'init'){
        this.exportstatus.xh = ''
      } else if (str && str === 'bj') {
          this.exportstatus.xh = ''
      } else {
        this.names = item.xm
        this.exportstatus.xh = item.xh
      }
      this.BgdXmInfoList = [] // 清空报告单信息
      
      this.getstureport(item, datas) // 获取报告单信息
    },
    // 获取当前学生/展开所点击班级列表
    opentrt(datas, str){
      // console.log(str)
      // // console.log(this.treeOpen)
      // console.log('这里')
      // console.log(datas)
      // console.log(this.sfwgly)
      this.isbj = true
      if (this.sfwgly === 'js') {
        this.names = datas.bjmc
        this.exportstatus.bgdId = this.listQuery.bgdId
        this.exportstatus.njdm = datas.njdm
        this.exportstatus.bjdm = datas.bjdm
        this.exportstatus.xh = ''
        this.exportstatus.njmc = datas.njmc
        this.bj = datas.bjmc // 学生班级
        this.treeid = datas.bjdm // 班级代码赋值用于判断打开班级条件
        this.treeOpen = !this.treeOpen // 班级打开控制
      } else {
        // bjid:bjid, xn: xn, xxdm: xxdm
        // console.log('eeeeeeeee')
        let params = {
          bjid: datas.bjdm,
          xn: datas.xn,
          xxdm: this.listQuery.xxdm
        }
        if (this.exportstatus.njdm === datas.njdm) {
          this.getbjstu(params)
          this.names = datas.bjmc
          this.exportstatus.bgdId = this.listQuery.bgdId
          this.exportstatus.njdm = datas.njdm
          this.exportstatus.bjdm = datas.bjdm
          this.exportstatus.xh = ''
          // this.exportstatus.njmc = datas.njmc
          this.bj = datas.bjmc // 学生班级
          this.treeid = datas.bjdm // 班级代码赋值用于判断打开班级条件
          this.treeOpen = !this.treeOpen // 班级打开控制
        } else {
          this.getbjstu(params, str)
          this.names = datas.bjmc
          this.exportstatus.bgdId = this.listQuery.bgdId
          this.exportstatus.njdm = datas.njdm
          this.exportstatus.bjdm = datas.bjdm
          this.exportstatus.xh = ''
          // this.exportstatus.njmc = datas.njmc
          this.bj = datas.bjmc // 学生班级
          this.treeid = datas.bjdm // 班级代码赋值用于判断打开班级条件
          this.treeOpen = !this.treeOpen // 班级打开控制
        }
        
        // setTimeout(() => {
          this.names = datas.bjmc
          this.exportstatus.bgdId = this.listQuery.bgdId
          this.exportstatus.njdm = datas.njdm
          this.exportstatus.bjdm = datas.bjdm
          this.exportstatus.xh = ''
          // this.exportstatus.njmc = datas.njmc
          this.bj = datas.bjmc // 学生班级
          this.treeid = datas.bjdm // 班级代码赋值用于判断打开班级条件
          this.treeOpen = !this.treeOpen // 班级打开控制
        // }, 100)
        
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