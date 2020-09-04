<template>
    <div class="innerTemplate practice">

        <div class="practiceMain">
            <table class="practiceTable" cellspacing="0" cellpadding="0">
                <tr>
                    <th width='210'>考评项目</th>
                    <th width='360'>实践活动</th>
                    <th width='120' class="wordCenter">得分</th>
                    <!-- <th width='120'>等级</th> -->
                    <th width='120' class="wordCenter">项目总分</th>
                </tr>

                <template  v-for="(item,index) in otherXmList">
                    <tr v-for="(sitem,sindex) in item.rwList" v-if="sindex==0">
                        <td :rowspan="item.rwList.length">{{item.mc}}</td>
                        <td>{{sitem.mc}}</td>
                        <td class="wordCenter">{{sitem.sz}}</td>
                        <!-- <td>{{sitem.djz}}</td> -->
                        <td :rowspan="item.rwList.length" class="wordCenter">{{item.sumSz}}</td>
                    </tr>

                    <tr v-for="(sitem,sindex) in item.rwList" v-if="sindex!=0">
                        <td>{{sitem.mc}}</td>
                        <td class="wordCenter">{{sitem.sz}}</td>
                        <!-- <td>{{sitem.djz}}</td> -->
                    </tr>
                </template>

                <!-- <tr>
                    <td>活动总分</td>
                    <td>{{sumScore}}</td>
                    <td colspan="2" class="wordCenter">{{getDj(sumScore)}}</td>
                </tr> -->
            </table>

            <!-- <table class="practiceTable" cellspacing="0" cellpadding="0">
                <tr>
                    <th colspan="4">获奖情况</th>
                </tr>
                <tr>
                    <td width='210'>级别</td>
                    <td width='480'>比赛名称</td>
                    <td width='120'>名次</td>
                    <td width='120'>加分</td>
                </tr>
                <template v-for="(item,index) in hjqk">
                    <tr v-for="(sitem,sindex) in item.rwList">
                        <td>{{item.mc}}</td>
                        <td>{{sitem.mc}}</td>
                        <td>{{sitem.twnr}}</td>
                        <td>{{sitem.xmcjInfo.twInfo[0].fz}}</td>
                    </tr>
                </template>
                <tr>
                    <td>总加分</td>
                    <td colspan="3">{{addSumScore}}</td>
                </tr>
                <tr>
                    <td>实践创新总分</td>
                    <td colspan="2">{{sumScore+addSumScore}}</td>
                    <td>{{getDj(sumScore+addSumScore)}}</td>
                </tr>
            </table> -->


            <div class="practiceSubTit">评价与建议</div>
            <div class="suggestMain">
                <div class="suggestBox">
                    <div class="suggestCont" v-html="appraise"></div>
                </div>
            </div>




        </div>

    </div>
</template>

<script>
// import echarts from 'echarts'
import * as xmpj from "./xmAppraise";
export default {
    name: "setReport",
    components: {

    },
    props:[
       "bgdInfo",
       "pageInfo"
    ],
    data() {
        return {
            hjqk:[],
            otherXmList:[],
            sumScore:0,              //实践项目的总分
            addSumScore:0,           //加分的总分

            appraise:"",
            suggest:"",
        }
    },
    mounted(){


        // console.log(this.pageInfo,127)
        var curPageItem = _.find(this.pageInfo.bgdItemlist,{"lx":14}).xmReportList;
        // console.log(curPageItem,126)

        var hjqkObj = _.find(curPageItem,{"mc":"获奖情况"});

        this.otherXmList =  _.reject(curPageItem,{"mc":"获奖情况"});

        //计算各个分项的总分 和 实践的总得分
        for(var i=0;i<this.otherXmList.length;i++){
            var xmSumScore=0;
            for(var j=0;j<this.otherXmList[i].rwList.length;j++){
                xmSumScore = xmSumScore + this.otherXmList[i].rwList[j].sz;
            }
            this.otherXmList[i].sumSz = xmSumScore;
            this.appraise = this.appraise + "<p><b>" + this.otherXmList[i].mc + ":</b>" + xmpj.sjcx.get(this.otherXmList[i].mc).appraise[this.getDj(xmSumScore)] + "</p>"
            // this.getAutoSuggest(xmSumScore,i);
            this.sumScore = this.sumScore + xmSumScore;
        }




        if(hjqkObj){
            this.hjqk = hjqkObj.zxmList

            for(var i=0;i<this.hjqk.length;i++){
                var xmSumScore=0;
                for(var j=0;j<this.hjqk[i].rwList.length;j++){
                    xmSumScore = xmSumScore + this.hjqk[i].rwList[j].xmcjInfo.twInfo[0].fz;
                }
                this.addSumScore = this.addSumScore + xmSumScore;
            }

        }

        //获取获奖情况的评价与建议
        //this.getHjSuggest();


    },
    methods: {
        getDj(score){
            if(score>=90){
                return "A"
            }else if(score>=70&&score<90){
                return "B"
            }else if(score<70){
                return "C"
            }
        },
    }
}
</script>

<style scoped lang="scss">
.innerTemplate{
    padding: 0;
    width:1000px;
    height:1415px;
    box-shadow: 0 0 4px rgba(0, 0, 0, .2);
    position: relative;
    // transform: scale(.7);
    // transform-origin: top left;
    // zoom:.7;
    float: left;
}
.wordCenter{
    text-align: center;
}
.practice{
    background: url('/static/report/high/sj_bg.jpg') no-repeat;
    background-size:100% 100%;
    .practiceMain{
        top:205px;
        width: 100%;
        padding: 0 32px;
        position: absolute;
    }
    .practiceTable{
        width: 100%;
        border-collapse:collapse;
        td,th{
            border: 1px solid rgba($color: #DDDDDD, $alpha: .6);
            height: 28px;
            line-height: 28px;
            padding-left:10px;
        }
        th{
            background: #b5d9a7;
            font-size: 14px;
            color: #005525;
        }
        td{
            background: #fff;
            color: #171615;
            height: 32px;
            line-height: 32px;
        }
    }
    .practiceSubTit{
        font-size: 20px;
        color: #005525;
        width: 100%;
        height: 36px;
        line-height: 36px;
        margin: 15px 0  10px;
        font-weight: bold;
    }

    .suggestMain{
        width: 100%;
        height: 350px;
        background: #fefdfa;
        border-radius: 13px;
        position: relative;
        .suggestBox{
            width:100%;
            height: 100%;
            float: left;
            padding: 20px 0;
            .suggestCont{
                width: 96%;
                height: 310px;
                border-radius: 10px;
                background: #f1f1f0;
                margin: 0 auto;
                padding: 20px 30px;
                font-size: 14px;
                line-height: 28px;
                /deep/ p{
                    margin-bottom: 5px;
                }
            }
        }
    }
}
</style>
