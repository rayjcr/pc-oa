<template>
  <div id="app" class="app-container">

    <div class="u_TableMain">

      <div class="filter-container">
          <el-button type="primary" :disabled="changeSure"  @click="save" >保存</el-button>
          <el-button type="primary" :disabled="changeSure" @click="saveAdd" >保存并添加</el-button>
          <el-button type="primary" @click="handleGoback" >返回</el-button>
      </div>

      <div class="m_GenTableBox">
        <el-form :model="form"  ref="form"   label-width="150px">
          <el-form-item label="学年学期"     >
            {{xndm}}  {{xqmc}}
          </el-form-item>

          <el-form-item label="课程名称"     resetField :rules="[{ required: true, message: '课程名称不能为空'}]">
            <el-input   v-model="kcmc"  placeholder="请输入课程名称"  maxlength="35"></el-input>
          </el-form-item>

          <el-form-item label="课程类别"     style="width:500px"  :rules="[{ required: true, message: '课程类别不能为空'}]" >
            <el-select placeholder="请选择" v-model="kclb">
              <el-option v-for="item in  itemList_1" :key="item.lbid" :label="item.lbmc" :value="item.lbid">{{item.lbmc}} </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="授课教师"     :rules="[{ required: true, message: '授课教师不能为空'}]">
            <el-input placeholder="请选择老师" :readonly="true"  v-model="skr"   @focus="selTeacher"><i slot="suffix" class="el-input__icon el-icon-more"></i></el-input>
          </el-form-item>

          <el-form-item label="授课日期">
            <el-alert
              style="margin: 4px 0 !important;"
              title=" 温馨提示：修改授课日期将清空授课时间地点"
              type="warning"  show-icon>
            </el-alert>
            <el-date-picker v-model="skksrq" type="date" :picker-options="pickerStartOptions" placeholder="选择日期"  @change = "resetDate" ></el-date-picker>
            <span class='padding_transverse_10'>至</span>
            <el-date-picker v-model="skjsrq" type="date" :picker-options="pickerEndOptions" placeholder="选择日期"   ></el-date-picker>

          </el-form-item>


          <el-form-item label="授课时间/地点"  prop="sksjlist" >
            <el-button icon="el-icon-setting" type="primary" @click="settime" round>设置</el-button>

            <div class="oarow" >

              <div class="skTit">
                <div class="skLeft">授课时间(星期/节次)</div>
                <div class="skRight">授课地点</div>
              </div>
              <div class="skCont">
                <div class="skLine"   v-for="(item,index) in sksjlist" :key="index" >
                  <div class="skLeft">星期{{item.week|capitalize}}第{{item.section}}节</div>
                  <div class="skRight">
                    <el-select v-model="item.cdid" placeholder="请选择授课地点" @change="checkCdxx(index)">
                      <el-option label="请选择授课地点" value="">请选择授课地点</el-option>
                      <el-option
                        v-for="index in cdxxlist"
                        :key="index.cdid"
                        :label="index.cdmc"
                        :value="index.cdid">
                        {{index.cdmc}}
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>

          </el-form-item>

          <el-form-item label="授课对象">
            <el-button icon="el-icon-setting" type="primary" round  @click="setbj" >设置</el-button>
            <div class="oarow skdxmain" >

              <div class="skLine"    v-for="(item,index) in njSet"  v-if="item.checkedArr.length>0"    :key="index" >
                <div class="skLeft skdx">{{item.title}}:</div>
                <div class="skRight skdx" >

                              <span v-for=" bjdmitem  in  item.checkedArr "  :key="bjdmitem" class='padding_transverse_10'>
                                  <span v-for=" bj  in  item.bjxx "   v-if="bj.bjdm==bjdmitem "    :key="bj.bjdm"  class='padding_transverse_10'>{{bj.bjmc}}</span>
                            </span>
                </div>
              </div>

            </div>
          </el-form-item>

          <el-form-item label="限制人数"    :rules="[{ required: true, message: '限制人数不能为空'}]">
            <el-input  v-model="xzrs"    maxlength="6"     style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span>
            <span>最低人数</span><el-input   v-model="zdrs"   maxlength="6"  style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span>
            <span>每个年级限报人数</span><el-input  v-model="njxbrs" maxlength="6" style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span>
            <span>每个班级限报人数</span><el-input  v-model="bjxbrs" maxlength="6" style="width:55px;margin:0 5px;"></el-input><span>人</span>
          </el-form-item>

          <el-form-item label="性别限制">
            <el-radio v-model="xbxz" label="0" >无限制</el-radio>
            <el-radio v-model="xbxz" label="1">男</el-radio>
            <el-radio v-model="xbxz" label="2">女</el-radio>
          </el-form-item>
          <!--编辑器begin  -->
          <el-form-item label="课程简介">
            <el-input
              maxlength="450"
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="kcjj">
            </el-input>
          </el-form-item>

          <el-form-item label="相关图片">
            <el-upload
              name="file"
              ref="newupload"
              :on-change="beforeUpload"
              :on-success="handleSuccess"
              accept=".jpg,.png"
              action="/api/course/kcxx/sctpS"
              :headers="importHeaders"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <!--编辑器end  /test/kcxx/sctp -->
