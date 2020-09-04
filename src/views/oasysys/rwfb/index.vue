<template>
  <section class="content-container">
    <div v-loading="loading">
      <el-tabs :tab-position="tabPosition" style="height: 200px;">
        <el-tab-pane label="我发出的">
          <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">创建任务</el-button>
            <el-cascader v-model="rwzt"
              :options="wcztOptions" placeholder="完成状态"
              change-on-select clearable style="width:10%"
            ></el-cascader>
           <!-- <el-select v-model="jxrw.sjpx" clearable placeholder="时间排序" style="width:10%">
              <el-option v-for="(item,index) in  sjpxOptions" :key="index" :label="item" :value="index"></el-option>
            </el-select>-->
            <el-input v-model="jxrw.rwbt" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </div>
          <!--列表-->
          <el-row v-if="list.length>0" :gutter="12" style="margin-bottom:6px;cursor:pointer;" v-for="(item,index) in list" :key="index" >
            <el-col :span="23">
              <el-card shadow="hover" class="list-views" >
                <div style="height: 52px;font-size: 12px;" @click="openInfo(item)">
                <p>任务标题：{{item.rwbt}}</p>
                  <p>时间：{{item.ksrq | formatDate}}至{{item.jsrq | formatDate}}</p>
                   <p>紧急程度：
                    <el-button class="rwwczt" :type="typeCd[0].label" size="mini" round>{{typeCd[0].value}}</el-button>
                  </p>
                </div>
                <p></p>
              </el-card>
              <span :class="rwztStyle[(item.rwzt-1)].label">{{rwztStyle[(item.rwzt-1)].name}}</span>
            </el-col>
          </el-row>
          <el-row>
            <div>暂无数据！</div>
          </el-row>
          <!--工具条-->
          <el-col :span="24">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="jxrw.query.page" :page-sizes="[5,10,15,20,25]"
                           :page-size="jxrw.query.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="我负责的">
         <!-- <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">创建任务</el-button>
            <el-cascader
              :options="wcztOptions" placeholder="完成状态"
              change-on-select clearable style="width:10%"
            ></el-cascader>
            <el-select v-model="jxrw.rwzt" clearable placeholder="时间排序" style="width:10%">
              <el-option v-for="(item,index) in  sjpxOptions" :key="index" :label="item" :value="index"></el-option>
            </el-select>
            <el-input v-model="jxrw.rwbt" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </div>
          &lt;!&ndash;列表&ndash;&gt;
          <el-row :gutter="12" style="margin-bottom:6px;cursor:pointer;" v-for="(item,index) in list" :key="index">
            <el-col :span="23">
              <el-card shadow="hover" class="list-views">
                <div style="height: 52px;font-size: 12px;">
                  <p>任务标题：{{item.rwbt}}</p>
                  <p>截止时间：{{item.jsrq}}</p>
                  <p>紧急程度：
                    <el-button class="rwwczt" :type="typeCd[item.jjcd].label" size="mini" round>{{typeCd[item.jjcd].value}}</el-button>
                  </p>
                </div>
                <p></p>
              </el-card>
              <span :class="rwztStyle[item.rwzt].label">{{rwztStyle[item.rwzt].name}}</span>
            </el-col>
          </el-row>
          &lt;!&ndash;工具条&ndash;&gt;
          <el-col :span="24">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="jxrw.query.page" :page-sizes="[4,8,12,16,20]"
                           :page-size="jxrw.query.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </el-col>-->
        </el-tab-pane>
      </el-tabs>
      <!--新增界面-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="parentVisible" width="35%" @close="colseDialog">
        <el-dialog
          width="27%"
          title="选择成员"
          :visible.sync="innerVisible"
          append-to-body>
          <div>
          <!--  <el-row>
              <el-button >取消</el-button>
              <el-button type="primary">确认</el-button>
            </el-row>-->
            <el-select
              style="width: 100%;margin-bottom: 5px;"
              size="medium"
              v-model="dynamicTags"
              filterable
              placeholder="搜索" multiple
              clearable @change="handleChangeSel">
              <el-option
                v-for="item in teacherList"
                :key="item.userid"
                :label="item.username"
                :value="item.userid">
              </el-option>
              <!--  <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
            </el-select>
         <!--<page-ryss ref="pageRyss"></page-ryss>-->

          </div>

        </el-dialog>
       <el-form :model="temp" :rules="rules" ref="dataForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="任务名称" prop="rwbt">
            <el-input v-model="temp.rwbt"></el-input>
          </el-form-item>
          <el-form-item label="责任人" prop="rwmxList">
            <el-tag
              size="small"
              v-model="temp.rwmxList"
              :key="tag.userid"
              v-for="tag in zrrArry"
              closable
              :disable-transitions="false"
              @close="handleClose(tag,0)">
              {{tag.username}}
            </el-tag>
            <el-button icon="el-icon-plus" @click="showInput(0)" size="mini"></el-button>
          </el-form-item>
         <el-form-item label="关注人" prop="gzr">
           <el-tag
             size="small"
             v-model="temp.gzr"
             :key="tag.userid"
             v-for="tag in gzrArry"
             closable
             :disable-transitions="false"
             @close="handleClose(tag,1)">
             {{tag.username}}
           </el-tag>
           <el-button icon="el-icon-plus" @click="showInput(1)" size="mini"></el-button>
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
          </el-form-item>
          <el-form-item label="紧急程度" prop="type">
            <el-select v-model="temp.jjcd" style="width: 100%;" :disabled="rwDisabled" placeholder="请选择紧急程度">
              <el-option v-for="(item,index) in  jjcdOptions" :key="(index+1)" :label="item.name"
                         :value="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务分类" prop="rwlx">
            <el-select v-model="temp.rwlx" style="width: 100%;" :disabled="rwDisabled" placeholder="请选择任务类型">
              <el-option v-for="(item,index) in  typeOptions" :key="(index+1)" :label="item.name"
                         :value="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/api/course/kcxx/sctpS"
              :headers="headers"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="form.fjxxList">
              <el-button size="small" icon="el-icon-upload" circle></el-button>
              <span style="margin-left:415px;">(0/3)</span>
             <!-- <el-button size="small" icon="el-icon-upload" plain>添加文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
          <el-form-item label="任务内容" prop="rwnr">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows:8}"
              placeholder="请输入内容"
              v-model="temp.rwnr">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseDialog">取消</el-button>
          <!--保存-->
          <el-button type="primary" @click="saveData">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog
        width="35%"
        title="任务信息"
        :visible.sync="infoVisible"
        append-to-body>
        <div>
          <el-form :model="temp" :rules="rules" ref="dataForm" label-width="80px" class="demo-ruleForm">
           <!-- <el-form-item label="任务名称" prop="rwbt">
             {{temp.rwbt}}
            </el-form-item>-->
            <el-form-item label="任务日期" required>
              <el-col :span="24">
                <el-form-item prop="tempTime">
                 {{temp.ksrq}} 至 {{temp.jsrq}}
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="任务内容" prop="rwnr">
              {{temp.rwnr}}
            </el-form-item>
            <el-form-item label="紧急程度" prop="type">
              {{temp.jjcd}}
            </el-form-item>
            <el-form-item label="任务分类" prop="rwlx">
              {{typeOptions[temp.rwlx].name}}
            </el-form-item>
            <el-form-item label="附件">
              <p v-for="item of temp.fjxxList" :key="item.fjid">
                <el-button type="text" @click="openUrl(item.sclj)">{{item.fjymc}}</el-button>
                <br>
              </p>
            </el-form-item>
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item title="任务明细" name="1">
                <div class="block" style="margin-left: 3px;">
                  <el-timeline>
                    <el-timeline-item
                      v-for="(activity, index) in temp.rwmxList"
                      :key="index"
                      :color="activity.wczt=='1'?'':'#0bbd87'"
                      :timestamp="activity.wczt=='1'?'':activity.cjsj">
                      {{activity.zrr}}{{activity.wczt=='1'?'未完成':'已完成'}}
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button v-if="checkNotRwmx>0||temp.cjr==userid" @click="updateSate(temp.jlid,temp.cjr)" type="success" icon="el-icon-check" plain>标记完成</el-button>
            <!--保存-->
            <el-button v-if="temp.cjr==userid" @click="deleteData(temp.jlid)" type="danger" icon="el-icon-delete" plain>删除</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

  </section>
