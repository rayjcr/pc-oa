<template>
    <div class="app-container assignment">
        <div class="u_TableMain">
            <!-- <div class="pageTit">房间分配管理</div> -->
            <div class="filter-container pageHeaderContral">
                <el-input class="searchIpt" v-model="searchVal" placeholder="请输入内容"></el-input>
                <el-button class="searchBtn" type="primary" @click="searchAssign" icon="el-icon-search">搜索</el-button>
                <el-button class="addPlan" @click="addPlanFun" type="primary">添加方案</el-button>
            </div>
            <div class="m_GenTableBox">
                <div class="assignmentList">

                    <div class="nonePlan" v-show="planList.length==0">无任何方案~</div>

                    <div class="assignmentBox" v-for="(item,index) in planList">
                        <div class="assignName">{{item.name}}<em class="state"></em></div>
                        <div class="assignCreatTime">创建时间:{{item.createTime}}</div>
                        <div class="assignFunBox">
                            <el-button icon="el-icon-document" @click="importBatFun(item)" type="primary" size="mini" plain>批量导入人员</el-button>
                            <el-button icon="el-icon-document" @click="assignFun(item.id)" type="primary" size="mini" plain>调配人员</el-button>
                        </div>
                        <div class="assignContral">
                            <el-button icon="el-icon-edit" size="mini" @click="addPlanFun('modify',item,index)" type="primary">修改</el-button>

                            <el-popover v-show="item.status==0"
                                placement="top"
                                width="160"
                                v-model="popoverVisible[index]">
                                <p>确定要删除当前方案吗？</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="$set(popoverVisible,index,false)">取消</el-button>
                                    <el-button type="primary" size="mini" @click="delAssign(item.id,index)">确定</el-button>
                                </div>
                                <el-button  icon="el-icon-delete" size="mini" type="danger" slot="reference">删除</el-button>
                            </el-popover>


                            <!-- <el-button icon="el-icon-delete" size="mini" @click="delAssign(item.id)" v-show="item.status==0" >删除</el-button> -->
                            <el-button icon="el-icon-tickets" size="mini" @click="enablePlan(item.id)" :type="item.status==1?'info':'success'" :disabled="item.status==1?true:false">启用</el-button>
                        </div>
                    </div>

                </div>
                <div class="block pagination">
                    <el-pagination
                    @size-change="planSizeChange"
                    @current-change="planCurrentChange"
                    :current-page="curpage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-count="maxpage"
                    :total="maxcount">
                    </el-pagination>
                </div>
            </div>
        </div>

        <el-dialog :title="(isModify?'修改方案':'新建方案')" :visible.sync="newPlanVisible" width="540px" class="import_box">
            <el-form :model="form" ref="form" :rules="rules" label-width="100px" style="padding:0 8%;">
                <el-form-item label="方案名称" prop="planName" :rules="[{ required: true, message: '方案名称不能为空'}]">
                    <el-input v-model="form.planName" :maxlength="50"  placeholder="请输入方案名称"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="planRemarks">
                    <el-input v-model="form.planRemarks" :maxlength="50"  placeholder="请输入备注"></el-input>
                </el-form-item>
                <el-form-item label="复用方案" v-if="!isModify">
                    <el-select v-model="form.planid" placeholder="请选择">
                      <el-option v-for="(item,index) in allPlanList" :key="item.id" :label="item.name"
                                 :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-alert show-icon 
                    title="一次只能启用一个方案，调配方案针对所有房源、人员"
                    type="info"
                    :closable="false">
                </el-alert> 
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="newCancel('form')">取 消</el-button>

                <el-button type="primary" v-if="!isModify" @click="addPlanSubmit('form')">确 定</el-button>
                <el-button v-else type="primary" @click="updatePlanSubmit('form')">确 定</el-button>
            </div>
        </el-dialog>



        <el-dialog title="导入数据" :visible.sync="importMenVisible" width="540px" class="import_box">
            <el-row>
                <el-col :span="6" style="line-height:32px;margin-bottom:50px;">
                文件选择：
                </el-col>
                <el-col :span="18">
                <el-upload :limit="1" name="file"
                            ref="studentupload"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            :headers="headers" :action="'/api/lock/allotInfo/import?planId='+planid"
                            :file-list="fileList"
                            :onError="uploadError" :onSuccess="uploadSuccess"
                            :before-upload="beforeUpload" :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
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
                    prop="errMsg"
                    label="错误信息">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    prop="buildingName"
                    label="房源">
                </el-table-column>
                <el-table-column
                    prop="floorName"
                    label="楼层">
                </el-table-column>
                <el-table-column
                    prop="roomName"
                    label="房间">
                </el-table-column>
                </el-table>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="importSubmit('studentupload')" :loading="importLoading">导入
                </el-button>
                <el-button size="medium" @click="importCancel">取 消</el-button>
                <el-button size="medium" @click="downLoadMb">模版生成
                <i class="el-icon-download"></i>
                </el-button>

                <el-row class="import_desc">
                <el-col :span="6" style="line-height:80px">
                    操作说明：
                </el-col>
                <el-col :span="18">
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
import * as api from '@/api/projectapp/dormitoryManagement/';
import Cookies from 'js-cookie';
export default {
name: 'assignment',
data() {
    return {
        planid:"",
        searchVal:"",                       //搜索方案的字符串
        importMenVisible:false,             //导入人员的弹层
        newPlanVisible:false,               //新建方案的弹层
        planList:[],                        //方案列表
        allPlanList:[],                     //所有方案列表
        curpage:1,                          //方案当前页码
        limit:10,                           //每页最大记录数
        maxpage:0,                          //最大的页数
        maxcount:0,                         //总记录条数
        form:{
			planName: '',
			planRemarks: '',
			planid: ''
		},                            //表单
        popoverVisible:[],                  //删除方案的提示框
        isModify:false,                     //是否是修改方案
        importLoading: false,               //是否上传导入中
        fileList:[],                        //文件列表
        errData:[],                         //批量导入学生后的错误记录
        rules: {},
    };
},
computed: {
    headers() {
        return {
            Authorization: Cookies.get('Admin-Token'),
        };
    }
},
mounted() {
    this.init();
},
methods: {
    async init(){
        //获取方案列表
        var res = await api.getPlanList({"limit":this.limit,"page":1});
        this.planList = res.value.dataList;
        this.maxcount = res.value.totalCount;
        //计算最大页数
        this.maxpage = Math.ceil(res.value.totalCount/this.limit);
    },

    /**
     * 批量导入人员
     * by:RayJ
     * time:2019-05-07
     */
    importBatFun(item){
        this.planid = item.id;
        this.errData = [];
        this.importMenVisible = true;
    },

    /**
     * 批量导入人员弹层关闭
     * by:RayJ
     * time:2019-05-07
     */
    importCancel(){
        this.importMenVisible = false;
    },

    /**
     * 提交批量导入人员导入中
     * by:RayJ
     * time:2019-05-07
     */
    importSubmit(fileName){
        if(this.$refs[fileName].uploadFiles.length<1){
            this.tipsXX('请选择导入文件','error');
            return
        }
        console.log(111);
        this.$refs[fileName].submit();
        //this.importCjFormVisible = true;
    },

    /**
     * 批量提交失败
     * by:RayJ
     * time:2019-05-07
     */
    uploadError(response, file, fileList){
       
    },

    /**
     * 批量提交成功
     * by:RayJ
     * time:2019-05-07
     */
    uploadSuccess(response, file, fileList){
        if(response.resultCode == 1) {
            if (response.value.errMsgList && !response.value.errMsgList.length) {
                this.tipsXX("导入成功!","success");
                this.importMenVisible = false;
                this.fileList = [];
            }else{
                this.tipsXX("部分数据导入失败！","warning");
                this.errData = response.value.errMsgList; 
                this.fileList = [];
            }
        }else{
            this.tipsXX(response.resultMessage,"error");
            this.fileList = [];
        }
    },

    /**
     * 选择文件后的判断
     * by:RayJ
     * time:2019-05-07
     */
    beforeUpload(){

    },

    /**
     * 分配人员跳转页面
     * by:RayJ
     * time:2019-05-07
     */
    assignFun(planid){
        console.log('planid='+planid);
        this.$router.push({path:'/attendanceManagement/assigningPersonnel',query:{'planid':planid}})
    },

    /**
     * 获取方案列表
     * by:RayJ
     * time:2019-05-07
     */
    async getPlanList(){
        //获取方案列表
        var res = await api.getPlanList({"limit":this.limit,"page":this.curpage});
        this.planList = res.value.dataList;
        this.maxcount = res.value.totalCount;
        //计算最大页数
        this.maxpage = Math.ceil(res.value.totalCount/this.limit);
    },

    /**
     * 变更每页的记录条数
     * by:RayJ
     * time:2019-05-07
     */
    planSizeChange(val){
        this.limit = val;
        this.curpage = 1;
        this.getPlanList();
    },
    /**
     * 变更当前页码
     * by:RayJ
     * time:2019-05-07
     */
    planCurrentChange(val){
        this.curpage = val;
        this.getPlanList();
    },
    /**
     * 添加方案方法
     * by:RayJ
     * time:2019-05-07
     */
    async addPlanFun(modify,item,index){

        if(this.allPlanList.length==0){
            var res = await api.getAllPlanList();
            this.allPlanList = res.value;
        }

        if(modify=="modify"){
            this.isModify = true;
            this.form.planId = item.id;
            this.form.planName = item.name;
            this.form.planRemarks = item.summary;
            this.newPlanVisible = true;

        }else{
            this.isModify = false;
            this.form = {
				planName: '',
				planRemarks: '',
				planid: ''
			};
            this.newPlanVisible = true;
        }
    },
    /**
     * 弹层关闭
     * by:RayJ
     * time:2019-05-07
     */
    newCancel(formName){
        this.$refs[formName].resetFields(); 
        this.newPlanVisible = false;
    },
    /**
     * 提交新的方案
     * by:RayJ
     * time:2019-05-07
     */
    addPlanSubmit(formName){
        this.$refs[formName].validate(valid => {
            if (valid) {
                this.saveNewPlan();
            }
        })
    },
    /**
     * 更新方案
     * by:RayJ
     * time:2019-05-07
     */
    updatePlanSubmit(formName){
        this.$refs[formName].validate(valid => {
            if (valid) {
               this.updatePlan();
            }
        })
    },

    /**
     * 保存更新方案
     * by:RayJ
     * time:2019-05-07
     */
    async updatePlan(){  
        var res = await api.updatePlan({"planName":this.form.planName,"summary":this.form.planRemarks,"planId":this.form.planId})
        if(res.resultCode==1){
            this.tipsXX(res.resultMessage,"success");
            this.newPlanVisible = false;
            this.init();
        }else{
            this.tipsXX("更新出错","error");
        }
    },

    /**
     * 保存新的方案
     * by:RayJ
     * time:2019-05-07
     */
    async saveNewPlan(){
        var res = await api.savePlan({"planName":this.form.planName,"summary":this.form.planRemarks,"reusePlanId":this.form.planid})
        // console.log(res);
        if(res.resultCode==1){
            this.tipsXX(res.resultMessage,"success");
            this.newPlanVisible = false;
            this.init();
        }else{
            this.tipsXX(res.resultMessage,"error");
        }
    },
    /**
     * 删除方案
     * by:RayJ
     * time:2019-05-07
     */
    async delAssign(planId,index){
        var res = await api.deletePlan({"planId":planId});
        // console.log(res);
        if(res.resultCode==1){
            this.tipsXX(res.resultMessage,"success");
            this.$set(this.popoverVisible,index,false)
            this.getPlanList();
        }else{
            this.tipsXX("删除出错","error");
        }
    },
    /**
     * 启用方案
     * by:RayJ
     * time:2019-05-07
     */
    async enablePlan(planId){
        var res = await api.enablePlan({"planId":planId});
        console.log(res);
        if(res.resultCode==1){
            this.tipsXX(res.resultMessage,"success");
            this.getPlanList();
        }else{
            this.tipsXX("启用失败","error");
        }
    },
    /**
     * 批量导入人员模版下载
     * by:RayJ
     * time:2019-05-07
     */
    async downLoadMb(){
        var res = await api.downLoadTemplate();
        console.log(res);
        const blob = new Blob([res], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          const downloadElement = document.createElement('a');
          const href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '批量导入人员模板.xlsx'; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象 
    },

    /**
     * 搜索方案列表
     * by:RayJ
     * time:2019-05-08
     */
    async searchAssign(){
        //获取方案列表
        var res = await api.getPlanList({"limit":this.limit,"page":this.curpage,"planName":this.searchVal});
        this.planList = res.value.dataList;
        this.maxcount = res.value.totalCount;
        //计算最大页数
        this.maxpage = Math.ceil(res.value.totalCount/this.limit);
    },
    
    /**
     * 说明:Ele-UI 信息提示的二次封装
     * 作者:RayJ
     * 更新时间:2019-1-22
     */
    tipsXX(data,xxtype,tit){
        this.$notify({
            title: tit?tit:"",
            message: data,
            type: xxtype,
            duration: 2000
        });
    },
    
}

};
</script>

<style lang="scss" scoped>
.assignment{
    padding:20px;
    font-family: "微软雅黑";
}
.pageTit{
    font-size: 18px;
}
.pageHeaderContral{
    width: 100%;
    .searchIpt{
        width: 200px;
    }
    .searchBtn{
        margin-left:15px;
    }
}
.nonePlan{
    min-width: 560px;
    width: 100%;
    height: 200px;
    font-size: 14px;
    color: #999;
    text-align: center;
    padding: 90px 20px;
}
.assignmentBox{
    min-width: 560px;
    width: 100%;
    height: 200px;
    padding:20px;
    display: inline-block;
    position: relative;
    margin-right: 15px;
    margin-bottom: 15px;
    border: 1px solid #e2e2e2;
    border-radius: 3px;
    box-shadow: 0 0 4px rgba(200, 200, 200, .4);
    .assignName{
        margin-top: 10px;
        font-size: 18px;
        font-weight: bold;
    }
    .assignCreatTime{
        margin-top: 20px;
        font-size: 14px;
    }
    .assignFunBox{
        position: absolute;
        bottom: 40px;
        left: 20px;
    }
    .assignContral{
        position: absolute;
        bottom: 40px;
        right: 20px;
    }
}
.import_desc{
    overflow: hidden;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    text-align: left;
}
.pagination{
    margin-top: 20px;
}


@media (min-width:1500px){
    .assignmentBox{
        width:48%; 
    }
}
</style>