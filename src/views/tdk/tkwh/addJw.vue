<!-- 教务人员调课课表 -->
<template>
  <div class="g_max">

    <!-- <el-form ref="form" :model="form" label-width="80px">
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="onCancle">取消</el-button>
      </el-form-item>
    </el-form> -->

    <!-- 课表主体beg -->
    <el-main class="g_content">

        <div class="m_tk_left">
            <div class="f_padding">
                <div class="u_tk_DetailTit">选择调课人</div>
                <div class="u_tk_RecordBox" v-for="(item,index) in tkRecord" :key="index">
                    <div class="u_tk_col">
                        <label>调课人{{index+1}}:</label>
                        <div class="hackiptclear">
                            <el-input class="f_ipt" size="small" readonly label v-model="tkRecord[index].tk.val" placeholder="请选择调课人" @clear="clearTk(index)"></el-input>
                            <em class="el-icon-error" @click="clearTk(index)" ref="cleaript"></em>
                        </div>
                    </div>
                    <div class="el-icon-sort"></div>
                    <div class="u_tk_col">
                        <label>被调课人{{index+1}}:</label>
                        <div class="hackiptclear">
                            <el-input class="f_ipt" size="small" readonly label v-model="tkRecord[index].btk.val" placeholder="请选择被调课人" @clear="clearTk(index)"></el-input>
                            <em class="el-icon-error" @click="clearTk(index)" ref="cleaript"></em>
                        </div>
                    </div>
                </div>
            </div>

            <div class="f_padding">
                <div class="u_tk_DetailTit">结果预览</div>
                <div class="u_tk_ResultBox" v-for="(item,index) in tkRecord" :key="index" v-if="item.tk.val!=''&&item.btk.val!=''">
                    <div class="u_tk_col">
                        <div>{{tkRecord[index].tk.val}}</div>
                    </div>
                    <div class="u_tk_col">
                        <div>{{tkRecord[index].btk.val}}</div>
                    </div>
                </div>
            </div>

            <div class="f_padding">

                <div class="u_tk_DetailTit">调课原因</div>
                <div class="u_tk_col">
                    <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="tkReason"></el-input>
                </div>
            </div>

            <div class="u_kb_submit"><el-button v-on:click="cancelSubmit">取消</el-button> <el-button type="primary" v-on:click="exchangeSubmit">申请</el-button></div>


        </div>
        <div class="m_tk_right">
            <div class="u_tk_selbox">
                <el-select class="f_sel" v-model="selnjbjweek.nj" @change="njChange" placeholder="请选择年级">
                    <el-option v-for="(item,index) in njlist" :key="index" :label="item.njmc" :value="item.njdm">
                    </el-option>
                </el-select>

                <el-select class="f_sel" v-model="selnjbjweek.bj" placeholder="请选择班级" @change="bjChange">
                    <el-option style="margin-left:1px;" v-for="(item,index) in bjlist" :key="index" :label="item.bj" :value="item.uuid">
                    </el-option>
                </el-select>

                <el-date-picker ref="dates" @change='dateChange' :disabled="isSelWeek" v-model="selnjbjweek.week" type="week" format="yyyy 第 WW 周" placeholder="选择周"></el-date-picker>
            </div>

            <div class="u_tk_loadbox" v-loading="Kbloading" element-loading-text="数据处理中请稍候">
                <div class="u_tk_detailTable" v-if="isShowKb">
                    <table class="u_kb_table">
                        <tr><th colspan="6" class="f_kb_header">{{_backBj(selnjbjweek.bj)}}课表</th></tr>
                        <tr><th width="80"></th><th width="190">星期一</th><th width="190">星期二</th><th width="190">星期三</th><th width="190">星期四</th><th width="190">星期五</th></tr>

                        <tr v-for="(item,index) in realKbInfo" :key="index">
                            <td class="indexnum">{{index+1}}</td>

                            <td v-for="(sitem,sindex) in item.px" :class="{'lock':sitem.isprocess||sitem.isdsz!=0||sitem.ishb!=0,'doubleline':sitem.ishb!=0}">

                                <div class='f_unit_box' :class="{'tkr':sitem.istkr,'change':(sitem.canChange&&!sitem.isprocess&&sitem.ishb==0),'nochange':(!sitem.canChange||sitem.isprocess||sitem.ishb!=0)}" v-if="sitem.kcdm&&sitem.isdsz==0&&!sitem.isrepeat" v-on:click="selStuFun(sitem)">
                                    {{sitem.kcdm?getKcmc(sitem.kcdm):''}} {{sitem.zgh?getTeacherName(sitem.zgh):''}}
                                </div>

                                <div class='f_unit_box double' v-if="sitem.kcdm&&sitem.isdsz!=0&&!sitem.isrepeat" :class="{'nochange':(sitem.isdsz!=0)}" v-on:click="selStuFun(sitem)">
                                    {{sitem.kcdm?getKcmc(sitem.kcdm):''}} {{sitem.zgh?getTeacherName(sitem.zgh):''}} ({{sitem.isdsz==1?'单周':'双周'}})<br>
                                    {{sitem.dszkcdm?getKcmc(sitem.dszkcdm):''}} {{sitem.dszzgh?getTeacherName(sitem.dszzgh):''}} ({{sitem.dsznum==1?'单周':'双周'}})
                                </div>

                                <div class='f_unit_box double' v-if="sitem.isrepeat" :class="{'nochange':sitem.isrepeat}" v-on:click="selStuFun(sitem)">
                                    {{sitem.kcdm?getKcmc(sitem.kcdm):''}} {{sitem.zgh?getTeacherName(sitem.zgh):''}} (合)<br>

                                    <span v-html="getRepeatInfo(sitem.repeatkcdm,sitem.repeatzgh)"></span>
                                    <!-- {{}} -->


                                    <!-- {{sitem.dszkcdm?getKcmc(sitem.dszkcdm):''}} {{sitem.dszzgh?getTeacherName(sitem.dszzgh):''}} ({{sitem.dsznum==1?'单周':'双周'}}) -->
                                </div>

                            </td>

                        </tr>
                    </table>

                </div>
            </div>

        </div>

    </el-main>
    <!-- 课表主体end -->
  </div>
