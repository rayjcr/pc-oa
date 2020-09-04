<template>
    <div class="innerTemplate cover">
        <div class="schoolTitle">
          <div class="schoolLogo"></div>
          <div class="schoolName">
          </div>
        </div>
        <div class="xnxq">{{bgdInfo.bgd.xn.split('-')[0]}}学年{{bgdInfo.bgd.xq=='01'?'第一学期':'第二学期'}}</div>
        <div class="reportTit">学生综合素质<br>报告单</div>

        <div class="userHead" v-if="showUserImg">
            <div class="imgBox">
                <img :src="userImgPath?userImgPath:'/static/report/common/_testuser.jpg'">
            </div>
        </div>

        <div class="userName" :class="{'noimg':!showUserImg}"  v-if="userInfo">{{userInfo.xm}}</div>
        <div class="className" :class="{'noimg':!showUserImg}" v-if="userInfo">{{userInfo.bjmc}}</div>
<!--        <div class="teacherSign" :class="{'placeHolder':!signImg}" v-if="userInfo">
          <img v-if="signImg!=''" class="signImg" :src="signImg">
          <span v-else>班主任签名</span>
        </div> -->
    </div>
</template>

<script>
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
           userInfo:null,
           userImgPath:"",          //用户头像路径
           signImg:"",
           showUserImg: false,
        }
    },
    mounted(){
        console.log(this.pageInfo,"this.pageInfo");
        this.init();
        this.showUserImg = !(this.bgdInfo.bgd.xn == '2019-2020' && this.bgdInfo.bgd.xq == '02');
    },
    methods: {
        async init(){
            this.userImgPath = this.bgdInfo.studentInfo.tx

            this.userInfo = this.bgdInfo.bgdxx;

            // //获取用户基础信息
            // //var res = await reportBase.getUserInfoByCode({xxdm:localStorage.getItem('xxdm'),usercode:this.bgdInfo.xh});
            // //this.userInfo = res.data
            //获取签名
            if(this.pageInfo.bgdItemlist[0].bgdqmModels){
                this.signImg = this.pageInfo.bgdItemlist[0].bgdqmModels[0]?this.pageInfo.bgdItemlist[0].bgdqmModels[0].qm:'';
            }

            // if(this.userImgPath){
            //     this.userImgPath = this.bgdInfo.studentInfo.tx;
            // }
            // // console.log(res,46);
            // this.userInfo = this.bgdInfo.bgdxx;
        },
    },
    // watch:{
    //     bgdInfo(val){
    //         this.init();            
    //     }
    // }
}
</script>

<style scoped lang="scss">
  @font-face{
    font-family: 'Tensentype-BoDangXingKaiJ';
    src: url('/static/report/gudang/txbdxk.ttf');
  }
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
.cover{
    background: url('/static/report/gudang/cover_bg.jpg') no-repeat;
    background-size:100% 100%;
    .schoolTitle{
      display: flex;
      align-items: center;
      position: absolute;
      left: 103px;
      top: 55px;
      .schoolLogo{
        height: 66px;
        width: 53px;
        background: url('/static/report/gudang/school_logo.png') no-repeat;
        background-size: 100% 100%;
        margin-right: 30px;
      }
      .schoolName{
        height: 77px;
        width: 336px;
        background: url('/static/report/gudang/school_name.png') no-repeat;
        background-size: 100% 100%;        
      }
    }
    .xnxq{
        font-size: 40px;
        color: rgba($color: #058937, $alpha: 0.7);
        position: absolute;
        top: 307px;
        width: 80%;
        left: 10%;
        text-align: center;
        font-family: Tensentype-BoDangXingKaiJ;
    }
    .reportTit{
        font-size: 89px;
        line-height: 96px;
        color: #058937;
        font-family: Tensentype-BoDangXingKaiJ;
        width: 100%;
        text-align: center;
        position: absolute;
        top: 395px;
        left: 50%;
        transform: translateX(-50%);
    }
    .userHead{
        width: 202px;
        height: 202px;
        border:12px solid #FFF;
        background: #FFF;
        overflow: hidden;
        border-radius: 12px;
        position: absolute;
        top: 706px;
        left: 399px;
        .imgBox{
            width: 100%;
            height: 100%;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
        }
    }
    .userName{
        width: 400px;
        height: 50px;
        position: absolute;
        top: 928px;
        left: 300px;
        text-align: center;
        font-size: 48px;
        line-height: 50px;
        font-weight: bold;
        color: #058937;
        &.noimg{
          top: 726px;
        }
    }
    .className{
        width: 400px;
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 997px;
        left: 300px;
        text-align: center;
        font-size: 30px;
        color: #058937;
        &.noimg{
          top: 795px;
        }
    }
    .teacherSign{
      	width: 187px;
      	height: 122px;
      	border-radius: 2px;
      	font-size: 29px;
        line-height: 122px;
        text-align: center;
        color: rgba($color: #fff, $alpha: 0.5);
        position: absolute;
        left: 701px;
        top: 1136px;
        &.placeHolder{
            background-color: rgba($color: #000, $alpha: 0.2);            
        }
        img{
          height: 100%;
          width: 100%;
        }
    }
}
</style>
