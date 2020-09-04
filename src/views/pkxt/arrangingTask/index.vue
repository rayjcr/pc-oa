<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-31 16:48:19
 * @LastEditTime: 2019-08-13 18:39:35
 * @LastEditors: Please set LastEditors
 -->
<!--排课系统首页-->
<template>
  <div class="content-container">

  <div class="u_TableMain columns ofhide">

    <div class="filter-container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新建排课任务</el-button>
        <el-select v-model="pkrw.rwzt" clearable placeholder="请选择" class="handle-select mr10">
          <el-option v-for="(item,index) in  rwztOptions" :key="index" :label="item" :value="index"></el-option>
        </el-select>
        <el-input v-model="pkrw.name" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <i style="display: block;font-size: 20px; margin-top:10px;color: #606266;float: right;"
          class="el-icon-question" @click="ckPkxz">&nbsp;<span style="color: red;line-height:20px; float:right; font-size: 14px;font-family: '微软雅黑'">排课需知</span></i>
      </div>
    </div>

    <div v-loading="loading" class="taskListMain">
      <!--列表-->
      <el-row :gutter="12" style="margin-bottom:20px;">

          <div class="taskPadding"   v-for="(item,index) in list" :key="index" :class="classColor(item.rwzt)">

          <el-card class="taskBox" shadow="always">

            <div style="float:left;">
                <el-badge :value="listRwZt[item.rwzt].pkmc">
                <h4>{{item.name}}</h4>
                </el-badge>
                <div style="height: 72px;">
                <p>起止时间:{{item.kssj | formatDate}}-{{item.jssj | formatDate}}</p>
                <p>创建时间:{{item.cjsj | formatDate}}</p>
                </div>
                <div>
                <el-row>
                    <el-button @click="toPksz(item,0,'0')" size="small" icon="iconfont icon-el-icon-config" plain
                            :type="listRwZt[item.rwzt].pksz?'info':'primary'"
                            :disabled="listRwZt[item.rwzt].pksz">排课设置
                    </el-button>
                    <el-button @click="toPksz(item,3,'0')" size="small" icon="iconfont icon-el-icon-survey" plain
                            :type="listRwZt[item.rwzt].pkwh?'info':'primary'"
                            :disabled="listRwZt[item.rwzt].pkwh">排课调整
                    </el-button>
                    <el-button @click="toPksz(item,4,'0')" size="small" icon="iconfont icon-el-icon-templatedefault" plain
                            :type="listRwZt[item.rwzt].pkjg?'info':'primary'"
                            :disabled="listRwZt[item.rwzt].pkjg">排课结果
                    </el-button>
                    <!-- <el-button @click="toPksz(item,3,'2')" size="small" icon="iconfont icon-el-icon-yuyuedingdan" plain
                                :type="listRwZt[item.rwzt].lspk?'info':'primary'"
                                :disabled="listRwZt[item.rwzt].lspk">临时 调课
                    </el-button>-->
                </el-row>
                
                </div>
            </div>
            <!-- <p></p> -->

            <div class="taskContral" style="width:170px;">
                <!-- <el-tooltip class="item" effect="dark" content="修改" placement="top-start">-->
                <el-button class="taskBtn" @click="handleUpdate(item)" size="mini" type="primary" icon="el-icon-edit-outline"
                >修改</el-button>
                <!-- </el-tooltip>-->
                <el-button class="taskBtn" @click="deleteData(item)" size="mini" type="danger" icon="el-icon-delete"
                >删除</el-button>
                <el-button class="taskBtn" @click="openData(item)" size="mini" type="success" icon="el-icon-tickets"
                            :disabled="item.rwzt==2||item.rwzt==1?false:true"><!--listRwZt[item.rwzt].qy-->{{item.rwzt==2?value[1]:value[0]}}</el-button>
                <el-button class="taskBtn" @click="handleCopy(item)" size="mini" type="warning"
                            icon="el-icon-document"
                >复用</el-button>
            </div>


          </el-card>

          </div>
          
      </el-row>

      
      <!--工具条-->
      <el-col :span="24">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="pkrw.query.page" :page-sizes="[4,8,12,16,20]"
                       :page-size="pkrw.query.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-col>



    </div>





      
    </div>

    <!--新增界面-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogForm" :close-on-click-modal="false" width="450px" @close="colseDialog">
        <el-form :model="temp" :rules="rules" ref="dataForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item label="学年" prop="xn">
            <el-select v-model="temp.xn" style="width: 100%;">
              <el-option v-for="(item,index) in  xnList" :key="(index+1)" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型" prop="type">
            <el-select v-model="temp.type" style="width: 100%;" :disabled="rwDisabled" placeholder="请选择任务类型">
              <el-option v-for="(item,index) in  typeOptions" :key="(index+1)" :label="item"
                         :value="(index+1)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务日期" required>
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
            <!-- <el-col :span="11">
               <el-form-item prop="kssj">
                 <el-date-picker type="date" placeholder="选择日期" v-model="temp.kssj"
                                 style="width: 100%;"></el-date-picker>
               </el-form-item>
             </el-col>
             <el-col class="line" :span="1">&nbsp;-</el-col>
             <el-col :span="11">
               <el-form-item prop="jssj">
                 <el-date-picker type="date" placeholder="选择日期" v-model="temp.jssj"
                                 style="width: 100%;"></el-date-picker>
               </el-form-item>
             </el-col>-->
          </el-form-item>
          <el-form-item label="年级班级" prop="gradeGroup">
            <!-- <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in gradeList" :key="index">
                <template slot="title">
                  <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll"
                               :disabled="item.disabled"
                               @change="handleCheckAllChange(index,$event)">{{item.name}}
                  </el-checkbox>
                </template>
                <div>
                  <template>
                    <el-card shadow="never">
                      <el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange(index,$event)">
                        <el-checkbox v-for="city in item.children"
                                     :disabled="city.disabled"
                                     :label="city.code" :key="city.code">{{city.name}}
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-card>
                  </template>
                </div>
              </el-collapse-item>
            </el-collapse> -->
            <cascaderClass :baseList="baseList" v-if="dialogForm" :checkAll="(this.dialogStatus=='update'||this.dialogStatus=='copy')?false:true" :disable="this.gradeList[0].disabled == true ? true : false" :checkClass="checkClass" @change="changeClassVal" ></cascaderClass>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseDialog">取消</el-button>
          <!--修改-->
          <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSaveData">确认</el-button>
          <!--复用-->
          <el-button v-else-if="dialogStatus=='copy'" type="primary" :disabled="copyDisabled" @click="copySaveData">确认
          </el-button>
          <!--保存-->
          <el-button v-else type="primary" @click="saveData">确认</el-button>
        </div>
      </el-dialog>

      <!--查看排课须知 -->
      <el-dialog title="排课需知" center :visible.sync="pkxzDialogForm" width="29%" @close="colseDialog">
        <el-form ref="dataForm" class="demo-ruleForm">
          <el-form-item label="排课流程：" prop="name"/>
          <el-alert title="第一步：创建本次排课任务,选择排课类型。" type="success" :closable="false" show-icon></el-alert>
          <el-alert title="第二步：录入本次排课的基础信息。" type="success" :closable="false" show-icon></el-alert>
          <el-alert title="第三步：根据学校实际情况,选填所需的排课规则。" type="success" :closable="false" show-icon></el-alert>
          <el-alert title="第四步：点击自动排课,生成课表。" type="success" :closable="false" show-icon></el-alert>
          <el-alert title="*说明：如果排课结果未达到老师满意,也可进行手动微调,同时也支持个别年级进行重新排课。" type="error" :closable="false"/>
          <el-form-item label="排课注意事项：" prop="name"/>
          <el-alert title="1、要求按照流程一步一步设置,避免出现未成功排课。" type="warning" :closable="false" show-icon></el-alert>
          <el-alert title="2、不需要的规则条件尽量不要设置,以免影响排课结果。" type="warning" :closable="false" show-icon></el-alert>
          <el-alert title="3、课表启用后,不可再进行重新排课操作。" type="warning" :closable="false" show-icon></el-alert>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closePkxz">关闭</el-button>
        </div>
      </el-dialog>
  

  </div>
