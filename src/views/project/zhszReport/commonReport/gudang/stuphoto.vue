<template>
    <div class="innerTemplate stuphoto">
        <reportHead :userImgPath="bgdInfo.studentInfo.tx" :userInfo="bgdInfo.bgdxx" :bgd='bgdInfo.bgd'></reportHead>
        
        <div class="photoBox">
          <div class="imgframe" v-for="(item,index) in userPhotoList">
              <img :src="item.tpdz?item.tpdz:''">
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
           userPhotoList:[{},{},{},{},{},{}],
           // pageInfo: null
        }
    },
    mounted(){
      this.getPageInfo();
      // console.log(this.pageInfo,"this.pageInfo");
    },
    methods: {
      getPageInfo(){
        var p =  _.find(this.bgdInfo.page,{"mc":'学生风采'});
        console.log(p,44)
        p.bgdItemlist[0].bgdxsfcList.forEach(e=>{
          this.userPhotoList[Number(e.wz)-1] = e;
        })
        console.log(this.userPhotoList,48)
        // 强制更新
        this.userPhotoList.push({});
        this.userPhotoList.pop()
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
.stuphoto{
    background: url('/static/report/gudang/normal_bg.jpg') no-repeat;
    background-size:100% 100%;
    .photoBox{
      position: relative;
      width: 936px;
      height: 1171px;
      background-color: rgba($color: #fff, $alpha: 0.3);
      border-radius: 16px;
      top: 77px;
      margin: 0 auto;
    }
    
    .imgframe{
      position: absolute;
      height: 426px;
      width: 342px;
      background-color: #fff;  
      .bgwhite{
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        background-color: #fff;  
        z-index: 1;         
      }
      &::after{
        content: '';
        display: block;
        position: absolute;
        height: 446px;
        width: 353px;
        top: 0px;
        left: 0px;
        background-color: #515a3561;
        // -webkit-clip-path: polygon(0 0, 96% 0, 100% 100%, 0 95%);
        // clip-path: polygon(0 0, 96% 0, 100% 100%, 0 95%);
        -webkit-clip-path: polygon(97% 96%, 97% -5%, 100% 100%, -8% 95%);
        clip-path: polygon(97% 96%, 97% -5%, 100% 100%, -8% 95%);
        z-index: 0;
      }
      // &::before{
      //   content: ' ';
      //   display: block;
      //   position: absolute;
      //   left: 50%;
      //   width: 24px;
      //   height: 40px;
      //   background-color: #604696;
      //   margin-left: -12px;
      //   top: -16px;
      //   z-index: 9;
      // }
      img{
        height: 307px;
        width: 307px;
        position: absolute;
        background-color: #ccc;
        left: 15px;
        top: 15px;
        z-index: 3;
      }
    }
    
    .imgframe:nth-child(1){
      transform: rotate(-10deg) scale(0.95);
      top: 128px;
      left: 21px;
      z-index: 2;
    }
    .imgframe:nth-child(2){
      transform: rotate(-1deg);
      top: 15px;
      left: 347px;
      z-index: 1;
    }
    .imgframe:nth-child(3){
      transform: rotate(16deg) scale(0.95);
      left: 565px;
      top: 232px;
      z-index: 2;
    }
    .imgframe:nth-child(4){
      top: 410px;
      left: 240px;
      z-index: 3;
    }
    .imgframe:nth-child(5){
      transform: rotate(-18deg) scale(0.9);
      top: 725px;
      left: 44px;
      z-index: 1;
    }
    .imgframe:nth-child(6){
      transform: rotate(16deg) scale(0.94);
      top: 716px;
      left: 545px;
      z-index: 1;
    }
}

</style>
