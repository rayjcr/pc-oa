<template>
  <el-row :gutter="12">
  <el-col :span="4" >
    <el-card shadow="always" style="height:750px;overflow:auto;" class="smallscroll">
      <el-tree style="height:100%;" width="20%"
               :data="treeData"
               node-key="index"
               :highlight-current="true"
               :accordion="true"
               :props="defaultProps"
               @node-click="handleCheckClick"
               :expand-on-click-node="true"
               ref="tree3"></el-tree>
    </el-card>
  </el-col>
    <el-col :span="20">
      <el-card shadow="never" style="height:750px;">
        <div style="padding-bottom: 10px">
        <el-alert
          style="margin: 4px 0 !important;"
          title=" 温馨提示，如果对课节数进行修改,会清空规则条件历史数据"
          type="warning"  show-icon>
        </el-alert>
        </div>
        
       
        <el-table :data="list" :empty-text="emptyText" height="535" border fit highlight-current-row  style="width: 100%;">
          <el-table-column prop="kcmc"  label="课程名称" width="180" align="center" ></el-table-column>
          <el-table-column prop="njmc"  label="年级" width="180" align="center" ></el-table-column>
          <el-table-column prop="bjmc"  label="班级" width="180" align="center" ></el-table-column>
          <el-table-column label="课程类型" width="180" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.kclx == 0" size="small" slot="reference" type="info">
                  <span>选修课</span>
              </el-tag>
              <el-tag v-if="scope.row.kclx == 1" size="small" slot="reference" type="success">
                  <span>必修课</span>
              </el-tag>
              <el-tag  v-if="scope.row.kclx ==2" size="small" slot="reference" type="warning">
                <span>活动课</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column  label="每周上课数" width="350" align="center" >
            <template slot-scope="scope" >
              <el-input-number v-if="scope.row.zt == 1" size="mini"  :min="0" :max="35" v-model ="scope.row.zxs" :disabled="true" ></el-input-number>
              <el-input-number v-else size="mini" :min="0" :max="35"  v-model ="scope.row.zxs"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" v-if="isShow">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.zxsStr" placement="top-start" >
                <span v-if="scope.row.zt == 1" style="color:red">各班级不一致</span>
                <span v-else-if="scope.row.zt == 0" style="color:dodgerblue">各班级一致</span>
              </el-tooltip>
            </template>
          </el-table-column>
        
        </el-table>
        <el-button class="handel-but" @click="HandleChange" type="primary">保存</el-button>
        <el-button class="handel-but" @click="cancleTable">取消</el-button>
        <el-progress :text-inside="true" class="progress-bottom" :stroke-width="18" :percentage="calculateProcess()"  :show-text="true" :color=colors></el-progress>
        <div class='totalkc'>节数合计/课程容量：<span>{{num}}/{{totalZxs}}</span></div>
        
      </el-card>
      <el-dialog
          title="冲突提示"
          :visible.sync="diffDialogVisible"
          width="30%"
          >
          
          <div v-for="(item,index) in diffList" :key="index" class="diffwarp">
            <div class="kcname">{{item.kcmc}}&nbsp;&nbsp;{{item.flag == 0 ? '(-'+item.sectionCount+'节课)' : '(+'+item.sectionCount+'节课)'}}</div>
            <div v-for="(a,b) in item.ctContent" :key="b" class="ctcontent">&nbsp;&nbsp;{{a}}</div>
          </div>
          <div class="ctcontent">
            （注：一键清除按钮随机清除对应数量条数（如课时数4，已设置的规则5，则随机删除5-4=1条规则，以此类推）的固定排规则）
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="diffDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="diffDialog">一键清除</el-button>
          </span>
        </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
  import { getKcsz, getNjkc, getAdd, getUpdate, getTotalZxs, checkGzsz, initGzsz, getBsks,deletableRulesByCourseList,deletRulesByCourseList } from 'api/pkxt/arrangingTask/jcsz/kcsz';
  import jcsj from '@/views/pkxt/arrangingTask/pkjcsj';
  export default {
    data() {
      return {
        num1: '',
        xxdm: '', // 学校代码
        list: [], // 课程数据
        treeData: [], // 年级树
        currentNjdm: '', // 当前年级代码
        total: '',
        currentNode: {},
        currentData: {},
        rwid: this.$route.query.rwid,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        num: 0,
        zxs: {},
        isShow: true,
        colors: '',
        totalZxs: 0,
        allTotalZxs: 0,
        initList:[],
        diffList:[],
        diffDialogVisible:false,//冲突提示框
        paramsPublic:[],
        emptyText:''
      };
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
    },
    // deactivated(){
    //   this.$alert('哈哈哈', '提示', {
    //     confirmButtonText: '确定',
    //     callback: action => {
    //       return;
    //     }
    //   });
    // },
    
    methods: {
      // 获取年级数据
      async getList(data) {
        this.listLoading = true;
        this.isShow = true;
        // console.log(data,11111111111111)
        if(!data.id){
          return;
        }
        const queryObj = { xxdm: this.xxdm, njdm: data.id, rwid: this.rwid };
        let bskNum = 0;
        await getBsks(queryObj).then(res => {
          if (res.data === undefined || res.data === '') {
            bskNum = 0;
          } else {
            bskNum = res.data;
          }
        });
        this.totalZxs = (this.allTotalZxs - bskNum) > 0 ? this.allTotalZxs - bskNum : 0;
        getNjkc(queryObj).then(response => {
          this.list = response.data.rows;
          if(response.data.rows.length == 0){
            this.emptyText="年级未设置课程，请到基础信息设置中设置基础课程"
          }
          response.data.rows.forEach(item => {
            const njmc = jcsj.hqnjmcByid(this.njList, item.njdm);
            item.njmc = njmc;
            item.bjmc = '全部班级';
            try {
            // 根据课程状态来设置不同的提示语
              if (item.zt > 0) {
                let zxsString = '';
                const zxsArr = item.zxsStr.split(';');
                zxsArr.forEach((zxsStr, index) => {
                  if (index < zxsArr.length - 1) {
                    const bjdm = zxsStr.substr(0, zxsStr.indexOf(' : '));
                    const zxs = zxsStr.substr(zxsStr.indexOf(' : ') + 3, zxsStr.length);
                    const bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
                    zxsString += bjmc + ' : ' + zxs + ' 节 ;  ';
                  }
                });
                item.zxsStr = zxsString;
              } else if (item.zt === 0 && item.zxsStr === '') {
                item.zxsStr = '该年级还未进行课程设置';
              } else {
                item.zxsStr = '所有班级课程设置均为 ' + item.zxsStr + ' 节';
              }
            } catch (e) {
              console.error('基础数据取值error');
            }
          });
          this.initList =  _.cloneDeep(response.data.rows);
          this.listLoading = false;
          this.countZxs();
        });
      },
      // 获取班级数据
      async getKcList(data) {
        this.isShow = false;
        let bskNum = 0;
        const queryObj = { xxdm: this.xxdm, bjdm: data.id, rwid: this.rwid };
        await getBsks(queryObj).then(res => {
          if (res.data === undefined || res.data === '') {
            bskNum = 0;
          } else {
            bskNum = res.data;
          }
          
        });
        this.totalZxs = this.allTotalZxs - bskNum;
        getKcsz(queryObj).then(response => {
          response.data.rows.forEach(item => {
            try {
              const kcmc = jcsj.hqkcmcByid(this.kcList, item.kcdm);
              const kclx = jcsj.hqkclxByid(this.kcList, item.kcdm);
              const njmc = jcsj.hqnjmcByid(this.njList, item.njdm);
              const bjmc = jcsj.hqbjmcByid(this.bjList, item.bjdm);
              item.bjmc = bjmc;
              item.njmc = njmc;
              item.kcmc = kcmc;
              item.kclx = kclx;
            } catch (e) {
              console.error('基础数据取值error');
            }
          });
          if(response.data.rows.length == 0){
            this.emptyText="暂无数据，请左侧点击年级进行设置课程"
          }
          this.list = _.cloneDeep(response.data.rows);
          this.initList = _.cloneDeep(response.data.rows);
          this.countZxs();
        });
      },
      async loadnjBjData() { // 处理年级和班级树结构
        await getTotalZxs({ xxdm: this.xxdm, rwid: this.rwid }).then(response => {
          if (response.data == 0) {
            this.allTotalZxs = response.data;
            this.$notify({ title: '提示', message: '请检查课时设置是否已设置', type: 'warning', duration: 2000 });
          } else {
            this.allTotalZxs = response.data;
          }
        });
        if (this.treeData.length === 0) {
          this.treeData = [];
          let id=0;
          for (let j = 0; j < this.njList.length; j++) {
            id=++id
            const njdata = this.njList[j];
            const njmap = {};
            if (j === 0) {
              const defaultNode = { level: 1 };
              const defaultData = { id: njdata.njdm };
              this.getAllList(defaultNode,defaultData);
              //console.log(njdata.njdm);
            }
            njmap.label = njdata.njmc;
            njmap.id = njdata.njdm;
            njmap.disabled = true;
            njmap.children = [];
            njmap.index = id;
            const bjdata = _.filter(this.bjList, { njdm: njdata.njdm });
            for (let i = 0; i < bjdata.length; i++) {
              id=++id
              njmap.children.push({ label: bjdata[i].bj, id: bjdata[i].uuid,index:id });
            }
            this.treeData.push(njmap);
          }
          
          this.$nextTick(function(){//默认选中tree节点高亮
            this.currentNjdm = this.treeData[0].id
            this.currentNode = {level:1};
            this.currentData = this.treeData[0];
            // console.log(this.treeData,6654321)
            this.$refs.tree3.setCurrentKey(1);
          })
        }
      },
      /** @树形插件班级点击事件显示学生方法**/
      handleCheckClick(data, node) {
        if ($.isEmptyObject(this.currentNjdm)) {
          this.currentNjdm = data.id;
          this.currentNode = node;
          this.currentData = data;
        }
        this.getAllList(node, data);
        this.currentNode = node;
        this.currentData = data;
        // console.log(node,data,33333333333333333)
      },
      // 保存课程设置信息
      HandleChange() {
        // console.log(this.initList,this.list,239)
        let that = this;
        _.forEach(that.list,function(item,index){
          item.oldZxs = that.initList[index].zxs
        })
        let params={};
        // console.log(this.currentNode,77776655)
        if (this.currentNode.level == '2') {
          params = { kcszList: this.list,rwid:that.rwid}
          
        } else if (this.currentNode.level == '1') {

          const bjdata = _.filter(this.bjList, { njdm: this.currentData.id });
          params = { kcszList: this.list, bjList: bjdata,rwid:that.rwid }
          
        } else {
          return;
        }
        this.paramsPublic = params;
        /* 合班 和 单双周 */
        // 保存课程  验证是否冲突
        deletableRulesByCourseList(params).then((res) => {
          if(res.status == 200){
            
            this.diffList = res.data;
            if(this.diffList.length == 0){
              this.saveKcszData();
              return;
            }
            this.diffDialogVisible = true
            this.diffList.forEach((item,index)=>{
              item.kcmc = jcsj.hqkcmcByid(this.kcList, item.courseCode);
              item.ctContent = [];
              if(item.singleAndDoubleWeekList && item.singleAndDoubleWeekList.length != 0){
                item.singleAndDoubleWeekList.forEach((a)=>{//单双周冲突
                  a.bjmc = jcsj.hqbjmcByid(this.bjList, a.bjdm);
                  a.kcmc = jcsj.hqkcmcByid(this.kcList, a.dzkc);
                  a.szmc = jcsj.hqkcmcByid(this.kcList, a.szkc);
                  if(item.sdwZxs > 0){
                    item.ctContent.push(`${a.bjmc}已设置单双周课程，需同步增减另一门课程对应的课时数，请调整一致后重新保存。`)
                  }else{
                    item.ctContent.push(`${a.bjmc}已与${a.kcmc}设置单双周课程`)
                  }
                })
              }
              if(item.classArrangeCourseRulesList && item.classArrangeCourseRulesList.length != 0){//班级固定排/不排
                let bjmcList = '';
                item.classArrangeCourseRulesList.forEach((b)=>{
                  
                  bjmcList += jcsj.hqbjmcByid(this.bjList, b.classCode)+',';
                  //b.bjmc = jcsj.hqbjmcByid(this.bjList, b.classCode);
                })
                item.ctContent.push(`${bjmcList}已设置固定排课次数大于修改后的每周课节数`)
              }
              if(item.mergerClassSetUpList && item.mergerClassSetUpList.length != 0){
                item.mergerClassSetUpList.forEach((c)=>{//合班
                  c.kcmc = jcsj.hqkcmcByid(this.kcList, c.hbkc);
                  c.hbbj.split(',').forEach((d)=>{
                    c.bjmc = c. bjmc + jcsj.hqbjmcByid(this.bjList, d);
                  })
                  item.ctContent.push(`${jcsj.hqbjmcByid(this.bjList, c.hbbj.split(',')[0])}与${jcsj.hqbjmcByid(this.bjList, c.hbbj.split(',')[1])}已设置合班，两个班课时数不一致`)
                })
              }

              if(item.teacherArrangeCourseRulesList && item.teacherArrangeCourseRulesList.length != 0){
                item.teacherArrangeCourseRulesList.forEach((e)=>{//教师固定排/不排
                  e.kcmc = jcsj.hqkcmcByid(this.kcList, e.kcdm);
                  e.teacher = jcsj.hqjsmcByid(this.jsList, e.zgh);
                  item.ctContent.push(`${e.teacher}已设置固定排课次数大于修改后的每周课节数`)
                })
              }
              
              if(item.classArrangeCourseMap && item.classArrangeCourseMap.length != 0){
                let bjmcList = '';
                if(Array.isArray(item.classArrangeCourseMap) == true){
                  item.classArrangeCourseMap.forEach((f)=>{//（按班级）班级固定排/不排
                  //f.bjmc = jcsj.hqbjmcByid(this.bjList, f.classCode);
                    bjmcList+= jcsj.hqbjmcByid(this.bjList, f.classCode)+',';
                    
                  })
                }else{
                  bjmcList = jcsj.hqbjmcByid(this.bjList,item.classArrangeCourseMap.classCode)
                }
                
                item.ctContent.push(`${bjmcList}已设置固定排课次数大于修改后的每周课节数`)
              }
              if(item.teacherMutexRulesList && item.teacherMutexRulesList.length != 0){
                item.teacherMutexRulesList.forEach((g)=>{//教师设置-互斥连排
                  g.bjmc = jcsj.hqbjmcByid(this.bjList, g.classCode);
                  g.kcmc = jcsj.hqkcmcByid(this.kcList, g.lskc);
                  g.teacher = jcsj.hqjsmcByid(this.jsList, g.hcjs);
                  item.ctContent.push(`${g.teacher}教师${g.kcmc}课已设置互斥连排规则。`)
                })
              }
              if(item.classMutexRulesList && item.classMutexRulesList.length != 0){
                item.classMutexRulesList.forEach((h)=>{//班级互斥连排
                  h.bjmc = jcsj.hqbjmcByid(this.bjList, h.bjdm);
                  h.kcmc = jcsj.hqkcmcByid(this.kcList, h.kcdm);
                  h.hckc = jcsj.hqkcmcByid(this.kcList, h.hckc);
                  h.teacher = jcsj.hqjsmcByid(this.jsList, h.hcjs);
                  h.kclp = jcsj.hqkcmcByid(this.kcList, h.kclp);
                  item.ctContent.push(`${h.bjmc}互斥课程为${h.hckc}，连排课程${h.kclp}，已设置课程互斥连排规则。`)
                })
              }
              if(item.lessonPlanFlushRulesList && item.lessonPlanFlushRulesList.length != 0){
                
                item.lessonPlanFlushRulesList.forEach((i)=>{//教案齐平
                  // i.njmc = jcsj.hqnjmcByid(this.njList, i.njdm);
                  // i.kcmc = jcsj.hqkcmcByid(this.kcList, i.kcdm);
                  //i.teacher = jcsj.hqjsmcByid(this.jsList, i.zgh);
                  
                  item.ctContent.push(`${jcsj.hqjsmcByid(this.jsList, i.zgh.split(',')[0])},${i.zgh.split(',')[1] ? jcsj.hqjsmcByid(this.jsList, i.zgh.split(',')[1]) : ''}教师教案齐平规则已设置将被清空。`)
                })
                 
              }
              if(item.courseAllocationRulesList && item.courseAllocationRulesList.length != 0){
                // item.courseAllocationRulesList.forEach((g)=>{//课时时段设置
                //   g.njmc = jcsj.hqnjmcByid(this.njList, g.njdm);
                //   g.teacher = jcsj.hqjsmcByid(this.jsList, g.zgh);
                //   g.kcmc = jcsj.hqkcmcByid(this.kcList, g.kcdm);
                // })
                item.ctContent.push(`课程时段分配规则已设置将被清空。`)
              }

              if(item.weekLyDistributionRulesList && item.weekLyDistributionRulesList.length != 0){
                // item.weekLyDistributionRulesList.forEach((k)=>{//周任课分布
                //   k.njmc = jcsj.hqnjmcByid(this.njList, k.njdm);
                //   k.teacher = jcsj.hqjsmcByid(this.jsList, k.zgh);
                //   k.kcmc = jcsj.hqkcmcByid(this.kcList, k.kcdm);
                // })
                item.ctContent.push(`周任课分布规则将被清空。`)
              }
              if(item.dayDistributionRulesList && item.dayDistributionRulesList.length != 0){
                //item.dayDistributionRulesList.forEach((m)=>{//天任课分布
                  // m.njmc = jcsj.hqnjmcByid(this.njList, m.njdm);
                  // m.teacher = jcsj.hqjsmcByid(this.jsList, m.zgh);
                  // m.kcmc = jcsj.hqkcmcByid(this.kcList, m.kcdm);
                  
                //})
                item.ctContent.push(`天任课分布规则已设置将被清空。`)
              }
            })
            

          }
        });
      },
      // 进度条计算
      countZxs() {
        this.num = 0;
        for (this.zxs of this.list) {
          this.num += this.zxs.zxs;
        }
      },
      // 获取全校上课总节数
      async getZxs() {
        
      },
      // 进度条计算保留整数
      calculateProcess() {
        let percent = 0;
        if (this.totalZxs !== 0) {
          percent = this.num / this.totalZxs * 100;
        }
        if (percent === 100) {
          this.colors = '#67c23a';
        } else if (percent > 100) {
          this.colors = '#EE2C2C';
        } else {
          this.colors = '#409EFF';
        }
        const maxPerson = percent > 100 ? 100 : percent;
        return parseInt(maxPerson.toFixed(0));
      },
      // 查询课程设置信息
      getAllList(node, data) {
        if (node.level == '2') {
          this.getKcList(data);
        } else {
          this.getList(data);
        }
      },
      // 保存课程设置数据
      async saveKcszData() {
        // console.log(this.currentNode, this.currentData,44444444444444)
        await this.countZxs();
        if (this.num > this.totalZxs) {
          this.$notify({ title: '温馨提示', message: '上课节数不能大于全校上课节数,请重新填写', type: 'warning', duration: 2000 });
          //this.getAllList(this.currentNode, this.currentData);
          return;
        }
        // 保存课程设置信息
        if (this.currentNode.level == '2') {
          
          getUpdate(this.rwid, { kcszList: this.list }).then((res) => {
            if(res.status == 200){
              this.$notify({ title: '温馨提示', message: '保存成功', type: 'success', duration: 2000 });
              this.getAllList(this.currentNode, this.currentData);
            }
            
          });
        } else if (this.currentNode.level == '1') {
          const bjdata = _.filter(this.bjList, { njdm: this.currentData.id });
          getAdd({ kcszList: this.list, rwid: this.rwid, bjList: bjdata }).then((res) => {
            if(res.status == 200){
              this.$notify({ title: '温馨提示', message: '保存成功', type: 'success', duration: 2000 });
              this.getAllList(this.currentNode, this.currentData);
            }
          });
        } else {
          return;
        }
      },
      /* 一键清除 */
      diffDialog(){
        this.diffDialogVisible = false;
        deletRulesByCourseList(this.paramsPublic).then((res) => {
          if(res.status == 200){this.$notify({ title: '温馨提示', message: '清除成功', type: 'success', duration: 2000 });
            this.saveKcszData();
          }
        });
        //this.saveKcszData();
      },
      cancleTable(){
        this.list = _.cloneDeep(this.initList);
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
    }
  };

</script>
<style scoped>
  .totalkc{width:100%; height:40px; line-height:40px; color:#449afc; text-align:right;}
  .bg-red{ background:#f00;}
  .handel-but{
    margin-top:15px;
    margin-bottom: 15px;
  }
  .kcname{
    font-size: 15px;
    color:#606266;
    font-weight: 600;
  }
  .ctcontent{
    color:#666;
    font-size: 14px;
  }
  .diffwarp{
    background-color: #f5f7fa;
    padding: 8px 10px;
  }
</style>
