<template>
    <div class="innerTemplate physicalHealth">
        <reportHead :userImgPath="bgdInfo.studentInfo.tx" :userInfo="bgdInfo.bgdxx" :bgd='bgdInfo.bgd'></reportHead>
        
        <div class="tables">
          <div class="title">艺术</div>
          <div class="mainSubjects">
            <!-- <div class="tablebox" v-for="(item,index) in xmList"> -->
              <table v-if="fineArtsItem&&fineArtsItem.length">
                <tr class="green head">
                    <th colspan="10">知识技能</th>
                </tr>
                <tr class="height7"></tr>
                <tr class="odd">
                    <th class="green width154">美术</th>
                    <th v-for="item in fineArtsItem" :colspan="item.rwList.length">{{item.mc}}</th>
                </tr>
                <tr class="height7"></tr>
                <tr>
                    <th class="green width154">等级</th>
                    <td  :class="{'zebra':level.odd}" :title="level.mc" v-for="level in getItemList(fineArtsItem,'rwList')">{{level.twnr||'&#12288;'}}</td>       
                </tr>
              </table>          
              <div class="holdPlace height7"></div>
              <table>
                <tr class="odd">
                    <th class="green width154">音乐</th>
                    <th v-for="item in musicItem" :colspan="item.rwList.length">{{item.mc}}</th>
                </tr>
                <tr class="height7"></tr>
                <tr>
                    <th class="green width154">等级</th>
                    <td  :class="{'zebra':level.odd}" :title="level.mc" v-for="level in getItemList(musicItem,'rwList')">{{level.twnr||'&#12288;'}}</td>          
                </tr>
              </table>
            <!-- </div> -->
            <table>
              <tr class="green head">
                <th :colspan="attitude.length+1">情感态度</th>
              </tr>
              <tr class="height7"></tr>
              <tr>
                <th class="lightGreen width154">项目</th>
                <td v-for="item in attitude">{{item.name}}</td>
              </tr>
              <tr class="height7"></tr>
              <tr>
                <th class="lightGreen width154">美术评价</th>
                <td v-for="item in attitude">{{item.art||'&#12288;'}}</td>
              </tr> 
              <tr class="height7"></tr>
              <tr>
                <th class="lightGreen width154">音乐评价</th>
                <td v-for="item in attitude">{{item.music||'&#12288;'}}</td>
              </tr>              
            </table>
            <table v-if="rewards">
              <tr>
                <th class="green width154">荣誉榜</th>
                <td>
                  <p class="rewards">{{rewards}}</p>
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
            attitude: [],
            artData: null,
            musicData: null,
            fineArtsItem:[],
            musicItem: [],
            rewards: '',
        }
    },
    created(){
        // console.log(this.pageInfo,"艺术");
        this.getBgdData();
    },
    methods: {
      getBgdData(){
        this.artData = _.find(this.bgdInfo.page,(e)=>e.mc.indexOf('美术')>=0)
        this.musicData = _.find(this.bgdInfo.page,(e)=>e.mc.indexOf('音乐')>=0) 
        // 获取知识技能数据
        this.fineArtsItem = this.artData && _.find(this.artData.bgdItemlist[0].xmReportList,{mc: '知识技能'}).zxmList;
        this.musicItem = this.musicData && _.find(this.musicData.bgdItemlist[0].xmReportList,{mc: '知识技能'}).zxmList;
        // 获取情感态度数据
        let tempArr = this.artData && _.find(this.artData.bgdItemlist[0].xmReportList,{mc: '情感态度'}).rwList;    
        tempArr && tempArr.forEach(e=>{
          if(e.mc.indexOf('总评')<0){
            this.attitude.push({
              name: e.mc,
              art:  e.twnr||'',
              music: ''
            })          
          }
        })
        tempArr = this.musicData && _.find(this.musicData.bgdItemlist[0].xmReportList,{mc: '情感态度'}).rwList;
        tempArr && tempArr.forEach(e=>{
          var temp = this.attitude.find(item=>item.name==e.mc);
          if(temp){
            temp.music = e.twnr||''
          }          
        })
        // 获取荣誉榜数据        
        this.rewards =  _.find(this.pageInfo.bgdItemlist[0].xmReportList,{'mc':'荣誉榜'}).rwList[0].twnr;
        
      },
      // 从数组中获取子元素列表
      getItemList(arr,itemName){
        var res = [];
        if(!arr){
          return res;
        }
        arr.forEach(e=>{
          if(e[itemName].length>1){
            // 超过一个子项目的需要显示斑马背景
            e[itemName].forEach((item,index)=>{
              item.odd = index%2==0;
              res.push(item);
            })
          } else {
            // item.odd = false;
            res.push(...e[itemName]);
          }          
        })
        console.log(res,143)
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
.zebra{
  background-color: #f7f7f7;
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
