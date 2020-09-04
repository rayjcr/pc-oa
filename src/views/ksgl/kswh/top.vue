<template>
  <div class="app-container calendar-list-container" style="position:relative">

    <br>
    <div class="u_TableMain noTransform" style="margin-bottom:100px;">
      <div style="font-size: 20px;margin: 20px 0 0 20px;">{{examName}}
            </div>
      <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="考试设置" name="0">
          <page-kssz ref="pageKssz"
                     v-bind:bj-list="bjList"
                     v-bind:kc-list="kcList"></page-kssz>
        </el-tab-pane>
        <el-tab-pane label="科目分项设置" name="1">
          <page-kmfx v-if="activeName == 1" ref="pageKmfx"
                     v-bind:bj-list="bjList"
                     v-bind:nj-list="njList"
                     v-bind:kc-list="kcList"></page-kmfx>
        </el-tab-pane>
        <el-tab-pane label="人数统计" name="2">
          <page-kstj v-if="activeName == 2" ref="pageKstj"  v-bind:nj-list="njList"></page-kstj>
        </el-tab-pane>
        <el-tab-pane label="录入权限设置" name="3">
          <page-kslrqx v-if="activeName == 3" ref="pageKslrqx" ></page-kslrqx>
        </el-tab-pane>
      </el-tabs> -->
      <div class="filter-container" >
     <!-- <el-steps :active="active" simple>
        <el-step title="考试设置" ></el-step>
        <el-step title="科目分项设置" ></el-step>
        <el-step title="录入权限设置" ></el-step>
      </el-steps> -->
      <div class="box">
        <span class="step-default" :class="{step:active === 0,'step-pass':active === 1 || active === 2}" style="">考试设置</span>
        <span class="step-default" :class="{step2: active === 1,'step-pass': active === 2}">科目分项设置</span><span class="step-default" :class="{step3: active === 2}">录入权限设置</span>
      </div>
      
      </div>
      <div class="m_GenTableBox" ref="m_GenTableBox" style="min-height:600px">
      <page-kssz ref="pageKssz" v-if="active == 0"
                     v-bind:bj-list="bjList"
                     v-bind:kc-list="kcList"
                     @isnext="isNext"></page-kssz>
      <page-kmfx v-if="active == 1" ref="pageKmfx"
                     v-bind:bj-list="bjList"
                     v-bind:nj-list="njList"
                     v-bind:kc-list="kcList"
                     @isnext="isNext"></page-kmfx>
      <page-kslrqx v-if="active == 2"
                    ref="pageKslrqx"
                    :js-list='jsList'
                    :jsz-list="jszList"></page-kslrqx>
        
      </div>
    </div>
    <div align="center" ref="footer-button" class="footer-button">
        <el-button-group style="margin-top: 12px;transform: translateX(-50%)">
          <el-button type="primary" @click="prev" icon="el-icon-arrow-left">上一步</el-button>
          <el-button type="primary" @click="next" >{{active == 2 ?'完成':'下一步'}}<i
            v-if="active != 2" class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>
        </div>
  </div>
