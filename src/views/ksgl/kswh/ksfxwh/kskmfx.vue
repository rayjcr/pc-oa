<template>
  <!-- <el-card shadow="never"> -->
  <el-row id="kssz-kskmfx">
    <div v-loading="loading" ref="left" class="left">
      <div class="title">选择年级</div>
      <el-tree v-if="treeData&&treeData.length>0" class='pkbjtree tree smallscroll' :accordion="true" :highlight-current="true" :data="treeData" node-key="id" @node-click="handleCheckClick" ref="tree" :current-node-key="currentNjdm">
      </el-tree>
      <div style="min-height: 60px;text-align: center;" v-else>
        <span style="min-height: 60px;color: #C0C4CC;">暂无数据！</span>
      </div>
    </div>
    <div ref="right" class="right">
      <el-tabs v-loading="loading1" v-model="tabsChangeValue" type="border-card" @tab-click="courseTabChange" :before-leave="tabsBeforeChange">
        <el-tab-pane
          v-for="(item,index) in classCourseList"
          :key="index">
          <span slot="label"><i class="el-icon-circle-check" v-if="item.isFinish"></i> {{item.eachClass}}</span>
            <el-form label-position="right" label-width="100px" :model="formDate" ref="ruleForm">
              <el-form-item label="录入方式" style="margin-right:40px;">
                <el-select v-model="valueLeft"  placeholder="请选择" @change="selectChange" :disabled="isNotEdit">
                  <el-option v-for="item in optionsLeft" :key="item.value" :label="item.label" :value="item.value" >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="科目等级"  v-show="valueLeft == 1">
                <div>
                  <el-select v-model="valueRight"  placeholder="请选择" @change="selectDjChange" :disabled="isNotEdit">
                    <el-option v-for="item in optionsRight" :key="item.levelGroupId" :label="item.levelGroupName" :value="item.levelGroupId">
                    </el-option>
                    <el-option v-if="optionsRight && optionsRight[0].levelGroupId==0" label="去等级设置中添加等级类型" value="9999">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="科目满分值"
                            v-show="valueLeft == 0"
                            prop="fxmfz"
                            :rules="[
                              {required:true, message: '科目满分值不能为空！', trigger: 'blur'},
                              {type:'number', message: '请输入数字类型！', trigger: 'blur'}
                            ]">
                <div>
                  <el-input
                     v-model.number="formDate.fxmfz"
                      label=""
                     style="width: 217px;"
                     maxlength="3"
                     @change="handlerChangeDate"
                     :disabled="isNotEdit"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="是否启用分项">
                <el-switch v-model="fxvalue"
                          active-value="1"
                          inactive-value="0"
                          @change="handlerChangeDate"
                          :disabled="isNotEdit"></el-switch>
              </el-form-item>
              <div class="formbox" v-if="fxvalue == 1">
                <div v-for="(item,index) in formDate.rowList" class="clearfix" :key="index">
                  <el-form-item label="分项名称"  style="float:left;margin-right:40px;" :prop="'rowList.' + index + '.fxmc'" :rules="fxmcsz">
                    <el-input clearable
                    v-model.trim="item.fxmc"
                    style="width: 217px;"
                    :disabled="isNotEdit"
                    @change="isFlag = true"
                    maxlength="10"></el-input>
                  </el-form-item>
                  <div v-if="valueLeft == 0 ">
                    <el-form-item label="分项分值" style="float:left;margin-right:40px;" :prop="'rowList.' + index + '.fxfz'" :rules="fxfzsz" >
                      <el-input clearable v-model="item.fxfz" style="width: 217px;" :disabled="isNotEdit" @change="isFlag = true" maxlength="3"></el-input>
                    </el-form-item>
                  </div>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="danger" size="mini" style="margin-top:4px" @click="delFx(index)" circle :disabled="isNotEdit">
                    <i class="el-icon-delete"></i> </el-button>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="新增" placement="top">
                <el-button size="medium" style="margin-left: 100px;width:217px;" @click="addFx()" :disabled="isNotEdit">
                  <i class="el-icon-plus"></i></el-button>
                  </el-tooltip>
                <!-- <el-button type="danger" size="mini" style="margin-left: 20px" @click="clearFx()">
                  <i class="el-icon-delete"></i> 清空</el-button> -->
              </div>
            </div>
            <el-button type="primary" size="medium" style="margin:40px 0 0 10px" @click="savaFx()" :disabled="isNotEdit" plain>
                  <i class="el-icon-circle-check" ></i> 保存</el-button>
            </el-form>
          </el-tab-pane>
      </el-tabs>




    </div>
  </el-row>
  <!-- </el-card> -->
