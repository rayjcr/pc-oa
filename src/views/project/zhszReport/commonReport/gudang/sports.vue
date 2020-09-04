<template>
    <div class="innerTemplate physicalHealth">
        <reportHead :userImgPath="bgdInfo.studentInfo.tx" :userInfo="bgdInfo.bgdxx" :bgd='bgdInfo.bgd'></reportHead>
        
        <div class="tables">
          <div class="title">体育</div>
          <div class="mainSubjects">
            <div class="tablebox" v-for="(item,index) in xmList">
              <table>
                <tr class="green head">
                  <th :colspan="item.rwList.length+1">{{item.mc}}</th>
                </tr>
                <tr class="height7"></tr>
                <tr class="odd">
                  <th class="green width154">项目</th>
                  <th v-for="(sitem,sindex) in item.rwList">{{sitem.mc}}</th>
                </tr>
                <tr class="height7"></tr>
                <tr v-if="showScore">
                  <th class="green width154">成绩</th>
                  <td v-for="(sitem,sindex) in item.rwList">{{sitem.twfz}}</td>
                </tr>
                <tr class="height7"></tr>
                <tr>
                  <th class="green width154">等级</th>
                  <td v-for="(sitem,sindex) in item.rwList">{{sitem.twnr}}</td>
                </tr>
              </table>
              <div class="holdPlace height7"></div>
            </div>
            <table v-if="emotionObj">
              <tr class="green head">
                <th :colspan="emotionObj.rwList.length+1">情感态度</th>
              </tr>
              <tr class="height7"></tr>
              <tr>
                <th class="lightGreen width154">项目</th>
                <td v-for="(item,index) in emotionObj.rwList">{{item.mc}}</td>
              </tr>
              <tr class="height7"></tr>
              <tr>
                <th class="lightGreen width154">评价</th>
                <td v-for="(item,index) in emotionObj.rwList">{{item.twnr}}</td>
              </tr>              
            </table>
            <table v-if="honorObj && honorObj.rwList[0].twnr">
              <tr>
                <th class="green width154">荣誉榜</th>
                <td>
                  <p class="rewards">{{honorObj.rwList[0].twnr}}</p>
                </td>
              </tr>
            </table>
          </div>
        </div>
    </div>
</template>

<script>
import reportHead from './headInfo.vue'
export default {
    name: "setReport",
    components: {
      reportHead
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
          showScore: false,
        }
    },
    created(){
        this.showScore = !(this.bgdInfo.bgd.xn == '2019-2020' && this.bgdInfo.bgd.xq == '02');
        console.log(this.pageInfo,"体育");
        let xmReportList = JSON.parse(JSON.stringify(this.pageInfo.bgdItemlist[0].xmReportList));
        

        this.xmList = _.reject(xmReportList,function(o) {return o.mc=='荣誉榜'||o.mc=='情感态度';})
        this.formatXmList();
        // console.log(this.xmList)
        this.emotionObj = _.find(xmReportList,{'mc':'情感态度'});
        this.honorObj = _.find(xmReportList,{'mc':'荣誉榜'});
        this.rejectRw()
        console.log(this.honorObj)
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

      rejectRw(){
        // for(let i=0;i<this.emotionObj.length;i++){
        this.emotionObj.rwList = _.reject(this.emotionObj.rwList,function(o){
          return o.mc=='平时' || o.mc=='期末' || o.mc=='学科总评';
        })
        // }
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
          &.width154{
            width: 154px;
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
    .healthChart{
      margin: 0 auto;
      margin-top: 15px;
      width: 808px;
      height: 461px;
      background-color: #eefcf0;
    }
    .rewards{
      min-height: 170px;
      text-align: left;
      box-sizing: border-box;
      padding: 15px 17px;
    }
}

</style>
