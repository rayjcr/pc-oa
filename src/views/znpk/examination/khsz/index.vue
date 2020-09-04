<template>
  <div class="khsz">
    <el-row style="margin-bottom: 14px;">
      <el-select v-model="njValue" style="width: 150px"
                 placeholder="请选择年级"
                 clearable
                 @change="loadNjBjsz($event,0)" @clear="clearBjList">
        <el-option
          v-for="item in njOptions"
          :key="item.njdm"
          :label="item.njmc"
          :value="item.njdm">
        </el-option>
      </el-select>
      <el-select v-model="bjValue" style="width: 150px"
                 placeholder="请选择班级"
                 clearable
                 @change="loadNjBjsz($event,1)">
        <el-option
          v-for="item in bjOptions"
          :key="item.bjdm"
          :label="item.bjmc"
          :value="item.bjdm">
        </el-option>
      </el-select>
      <el-select v-model="isck" style="width: 120px"
                 placeholder="是否参考"
                 @change="getKhszList"
                 clearable
      >
        <el-option
          v-for="item in isckArry"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input style="width: 200px" maxlength="20" v-model="search" placeholder="输入姓名;学号;考号查询"  clearable></el-input>
      <el-button type="primary" icon="el-icon-search" @click="getKhszList">搜索</el-button>
      <el-button type="primary" icon="el-icon-time" style="float: right;" @click="handleNumberSetting">考号生成规则设置</el-button>
       <upload-excel-component psMsg="导入免考学生" @on-selected-file='getSetmkExcelData' style="float: right;"></upload-excel-component>
       <upload-excel-component psMsg="导入考号" @on-selected-file='getSetkhExcelData' style="float: right;"></upload-excel-component>
      <!-- <el-button @click="handleDownload" type="primary" icon="el-icon-download" style="float: right;">模板下载</el-button>-->
      <el-dropdown style="float: right;" @command="handleDownload">
        <el-button type="primary">
          模板下载<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in projectOption" :key="item.value" :command="item.value">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
      <el-alert v-if="tableData.length>0"
        style="margin: 4px 0 !important;"
        :title="getMessIfo(tableData[0])"
        type="warning" show-icon>
      </el-alert>
  <el-table v-loading="loading"
    @cell-dblclick="handlEditCode"
    height="550"
    header-cell-class-name="dark-th"
    :data="tableData"
    border
    style="width: 100%;">
    <el-table-column
      prop="njmc"
      label="年级"
      width="180">
    </el-table-column>
    <el-table-column
      prop="bjmc"
      label="班级"
      width="180">
    </el-table-column>
    <el-table-column
      prop="xh"
      label="学号">
    </el-table-column>
    <el-table-column
      prop="xsxm"
      label="学生">
    </el-table-column>
    <el-table-column
      prop="sfck"
      label="状态"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-radio-group v-model="scope.row.sfck" @change="confirmIfck(scope.row)">
          <el-radio :label="0">参考</el-radio>
          <el-radio :label="1">免考</el-radio>
        </el-radio-group>
        <!-- <el-select size="small" v-if="scope.row.xh == tempxh"
                    @change ="setFlag"
                    v-model="scope.row.sfck" placeholder="请选择">
          <el-option
            v-for="item in ifckArry"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-tag v-else :type="scope.row.sfck === 1 ? 'primary' : 'success'"
                disable-transitions>{{scope.row.sfck === 0? '参考':'免考'}}</el-tag>-->
      </template>
    </el-table-column>
    <el-table-column label="考号">
      <template slot-scope="scope">
        <template v-if="scope.row.xh == tempxh">
          <el-input @change = "setFlag" class="edit-input" size="small" v-model="scope.row.kh" maxlength="30"  clearable></el-input>
        </template>
        <span style="width:100px;cursor:pointer" v-else >{{ scope.row.kh }}</span>
      </template>
   </el-table-column>
    <el-table-column align="center" label="操作" width="120">
      <template slot-scope="scope">
        <el-button v-if="tempxh==scope.row.xh" type="success" @click="confirmEdit(scope.row)" size="small" icon="el-icon-circle-check-outline">确定</el-button>
        <el-button v-else type="primary" @click='tempxh = scope.row.xh' size="small" icon="el-icon-edit">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
        <el-col :span="24">
          <!--工具条-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="xsxx.query.page" :page-sizes="[8,12,16,20,24]"
                         :page-size="xsxx.query.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-col>

 <el-dialog title="导入警告信息" :visible.sync="dialogExcelVisible"  width="45%">
    <el-table :data="gridData" border>
      <el-table-column  label="导入成功" width="150">
        <template slot-scope="scope">
          {{ scope.row.success }}条
        </template>
      </el-table-column>
      <el-table-column  label="导入失败" width="150">
        <template slot-scope="scope">
          {{ scope.row.error }}条
        </template>
      </el-table-column>
      <el-table-column  label="导入出错原因">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-download"  size="small" @click="downXsxx">下载模板查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
   <!--自动生成考号-->
  <el-dialog title="考号生成设置" :visible.sync="dialogNumberVisible"  width="35%" center @close="colseDialog">
    <el-form ref="dataForm" :rules="rules" :model="formInline" label-width="80px" >
      <el-form-item label="参考年级" prop="grade">
        <el-select v-model="formInline.grade" style="width: 200px"
                   @change="checkNjsz()" @clear="clearBjList">
          <el-option
            v-for="item in njOptions"
            :key="item.njdm"
            :label="item.njmc"
            :value="item.njdm">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考号前缀" prop="prefis">
        <el-input style="width: 200px" v-model="formInline.prefis" placeholder="请输入考号前缀" clearable></el-input>
      </el-form-item>
      <el-form-item label="考号后缀" required>
        <el-col :span="12">
          <el-form-item prop="theway">
            <el-select style="width: 200px" v-model="formInline.theway" placeholder="请选择后缀生成方式" clearable>
              <el-option
                v-for="item in thewayArry"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="suffix">
            <el-input v-if="formInline.theway==2" style="width: 200px" v-model="formInline.suffix" placeholder="请输入尾号" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitFrom">确认</el-button>
        <el-button @click="colseDialog">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>
