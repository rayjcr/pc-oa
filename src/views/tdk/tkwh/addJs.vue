<!-- 教师调课课表 -->
<!-- 教务人员调课课表 -->
<template>
  <div style="width:100%;">
    <div class="table-container">
        <div class="left_box">
          <!-- <h6>选择调课人</h6> -->
          <el-row style="min-width: 225px;margin: 10px 4px;" v-for="(item, index) in (tkmx.tkjlxxList.length?tkmx.tkjlxxList:tkRecord)" :key="index">
            <div class="f_ipt">
              <h6 style="margin-bottom:10px;display:inline-block;">调课人</h6>
              <el-input class="el_input1" label size="small" readonly v-model="item.strval" placeholder="请选择调课人课程"></el-input>
              <em class="el-icon-circle-close" @click.stop="clearfirst(index,item)"></em>
            </div>
            <!-- <div class="el-icon-sort"></div>  clearable clearable -->
            <div class="f_ipt">
              <h6 style="margin-bottom:10px;margin-top: 10px;display:inline-block;">被调课人</h6>
              <el-input class="el_input2" label size="small" readonly v-model="item.endval" placeholder="请选择被调课人课程"></el-input>
              <em class="el-icon-circle-close" @click.stop="clearsec(index, item)"></em>
            </div>
          </el-row>

          <div>
            <h6 style="margin-bottom:10px;display:inline-block;">结果预览</h6>
            <div style="border:#eee 1px solid;min-height: 100px;padding:10px;">
              <p v-if="tkmx.tkjlxxList.length">
                {{tkmx.tkjlxxList[0].strnjmc + tkmx.tkjlxxList[0].strbjmc + '教师' + tkmx.tkjlxxList[0].strname + tkmx.tkjlxxList[0].strzc + '周' + tkmx.tkjlxxList[0].startZc + '第' + tkmx.tkjlxxList[0].startJc + '节' + tkmx.tkjlxxList[0].strkcmc}}
              </p>
              <p v-if="tkmx.tkjlxxList.length && tkmx.tkjlxxList[0].endnjmc">
                {{ '和' + tkmx.tkjlxxList[0].endnjmc + tkmx.tkjlxxList[0].endbjmc + '教师' + tkmx.tkjlxxList[0].endname + tkmx.tkjlxxList[0].endzc + '周' + tkmx.tkjlxxList[0].endZc + '第' + tkmx.tkjlxxList[0].endJc + '节' + tkmx.tkjlxxList[0].endkcmc + '课进行了调课'}}
              </p>
            </div>
          </div>
          <el-row style="min-width: 225px;">
            <!-- margin: 10px 4px -->
            <h6 style="margin-bottom:10px;display:inline-block;">调课原因</h6>
            <el-input
              type="textarea"
              resize="none"
              :maxlength="50"
              :autosize="{ minRows: 5, maxRows: 5}"
              placeholder="请输入内容"
              v-model="tkmx.tkyy">
            </el-input>
          </el-row>
          <el-row class="f_box">
            <el-button type="primary" @click="onSubmit" :loading="isupdata">申请</el-button>
            <el-button @click="onCancle">取消</el-button>
          </el-row>
        </div>
        <div class="right_box">
          <el-row class="top_box">
            <el-date-picker
              :clearable=false
              ref="dates"
              @change = "change"
              v-model="value3"
              type="week"
              format="yyyy 第 WW 周"
              placeholder="选择周">
            </el-date-picker>
            <el-select v-model="state4" filterable placeholder="请选择"
                   @change="handleSelect"
                   clearable
                  >
              <el-option
                v-for="item in teacherList"
                :key="item.gh"
                :label="item.xm"
                :value="item.gh">
              </el-option>
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-select>
          </el-row>
          <!-- 课表主体beg -->
          <el-main class="g_content">
              <el-table
              v-loading="tabledata.tableheader.length?false:true"
              :data="tabledata.tabledata"
              border
              style="width: 100%"
              header-row-class-name="tableheader"
              :header-cell-style="tableHeaderColor"
              :cell-style="tablecell"
              >
              <!--v-if="tabledata.tableheader.length"-->
              <el-table-column
                align="center"
                :label= "tableTitle"
                >
                <el-table-column
                  align="center"
                  label="#"
                  width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="(item, index) in tabledata.tableheader"
                  :key="index"
                  align="center"
                  min-width="150"
                  :label="item.label">
                  <template slot-scope="scope">
                      <!-- border: isborder,  -->
                      <span
                      v-if="scope.row['xq'+ item.id].val === ''"
                      class="cell_box"
                      :class="{active: scope.row['xq'+ item.id].ischeck, canchoose: scope.row['xq'+ item.id].cancheck, tkz: (!scope.row['xq'+ item.id].cancheck&&!scope.row['xq'+ item.id].ischeck)}"
                      :style="{display: isblock, padding: ispadding, height: isheight,lineHeight: '40px'}"
                      size="medium"
                      type=""
                      @click="CourseSelection('xq'+ item.id, scope.row['xq'+ item.id])">{{scope.row['xq'+ item.id].val}}</span>
                    <el-popover trigger="hover" placement="top" v-if="scope.row['xq'+ item.id].val !== ''" class="cell_box">
                      <div style="width: 100px">{{scope.row['xq'+ item.id].val}}</div>
                      <span
                      slot="reference"
                      class="cell_box"
                      :class="{active: scope.row['xq'+ item.id].ischeck, canchoose: scope.row['xq'+ item.id].cancheck, tkz: (!scope.row['xq'+ item.id].cancheck&&!scope.row['xq'+ item.id].ischeck)}"
                      :style="{display: isblock, padding: ispadding, height: isheight,lineHeight: '40px'}"
                      size="medium"
                      type=""
                      @click="CourseSelection('xq'+ item.id, scope.row['xq'+ item.id])">{{scope.row['xq'+ item.id].val.length>8?scope.row['xq'+ item.id].val.substring(0,8)+'...':scope.row['xq'+ item.id].val}}</span>
                    </el-popover>
                    <!-- border: isborder, -->
                      <!-- {{scope.row['xq'+ item.id].bjmc?scope.row['xq'+ item.id].bjmc:''}} {{scope.row['xq'+ item.id].kcmc?scope.row['xq'+ item.id].kcmc:''}}<span v-if="(scope.row['xq'+ item.id].ishb === '1' || scope.row['xq'+ item.id].isdsz !== '0' || scope.row['xq'+ item.id].isdjs !== '0') && scope.row['xq'+ item.id].kcmc !== ''">{{bqsj(scope.row['xq'+ item.id].isdjs, scope.row['xq'+ item.id].isdsz, scope.row['xq'+ item.id].ishb)}}</span> -->
                  </template>
                  <!-- {{scope.row.bjmc}} -->
                </el-table-column>
              </el-table-column>
            </el-table>

          </el-main>
          <!-- 课表主体end -->
        </div>
    </div>


  </div>
