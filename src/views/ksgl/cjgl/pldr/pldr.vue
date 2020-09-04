<template>
  <div class="main">
    <div class="wrap">
      <div class="main_content">
        <div class="head" :class="[isOpen?'':'bg_yellow']">
          <div class="zysx">
            <span class="zysx_close" v-if="!isOpen" @click="isOpen = true"></span>
            <label class="title">
              <span class="zysx_icon"></span>
              <span class="zysx_text">{{data.zysx.title}}</span>
              <span class="open zysx_text" v-if="isOpen" @click="isOpen = false">展开</span>
            </label>
            <ul v-if="!isOpen">
              <li class="zysx_item" v-for="(item, index) in !status?data.zysx.children:data.xzbj.children" :key="index">
                {{index + 1}}.{{item.name}}
              </li>
            </ul>
          </div>
        </div>
        <div class="before" v-if="!status" v-bind:style="{top:top+'px'}">
          <div class="drlc">
            <label class="title">{{data.drlc.title}}</label>
            <ul>
              <li class="drlc_item" v-for="(zysx, z_index) in data.drlc.children" :key="z_index">
                <span class="step" v-if="!zysx.success">{{z_index + 1}}</span>
                <span class="step success" v-else></span>
                <label class="step_num">{{'第'+num_zn[z_index]+'步'}}</label>
                <div class="step_content">
                  <label class="step_num main_display_inline_block step_name">{{zysx.name}}</label>
                  <el-select v-model="ksmc" placeholder="请选择考试名称" filterable v-if="z_index == 0" size="medium" @change="e=>change(e,zysx)"
                    style="margin-right: 20px;">
                    <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <label style="font-weight: normal;" v-if="z_index == 0">{{kstsxx}}</label>
                  <label class="red" v-if="z_index == 0">{{zysx.error}}</label>
                  <button type="button" class="drlc_item_btn down" v-if="z_index == 1" @click="down(zysx)">
                    <span class="down_icon"></span>
                    <label>下载导入模板</label>
                  </button>
                  <el-checkbox v-model="isdown" label="已有模板，跳过" v-if="z_index == 1" border size="medium" @change="e=>downChange(e,zysx)"></el-checkbox>
                  <label class="red" v-if="z_index == 1">{{zysx.error}}</label>
                  <div class="main_display_inline_block" v-if="z_index == 2">
                    <button type="button" class="drlc_item_btn choosed">
                      <div class="choose edit">
                        <label class="upload_title">
                          <span class="upload_icon"></span>
                          <label>选择文件</label></label>
                        <input type="file" ref="file" name="file" id="file" @change="e=>choose(e,zysx)" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">

                      </div>
                    </button>
                    <label class="choosed_file">{{data.drlc.choosed}}</label>
                    <label class="red">{{zysx.error}}</label>
                  </div>
                </div>
              </li>
            </ul>
            <button type="button" :disabled="disabled" class="drlc_item_btn upload" @click="upload">开始导入</button>
          </div>
        </div>
        <div class="after" v-else>
          <div class="xzbj">
            <label class="title">{{data.xzbj.title}}</label>
            <div class="bjlb">
              <el-table :data="data.xzbj.bj_list" border>
                <el-table-column :label="b_item.title" :prop="b_item.zdm" v-for="(b_item,b_index) in data.xzbj.bjbm"
                  :width="b_index == 0?150:null" :key="b_index">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px" v-if="b_index == 0">{{ scope.row.xk }}</span>
                    <ul v-else class="lbsj">
                      <li :class="x_item.classname + ' xzbj_item'" v-for="(x_item,x_index) in scope.row.bj" @click="chooseData(x_item,scope.$index)">
                        <span class="bjrs" v-if="x_item.classname == 'active' && x_item.num">{{x_item.num}}</span>
                        <span>{{x_item.bj}}</span>
                      </li>
                    </ul>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="xsxz">
              <div class="gnan">
                <label class="gnan_title">{{data.xzbj.ts}}</label>
                <button type="button" class="drlc_item_btn" @click="ycdc">
                  <span class="upload_icon"></span>
                  <label>异常数据导出</label>
                </button>
              </div>
              <el-table :data="data.xzbj.xs_list" border>
                <el-table-column :label="x_item.title" :prop="x_item.zdm" v-for="(x_item,x_index) in data.xzbj.xsbm"
                  :width="x_index == 0?60:null" :key="x_index">
                  <template slot-scope="scope">
                    <div v-if="x_index == 0">
                      <span v-if="!scope.row.sfxz">{{scope.row.num}}</span>
                      <el-checkbox v-model="scope.row.sfxz" size="medium" v-else disabled></el-checkbox>
                    </div>
                    <el-input v-model="scope.row.xm" v-else-if="x_index == 4" placeholder="请输入内容" @blur="e=>jyxm(e,scope.row)"></el-input>
                    <el-input v-model="scope.row.cj" v-else-if="x_index == 6" placeholder="请输入内容" @blur="e=>jyxj(e,scope.row)"></el-input>
                    <el-select v-model="scope.row.ztm" filterable v-else-if="x_index == 7" size="medium" @change="e=>jyztm(e,scope.row)">
                      <el-option v-for="item in kszt" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="bz" v-else-if="x_index == 8">
                      <span v-if="!scope.row.bz">已导入，提交后有效</span>
                      <span class="red" v-else>{{scope.row.bz}}</span>
                    </div>
                    <span v-else>{{x_index == 1?scope.row.kcmc:(x_index == 2?scope.row.nj:(x_index ==3?scope.row.bj:(x_index == 5?scope.row.xh:'')))}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                :page-sizes="[5, 10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
            <div class="submit_box">
              <button type="button" :disabled="disabled" class="drlc_item_btn primary" @click="back">上一步</button>
              <button type="button" :disabled="disabled" class="drlc_item_btn green" @click="submit">提交</button>
            </div>
          </div>
        </div>
        <!-- 上传状态弹窗 -->
        <div class="jdtc" v-if="jdtc">
          <div class="head">上传进度{{djs}}</div>
          <div class="content">
            <div class="content_item" v-for="(j_item,j_index) in jdt" :key="j_index">
              <label class="content_item_num" :class="[j_index==0?'color_blue':(j_index == 1?'color_green':'yellow')]">{{j_item.value}}</label>
              <label class="content_item_title">{{j_item.name}}</label>
            </div>
          </div>
        </div>
        <!-- 进度条 -->
        <div class="jdxs" v-if="jdxs">
          <div class="jsxs_box">
            <el-progress :percentage="jdsz" class="progress" :stroke-width="10"></el-progress>
            <label class="jdxs_text">正在上传中...</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as API from '@/api/ksgl/kswh/index'
  import lodash from 'lodash'
  import $ from 'jquery'
  import common from '@/api/export'
  export default {
    props: {
      selectData: {
        default: Object
      }
    },
    data() {
      return {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        data: {
          zysx: {
            title: '注意事项',
            children: [{
              name: '此功能可以一次性导入全年级、全课程的学生成绩'
            }, {
              name: '提交后导入数据有效'
            }, {
              name: '未提交，退出该页面导入数据无效'
            }, {
              name: '若有异常数据，建议当场导出，否则重新进入数据丢失'
            }, {
              name: '导入模板中填写内容，不可更改目录文字'
            }, {
              name: '科目批量导入时，建议每次导入的条数在1000条以内'
            }]
          },
          drlc: {
            title: '批量导入',
            choosed: '',
            children: [{
              name: '选择本次导入的考试名称',
              success: false,
              error: '',
            }, {
              name: '下载标准导入模板，填写课程及相关信息',
              success: false,
              error: '',
            }, {
              name: '导入模板内容，填写完毕后导入',
              success: false,
              error: '',
            }]
          },
          xzbj: {
            title: '确认提交',
            // 标题描述
            children: [{
              name: '请仔细确认以下将要提交的成绩信息'
            }, {
              name: '科目及班级可全选、多选和单选'
            }, {
              name: '未提交前，可修改学生姓名/分数/考试状态'
            }, {
              name: '若异常数据多，建议导出修改后再重新导入'
            }, {
              name: '班级右上角的数量为有效数据数量'
            }, {
              name: '务必提交后，本次导入才生效'
            }],
            ts: '注： 1、未提交前，可修改以下导入内容；2、修改后，建议刷新，数据更准确。',
            // 学生列表表头
            xsbm: [{
              title: '序号',
            }, {
              title: '科目',
            }, {
              title: '年级',
            }, {
              title: '班级',
            }, {
              title: '姓名',
            }, {
              title: '学号',
            }, {
              title: '成绩',
            }, {
              title: '考试状态',
            }, {
              title: '备注',
            }],
            // 学生列表数据
            xs_list: [],
            // 班级列表表数据
            bjbm: [{
              title: '科目',
            }, {
              title: '班级(可选择提交的班级)',
            }],
            bj_list: [{
              xk: '化学',
              bj: [{
                id: '1',
                name: '全部',
                classname: ''
              }, {
                id: '2',
                name: '一年级(1)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '3',
                name: '一年级(2)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '4',
                name: '一年级(3)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '5',
                name: '一年级(4)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '6',
                name: '一年级(5)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '7',
                name: '一年级(6)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '8',
                name: '一年级(7)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '9',
                name: '一年级(8)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '10',
                name: '一年级(9)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '11',
                name: '二年级(6)班',
                bjrs: 111,
                classname: ''
              }]
            }, {
              xk: '化学',
              bj: [{
                id: '1',
                name: '全部',
                classname: ''
              }, {
                id: '2',
                name: '一年级(1)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '3',
                name: '一年级(2)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '4',
                name: '一年级(3)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '5',
                name: '一年级(4)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '6',
                name: '一年级(5)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '7',
                name: '一年级(6)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '8',
                name: '一年级(7)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '9',
                name: '一年级(8)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '10',
                name: '一年级(9)班',
                bjrs: 111,
                classname: ''
              }, {
                id: '11',
                name: '二年级(6)班',
                bjrs: 111,
                classname: ''
              }]
            }]
          }
        },
        file: null,
        activeIndex: null,
        activeLen: 0,
        status: false, //是否开始导入
        isOpen: false, //
        num_zn: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
        top: 0,
        ksmc: '',
        disabled: true,
        isdown: false, //是否下载模板
        kszt: [{
          label: '正常',
          value: '1'
        }, {
          label: '缺考',
          value: '2'
        }, {
          label: '作弊',
          value: '3'
        }],
        jdt: [{
          name: '总导入条数',
          value: '-'
        }, {
          name: '已处理条数',
          value: '-'
        }, {
          name: '剩余条数',
          value: '-'
        }],
        jdtc: false,
        timer: null, //定时器
        chooseBjKm: '', //选中的班级科目dm
        chooseBj: [],
        chooseKm: [],
        total_dec: 0, //初始总数
        isEnd: false,
        djs: '',
        kstsxx: '', //当前有效的科目
        jdsz: 0,
        jdxs: false,
        num: 0,
        checkData: [],
        ksxn:''
      }
    },
    created() {
      this.clearTempData()
    },
    mounted() {},
    methods: {
      // 每次进入页面先清除临时表数据
      clearTempData() {
        API.clearTempData().then()
      },
      dec(data) {
        let index = data ? this.data.drlc.children.findIndex(item => item.name == data.name) : 2
        if (!this.ksmc) {
          this.data.drlc.children[0].error = '请选择考试名称'
        }
        if (!this.isdown) {
          if (index > 1) {
            this.data.drlc.children[1].error = '请选择下载导入模板,已下载,请勾选跳过'
          }
        }
        if (this.ksmc && this.isdown && this.data.drlc.choosed) {
          this.disabled = false
        }
      },
      down(data) {
        this.isdown = true
        data.success = true
        data.error = ''
        this.dec(data)
        window.open('/static/成绩批量导入.xlsx')
      },
      choose(e, data) {
        if (e.target.files[0].type != 'application/vnd.ms-excel' && e.target.files[0].type !=
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          data.error = '按模板文档导入'
          this.$refs.file.value = ''
          this.data.drlc.choosed = ''
          return
        }
        this.file = e
        this.data.drlc.choosed = e.target.value
        data.error = ''
        data.success = true
        this.dec(data)
      },
      upload() {
        this.dec()
        let _this = this
        _this.jdsz = 0
        this.disabled = true
        this.jdxs = true
        let data = new FormData()
        data.append('file', this.file.target.files[0])
        data.append('examId', this.ksmc)
        data.append('xn', this.ksxn)
        API.importScoreExcel(data, {
          onUploadProgress(progress) {
            _this.jdsz = Math.floor(progress.loaded / progress.total * 100)
          }
        }).then(res => {
          if (res.value) {
            this.status = true
            setTimeout(() => {
              this.jdtc = true
              this.jdsz = 0
            }, 1000)
            this.importScoreProgress()
            this.getCouseInfoFromTemp('end')
          } else {
            this.$message({
              message: res.resultMessage,
              type: 'warning'
            });
          }
          this.jdxs = false
        }).catch((r) => {
          console.log(r)
        })

      },
      // 获取列表中的学科数据
      async getCouseInfoFromTemp(flag,status) {
        let data = new FormData()
        data.append('examId', this.ksmc)
        API.getCouseInfoFromTemp(data).then(async res => {
          if (res.value) {
            let data_n = new Map();
            res.value = res.value.filter((arr) => !data_n.has(arr.kcmc) && data_n.set(arr.kcmc, 1))
            this.data.xzbj.bj_list = res.value
            for (var i = 0; i < res.value.length; i++) {
              this.$set(res.value[i], 'bj', [])
              await this.getSchoolClassInfoFromTemp(res.value[i].kcdm, i, flag)
              this.$set(res.value[i], 'xk', res.value[i].kcmc)
            }
            if (this.data.xzbj.xs_list.length == 0 && flag == 'end' || flag == 'end' && status == 0) {
              this.sxsj()
            }
          }
        }).catch((r) => {
          console.log(r)
        })

      },
      // 获取列表中的班级数据
      async getSchoolClassInfoFromTemp(kcdm, index, flag) {
        let data = new FormData()
        data.append('examId', this.ksmc)
        data.append('kcdm', kcdm)
        await API.getSchoolClassInfoFromTemp(data).then(res => {
          if (res.value) {
            res.value.unshift({
              bj: "全部",
              num: ""
            })
            if (this.data.xzbj.xs_list.length == 0 && flag == 'end') {
              res.value.forEach(e => {
                this.$set(e, 'classname', 'active')
              })
            } else {
              let num = 0
              res.value.forEach(e => {
                this.$set(e, 'classname', '')
                this.chooseBj.forEach(r=>{
                  if(r.children){
                    r.children.forEach(z=>{
                      if(kcdm == r.kcdm && z.bj == e.bj){
                       this.$set(e, 'classname', 'active')
                      }
                    })
                  }

                })
              })
            }
            this.$set(this.data.xzbj.bj_list[index], 'bj', res.value)
          }
        }).catch((r) => {
          console.log(r)
        })
      },
      // 检验单条记录是否有效
      jysfyx(value) {
        this.disabled = true
        this.$message({
          message: '数据校验中......',
          type: 'warning'
        });
        const data = new FormData()
        data.append('zt', value.ztm == 1 ? '正常' : (value.ztm == 2 ? '缺考' : '作弊'))
        data.append('examId', this.ksmc)
        data.append('xn', this.ksxn)
        // data.append('scoreImport',value)
        Object.keys(value).forEach((key) => {
          data.append(key, value[key])
        })
        API.updateSingleTemp(data).then(res => {
          if (res.value) {
            value.bz = res.value
            value.sfxz = false
          } else {
            value.bz = ''
            value.sfxz = true
          }
          this.getCouseInfoFromTemp()
          if (this.num > 0) {
            this.num--
          }
          if (this.num == 0) {
            this.disabled = false
          }
        }).catch((r) => {
          console.log(r)
        })
      },
      jyxm(e, data) {
        if (e.target.value) {
          this.num++
          this.jysfyx(data)
        }
      },
      jyxj(e, data) {
        if (e.target.value) {
          this.num++
          this.jysfyx(data)
        }
      },
      jyztm(e, data) {
        if (e) {
          this.num++
          this.jysfyx(data)
        }
      },
      // 获取临时表数据
      getTempData() {
        let data = new FormData()
        data.append('pageNum', this.pageNum)
        data.append('pageSize', this.pageSize)
        data.append('courseClassList', this.chooseBjKm)
        data.append('examId', this.ksmc)
        API.getTempData(data).then(res => {
          if (res.value.list) {
            this.total = res.value.total
            res.value.list.forEach((e, index) => {
              this.$set(e, 'num', this.pageSize * (this.pageNum - 1) + (index + 1))
              this.$set(e, 'sfxz', false)
              this.chooseBj.forEach(r=>{
                if(r.children){
                  r.children.forEach(z=>{
                    if (r.kcmc == e.kcmc && e.bz == '' && z.bj == e.bj) {
                      this.$set(e, 'sfxz', true)
                    }
                  })

                }

              })
            })
            console.log(res.value.list)
            this.data.xzbj.xs_list = res.value.list
          }
        }).catch((r) => {
          console.log(r)
        })
      },
      // 获取上传进度
      importScoreProgress() {
        let data = new FormData()
        data.append('examId', this.ksmc)
        API.importScoreProgress(data).then(res => {
          if (res.value) {
            let total = Number(res.value.split('/')[1])
            let used = Number(res.value.split('/')[0])
            let free = total - used
            this.$set(this.jdt[0], 'value', String(total))
            this.$set(this.jdt[1], 'value', String(used))
            this.$set(this.jdt[2], 'value', String(free))
            let num = 5
            let time = null
            this.djs = '(还有' + num + '秒关闭弹窗)'
            time = setInterval(() => {
              if (num > 0) {
                num = num - 1
              } else {
                clearInterval(time)
              }
              this.djs = '(还有' + num + '秒关闭弹窗)'
            }, 1000)
            setTimeout(() => {
              this.jdtc = false
              this.disabled = false
            }, 5000)

          }
        }).catch((r) => {
          console.log(r)
        })
      },
      back() {
        this.status = false
        this.data.xzbj.xs_list = []
        this.clearTempData()
      },
      chooseData(data, index) {
        this.checkData = []
        let list = this.data.xzbj.bj_list[index].bj
        let name = data.classname
        if (data.bj == '全部') {
          list.forEach(e => {
            this.$set(e, 'classname', name == 'active' ? '' : 'active')
          })
          this.activeLen = name == 'active' ? 0 : list.length

        } else {
          this.$set(data, 'classname', data.classname == 'active' ? '' : 'active')
          let data_n = _.cloneDeep(list)
          data_n.splice(0, 1)
          let data_len = data_n.filter(item => item.classname == 'active').length
          if (data_len == list.length - 1) {
            this.$set(list[0], 'classname', 'active')
          } else {
            this.$set(list[0], 'classname', '')
          }
        }
        // 筛选匹配的表数据（科目班级备注状态）
        this.sxsj()
      },
      submit() {
        let _this = this
        this.jdsz = 0
        let data = new FormData()
        data.append('examId', this.ksmc)
        data.append('xn', this.ksxn)
        data.append('courseClassList', this.chooseBjKm)
        this.jdxs = true
        this.disabled = true
        API.submitBatchScore(data, {
          onUploadProgress(progress) {
            _this.jdsz = Math.floor(progress.loaded / progress.total * 100)
          }
        }).then(res => {
          if (res.value) {
            if (!this.total_dec) {
              this.total_dec = _.cloneDeep(this.total)
            }
            setTimeout(() => {
              this.jdtc = true
              this.jdxs = false
            }, 1000)
            this.submitScoreProgress()
          } else {
            this.jdxs = false
             this.disabled = false
            this.$message({
              message: res.resultMessage,
              type: 'warning'
            });
          }

        }).catch((r) => {
          console.log(r)
        })
      },
      // 获取提交进度
      submitScoreProgress() {
        let data = new FormData()
        let _this = this
        data.append('examId', this.ksmc)
        data.append('courseClassList', this.chooseBjKm)
        API.submitScoreProgress(data, {
          onUploadProgress(progress) {
            _this.jdsz = Math.floor(progress.loaded / progress.total * 100)
          }
        }).then(res => {
          if (res.value) {
            // 有效总数
            let total = this.total_dec - Number(res.value.totalInvalidCount)
            let used = total - Number(res.value.currentValidCount)
            let free = res.value.currentValidCount
            this.jdt = [{
              name: '总提交条数(有效)',
              value: total
            }, {
              name: '已提交条数',
              value: used
            }, {
              name: '未提交条数',
              value: free
            }]
            let num = 5
            let time = null
            this.djs = '(还有' + num + '秒关闭弹窗)'
            time = setInterval(() => {
              if (num > 0) {
                num = num - 1
              } else {
                clearInterval(time)
              }
              this.djs = '(还有' + num + '秒关闭弹窗)'
            }, 1000)
            setTimeout(() => {
              this.jdtc = false
              this.total_dec = 0
              this.disabled = false
              // this.disabled = true
              this.getCouseInfoFromTemp('end',0)
            }, 5000)
          }
        }).catch((r) => {
          console.log(r)
        })
      },
      sxsj() {
        // 选中的班级
        this.chooseBjKm = ''
        this.chooseBj = []
        this.chooseKm = []
        for (var j = 0; j < this.data.xzbj.bj_list.length; j++) {
          let sfcf = this.chooseBj.filter(item=>item.kcmc == this.data.xzbj.bj_list[j].kcmc && item.kcdm == this.data.xzbj.bj_list[j].kcdm)
          if(sfcf.length == 0){
            this.chooseBj.push({
              kcmc:this.data.xzbj.bj_list[j].kcmc,
              kcdm:this.data.xzbj.bj_list[j].kcdm,
              children:[]
            })
          }
          if (this.data.xzbj.bj_list[j].bj) {
            for (var i = 0; i < this.data.xzbj.bj_list[j].bj.length; i++) {
              if (this.data.xzbj.bj_list[j].bj[i].classname == 'active') {
                this.chooseBj[this.chooseBj.length - 1].children.push(this.data.xzbj.bj_list[j].bj[i])
                if(this.data.xzbj.bj_list[j].bj[i].uuid){
                   this.chooseKm.push(this.data.xzbj.bj_list[j])
                  this.checkData.push(this.data.xzbj.bj_list[j].kcdm + '_' + this.data.xzbj.bj_list[j].bj[i].uuid)
                }

              }
            }
          }
        }
        this.chooseBjKm = this.checkData.join(',')
        this.pageNum = 1
        this.getTempData()
      },
      change(e, data) {
        if (e) {
          data.success = true
          data.error = ''
          let par = new FormData()
          par.append('examId', e)
          // 请求接口获取学年
          // this.ksxn
          API.getExamXn(par).then(res => {
            if (res.value) {
              this.ksxn = res.value
            }
          }).catch((r) => {
            console.log(r)
          })

          API.getValidCourseByExam(par).then(res => {
            if (res.value) {
              let kmsj = []
              res.value.forEach(e => {
                kmsj.push(e.kcmc)
              })
              this.kstsxx = '注：本次可有效导入课程是' + kmsj.join('、')
            }
          }).catch((r) => {
            console.log(r)
          })
          this.dec(data)
        }
      },
      downChange(e, data) {
        if (e) {
          data.success = true
          data.error = ''
          this.dec(data)
        }
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getTempData()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getTempData()
      },
      // 异常数据导出
      ycdc() {
        let data = new FormData()
        data.append('examId', this.ksmc)
        API.exportErrorScore(data).then(res => {
          common.dc(res, '异常数据.xls')
        }).catch((r) => {
          console.log(r)
        })

      }
    }
  }
</script>

<style scoped="scoped">
  .el-pagination {
    margin-top: 20px;
    text-align: right;
  }

  .main_content {
    padding: 20px;
  }

  .main {
    min-height: 600px;
    position: relative;
  }

  .down {
    margin-right: 10px;
  }

  .head {
    padding: 10px;
    border-radius: 3px;

  }

  .bg_yellow {
    background: #FFFBE6;
  }

  .title {
    line-height: 40px;
    font-size: 0;
  }

  .yellow {
    color: rgba(234, 137, 2, 1);
  }

  .zysx_item {
    line-height: 25px;
    display: inline-block;
    width: 50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  button {
    border: 0;
    line-height: 35px;
    background: #409eff;
    color: #fff;
    border-radius: 4px;
    padding: 0 15px;
    margin: 0 0 5px 10px;
  }

  .upload,
  .green {
    background: #21CB5A;
  }

  .color_blue {
    color: #409eff;
  }

  .color_yellow {
    color: #ffb600;
  }

  .color_green {
    color: #21CB5A;
  }

  .drlc_item {
    line-height: 35px;
    padding-left: 50px;
    position: relative;
  }

  .drlc {
    margin-top: 10px;
  }

  .red {
    color: red;
  }

  #file {
    width: 100%;
    outline: 0;
    line-height: 30px;
    padding: 0;
    height: 35px;
    display: inline-block;
    vertical-align: bottom;
    opacity: 0;
    position: absolute;
    left: 0;
    z-index: 10;
    cursor: pointer;
  }

  .choose {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 35px;
    line-height: 35px;
    vertical-align: bottom;
    text-align: center;
    border-radius: 4px;
    color: #ffff;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    cursor: pointer;

  }

  .choosed {
    padding: 0;
  }

  .upload_title {
    vertical-align: top;
    margin-left: 5px;
    font-weight: normal;
  }

  .main_display_inline_block {
    display: inline-block !important;
  }

  .xzbj_item {
    display: inline-block;
    line-height: 30px;
    border: 1px solid #409eff;
    padding: 0 15px;
    color: #409eff;
    border-radius: 4px;
    margin: 0 10px 10px 0;
    cursor: pointer;
    position: relative;
  }


  .active {
    background: #409eff;
    color: #fff;
  }

  .zysx ul {
    padding: 0 28px;
  }

  .zysx {
    position: relative;
  }

  .zysx_icon {
    width: 18px;
    height: 18px;
    display: inline-block;
    background: url(../../../../assets/tip@2x.png)center center no-repeat;
    vertical-align: middle;
    background-size: 100%;
    margin-right: 10px;
  }

  .zysx_text {
    font-size: 16px;
    display: inline-block;
    vertical-align: bottom;
  }

  .zysx_close {
    width: 15px;
    height: 15px;
    display: block;
    position: absolute;
    right: 5px;
    top: 5px;
    background: url(../../../../assets/close@2x.png)center center no-repeat;
    background-size: 100%;
    cursor: pointer;
  }

  .open {
    font-weight: normal;
    margin-left: 10px;
    color: #409eff;
    cursor: pointer;
  }

  .drlc .title,
  .xzbj .title {
    font-size: 18px;
  }

  .step {
    width: 30px;
    height: 30px;
    display: inline-block;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    color: #CCCCCC;
    margin-right: 10px;
    position: absolute;
    left: 0;
    top: 5px;
  }

  .step::before {
    content: '';
    width: 1px;
    height: 28px;
    position: absolute;
    top: 35px;
    background: #CCCCCC;
    left: 50%;
  }

  .drlc_item:last-child .step::before {
    display: none;
  }

  .step_num {
    display: block;
    font-weight: normal;
    font-size: 16px;
  }

  .step_content .step_num {
    font-size: 14px;
    color: #808080;
  }

  .step_name {
    margin-right: 10px;
  }

  .el-checkbox.is-bordered.el-checkbox--medium {
    padding: 8px 20px 7px 10px;
  }

  .choosed_file {
    background: #F2F2F2;
    color: #333333;
    font-weight: normal;
    border-radius: 3px;
    padding: 0 10px;
    /* padding: 0 55px 0 10px;
    margin-left: 10px; */
  }

  .down_icon,
  .upload_icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(../../../../assets/download@2x.png)center center no-repeat;
    background-size: 100%;
    cursor: pointer;
    vertical-align: middle;
  }

  .upload_icon {
    width: 15px;
    height: 15px;
    background: url(../../../../assets/add@2x.png)center center no-repeat;
    background-size: 100%;
    vertical-align: sub;
  }

  button label {
    cursor: pointer;
  }

  .success {
    background: url(../../../../assets/success.png)center center no-repeat;
    background-size: 100%;
    border: 0;
  }

  .upload {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
  }

  button[disabled] {
    opacity: 0.5;
  }

  .xzbj .title_item {
    list-style-type: initial;
    color: #808080;
  }

  .title_list {
    padding: 0 15px;
  }

  .gnan_title {
    color: #808080;
    font-size: 14px;
    font-weight: normal;
    float: left;
    line-height: 35px;
  }

  .gnan {
    margin: 10px 0 5px 0;
    overflow: hidden;
  }

  .gnan .drlc_item_btn {
    float: right;
  }

  .gnan .drlc_item_btn .upload_icon {
    background: url(../../../../assets/upload@2x.png)center center no-repeat;
    background-size: 100%;
  }

  .submit_box {
    position: absolute;
    width: 100%;
    left: 0;
    height: 45px;
    bottom: 0;
    text-align: center;
    padding-top: 14px;
    border-top: 1px solid #EBEEF5;
  }

  .after {
    padding-bottom: 45px;
  }

  .primary {
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #333333;
  }

  .bjrs {
    position: absolute;
    padding: 0 5px;
    background: #FA8C16;
    border-radius: 12px 12px 12px 2px;
    color: #fff;
    right: -15px;
    top: -5px;
    z-index: 100;
    line-height: 20px;
  }

  .lbsj {
    padding-top: 10px;
    margin: 0;
  }

  .jdtc {
    position: fixed;
    width: 400px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    left: 50%;
    margin-left: -150px;
    top: 50%;
    background: #fffffff5;
    z-index: 1000;
    text-align: center;
    -webkit-box-shadow: 0 0 5px #eee;
    box-shadow: 0 0 5px #eee;
    margin-top: -70px;
  }

  .jdtc .head {
    border-bottom: 1px solid #dcdfe6;
    border-radius: 0;
    font-size: 16px;
  }

  .jdtc .content_item {
    width: 33.3%;
    float: left;
    padding: 20px 0;
  }

  .jdtc .content_item_num {
    display: block;
    line-height: 40px;
    font-size: 20px;

  }

  .jdtc .content_item_title {
    color: #808080;
    font-weight: normal;
  }

  .jdtc .content {
    overflow: hidden;

  }

  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
  }

  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF;
  }

  .jdxs {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: -20px;
    background: rgba(0, 0, 0, 0.28);
    z-index: 1000000;
    border-radius: 4px;
  }

  .jsxs_box {
    width: 50%;
    height: 50px;
    position: absolute;
    left: 25%;
    top: 45%;
  }

  .progress {
    width: 100%;
    text-align: center;
    margin: auto;
    border: 0;
    background: none;
  }

  .jdxs_text {
    display: block;
    text-align: center;
    margin-top: 10px;
    color: #fff;
  }
  .step::after {
      display: none;
  }
</style>
