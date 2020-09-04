<template>
  <div class="app-container homeManagement">
    <div class="u_TableMain">
    <div class="filter-container homeManagementtoped">
      <!-- <p class="homeManagementtile">房间人员管理</p> -->
      <div class="homeManagementnavgation">
        <el-input
          class="homeManagementsearch"
          v-model="searchinput"
          clearable
          placeholder="请输入房间名称或人员信息"
        ></el-input>
        <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="setSecret">数据导出</el-button>
      </div>
    </div>
    <div class="m_GenTableBox">
    <div class="homeManagementBoxCards">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" align="center" width="120">
          <template slot-scope="scope">{{ scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column prop="name" label="房间名称"></el-table-column>
        <el-table-column prop="type" label="房间类型"></el-table-column>
        <el-table-column prop="num" label="房间人数"></el-table-column>
        <el-table-column prop="buildingName" label="房源名称"></el-table-column>
        <el-table-column prop="floorName" label="所属楼层"></el-table-column>
        <el-table-column prop="peaplename" width="350" label="房间人员">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              :content="scope.row.peaplename|| '暂无人员'"
              width="200"
              trigger="hover"
            >
              <el-button class="shortbutton" slot="reference">{{scope.row.peaplename|| '暂无人员'}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
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
  </div>
</template>
<script>
import { homeGetInformation } from '@/api/projectapp/dormitoryManagement/';

import * as api from '@/api/projectapp/dormitoryManagement/';
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
      xxdm: '', // 学校代码
      tableData: [], // 表格数据
      multipleSelection: [],
      list: [] // 列表
    };
  },
  methods: {
    /**
     * @description: 房间人员列表
     * @param {type}
     * @return:
     */
    async getHomePeaple() {
      await homeGetInformation({
        schoolCode: this.xxdm,
        buildingId: this.dormitorysearchvalue,
        floorId: this.floorsearchvalue,
        keyWords: this.searchinput,
        withAllots: true,
        page: this.page,
        pageSize: this.limit
      }).then(res => {
        if (res.resultCode === 1) {
          this.tableData = res.value.dataList;
          this.tableData.forEach(item => {
            item.peaple = [];
            if (item.type == 0) {
              item.type = '寝室';
            }
            if (item.type == 1) {
              item.type = '办公室';
            }
            if (item.type == 2) {
              item.type = '教室';
            }
            if (item.type == 3) {
              item.type = '公共场所';
            }
            item.num = `${item.allotCount}/${item.maxNum}`;
            if (item.listAllotInfo && item.listAllotInfo.length) {
              item.listAllotInfo.forEach(listAllotInfoitem => {
                item.peaple.push(listAllotInfoitem.name);
              });
              item.peaplename = item.peaple.join('、');
            } else {
              item.peaplename = '';
            }
          });
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
     * @description: 搜索
     * @param {type}
     * @return:
     */
    search() {
      this.page = 1;
      this.getHomePeaple();
    },

    /**
     * @description: 批量临时密码
     * @param {type}
     * @return:
     */
    async setSecret() {
      const res = await api.downLoadmemberhome();
      const blob = new Blob([res], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      });
      const downloadElement = document.createElement('a');
      const href = window.URL.createObjectURL(blob); // 创建下载的链接
      downloadElement.href = href;
      downloadElement.download = '房间人员管理.xls'; // 下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); // 点击下载
      document.body.removeChild(downloadElement); // 下载完成移除元素
      window.URL.revokeObjectURL(href); // 释放掉blob对象
    },

    /**
     * @description: 房间详情
     * @param {type}
     * @return:
     */
    homesDetail() {
      // homesDetail
      this.$router.push({
        path: '/dormitoryManagement/homeManagementDetail',
        params: {}
      });
    },

    /**
     * @description:  当前页分页改变
     * @param {type}
     * @return:
     */
    handleCurrentChange(val) {
      this.page = val;
      this.getHomePeaple();
    },

    /**
     * @description: 分页数量改变
     * @param {type}
     * @return:
     */
    handleSizeChange(val) {
      this.limit = val;
      this.getHomePeaple();
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
      this.multipleSelection = val;
    }
  },
  mounted() {
    this.xxdm = localStorage.getItem('xxdm')
    this.getHomePeaple();
  }
};
</script>

<style>
.homeManagement {
  min-width: 1007px;
}
.homeManagementsearch {
  width: 280px;
  margin-right: 30px;
}
.homeManagementrifht {
  float: right;
}

.homeManagementtile {
  font-size: 24px;
  line-height:24px;
  font-weight: 600;
  margin-bottom: 20px;
}
.homeManagementBoxCards {

}
.homeManagement .homesDetail {
  color: #409eff;
  cursor: pointer;
}
.shortbutton {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 200px;
}
</style>