</template>
<script>
  import * as api from '@/api/tdk/tkxx/addJw'
  import stastic from '@/api/jcsj'
  import { Getbjlist } from '@/api/admin/class'
  // import TeacherTable from './component/TeacherTable'
  export default {
    components: {
      // TeacherTable
    },
    data() {
      return {
        tkRecord: [
          { strval: '', endval: '' }
        ],
        isupdata: false, // 提交按钮动态状态
        isblock: 'block',
        isborder: '1px solid #eee',
        ispadding: 5 + 'px',
        isheight: 50 + 'px',
        tabledata: { // 数据表
          tableheader: [], // 表格头
          tabledata: [], // 表格数据
          totalNum: 0, // 总节数
          tableZc: '' // 课程表所在周次
        },
        tabledata2: { // 调课人所选被调课人表格数据暂存
          tableheader: [],
          tabledata: [],
          totalNum: 0,
          tableZc: ''
        },
        value3: '', // 周选择绑定值
        xxdm: window.localStorage.getItem('xxdm'), // 学校代码
        nowdate: '', // 当前时间
        zgh: '', // 职工号
        username: window.localStorage.getItem('username'), // 用户账号 （zgh = username去掉学校代码部分的字符串）
        state4: '', // 搜索教师姓名
        kclist: [], // 全部课程

        jskbsj: [], // 教师课程表数据
        tkjskbsj: [], // 调课教师数据暂存用于比对被调课人所在周次课表数据
        btkrkbsj: [], // 被调课人课表数据

        bjlist: [], // 全部班级列表数据
        tableTitle: window.localStorage.getItem('name') + '的课表', // 课表标题
        usernames: window.localStorage.getItem('name'), // 用户名
        tkmx: { // 提交申请数据
          mbid: '', // 审核流程模板id
          pkid: '', // 排课id
          shzt: '1',            // 审核状态：默认1审核中
          tkyy: '',   // 调课原因
          tkjlxxList: [], // 调课信息暂存
          tkmx: '' // 调课明细
        },
        zc: '', // 周次（即第几周）
        jc: '', // 节次（即第几节）
        xq: '', // 星期几
        isnew: true, // 是否push新对象进入
        tkyy: '', // 调课原因
        teacherList: [], // 班级教师列表
        allteacherlist: [], // 全部教师列表
        listquery: {
          dqz: '', // 当前教师要调课的周次
          mbz: '' // 调课目标周次
        },
        kbgs: {}, // 课表格式
        njlist: [], // 年级列表
        canchange: true, // 是否可与人调课
        tkzsj: [], // 调课中数据
        isended: false, // 是否选择了被调课人
        usercode: '', // 当前用户代码
        mbid: ''
      }
    },
    mounted() {
      this.value3 = new Date()
      const t = this.xxdm.length // 获取学校代码长度
      this.zgh = this.username.substring(t) // 获取职工号
      this.usercode = JSON.parse(JSON.stringify(this.zgh)) // 获取usercode
      this.init() // 调用初始化
    },
    methods: {
      getIsMbxx() {
        api.validaSplc({ xxdm: this.xxdm }).then(res => {
          if (res.status === 200) {
            this.mbid = res.data;
            this.tkmx.mbid = this.mbid;
          } else {
            this.$message.error('操作失败，请联系管理员！');
          }
        })
      },
      // 修改单元格样式
      tablecell({ row, column, rowIndex, columnIndex }) {
        return 'padding: 5px 0px;'
      },
      // 修改table header的背景色
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0 || rowIndex === 1) {
          return 'background-color: #ddd;color: #666;font-size:15px;font-weight:400;'
          // font-weight: 500;
        }
      },
      // 初次加载数据部分
      async init() {
        stastic.remove(stastic.BJ_KEY);
        stastic.remove(stastic.NJ_KEY);
        stastic.remove(stastic.KC_KEY);
        stastic.remove(stastic.JS_KEY);
        stastic.remove(stastic.DQXN_KEY);
        const that = this
        const obj = await this.getxnxq() // 获取学年学期
        this.listquery.dqz = await this.getweek() // 获取当前周次
        this.njlist = await this.getbjlb(this.xxdm, obj.xn) // 年级列表
        this.zc = '第' + this.listquery.dqz.substr(5) + '周'
        this.allteacherlist = await stastic.hqjslb({ xxdm: this.xxdm }); // 全部教师列表
        await this.getkcxx() // 获取课程信息
        this.tkzsj = await this.getApproval({ zgh: this.zgh, schoolCode: this.xxdm, time: this.listquery.dqz })// 获取调课中数据用于比对处理是否有在审批流程中的课程，有则添加相应状态，并该课程不可选做再次调课课程
        this.jskbsj = await this.getteachertable({ zgh: this.zgh, xxdm: this.xxdm, time: this.listquery.dqz }) // 获取到教师课表数据
        // 根据流程中数据判断数据是否要添加不可选状态
        if (this.tkzsj.length) {
          console.log(this.tkzsj)
          console.log('还是走这里？')
          // 为课表添加可选/不可选状态
          this.jskbsj.forEach(el => {
            console.log('我是教师课表数据单独项')
            console.log(el)
            const abs = _.find(this.tkzsj, item => el.pkWeek === item.startDate && el.pkzs === JSON.parse(item.startZc) && el.pkjs === JSON.parse(item.startJc))
            console.log('我是具有相同项的数据')
            console.log(abs)
            if (abs === undefined) {
              console.log('不应该进来的')
              // el.tkz = false
              // el.cancheck = (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')?false:true
              // el.iscan = (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')?false:true
              // el.ischeck = false
              if (!el.spjl || (el.spjl && el.spjl.status === 'tk')) {
                if (el.ishb && el.isdsz && el.isdjs) {
                  if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                    el.tkz = false
                    el.cancheck = false
                    el.iscan = false
                    el.ischeck = false
                  } else {
                    el.tkz = false
                    el.cancheck = true
                    el.iscan = true
                    el.ischeck = false
                  }
                } else {
                  el.tkz = false
                  el.cancheck = true
                  el.iscan = true
                  el.ischeck = false
                }
              } else if (el.spjl && el.spjl.status === 'dk') {
                console.log('我被待客了')
                // console.log(el)
                el.tkz = false
                el.cancheck = true
                el.iscan = true
                el.ischeck = false
              }
            } else {
              console.log('进入此处')
              el.tkz = true
              el.cancheck = false
              el.iscan = false
              el.ischeck = false
            }
            // this.existence(this.tkzsj, el, 'init')
          })
        } else {
          console.log('走这里？')
          // 当不存在流程中数据时执行添加可选状态和不可选状态
          this.jskbsj.forEach(el => {
            if (!el.spjl || (el.spjl && el.spjl.status === 'tk')) {
              if (el.ishb && el.isdsz && el.isdjs) {
                if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                  el.tkz = false
                  el.cancheck = false
                  el.iscan = false
                  el.ischeck = false
                } else {
                  el.tkz = false
                  el.cancheck = true
                  el.iscan = true
                  el.ischeck = false
                }
              } else {
                el.tkz = false
                el.cancheck = true
                el.iscan = true
                el.ischeck = false
              }
            } else if (el.spjl && el.spjl.status === 'dk') {
              console.log('我被待客了')
              console.log(el)
              el.tkz = false
              el.cancheck = true
              el.iscan = true
              el.ischeck = false
            }
          })
        }
        // 获取班级信息
        await this.getclasslist(this.xxdm, obj.xn)
        setTimeout(() => {
          // this.getClassSchedule()
          this.tabledata = this.getClassSchedule() // 表格数据赋值
        }, 1000)
      },
      // 返回单双周，合班，多教师
      bqsj(val1, val2, val3) {
        let text = ''
        text = (val1 === '0' ? '' : '多') + (val2 === '0' ? '' : val2 === '1' ? '单' : '双') + (val3 === '0' ? '' : '合')
        return text
      },
      /**
       * @description: 调课人记录框清除
       * @param {item} (item)为数据源包含数基本信息用于课表结构单元格状态调整
       * @return:
       */
      clearfirst(index, datas) {
        if (datas.strval !== '') {
          this.usernames = window.localStorage.getItem('name')
          this.tableTitle = window.localStorage.getItem('name') + '的课表' // 课表标题
          const t = this.xxdm.length // 获取学校代码长度
          this.zgh = this.username.substring(t) // 获取职工号
          this.usercode = JSON.parse(JSON.stringify(this.zgh)) // 获取usercode
          this.tabledata.tableheader = []
          this.isnew = true
          this.jc = ''
          this.xq = ''
          this.tkmx.pkid = ''
          this.tkmx.tkyy = ''
          this.tkmx.tkmx = ''
          this.tkmx.tkjlxxList = []
          this.state4 = ''
          this.teacherList = []
          this.init()
        } else {
          this.$notify({ title: '提示', message: '请先选择调课人课程！', type: 'error', duration: 2000 })
        }
      },
      /**
       * @description: 被调课人框清除
       * @param {item} (item)用于被调课人数据课表单元格状态扭转，调整被调课人勾选课程状态
       * @return:
       */
      clearsec(index, datas) {
        if (datas.endval !== '') {
          this.isnew = false
          this.tkmx.tkjlxxList.forEach(el => {
            el.endval = ''
            el.endzc = ''
            el.endZc = ''
            el.endJc = ''
            el.endname = ''
            el.endkcmc = ''
            el.endkcxx = ''
            el.endKc = ''
            el.endTkr = ''
            el.endnjdm = ''
            el.endnjmc = ''
            el.endbjmc = ''
            el.index = ''
            el.endDate = ''
            el.endxq = ''
            el.endischeck = false
            this.$set(el, 'ended', '')
          })
          this.handleSelect(this.zgh)
        } else {
          this.$notify({ title: '提示', message: '请先选择被调课人课程！', type: 'error', duration: 2000 })
        }
      },
      // 获取审批中教师课表(根据职工号，学校代码，周数)
      async getApproval(params) {
        let table = null
        await api.getApprovaltable(params).then(data => {
          console.log('审批中')
          console.log(data)
          table = data.data
        })
        // 返回审批中教师数据
        return table
      },
      // 获取课程信息用于处理课程名称
      getkcxx() {
        stastic.hqkclb({ xxdm: this.xxdm }).then(data => {
          this.kclist = data // 所有课程
        })
      },
      // 获取学年学期
      getxnxq() {
        const that = this
        const obj = {
          xn: '',
          xq: '',
          xqmc: ''
        }
        stastic.hqdqxnxq({ xxdm: this.xxdm }).then(data => {
          if (data.status === 200 && data.data) {
            obj.xn = data.data.xn
            obj.xq = data.data.xq
            obj.xqmc = data.data.xqmc
          }
        })
        return obj // 返回学年学期信息
      },
      // 根据时间，班级代码，学校代码获取班级教师
      getteacherlist(schoolCode, classCode, time) {
        const params = {
          schoolCode,
          classCode,
          time
        }
        const that = this
        api.getTeacherlist(params).then(data => {
          data.data.forEach(el => {
            that.allteacherlist.forEach(item => {
              if (el === item.gh && el !== that.zgh) {
                that.teacherList.push(item) // 所选调课班级具有的教师
              }
            })
          })
        })
      },
      // 获取年级列表并返回
      async getbjlb(xxdm, xn) {
        let bjlb = []
        await stastic.hqnjlb({ xxdm, xn }).then(data => {
          bjlb = data
        })
        return bjlb
      },
      // 获取班级
      getclasslist(xxdm, xn) {
        if (xn !== '') {
          Getbjlist({ xxdm, xn }).then(data => {
            this.bjlist = data
          })
        } else {
          console.log('error')
        }
      },
      /**
       * @description: 返回星期汉字
       * @param {type}
       * @return:
       */
      gethanzi(el) {
        // console.log(el)
        let hz = ''
        switch (el) {
          case '1': hz = '一';
            break;
          case '2': hz = '二';
            break;
          case '3': hz = '三';
            break;
          case '4': hz = '四';
            break;
          case '5': hz = '五';
            break;
          case '6': hz = '六';
            break;
          case '7': hz = '日';
            break;
          default:
            break;
        }
        return hz
      },
      // 获取课程表数据格式并处理为标准课表结构返回课表数据及表头数据
      getClassSchedule() {
        const tabledata = {
          tabledata: [],
          tableheader: [],
          totalNum: 0
        }
        api.getClassStructure({ xxdm: this.xxdm }).then(data => {
          const that = this
          data.totalcurriculum = data.swjs + data.wsjs + data.xwjs
          // 将排课周数处理为数组格式
          data.pkzsarr = data.pkzs.split(',')
          // 课表一天课程数量（即总节数）
          tabledata.totalNum = data.totalcurriculum
          // 课表格式数据赋值
          this.kbgs = data
          // 生成课表所需格式
          for (let i = 0; i < data.totalcurriculum; i++) {
            // 生成标准课表结构
            tabledata.tabledata.push({})
          }
           // 根据一周数据生成对应星期几的数据
          data.pkzsarr.forEach((el, elindex) => {
            // 表格头
            tabledata.tableheader.push({ label: '星期' + this.gethanzi(el), id: el })
             // 生成课表可用数据
            tabledata.tabledata.forEach((item, index) => {
              item['xq' + el] = {
                js: index + 1, // 排课节数
                zs: JSON.parse(el), // 排课周数
                isdjs: '', // 是否多教师
                isdsz: '', // 是否单双周
                ishb: '', // 是否合班
                sfkt: 0, // 状态判定值
                ischeck: false, // 是否已勾选
                ischecked: false, // 是否已被选择
                cancheck: false, // 单元格内课程是否可选
                iscan: false, // 标记可选不可选课程
                tkz: false, // 是否为调课中课程
                kcmc: '', // 课程名称
                bjmc: '', // 班级名称
                njmc: '', // 年级名称
                spjl: {}, // 审批记录
                bjdm: '', // 班级代码
                kcdm: '', // 课程代码
                njdm: '', // 年级代码
                val: '', // 课表单元格显示数据
                pkid: '' // 排课id
              }
            })
            // 课表所需数据处理
            // console.log('是这里')
            tabledata.tabledata.forEach((els, elsindex) => {
              this.jskbsj.forEach(info => { //
                if (els['xq' + el].js === info.pkjs && els['xq' + el].zs === info.pkzs) { // el.iscan
                  els['xq' + el].bjdm = info.bjdm
                  els['xq' + el].pkid = info.pkid
                  els['xq' + el].iscan = info.iscan
                  els['xq' + el].cancheck = info.cancheck
                  els['xq' + el].njdm = info.njdm
                  els['xq' + el].ischeck = info.ischeck
                  els['xq' + el].kcdm = info.kcdm
                  els['xq' + el].isdjs = info.isdjs
                  els['xq' + el].isdsz = info.isdsz
                  els['xq' + el].ishb = info.ishb
                  els['xq' + el].tkz = info.tkz
                  els['xq' + el].val = this.getval(info)
                  // (info.ishb === '1'?(stastic.hqbjmcByid(this.bjlist, info.bjdm) + ',' + stastic.hqbjmcByid(this.bjlist, info.hbbj)):stastic.hqbjmcByid(this.bjlist, info.bjdm)) + stastic.hqkcmcByid(this.kclist, info.kcdm) + (info.isdsz === '0'?'':(info.isdsz === 1?',单周':',双周'))
                  els['xq' + el].njmc = stastic.hqnjmcByid(this.njlist, info.njdm)
                  els['xq' + el].kcmc = stastic.hqkcmcByid(this.kclist, info.kcdm)
                  els['xq' + el].bjmc = stastic.hqbjmcByid(this.bjlist, info.bjdm)
                  els['xq' + el].spjl = info.spjl ? info.spjl : null // 审批记录
                }
              })
            })
          });
        })
        return tabledata
      },
      // 返回课表单元格显示信息
      getval(info) {
        let val = ''
        // 当不存在审批记录时进入流程
        if (!info.spjl) {
          // 当是合班数据时
          if (info.ishb === '1') {
            info.hbbjarr = info.hbbj.split(',')
            info.hbbjarr.forEach((el, index) => {
              val += stastic.hqbjmcByid(this.bjlist, el) + ','
            })
            val += stastic.hqkcmcByid(this.kclist, info.kcdm)
          } else { // 不是合班数据时
            val += stastic.hqbjmcByid(this.bjlist, info.bjdm) + ',' + stastic.hqkcmcByid(this.kclist, info.kcdm)
          }
        } else { // 当存在审批记录时进入该流程
          // 当记录为调课时
          if (info.spjl.status === 'tk') {
            if (info.ishb === '1') { // 合班数据
              info.hbbjarr = info.hbbj.split(',')
              info.hbbjarr.forEach((el, index) => {
                val += stastic.hqbjmcByid(this.bjlist, el) + ','
              })
              val += stastic.hqkcmcByid(this.kclist, info.kcdm) + '调课'
            } else { // 不是合班数据时
              val += stastic.hqbjmcByid(this.bjlist, info.bjdm) + ',' + stastic.hqkcmcByid(this.kclist, info.kcdm) + '调课'
            }
          } else if (info.spjl.status === 'dk') { // 当记录为代课时
            val = stastic.hqbjmcByid(this.bjlist, info.bjdm) + ',' + stastic.hqkcmcByid(this.kclist, info.kcdm) + '代课'
          }
        }
        // var val = ''
        // if (!info.spjl) {
        //   val = (info.ishb === '1'?(stastic.hqbjmcByid(this.bjlist, info.bjdm) + ',' + stastic.hqbjmcByid(this.bjlist, info.hbbj)):stastic.hqbjmcByid(this.bjlist, info.bjdm)) + stastic.hqkcmcByid(this.kclist, info.kcdm) + (info.isdsz === '0'?'':(info.isdsz === 1?',单周':',双周'))
        // } else {
        //   if (info.spjl.status === 'tk') {
        //     val = (info.ishb === '1'?(stastic.hqbjmcByid(this.bjlist, info.bjdm) + ',' + stastic.hqbjmcByid(this.bjlist, info.hbbj)):stastic.hqbjmcByid(this.bjlist, info.bjdm)) + stastic.hqkcmcByid(this.kclist, info.kcdm) + (info.isdsz === '0'?'':(info.isdsz === 1?',单周':',双周'))
        //   } else if (info.spjl.status === 'dk') {
        //     val = stastic.hqbjmcByid(this.bjlist, info.bjdm) + stastic.hqkcmcByid(this.kclist, info.kcdm)
        //   }
        // }
        return val + (info.isdsz ? info.isdsz === '0' ? '' : info.isdsz === 1 ? ',单周' : ',双周' : '')
      },
      // 获取所需周次并返回结构数据
      getweek() {
        let week = ''
        let weeks = this.$refs.dates.displayValue.replace(' 第 ', '-')
        weeks = weeks.replace(' 周', '')
        week = weeks.replace('-0', '-')
        return week
      },
      // 选择周次
      async change(val) {
        // 年份周次所需格式 （2019-5||2019-10）
        const time = new Date(val).getTime()
        const times = new Date().getTime()
        if (times <= time || (times - time < 517952000)) {
          this.jskbsj = [] // 清空教师可表数据
          this.listquery.dqz = this.getweek()
          this.zc = '第' + this.listquery.dqz.substr(5) + '周'
          // 定义变量数据用于请求
          const params = {
            zgh: this.zgh,
            xxdm: this.xxdm,
            time: this.listquery.dqz
          }
          this.tkzsj = await this.getApproval({ zgh: this.zgh, schoolCode: this.xxdm, time: this.listquery.dqz })
           // 当前所获取教师数据
          this.jskbsj = await this.getteachertable(params)
           // 当切换周次时存在搜索人员进入该流程
          if (this.state4 !== '') {
            // 获取被调课人课表数据
            this.btkrkbsj = await this.getteachertable({ zgh: this.zgh, xxdm: this.xxdm, time: this.tkmx.tkjlxxList[0].startDate })
            this.tkjskbsj = await this.getteachertable({ zgh: this.tkmx.tkjlxxList[0].startTkr, xxdm: this.xxdm, time: this.listquery.dqz })

            const that = this
            const kyjh = _.find(this.btkrkbsj, el => el.pkzs === that.tkmx.tkjlxxList[0].startZc && el.pkjs === that.tkmx.tkjlxxList[0].startJc);
            // 当切换周次存在课程冲突时进入该流程
            if (kyjh && kyjh.bjdm) {
               // 如果选择的教师不是自己时进入该流程
              if (this.zgh !== this.tkmx.tkjlxxList[0].startTkr) {
                this.canchange = false
                this.jskbsj.forEach(els => {
                  els.cancheck = false
                  els.iscan = false
                  els.ischeck = false
                })
                this.$notify({ title: '提示', message: '该教师在您所选课程区已存在课程无法与您进行调课！', type: 'error', duration: 2000 })
              } else {
                // 如果选择的教师是自己进入该流程
                if (this.listquery.dqz === this.tkmx.tkjlxxList[0].startDate) {
                  this.jskbsj.forEach(el => {
                    const abs = _.find(this.tkzsj, item =>  // 切换日期为调课人时进行已选择状态添加及可选不可选状态添加
                     el.pkWeek === item.startDate && el.pkzs === JSON.parse(item.startZc) && el.pkjs === JSON.parse(item.startJc))
                    if (abs === undefined) {
                      el.tkz = false
                      el.cancheck = false
                      el.iscan = !(el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')
                      el.ischeck = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)
                    } else {
                      el.tkz = true
                      el.cancheck = false
                      el.iscan = false
                      el.ischeck = false
                    }
                    // this.existence(this.tkzsj, el, 'changeself')
                  })
                } else {
                  this.jskbsj.forEach(el => {
                    el.tkz = false
                    el.cancheck = false
                    el.iscan = false
                    el.ischeck = false
                  })
                }
              }
            } else { // 如果不存在冲突进入该流程进行判断
              this.canchange = true
              // 当选择周次时当前职工号为被调课人时进入该流程
              if (this.tkmx.tkjlxxList[0].endTkr !== '') {
                if (this.zgh === this.tkmx.tkjlxxList[0].endTkr) {
                  console.log('bbbbbbbbbb')
                  // 调课教师与被调课教师课表数据比较进入该流程
                  this.jskbsj.forEach(els => {
                    const sbd = _.find(this.tkjskbsj, el => (el.pkzs === els.pkzs && el.pkjs === els.pkjs && els.bjdm === that.tkmx.tkjlxxList[0].tkbjdm) || (els.bjdm !== that.tkmx.tkjlxxList[0].tkbjdm && el.pkjs && el.pkzs))
                    if (sbd === undefined) {
                      els.cancheck = this.tkmx.tkjlxxList[0].ended !== '' ? false : !(els.spjl && els.spjl.status === 'dk')
                      els.iscan = true
                      els.ischeck = !!(els.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].endZc) && els.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].endJc) && this.tkmx.tkjlxxList[0].endDate === this.listquery.dqz)
                    } else {
                      els.cancheck = false
                      els.iscan = false
                      els.ischeck = false
                    }
                  })
                  // 比较是否存在已在审批流中数据，存在添加不可选状态
                  this.jskbsj.forEach(el => {
                    const abs = _.find(this.tkzsj, item => el.pkWeek === item.startDate && el.pkzs === JSON.parse(item.startZc) && el.pkjs === JSON.parse(item.startJc))
                    if (abs) {
                      el.tkz = true
                      el.cancheck = false
                      el.iscan = false
                      el.ischeck = false
                    }
                  })
                } else if (this.zgh === this.tkmx.tkjlxxList[0].startTkr) { // 当当前职工号为调课人员时进入当前流程、进行添加状态
                  console.log('mmmmmm')
                  this.jskbsj.forEach(el => {
                    const abs = _.find(this.tkzsj, item => el.pkWeek === item.startDate && el.pkzs === JSON.parse(item.startZc) && el.pkjs === JSON.parse(item.startJc))
                    if (abs === undefined) {
                      el.tkz = false
                      el.cancheck = el.spjl && el.spjl.status === 'dk' ? false : !(el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')
                      // (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')?false:true
                      el.iscan = el.spjl && el.spjl.status === 'dk' ? false : !(el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')
                      // (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')?false:true
                      el.ischeck = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)
                    } else {
                      el.tkz = true
                      el.cancheck = false
                      el.iscan = false
                      el.ischeck = false
                    }
                    // this.existence(this.tkzsj, el, 'changedate')
                  })
                } else { // 当都不是时进入该流程当前人员课程为不可选
                  this.jskbsj.forEach(el => {
                    el.tkz = false
                    el.cancheck = false
                    el.iscan = false
                    el.ischeck = false
                  })
                }
              } else {
                this.isended = true
                this.jskbsj.forEach(el => { // 调课教师课表数据与被条科教师课表数据比对
                  const sbs = _.find(this.tkjskbsj, els => el.pkzs === els.pkzs && el.pkjs === els.pkjs // ||(els.bjdm === that.tkmx.tkjlxxList[0].tkbjdm && els.pkjs && els.pkzs)   && el.bjdm === that.tkmx.tkjlxxList[0].tkbjdm
                )
                  console.log(sbs)
                  if (sbs === undefined) {
                    el.ischeck = false
                    el.cancheck = el.spjl && el.spjl.status === 'dk' ? false : el.bjdm === that.tkmx.tkjlxxList[0].tkbjdm
                    // (el.bjdm === that.tkmx.tkjlxxList[0].tkbjdm)?true:false
                    el.iscan = el.bjdm === that.tkmx.tkjlxxList[0].tkbjdm
                  } else {
                    el.ischeck = false
                    el.cancheck = false
                    el.iscan = false
                  }
                })
              }
            }
          } else {
            // 不存在选课数据时
            if (!this.tkmx.tkjlxxList.length) {
              if (this.tkzsj.length) {
                this.jskbsj.forEach(el => {
                  // 判断是否具有流程中数据当有流程中数据时，添加流程中数据为不可选状态否则进一步判断进行状态的添加
                  const abs = _.find(this.tkzsj, item => el.pkWeek === item.startDate && el.pkzs === JSON.parse(item.startZc) && el.pkjs === JSON.parse(item.startJc))
                  if (abs === undefined) {
                    el.tkz = false
                    el.iscan = !(el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')
                    // (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')?false:true   (el.spjl && el.spjl.status === 'dk')?false:((el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')?false:true)
                    el.cancheck = !(el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')
                    // (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')?false:true
                    el.ischeck = false
                  } else {
                    el.tkz = true
                    el.cancheck = false
                    el.iscan = false
                    el.ischeck = false
                  }
                  // this.existence(this.tkzsj, el, 'init')
                })
              } else {
                // 存在选课数据时添加相应状态用于判断可选与否
                this.jskbsj.forEach(el => {
                  // if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                  //   el.tkz = false
                  //   el.cancheck = false
                  //   el.iscan = false
                  //   el.ischeck = false
                  // } else {
                  //   el.tkz = false
                  //   el.cancheck = true
                  //   el.iscan = true
                  //   el.ischeck = false
                  // }

                  if (!el.spjl || (el.spjl && el.spjl.status === 'tk')) {
                    if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                      el.tkz = false
                      el.cancheck = false
                      el.iscan = false
                      el.ischeck = false
                    } else {
                      el.tkz = false
                      el.cancheck = true
                      el.iscan = true
                      el.ischeck = false
                    }
                  } else if (el.spjl && el.spjl.status === 'dk') {
                    el.tkz = false
                    el.cancheck = true
                    el.iscan = true
                    el.ischeck = false
                  }
                })
              }
            } else {
              this.jskbsj.forEach(el => {
                // if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                //   el.tkz = false
                //   el.cancheck = false
                //   el.iscan = false
                //   el.ischeck = false
                // } else {
                //   el.tkz = false
                //   el.cancheck = false
                //   el.iscan = false
                //   el.ischeck = (el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)?true:false
                // }
                if (!el.spjl || (el.spjl && el.spjl.status === 'tk')) {
                  if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                    el.tkz = false
                    el.cancheck = false
                    el.iscan = false
                    el.ischeck = false
                  } else {
                    el.tkz = false
                    el.cancheck = false
                    el.iscan = false
                    el.ischeck = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)
                  }
                } else if (el.spjl && el.spjl.status === 'dk') {
                  el.tkz = false
                  el.cancheck = true
                  el.iscan = true
                  el.ischeck = false
                }
              })
            }
          }
          this.tabledata = await this.getClassSchedule()
        } else {
          this.$notify({ title: '提示', message: '请勿选择当前日期之前的课表！', type: 'error', duration: 1000 })
        }
      },
      /**
       * @description: 针对教师课表出现的课表数据不统一字段统一处理返回true/false
       * @param {type}
       * @return:
       */
      // 获取教师课表数据并返回（参数： xxdm, zgh, 周次（time））
      async getteachertable(params) {
        // var that = this
        let table = []
        await api.GetTeachertable(params).then(data => {
          if (data.status === 200) {
            console.log('教师课表数据')
            console.log(data)
            table = data.data
          } else {
            table = []
            this.$notify({ title: '提示', message: '未获取到相关数据！', type: 'error', duration: 1000 })
          }
        })
        return table // 返回教师课表数据
      },

      // 选择要调的课程
      CourseSelection(indexs, datas) {
        console.log(indexs)
        console.log(datas)
        // 判断当前选中课程是否具有数据若有进入内部流程，若无跳出进入下个流程即该单元格不可选
        if (datas.kcdm) {
          if (datas.tkz || (!datas.cancheck && !datas.ischeck)) { // 当所选课程为流程中课程时或者全部不可选并且不存在已选中项目进入否则进入下一流程即为状态为可选流程
            this.$notify({ title: '提示', message: '该课程不可调课！', type: 'error', duration: 2000 })
            this.tkmx.pkid = '' // 清空调课明细排课id
          } else { // 课程状态为可选进入该流程
            datas.ischeck = !datas.ischeck // 扭转单元格课程选中状态
            // datas.cancheck = false
            const that = this
            if (datas.ischeck) { // 当点击状态为true时进入该流程
              this.jc = '第' + datas.js + '节' // 拼接第几节课程字符串
              this.xq = '星期' + datas.zs // 拼接星期几
              this.tkmx.pkid = datas.pkid // 添加排课id
              if (this.isnew) { // 判断是否为新建，若为新建进入流程
                that.teacherList = [] // 清空班级教师列表
                if (!that.tkmx.tkjlxxList.length) { // 当左侧边栏不存在选择调课记录时进入该流程，开始创建流程记录
                  if (that.state4 === '' || this.zgh === this.usercode) { // 判断是否为搜索教师课表或者当前登陆人职工号是否一致
                    that.tkmx.tkjlxxList.push({
                      xh: '0',         // 调课记录序号
                      tkbjdm: datas.bjdm, // 调课班级代码
                      startKc: datas.kcdm, // 调课人课程代码
                      startTkr: that.zgh, // 调课人职工号
                      strischeck: datas.ischeck,
                      strkcxx: datas, // 调课课程全部课程信息
                      strzc: that.zc, // 调课人选择的课程的周次
                      startZc: datas.zs, // 调课人选择的课程在星期几
                      startJc: datas.js, // 调课人选择的课程在第几节
                      strname: that.usernames, // 调课人姓名
                      strkcmc: datas.kcmc, // 调课课程名称
                      strnjdm: datas.njdm, // 调课人年级代码
                      strnjmc: datas.njmc, // 调课人年级名称
                      strbjmc: datas.bjmc, // 调课人班级名称
                      strxq: indexs, // 星期几对象
                      strval: that.zc + '星期' + datas.zs + '第' + datas.js + '节' + that.usernames + datas.kcmc,
                      startDate: that.listquery.dqz, // 调课人要调课在第几周
                      strded: 'y', // 新建一条数组元素标志
                      endzc: '', // 被调课人被调课的周次
                      endZc: '', // 被调课人课程所在星期几
                      endJc: '', // 被调课人课程节次
                      endname: '', // 被调课人姓名
                      endkcmc: '', // 被调课程名称
                      endKc: '',  // 被调课程代码
                      endnjdm: '', // 被调课年级代码
                      endnjmc: '', // 被调课年级名称
                      endbjmc: '', // 被调课班级名称
                      endTkr: '', // 被调课人职工号
                      endkcxx: {}, // 被调课程信息
                      endxq: '', // 星期几对象
                      endischeck: false,
                      endval: '',
                      ended: '', // 被调课人选择结束标志
                      endDate: '' // 被调课人被调课在第几周
                    })
                    that.getteacherlist(that.xxdm, datas.bjdm, that.listquery.dqz) // 获取所在班级教师数据
                    that.isnew = false
                  } else { // 当未选择调课人员课程时给出提示应该先选择调课人课程
                    this.$notify({ title: '提示', message: '请先选择调课人课程！', type: 'error', duration: 1000 })
                  }
                }
              } else { // 当选择被调课人课程时进入该流程
                if (that.state4 !== '') { // 当教师搜索栏不为空时进入该流程
                  that.tkmx.tkjlxxList.forEach((el, index) => {
                    if (el.strded === 'y' && el.ended === '' && el.strname !== that.usernames && datas.bjdm === el.tkbjdm) { // 判断流程中数据的结束是否已经存在以及当前课表人员是否是调课人自己的课表以及班级是否相同 && el.strzc !== that.zc && el.str.xq !== that.xq && el.strjc !== that.jc
                      el.endval = that.zc + '星期' + datas.zs + '第' + datas.js + '节' + that.usernames + datas.kcmc,
                      el.endzc = that.zc
                      el.endZc = datas.zs
                      el.endJc = datas.js
                      el.endname = that.usernames
                      el.endkcmc = datas.kcmc
                      el.endkcxx = datas
                      el.endKc = datas.kcdm
                      el.endTkr = that.zgh
                      el.endnjdm = datas.njdm
                      el.endnjmc = datas.njmc
                      el.endbjmc = datas.bjmc
                      el.index = index
                      el.endxq = indexs
                      el.endischeck = datas.ischeck
                      el.endDate = that.listquery.dqz
                      // el.ended = 'y'
                      that.$set(el, 'ended', 'y')
                    } else {
                      datas.ischeck = false
                      this.$notify({ title: '提示', message: '请选择相同班级！', type: 'error', duration: 1000 })
                    }
                  })
                  var arr = JSON.parse(JSON.stringify(that.tkmx.tkjlxxList))
                  that.tkmx.tkjlxxList = arr
                  that.isnew = true
                } else if (that.tkmx.tkjlxxList.length && that.state4 === '') {
                  if (that.tkmx.tkjlxxList[0].tkbjdm) {
                    this.$notify({ title: '提示', message: '不可自己进行调课', type: 'error', duration: 1000 })
                  } else {
                    that.tkmx.tkjlxxList.forEach(el => {
                      el.strval = that.zc + '星期' + datas.zs + '第' + datas.js + '节' + that.usernames + datas.kcmc,
                      el.startKc = datas.kcdm // 调课人课程代码
                      el.startTkr = that.zgh // 调课人职工号
                      el.strkcxx = datas // 调课课程全部课程信息
                      el.strzc = that.zc // 调课人选择的课程的周次
                      el.startZc = datas.zs // 调课人选择的课程在星期几
                      el.startJc = datas.js // 调课人选择的课程在第几节
                      el.strname = that.usernames, // 调课人姓名
                      el.strkcmc = datas.kcmc // 调课课程名称
                      el.strnjdm = datas.njdm // 调课人年级代码
                      el.strnjmc = datas.njmc // 调课人年级名称
                      el.strbjmc = datas.bjmc // 调课人班级名称
                      el.endxq = indexs
                      el.startDate = that.listquery.dqz // 调课人要调课在第几周
                      el.strded = 'y' // 新建一条数组元素标志
                    })
                    var arr = JSON.parse(JSON.stringify(that.tkmx.tkjlxxList))
                    that.tkmx.tkjlxxList = arr
                    that.isnew = false
                  }
                }
              }
            } else { // 当点击状态为false时进入该流程状态
              if (this.state4 === '') { // 当选择人员为空时进入该流程
                this.teacherList = []
                this.tkjskbsj = [] // 暂存调课教师课表数据
                this.tkmx.tkjlxxList = []
                this.tkmx.pkid = ''
                that.isnew = true
              } else { // 当选择人员不为空时进入该流程
                if (this.zgh === this.tkmx.tkjlxxList[0].endTkr) { // 当选择人员为被调课人时进入该流程
                  this.tkmx.tkjlxxList.forEach(el => {
                    el.endval = ''
                    el.endzc = ''
                    el.endZc = ''
                    el.endJc = ''
                    el.endname = ''
                    el.endkcmc = ''
                    el.endkcxx = ''
                    el.endKc = ''
                    el.endTkr = ''
                    el.endnjdm = ''
                    el.endnjmc = ''
                    el.endbjmc = ''
                    el.index = ''
                    el.endDate = ''
                    el.endxq = ''
                    that.$set(el, 'ended', '')
                  })
                  var arr = JSON.parse(JSON.stringify(this.tkmx.tkjlxxList))
                  // this.$set(this.tkxxlist)
                  that.tkmx.tkjlxxList = arr
                  that.isnew = false
                } else { // 当不是时进入该流程
                  this.teacherList = []
                  this.tkjskbsj = [] // 暂存调课教师课表数据
                  this.tkmx.tkjlxxList = []
                  that.isnew = true
                }
              }
            }
            // 课表单元格课程样式重置
            if (datas.ischeck) { // 当选择状态为已经选定时为其他单元格添加状态
              this.kbgs.pkzsarr.forEach((el, index) => {
                that.tabledata.tabledata.forEach((item, inindex) => {
                  // 根据课表结构及课表数据判断课表数据是否与选中课程相同，当相同时扭转单元格状态
                  if (item['xq' + el].js === datas.js && item['xq' + el].zs === datas.zs) {
                    that.$set(item['xq' + el], 'ischeck', datas.ischeck) // 扭转单元格选中状态
                    that.$set(item['xq' + el], 'cancheck', false)
                  } else {
                    that.$set(item['xq' + el], 'ischeck', false)
                    that.$set(item['xq' + el], 'cancheck', false)
                  }
                })
              })
            } else { // 当取消选中时进入该流程
              if (this.state4 === '') { // 当没有选择人员时进入该流程
                this.kbgs.pkzsarr.forEach((el, index) => {
                  that.tabledata.tabledata.forEach((item, inindex) => {
                    // item['xq' + el].kcdm !== '' && item['xq' + el].bjdm !== '' && !item['xq' + el].tkz  && (item['xq' + el].ishb === '0' || item['xq' + el].isdjs === '0' || item['xq' + el].isdsz === '0')
                    if (item['xq' + el].iscan) {
                      that.$set(item['xq' + el], 'cancheck', true)
                    } else {
                      that.$set(item['xq' + el], 'cancheck', false)
                    }
                  })
                })
              } else { // 当有选择人员是进入该流程
                if (this.tkmx.tkjlxxList.length) { // 当有调课明细长度时进入该流程
                  this.kbgs.pkzsarr.forEach((el, index) => {
                    that.tabledata.tabledata.forEach((item, inindex) => {
                      // item['xq' + el].kcdm !== '' && item['xq' + el].bjdm !== '' && !item['xq' + el].tkz && item['xq' + el].bjdm === that.tkmx.tkjlxxList[0].tkbjdm && (item['xq' + el].ishb === '0' || item['xq' + el].isdjs === '0' || item['xq' + el].isdsz === '0')
                      if (item['xq' + el].iscan) {
                        that.$set(item['xq' + el], 'cancheck', true)
                      } else {
                        that.$set(item['xq' + el], 'cancheck', false)
                      }
                    })
                  })
                } else { // 当明细长度不存在时进入该流程
                  this.kbgs.pkzsarr.forEach((el, index) => {
                    that.tabledata.tabledata.forEach((item, inindex) => {
                      // item['xq' + el].kcdm !== '' && item['xq' + el].bjdm !== '' && (item['xq' + el].ishb === '0' || item['xq' + el].isdjs === '0' || item['xq' + el].isdsz === '0')
                      if (item['xq' + el].iscan) {
                        that.$set(item['xq' + el], 'cancheck', true)
                      } else {
                        that.$set(item['xq' + el], 'cancheck', false)
                      }
                    })
                  })
                }
              }
            }
            const tables = JSON.parse(JSON.stringify(that.tabledata.tabledata))
            this.$set(that.tabledata, 'tabledata', tables)
          }
        } else {
          if (this.canchange) {
            this.$notify({ title: '提示', message: '该节次不可选', type: 'error', duration: 1000 })
          } else {
            this.$notify({ title: '提示', message: '该教师在你所选调课处已有课程！无法与您调课！', type: 'error', duration: 2000 })
          }
        }
      },
      // 提交申请
      onSubmit() {
        this.isupdata = true
        if (this.tkmx.tkjlxxList.length && this.tkmx.tkjlxxList[0].ended !== '' && this.tkmx.tkyy !== '') {
          // 七年级(四班)教师张静第4周周三第七节化学课和七年级(四班)教师李普第4周周四第四节历史与社会课进行了调课。
          const obj = this.tkmx.tkjlxxList[0]
          this.tkmx.tkmx = obj.strnjmc + obj.strbjmc + '教师' + obj.strname + obj.strzc + '周' + obj.startZc + '第' + obj.startJc + '节' + obj.strkcmc + '和' + obj.endnjmc + obj.endbjmc + '教师' + obj.endname + obj.endzc + '周' + obj.endZc + '第' + obj.endJc + '节' + obj.endkcmc + '课进行了调课'
          api.add(this.tkmx).then(res => {
            if (res.status === 200) {
              this.isupdata = false
              this.$notify({ title: '成功', message: '保存成功', type: 'success', duration: 2000 });
              this.$router.push({ path: 'tdkManager/tkwh' })
            } else {
              this.$notify({ title: '失败', message: res.getMessage(), type: 'error', duration: 2000 });
              // console.error(res.getMessage());
              setTimeout(() => {
                this.isupdata = false
              }, 1000)
            }
          })
        } else {
          this.$notify({ title: '失败', message: '请填入完整信息！', type: 'error', duration: 2000 });
          setTimeout(() => {
            this.isupdata = false
          }, 1000)
        }
      },
      onCancle() {
        this.$router.push({ path: 'tdkManager/tkwh' })
      },
      // 返回数字
      josoP(val) {
        const num = JSON.parse(JSON.stringify(val))
        return num
      },
      // 选择教师（被调课人员）
      async handleSelect(item) {
        console.log(item)
        if (item !== '') { // 当选择教师时获取该教师课表数据
          if (this.tkmx.tkjlxxList.length) { // 当存在调课流程进入流程
            this.zgh = item
            const jsmc = stastic.hqjsmcByid(this.teacherList, item)
            this.usernames = jsmc
            this.tableTitle = jsmc + '的课表' // 拼接教师课表头（某某教师的课表）
          } else {
            this.$notify({ title: '提示', message: '请先选择要调课程！', type: 'error', duration: 2000 })
          }
          this.tkzsj = await this.getApproval({ zgh: item, schoolCode: this.xxdm, time: this.listquery.dqz })
        } else { // 当清空搜索教师项时返回登陆教师课表
          this.xxdm = window.localStorage.getItem('xxdm')
          this.usernames = window.localStorage.getItem('name')
          const t = this.xxdm.length
          this.zgh = this.username.substring(t)
          this.tableTitle = window.localStorage.getItem('name') + '的课表' // 课表标题
          this.tkzsj = await this.getApproval({ zgh: this.zgh, schoolCode: this.xxdm, time: this.listquery.dqz })
        }
        const params = {
          zgh: this.zgh,
          xxdm: this.xxdm,
          time: this.listquery.dqz
        }
        // this.getteachertable(params)
        this.jskbsj = await this.getteachertable(params)
        console.log(this.jskbsj)
        if (this.tkmx.tkjlxxList.length) {
          // 获取被调课教师在调课教师所选择周次课表数据
          this.btkrkbsj = await this.getteachertable({ zgh: this.zgh, xxdm: this.xxdm, time: this.tkmx.tkjlxxList[0].startDate })
          // 获取调课教师在被条科教师周次课表数据
          this.tkjskbsj = await this.getteachertable({ zgh: this.tkmx.tkjlxxList[0].startTkr, xxdm: this.xxdm, time: this.listquery.dqz })
          var that = this
          const kyjh = _.find(this.btkrkbsj, el => el.pkzs === that.tkmx.tkjlxxList[0].startZc && el.pkjs === that.tkmx.tkjlxxList[0].startJc);
          if (kyjh && kyjh.bjdm) { // 判断是否在当前具有冲突 存在则不可与之进行调课并给出相应提示
            this.canchange = false
            if (this.state4 !== '') { // 当搜索人不为空进入流程
              if (item !== this.tkmx.tkjlxxList[0].startTkr) {
                this.jskbsj.forEach(els => {
                  els.cancheck = false
                  els.iscan = false
                  els.ischeck = false
                })
                this.$notify({ title: '提示', message: '该教师在您所选课程区已存在课程无法与您进行调课！', type: 'error', duration: 2000 })
              } else {
                this.jskbsj.forEach(el => {
                  // 该流程用于判断调课人课程选择状态以及当再次选在调课教师时添加已选中状态
                  const abs = _.find(this.tkzsj, item => el.pkWeek === item.startDate && el.pkzs === JSON.parse(item.startZc) && el.pkjs === JSON.parse(item.startJc))
                  if (abs === undefined) {
                    el.tkz = false
                    el.cancheck = false
                    el.iscan = !(el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')
                    el.ischeck = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)
                  } else {
                    el.tkz = true
                    el.cancheck = false
                    el.iscan = false
                    el.ischeck = false
                  }
                  // this.existence(this.tkzsj, el, 'select')
                })
              }
            } else {
              if (this.tkzsj.length) { // 当存在调课中数据时进入该流程对数据进行处理，匹配到的数据添加不可选状态，如果不存在调课中数据进入下一步执行
                this.jskbsj.forEach(el => { // 为课表添加可选/不可选状态
                  const abs = _.find(this.tkzsj, item => el.pkWeek === item.startDate && el.pkzs === JSON.parse(item.startZc) && el.pkjs === JSON.parse(item.startJc))
                  if (abs === undefined) { // 当未匹配到时进入调换状态否则进入下一步
                    el.tkz = false
                    el.cancheck = false
                    el.iscan = true
                    // (el.spjl && el.spjl.status === 'dk')?false:
                    el.ischeck = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === el.pkWeek)
                  } else {
                    el.tkz = true
                    el.cancheck = false
                    el.iscan = false
                    el.ischeck = false
                  }
                  // this.existence(this.tkzsj, el, 'clear')
                })
              } else { // 不存在调课中数据执行步骤
                this.jskbsj.forEach(el => {
                  // if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                  //   el.tkz = false
                  //   el.cancheck = false
                  //   el.iscan = false
                  //   el.ischeck = false
                  // } else {
                  //   el.tkz = false
                  //   el.cancheck = false
                  //   el.iscan = false
                  //   el.ischeck = (el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === el.pkWeek)?true:false
                  // }
                  if (!el.spjl || (el.spjl && el.spjl.status === 'tk')) {
                    if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                      el.tkz = false
                      el.cancheck = false
                      el.iscan = false
                      el.ischeck = false
                    } else {
                      el.tkz = false
                      el.cancheck = false
                      el.iscan = true
                      el.ischeck = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === el.pkWeek)
                    }
                  } else if (el.spjl && el.spjl.status === 'dk') {
                    el.tkz = false
                    el.cancheck = false
                    el.iscan = true
                    el.ischeck = false
                  }
                })
              }
              this.$notify({ title: '提示', message: '您不可与自己交换课程', type: 'error', duration: 2000 })
            }
          } else { // 选择教师/清空所选教师时教师可调数据处理(不存在冲突时)
            this.canchange = true
            if (this.state4 !== '') { // 当选择教师不为空时执行
              if (this.tkmx.tkjlxxList[0].ended === '') {
                this.isended = true
                this.jskbsj.forEach(el => { // 调课教师课表数据与被条科教师课表数据比对
                  const sbs = _.find(this.tkjskbsj, els => el.pkzs === els.pkzs && el.pkjs === els.pkjs // ||(els.bjdm === that.tkmx.tkjlxxList[0].tkbjdm && els.pkjs && els.pkzs)   && el.bjdm === that.tkmx.tkjlxxList[0].tkbjdm
                )
                  if (sbs === undefined) {
                    el.ischeck = false
                    el.cancheck = el.bjdm === that.tkmx.tkjlxxList[0].tkbjdm ? !(el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') : false // (el.spjl && el.spjl.status === 'dk')
                    el.iscan = el.bjdm === that.tkmx.tkjlxxList[0].tkbjdm ? !(el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') : false
                  } else {
                    el.ischeck = false
                    el.cancheck = false
                    el.iscan = false
                  }
                })
                // this.$notify({title: '提示', message: '您与该教师有课程冲突无法进行调课！', type: 'error', duration: 2000})
              } else {
                this.isended = false
                if (item === this.tkmx.tkjlxxList[0].startTkr) {
                  this.jskbsj.forEach(el => {
                    // if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                    //   el.tkz = false
                    //   el.cancheck = false
                    //   el.iscan = false
                    //   el.ischeck = false
                    // } else {
                    //   el.tkz = false
                    //   el.cancheck = false
                    //   el.iscan = (el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)?true:false
                    //   el.ischeck = (el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)?true:false
                    // }
                    if (!el.spjl || (el.spjl && el.spjl.status === 'tk')) {
                      if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                        el.tkz = false
                        el.cancheck = false
                        el.iscan = false
                        el.ischeck = false
                      } else {
                        el.tkz = false
                        el.cancheck = false
                        el.iscan = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)
                        el.ischeck = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)
                      }
                    } else if (el.spjl && el.spjl.status === 'dk') {
                      el.tkz = false
                      el.cancheck = false
                      // el.iscan = false
                      // el.ischeck = false
                      el.iscan = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)
                      el.ischeck = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].startZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].startJc) && this.tkmx.tkjlxxList[0].startDate === this.listquery.dqz)
                    }
                  })
                } else if (item === this.tkmx.tkjlxxList[0].endTkr) {
                  this.jskbsj.forEach(el => {
                    const sbs = _.find(this.tkjskbsj, els => (el.pkzs === els.pkzs && el.pkjs === els.pkjs) || (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') // ||(els.bjdm === that.tkmx.tkjlxxList[0].tkbjdm && els.pkjs && els.pkzs)   && el.bjdm === that.tkmx.tkjlxxList[0].tkbjdm
                  )
                    if (sbs === undefined) {
                      el.ischeck = !!(el.pkzs === JSON.parse(this.tkmx.tkjlxxList[0].endZc) && el.pkjs === JSON.parse(this.tkmx.tkjlxxList[0].endJc) && this.tkmx.tkjlxxList[0].endDate === this.listquery.dqz)
                      el.cancheck = false
                      el.iscan = el.bjdm === that.tkmx.tkjlxxList[0].tkbjdm ? !(el.spjl && el.spjl.status === 'dk') : false
                    } else {
                      el.ischeck = false
                      el.cancheck = false
                      el.iscan = false
                    }
                  })
                } else {
                  this.isended = false
                  this.jskbsj.forEach(el => {
                    el.ischeck = false
                    el.cancheck = false
                    el.iscan = false
                    el.tkz = true
                  })
                }
              }
            }
            // 当存在后一个人员内容时进入该流程，补充添加审批中不可选状态
            if (this.isended) {
              var that = this
              this.jskbsj.forEach(el => { // 判断调课中数据填加调课中流程状态
                const abs = _.find(this.tkzsj, item => el.pkWeek === item.startDate && el.pkzs === JSON.parse(item.startZc) && el.pkjs === JSON.parse(item.startJc))
                if (abs === undefined) {
                  el.tkz = false
                  // el.cancheck = (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')?false:true
                  // el.ischeck = false
                } else {
                  el.tkz = true
                  el.cancheck = false
                  el.iscan = false
                  // el.ischeck = false
                }
                // this.existence(this.tkzsj, el, 'ended')
              })
            }
          }
        } else {
          if (this.tkzsj.length) { // 流程中数据判断添加是否可选状态
            this.jskbsj.forEach(el => { // 为课表添加可选/不可选状态
              const abs = _.find(this.tkzsj, item => el.pkWeek === item.startDate && el.pkzs === JSON.parse(item.startZc) && el.pkjs === JSON.parse(item.startJc))
              if (abs === undefined) {
                el.tkz = false
                el.cancheck = !(el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')
                el.iscan = !(el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1')
                el.ischeck = false
              } else {
                el.tkz = true
                el.cancheck = false
                el.iscan = false
                el.ischeck = false
              }
              // this.existence(this.tkzsj, el, 'newcreat')
            })
          } else {
            this.jskbsj.forEach(el => {
              // if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
              //   el.tkz = false
              //   el.cancheck = false
              //   el.iscan = false
              //   el.ischeck = false
              // } else {
              //   el.tkz = false
              //   el.cancheck = true
              //   el.iscan = true
              //   el.ischeck = false
              // }
              if (!el.spjl || (el.spjl && el.spjl.status === 'tk')) {
                if (el.ishb === '1' || el.isdsz !== '0' || el.isdjs === '1') {
                  el.tkz = false
                  el.cancheck = false
                  el.iscan = false
                  el.ischeck = false
                } else {
                  el.tkz = false
                  el.cancheck = true
                  el.iscan = true
                  el.ischeck = false
                }
              } else if (el.spjl && el.spjl.status === 'dk') {
                console.log('我被待客了')
                console.log(el)
                el.tkz = false
                el.cancheck = true
                el.iscan = true
                el.ischeck = false
              }
            })
          }
        }
        this.tabledata = await this.getClassSchedule()
      }
    }
  }
