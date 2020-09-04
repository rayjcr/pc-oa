<template>
    <div class="innerTemplate backcover">
        <div class="reportTit">学校简介</div>
        <div class="reportTit_2">注意事项</div>

        <div class="infoMain" v-html="xxjj">  
        </div>

        <div class="infoMain_2" v-html="zysx">
        </div>


    </div>
</template>

<script>
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
            xxjj:"",
            zysx:"",
            mbname:'',
        }
    },
    mounted(){
        // this.bgdId = this.$route.query.bgdId;
        this.init();
    },
    methods: {
        async init(){
            this.xxjj = _.find(this.bgdInfo.bgdItemlist,{"bm":"学校简介"})?_.find(this.bgdInfo.bgdItemlist,{"bm":"学校简介"}).fy:'';
            this.zysx = _.find(this.bgdInfo.bgdItemlist,{"bm":"注意事项"})?_.find(this.bgdInfo.bgdItemlist,{"bm":"注意事项"}).fy:'';
            this.xxjj = this.replaceAllNr(this.xxjj);
            this.zysx = this.replaceAllNr(this.zysx);
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
.backcover{
    background: url('/static/report/high/backcover_bg.jpg') no-repeat;
    background-size:100% 100%;
    .reportTit{
        position: absolute;
        width: 80%;
        top: 130px;
        left: 32px;
        font-size: 28px;
        font-weight: bold;
        color: #005525;
    }
    .reportTit_2{
        position: absolute;
        width: 80%;
        top: 1040px;
        left: 32px;
        font-size: 28px;
        font-weight: bold;
        color: #005525;
    }
    .infoMain,.infoMain_2{
        position: absolute;
        width: 935px;
        height: 465px;
        font-size: 15px;
        line-height: 28px;
        border-radius: 30px;
        padding:20px 30px;
        /deep/ p{
            text-indent: 2em;
            margin: 10px 0;
        }
    }
    .infoMain{
        top: 185px;
        left: 32px;
        height: 800px;
    }
    .infoMain_2{
        top: 1100px;
        left: 32px;
        height:150px;
    }
}
</style>
