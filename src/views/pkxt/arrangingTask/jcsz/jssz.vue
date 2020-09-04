<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-05 15:53:20
 * @LastEditTime: 2019-08-13 18:35:44
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="el-jssz">
    <div class="filter-container">
      <el-select style="float:left;" v-model="njValue" @change="handLoadJssz">
        <el-option
          v-for="item in njOptions"
          :key="item.njdm"
          :label="item.njmc"
          :value="item.njdm">
        </el-option>
      </el-select>&nbsp;
      <upload-excel-component @on-selected-file='getExcelData'></upload-excel-component>
      <el-button type="primary" icon="el-icon-download" @click="handleDownload" :loading="downloadLoading">
        下载导入模板
      </el-button>
    </div>
    <div style="padding-bottom: 10px">
      <el-alert
        style="margin: 4px 0 !important;"
        title="温馨提示，“不可设置”原因：基础设置模块-课程设置中无当前课程或者课程节数为0则不可设置班级课程教师。"
        type="warning" show-icon>
      </el-alert></div>


    <el-table class="jssz-table" :data="tableData" height="520"
              border fit highlight-current-row style="width: 100%" >
      <el-table-column fixed prop="name" label="任课" align="center"></el-table-column>
      <el-table-column align="center" v-for='(fruit,index) in formThead' :key='index' :label="fruit.kcmc" >
        <template slot-scope="scope">
          <div class="teacherName-warp" @click="changeTeacher(scope,fruit)" v-if="scope.row[fruit.kcdm] && scope.row[fruit.kcdm] != ''">
            <div class="teacherName-table">
              {{scope.row[fruit.kcdm].xm[0]}}&nbsp;{{scope.row[fruit.kcdm].xm.length ==2? scope.row[fruit.kcdm].xm[1] : ''}}
            </div>

          </div>

          <div v-else>
            <span style="color: #c0c4cc;font-size: 8px;">不可设置</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <multipleselect ref="selectTeacher" v-bind:teacherList="teacherList" v-bind:checkTeacher="checkteacher" v-bind:multipleLimit='2' @handleChangeSel="handleChangeSel">
    </multipleselect>

  </div>
</template>

