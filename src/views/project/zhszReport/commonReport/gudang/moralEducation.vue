<template>
    <div class="innerTemplate physicalHealth">
        <reportHead :userImgPath="bgdInfo.studentInfo.tx" :userInfo="bgdInfo.bgdxx" :bgd='bgdInfo.bgd'></reportHead>
        
        <div class="tables">
          <div class="title">德育表现</div>
          <div class="medalTable">
            <table>
              <tr class="green head">
                <th style="width: 30%;">勋章图标</th>
                <th>维度名称</th>
                <th style="width: 30%;">积分</th>
                <!-- <th>获得数量</th> -->
              </tr>
              <tr :class="index%2==0?'odd':''" v-for="(item,index) in tableData">
                <td><img :src="item.medalDimensionIcon" alt=""></td>
                <td>{{ item.medalDimensionName || '&#8195;' }}</td>
                <td>{{ item.scoreNum }}</td>
                <!-- <td>{{ item.medalNum }}</td> -->
              </tr>
            </table>
            <table v-if="ryb && ryb.fy">
              <tr>
                <th class="green width154">荣誉榜</th>
                <td>
                  <p class="rewards">{{ryb.fy}}</p>
                </td>
              </tr>
            </table>
          </div>
          <div class="generalComments">
            <div class="statistics">
              <span v-for="(item,index) in xmList">{{item.mc}} {{item.twfz}} 次</span>
            </div>
            <div class="evaluate">
              学生操行：{{moralObj.twnr}}
            </div>
          </div>
          <div class="healthChart">
            <radarChart :chartData="tableData"></radarChart>
          </div>
        </div>





    </div>
</template>

<script>
import reportHead from './headInfo.vue'
import radarChart from './radarChart.vue'
import * as qualityApi from 'api/projectapp/qualityAppraisal'
export default {
    name: "setReport",
    components: {
      reportHead,
      radarChart
    },
    props:[
       "bgdInfo",
       "pageInfo"
    ],
    data() {
        return {
           userPhotoListS:[0,1,2,3,4,5],
           userPhotoList:[],
           mbname:'',
           userImgPath:"",          //用户头像路径
           tableData:[],
           xmList:[],       //除去操行的其他项目
           moralObj:{},     //学生操行对象
           ryb: null,         //荣誉榜对象
        }
    },
    mounted(){
      console.log(this.pageInfo,"德育的pageInfo")
      let dyXmList = _.find(this.pageInfo.bgdItemlist,{'bm':'德育表现'}).xmReportList;
      this.ryb = _.find(this.pageInfo.bgdItemlist,{'bm':'荣誉榜'});
      if(dyXmList.length){
        let rwList = _.find(dyXmList,{'mc':'德育表现'}).rwList;
        if(rwList){
          this.xmList = _.reject(rwList,{'mc':"学生操行"});
          this.moralObj = _.find(rwList,{'mc':'学生操行'});          
        }
      }  
      
      this.getMedalData();
    },
    methods: {
      async getMedalData(){
        var params = {
          schoolYear: this.bgdInfo.bgd.xn,
          term: this.bgdInfo.bgd.xq,
          userId: this.bgdInfo.bgdxx.xh
        }
        var res = await qualityApi.dimensionMedalScore(params);
        console.log(res,"resres")
        this.tableData = res || [];
      }
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

.physicalHealth{
    background: url('/static/report/gudang/normal_bg.jpg') no-repeat;
    background-size:100% 100%;
    .tables{
      width: 840px;    
      min-height: 1171px;
      background-color: rgba($color: #fff, $alpha: 0.8);
      border-radius: 16px;
      position: relative;
      top: 77px;
      margin: 0 auto;
      padding-bottom: 15px;
      .title{
        width: 100%;
        height: 66px;
        background-color: #33aa44;
        border-radius: 16px 16px 0px 0px;
        font-size: 29px;
        line-height: 66px;
        text-align: center;
        font-weight: bold;
        color: #fff;
      }
      table{
        height: 100%;
        width: 100%;
        text-align: center;
        background-color: #fff;
        .alignLeft{
          text-align: left;
        }
        .textIndent{
          text-indent: 15px;
        }
        th{
          color: #4c5058;
          font-size: 24px;
          text-align: center;
          &.green{
            background-color: #bdf5c5;
          }
          &.width154{
            width: 134px;
          }
        }
        td{
          color: #4c5058;
          font-size: 19px;
        }
        tr{
          height: 72px;
          &.head{
            height: 57px;
          }
          &.odd{
            background-color: #eefcf0;
          }
          &.green{
            background-color: #bdf5c5;
          }
        }
      }
    }
    .medalTable{
      width: 100%;
      padding: 0 16px;
      margin-top: 15px;
      img{
        height: 52px;
      }
    }
    .generalComments{
      width: 100%;
      // height: 227px;
      padding: 0 16px;
      margin-top: 32px;
      color: #4c5058;
      font-size: 24px;
      .statistics{
        margin-left: 12px;
        margin-right: 56px;
        display: flex;
        justify-content: space-between;
        position: relative;
        &::before{
          content: '';
          position: absolute;
          width: 5px;
          height: 25px;
          background-color: #41d285;
          border-radius: 2px;
          left: -12px;
          top: 5px;
        }
      }
      .evaluate{
        margin-top: 28px;
        margin-left: 12px;
        position: relative;
        &::before{
          content: '';
          position: absolute;
          width: 5px;
          height: 25px;
          background-color: #f4bf3a;
          border-radius: 2px;
          left: -12px;
          top: 5px;
        }
        
      }
    }
    .healthChart{
      margin: 0 auto;
      margin-top: 30px;
      width: 808px;
      height: 322px;
      background-color: #eefcf0;
    }
    .rewards{
      min-height: 112px;
      text-align: left;
      box-sizing: border-box;
      padding: 15px 17px;
    }
}

</style>
