<template>
    <div class="app-container calendar-list-container">
    <div class="u_TableMain">
        <div class="filter-container">
            <el-button type="primary" icon="el-icon-upload2" @click="drsj">导入</el-button>
            <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">清空</el-button>
        </div>

        <el-table class="cusMiniScroll" :key='tableKey' v-loading.body="listLoading" :data="contentList" border fit highlight-current-row style="width: 100%" height="650">
            <el-table-column label="课程名称" fixed width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.bjmc}}</span>
                </template>
            </el-table-column>
            <el-table-column v-for="item in kcList" :key="item.uuid" :label="item.kcmc" width="150">
                <template slot-scope="scope">
                    <div class="selBox">
                        <div class="selBox-input">
                            <input autocomplete="off" v-model="scope.row[item.uuid].rkjs" placeholder="" size="" readonly="readonly" type="text" rows="2" class="el-input__inner" @click="handerCilck(item.uuid,scope.$index,scope.row[item.uuid],scope.row)">
                        </div>
                    </div>
                    <!-- <el-select v-model="scope.row[item.uuid].rkjs" filterable clearable placeholder="" @click="handerCilck(item.uuid,scope.$index)"></el-select> -->
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog title="请选择教师" :visible.sync="dialogFormVisible" width="500px">

        <div class="selCourseTeach">
            {{curBjObj.bjmc}} - {{curKcObj.kcmc}} 任课老师：
            <div class="tagTeacher">
                <el-tag :key="tag" v-for="(tag,index) in mp" closable :disable-transitions="false" @close="delTeacher(index)">
                    {{tag}}
                </el-tag>
            </div>
            <div v-if="mp.length==0" class="tagNull">暂无任课老师</div>
        </div>

        <div class="searchBox">
            <i class="el-icon-search"></i>
            <el-input size="mini" v-model="searchKey" class="searchTeach" clearable placeholder="输入关键字查询教师" @clear="clearSearch"></el-input>
        </div>

        <div class="allTeacherList cusMiniScroll">
            <div class="unitTeacherBox" @click="addTeacher(item)" v-for="(item,index) in jsList" :key="item.gh" v-if="!item.isCheck">{{item.xm}}</div>
            <div class="noTeacher" v-if="jsListShowNum==0">无教师数据</div>
        </div>


        <!-- <el-select v-model="mp" multiple filterable clearable placeholder="" @change="handleChangeSel(mp)">
            <el-option v-for="item in jsList" :key="item.gh" :label="item.xm" :value="item.gh"></el-option>
        </el-select> -->


    </el-dialog>
    <!--导入界面-->
    <el-dialog title="导入数据" :visible.sync="dialog_1" width="540px" class="import_box">
        <el-row>
            <el-col :span="6" style="line-height:32px;margin-bottom:50px;">
            文件选择：
            </el-col>
            <el-col :span="18">
            <el-upload class="upload-demo"
                        :action="importUrl"
                        :name ="name"
                        :headers="importHeaders"
                        :multiple="false"
                        :data = "{code:this.code}"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-upload="beforeUpload"
                        :on-error="uploadFail"
                        :on-success="uploadSuccess"
                        :file-list="fileList"
                        :limit=1
                        ref="upload"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" @click="xzwj">选取文件</el-button>
            </el-upload>
            </el-col>
        </el-row>
        <el-row>
            导入失败数据详情：
            <el-table
            :data="errData"
            style="width: 100%;max-height: 200px;
                        overflow-y: scroll;">
            <el-table-column
                prop="kcmc"
                label="课程">
            </el-table-column>
            <el-table-column
                prop="bj"
                label="班级">
            </el-table-column>
            <el-table-column
                prop="xm"
                label="教师">
            </el-table-column>
            <el-table-column
                prop="errMsg"
                label="错误信息">
            </el-table-column>
            </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" type="primary" @click="submitUpload" :loading="importLoading">导入</el-button>
            <el-button size="medium" @click="cancel_dr">取 消</el-button>
            <el-button size="medium" @click="download">模版生成
            <i class="el-icon-download"></i>
            </el-button>

            <el-row class="import_desc">
            <el-col :span="7" style="line-height:57px">
                操作说明：
            </el-col>
            <el-col :span="17">
                <p>1.请使用本页面提供的模版进行导入</p>
                <p>2.请勿修改模版Excel的表头内容</p>
                <p>3.模版提供的默认信息，请勿随意修改</p>
            </el-col>
            </el-row>
        </div>
    </el-dialog>
    </div>

