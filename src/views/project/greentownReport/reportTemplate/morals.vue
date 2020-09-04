<template>
    <div class="innerTemplate morals">
        
        <div class="moralsMain">
           


            <div class="moralsItem" v-for="(item,index) in xmInfo.xmReportList">

                <div class="moraltips">
                    <span :class="'kp_'+(sindex+1)" v-for="(sitem,sindex) in rwmcList">{{sitem}}</span>
                </div>
                <div class="moralChart" :id="'moralsData_'+(index+1)">

                </div>
            </div>







            <div class="moralsSubTit">评价与建议</div>
            <div class="suggestMain">
                <div class="suggestBox">
                    <!-- <div class="suggestTit">评价</div> -->
                    <div class="suggestCont" v-html="appraise"></div>
                </div>
                <!-- <div class="suggestBox">
                    <div class="suggestTit">建议</div>
                    <div class="suggestCont">{{suggest}}</div>
                </div> -->
            </div>




        </div>

    </div>
</template>

<script>
import * as xmpj from "./xmAppraise";
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
            chartData_1:{
                title: {
                    text:"",
                    left: 20,
                    top:10,
                    color:"#005525",
                    textStyle:{
                        color:"#005525",
                        fontSize:16,
                    }
                },
                grid:{
                    top:50,
                    bottom:35,
                    left:"60px",
                    right:"40px",
                },
                xAxis: {
                    type: 'category',
                    data:[],
                    axisTick:{
                        show:false,
                    },
                    axisLine:{
                        lineStyle:{
                            type:'dotted',
                            color: '#333333',
                        },
                    },
                    axisLabel:{
                        show:true,
                        textStyle:{
                            color: "red",
                            fontSize:14,
                        } 
                    },
                    axisTick:{
                        show:true,
                    }
                },
                yAxis: [{
                        type: 'value',
                        splitNumber:3,
                        axisTick:{
                            show:false,
                        },
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color: '#333333',
                            },
                        },
                        splitLine:{
                            show:false, 
                        },
                        axisLabel:{
                            textStyle:{
                                fontSize:12,
                            }   
                        },
                        },
                ],
                series: [{
                    data:[],
                    type: 'bar',
                    symbol:"circle",
                    symbolSize:10,
                    barWidth:12,
                    // smooth: false,
                    itemStyle:{
                        normal:{
                            shadowColor: 'rgba(166, 212, 171, 1)',
                            shadowBlur: 12,
                            color:'#b6d480',
                            lineStyle: {
                            normal: {
                                color: '#b6d480',
                                width: 2,
                                type: 'solid'
                                }
                            },
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                },{
                    data:[],
                    type: 'bar',
                    symbol:"circle",
                    symbolSize:10,
                    barWidth:12,
                    itemStyle:{
                        normal:{
                            color:'#ef887f',
                            lineStyle: {
                            normal: {
                                color: '#ef887f',
                                width: 2,
                                type: 'solid'
                                }
                            },
                        }
                    },
                    label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                    },
                },{
                    data:[],
                    type: 'bar',
                    symbol:"circle",
                    symbolSize:10,
                    barWidth:12,
                    itemStyle:{
                        normal:{
                            color:'#6d88c4',
                            lineStyle: {
                            normal: {
                                color: '#6d88c4',
                                width: 2,
                                type: 'solid'
                                }
                            },
                        }
                    },
                    label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                    },
                },{
                    data:[],
                    type: 'bar',
                    symbol:"circle",
                    symbolSize:10,
                    barWidth:12,
                    itemStyle:{
                        normal:{
                            color:'#bc7cb2',
                            lineStyle: {
                            normal: {
                                color: '#bc7cb2',
                                width: 2,
                                type: 'solid'
                                }
                            },
                        }
                    },
                    label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                    },
                },{
                    data:[],
                    type: 'bar',
                    symbol:"circle",
                    symbolSize:10,
                    barWidth:12,
                    itemStyle:{
                        normal:{
                            color:'#90c99b',
                            lineStyle: {
                            normal: {
                                color: '#90c99b',
                                width: 2,
                                type: 'solid'
                                }
                            },
                        }
                    },
                    label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                    },
                },{
                    data:[],
                    type: 'bar',
                    symbol:"circle",
                    symbolSize:10,
                    barWidth:12,
                    itemStyle:{
                        normal:{
                            color:'#99d5f3',
                            lineStyle: {
                            normal: {
                                color: '#99d5f3',
                                width: 2,
                                type: 'solid'
                                }
                            },
                        }
                    },
                    label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                    },
                }]
            },
           
            // pageInfo:{},
            xmInfo:{},                //项目中的所有数据
            sumWeek:0,                //总的周数
            sumScore:[0,0,0,0,0,0],       //分数的总和
            appraise:"",            //评价
            suggest:"",             //建议
            mbname:'',
            mbnj:'',
            xmpj:new Map,
            rwmcList:[],
        }
    },
    mounted(){
        this.xmpj = xmpj.morals;
        // console.log(this.xmpj,312)
        var that = this;
        this.sumWeek = 0;
        // console.log(this.pageInfo,"311德育页面");

        // bgdItemList[0] 就是项目中的所有数据
        this.xmInfo = _.find(this.pageInfo.bgdItemlist,{"lx":14});
    
        // 切换页面的时候重新刷新页面后执行
        this.$nextTick(() => {
            //循环月次
            for(var i=1;i<this.xmInfo.xmReportList.length;i++){
                this["chartData_"+(i+1)] = $.extend(true,{},this.chartData_1);
            }
            
            for(var i=0;i<this.xmInfo.xmReportList.length;i++){

                var dy = echarts.init(document.getElementsByClassName("moralChart")[i]);
                this["chartData_"+(i+1)].title.text = this.xmInfo.xmReportList[i].mc;
                //x轴的坐标（周1，2，3，4，5）
                this["chartData_"+(i+1)].xAxis.data = [];
                //循环周次4周 4次循环
                for(var j=0;j<this.xmInfo.xmReportList[i].zxmList.length;j++){
                    this["chartData_"+(i+1)].xAxis.data.push(this.xmInfo.xmReportList[i].zxmList[j].mc)

                    if(this.xmInfo.xmReportList[i].zxmList[j].rwList[0].sz!=0){
                        this.sumWeek =  this.sumWeek + 1;
                    }
                    //把成绩循环push到series里..
                    for(var k=0;k<this.xmInfo.xmReportList[i].zxmList[j].rwList.length;k++){
                        this.rwmcList[k] = this.xmInfo.xmReportList[i].zxmList[j].rwList[k].mc;
                        this["chartData_"+(i+1)].series[k].data.push(this.xmInfo.xmReportList[i].zxmList[j].rwList[k].sz)
                        this.sumScore[k] += parseInt(this.xmInfo.xmReportList[i].zxmList[j].rwList[k].sz);
                    }

                }
                // console.log(this["chartData_"+(i+1)],805)
                dy.setOption(this["chartData_"+(i+1)]);
            }

            // console.log(this.rwmcList,790);
            // console.log(this.sumWeek,791);
            // console.log(this.sumScore,792);

            for(var i=0;i<this.sumScore.length;i++){
                var lev;
                var xm;
                if(this.sumScore[i]/this.sumWeek>100){
                    lev = "A";
                }else if(this.sumScore[i]/this.sumWeek>=90&&this.sumScore[i]/this.sumWeek<=100){
                    lev = "A";
                }else if(this.sumScore[i]/this.sumWeek>=80&&this.sumScore[i]/this.sumWeek<90){
                    lev = "B";
                }else if(this.sumScore[i]/this.sumWeek>=70&&this.sumScore[i]/this.sumWeek<80){
                    lev = "C";
                }else if(this.sumScore[i]/this.sumWeek<70){
                    lev = "D";
                }
                // console.log(this.sumScore[i]/this.sumWeek);
                // console.log("lev="+lev)
                // console.log(this.rwmcList)
                //这里的报错是因为有6个任务了
                if(this.xmpj.get(this.rwmcList[i])){
                this.appraise = this.appraise + "<p><b>" + this.rwmcList[i] + ":</b>" + this.xmpj.get(this.rwmcList[i]).appraise[lev] + "</p>";
                }
            }

        })
    },
    methods: {

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
.morals{
    background: url('/static/report/high/pd_bg.jpg') no-repeat;
    background-size:100% 100%;
    .moralsMain{
        top:165px;
        width: 100%;
        padding: 0 32px;
        position: absolute;
        .moralsItem{
            width: 100%;
            height: 205px;
            background: #FFF;
            border-radius: 5px;
            margin-bottom: 15px;
            position: relative;
            .moralChart{
                width: 100%;
                height: 100%;
            }
            .moraltips{
                position: absolute;
                top:12px;
                left: 150px;
                font-size: 14px;
                span{
                    margin-right: 40px;
                    position: relative;
                }
                .kp_1::after{
                    content:'\20';
                    background: #b6d480;
                    width: 16px;
                    height:16px;
                    display: block;
                    position: absolute;
                    right: -24px;
                    top: 0;
                }
                .kp_2::after{
                    content:'\20';
                    background: #ef887f;
                    width: 16px;
                    height:16px;
                    display: block;
                    position: absolute;
                    right: -24px;
                    top: 0;
                }
                .kp_3::after{
                    content:'\20';
                    background: #6d88c4;
                    width: 16px;
                    height:16px;
                    display: block;
                    position: absolute;
                    right: -24px;
                    top: 0;
                }
                .kp_4::after{
                    content:'\20';
                    background: #bc7cb2;
                    width: 16px;
                    height:16px;
                    display: block;
                    position: absolute;
                    right: -24px;
                    top: 0;
                }
                .kp_5::after{
                    content:'\20';
                    background: #90c99b;
                    width: 16px;
                    height:16px;
                    display: block;
                    position: absolute;
                    right: -24px;
                    top: 0;
                }
                .kp_6::after{
                    content:'\20';
                    background: #99d5f3;
                    width: 16px;
                    height:16px;
                    display: block;
                    position: absolute;
                    right: -24px;
                    top: 0;
                }
            }
        }
    }
    .moralsSubTit{
        font-size: 20px;
        display: inline-block;
        color: #005525;
        height: 36px;
        line-height: 36px;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .suggestMain{
        width: 100%;
        height: 290px;
        background: #FFFFFF;
        border-radius: 15px;
        position: relative;
        .suggestBox{
            width:100%;
            height: 100%;
            float: left;
            padding: 20px 0;
            .suggestTit{
                width: 120px;
                height: 32px;
                line-height: 32px;
                border-radius: 16px;
                background: #dbe494;
                margin: 10px auto;
                text-align: center;
                font-size: 18px;
                color: #005525;
            }
            .suggestCont{
                width: 96%;
                height: 250px;
                border-radius: 10px;
                background: #f1f1f0;
                margin: 0 auto;
                padding: 20px 30px;
                font-size: 14px;
                line-height: 28px;
                /deep/ p{
                    margin: 0 0 5px 0;
                }
            }
        }
    }
    
}
</style>