考号生成规则
<script>
  import jcsj from '@/api/jcsj'
  import UploadExcelComponent from '@/components/UploadExcel/index'
  import * as api from '@/api/znpk/examination/khsz/index'
  import * as mkapi from '@/api/znpk/examination/mksz/index'
  export default {
    name: 'uploadExcel',
    components: { UploadExcelComponent },
    data() {
      const validaPrefis = (rule, value, callback) => {
        if (/^[0-9]\d*$|^$/.test(value)) {
          callback();
        } else {
          callback(new Error('只能输入数字字符'));
        }
      };
      const validaSuffix = (rule, value, callback) => {
        if (/^[0-9]\d*$|^$/.test(value)) {
          callback();
        } else {
          callback(new Error('只能输入数字字符'));
        }
      };
      return {
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,  // 当前考试代码
        loading: true,
        xsxx: {
          query: {
            page: 1,
            limit: 12
          }
        },
        total: 0,
        isckArry: [{
          value: 0,
          label: '参考'
        }, {
          value: 1,
          label: '免考'
        }],
        isck: null,
        njOptions: [], // 年级list
        njValue: null, // 年级选中
        bjOptions: [], // 班级list
        bjValue: null, // 班级选中
        tableData: [],
        tempxh: null,
        search: null,
        dialogExcelVisible: false,
        gridData: [],
        tempList: [], // 下载导入错误的学生信息
        dialogNumberVisible: false,
        thewayArry: [{ name: '考场号+座位号', value: 1 }, { name: '手动默认编号', value: 2 }],
        formInline: {
          examId: '',
          grade: '',
          prefis: '',
          theway: '',
          suffix: '0001',
          xxdm: ''
        },
        rules: {
          /** 表单验证规则**/
          grade: [{ required: true, message: '请选择年', trigger: 'change' }],
          prefis: [
            { required: true, message: '请输入考号前缀', trigger: 'change' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' },
            { validator: validaPrefis, trigger: 'change' }],
          theway: [{ required: true, message: '请输入考号缀', trigger: 'change' }],
          suffix: [{ required: true, message: '请输入考号后缀' },
            { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' },
            { validator: validaSuffix, trigger: 'change' }]
        },
        ifckArry: [{
          value: 0,
          label: '参考'
        }, {
          value: 1,
          label: '免考'
        }],
        flag: 0,
        projectOption: [
          { name: '考号导入模板', value: 1 },
          { name: '免考导入模板', value: 2 }
        ]
      }
    }, methods: {
      checkNjsz() {
        api.getNumberRule({ examId: this.ksid, grade: this.formInline.grade }).then(res => {
          if (res.data) {
            this.formInline = res.data;
          } else {
            this.formInline = { examId: this.ksid, grade: this.formInline.grade, prefis: '', theway: '', suffix: '0001' }
          }
        })
      },
      setFlag() {
        this.flag = 1;
      },
      colseDialog() {
        this.dialogNumberVisible = false;
      },
      submitFrom() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.$confirm('此操作将重新生成考号规则,排考后将会生效,是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.formInline.examId = this.ksid;
              this.formInline.xxdm = this.xxdm;
              api.saveRule(this.formInline).then(res => {
                if (res.status === 200) {
                  this.$notify({ title: '成功', message: '考号生成规则已完成！', type: 'success', duration: 2000 })
                } else {
                  this.$notify({ title: '失败', message: '操作发生异常，请联系管理员！', type: 'error', duration: 2000 });
                }
              })
            }).catch(() => {

            });
          }
        })
      },
      handleNumberSetting() {
        this.formInline.grade = this.njOptions[0].njdm;
        this.checkNjsz();
        this.dialogNumberVisible = true;
      },
      handlEditCode(row, column, cell) {
        if (cell.cellIndex === 5) {
          this.tempxh = row.xh;
        }
      },
      loadNjBjsz(v, e) { /** @年级班级条件查询处理方法 **/
        /** 年级为空则查询班级 **/
        if (this.njValue != null && this.njValue !== '') {
          if (e === 0) {
            this.bjOptions = [];
            this.bjValue = null;
          }
          this.bjOptions = _.filter(this.bjList, item => item.njdm === this.njValue).map(item => (
          { bjdm: item.uuid, bjmc: item.bj } // 设置班级
          ))
        }
        this.getKhszList();
      },
      clearBjList() {
        this.bjOptions = [];
        this.bjValue = null;
        this.getKhszList();
      },
      getKhszList() { /** @学生考号列表方法 **/
        this.loading = true;
        /** 获取年级**/
        api.getCknj({ ksdxid: this.ksid }).then(res => {
          if (res.length > 0) {
            const $this = this, nj_arry = [];
            res.forEach((njdm, i) => {
              const obj = {};
              obj.njdm = njdm;
              obj.njmc = jcsj.hqnjmcByid($this.njList, njdm);
              nj_arry.push(obj);
            });
            // 初始化默认选中年级
            this.njOptions = nj_arry;
            // 设置自动生成考号的参考年级列表
          }
        })
        this.xsxx.sfck = this.isck;
        this.xsxx.ksid = this.ksid;
        this.xsxx.xxdm = this.xxdm;
        this.xsxx.njdm = this.njValue;
        this.xsxx.bjdm = this.bjValue;
        this.xsxx.xsxm = this.search;
        api.getPageList(this.xsxx).then(response => {
          this.total = response.data.total;
          const list = response.data.rows.map(item => ({
            ckrs: item.ckrs,
            mkrs: item.mkrs,
            njdm: item.njdm,
            njmc: jcsj.hqnjmcByid(this.njList, item.njdm), // 获取年级名称
            bjmc: jcsj.hqbjmcByid(this.bjList, item.bjdm),
            xh: item.xh,
            xsxm: item.xsxm,
            kh: item.kh,
            sfck: item.sfck
          }));
          this.tableData = _.sortBy(list, ['njdm', 'bjmc']);
          this.loading = false;
        })
      },
      getSetkhExcelData(json) { /** @导入Excel数据 **/
        this.$confirm('导入考号后,考号生成规则将被清空,原考号将被替换,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          /** 导入模板验证**/
          if (json.header.length !== 5) {
            this.$alert('excel表头不匹配，请下载正确的模板。', '提示', {
              type: 'warning',
              confirmButtonText: '确定',
              callback: () => false
            });
            return false
          } else {
            const data = json.results;
            if (data.length > 0) {
              const list = data.map(item => ({
                ksid: this.ksid,
                xxdm: this.xxdm,
                xh: item['学号'],
                kh: item['考号'],
                xsmc: item['学生'],
                njmc: item['年级'],
                bjmc: item['班级']
              }))
              this.loading = true;
              api.saveCkxsxx(list).then(res => {
                if (res.status === 200) {
                  if (res.data) {
                    this.tempList = res.data.json;
                    const map = { success: res.data.success, error: res.data.error }
                    this.gridData = [];
                    this.gridData.push(map);
                    this.dialogExcelVisible = true;
                  } else {
                    this.$notify({ title: '成功', message: '导入学生考号成功', type: 'success', duration: 2000 })
                  }
                  this.getKhszList();
                } else {
                  this.$notify({ title: '失败', message: '操作发生异常，请联系管理员！', type: 'error', duration: 2000 });
                }
              })
            } else {
              this.$alert('导入的数据不能为空！', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                callback: () => false
              });
            }
          }
        }).catch(() => {

        });
      },
      getSetmkExcelData(json) {
        /** 导入模板验证**/
        if (json.header.length !== 4) {
          this.$alert('excel表头不匹配，请下载正确的模板。', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: () => false
          });
          return false
        } else {
          const data = json.results;
          if (data.length > 0) {
            const list = data.map(item => ({
              ksid: this.tempksid,
              xxdm: this.xxdm,
              xh: item['学号'],
              xsmc: item['姓名'],
              njmc: item['年级'],
              bjmc: item['班级'],
              sfck: 1
            }))
            mkapi.saveMkszXx(list).then(res => {
              if (res.status === 200) {
                if (res.data) {
                  this.tempList = res.data.json;
                  const map = { success: res.data.success, error: res.data.error }
                  this.gridData = [];
                  this.gridData.push(map);
                  this.dialogExcelVisible = true;
                } else {
                  this.getKhszList();
                  this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
                }
              } else {
                this.$notify({ title: '失败', message: '操作发生异常，请联系管理员！', type: 'error', duration: 2000 });
              }
            })
          } else {
            this.$alert('导入的数据不能为空！', '提示', {
              type: 'warning',
              confirmButtonText: '确定',
              callback: () => false
            });
          }
        }
      },
      handleChange(value) {
        console.log(value);
      }, handleDownload(v) { /** @下载Excel数据 **/
        this.loading = true;
        if (v === 1) {
          api.getCkxsxxList({
            sfck: 0,
            ksid: this.ksid,
            xxdm: this.xxdm,
            njdm: this.njValue,
            bjdm: this.bjValue,
            search: this.search
          }).then(response => {
            const list = response.data.map(item => ({
              njdm: item.njdm,
              njmc: jcsj.hqnjmcByid(this.njList, item.njdm), // 获取年级名称
              bjmc: jcsj.hqbjmcByid(this.bjList, item.bjdm),
              xh: item.xh,
              xsxm: item.xsxm,
              kh: item.kh
            }));
            const arryList = _.sortBy(list, ['njdm', 'bjmc']);
            /** 下载excel**/
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['年级', '班级', '学号', '学生', '考号'];
              const filterVal = ['njmc', 'bjmc', 'xh', 'xsxm', 'kh'];
              const data = this.formatJson(filterVal, arryList)
              excel.export_json_to_excel(tHeader, data, '学生考号录入表格')
            })
            this.loading = false;
          })
        } else {
          /** 下载excel**/
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['年级', '班级', '学号', '学生'];
            const filterVal = ['njdm', 'bjdm', 'xh', 'xsxm'];
            const data = this.formatJson(filterVal, [])
            excel.export_json_to_excel(tHeader, data, '免考学生录入表格')
          })
          this.loading = false;
        }
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      confirmIfck(row) {
        this.flag = 2;
        this.confirmEdit(row);
      },
      confirmEdit(row) { /** 编辑某个学生考号方法 **/
       // 值改变了
        if (this.flag === 1 || this.flag === 2) {
          if (this.flag === 1) {
            const bollean = new RegExp('^[0-9]\\d*$|^$').test(row.kh);
            if (!bollean) {
              this.$message.warning('请输入正整数！');
              return false;
            }
          }
          api.getEditXskh({
            ksid: this.ksid,
            njdm: row.njdm,
            xh: row.xh,
            kh: row.kh ? row.kh : '',
            sfck: row.sfck
          }).then(res => {
            this.flag = 0;
            if (res.status === 200) {
              if (res.data) {
                this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 });
                this.tempxh = null;
              } else {
                this.$notify({ title: '失败', message: '考号已存在，请使用其他考号。', type: 'error', duration: 2000 });
              }
            } else {
              this.$notify({ title: '失败', message: '考号编辑失败', type: 'error', duration: 2000 });
            }
            this.getKhszList();
          })
        } else {
          this.tempxh = null;
        }
      },
      downXsxx() { // 下载错误模板
        /** 下载excel**/
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['年级', '班级', '学号', '学生', '考号', '错误原因'];
          const filterVal = ['njmc', 'bjmc', 'xh', 'xsmc', 'kh', 'mgssage'];
          const data = this.formatJson(filterVal, this.tempList)
          excel.export_json_to_excel(tHeader, data, '学生考号录入异常表格')
        })
      },
      handleSizeChange(val) {
        /** 跳转到某页**/
        this.xsxx.query.limit = val;
        this.getKhszList();
      },
      handleCurrentChange(val) {
        /** 跳转到某页**/
        this.xsxx.query.page = val;
        this.getKhszList();
      },
      getMessIfo(e) {
        const str = '温馨提示，当前参考(' + e.ckrs + ')人,免考(' + e.mkrs + ')人。';
        return str;
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
      }
    }
  }
</script>

<style>
.khsz .dark-th {
  background-color: #f5f7fa;
}
</style>
