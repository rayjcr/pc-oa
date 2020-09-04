<template>
    <div class="innerTemplate physicalHealth">
        <reportHead :userImgPath="bgdInfo.studentInfo.tx" :userInfo="bgdInfo.bgdxx" :bgd='bgdInfo.bgd'></reportHead>
        
        <div class="tables">
          <div class="title">{{this.pageInfo.mc}}</div>
          <div class="mainSubjects">
            <div class="tablebox" v-for="(item,index) in xmList">
              <table>
                <tr class="green">
                  <th :colspan="item.rwList.length">{{item.mc}}</th>
                </tr>
                <tr class="odd">
                  <td v-for="(sitem,sindex) in item.rwList">{{sitem.mc}}</td>
                </tr>
                <tr>
                  <td v-for="(sitem,sindex) in item.rwList">{{sitem.twnr}}</td>
                </tr>
              </table>
            </div>
            <div class="tablebox">
              <table v-if="emotionObj">
                <tr class="green">
                  <th :colspan="emotionObj.rwList.length+1">{{emotionObj.mc}}</th>
                </tr>
                <tr class="height7"></tr>
                <tr>
                  <th class="lightGreen width136">项目</th>
                  <td v-for="(item,index) in emotionObj.rwList">{{item.mc}}</td>
                </tr>
                <tr class="height7"></tr>
                <tr>
                  <th class="lightGreen width136">评价</th>
                  <td v-for="(item,index) in emotionObj.rwList">{{item.twnr}}</td>
                </tr>                
              </table>
            </div>
            <div class="tablebox" v-if="honorObj.rwList[0].twnr">
              <table>                
                <tr>
                  <th class="green width136">荣誉榜</th>
                  <td>
                    <p class="rewards">{{honorObj.rwList[0].twnr}}</p>
                  </td>
                </tr>
              </table>
            </div>
            <div class="subjectChart marginTop7">
              <radarChart :radarData="radarData" :special="this.pageInfo.mc.indexOf('英语')>=0"></radarChart>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import reportHead from './headInfo.vue'
import radarChart from './radarChartWithTL.vue'
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
           mbname:'',
           userImgPath:"",          //用户头像路径
           xmList:[],
           emotionObj:{},
           honorObj:{},
           radarData:[],
        }
    },
    created(){
        // console.log(this.pageInfo,"当前课程页面");
        let xmReportList = JSON.parse(JSON.stringify(this.pageInfo.bgdItemlist[0].xmReportList));
        this.xmList = _.reject(xmReportList,function(o) {return o.mc=='荣誉榜'||o.mc=='情感态度';})
        // console.log(this.xmList)
        this.emotionObj = _.find(xmReportList,{'mc':'情感态度'});
        this.honorObj = _.find(xmReportList,{'mc':'荣誉榜'});
        console.log(this.honorObj)
        this.formatXmList();
        this.formatRadarData();
    },
    watch:{
      pageInfo(val){
        // console.log(this.pageInfo,"当前课程页面");
        let xmReportList = JSON.parse(JSON.stringify(this.pageInfo.bgdItemlist[0].xmReportList));
        this.xmList = _.reject(xmReportList,function(o) {return o.mc=='荣誉榜'||o.mc=='情感态度';})
        // console.log(this.xmList)
        this.emotionObj = _.find(xmReportList,{'mc':'情感态度'});
        this.honorObj = _.find(xmReportList,{'mc':'荣誉榜'});
        console.log(this.honorObj)
        this.formatXmList();
        this.formatRadarData();        
      }
    },
    methods: {
      /**
       * 整理xmList数据.排除平时 和 期末 任务
       */
      formatXmList(){
        for(let i=0;i<this.xmList.length;i++){
          this.xmList[i].rwList = _.reject(this.xmList[i].rwList,function(o){
            return o.mc=='平时' || o.mc=='期末' || o.mc=='学科总评';
          })
        }
        console.log(this.xmList,"整理后的")
      },

      formatRadarData(){
        for(let i=0;i<this.xmList.length;i++){
          this.radarData.push({'name':this.xmList[i].mc,'rwList':[]})
          for(let j=0;j<this.xmList[i].rwList.length;j++){
            this.radarData[i].rwList.push({'name':this.xmList[i].rwList[j].mc,'val':this.xmList[i].rwList[j].twnr})
          }
        }
      },

      // 从数组中获取子元素列表
      getItemList(arr,itemName){
        var res = [];
        arr.forEach(e=>{
          res.push(...e[itemName]);
        })
        return res;
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
.holdPlace{
  width: 100%;
  display: block;
  &.height7{    
    height: 7px;
  }
}
.marginTop7{
  margin-top: 7px;
}
.physicalHealth{
    background: url('/static/report/gudang/normal_bg.jpg') no-repeat;
    background-size:100% 100%;
    .tables{
      width: 840px;
      height: 1171px;
      background-color: rgba($color: #fff, $alpha: 0.8);
      border-radius: 16px;
      position: relative;
      top: 77px;
      margin: 0 auto;
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
        &+table{
          margin-top: 15px;
        }
        // background-color: #fff;
        th{
          color: #4c5058;
          font-size: 24px;
          text-align: center;
          &.green{
            background-color: #bdf5c5;
          }
          &.lightGreen{
            background-color: #eefcf0;
          }
          &.width136{
            width: 136px;
          }
        }
        td{
          color: #4c5058;
          font-size: 19px;
        }
        tr{
          height: 57px;
          background-color: #fff;
          &.height7{
            height: 7px;
          }
          &.head{            
            height: 57px;
          }
          &.odd{
            background-color: #eefcf0;
          }
          &.green{
            background-color: #bdf5c5;
          }
          &.grey{
            background-color: #f7f7f7;
          }
          &.borderTop{
            border-top: 7px solid #fff;
          }
        }
      }
    }
    .mainSubjects{
      width: 100%;
      // height: 283px;
      padding: 0 16px;
      margin-top: 15px;  
      padding-bottom: 15px;
      box-sizing: border-box;
      display: flex;
      flex-flow: column;
      height: calc(100% - 66px - 15px);
    }
    .suggestion{
      width: 100%;
      height: 227px;
      padding: 0 16px;
      margin-top: 15px;
      .green{
        width: 121px;
      }
      .suggestText{
        height: 100%;
        width: 100%;
        padding: 23px 24px;
        text-align: left;
      }
    }
    .subjectChart{
      flex-grow: 1;
      background-color: #eefcf0;
    }
    .tablebox{
      margin-bottom: 7px;
    }
    .rewards{
      min-height: 114px;
      text-align: left;
      box-sizing: border-box;
      padding: 15px 17px;
    }
}

</style>
