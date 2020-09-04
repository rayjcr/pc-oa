<template>
  <div>
    <el-drawer
      title="请选择科目信息"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleCloseDrawer" style="overflow:auto;">
      <div class="demo-drawer__content">
        <el-form label-width="10px">
          <el-form-item>
            <div>
              <div v-if="list.length > 0">
                <el-collapse style="padding: 3px 0px 0px 15px;" v-model="activeNames" accordion @change="handleChange">
                  <el-collapse-item v-for="(item,index) in list" :key="item.njdm" :title="item.njmc" :name="item.njdm">
                    <template>
                      <div style="margin-bottom: 10px">
                        <el-card shadow="hover">
                        <el-checkbox :indeterminate="item.isIndeterminateKc" v-model="item.checkKcAll"
                                     @change="handleCheckAllChangeKc(index,$event)">全部课程
                        </el-checkbox>
                        <el-checkbox-group v-model="item.checkedKcCities"
                                           @change="handleCheckedCitiesChangeKc(index,$event)">
                          <el-checkbox v-for="city in item.kcArry" :label="city.kcdm" :key="city.kcdm">{{city.kcmc}}
                          </el-checkbox>
                        </el-checkbox-group>
                        </el-card>
                      </div>
                      <div>
                        <el-card shadow="hover">
                        <el-checkbox :indeterminate="item.isIndeterminateBj" v-model="item.checkBjAll"
                                     @change="handleCheckAllChangeBj(index,$event)">全部班级
                        </el-checkbox>
                        <el-checkbox-group v-model="item.checkedBjCities"
                                           @change="handleCheckedCitiesChangeBj(index,$event)">
                          <el-checkbox v-for="city in item.bjArry" :label="city.uuid" :key="city.uuid">{{city.bj}}
                          </el-checkbox>
                        </el-checkbox-group>
                        </el-card>
                      </div>
                    </template>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-else>
                <span style="text-align: center;color: #bbbbb6;">请设置数据</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addExamSubject">确认</el-button>
            <el-button @click="drawer = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-row :gutter="20">
      <el-col>
        <div class="grid-content">
          <!-- <el-card v-loading="loading" class="box-card" stype="height: 100%">
             <div slot="header" class="clearfix">
               <span style="font-size: 16px;">已参考科目信息</span>
               <el-button size="small" type="primary"
                          @click="addDrawer" style="float: right;" plain>
                 <i class="el-icon-plus el-icon&#45;&#45;left"></i>
                 添加参考科目</el-button>
             </div>-->
          <el-button size="small" type="primary"
                     style="margin-bottom: 8px;"
                     icon="el-icon-plus"
                     @click.native="addDrawer" >
            添加参考科目
          </el-button>
          <div v-loading="loading" class="examlistMain">
            <div v-if="checkExamSubjectList&&checkExamSubjectList.length>0">
              <el-collapse style="padding: 3px 0px 0px 15px;" v-model="active" accordion>
                <el-collapse-item v-for="(item,index) in checkExamSubjectList" :key="index"
                                  :name="index.toString()">
                  <template slot="title">
                    {{item.njmc}}&nbsp;&nbsp;&nbsp;
                  <span>
                      <el-tag
                        effect="plain"
                        v-for="(tag,o) in item.classCourseList"
                        :key="o"
                        @close="handleCourseBatchDelete(item.classCourseList,item.bjList,tag,index,o)"
                        closable>
                      {{tag.kcmc}}
                     </el-tag>
                    </span>
                  </template>
                  <!-- 智能排考 -->
                  <template>
                    <el-card shadow="always" style="width: 32%;float: left;margin-left: 15px;" class="box-card"
                             :key="a"
                             v-for="(e,a) in item.bjList">
                      <div slot="header" class="clearfix" style="height: 10px;line-height: 10px;">
                        <span>{{e.bjmc}}</span>
                        <el-button @click="handleDelete(index,e,a)" style="float: right; padding: 3px 0" type="text"><i class="el-icon-circle-close"></i></el-button>
                      </div>
                      <div class="text item" style="height: 100px;">
                        <el-tag
                          style="margin-left: 10px;"
                          :key="j"
                          v-for="(tag,j) in e.children"
                          closable
                          :type="tag.sflrwc!==0?'danger':'success'"
                          :disable-transitions="false"
                          @close="handleClose(tag,index,a)">
                          {{tag.kcmc}}
                        </el-tag>
                      </div>
                    </el-card>
                    <!--<el-timeline>
                      <el-timeline-item
                        :key="a"
                        v-for="(e,a) in item.bjList"
                        :timestamp="e.bjmc" placement="top">
                        <el-card>
                          <el-tag
                            style="margin-left: 10px;"
                            :key="j"
                            v-for="(tag,j) in e.children"
                            closable
                            :type="tag.sflrwc!==0?'danger':'success'"
                            :disable-transitions="false"
                            @close="handleClose(tag,index,a)">
                            {{tag.kcmc}}
                          </el-tag>
                        </el-card>
                      </el-timeline-item>
                    </el-timeline>-->
                  </template>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div style="min-height: 60px;text-align: center;" v-else>
              <el-card shadow="never">
                <span style="min-height: 60px;color: #C0C4CC;">暂无数据，点击上方添加按钮添加参考科目吧！</span>
              </el-card>
            </div>
          </div>
          <!--  </el-card>-->
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import * as api from '@/api/ksgl/kswh/kssz/index';
  import jcsj from '@/api/jcsj';

  const cityOptions = ['上海', '北京', '广州', '深圳'];
  export default {
    data() {
      return {
        tags: [
          { name: '标签一' },
          { name: '标签二' },
          { name: '标签三' },
          { name: '标签四' },
          { name: '标签五' }
        ],
        loading: true,
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,
        dqxn: this.$route.query.dqxn,
        pkfs: this.$route.query.pkfs,
        checkboxGroup5: [],
        activeNames: [],
        list: [],
        checkedCities1: ['上海', '北京'],
        cities: cityOptions,
        njkcgxList: [],
        value3: true,
        njList: [],
        isFlag: false,
        checkExamSubjectList: [],
        active: ['0'],
        drawer: false
      }
    },
    created() {
      this.initKsszMian();
    },
    methods: {
      addDrawer() {
        this.drawer = true
      },
      handleCloseDrawer() {
        this.drawer = false
      },
      async initKsszMian() {
        /** 获取年级关系 **/
        await api.getNjgxList({ xxdm: this.xxdm }).then(response => {
          this.njkcgxList = response;
        })
        /** 获取年级**/
        const parm = { xxdm: this.xxdm, xn: this.dqxn }
        jcsj.hqnjlb(parm).then(res => {
          this.njList = res;
          /** 获取考试科目信息数据 **/
          api.getKskmxxList({ ksdxid: this.ksid, xxdm: this.xxdm }).then(res => {
            const arry = [];
            if (res.data) {
              /* res.data.forEach(item => {
                arry.push(item.njdm);
              })*/
              this.njList.forEach(item => {
                arry.push(item.njdm);
              })
              const njcheck = _.uniq(arry);
              this.checkboxGroup5 = njcheck; // 设置年级选中
              // this.setCheckBjKm(res.data); // 处理考试设置数据
              this.formatExamSubject(res.data);
              this.handleCheckBox(true);// 设置科目班级选中
            }
            this.loading = false
          })
        })
      },
      getDeleteExamSubject(data) {
        api.deleteExamSubject(data).then(res => {
          if (res.value) {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 });
          } else {
            this.$notify({ title: '失败', message: '操作失败', type: 'error', duration: 2000 });
          }
        })
      },
      // 课程批量删除
      handleCourseBatchDelete(classCourseList, classList, tag, index, i) {
        debugger
        // 记录删除的课程是否已有成绩录入
        let s = 0
        const ids = []
        // 遍历年级
        for (let k = 0; k < classList.length; k++) {
          const v = classList[k];
          // 从当前年级班级中获取要删除的科目
          const y = v.children.filter(t => t.kcdm === tag.kcdm && t.sflrwc === 0)
          const n = v.children.filter(t => t.kcdm === tag.kcdm && t.sflrwc !== 0)
          if (y.length > 0) {
            // 删除科目
            const course = y[0]
            if (course.jlid !== undefined && course.jlid !== '') {
              ids.push(course.jlid)
            }
            v.children.splice(v.children.indexOf(course), 1);
          }
          if (n.length > 0) {
            s++
          }
          // 检查班级内是否还存在课程
          if (v.children.length === 0) {
            // 没有课程删除班级
            const classData = this.checkExamSubjectList[index].bjList;
            classData.splice(classData.indexOf(v), 1)
            k -= 1
          }
        }
        // 如果年级没有班
        if (this.checkExamSubjectList[index].bjList.length === 0) {
          // 删除年级容器
          this.checkExamSubjectList.splice(index, 1)
        }
        // 删除课程
        if (s === 0) {
          classCourseList.splice(i, 1)
        }
        // 删除课程
        if (ids.length > 0) {
          const map = { examId: this.ksid, subjectIds: ids.join(',') }
          this.getDeleteExamSubject(map)
        }
        // 值被修改
        // this.isFlag = true
        // 重新渲染
        this.$forceUpdate()
      },
      // 班级删除
      handleDelete(index, e, a) {
        const data = e.children.filter(o => o.sflrwc !== 0)
        if (data && data.length > 0) {
          this.$notify({ title: '警告', message: '班内有已录入成绩的科目不能删除', type: 'warning' });
        } else {
          const gradeList = this.checkExamSubjectList[index]
          gradeList.bjList.splice(a, 1)
          if (this.checkExamSubjectList[index].bjList.length === 0) {
            this.checkExamSubjectList.splice(index, 1)
          }
          // 检查当前年级下所有班内是否还存在此课程
          e.children.forEach(t => {
            this.serchUpdate(gradeList, index, t);
          })
          this.$forceUpdate()
          const ids = e.children.map(o => o.jlid).filter(t => t !== undefined)
          if (ids && ids.length > 0) {
            const map = { examId: this.ksid, subjectIds: ids.join(',') }
            this.getDeleteExamSubject(map)
          }
        }
      },
      // 班级课程删除
      handleClose(tag, index1, index2) {
        if (tag.sflrwc !== 0) {
          this.$notify({ title: '警告', message: '已录入成绩的科目不能删除', type: 'warning' });
        } else {
          this.getRemove(tag, index1, index2);
          if (tag.jlid && tag.jlid != null && tag.jlid !== '') {
            const map = { examId: this.ksid, subjectIds: tag.jlid }
            this.getDeleteExamSubject(map)
          }
        }
      },
      // 删除处理数据
      getRemove(tag, index1, index2) {
        // 删除班内科目
        const gradeList = this.checkExamSubjectList[index1]
        const data = gradeList.bjList[index2].children
        data.splice(data.indexOf(tag), 1);
        // 如班内没有科目
        if (data.length === 0) {
          // 删除班容器
          this.checkExamSubjectList[index1].bjList.splice(index2, 1)
          // 如果年级没有班
          if (this.checkExamSubjectList[index1].bjList.length === 0) {
            // 删除年级容器
            this.checkExamSubjectList.splice(index1, 1)
          }
        }
        // 检查当前年级下所有班内是否还存在此课程
        this.serchUpdate(gradeList, index1, tag);
        this.$forceUpdate()
      },
      serchUpdate(gradeList, index1, tag) {
        let courseCount = 0
        if (gradeList.bjList.length > 0) {
          for (const e of gradeList.bjList) {
            const v = e.children.filter(o => o.kcdm === tag.kcdm)
            if (v && v.length > 0) {
              courseCount++
            }
          }
        }
        // 如果不存在则删除
        if (this.checkExamSubjectList.length > 0 && courseCount === 0) {
          if (this.checkExamSubjectList[index1]) {
            const classCourseList = this.checkExamSubjectList[index1].classCourseList
            const index = _.findIndex(classCourseList, ['kcdm', tag.kcdm]);
            classCourseList.splice(index, 1)
          }
        }
      },
      addExamSubject() {
        // 获取所有的考试科目列表
        let bool = false
        const examSubjectList = [];
        this.checkExamSubjectList.forEach(e => {
          e.bjList.forEach(subject => {
            subject.children.forEach(child => {
              examSubjectList.push(child);
            })
          })
        })
        let [a, b] = [0, 0]
        for (const item of this.list) {
          if (item.checkedKcCities.length > 0 && item.checkedBjCities.length > 0) {
            for (const kcdm of item.checkedKcCities) {
              for (const bjdm of item.checkedBjCities) {
                const tags = _.filter(examSubjectList, e => e.bjdm === bjdm && e.kcdm === kcdm);
                b++
                if (tags.length === 0) {
                  examSubjectList.push({ xxdm: this.xxdm, ksdxid: this.ksid, njdm: item.njdm, kcdm, bjdm, sflrwc: 0 })
                  bool = true
                }
              }
            }
          } else {
            if (item.checkedKcCities.length > 0 && item.checkedBjCities.length === 0) {
              a = 1
              this.$notify({ title: '警告', message: item.njmc + '请选择班级！', type: 'warning' });
              break;
            } else if (item.checkedBjCities.length > 0 && item.checkedKcCities.length === 0) {
              a = 1
              this.$notify({ title: '警告', message: item.njmc + '请选择课程！', type: 'warning' });
              break;
            } else {
              bool = true
            }
          }
        }
        if (b === 0 && a === 0) {
          this.$notify({ title: '警告', message: '请选择参考信息！', type: 'warning' });
        } else {
          if (bool && a === 0) {
            this.formatExamSubject(examSubjectList);
            // 初始化
            this.list.map(item => {
              const map = item;
              map.isIndeterminateKc = false
              map.checkKcAll = false;
              map.checkedKcCities = []
              map.isIndeterminateBj = false
              map.checkBjAll = false;
              map.checkedBjCities = []
              return map
            })
            this.drawer = false
          }
        }
      },
      formatExamSubject(examSubjectList) {
        this.checkExamSubjectList = jcsj.sjfz(examSubjectList, 'njdm');
        // this.active = []
        this.checkExamSubjectList.map(item => {
          // this.active.push(item.njdm)
          const map = item
          map.njmc = jcsj.hqnjmcByid(this.njList, item.njdm);
          map.bjList = jcsj.sjfz(map.children, 'bjdm');
          const classCourseList = []
          map.bjList.map(b => {
            b.bjmc = jcsj.hqbjmcByid(this.bjList, b.bjdm);
            b.children.map(v => {
              const children = v
              children.kcmc = jcsj.hqkcmcByid(this.kcList, v.kcdm);
              // 设置课程
              const count = classCourseList.filter(e => e.njdm === item.njdm && e.kcdm === v.kcdm).length
              if (count === 0) {
                classCourseList.push(children)
              }
              return children
            })
            return b
          })
          map.bjList = _.sortBy(map.bjList, item => item.bjmc);
          map.classCourseList = classCourseList
          this.$forceUpdate()
          return map
        })
      },
      /**
       * 选年级
       */
      handleCheckBox(isPassive) {
        if (isPassive) { // 是否主动点击 false-主动
        } else {
          this.isFlag = true;
        }
        const list = _.sortBy(this.checkboxGroup5); // 选中的年级排序
        this.zzpkList(list);
        if (list.length === 0) {
          return true
        }
      },
      zzpkList(json) {
        /** 智能排考 **/
        const num_arry = [];
        this.list = json.map(item => { // 遍历处理年级下数据
          log(item, 'list item')
          if (num_arry.length === 0) {
            num_arry.push(item);
          }
          const bjMap = _.find(this.list, o => o.njdm === item) // 获取当前设置的过的历史数据
          const map = { // 重新组装数据
            njdm: item,
            njmc: jcsj.hqnjmcByid(this.njList, item),
            checkBjAll: false,
            isIndeterminateBj: true,
            checkedBjCities: bjMap && bjMap.checkedBjCities.length > 0 ? bjMap.checkedBjCities : [], // 设置选中的班级数据
            bjArry: this.getBjArry(item),
            checkKcAll: false,
            isIndeterminateKc: true,
            checkedKcCities: bjMap && bjMap.checkedKcCities.length > 0 ? bjMap.checkedKcCities : [], // 设置选中年级课程数据
            kcArry: this.getKcArry(item)
          }
          /** 判断课程 是否全部选中 **/
          if (map.checkedKcCities.length === 0 && map.kcArry.length === 0) {
            map.checkKcAll = false;
          } else {
            map.checkKcAll = map.checkedKcCities.length === map.kcArry.length;
          }
          map.isIndeterminateKc = map.checkedKcCities.length > 0 && map.checkedKcCities.length < map.kcArry.length;
          /** 判断班级是否全部选中 **/
          if (map.checkedBjCities.length === 0 && map.bjArry.length === 0) {
            map.checkBjAll = false;
          } else {
            map.checkBjAll = map.checkedBjCities.length === map.bjArry.length;
          }
          map.isIndeterminateBj = map.checkedBjCities.length > 0 && map.checkedBjCities.length < map.bjArry.length;
          return map
        })
        log(this.list, 22212)
        this.activeNames = num_arry; // 默认展开
      },
      setCheckBjKm(arry) {
        /** 设置查询的数据选中 **/
        const list = []
        this.checkboxGroup5.forEach(njdm => {
          /** 遍历年级 **/
          const map = { njdm, checkedBjCities: [], checkedKcCities: [] }
          arry.forEach(item => { /** 遍历考试设置的科目数 **/
            if (item.njdm === njdm) {
              if (!map.checkedBjCities.includes(item.bjdm)) {
                map.checkedBjCities.push(item.bjdm);
              }
              if (!map.checkedKcCities.includes(item.kcdm)) {
                map.checkedKcCities.push(item.kcdm);
              }
            }
          })
          list.push(map);
        })
        this.list = list;
      },
      getBjArry(v) {
        /** 获取年级的对应的班级**/
        const list = _.filter(this.bjList, item => item.njdm === v)
        log(list, 'bjarr')
        return list;
      },
      getKcArry(v) {
        /** 获取年级对应的课程**/
        const kcarry = [];
        const list = _.filter(this.njkcgxList, item => item.njdm === v)
        list.forEach(item => {
          const e = {
            kcdm: item.kcdm,
            kcmc: jcsj.hqkcmcByid(this.kcList, item.kcdm)
          }
          kcarry.push(e);
        })
        return kcarry;
      },
      handleChange(val) {
        log(val);
      },
      handleCheckAllChangeKc(val, check) {
        log(val, 'val')
        this.isFlag = true;
        const $this = this.list[val];
        if (check) {
          const list = [];
          $this.kcArry.forEach(item => {
            list.push(item.kcdm);
          })
          $this.checkedKcCities = list;
        } else {
          $this.checkedKcCities = [];
        }
        $this.isIndeterminateKc = false;
      },
      handleCheckAllChangeBj(val, check) {
        this.isFlag = true;
        const $this = this.list[val];
        if (check) {
          const list = [];
          $this.bjArry.forEach(item => {
            list.push(item.uuid);
          })
          $this.checkedBjCities = list;
        } else {
          $this.checkedBjCities = [];
        }
        $this.isIndeterminateBj = false;
      },
      handleCheckedCitiesChangeKc(val, value) {
        this.isFlag = true;
        const $this = this.list[val];
        const checkedCount = value.length;
        $this.checkKcAll = checkedCount === $this.kcArry.length;
        $this.isIndeterminateKc = checkedCount > 0 && checkedCount < $this.kcArry.length;
      },
      handleCheckedCitiesChangeBj(val, value) {
        this.isFlag = true;
        const $this = this.list[val];
        const checkedCount = value.length;
        $this.checkBjAll = checkedCount === $this.bjArry.length;
        $this.isIndeterminateBj = checkedCount > 0 && checkedCount < $this.bjArry.length;
      },
      handSubmit() { /** 保存考试设置 **/
        // log(this.saveZnKssz(),'save')

        return this.saveZnKssz()
      },
      saveZnKssz() {
        /** 智能排考-考试设置保存**/
        const examSubjectList = [];
        this.checkExamSubjectList.forEach(subject => {
          subject.children.forEach(child => {
            examSubjectList.push(child);
          })
        })
        if (examSubjectList.length > 0) {
          /** 保存数据 **/
          api.saveKsKmxx(examSubjectList).then(res => {
            this.$parent.active = 1;
            if (res.status === 200) {
              this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 });
              return true
            } else {
              this.$notify({ title: '失败', message: '操作失败,' + res.message, type: 'error', duration: 2000 });
              this.$router.push({
                path: '/ksglManager/kswh'
              });
              return false
            }
          })
        } else {
          this.$notify({ title: '警告', message: '已参考科目不能为空', type: 'warning' });
        }
      }
    },
    props: {
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
    }
  }
</script>
<style lang='scss' scoped>
.el-drawer__body{
  overflow: auto;
}
.examlistMain /deep/ .el-collapse-item__header{
  height: auto;
}
.examlistMain /deep/ .el-card__body{
  overflow: auto;
}
</style>