</template>
<script>
  import Cookies from 'js-cookie';
  import * as api from '@/api/oasysys/rwfb/index';
  import { formatDate } from '@/utils'
  import pageRyss from '@/components/SsRymb/index';
  import jcsj from '../../../api/jcsj';
  export default {
    components: { pageRyss },
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
      return {
        checkNotRwmx: 0,
        activeName: '1',
        xxdm: '',
        userid: '',
        copyDisabled: false,
        copyLoading: false,
        rwDisabled: false,
        list: [],
        loading: true,
        parentVisible: false, // 定义新增弹框默认关闭
        innerVisible: false,
        dialogStatus: '',
        rwzt: '',
        jxrw: {
          /** 保存的form表单数据**/
          rwbt: '',
          rwzt: '',
          xxdm: this.xxdm,
          query: { page: 1, limit: 5 }
        },
        form: {},
        rwztOptions: ['我发出的', '我关注的', '我负责的'],
        wcztOptions: [
          {
            value: '1',
            label: '已完成'
          }, {
            value: '2',
            label: '未完成',
            children: [{
              value: '3',
              label: '已过期'
            }, {
              value: '4',
              label: '进行中'
            }, {
              value: '5',
              label: '未开始'
            }]
          }
        ],
        rwztStyle: [
          { label: 'list-ywc', name: '已完成' },
          { label: 'list-wwc', name: '未完成' },
          { label: 'list-ygq', name: '已过期' },
          { label: 'list-jxz', name: '进行中' },
          { label: 'list-wks', name: '未开始' }
        ],
        sjpxOptions: ['截止时间升序', '截止时间降序', '开始时间升序', '开始时间降序'],
        jjcdOptions: [{ label: '0', name: '一般任务' }, { label: '1', name: '紧急任务' }, { label: '2', name: '了解任务' }],
        typeOptions: [{ label: '0', name: '语文作业' }, { label: '1', name: '作文' }, { label: '2', name: '书法类' }],
        typeCd: [
          { label: 'warning', value: '一般任务' },
          { label: 'danger', value: '紧急任务' },
          { label: 'info', value: '了解任务' }
        ],
        tabPosition: 'top',
        xnList: [],
        temp: {
          /** 保存的form表单数据**/
          jlid: undefined,
          cjr: this.userid, // 创建人
          cjsj: new Date(), // 创建时间
          fjxxList: [], // 附件信息
          rwmxList: [], // 任务明细
          gzr: '', // 关注人
          jsrq: null, // 结束日期 ,
          ksrq: null, // 开始日期 ,
          rwbt: '', // 任务标题 ,
          rwlx: '1', // 任务类型 ,
          rwnr: '', // 任务内容 ,
          rwzt: '0', // 任务状态 未完成 1 已完成 2 ,
          xxdm: this.xxdm, // 学校代码
          jjcd: '1'
        },
        textMap: {
          update: '修改任务',
          create: '创建任务',
          copy: '任务信息'
        },
        tableData: [],
        total: 0,
        tempName: '',
        dynamicTags: [],
        inputVisible: false,
        infoVisible: false,
        rules: {
          /** 表单验证规则**/
          rwbt: [
            { required: true, message: '请输入任务名称', trigger: 'change' },
            { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'change' }],
          rwlx: [{ required: true, message: '任务类型不能为空' }],
          tempTime: [{ required: true, message: '请选择日期', trigger: 'change' },
            { validator: validaDate, trigger: 'change' }],
          rwnr: [{ required: true, message: '任务内容不能为空', trigger: 'change' }],
          rwmxList: [{ required: true, message: '责任人不能为空', trigger: 'change' }],
          gzr: [{ required: true, message: '关注人不能为空', trigger: 'change' }]
        },
        teacherList: [],
        flag: '',
        zrrArry: [],
        gzrArry: []
      }
    },
    computed: {
      headers() {
        return { Authorization: Cookies.get('Admin-Token'), ReturnResultCode: true }
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
      this.userid = window.localStorage.getItem('userid');
      this.xxdm = window.localStorage.getItem('xxdm');
      this.getList();// 搜索条件
      this.getBmryList();
    },
    methods: {
      getList() {
        /** 教学任务列表**/
        this.loading = true;
        this.jxrw.xxdm = this.xxdm;
        this.jxrw.rwzt = this.rwzt.length > 1 ? this.rwzt[1] : this.rwzt[0];
        api.queryPageList(this.jxrw).then(res => {
          this.total = res.data.total;
          this.list = res.data.rows;
          this.loading = false;
        });
      },
      getBmryList() {
        const params = { page: 1, limit: 2000, type: 3, xxdm: this.xxdm }
        api.Getallteacher(params).then(json => {
          this.teacherList = json.data.rows.map(item => ({
            userid: item.id,
            username: item.name
          }))
        })
      },
      resetTemp() {
        this.temp = {
          jlid: undefined,
          cjsj: new Date(), // 创建时间
          fjxxList: [], // 任务附件信息 ,
          rwmxList: [], // 任务明细
          gzr: '', // 关注人
          jsrq: null, // 结束日期 ,
          ksrq: null, // 开始日期 ,
          rwbt: null, // 任务标题 ,
          rwlx: '1', // 任务类型 ,
          rwnr: '', // 任务内容 ,
          rwzt: '0', // 任务状态 未完成 1 已完成 2 ,
          xxdm: this.xxdm, // 学校代码
          jjcd: '1'
        }
      },
      getRwztStyle(v, i) {
        const date1 = new Date(v.ksrq);  // 开始时间
        const date2 = new Date(v.jsrq);    // 结束时间
        const date3 = date2.getTime() - date1.getTime(); // 时间差的毫秒数
        const days = Math.floor(date3 / (24 * 3600 * 1000));  // 计算出相差天数
        if (i === 0) {
          return this.rwztStyle[v.rwzt].label;
        } else {
          return this.rwztStyle[v.rwzt].value;
        }
      },
      handleAdd() {
        /** 打开新增弹框**/
        this.dialogStatus = 'create'
        this.resetTemp();
        this.rwDisabled = false;
        this.parentVisible = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      saveData() {
        /** 提交数据**/
        this.getZrrOrGzr();
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.cjsj = +new Date(tempData.cjsj);
            tempData.ksrq = +new Date(tempData.tempTime[0]);
            tempData.jsrq = +new Date(tempData.tempTime[1]);
            api.save(tempData).then(() => {
              this.parentVisible = false;
              this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
              this.getList();
            })
          }
        })
      },
      getZrrOrGzr() {
        const $this = this;
        $this.temp.rwmxList = [];
        this.zrrArry.forEach(e => {
          $this.temp.rwmxList.push({ zrr: e.userid });
        });
        const arry = [];
        this.gzrArry.forEach(e => {
          arry.push(e.userid);
        })
        this.temp.gzr = arry.join(',')
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
              this.getList();
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
            this.getList();
          });
        });
      },
      deleteData(id) {
        /** 删除**/
        this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
          api.getDelete(id).then(() => {
            this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
            this.infoVisible = false;
            this.getList();
          });
        });
      },
      updateSate(rwid, cjr) {
        const v = { rwid, xxdm: this.xxdm, wczt: 2 };
        if (cjr !== this.userid) {
          v.zrr = this.userid;
        }
        api.updateSate(v).then(() => {
          this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
        })
      },
      colseDialog() {
        this.parentVisible = false;
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
        this.jxrw.query.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        /** 跳转到某页**/
        this.jxrw.query.page = val;
        this.getList();
      },
      search() {
        this.jxrw.query.page = 1;
        this.getList();
      },
      beforeAvatarUpload(file) {
        console.log(file);
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 5MB!');
        }
        return isLt5M;
      },
      handleRemove(file, fileList) {
        this.form.fjxxList = _.remove(this.form.fjxxList, n => n.uid = file.uid);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleSuccess(response, file, fileList) {
        if (response.status === 200) {
          const curFile = [];
          fileList.forEach(file => {
            const filename = file.name;
            const fjlx = filename.substring(filename.indexOf('.') + 1, filename.length);
            const curNode = { uid: file.uid, fjymc: file.name, sclj: file.response.data[0].path, fjlx, fjdx: file.size };
            curFile.push(curNode);
          });
          this.temp.fjxxList = curFile;
        }
      }, handleClose(tag, v) {
        if (v === 0) {
          this.zrrArry.splice(this.zrrArry.indexOf(tag), 1);
        } else {
          this.gzrArry.splice(this.gzrArry.indexOf(tag), 1);
        }
      },
      showInput(v) {
        this.innerVisible = true;
        this.flag = v; // 责任人或者关注人
        const $this = this;
        $this.dynamicTags = [];
        if (this.flag === 0) {
          this.zrrArry.forEach(e => { $this.dynamicTags.push(e.userid) })
        } else {
          this.gzrArry.forEach(e => { $this.dynamicTags.push(e.userid) })
        }
      },
      handleChangeSel(v) {
        const list = this.teacherList.filter(i => v.length > 0 && v.includes(i.userid));
        if (this.flag === 0) {
          this.zrrArry = list;
        } else {
          this.gzrArry = list;
        }
      },
      handleInputConfirm() {
      /*  const inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';*/
      },
      openInfo(e) {
        this.infoVisible = true;
        this.checkNotRwmx = 0;
        api.getInfo(e.jlid).then(res => {
          if (res.status === 200) {
            this.temp = res.data;
            const $this = this;
            $this.temp.rwmxList.forEach(e => {
              if (e.zrr === this.userid) {
                $this.checkNotRwmx = 1;
              }
            })
          } else {
            this.$message.error('操作失败，请联系管理员！');
          }
        })
      },
      openUrl(v) {
        window.open(v);
      }
    }
  }

