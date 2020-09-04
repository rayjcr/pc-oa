<template>
    <div class="innerTemplate message">
       
        <!-- <div class="messageTit">校长寄语</div> -->
        <div class="jyCont" v-html="xzmessage">
        </div>

        <div class="sign"><img :src="qm"></div>

    </div>
</template>

<script>
import  * as creditapi from "api/project/creditInquiry/index";
import _ from 'lodash';
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
            bgdId:"",
            setRes:{},
            xzmessage:"",
            qm:"",
        }
    },
    mounted(){
        if(_.find(this.pageInfo.bgdItemlist[0].bgdqmModels,{"zc":"校长"})){
            this.qm = _.find(this.pageInfo.bgdItemlist[0].bgdqmModels,{"zc":"校长"}).qm;
        }
        // this.bgdId = this.$route.query.bgdId;
        this.init();
        // let Line1 = echarts.init(document.getElementById('lineP1'));
        // console.log(Line1);
        // Line1.setOption(this.chartData);

    },
    methods: {
        async init(){

            this.xzmessage = _.find(this.bgdInfo.bgdItemlist,{"bm":"校长寄语"})?_.find(this.bgdInfo.bgdItemlist,{"bm":"校长寄语"}).fy:'';
            this.xzmessage = this.replaceAllNr(this.xzmessage);
            // console.log(this.xzmessage);
        },

        replaceAllNr(str){
            if(str!=null)
            str = str.replace(/\n/g,"<br>")
            return str;
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
    position: relative;
    // transform: scale(.7);
    // transform-origin: top left;
    // zoom:.7;
    float: left;
}
.message{
    background: url('/static/report/high/jy_bg.jpg') no-repeat;
    overflow: hidden;
    background-size:100% 100%;
    padding-top: 145px;
    .messageTit{
        font-size: 36px;
        color: #171615;
        font-weight: bold;
        text-align: center;
    }
    .jyCont{
        width: 800px;
        margin: 0 auto;
        margin-top: 30px;
        font-size: 15px;
        line-height: 26px;
        /deep/ p{
            text-indent: 2em;
            margin: 5px 0;
        }
    }
    .sign{
        width: 210px;
        height: 105px;
        position: absolute;
        border: 1px dashed #b5b1aa;
        top:1040px;
        left: 560px;
        img{
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 2;
        }
    }
    // .sign::after{
    //     content: '校长签字';
    //     font-size: 18px;
    //     color: #d7d7d4;
    //     width: 100%;
    //     text-align: center;
    //     position: absolute;
    //     top: 40px;
    //     left: 0;
    // }

    
}
</style>
