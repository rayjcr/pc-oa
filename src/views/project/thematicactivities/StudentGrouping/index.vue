<template>
  <div class="app-container">
    <div class="u_TableMain">
      <div class="filter-container clear">
        <el-form :model="formSearch" ref="Searchform" label-position="left" class="left">
          <el-row style="min-width:600px; padding-left:20px;">
            <el-form-item label="报告单选项" style="width:325px;float: left;margin-bottom: 10px;">
              <el-select v-model="formSearch.xmid" value-key="uuid" clearable placeholder="选择项目" @change="searchFn(formSearch.xmid, 'xm')">
                <el-option v-for="(item,index) in xmlist" :key="index" :label="item.mc" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级" style="width:220px;float: left;margin-bottom: 10px;">
              <el-select style="width:150px;" v-model="formSearch.bjid" value-key="uuid" clearable placeholder="选择班级" @change="searchFn(formSearch.bjid, 'bj')">
                <el-option v-for="(item,index) in bjlist" :key="index" :label="item.bj" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动名称" style="width:325px;float: left;margin-bottom: 10px;">
              <el-select style="width:200px;" v-model="formSearch.hdfxid" value-key="uuid" clearable placeholder="请选择活动" @change="searchFn(formSearch.hdfxid, 'hdfx')">
                <el-option v-for="(item,index) in hdfx" :key="index" :label="item.bm" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="float: left;">
              <el-checkbox v-model="formSearch.copyOthers">复制其他活动的分组</el-checkbox>
              <el-select v-if="formSearch.copyOthers" v-model="formSearch.copy" value-key="uuid" clearable placeholder="请选择活动" @change="copyGroup(formSearch)">
                <el-option v-for="(item,index) in hdfx" :key="index" :label="item.bm" :value="item" v-if="formSearch.hdfxid!=item"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="m_GenTableBox">
        <div class="t_conmain"  v-loading.body="listLoading">
          <div class="table_left">
            <div class="table_left_top">
              <div class="Table_header">组名</div>
              <div class="Table_input">
                <el-input size="small" maxlength="10" style="width: 100px;" v-model="groupname" placeholder="请输入内容"></el-input>
                <el-button size="small" style="width: 80px;" type="primary" @click.stop="addgroup">添加组</el-button>
              </div>
            </div>
            <el-table
              border
              ref="grouptable"
              :data="tableData"
              style="width: 100%"
              @row-click="selectRowKc"
              :row-class-name="tableRowClassName">
              <el-table-column
                type="index"
                :index="indexMethod"
                width="50">
              </el-table-column>
              <el-table-column
                prop="mc"
                label="组名"
                width="150">
              </el-table-column>
            </el-table>
          </div>
          <div class="content">
            <div style="text-align: center;height: 100%;">
              <el-button type="primary" @click.stop="deleteAllgroup" style="position: absolute;left: 10px;top: 40%;">清空所有组</el-button>
              <el-button type="danger" @click.stop="delegroup" style="position: absolute;left: 10px;top: 50%;margin-left: 0;">删除组</el-button>
              <el-transfer
                style="text-align: left; display: inline-block;"
                v-model="value4"
                :titles="['班级学生名单', '小组学生名单']"
                :button-texts="['退出组', '加入组']"
                :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}'
                }"
                @change="handleChange"
                :data="datas">
                <span slot-scope="{ option }">{{ option.label }}</span>
              </el-transfer>
              <!-- :left-default-checked="[2, 3]"
                :right-default-checked="[1]" -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="canceldel">
      <span>确认删除小组？一旦删除将无法恢复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canceldel">取 消</el-button>
        <el-button type="primary" @click="confirmdel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  /**
   * @description: getBj （获取班级列表）， Getylbgd （获取报告单预览项目）
   * @param {type} 
   * @return: 
   */
  import * as avtive from "api/project/reportActive/index" // 主题活动报告单主用api
  import  * as reportapi from "api/project/report/index"; // 获取报告单相关数据api
  export default{
    data () {
      return {
        dialogVisible: false,
        datas: [], // 穿梭框用数据
        value3: [],
        value4: [], // 穿梭框已选数据

        hhh: 2,
        tableData: [
          // {name: '书法组', id: '1'},
        ], // 表格数据
        groupname: '', // 组名
        listLoading: false,      // 页面加载
        formSearch: {
          xmxm: {}, // 项目
          bjid: {}, // 班级
          hdfxid: {}, // 活动分析
          copyOthers: false,//是否复制
          copy: {},//复制的对象
        },
        hdfx: [], // 活动分析
        bjlist: [], // 班级列表
        listQuery:{  // 数据请求参数              
          xxdm: window.localStorage.getItem('xxdm'),
          lx: 2,
          pageIndex: 1,
          pageSize: 1000,
        },
        xmlist:[], // 项目列表
        bjcs:{ // 获取年级全部班级参数
          xxdm: '',
          njdm: '',
          xn: '',
        },
        bgdhdfz:{ // 获取报告单活动分组参数
          xxdm: window.localStorage.getItem('xxdm'),
          bgdid: '', // 报告单编号
          bgdszid: '', // 报告单设置编号
          bjdm: '', // 班级代码
        },
        sfktj: false, // 是否可添加分组
        hdfxzc: [], // 活动分析数据暂存
        xq: '', // 学期
        first: true, // 是否第一次加载
        dataIndex:0,
        bgdfz: { // 添加/修改组成员参数
          xxdm: window.localStorage.getItem('xxdm'),
          xn: '',
          xq: '',
          bgdfzid: '', // 报告单分组编号
          list:[], // 组成员
          isenter: 0, // 1入组， 2退出
        },
        grouplist: [], // 组成员暂存
        selectedgroup: [], // 已加入小组成员数据
        selectedgrouplist: [], // 已选成员uuid
        xgcylist: [], // 修改组成员
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      // 数据初始化
      init(){
        this.getList()
      },
      // 删除小组(根据小组id)
      delegroup(){
        if (this.bgdfz.bgdfzid) {
          this.dialogVisible = true
        } else {
          this.tipsXX('没有你要删除的数据！', 'info', '提示')
        }
      },
      //清空所有组
      deleteAllgroup(){
        this.$confirm('确认清空所有组吗，确认后不可恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            XXDM: this.bgdhdfz.xxdm,
            BGDId: this.bgdhdfz.bgdid,
            BGDSZId: this.bgdhdfz.bgdszid,
          }
          avtive.cleargroup(params).then(data => {
            if (data.status === 1) {
              this.dataIndex = 0;
              this.value4 = []
            } else {
              this.tipsXX(data.message, 'warning', '提示')
            }
          })  
          // this.tableData = [];
          setTimeout(() => {
            this.getActivityanalysis(this.bgdhdfz)
            // 第一次加载获取班级学生
            if (this.first && this.bgdhdfz.bjdm !== '') {
              let params = {
                bjid: this.bgdhdfz.bjdm,
                xn: this.bjcs.xn,
                xxdm: this.listQuery.xxdm
              }
              this.getallstu(params)
            }
          }, 500)

        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
      },
      //复制分组
      copyGroup(formdata){
        console.log(formdata)
        var params = {
          XXDM: window.localStorage.getItem('xxdm'),
          BGDId : this.bgdhdfz.bgdid,
          BGDSZId : formdata.copy.uuid,
          CopyToBGDId : this.bgdhdfz.bgdid,
          CopyToBGDSZId : formdata.hdfxid.uuid,
        }
        avtive.copyGroup(params).then(res => {
          if(res.status==1){
            this.tipsXX('复制分组成功！','success','提示')
            setTimeout(() => {
              this.getActivityanalysis(this.bgdhdfz)
              // 第一次加载获取班级学生
              if (this.first && this.bgdhdfz.bjdm !== '') {
                let params = {
                  bjid: this.bgdhdfz.bjdm,
                  xn: this.bjcs.xn,
                  xxdm: this.listQuery.xxdm
                }
                this.getallstu(params)
              }
            }, 500)
          } else {
            this.tipsXX(res.message,'error','提示')
          }
        })
      },
      canceldel(){ // 取消删除
        this.dialogVisible = false
      },
      confirmdel(){ // 确认删除
        // console.log(this.tableData)  
        avtive.delgroup({id:this.bgdfz.bgdfzid}).then(data => {
          if (data.status === 1) {
            this.tableData.forEach((el, index) => {
              if (el.uuid === this.bgdfz.bgdfzid) {
                this.tableData.splice(index, 1)
              }
              this.dataIndex = 0;
            })
            setTimeout(() => {
              this.getActivityanalysis(this.bgdhdfz)
              // 第一次加载获取班级学生
              if (this.first && this.bgdhdfz.bjdm !== '') {
                let params = {
                  bjid: this.bgdhdfz.bjdm,
                  xn: this.bjcs.xn,
                  xxdm: this.listQuery.xxdm
                }
                this.getallstu(params)
              }
            }, 500)
            this.dialogVisible = false
          } else {
            this.tipsXX(data.message, 'warning', '提示')
          }
        })
      },

      // 获取分组成员
      getGroupNum(params){
        this.value4 = []
        // console.log(params,220033)
        avtive.getgroupNum(params).then(data => {
          // console.log(data,220055)
          // 数据处理

          if (this.bgdfz.isenter === 2) {
            this.selectedgroup.forEach((el, index) => {
              this.bgdfz.list.forEach((item, ited) => {
                if (item.xh === el.xh && el.uuid === item.uuid) {
                  this.selectedgroup.splice(index, 1)
                }
              })
            })
          }

          if (data.status === 1 && data.data.length) {
            data.data.forEach(el => {
              this.value4.push(JSON.stringify({xh: el.xh, xm: el.xm}))
              this.selectedgrouplist.push(el)
              // 数据处理
              this.bgdfz.list.forEach((item, index) => {
                if (item.xh === el.xh && this.bgdfz.isenter === 1) {
                  this.selectedgroup.push(el)
                }
              })
            })
          }

          var arr = JSON.parse(JSON.stringify(this.selectedgroup))
          if (this.value4.length) {
            
            if (arr.length > this.value4.length) {
              // console.log(this.value4,223355)
              this.selectedgroup.forEach((item, index) => {
                this.datas.forEach((ite, iteindex) => {
                  if (ite.xh === item.xh && ite.label === item.xm) {
                    this.$set(ite, 'disabled', false)
                  }
                })
              })
              this.value4.forEach((isd,isdindex) => {
                arr.forEach((item, itemindex) => {
                  if (JSON.parse(isd).xh === item.xh && JSON.parse(isd).xm === item.xm) {
                    // console.log(itemindex)
                    arr.splice(itemindex, 1)
                  }
                })
              })
              // console.log('我是arr')
              // console.log(arr)
              arr.forEach((item, index) => {
                this.datas.forEach((ite, iteindex) => {
                  if (ite.xh === item.xh && ite.label === item.xm) {
                    this.$set(ite, 'disabled', true)
                  }
                })
              })
            } else if (arr.length === this.value4.length) {
              arr.forEach((item, index) => {
                this.datas.forEach((ite, iteindex) => {
                  if (ite.xh === item.xh && ite.label === item.xm) {
                    this.$set(ite, 'disabled', false)
                  }
                })
              })
            }
          } else {
            // console.log('走了吗？')
            // console.log(this.selectedgroup)
            this.selectedgroup.forEach((item, index) => {
              this.datas.forEach((ite, iteindex) => {
                if (ite.xh === item.xh && ite.label === item.xm) {
                  this.$set(ite, 'disabled', true)
                  //  ite.disabled = true
                }
              })
            })
          }
          this.bgdfz.isenter = 0
        })
      },

      // 选择分组小组
      selectRowKc(val){
        // console.log(val)
        
        this.value4 = []
        this.dataIndex = val.index
        this.bgdfz.bgdfzid = val.uuid
        let params = {
          xn: this.bjcs.xn,
          xq: this.xq,
          xxdm: this.listQuery.xxdm,
          bgdfzid: val.uuid
        }
        this.getGroupNum(params)
      },

      //科目列表选中样式切换
      tableRowClassName({row, rowIndex}) {
        // console.log(444)
        // console.log('index值')
        // console.log(row)
        // console.log(rowIndex)
        // console.log(this.dataIndex)
        row.index = rowIndex;
        if (rowIndex == this.dataIndex) {
          return 'selectedRows';
        }
        return '';
      },

      /**
       * @description: 根据班级代码获取班级学生
       * @param {bjid, xn, xxdm} that.bjcs.xn  that.bgdhdfz.bjdm  this.listQuery.xxdm
       * @return: 学生数据列表
       */
      getallstu(value){
        // console.log('宋小宝')
        // console.log(value)
        this.datas = []
        avtive.Getallbjxslist(value).then(data =>{
          // console.log(data)
          if (data && data.length) {
            data.forEach((el, index) => {
              this.datas.push({
                key: JSON.stringify({xh:el.xh,xm:el.xm,}),
                xh: el.xh,
                label: el.xm
              })
            })
            var arr = JSON.parse(JSON.stringify(this.selectedgroup))
            if (this.value4.length) {
              this.value4.forEach((isd,isdindex) => {
                arr.forEach((item, itemindex) => {
                  if (JSON.parse(isd).xh === item.xh && JSON.parse(isd).xm === item.xm) {
                    arr.splice(itemindex, 1)
                  }
                })
              })
              // console.log(arr)
              arr.forEach((item, index) => {
                this.datas.forEach((ite, iteindex) => {
                  if (ite.xh === item.xh && ite.label === item.xm) {
                    this.$set(ite, 'disabled', true)
                  }
                })
              })
            } else {
              // console.log('走了吗？')
              // console.log(this.selectedgroup)
              this.selectedgroup.forEach((item, index) => {
                this.datas.forEach((ite, iteindex) => {
                  if (ite.xh === item.xh && ite.label === item.xm) {
                    this.$set(ite, 'disabled', true)
                    //  ite.disabled = true
                  }
                })
              })
            }
          }
        })
      },

      // 获取报告单活动分析分组
      getActivityanalysis(value){
        this.tableData = []
        this.selectedgroup = []
        avtive.GetActiveGroup(value).then(data => {
          // console.log(data)
          if (data.status === 1 && data.data.length) {
            var that = this
            data.data.forEach((el, index) => {
              if (el.fzCyList) {
                el.fzCyList.forEach(item => { // 已经分组学生数据处理
                  that.selectedgroup.push(item)
                })
              }
              if (el.bgdid === that.bgdhdfz.bgdid && el.bgdszid === that.bgdhdfz.bgdszid && el.bjid === that.bgdhdfz.bjdm) {
                that.tableData.push(el)
              }
            })
            // console.log(this.tableData)
            // console.log(this.selectedgroup)
            this.bgdfz.bgdfzid = this.tableData.length?this.tableData[0].uuid:null
            
            setTimeout(() => { // 延时执行以免数据处理无法完成
              let paramss = {
                xn: this.bjcs.xn,
                xq: this.xq,
                xxdm: this.listQuery.xxdm,
                bgdfzid: this.tableData.length?this.tableData[0].uuid:null
              }
              this.getGroupNum(paramss) // 获取分组成员
            }, 100)
            
          }
        })
      },

      // 根据年级代码获取全年级班级列表
      getbjlist(val){
        // console.log(666)
        // console.log(val)
        // console.log(this.bjcs.xn)
        // console.log(this.bjcs.xxdm)
        this.bjcs.njdm = val.njdm
        avtive.getBj({xxdm:this.bjcs.xxdm,xn:this.bjcs.xn,njdm:val.njdm}).then(data => {
          // console.log(data)
          var that = this
          this.hdfx = []
          if ( data && data.length) {
            if (data && data.length) {
              data.forEach(el => {
                that.bjlist.push(el)
              })
            }
            // console.log(this.bjlist,504)
            this.bjlist = this.sortBjlist(this.bjlist);
            this.formSearch.bjid = this.bjlist[0] // 绑定第一个班级
            this.bgdhdfz.bjdm = this.bjlist[0].uuid
            this.hdfxzc.forEach(its => {
              if (its.njdm === this.bjlist[0].njdm && its.lx === 13) {
                that.hdfx.push(its)
              }
            })
            // console.log(this.hdfx)
            this.formSearch.hdfxid = this.hdfx[0]?this.hdfx[0]:{} // 默认绑定初始值
            this.bgdhdfz.bgdszid = this.hdfx.length?this.hdfx[0].uuid:''
          } else {
            this.hdfx = []
            this.formSearch.bjid = {}
            this.bgdhdfz.bjdm = {}
            this.formSearch.hdfxid = {}
            this.bgdhdfz.bgdszid = {}
            this.tipsXX('未查到班级数！', 'info', '提示')
          }
        })   
      },

      // 获取报告单活动分析数据
      getactive(val){
        this.bjlist = [] // 清空班级
        this.formSearch.bjid = {} // 清空班级绑定
        this.hdfx = [] // 清空活动分析项
        this.formSearch.hdfxid = {} // 清空活动分析绑定
        this.hdfxzc = []
        reportapi.GetReportSetting({id:val}).then(data => {
          // console.log(data)
          var that = this
          if (data.njSzList.length) {
            that.sfktj = true
            // this.formSearch.xmid
            // that.getbjS(data.njSzList);
            data.njSzList.forEach((el, index) => {
              // that.bjcs.njdm = el.njdm
              that.getbjlist(el) // 获取年级所有班级
              that.dataprocessing(el, index) // 活动分析数据处理
            })
            // console.log(that.bjlist,543)
          } else {
            that.sfktj = false
            this.bgdhdfz.bjdm = ''
            this.bgdhdfz.bgdszid = ''
            this.bgdhdfz.bgdid = ''
            this.tipsXX('该项目未进行设置！', 'info', '提示')
          }
        })
      },
      //根据年级代码排序班级列表
      sortBjlist(bjlist){
        return bjlist.sort((a,b)=>{
          return Number(a.njdm)-Number(b.njdm)
        })
      },
      // 活动分析数据处理
      dataprocessing(el, index){
        // console.log('数据')
        // console.log(el)
        var that = this
        if (el.bgdszList) {
          el.bgdszList.forEach((item, indexs) => {
            that.hdfxzc.push({
              bm: item.bm,
              uuid: item.uuid,
              lx: item.lx,
              njdm: el.njdm
            })
          })
        }
      },

      // 获取报告单数据项
      getList(){
        var that = this
        reportapi.getBgd(this.listQuery).then(data => {
          // console.log(data)
          if (data.list && data.list.length) {
            this.xmlist = data.list
            this.formSearch.xmid = data.list[0] // 默认项目选择
            this.searchFn(data.list[0], 'xm') // 默认选择第一个
          }
        })
      }, 

      // 保存/修改分组成员
      dealgroupnumber(){
        // console.log('真的烦')
        // console.log(this.bgdfz)
        avtive.SaveGroupNumber(this.bgdfz).then(data => {
          // this.getActivityanalysis(this.bgdhdfz)
          // console.log(data)
          // let params = {
          //   xn: this.bjcs.xn,
          //   xq: this.xq,
          //   xxdm: this.listQuery.xxdm,
          //   bgdfzid: this.bgdfz.bgdfzid
          // }
          
          // this.getGroupNum(params)
          let pp = {
            index: this.dataIndex,
            uuid: this.bgdfz.bgdfzid
          }
          this.selectRowKc(pp)
        })
      },

      // 穿梭框操作
      handleChange(value, direction, movedKeys) {
        // console.log(value, direction, movedKeys);
        if (this.bgdfz.bgdfzid !== '') {
          this.grouplist = []
          if (movedKeys.length) {
            if (direction === 'right') {
              this.bgdfz.isenter = 1
              this.groupdetal(movedKeys)
            } else {
              this.bgdfz.isenter = 2
              this.groupdetal(movedKeys)
            }
          }
        } else {
          this.value4 = []
          this.tipsXX('请先选择小组！', 'info', '提示')
        }
        
      },
      // 入组/出组
      groupdetal(movedKeys){
        var that = this
        movedKeys.forEach(el => {
          that.grouplist.push({
            xh: JSON.parse(el).xh,
            xm: JSON.parse(el).xm,
            bjid: that.bgdhdfz.bjdm,
            xq: that.xq,
            xn: that.bjcs.xn,
            xxdm: that.listQuery.xxdm,
          })
        })
        this.selectedgrouplist.forEach(el => {
          this.grouplist.forEach(item => {
            if (el.xh === item.xh && el.xm === item.xm) {
              this.$set(item, 'uuid', el.uuid)
            }
          })
        })
        this.bgdfz.xn = this.bjcs.xn
        this.bgdfz.xq = this.xq
        this.bgdfz.list = this.grouplist
        this.dealgroupnumber()
        // console.log(this.grouplist)
      },

      // 添加小组
      addgroup(){
        if (this.sfktj) {
          if (this.hdfx.length) {
            if (this.groupname !== '') {
              // 正则匹配表情
              var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
              if (this.groupname.match(regRule)) {
                this.groupname = ''
                this.tipsXX('请勿输入表情！', 'info', '提示')
              } else {
                
                let params = {
                  mc: this.groupname,
                  xxdm: this.listQuery.xxdm,
                  xn: this.bjcs.xn,
                  xq: this.xq,
                  njdm: this.bjcs.njdm,
                  bjid: this.bgdhdfz.bjdm,
                  bgdid: this.bgdhdfz.bgdid,
                  bgdszid: this.bgdhdfz.bgdszid
                }
                this.savegroup(params) // 保存分组
                setTimeout(() => {
                  this.groupname = ''
                }, 300)

              }
              
            } else {
              this.tipsXX('请先输入组名', 'info', '提示')
            }
          } else {
            this.tipsXX('数据不全无法添加！', 'info', '提示')
          }
        } else {
          this.tipsXX('请先选择项目项', 'info', '提示')
        }
      },

      // 保存添加小组
      // {mc, xxdm, xn, xq, njdm, bjid, bgdid, bgdszid} 组名称,学校代码,学年,学期,年级代码,班级代码,报告单编号,报告单设置编号
      savegroup(value){
        // console.log(value)
        avtive.SaveActiveGroup(value).then(data => {
          // console.log(data)
          if (data.status === 1 && data.data !== '') {
            this.tableData.push({
              mc: this.groupname,
              uuid: data.data
            })
          }
        })
      },

      // 表格排序
      indexMethod(index) {
        return index+1;
      },

      // 选择活动分析
      searchFn(val, str){
        // console.log("AAAAAAAAA");
        this.tableData = []
        this.value4 = []
        this.bgdfz.bgdfzid = ''
        // console.log(val)
        if (val) {
          if (str === 'xm') { // 项目
            this.datas = []
            this.first = true
            this.xq = val.xq
            this.bjcs.xxdm = val.xxdm
            this.bjcs.xn = val.xn
            this.getactive(val.uuid)
            this.bgdhdfz.bgdid = val.uuid
            this.formSearch.copyOthers = false
          }

          if (str === 'bj') { // 班级
            // this.datas = []
            this.first = false
            this.hdfx = []
            this.bgdhdfz.bjdm = val.uuid
            this.hdfxzc.forEach(el => {
              if (val.njdm === el.njdm && el.lx === 13) {
                this.hdfx.push(el)
              }
            })
            this.formSearch.hdfxid = this.hdfx.length?this.hdfx[0]:null
            this.formSearch.copyOthers = false
            this.bgdhdfz.bgdszid = this.hdfx.length?this.hdfx[0].uuid:''
            // 切换班级获取班级学生
            let params = {
              bjid: val.uuid,
              xn: this.bjcs.xn,
              xxdm: this.listQuery.xxdm
            }
            this.getallstu(params)
          }

          if (str === 'hdfx') { // 活动分析
            this.value4 = []
            this.bgdhdfz.bgdszid = val.uuid
            this.formSearch.copyOthers = false
            // console.log(this.datas,667711)
            this.datas.forEach((item) => {
                this.$set(item, 'disabled', false)
            })
          }

          // console.log(this.bgdhdfz.bjdm,666699)

          setTimeout(() => {

            this.getActivityanalysis(this.bgdhdfz)
            // 第一次加载获取班级学生
            if (this.first && this.bgdhdfz.bjdm !== '') {
              let params = {
                bjid: this.bgdhdfz.bjdm,
                xn: this.bjcs.xn,
                xxdm: this.listQuery.xxdm
              }
              // console.log('哈哈哈哈')
              // console.log(this.tableData)
              this.getallstu(params)
            }
          }, 500)


        }else{

        }
      },

      // 提示信息
      tipsXX(data, xxtype, tit) {
        this.$notify({
        title: tit,
        message: data,
        type: xxtype,
        duration: 2000
        });
      },
    },
  }
</script>
<style lang="scss" scoped>
.app-container{
  min-width: 740px; max-width: 1350px;
}
.t_conmain{
  // min-width: 800px;
  width: 1200px;
  padding-left: 20px;
  overflow: hidden;
  .table_left{
    float: left;
    width: 201px;
    max-height: 500px;
  }
  .table_left_top{
    width: 100%;
    border: 1px solid #eee;
    border-bottom: none;
    height: 80px;
  }
  .Table_header{
    height: 30px;
    width: 100%;
    line-height: 30px;
    background-color: #ccc;
    color: #fff;
    text-align: center;
    font-size: 16px;
  }
  .Table_input{
    width: 100%;
    height: 40px;
    padding: 8px 5px;
  }
  .content{
    float: left;
    width: 80%;
    height: 600px;
    position: relative;
  }
}
</style>
<style lang="scss">
.selectedRows td,
.selectedRows:hover td {
  background-color: #4787f1 !important;
  color: #fff;
}
.content .el-transfer{
  height: 100% !important;
}
.content .el-transfer .el-transfer-panel{
  height: 100% !important
}
.content .el-transfer .el-transfer-panel .el-transfer-panel__body,
.content .el-transfer .el-transfer-panel .el-transfer-panel__list{
  height: 558px;
}
/* .selectedRows td:nth-child(1) {
  background: #ecf3fe !important;
} */
.el-transfer-panel__item+.el-transfer-panel__item {
    margin-left: 0;
    display: block!important;
}
</style>