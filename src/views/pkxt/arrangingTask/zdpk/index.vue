<template>
  <div class="view">
    <div class="autoPkMain" v-show="step=='step1'" style="text-align: center;height: 500px;padding-top: 250px">
      <el-button class="autoPkBtn" type="primary" size="large" @click="autopk">智能排课</el-button>
    </div>
    <div class="autoPkIng" v-show="step=='step2'">
      <i class="el-icon-loading"></i><br>
      正在排课中...
    </div>
    <div class="mask" v-show="step=='step2'"></div>
    <div class="autoPkResult" v-show="step=='step3'">
      <div class="autoResultInfo"><i class="el-icon-circle-check"></i> 排完啦！</div>
      <div class="autoResultCondition" style="text-align: center">
          <el-button type="success" size="large" style="margin-top: 30px" @click="HandleCkkb">查看课表</el-button>
          <el-button @click="autopk"  size="large" style="margin-top: 30px">再排一次</el-button>
          <br>
      </div>
      <div style="font-size: 16px;text-align: center;padding: 30px 0;">
        <el-button icon="el-icon-setting" type="text" @click="setnj">设置不需要重新排课的年级<i class="el-icon-arrow-right el-icon--right"></i></el-button>

      </div>


      <div class="autoResultCondition" style="text-align: center" v-if="nopkFlag">
        <el-button @click="ckNoSuccessData"  size="large" style="margin-top: 30px">排课未成功的课程列表</el-button>
      </div>
      <!--查看排课须知 -->
      <el-dialog title="排课未成功的课程列表" center :visible.sync="noSuccessDialogForm" width="29%">
        <el-table :data="noPkArr" height="535" border fit highlight-current-row  style="width: 100%;">
          <el-table-column prop="bjmc"  label="班级名称" width="200" align="center" ></el-table-column>
          <el-table-column prop="kcmc"  label="课程名称" width="305" align="center" ></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeNoSuccessData">关闭</el-button>
        </div>
      </el-dialog>

      <el-dialog title="请选择不需要重新排的年级" :visible.sync="dialog_1" width="700px">
        <template>
          <el-checkbox-group
            v-model="checkednj">
            <el-checkbox v-for="nj in njlist" :label="nj.njdm" :key="nj.njdm">{{nj.njmc}}</el-checkbox>
          </el-checkbox-group>
        </template>
        <el-row>
          <el-button  type="primary" class="gzpx" @click="autopk()"  :disabled="changeSure" >确 定</el-button>
          <el-button type="primary" class="gzpx" @click="cancelForm()" >取消</el-button>
        </el-row>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import jcsj from '@/views/pkxt/arrangingTask/pkjcsj';
  import { znpk, checkSfypk, checkNoSuccessPkData, getPkNjList } from '@/api/pkxt/arrangingTask/zdpk/index';
  export default {
    name: 'zdpk',
    data() {
      return {
        changeSure: false,
        dialog_1: false,
        rwid: this.$route.query.rwid,
        step: 'step1',
        Unsatisfied: true,
        setUnwanted: false,
        currentPkid: '',
        activeName: '0',
        noPkArr: [],
        nopkFlag: false,
        checkednj: [],
        njlist: [],
        noSuccessDialogForm: false
      }
    },
    mounted() {
      this.checkStep();
    },
    methods: {
      autopk() {
        this.changeSure = true;
        this.dialog_1 = false;
        const that = this;
      // 调用自动排课接口
        this.step = 'step2'
        let nj = '';
        this.checkednj.forEach((item) => {
          nj += item + ',';
        })
        znpk({ rwid: this.rwid, pkid: this.currentPkid, nj: nj }).then(res => {
          if (parseInt(res.status) === 1) {
            if (res.data.nopkList !== undefined) {
            // 获取为成功排课的课程和班级
              const noSuccessKcDataArr = [];
              for (const pkxx of res.data.nopkList) {
                const noSuccessKcData = {};
                const bj = jcsj.hqbjmcByid(this.bjList, pkxx.bjdm);
                const kc = jcsj.hqkcmcByid(this.kcList, pkxx.kcdm);
                noSuccessKcData.bjmc = bj;
                noSuccessKcData.kcmc = kc;
                noSuccessKcDataArr.push(noSuccessKcData);
              }
              that.noPkArr = noSuccessKcDataArr;
              that.nopkFlag = true;
            }
            this.$notify({
              title: '成功',
              message: '排课成功',
              type: 'success',
              duration: 2000
            });
            that.step = 'step3';
            this.changeSure = false;
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
            that.checkStep();
          }
        });
      },
      checkStep() {
        checkSfypk({ rwid: this.rwid, isuse: '1' }).then(res => {
          if (res.data.length > 0) {
            const pkzt = res.data[0].pkid;
            this.currentPkid = pkzt;
            this.checkPkData();
            this.step = 'step3';
          }else{
            this.step = 'step1'
          }
        });
      },
      getNjlist() {
        getPkNjList({ rwid: this.rwid }).then(res => {
          if (res.data.length > 0) {
            this.njlist = res.data;
          }
        });
      },
      // 检测是否存在为成功排课是的数据
      checkPkData() {
        checkNoSuccessPkData({ pkid: this.currentPkid, flag: '0' }).then(res => {
          if (res.data.length > 0) {
            this.nopkFlag = true;
            const noSuccessKcDataArr = [];
            for (const pkxx of res.data) {
              const noSuccessKcData = {};
              const bj = jcsj.hqbjmcByid(this.bjList, pkxx.bjdm);
              const kc = jcsj.hqkcmcByid(this.kcList, pkxx.kcdm);
              noSuccessKcData.bjmc = bj;
              noSuccessKcData.kcmc = kc;
              noSuccessKcDataArr.push(noSuccessKcData);
            }
            this.noPkArr = noSuccessKcDataArr;
          }
        });
      },
      // 查看排课须知
      ckNoSuccessData() {
        this.noSuccessDialogForm = true;
      },
      // 关闭排课须知
      closeNoSuccessData() {
        this.noSuccessDialogForm = false;
      },
      HandleCkkb() {
        this.$emit('ee', 4)
      },
      handleClick(){

      },
      setnj() {
        this.getNjlist();
        this.dialog_1 = true;
      },
      cancelForm() {
        this.dialog_1 = false;
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
<style scope>
  .view{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
