<template>
    <div class="innerTemplate cover">
        <div class="reportTit">
            {{bgdInfo.bgd.xn}}{{bgdInfo.bgd.xq=="01"?"第一学期":"第二学期"}}
            <!-- 2018-2019第二学期 -->
        </div>

        <div class="userHead">
            <img :src="userImgPath?userImgPath:'/static/report/mrhead.png'">
        </div>
        <div class="userName">
            {{userInfo.xm}}
        </div>
        <div class="userBj">
            {{userInfo.bjmc}}
        </div>

        <div class="sign" :class="{'has':(signImg!='')}">
            <img v-if="signImg!=''" class="signImg" :src="signImg">
        </div>
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

            //获取用户基础信息
            //var res = await reportBase.getUserInfoByCode({xxdm:localStorage.getItem('xxdm'),usercode:this.bgdInfo.xh});
            //this.userInfo = res.data
            //获取签名
            if(this.pageInfo.bgdItemlist[0].bgdqmModels){
                this.signImg = this.pageInfo.bgdItemlist[0].bgdqmModels[0]?this.pageInfo.bgdItemlist[0].bgdqmModels[0].qm:'';
            }

            if(this.userImgPath){
                this.userImgPath = this.bgdInfo.studentInfo.tx;
            }
            // console.log(res,46);
            this.userInfo = this.bgdInfo.bgdxx;
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
    background: url('/static/report/high/cover.jpg') no-repeat;
    background-size:100% 100%;
    .reportTit{
        position: absolute;
        width: 80%;
        height: 200px;
        top: 725px;
        left: 10%;
        font-size: 32px;
        line-height: 70px;
        background: url('/static/report/high/coverTit.png') no-repeat center bottom;
        // font-weight: bold;
        color: #322e30;
        text-align: center;
    }
    .userHead{
        width: 210px;
        height: 210px;
        // border: 12px solid rgba($color: #FFFFFF, $alpha: .35);
        border-radius: 50%;
        overflow: hidden;
        position: absolute;
        top: 343px;
        left: 388px;
        img{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 100%;
            border-radius: 50%;
        }
    }
    .userName{
        font-size: 36px;
        background: #d7ae33;
        color: #FFF;
        width: 210px;
        height: 55px;
        line-height: 55px;
        text-align: center;
        position: absolute;
        top: 536px;
        left: 387px;
    }
    .userBj{
        font-size: 34px;
        color: #322e30;
        width: 500px;
        height: 55px;
        line-height: 53px;
        text-align: center;
        position: absolute;
        top: 610px;
        left: 250px;
    }
    .sign{
        width: 230px;
        height: 115px;
        background: rgba($color: #FFF, $alpha: .2);
        position: absolute;
        top: 1140px;
        left: 700px;
        border: 1px dotted #c6c3af;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .sign:after{
        content: '班主任签字';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        -webkit-transform: translate(-50%,-50%);
        font-size: 20px;
        color: #b6b0af;
    }
    .sign.has:after{
        display: none;
    }

}
</style>