</template>

<script>
  /* eslint-disable no-cond-assign */

  import * as api from '@/api/pkxt/arrangingTask/index'
  import cascaderClass from '@/components/CascaderClass/index'
  import { formatDate } from '@/utils'
  export default {
    components: {cascaderClass},
    data() {
      /** 验证名称不能重复**/
      const validaName = (rule, value, callback) => {
        if (this.dialogStatus === 'update' && value === this.tempName) {
          callback();
        } else {
          api.getValidaName({ name: value }).then(res => {
            if (res.data > 0) {
              callback(new Error('任务名称不能重复'));
            } else {
              callback();
            }
          })
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
        gradeList: [],
        value: ['启用', '禁用'],
        copyDisabled: false,
        copyLoading: false,
        rwDisabled: false,
        list: [],
        xxdm: window.localStorage.getItem('xxdm'),
        dqxn: '',
        dqxq: '',
        loading: true,
        dialogForm: false, // 定义新增弹框默认关闭
        pkxzDialogForm: false,
        dialogStatus: '',
        listRwZt: [/** 列表显示的三种状态**/
          { pkmc: '排课中', pksz: false, pkwh: true, pkjg: true, qy: true, lspk: true },
          { pkmc: '未启用', pksz: false, pkwh: false, pkjg: false, qy: false, lspk: true },
          { pkmc: '已启用', pksz: true, pkwh: true, pkjg: false, qy: true, lspk: false }
        ],
        pkrw: {
          /** 保存的form表单数据**/
          name: '',
          type: '',
          rwzt: '',
          xxdm: this.xxdm,
          query: {
            page: 1,
            limit: 4
          }
        },
        rwztOptions: ['排课中', '未启用', '已启用'],
        typeOptions: ['常规排课', '单双周', '暑假排课'],
        xnList: [],
        temp: {
          /** 保存的form表单数据**/
          rwid: undefined,
          name: '',
          type: 1,
          rwzt: '0',
          tempTime: '',
          kssj: null,
          jssj: null,
          cjsj: new Date(),
          query: this.query,
          xxdm: this.xxdm,
          xn: this.dqxn,
          gradeGroup: [],
          classGroup: []
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
          type: [{ required: true }],
          xn: [{ required: true, message: '学年不能为空' }],
          tempTime: [{ required: true, message: '请选择日期', trigger: 'change' },
            { validator: validaDate, trigger: 'change' }]
          /* ,kssj: [{type: 'date', required: true, message: '请选择日期', trigger: 'change'}],
          jssj: [{type: 'date', required: true, message: '请选择日期', trigger: 'change'}]*/
        },
        tempName: '',
        checkClass:[],                  //已经选中的班级
        baseList:[],                    //需要传给子组件的班级年级数据
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
      api.dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        this.dqxn = response.data.xn;
        this.dqxq = response.data.xq;
        this.getPkrwList();// 搜索条件
      })
    },

    methods: {
      getPkrwList() {
        /** 排课任务列表**/
        this.loading = true;
        this.pkrw.xxdm = window.localStorage.getItem('xxdm');
        api.getPageList(this.pkrw).then(res => {
          this.total = res.data.total;
          this.list = res.data.rows;
          this.loading = false;
        });
        api.xnPage({ xxdm: this.xxdm, page: 1, limit: 20000 }).then(response => {
          const year = response.data.rows;
          const rxxn = [];
          for (let i = 0; i < year.length; i++) {
            rxxn[i] = year[i].xn
          }
          this.xnList = _.uniq(rxxn);
        })
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
            rwzt: v.rwzt,
            activeName /** 排课tab定位标识 **/
          }
        });
      },
      resetTemp() {
        this.temp = {
          rwid: undefined,
          name: '',
          type: 1,
          rwzt: '0',
          tempTime: '',
          kssj: null,
          jssj: null,
          cjsj: new Date(),
          query: this.query,
          xxdm: this.xxdm,
          xn: this.dqxn
        }
      },
      getGradeClassInit(rwid, status) {
        this.gradeList = [];
        api.getGradeList({ rwid, status }).then(r => {
          this.gradeList = r.data
          this.baseList = r.data;
          for(var i=0;i<r.data.length;i++){
            for(var j=0;j<r.data[i].children.length;j++){
              if(r.data[i].children[j].checked == true){
                this.checkClass.push([r.data[i].code,r.data[i].children[j].code])
              }  
            }
          }
          this.dialogForm = true;
          this.$nextTick(() => {
            this.$refs.dataForm.clearValidate();
          })
        })
      },
      handleAdd() {
        /** 打开新增弹框**/
        var that = this;
        this.dialogStatus = 'create'
        this.resetTemp();
        this.rwDisabled = false;
        this.getGradeClassInit('', this.dialogStatus);
        
      },
      saveData() {
        /** 提交数据**/



        this.$refs.dataForm.validate(valid => {
            if (valid) {
                // 年级班级保存处理
                if (this.checkClass.length > 0) {
                this.temp.gradeGroup = []
                this.temp.classGroup = []
                // console.log(this.checkClass,440066)
                for(var i=0;i<this.checkClass.length;i++){
                    if(!this.temp.gradeGroup.includes(this.checkClass[i][0])){
                        this.temp.gradeGroup.push(this.checkClass[i][0]);
                    }
                    this.temp.classGroup.push(this.checkClass[i][1]);
                }
              
                const tempData = Object.assign({}, this.temp);
                tempData.cjsj = +new Date(tempData.cjsj);
                tempData.kssj = +new Date(tempData.tempTime[0]);
                tempData.jssj = +new Date(tempData.tempTime[1]);
                
                api.getAdd(tempData).then(() => {
                this.dialogForm = false;
                this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
                this.getPkrwList();
                })

                // } else {
                //     this.$message({
                //     message: '抱歉，至少选择一个班级！',
                //     type: 'warning'
                //     });
                // }

                } else {
                    this.$notify({title:"提示",message: '抱歉您没有选择班级！',type: 'warning'});
                }
            }
        })
      },
      handleUpdate(row) {
        this.checkClass = [];
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
        this.rwDisabled = true;
        // this.$refs.dataForm.clearValidate();
        // // this.$nextTick(() => {
          
        // // })
        this.getGradeClassInit(row.rwid, this.dialogStatus);
      },
      updateSaveData() {
        /** 修改**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            if (this.checkClass.length > 0) {
              tempData.gradeGroup = []
              tempData.classGroup = []
              // console.log(this.checkClass,440066)
              for(var i=0;i<this.checkClass.length;i++){
                if(!tempData.gradeGroup.includes(this.checkClass[i][0])){
                    tempData.gradeGroup.push(this.checkClass[i][0]);
                }
                tempData.classGroup.push(this.checkClass[i][1]);
              }
              tempData.kssj = +new Date(tempData.tempTime[0]);
              tempData.jssj = +new Date(tempData.tempTime[1]);
              api.getUpdate(tempData.rwid, tempData).then(() => {
                this.dialogForm = false;
                this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
                this.getPkrwList();
              })
            }
          }
        })
      },
      openData(e) {
        let [rwzt, messge] = ['', '']
        /** 启用**/
        if (e.rwzt === '1') {
          rwzt = '2';
          messge = '确认要启用吗？';
        } else {
          rwzt = '1';
          messge = '确认要禁用吗？';
        }
        this.$confirm(messge, '提示', { type: 'warning' }).then(() => {
          const data = { rwid: e.rwid, rwzt, xxdm: this.xxdm }
          const tempData = Object.assign({}, data);
          api.getUpdate(e.rwid, tempData).then(() => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 });
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
        this.temp.rwzt = tempData.rwzt === '2' ? '1' : tempData.rwzt;
        this.temp.xn = this.dqxn;
        this.temp.xxdm = this.xxdm;
        /** 转中国标准时间插件需要的格式Tue Sep 19 2017 08:00:00 GMT+0800 (中国标准时间)**/
        this.temp.tempTime = [new Date(tempData.kssj), new Date(tempData.jssj)];
        this.rwDisabled = true;
        
        this.getGradeClassInit(row.rwid, this.dialogStatus);
      },
      copySaveData() {
        this.copyDisabled = true;
        /** 复用保存**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            // 排课二期年级班级设置
            /* if (this.gradeList.length > 0) {
              this.temp.gradeGroup = []
              this.temp.classGroup = []
              for (const o of this.gradeList) {
                if (o.checkedCities.length > 0) {
                  if (o.disabled && !this.temp.gradeGroup.includes(o.code)) {
                    this.temp.gradeGroup.push(o.code);
                    o.checkedCities.forEach(e => {
                      if (e.disabled && !this.temp.gradeGroup.includes(e)) {
                        this.temp.classGroup.push(e);
                      }
                    })
                  }
                }
              }
            }*/
            // 基本数据
            const tempData = Object.assign({}, this.temp);
            tempData.cjsj = +new Date(tempData.cjsj);
            tempData.kssj = +new Date(tempData.tempTime[0]);
            tempData.jssj = +new Date(tempData.tempTime[1]);
            api.getCopy(tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '复用成功', type: 'success', duration: 2000 })
              this.getPkrwList();
              this.copyDisabled = false;
            })
          }
        })
      },
      deleteData(item) {
        if (item.rwzt === '2') {
          this.$alert('<strong>已启用任务不能删除</strong>', '温馨提示', {
            type: 'warning',
            dangerouslyUseHTMLString: true
          });
        } else {
          /** 删除**/
          this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
            api.getDelete(item.rwid).then(() => {
              this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
              this.getPkrwList();
            });
          });
        }
      },
      colseDialog() {
        this.$nextTick(() => {
            this.$refs.dataForm.clearValidate();
        })
        this.dialogForm = false;
      },
      // 查看排课须知
      ckPkxz() {
        this.pkxzDialogForm = true;
      },
      // 关闭排课须知
      closePkxz() {
        this.pkxzDialogForm = false;
      },
      handleSizeChange(val) {
        /** 跳转到某页**/
        this.pkrw.query.limit = val;
        this.getPkrwList();
      },
      handleCurrentChange(val) {
        /** 跳转到某页**/
        this.pkrw.query.page = val;
        this.getPkrwList();
      },
      search() {
        this.pkrw.query.page = 1;
        this.getPkrwList();
      },
      classColor(v) {
        return 'aa_' + v;
      },
      handleCheckAllChange(i, val) {
        const cityOptions = [];
        const json = this.gradeList[i];
        if (json.checkedCities = val) {
          for (const o of json.children) {
            cityOptions.push(o.code);
          }
        }
        this.$set(json, 'checkedCities', cityOptions);
        this.$set(json, 'isIndeterminate', false);
      },
      handleCheckedCitiesChange(i, value) {
        const json = this.gradeList[i];
        const checkedCount = value.length;
        const checkAll = checkedCount === json.children.length;
        this.$set(json, 'checkAll', checkAll);
        const isIndeterminate = checkedCount > 0 && checkedCount < json.children.length;
        this.$set(json, 'isIndeterminate', isIndeterminate);
      },
      
      /**
       * 接收组件变更班级后赋值给父级已经选择的班级
       * by:RayJ
       * time:2019-07-29
       */
      changeClassVal(val){
          this.checkClass = val;
        console.log(this.checkClass,662266)
      },
    

    },
    computed: {
      unreadNum() {
        return this.unread.length;
      }

    }
  }

</script>
<style lang="scss" scoped>
  .aa_0 /deep/ .el-badge__content {
    background-color: #f56c6c;
  }

  .aa_1 /deep/ .el-badge__content {
    background-color: #ff9800;
  }

  .aa_2 /deep/ .el-badge__content {
    background-color: #8bc34a;
  }
  .taskListMain{
    padding: 20px;
    .taskPadding{
        padding: 0 10px;
        display: inline-block;
        width: 50%;
        min-width: 560px;
        margin-bottom: 20px;
    }
    .taskBtn{
        margin: 5px;
    }
    /deep/ .el-card__body{
        float: left;
        width:100%;
    }
    .taskBox{
        position: relative;
        .taskContral{
            position: absolute;
            bottom: 15px;
            right: 15px;
        }
    }
  }
  .content-container /deep/ .el-badge__content.is-fixed{
    right:0px;
  }
</style>
<style scoped>
  .content-container {
    padding: 20px;
  }

  .content-container .item {
    margin-top: 5px;
  }

  .handle-box {
    /* margin-bottom: 20px; */
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


