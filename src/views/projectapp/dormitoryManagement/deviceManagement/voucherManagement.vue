<template>
  <div class="app-container management">

    <div class="u_TableMain">
    <!-- <div class="managementTitle">凭证管理</div> -->
      <div class="m_GenTableBox">
        
        <el-row class="managementbody">
          <el-col :span="4" class="selectdepartment">
              <el-radio-group v-model="groupCheckType" class="radiogroup" @change="changeGroup">
                <el-radio-button label="student">学生</el-radio-button>
                <el-radio-button label="teacher">教师</el-radio-button>
              </el-radio-group>

              <div class="header">{{groupCheckType=='teacher'?'选择部门':'选择班级'}}</div>
              <el-tree v-loading="groupListLoading" :data="groupList" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
              <!-- <ul class="departments">
                <li class="department" v-for="(item,index) of groupList" :key="index">{{item.name}}</li>
              </ul> -->
          </el-col>
          <el-col :span="20" class="voucherlist">
            <div class="searchbox">
              <el-input placeholder="请输入内容" v-model="input1" class="elinput" clearable></el-input>
              <el-button type="primary" @click="getList(pageSize,currentPage)">搜索</el-button>
              <el-button type="primary" @click="showimport('password')">导入密码</el-button>
              <el-button type="primary" @click="showimport('card')">导入卡号</el-button>
              <el-button type="primary" @click="showimport('fingerprint')">导入指纹</el-button>        
            </div>

            <el-table
              :data="tableData"
              style="width: 100%"
              v-show="groupCheckType == 'student'"
              v-loading="tableDataLoading">
              <el-table-column
                prop="xm"
                label="人员姓名"
                >
              </el-table-column>
              <el-table-column
                prop="xh"
                label="学号"
                >
              </el-table-column>
              <el-table-column
                prop="bjmc"
                label="班级名称"
                >
              </el-table-column>    
              <el-table-column
                label="凭证信息"
              >
                <template slot-scope="scope">
                  <span>{{(scope.row.pswd?'密码':'')+(scope.row.card?(scope.row.pswd?'/卡号':'卡号'):'')+(scope.row.fgpt?(scope.row.pswd||scope.row.card?'/指纹':'指纹'):'')}}</span>
                </template>
              </el-table-column>      
              <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                  <el-button type="primary" plain size="small" @click="setPassword(scope.row.xh)">密码设置</el-button>
                  <el-button type="primary" plain size="small" @click="setCardNum(scope.row.xh,scope.row)">卡号绑定</el-button>
                  <el-button type="primary" plain size="small" @click="setFingerprint(scope.row.xh)">指纹采集</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="tableData"
              style="width: 100%"
              v-show="groupCheckType == 'teacher'"
              v-loading="tableDataLoading">
              <el-table-column
                prop="xm"
                label="人员姓名"
                >
              </el-table-column>
              <el-table-column
                prop="xbm"
                label="性别"
                >
                <template slot-scope="scope">
                  <span>{{scope.row.xbm=='1'?'男':'女'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="groupNames"
                label="所在部门"
                >
              </el-table-column>
              <el-table-column
                label="凭证信息"
              >
                <template slot-scope="scope">
                  <span>{{(scope.row.pswd?'密码':'')+(scope.row.card?(scope.row.pswd?'/卡号':'卡号'):'')+(scope.row.fgpt?(scope.row.pswd||scope.row.card?'/指纹':'指纹'):'')}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                  <el-button type="primary" plain size="small" @click="setPassword(scope.row.gh)">密码设置</el-button>
                  <el-button type="primary" plain size="small" @click="setCardNum(scope.row.gh,scope.row)">卡号绑定</el-button>
                  <el-button type="primary" plain size="small" @click="setFingerprint(scope.row.gh)">指纹采集</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 30px">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
              </el-pagination>
            </div>
          </el-col> 
        </el-row>
      </div>
    </div>

    <!-- 卡号绑定对话框 -->
    <el-dialog title="卡号绑定" :visible.sync="numberBoundVisible" width="500px" top="32vh">
      <el-form :model="numberBoundform" :rules="rules" ref="numberBoundform">
        <el-form-item label="卡号" :label-width="formLabelWidth" prop="card">
          <el-input v-model="numberBoundform.card" clearable placeholder="请输入10-20位卡号" class="inputcard" maxlength=20></el-input>
        </el-form-item>
        <el-form-item label="有效期" :label-width="formLabelWidth" prop="time">
          <el-date-picker
            v-model="numberBoundform.time"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="numberBoundVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSetCardNum()">添加</el-button>
      </div>
    </el-dialog>
    <!-- /卡号绑定对话框 -->
    <!-- 密码设置对话框 -->
    <el-dialog title="密码设置" :visible.sync="setPasswordVisible" width="500px" top="32vh" center>
      <el-form :model="setPasswordform" :rules="rules" ref="setPasswordform">
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input placeholder="请输入4-16位数字" v-model="setPasswordform.password" show-password class="inputcard" minlength="4" maxlength="16"></el-input>
          <el-button type="success" size="small" @click="randomPSWD()">生成随机密码</el-button>
        </el-form-item>
        <!-- <el-form-item label="有效次数" :label-width="formLabelWidth">
          <el-radio v-model="setPasswordform.count" label="1">一次</el-radio>
          <el-radio v-model="setPasswordform.count" label="2">无限制</el-radio>
        </el-form-item>         -->
        <el-form-item label="有效期" :label-width="formLabelWidth" prop="time">
          <el-date-picker
            v-model="setPasswordform.time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setPasswordVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSetPassword()">添加</el-button>
      </div>
    </el-dialog>
    <!-- /密码设置对话框 -->
    <!-- 指纹采集对话框 -->
    <el-dialog title="指纹采集" :visible.sync="fingerprintVisible" width="700px" top="24vh" center>
      <ul class="timeline">
        <li class="step" :class="step>=1?'onstep':''">
          <div class="img">
            <img src="../../../../../static/img/open.png" alt="">
          </div>  
          <span>打开</span>         
        </li>
        <li class="step" :class="step>=2?'onstep':''">
          <div class="img">
            <img src="../../../../../static/img/fingerprint.png" alt="">
          </div>  
          <span>采集指纹</span>    
        </li>
        <li class="step" :class="step==3?'onstep':''">
          <div class="img">
            <img src="../../../../../static/img/ok.png" alt="">
          </div>  
          <span>完成</span>    
        </li>
      </ul>
      <div class="open" v-if="step==1">
        <div class="tip">请打开指纹采集设备</div>
        <img v-if="failedCount<maxLinkTime" src="../../../../../static/img/openswitch.gif" alt="">
        <el-button v-else type="danger" class="elswitch" @click="setFingerprint()">重试</el-button>
      </div>
      <div class="get" v-else-if="step==2">
        <div class="tip">采集指纹</div>
        <img v-if="failedCount < maxLinkTime" src="../../../../../static/img/fingerprint4.gif" alt="">
        <el-button v-else type="danger" class="retrybutton" @click="setFingerprint()">重试</el-button>
        <!-- <div v-else>
          <img src="../../../../../static/img/fingerprint4.gif" alt="">          
        </div>         -->
        <div class="block">
          <span class="demonstration">有效期</span>
          <el-date-picker
            v-model="fingerprintform.time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button type="primary" class="elbutton" :disabled="fingerprintform.time==[]||fingerprintform.fingerprint==''||step==2" :loading="saveOK" @click="savefingerprint()">保存</el-button>
        </div>
      </div>  
      <div class="finish" v-else-if="step==3">
        <div class="tip">完成</div>
        <img v-if="failedCount < maxLinkTime" src="../../../../../static/img/finish.gif" alt="">
        <div class="block">
          <span class="demonstration">有效期</span>
          <el-date-picker
            v-model="fingerprintform.time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button type="primary" class="elbutton" :disabled="fingerprintform.time==[]||fingerprintform.fingerprint==''" :loading="saveOK" @click="savefingerprint()">保存</el-button>
        </div>
      </div>
    </el-dialog>    
    <!-- /指纹采集对话框 -->

    <el-dialog 
      title="导入数据" 
      :visible.sync="importMenVisible" 
      width="540px" 
      class="import_box" 
      v-loading="importSubmitLoading" 
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center>
      <el-row>
        <el-col :span="6" style="line-height:32px;margin-bottom:50px;">文件选择：</el-col>
        <el-col :span="18">
          <el-upload
            :limit="1"
            name="file"
            ref="studentupload"
            accept=".xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :headers="headers"
            :data="{userType:groupCheckType == 'student'?'4':'3',tokenType:tokenType}"
            action="/api/lock/token/uploadUserTokens"
            :file-list="fileList"
            :onError="uploadError"
            :onSuccess="uploadSuccess"
            :before-upload="beforeUpload"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        导入失败数据详情：
        <el-table
          :data="errData"
          style="width: 100%;max-height: 200px;
                            overflow-y: scroll;"
        >
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column v-if="groupCheckType=='teacher'" prop="depat" label="机构"></el-table-column>
          <el-table-column v-else prop="className" label="班级"></el-table-column>
          <el-table-column prop="userId" label="id"></el-table-column>
          <el-table-column prop="message" label="错误信息"></el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          @click="importSubmit('studentupload')"
        >导入</el-button>
        <el-button size="medium" @click="importMenVisible = false">取 消</el-button>
        <el-button size="medium" @click="downLoadMb()">
          模版生成
          <i class="el-icon-download"></i>
        </el-button>

        <el-row class="import_desc">
          <el-col :span="6" style="line-height:80px">操作说明：</el-col>
          <el-col :span="18">
            <p>1.请使用本页面提供的模版进行导入</p>
            <p>2.请勿修改模版Excel的表头内容</p>
            <p>3.模版提供的默认信息，请勿随意修改</p>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { 
  tokenGetList,
  setCard,
  setFingerprint,
  setPassword,
  openusb,
  getfingerprint,
  closeusb,
  downLoadTemplate,
  uploadUserTokens,
  getJzgjbsj,
  getXsjbsj,
  getlistTokens } from '@/api/projectapp/dormitoryManagement/deviceManagement';
import * as api from '@/api/projectapp/dormitoryManagement/';
import {getBjTree} from '@/api/admin/student/';
import {getBMTree} from '@/api/admin/teach/index';
import Cookies from 'js-cookie';
import _ from 'lodash';
export default {
  name: 'voucherManagement',
  data() {
    //校验规则
    // const checkCardnumbers = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('请输入有效卡号'));
    //   }
    //   setTimeout(() => {
    //     if(value.length === 20){
    //       if (!/^[0-9a]*$/.test(value)) {
    //       // if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)) {
    //         callback(new Error('请输入有效卡号'));
    //       }else{
    //         callback();
    //       }
    //     }else if (value.length === 10){
    //       if (!/^[0-9a]*$/.test(value)) {
    //         callback(new Error('请输入有效卡号'));
    //       }else{
    //         callback();
    //       }
    //     }else{
    //       callback(new Error('请输入有效卡号'));
    //     }
    //   }, 0);
    // };
    return {
        input1:'',//搜索框输入内容
        formLabelWidth: '68px',//表格标签宽度
        setPasswordVisible: false,//密码弹层
        numberBoundVisible: false,//
        fingerprintVisible: false,
        importMenVisible: false,
        tableData:[],
        tableData_res: [],
        numberBoundform:{
          id: '',
          time: '',
		  card: '',
        },
        setPasswordform:{
          password: '',
          count: '',
          time: ''
        },
        fingerprintform:{
          userId: '',
          userType: '',
          fingerprint: '',
          time: '',
        },
        step:1,
        pageSize: 10,
        currentPage: 1,
        totalCount: 0,
        rules:{
          card: [
            { required: true,min:10,max:20,message:'请输入有效卡号',trigger: 'change'}
          ],
          time: [
            { required: true, message: '请选择日期', trigger: 'change' },
          ],
          password: [
            { required: true, message: '请设置正确随机密码', trigger: 'blur' },
            {
              min: 4,
              max: 16,
              message: '长度在 4 到 16 个数字',
              trigger: 'change'
            }
          ]
        },
        failedCount: 0,//连接设备失败次数
        maxLinkTime: 1,//设备连接最大次数
        openUSBInterval:{},//设备录入定时器
        errData: [],//录入信息失败列表
        fileList: [], // 文件列表
        tokenType: '',//密码、卡号、指纹
        uploadData: {},//要和导入信息一起上传的数据
        groupList: [],//左边部门列表
        groupId: '',//部门id
        njid: '',//年级id
        bjid: '',//班级id
        groupTeacher: [],//老师列表，
        groupStudent: [],//学生列表
        xxdm:localStorage.getItem("xxdm"),//xxdm
        defaultProps: {//树形列表默认信息
          children: 'children',
          label: 'name'
        },
        groupCheckType:"student",  //选择类型（老师、学生）
        dqxn:"",  //当前学年
        saveOK: false,//防止连点
        importSubmitLoading: false,//导入数据等待状态
        groupListLoading: false,//部门、班级数据加载等待状态
        tableDataLoading: false,//数据加载等待状态
        hasPzList: [],//有凭证的列表
    }
  },
  methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.getList(val,this.currentPage);
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.getList(this.pageSize,val);
        this.currentPage = val;
      },
      init(){
        this.changeGroup(this.groupCheckType);
        // this.getList()
        // this.openUSB();
      },
      getList(limit = 10,page = this.currentPage){
        this.tableDataLoading = true;
        if(this.groupCheckType == 'teacher'){
          getJzgjbsj({
            xxdm:this.xxdm,
            page,
            limit,
            groupId:this.groupId,
            xm: this.input1
          }).then((res)=>{
            this.tableData = this.formatPersonList(res.data.rows);
            this.tableData_res = this.tableData;
            this.totalCount = res.data.total;
            this.tableDataLoading = false;
          })
        } else {
          getXsjbsj({
            xxdm:this.xxdm,
            page,
            limit,    
            njid: this.njid,
            bjid: this.bjid,
            xm: this.input1        
          }).then((res)=>{
            this.tableData = this.formatPersonList(res.data.rows);
            this.tableData_res = this.tableData;
            this.totalCount = res.data.total;          
            this.tableDataLoading = false; 
          })
        }
        // tokenGetList({
        //   limit,
        //   // mobile: "string",
        //   page,
        //   sex: 0,
        //   // userName: "string"
        // }).then((res)=>{
        //   if (res.resultCode === 1) {
        //     this.tableData = res.dataList;
        //     this.totalCount = res.totalCount;
        //   } else {
        //     this.$message({
        //       type: 'error',
        //       message: res.resultMessage
        //     });
        //   } 
        // })
      },
      getTokensDetail(){
        getlistTokens({userType:this.groupCheckType == 'teacher'?3:4}).then(res => {
          this.hasPzList = res.value;
        })
      },
      setPassword(userId){//点击设置密码按钮
        // this.setPasswordform = {
        //   password: '',
        //   count: '',
        //   time: ''
        // }
        this.setPasswordVisible = true;
        if(this.$refs['setPasswordform']){
          this.$refs['setPasswordform'].resetFields();       
        }         
        this.setPasswordform.userId = userId;
      },
      setCardNum(userId,row){//点击设置卡号按钮
        // this.numberBoundform = {
        //   id: '',
        //   time: '',
        // }
        this.numberBoundVisible = true;
        if(this.$refs['numberBoundform']){
          this.$refs['numberBoundform'].resetFields();       
        }
				this.numberBoundform.card = ""
				this.numberBoundform.time = []
				if(row.cardNumber){
					this.numberBoundform.card = row.cardNumber;
					this.numberBoundform.time = [row.beginTime,row.endTime]
				}	
        this.numberBoundform.userId = userId;
      },
      setFingerprint(userId){//点击设置指纹按钮
        console.log(userId,304)
        this.step = 1;
        this.failedCount = 0;
        this.fingerprintVisible = true;
        this.fingerprintform.userId = userId?userId:this.fingerprintform.userId;
        this.fingerprintform.fingerprint = '';
        this.fingerprintform.time = '';
        clearInterval(this.openUSBInterval);
        this.openUSBInterval = setInterval(this.openUSB,3000);
      },
      showimport(tokenType){//显示导入弹层
        this.tokenType = tokenType;
        this.errData = [];
        this.importMenVisible = true;
      },
      confirmSetPassword(){//确认设置密码
        this.$refs['setPasswordform'].validate((valid) => {
          if (valid) {
            setPassword({
              userId:this.setPasswordform.userId,
              userType: this.groupCheckType == 'student'?4:3,//用户类型（3:教师,4:学生）
              password: this.setPasswordform.password,
              beginTime: this.setPasswordform.time[0],
              endTime: this.setPasswordform.time[1]
            }).then((res)=>{
              if (res.resultCode === 1) {
                this.$message({
                  type: 'success',
                  message: res.resultMessage
                });
                this.setPasswordVisible = false;
                this.getTokensDetail();
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: res.resultMessage
                });
              } 
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      confirmSetCardNum(){//确认设置卡号
        this.$refs['numberBoundform'].validate((valid) => {
          if (valid) {
            setCard({
              userId:this.numberBoundform.userId,
              userType: this.groupCheckType == 'student'?4:3,//用户类型（3:教师,4:学生）
              card: this.numberBoundform.card,
              beginTime: this.numberBoundform.time[0],
              endTime: this.numberBoundform.time[1]
            }).then((res)=>{
              if (res.resultCode === 1) {
                this.$message({
                  type: 'success',
                  message: res.resultMessage
                });
                this.numberBoundVisible = false;
                this.getTokensDetail();
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: res.resultMessage
                });
              } 
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      randomPSWD(){//随机生成六位密码
        var pwd = Math.ceil(Math.random() * 9999990 + 9999);
        this.setPasswordform.password = String(pwd)
      },
      openUSB(){//检测是否打开usb采集设备
        openusb().then((res)=>{
          if(res.code==200){
            this.$message({
              type: 'success',
              message: res.data
            });
            this.step += 1;
            this.failedCount = 0;
            clearInterval(this.openUSBInterval)
            if(this.fingerprintVisible){//如果弹框被关掉了就不需要重启了
              this.openUSBInterval = setInterval(this.getFingerprint,5000);
            }
          } else {
            this.$message({
              type: 'error',
              message: '指纹采集设备连接失败，请重试'
            });
            this.failedCount ++;
            if(this.failedCount>=this.maxLinkTime||!this.fingerprintVisible){
              clearInterval(this.openUSBInterval)
            }
          }
        }).catch(err=>{
          this.$message({
            type: 'error',
            message: '指纹采集设备连接失败，请检查网络后重试'
          });
          this.failedCount ++;
          // if(this.failedCount>=this.maxLinkTime||!this.fingerprintVisible){
            clearInterval(this.openUSBInterval)
          // }          
        })
      },
      closeUSB(){//检测是否关闭usb采集设备
        console.log(this.openUSBInterval,590)
        clearInterval(this.openUSBInterval)//关闭设备，清除定时器
        closeusb().then((res)=>{
          if(res.code==200){
            this.$message({
              type: 'success',
              message: res.data
            });
            this.failedCount = 0;
          } else {
            // this.failedCount ++;
            // if(this.failedCount>=this.maxLinkTime){
            //   this.$message({
            //     type: 'error',
            //     message: res.data
            //   });
              
            // }
          }
        })
      },
      getFingerprint(){//采集指纹
        getfingerprint().then((res)=>{
          if(res.code==200){
            this.$message({
              type: 'success',
              message: '指纹采集成功！'
            });
            this.failedCount = 0;
            this.fingerprintform.fingerprint = res.data;
            clearInterval(this.openUSBInterval)
            this.openUSBInterval = setInterval(this.closeUSB,5000);
            this.step++;
          } else {
            this.$message({
              type: 'error',
              message: '采集指纹失败，请重试'
            });
            this.failedCount ++;
            if(this.failedCount>=this.maxLinkTime){
              clearInterval(this.openUSBInterval)
            }
          }
        })
      },
      savefingerprint(){//确认保存指纹
        this.saveOK = true;
        setFingerprint({
          userId: this.fingerprintform.userId,
          userType: this.groupCheckType == 'student'?4:3,//用户类型（3:教师,4:学生）
          fingerprint: this.fingerprintform.fingerprint,
          beginTime: this.fingerprintform.time[0],
          endTime: this.fingerprintform.time[1]
        }).then((res)=>{
          if (res.resultCode === 1) {
            this.$message({
              type: 'success',
              message: res.resultMessage
            });
            this.step = 0;
            this.fingerprintVisible = false;
            this.getTokensDetail();
            this.getList();
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }
          this.saveOK = false;
        })
      },
      uploadError() {},//导入数据上传错误
      beforeUpload() {},//在导入之前
      uploadSuccess(response, file, fileList) {//导入成功
        if (response.resultCode == 1) {
          // console.log(response.value.errList,556)
          if (response.value.errList == null) {
            this.$message({
              type: 'success',
              message: '导入成功！'
            });
            this.importMenVisible = false;
            this.fileList = [];
          } else {
            this.$message({
              type: 'error',
              message: '部分数据导入失败'
            });
            this.errData = response.value.errList;
            this.fileList = [];
          }
        } else {
          this.$message({
            type: 'error',
            message: response.resultMessage
          });
          this.fileList = [];
        }
        this.importSubmitLoading = false;
      },
      changeGroup(label){//切换角色 教师/学生
        this.currentPage = 1;
        this.pageSize = 10;
        this.groupList = [];
        this.tableData = [];
        this.input1 = '';
        this.njid = '';
        this.bjid = '';
        this.getTokensDetail();
          if(label=='student'){
              this.getGroupStudent();
          }else if(label=='teacher'){
              this.getGroupTeacher();
          }
          // this.getList(this.pageSize,this.currentPage)
      },
      async downLoadMb() {//下载模板
        var type = this.tokenType == 'password'?'导入密码':this.tokenType == 'card'?'导入卡号':'导入指纹'
        var res = await downLoadTemplate({userType: this.groupCheckType=='student'?4:3});
        console.log(res,566);
        const blob = new Blob([res], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          const downloadElement = document.createElement('a');
          const href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = type+'模版.xls'; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象 
      },
      importSubmit(fileName) {//确认导入文件
        this.importSubmitLoading = true;
        if (this.$refs[fileName].uploadFiles.length < 1) {
          this.$message({
            type: 'error',
            message: '请选择导入文件！'
          });
          this.importSubmitLoading = false;
          return;
        }
        // console.log(this.$refs[fileName],612)
        this.$refs[fileName].submit();
        // uploadUserTokens({
        //   userType: this.groupCheckType == 'student'?4:3,
        //   tokenType: this.tokenType
        // },this.fileList).then((res)=>{
        //   console.log(res)
        // });
      },
      async handleNodeClick(nodeData) {//点击切换部门或班级
        console.log(nodeData,603)
        this.tableData = [];
        this.input1 = '';
        
        if(this.groupCheckType=='student'){
            this.njid = nodeData.njid;
            // console.log(nodeData)
            this.bjid = nodeData.bjdm;
            this.getList(this.pageSize,this.currentPage);
            // this.tableData = this.formatPersonList(res.value);
            // this.tableData_res = this.tableData;
            // this.rejectList(this.personList);
            // console.log(this.personList,700);
        }else{
          this.groupId = nodeData.id;
            // console.log(this.groupId,659)
            this.getList(this.pageSize,this.currentPage)
            // console.log(this.tableData,628)
            // console.log(this.personList,718);
        }
        // this.personList_res = $.extend(true,[],this.tableData);
        // console.log(this.personList,718);
      },
      /**
       * 获取学生的分类,如果分类存在就不去访问接口
       * 作者:RayJ
       * 时间:2019-04-25
       */
      async getGroupStudent(){
          this.groupListLoading = true;
          if(this.groupStudent.length>0){
              this.groupList = this.groupStudent;
              this.groupListLoading = false;
          }else{
            console.log(this.xxdm,652)
              var res = await getBjTree(this.xxdm);
              this.groupStudent = res;
              this.groupList = res;
              this.groupListLoading = false;
          }
          this.getList(this.pageSize,this.currentPage)
      },
      /**
       * 获取教师的分类,如果分类存在就不去访问接口
       * 作者:RayJ
       * 时间:2019-04-25
       */
      async getGroupTeacher(){
          this.groupListLoading = true;
          if(this.groupTeacher.length>0){
              this.groupList = this.groupTeacher;
              this.groupListLoading = false;
          }else{
              var res = await getBMTree({xxdm:this.xxdm});
              this.groupTeacher = res;
              this.groupList = res;
              this.groupListLoading = false;             
          }
          this.getList(this.pageSize,this.currentPage); 
      },
      /**
       * 点击切换学生或是教师的标签卡
       * 作者:RayJ
       * 时间:2019-04-29
       */
      formatPersonList(list){
          // list.map(e => {
          //   this.$set(e,'card',false);
          //   this.$set(e,'pswd',false);
          //   this.$set(e,'fgpt',false);
          // })

          list.forEach(e=>{
            console.log(e,492)
            //卡号
            var val = this.hasPzList.find(v=>(v.userId==e.xh||v.userId==e.gh)&&v.tokenType==1);
            if(val){
              this.$set(e,'card',true);
              this.$set(e,'cardNumber',val.token);
              this.$set(e,'beginTime',val.beginTime);
              this.$set(e,'endTime',val.endTime);
            }
            //指纹
            val = this.hasPzList.find(v=>(v.userId==e.xh||v.userId==e.gh)&&v.tokenType==2);
            if(val){
              this.$set(e,'fgpt',true);
            }
            //密码
            val = this.hasPzList.find(v=>(v.userId==e.xh||v.userId==e.gh)&&v.tokenType==3);
            if(val){
              this.$set(e,'pswd',true);
            }
          })
          // console.log(list,733)
          // if(this.groupCheckType=='student'){
          //     for(var i=0;i<list.length;i++){
          //         //如果是学校转换xh为userid   usertype固定为4
          //         list[i].userId = list[i].xh;
          //         list[i].userType = 4;
          //     }
          // }else{
          //     for(var i=0;i<list.length;i++){
          //         list[i].xbm = list[i].sex;
          //         list[i].xm = list[i].name;
          //         list[i].bjmc = "";
          //         list[i].userId = list[i].usercode;
          //         list[i].userType = list[i].type;
          //     }
          // }
          return list;
      },
      /**
       * 查找现有列表的人员数据
       * 作者:RayJ
       * 时间:2019-04-25
       */
      releasePersonList(val){
          this.tableData = [];
          console.log("val="+val)
          if(val==""){
              this.tableData = this.tableData_res;
          }else{
              for(var item of this.tableData_res){
                let tempstring = item.name + '';
                let tempstring1 = item.xm + '';
                if(tempstring.indexOf(val)!=-1||tempstring1.indexOf(val)!=-1){
                  this.tableData.push(item);
                }
              }
          }
          //_.find(this.personList,{"xm":})
      },
  },
  mounted() {
    this.init()
        //
  },
  computed: {
    headers() {
      return {
        Authorization: Cookies.get('Admin-Token')
      };
    }
  },
  watch:{
    fingerprintVisible: function(val){//如果指纹采集弹层被关闭，就关闭usb停止计时器
      if(val == false){
        this.closeUSB();
      }
    }
  }
}
</script>
<style scoped>
.management{
    padding-left: 24px;
    padding-top: 32px;
}
.managementTitle{
  font-size: 24px;
  line-height: 24px;
  font-weight: 600;
  padding-bottom: 20px;
}
.radiogroup{
  margin-bottom: 20px;
  display: block;
}
.managementbody{
  position: relative;
}

.selectdepartment .header{
  height: 35px;
  background-color: #eaeaea;
  text-align: center;
  line-height: 35px;
}
.selectdepartment .departments{
  padding-left: 25px;
}
.selectdepartment .departments .department{
  line-height: 24px;
}
.voucherlist{
  padding-left: 40px;
}
.voucherlist .searchbox{
  margin-bottom: 20px;
}
.voucherlist .elinput{
  width: 400px;
}
.voucherlist .elselect{
  width: 150px;
}
.inputcard{
	width: 200px;
	height: 40px;
}
.timeline{
  height: 50px;
}
.step{
  float: left;
  width: 33.3%;
  text-align: center;
  font-size: 16px;
  position: relative;
  color: #a9acb3;
}
.step::after{
  content: "";
  display: block;
  height: 2px;
  width: 100%;
  position: absolute;
  right: 0px;
  top: 10px;
  border-bottom: 2px dashed #bfc2ca;
}
.step:nth-child(1)::after{
  width: 50%;
  right: 0;
}
.step:nth-child(3)::after{
  width: 50%;
  left: 0;
}
.onstep{
  color: #449afc;
}
.onstep::after{
  border-bottom: 2px solid #bfc2ca;
}
.step .img{
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #a9acb3;
  position: relative;
  left: 40%;
  bottom: 8px;
  z-index: 1;
}
.onstep .img{
  background-color: #449afc;
}
.step .img img{
  position: absolute;
  top: 10px;
  left: 11px;
}
.step:nth-child(3) .img img{
  left: 8px;  
  top: 12px;
}
.open,.get,.finish{
  height: 285px;
  text-align: center;  
	font-family: PingFang-SC-Bold;
	font-size: 18px;
	color: #606266;  
}
.open .elswitch,.get .retrybutton{
  position: relative;
  top: 55px;
  margin-bottom: 150px;
}
.get img{
  /* padding-top: 47px; */
  /* margin-bottom: 84px; */
}
.get .okicon{
  position: absolute;
  left: 56%;
  top: 42%;
}
.get .block{
  position: relative;
  /* top: 140px; */
}
.block .demonstration{
	font-family: PingFang-SC-Regular;
	font-size: 14px;
  padding-right: 13px;
	color: #606266;
}
.block .elbutton{
  margin-left: 40px;
}
.finish{
  color: #449afc;
}
.finish .okicon{
	width: 70px;
	height: 70px;
  border-radius: 50%;
	background-color: #449afc;
  position: relative;
  left: 45%;
  top: 37px;
}
.finish .okicon img{
  position: absolute;
  top: 22px;
  right: 17px;
}
.tip{
  margin-top: 47px;
}
.management .import_desc {
  overflow: hidden;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
  text-align: left;
}
</style>

