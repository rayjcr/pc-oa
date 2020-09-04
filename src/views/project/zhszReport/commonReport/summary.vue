<template>
    <div class="innerTemplate summary" :class="xjNew?'summaryNew':''">
        <div class="xnxq">{{bgdInfo.bgd.xn}}学年{{bgdInfo.bgd.xq=="01"?"第一学期":"第二学期"}}报告单</div>
        <div class="reportTit"></div>

        <div class="userHead">
            <div class="imgBox">
                <img :src="userImgPath?userImgPath:'/static/report/common/_testuser.jpg'">
            </div> 
            <div class="userInfo">
                <div class="userName">{{userInfo.xm}}</div>
                <div class="className">{{userInfo.bjmc}}</div>
            </div> 
        </div>

        <div class="tableMain">
            <div class="tableTit">学科素养</div>
            <div class="tableData">
                <table class="xkData" :class="xjNew?'height50':''">
                    <tr><th width="160">学科</th><th>总评</th><th width="160">学科</th><th>总评</th><th width="160">学科</th><th>总评</th></tr>
                    <tr v-for="(item,index) in xksyList">
                        <template  v-for="(sitem,sindex) in item">
                            <td>{{sitem.mc}}</td><td>{{sitem.rwList[0].djz}}</td>
                        </template>
                        <template v-if="item.length%3!=0" v-for="blank in (3-item.length%3)">
                            <td></td><td></td>
                        </template>
                    </tr>
                </table>
            </div>

            <div class="tableTit">德育表现</div>
            <div class="tableData">
                <table class="xkData" :class="xjNew?'height50':''">
                    <tr><th width="160" colspan="2">勋章名称</th><th>获得数量</th><th width="160" colspan="2">勋章名称</th><th>获得数量</th></tr>

                    <tr v-for="(item,index) in dybxList">
                        <template v-for="(sitem,sindex) in item">
                            <td colspan="2">{{sitem.medalName}}</td><td>{{sitem.medalNum}}</td>
                        </template>
                        <template v-if="item.length%2!=0" v-for="blank in item.length%2">
                            <td colspan="2"></td><td></td>
                        </template>
                    </tr>
                    <tr><th width='15%'>总积分</th><td  width='15%'>{{dybxData.totalScore}}</td><th  width='15%'>加分</th><td  width='15%'>{{dybxData.addScore}}</td><th  width='15%'>扣分</th><td  width='15%'>{{dybxData.deductScore}}</td></tr>
                </table>
            </div>
            
            <div v-if="!xjNew">
              <div class="tableTit">社团课程</div>
              <div class="tableData">
                  <table class="xkData">
                      <tr><th width="160">课程名称</th><th width='100'>等级</th><th>我的感想</th></tr>
                      <tr><td>{{stkcData[0]?stkcData[0].fy:''}}</td><td>{{stkcData[1]?stkcData[1].fy:''}}</td><td>{{stkcData[2]?stkcData[2].fy:''}}</td></tr>
                  </table>
              </div>

              <div class="tableTit">实践活动</div>
              <div class="tableData">
                  <table class="xkData">
                      <tr><th width="160">小岗位社团</th><th width='100'>参加次数</th><th>我的收获</th></tr>
                      <tr v-for="(item,index) in xgwstData">
                          <td v-for="(sitem,sindex) in item.bgdItemlist">{{sitem.fy}}</td>
                      </tr>

                      <tr><th width="160">公益活动</th><th width='100'>参加次数</th><th>我的收获</th></tr>
                      <tr v-for="(item,index) in gyhdData">
                          <td v-for="(sitem,sindex) in item.bgdItemlist">{{sitem.fy}}</td>
                      </tr>
                      
                  </table>
              </div>              
            </div>


        </div>

        
    </div>
</template>