<script>
  import { getKcNjgx, getKcSz, getSaveJsSz, getJszjsgxList, checkGzsz, initGzsz } from '@/api/pkxt/arrangingTask/jcsz/jssz'
  import jcsj from '@/views/pkxt/arrangingTask/pkjcsj';
  import UploadExcelComponent from '@/components/UploadExcel/index'
  import multipleselect from '@/components/multipleSelect/index'
  export default {
    name: 'uploadExcel',
    components: { UploadExcelComponent,multipleselect},
    data() {
      return {
        filename: '',
        mp: [],
        dialogVisible: false,
        szjsArry: [],
        njOptions: [],
        njValue: '',
        tableData: [],
        key: 1, // table key
        formThead: [], // 默认表头 Default header
        value9: [],
        temp: {},
        bjdm: '',
        kcdm: '',
        teacherListGroup: null,// 可以排课教师组 该数组根据课程已分组
        downloadLoading: false,
        loading: false,
        xxdm: this.$route.query.xxdm,
        rwid: this.$route.query.rwid,
        dqxn: this.$route.query.dqxn,
        dqxq: this.$route.query.dqxq,
        multipleLimit: 2,
        jszjsxxList: [],
        checkGztj: false,
        checkteacher:[],//已宣教室数组
        teacherList:[],//该数组为处理后teacherListGroup的数组，没有根据课程分组
      }
    },
    watch: {
    },
    created() {
      const parm = { rwid: this.rwid }
      /** 获取年级**/
      jcsj.hqnjlb(parm).then(res => {
        this.njOptions = res;
        this.njValue = this.njOptions[0].njdm;
      })
    },
    mounted() {
    },
    methods: {
      async handLoadJssz() {
        let that = this;
        const parm = { xxdm: this.xxdm, njdm: this.njValue, rwid: this.rwid }
        /** 获取课程年级关系**/
        const result = await getKcNjgx(parm);

        this.formThead = [];
        for (const o of result.data.rows) {
          this.formThead.push({
            /** 获取课程代码**/
            kcdm: o.kcdm,
            /** 获取课程名称**/
            kcmc: jcsj.hqkcmcByid(this.kcList, o.kcdm)
          });
        }

        /** 获取年级课程设置列表**/
        getKcSz({ rwid: this.rwid, xxdm: this.xxdm }).then(response => {
          this.tableData = [];
          /** 获取年级班级信息**/
          const bj_list = _.filter(this.bjList, { njdm: this.njValue });
          const bj_list_sort = jcsj.sortObjectByStr(bj_list,'bj');
          /** 遍历班级**/
          this.tableData = bj_list_sort.map(item => {
            const map = { bjdm: item.uuid, name: item.bj };
            /** 获取班级课程计划信息**/
            const kc_list = _.filter(response.data.rows, e => e.bjdm === item.uuid && parseInt(e.zxs) !== 0);
            /** 遍历课程信息**/
            for (const o of kc_list) {
              if (o.zgh && o.zgh.length > 0) {
                const zghArry = o.zgh.split(',');
                let xmArry;
                if (zghArry.length === 1) {
                  xmArry = jcsj.hqjsmcByid(this.jsList, zghArry[0])
                } else {
                  xmArry = jcsj.hqjsmcByid(this.jsList, zghArry[0]) + ',' + jcsj.hqjsmcByid(this.jsList, zghArry[1])
                }
                map[o.kcdm] = {
                  gh: zghArry, xm: xmArry.split(',')
                };
              } else {
                map[o.kcdm] = {
                  gh: o.zgh,
                  xm: [jcsj.hqjsmcByid(this.jsList, o.zgh)]
                };
              }
            }
            return map;
          })
        });
        this.teacherList = [];
        this.teacherListGroup = JSON.parse(window.sessionStorage.getItem('pk_js_list'));
        this.teacherList = _.uniqWith(that.teacherListGroup, _.isEqual)
        /** 远程搜索教师组教师数据初始化**/
        // getJszjsgxList({ xxdm: this.xxdm }).then(res => {
        //   this.teacherListGroup = res;

        //   that.teacherList = [];
        //   that.teacherListGroup.forEach((item,index)=>{
        //     that.teacherList.push({
        //       gh:item.zgh,
        //       xm:jcsj.hqjsmcByid(this.jsList, item.zgh),
        //     })
        //   })
        //   that.teacherList = _.uniqWith(that.teacherList, _.isEqual)

        // })

        /** 验证规则条件数据是否为空 **/
        checkGzsz({ rwid: this.rwid, xxdm: this.xxdm }).then(res => {
          this.checkGztj = res.data;
        });
      },

      /** 保存教师**/
      /*
      temp.newZgh 为修改后的zgh
      temp.oldZgh 为修改前的职工号
      */
      handleChangeSel(curTeacher) {
        const temp = {}
        temp.xxdm = this.xxdm;
        temp.rwid = this.rwid;
        temp.bjdm = this.bjdm;
        temp.kcdm = this.kcdm;
        temp.reverse = this.checkGztj;
        temp.zgh = curTeacher.length == 2 ? curTeacher[0].gh + ',' + curTeacher[1].gh : curTeacher.length == 1 ? curTeacher[0].gh : ''
        if(this.checkteacher.length == 0 && curTeacher.length != 0){
          temp.newZgh = temp.zgh;//数组
          temp.oldZgh = '';
        }else if(this.checkteacher.length != 0 && curTeacher.length == 0){
          temp.newZgh = '';
          temp.oldZgh = this.checkteacher.length == 2 ? this.checkteacher[0].gh + ',' + this.checkteacher[1].gh : this.checkteacher[0].gh;
        }else if(curTeacher.length == 1){
          if(this.checkteacher.length == 1){
            if(curTeacher[0].gh == this.checkteacher[0].gh){
              temp.newZgh = '';
              temp.oldZgh = '';
            }else{
              temp.newZgh = curTeacher[0].gh;//数组
              temp.oldZgh = this.checkteacher[0].gh;
            }
          }else{
            let include = _.filter(this.checkteacher,function(o){
              return curTeacher[0].gh == o.gh
            })

            let noInclude = _.filter(this.checkteacher,function(o){
              return curTeacher[0].gh != o.gh
            })

            if(include.length == 0){//不包含
              temp.newZgh = curTeacher[0].gh;//数组
              temp.oldZgh = this.checkteacher[0].gh + ',' + this.checkteacher[1].gh;
            }else{//包含

              temp.newZgh = curTeacher[0].gh;//数组
              temp.oldZgh = noInclude[0].gh;
            }
          }
        }else{//(curTeacher.length == 2)
          if(this.checkteacher.length == 1){
            temp.newZgh = curTeacher[0].gh + ',' + curTeacher[1].gh;//数组
            temp.oldZgh = this.checkteacher[0].gh;
          }else{
            let [that,count,tempDiffTeach] = [this,0,''];
            curTeacher.forEach(e=>{
              that.checkteacher.forEach(o=>{
                if (e.gh === o.gh) {
                  count++;
                  tempDiffTeach = o.gh
                }
              })
            })
            //都相等
            if (count===2) {
              temp.newZgh = '';//数组
              temp.oldZgh = '';
            } else if(count===0) {
              temp.newZgh = curTeacher[0].gh+ ',' + curTeacher[1].gh;//数组
              temp.oldZgh = this.checkteacher[0].gh + ',' + this.checkteacher[1].gh;
            } else{
              temp.newZgh = _.filter(curTeacher,function(o){
                return tempDiffTeach != o.gh
              })[0].gh
              temp.oldZgh = _.filter(this.checkteacher,function(o){
                return tempDiffTeach != o.gh
              })[0].gh
            }
          }
        }

        getSaveJsSz(temp).then(res => {
          this.handLoadJssz();
          if (res.data) {
            this.$nextTick(()=>{
              this.$refs.selectTeacher.cancal()
            })
            this.$notify({ title: '提示', message: '操作成功', type: 'success', duration: 2000 })
          } else {
            this.$notify.error({ title: '保存失败', message: res.message });
          }
        })
        this.valueAdd = '';
      },
      handleDownload() {
        /** 下载excel**/
        this.downloadLoading = true;
        import('@/vendor/Export2Excel').then(excel => {
          /** 获取年级名称**/
          const njmc = jcsj.hqnjmcByid(this.njList, this.njValue);
          const tHeader = ['任课']
          const filterVal = ['name']
          for (const o of this.formThead) {
            tHeader.push(o.kcmc);
            filterVal.push(o.kcdm);
          }
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel(tHeader, data, njmc + '教师录入表格')
          this.downloadLoading = false;
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            if (j === 'name') {
              return v[j];
            } else {
              if(v[j]){
                return v[j].xm;
              }else{
                return "不可设置";
              }
            }
          }
        }))
      },
      getExcelData(data) { /** excel导入教师**/
        /** 导入模板验证**/
        if ((this.formThead.length + 1) !== data.header.length || data.results.length !== this.tableData.length) {
          this.$alert('excel表头或行数不匹配，请下载正确的模板。', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: () => false
          });
          return false
        } else {
          /** excel数据处理**/
          const map = this.excelDispose(data);
          if (map.json) {
            let str = null;
            if (map.message.size > 0) {   /** 验证存在异常 **/
            str = Array.from(map.message).join(',') + '该教师不存在于教师组维护中,将不会被导入是否导入?';
              this.$confirm(str, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.loadSaveJsSz(map.json);
              }).catch(() => false);
            } else {   /** 验证不存在异常 **/
            this.loadSaveJsSz(map.json);
            }
          }
        }
      },
      loadSaveJsSz(json) {
        /** excel数据导入数据库**/
        getSaveJsSz({ xxdm: this.xxdm, rwid: this.rwid, njdm: this.njValue, pkJxjhList: json }).then(res => {
          this.handLoadJssz();
          if (res.data) {
            this.$notify({ title: '成功', message: '导入成功', type: 'success', duration: 2000 })
          } else {
            this.$notify.error({ title: '错误', message: '导入失败' });
          }
        })
      },
      excelDispose(data) {
        const map_arry = { json: [], message: new Set() }
        for (const o of data.results) {
          /** 获取读取返回的班级课程教师excel数据**/
          let bjdm = '';
          for (const e in o) {
            if (e === '任课') {
              /** 取班级代码**/
              bjdm = jcsj.hqbjdmBymc(this.bjList, o[e]);
              if (bjdm==o[e]) {
                const message = '错误原因:“' + o[e] + '”不匹配,请检查模板。';
                this.$alert(message, '提示', {
                  type: 'warning',
                  confirmButtonText: '确定',
                  callback: () => false
                });
                return false
              }
            } else {
              /** 取课程和教师代码**/
              const map = {}
              const kcdm = jcsj.hqkcdmBymc(this.kcList, e);
              if (kcdm==e) {
                const message = '错误原因:“' + e + '”不匹配,请检查模板。)';
                this.$alert(message, '提示', {
                  type: 'warning',
                  confirmButtonText: '确定',
                  callback: () => false
                });
                return false
              }
              map.rwid = this.rwid;
              map.xxdm = this.xxdm;
              map.bjdm = bjdm;
              map.kcdm = kcdm;
              if (o[e]) {
                const zghArr = o[e].split(',');
                if(zghArr.length>2){
                  this.$notify.error({ title: '错误', message: '每门课程最多设置2位老师' });
                  return false;
                }
                const xmArr = [];
                zghArr.forEach(zgh=>{
                  if(zgh!=='不可设置'){
                    const xm = jcsj.hqjsdmBymc(this.jsList,zgh);
                    if (xm==zgh) {
                      map_arry.message.add(xm);
                    }else{
                      xmArr.push(xm);
                    }
                  }
                })
                map.zgh = xmArr.join(',');
              } else {
                map.zgh = '';
              }
              map_arry.json.push(map);
            }
          }
        }
        return map_arry;
      },
      handleUpload() {
        document.getElementById('excel-upload-input').click();
        this.$refs['excel-upload-input'].value = null;
      },

      changeTeacher(scope, fruit) {
        let that = this;
        const [v, b, k] = [scope.row[fruit.kcdm].gh, scope.row.bjdm, fruit.kcdm];

        this.bjdm = b;
        this.kcdm = k;
        if(scope.row[fruit.kcdm].gh == undefined){
          that.checkteacher = [];
        }else{
          that.checkteacher = [];
          //console.log(scope.row[fruit.kcdm],777)
          _.forEach(scope.row[fruit.kcdm].gh,function(item,index){
            that.checkteacher.push({
              gh:item,
              xm:scope.row[fruit.kcdm].xm[index]
            })
          })
        }

        this.$nextTick(()=>{
          this.$refs.selectTeacher.showSelect()
        })


      },

    },
    props: {
      njList: {
        /** 年级类型列表数据**/
        type: Array,
        required: true
      },
      bjList: {
        /** 班级级类型列表数据**/
        type: Array,
        required: true
      },
      kcList: {
        /** 课程级类型列表数据**/
        type: Array,
        required: true
      },
      jsList: {
        /** 教师级类型列表数据**/
        type: Array,
        required: true
      },
      jszList: {
        /** 教师组列表数据**/
        type: Array,
        required: true
      }
    }
  }
</script>
<style scoped>
  #excel-upload-input {
    display: none;
    z-index: -9999;
  }
  #jel-dialog__body .el-dialog__body {
    padding: 0px 20px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  .teacherName-warp{
    clear: both;
    height: 30px;
  }
</style>
<style>
  .jssz-table.el-table .cell{
     height: 30px;
    line-height: 30px !important;
    padding: 0;
  }
</style>
