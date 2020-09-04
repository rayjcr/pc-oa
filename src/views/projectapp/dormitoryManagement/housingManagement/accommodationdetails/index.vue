<template>
  <div class="app-container accommodationdetails">
    <div class="u_TableMain accommodationdetailstoped">
        <!-- <span style="float:left">宿舍信息</span> -->
        <div class="filter-container">
          <span style="float:right;">
            <el-button @click="lookTimeSheets" type="primary">查看考勤情况</el-button>
          </span>
        </div>

      <div class="m_GenTableBox">
      <el-tabs
        v-if="isshowtab"
        :stretch="true"
        v-model="activeName"
        type="card"
        @tab-click="handleClick">
        <el-tab-pane v-for="a in allData" :key="`aa${a.id}`" :label="a.name" :name="a.name">
          <div class="accommodationdetailstitledormitoryname">
            <span class="homename">房源名称:</span>
            <span class="homedormitory" :title="a.name">{{a.name || ''}}</span>
            <span class="homeaddress">房源地址:</span>
            <span class="addressplace" :title="a.address">{{a.address || ''}}</span>
            <span class="homename">管理员:</span>
            <span class="homedormitory" :title="a.managerList">{{a.managerList || '无'}}</span>
            <span class="homename">人数:</span>
            <span class="homedormitory">{{memberNumber || 0}}</span>
          </div>
          <el-input
            class="homeManagementsearch"
            v-model="searchinput"
            clearable
            placeholder="请输入房间名称或者学生名称"
          ></el-input>
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          <div class="accommodationdetailscontent">
            <el-collapse
              v-for="(b, index) in floorData.floors"
              :key="`b${b.id}`"
              border
              v-model="collapseArr"
              @change="accommodationdetailscontentcollapse"
              accordion
            >
              <el-collapse-item :name="b.id">
                <template slot="title">
                  <div class="accommodationdetailscontentwrapper">
                    <div class="accommodationdetailscontentleft">
                      <span class="accommodationdetailscontentleftfloor">
                        <span class="iconone"></span>
                        <span style="vertical-align: middle;">{{b.alias}}</span>
                      </span>
                      <span
                        style="margin-right:10px;"
                        class="accommodationdetailscontentleftfloorhomenumber"
                      >房间数：{{sheetsStatisticsArray[b.id][0]}}</span>
                      <span
                        class="accommodationdetailscontentleftfloorhomenumber"
                      >入住人数：{{sheetsStatisticsArray[b.id][1]}}</span>
                    </div>
                  </div>
                </template>
                <div style="display: inline-block;">
                  <div class="accommodationdetailsct">
                    <el-card
                      v-for="(c, cindex) in memberList"
                      :key="`ac${cindex}`"
                      shadow="hover"
                      class="accommodationdetailsctcard"
                    >
                      <div>
                        <div class="top">
                          <p v-if="c.type == 0" style="height:20px;margin-top:0px">
                            <span
                              class="accommodationdetailspan"
                              style="display: inline-block;overflow: hidden;text-overflow: ellipsis;max-width: 169px;white-space: nowrap;"
                              :title="c.name.length>11?c.name:''"
                            >{{c.name}}</span>
                            <img
                              v-if="c.attributes == 1"
                              class="accommodationdetailimg"
                              src="../../../../../../static/img/Icoman.png"
                              alt
                            >
                            <img
                              v-if="c.attributes == 2"
                              class="accommodationdetailimg"
                              src="../../../../../../static/img/Icowoman.png"
                              alt
                            >
                          </p>
                          <p style="height:20px;margin-top:0px" v-else>
                            <span class="accommodationdetailspan" style="display: inline-block;overflow: hidden;text-overflow: ellipsis;max-width: 169px;white-space: nowrap;">{{c.name}}</span>
                          </p>
                          <p class="accomodationp">
                            <span v-if="c.type == 0" class="accommodationdetailspan">宿舍：</span>
                            <span v-if="c.type == 1" class="accommodationdetailspan">办公：</span>
                            <span v-if="c.type == 2" class="accommodationdetailspan">教室：</span>
                            <span v-if="c.type == 3" class="accommodationdetailspan">公共场所：</span>
                            <span class="accommodationdetailspan">人数： {{c.allotCount}}/{{c.maxNum}}</span>
                          </p>
                        </div>
                        <div class="accommodationdetailsctcardcontent" >
                          <div
                            class="accommodationdetailsctcardcontentitem"
                            v-for="(d, di) in c.listAllotInfo"
                          >
                            <p class="accommodationdetailsctcardcontentitemnj">{{d.fromName}}</p>
                            <p class="accommodationdetailsctcardcontentitemname">{{d.name}}</p>
                          </div>
                          <p
                            v-if="!c.listAllotInfo.length"
                            style="width: 100%;font-size: 14px;color: grey;line-height: 55px;"
                          >暂无人员</p>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div v-else>
        <div class="accommodationdetailstitledormitoryname">
          <span class="homename">房源名称:</span>
          <span class="homedormitory" :title="this.floorData.name">{{this.floorData.name || ''}}</span>
          <span class="homeaddress">房源地址:</span>
          <span
            class="addressplace"
            :title="this.floorData.address"
          >{{this.floorData.address || ''}}</span>
          <span class="homename">管理员:</span>
          <span class="homedormitory" :title="this.floorData.manag">{{this.floorData.manag || '无'}}</span>
          <span class="homename">人数:</span>
          <span class="homedormitory">{{memberNumber || 0}}</span>
        </div>
        <el-input
          class="homeManagementsearch"
          v-model="searchinput"
          clearable
          placeholder="请输入房间名称或者学生名称"
        ></el-input>
        <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        <div class="accommodationdetailscontent">
          <el-collapse
            v-for="(b, index) in floorData.floors"
            :key="`b${b.id}`"
            border
            v-model="collapseArr"
            @change="accommodationdetailscontentcollapse"
            accordion
          >
            <el-collapse-item :name="b.id">
              <template slot="title">
                <div class="accommodationdetailscontentwrapper">
                  <div class="accommodationdetailscontentleft">
                    <span class="accommodationdetailscontentleftfloor">
                      <span class="iconone"></span>
                      <span style="vertical-align: middle;">{{b.alias}}</span>
                    </span>
                    <span
                      style="margin-right:10px;"
                      class="accommodationdetailscontentleftfloorhomenumber"
                    >房间数：{{sheetsStatisticsArray[b.id][0]}}</span>
                    <span
                      class="accommodationdetailscontentleftfloorhomenumber"
                    >入住人数：{{sheetsStatisticsArray[b.id][1]}}</span>
                  </div>
                </div>
              </template>
              <div style="display: inline-block;">
                <div class="accommodationdetailsct">
                  <el-card
                    v-for="(c, cindex) in memberList"
                    :key="`ac${cindex}`"
                    shadow="hover"
                    class="accommodationdetailsctcard"
                  >
                    <div>
                      <div class="top">
                        <p style="height:20px;margin-top:0px"  v-if="c.type == 0">
                          <span class="accommodationdetailspan"  style="display: inline-block;overflow: hidden;text-overflow: ellipsis;max-width: 169px;white-space: nowrap;">{{c.name}}</span>
                          <img
                            v-if="c.attributes == 1"
                            class="accommodationdetailimg"
                            src="../../../../../../static/img/Icoman.png"
                            alt
                          >
                          <img
                            v-if="c.attributes == 2"
                            class="accommodationdetailimg"
                            src="../../../../../../static/img/Icowoman.png"
                            alt
                          >
                        </p>
                        <p style="height:20px;margin-top:0px" v-else>
                          <span class="accommodationdetailspan" style="display: inline-block;overflow: hidden;text-overflow: ellipsis;max-width: 169px;white-space: nowrap;">{{c.name}}</span>
                        </p>
                        <p class="accomodationp">
                          <span v-if="c.type == 0" class="accommodationdetailspan">宿舍：</span>
                          <span v-if="c.type == 1" class="accommodationdetailspan">办公：</span>
                          <span v-if="c.type == 2" class="accommodationdetailspan">教室：</span>
                          <span v-if="c.type == 3" class="accommodationdetailspan">公共场所：</span>
                          <span class="accommodationdetailspan">人数： {{c.allotCount}}/{{c.maxNum}}</span>
                        </p>
                      </div>
                      <div class="accommodationdetailsctcardcontent">
                        <div
                          class="accommodationdetailsctcardcontentitem"
                          v-for="(d, di) in c.listAllotInfo"
                        >
                          <p class="accommodationdetailsctcardcontentitemnj">{{d.fromName}}</p>
                          <p class="accommodationdetailsctcardcontentitemname">{{d.name}}</p>
                        </div>
                        <p
                          v-if="!c.listAllotInfo.length"
                          style="width: 100%;font-size: 14px;color: grey;"
                        >暂无人员</p>
                      </div>
                    </div>
                  </el-card>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <p style="text-align:center;margin-top: 50px;">
        <el-button @click="back" type="primary">返回</el-button>
      </p>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getlistWithallot,
  buildingGetListNoPage,
  buildingGetInformation,
  sheetsStatistics
} from '@/api/projectapp/dormitoryManagement/';