</script>
<style scoped lang="scss">
  .table-container{
    padding: 10px;
    width: 1200px !important;
    float: left;
  }
  .left_box{
    padding: 10px;
    width: 250px;
    height: 560px;
    margin: 0;
    float: left;
    border: 1px solid #eee;
    h6{
      font-weight: 600;
      font-size: 15px;
    }
    .label{
      /* margin-bottom: 10px; */
    }
    .f_ipt{
      position: relative;
      display: block;
      em{
          width: 15px;
          height: 15px;
          color:#666;
          position: absolute;
          top: 45px;
          right: 9px;
          cursor: pointer;
          display: none;
        }
    }
    .f_ipt:hover em{
      display: block;
    }
  }
  .right_box{
    float: left;
    max-width: 850px;
    margin: 0;
    .top_box{
      padding: 2px 20px;
      .input-with-select{
        width: 300px;
      }
    }
  }
  .g_content{
    /* max-width: 1200px; */
  }
  .cell_box{
    cursor: pointer;
    border-radius: 8px;
  }
  .active{
    background: #66cc33;
    color: #fff;
  }
  .canchoose{
    background: #ccffcc;
    color: #66cc33;
  }
  .tkz{
    background: none;
    color: #333;
  }
  .el-icon-sort{
    width: 100%;
    text-align: center;
  }
  .f_box{
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
  }
</style>