</template>
<script>
  import jcsj from '@/api/jcsj';
  import { dqxnxqObj } from '@/api/pkxt/arrangingTask/index';
  import pageKssz from '@/views/ksgl/kswh/kssz/kssz';
  import pageKmfx from '@/views/ksgl/kswh/ksfxwh/kskmfx';
  import pageKstj from '@/views/ksgl/kswh/kstj/kstjsz';
  import pageKslrqx from '@/views/ksgl/kswh/kslrqx/kslrqx';
  export default {
    components: { pageKssz, pageKmfx, pageKstj, pageKslrqx },
    data() {
      return {
        examName: '',
        active: 0,
        name: this.$route.query.name,
        curComponent: 'pageKssz',
        activeName: 0,
        njList: [],
        bjList: [],
        kcList: [],
        jsList: [],
        jszList: [],
        prevShow: false,
        nextShow: true,
        canNext: false,
        pageNum: 0
      }
    },
    created() {
      this.examName = this.$route.query.name
      /** 初始化基础数据**/
       jcsj.remove(jcsj.BJ_KEY);
       jcsj.remove(jcsj.NJ_KEY);
       jcsj.remove(jcsj.KC_KEY);
       jcsj.remove(jcsj.JS_KEY);
       jcsj.remove(jcsj.JSZ_KEY);
      this.xxdm = window.localStorage.getItem('xxdm');
      this.abc();
    },
    // mounted() {
      
    //   setTimeout(()=>{
    //     const mainNode = this.$refs['m_GenTableBox']
    //     const footerNode = this.$refs['footer-button']
    //     log(mainNode.height,mainNode.offsetHeight,'111')
    //     log(document.getElementsByClassName('m_GenTableBox')[0].offsetHeight)
    //     if(mainNode.height > 686) {
    //       footerNode.classList = 'footer-button'
    //     }else {
    //       footerNode.classList = ''
    //     }
    //   },4)
    // },
    methods: {
      isNext(val) {
        // this.canNext = false
        this.pageNum = val
      },
      next() {
        if (this.active === 0) {
         // 验证是否设置过参考科目
          const $that = this.$refs.pageKssz;
          if ($that.checkExamSubjectList && $that.checkExamSubjectList.length > 0) {
            if ($that.isFlag) {
              this.$confirm('数据被改变了,是否保存？', '提示', { type: 'warning' }).then(() => {
                $that.handSubmit()
                $that.handleCheckBox()
              })
            } else {
              this.active = 1
            }
          } else {
            this.$notify({ title: '警告', message: '必须选择参考科目', type: 'warning' });
          }
        } else if (this.active === 1) {
          const $that = this.$refs.pageKmfx;
          if ($that.isFlag) {
            this.$confirm('数据被改变了,是否保存？', '提示', { type: 'warning' }).then(() => {
              $that.savaFx(true)
            })
          } else {
            this.active = 2
          }
        } else if (this.active === 2) {
          if(this.$refs.pageKslrqx.validateEnterTeacher()){
            let nullCount = 0
            this.$refs.pageKslrqx.selectionList.forEach(item => {
              if(item.enteringTeacher && item.enteringTeacher.length > 0) {
              }else {
                nullCount ++
              }
            })
            if(nullCount > 0) {
              this.$notify({
                title: '提示',
                message: '录入老师项存在空值，录入老师最少需要 1 人！',
                type: 'warning',
              })
              return
            }
            if(this.$refs.pageKslrqx.selectionList)
            this.$router.push({
              path: '/ksglManager/kswh'
            });
            
            this.$notify({
              title: '提示',
              message: '考试创建完成，请通知老师录入成绩',
              type: 'success',
              duration:2000
            })
          }else {
            this.$notify({
              title: '提示',
              message: '录入老师最少1个最多5个',
              type: 'warning'
            })
          }
        }
      },
      prev() {
        this.active--
        if (this.active < 0) {
          this.$router.push({
            path: '/ksglManager/kswh'
          });
        }
      },
      handleClick() {
        if (this.activeName === '0') {
          this.$refs.pageKssz.initKsszMian();
        } else if (this.activeName === '1') {
          //
        }
      },
      async abc() {
        // await dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        //   this.dqxn = response.data.xn;
        //   this.dqxq = response.data.xq;
        // })
        this.dqxn = this.$route.query.ksxn
        this.dqxq = this.$route.query.ksxq
        const parm = { xxdm: this.xxdm, xn: this.dqxn }
        /** 获取年级**/
        jcsj.hqnjlb(parm).then(res => {
          this.njList = res;
        })
        /** 获取班级**/
        jcsj.hqbjlb(parm).then(res => {
          log(res, 'bjlist')
          this.bjList = res;
        })
        /** 获取课程**/
        jcsj.hqkclb(parm).then(res => {
          this.kcList = res;
        })
        /** 获取教师**/
        jcsj.hqjslb(parm).then(res => {
          log(res, '教师')
          this.jsList = res;
        })
        /** 获取教师组**/
        const v = { xxdm: this.xxdm };
        jcsj.hqjszlb(v).then(res => {
          log(res, '教师组')
          this.jszList = res;
        })
        this.handleClick(this.index);
      }
    }
  }
</script>
<style lang="scss" scope>
  .el-tabs__item {
    font-size: 16px;
  }
  .footer-button {
    box-sizing: border-box;
    width: 100%;
    height: 64px;
    background: #fff;
    position: fixed;
    bottom:0;
    left: 0;
    right: 0;
    line-height: 50px;
    z-index: 99;
    margin-left: 200px;
  }
  .box{
    width: 100%;
    background: #F5F7FA;
  }
  .step-default{
    display: inline-block;
    position: relative;
    text-align: center;
    color: #B4B8BF;
    line-height: 40px;
    width:33%;
    height:40px;
    font-size: 14px;
    font-weight: bold;
  }
  .step-pass{
    color: #409EFF;
    background:#EBF5FF;
    position: relative;
    &::after{
      content: "";
      position: absolute;
      right: -40px;
      top: 0;
      width: 0;
      height: 0;
      border: 20px solid;
      border-color:  transparent  transparent transparent #EBF5FF;
    }
  }
  .step{
    color: #fff;
    background:#409EFF;
    &::after{
      content: "";
      position: absolute;
      right: -40px;
      top: 0;
      width: 0;
      height: 0;
      border: 20px solid;
      border-color:  transparent  transparent transparent #409EFF;
    }
  }
  .step2{
    color: #fff;
    background:#409EFF;
    &::after{
      content: "";
      position: absolute;
      right: -40px;
      top: 0;
      width: 0;
      height: 0;
      border: 20px solid;
      border-color: transparent  transparent transparent #409EFF;
    }
    &::before{
      content: "";
      position: absolute;
      left: 0px;
      top: 0;
      width: 0;
      height: 0;
      border: 20px solid;
      border-color:  transparent  transparent transparent #EBF5FF;
    }
  }
  .step3{
    color: #fff;
    background:#409EFF;
    &::after{
      content: "";
      position: absolute;
      left: 0px;
      top: 0;
      width: 0;
      height: 0;
      border: 20px solid;
      border-color:  transparent  transparent transparent #EBF5FF;
    }
  }
  .el-drawer__body{
    overflow: auto;
  }
</style>
