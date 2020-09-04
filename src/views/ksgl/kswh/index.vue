<!--排课系统首页-->
<template>
  <section class="app-container content-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-form :inline="true">
        <el-form-item label="学年：">
        <el-select v-model="kswh.ksxn"
                   placeholder="请选择考试学年"
                   style="margin:0 2% 2% 0;width: 150px" >
          <el-option v-for="(item,index) in  xnList"
                     :key="item.xn"
                     :label="item.xn"
                     :value="item.xn"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="学期：">
        <el-select v-model="kswh.ksxq"
                   placeholder="请选择考试学期"
                   style="margin:0 2% 2% 0;width: 150px" >
          <el-option v-for="(item,index) in  xqList"
                     :key="item.xq"
                     :label="item.xqmc"
                     :value="item.xq"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="考试类型：">
        <el-select v-model="kswh.kslx"
                   clearable
                   placeholder="请选择考试类型"
                   style="margin:0 2% 2% 0;width: 150px">
          <el-option v-for="(item,index) in  kslxList"
                     :key="item.jlid"
                     :label="item.lxmc"
                     :value="item.jlid"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="考试名称：">
        <el-input v-model="kswh.ksmc"
                  placeholder="请输入名称关键词"
                  class="handle-input mr10" maxlength="20"></el-input>
        </el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="search">搜索</el-button>
        <el-button type="primary"
                   icon="el-icon-plus"
                   class="handle-del mr10"
                   @click="handleAdd">新建考试</el-button>
        </el-form>
      </div>
      <div v-loading="loading"
           class="m_GenTableBox">
        <!--列表-->
        <el-row>
        <el-col v-if="list.length > 0"
                :span="11"
                style="margin-bottom:6px;margin:10px 2%"
                v-for="(item,index) in list"
                :key="index">
          <el-col :span="24">
            <el-card shadow="always">
              <el-badge :value="setKslx(item.kslx)">
                <h4>{{item.ksmc}}</h4>
              </el-badge>
              <div style="height: 52px;">
                <p>考试学年学期:{{item.ksxn}}-{{item.ksxq | xqTostring}}</p>
                <p>起止时间:{{item.kskssj | formatDate}}-{{item.ksjssj | formatDate}}</p>
              </div>
              <div style="height: 60px;margin-top: 10px;">
                <el-row>
                  
                  是否智能排考&nbsp;
                  <el-switch v-model="item.pkfs===1"
                             @change="setStateValue($event,0,item.jlid)"
                             :disabled="item.gkqk===1"></el-switch>
                  &nbsp;&nbsp;是否锁定&nbsp;
                  <el-switch v-model="item.lrzt===1"
                             @change="setStateValue($event,1,item.jlid)"
                             :disabled="item.gkqk===1"></el-switch>
                  &nbsp;&nbsp;是否复审&nbsp;
                  <el-switch v-model="item.sffs===1"
                             @change="setStateValue($event,2,item.jlid)"
                             :disabled="item.gkqk===1"></el-switch>
                </el-row>
                <el-row style="margin-top:20px">
                  <el-button @click="toPage(item,0,'0')"
                             size="small"
                             icon="iconfont icon-el-icon-config"
                             type="primary"
                             :disabled="item.gkqk===1">考试设置
                  </el-button>
                  <el-button @click="handleUpdate(item)"
                             size="mini"
                             type="primary"
                             icon="el-icon-edit-outline"
                             plain
                             :disabled="item.gkqk===1">修改
                  </el-button>
                  <el-button @click="deleteData(item)"
                             size="mini"
                             type="danger"
                             icon="el-icon-delete"
                             plain
                             :disabled="item.gkqk===1">删除
                  </el-button>
                </el-row>
              </div>
              <p></p>
            </el-card>
          </el-col>
        </el-col>
        <el-col v-if="list.length === 0">
          <p style="text-align: center">暂无数据！</p>
        </el-col>
        </el-row>
        
        <!--工具条-->
        <el-col :span="24" style="margin-top:20px">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page.sync="kswh.query.page"
                         :page-sizes="[8,12,16,20]"
                         :page-size="kswh.query.limit"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total"></el-pagination>
        </el-col>

      </div>

    </div>
    <!--新增界面-->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogForm"
               width="29%"
               @close="colseDialog">
      <el-form :model="temp"
               :rules="rules"
               ref="dataForm"
               label-width="80px"
               class="demo-ruleForm">
        
        <el-form-item label="学年"
                      prop="ksxn">
          <el-select v-model="temp.ksxn" disabled>
            <el-option v-for="(item,index) in  xnList"
                       :key="(index+1)"
                       :label="item.xn"
                       :value="item.xn"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期"
                      prop="ksxq">
          <el-select v-model="temp.ksxq" 
                      @change="handlerSelectXq">
            <el-option v-for="(item,index) in  xqList"
                       :key="(index+1)"
                       :label="item.xqmc"
                       :value="item.xq"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试类型"
                      prop="kslx">
          <el-select v-model="temp.kslx"
                     placeholder="请选择考试类型"
                     @change="handlerSelectKslx">
            <el-option v-for="(item,index) in  kslxList"
                       :key="(index+1)"
                       :label="item.lxmc"
                       :value="item.jlid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试日期"
                      required>
          <el-col :span="24">
            <el-form-item prop="tempTime">
              <el-date-picker :unlink-panels=true
                              v-model="temp.tempTime"
                              style="width: 100%;"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="考试名称"
                      prop="ksmc">
          <el-input v-model="temp.ksmc" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="colseDialog">取消</el-button>
        <!--修改-->
        <el-button v-if="dialogStatus=='update'"
                   type="primary"
                   @click="updateSaveData" :loading="buttonLoading">确认</el-button>
        <!--保存-->
        <el-button v-else
                   type="primary"
                   @click="saveData" :loading="buttonLoading">确认</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import * as api from '@/api/ksgl/kswh/index'
  import { checkIsFinish } from '@/api/ksgl/cjcx/index'
  import { formatDate } from '@/utils'

  export default {
    data() {
      /** 验证任务时间**/
      const validaDate = (rule, value, callback) => {
        const [start, end] = [new Date(value[0]), new Date(value[1])];
        if (start >= end) {
          callback(new Error('结束时间必须大于开始时间'));
        } else {
          callback();
        }
      };
      const validaRepeat = (rule, value, callback) => {
        const list = this.list.filter(item => {
          return item.ksmc == value
        })
        if(list && list.length > 0) {
          callback('考试名称已存在！')
        }else {
          callback();
        }
      }
      return {
        copyDisabled: false,
        copyLoading: false,
        value2: [], // 排考方式开关开关
        value3: [], // 是否可录入开关
        value4: [], // 是否审核开关
        list: [],
        xxdm: '',
        dqxn: '',
        dqxq: '',
        loading: true,
        dialogForm: false, // 定义新增弹框默认关闭
        pkxzDialogForm: false,
        dialogStatus: '',
        kswh: {
          /** 保存的form表单数据**/
          ksmc: '',
          kslx: '',
          ksxn: '',
          ksxq: '',
          xxdm: this.xxdm,
          pkfs: 0,
          query: {
            page: 1,
            limit: 8
          }
        },
        rwztOptions: ['期中', '期末', '月考'],
        typeOptions: ['常规排课', '单双周', '暑假排课'],
        xnList: [],
        xqList: [],
        kslxList: [],
        temp: {
          /** 保存的form表单数据**/
          jlid: undefined,
          ksmc: '',
          kslx: '',
          tempTime: '',
          kskssj: null,
          ksjssj: null,
          czsj: new Date(),
          yhm: '',
          query: this.query,
          xxdm: this.xxdm,
          ksxn: this.dqxn,
          ksxq: this.dqxq
        },
        textMap: {
          update: '修改考试',
          create: '新建考试'
        },
        tableData: [],
        total: 0,
        rules: {
          /** 表单验证规则**/
          ksmc: [
            { required: true, message: '请输入任务名称', trigger: 'change' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'change' },
            { validator: validaRepeat, trigger: 'change' }],
          kslx: [{ required: true, message: '考试类型不能为空' }],
          ksxn: [{ required: true, message: '学年不能为空' }],
          ksxq: [{ required: true, message: '学期不能为空' }],
          tempTime: [{ required: true, message: '请选择日期', trigger: 'change' },
            { validator: validaDate, trigger: 'change' }]
        },
        tempName: '',
        buttonLoading: false
      }
    },
    filters: {
      formatDate(time) {
        /** 过滤时间格式**/
        const date = new Date(time);
        return formatDate(date, 'yyyy年MM月dd日');
      },
      xqTostring(v) {
        return v === '01' ? '上学期' : '下学期';
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      /** 初始化学年 **/
      api.xnList({ xxdm: this.xxdm }).then(response => {
        this.xnList = response;
      })
      /** 初始化学期 **/
      api.xqList({ xxdm: this.xxdm }).then(response => {
        this.xqList = response;
      })
      /** 初始考试类型 **/
      api.getKslxList({ xxdm: this.xxdm }).then(response => {
        this.kslxList = response.data;
      })
      api.dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        this.dqxn = response.data.xn;
        this.dqxq = response.data.xq;
        this.kswh.ksxn = this.dqxn
        this.kswh.ksxq = this.dqxq
        this.getKswhList();// 搜索条件
      })
    },
    methods: {
      getKswhList() {
        /** 考试维护列表**/
        
        this.loading = true;
        this.kswh.xxdm = this.xxdm;
        api.getPageList(this.kswh).then(res => {
          this.total = res.data.total;
          this.list = res.data.rows;
          this.loading = false;
        });
      },
      toPage(v, index, activeName) {
        // 判断是否发布
        // checkIsFinish({examId: v.jlid}).then(res => {
        //   if(res.resultCode === 1) {
        //     if(res.value) {
        //       this.$notify({ title: '警告', message: '考试已公布不能修改。', type: 'warning'});
        //       return
        //     }else {
              /** 跳转排课设置页面**/
              this.$router.push({
                path: '/ksgl/top',
                query: {
                  name: v.ksmc,
                  index, /** 排课模块跳转标识 **/
                  ksid: v.jlid,
                  dqxn: this.dqxn,
                  ksxn: v.ksxn,
                  ksxq: v.ksxq,
                  xxdm: this.xxdm,
                  pkfs: v.pkfs,
                  activeName /** 排课tab定位标识 **/
                }
              });
        //     }
        //   }
        // })
        
      },
      resetTemp() {
        this.temp = {
          /** 保存的form表单数据**/
          jlid: undefined,
          ksmc: '',
          kslx: '',
          tempTime: '',
          kskssj: null,
          ksjssj: null,
          czsj: new Date(),
          yhm: '',
          query: this.query,
          xxdm: this.xxdm,
          ksxn: this.dqxn,
          ksxq: this.dqxq
        }
      },
      handleAdd() {
        /** 打开新增弹框**/
        this.dialogStatus = 'create'
        this.resetTemp();
        this.dialogForm = true;
        this.buttonLoading = false
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      saveData() {
        /** 提交数据**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.buttonLoading = true
            api.getValidaName({name:this.temp.ksmc}).then(res => {
              if(res.resultCode === 1) {
                if(res.value) {
                  const tempData = Object.assign({}, this.temp);
                  tempData.czsj = +new Date(tempData.czsj);
                  tempData.kskssj = +new Date(tempData.tempTime[0]);
                  tempData.ksjssj = +new Date(tempData.tempTime[1]);
                  api.getAdd(tempData).then(() => {
                    this.dialogForm = false;
                    this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
                    this.getKswhList();
                    
                  })
                }
              }
            })
          }
        })
      },
      handleUpdate(row) {
        this.dialogStatus = 'update';
        const tempData = Object.assign({}, row);
        this.temp.jlid = tempData.jlid;
        this.temp.ksmc = tempData.ksmc;
        this.temp.kslx = tempData.kslx;
        this.temp.ksxn = tempData.ksxn;
        this.temp.ksxq = tempData.ksxq;
        this.temp.czsj = tempData.czsj;
        /** 转中国标准时间插件需要的格式Tue Sep 19 2017 08:00:00 GMT+0800 (中国标准时间)**/
        this.temp.tempTime = [new Date(tempData.kskssj), new Date(tempData.ksjssj)];
        this.dialogForm = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      updateSaveData() {
        /** 修改**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.kskssj = +new Date(tempData.tempTime[0]);
            tempData.ksjssj = +new Date(tempData.tempTime[1]);
            api.getUpdate(tempData.rwid, tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
              this.getKswhList();
            })
          }
        })
      },
      deleteData(item) {
        if (item.gkqk !== 1) {
          /** 删除**/
          this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
            api.getDelete(item.jlid).then(() => {
              this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
              this.getKswhList();
            });
          });
        } else {
          this.$notify({ title: '警告', message: '考试已发布不能删除。', type: 'warning'});
        }
      },
      /**
       * 选择学期
       */
      handlerSelectXq(val) {
        this.temp.ksmc = this.temp.ksxn + '学年' +  _.find(this.xqList, {xq:this.temp.ksxq}).xqmc + _.find(this.kslxList, {jlid:this.temp.kslx}).lxmc
      },
      handlerSelectKslx(val) {
        this.temp.ksmc = this.temp.ksxn + '学年' +  _.find(this.xqList, {xq:this.temp.ksxq}).xqmc + _.find(this.kslxList, {jlid:this.temp.kslx}).lxmc
      },
      colseDialog() {
        this.dialogForm = false;
      },
      handleSizeChange(val) {
        /** 跳转到某页**/
        this.kswh.query.limit = val;
        this.getKswhList();
      },
      handleCurrentChange(val) {
        /** 跳转到某页**/
        this.kswh.query.page = val;
        this.getKswhList();
      },
      search() {
        this.kswh.query.page = 1;
        this.getKswhList('search');
      },
      setKslx(v) {
        const e = _.find(this.kslxList, ['jlid', v]);
        return e ? e.lxmc : ''
      },
      setStateValue(v, e, id) {
        const value = { jlid: id }
        if (e === 0) {
          value.pkfs = v ? 1 : 0;
        } else if (e === 1) {
          value.lrzt = v ? 1 : 0;
        } else {
          value.sffs = v ? 1 : 0;
        }
        api.getUpdateState(value).then(() => {
          this.getKswhList();
          this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 });
        })
      },
      classColor(v) {
        return 'aa_' + v;
      }

    },
    computed: {
      unreadNum() {
        return this.unread.length;
      }

    }
  }

</script>

<style scoped>
  .content-container {
    padding: 20px;
  }
  .content-container .item {
    margin-top: 5px;
  }

  .aa_0 .el-badge__content {
    background-color: #f56c6c;
  }

  .aa_1 .el-badge__content {
    background-color: #ff9800;
  }

  .aa_2 .el-badge__content {
    background-color: #8bc34a;
  }

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 78px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .del-dialog-cnt {
    font-size: 16px;
    text-align: center;
  }

  .content-container.el-date-editor .el-range-separator {
    width: 12%;
  }
  .handle-select {
    width: 95px;
  }
  .content-container h4 {
    font-weight: bold;
    font-size: 16px;
    font-family: 宋体;
    line-height: 1.1;
    color: inherit;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .content-container p {
    margin: 0 0 10px;
    font-size: 14px;
    line-height: 1.42857143;
  }
</style>