</script>

<style scoped>
  .content-container {
    /*padding: 20px;*/
    margin-left: 20px;
  }

  .rwwczt .el-button--mini, .el-button--mini.is-round{
    padding: 4px 12px;
  }
  .content-container .item {
    margin-top: 5px;
  }
  .list-views {
   /* padding-left: 2px;*/
    /* color: #563d7c; */
    text-decoration: none;
    background-color: transparent;
    border-left: 1px solid #563d7c;
  }
  .list-ywc {
    background: #67c23a;
    font: 14px/25px "microsoft yahei";
    color: #fff;
    position: absolute;
    right: 68px;
    top: 0;
    padding: 2px 10px;
  }
  .list-wks {
    background: #c8c9cc;
    font: 14px/25px "microsoft yahei";
    color: #fff;
    position: absolute;
    right: 68px;
    top: 0;
    padding: 2px 10px;
  }
  .list-ygq {
    background: #F56C6C;
    font: 14px/25px "microsoft yahei";
    color: #fff;
    position: absolute;
    right: 68px;
    top: 0;
    padding: 2px 10px;
  }
  .list-jxz {
    background: #E6A23C;
    font: 14px/25px "microsoft yahei";
    color: #fff;
    position: absolute;
    right: 68px;
    top: 0;
    padding: 2px 10px;
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
</style>


