<template>
    <div class="innerTemplate growup">

        <div class="growupMain">
           
            <div class="growupSubTit suggest">职业规划</div>
            <div class="suggestMain">
                <div class="suggestBox" v-for="(item,index) in zygh?zygh.mkList:[]">
                    <div class="suggestTit">{{item.bm}}</div>
                    <div class="suggestCont">{{item.fy}}</div>
                </div>
                <!-- <div class="suggestBox">
                    <div class="suggestTit">理由</div>
                    <div class="suggestCont" v-html="suggest"></div>
                </div> -->
            </div>

            <div class="growupSubTit suggest">专业规划</div>
            <div class="suggestMain">
                <div class="bigTit">理想大学(专业):{{dxobj.fy}}</div>
                <div class="suggestBox">
                    <div class="suggestCont wordCenter">
                        <b>{{ysobj.bm}}</b><br>
                        {{ysobj.fy}}
                    </div>
                </div>
                <div class="suggestBox">
                    <div class="suggestCont wordCenter">
                        <b>{{bzobj.bm}}</b><br>
                        {{bzobj.fy}}
                    </div>
                </div>

            </div>

            <div class="growupSubTit suggest">学业规划（本学期）</div>
            <div class="suggestMain minSuggest">
                <div class="suggestBox">
                    <div class="suggestCont">
                        {{xygh?xygh.mkList[0].fy:''}}
                    </div>
                </div>
            </div>

            <div class="growupSubTit suggest">本学期目标</div>
            <table class="scroeTable" cellspacing="0" cellpadding="0">
                <tr>
                    <th class="wordCenter" style="width:150px;">科目</th>
                    <th class="wordCenter" style="width:305px;">初期目标</th>
                    <th class="wordCenter" style="width:150px;">科目</th>
                    <th class="wordCenter" style="width:305px;">初期目标</th>
                </tr>

                <tr  v-for="(item,index) in mbobj">
                    <td style="width:150px;" class="wordCenter">{{item[0].bm}}</td><td class="wordCenter" style="width:305px;">{{item[0].fy}}</td>
                    <td style="width:150px;" class="wordCenter">{{item[1]?item[1].bm:''}}</td><td class="wordCenter" style="width:305px;">{{item[1]?item[1].fy:''}}</td>
                </tr>
            </table>




        </div>
    </div>
</template>

<script>
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
            zygh:{},                    //职业规划
            dxgh:{},                    //专业规划
            xygh:{},                    //学业规划（本学期）
            xqmb:{},                    //本学期目标

            dxobj:{},
            ysobj:{},
            bzobj:{},
            mbobj:[],

            mbname:'',
        }
    },
    created(){
        console.log(this.pageInfo,6699);
        this.zygh = _.find(this.pageInfo.bgdItemlist,{"bm":"职业规划"});
        this.dxgh = _.find(this.pageInfo.bgdItemlist,{"bm":"专业规划"});
        this.xygh = _.find(this.pageInfo.bgdItemlist,{"bm":"学业规划（本学期）"});
        this.xqmb = _.find(this.pageInfo.bgdItemlist,{"bm":"本学期目标"});

        if(!this.dxgh||!this.zygh||!this.xygh||!this.xqmb){
            this.$notify({title:"提示",message:"数据不完整,显示会出现错误",type:"warning"});
            return;
        }
        console.log("123123123");
        this.dxobj = _.find(this.dxgh.mkList,{'bm':'理想大学（专业）'})
        this.ysobj = _.find(this.dxgh.mkList,{'bm':'我的优势'})
        this.bzobj = _.find(this.dxgh.mkList,{'bm':'我的不足'})
        this.mbobj = _.chunk(this.xqmb.mkList,2);
    },
    mounted(){
        


        // this.pjjy = _.find(this.pageInfo.bgdItemlist,{"bm":"评价与建议"}).fy;

        // let Line1 = echarts.init(document.getElementById('lineP1'));
        // console.log(Line1);
        // Line1.setOption(this.chartData);

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
.growup{
    background: url('/static/report/high/gh_bg.jpg') no-repeat;
    background-size:100% 100%;
    .wordCenter{
        text-align: center;
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
    .growupMain{
        position: absolute;
        padding: 0 32px;
        width: 100%;
        top: 187px;
        left: 0;
    }
    .growupSubTit{
        font-size: 20px;
        color: #005525;
        width: 100%;
        height: 36px;
        line-height: 36px;
        margin-top: 15px;
        font-weight: bold;
        float: left;
    }
    .suggestMain{
        width: 100%;
        height: 280px;
        background: #FFFFFF;
        border-radius: 13px;
        float: left;
        .bigTit{
            width: 750px;
            height: 32px;
            line-height: 32px;
            border-radius: 16px;
            background: #dbe494;
            margin: 10px 93px;
            text-align: center;
            font-size: 18px;
            color: #4c7850;
            float: left;
        }
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
                height: 210px;
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
    .suggestMain.minSuggest{
        height: 150px;
        .suggestBox{
            width:100%;
            height: 100%;
            float: left;
            padding: 20px 0;
            .suggestCont{
                width: 96%;
                height: 110px;
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
    
}

</style>
