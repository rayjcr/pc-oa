<template>
    <div class="app-container">
        <!-- <router-link to="testpage"><el-button style="margin-bottom:15px;" type="primary">查看绿城页面组件</el-button></router-link> -->
        <div class="u_TableMain block ofhide" type="border-card">
            <div class="filter-container">
                <div class="clear">
                    <el-form :model="formSearch" ref="Searchform" label-position="left" class="left">
                        <el-row style="min-width:600px; padding-left:20px;">
                            <el-form-item label="学年学期">
                                <el-select v-model="formSearch.xn" clearable placeholder="选择学年" @change="searchFn">
                                    <el-option v-for="(item,index) in xnList" :key="index" :label="item.xn" :value="item.xn"></el-option>
                                </el-select>
                                <el-select v-model="formSearch.xq" clearable placeholder="选择学期" @change="searchFn">
                                    <el-option v-for="(item,index) in xqList" :key="index" :label="item.xqmc" :value="item.xq"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                    </el-form>
                    <el-button type="primary" class="right" @click="handleCreate">新建</el-button>
                </div>
            </div>
            <div class="m_GenTableBox">
                <div class="t_conmain"  v-loading.body="listLoading">
                    <p class="t_tips">注：<span>报告单锁定后，教师将不能进行录入操作</span></p>
                    <el-card class="partbox-card" shadow="hover" v-for="(item,index) in reportList" :key="index">
                        <div class="leftpart">
                            <div class="title">
                                <span class='titspan' @click='handleUpdate(item)'>
                                    <span>{{item.mc}}</span>

                                    <span class="tip" v-if="lguserType==3" :style="{background: item.lrsd? 'orange':'green',color:'#fff'}">{{item.lrsd?'已锁定':'可录入'}}</span>

                                    <i class="el-icon-edit"></i>
                                </span>
                            </div>
                            <div class='info'>
                                <div class="infopt">学年学期：{{item.xn + item.xqmc}}</div>
                                <div class="infopt">最后编辑时间：{{item.gxsj}}</div>
                                <div class="infopt" v-if="lguserType==2">录入锁定：
                                    <el-switch v-model="item.lrsd" active-color="#13ce66" inactive-color="#ff4949" @change="changelrsd($event,item)"></el-switch>
                                </div>
                            </div>
                        </div>
                        <div class="rightpart">
                            <div class="sole">
                                <!-- <el-button style="padding: 3px 0" type="text" @click="entryinfo(item)">录入</el-button>
                                <el-button style="padding: 3px 0;margin-left:20px;" type="text" @click="exportinfo(item)">导出</el-button> -->
                                <el-button style="padding: 3px 0;margin-left:20px;" type="text" @click="inputSummary(item)">学校概况录入</el-button>
                            </div>
                            <div class='opt'>
                                <!-- <el-button type="text" @click='handleSet(item)'>设置</el-button> -->
                                <el-button style="padding: 3px 0;margin-left:20px;" type="text" @click="showReport(item)">查看并录入报告单</el-button>
                                <el-button style="margin-left:20px;" type="text" @click='handleDelect(item)'>删除</el-button>
                            </div>
                        </div>
                    </el-card> 
                    <div v-show="!listLoading" class="pagination-container" v-if='total>0'>
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
                    </div>
                    <div v-if='!reportList || reportList.length<1' style="text-align:center">暂无报告单，请新建</div>
                </div>
            </div>
        
        </div>


        <!-- 新建 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="650px" :before-close="dialogCancel" class="dialogprog">
            <el-form :model="form" ref="dialogform" label-width="110px" :rules="rules">
                <el-form-item label="学年学期" required>
                    <el-select v-model="form.xn" clearable placeholder="选择学年" @change="searchFn" :disabled="dialogStatus=='update'">
                        <el-option v-for="(item,index) in xnList" :key="index" :label="item.xn" :value="item.xn"></el-option>
                    </el-select>
                    <el-select v-model="form.xq" clearable placeholder="选择学期" @change="searchFn":disabled="dialogStatus=='update'">
                        <el-option v-for="(item,index) in xqList" :key="index" :label="item.xqmc" :value="item.xq"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报告单名称" prop="mc">
                    <el-input v-model="form.mc" placeholder="请输入报告单名称"></el-input>
                </el-form-item>
                <el-form-item label="选择模板" prop="mbid">
                    <el-select v-model="form.mbid" placeholder="选择模板" @change="searchFn" :disabled="dialogStatus=='update'">
                        <el-option v-for="(item,index) in mbList" :key="index" :label="item.mc" :value="item.uuid"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogSubmit('dialogform')" :disabled="btnLimt">保 存</el-button>
                <el-button @click="dialogCancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import  * as mainPapi from "api/project/mainProject/index";
