<template>
  <section>
    <div style="padding: 20px">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item v-if="mbid">
        <el-select class="optionSel" @change="changeSel" v-model="selValue" placeholder="审批状态" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="input21" filterable placeholder="请选择"
                   @change="handleSelect"
                   clearable >
          <el-option
            v-for="item in teacherList"
            :key="item.gh"
            :label="item.xm"
            :value="item.gh">
          </el-option>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="renderlvru">录入代课</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkRelateDel" type="danger">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="exportAndPrintTricket" type="primary">打印</el-button>
      </el-form-item>
    <!--  <el-form-item>
        <el-button @click="exportWord" type="primary">导出</el-button>
      </el-form-item>-->
    </el-form>
        <el-table
          :v-loading="loading"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%" border stripe
          @row-click="hanldRowClick"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            width="70"
            type="index"
          >
          </el-table-column>
          <el-table-column
            label="序号"
            width="120"
            prop="jlid"
            v-if="showjlid"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="发起人"
            width="120">
          </el-table-column>
          <el-table-column
            prop="bdkr"
            label="被带课人"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="dkkc"
            label="代课课程"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="dkjs"
            label="代课节数"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="dkr"
            label="代课人"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            v-if="mbid"
            label="审批状态"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button v-if="scope.row.spzt == 1" type="primary" size="mini" round  >审批中</el-button>
              <el-button v-else-if="scope.row.spzt == 2" type="info" size="mini" round  >已撤销</el-button>
              <el-button v-else-if="scope.row.spzt == 3" type="success" size="mini" round  >审批通过</el-button>
              <el-button v-else-if="scope.row.spzt == 4" type="danger" size="mini" round  >审批拒绝</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="clsj"
            label="创建时间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="dkxx.query.page" :page-sizes="[10,15,20,25,30]"
                       :page-size="dkxx.query.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
   <!--审核界面-->
   <page-splimx v-if="isMb" ref="pageSplimx"></page-splimx>
   <!--代课详情页面-->
  <el-dialog v-if="!isMb" title="代课详细" :visible.sync="dialogDkForm" width="25%" @close="colseDialog" center>
    <el-form label-width="80px" class="demo-ruleForm">
      <el-form-item label="申请人">
        <span>{{dkIfo.sqrmc}}</span>
      </el-form-item>
      <el-form-item label="原上课人">
        <span>{{dkIfo.yskr}}</span>
      </el-form-item>
      <el-form-item label="代课人">
        <span>{{dkIfo.dkr}}</span>
      </el-form-item>
      <el-form-item label="代课明细">
        <span>{{dkIfo.dkmx}}</span>
      </el-form-item>
      <el-form-item label="代课原因">
        <span>{{dkIfo.dkyy}}</span>
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
  <el-button size="small" type="primary" @click="deleteDk">确 定</el-button>
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
import * as api from '@/api/tdk/tk';
import jcsj from '@/api/jcsj';
import * as tkApi from '@/api/tdk/tkxx/index';
import pageSplimx from '@/components/Shmb/spmx';
import * as notice from '@/api/tdk/notice/index';
export default {
  components: { pageSplimx },
  data() {
    return {
      htmlTitle: '调代课通知单',
      templateHtml: '',
      dialogDkForm: false,
      isMb: false,
      mbid: false,
      loading: true,
      tableData: [],
      value: '',
      isToday: false,
      selValue: '',
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
      input21: '',
      dkxx: {
        xxdm: '',
        shzt: '',
        zgh: '',
        type: '',
        query: {
          page: 1,
          limit: 10
        }
      },
      xxdm: window.localStorage.getItem('xxdm'),
      username: window.localStorage.getItem('username'),
      teacherList: '',
      total: 0,
      multipleSelection: [],
      restaurants: '',
      dialogForm: false, // 是否显示代课审核弹框------
      slztEnum: { SPZ: 1, // 审批中
        SPCX: 2, // 审批撤销
        SPTG: 3, // 审批通过
        SPJJ: 4 // 审批拒绝
      },
      bzztEnum: { DSP: 1, // 待审批
        SPWC: 2, // 审批完成
        WSP: 3, // 未审批
        HQWC: 4// 或签自动完成
      },
      kcList: '',
      slid: '',
      showjlid: false,
      type: 0,
      dkIfo: {},
      xszkzb: [],
      messageVisible: false,
      delMsg: [], // 关联数据
      relateIdArr: [], // 待删除的记录ID
      delTitle: '提示', // 提示框信息
      delMsgFlag: true,
      widthSize: '25%'
    };
  },
  created() {
    jcsj.remove(jcsj.KC_KEY);
    jcsj.remove(jcsj.JS_KEY);
    /** 初始化当前学校代码和用户名**/
    this.dkxx.xxdm = window.localStorage.getItem('xxdm');
    this.dkxx.username = window.localStorage.getItem('username');
    this.dkxx.type = window.localStorage.getItem('lguserType');
    this.dkxx.sqr = window.localStorage.getItem('usercode');
    this.getDkxx();
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
    },
    getDkxx() {
      api.validaSplc({ xxdm: this.xxdm }).then(res => {
        if (res.status === 200) {
          const v = res.data.mbid;
          if (v === '0') {
            this.mbid = false;
          } else {
            this.mbid = true;
          }
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async renderlvru() { // 保存验证流程模板是否创建
      const validaCourse = await api.validaByCourse()
      if (validaCourse.data) {
        this.$router.push({ path: '/dkdetail' });
      } else {
        this.$alert(validaCourse.message, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    async queryPageList() { // 获取列表
      const that = this;
      this.loading = true;
      const validaCourse = await api.validaByCourse()
      if (validaCourse.data) {
        that.dkxx.pkid = validaCourse.data;
        api.queryPageList(that.dkxx).then(res => {
          if (res.status === 200) {
            const pageData = res.data.rows;
            that.total = res.data.total;
            that.tableData = pageData;
            that.tableData.forEach((item, index) => {
              that.$set(that.tableData, index, {
                name: item.sqrmc,
                bdkr: jcsj.hqjsmcByid(that.teacherList, item.yskr),
                dkkc: jcsj.hqkcmcByid(that.kcList, item.dkkc),
                dkjs: item.dkjc,
                dkr: jcsj.hqjsmcByid(that.teacherList, item.dkr),
                clsj: item.clsj,
                spzt: parseInt(item.shzt),
                jlid: item.jlid,
                slid: item.slid
              })
            })
            this.loading = false;
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
      this.dkxx.query.limit = val
      this.queryPageList();
    },
    handleCurrentChange(val) {
      this.dkxx.query.page = val
      this.queryPageList();
    },
    // 删除代课信息
    checkRelateDel() {
      const arr = [];
      this.multipleSelection.forEach(item => {
        arr.push(item.jlid)
      });
      this.relateIdArr = [];
      if (this.multipleSelection.length === 1) {
        tkApi.getRelateData({ jlid: arr[0] }).then(res => {
          if (res.status === 200) {
            if (res.data.length > 0) {
              const html = [];
              this.widthSize = '40%';
              this.delTitle = '相关调代课记录信息';
              this.delMsgFlag = false;
              for (let i = 0; i < res.data.length && i < 5; i++) {
                this.relateIdArr.push(res.data[i].jlid);
                const relateData = res.data[i].tkmx;
                html.push('<p>' + relateData + '</p>');
              }
              // this.delMsg = html.join('');
              this.delMsg = res.data;
              this.messageVisible = true;
            } else {
              this.widthSize = '25%';
              this.delMsgFlag = true;
              this.delTitle = '提示';
              this.delMsg = '删除后数据不可恢复，确认要删除吗？';
              this.messageVisible = true;
            }
          } else {
            this.$notify({ title: '失败', message: res.getMessage(), type: 'error', duration: 2000 });
          }
        });
      } else {
        this.$message({ showClose: true, message: '请选择一条数据', type: 'warning' });
      }
    },
    // 删除代课记录
    deleteDk() {
      this.messageVisible = false;
      const delRecordArr = this.relateIdArr;
      delRecordArr.push(this.multipleSelection[0].jlid)
      tkApi.deleteInfo(delRecordArr).then(res => {
        if (res.status === 200) {
          api.deleteDk(delRecordArr).then(res => {
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
    changeSel() { // 根据状态搜索
      this.dkxx.shzt = this.selValue;
      this.queryPageList();
    },
    querySearch(queryString, cb) {
      const restaurants = this.teacherList;
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => restaurant.xm.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    },
    handleSelect() {
      this.dkxx.zgh = this.input21;
      this.queryPageList();
    },
    hanldRowClick(row) { // 代课审核
      if (row.slid !== null && row.slid !== '') {
        this.isMb = true;
        this.$nextTick(() => {
          this.$refs.pageSplimx.init(row.slid);
        })
      } else {
        this.isMb = false;
        this.dialogDkForm = true;
        api.getDataInfo({ jlid: row.jlid }).then(res => {
          this.dkIfo = res.data;
        })
      }
    },
    colseDialog() {
      this.dialogForm = false;
      this.dialogDkForm = false;
    },
    // 打印通知单
    exportAndPrintTricket() {
      this.xszkzb = [];
      let ids = '';
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(item => {
          if (item.spzt !== 3 && item.spzt !== -1) {
            this.$message({ showClose: true, message: '不能打印审核流程中的数据', type: 'warning' });
            throw new Error('不能打印审核流程中的数据');
          } else {
            // 拼接ids 数据
            if (ids === '') {
              ids += item.jlid;
            } else {
              ids += ',' + item.jlid;
            }
          }
        });
        notice.exportNotice({ jlid: ids }).then(res => {
          if (res.status === 200) {
            this.$refs.xszkzb_table_print_ref.style.display = 'block';
            res.data.forEach(noticeInfo => {
              let tempNotice;
              tempNotice = JSON.parse(JSON.stringify(noticeInfo.noticeTemplateContent)).replace(new RegExp(' ', 'gm'), '&nbsp;');
              tempNotice = JSON.parse(JSON.stringify(tempNotice)).replace(new RegExp('\t', 'gm'), '&nbsp;&nbsp;&nbsp;&nbsp;');
              this.xszkzb.push(tempNotice);
            });
            this.$nextTick(() => {
             /* for (let i = 0; i < this.xszkzb.length; i++) {
                if(i !== 0 && i%2 === 0 && (i !==this.xszkzb.length -1)){
                  this.$refs.xszkzb_table_ref[i].style.pageBreakBefore = 'always';
                }
              }*/
              console.log(this.xszkzb);
              for (let i = 0; i < this.xszkzb.length; i++) {
                console.log(i !== this.xszkzb.length - 1);
                console.log(i);
                if (i !== this.xszkzb.length - 1) {
                  this.$refs.xszkzb_table_ref[i].style.pageBreakBefore = 'always';
                }
              }
              this.$print(this.$refs.xszkzb_table_print_ref);
              this.$refs.xszkzb_table_print_ref.style.display = 'none';
            });
          } else {
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
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(item => {
          if (item.spzt !== 3 && item.spzt !== -1) {
            this.$message({ showClose: true, message: '不能打印审核流程中的数据', type: 'warning' });
            throw new Error('不能打印审核流程中的数据');
          } else {
            // 拼接ids 数据
            if (ids === '') {
              ids += item.jlid;
            } else {
              ids += ',' + item.jlid;
            }
          }
        });
        notice.exportNotice({ jlid: ids }).then(res => {
          if (res.status === 200) {
            this.$refs.xszkzb_table_print_ref.style.display = 'block';
            res.data.forEach(noticeInfo => {
              this.xszkzb.push(noticeInfo.noticeTemplateContent);
            });
            this.$nextTick(() => {
              for (let i = 0; i < this.xszkzb.length; i++) {
                this.$refs.xszkzb_table_ref[i].style.pageBreakBefore = 'always';
              }
              this.download(this.xszkzb);
              this.$refs.xszkzb_table_print_ref.style.display = 'none';
            });
          } else {
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
  .lvrudaike{
    margin:1rem;
  }
  .rightHandel{
    width:470px;
    float: right;
    margin-top: 1rem;
  }
  .searchInput{
    width: 250px !important;
  }
  .optionSel{
    width: 200px;
  }
  .indexhandelPass{
    width: 70px;
    height: 30px;
    background-color: #eff9ec;
    border: 1px solid #d3eecc;
    color:#63c249;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    border-radius: 5px;
  }

  .passing{
    width: 70px;
    height: 30px;
    background-color: #fcf6ec;
    border: 1px solid #f7e5cb;
    color:#e8ac65;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    border-radius: 5px;
  }

  .noPass{
    width: 70px;
    height: 30px;
    background-color: #fef0f0;
    border: 1px solid #fcd5d5;
    color:#f77474;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    border-radius: 5px;
  }
  .el-table th>.cell{
    text-align: center !important;
  }
  .el-table .cell{
    text-align: center !important;
  }
  .el-pagination{
    margin-top:20px;
    margin-left:20px;
  }
  .splcModel .el-form-item__label{
    font-size: 12px;
    color: #606266c4;
  }
</style>
