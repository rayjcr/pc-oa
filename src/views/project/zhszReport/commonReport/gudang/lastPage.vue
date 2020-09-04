<template>
    <div class="innerTemplate physicalHealth">
        <reportHead :userImgPath="bgdInfo.studentInfo.tx" :userInfo="bgdInfo.bgdxx" :bgd='bgdInfo.bgd'></reportHead>
        
        <div class="tables">
          <div class="physicalQuality">
            <table>
              <tr>
                <th class="green">出勤记载</th>
              </tr>
              <tr class="height7"></tr>
              <tr class="odd">
                <td class="left">
                  应出勤{{cq}}天，事假{{sj}}天，病假{{bj}}天，迟到{{cd}}天。
                </td>
              </tr>
              <tr class="height17"></tr>
              <tr>
                <th class="green">通知</th>
              </tr>
              <tr class="height7"></tr>
              <tr class="odd">
                <td class="left">
                  {{tz}}
                </td>
              </tr>
            </table>
            <div class="teacherSay">
              <p>{{xszp}}</p>
            </div>
           <div class="parentsSay" v-show="jzpjShow">
              <p>{{jzpj}}</p>
            </div>
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
           userPhotoListS:[0,1,2,3,4,5],
           userPhotoList:[],
           mbname:'',
           userImgPath:"",          //用户头像路径
           cq:'',           //应出勤
           sj:'',           //事假
           bj:'',           //病假
           cd:'',           //迟到
           tz:'',           //通知
           xszp: '',        //班主任寄语
           jzpj: '',        //家长评价,
           jzpjShow: false, //是否展示父母寄语
        }
    },
    mounted(){
      console.log(this.pageInfo,"最后一页数据");

      this.getPageInfo();
    },
    methods: {
      getPageInfo(){
        this.cq = _.find(this.pageInfo.bgdItemlist,{bm:"应出勤"}).fy || '0';       
        this.sj = _.find(this.pageInfo.bgdItemlist,{bm:"事假"}).fy || '0';   
        this.bj = _.find(this.pageInfo.bgdItemlist,{bm:"病假"}).fy || '0';   
        this.cd = _.find(this.pageInfo.bgdItemlist,{bm:"迟到"}).fy || '0';    
        this.tz = _.find(this.pageInfo.bgdItemlist,{bm:"通知"}).fy; 
        this.xszp = _.find(this.pageInfo.bgdItemlist,{bm:"班主任寄语"}).fy;   
        this.jzpj = _.find(this.pageInfo.bgdItemlist,{bm:"爸爸妈妈对我说"}).fy;  
        this.jzpjShow = !(this.bgdInfo.bgd.xn == '2019-2020' && this.bgdInfo.bgd.xq == '02');
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
        // background-color: #fff;
        th{
          color: #4c5058;
          font-size: 24px;
          text-align: center;
          &.green{
            background-color: #bdf5c5;
          }
        }
        td{
          color: #4c5058;
          font-size: 19px;
          // text-indent: 15px;
          &.left{
            padding-left: 15px;
            text-align: left;
          }
        }
        tr{
          height: 57px;
          &.odd{
            background-color: #eefcf0;
          }
          &.height7{    
            height: 7px;
          }
          &.height17{    
            height: 17px;
          }
        }
      }
    }
    .physicalQuality{
      width: 100%;
      height: 283px;
      padding: 16px;
      margin-top: 15px;
    }
    .teacherSay{
      width: 100%;
      height: 408px;
      margin-top: 31px;
      background: url('/static/report/gudang/teacherSay.png') no-repeat;      
      background-size:100% 100%;
      p{
        position: relative;
        white-space: pre-wrap;
        left: 46px;
        top: 42px;
        width: 500px;
        height: 340px;
        font-size: 20px;
      }
    }
    .parentsSay{
      width: 100%;
      height: 284px;
      margin-top: 31px;
      background: url('/static/report/gudang/parentsSay.png') no-repeat;      
      background-size:100% 100%;
      p{
        position: relative;
        white-space: pre-wrap;
        left: 260px;
        top: 30px;
        width: 500px;
        height: 235px;
        font-size: 20px;
      }
    }
}

</style>
