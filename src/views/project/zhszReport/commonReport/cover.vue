<template>
    <div class="innerTemplate cover">
        <div class="xnxq">{{bgdInfo.bgd.xn}}学年{{bgdInfo.bgd.xq=="01"?"第一学期":"第二学期"}}</div>
        <div class="reportTit"></div>

        <div class="userHead">
            <div class="imgBox">
                <img :src="userImgPath?userImgPath:'/static/report/common/_testuser.jpg'">
            </div>
        </div>

        <div class="userName">{{userInfo.xm}}</div>
        <div class="className">{{userInfo.bjmc}}</div>

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
           userInfo:{},
           userImgPath:"",          //用户头像路径
           signImg:"",
        }
    },
    mounted(){
        this.init();
    },
    methods: {
        async init(){
            this.userImgPath = this.bgdInfo.studentInfo.tx

            this.userInfo = this.bgdInfo.bgdxx;

            // //获取用户基础信息
            // //var res = await reportBase.getUserInfoByCode({xxdm:localStorage.getItem('xxdm'),usercode:this.bgdInfo.xh});
            // //this.userInfo = res.data
            // //获取签名
            // if(this.pageInfo.bgdItemlist[0].bgdqmModels){
            //     this.signImg = this.pageInfo.bgdItemlist[0].bgdqmModels[0]?this.pageInfo.bgdItemlist[0].bgdqmModels[0].qm:'';
            // }

            // if(this.userImgPath){
            //     this.userImgPath = this.bgdInfo.studentInfo.tx;
            // }
            // // console.log(res,46);
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
.cover{
    background: url('/static/report/common/cover.jpg') no-repeat;
    background-size:100% 100%;
    .xnxq{
        font-size: 38px;
        color: #13327d;
        text-shadow:-.03em -.03em 0 #FFF,         
        .03em -.03em 0 #FFF,         
        -.03em  
        .03em 0 #FFF,         
        .03em  .03em 0 #FFF;
        position: absolute;
        top: 355px;
        width: 80%;
        left: 10%;
        text-align: center;
    }
    .reportTit{
        width: 688px;
        height: 114px;
        background: url('/static/report/common/reportTit.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 450px;
        left: 156px;
    }
    .userHead{
        width: 202px;
        height: 202px;
        border:12px solid #FFF;
        background: #FFF;
        overflow: hidden;
        border-radius: 12px;
        position: absolute;
        top: 760px;
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
        top: 980px;
        left: 300px;
        text-align: center;
        font-size: 48px;
        line-height: 50px;
        font-weight: bold;
        color: #FFF;
    }
    .className{
        width: 400px;
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 1040px;
        left: 300px;
        text-align: center;
        font-size: 30px;
        color: #FFF;
    }
}
</style>
