<template>
    <div class="innerTemplate summary">

        <div class="summaryMain">
            <table class="scroeTable" cellspacing="0" cellpadding="0">
                <tr>
                    <th rowspan="2">学科</th>
                    <th rowspan="2" class="wordCenter">课堂表现</th>
                    <th rowspan="2" class="wordCenter">作业情况</th>
                    <th colspan="2" class="wordCenter">知识技能</th>
                </tr>
                <tr>
                    <th class="wordCenter">期末</th><th class="wordCenter">总评</th>
                </tr>
                <tr v-for="(item,index) in kcAllPage">
                    <td>{{item.bgdItemlist[0].kcmc}}</td>
                    <td class="wordCenter">{{getXmValue(item.bgdItemlist[0].xmReportList,'课堂表现',1)}}</td>
                    <td class="wordCenter">{{getXmValue(item.bgdItemlist[0].xmReportList,'作业情况',1)}}</td>
                    <td class="wordCenter">{{getRwValue(item.bgdItemlist[0].xmReportList,'知识技能','期末',item.bgdItemlist[0].kcmc)}}</td>
                    <td class="wordCenter">{{getRwValue(item.bgdItemlist[0].xmReportList,'知识技能','总评',item.bgdItemlist[0].kcmc)}}</td>
                </tr>
            </table>
            <table class="scroeTable" cellspacing="0" cellpadding="0">
                <tr>
                    <th rowspan="2">学科</th>
                    <th rowspan="2" class="wordCenter" style="width:375px;">课堂表现</th>
                    <th colspan="2" class="wordCenter">知识技能</th>
                </tr>
                <tr>
                    <th class="wordCenter">期末</th><th class="wordCenter">总评</th>
                </tr>
                <tr v-for="(item,index) in BkcAllPage">
                    <td>{{item.bgdItemlist[0].kcmc}}</td>
                    <td class="wordCenter">{{getXmValue(item.bgdItemlist[0].xmReportList,'课堂表现',2)}}</td>
                    <td class="wordCenter">{{getRwValue(item.bgdItemlist[0].xmReportList,'知识技能','期末',item.bgdItemlist[0].kcmc)}}</td>
                    <td class="wordCenter">{{getRwValue(item.bgdItemlist[0].xmReportList,'知识技能','总评',item.bgdItemlist[0].kcmc)}}</td>
                </tr>
            </table>
            <table class="scroeTable" cellspacing="0" cellpadding="0">
                <tr>
                    <th colspan="2">学科</th>
                    <th class="wordCenter">态度习惯</th>
                    <th class="wordCenter">学分</th>
                    <th class="wordCenter">知识技能</th>
                </tr>
                <template v-for="(item,index) in CkcAllPage">
                    <tr v-for="(sitem,sindex) in item.kcList">
                        <td :rowspan="item.kcList.length" v-if="sindex==0">{{item.kcxz}}</td>
                        <td>{{sitem.kcmc}}</td>
                        <td class="wordCenter">{{sitem.tdxg}}</td>
                        <td class="wordCenter">{{sitem.cj}}</td>
                        <td class="wordCenter">{{sitem.zsjn}}</td>
                    </tr>
                </template>
            </table>

            <table class="rewardTable" cellspacing="0" cellpadding="0">
                <tr>
                    <th>荣誉称号</th> <th>特长素养</th> 
                </tr>

                <tr>
                    <td><div class="" v-html="rych"></div></td>
                    <td><div class="" v-html="tcsy"></div></td>
                </tr>
            </table>
        </div>

        <div class="summaryChart">
            <div class="summaryTit">成绩分析</div>
            <div class="chartBox">
                <div class="radarChart">
                    <div class="radarTit">
                        全面成绩模型
                        <p>单科水平情况</p>
                    </div>
                    <div class="chartContent" id="radarChart"></div>
                </div>
                <div class="treeChart">
                    <div class="chartContent">
                        <div class="treeTips"></div>
                        <div class="treeBox">
                            <div class="treelev">成长树</div>
                            <div class="treetips">期待你的茁壮成长</div>
                            <div class="treereal">
                                <div class="leafbg"></div>
                                <div class="treeobj">
                                    <div class="LeafBox" :id="'l_'+index"  v-for="(item,index) in ratingArr">
                                        <span class="mc">{{item.kcmc}}</span>
                                        <div class="Leaf" :class="'l_'+item.djz" ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>





    </div>
</template>

