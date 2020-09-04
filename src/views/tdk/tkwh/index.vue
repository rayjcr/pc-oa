<!--suppress ALL -->
<template>
  <section>
    <div style="padding: 20px">
      <el-form :model="form" :inline="true" class="demo-form-inline">
        <el-form-item v-if="isMb">
          <el-select class="optionSel" @change="search" v-model="form.shzt" placeholder="审批状态" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入搜索关键词" v-model="form.sqrmc" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="renderlvru">申请调课</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-delete" @click="checkRelateDel" type="danger">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="exportAndPrintTricket" type="primary">打印</el-button>
        </el-form-item>
        <!--<el-form-item>
          <el-button @click="exportWord" type="primary">导出</el-button>
        </el-form-item>-->
      </el-form>
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%" border stripe
        @row-click="hanldRowClick"
        @selection-change="handleSelectionChange">
        <el-table-column align="center"
                         type="selection"
                         width="55">
        </el-table-column>
        <el-table-column align="center"
                         label="序号"
                         width="70"
                         type="index"
        >
        </el-table-column>
        <el-table-column align="center"
                         prop="sqrmc"
                         label="发起人"
                         width="150">
        </el-table-column>
        <el-table-column align="center" prop="tkyy" label="调课原因">
        </el-table-column>
        <el-table-column align="center" prop="tkmx" label="调课明细">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div style="width: 200px">{{scope.row.tkmx}}</div>
              <div slot="reference" class="name-wrapper">
                {{ scope.row.tkmx.length>15?scope.row.tkmx.substring(0,15)+'...':scope.row.tkmx }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         prop="cjsj"
                         label="创建时间"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.cjsj }}</template>
        </el-table-column>
        <el-table-column v-if="isMb" align="center"
                         label="审批状态"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="scope.row.shzt == 1" type="primary" size="mini" round>审批中</el-button>
            <el-button v-else-if="scope.row.shzt == 2" type="info" size="mini" round>已撤销</el-button>
            <el-button v-else-if="scope.row.shzt == 3" type="success" size="mini" round>审批通过</el-button>
            <el-button v-else-if="scope.row.shzt == 4" type="danger" size="mini" round>审批拒绝</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="form.query.page" :page-sizes="[10,15,20,25,30]"
                     :page-size="form.query.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      <page-splimx v-if="isMb" ref="pageSplimx"></page-splimx>

      <!--调课课详情页面-->
      <el-dialog v-if="!isMb" title="调课详细" :visible.sync="dialogTkForm" width="25%" @close="colseDialog" center>
        <el-form label-width="80px" class="demo-ruleForm">
          <el-form-item label="申请人">
            <span>{{tkIfo.sqrmc}}</span>
          </el-form-item>
          <el-form-item label="调课明细">
            <span>{{tkIfo.tkmx}}</span>
          </el-form-item>
          <el-form-item label="调课原因">
            <span>{{tkIfo.tkyy}}</span>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog id="jel-dialog__body" style="margin-top:20vh;"
                 :title="delTitle"
                 :visible.sync="messageVisible"
                 :width="widthSize">
        <div v-if="delMsgFlag" style="text-align: center" class="el-message-box__message" v-html="delMsg"></div>
        <div v-else>
          <el-alert title="点击确定按钮会删除选中数据以及和其相关联的数据" type="error" :closable="false">
          </el-alert>
          <el-table  :data="delMsg" border style="width: 750px">
            <el-table-column prop="sqrmc" label="发起人" width="200"></el-table-column>
            <el-table-column prop="tkyy" label="原因" width="250">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <div style="width: 200px">{{scope.row.tkyy}}</div>
                  <div slot="reference" class="name-wrapper">
                    {{ scope.row.tkyy.length>15?scope.row.tkyy.substring(0,15)+'...':scope.row.tkyy }}
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="tkmx" label="明细" >
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <div style="width: 200px">{{scope.row.tkmx}}</div>
                  <div slot="reference" class="name-wrapper">
                    {{ scope.row.tkmx.length>15?scope.row.tkmx.substring(0,15)+'...':scope.row.tkmx }}
                  </div>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="messageVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="deleteInfo">确 定</el-button>
       </span>
      </el-dialog>
      <div ref="xszkzb_table_print_ref" style="width: 100%;display:none">
        <div v-for="xsItem of xszkzb" 　ref="xszkzb_table_ref" style="width: 100%">
          <table  cellpadding="0" cellspacing="0" style="height: 450px">
             <span v-html="xsItem" ></span>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import * as dkApi from '@/api/tdk/tk'
  import * as api from '@/api/tdk/tkxx/index';
  import jcsj from '@/api/jcsj';
  import pageSplimx from '@/components/Shmb/spmx';
  import * as notice from '@/api/tdk/notice/index';
  export default {
    components: { pageSplimx },
    data() {
      return {
        templateHtml: '',
        exportIdArr:[],
        dialogTkForm: false,
        loading: true,
        tableData: [],
        value: '',
        options: [{
          value: '1',
          label: '审批中'
        }, {
          value: '2',
          label: '撤销'
        }, {
          value: '3',
          label: '通过'
        }, {
          value: '4',
          label: '不通过'
        }],
        form: {
          xxdm: '',
          shzt: '',
          zgh: '',
          query: {
            page: 1,
            limit: 10
          }
        },
        teacherList: '',
        total: 0,
        multipleSelection: [],
        sqrArry: [],
        dialogForm: false, // 是否显示代课审核弹框------
        kcList: '',
        slid: '',
        xxdm: window.localStorage.getItem('xxdm'),
        type: '',
        userid: '',
        sfjw: false,
        isMb: false,
        mbid: '',
        tkIfo: {},
        xszkzb:[],
        messageVisible:false,
        delMsg: '',
        relateIdArr :[],
        delTitle: '提示', // 提示框信息
        delMsgFlag: true,
        widthSize: '25%'
      };
    },
    created() {
      jcsj.remove(jcsj.KC_KEY);
      jcsj.remove(jcsj.JS_KEY);
      /** 初始化当前学校代码和用户名**/
      this.form.xxdm = this.xxdm;
      this.getIsMbxx();
      this.initData();
    },
    methods: {
      async initData() {
        /** 获取学校所有教师**/
        this.teacherList = await jcsj.hqjslb({ xxdm: this.xxdm });
        /** 获取课程**/
        this.kcList = await jcsj.hqkclb({ xxdm: this.xxdm });
        /** 代课列表**/
        this.queryPageList();
        this.type = window.localStorage.getItem('lguserType');
        this.userid = window.localStorage.getItem('userid');
        this.checkSfjw();
      },
      async renderlvru() { // 保存验证流程模板是否创建
        const validaCourse = await api.validaByCourse()
        if (validaCourse.data) {
          if (this.sfjw) {
            this.$router.push({path: '/addJw'});
          } else {
            this.$router.push({path: '/addJs'});
          }
        } else {
          this.$alert(validaCourse.message, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }
      },
      getIsMbxx() {
        api.validaSplc({ xxdm: this.form.xxdm }).then(res => {
          if (res.status === 200) {
            this.mbid = res.data;
            if (this.mbid === '0' || this.mbid == null || this.mbid === '') {
              this.isMb = false;
            } else {
              this.isMb = true;
            }
          } else {
            this.$message.error('操作失败，请联系管理员！');
          }
        })
      },
      async queryPageList() { // 获取列表
        this.loading = true;
        const validaCourse = await api.validaByCourse()
        if (validaCourse.data) {
          this.form.pkid = validaCourse.data;
          api.queryPageList(this.form).then(res => {
            this.loading = false;
            if (res.status === 200) {
              this.total = res.data.total;
              this.tableData = res.data.rows;
            }
          })
        } else {
          this.loading = false;
          this.$alert(validaCourse.message, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }
      },
      handleSizeChange(val) {
        this.form.query.limit = val
        this.queryPageList();
      },
      handleCurrentChange(val) {
        this.form.query.page = val
        this.queryPageList();
      },
      handleSelectionChange(e) {
        const val = [];
        const sqr = [];
        e.forEach(o => {
          val.push(o.jlid);
          sqr.push(o.sqr);

        })
        this.multipleSelection = val;
        this.sqrArry = sqr;
        this.exportIdArr = e;
      },
      checkDelete() {
        let num = 0;
        if (this.type === '2' || this.sfjw) {
          num++;
        } else {
          this.sqrArry.forEach(e => {
            if (e === this.userid) {
              num++;
            } else {
              num--;
            }
          })
        }
        return num > 0;
      },
      checkRelateDel() { // 删除代课信息
        this.relateIdArr = [];
        if (this.multipleSelection.length === 1) {
          const c = this.checkDelete();
          if (c) {
            api.getRelateData({jlid:this.multipleSelection[0]}).then(res => {
              if (res.status === 200) {
                if(res.data.length > 0){
                  const html = [];
                  this.widthSize = '40%';
                  this.delTitle = '相关调代课记录信息';
                  this.delMsgFlag = false;
                  for (let i = 0; i < res.data.length && i < 5 ; i++) {
                    this.relateIdArr.push(res.data[i].jlid);
                    const  relateData =  res.data[i].tkmx;
                    html.push('<p>' +relateData + '</p>');
                  }
                  this.delMsg = res.data;
                  //this.delMsg = html.join('');
                  this.messageVisible = true;
                }else{
                  this.widthSize = '25%';
                  this.delMsgFlag = true;
                  this.delTitle = '提示';
                  this.delMsg = '删除后数据不可恢复，确认要删除吗？';
                  this.messageVisible = true;
                }
              } else {
                this.$notify({ title: '失败', message: res.getMessage(), type: 'error', duration: 2000 });
              }
            })
          } else {
            this.$message({ showClose: true, message: '只能删除自己申请的数据', type: 'warning' });
          }
        }else{
            this.$message({ showClose: true, message: '请选择一条数据', type: 'warning' });
        }
      },
      // 删除代课信息
      deleteInfo() {
        this.messageVisible = false;
        let delRecordArr = this.relateIdArr;
        delRecordArr.push(this.multipleSelection[0])
        api.deleteInfo(delRecordArr).then(res => {
          if (res.status === 200) {
            dkApi.deleteDk(delRecordArr).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.queryPageList();
              } else {
                this.$message.error('删除失败，请重试！');
              }
            })
          } else {
            this.$notify({ title: '失败', message: res.getMessage(), type: 'error', duration: 2000 });
          }
        })
      },
      search() { // 根据状态搜索
        this.queryPageList();
      },
      handleSelect() {
        this.queryPageList();
      },
      hanldRowClick(row) { // 调课审核
        if (row.slid !== null && row.slid !== '') {
          this.isMb = true;
          this.$nextTick(() => {
            this.$refs.pageSplimx.init(row.slid);
          })
        } else {
          this.isMb = false;
          this.dialogTkForm = true;
          api.getDataInfo(row.jlid).then(res => {
            this.tkIfo = res.data;
          })
        }
      },
      colseDialog() {
        this.dialogTkForm = false;
      },
      checkSfjw() {
        api.getSfJw().then(res => {
          this.sfjw = res.data;
        })
      },
      // 打印通知单
      exportAndPrintTricket() {
        this.xszkzb = [];
        let ids = '';
        if (this.exportIdArr.length > 0) {
          this.exportIdArr.forEach(item => {
            if(item.shzt != '3' &&  item.shzt != '-1'){
              this.$message({ showClose: true, message: '不能打印审核流程中的数据', type: 'warning' });
              throw new Error("不能打印审核流程中的数据");
            }else{
              // 拼接ids 数据
              if(ids === ''){
                ids += item.jlid;
              }else{
                ids += "," + item.jlid;
              }
            }
          });
          notice.exportNotice({ jlid: ids }).then(res => {
            if(res.status === 200){
              this.$refs.xszkzb_table_print_ref.style.display = 'block';
              res.data.forEach(noticeInfo => {
                let tempNotice = '';
                tempNotice = JSON.parse(JSON.stringify(noticeInfo.noticeTemplateContent)).replace(new RegExp(' ', 'gm'), '&nbsp;');
                tempNotice = JSON.parse(JSON.stringify(tempNotice)).replace(new RegExp('\t', 'gm'), '&nbsp;&nbsp;&nbsp;&nbsp;');
                this.xszkzb.push(tempNotice);
              });
              this.$nextTick(() => {
                for (let i = 0; i < this.xszkzb.length; i++) {
                  console.log(i);
                  console.log(i !== 0 && i%2 === 0);
                  if(i !== 0 && i%2 === 0 ){
                    this.$refs.xszkzb_table_ref[i].style.pageBreakBefore = 'always';
                  }
                }
                this.$print(this.$refs.xszkzb_table_print_ref);
                this.$refs.xszkzb_table_print_ref.style.display = 'none';
              });
            }else{
              this.$message({ showClose: true, message: res.message, type: 'warning' });
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: '请选择一条数据',
            type: 'warning'
          });
        }
      },
      // 导出word
      exportWord() {
        this.xszkzb = [];
        let ids = '';
        if (this.exportIdArr.length > 0) {
          this.exportIdArr.forEach(item => {
            if(item.shzt != '3' &&  item.shzt != '-1'){
              this.$message({ showClose: true, message: '不能打印审核流程中的数据', type: 'warning' });
              throw new Error("不能打印审核流程中的数据");
            }else{
              // 拼接ids 数据
              if(ids === ''){
                ids += item.jlid;
              }else{
                ids += "," + item.jlid;
              }
            }
          });
          notice.exportNotice({ jlid: ids }).then(res => {
            if(res.status === 200){
              this.$refs.xszkzb_table_print_ref.style.display = 'block';
              res.data.forEach(noticeInfo => {
                this.xszkzb.push(noticeInfo.noticeTemplateContent);
              });
              this.$nextTick(() => {
                console.log(this.xszkzb)
                for (let i = 0; i < this.xszkzb.length; i++) {
                  if(i !== 0 && i%2 === 0 ) {
                    this.$refs.xszkzb_table_ref[i].style.pageBreakBefore = 'always';
                  }
                }
                this.download(this.xszkzb);
                this.$refs.xszkzb_table_print_ref.style.display = 'none';
              });
            }else{
              this.$message({ showClose: true, message: res.message, type: 'warning' });
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: '请选择一条数据',
            type: 'warning'
          });
        }
      },
      download(data) {
        if (!data) {
          return
        }
        const url = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', '调课申请单.doc');
        document.body.appendChild(link);
        link.click();
      }
    }
  };
</script>
<style>

</style>
