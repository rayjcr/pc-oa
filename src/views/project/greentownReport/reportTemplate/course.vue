<template>
    <div class="innerTemplate courseReport">
        <div class="courseTit">{{pageInfo.mc}}</div>

        <div class="courseMain">
            <table class="courseTable" cellspacing="0" cellpadding="0">
                <tr>
                    <th width='210'>评分项目</th>
                    <th width='170' class="wordCenter">项目最高值</th>
                    <th width='170' class="wordCenter">等级</th>
                    <th width='360' class="wordCenter">水平</th>
                </tr>

                <tr v-for="(item,index) in otherXmList">
                    <td>{{item.mc}}</td>
                    <td class="wordCenter">{{item.rwList[0].xf}}</td>
                    <td class="wordCenter">{{item.rwList[0].djz}}</td>
                    <td>
                        <div class="roadBox">
                            <div class="person" :style="{left:(95-item.rwList[0].njpmzb)+'%'}"></div>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>总分</td>
                    <td colspan="3" class="wordCenter">{{getLev(otherXmSumScore)}}</td>
                </tr>
            </table>

            <div class="courseSubTit">课堂表现</div>
            <div class="courseChart">
                <div class="lineChart" :id="'bxChart'+seed"></div>
            </div>

            <div class="courseSubTit">作业情况</div>
            <div class="courseChart">
                <div class="lineChart" :id="'zyChart'+seed"></div>
            </div>

            <div class="courseSubTit suggest">评价与建议</div>
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
import echarts from 'echarts'
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
            line1:{
                title: {
                    text:"(生命值)分值/周次",
                    left: 20,
                    top:5,
                    textStyle:{
                        fontSize:14,
                    }
                },
                color: ['#ab4b39'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                backgroundColor :'#FFFFFF',
                grid: {
                    top: '40px',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : [],
                        axisTick:{
                            show:false,
                        },
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color: '#333333',
                            },
                        },
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisTick:{
                            show:false,
                        },
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color: '#333333',
                            },
                        },
                    }
                ],
                series : [
                    {
                        name:'成绩',
                        type:'bar',
                        barWidth: '60%',
                        label: {
                            normal: {
                                fontSize:20,
                                show: true,
                            }
                        },
                        data:[]
                    }
                ]
            },

            line2:{
                title: {
                    text:"(法术值)分值/周次",
                    left: 20,
                    top:5,
                    textStyle:{
                        fontSize:14,
                    }
                },
                color: ['#ab4b39'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: '40px',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                backgroundColor :'#FFFFFF',
                xAxis : [
                    {
                        type : 'category',
                        data : [],
                        axisTick:{
                            show:false,
                        },
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color: '#333333',
                            },
                        },
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisTick:{
                            show:false,
                        },
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color: '#333333',
                            },
                        },
                    }
                ],
                series : [
                    {
                        name:'成绩',
                        type:'bar',
                        barWidth: '60%',
                        label: {
                            normal: {
                                fontSize:20,
                                show: true,
                            }
                        },
                        data:[]
                    }
                ]
            },

            seed:Math.random(),

            otherXmList:[],

            otherXmSumScore:0,

            ktInfo:{},
            zyInfo:{},

            appraiseStandard:[{
                "A":"你的课堂表现非常棒！遵守课堂纪律，积极举手回答问题，语言表达能力强，善于和同伴合作，课堂上总能听到你充满智慧的回答。",
                "B":"你的课堂表现总体不错，有较强的口头表达能力，能和同伴合作完成任务。偶尔会有开小差还坐不住的行为，希望能引起重视。",
                "C":"你的课堂表现时好时坏，不太稳定。尤其是倾听的习惯，愿意听的时候，你会非常专心，不愿意听的时候你总是在走神开小差。",
                "D":"上课的时候你的注意力不能很好集中，总是会被学习以外的事物影响，以至于听课的效率不高。"},{
                "A":"每次看到你的作业都让人感到非常舒服。工整的书写、准确的表达、超高的正确率，那是相当优秀！",
                "B":"你的作业情况总体不错，如果能把书写和正确率再提高一点，写完再仔细检查一遍，就更好了！",
                "C":"你的作业情况时好时坏，不太稳定。如果你能合理安排好自己的时间，作业做到日日清，周周清，相信你的学习会有进步。",
                "D":"你的作业总是需要老师催，你的订正总是不及时。作业是所学知识的巩固和检查，希望你能重视。"}
            ],

            suggestStandard:[{
                "A":"继续保持，做同学们的榜样！",
                "B":"积极投入到每一节课的学习中去，加强自我管理和自我约束的能力。",
                "C":"希望你在课堂上能加强自我管理和自我约束的能力，学会和同伴沟通合作，认认真真上好每一节课。",
                "D":"希望你在课堂上能加强自我管理和自我约束的能力，养成认真倾听的习惯，学会和同伴合作。"},{
                "A":"继续保持，做同学们的榜样！",
                "B":"端正书写，仔细做题，认真检查，不会的题目要及时请教。",
                "C":"认真书写，按时完成作业，及时订正，遇到不会的题目要及时请教。",
                "D":"加强书写，按时完成作业，及时订正，及时巩固，遇到不会的题目要及时请教。"}
            ],

            appraise:"",
            suggest:"",
            xmpj:new Map,
        }
    },
    mounted(){
        this.getPjStandard();
        try{

        // console.log(this.pageInfo,215);

        var xmList = this.pageInfo.bgdItemlist[0].xmReportList;

        this.ktInfo = _.find(xmList,{"mc":"课堂表现"});
        this.zyInfo = _.find(xmList,{"mc":"作业情况"});

        // console.log(this.ktInfo,220);
        // console.log(this.zyInfo,221);

        this.otherXmList =  _.reject(xmList,function(o) {
            if(o.mc.indexOf("课堂表现")!=-1||o.mc.indexOf("作业情况")!=-1||o.mc.indexOf("知识技能")!=-1){
                return true;
            }
            return false
        });

        for(var i=0;i<this.otherXmList.length;i++){
            this.otherXmSumScore = this.otherXmSumScore + this.otherXmList[i].rwList[0].sz;
        }

        var ktSumScore=0;
        var zySumScore=0;
        var sumAverage=[];

        if(this.ktInfo&&this.zyInfo){

            for(var i=0;i<this.ktInfo.zxmList.length;i++){
                this.line1.xAxis[0].data.push(this.ktInfo.zxmList[i].mc)
                this.line1.series[0].data.push(this.ktInfo.zxmList[i].rwList[0].sz);
                ktSumScore = ktSumScore + this.ktInfo.zxmList[i].rwList[0].sz
            }
            sumAverage[0] = ktSumScore/this.ktInfo.zxmList.length;


            for(var i=0;i<this.zyInfo.zxmList.length;i++){
                this.line2.xAxis[0].data.push(this.zyInfo.zxmList[i].mc)
                this.line2.series[0].data.push(this.zyInfo.zxmList[i].rwList[0].sz);
                zySumScore = zySumScore + this.zyInfo.zxmList[i].rwList[0].sz
            }
            sumAverage[1] = zySumScore/this.zyInfo.zxmList.length;

        }

        // console.log(this.otherXmList,225588)
        for(var i=0;i<this.otherXmList.length;i++){
            var curXmPj = this.xmpj.get(this.otherXmList[i].mc);
            if(curXmPj){
                this.appraise = this.appraise + "<p><b>" + this.otherXmList[i].mc + "</b>:" + curXmPj.appraise[this.otherXmList[i].rwList[0].djz] + "</p>";
                this.suggest = this.suggest + "<p><b>" + this.otherXmList[i].mc + "</b>:" + curXmPj.suggest[this.otherXmList[i].rwList[0].djz] + "</p>";
                // console.log(curXmPj.appraise[this.otherXmList[i].rwList[0].djz]);
                // console.log(curXmPj.suggest[this.otherXmList[i].rwList[0].djz]);
            }
            // this.appraise = this.appraise + this.appraiseStandard[i][lev];
            // this.suggest = this.suggest + this.suggestStandard[i][lev];
        }

        for(var i=0;i<sumAverage.length;i++){
            var lev;
            if(sumAverage[i]>=95){
                lev = "A";
            }else if(sumAverage[i]>=90&&sumAverage[i]<95){
                lev = "B";
            }else if(sumAverage[i]>=75&&sumAverage[i]<90){
                lev = "C";
            }else if(sumAverage[i]<75){
                lev = "D";
            }
            this.appraise = this.appraise + "<p><b>" + (i==0?'课堂表现:</b>':'作业情况:</b>') + this.appraiseStandard[i][lev] + "</p>";
            this.suggest = this.suggest + "<p><b>" + (i==0?'课堂表现:</b>':'作业情况:</b>') + this.suggestStandard[i][lev] + "</p>";
        }


        // console.log(this.ktInfo,219);
        // console.log(this.zyInfo,220);




        this.init();

        let bx = echarts.init(document.getElementById('bxChart'+this.seed));
        bx.setOption(this.line1);

        let zy = echarts.init(document.getElementById('zyChart'+this.seed));
        zy.setOption(this.line2);
        }catch(err){
            console.log(err);
            console.log("这里有报错Course页面");
            //this.$parent.tipsXX("报告单加载失败,请核对数据后再试",'warning');
        }




    },
    methods: {
        init(){
            // console.log("初始化？？？？")
        },
        getLev(score){
            if(score>=90){
                return "A"
            }else if(score>=80&&score<90){
                return "B"
            }else if(score>=70&&score<80){
                return "C"
            }else if(score<70){
                return "D"
            }
        },

        getPjStandard(){
            switch(this.pageInfo.mc) {
                case "自主善学-语文":
                    this.xmpj = xmpj['yw_high'];
                    break;
                case "自主善学-数学":
                    this.xmpj = xmpj['sx_high'];
                    break;
                case "自主善学-英语":
                    this.xmpj = xmpj['yy_high'];
                    break;
                case "自主善学-科学":
                    this.xmpj = xmpj['kx_high'];
                    break;
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
.courseReport{
    background: url('/static/report/high/kc_bg.jpg') no-repeat;
    background-size:100% 100%;
    .courseTit{
        width: 245px;
        height: 70px;
        line-height: 70px;
        position: absolute;
        top: 50px;
        left: 160px;
        text-align: center;
        font-size: 36px;
        color: #005525;
        font-weight: bold;
    }
    .courseMain{
        top:140px;
        width: 100%;
        padding: 0 32px;
        position: absolute;
        .courseSubTit{
            font-size: 20px;
            color: #005525;
            width: 100%;
            height: 36px;
            line-height: 36px;
            margin-top: 15px;
            font-weight: bold;
        }
        .courseChart{
            width: 100%;
            height: 190px;
            border-radius: 15px;
            overflow: hidden;
            border: 1px solid #e3e4e5;
        }
        .suggestMain{
            width: 100%;
            height: 440px;
            background: #FFFFFF;
            border-radius: 13px;
            .suggestBox{
                width:50%;
                height: 100%;
                float: left;
                .suggestTit{
                    width: 120px;
                    height: 32px;
                    line-height: 32px;
                    border-radius: 16px;
                    background: #dbe494;
                    margin: 10px auto;
                    text-align: center;
                    font-size: 18px;
                    color: #4c7850;
                }
                .suggestCont{
                    width: 420px;
                    height: 370px;
                    border-radius: 10px;
                    background: #f1f1f0;
                    margin: 0 auto;
                    padding:10px 15px;
                    font-size: 15px;
                    /deep/ p{
                        margin-bottom: 5px;
                    }
                }
            }
        }
        .lineChart{
            width: 100%;
            height: 100%;
        }
    }

    .courseTable{
        width: 100%;
        border-collapse:collapse;
        td,th{
            border: 1px solid rgba($color: #DDDDDD, $alpha: .6);
            height: 26px;
            line-height: 26px;
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
            height: 45px;
            line-height: 45px;
        }
        .roadBox{
            width: 310px;
            height: 35px;
            background: url('/static/report/road.png') no-repeat center;
            background-size: 100% 100%;
            float: left;
            margin-left:20px;
            position: relative;
            .person{
                width: 29px;
                height: 40px;
                background: url('/static/report/dot-person.png') no-repeat center;
                background-size: 100% 100%;
                position: absolute;
                top:-5px;
            }
        }
    }
}

</style>
