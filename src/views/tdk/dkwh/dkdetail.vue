<template>
 <div>
  <div class="detaLeft">
    <el-form ref="form" :model="form" label-width="90px">
      <el-form-item label="原上课信息:">
        <el-input
          placeholder="原上课人信息"
          v-model="yskrxx"
          :disabled="true"
          class="yskr">
        </el-input>
      </el-form-item>
      <el-form-item label="代课人:">
        <el-autocomplete
          class="inline-input dkr"
          v-model="form.dkr"
          :fetch-suggestions="dkrquerySearch"
          placeholder="代课人"
          :trigger-on-focus="false"
          @select="dkrhandleSelect"
          suffix-icon="el-icon-edit"
        >
          <template slot-scope="item">
            <div class="name">{{ item.item.xm }}</div>
          </template>
        </el-autocomplete>
        <el-tooltip class="item" effect="dark" content="查看推荐教师" placement="top-end">
          <el-button icon="el-icon-view" @click="openBox" circle></el-button>
        </el-tooltip>
       <!-- <a class="checkClass" @click="openBox">查看课表</a>-->
      </el-form-item>
       <el-form-item v-if="tuijian" label="推荐教师:">
         <el-button size="small" v-for="(item,index) in tjjs" @click="changedkr(item)" :key="index" type="info" plain>{{item}}</el-button>
       </el-form-item>
      <el-form-item label="代课原因:">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancle">返回</el-button>
        <el-button @click="shengqin" type="primary">申请</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="detaRight">
    <div>
      <el-form class="rightForm" ref="form" :model="form" label-width="120px">
        <el-form-item label="输入原上课人:">
          <div v-if="glytype">
            <el-autocomplete
              class="inline-input yskr"
              v-model="form.yskr"
              :fetch-suggestions="querySearch"
              placeholder="输入教师姓名进行查询"
              :trigger-on-focus="false"
              @select="handleSelect"
              suffix-icon="el-icon-search"
            >
              <template slot-scope="item">
                <div class="name">{{ item.item.xm }}</div>
              </template>
            </el-autocomplete>
          </div>
          <div v-else>
            <el-input
              placeholder=""
              v-model="initYdk"
              :disabled="true"
              class="inline-input yskr">
            </el-input>
          </div>

        </el-form-item>
      </el-form>
      <el-date-picker
        :clearable=false
        ref="dates"
        @change = "change"
        v-model="weeks"
        type="week"
        format="yyyy 第 WW 周"
        placeholder="选择周次"
        class="chooseweek">
      </el-date-picker>
    </div>

    <el-table
    :data="tableData" border @cell-click="choosedkr"
    style="width: 100%">
     <el-table-column style="text-align:center" label="原上课人课表">
     <el-table-column
      type="index"
      width="40">
    </el-table-column>
    <el-table-column
      label="星期一"
      width="200"
      >
      <template slot-scope="scope" >
        <div slot="reference" v-show="scope.row.class1 != ''" class="name-wrapper">
          <p>{{ scope.row.class1 }}</p>
          <div v-if="scope.row.status1 == 1 && tjTeachquest.mbid != '0'" class="shengpizhong">审批中</div>
          <div v-if="scope.row.spjl1 && scope.row.spjl1.status == 'dk' && tjTeachquest.mbid != '0'" class="shengpitongguo">审批通过</div>
          <div v-if="scope.row.hb1 == true" class="shengpitongguo">合班</div>
          <div v-if="scope.row.djs1 == true" class="shengpitongguo">多教师</div>
          <div v-if="scope.row.dsz1 == true" class="shengpitongguo">单双周</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="星期二"
      width="200">
      <template slot-scope="scope" >
        <div slot="reference" v-show="scope.row.class2 != ''" class="name-wrapper">
          <p>{{ scope.row.class2 }}</p>
          <div v-if="scope.row.status2 == 1 && tjTeachquest.mbid != '0'" class="shengpizhong">审批中</div>
          <div v-if="scope.row.spjl2 && scope.row.spjl2.status == 'dk' && tjTeachquest.mbid != '0'" class="shengpitongguo">审批通过</div>
          <div v-if="scope.row.hb2 == true" class="shengpitongguo">合班</div>
          <div v-if="scope.row.djs2 == true" class="shengpitongguo">多教师</div>
          <div v-if="scope.row.dsz2 == true" class="shengpitongguo">单双周</div>
        </div>
      </template>
    </el-table-column>
     <el-table-column
      label="星期三"
      width="200">
      <template slot-scope="scope" >
        <div slot="reference" v-show="scope.row.class3 != ''" class="name-wrapper">
          <p>{{ scope.row.class3 }}</p>
          <div v-if="scope.row.status3 == 1 && tjTeachquest.mbid != '0'" class="shengpizhong">审批中</div>
          <div v-if="scope.row.spjl3 && scope.row.spjl3.status == 'dk' && tjTeachquest.mbid != '0'" class="shengpitongguo">审批通过</div>
          <div v-if="scope.row.hb3 == true" class="shengpitongguo">合班</div>
          <div v-if="scope.row.djs3 == true" class="shengpitongguo">多教师</div>
          <div v-if="scope.row.dsz3 == true" class="shengpitongguo">单双周</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="星期四"
      width="200">
       <template slot-scope="scope" >
        <div slot="reference" v-show="scope.row.class4 != ''" class="name-wrapper">
          <p>{{ scope.row.class4 }}</p>
          <div v-if="scope.row.status4 == 1 && tjTeachquest.mbid != '0'" class="shengpizhong">审批中</div>
          <div v-if="scope.row.spjl4 && scope.row.spjl4.status == 'dk' && tjTeachquest.mbid != '0'" class="shengpitongguo">审批通过</div>
          <div v-if="scope.row.hb4 == true" class="shengpitongguo">合班</div>
          <div v-if="scope.row.djs4 == true" class="shengpitongguo">多教师</div>
          <div v-if="scope.row.dsz4 == true" class="shengpitongguo">单双周</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="星期五"
      width="200">
       <template slot-scope="scope" >
        <div slot="reference" v-show="scope.row.class5 != ''" class="name-wrapper">
          <p>{{ scope.row.class5 }}</p>
          <div v-if="scope.row.status5 == 1 && tjTeachquest.mbid != '0'" class="shengpizhong">审批中</div>
          <div v-if="scope.row.spjl5 && scope.row.spjl5.status == 'dk' && tjTeachquest.mbid != '0'" class="shengpitongguo">审批通过</div>
          <div v-if="scope.row.hb5 == true" class="shengpitongguo">合班</div>
          <div v-if="scope.row.djs5 == true" class="shengpitongguo">多教师</div>
          <div v-if="scope.row.dsz5 == true" class="shengpitongguo">单双周</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="星期六"
      width="200">
       <template slot-scope="scope" >
        <div slot="reference" v-show="scope.row.class6 != ''" class="name-wrapper">
          <p>{{ scope.row.class6 }}</p>
          <div v-if="scope.row.status6 == 1 && tjTeachquest.mbid != '0'" class="shengpizhong">审批中</div>
          <div v-if="scope.row.spjl6 && scope.row.spjl6.status == 'dk' && tjTeachquest.mbid != '0'" class="shengpitongguo">审批通过</div>
          <div v-if="scope.row.hb6 == true" class="shengpitongguo">合班</div>
          <div v-if="scope.row.djs6 == true" class="shengpitongguo">多教师</div>
          <div v-if="scope.row.dsz6 == true" class="shengpitongguo">单双周</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="星期日"
      width="200">
       <template slot-scope="scope" >
        <div slot="reference" v-show="scope.row.class7 != ''" class="name-wrapper">
          <p>{{ scope.row.class7 }}</p>
          <div v-if="scope.row.status7 == 1 && tjTeachquest.mbid != '0'" class="shengpizhong">审批中</div>
          <div v-if="scope.row.spjl7 && scope.row.spjl7.status == 'dk' && tjTeachquest.mbid != '0'" class="shengpitongguo">审批通过</div>
          <div v-if="scope.row.hb7 == true" class="shengpitongguo">合班</div>
          <div v-if="scope.row.djs7 == true" class="shengpitongguo">多教师</div>
          <div v-if="scope.row.dsz7 == true" class="shengpitongguo">单双周</div>
        </div>
      </template>
    </el-table-column>
    </el-table-column>
  </el-table>
  </div>
  </div>
