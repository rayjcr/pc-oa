<!--排课系统首页-->
<template>
  <section class="content-container">
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10"  @click="centerDialogVisible = true">添加个人计划</el-button>
      <el-select v-model="listQuery.cfjh" clearable placeholder="我的任务" style="width: 12%">
        <el-option v-for="(item,index) in  jhlxOptions" :key="index" :label="item" :value="index + 2"></el-option>
      </el-select>
      <el-input v-model="listQuery.jhbt" placeholder="筛选关键词" class="handle-input mr10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <div v-loading="loading">
      <!--列表-->
      <el-row :gutter="12" style="margin-bottom:6px;" v-for="(item,index) in list" :key="index">
        <el-col :span="24">
          <el-card shadow="always"  :class="classColor(item.cfjh)">
              <h4>{{item.jhbt}}</h4>
            <div style="height: 10px;">
              <h5>{{item.ksrq}} - {{item.jsrq}}</h5>
            </div>
            <div style="height: 30px;">
              <h5 v-if="item.txfs == 1"><p style="color: #9d9d9d">立刻</p></h5>
              <h5 v-else-if="item.txfs == 2"><p style="color: #1ecd70">5分钟前</p></h5>
              <h5 v-else-if="item.txfs == 3"><p style="color: #ffb169">30分钟前</p></h5>
              <h5 v-else-if="item.txfs == 4"><p style="color: #00c3f5">1小时前</p></h5>
              <h5 v-else-if="item.txfs == 5"><p style="color: #ff4b3a">1天前</p></h5>
            </div>
            <img v-if="item.cfjh == 1" src="../../../assets/day.png" class="timeicon">
            <img v-if="item.cfjh == 2" src="../../../assets/day.png" class="timeicon">
            <img v-if="item.cfjh == 3" src="../../../assets/week.png" class="timeicon">
            <img v-if="item.cfjh == 4" src="../../../assets/month.png" class="timeicon">
            <img v-if="item.cfjh == 5" src="../../../assets/year.png" class="timeicon">

          </el-card>
        </el-col>
      </el-row>
      <!--工具条-->
      <el-col :span="24">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.page" :page-sizes="[4,8,12,16,20]"
                       :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-col>
      <el-dialog  title="添加个人计划" :visible.sync="centerDialogVisible" width="40%" height="450px" center>
        <el-form :model="temp" :rules="rules" ref="dataForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="计划标题" prop="name" >
            <div style="width: 60%">
              <el-input v-model="temp.name" ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="计划日期" required>
            <div style="width: 60%">
              <el-col :span="24">
                <el-form-item prop="tempTime">
                  <el-date-picker
                    :unlink-panels=true
                    v-model="temp.tempTime"
                    style="width: 100%;"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </div>
          </el-form-item>
          <el-form-item label="重要程度" prop="zycd">
            <div style="margin-top: 11px;">
              <el-rate v-model="temp.zycd" >
              </el-rate>
            </div>
          </el-form-item>
          <el-form-item label="循环计划" prop="type">
            <div style="margin-top: 5px">
              <el-radio-group v-model="temp.cfjh" size="small">
                <el-radio label="1" border>每日</el-radio>
                <el-radio label="2" border>每周</el-radio>
                <el-radio label="3" border>每月</el-radio>
                <el-radio label="4" border>每年</el-radio>
              </el-radio-group>
              <el-button icon="el-icon-bell" plain circle @click="timeDialogVisible = true"></el-button>
            </div>
          </el-form-item>
          <el-form-item label="提醒方式" prop="txfs">
            <div style="margin-top: 5px">
              <el-radio-group v-model="temp.txfs" size="small">
                <el-radio label="1" border>前5分钟</el-radio>
                <el-radio label="2" border>前30分钟</el-radio>
                <el-radio label="3" border>前1小时</el-radio>
                <el-radio label="4" border>前1天</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="计划内容">
            <el-input  type="textarea" :autosize="{ minRows: 4, maxRows: 6}"  v-model="temp.jhnr"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button  type="primary" @click="saveData">保存</el-button>
        </span>
      </el-dialog>
      <!-- 提醒时间设置窗口-->
      <el-dialog  title="提醒时间设置" :visible.sync="timeDialogVisible" width="20%" height="250px" center>
        <el-form :model="temp" :rules="rules" ref="dataForm" class="demo-ruleForm">
          <el-form-item>
            <el-time-picker
              arrow-control
              v-model="temp.txTime" format="HH:mm" value-format="HH:mm" size="small "
              placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>
          <el-form-item v-if="temp.cfjh == 2">
            <el-checkbox-group v-model="temp.txWeek" size="small">
              <el-checkbox label="1" border>星期一</el-checkbox>
              <el-checkbox label="2" border>星期二</el-checkbox>
              <el-checkbox label="3" border>星期三</el-checkbox>
              <el-checkbox label="4" border>星期四</el-checkbox>
              <el-checkbox label="5" border>星期五</el-checkbox>
              <el-checkbox label="6" border>星期六</el-checkbox>
              <el-checkbox label="7" border>星期日</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="temp.cfjh == 3">
            <el-checkbox-group v-model="temp.txDay" size="small" >
                <el-checkbox v-for="o in 31" :key="o" :label="o" border>{{o}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="temp.cfjh == 4">
            <el-date-picker
              format="MM-dd"
              value-format="MM-dd"
              v-model="temp.txYear"
              type="dates"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button  type="primary" @click="saveTime">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </section>
</template>
<script>
  import { formatDate } from '@/utils';
  import { queryPageList, add } from 'api/oasysys/rwjh/index';
  export default {
    data() {
      /** 验证名称不能重复**/
      const validaName = (rule, value, callback) => {
        if (this.dialogStatus === 'update' && value === this.tempName) {
          callback();
        }
      };
      /** 验证任务时间**/
      const validaDate = (rule, value, callback) => {
        const [start, end] = [new Date(value[0]), new Date(value[1])];
        if (start >= end) {
          callback(new Error('结束时间必须大于开始时间'));
        } else {
          callback();
        }
      };
      return {
        copyDisabled: false,
        copyLoading: false,
        rwDisabled: false,
        centerDialogVisible: false,
        timeDialogVisible: false,
        value3: new Date(2016, 9, 10, 8, 0),
        listQuery: {              // 分页
          page: 1,
          limit: 4,
          zgh: '102',
          ksrq: '2019-01-02',
          cfjh: '',
          jhbt: '',
          xxdm: window.localStorage.getItem('xxdm')
        },
        list: [],
        xxdm: window.localStorage.getItem('xxdm'),
        loading: false,
        dialogForm: false, // 定义新增弹框默认关闭
        pkxzDialogForm: false,
        dialogStatus: '',
        listRwZt: [/** 列表显示的三种状态**/
          { pkmc: '排课中', pksz: false, pkwh: true, pkjg: true, qy: true, lspk: true },
          { pkmc: '未启用', pksz: false, pkwh: false, pkjg: false, qy: false, lspk: true },
          { pkmc: '已启用', pksz: true, pkwh: true, pkjg: false, qy: true, lspk: false }
        ],
        rwjh: {
          /** 保存的form表单数据**/
          rwlx: '',
          fblx: '',
          rwmc: '',
          xxdm: this.xxdm
        },
        jhlxOptions: ['每日', '每周', '每月', '每年'],
        meOptions: ['我关注的', '我负责的'],
        xnList: [],
        temp: {
          /** 保存的form表单数据**/
          name: '',
          txfs: '',
          rwzt: '',
          cfjh: '',
          tempTime: '',
          txTime: '',
          txWeek: [],
          txDay: [],
          txYear: [],
          kssj: null,
          jssj: null,
          xxdm: this.xxdm,
          zycd: null,
          jhnr: ''
        },
        textMap: {
          update: '修改排课任务',
          create: '新建排课任务',
          copy: '复用排课任务'
        },
        tableData: [],
        total: 0,
        rules: {
          /** 表单验证规则**/
          name: [
            { required: true, message: '请输入任务名称', trigger: 'change' },
            { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'change' },
            { validator: validaName, trigger: 'change' }],
          cfjh: [{ required: true }],
          tempTime: [{ required: true, message: '请选择日期', trigger: 'change' },
            { validator: validaDate, trigger: 'change' }]
        },
        tempName: ''
      }
    },
    filters: {
      formatDate(time) {
        /** 过滤时间格式**/
        const date = new Date(time);
        return formatDate(date, 'yyyy年MM月dd日');
      }
    },
    created() {
      this.getAllList();
    },
    methods: {
      getAllList() {
        queryPageList(this.listQuery).then(res => {
          this.total = res.data.total;
          this.list = res.data.rows;
          this.listLoading = false;
        });
      },
      toPksz(v, index, activeName) {
        /** 跳转排课设置页面**/
        this.$router.push({
          path: '/pkxt/pksz',
          query: {
            name: v.name,
            index, /** 排课模块跳转标识 **/
            rwid: v.rwid,
            rwxn: v.xn,
            xxdm: this.xxdm,
            dqxn: this.dqxn,
            dqxq: this.dqxq,
            activeName /** 排课tab定位标识 **/
          }
        });
      },
      resetTemp() {
        this.temp = {
          name: '',
          rwzt: '',
          tempTime: '',
          kssj: null,
          jssj: null,
          xxdm: this.xxdm,
          txfs: '',
          cfjh: '',
          txTime: '',
          txWeek: [],
          txDay: [],
          txYear: [],
          zycd: null,
          jhnr: ''
        }
      },
      handleAdd() {
        /** 打开新增弹框**/
        this.dialogStatus = 'create'
        this.resetTemp();
        this.dialogForm = true;
        this.rwDisabled = false;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      saveData() {
        /** 提交数据**/
        const timeArr = this.temp.tempTime;
        if (timeArr !== null && timeArr !== '') {
          const kssjTime = new Date(timeArr[0]);
          const jssjTime = new Date(timeArr[1]);
          this.temp.kssj = formatDate(kssjTime, 'yyyy-MM-dd');
          this.temp.jssj = formatDate(jssjTime, 'yyyy-MM-dd');
        }
        console.log(this.temp)
        add(this.temp).then(() => {
          this.dialogForm = false;
          this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 });
          this.resetTemp();
        });
        console.log(this.temp)
       /* this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.cjsj = +new Date(tempData.cjsj);
            tempData.kssj = +new Date(tempData.tempTime[0]);
            tempData.jssj = +new Date(tempData.tempTime[1]);
            getAdd(tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
              this.getPkrwList();
            })
          }
        })*/
      },
      saveTime() {
        this.timeDialogVisible = false;
      },
      handleUpdate(row) {
        this.dialogStatus = 'update';
        const tempData = Object.assign({}, row);
        this.temp.rwid = tempData.rwid;
        this.temp.name = tempData.name;
        this.tempName = tempData.name;
        this.temp.type = tempData.type;
        this.temp.rwzt = tempData.rwzt;
        this.temp.xn = tempData.xn;
        this.temp.cjsj = tempData.cjsj;
        /** 转中国标准时间插件需要的格式Tue Sep 19 2017 08:00:00 GMT+0800 (中国标准时间)**/
        this.temp.tempTime = [new Date(tempData.kssj), new Date(tempData.jssj)];
        this.dialogForm = true;
        this.rwDisabled = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      updateSaveData() {
        /** 修改**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.kssj = +new Date(tempData.tempTime[0]);
            tempData.jssj = +new Date(tempData.tempTime[1]);
            getUpdate(tempData.rwid, tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
              this.getPkrwList();
            })
          }
        })
      },
      openData(id) {
        /** 启用**/
        this.$confirm('确认要启用吗？', '提示', { type: 'warning' }).then(() => {
          const data = { rwid: id, rwzt: '2' }
          const tempData = Object.assign({}, data);
          getUpdate(id, tempData).then(() => {
            this.$notify({ title: '成功', message: '启用成功', type: 'success', duration: 2000 });
            this.getPkrwList();
          });
        });
      },
      handleCopy(row) {
        /** 复用**/
        this.dialogStatus = 'copy';
        const tempData = Object.assign({}, row);
        this.temp.rwid = tempData.rwid;
        this.temp.name = tempData.name + ' - 副本';
        this.temp.type = tempData.type;
        this.temp.rwzt = tempData.rwzt;
        this.temp.xn = this.dqxn;
        this.temp.xxdm = this.xxdm;
        /** 转中国标准时间插件需要的格式Tue Sep 19 2017 08:00:00 GMT+0800 (中国标准时间)**/
        this.temp.tempTime = [new Date(tempData.kssj), new Date(tempData.jssj)];
        this.dialogForm = true;
        this.rwDisabled = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      copySaveData() {
        this.copyDisabled = true;
        /** 复用保存**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.cjsj = +new Date(tempData.cjsj);
            tempData.kssj = +new Date(tempData.tempTime[0]);
            tempData.jssj = +new Date(tempData.tempTime[1]);
            getCopy(tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
              this.getPkrwList();
              this.copyDisabled = false;
            })
          }
        })
      },
      deleteData(id) {
        /** 删除**/
        this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
          getDelete(id).then(() => {
            this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
            this.getPkrwList();
          });
        });
      },
      colseDialog() {
        this.dialogForm = false;
      },
      handleSizeChange(val) {
        /** 跳转到某页**/
        this.listQuery.limit = val;
        this.getAllList();
      },
      handleCurrentChange(val) {
        /** 跳转到某页**/
        this.listQuery.page = val;
        this.getAllList();
      },
      search() {
        this.getAllList();
      },
      classColor(v) {
        switch (v) {
          case '1': return 'warpStyle';
          case '2': return 'warpStyle';
          case '3': return 'warpStyle-week';
          case '4': return 'warpStyle-month';
          case '5': return 'warpStyle-year';
        }
      }

    },
    computed: {
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
    text-align: center
  }

  .content-container.el-date-editor .el-range-separator {
    width: 12%;
  }
  .handle-select {
    width: 95px;
  }
  .content-container h4 {
    font-weight : bold;
    font-size: 16px;
    font-family: 宋体;
  }

  .warpStyle{
    border-left: 10px solid #1ecd70;
    position: relative;
  }

  .warpStyle-week{
    border-left: 10px solid #ffb169;
    position: relative;
  }

  .warpStyle-month{
    border-left: 10px solid #00c3f5;
    position: relative;
  }

  .warpStyle-year{
    border-left: 10px solid #ff4b3a;
    position: relative;
  }

  .timeicon{
    width: 40px;
    position: absolute;
    top: 0px;
    right: 0px;
  }
</style>


