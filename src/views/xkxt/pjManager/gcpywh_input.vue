<template>
  <div class="app-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="handleGoback">返回</el-button>
      </div>
      <div class="m_GenTableBox">
        <el-form ref="form" label-width="150px">
          <el-form-item label="学年学期">
            {{xndm}} {{xqdm == '01' ? '上学期' : '下学期'}}
          </el-form-item>
          <el-form-item label="课程名称">
            <el-select v-model="kcdm" placeholder="请选择" @change="changekc">
              <el-option
                v-for="(item,index) in kcList"
                :key="index"
                :label="item.kcmc"
                :value="item.kcdm"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开课人">
            {{form.skr}}
          </el-form-item>
          <div class="add-kcnr">
            <div class="right-box el-row--flex">
              增加
              <div style="width: 50px;margin:0 10px;">
                <el-input v-model="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="1"></el-input>
              </div>
              项课程内容
              <el-button type="primary" @click="addkcnr" style="margin-left: 10px;">确定</el-button>
            </div>
          </div>
          <el-form-item label="课程内容" v-if="form.gcpynrList && form.gcpynrList.length > 0">
            <el-collapse v-model="activeNames">
              <el-collapse-item
                :name="item.name"
                v-for="(item,index) in form.gcpynrList"
                :key="index"
              >
                <template slot="title">
                  <div style="width: 75%" @click.stop.prevent>
                    <el-input v-model="item.gcpynr" maxlength="500" placeholder="请输入内容"></el-input>
                  </div>
                  <div class="right-box">
                    <span @click.stop.prevent="addTarget(index)">增加目标</span>
                    <span @click.stop.prevent="upGo(index)">上移</span>
                    <span @click.stop.prevent="downGo(index)">下移</span>
                    <span @click.stop.prevent="deleteTarget(index)">移除</span>
                  </div>
                </template>
                <el-form-item label="课程目标">
                  <div v-for="(v,i) in item.gcpymbList" :key="i" style="position: relative">
                    <div style="width: 80%;margin-bottom: 10px">
                      <el-input v-model="v.gcpymb" maxlength="500" placeholder="请输入目标"></el-input>
                    </div>
                    <div class="right-box" style="top:0">
                      <span @click.stop.prevent="upGo(index,i)">上移</span>
                      <span @click.stop.prevent="downGo(index,i)">下移</span>
                      <span @click.stop.prevent="deleteTarget(index,i)">移除</span>
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
  import { changeKcxx, pylr, saveGcpynr, deleteGcpynr, deleteGcpymb } from 'api/xkxt/pjManager/index'

  export default {
    name: "gcpywh_detail",
    data() {
      return {
        form: {},
        xxdm: '',
        kcdm: this.$route.query.kcdm,
        xndm: this.$route.query.xndm,
        xqdm: this.$route.query.xqdm,
        kcList: [],
        activeNames: [],
        number: null
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem("xxdm");
    },
    mounted() {
      this.changeKcxx();
      this.getpylr();
    },
    methods: {
      /*
      * 获取课程列表
      * */
      changeKcxx() {
        let query = {
          xxdm: this.xxdm,
          xndm: this.xndm,
          xqdm: this.xqdm
        };
        changeKcxx(query).then(response => {
          if(response.resultCode == 1) {
            this.kcList = response.value;
          } else {
            this.$message({
              message: response.resultMessage,
              type: 'warning'
            });
          }
        })
      },
      changekc() {
        this.getpylr();
      },
      /*
      * 获取评语详情
      * */
      getpylr() {
        let query = {
          xxdm: this.xxdm,
          kcdm: this.kcdm,
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
      },
      save() {
        let kc = this.kcList.filter(v => v.kcdm == this.kcdm);
        this.form.kcmc = kc[0].kcmc;
        let query = {
          kcdm: this.kcdm,
          kcmc: this.form.kcmc,
          xxdm: this.xxdm,
          xndm: this.xndm,
          xqdm: this.xqdm,
          skr: this.form.skr,
          gcpynrList: this.form.gcpynrList
        };
        saveGcpynr(query).then(response => {
          if(response.resultCode == 1) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: response.resultMessage,
              type: 'warning'
            });
          }
        })
      },
      handleGoback() {
        this.$router.back()
      },
      /*
      * 删除课程内容
      * */
      deleteGcpynr(id,nrkey) {
        let query = {
          jlid: id
        };
        deleteGcpynr(query).then(response => {
          if(response.resultCode == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.form.gcpynrList.splice(nrkey,1)
          } else {
            this.$message({
              message: response.resultMessage,
              type: 'warning'
            });
          }
        })
      },
      /*
      * 删除课程目标
      * */
      deleteGcpymb(id,nrkey,mbkey) {
        let query = {
          jlid: id
        };
        deleteGcpymb(query).then(response => {
          if(response.resultCode == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.form.gcpynrList[nrkey].gcpymbList.splice(mbkey,1)
          } else {
            this.$message({
              message: response.resultMessage,
              type: 'warning'
            });
          }
        })
      },
      /*
      * 增加课程内容
      * */
      addkcnr() {
        let Len = this.form.gcpynrList.length;
        for(let i = 1;i <= this.number;i++){
          this.form.gcpynrList.push({
            gcpynr : '',
            jlid : '',
            gcpymbList: [{
              gcpymb: '',
              gcpynrid: ''
            }],
            name: Len+i
          },);
          this.activeNames.push(Len+i)
        }
      },
      /*
      * 增加目标
      * */
      addTarget(index) {
        this.form.gcpynrList[index].gcpymbList.push({
          gcpymb: '',
          gcpynrid: ''
        })
      },
      /*
      * 上移
      * @param targetIndex 操作目标
      * */
      upGo(index,targetIndex) {
        if(typeof targetIndex == "number") {

          if(targetIndex == 0) return;

          this.form.gcpynrList[index].gcpymbList[targetIndex] = this.form.gcpynrList[index].gcpymbList.splice(targetIndex - 1, 1, this.form.gcpynrList[index].gcpymbList[targetIndex])[0];
        } else {

          if (index == 0) return;

          this.form.gcpynrList[index] = this.form.gcpynrList.splice(index - 1, 1, this.form.gcpynrList[index])[0];
        }
      },
      /*
      * 下移
      * @param targetIndex 操作目标
      * */
      downGo(index,targetIndex) {
        if(typeof targetIndex == "number") {

          if(targetIndex == this.form.gcpynrList[index].gcpymbList.length - 1) return;

          this.form.gcpynrList[index].gcpymbList[targetIndex] = this.form.gcpynrList[index].gcpymbList.splice(targetIndex + 1, 1, this.form.gcpynrList[index].gcpymbList[targetIndex])[0];
        } else {

          if (index == this.form.gcpynrList.length - 1) return;

          this.form.gcpynrList[index] = this.form.gcpynrList.splice(index + 1, 1, this.form.gcpynrList[index])[0];
        }
      },
      /*
      * 移除
      * @param targetIndex 操作目标
      * */
      deleteTarget(index,targetIndex) {
        if(typeof targetIndex == "number") { // 操作目标
          if(this.form.gcpynrList[index].gcpymbList.length == 1) {
            this.$message({
              message: '课程目标至少保留一个',
              type: 'warning'
            });
            return;
          }
          if(this.form.gcpynrList[index].gcpymbList[targetIndex].gcpynrid) {
            this.confirm(this.form.gcpynrList[index].gcpymbList[targetIndex].jlid,2,index,targetIndex);
            return;
          }
          this.form.gcpynrList[index].gcpymbList.splice(targetIndex,1)
        } else { // 操作内容
          if(this.form.gcpynrList.length == 1) {
            this.$message({
              message: '课程内容至少保留一个',
              type: 'warning'
            });
            return;
          }
          if(this.form.gcpynrList[index].jlid) {
            this.confirm(this.form.gcpynrList[index].jlid,1,index);
            return;
          }
          this.form.gcpynrList.splice(index,1)
        }
      },
      /*
      * 删除提示
      * @param id 要删除的记录id
      * @param type 1 删除课程内容  2 删除课程目标
      * @param nrkey 当前课程内容索引
      * @param mbkey 当前课程目标索引
      * */
      confirm(id,type,nrkey,mbkey) {
        this.$confirm('确定删除选中的记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(type == 1) {
            this.deleteGcpynr(id,nrkey)
          } else {
            this.deleteGcpymb(id,nrkey,mbkey)
          }
        }).catch(e => {

        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  /*
    修改折叠面板样式------start
  */
  .u_TableMain /deep/ .el-collapse-item__header {
    height: 40px;
  }

  .u_TableMain /deep/ .el-collapse-item__content {
    padding-top: 20px;
  }

  .u_TableMain /deep/ .el-collapse-item__content .el-form-item__label {
    width: 80px !important;
  }

  .u_TableMain /deep/ .el-collapse-item__content .el-form-item__content {
    margin-left: 80px !important;
  }
  .u_TableMain /deep/ .el-collapse {
    border: none;
  }
  .u_TableMain /deep/ .el-collapse-item {
    margin-bottom: 10px;
  }

  /*
    修改折叠面板样式------end
  */
  .m_GenTableBox .add-kcnr {
    position: relative;
    height: 50px;
    margin-bottom: 20px;
  }
  .m_GenTableBox .right-box {
    position: absolute;
    right: 30px;
  }
  .m_GenTableBox .el-row--flex {
    align-items: center;
  }

</style>
