<template>
    <div class="app-container">

        <div class="u_TableMain block ofhide">
            
            <div class="filter-container clear">
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
                <el-checkbox style="line-height: 40px;" v-model="curBGDVisible" @change="changeVisiable">小程序当期报告可见</el-checkbox>
                <el-button type="primary" class="right" @click="handleCreate">新建</el-button>
            </div>

            <div class="m_GenTableBox">
                <div class="t_conmain"  v-loading.body="listLoading">
                    <p class="t_tips">注：<span>报告单锁定后，教师将不能进行录入操作</span></p>
                    <p class="t_tips">
                    <el-alert
                        title="如有新增项目，请点击报告单修改（笔图标），再次保存！"
                        type="warning">
                    </el-alert>
                    </p>
                    <el-card class="partbox-card" shadow="hover" v-for="(item,index) in reportList" :key="index">
                        <div class="leftpart">
                            <div class="title">
                                <span class='titspan' @click='handleUpdate(item)'>
                                    <span>{{item.mc}}</span>
                                    <i class="el-icon-edit"></i>
                                </span>
                            </div>
                            <div class='info'>
                                <div class="infopt">学年学期：{{item.xn + item.xqmc}}</div>
                                <div class="infopt">最后编辑时间：{{item.gxsj}}</div>
                                <div class="infopt">录入锁定：
                                    <el-switch v-model="item.lrsd" active-color="#13ce66" inactive-color="#ff4949" @change="changelrsd($event,item)"></el-switch>
                                </div>
                            </div>
                        </div>
                        <div class="rightpart">
                            <div class="sole" v-if="!isAutoSet(item)">
                                <el-checkbox v-model="item.ckqx==2"  @change="allowstudent($event,item)">允许学生查看报告</el-checkbox>
                            </div>
                            <div class='opt'>
                                <el-button type="text" v-if="!isAutoSet(item)" @click='handleSet(item)'>设置</el-button>
                                <el-button type="text" v-else @click='showReport(item)'>查看报告单</el-button>
                                <el-button type="text" @click='handleDelect(item)'>删除</el-button>
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
                    <el-select v-model="form.xn" clearable placeholder="选择学年"  :disabled="dialogStatus=='update'">
                        <el-option v-for="(item,index) in xnList" :key="index" :label="item.xn" :value="item.xn"></el-option>
                    </el-select>
                    <el-select v-model="form.xq" clearable placeholder="选择学期"  :disabled="dialogStatus=='update'">
                        <el-option v-for="(item,index) in xqList" :key="index" :label="item.xqmc" :value="item.xq"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报告单名称" prop="mc">
                    <el-input v-model="form.mc" placeholder="请输入报告单名称"></el-input>
                </el-form-item>
                <el-form-item label="选择模板" prop="mbid">
                    <el-select v-model="form.mbid" placeholder="选择模板"  :disabled="dialogStatus=='update'">
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
            curBGDVisible: true,           //小程序当期报告单是否可见
        }
    },
    created() {     
        this.DictObj();
    },
    mounted(){
        this.getChangeVisiable();
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
            reportapi.GetReportTemplateList({xxdm:localStorage.getItem('xxdm'),zsggmb:true}).then(response => {
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
                    this.form.xxdm = this.listQuery.xxdm
                    this.btnLimt = true
                    if(!this.form.xn || !this.form.xq){
                        this.tipsXX("请选择学年学期",'error','失败');
                    }
                    switch(this.dialogStatus) {
                        //更新
                        case 'update':
                            var curmb = _.find(this.mbList,{uuid:this.form.mbid})
                            if(curmb.zdsz){
                                this.form.autoSetting = true
                            }
                            console.log(this.form,"this.form")
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
                            var curmb = _.find(this.mbList,{uuid:this.form.mbid})
                            if(curmb.zdsz){
                                this.form.autoSetting = true
                            }
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
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
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
            window.localStorage.setItem('edittime',item.gxsj)
            if(this.mbList && this.mbList.length>0){
                this.mbList.forEach(a => {
                    if(a.uuid == item.mbid){
                        window.localStorage.setItem('reportmbx',a.mbx)          //保存该报告单的模板类型所选设置
                    }
                })
            }
            window.localStorage.setItem('mbid',item.mbid)
            this.$router.push({
                path: '/zhszReport/setReportEdit', 
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

        //修改小程序当期报告是否可见配置
        async changeVisiable(){
            var params = {
                schoolCode: window.localStorage.getItem('xxdm'),
                configValueDic:{
                    SMALL_PROGRAM_CURRENT_REPORT_SHOW:this.curBGDVisible,
                }
            }
            var res = await reportapi.saveCurBGDVisible(params);
            if(res.status==1){
                this.tipsXX('修改小程序配置成功！','success','提示');
            }
        },
        //获取小程序当期报告是否可见配置
        async getChangeVisiable(){
            var params = {
                schoolCode: window.localStorage.getItem('xxdm'),
                configCodeList:[1]
            }
            var res = await reportapi.getCurBGDVisible(params);
            if(res.status==1){
                this.curBGDVisible = res.data.SMALL_PROGRAM_CURRENT_REPORT_SHOW;
            }
        },

        isAutoSet(item){
            var mbobj = _.find(this.mbList,{uuid:item.mbid})
            return mbobj.zdsz;
        },

        async showReport(item){
            this.$router.push({path:'/zhszReport/commonReport',query: {bgdId:item.uuid,bgdxn:item.xn}})
        },



    }
}
</script>

<style scoped lang="scss">
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
        position: relative;
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
                position: absolute;
                bottom: 5px;
                right: 20px;
            }
        }
    }
</style>
<style>
.partbox-card .el-card__body{ padding: 10px 20px;}
/* .partbox-card .el-input__inner{ color: #000;} */
</style>
