<template>
  <div class="app-container homeManagementDetail">
    <div class="u_TableMain">
      <div class="m_GenTableBox">
        <div class="homeManagementDetailtoped">
          <p>
            <span class="homename">房间名称： {{homename}}</span>
            <span class="floorname">楼层名称：{{floorname}}</span>
          </p>
          <p>房源名称：{{buildname}}</p>
        </div>
        <div class="homeManagementDetailBoxCards">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="人员列表" name="first">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column align="center" label="序号" width="100">
                  <template slot-scope="scope">{{ scope.$index + 1}}</template>
                </el-table-column>
                <el-table-column prop="name" label="人员姓名"></el-table-column>
                <el-table-column prop="gender" width="50" label="性别"></el-table-column>
                <el-table-column prop width="120" label="联系方式"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" size @click="handleEdit(scope.row, scope.$index )">密码设置</el-button>
                    <el-button size type="danger" @click="carBinding(scope.row, scope.$index)">卡号绑定</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="智能锁" name="second">
              <p class="pisnoinformation" v-if="!locksData.length">暂无记录</p>
              <el-card
                class="homeManagementDetailboxCard"
                :key="item.lockId + index"
                v-for="(item, index) in locksData"
              >
                <div class="homeManagementDetailboxCardDiv">
                  <p class="homeManagementDetailboxCardp">
                    {{item.name }}
                    <span
                      :class="item.onlineStatusDesc=='在线'? 'onlineStatusDesc':'nolineStatusDesc'"
                    >{{item.onlineStatusDesc}}</span>
                  </p>
                  <p class="homeManagementDetailboxCardpcontent">
                    <span class="homeManagementDetailboxCardpcontenttimename">安装时间：</span>
                    <span class="homeManagementDetailboxCardpcontenttime">{{item.createTime}}</span>
                    <span class="homeManagementDetailboxCardpcontentnet">绑定网关：</span>
                    <span class="homeManagementDetailboxCardpcontentnetword">{{item.gatewayName }}</span>
                  </p>
                  <!--              <p class="homeManagementDetailboxCardpcontent">-->
                  <!--                <span class="homeManagementDetailboxCardpcontenttimename">电量：</span>-->
                  <!--                <span class="homeManagementDetailboxCardpcontenttime">70</span>-->
                  <!--              </p>-->
                  <!-- <div v-if="item.onlineStatusDesc=='在线'"> -->
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="item.onlineStatusDesc=='离线'"
                    @click="theRemoteUnlock(item)"
                  >远程解锁</el-button>
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="item.onlineStatusDesc=='离线'"
                    @click="administratorPassword(item)"
                  >管理员密码</el-button>
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="item.onlineStatusDesc=='离线'"
                    @click="temporaryAuthorizationCode(item)"
                  >临时授权码</el-button>
                  <!-- </div> -->
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="开锁记录" name="third">
              <el-table :data="lockTableData" border style="width: 100%">
                <el-table-column prop="roomName" label="房间"></el-table-column>
                <el-table-column prop="buildingName" label="房源"></el-table-column>
                <el-table-column prop="unlockTime" label="时间"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="unlockType" label="开锁方式"></el-table-column>
              </el-table>
              <div class="block" style="margin-top: 32px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="page"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="limit"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <el-dialog
      class="dialogTheHomeForm limitsize"
      width="40%"
      top="30vh"
      :title="dialoglock"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      :visible.sync="dialogLockVisible">
      <el-alert
        :closable="false"
        style="margin-bottom:20px;"
        title="密码有效期一小时"
        type="info"
        show-icon
      ></el-alert>
      <el-form
        label-position="left"
        style="padding-right:100px;"
        :model="dialogLockForm"
        :rules="dialogLockFormRules"
        ref="dialogLockFormref"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="申请人" prop="applicant">
          <el-input
            minlength="4"
            maxlength="16"
            placeholder="请输入申请人"
            :title="dialogLockForm.applicant"
            v-model="dialogLockForm.applicant"
          ></el-input>
        </el-form-item>
        <el-form-item label="下发手机" prop="phone">
          <el-input
            maxlength="11"
            placeholder="请输入下发手机"
            :title="dialogLockForm.phone"
            v-model="dialogLockForm.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="发放人">
          <el-input minlength="4" maxlength="16" disabled :title="issuer" v-model="issuer"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogLockVisible = false">取 消</el-button>
        <el-button type="primary" @click="cardLockYes">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="dialogTheHomeForm limitsize"
      width="40%"
      top="30vh"
      :title="dialogBingding"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      :visible.sync="dialogBindingVisible">
      <el-form
        label-position="left"
        style="padding-right:100px;"
        :model="dialogTheHomeBindingForm"
        :rules="dialogTheHomeBindingFormRules"
        ref="cardbindingform"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="卡号" prop="cardnumbers">
          <!-- 20位 小写字母+Num -->
          <el-input
            placeholder="请输入10-20位卡号"
            :title="dialogTheHomeBindingForm.cardnumbers"
            v-model="dialogTheHomeBindingForm.cardnumbers"
          ></el-input>
        </el-form-item>
        <el-form-item style="float:left" label="有效期" prop="effectivetime">
          <el-date-picker
            class="homeManagementDetaildatepicker"
            v-model="dialogTheHomeBindingForm.effectivetime"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBindingVisible = false">取 消</el-button>
        <el-button type="primary" @click="cardBindingYes">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="dialogTheHomeForm limitsize"
      width="40%"
      top="30vh"
      :title="dialogTheHome"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      :visible.sync="dialogTheHomeVisible">
      <el-form
        label-position="left"
        style="padding-right:100px;"
        :model="dialogTheHomeForm"
        :rules="dialogTheHomeRules"
        ref="setcretform"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="secret">
          <el-input
            minlength="4"
            maxlength="16"
            class="homeManagementDetailElinput"
            @keyup.native="proving"
            placeholder="请设置长度在4到16个数字密码"
            :title="dialogTheHomeForm.secret"
            v-model="dialogTheHomeForm.secret"
          ></el-input>
          <el-button type="primary" @click="generationbutton">生成随机密码</el-button>
        </el-form-item>
        <!--        <el-form-item label="有效次数" prop="time">-->
        <!--          <el-radio v-model="dialogTheHomeForm.time" label="1">一次</el-radio>-->
        <!--          <el-radio v-model="dialogTheHomeForm.time" label="-1">无限制</el-radio>-->
        <!--        </el-form-item>-->
        <el-form-item style="float:left" label="有效期" prop="effectivetime">
          <el-date-picker
            class="homeManagementDetaildatepicker"
            v-model="dialogTheHomeForm.effectivetime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTheHomeVisible = false">取 消</el-button>
        <el-button type="primary" @click="secretset">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  homeItemInfo,
  getUsersecrit,
  getUsercard,
  remoteUnlock,
  tempUnlock,
  administratorSec,
  unlockRecord
} from '@/api/projectapp/dormitoryManagement/';

