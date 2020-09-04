<!--排课系统首页-->
<!--suppress ALL -->
<template>
  <section>
    <div class="app-container" style="padding: 20px">
      <div class="u_TableMain columns ofhide">
        <div class="filter-container innerTab">
          <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
            <el-form-item label="周期">
              <el-date-picker
                v-model="weeks"
                @change="handleWeek"
                :picker-options="{'firstDayOfWeek': 1}"
                type="week"
                value-format="yyyy-MM-dd"
                format="yyyy 第 WW 周"
                placeholder="选择周">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button :loading="copyLoading" type="primary" icon="el-icon-document-copy" class="handle-del mr10"
                         @click="handleCopy">复制上周菜单
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button :loading="remvoeLoading" type="primary" icon="el-icon-folder-delete" class="handle-del mr10"
                         @click="handClear">清空菜单
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-alarm-clock" class="handle-del mr10" @click="handleDateTime">设置时段
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="m_GenTableBox">
          <!--列表-->
          <div style="padding-bottom: 1px">
            <el-alert
              style="margin: 4px 0 !important;"
              title="温馨提示:点击空白处可添加菜单，历史记录不能选择。"
              type="warning" show-icon>
            </el-alert>
          </div>
          <el-table v-loading="loading"
                    :data="tableData"
                    @cell-click="handCell"
                    :header-cell-style="tableHeaderColor"
                    border fit
                    highlight-current-row style="width: 100%"
                    @selection-change="handleSelectionChange">
            <el-table-column
              align="center"
              type="selection"
              :selectable='isDisabled'
              width="55">
            </el-table-column>
            <el-table-column align="center" prop="0" label="星期\时间" width="180">
              <template slot-scope="scope">
                {{scope.row[0].value}}<br/>{{scope.row[0].time}}
              </template>
            </el-table-column>
            <el-table-column :key='fruit.id' v-for='fruit in formThead' :label="getTableHeader(fruit)"
                             :filterPlacement="fruit.id">
              <template slot-scope="scope" v-if="scope.row[fruit.id]">
                <el-tag size="small"
                        v-if="tag.id"
                        :key="tag.id"
                        v-for="tag in scope.row[fruit.id]">
                  {{tag.sort}}.{{tag.name}}-{{tag.planNum}}份
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--新增界面-->
      <el-dialog :title="'每日菜品设置('+dynamicValidateForm.dailyList.length+'/20)'" :visible.sync="dialogForm" width="700px"
                 @close="colseDialog">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-ruleForm">
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.dailyList"
            :label="'菜品位置' + (index+1)+'.'"
            :key="domain.id">
            <el-col :span="9">
              <el-form-item :prop="'dailyList.' + index + '.menuId'"
                            :rules="{required: true, message: '菜品不能为空!', trigger: 'blur'}">
                <el-cascader
                  placeholder="请选择"
                  :options="menuList"
                  v-model="menuArry[index]"
                  :props="optionProps"
                  @change="handleMenuChange(index,domain,$event)"
                  filterable
                  clearable
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="0.1"></el-col>
            <el-col :span="5">
              <el-form-item :prop="'dailyList.' + index + '.planNum'"
                            :rules="[{required: true, message: '菜品份量不能为空!', trigger: 'blur'},{validator: validaNumber, trigger: 'change'}]">
                <!-- <el-input v-model="domain.num"><i slot="suffix" class="el-input__icon">kg&nbsp;</i></el-input>-->
                <el-input maxlength="10" placeholder="数量" v-model="domain.planNum">
                  <template slot="append">份</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="8">
              <el-button type="info"
                         :disabled = "disabledArry.includes(domain.id)"
                         @click.prevent="removeDomain(index)"
                         icon="el-icon-delete" circle></el-button>
              <el-button :disabled="(index+1)==1?true:false"
                         @click="handUpOrDown('top',index)"
                         type="info" icon="el-icon-top" circle></el-button>
              <el-button :disabled="(index+1)==dynamicValidateForm.dailyList.length?true:false"
                         @click="handUpOrDown('bottom',index)"
                         type="info" icon="el-icon-bottom" circle></el-button>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button icon="el-icon-plus" @click="addDomain">新增菜品</el-button>
          <el-button @click="colseDialog">取消</el-button>
          <el-button type="primary" @click="saveData('dynamicValidateForm')">确认</el-button>
        </div>
      </el-dialog>
      <!--时段设置-->
      <el-dialog title="时段设置" :visible.sync="dialogDataTime" width="450px" @close="colseDialog">
        <el-form :model="temp" ref="dataForm" label-width="60px" class="demo-ruleForm">
          <el-form-item
            v-for="(item, index) in temp.foodTimeList"
            :key="index"
            :prop="'foodTimeList.' + index + '.createTime'"
            :rules="[{required: true, message: '时间不能为空!', trigger: 'blur'},{validator: validaTime, trigger: 'change'}]"
            :label="item.name">
            <el-time-picker
              is-range
              v-model="item.createTime"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseDialog">取消</el-button>
          <!--保存-->
          <el-button type="primary" @click="saveTime('dataForm')">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
  import * as api from '@/api/order/foodDaily/index'

  export default {
    data() {
      return {
        copyLoading: false,
        remvoeLoading: false,
        weeks: '',
        newDate: '',
        value5: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        loading: true,
        dialogForm: false, // 定义新增弹框默认关闭
        dialogDataTime: false,
        options: ['启用', '禁用'],
        searchFrom: {
          weeks: '',
          /** 保存的form表单数据**/
          name: '',
          status: '',
          page: 1,
          limit: 10
        },
        menuValue: [],
        menuList: [],
        optionProps: {
          label: 'label',
          value: 'value',
          children: 'children',
          disabled: 'disabled'
        },
        dialogStatus: '',
        dynamicValidateForm: {
          dailyList: []
        },
        temp: {
          /** 保存的form表单数据**/
          foodTimeList: [{
            id: undefined,
            name: '早餐',
            createTime: [new Date(2019, 8, 6, 5, 30), new Date(2019, 8, 6, 11, 31)]
          }, {
            id: undefined,
            name: '中餐',
            createTime: [new Date(2019, 8, 6, 11, 30), new Date(2019, 8, 6, 14, 30)]
          }, {
            id: undefined,
            name: '晚餐',
            createTime: [new Date(2019, 8, 6, 14, 31), new Date(2019, 8, 6, 23, 40)]
          }]
        },
        textMap: {
          update: '修改分类',
          create: '新建分类'
        },
        tableData: [],
        formThead: [],
        total: 0,
        rules: {
          name: []
        },
        menuArry: [],
        disabledArry: [],
        daily: '',
        multipleSelection: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      search() {
        this.getList();
      },
      getList() {
        const parm = {weekTime: this.weeks}
        api.getDailyList(parm).then(res => {
          this.loading = false;
          this.formThead = res.value.headList;
          this.tableData = res.value.dataList;
          this.getMenuList();
        });
      },
      getMenuList() {
        api.getMenuList().then(res => {
          this.menuList = res.value
          this.sysMenuList()
        });
      },
      sysMenuList() {
        this.menuList = this.menuList.map(v => {
          v.children.forEach(n => {
            n.disabled = false
            const arry = _.filter(this.menuArry, e => v.value === e[0] && n.value === e[1])
            if (arry.length > 0) {
              n.disabled = true
            }
          })
          return v
        })
      },
      resetTemp() {
        this.temp = {
          /** 保存的form表单数据**/
          id: undefined,
          name: '',
          status: '0',
          page: 1,
          limit: 10
        }
      },
      saveData(formName) {
        console.log(this.dynamicValidateForm.dailyList)
        /** 提交数据**/
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 判断产菜品不可重复
            const menuSet = new Set();
            this.dynamicValidateForm.dailyList.forEach(menu => {
              menuSet.add(menu.menuId);
            })
            if (menuSet.size != this.dynamicValidateForm.dailyList.length) {
              this.$notify({title: '提示', message: '每餐菜品不可重复', type: 'warning', duration: 2000})
              return;
            }
            const parm = {
              currentTimes: this.daily.currentTimes,
              timeId: this.daily.clockId,
              dailyList: this.dynamicValidateForm.dailyList
            }
            api.getAdd(parm).then(() => {
              this.dialogForm = false;
              this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000})
              this.getList();
            })
          }
        })
      },
      colseDialog() {
        this.dialogForm = false;
        this.dialogDataTime = false;
      },
      handleDateTime() {
        api.getFoodTimeList().then(json => {
          this.dialogDataTime = true;
          if (json.resultCode === 1) {
            if (json.value.length > 0) {
              this.temp.foodTimeList = json.value.map(item => {
                const map = {}
                const [statrDateTime, endDataTime] = [item.statrDateTime, item.endDataTime]
                map.id = item.id
                map.name = item.name
                map.createTime = [new Date(statrDateTime), new Date(endDataTime)]
                return map;
              })
            }
          }
        })
      },
      /** 验证历史进餐时间**/
      validaTime(rule, value, callback) {
        const arry = []
        this.temp.foodTimeList.forEach(e => {
          arry.push(e.createTime)
        })
        const time = _.filter(arry, o => o)
        if (time.length == 1) {
          callback();
        } else {
          const index = arry.indexOf(value)
          let checkNum = 0;
          for (let i = 0; i < arry.length; i++) {
            const v = arry[i]
            if (index == 1 && i == 0) {
              const [adate, bdate] = [value[0], v[1]]
              const [ad, ah, am] = [adate.getHours(), adate.getMinutes(), adate.getSeconds()]
              const [bd, bh, bm] = [bdate.getHours(), bdate.getMinutes(), bdate.getSeconds()]
              if ((ad > bd) || (ad == bd && ah > bh) || (ad == bd && ah == bh && am > bm)) {
                checkNum = 0;
                break;
              } else {
                checkNum = 1;
                break;
              }
            }
            if (index == 2 && i == 1) {
              const [adate, bdate] = [value[0], v[1]]
              const [ad, ah, am] = [adate.getHours(), adate.getMinutes(), adate.getSeconds()]
              const [bd, bh, bm] = [bdate.getHours(), bdate.getMinutes(), bdate.getSeconds()]
              if ((ad > bd) || (ad == bd && ah > bh) || (ad == bd && ah == bh && am > bm)) {
                checkNum = 0;
                break;
              } else {
                checkNum = 2;
                break;
              }
            }
          }
          if (checkNum == 0) {
            callback();
          } else {
            if (checkNum == 1) {
              callback(new Error('中餐开始时间必须大于早餐结束时间'));
            } else {
              callback(new Error('晚餐开始时间必须大于中餐结束时间'));
            }
          }
        }
      },
      saveTime(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const parm = this.temp.foodTimeList.map(item => {
              const map = {}
              map.id = item.id
              map.name = item.name
              map.statrDateTime = api.parseTime(item.createTime[0])
              map.endDataTime = api.parseTime(item.createTime[1])
              return map
            })
            console.log(parm)
            api.getSaveFoodTime(parm).then(json => {
              if (json.resultCode === 1) {
                this.getList();
                this.$notify({title: '成功', message: json.resultMessage, type: 'success', duration: 2000});
                this.dialogDataTime = false;
              }
            })
          }
        })
      },
      getTableHeader(v) {
        const value = v.name + '(' +
          v.statrDateTime.substring(11, v.statrDateTime.length) + '~' +
          v.endDataTime.substring(11, v.endDataTime.length) + ')';
        return value;
      },
      handCell(a, b, c, d) {
        this.disabledArry = [];
        // 第一列不操作
        if (c.cellIndex > 1) {
          //判断点击的每日菜单是否是历史记
          const date = new Date(this.$moment(new Date()).format('YYYY-MM-DD'))
          const clickDate = new Date(a[0].time)
          if (clickDate.getTime() < date.getTime()) {
            this.$message({message: '抱歉，历史记录不能编辑', type: 'warning'});
            return false;
          } else {
            //获取当前时段
            if (clickDate.getTime() === date.getTime()) {
              const [adate, bdate, sdate] = [new Date(), new Date(this.formThead[c.cellIndex - 2].endDataTime), new Date(this.formThead[c.cellIndex - 2].statrDateTime)]
              const [ad, ah, am] = [adate.getHours(), adate.getMinutes(), adate.getSeconds()]
              const [bd, bh, bm] = [bdate.getHours(), bdate.getMinutes(), bdate.getSeconds()]
              const [sd, sh, sm] = [sdate.getHours(), sdate.getMinutes(), sdate.getSeconds()]
              if ((ad > bd) || (ad == bd && ah > bh) || (ad == bd && ah == bh && am > bm)) {
                this.$message({message: '抱歉，历史记录不能编辑', type: 'warning'});
                return false;
              } else {
                const curre = new Date(adate.getFullYear(), adate.getMonth(), adate.getDate(), adate.getHours(), adate.getMinutes(), adate.getSeconds())
                const end = new Date(adate.getFullYear(), adate.getMonth(), adate.getDate(), bdate.getHours(), bdate.getMinutes(), bdate.getSeconds())
                const start = new Date(adate.getFullYear(), adate.getMonth(), adate.getDate(), sdate.getHours(), sdate.getMinutes(), sdate.getSeconds())
                if (curre.getTime() >= start.getTime() && curre.getTime() <= end.getTime()) {
                  const vList = a[b.filterPlacement];
                  if (vList && vList.length > 0){
                    for (const o of vList) {
                      this.disabledArry.push(o.id)
                    }
                  }
                }
              }
            }
            this.getList();
            // 初始化已选菜品列表
            this.dynamicValidateForm.dailyList = []
            // 初始化选中的参数id
            this.menuArry = []
            // 获取已选返回的数据
            const data = a[b.filterPlacement];
            // 没有数据默认设置一条
            this.daily = {
              currentTimes: a[0].time,
              week: a[0].key,
              id: undefined,
              typeId: '',
              menuId: '',
              clockId: b.filterPlacement,
              planNum: '',
              sort: 1
            }
            if (!data || data.length === 0) {
              // 设置
              this.dynamicValidateForm.dailyList.push({
                currentTimes: this.daily.currentTimes,
                week: this.daily.week,
                id: undefined,
                typeId: '',
                menuId: '',
                clockId: this.daily.clockId,
                planNum: '',
                sort: 1
              });
              this.menuArry.push([])
              /** 回旋已设置的菜品**/
            } else {
              this.menuArry = []
              for (const o of data) {
                this.menuArry.push([o.typeId, o.menuId])
              }
              this.dynamicValidateForm.dailyList = data
            }
            this.sysMenuList()
            // 数据渲染完成创建验证表单
            this.$nextTick(() => {
              this.$refs.dynamicValidateForm.clearValidate();
            })
            // 打开弹框
            this.dialogForm = true
          }
        }
      },
      addDomain() {
        const sort = this.dynamicValidateForm.dailyList.length + 1;
        if (this.dynamicValidateForm.dailyList.length < 20) {
          this.dynamicValidateForm.dailyList.push({
            currentTimes: this.daily.currentTimes,
            week: this.daily.week,
            id: undefined,
            typeId: '',
            menuId: '',
            clockId: this.daily.clockId,
            planNum: '',
            sort
          });
          this.menuArry.push([])
          this.sysMenuList()
        } else {
          this.$message({message: '抱歉，最多只能添加20个菜品', type: 'warning'});
        }
      },
      removeDomain(index) {
        this.dynamicValidateForm.dailyList.splice(index, 1)
        this.menuArry.splice(index, 1)
        this.sysMenuList()
      },
      handleMenuChange(i, data, v) {
        if (v.length > 0) {
          data.typeId = v[0];
          data.menuId = v[1];
        } else {
          data.typeId = '';
          data.menuId = '';
        }
        //设置是否可选多次
        this.sysMenuList()
      },
      handleWeek(v, e) {
        this.weeks = v;
        this.getList();
        this.multipleSelection = []
      },
      handUpOrDown(v, i) {
        if (v === 'top') {
          // 设置数据位置
          const [tempOption, menu] = [this.dynamicValidateForm.dailyList[i - 1], this.menuArry[i - 1]];
          this.$set(this.dynamicValidateForm.dailyList, i - 1, this.dynamicValidateForm.dailyList[i]);
          this.$set(this.dynamicValidateForm.dailyList, i, tempOption)
          // 设置参数位置
          this.$set(this.menuArry, i - 1, this.menuArry[i]);
          this.$set(this.menuArry, i, menu)
        } else {
          const [tempOption, menu] = [this.dynamicValidateForm.dailyList[i + 1], this.menuArry[i + 1]];
          this.$set(this.dynamicValidateForm.dailyList, i + 1, this.dynamicValidateForm.dailyList[i]);
          this.$set(this.dynamicValidateForm.dailyList, i, tempOption)
          // 设置参数位置
          this.$set(this.menuArry, i + 1, this.menuArry[i]);
          this.$set(this.menuArry, i, menu)
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleRowSelection(val, row) {
        //判断点击的每日菜单是否是历史记录
        const date = new Date(this.$moment(new Date()).format('YYYY-MM-DD'))
        const clickDate = new Date(row[0].time)
        if (clickDate < date) {
          return 0
        } else {
          return 1
        }
      },
      handClear() {
        if (this.multipleSelection.length === 0) {
          this.$message({message: '请选择清空的星期列表', type: 'warning'});
        } else {
          this.remvoeLoading = true;
          const t = this.weeks.length > 0 ? new Date(this.weeks) : new Date();
          const copy = {curreTime: this.weeks}
          const weekOfday = parseInt(this.$moment(t).format('d')) // 计算今天是这周第几天  周日为一周中的第一天
          const start = this.$moment(t).subtract(weekOfday + 6, 'days').format('YYYY-MM-DD') // 周一日期
          const end = this.$moment(t).subtract(weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
          copy.startTime = start;
          copy.endTime = end;
          copy.dailyVos = [];
          this.multipleSelection.forEach(e => {
            copy.dailyVos.push(e[0])
          })
          // 复制上周选择的每日菜单
          api.getRemovePrevWeekDaily(copy).then(json => {
            if (json.resultCode === 1) {
              this.getList();
              this.$notify({title: '成功', message: json.resultMessage, type: 'success', duration: 2000});
              this.remvoeLoading = false;
            }
          })
        }
      },
      handleCopy() {
        if (this.multipleSelection.length === 0) {
          this.$message({message: '请选择复制的星期列表', type: 'warning'});
        } else {
          this.copyLoading = true;
          const t = this.weeks.length > 0 ? new Date(this.weeks) : new Date();
          const copy = {curreTime: this.weeks}
          const weekOfday = parseInt(this.$moment(t).format('d')) // 计算今天是这周第几天  周日为一周中的第一天
          const start = this.$moment(t).subtract(weekOfday + 6, 'days').format('YYYY-MM-DD') // 周一日期
          const end = this.$moment(t).subtract(weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
          copy.startTime = start;
          copy.endTime = end;
          copy.dailyVos = [];
          this.multipleSelection.forEach(e => {
            copy.dailyVos.push(e[0])
          })
          // 复制上周选择的每日菜单
          api.getCopyPrevWeekDaily(copy).then(json => {
            if (json.resultCode === 1) {
              this.getList();
              this.$notify({title: '成功', message: json.resultMessage, type: 'success', duration: 2000});
              this.copyLoading = false
            }
          })
        }
      },
      tableHeaderColor({row, column, rowIndex, columnIndex}) {
        return 'background: #fafafa;color: rgba(0, 0, 0, 0.85);border-bottom: 1px solid #e8e8e8;font-weight: 500;text-align: center;'
      },
      isDisabled(row, index) {
        //判断点击的每日菜单是否是历史记录
        const date = new Date(this.$moment(new Date()).format('YYYY-MM-DD'))
        const clickDate = new Date(row[0].time)
        if (clickDate < date) {
          return 0
        } else {
          return 1
        }
      },
      /** 验证可点数量为正整数**/
      validaNumber(rule, value, callback) {
        if (!api.checkNumber(value)) {
          callback(new Error('只能输入正整数！'));
        } else {
          callback();
        }
      }
    }
  }

</script>
<!--此处代码请不要加scoped否则没有样式-->
<style scoped>

</style>