<script>
import {GetReportTemplate} from 'api/project/report/index';
// import * as reportBase from 'api/project/report/base';
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
            userInfo:{},
            userImgPath:"",
            xksyData:[],
            xksyList:[],
            dybxData:[],
            dybxList:[],
            stkcData:[],
            xgwstData:[],
            gyhdData:[],
            xjNew: false,

        }
    },
    mounted(){
        this.init();
    },
    methods: {
        async GetReportTemplate(){
          var res = await GetReportTemplate({id:this.bgdInfo.bgd.mbid});
          if(res.mbdm=='D07'){
            this.xjNew = true;
          }
        },
        async init(){
            await this.GetReportTemplate();
            this.userImgPath = this.bgdInfo.studentInfo.tx
            this.userInfo = this.bgdInfo.bgdxx;

            // console.log(this.pageInfo,"统计的页面数据")
            if(!this.xjNew){
                this.xksyData = _.find(this.pageInfo.bgdItemlist,{bm:"学科素养"}).xmReportList
                this.dybxData = _.find(this.pageInfo.bgdItemlist,{lx:20}).reportCardEvaluation
                this.stkcData = _.find(this.pageInfo.bgdItemlist,{bm:"社团课程"}).mkList
                this.xgwstData = _.find(this.pageInfo.bgdItemlist,{bm:"小岗位社团"}).krxxList
                this.gyhdData = _.find(this.pageInfo.bgdItemlist,{bm:"公益活动"}).krxxList                
            } else {
                var xksyData = _.find(this.pageInfo.bgdItemlist,{bm:"学科素养"});
                this.xksyData = xksyData?xksyData.xmReportList:[];
                var dybxData = _.find(this.pageInfo.bgdItemlist,{lx:20}) 
                this.dybxData = dybxData?dybxData.reportCardEvaluation:[];              
            }


            // console.log(this.xksyData,"this.xksyData")
            // console.log(this.dybxData,"this.dybxData")
            // console.log(this.stkcData,"this.stkcData")
            // console.log(this.xgwstData,"this.xgwstData")
            // console.log(this.gyhdData,"this.gyhdData")
            
            //整理以下3个一排学科素养
            this.xksyList = _.chunk(this.xksyData,3);

            //整理以下2个一排德育表现
            this.dybxList = _.chunk(this.dybxData.reportCardMedalVOS,2);


            // console.log(this.xksyList,"this.xksyList")


            // this.userImgPath = this.bgdInfo.studentInfo.tx
            // this.userInfo = this.bgdInfo.bgdxx;
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
    // transform: scale(.7);
    // transform-origin: top left;
    position: relative;
    // zoom:.7;
    float: left;
}
.summary{
    background: url('/static/report/common/summary.jpg') no-repeat;
    background-size:100% 100%;
    &.summaryNew{
      background: url('/static/report/common/summary1.jpg') no-repeat;      
    }
    .xnxq{
        width: 386px;
        height: 48px;
        border-radius: 24px;
        background: #8adeff;
        position: absolute;
        top: 39px;
        left: 79px;
        font-size: 24px;
        color: #13327d;
        text-align: center;
        line-height: 48px;
        font-weight: bold;
    }
    .userHead{
        position: absolute;
        top: 39px;
        right: 80px;
        .userInfo{
            overflow: hidden;
            text-align: right;
            padding-right: 10px;
            .userName{
                font-size: 22px;
                color: #FFF;
                font-weight: bold;
                line-height: 28px;
            }
            .className{
                font-size: 18px;
                color: #FFF;
                line-height: 28px;
            }
        }
        .imgBox{
            width: 56px;
            height: 56px;
            border-radius: 4px;
            position: relative;
            overflow: hidden;
            float: right;
            img{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }
    .tableMain{
        position: absolute;
        top: 250px;
        left: 135px;
        width: 730px;
        .tableTit{
            color: #13327d;
            font-size: 19px;
            position: relative;
            padding-left: 15px;
            font-weight: bold;
            margin-top: 30px;
        }
        .tableTit:after{
            content: '\20';
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background: #00a5d7;
            position: absolute;
            top: 10px;
            left: 0;
        }
    }
    .xkData{
        width: 100%;
        margin-top: 5px;
        border-collapse: collapse;
        border: none;
        &.height50{
          // height: 40%;
          th,td{
            line-height: 60px;
            font-size: 20px;
          }
        }
    }
    .xkData td,.xkData th{
        border: 1px solid #1a3a82;
        height:30px;
        line-height: 30px;
        text-align: center;
    }
    .xkData th{
        font-weight: bold;
    }

}
</style>