</template>
<script>
// import _ from 'loadsh';
import { getToken } from 'utils/auth';
import {
    teachclassAll,
    addObj,
    delObj,
    delAllObj,
    getTemplateUrl
} from 'api/admin/teachclass/index'
// import { dqxnxqObj } from 'api/admin/acadyear/index'
export default {
  name: 'teachclass',
  data() {
    return {
      mp: [],
      mpindex: '',
      mpkcid: '',
      mplist: [],


      xxdm: '',
      dqxn: '',            // 当前学年
      dqxq: '',            // 当前学期
      listLoading: true,                      // 加载
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },

      tableKey: 0,                            // 表格
      list: null,
      total: null,


      dialogFormVisible: false,               // 弹层是否显示
      dialogStatus: '',
      textMap: {                              // 判断弹层是添加还是编辑
        update: '编辑',
        create: '创建'
      },
      tabPosition: 'left',
      form: {},                                // 表单
      bjList: [],
      kcList: [],
      jsList: [],
      jskcbjList: [],
      contentList: [],
      createform: [],

      selallGh: [],
      dialog_1: false,
      errData: [],
      importUrl: '/api/base/jcRkjssz/importExcel',
      importHeaders: {
        enctype: 'multipart/form-data',
        Authorization: getToken()
      },
      code: 'teachclassManager',
      name: 'upfile',
      fileList: [],
      importLoading:false,
      curBjObj:Object,
      curKcObj:Object,
      teacherTages:[],                      //当前教师Tags列表
      backJsList:[],                        //教师列表备份数组
      searchKey:"",                         //搜索的关键字
      jsListShowNum:0,                      //可以看见的教师的数量
    }
  },
  mounted() {

    this.xxdm = window.localStorage.getItem('xxdm');

    this.getList()
  },
  watch: {
      searchKey(val,oldval){
          console.log(val,207)
          console.log(this.backJsList,208)
          if(val==""){
              this.jsList =  $.extend(true,[],this.backJsList);
          }else{
            this.jsList = _.filter(this.backJsList,function(o){
                return !(o.xm.indexOf(val)==-1)
            })
          }
          this.jsListSign();
      }
  },
  methods: {
    getList() {
      this.contentList = [];
      this.listLoading = true;
      teachclassAll({ xxdm: this.xxdm }).then(response => {
        this.list = response.data;
        this.bjList = response.data.bjList;
        this.kcList = response.data.kcList;
        this.jsList = response.data.jsList;
        this.backJsList = $.extend(true,[],this.jsList);
        this.jskcbjList = response.data.jskcbjList;
        this.jsMap = response.data.jsMap;

        for (let i = 0; i < this.bjList.length; i++) {
          const course = {};
          course.bjmc = this.bjList[i].bj;
          course.bjid = this.bjList[i].uuid;

          for (let j = 0; j < this.kcList.length; j++) {
            const conlist = {};
            conlist.kcid = this.kcList[j].uuid;
            conlist.kcmc = this.kcList[j].kcmc;
            conlist.rkjs = '';
            conlist.rkjsgh = '';
            course[this.kcList[j].uuid] = conlist;
          }
          for (let h = 0; h < this.jskcbjList.length; h++) {
            if (this.jskcbjList[h].bjid === this.bjList[i].uuid && this.kcList.length > 0) {
              if(course[this.jskcbjList[h].kcid]){
                course[this.jskcbjList[h].kcid].rkjsgh = this.jskcbjList[h].gh
                course[this.jskcbjList[h].kcid].rkjs = this.jskcbjList[h].rkjsxm
              }
            }
          }
          this.contentList.push(course);
        }
                // console.log(this.contentList)
        this.listLoading = false;
      })
    },
    handleChange(kcid, gh, ind) {
      this.createform = {};
      this.createform.kcid = kcid;
      this.createform.kcmc = this.contentList[ind][kcid].kcmc;
      this.createform.bjid = this.contentList[ind].bjid;
      this.createform.bjmc = this.contentList[ind].bjmc;
      this.createform.gh = gh;
      this.createform.xxdm = this.xxdm;
      this.createform.rkjsxm = this.jsMap[gh];

      if (gh) {
        addObj(this.createform).then(res => {
          if (res.status === 200) {
            this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 });
            this.updataRender(gh,'add');
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
          }
        });
      }

    },
    handleChangeDel(kcid, gh, ind) {
      this.createform = {};
      this.createform.kcid = kcid;
      this.createform.kcmc = this.contentList[ind][kcid].kcmc;
      this.createform.bjid = this.contentList[ind].bjid;
      this.createform.bjmc = this.contentList[ind].bjmc;
      this.createform.gh = gh;
      this.createform.xxdm = this.xxdm;
      this.createform.rkjsxm = this.jsMap[gh];

      if (gh) {
        delObj(this.createform).then(res => {
          if (res.status === 200) {
            this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
            this.updataRender(gh,'del');
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
          }
        });
      }
    },
    handleCreate() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAllObj({ xxdm: this.xxdm }).then(res => {
          if (res.status === 200) {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({ title: '成功', message: '清空成功', type: 'success', duration: 2000 });
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
          }
        });
      }).catch(e => {
                    // console.log(e)
      });
    },
    handerCilck(kcid, index, item, row) {
      this.jsList = $.extend(true,[],this.backJsList);
      this.mp = item.rkjs ? item.rkjs.split(',') : [];
      this.mplist = item.rkjsgh ? item.rkjsgh.split(',') : [];
      this.searchKey = "";
            // this.mp = item.rkjs;
            //  this.contentList[index].bjid;   //班级id
      this.dialogFormVisible = true
            // this.contentList[index][kcid].rkjs
      this.curBjObj = row;
      this.curKcObj = item;
      this.mpindex = index;
      this.mpkcid = kcid;
      this.jsListSign();
    },
    delclick(kcid, index) {
      this.contentList[index][kcid].rkjsgh = '';
      this.contentList[index][kcid].rkjs = '';
      this.handleChange(kcid, '', index)
    },
    handleChangeSel(gh) {
      let diffgh = [];
      if (this.mplist.length < gh.length) {           // 增加
        diffgh = _.differenceWith(gh, this.mplist, _.isEqual)
        this.handleChange(this.mpkcid, diffgh[0], this.mpindex)
      } else if (this.mplist.length > gh.length) {
        diffgh = _.differenceWith(this.mplist, gh, _.isEqual)
        this.handleChangeDel(this.mpkcid, diffgh[0], this.mpindex)
      }

      const ghxm = [];
      if (gh.length > 0) this.contentList[this.mpindex][this.mpkcid].rkjsgh = gh.join();
      for (const i in gh) {
        ghxm.push(this.jsMap[gh[i]])
      }
      if (gh.length > 0) this.contentList[this.mpindex][this.mpkcid].rkjs = ghxm.join();

      if (gh == 0) {
        this.contentList[this.mpindex][this.mpkcid].rkjsgh = '';
        this.contentList[this.mpindex][this.mpkcid].rkjs = '';
      }


      if (this.mplist != gh) {
        this.mplist = gh
      }


      this.selallGh = gh
    },
    /**
     * 删除任课老师
     * by:RayJ
     * time:2019-07-10
     */
    delTeacher(index){
        //参数说明：课程Id,教师工号,点击是哪个班级的index.
        this.handleChangeDel(this.mpkcid, this.mplist[index], this.mpindex)
    },

    /***
     * 新增任课老师
     * by:RayJ
     * time:2019-07-10
     */
    async addTeacher(item){
        //参数说明：课程Id,教师工号,点击是哪个班级的index.
        this.handleChange(this.mpkcid, item.gh, this.mpindex)
    },

    /**
     * 删除和新增后,更新显示状态
     */
    updataRender(gh,type){
        //用户存放姓名
        var ghxm = [];
        //为改变前的任课教师工号列表(字符串形式) 转成数组
        var rkjsgh_arr = [];
        //如果任课教师为空不转换数组
        if(this.contentList[this.mpindex][this.mpkcid].rkjsgh!=""){
            rkjsgh_arr = this.contentList[this.mpindex][this.mpkcid].rkjsgh.split(",");
        }
        //判断是添加还是删除
        if(type=='add'){
            //新的工号push到任课教师工号数组中
            rkjsgh_arr.push(gh);
            //对于课表的任课教师工号字段转成字符串并赋值
            this.contentList[this.mpindex][this.mpkcid].rkjsgh=rkjsgh_arr.join();
        }else if(type=='del'){
            //删除指定的工号
            rkjsgh_arr.splice(rkjsgh_arr.indexOf(gh),1);
            //对于课表的任课教师工号字段转成字符串并赋值
            this.contentList[this.mpindex][this.mpkcid].rkjsgh=rkjsgh_arr.join();
        }
        //根据新的工号数组,生成一个新的教师姓名数组
        for (const i in rkjsgh_arr) {
            ghxm.push(this.jsMap[rkjsgh_arr[i]])
        }
        //生成完毕后赋值
        this.contentList[this.mpindex][this.mpkcid].rkjs = ghxm.join();

        //如果删到最后没有任课教师..清空工号列表和姓名列表
        if (rkjsgh_arr.length == 0) {
            this.contentList[this.mpindex][this.mpkcid].rkjsgh = '';
            this.contentList[this.mpindex][this.mpkcid].rkjs = '';
        }
        //更新弹层上显示的tag
        this.mp = ghxm;
        this.mplist = rkjsgh_arr;
        this.jsListSign();
    },

    /**
     * 清空搜索内容重置教师列表
     * by:RayJ
     * time:2019-07-10
     */
    clearSearch(){
        this.jsList = $.extend(true,[],this.backJsList);
    },

    /**
     * 给已经选中的老师打上标识
     * by:RayJ
     * time:2019-07-10
     */
    jsListSign(){
        console.log(this.mplist,442);
        for(var j=0;j<this.jsList.length;j++){
            this.jsList[j].isCheck=false;
        }
        for(var i=0;i<this.mplist.length;i++){
            var index = _.findIndex(this.jsList,{'gh':this.mplist[i]});
            if(index!=-1){
                this.$set(this.jsList[index],"isCheck",true);
            }
        }

        this.jsListShowNum = _.reject(this.jsList,{"isCheck":true}).length;
        //console.log("jsListShowNum="+this.jsListShowNum);

    },

    cancel() {
      console.log();
    },
    create() {
      const selalljsxm = [];
      let selalljsxmobj = '';
      let selallGhobj = '';


      for (const j in this.selallGh) {
        selalljsxm.push(this.jsMap[this.selallGh[j]])
                // this.handleChange(this.mpkcid,this.selallGh[j],this.mpindex)
      }
      if (this.selallGh.length > 0) selalljsxmobj = selalljsxm.join();
      if (this.selallGh.length > 0) selallGhobj = this.selallGh.join();

      this.contentList[this.mpindex][this.mpkcid].rkjsgh = selallGhobj;
      this.contentList[this.mpindex][this.mpkcid].rkjs = selalljsxmobj;
    },
    // 导入界面
    drsj() {
      this.dialog_1 = true;
    },
    // 导入文件移除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview() {
      // 可以通过 file.response 拿到服务端返回数据
    },
    clearFile() {
      // 清空选择的文件
      this.$refs.upload.clearFiles();
    },
    // 导入前
    beforeUpload(file) {
      this.importLoading = false;
      // 上传前配置
      const excelfileExtend = '.xls,.xlsx';// 设置文件格式
      const fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (excelfileExtend.indexOf(fileExtend) <= -1) {
        this.$notify({
          title: '提示',
          message: '上传模版只支持xlsx格式',
          type: 'info',
          duration: 2000
        });
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error('上传模板大小不能超过 10MB！');
        return false
      }
      this.uploadTip = '正在处理中...'
      this.processing = true
    },
    submitUpload(file) {
      // console.log(file,382)
      if(this.$refs.upload.uploadFiles.length<1){
        this.$message.error('请选择导入文件');
        return
      }
      //console.log(this.$refs.upload,383)
      this.$refs.upload.submit();
    },
    // 上传错误
    uploadFail(err, file) {
      const errmessage = JSON.parse(err.message);
      this.$message.error(errmessage.message);
    },
    // 上传成功
    // 上传成功后的回调
    uploadSuccess(response, file, fileList) {
      if (response.status == 200) {
        if (response.data.errMsgList && !response.data.errMsgList.length) {
          this.$message({
            message: '导入成功',
            type: 'success'
          });
          this.importLoading = false;
          this.importCjFormVisible = false;
          this.fileList = [];
          this.getList({
            xxdm: this.xxdm,
            page: 1,
            limit: this.listQuery.limit
          });
          this.dialog_1 = false;
          return;
        }
        this.$message({
          message: '数据导入失败',
          type: 'warning'
        });
        this.errData = response.data.errMsgList;
        this.importLoading = false;
        this.importCjFormVisible = true;

        this.fileList = [];
        this.getList({
          xxdm: this.xxdm,
          page: 1,
          limit: this.listQuery.limit
        });
      } else {
        this.fileList = [];
        this.errData = [];
        this.importLoading = false;
        this.$message({
          message: response.message,
          type: 'error'
        });
      }
    },
    cancel_dr() {
      this.dialog_1 = false;
      this.clearFile();
      this.getList();
    },
    xzwj() {
      this.clearFile();
    },
    // 下载模板
    download() {
      // 调用后台模板方法,和导出类似
      getTemplateUrl().then(response => {
        const blob = new Blob([response], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '教师任课设置模板.xlsx'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    }

  }
}
</script>
<style lang="scss" scoped>
    .filter-container .filter-item{ vertical-align: inherit;}
    .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
    .el-checkbox+.el-checkbox{margin-left: 0;}
    .el-checkbox{ margin-right: 30px;}

    .line{ text-align: center;}

    .selBox{display: inline-block; position: relative;}
    .selBox-input{position: relative; font-size: 14px;display: block;width: 100%;}
    .selBox .el-input__inner{ cursor: pointer;}
    .selBox .el-input__icon{ display: none;}
    .selBox:hover .el-input__icon{ display: block;}


    .keyspan{ height: 40px; line-height: 40px; width: 100%; display: block; border: 1px solid #c0c4cc;}
    .el-dialog__body .el-select{ display: block; margin-right: 100px}

    .import_box  .import_body {
      overflow: hidden;
    }
    .import_box .import_desc {
      overflow: hidden;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      text-align: left;
    }
    .el-col-6 {
      width:15%;
    }

    .selCourseTeach{
        width: 100%;
        font-size: 16px;
        line-height: 24px;
        min-height: 70px;
        border-bottom: 1px dotted #f8f8f8;
        position: relative;
        .tagTeacher{
            width: 100%;
            /deep/ .el-tag{
                margin-top: 10px;
                margin-right:10px;
            }
        }
        .tagNull{
            position: absolute;
            bottom: 0;
            padding-top: 15px;
            line-height: 30px;
            color: #999;
            font-size: 14px;
            width: 100%;
            text-align: center;
        }
    }
    .searchBox{
        padding-top: 10px;
        position: relative;
        i{
            position: absolute;
            display: inline-block;
            width:30px;
            height: 30px;
            text-align: center;
            line-height: 28px;
            font-size: 16px;
        }
        /deep/ input{
            text-indent: 10px;
        }
    }
    .allTeacherList{
        margin-top: 10px;
        width: 100%;
        max-height: 400px;
        overflow: auto;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        .unitTeacherBox{
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: #444;
            padding: 0 20px;
            width: 100%;
            cursor: pointer;
            transition: .2s ease-in-out;
        }
        .unitTeacherBox:hover{
            background: #ecf5ff;
        }
        .noTeacher{
            width: 100%;
            height: 100px;
            text-align: center;
            line-height: 100px;
            font-size: 14px;
            color: #999;
        }

    }

</style>