</template>
<script>
  import * as api from '@/api/tdk/tkxx/addJw'
  import baseinfo from '@/api/jcsj'
  import _ from 'lodash'
  export default {
    components: {
    },
    data() {
      return {
        tkRecord: [{ tk: { val: '' }, btk: { val: '' } },
        { tk: { val: '' }, btk: { val: '' } },
        { tk: { val: '' }, btk: { val: '' } }
        ],                                  // 即时调课记录存放
        curTk: { tk: {}, btk: {} },               // 当前调课配对
        njlist: [],                          // 所有年级列表
        allbjlist: [],                       // 所有班级列表
        bjlist: [],                          // 当前年级的班级列表
        selweek: '',
        tkReason: '',                        // 调课理由
        selnjbjweek: {
          nj: '',
          bj: '',
          week: ''
        },                                  // 选中的年级，班级，周次
        value3: '',                          //
        isSelWeek: true,                     // 是否可以选择周
        allkcinfo: [],                       // 所有的课程信息
        allteachinfo: [],                    // 所有的教师信息
        isShowKb: false,                     // 是否显示课表
        xnxq: '',                            // 当前学年学期
        kbform: {},                          // 课表结构
        tempRealKbInfo: [],                  // 临时的课表信息(处理夸张调课,撤销调课) *
        realKbInfo: [],                      // 前端可用的按照节次排序的课表 *
        realTeacherKB: [],                   // 教师课表总表所有改变都体现在上面 *
        tkState: 0,                          // 调课状态 0表示什么都没选择 1表示选中了调课人
        tkrObj: {},                          // 当前调课人信息
        weekArr: [],                         // 存放选择的周的数据
        Kbloading: false,                    // 课表是否在loading中
        curKbRes: {},                        // 当前课表纯净版
        processList: [],                     // 当前已经申请的调换课
        curClassID: '',                      // 当前的班级ID
        pkid: '',                            // 排课ID 申请的时候需要
        mbid: ''
      }
    },
    mounted() {
        //   this.value3 = new Date()
        //   var t = this.xxdm.length
        //   this.zgh = this.username.substring(t)
        //   console.log(this.zgh)
      this.getIsMbxx();
      this.init()
    },
    methods: {
      getIsMbxx() {
        const xxdm = localStorage.getItem('xxdm');
        api.validaSplc({ xxdm }).then(res => {
          if (res.status === 200) {
            this.mbid = res.data;
          } else {
            this.$message.error('操作失败，请联系管理员！');
          }
        })
      },
      async init() {
        const that = this;
            // 获取当前学年学期
        const xnxqres = await baseinfo.hqdqxnxq({ xxdm: localStorage.getItem('xxdm') });
        this.xnxq = xnxqres.data.xn;



        await Promise.all([
                // 获取学年列表
          baseinfo.hqnjlb({ xxdm: localStorage.getItem('xxdm') }),
                // 获取所有班级列表
          baseinfo.hqbjlb({ xn: this.xnxq, xxdm: localStorage.getItem('xxdm') }),
                // 获取所有课程信息
          baseinfo.hqkclb({ xxdm: localStorage.getItem('xxdm') }),
                // 获取所有老师信息
          baseinfo.hqjslb({ xxdm: localStorage.getItem('xxdm') }),
                // 获取课表结构
          api.getClassStructure({ xxdm: localStorage.getItem('xxdm') })])
            .then(result => {
              that.njlist = result[0]
              that.allbjlist = result[1]
              that.allkcinfo = result[2]
              that.allteachinfo = result[3]
              that.kbform = result[4]
            }).catch(error => {
              that.tipsXX('数据初始化出错,刷新后再试', 'error')
            });

            // //获取学年列表
            // this.njlist = await baseinfo.hqnjlb({xxdm:localStorage.getItem("xxdm")});
            // //获取所有班级列表
            // this.allbjlist = await baseinfo.hqbjlb({xn:this.xnxq,xxdm:localStorage.getItem("xxdm")});
            // //获取所有课程信息
            // this.allkcinfo = await baseinfo.hqkclb({xxdm:localStorage.getItem("xxdm")});
            // //获取所有老师信息
            // this.allteachinfo = await baseinfo.hqjslb({xxdm:localStorage.getItem("xxdm")});
            // //获取课表结构
            // this.kbform = await api.getClassStructure({xxdm:localStorage.getItem("xxdm")});

            // console.log(this.allteachinfo);
            // console.log(this.njlist);
            // console.log(this.allbjlist);
      },
        /**
         * 说明:切换年级
         * 作者:RayJ
         * 更新时间:2019-2-12
         */
      async njChange() {
        this.selnjbjweek.bj = '';
        this.selnjbjweek.week = '';
        this.isSelWeek = true;
        this.isShowKb = false;
        this.bjlist = _.filter(this.allbjlist, { njdm: this.selnjbjweek.nj });
        this.clearRecord();
      },
        /**
         * 说明:切换班级
         * 作者:RayJ
         * 更新时间:2019-2-12
         */
      async bjChange() {
        this.selnjbjweek.week = '';
        this.isSelWeek = false;
        this.isShowKb = false;
        this.clearRecord();
      },
        /**
         * 说明:切换周次
         * 作者:RayJ
         * 更新时间:2019-2-12
         */
      async dateChange() {
        this.Kbloading = true;
            // 年份周次所需格式 （2019-5||2019-10）
        let week = this.$refs.dates.displayValue.replace(' 第 ', '-')
        week = week.replace(' 周', '')
        week = week.replace('-0', '-')
        const paraObj = {
          schoolCode: localStorage.getItem('xxdm'),
          classCode: this.selnjbjweek.bj,
          time: week
        }
            // var week = this.getWeekNum();
            // 如果当前周次等于当前课表的周次 并且 当前班级ID等于当前下拉选择的班级ID..数据不必访问接口直接从纯净的课表信息里取 this.curKbRes 并重新排序赋值给 当前显示课表 realKbInfo
        if (this.getWeekNum() == this.curKbRes.week && this.curClassID == this.selnjbjweek.bj) {
          this.sortTeacherKB(this.getWeekNum(), this.curKbRes.kbres.data);
          this.realKbInfo = this.formatKB(this.curKbRes.kbres.data);
        } else {
                // 获取当前周次的提交申请的信息
          this.curClassID = this.selnjbjweek.bj;
          const processres = await api.getTkProcess(paraObj);
                // console.log(processres,194);
                // 格式化申请的周次和节次的格式
          this.formProcess(processres.data, week)
                // 获取挡墙周次的班级课表
          const classkbres = await api.Getbjlist(paraObj);
                // 整理出本周的教师课表
          this.sortTeacherKB(this.getWeekNum(), classkbres.data);
                // console.log(this.realTeacherKB,197);
                // 格式化源课表信息并显示到table上
          this.realKbInfo = this.formatKB(classkbres.data);
                // 创建一个副本来存放纯净的当前的课表信息（未格式化）
          this.curKbRes = { week: this.getWeekNum(), kbres: $.extend(true, {}, classkbres) };
                // 赋值新的排课ID(提交申请的时候需要)
          if(classkbres.data.length>0){
              this.pkid = classkbres.data[0].pkid;
          }else{
              this.tipsXX("暂无课表信息","warning");
              this.Kbloading = false;
          }
        }

            // 显示课表
        this.isShowKb = true
        this.Kbloading = false;
            // 初始化课表状态
        this.initState();
      },
        /**
         * 说明:整理出哪些位置是正在调课进行中
         * 作者:RayJ
         * 更新时间:2019-1-29
         */
      formProcess(res, week) {
            // 重置进行中的教师交换列表...因为换周次或者班级了
        this.processList = [];
            // 循环结果列表
        for (let i = 0; i < res.length; i++) {
                // 如果调课人是本周课表的，先用_.findIndex判断是否已经入数组，没有就推入数组
          if (res[i].startDate == week) {
            if (_.findIndex(this.processList, { pkjs: res[i].startJc, pkzs: res[i].startZc }) == -1) {
              this.processList.push({ pkjs: parseInt(res[i].startJc), pkzs: parseInt(res[i].startZc) })
            }
          }
                // 如果被调课人是本周课表的，操作和上面一样
          if (res[i].endDate == week) {
            if (_.findIndex(this.processList, { pkjs: res[i].endJc, pkzs: res[i].endZc }) == -1) {
              this.processList.push({ pkjs: parseInt(res[i].endJc), pkzs: parseInt(res[i].endZc) })
            }
          }
        }
            // console.log(this.processList,236);
      },
        /**
         * 说明:返回班级代码所对应的中文名称
         * 作者:RayJ
         * 更新时间:2019-1-23
         */
      _backBj(val) {
        return _.find(this.bjlist, { uuid: val }).bj
      },
        /**
         * 说明:整理课表结构前端方便使用(按照节次循环)
         * 作者:RayJ
         * 更新时间:2019-1-23
         */
      formatKB(reskb) {
        const resTable = [];
            // 根据课表结构计算出，一天最多几节课
        const sumJs = this.kbform.swjs + this.kbform.xwjs + this.kbform.wsjs
        for (let i = 0; i < sumJs; i++) {
                // 按照节次取出对应的对象数组...
          const jcArr = _.filter(reskb, { pkjs: i + 1 });
                // 按照周次递增的排序课程..
          let sortArr = _.orderBy(jcArr, ['pkzs', 'isdsz'], ['asc', 'asc']);

                // 整个单双周数据吧单双周整合到一个数组里
          sortArr = this.sdKB(sortArr);

                // 如果排序后的数组少于5个说明某个星期的某个节次是空的..需要补全..kbtable才可以循环
          if (sortArr.length < 5) {
            sortArr = this.checkKb(sortArr);
          }

                // 以上3步完成后，才是一个节次的完美数组。。可以循环输出了.再push到realkbInfo里
          resTable.push({ px: sortArr });
        }
        return resTable;
            // console.log(this.realKbInfo)
            // return _.find(this.bjlist,{uuid:val}).bj
      },
        /**
         * 说明:课表按顺序补齐5个元素
         * 作者:RayJ
         * 更新时间:2019-1-23
         */
      checkKb(kbarr) {
            // 定义返回的新数组
            // 前提:*****参数传过来的数组是一个已经序列号的数组按小到大排列好的数组*****
        const newkbarr = [];
            // 循环5次，5个星期
        for (let i = 0, k = 0; i < 5; i++) {
                // 如果无数据或者数据和数组下标不匹配代表缺一个.K不变，新数组push一个空对象
                // 如果符合数组下标就K++并把对象push到新数组
          if (kbarr[k] && kbarr[k].pkzs == (i + 1)) {
            newkbarr.push(kbarr[k]);
            k++;
          } else {
            newkbarr.push({});
          }
        }
        return newkbarr
      },
        /**
         * 说明:整合单双周数据
         * 作者:RayJ
         * 更新时间:2019-1-30
         */
      sdKB(kbarr) {
            // console.log(kbarr,359);
        const newkbarr = [];
        let temp_kcdm = [];
        let temp_zgh = []
        let b_zs = -1;      // 循环前周数
        let b_js = -1;      // 循环前节数
        for (let i = 0; i < kbarr.length; i++) {
                // 单双周合班
          if (kbarr[i].isdsz != 0) {
            const tempkbobj = kbarr[i];
                    // console.log(kbarr[i+1],364);
            tempkbobj.dszkcdm = kbarr[i + 1].kcdm;
            tempkbobj.dszzgh = kbarr[i + 1].zgh;
            tempkbobj.dsznum = kbarr[i + 1].isdsz;
            i = i + 1;
            newkbarr.push(tempkbobj)
          } else {
                    // 重复数据合并
            if (kbarr[i].pkzs == b_zs && kbarr[i].pkjs == b_js) {
              temp_kcdm.push(kbarr[i].kcdm);
              temp_zgh.push(kbarr[i].zgh);

              newkbarr[newkbarr.length - 1].isrepeat = true;
              if (!newkbarr[newkbarr.length - 1].repeatkcdm) {
                newkbarr[newkbarr.length - 1].repeatkcdm = []
              }
              newkbarr[newkbarr.length - 1].repeatkcdm = temp_kcdm;

              if (!newkbarr[newkbarr.length - 1].repeatzgh) {
                newkbarr[newkbarr.length - 1].repeatzgh = []
              }
              newkbarr[newkbarr.length - 1].repeatzgh = temp_zgh;
            } else {
              temp_kcdm = [];
              temp_zgh = [];
              newkbarr.push(kbarr[i]);
              b_zs = kbarr[i].pkzs;
              b_js = kbarr[i].pkjs;
            }
          }

                // 重复数据合并
                // if(kbarr[i].pkzs==b_zs&&kbarr[i].pkjs==b_js){
                //     tempkbobj.repeatkcdm
                //     tempkbobj.repeatzgh
                //     tempkbobj.isrepeat = true;
                // }
        }
            // console.log(newkbarr,396);
        return newkbarr
      },
        /**
         * 说明:选择一个老师
         * 作者:RayJ
         * 更新时间:2019-1-23
         */
      async selStuFun(item) {
        if (item.isdsz != 0) {
          this.tipsXX('单双周的课程暂不支持调课', 'warning');
          return
        }
        if (item.ishb != 0) {
          this.tipsXX('合班的课程暂不支持调课', 'warning');
          return
        }
        if (item.isprocess) {
          this.tipsXX('此老师已提交换课申请,等待申请通过', 'warning');
          return
        }
            // this.weekArr
        const week = this.getWeekNum();
            // if(this.tkrObj.js==item.pkjs&&this.tkrObj.zs==item.pkzs||this.tkrObj.zgh==item.zgh) 这个是以前的判断周次节次都一样可能不需要判断这个
        if (this.tkrObj.zgh == item.zgh) {
          this.tipsXX('自己不能和自己调课', 'error');
          return
        }
        if (this.tkState == 1 && !item.canChange) {
          this.tipsXX('换课的时间有冲突', 'error');
          return
        }
        if (this.tkRecord[2].tk.val !== '' && this.tkRecord[2].btk.val !== '') {
          this.tipsXX('一次申请最多只能选择3组人员互换', 'warning');
          return
        }


            // tkState为0代表选择调课人，为1代表选择被调课人
        if (this.tkState == 0) {
          if (this.checkInvolved(item)) {
            console.log('13131231231231')
            this.tipsXX('只能选择之前调整的课程', 'warning');
            return
          }

          let yearweek = this.$refs.dates.displayValue.replace(' 第 ', '-');
          yearweek = yearweek.replace(' 周', '');
          yearweek = yearweek.replace('-0', '-');

          this.curTk.tk = JSON.stringify(item);
                // 标记当前的课程对象为选中状态
          this.$set(item, 'istkr', true)
                // console.log(item,263)
                // 设置tkrObj调课人对象的具体值.只有tkState=1才有值..再点击一下对象置为空{}
          this.tkrObj.yearweek = yearweek;
          this.tkrObj.week = week;
          this.tkrObj.zgh = item.zgh;
          this.tkrObj.js = item.pkjs;
          this.tkrObj.zs = item.pkzs;
          this.tkState = 1;
                // 检查教师课程冲突,直接改变this.realKbInfo的属性
          this.checkConflict();
        } else {
                // 这里需判断被调课人是否跨周..判断调课人的week 和 当前week的比较
          const curweek = this.getWeekNum();
          if (this.tkrObj.week == curweek) {
                    // this.curTk.btk = JSON.stringify(item);
                    // 操作
            this.$set(this.realKbInfo[this.tkrObj.js - 1].px[this.tkrObj.zs - 1], 'istkr', false)
            this.changeKB({ pkjs: item.pkjs, pkzs: item.pkzs, zgh: item.zgh, week }, { pkjs: this.tkrObj.js, pkzs: this.tkrObj.zs, zgh: this.tkrObj.zgh, week: this.tkrObj.week });
          } else {
                    // let yearweek = this.$refs.dates.displayValue.replace(' 第 ','-');
                    // yearweek = yearweek.replace(' 周', '');
                    // yearweek = yearweek.replace('-0', '-');
                    // 异步的获取当前的课表信息
                    // console.log("yearweek="+yearweek,314);
                    // console.log(this.tkrObj,315)
            this.tempRealKbInfo = await this.getKbInfo(this.tkrObj.yearweek);
                    // console.log(this.tempRealKbInfo,318);
            this.initStateOnly(this.tkrObj.week);
                    // console.log(this.tempRealKbInfo,322);

                    // 操作
            this.$set(this.realKbInfo[this.tkrObj.js - 1].px[this.tkrObj.zs - 1], 'istkr', false)
            this.changeKB({ pkjs: this.tkrObj.js, pkzs: this.tkrObj.zs, zgh: this.tkrObj.zgh, week: this.tkrObj.week }, { pkjs: item.pkjs, pkzs: item.pkzs, zgh: item.zgh, week })
                    // 调课完毕后清空临时表
            this.tempRealKbInfo = [];
                    // console.log(this.tempRealKbInfo,316);
            this.tipsXX('清空了临时表', 'success');
          }
          this.tkrObj = {};
          this.tkState = 0;
          this.checkConflict();
        }

            // 更新tkRecord的记录把新的调换人基本信息记录起来
        this.updataTkRecord(item);
            // console.log(this.tkRecord,259);

            // 点击后把周信息和周课表存入暂存区
            // this.stageKbInfo.week = this.getWeekNum;
            // this.stageKbInfo.kbinfo = this.realKbInfo;
            // console.log(recordStr);
            // console.log(this.realKbInfo);
      },
        /**
         * 说明:更新调课记录
         * 作者:RayJ
         * 更新时间:2019-1-23
         */
      updataTkRecord(item) {
        let recordStr = '';
        const week = this.getWeekNum();
        let year = this.$refs.dates.displayValue.replace(' 第 ', '-')
        year = year.replace(' 周', '')
        year = year.replace('-0', '-')
            // 产生this.tkRecord.xx.val的值，也就是input里显示的中文信息
        recordStr = '第' + week + '周 星期' + item.pkzs + ' 第' + item.pkjs + '节 ' + this.getTeacherName(item.zgh) + ' ' + this.getKcmc(item.kcdm);
            // 写入tkRecord里,先写入tk再写入btk 已val来判断是否有数据
        for (let i = 0; i < this.tkRecord.length; i++) {
                // 按顺序更新操作记录数组...从0开始到2，先tk 再btk
          if (this.tkRecord[i].tk.val == '') {
                    // 把一些重要的信息存入tkRecord对象中.(kcdm课程代码,zgh职工号,pkzs排课周数,pkjs排课节数,week所属周次,val显示的中文信息)
            this.tkRecord[i].tk.kcdm = item.kcdm;
            this.tkRecord[i].tk.zgh = item.zgh;
            this.tkRecord[i].tk.pkzs = item.pkzs;
            this.tkRecord[i].tk.pkjs = item.pkjs;
            this.tkRecord[i].tk.week = week;
            this.tkRecord[i].tk.year = year;
            this.tkRecord[i].tk.val = recordStr;
            return
          }
          if (this.tkRecord[i].btk.val == '') {
            this.tkRecord[i].btk.kcdm = item.kcdm;
            this.tkRecord[i].btk.zgh = item.zgh;
            this.tkRecord[i].btk.pkzs = item.pkzs;
            this.tkRecord[i].btk.pkjs = item.pkjs;
            this.tkRecord[i].btk.week = week;
            this.tkRecord[i].btk.year = year;
            this.tkRecord[i].btk.val = recordStr;
            return
          }
        }
      },
        /**
         * 说明:Ele-UI 信息提示的二次封装
         * 作者:RayJ
         * 更新时间:2019-1-22
         */
      tipsXX(data, xxtype, tit) {
        this.$notify({
          title: tit ? tit : '',
          message: data,
          type: xxtype,
          duration: 2000
        });
      },
        /**
         * 说明:获取课程的中文,传入ID获取课程名称
         * 作者:RayJ
         * 更新时间:2019-1-23
         */
      getKcmc(kcid) {
        const res = _.find(this.allkcinfo, { uuid: kcid })
        return res.kcmc
      },
        /**
         * 说明:获取教师姓名,传入职工号
         * 作者:RayJ
         * 更新时间:2019-1-23
         */
      getTeacherName(zgh) {
        const res = _.find(this.allteachinfo, { gh: zgh })
        return res.xm
      },
        /**
         * 说明:获得第几周
         * 作者:RayJ
         * 更新时间:2019-1-23
         */
      getWeekNum() {
        let week = this.$refs.dates.displayValue.replace(' 第 ', '-')
        week = week.replace(' 周', '')
        week = week.replace('-0', '-')
        week = week.substring(week.indexOf('-') + 1, week.length);
        return week
      },
        /**
         * 说明:循环得出哪些是冲突的
         * 作者:RayJ
         * 更新时间:2019-1-28
         */
      checkConflict() {
        const teachkb = _.find(this.realTeacherKB, { week: this.getWeekNum() })
        const tkr_kb = _.find(teachkb.teachkb, { zgh: this.tkrObj.zgh })
            // console.log(tkr_kb);
            // console.log(teachkb,412)
            // console.log("这里是第"+this.getWeekNum()+"周");
            // console.log(this.realKbInfo);
        for (let i = 0; i < this.realKbInfo.length; i++) {
          for (let j = 0; j < this.realKbInfo[i].px.length; j++) {
            if (this.realKbInfo[i].px[j].zgh == this.tkrObj.zgh) {
                        // this.tipsXX("你点的是同一个人","error");
            } else {
                        // console.log(teachkb,419);
                        // console.log(this.realKbInfo[i].px[j].zgh,419);
                        // console.log(_.find(teachkb.teachkb,{zgh:this.realKbInfo[i].px[j].zgh}),420);
                        // console.log(this.tkrObj.week,443)
                        // 排除zgh为空的
              if (this.realKbInfo[i].px[j].zgh) {
                if (this.tkState == 1) {
                  if (this.tkrObj.week == parseInt(this.getWeekNum())) {
                                    // 被调换人是否有时间冲突
                                    // console.log(this.realKbInfo[i].px[j].zgh,588)
                                    // console.log(_.find(teachkb.teachkb,{zgh:this.realKbInfo[i].px[j].zgh}),589);
                                    // console.log("zgh="+this.realKbInfo[i].px[j].zgh);
                    if (this.ConflictTeacherKB(_.find(teachkb.teachkb, { zgh: this.realKbInfo[i].px[j].zgh }))) {
                      this.realKbInfo[i].px[j].canChange = true;
                    } else {
                      this.realKbInfo[i].px[j].canChange = false;
                    }
                                    // 调换人是否有时间冲突
                    if (this.tkrObj.js && this.tkrObj.zs) {
                      if (_.findIndex(tkr_kb.kb, { pkjs: i + 1, pkzs: j + 1 }) != -1) {
                        this.realKbInfo[i].px[j].canChange = false;
                      }
                    }
                  } else {
                                    // 获取上周的教师课表
                    const tempTeachkb = _.find(this.realTeacherKB, { week: this.tkrObj.week });
                                    // console.log(tempTeachkb,463);
                    if (this.ConflictTeacherKB(_.find(tempTeachkb.teachkb, { zgh: this.realKbInfo[i].px[j].zgh }))) {
                      this.realKbInfo[i].px[j].canChange = true;
                    } else {
                      this.realKbInfo[i].px[j].canChange = false;
                    }
                                    // 调换人是否有时间冲突
                    if (this.tkrObj.js && this.tkrObj.zs) {
                      if (_.findIndex(tkr_kb.kb, { pkjs: i + 1, pkzs: j + 1 }) != -1) {
                        this.realKbInfo[i].px[j].canChange = false;
                      }
                    }
                  }
                } else {
                  this.realKbInfo[i].px[j].canChange = false;
                }
              }
            }
          }
        }
      },
        /**
         * 说明:交换调课和被调课人的信息..参数是2个需要调课的信息 主要信息就是(pkjs,pkzs)这2个
         * 作者:RayJ
         * 更新时间:2019-1-23
         */
      changeKB(tk, btk) {
            // console.log(this.tkrObj);
            // console.log(tk,401)
            // console.log(btk,402)
        if (tk.week == btk.week) {
                // $.extend生成新的对象并不是指针指向,新的完整的realKbInfo的一个课程对象.
          var tkobj = $.extend(true, {}, this.realKbInfo[tk.pkjs - 1].px[tk.pkzs - 1]);
          var btkobj = $.extend(true, {}, this.realKbInfo[btk.pkjs - 1].px[btk.pkzs - 1]);
                // 互相交换赋值(pkjs和pkzs),修改新对象的2个值
          tkobj.pkjs = btk.pkjs;
          tkobj.pkzs = btk.pkzs;
          btkobj.pkjs = tk.pkjs;
          btkobj.pkzs = tk.pkzs;
                // 把新修改的2个对象重新赋值到相应的realKbInfo里
          this.$set(this.realKbInfo[tk.pkjs - 1].px, tk.pkzs - 1, btkobj)
          this.$set(this.realKbInfo[btk.pkjs - 1].px, btk.pkzs - 1, tkobj)
          this.changeTeacherKB(tk, btk);
        } else {
                // 这里是跨周的换课操作
          this.tipsXX('这里操作跨周', 'success');
                // console.log(this.tempRealKbInfo,465);
                // console.log(this.realKbInfo,466);
          var tkobj = $.extend(true, {}, this.tempRealKbInfo[tk.pkjs - 1].px[tk.pkzs - 1]);
          var btkobj = $.extend(true, {}, this.realKbInfo[btk.pkjs - 1].px[btk.pkzs - 1]);
                // console.log(tkobj,469);
                // console.log(btkobj,470);
          tkobj.pkjs = btk.pkjs;
          tkobj.pkzs = btk.pkzs;
          btkobj.pkjs = tk.pkjs;
          btkobj.pkzs = tk.pkzs;
          this.$set(this.tempRealKbInfo[tk.pkjs - 1].px, tk.pkzs - 1, btkobj)
          this.$set(this.realKbInfo[btk.pkjs - 1].px, btk.pkzs - 1, tkobj)
          this.changeTeacherKB(tk, btk);
        }
      },
        /**
         * 说明:交换调课和被调课人的相关教师课表
         * 作者:RayJ
         * 更新时间:2019-1-24
         */
      changeTeacherKB(tk, btk) {
            // console.log(tk,412);
            // console.log(btk,413);
            // console.log(this.realKbInfo);

            // console.log(this.realTeacherKB,488);
            // 获取调课人所在周的教师课表
        const tkKb_temp = _.find(this.realTeacherKB, { week: tk.week })
            // 获取被调课人所在周的教师课表
        const btkKb_temp = _.find(this.realTeacherKB, { week: btk.week })
            // console.log(tkKb_temp,492);
            // console.log(btkKb_temp,493);

            // 获取调课人当前课表的序号
        const tk_cur_kb = _.findIndex(tkKb_temp.teachkb, { zgh: tk.zgh });
            // 获取调课人目标周本人的课表的序号
        const tk_tar_kb = _.findIndex(btkKb_temp.teachkb, { zgh: tk.zgh });
            // 获取被调课人当前课表的序号
        const btk_cur_kb = _.findIndex(btkKb_temp.teachkb, { zgh: btk.zgh });
            // 获取被调课人目标周本人的课表的序号
        const btk_tar_kb = _.findIndex(tkKb_temp.teachkb, { zgh: btk.zgh });
            // 获取具体要交换的调课人课程
        const tk_kb_obj = $.extend(true, {}, _.find(tkKb_temp.teachkb[tk_cur_kb].kb, { pkjs: tk.pkjs, pkzs: tk.pkzs }));
            // 获取具体要交换的被调课人课程
        const btk_kb_obj = $.extend(true, {}, _.find(btkKb_temp.teachkb[btk_cur_kb].kb, { pkjs: btk.pkjs, pkzs: btk.pkzs }));

        tk_kb_obj.pkjs = btk.pkjs;
        tk_kb_obj.pkzs = btk.pkzs;
        btk_kb_obj.pkjs = tk.pkjs;
        btk_kb_obj.pkzs = tk.pkzs;

            // 先从tkkb_temp中剔除掉调课人的节次和周次
        const drop_tk = _.remove(tkKb_temp.teachkb[tk_cur_kb].kb, item => item.pkjs == tk.pkjs && item.pkzs == tk.pkzs);
            // 先从btkKb_temp中剔除掉被调课人的节次和周次
        const drop_btk = _.remove(btkKb_temp.teachkb[btk_cur_kb].kb, item => item.pkjs == btk.pkjs && item.pkzs == btk.pkzs);

            // 再互换添加添加调课人目标教师课表信息中。
        btkKb_temp.teachkb[tk_tar_kb].kb.push(tk_kb_obj);
        tkKb_temp.teachkb[btk_tar_kb].kb.push(btk_kb_obj);
      },
        /**
         * 说明:和具体教师课表的时间比较,有冲突返回false,无冲突返回true,参数为具体老师的课表
         * 作者:RayJ
         * 更新时间:2019-1-23
         */
      ConflictTeacherKB(item) {
        console.log(this.tkrObj, 723)
        console.log(item, 724)
            // 如果item为空代表课程就是空，不判断值借false,tkrobj.js 和 tkrobj.zs为空代表已经选择被调课人.相当于状态初始化
        if (item && this.tkrObj.js && this.tkrObj.zs && item.kb) {
          for (let i = 0; i < item.kb.length; i++) {
            if (item.kb[i].pkjs == this.tkrObj.js && item.kb[i].pkzs == this.tkrObj.zs) {
              return false
            }
          }
          return true
        } else {
          return false
        }
      },
        /**
         * 说明:删除已调信息后的处理
         * 作者:RayJ
         * 更新时间:2019-1-24
         */
      clearTk(index) {
            // this.tkRecord 里存放的是上一步的操作
            // console.log(this.tkRecord);
        if (index == 2) {
          this.removeTK(index)
          this.tkRecord[index] = { tk: { val: '' }, btk: { val: '' } };
        } else {
          let i = 0;
                // 循环删除当前选择index的值，下面的调课记录(例如：index为1 删除 1,2的记录,index为2 删除 0,1,2的记录)
          while (index < 3) {
            this.removeTK(2 - i)
            this.tkRecord[2 - i] = { tk: { val: '' }, btk: { val: '' } };
            index = index + 1;
            i = i + 1;
          }
        }
            // 如果是当前已经选择调课人没有选择被调课人,状态都置为初始化
        if (this.tkState == 1) {
          this.$set(this.realKbInfo[this.tkrObj.js - 1].px[this.tkrObj.zs - 1], 'istkr', false);
          this.tkrObj = {};
          this.tkState = 0;
          this.checkConflict();
        }
            // 点击删除某个记录this.tkState的状态置为0，为可选调课人的状态
        this.tkState = 0;
      },
        /**
         * 说明:移除当前下标的调课 参数调换记录的下标,只换教师课表,,用初始化状态的事件来改变当前显示的表格
         * 作者:RayJ
         * 更新时间:2019-1-24
         */
      removeTK(index) {
            // var tk = this.tkRecord[index].tk;
            // var btk = this.tkRecord[index].btk;
            // 避免引用的赋值...调课和被调课人的值赋值到tk,btk
        const tk = $.extend(true, {}, this.tkRecord[index].tk);
        const btk = $.extend(true, {}, this.tkRecord[index].btk);
            // 互换调课和被调课人的职工号
        tk.zgh = this.tkRecord[index].btk.zgh;

        btk.zgh = this.tkRecord[index].tk.zgh;
            // 谨防空数据和只有调课人，无被调课人，，目前的tk.zgh其实是btk人的，因为上面已经互换赋值了
        if (tk.zgh) {
                // console.log(tk,674)
                // console.log(btk,675)
                // 互换教师课表信息
          this.changeTeacherKB(tk, btk);
                // 初始化课表用处就是如果调课人和被调课人是在本周就可以立即看到改变的状态
          this.dateChange();
        } else {
                // console.log("这里是空列表信息")
        }
      },
        /**
         * 说明:初始化调课状态,选中或者非选中
         * 作者:RayJ
         * 更新时间:2019-1-26
         */
      initState() {
            // console.log(this.tkRecord,529);
        console.log('进了initState');
        console.log(this.tkRecord, 802);
            // console.log(this.realKbInfo,803);
        const week = this.getWeekNum();
        this.realKbInfo = {};
        this.realKbInfo = this.formatKB(this.curKbRes.kbres.data);
            // console.log(this.formatKB(this.curKbRes.kbres.data),9999)
            // // this.realKbInfo = this.formatKB(this.curKbRes.kbres.data);

            // console.log(this.realKbInfo,808)

        for (var i = 0; i < this.tkRecord.length; i++) {
                // tk.val!=空,btk.val==空,选择的周次==tk.week...表示已经选中调课人,未选被调课人,并切换回调课人所在周次
          if (this.tkRecord[i].tk.val != '' && this.tkRecord[i].btk.val != '' && week.toString() == this.tkRecord[i].tk.week) {
            console.log('aaa');
            var tkobj = $.extend(true, {}, this.realKbInfo[this.tkRecord[i].tk.pkjs - 1].px[this.tkRecord[i].tk.pkzs - 1]);
            tkobj.kcdm = this.tkRecord[i].btk.kcdm;
            tkobj.zgh = this.tkRecord[i].btk.zgh;
            console.log(tkobj);
            this.$set(this.realKbInfo[this.tkRecord[i].tk.pkjs - 1].px, this.tkRecord[i].tk.pkzs - 1, tkobj)
          }

          if (this.tkRecord[i].tk.val != '' && this.tkRecord[i].btk.val != '' && week.toString() == this.tkRecord[i].btk.week) {
            console.log('bbb');
            var tkobj = $.extend(true, {}, this.realKbInfo[this.tkRecord[i].btk.pkjs - 1].px[this.tkRecord[i].btk.pkzs - 1]);
            tkobj.kcdm = this.tkRecord[i].tk.kcdm;
            tkobj.zgh = this.tkRecord[i].tk.zgh;
            console.log(tkobj);
            this.$set(this.realKbInfo[this.tkRecord[i].btk.pkjs - 1].px, this.tkRecord[i].btk.pkzs - 1, tkobj)
          }

          if (this.tkState == 1) {
            console.log('ccc');
            if (this.tkRecord[i].tk.val != '' && this.tkRecord[i].btk.val == '' && week.toString() == this.tkRecord[i].tk.week) {
                        // console.log("这里是待选状态");
              this.$set(this.realKbInfo[this.tkRecord[i].tk.pkjs - 1].px[this.tkRecord[i].tk.pkzs - 1], 'istkr', true);
            }
          }
        }
            // 初始化当前课表的已申请的状态
        for (var i = 0; i < this.realKbInfo.length; i++) {
          for (let j = 0; j < this.realKbInfo[i].px.length; j++) {
            if (_.findIndex(this.processList, { pkjs: i + 1, pkzs: j + 1 }) != -1) {
              this.$set(this.realKbInfo[i].px[j], 'isprocess', true);
            }
          }
        }
        console.log(this.realKbInfo, 851);
            // console.log(this.realKbInfo);
            // 判断当前课表的交换权限
        this.checkConflict();
      },
        /**
         * 说明:初始化只标状态,不做任何操作比如可交换的权限判断，基本只用于tempRealKbInfo的值的更新,参数是week，传入周数。然后更新tempRealKbInfo里已经被改变过的值...以便于再一次交换
         * 作者:RayJ
         * 更新时间:2019-1-28
         */
      initStateOnly(week) {
            // console.log("还是进了这里")
            // 循环遍历目前已有的历史交换记录..把和自己周有关的交换都替换掉
        for (let i = 0; i < this.tkRecord.length; i++) {
          if (this.tkRecord[i].tk.val != '' && this.tkRecord[i].btk.val != '' && week.toString() == this.tkRecord[i].tk.week) {
            var tkobj = $.extend(true, {}, this.tempRealKbInfo[this.tkRecord[i].tk.pkjs - 1].px[this.tkRecord[i].tk.pkzs - 1]);
            tkobj.pkjs = this.tkRecord[i].btk.pkjs;
            tkobj.pkzs = this.tkRecord[i].btk.pkzs;
            tkobj.kcdm = this.tkRecord[i].btk.kcdm;
            tkobj.zgh = this.tkRecord[i].btk.zgh;
            this.$set(this.tempRealKbInfo[this.tkRecord[i].tk.pkjs - 1].px, this.tkRecord[i].tk.pkzs - 1, tkobj)
          }
          if (this.tkRecord[i].tk.val != '' && this.tkRecord[i].btk.val != '' && week.toString() == this.tkRecord[i].btk.week) {
            var tkobj = $.extend(true, {}, this.tempRealKbInfo[this.tkRecord[i].btk.pkjs - 1].px[this.tkRecord[i].btk.pkzs - 1]);
            tkobj.pkjs = this.tkRecord[i].tk.pkjs;
            tkobj.pkzs = this.tkRecord[i].tk.pkzs;
            tkobj.kcdm = this.tkRecord[i].tk.kcdm;
            tkobj.zgh = this.tkRecord[i].tk.zgh;
            this.$set(this.tempRealKbInfo[this.tkRecord[i].btk.pkjs - 1].px, this.tkRecord[i].btk.pkzs - 1, tkobj)
          }
        }
            // console.log(this.tempRealKbInfo,724);
      },
        /**
         * 说明:按周次得到原始课表...都存放临时课表数组里,用完就清空
         * 作者:RayJ
         * 更新时间:2019-1-27
         */
      async getKbInfo(yearweek) {
        let reskbinfo
        const paraObj = {
          schoolCode: localStorage.getItem('xxdm'),
          classCode: this.selnjbjweek.bj,
          time: yearweek
        }
        const classkbres = await api.Getbjlist(paraObj);
            // console.log(classkbres,574);
        reskbinfo = this.formatKB(classkbres.data)
            // console.log(this.tempRealKbInfo,576);
        return reskbinfo
      },
        /**
         * 说明:整理出本周的所有教师课表
         * 作者:RayJ
         * 更新时间:2019-1-27
         */
      sortTeacherKB(week, reskb) {
            // 先判断这周的老师课表是否存在
        const weekindex = _.findIndex(this.realTeacherKB, { week });
        if (weekindex == -1) {
                // 不存在就push一个新的空壳
          this.realTeacherKB.push({ week, teachkb: [] })
                // 循环所有课表记录
          for (let i = 0; i < reskb.length; i++) {
                    // 把没有出现过的老师push到数组里.
            const xindex = _.findIndex(this.realTeacherKB[this.realTeacherKB.length - 1].teachkb, { zgh: reskb[i].zgh })
            if (xindex == -1) {
              this.realTeacherKB[this.realTeacherKB.length - 1].teachkb.push({ zgh: reskb[i].zgh, kb: reskb[i].skListData })
            }
          }
                // console.log("进入了老师课表push")
        } else {
          return
        }
      },
        /**
         * 说明:取消所有排课，初始化表格
         * 作者:RayJ
         * 更新时间:2019-1-29
         */
      cancelSubmit() {
        this.clearTk(0);
        this.dateChange();
      },
        /**
         * 说明:清除所有调课记录
         * 作者:RayJ
         * 更新时间:2019-1-29
         */
      clearRecord() {
        this.clearTk(0);
        this.isShowKb = false;
      },

        /**
         * 说明:提交调换课申请
         * 作者:RayJ
         * 更新时间:2019-1-29
         */
      async exchangeSubmit() {
        const tkRecordList = [];
        let tkInfo = '';
        for (let i = 0; i < this.tkRecord.length; i++) {
          if (this.tkRecord[i].tk.val != '' && this.tkRecord[i].btk.val != '') {
            tkInfo = tkInfo + this.tkRecord[i].tk.val + ' 和 ' + this.tkRecord[i].btk.val + '进行了换课,'
            const tempTkObj = {};
            tempTkObj.xh = i;
            tempTkObj.tkbjdm = this.selnjbjweek.bj;
            tempTkObj.startTkr = this.tkRecord[i].tk.zgh;
            tempTkObj.startKc = this.tkRecord[i].tk.kcdm;
            tempTkObj.startDate = this.tkRecord[i].tk.year;
            tempTkObj.startZc = this.tkRecord[i].tk.pkzs;
            tempTkObj.startJc = this.tkRecord[i].tk.pkjs;
            tempTkObj.endTkr = this.tkRecord[i].btk.zgh;
            tempTkObj.endKc = this.tkRecord[i].btk.kcdm;
            tempTkObj.endDate = this.tkRecord[i].btk.year;
            tempTkObj.endZc = this.tkRecord[i].btk.pkzs;
            tempTkObj.endJc = this.tkRecord[i].btk.pkjs;
            tkRecordList.push(tempTkObj);
          }
        }
        const paraObj = {
          pkid: this.pkid,
          mbid: this.mbid,
          shzt: '1',
          tkyy: this.tkReason,
          tkmx: tkInfo,
          tkjlxxList: tkRecordList
        }
        if (tkInfo == '') {
          this.tipsXX('没有任何调课记录', 'warning');
          return;
        }
        if (this.tkReason == '') {
          this.tipsXX('请输入调课理由', 'warning');
          return;
        }
        if (this.tkReason.length > 50) {
          this.tipsXX('调课理由需小于50个字', 'warning');
          return;
        }

        console.log(paraObj, 933)
        const subres = await api.submitTdkInfo(paraObj)
        if (subres.status === 200) {
          this.tipsXX('提交申请成功', 'success');
          this.cancelSubmit();
          this.$router.push({ path: 'tdkManager/tkwh' })
        } else {
          this.tipsXX('提交失败', 'error');
        }
            // console.log(subres);
            // console.log(this.$route.query.mbid);
      },
        /**
         * 说明:判断是否在选择链上(必须保证一对选择链条上的都互相有关联)
         * 作者:RayJ
         * 更新时间:2019-2-13
         */
      checkInvolved(item) {
        console.log(item);
        console.log(this.tkRecord)
        if (this.tkRecord[0].tk.val == '') {
          return false
        }
        for (let i = 0; i < this.tkRecord.length; i++) {
          if (this.tkRecord[i].btk.pkjs == item.pkjs && this.tkRecord[i].btk.pkzs == item.pkzs) {
            return false
          }
          if (this.tkRecord[i].tk.pkjs == item.pkjs && this.tkRecord[i].tk.pkzs == item.pkzs) {
            return false
          }
        }
        return true
      },
        /**
         * 说明:返回同一时间不同教师的数据。。。
         * 作者:RayJ
         * 更新时间:2019-2-25
         */
      getRepeatInfo(kcdmList, zghList) {
        let repeatInfo = '';
            // console.log(kcdmList);
            // console.log(zghList);
        if (kcdmList && zghList) {
          for (let i = 0; i < zghList.length; i++) {
            if (kcdmList[i]) {
              repeatInfo = repeatInfo + this.getKcmc(kcdmList[i]) + ' ' + this.getTeacherName(zghList[i]) + '(合)<br>';
            }
          }
        }
        return repeatInfo;
      }









    }
  }
