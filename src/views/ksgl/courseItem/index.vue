<template>
  <!-- <el-card shadow="never"> -->
    <div class="app-container calendar-list-container">
    <div class="u_TableMain">
      <div class="m_GenTableBox">
  <el-row id="kssz-kskmfx">
    <div ref="left" class="left">
      <div class="title">选择年级</div>
      <el-tree class='pkbjtree tree smallscroll' :accordion="true" :highlight-current="true" :data="treeData" node-key="id" @node-click="handleCheckClick" ref="tree" :current-node-key="currentNjdm">
      </el-tree>
    </div>
    <div ref="right" class="right">
      <el-tabs v-model="tabsChangeValue" type="border-card" @tab-click="courseTabChange" :before-leave="tabsBeforeChange">
        <el-tab-pane
          v-for="(item,index) in classCourseList"
          :key="index">
          <span slot="label"><i class="el-icon-circle-check" v-if="item.isFinish"></i> {{item.eachClass}}</span>
            <el-form label-position="right" label-width="100px" :model="formDate" ref="ruleForm">
              
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
                     @change="handlerChangeDate(0)" 
                     :disabled="isNotEdit"></el-input>
                </div>
              </el-form-item>
              <div class="formbox">
                <div v-for="(item,index) in formDate.rowList" class="clearfix" :key="index">
                  <el-form-item label="分项名称"  style="float:left;margin-right:40px;" :prop="'rowList.' + index + '.fxmc'" :rules="fxmcsz">
                    <el-input clearable v-model.trim="item.fxmc" style="width: 217px;"
                    :disabled="isNotEdit" @change="handlerChangeDate(index)" maxlength="10"></el-input>
                  </el-form-item>
                  <div>
                    <el-form-item label="分项分值" style="float:left;margin-right:40px;" :prop="'rowList.' + index + '.fxfz'" :rules="fxfzsz" >
                      <el-input clearable v-model="item.fxfz" style="width: 217px;" :disabled="isNotEdit" @change="handlerChangeDate(index)" maxlength="3"></el-input>
                    </el-form-item>
                  </div>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="danger" size="mini" style="margin-top:4px" @click="delFx(index)" circle>
                    <i class="el-icon-delete"></i> </el-button>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="新增" placement="top">
                    <el-button size="medium" style="margin-left: 100px;width:217px;" @click="addFx()">
                      <i class="el-icon-plus"></i></el-button>
                  </el-tooltip>
                <!-- <el-button type="danger" size="mini" style="margin-left: 20px" @click="clearFx()">
                  <i class="el-icon-delete"></i> 清空</el-button> -->
              </div>
            </div>
            <el-button type="primary" size="medium" style="margin:40px 0 0 10px" @click="savaFx()">
                  <i class="el-icon-circle-check" ></i> 保存</el-button>
            <el-button type="danger" size="medium" style="margin:40px 0 0 10px" @click="clearFx()">
                  <i class="el-icon-delete" ></i> 清空</el-button>
            </el-form>
          </el-tab-pane>
      </el-tabs>
      
            
          
      
    </div>
  </el-row>
  </div>
    </div>
  </div>
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
import { dqxnxqObj } from '@/api/pkxt/arrangingTask/index';
import { getKcListByNj } from '@/api/project/report/index';
import { getCourseItemList,addCourseItem,deleteCourseItem } from '@/api/ksgl/courseItem/index';
export default {
  data() {
    // 验证科目分项名称
    const validafxmc = (rule, value, callback) => {
      // 筛选同名分项数组
      let rowlist = []
      if(this.valueLeft == 0) {
        rowlist = this.formDate.rowList;
      }else {
        // rowlist = this.formLabelAlignCopy.rowList;
      }
      const repertFxmc = _.filter(rowlist, { fxmc: value });
      if (value.length === 0 && rowlist.length > 1) {
        callback(new Error('分项名称不能为空！'));
      } else if (value.length < 2) {
        callback(new Error('分项名称只能2到10个字符！'));
      }else if (value.length > 10) {
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
      ksid: 'public',
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
      tabsChangeValueOld: null,    // 保存成功的tabs
    };
  },
  created() {
    /** 初始化基础数据**/
    jcsj.remove(jcsj.BJ_KEY);
    jcsj.remove(jcsj.NJ_KEY);
    jcsj.remove(jcsj.KC_KEY);
    jcsj.remove(jcsj.JS_KEY);
    jcsj.remove(jcsj.JSZ_KEY);
    this.xxdm = window.localStorage.getItem('xxdm');
    this.abc();

    
    getKsnj({ ksdxid: this.ksid }).then(res => {
      log(res)
      if (!res) {
        return;
      } else {
        const njmcArr = [];
        // 封装年级数据
        for (const nj of res) {
          const njxx = {};
          const njmc = jcsj.hqnjmcByid(this.njList, nj);
          njxx.njdm = nj;
          njxx.njmc = njmc;
          njmcArr.push(njxx);
        }
        this.njArr = njmcArr;
        // this.loadnjBjData();
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
    async abc() {
      // debugger
      await dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        log(response)
        this.dqxn = response.data.xn;
        this.dqxq = response.data.xq;
      })
      const parm = { xxdm: this.xxdm, xn: this.dqxn }
      /** 获取年级**/
      jcsj.hqnjlb(parm).then(res => {
        this.njList = res;
        if (!res) {
          return;
        } else {
          const njmcArr = [];
          // 封装年级数据
          for (const nj of res) {
            const njxx = {};
            njxx.njdm = nj.njdm;
            njxx.njmc = nj.njmc;
            njmcArr.push(njxx);
          }
          this.njArr = njmcArr;
          log(this.njArr,'nj')

          this.loadnjBjData();
        }
        log(this.njList)
      })
      /** 获取班级**/
      jcsj.hqbjlb(parm).then(res => {
        this.bjList = res;
        
      })
      /** 获取课程**/
      jcsj.hqkclb(parm).then(res => {
        this.kcList = res;
        log(this.kcList,'kcList')
      })
    },
    handleCheckClick(data) {      
      // if(this.$refs.ruleForm){  
      //   this.$refs.ruleForm[0].clearValidate()   // 清除form验证结果
      // }
      log(data,'data')      
      this.formDate.rowList = [{ fxmc: '', fxfz: '' },{ fxmc: '', fxfz: '' }];
      // // 获取考试科目信息
      // const ksidParam = this.ksid;
      // // 获取年级代码
      
      // this.currentKcdm = '';
      // this.currentBjdm = '';
      
      // getKskmxx({ ksdxid: ksidParam, njdm: this.currentNjdm }).then(res => {
      //   log(res,'kskmxx')
      //   getKsClass({ ksid: ksidParam }).then(classList => {
      //     this.loadCourse(res.data.rows, classList);
      //   });
      // });
      this.currentNjdm = data?data.id:undefined;
      this.currentNjmc = jcsj.hqnjmcByid(this.njList, this.currentNjdm);
      getKcListByNj({xxdm: this.xxdm,njdm: this.currentNjdm}).then(res => {
        if(res.status === 200) {
          log(res,'kclistbynj')
          const tmpArr = [];
          // 获取课程信息
          res.data.forEach(item => {
            tmpArr.push({ eachClass: item.kcmc, kcdm: item.uuid });
            // log(eachClass,'eachClass')
          });
          tmpArr.forEach(res => {
            res.courseClass = true;
          });
          this.classCourseList = tmpArr
          this.tabsChangeValue = '0'
          this.courseTabChange()
          log(tmpArr, 'kclist')
        }
        
      })
      setTimeout(() => {
      log(this.$refs['tree'],'njchecked')
      this.$refs.tree.setCurrentKey(this.currentNjdm)

      },500) 
    },
    // 处理课程数据
    // loadCourse(kcList, classList) {
    //   const tmpArr = [];
    //   const classArr = [];
    //   // 获取课程信息
    //   kcList.forEach(item => {
    //     const eachClass = jcsj.hqkcmcByid(this.kcList, item.kcdm);
    //     tmpArr.push({ eachClass, kcdm: item.kcdm });
    //   });
    //   tmpArr.forEach(res => {
    //     res.courseClass = true;
    //     res.isFinish = false;
    //   });
    //   // 获取班级信息
    //   const bjArr = _.filter(classList, { njdm: this.currentNjdm });
    //   classArr.push({ eachClass: '全部班级', bjdm: '' });
    //   bjArr.forEach(item => {
    //     const eachClass = jcsj.hqbjmcByid(this.bjList, item.bjdm);
    //     classArr.push({ eachClass, bjdm: item.bjdm });
    //   });
    //   classArr.forEach(res => {
    //     res.ksClass = true;
    //   });
    //   this.bjArr = classArr;
    //   this.classCourseList = tmpArr;
    // },
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
        log(this.treeData,this.njArr,'tree')
        if(this.treeData){
          this.handleCheckClick(this.treeData[0])
        }
      }
    },
    /**
     * 数据被修改了
     */
    handlerChangeDate(index) {
      let kcInfoList = JSON.parse(sessionStorage.getItem('kcInfoList'))
      log(kcInfoList,'kcinfolist')
      log(index)
      log(kcInfoList[index],'info')
      if(kcInfoList[index].fullScore != this.formDate.fxmfz || kcInfoList[index].subName != this.formDate.rowList[index].fxmc || kcInfoList[index].itemScore != this.formDate.rowList[index].itemScore) {
        this.isFlag = true
        this.$set(this.classCourseList[this.tabsChangeValue],'isFinish',false)
      }else {
        this.isFlag = false
      }
      log(arguments)
    },
    
    // 课程点击事件
    courseTabChange() {
      log('kc点击')
      log(this.$refs.ruleForm)
      if(this.$refs.ruleForm){
        this.$refs.ruleForm[this.tabsChangeValue].clearValidate()    // 清除form验证结果
      }
      if (this.isFlag) {
        return
      }
      this.courseTabChangeContent()
      

    },
    courseTabChangeContent() {
      
      // debugger
      log(this.classCourseList)
      let kcdm = this.classCourseList[this.tabsChangeValue].kcdm
      log(this.tabsChangeValue,this.classCourseList,'arguments')
      if(this.tabsChangeResult){
        log(kcdm,'kcdmAfter')
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
              log( oldActiveName,'old')
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
              // 你可以在这儿做些操作
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
      this.formDate = {
        fxmfz:100,
        rowList: [{ fxmc: '', fxfz: '' },{ fxmc: '', fxfz: '' }]
      }
        
        // // 获取考试科目信息
        //   const ksidParam = this.ksid;
        //  await getKskmxx({ ksdxid: ksidParam, njdm: this.currentNjdm }).then(res => {
        //     log(res,'kc')
        //     this.kcInfoList = res.data.rows
        //     sessionStorage.setItem('kcInfoList',JSON.stringify(res.data.rows))
        //   })
        const kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
        // 处理按钮选中状态
        const newClassCourseList = [];
        const kcInfo = _.find(this.kcInfoList,{'kcdm':kcdm})
        log(this.valueLeft,kcInfo,'kcInfo')
        // this.isNotEdit = kcInfo.sflrwc == 0 ? false:true
        // this.fxvalue = kcInfo.sffx+''
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
          if(res.resultCode === 1) {
            let kmfxList = res.value
            if (kmfxList.length === 0) {
              this.fxvalue = '0';
              // this.valueRight = 1;
              this.formDate.fxmfz = 100;
              this.formDate.rowList = [{ fxmc: '', fxfz: '' },{ fxmc: '', fxfz: '' }];
              sessionStorage.setItem('kcInfoList',JSON.stringify([
                {fullScore: '100',subName: '',itemScore: ''},
                {fullScore: '100',subName: '',itemScore: ''},
              ]))
            } else {
              sessionStorage.setItem('kcInfoList',JSON.stringify(res.value))
              // this.fxvalue = '1';
              this.formDate.fxmfz = kmfxList[0].fullScore
              this.formDate.rowList = []
              kmfxList.forEach(item => {
                let tempObj = {}
                tempObj.fxmc = item.subName
                tempObj.fxfz = item.itemScore
                this.formDate.rowList.push(tempObj)
              })
            }
          }
          
          log(this.$refs.right.offsetHeight,'datagetafter')
        });
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
          // if (lrfs === 2) {
          //   const djlx = parseInt(kmfxList[0].djlx);
          //   this.valueRight = djlx
          // } else {
          //   kmfxList.forEach(item => {
          //     if (!item.fxfz) {
          //       item.fxfz = '';
          //     }
          //     if (!item.mfz) {
          //       this.formDate.fxmfz = 100;
          //     } else {
          //       this.formDate.fxmfz = item.mfz;
          //     }
          //   })
          // }
          // this.formDate.rowList = kmfxList;
        }
      });
    },
    // 增加分项
    addFx() {
      this.isFlag = true
      const subOption = { fxmc: '', fxfz: '' };
      if(this.formDate.rowList.length < 5) {
        this.formDate.rowList.push(subOption);
        let kcInfo = JSON.parse(sessionStorage.getItem('kcInfoList'))
        let obj = {fullScore: '100',subName: '',itemScore: ''}
        kcInfo.push(obj)
        sessionStorage.setItem('kcInfoList',JSON.stringify(kcInfo)) // 验证的缓存数据
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
      deleteCourseItem({examId: this.ksid,gradeId: this.currentNjdm,courseId:this.currentKcdm}).then(res => {
        if(res.resultCode === 1) {
          if(res.value) {
            this.formDate.rowList = [{ fxmc: '', fxfz: '' },{ fxmc: '', fxfz: '' }];
            this.$notify({
              title: '成功',
              message: '清空成功',
              type: 'success',
              duration: 2000
            }); 
          }
        }
      })
    },
    // 保存科目分项
    savaFx(goNext) {
      log(1) 
      // debugger 
      this.isFlag = false
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
          // debugger
          if (valid) {
            // 分项为空不做验证
            if (this.formDate.rowList.length >= 2) {

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
                let outResult = this.saveKmfxData(goNext)
                log(outResult,'out');
                if(outResult){
                  result = true
                }
              }
            } else {
              let outResult = this.saveKmfxData(goNext)
              log(outResult,'out');
              if(outResult){
                result = true
              }
            }

          }
        });
      }
      
      return result
    },
    async saveKmfxData(goNext) {
      let result = false
      // debugger
      if (this.checkBlak(this.currentNjdm)) {
        this.$notify({
          title: '温馨提示',
          message: '请选择年级',
          type: 'warning'
        });
        result = false
      } else if (this.checkBlak(this.currentKcdm)) {
        this.$notify({
          title: '温馨提示',
          message: '请选择课程',
          type: 'warning'
        });
        result = false
      } else {
        const kmfxArr = [];
        let param = {}
        this.formDate.rowList.forEach(item => {
          const kmfx = { xxdm: this.xxdm, examSubjectId : 'public', gradeId: this.currentNjdm, courseId: this.currentKcdm, fullScore: this.formDate.fxmfz,itemScore: item.fxfz,subName: item.fxmc};
          kmfxArr.push(kmfx);
        });
        if(kmfxArr.length > 0) {
          param.isSubOption = 0
        }else {
          param.isSubOption = 1
        }

        param.courseItemList = kmfxArr
        param.courseId = this.currentKcdm
        // param.courseId = this.currentKcmc
        param.entryMethod = 0
        param.examId = this.ksid
        param.fullValue = this.formDate.fxmfz
        param.gradeId = this.currentNjdm
        let successMsg = ' 科目分项保存成功';
        if (this.checkBlak(this.currentBjdm)) {
          successMsg = this.currentNjmc + ' ' + this.currentKcmc + successMsg;
        } else {
          successMsg = this.currentBjmc + ' ' + this.currentKcmc + successMsg;
        }
        // 保存科目分项数据
        await addCourseItem(param).then((res) => {
          // debugger
          log(param);

          if(res.resultCode === 1){
            // debugger
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
              this.$parent.pageNum = 2
              this.$parent.activeName++
              this.$parent.active++
            }
            this.isFlag = false
            result = true
          }else {
            this.$notify({
              title: '保存失败',
              message: res.resultMessage,
              type: 'warning'
            });
            this.isFlag = true
            result = false
          }

        });
      }
      return result
    },
    // 检验对像是否为空
    checkBlak(val) {
      return Object.keys(val).length === 0;
    },
  },
  computed: {
    //
  },
  updated() {
    log(this.$refs.right.offsetHeight,'rightHeight')
    this.$refs.left.style.height = this.$refs.right.offsetHeight + 'px';
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