<script>
import _ from 'lodash';
import echarts from 'echarts'
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
            chartData:{
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            fontSize:14,
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: ['#FFF', '#ededed', '#FFF', '#ededed', '#FFF', '#ededed']
                        }
                    },

                    indicator: [
                    
                    ]
                },
                series: [{
                    name: '',
                    type: 'radar',
                    // areaStyle: {normal: {}},
                    data : [
                        {
                            value : [],
                            name : '总评成绩'
                        },
                    ]
                }]
            },

            kcAllPage:[],           //所有课程的全部信息
            BkcAllPage:[],
            CkcAllPage:[],

            ratingArr:[],           //各科总评汇总

            jcqk:{},                //奖惩情况

            mbname:'',
            rych:'',
            tcsy:'',

            //test:[95,50,75,95,50,75,95,50,75,95,50,75,95,50,75]
        }
    },
    mounted(){
        console.log(this.pageInfo.bgdItemlist,117722);
        this.kcAllPage = _.filter(this.bgdInfo.page,{"mb":"5"});
        this.BkcAllPage = _.filter(this.bgdInfo.page,{"mb":"5_1"});
        try{
        this.CkcAllPage = _.filter(this.pageInfo.bgdItemlist,{"lx":18})[0].xkkcxzGroupList;
        }catch(e){

        }
        this.rych = _.find(this.pageInfo.bgdItemlist,{"bm":"荣誉称号"})?_.find(this.pageInfo.bgdItemlist,{"bm":"荣誉称号"}).fy:'';
        this.tcsy = _.find(this.pageInfo.bgdItemlist,{"bm":"特长素养"})?_.find(this.pageInfo.bgdItemlist,{"bm":"特长素养"}).fy:'';

        

        this.initRating();


    },
    methods: {
        initRating(){
            // this.kcAllPage;
            // console.log(this.pageInfo,129);
            for(var i=0;i<this.kcAllPage.length;i++){
                var kcobj = this.kcAllPage[i].bgdItemlist[0];
                var kcmc = kcobj.kcmc;
                var cjArr = _.find(kcobj.xmReportList,{"mc":"知识技能"})
                // console.log(cjArr,192)
                if(cjArr){
                    //找到总评的信息用于底部的统计和画图
                    var rwobj = _.find(cjArr.zxmList,{'mc':'总评'})
                    //设置雷达图的参数
                    this.chartData.radar.indicator.push({name:(kcmc+"("+(rwobj.rwList[0].djz)+")"),max:4});
                    this.chartData.series[0].data[0].value.push(this.changeVal(rwobj.rwList[0].djz));

                    // console.log(kcmc,202)
                    // console.log(this.changeLev(rwobj),203)
                    this.ratingArr.push({'kcmc':kcmc,'djz':rwobj.rwList[0].djz})
                }else{
                    
                }
            }
            for(var i=0;i<this.BkcAllPage.length;i++){
                var kcobj = this.BkcAllPage[i].bgdItemlist[0];
                var kcmc = kcobj.kcmc;
                var cjArr = _.find(kcobj.xmReportList,{"mc":"知识技能"})
                // console.log(cjArr,192)
                if(cjArr){
                    //找到总评的信息用于底部的统计和画图
                    var rwobj = _.find(cjArr.zxmList,{'mc':'总评'})
                    //设置雷达图的参数
                    this.chartData.radar.indicator.push({name:(kcmc+"("+(rwobj.rwList[0].djz)+")"),max:4});
                    this.chartData.series[0].data[0].value.push(this.changeVal(rwobj.rwList[0].djz));

                    // console.log(kcmc,202)
                    // console.log(this.changeLev(rwobj),203)
                    this.ratingArr.push({'kcmc':kcmc,'djz':rwobj.rwList[0].djz})
                }else{
                    
                }
            }



            if(this.chartData.series[0].data[0].value.length>0){
                // console.log(this.chartData,204);
                let chartObj = echarts.init(document.getElementById('radarChart'));
                chartObj.setOption(this.chartData);
            }
        },

        getXmValue(xmObjArr,xmName,type){
            if(type==1){
                var res = _.find(xmObjArr,{"mc":xmName})
            }else{
                var res = _.find(xmObjArr,{"mc":xmName}).rwList[0]
            }
            return res?res.djz:''
        },

        //获取 期中，期末，总评
        getRwValue(xmObjArr,xmName,rwName,kcmc){
            if(!xmObjArr){
                return
            }
            //先获取知识技能的对象
            var xmres = _.find(xmObjArr,{"mc":xmName})
            if(!xmres){
                return
            }
            //再获取相关 期中，期末，总评 对象
            var res = _.find(xmres.zxmList,{"mc":rwName})
            if(!res){
                return
            }

            //先去转换文字 -> 数字
            return res.rwList[0].djz

            // var val = this.changeVal(res.twnr);
            // if(val==-1){
            //     val = res.sz;
            //     return res.xmcjInfo.twInfo[0].fz
            // }else{
            //     return res.twnr
            // }
            //把总评成绩记录起来
            // if(rwName=="总评"){
            //     this.ratingArr.push({'kcmc':kcmc,'sz':val});
            //     this.chartData.radar.indicator.push({name:kcmc,max:100});
            //     console.log(this.chartData.radar.indicator,211)
            // }
        },
        // { name: '数学', max: 6500},
        // { name: '语文', max: 16000},
        // { name: '英语', max: 30000},
        // { name: '科学', max: 38000},
        // { name: '德育', max: 52000},
        // { name: '体育', max: 25000}


        changeVal(twnr){
            switch(twnr) {
                case "优秀+":
                    return 100
                    break;
                case "优秀":
                    return 95
                    break;
                case "良好":
                    return 85
                    break;
                case "合格":
                    return 70
                    break;
                case "不合格":
                    return 50
                    break;
                case "A":
                    return 4
                    break;
                case "B":
                    return 3
                    break;
                case "C":
                    return 2
                    break;
                case "D":
                    return 1
                    break;
                case "E":
                    return 0
                    break;
                default:
                    return -1
            }   
        },

        changeLev(rwobj){
            // console.log()
            var dj;
            if(this.changeVal(rwobj.twnr)!=-1){
                switch(rwobj.twnr) {
                    case "优秀+":
                        return "A"
                        break;
                    case "优秀":
                        return "B"
                        break;
                    case "良好":
                        return "C"
                        break;
                    case "合格":
                        return "D"
                        break;
                    case "不合格":
                        return "E"
                        break;
                    default:
                        return -1
                } 
            }else{
                var sz = rwobj.xmcjInfo.twInfo[0].fz;
                if(sz==100){
                    return "A"
                }else if(sz>=90&&sz<100){
                    return "B"
                }else if(sz>=80&&sz<90){
                    return "C"
                }else if(sz>=60&&sz<80){
                    return "D"
                }else if(sz<60){
                    return "E"
                }
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
.summary{
    background: url('/static/report/high/hz_bg.jpg') no-repeat;
    background-size:100% 100%;
    .summaryMain{
        top:175px;
        width: 100%;
        padding: 0 32px;
        position: absolute;
    }
    .scroeTable{
        width: 100%;
        border-collapse:collapse;
        td,th{
            border: 1px solid rgba($color: #DDDDDD, $alpha: .6);
            width: 16.67%;
            height: 30px;
            line-height: 30px;
            padding-left:10px;
        }
        th{
            background: #b5d9a7;
            font-size: 14px;
            color: #005525;
            height: 26px;
            line-height: 26px;
        }
        td{
            background: #fff;
            color: #171615;
            height: 30px;
        }
    }
    .rewardTable{
        width: 100%;
        margin-top: 12px;
        border-collapse: collapse;
        td,th{
            border: 1px solid #e3e4e5;
            height: 30px;
            line-height: 30px;
            padding-left:10px;
        }
        th{
            background: #b5d9a7;
            font-size: 14px;
            color: #005525;
        }
        td{
            width: 50%;
            background: #fff;
            color: #171615;
            line-height: 34px;
            height: 100px;
            vertical-align: top;
        }
    }
    .summaryChart{
        position: absolute;
        top:920px;
        width: 100%;
        padding: 0 32px;
        .summaryTit{
            font-size: 20px;
            font-weight: bold;
            color: #005525;
            margin-top:10px;
            margin-bottom: 10px;
        }
        .chartBox{
            width: 100%;
            height: 405px;
            background: #fefdfa;
            border-radius: 15px;
            .radarChart,.treeChart{
                width: 50%;
                height: 100%;
                float: left;
            }
            .radarChart{
                .chartContent{
                    width: 100%;
                    height: 330px;
                    padding-top: 10px;
                }
            }
            .treeChart{
                .chartContent{
                    width: 100%;
                    height: 100%;
                    position: relative;
                    .treeTips{
                        width: 99px;
                        height: 283px;
                        background: url('/static/report/high/treetips.png') no-repeat center;
                        background-size: 100% 100%;
                        float: right;
                        margin-top: 80px;
                        margin-right:20px;
                    }
                    .treeBox{
                        overflow: hidden;
                        height: 100%;
                    }
                    .treelev{
                        width: 120px;
                        height: 32px;
                        border-radius: 16px;
                        background-color: #ee9526;
                        font-size: 18px;
                        color: #FFF;
                        line-height: 32px;
                        text-align: center;
                        margin: 20px auto 0;
                    }
                    .treetips{
                        width: 100%;
                        font-size: 12px;
                        color: #5d5a57;
                        text-align: center;
                        padding-top: 10px;
                    }
                    .treereal{
                        margin-top: 15px;
                        width: 100%;
                        height:250px;
                        position: relative;
                        .leafbg{
                            width: 100%;
                            height: 230px;
                            background: url('/static/report/leafBg.png') no-repeat center;
                            position: absolute;
                            top: 0;
                            background-size: 65% auto;
                        }
                    }
                    .treeobj{
                        width: 100%;
                        height: 100%;
                        background: url('/static/report/high/tree.png') no-repeat center center;
                        background-size: auto 100%;
                        margin: 0 auto;
                        position: relative;
                        .LeafBox{
                            position: absolute;
                            .mc{
                                position: absolute;
                                top: -20px;
                                font-size: 12px;
                                width: 40px;
                            }
                        }
                        .Leaf{
                            // position: absolute;
                            background: url('/static/report/high/tree-B.png') no-repeat center center;
                            background-size: 100% 100%;
                            width: 30px;
                            height: 39px;
                        }
                        .Leaf.l_A{
                            background: url('/static/report/high/tree-A.png') no-repeat center center;
                            background-size: 100% 100%;
                        }
                        .Leaf.l_B{
                            background: url('/static/report/high/tree-B.png') no-repeat center center;
                            background-size: 80% auto;
                        }
                        .Leaf.l_C{
                            background: url('/static/report/high/tree-C.png') no-repeat center center;
                            background-size: 60% auto;
                        }
                        .Leaf.l_D{
                            background: url('/static/report/high/tree-D.png') no-repeat center center;
                            background-size: 40% auto;
                        }
                        .LeafBox .mc{
                            position: absolute;
                            font-weight: bold;
                        }
                        .LeafBox#l_0{
                            top: 25px;
                            left: 120px;
                            .Leaf{
                                transform: rotateY(180deg) rotate(20deg);
                            }
                            .mc{
                                top:-5px;
                                left:15px;
                            }
                        }
                        .LeafBox#l_1{
                            top: 10px;
                            left: 202px;
                            .mc{
                                top:-5px;
                                left:-10px;
                            }
                        }
                        .LeafBox#l_2{
                            top: 60px;
                            left: 70px;
                            .Leaf{
                                transform:rotateY(180deg) rotate(20deg);
                            }
                        }
                        .LeafBox#l_3{
                            top: 35px;
                            left: 250px;
                            .Leaf{
                                transform:rotate(20deg);
                            }
                            .mc{
                                top:-12px;
                                left:12px;
                            }
                        }
                        .LeafBox#l_4{
                            top: 110px;
                            left: 70px;
                            .Leaf{
                                transform:rotateY(180deg) rotate(50deg);
                            }
                            .mc{
                                top:-8px;
                                left:0px;
                            }
                        }
                        .LeafBox#l_5{
                            top: 120px;
                            left: 140px;
                            .Leaf{
                                transform: rotateY(180deg) rotate(50deg);
                            }
                            .mc{
                                top:-8px;
                                left:-5px;
                            }
                        }
                        .LeafBox#l_6{
                            top: 85px;
                            left: 210px;
                            .Leaf{
                                transform: rotate(50deg);
                            }
                            .mc{
                                top:-8px;
                                left:-5px;
                                white-space: nowrap;
                            }
                        }
                        .LeafBox#l_7{
                            top: 105px;
                            left: 265px;
                            .Leaf{
                                transform: rotate(40deg);
                            }
                            .mc{
                                top:-8px;
                                left:15px;
                                white-space: nowrap;
                            }
                        }
                        .LeafBox#l_8{
                            top: 160px;
                            left: 110px;
                            .Leaf{
                                transform:rotateY(180deg) rotate(50deg);
                            }
                            .mc{
                                top:-8px;
                                left:-5px;
                                white-space: nowrap;
                            }
                        }
                        .LeafBox#l_9{
                            top: 158px;
                            left: 245px;
                            .Leaf{
                                transform: rotate(50deg);
                            }
                            .mc{
                                top:-8px;
                                left:15px;
                                white-space: nowrap;
                            }
                        }
                    }

                }
            }
            
            .radarTit{
                margin-top: 15px;
                width: 100%;
                height: 40px;
                text-align: center;
                font-size: 19px;
                line-height: 30px;
                p{
                    font-size: 12px;
                    color: #686663;
                    margin: 0;
                    padding: 0;
                }
            }
        }
    }
}

</style>
