<template>
    <div class="app-container">
        <div class="summaryTit">学校概况录入</div>
        <el-alert class="summaryTips"
            title="温馨提示：【校长寄语】 【学校简介】 【注意事项】 都是报告单的必填项"
            type="info">
        </el-alert>

        <div class="subtit">校长寄语</div>
        <div class="subcontent">
            <textarea v-model="xzjy"></textarea>
        </div>

        <div class="subtit">学校简介</div>
        <div class="subcontent">
            <textarea v-model="xxjj"></textarea>
        </div>

        <div class="subtit">注意事项</div>
        <div class="subcontent">
            <textarea v-model="zysx"></textarea>
        </div>

        <div class="submit">
            <el-button type="primary" @click="submitSummary">提交</el-button>
        </div>



    </div>
</template>

<script>
import  * as reportapi from "api/project/report/index";
import  * as creditapi from "api/project/creditInquiry/index";
import _ from 'lodash';
export default {
    name: "setReport",
    components: {
    
    },
    data() {
        return {
            xzjy:"",                // 校长寄语
            xxjj:"",                // 学校简介
            zysx:"",                // 注意事项
            bgdId:"",
            setRes:{},              //设置的对象
        }
    },
    created() {        
        
    },
    mounted(){
        this.bgdId = this.$route.query.bgdId;
        this.init();
    },
    methods: {
        async init(){
            this.setRes = await creditapi.Getreportset({"id":this.bgdId});
            var allListSet = this.setRes.allGradeBgdszList;
            this.xzjy = _.find(allListSet,{"bm":"校长寄语"}).fy;
            this.xxjj = _.find(allListSet,{"bm":"学校简介"}).fy;
            this.zysx = _.find(allListSet,{"bm":"注意事项"}).fy;
            // console.log(this.setRes,61)
        },
        async submitSummary(){
            var that = this;
            var allListSet = this.setRes.allGradeBgdszList;
            if(this.xzjy==""||this.xxjj==""||this.zysx==""){

                this.$confirm('信息未填写完整，确认提交？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                    _.find(that.setRes.allGradeBgdszList,{"bm":"校长寄语"}).fy = that.xzjy;
                    _.find(that.setRes.allGradeBgdszList,{"bm":"学校简介"}).fy = that.xxjj;
                    _.find(that.setRes.allGradeBgdszList,{"bm":"注意事项"}).fy = that.zysx;
                    var res = await reportapi.SaveReportSetting(that.setRes);
                    that.tipsXX(res,'success');
                }).catch(() => {
                           
                });


            }else{
                _.find(that.setRes.allGradeBgdszList,{"bm":"校长寄语"}).fy = that.xzjy;
                _.find(that.setRes.allGradeBgdszList,{"bm":"学校简介"}).fy = that.xxjj;
                _.find(that.setRes.allGradeBgdszList,{"bm":"注意事项"}).fy = that.zysx;
                var res = await reportapi.SaveReportSetting(that.setRes);
                that.tipsXX(res,'success');
            }
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
    }
}
</script>

<style scoped lang="scss">
    .summaryTit{
        font-size: 22px;
        font-weight: bold;
        float: left;
        width: 100%;
        position: relative;
    }
    .summaryTips{
        float: left;
        width: 100%;
        max-width: 1200px;
        font-size: 14px;
        color:#666;
        margin-top:15px;
    }
    .subtit{
        font-size: 18px;
        font-weight: bold;
        width:100%;
        float: left;
        margin-top: 15px;
    }
    .subcontent{
        width: 100%;
        max-width: 1200px;
        float: left;
        margin-top: 5px;
        textarea{
            width: 100%;
            height: 200px;
            border: 1px solid #ccc;
            resize:none;
            outline:none;
            padding: 10px 15px;
            border-radius: 5px;
        }
    }
    .submit{
        float: left;
        padding: 20px 0;
        width: 100%;
        max-width: 1200px;
        text-align: center;
    }
</style>
