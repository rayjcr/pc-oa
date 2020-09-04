<template>
  <div class="app-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-button type="primary" @click="handleGoback">返回</el-button>
      </div>
      <div class="m_GenTableBox">
        <el-form ref="form" label-width="150px">
          <el-form-item label="学年学期">
            {{xndm}} {{xqdm == '01' ? '上学期' : '下学期'}}
          </el-form-item>
          <el-form-item label="课程名称">
            {{form.kcmc}}
          </el-form-item>
          <el-form-item label="开课人">
            {{form.skr}}
          </el-form-item>
          <el-form-item label="课程内容" v-if="form.gcpynrList && form.gcpynrList.length > 0">
            <el-collapse v-model="activeNames">
              <el-collapse-item
                :title="item.gcpynr"
                :name="item.name"
                v-for="(item,index) in form.gcpynrList"
                :key="index"
              >
                <el-form-item label="课程目标">
                  <div v-for="(v,i) in item.gcpymbList" :key="i" style="position: relative">
                    <div style="width: 80%;margin-bottom: 10px;line-height:28px;">
                      {{v.gcpymb}}
                    </div>
                  </div>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { pylr } from 'api/xkxt/pjManager/index'

  export default {
    name: "gcpywh_detail",
    data() {
      return {
        form: {},
        activeNames: [],
        xxdm: '',
        xndm: this.$route.query.xndm,
        xqdm: this.$route.query.xqdm
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem("xxdm");
    },
    mounted() {
      this.getpylr();
    },
    methods: {
      handleGoback() {
        this.$router.back()
      },
      getpylr() {
        let query = {
          xxdm: this.xxdm,
          kcdm: this.$route.query.kcdm,
          xndm: this.$route.query.xndm,
          xqdm: this.$route.query.xqdm
        };
        pylr(query).then(response => {
          if(response.resultCode == 1) {
            let { value } = response;
            this.form = value;

            // 折叠面板默认展开
            let gcpynrList = value.gcpynrList;
            gcpynrList.forEach((c,i) => {
              this.$set(c,'name',i+1);
              this.activeNames.push(i+1)
            })
          } else {
            this.$message({
              message: response.resultMessage,
              type: 'warning'
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  /*
    修改折叠面板样式------start
  */
  .u_TableMain /deep/ .el-collapse-item__content .el-form-item__label{
    width: 80px!important;
  }
  .u_TableMain /deep/ .el-collapse-item__content .el-form-item__content {
    margin-left: 80px!important;
  }
  .u_TableMain /deep/ .el-collapse-item__header {
    word-break: break-all;
    line-height: 28px;
    min-height: 50px;
    height: 100%;
  }
  /*
    修改折叠面板样式------end
  */
</style>