</script>
<style scoped lang="scss">
  .g_max{
      width: 100%;
      overflow: auto;
  }
  .g_content{
    width: 1400px;
  }
  .m_tk_left{
      width: 300px;
      min-height: 500px;
      float: left;
      border: 1px solid #efefef;
      padding: 10px;
      .f_padding{
          padding-bottom: 20px;
      }
      .u_tk_DetailTit{
          font-size: 18px;
          font-weight: 700;
      }
      .u_tk_RecordBox,.u_tk_ResultBox{
          padding: 10px 0;
      }
      .u_tk_ResultBox{
          border-bottom: 1px dotted #ccc;
      }
      .el-icon-sort{
          width: 100%;
          text-align: center;
      }
      .u_tk_col{
          white-space: nowrap;
          padding:5px 0;
          label{
              width:80px;
              padding-right:5px;
              text-align: right;
              font-weight: normal;
              font-size: 14px;
          }
          .el-textarea{
              margin: 5px 0;
          }
          .f_ipt{
              width:190px;
          }
      }
  }



  .m_tk_right{
      width: 1060px;
      min-height: 100px;
      float: left;
      padding-left: 10px;
      .u_tk_selbox{
          .f_sel{
              margin-right:10px;
          }
      }
      .u_tk_loadbox{
          min-height: 700px;
          width: 100%;
      }
      .u_tk_detailTable{
          margin-top: 10px;
      }
      .u_kb_table{
          border-collapse: collapse;
          td,th{
              border: 1px solid #ebeef5;
              height: 38px;
              line-height: 38px;
              padding: 0 5px;
          }
          th{
              background: #ddd;
              color:#606060;
              text-align: center;
              font-size: 16px;
              height: 58px;
              line-height: 58px;
              font-weight: normal;
          }
          td{
                padding:10px;
                text-align: center;
                .f_unit_box{
                    width: 100%;
                    height: 38px;
                    padding:0 10px;
                    text-align: left;
                    line-height: 38px;
                    border-radius: 3px;
                    border: 1px solid #FFF;
                    background: #FFF;
                    cursor: pointer;
                    transition: .2s all;
                    position: relative;

                }
                .f_unit_box.double{
                    font-size: 12px;
                    line-height: 22px;
                }
                .f_unit_box:hover{
                    border:1px solid #daf1d5;
                    background: #eff9ec;
                    color: #72c75c;
                }
                .f_unit_box.tkr{
                    border: 1px solid #63c249 !important;
                    background: #63c249 !important;
                    color: #FFF !important;
                    height: 38px;
                }
                .f_unit_box.change{
                    border: 1px solid #daf1d5;
                    background: #eff9ec;
                    color: #72c75c;
                    height: 38px;
                }
                .f_unit_box.change:hover{
                    text-align: left;
                    padding-left:5px;
                }
                .f_unit_box.change:hover::after{
                    content: '调';
                    width:34px;
                    height: 34px;
                    background: #63c249;
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    border-radius: 3px;
                    color: #FFF;
                    text-align: center;
                    line-height: 34px;
                }
                .f_unit_box.nochange:hover{
                    border: 1px solid #FFF;
                    background: #FFF;
                    color:#000;
                }
          }
          td.lock{
              background: #f6f6f6 !important;
              color:#333 !important;
          }
          td.lock .f_unit_box{
              background: #f6f6f6 !important;
              border: 1px solid #f6f6f6 !important;
          }
          td.doubleline{
              padding:8px 10px;
          }
          td.indexnum{
              font-weight: 700;
          }
          .f_kb_header{
              font-size: 18px;
          }
      }
  }

    @media screen and (max-width:1400px){
        .m_tk_right{
            width: 750px;
        }
        .g_content{
            width: 1100px;
        }
    }

.u_kb_submit{
    width: 100%;
    padding-bottom:15px;
    text-align: center;
}
.hackiptclear{
    position: relative;
    width: 190px;
    display: inline-block;
    em{
        width: 14px;
        height: 14px;
        color:#999;
        position: absolute;
        top: 9px;
        right: 9px;
        cursor: pointer;
        display: none;
    }
    em:hover{
        color:#ccc;
    }
}
.hackiptclear:hover em{
    display: block;
    z-index: 10;
}
</style>