<!--          <el-form-item label="是否收费" >
            <el-radio v-model="sfsf" label="0">否</el-radio>
            <el-radio v-model="sfsf" disabled label="1">是</el-radio>
          </el-form-item>
          <el-form-item label="收费金额" v-if="sfsf==1">
            <el-input-number  v-model="sfje" controls-position="right" :min="1" :max="99999" :step="0.5" ></el-input-number><span>元</span>
          </el-form-item>
          <el-form-item label="收费说明" v-if="sfsf==1">
            <el-input
              maxlength="450"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="sfsm">
            </el-input>
          </el-form-item>-->
        </el-form>
      </div>

    </div><!--view结尾-->

     <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog title="教师名单" :visible.sync="dialog_1" width="870px">
      <el-row>
        <el-button type="primary" @click="qdTea">确定</el-button>
        <el-button type="primary" @click="cancelTea">取消</el-button>

        <el-input placeholder="查询老师" style="float:right; width:200px;"  v-model="teaxm"  ><i slot="suffix" class="el-input__icon el-icon-search" @click="searchTea" ></i></el-input>
      </el-row>
      <div class="teachListAZ">
        <el-collapse v-model="activeName">
          <el-collapse-item v-for="(item,index) in dataSet" :key="index" :name="index" class="collapseItem">
            <template slot="title">
              {{item.title}}({{item.checkedArr.length}}/{{item.total}})
            </template>
            <div class="teachcheckList">
              <el-checkbox-group v-model="item.checkedArr" >
                <el-checkbox v-for="(teacher,i) in item.teachers" :key="(index + i)"  :jsxm="teacher.xm"   :label="teacher.zgh?teacher.zgh:teacher.ename">{{teacher.xm}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>

    <el-dialog title="班级名单" :visible.sync="dialog_3" width="870px">
      <el-row>
        <el-button type="primary" @click="qdBj">确定</el-button>
        <el-button type="primary" @click="cancelTea">取消</el-button>
        <el-input placeholder="请输入班级名称" style="float:right; width:200px;"  v-model="bjmc"  ><i slot="suffix" class="el-input__icon el-icon-search" @click="searchBj" ></i></el-input>
      </el-row>
      <div class="teachListAZ">
        <el-collapse v-model="activeName">
          <el-collapse-item v-for="(item,index) in njSet"  v-if="item.bjxx.length>0"   :key="index" :name="index" class="collapseItem">
            <template slot="title">
              {{item.title}}({{item.checkedArr.length}}/{{item.bjxx.length}})
            </template>
            <div class="teachcheckList">
              <el-checkbox-group v-model="item.checkedArr">
                <el-checkbox v-for="(bj ) in item.bjxx " :key="bj.bjdm" :label="bj.bjdm">{{bj.bjmc}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>

    <el-dialog title="选择时间" :visible.sync="dialog_2" width="870px">
      <table class='selTeachTime' id='selTeachTime' cellpadding="0" cellspacing="0">
        <tr>
          <th></th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th><th>周日</th>
        </tr>
        <tr v-for="i in 9"  :key="i" >
          <th>
            第{{i|capitalize2}}节
          </th>
          <td v-for="index in 7"  :key="index"    @click="addClassFun(i,index,$event)"  class=""  ></td>
        </tr>
      </table>
    </el-dialog>


  </div>
</template>

<script>
  import { getToken } from 'utils/auth';
  import $ from 'jquery'
  import { quillEditor } from 'vue-quill-editor'
  import { getAll,saveaddkcxx ,newPicture,checkCdxx } from 'api/xkxt/kcxxManager/index'
  import {dqxnxqObj } from 'api/xkxt/specialRaw/index'
  export default {
    name: 'App',
    components: {
      quillEditor
    },
    data: function () {
      return {
        userid: "",
        form: {},//表单
        dataSet: [],
        njSet: [],
        teaxm: '',//教师姓名筛选
        bjmc: '',//班级筛选
        itemList_1: [],//课程类别
        jsxxlist: [],//教师列表
        cdxxlist: [],//场地信息
        njxxlist: [],//年级列表
        bjxxlist: [],//班级列表
        kclb: "",
        textarea_1: "",
        dialog_1: false,
        dialog_2: false,
        dialog_3: false,
        dialog_4: false,
        dialog_5: false,
        activeName: 1,
        checklist_2: [],
        checklist_3: [],
        checklist_4: ['选中且禁用'],
        checkedList_1: [],//选中的老师职工号数组
        moreset: false,
        content: '<h2>I am Example</h2>',
        editorOption: {},//初始化对象
        dialogImageUrl: '',  //图片上预览
        dialogVisible: false,//图片上传1
        changeSure: false,   //防止重复提交
        xndm: '',
        xqdm: '',
        xxdm: '',
        sksjlist: [],//授课时间
        skdxlist: [],//授课时间
        skrlist: [],//授课人
        kcdm: '',
        skr: "",//授课教师名字
        kcmc: "",
        skksrq: new Date(),//授课开始时间
        skjsrq: "",//授课结束时间
        xzrs: "",
        zdrs: "",
        njxbrs: "",
        bjxbrs: "",
        xbxz: "",
        kcjj: "",
        tempfjid: "",//临时附件id
        dataImgArr: [],
        submitImgArr: [],
        xqmc: "",
        importHeaders: {
          enctype: 'multipart/form-data',
          Authorization: getToken()
        },
        sfsf: "0",
        sfje: "",
        sfsm: "",
        pickerStartOptions: {
          disabledDate: time => time.getTime() < Date.now()- 8.64e7
        },
        pickerEndOptions: {
          disabledDate: time => time.getTime() < this.skksrq- 8.64e7
        },
        avliableWeek:[]
      }
    },
    filters: {
      //页面数据处理
      capitalize: function (value) {
        const arr = ["","一","二","三","四","五","六","日"];
        return arr[value];
      },
      capitalize2: function (value) {
        const arr = ["","一","二","三","四","五","六","七","八","九"];
        return arr[value];
      }
    },
    mounted: function(){

    },
    created(){
      this.userid= window.localStorage.getItem("userid");
      this.xbxz="0";//默认性别限制为0
      this.kcdm=this.guid();
      this.xxdm = window.localStorage.getItem("xxdm");
      dqxnxqObj({xxdm: this.xxdm}).then(response => {

        this.xndm = response.data.xn;//当前学年
        this.xqdm = response.data.xq;//当前学期
        this.skjsrq=response.data.gzjssj;
        if(  this.xqdm=="01"){
          this.xqmc="上学期";
    }else{
      this.xqmc="下学期";
  }
  let param={
    xxdm:this.xxdm,
    xndm:this.xndm,
    name:this.teaxm,
    bjmc:this.bjmc
  }
  this.getTea(param);
  })
    },
    methods:{
      resetDate: function(){
        if(this.skksrq>this.skjsrq){
          this.skjsrq = '';
        }
        this.sksjlist=[];
        $(".selTeachTime td").each(function(){
          $(this).removeClass("ck");
        })

      },
      addClassFun: function(section_s,weeks_s,e) {
        let classname= e.target.getAttribute("class");
        let sksj =[];
        if(classname===""||classname==null){
          if(this.avliableWeek.has(weeks_s)){
            e.target.setAttribute("class","ck");
            sksj =this.sksjlist;
            sksj.push({week:weeks_s,section:section_s,xxdm:this.xxdm,kcdm:this.kcdm});
          }else{
            this.$message.error("不可选择周"+weeks_s);
          }
        }else{
          e.target.setAttribute("class","");
          for (var i = 0; i <  this.sksjlist.length ;i++) {
            let map= this.sksjlist[i];
            if(weeks_s==map.week&&section_s==map.section){

            }else{
              sksj.push(map);
            }
          }
        }
        this.sksjlist= _.sortBy(sksj, ['week', 'section']);
      },
//上传图片成功
      handleSuccess: function (response, file, fileList) {
        // console.log(response.data[0].path);
        let path_=response.data[0].path;
        let parm={
          fjid:this.tempfjid,
          path:path_,
          kcdm:this.kcdm,
          xxdm:this.xxdm
        }
        this.submitImgArr.push(parm);

      },

      beforeUpload (file) {
        this.tempfjid=file.uid;
      },
      //===================================
      handleRemove(file, fileList) {//删除图片
        console.log(file.uid);
        console.log(fileList);
        let del_id=file.uid;

        this.dataImgArr=[];
        for (var i = 0; i <  this.submitImgArr.length ;i++) {
          let map= this.submitImgArr[i];
          let fjid=map.fjid;
          if(fjid!=del_id){
            dataImgArr.push(map);
          }
        }
        this.submitImgArr= this.dataImgArr;


      },
      handlePictureCardPreview(file) {//预览
        console.log( file.url);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // ================================
      //保存并添加
      saveAdd(){
        this.changeSure=true;
        let parm={
          cjr:this.userid,
          kcdm: this.kcdm,
          kclb:this.kclb,
          kcmc:this.kcmc,
          skr:this.skr,
          xzrs:this.xzrs,
          zdrs:this.zdrs,
          njxbrs:this.njxbrs,
          bjxbrs:this.bjxbrs,
          xbxz:this.xbxz,
          kcjj:this.kcjj,
          xndm: this.xndm,
          xqdm: this.xqdm,
          xxdm: this.xxdm,
          sksjlist:this.sksjlist,
          skdxlist:this.skdxlist,
          skrlist:this.skrlist,
          submitImgArr:this.submitImgArr,
          sfsf: this.sfsf,
          sfje: this.sfje,
          sfsm: this.sfsm

        }
        parm.skksrq = this.workTime(this.skksrq);
        parm.skjsrq = this.workTime(this.skjsrq);

        if(this.checksave()) {

          this.changeSure=true;
          saveaddkcxx(parm).then((res) => {
            if (res.status == '200') {
              this.$notify({ title: '添加成功', message: '课程添加成功', type: 'success', duration: 2000 });
              this.kcmc=""; this.kcdm=this.guid();
              this.kclb="";
              this.skr="";
              this.zdrs="";
              this.xzrs="";
              this.njxbrs="";
              this.bjxbrs="";
              this.xbxz="0";
              this.sksjlist=[];
              this.skdxlist=[];
              this.skrlist=[];
              this.teaxm="";
              this.bjmc="";
              this.skksrq="";
              this.skjsrq="";
              this.submitImgArr=[];
              this.sfsf = '0';
              this.sfje = '';
              this.sfsm = '';
              $(".ck").removeClass();
              this.$refs.newupload.clearFiles();//清空图片

              let param={
                xxdm:this.xxdm,
                xndm:this.xndm,
                name:this.teaxm,
                bjmc:this.bjmc
              }
              this.getTea(param);
              this.changeSure=false;

            }else{
              this.changeSure=false;
              this.$notify({ title: '添加失败', message: res.message, type: 'error', duration: 2000 });
            }
          })
        }
      },
      //保存
      save(){
        this.changeSure=true;
        let parm={
          cjr:this.userid,
          kcdm: this.kcdm,
          kclb:this.kclb,
          kcmc:this.kcmc,
          skr:this.skr,
          xzrs:this.xzrs,
          zdrs:this.zdrs,
          njxbrs:this.njxbrs,
          bjxbrs:this.bjxbrs,
          xbxz:this.xbxz,
          kcjj:this.kcjj,
          xndm: this.xndm,
          xqdm: this.xqdm,
          xxdm: this.xxdm,
          sksjlist:this.sksjlist,
          skdxlist:this.skdxlist,
          skrlist:this.skrlist,
          submitImgArr:this.submitImgArr,
          sfsf: this.sfsf,
          sfje: this.sfje,
          sfsm: this.sfsm
        }
        parm.skksrq = this.workTime(this.skksrq);
        parm.skjsrq = this.workTime(this.skjsrq);
        if(this.checksave()) {
          saveaddkcxx(parm).then((res) => {
            if (res.status == '200') {
              this.$notify({ title: '添加成功', message: '课程添加成功', type: 'success', duration: 2000 });

              this.$router.push('/auditKcxx/kcxxManager');

            }else{
              this.changeSure=false;
              this.$notify({ title: '添加失败', message: res.message, type: 'error', duration: 2000 });
            }

          })
        }
      },
      checksave(){

        if( this.kcmc==""||this.kcmc==null){
          this.$message.error("课程名称不能为空");
          this.changeSure=false;
          return false;
        }
        if( this.kclb==""){
          this.$message.error("请选择课程类别");
          this.changeSure=false;
          return false;
        }
        if(this.skr===""){
          this.$message.error("请选择授课教师");
          this.changeSure=false;
          return false;
        }
        if( !this.skksrq){
          this.$message.error("请选择授课开始日期");
          this.changeSure=false;
          return false;
        }
        if( !this.skjsrq){
          this.$message.error("请选择授课结束日期");
          this.changeSure=false;
          return false;
        }
        let startime=this.workTime(this.skksrq);
        let endtime=this.workTime(this.skjsrq);
        if(startime>endtime){
          this.$message.error("授课结束日期需大于开始日期");
          this.changeSure=false;
          return false;
        }

        if( this.sksjlist.length===0){
          this.$message.error("请选择授课时间");
          this.changeSure=false;
          return false;
        }
        if( this.skdxlist.length===0){
          this.$message.error("请选择授课对象");
          this.changeSure=false;
          return false;
        }
        var reg=/^-?[1-9]+[0-9]*$/;


        if (!reg.test(this.xzrs)) {
          this.$message.error("限制人数只能为大于0的整数");
          this.changeSure=false;
          return false;
        }

        if(this.zdrs!=""&&!reg.test(this.zdrs)){
          this.$message.error("最低人数只能为空或大于0的整数");
          this.changeSure=false;
          this.changeSure=true;
          return false;
        }

        if(this.njxbrs!=""&&!reg.test(this.njxbrs)){
          this.$message.error("年级限报人数只能为空或大于0的整数");
          this.changeSure=false;
          return false;
        }

        if( this.bjxbrs!=""&&!reg.test(this.bjxbrs)){
          this.$message.error("班级限报人数只能为空或大于0的整数");
          this.changeSure=false;
          return false;
        }

        var xzrs=parseInt(this.xzrs);
        var zdrs=parseInt(this.zdrs);
        var njxbrs=parseInt(this.njxbrs);
        var bjxbrs=parseInt( this.bjxbrs);


        if(this.zdrs!=""&&zdrs-xzrs>0){
          this.$message.error("最低人数人数不能大于限制人数");
          this.changeSure=false;
          return false;
        }
        if(this.njxbrs!=""&&njxbrs-xzrs>0){
          this.$message.error("年级限报人数不能大于限制人数");
          this.changeSure=false;
          return false;
        }
        if(this.bjxbrs!=""&&bjxbrs-xzrs>0){
          this.$message.error("班级限报人数不能大于限制人数");
          this.changeSure=false;
          return false;
        }
        if(this.njxbrs!=""&&this.bjxbrs!=""&&njxbrs-bjxbrs<0){
          this.$message.error("年级限报人数不能小于班级限报人数");
          this.changeSure=false;
          return false;
        }
        if(this.sfsf==1&&(this.sfsm==""||this.sfje=="")){
          this.$message.error("费用金额及说明必填");
          this.changeSure=false;
          return false;
        }
        return true;
      },
      message(message) {
        this.$message.error(message);
      },
      // 表格中日期2000-01-01
      workTime(val){
        var d = new Date(val);              //时间戳
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var day = d.getDate();
        if(month<10) month = "0" + month;
        if(day<10) day = "0" + day
        return year + '-' + month + '-' + day
      },
      //搜索老师
      searchTea(){
        let param={
          xxdm:this.xxdm,
          xndm:this.xndm,
          name:this.teaxm,
          bjmc:this.bjmc
        }
        this.getTea(param);

      },
      //筛选老师
      getTea(param){
        this.dataSet=[];
        this.njSet=[];
        getAll(param).then(response => {//获取所有列表信息

          this.jsxxlist=response.jsxxlist;//教师列表
          this.itemList_1=response.kclblist;//课程类别
          this.cdxxlist=response.cdxxlist//场地信息
          this.njxxlist=response.njxxlist//年级列表
          this.bjxxlist=response.bjxxlist//班级列表


          //教师页面
          for (var index = 0; index <  response.jsxxtitle.length ;index++) {
            let map=response.jsxxtitle[index];
            let params={};
            params.title=map.ename;
            params.total=map.name;
            params.checkedArr=[];
            params.teachers=[];

            for (var i = 0; i <  this.jsxxlist.length ;i++) {
              let tea=this.jsxxlist[i];
              let zgh_=tea.zgh?tea.zgh:tea.ename;
              let xm_=tea.name;

              if(tea.fdm==map.ename){
                // console.log("1234")
                params.teachers.push({zgh:zgh_,xm:xm_});
              }
            }

            this.dataSet.push(params);
            // console.log(this.dataSet,888)
          }
          //班级页面处理
          for (var j = 0; j <  this.njxxlist.length ;j++) {
            let map=response.njxxlist[j];
            let params_={};
            params_.title=map.njmc;
            params_.njdm=map.njdm;


            params_.checkedArr=[];
            params_.bjxx=[];

            for (var k = 0; k < this.bjxxlist.length ;k++) {

              let bjmap=this.bjxxlist[k];
              let  bjdm_=bjmap.bjdm;
              let  njdm_=bjmap.njdm;
              let  bjmc_=bjmap.bjmc;

              if(njdm_==map.njdm){
                params_.bjxx.push({bjdm:bjdm_,bjmc:bjmc_,njdm:njdm_});
              }
            }
            this.njSet.push(params_);
          }

        })
      },
      // 返回
      handleGoback(){
        this.$router.push ({
          path: '/auditKcxx/kcxxManager'
        })
      },


      onEditorBlur(editor) {
        console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      },
      onEditorChange({ editor, html, text }) {
        console.log('editor change!', editor, html, text)
        this.content = html

      },
      //选择教师
      selTeacher(){
        this.dialog_1 = true;
      },
      //取消 选泽老师
      cancelTea(){
        this.dialog_1 = false;
        this.dialog_3 = false;
      } ,
      S4(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      },
      guid() {

        return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
      },

      //确定 选择老师
      qdTea(){
        this.dialog_1 = false;
        this.skr="";
        for (var j = 0; j <  this.dataSet.length ;j++) {
          let map=this.dataSet[j];
          let jsmap=map.teachers;
          let check_skr=map.checkedArr;//选中的授课人的zgh;
          if(check_skr.length>0){

            for (var k = 0; k <  jsmap.length ;k++) {

              for (var i = 0; i <  check_skr.length ;i++) {
                let param={};
                param.xxdm=this.xxdm;
                param.kcdm=this.kcdm;
                param.skr=check_skr[i];
                if(jsmap[k].zgh==check_skr[i]){
                  this.skr+=jsmap[k].xm+"  ";
                  this.skrlist.push(param);
                }
              }
            }
          }
        }
      } ,
      //确定班级
      qdBj(){
        this.dialog_3 = false;
        for (var j = 0; j <  this.njSet.length ;j++) {
          let njmap=this.njSet[j];
          let njdm=njmap.njdm;
          let njmc=njmap.title;
          let checkbj=njmap.checkedArr;
          let bjxx=njmap.bjxx;
          if(checkbj.length>0){
            for (var i = 0; i <  checkbj.length ;i++) {
              let param={};
              param.njmc=njmc;
              param.njdm=njdm;
              param.bjdm=checkbj[i];
              param.kcdm=this.kcdm;
              param.xxdm=this.xxdm;
              for (var k = 0; k <  bjxx.length ;k++) {
                if(checkbj[i]==bjxx[k].bjdm){
                  param.bjmc= bjxx[k].bjmc;
                  this.skdxlist.push(param);
                }
              }
            }
          }
        }
      },
      setbj(){
        this.dialog_3 = true;
      },
      //搜索
      searchBj(){
        let param={
          xxdm:this.xxdm,
          xndm:this.xndm,
          name:this.teaxm,
          bjmc:this.bjmc
        }
        this.getTea(param);
      },
      settime(){
        if(this.skksrq&&this.skjsrq){
          //判断在时间范围内的周数是否符合
          var beginDateObj = new Date(this.skksrq);
          var endDateObj = new Date(this.skjsrq);
          const weekSet = new Set();
          while (beginDateObj <= endDateObj) {
            let weekNum = beginDateObj.getDay();
            if (weekNum == 0) {
              weekNum = 7;
            }
            weekSet.add(weekNum);
            beginDateObj.setTime(beginDateObj.getTime() + 24 * 60 * 60 * 1000);
          }
          this.avliableWeek = weekSet;
          this.dialog_2 = true;
        }else{
          this.$message.error("请设置授课日期");
        }
      },
      moresetting(){
        if(this.moreset){
          this.moreset = false
        }else{
          this.moreset = true
        }
      },
      checkCdxx(index){
        const param = this.sksjlist[index];
        const cdid = param.cdid;
        if(cdid!=''){
          param.xxdm = this.xxdm;
          param.skksrq = this.workTime(this.skksrq);
          param.skjsrq = this.workTime(this.skjsrq);
          checkCdxx(param).then((res) => {
            if(res.status!=200||res.data.length>0){
              this.sksjlist[index].cdid = '';
              this.$message.error("当前授课时间范围内场地冲突，请修改场地");
            }
          })
        }
      }
    }
  }
</script>
<style scope>

  .teachListAZ{
    margin-top:20px;
    height:450px;
    overflow-y:scroll;
    overflow-x:hidden;
  }
  .collapseItem{
    border-bottom:1px solid #ccc;
  }
  .collapseItem .el-collapse-item__header{
    font-size:16px;
    padding-left:20px;
  }
  .collapseItem .el-collapse-item__content{
    padding:10px 20px;
    padding-bottom:10px;
  }
  .collapseItem:first-child,.el-collapse-item__header{
    background: linear-gradient(#FFF, #f3f3f3) !important;
  }
  .selNjStu .collapseItem:first-child,.selNjStu .el-collapse-item__header{
    background: #FFF !important;
    text-align:center;
    font-size:14px;
    font-weight: bold;
  }
  .selNjStu .el-collapse{
    border-top:none;
  }

  .selTeachTime{
    border-collapse: collapse;
    width:100%;
  }
  .selTeachTime td,.selTeachTime th{
    border:1px solid #e8e8e8;
    font-size:14px;
    text-align:center;
    line-height:35px;
    height:35px;
    width:12.5%;
    transition:.2s all;
  }
  .selTeachTime th{
    background:#f8f8f8;
  }
  .selTeachTime td.ck{
    background:#ffce39;
  }
  .selTeachTime td:hover{
    background:#f8f8f8;
    cursor:pointer;
  }
  .selTeachTime td.ck:hover{
    background:#ffce39;
  }

</style>
