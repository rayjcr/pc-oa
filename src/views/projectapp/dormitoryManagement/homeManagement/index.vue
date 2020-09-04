<template>
  <div class="app-container homeManagement">
    <div class="u_TableMain">
      <div class="filter-container homeManagementtoped">
        <!-- <p class="homeManagementtile">房间管理</p> -->
        <div class="homeManagementnavgation">
          <el-select
            class="homeManagementselect"
            clearable
            @change="choicefloor"
            @clear="claerfloor"
            v-model="dormitorysearchvalue"
            placeholder="请选择寝室楼"
          >
            <el-option
              v-for="item in dormitoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <el-select
            class="homeManagementselect"
            clearable
            v-model="floorsearchvalue"
            @visible-change="visibleChange"
            placeholder="请选择楼层"
          >
            <el-option
              v-for="item in floorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <el-input
            class="homeManagementsearch"
            v-model="searchinput"
            clearable
            placeholder="请输入房间名称"
          ></el-input>
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="setSecret(item)">设置临时密码</el-button>
          <el-button style="margin-top: 5px;" type="primary" @click="alllock(item)">全部解锁</el-button>
        </div>
      </div>

      <div class="m_GenTableBox">
      <div class="">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" width="120">
            <template slot-scope="scope">{{ scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column label="房间名称">
            <template slot-scope="scope">
              <span class="homesDetail" @click="homesDetail(scope.row)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="floorName" label="楼层名称"></el-table-column>
          <el-table-column prop="buildingName" label="房源名称"></el-table-column>
          <el-table-column prop="allotCount" label="房间人数"></el-table-column>
        </el-table>
      </div>

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
      </div>
    </div>
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
  homeGetInformation,
  buildingGetListNoPage,
  getBuildingInfo,
  gettheusersec,
  roomRemoteUnlock
} from '@/api/projectapp/dormitoryManagement/';

export default {
  name: 'homeManagement',
  data() {
    return {
      dormitorysearchvalue: '', // 寝室搜索
      floorsearchvalue: '', // 楼层搜索
      searchinput: '', // 关键字搜索
      page: 1, // 页数
      limit: 10, // 条数
      total: 0, // 总条
      item: null, // 修改人员
      xxdm: '', // 学校代码
      // 时间选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      dialogTheHomeVisible: false, // 批量设置密码弹窗
      dialogTheHome: '', // 密码设置 的标题
      dialogTheHomeForm: {
        secret: '', // 密码
        time: '1', // 使用次数
        effectivetime: '' // 有效期
      },
      dormitoryOptions:
        // 寝室搜索options
      [
          // {
          //   value: '选项1',
          //   label: '黄金糕'
          // },
          // {
          //   value: '选项2',
          //   label: '双皮奶'
          // },
          // {
          //   value: '选项3',
          //   label: '蚵仔煎'
          // },
          // {
          //   value: '选项4',
          //   label: '龙须面'
          // },
          // {
          //   value: '选项5',
          //   label: '北京烤鸭'
          // }
      ],
      floorOptions: [
        // 楼层搜索options
      ],
      tableData: [], // 表格数据
      multipleSelection: [],
      // 规则
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
      this.page = 1;
      this.getBuildingGetListAll();
      this.getHomeGetInformation();
    },

    /**
     * @description: 批量临时密码
     * @param {type}
     * @return:
     */
    setSecret(row) {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'warning',
          message: '请勾选房间'
        });
        return;
      }
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
      this.dialogTheHome = '批量密码设置（分配密码开锁权限）';
    },

    /** roomRemoteUnlock
     * @description: 全部解锁
     * @param {type}
     * @return:
     */
    async alllock(row) {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'warning',
          message: '请勾选房间'
        });
        return;
      }
      await roomRemoteUnlock({
        roomIds: this.multipleSelection.join(',')
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

    choicefloor(value) {
      this.floorsearchvalue = '';
      this.getThebuildingInfo(value);
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
     * @description: 清除事件
     * @param {type}
     * @return:
     */
    claerfloor() {
      this.floorsearchvalue = '';
    },

    /**
     * @description: 下拉数据处理
     * @param {type}
     * @return:
     */
    visibleChange() {
      if (!this.dormitorysearchvalue) {
        this.floorOptions = [];
      }
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
     * @description: 获取房源具体信息
     * @param {type}
     * @return:
     */
    async getThebuildingInfo(value) {
      await getBuildingInfo({
        buildingId: value,
        withFloor: true
      }).then(res => {
        if (res.resultCode === 1) {
          this.floorOptions = [];
          res.value.floors.forEach(a => {
            const obj = {};
            obj.value = a.id;
            obj.label = a.alias;
            this.floorOptions.push(obj);
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
     * @description: 设置密码
     * @param {type}
     * @return:
     */
    async getTheusersecrit() {
      await gettheusersec({
        beginTime: this.dialogTheHomeForm.effectivetime[0] || '',
        endTime: this.dialogTheHomeForm.effectivetime[1] || '',
        password: this.dialogTheHomeForm.secret,
        roomIds: this.multipleSelection.join(',')
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
     * @description: 获取房源列表
     * @param {type}
     * @return:
     */
    async getBuildingGetListAll() {
      await buildingGetListNoPage({}).then(res => {
        if (res.resultCode === 1) {
          this.dormitoryOptions = [];
          res.value.forEach(a => {
            const obj = {};
            obj.value = a.id;
            obj.label = a.name;
            this.dormitoryOptions.push(obj);
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
     * @description: 获取房间列表
     * @param {type}
     * @return:
     */
    async getHomeGetInformation() {
      await homeGetInformation({
        schoolCode: this.xxdm,
        buildingId: this.dormitorysearchvalue,
        floorId: this.floorsearchvalue,
        keyWords: this.searchinput,
        page: this.page,
        pageSize: this.limit
      }).then(res => {
        if (res.resultCode === 1) {
          this.tableData = res.value.dataList;
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
     * @description: 房间详情
     * @param {type}
     * @return:
     */
    homesDetail(item) {
      // homesDetail
      this.$router.push({
        path: '/dormitoryManagement/homeManagementDetail',
        query: { roomId: item.id }
      });
    },

    /**
     * @description:  当前页分页改变
     * @param {type}
     * @return:
     */
    handleCurrentChange(val) {
      this.page = val;
      this.getHomeGetInformation();
    },

    /**
     * @description: 分页数量改变
     * @param {type}
     * @return:
     */
    handleSizeChange(val) {
      this.limit = val;
      this.getHomeGetInformation();
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
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach(a => {
        this.multipleSelection.push(a.id);
      });
    }
  },
  mounted() {
    this.xxdm = localStorage.getItem('xxdm');
    this.getBuildingGetListAll();
    this.getHomeGetInformation();
  }
};
</script>

<style scoped>
.homeManagement {
  min-width: 1007px;
}
.homeManagement .dialogTheHomeForm .el-dialog {
  min-width: 740px !important;
}
.homeManagementnavgation {
  overflow: hidden;
}
.homeManagementselect .el-input--suffix .el-input__inner {
  width: 160px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.homeManagementselect {
  margin-right: 10px;
  width: 160px;
}
.homeManagementsearch {
  width: 280px;
  margin-right: 30px;
}
.homeManagementrifht {
  float: right;
}

.homeManagement .homeManagementDetailElinput {
  width: 355px;
  margin-right: 5px;
}
.homeManagementtile {
  font-size: 24px;
  line-height: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}
.homeManagementBoxCards {
  margin-top: 30px;
}
.homeManagement .homesDetail {
  color: #409eff;
  cursor: pointer;
}
</style>