export default {
  name: '',
  data() {
    return {
      memberList: [], // 人员数据
      memberNumber: 0, // 总人数
      xxdm: '', // 学校代码
      isSeach: false, // 是否搜索
      searchinput: '', // 搜索条件
      sheetsStatisticsArray: null, // 统计数据
      floorData: [], // 房源楼层数据
      allData: [], // 房源数据
      buildingId: '', // 房源id
      isshowtab: true, // 展示详情
      radio3: '住宿情况',
      activeName: 'first',

      collapseArr: null
    };
  },
  watch: {},
  methods: {
    /**
     * @description: 房间人员列表
     * @param {type}
     * @return:
     */
    async getListWithAlot(val, key, value2, value) {
      if (!value2) {
        await getlistWithallot({
          schoolCode: this.xxdm,
          floorId: value,
          keyWords: this.searchinput
        }).then(res => {
          if (res.resultCode === 1) {
            if (this.isSeach && this.searchinput) {
              this.collapseArr = [];
              if (res.value.length) {
                res.value.forEach(a => {
                  this.collapseArr.push(a.floorId);
                });
              }
            }
            this.memberList = res.value;
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }
        });
      } else {
        await getlistWithallot({
          schoolCode: this.xxdm,
          buildingId: this.buildingId,
          floorId: value,
          keyWords: this.searchinput
        }).then(res => {
          if (res.resultCode === 1) {
            if (this.isSeach && this.searchinput) {
              this.collapseArr = [];
              if (res.value.length) {
                res.value.forEach(a => {
                  this.collapseArr.push(a.floorId);
                });
              }
            }
            this.memberList = res.value;
          } else {
            this.$message({
              type: 'error',
              message: res.resultMessage
            });
          }
        });
      }
    },

    /**
     * @description: 查看考勤情况
     * @param {type}
     * @return:
     */
    lookTimeSheets() {
      this.$router.push({
        path: '/attendanceManagement/attendanceMonitoring',
        query: {}
      });
    },

    /**
     * @description: 获取考勤记录统计
     * @param {type}
     * @return:
     */
    async getSheetsStatistics(value) {
      const temArrary = [];
      this.memberNumber = 0;
      await sheetsStatistics({
        schoolCode: this.xxdm,
        buildingId: value
      }).then(res => {
        if (res.resultCode === 1) {
          this.sheetsStatisticsArray = res.value;
          const resvalue = res.value;
          for (const a in resvalue) {
            temArrary.push(resvalue[a]);
          }
          temArrary.forEach((b, index) => {
            this.memberNumber += b[1];
          });
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      });
    },

    search() {
      this.isSeach = true;
      this.getListWithAlot(this.buildingId, 1, 1);
      this.collapseArr = [];
    },

    /**
     * @description: 获取房源信息
     * @param {type}
     * @return:
     */
    async getBuildingGetInformation(value, key, value2) {
      this.buildingId = value;
      await buildingGetInformation({
        schoolCode: this.xxdm,
        buildingId: value,
        withFloor: true,
        withRoom: false
      }).then(res => {
        if (res.resultCode === 1) {
          this.floorData = res.value;
          this.floorData.manag = [];
          this.floorData.managerList.forEach(a => {
            this.floorData.manag.push(a.name);
          });
          this.floorData.manag = this.floorData.manag.join('，');
          if (value2) {
            this.getListWithAlot(value, key, value2);
          }
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      });
    },

    handleClick(value) {
      this.allData.forEach(a => {
        if (a.name == value.name) {
          this.getSheetsStatistics(a.id);
          this.getBuildingGetInformation(a.id);
        }
      });
    },

    /**
     * @description: 获取房源列表
     * @param {type}
     * @return:
     */
    async getBuildingGetListNoPage(value) {
      await buildingGetListNoPage({
        schoolCode: this.xxdm
      }).then(res => {
        if (res.resultCode === 1) {
          this.allData = [];
          res.value.forEach((item, index) => {
            const obj = {};
            let arr = [];
            obj.id = item.id;
            obj.name = item.name;
            obj.address = item.address;
            item.managerList.forEach(a => arr.push(a.name));
            arr = arr.join('、');
            obj.managerList = arr;
            this.allData.push(obj);
          });
          this.activeName = this.allData[0].name;
          if (value) {
            this.getSheetsStatistics(this.allData[0].id);
            this.getBuildingGetInformation(this.allData[0].id, value);
          }
        } else {
          this.$message({
            type: 'error',
            message: res.resultMessage
          });
        }
      });
    },

    /**
     * @description:  返回
     * @param {type}
     * @return:
     */
    back() {
      this.$router.go(-1); // 返回上一层
    },

    accommodationdetailscontentcollapse(value) {
      if(value){
        this.memberList = [];
        this.isSeach = false;
        this.getListWithAlot('', 1, 1, value);
      }
    },
    /**
     * @description: 删除房间
     * @param {type}
     * @return:
     */
    closethisitem() {
      //
    }
  },
  mounted() {
    this.xxdm = localStorage.getItem('xxdm');
    const id = this.$route.query.id;
    if (id) {
      this.isshowtab = false;
      this.getSheetsStatistics(id);
      this.getBuildingGetInformation(id, 1, 1);
    } else {
      this.isshowtab = true;
      this.getBuildingGetListNoPage(1);
    }
  }
};
</script>
<style lang='scss' scoped>
.homename {
  font-size: 13px;
  line-height: 9px;
  color: #303133;
}

.homedormitory {
  font-size: 13px;
  color: #707276;
  margin-right: 60px;
  width: 200px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  line-height: 20px;
}

.homeaddress {
  font-size: 13px;
  line-height: 9px;
  color: #303133;
}

.addressplace {
  font-size: 13px;
  margin-right: 20px;
  color: #707276;
  width: 200px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  line-height: 20px;
}
.accommodationdetailstoped /deep/ .el-tabs__item{
  flex: none;
}
</style>

<style>
.accommodationdetails {
  width: 100%;
  min-width: 1007px;
}

.accommodationdetailstile {
  font-size: 24px;
  line-height: 24px;
}
.accommodationdetailstitledormitoryname {
  margin: 21px 0 30px 0;
}
.accommodationdetailscontent {
}
.accommodationdetailscontentwrapper {
  overflow: hidden;
}
.accommodationdetailscontentbutton {
  float: right;
  width: 104px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
  background-color: #409eff;
  border-radius: 20px;
  margin-top: 10px;
  margin-right: 50px;
}
.accommodationdetailscontent .el-collapse-item__header {
  height: 50px;
  line-height: 50px;
  background-color: #f5f7fa;
  border-top: none;
  margin-bottom: 20px;
}
.accommodationdetailscontent .el-collapse-item__content {
  padding: 14px 20px;
}
.accommodationdetailscontent .el-collapse-item__arrow {
  line-height: 50px !important;
}
.accommodationdetailscontent .el-collapse-item__wrap {
  border: none;
}
.accommodationdetailscontent .el-collapse > .is-active {
  border: 1px solid #eaedf4;
  margin-bottom: 20px;
}
.accommodationdetailscontentleft {
  float: left;
  padding-left: 30px;
}
.accommodationdetailscontentleftfloor {
  font-size: 18px;
  line-height: 50px;
  color: #c6c9ce;
  display: inline-block;
  vertical-align: middle;
  margin-right: 20px;
}
.accommodationdetailscontentleftfloorhomenumber {
  color: #606266;
  vertical-align: middle;
  font-size: 14px;
}
.accommodationdetailsct {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.accommodationdetailsctcard .top {
  height: 63px;
  background-color: #f5f7fa;
  padding: 13px 10px;
  box-sizing: border-box;
  line-height: 18px;
}
.accommodationdetailsctcard {
  width: 212px;
  height: 254px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-right: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}
.accommodationdetailsctcard .el-card__body {
  box-sizing: border-box;
  padding: 0px 0 20px 0 !important;
}
.accommodationdetailscontentleftfloor .iconone {
  display: inline-block;
  width: 4px;
  height: 14px;
  border-radius: 11px;
  margin-right: 10px;
  background-color: #409eff;
  vertical-align: middle;
}
.accommodationdetailimg {
  vertical-align: middle;
  margin-right: 5px;
  margin-top: -1px;
}
.accommodationdetailspan {
  vertical-align: middle;
  font-size: 14px;
}
.accommodationdetailsctcardcontent {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  justify-items: unsafe;
  padding: 20px 0;
  overflow-y: auto;
  height: 193px;
  padding-left: 15px;
  padding-top: 0;
}
.accommodationdetailsctcardcontentitemnj {
  font-size: 12px;
  margin:0;
}
.accommodationdetailsctcardcontentitemname {
  font-size: 14px;
  margin-top: 0;
}
.accommodationdetails .accommodationdetailstile {
  margin: 0 !important;
  padding: 0 !important;
  height: 55px;
}
.accomodationp {
  margin-top: -8px !important;
}
.accommodationdetailsctcardcontentitem {
  min-width: 80px;
  height: 42px;
  text-align: center;
  margin: 15px 0px;
}
.accommodationdetails .el-collapse {
  border-bottom: none !important;
}
.nodormitory {
  line-height: 35px !important;
}
.accommodationdetails .homeManagementsearch {
  width: 280px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.accommodationdetails .el-tabs__item {
  width: 200px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
}
</style>