</template>
<script>
import {
  getKsnj,
  getKskmxx,
  getKsClass,
  getKskmfx,
  saveKmfx,
  clearKmfx,
  getGradeByExamId
} from '@/api/ksgl/kswh/kmfx/index';
import jcsj from '@/api/jcsj.js';
import { getScoreLevelList } from '@/api/ksgl/djsz/index';
import { getCourseItemList,addCourseItem } from '@/api/ksgl/courseItem/index';
export default {
  data() {
    // 验证科目分项名称
    const validafxmc = (rule, value, callback) => {
      // 筛选同名分项数组
      let rowlist = []
      rowlist = this.formDate.rowList;
      const repertFxmc = _.filter(rowlist, { fxmc: value });
      if (value.length === 0 && rowlist.length > 1) {
        callback(new Error('分项名称不能为空！'));
      } else if (value.length < 2) {
        callback(new Error('分项名称只能2到10个字符！'));
      } else if (value.length > 10) {
        callback(new Error('分项名称只能2到10个字符！'));
      } else if (repertFxmc.length > 1) {
        callback(new Error('分项名称不能重复'));
      } else {
        callback();
      }
    };
    // 验证科目分项分值
    const validafxfz = (rule, value, callback) => {
      let rowlist = []
      // if(this.valueLeft == 0) {
        rowlist = this.formDate.rowList;
      // }else {
      //   rowlist = this.formLabelAlignCopy.rowList;
      // }
      const g = /^[1-9]*[1-9][0-9]*$/;
      const flag = g.test(value);
      // if (this.valueLeft === 1) {
        if (value.length === 0 && rowlist.length > 1) {
          callback(new Error('分项分值不能为空！'));
        } else if (!flag && rowlist.length > 1) {
          callback(new Error('分项分值只能是正整数！！'));
        } else if (parseInt(value) > parseInt(this.formDate.fxmfz)) {
          callback(new Error('分项分值不能大于科目满分值 ！'));
        } else {
          callback();
        }
      // }
    };
    return {
      loading: true,
      loading1: true,
      ksid: this.$route.query.ksid,
      xxdm: window.localStorage.getItem('xxdm'),
      formDate: {
        fxmfz:100,
        rowList: [{ fxmc: '', fxfz: '' },{ fxmc: '', fxfz: '' }]
      },
      courseClass: [],
      ksClass: [],
      njArr: [], // 年级数组
      bjArr: [], // 班级数据
      classCourseList: [{isFinish:false}], // 班级课程数据数组
      treeData: [], // 年级树
      currentNjmc: '', // 当前年级名称
      currentNjdm: '', // 当前年级代码
      currentBjdm: '', // 当前班级代码
      currentBjmc: '', // 当前班级名称
      currentKcdm: '', // 当前课程代码
      currentKcmc: '', // 当前课程名称
      allStuNum: 0, // 考试学生总人数
      tjArr: [], // 统计分项数组
      // 录入方式
      optionsLeft: [
        {
          value: 0,
          label: '按分数录入'
        },
        {
          value: 1,
          label: '按等级录入'
        }
      ],
      valueLeft: 0,  // 0--按分数 1--按等级
      optionsRight: [
        {
          levelGroupId: 0,
          levelGroupName : '暂无等级数据'
        }
      ],
      valueRight: 0,
      // 分项数组
      fxmcsz: [
        { validator: validafxmc, trigger: 'blur' }
      ],
      fxfzsz: [
        {validator: validafxfz, trigger: 'blur' }
      ],
      alertInfo: '分项满分之和需等于科目满分值',
      djlxObj: {},            // 选中的等级类型对象
      fxvalue: '0',           // 是否启用分项录入
      isFlag: false,
      kcInfoList: [],           // 课程具体信息
      lrfs: 0,                  // 录入方式
      isNotEdit: false,             // 是否不能修改
      selectDjCode: '',           // 选择的科目等级类型
      currentNodekey: '',          // 当前选中的年级节点
      tabsChangeValue: '',         // 标签页切换值
      tabsChangeResult: true,      // 标签是否可以切换
      isFirstEnter: true,          // 首次进入
      isFirstEnterCheckedCourse: true,          // 首次进入
      tabsChangeValueOld: null,    // 保存成功的tabs
    };
  },
  created() {
    getGradeByExamId({ examId: this.ksid }).then(res => {
      if (!res) {
        return;
      } else {
        const njmcArr = [];
        // 封装年级数据
        res.value.forEach(nj => {
          log(nj,'nj')
          const njxx = {};
          const njmc = jcsj.hqnjmcByid(this.njList, nj.gradeId);
          njxx.njdm = nj.gradeId;
          njxx.njmc = njmc;
          njmcArr.push(njxx);
        })
        this.njArr = njmcArr;
        log(this.njArr,'njarr')
        this.loadnjBjData();

      }
    });
  },
  mounted() {
    log(this.treeData[0])

  },
  watch: {
    // fxmfz: function (newVal,oldVal) {

    //   log(newVal,oldVal)
    // }
  },
  methods: {
    handleCheckClick(data) {
      if(this.$refs.ruleForm){
        this.$refs.ruleForm[0].clearValidate()    // 清除form验证结果
      }
       // 获取考试科目信息
      const ksidParam = this.ksid;
      // 获取年级代码
      this.currentNjdm = data.id;
      this.currentKcdm = '';
      this.currentBjdm = '';
      this.currentNjmc = jcsj.hqnjmcByid(this.njList, this.currentNjdm);
      getKskmxx({ ksdxid: ksidParam, njdm: this.currentNjdm }).then(res => {
        log(res,'kc')
        this.kcInfoList = res.data.rows
        sessionStorage.setItem('kcInfoList',JSON.stringify(res.data.rows))
        getKsClass({ ksid: ksidParam }).then(classList => {
          log(classList,'kc')
          this.loadCourse(res.data.rows, classList);
          this.tabsChangeValue = '0'
          this.courseTabChange()
        });
      });
      setTimeout(() => {
      log(this.$refs['tree'],'njchecked')
      this.$refs.tree.setCurrentKey(data.id)

      },500)
    },
    // 处理课程数据
    loadCourse(kcList, classList) {
      const tmpArr = [];
      const classArr = [];
      // 获取课程信息
      kcList.forEach(item => {
        const eachClass = jcsj.hqkcmcByid(this.kcList, item.kcdm);
        if(item.sffx == 1) {
          tmpArr.push({ eachClass, kcdm: item.kcdm,isFinish: true });
        }else {
          tmpArr.push({ eachClass, kcdm: item.kcdm,isFinish: false  });
        }
        
      });
      tmpArr.forEach(res => {
        res.courseClass = true;
      });
      // 获取班级信息
      const bjArr = _.filter(classList, { njdm: this.currentNjdm });
      classArr.push({ eachClass: '全部班级', bjdm: '' });
      bjArr.forEach(item => {
        const eachClass = jcsj.hqbjmcByid(this.bjList, item.bjdm);
        classArr.push({ eachClass, bjdm: item.bjdm });
      });
      classArr.forEach(res => {
        res.ksClass = true;
      });
      this.bjArr = classArr;
      this.classCourseList = tmpArr;
      this.loading1 = false
    },
    // 拼装年级班级树形结构
    loadnjBjData() {
      if (this.treeData.length === 0) {
        this.treeData = [];
        for (let j = 0; j < this.njArr.length; j++) {
          const njdata = this.njArr[j];
          const njmap = {};
          njmap.label = njdata.njmc;
          njmap.id = njdata.njdm;
          njmap.disabled = true;
          this.treeData.push(njmap);
        }
        log(this.treeData,'tree')
        this.handleCheckClick(this.treeData[0])
        this.loading = false
      }
    },
    handlerChangeDate() {
      if(this.fxvalue == 1) {
        this.$set(this.classCourseList[this.tabsChangeValue],'isFinish',true)
      }else {
        this.$set(this.classCourseList[this.tabsChangeValue],'isFinish',false)
        this.tabsChangeResult = true
      }
      let kcInfoList = JSON.parse(sessionStorage.getItem('kcInfoList'))
      if(kcInfoList[this.tabsChangeValue].mfz != this.formDate.fxmfz || kcInfoList[this.tabsChangeValue].sffx != this.fxvalue) {  // 数据是否等于缓存中的数据，是否改变
        this.isFlag = true
       
      }else {
        this.isFlag = false
      }
      log(arguments)
    },

    // 课程点击事件
    courseTabChange() {
      log('kc点击')
      if (this.isFlag) {
        return
      }
      this.courseTabChangeContent()


    },
    courseTabChangeContent() {
      // debugger
      let kcdm = this.classCourseList[this.tabsChangeValue].kcdm
      log(this.tabsChangeValue,this.classCourseList,'arguments')
      log(kcdm,'kcdmAfter')
      if(this.tabsChangeResult){
        log(111111111111)
        this.getCourseItemInfo(kcdm)
        return
      }
      if(this.isFirstEnter) {
        this.getCourseItemInfo(kcdm)

      }
    },
    /**
     * tabs切换之前
     */
    tabsBeforeChange(activeName, oldActiveName) {
      log('切换前')
      if(this.$refs.ruleForm){
        this.$refs.ruleForm[0].clearValidate()
      }
      if(this.isFirstEnter) {
        this.isFirstEnter = false
      } else {
        var p = new Promise((resolve, reject) => {
          // this.tabsChangeResult = false
          if (this.isFlag) {
            this.$confirm('数据被改变了,是否保存？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              // debugger
              this.tabsChangeResult = this.savaFx()
              log( this.tabsChangeResult,'result')
              if(this.tabsChangeResult) {
                // this.getCourseItemInfo(kcdm)
                this.tabsChangeValue = activeName
                this.tabsChangeValueOld = oldActiveName
                log(this.tabsChangeValue,'tagName')

                this.isFlag = false
                this.courseTabChangeContent()
                resolve()
              }else {
                this.tabsChangeValue = oldActiveName
                this.tabsChangeValueOld = oldActiveName
                log(this.tabsChangeValue,'tagName')
                this.isFlag = true
                this.courseTabChangeContent()
                reject()
              }
            }).catch(err => {
              // console.log(err)
              // 你可以在这儿做些操作
              this.$set(this.classCourseList[this.tabsChangeValue],'isFinish',false)
              this.isFlag = false
              this.tabsChangeValue = activeName
              this.tabsChangeResult = true
              this.courseTabChangeContent()
              resolve()
            })

          } else {
            this.tabsChangeValue = activeName
            resolve()
          }
        })
        return p
      }

    },
    async getCourseItemInfo(kcdm){
      log(kcdm,'kcdm')
      this.formDate = {
        fxmfz:100,
        rowList: [{ fxmc: '', fxfz: '' },{ fxmc: '', fxfz: '' }]
      }

      if(!this.isFirstEnterCheckedCourse){
        // 获取考试科目信息
        const ksidParam = this.ksid;
        await getKskmxx({ ksdxid: ksidParam, njdm: this.currentNjdm }).then(res => {
          log(res,'kc')
          this.kcInfoList = res.data.rows
          
          sessionStorage.setItem('kcInfoList',JSON.stringify(res.data.rows))
        })
      }
      this.isFirstEnterCheckedCourse = false
        const kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
        // 处理按钮选中状态
        const newClassCourseList = [];
        const kcInfo = _.find(this.kcInfoList,{'kcdm':kcdm})
        this.valueLeft = kcInfo.lrfs
        
        log(this.valueLeft,kcInfo,'kcInfo')
        this.isNotEdit = kcInfo.sflrwc == 0 ? false:true
        this.fxvalue = kcInfo.sffx+''
        for (const kcclass of this.classCourseList) {
          if (kcdm === kcclass.kcdm) {
            kcclass.courseClass = false;
          } else {
            kcclass.courseClass = true;
          }
          newClassCourseList.push(kcclass);
        }
        this.classCourseList = newClassCourseList;
        this.currentKcdm = kcdm;
        this.currentKcmc = kcmc;
        getCourseItemList({ examId: this.ksid, gradeId: this.currentNjdm, courseId: kcdm }).then(res => {   // 获取课程分项信息
          let kmfxList = res.value
          if (kmfxList.length === 0) {
            this.fxvalue = '0';
            // this.valueRight = 1;
            // this.formDate.fxmfz = 100;
            this.formDate.rowList = [{ fxmc: '', fxfz: '' },{ fxmc: '', fxfz: '' }];
          } else {
            // this.fxvalue = '1';
            // this.formDate.fxmfz = kmfxList[0].fullScore
            this.formDate.rowList = []
            kmfxList.forEach(item => {
              let tempObj = {}
              tempObj.fxmc = item.subName
              tempObj.fxfz = item.itemScore
              this.formDate.rowList.push(tempObj)
            })

          }
          this.formDate.fxmfz = kcInfo.mfz ? parseInt(kcInfo.mfz): 100  // 获取满分值
        });
        
        //获取等级
        if(this.valueLeft == 1) {
          getScoreLevelList().then(res => {
            if(res.resultCode === 1) {
              this.valueRight = kcInfo.mfz
              this.optionsRight = res.value
              this.alertInfo = '科目等级可以在等级设置中添加或修改'
              // this.alertInfo +=
            }
          })
        }
    },

    // 班级点击事件
    classTabChange(bjdm) {
      const bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
      // 处理按钮选中状态
      const newClassList = [];
      for (const ksClass of this.bjArr) {
        if (bjdm === ksClass.bjdm) {
          ksClass.ksClass = false;
        } else {
          ksClass.ksClass = true;
        }
        newClassList.push(ksClass);
      }
      this.bjArr = newClassList;
      this.currentBjdm = bjdm;
      this.currentBjmc = bjmc;
      getKskmfx({ ksid: this.ksid, njdm: this.currentNjdm, kmdm: this.currentKcdm, bjdm: this.currentBjdm }).then(kmfxList => {
        if (kmfxList.length === 0) {
          this.valueLeft = 0;
          this.valueRight = 1;
          this.formDate.fxmfz = 100;
          this.formDate.rowList = [{ fxmc: '', fxfz: '' },{ fxmc: '', fxfz: '' }];
        } else {
          const lrfs = kmfxList[0].lrfs;
          this.valueLeft = parseInt(lrfs);
          if (lrfs === 2) {
            const djlx = parseInt(kmfxList[0].djlx);
            this.valueRight = djlx
          } else {
            kmfxList.forEach(item => {
              if (!item.fxfz) {
                item.fxfz = '';
              }
              if (!item.mfz) {
                this.formDate.fxmfz = 100;
              } else {
                this.formDate.fxmfz = parseInt(item.mfz);
              }
            })
          }
          this.formDate.rowList = kmfxList;
        }
      });
    },
    // 增加分项
    addFx() {
      this.isFlag = true
      const subOption = { fxmc: '', fxfz: '' };
      if(this.formDate.rowList.length < 5) {
        this.formDate.rowList.push(subOption);
      }else {
        this.$notify({
          title: '新增失败',
          message: '分项至多5项',
          type: 'error'
        });
      }

    },
    // 删除分项
    delFx(index) {
      this.isFlag = true
      if(this.formDate.rowList.length >2) { // 分项至少2项
        this.formDate.rowList.splice(index, 1);
      }else {
        this.$notify({
          title: '删除失败',
          message: '分项至少需要2项',
          type: 'error'
        });
      }
    },
    // 清空所有分项
    clearFx() {
      if(this.valueLeft == 0){
        this.formDate.rowList = [{ fxmc: '', fxfz: '' },{ fxmc: '', fxfz: '' }];
        clearKmfx({ ksid: this.ksid, njdm: this.currentNjdm, kmdm: this.currentKcdm, bjdm: this.currentBjdm }).then(() => {
            //
        });
      }else {
        this.formLabelAlignCopy.rowList = [{ fxmc: '', fxfz: '' },{ fxmc: '', fxfz: '' }];
      }
    },
    // 保存科目分项
    savaFx(goNext) {
      
      log(1)
      // debugger
      
      let result = false
      if(this.formDate.rowList.length === 1) {
        this.$notify({
          title: '保存失败',
          message: '分项至少需要2项',
          type: 'error'
        });
      }

      // 分数输入
      if (this.valueLeft === 0) {

        this.$refs.ruleForm[this.tabsChangeValue].validate(valid => {
          if (valid) {
            // 分项为空不做验证
            if (this.fxvalue == 1) {

              let sumFxfz = 0;
              this.formDate.rowList.forEach(item => {
                sumFxfz = sumFxfz + parseInt(item.fxfz);
              });
              if (sumFxfz !== this.formDate.fxmfz) {
                this.$notify({
                  title: '保存失败',
                  message: '分项满分之和需等于科目满分值',
                  type: 'error'
                });
              } else {
                this.saveKmfxData(goNext);
                result = true
                this.isFlag = false
              }
            } else {
              this.saveKmfxData(goNext);
              result = true
              this.isFlag = false
            }

          }else {
            this.$notify({
              title: '保存失败',
              message: '验证未通过',
              type: 'error'
            });
          }
        });
      } else {

        if(!this.valueRight) {
          this.$notify({
            title: '保存失败',
            message: '请选择等级类型',
            type: 'error'
          });
        }else {
          this.$refs.ruleForm[this.tabsChangeValue].validate(valid => {
            if (valid) {
              this.saveKmfxData(goNext);
              result = true
              this.isFlag = false
            }
          })
        }

      }

      return result
    },
    saveKmfxData(goNext) {
      // debugger
      if (this.checkBlak(this.currentNjdm)) {
        this.$notify({
          title: '温馨提示',
          message: '请选择年级',
          type: 'warning'
        });
        return;
      } else if (this.checkBlak(this.currentKcdm)) {
        this.$notify({
          title: '温馨提示',
          message: '请选择课程',
          type: 'warning'
        });
        return;
      } else {
        const kmfxArr = [];
        let param = {

        }
        if(this.fxvalue == 1) { // 使用分项录入
          if(this.valueLeft == 0){ // 分数录入
            this.formDate.rowList.forEach(item => {
              const kmfx = { xxdm: this.xxdm, examSubjectId: this.ksid, gradeId: this.currentNjdm, courseId: this.currentKcdm};
              if (this.currentBjdm) {
                kmfx.bjdm = this.currentBjdm;
              }
              kmfx.fullScore = this.formDate.fxmfz
              kmfx.itemScore = item.fxfz
              kmfx.subName = item.fxmc
              log(kmfx,'kmfx');
              kmfxArr.push(kmfx);
              param.level = {}
            });
          }else if(this.valueLeft == 1){ // 等级录入
            this.formDate.rowList.forEach(item => {
              const kmfx = { xxdm: this.xxdm, examSubjectId: this.ksid, gradeId: this.currentNjdm, courseId: this.currentKcdm};
              if (this.currentBjdm) {
                kmfx.bjdm = this.currentBjdm;
              }
              kmfx.fullScore = this.formDate.fxmfz
              kmfx.itemScore = item.fxfz
              kmfx.subName = item.fxmc
              log(kmfx,'kmfx');
              kmfxArr.push(kmfx);
              param.level = this.djlxObj
            });
          }
        }else {
          // kmfxArr
        }

        param.courseItemList = kmfxArr
        param.courseId = this.currentKcdm
        // param.courseId = this.currentKcmc
        param.entryMethod = this.valueLeft
        param.examId = this.ksid
        param.fullValue = this.valueLeft==0?this.formDate.fxmfz:undefined;
        param.gradeId = this.currentNjdm
        param.isSubOption = this.fxvalue
        param.levelGroupId = this.valueLeft==1?this.valueRight:undefined;
        let successMsg = ' 科目分项保存成功';
        if (this.checkBlak(this.currentBjdm)) {
          successMsg = this.currentNjmc + ' ' + this.currentKcmc + successMsg;
        } else {
          successMsg = this.currentBjmc + ' ' + this.currentKcmc + successMsg;
        }
        // 保存科目分项数据
        addCourseItem(param).then((res) => {
          // debugger
          log(param);

          if(res.resultCode === 1){
            this.$notify({
              title: '保存成功',
              message: successMsg,
              type: 'success',
              duration: 2000
            });
            log(this.classCourseList,'kcinfo')
            log(this.tabsChangeValueOld,'tabsChangeValueOld')
            // this.$set(this.classCourseList[this.tabsChangeValueOld],'isFinish',true)

            // this.$emit('isnext',true)
            if(goNext){
              this.isFlag = false
              this.$parent.pageNum = 2
              this.$parent.activeName++
              this.$parent.active++
              return true
            }
          }else {
            this.$notify({
              title: '保存失败',
              message: res.resultMessage,
              type: 'warning'
            });
            this.isFlag = true
            return false
          }

        });
      }
    },
    // 检验对像是否为空
    checkBlak(val) {
      return Object.keys(val).length === 0;
    },
    /**
     * 切换等级类型
     */
    selectDjChange(val) {
      if(val == 9999) {
        // this.$router.push({path: 'ksglManager/djsz'})
        return
      }
      // this.$set(this.classCourseList[this.tabsChangeValue],'isFinish',false)
      this.isFlag = true
      log('选择了' +val)
      this.selectDjCode = val
      this.alertInfo = '科目等级可以在等级设置中添加或修改，等级：'
      this.djlxObj = _.find(this.optionsRight,{levelGroupId:val}) // 获取选择的对象
      let strDj = []
      this.djlxObj.scoreLevelList.forEach(item => { // 获取所有等级子类
        strDj.push(item.levelName)
      })
      this.alertInfo += strDj.join('，')
    },
    /**
     * 切换录入方式
     */
    selectChange() {
      this.isFlag = true
      if(this.valueLeft == 1) {
        getScoreLevelList().then(res => {
          if(res.resultCode === 1) {
            this.valueRight = ''
            this.optionsRight = res.value
            this.alertInfo = '科目等级可以在等级设置中添加或修改'
            // this.alertInfo +=
          }
        })
        log('选择了等级')
      }else {
      }
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
    }
  },
  computed: {
    //
  },
  updated() {
    this.$refs.left.style.height = this.$refs.right.offsetHeight + 'px';
    log(this.fxvalue,'fxvalue')
    // if(this.fxvalue == 1) {
    //   this.$set(this.classCourseList[this.tabsChangeValue],'isFinish',true)
    // }else {
    //   this.$set(this.classCourseList[this.tabsChangeValue],'isFinish',false)
    // }
  }
};
</script>

<style lang="">

.el-tree-node.is-current > .el-tree-node__content {
  background-color: #c2d6ea !important;
}
.el-tabs--border-card{
  box-shadow: none
}
</style>
<style lang="scss" scoped>
.left {
  width: 200px;
  border: 1px solid #eaedf4;
  border-radius: 2px;
  float: left;
}
.right {
  margin-left: 210px;
}
.title {
  background: #f5f7fa;
  border-bottom: 1px solid #eaedf4;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #333;
  text-indent: 20px;
}
.circle-title {
  height: 41px;
  line-height: 41px;
  border: 1px solid #eaedf4;
  border-radius: 2px;
}
.tree {
  // height: 600px;
  // overflow: auto;
}
.formbox {
  position: relative;
  .tip {
    position: absolute;
    right: -19px;
    top: -19px;
    padding: 0px 20px;
    height: 30px;
    line-height: 30px;
    border-bottom-left-radius: 14px;
    background-color: #fdf6ec;
    color: #e6a23c;
    // border: 1px solid #E6A23C;
  }
}
</style>
