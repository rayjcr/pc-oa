<template>
    <div class="innerTemplate physical" :class="mbname">
        <!-- <div class="reportTit">身体素质</div> -->

        <div class="innerMain">

            <div class="subTit">最新体检情况</div>
            <table class="physicalTable" cellspacing="0" cellpadding="0">
                <tr>
                    <th>性别</th><th>年龄</th><th>视力</th><th></th>
                </tr>
                <tr>
                    <td>{{sex=="1"?"男":"女"}}</td><td>{{newObj.nl}}</td><td>左眼:{{newObj.zy}}</td><td>右眼:{{newObj.yy}}</td>
                </tr>
                <tr>
                    <th>身高</th><th>体重</th><th>BMI</th><th>体重情况</th>
                </tr>
                <tr>
                    <td>{{newObj.sg}}cm</td><td>{{newObj.tz}}kg</td><td>{{newObj.bmi}}</td><td>{{getBMIStr(newObj.bmi)}}</td>
                </tr>
            </table>
            <div class="report_tips">注：BMI（体重指数）= 体重[kg]/身高²[m]</div>

            <div class="subTit">入学身体情况</div>
            <div class="startPhysical">
                <table class="physicalTable" cellspacing="0" cellpadding="0">
                    <tr>
                        <th>身高</th><th>体重</th><th>BMI</th><th>体重情况</th><th colspan="2" class="colspan">视力</th>
                    </tr>
                    <tr>
                        <td>{{startObj.sg}}cm</td><td>{{startObj.tz}}kg</td><td>{{startObj.bmi}}</td><td>{{getBMIStr(newObj.bmi)}}</td><td>左眼:{{startObj.zy}}</td><td>右眼:{{startObj.yy}}</td>
                    </tr>
                </table>
            </div>

            <div class="subTit charts">身体素质曲线</div>
            <div class="physicalEchart">
                <div class="sg">身高(cm)</div>
                <div class="tz">体重(cm)</div>
                <div class="chartBox" id="lineP1"></div>
            </div>
            <div class="subTit">健康指导意见</div>
            <div class="physicalOpinion">
                <div class="physicalCont" v-html="suggest"></div>
            </div>
            


        </div>

    </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
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
                grid:{
                    top:55,
                    bottom:50,
                    left:"60px",
                    right:"60px",
                },
                xAxis: {
                    type: 'category',
                    data:[],
                    axisLabel:{
                        show:true,
                        textStyle:{
                            color: "red",
                            fontSize:14,
                        } 
                    },
                    axisLine:{
                        lineStyle:{
                            type:'dotted',
                            color: '#3c8751',
                        },
                    },
                    axisTick:{
                        show:true,
                    }
                },
                yAxis: [{
                        type: 'value',
                        min: 0,
                        max: 180,
                        interval: 30,
                        axisTick:{
                            show:false,
                        },
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color: '#3c8751',
                            },
                        },
                        splitLine:{
                            show:false, 
                        },
                        axisLabel:{
                            textStyle:{
                                fontSize:14,
                            }   
                        },
                        },
                        {
                        type: 'value',
                        min: 0,
                        max: 90,
                        interval: 15,
                        axisTick:{
                            show:false,
                        },
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color: '#3c8751',
                            },
                        },
                        splitLine:{
                            show:false, 
                        },
                        axisLabel:{
                            textStyle:{
                                fontSize:14,
                            }   
                        },
                        }
                ],
                series: [{
                    data:[],
                    type: 'line',
                    symbol:"circle",
                    symbolSize:10,
                    // smooth: false,
                    itemStyle:{
                        normal:{
                            shadowColor: 'rgba(166, 212, 171, 1)',
                            shadowBlur: 12,
                            color:'#007232',
                            lineStyle: {
                            normal: {
                                color: '#a7d47f',
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
                    type: 'line',
                    symbol:"circle",
                    symbolSize:10,
                    itemStyle:{
                        normal:{
                            color:'#e44a21',
                            lineStyle: {
                            normal: {
                                color: '#f3af8c',
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
        

            physicalXmList:[],              //身体项目列表

            startPhysical:{},               //入学身体信息

            newPhysical:{},                 //最新身体信息

            startObj:{},
            newObj:{},

            suggest:"",

        
            sex:0,
            age:0,
        
            mbname:'',
        
        
        
        
        
        
        
        
        }
    },
    mounted(){
        
        this.sex = this.bgdInfo.studentInfo.xbm
        this.age = this.bgdInfo.studentInfo.csrq
        

        console.log(this.pageInfo,222277);

        this.$nextTick(() => {
            this.getMb();
            this.physicalXmList = _.find(this.pageInfo.bgdItemlist,{"lx":17}).physicalFitnessInfo.xqPhysicalFitnessList;


            // this.startPhysical = _.find(this.physicalXmList.,{"xmMc":"入学身体情况"});

            // this.newPhysical = _.find(this.physicalXmList,{"xmMc":"最新体检情况"});

            this.startPhysical = this.physicalXmList[0]

            this.newPhysical = this.physicalXmList[this.physicalXmList.length-1]

            if(!this.startPhysical||!this.newPhysical){
                return
            }
            
            //try{
            if(_.find(this.startPhysical.physicalFitnessItemList,{"rwMc":"身高"})){
            
            this.startObj = Object.assign({}, this.startObj, {
                sg: _.find(this.startPhysical.physicalFitnessItemList,{"rwMc":"身高"}).sz,
                tz: _.find(this.startPhysical.physicalFitnessItemList,{"rwMc":"体重"}).sz,
                zy: _.find(this.startPhysical.physicalFitnessItemList,{"rwMc":"左眼"}).sz,
                yy: _.find(this.startPhysical.physicalFitnessItemList,{"rwMc":"右眼"}).sz,
                nl: _.find(this.startPhysical.physicalFitnessItemList,{"rwMc":"年龄"}).sz,
            });
            this.startObj.bmi = (this.startObj.tz/(this.startObj.sg*this.startObj.sg/10000)).toFixed(2);

            this.newObj = Object.assign({}, this.newObj, {
                sg: _.find(this.newPhysical.physicalFitnessItemList,{"rwMc":"身高"}).sz?_.find(this.newPhysical.physicalFitnessItemList,{"rwMc":"身高"}).sz:0,
                tz: _.find(this.newPhysical.physicalFitnessItemList,{"rwMc":"体重"}).sz,
                zy: _.find(this.newPhysical.physicalFitnessItemList,{"rwMc":"左眼"}).sz,
                yy: _.find(this.newPhysical.physicalFitnessItemList,{"rwMc":"右眼"}).sz,
                nl: _.find(this.newPhysical.physicalFitnessItemList,{"rwMc":"年龄"}).sz,
            });

            }else{
                this.$notify({title:"提示",message:"数据不完整,请查看学分系统的项目录入",type:"warning"});
                return;
            }

            console.log(this.newObj.zy,225577);

            if(!this.startObj.tz||!this.newObj.tz||!this.startObj.zy||!this.startObj.yy||!this.newObj.zy||!this.newObj.yy){
                if(!this.startObj.tz){
                    this.startObj.tz = "暂无数据"
                }
                if(!this.newObj.tz){
                    this.newObj.tz = "暂无数据"
                }
                if(!this.startObj.zy){
                    this.startObj.zy = "暂无数据"
                }
                if(!this.startObj.yy){
                    this.startObj.yy = "暂无数据"
                }
                if(!this.newObj.zy){
                    this.newObj.zy = "暂无数据"
                }
                if(!this.newObj.yy){
                    this.newObj.yy = "暂无数据"
                }
               //return
            }

            // }catch(err){
                
            // }
            this.newObj.bmi = (this.newObj.tz/(this.newObj.sg*this.newObj.sg/10000)).toFixed(2);
            
            // console.log(this.startObj,this.newObj,206)

            // console.log(this.physicalXmList,213)
            for(var i=0;i<this.physicalXmList.length;i++){
                // console.log(this.physicalXmList[i].xmMc,215)
                this.chartData.xAxis.data.push(this.physicalXmList[i].xmMc);
                this.chartData.series[0].data.push(_.find(this.physicalXmList[i].physicalFitnessItemList,{"rwMc":"身高"}).sz);
                this.chartData.series[1].data.push(_.find(this.physicalXmList[i].physicalFitnessItemList,{"rwMc":"体重"}).sz);
            }

            // console.log(this.chartData,218)

            let Line1 = echarts.init(document.getElementById('lineP1'));
            Line1.setOption(this.chartData);


            this.getSuggest();



        })


        

    },
    methods: {
        getSuggest(){
            console.log(this.startObj,288);
            console.log(this.newObj,289);
            var zypos = this.startObj.zy-this.newObj.zy;
            var yypos = this.startObj.yy-this.newObj.yy;

            if((this.newObj.zy>=this.startObj.zy)&&(this.newObj.yy>=this.startObj.yy)){
                this.suggest = this.suggest + "<b>视力：</b>视力正常，请定期检查视力，注意用眼卫生，多做眼保健操<br>"
            }else if((zypos>0&&zypos<=0.1)||(yypos>0&&yypos<=0.1)){
                this.suggest = this.suggest + "<b>视力：</b>视力轻微下降，请去专业眼科医院检查，如为假性近视，请遵医嘱治疗，勿发展为真性近视<br>"
            }else if(zypos>0.1||yypos>0.1){
                this.suggest = this.suggest + "<b>视力：</b>屈光不正，请去专业 眼科医院验光配镜，平时多吃绿色蔬菜，多做户外运动，常晒太阳<br>"
            }

            if(this.newObj.bmi>=28){
                this.suggest = this.suggest + "<b>肥胖：</b>体重超标，请科学减肥，戒除不良生活习惯，必要时专科医院就诊<br>"
            }else if(this.newObj.bmi>=24&&this.newObj.bmi<28){
                this.suggest = this.suggest + "<b>偏胖：</b>多做体育运动，不挑食，不偏食，少吃油炸食品，多吃绿色蔬菜<br>"
            }else if(this.newObj.bmi>=18.5&&this.newObj.bmi<24){
                this.suggest = this.suggest + "<b>正常：</b>体重标准，请继续保持，多做运动，合理膳食<br>"
            }else if(this.newObj.bmi<18.5){
                this.suggest = this.suggest + "<b>偏瘦：</b>多做力量运动，均衡摄入营养	，保持良好睡眠<br>"
            }

        },
        getBMIStr(bmi){
            if(bmi>=18.5&&bmi<24){
                return "正常"
            }else if(bmi>=24&&bmi<28){
                return "微胖"
            }else if(bmi<18.5){
                return "偏瘦"
            }else if(bmi>=28){
                return "肥胖"
            }
        },
        getMb(){
            var njdmNo = parseInt(this.pageInfo.njdm);
            if(njdmNo>=11&&njdmNo<=16){
                this.mbname = "";
            }else{
                this.mbname = "low_1"
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
.physical{
    background: url('/static/report/high/cz_bg.jpg') no-repeat;
    background-size:100% 100%;
    .innerMain{
        padding: 0 32px;
        position: absolute;
        width: 100%;
        top: 187px;
        height: 400px;
        .subTit{
            font-size: 20px;
            height: 40px;
            line-height: 40px;
            font-weight: bold;
            color: #005525;
        }
        .subTit.charts{
            margin-top: 15px;
        }
        .startPhysical{
            border: 2px solid #005223;
            border-radius: 10px;
            overflow: hidden;
            .physicalTable{
                border: none;
                td,th{
                    width: 15%;
                    padding-left: 32px;
                    border: none;
                }
            }
        }

        .physicalTable{
            width: 100%;
            border: none;
            border-top: 8px solid #0b9340;
            border-bottom: 8px solid #0b9340;
            td,th{
                width: 25%;
                padding-left: 32px;
                border: none;
            }
            th{
                height: 46px;
                background: #b5d9a7;
                line-height: 46px;
                color: #005525;
                font-size: 20px;
                text-align: left;
            }
            td{
                height: 62px;
                line-height: 62px;
                background: #FFF;
                color: #171615;
                font-size: 20px;
            }
            .colspan{
                width: 400px;
            }
        }
        .report_tips{
            font-size: 18px;
            color: #0b9340;
            margin:5px 0 20px;
        }
        .physicalEchart{
            height: 390px;
            width: 100%;
            background: #FFFFFF;
            border-radius: 15px;
            margin-bottom: 20px;
            position: relative;
            .chartBox{
                width: 100%;
                height: 100%;
            }
            .sg{
                font-size: 14px;
                color: #00652c;
                position: absolute;
                top:15px;
                left: 20px;
            }
            .sg::after{
                content: '\20';
                width:17px;
                height: 17px;
                background: #a7d47f; 
                position: absolute;
                right: -24px;
                top: 2px;
            }
            .tz{
                font-size: 14px;
                color: #00652c;
                position: absolute;
                top:15px;
                right: 60px;
            }
            .tz::after{
                content: '\20';
                width:17px;
                height: 17px;
                background: #f3af8c; 
                position: absolute;
                right: -24px;
                top: 2px;
            }
        }
        .physicalOpinion{
            font-size: 16px;
            height: 220px;
            line-height: 30px;
            width: 100%;
            background: #FFFFFF;
            border-radius: 15px;
            padding: 20px;
            .physicalCont{
                width: 100%;
                height:100%;
                padding: 15px 20px;
                background: #f1f1f0;
                border-radius: 12px;
            }
        }
    }
}
</style>
