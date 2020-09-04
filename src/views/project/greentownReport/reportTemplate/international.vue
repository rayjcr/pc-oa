<template>
    <div class="innerTemplate inter">

        <div class="interMain">
            <table class="interTable" cellspacing="0" cellpadding="0">
                <tr>
                    <th width='210'>考评项目</th>
                    <th width='360'>内容</th>
                    <th width='120' class="wordCenter">得分</th>
                    &lt;!&ndash; <th width='120'>等级</th> &ndash;&gt;
                    <th width='120' class="wordCenter">项目总分</th>
                </tr>

                <template  v-for="(item,index) in interXmList">
                    <tr v-for="(sitem,sindex) in item.rwList" v-if="sindex==0">
                        <td :rowspan="item.rwList.length">{{item.mc}}</td>
                        <td>{{sitem.mc}}</td>
                        <td class="wordCenter">{{sitem.sz}}</td>
                        &lt;!&ndash; <td>{{sitem.djz}}</td> &ndash;&gt;
                        <td :rowspan="item.rwList.length" class="wordCenter">{{item.sumSz}}</td>
                    </tr>
                    <tr v-for="(sitem,sindex) in item.rwList" v-if="sindex!=0">
                        <td>{{sitem.mc}}</td>
                        <td class="wordCenter">{{sitem.sz}}</td>
                        &lt;!&ndash; <td>{{sitem.djz}}</td> &ndash;&gt;
                    </tr>
                </template>

                &lt;!&ndash; <tr>
                    <td>总分</td>
                    <td>{{sumScore}}</td>
                    <td colspan="2" class="wordCenter">{{getDj(sumScore)}}</td>
                </tr> &ndash;&gt;
            </table>

            <div class="interSubTit">评价与建议</div>
            <div class="suggestMain">
                <div class="suggestBox">
                    <div class="suggestTit">评价</div>
                    <div class="suggestCont" v-html="appraise"></div>
                </div>
                <div class="suggestBox">
                    <div class="suggestTit">建议</div>
                    <div class="suggestCont" v-html="suggest"></div>
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
            interXmList:[],

            sumScore:0,              //国际理解的总分
            addSumScore:0,           //加分的总分

            appraise:"",
            suggest:"",
            mbname:'',
        }
    },
    mounted(){

        this.interXmList = _.find(this.pageInfo.bgdItemlist,{"lx":14}).xmReportList;

        //计算各个分项的总分 和 实践的总得分
        for(var i=0;i<this.interXmList.length;i++){
            var xmSumScore=0;
            for(var j=0;j<this.interXmList[i].rwList.length;j++){
                xmSumScore = xmSumScore + this.interXmList[i].rwList[j].sz;
            }
            this.interXmList[i].sumSz = xmSumScore;

            this.appraise = this.appraise + "<p><b>" + this.interXmList[i].mc + ":</b>" + xmpj.gjlj.get(this.interXmList[i].mc).appraise[this.getDj(xmSumScore)] + "</p>"
            this.suggest = this.suggest + "<p><b>" + this.interXmList[i].mc + ":</b>" + xmpj.gjlj.get(this.interXmList[i].mc).suggest[this.getDj(xmSumScore)] + "</p>"

            // this.getAutoSuggest(xmSumScore,i);
            this.sumScore = this.sumScore + xmSumScore;
        }

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
.inter{
    background: url('/static/report/high/gj_bg.jpg') no-repeat;
    background-size:100% 100%;
    .interMain{
        top:205px;
        width: 100%;
        padding: 0 32px;
        position: absolute;
    }
    .interTable{
        width: 100%;
        border-collapse:collapse;
        td,th{
            border: 1px solid rgba($color: #DDDDDD, $alpha: .6);
            height: 28px;
            line-height: 28px;
            padding-left:10px;
        }
        th{
            background: #0b9340;
            font-size: 14px;
            color: #FFF;
        }
        td{
            background: #fff;
            color: #171615;
            height: 32px;
            line-height: 32px;
        }
    }
    .interSubTit{
        font-size: 20px;
        color: #005525;
        width: 100%;
        height: 36px;
        line-height: 36px;
        margin-top: 15px;
        font-weight: bold;
    }

    .suggestMain{
        width: 100%;
        height: 410px;
        background: #FFFFFF;
        border-radius: 13px;
        position: relative;
        .suggestBox{
            width:50%;
            height: 100%;
            float: left;
            .suggestTit{
                width: 120px;
                height: 32px;
                line-height: 32px;
                border-radius: 16px;
                background: #4c7850;
                margin: 15px auto;
                text-align: center;
                font-size: 18px;
                color: #FFF;
            }
            .suggestCont{
                width: 420px;
                height: 320px;
                border-radius: 10px;
                background: #e1efdd;
                margin: 0 auto;
                font-size: 14px;
                padding: 10px 15px;
                line-height: 1.5em;
                /deep/ p{
                    margin-bottom: 5px;
                }
            }
        }
    }
}

</style>