export default {
  name: 'homeManagementDetail',
  data() {
    // 校验规则
    const checkCardnumbers = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入有效卡号'));
      }
      setTimeout(() => {
        if (value.length === 20) {
          if (!/^[0-9a]*$/.test(value)) {
            // if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)) {
            callback(new Error('请输入有效卡号'));
          } else {
            callback();
          }
        } else if (value.length === 10) {
          if (!/^[0-9a]*$/.test(value)) {
            callback(new Error('请输入有效卡号'));
          } else {
            callback();
          }
        } else {
          callback(new Error('请输入有效卡号'));
        }
      }, 0);
    };
    const checkAapplicant = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入申请人'));
      }
      setTimeout(() => {
        if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
          callback(new Error('请输入正确格式申请人'));
        } else {
          callback();
        }
      }, 0);
    };
    const checkIphone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号'));
      }
      setTimeout(() => {
        if (!/^1[34578]\d{9}$/.test(value)) {
          callback(new Error('请输入正确格式手机号'));
        } else {
          callback();
        }
      }, 0);
    };
    const checkIssuer = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入正确发放人'));
      }
      setTimeout(() => {
        if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
          callback(new Error('请输入正确格式发放人'));
        } else {
          callback();
        }
      }, 0);
    };
    return {
      issuer: '', // 发放人
      homename: '', // 房间名称
      floorname: '', // 楼层名称
      buildname: '', // 寝室名称
      item: null, // 修改人员
      lockTableData: [], // 开锁记录
      dormitorysearchvalue: '', // 寝室搜索
      floorsearchvalue: '', // 楼层搜索
      searchinput: '', // 关键字搜索
      page: 1, // 页数
      limit: 10, // 条数
      total: 0, // 总条
      xxdm: '', // 学校代码
      activeName: 'first', // 标签默认值
      dialogTheHomeForm: {
        secret: '', // 密码
        time: '1', // 使用次数
        effectivetime: '' // 有效期
      },
      // 卡号绑定
      dialogTheHomeBindingForm: {
        cardnumbers: '', // 卡号
        effectivetime: '' // 有效期
      },
      // 时间选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      roomId: '', // 房间id
      // 授权码表单
      dialogLockForm: {
        applicant: '', // 申请人
        phone: '', // 下发手机
        issuer: '' // 发放人
      },
      dialogTheHome: '', // 密码设置 的标题
      dialogBingding: '', // 卡片绑定 的标题
      dialoglock: '', // 授权码 的标题
      radio: '1', // 次数
      locksData: [], // 智能锁列表
      begintimeendtime: '', // 日期
      dialogTheHomeVisible: false, // 密码设置显示
      dialogBindingVisible: false, // 卡片绑定显示
      dialogLockVisible: false, // 授权码显示
      // 授权码规则
      dialogLockFormRules: {
        applicant: [
          { required: true, validator: checkAapplicant, trigger: 'change' }
        ],
        phone: [{ required: true, validator: checkIphone, trigger: 'change' }],
        issuer: [{ required: true, validator: checkIssuer, trigger: 'change' }]
      },
      // 卡号绑定规则
      dialogTheHomeBindingFormRules: {
        cardnumbers: [
          { required: true,min:10,max:20,message:'请输入有效卡号',trigger: 'change'}
        ],
        effectivetime: [
          { required: true, message: '请选择有效期', trigger: 'change' }
        ]
      },
      dialogTheHomeRules: {
        time: [
          { required: true, message: '请选择有效次数', trigger: 'change' }
        ],
        secret: [
          { required: true, message: '请设置正确随机密码', trigger: 'blur' },
          {
            min: 4,
            max: 16,
            message: '长度在 4 到 16 个数字',
            trigger: 'change'
          }
        ],
        effectivetime: [
          { required: true, message: '请选择有效期', trigger: 'change' }
        ]
      },
      dormitoryOptions: [
        // 寝室搜索options
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      floorOptions: [
        // 楼层搜索options
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ], // 表格数据
      tableData: [],
      list: [] // 列表
    };
  },
  methods: {
    /**
     * @description: 搜索
     * @param {type}
     * @return:
     */
    search() {
      //
    },

    /**
     * @description: 批量临时密码
     * @param {type}
     * @return:
     */
    setSecret() {
      //
    },

    /**
     * @description: 设置用户密码
     * @param {type}
     * @return:
     */
    async getTheusersecrit() {
      await getUsersecrit({
        userId: this.item.userId,
        userType: this.item.userType,
        password: this.dialogTheHomeForm.secret,
        beginTime: this.dialogTheHomeForm.effectivetime[0],
        endTime: this.dialogTheHomeForm.effectivetime[1],
        times: this.dialogTheHomeForm.time
      }).then(res => {
        if (res.resultCode === 1) {
          this.$message({
            type: 'success',
            message: res.resultMessage
          });
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      });
    },

    /**
     * @description: 校验
     * @param {type}
     * @return:
     */
    proving() {
      this.dialogTheHomeForm.secret = this.dialogTheHomeForm.secret.replace(
        /[^\.\d]/g,
        ''
      );
      this.dialogTheHomeForm.secret = this.dialogTheHomeForm.secret.replace(
        '.',
        ''
      );
    },

    /**
     * @description: 绑定用户卡号
     * @param {type}
     * @return:
     */
    async gethUsercard() {
      await getUsercard({
        userId: this.item.userId,
        userType: this.item.userType,
        card: this.dialogTheHomeBindingForm.cardnumbers,
        beginTime: this.dialogTheHomeBindingForm.effectivetime[0],
        endTime: this.dialogTheHomeBindingForm.effectivetime[1]
      }).then(res => {
        if (res.resultCode === 1) {
          this.$message({
            type: 'success',
            message: res.resultMessage
          });
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      });
    },

    /**
     * @description: 开锁记录
     * @param {type}
     * @return:
     */
    async theUnlockRecord() {
      await unlockRecord({
        roomId: this.roomId,
        page: this.page,
        limit: this.limit
      }).then(res => {
        if (res.resultCode === 1) {
          this.lockTableData = res.value.dataList;
          this.total = res.value.totalCount;
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      });
    },

    /**
     * @description: 远程开锁
     * @param {type}
     * @return:
     */
    async theRemoteUnlock(item) {
      await remoteUnlock({
        lockId: item.lockId
      }).then(res => {
        if (res.resultCode === 1) {
          this.$message({
            type: 'success',
            message: res.resultMessage
          });
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      });
    },

    /**
     * @description: 临时授权码
     * @param {type}
     * @return:
     */
    async getTempUnlock() {
      const item = this.item;
      await tempUnlock({
        lockId: item.lockId,
        applicant: this.dialogLockForm.applicant, // 申请人
        issuer: this.dialogLockForm.issuer, // 发放人
        phone: this.dialogLockForm.phone // 下发手机号
      }).then(res => {
        if (res.resultCode === 1) {
          this.$message({
            type: 'success',
            message: res.resultMessage
          });
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      });
    },

    /**
     * @description:  当前页分页改变
     * @param {type}
     * @return:
     */
    handleCurrentChange(val) {
      this.page = val;
      this.theUnlockRecord();
    },

    /**
     * @description: 分页数量改变
     * @param {type}
     * @return:
     */
    handleSizeChange(val) {
      this.limit = val;
      this.theUnlockRecord();
    },

    /**
     * @description: 获取列表
     * @param {type}
     * @return:
     */
    async getList() {
      await homeItemInfo({
        roomId: this.roomId,
        withAllots: true,
        withLocks: true
      }).then(res => {
        if (res.resultCode === 1) {
          const tableData = res.value.listAllotInfo;
          tableData.forEach(a => {
            if (a.gender == 1) {
              a.gender = '男';
            } else {
              a.gender = '女';
            }
          });
          this.tableData = tableData;
          this.locksData = res.value.lockVOList || [];
          this.total = res.value.totalCount;
          this.homename = res.value.name || '';
          this.floorname = res.value.floorName || '';
          this.buildname = res.value.buildingName || '';
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      });
    },

    /**
     * @description: 临时授权
     * @param {type}
     * @return:
     */
    cardLockYes() {
      if (this.$refs.dialogLockFormref) {
        this.$refs.dialogLockFormref.validate(valid => {
          if (valid) {
            this.getTempUnlock();
            this.dialogLockVisible = false;
          } else {
            return false;
          }
        });
      }
    },

    /**
     * @description: 生成密码
     * @param {type}
     * @return:
     */
    generationbutton() {
      const num = Math.ceil(Math.random() * 9999990 + 9999);
      this.$set(this.dialogTheHomeForm, 'secret', String(num));
    },

    // /**
    //  * @description:  当前页分页改变
    //  * @param {type}
    //  * @return:
    //  */
    // handleCurrentChange(val) {
    //   this.page = val;
    // },

    // /**
    //  * @description: 分页数量改变
    //  * @param {type}
    //  * @return:
    //  */
    // handleSizeChange(val) {
    //   this.limit = val;
    // },

    /**
     * @description: 房间详情
     * @param {type}
     * @return:
     */
    homesDetail() {
      // homesDetail
    },

    /**
     * @description: 密码设置
     * @param {type}
     * @return:
     */
    handleEdit(row) {
      this.item = null;
      this.dialogTheHomeForm = {
        secret: '',
        time: '1',
        effectivetime: ''
      };
      this.item = { ...row };
      if (this.$refs.setcretform) {
        this.$refs.setcretform.resetFields();
      }
      this.dialogTheHomeVisible = true;
      this.dialogTheHome = '密码设置（分配密码开锁权限）';
    },

    /**
     * @description: 设置密码
     * @param {type}
     * @return:
     */
    secretset() {
      if (this.$refs.setcretform) {
        this.$refs.setcretform.validate(valid => {
          if (valid) {
            this.getTheusersecrit();
            this.dialogTheHomeVisible = false;
            //
          } else {
            return false;
          }
        });
      }
    },

    /**
     * @description: 设置卡号
     * @param {type}
     * @return:
     */
    cardBindingYes() {
      if (this.$refs.cardbindingform) {
        this.$refs.cardbindingform.validate(valid => {
          if (valid) {
            this.gethUsercard();
            this.dialogBindingVisible = false;
          } else {
            return false;
          }
        });
      }

      // this.dialogTheHomeVisible = false;
    },

    /**
     * @description: 卡号绑定
     * @param {type}
     * @return:
     */
    carBinding(row) {
      this.item = null;
      this.dialogTheHomeBindingForm = {
        cardnumbers: '',
        effectivetime: ''
      };
      this.item = { ...row };
      if (this.$refs.cardbindingform) {
        this.$refs.cardbindingform.resetFields();
      }
      this.dialogBindingVisible = true;
      this.dialogBingding = '卡号绑定（绑定卡号进行解锁）';
    },

    /**
     * @description:管理员密码
     * @param {type}
     * @return:
     */
    async administratorPassword(item) {
      await administratorSec({
        lockId: item.lockId
      }).then(res => {
        if (res.resultCode === 1) {
          this.$alert(`管理员密码：${res.value}`, '管理员密码', {
            confirmButtonText: '确定'
          });
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      });
    },

    /**
     * @description:临时授权码
     * @param {type}
     * @return:
     */
    temporaryAuthorizationCode(row) {
      this.item = null;
      this.dialogLockForm = {
        applicant: '',
        phone: '',
        issuer: ''
      };
      this.item = { ...row };
      if (this.$refs.dialogLockFormref) {
        this.$refs.dialogLockFormref.resetFields();
      }
      this.dialogLockVisible = true;
      this.dialoglock = '临时授权码';
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    /**
     * @description: 切换标签
     * @param {type}
     * @return:
     */
    handleClick(value) {
      if (value.name === 'third') {
        this.theUnlockRecord();
      }
    }
  },
  mounted() {
    this.roomId = this.$route.query.roomId;
    this.issuer = localStorage.getItem('name');
    this.xxdm = localStorage.getItem('xxdm');
    this.getList();
  }
};
</script>

<style scoped>
.homeManagementDetail {
  min-width: 1007px;
}
.homeManagementDetailrifht {
  float: right;
}
.homeManagementDetailBoxCards {
  margin-top: 30px;
}
.homeManagementDetail .homesDetail {
  color: #409eff;
  cursor: pointer;
}
.homeManagementDetailtoped {
  font-size: 16px;
}
.homeManagementDetailtoped .homename {
  display: inline-block;
  margin-right: 60px;
}
.homeManagementDetailtoped .floorname {
  display: inline-block;
}
.homeManagementDetailboxCardp {
  font-size: 18px;
  font-weight: 600;
}
.homeManagementDetailboxCardpcontent {
  font-size: 16px;
}
.homeManagementDetailboxCardpcontenttimename {
  margin-right: 20px;
}
.homeManagementDetailboxCardpcontenttime {
  margin-right: 50px;
}
.homeManagementDetailboxCardpcontentnet {
  margin-right: 20px;
}
.homeManagementDetail .dialogTheHomeForm .el-dialog {
  min-width: 740px !important;
}
.homeManagementDetaildatepicker .el-range-separator {
  width: 30px;
}
.homeManagementDetailElinput {
  width: 355px;
  margin-right: 5px;
}
.onlineStatusDesc {
  padding: 2px 10px;
  background-color: #1ab91a;
  font-size: 14px;
  color: white;
  display: inline-block;
  vertical-align: bottom;
  margin-left: 10px;
  border-radius: 14px;
}
.nolineStatusDesc {
  padding: 2px 10px;
  background-color: grey;
  font-size: 14px;
  color: white;
  display: inline-block;
  vertical-align: bottom;
  margin-left: -10px;
  margin-bottom: 10px;
  border-radius: 14px;
}
.pisnoinformation {
  font-size: 16px;
  color: grey;
  text-align: center;
  margin-top: 50px;
}
</style>

<style>
.homeManagementDetail .el-date-editor .el-range-separator {
  width: 10% !important;
}
</style>