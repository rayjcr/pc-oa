<template>
  <div class="getcard">
    <div class="wrapper">
      <div>
        <span style="margin-right: 16px">查询条件</span>
        <el-input style="width: 472px;margin-right: 22px;" v-model="searchinput" placeholder="请输入学号或者姓名搜索">
          <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
        </el-input>
        <a @click="moreset=!moreset" style="color: #909399;">
          <i class="el-icon-caret-top edit_icon" v-if="moreset"></i>
          <i class="el-icon-caret-bottom edit_icon" v-else slot="icon"></i>
          <span v-if="moreset">收起更多</span>
          <span v-else>展开更多</span>
        </a>
      </div>
      <my-transition>
        <div v-show="moreset">

          
          <div style="margin-top: 32px;">
            <div style="margin-bottom: 6px;overflow:hidden;">
              <span style="float:left; margin-right: 20px">选择年级</span>
              <el-checkbox-group
                style="float: left; width: auto;"
                v-model="searchradionjdm"
                @change="searchGetradio"
              >
                <el-checkbox
                  v-for="itemraido in allnjArr"
                  :key="itemraido.uuid"
                  :label="itemraido.njdm"
                >{{itemraido.njmc}}</el-checkbox>
              </el-checkbox-group>
            </div>

            <div style="margin-top: 32px;">
              <div style="margin-bottom: 6px;overflow:hidden;">
                <span style="float:left; margin-right: 20px">选择班级</span>
                <el-checkbox-group
                  style="float: left; width: 50%;"
                  v-model="searchkplxlist"
                  @change="checkboxchange"
                >
                  <el-checkbox
                    v-for="itemraido in bjArr"
                    :key="itemraido.uuid"
                    :label="itemraido.uuid"
                  >
                    {{itemraido.bj}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>

          <div style="margin-top: 32px;">
            <span style="margin-right: 16px">所在学年</span>
            <el-radio v-for="item in xn" :key="item.xn" v-model="radioxn" :label="item.xn"></el-radio>
          </div>
          <div style="margin-top: 32px;">
            <span style="margin-right: 16px">所在学期</span>
            <el-radio
              v-for="item in xq"
              :key="item.xq"
              v-model="radioxq"
              :label="item.xq"
            >{{item.xqmc}}</el-radio>
          </div>
          <div style="margin-top: 32px;">
            <span style="margin-right: 16px">发卡时间 </span>
            <el-radio v-model="radiotime" @change="changeVal" label="1">按月份查询</el-radio>
            <el-radio v-model="radiotime" @change="changeVal" label="2">按日期查询</el-radio>
          </div>
          <div v-if="radiotime==='1'" style="margin-top: 32px;">
            <span style="margin-right: 45px">发卡月份 </span>
            <el-radio-group v-model="month">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button :label="1">1月</el-radio-button>
              <el-radio-button :label="2">2月</el-radio-button>
              <el-radio-button :label="3">3月</el-radio-button>
              <el-radio-button :label="4">4月</el-radio-button>
              <el-radio-button :label="5">5月</el-radio-button>
              <el-radio-button :label="6">6月</el-radio-button>
              <el-radio-button :label="7">7月</el-radio-button>
              <el-radio-button :label="8">8月</el-radio-button>
              <el-radio-button :label="9">9月</el-radio-button>
              <el-radio-button :label="10">10月</el-radio-button>
              <el-radio-button :label="11">11月</el-radio-button>
              <el-radio-button :label="12">12月</el-radio-button>
            </el-radio-group>
          </div>
          <div v-if="radiotime==='2'" style="margin-top: 32px;">
            <span style="margin-right: 16px">发卡日期</span>
            <el-date-picker
              class="fksj"
              value-format="yyyy-MM-dd"
              v-model="fksj"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      </my-transition>

      <div style="margin-top: 32px;" v-if="dynamicTags.length>0">
        <span style="margin-right: 16px">已选条件</span>
        <el-tag
          style="margin-right: 8px;"
          :key="tag.id + 'a' + index"
          v-for="(tag, index) in dynamicTags"
          :closable="!tag.dis"
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag.name}}</el-tag>
      </div>
    </div>

    <div style="margin-bottom: 12px;overflow: hidden;display: block;">
      <el-button style="float: right;" type="primary" @click="exportgetcard">导出</el-button>
    </div>

    <div class="kpsjdiv">
      <el-table
      border
      @header-click="dadsad"
      @sort-change="sortChange"
      :data="tableData.contentList"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item, index) in tableData.titleList"
        :key="item.prop"
        :label="item.label"
        :sortable="item.sortable"
        width="200">
        <template slot-scope="scope">
          <el-button 
          class="buttonnone" 
          v-if="item.clickable"
           @click.native="buttonClick(scope.$index, scope.row, scope.column, item.prop)"
                     type="primary">{{scope.row[item.prop]}}
          </el-button>
          <span v-else>{{scope.row[item.prop]}}</span>
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
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import MyTransition from '@/views/components/mtransition'
  import {
    allxn,
    allxq,
    dqxnxq,
    allnj,
    fkkpxx,
    gethklist,
    hkxq,
    exporthklist
  } from '@/api/projectapp/incentiveCard/';

  export default {
    name: 'detail',
    components: {
      MyTransition
    },
    data() {
      return {
        titleDataArray: [], // 卡片名称集合
        dhkplx: '', // 单行卡片类型
        dhxh: '', // 单行学号
        xq: [], // 学期
        xn: [], // 学年
        allnjArr: [], // 年级
        bjArr: [], // 班级
        searchradionjdm: [], // 年级集合
        searchkplxlist: [], // 班级集合
        page: 1, // 页数
        limit: 10, // 条数
        total: 0,
        kpmcnum: 1, // 卡片数量初始值
        nokplx: false, // 没有卡片类型
        month: '', // 发卡月份
        kplxlist: [], // 卡片类型
        searchinput: '', // 搜索字段
        radiotime: '1', // 查询时间
        szcksszlx: '1', // 设置持卡数设置类型
        inputindex: '', // 增减值
        szcksl: false, // 设置持卡数量弹层
        szcksSzlx: false, // 设置持卡数设置类型显示
        plszckslradio: '1', // 批量设置持卡数量 单选
        selectxq: '', // 请选择学年
        selectxn: '', // 请选择学期
        fksj: '', // 发卡时间
        fzz: '2018-2019 下学期', // 当前学年学期
        xnoptions: [{
          value: '选项1',
          label: '2018-2019'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        xqoptions: [{
          value: '选项1',
          label: '上学期'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        dynamicTags: [], // 已选条件
        dialogVisible: false,
        moreset: false,
        activeName: '1',
        radioxn: '',
        radioxq: '',
        currentPage4: 1,
        cardForm: {
          name: '',
          region: '',
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
          value: '',
          radio: '1'
        },
        tableData: []
        // tableData: [{
        //   date: '一级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '二级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1517 弄'
        // }, {
        //   date: '三级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1519 弄'
        // }, {
        //   date: '四级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1516 弄'
        // },{
        //   date: '一级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '二级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1517 弄'
        // }, {
        //   date: '三级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1519 弄'
        // }, {
        //   date: '四级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1516 弄'
        // },{
        //   date: '一级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '二级',
        //   date1: '白银',
        //   role: '5个普通卡兑换一个一级卡',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1517 弄'
        // }]
      }
    },
    computed: {},
    mounted() {
      const val = this.radiotime
      let timeobj;
      timeobj = {}
      timeobj.dis = true
      timeobj.id = 't' + val
      if (val === '1') {
        this.fksj = []
        timeobj.name = '发卡月份'
      } else {
        this.month = ''
        timeobj.name = '发卡日期'
      }
      this.dynamicTags.push(timeobj);
      this.allnjArr = [];
      this.xxdm = localStorage.getItem('xxdm');
      this.getxq()
      this.getxn()
      this.getdqxnxq();
    },
    methods: {
      changeVal(val) {
        this.dynamicTags = [];
        let timeobj;
        timeobj = {}
        timeobj.dis = true
        timeobj.id = 't' + val
        if (val === '1') {
          this.fksj = []
          timeobj.name = '发卡月份'
        } else {
          this.month = ''
          timeobj.name = '发卡日期'
        }
        this.dynamicTags.push(timeobj);
  
        this.searchradionjdm.forEach((item, index) => {
          this.allnjArr.forEach(itema => {
            let obj;
            if (itema.njdm == item) {
              obj = {};
              obj.id = itema.njdm;
              obj.name = itema.njmc;
              this.dynamicTags.push(obj);
            }
          });
        });
  
        this.searchkplxlist.forEach((item, index) => {
          this.bjArr.forEach(itema => {
            let obj;
            if (itema.uuid == item) {
              obj = {};
              obj.id = itema.uuid;
              obj.name = itema.bj;
              this.dynamicTags.push(obj);
            }
          });
        });
      },
  
      /**
       * @description: 搜索
       * @param {type}
       * @return:
       */
      search() {
        this.page = 1
        this.getallnjbj();
        this.gethklistnet()
        // this.getdqxnxq();
      },
    /**
     * @description: 获取所有学期
     * @param {type}
     * @return:
     */
      async getxq() {
        await allxq({ xxdm: this.xxdm }).then(res => {
          this.xq = res;
        });
      },


  
    /**
     * @description: 获卡详情
     * @param {type}
     * @return:
     */
      async gethkxq(kplx, xh, bc, xm, bjmc) {
        await this.fkjl(this.radioxn, this.radioxq, kplx, xh, this.xxdm, bc, xm, bjmc)
      },

    /**
     * @description: 获取所有学年
     * @param {type}
     * @return:
     */
      async getxn() {
        const xxdm = this.xxdm = window.localStorage.getItem('xxdm');
        await allxn({ xxdm }).then(res => {
          this.xn = res;
        });
      },
    /**
     * @description: 获取当前学期学年
     * @param {type}
     * @return:
     */
      async getdqxnxq() {
        await dqxnxq({ xxdm: this.xxdm }).then(r => {
          if (r.status === 200) {
            this.radioxn = r.data.xn;
            this.radioxq = r.data.xq;
            this.getallnjbj();
            this.gethklistnet()
          } else {
            this.$message({
              type: 'error',
              message: r.message
            });
          }
        });
      },
    /**
     * @description:获取所有年级班级
     * @param {type}
     * @return:
     */
      async getallnjbj() {
        await fkkpxx({
          xxdm: this.xxdm,
          xndm: this.radioxn
        }).then(r => {
          if (r.status === 200) {
            this.bjArr = [];
            this.allnjArr = r.data;
            const arr = r.data;
            arr.forEach(item => {
              if (item.bjList && item.bjList.length > 0) {
                const bjList = item.bjList;
                for (let i = 0; i < bjList.length; i++) {
                  this.bjArr.push(bjList[i]);
                }
              }
            });
          } else {
            this.$message({
              type: 'error',
              message: r.message
            });
          }
        });
      },
  
    /**
     * @description:获取所有年级
     * @param {type}
     * @return:
     */
      async getallnj() {
        const that = this;
        await allnj({
          xxdm: this.xxdm
        }).then(res => {
          that.allnjArr = res;
        });
      },

    /**
     * @description: 去重
     * @param {type}
     * @return:
     */
      removeRepeatArrElement(arr) {
        const newArray = arr.sort();
        const newArr = [];
        const len = newArray.length;
        for (let i = 0; i < len; i++) {
          if (newArray[i] != newArray[i + 1]) {
            newArr.push(newArray[i]);
          }
        }
        return newArr
      },

    // 获取年级
      getradio(val) {
        this.allnjArr.forEach(item => {
          if (item.njdm === val) {
            this.bjArr = item.bjList;
          }
        });
      },
    /**
     * @description: 班级触发事件
     * @param {type}
     * @return:
     */
      checkboxchange(value) {
        this.dynamicTags = [];
        let timeobj;
        const val = this.radiotime
        timeobj = {}
        timeobj.id = val
        if (val === '1') {
          this.fksj = []
          timeobj.name = '发卡月份'
        } else {
          this.month = ''
          timeobj.name = '发卡日期'
        }
        timeobj.dis = true
        this.dynamicTags.push(timeobj);
        this.searchradionjdm.forEach((item, index) => {
          this.allnjArr.forEach(itema => {
            let obj;
            if (itema.njdm == item) {
              obj = {};
              obj.id = itema.njdm;
              obj.name = itema.njmc;
              this.dynamicTags.push(obj);
            }
          });
        });
        value.forEach((item, index) => {
          this.bjArr.forEach(itema => {
            let obj;
            if (itema.uuid == item) {
              obj = {};
              obj.id = itema.uuid;
              obj.name = itema.bj;
              this.dynamicTags.push(obj);
            }
          });
        });
      },
  
    /**
     * @description: 年级触发事件
     * @param {type}
     * @return:
     */
      searchGetradio(value) {
        let timeobj;
        const val = this.radiotime
        this.dynamicTags = [];
        timeobj = {}
        timeobj.id = val
        if (val === '1') {
          this.fksj = []
          timeobj.name = '发卡月份'
        } else {
          this.month = ''
          timeobj.name = '发卡日期'
        }
        timeobj.dis = true
        this.dynamicTags.push(timeobj);
        this.searchkplxlist.forEach((item, index) => {
          this.bjArr.forEach(itema => {
            const obj = {};
            if (itema.uuid == item) {
              obj.id = itema.uuid;
              obj.name = itema.bj;
              this.dynamicTags.push(obj);
            }
          });
        });
        value.forEach((item, index) => {
          this.allnjArr.forEach(itema => {
            const obj = {};
            if (itema.njdm == item) {
              obj.id = itema.njdm;
              obj.name = itema.njmc;
              this.dynamicTags.push(obj);
            }
          });
        });
      },
      // 获卡查询列表
      async gethklistnet(px, lx) {
        let tempArr;
        let arr;
        arr = []
        tempArr = this.searchradionjdm.concat();
        tempArr.forEach((itema, indexa) => {
          this.allnjArr.forEach(itemb => {
            if (itemb.njdm === itema) {
              if (itemb.bjList.length > 0) {
                itemb.bjList.forEach(itemc => {
                  this.searchkplxlist.forEach((itemd, indexd) => {
                    if (itemd === itemc.uuid) {
                      arr.push(itema)
                    // tempArr.splice(indexa, 1)
                    // return
                    }
                  })
                })
              }
            }
          })
        })

        const arr3 = this.removeRepeatArrElement(arr)
        arr3.forEach((itema, index) => {
          tempArr.forEach((itemb, idnexb) => {
            if (itemb === itema) {
              tempArr.splice(idnexb, 1)
            }
          })
        })

        const self = this;
        await gethklist({
          query: {
            page: self.page,
            limit: self.limit
          },
          bjList: this.searchkplxlist,
          njList: tempArr,
          xn: this.radioxn,
          xq: this.radioxq,
          xxdm: this.xxdm,
          month: this.month,
          kssj: this.fksj[0] || '',
          jssj: this.fksj[1] || '',
          page: self.page,
          limit: self.limit,
          sortDirection: px || '',
          sortField: lx || '',
          xh: this.searchinput,
          xm: this.searchinput
        }).then(res => {
          this.total = res.data.total
          this.tableData = res.data
          this.titleDataArray = res.data.titleList
          // self.tableData = res.data.rows.map(item => {
          //
          //   if (item.xqdm === '01') {
          //     item.xqmc = '上学期';
          //   } else {
          //     item.xqmc = '下学期';
          //   }
          //   return item;
          // });
        });
      },
      // 获卡记录详情
      fkjl(xn, xq, kplx, xh, xxdm, bc, xm, bjmc) {
        this.$router.push({
          path: '/incentiveCard/getCardxq',
          query: {
            xn, xq, kplx, xh, xxdm, bc, xm, bjmc
          }
        })
      },

      /**
       * @description: 导出获卡记录
       * @param {type}
       * @return:
       */
      async exportgetcard() {
        let tempArr;
        let arr;
        arr = []
        tempArr = this.searchradionjdm.concat();
        tempArr.forEach((itema, indexa) => {
          this.allnjArr.forEach(itemb => {
            if (itemb.njdm === itema) {
              if (itemb.bjList.length > 0) {
                itemb.bjList.forEach(itemc => {
                  this.searchkplxlist.forEach((itemd, indexd) => {
                    if (itemd === itemc.uuid) {
                      arr.push(itema)
                    // tempArr.splice(indexa, 1)
                    // return
                    }
                  })
                })
              }
            }
          })
        })

        const arr3 = this.removeRepeatArrElement(arr)
        arr3.forEach((itema, index) => {
          tempArr.forEach((itemb, idnexb) => {
            if (itemb === itema) {
              tempArr.splice(idnexb, 1)
            }
          })
        })


        await exporthklist({
          bjList: this.searchkplxlist,
          njList: tempArr,
          xn: this.radioxn,
          xq: this.radioxq,
          xxdm: this.xxdm,
          month: this.month,
          kssj: this.fksj[0] || '',
          jssj: this.fksj[1] || '',
          xh: this.searchinput,
          xm: this.searchinput
        }).then(res => {
          // 创建数据流
          const excelBlob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });

          // 创建下载元素
          const oA = document.createElement('a');

          // 利用URL.createObjectURL()方法为a元素生成blob URL
          oA.href = URL.createObjectURL(excelBlob);

          // 给文件命名
          oA.download = '获卡查询.xls';
          document.body.appendChild(oA);

          // 创建事件
          const evt = document.createEvent('MouseEvents');
          // 创建兼容
          evt.initEvent('click', false, false);
          oA.dispatchEvent(evt);
  
          // 移除下载元素
          document.body.removeChild(oA);

          // 释放链接
          URL.revokeObjectURL(oA);
        });
      },
      szcksdialogyes() {
  
      },
      handleClose(tag) {
        const dynamicTags = this.dynamicTags;
        const searchradionjdm = this.searchradionjdm;
        const searchkplxlist = this.searchkplxlist;
        dynamicTags.forEach((item, tagindex) => {
          if (item.id === tag.id) {
            this.dynamicTags.splice(tagindex, 1);
            searchradionjdm.forEach((itemb, indexb) => {
              if (itemb == tag.id) {
                this.searchradionjdm.splice(indexb, 1);
                return;
              }
            });

            searchkplxlist.forEach((itemb, indexb) => {
              if (itemb == tag.id) {
                this.searchkplxlist.splice(indexb, 1);
                return;
              }
            });

            if ('t' + this.radiotime == item) {
              this.month = ''
              this.fksj = ''
              this.radiotime = '1'
            }
          }
        });
      },
      handleSizeChange(val) {
        this.limit = val;
        this.gethklistnet()
      },
      handleCurrentChange(val) {
        this.page = val;
  
        this.gethklistnet()
      },
      // 排序改变事件
      sortChange(sortChange) {
        let px;
        let lx;
        if (sortChange.order === 'descending') {
          px = 'DESC'
        } else {
          px = 'ASC'
        }
        const lxmc = sortChange.column.label
        const titleList = this.tableData.titleList;
        titleList.forEach(item => {
          if (item.label === lxmc) {
            lx = item.prop
          }
        })
        this.gethklistnet(px, lx)
      },

      // 头部点击事件
      dadsad(column, event) {
  
  
  
  
      },

      // 约束单元格点击事件
      buttonClick(index, row, col, prop) {
        let value;
  
        this.titleDataArray.forEach(item => {
          if (col.label === item.label) {
            value = item.prop
          }
        })
        this.gethkxq(value, row.xh, col.label, row.xm, row.bjmc)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../commonsty/common";

  .getcard {
    min-width: 1025px;
    padding: 32px 24px;
    .wrapper {
      border: $block-wrapper;
      padding: $block-wrapper-padding;
      border-radius: 4px;
      box-shadow: $block-wrapper-boxshadow;
      margin-bottom: 12px;
    }
    .kpsjdiv {
      // height: 733px;
      border-radius: 3px;
    }
  }

</style>
<style>
  .getcard .el-collapse-item__header {
    padding: 18px 41px !important;
    line-height: 14px;
    font-size: 14px;
    color: #909399;
    margin: 0 !important;
  }
  .getcard .fakajilulx {
    border-top: 1px solid #ebeef5;
  }

  .getcard .el-collapse-item__content div {
    padding: 5px 41px !important;
    line-height: 14px;
    font-size: 14px;
    color: #909399;
    margin: 0 !important;
  }

  .getcard .el-collapse-item__arrow {
    line-height: 14px !important;
  }

  .getcard .el-table td, .getcard .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
    padding: 18px 36px;
    font-size: 14px;
  }

  .getcard .bigimg img {
    width: 160px;
    height: 72px;
    border-radius: 2px;
  }

  .getcard .lookBigPic {
    display: none;
    line-height: 14px !important;
  }

  .getcard .el-dialog {
    width: 740px;
    margin-top: 10% !important;
  }

  .getcard .bigimg:hover .lookBigPic {
    position: absolute;
    display: block;
    background-color: rgba(148, 148, 148, 0.69);
    color: #fff;
    width: 160px;
    padding: 10px 0;
    text-align: center;
    bottom: 0;
    line-height: 14px !important;
  }

  .getcard .el-tag + .el-tag {
    margin-left: 10px;
  }

  .getcard .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .getcard .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .getcard .el-dialog {
    width: 461px !important;
  }

  .getcard .xnselect {
    width: 130px !important;
    margin: 0 10px 32px 0;
  }

  .getcard .xqselect {
    width: 120px !important;
  }

  .getcard .kplxcheck .el-checkbox {
    margin-right: 30px !important;
  }

  .getcard .szcksldialog .el-dialog {
    width: 600px !important;
  }

  .getcard .szcksldialog .el-radio-group {
    padding-top: 6px !important;
  }

  .getcard .kplxcheck .el-checkbox + .el-checkbox {
    margin-left: 0 !important;
  }

  .getcard .el-date-editor .el-range-separator {
    width: 20px !important;
  }

  .getcard .el-tabs--border-card > .el-tabs__content {
    padding: 15px 0 !important;
    border-top: 1px solid #ebeef5;
  }

  .getcard .szcksdialog .el-dialog {
    width: 800px !important;
  }

  .getcard .szcksdialog .el-radio-group {
    padding-top: 6px !important;
  }
  .getcard .dxnrp {
    padding: 2px 10px;
    line-height: 35px;
    color: #606266;
    background-color: #f5f7fa;
    text-indent: 2em;
  }

  .getcard .dxnr {
    display: inline-block;
    margin-bottom: 3px;
    color: #303133;
  }

  .getcard .fsdxtitle {
    display: inline-block;
    width: 100px;
    margin-right: 16px;
    color: #303133;
  }
  .getcard .el-table td,
  .getcard .el-table th.is-leaf{
    padding: 10px 5px !important;
  }

  .getcard .el-input-number {
    width: 145px !important;
  }

  .getcard .changea {
    margin: -6px 0 0 15px !important;
  }
  .getcard .bottomstyl {
    height: 40px;
    line-height: 40px;
    padding-left: 16px;
    background-color: #fdf6ec;
    border-radius: 4px;
    font-size: 14px;
    color: #e6a23c;
  }
  .getcard .buttonnone{
    background: none !important;
    color: #409eff !important;
    border: none !important;
  }
  .getcard .el-tabs--border-card {
    height: 733px;
    overflow: hidden;
  }

  .getcard .kpsjdivcard {
    margin: 20px 0!important;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0px;
    margin-left: 24px !important;
    color: #909399;
  }
  .getcard .el-checkbox + .el-checkbox,
.getcard .el-checkbox {
  margin-right: 30px !important;
  margin-left: 0px !important;
}
</style>