</template>

<script>
  import {
    getByJsList, getClassStructure, getRecommendedTeacher, checkConflict, save, validaSplc
  } from '@/api/tdk/tk'
  import jcsj from '@/api/jcsj';
  import { getCurrentXnxq } from 'api/admin/acadyear/index';
  import { getApprovaltable } from 'api/tdk/tkxx/addJw';
export default {
  data() {
    return {
      restaurants: [],
      form: {
        yskr: '',
        dkr: '',
        desc: '',
        yskrgh: '',
        dkrgh: ''
      },
      tableData: [],
      bdkTabel: false,
      listQuery: {
        xxdm: '',
        zgh: '',
        time: ''
      },
      resData: [],
      classAll: [],
      xnAll: [],
      bjAll: [],
      week: {
        一: 1,
        二: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        日: 7

      },
      isdk: false,
      kcdm: '',
      tjTeachquest: {
        dkkc: '', // 代课课程
        dkrq: '',
        xxdm: '', // 学校代码
        yskr: '',
        dkr: '',
        dkyy: '',
        sqr: '',
        mbid: '',
        userid: '',
        shzt: '1',
        dkbj: '', // 代课班级
        dkjc: '', // 代课节次
        dknj: '', // 代课年级
        dkzc: '', // 代课周次
        dksjList: [],
        dkmx: ''
      },
      tjjs: [],
      finArr: [],
      usercode: '',
      glytype: false, // 2 管理员
      initYdk: '', // 非管理员的不可选的人
      submited: false, // 防止重复提交
      weeks: '', // 帅选周次
      yskrxx: '', // 原上课人信息
      pkkc: [], // 所选课程的节次和周次
      tuijian: false// 是否显示推荐教师
    };
  },
  mounted() {

  },
  created() {
    this.getClassAll();
    this.getxnAll();
    this.listQuery.xxdm = window.localStorage.getItem('xxdm');
    this.tjTeachquest.xxdm = this.listQuery.xxdm;
   /* this.tjTeachquest.mbid = window.localStorage.getItem('rdkmb');*/
    this.tjTeachquest.sqr = window.localStorage.getItem('name');
    this.tjTeachquest.userid = window.localStorage.getItem('userid');
    this.usercode = window.localStorage.getItem('usercode');
    // window.localStorage.getItem('isgly') == 'true' ? true : false;
    this.submited = false;
    this.getDkMbxx();
   /* this.$nextTick(function() {
      this.glytype = !!(this.$route.query.isgly == 'true' || this.$route.query.isgly == true);
      this.getJsAll();
    })*/
  },
  methods: {
    async getDkMbxx() {

      const res = await validaSplc({ xxdm: this.listQuery.xxdm })
      if (res.status === 200) {
        this.tjTeachquest.mbid = res.data.mbid;
        this.glytype = res.data.isJwc;
        this.getJsAll();
      }
    },
    querySearch(queryString, cb) { // 得到原上课人
      const restaurants = this.restaurants;
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据

      cb(results);
    },
    dkrquerySearch(queryString, cb) { // 得到代课人
      const restaurants = this.restaurants;
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) { // 帅选教师
      return restaurant => restaurant.xm.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    },
    handleSelect(item) { // 选择原上课人
      this.form.yskr = item.xm;
      this.listQuery.time = this.getweek();
      this.form.yskrgh = item.gh;
      this.listQuery.zgh = item.gh;
      this.tjTeachquest.yskr = item.gh;
      if (this.weeks == '') {
        this.$alert('请选择周次', '提示', {
          confirmButtonText: '确定'
        });
        return;
      }
      this.yskrxx = '';
      this.form.dkr = '';
      this.tjTeachquest.dkr = '';
      this.tuijian = false;
      this.tjjs = [];
      this.getClassStructure();
      this.getByJsList();
      this.isdk = false;
    },
    dkrhandleSelect(item) { // 选择代课人
      if (this.weeks == '') {
        this.$alert('请选择周次', '提示', {
          confirmButtonText: '确定'
        });
        return;
      }
      if (this.yskrxx == '') {
        this.$alert('请选择课程', '提示', {
          confirmButtonText: '确定'
        });
        return;
      }
      this.form.dkr = item.xm;
      this.form.dkrgh = item.gh;
      this.form.zgh = item.gh;
      this.listQuery.zgh = item.gh;
      this.tjTeachquest.dkr = item.gh;
      this.isdk = true;
      this.tuijian = false;
      this.submited = false;
      this.getClassStructure();
      this.getByJsList();
    },
    getJsAll() { // 获取所有教师

      const v = { xxdm: this.listQuery.xxdm };
      jcsj.hqjslb(v).then(res => {
        this.restaurants = res;
        this.initYdk = jcsj.hqjsmcByid(this.restaurants, this.usercode);
        if (!this.glytype) {
          this.form.yskr = this.initYdk;
          this.form.yskrgh = this.usercode;
          this.listQuery.zgh = this.usercode;
          this.tjTeachquest.yskr = this.usercode;
          // this.getByJsList();
        }
      })
    },
    getClassAll() { // 获取所有课程
      const that = this;
      const v = { xxdm: window.localStorage.getItem('xxdm') };
      jcsj.hqkclb(v).then(res => {
        that.classAll = res;
      })
    },
    getxnAll() { // 获取当前学期
      const that = this;
      getCurrentXnxq({ xxdm: window.localStorage.getItem('xxdm') }).then(response => {
        that.xnAll = response.data.xn;

        that.getbjAll();
      });
    },
    getbjAll() { // 获取所有班级
      const that = this;
      const v = { xn: that.xnAll, xxdm: window.localStorage.getItem('xxdm') };
      jcsj.hqbjlb(v).then(res => {
        that.bjAll = res;
      })
    },
    async getByJsList() { // 获得课程并组装数组
      const that = this;
      const shengpizhong = {// 获取审批中课程的参数
        schoolCode: that.listQuery.xxdm,
        zgh: that.listQuery.zgh,
        time: that.listQuery.time
      };
      let shengpizhongData = [];// 审批中课程数据
      await getApprovaltable(shengpizhong).then(res => { // 获取该审批中的课程
        if (res.status == 200) {
          shengpizhongData = res.data;
        } else {
          this.$alert('获取审批中课程有误', '提示', {
            confirmButtonText: '确定'
          });
          return;
        }
      })
      getByJsList(that.listQuery).then(res => {
        that.resData = res;
        if (that.resData.length > 0) {
          let baseInfo = '';
          that.resData.forEach((item, index) => {
            if (item.ishb != 0) {
              const hb = item.hbbj.split(',');
              baseInfo = jcsj.hqbjmcByid(that.bjAll, hb[0]) + '-' + jcsj.hqkcmcByid(that.classAll, item.kcdm) + ',' + jcsj.hqbjmcByid(that.bjAll, hb[1]) + '-' + jcsj.hqkcmcByid(that.classAll, item.kcdm);
            } else {
              baseInfo = jcsj.hqbjmcByid(that.bjAll, item.bjdm) + '-' + jcsj.hqkcmcByid(that.classAll, item.kcdm);
            }

            that.$set(that.tableData[item.pkjs - 1], 'class' + item.pkzs, baseInfo);
            that.$set(that.tableData[item.pkjs - 1], 'row' + item.pkzs, item.pkjs);
            that.$set(that.tableData[item.pkjs - 1], 'col' + item.pkzs, item.pkzs);
            that.$set(that.tableData[item.pkjs - 1], 'dknj' + item.pkzs, item.njdm);
            that.$set(that.tableData[item.pkjs - 1], 'dkkc' + item.pkzs, item.kcdm);
            that.$set(that.tableData[item.pkjs - 1], 'dkbj' + item.pkzs, item.bjdm);
            that.$set(that.tableData[item.pkjs - 1], 'pkid' + item.pkzs, item.pkid);
            that.$set(that.tableData[item.pkjs - 1], 'dsz' + item.pkzs, item.isdsz != 0);// 单双周
            that.$set(that.tableData[item.pkjs - 1], 'hb' + item.pkzs, item.ishb != 0);// 合班
            that.$set(that.tableData[item.pkjs - 1], 'djs' + item.pkzs, item.isdjs != 0);// 合班

            if (item.spjl && Object.keys(item.spjl).length > 0) {
              that.$set(that.tableData[item.pkjs - 1], 'spjl' + item.pkzs, item.spjl);
            }
            if (this.isdk) { // 代课人改变时  判断课程是否有误
              if (item.pkjs == this.pkkc[0] && item.pkzs == this.pkkc[1]) { // 判断所选课程是否和被带课程有冲突
                this.$alert(baseInfo + '此节课重课，不可代', '提示', {
                  confirmButtonText: '确定'
                });
                return;
              }
            }
            /*
            审批状态
            1  审批中
            */
            shengpizhongData.forEach((itemC, index) => {
              if (itemC.startJc == item.pkjs && itemC.startZc == item.pkzs && itemC.startDate == that.listQuery.time) {
                that.$set(that.tableData[item.pkjs - 1], 'status' + item.pkzs, '1');
              }
            })
          })
        }
      })
    },
    getClassStructure() { // 获取课表结构
      getClassStructure({ xxdm: this.listQuery.xxdm }).then(res => {
        let resdata = res,
          row = resdata.swjs + resdata.wsjs + resdata.xwjs,
          col = resdata.pkzs.split(','),
          tableArr = [];
        const arr = [];
        arr.length = row;
        for (let i = 0; i < arr.length; i++) {
          tableArr[i] = {};
        }
        tableArr.forEach((item, index) => {
          item.row = '';
          item.col = '';
          item.index = index;
          item.class1 = '';
          item.class2 = '';
          item.class3 = '';
          item.class4 = '';
          item.class5 = '';
          item.class6 = '';
          item.class7 = '';
        })
        this.tableData = tableArr;
      })
    },
    gettjteach() { // 获得推荐老师
      this.tjjs = [];
      getRecommendedTeacher(this.tjTeachquest).then(res => {
        // this.tjTeachquest.dksjList = [];
        this.kcdm = '';
        // this.tjTeachquest.dkkc = '';
        res.forEach((item, index) => {
          // console.log(55555555555555555555)
          // console.log(item)
          // console.log(this.form.yskrgh);
          if (this.form.yskrgh != item) {
            this.tjjs.push(jcsj.hqjsmcByid(this.restaurants, item))
          }
        })
      })
    },
    changedkr(item) { // 点击推荐老师
      console.log(item)
      this.form.dkr = item;
      this.form.dkrgh = jcsj.hqjsdmBymc(this.restaurants, item);
      this.isdk = true;
      this.tjTeachquest.dkr = this.form.dkrgh;
      this.listQuery.zgh = this.form.dkrgh
      this.getClassStructure();
      // this.getyskList();
      this.getByJsList()
    },
    shengqin() {
      this.tjTeachquest.dkyy = this.form.desc;
      this.tjTeachquest.dkrq = this.listQuery.time;
      this.tjTeachquest.dkmx = this.listQuery.time + ' ' + '星期' + this.tjTeachquest.dkzc + ' ' + '第' + this.tjTeachquest.dkjc + '节课' + ' ' + jcsj.hqkcmcByid(this.classAll, this.tjTeachquest.dkkc) + ',';
      if (this.tjTeachquest.dkyy == '') {
        this.$message({
          message: '警告,' + '代课原因未写',
          type: 'warning'
        });
        return false;
      }
      if (this.tjTeachquest.dkr == '') {
        this.$message({
          message: '警告,' + '代课人未写',
          type: 'warning'
        });
        return false;
      }
      this.tjTeachquest.dksjList = [];
      this.tjTeachquest.dksjList.push({
        dkjc: this.tjTeachquest.dkjc,
        dknj: this.tjTeachquest.dknj,
        dkzc: this.tjTeachquest.dkzc,
        dkbj: this.tjTeachquest.dkbj,
        dkrq: this.tjTeachquest.dkrq
      })
      if (this.checkSubmit()) {
        checkConflict(this.tjTeachquest).then(res => {
          this.submited = true;
          if (res.length == 0) {
            save(this.tjTeachquest).then(res => {
              if (res.status > 0) {
                this.submited = false;
                this.$router.push({
                  path: 'tdkManager/dkwh'
                })
              } else {
                this.submited = false;
                this.$message({
                  message: '警告,' + res.message,
                  type: 'warning'
                });
              }
            })
          } else {
            res.forEach((item, index) => {
              this.$message({
                message: '警告,' + item,
                type: 'warning'
              });
            })
          }
        })
      }
    },
    checkSubmit() {
      const that = this;
      if (!that.submited) {
        that.submited = true;
        return true;
      } else {
        this.$message({
          message: '警告,' + '请不要重复提交',
          type: 'warning'
        });
        return false;
      }
    },
    cancle() {
      this.$router.push({
        path: 'tdkManager/dkwh'
      })
    },
    timeGetArr(arr1, arr2, week, weekVal, saveArr) { // 点击时间数组去重
      const that = this;
      if (arr1 != null) {
        arr1.filter(item1 => {
          arr2.every(item2 => {
            if (item1 == item2) { // 判断所选时间是否选过
              that.$message({
                message: item1 + '该时间已代过课',
                type: 'warning'
              });
            } else if (new Date(item1).getDay() !== weekVal) { // 判断所选时间是否是对应的周
              that.$message({
                message: item1 + '不是' + week,
                type: 'warning'
              });
            } else {
              saveArr.push(item1)
              that.finArr.push(item1);
            }
          })
        })
      }
    },
    change() { // 周次改变
      if (this.listQuery.zgh == '') {
        this.$alert('请选择原上课人或代课人', '提示', {
          confirmButtonText: '确定'
        });
        return;
      }
      this.yskrxx = '';
      this.listQuery.zgh = this.form.yskrgh
      this.form.dkr = '';
      this.tjTeachquest.dkr = '';
      this.tuijian = false;
      this.isdk = false;
      this.tjjs = [];
      this.getClassStructure();
      this.listQuery.time = this.getweek();
      this.getByJsList();
    },
    getweek() { // 获取周次
      let week = ''
      let weeks = this.$refs.dates.displayValue.replace(' 第 ', '-')
      weeks = weeks.replace(' 周', '')
      week = weeks.replace('-0', '-')
      return week
    },
    choosedkr(row, column, cell, even) { // 点击原上课人的课程yskrxx
      let weeklab = column.label.substr(column.label.length - 1),
        weekVal = this.week[weeklab];// 获得周次
      if (this.isdk == true) {
        return;
      }
      this.tuijian = false;
      if (weeklab == '一' && row.class1 != '') { // 如果是周一 并且有课程
        console.log(999999999999)
        console.log(row)
        if (row.spjl1 && row.spjl1.status == 'dk') { // 判断是否代过课
          this.$message({
            showClose: true,
            message: '警告，此课程被代过课，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.status1 == '1') { // 判断是否在代课中
          this.$message({
            showClose: true,
            message: '警告，此课程正在审批，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.dsz1 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为单双周，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.hb1 == true) { // 判断是否合班
          this.$message({
            showClose: true,
            message: '警告，此课程为合班，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.djs1 == true) { // 判断是否多教师
          this.$message({
            showClose: true,
            message: '警告，此课程为多教师，不能操作！',
            type: 'warning'
          });
          return;
        } else {
          this.yskrxx = '周' + row.col1 + '第' + row.row1 + '节' + row.class1 + this.form.yskr;
          this.pkkc = [row.row1, row.col1];
          this.tjTeachquest.dkkc = row.dkkc1;
          this.tjTeachquest.dkbj = row.dkbj1;
          this.tjTeachquest.dkzc = row.col1;
          this.tjTeachquest.dknj = row.dknj1;
          this.tjTeachquest.dkjc = row.row1;
          this.tjTeachquest.pkid = row.pkid1;
        }
      }
      if (weeklab == '二' && row.class2 != '') {
        console.log(row.spjl2)
        if (row.spjl2 && row.spjl2.status == 'dk') {
          this.$message({
            showClose: true,
            message: '警告，此课程被代过课，不能操作！',
            type: 'warning'
          });
        } else if (row.status2 == '1') { // 判断是否在代课中
          this.$message({
            showClose: true,
            message: '警告，此课程正在审批，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.dsz2 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为单双周，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.hb2 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为合班，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.djs2 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为多教师，不能操作！',
            type: 'warning'
          });
          return;
        } else {
          this.yskrxx = '周' + row.col2 + '第' + row.row2 + '节' + row.class2 + this.form.yskr;
          this.pkkc = [row.row2, row.col2];
          this.tjTeachquest.dkkc = row.dkkc2;
          this.tjTeachquest.dkbj = row.dkbj2;
          this.tjTeachquest.dkzc = row.col2;
          this.tjTeachquest.dknj = row.dknj2;
          this.tjTeachquest.dkjc = row.row2;
          this.tjTeachquest.pkid = row.pkid2;
        }
      }
      if (weeklab == '三' && row.class3 != '') {
        if (row.spjl3 && row.spjl3.status == 'dk') {
          this.$message({
            showClose: true,
            message: '警告，此课程被代过课，不能操作！',
            type: 'warning'
          });
        } else if (row.status3 == '1') { // 判断是否在代课中
          this.$message({
            showClose: true,
            message: '警告，此课程正在审批，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.dsz3 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为单双周，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.hb3 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为合班，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.djs3 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为多教师，不能操作！',
            type: 'warning'
          });
          return;
        } else {
          this.yskrxx = '周' + row.col3 + '第' + row.row3 + '节' + row.class3 + this.form.yskr;
          this.pkkc = [row.row3, row.col3];
          this.tjTeachquest.dkkc = row.dkkc3;
          this.tjTeachquest.dkbj = row.dkbj3;
          this.tjTeachquest.dkzc = row.col3;
          this.tjTeachquest.dknj = row.dknj3;
          this.tjTeachquest.dkjc = row.row3;
          this.tjTeachquest.pkid = row.pkid3;
        }
      }
      if (weeklab == '四' && row.class4 != '') {
        if (row.spjl4 && row.spjl4.status == 'dk') {
          this.$message({
            showClose: true,
            message: '警告，此课程被代过课，不能操作！',
            type: 'warning'
          });
        } else if (row.status4 == '1') { // 判断是否在代课中
          this.$message({
            showClose: true,
            message: '警告，此课程正在审批，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.dsz4 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为单双周，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.hb4 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为合班，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.djs4 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为多教师，不能操作！',
            type: 'warning'
          });
          return;
        } else {
          this.yskrxx = '周' + row.col4 + '第' + row.row4 + '节' + row.class4 + this.form.yskr;
          this.pkkc = [row.row4, row.col4];
          this.tjTeachquest.dkkc = row.dkkc4;
          this.tjTeachquest.dkbj = row.dkbj4;
          this.tjTeachquest.dkzc = row.col4;
          this.tjTeachquest.dknj = row.dknj4;
          this.tjTeachquest.dkjc = row.row4;
          this.tjTeachquest.pkid = row.pkid4;
        }
      }
      if (weeklab == '五' && row.class5 != '') {
        if (row.spjl5 && row.spjl5.status == 'dk') {
          this.$message({
            showClose: true,
            message: '警告，此课程被代过课，不能操作！',
            type: 'warning'
          });
        } else if (row.status5 == '1') { // 判断是否在代课中
          this.$message({
            showClose: true,
            message: '警告，此课程正在审批，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.dsz5 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为单双周，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.hb5 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为合班，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.djs5 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为多教师，不能操作！',
            type: 'warning'
          });
          return;
        } else {
          this.yskrxx = '周' + row.col5 + '第' + row.row5 + '节' + row.class5 + this.form.yskr;
          this.pkkc = [row.row5, row.col5];
          this.tjTeachquest.dkkc = row.dkkc5;
          this.tjTeachquest.dkbj = row.dkbj5;
          this.tjTeachquest.dkzc = row.col5;
          this.tjTeachquest.dknj = row.dknj5;
          this.tjTeachquest.dkjc = row.row5;
          this.tjTeachquest.pkid = row.pkid5;
        }
      }
      if (weeklab == '六' && row.class6 != '') {
        if (row.spjl6 && row.spjl6.status == 'dk') {
          this.$message({
            showClose: true,
            message: '警告，此课程被代过课，不能操作！',
            type: 'warning'
          });
        } else if (row.status6 == '1') { // 判断是否在代课中
          this.$message({
            showClose: true,
            message: '警告，此课程正在审批，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.dsz6 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为单双周，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.hb6 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为合班，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.djs6 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为多教师，不能操作！',
            type: 'warning'
          });
          return;
        } else {
          this.yskrxx = '周' + row.col6 + '第' + row.row6 + '节' + row.class6 + this.form.yskr;
          this.pkkc = [row.row6, row.col6];
          this.tjTeachquest.dkkc = row.dkkc6;
          this.tjTeachquest.dkbj = row.dkbj6;
          this.tjTeachquest.dkzc = row.col6;
          this.tjTeachquest.dknj = row.dknj6;
          this.tjTeachquest.dkjc = row.row6;
          this.tjTeachquest.pkid = row.pkid6;
        }
      }
      if (weeklab == '日' && row.class7 != '') {
        if (row.spjl7 && row.spjl7.status == 'dk') {
          this.$message({
            showClose: true,
            message: '警告，此课程被代过课，不能操作！',
            type: 'warning'
          });
        } else if (row.status7 == '1') { // 判断是否在代课中
          this.$message({
            showClose: true,
            message: '警告，此课程正在审批，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.dsz7 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为单双周，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.hb7 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为合班，不能操作！',
            type: 'warning'
          });
          return;
        } else if (row.djs7 == true) { // 判断是否单双周
          this.$message({
            showClose: true,
            message: '警告，此课程为多教师，不能操作！',
            type: 'warning'
          });
          return;
        } else {
          this.yskrxx = '周' + row.col7 + '第' + row.row7 + '节' + row.class7 + this.form.yskr;
          this.pkkc = [row.row7, row.col7];
          this.tjTeachquest.dkkc = row.dkkc7;
          this.tjTeachquest.dkbj = row.dkbj7;
          this.tjTeachquest.dkzc = row.col7;
          this.tjTeachquest.dknj = row.dknj7;
          this.tjTeachquest.dkjc = row.row7;
          this.tjTeachquest.pkid = row.pkid7;
        }
      }

      this.gettjteach();
    },
    openBox() { // 查看推荐人
      this.tuijian = true
    }
  }
};
</script>


<style scoped lang="scss">

.detaLeft {
  width: 24%;
  float: left;
  margin: 10px;
  padding: 10px;
  height: 700px;
  border: 1px solid #eee;
}
.yskr{
  width: 100%;
}
.rightForm{
  float: left;
}
.el-checkbox__label{
  overflow: hidden !important;
  text-overflow:ellipsis !important;
  white-space: nowrap !important;
  width: 110px !important;
  line-height: 12px;
}
.detaRight {
  width: 70%;
  float: left;
  margin: 10px;
  padding: 10px;
  min-height: 800px;
  border: 1px solid #eee;
}
.el-tag {
  margin-right: 10px;
}

.dkr {
  width: 80%;
}
.checkClass {
  color: #449afc;
}
.el-date-picker{
  margin-top:-50px;
}

.el-input--suffix .el-input__inner{
    padding-right: 1px !important;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 220px;
    margin-top: -40px;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 184px !important;
  margin-top: 1px !important;
}

  .handelPass{
   padding:5px 4px;
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
  .el-table_1_column_1,.cell  {
    text-align: center !important;
  }
  .handel{
    margin:10px;
  }
  .tableMo{
    margin-top:40px;
  }
  .chooseweek{
    margin-left: 30px;
  }
  .shengpizhong{
    color:#E6A23C
  }
  .shengpitongguo{
    color:#67C23A
  }
</style>