import  * as reportapi from "api/project/report/index";
import {school_page,getXn,getXq,getNj,getXk,dqxnxqObj,getBj,Getreport,Getreportset,Getjurisdiction,Getbzrinfo,Getallbjlist} from 'api/project/creditInquiry/index'
export default {
    name: "setReport",
    components: {
    
    },
    data() {
        return {
            formSearch:{},          //搜索
            xnList:[],              //学年
            xqList:[],              //学期
            listQuery:{                
                xxdm: window.localStorage.getItem('xxdm'),
                pageIndex: 1,
                pageSize: 10,
            },
            total: null,                    //分页            
            listLoading: true,      // 页面加载
            reportList:[],          //报告单列表

            dialogFormVisible:false,            //弹层
            textMap: {                          //判断弹层是添加还是编辑
                update: '编辑项目',
                create: '新建项目'
            },
            dialogStatus:'',
            btnLimt: false,                 //防止重复点击BUG
            mbList:[],                      //报告单模板
            form:{},
            rules:{
                mc: [
                    { required: true, message: '请输入报告单名称', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度不得超过50个字符', trigger: 'blur' }
                ],
                mbid: [{ required: true, message: '请选择模板', trigger: 'blur' }],
            },
            zgh:"",
            lguserType:"",              //用户类型
        }
    },
    created() {        
        this.DictObj();
    },
    mounted(){
        this.lguserType = localStorage.getItem('lguserType');
        this.zgh = localStorage.getItem('username').replace(localStorage.getItem('xxdm'),'');
        console.log('this.zgh='+this.zgh);
    },
    methods: {
        //基础信息获取(学年学期\报告单模板)
        DictObj() {
            reportapi.getxnlb({ xxdm: this.listQuery.xxdm }).then(response => {
                this.xnList = response   
            })
            reportapi.getxqlb({ xxdm: this.listQuery.xxdm }).then(response => {
                this.xqList = response   
                this.getList() 
            })           
            reportapi.GetReportTemplateList({xxdm:localStorage.getItem('xxdm')}).then(response => {
                this.mbList = response
            })
        }, 
        // 条件搜索
        searchFn() {
            this.listQuery.xn =  this.formSearch.xn?this.formSearch.xn:undefined;
            this.listQuery.xq =  this.formSearch.xq?this.formSearch.xq:undefined;
            this.getList()
        },
        // 报告列表
        getList(){
            var that = this
            this.listLoading = true;
            reportapi.getBgd(this.listQuery).then(response => {
                this.reportList = response.list
                this.total = response.totalCount
                if(this.reportList && this.reportList.length>0){
                    this.reportList.forEach(a => {
                        if(that.xqList && that.xqList.length>0){
                            that.xqList.forEach(b => {
                                if(a.xq == b.xq){
                                    that.$set(a,'xqmc',b.xqmc)
                                }
                            })
                        }
                    })
                }
                this.listLoading = false;
            })
        },       
        // 分页
        handleSizeChange(val) {
            this.listQuery.pageSize = val
            this.getList()
        },
        // 分页
        handleCurrentChange(val) {
            this.listQuery.pageIndex = val;
            this.getList();
        },
        //弹层初始化
        resetTemp(){            
            this.btnLimt = false;
            this.$refs['dialogform'].resetFields();
            this.form = {}
        },
        //新建
        handleCreate(){
            this.btnLimt = false;
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
        },
        //取消弹层
        dialogCancel(){
            this.dialogFormVisible = false;
            this.resetTemp();
        },
        //确定弹层
        dialogSubmit(formName){
            let that = this 
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.form.xxdm = this.listQuery.xxdm;
                    this.form.autoSetting = true;
                    this.btnLimt = true;
                    if(!this.form.xn || !this.form.xq){
                        this.tipsXX("请选择学年学期",'error','失败');
                    }
                    switch(this.dialogStatus) {
                        //更新
                        case 'update':
                            reportapi.updateBgd(this.form).then(() => {
                                this.dialogFormVisible = false;
                                this.resetTemp();
                                this.getList();
                                this.tipsXX("修改成功",'success','成功');
                            }).catch(()=>{
                                setTimeout(function(){
                                    that.btnLimt = false;
                                },1500);
                            })
                            break;
                        //创建    
                        case 'create':
                            reportapi.createBgd(this.form).then(() => {
                                this.dialogFormVisible = false;
                                this.resetTemp();
                                this.getList();
                                this.tipsXX("创建成功",'success','成功');
                            }).catch(()=>{
                                setTimeout(function(){
                                    that.btnLimt = false;
                                },1500);
                            })
                            break;
                    }

                }else {
                    return false;
                }
            })

        },
        // 编辑
        handleUpdate(item){            
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
            this.form = item
        },
        //录入锁定
        changelrsd(val,item){
            reportapi.updateBgd(item).then(() => {
                // var con = val?'录入锁定成功':'录入解锁成功'
                // this.tipsXX(con,'success','成功');
            })
        },
        //删除
        handleDelect(item){
            this.$confirm('确认删除此报告单吗？删除后无法恢复，请谨慎操作！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                reportapi.delBgd({id: item.uuid}).then(() => {
                    this.tipsXX("删除成功",'success','成功');
                    this.getList()
                })
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });          
            });           
        },

        /**
         * 是否允许学生查看报告单
         * By:RayJ
         * Time:2019-05-20
         */
        async allowstudent(event,item){
            console.log(event,275)
            console.log(item,276)
            if (event) {
                item.ckqx = 2
            } else {
                item.ckqx = 0
            }
            var res = await reportapi.updateBgd(item);
            this.tipsXX("设置成功","success");
            // if (event) {
            //     val.ckqx = 2
            // } else {
            //     val.ckqx = 0
            // }
            // reportapi.updateBgd(val).then(() => {
            //     // var con = val?'录入锁定成功':'录入解锁成功'
            //     // this.tipsXX(con,'success','成功');
            //     this.showindex = null
            // })
        },

        //复制
        handleCopy(item){

        },
        //设置
        handleSet(item){
            window.localStorage.setItem('reportxn',item.xn)
            window.localStorage.setItem('reportxq',item.xq)
            window.localStorage.setItem('reportid',item.uuid)
            window.localStorage.setItem('reportname',item.mc)
            if(this.mbList && this.mbList.length>0){
                this.mbList.forEach(a => {
                    if(a.uuid == item.mbid){
                        window.localStorage.setItem('reportmbx',a.mbx)          //保存该报告单的模板类型所选设置
                    }
                })
            }
            this.$router.push({
                path: '/greentownReport/setReportEdit', 
            })
        },        
        //提示信息
        tipsXX(data,xxtype,tit){
            this.$notify({
                title: tit,
                message: data,
                type: xxtype,
                duration: 2000
            });
        },
        // 录入信息(进入录入界面)
        entryinfo(item) {
            // console.log(item)
            this.xndm = item.xn
            var that = this
            if (item.lrsd) {
                that.$notify({
                    title: '提示',
                    message: '已锁定不可录入',
                    type: 'warning',
                    duration: 1000
                });
            } else if (item.byzD1.length) {
                this.getbzr(item, 'lr')
                // 获取权限班级

                // this.getqxbj(item, 'lr')

                // item.idlist.forEach(el => {
                //     that.classlist.forEach(i => {
                //         if (el === i.bjdm) {
                //             console.log('有权限')
                //         }
                //     })
                // })
            } else {
                that.$notify({
                    title: '提示',
                    message: '只有班主任和任课老师有录入授权！',
                    type: 'warning',
                    duration: 1000
                });
            }
            // this.$router.push({path: '/zhszReport/InformationEntry',query:{datas:item}})
            // this.$notify.success({
            //     title: 'Info',
            //     message: '这是一条没有关闭按钮的消息',
            //     showClose: false
            // });
        },
        // 进入导出信息页面
        exportinfo(item) {
            // console.log(item)
            this.xndm = item.xn
            var that = this
            if (that.lguserType === '2') {
                // console.log('我是管理员')
                Getallbjlist({xxdm: that.listQuery.xxdm, dqxn: item.xn}).then(data => {
                    // console.log('现在是全校班级数据')
                    // console.log(data)
                    data.forEach(el => {
                        that.newclasslist.push({
                            bjdm: el.uuid,
                            bjmc: el.bj,
                            njdm: el.njdm,
                            xn: el.jbny,
                            // njmc: ,
                            students: []
                        })
                    })
                    // console.log(that.newclasslist)
                    window.localStorage.setItem('bgdsj',JSON.stringify(item))
                    window.localStorage.setItem('newclasslist',JSON.stringify(that.newclasslist))
                    this.$router.push({path: '/zhszReport/InformationExport', query: {zgh: this.zgh, gly: true}})
                })
                // this.getqxbj(item, 'dc')
            } else if (item.bjidlist.length) {
                // console.log('我不是管理员但是我是教师')
                this.getbzr(item, 'dc')
                // this.getqxbj(item, 'dc')
            } else {
                // console.log('我不应该出现')
                that.$notify({
                    title: '提示',
                    message: '只有班主任和任课老师及管理员有查看权限！',
                    type: 'warning',
                    duration: 1000
                });
            }
            // this.$router.push({path: '/zhszReport/InformationExport'})
        },
        // 获取班主任信息
        getbzr (item, str) {
            let params = {
                xxdm: this.listQuery.xxdm,
                zgh: this.zgh,
                xndm: this.xndm,
                // xm: '',
            }
            Getbzrinfo(params).then(data => {
                console.log('我是班主任')
                console.log(data)
                var that = this
                if (data.status === 200 && data.data.length) {
                    that.isbzr = true
                    // console.log('我是班主任')
                    that.classlist = data.data
                    // console.log('看看班级数据')
                    // console.log(item)
                    // console.log(data)
                    for(var i = 0; i<item.bjidlist.length; i++){
                        for(var j = 0; j<that.classlist.length; j++){
                            if (item.bjidlist[i] === that.classlist[j].bjdm) {
                                that.newclasslist.push(that.classlist[j])
                                // j = ++i
                                window.localStorage.setItem('bgdsj',JSON.stringify(item))
                                window.localStorage.setItem('newclasslist',JSON.stringify(that.newclasslist))
                                if (str === 'lr') {
                                    that.$router.push({path: '/zhszReport/InformationEntry', query: {zgh: that.zgh, isbzr: that.isbzr}})
                                } else {
                                    that.$router.push({path: '/zhszReport/InformationExport', query: {zgh: that.zgh}})
                                }
                            }
                        }
                    }
                } else if (data.status === 200 && !data.data.length) {
                    // console.log('我不是班主任')
                    that.isbzr = false
                    that.getqxbj(item, str)
                }
            })
        },
        // 获取当前人有权限的班级
        getqxbj(item, str) {
            // console.log('我是谁')
            // console.log(item)
            let params = {
                xxdm: this.listQuery.xxdm,
                zgh: this.zgh,
                xndm: this.xndm,
                xm: '',
            }
            var that = this
            that.newclasslist = []
            // 根据职工号学年代码获取权限班级
            Getjurisdiction(params).then(data => {
                console.log(data)
                if (data.status === 200 && data.data.length) {
                    this.classlist = data.data
                    // console.log(data)
                    for(var i = 0; i<item.bjidlist.length; i++){
                        for(var j = 0; j<that.classlist.length; j++){
                            if (item.bjidlist[i] === that.classlist[j].bjdm) {
                                that.newclasslist.push(that.classlist[j])
                                // console.log(that.newclasslist)
                                // j = ++i
                                window.localStorage.setItem('bgdsj',JSON.stringify(item))
                                window.localStorage.setItem('newclasslist',JSON.stringify(that.newclasslist))
                                if (str === 'lr') {
                                    this.$router.push({path: '/zhszReport/InformationEntry', query: {zgh: this.zgh, isbzr: this.isbzr}})
                                } else {
                                    this.$router.push({path: '/zhszReport/InformationExport', query: {zgh: this.zgh}})
                                }
                            }
                        }
                    }
                } else if (data.status === 200 && !data.data.length) {
                    this.$notify({
                        title: '提示',
                        message: '只有班主任和任课老师有录入授权！',
                        type: 'warning',
                        duration: 1000
                    });
                }
                // console.log(data)
            })
        },
        //查看报告单
        async showReport(item){
            // console.log(item,508508)
            var res = await reportapi.GetRkTeacher({'xxdm':localStorage.getItem('xxdm'),'gh':localStorage.getItem('usercode')})
            //这里需要判断是不是管理员 lguserType = 4 获取所有的班级权限
            // if(res.data.njs==""){
            //     this.tipsXX("只有班主任和任课老师有录入授权!","warning",'提示')
            // }else{
                this.$router.push({path:'/greentownReport/report',query: {bgdId:item.uuid,bgdxn:item.xn}})
            // }

        },
        inputSummary(item){
            if(localStorage.getItem("lguserType")==2){
                if(item.lrsd){
                    this.tipsXX("报告单已经锁定无法编辑学校概况,请解锁后再次点击!","warning",'提示')
                }else{
                    this.$router.push({path:'/greentownReport/summary',query: {bgdId:item.uuid}})
                }
            }else{
                this.tipsXX("只有管理员才能编辑!","warning",'提示')
            }
        },
    }
}
</script>

