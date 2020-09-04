<template>
  <div class="app-container">
    <div class="u_TableMain">
      <div class="filter-container">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
      <div class="m_GenTableBox">
        <el-form :model="form" ref="form" label-width="150px">
          <h4>短信通知设置</h4>
          <el-form-item label="是否短信通知家长">
            <el-radio v-model="form.sffdx" label="1">是</el-radio>
            <el-radio v-model="form.sffdx" label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="短信内容">
            ⅩⅩⅩ家长：您好! 您的孩子有新的拓展课表现评价信息，请登录学校公众号-课堂评价模块查看。
          </el-form-item>

          <h4>奖章设置</h4>
          <el-form-item label="是否发放奖章">
            <el-radio v-model="form.sffjz" label="1">是</el-radio>
            <el-radio v-model="form.sffjz" label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="奖章图标">
            <el-upload
              ref="newupload"
              class="upload-demo"
              action="/api/course/kcxx/sctpS"
              accept=".jpg,.jpeg,.gif,.png"
              list-type="picture-card"
              :file-list="fileList"
              :headers="importHeaders"
              :beforeUpload="beforeAvatarUpload"
              :on-change="handleChange"
              :on-success="handleSuccess"
              :on-preview="handlePicturePreview"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">请上传小于1M的图片(最佳大小120*120)，支持的格式：.jpg .jpeg .gif .png</div>
            </el-upload>

            <el-dialog :visible.sync="dialogVisible" append-to-body>
              <img width="100%" fit="contain" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { getToken } from 'utils/auth';

  import { ck } from 'api/xkxt/kcxxManager/index'

  import { getPjszInfo, savePjsz } from 'api/xkxt/pjManager/index'

  export default {
    name: "pjsz",
    data() {
      return {
        form: {
          sffdx: '0', // 是否短信通知家长
          sffjz: '1', // 是否发放奖章
          jlid: ''
        },
        userid: '',
        fileList: [],
        fjid: '',
        tplj: '', // 图片域名
        xxdm: '',
        dialogVisible: false,
        dialogImageUrl: '',
        importHeaders: {
          enctype: 'multipart/form-data',
          Authorization: getToken()
        },
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem("xxdm");
      this.userid = window.localStorage.getItem("userid");
    },
    mounted() {
      this.getDomainImg();
    },
    methods: {
      /*
      * 获取评价设置信息
      * */
      getPjszInfo() {
        let query = {
          xxdm: this.xxdm
        };
        getPjszInfo(query).then(response => {
          if(response.resultCode == 1) {
            this.form = response.value || {
              sffdx: '0', // 是否短信通知家长
              sffjz: '1', // 是否发放奖章
              jlid: ''
            };

            let url = this.tplj + response.value.path;
            this.fileList = [{
              name: '',
              url,
              path: response.value.path
            }];
          } else {
            this.$message({
              message: response.resultMessage,
              type: 'warning'
            });
          }
        })
      },
      /*
      * 获取图片域名
      * */
      getDomainImg() {
        let param = {
          xxdm: this.xxdm
        };

        ck(param).then(response => {
          this.tplj = response.tplj;
          this.getPjszInfo();
        })
      },
      save() {
        let query = {
          xxdm: this.xxdm,
          cjr: this.userid,
          jlid: this.form.jlid,
          sffdx: this.form.sffdx,
          sffjz: this.form.sffjz,
          path: this.fileList[0].path
        };

        savePjsz(query).then(response => {
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
      beforeAvatarUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if(!isLt1M) {
          this.$message({
            message: '请上传小于1M的图片',
            type: 'warning'
          });
        }
        return isLt1M;
      },
      handleChange(file) {
        this.fjid = file.uid
      },
      handleSuccess(response) {
        let url = this.tplj + response.data[0].path;
        this.fileList = [{
          name: '',
          url,
          path: response.data[0].path
        }];
        this.$refs.newupload.clearFiles();//清空图片
      },
      handlePicturePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>

<style scoped>

</style>
