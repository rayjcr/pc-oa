<template>
  <div class="view">

    <el-row>
      <div class="selgroup fl">
        <el-select v-model="dqnj" placeholder="请选择年级" style="width:150px;margin:0 5px;" @change="getpkjg">
          <el-option label="全校" value="all"></el-option>
          <el-option v-for="item in njList" :label="item.njmc" :value="item.njdm" :key="item.njdm">
          </el-option>
        </el-select>
      </div>
      <div class="fr">
        <el-button type="primary" icon="el-icon-upload2"  v-if="this.kblx==='zgh'" @click="importzkb">导入</el-button>
        <el-button type="primary" icon="el-icon-upload2" @click="exportTable()">导出</el-button>
      </div>
    </el-row>

    <el-row class="sumKBBox mt20 smallscroll">
      <div class="kbbcFixed">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="height:132px;" :colspan="cplspanNum">{{kbmc}}</td></tr>
          <tr v-for="(fz,rowIndex) in kbfz">
            <td>{{fz.fzmc}}</td>
            <td v-if="kblx=='zgh'"><div v-for="kc in fz.children" >{{kc.kcmc}}</div></td>
          </tr>
        </table>
      </div>
      <div class="KbBoxScroll smallscroll">
        <div class="largekb">
          <table ref="kb_table_ref" cellpadding="0" cellspacing="0" class="zkbtable fl mggtable" >
            <thead>
            <tr>
              <th style="display: none" :colspan="cplspanNum" rowspan="2">总课表</th>
              <th v-for="zs in pkzs" :colspan="pkjs.length">星期{{zs}}</th>
              <th  rowspan="2">周上课节数</th>
            </tr>
            <tr>
              <th v-for="js in zpkjs">第{{js}}节</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(fz,rowIndex) in kbfz">
              <td style="display: none">{{fz.fzmc}}</td>
              <td style="display: none" v-if="kblx=='zgh'"><div v-for="kc in fz.children" >{{kc.kcmc}}</div>
              </td>
              <td v-for="(jc,colIndex) in zpkjs"><span v-html="zkb[rowIndex][colIndex]"></span></td>
              <td>{{fz.skjs}}</td>
            </tr>
            </tbody>

          </table>
        </div>
      </div>
    </el-row>
    <!--导入界面-->
    <el-dialog title="导入总课表数据" :visible.sync="dialog_1" width="560px">
      <el-row>
        <div>
          <el-upload class="upload-demo"
                     :action="importUrl"
                     :name ="name"
                     :headers="importHeaders"
                     :multiple="false"
                     :data = "{xxdm:this.xxdm,code:code,rwid:this.rwid}"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :before-upload="beforeUpload"
                     :on-error="uploadFail"
                     :on-success="uploadSuccess"
                     :on-change="submitUpload"
                     :file-list="fileList"
                     :limit=1
                     ref="upload"
                     :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary" @click="xzwj">选取文件</el-button>
            <div slot="tip" style="margin-bottom: 50px;" class="el-upload__tip">只能上传excel文件</div>
          </el-upload>
        </div>
      </el-row>
      <el-row>
        <el-button  size="small" type="primary" @click="exportTable">模板下载</el-button>
      </el-row>
      <el-row>
        <span><h3>操作说明：</h3></span><br/>
        <span>1、请使用本页面提供的模板进行导入。</span><br/>
        <span>2、请勿修改模板Excel的表头内容。</span><br/>
        <span>3、模板提供的默认信息，请勿随意修改。</span><br/>
        <span>4、模板中显示的项目要一次填全，请注意。</span>
      </el-row>
    </el-dialog>

    <el-dialog title="导入数据" :visible.sync="dialog_2" @close="cancel_dr">
      <span style="font-weight:bold;">提示：</span><span>导入失败，请修改下列异常数据后再重新导入</span>
      <el-table :key='tableKey' :data="errlist"  border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" min-width="20%" label="任课教师">
          <template slot-scope="scope">
            <span>{{scope.row.zd0}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80%"label="异常信息">
          <template slot-scope="scope">
            <span style="color:#FF0000">{{scope.row.bz}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button type="primary" @click="cancel_dr">关闭</el-button>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import { getToken } from 'utils/auth';
  import { timeTableInfo, coursePlanList, exportZjsrkb } from '@/api/pkxt/arrangingTask/pktz/index';
  import jcsj from '@/views/pkxt/arrangingTask/pkjcsj';
  export default {
    data() {
      return {
        dialog_1: false,
        dialog_2: false,
        errlist: [],
        tableKey: 0,
        listLoading: true,                      // 加载
        xxdm: window.localStorage.getItem('xxdm'),
        kblx: '',
        kbmc: '',
        dqnj: 'all',
        pkzs: [],
        pkjs: [],
        kbfz: [],
        zpkjs: [],
        zkb: [],
        cplspanNum: 1,
        importUrl: '/api/course/pktz/importZjskbExcel',
        importHeaders: {
          enctype: 'multipart/form-data',
          Authorization: getToken()
        },
        code: 'pkxtzjskbManager',
        name: 'upfile',
        fileList: [],
        rwid: this.$route.query.rwid,
        outputs: [],
        changeSure: false                      // 防止重复提交
      }
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
      }
    },
    created() {
      // this.getKbtable("bjdm");
    },
    methods: {
      // 根据课时获取课表结构
      getKbtable(kblx) {
        this.zpkjs = [];
        this.pkjs = [];
        this.kblx = kblx;
        const rwid = this.$route.query.rwid;
        timeTableInfo(rwid).then(res => {
          this.pkzs = res.data.weekdayList;
          for (let i = 1; i <= res.data.totalLessonCount; i++) {
            this.pkjs.push(i)
          }
          this.pkzs.forEach(() => {
            for (let i = 1; i <= res.data.totalLessonCount; i++) {
              this.zpkjs.push(i);
            }
          })
          this.getpkjg();
        })
      },
      // 组装排课结果
      getpkjg() {
        const kblx = this.kblx;
        const rwid = this.$route.query.rwid;
        coursePlanList(rwid).then(res => {
          // 筛除属性为空的数据
          let jspkjg = [];
          const dqnj = this.dqnj;
          if (dqnj !== 'all') {
            jspkjg = _.filter(res.data, o => o[kblx] && o.njdm === dqnj && o.ctype === '0')
          } else {
            jspkjg = _.filter(res.data, o => o[kblx] && o.ctype === '0')
          }
          this.hqkbfz(jspkjg, kblx);
          this.clzkb(jspkjg, kblx);
          this.clfzxx(kblx);
        })
      },
      // 表头 第一列
      hqkbfz(pkjg, kblx) {
        const result = [];
        pkjg.forEach(item => {
          const kcxx = { kcdm: item.kcdm, kcmc: '' };
          // 根据字段分组，获取课表行数
          const keyValue = item[kblx];
          const arr = _.find(result, o => o[kblx] === keyValue)
          if (arr) {
            const fikcdm = _.find(arr.children, ['kcdm', item.kcdm]);
            if (!fikcdm) {
              arr.children.push(kcxx);
            }
          } else {
            const obj = {};
            obj[kblx] = keyValue;
            obj.skjs = 0;
            obj.children = [];
            obj.children.push(kcxx);
            result.push(obj);
          }
        })
        this.kbfz = jcsj.sortObjectByStr(result, kblx);
      },
      // 初始化 空课表
      initkbTable(kblx) {
        if (kblx === 'zgh') {
          this.cplspanNum = 2;
          this.kbmc = '总任课表';
        } else {
          this.cplspanNum = 1;
          this.kbmc = '总课表';
        }
        const result = [];
        this.kbfz.forEach(() => {
          const rowData = [];
          this.zpkjs.forEach(() => {
            rowData.push([]);
          })
          result.push(rowData);
        })
        return result;
      },
      // 将课程放入课表中
      clzkb(pkjg, kblx) {
        const zkb = this.initkbTable(kblx);
        pkjg.forEach(item => {
          const pkzs = this.pkzs.indexOf(item.pkzs);
          const fzxx = _.find(this.kbfz, [kblx, item[kblx]]);
          const colindex = this.kbfz.indexOf(fzxx);
          const pkjs = this.pkjs.indexOf(item.pkjs);
          const rowIndex = pkjs + (pkzs * this.pkjs.length);
          try {
            zkb[colindex][rowIndex].push(item);
          } catch (e) {
            console.error('周' + pkzs + '行' + colindex) + '列' + rowIndex + e;
          }
        })
        // 处理 单双周  多教师数据
        if (kblx === 'zgh') {
          this.kbfz.forEach((fz, fzindex) => {
            this.zpkjs.forEach((js, jsindex) => {
              let xsmc = '';
              const pkxx = zkb[fzindex][jsindex];
              if (pkxx.length > 0) {
                const onePkxx = pkxx[0];
                if (onePkxx.isdsz !== '0') {
                  const dzpk = [];
                  const szpk = [];
                  pkxx.forEach(itm => {
                    if (itm.isdsz === '1') {
                      dzpk.push(itm);
                    } else if (itm.isdsz === '2') {
                      szpk.push(itm);
                    }
                  })
                  if (dzpk.length > 0 && fz.zgh == dzpk[0].zgh) {
                    xsmc += jcsj.hqbjmcByid(this.bjList, dzpk[0].bjdm) + '<br>';
                    xsmc += jcsj.hqkcmcByid(this.kcList, dzpk[0].kcdm) + '(单)<br>';
                  }
                  if (szpk.length > 0 && fz.zgh == szpk[0].zgh) {
                    xsmc += jcsj.hqbjmcByid(this.bjList, szpk[0].bjdm) + '<br>';
                    xsmc += jcsj.hqkcmcByid(this.kcList, szpk[0].kcdm) + '(双)<br>';
                  }
                } else {
                  let bjmc = '';
                  if (onePkxx.ishb === '1') {
                    const hbbjArr = onePkxx.hbbj.split(',');
                    for (const hbbj of hbbjArr) {
                      const bj = jcsj.hqbjmcByid(this.bjList, hbbj);
                      if (bjmc === '') {
                        bjmc += bj;
                      } else {
                        bjmc = bjmc + '<br>' + bj;
                      }
                    }
                  } else {
                    bjmc = jcsj.hqbjmcByid(this.bjList, onePkxx.bjdm);
                  }
                  const kcmc = jcsj.hqkcmcByid(this.kcList, onePkxx.kcdm);
                  xsmc = bjmc + '<br>' + kcmc;
                }
                fz.skjs++;
                // zkb[jsindex][fzindex] = '';
              }
              zkb[fzindex][jsindex] = xsmc;
            })
          })
        } else if (kblx === 'bjdm') {
          this.kbfz.forEach((fz, fzindex) => {
            this.zpkjs.forEach((js, jsindex) => {
              let xsmc = '';
              const pkjg = zkb[fzindex][jsindex];
              const onePkjg = pkjg[0];
              if (pkjg.length === 0) {
                xsmc = '';
              } else if (pkjg.length === 1) {
                const kcmc = jcsj.hqkcmcByid(this.kcList, onePkjg.kcdm);
                const xm = jcsj.hqjsmcByid(this.jsList, onePkjg.zgh);
                xsmc = (kcmc ? kcmc : '') + '<br>' + (xm ? xm : '');
                if (onePkjg.ishb === '1') {
                  xsmc += '(合)';
                }
              } else if (pkjg.length > 1) {
                if (onePkjg.isdsz !== '0') {
                  const dzpk = [];
                  const szpk = [];
                  pkjg.forEach(itm => {
                    if (itm.isdsz === '1') {
                      dzpk.push(itm);
                    } else if (itm.isdsz === '2') {
                      szpk.push(itm);
                    }
                  })
                  let dzpkmc = '';
                  let dzxm = '';
                  const dzkcmc = jcsj.hqkcmcByid(this.kcList, dzpk[0].kcdm) + '(单)';
                  if (dzpk.length > 0) {
                    dzpk.forEach(jg => {
                      const xm = jcsj.hqjsmcByid(this.jsList, jg.zgh);
                      dzxm += (xm ? xm : '') + ',';
                    })
                    dzpkmc = dzkcmc + dzxm;
                  } else {
                    const xm = jcsj.hqjsmcByid(this.jsList, dzpk[0].zgh);
                    dzxm = xm ? xm : '';
                    dzpkmc = dzkcmc + dzxm;
                  }
                  let szpkmc = '';
                  let szxm = '';
                  const szkcmc = jcsj.hqkcmcByid(this.kcList, szpk[0].kcdm) + '(双)';
                  if (szpk.length > 0) {
                    szpk.forEach(jg => {
                      const xm = jcsj.hqjsmcByid(this.jsList, jg.zgh);
                      szxm += (xm ? xm : '') + ',';
                    })
                    szpkmc = szkcmc + szxm;
                  } else {
                    szxm = jcsj.hqjsmcByid(this.jsList, szpk[0].zgh);
                    szpkmc = szkcmc + szxm;
                  }
                  xsmc = dzpkmc + '<br>' + szpkmc;
                } else {
                  const kcmc = jcsj.hqkcmcByid(this.kcList, onePkjg.kcdm);
                  let xsxm = '';
                  pkjg.forEach(jg => {
                    const xm = jcsj.hqjsmcByid(this.jsList, jg.zgh);
                    xsxm += (xm ? xm : '') + '/';
                  })
                  xsmc = (kcmc ? kcmc : '') + '<br>' + xsxm;
                }
                if (onePkjg.ishb === '1') {
                  xsmc += '(合)';
                }
              }
              zkb[fzindex][jsindex] = xsmc;
              if (xsmc !== '') {
                fz.skjs++;
              }
            })
          })
        }
        this.zkb = zkb;
      },
      // 表头第一列 代码转中文
      clfzxx(kblx) {
        if (kblx === 'zgh') {
          this.kbfz.forEach(fzxx => {
            fzxx.fzmc = jcsj.hqjsmcByid(this.jsList, fzxx[kblx]);
            fzxx.children.forEach(kc => {
              kc.kcmc = jcsj.hqkcmcByid(this.kcList, kc.kcdm);
            })
          })
        } else if (kblx === 'bjdm') {
          this.kbfz.forEach(fzxx => {
            fzxx.fzmc = jcsj.hqbjmcByid(this.bjList, fzxx[kblx]);
          })
        }
      },
      // 导出课表
      exportTable() {
        let njdm = '';
        const njxx = _.find(this.njList, ['njdm', this.dqnj]);
        if (njxx) {
          njdm = njxx.njmc;
        }
        const oHtml = this.$refs.kb_table_ref.outerHTML;
        jcsj.exportTable2Excel(oHtml, njdm + this.kbmc);
      },
      exportTableExcel() {
        exportZjsrkb(this.$route.query.rwid).then(res => {
          const excelBlob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
          const oA = document.createElement('a');
          // 利用URL.createObjectURL()方法为a元素生成blob URL
          oA.href = URL.createObjectURL(excelBlob);
          // 给文件命名
          oA.download = '总任课教师课表.xls';
          document.body.appendChild(oA);
          const evt = document.createEvent('MouseEvents');
          evt.initEvent('click', false, false);
          oA.dispatchEvent(evt);
        }).catch(err => {
          console.log(err)
        })
      },
      // 导入总课表
      importzkb() {
        this.dialog_1 = true;
      },
      // 导入文件移除
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview() {
        // 可以通过 file.response 拿到服务端返回数据
      },
      clearFile() {
        // 清空选择的文件
        this.$refs.upload.clearFiles();
      },
      // 导入前
      beforeUpload(file) {
        // 上传前配置
        const excelfileExtend = '.xls,.xlsx';// 设置文件格式
        const fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (excelfileExtend.indexOf(fileExtend) <= -1) {
          this.$message.error('文件格式错误')
          return false
        }
        this.uploadTip = '正在处理中...'
        this.processing = true
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      // 上传错误
      uploadFail(err, file) {
        const errmessage = JSON.parse(err.message);
        this.$message.error(errmessage.message);
      },
      // 上传成功
      uploadSuccess(response) {
        this.errlist = response.data;
        if (response.data.length > 0) {
          this.dialog_2 = true;
        } else {
          this.$message({
            message: '导入成功了！',
            type: 'success'
          });
          this.getKbtable('zgh');
        }
      },
      xzwj() {
        this.clearFile();
      },
      cancel_dr() {
        this.dialog_1 = false;
        this.dialog_2 = false;
        this.clearFile();
        this.getKbtable('zgh');
      }
    }
  }
</script>