<style scoped lang="scss">

    .filter-container /deep/ .el-form-item{
        margin-bottom: 0px;
    }
    .left{
        float: left;
    }
    .right{
        float: right;
    }
    .app-container{
        min-width: 740px; max-width: 1200px;
    }
    .t_conmain{
        padding-left: 20px;
        overflow: hidden;
    }
    .t_tips{
        span{ 
            color: #aaa;
        }
    }
    .partbox-card{
        height: 100px; 
        cursor: default;
        margin-bottom: 10px;
        .leftpart{
            float: left;
            .title{
                height: 40px; line-height: 40px; color: #000; font-size: 14px;
                .el-input{ float: left; min-width: 450px; width: auto;}
                .titspan{
                    cursor: pointer; 
                    span{
                        float: left; 
                        max-width: 470px; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
                    }
                }
                .tip{
                    margin-left: 20px;
                    display: inline-block;
                    width: 60px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    background: rebeccapurple;
                    border-radius: 15px;
                    margin-top: 10px;
                }
                .el-icon-edit{
                    color: #409EFF; margin-left: 10px;
                    font-size: 16px; font-style: italic;
                }
            }
            .info{
                height: 40px; line-height: 40px; font-size: 14px;
                .infopt{
                    float: left; margin-right: 10px;
                }
            }
        }
        .rightpart{
            float: right; 
            text-align: right;
            color: #409EFF;
            /deep/ .el-checkbox{
                color: #409EFF;
            }
            .sole{
                height: 40px; line-height: 40px; 
            }
            .opt{
                height: 40px; line-height: 40px;
            }
        }
    }
</style>
<style>
.partbox-card .el-card__body{ padding: 10px 20px;}
/* .partbox-card .el-input__inner{ color: #000;} */
</style>
